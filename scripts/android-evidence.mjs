// Android emulator evidence run for the G1 flow.
// Usage: node scripts/android-evidence.mjs <outDir> [--serial emulator-5554]
//
// Safety rules (AGENTS.md): only the emulator given by --serial is used, only this app's own
// development package is cleared/launched, and every changed device setting is restored at the end.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PKG = "com.energycrafted.personaloracle.dev";
const ACTIVITY = `${PKG}/.MainActivity`;
const outDir = process.argv[2] ?? "docs/evidence/android";
const si = process.argv.indexOf("--serial");
const SERIAL = si > 0 ? process.argv[si + 1] : "emulator-5554";
const ADB = join(
  process.env.LOCALAPPDATA ?? "",
  "Android",
  "Sdk",
  "platform-tools",
  "adb.exe",
);
mkdirSync(outDir, { recursive: true });

const adb = (...args) =>
  execFileSync(ADB, ["-s", SERIAL, ...args], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
const sh = (cmd) => adb("shell", cmd).trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const note = (check, status, detail = "") => {
  results.push({ check, status, detail });
  console.log(`${status.padEnd(7)} ${check}${detail ? ` – ${detail}` : ""}`);
};

const isEmulator =
  sh("getprop ro.kernel.qemu") === "1" ||
  sh("getprop ro.boot.qemu") === "1" ||
  sh("getprop ro.hardware").includes("ranchu");
if (!isEmulator)
  throw new Error("Refusing to run on a physical device (emulator only)");

let shotNo = 0;
function shot(name) {
  shotNo += 1;
  const file = join(outDir, `${String(shotNo).padStart(2, "0")}-${name}.png`);
  const buf = execFileSync(ADB, ["-s", SERIAL, "exec-out", "screencap", "-p"], {
    maxBuffer: 64 * 1024 * 1024,
  });
  writeFileSync(file, buf);
  console.log(`        ${file}`);
  return file;
}

/** Parses a uiautomator dump into nodes with text/desc and centre coordinates. */
function nodes() {
  let xml = "";
  for (let attempt = 0; attempt < 4 && !xml.includes("<hierarchy"); attempt++) {
    try {
      sh("uiautomator dump /sdcard/po-ui.xml >/dev/null 2>&1");
      xml = sh("cat /sdcard/po-ui.xml");
    } catch {
      xml = "";
    }
  }
  const out = [];
  for (const m of xml.matchAll(/<node ([^>]*?)\/?>/g)) {
    const attr = (k) =>
      (m[1].match(new RegExp(`${k}="([^"]*)"`)) ?? [])[1] ?? "";
    const b = attr("bounds").match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
    if (!b) continue;
    const [x1, y1, x2, y2] = b.slice(1).map(Number);
    const decode = (s) =>
      s
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
    out.push({
      text: decode(attr("text")),
      desc: decode(attr("content-desc")),
      cls: attr("class"),
      clickable: attr("clickable") === "true",
      checkable: attr("checkable") === "true",
      pkg: attr("package"),
      x: Math.round((x1 + x2) / 2),
      y: Math.round((y1 + y2) / 2),
      w: x2 - x1,
      h: y2 - y1,
    });
  }
  return out;
}

const label = (n) => (n.text || n.desc).trim();

async function waitFor(match, { timeout = 15000 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const found = nodes().find((n) =>
      typeof match === "string" ? label(n) === match : match.test(label(n)),
    );
    if (found) return found;
    await sleep(300);
  }
  throw new Error(`Timeout waiting for ${match}`);
}

const VISIBLE_TOP = 160;
const VISIBLE_BOTTOM = 2040; // the tab bar covers ~2170–2340 px

/** Taps a node, scrolling the WebView first if the node is outside the visible area. */
async function tap(match, opts) {
  let n = await waitFor(match, opts);
  for (let i = 0; i < 8 && (n.y < VISIBLE_TOP || n.y > VISIBLE_BOTTOM); i++) {
    if (n.y > VISIBLE_BOTTOM) sh("input swipe 540 1900 540 900 350");
    else sh("input swipe 540 700 540 1700 350");
    await sleep(600);
    n = await waitFor(match, opts);
  }
  sh(`input tap ${n.x} ${n.y}`);
  return n;
}

const back = () => sh("input keyevent KEYCODE_BACK");
const focusedPkg = () => {
  const out = sh('dumpsys window | grep -E "mCurrentFocus|mFocusedApp"');
  return out.includes(PKG);
};

async function coldStart() {
  sh(`am force-stop ${PKG}`);
  await sleep(500);
  sh("logcat -c");
  const t0 = Date.now();
  const res = sh(`am start -W -n ${ACTIVITY}`);
  const total = Number((res.match(/TotalTime: (\d+)/) ?? [])[1] ?? NaN);
  return { total, t0 };
}

/**
 * Device-side timing from logcat timestamps (independent of the slow UI polling):
 * process start -> index.html served -> first card image requested (= first screen rendered).
 */
function startupFromLogcat() {
  const lines = sh("logcat -d -v epoch").split(/\r?\n/);
  const at = (re) => {
    const line = lines.find((l) => re.test(l));
    return line ? Number(line.trim().split(/\s+/)[0]) * 1000 : NaN;
  };
  const proc = at(
    new RegExp(
      String.raw`Start proc \d+:` + PKG.replaceAll(".", String.raw`\.`),
    ),
  );
  const html = at(/Handling local request: https:\/\/localhost\/$/);
  const firstImage = at(/Handling local request: https:\/\/localhost\/cards\//);
  return {
    htmlMs: Math.round(html - proc),
    firstScreenMs: Math.round(firstImage - proc),
  };
}

// --------------------------------------------------------------- record settings
const original = {
  font: sh("settings get system font_scale"),
  airplane: sh("settings get global airplane_mode_on"),
  animator: sh("settings get global animator_duration_scale"),
  transition: sh("settings get global transition_animation_scale"),
  window: sh("settings get global window_animation_scale"),
  locale: sh("getprop persist.sys.locale"),
};
console.log("original settings", original);

function restoreSettings() {
  sh(
    `settings put system font_scale ${original.font === "null" ? "1.0" : original.font}`,
  );
  for (const k of ["animator", "transition", "window"]) {
    const key = {
      animator: "animator_duration_scale",
      transition: "transition_animation_scale",
      window: "window_animation_scale",
    }[k];
    if (original[k] === "null") sh(`settings delete global ${key}`);
    else sh(`settings put global ${key} ${original[k]}`);
  }
  if (original.airplane === "0") sh("cmd connectivity airplane-mode disable");
  sh("rm -f /sdcard/po-ui.xml");
}

const metrics = {};
const startupOnly = process.argv.includes("--startup-only");
const buildLabel = (() => {
  const i = process.argv.indexOf("--build");
  return i > 0 ? process.argv[i + 1] : "debug";
})();

/** Five cold starts (force-stop between), timed on the device via logcat; median reported. */
async function startupBenchmark(build) {
  const runs = [];
  for (let i = 0; i < 5; i++) {
    await coldStart();
    const t = Date.now();
    let m = { htmlMs: NaN, firstScreenMs: NaN };
    while (Date.now() - t < 20000) {
      m = startupFromLogcat();
      if (Number.isFinite(m.firstScreenMs)) break;
      await sleep(250);
    }
    runs.push(m);
    await sleep(1500);
  }
  const median = (xs) =>
    [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
  metrics[`startup_${build}`] = {
    runs,
    median: {
      htmlMs: median(runs.map((r) => r.htmlMs)),
      firstScreenMs: median(runs.map((r) => r.firstScreenMs)),
    },
  };
  const med = metrics[`startup_${build}`].median;
  note(
    `Cold start → first screen, median of 5 (${build} build, this emulator)`,
    med.firstScreenMs <= 2500 ? "PASS" : "CHECK",
    `${JSON.stringify(med)} runs ${runs.map((r) => r.firstScreenMs).join("/")}`,
  );
}

try {
  if (startupOnly) {
    await startupBenchmark(buildLabel);
    throw Object.assign(new Error("startup-only"), { done: true });
  }
  // ------------------------------------------------------------- first run
  sh(`pm clear ${PKG}`); // this app's own dev package only
  const first = await coldStart();
  const welcome = await waitFor(/^(Begin|Beginnen)$/, { timeout: 30000 });
  metrics.firstRunActivityMs = first.total;
  metrics.firstRunInteractiveMs = Date.now() - first.t0;
  metrics.firstRun = startupFromLogcat();
  const L =
    welcome.text === "Beginnen" || welcome.desc === "Beginnen" ? "de" : "en";
  const T = {
    begin: L === "de" ? "Beginnen" : "Begin",
    finish: L === "de" ? "Archetyp enthüllen" : "Reveal my archetype",
    toToday: L === "de" ? "Zur Tageskarte" : "Go to today’s card",
    reveal: L === "de" ? "Karte enthüllen" : "Reveal card",
    message: L === "de" ? /^Deine Botschaft$/i : /^Your message$/i,
    oracle: L === "de" ? "Orakel" : "Oracle",
    draw: L === "de" ? "Drei Karten ziehen" : "Draw three cards",
    revealAll: L === "de" ? "Alle aufdecken" : "Reveal all",
    save: L === "de" ? "Im Grimoire speichern" : "Save to grimoire",
    newReading: L === "de" ? "Neue Legung" : "New reading",
    grimoire: "Grimoire",
    profile: L === "de" ? "Profil" : "Profile",
    today: L === "de" ? "Heute" : "Today",
  };
  note(
    "First run shows the welcome screen",
    "PASS",
    `locale ${L}, activity ${first.total} ms, logcat ${JSON.stringify(metrics.firstRun)}`,
  );
  await sleep(900);
  shot("welcome");

  // ------------------------------------------------------------- onboarding
  await tap(T.begin);
  await sleep(700);
  shot("frage-1");
  for (let i = 0; i < 4; i++) {
    await sleep(500);
    const radios = nodes().filter(
      (n) => n.checkable || /RadioButton/.test(n.cls),
    );
    const r = radios[i % Math.max(1, radios.length)];
    if (!r) throw new Error("No answer options found");
    sh(`input tap ${r.x} ${r.y}`);
    await sleep(700);
  }
  await waitFor(T.finish);
  shot("thema");
  await tap(T.finish);
  await waitFor(T.toToday, { timeout: 20000 });
  await sleep(1400);
  shot("archetyp");
  note("Questionnaire → archetype reveal", "PASS");

  // ------------------------------------------------------------- daily card
  await tap(T.toToday);
  await waitFor(T.reveal);
  await sleep(700);
  shot("heute-verdeckt");
  await tap(T.reveal);
  await sleep(450);
  shot("heute-enthuellung");
  await waitFor(T.message, { timeout: 8000 });
  await sleep(1200);
  shot("heute-enthuellt");
  const title = nodes().find(
    (n) => /^(Die |Der |The )/.test(label(n)) && n.h > 60,
  );
  const dailyTitle = title ? label(title) : "";
  note("Daily card revealed", "PASS", dailyTitle);
  sh("input swipe 540 1800 540 700 400");
  await sleep(800);
  shot("heute-botschaft");

  // ------------------------------------------------------------- reading
  await tap(T.oracle);
  await waitFor(T.draw);
  await sleep(500);
  shot("orakel-start");
  await tap(T.draw);
  await waitFor(T.revealAll);
  await sleep(600);
  shot("orakel-verdeckt");
  await tap(T.revealAll);
  await sleep(1600);
  shot("orakel-aufgedeckt");
  sh("input swipe 540 1900 540 600 400");
  await sleep(600);
  sh("input swipe 540 1900 540 600 400");
  await sleep(600);
  await tap(T.save);
  await waitFor(T.newReading);
  await sleep(500);
  shot("orakel-gespeichert");
  note("Three-card reading drawn, revealed, saved", "PASS");

  // ------------------------------------------------------------- grimoire + profile
  await tap(T.grimoire);
  await sleep(900);
  shot("grimoire");
  await tap(T.profile);
  await sleep(900);
  shot("profil");

  // ------------------------------------------------------------- back gesture rules
  back();
  await sleep(700);
  const onToday = nodes().some((n) => T.message.test(label(n)));
  note("Back from Profile goes to Today", onToday ? "PASS" : "FAIL");
  back();
  await sleep(1200);
  const left = !focusedPkg();
  note("Back on Today leaves the app (minimise)", left ? "PASS" : "FAIL");

  // ------------------------------------------------------------- persistence after force-stop
  const warm = await coldStart();
  await waitFor(T.message, { timeout: 20000 });
  metrics.coldStartActivityMs = warm.total;
  metrics.coldStartInteractiveMs = Date.now() - warm.t0;
  metrics.coldStart = startupFromLogcat();
  const sameCard = dailyTitle
    ? nodes().some((n) => label(n) === dailyTitle)
    : false;
  await sleep(600);
  shot("neustart-persistiert");
  note(
    "Force-stop + cold start keeps today’s card",
    sameCard ? "PASS" : "FAIL",
    `${dailyTitle}; activity ${warm.total} ms, logcat ${JSON.stringify(metrics.coldStart)}`,
  );

  await startupBenchmark("debug");

  // ------------------------------------------------------------- offline cold start
  sh("cmd connectivity airplane-mode enable");
  await sleep(1500);
  const off = await coldStart();
  await waitFor(T.message, { timeout: 20000 });
  metrics.offline = startupFromLogcat();
  await sleep(600);
  shot("offline-kaltstart");
  note(
    "Cold start in airplane mode",
    "PASS",
    `activity ${off.total} ms, logcat ${JSON.stringify(metrics.offline)}`,
  );
  sh("cmd connectivity airplane-mode disable");

  // ------------------------------------------------------------- font scale
  for (const scale of ["1.3", "2.0"]) {
    sh(`settings put system font_scale ${scale}`);
    await sleep(800);
    await coldStart();
    await waitFor(T.message, { timeout: 20000 });
    await sleep(900);
    shot(`schrift-${scale.replace(".", "_")}`);
    sh("input swipe 540 1900 540 700 400");
    await sleep(700);
    shot(`schrift-${scale.replace(".", "_")}-gescrollt`);
    note(`System font scale ${scale}`, "CHECK", "see screenshots");
  }
  sh(
    `settings put system font_scale ${original.font === "null" ? "1.0" : original.font}`,
  );

  // ------------------------------------------------------------- reduced motion
  sh("settings put global animator_duration_scale 0");
  sh("settings put global transition_animation_scale 0");
  sh("settings put global window_animation_scale 0");
  await coldStart();
  await waitFor(T.message, { timeout: 20000 });
  await tap(T.oracle);
  await tap(T.draw);
  await tap(T.revealAll);
  await sleep(250); // immediately after: content must already be there without the flip
  const instant = nodes().some((n) => /Situation/.test(label(n)));
  shot("reduzierte-bewegung");
  note(
    "Reduced motion (animations off) reveals instantly",
    instant ? "PASS" : "CHECK",
  );

  // ------------------------------------------------------------- accessibility tree
  const unnamed = nodes().filter(
    (n) => n.pkg === PKG && n.clickable && !label(n) && n.w > 0,
  );
  note(
    "Every clickable WebView node has a label (uiautomator)",
    unnamed.length === 0 ? "PASS" : "FAIL",
    `${unnamed.length} unnamed`,
  );
  const small = nodes().filter(
    (n) =>
      n.pkg === PKG &&
      n.clickable &&
      n.w > 0 &&
      n.h > 0 &&
      (n.w < 126 || n.h < 126) &&
      label(n),
  );
  note(
    "Touch targets ≥ 48 dp (126 px @420 dpi)",
    small.length === 0 ? "PASS" : "CHECK",
    small.map((n) => `${label(n)} ${n.w}×${n.h}`).join("; "),
  );
} catch (err) {
  if (err?.done) {
    // --startup-only finished normally
  } else {
    note("Run aborted", "FAIL", String(err?.message ?? err));
    try {
      shot("fehler");
    } catch {
      /* ignore */
    }
  }
} finally {
  restoreSettings();
  const after = {
    font: sh("settings get system font_scale"),
    airplane: sh("settings get global airplane_mode_on"),
    animator: sh("settings get global animator_duration_scale"),
    transition: sh("settings get global transition_animation_scale"),
    window: sh("settings get global window_animation_scale"),
  };
  const restored =
    after.font === (original.font === "null" ? "1.0" : original.font) &&
    after.airplane === original.airplane &&
    after.animator === original.animator &&
    after.transition === original.transition &&
    after.window === original.window;
  note(
    "Emulator settings restored",
    restored ? "PASS" : "FAIL",
    JSON.stringify(after),
  );
  writeFileSync(
    join(
      outDir,
      startupOnly ? `startup-${buildLabel}.json` : "android-results.json",
    ),
    JSON.stringify(
      { serial: SERIAL, package: PKG, original, after, metrics, results },
      null,
      2,
    ),
  );
}
