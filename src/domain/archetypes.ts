import type { QuestionContent } from '../content/schema.ts';
import { ARCHETYPE_ORDER, type Answers, type ArchetypeId } from './types.ts';

export const PRIMARY_WEIGHT = 2;
export const SECONDARY_WEIGHT = 1;
/** Fewer answered questions give a neutral profile instead of an invented one. */
export const MIN_ANSWERS_FOR_ARCHETYPE = 2;
export const PROFILE_VERSION = 1;

export interface ScoreResult {
  archetypeId: ArchetypeId | null;
  scores: Record<ArchetypeId, number>;
  answeredCount: number;
  /** Why the result was chosen; shown nowhere, used by tests and docs. */
  reason: 'neutral-too-few-answers' | 'highest-score' | 'tie-primary-hits' | 'tie-earliest-primary' | 'tie-canonical-order';
}

function emptyScores(): Record<ArchetypeId, number> {
  return Object.fromEntries(ARCHETYPE_ORDER.map((id) => [id, 0])) as Record<ArchetypeId, number>;
}

/**
 * Transparent local scoring.
 * 1. Each chosen answer adds +2 to its primary and +1 to its secondary archetype.
 * 2. Fewer than MIN_ANSWERS_FOR_ARCHETYPE answers -> neutral (null).
 * 3. Highest total wins. Ties are broken, in this order, by:
 *    a) more primary hits,
 *    b) primary hit in the earliest answered question (question order = importance),
 *    c) canonical archetype order (ARCHETYPE_ORDER).
 * The result only changes when the answers change.
 */
export function scoreArchetype(questions: readonly QuestionContent[], answers: Answers): ScoreResult {
  const scores = emptyScores();
  const primaryHits = emptyScores();
  const firstPrimaryIndex: Partial<Record<ArchetypeId, number>> = {};
  let answeredCount = 0;

  questions.forEach((q, qi) => {
    const answerId = answers[q.id];
    if (answerId === undefined) return;
    const answer = q.answers.find((a) => a.id === answerId);
    if (!answer) return; // unknown ids (e.g. from an older questionnaire) are ignored, not guessed
    answeredCount++;
    scores[answer.primary] += PRIMARY_WEIGHT;
    scores[answer.secondary] += SECONDARY_WEIGHT;
    primaryHits[answer.primary] += 1;
    if (firstPrimaryIndex[answer.primary] === undefined) firstPrimaryIndex[answer.primary] = qi;
  });

  if (answeredCount < MIN_ANSWERS_FOR_ARCHETYPE) {
    return { archetypeId: null, scores, answeredCount, reason: 'neutral-too-few-answers' };
  }

  const max = Math.max(...ARCHETYPE_ORDER.map((id) => scores[id]));
  let tied = ARCHETYPE_ORDER.filter((id) => scores[id] === max);
  if (tied.length === 1) return { archetypeId: tied[0] ?? null, scores, answeredCount, reason: 'highest-score' };

  const maxHits = Math.max(...tied.map((id) => primaryHits[id]));
  tied = tied.filter((id) => primaryHits[id] === maxHits);
  if (tied.length === 1) return { archetypeId: tied[0] ?? null, scores, answeredCount, reason: 'tie-primary-hits' };

  const idx = (id: ArchetypeId) => firstPrimaryIndex[id] ?? Number.POSITIVE_INFINITY;
  const earliest = Math.min(...tied.map(idx));
  const byEarliest = tied.filter((id) => idx(id) === earliest);
  if (byEarliest.length === 1 && Number.isFinite(earliest)) {
    return { archetypeId: byEarliest[0] ?? null, scores, answeredCount, reason: 'tie-earliest-primary' };
  }

  // Canonical order: `tied` is already filtered from ARCHETYPE_ORDER, so the first is canonical.
  return { archetypeId: byEarliest[0] ?? tied[0] ?? null, scores, answeredCount, reason: 'tie-canonical-order' };
}
