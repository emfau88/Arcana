/**
 * Keys of the content module `archetypes` (V04.2, PRODUCT_SYSTEMS C4/C5/C7): the detailed profile
 * of each archetype, its reveal sentence, its short text as second voice and the symbol labels.
 * The first strength summary, shadow, growth and reflection stay in core (`archetypes.ts`), so
 * the module adds strengths 1–3, shadows 2–3, growth 2 and reflections 2–5.
 * Edition-only texts (inner tensions, relationship pattern, ritual series) are not written before
 * billing exists (AGENTS.md: no dummies).
 */
import { RESONANCE, SYMBOL_IDS, type SymbolId } from '../resonance.ts';
import { ARCHETYPE_ORDER, type ArchetypeId } from '../../domain/types.ts';
import type { TextTable } from './registry.ts';

export interface ProfileTexts {
  /** 120–180 words, names the three resonance cards and the guiding symbol. */
  description: string;
  strengths: readonly [string, string, string];
  /** Shadows 2 and 3, always questions. */
  shadows: readonly [string, string];
  /** Growth 2. */
  growth: string;
  /** Reflections 2–5, always questions. */
  reflections: readonly [string, string, string, string];
  /** Shown at the reveal under the name (1–2 sentences). */
  reveal: string;
  /** Short text when this archetype is someone's second voice (1–2 sentences). */
  complement: string;
}

export function archetypeTable(profiles: Readonly<Record<ArchetypeId, ProfileTexts>>, symbols: Readonly<Record<SymbolId, string>>): TextTable {
  const out: Record<string, string> = {};
  for (const id of ARCHETYPE_ORDER) {
    const p = profiles[id];
    out[`description.${id}`] = p.description;
    p.strengths.forEach((s, i) => (out[`strength.${id}.${i + 1}`] = s));
    p.shadows.forEach((s, i) => (out[`shadow.${id}.${i + 2}`] = s));
    out[`growth.${id}.2`] = p.growth;
    p.reflections.forEach((s, i) => (out[`reflection.${id}.${i + 2}`] = s));
    out[`reveal.${id}`] = p.reveal;
    out[`complement.${id}`] = p.complement;
  }
  for (const s of SYMBOL_IDS) out[`symbol.${s}`] = symbols[s];
  return out;
}

/** Every key the module must contain (content gate). */
export function archetypeKeys(): string[] {
  const keys: string[] = [];
  for (const id of ARCHETYPE_ORDER) {
    keys.push(`description.${id}`, `reveal.${id}`, `complement.${id}`, `growth.${id}.2`);
    for (const n of [1, 2, 3]) keys.push(`strength.${id}.${n}`);
    for (const n of [2, 3]) keys.push(`shadow.${id}.${n}`);
    for (const n of [2, 3, 4, 5]) keys.push(`reflection.${id}.${n}`);
  }
  for (const s of SYMBOL_IDS) keys.push(`symbol.${s}`);
  return keys;
}

/** Symbols the profiles use (all of SYMBOL_IDS appear in RESONANCE, checked by a unit test). */
export const usedSymbols = (): Set<SymbolId> => new Set(ARCHETYPE_ORDER.flatMap((id) => RESONANCE[id].symbols));
