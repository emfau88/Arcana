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

export type PositionId = 'situation' | 'challenge' | 'impulse';
export const POSITIONS: readonly PositionId[] = ['situation', 'challenge', 'impulse'];

export type CardId = string;
export type QuestionId = string;
export type AnswerId = string;

/** Map of question id -> chosen answer id. A missing key means "skipped". */
export type Answers = Readonly<Record<QuestionId, AnswerId>>;

export interface Profile {
  /** Voluntary answers only. No name, birth date, contact or location. */
  answers: Answers;
  themeId: ThemeId;
  /** null = neutral profile (skipped or too few answers). Never a silently invented type. */
  archetypeId: ArchetypeId | null;
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
}

export interface ReadingPositionContent {
  position: PositionId;
  positionLabel: string;
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
}

export interface Reading {
  id: string;
  deckId: string;
  themeId: ThemeId;
  /** Three distinct cards in the fixed order situation, challenge, impulse. */
  cardIds: [CardId, CardId, CardId];
  locale: Locale;
  contentVersion: string;
  content: ReadingContent;
  createdAt: string;
  note: string;
}

/** An unsaved, possibly half-revealed reading. Persisted so a resume never re-draws silently. */
export interface ReadingDraft {
  id: string;
  deckId: string;
  themeId: ThemeId;
  cardIds: [CardId, CardId, CardId];
  revealed: [boolean, boolean, boolean];
  createdAt: string;
}

export interface CollectionEntry {
  cardId: CardId;
  firstSeenAt: string;
  appearances: number;
}
