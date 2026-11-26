// Registry: content assetId -> illustration. Every card in src/content must have an entry here
// (scripts/validate-content.ts fails if a rendered file is missing).
import { highPriestess, tower, sun, back } from './cards.mjs';
import { fool, magician, empress, emperor, hierophant, lovers, chariot } from './major-a.mjs';
import { strength, hermit, wheel, justice, hangedMan, death, temperance, devil } from './major-b.mjs';
import { star, moon, judgement, world } from './major-c.mjs';

/** [assetId, roman numeral, render function] in deck order. */
export const DECK_ART = [
  ['card-fool', '0', fool],
  ['card-magician', 'I', magician],
  ['card-high-priestess', 'II', highPriestess],
  ['card-empress', 'III', empress],
  ['card-emperor', 'IV', emperor],
  ['card-hierophant', 'V', hierophant],
  ['card-lovers', 'VI', lovers],
  ['card-chariot', 'VII', chariot],
  ['card-strength', 'VIII', strength],
  ['card-hermit', 'IX', hermit],
  ['card-wheel', 'X', wheel],
  ['card-justice', 'XI', justice],
  ['card-hanged-man', 'XII', hangedMan],
  ['card-death', 'XIII', death],
  ['card-temperance', 'XIV', temperance],
  ['card-devil', 'XV', devil],
  ['card-tower', 'XVI', tower],
  ['card-star', 'XVII', star],
  ['card-moon', 'XVIII', moon],
  ['card-sun', 'XIX', sun],
  ['card-judgement', 'XX', judgement],
  ['card-world', 'XXI', world],
];

export const CARD_BACK = ['card-back', '', back];
