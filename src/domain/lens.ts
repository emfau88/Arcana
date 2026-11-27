/**
 * Archetype lens of the daily card (V04.3, PRODUCT_SYSTEMS A3).
 * One sentence per archetype × card lives in the content module `identity` (`lens.<id>.<cardId>`).
 * With a complement archetype, every third journey day reads the card through the complement.
 * The choice is made once when the daily record is created and stored with it (variant index),
 * so later profile changes never alter past days (D-09, PR-07).
 */
import { ARCHETYPE_ORDER, type ArchetypeId, type CardId, type DailyRecord } from './types.ts';

/** Every n-th journey day speaks through the complement (if there is one). */
export const COMPLEMENT_LENS_EVERY = 3;

export type LensSource = 'main' | 'complement';

/** Variant index stored in `DailyRecord.variant.lens`: 0 main archetype, 1 complement. */
export const LENS_VARIANT: Readonly<Record<LensSource, number>> = { main: 0, complement: 1 };

export function lensKey(archetypeId: ArchetypeId, cardId: CardId): string {
  return `lens.${archetypeId}.${cardId}`;
}

/** Whose lens a journey day uses. Without a complement it is always the main archetype. */
export function lensSourceForDay(journeyDay: number, complementId: ArchetypeId | null | undefined): LensSource {
  return complementId && Number.isInteger(journeyDay) && journeyDay > 0 && journeyDay % COMPLEMENT_LENS_EVERY === 0 ? 'complement' : 'main';
}

const isArchetype = (v: unknown): v is ArchetypeId => typeof v === 'string' && (ARCHETYPE_ORDER as readonly string[]).includes(v);

/**
 * The archetype whose lens a stored daily record shows. Reads only stored fields, so the answer
 * never changes; a broken or missing variant falls back to the main archetype of that day.
 */
export function lensArchetypeOf(record: Pick<DailyRecord, 'archetypeId' | 'variant' | 'secondaryArchetypeId'>): ArchetypeId | null {
  if (record.variant?.lens === LENS_VARIANT.complement && isArchetype(record.secondaryArchetypeId)) return record.secondaryArchetypeId;
  return record.archetypeId;
}
