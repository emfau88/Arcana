// QA: checks that every card title fits its plaque (no ellipsis) in DE and EN. Usage: node scripts/check-card-titles.mjs <outDir>
import { chromium } from '@playwright/test';
const out = process.argv[2];
const browser = await chromium.launch();
for (const [locale, , draw, revealAll, save] of [['de-DE','Beginnen','Drei Karten ziehen','Alle aufdecken','Im Grimoire speichern'],['en-US','Begin','Draw three cards','Reveal all','Save to grimoire']]) {
  const page = await (await browser.newContext({ viewport: { width: 360, height: 780 }, locale, deviceScaleFactor: 2 })).newPage();
  await page.goto('http://127.0.0.1:5180/');
  await page.getByRole('button', { name: locale === 'de-DE' ? 'Fragen überspringen' : 'Skip the questions' }).click();
  await page.goto('http://127.0.0.1:5180/#/oracle');
  await page.getByRole('button', { name: draw }).click();
  await page.getByRole('button', { name: revealAll }).click();
  await page.getByRole('button', { name: save }).click();
  for (const id of ['major-02-high-priestess', 'major-16-tower', 'major-19-sun']) {
    await page.goto(`http://127.0.0.1:5180/#/grimoire/card/${id}`);
    await page.waitForSelector('.ocard__title');
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => { const e = document.querySelector('.ocard__title'); return { text: e.textContent, fit: e.dataset.fit ?? '-', overflow: e.scrollWidth > e.clientWidth + 1, w: e.clientWidth }; });
    console.log(locale, id, JSON.stringify(r));
    if (id === 'major-02-high-priestess') await page.locator('.ocard').first().screenshot({ path: `${out}/hp-${locale}.png` });
  }
}
await browser.close();
