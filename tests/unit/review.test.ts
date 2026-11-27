import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import { CHAPTER_DAY, chaptersOpen } from '../../src/content/modules/chapter-keys.ts';
import { texts as journeyDe } from '../../src/content/modules/journey.de.ts';
import { texts as journeyEn } from '../../src/content/modules/journey.en.ts';
import type { Clock } from '../../src/domain/clock.ts';
import { createDailyRecord } from '../../src/domain/oracle.ts';
import { seededRng } from '../../src/domain/random.ts';
import { REVIEW_BLOCKS, buildReview, dominantTone, reviewDueOn, reviewSentences, reviewTextKeys, type Review } from '../../src/domain/review.ts';
import type { CardId, DailyRecord, Reading, ThemeId } from '../../src/domain/types.ts';
import { fmt } from '../../src/i18n/index.ts';

const clock: Clock = { now: () => new Date(2026, 10, 1, 9) };
const base = createDailyRecord({ pack: CONTENT, clock, rng: seededRng(1), themeId: 'self', archetypeId: null, locale: 'de', previousCardId: null });

function day(n: number): string {
  const d = new Date(2026, 0, 1);
  d.setDate(d.getDate() + n - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daily(n: number, cardId: CardId, opts: { theme?: ThemeId; note?: string } = {}): DailyRecord {
  return { ...base, dateKey: day(n), cardId, themeId: opts.theme ?? 'self', note: opts.note ?? '', revealedAt: `${day(n)}T08:00:00.000Z` };
}

function reading(n: number, cardIds: [CardId, CardId, CardId], theme: ThemeId = 'love', note = ''): Reading {
  return {
    id: `r${n}`,
    deckId: CONTENT.deckId,
    themeId: theme,
    cardIds,
    locale: 'de',
    contentVersion: CONTENT.version,
    content: { themeLabel: '', intro: '', positions: [], synthesisTitle: '', synthesis: '', reflection: '' },
    createdAt: `${day(n)}T18:00:00.000Z`,
    dateKey: day(n),
    note,
  };
}

const ids = CONTENT.cards.map((c) => c.id);
const names = {
  theme: (id: ThemeId) => CONTENT.themes.find((t) => t.id === id)!.label.de,
  card: (id: CardId) => CONTENT.cards.find((c) => c.id === id)!.title.de,
};

/** Renders a review like the app will: every sentence from the module, placeholders filled. */
function render(review: Review, table: Record<string, string>): string[] {
  return reviewSentences(review, names).map((s) => fmt(table[s.key] ?? `MISSING ${s.key}`, s.vars));
}

function expectNoGaps(lines: string[]): void {
  expect(lines.length).toBeGreaterThanOrEqual(2);
  for (const l of lines) {
    expect(l.trim().length, l).toBeGreaterThan(0);
    expect(l, l).not.toMatch(/\{\w+\}|MISSING|undefined|null|NaN/);
  }
}

describe('reviews from own data (V04.5, B5)', () => {
  it('has 40 building blocks per language', () => {
    expect(reviewTextKeys()).toHaveLength(40);
    expect(Object.values(REVIEW_BLOCKS).reduce((a, b) => a + b, 0)).toBe(40);
    for (const k of reviewTextKeys()) {
      expect(journeyDe[k], k).toBeTruthy();
      expect(journeyEn[k], k).toBeTruthy();
    }
  });

  it('is due every 7 (week) and every 30 (month) journey days', () => {
    expect([7, 14, 21].map((d) => reviewDueOn('week', d))).toEqual([1, 2, 3]);
    expect([1, 6, 8, 0, -7, 7.5].map((d) => reviewDueOn('week', d))).toEqual([null, null, null, null, null, null]);
    expect(reviewDueOn('month', 30)).toBe(1);
    expect(reviewDueOn('month', 60)).toBe(2);
    expect(reviewDueOn('month', 45)).toBeNull();
  });

  it('works with 0 entries without gaps', () => {
    const r = buildReview({ dailies: [], readings: [] }, CONTENT, 'week', 1);
    expect(r).toMatchObject({ fromDay: 1, toDay: 7, dateKeys: [], cards: [], readings: 0, themeId: null, recurring: [], notes: [] });
    expect(r.tones).toEqual({ light: 0, twilight: 0, shadow: 0 });
    expectNoGaps(render(r, journeyDe));
    expectNoGaps(render(r, journeyEn));
  });

  it('works with 1 entry: says it calmly instead of inventing a balance', () => {
    const r = buildReview({ dailies: [daily(1, ids[0]!, { note: 'Erster Tag' })], readings: [] }, CONTENT, 'week', 1);
    expect(r.cards).toHaveLength(1);
    const keys = reviewSentences(r, names).map((s) => s.key);
    expect(keys.some((k) => k.startsWith('review.quiet.'))).toBe(true);
    expect(keys.some((k) => k.startsWith('review.balance.'))).toBe(false);
    expect(keys.some((k) => k.startsWith('review.notes.'))).toBe(true);
    expect(r.notes).toEqual([{ dateKey: day(1), text: 'Erster Tag' }]);
    expectNoGaps(render(r, journeyDe));
    expectNoGaps(render(r, journeyEn));
  });

  it('works with 30 entries: month review with theme, balance, recurring card and two newest notes', () => {
    const dailies = Array.from({ length: 30 }, (_, i) =>
      daily(i + 1, ids[i % 22]!, { theme: i < 20 ? 'change' : 'self', note: i % 10 === 0 ? `Notiz ${i + 1}` : '' }),
    );
    const r = buildReview({ dailies, readings: [reading(30, [ids[1]!, ids[2]!, ids[3]!])] }, CONTENT, 'month', 1);
    expect(r.dateKeys).toHaveLength(30);
    expect(r.cards).toHaveLength(30);
    expect(r.readings).toBe(1);
    expect(r.themeId).toBe('change');
    expect(r.tones.light + r.tones.twilight + r.tones.shadow).toBe(30);
    // Cards 0–7 appear twice as daily cards; cards 1–3 once more in the reading.
    expect(r.recurring[0]).toEqual({ cardId: ids[1], count: 3 });
    expect(r.notes).toEqual([
      { dateKey: day(21), text: 'Notiz 21' },
      { dateKey: day(11), text: 'Notiz 11' },
    ]);
    const de = render(r, journeyDe);
    expectNoGaps(de);
    expect(de.join(' ')).toContain('Veränderung & Entscheidungen');
    expect(de.join(' ')).toContain('Der Magier');
    expectNoGaps(render(r, journeyEn));
  });

  it('counts journey days, not calendar days: a pause leaves no gap', () => {
    // Seven days of use spread over three weeks.
    const dailies = [1, 2, 5, 9, 12, 18, 21].map((n, i) => daily(n, ids[i]!));
    const r = buildReview({ dailies, readings: [] }, CONTENT, 'week', 1);
    expect(r.cards).toHaveLength(7);
    expect(buildReview({ dailies, readings: [] }, CONTENT, 'week', 2).cards).toHaveLength(0);
  });

  it('breaks a theme tie by the most recent use and is deterministic', () => {
    const facts = { dailies: [daily(1, ids[0]!, { theme: 'love' }), daily(2, ids[1]!, { theme: 'career' })], readings: [] };
    expect(buildReview(facts, CONTENT, 'week', 1).themeId).toBe('career');
    expect(reviewSentences(buildReview(facts, CONTENT, 'week', 1), names)).toEqual(reviewSentences(buildReview(facts, CONTENT, 'week', 1), names));
  });

  it('varies the sentences from one review to the next', () => {
    const dailies = Array.from({ length: 28 }, (_, i) => daily(i + 1, ids[i % 22]!));
    const openings = [1, 2, 3, 4].map((i) => reviewSentences(buildReview({ dailies, readings: [] }, CONTENT, 'week', i), names)[0]!.key);
    expect(new Set(openings).size).toBe(4);
  });

  it('names an even balance when no tone leads', () => {
    expect(dominantTone({ light: 2, twilight: 2, shadow: 1 })).toBe('even');
    expect(dominantTone({ light: 0, twilight: 0, shadow: 0 })).toBe('even');
    expect(dominantTone({ light: 1, twilight: 0, shadow: 3 })).toBe('shadow');
  });
});

describe('archetype chapters open over the journey (B6)', () => {
  it('opens chapters I–IV on days 3, 21, 42, 63 and the second voice on day 100', () => {
    expect(CHAPTER_DAY).toEqual({ '1': 3, '2': 21, '3': 42, '4': 63, 'second-voice': 100 });
    expect(chaptersOpen(2)).toEqual([]);
    expect(chaptersOpen(3)).toEqual(['1']);
    expect(chaptersOpen(62)).toEqual(['1', '2', '3']);
    expect(chaptersOpen(100)).toEqual(['1', '2', '3', '4', 'second-voice']);
  });
});
