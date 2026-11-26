import { World } from '../ui/World.tsx';
import { useEffect, useRef, type ReactNode } from 'react';
import { ArchetypeReveal, Questionnaire, Welcome } from '../features/onboarding/Onboarding.tsx';
import { CardDetail, DayDetail, Grimoire, ReadingDetail } from '../features/grimoire/Grimoire.tsx';
import { Oracle } from '../features/oracle/Oracle.tsx';
import { Profile } from '../features/profile/Profile.tsx';
import { Today } from '../features/today/Today.tsx';
import { onHardwareBack } from '../platform/native.ts';
import { Sigil } from '../ui/Sigil.tsx';
import { TabBar } from '../ui/TabBar.tsx';
import { useMotionClass } from './motion.ts';
import { goBack, navigate, useRoute, type ParsedRoute } from './router.ts';
import { useApp } from './store.tsx';

const FLOW_ROUTES = new Set(['welcome', 'onboarding', 'archetype']);

export function App() {
  const { state, t, actions } = useApp();
  const parsed = useRoute();
  const mainRef = useRef<HTMLElement>(null);
  const parsedRef = useRef<ParsedRoute>(parsed);
  const firstRoute = useRef(true);
  useMotionClass();

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

  if (state.status === 'error') {
    return (
      <div className="stage stage--no-nav">
        <main className="stage__main">
          <div className="screen screen--center">
            <div className="empty">
              <h1 className="display h2">{t.errors.storageTitle}</h1>
              <p className="muted">{t.errors.storageBody}</p>
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
      screen = <Grimoire view={route.view} />;
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
    case 'profile':
      screen = <Profile />;
      break;
    case 'notfound':
      screen = <Today />;
      break;
  }

  return (
    <>
      <div className={`stage ${showNav ? '' : 'stage--no-nav'}`}>
        <World scene={route.name === 'today' || route.name === 'notfound' ? 'today' : 'calm'} />
        <main ref={mainRef} className="stage__main" id="main">
          {screen}
        </main>
        {showNav ? <TabBar route={route} /> : null}
      </div>
      <p className="world__caption" aria-hidden="true">
        {t.common.appName}
      </p>
    </>
  );
}
