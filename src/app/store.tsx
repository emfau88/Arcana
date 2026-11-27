import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import { CONTENT } from '../content/index.ts';
import { deepCard } from '../content/modules/cards-deep-keys.ts';
import { loadModules, ModuleLoadError, STARTUP_MODULES, text, type LoadedModules, type ModuleId } from '../content/modules/registry.ts';
import type { ContentPack } from '../content/schema.ts';
import { PROFILE_VERSION, QUESTIONNAIRE_VERSION, scoreArchetype } from '../domain/archetypes.ts';
import { localDateKey, msUntilNextLocalDay, systemClock, type Clock } from '../domain/clock.ts';
import {
  createDailyRecord,
  createDraft,
  finalizeReading,
  previousDailyCard,
  revealAll,
  revealPosition,
} from '../domain/oracle.ts';
import { lensKey } from '../domain/lens.ts';
import { cardEncounters, journeyDayToday } from '../domain/progress.ts';
import { cryptoRng, type Rng } from '../domain/random.ts';
import type {
  Answers,
  ArchetypeId,
  DailyRecord,
  Locale,
  MotionPreference,
  Profile,
  Reading,
  ReadingDraft,
  SeenFlag,
  Settings,
  ThemeId,
} from '../domain/types.ts';
import { detectLocale, MESSAGES, type Messages } from '../i18n/index.ts';
import { onResume } from '../platform/native.ts';
import { CoreOnlyProvider, type EntitlementProvider, type Right } from '../domain/entitlements.ts';
import { IndexedDbRepository } from '../platform/storage/indexeddb.ts';
import type { StorageRepository } from '../platform/storage/repository.ts';

export interface AppState {
  /** 'stale' = a newer version of the app took over the database in another tab. */
  status: 'loading' | 'ready' | 'error' | 'stale';
  settings: Settings;
  profile: Profile | null;
  dailies: DailyRecord[];
  readings: Reading[];
  draft: ReadingDraft | null;
  /** Gesehen-Markierungen (e.g. a dismissed offer). Facts only, never counters. */
  seen: SeenFlag[];
  skippedCorrupt: number;
  /** Why the start failed: the local database or the texts of a content module. */
  errorKind: 'storage' | 'content';
  /** Lazy content modules of the current locale (startup set, see content/modules). */
  modules: LoadedModules;
  todayKey: string;
  /** In-memory answers while the questionnaire is open (not persisted until finished). */
  pendingAnswers: Answers;
  pendingTheme: ThemeId | null;
}

type Action =
  | { type: 'loaded'; state: Partial<AppState> }
  | { type: 'error'; kind: 'storage' | 'content' }
  | { type: 'stale' }
  | { type: 'settings'; settings: Settings; modules?: LoadedModules }
  | { type: 'modules'; modules: LoadedModules; locale: Locale }
  | { type: 'profile'; profile: Profile }
  | { type: 'daily'; record: DailyRecord }
  | { type: 'draft'; draft: ReadingDraft | null }
  | { type: 'reading'; reading: Reading }
  | { type: 'seen'; flag: SeenFlag }
  | { type: 'today'; key: string }
  | { type: 'pending'; answers: Answers; theme: ThemeId | null }
  | { type: 'cleared'; settings: Settings; modules: LoadedModules };

function upsert<T>(list: T[], item: T, same: (a: T) => boolean): T[] {
  const i = list.findIndex(same);
  if (i === -1) return [...list, item];
  const next = list.slice();
  next[i] = item;
  return next;
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'loaded':
      return { ...state, ...action.state, status: 'ready' };
    case 'error':
      return { ...state, status: 'error', errorKind: action.kind };
    case 'stale':
      return { ...state, status: 'stale' };
    case 'settings':
      return { ...state, settings: action.settings, modules: action.modules ?? state.modules };
    case 'modules':
      // A late background load must not overwrite the texts of a language switched to meanwhile.
      return action.locale === state.settings.locale ? { ...state, modules: { ...state.modules, ...action.modules } } : state;
    case 'profile':
      return { ...state, profile: action.profile };
    case 'daily':
      return { ...state, dailies: upsert(state.dailies, action.record, (d) => d.dateKey === action.record.dateKey) };
    case 'draft':
      return { ...state, draft: action.draft };
    case 'reading':
      return { ...state, readings: upsert(state.readings, action.reading, (r) => r.id === action.reading.id) };
    case 'seen':
      return { ...state, seen: upsert(state.seen, action.flag, (s) => s.key === action.flag.key) };
    case 'today':
      return state.todayKey === action.key ? state : { ...state, todayKey: action.key };
    case 'pending':
      return { ...state, pendingAnswers: action.answers, pendingTheme: action.theme };
    case 'cleared':
      return {
        ...state,
        settings: action.settings,
        modules: action.modules,
        profile: null,
        dailies: [],
        readings: [],
        draft: null,
        seen: [],
        skippedCorrupt: 0,
        pendingAnswers: {},
        pendingTheme: null,
      };
  }
}

export interface AppActions {
  retryOpen(): void;
  /** Loads the startup content modules of the current locale if they are missing (rejects offline). */
  ensureModules(): Promise<void>;
  /** Loads further content modules of the current locale on demand (screens that need them). */
  loadModules(ids: readonly ModuleId[]): Promise<void>;
  setPending(answers: Answers, theme: ThemeId | null): void;
  completeOnboarding(answers: Answers, themeId: ThemeId): Promise<Profile>;
  skipOnboarding(): Promise<void>;
  setTheme(themeId: ThemeId): Promise<void>;
  /** Manual correction: pick an archetype or leave the profile open (null). Answers stay stored. */
  setArchetype(archetypeId: ArchetypeId | null): Promise<void>;
  setLocale(locale: Locale): Promise<void>;
  setMotion(motion: MotionPreference): Promise<void>;
  revealToday(): Promise<DailyRecord>;
  startReading(themeId: ThemeId): Promise<ReadingDraft>;
  revealReadingCard(index: 0 | 1 | 2): Promise<void>;
  revealAllReading(): Promise<void>;
  saveReading(): Promise<Reading>;
  discardReading(): Promise<void>;
  updateDailyNote(dateKey: string, note: string): Promise<void>;
  updateReadingNote(id: string, note: string): Promise<void>;
  clearAllData(): Promise<void>;
  /** Records that something was seen or dismissed (idempotent, the first time wins). */
  markSeen(key: string): Promise<void>;
}

interface AppContextValue {
  state: AppState;
  actions: AppActions;
  pack: ContentPack;
  t: Messages;
  /** Text from a lazy content module of the current locale. */
  tx: (module: ModuleId, key: string) => string;
  /** The only way the UI learns about rights (never the purchase state itself, D-48). */
  has: (right: Right) => boolean;
  today: DailyRecord | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export interface AppProviderProps {
  children: ReactNode;
  repo?: StorageRepository;
  clock?: Clock;
  rng?: Rng;
  pack?: ContentPack;
  /** Rights source. Default: the free core only (no billing). Tests pass a `TestProvider`. */
  entitlements?: EntitlementProvider;
}

function defaultSettings(): Settings {
  return { locale: detectLocale(), motion: 'system', onboardingDone: false };
}

export function AppProvider({ children, repo: repoProp, clock = systemClock, rng = cryptoRng, pack = CONTENT, entitlements = CoreOnlyProvider }: AppProviderProps) {
  const repo = useMemo(() => repoProp ?? new IndexedDbRepository(), [repoProp]);
  const [state, dispatch] = useReducer(reducer, undefined, (): AppState => ({
    status: 'loading',
    settings: defaultSettings(),
    profile: null,
    dailies: [],
    readings: [],
    draft: null,
    seen: [],
    skippedCorrupt: 0,
    errorKind: 'storage',
    modules: {},
    todayKey: localDateKey(clock.now()),
    pendingAnswers: {},
    pendingTheme: null,
  }));
  const stateRef = useRef(state);
  stateRef.current = state;
  const inflightDaily = useRef<Promise<DailyRecord> | null>(null);
  const busy = useRef(false);
  const [openAttempt, bumpOpen] = useReducer((n: number) => n + 1, 0);

  // Open storage and load everything once (and on explicit retry).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        repo.onVersionChange(() => dispatch({ type: 'stale' }));
        // Content modules for the likely locale load in parallel with the database.
        const guess = defaultSettings().locale;
        const early = loadModules(STARTUP_MODULES, guess);
        early.catch(() => undefined);
        await repo.open();
        const snap = await repo.loadAll();
        const settings = snap.settings ?? defaultSettings();
        const pending = settings.locale === guess ? early : loadModules(STARTUP_MODULES, settings.locale);
        // B-08: returning people start on "Heute", which needs no module text. They see it at once
        // and the texts arrive in the background. A first start (questionnaire) waits for them.
        let modules: LoadedModules = {};
        if (snap.profile) {
          pending.then(
            (m) => {
              if (!cancelled) dispatch({ type: 'modules', modules: m, locale: settings.locale });
            },
            () => undefined, // loaded again on demand (ensureModules)
          );
        } else {
          modules = await pending;
        }
        if (cancelled) return;
        dispatch({
          type: 'loaded',
          state: {
            modules,
            settings,
            profile: snap.profile,
            dailies: snap.dailies,
            readings: snap.readings,
            draft: snap.draft,
            seen: snap.seen,
            skippedCorrupt: snap.skippedCorrupt,
            todayKey: localDateKey(clock.now()),
          },
        });
      } catch (e) {
        if (!cancelled) dispatch({ type: 'error', kind: e instanceof ModuleLoadError ? 'content' : 'storage' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [repo, clock, openAttempt]);

  // Keep "today" correct across midnight and when the app returns from the background.
  useEffect(() => {
    const refresh = () => dispatch({ type: 'today', key: localDateKey(clock.now()) });
    let timer = window.setTimeout(function tick() {
      refresh();
      timer = window.setTimeout(tick, msUntilNextLocalDay(clock.now()));
    }, msUntilNextLocalDay(clock.now()));
    const off = onResume(refresh);
    return () => {
      window.clearTimeout(timer);
      off();
    };
  }, [clock]);

  const persistSettings = useCallback(
    async (next: Settings) => {
      await repo.putSettings(next);
      dispatch({ type: 'settings', settings: next });
    },
    [repo],
  );

  const actions = useMemo<AppActions>(
    () => ({
      retryOpen: () => bumpOpen(),
      async ensureModules() {
        const locale = stateRef.current.settings.locale;
        if (STARTUP_MODULES.every((id) => stateRef.current.modules[id])) return;
        dispatch({ type: 'modules', modules: await loadModules(STARTUP_MODULES, locale), locale });
      },
      async loadModules(ids) {
        const locale = stateRef.current.settings.locale;
        const missing = ids.filter((id) => !stateRef.current.modules[id]);
        if (missing.length === 0) return;
        dispatch({ type: 'modules', modules: await loadModules(missing, locale), locale });
      },
      setPending: (answers, theme) => dispatch({ type: 'pending', answers, theme }),

      async completeOnboarding(answers, themeId) {
        const result = scoreArchetype(pack.questions, answers);
        const profile: Profile = {
          answers,
          themeId,
          archetypeId: result.archetypeId,
          archetypeSource: 'questions',
          secondaryArchetypeId: result.complementId,
          scores: result.scores,
          questionnaireVersion: QUESTIONNAIRE_VERSION,
          profileVersion: PROFILE_VERSION,
          updatedAt: clock.now().toISOString(),
        };
        await repo.putProfile(profile);
        dispatch({ type: 'profile', profile });
        const s = stateRef.current.settings;
        if (!s.onboardingDone) await persistSettings({ ...s, onboardingDone: true });
        dispatch({ type: 'pending', answers: {}, theme: null });
        return profile;
      },

      async skipOnboarding() {
        const existing = stateRef.current.profile;
        const profile: Profile = existing ?? {
          answers: {},
          themeId: pack.defaultTheme,
          archetypeId: null,
          profileVersion: PROFILE_VERSION,
          updatedAt: clock.now().toISOString(),
        };
        if (!existing) {
          await repo.putProfile(profile);
          dispatch({ type: 'profile', profile });
        }
        await persistSettings({ ...stateRef.current.settings, onboardingDone: true });
      },

      async setTheme(themeId) {
        const p = stateRef.current.profile;
        const profile: Profile = p
          ? { ...p, themeId, updatedAt: clock.now().toISOString() }
          : { answers: {}, themeId, archetypeId: null, profileVersion: PROFILE_VERSION, updatedAt: clock.now().toISOString() };
        await repo.putProfile(profile);
        dispatch({ type: 'profile', profile });
      },

      async setArchetype(archetypeId) {
        const p = stateRef.current.profile;
        const now = clock.now().toISOString();
        // A complement from the questionnaire stays, unless it would now equal the main archetype
        // or the profile is left open (then there is no "second" voice).
        const secondary =
          p?.secondaryArchetypeId === undefined ? {} : { secondaryArchetypeId: archetypeId !== null && p.secondaryArchetypeId !== archetypeId ? p.secondaryArchetypeId : null };
        const profile: Profile = p
          ? { ...p, archetypeId, archetypeSource: 'manual', ...secondary, updatedAt: now }
          : { answers: {}, themeId: pack.defaultTheme, archetypeId, archetypeSource: 'manual', profileVersion: PROFILE_VERSION, updatedAt: now };
        await repo.putProfile(profile);
        dispatch({ type: 'profile', profile });
      },

      async setLocale(locale) {
        // Texts of the new language first, so the switch never shows missing texts.
        const modules = await loadModules(STARTUP_MODULES, locale);
        const next = { ...stateRef.current.settings, locale };
        await repo.putSettings(next);
        dispatch({ type: 'settings', settings: next, modules });
      },
      setMotion: (motion) => persistSettings({ ...stateRef.current.settings, motion }),

      revealToday() {
        if (inflightDaily.current) return inflightDaily.current;
        const run = (async () => {
          const key = localDateKey(clock.now());
          const known = stateRef.current.dailies.find((d) => d.dateKey === key);
          if (known) return known;
          // A4: reflections 2–3 and ritual 2 live in cards-deep. If it cannot load, the core texts stay.
          const locale = stateRef.current.settings.locale;
          let loaded = stateRef.current.modules['cards-deep'];
          if (!loaded) {
            try {
              const m = await loadModules(['cards-deep'], locale);
              loaded = m['cards-deep'];
              dispatch({ type: 'modules', modules: m, locale });
            } catch {
              /* variant 0 */
            }
          }
          const s = stateRef.current;
          const existing = s.dailies.find((d) => d.dateKey === key);
          if (existing) return existing;
          // The deep texts must be in the language of the record (a switch during loading drops them).
          const deep = s.settings.locale === locale ? loaded : undefined;
          const facts = { dailies: s.dailies, readings: s.readings };
          const record = createDailyRecord({
            pack,
            clock,
            rng,
            themeId: s.profile?.themeId ?? pack.defaultTheme,
            archetypeId: s.profile?.archetypeId ?? null,
            locale: s.settings.locale,
            previousCardId: previousDailyCard(s.dailies, key),
            lens: {
              journeyDay: journeyDayToday(facts, key),
              complementId: s.profile?.secondaryArchetypeId ?? null,
              text: (archetypeId, cardId) => s.modules.identity?.[lensKey(archetypeId, cardId)],
            },
            variety: {
              encounters: (cardId) => cardEncounters(facts).get(cardId)?.days.size ?? 0,
              deep: (cardId) => deepCard(deep, cardId),
            },
          });
          const stored = await repo.addDailyIfAbsent(record);
          dispatch({ type: 'daily', record: stored });
          dispatch({ type: 'today', key: stored.dateKey });
          return stored;
        })();
        inflightDaily.current = run;
        void run.finally(() => {
          inflightDaily.current = null;
        });
        return run;
      },

      async startReading(themeId) {
        const existing = stateRef.current.draft;
        if (existing) return existing; // never silently replace an unfinished reading
        if (busy.current) throw new Error('busy');
        busy.current = true;
        try {
          const draft = createDraft(pack, themeId, clock, rng);
          await repo.putDraft(draft);
          dispatch({ type: 'draft', draft });
          return draft;
        } finally {
          busy.current = false;
        }
      },

      async revealReadingCard(index) {
        const d = stateRef.current.draft;
        if (!d || d.revealed[index]) return;
        const next = revealPosition(d, index);
        await repo.putDraft(next);
        dispatch({ type: 'draft', draft: next });
      },

      async revealAllReading() {
        const d = stateRef.current.draft;
        if (!d) return;
        const next = revealAll(d);
        if (next === d) return;
        await repo.putDraft(next);
        dispatch({ type: 'draft', draft: next });
      },

      async saveReading() {
        const d = stateRef.current.draft;
        if (!d) throw new Error('No reading to save');
        const reading = finalizeReading(pack, d, stateRef.current.settings.locale, clock);
        const stored = await repo.saveReading(reading);
        dispatch({ type: 'reading', reading: stored });
        dispatch({ type: 'draft', draft: null });
        return stored;
      },

      async discardReading() {
        await repo.deleteDraft();
        dispatch({ type: 'draft', draft: null });
      },

      async updateDailyNote(dateKey, note) {
        const record = await repo.updateDailyNote(dateKey, note);
        dispatch({ type: 'daily', record });
      },

      async updateReadingNote(id, note) {
        const reading = await repo.updateReadingNote(id, note);
        dispatch({ type: 'reading', reading });
      },

      async clearAllData() {
        await repo.clearAll();
        const settings = defaultSettings();
        const modules = settings.locale === stateRef.current.settings.locale ? stateRef.current.modules : await loadModules(STARTUP_MODULES, settings.locale);
        dispatch({ type: 'cleared', settings, modules });
      },

      async markSeen(key) {
        const flag = await repo.markSeen(key, clock.now().toISOString());
        dispatch({ type: 'seen', flag });
      },
    }),
    [repo, clock, rng, pack, persistSettings],
  );

  const t = MESSAGES[state.settings.locale];
  const today = state.dailies.find((d) => d.dateKey === state.todayKey) ?? null;
  const tx = useCallback((module: ModuleId, key: string) => text(state.modules, module, key), [state.modules]);
  const has = useCallback((right: Right) => entitlements.has(right), [entitlements]);
  const value = useMemo(() => ({ state, actions, pack, t, tx, has, today }), [state, actions, pack, t, tx, has, today]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp outside AppProvider');
  return ctx;
}
