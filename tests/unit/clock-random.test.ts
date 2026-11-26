import { describe, expect, it } from 'vitest';
import { dateFromKey, isValidDateKey, localDateKey, msUntilNextLocalDay } from '../../src/domain/clock.ts';
import { drawWithoutReplacement, newId, seededRng } from '../../src/domain/random.ts';

describe('local date keys', () => {
  it('uses local components, not UTC', () => {
    // 23:30 local time must stay on the local day, whatever the UTC date is.
    expect(localDateKey(new Date(2026, 10, 26, 23, 30))).toBe('2026-11-26');
    expect(localDateKey(new Date(2026, 10, 27, 0, 5))).toBe('2026-11-27');
    expect(localDateKey(new Date(2027, 0, 1, 0, 0))).toBe('2027-01-01');
  });

  it('validates real calendar days only', () => {
    expect(isValidDateKey('2026-11-26')).toBe(true);
    expect(isValidDateKey('2028-02-29')).toBe(true);
    expect(isValidDateKey('2026-02-29')).toBe(false);
    expect(isValidDateKey('2026-13-01')).toBe(false);
    expect(isValidDateKey('26-11-2026')).toBe(false);
    expect(isValidDateKey('')).toBe(false);
  });

  it('round-trips through local noon', () => {
    const d = dateFromKey('2026-03-29'); // DST switch day in Europe
    expect(d.getHours()).toBe(12);
    expect(localDateKey(d)).toBe('2026-03-29');
    expect(() => dateFromKey('nope')).toThrow();
  });

  it('computes the time to the next local midnight', () => {
    expect(msUntilNextLocalDay(new Date(2026, 10, 26, 23, 59, 0))).toBe(60_000);
    expect(msUntilNextLocalDay(new Date(2026, 10, 26, 23, 59, 59, 999))).toBe(1000); // lower bound
  });
});

describe('random draws', () => {
  it('draws distinct items without mutating the input', () => {
    const items = ['a', 'b', 'c', 'd', 'e'] as const;
    const copy = [...items];
    const rng = seededRng(42);
    for (let i = 0; i < 200; i++) {
      const out = drawWithoutReplacement(items, 3, rng);
      expect(out).toHaveLength(3);
      expect(new Set(out).size).toBe(3);
      for (const x of out) expect(items).toContain(x);
    }
    expect([...items]).toEqual(copy);
  });

  it('is deterministic for a seed and covers every item', () => {
    const a = drawWithoutReplacement([1, 2, 3, 4], 4, seededRng(7));
    const b = drawWithoutReplacement([1, 2, 3, 4], 4, seededRng(7));
    expect(a).toEqual(b);
    const seen = new Set<number>();
    const rng = seededRng(1);
    for (let i = 0; i < 100; i++) seen.add(drawWithoutReplacement([1, 2, 3, 4], 1, rng)[0] as number);
    expect(seen).toEqual(new Set([1, 2, 3, 4]));
  });

  it('is roughly uniform', () => {
    const counts = [0, 0, 0];
    const rng = seededRng(2026);
    const n = 30_000;
    for (let i = 0; i < n; i++) counts[drawWithoutReplacement([0, 1, 2], 1, rng)[0] as number]! += 1;
    for (const c of counts) expect(Math.abs(c / n - 1 / 3)).toBeLessThan(0.02);
  });

  it('rejects impossible draws and broken sources', () => {
    expect(() => drawWithoutReplacement([1, 2], 3, seededRng(1))).toThrow();
    expect(() => drawWithoutReplacement([1, 2], -1, seededRng(1))).toThrow();
    expect(() => drawWithoutReplacement([1, 2], 1, () => 1)).toThrow();
    expect(() => drawWithoutReplacement([1, 2], 1, () => Number.NaN)).toThrow();
  });

  it('creates 32-hex-char ids without collisions', () => {
    const rng = seededRng(3);
    const ids = new Set(Array.from({ length: 5000 }, () => newId(rng)));
    expect(ids.size).toBe(5000);
    for (const id of ids) expect(id).toMatch(/^[0-9a-f]{32}$/);
  });
});
