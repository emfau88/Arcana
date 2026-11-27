/**
 * Core data contracts of the Personal Oracle domain.
 * Schema version (storage layout) and content version (texts) are separate on purpose.
 */

export type Locale = 'de' | 'en';
export const LOCALES: readonly Locale[] = ['de', 'en'];

export type ThemeId = 'love' | 'career' | 'change' | 'balance' | 'creativity' | 'self';
export const ALL_THEME_IDS: readonly ThemeId[] = ['love', 'career', 'change', 'balance', 'creativity', 'self'];

export type ArchetypeId =
  | 'seeker'
  | 'guardian'
  | 'visionary'
  | 'alchemist'
  | 'wanderer'
  | 'creator'
  | 'sage'
  | 'renewer';

/** Canonical order. Also the last-resort tie-break order (documented in DECISIONS.md, D-07). */
export const ARCHETYPE_ORDER: readonly ArchetypeId[] = [
  'seeker',
  'guardian',
  'visionary',
  'alchemist',
  'wanderer',
  'creator',
  'sage',
  'renewer',
];

export const isArchetypeId = (id: string): id is ArchetypeId => (ARCHETYPE_ORDER as readonly string[]).includes(id);

export type PositionId = 'situation' | 'challenge' | 'impulse';
export const POSITIONS: readonly PositionId[] = ['situation', 'challenge', 'impulse'];

/**
 * Roles of a spread (V05.2, PRODUCT_SYSTEMS F): R1–R3 keep the ids of the classic positions
 * ('situation' is R1 "core"), so stored readings already name their roles. R4–R8 are new.
 */
export const DEEP_ROLE_IDS = ['light', 'shadow', 'root', 'possibility', 'bridge'] as const;
export type RoleId = PositionId | (typeof DEEP_ROLE_IDS)[number];
export const ROLES: readonly RoleId[] = [...POSITIONS, ...DEEP_ROLE_IDS];

export type CardId = string;
export type QuestionId = string;
export type AnswerId = string;

/** Map of question id -> chosen answer id. A missing key means "skipped". */
export type Answers = Readonly<Record<QuestionId, AnswerId>>;

/** 'questions' = scored from the answers, 'manual' = chosen or left open by the person. */
export type ArchetypeSource = 'questions' | 'manual';

export interface Profile {
  /** Voluntary answers only. No name, birth date, contact or location. */
  answers: Answers;
  themeId: ThemeId;
  /** null = neutral profile (skipped, too few answers or left open). Never a silently invented type. */
  archetypeId: ArchetypeId | null;
  /** How archetypeId came about. Missing in records written before G2 = 'questions'. */
  archetypeSource?: ArchetypeSource;
  /** Complement ("second voice", V04.1). Missing = not determined yet (questionnaire v1), null = none. */
  secondaryArchetypeId?: ArchetypeId | null;
  /** Scores of the last questionnaire, for "Why?" (V04.2). Missing in profiles before V04. */
  scores?: Record<ArchetypeId, number>;
  /** Questionnaire the answers belong to. Missing = 1 (four questions). */
  questionnaireVersion?: number;
  /** Bumped whenever the questionnaire mapping changes. */
  profileVersion: number;
  updatedAt: string;
}

export type MotionPreference = 'system' | 'reduced' | 'full';

export interface Settings {
  locale: Locale;
  motion: MotionPreference;
  onboardingDone: boolean;
}

/** Fully rendered, immutable daily content. Stored as-is so history never changes. */
export interface DailyContent {
  cardId: CardId;
  cardOrder: number;
  cardTitle: string;
  essence: string;
  message: string;
  lens: string | null;
  reflection: string;
  ritual: string;
  themeLabel: string;
}

export interface DailyRecord {
  /** Local calendar day, YYYY-MM-DD from local date components. Primary key. */
  dateKey: string;
  deckId: string;
  cardId: CardId;
  themeId: ThemeId;
  archetypeId: ArchetypeId | null;
  locale: Locale;
  contentVersion: string;
  content: DailyContent;
  revealedAt: string;
  note: string;
  /**
   * First time the note held text (V05.4, S-49). Set once and never removed, so a note that is
   * deleted later still counts as a reflection. Missing in older records and without a note.
   */
  notedAt?: string;
  /**
   * Variant indices fixed when the record was created (V04.3, IA §5.2): lens 0 = main archetype,
   * 1 = complement; reflection 0–2 and ritual 0–1 from the earlier encounters with the card (A4, V05.1),
   * 0 = the core text. Never recomputed. Missing in older records.
   */
  variant?: { lens: number; reflection: number; ritual: number };
  /** Complement archetype at the moment of drawing (V04.3). Missing in older records. */
  secondaryArchetypeId?: ArchetypeId | null;
}

export interface ReadingPositionContent {
  /** The role of the position (classic readings: 'situation', 'challenge', 'impulse'). */
  position: RoleId;
  positionLabel: string;
  /** The question of the position (spreads since V05.2; classic readings have none). */
  question?: string;
  cardId: CardId;
  cardOrder: number;
  cardTitle: string;
  essence: string;
  text: string;
}

export interface ReadingContent {
  themeLabel: string;
  intro: string;
  positions: ReadingPositionContent[];
  synthesisTitle: string;
  synthesis: string;
  reflection: string;
  /** Name of the spread (since V05.2; missing = the classic three cards). */
  spreadName?: string;
  /** Review spreads: heading and the own cards of the period, oldest first (V05.2). */
  past?: { title: string; cards: Array<{ cardId: CardId; cardOrder: number; cardTitle: string; essence: string }> };
}

export interface Reading {
  id: string;
  deckId: string;
  themeId: ThemeId;
  /** Distinct cards, one per position (classic: situation, challenge, impulse). */
  cardIds: CardId[];
  /** Spread of the reading (V05.2). Missing = 'classic-3'. */
  spreadId?: string;
  /** Role per position (V05.2). Missing = the classic positions. */
  roles?: RoleId[];
  locale: Locale;
  contentVersion: string;
  content: ReadingContent;
  createdAt: string;
  /** Local day at the moment of saving (since 0.3). Missing in older records: derived from createdAt. */
  dateKey?: string;
  note: string;
  /** First time the note held text (V05.4, S-49), as on DailyRecord. */
  notedAt?: string;
}

/** An unsaved, possibly half-revealed reading. Persisted so a resume never re-draws silently. */
export interface ReadingDraft {
  id: string;
  deckId: string;
  themeId: ThemeId;
  cardIds: CardId[];
  revealed: boolean[];
  createdAt: string;
  /** Spread being laid (V05.2). Missing = 'classic-3'. */
  spreadId?: string;
  /** Review spreads: the own cards of the period, fixed when the draft is created. */
  past?: CardId[];
}

export interface CollectionEntry {
  cardId: CardId;
  firstSeenAt: string;
  appearances: number;
}

/* ------------------------------------------------------------------ Schema v2 (V03.1, IA §5.3)
 * Facts only. Progress (journey day, levels, milestones) is always derived, never stored.
 */

/** kv 'personal'. Sensitive, deletable on its own, never part of a share model. */
export interface PersonalData {
  /** 'YYYY-MM-DD', local only. */
  birthDate?: string;
  savedAt: string;
}

export type JournalKind = 'reflection' | 'study' | 'number-encounter' | 'moon-intention' | 'moon-reflection' | 'free';
export const JOURNAL_KINDS: readonly JournalKind[] = ['reflection', 'study', 'number-encounter', 'moon-intention', 'moon-reflection', 'free'];

export interface JournalRefs {
  cardId?: CardId;
  readingId?: string;
  sequence?: string;
  moonCycle?: string;
  ritualId?: string;
}

/** Store 'journal' (keyPath id, indexes dateKey and kind). */
export interface JournalEntry {
  id: string;
  kind: JournalKind;
  /** Local calendar day of the entry. */
  dateKey: string;
  /** May be empty (an encounter without a note). Missing in a record = ''. */
  text: string;
  /** Missing = {}. */
  refs: JournalRefs;
  createdAt: string;
  /** Missing = createdAt. */
  updatedAt: string;
  /**
   * Deleted by the person (V05.4, S-49): the text is gone, date, kind and refs stay as the fact
   * of that day. Hidden in the journal. Missing = not deleted.
   */
  deletedAt?: string;
}

export type ActivityType = 'card.studied' | 'ritual.done' | 'review.opened' | 'world.introduced';
export const ACTIVITY_TYPES: readonly ActivityType[] = ['card.studied', 'ritual.done', 'review.opened', 'world.introduced'];

export interface ActivityRefs {
  cardId?: CardId;
  part?: 1 | 2;
  ritualId?: string;
  reviewId?: string;
  world?: string;
}

/** Store 'events' (keyPath id, indexes type and dateKey). Append only. */
export interface ActivityEvent {
  id: string;
  type: ActivityType;
  dateKey: string;
  at: string;
  /** Missing = {}. */
  refs: ActivityRefs;
}

export type FavoriteKind = 'angel' | 'symbol' | 'ritual' | 'card';
export const FAVORITE_KINDS: readonly FavoriteKind[] = ['angel', 'symbol', 'ritual', 'card'];

/** Store 'favorites' (keyPath key). */
export interface Favorite {
  /** `${kind}:${id}`. Missing = derived from kind and id. */
  key: string;
  kind: FavoriteKind;
  id: string;
  createdAt: string;
}

/** Store 'seen' (keyPath key). Only "new" markers, e.g. 'milestone:21', 'level:major-03:2'. */
export interface SeenFlag {
  key: string;
  seenAt: string;
}

/** kv 'entitlements'. Cached purchase rights; never part of a backup (restored via the store). */
export interface EntitlementCache {
  rights: string[];
  checkedAt: string;
}
