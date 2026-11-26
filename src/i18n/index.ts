import type { Locale } from '../domain/types.ts';
import { de, type Messages } from './de.ts';
import { en } from './en.ts';

export const MESSAGES: Record<Locale, Messages> = { de, en };
export type { Messages };

/** System language as the default; German for any de-* locale, English otherwise. */
export function detectLocale(languages: readonly string[] = navigator.languages ?? [navigator.language]): Locale {
  for (const lang of languages) {
    const l = lang.toLowerCase();
    if (l.startsWith('de')) return 'de';
    if (l.startsWith('en')) return 'en';
  }
  return 'en';
}

/** Replace {name} placeholders. Unknown placeholders stay visible so tests catch them. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

export function formatLongDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
}

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

const ROMAN: readonly [number, string][] = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

/** Card numerals are rendered by the UI (never baked into art). 0 is shown as "0". */
export function toRoman(n: number): string {
  if (n === 0) return '0';
  let out = '';
  let rest = n;
  for (const [v, s] of ROMAN) {
    while (rest >= v) {
      out += s;
      rest -= v;
    }
  }
  return out;
}
