/**
 * What the journey has opened so far (V04.4/V04.5), derived from stored facts only (D-09):
 * weekly and monthly reviews, the archetype chapters and the "new" markers. Nothing is counted
 * or stored besides the seen flags, which only hide the marker.
 */
import { CHAPTER_DAY, chaptersOpen, type ChapterId } from '../content/modules/chapter-keys.ts';
import type { QuestionContent } from '../content/schema.ts';
import { rankArchetypes, scoreArchetype } from './archetypes.ts';
import { BUILD_FEATURES, rewardFeature } from './hints.ts';
import { journeyDays, milestoneAt, REVIEW_SPAN, type Facts, type Milestone, type Reward } from './progress.ts';
import type { ReviewKind } from './progress.ts';
import type { ArchetypeId, Profile } from './types.ts';

export interface ReviewEntry {
  kind: ReviewKind;
  index: number;
  /** Journey day on which it opened (also its sort key). */
  day: number;
  /** Seen flag = reward id of the milestone that opened it. */
  key: string;
}

/** Reviews of completed periods, newest first (a period counts once all its journey days exist). */
export function availableReviews(facts: Facts): ReviewEntry[] {
  const days = journeyDays(facts);
  const out: ReviewEntry[] = [];
  for (const kind of ['week', 'month'] as const) {
    const span = REVIEW_SPAN[kind];
    for (let i = 1; i * span <= days; i++) out.push({ kind, index: i, day: i * span, key: `review:${kind}:${i}` });
  }
  // Newest first; on the same day the month comes before the week (day 210 = week 30 and month 7).
  return out.sort((a, b) => b.day - a.day || (a.kind === b.kind ? 0 : a.kind === 'month' ? -1 : 1));
}

export interface ChapterEntry {
  id: ChapterId;
  /** Whose text it is: the main archetype for I–IV, the second voice or "other side" for the last. */
  archetypeId: ArchetypeId;
  /** Only for the last chapter: 'two-voices' with a second voice, otherwise 'other-side'. */
  variant: 'main' | 'two-voices' | 'other-side';
  day: number;
  key: string;
}

/**
 * Open chapters in reading order. Without a main archetype there are none. The day-100 chapter is
 * "Two voices" with a second voice, otherwise "The other side": the archetype with the second
 * highest score (PROGRESSION_DESIGN §3.2); without points for any other archetype it is left out.
 */
export function availableChapters(facts: Facts, profile: Profile | null, questions: readonly QuestionContent[]): ChapterEntry[] {
  const main = profile?.archetypeId ?? null;
  if (!main) return [];
  const out: ChapterEntry[] = [];
  for (const id of chaptersOpen(journeyDays(facts))) {
    const base = { id, day: CHAPTER_DAY[id], key: `archetype-chapter:${id}` };
    if (id !== 'second-voice') {
      out.push({ ...base, archetypeId: main, variant: 'main' });
      continue;
    }
    if (profile?.secondaryArchetypeId) {
      out.push({ ...base, archetypeId: profile.secondaryArchetypeId, variant: 'two-voices' });
      continue;
    }
    const scores = scoreArchetype(questions, profile?.answers ?? {}).scores;
    const other = rankArchetypes(questions, profile?.answers ?? {}).find((a) => a !== main);
    if (other && scores[other] > 0) out.push({ ...base, archetypeId: other, variant: 'other-side' });
  }
  return out;
}

const seenSet = (seen: ReadonlyArray<{ key: string }>) => new Set(seen.map((s) => s.key));

/** Keys of opened reviews and chapters that have not been looked at yet ("Neu"). */
export function unseenKeys(entries: ReadonlyArray<{ key: string }>, seen: ReadonlyArray<{ key: string }>): Set<string> {
  const s = seenSet(seen);
  return new Set(entries.map((e) => e.key).filter((k) => !s.has(k)));
}

/** Rewards of a milestone that this build can really show (D-54: nothing announced early). */
export function builtRewards(m: Milestone): Reward[] {
  return m.rewards.filter((r) => {
    const f = rewardFeature(r.id);
    return f !== null && BUILD_FEATURES.has(f);
  });
}

/**
 * The milestone moment of today (A6): the milestone of the journey day reached today, once
 * (seen flag), and only when it opens something this build contains.
 */
export function milestoneMoment(facts: Facts, todayRecorded: boolean, seen: ReadonlyArray<{ key: string }>): { milestone: Milestone; rewards: Reward[] } | null {
  if (!todayRecorded) return null;
  const m = milestoneAt(journeyDays(facts));
  if (!m || seenSet(seen).has(m.key)) return null;
  const rewards = builtRewards(m);
  return rewards.length ? { milestone: m, rewards } : null;
}
