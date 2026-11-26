import type { ArchetypeId, Locale, PositionId, ThemeId } from '../domain/types.ts';

/** Every user-facing text exists in all locales. The validator enforces it. */
export type Localized = Readonly<Record<Locale, string>>;

/** Visual/semantic tone of a card. Used for art direction and for a varied deck. */
export type CardTone = 'light' | 'twilight' | 'shadow';

export interface CardContent {
  /** Stable id, never renamed silently. */
  id: string;
  deckId: string;
  /** Traditional major-arcana number (0–21). Rendered by the UI, never baked into art. */
  order: number;
  assetId: string;
  tone: CardTone;
  title: Localized;
  /** One-line core meaning. */
  essence: Localized;
  /** Theme-specific message (2–4 sentences). Partial in G1, complete for P0. */
  themes: Readonly<Partial<Record<ThemeId, Localized>>>;
  /** Position impulses for the three-card spread. */
  positions: Readonly<Record<PositionId, Localized>>;
  reflection: Localized;
  ritual: Localized;
}

export interface ThemeContent {
  id: ThemeId;
  label: Localized;
  description: Localized;
  /** Framing sentence at the top of a three-card reading. */
  readingIntro: Localized;
}

export interface ArchetypeContent {
  id: ArchetypeId;
  name: Localized;
  essence: Localized;
  strength: Localized;
  /** Phrased as an open question, never as a verdict. */
  shadow: Localized;
  growth: Localized;
  reflection: Localized;
  /** Short personal lens shown with the daily card. */
  lens: Localized;
}

/** Texts: module `identity`, key `question.<questionId>.<answerId>`. */
export interface AnswerContent {
  id: string;
  /** Explicit weights: primary +2, secondary +1 (see domain/archetypes.ts). */
  primary: ArchetypeId;
  secondary: ArchetypeId;
}

/** Texts: module `identity`, key `question.<questionId>.prompt`. */
export interface QuestionContent {
  id: string;
  answers: readonly AnswerContent[];
}

export interface ContentPack {
  /** Content version is stored with every record so history is never rewritten. */
  version: string;
  deckId: string;
  /** Target deck size of the P0 product. */
  targetDeckSize: number;
  /** Themes that have content in this pack (subset of all six while in G1). */
  availableThemes: readonly ThemeId[];
  defaultTheme: ThemeId;
  cards: readonly CardContent[];
  themes: readonly ThemeContent[];
  archetypes: readonly ArchetypeContent[];
  questions: readonly QuestionContent[];
  positionLabels: Readonly<Record<PositionId, Localized>>;
}
