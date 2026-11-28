import { expect, test, type Page } from '@playwright/test';
import { texts as spreadsDe } from '../../src/content/modules/spreads.de.ts';
import { texts as spreadsEn } from '../../src/content/modules/spreads.en.ts';
import type { Reading } from '../../src/domain/types.ts';
import { completeOnboarding, guard, pastDays, putDaily, readProfile, ui } from './helpers.ts';

/**
 * V05.6: the oracle as a stage (D-64 point 2 A) with the spreads of V05.2. Only spreads the
 * person has the right to are shown (edition spreads stay invisible without billing), reviews
 * from their journey day on; the cards of the chosen spread lie face down before drawing.
 */
const ONE_PER_LANGUAGE = ['mobile-de-412', 'mobile-en-360'];

async function readings(page: Page): Promise<Reading[]> {
  return page.evaluate(
    () =>
      new Promise<Reading[]>((resolve, reject) => {
        const r = indexedDB.open('personal-oracle');
        r.onsuccess = () => {
          const g = r.result.transaction('readings').objectStore('readings').getAll();
          g.onsuccess = () => (r.result.close(), resolve(g.result as Reading[]));
          g.onerror = () => reject(g.error);
        };
        r.onerror = () => reject(r.error);
      }),
  );
}

test('the oracle offers the core spreads only and reads a four-card spread in full (DE/EN)', async ({ page }, info) => {
  test.skip(!ONE_PER_LANGUAGE.includes(info.project.name), 'one viewport per language');
  const t = ui(info);
  const s = String(info.project.use.locale).startsWith('de') ? spreadsDe : spreadsEn;
  const problems = guard(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.getByRole('button', { name: t.welcome.skipAll }).click();
  await page.getByRole('link', { name: t.nav.oracle }).click();

  // Journey day 1, no edition: three spreads, no review, no edition spread, not even as a placeholder.
  const spreads = page.getByRole('radiogroup', { name: t.oracle.chooseSpread }).getByRole('radio');
  await expect(spreads).toHaveText([s['spread.classic-3.name']!, s['spread.light-shadow-3.name']!, s['spread.new-beginning-4.name']!]);
  for (const id of ['two-ways-5', 'connection-5', 'review-week', 'review-month']) {
    await expect(page.getByText(s[`spread.${id}.name`]!, { exact: true })).toHaveCount(0);
  }
  await expect(page.locator('.stage-spread__slot')).toHaveCount(3);

  await spreads.nth(2).click();
  await expect(spreads.nth(2)).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByText(s['spread.new-beginning-4.tagline']!, { exact: true })).toBeVisible();
  await expect(page.locator('.stage-spread__slot')).toHaveCount(4);
  await page.getByRole('button', { name: t.oracle.drawCount[4] }).click();

  await expect(page.locator('.screen-head .flank__text')).toHaveText(s['spread.new-beginning-4.name']!);
  await expect(page.locator('.spread button.ocard')).toHaveCount(4);
  await page.getByRole('button', { name: t.oracle.revealAll }).click();
  await expect(page.locator('.interpretation__ask')).toHaveText([1, 2, 3, 4].map((i) => s[`pos.new-beginning-4.${i}.question`]!));
  await page.getByRole('button', { name: t.oracle.save }).click();
  await expect(page.getByRole('button', { name: t.oracle.newReading })).toBeVisible();
  const saved = await readings(page);
  expect(saved.map((r) => [r.spreadId, r.cardIds.length])).toEqual([['new-beginning-4', 4]]);
  expect(problems).toEqual([]);
});

test('the week review appears from journey day 7 and begins with the own cards', async ({ page }, info) => {
  test.skip(!ONE_PER_LANGUAGE.includes(info.project.name), 'one viewport per language');
  const t = ui(info);
  const s = String(info.project.use.locale).startsWith('de') ? spreadsDe : spreadsEn;
  const problems = guard(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await completeOnboarding(page, t);
  // Seven recorded days before today: today is journey day 8.
  const days = pastDays(await readProfile(page), 7, {});
  await putDaily(page, days);
  await page.goto('./#/oracle');
  await page.reload();

  const spreads = page.getByRole('radiogroup', { name: t.oracle.chooseSpread }).getByRole('radio');
  await expect(spreads.filter({ hasText: s['spread.review-week.name']! })).toHaveCount(1);
  await expect(page.getByText(s['spread.review-month.name']!, { exact: true })).toHaveCount(0);
  await spreads.filter({ hasText: s['spread.review-week.name']! }).click();
  await expect(page.locator('.stage-spread__slot')).toHaveCount(2);
  await page.getByRole('button', { name: t.oracle.drawCount[1] }).click();

  // The thread card from the own week lies face up, the new card is drawn.
  await expect(page.locator('.spread .ocard')).toHaveCount(2);
  await expect(page.locator('.spread button.ocard')).toHaveCount(1);
  await page.locator('.spread button.ocard').click();
  await expect(page.getByText(s['review.week.past']!, { exact: true })).toBeVisible();
  await expect(page.locator('.past-cards__item')).toHaveCount(days.length);
  await expect(page.locator('.interpretation__ask')).toHaveText([s['pos.review-week.1.question']!, s['pos.review-week.2.question']!]);
  expect(problems).toEqual([]);
});

test('B-12: at 130 % text the cards of a drawn spread stay on one line', async ({ page }, info) => {
  test.skip(info.project.name === 'desktop-de', 'phone layouts');
  const t = ui(info);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.getByRole('button', { name: t.welcome.skipAll }).click();
  await page.getByRole('link', { name: t.nav.oracle }).click();
  // Inline style through the CSSOM, which the strict CSP allows (no style element).
  await page.evaluate(() => (document.documentElement.style.fontSize = '130%'));
  await page.getByRole('button', { name: t.oracle.draw }).click();
  await expect(page.locator('.spread .ocard')).toHaveCount(3);
  await page.evaluate(() => document.fonts.ready);
  const tops = await page.locator('.spread .ocard').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
  expect(tops).toHaveLength(3);
  expect(new Set(tops).size).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  // B-15: the draw is random, so the longest single word of the 22 names ("Hohepriesterin") is set
  // into every position; it breaks inside its column instead of running past the screen edge.
  const edges = await page.locator('.spread__name').evaluateAll((els) =>
    els.map((e) => {
      e.textContent = 'II · Die Hohepriesterin';
      const range = document.createRange();
      range.selectNodeContents(e);
      const r = range.getBoundingClientRect();
      return [Math.round(r.left), Math.round(r.right)];
    }),
  );
  const width = await page.evaluate(() => document.documentElement.clientWidth);
  for (const [left, right] of edges) expect(left >= -1 && right <= width + 1, `name ${left}–${right} within ${width}`).toBe(true);
});
