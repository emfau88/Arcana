// Visual evidence for the "Heute" screen with chosen cards and a journey day.
// Usage: node --experimental-strip-types scripts/today-showcase.mjs <baseUrl> <outDir>
//          [--cards major-03-empress,major-19-sun,major-15-devil] [--day 12]
//          [--locale de|en] [--width 412] [--height 915] [--font 100] [--motion reduce]
//          [--contrast]  (measures text contrast against what lies behind the text)
//
// The flow is real (onboarding through the UI). Only the daily records are seeded
// synthetically, built with the app's own domain code (composeDaily), so a specific
// card and a later journey day can be shown. Nothing personal is typed or stored.
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { auditContrast } from './contrast-audit.mjs';
import { CONTENT } from '../src/content/index.ts';
import { localDateKey } from '../src/domain/clock.ts';
import { composeDaily } from '../src/domain/oracle.ts';

const [, , baseUrl = 'http://127.0.0.1:5181/', outDir = 'docs/visual/scratch', ...rest] = process.argv;
const opt = (name, def) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : def;
};
const cards = opt('cards', 'major-03-empress,major-19-sun,major-15-devil').split(',');
const day = Number(opt('day', '12'));
const locale = opt('locale', 'de');
const width = Number(opt('width', '412'));
const height = Number(opt('height', '915'));
const font = Number(opt('font', '100'));
const reduce = opt('motion', 'no-preference') === 'reduce';
const dbName = opt('db', 'personal-oracle');
const desktop = width >= 1024;
const measureContrast = rest.includes('--contrast');
const L = locale === 'de';

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const tag = `${locale}-${width}${font !== 100 ? `-font${font}` : ''}${reduce ? '-reduce' : ''}`;

function record(cardId, dateKey, profile) {
  return {
    dateKey,
    deckId: CONTENT.deckId,
    cardId,
    themeId: profile.themeId,
    archetypeId: profile.archetypeId,
    locale,
    contentVersion: CONTENT.version,
    content: composeDaily(CONTENT, cardId, profile.themeId, profile.archetypeId, locale),
    revealedAt: new Date(`${dateKey}T08:00:00`).toISOString(),
    note: '',
  };
}

async function onboard(page) {
  await page.goto(baseUrl);
  await page.getByRole('button', { name: L ? 'Beginnen' : 'Begin' }).click();
  for (let i = 0; i < 4; i++) {
    await page.getByRole('radio').nth(i === 3 ? 2 : i % 4).click();
    await page.waitForTimeout(400);
  }
  await page.getByRole('radio').nth(1).click();
  await page.getByRole('button', { name: L ? 'Archetyp enthüllen' : 'Reveal my archetype' }).click();
  await page.waitForSelector('.archetype__name');
  await page.getByRole('button', { name: L ? 'Zur Tageskarte' : 'Go to today’s card' }).click();
  await page.waitForSelector('.today__cta');
  return page.evaluate(
    (name) =>
      new Promise((resolve, reject) => {
        const r = indexedDB.open(name);
        r.onsuccess = () => {
          const g = r.result.transaction('kv').objectStore('kv').get('profile');
          g.onsuccess = () => resolve(g.result);
          g.onerror = () => reject(g.error);
        };
        r.onerror = () => reject(r.error);
      }),
    dbName,
  );
}

async function seed(page, records) {
  await page.evaluate(
    ({ name, records }) =>
      new Promise((resolve, reject) => {
        const r = indexedDB.open(name);
        r.onsuccess = () => {
          const tx = r.result.transaction('daily', 'readwrite');
          for (const rec of records) tx.objectStore('daily').put(rec);
          tx.oncomplete = () => resolve(null);
          tx.onerror = () => reject(tx.error);
        };
        r.onerror = () => reject(r.error);
      }),
    { name: dbName, records },
  );
}

const keyFor = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return localDateKey(d);
};

async function context() {
  return browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: desktop ? 1 : 2,
    isMobile: !desktop,
    hasTouch: !desktop,
    locale: L ? 'de-DE' : 'en-US',
    reducedMotion: reduce ? 'reduce' : 'no-preference',
    bypassCSP: font !== 100,
  });
}

const errors = [];
const shots = [];
const folds = [];
const contrasts = [];

// Text contrast of every reading text on the screen, whole scroll height, p95 of the
// backdrop (scripts/contrast-audit.mjs, MASTER_ROADMAP_V2 §6).
async function shot(page, name, firstScreen = true) {
  await page.waitForTimeout(1600);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (over > 0) errors.push(`${name}: horizontal overflow ${over}px`);
  // First-screen check: is the main action fully visible above the tab bar?
  const fold = await page.evaluate(() => {
    const cta = document.querySelector('.today__continue, .today__cta');
    const bar = document.querySelector('.tabbar');
    const card = document.querySelector('.cstage .ocard');
    if (!cta || !bar) return null;
    const c = cta.getBoundingClientRect();
    return { ctaBottom: Math.round(c.bottom), barTop: Math.round(bar.getBoundingClientRect().top), cardWidth: Math.round(card?.getBoundingClientRect().width ?? 0) };
  });
  if (fold && firstScreen) folds.push({ name, ...fold, ctaAboveFold: fold.ctaBottom <= fold.barTop });
  const file = join(outDir, `${name}-${tag}.png`);
  if (measureContrast) contrasts.push(...(await auditContrast(page, name)));
  await page.screenshot({ path: file });
  shots.push(file);
}

// Covered card on journey day `day` (previous days seeded, today not yet drawn).
for (const [i, cardId] of [['hidden', null], ...cards.map((c, i) => [i, c])]) {
  const ctx = await context();
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  const profile = await onboard(page);
  const pool = CONTENT.cards.map((c) => c.id).filter((id) => id !== cardId);
  const past = Array.from({ length: day - 1 }, (_, k) => record(pool[k % pool.length], keyFor(k + 1), profile));
  const today = cardId ? [record(cardId, keyFor(0), profile)] : [];
  await seed(page, [...past, ...today]);
  await page.reload();
  if (font !== 100) await page.addStyleTag({ content: `html{font-size:${font}%!important}` });
  await page.waitForSelector(cardId ? '#today-card-title' : '.today__cta');
  const slug = cardId ? cardId.replace(/^major-\d+-/, '') : 'verdeckt';
  await shot(page, `heute-${String(i === 'hidden' ? 0 : i + 1).padStart(2, '0')}-${slug}`);
  const next = page.getByRole('button', { name: L ? 'Reise fortsetzen' : 'Continue your journey' });
  if (cardId && i === 0 && (await next.count())) {
    // "Continue your journey" leads to the full message (absent in builds before V02).
    await next.click();
    await page.waitForTimeout(900);
    const focused = await page.evaluate(() => document.activeElement?.id ?? '');
    if (focused !== 'today-message-title') errors.push(`continue: focus on "${focused}"`);
    await shot(page, `heute-${String(i + 1).padStart(2, '0')}-${slug}-botschaft`, false);
  }
  await ctx.close();
}

await browser.close();
const fails = contrasts.filter((r) => !r.pass);
const worst = [...contrasts].filter((r) => !r.gradient).sort((a, b) => a.p95 / a.min - b.p95 / b.min).slice(0, 6);
console.log(JSON.stringify({ shots, folds, errors, contrast: measureContrast ? { texts: contrasts.length, fails, worst } : undefined }, null, 2));
if (errors.length || fails.length) process.exitCode = 1;
if (errors.length) process.exitCode = 1;
