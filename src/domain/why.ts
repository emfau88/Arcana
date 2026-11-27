/**
 * "Why this archetype?" (V04.2, PRODUCT_SYSTEMS C3). Lists the person's own answers with the
 * points they gave, the totals in the order of the scoring rule and why there is a second voice
 * or not. Recomputed from the stored answers with the same rule as the result, so the explanation
 * always matches the calculation and never reads like a diagnosis.
 */
import type { QuestionContent } from '../content/schema.ts';
import {
  MIN_ANSWERS_FOR_ARCHETYPE,
  MIN_ANSWERS_FOR_COMPLEMENT,
  PRIMARY_WEIGHT,
  SECONDARY_WEIGHT,
  rankArchetypes,
  scoreArchetype,
  type ScoreResult,
} from './archetypes.ts';
import type { Answers, ArchetypeId } from './types.ts';

export interface WhyLine {
  questionId: string;
  answerId: string;
  /** Gets PRIMARY_WEIGHT points. */
  primary: ArchetypeId;
  /** Gets SECONDARY_WEIGHT points. */
  secondary: ArchetypeId;
}

export type WhyComplement =
  /** Second voice named: it is `gap` (0 or 1) points behind the main archetype. */
  | { kind: 'named'; archetypeId: ArchetypeId; gap: number }
  /** The next archetype is too far behind. */
  | { kind: 'gap-too-large'; archetypeId: ArchetypeId; gap: number }
  /** Too few answers to name a second voice. */
  | { kind: 'too-few-answers'; answered: number; needed: number }
  /** No main archetype (open profile), so no second voice either. */
  | { kind: 'no-main' };

export interface Why {
  /** Answered questions in questionnaire order. Unknown or skipped answers are left out. */
  lines: WhyLine[];
  /** Archetypes with points, in the order of the scoring rule. */
  totals: Array<{ archetypeId: ArchetypeId; points: number }>;
  result: ScoreResult;
  complement: WhyComplement;
  weights: { primary: number; secondary: number };
  /** Answers needed for a main archetype. */
  minAnswers: number;
}

export function explainArchetype(questions: readonly QuestionContent[], answers: Answers): Why {
  const result = scoreArchetype(questions, answers);
  const lines: WhyLine[] = [];
  for (const q of questions) {
    const answerId = answers[q.id];
    const answer = answerId === undefined ? undefined : q.answers.find((a) => a.id === answerId);
    if (answer) lines.push({ questionId: q.id, answerId: answer.id, primary: answer.primary, secondary: answer.secondary });
  }
  const ranking = rankArchetypes(questions, answers);
  const totals = ranking.filter((id) => result.scores[id] > 0).map((id) => ({ archetypeId: id, points: result.scores[id] }));
  return {
    lines,
    totals,
    result,
    complement: complementWhy(result, ranking),
    weights: { primary: PRIMARY_WEIGHT, secondary: SECONDARY_WEIGHT },
    minAnswers: MIN_ANSWERS_FOR_ARCHETYPE,
  };
}

function complementWhy(result: ScoreResult, ranking: readonly ArchetypeId[]): WhyComplement {
  const main = result.archetypeId;
  if (!main) return { kind: 'no-main' };
  if (result.answeredCount < MIN_ANSWERS_FOR_COMPLEMENT) return { kind: 'too-few-answers', answered: result.answeredCount, needed: MIN_ANSWERS_FOR_COMPLEMENT };
  const next = ranking.find((id) => id !== main);
  if (!next) return { kind: 'no-main' };
  const gap = result.scores[main] - result.scores[next];
  if (result.complementId === next) return { kind: 'named', archetypeId: next, gap };
  return { kind: 'gap-too-large', archetypeId: next, gap };
}
