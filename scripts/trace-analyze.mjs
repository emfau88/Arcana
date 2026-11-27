// Breaks the long main-thread tasks of a Chrome trace (scripts/android-trace.mjs) down by event
// name (self time) and sums up the other threads and image decodes in the same window.
// Usage: node scripts/trace-analyze.mjs <trace.json> <markName, e.g. diag:tap> [windowMs=1500] [minTaskMs=30]
import { readFileSync } from 'node:fs';
const [, , file, markName, windowArg = '1500', minArg = '30'] = process.argv;
const { traceEvents: ev } = JSON.parse(readFileSync(file, 'utf8'));
const names = new Map();
for (const e of ev) if (e.ph === 'M' && e.name === 'thread_name') names.set(`${e.pid}:${e.tid}`, e.args.name);
const mark = ev.find((e) => e.name === markName && (e.ph === 'R' || e.ph === 'I' || e.ph === 'n' || e.ph === 'b' || e.ph === 'X' || e.ph === 'i'));
if (!mark) throw new Error('mark not found: ' + markName);
const mainKey = [...names].find(([k, n]) => n === 'CrRendererMain' && k.startsWith(mark.pid + ':'))?.[0] ?? `${mark.pid}:${mark.tid}`;
const t0 = mark.ts;
const t1 = t0 + Number(windowArg) * 1000;
const min = Number(minArg) * 1000;
const byThread = (key) => ev.filter((e) => e.ph === 'X' && `${e.pid}:${e.tid}` === key && e.ts + (e.dur ?? 0) >= t0 && e.ts <= t1).sort((a, b) => a.ts - b.ts || b.dur - a.dur);
const main = byThread(mainKey);
const tops = main.filter((e) => /^(ThreadControllerImpl::RunTask|RunTask)$/.test(e.name) && e.dur >= min);
console.log(`main thread ${mainKey}; tasks >= ${minArg} ms in ${windowArg} ms after ${markName}: ${tops.length}`);
for (const top of tops) {
  const inside = main.filter((e) => e !== top && e.ts >= top.ts && e.ts + e.dur <= top.ts + top.dur);
  // self time per name: duration minus direct children (approximation via nesting stack)
  const self = new Map();
  const stack = [];
  for (const e of inside) {
    while (stack.length && stack.at(-1).ts + stack.at(-1).dur <= e.ts) stack.pop();
    if (stack.length) {
      const p = stack.at(-1);
      self.set(p.name, (self.get(p.name) ?? 0) - e.dur);
    }
    self.set(e.name, (self.get(e.name) ?? 0) + e.dur);
    stack.push(e);
  }
  const detail = [...self].filter(([, d]) => d > 2000).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([n, d]) => `${n} ${(d / 1000).toFixed(0)}`);
  const urls = inside.filter((e) => e.args?.data?.url || e.args?.data?.functionName).slice(0, 4).map((e) => (e.args.data.url ?? '').split('/').pop() + ':' + (e.args.data.functionName ?? ''));
  console.log(`  +${((top.ts - t0) / 1000).toFixed(0)} ms  ${(top.dur / 1000).toFixed(0)} ms  | ${detail.join(' | ')}`);
  if (urls.length) console.log(`      ${urls.join('  ')}`);
}
// Other threads with long work in the window
const busy = new Map();
for (const e of ev) {
  if (e.ph !== 'X' || e.ts < t0 || e.ts > t1 || !e.dur) continue;
  const k = `${e.pid}:${e.tid}`;
  if (k === mainKey) continue;
  if (!/^(ThreadControllerImpl::RunTask|RunTask|TaskGraphRunner::RunTask)$/.test(e.name)) continue;
  busy.set(k, (busy.get(k) ?? 0) + e.dur);
}
console.log('other threads, task time in window (ms):', [...busy].filter(([, d]) => d > 20000).map(([k, d]) => `${names.get(k) ?? k} ${(d / 1000).toFixed(0)}`).join(', '));
const decodes = ev.filter((e) => e.ph === 'X' && /Decode|ImageDecode/i.test(e.name) && e.ts >= t0 && e.ts <= t1 && e.dur > 5000);
console.log('image decodes > 5 ms:', decodes.map((e) => `${names.get(`${e.pid}:${e.tid}`)} ${e.name} +${((e.ts - t0) / 1000).toFixed(0)} ${(e.dur / 1000).toFixed(0)}ms`).join('; '));
