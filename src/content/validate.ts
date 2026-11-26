import { cardKeywords } from './keywords.ts';
import { ALL_THEME_IDS, ARCHETYPE_ORDER, LOCALES, POSITIONS, type ThemeId } from '../domain/types.ts';
import type { ContentPack, Localized } from './schema.ts';

/**
 * Pure content checks shared by the unit tests and `npm run validate:content`.
 * Stage 'g1' = the vertical slice (blocking errors only for what G1 promises).
 * Stage 'p0' = the full first product scope (22 cards x 6 themes); reported, not faked.
 */
export type ContentStage = 'g1' | 'p0';

export interface ContentReport {
  stage: ContentStage;
  errors: string[];
  warnings: string[];
  summary: {
    version: string;
    cards: number;
    targetCards: number;
    themes: number;
    targetThemes: number;
    archetypes: number;
    questions: number;
    /** Missing theme texts per card for the full P0 scope. */
    missingP0ThemeTexts: number;
  };
}

/** Words that would turn a reflection into a promise, a diagnosis or advice. */
const FORBIDDEN: readonly RegExp[] = [
  /garantiert/i,
  /schicksal/i,
  /vorherbestimmt/i,
  /diagnos/i,
  /therapie/i,
  /krankheit/i,
  /heilung/i,
  /investier/i,
  /aktien/i,
  /guarantee/i,
  /destiny/i,
  /\bfated?\b/i,
  /therapy/i,
  /disease/i,
  /\bcure\b/i,
  /\binvest/i,
  /\bstocks?\b/i,
  /will definitely/i,
  // Claims about what other people think or feel.
  /liebt dich/i,
  /denkt an dich/i,
  /loves you/i,
  /thinks (of|about) you/i,
];

const PLACEHOLDER = /\b(TODO|TBD|lorem|ipsum|xxx)\b|\{\w+\}/i;

function sentences(text: string): number {
  return text.split(/[.!?…]+(?:\s|$)/).filter((s) => s.trim().length > 0).length;
}

export function validateContent(pack: ContentPack, stage: ContentStage = 'g1'): ContentReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  const checkText = (where: string, value: Localized | undefined, opts: { maxLen?: number; sentences?: [number, number] } = {}) => {
    if (!value) {
      errors.push(`${where}: missing`);
      return;
    }
    for (const locale of LOCALES) {
      const text = value[locale];
      if (typeof text !== 'string' || text.trim().length === 0) {
        errors.push(`${where}.${locale}: empty`);
        continue;
      }
      if (text !== text.trim()) warnings.push(`${where}.${locale}: leading/trailing whitespace`);
      if (PLACEHOLDER.test(text)) errors.push(`${where}.${locale}: placeholder text`);
      for (const rule of FORBIDDEN) if (rule.test(text)) errors.push(`${where}.${locale}: forbidden phrasing ${rule}`);
      if (opts.maxLen && text.length > opts.maxLen) warnings.push(`${where}.${locale}: ${text.length} > ${opts.maxLen} chars`);
      if (opts.sentences) {
        const n = sentences(text);
        const [min, max] = opts.sentences;
        if (n < min || n > max) warnings.push(`${where}.${locale}: ${n} sentences (expected ${min}–${max})`);
      }
    }
  };

  // ---- themes
  const themeIds = new Set(pack.themes.map((t) => t.id));
  if (themeIds.size !== pack.themes.length) errors.push('themes: duplicate ids');
  for (const id of pack.availableThemes) if (!themeIds.has(id)) errors.push(`availableThemes: ${id} has no ThemeContent`);
  if (!pack.availableThemes.includes(pack.defaultTheme)) errors.push(`defaultTheme ${pack.defaultTheme} is not available`);
  for (const t of pack.themes) {
    checkText(`theme ${t.id}.label`, t.label, { maxLen: 28 });
    checkText(`theme ${t.id}.description`, t.description, { maxLen: 80 });
    checkText(`theme ${t.id}.readingIntro`, t.readingIntro, { maxLen: 160 });
  }
  for (const p of POSITIONS) checkText(`positionLabel ${p}`, pack.positionLabels[p], { maxLen: 18 });

  // ---- cards
  const ids = new Set<string>();
  const orders = new Set<number>();
  const assets = new Set<string>();
  let missingP0 = 0;
  for (const c of pack.cards) {
    const w = `card ${c.id}`;
    if (ids.has(c.id)) errors.push(`${w}: duplicate id`);
    ids.add(c.id);
    if (orders.has(c.order)) errors.push(`${w}: duplicate order ${c.order}`);
    orders.add(c.order);
    if (assets.has(c.assetId)) errors.push(`${w}: duplicate assetId ${c.assetId}`);
    assets.add(c.assetId);
    if (!Number.isInteger(c.order) || c.order < 0 || c.order > 21) errors.push(`${w}: order ${c.order} outside 0–21`);
    if (c.deckId !== pack.deckId) errors.push(`${w}: deckId ${c.deckId} != ${pack.deckId}`);
    if (!['light', 'twilight', 'shadow'].includes(c.tone)) errors.push(`${w}: unknown tone`);
    checkText(`${w}.title`, c.title, { maxLen: 24 });
    checkText(`${w}.essence`, c.essence, { maxLen: 90 });
    checkText(`${w}.keywords`, cardKeywords(c), { maxLen: 48 });
    checkText(`${w}.reflection`, c.reflection, { maxLen: 110 });
    checkText(`${w}.ritual`, c.ritual, { maxLen: 200 });
    for (const p of POSITIONS) checkText(`${w}.positions.${p}`, c.positions[p], { maxLen: 120 });
    for (const theme of pack.availableThemes) checkText(`${w}.themes.${theme}`, c.themes[theme], { sentences: [2, 4], maxLen: 340 });
    for (const theme of ALL_THEME_IDS as readonly ThemeId[]) if (!c.themes[theme]) missingP0++;
  }
  if (pack.cards.length < 3) errors.push(`deck: ${pack.cards.length} cards, a three-card reading needs at least 3`);
  const tones = new Set(pack.cards.map((c) => c.tone));
  if (tones.size < Math.min(3, pack.cards.length)) warnings.push('deck: fewer than three different tones');

  // ---- archetypes
  const archetypeIds = pack.archetypes.map((a) => a.id);
  if (archetypeIds.length !== ARCHETYPE_ORDER.length || ARCHETYPE_ORDER.some((id) => !archetypeIds.includes(id))) {
    errors.push(`archetypes: expected exactly ${ARCHETYPE_ORDER.join(', ')}`);
  }
  for (const a of pack.archetypes) {
    const w = `archetype ${a.id}`;
    checkText(`${w}.name`, a.name, { maxLen: 22 });
    checkText(`${w}.essence`, a.essence, { maxLen: 120 });
    checkText(`${w}.strength`, a.strength, { maxLen: 120 });
    checkText(`${w}.shadow`, a.shadow, { maxLen: 120 });
    checkText(`${w}.growth`, a.growth, { maxLen: 120 });
    checkText(`${w}.reflection`, a.reflection, { maxLen: 110 });
    checkText(`${w}.lens`, a.lens, { maxLen: 140 });
    for (const l of LOCALES) if (!/\?\s*$/.test(a.shadow[l] ?? '')) errors.push(`${w}.shadow.${l}: must be an open question`);
  }

  // ---- questionnaire balance: every archetype is primary twice and secondary twice
  const primary = Object.fromEntries(ARCHETYPE_ORDER.map((id) => [id, 0])) as Record<string, number>;
  const secondary = { ...primary };
  const qIds = new Set<string>();
  const aIds = new Set<string>();
  for (const q of pack.questions) {
    if (qIds.has(q.id)) errors.push(`question ${q.id}: duplicate id`);
    qIds.add(q.id);
    checkText(`question ${q.id}.prompt`, q.prompt, { maxLen: 90 });
    if (q.answers.length !== 4) errors.push(`question ${q.id}: ${q.answers.length} answers (expected 4)`);
    for (const a of q.answers) {
      if (aIds.has(a.id)) errors.push(`answer ${a.id}: duplicate id`);
      aIds.add(a.id);
      if (a.primary === a.secondary) errors.push(`answer ${a.id}: primary equals secondary`);
      primary[a.primary] = (primary[a.primary] ?? 0) + 1;
      secondary[a.secondary] = (secondary[a.secondary] ?? 0) + 1;
      checkText(`answer ${a.id}.label`, a.label, { maxLen: 70 });
    }
  }
  if (pack.questions.length !== 4) errors.push(`questions: ${pack.questions.length} (expected 4)`);
  for (const id of ARCHETYPE_ORDER) {
    if (primary[id] !== 2) errors.push(`balance: ${id} is primary ${primary[id]}× (expected 2)`);
    if (secondary[id] !== 2) errors.push(`balance: ${id} is secondary ${secondary[id]}× (expected 2)`);
  }

  // ---- P0 scope: reported as errors only when explicitly validating the P0 stage
  if (stage === 'p0') {
    if (pack.cards.length !== pack.targetDeckSize) errors.push(`P0: ${pack.cards.length}/${pack.targetDeckSize} cards`);
    if (pack.availableThemes.length !== ALL_THEME_IDS.length) errors.push(`P0: ${pack.availableThemes.length}/${ALL_THEME_IDS.length} themes`);
    if (missingP0 > 0) errors.push(`P0: ${missingP0} card×theme texts missing`);
  }

  return {
    stage,
    errors,
    warnings,
    summary: {
      version: pack.version,
      cards: pack.cards.length,
      targetCards: pack.targetDeckSize,
      themes: pack.availableThemes.length,
      targetThemes: ALL_THEME_IDS.length,
      archetypes: pack.archetypes.length,
      questions: pack.questions.length,
      missingP0ThemeTexts: missingP0,
    },
  };
}
