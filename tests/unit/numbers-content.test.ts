import { describe, expect, it } from 'vitest';
import { dayTextKey, numbersKeys } from '../../src/content/modules/numbers-keys.ts';
import { texts as de } from '../../src/content/modules/numbers.de.ts';
import { texts as en } from '../../src/content/modules/numbers.en.ts';
import { CYCLE_NUMBERS, LIFE_NUMBERS, numerology } from '../../src/domain/numerology.ts';

describe('numbers module: interpretation is marked (CONTENT_MASTERPLAN §2 "Deutung markieren")', () => {
  it('opens every essence with the tradition and marks year and month as traditional', () => {
    for (const n of LIFE_NUMBERS) {
      expect(de[`number.${n}.essence`], String(n)).toMatch(/^Traditionell steht die /);
      expect(en[`number.${n}.essence`], String(n)).toMatch(/^Traditionally, /);
    }
    for (const n of CYCLE_NUMBERS)
      for (const k of [`year.${n}`, `month.${n}`]) {
        expect(de[k], k).toMatch(/[Tt]radition/);
        expect(en[k], k).toMatch(/[Tt]radition/);
      }
    expect(de['path.method']).toContain('symbolische Deutung, keine Vorhersage');
    expect(en['path.method']).toContain('symbolic interpretation, not a prediction');
  });

  it('has no birthday text for 33 (no month has a 33rd day)', () => {
    expect(numbersKeys()).not.toContain('number.33.birthday');
    expect(numbersKeys()).toHaveLength(194);
  });
});

describe('day text', () => {
  it('uses a different version each time the personal day comes back in a month', () => {
    // 1st, 10th and 19th of a month share the personal day number.
    const days = [1, 10, 19].map((d) => numerology('1990-07-15', `2026-11-${String(d).padStart(2, '0')}`).personalDay.value);
    expect(new Set(days).size).toBe(1);
    expect([1, 10, 19, 28].map((d) => dayTextKey(days[0]!, d))).toEqual([`day.${days[0]}.1`, `day.${days[0]}.2`, `day.${days[0]}.3`, `day.${days[0]}.1`]);
    for (let d = 1; d <= 31; d++) for (const n of CYCLE_NUMBERS) expect(de[dayTextKey(n, d)], `${n}/${d}`).toBeTruthy();
  });
});
