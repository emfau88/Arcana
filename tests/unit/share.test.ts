import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import { texts as archetypesDe } from '../../src/content/modules/archetypes.de.ts';
import { texts as archetypesEn } from '../../src/content/modules/archetypes.en.ts';
import { ARCHETYPE_ORDER, type Profile } from '../../src/domain/types.ts';
import { CARD_COLORS, brandingShare, fits, layoutArchetypeCard, wrap, type Measure } from '../../src/share/layout.ts';
import {
  SHARE_MODEL_IS_PRIVATE_SAFE,
  SHARE_MODEL_KEYS,
  SHARE_SIZE,
  archetypeShareModel,
  isComplete,
  type ArchetypeShareModel,
  type NoPrivateFields,
} from '../../src/share/model.ts';

/** Rough text width: average glyph width ≈ 0.52 em for the body face, 0.48 em for the display face. */
const measure: Measure = (text, font) => {
  const size = Number(/(\d+)px/.exec(font)?.[1] ?? 16);
  return text.length * size * (font.includes('Manrope') ? 0.56 : 0.5);
};

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

const model = (id: (typeof ARCHETYPE_ORDER)[number], locale: 'de' | 'en') =>
  archetypeShareModel(CONTENT, id, locale, (k) => (locale === 'de' ? archetypesDe : archetypesEn)[k] ?? '');

describe('share models carry no private data (V04.7, J)', () => {
  it('cannot contain answers, scores, notes or the birth date (type level)', () => {
    expect(SHARE_MODEL_IS_PRIVATE_SAFE).toBe(true);
    type WithNote = ArchetypeShareModel & { note: string };
    type WithAnswers = ArchetypeShareModel & { answers: Profile['answers'] };
    // @ts-expect-error a share model with a note must not type-check
    const a: NoPrivateFields<WithNote> = true;
    // @ts-expect-error a share model with answers must not type-check
    const b: NoPrivateFields<WithAnswers> = true;
    expect([a, b]).toHaveLength(2);
  });

  it('holds only whitelisted keys at runtime, built from content and an id', () => {
    for (const id of ARCHETYPE_ORDER)
      for (const locale of ['de', 'en'] as const) {
        const m = model(id, locale);
        expect(Object.keys(m).sort()).toEqual([...SHARE_MODEL_KEYS.archetype].sort());
        expect(isComplete(m)).toBe(true);
        expect(m.strengths).toHaveLength(3);
      }
  });

  it('is incomplete (not shareable) while the module is not loaded', () => {
    expect(isComplete(archetypeShareModel(CONTENT, 'sage', 'de', () => ''))).toBe(false);
  });
});

describe('archetype card layout (J2)', () => {
  it('fits every archetype in both formats and languages, branding ≤ 6 %', () => {
    for (const id of ARCHETYPE_ORDER)
      for (const locale of ['de', 'en'] as const)
        for (const format of ['story', 'feed'] as const) {
          const l = layoutArchetypeCard(model(id, locale), format, measure);
          expect(fits(l), `${id} ${locale} ${format} scale ${l.scale}`).toBe(true);
          expect(l.width).toBe(SHARE_SIZE[format].width);
          expect(l.height).toBe(SHARE_SIZE[format].height);
          expect(brandingShare(l)).toBeLessThanOrEqual(0.06);
          // The 1024 px portrait master is never drawn larger than it is (S-08).
          expect(l.portrait.width).toBeLessThanOrEqual(1024);
          expect(l.portrait.height / l.portrait.width).toBeCloseTo(1.5, 5);
        }
  });

  it('shrinks long texts instead of letting them overflow', () => {
    const long = { ...model('seeker', 'de'), essence: 'Sehr lange Essenz '.repeat(20).trim() };
    const l = layoutArchetypeCard(long, 'feed', measure);
    expect(l.scale).toBeLessThan(1);
  });

  it('keeps every text at least 4.5:1 against its background', () => {
    for (const c of [CARD_COLORS.name, CARD_COLORS.text, CARD_COLORS.accent]) expect(contrast(c, CARD_COLORS.panel)).toBeGreaterThanOrEqual(4.5);
    // The brand sits on the gradient: check the lighter end.
    expect(contrast(CARD_COLORS.accent, CARD_COLORS.backgroundBottom)).toBeGreaterThanOrEqual(4.5);
  });

  it('wraps by words', () => {
    expect(wrap('eins zwei drei vier', '10px x', 45, (t) => t.length * 5)).toEqual(['eins zwei', 'drei vier']);
    expect(wrap('', '10px x', 45, () => 0)).toEqual([]);
  });
});
