import { expect, test } from '@playwright/test';
import { de } from '../../src/i18n/de.ts';
import { en } from '../../src/i18n/en.ts';
import { CONTENT } from '../../src/content/index.ts';
import { texts as identityDe } from '../../src/content/modules/identity.de.ts';

/**
 * V03.3: content modules load per locale. Once the app has started, the questionnaire works
 * without a network (its module came with the start). A language whose texts are not loaded yet
 * fails visibly and changes nothing; with the network back it works. (Android bundles every
 * module locally, so there this case cannot happen.)
 */
test('content modules: onboarding works offline after start; a missing language fails clearly', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'mobile-de-412', 'covered once');
  const failedScripts: string[] = [];
  page.on('requestfailed', (r) => {
    if (r.resourceType() === 'script' || r.url().endsWith('.js')) failedScripts.push(r.url());
  });
  page.on('pageerror', (e) => failedScripts.push(`pageerror: ${e.message}`));

  await page.goto('./');
  await expect(page.getByRole('button', { name: de.welcome.start })).toBeVisible();
  // "After start" includes the idle prefetch (screens and the archetype texts of the reveal).
  await page.waitForLoadState('networkidle');
  await context.setOffline(true);

  await page.getByRole('button', { name: de.welcome.start }).click();
  for (const q of CONTENT.questions.map((x) => x.id)) {
    await expect(page.getByRole('heading', { name: identityDe[`question.${q}.prompt`] })).toBeVisible();
    // Answers come from the module too, never raw keys.
    await expect(page.getByText(`question.${q}.`, { exact: false })).toHaveCount(0);
    await page.getByRole('radio').first().click();
  }
  await expect(page.getByRole('heading', { name: de.onboarding.themeTitle })).toBeVisible();
  await page.getByRole('radio').nth(1).click();
  await page.getByRole('button', { name: de.onboarding.finish }).click();
  await expect(page.getByText(de.archetype.eyebrow, { exact: true })).toBeVisible();
  expect(failedScripts, 'no script needed the network after start').toEqual([]);

  // English texts were never loaded: the switch says so and keeps German.
  await page.getByRole('button', { name: de.archetype.toToday }).click();
  await page.getByRole('link', { name: de.nav.profile }).click();
  await page.getByRole('button', { name: de.profile.settings }).click();
  await page.getByRole('radio', { name: 'English' }).click();
  await expect(page.getByText(de.errors.contentLoad)).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.getByRole('heading', { level: 1, name: de.profile.settings })).toBeVisible();

  await context.setOffline(false);
  await page.getByRole('radio', { name: 'English' }).click();
  await expect(page.getByRole('heading', { level: 1, name: en.profile.settings })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
