import { isValidDateKey } from '../../domain/clock.ts';
import { ALL_THEME_IDS, ARCHETYPE_ORDER, LOCALES, type DailyRecord, type Profile, type Reading, type ReadingDraft, type Settings } from '../../domain/types.ts';

/** Minimal structural guards. Invalid records are skipped and reported, never auto-deleted. */

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isTheme = (v: unknown) => isStr(v) && (ALL_THEME_IDS as readonly string[]).includes(v);
const isLocale = (v: unknown) => isStr(v) && (LOCALES as readonly string[]).includes(v);
const isArchetypeOrNull = (v: unknown) => v === null || (isStr(v) && (ARCHETYPE_ORDER as readonly string[]).includes(v));
const isTriple = (v: unknown) => Array.isArray(v) && v.length === 3 && v.every(isStr) && new Set(v).size === 3;

export function isSettings(v: unknown): v is Settings {
  return isObj(v) && isLocale(v.locale) && ['system', 'reduced', 'full'].includes(v.motion as string) && typeof v.onboardingDone === 'boolean';
}

export function isProfile(v: unknown): v is Profile {
  return (
    isObj(v) &&
    isObj(v.answers) &&
    Object.values(v.answers).every(isStr) &&
    isTheme(v.themeId) &&
    isArchetypeOrNull(v.archetypeId) &&
    (v.archetypeSource === undefined || v.archetypeSource === 'questions' || v.archetypeSource === 'manual') &&
    typeof v.profileVersion === 'number' &&
    isStr(v.updatedAt)
  );
}

export function isDailyRecord(v: unknown): v is DailyRecord {
  return (
    isObj(v) &&
    isStr(v.dateKey) &&
    isValidDateKey(v.dateKey) &&
    isStr(v.cardId) &&
    isStr(v.deckId) &&
    isTheme(v.themeId) &&
    isArchetypeOrNull(v.archetypeId) &&
    isLocale(v.locale) &&
    isStr(v.contentVersion) &&
    isObj(v.content) &&
    isStr(v.content.message) &&
    isStr(v.content.cardTitle) &&
    isStr(v.revealedAt) &&
    isStr(v.note)
  );
}

export function isReading(v: unknown): v is Reading {
  return (
    isObj(v) &&
    isStr(v.id) &&
    isStr(v.deckId) &&
    isTheme(v.themeId) &&
    isTriple(v.cardIds) &&
    isLocale(v.locale) &&
    isStr(v.contentVersion) &&
    isObj(v.content) &&
    Array.isArray(v.content.positions) &&
    v.content.positions.length === 3 &&
    isStr(v.createdAt) &&
    isStr(v.note)
  );
}

export function isDraft(v: unknown): v is ReadingDraft {
  return (
    isObj(v) &&
    isStr(v.id) &&
    isStr(v.deckId) &&
    isTheme(v.themeId) &&
    isTriple(v.cardIds) &&
    Array.isArray(v.revealed) &&
    v.revealed.length === 3 &&
    v.revealed.every((b) => typeof b === 'boolean') &&
    isStr(v.createdAt)
  );
}
