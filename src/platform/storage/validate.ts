import { isValidDateKey } from '../../domain/clock.ts';
import {
  ACTIVITY_TYPES,
  ALL_THEME_IDS,
  ARCHETYPE_ORDER,
  FAVORITE_KINDS,
  JOURNAL_KINDS,
  LOCALES,
  type ActivityEvent,
  type DailyRecord,
  type EntitlementCache,
  type Favorite,
  type JournalEntry,
  type PersonalData,
  type Profile,
  type Reading,
  type ReadingDraft,
  type SeenFlag,
  type Settings,
} from '../../domain/types.ts';

/** Minimal structural guards. Invalid records are skipped and reported, never auto-deleted. */

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isTheme = (v: unknown) => isStr(v) && (ALL_THEME_IDS as readonly string[]).includes(v);
const isLocale = (v: unknown) => isStr(v) && (LOCALES as readonly string[]).includes(v);
const isArchetypeOrNull = (v: unknown) => v === null || (isStr(v) && (ARCHETYPE_ORDER as readonly string[]).includes(v));
/** Distinct cards of a reading: three in the classic spread, two to seven in the spreads of V05.2. */
const isCardList = (v: unknown): v is string[] => Array.isArray(v) && v.length >= 2 && v.length <= 7 && v.every(isStr) && new Set(v).size === v.length;
const isOptStr = (v: unknown) => v === undefined || isStr(v);

export function isSettings(v: unknown): v is Settings {
  return isObj(v) && isLocale(v.locale) && ['system', 'reduced', 'full'].includes(v.motion as string) && typeof v.onboardingDone === 'boolean';
}

/** Settings with the optional card back checked on its own: a broken choice is dropped (standard back). */
export function normalizeSettings(v: unknown): Settings | null {
  if (!isSettings(v)) return null;
  if (v.cardBack === undefined || isStr(v.cardBack)) return v;
  const s: Record<string, unknown> = { ...v };
  delete s.cardBack;
  return s as unknown as Settings;
}

/**
 * Profile with the optional V04 fields checked one by one: a broken optional field is dropped
 * (the field is then "not determined"), the profile itself stays. Only a broken base makes it null.
 */
export function normalizeProfile(v: unknown): Profile | null {
  if (!isProfile(v)) return null;
  const p: Record<string, unknown> = { ...v };
  if (p.secondaryArchetypeId !== undefined && !isArchetypeOrNull(p.secondaryArchetypeId)) delete p.secondaryArchetypeId;
  if (
    p.scores !== undefined &&
    !(isObj(p.scores) && ARCHETYPE_ORDER.every((id) => Number.isFinite((p.scores as Obj)[id])) && Object.keys(p.scores).length === ARCHETYPE_ORDER.length)
  ) {
    delete p.scores;
  }
  if (p.questionnaireVersion !== undefined && !(Number.isInteger(p.questionnaireVersion) && (p.questionnaireVersion as number) >= 1)) delete p.questionnaireVersion;
  return p as unknown as Profile;
}

export function isProfile(v: unknown): v is Profile {
  return (
    isObj(v) &&
    isObj(v.answers) &&
    Object.values(v.answers).every(isStr) &&
    isTheme(v.themeId) &&
    isArchetypeOrNull(v.archetypeId) &&
    (v.archetypeSource === undefined || v.archetypeSource === 'questions' || v.archetypeSource === 'manual') &&
    typeof v.profileVersion === 'number' &&
    isStr(v.updatedAt)
  );
}

export function isDailyRecord(v: unknown): v is DailyRecord {
  return (
    isObj(v) &&
    isStr(v.dateKey) &&
    isValidDateKey(v.dateKey) &&
    isStr(v.cardId) &&
    isStr(v.deckId) &&
    isTheme(v.themeId) &&
    isArchetypeOrNull(v.archetypeId) &&
    isLocale(v.locale) &&
    isStr(v.contentVersion) &&
    isObj(v.content) &&
    isStr(v.content.message) &&
    isStr(v.content.cardTitle) &&
    isStr(v.revealedAt) &&
    isStr(v.note) &&
    isOptStr(v.notedAt)
  );
}

export function isReading(v: unknown): v is Reading {
  return (
    isObj(v) &&
    isStr(v.id) &&
    isStr(v.deckId) &&
    isTheme(v.themeId) &&
    isCardList(v.cardIds) &&
    isOptStr(v.spreadId) &&
    isLocale(v.locale) &&
    isStr(v.contentVersion) &&
    isObj(v.content) &&
    Array.isArray(v.content.positions) &&
    v.content.positions.length === v.cardIds.length &&
    isStr(v.createdAt) &&
    (v.dateKey === undefined || (isStr(v.dateKey) && isValidDateKey(v.dateKey))) &&
    isStr(v.note) &&
    isOptStr(v.notedAt)
  );
}

export function isDraft(v: unknown): v is ReadingDraft {
  return (
    isObj(v) &&
    isStr(v.id) &&
    isStr(v.deckId) &&
    isTheme(v.themeId) &&
    isCardList(v.cardIds) &&
    isOptStr(v.spreadId) &&
    Array.isArray(v.revealed) &&
    v.revealed.length === v.cardIds.length &&
    v.revealed.every((b) => typeof b === 'boolean') &&
    isStr(v.createdAt)
  );
}

/* ------------------------------------------------------------------ Schema v2 (V03.1)
 * Normalisers: return the record with defaults for missing optional fields, or null when it is
 * unreadable. Unknown extra fields are kept, so a record written later stays intact.
 */

const isDateKey = (v: unknown): v is string => isStr(v) && isValidDateKey(v);
const isOneOf = <T extends string>(list: readonly T[], v: unknown): v is T => isStr(v) && (list as readonly string[]).includes(v);
const nonEmpty = (v: unknown): v is string => isStr(v) && v.length > 0;

export function normalizePersonal(v: unknown): PersonalData | null {
  if (!isObj(v) || !isStr(v.savedAt)) return null;
  if (v.birthDate !== undefined && !isDateKey(v.birthDate)) return null;
  return v as unknown as PersonalData;
}

export function normalizeJournalEntry(v: unknown): JournalEntry | null {
  if (!isObj(v) || !nonEmpty(v.id) || !isOneOf(JOURNAL_KINDS, v.kind) || !isDateKey(v.dateKey) || !isStr(v.createdAt)) return null;
  if (v.text !== undefined && !isStr(v.text)) return null;
  if (v.refs !== undefined && !isObj(v.refs)) return null;
  if (v.updatedAt !== undefined && !isStr(v.updatedAt)) return null;
  if (!isOptStr(v.deletedAt)) return null;
  return { ...v, text: v.text ?? '', refs: v.refs ?? {}, updatedAt: v.updatedAt ?? v.createdAt } as unknown as JournalEntry;
}

export function normalizeEvent(v: unknown): ActivityEvent | null {
  if (!isObj(v) || !nonEmpty(v.id) || !isOneOf(ACTIVITY_TYPES, v.type) || !isDateKey(v.dateKey) || !isStr(v.at)) return null;
  if (v.refs !== undefined && !isObj(v.refs)) return null;
  return { ...v, refs: v.refs ?? {} } as unknown as ActivityEvent;
}

export function normalizeFavorite(v: unknown): Favorite | null {
  if (!isObj(v) || !isOneOf(FAVORITE_KINDS, v.kind) || !nonEmpty(v.id) || !isStr(v.createdAt)) return null;
  const key = `${v.kind}:${v.id}`;
  if (v.key !== undefined && v.key !== key) return null;
  return { ...v, key } as unknown as Favorite;
}

export function normalizeSeen(v: unknown): SeenFlag | null {
  if (!isObj(v) || !nonEmpty(v.key) || !isStr(v.seenAt)) return null;
  return v as unknown as SeenFlag;
}

export function normalizeEntitlements(v: unknown): EntitlementCache | null {
  if (!isObj(v) || !Array.isArray(v.rights) || !v.rights.every(isStr) || !isStr(v.checkedAt)) return null;
  return v as unknown as EntitlementCache;
}
