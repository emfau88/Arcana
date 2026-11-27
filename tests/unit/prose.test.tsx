// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { texts as archetypesDe } from '../../src/content/modules/archetypes.de.ts';
import { texts as archetypesEn } from '../../src/content/modules/archetypes.en.ts';
import { texts as chaptersDe } from '../../src/content/modules/chapters.de.ts';
import { texts as chaptersEn } from '../../src/content/modules/chapters.en.ts';
import { Prose } from '../../src/ui/Prose.tsx';

afterEach(cleanup);

const paragraphs = (text: string) => text.split(/\n{2,}/).filter((p) => p.trim().length > 0);

describe('long reading texts (design plan point 3, D-63)', () => {
  it('renders one paragraph per block and sets a closing question apart', () => {
    const { container } = render(<Prose className="x" text={'Erster Absatz.\n\nZweiter Absatz.\n\nWas nimmst du mit?'} />);
    const ps = [...container.querySelectorAll('p')];
    expect(ps.map((p) => p.textContent)).toEqual(['Erster Absatz.', 'Zweiter Absatz.', 'Was nimmst du mit?']);
    expect(ps[2]!.className).toContain('prose__question');
    expect(ps[0]!.className).toBe('');
    expect(container.firstElementChild!.className).toBe('prose x');
  });

  it('keeps a text without breaks as one plain paragraph, also when it ends with a question', () => {
    const { container } = render(<Prose text="Nur eine Frage?" />);
    const ps = [...container.querySelectorAll('p')];
    expect(ps).toHaveLength(1);
    expect(ps[0]!.className).toBe('');
  });

  it('every archetype description has three paragraphs in both languages', () => {
    for (const table of [archetypesDe, archetypesEn]) {
      const descriptions = Object.entries(table).filter(([k]) => k.startsWith('description.'));
      expect(descriptions).toHaveLength(8);
      for (const [key, text] of descriptions) expect(paragraphs(text), key).toHaveLength(3);
    }
  });

  it('every chapter has at least three paragraphs, none too long, and ends with its question', () => {
    for (const table of [chaptersDe, chaptersEn]) {
      const chapters = Object.entries(table);
      expect(chapters).toHaveLength(40);
      for (const [key, text] of chapters) {
        const ps = paragraphs(text);
        expect(ps.length, key).toBeGreaterThanOrEqual(3);
        expect(ps.at(-1)!.endsWith('?'), key).toBe(true);
        // One sentence: the closing question stands alone.
        expect(ps.at(-1)!.split(/[.!?]\s/).length, key).toBe(1);
        for (const p of ps) expect(p.split(/\s+/).length, key).toBeLessThanOrEqual(100);
      }
    }
  });
});
