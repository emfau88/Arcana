import type { MouseEvent } from 'react';
import { navigate, type Route } from '../app/router.ts';
import { useApp } from '../app/store.tsx';
import { IconGrimoire, IconOracle, IconProfile, IconToday } from './Icons.tsx';
import './tabbar.css';

type Tab = 'today' | 'oracle' | 'grimoire' | 'profile';

function activeTab(route: Route): Tab | null {
  switch (route.name) {
    case 'today':
      return 'today';
    case 'oracle':
      return 'oracle';
    case 'grimoire':
    case 'card':
    case 'day':
    case 'reading':
      return 'grimoire';
    case 'profile':
      return 'profile';
    default:
      return null;
  }
}

export function TabBar({ route }: { route: Route }) {
  const { t, state } = useApp();
  const current = activeTab(route);
  const tabs: { id: Tab; label: string; Icon: typeof IconToday; path: string; badge?: boolean }[] = [
    { id: 'today', label: t.nav.today, Icon: IconToday, path: '/today' },
    { id: 'oracle', label: t.nav.oracle, Icon: IconOracle, path: '/oracle', badge: state.draft !== null },
    { id: 'grimoire', label: t.nav.grimoire, Icon: IconGrimoire, path: '/grimoire' },
    { id: 'profile', label: t.nav.profile, Icon: IconProfile, path: '/profile' },
  ];
  const go = (e: MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path, { replace: true });
  };
  return (
    <nav className="tabbar" aria-label={t.nav.label}>
      <ul>
        {tabs.map(({ id, label, Icon, path, badge }) => (
          <li key={id}>
            <a
              href={`#${path}`}
              className="tabbar__item"
              aria-current={current === id ? 'page' : undefined}
              onClick={(e) => go(e, path)}
            >
              <span className="tabbar__icon">
                <Icon size={24} />
                {badge ? <span className="tabbar__badge" aria-hidden="true" /> : null}
              </span>
              <span className="tabbar__label">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
