import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import { loadModule } from '../../src/content/modules/registry.ts';
import { MODULE_RULES, validateModule } from '../../src/content/modules/validate.ts';
import { journeyStation, journeyTextKeys, milestoneTextKey, readingForRound } from '../../src/domain/journey.ts';
import { milestoneAt } from '../../src/domain/progress.ts';
import { reviewTextKeys } from '../../src/domain/review.ts';

const tables = async () => ({ de: await loadModule('journey', 'de'), en: await loadModule('journey', 'en') });

describe('Fool’s journey (V04.4)', () => {
  it('table test: every journey day 1–400 has exactly one station with the right card, path and reading', async () => {
    const { de, en } = await tables();
    for (let day = 1; day <= 400; day++) {
      const s = journeyStation(day);
      const inRound = (day - 1) % 21;
      expect(s.day).toBe(day);
      expect(s.round).toBe(Math.floor((day - 1) / 21) + 1);
      expect(s.station).toBe(inRound + 1);
      expect(s.path).toBe(['outer', 'inner', 'higher'][Math.floor(inRound / 7)]);
      expect(s.stationInPath).toBe((inRound % 7) + 1);
      expect(s.reading).toBe(readingForRound(s.round));
      // Station n is card n (I–XXI); the card exists in the deck.
      expect(CONTENT.cards.some((c) => c.order === s.station)).toBe(true);
      expect(s.textKey).toBe(`station.${s.station}.${s.reading}`);
      expect(de[s.textKey], `${day} de`).toBeTruthy();
      expect(en[s.textKey], `${day} en`).toBeTruthy();
      // Path introduction exactly when a path is entered, round closing exactly at station 21.
      expect(s.pathIntroKey !== null).toBe([1, 8, 15].includes(s.station));
      expect(s.roundCloseKey !== null).toBe(s.station === 21);
      for (const k of [s.pathIntroKey, s.roundCloseKey]) {
        if (k === null) continue;
        expect(de[k], `${day} ${k}`).toBeTruthy();
        expect(en[k], `${day} ${k}`).toBeTruthy();
      }
    }
  });

  it('readings: round 1 encounter, round 2 return, round 3 and later wisdom', () => {
    expect([1, 21].map((d) => journeyStation(d).reading)).toEqual(['encounter', 'encounter']);
    expect([22, 42].map((d) => journeyStation(d).reading)).toEqual(['return', 'return']);
    expect([43, 63, 64, 400].map((d) => journeyStation(d).reading)).toEqual(['wisdom', 'wisdom', 'wisdom', 'wisdom']);
    expect(journeyStation(22).pathIntroKey).toBe('path.outer.2');
    expect(journeyStation(50).pathIntroKey).toBe('path.inner.3');
    expect(journeyStation(57).pathIntroKey).toBe('path.higher.3');
    expect(journeyStation(120).pathIntroKey).toBe('path.higher.3');
    expect(journeyStation(21).roundCloseKey).toBe('round.1.close');
    expect(journeyStation(63).roundCloseKey).toBe('round.3.close');
    expect(journeyStation(84).roundCloseKey).toBe('round.later.close');
    // A day before the first (clock set back, no facts yet) is the first station, never an error.
    expect(journeyStation(0).station).toBe(1);
  });

  it('table test: milestone texts on exactly the milestone days 1–400, one text per day', async () => {
    const { de, en } = await tables();
    for (let day = 1; day <= 400; day++) {
      const key = milestoneTextKey(day);
      expect(key !== null, `day ${day}`).toBe(milestoneAt(day) !== null);
      if (key) {
        expect(de[key], key).toBeTruthy();
        expect(en[key], key).toBeTruthy();
      }
    }
    const expected: Record<number, string | null> = {
      1: 'milestone.day.1',
      5: 'milestone.day.5',
      7: 'milestone.day.7',
      8: null,
      14: 'milestone.week',
      21: 'milestone.day.21',
      28: 'milestone.week',
      30: 'milestone.day.30',
      60: 'milestone.month',
      63: 'milestone.day.63',
      84: 'milestone.week',
      100: 'milestone.day.100',
      150: 'milestone.jubilee',
      200: 'milestone.jubilee',
      210: 'milestone.month',
      300: 'milestone.jubilee',
      75: null,
      365: 'milestone.day.365',
      399: 'milestone.week',
      400: 'milestone.jubilee',
      730: 'milestone.year',
    };
    for (const [day, key] of Object.entries(expected)) expect(milestoneTextKey(Number(day)), `day ${day}`).toBe(key);
  });

  it('the module has exactly the keys the structure needs: 63 stations, 13 path and round texts, 19 milestones, 40 review blocks', async () => {
    const journeyKeys = journeyTextKeys();
    expect(journeyKeys).toHaveLength(95);
    // V04.5: the review building blocks live in the same module.
    const keys = [...journeyKeys, ...reviewTextKeys()];
    expect(keys).toHaveLength(135);
    expect(keys.filter((k) => k.startsWith('station.'))).toHaveLength(63);
    expect(keys.filter((k) => k.startsWith('path.') || k.startsWith('round.'))).toHaveLength(13);
    expect(keys.filter((k) => k.startsWith('milestone.'))).toHaveLength(19);
    const { de, en } = await tables();
    expect(Object.keys(de).sort()).toEqual([...keys].sort());
    expect(Object.keys(en).sort()).toEqual([...keys].sort());
    expect(validateModule('journey', MODULE_RULES.journey, CONTENT, { de, en })).toMatchObject({ errors: [], warnings: [] });
  });

  it('the content gate rejects pressure words and countdowns in journey texts', async () => {
    const { de, en } = await tables();
    const bad = {
      ...de,
      'station.1.encounter': 'Deine Serie läuft weiter. Nichts ist verloren.',
      'milestone.week': 'Noch 3 Tage bis zum nächsten Meilenstein.',
    };
    const badEn = { ...en, 'milestone.month': 'Only 2 days left. Hurry!' };
    const report = validateModule('journey', MODULE_RULES.journey, CONTENT, { de: bad, en: badEn });
    expect(report.errors.some((e) => e.includes('station.1.encounter: forbidden phrasing'))).toBe(true);
    expect(report.errors.some((e) => e.includes('milestone.week: forbidden phrasing'))).toBe(true);
    expect(report.errors.some((e) => e.includes('milestone.month: forbidden phrasing'))).toBe(true);
  });
});
