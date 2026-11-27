import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import { archetypeKeys, usedSymbols } from '../../src/content/modules/archetype-keys.ts';
import { texts as de } from '../../src/content/modules/archetypes.de.ts';
import { texts as en } from '../../src/content/modules/archetypes.en.ts';
import { RESONANCE, SYMBOL_IDS } from '../../src/content/resonance.ts';
import { ARCHETYPE_ORDER } from '../../src/domain/types.ts';

describe('archetype resonance (V04.2, C5, CONTENT_MASTERPLAN §4)', () => {
  it('assigns every card of the deck, only Death and the Star twice', () => {
    const count = new Map<string, number>();
    for (const id of ARCHETYPE_ORDER) for (const c of RESONANCE[id].cards) count.set(c, (count.get(c) ?? 0) + 1);
    for (const card of CONTENT.cards) expect(count.get(card.id), card.id).toBeGreaterThanOrEqual(1);
    expect([...count].filter(([, n]) => n > 1).map(([c]) => c).sort()).toEqual(['major-13-death', 'major-17-star']);
    for (const id of ARCHETYPE_ORDER) expect(new Set(RESONANCE[id].cards).size).toBe(3);
  });

  it('uses every symbol and gives each archetype three different ones', () => {
    expect([...usedSymbols()].sort()).toEqual([...SYMBOL_IDS].sort());
    for (const id of ARCHETYPE_ORDER) expect(new Set(RESONANCE[id].symbols).size).toBe(3);
  });

  it('names the three resonance cards and the guiding symbol in each description', () => {
    for (const [table, locale] of [
      [de, 'de'],
      [en, 'en'],
    ] as const) {
      for (const id of ARCHETYPE_ORDER) {
        const d = table[`description.${id}`] ?? '';
        for (const c of RESONANCE[id].cards) {
          const title = CONTENT.cards.find((x) => x.id === c)!.title[locale].replace(/^(Der|Die|Das|The) /, '');
          expect(d, `${locale} ${id} ${c}`).toContain(title);
        }
        expect(d.toLowerCase(), `${locale} ${id} symbol`).toContain((table[`symbol.${RESONANCE[id].symbols[0]}`] ?? '?').toLowerCase());
      }
    }
  });

  it('has exactly the expected keys in both languages', () => {
    const keys = archetypeKeys().sort();
    expect(Object.keys(de).sort()).toEqual(keys);
    expect(Object.keys(en).sort()).toEqual(keys);
  });
});
