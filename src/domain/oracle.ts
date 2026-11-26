import { getArchetype, getCard, getTheme, resolveTheme } from '../content/index.ts';
import type { ContentPack } from '../content/schema.ts';
import { localDateKey, type Clock } from './clock.ts';
import { drawWithoutReplacement, newId, type Rng } from './random.ts';
import {
  POSITIONS,
  type ArchetypeId,
  type CardId,
  type CollectionEntry,
  type DailyContent,
  type DailyRecord,
  type Locale,
  type Reading,
  type ReadingContent,
  type ReadingDraft,
  type ThemeId,
} from './types.ts';

/* ------------------------------------------------------------------ Daily */

/**
 * Pick today's card. Avoids repeating the most recent card when the deck allows it,
 * so consecutive days never show the same card twice in a row.
 */
export function drawDailyCardId(pack: ContentPack, previousCardId: CardId | null, rng: Rng): CardId {
  const ids = pack.cards.map((c) => c.id);
  const pool = ids.length > 1 && previousCardId ? ids.filter((id) => id !== previousCardId) : ids;
  const [picked] = drawWithoutReplacement(pool, 1, rng);
  if (!picked) throw new Error('Deck is empty');
  return picked;
}

export function composeDaily(
  pack: ContentPack,
  cardId: CardId,
  themeId: ThemeId,
  archetypeId: ArchetypeId | null,
  locale: Locale,
): DailyContent {
  const card = getCard(pack, cardId);
  const theme = resolveTheme(pack, themeId);
  const message = card.themes[theme]?.[locale];
  if (!message) throw new Error(`Missing ${theme} text for ${cardId}`);
  return {
    cardId,
    cardOrder: card.order,
    cardTitle: card.title[locale],
    essence: card.essence[locale],
    message,
    lens: archetypeId ? getArchetype(pack, archetypeId).lens[locale] : null,
    reflection: card.reflection[locale],
    ritual: card.ritual[locale],
    themeLabel: getTheme(pack, theme).label[locale],
  };
}

export interface DailyInput {
  pack: ContentPack;
  clock: Clock;
  rng: Rng;
  themeId: ThemeId;
  archetypeId: ArchetypeId | null;
  locale: Locale;
  previousCardId: CardId | null;
}

/** Build (not persist) the record for the current local day. Persistence decides uniqueness. */
export function createDailyRecord(input: DailyInput): DailyRecord {
  const now = input.clock.now();
  const cardId = drawDailyCardId(input.pack, input.previousCardId, input.rng);
  const themeId = resolveTheme(input.pack, input.themeId);
  return {
    dateKey: localDateKey(now),
    deckId: input.pack.deckId,
    cardId,
    themeId,
    archetypeId: input.archetypeId,
    locale: input.locale,
    contentVersion: input.pack.version,
    content: composeDaily(input.pack, cardId, themeId, input.archetypeId, input.locale),
    revealedAt: now.toISOString(),
    note: '',
  };
}

/* ---------------------------------------------------------------- Reading */

export function createDraft(pack: ContentPack, themeId: ThemeId, clock: Clock, rng: Rng): ReadingDraft {
  const ids = drawWithoutReplacement(
    pack.cards.map((c) => c.id),
    3,
    rng,
  );
  const [a, b, c] = ids;
  if (!a || !b || !c) throw new Error('A reading needs at least three cards');
  return {
    id: newId(rng),
    deckId: pack.deckId,
    themeId: resolveTheme(pack, themeId),
    cardIds: [a, b, c],
    revealed: [false, false, false],
    createdAt: clock.now().toISOString(),
  };
}

export function revealPosition(draft: ReadingDraft, index: 0 | 1 | 2): ReadingDraft {
  if (draft.revealed[index]) return draft;
  const revealed: [boolean, boolean, boolean] = [...draft.revealed];
  revealed[index] = true;
  return { ...draft, revealed };
}

export function revealAll(draft: ReadingDraft): ReadingDraft {
  return draft.revealed.every(Boolean) ? draft : { ...draft, revealed: [true, true, true] };
}

export function isFullyRevealed(draft: ReadingDraft): boolean {
  return draft.revealed.every(Boolean);
}

/**
 * Curated, coherent interpretation:
 * - each position gets the card's own position impulse,
 * - the synthesis is the impulse card read through the chosen theme,
 * - the shared reflection question comes from the impulse card.
 */
export function composeReading(
  pack: ContentPack,
  cardIds: readonly [CardId, CardId, CardId],
  themeId: ThemeId,
  locale: Locale,
): ReadingContent {
  const theme = getTheme(pack, resolveTheme(pack, themeId));
  const positions = POSITIONS.map((position, i) => {
    const card = getCard(pack, cardIds[i] as CardId);
    return {
      position,
      positionLabel: pack.positionLabels[position][locale],
      cardId: card.id,
      cardOrder: card.order,
      cardTitle: card.title[locale],
      essence: card.essence[locale],
      text: card.positions[position][locale],
    };
  });
  const impulseCard = getCard(pack, cardIds[2]);
  const synthesis = impulseCard.themes[theme.id]?.[locale];
  if (!synthesis) throw new Error(`Missing ${theme.id} text for ${impulseCard.id}`);
  return {
    themeLabel: theme.label[locale],
    intro: theme.readingIntro[locale],
    positions,
    synthesisTitle: impulseCard.title[locale],
    synthesis,
    reflection: impulseCard.reflection[locale],
  };
}

export function finalizeReading(pack: ContentPack, draft: ReadingDraft, locale: Locale, clock: Clock): Reading {
  if (!isFullyRevealed(draft)) throw new Error('Reveal all cards before saving');
  return {
    id: draft.id,
    deckId: draft.deckId,
    themeId: draft.themeId,
    cardIds: draft.cardIds,
    locale,
    contentVersion: pack.version,
    content: composeReading(pack, draft.cardIds, draft.themeId, locale),
    createdAt: clock.now().toISOString(),
    note: '',
  };
}

/* ------------------------------------------------------------- Collection */

/** Collection is derived, never stored separately: a card counts once, however often it appears. */
export function deriveCollection(dailies: readonly DailyRecord[], readings: readonly Reading[]): Map<CardId, CollectionEntry> {
  const out = new Map<CardId, CollectionEntry>();
  const touch = (cardId: CardId, at: string) => {
    const prev = out.get(cardId);
    if (!prev) out.set(cardId, { cardId, firstSeenAt: at, appearances: 1 });
    else out.set(cardId, { cardId, firstSeenAt: at < prev.firstSeenAt ? at : prev.firstSeenAt, appearances: prev.appearances + 1 });
  };
  for (const d of dailies) touch(d.cardId, d.revealedAt);
  for (const r of readings) for (const id of r.cardIds) touch(id, r.createdAt);
  return out;
}

export type HistoryItem =
  | { kind: 'daily'; at: string; record: DailyRecord }
  | { kind: 'reading'; at: string; reading: Reading };

/** Chronological history, newest first. */
export function buildHistory(dailies: readonly DailyRecord[], readings: readonly Reading[]): HistoryItem[] {
  const items: HistoryItem[] = [
    ...dailies.map((record) => ({ kind: 'daily' as const, at: record.revealedAt, record })),
    ...readings.map((reading) => ({ kind: 'reading' as const, at: reading.createdAt, reading })),
  ];
  return items.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
}

/** Most recent daily card before the given day (for "no repeat on consecutive days"). */
export function previousDailyCard(dailies: readonly DailyRecord[], beforeKey: string): CardId | null {
  let best: DailyRecord | null = null;
  for (const d of dailies) if (d.dateKey < beforeKey && (!best || d.dateKey > best.dateKey)) best = d;
  return best?.cardId ?? null;
}

/**
 * Days of the journey = distinct local days on which the person used the oracle
 * (a daily card or a saved reading). Pauses never reduce it (E6: no streak, no loss).
 */
export function journeyDays(dailies: readonly DailyRecord[], readings: readonly Reading[]): number {
  const days = new Set<string>();
  for (const d of dailies) days.add(d.dateKey);
  for (const r of readings) {
    const at = new Date(r.createdAt);
    if (!Number.isNaN(at.getTime())) days.add(localDateKey(at));
  }
  return days.size;
}

export interface JourneyPosition {
  /** 1-based day of the journey (≥ 1). */
  day: number;
  /** 1-based round through the 21 stations of the Fool's journey. */
  round: number;
  /** 0 outer path (I–VII), 1 inner path (VIII–XIV), 2 higher path (XV–XXI). */
  path: 0 | 1 | 2;
  /** 1-based station within the current path of seven. */
  station: number;
}

/**
 * Places a journey day on the traditional three rows of seven of the Fool's journey.
 * Purely symbolic and monotonic: every day of use moves one station on, pauses move nothing.
 */
export function journeyPosition(day: number): JourneyPosition {
  const d = Math.max(1, Math.floor(day));
  const inRound = (d - 1) % 21;
  return { day: d, round: Math.floor((d - 1) / 21) + 1, path: Math.floor(inRound / 7) as 0 | 1 | 2, station: (inRound % 7) + 1 };
}
