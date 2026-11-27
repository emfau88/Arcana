// Exports delivered image masters (PNG) to the WebP sizes of docs/visual/ASSET_REQUESTS.md and
// checks them against the size budgets. Masters are only read, never changed (no retouch). The only
// crop is the one ASSET_REQUESTS asks for: the vignette sheet A23–A29 is cut into single files.
// Usage: node scripts/export-art.mjs <bulk> <masterDir> <outDir>
//   bulk: b2 (A05, A06, A19 backgrounds; A07–A14 portraits)
//         b3 (A03, A04 backgrounds; A15 book; A20, A21 card backs; A23–A29 vignettes; A30 parchment)
// Encoding uses the project's Playwright Chromium (canvas → WebP); nothing is downloaded.
// The large size is the master's own size (1024 × 1536, like A01): no upscaling.
import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [, , bulk, masterDir, outDir] = process.argv;
if (!['b2', 'b3'].includes(bulk) || !masterDir || !outDir) {
  console.error('Usage: node scripts/export-art.mjs b2|b3 <masterDir> <outDir>');
  process.exit(2);
}

/**
 * One output file. Sizes and budgets from ASSET_REQUESTS. `src` = source rectangle in the master
 * (only for the vignette sheet); without it the whole master is scaled (same aspect required).
 */
const job = (master, dir, name, w, h, budgetKb, src) => ({ master, dir, name, w, h, budgetKb, src });

const browser = await chromium.launch();
const page = await browser.newPage();
const masters = new Map();
const sums = [];
async function master(name) {
  if (!masters.has(name)) {
    const png = await readFile(join(masterDir, name));
    masters.set(name, png);
    sums.push(`${createHash('sha256').update(png).digest('hex')}  ${name}`);
  }
  return masters.get(name);
}
const dataUrl = (png) => `data:image/png;base64,${png.toString('base64')}`;

const JOBS = [];
const checks = {};
if (bulk === 'b2') {
  const ARCHETYPES = ['seeker', 'guardian', 'visionary', 'alchemist', 'wanderer', 'creator', 'sage', 'renewer'];
  for (const id of ['bg-profile', 'bg-welcome', 'bg-starmap']) {
    JOBS.push(job(`${id}.png`, 'world', `${id}.webp`, 1024, 1536, 320));
    JOBS.push(job(`${id}.png`, 'world', `${id}-720.webp`, 720, 1080, 160));
  }
  for (const id of ARCHETYPES) {
    JOBS.push(job(`archetype-${id}.png`, 'archetypes', `archetype-${id}.webp`, 720, 1080, 180));
    JOBS.push(job(`archetype-${id}.png`, 'archetypes', `archetype-${id}-240.webp`, 240, 360, 30));
    // Share image (V04.7, loaded lazily): master size, budget like the large backgrounds.
    JOBS.push(job(`archetype-${id}.png`, 'archetypes', `archetype-${id}-1024.webp`, 1024, 1536, 320));
  }
} else {
  for (const id of ['bg-oracle', 'bg-grimoire']) {
    JOBS.push(job(`${id}.png`, 'world', `${id}.webp`, 1024, 1536, 320));
    JOBS.push(job(`${id}.png`, 'world', `${id}-720.webp`, 720, 1080, 160));
  }
  JOBS.push(job('grimoire-book.png', 'world', 'grimoire-book.webp', 900, 600, 140));
  for (const id of ['cardback-crescent', 'cardback-compass']) {
    JOBS.push(job(`${id}.png`, 'backs', `${id}.webp`, 720, 1080, 140));
    JOBS.push(job(`${id}.png`, 'backs/thumbs', `${id}.webp`, 240, 360, 30));
  }
  JOBS.push(job('parchment-tile.png', 'world', 'parchment-tile.webp', 512, 512, 90));

  // Vignettes: the sheet is a 4 × 2 grid. Every motif keeps the same scale (same line weight), so
  // one square size fits the largest motif plus 6 % air, centred on each motif's own bounds.
  const VIGNETTES = ['cards', 'archetypes', 'symbols', 'journal', 'rituals', 'numbers', 'journey', 'tailpiece'];
  const sheet = await master('grimoire-vignettes.png');
  const boxes = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
    const cw = width / 4;
    const ch = height / 2;
    const out = [];
    for (let r = 0; r < 2; r++)
      for (let col = 0; col < 4; col++) {
        let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
        for (let y = Math.floor(r * ch); y < (r + 1) * ch; y++)
          for (let x = Math.floor(col * cw); x < (col + 1) * cw; x++)
            if (data[(y * width + x) * 4 + 3] > 24) {
              if (x < x0) x0 = x;
              if (x > x1) x1 = x;
              if (y < y0) y0 = y;
              if (y > y1) y1 = y;
            }
        // Does anything reach the cell border (a motif cut by the grid)?
        const touches = x0 <= col * cw + 1 || x1 >= (col + 1) * cw - 2 || y0 <= r * ch + 1 || y1 >= (r + 1) * ch - 2;
        out.push({ x0, y0, x1, y1, touches });
      }
    return out;
  }, dataUrl(sheet));
  const side = Math.ceil(Math.max(...boxes.slice(0, 7).map((b) => Math.max(b.x1 - b.x0, b.y1 - b.y0))) * 1.06);
  checks.vignettes = boxes.map((b, i) => ({ name: VIGNETTES[i], box: [b.x0, b.y0, b.x1 - b.x0 + 1, b.y1 - b.y0 + 1], touchesCell: b.touches }));
  checks.vignetteSquare = side;
  boxes.forEach((b, i) => {
    const cx = (b.x0 + b.x1) / 2;
    const cy = (b.y0 + b.y1) / 2;
    JOBS.push(job('grimoire-vignettes.png', 'vignettes', `${VIGNETTES[i]}.webp`, 320, 320, 30, [cx - side / 2, cy - side / 2, side, side]));
  });

  // Book (A15): clean alpha, transparent corners.
  checks.book = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let clear = 0, solid = 0, partial = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) clear++;
      else if (data[i] === 255) solid++;
      else partial++;
    }
    const n = data.length / 4;
    const a = (x, y) => data[(y * c.width + x) * 4 + 3];
    return {
      transparent: +(clear / n).toFixed(3),
      opaque: +(solid / n).toFixed(3),
      partial: +(partial / n).toFixed(3),
      corners: [a(0, 0), a(c.width - 1, 0), a(0, c.height - 1), a(c.width - 1, c.height - 1)],
    };
  }, dataUrl(await master('grimoire-book.png')));

  // Parchment (A30): seam when tiled and brightness spread (L* of 16 × 16 px blocks).
  checks.parchment = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement('canvas');
    const W = (c.width = img.naturalWidth);
    const H = (c.height = img.naturalHeight);
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, W, H);
    const lum = (i) => {
      const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const Y = 0.2126 * lin(data[i]) + 0.7152 * lin(data[i + 1]) + 0.0722 * lin(data[i + 2]);
      return Y > 0.008856 ? 116 * Math.cbrt(Y) - 16 : 903.3 * Y;
    };
    const L = (x, y) => lum((y * W + x) * 4);
    let seamX = 0, seamY = 0, inner = 0;
    for (let y = 0; y < H; y++) seamX += Math.abs(L(W - 1, y) - L(0, y));
    for (let x = 0; x < W; x++) seamY += Math.abs(L(x, H - 1) - L(x, 0));
    let k = 0;
    for (let y = 0; y < H; y += 4)
      for (let x = 1; x < W; x += 4) {
        inner += Math.abs(L(x, y) - L(x - 1, y));
        k++;
      }
    const B = 16;
    let lo = Infinity, hi = -Infinity;
    for (let by = 0; by < H; by += B)
      for (let bx = 0; bx < W; bx += B) {
        let s = 0;
        for (let y = by; y < by + B; y++) for (let x = bx; x < bx + B; x++) s += L(x, y);
        const m = s / (B * B);
        lo = Math.min(lo, m);
        hi = Math.max(hi, m);
      }
    return { seamX: +(seamX / H).toFixed(2), seamY: +(seamY / W).toFixed(2), neighbour: +(inner / k).toFixed(2), lMin: +lo.toFixed(1), lMax: +hi.toFixed(1), lRange: +(hi - lo).toFixed(1) };
  }, dataUrl(await master('parchment-tile.png')));
}

const rows = [];
let failed = 0;
for (const { master: name, dir, name: out, w, h, budgetKb, src } of JOBS) {
  const png = await master(name);
  // Highest quality that fits the budget: start like A01 (0.92), step down, never below 0.6.
  let q = 0.92;
  let webp;
  for (;;) {
    const url = await page.evaluate(
      async ({ src, w, h, q, rect }) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        if (!rect && img.naturalWidth * h !== img.naturalHeight * w) throw new Error(`aspect ${img.naturalWidth}x${img.naturalHeight} != ${w}x${h}`);
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        if (rect) {
          // Square source rectangle → w × h. The whole sheet is drawn shifted and scaled, so a
          // rectangle that reaches past the sheet edge stays transparent there.
          const [sx, sy, sw] = rect;
          const k = w / sw;
          ctx.drawImage(img, -sx * k, -sy * k, img.naturalWidth * k, img.naturalHeight * k);
        } else ctx.drawImage(img, 0, 0, w, h);
        return c.toDataURL('image/webp', q);
      },
      { src: dataUrl(png), w, h, q, rect: src ?? null },
    );
    webp = Buffer.from(url.split(',')[1], 'base64');
    if (webp.length <= budgetKb * 1024 || q <= 0.6) break;
    q = Math.round((q - 0.04) * 100) / 100;
  }
  const kb = webp.length / 1024;
  const ok = kb <= budgetKb;
  if (!ok) failed++;
  await mkdir(join(outDir, dir), { recursive: true });
  await writeFile(join(outDir, dir, out), webp);
  rows.push({ file: `${dir}/${out}`, size: `${w}x${h}`, kb: Number(kb.toFixed(1)), budgetKb, quality: q, ok });
}
await browser.close();
await writeFile(join(outDir, 'SHA256SUMS-masters'), `${sums.join('\n')}\n`);
await writeFile(join(outDir, 'export-report.json'), `${JSON.stringify(Object.keys(checks).length ? { files: rows, checks } : rows, null, 2)}\n`);
for (const r of rows) console.log(`${r.ok ? 'ok  ' : 'OVER'} ${r.file.padEnd(40)} ${r.size.padEnd(10)} ${String(r.kb).padStart(6)} KB (budget ${r.budgetKb}) q ${r.quality}`);
if (Object.keys(checks).length) console.log(JSON.stringify(checks, null, 1));
console.log(failed ? `${failed} file(s) over budget` : 'all files within budget');
process.exitCode = failed ? 1 : 0;
