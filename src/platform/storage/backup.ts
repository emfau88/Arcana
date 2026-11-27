import type { ActivityEvent, DailyRecord, Favorite, JournalEntry, PersonalData, Profile, Reading, SeenFlag, Settings } from '../../domain/types.ts';
import { SCHEMA_VERSION, type Snapshot, type StoreData } from './repository.ts';
import {
  isDailyRecord,
  normalizeProfile,
  isReading,
  isSettings,
  normalizeEvent,
  normalizeFavorite,
  normalizeJournalEntry,
  normalizePersonal,
  normalizeSeen,
} from './validate.ts';

/**
 * Backup file (IA §5.7): a local JSON file the person keeps. No purchase rights, no draft.
 * The birth date is only included when the person ticks it explicitly.
 * Format only (V03.1); the screens to create and restore come in V07.3.
 */
export const BACKUP_FORMAT = 'arcana-backup';
export const BACKUP_FORMAT_VERSION = 1;

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  formatVersion: typeof BACKUP_FORMAT_VERSION;
  /** IndexedDB schema at the time of the backup. */
  schemaVersion: number;
  appVersion: string;
  createdAt: string;
  /** Birth date included? */
  includesPersonal: boolean;
  stores: StoreData;
}

export function backupFileName(dateKey: string): string {
  return `arcana-sicherung-${dateKey}.json`;
}

export function createBackup(
  snapshot: Snapshot,
  options: { appVersion: string; createdAt: string; includePersonal: boolean },
): BackupFile {
  const personal = options.includePersonal ? snapshot.personal : null;
  const kv: StoreData['kv'] = {};
  if (snapshot.profile) kv.profile = snapshot.profile;
  if (snapshot.settings) kv.settings = snapshot.settings;
  if (personal) kv.personal = personal;
  return {
    format: BACKUP_FORMAT,
    formatVersion: BACKUP_FORMAT_VERSION,
    schemaVersion: SCHEMA_VERSION,
    appVersion: options.appVersion,
    createdAt: options.createdAt,
    includesPersonal: personal !== null,
    stores: {
      kv,
      daily: snapshot.dailies,
      readings: snapshot.readings,
      journal: snapshot.journal,
      events: snapshot.events,
      favorites: snapshot.favorites,
      seen: snapshot.seen,
    },
  };
}

export function serializeBackup(file: BackupFile): string {
  return `${JSON.stringify(file, null, 2)}\n`;
}

/** Why a file cannot be restored. Nothing is changed in any of these cases. */
export type BackupProblem =
  | 'not-json'
  /** Valid JSON, but not an ARCANA backup. */
  | 'not-backup'
  /** Written by a newer app: "update the app first". */
  | 'newer'
  /** The frame of the file is broken (missing or wrong top-level fields). */
  | 'invalid';

export type StoreKey = 'profile' | 'settings' | 'personal' | 'daily' | 'readings' | 'journal' | 'events' | 'favorites' | 'seen';

export type ParsedBackup =
  | {
      ok: true;
      meta: { appVersion: string; createdAt: string; schemaVersion: number; includesPersonal: boolean };
      /** Normalised to the current schema, ready for StorageRepository.replaceAll. */
      data: StoreData;
      /** Unreadable or duplicate entries per store: skipped and named, never guessed (D-05). */
      skipped: Partial<Record<StoreKey, number>>;
      skippedTotal: number;
    }
  | { ok: false; problem: BackupProblem };

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Checks a backup file and brings it to the current schema. Older files run through the same
 * additive rules as the database (missing stores = empty, missing optional fields = defaults).
 */
export function parseBackup(text: string): ParsedBackup {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, problem: 'not-json' };
  }
  if (!isObj(raw) || raw.format !== BACKUP_FORMAT) return { ok: false, problem: 'not-backup' };
  const { formatVersion, schemaVersion } = raw;
  if (!Number.isInteger(formatVersion) || !Number.isInteger(schemaVersion) || (formatVersion as number) < 1 || (schemaVersion as number) < 1) {
    return { ok: false, problem: 'invalid' };
  }
  if ((formatVersion as number) > BACKUP_FORMAT_VERSION || (schemaVersion as number) > SCHEMA_VERSION) return { ok: false, problem: 'newer' };
  const { appVersion, createdAt, includesPersonal, stores } = raw;
  if (typeof appVersion !== 'string' || typeof createdAt !== 'string' || typeof includesPersonal !== 'boolean' || !isObj(stores) || !isObj(stores.kv)) {
    return { ok: false, problem: 'invalid' };
  }

  const skipped: Partial<Record<StoreKey, number>> = {};
  const skip = (key: StoreKey) => (skipped[key] = (skipped[key] ?? 0) + 1);
  let frameBroken = false;

  const list = <T>(key: Exclude<StoreKey, 'profile' | 'settings' | 'personal'>, normalize: (v: unknown) => T | null, id: (item: T) => string): T[] => {
    const value = (stores as Obj)[key];
    if (value === undefined) return []; // store did not exist in that schema
    if (!Array.isArray(value)) {
      frameBroken = true;
      return [];
    }
    const seen = new Set<string>();
    const out: T[] = [];
    for (const item of value) {
      const n = normalize(item);
      if (n === null || seen.has(id(n))) {
        skip(key);
        continue;
      }
      seen.add(id(n));
      out.push(n);
    }
    return out;
  };
  const guarded =
    <T>(guard: (v: unknown) => v is T) =>
    (v: unknown): T | null =>
      guard(v) ? v : null;
  const single = <T>(key: 'profile' | 'settings' | 'personal', normalize: (v: unknown) => T | null): T | undefined => {
    const value = (stores.kv as Obj)[key];
    if (value === undefined) return undefined;
    const n = normalize(value);
    if (n === null) skip(key);
    return n ?? undefined;
  };

  const kv: StoreData['kv'] = {};
  const profile = single<Profile>('profile', normalizeProfile);
  const settings = single<Settings>('settings', guarded(isSettings));
  // The birth date is only taken when the file says it was included on purpose.
  const personal = includesPersonal ? single<PersonalData>('personal', normalizePersonal) : undefined;
  if (profile) kv.profile = profile;
  if (settings) kv.settings = settings;
  if (personal) kv.personal = personal;

  const data: StoreData = {
    kv,
    daily: list<DailyRecord>('daily', guarded(isDailyRecord), (d) => d.dateKey),
    readings: list<Reading>('readings', guarded(isReading), (r) => r.id),
    journal: list<JournalEntry>('journal', normalizeJournalEntry, (j) => j.id),
    events: list<ActivityEvent>('events', normalizeEvent, (e) => e.id),
    favorites: list<Favorite>('favorites', normalizeFavorite, (f) => f.key),
    seen: list<SeenFlag>('seen', normalizeSeen, (s) => s.key),
  };
  if (frameBroken) return { ok: false, problem: 'invalid' };

  const skippedTotal = Object.values(skipped).reduce((a, b) => a + (b ?? 0), 0);
  return {
    ok: true,
    meta: { appVersion, createdAt, schemaVersion: schemaVersion as number, includesPersonal: personal !== undefined },
    data,
    skipped,
    skippedTotal,
  };
}
