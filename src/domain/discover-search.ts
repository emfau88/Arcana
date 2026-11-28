/**
 * Search of the Discover hub (V06.1, IA §3 "Entdecken-Hub · Suchen"): one field for all three
 * worlds. Pure, so it is tested without a screen. Numbers and angel numbers are recognised from
 * the input itself; symbols by their name in the current language.
 */
import { lookupAngel } from './angel.ts';
import { LIFE_NUMBERS, type LifeNumber } from './numerology.ts';
import { LEXICON_SYMBOL_IDS, type LexiconSymbolId } from '../content/symbols.ts';

export type SearchHit = { kind: 'number'; n: LifeNumber } | { kind: 'angel'; display: string } | { kind: 'symbol'; id: LexiconSymbolId };

/** Lower case without accents, so "Ahre" finds "Ähre" and "phonix" finds "Phönix". */
export const fold = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();

/** Symbols need at least two letters, so a single letter does not list half the lexicon. */
const MIN_SYMBOL_QUERY = 2;

export function searchDiscover(query: string, symbolName: (id: LexiconSymbolId) => string): SearchHit[] {
  const q = query.trim();
  if (!q) return [];
  const hits: SearchHit[] = [];
  if (/^\d{1,2}$/.test(q) && !q.startsWith('0')) {
    const n = Number(q);
    if ((LIFE_NUMBERS as readonly number[]).includes(n)) hits.push({ kind: 'number', n: n as LifeNumber });
  }
  const angel = lookupAngel(q);
  if (angel) hits.push({ kind: 'angel', display: angel.display });
  const f = fold(q);
  if (f.length >= MIN_SYMBOL_QUERY) {
    for (const id of LEXICON_SYMBOL_IDS) {
      const name = symbolName(id);
      if (name && fold(name).includes(f)) hits.push({ kind: 'symbol', id });
    }
  }
  return hits;
}
