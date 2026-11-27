// Android emulator diagnosis for screen changes and the share export (B-13, B-14; V07.5 on a device).
// Drives the first run like android-v04.mjs over the WebView DevTools socket and measures:
//   - frames around the tap on "finish" of the questionnaire (the archetype reveal),
//   - optionally a Chrome trace of that moment and of the first share export (--no-trace to skip),
//   - optionally the first share export right after the questionnaire (--no-share to skip),
//   - optionally tab switches for comparison (--tabs),
//   - optionally with injected CSS or JS before the tap, to test a hypothesis (--css file, --js file).
// Traces are written to <outDir>/trace-*.json; break them down with scripts/trace-analyze.mjs.
//
// Usage: node --experimental-strip-types --no-warnings scripts/android-trace.mjs <outDir>
//          [--no-trace] [--no-share] [--tabs] [--css file] [--js file]
// Debug build only; emulator only; only this app's own dev package is cleared and started.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { de } from '../src/i18n/de.ts';
import { en } from '../src/i18n/en.ts';
import { screensDe } from '../src/i18n/screens.de.ts';
import { screensEn } from '../src/i18n/screens.en.ts';

const PKG = 'com.energycrafted.personaloracle.dev';
const ACTIVITY = `${PKG}/.MainActivity`;
const PORT = 9342;
const SERIAL = 'emulator-5554';
const outDir = process.argv[2];
const withShare = !process.argv.includes('--no-share');
const withTrace = !process.argv.includes('--no-trace');
const cssArg = process.argv.indexOf('--css');
const jsArg = process.argv.indexOf('--js');
const injectJs = jsArg > 0 ? readFileSync(process.argv[jsArg + 1], 'utf8') : '';
const injectCss = cssArg > 0 ? readFileSync(process.argv[cssArg + 1], 'utf8') : '';
mkdirSync(outDir, { recursive: true });
const ADB = join(process.env.LOCALAPPDATA ?? '', 'Android', 'Sdk', 'platform-tools', 'adb.exe');
const adb = (...args) => execFileSync(ADB, ['-s', SERIAL, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const sh = (cmd) => adb('shell', cmd).trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect() {
  const start = Date.now();
  let page;
  while (Date.now() - start < 30000) {
    try {
      const pid = sh(`pidof ${PKG}`);
      if (pid && sh('cat /proc/net/unix').includes(`webview_devtools_remote_${pid}`)) {
        adb('forward', `tcp:${PORT}`, `localabstract:webview_devtools_remote_${pid}`);
        const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
        page = list.find((p) => p.type === 'page' && p.url.startsWith('https://localhost'));
        if (page) break;
      }
    } catch {
      /* not ready */
    }
    await sleep(500);
  }
  if (!page) throw new Error('no page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => ((ws.onopen = res), (ws.onerror = rej)));
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (ev) => {
    const m = JSON.parse(String(ev.data));
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    } else if (m.method) for (const l of listeners) l(m);
  };
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const i = ++id;
      pending.set(i, (m) => (m.error ? rej(new Error(method + ': ' + m.error.message)) : res(m.result)));
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400));
    return r.result.value;
  };
  const close = () => {
    ws.close();
    try {
      adb('forward', '--remove', `tcp:${PORT}`);
    } catch {
      /* gone */
    }
  };
  return { send, evaluate, close, on: (f) => listeners.push(f) };
}

const HELPERS = `(() => {
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  window.__po = {
    find(sel, text) { return [...document.querySelectorAll(sel)].find((el) => vis(el) && (text === undefined || el.textContent.trim() === text)); },
    async wait(sel, text, ms = 15000) {
      const t0 = performance.now();
      while (performance.now() - t0 < ms) { const el = window.__po.find(sel, text); if (el) return el; await new Promise((r) => setTimeout(r, 100)); }
      throw new Error('timeout ' + sel + ' ' + (text ?? ''));
    },
    async click(sel, text, ms) { const el = await window.__po.wait(sel, text, ms); el.scrollIntoView({ block: 'center' }); el.click(); return true; },
  };
  return true;
})()`;

async function startTrace(c) {
  if (!withTrace) return null;
  const events = [];
  let done;
  const finished = new Promise((r) => (done = r));
  c.on((m) => {
    if (m.method === 'Tracing.dataCollected') events.push(...m.params.value);
    if (m.method === 'Tracing.tracingComplete') done();
  });
  await c.send('Tracing.start', {
    transferMode: 'ReportEvents',
    traceConfig: {
      recordMode: 'recordAsMuchAsPossible',
      includedCategories: [
        'devtools.timeline',
        'disabled-by-default-devtools.timeline',
        'disabled-by-default-devtools.timeline.frame',
        'blink.user_timing',
        'v8.execute',
        'v8',
        'blink',
        'cc',
        'gpu',
        'loading',
        'toplevel',
        'benchmark',
      ],
    },
  });
  return async (name) => {
    await c.send('Tracing.end');
    await finished;
    writeFileSync(join(outDir, `${name}.json`), JSON.stringify({ traceEvents: events }));
    return events.length;
  };
}

const out = {};
sh(`pm clear ${PKG}`);
sh(`am start -W -n ${ACTIVITY}`);
let c = await connect();
await c.evaluate(`new Promise((r) => (document.readyState === 'complete' ? r(true) : addEventListener('load', () => r(true))))`);
await c.evaluate(HELPERS);
const lang = await c.evaluate(`(async () => { await window.__po.wait('button', undefined); return document.documentElement.lang; })()`);
const L = String(lang).startsWith('de') ? 'de' : 'en';
const t = L === 'de' ? de : en;
const s = L === 'de' ? screensDe : screensEn;
await c.evaluate(`window.__po.click('button', ${JSON.stringify(t.welcome.start)})`);
await c.evaluate(`(async () => {
  for (let i = 0; i < 12 && !document.querySelector('#theme-prompt'); i++) {
    const r = await window.__po.wait('[role="radio"]'); r.click(); await new Promise((res) => setTimeout(res, 500));
  }
  await window.__po.wait('#theme-prompt');
  document.querySelectorAll('[role="radio"]')[1].click();
  return true;
})()`);
if (injectCss) await c.evaluate(`(() => { const st = document.createElement('style'); st.textContent = ${JSON.stringify(injectCss)}; document.head.append(st); return true; })()`);
if (injectJs) console.log('js', JSON.stringify(await c.evaluate(injectJs)));
await sleep(1500);
const stopReveal = await startTrace(c);
out.reveal = await c.evaluate(`(async () => {
  const deltas = []; const long = []; let last = 0; let run = true; let t0 = 0;
  const tick = (ts) => { if (last) { deltas.push(ts - last); if (ts - last > 50) long.push({ atMs: Math.round(last - t0), ms: Math.round(ts - last) }); } last = ts; if (run) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  await new Promise((r) => setTimeout(r, 300));
  t0 = performance.now();
  performance.mark('diag:tap');
  await window.__po.click('button', ${JSON.stringify(t.onboarding.finish)});
  await new Promise((r) => setTimeout(r, 4600));
  run = false;
  const total = deltas.reduce((a, b) => a + b, 0);
  return { fps: Math.round((deltas.length / total) * 10000) / 10, janks: deltas.filter((d) => d > 50).length, worstMs: Math.round(Math.max(...deltas)), long };
})()`);
if (stopReveal) out.revealEvents = await stopReveal('trace-reveal');
console.log('reveal', JSON.stringify(out.reveal));

if (process.argv.includes('--tabs')) {
  await c.evaluate(`window.__po.click('button', ${JSON.stringify(t.archetype.toToday)})`);
  await sleep(4000);
  out.tabs = [];
  for (const label of [t.nav.grimoire, t.nav.oracle, t.nav.profile, t.nav.today]) {
    const r = await c.evaluate(`(async () => {
      const deltas = []; let last = 0; let run = true;
      const tick = (ts) => { if (last) deltas.push(ts - last); last = ts; if (run) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
      await new Promise((r) => setTimeout(r, 300));
      await window.__po.click('a', ${JSON.stringify(label)});
      await new Promise((r) => setTimeout(r, 1500));
      run = false;
      return { to: ${JSON.stringify(label)}, janks: deltas.filter((d) => d > 50).length, worstMs: Math.round(Math.max(...deltas)) };
    })()`);
    out.tabs.push(r);
    await sleep(2500);
  }
  console.log('tabs', JSON.stringify(out.tabs));
}
if (withShare) {
  await c.evaluate(`window.__po.click('button', ${JSON.stringify(t.archetype.toToday)})`);
  await c.evaluate(`window.__po.click('a', ${JSON.stringify(t.nav.profile)})`);
  await sleep(300);
  const stopShare = await startTrace(c);
  out.share = await c.evaluate(`(async () => {
    performance.mark('diag:share');
    const t0 = performance.now();
    await window.__po.click('button', ${JSON.stringify(s.me.share)});
    while (performance.now() - t0 < 20000) {
      const f = document.querySelector('.share-page__preview--story[data-export-ms]');
      if (f && f.querySelector('img')) break;
      await new Promise((r) => setTimeout(r, 50));
    }
    const f = document.querySelector('.share-page__preview--story[data-export-ms]');
    const marks = performance.getEntriesByType('mark').filter((m) => m.name.startsWith('share:') || m.name === 'diag:share').map((m) => [m.name, Math.round(m.startTime - t0)]);
    return { exportMs: f ? Number(f.getAttribute('data-export-ms')) : null, shownMs: Math.round(performance.now() - t0), marks };
  })()`);
  if (stopShare) out.shareEvents = await stopShare('trace-share');
  console.log('share', JSON.stringify(out.share));
}
c.close();
writeFileSync(join(outDir, 'result.json'), JSON.stringify(out, null, 2));
