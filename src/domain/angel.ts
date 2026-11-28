/**
 * Angel numbers (V06.3, PRODUCT_SYSTEMS H1–H4, CONTENT_MASTERPLAN §6): read what a person saw
 * (1–6 digits or a clock time), find one of the 22 curated sequences, or compose a reading from the
 * digits and their pattern. Pure; texts live in the content module `angels`.
 *
 * Symbolic interpretation only: a traditional meaning, never a message with certainty.
 */
import { localDateKey } from './clock.ts';
import type { JournalEntry } from './types.ts';

/** The 22 curated sequences with a full text (CONTENT_MASTERPLAN §6). */
export const CURATED_SEQUENCES = [
  '000',
  '111',
  '222',
  '333',
  '444',
  '555',
  '666',
  '777',
  '888',
  '999',
  '0101',
  '1001',
  '1010',
  '1111',
  '1122',
  '1212',
  '1221',
  '1234',
  '1313',
  '1414',
  '2121',
  '2222',
] as const;
export type CuratedSequence = (typeof CURATED_SEQUENCES)[number];

/** Written forms that mean a curated sequence beyond "drop the colon" (`11:11` → 1111 needs no entry). */
export const SEQUENCE_ALIASES: Readonly<Record<string, CuratedSequence>> = { '0000': '000' };

export const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
export type Digit = (typeof DIGITS)[number];

/**
 * How the digits are arranged. Checked in this order, the first match wins:
 * single (one digit) · repeat (1111) · stair (1234, 4321) · mirror (1221, 12321) ·
 * alternating (1212, 123123) · doubles (1122, 112233) · frame (1231) · mixed.
 */
export const ANGEL_PATTERNS = ['single', 'repeat', 'stair', 'mirror', 'alternating', 'doubles', 'frame', 'mixed'] as const;
export type AngelPattern = (typeof ANGEL_PATTERNS)[number];

export const MAX_DIGITS = 6;

export interface AngelInput {
  /** The digits that carry the meaning ('11:11' → '1111'). */
  digits: string;
  /** Entered as a clock time. */
  time: boolean;
}

const TIME = /^([01]?\d|2[0-3]):([0-5]\d)$/;

/** Reads 1–6 digits or a clock time `h:mm` / `hh:mm`; spaces around are ignored. Anything else is null. */
export function parseAngelInput(raw: string): AngelInput | null {
  const s = raw.trim();
  if (/^\d+$/.test(s)) return s.length <= MAX_DIGITS ? { digits: s, time: false } : null;
  const t = TIME.exec(s);
  return t ? { digits: `${t[1]}${t[2]}`, time: true } : null;
}

export function sequencePattern(seq: string): AngelPattern {
  const n = seq.length;
  if (n === 1) return 'single';
  if (new Set(seq).size === 1) return 'repeat';
  if (n >= 3) {
    const steps = [...seq].slice(1).map((d, i) => Number(d) - Number(seq[i]));
    if (steps.every((s) => s === 1) || steps.every((s) => s === -1)) return 'stair';
    if (seq === [...seq].reverse().join('')) return 'mirror';
  }
  if (n >= 4) {
    for (const p of [2, 3]) if (n % p === 0 && n > p && seq === seq.slice(0, p).repeat(n / p)) return 'alternating';
    if (n % 2 === 0 && [...Array(n / 2).keys()].every((i) => seq[2 * i] === seq[2 * i + 1])) return 'doubles';
    if (seq[0] === seq[n - 1]) return 'frame';
  }
  return 'mixed';
}

export interface DigitWeight {
  digit: Digit;
  count: number;
}

/** Distinct digits, the most frequent first, then in the order they appear. */
export function digitWeights(seq: string): DigitWeight[] {
  const counts = new Map<Digit, number>();
  for (const d of seq) counts.set(d as Digit, (counts.get(d as Digit) ?? 0) + 1);
  const firstAt = (d: Digit) => seq.indexOf(d);
  return [...counts]
    .map(([digit, count]) => ({ digit, count }))
    .sort((a, b) => b.count - a.count || firstAt(a.digit) - firstAt(b.digit));
}

export interface AngelLookup {
  /** As shown: the time with its colon ('11:11'), otherwise the digits. */
  display: string;
  /** Digits the meaning belongs to, after aliases ('0000' → '000'). Also the route and favourite id. */
  sequence: string;
  time: boolean;
  /** A curated sequence with its own full text, or null: then the reading is composed (H2). */
  curated: CuratedSequence | null;
  pattern: AngelPattern;
  digits: DigitWeight[];
}

const isCurated = (s: string): s is CuratedSequence => (CURATED_SEQUENCES as readonly string[]).includes(s);

/** Every valid input gives a reading (H, Abnahme): curated or composed. Invalid input gives null. */
export function lookupAngel(raw: string): AngelLookup | null {
  const input = parseAngelInput(raw);
  if (!input) return null;
  const sequence = SEQUENCE_ALIASES[input.digits] ?? input.digits;
  const t = input.time ? TIME.exec(raw.trim()) : null;
  return {
    display: t ? `${t[1]}:${t[2]}` : input.digits,
    sequence,
    time: input.time,
    curated: isCurated(sequence) ? sequence : null,
    pattern: sequencePattern(sequence),
    digits: digitWeights(sequence),
  };
}

/** Text keys of the module `angels` for a reading: the curated page, or pattern plus digit lines. */
export function angelTextKeys(l: AngelLookup): { kind: 'curated'; prefix: string } | { kind: 'composed'; pattern: string; digits: string[] } {
  if (l.curated) return { kind: 'curated', prefix: `seq.${l.curated}` };
  return { kind: 'composed', pattern: `pattern.${l.pattern}`, digits: l.digits.map((d) => `digit.${d.digit}`) };
}

/* ------------------------------------------------------------------ Encounters (H3, H4) */

/** Short place word of an encounter ("Bahnhof", "on the way home"). */
export const PLACE_MAX = 40;
export const ENCOUNTER_NOTE_MAX = 2000;

/**
 * An encounter as a journal entry (kind 'number-encounter', IA §5.3). The note may be empty: the
 * encounter itself is the fact, and like every journal entry it counts as a day of the journey (B1).
 */
export function newEncounterEntry(raw: string, note: string, place: string, now: Date, id: string): JournalEntry {
  const l = lookupAngel(raw);
  if (!l) throw new Error(`Not an angel number: ${raw}`);
  const at = now.toISOString();
  const p = place.trim().slice(0, PLACE_MAX);
  return {
    id,
    kind: 'number-encounter',
    dateKey: localDateKey(now),
    text: note.trim().slice(0, ENCOUNTER_NOTE_MAX),
    refs: { sequence: l.sequence, ...(p ? { place: p } : {}) },
    createdAt: at,
    updatedAt: at,
  };
}

/** How often each own sequence was noted (H4), most frequent first, then the most recent. Deleted entries are left out like in the journal. */
export function encounterCounts(journal: readonly JournalEntry[]): { sequence: string; count: number; lastDateKey: string }[] {
  const by = new Map<string, { count: number; lastDateKey: string }>();
  for (const j of journal) {
    const seq = j.refs.sequence;
    if (j.kind !== 'number-encounter' || j.deletedAt !== undefined || !seq) continue;
    const e = by.get(seq) ?? { count: 0, lastDateKey: '' };
    by.set(seq, { count: e.count + 1, lastDateKey: j.dateKey > e.lastDateKey ? j.dateKey : e.lastDateKey });
  }
  return [...by]
    .map(([sequence, e]) => ({ sequence, ...e }))
    .sort((a, b) => b.count - a.count || (a.lastDateKey < b.lastDateKey ? 1 : a.lastDateKey > b.lastDateKey ? -1 : 0) || (a.sequence < b.sequence ? -1 : 1));
}
