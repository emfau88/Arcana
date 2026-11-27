import { expect, test, type Locator } from '@playwright/test';
import { fmt } from '../../src/i18n/index.ts';
import { guard, ui } from './helpers.ts';

/**
 * Design plan points 1 and 4 (D-63): on every phone size the main action of a screen is on the
 * first screen, without scrolling. Before, "Archetyp enthüllen", "Zur Tageskarte" and "Drei
 * Karten ziehen" lay below the visible area. Checked on the three phone projects.
 */
async function fullyVisible(button: Locator) {
  await expect(button).toBeInViewport({ ratio: 1 });
  // Nothing lies on top of it (the tab bar, another layer): its centre hits the button itself.
  expect(
    await button.evaluate((b) => {
      const q = b.getBoundingClientRect();
      const top = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
      return top === b || b.contains(top);
    }),
  ).toBe(true);
}

test('the main action stays on the first screen: theme step, reveal and oracle', async ({ page }, info) => {
  test.skip(info.project.name === 'desktop-de', 'phone layouts');
  const problems = guard(page);
  const t = ui(info);

  await page.goto('./');
  const start = page.getByRole('button', { name: t.welcome.start });
  await expect(start).toBeVisible();
  if (info.project.name !== 'small-de-320') {
    // The privacy line sits right under the main button and is not cut off (point 4).
    await expect(page.getByText(t.welcome.privacy)).toBeInViewport({ ratio: 1 });
    await expect(page.getByRole('button', { name: t.welcome.skipAll })).toBeInViewport({ ratio: 1 });
  }
  await start.click();
  for (let i = 0; i < 7; i++) {
    await expect(page.getByText(fmt(t.onboarding.progress, { n: i + 1, total: 8 }), { exact: true })).toBeVisible();
    await page.getByRole('radio').nth(i % 4).click();
  }
  await expect(page.getByRole('heading', { name: t.onboarding.themeTitle })).toBeVisible();
  const finish = page.getByRole('button', { name: t.onboarding.finish });
  await fullyVisible(finish);
  await finish.click();

  // The way on appears with the last step of the reveal and is in view without scrolling.
  const toToday = page.getByRole('button', { name: t.archetype.toToday });
  await expect(toToday).toBeVisible();
  await fullyVisible(toToday);
  await toToday.click();

  await page.getByRole('link', { name: t.nav.oracle }).click();
  await fullyVisible(page.getByRole('button', { name: t.oracle.draw }));
  expect(problems).toEqual([]);
});

test('a drawn spread shows its three position names on one line each', async ({ page }, info) => {
  test.skip(!['mobile-de-412', 'mobile-en-360'].includes(info.project.name), 'one viewport per language');
  const t = ui(info);
  await page.goto('./');
  await page.getByRole('button', { name: t.welcome.skipAll }).click();
  await page.getByRole('link', { name: t.nav.oracle }).click();
  await page.getByRole('button', { name: t.oracle.draw }).click();
  const names = page.locator('.spread__pos');
  await expect(names).toHaveCount(3);
  const lines = await names.evaluateAll((els) =>
    els.map((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return Math.round(range.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight));
    }),
  );
  expect(lines).toEqual([1, 1, 1]);
});
