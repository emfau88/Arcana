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

/**
 * Storage layout version. Independent from the content version.
 * 1 = 0.1–0.2 (kv, daily, readings). 2 = V03 (adds journal, events, favorites, seen; kv personal, entitlements).
 */
export const SCHEMA_VERSION = 2;

export class StorageError extends Error {
  readonly kind: 'unavailable' | 'corrupt' | 'write-failed' | 'quota';
  constructor(kind: StorageError['kind'], message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'StorageError';
    this.kind = kind;
  }
}

export interface Snapshot {
  settings: Settings | null;
  profile: Profile | null;
  dailies: DailyRecord[];
  readings: Reading[];
  draft: ReadingDraft | null;
  personal: PersonalData | null;
  entitlements: EntitlementCache | null;
  journal: JournalEntry[];
  events: ActivityEvent[];
  favorites: Favorite[];
  seen: SeenFlag[];
  /** Records that failed validation are reported, never silently deleted. */
  skippedCorrupt: number;
}

/**
 * Everything a backup carries and a restore replaces (IA §5.7). No draft, no purchase rights.
 */
export interface StoreData {
  kv: { profile?: Profile; settings?: Settings; personal?: PersonalData };
  daily: DailyRecord[];
  readings: Reading[];
  journal: JournalEntry[];
  events: ActivityEvent[];
  favorites: Favorite[];
  seen: SeenFlag[];
}

/**
 * Contract implemented by the IndexedDB adapter (browser + Android WebView).
 * All writes are transactional; nothing here touches data outside this app's own origin.
 */
export interface StorageRepository {
  open(): Promise<void>;
  loadAll(): Promise<Snapshot>;
  putSettings(settings: Settings): Promise<void>;
  putProfile(profile: Profile): Promise<void>;
  /**
   * Atomically insert the record for its dateKey unless one exists.
   * Returns the record that is stored afterwards (the existing one wins).
   * Safe against double taps and parallel tabs.
   */
  addDailyIfAbsent(record: DailyRecord): Promise<DailyRecord>;
  /** `at`: when the note is saved. The first note with text sets `notedAt` (S-49). */
  updateDailyNote(dateKey: string, note: string, at?: string): Promise<DailyRecord>;
  putDraft(draft: ReadingDraft): Promise<void>;
  deleteDraft(): Promise<void>;
  /** Saves the reading and removes the matching draft in one transaction. Idempotent per id. */
  saveReading(reading: Reading): Promise<Reading>;
  updateReadingNote(id: string, note: string, at?: string): Promise<Reading>;
  putPersonal(data: PersonalData): Promise<void>;
  /** Removes the birth date and other sensitive data on its own (IA §5.5). */
  deletePersonal(): Promise<void>;
  putJournalEntry(entry: JournalEntry): Promise<void>;
  deleteJournalEntry(id: string): Promise<void>;
  /** Append only. Idempotent per id: an existing event wins. */
  appendEvent(event: ActivityEvent): Promise<ActivityEvent>;
  putFavorite(favorite: Favorite): Promise<void>;
  deleteFavorite(key: string): Promise<void>;
  /** Idempotent: the first seenAt wins. */
  markSeen(key: string, seenAt: string): Promise<SeenFlag>;
  putEntitlements(cache: EntitlementCache): Promise<void>;
  /**
   * Restore: replaces all backed-up data in one transaction (no merging). The open draft is
   * dropped, cached purchase rights stay.
   */
  replaceAll(data: StoreData): Promise<void>;
  /** Removes only this app's own local data, in every store. */
  clearAll(): Promise<void>;
  /** Called once when a newer version of the app (another tab) needs the database. */
  onVersionChange(handler: () => void): void;
  close(): void;
}
