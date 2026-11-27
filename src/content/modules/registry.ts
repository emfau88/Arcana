/**
 * Content modules (V03.3, CONTENT_MASTERPLAN §1). `core` (cards, themes, structure) stays in
 * the start bundle; every other module is a flat text table per locale, loaded on demand
 * through a dynamic import, so the start bundle does not grow with each world.
 *
 * Keys are stable and meaningful ('question.q-calling.prompt'); structure (ids, weights,
 * references) lives in core or in the domain, never in a text table.
 */
import type { Locale } from '../../domain/types.ts';

export type ModuleId = 'identity' | 'archetypes' | 'chapters' | 'journey' | 'cards-deep' | 'spreads' | 'numbers' | 'symbols' | 'moon';
export type TextTable = Readonly<Record<string, string>>;

type Loader = () => Promise<{ texts: TextTable }>;

/** Registered modules with one loader per locale. Vite turns each import into its own chunk. */
export const MODULE_LOADERS: Partial<Record<ModuleId, Record<Locale, Loader>>> = {
  identity: {
    de: () => import('./identity.de.ts'),
    en: () => import('./identity.en.ts'),
  },
  archetypes: {
    de: () => import('./archetypes.de.ts'),
    en: () => import('./archetypes.en.ts'),
  },
  chapters: {
    de: () => import('./chapters.de.ts'),
    en: () => import('./chapters.en.ts'),
  },
  journey: {
    de: () => import('./journey.de.ts'),
    en: () => import('./journey.en.ts'),
  },
};

/** Module versions, stored nowhere but reported by the content gate and the build. */
export const MODULE_VERSIONS: Partial<Record<ModuleId, string>> = {
  identity: 'identity-2026-11-27.3',
  archetypes: 'archetypes-2026-11-27.3',
  chapters: 'chapters-2026-11-27.3',
  journey: 'journey-2026-11-27.3',
};

/** Modules every start needs (onboarding, today). Loaded in parallel with the database. */
export const STARTUP_MODULES: readonly ModuleId[] = ['identity'];

export function registeredModules(): ModuleId[] {
  return Object.keys(MODULE_LOADERS) as ModuleId[];
}

const cache = new Map<string, Promise<TextTable>>();

/** Loads one module for one locale (cached; a failed load is retried next time). */
/** A content module could not be loaded (web offline before first use, or a missing file). */
export class ModuleLoadError extends Error {
  readonly module: string;
  readonly locale: Locale;
  constructor(module: string, locale: Locale, cause?: unknown) {
    super(`Content module could not be loaded: ${module} (${locale})`, { cause });
    this.name = 'ModuleLoadError';
    this.module = module;
    this.locale = locale;
  }
}

export function loadModule(id: ModuleId, locale: Locale): Promise<TextTable> {
  const k = `${id}:${locale}`;
  let p = cache.get(k);
  if (!p) {
    const loader = MODULE_LOADERS[id]?.[locale];
    if (!loader) return Promise.reject(new ModuleLoadError(id, locale));
    p = loader().then(
      (m) => m.texts,
      (e: unknown) => {
        throw new ModuleLoadError(id, locale, e);
      },
    );
    p.catch(() => cache.delete(k));
    cache.set(k, p);
  }
  return p;
}

export type LoadedModules = Partial<Record<ModuleId, TextTable>>;

export async function loadModules(ids: readonly ModuleId[], locale: Locale): Promise<LoadedModules> {
  const tables = await Promise.all(ids.map((id) => loadModule(id, locale)));
  return Object.fromEntries(ids.map((id, i) => [id, tables[i]])) as LoadedModules;
}

/**
 * Text lookup. A module that is not loaded yet gives an empty string (it is on its way).
 * In a loaded module the content gate guarantees completeness, so a missing key is a bug:
 * it shows the key itself (visible in tests) instead of an empty gap.
 */
export function text(modules: LoadedModules, id: ModuleId, key: string): string {
  const table = modules[id];
  if (!table) return '';
  return table[key] ?? key;
}
