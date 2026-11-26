import type { DailyRecord, Profile, Reading, ReadingDraft, Settings } from '../../domain/types.ts';

/** Storage layout version. Independent from the content version. */
export const SCHEMA_VERSION = 1;

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
  /** Records that failed validation are reported, never silently deleted. */
  skippedCorrupt: number;
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
  updateDailyNote(dateKey: string, note: string): Promise<DailyRecord>;
  putDraft(draft: ReadingDraft): Promise<void>;
  deleteDraft(): Promise<void>;
  /** Saves the reading and removes the matching draft in one transaction. Idempotent per id. */
  saveReading(reading: Reading): Promise<Reading>;
  updateReadingNote(id: string, note: string): Promise<Reading>;
  /** Removes only this app's own local data. */
  clearAll(): Promise<void>;
  close(): void;
}
