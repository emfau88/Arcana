/**
 * Keys of the content module `symbols` (V06.4, PRODUCT_SYSTEMS H5, CONTENT_MASTERPLAN §3, §6): five
 * texts per lexicon symbol (120 per language). Structure only; the cards a symbol appears in live in
 * `src/content/symbols.ts`, discovery in `src/domain/symbol-discovery.ts`.
 */
import { LEXICON_SYMBOL_IDS, type LexiconSymbolId } from '../symbols.ts';
import type { TextTable } from './registry.ts';

export const SYMBOL_PARTS = ['name', 'meaning', 'light', 'shadow', 'reflection'] as const;
export type SymbolPart = (typeof SYMBOL_PARTS)[number];

export function symbolsKeys(): string[] {
  return LEXICON_SYMBOL_IDS.flatMap((id) => SYMBOL_PARTS.map((p) => `symbol.${id}.${p}`));
}

/** Builds the flat table from one record per symbol (keeps the text files readable). */
export function symbolsTable(symbols: Readonly<Record<LexiconSymbolId, Readonly<Record<SymbolPart, string>>>>): TextTable {
  const out: Record<string, string> = {};
  for (const id of LEXICON_SYMBOL_IDS) for (const p of SYMBOL_PARTS) out[`symbol.${id}.${p}`] = symbols[id][p];
  return out;
}
