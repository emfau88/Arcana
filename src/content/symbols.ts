/**
 * The 24 symbols of the lexicon (V06.4, PRODUCT_SYSTEMS H5/H6, CONTENT_MASTERPLAN §6) and the cards
 * in whose picture each one really appears (Deck v2, checked card by card on 28.11.2026, S-64).
 *
 * The list was matched against the pictures, as §6 asks: 17 symbols appear in at least one card.
 * Seven do not appear in any picture (lotus, butterfly, phoenix, serpent, owl, eye, feather). They
 * stay, because they are resonance symbols of the archetypes since V04 (five of them guiding
 * symbols) and the images exist (A33). They never point to a card picture; they are reached through
 * the cards of their archetypes instead (see `symbolSources`). Structure only; names and texts live
 * in the content module `symbols`.
 */
import { ARCHETYPE_ORDER, type ArchetypeId, type CardId } from '../domain/types.ts';
import { RESONANCE, SYMBOL_IDS } from './resonance.ts';

/** Lexicon order: the order of the two image sheets (A33). */
export const LEXICON_SYMBOL_IDS = [
  'sun',
  'moon',
  'star',
  'lotus',
  'key',
  'butterfly',
  'phoenix',
  'serpent',
  'tree',
  'owl',
  'crown',
  'chalice',
  'sword',
  'staff',
  'rose',
  'lily',
  'eye',
  'feather',
  'wheel',
  'pillars',
  'scales',
  'lantern',
  'lemniscate',
  'wheat',
] as const satisfies readonly string[];
export type LexiconSymbolId = (typeof LEXICON_SYMBOL_IDS)[number];

// Every resonance symbol of V04 is part of the lexicon (compile-time check).
const resonanceInLexicon: readonly LexiconSymbolId[] = SYMBOL_IDS;
void resonanceInLexicon;

/**
 * Cards whose picture shows the symbol, in deck order. Only what is visible counts, not tradition:
 * e.g. the Hierophant's hall has two columns (pillars), the lily of Strength grows from the stone,
 * the Empress's heart shield carries engraved lilies, the Tower wears a small crown.
 */
export const SYMBOL_CARDS: Readonly<Record<LexiconSymbolId, readonly CardId[]>> = {
  sun: ['major-00-fool', 'major-06-lovers', 'major-08-strength', 'major-10-wheel', 'major-13-death', 'major-14-temperance', 'major-19-sun', 'major-20-judgement'],
  moon: ['major-02-high-priestess', 'major-05-hierophant', 'major-07-chariot', 'major-09-hermit', 'major-10-wheel', 'major-15-devil', 'major-16-tower', 'major-18-moon'],
  star: ['major-03-empress', 'major-07-chariot', 'major-09-hermit', 'major-10-wheel', 'major-17-star'],
  lotus: [],
  key: ['major-05-hierophant'],
  butterfly: [],
  phoenix: [],
  serpent: [],
  tree: ['major-03-empress', 'major-06-lovers', 'major-12-hanged-man', 'major-17-star'],
  owl: [],
  crown: ['major-16-tower'],
  chalice: ['major-01-magician', 'major-14-temperance'],
  sword: ['major-01-magician', 'major-11-justice'],
  staff: ['major-00-fool', 'major-01-magician', 'major-05-hierophant', 'major-09-hermit'],
  rose: ['major-00-fool', 'major-01-magician', 'major-13-death'],
  lily: ['major-01-magician', 'major-03-empress', 'major-08-strength'],
  eye: [],
  feather: [],
  wheel: ['major-07-chariot', 'major-10-wheel'],
  pillars: ['major-02-high-priestess', 'major-05-hierophant', 'major-11-justice'],
  scales: ['major-11-justice'],
  lantern: ['major-09-hermit'],
  lemniscate: ['major-01-magician', 'major-08-strength'],
  wheat: ['major-03-empress'],
};

/** Archetypes that carry the symbol in their resonance (V04.2). */
export function symbolArchetypes(id: LexiconSymbolId): ArchetypeId[] {
  return ARCHETYPE_ORDER.filter((a) => (RESONANCE[a].symbols as readonly string[]).includes(id));
}

/**
 * Where a symbol can be found on the journey (H6): the cards of its picture, or, for the seven
 * symbols that appear in no picture, the resonance cards of the archetypes that carry it. Every
 * symbol has at least one card, so every one can be discovered without chance (card study opens
 * level 3 of any card).
 */
export function symbolSources(id: LexiconSymbolId): { via: 'picture' | 'archetype'; cards: CardId[]; archetypes: ArchetypeId[] } {
  const inPicture = SYMBOL_CARDS[id];
  if (inPicture.length) return { via: 'picture', cards: [...inPicture], archetypes: [] };
  const archetypes = symbolArchetypes(id);
  const cards = [...new Set(archetypes.flatMap((a) => RESONANCE[a].cards))];
  return { via: 'archetype', cards, archetypes };
}
