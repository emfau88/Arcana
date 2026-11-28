import { expect, test, type TestInfo } from '@playwright/test';
import { discoverDe, type DiscoverMessages } from '../../src/i18n/discover.de.ts';
import { discoverEn } from '../../src/i18n/discover.en.ts';
import { fmt } from '../../src/i18n/index.ts';
import { completeOnboarding, guard, ui } from './helpers.ts';

/*
 * V06 Discover (V06.1, V06.3, V06.4): the fifth tab, the search, numbers with the voluntary birth
 * date, angel numbers with encounters, the symbol lexicon. Knowledge is never locked.
 */

const discover = (info: TestInfo): DiscoverMessages => (String(info.project.use.locale ?? 'de').startsWith('de') ? discoverDe : discoverEn);

test('V06: five tabs fit, the search opens an angel number and back returns to the hub', async ({ page }, info) => {
  const t = ui(info);
  const d = discover(info);
  const problems = guard(page);
  await completeOnboarding(page, t);

  // Five labelled tabs; no label runs into its neighbour, also on 320 px.
  const labels = page.locator('.tabbar__label');
  await expect(labels).toHaveText([t.nav.today, t.nav.oracle, t.nav.discover, t.nav.grimoire, t.nav.profile]);
  const boxes = await labels.evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => [r.left, r.right]));
  for (let i = 1; i < boxes.length; i++) expect(boxes[i]![0]! - boxes[i - 1]![1]!, `gap after tab ${i}`).toBeGreaterThan(2);

  await page.getByRole('link', { name: t.nav.discover }).click();
  await expect(page.getByRole('heading', { level: 1, name: d.hub.title })).toBeVisible();
  await page.getByRole('searchbox', { name: d.hub.searchLabel }).fill('11:11');
  await page.getByRole('button', { name: fmt(d.hub.resultAngel, { seq: '11:11' }) }).click();
  await expect(page).toHaveURL(/#\/discover\/angel\/11:11/);
  await expect(page.getByRole('heading', { level: 1, name: `${d.angel.eyebrow} 11:11` })).toBeAttached();
  await expect(page.getByText(d.angel.meaning, { exact: true })).toBeVisible();
  expect(await page.locator('#main').evaluate((m) => m.scrollTop)).toBe(0);
  await page.getByRole('button', { name: t.common.back }).click();
  await expect(page.getByRole('heading', { level: 1, name: d.hub.title })).toBeVisible();
  expect(problems).toEqual([]);
});

test('V06: birth date, numbers, an angel encounter and the symbol lexicon', async ({ page }, info) => {
  test.skip(!['mobile-de-412', 'mobile-en-360'].includes(info.project.name), 'one viewport per language');
  const t = ui(info);
  const d = discover(info);
  const problems = guard(page);
  await completeOnboarding(page, t);

  // Numbers without a birth date: an invitation, all twelve numbers open.
  await page.goto('./#/discover/numbers');
  await expect(page.locator('.discover-numbers__item')).toHaveCount(12);
  await page.getByRole('button', { name: d.numbers.inviteAction }).click();
  await expect(page.getByRole('heading', { level: 1, name: d.birthdate.title })).toBeVisible();
  await page.getByLabel(d.birthdate.label, { exact: true }).fill('1990-07-14');
  await page.getByRole('button', { name: d.birthdate.save }).click();
  await expect(page.getByText(d.birthdate.saved, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: d.birthdate.toNumbers }).click();

  // 14.07.1990: 7 + 5 + 1 = 13 → 4; birthday 14 → 5.
  const core = page.locator('.discover-core__item');
  await expect(core).toHaveCount(3);
  await expect(core.nth(0)).toContainText(d.numbers.lifePath);
  await expect(core.nth(0).locator('.medallion__label')).toHaveText('4');
  await expect(core.nth(1).locator('.medallion__label')).toHaveText('5');
  await page.getByText(d.numbers.howCalculated).click();
  await expect(page.locator('.discover-path__sum')).toContainText('7 + 5 + 1 = 13 → 4');

  // A master number: full text, no locked part (challenges stay hidden without the Edition).
  await page.goto('./#/discover/numbers/22');
  await expect(page.getByText(d.number.strengths, { exact: true })).toBeVisible();
  await expect(page.getByText(d.number.challenges, { exact: true })).toHaveCount(0);

  // Angel number: a composed reading, an encounter with a place, saved.
  await page.goto('./#/discover/angel');
  await page.getByLabel(d.angels.inputLabel).fill('12a');
  await page.getByRole('button', { name: d.angels.lookup }).click();
  await expect(page.getByRole('alert')).toHaveText(d.angels.invalid);
  await page.getByLabel(d.angels.inputLabel).fill('4711');
  await page.getByRole('button', { name: d.angels.lookup }).click();
  await expect(page.getByText(d.angel.composedIntro)).toBeVisible();
  await page.getByRole('button', { name: d.angel.record }).click();
  await expect(page.getByLabel(d.angel.place)).toBeFocused();
  await page.getByLabel(d.angel.place).fill('Bahnhof');
  await page.getByRole('button', { name: d.angel.save, exact: true }).click();
  await expect(page.getByText(d.angel.saved)).toBeVisible();
  await expect(page.locator('.discover__actions')).toContainText(d.angel.notedOne.split(',')[0]!);
  await page.getByRole('button', { name: d.angel.favorite, exact: true }).click();
  await expect(page.getByRole('button', { name: d.angel.favorited, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: t.common.back }).click();
  await expect(page.getByRole('heading', { level: 2, name: d.angels.yours })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: d.angels.favorites })).toBeVisible();

  // Symbols: all 24 open; one without a picture names the archetype it belongs to.
  await page.goto('./#/discover/symbols');
  await expect(page.locator('.discover-symbols__item')).toHaveCount(24);
  await page.locator('.discover-symbols__item', { hasText: d === discoverDe ? 'Eule' : 'Owl' }).click();
  await expect(page.locator('.discover-cards li')).toHaveCount(3);
  await expect(page.getByText(d.symbol.inCards, { exact: true })).toBeVisible();

  // The birth date is deleted on its own; the numbers invite again.
  await page.goto('./#/me/birthdate');
  await page.getByRole('button', { name: d.birthdate.delete }).click();
  await page.getByRole('button', { name: d.birthdate.deleteConfirm, exact: true }).click();
  await expect(page.getByText(d.birthdate.deleted)).toBeVisible();
  await page.goto('./#/discover/numbers');
  await expect(page.getByRole('button', { name: d.numbers.inviteAction })).toBeVisible();
  expect(problems).toEqual([]);
});
