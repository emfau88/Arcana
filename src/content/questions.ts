import type { QuestionContent } from './schema.ts';

/**
 * Structure of the questionnaire: ids and weights only. The texts live in the content module
 * `identity` (question.<questionId>.prompt, question.<questionId>.<answerId>), loaded per locale.
 *
 * Four voluntary questions, four answers each. Every archetype is the primary (+2)
 * weight of exactly two answers and the secondary (+1) weight of exactly two answers,
 * so all eight are reachable and none is structurally favoured (tested).
 */
export const QUESTIONS: readonly QuestionContent[] = [
  {
    id: 'q-calling',
    answers: [
      { id: 'a-question', primary: 'seeker', secondary: 'sage' },
      { id: 'a-create', primary: 'creator', secondary: 'visionary' },
      { id: 'a-close', primary: 'renewer', secondary: 'alchemist' },
      { id: 'a-people', primary: 'guardian', secondary: 'wanderer' },
    ],
  },
  {
    id: 'q-decision',
    answers: [
      { id: 'a-image', primary: 'visionary', secondary: 'seeker' },
      { id: 'a-transform', primary: 'alchemist', secondary: 'renewer' },
      { id: 'a-path', primary: 'wanderer', secondary: 'creator' },
      { id: 'a-known', primary: 'sage', secondary: 'guardian' },
    ],
  },
  {
    id: 'q-place',
    answers: [
      { id: 'a-road', primary: 'wanderer', secondary: 'seeker' },
      { id: 'a-library', primary: 'sage', secondary: 'alchemist' },
      { id: 'a-workshop', primary: 'creator', secondary: 'wanderer' },
      { id: 'a-garden', primary: 'renewer', secondary: 'visionary' },
    ],
  },
  {
    id: 'q-invite',
    answers: [
      { id: 'a-shelter', primary: 'guardian', secondary: 'sage' },
      { id: 'a-direction', primary: 'seeker', secondary: 'creator' },
      { id: 'a-intuition', primary: 'visionary', secondary: 'renewer' },
      { id: 'a-heavy', primary: 'alchemist', secondary: 'guardian' },
    ],
  },
];
