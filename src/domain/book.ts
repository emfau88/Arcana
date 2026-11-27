/**
 * The Grimoire as a book (V05.3, PRODUCT_SYSTEMS E): its chapters, the rituals a person has met and
 * the "new" glow of card levels (E2). Pure functions over stored facts (D-09); nothing is stored
 * here except what the caller writes as a seen flag or an event.
 */
import { localDateKey } from './clock.ts';
import { cardEncounters, cardLevel, type Facts } from './progress.ts';
import type { ActivityEvent, CardId, DailyRecord, Locale, SeenFlag } from './types.ts';

/* ---------------------------------------------------------------- Chapters */

/**
 * Chapters in book order. Symbols and numbers join with their worlds in V06, between archetypes
 * and journal and between rituals and journey (PRODUCT_SYSTEMS E). Until then they are not shown
 * at all: nothing is announced before it is built (D-54).
 */
export type BookChapterId = 'cards' | 'archetypes' | 'journal' | 'rituals' | 'journey';
export const BOOK_CHAPTERS: readonly BookChapterId[] = ['cards', 'archetypes', 'journal', 'rituals', 'journey'];

export const CHAPTER_PATH: Readonly<Record<BookChapterId, string>> = {
  cards: '/grimoire/cards',
  archetypes: '/grimoire/archetypes',
  journal: '/grimoire/journal',
  rituals: '/grimoire/rituals',
  journey: '/grimoire/journey',
};

/* ----------------------------------------------------------------- Rituals */

/** A ritual is the ritual of a card in one of its two versions (core = 0, deep = 1, A4). */
export const ritualId = (cardId: CardId, variant: number): string => `${cardId}:${variant}`;

export interface MetRitual {
  id: string;
  cardId: CardId;
  /** As stored with the latest daily card that brought it (records never change, D-09). */
  text: string;
  locale: Locale;
  firstKey: string;
  lastKey: string;
  /** Local days it was marked as done, oldest first (one per day). */
  doneKeys: string[];
}

/** Rituals met on daily cards, the most recently met first, each once. */
export function metRituals(dailies: readonly DailyRecord[], events: readonly ActivityEvent[] = []): MetRitual[] {
  const done = new Map<string, Set<string>>();
  for (const e of events) {
    if (e.type !== 'ritual.done' || !e.refs.ritualId) continue;
    const days = done.get(e.refs.ritualId) ?? new Set<string>();
    days.add(e.dateKey);
    done.set(e.refs.ritualId, days);
  }
  const byId = new Map<string, MetRitual>();
  for (const d of [...dailies].sort((a, b) => (a.dateKey < b.dateKey ? -1 : a.dateKey > b.dateKey ? 1 : 0))) {
    const text = d.content.ritual?.trim();
    if (!text) continue;
    const id = ritualId(d.cardId, d.variant?.ritual ?? 0);
    const known = byId.get(id);
    if (known) Object.assign(known, { text, locale: d.locale, lastKey: d.dateKey });
    else byId.set(id, { id, cardId: d.cardId, text, locale: d.locale, firstKey: d.dateKey, lastKey: d.dateKey, doneKeys: [] });
  }
  const out = [...byId.values()];
  for (const r of out) r.doneKeys = [...(done.get(r.id) ?? [])].sort();
  return out.sort((a, b) => (a.lastKey !== b.lastKey ? (a.lastKey < b.lastKey ? 1 : -1) : a.id < b.id ? -1 : 1));
}

/* ------------------------------------------------------------- "New" glow */

/** Written the first time the book is opened; levels reached before that are not "new". */
export const BOOK_OPENED = 'book:opened';
/** Seen flag of one level of one card, written when its card page opens. */
export const levelSeenKey = (cardId: CardId, level: number): string => `level:${cardId}:${level}`;

/**
 * Cards whose current level has not been looked at yet (E2: "new" until seen). Only levels that
 * may have been reached since the book was first opened count, so an update does not light up
 * every card at once. The level is derived, never stored (D-09).
 */
export function newCardLevels(facts: Facts, seen: readonly SeenFlag[]): Set<CardId> {
  const out = new Set<CardId>();
  const opened = seen.find((s) => s.key === BOOK_OPENED);
  if (!opened) return out;
  const since = localDateKey(new Date(opened.seenAt));
  const seenKeys = new Set(seen.map((s) => s.key));
  const studyDays = new Map<CardId, string>();
  for (const e of facts.events ?? []) {
    const id = e.refs.cardId;
    if (e.type === 'card.studied' && id && (studyDays.get(id) ?? '') < e.dateKey) studyDays.set(id, e.dateKey);
  }
  for (const [id, e] of cardEncounters(facts)) {
    const level = cardLevel(e);
    if (level === 0 || seenKeys.has(levelSeenKey(id, level))) continue;
    const latest = [...e.days, studyDays.get(id) ?? ''].reduce((a, b) => (b > a ? b : a), '');
    if (latest >= since) out.add(id);
  }
  return out;
}
