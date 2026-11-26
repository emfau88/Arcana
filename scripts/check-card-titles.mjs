// QA: every card title and numeral fits its frame (no ellipsis, no overflow) in DE and EN.
// Inscription sizes are relative to the card width (cqw), so one card size covers all screens.
// Usage (dev server running on 5180, or set PORT): node scripts/check-card-titles.mjs [screenshot.png]
import { chromium } from '@playwright/test';

const shot = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: shot ? 2 : 1 });
await page.goto(`http://127.0.0.1:${process.env.PORT ?? 5180}/`);
await page.waitForLoadState('networkidle');

const results = await page.evaluate(async () => {
  const { CONTENT } = await import('/src/content/index.ts');
  const { titleFit, cardSrc } = await import('/src/ui/OracleCard.tsx');
  const { toRoman } = await import('/src/i18n/index.ts');
  document.body.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.id = 'sheet';
  wrap.style.cssText = 'display:grid;grid-template-columns:repeat(8,150px);gap:10px;padding:10px;background:#0b0a14';
  document.body.append(wrap);
  const out = [];
  for (const locale of ['de', 'en']) {
    for (const card of CONTENT.cards) {
      const title = card.title[locale];
      const num = toRoman(card.order);
      const el = document.createElement('span');
      el.className = 'ocard ocard--spread is-up';
      el.style.width = '150px';
      el.innerHTML = `<span class="ocard__inner"><span class="ocard__face ocard__front"><img src="${cardSrc(card.assetId)}" alt=""><span class="ocard__num" data-len="${Math.min(num.length, 5)}">${num}</span><span class="ocard__title"${titleFit(title) ? ` data-fit="${titleFit(title)}"` : ''}>${title}</span></span></span>`;
      el.querySelector('.ocard__inner').style.transition = 'none';
      wrap.append(el);
      out.push({ locale, id: card.id, title, num, el });
    }
  }
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  return out.map(({ locale, id, title, num, el }) => {
    const t = el.querySelector('.ocard__title');
    const n = el.querySelector('.ocard__num');
    const cardW = el.clientWidth;
    return {
      locale,
      id,
      title,
      fit: t.dataset.fit ?? '-',
      titleOverflow: t.scrollWidth > t.clientWidth + 1,
      // The medallion's inner ring is ~0.0925 of the card width in diameter (r 18.5 of 400).
      numOverflow: n.getBoundingClientRect().width > cardW * 0.0925 + 1,
      num,
    };
  });
});

let bad = 0;
for (const r of results) {
  const ok = !r.titleOverflow && !r.numOverflow;
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${r.locale} ${r.num.padEnd(5)} ${r.title.padEnd(22)} fit=${r.fit}${r.titleOverflow ? ' title-overflow' : ''}${r.numOverflow ? ' numeral-overflow' : ''}`);
}
if (shot) await page.locator('#sheet').screenshot({ path: shot });
await browser.close();
console.log(`${results.length - bad}/${results.length} inscriptions fit`);
process.exitCode = bad ? 1 : 0;
