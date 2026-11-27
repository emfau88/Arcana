/**
 * Weekly and monthly reviews (V04.5, PRODUCT_SYSTEMS B5, PROGRESSION_DESIGN §7). Built only from
 * the person's own stored data: daily cards and readings of the period, most frequent theme, tone
 * balance of the cards, cards that came more than once and up to two own notes. A review covers
 * journey days (days of use), not calendar days, so a pause never leaves a gap or a reproach.
 *
 * Sentences come from building blocks in the content module `journey` (`review.*`), picked
 * deterministically from the review index. Same data, same review; nothing is stored.
 */
import type { ContentPack } from '../content/schema.ts';
import { journeyDayKeys, readingDateKey, type Facts } from './progress.ts';
import type { CardId, ThemeId } from './types.ts';

export type ReviewKind = 'week' | 'month';
/** Journey days a review covers (week every 7, month every 30 journey days). */
export const REVIEW_SPAN: Readonly<Record<ReviewKind, number>> = { week: 7, month: 30 };
/** Own notes quoted at most (PROGRESSION_DESIGN §7: 1–2, never in a share image). */
export const REVIEW_NOTES_MAX = 2;

export type Tone = 'light' | 'twilight' | 'shadow';

export interface Review {
  kind: ReviewKind;
  /** 1-based: week 1 = journey days 1–7. */
  index: number;
  fromDay: number;
  toDay: number;
  /** Local days of the period that exist so far (fewer than the span while it is not complete). */
  dateKeys: string[];
  /** Daily cards of the period, oldest first. */
  cards: Array<{ dateKey: string; cardId: CardId }>;
  readings: number;
  /** Most frequent theme of daily cards and readings (tie: the most recent), null without any. */
  themeId: ThemeId | null;
  tones: Record<Tone, number>;
  /** Cards met at least twice in the period (daily cards and reading cards), most often first. */
  recurring: Array<{ cardId: CardId; count: number }>;
  /** Up to REVIEW_NOTES_MAX own notes, newest first. Private: shown in the app only. */
  notes: Array<{ dateKey: string; text: string }>;
}

/** Index of the review that becomes due on a journey day, or null (day 7 → week 1, day 30 → month 1). */
export function reviewDueOn(kind: ReviewKind, journeyDay: number): number | null {
  const span = REVIEW_SPAN[kind];
  return Number.isInteger(journeyDay) && journeyDay >= span && journeyDay % span === 0 ? journeyDay / span : null;
}

export function buildReview(facts: Facts, pack: ContentPack, kind: ReviewKind, index: number): Review {
  const span = REVIEW_SPAN[kind];
  const i = Math.max(1, Math.floor(index));
  const fromDay = (i - 1) * span + 1;
  const toDay = i * span;
  const dateKeys = journeyDayKeys(facts).slice(fromDay - 1, toDay);
  const inPeriod = new Set(dateKeys);

  const dailies = facts.dailies.filter((d) => inPeriod.has(d.dateKey)).sort((a, b) => (a.dateKey < b.dateKey ? -1 : a.dateKey > b.dateKey ? 1 : 0));
  const readings = facts.readings
    .map((r) => ({ r, key: readingDateKey(r) }))
    .filter((x): x is { r: (typeof facts.readings)[number]; key: string } => x.key !== null && inPeriod.has(x.key))
    .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : a.r.createdAt < b.r.createdAt ? -1 : 1));

  // Theme: count, tie broken by the most recent use.
  const themeCount = new Map<ThemeId, { n: number; last: string }>();
  const countTheme = (t: ThemeId, at: string) => {
    const prev = themeCount.get(t);
    themeCount.set(t, { n: (prev?.n ?? 0) + 1, last: prev && prev.last > at ? prev.last : at });
  };
  for (const d of dailies) countTheme(d.themeId, d.dateKey);
  for (const { r, key } of readings) countTheme(r.themeId, key);
  let themeId: ThemeId | null = null;
  let best: { n: number; last: string } | null = null;
  for (const [t, v] of themeCount) if (!best || v.n > best.n || (v.n === best.n && v.last > best.last)) [themeId, best] = [t, v];

  const toneOf = new Map(pack.cards.map((c) => [c.id, c.tone]));
  const tones: Record<Tone, number> = { light: 0, twilight: 0, shadow: 0 };
  for (const d of dailies) {
    const t = toneOf.get(d.cardId);
    if (t) tones[t]++;
  }

  const count = new Map<CardId, { n: number; first: number }>();
  let order = 0;
  const meet = (id: CardId) => {
    const prev = count.get(id);
    count.set(id, { n: (prev?.n ?? 0) + 1, first: prev?.first ?? order++ });
  };
  for (const d of dailies) meet(d.cardId);
  for (const { r } of readings) for (const id of r.cardIds) meet(id);
  const recurring = [...count]
    .filter(([, v]) => v.n >= 2)
    .sort((a, b) => b[1].n - a[1].n || a[1].first - b[1].first)
    .map(([cardId, v]) => ({ cardId, count: v.n }));

  const notes = [
    ...dailies.map((d) => ({ dateKey: d.dateKey, text: d.note ?? '', at: d.revealedAt })),
    ...readings.map(({ r, key }) => ({ dateKey: key, text: r.note ?? '', at: r.createdAt })),
  ]
    .filter((n) => n.text.trim().length > 0)
    .sort((a, b) => (a.dateKey === b.dateKey ? (a.at < b.at ? 1 : -1) : a.dateKey < b.dateKey ? 1 : -1))
    .slice(0, REVIEW_NOTES_MAX)
    .map(({ dateKey, text }) => ({ dateKey, text: text.trim() }));

  return {
    kind,
    index: i,
    fromDay,
    toDay,
    dateKeys,
    cards: dailies.map((d) => ({ dateKey: d.dateKey, cardId: d.cardId })),
    readings: readings.length,
    themeId,
    tones,
    recurring,
    notes,
  };
}

/* ----------------------------------------------------------- Building blocks */

/** Number of variants per building block in the module `journey` (40 per language in total). */
export const REVIEW_BLOCKS = {
  'open.week': 4,
  'open.month': 4,
  theme: 4,
  'balance.light': 3,
  'balance.twilight': 3,
  'balance.shadow': 3,
  'balance.even': 3,
  recurring: 4,
  notes: 3,
  quiet: 3,
  close: 6,
} as const satisfies Record<string, number>;
export type ReviewBlock = keyof typeof REVIEW_BLOCKS;

/** Placeholders a block must contain (content gate). */
export const REVIEW_BLOCK_VARS: Readonly<Partial<Record<ReviewBlock, readonly string[]>>> = {
  theme: ['theme'],
  recurring: ['card', 'count'],
};

export function reviewTextKeys(): string[] {
  return (Object.entries(REVIEW_BLOCKS) as Array<[ReviewBlock, number]>).flatMap(([b, n]) => Array.from({ length: n }, (_, i) => `review.${b}.${i + 1}`));
}

/** Deterministic variant: the block offset keeps neighbouring blocks from moving in lockstep. */
function pick(block: ReviewBlock, review: Pick<Review, 'kind' | 'index'>, salt = 0): string {
  const n = REVIEW_BLOCKS[block];
  const offset = Object.keys(REVIEW_BLOCKS).indexOf(block) + (review.kind === 'month' ? 2 : 0) + salt;
  return `review.${block}.${((review.index - 1 + offset) % n) + 1}`;
}

export function dominantTone(tones: Record<Tone, number>): 'light' | 'twilight' | 'shadow' | 'even' {
  const entries = (['light', 'twilight', 'shadow'] as const).map((t) => [t, tones[t]] as const);
  const max = Math.max(...entries.map(([, n]) => n));
  const top = entries.filter(([, n]) => n === max);
  return top.length === 1 ? (top[0]?.[0] ?? 'even') : 'even';
}

/** A sentence of the review: a module key plus the values for its placeholders. */
export interface ReviewSentence {
  key: string;
  vars: Record<string, string | number>;
}

/**
 * Sentences of a review in reading order. Names (theme, card) are passed in by the caller in the
 * person's language. With fewer than two daily cards the review says so calmly instead of
 * inventing a balance.
 */
export function reviewSentences(review: Review, names: { theme: (id: ThemeId) => string; card: (id: CardId) => string }): ReviewSentence[] {
  const out: ReviewSentence[] = [{ key: pick(review.kind === 'week' ? 'open.week' : 'open.month', review), vars: {} }];
  if (review.cards.length < 2) {
    out.push({ key: pick('quiet', review), vars: {} });
  } else {
    if (review.themeId) out.push({ key: pick('theme', review), vars: { theme: names.theme(review.themeId) } });
    out.push({ key: pick(`balance.${dominantTone(review.tones)}`, review), vars: {} });
    const top = review.recurring[0];
    if (top) out.push({ key: pick('recurring', review), vars: { card: names.card(top.cardId), count: top.count } });
  }
  if (review.notes.length > 0) out.push({ key: pick('notes', review), vars: {} });
  out.push({ key: pick('close', review), vars: {} });
  return out;
}
