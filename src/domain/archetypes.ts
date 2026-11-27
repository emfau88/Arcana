import type { QuestionContent } from '../content/schema.ts';
import { ARCHETYPE_ORDER, type Answers, type ArchetypeId } from './types.ts';

export const PRIMARY_WEIGHT = 2;
export const SECONDARY_WEIGHT = 1;
/** Fewer answered questions give a neutral profile instead of an invented one. */
export const MIN_ANSWERS_FOR_ARCHETYPE = 2;
export const PROFILE_VERSION = 1;
/** 1 = four questions (0.1–0.3), 2 = seven questions (V04.1). A missing field in a stored profile means 1. */
export const QUESTIONNAIRE_VERSION = 2;
/**
 * A complement archetype is named only when the second-highest score reaches this share of the
 * main score (D-53: 75 % instead of the 60 % first sketched in PRODUCT_SYSTEMS C2, because only 75 %
 * meets both acceptance ranges, complement in 40–70 % and none in 20–40 % of all combinations).
 */
export const COMPLEMENT_THRESHOLD = 0.75;

export interface ScoreResult {
  archetypeId: ArchetypeId | null;
  /** Second voice: the next archetype by the same ranking, only at >= COMPLEMENT_THRESHOLD of the main score. */
  complementId: ArchetypeId | null;
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
 * 4. Complement: the next archetype in the same order, if its score reaches COMPLEMENT_THRESHOLD
 *    of the main score; otherwise none (not everyone has a clear second voice).
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
    return { archetypeId: null, complementId: null, scores, answeredCount, reason: 'neutral-too-few-answers' };
  }

  // Same order as the main rule: score, primary hits, earliest primary question, canonical order.
  const idx = (id: ArchetypeId) => firstPrimaryIndex[id] ?? Number.POSITIVE_INFINITY;
  const outranks = (a: ArchetypeId, b: ArchetypeId): boolean => {
    if (scores[a] !== scores[b]) return scores[a] > scores[b];
    if (primaryHits[a] !== primaryHits[b]) return primaryHits[a] > primaryHits[b];
    if (idx(a) !== idx(b)) return idx(a) < idx(b);
    return ARCHETYPE_ORDER.indexOf(a) < ARCHETYPE_ORDER.indexOf(b);
  };
  const complementOf = (main: ArchetypeId | null): ArchetypeId | null => {
    if (!main || scores[main] <= 0) return null;
    let second: ArchetypeId | null = null;
    for (const id of ARCHETYPE_ORDER) if (id !== main && (second === null || outranks(id, second))) second = id;
    return second !== null && scores[second] > 0 && scores[second] >= COMPLEMENT_THRESHOLD * scores[main] ? second : null;
  };
  const result = (archetypeId: ArchetypeId | null, reason: ScoreResult['reason']): ScoreResult => ({
    archetypeId,
    complementId: complementOf(archetypeId),
    scores,
    answeredCount,
    reason,
  });

  const max = Math.max(...ARCHETYPE_ORDER.map((id) => scores[id]));
  let tied = ARCHETYPE_ORDER.filter((id) => scores[id] === max);
  if (tied.length === 1) return result(tied[0] ?? null, 'highest-score');

  const maxHits = Math.max(...tied.map((id) => primaryHits[id]));
  tied = tied.filter((id) => primaryHits[id] === maxHits);
  if (tied.length === 1) return result(tied[0] ?? null, 'tie-primary-hits');

  const earliest = Math.min(...tied.map(idx));
  const byEarliest = tied.filter((id) => idx(id) === earliest);
  if (byEarliest.length === 1 && Number.isFinite(earliest)) {
    return result(byEarliest[0] ?? null, 'tie-earliest-primary');
  }

  // Canonical order: `tied` is already filtered from ARCHETYPE_ORDER, so the first is canonical.
  return result(byEarliest[0] ?? tied[0] ?? null, 'tie-canonical-order');
}
