/**
 * Keys of the content module `angels` (V06.3, CONTENT_MASTERPLAN §3, §6): six texts per curated
 * sequence, a keyword and a meaning per digit, one text per pattern (160 per language). Structure
 * only; reading the input and composing a reading happen in `src/domain/angel.ts`.
 */
import { ANGEL_PATTERNS, CURATED_SEQUENCES, DIGITS } from '../../domain/angel.ts';

export const SEQUENCE_PARTS = ['title', 'meaning', 'light', 'shadow', 'reflection', 'ritual'] as const;

export function angelsKeys(): string[] {
  return [
    ...CURATED_SEQUENCES.flatMap((s) => SEQUENCE_PARTS.map((p) => `seq.${s}.${p}`)),
    ...DIGITS.flatMap((d) => [`digit.${d}.keyword`, `digit.${d}.meaning`]),
    ...ANGEL_PATTERNS.map((p) => `pattern.${p}`),
  ];
}
