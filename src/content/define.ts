import type { CardContent, CardTone } from './schema.ts';

export const DECK_ID = 'nocturne';

/**
 * Defines a major-arcana card with derived, stable ids:
 * id `major-<NN>-<slug>`, asset `card-<slug>` (public/cards/card-<slug>.webp).
 * Replacing the artwork later only means replacing that WebP file (see docs/ASSET_LICENSES.md).
 */
export function major(order: number, slug: string, tone: CardTone, body: Omit<CardContent, 'id' | 'deckId' | 'order' | 'assetId' | 'tone'>): CardContent {
  return {
    id: `major-${String(order).padStart(2, '0')}-${slug}`,
    deckId: DECK_ID,
    order,
    assetId: `card-${slug}`,
    tone,
    ...body,
  };
}
