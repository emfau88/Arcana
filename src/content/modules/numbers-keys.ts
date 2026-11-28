/**
 * Keys of the content module `numbers` (V06.2, CONTENT_MASTERPLAN §3): numerology for the twelve
 * life path numbers, the personal year, month and day, and the explanations of the calculation.
 * Structure only; the numbers themselves come from `src/domain/numerology.ts`.
 *
 * Keys: `number.<n>.keywords|essence|life|birthday|strength.<1-3>|challenge.<1-3>|reflection.<1-2>`,
 * `year.<1-9>`, `month.<1-9>`, `day.<1-9>.<1-3>`, `path.<life|birthday|year|month|day|method>`.
 * The birthday text exists for 1–9, 11 and 22 (no month has a 33rd day). The challenges are the
 * edition part (PRODUCT_SYSTEMS G5): written and checked, shown only with `edition.numbers`.
 */
import { CYCLE_NUMBERS, LIFE_NUMBERS, type CycleNumber } from '../../domain/numerology.ts';

export const PATH_KEYS = ['life', 'birthday', 'year', 'month', 'day', 'method'] as const;
/** Day texts per personal day number. */
export const DAY_VARIANTS = 3;

/**
 * Key of the day text. A personal day number comes back every nine calendar days (the 1st, 10th and
 * 19th share it), so the variant follows the nine-day block of the month: the same number reads
 * differently on its second and third day in a month (S-65).
 */
export const dayTextKey = (personalDay: CycleNumber, calendarDay: number): string =>
  `day.${personalDay}.${(Math.floor((calendarDay - 1) / 9) % DAY_VARIANTS) + 1}`;

export function numbersKeys(): string[] {
  const keys: string[] = [];
  for (const n of LIFE_NUMBERS) {
    keys.push(`number.${n}.keywords`, `number.${n}.essence`, `number.${n}.life`);
    if (n !== 33) keys.push(`number.${n}.birthday`);
    for (const i of [1, 2, 3]) keys.push(`number.${n}.strength.${i}`, `number.${n}.challenge.${i}`);
    for (const i of [1, 2]) keys.push(`number.${n}.reflection.${i}`);
  }
  for (const n of CYCLE_NUMBERS) {
    keys.push(`year.${n}`, `month.${n}`);
    for (let v = 1; v <= DAY_VARIANTS; v++) keys.push(`day.${n}.${v}`);
  }
  for (const p of PATH_KEYS) keys.push(`path.${p}`);
  return keys;
}
