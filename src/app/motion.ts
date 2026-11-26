import { useEffect, useSyncExternalStore } from 'react';
import type { MotionPreference } from '../domain/types.ts';
import { useApp } from './store.tsx';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}
const systemReduced = () => window.matchMedia(QUERY).matches;

export function resolveReducedMotion(pref: MotionPreference, system: boolean): boolean {
  return pref === 'reduced' || (pref === 'system' && system);
}

/** True when motion should be reduced (system setting or in-app choice). */
export function useReducedMotion(): boolean {
  const { state } = useApp();
  const system = useSyncExternalStore(subscribe, systemReduced, () => false);
  return resolveReducedMotion(state.settings.motion, system);
}

/** Mirrors the decision onto <html> so CSS can shorten every animation. */
export function useMotionClass(): void {
  const reduced = useReducedMotion();
  useEffect(() => {
    document.documentElement.classList.toggle('motion-reduced', reduced);
  }, [reduced]);
}
