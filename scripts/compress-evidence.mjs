// Converts evidence PNGs to compact WebP (repo-friendly). Usage: node scripts/compress-evidence.mjs <dir> [maxWidth]
// Uses the project's Playwright Chromium for encoding; nothing is downloaded.
import { chromium } from '@playwright/test';
import { readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

const [, , dir, maxWidthArg = '720'] = process.argv;
const maxWidth = Number(maxWidthArg);
const browser = await chromium.launch();
const page = await browser.newPage();
let before = 0;
let after = 0;
for (const name of (await readdir(dir)).filter((f) => f.endsWith('.png'))) {
  const png = await readFile(join(dir, name));
  const dataUrl = await page.evaluate(
    async ({ src, maxWidth }) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const scale = Math.min(1, maxWidth / img.naturalWidth);
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * scale);
      c.height = Math.round(img.naturalHeight * scale);
      const ctx = c.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, c.width, c.height);
      return c.toDataURL('image/webp', 0.82);
    },
    { src: `data:image/png;base64,${png.toString('base64')}`, maxWidth },
  );
  const webp = Buffer.from(dataUrl.split(',')[1], 'base64');
  await writeFile(join(dir, name.replace(/\.png$/, '.webp')), webp);
  await rm(join(dir, name));
  before += png.length;
  after += webp.length;
}
await browser.close();
console.log(`${dir}: ${(before / 1e6).toFixed(1)} MB -> ${(after / 1e6).toFixed(1)} MB`);
