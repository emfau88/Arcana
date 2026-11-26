import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import type { Clock } from '../../src/domain/clock.ts';
import { createDailyRecord, createDraft, finalizeReading, revealAll } from '../../src/domain/oracle.ts';
import { seededRng } from '../../src/domain/random.ts';
import type { DailyRecord, Profile, Settings } from '../../src/domain/types.ts';
import { IndexedDbRepository } from '../../src/platform/storage/indexeddb.ts';
import { StorageError } from '../../src/platform/storage/repository.ts';

const clock: Clock = { now: () => new Date(2026, 10, 26, 9, 0, 0) };
let factory: IDBFactory;
let repo: IndexedDbRepository;

const record = (seed: number): DailyRecord =>
  createDailyRecord({ pack: CONTENT, clock, rng: seededRng(seed), themeId: 'self', archetypeId: 'sage', locale: 'de', previousCardId: null });

const settings: Settings = { locale: 'de', motion: 'system', onboardingDone: true };
const profile: Profile = { answers: { 'q-calling': 'a-question' }, themeId: 'love', archetypeId: null, profileVersion: 1, updatedAt: '2026-11-26T08:00:00.000Z' };

beforeEach(async () => {
  factory = new IDBFactory();
  repo = new IndexedDbRepository({ factory, name: 'test-db' });
  await repo.open();
});

afterEach(() => repo.close());

/** Writes raw (possibly invalid) values straight into a store, bypassing the repository. */
async function rawPut(store: string, value: unknown, key?: string): Promise<void> {
  const db = await new Promise<IDBDatabase>((res, rej) => {
    const r = factory.open('test-db');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  await new Promise<void>((res, rej) => {
    const tx = db.transaction([store], 'readwrite');
    if (key === undefined) tx.objectStore(store).put(value);
    else tx.objectStore(store).put(value, key);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
  db.close();
}

describe('IndexedDB repository', () => {
  it('starts empty', async () => {
    const s = await repo.loadAll();
    expect(s).toEqual({ settings: null, profile: null, dailies: [], readings: [], draft: null, skippedCorrupt: 0 });
  });

  it('persists settings and profile across reopen', async () => {
    await repo.putSettings(settings);
    await repo.putProfile(profile);
    repo.close();
    const again = new IndexedDbRepository({ factory, name: 'test-db' });
    await again.open();
    const s = await again.loadAll();
    expect(s.settings).toEqual(settings);
    expect(s.profile).toEqual(profile);
    again.close();
  });

  it('stores exactly one daily card per day, even on double tap', async () => {
    const first = record(1);
    const second = { ...record(2), cardId: CONTENT.cards.find((c) => c.id !== first.cardId)!.id };
    const [a, b] = await Promise.all([repo.addDailyIfAbsent(first), repo.addDailyIfAbsent(second)]);
    expect(a.cardId).toBe(b.cardId);
    const s = await repo.loadAll();
    expect(s.dailies).toHaveLength(1);
    expect(s.dailies[0]!.cardId).toBe(a.cardId);
  });

  it('keeps the first daily card when two "tabs" race', async () => {
    const other = new IndexedDbRepository({ factory, name: 'test-db' });
    await other.open();
    const results = await Promise.all([repo.addDailyIfAbsent(record(1)), other.addDailyIfAbsent({ ...record(3), cardId: 'major-19-sun' })]);
    expect(results[0]!.cardId).toBe(results[1]!.cardId);
    expect((await repo.loadAll()).dailies).toHaveLength(1);
    other.close();
  });

  it('updates only the note of a daily record', async () => {
    const r = await repo.addDailyIfAbsent(record(1));
    const updated = await repo.updateDailyNote(r.dateKey, 'Synthetische Testnotiz');
    expect(updated.note).toBe('Synthetische Testnotiz');
    expect(updated.content).toEqual(r.content);
    await expect(repo.updateDailyNote('2020-01-01', 'x')).rejects.toBeInstanceOf(StorageError);
  });

  it('saves a reading once and removes the matching draft atomically', async () => {
    const draft = createDraft(CONTENT, 'love', clock, seededRng(5));
    await repo.putDraft(draft);
    expect((await repo.loadAll()).draft?.id).toBe(draft.id);
    const reading = finalizeReading(CONTENT, revealAll(draft), 'de', clock);
    await Promise.all([repo.saveReading(reading), repo.saveReading(reading)]);
    const s = await repo.loadAll();
    expect(s.readings).toHaveLength(1);
    expect(s.draft).toBeNull();
  });

  it('keeps an unrelated draft when saving a different reading', async () => {
    const d1 = createDraft(CONTENT, 'self', clock, seededRng(6));
    const d2 = createDraft(CONTENT, 'self', clock, seededRng(7));
    await repo.putDraft(d2);
    await repo.saveReading(finalizeReading(CONTENT, revealAll(d1), 'de', clock));
    expect((await repo.loadAll()).draft?.id).toBe(d2.id);
  });

  it('updates a reading note without touching the interpretation', async () => {
    const reading = finalizeReading(CONTENT, revealAll(createDraft(CONTENT, 'self', clock, seededRng(8))), 'en', clock);
    await repo.saveReading(reading);
    const u = await repo.updateReadingNote(reading.id, 'note');
    expect(u.note).toBe('note');
    expect(u.content).toEqual(reading.content);
    await expect(repo.updateReadingNote('missing', 'x')).rejects.toBeInstanceOf(StorageError);
  });

  it('skips and reports corrupt records instead of deleting them', async () => {
    await repo.addDailyIfAbsent(record(1));
    await rawPut('daily', { dateKey: '2026-11-25', cardId: 42 });
    await rawPut('readings', { id: 'broken' });
    await rawPut('kv', { locale: 'xx' }, 'settings');
    const s = await repo.loadAll();
    expect(s.dailies).toHaveLength(1);
    expect(s.readings).toHaveLength(0);
    expect(s.settings).toBeNull();
    expect(s.skippedCorrupt).toBe(3);
    // Still there: nothing was silently removed.
    const again = await repo.loadAll();
    expect(again.skippedCorrupt).toBe(3);
  });

  it('does not overwrite an unreadable record for the same day', async () => {
    const r = record(1);
    await rawPut('daily', { dateKey: r.dateKey, cardId: 42 });
    await expect(repo.addDailyIfAbsent(r)).rejects.toBeInstanceOf(StorageError);
  });

  it('clears only its own data', async () => {
    await repo.putSettings(settings);
    await repo.addDailyIfAbsent(record(1));
    await repo.clearAll();
    const s = await repo.loadAll();
    expect(s.settings).toBeNull();
    expect(s.dailies).toHaveLength(0);
  });

  it('reports a missing IndexedDB as unavailable', async () => {
    const r = new IndexedDbRepository({ factory: undefined as unknown as IDBFactory, name: 'x' });
    // The constructor falls back to globalThis.indexedDB (fake here); simulate absence explicitly.
    Object.defineProperty(r, 'factory', { value: undefined });
    await expect(r.open()).rejects.toMatchObject({ kind: 'unavailable' });
  });
});
