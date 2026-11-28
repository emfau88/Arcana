import { expect, test } from '@playwright/test';
import { CONTENT } from '../../src/content/index.ts';
import { fmt } from '../../src/i18n/index.ts';
import { completeOnboarding, guard, pastDays, putDaily, readProfile, screens, ui } from './helpers.ts';

/*
 * V05.3: the Grimoire as a book (cover, contents, chapters cards, journal and rituals). Every
 * saved entry is reachable in at most three taps from "Heute" (MASTER_ROADMAP_V2 V05.3), the
 * journal deletes single entries (V05.4) and rituals are marked once per day.
 */

const ONE_VIEWPORT_PER_LANGUAGE = ['mobile-de-412', 'mobile-en-360'];

test('V05.3: every saved entry is reachable in at most three taps', async ({ page }, info) => {
  test.skip(!ONE_VIEWPORT_PER_LANGUAGE.includes(info.project.name), 'one viewport per language');
  const t = ui(info);
  const s = screens(info).book;
  const problems = guard(page);
  await completeOnboarding(page, t);
  const profile = await readProfile(page);
  const note = 'Licht am Fenster, ein ruhiger Anfang.';
  const days = pastDays(profile, 3, { 1: note });
  await putDaily(page, days);
  await page.goto('./#/today');
  await page.reload();

  // A daily card with its note: Grimoire → journal → the day.
  await page.getByRole('link', { name: t.nav.grimoire }).click();
  await page.getByRole('button', { name: new RegExp(`^III ${s.chapters.journal}`) }).click();
  await expect(page.getByText(note)).toBeVisible();
  await page.locator('.journal__item', { hasText: note }).locator('.history__row').click();
  await expect(page.locator('#note-field')).toHaveValue(note);

  // A card: Grimoire → cards → the card page.
  await page.getByRole('link', { name: t.nav.today }).click();
  await page.getByRole('link', { name: t.nav.grimoire }).click();
  await page.getByRole('button', { name: new RegExp(`^I ${s.chapters.cards}`) }).click();
  await expect(page.getByText(fmt(s.cardsCount, { n: 3, total: CONTENT.cards.length }), { exact: true })).toBeVisible();
  // Design plan point 7: only what is discovered is shown, the rest is one quiet line.
  await expect(page.locator('.collection__item')).toHaveCount(3);
  await expect(page.getByText(fmt(s.waiting, { n: CONTENT.cards.length - 3 }), { exact: true })).toBeVisible();
  const card = CONTENT.cards.find((c) => c.id === days[0]!.cardId)!;
  const locale = info.project.name.includes('-en-') ? 'en' : 'de';
  await page.getByRole('button', { name: new RegExp(card.title[locale]) }).click();
  await expect(page.getByRole('heading', { level: 1, name: card.title[locale] })).toBeVisible();

  // A ritual met on a daily card: Grimoire → rituals.
  await page.getByRole('link', { name: t.nav.today }).click();
  await page.getByRole('link', { name: t.nav.grimoire }).click();
  await page.getByRole('button', { name: new RegExp(`^IV ${s.chapters.rituals}`) }).click();
  await expect(page.locator('.ritual')).toHaveCount(3);
  await expect(page.getByText(days[2]!.content.ritual!, { exact: true })).toBeVisible();
  expect(problems).toEqual([]);
});

test('V05.4: the journal writes, finds, filters and deletes single entries', async ({ page }, info) => {
  test.skip(!ONE_VIEWPORT_PER_LANGUAGE.includes(info.project.name), 'one viewport per language');
  const t = ui(info);
  const s = screens(info).book;
  const problems = guard(page);
  await completeOnboarding(page, t);
  const profile = await readProfile(page);
  const note = 'Ein stiller Morgen am Fenster.';
  await putDaily(page, pastDays(profile, 3, { 0: note }));
  await page.goto('./#/grimoire/journal');
  await page.reload();
  await expect(page.locator('.journal__item')).toHaveCount(3);

  const own = 'Heute habe ich den Garten gegossen und an nichts gedacht.';
  await page.getByLabel(s.write).fill(own);
  await page.getByRole('button', { name: s.save }).click();
  await expect(page.locator('.toast')).toHaveText(s.saved);
  await expect(page.locator('.journal__item')).toHaveCount(4);

  // Search folds case and accents; filters show only what exists.
  await page.getByRole('searchbox', { name: s.search }).fill('GARTEN gegossen');
  await expect(page.getByText(s.resultsOne, { exact: true })).toBeVisible();
  await expect(page.locator('.journal__item')).toHaveCount(1);
  await page.getByRole('searchbox', { name: s.search }).fill('');
  await page.getByRole('button', { name: s.written }).click();
  await expect(page.locator('.journal__item')).toHaveCount(2);
  await expect(page.getByRole('button', { name: s.filters.number })).toHaveCount(0);
  await page.getByRole('button', { name: s.written }).click();

  // Deleting an own entry removes it; deleting a note keeps the day.
  await page.locator('.journal__item', { hasText: own }).getByRole('button', { name: s.delete }).click();
  await expect(page.getByRole('heading', { name: s.deleteTitle })).toBeVisible();
  await page.getByRole('button', { name: s.deleteConfirm, exact: true }).click();
  await expect(page.getByText(own)).toHaveCount(0);
  await expect(page.locator('.journal__item')).toHaveCount(3);
  await page.locator('.journal__item', { hasText: note }).getByRole('button', { name: s.delete }).click();
  await page.getByRole('button', { name: s.deleteCancel }).click();
  await expect(page.getByText(note)).toBeVisible();
  await page.locator('.journal__item', { hasText: note }).getByRole('button', { name: s.delete }).click();
  await page.getByRole('button', { name: s.deleteConfirm, exact: true }).click();
  await expect(page.getByText(note)).toHaveCount(0);
  await expect(page.locator('.journal__item')).toHaveCount(3);

  await page.reload();
  await expect(page.locator('.journal__item')).toHaveCount(3);
  await expect(page.getByText(own)).toHaveCount(0);
  expect(problems).toEqual([]);
});

test('V05.3: rituals start with three simple ones and are marked once per day', async ({ page }, info) => {
  test.skip(!ONE_VIEWPORT_PER_LANGUAGE.includes(info.project.name), 'one viewport per language');
  const t = ui(info);
  const s = screens(info).book;
  const problems = guard(page);
  await completeOnboarding(page, t);
  await page.goto('./#/grimoire/rituals');
  await expect(page.getByText(s.ritualsEmpty)).toBeVisible();
  await expect(page.locator('.ritual-list__starter')).toHaveCount(3);

  const profile = await readProfile(page);
  await putDaily(page, pastDays(profile, 2, {}));
  await page.reload();
  await expect(page.locator('.ritual')).toHaveCount(2);
  const first = page.locator('.ritual').first();
  await first.getByRole('button', { name: s.markDone }).click();
  await expect(page.locator('.toast')).toHaveText(s.doneToast);
  await expect(first.getByRole('button', { name: s.doneToday })).toBeDisabled();
  await page.reload();
  await expect(page.locator('.ritual').first().getByRole('button', { name: s.doneToday })).toBeDisabled();
  await expect(page.locator('.ritual').first()).toContainText(s.ritualDoneOne);
  expect(problems).toEqual([]);
});

test('V05.3: a new card level glows in the book until its page is opened', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-de-412', 'covered once');
  const t = ui(info);
  const s = screens(info).book;
  const problems = guard(page);
  await completeOnboarding(page, t);
  // The first opening marks the start: nothing glows from before.
  await page.getByRole('link', { name: t.nav.grimoire }).click();
  const cards = page.getByRole('button', { name: new RegExp(`^I ${s.chapters.cards}`) });
  await expect(cards).not.toContainText(t.common.new);

  await page.getByRole('link', { name: t.nav.today }).click();
  await page.getByRole('button', { name: t.today.draw }).click();
  await expect(page.getByText(t.today.message, { exact: true })).toBeVisible();
  await page.getByRole('link', { name: t.nav.grimoire }).click();
  await expect(cards).toContainText(t.common.new);
  await cards.click();
  await expect(page.locator('.collection__item--new')).toHaveCount(1);
  await page.locator('.collection__item--new .collection__link').click();
  await expect(page.locator('.card-level')).toBeVisible();
  await page.getByRole('button', { name: t.common.back }).click();
  await expect(page.locator('.collection__item--new')).toHaveCount(0);
  await page.getByRole('button', { name: t.common.back }).click();
  await expect(cards).not.toContainText(t.common.new);
  expect(problems).toEqual([]);
});
