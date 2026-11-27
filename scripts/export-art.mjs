// Exports delivered image masters (PNG) to the WebP sizes of docs/visual/ASSET_REQUESTS.md and
// checks them against the size budgets. Masters are only read, never changed (no crop, no retouch).
// Usage: node scripts/export-art.mjs <bulk> <masterDir> <outDir>
//   bulk: b2 (A05, A06, A19 backgrounds; A07–A14 portraits)
// Encoding uses the project's Playwright Chromium (canvas → WebP); nothing is downloaded.
// The large size is the master's own size (1024 × 1536, like A01): no upscaling.
import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [, , bulk, masterDir, outDir] = process.argv;
if (bulk !== 'b2' || !masterDir || !outDir) {
  console.error('Usage: node scripts/export-art.mjs b2 <masterDir> <outDir>');
  process.exit(2);
}

const ARCHETYPES = ['seeker', 'guardian', 'visionary', 'alchemist', 'wanderer', 'creator', 'sage', 'renewer'];
/** [master, target dir, output name, width, height, budget KB] — sizes and budgets from ASSET_REQUESTS. */
const JOBS = [];
for (const id of ['bg-profile', 'bg-welcome', 'bg-starmap']) {
  JOBS.push([`${id}.png`, 'world', `${id}.webp`, 1024, 1536, 320]);
  JOBS.push([`${id}.png`, 'world', `${id}-720.webp`, 720, 1080, 160]);
}
for (const id of ARCHETYPES) {
  JOBS.push([`archetype-${id}.png`, 'archetypes', `archetype-${id}.webp`, 720, 1080, 180]);
  JOBS.push([`archetype-${id}.png`, 'archetypes', `archetype-${id}-240.webp`, 240, 360, 30]);
  // Share image (V04.7, loaded lazily): master size, budget like the large backgrounds.
  JOBS.push([`archetype-${id}.png`, 'archetypes', `archetype-${id}-1024.webp`, 1024, 1536, 320]);
}

const browser = await chromium.launch();
const page = await browser.newPage();
const rows = [];
const sums = [];
let failed = 0;
const masters = new Map();
for (const [master, dir, name, w, h, budgetKb] of JOBS) {
  if (!masters.has(master)) {
    const png = await readFile(join(masterDir, master));
    masters.set(master, png);
    sums.push(`${createHash('sha256').update(png).digest('hex')}  ${master}`);
  }
  const png = masters.get(master);
  // Highest quality that fits the budget: start like A01 (0.92), step down, never below 0.6.
  let q = 0.92;
  let webp;
  for (;;) {
    const dataUrl = await page.evaluate(
      async ({ src, w, h, q }) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        if (img.naturalWidth * h !== img.naturalHeight * w) throw new Error(`aspect ${img.naturalWidth}x${img.naturalHeight} != ${w}x${h}`);
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
        return c.toDataURL('image/webp', q);
      },
      { src: `data:image/png;base64,${png.toString('base64')}`, w, h, q },
    );
    webp = Buffer.from(dataUrl.split(',')[1], 'base64');
    if (webp.length <= budgetKb * 1024 || q <= 0.6) break;
    q = Math.round((q - 0.04) * 100) / 100;
  }
  const kb = webp.length / 1024;
  const ok = kb <= budgetKb;
  if (!ok) failed++;
  await mkdir(join(outDir, dir), { recursive: true });
  await writeFile(join(outDir, dir, name), webp);
  rows.push({ file: `${dir}/${name}`, size: `${w}x${h}`, kb: Number(kb.toFixed(1)), budgetKb, quality: q, ok });
}
await browser.close();
await writeFile(join(outDir, 'SHA256SUMS-masters'), `${sums.join('\n')}\n`);
await writeFile(join(outDir, 'export-report.json'), `${JSON.stringify(rows, null, 2)}\n`);
for (const r of rows) console.log(`${r.ok ? 'ok  ' : 'OVER'} ${r.file.padEnd(40)} ${r.size.padEnd(10)} ${String(r.kb).padStart(6)} KB (budget ${r.budgetKb}) q ${r.quality}`);
console.log(failed ? `${failed} file(s) over budget` : 'all files within budget');
process.exitCode = failed ? 1 : 0;
