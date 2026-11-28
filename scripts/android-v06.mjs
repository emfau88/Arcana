// Android emulator check for V06 step 4 (Discover): five labelled tabs at system font 1.0, 1.3 and
// 2.0, the hardware back gesture through every Discover level, and screenshots.
// Usage: node --experimental-strip-types scripts/android-v06.mjs <outDir> [--serial emulator-5554]
// Install the debug APK first (adb -s emulator-5554 install -r android/app/build/outputs/apk/debug/app-debug.apk).
//
// Safety rules (AGENTS.md): only the emulator given by --serial is used (a physical device is
// refused), only this app's own development package is cleared and launched, and the system font
// scale is restored at the end.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { de } from '../src/i18n/de.ts';
import { en } from '../src/i18n/en.ts';
import { discoverDe } from '../src/i18n/discover.de.ts';
import { discoverEn } from '../src/i18n/discover.en.ts';

const PKG = 'com.energycrafted.personaloracle.dev';
const ACTIVITY = `${PKG}/.MainActivity`;
const PORT = 9342;
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const outDir = process.argv[2] ?? 'docs/evidence/android-v06';
const SERIAL = arg('--serial', 'emulator-5554');
const ADB = join(process.env.LOCALAPPDATA ?? '', 'Android', 'Sdk', 'platform-tools', 'adb.exe');
mkdirSync(outDir, { recursive: true });

const adb = (...args) => execFileSync(ADB, ['-s', SERIAL, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const sh = (cmd) => adb('shell', cmd).trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const note = (check, status, detail = '') => {
  results.push({ check, status, detail });
  console.log(`${status.padEnd(7)} ${check}${detail ? ` – ${detail}` : ''}`);
};

const isEmulator = sh('getprop ro.kernel.qemu') === '1' || sh('getprop ro.boot.qemu') === '1' || sh('getprop ro.hardware').includes('ranchu');
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

const HELPERS = `(() => {
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  window.__po = {
    find(sel, text) {
      return [...document.querySelectorAll(sel)].find((el) => vis(el) && (text === undefined || el.textContent.trim().includes(text)));
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
    tabGap() {
      const rs = [...document.querySelectorAll('.tabbar__label')].map((l) => l.getBoundingClientRect());
      let gap = 99;
      for (let i = 1; i < rs.length; i++) gap = Math.min(gap, rs[i].left - rs[i - 1].right);
      return { labels: rs.length, gap: Math.round(gap * 10) / 10, size: getComputedStyle(document.querySelector('.tabbar__label')).fontSize };
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

const hashOf = (wv) => wv.evaluate('location.hash');
/** Hardware back (KEYCODE_BACK), then the hash it led to. */
async function back(wv) {
  sh('input keyevent 4');
  await sleep(700);
  return hashOf(wv);
}

const originalScale = sh('settings get system font_scale');
let wv;
try {
  sh(`pm clear ${PKG}`); // this app's own dev package only
  wv = await coldStart();
  const lang = await wv.evaluate(`(async () => { await window.__po.wait('button', undefined); return document.documentElement.lang; })()`);
  const L = String(lang).startsWith('de') ? 'de' : 'en';
  const t = L === 'de' ? de : en;
  const d = L === 'de' ? discoverDe : discoverEn;
  await wv.evaluate(`window.__po.click('button', ${JSON.stringify(t.welcome.skipAll)})`);
  await wv.evaluate(`window.__po.wait('.today__cta').then(() => true)`);

  // Five tabs with labels at system font 1.0.
  await wv.evaluate(`window.__po.click('.tabbar__item', ${JSON.stringify(t.nav.discover)})`);
  await wv.evaluate(`window.__po.wait('.discover-world').then(() => true)`);
  await sleep(800);
  shot(`entdecken-${L}`);
  const g1 = await wv.evaluate('window.__po.tabGap()');
  note('five tabs with labels, font 1.0', g1.labels === 5 && g1.gap > 2 ? 'PASS' : 'FAIL', JSON.stringify(g1));

  // Hardware back through every level: world → page → world → hub → today.
  await wv.evaluate(`window.__po.click('.discover-world', ${JSON.stringify(d.hub.numbers)})`);
  await wv.evaluate(`window.__po.wait('.discover-numbers__item').then(() => true)`);
  await wv.evaluate(`window.__po.click('.discover-numbers__item', '7')`);
  await sleep(700);
  shot(`zahl-7-${L}`);
  const numberTrail = [await hashOf(wv), await back(wv), await back(wv), await back(wv)];
  const numberOk = /^#\/discover\/numbers\/7/.test(numberTrail[0]) && /^#\/discover\/numbers(\?|$)/.test(numberTrail[1]) && numberTrail[2] === '#/discover' && numberTrail[3] === '#/today';
  note('back: number → numbers → hub → today', numberOk ? 'PASS' : 'FAIL', numberTrail.join(' | '));

  await wv.evaluate(`window.__po.click('.tabbar__item', ${JSON.stringify(t.nav.discover)})`);
  await wv.evaluate(`window.__po.click('.discover-world', ${JSON.stringify(d.hub.angels)})`);
  await wv.evaluate(`window.__po.click('.discover-chip', '1111')`);
  await sleep(700);
  shot(`engelszahl-1111-${L}`);
  const angelTrail = [await hashOf(wv), await back(wv), await back(wv)];
  const angelOk = /^#\/discover\/angel\/1111/.test(angelTrail[0]) && /^#\/discover\/angel(\?|$)/.test(angelTrail[1]) && angelTrail[2] === '#/discover';
  note('back: angel number → angel numbers → hub', angelOk ? 'PASS' : 'FAIL', angelTrail.join(' | '));

  await wv.evaluate(`window.__po.click('.discover-world', ${JSON.stringify(d.hub.symbols)})`);
  await wv.evaluate(`window.__po.wait('.discover-symbols__item').then(() => true)`);
  await sleep(500);
  shot(`symbole-${L}`);
  await wv.evaluate(`window.__po.click('.discover-symbols__item', ${JSON.stringify(L === 'de' ? 'Eule' : 'Owl')})`);
  await sleep(700);
  shot(`symbol-eule-${L}`);
  const symbolTrail = [await hashOf(wv), await back(wv), await back(wv)];
  const symbolOk = /^#\/discover\/symbols\/owl/.test(symbolTrail[0]) && /^#\/discover\/symbols(\?|$)/.test(symbolTrail[1]) && symbolTrail[2] === '#/discover';
  note('back: symbol → symbols → hub', symbolOk ? 'PASS' : 'FAIL', symbolTrail.join(' | '));
  wv.close();

  // Large system text: the labels stay apart (S-68), the hub still reads.
  for (const scale of ['1.3', '2.0']) {
    sh(`settings put system font_scale ${scale}`);
    wv = await coldStart();
    await wv.evaluate(`window.__po.wait('.today__cta').then(() => true)`);
    await wv.evaluate(`window.__po.click('.tabbar__item', ${JSON.stringify(t.nav.discover)})`);
    await wv.evaluate(`window.__po.wait('.discover-world').then(() => true)`);
    // A cold start paints in stages for 1–2 s on the emulator (B-11): wait before the screenshot.
    await sleep(2500);
    shot(`entdecken-schrift-${scale.replace('.', '_')}-${L}`);
    const g = await wv.evaluate('window.__po.tabGap()');
    const zoom = await wv.evaluate(`getComputedStyle(document.documentElement).getPropertyValue('--text-zoom')`);
    note(`five tabs with labels, font ${scale}`, g.labels === 5 && g.gap > 2 ? 'PASS' : 'FAIL', `${JSON.stringify(g)} text-zoom ${zoom}`);
    const overflow = await wv.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth');
    note(`no sideways scroll, font ${scale}`, overflow <= 0 ? 'PASS' : 'FAIL', `${overflow}px`);
    wv.close();
  }
  wv = null;
} catch (e) {
  note('run', 'FAIL', String(e).slice(0, 300));
} finally {
  wv?.close();
  sh(`settings put system font_scale ${originalScale === 'null' ? '1.0' : originalScale}`);
  sh(`am force-stop ${PKG}`);
}
writeFileSync(join(outDir, 'android-v06-results.json'), JSON.stringify({ serial: SERIAL, results }, null, 2));
if (results.some((r) => r.status === 'FAIL')) process.exitCode = 1;
