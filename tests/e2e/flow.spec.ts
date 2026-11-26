import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { de, type Messages } from '../../src/i18n/de.ts';
import { en } from '../../src/i18n/en.ts';
import { fmt } from '../../src/i18n/index.ts';

/** UI strings of the locale the project emulates (the app follows the system language). */
function ui(info: TestInfo): Messages {
  return String(info.project.use.locale ?? 'de').startsWith('de') ? de : en;
}

/** Fails the test on page errors, console errors or any request leaving the local origin. */
function guard(page: Page) {
  const problems: string[] = [];
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(`console: ${m.text()}`);
  });
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.protocol !== 'data:' && u.hostname !== '127.0.0.1') problems.push(`external request: ${r.url()}`);
  });
  return problems;
}

async function completeOnboarding(page: Page, t: Messages) {
  await page.goto('./');
  await page.getByRole('button', { name: t.welcome.start }).click();
  for (let i = 0; i < 4; i++) {
    // Each answer advances by itself; wait for the next step before answering again.
    await expect(page.getByText(fmt(t.onboarding.progress, { n: i + 1, total: 5 }), { exact: true })).toBeVisible();
    await page.getByRole('radio').nth(i % 4).click();
  }
  await expect(page.getByText(fmt(t.onboarding.progress, { n: 5, total: 5 }), { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: t.onboarding.themeTitle })).toBeVisible();
  await page.getByRole('radio').nth(1).click();
  await page.getByRole('button', { name: t.onboarding.finish }).click();
  await expect(page.getByText(t.archetype.eyebrow, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: t.archetype.toToday }).click();
}

test('complete G1 flow: onboarding → daily card → reading → grimoire → profile, persisted', async ({ page }, info) => {
  const t = ui(info);
  const problems = guard(page);
  await completeOnboarding(page, t);

  // Daily card: reveal once, then it stays the same card for the day.
  await page.getByRole('button', { name: t.today.draw }).click();
  await expect(page.getByText(t.today.message, { exact: true })).toBeVisible();
  const title = await page.locator('#today-card-title').textContent();
  expect(title).toBeTruthy();
  await expect(page.getByText(t.today.collected, { exact: true })).toBeVisible();

  // Three-card reading, revealed one by one and saved.
  await page.getByRole('link', { name: t.nav.oracle }).click();
  await page.getByRole('button', { name: t.oracle.draw }).click();
  const hidden = page.locator('.spread button.ocard');
  await expect(hidden).toHaveCount(3);
  await hidden.first().click();
  await expect(page.locator('.spread button.ocard')).toHaveCount(2);
  await page.getByRole('button', { name: t.oracle.revealAll }).click();
  await expect(page.getByText(t.oracle.synthesis, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: t.oracle.save }).click();
  await expect(page.getByRole('button', { name: t.oracle.newReading })).toBeVisible();

  // Grimoire: collection and history reflect both.
  await page.getByRole('link', { name: t.nav.grimoire }).click();
  await expect(page.locator('.collection .ocard').first()).toBeVisible();
  await page.getByRole('tab', { name: t.grimoire.history }).click();
  await expect(page.locator('.history__row')).toHaveCount(2);

  // Persistence across a full reload.
  await page.goto('./#/today');
  await page.reload();
  await expect(page.locator('#today-card-title')).toHaveText(title!);
  await page.goto('./#/grimoire/history');
  await expect(page.locator('.history__row')).toHaveCount(2);

  // No horizontal overflow on any width.
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  expect(problems).toEqual([]);
});

test('skipping the questions gives an open profile, never an invented one', async ({ page }, info) => {
  const t = ui(info);
  const problems = guard(page);
  await page.goto('./');
  await page.getByRole('button', { name: t.welcome.skipAll }).click();
  // Fast path: straight to today's card with the default theme and no archetype.
  await page.getByRole('button', { name: t.today.draw }).click();
  await expect(page.getByText(t.today.message, { exact: true })).toBeVisible();
  await expect(page.getByText(t.today.lens, { exact: true })).toHaveCount(0);
  await page.getByRole('link', { name: t.nav.profile }).click();
  await expect(page.getByRole('button', { name: t.profile.determine })).toBeVisible();
  expect(problems).toEqual([]);
});

test('answering only one question gives the open profile', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-de-412', 'covered once');
  const t = ui(info);
  await page.goto('./');
  await page.getByRole('button', { name: t.welcome.start }).click();
  await page.getByRole('radio').first().click();
  await expect(page.getByText(fmt(t.onboarding.progress, { n: 2, total: 5 }), { exact: true })).toBeVisible();
  await page.getByRole('button', { name: t.onboarding.skipRest }).click();
  await page.getByRole('button', { name: t.onboarding.finish }).click();
  await expect(page.getByText(t.archetype.neutralTitle)).toBeVisible();
});

test('a half-revealed reading is restored after reload, not silently re-drawn', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-de-412', 'one viewport is enough for persistence logic');
  const t = ui(info);
  await completeOnboarding(page, t);
  await page.getByRole('link', { name: t.nav.oracle }).click();
  await page.getByRole('button', { name: t.oracle.draw }).click();
  await page.locator('.spread button.ocard').first().click();
  const firstName = await page.locator('.spread__name.is-shown').first().textContent();
  await page.reload();
  await expect(page.locator('.spread__name.is-shown').first()).toHaveText(firstName!);
  await expect(page.locator('.spread button.ocard')).toHaveCount(2);
});

test('notes are saved locally and survive a reload; back returns to the origin', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-de-412', 'one viewport is enough for persistence logic');
  const t = ui(info);
  await completeOnboarding(page, t);
  await page.getByRole('button', { name: t.today.draw }).click();
  await page.getByRole('button', { name: t.today.addNote }).click();
  await page.getByRole('textbox').fill('Synthetische Testnotiz');
  await page.getByRole('button', { name: t.detail.saveNote }).click();
  await expect(page.getByText(t.detail.noteSaved)).toBeVisible();
  await page.reload();
  await expect(page.getByRole('textbox')).toHaveValue('Synthetische Testnotiz');
  await page.getByRole('button', { name: t.common.back }).first().click();
  await expect(page.locator('#today-card-title')).toBeVisible();
});

test('language switch and deleting all local data', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-de-412', 'covered once');
  await completeOnboarding(page, de);
  await page.getByRole('link', { name: de.nav.profile }).click();
  await page.getByRole('radio', { name: 'English' }).click();
  await expect(page.getByRole('heading', { name: en.profile.title })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: en.profile.delete }).click();
  await page.getByRole('button', { name: en.profile.deleteConfirm }).click();
  await expect(page.getByRole('button', { name: de.welcome.start })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: de.welcome.start })).toBeVisible();
});

test('reduced motion reveals instantly and the app is keyboard operable', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-de', 'keyboard path on desktop');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const start = page.getByRole('button', { name: de.welcome.start });
  await start.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: de.onboarding.skipRest })).toBeVisible();
  await page.getByRole('button', { name: de.onboarding.skipRest }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: de.onboarding.finish }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: de.archetype.toToday }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: de.today.draw }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText(de.today.message, { exact: true })).toBeVisible({ timeout: 1500 });
  // Every interactive element has an accessible name.
  const unnamed = await page.evaluate(() =>
    [...document.querySelectorAll('button, a[href], [role="radio"], [role="tab"]')]
      .filter((el) => !(el.getAttribute('aria-label') || el.textContent?.trim() || el.getAttribute('aria-labelledby')))
      .map((el) => el.outerHTML.slice(0, 80)),
  );
  expect(unnamed).toEqual([]);
});

test('production build ships a strict CSP and only local assets', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-de', 'covered once');
  const problems = guard(page);
  await page.goto('./');
  const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
  expect(csp).toContain("default-src 'self'");
  expect(csp).not.toMatch(/https?:/);
  await expect(page.getByRole('button', { name: de.welcome.start })).toBeVisible();
  const grain = await page.evaluate(() => getComputedStyle(document.querySelector('.world')!, '::before').backgroundImage);
  expect(grain).toContain('grain.webp');
  const status = await page.evaluate(async (u) => (await fetch(u)).status, grain.replace(/^url\("?|"?\)$/g, ''));
  expect(status).toBe(200);
  expect(problems).toEqual([]);
});
