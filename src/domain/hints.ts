/**
 * Discovery hint of the day (V04.3, PRODUCT_SYSTEMS A6/A9).
 * At most one hint per day, priority milestone > card level > world introduction. A hint only
 * points to content the build really contains (D-54: nothing is announced before it exists), so
 * every reward is mapped to the feature that shows it and checked against the available set.
 */
import { milestoneAt, type Reward } from './progress.ts';
import type { CardId } from './types.ts';

/** Parts of the app a reward can live in. */
export type Feature =
  | 'archetype-chapters' // Kapitel I–IV and the second-voice chapter (V04)
  | 'reviews' // weekly and monthly reviews (V04.5)
  | 'jubilees' // hundred-day and jubilee reviews, yearbook, constellation "Hundred" (not built yet)
  | 'starmap' // constellations (V04.5)
  | 'review-spread' // V05
  | 'grimoire-book' // cover, Ex Libris (V05)
  | 'cardbacks' // V05
  | 'worlds' // numbers, angel numbers, symbols introductions (V06)
  | 'symbols' // personal symbol (V06)
  | 'design-unlocks'; // jubilee pool (ribbon, laurel, dawn sky)

/** Which feature shows a reward. Unknown rewards map to null and are never hinted. */
export function rewardFeature(rewardId: string): Feature | null {
  const [kind, sub] = rewardId.split(':');
  switch (kind) {
    case 'archetype-chapter':
      return 'archetype-chapters';
    case 'review':
      return sub === 'week' || sub === 'month' ? 'reviews' : 'jubilees';
    case 'yearbook':
      return 'jubilees';
    case 'constellation':
      return sub === 'hundred' ? 'jubilees' : 'starmap';
    case 'review-spread':
      return 'review-spread';
    case 'grimoire-cover':
    case 'ex-libris':
      return 'grimoire-book';
    case 'cardback':
      return 'cardbacks';
    case 'world-intro':
      return 'worlds';
    case 'personal-symbol':
      return 'symbols';
    case 'ribbon':
    case 'ornaments':
    case 'sky':
      return 'design-unlocks';
    default:
      return null;
  }
}

/**
 * Features this build ships. Each package adds its own entry when the content is really there,
 * so no hint ever points to an empty page. V04: chapters, weekly/monthly reviews, star map. V05.5: card backs.
 */
export const BUILD_FEATURES: ReadonlySet<Feature> = new Set<Feature>(['archetype-chapters', 'reviews', 'starmap', 'cardbacks']);

export type HintKind = 'milestone' | 'card-level' | 'world';

export interface Hint {
  kind: HintKind;
  /** Reward id (milestone, world) or `level:<cardId>:<level>` (card level). */
  id: string;
}

const PRIORITY: readonly HintKind[] = ['milestone', 'card-level', 'world'];

export interface HintInput {
  /** Journey day the person stands on today. */
  journeyDay: number;
  /** Features this build contains. */
  features: ReadonlySet<Feature>;
  /** Cards that reached a new level today (V05; empty before). */
  levelUps?: ReadonlyArray<{ cardId: CardId; level: number }>;
}

/** World introductions are milestones of their own kind with the lowest priority (A9). */
const isWorld = (r: Reward) => r.id.startsWith('world-intro:');

/** The one hint of the day, or null. Pure: same input, same hint. */
export function hintForToday(input: HintInput): Hint | null {
  const rewards = (milestoneAt(input.journeyDay)?.rewards ?? []).filter((r) => {
    const f = rewardFeature(r.id);
    return f !== null && input.features.has(f);
  });
  const candidates: Hint[] = [
    ...rewards.filter((r) => !isWorld(r)).map((r) => ({ kind: 'milestone' as const, id: r.id })),
    ...(input.levelUps ?? []).map((u) => ({ kind: 'card-level' as const, id: `level:${u.cardId}:${u.level}` })),
    ...rewards.filter(isWorld).map((r) => ({ kind: 'world' as const, id: r.id })),
  ];
  candidates.sort((a, b) => PRIORITY.indexOf(a.kind) - PRIORITY.indexOf(b.kind));
  return candidates[0] ?? null;
}
