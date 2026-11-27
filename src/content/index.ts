import { ARCHETYPES } from './archetypes.ts';
import { CARDS } from './cards.ts';
import { CARDS_A } from './cards-a.ts';
import { CARDS_B } from './cards-b.ts';
import { CARDS_C } from './cards-c.ts';
import { QUESTIONS } from './questions.ts';
import type { ArchetypeContent, CardContent, ContentPack, ThemeContent } from './schema.ts';
import { POSITION_LABELS, THEMES } from './themes.ts';
import { ALL_THEME_IDS, type ArchetypeId, type ThemeId } from '../domain/types.ts';

/** The full 22-card deck in traditional order. */
export const DECK = [...CARDS_A, ...CARDS, ...CARDS_B, ...CARDS_C].sort((a, b) => a.order - b.order);

export const CONTENT: ContentPack = {
  version: 'p0-2026-11-27.1',
  deckId: 'nocturne',
  targetDeckSize: 22,
  availableThemes: ALL_THEME_IDS,
  defaultTheme: 'self',
  cards: DECK,
  themes: THEMES,
  archetypes: ARCHETYPES,
  questions: QUESTIONS,
  positionLabels: POSITION_LABELS,
};

export function getCard(pack: ContentPack, id: string): CardContent {
  const card = pack.cards.find((c) => c.id === id);
  if (!card) throw new Error(`Unknown card: ${id}`);
  return card;
}

export function findCard(pack: ContentPack, id: string): CardContent | undefined {
  return pack.cards.find((c) => c.id === id);
}

export function getTheme(pack: ContentPack, id: ThemeId): ThemeContent {
  const theme = pack.themes.find((t) => t.id === id);
  if (!theme) throw new Error(`Unknown theme: ${id}`);
  return theme;
}

export function getArchetype(pack: ContentPack, id: ArchetypeId): ArchetypeContent {
  const a = pack.archetypes.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown archetype: ${id}`);
  return a;
}

/** Fall back to the default theme if a stored theme has no content in this pack. */
export function resolveTheme(pack: ContentPack, id: ThemeId): ThemeId {
  return pack.availableThemes.includes(id) ? id : pack.defaultTheme;
}

export type { ContentPack } from './schema.ts';
