import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import type { Clock } from '../../src/domain/clock.ts';
import { createDailyRecord } from '../../src/domain/oracle.ts';
import { seededRng } from '../../src/domain/random.ts';
import { STARMAP_VIEW, starMapModel, starPosition } from '../../src/domain/starmap.ts';
import type { DailyRecord, Profile } from '../../src/domain/types.ts';
import { availableChapters, availableReviews, builtRewards, milestoneMoment, unseenKeys } from '../../src/domain/unlocks.ts';
import { milestoneAt } from '../../src/domain/progress.ts';

const clock: Clock = { now: () => new Date(2026, 10, 1, 9) };
const base = createDailyRecord({ pack: CONTENT, clock, rng: seededRng(1), themeId: 'self', archetypeId: null, locale: 'de', previousCardId: null });

function key(n: number): string {
  const d = new Date(2026, 0, 1);
  d.setDate(d.getDate() + n - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const days = (n: number): { dailies: DailyRecord[]; readings: [] } => ({
  dailies: Array.from({ length: n }, (_, i) => ({ ...base, dateKey: key(i + 1), revealedAt: `${key(i + 1)}T08:00:00.000Z` })),
  readings: [],
});
const profile = (p: Partial<Profile>): Profile => ({ answers: {}, themeId: 'self', archetypeId: 'seeker', profileVersion: 1, updatedAt: '2026-11-01T00:00:00.000Z', ...p });

describe('star map (V04.5)', () => {
  it('always draws the 21 stations of the current round, whatever the journey day', () => {
    for (const d of [0, 1, 7, 21, 22, 400, 4000]) {
      const m = starMapModel(d);
      expect(m.nodes).toHaveLength(21);
      expect(m.nodes.filter((n) => n.state === 'current')).toHaveLength(1);
    }
  });

  it('marks reached, current and ahead stations and counts finished rounds', () => {
    const m = starMapModel(9);
    expect(m.round).toBe(1);
    expect(m.reached).toBe(9);
    expect(m.nodes.slice(0, 8).every((n) => n.state === 'reached')).toBe(true);
    expect(m.nodes[8]!.state).toBe('current');
    expect(m.nodes.slice(9).every((n) => n.state === 'ahead')).toBe(true);
    expect(starMapModel(20).completedRounds).toBe(0);
    expect(starMapModel(21).completedRounds).toBe(1);
    expect(starMapModel(22)).toMatchObject({ round: 2, reached: 1, completedRounds: 1 });
    expect(starMapModel(400).completedRounds).toBe(19);
  });

  it('keeps every star inside the drawing and the rows apart (serpentine)', () => {
    for (let s = 1; s <= 21; s++) {
      const p = starPosition(s);
      expect(p.x).toBeGreaterThan(0);
      expect(p.x).toBeLessThan(STARMAP_VIEW.width);
      expect(p.y).toBeGreaterThan(20);
      expect(p.y).toBeLessThan(STARMAP_VIEW.height - 20);
    }
    // Station 7 ends the outer path on the right, station 8 starts the inner path on the right.
    expect(starPosition(7).x).toBe(starPosition(8).x);
    expect(starPosition(14).x).toBe(starPosition(15).x);
  });
});

describe('what the journey has opened (V04.4/V04.5)', () => {
  it('opens a review once all its journey days exist, newest first', () => {
    expect(availableReviews(days(6))).toEqual([]);
    expect(availableReviews(days(7)).map((r) => r.key)).toEqual(['review:week:1']);
    const at30 = availableReviews(days(30)).map((r) => r.key);
    expect(at30[0]).toBe('review:month:1');
    expect(at30).toContain('review:week:4');
    expect(at30).toHaveLength(5);
    const at210 = availableReviews(days(210));
    expect(at210[0]).toMatchObject({ kind: 'month', index: 7, day: 210 });
    expect(at210[1]).toMatchObject({ kind: 'week', index: 30, day: 210 });
  });

  it('opens chapters only with a main archetype, on days 3, 21, 42, 63', () => {
    expect(availableChapters(days(30), profile({ archetypeId: null }), CONTENT.questions)).toEqual([]);
    expect(availableChapters(days(2), profile({}), CONTENT.questions)).toEqual([]);
    expect(availableChapters(days(21), profile({}), CONTENT.questions).map((c) => c.id)).toEqual(['1', '2']);
    expect(availableChapters(days(99), profile({}), CONTENT.questions).map((c) => c.id)).toEqual(['1', '2', '3', '4']);
  });

  it('names the day-100 chapter after the second voice, or the archetype with the second most points', () => {
    const withSecond = availableChapters(days(100), profile({ secondaryArchetypeId: 'sage' }), CONTENT.questions).at(-1)!;
    expect(withSecond).toMatchObject({ id: 'second-voice', archetypeId: 'sage', variant: 'two-voices' });
    // Answers: first answer of every question, so there is a clear runner-up.
    const answers = Object.fromEntries(CONTENT.questions.map((q) => [q.id, q.answers[0]!.id]));
    const other = availableChapters(days(100), profile({ answers, secondaryArchetypeId: null }), CONTENT.questions).at(-1)!;
    expect(other.variant).toBe('other-side');
    expect(other.archetypeId).not.toBe('seeker');
    // Chosen by hand without any answers: no runner-up, no invented chapter.
    expect(availableChapters(days(100), profile({ archetypeSource: 'manual' }), CONTENT.questions).map((c) => c.id)).not.toContain('second-voice');
  });

  it('marks opened entries as new until they are seen', () => {
    const reviews = availableReviews(days(14));
    expect([...unseenKeys(reviews, [])].sort()).toEqual(['review:week:1', 'review:week:2']);
    expect([...unseenKeys(reviews, [{ key: 'review:week:1' }])]).toEqual(['review:week:2']);
  });

  it('shows the milestone moment once, only when today is recorded and it opens something built', () => {
    const seen: { key: string }[] = [];
    expect(milestoneMoment(days(3), false, seen)).toBeNull();
    expect(milestoneMoment(days(3), true, seen)?.rewards.map((r) => r.id)).toEqual(['archetype-chapter:1']);
    expect(milestoneMoment(days(3), true, [{ key: 'milestone:3' }])).toBeNull();
    // Day 2 only holds the numerology introduction (V06): no moment yet.
    expect(milestoneMoment(days(2), true, seen)).toBeNull();
    // Day 1 holds the grimoire cover (V05): no moment yet.
    expect(milestoneMoment(days(1), true, seen)).toBeNull();
    // Day 21: chapter II, week 3 and the first constellation.
    expect(milestoneMoment(days(21), true, seen)?.rewards.map((r) => r.id).sort()).toEqual(['archetype-chapter:2', 'constellation:1', 'review:week:3']);
    // Day 100: the hundred-day review and its constellation are not built yet.
    expect(builtRewards(milestoneAt(100)!).map((r) => r.id)).toEqual(['archetype-chapter:second-voice']);
  });
});
