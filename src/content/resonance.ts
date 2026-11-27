/**
 * Resonance of each archetype (V04.2, PRODUCT_SYSTEMS C5, CONTENT_MASTERPLAN §4): three cards and
 * three symbols (the first one is the guiding symbol). Structure only; labels live in the content
 * module `archetypes` (`symbol.<id>`), card titles in core. App conventions, not tradition: the
 * profile calls them "your resonance".
 *
 * Checked in V04 (§4 was a proposal): every one of the 22 cards belongs to an archetype, only
 * Death and the Star belong to two (S-12). So the later "gentle mirror" (C9, 1.2), which counts
 * the archetypes of drawn cards, is not skewed towards one archetype.
 */
import type { ArchetypeId, CardId } from '../domain/types.ts';

export const SYMBOL_IDS = [
  'lantern',
  'star',
  'key',
  'lily',
  'pillars',
  'rose',
  'eye',
  'moon',
  'feather',
  'phoenix',
  'serpent',
  'chalice',
  'wheel',
  'wheat',
  'staff',
  'sun',
  'lotus',
  'owl',
  'scales',
  'butterfly',
  'lemniscate',
] as const;
export type SymbolId = (typeof SYMBOL_IDS)[number];

export interface Resonance {
  cards: readonly [CardId, CardId, CardId];
  /** First = guiding symbol. */
  symbols: readonly [SymbolId, SymbolId, SymbolId];
}

export const RESONANCE: Readonly<Record<ArchetypeId, Resonance>> = {
  seeker: { cards: ['major-00-fool', 'major-09-hermit', 'major-17-star'], symbols: ['lantern', 'star', 'key'] },
  guardian: { cards: ['major-04-emperor', 'major-08-strength', 'major-14-temperance'], symbols: ['lily', 'pillars', 'rose'] },
  visionary: { cards: ['major-02-high-priestess', 'major-18-moon', 'major-10-wheel'], symbols: ['eye', 'moon', 'feather'] },
  alchemist: { cards: ['major-13-death', 'major-16-tower', 'major-15-devil'], symbols: ['phoenix', 'serpent', 'chalice'] },
  wanderer: { cards: ['major-07-chariot', 'major-06-lovers', 'major-21-world'], symbols: ['feather', 'wheel', 'wheat'] },
  creator: { cards: ['major-01-magician', 'major-03-empress', 'major-19-sun'], symbols: ['staff', 'sun', 'lotus'] },
  sage: { cards: ['major-05-hierophant', 'major-11-justice', 'major-12-hanged-man'], symbols: ['owl', 'key', 'scales'] },
  renewer: { cards: ['major-13-death', 'major-20-judgement', 'major-17-star'], symbols: ['lotus', 'butterfly', 'lemniscate'] },
};
