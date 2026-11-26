import type { DailyRecord, Profile, Reading, ReadingDraft, Settings } from '../../domain/types.ts';
import { SCHEMA_VERSION, StorageError, type Snapshot, type StorageRepository } from './repository.ts';
import { isDailyRecord, isDraft, isProfile, isReading, isSettings } from './validate.ts';

const DB_NAME = 'personal-oracle';
const KV = 'kv';
const DAILY = 'daily';
const READINGS = 'readings';
type StoreName = typeof KV | typeof DAILY | typeof READINGS;

function req<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error ?? new DOMException('Transaction aborted', 'AbortError'));
    tx.onerror = () => reject(tx.error);
  });
}

function wrapWriteError(err: unknown): StorageError {
  if (err instanceof StorageError) return err;
  const name = err instanceof DOMException ? err.name : '';
  if (name === 'QuotaExceededError') return new StorageError('quota', 'Storage quota exceeded', { cause: err });
  return new StorageError('write-failed', 'Could not write local data', { cause: err });
}

/**
 * IndexedDB adapter used in the browser and inside the bundled Android WebView.
 * Writes use strict durability where supported so a completed write survives a process kill.
 */
export class IndexedDbRepository implements StorageRepository {
  private db: IDBDatabase | null = null;
  private readonly factory: IDBFactory;
  private readonly name: string;

  constructor(options: { factory?: IDBFactory; name?: string } = {}) {
    this.factory = options.factory ?? globalThis.indexedDB;
    this.name = options.name ?? DB_NAME;
  }

  async open(): Promise<void> {
    if (this.db) return;
    if (!this.factory) throw new StorageError('unavailable', 'IndexedDB is not available');
    const request = this.factory.open(this.name, SCHEMA_VERSION);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      // Explicit, idempotent migrations per schema version. Never drops user data.
      if (event.oldVersion < 1) {
        if (!db.objectStoreNames.contains(KV)) db.createObjectStore(KV);
        if (!db.objectStoreNames.contains(DAILY)) db.createObjectStore(DAILY, { keyPath: 'dateKey' });
        if (!db.objectStoreNames.contains(READINGS)) {
          const s = db.createObjectStore(READINGS, { keyPath: 'id' });
          s.createIndex('createdAt', 'createdAt');
        }
      }
    };
    try {
      this.db = await new Promise<IDBDatabase>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new DOMException('Database upgrade blocked by another tab', 'AbortError'));
      });
    } catch (err) {
      throw new StorageError('unavailable', 'Could not open local database', { cause: err });
    }
    this.db.onversionchange = () => {
      this.db?.close();
      this.db = null;
    };
  }

  private tx(stores: StoreName[], mode: IDBTransactionMode): IDBTransaction {
    if (!this.db) throw new StorageError('unavailable', 'Database is not open');
    return mode === 'readwrite'
      ? this.db.transaction(stores, mode, { durability: 'strict' })
      : this.db.transaction(stores, mode);
  }

  async loadAll(): Promise<Snapshot> {
    const tx = this.tx([KV, DAILY, READINGS], 'readonly');
    const kv = tx.objectStore(KV);
    const [settings, profile, draft, dailies, readings] = await Promise.all([
      req(kv.get('settings')),
      req(kv.get('profile')),
      req(kv.get('draft')),
      req(tx.objectStore(DAILY).getAll()),
      req(tx.objectStore(READINGS).getAll()),
    ]);
    let skippedCorrupt = 0;
    const keep = <T>(v: unknown, guard: (x: unknown) => x is T): T | null => {
      if (v === undefined) return null;
      if (guard(v)) return v;
      skippedCorrupt++;
      return null;
    };
    const validDailies = (dailies as unknown[]).filter((d): d is DailyRecord => {
      const ok = isDailyRecord(d);
      if (!ok) skippedCorrupt++;
      return ok;
    });
    const validReadings = (readings as unknown[]).filter((r): r is Reading => {
      const ok = isReading(r);
      if (!ok) skippedCorrupt++;
      return ok;
    });
    return {
      settings: keep(settings, isSettings),
      profile: keep(profile, isProfile),
      draft: keep(draft, isDraft),
      dailies: validDailies,
      readings: validReadings,
      skippedCorrupt,
    };
  }

  private async putKv(key: string, value: unknown): Promise<void> {
    try {
      const tx = this.tx([KV], 'readwrite');
      tx.objectStore(KV).put(value, key);
      await done(tx);
    } catch (err) {
      throw wrapWriteError(err);
    }
  }

  putSettings(settings: Settings): Promise<void> {
    return this.putKv('settings', settings);
  }

  putProfile(profile: Profile): Promise<void> {
    return this.putKv('profile', profile);
  }

  putDraft(draft: ReadingDraft): Promise<void> {
    return this.putKv('draft', draft);
  }

  async deleteDraft(): Promise<void> {
    try {
      const tx = this.tx([KV], 'readwrite');
      tx.objectStore(KV).delete('draft');
      await done(tx);
    } catch (err) {
      throw wrapWriteError(err);
    }
  }

  async addDailyIfAbsent(record: DailyRecord): Promise<DailyRecord> {
    try {
      const tx = this.tx([DAILY], 'readwrite');
      const store = tx.objectStore(DAILY);
      let result: DailyRecord = record;
      const existing = await req(store.get(record.dateKey));
      if (existing !== undefined && isDailyRecord(existing)) result = existing;
      else if (existing !== undefined) throw new StorageError('corrupt', `Unreadable daily record for ${record.dateKey}`);
      else store.add(record);
      await done(tx);
      return result;
    } catch (err) {
      // A parallel tab may have won the race between our get and add: read the winner.
      if (err instanceof DOMException && err.name === 'ConstraintError') {
        const tx = this.tx([DAILY], 'readonly');
        const winner = await req(tx.objectStore(DAILY).get(record.dateKey));
        if (isDailyRecord(winner)) return winner;
      }
      throw wrapWriteError(err);
    }
  }

  async updateDailyNote(dateKey: string, note: string): Promise<DailyRecord> {
    try {
      const tx = this.tx([DAILY], 'readwrite');
      const store = tx.objectStore(DAILY);
      const existing = await req(store.get(dateKey));
      if (!isDailyRecord(existing)) throw new StorageError('corrupt', `No readable daily record for ${dateKey}`);
      // Only the note changes; the original interpretation stays untouched.
      const updated: DailyRecord = { ...existing, note };
      store.put(updated);
      await done(tx);
      return updated;
    } catch (err) {
      throw wrapWriteError(err);
    }
  }

  async saveReading(reading: Reading): Promise<Reading> {
    try {
      const tx = this.tx([READINGS, KV], 'readwrite');
      const store = tx.objectStore(READINGS);
      const existing = await req(store.get(reading.id));
      const result = isReading(existing) ? existing : reading;
      if (!isReading(existing)) store.put(reading);
      const kv = tx.objectStore(KV);
      const draft = await req(kv.get('draft'));
      if (isDraft(draft) && draft.id === reading.id) kv.delete('draft');
      await done(tx);
      return result;
    } catch (err) {
      throw wrapWriteError(err);
    }
  }

  async updateReadingNote(id: string, note: string): Promise<Reading> {
    try {
      const tx = this.tx([READINGS], 'readwrite');
      const store = tx.objectStore(READINGS);
      const existing = await req(store.get(id));
      if (!isReading(existing)) throw new StorageError('corrupt', `No readable reading ${id}`);
      const updated: Reading = { ...existing, note };
      store.put(updated);
      await done(tx);
      return updated;
    } catch (err) {
      throw wrapWriteError(err);
    }
  }

  async clearAll(): Promise<void> {
    try {
      const tx = this.tx([KV, DAILY, READINGS], 'readwrite');
      tx.objectStore(KV).clear();
      tx.objectStore(DAILY).clear();
      tx.objectStore(READINGS).clear();
      await done(tx);
    } catch (err) {
      throw wrapWriteError(err);
    }
  }

  close(): void {
    this.db?.close();
    this.db = null;
  }
}
