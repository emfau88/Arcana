/**
 * Layout of the archetype share card (V04.7, J2). Pure: text measuring is injected, so the same
 * layout runs in the browser (canvas measureText) and in unit tests (approximate widths).
 * Text sits on an opaque panel, so its contrast never depends on the artwork; long texts shrink
 * step by step until everything fits above the brand line.
 */
import { SHARE_SIZE, type ArchetypeShareModel, type ShareFormat } from './model.ts';

export type Measure = (text: string, font: string) => number;

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextBlock {
  font: string;
  color: string;
  /** Baseline y of each line. */
  lines: Array<{ text: string; x: number; y: number }>;
  align: 'center' | 'left';
  box: Box;
}

export interface CardLayout {
  format: ShareFormat;
  width: number;
  height: number;
  portrait: Box;
  panel: Box;
  name: TextBlock;
  essence: TextBlock;
  strengths: TextBlock[];
  /** Small marker before each strength. */
  bullets: Array<{ x: number; y: number; r: number }>;
  brand: { box: Box; font: string; text: string; emblem: { cx: number; cy: number; r: number } };
  /** Font scale that made everything fit (1 = design size). */
  scale: number;
}

/** Card palette (tokens of the app). Contrast is checked in tests on the panel colour. */
export const CARD_COLORS = {
  backgroundTop: '#060812',
  backgroundBottom: '#24143a',
  panel: '#0b1024',
  frame: '#9a7338',
  name: '#f6e6b8',
  text: '#eadbc0',
  accent: '#d9b56e',
} as const;

export const CARD_FONTS = {
  display: "'Cormorant Garamond Variable', 'Cormorant Garamond', Georgia, serif",
  body: "'Manrope Variable', Manrope, system-ui, sans-serif",
} as const;

interface Spec {
  pad: number;
  portrait: { width: number; top: number };
  name: number;
  essence: number;
  strength: number;
  brand: number;
  gap: number;
}

const SPECS: Readonly<Record<ShareFormat, Spec>> = {
  story: { pad: 96, portrait: { width: 640, top: 120 }, name: 92, essence: 46, strength: 33, brand: 28, gap: 34 },
  feed: { pad: 80, portrait: { width: 400, top: 80 }, name: 76, essence: 38, strength: 28, brand: 24, gap: 24 },
};

export function wrap(text: string, font: string, maxWidth: number, measure: Measure): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (line && measure(next, font) > maxWidth) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function block(text: string, font: string, color: string, size: number, x: number, top: number, width: number, align: 'center' | 'left', measure: Measure, lineHeight = 1.3): TextBlock {
  const lines = wrap(text, font, width, measure);
  const lh = Math.round(size * lineHeight);
  const ax = align === 'center' ? x + width / 2 : x;
  return {
    font,
    color,
    align,
    lines: lines.map((t, i) => ({ text: t, x: ax, y: top + Math.round(size * 0.95) + i * lh })),
    box: { x, y: top, width, height: lines.length * lh },
  };
}

/** Lays out the card; shrinks fonts in 4 % steps (to at most 70 %) until it fits. */
export function layoutArchetypeCard(model: ArchetypeShareModel, format: ShareFormat, measure: Measure): CardLayout {
  let last: CardLayout | null = null;
  for (let scale = 1; scale >= 0.7 - 1e-9; scale -= 0.04) {
    last = layoutAt(model, format, measure, scale);
    if (fits(last)) return last;
  }
  return last as CardLayout;
}

function layoutAt(model: ArchetypeShareModel, format: ShareFormat, measure: Measure, scale: number): CardLayout {
  const { width, height } = SHARE_SIZE[format];
  const s = SPECS[format];
  const pw = s.portrait.width;
  const portrait: Box = { x: (width - pw) / 2, y: s.portrait.top, width: pw, height: Math.round(pw * 1.5) };
  const textX = s.pad;
  const textW = width - 2 * s.pad;
  const size = (n: number) => Math.round(n * scale);

  let y = portrait.y + portrait.height + s.gap * 1.5;
  const name = block(model.name, `600 ${size(s.name)}px ${CARD_FONTS.display}`, CARD_COLORS.name, size(s.name), textX, y, textW, 'center', measure, 1.1);
  y = name.box.y + name.box.height + s.gap * 0.5;
  const essence = block(model.essence, `italic 500 ${size(s.essence)}px ${CARD_FONTS.display}`, CARD_COLORS.text, size(s.essence), textX, y, textW, 'center', measure, 1.25);
  y = essence.box.y + essence.box.height + s.gap;

  const bulletR = Math.max(4, Math.round(size(s.strength) * 0.16));
  const indent = Math.round(size(s.strength) * 1.1);
  const strengths: TextBlock[] = [];
  const bullets: CardLayout['bullets'] = [];
  for (const st of model.strengths) {
    const b = block(st, `400 ${size(s.strength)}px ${CARD_FONTS.body}`, CARD_COLORS.text, size(s.strength), textX + indent, y, textW - indent, 'left', measure, 1.4);
    strengths.push(b);
    bullets.push({ x: textX + bulletR + 2, y: (b.lines[0]?.y ?? y) - Math.round(size(s.strength) * 0.32), r: bulletR });
    y = b.box.y + b.box.height + Math.round(s.gap * 0.6);
  }

  const brandFont = `600 ${s.brand}px ${CARD_FONTS.body}`;
  const brandText = 'ARCANA';
  const brandW = Math.round(measure(brandText, brandFont) + brandText.length * s.brand * 0.25 + s.brand * 1.6);
  const brandH = Math.round(s.brand * 1.8);
  const brandBox: Box = { x: (width - brandW) / 2, y: height - s.pad * 0.6 - brandH, width: brandW, height: brandH };
  const panelTop = portrait.y + portrait.height + s.gap * 0.5;
  const panel: Box = { x: s.pad * 0.5, y: panelTop, width: width - s.pad, height: brandBox.y - s.gap * 0.5 - panelTop };

  return {
    format,
    width,
    height,
    portrait,
    panel,
    name,
    essence,
    strengths,
    bullets,
    brand: { box: brandBox, font: brandFont, text: brandText, emblem: { cx: brandBox.x + s.brand * 0.6, cy: brandBox.y + brandH / 2, r: s.brand * 0.45 } },
    scale,
  };
}

const bottom = (b: Box) => b.y + b.height;

/** Everything inside the canvas, text inside the panel and above the brand. */
export function fits(l: CardLayout): boolean {
  const blocks = [l.name, l.essence, ...l.strengths];
  const textBottom = Math.max(...blocks.map((b) => bottom(b.box)));
  return textBottom <= bottom(l.panel) && bottom(l.panel) < l.brand.box.y && bottom(l.brand.box) <= l.height && blocks.every((b) => b.box.x >= 0 && b.box.x + b.box.width <= l.width);
}

/** Share of the card covered by branding (PRODUCT_SYSTEMS J: at most 6 %). */
export function brandingShare(l: CardLayout): number {
  return (l.brand.box.width * l.brand.box.height) / (l.width * l.height);
}
