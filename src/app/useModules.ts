import { useEffect, useState } from 'react';
import type { ModuleId } from '../content/modules/registry.ts';
import { useApp } from './store.tsx';

export type ModuleStatus = 'ready' | 'loading' | 'error';

/**
 * Loads content modules a screen needs (archetype profiles, chapters, journey texts) for the
 * current language. Runs again after a language change, since that replaces the loaded set.
 * Offline without the module: 'error' with a retry; the screen shows what core already has.
 */
export function useModules(ids: readonly ModuleId[]): { status: ModuleStatus; retry: () => void } {
  const { state, actions } = useApp();
  const key = ids.join(',');
  const ready = ids.every((id) => state.modules[id]);
  const [failed, setFailed] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (ready || !key) return;
    let live = true;
    actions.loadModules(key.split(',') as ModuleId[]).catch(() => {
      if (live) setFailed(`${key}#${attempt}`);
    });
    return () => {
      live = false;
    };
  }, [ready, key, attempt, actions]);

  return {
    status: ready ? 'ready' : failed === `${key}#${attempt}` ? 'error' : 'loading',
    retry: () => setAttempt((a) => a + 1),
  };
}
