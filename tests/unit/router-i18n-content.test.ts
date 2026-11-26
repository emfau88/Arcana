import { describe, expect, it } from 'vitest';
import { backTarget, parsePath } from '../../src/app/router.ts';
import { CONTENT } from '../../src/content/index.ts';
import { validateContent } from '../../src/content/validate.ts';
import { de } from '../../src/i18n/de.ts';
import { en } from '../../src/i18n/en.ts';
import { detectLocale, fmt, toRoman } from '../../src/i18n/index.ts';

describe('router', () => {
  it('parses every route', () => {
    expect(parsePath('#/').route).toEqual({ name: 'today' });
    expect(parsePath('').route).toEqual({ name: 'today' });
    expect(parsePath('#/welcome').route).toEqual({ name: 'welcome' });
    expect(parsePath('#/onboarding/3').route).toEqual({ name: 'onboarding', step: 3 });
    expect(parsePath('#/onboarding/0').route.name).toBe('notfound');
    expect(parsePath('#/grimoire').route).toEqual({ name: 'grimoire', view: 'collection' });
    expect(parsePath('#/grimoire/history').route).toEqual({ name: 'grimoire', view: 'history' });
    expect(parsePath('#/grimoire/card/major-19-sun').route).toEqual({ name: 'card', id: 'major-19-sun' });
    expect(parsePath('#/grimoire/day/2026-11-26?from=/today').route).toEqual({ name: 'day', dateKey: '2026-11-26' });
    expect(parsePath('#/grimoire/reading/abc').route).toEqual({ name: 'reading', id: 'abc' });
    expect(parsePath('#/nope').route.name).toBe('notfound');
  });

  it('defines back for every route (Android back and in-app back share it)', () => {
    const back = (h: string) => backTarget(parsePath(h));
    expect(back('#/today')).toBe('exit');
    expect(back('#/welcome')).toBe('exit');
    expect(back('#/onboarding/1')).toBe('/welcome');
    expect(back('#/onboarding/4')).toBe('/onboarding/3');
    expect(back('#/oracle')).toBe('/today');
    expect(back('#/profile')).toBe('/today');
    expect(back('#/grimoire')).toBe('/today');
    expect(back('#/grimoire/history')).toBe('/grimoire');
    expect(back('#/grimoire/card/x')).toBe('/grimoire');
    expect(back('#/grimoire/card/x?from=/today')).toBe('/today');
    expect(back('#/grimoire/reading/x')).toBe('/grimoire/history');
    expect(back('#/grimoire/day/2026-11-26?from=/grimoire/history')).toBe('/grimoire/history');
  });

  it('ignores untrusted "from" targets', () => {
    expect(backTarget(parsePath('#/grimoire/card/x?from=https://evil.example'))).toBe('/grimoire');
    expect(backTarget(parsePath('#/grimoire/reading/x?from=/welcome'))).toBe('/grimoire/history');
  });
});

type Tree = { [k: string]: string | Tree };
function keys(t: Tree, prefix = ''): string[] {
  return Object.entries(t).flatMap(([k, v]) => (typeof v === 'string' ? [`${prefix}${k}`] : keys(v, `${prefix}${k}.`)));
}
function values(t: Tree): [string, string][] {
  return keys(t).map((k) => [k, k.split('.').reduce<Tree | string>((acc, p) => (acc as Tree)[p]!, t) as string]);
}
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe('i18n', () => {
  it('has the same keys in German and English', () => {
    expect(keys(en as unknown as Tree).sort()).toEqual(keys(de as unknown as Tree).sort());
  });

  it('has no empty strings and matching placeholders', () => {
    const enMap = new Map(values(en as unknown as Tree));
    for (const [k, v] of values(de as unknown as Tree)) {
      expect(v.trim(), `de.${k}`).not.toBe('');
      expect(enMap.get(k)?.trim(), `en.${k}`).not.toBe('');
      expect(placeholders(enMap.get(k)!), k).toEqual(placeholders(v));
    }
  });

  it('detects the system language with an English fallback', () => {
    expect(detectLocale(['de-AT', 'en'])).toBe('de');
    expect(detectLocale(['en-US'])).toBe('en');
    expect(detectLocale(['fr-FR', 'de-DE'])).toBe('de');
    expect(detectLocale(['fr-FR'])).toBe('en');
    expect(detectLocale([])).toBe('en');
  });

  it('formats placeholders and keeps unknown ones visible', () => {
    expect(fmt('{n} von {target}', { n: 3, target: 22 })).toBe('3 von 22');
    expect(fmt('{missing}', {})).toBe('{missing}');
  });

  it('renders roman numerals for the major arcana', () => {
    const expected = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
    expected.forEach((r, i) => expect(toRoman(i)).toBe(r));
  });
});

describe('content', () => {
  it('passes the G1 content gate', () => {
    const r = validateContent(CONTENT, 'g1');
    expect(r.errors).toEqual([]);
  });

  it('honestly reports the P0 gap', () => {
    const r = validateContent(CONTENT, 'p0');
    expect(r.summary.cards).toBe(3);
    expect(r.summary.targetCards).toBe(22);
    expect(r.errors.some((e) => e.startsWith('P0'))).toBe(true);
  });

  it('flags forbidden, predictive or diagnostic phrasing', () => {
    const bad = {
      ...CONTENT,
      cards: CONTENT.cards.map((c, i) => (i === 0 ? { ...c, essence: { de: 'Dein Schicksal ist garantiert.', en: 'He loves you.' } } : c)),
    };
    const r = validateContent(bad, 'g1');
    expect(r.errors.filter((e) => e.includes('forbidden')).length).toBeGreaterThanOrEqual(3);
  });

  it('flags missing translations and placeholders', () => {
    const bad = {
      ...CONTENT,
      cards: CONTENT.cards.map((c, i) => (i === 0 ? { ...c, ritual: { de: '', en: 'TODO' } } : c)),
    };
    const r = validateContent(bad, 'g1');
    expect(r.errors.some((e) => e.endsWith('.ritual.de: empty'))).toBe(true);
    expect(r.errors.some((e) => e.endsWith('.ritual.en: placeholder text'))).toBe(true);
  });

  it('keeps archetype shadows as open questions and the questionnaire balanced', () => {
    for (const a of CONTENT.archetypes) {
      expect(a.shadow.de.trim().endsWith('?')).toBe(true);
      expect(a.shadow.en.trim().endsWith('?')).toBe(true);
    }
    const unbalanced = {
      ...CONTENT,
      questions: CONTENT.questions.map((q, i) => (i === 0 ? { ...q, answers: q.answers.map((a) => ({ ...a, primary: 'sage' as const })) } : q)),
    };
    expect(validateContent(unbalanced, 'g1').errors.some((e) => e.startsWith('balance'))).toBe(true);
  });
});
