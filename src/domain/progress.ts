/**
 * Derived progress (V03.2, IA §5.4, PROGRESSION_DESIGN §2–4).
 * Pure functions over stored facts. Nothing here is stored: journey day, card levels and
 * milestones are recomputed on demand, so rule updates apply retroactively and nothing drifts.
 */
import { isValidDateKey, localDateKey } from './clock.ts';
import { POSITIONS, type ActivityEvent, type CardId, type DailyRecord, type JournalEntry, type Reading, type ThemeId } from './types.ts';

/** Everything the derivations read. Journal and events are optional until features write them. */
export interface Facts {
  dailies: readonly DailyRecord[];
  readings: readonly Reading[];
  journal?: readonly JournalEntry[];
  events?: readonly ActivityEvent[];
}

/* ------------------------------------------------------------------ Journey */

/**
 * Local day of a saved reading: stored since 0.3 (local day at the moment of saving). Older
 * records only have createdAt; their day is read in the device's current time zone.
 */
export function readingDateKey(r: Reading): string | null {
  if (r.dateKey !== undefined) return isValidDateKey(r.dateKey) ? r.dateKey : null;
  const at = new Date(r.createdAt);
  return Number.isNaN(at.getTime()) ? null : localDateKey(at);
}

/**
 * Distinct local days with at least one counting action (PROGRESSION_DESIGN §2.1): daily card
 * revealed, reading saved, journal entry written (incl. number encounters, moon), card study
 * completed. Opening the app, settings, rituals and reviews do not count. Sorted ascending.
 */
export function journeyDayKeys(facts: Facts): string[] {
  const days = new Set<string>();
  const add = (key: string | null) => {
    if (key !== null && isValidDateKey(key)) days.add(key);
  };
  for (const d of facts.dailies) add(d.dateKey);
  for (const r of facts.readings) add(readingDateKey(r));
  for (const j of facts.journal ?? []) add(j.dateKey);
  for (const e of facts.events ?? []) if (e.type === 'card.studied') add(e.dateKey);
  return [...days].sort();
}

/** Days of the journey. Never decreases: facts only go away with "delete all data". */
export function journeyDays(facts: Facts): number {
  return journeyDayKeys(facts).length;
}

/**
 * The journey day the person stands on today: today counts as soon as they are here, once.
 * `todayKey` comes from the injected clock (store: localDateKey(clock.now())).
 */
export function journeyDayToday(facts: Facts, todayKey: string): number {
  const keys = journeyDayKeys(facts);
  return keys.length + (keys.includes(todayKey) ? 0 : 1);
}

/* ------------------------------------------------------------ Card depth */

export interface CardEncounters {
  cardId: CardId;
  /** Local days with this card as daily card or in a saved reading (several on one day = one). */
  days: Set<string>;
  themes: Set<ThemeId>;
  /** Positions in saved readings ('situation', 'challenge', 'impulse'; more spreads from V05). */
  roles: Set<string>;
  /** From 'card.studied' events. Part 2 only counts after part 1. */
  studied: { part1: boolean; part2: boolean };
  /** Notes on daily cards and readings with this card, plus study answers with text. */
  reflections: number;
}

export function cardEncounters(facts: Facts): Map<CardId, CardEncounters> {
  const out = new Map<CardId, CardEncounters>();
  const get = (cardId: CardId): CardEncounters => {
    let e = out.get(cardId);
    if (!e) {
      e = { cardId, days: new Set(), themes: new Set(), roles: new Set(), studied: { part1: false, part2: false }, reflections: 0 };
      out.set(cardId, e);
    }
    return e;
  };
  const hasText = (s: unknown) => typeof s === 'string' && s.trim().length > 0;

  for (const d of facts.dailies) {
    if (!isValidDateKey(d.dateKey)) continue;
    const e = get(d.cardId);
    e.days.add(d.dateKey);
    e.themes.add(d.themeId);
    if (hasText(d.note) || d.notedAt) e.reflections++;
  }
  for (const r of facts.readings) {
    const day = readingDateKey(r);
    if (day === null) continue;
    r.cardIds.forEach((cardId, i) => {
      const e = get(cardId);
      e.days.add(day);
      e.themes.add(r.themeId);
      e.roles.add(r.content.positions[i]?.position ?? POSITIONS[i] ?? 'extra');
      if (hasText(r.note) || r.notedAt) e.reflections++;
    });
  }
  const part2 = new Set<CardId>();
  for (const ev of facts.events ?? []) {
    const cardId = ev.refs.cardId;
    if (ev.type !== 'card.studied' || !cardId) continue;
    if (ev.refs.part === 2) part2.add(cardId);
    else get(cardId).studied.part1 = true;
  }
  for (const cardId of part2) {
    const e = out.get(cardId);
    if (e?.studied.part1) e.studied.part2 = true;
  }
  // A study answer or an own reflection on the card. A deleted entry keeps counting (S-49).
  for (const j of facts.journal ?? []) {
    if ((j.kind === 'study' || j.kind === 'reflection') && j.refs.cardId && (hasText(j.text) || j.deletedAt)) get(j.refs.cardId).reflections++;
  }
  return out;
}

export type CardLevel = 0 | 1 | 2 | 3 | 4;

/** PROGRESSION_DESIGN §4. Every condition is monotonic, so a level never drops. */
export function cardLevel(e: CardEncounters | undefined): CardLevel {
  if (!e) return 0;
  const level3 = e.days.size >= 4 || e.themes.size >= 3 || e.studied.part2;
  if (level3 && e.reflections >= 1) return 4;
  if (level3) return 3;
  if (e.days.size >= 2 || e.studied.part1) return 2;
  if (e.days.size >= 1) return 1;
  return 0;
}

/** Grimoire head count: "22 discovered · 9 understood · 4 deepened · 1 internalised". */
export function levelCounts(encounters: Map<CardId, CardEncounters>): Record<1 | 2 | 3 | 4, number> {
  const out = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const e of encounters.values()) {
    const l = cardLevel(e);
    if (l >= 1) out[1]++;
    if (l >= 2) out[2]++;
    if (l >= 3) out[3]++;
    if (l >= 4) out[4]++;
  }
  return out;
}

/* ----------------------------------------------------------- Review span */

export type ReviewKind = 'week' | 'month';
/** Journey days a review covers (V04.5): week = 7, month = 30 days of use. */
export const REVIEW_SPAN: Readonly<Record<ReviewKind, number>> = { week: 7, month: 30 };

/* -------------------------------------------------------------- Milestones */

/** A milestone always opens real content or a lasting design unlock, never an empty badge. */
export interface Reward {
  kind: 'content' | 'design';
  id: string;
}

export interface Milestone {
  day: number;
  /** Seen flag key ('milestone:21'): the "new" moment appears once. */
  key: string;
  rewards: Reward[];
}

/** Fixed milestones up to 365 (PROGRESSION_DESIGN §3.2). Rhythmic ones are added in `milestoneAt`. */
export const FIXED_MILESTONES: ReadonlyArray<{ day: number; rewards: Reward[] }> = [
  { day: 1, rewards: [{ kind: 'design', id: 'grimoire-cover' }] },
  { day: 2, rewards: [{ kind: 'content', id: 'world-intro:numerology' }] },
  { day: 3, rewards: [{ kind: 'content', id: 'archetype-chapter:1' }] },
  { day: 4, rewards: [{ kind: 'content', id: 'world-intro:angel-numbers' }] },
  { day: 6, rewards: [{ kind: 'content', id: 'world-intro:symbols' }] },
  { day: 7, rewards: [{ kind: 'content', id: 'review-spread' }] },
  { day: 10, rewards: [{ kind: 'design', id: 'personal-symbol' }] },
  { day: 14, rewards: [{ kind: 'design', id: 'cardback:crescent' }] },
  { day: 21, rewards: [{ kind: 'content', id: 'archetype-chapter:2' }] },
  { day: 42, rewards: [{ kind: 'content', id: 'archetype-chapter:3' }] },
  { day: 50, rewards: [{ kind: 'design', id: 'ex-libris:gilded' }] },
  { day: 63, rewards: [{ kind: 'content', id: 'archetype-chapter:4' }] },
  { day: 75, rewards: [{ kind: 'design', id: 'cardback:compass' }] },
  {
    day: 100,
    rewards: [
      { kind: 'content', id: 'review:hundred' },
      { kind: 'content', id: 'archetype-chapter:second-voice' },
      { kind: 'design', id: 'constellation:hundred' },
    ],
  },
  { day: 365, rewards: [{ kind: 'design', id: 'cardback:golden-wheel' }] },
];

/** Design unlocks for jubilees, fixed order, never for sale (§3.3). */
export const JUBILEE_POOL: readonly string[] = ['ribbon', 'ornaments:laurel', 'sky:dawn'];

/** All rewards of one journey day: fixed table plus the rhythm (§3.1). Empty = no milestone. */
export function milestoneAt(day: number): Milestone | null {
  if (!Number.isInteger(day) || day < 1) return null;
  const rewards: Reward[] = [...(FIXED_MILESTONES.find((m) => m.day === day)?.rewards ?? [])];
  if (day % 7 === 0) rewards.push({ kind: 'content', id: `review:week:${day / 7}` });
  if (day % 21 === 0) rewards.push({ kind: 'design', id: `constellation:${day / 21}` });
  if (day % 30 === 0) rewards.push({ kind: 'content', id: `review:month:${day / 30}` });
  if (day > 100 && day % 50 === 0) {
    rewards.push({ kind: 'content', id: `review:jubilee:${day}` });
    const unlock = JUBILEE_POOL[day / 50 - 3];
    if (unlock) rewards.push({ kind: 'design', id: unlock });
  }
  if (day % 365 === 0) rewards.push({ kind: 'content', id: `yearbook:${day / 365}` });
  return rewards.length ? { day, key: `milestone:${day}`, rewards } : null;
}

/** Every milestone reached up to the given journey day, in order. */
export function milestonesReached(days: number): Milestone[] {
  const out: Milestone[] = [];
  for (let d = 1; d <= days; d++) {
    const m = milestoneAt(d);
    if (m) out.push(m);
  }
  return out;
}

/** The next milestone after the given day (shown as a quiet silhouette, never a countdown). */
export function nextMilestone(days: number): Milestone {
  for (let d = Math.max(0, Math.floor(days)) + 1; ; d++) {
    const m = milestoneAt(d);
    if (m) return m;
  }
}
