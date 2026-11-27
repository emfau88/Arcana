import { describe, expect, it } from 'vitest';
import { BUILD_FEATURES, hintForToday, rewardFeature, type Feature } from '../../src/domain/hints.ts';
import { milestonesReached } from '../../src/domain/progress.ts';

const ALL: ReadonlySet<Feature> = new Set<Feature>([
  'archetype-chapters',
  'reviews',
  'jubilees',
  'starmap',
  'review-spread',
  'grimoire-book',
  'cardbacks',
  'worlds',
  'symbols',
  'design-unlocks',
]);

describe('discovery hint of the day (A6)', () => {
  it('maps every reward of two years of milestones to a feature', () => {
    for (const m of milestonesReached(730)) for (const r of m.rewards) expect(rewardFeature(r.id), r.id).not.toBeNull();
    expect(rewardFeature('unknown:thing')).toBeNull();
  });

  it('gives at most one hint per day, the milestone first', () => {
    const h = hintForToday({ journeyDay: 3, features: ALL, levelUps: [{ cardId: 'major-01-magician', level: 2 }] });
    expect(h).toEqual({ kind: 'milestone', id: 'archetype-chapter:1' });
  });

  it('prefers a card level over a world introduction', () => {
    const levelUps = [{ cardId: 'major-01-magician', level: 2 }];
    expect(hintForToday({ journeyDay: 2, features: ALL, levelUps })).toEqual({ kind: 'card-level', id: 'level:major-01-magician:2' });
    expect(hintForToday({ journeyDay: 2, features: ALL })).toEqual({ kind: 'world', id: 'world-intro:numerology' });
  });

  it('never points to a feature the build does not contain', () => {
    // Day 7 holds the review spread (V05) and the first weekly review (V04.5).
    expect(hintForToday({ journeyDay: 7, features: new Set<Feature>(['reviews']) })).toEqual({ kind: 'milestone', id: 'review:week:1' });
    expect(hintForToday({ journeyDay: 7, features: new Set<Feature>() })).toBeNull();
    expect(hintForToday({ journeyDay: 2, features: new Set<Feature>(['reviews']) })).toBeNull();
  });

  it('is quiet on days without milestone or level', () => {
    for (const d of [5, 8, 9, 11, 0, -1]) expect(hintForToday({ journeyDay: d, features: ALL })).toBeNull();
  });

  it('keeps the first reward of a day with several (day 100)', () => {
    expect(hintForToday({ journeyDay: 100, features: ALL })).toEqual({ kind: 'milestone', id: 'review:hundred' });
  });

  it('ships chapters, weekly/monthly reviews and the star map with V04, nothing else', () => {
    for (const f of BUILD_FEATURES) expect(ALL.has(f)).toBe(true);
    expect([...BUILD_FEATURES].sort()).toEqual(['archetype-chapters', 'reviews', 'starmap']);
  });

  it('keeps the hundred-day and jubilee rewards apart until they are built', () => {
    expect(rewardFeature('review:week:3')).toBe('reviews');
    expect(rewardFeature('review:month:2')).toBe('reviews');
    expect(rewardFeature('review:hundred')).toBe('jubilees');
    expect(rewardFeature('review:jubilee:150')).toBe('jubilees');
    expect(rewardFeature('yearbook:1')).toBe('jubilees');
    expect(rewardFeature('constellation:hundred')).toBe('jubilees');
    expect(rewardFeature('constellation:2')).toBe('starmap');
    // With the V04 build, day 100 points to the chapter, not to the hundred-day review.
    expect(hintForToday({ journeyDay: 100, features: BUILD_FEATURES })).toEqual({ kind: 'milestone', id: 'archetype-chapter:second-voice' });
  });
});
