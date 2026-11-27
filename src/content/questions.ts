import type { QuestionContent } from './schema.ts';

/**
 * Structure of the questionnaire: ids and weights only. The texts live in the content module
 * `identity` (question.<questionId>.prompt, question.<questionId>.<answerId>), loaded per locale.
 *
 * Questionnaire v2 (V04.1, QUESTIONNAIRE_VERSION 2): seven voluntary questions, four answers each.
 * The first four are unchanged from v1 (same ids, same weights), so answers given in 0.1–0.3 keep
 * their meaning. The weights of the three new questions were chosen by a search over all
 * 4^7 = 16,384 answer combinations (tests/unit/archetypes.test.ts checks the result):
 * every archetype is the main archetype in 10–15 % of the combinations, a complement exists in
 * 40–70 % of them and all 56 main/complement pairs are reachable.
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
  {
    id: 'q-evening',
    answers: [
      { id: 'a-images', primary: 'visionary', secondary: 'wanderer' },
      { id: 'a-walk', primary: 'alchemist', secondary: 'wanderer' },
      { id: 'a-calm', primary: 'guardian', secondary: 'renewer' },
      { id: 'a-read', primary: 'sage', secondary: 'seeker' },
    ],
  },
  {
    id: 'q-ease',
    answers: [
      { id: 'a-setback', primary: 'alchemist', secondary: 'seeker' },
      { id: 'a-connect', primary: 'sage', secondary: 'visionary' },
      { id: 'a-onward', primary: 'wanderer', secondary: 'renewer' },
      { id: 'a-try', primary: 'creator', secondary: 'seeker' },
    ],
  },
  {
    id: 'q-change',
    answers: [
      { id: 'a-curious', primary: 'seeker', secondary: 'visionary' },
      { id: 'a-shape', primary: 'creator', secondary: 'renewer' },
      { id: 'a-hold', primary: 'guardian', secondary: 'visionary' },
      { id: 'a-release', primary: 'renewer', secondary: 'wanderer' },
    ],
  },
];
