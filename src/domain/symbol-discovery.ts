/**
 * Discovered symbols (V06.4, PRODUCT_SYSTEMS H6, PROGRESSION_DESIGN §5 "Symbole"). Derived from the
 * stored facts on demand, nothing is stored. The lexicon itself is always open: discovery only
 * highlights a symbol in the Grimoire, it never locks a text (no locked knowledge).
 *
 * A symbol counts as discovered when
 * - one of its source cards (`symbolSources`) reaches card level 3, "deepened", or
 * - journey day 10 is reached and it is the personal symbol: the guiding symbol of the main
 *   archetype. Every main archetype a daily card was drawn under counts, so a later change of
 *   archetype adds a symbol and never takes one away (like card levels, discovery never drops).
 */
import { RESONANCE } from '../content/resonance.ts';
import { LEXICON_SYMBOL_IDS, symbolSources, type LexiconSymbolId } from '../content/symbols.ts';
import { cardEncounters, cardLevel, journeyDays, type Facts } from './progress.ts';
import type { ArchetypeId, CardId } from './types.ts';

/** Journey day of the milestone "your symbol" (FIXED_MILESTONES, reward 'personal-symbol'). */
export const PERSONAL_SYMBOL_DAY = 10;
/** Card level that reveals the symbols of a card. */
export const SYMBOL_LEVEL = 3;

export type SymbolDiscovery = { via: 'card'; cardId: CardId } | { via: 'personal' };

/** The personal symbol: guiding symbol of the main archetype. A neutral profile has none. */
export function personalSymbol(archetypeId: ArchetypeId | null): LexiconSymbolId | null {
  return archetypeId ? RESONANCE[archetypeId].symbols[0] : null;
}

/**
 * Discovered symbols in lexicon order. A symbol found through a card names the first deepened
 * source card in deck order; the personal symbol counts only where no card has revealed it yet.
 */
export function discoveredSymbols(facts: Facts, archetypeId: ArchetypeId | null): Map<LexiconSymbolId, SymbolDiscovery> {
  const deepened = new Set<CardId>();
  for (const e of cardEncounters(facts).values()) if (cardLevel(e) >= SYMBOL_LEVEL) deepened.add(e.cardId);

  const personal = new Set<LexiconSymbolId>();
  if (journeyDays(facts) >= PERSONAL_SYMBOL_DAY) {
    for (const a of [archetypeId, ...facts.dailies.map((d) => d.archetypeId)]) {
      const s = personalSymbol(a);
      if (s) personal.add(s);
    }
  }

  const out = new Map<LexiconSymbolId, SymbolDiscovery>();
  for (const id of LEXICON_SYMBOL_IDS) {
    const cardId = symbolSources(id).cards.find((c) => deepened.has(c));
    if (cardId) out.set(id, { via: 'card', cardId });
    else if (personal.has(id)) out.set(id, { via: 'personal' });
  }
  return out;
}
