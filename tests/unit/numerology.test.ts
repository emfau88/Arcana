import { describe, expect, it } from 'vitest';
import { DECK } from '../../src/content/index.ts';
import {
  LIFE_NUMBERS,
  NUMBER_CARD,
  RESONANCE_NUMBERS,
  archetypeBond,
  birthdayNumber,
  dayResonance,
  isPlausibleBirthDate,
  lifePath,
  numerology,
  personalDay,
  personalMonth,
  personalYear,
  reduce,
  reduceMaster,
  reductionChain,
} from '../../src/domain/numerology.ts';
import { ARCHETYPE_ORDER } from '../../src/domain/types.ts';

/** Local calendar day of an instant in a time zone (what `localDateKey` gives on a device there). */
const dayIn = (instant: string, timeZone: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(instant));

describe('reduction (CONTENT_MASTERPLAN §5)', () => {
  it('reduces to 1–9 and keeps 11, 22, 33 only with master numbers', () => {
    expect(reductionChain(1990, false)).toEqual([1990, 19, 10, 1]);
    expect(reductionChain(29, true)).toEqual([29, 11]);
    expect(reductionChain(29, false)).toEqual([29, 11, 2]);
    expect(reductionChain(7, true)).toEqual([7]);
    expect(reduce(33)).toBe(6);
    expect(reduceMaster(33)).toBe(33);
    expect(reduceMaster(47)).toBe(11);
    expect(reduceMaster(38)).toBe(11);
    expect(reduceMaster(1993)).toBe(22);
  });
});

describe('life path number: test vectors (G2, at least 20 with this table and the ones below)', () => {
  // [birth date, life path, birthday number]
  const VECTORS: [string, number, number][] = [
    ['1990-07-15', 5, 6], // §5 example
    ['1987-11-29', 11, 11], // §5: 11 + 11 + 7 = 29 → 11
    ['1996-04-22', 33, 22], // §5: 4 + 22 + 7 = 33
    ['2000-02-29', 6, 11], // leap day: 2 + 11 + 2 = 15 → 6
    ['2000-01-01', 4, 1],
    ['1999-12-31', 8, 4], // 3 + 4 + 1
    ['1911-11-11', 7, 11], // 11 + 11 + 3 = 25 → 7
    ['1993-12-22', 11, 22], // 3 + 22 + 22 = 47 → 11
    ['1999-09-09', 1, 9], // 9 + 9 + 1 = 19 → 10 → 1
    ['1976-07-04', 7, 4],
    ['1985-03-13', 3, 4],
    ['1964-02-28', 5, 1],
    ['2010-08-19', 3, 1],
    ['1980-09-18', 9, 9], // 9 + 9 + 9 = 27 → 9
    ['1987-07-06', 2, 6], // 7 + 6 + 7 = 20 → 2
    ['1978-11-04', 22, 4], // 11 + 4 + 7 = 22
    ['2008-08-08', 8, 8], // 8 + 8 + 1 = 17 → 8
    ['1900-01-01', 3, 1], // earliest accepted year
  ];
  it.each(VECTORS)('%s → life path %i, birthday %i', (birth, life, birthday) => {
    expect(lifePath(birth).value).toBe(life);
    expect(birthdayNumber(birth).value).toBe(birthday);
  });

  it('shows the path as data: components keep master numbers, the sum is reduced with masters', () => {
    expect(lifePath('1990-07-15')).toEqual({
      value: 5,
      parts: [
        { kind: 'month', raw: 7, chain: [7], value: 7 },
        { kind: 'day', raw: 15, chain: [15, 6], value: 6 },
        { kind: 'year', raw: 1990, chain: [1990, 19, 10, 1], value: 1 },
      ],
      sum: 14,
      chain: [14, 5],
    });
    const m = lifePath('1987-11-29');
    expect(m.parts.map((p) => p.value)).toEqual([11, 11, 7]);
    expect(m.chain).toEqual([29, 11]);
    expect(lifePath('1996-04-22').chain).toEqual([33]);
  });

  it('rejects invalid dates instead of guessing', () => {
    expect(() => lifePath('2001-02-29')).toThrow();
    expect(() => lifePath('1990-13-01')).toThrow();
  });
});

describe('personal year, month and day (G4)', () => {
  it('matches the §5 example (born 15.07.1990, on 26.11.2026)', () => {
    const n = numerology('1990-07-15', '2026-11-26');
    expect(n.personalYear.value).toBe(5);
    expect(n.personalYear.parts.map((p) => p.value)).toEqual([7, 6, 1]);
    expect(n.personalMonth.value).toBe(7);
    expect(n.personalDay.value).toBe(6);
  });

  it('changes the personal year on 1 January (calendar-year convention)', () => {
    const dec = numerology('1990-07-15', '2026-12-31');
    const jan = numerology('1990-07-15', '2027-01-01');
    expect([dec.personalYear.value, dec.personalMonth.value, dec.personalDay.value]).toEqual([5, 8, 3]);
    expect([jan.personalYear.value, jan.personalMonth.value, jan.personalDay.value]).toEqual([6, 7, 8]);
    // ... and not on the birthday
    expect(numerology('1990-07-15', '2026-07-14').personalYear.value).toBe(numerology('1990-07-15', '2026-07-16').personalYear.value);
  });

  it('never gives a master number in a cycle', () => {
    expect(personalYear('1987-11-29', 2026).value).toBe(5); // 2 + 2 + 1
    expect(personalYear('2000-02-29', 2026).value).toBe(5); // leap day: 2 + 2 + 1
    for (let y = 1990; y < 2100; y++) expect(personalYear('1996-04-22', y).value).toBeLessThanOrEqual(9);
    expect(personalMonth(9, 11).value).toBe(2);
    expect(personalDay(9, 29).value).toBe(2);
  });

  it('follows the local calendar day in three time zones (UTC−10, UTC, UTC+14) around the turn of the year', () => {
    const instant = '2026-12-31T23:30:00Z';
    const days = ['Pacific/Honolulu', 'UTC', 'Pacific/Kiritimati'].map((tz) => dayIn(instant, tz));
    expect(days).toEqual(['2026-12-31', '2026-12-31', '2027-01-01']);
    const years = days.map((d) => numerology('1990-07-15', d).personalYear.value);
    expect(years).toEqual([5, 5, 6]);
  });
});

describe('cards and bonds (G7, G9, G10, G11, G12)', () => {
  it('gives a valid life card for all 12 life path numbers', () => {
    const ids = new Set(DECK.map((c) => c.id));
    expect(LIFE_NUMBERS).toHaveLength(12);
    for (const n of LIFE_NUMBERS) expect(ids.has(NUMBER_CARD[n]), String(n)).toBe(true);
    const order = (id: string) => DECK.find((c) => c.id === id)!.order;
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11] as const) expect(order(NUMBER_CARD[n])).toBe(n);
    expect(NUMBER_CARD[22]).toBe('major-00-fool');
    expect(NUMBER_CARD[33]).toBe('major-03-empress');
  });

  it('names the life card and the year card', () => {
    const n = numerology('1987-11-29', '2026-11-26');
    expect(n.lifeCard).toBe('major-11-justice');
    expect(n.yearCard).toBe(NUMBER_CARD[5]);
  });

  it('calls the bond "amplifying" only for the resonance numbers of the archetype', () => {
    for (const a of ARCHETYPE_ORDER)
      for (const n of LIFE_NUMBERS) expect(archetypeBond(a, n)).toBe((RESONANCE_NUMBERS[a] as readonly number[]).includes(n) ? 'amplifying' : 'complementary');
    expect(archetypeBond('visionary', 11)).toBe('amplifying');
    expect(archetypeBond('visionary', 2)).toBe('amplifying');
    expect(archetypeBond('renewer', 33)).toBe('complementary');
  });

  it('finds the daily resonance by the card number or its digit sum, never for the Fool', () => {
    expect(dayResonance(6, 6)).toBe(true);
    expect(dayResonance(6, 15)).toBe(true);
    expect(dayResonance(2, 11)).toBe(true);
    expect(dayResonance(2, 20)).toBe(true);
    expect(dayResonance(1, 19)).toBe(true);
    expect(dayResonance(3, 21)).toBe(true);
    expect(dayResonance(3, 4)).toBe(false);
    expect(dayResonance(1, 0)).toBe(false);
  });
});

describe('birth date entry', () => {
  it('accepts real days from 1900 up to today, nothing in the future', () => {
    expect(isPlausibleBirthDate('1990-07-15', '2026-11-28')).toBe(true);
    expect(isPlausibleBirthDate('2026-11-28', '2026-11-28')).toBe(true);
    expect(isPlausibleBirthDate('2026-11-29', '2026-11-28')).toBe(false);
    expect(isPlausibleBirthDate('1899-12-31', '2026-11-28')).toBe(false);
    expect(isPlausibleBirthDate('2001-02-29', '2026-11-28')).toBe(false);
    expect(isPlausibleBirthDate('15.07.1990', '2026-11-28')).toBe(false);
  });
});
