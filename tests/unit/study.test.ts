import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import { deepCard, deepKeys, DEEP_CARD_IDS, DEEP_DECK_ORDER, DEEP_ROLES, deepTable } from '../../src/content/modules/cards-deep-keys.ts';
import { loadModule } from '../../src/content/modules/registry.ts';
import { MODULE_RULES, validateModule } from '../../src/content/modules/validate.ts';
import type { Clock } from '../../src/domain/clock.ts';
import { lensKey } from '../../src/domain/lens.ts';
import { createDailyRecord, createDraft, finalizeReading, REFLECTION_VARIANTS, revealAll, RITUAL_VARIANTS, varietyFor } from '../../src/domain/oracle.ts';
import { cardEncounters, cardLevel, journeyDays, type Facts } from '../../src/domain/progress.ts';
import { seededRng } from '../../src/domain/random.ts';
import { cardLayers, LEVEL_PHASE, nextStudyPart, studyFacts } from '../../src/domain/study.ts';
import type { ActivityEvent, DailyRecord, JournalEntry } from '../../src/domain/types.ts';

const fool = 'major-00-fool';
const at = (d: number, h = 9): Clock => ({ now: () => new Date(2026, 10, d, h, 0, 0) });
let n = 0;
const id = () => `id-${++n}`;

function firstEncounter(cardId = fool): Facts {
  const r = createDailyRecord({ pack: CONTENT, clock: at(1), rng: seededRng(1), themeId: 'self', archetypeId: null, locale: 'de', previousCardId: null });
  return { dailies: [{ ...r, cardId }], readings: [], journal: [], events: [] };
}

/** One study session: the parts done in it, the answer written (or none). */
function session(facts: Facts, day: number, parts: (1 | 2)[], answer = ''): Facts {
  const events: ActivityEvent[] = [...(facts.events ?? [])];
  const journal: JournalEntry[] = [...(facts.journal ?? [])];
  for (const part of parts) {
    const f = studyFacts(fool, part, answer, at(day).now(), id);
    events.push(f.event);
    if (f.entry) journal.push(f.entry);
  }
  return { ...facts, events, journal };
}

const level = (facts: Facts) => cardLevel(cardEncounters(facts).get(fool));

describe('card study (V05.1)', () => {
  it('reaches every level in at most two study sessions, without chance', () => {
    const start = firstEncounter();
    expect(level(start)).toBe(1);
    expect(nextStudyPart(cardEncounters(start).get(fool))).toEqual({ part: 1, again: false });

    const one = session(start, 2, [1]);
    expect(level(one)).toBe(2);
    expect(nextStudyPart(cardEncounters(one).get(fool))).toEqual({ part: 2, again: false });

    const two = session(one, 3, [2], 'Ich gehe los, bevor ich bereit bin.');
    expect(level(two)).toBe(4);
    expect(nextStudyPart(cardEncounters(two).get(fool))).toEqual({ part: 1, again: true });

    // Without a written answer, part 2 opens level 3; both parts in one session work as well.
    expect(level(session(one, 3, [2]))).toBe(3);
    expect(level(session(start, 2, [1, 2], 'Ein Satz.'))).toBe(4);
  });

  it('a tap on "read" leaves only an event; an answer with text becomes a study entry', () => {
    const quiet = studyFacts(fool, 1, '   ', at(4, 23).now(), id);
    expect(quiet.entry).toBeNull();
    expect(quiet.event).toMatchObject({ type: 'card.studied', dateKey: '2026-11-04', refs: { cardId: fool, part: 1 } });
    const written = studyFacts(fool, 2, ' Mein Satz ', at(5, 0).now(), id);
    expect(written.entry).toMatchObject({ kind: 'study', dateKey: '2026-11-05', text: 'Mein Satz', refs: { cardId: fool } });
  });

  it('counts a study day as a journey day, never twice, and part 2 alone does not count as studied', () => {
    const facts = session(session(firstEncounter(), 2, [1]), 2, [2]);
    expect(journeyDays(facts)).toBe(2);
    const only2 = session(firstEncounter(), 2, [2]);
    expect(cardEncounters(only2).get(fool)?.studied).toEqual({ part1: false, part2: false });
  });

  it('unsaved readings do not count, several readings on one day are one day', () => {
    const draft = revealAll(createDraft(CONTENT, 'love', at(6), seededRng(6)));
    const unsaved: Facts = { dailies: [], readings: [] };
    expect(cardEncounters(unsaved).get(draft.cardIds[0]!)).toBeUndefined();
    const saved = [1, 2, 3].map(() => finalizeReading(CONTENT, draft, 'de', at(6)));
    const e = cardEncounters({ dailies: [], readings: saved }).get(draft.cardIds[0]!);
    expect(e?.days.size).toBe(1);
    expect(cardLevel(e)).toBe(1);
  });
});

describe('card layers', () => {
  it('opens the layers cumulatively, nothing before the first encounter', () => {
    expect(cardLayers(0)).toEqual([]);
    expect(cardLayers(1)).toEqual(['essence', 'message']);
    expect(cardLayers(2)).toEqual(['essence', 'message', 'light', 'shadow', 'keyword']);
    expect(cardLayers(4)).toHaveLength(12);
    expect(LEVEL_PHASE[0]).toBe('new');
    expect(LEVEL_PHASE[4]).toBe('full');
  });
});

describe('module cards-deep', () => {
  it('follows the deck order of core and holds the written groups', () => {
    expect(DEEP_DECK_ORDER).toEqual([...CONTENT.cards].sort((a, b) => a.order - b.order).map((c) => c.id));
    expect(DEEP_CARD_IDS.length % 7 === 1 || DEEP_CARD_IDS.length === 22).toBe(true);
    expect(deepKeys(fool)).toHaveLength(15);
  });

  it('turns the authoring objects into keys and back', async () => {
    for (const locale of ['de', 'en'] as const) {
      const table = await loadModule('cards-deep', locale);
      for (const cardId of DEEP_CARD_IDS) {
        const card = deepCard(table, cardId);
        expect(card, cardId).not.toBeNull();
        expect(deepTable({ [cardId]: card! })).toEqual(Object.fromEntries(deepKeys(cardId).map((k) => [k, table[k]])));
        for (const r of DEEP_ROLES) expect(card!.roles[r]).not.toBe(`role.${r}.${cardId}`);
      }
      expect(deepCard(table, 'major-99-none')).toBeNull();
    }
  });

  it('rejects an empty module and a promise about the future', () => {
    const empty = validateModule('cards-deep', MODULE_RULES['cards-deep'], CONTENT, { de: {}, en: {} });
    expect(empty.errors).toContain(`cards-deep/de: missing light.${fool}`);
    const promise = validateModule('cards-deep', { ...MODULE_RULES['cards-deep']!, required: () => [] }, CONTENT, {
      de: { [`role.possibility.${fool}`]: 'Bald wirst du einen neuen Weg finden.' },
      en: { [`role.possibility.${fool}`]: 'Soon you will find a new path.' },
    });
    expect(promise.errors.filter((e) => e.includes('forbidden phrasing'))).toHaveLength(4);
  });
});

describe('rotating reflection and ritual on "Heute" (A4)', () => {
  it('walks through all six combinations before one returns', () => {
    const combos = [0, 1, 2, 3, 4, 5].map((n) => JSON.stringify(varietyFor(n)));
    expect(new Set(combos).size).toBe(REFLECTION_VARIANTS * RITUAL_VARIANTS);
    expect(varietyFor(6)).toEqual(varietyFor(0));
    expect(varietyFor(-1)).toEqual({ reflection: 0, ritual: 0 });
    expect(varietyFor(Number.NaN)).toEqual({ reflection: 0, ritual: 0 });
  });

  it('repeats no combination of message, lens, reflection and ritual within 21 days over 66 days', async () => {
    const table = await loadModule('cards-deep', 'de');
    const identity = await loadModule('identity', 'de');
    const dailies: DailyRecord[] = [];
    for (let day = 1; day <= 66; day++) {
      const r = createDailyRecord({
        pack: CONTENT,
        clock: { now: () => new Date(2026, 0, day, 9, 0, 0) },
        rng: seededRng(2000 + day),
        themeId: 'self',
        archetypeId: 'seeker',
        locale: 'de',
        previousCardId: dailies.at(-1)?.cardId ?? null,
        lens: { journeyDay: day, complementId: 'sage', text: (a, c) => identity[lensKey(a, c)] },
        variety: {
          encounters: (cardId) => cardEncounters({ dailies, readings: [] }).get(cardId)?.days.size ?? 0,
          deep: (cardId) => deepCard(table, cardId),
        },
      });
      // The stored texts are the ones the variant names (0 = core).
      const card = CONTENT.cards.find((c) => c.id === r.cardId)!;
      const deep = deepCard(table, r.cardId)!;
      expect(r.content.reflection).toBe([card.reflection.de, ...deep.reflections][r.variant!.reflection]);
      expect(r.content.ritual).toBe([card.ritual.de, deep.ritual][r.variant!.ritual]);
      dailies.push(r);
    }
    const combo = (r: DailyRecord) => [r.content.message, r.content.lens, r.content.reflection, r.content.ritual].join('|');
    dailies.forEach((r, i) => {
      expect(dailies.slice(Math.max(0, i - 20), i).map(combo), r.dateKey).not.toContain(combo(r));
    });
    expect(new Set(dailies.map((r) => r.variant!.reflection))).toEqual(new Set([0, 1, 2]));
    expect(new Set(dailies.map((r) => r.variant!.ritual))).toEqual(new Set([0, 1]));
  });

  it('keeps the core texts as variant 0 when cards-deep is missing', () => {
    const input = { pack: CONTENT, clock: at(7), themeId: 'self', archetypeId: null, locale: 'de', previousCardId: null } as const;
    const plain = createDailyRecord({ ...input, rng: seededRng(7) });
    expect(plain.variant).toBeUndefined();
    const missing = createDailyRecord({ ...input, rng: seededRng(7), variety: { encounters: () => 4, deep: () => null } });
    expect(missing.variant).toEqual({ lens: 0, reflection: 0, ritual: 0 });
    expect(missing.content).toEqual(plain.content);
  });
});
