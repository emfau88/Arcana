import { describe, expect, it } from 'vitest';
import { CONTENT, getArchetype } from '../../src/content/index.ts';
import { LENS_CARD_IDS } from '../../src/content/modules/lens-keys.ts';
import { texts as identityDe } from '../../src/content/modules/identity.de.ts';
import { texts as identityEn } from '../../src/content/modules/identity.en.ts';
import type { Clock } from '../../src/domain/clock.ts';
import { COMPLEMENT_LENS_EVERY, LENS_VARIANT, lensArchetypeOf, lensKey, lensSourceForDay } from '../../src/domain/lens.ts';
import { createDailyRecord } from '../../src/domain/oracle.ts';
import { seededRng } from '../../src/domain/random.ts';
import { ARCHETYPE_ORDER, type ArchetypeId, type CardId, type DailyRecord } from '../../src/domain/types.ts';

const clock: Clock = { now: () => new Date(2026, 10, 27, 9, 0, 0) };

function record(journeyDay: number, archetypeId: ArchetypeId | null, complementId: ArchetypeId | null, table: Record<string, string> = identityDe): DailyRecord {
  return createDailyRecord({
    pack: CONTENT,
    clock,
    rng: seededRng(journeyDay),
    themeId: 'self',
    archetypeId,
    locale: 'de',
    previousCardId: null,
    lens: { journeyDay, complementId, text: (a, c) => table[lensKey(a, c)] },
  });
}

describe('lens texts (V04.3)', () => {
  it('cover the 22 cards of the deck in deck order', () => {
    expect([...LENS_CARD_IDS]).toEqual(CONTENT.cards.map((c) => c.id));
  });

  it('exist for every archetype × card in DE and EN, all different', () => {
    for (const table of [identityDe, identityEn]) {
      const seen = new Set<string>();
      for (const a of ARCHETYPE_ORDER)
        for (const c of LENS_CARD_IDS) {
          const v = table[lensKey(a, c)];
          expect(v, `${a} ${c}`).toBeTruthy();
          expect(seen.has(v as string), `duplicate ${a} ${c}`).toBe(false);
          seen.add(v as string);
        }
      expect(seen.size).toBe(ARCHETYPE_ORDER.length * LENS_CARD_IDS.length);
    }
  });
});

describe('lens source per journey day', () => {
  it('uses the complement every third day and the main archetype otherwise', () => {
    const days = Array.from({ length: 9 }, (_, i) => i + 1);
    expect(days.map((d) => lensSourceForDay(d, 'sage'))).toEqual(['main', 'main', 'complement', 'main', 'main', 'complement', 'main', 'main', 'complement']);
    expect(COMPLEMENT_LENS_EVERY).toBe(3);
  });

  it('always uses the main archetype without a complement or for invalid days', () => {
    for (const d of [1, 3, 6, 9, 99]) expect(lensSourceForDay(d, null)).toBe('main');
    for (const d of [0, -3, 3.5, Number.NaN]) expect(lensSourceForDay(d, 'sage')).toBe('main');
  });
});

describe('daily record with lens', () => {
  it('stores the main lens, variant 0 and the complement on an ordinary day', () => {
    const r = record(1, 'seeker', 'sage');
    expect(r.variant).toEqual({ lens: LENS_VARIANT.main, reflection: 0, ritual: 0 });
    expect(r.secondaryArchetypeId).toBe('sage');
    expect(r.content.lens).toBe(identityDe[lensKey('seeker', r.cardId)]);
    expect(lensArchetypeOf(r)).toBe('seeker');
  });

  it('reads the card through the complement on every third day', () => {
    const r = record(3, 'seeker', 'sage');
    expect(r.variant?.lens).toBe(LENS_VARIANT.complement);
    expect(r.content.lens).toBe(identityDe[lensKey('sage', r.cardId)]);
    expect(lensArchetypeOf(r)).toBe('sage');
  });

  it('falls back to the general archetype lens when the module text is missing', () => {
    const r = record(1, 'guardian', null, {});
    expect(r.content.lens).toBe(getArchetype(CONTENT, 'guardian').lens.de);
    expect(r.secondaryArchetypeId).toBeNull();
  });

  it('has no lens and no complement without an archetype', () => {
    const r = record(3, null, 'sage');
    expect(r.content.lens).toBeNull();
    expect(r.secondaryArchetypeId).toBeNull();
    expect(r.variant?.lens).toBe(LENS_VARIANT.main);
    expect(lensArchetypeOf(r)).toBeNull();
  });

  it('keeps the shape of 0.3 when no lens input is given (legacy callers, fixtures)', () => {
    const r = createDailyRecord({ pack: CONTENT, clock, rng: seededRng(4), themeId: 'self', archetypeId: 'seeker', locale: 'de', previousCardId: null });
    expect(r.variant).toBeUndefined();
    expect(r.secondaryArchetypeId).toBeUndefined();
    expect(r.content.lens).toBe(getArchetype(CONTENT, 'seeker').lens.de);
  });
});

describe('lensArchetypeOf reads only stored fields', () => {
  const base = { archetypeId: 'seeker' as ArchetypeId };
  it('never follows a broken complement', () => {
    expect(lensArchetypeOf({ ...base, variant: { lens: 1, reflection: 0, ritual: 0 }, secondaryArchetypeId: 'nobody' as ArchetypeId })).toBe('seeker');
    expect(lensArchetypeOf({ ...base, variant: { lens: 1, reflection: 0, ritual: 0 }, secondaryArchetypeId: null })).toBe('seeker');
    expect(lensArchetypeOf({ ...base, variant: { lens: 7, reflection: 0, ritual: 0 }, secondaryArchetypeId: 'sage' })).toBe('seeker');
    expect(lensArchetypeOf(base)).toBe('seeker');
  });
});

describe('variety over a long journey', () => {
  it('rarely repeats a lens sentence within 21 days of real draws', () => {
    // 66 days of real draws (no repeat of yesterday's card) with a complement.
    let prev: CardId | null = null;
    const lenses: string[] = [];
    for (let day = 1; day <= 66; day++) {
      const r: DailyRecord = createDailyRecord({
        pack: CONTENT,
        clock,
        rng: seededRng(1000 + day),
        themeId: 'self',
        archetypeId: 'seeker',
        locale: 'de',
        previousCardId: prev,
        lens: { journeyDay: day, complementId: 'sage', text: (a, c) => identityDe[lensKey(a, c)] },
      });
      prev = r.cardId;
      lenses.push(r.content.lens ?? '');
    }
    let repeats = 0;
    lenses.forEach((l, i) => {
      if (lenses.slice(Math.max(0, i - 20), i).includes(l)) repeats++;
    });
    // 44 sentences in play (22 main + 22 complement) against 66 draws: some repeats are chance,
    // but with the complement split they stay well below the 22-card-only baseline.
    expect(new Set(lenses).size).toBeGreaterThan(30);
    expect(repeats).toBeLessThan(30);
  });
});
