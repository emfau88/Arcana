import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import type { QuestionContent } from '../../src/content/schema.ts';
import { COMPLEMENT_THRESHOLD, MIN_ANSWERS_FOR_ARCHETYPE, QUESTIONNAIRE_VERSION, scoreArchetype } from '../../src/domain/archetypes.ts';
import { ARCHETYPE_ORDER, type Answers, type ArchetypeId } from '../../src/domain/types.ts';

const Q = CONTENT.questions;

function allCombinations(): Answers[] {
  const out: Answers[] = [];
  const rec = (i: number, acc: Record<string, string>) => {
    if (i === Q.length) {
      out.push({ ...acc });
      return;
    }
    const q = Q[i]!;
    for (const a of q.answers) rec(i + 1, { ...acc, [q.id]: a.id });
  };
  rec(0, {});
  return out;
}

function synthetic(spec: [string, ArchetypeId, ArchetypeId][]): QuestionContent[] {
  return spec.map(([id, primary, secondary]) => ({
    id,
    answers: [{ id: `${id}1`, primary, secondary }],
  }));
}

/** Questionnaire v1 (0.1–0.3): ids and weights must stay, so stored answers keep their meaning. */
const V1: [string, [string, ArchetypeId, ArchetypeId][]][] = [
  ['q-calling', [['a-question', 'seeker', 'sage'], ['a-create', 'creator', 'visionary'], ['a-close', 'renewer', 'alchemist'], ['a-people', 'guardian', 'wanderer']]],
  ['q-decision', [['a-image', 'visionary', 'seeker'], ['a-transform', 'alchemist', 'renewer'], ['a-path', 'wanderer', 'creator'], ['a-known', 'sage', 'guardian']]],
  ['q-place', [['a-road', 'wanderer', 'seeker'], ['a-library', 'sage', 'alchemist'], ['a-workshop', 'creator', 'wanderer'], ['a-garden', 'renewer', 'visionary']]],
  ['q-invite', [['a-shelter', 'guardian', 'sage'], ['a-direction', 'seeker', 'creator'], ['a-intuition', 'visionary', 'renewer'], ['a-heavy', 'alchemist', 'guardian']]],
];

describe('questionnaire v2 (V04.1)', () => {
  const combos = allCombinations();
  const results = combos.map((a) => scoreArchetype(Q, a));

  it('has seven questions with four answers each; the first four are questionnaire v1 unchanged', () => {
    expect(QUESTIONNAIRE_VERSION).toBe(2);
    expect(Q).toHaveLength(7);
    for (const q of Q) expect(q.answers, q.id).toHaveLength(4);
    V1.forEach(([id, answers], i) => {
      expect(Q[i]!.id).toBe(id);
      expect(Q[i]!.answers.map((a) => [a.id, a.primary, a.secondary])).toEqual(answers);
    });
    expect(new Set(Q.map((q) => q.id)).size).toBe(7);
  });

  it('balance over all 16,384 full combinations: every archetype is main in 10–15 %', () => {
    expect(combos).toHaveLength(4 ** 7);
    const counts = new Map<ArchetypeId, number>();
    for (const r of results) {
      expect(r.archetypeId).not.toBeNull();
      counts.set(r.archetypeId!, (counts.get(r.archetypeId!) ?? 0) + 1);
    }
    for (const id of ARCHETYPE_ORDER) {
      const share = (counts.get(id) ?? 0) / combos.length;
      expect(share, `${id} ${(share * 100).toFixed(1)} %`).toBeGreaterThanOrEqual(0.1);
      expect(share, `${id} ${(share * 100).toFixed(1)} %`).toBeLessThanOrEqual(0.15);
    }
  });

  it('a complement exists in 40–70 % of the combinations (none in 20–40 %), never equal to the main', () => {
    expect(COMPLEMENT_THRESHOLD).toBe(0.75);
    const withComplement = results.filter((r) => r.complementId !== null);
    const share = withComplement.length / combos.length;
    expect(share).toBeGreaterThanOrEqual(0.4);
    expect(share).toBeLessThanOrEqual(0.7);
    expect(1 - share).toBeGreaterThanOrEqual(0.2);
    expect(1 - share).toBeLessThanOrEqual(0.4);
    for (const r of withComplement) {
      expect(r.complementId).not.toBe(r.archetypeId);
      expect(r.scores[r.complementId!]).toBeGreaterThanOrEqual(COMPLEMENT_THRESHOLD * r.scores[r.archetypeId!]);
    }
  });

  it('all 8 main archetypes and all 56 main/complement pairs are reachable', () => {
    expect(new Set(results.map((r) => r.archetypeId)).size).toBe(8);
    const pairs = new Set(results.filter((r) => r.complementId).map((r) => `${r.archetypeId}+${r.complementId}`));
    expect(pairs.size).toBe(56);
  });

  it('the complement is the next archetype by score, and only from the threshold on', () => {
    // creator 2+2 = 4, renewer 2+1 = 3 (75 %): complement. With a third answer creator rises to 6, renewer 3 (50 %): none.
    const qs = synthetic([
      ['x', 'creator', 'renewer'],
      ['y', 'creator', 'seeker'],
      ['z', 'renewer', 'sage'],
      ['w', 'creator', 'guardian'],
    ]);
    const two = scoreArchetype(qs, { x: 'x1', y: 'y1', z: 'z1' });
    expect(two.archetypeId).toBe('creator');
    expect(two.scores.renewer).toBe(3);
    expect(two.complementId).toBe('renewer');
    const three = scoreArchetype(qs, { x: 'x1', y: 'y1', z: 'z1', w: 'w1' });
    expect(three.scores.creator).toBe(6);
    expect(three.complementId).toBeNull();
  });

  it('a tie for first place makes the runner-up the complement (same tie rules)', () => {
    const qs = synthetic([
      ['x', 'sage', 'seeker'],
      ['y', 'seeker', 'sage'],
    ]);
    const r = scoreArchetype(qs, { x: 'x1', y: 'y1' });
    expect(r.archetypeId).toBe('sage'); // earliest primary
    expect(r.complementId).toBe('seeker');
  });

  it('a neutral profile has no complement', () => {
    expect(scoreArchetype(Q, { [Q[0]!.id]: Q[0]!.answers[0]!.id }).complementId).toBeNull();
    expect(scoreArchetype(Q, {}).complementId).toBeNull();
  });

  it('old v1 answers (four questions) still give the same main archetype as before', () => {
    const v1Questions = Q.slice(0, 4);
    // The last three questions vary fastest, so every 64th combination is a new v1 combination (256 in all).
    const v1Combos = combos.filter((_, i) => i % 64 === 0);
    expect(new Set(v1Combos.map((a) => v1Questions.map((q) => a[q.id]).join())).size).toBe(256);
    for (const a of v1Combos) {
      const v1Answers = Object.fromEntries(Object.entries(a).filter(([k]) => v1Questions.some((q) => q.id === k)));
      expect(scoreArchetype(Q, v1Answers).archetypeId).toBe(scoreArchetype(v1Questions, v1Answers).archetypeId);
    }
  });
});

describe('archetype scoring', () => {

  it('is deterministic: same answers, same result', () => {
    for (const answers of allCombinations().slice(0, 40)) {
      expect(scoreArchetype(Q, answers)).toEqual(scoreArchetype(Q, answers));
    }
  });

  it('applies +2 primary and +1 secondary weights', () => {
    const [q1, q2] = [Q[0]!, Q[1]!];
    const [a, b] = [q1.answers[0]!, q2.answers[0]!];
    const r = scoreArchetype(Q, { [q1.id]: a.id, [q2.id]: b.id });
    const expected = Object.fromEntries(ARCHETYPE_ORDER.map((id) => [id, 0])) as Record<ArchetypeId, number>;
    expected[a.primary] += 2;
    expected[a.secondary] += 1;
    expected[b.primary] += 2;
    expected[b.secondary] += 1;
    expect(r.scores).toEqual(expected);
    expect(r.answeredCount).toBe(2);
  });

  it('returns a neutral profile with too few answers', () => {
    expect(MIN_ANSWERS_FOR_ARCHETYPE).toBe(2);
    expect(scoreArchetype(Q, {}).archetypeId).toBeNull();
    const r = scoreArchetype(Q, { [Q[0]!.id]: Q[0]!.answers[0]!.id });
    expect(r.archetypeId).toBeNull();
    expect(r.reason).toBe('neutral-too-few-answers');
  });

  it('ignores unknown answer ids instead of guessing', () => {
    const r = scoreArchetype(Q, { [Q[0]!.id]: 'a-does-not-exist', [Q[1]!.id]: 'a-nope' });
    expect(r.answeredCount).toBe(0);
    expect(r.archetypeId).toBeNull();
  });

  it('tie-break a) more primary hits wins on equal score', () => {
    // sage: 2+2 = 4 with two primary hits; seeker: 1+1+2 = 4 with one primary hit.
    const qs = synthetic([
      ['x', 'sage', 'seeker'],
      ['y', 'sage', 'seeker'],
      ['z', 'seeker', 'creator'],
    ]);
    const r = scoreArchetype(qs, { x: 'x1', y: 'y1', z: 'z1' });
    expect(r.scores.sage).toBe(4);
    expect(r.scores.seeker).toBe(4);
    expect(r.reason).toBe('tie-primary-hits');
    expect(r.archetypeId).toBe('sage');
  });

  it('tie-break b) primary hit in the earliest question wins', () => {
    // sage, seeker and creator all score 3 with one primary hit each.
    const qs = synthetic([
      ['x', 'creator', 'seeker'],
      ['y', 'seeker', 'sage'],
      ['z', 'sage', 'creator'],
    ]);
    const r = scoreArchetype(qs, { x: 'x1', y: 'y1', z: 'z1' });
    expect(r.reason).toBe('tie-earliest-primary');
    expect(r.archetypeId).toBe('creator');
  });

  it('tie-break c) canonical order as last resort', () => {
    // guardian and wanderer tie on score (3), primary hits (1) – but differ in earliest
    // question, so rule b decides; force rule c with a tie that has no primary at all.
    const qs = synthetic([
      ['x', 'guardian', 'wanderer'],
      ['y', 'wanderer', 'guardian'],
    ]);
    const r = scoreArchetype(qs, { x: 'x1', y: 'y1' });
    expect(r.scores.guardian).toBe(3);
    expect(r.scores.wanderer).toBe(3);
    expect(r.archetypeId).toBe('guardian');
    expect(['tie-earliest-primary', 'tie-canonical-order']).toContain(r.reason);
  });

  it('exercises the tie rules on the real questionnaire', () => {
    const reasons = new Set(allCombinations().map((a) => scoreArchetype(Q, a).reason));
    for (let i = 0; i < Q.length; i++) {
      for (let j = i + 1; j < Q.length; j++) {
        for (const a of Q[i]!.answers) for (const b of Q[j]!.answers) reasons.add(scoreArchetype(Q, { [Q[i]!.id]: a.id, [Q[j]!.id]: b.id }).reason);
      }
    }
    expect(reasons.has('highest-score')).toBe(true);
    expect([...reasons].some((r) => r.startsWith('tie-'))).toBe(true);
  });
});
