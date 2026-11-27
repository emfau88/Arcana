import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import { CORE_RIGHTS, CoreOnlyProvider, EDITION_RIGHTS, FREE_DECKS, isRight, TestProvider, type Right } from '../../src/domain/entitlements.ts';
import { normalizeEntitlements } from '../../src/platform/storage/validate.ts';

describe('entitlements (V03.4)', () => {
  it('without billing: the whole free core and the free deck, no edition right', () => {
    for (const r of CORE_RIGHTS) expect(CoreOnlyProvider.has(r)).toBe(true);
    for (const r of EDITION_RIGHTS) expect(CoreOnlyProvider.has(r)).toBe(false);
    expect(CoreOnlyProvider.has('deck.nocturne')).toBe(true);
    expect(CoreOnlyProvider.has('deck.aurora')).toBe(false);
    expect(CoreOnlyProvider.kind).toBe('core-only');
    expect(CoreOnlyProvider.list()).toEqual([...CORE_RIGHTS, 'deck.nocturne']);
  });

  it('the deck that ships in core is free', () => {
    expect(FREE_DECKS as readonly string[]).toContain(CONTENT.deckId);
  });

  it('a stored rights cache unlocks nothing without a billing provider', () => {
    // Somebody edits IndexedDB by hand: the cache is valid data, but CoreOnly never reads it.
    const cache = normalizeEntitlements({ rights: ['edition.spreads', 'deck.aurora'], checkedAt: '2026-11-26T10:00:00.000Z' });
    expect(cache?.rights).toContain('edition.spreads');
    expect(CoreOnlyProvider.has('edition.spreads')).toBe(false);
    expect(CoreOnlyProvider.has('deck.aurora')).toBe(false);
  });

  it('TestProvider grants every edition right by default, or exactly the given ones', () => {
    const all = TestProvider();
    expect(all.kind).toBe('test');
    for (const r of [...CORE_RIGHTS, ...EDITION_RIGHTS]) expect(all.has(r)).toBe(true);
    const one = TestProvider(['edition.spreads', 'deck.aurora']);
    expect(one.has('edition.spreads')).toBe(true);
    expect(one.has('deck.aurora')).toBe(true);
    expect(one.has('edition.numbers')).toBe(false);
    for (const r of CORE_RIGHTS) expect(one.has(r)).toBe(true);
    expect(new Set(one.list()).size).toBe(one.list().length);
  });

  it('lists are frozen and stable', () => {
    const list = CoreOnlyProvider.list();
    expect(Object.isFrozen(list)).toBe(true);
    expect(CoreOnlyProvider.list()).toBe(list);
  });

  it('knows its rights and rejects anything else', () => {
    const known: unknown[] = [...CORE_RIGHTS, ...EDITION_RIGHTS, 'deck.nocturne', 'deck.moon-garden'];
    for (const r of known) expect(isRight(r)).toBe(true);
    for (const r of ['premium.all', 'edition.everything', 'deck.', 'deck.Bad Name', 'core', '', null, 42, {}]) expect(isRight(r)).toBe(false);
    const typed: Right = 'deck.anything';
    expect(isRight(typed)).toBe(true);
  });
});

describe('no screen reads the purchase state directly (lint rule D-48)', () => {
  const eslint = new ESLint();
  const lint = async (code: string, filePath: string) => {
    const [result] = await eslint.lintText(code, { filePath });
    return (result?.messages ?? []).map((m) => m.ruleId);
  };

  it('blocks provider imports, storage imports and purchase fields in features and ui', async () => {
    const screen = 'src/features/today/Bad.tsx';
    expect(await lint("import { CoreOnlyProvider } from '../../domain/entitlements.ts';\nexport const x = CoreOnlyProvider;\n", screen)).toContain('no-restricted-imports');
    expect(await lint("import { IndexedDbRepository } from '../../platform/storage/indexeddb.ts';\nexport const x = IndexedDbRepository;\n", 'src/ui/Bad.tsx')).toContain('no-restricted-imports');
    expect(await lint('export const f = (s: { entitlements: string[] }) => s.entitlements.length;\n', screen)).toContain('no-restricted-syntax');
    expect(await lint("export const k = 'entitlements';\n", screen)).toContain('no-restricted-syntax');
  }, 30_000);

  it('allows asking via has(right), and the store itself may use the provider', async () => {
    expect(await lint("export const show = (has: (r: string) => boolean) => has('edition.spreads');\n", 'src/features/oracle/Good.tsx')).toEqual([]);
    expect(await lint("import { CoreOnlyProvider } from '../domain/entitlements.ts';\nexport const p = CoreOnlyProvider;\n", 'src/app/Good.tsx')).toEqual([]);
  }, 30_000);
});
