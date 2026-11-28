import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import type { Clock } from '../../src/domain/clock.ts';
import { createDailyRecord, createDraft, finalizeReading, revealAll } from '../../src/domain/oracle.ts';
import {
  cardEncounters,
  cardLevel,
  FIXED_MILESTONES,
  journeyDayKeys,
  journeyDays,
  journeyDayToday,
  levelCounts,
  milestoneAt,
  milestonesReached,
  nextMilestone,
  readingDateKey,
  type Facts,
} from '../../src/domain/progress.ts';
import { seededRng } from '../../src/domain/random.ts';
import type { ActivityEvent, DailyRecord, JournalEntry, Reading, ThemeId } from '../../src/domain/types.ts';

const local = (d: number, h = 9, min = 0, month = 11): Clock => ({ now: () => new Date(2026, month - 1, d, h, min, 0) });
const key = (d: number) => `2026-11-${String(d).padStart(2, '0')}`;

function daily(d: number, cardId = 'major-00-fool', themeId: ThemeId = 'self', note = ''): DailyRecord {
  const r = createDailyRecord({ pack: CONTENT, clock: local(d), rng: seededRng(d), themeId, archetypeId: null, locale: 'de', previousCardId: null });
  return { ...r, cardId, note };
}

function reading(clock: Clock, seed = 1, themeId: ThemeId = 'self'): Reading {
  return finalizeReading(CONTENT, revealAll(createDraft(CONTENT, themeId, clock, seededRng(seed))), 'de', clock);
}

/** A reading as 0.1–0.2 stored it: no dateKey. */
const legacy = (r: Reading): Reading => {
  const copy = { ...r };
  delete copy.dateKey;
  return copy;
};

const journal = (dateKey: string, over: Partial<JournalEntry> = {}): JournalEntry => ({
  id: `j-${dateKey}-${over.kind ?? 'free'}-${over.text ?? ''}`,
  kind: 'free',
  dateKey,
  text: '',
  refs: {},
  createdAt: `${dateKey}T20:00:00.000Z`,
  updatedAt: `${dateKey}T20:00:00.000Z`,
  ...over,
});

const event = (dateKey: string, type: ActivityEvent['type'], refs: ActivityEvent['refs'] = {}): ActivityEvent => ({
  id: `e-${dateKey}-${type}-${refs.cardId ?? ''}-${refs.part ?? ''}`,
  type,
  dateKey,
  at: `${dateKey}T20:00:00.000Z`,
  refs,
});

describe('journey days', () => {
  it('stores the local day of a reading and prefers it over the UTC time (time zone)', () => {
    // Saved at 00:30 local on the 27th; in UTC that may still be the 26th.
    const r = reading(local(27, 0, 30));
    expect(r.dateKey).toBe(key(27));
    // A record whose stored day differs from its UTC timestamp (made in another zone): the stored day wins.
    const travelled = { ...r, createdAt: '2026-11-26T22:30:00.000Z', dateKey: key(27) };
    expect(readingDateKey(travelled)).toBe(key(27));
    // Records from before 0.3 have no dateKey: their day is read from createdAt in the local zone.
    expect(readingDateKey(legacy(r))).toBe(key(27));
  });

  it('counts a day card at 23:59 and a reading at 00:01 as two days (midnight)', () => {
    const late = { ...daily(26), revealedAt: new Date(2026, 10, 26, 23, 59).toISOString() };
    const early = reading(local(27, 0, 1));
    expect(journeyDayKeys({ dailies: [late], readings: [early] })).toEqual([key(26), key(27)]);
  });

  it('counts every counting action, each day once (duplicates)', () => {
    const facts: Facts = {
      dailies: [daily(1)],
      readings: [reading(local(1, 12), 2), reading(local(1, 18), 3), reading(local(2, 18), 4)],
      journal: [journal(key(1)), journal(key(3), { kind: 'number-encounter' })],
      events: [event(key(1), 'card.studied', { cardId: 'major-00-fool', part: 1 }), event(key(4), 'card.studied', { cardId: 'major-01-magician', part: 1 })],
    };
    expect(journeyDayKeys(facts)).toEqual([key(1), key(2), key(3), key(4)]);
  });

  it('does not count opening, rituals or reviews', () => {
    const facts: Facts = { dailies: [], readings: [], events: [event(key(5), 'ritual.done'), event(key(6), 'review.opened'), event(key(7), 'world.introduced')] };
    expect(journeyDays(facts)).toBe(0);
  });

  it('ignores broken records instead of failing', () => {
    const broken: Facts = {
      dailies: [{ ...daily(1), dateKey: 'garbage' }, daily(2)],
      readings: [{ ...legacy(reading(local(3))), createdAt: 'not a time' }, { ...reading(local(4)), dateKey: '2026-13-40' }],
      journal: [journal('yesterday')],
    };
    expect(journeyDayKeys(broken)).toEqual([key(2)]);
  });

  it('keeps every fact when the clock was set back, and counts a future day once', () => {
    const facts: Facts = { dailies: [daily(20), daily(10), daily(20)], readings: [] };
    expect(journeyDays(facts)).toBe(2);
    expect(journeyDayToday(facts, key(5))).toBe(3); // device clock behind the stored days: nothing lost
  });

  it('stands on today exactly once (fixes the plaque one day ahead after a reading)', () => {
    expect(journeyDayToday({ dailies: [], readings: [] }, key(26))).toBe(1);
    expect(journeyDayToday({ dailies: [daily(25)], readings: [] }, key(26))).toBe(2);
    // Only a reading today (no day card yet): today is already counted.
    expect(journeyDayToday({ dailies: [daily(25)], readings: [reading(local(26, 8))] }, key(26))).toBe(2);
  });

  it('never decreases and card levels never drop (1,000 random fact sequences)', () => {
    const rng = seededRng(2026);
    const pick = <T,>(list: readonly T[]) => list[Math.floor(rng() * list.length)]!;
    const cards = ['major-00-fool', 'major-01-magician', 'major-02-high-priestess'];
    const themes: ThemeId[] = ['self', 'love', 'career', 'change'];
    const base = reading(local(1));
    for (let run = 0; run < 1000; run++) {
      const facts = { dailies: [] as DailyRecord[], readings: [] as Reading[], journal: [] as JournalEntry[], events: [] as ActivityEvent[] };
      let lastDays = 0;
      const lastLevels = new Map<string, number>();
      for (let step = 0; step < 12; step++) {
        // Pauses and clock jumps: any day of a year, in any order, sometimes broken.
        const day = rng() < 0.05 ? 'garbage' : `2026-${String(1 + Math.floor(rng() * 12)).padStart(2, '0')}-${String(1 + Math.floor(rng() * 28)).padStart(2, '0')}`;
        const kind = Math.floor(rng() * 5);
        if (kind === 0) facts.dailies.push({ ...daily(1, pick(cards), pick(themes), rng() < 0.2 ? 'Notiz' : ''), dateKey: day });
        else if (kind === 1) facts.readings.push({ ...base, id: `r${step}`, dateKey: day, themeId: pick(themes) });
        else if (kind === 2) facts.journal.push(journal(day, { id: `j${step}`, kind: pick(['free', 'study', 'reflection'] as const), refs: { cardId: pick(cards) }, text: rng() < 0.5 ? 'Text' : '' }));
        else if (kind === 3) facts.events.push({ ...event(day, 'card.studied', { cardId: pick(cards), part: rng() < 0.5 ? 1 : 2 }), id: `e${step}` });
        else facts.events.push({ ...event(day, 'ritual.done'), id: `x${step}` });
        const days = journeyDays(facts);
        expect(days).toBeGreaterThanOrEqual(lastDays);
        lastDays = days;
        for (const [cardId, e] of cardEncounters(facts)) {
          const level = cardLevel(e);
          expect(level).toBeGreaterThanOrEqual(lastLevels.get(cardId) ?? 0);
          lastLevels.set(cardId, level);
        }
      }
    }
  });
});

describe('card depth', () => {
  const fool = 'major-00-fool';

  it('climbs the levels by days, themes, study and a reflection, without chance', () => {
    const level = (facts: Facts) => cardLevel(cardEncounters(facts).get(fool));
    expect(level({ dailies: [], readings: [] })).toBe(0);
    expect(level({ dailies: [daily(1)], readings: [] })).toBe(1);
    expect(level({ dailies: [daily(1), daily(2)], readings: [] })).toBe(2);
    expect(level({ dailies: [daily(1)], readings: [], events: [event(key(1), 'card.studied', { cardId: fool, part: 1 })] })).toBe(2);
    // Part 2 only counts after part 1.
    expect(level({ dailies: [daily(1)], readings: [], events: [event(key(1), 'card.studied', { cardId: fool, part: 2 })] })).toBe(1);
    const studied = [event(key(1), 'card.studied', { cardId: fool, part: 1 }), event(key(2), 'card.studied', { cardId: fool, part: 2 })];
    expect(level({ dailies: [daily(1)], readings: [], events: studied })).toBe(3);
    expect(level({ dailies: [daily(1, fool, 'self'), daily(2, fool, 'love'), daily(3, fool, 'career')], readings: [] })).toBe(3);
    expect(level({ dailies: [1, 2, 3, 4].map((d) => daily(d)), readings: [] })).toBe(3);
    // Level 4: level 3 plus one reflection (a study answer with text; an empty one does not count).
    expect(level({ dailies: [daily(1)], readings: [], events: studied, journal: [journal(key(2), { kind: 'study', refs: { cardId: fool }, text: '   ' })] })).toBe(3);
    expect(level({ dailies: [daily(1)], readings: [], events: studied, journal: [journal(key(2), { kind: 'study', refs: { cardId: fool }, text: 'Antwort' })] })).toBe(4);
    expect(level({ dailies: [daily(1, fool, 'self', 'Notiz'), 2, 3, 4].map((d) => (typeof d === 'number' ? daily(d) : d)), readings: [] })).toBe(4);
  });

  it('counts several readings on one day as one day, and records themes and roles', () => {
    const r1 = reading(local(5, 10), 7, 'love');
    const r2 = { ...reading(local(5, 20), 7, 'career'), id: 'other' };
    const e = cardEncounters({ dailies: [], readings: [r1, r2] }).get(r1.cardIds[0]!)!;
    expect([...e.days]).toEqual([key(5)]);
    expect([...e.themes].sort()).toEqual(['career', 'love']);
    expect([...e.roles]).toEqual(['situation']);
    expect(cardLevel(e)).toBe(1);
  });

  it('sums the grimoire head count', () => {
    const facts: Facts = { dailies: [daily(1, 'major-00-fool'), daily(2, 'major-00-fool'), daily(3, 'major-01-magician')], readings: [] };
    expect(levelCounts(cardEncounters(facts))).toEqual({ 1: 2, 2: 1, 3: 0, 4: 0 });
  });
});

describe('milestones', () => {
  it('every fixed milestone opens content or a design unlock', () => {
    for (const m of FIXED_MILESTONES) {
      expect(m.rewards.length, `day ${m.day}`).toBeGreaterThan(0);
      for (const r of m.rewards) {
        expect(['content', 'design']).toContain(r.kind);
        expect(r.id.length).toBeGreaterThan(0);
      }
    }
  });

  it('derives fixed and rhythmic milestones up to the journey day', () => {
    expect(milestonesReached(7).map((m) => m.day)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(milestoneAt(8)).toBeNull();
    expect(milestoneAt(75)).toBeNull();
    expect(milestoneAt(7)?.rewards.map((r) => r.id)).toEqual(['review-spread', 'review:week:1']);
    expect(milestoneAt(21)?.rewards.map((r) => r.id)).toEqual(['archetype-chapter:2', 'review:week:3', 'constellation:1']);
    expect(milestoneAt(150)?.rewards.map((r) => r.id)).toEqual(['review:month:5', 'review:jubilee:150', 'ribbon']);
    expect(milestoneAt(300)?.rewards.map((r) => r.id)).toEqual(['review:month:10', 'review:jubilee:300']);
    expect(milestoneAt(365)?.rewards.map((r) => r.id)).toEqual(['yearbook:1']);
    expect(milestoneAt(21)?.key).toBe('milestone:21');
  });

  it('opens the three card backs on journey days 2, 5 and 10 (D-66)', () => {
    const backs = FIXED_MILESTONES.flatMap((m) => m.rewards.filter((r) => r.id.startsWith('cardback:')).map((r) => [m.day, r.id]));
    expect(backs).toEqual([
      [2, 'cardback:crescent'],
      [5, 'cardback:compass'],
      [10, 'cardback:golden-wheel'],
    ]);
    expect(milestoneAt(2)?.rewards.map((r) => r.id)).toEqual(['cardback:crescent', 'world-intro:numerology']);
    expect(milestoneAt(14)?.rewards.map((r) => r.id)).toEqual(['review:week:2']);
  });

  it('names the next milestone without counting down', () => {
    expect(nextMilestone(0).day).toBe(1);
    expect(nextMilestone(7).day).toBe(10);
    expect(nextMilestone(63).day).toBe(70);
  });

  it('a v0.2 data set (40 day cards, 10 readings) gives the right journey, levels and milestones at once', () => {
    const dailies = Array.from({ length: 40 }, (_, i) => {
      const date = new Date(2026, 8, 1 + i, 9);
      const d = createDailyRecord({ pack: CONTENT, clock: { now: () => date }, rng: seededRng(i), themeId: 'self', archetypeId: null, locale: 'de', previousCardId: null });
      return d;
    });
    // Five readings on days with a day card, five on days without (stored without dateKey, as 0.2 did).
    const readings = Array.from({ length: 10 }, (_, i) => legacy({ ...reading({ now: () => new Date(2026, 8, i < 5 ? 1 + i : 50 + i, 20) }, 100 + i), id: `r${i}` }));
    const facts: Facts = { dailies, readings };
    expect(journeyDays(facts)).toBe(45);
    expect(milestonesReached(journeyDays(facts)).map((m) => m.day)).toEqual([1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 28, 30, 35, 42]);
    const counts = levelCounts(cardEncounters(facts));
    expect(counts[1]).toBeGreaterThan(0);
    expect(counts[1]).toBeLessThanOrEqual(22);
  });

  it('derives 1,000 days of data within the budget (≤ 30 ms)', () => {
    const dailies = Array.from({ length: 1000 }, (_, i) => ({ ...daily(1), dateKey: new Date(2024, 0, 1 + i).toISOString().slice(0, 10) }));
    const facts: Facts = { dailies, readings: [] };
    journeyDays(facts); // warm-up
    const t0 = performance.now();
    const days = journeyDays(facts);
    milestonesReached(days);
    levelCounts(cardEncounters(facts));
    expect(performance.now() - t0).toBeLessThan(30);
  });
});
