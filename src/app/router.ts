import { useSyncExternalStore } from 'react';

/**
 * Hash routing: works on any static host, under the Vite preview and inside the
 * Capacitor WebView without server rewrites. Tabs replace history; details push.
 */
export type Route =
  | { name: 'welcome' }
  | { name: 'onboarding'; step: number }
  | { name: 'archetype' }
  | { name: 'today' }
  | { name: 'oracle' }
  | { name: 'grimoire'; view: 'collection' | 'history' }
  | { name: 'card'; id: string }
  | { name: 'day'; dateKey: string }
  | { name: 'reading'; id: string }
  | { name: 'profile' }
  | { name: 'notfound'; path: string };

export interface ParsedRoute {
  route: Route;
  from: string | null;
  path: string;
}

export function parsePath(rawPath: string): ParsedRoute {
  const [pathPart = '', query = ''] = rawPath.replace(/^#/, '').split('?');
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  const from = new URLSearchParams(query).get('from');
  const seg = path.split('/').filter(Boolean).map(decodeURIComponent);
  const route = ((): Route => {
    switch (seg[0]) {
      case undefined:
        return { name: 'today' };
      case 'welcome':
        return { name: 'welcome' };
      case 'onboarding': {
        const step = Number(seg[1] ?? '1');
        return Number.isInteger(step) && step >= 1 ? { name: 'onboarding', step } : { name: 'notfound', path };
      }
      case 'archetype':
        return { name: 'archetype' };
      case 'today':
        return { name: 'today' };
      case 'oracle':
        return { name: 'oracle' };
      case 'grimoire':
        if (seg[1] === 'card' && seg[2]) return { name: 'card', id: seg[2] };
        if (seg[1] === 'day' && seg[2]) return { name: 'day', dateKey: seg[2] };
        if (seg[1] === 'reading' && seg[2]) return { name: 'reading', id: seg[2] };
        if (seg[1] === 'history') return { name: 'grimoire', view: 'history' };
        if (seg[1] === undefined) return { name: 'grimoire', view: 'collection' };
        return { name: 'notfound', path };
      case 'profile':
        return { name: 'profile' };
      default:
        return { name: 'notfound', path };
    }
  })();
  return { route, from, path };
}

const ALLOWED_FROM = new Set(['/today', '/oracle', '/grimoire', '/grimoire/history', '/profile']);

/**
 * Where "back" leads from a route (Android back gesture and the in-app back link share this).
 * 'exit' means leave the app (Android) – the browser simply stays.
 */
export function backTarget(parsed: ParsedRoute): string | 'exit' {
  const { route, from } = parsed;
  const safeFrom = from && ALLOWED_FROM.has(from) ? from : null;
  switch (route.name) {
    case 'welcome':
    case 'today':
      return 'exit';
    case 'onboarding':
      return route.step > 1 ? `/onboarding/${route.step - 1}` : '/welcome';
    case 'archetype':
      return '/today';
    case 'oracle':
    case 'profile':
    case 'notfound':
      return '/today';
    case 'grimoire':
      return route.view === 'history' ? '/grimoire' : '/today';
    case 'card':
      return safeFrom ?? '/grimoire';
    case 'day':
    case 'reading':
      return safeFrom ?? '/grimoire/history';
  }
}

function currentHash(): string {
  return window.location.hash || '#/';
}

function subscribe(cb: () => void): () => void {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}

export function useRoute(): ParsedRoute {
  const hash = useSyncExternalStore(subscribe, currentHash, () => '#/');
  return parseRoute(hash);
}

let cache: { hash: string; parsed: ParsedRoute } | null = null;
function parseRoute(hash: string): ParsedRoute {
  if (cache?.hash === hash) return cache.parsed;
  const parsed = parsePath(hash);
  cache = { hash, parsed };
  return parsed;
}

export function navigate(path: string, options: { replace?: boolean } = {}): void {
  const target = `#${path}`;
  if (window.location.hash === target) return;
  if (options.replace) {
    history.replaceState(history.state, '', target);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = path;
  }
}

export function goBack(parsed: ParsedRoute): 'handled' | 'exit' {
  const target = backTarget(parsed);
  if (target === 'exit') return 'exit';
  navigate(target, { replace: true });
  return 'handled';
}
