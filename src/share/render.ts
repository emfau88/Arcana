/**
 * Canvas renderer for share cards (V04.7). Local only: the fonts are the app's own bundled files
 * (loaded through document.fonts before drawing), the portrait is a local asset. No network.
 */
import { portraitSrc } from '../content/assets.ts';
import { CARD_COLORS, layoutArchetypeCard, type Box, type CardLayout, type TextBlock } from './layout.ts';
import { SHARE_SIZE, type ArchetypeShareModel, type ShareFormat } from './model.ts';

/** Waits for the card fonts; on failure the system fallback is used rather than blocking. */
export async function loadCardFonts(): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) return;
  await Promise.all(
    ['600 92px "Cormorant Garamond Variable"', 'italic 500 46px "Cormorant Garamond Variable"', '400 33px "Manrope Variable"', '600 28px "Manrope Variable"'].map((f) =>
      document.fonts.load(f).catch(() => []),
    ),
  );
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Image could not be loaded: ${src}`));
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, b: Box, r: number): void {
  ctx.beginPath();
  ctx.roundRect(b.x, b.y, b.width, b.height, r);
}

function drawText(ctx: CanvasRenderingContext2D, t: TextBlock): void {
  ctx.font = t.font;
  ctx.fillStyle = t.color;
  ctx.textAlign = t.align;
  ctx.textBaseline = 'alphabetic';
  for (const l of t.lines) ctx.fillText(l.text, l.x, l.y);
}

/** Four-pointed star, the app's emblem. */
function emblem(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.32;
    ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

export function drawArchetypeCard(ctx: CanvasRenderingContext2D, l: CardLayout, portrait: CanvasImageSource | null): void {
  const bg = ctx.createLinearGradient(0, 0, 0, l.height);
  bg.addColorStop(0, CARD_COLORS.backgroundTop);
  bg.addColorStop(1, CARD_COLORS.backgroundBottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, l.width, l.height);

  // Thin brass frame.
  ctx.strokeStyle = CARD_COLORS.frame;
  ctx.lineWidth = 3;
  roundRect(ctx, { x: 28, y: 28, width: l.width - 56, height: l.height - 56 }, 26);
  ctx.stroke();

  if (portrait) {
    ctx.save();
    roundRect(ctx, l.portrait, 22);
    ctx.clip();
    ctx.drawImage(portrait, l.portrait.x, l.portrait.y, l.portrait.width, l.portrait.height);
    ctx.restore();
  }
  ctx.strokeStyle = CARD_COLORS.accent;
  ctx.lineWidth = 2;
  roundRect(ctx, l.portrait, 22);
  ctx.stroke();

  ctx.fillStyle = CARD_COLORS.panel;
  roundRect(ctx, l.panel, 20);
  ctx.fill();

  drawText(ctx, l.name);
  drawText(ctx, l.essence);
  ctx.fillStyle = CARD_COLORS.accent;
  for (const b of l.bullets) emblem(ctx, b.x, b.y, b.r * 1.6);
  for (const s of l.strengths) drawText(ctx, s);

  ctx.fillStyle = CARD_COLORS.accent;
  emblem(ctx, l.brand.emblem.cx, l.brand.emblem.cy, l.brand.emblem.r);
  ctx.font = l.brand.font;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const letterSpacing = 'letterSpacing' in ctx ? '0.25em' : null;
  if (letterSpacing) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = letterSpacing;
  ctx.fillText(l.brand.text, l.brand.emblem.cx + l.brand.emblem.r * 2, l.brand.emblem.cy + 1);
  if (letterSpacing) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '0px';
}

export interface RenderResult {
  blob: Blob;
  layout: CardLayout;
  /** Milliseconds from start to the finished PNG (budget 1500 ms on the reference emulator). */
  ms: number;
}

/** Renders the archetype card to a PNG blob. */
export async function renderArchetypeCard(model: ArchetypeShareModel, format: ShareFormat, canvas: HTMLCanvasElement = document.createElement('canvas')): Promise<RenderResult> {
  const t0 = performance.now();
  // Large portrait (1024 × 1536 master, never upscaled on the card: S-08).
  const [img] = await Promise.all([loadImage(portraitSrc(model.archetypeId, 1024)).catch(() => null), loadCardFonts()]);
  const { width, height } = SHARE_SIZE[format];
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D is not available');
  const layout = layoutArchetypeCard(model, format, (text, font) => {
    ctx.font = font;
    return ctx.measureText(text).width;
  });
  drawArchetypeCard(ctx, layout, img);
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG export failed'))), 'image/png'));
  return { blob, layout, ms: Math.round(performance.now() - t0) };
}
