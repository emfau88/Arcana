/**
 * Numerology (V06.2, PRODUCT_SYSTEMS G, CONTENT_MASTERPLAN §5): one documented method, pure
 * functions on local date keys ('YYYY-MM-DD'), so time zones and the turn of the year follow the
 * local calendar day exactly like the daily card. Every result carries its calculation path as data;
 * the UI renders that path and never recomputes it (the path shown is the function, S-65).
 *
 * Symbolic interpretation only: the numbers are a mirror for reflection, never a forecast.
 */
import { isValidDateKey } from './clock.ts';
import type { ArchetypeId, CardId } from './types.ts';

export const MASTER_NUMBERS = [11, 22, 33] as const;
/** The twelve life path numbers: 1–9 and the master numbers. */
export const LIFE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33] as const;
export type LifeNumber = (typeof LIFE_NUMBERS)[number];
/** Personal year, month and day are always reduced to 1–9 (no master numbers in cycles, §5). */
export const CYCLE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export type CycleNumber = (typeof CYCLE_NUMBERS)[number];

export const digitSum = (n: number): number =>
  String(Math.abs(Math.trunc(n)))
    .split('')
    .reduce((s, d) => s + Number(d), 0);

/**
 * The chain of repeated digit sums, starting with `n`: [1990, 19, 10, 1]. It stops at 1–9, or, with
 * `keepMasters`, at 11, 22 or 33 (`rm` in §5). A single digit is its own chain ([7]).
 */
export function reductionChain(n: number, keepMasters: boolean): number[] {
  const chain = [n];
  let v = n;
  while (v > 9 && !(keepMasters && (MASTER_NUMBERS as readonly number[]).includes(v))) {
    v = digitSum(v);
    chain.push(v);
  }
  return chain;
}

const last = (a: readonly number[]): number => a[a.length - 1]!;
/** `r(n)`: reduce to 1–9. */
export const reduce = (n: number): number => last(reductionChain(n, false));
/** `rm(n)`: reduce, but stop at 11, 22 and 33. */
export const reduceMaster = (n: number): number => last(reductionChain(n, true));

/** One reduced component of a calculation (month, day or year), with its own chain. */
export interface NumberPart {
  kind: 'month' | 'day' | 'year' | 'personal-year' | 'personal-month';
  raw: number;
  chain: number[];
  value: number;
}

/** A calculated number with the full path: components, their sum, and the reduction of that sum. */
export interface NumberPath<V extends number = number> {
  value: V;
  parts: NumberPart[];
  sum: number;
  /** Reduction chain of `sum` (starts with `sum`). */
  chain: number[];
}

const part = (kind: NumberPart['kind'], raw: number, keepMasters: boolean): NumberPart => {
  const chain = reductionChain(raw, keepMasters);
  return { kind, raw, chain, value: last(chain) };
};

function parseKey(key: string): { y: number; m: number; d: number } {
  if (!isValidDateKey(key)) throw new Error(`Invalid date key: ${key}`);
  const [y, m, d] = key.split('-').map(Number) as [number, number, number];
  return { y, m, d };
}

/** Life path number (G2): component method, `rm(rm(month) + rm(day) + rm(year))`; components keep 11 and 22. */
export function lifePath(birthDate: string): NumberPath<LifeNumber> {
  const { y, m, d } = parseKey(birthDate);
  const parts = [part('month', m, true), part('day', d, true), part('year', y, true)];
  const sum = parts.reduce((s, p) => s + p.value, 0);
  const chain = reductionChain(sum, true);
  return { value: last(chain) as LifeNumber, parts, sum, chain };
}

/** Birthday number (G3): `rm(day)`, so 11, 22 and 29 → 11 stay master numbers. */
export function birthdayNumber(birthDate: string): NumberPath {
  const { d } = parseKey(birthDate);
  const p = part('day', d, true);
  return { value: p.value, parts: [p], sum: d, chain: p.chain };
}

/** Personal year (G4): calendar-year convention (changes on 1 January), `r(r(month) + r(day) + r(year))`. */
export function personalYear(birthDate: string, year: number): NumberPath<CycleNumber> {
  const { m, d } = parseKey(birthDate);
  const parts = [part('month', m, false), part('day', d, false), part('year', year, false)];
  const sum = parts.reduce((s, p) => s + p.value, 0);
  const chain = reductionChain(sum, false);
  return { value: last(chain) as CycleNumber, parts, sum, chain };
}

/** Personal month: `r(personal year + r(calendar month))`. */
export function personalMonth(py: CycleNumber, month: number): NumberPath<CycleNumber> {
  const parts = [{ kind: 'personal-year' as const, raw: py, chain: [py], value: py }, part('month', month, false)];
  const sum = py + parts[1]!.value;
  const chain = reductionChain(sum, false);
  return { value: last(chain) as CycleNumber, parts, sum, chain };
}

/** Personal day: `r(personal month + r(local calendar day))`. */
export function personalDay(pm: CycleNumber, day: number): NumberPath<CycleNumber> {
  const parts = [{ kind: 'personal-month' as const, raw: pm, chain: [pm], value: pm }, part('day', day, false)];
  const sum = pm + parts[1]!.value;
  const chain = reductionChain(sum, false);
  return { value: last(chain) as CycleNumber, parts, sum, chain };
}

/**
 * Number → Major Arcana (G7, §5): 1 Magician … 9 Hermit, 11 Justice (XI in this deck), 22 the Fool
 * (as XXII), 33 the Empress (3 + 3, app convention).
 */
export const NUMBER_CARD: Readonly<Record<LifeNumber, CardId>> = {
  1: 'major-01-magician',
  2: 'major-02-high-priestess',
  3: 'major-03-empress',
  4: 'major-04-emperor',
  5: 'major-05-hierophant',
  6: 'major-06-lovers',
  7: 'major-07-chariot',
  8: 'major-08-strength',
  9: 'major-09-hermit',
  11: 'major-11-justice',
  22: 'major-00-fool',
  33: 'major-03-empress',
};

/** Resonance numbers of the archetypes (CONTENT_MASTERPLAN §4, app convention). */
export const RESONANCE_NUMBERS: Readonly<Record<ArchetypeId, readonly [LifeNumber, LifeNumber]>> = {
  seeker: [5, 7],
  guardian: [2, 6],
  visionary: [2, 11],
  alchemist: [1, 8],
  wanderer: [3, 5],
  creator: [3, 1],
  sage: [4, 9],
  renewer: [9, 22],
};

/** Archetype and number (G10): "amplifying" when the life path number is one of the archetype's resonance numbers. */
export function archetypeBond(archetype: ArchetypeId, life: LifeNumber): 'amplifying' | 'complementary' {
  return (RESONANCE_NUMBERS[archetype] as readonly number[]).includes(life) ? 'amplifying' : 'complementary';
}

/**
 * Daily resonance (G11): the personal day matches the number of the daily card, or the digit sum of
 * a two-digit card number (XV → 6). The Fool (0) never matches.
 */
export function dayResonance(personalDayValue: CycleNumber, cardOrder: number): boolean {
  if (cardOrder <= 0) return false;
  return cardOrder === personalDayValue || (cardOrder > 9 && reduce(cardOrder) === personalDayValue);
}

/** All core numbers for one birth date on one local day. */
export interface CoreNumbers {
  lifePath: NumberPath<LifeNumber>;
  birthday: NumberPath;
  personalYear: NumberPath<CycleNumber>;
  personalMonth: NumberPath<CycleNumber>;
  personalDay: NumberPath<CycleNumber>;
  /** G9: the card of the life path number. */
  lifeCard: CardId;
  /** G12: the card of the personal year. */
  yearCard: CardId;
}

/** `numerology(birthDate, today)` (INFORMATION_ARCHITECTURE §5.4). `today` is the local date key. */
export function numerology(birthDate: string, today: string): CoreNumbers {
  const t = parseKey(today);
  const lp = lifePath(birthDate);
  const py = personalYear(birthDate, t.y);
  const pm = personalMonth(py.value, t.m);
  const pd = personalDay(pm.value, t.d);
  return {
    lifePath: lp,
    birthday: birthdayNumber(birthDate),
    personalYear: py,
    personalMonth: pm,
    personalDay: pd,
    lifeCard: NUMBER_CARD[lp.value],
    yearCard: NUMBER_CARD[py.value],
  };
}

/** Earliest birth year the entry accepts. */
export const MIN_BIRTH_YEAR = 1900;

/** A birth date the app accepts: a real calendar day, from 1900 up to today (never in the future). */
export function isPlausibleBirthDate(key: string, today: string): boolean {
  if (!isValidDateKey(key) || !isValidDateKey(today)) return false;
  return Number(key.slice(0, 4)) >= MIN_BIRTH_YEAR && key <= today;
}
