import { useSyncExternalStore } from 'react';

/**
 * Hash routing: works on any static host, under the Vite preview and inside the
 * Capacitor WebView without server rewrites. Tabs replace history; details push.
 */
export type Route =
  | { name: 'welcome' }
  | { name: 'onboarding'; step: number }
  | { name: 'archetype' }
  | { name: 'why' }
  | { name: 'today' }
  | { name: 'oracle' }
  /** The book (V05.3): cover and contents. */
  | { name: 'grimoire' }
  /** Chapters of the book with their own page here; archetypes and journey have theirs since V04. */
  | { name: 'bookChapter'; chapter: 'cards' | 'journal' | 'rituals' }
  | { name: 'card'; id: string }
  | { name: 'day'; dateKey: string }
  | { name: 'reading'; id: string }
  | { name: 'profile' }
  | { name: 'settings' }
  | { name: 'archetypes' }
  | { name: 'archetypeDetail'; id: string }
  | { name: 'journey' }
  | { name: 'review'; kind: 'week' | 'month'; index: number }
  | { name: 'chapter'; id: string }
  /** Archetype card; id '' = the person's own main archetype. */
  | { name: 'share'; template: 'archetype'; id: string }
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
      case 'reveal':
        if (seg[1] === 'why') return { name: 'why' };
        return seg[1] === undefined ? { name: 'archetype' } : { name: 'notfound', path };
      case 'today':
        return { name: 'today' };
      case 'oracle':
        return { name: 'oracle' };
      case 'grimoire':
        if (seg[1] === 'card' && seg[2]) return { name: 'card', id: seg[2] };
        if (seg[1] === 'day' && seg[2]) return { name: 'day', dateKey: seg[2] };
        if (seg[1] === 'reading' && seg[2]) return { name: 'reading', id: seg[2] };
        // V04 links to the history land in the journal, which now holds it (V05.3).
        if ((seg[1] === 'history' || seg[1] === 'journal') && seg[2] === undefined) return { name: 'bookChapter', chapter: 'journal' };
        if ((seg[1] === 'cards' || seg[1] === 'rituals') && seg[2] === undefined) return { name: 'bookChapter', chapter: seg[1] };
        if (seg[1] === 'archetypes') return seg[2] ? { name: 'archetypeDetail', id: seg[2] } : { name: 'archetypes' };
        if (seg[1] === 'journey' && seg[2] === undefined) return { name: 'journey' };
        if (seg[1] === 'chapter' && seg[2]) return { name: 'chapter', id: seg[2] };
        if (seg[1] === 'review' && (seg[2] === 'week' || seg[2] === 'month')) {
          const index = Number(seg[3]);
          if (Number.isInteger(index) && index >= 1) return { name: 'review', kind: seg[2], index };
        }
        if (seg[1] === undefined) return { name: 'grimoire' };
        return { name: 'notfound', path };
      case 'me':
      case 'profile': // V04: "Profil" became "Ich" (#/me); the old path stays valid.
        if (seg[1] === undefined) return { name: 'profile' };
        return seg[1] === 'settings' && seg[2] === undefined ? { name: 'settings' } : { name: 'notfound', path };
      case 'share':
        if (seg[1] === 'archetype' && seg.length <= 3) return { name: 'share', template: 'archetype', id: seg[2] ?? '' };
        return { name: 'notfound', path };
      default:
        return { name: 'notfound', path };
    }
  })();
  return { route, from, path };
}

const ALLOWED_FROM = new Set(['/today', '/oracle', '/grimoire', '/grimoire/history', '/grimoire/cards', '/grimoire/journal', '/grimoire/rituals', '/me', '/profile', '/archetype', '/grimoire/archetypes', '/grimoire/journey']);
/** Pages with an id that may be the origin of another page (`from` carries the id). */
const FROM_PATTERN = /^\/grimoire\/(archetypes\/[a-z]+|review\/(week|month)\/\d{1,3})$/;

function isSafePath(path: string): boolean {
  return ALLOWED_FROM.has(path) || FROM_PATTERN.test(path);
}

/**
 * A `from` may carry the origin of that page once more ("Ich" → the eight archetypes → one of
 * them → back → the eight → back → "Ich"). Deeper chains fall back to the fixed parent.
 */
function isSafeFrom(from: string | null): from is string {
  if (from === null) return false;
  const [path = '', query, ...rest] = from.split('?');
  if (rest.length > 0 || !isSafePath(path)) return false;
  if (query === undefined) return true;
  const params = [...new URLSearchParams(query)];
  return params.length === 1 && params[0]![0] === 'from' && isSafePath(params[0]![1]);
}

/** This page as the `from` of the next one, its own origin carried along (one level). */
export function originOf(parsed: ParsedRoute): string {
  if (parsed.from === null || !isSafePath(parsed.from)) return parsed.path;
  return encodeURIComponent(`${parsed.path}?from=${parsed.from}`);
}

/**
 * Where "back" leads from a route (Android back gesture and the in-app back link share this).
 * 'exit' means leave the app (Android) – the browser simply stays.
 */
export function backTarget(parsed: ParsedRoute): string | 'exit' {
  const { route, from } = parsed;
  const safeFrom = isSafeFrom(from) ? from : null;
  switch (route.name) {
    case 'welcome':
    case 'today':
      return 'exit';
    case 'onboarding':
      return route.step > 1 ? `/onboarding/${route.step - 1}` : '/welcome';
    case 'archetype':
      return safeFrom ?? '/today';
    case 'why':
      return safeFrom ?? '/me';
    case 'archetypes':
      return safeFrom ?? '/grimoire';
    case 'journey':
      return safeFrom ?? '/grimoire';
    case 'settings':
      return '/me';
    case 'archetypeDetail':
      return safeFrom ?? '/grimoire/archetypes';
    case 'review':
    case 'chapter':
      return safeFrom ?? '/grimoire/journey';
    case 'share':
      return safeFrom ?? '/me';
    case 'oracle':
    case 'profile':
    case 'notfound':
      return '/today';
    case 'grimoire':
      return '/today';
    case 'bookChapter':
      return '/grimoire';
    case 'card':
      return safeFrom ?? '/grimoire/cards';
    case 'day':
    case 'reading':
      return safeFrom ?? '/grimoire/journal';
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
