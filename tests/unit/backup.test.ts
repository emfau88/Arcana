import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import { backupFileName, createBackup, parseBackup, serializeBackup, type BackupFile } from '../../src/platform/storage/backup.ts';
import { IndexedDbRepository } from '../../src/platform/storage/indexeddb.ts';
import { SCHEMA_VERSION, type Snapshot } from '../../src/platform/storage/repository.ts';
import full from '../fixtures/db-v1-full.json';

/** A device with everything: the frozen v0.2 data set plus one record in every v2 store. */
async function deviceWithData(): Promise<IndexedDbRepository> {
  const repo = new IndexedDbRepository({ factory: new IDBFactory(), name: 'backup-src' });
  await repo.open();
  await repo.putSettings(full.kv.settings as never);
  await repo.putProfile(full.kv.profile as never);
  await repo.putDraft(full.kv.draft as never);
  for (const d of full.daily) await repo.addDailyIfAbsent(d as never);
  for (const r of full.readings) await repo.saveReading(r as never);
  await repo.putPersonal({ birthDate: '1990-01-01', savedAt: '2026-11-26T20:00:00.000Z' });
  await repo.putEntitlements({ rights: ['core.daily'], checkedAt: '2026-11-26T20:00:00.000Z' });
  await repo.putJournalEntry({ id: 'j1', kind: 'study', dateKey: '2026-11-26', text: 'Synthetisch', refs: { cardId: 'major-11-justice' }, createdAt: '2026-11-26T20:00:00.000Z', updatedAt: '2026-11-26T20:05:00.000Z' });
  await repo.appendEvent({ id: 'e1', type: 'card.studied', dateKey: '2026-11-26', at: '2026-11-26T20:01:00.000Z', refs: { cardId: 'major-11-justice', part: 2 } });
  await repo.putFavorite({ key: 'card:major-11-justice', kind: 'card', id: 'major-11-justice', createdAt: '2026-11-26T20:02:00.000Z' });
  await repo.markSeen('milestone:7', '2026-11-26T20:03:00.000Z');
  return repo;
}

const opts = { appVersion: '0.3.0', createdAt: '2026-11-26T21:00:00.000Z', includePersonal: true };
const backedUp = (s: Snapshot) => ({ ...s, draft: null, entitlements: null });

describe('backup format', () => {
  it('round trip: back up → check → restore on a new device gives identical data', async () => {
    const source = await deviceWithData();
    const before = await source.loadAll();
    source.close();
    const text = serializeBackup(createBackup(before, opts));

    const parsed = parseBackup(text);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.skippedTotal).toBe(0);
    expect(parsed.meta).toEqual({ appVersion: '0.3.0', createdAt: opts.createdAt, schemaVersion: SCHEMA_VERSION, includesPersonal: true });

    const target = new IndexedDbRepository({ factory: new IDBFactory(), name: 'backup-dst' });
    await target.open();
    await target.replaceAll(parsed.data);
    const after = await target.loadAll();
    target.close();
    const sortReadings = (s: Snapshot) => ({ ...s, readings: [...s.readings].sort((a, b) => a.id.localeCompare(b.id)) });
    expect(sortReadings(after)).toStrictEqual(sortReadings(backedUp(before)));
  });

  it('serialise → parse returns the stores unchanged', async () => {
    const repo = await deviceWithData();
    const file = createBackup(await repo.loadAll(), opts);
    repo.close();
    const parsed = parseBackup(serializeBackup(file));
    expect(parsed.ok && parsed.data).toStrictEqual(file.stores);
  });

  it('leaves the birth date out unless it is ticked, and never carries purchases or the draft', async () => {
    const repo = await deviceWithData();
    const snap = await repo.loadAll();
    repo.close();
    const file = createBackup(snap, { ...opts, includePersonal: false });
    const text = serializeBackup(file);
    expect(file.includesPersonal).toBe(false);
    expect(text).not.toContain('birthDate');
    expect(text).not.toContain('core.daily');
    expect(text).not.toContain('entitlements');
    expect(text).not.toContain('"revealed"');
    // A hand-edited file that says "not included" but carries a birth date: ignored.
    const edited = JSON.parse(text) as BackupFile;
    edited.stores.kv.personal = { birthDate: '1990-01-01', savedAt: 'x' };
    const parsed = parseBackup(JSON.stringify(edited));
    expect(parsed.ok && parsed.data.kv.personal).toBeUndefined();
  });

  it('rejects a file from a newer app and changes nothing', async () => {
    const repo = await deviceWithData();
    const snap = await repo.loadAll();
    const file = createBackup(snap, opts);
    expect(parseBackup(JSON.stringify({ ...file, schemaVersion: SCHEMA_VERSION + 1 }))).toEqual({ ok: false, problem: 'newer' });
    expect(parseBackup(JSON.stringify({ ...file, formatVersion: 2 }))).toEqual({ ok: false, problem: 'newer' });
    expect(await repo.loadAll()).toStrictEqual(snap);
    repo.close();
  });

  it('rejects files that are not a backup or whose frame is broken', () => {
    const base = createBackup(
      { settings: null, profile: null, dailies: [], readings: [], draft: null, personal: null, entitlements: null, journal: [], events: [], favorites: [], seen: [], skippedCorrupt: 0 },
      opts,
    );
    expect(parseBackup('{not json')).toEqual({ ok: false, problem: 'not-json' });
    expect(parseBackup('[]')).toEqual({ ok: false, problem: 'not-backup' });
    expect(parseBackup(JSON.stringify({ ...base, format: 'other' }))).toEqual({ ok: false, problem: 'not-backup' });
    expect(parseBackup(JSON.stringify({ ...base, stores: { ...base.stores, daily: {} } }))).toEqual({ ok: false, problem: 'invalid' });
    expect(parseBackup(JSON.stringify({ ...base, stores: { daily: [] } }))).toEqual({ ok: false, problem: 'invalid' });
    expect(parseBackup(JSON.stringify({ ...base, createdAt: 5 }))).toEqual({ ok: false, problem: 'invalid' });
  });

  it('skips and names unreadable or duplicate entries instead of guessing', async () => {
    const repo = await deviceWithData();
    const file = createBackup(await repo.loadAll(), opts);
    repo.close();
    const edited = JSON.parse(serializeBackup(file)) as { stores: { daily: unknown[]; journal: unknown[]; kv: Record<string, unknown> } };
    edited.stores.daily.push({ dateKey: '2026-11-01', cardId: 42 }, edited.stores.daily[0]);
    edited.stores.journal.push({ id: 'j2', kind: 'gossip' });
    edited.stores.kv.profile = { themeId: 'nonsense' };
    const parsed = parseBackup(JSON.stringify(edited));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.skipped).toEqual({ daily: 2, journal: 1, profile: 1 });
    expect(parsed.skippedTotal).toBe(4);
    expect(parsed.data.daily).toHaveLength(3);
    expect(parsed.data.kv.profile).toBeUndefined();
  });

  it('brings an older backup (schema 1, no v2 stores) to the current schema', () => {
    const old = {
      format: 'arcana-backup',
      formatVersion: 1,
      schemaVersion: 1,
      appVersion: '0.2.1',
      createdAt: '2026-11-26T21:00:00.000Z',
      includesPersonal: false,
      stores: { kv: { settings: full.kv.settings, profile: full.kv.profile }, daily: full.daily, readings: full.readings },
    };
    const parsed = parseBackup(JSON.stringify(old));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.data.daily).toStrictEqual(full.daily);
    expect([parsed.data.journal, parsed.data.events, parsed.data.favorites, parsed.data.seen]).toEqual([[], [], [], []]);
    expect(parsed.meta.schemaVersion).toBe(1);
  });

  it('names the file after the local day', () => {
    expect(backupFileName('2026-11-26')).toBe('arcana-sicherung-2026-11-26.json');
  });
});
