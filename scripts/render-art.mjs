// Renders the vector assets in art/*.mjs: app icons, paper grain and the card replacement kit
// (frame, frame halo, safe zones). The card illustrations themselves are the painted deck v2
// (scripts/assets/export-cards.py) and are NOT touched by default.
// Usage: npm run art                              -> icons, grain, docs/assets kit
//        npm run art -- --android                 -> also Android launcher icons
//        npm run art -- --legacy-cards <outDir>   -> also the original vector deck (G1/G2) into <outDir>
// Uses the project's Playwright Chromium; nothing is fetched from the network.
import { chromium } from '@playwright/test';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appIcon, grainTile } from '../art/cards.mjs';
import { CARD_BACK, DECK_ART } from '../art/deck.mjs';
import { frameHalo, frameOnly, safeZones } from '../art/template.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const withAndroid = process.argv.includes('--android');
const legacyIndex = process.argv.indexOf('--legacy-cards');
const legacyDir = legacyIndex > 0 ? process.argv[legacyIndex + 1] : null;
if (legacyIndex > 0 && !legacyDir) throw new Error('--legacy-cards needs an output directory');
if (legacyDir && resolve(root, legacyDir).startsWith(resolve(root, 'public'))) throw new Error('--legacy-cards must not write into public/');

const cards = [...DECK_ART, CARD_BACK].map(([id, numeral, draw]) => [id, draw(), numeral]);

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
  const p = resolve(root, rel);
  await ensureDir(p);
  await writeFile(p, buf);
  written.push([rel, (await stat(p)).size]);
}

if (legacyDir) {
  for (const [id, svg] of cards) {
    await out(join(legacyDir, `${id}.svg`), Buffer.from(svg));
    await out(join(legacyDir, `${id}.webp`), await raster(svg, 720, 1080, 'image/webp', 0.88));
  }
}

// Replacement kit (docs/assets): frame on transparent background + safe-zone guide.
await out('docs/assets/card-frame-template.png', await raster(frameOnly(), 720, 1080, 'image/png'));
await out('docs/assets/card-safe-zones.png', await raster(safeZones(), 720, 1080, 'image/png'));
await out('docs/assets/card-frame-halo.png', await raster(frameHalo(), 720, 1080, 'image/png'));

// Overview of the legacy vector deck (labels only here, never in the assets).
if (legacyDir) {
  const tiles = cards.map(([id, svg, numeral]) => ({ id, svg, numeral }));
  const dataUrl = await page.evaluate(async (tiles) => {
    const cols = 6;
    const w = 240;
    const h = 360;
    const lh = 30;
    const gap = 12;
    const rows = Math.ceil(tiles.length / cols);
    const canvas = document.createElement('canvas');
    canvas.width = cols * (w + gap) + gap;
    canvas.height = rows * (h + lh + gap) + gap;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0B0A14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingQuality = 'high';
    for (let i = 0; i < tiles.length; i++) {
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(tiles[i].svg);
      await img.decode();
      const x = gap + (i % cols) * (w + gap);
      const y = gap + Math.floor(i / cols) * (h + lh + gap);
      ctx.drawImage(img, x, y, w, h);
      ctx.fillStyle = '#E8DDBF';
      ctx.font = '15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${tiles[i].numeral ? tiles[i].numeral + ' · ' : ''}${tiles[i].id}`, x + w / 2, y + h + 21);
    }
    return canvas.toDataURL('image/webp', 0.84);
  }, tiles);
  await out(join(legacyDir, 'deck-overview.webp'), Buffer.from(dataUrl.split(',')[1], 'base64'));
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
