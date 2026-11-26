import { describe, expect, it } from 'vitest';
import { CONTENT, getCard, resolveTheme } from '../../src/content/index.ts';
import type { Clock } from '../../src/domain/clock.ts';
import { freeCoreEntitlements, CORE_ENTITLEMENTS } from '../../src/domain/entitlements.ts';
import {
  buildHistory,
  composeDaily,
  composeReading,
  createDailyRecord,
  createDraft,
  deriveCollection,
  drawDailyCardId,
  finalizeReading,
  isFullyRevealed,
  journeyDays,
  previousDailyCard,
  revealAll,
  revealPosition,
} from '../../src/domain/oracle.ts';
import { seededRng } from '../../src/domain/random.ts';
import type { DailyRecord } from '../../src/domain/types.ts';

const at = (iso: string): Clock => ({ now: () => new Date(iso) });
const localClock = (y: number, m: number, d: number, h = 9): Clock => ({ now: () => new Date(y, m - 1, d, h, 0, 0) });

function daily(dateKey: string, cardId: string, revealedAt = `${dateKey}T08:00:00.000Z`): DailyRecord {
  const r = createDailyRecord({
    pack: CONTENT,
    clock: at(revealedAt),
    rng: seededRng(1),
    themeId: 'self',
    archetypeId: null,
    locale: 'de',
    previousCardId: null,
  });
  return { ...r, dateKey, cardId, revealedAt };
}

describe('daily card', () => {
  it('never repeats the previous card when the deck allows it', () => {
    const rng = seededRng(11);
    for (const prev of CONTENT.cards.map((c) => c.id)) {
      for (let i = 0; i < 50; i++) expect(drawDailyCardId(CONTENT, prev, rng)).not.toBe(prev);
    }
  });

  it('creates a record for the local day with stored, immutable content', () => {
    const r = createDailyRecord({
      pack: CONTENT,
      clock: localClock(2026, 11, 26, 23),
      rng: seededRng(5),
      themeId: 'love',
      archetypeId: 'seeker',
      locale: 'en',
      previousCardId: null,
    });
    expect(r.dateKey).toBe('2026-11-26');
    expect(r.contentVersion).toBe(CONTENT.version);
    expect(r.locale).toBe('en');
    expect(r.themeId).toBe('love');
    const card = getCard(CONTENT, r.cardId);
    expect(r.content.cardTitle).toBe(card.title.en);
    expect(r.content.message).toBe(card.themes.love?.en);
    expect(r.content.lens).toBeTruthy();
    expect(r.note).toBe('');
  });

  it('neutral profile gets no archetype lens', () => {
    const c = composeDaily(CONTENT, CONTENT.cards[0]!.id, 'self', null, 'de');
    expect(c.lens).toBeNull();
  });

  it('offers all six themes and falls back to the default when a pack lacks one', () => {
    for (const th of ['self', 'love', 'career', 'change', 'balance', 'creativity'] as const) expect(resolveTheme(CONTENT, th)).toBe(th);
    const partial = { ...CONTENT, availableThemes: ['self', 'love'] as const };
    expect(resolveTheme(partial, 'career')).toBe(CONTENT.defaultTheme);
    const r = createDailyRecord({
      pack: partial,
      clock: localClock(2026, 11, 26),
      rng: seededRng(2),
      themeId: 'career',
      archetypeId: null,
      locale: 'de',
      previousCardId: null,
    });
    expect(r.themeId).toBe(CONTENT.defaultTheme);
  });

  it('finds the most recent earlier daily card', () => {
    const ds = [daily('2026-11-20', 'a'), daily('2026-11-24', 'b'), daily('2026-11-26', 'c')];
    expect(previousDailyCard(ds, '2026-11-26')).toBe('b');
    expect(previousDailyCard(ds, '2026-11-20')).toBeNull();
    expect(previousDailyCard([], '2026-11-26')).toBeNull();
  });
});

describe('three-card reading', () => {
  it('draws three distinct cards and reveals them one by one', () => {
    const rng = seededRng(9);
    for (let i = 0; i < 100; i++) {
      const d = createDraft(CONTENT, 'self', localClock(2026, 11, 26), rng);
      expect(new Set(d.cardIds).size).toBe(3);
      expect(d.revealed).toEqual([false, false, false]);
    }
    let d = createDraft(CONTENT, 'love', localClock(2026, 11, 26), seededRng(1));
    d = revealPosition(d, 1);
    expect(d.revealed).toEqual([false, true, false]);
    expect(revealPosition(d, 1)).toBe(d); // idempotent
    expect(isFullyRevealed(d)).toBe(false);
    d = revealAll(d);
    expect(isFullyRevealed(d)).toBe(true);
    expect(revealAll(d)).toBe(d);
  });

  it('refuses to save an unrevealed reading', () => {
    const d = createDraft(CONTENT, 'self', localClock(2026, 11, 26), seededRng(1));
    expect(() => finalizeReading(CONTENT, d, 'de', localClock(2026, 11, 26))).toThrow();
  });

  it('composes a coherent interpretation in the stored locale', () => {
    const ids = CONTENT.cards.map((c) => c.id) as [string, string, string];
    const c = composeReading(CONTENT, ids, 'love', 'de');
    expect(c.positions.map((p) => p.position)).toEqual(['situation', 'challenge', 'impulse']);
    c.positions.forEach((p, i) => {
      const card = getCard(CONTENT, ids[i]!);
      expect(p.cardTitle).toBe(card.title.de);
      expect(p.text).toBe(card.positions[p.position].de);
    });
    const impulse = getCard(CONTENT, ids[2]);
    expect(c.synthesis).toBe(impulse.themes.love?.de);
    expect(c.reflection).toBe(impulse.reflection.de);
  });

  it('saved readings keep their text when content changes later', () => {
    const d = revealAll(createDraft(CONTENT, 'self', localClock(2026, 11, 26), seededRng(4)));
    const saved = finalizeReading(CONTENT, d, 'de', localClock(2026, 11, 26));
    const before = JSON.stringify(saved.content);
    const changedPack = { ...CONTENT, version: 'later', cards: CONTENT.cards.map((card) => ({ ...card, essence: { de: 'neu', en: 'new' } })) };
    composeReading(changedPack, saved.cardIds, 'self', 'de');
    expect(JSON.stringify(saved.content)).toBe(before);
    expect(saved.contentVersion).toBe(CONTENT.version);
  });
});

describe('collection and history', () => {
  it('counts each card once, with appearances and earliest sighting', () => {
    const ds = [daily('2026-11-25', 'major-16-tower', '2026-11-25T08:00:00.000Z'), daily('2026-11-26', 'major-19-sun', '2026-11-26T08:00:00.000Z')];
    const drawn = revealAll(createDraft(CONTENT, 'self', at('2026-11-24T10:00:00.000Z'), seededRng(1)));
    const d = { ...drawn, cardIds: ['major-16-tower', 'major-19-sun', 'major-02-high-priestess'] as [string, string, string] };
    const r = finalizeReading(CONTENT, d, 'de', at('2026-11-24T10:00:00.000Z'));
    const col = deriveCollection(ds, [r]);
    expect(col.size).toBe(3);
    expect(col.get('major-16-tower')?.appearances).toBe(2);
    expect(col.get('major-16-tower')?.firstSeenAt).toBe('2026-11-24T10:00:00.000Z');
    expect(deriveCollection([], []).size).toBe(0);
  });

  it('orders history newest first', () => {
    const ds = [daily('2026-11-25', 'major-16-tower', '2026-11-25T08:00:00.000Z'), daily('2026-11-26', 'major-19-sun', '2026-11-26T08:00:00.000Z')];
    const r = finalizeReading(CONTENT, revealAll(createDraft(CONTENT, 'self', at('2026-11-25T12:00:00.000Z'), seededRng(1))), 'de', at('2026-11-25T12:00:00.000Z'));
    const h = buildHistory(ds, [r]);
    expect(h.map((x) => x.kind)).toEqual(['daily', 'reading', 'daily']);
  });
});

describe('entitlements (P0 is free)', () => {
  it('grants every core right and nothing else', () => {
    for (const e of CORE_ENTITLEMENTS) expect(freeCoreEntitlements.has(e)).toBe(true);
    expect(freeCoreEntitlements.has('premium.anything' as never)).toBe(false);
    expect(freeCoreEntitlements.list()).toEqual(CORE_ENTITLEMENTS);
  });
});

describe('journeyDays', () => {
  it('counts distinct days of use and never shrinks after a pause', () => {
    const d1 = daily('2026-11-01', 'fool');
    const d2 = daily('2026-11-02', 'magician');
    const d9 = daily('2026-11-09', 'star');
    expect(journeyDays([], [])).toBe(0);
    expect(journeyDays([d1, d2], [])).toBe(2);
    // A week without use: the count stays, the next day adds one.
    expect(journeyDays([d1, d2, d9], [])).toBe(3);
  });

  it('adds days with only a saved reading, without double counting', () => {
    const d1 = daily('2026-11-01', 'fool');
    const draft = revealAll(createDraft(CONTENT, 'self', localClock(2026, 11, 1), seededRng(3)));
    const sameDay = finalizeReading(CONTENT, draft, 'de', localClock(2026, 11, 1, 20));
    const otherDay = finalizeReading(CONTENT, draft, 'de', localClock(2026, 11, 4, 20));
    expect(journeyDays([d1], [sameDay])).toBe(1);
    expect(journeyDays([d1], [sameDay, otherDay])).toBe(2);
  });
});
