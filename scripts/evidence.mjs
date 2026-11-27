// Real-browser evidence run: walks the complete app flow and saves screenshots.
// Usage: node scripts/evidence.mjs <baseUrl> <outDir> [--locale de|en] [--width 412] [--height 915] [--font 100]
//                                  [--desktop] [--motion reduce] [--contrast]
// --contrast audits every reading text of every screen (whole scroll height, p95, see contrast-audit.mjs)
//            and writes contrast-<tag>.json; failing texts make the run fail.
// Only synthetic input is used. Nothing personal is typed or stored.
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { auditContrast } from './contrast-audit.mjs';

const [, , baseUrl = 'http://127.0.0.1:5180/', outDir = 'docs/evidence/scratch', ...rest] = process.argv;
const opt = (name, def) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : def;
};
const locale = opt('locale', 'de');
const width = Number(opt('width', '412'));
const height = Number(opt('height', '915'));
const font = Number(opt('font', '100'));
const desktop = rest.includes('--desktop');
const reduce = opt('motion', 'no-preference');
const only = opt('only', 'all');
const contrast = rest.includes('--contrast');
const contrastRows = [];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: desktop ? { width: 1440, height: 900 } : { width, height },
  deviceScaleFactor: desktop ? 1 : 2,
  locale: locale === 'de' ? 'de-DE' : 'en-US',
  reducedMotion: reduce === 'reduce' ? 'reduce' : 'no-preference',
  isMobile: !desktop,
  hasTouch: !desktop,
  // The font-size simulation injects a style tag; the production CSP (correctly) blocks
  // inline styles, so only this test mode bypasses it.
  bypassCSP: font !== 100,
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
const external = [];
page.on('request', (r) => {
  const u = new URL(r.url());
  if (!['127.0.0.1', 'localhost'].includes(u.hostname) && u.protocol !== 'data:') external.push(r.url());
});

let n = 0;
const tag = `${locale}-${desktop ? 'desktop' : `${width}`}${font !== 100 ? `-font${font}` : ''}`;
async function shot(name, { long = false } = {}) {
  n += 1;
  await page.waitForTimeout(250);
  const file = join(outDir, `${String(n).padStart(2, '0')}-${name}-${tag}.png`);
  // Layout gate (MASTER_ROADMAP §6): the page does not scroll sideways, and no visible text sticks
  // out of the viewport (the scroll container clips sideways, so cut text would go unnoticed).
  // Decoration (aria-hidden, e.g. light rays of the card stage) may overflow on purpose.
  const over = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const cut = [];
    for (const el of document.querySelectorAll('body *')) {
      if (el.closest('[aria-hidden="true"]')) continue;
      if (![...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > vw + 1 || r.left < -1) cut.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} "${el.textContent.trim().slice(0, 30)}"`);
    }
    return { page: document.documentElement.scrollWidth - vw, cut };
  });
  if (over.page > 0) errors.push(`${name}: page scrolls sideways by ${over.page}px`);
  for (const c of over.cut) errors.push(`${name}: text outside the viewport ${c}`);
  if (long) {
    // Grow the viewport to the scroll height of the app's own scroll container, so the
    // real layout (not a CSS override) is captured in one image.
    const vp = page.viewportSize();
    const extra = await page.evaluate(() => {
      const m = document.querySelector('.stage__main');
      return m ? m.scrollHeight - m.clientHeight : 0;
    });
    await page.setViewportSize({ width: vp.width, height: Math.min(vp.height + Math.max(0, extra), 8000) });
    await page.waitForTimeout(400);
    await page.screenshot({ path: file });
    await page.setViewportSize(vp);
    await page.waitForTimeout(200);
  } else {
    await page.screenshot({ path: file });
    if (contrast) contrastRows.push(...(await auditContrast(page, name)));
  }
  console.log(file);
}
async function settle(ms = 900) {
  await page.waitForTimeout(ms);
}
async function applyFont() {
  if (font !== 100) await page.addStyleTag({ content: `html{font-size:${font}%!important}` });
}

const t0 = Date.now();
await page.goto(baseUrl);
await page.evaluate(async () => {
  // Fresh synthetic state for this evidence run (only this origin's own test DB).
  await new Promise((res) => {
    const r = indexedDB.deleteDatabase('personal-oracle');
    r.onsuccess = r.onerror = r.onblocked = () => res(null);
  });
});
await page.goto(baseUrl);
await applyFont();
await page.waitForSelector('.welcome__title');
await settle();
await shot('welcome');

const L = locale === 'de';
await page.getByRole('button', { name: L ? 'Beginnen' : 'Begin' }).click();
await settle(500);
await shot('frage-1');
for (let i = 0; i < 4; i++) {
  const radios = page.getByRole('radio');
  await radios.nth(i === 3 ? 2 : i % 4).click();
  await page.waitForTimeout(450);
}
await settle(400);
await shot('thema');
await page.getByRole('radio').nth(1).click();
await page.getByRole('button', { name: L ? 'Archetyp enthüllen' : 'Reveal my archetype' }).click();
await page.waitForSelector('.archetype__name');
await settle(1500);
await shot('archetyp');
if (only === 'all') await shot('archetyp-lang', { long: true });
await page.getByRole('button', { name: L ? 'Zur Tageskarte' : 'Go to today’s card' }).click();
await page.waitForSelector('.today__cta');
await settle();
const firstCardMs = Date.now() - t0;
await shot('heute-verdeckt');
// Empty state before the first card.
await page.getByRole('link', { name: 'Grimoire' }).click();
await settle(600);
await shot('grimoire-leer');
await page.getByRole('link', { name: L ? 'Heute' : 'Today' }).click();
await page.waitForSelector('.today__cta');
await settle(500);
await page.getByRole('button', { name: L ? 'Karte enthüllen' : 'Reveal card' }).click();
await page.waitForTimeout(330);
await shot('heute-enthuellung');
await page.waitForSelector('.today__reading');
await settle(1300);
await shot('heute-enthuellt');
await page.locator('.today__message').scrollIntoViewIfNeeded();
await settle(400);
await shot('heute-botschaft');
if (only === 'all') await shot('heute-lang', { long: true });
const dailyTitle = await page.locator('#today-card-title').textContent();

await page.getByRole('link', { name: L ? 'Orakel' : 'Oracle' }).click();
await settle(500);
await shot('orakel-start');
await page.getByRole('button', { name: L ? 'Drei Karten ziehen' : 'Draw three cards' }).click();
await settle(500);
await shot('orakel-verdeckt');
await page.locator('.spread .ocard').first().click();
await settle(1000);
await shot('orakel-eine-karte');
await page.getByRole('button', { name: L ? 'Alle aufdecken' : 'Reveal all' }).click();
await settle(1400);
await shot('orakel-aufgedeckt');
if (only === 'all') await shot('orakel-deutung-lang', { long: true });
await page.getByRole('button', { name: L ? 'Im Grimoire speichern' : 'Save to grimoire' }).click();
await settle(700);
await shot('orakel-gespeichert');

await page.getByRole('link', { name: 'Grimoire' }).click();
await settle(700);
await shot('grimoire-sammlung');
await page.getByRole('tab', { name: L ? 'Verlauf' : 'History' }).click();
await settle(500);
await shot('grimoire-verlauf');
await page.locator('.history__row').first().click();
await settle(700);
await shot('legung-detail');
await page.getByRole('link', { name: L ? 'Profil' : 'Profile' }).click();
await settle(600);
await shot('profil');
if (only === 'all') await shot('profil-lang', { long: true });
// Manual archetype correction (all eight archetypes + open profile).
await page.getByRole('button', { name: L ? 'Selbst wählen' : 'Choose myself' }).click();
await settle(500);
await page.locator('#prof-choose').scrollIntoViewIfNeeded();
await settle(300);
await shot('profil-archetyp-waehlen');
await page.getByRole('button', { name: L ? 'Archetyp ansehen' : 'View archetype' }).click();
await page.waitForSelector('.archetype__name');
await settle(1200);
await shot('archetyp-aus-profil');

// Persistence: reload and confirm the same daily card is shown.
await page.goto(new URL('#/today', baseUrl).toString());
await page.reload();
await applyFont();
await page.waitForSelector('#today-card-title');
await settle(600);
const afterReload = await page.locator('#today-card-title').textContent();
await shot('heute-nach-neuladen');

let contrastFails = [];
if (contrast) {
  contrastFails = contrastRows.filter((r) => !r.pass);
  await writeFile(join(outDir, `contrast-${tag}.json`), JSON.stringify(contrastRows, null, 2));
  const worst = [...contrastRows].filter((r) => !r.gradient).sort((a, b) => a.p95 / a.min - b.p95 / b.min).slice(0, 8);
  console.log(`contrast ${tag}: ${contrastRows.length} texts, ${contrastFails.length} below the minimum`);
  for (const r of contrastFails.length ? contrastFails : worst) console.log(`  ${r.pass ? 'ok  ' : 'FAIL'} ${r.p95.toFixed(2)} (min ${r.min}, median ${r.median}) ${r.screen} ${r.key} "${r.text}"`);
}
console.log(JSON.stringify({ tag, firstCardMs, dailyTitle, afterReload, samePersisted: dailyTitle === afterReload, errors, external, contrastFails: contrastFails.length }, null, 2));
await browser.close();
if (errors.length || external.length || dailyTitle !== afterReload || contrastFails.length) process.exitCode = 1;
