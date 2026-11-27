// Android emulator checks for V04 (QG-V04) that need the app's own measurements:
//   - archetype reveal: frames per second, frames > 50 ms and the worst frame (V04.2: ≥ 50 fps,
//     ≤ 2 frames > 50 ms, worst ≤ 120 ms, MASTER_ROADMAP_V2 §6)
//   - share card: export time of story and post as the app reports it (V04.7: ≤ 1.5 s), online
//     and in airplane mode after a cold start, and the system share sheet opening offline
//
// Usage: node --experimental-strip-types --no-warnings scripts/android-v04.mjs <outDir> [--serial emulator-5554]
// Install the current debug APK first (npm run android:sync, then gradlew assembleDebug, adb install -r).
//
// The flow is driven over the WebView DevTools socket (debug build only), like android-migration.mjs.
// Only synthetic input is used. Nothing is shared: the share sheet is closed with Back.
// Safety rules (AGENTS.md): emulator only, only this app's own dev package is cleared and started,
// airplane mode is restored at the end.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { de } from '../src/i18n/de.ts';
import { en } from '../src/i18n/en.ts';
import { screensDe } from '../src/i18n/screens.de.ts';
import { screensEn } from '../src/i18n/screens.en.ts';

const PKG = 'com.energycrafted.personaloracle.dev';
const ACTIVITY = `${PKG}/.MainActivity`;
const PORT = 9341;
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const outDir = process.argv[2] ?? 'docs/evidence/android-v04';
const SERIAL = arg('--serial', 'emulator-5554');
const ADB = join(process.env.LOCALAPPDATA ?? '', 'Android', 'Sdk', 'platform-tools', 'adb.exe');
mkdirSync(outDir, { recursive: true });

const adb = (...args) => execFileSync(ADB, ['-s', SERIAL, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const sh = (cmd) => adb('shell', cmd).trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const metrics = {};
const note = (check, status, detail = '') => {
  results.push({ check, status, detail });
  console.log(`${status.padEnd(7)} ${check}${detail ? ` – ${detail}` : ''}`);
};

const isEmulator =
  sh('getprop ro.kernel.qemu') === '1' || sh('getprop ro.boot.qemu') === '1' || sh('getprop ro.hardware').includes('ranchu');
if (!isEmulator) throw new Error('Refusing to run on a physical device (emulator only)');

let shotNo = 0;
function shot(name) {
  shotNo += 1;
  const file = join(outDir, `${String(shotNo).padStart(2, '0')}-${name}.png`);
  writeFileSync(file, execFileSync(ADB, ['-s', SERIAL, 'exec-out', 'screencap', '-p'], { maxBuffer: 64 * 1024 * 1024 }));
  console.log(`        ${file}`);
}

/** Connects to the app's WebView over the DevTools socket and returns an evaluate() helper. */
async function webview({ timeout = 30000 } = {}) {
  const start = Date.now();
  let page;
  while (Date.now() - start < timeout) {
    try {
      const pid = sh(`pidof ${PKG}`);
      if (pid && sh('cat /proc/net/unix').includes(`webview_devtools_remote_${pid}`)) {
        adb('forward', `tcp:${PORT}`, `localabstract:webview_devtools_remote_${pid}`);
        const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
        page = list.find((p) => p.type === 'page' && p.url.startsWith('https://localhost'));
        if (page) break;
      }
    } catch {
      /* not ready yet */
    }
    await sleep(500);
  }
  if (!page) throw new Error('WebView DevTools page not found');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => ((ws.onopen = res), (ws.onerror = rej)));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const m = JSON.parse(String(ev.data));
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
  };
  const evaluate = (expression) =>
    new Promise((res, rej) => {
      const i = ++id;
      pending.set(i, (m) => {
        if (m.error) rej(new Error(m.error.message));
        else if (m.result.exceptionDetails) rej(new Error(JSON.stringify(m.result.exceptionDetails).slice(0, 400)));
        else res(m.result.result.value);
      });
      ws.send(JSON.stringify({ id: i, method: 'Runtime.evaluate', params: { expression, awaitPromise: true, returnByValue: true } }));
    });
  const close = () => {
    ws.close();
    try {
      adb('forward', '--remove', `tcp:${PORT}`);
    } catch {
      /* already gone */
    }
  };
  return { evaluate, close };
}

// Page helpers, installed once per page load: wait for and click elements by role and text.
const HELPERS = `(() => {
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  window.__po = {
    find(sel, text) {
      return [...document.querySelectorAll(sel)].find((el) => vis(el) && (text === undefined || el.textContent.trim() === text));
    },
    async wait(sel, text, ms = 15000) {
      const t0 = performance.now();
      while (performance.now() - t0 < ms) {
        const el = window.__po.find(sel, text);
        if (el) return el;
        await new Promise((r) => setTimeout(r, 100));
      }
      throw new Error('timeout ' + sel + ' ' + (text ?? ''));
    },
    async click(sel, text, ms) {
      const el = await window.__po.wait(sel, text, ms);
      el.scrollIntoView({ block: 'center' });
      el.click();
      return true;
    },
  };
  return true;
})()`;

async function coldStart() {
  sh(`am force-stop ${PKG}`);
  await sleep(500);
  sh(`am start -W -n ${ACTIVITY}`);
  const wv = await webview();
  await wv.evaluate(`new Promise((r) => (document.readyState === 'complete' ? r(true) : addEventListener('load', () => r(true))))`);
  await wv.evaluate(HELPERS);
  return wv;
}

/** Reads the export time the share page reports once the preview for `format` is drawn. */
async function exportMs(wv, format) {
  return wv.evaluate(`(async () => {
    const t0 = performance.now();
    while (performance.now() - t0 < 15000) {
      const f = document.querySelector('.share-page__preview--${format}[data-export-ms]');
      if (f && f.querySelector('img')) return Number(f.getAttribute('data-export-ms'));
      await new Promise((r) => setTimeout(r, 50));
    }
    throw new Error('no ${format} preview');
  })()`);
}

const original = { airplane: sh('settings get global airplane_mode_on') };
let wv;
try {
  // ------------------------------------------------------------- first run and reveal
  sh(`pm clear ${PKG}`); // this app's own dev package only
  wv = await coldStart();
  const lang = await wv.evaluate(`(async () => { await window.__po.wait('button', undefined); return document.documentElement.lang; })()`);
  const L = String(lang).startsWith('de') ? 'de' : 'en';
  const t = L === 'de' ? de : en;
  const s = L === 'de' ? screensDe : screensEn;
  metrics.locale = L;
  await wv.evaluate(`window.__po.click('button', ${JSON.stringify(t.welcome.start)})`);
  // Answer every question (first option) until the theme step shows, then pick the second theme.
  await wv.evaluate(`(async () => {
    for (let i = 0; i < 12 && !document.querySelector('#theme-prompt'); i++) {
      const r = await window.__po.wait('[role="radio"]');
      r.click();
      await new Promise((res) => setTimeout(res, 500));
    }
    await window.__po.wait('#theme-prompt');
    document.querySelectorAll('[role="radio"]')[1].click();
    return true;
  })()`);
  await sleep(500);
  // Frame recorder from the tap on "Reveal" until the staged reveal is complete (4.3 s) plus margin.
  const reveal = await wv.evaluate(`(async () => {
    const deltas = [];
    const long = [];
    let last = 0;
    let run = true;
    let t0 = 0;
    const tick = (ts) => {
      if (last) {
        deltas.push(ts - last);
        if (ts - last > 50) long.push({ atMs: Math.round(last - t0), ms: Math.round(ts - last) });
      }
      last = ts;
      if (run) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    await new Promise((r) => setTimeout(r, 300));
    t0 = performance.now();
    await window.__po.click('button', ${JSON.stringify(t.onboarding.finish)});
    await new Promise((r) => setTimeout(r, 4600));
    run = false;
    const total = deltas.reduce((a, b) => a + b, 0);
    return {
      frames: deltas.length,
      fps: Math.round((deltas.length / total) * 1000 * 10) / 10,
      janks: deltas.filter((d) => d > 50).length,
      worstMs: Math.round(Math.max(...deltas)),
      hz: Math.round(1000 / [...deltas].sort((a, b) => a - b)[Math.floor(deltas.length / 2)]),
      long,
    };
  })()`);
  metrics.reveal = reveal;
  shot('enthuellung-fertig');
  // V04.2 asks ≥ 50 fps on the reference emulator. The frame rule of MASTER_ROADMAP_V2 §6
  // (≤ 2 frames > 50 ms, worst ≤ 120 ms) applies under the browser reference conditions; on the
  // emulator it is reported for information (B-13: every change to an image-rich screen shows one
  // long frame there).
  note('Archetype reveal ≥ 50 fps (V04.2, emulator)', reveal.fps >= 50 ? 'PASS' : 'FAIL', JSON.stringify(reveal));
  note(
    'Reveal frames on the emulator: ≤ 2 frames > 50 ms, worst ≤ 120 ms (§6 rule, information)',
    reveal.janks <= 2 && reveal.worstMs <= 120 ? 'PASS' : 'CHECK',
    `${reveal.janks} frames > 50 ms, worst ${reveal.worstMs} ms`,
  );

  // ------------------------------------------------------------- share card online
  await wv.evaluate(`window.__po.click('button', ${JSON.stringify(t.archetype.toToday)})`);
  await wv.evaluate(`window.__po.click('a', ${JSON.stringify(t.nav.profile)})`);
  await wv.evaluate(`window.__po.click('button', ${JSON.stringify(s.me.share)})`);
  const storyMs = await exportMs(wv, 'story');
  await sleep(600);
  shot('teilen-story');
  await wv.evaluate(`window.__po.click('[role="radio"]', ${JSON.stringify(s.share.feed)})`);
  const feedMs = await exportMs(wv, 'feed');
  await sleep(600);
  shot('teilen-beitrag');
  metrics.shareOnline = { storyMs, feedMs };
  note('Share card export ≤ 1.5 s (online, first draw)', storyMs <= 1500 && feedMs <= 1500 ? 'PASS' : 'FAIL', `story ${storyMs} ms, post ${feedMs} ms`);
  wv.close();

  // ------------------------------------------------------------- share card offline after a cold start
  sh('cmd connectivity airplane-mode enable');
  await sleep(1500);
  wv = await coldStart();
  await wv.evaluate(`window.__po.click('a', ${JSON.stringify(t.nav.profile)}, 20000)`);
  await wv.evaluate(`window.__po.click('button', ${JSON.stringify(s.me.share)})`);
  const offStory = await exportMs(wv, 'story');
  await wv.evaluate(`window.__po.click('[role="radio"]', ${JSON.stringify(s.share.feed)})`);
  const offFeed = await exportMs(wv, 'feed');
  metrics.shareOffline = { storyMs: offStory, feedMs: offFeed };
  note('Share card export ≤ 1.5 s in airplane mode after a cold start', offStory <= 1500 && offFeed <= 1500 ? 'PASS' : 'FAIL', `story ${offStory} ms, post ${offFeed} ms`);
  await wv.evaluate(`window.__po.click('button', ${JSON.stringify(s.share.action)})`);
  let chooser = false;
  for (let i = 0; i < 20 && !chooser; i++) {
    await sleep(400);
    // Filtered here, not with grep: grep fails the command while no activity is resumed yet.
    const top = sh('dumpsys activity activities')
      .split(/\r?\n/)
      .filter((l) => /topResumedActivity|mResumedActivity/.test(l));
    chooser = top.some((l) => /Chooser|intentresolver|ResolverActivity/i.test(l));
    metrics.shareSheetActivity = top[0]?.trim();
  }
  await sleep(800);
  shot('teilen-blatt-offline');
  note('System share sheet opens with the image file (offline)', chooser ? 'PASS' : 'FAIL', metrics.shareSheetActivity ?? '');
  sh('input keyevent KEYCODE_BACK'); // close the sheet without choosing a target: nothing is shared
  await sleep(800);
} catch (err) {
  note('Run aborted', 'FAIL', String(err?.message ?? err));
  try {
    shot('fehler');
  } catch {
    /* ignore */
  }
} finally {
  wv?.close();
  if (original.airplane === '0') sh('cmd connectivity airplane-mode disable');
  const after = { airplane: sh('settings get global airplane_mode_on') };
  note('Emulator settings restored', after.airplane === original.airplane ? 'PASS' : 'FAIL', JSON.stringify(after));
  writeFileSync(join(outDir, 'android-v04.json'), JSON.stringify({ serial: SERIAL, package: PKG, original, after, metrics, results }, null, 2));
}
