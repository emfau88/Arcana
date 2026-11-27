import { describe, expect, it } from 'vitest';
import { backTarget, originOf, parsePath } from '../../src/app/router.ts';
import { CONTENT } from '../../src/content/index.ts';
import { validateContent } from '../../src/content/validate.ts';
import { de } from '../../src/i18n/de.ts';
import { en } from '../../src/i18n/en.ts';
import { detectLocale, fmt, toRoman } from '../../src/i18n/index.ts';
import { screensDe } from '../../src/i18n/screens.de.ts';
import { screensEn } from '../../src/i18n/screens.en.ts';

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

  it('parses the V04 routes (IA §3: #/me, #/grimoire/archetypes, #/grimoire/journey, #/share/:template)', () => {
    expect(parsePath('#/me').route).toEqual({ name: 'profile' });
    expect(parsePath('#/profile').route).toEqual({ name: 'profile' });
    expect(parsePath('#/me/settings').route).toEqual({ name: 'settings' });
    expect(parsePath('#/me/other').route.name).toBe('notfound');
    expect(parsePath('#/archetype/why?from=/me').route).toEqual({ name: 'why' });
    expect(parsePath('#/reveal').route).toEqual({ name: 'archetype' });
    expect(parsePath('#/archetype/x').route.name).toBe('notfound');
    expect(parsePath('#/grimoire/archetypes').route).toEqual({ name: 'archetypes' });
    expect(parsePath('#/grimoire/archetypes/sage').route).toEqual({ name: 'archetypeDetail', id: 'sage' });
    expect(parsePath('#/grimoire/journey').route).toEqual({ name: 'journey' });
    expect(parsePath('#/grimoire/review/week/2').route).toEqual({ name: 'review', kind: 'week', index: 2 });
    expect(parsePath('#/grimoire/review/month/1').route).toEqual({ name: 'review', kind: 'month', index: 1 });
    expect(parsePath('#/grimoire/review/week/0').route.name).toBe('notfound');
    expect(parsePath('#/grimoire/review/year/1').route.name).toBe('notfound');
    expect(parsePath('#/grimoire/chapter/2').route).toEqual({ name: 'chapter', id: '2' });
    expect(parsePath('#/share/archetype').route).toEqual({ name: 'share', template: 'archetype', id: '' });
    expect(parsePath('#/share/archetype/seeker').route).toEqual({ name: 'share', template: 'archetype', id: 'seeker' });
    expect(parsePath('#/share/day').route.name).toBe('notfound');
  });

  it('leads back from the V04 screens to where they were opened', () => {
    const back = (h: string) => backTarget(parsePath(h));
    expect(back('#/me')).toBe('/today');
    expect(back('#/me/settings')).toBe('/me');
    expect(back('#/archetype?from=/me')).toBe('/me');
    expect(back('#/archetype/why?from=/me')).toBe('/me');
    expect(back('#/archetype/why?from=/archetype')).toBe('/archetype');
    expect(back('#/archetype/why')).toBe('/me');
    expect(back('#/grimoire/archetypes')).toBe('/grimoire');
    expect(back('#/grimoire/archetypes?from=/me')).toBe('/me');
    expect(back('#/grimoire/archetypes/sage?from=/grimoire/archetypes')).toBe('/grimoire/archetypes');
    expect(back('#/grimoire/archetypes/sage?from=/me')).toBe('/me');
    expect(back('#/grimoire/journey')).toBe('/grimoire');
    expect(back('#/grimoire/journey?from=/today')).toBe('/today');
    expect(back('#/grimoire/review/week/1?from=/grimoire/journey')).toBe('/grimoire/journey');
    expect(back('#/grimoire/chapter/1')).toBe('/grimoire/journey');
    expect(back('#/share/archetype?from=/me')).toBe('/me');
    expect(back('#/share/archetype/sage?from=/grimoire/archetypes/sage')).toBe('/grimoire/archetypes/sage');
    expect(back('#/grimoire/card/x?from=/grimoire/archetypes/sage')).toBe('/grimoire/archetypes/sage');
    // Only archetype ids, no other paths smuggled in through the pattern.
    expect(back('#/share/archetype?from=/grimoire/archetypes/sage/../../welcome')).toBe('/me');
  });

  it('carries the origin of the origin once, so two steps back end where the person started', () => {
    const back = (h: string) => backTarget(parsePath(h));
    // "Ich" → the eight archetypes → one of them: back, back → "Ich".
    const library = parsePath('#/grimoire/archetypes?from=/me');
    const detail = `#/grimoire/archetypes/sage?from=${originOf(library)}`;
    expect(back(detail)).toBe('/grimoire/archetypes?from=/me');
    expect(back(`#${back(detail)}`)).toBe('/me');
    // Without an origin the plain path is passed on (readable URLs).
    expect(originOf(parsePath('#/grimoire/journey'))).toBe('/grimoire/journey');
    // "Heute" → journey → review → day page: back, back, back → "Heute".
    const journey = parsePath('#/grimoire/journey?from=/today');
    const review = parsePath(`#/grimoire/review/week/1?from=${originOf(journey)}`);
    expect(backTarget(review)).toBe('/grimoire/journey?from=/today');
    expect(back(`#/grimoire/day/2026-11-20?from=${originOf(review)}`)).toBe('/grimoire/review/week/1');
    // Only one level, only known paths, nothing else in the inner query.
    expect(back(`#/grimoire/archetypes/sage?from=${encodeURIComponent('/grimoire/archetypes?from=/welcome')}`)).toBe('/grimoire/archetypes');
    expect(back(`#/grimoire/archetypes/sage?from=${encodeURIComponent('/grimoire/archetypes?from=/me&x=1')}`)).toBe('/grimoire/archetypes');
    expect(back(`#/grimoire/archetypes/sage?from=${encodeURIComponent('/grimoire/archetypes?from=/grimoire/archetypes?from=/me')}`)).toBe('/grimoire/archetypes');
    expect(back(`#/grimoire/archetypes/sage?from=${encodeURIComponent('/grimoire/archetypes?from=https://evil.example')}`)).toBe('/grimoire/archetypes');
  });

  it('defines back for every route (Android back and in-app back share it)', () => {
    const back = (h: string) => backTarget(parsePath(h));
    expect(back('#/today')).toBe('exit');
    expect(back('#/welcome')).toBe('exit');
    expect(back('#/onboarding/1')).toBe('/welcome');
    expect(back('#/onboarding/4')).toBe('/onboarding/3');
    expect(back('#/oracle')).toBe('/today');
    expect(back('#/profile')).toBe('/today');
    expect(back('#/archetype')).toBe('/today');
    expect(back('#/archetype?from=/profile')).toBe('/profile');
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

  it('has the same keys, no empty strings and matching placeholders in the on-demand screen texts', () => {
    const enMap = new Map(values(screensEn as unknown as Tree));
    expect(keys(screensEn as unknown as Tree).sort()).toEqual(keys(screensDe as unknown as Tree).sort());
    for (const [k, v] of values(screensDe as unknown as Tree)) {
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
  it('passes the full P0 content gate: 22 cards, 6 themes, DE/EN', () => {
    const r = validateContent(CONTENT, 'p0');
    expect(r.errors).toEqual([]);
    expect(r.warnings).toEqual([]);
    expect(r.summary.cards).toBe(22);
    expect(r.summary.targetCards).toBe(22);
    expect(r.summary.themes).toBe(6);
    expect(r.summary.missingP0ThemeTexts).toBe(0);
    expect(validateContent(CONTENT, 'g1').errors).toEqual([]);
  });

  it('still reports a gap when a card or a theme text is missing', () => {
    const fewer = { ...CONTENT, cards: CONTENT.cards.slice(1) };
    expect(validateContent(fewer, 'p0').errors.some((e) => e.startsWith('P0'))).toBe(true);
    const noCareer = {
      ...CONTENT,
      cards: CONTENT.cards.map((c, i) => (i === 5 ? { ...c, themes: { ...c.themes, career: undefined } } : c)),
    };
    expect(validateContent(noCareer as typeof CONTENT, 'p0').errors.length).toBeGreaterThan(0);
  });

  it('keeps ids, orders and asset ids unique and in deck order', () => {
    const ids = CONTENT.cards.map((c) => c.id);
    expect(new Set(ids).size).toBe(22);
    expect(new Set(CONTENT.cards.map((c) => c.assetId)).size).toBe(22);
    expect(CONTENT.cards.map((c) => c.order)).toEqual(Array.from({ length: 22 }, (_, i) => i));
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
