import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import { loadModule, loadModules, registeredModules, STARTUP_MODULES, text } from '../../src/content/modules/registry.ts';
import { MODULE_RULES, validateModule, type ModuleRules } from '../../src/content/modules/validate.ts';

describe('content modules', () => {
  it('every registered module passes the gate in both languages', async () => {
    for (const id of registeredModules()) {
      const [de, en] = await Promise.all([loadModule(id, 'de'), loadModule(id, 'en')]);
      const report = validateModule(id, MODULE_RULES[id], CONTENT, { de, en });
      expect(report.errors, id).toEqual([]);
      expect(report.keys).toBeGreaterThan(0);
    }
  });

  it('loads per locale and keeps the languages apart', async () => {
    const de = await loadModules(STARTUP_MODULES, 'de');
    const en = await loadModules(STARTUP_MODULES, 'en');
    expect(text(de, 'identity', 'question.q-calling.prompt')).toBe('Was ruft dich in dieser Zeit am stärksten?');
    expect(text(en, 'identity', 'question.q-calling.prompt')).toBe('What is calling you most strongly these days?');
    // A missing key shows itself instead of an empty gap.
    expect(text(en, 'identity', 'question.nope.prompt')).toBe('question.nope.prompt');
    expect(text({}, 'journey', 'x')).toBe('x');
  });

  it('every question and answer of the structure has a text in both languages', async () => {
    for (const locale of ['de', 'en'] as const) {
      const t = await loadModule('identity', locale);
      for (const q of CONTENT.questions) {
        expect(t[`question.${q.id}.prompt`]).toBeTruthy();
        for (const a of q.answers) expect(t[`question.${q.id}.${a.id}`], `${locale} ${a.id}`).toBeTruthy();
      }
    }
  });

  it('rejects an empty module with clear errors', () => {
    const report = validateModule('identity', MODULE_RULES.identity, CONTENT, { de: {}, en: {} });
    expect(report.errors).toContain('identity/de: missing question.q-calling.prompt');
    expect(report.errors).toContain('identity/en: missing question.q-calling.prompt');
    expect(report.errors.length).toBe(2 * 20);
  });

  it('finds missing translations, unknown keys, empty and forbidden texts', async () => {
    const de = { ...(await loadModule('identity', 'de')) };
    const en: Record<string, string> = { ...(await loadModule('identity', 'en')) };
    delete en['question.q-place.prompt'];
    en['question.q-calling.a-create'] = '  ';
    en['question.q-calling.a-close'] = 'This will happen for certain.';
    const extra = { ...de, 'questoin.q-calling.prompt': 'Tippfehler' };
    const report = validateModule('identity', MODULE_RULES.identity, CONTENT, { de: extra, en });
    expect(report.errors).toEqual(
      expect.arrayContaining([
        'identity/en: missing question.q-place.prompt',
        'identity/de: questoin.q-calling.prompt: unknown key',
        'identity/en: missing questoin.q-calling.prompt (exists in the other locale)',
        'identity/en: question.q-calling.a-create: empty',
      ]),
    );
    expect(report.errors.some((e) => e.includes('a-close: forbidden phrasing'))).toBe(true);
  });

  it('asks for varied openings within a group of texts', () => {
    const rules: ModuleRules = {
      required: () => Array.from({ length: 20 }, (_, i) => `lens.${i}`),
      rules: [{ pattern: /^lens\.\d+$/, group: 'lens', question: false }],
    };
    const same = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`lens.${i}`, i < 3 ? `Heute darfst du ${i}.` : `Text ${i} beginnt anders.`]));
    const report = validateModule('journey', rules, CONTENT, { de: same, en: same });
    expect(report.errors).toContain('journey/de: 3 of 20 texts in "lens" start with "heute darfst du" (max 2)');
  });
});
