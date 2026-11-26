// Renders the original vector art in art/*.mjs to optimized raster assets.
// Usage: npm run art            -> public/ assets
//        npm run art -- --android -> also Android launcher icons (after `npx cap add android`)
// Uses the project's Playwright Chromium; nothing is fetched from the network.
import { chromium } from '@playwright/test';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appIcon, back, grainTile, highPriestess, sun, tower } from '../art/cards.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const withAndroid = process.argv.includes('--android');

const cards = [
  ['card-high-priestess', highPriestess()],
  ['card-tower', tower()],
  ['card-sun', sun()],
  ['card-back', back()],
];

async function ensureDir(p) {
  await mkdir(dirname(p), { recursive: true });
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<!doctype html><html><body style="margin:0;background:transparent"></body></html>');

/** Rasterize an SVG string to the given size and mime type, returns a Buffer. */
async function raster(svg, width, height, type = 'image/webp', quality = 0.9) {
  const dataUrl = await page.evaluate(
    async ({ svg, width, height, type, quality }) => {
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      return canvas.toDataURL(type, quality);
    },
    { svg, width, height, type, quality },
  );
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

const written = [];
async function out(rel, buf) {
  const p = join(root, rel);
  await ensureDir(p);
  await writeFile(p, buf);
  written.push([rel, (await stat(p)).size]);
}

await mkdir(join(root, 'art', 'build'), { recursive: true });
for (const [id, svg] of cards) {
  await writeFile(join(root, 'art', 'build', `${id}.svg`), svg);
  await out(`public/cards/${id}.webp`, await raster(svg, 720, 1080, 'image/webp', 0.88));
  await out(`public/cards/thumbs/${id}.webp`, await raster(svg, 240, 360, 'image/webp', 0.86));
}

await out('public/textures/grain.webp', await raster(grainTile(), 256, 256, 'image/webp', 0.9));
await writeFile(join(root, 'public', 'favicon.svg'), appIcon('round'));
await out('public/icons/icon-192.png', await raster(appIcon('full'), 192, 192, 'image/png'));
await out('public/icons/icon-512.png', await raster(appIcon('full'), 512, 512, 'image/png'));

if (withAndroid) {
  const res = join(root, 'android', 'app', 'src', 'main', 'res');
  if (!existsSync(res)) throw new Error('android/ project not found – run `npx cap add android` first');
  const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
  for (const [d, k] of Object.entries(densities)) {
    await out(`android/app/src/main/res/mipmap-${d}/ic_launcher.png`, await raster(appIcon('full'), 48 * k, 48 * k, 'image/png'));
    await out(`android/app/src/main/res/mipmap-${d}/ic_launcher_round.png`, await raster(appIcon('round'), 48 * k, 48 * k, 'image/png'));
    await out(`android/app/src/main/res/mipmap-${d}/ic_launcher_foreground.png`, await raster(appIcon('foreground'), 108 * k, 108 * k, 'image/png'));
  }
}

await browser.close();
for (const [rel, size] of written) console.log(`${(size / 1024).toFixed(1).padStart(7)} KB  ${rel}`);
