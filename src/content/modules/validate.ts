/**
 * Content gate per module (CONTENT_MASTERPLAN §2, §7, §8): completeness DE/EN, no unknown keys,
 * lengths, sentence counts, questions, forbidden phrasing (global + per module), placeholders and
 * varied openings. Pure; used by `npm run validate:content` and the unit tests.
 */
import { journeyTextKeys } from '../../domain/journey.ts';
import { REVIEW_BLOCK_VARS, reviewTextKeys } from '../../domain/review.ts';
import { spreadTextKeys } from '../../domain/spreads.ts';
import { archetypeKeys } from './archetype-keys.ts';
import { cardsDeepKeys } from './cards-deep-keys.ts';
import { chapterKeys } from './chapter-keys.ts';
import { numbersKeys } from './numbers-keys.ts';
import { angelsKeys } from './angels-keys.ts';
import { ARCHETYPE_ORDER, LOCALES, type Locale } from '../../domain/types.ts';
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
  /** Placeholders the text must contain, e.g. ['theme'] for `{theme}` (all others stay errors). */
  vars?: readonly string[];
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

/** Rituals and suggestions name only what everyone has (§2, §7 "Rituale"): no fire, smoke, substances, purchases. */
export const FORBIDDEN_RITUAL: readonly RegExp[] = [
  /Kerze/i,
  /Feuer/i,
  /Räucher/i,
  /Salbei/i,
  /Kristall/i,
  /\bFasten\b/,
  /candle/i,
  /\bfire\b/i,
  /incense/i,
  /\bcrystals?\b/i,
  /\bfasting\b/i,
];

/**
 * The German archetype names are titles without article (D-08). "Als Suchende gehst du …" would
 * address the reader as feminine singular, so the texts never use that form (S-32).
 */
export const FORBIDDEN_ADDRESS: readonly RegExp[] = [/\b[Aa]ls (?:Suchende|Hütende|Sehende|Verwandelnde|Wandernde|Schaffende|Weise|Erneuernde)\b/];

/** A lens is one or two plain sentences, not two clauses held together by a semicolon (S-33). */
export const FORBIDDEN_SEMICOLON: readonly RegExp[] = [/;/];

/**
 * Card depth and spread roles never promise a future (PRODUCT_SYSTEMS F: no position promises
 * what will come). "Possibility" speaks of what could open, never of what will.
 */
export const FORBIDDEN_FUTURE: readonly RegExp[] = [
  /\bwirst\b/i,
  /\bbald\b/i,
  /\bZukunft\b/i,
  /\bdemnächst\b/i,
  /\byou will\b/i,
  /\byou['’]ll\b/i,
  /\b(?:it|this|that|something|things) will\b/i,
  /\bsoon\b/i,
  /\bfuture\b/i,
];

/**
 * Spread frames (PRODUCT_SYSTEMS F): no position promises an outcome, and none claims to know
 * what another person thinks, feels or wants (the connection spread looks at one side only).
 */
export const FORBIDDEN_SPREAD: readonly RegExp[] = [
  /\b(?:Ergebnis|Ausgang|Ausblick)\b/,
  /\b(?:outcome|result)s?\b/i,
  /\b(?:er|sie) (?:denkt|fühlt|empfindet|will|wünscht)\b/i,
  /\b(?:denkt|fühlt|empfindet) (?:er|sie|die andere Person)\b/i,
  /\b(?:he|she|they|the other person) (?:thinks?|feels?|wants?)\b/i,
  /\bwhat (?:he|she|they) (?:thinks?|feels?|wants?)\b/i,
];

/**
 * Angel numbers (CONTENT_MASTERPLAN §7, PRODUCT_SYSTEMS H): a traditional meaning, never a message
 * from someone, never a statement about another person, never a promise.
 */
export const FORBIDDEN_ANGEL: readonly RegExp[] = [
  /Engel (?:sagen|sagt|wollen|möchten|schicken)/i,
  /Zeichen, dass (?:er|sie)\b/i,
  /bedeutet (?:sicher|bestimmt|garantiert)/i,
  /Zwillingsflamme/i,
  /angels? (?:tells?|says?|wants?|sends?)\b/i,
  /sign that (?:he|she|they)\b/i,
  /(?:certainly|surely|definitely) means/i,
  /twin flame/i,
];

const CARD = 'major-\\d{2}-[a-z-]+';
const deep = (prefix: string) => new RegExp(`^${prefix}\\.${CARD}$`);
const num = (part: string) => new RegExp(`^number\\.(?:[1-9]|11|22|33)\\.${part}$`);

export const MODULE_RULES: Partial<Record<ModuleId, ModuleRules>> = {
  identity: {
    required: (pack) => [
      ...pack.questions.flatMap((q) => [`question.${q.id}.prompt`, ...q.answers.map((a) => `question.${q.id}.${a.id}`)]),
      // V04.3: one lens per archetype × card (PRODUCT_SYSTEMS A3).
      ...ARCHETYPE_ORDER.flatMap((a) => pack.cards.map((c) => `lens.${a}.${c.id}`)),
    ],
    rules: [
      { pattern: /^question\.[a-z0-9-]+\.prompt$/, maxLen: 90 },
      { pattern: /^question\.[a-z0-9-]+\.[a-z0-9-]+$/, maxLen: 70 },
      // One or two plain sentences (S-33): a thought and an invitation, without a semicolon holding them together.
      { pattern: /^lens\.[a-z]+\.major-\d{2}-[a-z-]+$/, maxLen: 190, sentences: [1, 2], words: [12, 28], group: 'lens' },
    ],
    forbidden: [...FORBIDDEN_ADDRESS, ...FORBIDDEN_SEMICOLON],
  },
  archetypes: {
    required: () => archetypeKeys(),
    rules: [
      { pattern: /^description\.[a-z]+$/, maxLen: 1300, words: [120, 180], sentences: [6, 14] },
      { pattern: /^strength\.[a-z]+\.[1-3]$/, maxLen: 200, sentences: [1, 3], group: 'strength' },
      { pattern: /^shadow\.[a-z]+\.[2-3]$/, maxLen: 160, question: true },
      { pattern: /^growth\.[a-z]+\.2$/, maxLen: 160, sentences: [1, 1] },
      { pattern: /^reflection\.[a-z]+\.[2-5]$/, maxLen: 120, question: true, group: 'reflection' },
      { pattern: /^reveal\.[a-z]+$/, maxLen: 160, sentences: [1, 2] },
      { pattern: /^complement\.[a-z]+$/, maxLen: 200, sentences: [1, 2] },
      { pattern: /^symbol\.[a-z]+$/, maxLen: 30 },
    ],
    forbidden: [...FORBIDDEN_RITUAL, ...FORBIDDEN_ADDRESS],
  },
  journey: {
    required: () => [...journeyTextKeys(), ...reviewTextKeys()],
    rules: [
      { pattern: /^station\.(?:[1-9]|1\d|2[01])\.(?:encounter|return|wisdom)$/, maxLen: 220, sentences: [2, 3], group: 'station' },
      { pattern: /^path\.(?:outer|inner|higher)\.[1-3]$/, maxLen: 220, sentences: [2, 3] },
      { pattern: /^round\.(?:[1-3]|later)\.close$/, maxLen: 220, sentences: [2, 3] },
      { pattern: /^milestone\.(?:day\.\d+|week|month|jubilee|year)$/, maxLen: 220, sentences: [1, 3], group: 'milestone' },
      // V04.5 review building blocks: one group, so openings stay varied across all 40.
      { pattern: /^review\.theme\.\d$/, maxLen: 120, sentences: [1, 2], vars: REVIEW_BLOCK_VARS.theme, group: 'review' },
      { pattern: /^review\.recurring\.\d$/, maxLen: 120, sentences: [1, 2], vars: REVIEW_BLOCK_VARS.recurring, group: 'review' },
      { pattern: /^review\.notes\.\d$/, maxLen: 60, group: 'review' },
      { pattern: /^review\.(?:open\.(?:week|month)|balance\.(?:light|twilight|shadow|even)|quiet|close)\.\d$/, maxLen: 160, sentences: [1, 2], group: 'review' },
    ],
    forbidden: [...FORBIDDEN_PRESSURE, ...FORBIDDEN_ADDRESS],
  },
  chapters: {
    required: () => chapterKeys(),
    rules: [{ pattern: /^chapter\.[a-z]+\.(?:[1-4]|second-voice)$/, maxLen: 1900, words: [150, 250], sentences: [7, 22], group: 'chapter' }],
    forbidden: [...FORBIDDEN_PRESSURE, ...FORBIDDEN_RITUAL, ...FORBIDDEN_ADDRESS],
  },
  // V05.1 card depth (CONTENT_MASTERPLAN §3): lengths and sentence counts from the table there.
  'cards-deep': {
    required: () => cardsDeepKeys(),
    rules: [
      { pattern: deep('light'), maxLen: 320, sentences: [2, 3], group: 'light' },
      // Shadow as a question (§2): an observation that ends in a question, never a verdict.
      { pattern: deep('shadow'), maxLen: 320, sentences: [2, 3], question: true, group: 'shadow' },
      { pattern: deep('keyword'), maxLen: 260, sentences: [2, 2], group: 'keyword' },
      { pattern: deep('symbols'), maxLen: 340, sentences: [2, 3], group: 'symbols' },
      // One group for all 110 role texts, so openings stay varied across roles.
      { pattern: deep('role\\.(?:light|shadow|root|possibility|bridge)'), maxLen: 200, sentences: [1, 2], group: 'role' },
      { pattern: deep('study\\.[12]'), maxLen: 320, sentences: [2, 3], question: true, group: 'study' },
      { pattern: deep('question'), maxLen: 140, sentences: [1, 1], question: true, group: 'question' },
      { pattern: deep('reflection\\.[23]'), maxLen: 120, sentences: [1, 1], question: true, group: 'reflection' },
      { pattern: deep('ritual\\.2'), maxLen: 220, sentences: [1, 2], group: 'ritual' },
    ],
    forbidden: [...FORBIDDEN_RITUAL, ...FORBIDDEN_ADDRESS, ...FORBIDDEN_SEMICOLON, ...FORBIDDEN_FUTURE],
  },
  // V05.2 spread frames: names, intros, a label and a question per position (CONTENT_MASTERPLAN §1, §3).
  spreads: {
    required: () => spreadTextKeys(),
    rules: [
      { pattern: /^role\.(?:situation|challenge|impulse|light|shadow|root|possibility|bridge)\.label$/, maxLen: 24 },
      { pattern: /^spread\.[a-z0-9-]+\.name$/, maxLen: 32 },
      { pattern: /^spread\.[a-z0-9-]+\.tagline$/, maxLen: 120, sentences: [1, 1] },
      { pattern: /^spread\.[a-z0-9-]+\.intro$/, maxLen: 260, sentences: [2, 3] },
      { pattern: /^pos\.[a-z0-9-]+\.[1-7]\.label$/, maxLen: 28 },
      { pattern: /^pos\.[a-z0-9-]+\.[1-7]\.question$/, maxLen: 80, sentences: [1, 1], question: true, group: 'question' },
      { pattern: /^review\.(?:week|month)\.past$/, maxLen: 32 },
    ],
    forbidden: [...FORBIDDEN_ADDRESS, ...FORBIDDEN_SEMICOLON, ...FORBIDDEN_FUTURE, ...FORBIDDEN_SPREAD],
  },
  // V06.2 numerology (CONTENT_MASTERPLAN §3, §5): life path 100–150 words, year about 80, month about 40, day one sentence.
  numbers: {
    required: () => numbersKeys(),
    rules: [
      { pattern: num('keywords'), maxLen: 60 },
      { pattern: num('essence'), maxLen: 220, sentences: [1, 2] },
      { pattern: num('life'), maxLen: 1100, words: [100, 150], sentences: [6, 10] },
      { pattern: /^number\.(?:[1-9]|11|22)\.birthday$/, maxLen: 200, sentences: [1, 2] },
      { pattern: num('strength\\.[1-3]'), maxLen: 140, sentences: [1, 1], group: 'strength' },
      // Challenges as a question (§2 "Schatten als Frage"), never a verdict.
      { pattern: num('challenge\\.[1-3]'), maxLen: 140, sentences: [1, 1], question: true, group: 'challenge' },
      { pattern: num('reflection\\.[12]'), maxLen: 120, sentences: [1, 1], question: true, group: 'reflection' },
      { pattern: /^year\.[1-9]$/, maxLen: 650, words: [60, 100], sentences: [5, 8] },
      { pattern: /^month\.[1-9]$/, maxLen: 300, words: [25, 55], sentences: [2, 4] },
      { pattern: /^day\.[1-9]\.[1-3]$/, maxLen: 110, sentences: [1, 1], group: 'day' },
      { pattern: /^path\.(?:life|birthday|year|month|day|method)$/, maxLen: 320, sentences: [1, 3] },
    ],
    forbidden: [...FORBIDDEN_RITUAL, ...FORBIDDEN_ADDRESS, ...FORBIDDEN_SEMICOLON, ...FORBIDDEN_FUTURE],
  },
  // V06.3 angel numbers (CONTENT_MASTERPLAN §3, §6): meaning 50–80 words, the rest short.
  angels: {
    required: () => angelsKeys(),
    rules: [
      { pattern: /^seq\.\d{3,4}\.title$/, maxLen: 40 },
      { pattern: /^seq\.\d{3,4}\.meaning$/, maxLen: 600, words: [50, 80], sentences: [3, 6], group: 'meaning' },
      { pattern: /^seq\.\d{3,4}\.light$/, maxLen: 140, sentences: [1, 1], group: 'light' },
      { pattern: /^seq\.\d{3,4}\.shadow$/, maxLen: 140, sentences: [1, 1], question: true, group: 'shadow' },
      { pattern: /^seq\.\d{3,4}\.reflection$/, maxLen: 120, sentences: [1, 1], question: true, group: 'reflection' },
      { pattern: /^seq\.\d{3,4}\.ritual$/, maxLen: 200, sentences: [1, 2], group: 'ritual' },
      { pattern: /^digit\.\d\.keyword$/, maxLen: 24 },
      { pattern: /^digit\.\d\.meaning$/, maxLen: 120, sentences: [1, 1] },
      { pattern: /^pattern\.(?:single|repeat|stair|mirror|alternating|doubles|frame|mixed)$/, maxLen: 200, sentences: [1, 2] },
    ],
    forbidden: [...FORBIDDEN_ANGEL, ...FORBIDDEN_RITUAL, ...FORBIDDEN_ADDRESS, ...FORBIDDEN_SEMICOLON, ...FORBIDDEN_FUTURE],
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
      // Declared placeholders are filled at runtime; any other {x} stays a placeholder error.
      const allowed = rule.vars ?? [];
      const unfilled = allowed.length ? v.replace(/\{(\w+)\}/g, (m, k: string) => (allowed.includes(k) ? '' : m)) : v;
      if (PLACEHOLDER.test(unfilled)) errors.push(`${where}: placeholder text`);
      for (const k of allowed) if (!v.includes(`{${k}}`)) errors.push(`${where}: missing {${k}}`);
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
