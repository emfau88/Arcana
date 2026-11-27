import { World, type WorldScene } from '../ui/World.tsx';
import { Component, lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { activeBack } from '../domain/cardbacks.ts';
import { journeyDays } from '../domain/progress.ts';
import { ArchetypeReveal, Questionnaire, Welcome } from '../features/onboarding/Onboarding.tsx';
import { CardDetail, DayDetail, ReadingDetail } from '../features/grimoire/Grimoire.tsx';
import { Oracle } from '../features/oracle/Oracle.tsx';
import { Today } from '../features/today/Today.tsx';
import { onHardwareBack } from '../platform/native.ts';
import { Sigil } from '../ui/Sigil.tsx';
import { CardBackContext } from '../ui/OracleCard.tsx';
import { TabBar } from '../ui/TabBar.tsx';
import { useMotionClass } from './motion.ts';
import { goBack, navigate, useRoute, type ParsedRoute, type Route } from './router.ts';
import { factsOf, useApp } from './store.tsx';

const FLOW_ROUTES = new Set(['welcome', 'onboarding', 'archetype']);

/*
 * Screens away from the first path (V04 step limit: start JS ≤ +8 KB per package) load as their
 * own chunks. They are fetched once the app is idle, so they are ready offline afterwards; inside
 * the Android app they are local files anyway.
 */
const loadIdentity = () => import('../features/identity/Identity.tsx');
const loadJourney = () => import('../features/journey/JourneyScreens.tsx');
const loadProfile = () => import('../features/profile/Profile.tsx');
const loadShare = () => import('../features/share/SharePreview.tsx');
const loadBook = () => import('../features/grimoire/Book.tsx');
const WhyScreen = lazy(() => loadIdentity().then((m) => ({ default: m.WhyScreen })));
const ArchetypeLibrary = lazy(() => loadIdentity().then((m) => ({ default: m.ArchetypeLibrary })));
const ArchetypeDetail = lazy(() => loadIdentity().then((m) => ({ default: m.ArchetypeDetail })));
const JourneyPage = lazy(() => loadJourney().then((m) => ({ default: m.JourneyPage })));
const ReviewDetail = lazy(() => loadJourney().then((m) => ({ default: m.ReviewDetail })));
const ChapterDetail = lazy(() => loadJourney().then((m) => ({ default: m.ChapterDetail })));
const Profile = lazy(() => loadProfile().then((m) => ({ default: m.Profile })));
const Settings = lazy(() => loadProfile().then((m) => ({ default: m.Settings })));
const SharePreview = lazy(() => loadShare().then((m) => ({ default: m.SharePreview })));
const Book = lazy(() => loadBook().then((m) => ({ default: m.Book })));
const BookChapter = lazy(() => loadBook().then((m) => ({ default: m.BookChapter })));

/** `texts` loads content modules the first path needs later (the reveal after the questions). */
function prefetchScreens(texts: () => Promise<unknown>): () => void {
  const go = () => void Promise.all([loadIdentity(), loadJourney(), loadProfile(), loadShare(), loadBook(), texts()]).catch(() => undefined);
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(go, { timeout: 4000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(go, 1500);
  return () => window.clearTimeout(id);
}

/** A lazy screen moves focus to its heading once it is there (same rule as App for loaded screens). */
function FocusHeading({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (enabled) document.querySelector<HTMLElement>('#main h1[tabindex="-1"]')?.focus({ preventScroll: true });
  }, [enabled]);
  return null;
}

/** A screen chunk that cannot be loaded (offline before the prefetch) shows the content error. */
class ScreenBoundary extends Component<{ title: string; body: string; action: string; children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="screen screen--center">
        <div className="empty">
          <h1 className="display h2" tabIndex={-1}>
            {this.props.title}
          </h1>
          <p className="muted">{this.props.body}</p>
          <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
            {this.props.action}
          </button>
        </div>
      </div>
    );
  }
}

/** Painted world behind each screen (V04.6: A06 welcome, A05 reveal and "Ich", A19 star map). */
function sceneOf(route: Route): WorldScene {
  switch (route.name) {
    case 'today':
    case 'notfound':
      return 'today';
    case 'welcome':
    case 'onboarding':
      return 'welcome';
    case 'archetype':
    case 'profile':
      return 'profile';
    case 'why':
    case 'share':
      // Sub-pages of "Ich": the same room, dimmed like the calm screens (long text, lists).
      return 'profile-calm';
    case 'journey':
    case 'review':
    case 'chapter':
      return 'starmap';
    case 'grimoire':
    case 'bookChapter':
    case 'card':
    case 'day':
    case 'reading':
      // B3 (V05.3): the book lies in the grimoire library (A04), dimmed for its long pages.
      return 'grimoire';
    default:
      return 'calm';
  }
}

export function App() {
  const { state, t, actions } = useApp();
  const parsed = useRoute();
  const mainRef = useRef<HTMLElement>(null);
  const parsedRef = useRef<ParsedRoute>(parsed);
  const firstRoute = useRef(true);
  const [initialPath] = useState(parsed.path);
  useMotionClass();
  const { dailies, readings, journal, events } = state;
  const back = useMemo(
    () => activeBack(state.settings.cardBack, journeyDays(factsOf({ dailies, readings, journal, events }))),
    [state.settings.cardBack, dailies, readings, journal, events],
  );

  // The archetype texts (reveal sentence, second voice) come along, so the reveal is complete offline too.
  useEffect(() => prefetchScreens(() => actions.loadModules(['archetypes'])), [actions]);

  useEffect(() => {
    parsedRef.current = parsed;
  }, [parsed]);

  useEffect(() => {
    document.documentElement.lang = state.settings.locale;
    document.title = `${t.common.appName} · ${t.common.appSubtitle}`;
  }, [state.settings.locale, t]);

  // Route guards: first run goes through the welcome; finished onboarding opens on Today.
  useEffect(() => {
    if (state.status !== 'ready') return;
    const name = parsed.route.name;
    if (!state.settings.onboardingDone && !FLOW_ROUTES.has(name)) navigate('/welcome', { replace: true });
    else if (state.settings.onboardingDone && name === 'welcome') navigate('/today', { replace: true });
  }, [state.status, state.settings.onboardingDone, parsed.route.name]);

  // Android back gesture / button follows the same rules as the in-app back links.
  useEffect(() => onHardwareBack(() => goBack(parsedRef.current)), []);

  // New screen: start at the top and move focus to its heading for screen readers.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    const heading = mainRef.current?.querySelector<HTMLElement>('h1[tabindex="-1"]');
    heading?.focus({ preventScroll: true });
  }, [parsed.path]);

  if (state.status === 'loading') {
    return (
      <div className="stage stage--no-nav">
        <main className="stage__main loading" aria-busy="true">
          <Sigil archetype={null} size={96} className="loading__sigil" />
          <p className="small">{t.common.loading}</p>
        </main>
      </div>
    );
  }

  if (state.status === 'stale') {
    return (
      <div className="stage stage--no-nav">
        <main className="stage__main">
          <div className="screen screen--center">
            <div className="empty">
              <h1 className="display h2">{t.errors.staleTitle}</h1>
              <p className="muted">{t.errors.staleBody}</p>
              <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
                {t.common.reload}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="stage stage--no-nav">
        <main className="stage__main">
          <div className="screen screen--center">
            <div className="empty">
              <h1 className="display h2">{state.errorKind === 'content' ? t.errors.contentTitle : t.errors.storageTitle}</h1>
              <p className="muted">{state.errorKind === 'content' ? t.errors.contentBody : t.errors.storageBody}</p>
              <button type="button" className="btn btn--primary" onClick={actions.retryOpen}>
                {t.common.retry}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const { route } = parsed;
  const showNav = !FLOW_ROUTES.has(route.name) && state.settings.onboardingDone;

  let screen: ReactNode;
  switch (route.name) {
    case 'welcome':
      screen = <Welcome />;
      break;
    case 'onboarding':
      screen = <Questionnaire key={route.step} step={route.step} />;
      break;
    case 'archetype':
      screen = <ArchetypeReveal parsed={parsed} />;
      break;
    case 'today':
      screen = <Today />;
      break;
    case 'oracle':
      screen = <Oracle />;
      break;
    case 'grimoire':
      screen = <Book />;
      break;
    case 'bookChapter':
      screen = <BookChapter key={route.chapter} chapter={route.chapter} parsed={parsed} />;
      break;
    case 'card':
      screen = <CardDetail key={route.id} id={route.id} parsed={parsed} />;
      break;
    case 'day':
      screen = <DayDetail key={route.dateKey} dateKey={route.dateKey} parsed={parsed} />;
      break;
    case 'reading':
      screen = <ReadingDetail key={route.id} id={route.id} parsed={parsed} />;
      break;
    case 'why':
      screen = <WhyScreen parsed={parsed} />;
      break;
    case 'profile':
      screen = <Profile />;
      break;
    case 'settings':
      screen = <Settings parsed={parsed} />;
      break;
    case 'archetypes':
      screen = <ArchetypeLibrary parsed={parsed} />;
      break;
    case 'archetypeDetail':
      screen = <ArchetypeDetail key={route.id} id={route.id} parsed={parsed} />;
      break;
    case 'journey':
      screen = <JourneyPage parsed={parsed} />;
      break;
    case 'review':
      screen = <ReviewDetail key={`${route.kind}-${route.index}`} kind={route.kind} index={route.index} parsed={parsed} />;
      break;
    case 'chapter':
      screen = <ChapterDetail key={route.id} id={route.id} parsed={parsed} />;
      break;
    case 'share':
      screen = <SharePreview key={route.id} id={route.id} parsed={parsed} />;
      break;
    case 'notfound':
      screen = <Today />;
      break;
  }

  const scene = sceneOf(route);
  return (
    <>
      <div className={`stage stage--scene-${scene} ${showNav ? '' : 'stage--no-nav'}`}>
        <World scene={scene} />
        <main ref={mainRef} className="stage__main" id="main">
          <ScreenBoundary key={route.name} title={t.errors.contentTitle} body={t.errors.contentBody} action={t.common.reload}>
            <CardBackContext.Provider value={back}>
              <Suspense fallback={<div className="screen" aria-busy="true" />}>
                {screen}
                <FocusHeading enabled={parsed.path !== initialPath} />
              </Suspense>
            </CardBackContext.Provider>
          </ScreenBoundary>
        </main>
        {showNav ? <TabBar route={route} /> : null}
      </div>
      <p className="world__caption" aria-hidden="true">
        {t.common.appName}
      </p>
    </>
  );
}
