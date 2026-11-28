import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import {
  availableFilters,
  editedEntry,
  ENTRY_MAX,
  erasedEntry,
  foldText,
  indexJournal,
  journalItems,
  newJournalEntry,
  queryJournal,
} from '../../src/domain/journal.ts';
import { cardEncounters, cardLevel, journeyDays, type Facts } from '../../src/domain/progress.ts';
import { studyFacts } from '../../src/domain/study.ts';
import type { CardId, DailyRecord, JournalEntry, Reading } from '../../src/domain/types.ts';
import { isDailyRecord, normalizeJournalEntry } from '../../src/platform/storage/validate.ts';

const ids = CONTENT.cards.map((c) => c.id) as CardId[];
const TOWER = CONTENT.cards.find((c) => c.order === 16)!.id;
const TEMPERANCE = CONTENT.cards.find((c) => c.order === 14)!.id;
const STAR = CONTENT.cards.find((c) => c.order === 17)!.id;
const day = (d: number, h = 9) => new Date(2026, 10, d, h, 0, 0);
const key = (d: number) => `2026-11-${String(d).padStart(2, '0')}`;
let n = 0;
const nextId = () => `id-${++n}`;

function daily(d: number, cardId: CardId, note = ''): DailyRecord {
  return {
    dateKey: key(d),
    deckId: CONTENT.deckId,
    cardId,
    themeId: 'self',
    archetypeId: null,
    locale: 'de',
    contentVersion: CONTENT.version,
    content: {} as DailyRecord['content'],
    revealedAt: day(d).toISOString(),
    note,
  };
}

function reading(id: string, d: number, cardIds: CardId[], note = '', spreadName?: string): Reading {
  return {
    id,
    deckId: CONTENT.deckId,
    themeId: 'love',
    cardIds,
    locale: 'de',
    contentVersion: CONTENT.version,
    content: { ...(spreadName ? { spreadName } : {}) } as Reading['content'],
    createdAt: day(d, 20).toISOString(),
    dateKey: key(d),
    note,
  };
}

const free = (d: number, text: string): JournalEntry => newJournalEntry('free', text, {}, day(d, 21), nextId());

describe('journal: one chronicle (V05.4, S-48)', () => {
  it('daily cards, readings and own entries, newest first; deleted entries are left out', () => {
    const gone = erasedEntry(free(3, 'Weg damit'), day(4));
    const late = free(2, 'Spät noch geschrieben');
    const facts: Facts = {
      dailies: [daily(1, TOWER, 'Unruhiger Tag'), daily(2, STAR)],
      readings: [reading('r1', 2, [TEMPERANCE, ids[0]!, ids[1]!], '', 'Licht und Schatten')],
      journal: [late, gone],
    };
    const items = journalItems(facts);
    expect(items.map((i) => i.key)).toEqual([`entry:${late.id}`, 'reading:r1', `daily:${key(2)}`, `daily:${key(1)}`]);
    expect(items.find((i) => i.source === 'reading')).toMatchObject({ filter: 'reading', spreadName: 'Licht und Schatten', themeId: 'love' });
    expect(items.some((i) => i.id === gone.id)).toBe(false);
  });

  it('an entry about a reading shows the cards of that reading', () => {
    const r = reading('r2', 5, [TOWER, STAR, TEMPERANCE]);
    const e = newJournalEntry('reflection', 'Zur Legung', { readingId: 'r2' }, day(5, 22), nextId());
    const item = journalItems({ dailies: [], readings: [r], journal: [e] }).find((i) => i.source === 'entry')!;
    expect(item.cardIds).toEqual([TOWER, STAR, TEMPERANCE]);
    expect(item.filter).toBe('reflection');
  });
});

describe('filters', () => {
  const facts: Facts = {
    dailies: [daily(1, TOWER, 'Notiz zum Turm'), daily(2, STAR)],
    readings: [reading('r1', 2, [TOWER, ids[0]!, ids[1]!])],
    journal: [studyFacts(TEMPERANCE, 1, 'Antwort im Studium', day(3), nextId).entry!],
  };
  const index = indexJournal(journalItems(facts), CONTENT, 'de');

  it('only offers filters that have entries (no empty filter for numbers or moon)', () => {
    expect(availableFilters(index.items)).toEqual(['daily', 'reading', 'reflection']);
    expect(availableFilters([])).toEqual([]);
  });

  it('filters by kind, by card and by own words', () => {
    expect(queryJournal(index, { filters: ['daily'] }).map((i) => i.key)).toEqual([`daily:${key(2)}`, `daily:${key(1)}`]);
    expect(queryJournal(index, { cardId: TOWER }).map((i) => i.source)).toEqual(['reading', 'daily']);
    expect(queryJournal(index, { written: true }).map((i) => i.text)).toEqual(['Antwort im Studium', 'Notiz zum Turm']);
    expect(queryJournal(index, {}).length).toBe(4);
  });
});

describe('search (E3)', () => {
  const facts: Facts = {
    dailies: [daily(1, TEMPERANCE, 'Heute war es RUHIG'), daily(2, TOWER, 'Ein Café mit Lena')],
    readings: [reading('r1', 3, [STAR, ids[0]!, ids[1]!], 'Über Grenzen nachgedacht')],
  };

  it('ignores case, accents and ß; every word must match, in any order', () => {
    expect(foldText('  Die MÄẞIGKEIT\n ')).toBe('die massigkeit');
    const de = indexJournal(journalItems(facts), CONTENT, 'de');
    expect(queryJournal(de, { text: 'massigkeit' }).map((i) => i.id)).toEqual([key(1)]);
    expect(queryJournal(de, { text: 'cafe' }).map((i) => i.id)).toEqual([key(2)]);
    expect(queryJournal(de, { text: 'ruhig mäßigkeit' }).map((i) => i.id)).toEqual([key(1)]);
    expect(queryJournal(de, { text: 'ruhig turm' })).toEqual([]);
    expect(queryJournal(de, { text: 'uber grenzen' }).map((i) => i.id)).toEqual(['r1']);
  });

  it('finds card titles and themes in the language of the app', () => {
    expect(queryJournal(indexJournal(journalItems(facts), CONTENT, 'de'), { text: 'turm' }).map((i) => i.id)).toEqual([key(2)]);
    const en = indexJournal(journalItems(facts), CONTENT, 'en');
    expect(queryJournal(en, { text: 'tower' }).map((i) => i.id)).toEqual([key(2)]);
    expect(queryJournal(en, { text: 'love' }).map((i) => i.id)).toEqual(['r1']);
  });

  it('searches 1,000 entries within the budget (≤ 50 ms)', () => {
    const words = ['Grenze', 'Café', 'Mut', 'Stille', 'Aufbruch', 'Geduld', 'Freundschaft', 'Zweifel'];
    const text = (i: number) => `${words[i % 8]} und ${words[(i * 3) % 8]}: ${'ein langer Gedanke über den Tag '.repeat(6)}`;
    const big: Facts = {
      dailies: Array.from({ length: 400 }, (_, i) => ({ ...daily(1, ids[i % 22]!, text(i)), dateKey: new Date(2025, 0, 1 + i).toISOString().slice(0, 10) })),
      readings: Array.from({ length: 300 }, (_, i) => ({ ...reading(`r${i}`, 1, [ids[i % 22]!, ids[(i + 1) % 22]!, ids[(i + 2) % 22]!], text(i)), dateKey: new Date(2025, 0, 1 + i).toISOString().slice(0, 10) })),
      journal: Array.from({ length: 300 }, (_, i) => newJournalEntry('free', text(i), {}, new Date(2025, 0, 1 + i, 21), `e${i}`)),
    };
    const run = () => {
      const t0 = performance.now();
      const index = indexJournal(journalItems(big), CONTENT, 'de');
      const hits = queryJournal(index, { text: 'cafe geduld' }).length + queryJournal(index, { text: 'turm', written: true }).length;
      return { ms: performance.now() - t0, hits, size: index.items.length };
    };
    run(); // warm-up
    const runs = Array.from({ length: 5 }, run);
    const median = runs.map((r) => r.ms).sort((a, b) => a - b)[2]!;
    expect(runs[0]!.size).toBe(1000);
    expect(runs[0]!.hits).toBeGreaterThan(0);
    expect(median).toBeLessThan(50);
  });
});

describe('writing and deleting (S-49)', () => {
  it('an entry needs text; it is trimmed and limited like a note', () => {
    expect(() => newJournalEntry('free', '   ', {}, day(1), 'x')).toThrow();
    const e = newJournalEntry('free', '  Gedanke  ', {}, day(1, 23), 'x');
    expect(e).toMatchObject({ text: 'Gedanke', dateKey: key(1), kind: 'free' });
    expect(newJournalEntry('free', 'a'.repeat(ENTRY_MAX + 50), {}, day(1), 'y').text).toHaveLength(ENTRY_MAX);
    expect(editedEntry(e, 'Neu', day(2)).text).toBe('Neu');
    expect(editedEntry(e, ' ', day(2)).deletedAt).toBeDefined();
    expect(() => editedEntry(erasedEntry(e, day(2)), 'wieder', day(3))).toThrow();
  });

  it('deleting removes the words, not the day: the journey and the card level stay', () => {
    // Day 5 has only a free entry; the Star reaches level 4 through study part 1, 2 and an answer.
    const p1 = studyFacts(STAR, 1, '', day(2), nextId);
    const p2 = studyFacts(STAR, 2, 'Was mich trägt', day(3), nextId);
    const lone = free(5, 'Nur geschrieben');
    const before: Facts = { dailies: [daily(1, STAR)], readings: [], journal: [p2.entry!, lone], events: [p1.event, p2.event] };
    expect(journeyDays(before)).toBe(4);
    expect(cardLevel(cardEncounters(before).get(STAR))).toBe(4);

    const after: Facts = { ...before, journal: [erasedEntry(p2.entry!, day(6)), erasedEntry(lone, day(6))] };
    expect(after.journal!.every((j) => j.text === '' && j.deletedAt)).toBe(true);
    expect(journalItems(after).filter((i) => i.source === 'entry')).toEqual([]);
    expect(journeyDays(after)).toBe(4);
    expect(cardLevel(cardEncounters(after).get(STAR))).toBe(4);
  });

  it('a note that was written once still counts after it is deleted (notedAt)', () => {
    const p1 = studyFacts(TOWER, 1, '', day(2), nextId);
    const p2 = studyFacts(TOWER, 2, '', day(3), nextId);
    const noted = { ...daily(1, TOWER, 'Notiz'), notedAt: day(1, 10).toISOString() };
    const facts = (d: DailyRecord): Facts => ({ dailies: [d], readings: [], events: [p1.event, p2.event] });
    expect(cardLevel(cardEncounters(facts(noted)).get(TOWER))).toBe(4);
    expect(cardLevel(cardEncounters(facts({ ...noted, note: '' })).get(TOWER))).toBe(4);
    // Without notedAt (a record from before 0.5 whose note was emptied) there is no reflection.
    expect(cardLevel(cardEncounters(facts(daily(1, TOWER))).get(TOWER))).toBe(3);
  });
});

describe('storage of the new fields', () => {
  it('keeps notedAt and deletedAt and rejects broken values', () => {
    const e = erasedEntry(newJournalEntry('free', 'x', {}, day(1), 'z'), day(2));
    expect(normalizeJournalEntry(e)).toEqual(e);
    expect(normalizeJournalEntry({ ...e, deletedAt: 5 })).toBeNull();
    expect(isDailyRecord({ ...daily(1, STAR, 'n'), content: { message: 'm', cardTitle: 't' }, notedAt: day(1).toISOString() })).toBe(true);
    expect(isDailyRecord({ ...daily(1, STAR, 'n'), content: { message: 'm', cardTitle: 't' }, notedAt: 1 })).toBe(false);
  });
});
