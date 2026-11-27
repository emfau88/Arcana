import { expect, test, type Page } from '@playwright/test';
import { CONTENT } from '../../src/content/index.ts';
import { localDateKey } from '../../src/domain/clock.ts';
import { composeDaily } from '../../src/domain/oracle.ts';
import type { DailyRecord, Profile } from '../../src/domain/types.ts';
import { de } from '../../src/i18n/de.ts';
import { fmt } from '../../src/i18n/index.ts';
import { screensDe } from '../../src/i18n/screens.de.ts';
import { completeOnboarding, guard, screens, ui } from './helpers.ts';

/*
 * V04 screens (proposal for the owner's review, D-57): "Ich" with "Why?", the eight archetypes,
 * the share card drawn on the device, the star map with the first weekly review, and the reveal
 * with reduced motion.
 */

async function readProfile(page: Page): Promise<Profile> {
  return page.evaluate(
    () =>
      new Promise<Profile>((resolve, reject) => {
        const r = indexedDB.open('personal-oracle');
        r.onsuccess = () => {
          const g = r.result.transaction('kv').objectStore('kv').get('profile');
          g.onsuccess = () => {
            r.result.close();
            resolve(g.result as Profile);
          };
          g.onerror = () => reject(g.error);
        };
        r.onerror = () => reject(r.error);
      }),
  );
}

/** Daily records on the `n` days before today, built with the app's own domain code. */
function pastDays(profile: Profile, n: number, notes: Record<number, string>): DailyRecord[] {
  const ids = CONTENT.cards.map((c) => c.id);
  return Array.from({ length: n }, (_, k) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - k));
    const dateKey = localDateKey(d);
    const cardId = ids[k % ids.length]!;
    return {
      dateKey,
      deckId: CONTENT.deckId,
      cardId,
      themeId: profile.themeId,
      archetypeId: profile.archetypeId,
      locale: 'de',
      contentVersion: CONTENT.version,
      content: composeDaily(CONTENT, cardId, profile.themeId, profile.archetypeId, 'de'),
      revealedAt: new Date(`${dateKey}T08:00:00`).toISOString(),
      note: notes[k] ?? '',
    } as DailyRecord;
  });
}

async function putDaily(page: Page, records: DailyRecord[]) {
  await page.evaluate(
    (records) =>
      new Promise((resolve, reject) => {
        const r = indexedDB.open('personal-oracle');
        r.onsuccess = () => {
          const tx = r.result.transaction('daily', 'readwrite');
          for (const rec of records) tx.objectStore('daily').put(rec);
          tx.oncomplete = () => {
            r.result.close();
            resolve(null);
          };
          tx.onerror = () => reject(tx.error);
        };
        r.onerror = () => reject(r.error);
      }),
    records,
  );
}

test('V04: "Ich" explains the archetype, lists all eight and draws the share card on the device', async ({ page }, info) => {
  test.skip(!['mobile-de-412', 'mobile-en-360'].includes(info.project.name), 'one viewport per language');
  const t = ui(info);
  const s = screens(info);
  const locale = String(info.project.use.locale).startsWith('de') ? 'de' : 'en';
  const problems = guard(page);
  // No system share sheet in the test browser: the card is saved as a file instead.
  await page.addInitScript(() => Object.defineProperty(navigator, 'canShare', { value: () => false, configurable: true }));
  await completeOnboarding(page, t);
  await page.getByRole('link', { name: t.nav.profile }).click();
  await expect(page.getByRole('heading', { level: 1, name: t.profile.title })).toBeVisible();
  const profile = await readProfile(page);
  const name = CONTENT.archetypes.find((a) => a.id === profile.archetypeId)!.name[locale];

  // "Why?": totals for all eight, the seven answers with their points.
  await page.getByRole('button', { name: s.me.why }).click();
  await expect(page).toHaveURL(/#\/archetype\/why/);
  await expect(page.getByRole('heading', { level: 1, name: fmt(s.why.title, { name }) })).toBeVisible();
  await expect(page.locator('.why__bar')).toHaveCount(8);
  await expect(page.locator('.why__answer')).toHaveCount(7);
  await page.getByRole('button', { name: t.common.back }).click();
  await expect(page.getByRole('heading', { level: 1, name: t.profile.title })).toBeVisible();

  // The eight archetypes: every portrait and profile can be read, the own one is marked.
  await page.getByRole('button', { name: s.me.library }).click();
  await expect(page.getByRole('heading', { level: 1, name: s.library.title })).toBeVisible();
  await expect(page.locator('.library__item')).toHaveCount(8);
  await expect(page.locator('.library__item', { hasText: s.library.yours })).toContainText(name);
  const other = CONTENT.archetypes.find((a) => a.id !== profile.archetypeId && a.id !== profile.secondaryArchetypeId)!;
  await page.locator('.library__item', { hasText: other.name[locale] }).click();
  await expect(page.getByRole('heading', { level: 1, name: other.name[locale] })).toBeVisible();
  await expect(page.getByText(s.me.strengths, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: t.common.back }).click();
  await page.getByRole('button', { name: t.common.back }).click();
  await expect(page.getByRole('heading', { level: 1, name: t.profile.title })).toBeVisible();

  // Share card: drawn on the device within 1.5 s (V04.7), only local data, saved under a neutral name.
  await page.getByRole('button', { name: s.me.share }).click();
  const preview = page.locator('.share-page__preview img');
  await expect(preview).toBeVisible({ timeout: 5000 });
  expect(await preview.getAttribute('src')).toMatch(/^data:image\/png;base64,/);
  const ms = Number(await page.locator('.share-page__preview').getAttribute('data-export-ms'));
  expect(ms, 'export time in ms').toBeLessThanOrEqual(1500);
  await page.getByRole('radio', { name: s.share.feed }).click();
  await expect(page.locator('.share-page__preview--feed img')).toBeVisible({ timeout: 5000 });
  // Image comparison (V04.7): the feed card, scaled to a quarter in the same browser so the
  // reference stays small. The test runs once per language (the viewport does not change the card).
  const quarter = await page.locator('.share-page__preview--feed img').evaluate(async (img: HTMLImageElement) => {
    await img.decode();
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth / 4);
    c.height = Math.round(img.naturalHeight / 4);
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/png');
  });
  expect(Buffer.from(quarter.split(',')[1], 'base64')).toMatchSnapshot(`archetype-feed-${locale}.png`, { maxDiffPixelRatio: 0.01 });
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: s.share.action, exact: true }).click();
  expect((await download).suggestedFilename()).toBe(`arcana-${profile.archetypeId}-feed.png`);
  await expect(page.getByText(s.share.downloaded)).toBeVisible();
  expect(problems).toEqual([]);
});

test('V04: the star map grows with recorded days and the first weekly review quotes own notes', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-de-412', 'covered once');
  const problems = guard(page);
  await completeOnboarding(page, de);
  const profile = await readProfile(page);
  await putDaily(page, pastDays(profile, 7, { 2: 'Ein stiller Morgen am Fenster.' }));
  await page.reload();

  await page.getByRole('link', { name: de.nav.grimoire }).click();
  const entry = page.getByRole('button', { name: de.grimoire.journeyEntry });
  await expect(entry).toContainText(de.common.new);
  await entry.click();
  await expect(page.getByRole('heading', { level: 1, name: screensDe.journeyMap.title })).toBeVisible();
  await expect(page.locator('.starmap__star')).toHaveCount(21);

  const week = fmt(screensDe.review.weekTitle, { n: 1 });
  await page.getByRole('button', { name: week }).click();
  await expect(page.getByRole('heading', { level: 1, name: week })).toBeVisible();
  await expect(page.locator('.review-page__note')).toContainText('Ein stiller Morgen am Fenster.');
  await expect(page.locator('.review-page__cards li')).toHaveCount(7);

  // Opened once, it is no longer new (derived from the seen flag, D-09).
  await page.getByRole('button', { name: de.common.back }).click();
  await expect(page.getByRole('button', { name: week })).not.toContainText(de.common.new);
  expect(problems).toEqual([]);
});

test('V04: with reduced motion the reveal shows everything at once', async ({ page }, info) => {
  test.skip(info.project.name !== 'small-de-320', 'covered once, on the smallest screen');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.getByRole('button', { name: de.welcome.start }).click();
  for (let i = 0; i < 7; i++) {
    await expect(page.getByText(fmt(de.onboarding.progress, { n: i + 1, total: 8 }), { exact: true })).toBeVisible();
    await page.getByRole('radio').nth(i % 4).click();
  }
  await page.getByRole('radio').nth(1).click();
  await page.getByRole('button', { name: de.onboarding.finish }).click();
  // No staged steps and no skip button: the call to action is there at once.
  await expect(page.getByRole('button', { name: de.archetype.toToday })).toBeVisible({ timeout: 800 });
  await expect(page.getByRole('button', { name: de.common.skip, exact: true })).toHaveCount(0);
});
