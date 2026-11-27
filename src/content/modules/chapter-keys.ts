/**
 * Keys of the content module `chapters` (V04.5, PRODUCT_SYSTEMS C6/B6, PROGRESSION_DESIGN §3.2):
 * four archetype chapters opened on journey days 3, 21, 42 and 63, and the chapter "Two voices" /
 * "The other side" on day 100, written per archetype as someone's second voice.
 * Own module because the texts are long and only the grimoire reads them (start stays light).
 */
import { ARCHETYPE_ORDER, type ArchetypeId } from '../../domain/types.ts';
import type { TextTable } from './registry.ts';

export const CHAPTERS = ['1', '2', '3', '4', 'second-voice'] as const;
export type ChapterId = (typeof CHAPTERS)[number];

/** Journey day on which a chapter opens (archetype chapters, PROGRESSION_DESIGN §3.2). */
export const CHAPTER_DAY: Readonly<Record<ChapterId, number>> = { '1': 3, '2': 21, '3': 42, '4': 63, 'second-voice': 100 };

export interface ChapterTexts {
  /** I "Your gift", II "Your connections", III "Your shadow", IV "Your path", then the second voice. */
  gift: string;
  connections: string;
  shadow: string;
  path: string;
  secondVoice: string;
}

export function chapterKey(archetypeId: ArchetypeId, chapter: ChapterId): string {
  return `chapter.${archetypeId}.${chapter}`;
}

export function chapterTable(byArchetype: Readonly<Record<ArchetypeId, ChapterTexts>>): TextTable {
  const out: Record<string, string> = {};
  for (const id of ARCHETYPE_ORDER) {
    const c = byArchetype[id];
    out[chapterKey(id, '1')] = c.gift;
    out[chapterKey(id, '2')] = c.connections;
    out[chapterKey(id, '3')] = c.shadow;
    out[chapterKey(id, '4')] = c.path;
    out[chapterKey(id, 'second-voice')] = c.secondVoice;
  }
  return out;
}

export function chapterKeys(): string[] {
  return ARCHETYPE_ORDER.flatMap((id) => CHAPTERS.map((c) => chapterKey(id, c)));
}

/** Chapters open on this journey day (inclusive), in reading order. */
export function chaptersOpen(journeyDay: number): ChapterId[] {
  return CHAPTERS.filter((c) => journeyDay >= CHAPTER_DAY[c]);
}
