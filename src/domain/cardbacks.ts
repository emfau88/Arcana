/**
 * Card backs (V05.5, D-66): the standard back plus three that open on the journey (days 2, 5
 * and 10). Which backs are open is derived from the journey day, which never drops (D-09); only
 * the choice itself is stored (`Settings.cardBack`). Backs are never for sale and a back that is
 * not open yet is never shown. The Edition back (A31) is not part of this set (billing, E14).
 */
import { FIXED_MILESTONES } from './progress.ts';

export const CARD_BACKS = ['standard', 'crescent', 'compass', 'golden-wheel'] as const;
export type CardBackId = (typeof CARD_BACKS)[number];
export const DEFAULT_BACK: CardBackId = 'standard';

export const isCardBackId = (v: unknown): v is CardBackId => typeof v === 'string' && (CARD_BACKS as readonly string[]).includes(v);

/** Journey day on which a back opens, read from the milestone table (standard: always). */
export function backOpensOn(id: CardBackId): number {
  if (id === DEFAULT_BACK) return 0;
  const m = FIXED_MILESTONES.find((x) => x.rewards.some((r) => r.id === `cardback:${id}`));
  return m ? m.day : Number.POSITIVE_INFINITY;
}

/** Backs open on this journey day, in the order they open (standard first). */
export function openBacks(journeyDays: number): CardBackId[] {
  return CARD_BACKS.filter((id) => backOpensOn(id) <= journeyDays);
}

/** The back to draw: the chosen one if it is open, otherwise the standard back. */
export function activeBack(choice: string | undefined, journeyDays: number): CardBackId {
  return isCardBackId(choice) && backOpensOn(choice) <= journeyDays ? choice : DEFAULT_BACK;
}
