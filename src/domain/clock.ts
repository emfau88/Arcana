/** Injectable time source so every date rule is testable. */
export interface Clock {
  now(): Date;
}

export const systemClock: Clock = { now: () => new Date() };

const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * Local calendar day as YYYY-MM-DD, built from LOCAL date components.
 * Never derived from toISOString(), which is UTC and shifts the day around midnight.
 */
export function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const DATE_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidDateKey(key: string): boolean {
  const m = DATE_KEY.exec(key);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const probe = new Date(y, mo - 1, d);
  return probe.getFullYear() === y && probe.getMonth() === mo - 1 && probe.getDate() === d;
}

/** Local noon of a date key; safe against DST gaps when formatting. */
export function dateFromKey(key: string): Date {
  const m = DATE_KEY.exec(key);
  if (!m) throw new Error(`Invalid date key: ${key}`);
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0, 0);
}

/** Milliseconds until the next local midnight (used to refresh "today" while the app stays open). */
export function msUntilNextLocalDay(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return Math.max(1000, next.getTime() - now.getTime());
}
