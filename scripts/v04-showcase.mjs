// Visual evidence for the new V04 screens (D-57 proposals): reveal, "Why?", "Ich", settings,
// grimoire entries, the eight archetypes, an archetype page, star map, review, chapter, share
// preview and the milestone moment on "Today".
// Usage: node --experimental-strip-types scripts/v04-showcase.mjs <baseUrl> <outDir>
//          [--locale de|en] [--width 412] [--height 915] [--font 100] [--day 21]
//          [--motion reduce] [--contrast] [--only reveal,why,...]
//          [--frames]  (star map: frame times while scrolling, CPU throttled 4x; use with --day 400)
// Every screenshot also reports the shipped image bytes the screen references (budget 600 KB,
// MASTER_ROADMAP_V2 V04.6); generated data: images (the share preview) are not shipped and not counted.
//
// The state is synthetic and built with the app's own domain code: a profile from questionnaire
// answers (with a second voice) and one daily card per journey day up to today. Nothing personal
// is typed or stored; the run uses this origin's own test database.
import { chromium } from '@playwright/test';
import { mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { auditContrast } from './contrast-audit.mjs';
import { CONTENT } from '../src/content/index.ts';
import { PROFILE_VERSION, QUESTIONNAIRE_VERSION, scoreArchetype } from '../src/domain/archetypes.ts';
import { localDateKey } from '../src/domain/clock.ts';
import { composeDaily } from '../src/domain/oracle.ts';

const [, , baseUrl = 'http://127.0.0.1:5181/', outDir = 'docs/visual/scratch', ...rest] = process.argv;
const opt = (name, def) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : def;
};
const locale = opt('locale', 'de');
const width = Number(opt('width', '412'));
const height = Number(opt('height', '915'));
const font = Number(opt('font', '100'));
const days = Number(opt('day', '21'));
const reduce = opt('motion', 'no-preference') === 'reduce';
const only = opt('only', '') ? new Set(opt('only', '').split(',')) : null;
const measureContrast = rest.includes('--contrast');
const measureFrames = rest.includes('--frames');
const IMAGE_BUDGET_KB = 600;
const L = locale === 'de';
const tag = `${locale}-${width}${font !== 100 ? `-font${font}` : ''}${reduce ? '-reduce' : ''}`;

/** First answer combination (questionnaire order) that gives a main archetype and a second voice. */
function answersWithSecondVoice() {
  const qs = CONTENT.questions;
  for (let seed = 0; seed < 5000; seed++) {
    let n = seed;
    const answers = {};
    for (const q of qs) {
      answers[q.id] = q.answers[n % q.answers.length].id;
      n = Math.floor(n / q.answers.length);
    }
    const r = scoreArchetype(qs, answers);
    if (r.archetypeId && r.complementId) return { answers, result: r };
  }
  throw new Error('no answer set with a second voice');
}

const keyFor = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return localDateKey(d);
};

const { answers, result } = answersWithSecondVoice();
const profile = {
  answers,
  themeId: 'self',
  archetypeId: result.archetypeId,
  archetypeSource: 'questions',
  secondaryArchetypeId: result.complementId,
  scores: result.scores,
  questionnaireVersion: QUESTIONNAIRE_VERSION,
  profileVersion: PROFILE_VERSION,
  updatedAt: new Date().toISOString(),
};
const NOTES = {
  3: L ? 'Heute fiel mir auf, wie still der Morgen war.' : 'Today I noticed how quiet the morning was.',
  6: L ? 'Die Karte passte zu dem Gespräch am Abend.' : 'The card fitted the conversation in the evening.',
};
const records = Array.from({ length: days }, (_, i) => {
  const dateKey = keyFor(days - 1 - i);
  const card = CONTENT.cards[(i * 5 + 3) % CONTENT.cards.length];
  return {
    dateKey,
    deckId: CONTENT.deckId,
    cardId: card.id,
    themeId: i % 4 === 1 ? 'love' : 'self',
    archetypeId: profile.archetypeId,
    locale,
    contentVersion: CONTENT.version,
    content: composeDaily(CONTENT, card.id, i % 4 === 1 ? 'love' : 'self', profile.archetypeId, locale),
    revealedAt: new Date(`${dateKey}T08:00:00`).toISOString(),
    note: NOTES[i + 1] ?? '',
  };
});

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: L ? 'de-DE' : 'en-US',
  reducedMotion: reduce ? 'reduce' : 'no-preference',
  bypassCSP: font !== 100,
});
const page = await context.newPage();
const errors = [];
const requests = [];
const contrasts = [];
const shots = [];
const images = [];
const frames = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));
page.on('request', (r) => {
  const u = new URL(r.url());
  if (!['127.0.0.1', 'localhost'].includes(u.hostname) && !u.protocol.startsWith('data') && !u.protocol.startsWith('blob')) requests.push(r.url());
});

async function settle(ms = 600) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(ms);
}

async function shot(name, { long = false } = {}) {
  await page.waitForTimeout(250);
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
    // Buttons and links whose label does not fit their box.
    for (const el of document.querySelectorAll('button, a')) {
      if (el.closest('[aria-hidden="true"]')) continue;
      // The label's own box against the padding box (scrollWidth would also count the shimmer
      // pseudo-element of focused ritual buttons).
      if (getComputedStyle(el).overflow === 'visible') continue;
      const range = document.createRange();
      range.selectNodeContents(el);
      const text = range.getBoundingClientRect();
      const box = el.getBoundingClientRect();
      if (text.width > 0 && (text.left < box.left - 1 || text.right > box.right + 1)) cut.push(`${el.tagName.toLowerCase()} label cut "${el.textContent.trim().slice(0, 30)}"`);
    }
    return { page: document.documentElement.scrollWidth - vw, cut };
  });
  if (over.page > 0) errors.push(`${name}: page scrolls sideways by ${over.page}px`);
  for (const c of over.cut) errors.push(`${name}: ${c}`);
  if (measureContrast) contrasts.push(...(await auditContrast(page, name)));
  // Shipped images the screen references: <img> (current source), CSS backgrounds.
  const urls = await page.evaluate(() => {
    const out = new Set();
    for (const img of document.images) if (img.currentSrc || img.src) out.add(img.currentSrc || img.src);
    for (const el of document.querySelectorAll('*')) {
      const bg = getComputedStyle(el).backgroundImage;
      for (const m of bg.matchAll(/url\("?([^")]+)"?\)/g)) out.add(new URL(m[1], location.href).href);
    }
    return [...out];
  });
  let bytes = 0;
  const files = [];
  for (const u of urls) {
    const url = new URL(u);
    if (url.protocol === 'data:' || url.protocol === 'blob:') continue;
    const file = join('dist', decodeURIComponent(url.pathname.replace(/^\//, '')));
    const size = await stat(file).then((st) => st.size, () => 0);
    bytes += size;
    files.push(`${url.pathname} ${Math.round(size / 1024)} KB`);
  }
  const kb = Math.round(bytes / 1024);
  images.push({ screen: name, kb, files });
  if (kb > IMAGE_BUDGET_KB) errors.push(`${name}: images ${kb} KB > ${IMAGE_BUDGET_KB} KB`);
  const vp = page.viewportSize();
  if (long) {
    const extra = await page.evaluate(() => {
      const m = document.querySelector('.stage__main');
      return m ? m.scrollHeight - m.clientHeight : 0;
    });
    await page.setViewportSize({ width: vp.width, height: Math.min(vp.height + Math.max(0, extra), 9000) });
    await page.waitForTimeout(400);
  }
  const file = join(outDir, `v04-${name}-${tag}.png`);
  await page.screenshot({ path: file });
  if (long) await page.setViewportSize(vp);
  shots.push(file);
}

async function go(path, wait) {
  await page.goto(`${baseUrl}#${path}`);
  if (font !== 100) await page.addStyleTag({ content: `html{font-size:${font}%!important}` });
  if (wait) await page.waitForSelector(wait, { timeout: 15000 });
  await settle();
}
const want = (n) => !only || only.has(n);

// Fresh database, then the synthetic state (settings, profile, daily cards).
await page.goto(baseUrl);
await page.evaluate(
  ({ profile, records, locale }) =>
    new Promise((resolve) => {
      const del = indexedDB.deleteDatabase('personal-oracle');
      del.onsuccess = del.onerror = del.onblocked = () => {
        // Let the app create the schema first.
        resolve(null);
      };
    }).then(() => ({ profile, records, locale })),
  { profile, records, locale },
);
await page.goto(baseUrl);
await page.waitForSelector('.welcome__title, .today, .screen');
await page.evaluate(
  ({ profile, records, locale }) =>
    new Promise((resolve, reject) => {
      const r = indexedDB.open('personal-oracle');
      r.onsuccess = () => {
        const tx = r.result.transaction(['kv', 'daily'], 'readwrite');
        tx.objectStore('kv').put({ locale, motion: 'system', onboardingDone: true }, 'settings');
        tx.objectStore('kv').put(profile, 'profile');
        for (const rec of records) tx.objectStore('daily').put(rec);
        tx.oncomplete = () => {
          r.result.close();
          resolve(null);
        };
        tx.onerror = () => reject(tx.error);
      };
      r.onerror = () => reject(r.error);
    }),
  { profile, records, locale },
);
// The app read the empty database on its first start; load it again with the seeded state.
await page.reload();
await page.waitForSelector('.today, .screen');

if (want('reveal')) {
  await page.goto(`${baseUrl}#/archetype`);
  await page.reload();
  if (font !== 100) await page.addStyleTag({ content: `html{font-size:${font}%!important}` });
  await page.waitForSelector('.reveal__portrait img');
  if (!reduce) {
    await page.waitForTimeout(1200);
    await page.screenshot({ path: join(outDir, `v04-reveal-moment-${tag}.png`) });
    shots.push(join(outDir, `v04-reveal-moment-${tag}.png`));
  }
  await page.waitForTimeout(reduce ? 600 : 4600);
  await page.evaluate(() => document.querySelector('.reveal__portrait img')?.decode?.());
  await shot('reveal');
  await shot('reveal-lang', { long: true });
}
if (want('why')) {
  await go('/archetype/why?from=/me', '.why__bars');
  await shot('why', { long: true });
}
if (want('me')) {
  await go('/me', '.me__pillar');
  await page.waitForSelector('.arch-profile__description', { timeout: 15000 });
  await settle(800);
  await shot('ich');
  await shot('ich-lang', { long: true });
}
if (want('settings')) {
  await go('/me/settings', '.profile__settings');
  await shot('einstellungen');
}
if (want('grimoire')) {
  await go('/grimoire', '.grimoire__entries');
  await shot('grimoire');
}
if (want('library')) {
  await go('/grimoire/archetypes', '.library__grid');
  await page.waitForTimeout(600);
  await shot('archetypen', { long: true });
}
if (want('detail')) {
  await go(`/grimoire/archetypes/${result.complementId}?from=/grimoire/archetypes`, '.arch-detail__hero');
  await page.waitForSelector('.arch-profile__description', { timeout: 15000 });
  await shot('archetyp-seite', { long: true });
}
if (want('journey')) {
  await go('/grimoire/journey', '.starmap');
  await page.waitForSelector('.journey-page__station', { timeout: 15000 });
  await shot('sternkarte');
  if (measureFrames) {
    // Scroll the page from top to bottom in 90 animation frames with the CPU throttled 4x and
    // record the time between frames (V04.5: ≤ 16 ms per frame with 400 days).
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const deltas = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const main = document.querySelector('.stage__main');
          const max = main.scrollHeight - main.clientHeight;
          const out = [];
          let last = performance.now();
          let i = 0;
          const step = (now) => {
            out.push(now - last);
            last = now;
            main.scrollTop = (max * i) / 90;
            if (++i <= 90) requestAnimationFrame(step);
            else resolve(out.slice(2));
          };
          requestAnimationFrame(step);
        }),
    );
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    const sorted = [...deltas].sort((a, b) => a - b);
    const q = (f) => Math.round(sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * f))] * 10) / 10;
    frames.push({ screen: 'sternkarte', days, frames: sorted.length, median: q(0.5), p95: q(0.95), max: Math.round(sorted.at(-1) * 10) / 10 });
    await page.evaluate(() => (document.querySelector('.stage__main').scrollTop = 0));
  }
  await shot('sternkarte-lang', { long: true });
}
if (want('review')) {
  await go('/grimoire/review/week/1?from=/grimoire/journey', '.review-page__text p');
  await shot('rueckblick', { long: true });
}
if (want('chapter')) {
  await go('/grimoire/chapter/1?from=/grimoire/journey', '.chapter-page__text');
  await shot('kapitel', { long: true });
}
if (want('share')) {
  await go('/share/archetype?from=/me', '.share-page__preview');
  await page.waitForSelector('.share-page__preview img', { timeout: 15000 });
  const storyMs = await page.locator('.share-page__preview').getAttribute('data-export-ms');
  await shot('teilen-story');
  await page.getByRole('radio', { name: L ? 'Beitrag 4:5' : 'Post 4:5' }).click();
  await page.waitForSelector('.share-page__preview--feed img', { timeout: 15000 });
  const feedMs = await page.locator('.share-page__preview').getAttribute('data-export-ms');
  await shot('teilen-feed');
  console.error(`export ms: story ${storyMs}, feed ${feedMs}`);
}
if (want('today')) {
  await go('/today', '.today');
  await page.waitForSelector('.milestone-moment', { timeout: 15000 });
  await settle(900);
  await page.locator('.milestone-moment').scrollIntoViewIfNeeded();
  await settle(300);
  await shot('heute-meilenstein');
}

await browser.close();
const fails = contrasts.filter((r) => !r.pass);
const worst = [...contrasts].filter((r) => !r.gradient).sort((a, b) => a.p95 / a.min - b.p95 / b.min).slice(0, 6);
console.log(
  JSON.stringify(
    {
      profile: { main: profile.archetypeId, second: profile.secondaryArchetypeId, days },
      shots,
      errors,
      externalRequests: requests,
      contrast: measureContrast ? { texts: contrasts.length, fails, worst } : undefined,
      images: images.map(({ screen, kb }) => `${screen} ${kb} KB`),
      heaviest: [...images].sort((a, b) => b.kb - a.kb)[0],
      frames: measureFrames ? frames : undefined,
    },
    null,
    2,
  ),
);
if (errors.length || fails.length || requests.length) process.exitCode = 1;
