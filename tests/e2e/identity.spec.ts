import { expect, test } from '@playwright/test';
import { CONTENT } from '../../src/content/index.ts';
import { de } from '../../src/i18n/de.ts';
import { fmt } from '../../src/i18n/index.ts';
import { screensDe } from '../../src/i18n/screens.de.ts';
import { completeOnboarding, guard, pastDays, putDaily, readProfile, screens, ui } from './helpers.ts';

/*
 * V04 screens (proposal for the owner's review, D-57): "Ich" with "Why?", the eight archetypes,
 * the share card drawn on the device, the star map with the first weekly review, and the reveal
 * with reduced motion.
 */

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
  // The PNG is encoded in a worker, not by toBlob on the main thread (B-14).
  const workers: string[] = [];
  page.on('worker', (w) => workers.push(w.url()));
  await page.getByRole('button', { name: s.me.share }).click();
  const preview = page.locator('.share-page__preview img');
  await expect(preview).toBeVisible({ timeout: 5000 });
  expect(await preview.getAttribute('src')).toMatch(/^data:image\/png;base64,/);
  const ms = Number(await page.locator('.share-page__preview').getAttribute('data-export-ms'));
  expect(ms, 'export time in ms').toBeLessThanOrEqual(1500);
  expect(workers.some((u) => u.includes('encode.worker')), 'PNG encoded in a worker').toBe(true);
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
  const entry = page.getByRole('button', { name: new RegExp(`^V ${screensDe.book.chapters.journey}`) });
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

test('V05.5: card backs open on journey days 2, 5 and 10 and change every face-down card', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-de-412', 'covered once');
  const problems = guard(page);
  await completeOnboarding(page, de);
  await page.getByRole('link', { name: de.nav.profile }).click();
  await page.getByRole('button', { name: de.profile.settings }).click();
  // Before journey day 2 there is nothing to choose, and nothing locked is shown.
  await expect(page.getByRole('heading', { level: 1, name: de.profile.settings })).toBeVisible();
  await expect(page.getByRole('heading', { name: de.profile.cardBack })).toHaveCount(0);

  const profile = await readProfile(page);
  await putDaily(page, pastDays(profile, 9, {}));
  await page.reload();
  const backs = page.getByRole('radiogroup', { name: de.profile.cardBack }).getByRole('radio');
  await expect(backs).toHaveCount(3);
  await expect(page.getByText(de.profile.cardBackMore)).toBeVisible();
  await page.getByRole('radio', { name: de.profile.backs.compass }).click();
  await expect(page.getByRole('radio', { name: de.profile.backs.compass })).toHaveAttribute('aria-checked', 'true');

  // Today: the face-down card shows the chosen back.
  await page.getByRole('link', { name: de.nav.today }).click();
  await expect(page.locator('.ocard__back img').first()).toHaveAttribute('src', /cards\/backs\/cardback-compass\.webp$/);

  // Revealing today makes journey day 10: the moment names the new back and leads to the settings.
  await page.getByRole('button', { name: de.today.draw }).click();
  await expect(page.getByText(de.milestone.openedBacks, { exact: true })).toBeVisible();
  await expect(page.getByText(fmt(de.milestone.cardBack, { name: de.profile.backs['golden-wheel'] }), { exact: true })).toBeVisible();
  // The day text also names the personal symbol (V06), so it waits until that is built (D-54).
  await expect(page.locator('.milestone-moment__text')).toHaveCount(0);
  await page.getByRole('button', { name: de.milestone.view }).click();
  await expect(backs).toHaveCount(4);
  await expect(page.getByText(de.profile.cardBackMore)).toHaveCount(0);
  await page.getByRole('radio', { name: de.profile.backs['golden-wheel'] }).click();
  await expect(page.getByRole('radio', { name: de.profile.backs['golden-wheel'] })).toHaveAttribute('aria-checked', 'true');

  // The choice survives a reload, and the face-down cards of a reading show it too.
  await page.reload();
  await expect(page.getByRole('radio', { name: de.profile.backs['golden-wheel'] })).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('link', { name: de.nav.oracle }).click();
  await page.getByRole('button', { name: de.oracle.draw }).click();
  await expect(page.locator('.spread button.ocard .ocard__back img').first()).toHaveAttribute('src', /cards\/backs\/thumbs\/cardback-golden-wheel\.webp$/);
  expect(problems).toEqual([]);
});

test('V05.1: the card page shows the level as a moon phase and every layer that level opened', async ({ page }, info) => {
  test.skip(!['mobile-de-412', 'mobile-en-360'].includes(info.project.name), 'one viewport per language');
  const t = ui(info);
  const s = screens(info).card;
  const problems = guard(page);
  await completeOnboarding(page, t);
  const profile = await readProfile(page);
  // Card A on four days with a note (level 4), card B on two days (level 2). Facts only, no counter.
  const a = CONTENT.cards[3]!.id;
  const b = CONTENT.cards[5]!.id;
  const seeded = pastDays(profile, 6, { 0: 'Mein Satz zu dieser Karte.' }).map((d, k) => ({ ...d, cardId: k < 4 ? a : b }));
  await putDaily(page, seeded);

  await page.goto(`/#/grimoire/card/${b}`);
  await page.reload();
  await expect(page.getByText(fmt(s.level, { n: 2, name: s.levelNames[2]! }), { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: s.light, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: s.keyword, exact: true })).toBeVisible();
  // Not opened yet: simply not there, nothing locked is shown.
  await expect(page.getByRole('heading', { name: s.themes, exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: s.question, exact: true })).toHaveCount(0);

  await page.goto(`/#/grimoire/card/${a}`);
  await page.reload();
  await expect(page.getByText(fmt(s.level, { n: 4, name: s.levelNames[4]! }), { exact: true })).toBeVisible();
  await expect(page.getByText(s.deeper)).toHaveCount(0);
  for (const h of [s.light, s.shadow, s.keyword, s.otherThemes, s.roles, s.symbols, s.notes, s.ritual, s.question]) {
    await expect(page.getByRole('heading', { name: h, exact: true })).toBeVisible();
  }
  await expect(page.getByText('Mein Satz zu dieser Karte.')).toBeVisible();
  expect(problems).toEqual([]);
});

test('V05.1: the card study opens levels 2 and 3, and an answer makes level 4', async ({ page }, info) => {
  test.skip(!['mobile-de-412', 'mobile-en-360'].includes(info.project.name), 'one viewport per language');
  const t = ui(info);
  const s = screens(info).card;
  const problems = guard(page);
  await completeOnboarding(page, t);
  const profile = await readProfile(page);
  // One encounter only: level 1. Everything after comes from the study, without chance.
  const c = CONTENT.cards[7]!.id;
  await putDaily(page, pastDays(profile, 1, {}).map((d) => ({ ...d, cardId: c })));
  await page.goto(`/#/grimoire/card/${c}`);
  await page.reload();
  await expect(page.getByText(fmt(s.level, { n: 1, name: s.levelNames[1]! }), { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: s.light, exact: true })).toHaveCount(0);

  // Part 1: a tap on "Read" is enough.
  await page.getByRole('button', { name: s.studyStart }).click();
  await expect(page.getByRole('heading', { name: fmt(s.studyPart, { n: 1, name: s.studyParts[0]! }) })).toBeFocused();
  await page.getByRole('button', { name: s.studyRead, exact: true }).click();
  await expect(page.getByText(fmt(s.studyLevel, { n: 2, name: s.levelNames[2]! }))).toBeVisible();
  await expect(page.getByRole('heading', { name: s.study, exact: true })).toBeFocused();
  await expect(page.getByRole('heading', { name: s.light, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: s.otherThemes, exact: true })).toHaveCount(0);

  // Part 2 with an answer: level 3 from the study, level 4 from the answer as a reflection.
  await page.getByRole('button', { name: s.studyContinue }).click();
  const answer = info.project.name.includes('-en-') ? 'I would keep the reins loose today.' : 'Ich würde heute die Zügel locker lassen.';
  await page.getByLabel(s.studyAnswer).fill(answer);
  await page.getByRole('button', { name: s.studyKeep }).click();
  await expect(page.getByText(fmt(s.studyLevel, { n: 4, name: s.levelNames[4]! }))).toBeVisible();
  await expect(page.getByRole('heading', { name: s.symbols, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: s.notes, exact: true })).toBeVisible();
  await expect(page.getByText(answer)).toBeVisible();

  // Stored facts: after a reload the level stays, and the study can be repeated at will.
  await page.reload();
  await expect(page.getByText(fmt(s.level, { n: 4, name: s.levelNames[4]! }), { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: s.studyRepeat })).toBeVisible();
  expect(problems).toEqual([]);
});
