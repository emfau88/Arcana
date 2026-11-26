// Writes the frozen schema-1 fixtures (data as v0.2.x stores it) for the upgrade tests.
// Run once with the v0.2.1 domain code: node --experimental-strip-types tests/fixtures/make-db-v1.ts
// The JSON files are committed and must NOT be regenerated with later code: they stand for
// data that real installations of 0.2.x already hold.
import { writeFileSync } from 'node:fs';
import { CONTENT } from '../../src/content/index.ts';
import type { Clock } from '../../src/domain/clock.ts';
import { createDailyRecord, createDraft, finalizeReading, revealAll } from '../../src/domain/oracle.ts';
import { seededRng } from '../../src/domain/random.ts';

const at = (d: number, h = 9): Clock => ({ now: () => new Date(2026, 10, d, h, 0, 0) });
const day = (d: number, seed: number, previousCardId: string | null) =>
  createDailyRecord({ pack: CONTENT, clock: at(d), rng: seededRng(seed), themeId: 'love', archetypeId: 'seeker', locale: 'de', previousCardId });

const d24 = day(24, 11, null);
const d25 = { ...day(25, 12, d24.cardId), note: 'Synthetische Notiz zum Tag' };
const d26 = day(26, 13, d25.cardId);
const r1 = { ...finalizeReading(CONTENT, revealAll(createDraft(CONTENT, 'self', at(25, 20), seededRng(21))), 'de', at(25, 20)), note: 'Synthetische Notiz zur Legung' };
const r2 = finalizeReading(CONTENT, revealAll(createDraft(CONTENT, 'career', at(26, 18), seededRng(22))), 'en', at(26, 18));
const open = { ...createDraft(CONTENT, 'change', at(26, 21), seededRng(23)), revealed: [true, false, false] };

const settings = { locale: 'de', motion: 'system', onboardingDone: true };
const profile = {
  answers: { 'q-calling': 'a-question' },
  themeId: 'love',
  archetypeId: 'seeker',
  archetypeSource: 'questions',
  profileVersion: 1,
  updatedAt: '2026-11-24T08:00:00.000Z',
};

const note = 'Schema 1 (v0.2.x), written with v0.2.1 domain code. Frozen: never regenerate.';
const write = (name: string, data: unknown) =>
  writeFileSync(new URL(`./${name}.json`, import.meta.url), `${JSON.stringify({ note, ...(data as object) }, null, 1)}\n`);

write('db-v1-empty', { kv: {}, daily: [], readings: [] });
write('db-v1-full', { kv: { settings, profile, draft: open }, daily: [d24, d25, d26], readings: [r1, r2] });
write('db-v1-broken', {
  kv: { settings, profile: { ...profile, archetypeSource: 'invented' }, draft: 'not a draft' },
  daily: [d24, { dateKey: '2026-11-25', cardId: 42 }, d26, { dateKey: 'garbage' }],
  readings: [r1, { id: 'broken' }],
});
console.warn('fixtures written');
