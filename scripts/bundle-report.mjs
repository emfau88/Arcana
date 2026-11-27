// Bundle report after `vite build` (V03.3): what the start loads, what each content module
// costs per language, all gzip. Fails the build when a budget is exceeded
// (MASTER_ROADMAP_V2 §6: start JS ≤ 160 KB gzip; IA §7: content module per language ≤ 40 KB gzip).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const dist = join(import.meta.dirname, '..', 'dist');
const html = readFileSync(join(dist, 'index.html'), 'utf8');
// kB = 1000 bytes, as Vite reports it (the budgets were set against Vite numbers).
const KB = (n) => `${(n / 1000).toFixed(1)} kB`;
const gz = (file) => gzipSync(readFileSync(join(dist, file)), { level: 9 }).length;

// The start = the entry script plus every chunk the HTML preloads (static imports).
const start = [...html.matchAll(/<script[^>]+src="\.\/([^"]+\.js)"/g), ...html.matchAll(/<link rel="modulepreload"[^>]+href="\.\/([^"]+\.js)"/g)].map((m) => m[1]);
const startGz = start.reduce((sum, f) => sum + gz(f), 0);
const css = [...html.matchAll(/<link rel="stylesheet"[^>]+href="\.\/([^"]+\.css)"/g)].map((m) => m[1]);

const all = readdirSync(join(dist, 'assets')).filter((f) => f.endsWith('.js'));
const lazy = all.map((f) => `assets/${f}`).filter((f) => !start.includes(f));
const modules = lazy.filter((f) => /\/[a-z-]+\.(de|en)-[\w-]+\.js$/.test(f));
const other = lazy.filter((f) => !modules.includes(f));

const problems = [];
console.log('Bundle report (gzip)');
console.log(`  start JS        ${KB(startGz).padStart(9)}  (budget 160 kB)  ${start.join(', ')}`);
if (startGz > 160 * 1000) problems.push(`start JS ${KB(startGz)} > 160 kB`);
for (const f of css) console.log(`  start CSS       ${KB(gz(f)).padStart(9)}  ${f}`);
for (const f of modules) {
  const size = gz(f);
  const name = f.replace(/^assets\//, '').replace(/-[\w-]+\.js$/, '');
  console.log(`  module ${name.padEnd(12)} ${KB(size).padStart(7)}  (budget 40 kB, raw ${KB(statSync(join(dist, f)).size)})`);
  if (size > 40 * 1000) problems.push(`module ${name} ${KB(size)} > 40 kB`);
}
for (const f of other) console.log(`  lazy chunk      ${KB(gz(f)).padStart(9)}  ${f}`);
for (const p of problems) console.log(`BUDGET ${p}`);
console.log(`Bundle budgets: ${problems.length ? 'FAIL' : 'PASS'}`);
process.exitCode = problems.length ? 1 : 0;
