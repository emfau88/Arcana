// Content gate: `npm run validate:content` checks the full P0 scope (22 cards × 6 themes, DE/EN)
// and fails on any error. Runs with Node's built-in type stripping; no extra tooling.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CONTENT } from '../src/content/index.ts';
import { loadModule, MODULE_VERSIONS, registeredModules } from '../src/content/modules/registry.ts';
import { MODULE_RULES, validateModule } from '../src/content/modules/validate.ts';
import { validateContent } from '../src/content/validate.ts';

const root = join(import.meta.dirname, '..');
const report = validateContent(CONTENT, 'p0');

// Asset presence is a file-system check, so it lives here and not in the pure validator.
for (const card of [...CONTENT.cards.map((c) => c.assetId), 'card-back']) {
  for (const file of [join(root, 'public', 'cards', `${card}.webp`), join(root, 'public', 'cards', 'thumbs', `${card}.webp`)]) {
    if (!existsSync(file)) report.errors.push(`asset missing: ${file.slice(root.length + 1)}`);
  }
}

const s = report.summary;
const themeTexts = s.cards * s.targetThemes - s.missingP0ThemeTexts;
console.log(`Content ${s.version}`);
console.log(`  cards              ${s.cards}/${s.targetCards}`);
console.log(`  themes             ${s.themes}/${s.targetThemes}`);
console.log(`  card×theme texts   ${themeTexts}/${s.targetCards * s.targetThemes} per language`);
console.log(`  archetypes         ${s.archetypes}/8`);
console.log(`  questions          ${s.questions}/4`);

// Lazy content modules: each one checked on its own, both locales (CONTENT_MASTERPLAN §8).
console.log('');
console.log('Modules (loaded per locale on demand)');
for (const id of registeredModules()) {
  const [de, en] = await Promise.all([loadModule(id, 'de'), loadModule(id, 'en')]);
  const m = validateModule(id, MODULE_RULES[id], CONTENT, { de, en });
  report.errors.push(...m.errors);
  report.warnings.push(...m.warnings);
  const state = m.errors.length ? `${m.errors.length} errors` : 'ok';
  console.log(`  ${id.padEnd(18)} ${String(MODULE_VERSIONS[id] ?? '?').padEnd(24)} ${String(m.keys).padStart(4)} keys DE/EN  ${state}`);
}
console.log('');
for (const w of report.warnings) console.log(`WARN  ${w}`);
for (const e of report.errors) console.log(`ERROR ${e}`);
console.log(`P0 content gate: ${report.errors.length === 0 ? 'PASS' : 'FAIL'} (${report.errors.length} errors, ${report.warnings.length} warnings)`);

process.exitCode = report.errors.length === 0 ? 0 : 1;
