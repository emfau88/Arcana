import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import type { ActivityEvent, Favorite, JournalEntry } from '../../src/domain/types.ts';
import { ALL_STORES, IndexedDbRepository } from '../../src/platform/storage/indexeddb.ts';
import { SCHEMA_VERSION } from '../../src/platform/storage/repository.ts';
import broken from '../fixtures/db-v1-broken.json';
import empty from '../fixtures/db-v1-empty.json';
import full from '../fixtures/db-v1-full.json';

type Fixture = { kv: Record<string, unknown>; daily: unknown[]; readings: unknown[] };
const NAME = 'upgrade-db';

function openRaw(factory: IDBFactory, version?: number, upgrade?: (db: IDBDatabase) => void): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = version === undefined ? factory.open(NAME) : factory.open(NAME, version);
    if (upgrade) r.onupgradeneeded = () => upgrade(r.result);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

const reqP = <T>(r: IDBRequest<T>) => new Promise<T>((res, rej) => ((r.onsuccess = () => res(r.result)), (r.onerror = () => rej(r.error))));

/** Writes a fixture into a database with exactly the v0.2.x layout (frozen copy of schema 1). */
async function seedV1(factory: IDBFactory, fixture: Fixture): Promise<void> {
  const db = await openRaw(factory, 1, (d) => {
    d.createObjectStore('kv');
    d.createObjectStore('daily', { keyPath: 'dateKey' });
    d.createObjectStore('readings', { keyPath: 'id' }).createIndex('createdAt', 'createdAt');
  });
  const tx = db.transaction(['kv', 'daily', 'readings'], 'readwrite');
  for (const [key, value] of Object.entries(fixture.kv)) tx.objectStore('kv').put(value, key);
  for (const d of fixture.daily) tx.objectStore('daily').put(d);
  for (const r of fixture.readings) tx.objectStore('readings').put(r);
  await new Promise<void>((res, rej) => ((tx.oncomplete = () => res()), (tx.onerror = () => rej(tx.error))));
  db.close();
}

/** Everything stored, read around the repository. */
async function dump(factory: IDBFactory) {
  const db = await openRaw(factory);
  const names = [...db.objectStoreNames].sort();
  const tx = db.transaction(names, 'readonly');
  const kvKeys = (await reqP(tx.objectStore('kv').getAllKeys())) as string[];
  const kv: Record<string, unknown> = {};
  for (const k of kvKeys) kv[k] = await reqP(tx.objectStore('kv').get(k));
  const stores: Record<string, unknown[]> = {};
  for (const n of names.filter((n) => n !== 'kv')) stores[n] = await reqP(tx.objectStore(n).getAll());
  const indexes = Object.fromEntries(names.map((n) => [n, [...tx.objectStore(n).indexNames].sort()]));
  const version = db.version;
  db.close();
  return { version, names, indexes, kv, stores };
}

const fixtures: [string, Fixture, number][] = [
  ['empty', empty as Fixture, 0],
  ['full', full as Fixture, 0],
  ['partly broken', broken as Fixture, 5], // profile, draft, two dailies, one reading
];

describe('schema 1 → 2 upgrade', () => {
  it.each(fixtures)('%s: adds the new stores and keeps every v0.2 record bit-identical', async (_name, fixture, skipped) => {
    const factory = new IDBFactory();
    await seedV1(factory, fixture);
    const repo = new IndexedDbRepository({ factory, name: NAME });
    await repo.open();
    const snap = await repo.loadAll();
    repo.close();

    const after = await dump(factory);
    expect(after.version).toBe(SCHEMA_VERSION);
    expect(after.names).toEqual([...ALL_STORES].sort());
    expect(after.indexes).toEqual({
      daily: [],
      events: ['dateKey', 'type'],
      favorites: [],
      journal: ['dateKey', 'kind'],
      kv: [],
      readings: ['createdAt'],
      seen: [],
    });
    // Old data: untouched, value for value.
    expect(after.kv).toStrictEqual(fixture.kv);
    expect(after.stores.daily).toStrictEqual([...fixture.daily].sort((a, b) => String((a as { dateKey: string }).dateKey).localeCompare((b as { dateKey: string }).dateKey)));
    expect(after.stores.readings).toHaveLength(fixture.readings.length);
    for (const r of fixture.readings) expect(after.stores.readings).toContainEqual(r);
    // New stores: empty.
    for (const n of ['journal', 'events', 'favorites', 'seen']) expect(after.stores[n]).toEqual([]);
    // Readable through the repository, broken records reported and kept.
    expect(snap.skippedCorrupt).toBe(skipped);
    expect(snap.journal).toEqual([]);
    expect(snap.personal).toBeNull();
  });

  it('reads a full v0.2 data set exactly as it was written', async () => {
    const factory = new IDBFactory();
    await seedV1(factory, full as Fixture);
    const repo = new IndexedDbRepository({ factory, name: NAME });
    await repo.open();
    const snap = await repo.loadAll();
    repo.close();
    expect(snap.settings).toStrictEqual(full.kv.settings);
    expect(snap.profile).toStrictEqual(full.kv.profile);
    expect(snap.draft).toStrictEqual(full.kv.draft);
    expect(snap.dailies).toStrictEqual(full.daily);
    expect(snap.readings).toHaveLength(2);
    for (const r of full.readings) expect(snap.readings).toContainEqual(r);
  });

  it('is idempotent: opening twice gives the same result', async () => {
    const factory = new IDBFactory();
    await seedV1(factory, broken as Fixture);
    const first = new IndexedDbRepository({ factory, name: NAME });
    await first.open();
    const a = await first.loadAll();
    first.close();
    const dumpA = await dump(factory);
    const second = new IndexedDbRepository({ factory, name: NAME });
    await second.open();
    const b = await second.loadAll();
    second.close();
    expect(b).toStrictEqual(a);
    expect(await dump(factory)).toStrictEqual(dumpA);
  });
});

describe('schema 2 stores', () => {
  const fresh = async () => {
    const factory = new IDBFactory();
    const repo = new IndexedDbRepository({ factory, name: NAME });
    await repo.open();
    return { factory, repo };
  };
  const entry: JournalEntry = {
    id: 'j1',
    kind: 'reflection',
    dateKey: '2026-11-26',
    text: 'Synthetischer Eintrag',
    refs: { cardId: 'major-03-empress' },
    createdAt: '2026-11-26T20:00:00.000Z',
    updatedAt: '2026-11-26T20:00:00.000Z',
  };
  const event: ActivityEvent = { id: 'e1', type: 'card.studied', dateKey: '2026-11-26', at: '2026-11-26T20:01:00.000Z', refs: { cardId: 'major-03-empress', part: 1 } };
  const favorite: Favorite = { key: 'card:major-03-empress', kind: 'card', id: 'major-03-empress', createdAt: '2026-11-26T20:02:00.000Z' };

  it('writes, reads and deletes journal entries, birth date and favourites', async () => {
    const { repo } = await fresh();
    await repo.putJournalEntry(entry);
    await repo.putPersonal({ birthDate: '1990-01-01', savedAt: '2026-11-26T20:00:00.000Z' });
    await repo.putFavorite(favorite);
    let s = await repo.loadAll();
    expect(s.journal).toStrictEqual([entry]);
    expect(s.personal?.birthDate).toBe('1990-01-01');
    expect(s.favorites).toStrictEqual([favorite]);
    await repo.deleteJournalEntry('j1');
    await repo.deletePersonal();
    await repo.deleteFavorite(favorite.key);
    s = await repo.loadAll();
    expect([s.journal, s.favorites, s.personal]).toEqual([[], [], null]);
    repo.close();
  });

  it('keeps events append-only and seen markers first-wins', async () => {
    const { repo } = await fresh();
    expect(await repo.appendEvent(event)).toStrictEqual(event);
    expect(await repo.appendEvent({ ...event, type: 'ritual.done' })).toStrictEqual(event);
    expect(await repo.markSeen('milestone:21', '2026-11-26T10:00:00.000Z')).toEqual({ key: 'milestone:21', seenAt: '2026-11-26T10:00:00.000Z' });
    expect((await repo.markSeen('milestone:21', '2026-11-27T10:00:00.000Z')).seenAt).toBe('2026-11-26T10:00:00.000Z');
    const s = await repo.loadAll();
    expect(s.events).toHaveLength(1);
    expect(s.seen).toHaveLength(1);
    repo.close();
  });

  it('fills defaults for missing optional fields and skips unreadable records', async () => {
    const { factory, repo } = await fresh();
    const db = await openRaw(factory);
    const tx = db.transaction(['journal', 'events', 'favorites', 'seen', 'kv'], 'readwrite');
    tx.objectStore('journal').put({ id: 'old', kind: 'free', dateKey: '2026-11-20', createdAt: '2026-11-20T08:00:00.000Z' });
    tx.objectStore('journal').put({ id: 'bad', kind: 'gossip', dateKey: '2026-11-20', createdAt: 'x' });
    tx.objectStore('events').put({ id: 'e-old', type: 'review.opened', dateKey: '2026-11-20', at: '2026-11-20T08:00:00.000Z' });
    tx.objectStore('favorites').put({ key: 'symbol:moon', kind: 'card', id: 'moon', createdAt: 'x' }); // key does not match
    tx.objectStore('seen').put({ key: 'chapter:seeker:1' }); // no seenAt
    tx.objectStore('kv').put({ birthDate: '1990-13-45', savedAt: 'x' }, 'personal');
    await new Promise<void>((res) => (tx.oncomplete = () => res()));
    db.close();
    const s = await repo.loadAll();
    expect(s.journal).toEqual([
      { id: 'old', kind: 'free', dateKey: '2026-11-20', text: '', refs: {}, createdAt: '2026-11-20T08:00:00.000Z', updatedAt: '2026-11-20T08:00:00.000Z' },
    ]);
    expect(s.events).toEqual([{ id: 'e-old', type: 'review.opened', dateKey: '2026-11-20', at: '2026-11-20T08:00:00.000Z', refs: {} }]);
    expect(s.favorites).toEqual([]);
    expect(s.seen).toEqual([]);
    expect(s.personal).toBeNull();
    expect(s.skippedCorrupt).toBe(4);
    repo.close();
  });

  it('clears every store, and a restore keeps purchase rights but drops the draft', async () => {
    const { factory, repo } = await fresh();
    await repo.putJournalEntry(entry);
    await repo.appendEvent(event);
    await repo.putFavorite(favorite);
    await repo.markSeen('milestone:7', '2026-11-26T10:00:00.000Z');
    await repo.putEntitlements({ rights: ['core.daily'], checkedAt: '2026-11-26T10:00:00.000Z' });
    await repo.putDraft(full.kv.draft as never);
    await repo.replaceAll({ kv: {}, daily: [], readings: [], journal: [], events: [], favorites: [], seen: [] });
    const restored = await repo.loadAll();
    expect(restored.draft).toBeNull();
    expect(restored.entitlements?.rights).toEqual(['core.daily']);
    expect(restored.journal).toEqual([]);
    await repo.putJournalEntry(entry);
    await repo.clearAll();
    repo.close();
    const after = await dump(factory);
    expect(after.kv).toEqual({});
    for (const n of Object.keys(after.stores)) expect(after.stores[n]).toEqual([]);
  });

  it('steps aside for a newer version in another tab and says so once', async () => {
    const { factory, repo } = await fresh();
    let calls = 0;
    repo.onVersionChange(() => calls++);
    const newer = await openRaw(factory, SCHEMA_VERSION + 1); // must not be blocked
    expect(newer.version).toBe(SCHEMA_VERSION + 1);
    expect(calls).toBe(1);
    await expect(repo.loadAll()).rejects.toMatchObject({ kind: 'unavailable' });
    newer.close();
  });
});
