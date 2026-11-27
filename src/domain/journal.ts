/**
 * Journal (V05.4, Grimoire chapter IV, PRODUCT_SYSTEMS E3): one chronicle of daily cards, saved
 * readings and own entries, newest first, with filters and a local search. Notes stay on their
 * records (IA §5.3): the journal is a derived view and copies nothing (S-48). Deleting removes the
 * words, never the fact of the day, so the journey and the card levels never drop (S-49).
 */
import type { ContentPack } from '../content/schema.ts';
import { localDateKey } from './clock.ts';
import { readingDateKey, type Facts } from './progress.ts';
import type { CardId, JournalEntry, JournalKind, JournalRefs, Locale, ThemeId } from './types.ts';

export type JournalFilter = 'daily' | 'reading' | 'reflection' | 'number' | 'moon';
/** Order of the filters. Only those with entries are offered (availableFilters). */
export const JOURNAL_FILTERS: readonly JournalFilter[] = ['daily', 'reading', 'reflection', 'number', 'moon'];

const FILTER_OF_KIND: Readonly<Record<JournalKind, JournalFilter>> = {
  reflection: 'reflection',
  study: 'reflection',
  free: 'reflection',
  'number-encounter': 'number',
  'moon-intention': 'moon',
  'moon-reflection': 'moon',
};

export interface JournalItem {
  /** Unique across sources: 'daily:<dateKey>', 'reading:<id>', 'entry:<id>'. */
  key: string;
  source: 'daily' | 'reading' | 'entry';
  /** What opens or changes it: the dateKey of a daily card, the id of a reading or an entry. */
  id: string;
  filter: JournalFilter;
  /** Entries only. */
  kind?: JournalKind;
  dateKey: string;
  /** ISO time, orders items within a day. */
  at: string;
  /** Own words: the note or the entry text ('' = none yet). */
  text: string;
  cardIds: readonly CardId[];
  themeId?: ThemeId;
  /** Name stored with a spread of V05.2, in the language of the reading. */
  spreadName?: string;
}

const newestFirst = (a: JournalItem, b: JournalItem): number =>
  a.dateKey !== b.dateKey ? (a.dateKey < b.dateKey ? 1 : -1) : a.at !== b.at ? (a.at < b.at ? 1 : -1) : a.key < b.key ? -1 : a.key > b.key ? 1 : 0;

/** All journal items, newest first. Deleted entries are left out. */
export function journalItems(facts: Facts): JournalItem[] {
  const out: JournalItem[] = [];
  const readingCards = new Map<string, readonly CardId[]>();
  for (const d of facts.dailies) {
    out.push({ key: `daily:${d.dateKey}`, source: 'daily', id: d.dateKey, filter: 'daily', dateKey: d.dateKey, at: d.revealedAt, text: d.note ?? '', cardIds: [d.cardId], themeId: d.themeId });
  }
  for (const r of facts.readings) {
    readingCards.set(r.id, r.cardIds);
    const dateKey = readingDateKey(r);
    if (dateKey === null) continue;
    const spreadName = r.content.spreadName;
    out.push({
      key: `reading:${r.id}`,
      source: 'reading',
      id: r.id,
      filter: 'reading',
      dateKey,
      at: r.createdAt,
      text: r.note ?? '',
      cardIds: r.cardIds,
      themeId: r.themeId,
      ...(spreadName ? { spreadName } : {}),
    });
  }
  for (const j of facts.journal ?? []) {
    if (j.deletedAt !== undefined) continue;
    const cardIds = j.refs.cardId ? [j.refs.cardId] : j.refs.readingId ? (readingCards.get(j.refs.readingId) ?? []) : [];
    out.push({ key: `entry:${j.id}`, source: 'entry', id: j.id, filter: FILTER_OF_KIND[j.kind], kind: j.kind, dateKey: j.dateKey, at: j.createdAt, text: j.text, cardIds });
  }
  return out.sort(newestFirst);
}

/** The filters that have at least one item, in the fixed order (no empty filter for later worlds). */
export function availableFilters(items: readonly JournalItem[]): JournalFilter[] {
  const present = new Set(items.map((i) => i.filter));
  return JOURNAL_FILTERS.filter((f) => present.has(f));
}

/* ------------------------------------------------------------------ Search */

/** Lower case without accents, ß as ss, single spaces: "Mäßigkeit" and "massigkeit" find each other. */
export function foldText(s: string): string {
  return s
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface JournalIndex {
  readonly items: readonly JournalItem[];
  /** Folded search text per item: own words, card titles, theme and spread name. */
  readonly hay: readonly string[];
}

/** Built once per change of the data or the language; a query then only compares strings. */
export function indexJournal(items: readonly JournalItem[], pack: ContentPack, locale: Locale): JournalIndex {
  const titles = new Map(pack.cards.map((c) => [c.id, c.title[locale]]));
  const themes = new Map<string, string>(pack.themes.map((t) => [t.id, t.label[locale]]));
  const hay = items.map((i) =>
    foldText([i.text, ...i.cardIds.map((id) => titles.get(id) ?? ''), i.themeId ? (themes.get(i.themeId) ?? '') : '', i.spreadName ?? ''].join(' ')),
  );
  return { items, hay };
}

export interface JournalQuery {
  /** Words; an item matches when it contains every word (in any order). */
  text?: string;
  /** Empty or missing = all filters. */
  filters?: readonly JournalFilter[];
  cardId?: CardId;
  /** Only items with own words. */
  written?: boolean;
}

export function queryJournal(index: JournalIndex, q: JournalQuery = {}): JournalItem[] {
  const terms = foldText(q.text ?? '')
    .split(' ')
    .filter((t) => t.length > 0);
  const filters = q.filters && q.filters.length > 0 ? new Set(q.filters) : null;
  const out: JournalItem[] = [];
  index.items.forEach((item, i) => {
    if (filters && !filters.has(item.filter)) return;
    if (q.cardId && !item.cardIds.includes(q.cardId)) return;
    if (q.written && item.text.trim().length === 0) return;
    const hay = index.hay[i] ?? '';
    if (terms.every((t) => hay.includes(t))) out.push(item);
  });
  return out;
}

/* ------------------------------------------------------------------ Writing and deleting */

/** Kinds a person writes in V05.4. Study answers come from the card page (study.ts). */
export type WritableKind = 'free' | 'reflection';
/** Same limit as the notes on a daily card or a reading. */
export const ENTRY_MAX = 2000;

function cleanText(text: string): string {
  return text.trim().slice(0, ENTRY_MAX);
}

export function newJournalEntry(kind: WritableKind, text: string, refs: JournalRefs, now: Date, id: string): JournalEntry {
  const clean = cleanText(text);
  if (clean.length === 0) throw new Error('A journal entry needs text');
  const at = now.toISOString();
  return { id, kind, dateKey: localDateKey(now), text: clean, refs, createdAt: at, updatedAt: at };
}

/** S-49: the words go, date, kind and refs stay as the fact of that day. */
export function erasedEntry(entry: JournalEntry, now: Date): JournalEntry {
  const at = now.toISOString();
  return { ...entry, text: '', updatedAt: at, deletedAt: at };
}

/** New text for an entry. Empty text deletes it. A deleted entry cannot be edited. */
export function editedEntry(entry: JournalEntry, text: string, now: Date): JournalEntry {
  if (entry.deletedAt !== undefined) throw new Error('A deleted entry cannot be edited');
  const clean = cleanText(text);
  if (clean.length === 0) return erasedEntry(entry, now);
  return { ...entry, text: clean, updatedAt: now.toISOString() };
}
