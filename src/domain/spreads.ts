/**
 * Spreads as arrangements of roles (V05.2, PRODUCT_SYSTEMS F, CONTENT_MASTERPLAN §1).
 *
 * Every card has one text per role: R1–R3 in core (`card.positions`), R4–R8 in the module
 * `cards-deep`. A spread is an order of roles plus frame texts in the module `spreads` (name,
 * intro, a label and a question per position), so a new spread needs no new card texts.
 * The classic three cards keep their composition from 0.2 (`composeReading`), unchanged.
 */
import { getCard, getTheme, resolveTheme } from '../content/index.ts';
import type { TextTable } from '../content/modules/registry.ts';
import type { ContentPack } from '../content/schema.ts';
import type { Right } from './entitlements.ts';
import { journeyDayKeys, readingDateKey, REVIEW_SPAN, type Facts, type ReviewKind } from './progress.ts';
import { drawWithoutReplacement, type Rng } from './random.ts';
import { POSITIONS, ROLES, type CardId, type Locale, type PositionId, type ReadingContent, type RoleId, type ThemeId } from './types.ts';

export type SpreadId = 'classic-3' | 'light-shadow-3' | 'new-beginning-4' | 'review-week' | 'review-month' | 'two-ways-5' | 'connection-5';

export interface SpreadDef {
  id: SpreadId;
  /** One role per position, in reading order. */
  roles: readonly RoleId[];
  /** Position whose card is read through the theme (synthesis) and gives the shared reflection. */
  synthesis: number;
  /** 'chosen' = the person's theme; decision and connection have a fixed theme (PRODUCT_SYSTEMS F). */
  theme: 'chosen' | ThemeId;
  /** Right that shows the spread. Edition spreads are built but not shown without it (no placeholders). */
  right: Right;
  /** Journey day from which the spread is offered. */
  fromJourneyDay: number;
  /** Review spreads: the period looked back on. Position 0 is the thread card from the own cards. */
  review?: ReviewKind;
}

export const CLASSIC_SPREAD: SpreadId = 'classic-3';

export const SPREADS: readonly SpreadDef[] = [
  { id: 'classic-3', roles: POSITIONS, synthesis: 2, theme: 'chosen', right: 'core.reading', fromJourneyDay: 1 },
  { id: 'light-shadow-3', roles: ['light', 'shadow', 'bridge'], synthesis: 2, theme: 'chosen', right: 'core.reading', fromJourneyDay: 1 },
  { id: 'new-beginning-4', roles: ['root', 'light', 'possibility', 'impulse'], synthesis: 3, theme: 'chosen', right: 'core.reading', fromJourneyDay: 1 },
  { id: 'review-week', roles: ['root', 'impulse'], synthesis: 1, theme: 'chosen', right: 'core.reading', fromJourneyDay: 7, review: 'week' },
  { id: 'review-month', roles: ['root', 'impulse'], synthesis: 1, theme: 'chosen', right: 'core.reading', fromJourneyDay: 30, review: 'month' },
  { id: 'two-ways-5', roles: ['situation', 'possibility', 'possibility', 'light', 'impulse'], synthesis: 4, theme: 'change', right: 'edition.spreads', fromJourneyDay: 1 },
  { id: 'connection-5', roles: ['situation', 'bridge', 'light', 'shadow', 'impulse'], synthesis: 4, theme: 'love', right: 'edition.spreads', fromJourneyDay: 1 },
];

/** The spread of a draft or reading; a missing id is the classic spread (readings before V05.2). */
export function findSpread(id: string | undefined): SpreadDef | undefined {
  return SPREADS.find((s) => s.id === (id ?? CLASSIC_SPREAD));
}

export function getSpread(id: string | undefined): SpreadDef {
  const spread = findSpread(id);
  if (!spread) throw new Error(`Unknown spread: ${id}`);
  return spread;
}

/** Theme a spread is read through: the chosen one, or the spread's fixed theme. */
export function spreadTheme(pack: ContentPack, spread: SpreadDef, chosen: ThemeId): ThemeId {
  return spread.theme === 'chosen' ? resolveTheme(pack, chosen) : spread.theme;
}

/* ------------------------------------------------------------------ Review */

/**
 * Own cards of the last 7 or 30 journey days (daily cards and saved readings), each once, in the
 * order first met, and the thread: the card met most often (tie: the one met most recently).
 */
export function reviewCards(facts: Facts, kind: ReviewKind): { past: CardId[]; thread: CardId | null } {
  const days = new Set(journeyDayKeys(facts).slice(-REVIEW_SPAN[kind]));
  const met: Array<{ cardId: CardId; at: string }> = [];
  for (const d of facts.dailies) if (days.has(d.dateKey)) met.push({ cardId: d.cardId, at: d.revealedAt });
  for (const r of facts.readings) {
    const key = readingDateKey(r);
    if (key !== null && days.has(key)) for (const cardId of r.cardIds) met.push({ cardId, at: r.createdAt });
  }
  met.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
  const stats = new Map<CardId, { n: number; last: number }>();
  met.forEach((m, i) => stats.set(m.cardId, { n: (stats.get(m.cardId)?.n ?? 0) + 1, last: i }));
  let thread: CardId | null = null;
  let best: { n: number; last: number } | null = null;
  for (const [cardId, v] of stats) {
    if (!best || v.n > best.n || (v.n === best.n && v.last > best.last)) {
      thread = cardId;
      best = v;
    }
  }
  return { past: [...stats.keys()], thread };
}

/* ------------------------------------------------------------ Availability */

export interface SpreadContext {
  has: (right: Right) => boolean;
  /** The journey day the person stands on today. */
  journeyDay: number;
  facts: Facts;
}

/** Spreads offered in the oracle, in display order. Never a locked or teased entry. */
export function availableSpreads(ctx: SpreadContext): SpreadDef[] {
  return SPREADS.filter(
    (s) => ctx.has(s.right) && ctx.journeyDay >= s.fromJourneyDay && (!s.review || reviewCards(ctx.facts, s.review).thread !== null),
  );
}

/* ----------------------------------------------------------------- Drawing */

/**
 * Cards of a new spread. Review: the thread card (face up, it is already known) and one new card,
 * drawn from the cards not met in the period, or from all but the thread when every card was met.
 */
export function drawSpread(pack: ContentPack, spread: SpreadDef, rng: Rng, facts?: Facts): { cardIds: CardId[]; revealed: boolean[]; past?: CardId[] } {
  const ids = pack.cards.map((c) => c.id);
  if (!spread.review) {
    const cardIds = drawWithoutReplacement(ids, spread.roles.length, rng);
    if (cardIds.length !== spread.roles.length) throw new Error(`The deck has too few cards for ${spread.id}`);
    return { cardIds, revealed: cardIds.map(() => false) };
  }
  const { past, thread } = reviewCards(facts ?? { dailies: [], readings: [] }, spread.review);
  if (!thread) throw new Error(`No own cards for ${spread.id}`);
  const fresh = ids.filter((id) => !past.includes(id));
  const [next] = drawWithoutReplacement(fresh.length > 0 ? fresh : ids.filter((id) => id !== thread), 1, rng);
  if (!next) throw new Error('Deck is empty');
  return { cardIds: [thread, next], revealed: [true, false], past };
}

/* ------------------------------------------------------------- Composition */

/** Module tables of the reading's locale. */
export interface SpreadTexts {
  /** `cards-deep`, needed for the roles R4–R8. */
  deep?: TextTable;
  /** `spreads`, needed for every spread except the classic one. */
  spreads?: TextTable;
}

const CORE_ROLES: readonly RoleId[] = POSITIONS;

/** Text of a card in a role: R1–R3 from core, R4–R8 from cards-deep. Throws when it is missing. */
export function roleText(pack: ContentPack, deep: TextTable | undefined, role: RoleId, cardId: CardId, locale: Locale): string {
  const card = getCard(pack, cardId);
  if (CORE_ROLES.includes(role)) return card.positions[role as PositionId][locale];
  const text = deep?.[`role.${role}.${cardId}`];
  if (!text) throw new Error(`Missing role.${role}.${cardId} (${locale})`);
  return text;
}

/**
 * Full content of a spread other than the classic one. Every text comes from core or a module;
 * a missing text throws instead of showing a gap (the store loads both modules first).
 */
export function composeSpread(
  pack: ContentPack,
  spread: SpreadDef,
  input: { cardIds: readonly CardId[]; themeId: ThemeId; past?: readonly CardId[] },
  locale: Locale,
  texts: SpreadTexts,
): ReadingContent {
  if (input.cardIds.length !== spread.roles.length) throw new Error(`${spread.id} needs ${spread.roles.length} cards`);
  const need = (key: string): string => {
    const text = texts.spreads?.[key];
    if (!text) throw new Error(`Missing ${key} (${locale})`);
    return text;
  };
  const theme = getTheme(pack, spreadTheme(pack, spread, input.themeId));
  const positions = spread.roles.map((role, i) => {
    const card = getCard(pack, input.cardIds[i] as CardId);
    return {
      position: role,
      positionLabel: need(`pos.${spread.id}.${i + 1}.label`),
      question: need(`pos.${spread.id}.${i + 1}.question`),
      cardId: card.id,
      cardOrder: card.order,
      cardTitle: card.title[locale],
      essence: card.essence[locale],
      text: roleText(pack, texts.deep, role, card.id, locale),
    };
  });
  const lead = getCard(pack, input.cardIds[spread.synthesis] as CardId);
  const synthesis = lead.themes[theme.id]?.[locale];
  if (!synthesis) throw new Error(`Missing ${theme.id} text for ${lead.id}`);
  const content: ReadingContent = {
    themeLabel: theme.label[locale],
    intro: need(`spread.${spread.id}.intro`),
    positions,
    synthesisTitle: lead.title[locale],
    synthesis,
    reflection: lead.reflection[locale],
    spreadName: need(`spread.${spread.id}.name`),
  };
  if (spread.review) {
    content.past = {
      title: need(`review.${spread.review}.past`),
      cards: (input.past ?? []).map((id) => {
        const c = getCard(pack, id);
        return { cardId: c.id, cardOrder: c.order, cardTitle: c.title[locale], essence: c.essence[locale] };
      }),
    };
  }
  return content;
}

/* ------------------------------------------------------------------- Texts */

/** Keys of the module `spreads` (content gate). The classic spread keeps its labels in core. */
export function spreadTextKeys(): string[] {
  const keys = ROLES.map((r) => `role.${r}.label`);
  for (const s of SPREADS) {
    keys.push(`spread.${s.id}.name`, `spread.${s.id}.tagline`);
    if (s.id === CLASSIC_SPREAD) continue;
    keys.push(`spread.${s.id}.intro`);
    s.roles.forEach((_, i) => keys.push(`pos.${s.id}.${i + 1}.label`, `pos.${s.id}.${i + 1}.question`));
  }
  keys.push('review.week.past', 'review.month.past');
  return keys;
}
