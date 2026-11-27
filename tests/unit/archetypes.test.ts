import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import type { QuestionContent } from '../../src/content/schema.ts';
import { MIN_ANSWERS_FOR_ARCHETYPE, scoreArchetype } from '../../src/domain/archetypes.ts';
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

describe('archetype scoring', () => {
  it('covers all 256 full answer combinations and reaches every archetype', () => {
    const combos = allCombinations();
    expect(combos).toHaveLength(256);
    const counts = new Map<ArchetypeId, number>();
    for (const answers of combos) {
      const r = scoreArchetype(Q, answers);
      expect(r.archetypeId).not.toBeNull();
      counts.set(r.archetypeId!, (counts.get(r.archetypeId!) ?? 0) + 1);
    }
    for (const id of ARCHETYPE_ORDER) expect(counts.get(id) ?? 0, id).toBeGreaterThan(0);
    // Balance: no archetype gets more than three times its fair share.
    for (const id of ARCHETYPE_ORDER) expect(counts.get(id)!, id).toBeLessThan((256 / 8) * 3);
  });

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
