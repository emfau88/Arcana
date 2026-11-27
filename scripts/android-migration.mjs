// Android migration check (QG-V03): data written by a schema-1 build (0.2.x) survives the update
// to the current build record for record, the new schema-2 stores are added empty, and the app
// shows the same daily card afterwards and after a cold restart.
//
// Usage:
//   node scripts/android-migration.mjs <outDir> --old <schema-1.apk> --new <current.apk> [--serial emulator-5554]
//
// Flow: uninstall this app's dev package → install the old APK → create data through the real UI
// (scripts/android-evidence.mjs, same flow as the G2/V02 runs) → dump IndexedDB over the WebView
// DevTools socket → `adb install -r` the new APK → dump again and compare → cold restart → compare.
//
// Safety rules (AGENTS.md): emulator only (refuses physical devices), only this app's own dev package
// is installed/uninstalled/started; android-evidence.mjs restores every device setting it touches.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PKG = 'com.energycrafted.personaloracle.dev';
const ACTIVITY = `${PKG}/.MainActivity`;
const PORT = 9339;
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const outDir = process.argv[2] ?? 'docs/evidence/android-migration';
const OLD = arg('--old');
const NEW = arg('--new');
const SERIAL = arg('--serial', 'emulator-5554');
if (!OLD || !NEW) throw new Error('--old and --new are required');
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
        else if (m.result.exceptionDetails) rej(new Error(JSON.stringify(m.result.exceptionDetails)));
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

// Every store with key path, indexes and all records as [key, value] pairs.
const DUMP = `(async () => {
  const db = await new Promise((res, rej) => { const r = indexedDB.open('personal-oracle'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const out = { version: db.version, stores: {} };
  for (const n of [...db.objectStoreNames]) {
    const s = db.transaction(n, 'readonly').objectStore(n);
    const keys = await new Promise((r) => { const q = s.getAllKeys(); q.onsuccess = () => r(q.result); });
    const vals = await new Promise((r) => { const q = s.getAll(); q.onsuccess = () => r(q.result); });
    out.stores[n] = { keyPath: s.keyPath, indexes: [...s.indexNames].sort(), records: keys.map((k, i) => [k, vals[i]]) };
  }
  db.close();
  return out;
})()`;

const TITLE = `document.querySelector('#today-card-title')?.textContent ?? null`;

/** JSON with sorted object keys, so equal data compares equal regardless of key order. */
const canon = (v) =>
  JSON.stringify(v, (_k, x) =>
    x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => a.localeCompare(b))) : x,
  );

/** Compares the stores of `before` with `after`: every old record unchanged, nothing lost. */
function compare(before, after) {
  const diffs = [];
  for (const [name, b] of Object.entries(before.stores)) {
    const a = after.stores[name];
    if (!a) {
      diffs.push(`${name}: store missing`);
      continue;
    }
    if (canon(a.keyPath) !== canon(b.keyPath)) diffs.push(`${name}: key path changed`);
    const am = new Map(a.records.map(([k, v]) => [canon(k), canon(v)]));
    for (const [k, v] of b.records) {
      const got = am.get(canon(k));
      if (got === undefined) diffs.push(`${name}: record ${canon(k)} lost`);
      else if (got !== canon(v)) diffs.push(`${name}: record ${canon(k)} changed`);
    }
  }
  return diffs;
}

async function launchAndDump(label, { wantVersion } = {}) {
  sh(`am force-stop ${PKG}`);
  await sleep(500);
  sh(`am start -W -n ${ACTIVITY}`);
  const wv = await webview();
  try {
    // Wait until the app has rendered its first screen (and, after the update, migrated).
    let dump;
    let title = null;
    for (let i = 0; i < 40; i++) {
      await sleep(500);
      title = await wv.evaluate(TITLE);
      if (!title) continue;
      dump = await wv.evaluate(DUMP);
      if (!wantVersion || dump.version === wantVersion) break;
    }
    writeFileSync(join(outDir, `db-${label}.json`), JSON.stringify(dump, null, 2));
    return { dump, title };
  } finally {
    wv.close();
  }
}

const count = (d) => Object.fromEntries(Object.entries(d.stores).map(([n, s]) => [n, s.records.length]));

try {
  // ------------------------------------------------------------- old build with real data
  try {
    adb('uninstall', PKG);
  } catch {
    /* not installed */
  }
  adb('install', OLD);
  note('Schema-1 build installed', 'PASS', OLD);
  execFileSync(process.execPath, ['--experimental-strip-types', '--no-warnings', 'scripts/android-evidence.mjs', join(outDir, 'seed-old'), '--serial', SERIAL], {
    stdio: 'inherit',
  });
  const before = await launchAndDump('before');
  note('Data created in the old build', before.dump ? 'PASS' : 'FAIL', `version ${before.dump?.version}, ${JSON.stringify(count(before.dump))}, card "${before.title}"`);
  shot('alt-heute');

  // ------------------------------------------------------------- update in place
  adb('install', '-r', NEW);
  note('Current build installed over it (install -r)', 'PASS', NEW);
  const after = await launchAndDump('after', { wantVersion: 2 });
  shot('neu-heute');
  note('Database upgraded to schema 2', after.dump?.version === 2 ? 'PASS' : 'FAIL', `version ${after.dump?.version}`);
  const diffs = compare(before.dump, after.dump);
  note('Every schema-1 record unchanged after the update', diffs.length === 0 ? 'PASS' : 'FAIL', diffs.slice(0, 10).join('; '));
  const added = Object.keys(after.dump.stores).filter((n) => !before.dump.stores[n]);
  const NEW_STORES = ['journal', 'events', 'favorites', 'seen'];
  const missing = NEW_STORES.filter((n) => !added.includes(n));
  const filled = added.filter((n) => after.dump.stores[n].records.length > 0);
  note('New stores added and empty', missing.length === 0 && filled.length === 0 ? 'PASS' : 'FAIL', `added ${added.join(', ')}${missing.length ? `; missing ${missing}` : ''}${filled.length ? `; not empty ${filled}` : ''}`);
  note('Same daily card after the update', after.title === before.title ? 'PASS' : 'FAIL', `"${before.title}" → "${after.title}"`);

  // ------------------------------------------------------------- cold restart, idempotent
  const again = await launchAndDump('restart', { wantVersion: 2 });
  const drift = compare(after.dump, again.dump).concat(compare(again.dump, after.dump));
  note('Cold restart: data identical, migration does not run again', drift.length === 0 && again.title === before.title ? 'PASS' : 'FAIL', drift.slice(0, 10).join('; '));

  // Grimoire shows the collection and the history of the old data.
  const wv = await webview();
  try {
    await wv.evaluate(`location.hash = '#/grimoire'`);
    await sleep(1500);
    shot('neu-grimoire');
    const tab = await wv.evaluate(`(() => { const t = [...document.querySelectorAll('[role=tab]')][1]; t?.click(); return t?.textContent ?? null; })()`);
    await sleep(1200);
    const rows = await wv.evaluate(`document.querySelectorAll('.history__row').length`);
    shot('neu-verlauf');
    const expected = (before.dump.stores.readings?.records.length ?? 0) + (before.dump.stores.daily?.records.length ?? 0);
    note('Grimoire history lists the old entries', rows === expected ? 'PASS' : 'CHECK', `tab "${tab}", ${rows} rows, expected ${expected}`);
    await wv.evaluate(`location.hash = '#/today'`);
  } finally {
    wv.close();
  }
} catch (err) {
  note('Run aborted', 'FAIL', String(err?.message ?? err));
} finally {
  writeFileSync(join(outDir, 'migration-results.json'), JSON.stringify({ serial: SERIAL, package: PKG, old: OLD, new: NEW, results }, null, 2));
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`\n${results.length - failed}/${results.length} without FAIL`);
}
