import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import { composeDaily, composeReading } from '../../src/domain/oracle.ts';
import { ALL_THEME_IDS, ARCHETYPE_ORDER, LOCALES, type CardId } from '../../src/domain/types.ts';

// Q08: every card works with every theme and every position, in both languages.
describe('content matrix (22 cards × 6 themes × 2 languages)', () => {
  const cards = CONTENT.cards.map((c) => c.id);

  it('composes a daily message for every card, theme and language', () => {
    let n = 0;
    for (const id of cards)
      for (const theme of ALL_THEME_IDS)
        for (const locale of LOCALES) {
          const d = composeDaily(CONTENT, id, theme, null, locale);
          expect(d.message.length, `${id}/${theme}/${locale}`).toBeGreaterThan(40);
          expect(d.themeLabel).toBe(CONTENT.themes.find((t) => t.id === theme)!.label[locale]);
          n++;
        }
    expect(n).toBe(22 * 6 * 2);
  });

  it('adds an archetype lens for all eight archetypes', () => {
    for (const a of ARCHETYPE_ORDER)
      for (const locale of LOCALES) expect(composeDaily(CONTENT, cards[0]!, 'self', a, locale).lens).toBeTruthy();
  });

  it('places every card in every position of a three-card reading', () => {
    for (let i = 0; i < cards.length; i++) {
      const triple = [cards[i], cards[(i + 7) % 22], cards[(i + 13) % 22]] as [CardId, CardId, CardId];
      for (const theme of ALL_THEME_IDS)
        for (const locale of LOCALES) {
          const r = composeReading(CONTENT, triple, theme, locale);
          expect(r.positions.map((p) => p.cardId)).toEqual(triple);
          for (const p of r.positions) expect(p.text.length).toBeGreaterThan(20);
          expect(r.synthesis.length).toBeGreaterThan(40);
          expect(r.intro.length).toBeGreaterThan(20);
        }
    }
  });

  it('reads differently per theme for the same card', () => {
    for (const id of cards)
      for (const locale of LOCALES) {
        const texts = ALL_THEME_IDS.map((t) => composeDaily(CONTENT, id, t, null, locale).message);
        expect(new Set(texts).size, `${id}/${locale}`).toBe(6);
      }
  });
});
