// Contrast audit for every visible reading text of a screen (MASTER_ROADMAP_V2 §6 "Mindestkontrast", R2).
// Used by `scripts/evidence.mjs --contrast`. For each scroll position of the app's own scroll
// container: every text node in view that is not covered by something else is located, then all
// text is made transparent and the brightest 5 % of the pixels under each text (p95) are compared
// with its colour. Two screenshots: with the design's text halos (text-shadow is painted under the
// transparent glyphs; this is the gate, D-49) and without any shadow (`p95Raw`, reported).
// Thresholds: 4.5:1; large text (>= 24 px, or >= 18.7 px bold) 3:1. The median is reported too.

function collect() {
  const out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  const parse = (c) => {
    const m = c.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0];
    return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 };
  };
  // The veil of a sticky main action (D-63, screens.css) is at least 90 % opaque from 2.1rem below
  // its top edge. It lets taps through (pointer-events: none), so elementFromPoint does not see it:
  // text that has scrolled beneath that part is covered by design and is measured at another scroll
  // step, like any other covered text (S-58).
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const veils = [...document.querySelectorAll('.sticky-action')].map((s) => {
    const r = s.getBoundingClientRect();
    return { el: s, top: r.top + 2.1 * rem, bottom: r.bottom };
  });
  const underVeil = (el, r) => veils.some((v) => !v.el.contains(el) && r.b > v.top && r.y < v.bottom);
  let node;
  while ((node = walker.nextNode())) {
    if (!node.textContent.trim()) continue;
    const el = node.parentElement;
    if (!el || seen.has(el)) continue;
    // Decorative or hidden text, disabled controls (exempt in WCAG) and SVG text are skipped.
    if (el.closest('[aria-hidden="true"], [hidden], svg, .world__caption, :disabled, [aria-disabled="true"]')) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility !== 'visible') continue;
    let opacity = 1;
    for (let e = el; e; e = e.parentElement) opacity *= Number(getComputedStyle(e).opacity);
    if (opacity < 0.05) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = [...range.getClientRects()]
      .map((r) => ({ x: Math.max(0, r.left), y: Math.max(0, r.top), r: Math.min(innerWidth, r.right), b: Math.min(innerHeight, r.bottom) }))
      .filter((r) => r.r - r.x > 2 && r.b - r.y > 2);
    if (!rects.length) continue;
    // Covered, even partly (e.g. scrolled under the tab bar): the topmost element at the centre and
    // at all four corners must be its own. Partly covered text is measured at another scroll step.
    const own = (x, y) => {
      const hit = document.elementFromPoint(x, y);
      return hit && (hit === el || el.contains(hit));
    };
    const visible = rects.filter((r) => !underVeil(el, r) && own((r.x + r.r) / 2, (r.y + r.b) / 2) && own(r.x + 1, r.y + 1) && own(r.r - 1, r.y + 1) && own(r.x + 1, r.b - 1) && own(r.r - 1, r.b - 1));
    if (!visible.length) continue;
    seen.add(el);
    // Gradient text (background-clip: text) cannot be measured this way; it is listed, not judged.
    const gradient = (cs.backgroundClip === 'text' || cs.webkitBackgroundClip === 'text') && cs.backgroundImage !== 'none';
    const size = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.') : '';
    out.push({
      key: `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`,
      text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 48),
      color: parse(cs.color),
      opacity,
      large: size >= 24 || (size >= 18.66 && weight >= 700),
      size: Math.round(size * 10) / 10,
      gradient,
      rects: visible,
    });
  }
  return out;
}

async function measure(decoder, png, items, dpr) {
  return decoder.evaluate(
    async ({ b64, items, dpr }) => {
      const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      return items.map((it) => {
        const px = [];
        for (const r of it.rects) {
          const x = Math.round(r.x * dpr);
          const y = Math.round(r.y * dpr);
          const w = Math.max(1, Math.round((r.r - r.x) * dpr));
          const h = Math.max(1, Math.round((r.b - r.y) * dpr));
          const d = g.getImageData(x, y, w, h).data;
          for (let i = 0; i < d.length; i += 4) px.push([L(d[i], d[i + 1], d[i + 2]), d[i], d[i + 1], d[i + 2]]);
        }
        px.sort((p, q) => p[0] - q[0]);
        const at = (q) => px[Math.min(px.length - 1, Math.floor(px.length * q))].slice(1);
        // Semi-transparent text is blended over the background it is measured against.
        const a = it.color.a * it.opacity;
        const vs = (bg) => {
          const t = [0, 1, 2].map((k) => a * [it.color.r, it.color.g, it.color.b][k] + (1 - a) * bg[k]);
          return Math.round(ratio(L(...t), L(...bg)) * 100) / 100;
        };
        const p95 = vs(at(0.95));
        const min = it.large ? 3 : 4.5;
        return { key: it.key, text: it.text, size: it.size, large: it.large, gradient: it.gradient, median: vs(at(0.5)), p95, min, pass: it.gradient || p95 >= min };
      });
    },
    { b64: png.toString('base64'), items, dpr },
  );
}

/** Audits the whole scroll height of the current screen; returns one row per text element. */
export async function auditContrast(page, screen) {
  const decoder = await page.context().newPage(); // about:blank: no CSP for data: images
  const dpr = await page.evaluate(() => devicePixelRatio);
  const plan = await page.evaluate(() => {
    const m = document.querySelector('.stage__main');
    if (!m) return { steps: [0], orig: 0 };
    const steps = [];
    const h = m.clientHeight;
    for (let y = 0; ; y += Math.floor(h * 0.8)) {
      steps.push(Math.min(y, m.scrollHeight - h));
      if (y + h >= m.scrollHeight) break;
    }
    return { steps: [...new Set(steps)], orig: m.scrollTop };
  });
  const rows = new Map();
  for (const y of plan.steps) {
    await page.evaluate((y) => {
      const m = document.querySelector('.stage__main');
      m?.scrollTo({ top: y, behavior: 'instant' });
    }, y);
    await page.waitForTimeout(180);
    const items = await page.evaluate(collect);
    // CSSOM instead of a <style> tag: the app's strict CSP forbids inline style elements.
    const hide = (shadow) =>
      page.evaluate((shadow) => document.styleSheets[0].insertRule(`*, *::before, *::after { color: transparent !important; -webkit-text-fill-color: transparent !important; ${shadow ? '' : 'text-shadow: none !important;'} caret-color: transparent !important; }`, 0), shadow);
    // No `transition: none` here: it breaks the 3D card stage. Waiting lets colour transitions end.
    await hide(true);
    await page.waitForTimeout(350);
    const withHalo = await page.screenshot();
    await page.evaluate(() => document.styleSheets[0].deleteRule(0));
    await hide(false);
    await page.waitForTimeout(350);
    const raw = await page.screenshot();
    await page.evaluate(() => document.styleSheets[0].deleteRule(0));
    if (process.env.CONTRAST_DEBUG_DIR) {
      const { writeFile } = await import('node:fs/promises');
      await writeFile(`${process.env.CONTRAST_DEBUG_DIR}/${screen}-${y}.png`, withHalo);
      await writeFile(`${process.env.CONTRAST_DEBUG_DIR}/${screen}-${y}.json`, JSON.stringify(items.filter((i) => i.key.includes('flank')), null, 1));
    }
    const gated = await measure(decoder, withHalo, items, dpr);
    const plain = await measure(decoder, raw, items, dpr);
    gated.forEach((r, i) => {
      const row = { screen, ...r, p95Raw: plain[i].p95 };
      const id = `${r.key}|${r.text}`;
      const prev = rows.get(id);
      if (!prev || row.p95 < prev.p95) rows.set(id, row);
    });
  }
  await page.evaluate((y) => {
    const m = document.querySelector('.stage__main');
    m?.scrollTo({ top: y, behavior: 'instant' });
  }, plan.orig);
  await decoder.close();
  return [...rows.values()];
}
