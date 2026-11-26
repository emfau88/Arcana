// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { applyTextZoom, measureTextZoom } from '../../src/platform/textZoom.ts';

describe('text zoom probe', () => {
  it('reports 1 without a system text zoom and exposes it as a CSS variable', () => {
    expect(measureTextZoom()).toBe(1);
    applyTextZoom();
    expect(document.documentElement.style.getPropertyValue('--text-zoom')).toBe('1');
    expect(document.body.children).toHaveLength(0); // probe removed
  });
});
