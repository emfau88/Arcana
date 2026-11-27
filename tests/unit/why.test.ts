import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import { rankArchetypes, scoreArchetype } from '../../src/domain/archetypes.ts';
import type { Answers } from '../../src/domain/types.ts';
import { explainArchetype } from '../../src/domain/why.ts';

const Q = CONTENT.questions;

function* allCombinations(): Generator<Answers> {
  const n = Q.length;
  for (let code = 0; code < 4 ** n; code++) {
    const a: Record<string, string> = {};
    let c = code;
    Q.forEach((q) => {
      a[q.id] = q.answers[c % 4]!.id;
      c = Math.floor(c / 4);
    });
    yield a;
  }
}

describe('"Why this archetype?" (V04.2, C3)', () => {
  it('matches the calculation exactly (fixed example)', () => {
    const answers: Answers = {
      'q-calling': 'a-question',
      'q-decision': 'a-known',
      'q-place': 'a-road',
      'q-invite': 'a-direction',
      'q-evening': 'a-read',
      'q-ease': 'a-connect',
      'q-change': 'a-curious',
    };
    const why = explainArchetype(Q, answers);
    expect(why.lines).toEqual([
      { questionId: 'q-calling', answerId: 'a-question', primary: 'seeker', secondary: 'sage' },
      { questionId: 'q-decision', answerId: 'a-known', primary: 'sage', secondary: 'guardian' },
      { questionId: 'q-place', answerId: 'a-road', primary: 'wanderer', secondary: 'seeker' },
      { questionId: 'q-invite', answerId: 'a-direction', primary: 'seeker', secondary: 'creator' },
      { questionId: 'q-evening', answerId: 'a-read', primary: 'sage', secondary: 'seeker' },
      { questionId: 'q-ease', answerId: 'a-connect', primary: 'sage', secondary: 'visionary' },
      { questionId: 'q-change', answerId: 'a-curious', primary: 'seeker', secondary: 'visionary' },
    ]);
    // Wanderer and visionary tie at 2: the wanderer has a primary hit. Guardian and creator tie
    // at 1 without primary hits: canonical order.
    expect(why.totals).toEqual([
      { archetypeId: 'seeker', points: 8 },
      { archetypeId: 'sage', points: 7 },
      { archetypeId: 'wanderer', points: 2 },
      { archetypeId: 'visionary', points: 2 },
      { archetypeId: 'guardian', points: 1 },
      { archetypeId: 'creator', points: 1 },
    ]);
    expect(why.result.archetypeId).toBe('seeker');
    expect(why.complement).toEqual({ kind: 'named', archetypeId: 'sage', gap: 1 });
    expect(why.weights).toEqual({ primary: 2, secondary: 1 });
  });

  it('says why there is no second voice: gap too large', () => {
    const why = explainArchetype(Q, { 'q-calling': 'a-question', 'q-decision': 'a-image', 'q-invite': 'a-direction', 'q-change': 'a-curious' });
    expect(why.result.archetypeId).toBe('seeker');
    expect(why.complement).toEqual({ kind: 'gap-too-large', archetypeId: 'visionary', gap: 4 });
  });

  it('says why there is no second voice: too few answers', () => {
    const why = explainArchetype(Q, { 'q-calling': 'a-question', 'q-decision': 'a-image', 'q-invite': 'a-direction' });
    expect(why.complement).toEqual({ kind: 'too-few-answers', answered: 3, needed: 4 });
  });

  it('shows an open profile honestly and ignores unknown answers', () => {
    const why = explainArchetype(Q, { 'q-calling': 'a-question', 'q-decision': 'a-gone', 'q-unknown': 'a-x' });
    expect(why.lines).toHaveLength(1);
    expect(why.result.archetypeId).toBeNull();
    expect(why.complement).toEqual({ kind: 'no-main' });
    expect(why.minAnswers).toBe(2);
  });

  it('agrees with the scoring for all 16,384 answer combinations', () => {
    let checked = 0;
    for (const answers of allCombinations()) {
      const score = scoreArchetype(Q, answers);
      const ranking = rankArchetypes(Q, answers);
      expect(ranking[0]).toBe(score.archetypeId);
      const why = explainArchetype(Q, answers);
      expect(why.totals.reduce((s, t) => s + t.points, 0)).toBe(3 * Q.length);
      if (score.complementId) expect(why.complement).toEqual({ kind: 'named', archetypeId: score.complementId, gap: expect.any(Number) });
      else expect(why.complement.kind).toBe('gap-too-large');
      checked++;
    }
    expect(checked).toBe(4 ** 7);
  });
});
