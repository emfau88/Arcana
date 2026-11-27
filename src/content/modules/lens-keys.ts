/**
 * Builds the lens keys of the identity module (V04.3, PRODUCT_SYSTEMS A3): one sentence per
 * archetype × card, key `lens.<archetypeId>.<cardId>`. The card order is the deck order of core;
 * a unit test keeps both lists equal.
 */
import type { TextTable } from './registry.ts';

export const LENS_CARD_IDS = [
  'major-00-fool',
  'major-01-magician',
  'major-02-high-priestess',
  'major-03-empress',
  'major-04-emperor',
  'major-05-hierophant',
  'major-06-lovers',
  'major-07-chariot',
  'major-08-strength',
  'major-09-hermit',
  'major-10-wheel',
  'major-11-justice',
  'major-12-hanged-man',
  'major-13-death',
  'major-14-temperance',
  'major-15-devil',
  'major-16-tower',
  'major-17-star',
  'major-18-moon',
  'major-19-sun',
  'major-20-judgement',
  'major-21-world',
] as const;

/** One list of 22 sentences (deck order) per archetype → flat text table. Throws on a wrong count. */
export function lensTable(byArchetype: Readonly<Record<string, readonly string[]>>): TextTable {
  const out: Record<string, string> = {};
  for (const [archetypeId, list] of Object.entries(byArchetype)) {
    if (list.length !== LENS_CARD_IDS.length) throw new Error(`lens.${archetypeId}: ${list.length} texts, expected ${LENS_CARD_IDS.length}`);
    list.forEach((t, i) => {
      out[`lens.${archetypeId}.${LENS_CARD_IDS[i]}`] = t;
    });
  }
  return out;
}
