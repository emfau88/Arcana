/** Shared steps of the end-to-end tests. */
import { expect, type Page, type TestInfo } from '@playwright/test';
import { de, type Messages } from '../../src/i18n/de.ts';
import { en } from '../../src/i18n/en.ts';
import { fmt } from '../../src/i18n/index.ts';
import { screensDe, type ScreenMessages } from '../../src/i18n/screens.de.ts';
import { screensEn } from '../../src/i18n/screens.en.ts';

/** UI strings of the locale the project emulates (the app follows the system language). */
export function ui(info: TestInfo): Messages {
  return String(info.project.use.locale ?? 'de').startsWith('de') ? de : en;
}

/** Texts of the on-demand screens (V04) in the project's locale. */
export function screens(info: TestInfo): ScreenMessages {
  return String(info.project.use.locale ?? 'de').startsWith('de') ? screensDe : screensEn;
}

/** Fails the test on page errors, console errors or any request leaving the local origin. */
export function guard(page: Page) {
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

export async function completeOnboarding(page: Page, t: Messages) {
  await page.goto('./');
  await page.getByRole('button', { name: t.welcome.start }).click();
  // Seven questions (V04.1) plus the theme step.
  for (let i = 0; i < 7; i++) {
    // Each answer advances by itself; wait for the next step before answering again.
    await expect(page.getByText(fmt(t.onboarding.progress, { n: i + 1, total: 8 }), { exact: true })).toBeVisible();
    await page.getByRole('radio').nth(i % 4).click();
  }
  await expect(page.getByText(fmt(t.onboarding.progress, { n: 8, total: 8 }), { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: t.onboarding.themeTitle })).toBeVisible();
  await page.getByRole('radio').nth(1).click();
  await page.getByRole('button', { name: t.onboarding.finish }).click();
  await expect(page.getByText(t.archetype.eyebrow, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: t.archetype.toToday }).click();
}
