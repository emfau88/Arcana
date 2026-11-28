import { describe, expect, it } from 'vitest';
import { parsePath } from '../../src/app/router.ts';
import { CONTENT } from '../../src/content/index.ts';
import { BOOK_CHAPTERS, BOOK_OPENED, CHAPTER_PATH, levelSeenKey, metRituals, newCardLevels, ritualId } from '../../src/domain/book.ts';
import type { Facts } from '../../src/domain/progress.ts';
import type { ActivityEvent, CardId, DailyRecord, SeenFlag } from '../../src/domain/types.ts';

const FOOL = CONTENT.cards.find((c) => c.order === 0)!.id;
const STAR = CONTENT.cards.find((c) => c.order === 17)!.id;
const SUN = CONTENT.cards.find((c) => c.order === 19)!.id;
const day = (d: number, h = 9) => new Date(2026, 10, d, h, 0, 0);
const key = (d: number) => `2026-11-${String(d).padStart(2, '0')}`;

function daily(d: number, cardId: CardId, ritual = '', variant = 0): DailyRecord {
  return {
    dateKey: key(d),
    deckId: CONTENT.deckId,
    cardId,
    themeId: 'self',
    archetypeId: null,
    locale: 'de',
    contentVersion: CONTENT.version,
    content: { ritual } as DailyRecord['content'],
    revealedAt: day(d).toISOString(),
    note: '',
    variant: { lens: 0, reflection: 0, ritual: variant },
  };
}
const event = (type: ActivityEvent['type'], d: number, refs: ActivityEvent['refs']): ActivityEvent => ({
  id: `${type}-${d}-${JSON.stringify(refs)}`,
  type,
  dateKey: key(d),
  at: day(d).toISOString(),
  refs,
});
const facts = (dailies: DailyRecord[], events: ActivityEvent[] = []): Facts => ({ dailies, readings: [], events });
const seen = (k: string, d: number): SeenFlag => ({ key: k, seenAt: day(d).toISOString() });

describe('book chapters (V05.3)', () => {
  it('shows only built chapters, in book order, each with its own route', () => {
    expect(BOOK_CHAPTERS).toEqual(['cards', 'archetypes', 'journal', 'rituals', 'journey']);
    for (const id of BOOK_CHAPTERS) expect(parsePath(`#${CHAPTER_PATH[id]}`).route.name).not.toBe('notfound');
  });
});

describe('met rituals', () => {
  it('lists each ritual once, with the latest text, the most recently met first', () => {
    const list = metRituals([daily(1, STAR, 'Stern A'), daily(3, SUN, 'Sonne A'), daily(5, STAR, 'Stern A neu'), daily(6, STAR, 'Stern B', 1), daily(7, FOOL)]);
    expect(list.map((r) => r.id)).toEqual([ritualId(STAR, 1), ritualId(STAR, 0), ritualId(SUN, 0)]);
    const star = list[1]!;
    expect(star).toMatchObject({ cardId: STAR, text: 'Stern A neu', firstKey: key(1), lastKey: key(5), doneKeys: [] });
  });

  it('records a ritual as done once per day, ignoring other events and unknown rituals', () => {
    const id = ritualId(STAR, 0);
    const events = [
      event('ritual.done', 4, { ritualId: id }),
      event('ritual.done', 2, { ritualId: id }),
      event('ritual.done', 4, { ritualId: id }),
      event('card.studied', 4, { cardId: STAR, part: 1 }),
      event('ritual.done', 4, { ritualId: ritualId(SUN, 1) }),
    ];
    const [star] = metRituals([daily(1, STAR, 'Stern')], events);
    expect(star!.doneKeys).toEqual([key(2), key(4)]);
  });
});

describe('"new" glow of card levels (E2)', () => {
  it('starts with the first opening of the book, so earlier levels never glow', () => {
    const f = facts([daily(1, STAR), daily(4, SUN)]);
    expect(newCardLevels(f, []).size).toBe(0);
    expect([...newCardLevels(f, [seen(BOOK_OPENED, 3)])]).toEqual([SUN]);
  });

  it('settles when the card page has been seen and returns with the next level', () => {
    const opened = seen(BOOK_OPENED, 3);
    expect(newCardLevels(facts([daily(4, SUN)]), [opened, seen(levelSeenKey(SUN, 1), 4)]).size).toBe(0);
    // A second day with the sun makes level 2: new again until that level is seen.
    const twice = facts([daily(4, SUN), daily(5, SUN)]);
    expect([...newCardLevels(twice, [opened, seen(levelSeenKey(SUN, 1), 4)])]).toEqual([SUN]);
    expect(newCardLevels(twice, [opened, seen(levelSeenKey(SUN, 2), 5)]).size).toBe(0);
  });

  it('counts a study after the opening, even for a card met before it', () => {
    const f = facts([daily(1, STAR)], [event('card.studied', 5, { cardId: STAR, part: 1 })]);
    expect([...newCardLevels(f, [seen(BOOK_OPENED, 3)])]).toEqual([STAR]);
  });
});
