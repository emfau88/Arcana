/** Shared steps of the end-to-end tests. */
import { expect, type Page, type TestInfo } from '@playwright/test';
import { CONTENT } from '../../src/content/index.ts';
import { localDateKey } from '../../src/domain/clock.ts';
import { composeDaily } from '../../src/domain/oracle.ts';
import type { DailyRecord, Profile } from '../../src/domain/types.ts';
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

/** The stored profile, read straight from IndexedDB. */
export async function readProfile(page: Page): Promise<Profile> {
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
export function pastDays(profile: Profile, n: number, notes: Record<number, string>): DailyRecord[] {
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

/** Writes daily records straight into IndexedDB; reload the page afterwards. */
export async function putDaily(page: Page, records: DailyRecord[]) {
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
