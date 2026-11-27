/**
 * Content gate per module (CONTENT_MASTERPLAN §2, §7, §8): completeness DE/EN, no unknown keys,
 * lengths, sentence counts, questions, forbidden phrasing (global + per module), placeholders and
 * varied openings. Pure; used by `npm run validate:content` and the unit tests.
 */
import { journeyTextKeys } from '../../domain/journey.ts';
import { LOCALES, type Locale } from '../../domain/types.ts';
import { FORBIDDEN, PLACEHOLDER, sentences } from '../validate.ts';
import type { ContentPack } from '../schema.ts';
import type { ModuleId, TextTable } from './registry.ts';

export interface KeyRule {
  pattern: RegExp;
  maxLen?: number;
  /** Allowed sentence count (warning outside). */
  sentences?: [number, number];
  /** Allowed word count (warning outside). */
  words?: [number, number];
  /** Must end with a question mark (error otherwise). */
  question?: boolean;
  /** Texts of one group must not share their first three words too often (§2 "Abwechslung"). */
  group?: string;
}

export interface ModuleRules {
  /** Keys that must exist in every locale, derived from the structure (core, domain). */
  required(pack: ContentPack): string[];
  /** Every key must match one rule (unknown keys are errors: typos would silently go unused). */
  rules: readonly KeyRule[];
  /** Forbidden phrasing in this module, in addition to the global list. */
  forbidden?: readonly RegExp[];
}

/** Phrases forbidden in every module (CONTENT_MASTERPLAN §7 "alle"), on top of the core list. */
export const FORBIDDEN_ALL: readonly RegExp[] = [
  ...FORBIDDEN,
  /wird passieren/i,
  /mit Sicherheit/i,
  /das Universum (will|sagt)/i,
  /dein Schicksal ist/i,
  /will happen/i,
  /for certain/i,
  /the universe (wants|tells)/i,
  /your fate is/i,
];

/** Pressure words for journey and milestones (§7 "journey"). */
export const FORBIDDEN_PRESSURE: readonly RegExp[] = [
  /verloren/i,
  /verpasst/i,
  /\bSerie\b/,
  /streak/i,
  /nur noch/i,
  /beeil/i,
  /letzte Chance/i,
  /vergiss nicht/i,
  /\bmissed\b/i,
  /\bhurry\b/i,
  /last chance/i,
  /don[’']t forget/i,
  /only \d+ (more|left)/i,
  // No countdown to the next station or milestone (PROGRESSION_DESIGN §3.4).
  /\bnoch \d+\b/i,
  /\bin \d+ Tagen\b/i,
  /\bin \d+ days\b/i,
  /\b\d+ (more )?days? (left|to go)\b/i,
];

export const MODULE_RULES: Partial<Record<ModuleId, ModuleRules>> = {
  identity: {
    required: (pack) => pack.questions.flatMap((q) => [`question.${q.id}.prompt`, ...q.answers.map((a) => `question.${q.id}.${a.id}`)]),
    rules: [
      { pattern: /^question\.[a-z0-9-]+\.prompt$/, maxLen: 90 },
      { pattern: /^question\.[a-z0-9-]+\.[a-z0-9-]+$/, maxLen: 70 },
    ],
  },
  journey: {
    required: () => journeyTextKeys(),
    rules: [
      { pattern: /^station\.(?:[1-9]|1\d|2[01])\.(?:encounter|return|wisdom)$/, maxLen: 220, sentences: [2, 3], group: 'station' },
      { pattern: /^path\.(?:outer|inner|higher)\.[1-3]$/, maxLen: 220, sentences: [2, 3] },
      { pattern: /^round\.(?:[1-3]|later)\.close$/, maxLen: 220, sentences: [2, 3] },
      { pattern: /^milestone\.(?:day\.\d+|week|month|jubilee|year)$/, maxLen: 220, sentences: [1, 3], group: 'milestone' },
    ],
    forbidden: FORBIDDEN_PRESSURE,
  },
};

export interface ModuleReport {
  id: ModuleId;
  keys: number;
  errors: string[];
  warnings: string[];
}

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const opening = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .join(' ');

export function validateModule(id: ModuleId, rules: ModuleRules | undefined, pack: ContentPack, tables: Readonly<Record<Locale, TextTable | undefined>>): ModuleReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!rules) return { id, keys: 0, errors: [`${id}: no validation rules`], warnings };
  const required = new Set(rules.required(pack));
  if (required.size === 0) errors.push(`${id}: the structure requires no keys (empty module)`);
  const forbidden = [...FORBIDDEN_ALL, ...(rules.forbidden ?? [])];
  const allKeys = new Set<string>();
  for (const l of LOCALES) for (const k of Object.keys(tables[l] ?? {})) allKeys.add(k);

  for (const l of LOCALES) {
    const table = tables[l];
    if (!table) {
      errors.push(`${id}/${l}: missing locale`);
      continue;
    }
    for (const k of required) if (!(k in table)) errors.push(`${id}/${l}: missing ${k}`);
    for (const k of allKeys) if (!(k in table) && !required.has(k)) errors.push(`${id}/${l}: missing ${k} (exists in the other locale)`);
    const groups = new Map<string, Map<string, number>>();
    const groupSize = new Map<string, number>();
    for (const [k, v] of Object.entries(table)) {
      const where = `${id}/${l}: ${k}`;
      const rule = rules.rules.find((r) => r.pattern.test(k));
      if (!rule) {
        errors.push(`${where}: unknown key`);
        continue;
      }
      if (typeof v !== 'string' || v.trim().length === 0) {
        errors.push(`${where}: empty`);
        continue;
      }
      if (v !== v.trim()) warnings.push(`${where}: leading/trailing whitespace`);
      if (PLACEHOLDER.test(v)) errors.push(`${where}: placeholder text`);
      for (const f of forbidden) if (f.test(v)) errors.push(`${where}: forbidden phrasing ${f}`);
      if (rule.maxLen && v.length > rule.maxLen) warnings.push(`${where}: ${v.length} > ${rule.maxLen} chars`);
      if (rule.sentences) {
        const n = sentences(v);
        if (n < rule.sentences[0] || n > rule.sentences[1]) warnings.push(`${where}: ${n} sentences (expected ${rule.sentences.join('–')})`);
      }
      if (rule.words) {
        const n = words(v);
        if (n < rule.words[0] || n > rule.words[1]) warnings.push(`${where}: ${n} words (expected ${rule.words.join('–')})`);
      }
      if (rule.question && !/\?\s*$/.test(v)) errors.push(`${where}: must be a question`);
      if (rule.group) {
        const g = groups.get(rule.group) ?? new Map<string, number>();
        const o = opening(v);
        g.set(o, (g.get(o) ?? 0) + 1);
        groups.set(rule.group, g);
        groupSize.set(rule.group, (groupSize.get(rule.group) ?? 0) + 1);
      }
    }
    for (const [group, openings] of groups) {
      const size = groupSize.get(group) ?? 0;
      if (size < 20) continue; // too few texts for a percentage rule
      const limit = Math.max(2, Math.floor(size * 0.05));
      for (const [o, n] of openings) if (n > limit) errors.push(`${id}/${l}: ${n} of ${size} texts in "${group}" start with "${o}" (max ${limit})`);
    }
  }
  return { id, keys: allKeys.size, errors, warnings };
}
