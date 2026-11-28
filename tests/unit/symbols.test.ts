import { describe, expect, it } from 'vitest';
import { DECK } from '../../src/content/index.ts';
import { RESONANCE, SYMBOL_IDS } from '../../src/content/resonance.ts';
import { LEXICON_SYMBOL_IDS, SYMBOL_CARDS, symbolArchetypes, symbolSources } from '../../src/content/symbols.ts';
import { ARCHETYPE_ORDER } from '../../src/domain/types.ts';

const cardIds = new Set(DECK.map((c) => c.id));

describe('symbol lexicon structure (V06.4, S-64)', () => {
  it('has 24 distinct symbols and contains every resonance symbol of V04', () => {
    expect(LEXICON_SYMBOL_IDS).toHaveLength(24);
    expect(new Set(LEXICON_SYMBOL_IDS).size).toBe(24);
    for (const s of SYMBOL_IDS) expect(LEXICON_SYMBOL_IDS).toContain(s);
  });

  it('points only to existing cards, in deck order, without duplicates', () => {
    const order = new Map(DECK.map((c) => [c.id, c.order]));
    for (const id of LEXICON_SYMBOL_IDS) {
      const cards = SYMBOL_CARDS[id];
      for (const c of cards) expect(cardIds.has(c), `${id} → ${c}`).toBe(true);
      expect(new Set(cards).size).toBe(cards.length);
      expect([...cards].sort((a, b) => order.get(a)! - order.get(b)!)).toEqual(cards);
    }
  });

  it('matches the picture check: 17 symbols in a picture, the 7 others only through archetypes', () => {
    const none = LEXICON_SYMBOL_IDS.filter((id) => SYMBOL_CARDS[id].length === 0);
    expect(none.sort()).toEqual(['butterfly', 'eye', 'feather', 'lotus', 'owl', 'phoenix', 'serpent']);
    for (const id of none) expect(symbolArchetypes(id).length, id).toBeGreaterThan(0);
  });

  it('gives every symbol at least one card, so each can be discovered without chance', () => {
    for (const id of LEXICON_SYMBOL_IDS) {
      const src = symbolSources(id);
      expect(src.cards.length, id).toBeGreaterThan(0);
      for (const c of src.cards) expect(cardIds.has(c)).toBe(true);
    }
    expect(symbolSources('owl')).toEqual({ via: 'archetype', archetypes: ['sage'], cards: RESONANCE.sage.cards });
    expect(symbolSources('key').via).toBe('picture');
  });

  it('every guiding symbol of an archetype is in the lexicon (day-10 milestone "your symbol")', () => {
    for (const a of ARCHETYPE_ORDER) expect(LEXICON_SYMBOL_IDS).toContain(RESONANCE[a].symbols[0]);
  });
});
