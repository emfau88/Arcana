import { describe, expect, it } from 'vitest';
import { CONTENT, DECK } from '../../src/content/index.ts';
import { texts as archetypesDe } from '../../src/content/modules/archetypes.de.ts';
import { texts as archetypesEn } from '../../src/content/modules/archetypes.en.ts';
import { symbolsKeys } from '../../src/content/modules/symbols-keys.ts';
import { texts as de } from '../../src/content/modules/symbols.de.ts';
import { texts as en } from '../../src/content/modules/symbols.en.ts';
import { symbolRefs } from '../../src/content/modules/validate.ts';
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

describe('symbol lexicon texts (V06.4, H5)', () => {
  it('has exactly 5 keys per symbol, 120 per language', () => {
    expect(symbolsKeys()).toHaveLength(120);
    expect(Object.keys(de).sort()).toEqual([...symbolsKeys()].sort());
    expect(Object.keys(en).sort()).toEqual([...symbolsKeys()].sort());
  });

  it('marks every meaning as tradition in both languages', () => {
    for (const id of LEXICON_SYMBOL_IDS) {
      expect(de[`symbol.${id}.meaning`], id).toMatch(/[Tt]raditionell/);
      expect(en[`symbol.${id}.meaning`], id).toMatch(/[Tt]raditionally/);
    }
  });

  it('uses the same names as the archetype resonance', () => {
    for (const id of SYMBOL_IDS) {
      expect(de[`symbol.${id}.name`]).toBe(archetypesDe[`symbol.${id}`]);
      expect(en[`symbol.${id}.name`]).toBe(archetypesEn[`symbol.${id}`]);
    }
  });

  it('speaks of this deck only where the symbol is in a picture, and names only those cards', () => {
    const titles = DECK.map((c) => ({ id: c.id, title: c.title.en.replace(/^The /, '') }));
    for (const id of LEXICON_SYMBOL_IDS) {
      const inPicture = SYMBOL_CARDS[id].length > 0;
      expect(de[`symbol.${id}.meaning`]!.includes('In diesem Deck'), id).toBe(inPicture);
      const at = en[`symbol.${id}.meaning`]!.indexOf('In this deck');
      expect(at >= 0, id).toBe(inPicture);
      if (!inPicture) continue;
      const deck = en[`symbol.${id}.meaning`]!.slice(at);
      for (const t of titles) if (new RegExp(`\b${t.title}\b`).test(deck)) expect(SYMBOL_CARDS[id], `${id} names ${t.title}`).toContain(t.id);
    }
  });

  it('passes the reference check of the content gate', () => {
    expect(symbolRefs(CONTENT)).toEqual([]);
    const broken = { ...CONTENT, cards: CONTENT.cards.filter((c) => c.id !== 'major-11-justice') };
    expect(symbolRefs(broken)).toEqual(expect.arrayContaining(['symbol scales: unknown card major-11-justice', 'symbol scales: no card to discover it through']));
  });
});
