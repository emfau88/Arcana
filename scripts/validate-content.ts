// Content gate: `npm run validate:content` (G1, blocking) – add `--p0` for the full-scope report.
// Runs with Node's built-in type stripping; no extra tooling.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CONTENT } from '../src/content/index.ts';
import { validateContent } from '../src/content/validate.ts';

const root = join(import.meta.dirname, '..');
const g1 = validateContent(CONTENT, 'g1');
const p0 = validateContent(CONTENT, 'p0');

// Asset presence is a file-system check, so it lives here and not in the pure validator.
for (const card of [...CONTENT.cards.map((c) => c.assetId), 'card-back']) {
  for (const file of [join(root, 'public', 'cards', `${card}.webp`), join(root, 'public', 'cards', 'thumbs', `${card}.webp`)]) {
    if (!existsSync(file)) g1.errors.push(`asset missing: ${file.slice(root.length + 1)}`);
  }
}

const s = g1.summary;
console.log(`Content ${s.version}`);
console.log(`  cards       ${s.cards}/${s.targetCards}`);
console.log(`  themes      ${s.themes}/${s.targetThemes}`);
console.log(`  archetypes  ${s.archetypes}/8`);
console.log(`  questions   ${s.questions}/4`);
console.log(`  P0 card×theme texts missing: ${s.missingP0ThemeTexts}`);
console.log('');
for (const w of g1.warnings) console.log(`WARN  ${w}`);
for (const e of g1.errors) console.log(`ERROR ${e}`);
console.log(`G1 content gate: ${g1.errors.length === 0 ? 'PASS' : 'FAIL'} (${g1.errors.length} errors, ${g1.warnings.length} warnings)`);
console.log(`P0 completeness: ${p0.errors.length === 0 ? 'COMPLETE' : 'NOT YET (expected in G1)'}`);
if (process.argv.includes('--p0')) for (const e of p0.errors.filter((x) => x.startsWith('P0'))) console.log(`  ${e}`);

process.exitCode = g1.errors.length === 0 && (!process.argv.includes('--p0') || p0.errors.length === 0) ? 0 : 1;
