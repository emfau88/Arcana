import { expect, test, type Page } from '@playwright/test';
import { CONTENT } from '../../src/content/index.ts';
import { de } from '../../src/i18n/de.ts';
import { en } from '../../src/i18n/en.ts';
import { fmt } from '../../src/i18n/index.ts';
import { screensDe } from '../../src/i18n/screens.de.ts';
import { screensEn } from '../../src/i18n/screens.en.ts';
import { completeOnboarding, guard, ui } from './helpers.ts';

/** Every store of the app's database with its record count (kv: number of keys). */
async function storeCounts(page: Page): Promise<Record<string, number>> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((res, rej) => {
      const r = indexedDB.open('personal-oracle');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    const names = [...db.objectStoreNames];
    const tx = db.transaction(names, 'readonly');
    const counts: Record<string, number> = {};
    await Promise.all(
      names.map(
        (n) =>
          new Promise<void>((res) => {
            const c = tx.objectStore(n).count();
            c.onsuccess = () => ((counts[n] = c.result), res());
          }),
      ),
    );
    db.close();
    return counts;
  });
}

/** Puts one synthetic record into each schema-2 store, the way later features will. */
async function seedV2Stores(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((res, rej) => {
      const r = indexedDB.open('personal-oracle');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    const tx = db.transaction(['kv', 'journal', 'events', 'favorites', 'seen'], 'readwrite');
    const at = '2026-11-26T20:00:00.000Z';
    tx.objectStore('kv').put({ birthDate: '1990-01-01', savedAt: at }, 'personal');
    tx.objectStore('journal').put({ id: 'j1', kind: 'free', dateKey: '2026-11-26', text: 'Synthetisch', refs: {}, createdAt: at, updatedAt: at });
    tx.objectStore('events').put({ id: 'e1', type: 'card.studied', dateKey: '2026-11-26', at, refs: {} });
    tx.objectStore('favorites').put({ key: 'card:major-00-fool', kind: 'card', id: 'major-00-fool', createdAt: at });
    tx.objectStore('seen').put({ key: 'milestone:7', seenAt: at });
    await new Promise<void>((res, rej) => ((tx.oncomplete = () => res()), (tx.onerror = () => rej(tx.error))));
    db.close();
  });
}

test('complete flow: onboarding → daily card → reading → grimoire → profile, persisted', async ({ page }, info) => {
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

  // Grimoire as a book (V05.3): the cards chapter and the journal reflect both.
  const book = (t === de ? screensDe : screensEn).book;
  await page.getByRole('link', { name: t.nav.grimoire }).click();
  await page.getByRole('button', { name: new RegExp(`^I ${book.chapters.cards}`) }).click();
  await expect(page.locator('.collection .ocard').first()).toBeVisible();
  await page.getByRole('button', { name: t.common.back }).click();
  await page.getByRole('button', { name: new RegExp(`^III ${book.chapters.journal}`) }).click();
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
  await expect(page.getByText(fmt(t.onboarding.progress, { n: 2, total: 8 }), { exact: true })).toBeVisible();
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

test('language switch and deleting all local data from every store', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-de-412', 'covered once');
  await completeOnboarding(page, de);
  await page.getByRole('link', { name: de.nav.profile }).click();
  // Language, motion, privacy and deletion live on their own page since V04 (#/me/settings).
  await page.getByRole('button', { name: de.profile.settings }).click();
  await expect(page).toHaveURL(/#\/me\/settings$/);
  await page.getByRole('radio', { name: 'English' }).click();
  await expect(page.getByRole('heading', { level: 1, name: en.profile.settings })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await seedV2Stores(page);
  const before = await storeCounts(page);
  for (const n of ['kv', 'journal', 'events', 'favorites', 'seen']) expect(before[n], n).toBeGreaterThan(0);
  await page.getByRole('button', { name: en.profile.delete }).click();
  await page.getByRole('button', { name: en.profile.deleteConfirm }).click();
  await expect(page.getByRole('button', { name: de.welcome.start })).toBeVisible();
  // Deleting removes the data of every store (schema 2: seven stores).
  const after = await storeCounts(page);
  expect(Object.keys(after).sort()).toEqual(['daily', 'events', 'favorites', 'journal', 'kv', 'readings', 'seen']);
  expect(Object.values(after).every((n) => n === 0)).toBe(true);
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

test('all six themes give a complete three-card reading (DE/EN)', async ({ page }, info) => {
  test.skip(!['mobile-de-412', 'mobile-en-360'].includes(info.project.name), 'one viewport per language');
  const t = ui(info);
  const locale = String(info.project.use.locale).startsWith('de') ? 'de' : 'en';
  const problems = guard(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.getByRole('button', { name: t.welcome.skipAll }).click();
  await page.getByRole('link', { name: t.nav.oracle }).click();
  expect(CONTENT.themes).toHaveLength(6);
  for (const [i, theme] of CONTENT.themes.entries()) {
    const label = theme.label[locale];
    await page.getByRole('radiogroup', { name: t.oracle.chooseTheme }).getByRole('radio', { name: label, exact: true }).click();
    await page.getByRole('button', { name: t.oracle.draw }).click();
    await expect(page.getByRole('heading', { level: 1, name: label })).toBeVisible();
    await page.getByRole('button', { name: t.oracle.revealAll }).click();
    await expect(page.getByText(t.oracle.synthesis, { exact: true })).toBeVisible();
    await expect(page.getByText(theme.readingIntro[locale], { exact: true })).toBeVisible();
    if (i < CONTENT.themes.length - 1) {
      await page.getByRole('button', { name: t.oracle.discard }).last().click();
      await page.getByRole('button', { name: t.oracle.discardConfirm, exact: true }).click();
      await expect(page.getByRole('button', { name: t.oracle.draw })).toBeVisible();
    } else {
      await page.getByRole('button', { name: t.oracle.save }).click();
      await expect(page.getByRole('button', { name: t.oracle.newReading })).toBeVisible();
    }
  }
  await page.goto('./#/grimoire/history');
  await expect(page.locator('.history__row')).toHaveCount(1);
  await expect(page.locator('.history__title')).toHaveText(CONTENT.themes.at(-1)!.label[locale]);
  expect(problems).toEqual([]);
});

test.describe('local midnight', () => {
  test.use({ timezoneId: 'Europe/Berlin' });

  test('a new local day brings a new hidden card while yesterday stays in the history', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile-de-412', 'covered once');
    const problems = guard(page);
    await page.clock.install({ time: new Date('2026-11-26T23:58:30+01:00') });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    await page.getByRole('button', { name: de.welcome.skipAll }).click();
    await page.getByRole('button', { name: de.today.draw }).click();
    await expect(page.getByText(de.today.message, { exact: true })).toBeVisible();
    // The app stays open across midnight: its timer switches to the new day without a reload.
    await page.clock.fastForward('03:00');
    await expect(page.getByRole('button', { name: de.today.draw })).toBeVisible();
    await page.getByRole('button', { name: de.today.draw }).click();
    await expect(page.getByText(de.today.message, { exact: true })).toBeVisible();
    await page.goto('./#/grimoire/history');
    await expect(page.locator('.history__row')).toHaveCount(2);
    // Reopening on the same day reuses the stored card instead of drawing again.
    const title = await page.locator('.history__title').first().textContent();
    await page.goto('./#/today');
    await page.reload();
    await expect(page.locator('#today-card-title')).toHaveText(title!);
    expect(problems).toEqual([]);
  });
});

test('the archetype can be viewed, corrected by hand or left open from the profile', async ({ page }, info) => {
  test.skip(!['mobile-de-412', 'mobile-en-360'].includes(info.project.name), 'one viewport per language');
  const t = ui(info);
  const locale = String(info.project.use.locale).startsWith('de') ? 'de' : 'en';
  const problems = guard(page);
  await completeOnboarding(page, t);
  await page.getByRole('link', { name: t.nav.profile }).click();

  // View the full archetype and come back to the profile.
  await page.getByRole('button', { name: t.profile.view }).click();
  await expect(page.getByText(t.archetype.strength, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: t.archetype.toProfile }).click();
  await expect(page.getByRole('heading', { level: 1, name: t.profile.title })).toBeVisible();

  // Correct it by hand: every one of the eight archetypes is selectable.
  await page.getByRole('button', { name: t.profile.choose }).click();
  const options = page.locator('#prof-choose [role="radio"]');
  await expect(options).toHaveCount(9);
  const target = CONTENT.archetypes[5]!;
  await options.filter({ has: page.getByText(target.name[locale], { exact: true }) }).click();
  await expect(page.getByText(t.profile.archetypeSaved)).toBeVisible();
  await expect(page.locator('.profile__archetype .h3')).toHaveText(target.name[locale]);
  await expect(page.getByText(t.profile.manual, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: t.profile.view }).click();
  await expect(page.getByText(t.archetype.basisManual)).toBeVisible();
  await page.getByRole('button', { name: t.archetype.toProfile }).click();

  // Leave it open: neutral profile, no invented type; survives a reload.
  await page.getByRole('button', { name: t.profile.choose }).click();
  await options.filter({ has: page.getByText(t.profile.neutralOption, { exact: true }) }).click();
  await expect(page.locator('.profile__archetype .h3')).toHaveText(t.archetype.neutralTitle);
  await page.reload();
  await expect(page.locator('.profile__archetype .h3')).toHaveText(t.archetype.neutralTitle);
  await page.getByRole('link', { name: t.nav.today }).click();
  await page.getByRole('button', { name: t.today.draw }).click();
  await expect(page.getByText(t.today.message, { exact: true })).toBeVisible();
  await expect(page.getByText(t.today.lens, { exact: true })).toHaveCount(0);
  expect(problems).toEqual([]);
});

test('questionnaire v2: seven questions fit into 75 s at 8 s reading time per question (V04.1)', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-de-412', 'timing once');
  const t = ui(info);
  const problems = guard(page);
  await page.goto('./');
  await expect(page.getByRole('button', { name: t.welcome.start })).toBeVisible();
  // Measured: the app's own time from "Beginnen" to the archetype (transitions, saving, reveal).
  // Modelled: 8 s reading and choosing per question (MASTER_ROADMAP V04.1).
  const t0 = Date.now();
  await page.getByRole('button', { name: t.welcome.start }).click();
  for (let i = 0; i < 7; i++) {
    await expect(page.getByText(fmt(t.onboarding.progress, { n: i + 1, total: 8 }), { exact: true })).toBeVisible();
    await page.getByRole('radio').nth((i + 2) % 4).click();
  }
  await expect(page.getByRole('heading', { name: t.onboarding.themeTitle })).toBeVisible();
  await page.getByRole('radio').nth(2).click();
  await page.getByRole('button', { name: t.onboarding.finish }).click();
  await expect(page.getByText(t.archetype.eyebrow, { exact: true })).toBeVisible();
  const appMs = Date.now() - t0;
  const totalMs = appMs + 7 * 8000;
  info.annotations.push({ type: 'questionnaire-time', description: `app ${appMs} ms + 7 × 8 s = ${totalMs} ms (limit 75,000 ms)` });
  console.log(`questionnaire v2: app ${appMs} ms + 7 × 8 s = ${totalMs} ms (limit 75,000 ms)`);
  expect(totalMs).toBeLessThanOrEqual(75_000);
  expect(problems).toEqual([]);
});

test('existing profile: the new questions are an offer; the profile stays until the end (E9)', async ({ page }, info) => {
  test.skip(!['mobile-de-412', 'mobile-en-360'].includes(info.project.name), 'one viewport per language');
  const t = ui(info);
  const locale = String(info.project.use.locale).startsWith('de') ? 'de' : 'en';
  const problems = guard(page);
  await page.goto('./');
  await expect(page.getByRole('button', { name: t.welcome.start })).toBeVisible();
  // A profile as 0.1–0.3 wrote it: four answers, no questionnaire version.
  await page.evaluate(async (loc) => {
    const db = await new Promise<IDBDatabase>((res, rej) => {
      const r = indexedDB.open('personal-oracle');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    const tx = db.transaction('kv', 'readwrite');
    const answers = { 'q-calling': 'a-question', 'q-decision': 'a-image', 'q-place': 'a-road', 'q-invite': 'a-direction' };
    tx.objectStore('kv').put({ answers, themeId: 'self', archetypeId: 'seeker', archetypeSource: 'questions', profileVersion: 1, updatedAt: '2026-11-20T10:00:00.000Z' }, 'profile');
    tx.objectStore('kv').put({ locale: loc, motion: 'system', onboardingDone: true }, 'settings');
    await new Promise<void>((res, rej) => ((tx.oncomplete = () => res()), (tx.onerror = () => rej(tx.error))));
    db.close();
  }, locale);
  // Restart with the seeded state first; then the old path #/profile (alias of #/me) opens "Ich".
  await page.reload();
  await expect(page.getByRole('link', { name: t.nav.profile })).toBeVisible();
  await page.goto('./#/profile');
  const seeker = CONTENT.archetypes.find((a) => a.id === 'seeker')!.name[locale];
  await expect(page.locator('.profile__archetype .h3')).toHaveText(seeker);
  await expect(page.getByText(t.profile.offerTitle, { exact: true })).toBeVisible();

  // Opening the offer and going back changes nothing.
  await page.getByRole('button', { name: t.profile.offerStart }).click();
  await expect(page.getByText(fmt(t.onboarding.progress, { n: 5, total: 8 }), { exact: true })).toBeVisible();
  await page.getByRole('button', { name: t.common.back }).click();
  await expect(page.locator('.profile__archetype .h3')).toHaveText(seeker);
  await expect(page.getByText(t.profile.offerTitle, { exact: true })).toBeVisible();

  // Answering the three new questions completes questionnaire v2 with all seven answers.
  await page.getByRole('button', { name: t.profile.offerStart }).click();
  for (let n = 5; n <= 7; n++) {
    await expect(page.getByText(fmt(t.onboarding.progress, { n, total: 8 }), { exact: true })).toBeVisible();
    await page.getByRole('radio').nth(3).click();
  }
  await expect(page.getByRole('heading', { name: t.onboarding.themeTitle })).toBeVisible();
  await page.getByRole('button', { name: t.onboarding.finish }).click();
  await expect(page.getByText(t.archetype.eyebrow, { exact: true })).toBeVisible();
  const stored = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((res, rej) => {
      const r = indexedDB.open('personal-oracle');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    const get = db.transaction('kv').objectStore('kv').get('profile');
    const p = await new Promise<{ answers: Record<string, string>; questionnaireVersion?: number }>((res) => (get.onsuccess = () => res(get.result)));
    db.close();
    return { answers: Object.keys(p.answers).length, version: p.questionnaireVersion };
  });
  expect(stored).toEqual({ answers: 7, version: 2 });
  await page.getByRole('button', { name: t.archetype.toToday }).click();
  await page.getByRole('link', { name: t.nav.profile }).click();
  await expect(page.getByRole('heading', { level: 1, name: t.profile.title })).toBeVisible();
  await expect(page.getByText(t.profile.offerTitle, { exact: true })).toHaveCount(0);
  expect(problems).toEqual([]);
});
