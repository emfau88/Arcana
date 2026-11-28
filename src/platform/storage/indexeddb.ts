import type {
  ActivityEvent,
  DailyRecord,
  EntitlementCache,
  Favorite,
  JournalEntry,
  PersonalData,
  Profile,
  Reading,
  ReadingDraft,
  SeenFlag,
  Settings,
} from '../../domain/types.ts';
import { SCHEMA_VERSION, StorageError, type Snapshot, type StorageRepository, type StoreData } from './repository.ts';
import {
  isDailyRecord,
  isDraft,
  normalizeProfile,
  isReading,
  normalizeSettings,
  normalizeEntitlements,
  normalizeEvent,
  normalizeFavorite,
  normalizeJournalEntry,
  normalizePersonal,
  normalizeSeen,
} from './validate.ts';

// A separate design preview on the same origin (GitHub Pages /preview/) gets its own
// database so it never reads or migrates the data of the main preview.
const DB_NAME = import.meta.env.VITE_STORAGE_NAMESPACE
  ? `personal-oracle-${import.meta.env.VITE_STORAGE_NAMESPACE}`
  : 'personal-oracle';
const KV = 'kv';
const DAILY = 'daily';
const READINGS = 'readings';
const JOURNAL = 'journal';
const EVENTS = 'events';
const FAVORITES = 'favorites';
const SEEN = 'seen';
type StoreName = typeof KV | typeof DAILY | typeof READINGS | typeof JOURNAL | typeof EVENTS | typeof FAVORITES | typeof SEEN;
export const ALL_STORES: StoreName[] = [KV, DAILY, READINGS, JOURNAL, EVENTS, FAVORITES, SEEN];
/** kv keys a restore replaces. 'entitlements' is not among them (purchases come from the store). */
const RESTORED_KV = ['settings', 'profile', 'personal', 'draft'] as const;

/**
 * Explicit, additive and idempotent migrations per schema version. Never rewrites or drops
 * existing data (IA §5.5). Exported for the upgrade tests.
 */
export function migrate(db: IDBDatabase, oldVersion: number): void {
  const ensure = (name: string, keyPath?: string): IDBObjectStore | null =>
    db.objectStoreNames.contains(name) ? null : db.createObjectStore(name, keyPath ? { keyPath } : undefined);
  if (oldVersion < 1) {
    ensure(KV);
    ensure(DAILY, 'dateKey');
    ensure(READINGS, 'id')?.createIndex('createdAt', 'createdAt');
  }
  if (oldVersion < 2) {
    const journal = ensure(JOURNAL, 'id');
    journal?.createIndex('dateKey', 'dateKey');
    journal?.createIndex('kind', 'kind');
    const events = ensure(EVENTS, 'id');
    events?.createIndex('type', 'type');
    events?.createIndex('dateKey', 'dateKey');
    ensure(FAVORITES, 'key');
    ensure(SEEN, 'key');
  }
}

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
/**
 * S-49: the first save of a note with text leaves `notedAt`; later edits and deleting keep it.
 * A note with text from before 0.5 gets it on its first change, deleting included.
 */
function firstNoted(existing: { note?: unknown; notedAt?: string }, note: string, at: string | undefined): { notedAt?: string } {
  const hadText = typeof existing.note === 'string' && existing.note.trim().length > 0;
  return at !== undefined && existing.notedAt === undefined && (hadText || note.trim().length > 0) ? { notedAt: at } : {};
}

export class IndexedDbRepository implements StorageRepository {
  private db: IDBDatabase | null = null;
  private readonly factory: IDBFactory;
  private readonly name: string;
  private versionChangeHandler: (() => void) | null = null;

  constructor(options: { factory?: IDBFactory; name?: string } = {}) {
    this.factory = options.factory ?? globalThis.indexedDB;
    this.name = options.name ?? DB_NAME;
  }

  async open(): Promise<void> {
    if (this.db) return;
    if (!this.factory) throw new StorageError('unavailable', 'IndexedDB is not available');
    const request = this.factory.open(this.name, SCHEMA_VERSION);
    request.onupgradeneeded = (event) => migrate(request.result, event.oldVersion);
    try {
      this.db = await new Promise<IDBDatabase>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new DOMException('Database upgrade blocked by another tab', 'AbortError'));
      });
    } catch (err) {
      throw new StorageError('unavailable', 'Could not open local database', { cause: err });
    }
    // Another tab opens a newer schema: step aside so its upgrade is not blocked, then let the
    // app ask for a reload (writes from here would fail anyway).
    this.db.onversionchange = () => {
      this.db?.close();
      this.db = null;
      this.versionChangeHandler?.();
    };
  }

  onVersionChange(handler: () => void): void {
    this.versionChangeHandler = handler;
  }

  private tx(stores: StoreName[], mode: IDBTransactionMode): IDBTransaction {
    if (!this.db) throw new StorageError('unavailable', 'Database is not open');
    return mode === 'readwrite'
      ? this.db.transaction(stores, mode, { durability: 'strict' })
      : this.db.transaction(stores, mode);
  }

  async loadAll(): Promise<Snapshot> {
    const tx = this.tx(ALL_STORES, 'readonly');
    const kv = tx.objectStore(KV);
    const all = (name: StoreName) => req(tx.objectStore(name).getAll()) as Promise<unknown[]>;
    const [settings, profile, draft, personal, entitlements, dailies, readings, journal, events, favorites, seen] = await Promise.all([
      req(kv.get('settings')),
      req(kv.get('profile')),
      req(kv.get('draft')),
      req(kv.get('personal')),
      req(kv.get('entitlements')),
      all(DAILY),
      all(READINGS),
      all(JOURNAL),
      all(EVENTS),
      all(FAVORITES),
      all(SEEN),
    ]);
    let skippedCorrupt = 0;
    const keep = <T>(v: unknown, guard: (x: unknown) => x is T): T | null => {
      if (v === undefined) return null;
      if (guard(v)) return v;
      skippedCorrupt++;
      return null;
    };
    const keepNormalized = <T>(v: unknown, normalize: (x: unknown) => T | null): T | null => {
      if (v === undefined) return null;
      const n = normalize(v);
      if (n === null) skippedCorrupt++;
      return n;
    };
    const validList = <T>(list: unknown[], normalize: (x: unknown) => T | null): T[] => {
      const out: T[] = [];
      for (const item of list) {
        const n = normalize(item);
        if (n === null) skippedCorrupt++;
        else out.push(n);
      }
      return out;
    };
    const guarded =
      <T>(guard: (x: unknown) => x is T) =>
      (x: unknown): T | null =>
        guard(x) ? x : null;
    return {
      settings: keepNormalized(settings, normalizeSettings),
      profile: keepNormalized(profile, normalizeProfile),
      draft: keep(draft, isDraft),
      personal: keepNormalized(personal, normalizePersonal),
      entitlements: keepNormalized(entitlements, normalizeEntitlements),
      dailies: validList<DailyRecord>(dailies, guarded(isDailyRecord)),
      readings: validList<Reading>(readings, guarded(isReading)),
      journal: validList(journal, normalizeJournalEntry),
      events: validList(events, normalizeEvent),
      favorites: validList(favorites, normalizeFavorite),
      seen: validList(seen, normalizeSeen),
      skippedCorrupt,
    };
  }

  /** One write transaction; maps IndexedDB failures to StorageError. */
  private async write(stores: StoreName[], work: (tx: IDBTransaction) => void | Promise<void>): Promise<void> {
    try {
      const tx = this.tx(stores, 'readwrite');
      await work(tx);
      await done(tx);
    } catch (err) {
      throw wrapWriteError(err);
    }
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

  async updateDailyNote(dateKey: string, note: string, at?: string): Promise<DailyRecord> {
    try {
      const tx = this.tx([DAILY], 'readwrite');
      const store = tx.objectStore(DAILY);
      const existing = await req(store.get(dateKey));
      if (!isDailyRecord(existing)) throw new StorageError('corrupt', `No readable daily record for ${dateKey}`);
      // Only the note changes; the original interpretation stays untouched.
      const updated: DailyRecord = { ...existing, note, ...firstNoted(existing, note, at) };
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

  async updateReadingNote(id: string, note: string, at?: string): Promise<Reading> {
    try {
      const tx = this.tx([READINGS], 'readwrite');
      const store = tx.objectStore(READINGS);
      const existing = await req(store.get(id));
      if (!isReading(existing)) throw new StorageError('corrupt', `No readable reading ${id}`);
      const updated: Reading = { ...existing, note, ...firstNoted(existing, note, at) };
      store.put(updated);
      await done(tx);
      return updated;
    } catch (err) {
      throw wrapWriteError(err);
    }
  }

  putPersonal(data: PersonalData): Promise<void> {
    return this.putKv('personal', data);
  }

  deletePersonal(): Promise<void> {
    return this.write([KV], (tx) => void tx.objectStore(KV).delete('personal'));
  }

  putJournalEntry(entry: JournalEntry): Promise<void> {
    return this.write([JOURNAL], (tx) => void tx.objectStore(JOURNAL).put(entry));
  }

  deleteJournalEntry(id: string): Promise<void> {
    return this.write([JOURNAL], (tx) => void tx.objectStore(JOURNAL).delete(id));
  }

  async appendEvent(event: ActivityEvent): Promise<ActivityEvent> {
    let result = event;
    await this.write([EVENTS], async (tx) => {
      const store = tx.objectStore(EVENTS);
      const existing = normalizeEvent(await req(store.get(event.id)));
      if (existing) result = existing;
      else store.put(event);
    });
    return result;
  }

  putFavorite(favorite: Favorite): Promise<void> {
    return this.write([FAVORITES], (tx) => void tx.objectStore(FAVORITES).put(favorite));
  }

  deleteFavorite(key: string): Promise<void> {
    return this.write([FAVORITES], (tx) => void tx.objectStore(FAVORITES).delete(key));
  }

  async markSeen(key: string, seenAt: string): Promise<SeenFlag> {
    let result: SeenFlag = { key, seenAt };
    await this.write([SEEN], async (tx) => {
      const store = tx.objectStore(SEEN);
      const existing = normalizeSeen(await req(store.get(key)));
      if (existing) result = existing;
      else store.put(result);
    });
    return result;
  }

  putEntitlements(cache: EntitlementCache): Promise<void> {
    return this.putKv('entitlements', cache);
  }

  replaceAll(data: StoreData): Promise<void> {
    return this.write(ALL_STORES, (tx) => {
      const kv = tx.objectStore(KV);
      for (const key of RESTORED_KV) kv.delete(key);
      if (data.kv.settings) kv.put(data.kv.settings, 'settings');
      if (data.kv.profile) kv.put(data.kv.profile, 'profile');
      if (data.kv.personal) kv.put(data.kv.personal, 'personal');
      const fill = (name: StoreName, items: readonly unknown[]) => {
        const store = tx.objectStore(name);
        store.clear();
        for (const item of items) store.put(item);
      };
      fill(DAILY, data.daily);
      fill(READINGS, data.readings);
      fill(JOURNAL, data.journal);
      fill(EVENTS, data.events);
      fill(FAVORITES, data.favorites);
      fill(SEEN, data.seen);
    });
  }

  clearAll(): Promise<void> {
    return this.write(ALL_STORES, (tx) => {
      for (const name of ALL_STORES) tx.objectStore(name).clear();
    });
  }

  close(): void {
    this.db?.close();
    this.db = null;
  }
}
