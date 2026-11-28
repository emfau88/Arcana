/**
 * Card page and card study (V05.1, PRODUCT_SYSTEMS D, PROGRESSION_DESIGN §4). Pure functions:
 * which layers a level opens, which study part comes next, and the facts a finished part leaves.
 * The level itself is derived in progress.ts from stored facts, never stored.
 */
import { localDateKey } from './clock.ts';
import type { CardEncounters, CardLevel } from './progress.ts';
import type { ActivityEvent, CardId, JournalEntry } from './types.ts';

/* ------------------------------------------------------------------ Layers */

export type CardLayer =
  | 'essence' // level 1: core meaning (core)
  | 'message' // level 1: message for the active theme (core)
  | 'light' // level 2
  | 'shadow' // level 2
  | 'keyword' // level 2
  | 'themes' // level 3: all six theme messages (core)
  | 'roles' // level 3: the card in spread roles R1–R8
  | 'symbols' // level 3: what the painting shows
  | 'notes' // level 4: own notes on this card
  | 'ritual' // level 4: second ritual
  | 'question' // level 4: personal question
  | 'gold'; // level 4: gold frame in the grimoire

/** What each level adds (PRODUCT_SYSTEMS D, table of levels). */
export const LAYERS_BY_LEVEL: Readonly<Record<1 | 2 | 3 | 4, readonly CardLayer[]>> = {
  1: ['essence', 'message'],
  2: ['light', 'shadow', 'keyword'],
  3: ['themes', 'roles', 'symbols'],
  4: ['notes', 'ritual', 'question', 'gold'],
};

/**
 * Layers open at a level, cumulative. Level 0 opens nothing: the card page exists only after the
 * first encounter (S-21). Normal spreads never depend on levels (D4): nothing here locks a card.
 */
export function cardLayers(level: CardLevel): CardLayer[] {
  const out: CardLayer[] = [];
  for (let l = 1; l <= level; l++) out.push(...LAYERS_BY_LEVEL[l as 1 | 2 | 3 | 4]);
  return out;
}

/** Level symbol in the grimoire (D3): a moon phase from new to full instead of a bar. */
export type LevelPhase = 'new' | 'crescent' | 'half' | 'gibbous' | 'full';
export const LEVEL_PHASE: Readonly<Record<CardLevel, LevelPhase>> = { 0: 'new', 1: 'crescent', 2: 'half', 3: 'gibbous', 4: 'full' };

/* ------------------------------------------------------------------- Study */

export type StudyPart = 1 | 2;

export interface StudyStep {
  part: StudyPart;
  /** Both parts were done before: the study is offered again (voluntary, as often as wanted, D2). */
  again: boolean;
}

/** Next part to offer on the card page. Part 2 builds on part 1 (PROGRESSION_DESIGN §4). */
export function nextStudyPart(e: CardEncounters | undefined): StudyStep {
  if (!e?.studied.part1) return { part: 1, again: false };
  if (!e.studied.part2) return { part: 2, again: false };
  return { part: 1, again: true };
}

export interface StudyFacts {
  /** Appended to 'events'; counts as a journey day and opens levels 2 and 3. */
  event: ActivityEvent;
  /** Only with a written answer: a journal entry that counts as a reflection (level 4). */
  entry: JournalEntry | null;
}

/**
 * The facts one finished study part leaves. A tap on "read" is enough (no answer, D2); an answer
 * with text is kept as a journal entry of kind 'study'. `newId` comes from the caller (store).
 */
export function studyFacts(cardId: CardId, part: StudyPart, answer: string, now: Date, newId: () => string): StudyFacts {
  const at = now.toISOString();
  const dateKey = localDateKey(now);
  const event: ActivityEvent = { id: newId(), type: 'card.studied', dateKey, at, refs: { cardId, part } };
  const text = answer.trim();
  const entry: JournalEntry | null = text ? { id: newId(), kind: 'study', dateKey, text, refs: { cardId }, createdAt: at, updatedAt: at } : null;
  return { event, entry };
}
