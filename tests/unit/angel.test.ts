import { describe, expect, it } from 'vitest';
import {
  ANGEL_PATTERNS,
  CURATED_SEQUENCES,
  angelTextKeys,
  digitWeights,
  encounterCounts,
  lookupAngel,
  newEncounterEntry,
  parseAngelInput,
  sequencePattern,
} from '../../src/domain/angel.ts';
import { journeyDays } from '../../src/domain/progress.ts';
import { texts as de } from '../../src/content/modules/angels.de.ts';
import { texts as en } from '../../src/content/modules/angels.en.ts';

describe('angels module: interpretation is marked (CONTENT_MASTERPLAN §2, PRODUCT_SYSTEMS H)', () => {
  it('marks every curated meaning as tradition in both languages', () => {
    for (const s of CURATED_SEQUENCES) {
      expect(de[`seq.${s}.meaning`], s).toMatch(/[Tt]raditionell/);
      expect(en[`seq.${s}.meaning`], s).toMatch(/[Tt]raditionally/);
    }
  });
});

describe('angel number input (H1)', () => {
  it('reads 1–6 digits and clock times, nothing else', () => {
    expect(parseAngelInput('111')).toEqual({ digits: '111', time: false });
    expect(parseAngelInput(' 0101 ')).toEqual({ digits: '0101', time: false });
    expect(parseAngelInput('11:11')).toEqual({ digits: '1111', time: true });
    expect(parseAngelInput('9:15')).toEqual({ digits: '915', time: true });
    expect(parseAngelInput('1234567')).toBeNull();
    expect(parseAngelInput('24:00')).toBeNull();
    expect(parseAngelInput('12:60')).toBeNull();
    expect(parseAngelInput('')).toBeNull();
    expect(parseAngelInput('11 11')).toBeNull();
    expect(parseAngelInput('1a1')).toBeNull();
  });

  it('maps the aliases of CONTENT_MASTERPLAN §6 to curated sequences', () => {
    const cases: [string, string][] = [
      ['0000', '000'],
      ['00:00', '000'],
      ['11:11', '1111'],
      ['22:22', '2222'],
      ['12:12', '1212'],
      ['10:10', '1010'],
      ['21:21', '2121'],
      ['13:13', '1313'],
      ['14:14', '1414'],
      ['01:01', '0101'],
    ];
    for (const [input, seq] of cases) expect(lookupAngel(input)?.curated, input).toBe(seq);
    expect(lookupAngel('11:11')?.display).toBe('11:11');
    expect(lookupAngel('1111')?.display).toBe('1111');
  });

  it('knows exactly 22 curated sequences', () => {
    expect(new Set(CURATED_SEQUENCES).size).toBe(22);
    for (const s of CURATED_SEQUENCES) expect(lookupAngel(s)?.curated).toBe(s);
  });
});

describe('patterns and digits (H2)', () => {
  it('names the pattern of a sequence', () => {
    const cases: [string, string][] = [
      ['7', 'single'],
      ['11', 'repeat'],
      ['999999', 'repeat'],
      ['1234', 'stair'],
      ['987', 'stair'],
      ['1221', 'mirror'],
      ['1001', 'mirror'],
      ['12321', 'mirror'],
      ['1212', 'alternating'],
      ['123123', 'alternating'],
      ['1122', 'doubles'],
      ['112233', 'doubles'],
      ['1231', 'frame'],
      ['12', 'mixed'],
      ['482915', 'mixed'],
    ];
    for (const [seq, pattern] of cases) expect(sequencePattern(seq), seq).toBe(pattern);
  });

  it('weighs digits by frequency, then by first appearance', () => {
    expect(digitWeights('1221')).toEqual([
      { digit: '1', count: 2 },
      { digit: '2', count: 2 },
    ]);
    expect(digitWeights('5155').map((d) => d.digit)).toEqual(['5', '1']);
  });
});

describe('every input gives a reading (property, H Abnahme)', () => {
  const hasReading = (raw: string) => {
    const l = lookupAngel(raw);
    expect(l, raw).not.toBeNull();
    const keys = angelTextKeys(l!);
    if (keys.kind === 'curated') expect(de[`${keys.prefix}.meaning`], raw).toBeTruthy();
    else {
      expect(de[keys.pattern], raw).toBeTruthy();
      expect(keys.digits.length, raw).toBeGreaterThan(0);
      for (const d of keys.digits) expect(de[`${d}.meaning`], raw).toBeTruthy();
    }
  };

  it('for all inputs of 1–4 digits and every clock time', () => {
    for (let len = 1; len <= 4; len++) for (let n = 0; n < 10 ** len; n++) hasReading(String(n).padStart(len, '0'));
    for (let h = 0; h < 24; h++) for (let m = 0; m < 60; m++) {
      hasReading(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      hasReading(`${h}:${String(m).padStart(2, '0')}`);
    }
  });

  it('for 5 000 sampled inputs of 5 and 6 digits', () => {
    let x = 20261128;
    for (let i = 0; i < 5000; i++) {
      x = (x * 1103515245 + 12345) % 2 ** 31;
      hasReading(String(x % 10 ** (5 + (i % 2))).padStart(5 + (i % 2), '0'));
    }
  });

  it('has a text for every pattern', () => {
    for (const p of ANGEL_PATTERNS) expect(de[`pattern.${p}`], p).toBeTruthy();
  });
});

describe('encounters (H3, H4)', () => {
  const now = new Date('2026-11-28T09:15:00');

  it('stores an encounter as a journal entry that counts as a journey day', () => {
    const e = newEncounterEntry('11:11', '', ' Bahnhof ', now, 'e1');
    expect(e).toMatchObject({ kind: 'number-encounter', text: '', refs: { sequence: '1111', place: 'Bahnhof' } });
    expect(journeyDays({ dailies: [], readings: [], journal: [e] })).toBe(1);
    expect(newEncounterEntry('0000', 'note', '', now, 'e2').refs).toEqual({ sequence: '000' });
    expect(() => newEncounterEntry('12345678', '', '', now, 'e3')).toThrow();
  });

  it('counts own sequences, most frequent first, without deleted entries', () => {
    const at = (day: string) => new Date(`2026-11-${day}T12:00:00`);
    const journal = [
      newEncounterEntry('222', '', '', at('20'), 'a'),
      newEncounterEntry('1111', '', '', at('21'), 'b'),
      newEncounterEntry('11:11', '', '', at('25'), 'c'),
      newEncounterEntry('222', '', '', at('26'), 'd'),
      { ...newEncounterEntry('333', '', '', at('27'), 'e'), deletedAt: at('27').toISOString() },
    ];
    expect(encounterCounts(journal)).toEqual([
      { sequence: '222', count: 2, lastDateKey: '2026-11-26' },
      { sequence: '1111', count: 2, lastDateKey: '2026-11-25' },
    ]);
  });
});
