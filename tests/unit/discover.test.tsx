// @vitest-environment jsdom
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { backTarget, originOf, parsePath } from '../../src/app/router.ts';
import { AppProvider, useApp } from '../../src/app/store.tsx';
import type { LexiconSymbolId } from '../../src/content/symbols.ts';
import { encounterCounts } from '../../src/domain/angel.ts';
import { fold, searchDiscover } from '../../src/domain/discover-search.ts';
import { seededRng } from '../../src/domain/random.ts';
import { discoverDe } from '../../src/i18n/discover.de.ts';
import { discoverEn } from '../../src/i18n/discover.en.ts';
import { IndexedDbRepository } from '../../src/platform/storage/indexeddb.ts';

describe('Discover routes (V06.1, IA §3)', () => {
  it('parses the hub, the three worlds, their pages and the birth date under "Ich"', () => {
    expect(parsePath('#/discover').route).toEqual({ name: 'discover' });
    expect(parsePath('#/discover/numbers').route).toEqual({ name: 'numbers' });
    expect(parsePath('#/discover/numbers/7').route).toEqual({ name: 'number', n: '7' });
    expect(parsePath('#/discover/angel').route).toEqual({ name: 'angels' });
    expect(parsePath('#/discover/angel/11:11').route).toEqual({ name: 'angel', raw: '11:11' });
    expect(parsePath('#/discover/angel/444').route).toEqual({ name: 'angel', raw: '444' });
    expect(parsePath('#/discover/symbols').route).toEqual({ name: 'symbols' });
    expect(parsePath('#/discover/symbols/moon').route).toEqual({ name: 'symbol', id: 'moon' });
    expect(parsePath('#/me/birthdate').route).toEqual({ name: 'birthdate' });
    expect(parsePath('#/discover/elsewhere').route.name).toBe('notfound');
    expect(parsePath('#/discover/numbers/7/more').route.name).toBe('notfound');
  });

  it('leads back to the hub, the world or the page it was opened from', () => {
    const back = (h: string) => backTarget(parsePath(h));
    expect(back('#/discover')).toBe('/today');
    expect(back('#/discover/numbers')).toBe('/discover');
    expect(back('#/discover/angel')).toBe('/discover');
    expect(back('#/discover/symbols')).toBe('/discover');
    expect(back('#/discover/numbers/7')).toBe('/discover/numbers');
    expect(back('#/discover/angel/11:11')).toBe('/discover/angel');
    expect(back('#/discover/symbols/moon')).toBe('/discover/symbols');
    expect(back('#/me/birthdate')).toBe('/me');
    expect(back('#/me/birthdate?from=/discover/numbers')).toBe('/discover/numbers');
    expect(back('#/discover/numbers/7?from=/discover')).toBe('/discover');
    expect(back('#/grimoire/card/major-17-star?from=/discover/symbols/star')).toBe('/discover/symbols/star');
    expect(back('#/grimoire/card/major-17-star?from=/discover/numbers/7')).toBe('/discover/numbers/7');
    expect(back('#/discover/angel/11:11?from=/discover/angel')).toBe('/discover/angel');
    expect(back('#/me/birthdate?from=/discover/angel/11:11')).toBe('/discover/angel/11:11');
  });

  it('carries the hub as the origin of a world, so two steps back end on the hub', () => {
    const world = parsePath('#/discover/symbols?from=/discover');
    const detail = parsePath(`#/discover/symbols/moon?from=${originOf(world)}`);
    expect(backTarget(detail)).toBe('/discover/symbols?from=/discover');
  });

  it('ignores untrusted origins inside Discover', () => {
    const back = (h: string) => backTarget(parsePath(h));
    expect(back('#/discover/numbers/7?from=https://evil.example')).toBe('/discover/numbers');
    expect(back('#/grimoire/card/x?from=/discover/symbols/../../welcome')).toBe('/grimoire/cards');
    expect(back('#/grimoire/card/x?from=/discover/angel/1234567')).toBe('/grimoire/cards');
  });
});

describe('Discover search (V06.1)', () => {
  const names: Record<string, string> = { moon: 'Mond', wheat: 'Ähre', phoenix: 'Phönix', key: 'Schlüssel', lantern: 'Laterne', lily: 'Lilie' };
  const name = (id: LexiconSymbolId) => names[id] ?? '';

  it('finds a number and its angel number from the same digits', () => {
    expect(searchDiscover('7', name)).toEqual([
      { kind: 'number', n: 7 },
      { kind: 'angel', display: '7' },
    ]);
    expect(searchDiscover('33', name)).toEqual([
      { kind: 'number', n: 33 },
      { kind: 'angel', display: '33' },
    ]);
    expect(searchDiscover('10', name)).toEqual([{ kind: 'angel', display: '10' }]);
    expect(searchDiscover('07', name)).toEqual([{ kind: 'angel', display: '07' }]);
  });

  it('reads a time as an angel number', () => {
    expect(searchDiscover(' 11:11 ', name)).toEqual([{ kind: 'angel', display: '11:11' }]);
  });

  it('finds symbols by name without accents and needs two letters', () => {
    expect(searchDiscover('mon', name)).toEqual([{ kind: 'symbol', id: 'moon' }]);
    expect(searchDiscover('ahre', name)).toEqual([{ kind: 'symbol', id: 'wheat' }]);
    expect(searchDiscover('PHONIX', name)).toEqual([{ kind: 'symbol', id: 'phoenix' }]);
    expect(searchDiscover('li', name)).toEqual([{ kind: 'symbol', id: 'lily' }]);
    expect(searchDiscover('l', name)).toEqual([]);
    expect(searchDiscover('   ', name)).toEqual([]);
    expect(searchDiscover('zzz', name)).toEqual([]);
    expect(fold(' Ähre ')).toBe('ahre');
  });
});

describe('Discover texts', () => {
  type Tree = { [k: string]: string | Tree };
  const values = (t: Tree, prefix = ''): [string, string][] =>
    Object.entries(t).flatMap(([k, v]) => (typeof v === 'string' ? [[`${prefix}${k}`, v] as [string, string]] : values(v, `${prefix}${k}.`)));
  const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

  it('has the same keys, no empty strings and matching placeholders in both languages', () => {
    const de = values(discoverDe as unknown as Tree);
    const en = new Map(values(discoverEn as unknown as Tree));
    expect([...en.keys()].sort()).toEqual(de.map(([k]) => k).sort());
    for (const [k, v] of de) {
      expect(v.trim(), `de.${k}`).not.toBe('');
      expect(en.get(k)!.trim(), `en.${k}`).not.toBe('');
      expect(placeholders(en.get(k)!), k).toEqual(placeholders(v));
    }
  });
});

async function setup() {
  const factory = new IDBFactory();
  const repo = new IndexedDbRepository({ factory, name: 'discover' });
  await repo.open();
  await repo.putProfile({ answers: {}, themeId: 'self', archetypeId: 'seeker', profileVersion: 1, updatedAt: '2026-11-26T10:00:00.000Z' });
  await repo.putSettings({ locale: 'de', motion: 'system', onboardingDone: true });
  repo.close();
  const clock = { now: () => new Date(2026, 10, 28, 9, 0, 0) };
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AppProvider repo={repo} clock={clock} rng={seededRng(3)}>
      {children}
    </AppProvider>
  );
  return async () => {
    const hook = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(hook.result.current.state.status).toBe('ready'));
    return hook;
  };
}

describe('Discover in the store (V06.1, V06.3)', () => {
  it('saves and deletes the birth date on its own, and rejects an implausible one', async () => {
    const mount = await setup();
    const { result, unmount } = await mount();
    await expect(result.current.actions.setBirthDate('1899-12-31')).rejects.toThrow();
    await expect(result.current.actions.setBirthDate('2026-11-29')).rejects.toThrow();
    await act(() => result.current.actions.setBirthDate('1990-07-14'));
    expect(result.current.state.personal?.birthDate).toBe('1990-07-14');
    unmount();

    const again = await mount();
    expect(again.result.current.state.personal?.birthDate).toBe('1990-07-14');
    await act(() => again.result.current.actions.deleteBirthDate());
    expect(again.result.current.state.personal).toBeNull();
    expect(again.result.current.state.profile?.archetypeId).toBe('seeker'); // everything else stays
    again.unmount();

    const third = await mount();
    expect(third.result.current.state.personal).toBeNull();
    third.unmount();
  });

  it('toggles favourites and notes encounters that survive a restart', async () => {
    const mount = await setup();
    const { result, unmount } = await mount();
    let on = false;
    await act(async () => void (on = await result.current.actions.toggleFavorite('angel', '1111')));
    expect(on).toBe(true);
    await act(async () => void (on = await result.current.actions.toggleFavorite('symbol', 'moon')));
    await act(async () => void (on = await result.current.actions.toggleFavorite('symbol', 'moon')));
    expect(on).toBe(false);
    expect(result.current.state.favorites.map((f) => f.key)).toEqual(['angel:1111']);

    await act(() => result.current.actions.recordEncounter('11:11', '', 'Bahnhof'));
    await act(() => result.current.actions.recordEncounter('1111', 'Wieder', ''));
    expect(encounterCounts(result.current.state.journal)).toEqual([{ sequence: '1111', count: 2, lastDateKey: '2026-11-28' }]);
    unmount();

    const again = await mount();
    expect(again.result.current.state.favorites.map((f) => f.key)).toEqual(['angel:1111']);
    expect(encounterCounts(again.result.current.state.journal)[0]?.count).toBe(2);
    again.unmount();
  });
});
