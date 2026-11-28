import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import { RESONANCE } from '../../src/content/resonance.ts';
import type { LexiconSymbolId } from '../../src/content/symbols.ts';
import { createDailyRecord } from '../../src/domain/oracle.ts';
import { seededRng } from '../../src/domain/random.ts';
import { discoveredSymbols, PERSONAL_SYMBOL_DAY, personalSymbol } from '../../src/domain/symbol-discovery.ts';
import { ARCHETYPE_ORDER, type ArchetypeId, type CardId, type DailyRecord } from '../../src/domain/types.ts';
import type { Facts } from '../../src/domain/progress.ts';

function daily(d: number, cardId: CardId, archetypeId: ArchetypeId | null = null): DailyRecord {
  const clock = { now: () => new Date(2026, 10, d, 9, 0, 0) };
  const r = createDailyRecord({ pack: CONTENT, clock, rng: seededRng(d), themeId: 'self', archetypeId, locale: 'de', previousCardId: null });
  return { ...r, cardId, archetypeId };
}

const facts = (dailies: DailyRecord[]): Facts => ({ dailies, readings: [], journal: [], events: [] });
/** n journey days, each with a different card, so no card passes level 1. */
const days = (n: number, archetypeId: ArchetypeId | null = null) => facts(CONTENT.cards.slice(0, n).map((c, i) => daily(i + 1, c.id, archetypeId)));

describe('discovered symbols (V06.4, PRODUCT_SYSTEMS H6)', () => {
  it('starts empty: nothing is discovered without facts', () => {
    expect(discoveredSymbols(facts([]), 'seeker').size).toBe(0);
  });

  it('reveals the symbols in a card picture once that card reaches level 3', () => {
    const hermit = facts([1, 2, 3, 4].map((d) => daily(d, 'major-09-hermit')));
    expect([...discoveredSymbols(hermit, null)]).toEqual([
      ['moon', { via: 'card', cardId: 'major-09-hermit' }],
      ['star', { via: 'card', cardId: 'major-09-hermit' }],
      ['staff', { via: 'card', cardId: 'major-09-hermit' }],
      ['lantern', { via: 'card', cardId: 'major-09-hermit' }],
    ]);
    expect(discoveredSymbols(facts([1, 2, 3].map((d) => daily(d, 'major-09-hermit'))), null).size).toBe(0);
  });

  it('reaches the symbols without a picture through the cards of their archetypes', () => {
    const hierophant = facts([1, 2, 3, 4].map((d) => daily(d, 'major-05-hierophant')));
    expect([...discoveredSymbols(hierophant, null).keys()]).toEqual(['moon', 'key', 'owl', 'staff', 'pillars']);
  });

  it('adds the personal symbol on journey day 10, the guiding symbol of the main archetype', () => {
    expect(discoveredSymbols(days(PERSONAL_SYMBOL_DAY - 1), 'seeker').size).toBe(0);
    expect([...discoveredSymbols(days(PERSONAL_SYMBOL_DAY), 'seeker')]).toEqual([['lantern', { via: 'personal' }]]);
    expect(discoveredSymbols(days(PERSONAL_SYMBOL_DAY), null).size).toBe(0);
    for (const a of ARCHETYPE_ORDER) expect(personalSymbol(a)).toBe(RESONANCE[a].symbols[0]);
    expect(personalSymbol(null)).toBeNull();
  });

  it('keeps the symbol of an earlier main archetype after a change (discovery never drops)', () => {
    const before = days(PERSONAL_SYMBOL_DAY, 'guardian');
    expect([...discoveredSymbols(before, 'seeker').keys()]).toEqual(['lily', 'lantern']);
  });

  it('names the card when a card has revealed the personal symbol too', () => {
    const f = facts([...days(PERSONAL_SYMBOL_DAY).dailies, ...[11, 12, 13, 14].map((d) => daily(d, 'major-09-hermit'))]);
    expect(discoveredSymbols(f, 'seeker').get('lantern')).toEqual({ via: 'card', cardId: 'major-09-hermit' });
  });

  it('only grows when facts are added', () => {
    let prev = new Set<LexiconSymbolId>();
    const all: DailyRecord[] = [];
    for (let d = 1; d <= 40; d++) {
      all.push(daily(d, CONTENT.cards[(d * 7) % CONTENT.cards.length]!.id, d < 20 ? 'sage' : 'creator'));
      const now = new Set(discoveredSymbols(facts(all), d < 20 ? 'sage' : 'creator').keys());
      for (const s of prev) expect(now.has(s), `day ${d}: ${s}`).toBe(true);
      prev = now;
    }
    expect(prev.size).toBeGreaterThan(0);
  });
});
