// Reproducible web performance measurement (before/after the visual overhaul).
// Usage: node scripts/perf.mjs <baseUrl> [--runs 5] [--out docs/visual/perf/<name>.json]
//
// Fixed conditions: Playwright Chromium (headless), 412×915 @2x mobile, de-DE,
// CPU throttled 4×, network emulated (40 ms RTT, 10 Mbit/s down, 5 Mbit/s up),
// browser cache disabled for every run. Serve the production build with
// `npm run build && npm run preview` (port 5181) before running this.
//
// Scenarios (median of N runs each):
//   first-launch  fresh profile → welcome screen visible
//   today         returning user (onboarding done) → "Heute" with covered card
//   reveal        tap "Karte enthüllen" → frames rendered during 1.5 s of reveal
//   idle          12 s after the reveal: running animations (should become 0)
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const [, , baseUrl = 'http://127.0.0.1:5181/', ...rest] = process.argv;
const opt = (name, def) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : def;
};
const runs = Number(opt('runs', '5'));
const out = opt('out', '');

const NET = { offline: false, latency: 40, downloadThroughput: (10e6 / 8), uploadThroughput: (5e6 / 8) };
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : Math.round((s[s.length / 2 - 1] + s[s.length / 2]) / 2);
};

const browser = await chromium.launch();

async function newContext() {
  return browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    locale: 'de-DE',
  });
}

async function instrument(page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', NET);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const bytes = { total: 0, images: 0 };
  const types = new Map();
  cdp.on('Network.responseReceived', (e) => types.set(e.requestId, e.type));
  cdp.on('Network.loadingFinished', (e) => {
    bytes.total += e.encodedDataLength;
    if (types.get(e.requestId) === 'Image') bytes.images += e.encodedDataLength;
  });
  await page.addInitScript(() => {
    window.__lcp = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__lcp = e.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  return { cdp, bytes };
}

async function paintMetrics(page) {
  return page.evaluate(() => {
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? NaN;
    return { fcp: Math.round(fcp), lcp: Math.round(window.__lcp) };
  });
}

const results = { conditions: { viewport: '412x915@2', cpu: '4x', net: '40ms/10Mbit', cache: 'disabled', runs }, scenarios: {} };

// ── first-launch ────────────────────────────────────────────────────────────
{
  const rows = [];
  for (let i = 0; i < runs; i++) {
    const ctx = await newContext();
    const page = await ctx.newPage();
    const { bytes } = await instrument(page);
    const t0 = Date.now();
    await page.goto(baseUrl);
    await page.waitForSelector('.welcome__title');
    const ready = Date.now() - t0;
    await page.waitForLoadState('networkidle');
    rows.push({ ready, ...(await paintMetrics(page)), kb: Math.round(bytes.total / 1024), imgKb: Math.round(bytes.images / 1024) });
    await ctx.close();
  }
  results.scenarios['first-launch'] = summarize(rows);
}

// ── returning user: onboarding once, then N cold loads of "Heute" ───────────
{
  const ctx = await newContext();
  const setup = await ctx.newPage();
  await setup.goto(baseUrl);
  await setup.getByRole('button', { name: 'Beginnen' }).click();
  // Answer until the theme step shows: four questions in the reference build, seven from V04.1.
  for (let i = 0; i < 12 && !(await setup.locator('#theme-prompt').isVisible()); i++) {
    await setup.getByRole('radio').nth(i % 4).click();
    await setup.waitForTimeout(450);
  }
  await setup.getByRole('radio').nth(1).click();
  await setup.getByRole('button', { name: 'Archetyp enthüllen' }).click();
  await setup.waitForSelector('.archetype__name');
  await setup.getByRole('button', { name: 'Zur Tageskarte' }).click();
  await setup.waitForSelector('.today__cta');
  await setup.close();

  const rows = [];
  const reveal = [];
  const idle = [];
  for (let i = 0; i < runs; i++) {
    const page = await ctx.newPage();
    const { bytes } = await instrument(page);
    const t0 = Date.now();
    await page.goto(baseUrl);
    // Covered card (first run of the day) or revealed reading (later runs).
    await page.waitForSelector('.today__cta, .today__reading');
    const ready = Date.now() - t0;
    await page.waitForLoadState('networkidle');
    rows.push({ ready, ...(await paintMetrics(page)), kb: Math.round(bytes.total / 1024), imgKb: Math.round(bytes.images / 1024) });

    // Reveal smoothness: count animation frames for 1.5 s after the tap. Only possible
    // while the daily card is still covered, i.e. on the first run of the day.
    const cta = page.getByRole('button', { name: 'Karte enthüllen' });
    if (await cta.count()) {
      await page.evaluate(() => {
        window.__frames = [];
        const tick = (t) => {
          window.__frames.push(t);
          if (window.__frames.length < 400) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      await cta.click();
      await page.waitForTimeout(1500);
      reveal.push(
        await page.evaluate(() => {
          const f = window.__frames;
          const gaps = f.slice(1).map((t, j) => t - f[j]);
          const span = f[f.length - 1] - f[0];
          return { fps: Math.round((f.length - 1) / (span / 1000)), worstFrameMs: Math.round(Math.max(...gaps)), jank: gaps.filter((g) => g > 50).length };
        }),
      );
    }
    await page.waitForTimeout(12000);
    idle.push({ runningAnimations: await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length) });
    await page.close();
  }
  results.scenarios.today = summarize(rows);
  results.scenarios.reveal = reveal.length ? summarize(reveal) : 'not measured (card already revealed)';
  results.scenarios.idle = summarize(idle);
  await ctx.close();
}

await browser.close();

function summarize(rows) {
  const keys = Object.keys(rows[0]);
  return Object.fromEntries(keys.map((k) => [k, { median: median(rows.map((r) => r[k])), runs: rows.map((r) => r[k]) }]));
}

console.log(JSON.stringify(results, null, 2));
if (out) {
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, JSON.stringify({ measuredAt: new Date().toISOString(), baseUrl, ...results }, null, 2));
}
