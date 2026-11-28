import { describe, expect, it } from 'vitest';
import { CONTENT } from '../../src/content/index.ts';
import { loadModule, type TextTable } from '../../src/content/modules/registry.ts';
import { MODULE_RULES, validateModule } from '../../src/content/modules/validate.ts';
import type { Clock } from '../../src/domain/clock.ts';
import { CoreOnlyProvider, TestProvider } from '../../src/domain/entitlements.ts';
import { createDraft, createSpreadDraft, finalizeReading, revealAll, revealPosition } from '../../src/domain/oracle.ts';
import { cardEncounters, type Facts } from '../../src/domain/progress.ts';
import { seededRng } from '../../src/domain/random.ts';
import { availableSpreads, composeSpread, reviewCards, roleText, SPREADS, spreadTextKeys, type SpreadDef } from '../../src/domain/spreads.ts';
import { LOCALES, POSITIONS, ROLES, type CardId, type DailyRecord, type Locale, type ThemeId } from '../../src/domain/types.ts';
import { isDraft, isReading } from '../../src/platform/storage/validate.ts';

const at = (d: number, h = 9): Clock => ({ now: () => new Date(2026, 10, d, h, 0, 0) });
const ids = CONTENT.cards.map((c) => c.id);
const themes = CONTENT.themes.map((t) => t.id);
const byId = (id: string) => SPREADS.find((s) => s.id === id)!;

async function tables(locale: Locale) {
  return { spreads: await loadModule('spreads', locale), deep: await loadModule('cards-deep', locale) };
}

/** Daily cards on days 1…n of November, card i on day i (wrapping the deck). */
function dailies(n: number, card: (day: number) => CardId = (d) => ids[(d - 1) % ids.length]!): DailyRecord[] {
  return Array.from({ length: n }, (_, i) => {
    const day = i + 1;
    return {
      dateKey: `2026-11-${String(day).padStart(2, '0')}`,
      deckId: CONTENT.deckId,
      cardId: card(day),
      themeId: 'self',
      archetypeId: null,
      locale: 'de',
      contentVersion: CONTENT.version,
      content: {} as DailyRecord['content'],
      revealedAt: new Date(2026, 10, day, 9).toISOString(),
      note: '',
    };
  });
}

describe('spread definitions (V05.2)', () => {
  it('arrange roles R1–R8; edition spreads need their right', () => {
    expect(new Set(SPREADS.map((s) => s.id)).size).toBe(SPREADS.length);
    expect(byId('classic-3').roles).toEqual(POSITIONS);
    for (const s of SPREADS) {
      expect(s.synthesis, s.id).toBeLessThan(s.roles.length);
      for (const r of s.roles) expect(ROLES).toContain(r);
    }
    expect(SPREADS.filter((s) => s.right === 'edition.spreads').map((s) => s.id)).toEqual(['two-ways-5', 'connection-5']);
    expect(new Set(SPREADS.flatMap((s) => s.roles))).toEqual(new Set(ROLES));
    expect(spreadTextKeys()).toHaveLength(72);
  });

  it('every card has a text in every role, in both languages', async () => {
    for (const locale of LOCALES) {
      const { deep } = await tables(locale);
      for (const role of ROLES) for (const id of ids) expect(roleText(CONTENT, deep, role, id, locale).length, `${role} ${id}`).toBeGreaterThan(20);
    }
  });
});

describe('matrix: every spread gives a complete text', () => {
  it('10,000 drawn spreads per language, every theme, without a gap', async () => {
    const rng = seededRng(52);
    const facts: Facts = { dailies: dailies(40), readings: [] };
    const gaps: string[] = [];
    const spreads = SPREADS.filter((s) => s.id !== 'classic-3'); // classic: unchanged, covered by content-matrix
    for (const locale of LOCALES) {
      const texts = await tables(locale);
      for (let i = 0; i < 10_000; i++) {
        const spread = spreads[i % spreads.length]!;
        const themeId = themes[Math.floor(rng() * themes.length)] as ThemeId;
        const draft = createSpreadDraft(CONTENT, spread.id, themeId, at(28), rng, facts);
        const c = composeSpread(CONTENT, spread, draft, locale, texts);
        const all = [c.intro, c.synthesis, c.synthesisTitle, c.reflection, c.themeLabel, c.spreadName, ...c.positions.flatMap((p) => [p.positionLabel, p.question, p.text, p.cardTitle, p.essence])];
        const complete =
          c.positions.length === spread.roles.length && all.every((s) => typeof s === 'string' && s.length > 0) && (!spread.review || (c.past?.cards.length ?? 0) > 0);
        if (!complete) gaps.push(`${locale} ${spread.id} ${draft.cardIds.join(',')} ${themeId}`);
      }
    }
    expect(gaps).toEqual([]);
  });

  it('decision and connection keep their fixed theme', () => {
    const draft = createSpreadDraft(CONTENT, 'two-ways-5', 'creativity', at(3), seededRng(3));
    expect(draft.themeId).toBe('change');
    expect(createSpreadDraft(CONTENT, 'connection-5', 'career', at(3), seededRng(3)).themeId).toBe('love');
    expect(createSpreadDraft(CONTENT, 'light-shadow-3', 'career', at(3), seededRng(3)).themeId).toBe('career');
  });
});

describe('which spreads are offered', () => {
  const ctx = (journeyDay: number, facts: Facts, provider = CoreOnlyProvider) => ({ has: provider.has, journeyDay, facts });
  const names = (list: SpreadDef[]) => list.map((s) => s.id);

  it('free spreads only, reviews from journey day 7 and 30 with own cards', () => {
    expect(names(availableSpreads(ctx(1, { dailies: [], readings: [] })))).toEqual(['classic-3', 'light-shadow-3', 'new-beginning-4']);
    expect(names(availableSpreads(ctx(7, { dailies: dailies(6), readings: [] })))).toContain('review-week');
    expect(names(availableSpreads(ctx(7, { dailies: [], readings: [] })))).not.toContain('review-week');
    expect(names(availableSpreads(ctx(29, { dailies: dailies(28), readings: [] })))).not.toContain('review-month');
    expect(names(availableSpreads(ctx(30, { dailies: dailies(29), readings: [] })))).toContain('review-month');
  });

  it('edition spreads are built but only offered with edition.spreads', () => {
    const facts: Facts = { dailies: [], readings: [] };
    expect(names(availableSpreads(ctx(1, facts)))).not.toContain('two-ways-5');
    expect(names(availableSpreads(ctx(1, facts, TestProvider())))).toEqual(['classic-3', 'light-shadow-3', 'new-beginning-4', 'two-ways-5', 'connection-5']);
  });
});

describe('review spread', () => {
  it('takes the thread from the own cards and draws one new card', () => {
    const fool = ids[0]!;
    // The Fool on days 3 and 5, other cards once: the Fool is the thread.
    const facts: Facts = { dailies: dailies(7, (d) => (d === 3 || d === 5 ? fool : ids[d]!)), readings: [] };
    const { past, thread } = reviewCards(facts, 'week');
    expect(thread).toBe(fool);
    expect(past).toHaveLength(6);
    const draft = createSpreadDraft(CONTENT, 'review-week', 'self', at(8), seededRng(8), facts);
    expect(draft.cardIds[0]).toBe(fool);
    expect(draft.revealed).toEqual([true, false]);
    expect(past).not.toContain(draft.cardIds[1]);
    expect(draft.past).toEqual(past);
  });

  it('breaks a tie by the most recent card and copes with a month that met every card', () => {
    const tie = reviewCards({ dailies: dailies(4, (d) => ids[d % 2]!), readings: [] }, 'week');
    expect(tie.thread).toBe(ids[0]); // day 4 is the most recent
    const all = dailies(30, (d) => ids[(d - 1) % 22]!);
    const draft = createSpreadDraft(CONTENT, 'review-month', 'self', at(30), seededRng(30), { dailies: all, readings: [] });
    expect(new Set(draft.cardIds).size).toBe(2);
  });
});

describe('stored readings', () => {
  it('the classic spread keeps its draft and record shape from 0.2', () => {
    expect(createSpreadDraft(CONTENT, 'classic-3', 'love', at(4), seededRng(4))).toEqual(createDraft(CONTENT, 'love', at(4), seededRng(4)));
    const reading = finalizeReading(CONTENT, revealAll(createDraft(CONTENT, 'love', at(4), seededRng(4))), 'de', at(4));
    expect(reading).not.toHaveProperty('spreadId');
    expect(reading).not.toHaveProperty('roles');
    expect(isReading(reading)).toBe(true);
  });

  it('a new spread stores spread, roles and labels, and its roles count as encounters', async () => {
    const texts = await tables('de');
    let draft = createSpreadDraft(CONTENT, 'light-shadow-3', 'self', at(9), seededRng(9));
    expect(isDraft(draft)).toBe(true);
    draft = revealPosition(draft, 1);
    expect(draft.revealed).toEqual([false, true, false]);
    expect(() => finalizeReading(CONTENT, draft, 'de', at(9), texts)).toThrow();
    const reading = finalizeReading(CONTENT, revealAll(draft), 'de', at(9), texts);
    expect(reading).toMatchObject({ spreadId: 'light-shadow-3', roles: ['light', 'shadow', 'bridge'] });
    expect(reading.content.positions.map((p) => p.positionLabel)).toEqual(['Licht', 'Schatten', 'Brücke']);
    expect(isReading(reading)).toBe(true);
    expect(isReading({ ...reading, content: { ...reading.content, positions: reading.content.positions.slice(0, 2) } })).toBe(false);
    expect(isDraft({ ...draft, revealed: [true] })).toBe(false);
    expect([...cardEncounters({ dailies: [], readings: [reading] }).get(reading.cardIds[1]!)!.roles]).toEqual(['shadow']);
  });

  it('a missing text throws instead of leaving a gap', () => {
    const draft = createSpreadDraft(CONTENT, 'new-beginning-4', 'self', at(2), seededRng(2));
    expect(() => composeSpread(CONTENT, byId('new-beginning-4'), draft, 'de', {})).toThrow(/Missing/);
  });
});

describe('content gate for spread frames', () => {
  it('rejects an outcome position and a claim about the other person', () => {
    const rules = { ...MODULE_RULES.spreads!, required: () => [] };
    const bad: Record<Locale, TextTable> = {
      de: { 'pos.connection-5.2.label': 'Ergebnis', 'pos.connection-5.2.question': 'Was denkt er über dich?' },
      en: { 'pos.connection-5.2.label': 'Outcome', 'pos.connection-5.2.question': 'What does she feel for you?' },
    };
    const report = validateModule('spreads', rules, CONTENT, bad);
    expect(report.errors.filter((e) => e.includes('forbidden phrasing')).length).toBeGreaterThanOrEqual(3);
  });
});
