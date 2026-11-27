/**
 * Structure of the `cards-deep` module (V05.1, CONTENT_MASTERPLAN §1 and §3, PRODUCT_SYSTEMS D):
 * fifteen texts per card. Authors write one object per card; `deepTable` turns it into the flat
 * key table every module uses, and `deepCard` reads it back for the card page.
 *
 * Keys: `light.<cardId>`, `shadow.<cardId>`, `keyword.<cardId>`, `symbols.<cardId>`,
 * `role.<role>.<cardId>` (R4–R8), `study.<1|2>.<cardId>`, `question.<cardId>`,
 * `reflection.<2|3>.<cardId>` (reflection 1 lives in core), `ritual.2.<cardId>` (ritual 1 in core).
 */
import { LENS_CARD_IDS } from './lens-keys.ts';
import type { TextTable } from './registry.ts';

/** The spread roles that are new in V05 (PRODUCT_SYSTEMS F: R4 light … R8 bridge). R1–R3 live in core. */
export const DEEP_ROLES = ['light', 'shadow', 'root', 'possibility', 'bridge'] as const;
export type DeepRole = (typeof DEEP_ROLES)[number];

export interface DeepCard {
  /** Level 2: what the card brings at its best (2–3 sentences). */
  light: string;
  /** Level 2: the card's shadow as an observation that ends in a question, never a verdict. */
  shadow: string;
  /** Level 2: the leading key word of the card (first of its three key words), two sentences. */
  keyword: string;
  /** Level 3: what this deck's painting shows and what it may suggest (2–3 sentences). */
  symbols: string;
  /** Level 3 and spreads: one or two sentences per role. */
  roles: Readonly<Record<DeepRole, string>>;
  /** Card study, part 1 (looking) and part 2 (own life): a short impulse that ends in a question. */
  study: readonly [string, string];
  /** Level 4: the personal question (first person, like the card's reflection). */
  question: string;
  /** Reflections 2 and 3 (first person), rotating on "Heute" with reflection 1 from core (A4). */
  reflections: readonly [string, string];
  /** Ritual 2: rotates on "Heute" with ritual 1 from core (A4) and is the second ritual of level 4. */
  ritual: string;
}

/** All cards in deck order (the lens list is the deck order of core; a unit test keeps both equal). */
export const DEEP_DECK_ORDER: readonly string[] = LENS_CARD_IDS;

/**
 * Cards whose deep texts are written. The texts come in three groups (S-29): 0–VII (the Fool and
 * the outer path), VIII–XIV (inner path), XV–XXI (higher path). The content gate requires exactly
 * these cards, so each group passes the gate on its own.
 */
export const DEEP_CARD_IDS: readonly string[] = DEEP_DECK_ORDER;

export function deepKeys(cardId: string): string[] {
  return [
    `light.${cardId}`,
    `shadow.${cardId}`,
    `keyword.${cardId}`,
    `symbols.${cardId}`,
    ...DEEP_ROLES.map((r) => `role.${r}.${cardId}`),
    `study.1.${cardId}`,
    `study.2.${cardId}`,
    `question.${cardId}`,
    `reflection.2.${cardId}`,
    `reflection.3.${cardId}`,
    `ritual.2.${cardId}`,
  ];
}

export function cardsDeepKeys(): string[] {
  return DEEP_CARD_IDS.flatMap(deepKeys);
}

/** Authoring object → flat key table. */
export function deepTable(cards: Readonly<Record<string, DeepCard>>): TextTable {
  const out: Record<string, string> = {};
  for (const [id, c] of Object.entries(cards)) {
    out[`light.${id}`] = c.light;
    out[`shadow.${id}`] = c.shadow;
    out[`keyword.${id}`] = c.keyword;
    out[`symbols.${id}`] = c.symbols;
    for (const r of DEEP_ROLES) out[`role.${r}.${id}`] = c.roles[r];
    out[`study.1.${id}`] = c.study[0];
    out[`study.2.${id}`] = c.study[1];
    out[`question.${id}`] = c.question;
    out[`reflection.2.${id}`] = c.reflections[0];
    out[`reflection.3.${id}`] = c.reflections[1];
    out[`ritual.2.${id}`] = c.ritual;
  }
  return out;
}

/** Flat key table → the texts of one card, or null when the module has none for it (yet). */
export function deepCard(table: TextTable | undefined, cardId: string): DeepCard | null {
  if (!table || table[`light.${cardId}`] === undefined) return null;
  const t = (k: string) => table[k] ?? k;
  return {
    light: t(`light.${cardId}`),
    shadow: t(`shadow.${cardId}`),
    keyword: t(`keyword.${cardId}`),
    symbols: t(`symbols.${cardId}`),
    roles: Object.fromEntries(DEEP_ROLES.map((r) => [r, t(`role.${r}.${cardId}`)])) as Record<DeepRole, string>,
    study: [t(`study.1.${cardId}`), t(`study.2.${cardId}`)],
    question: t(`question.${cardId}`),
    reflections: [t(`reflection.2.${cardId}`), t(`reflection.3.${cardId}`)],
    ritual: t(`ritual.2.${cardId}`),
  };
}
