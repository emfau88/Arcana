import { describe, expect, it } from 'vitest';
import { activeBack, backOpensOn, CARD_BACKS, openBacks } from '../../src/domain/cardbacks.ts';
import { BUILD_FEATURES, hintForToday } from '../../src/domain/hints.ts';
import { createBackup, parseBackup, serializeBackup } from '../../src/platform/storage/backup.ts';
import { normalizeSettings } from '../../src/platform/storage/validate.ts';

const base = { locale: 'de', motion: 'system', onboardingDone: true } as const;

describe('card backs (V05.5, D-66)', () => {
  it('opens the three backs on journey days 2, 5 and 10, read from the milestone table', () => {
    expect(CARD_BACKS.map(backOpensOn)).toEqual([0, 2, 5, 10]);
    expect(openBacks(0)).toEqual(['standard']);
    expect(openBacks(1)).toEqual(['standard']);
    expect(openBacks(2)).toEqual(['standard', 'crescent']);
    expect(openBacks(9)).toEqual(['standard', 'crescent', 'compass']);
    expect(openBacks(10)).toEqual(['standard', 'crescent', 'compass', 'golden-wheel']);
    expect(openBacks(400)).toEqual([...CARD_BACKS]);
  });

  it('draws the chosen back only when it is open; anything else is the standard back', () => {
    expect(activeBack(undefined, 50)).toBe('standard');
    expect(activeBack('compass', 5)).toBe('compass');
    expect(activeBack('golden-wheel', 9)).toBe('standard');
    expect(activeBack('edition', 400)).toBe('standard'); // the Edition back is not part of this set
    expect(activeBack('', 400)).toBe('standard');
  });

  it('points the milestone hint of day 5 to the card back now that it is built', () => {
    expect(BUILD_FEATURES.has('cardbacks')).toBe(true);
    expect(hintForToday({ journeyDay: 5, features: BUILD_FEATURES })).toEqual({ kind: 'milestone', id: 'cardback:compass' });
  });

  it('keeps the settings when the stored choice is broken, and keeps the choice through a backup', () => {
    expect(normalizeSettings({ ...base, cardBack: 'crescent' })).toEqual({ ...base, cardBack: 'crescent' });
    expect(normalizeSettings({ ...base, cardBack: 7 })).toEqual(base);
    expect(normalizeSettings({ ...base, motion: 'fast' })).toBeNull();

    const snapshot = { settings: { ...base, cardBack: 'golden-wheel' }, profile: null, personal: null, dailies: [], readings: [], journal: [], events: [], favorites: [], seen: [] };
    const file = createBackup(snapshot as never, { appVersion: '0.5.0', createdAt: '2026-11-27T20:00:00.000Z', includePersonal: false });
    const restored = parseBackup(serializeBackup(file));
    expect(restored.ok && restored.data.kv.settings).toEqual({ ...base, cardBack: 'golden-wheel' });
  });
});
