// Shared building blocks for the "Nocturne" deck (original vector art, created for this project).
// Canvas: 400 x 600 units (2:3). Rendered to WebP by scripts/render-art.mjs.
// No text is ever baked into the art: numerals and titles are rendered by the localized UI.

export const W = 400;
export const H = 600;

export const f = (n) => Number(n.toFixed(2));
export const polar = (cx, cy, r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [f(cx + r * Math.cos(a)), f(cy + r * Math.sin(a))];
};

/** Four-point sparkle. */
export function sparkle(cx, cy, r, attrs = 'fill="url(#gold)"') {
  const k = r * 0.22;
  return `<path ${attrs} d="M${cx} ${f(cy - r)} Q${f(cx + k)} ${f(cy - k)} ${f(cx + r)} ${cy} Q${f(cx + k)} ${f(cy + k)} ${cx} ${f(cy + r)} Q${f(cx - k)} ${f(cy + k)} ${f(cx - r)} ${cy} Q${f(cx - k)} ${f(cy - k)} ${cx} ${f(cy - r)}Z"/>`;
}

/** Crescent with its lit back on the given side ('left' | 'right'). */
export function crescentPath(cx, cy, r, side = 'left', thickness = 1.32) {
  const r2 = f(r * thickness);
  const top = `${cx} ${f(cy - r)}`;
  const bottom = `${cx} ${f(cy + r)}`;
  return side === 'left'
    ? `M${top} A${r} ${r} 0 0 0 ${bottom} A${r2} ${r2} 0 0 1 ${top}Z`
    : `M${top} A${r} ${r} 0 0 1 ${bottom} A${r2} ${r2} 0 0 0 ${top}Z`;
}

/** n-point star polygon. */
export function starPoints(cx, cy, outer, inner, n, rot = 0) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    pts.push(polar(cx, cy, r, rot + (i * 180) / n).join(','));
  }
  return pts.join(' ');
}

/** Horizontal sine wave path. */
export function wave(y, x0, x1, amp, len, phase = 0) {
  let d = `M${x0} ${f(y + amp * Math.sin(phase))}`;
  for (let x = x0 + 4; x <= x1; x += 4) d += ` L${x} ${f(y + amp * Math.sin(phase + ((x - x0) / len) * Math.PI * 2))}`;
  return d;
}

/** Common <defs>: foil gold, background, grain, glow, vignette. */
export function baseDefs({ bg, extra = '' }) {
  const stops = bg.stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('');
  return `
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#F8E9BD"/>
      <stop offset="0.2" stop-color="#DDBD7E"/>
      <stop offset="0.42" stop-color="#A8803F"/>
      <stop offset="0.6" stop-color="#EED495"/>
      <stop offset="0.8" stop-color="#B78D49"/>
      <stop offset="1" stop-color="#F3DFA4"/>
    </linearGradient>
    <linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F8E9BD"/>
      <stop offset="0.5" stop-color="#C9A462"/>
      <stop offset="1" stop-color="#8E6A31"/>
    </linearGradient>
    <radialGradient id="bg" cx="${bg.cx}" cy="${bg.cy}" r="${bg.r}" gradientUnits="userSpaceOnUse">${stops}</radialGradient>
    <radialGradient id="vignette" cx="200" cy="290" r="380" gradientUnits="userSpaceOnUse">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.62"/>
    </radialGradient>
    <filter id="grainLight" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.86  3 0 0 0 -1.7"/>
    </filter>
    <filter id="grainDark" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="4" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0.02  -3 0 0 0 1.32"/>
    </filter>
    <filter id="mottle" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="23"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0.03  0 0 -2.2 0 1.15"/>
    </filter>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glowStrong" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
    <clipPath id="inner"><rect x="18" y="18" width="364" height="564" rx="9"/></clipPath>
    <clipPath id="outer"><rect x="0" y="0" width="${W}" height="${H}" rx="20"/></clipPath>
    ${extra}
  </defs>`;
}

/** Paper grain, enamel mottling and vignette on top of the art. */
export function texture({ light = 0.09, dark = 0.13, mottle = 0 } = {}) {
  return `
  ${mottle ? `<rect width="${W}" height="${H}" filter="url(#mottle)" opacity="${mottle}"/>` : ''}
  <rect width="${W}" height="${H}" filter="url(#grainDark)" opacity="${dark}"/>
  <rect width="${W}" height="${H}" filter="url(#grainLight)" opacity="${light}"/>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>`;
}

function cornerOrnament() {
  return `
    <path d="M26 74 V34 Q26 26 34 26 H74" fill="none" stroke="url(#gold)" stroke-width="0.9"/>
    <path d="M32 58 V38 Q32 32 38 32 H58" fill="none" stroke="url(#gold)" stroke-width="0.5" opacity="0.7"/>
    ${sparkle(41, 41, 5.5)}
    <circle cx="26" cy="80" r="1.6" fill="url(#gold)"/>
    <circle cx="80" cy="26" r="1.6" fill="url(#gold)"/>`;
}

/** Frame shared by every card face: double border, corners, numeral medallion, title plaque. */
export function frame({ medallion = true, plaque = true } = {}) {
  const corners = [
    '',
    `transform="translate(${W} 0) scale(-1 1)"`,
    `transform="translate(0 ${H}) scale(1 -1)"`,
    `transform="translate(${W} ${H}) scale(-1 -1)"`,
  ]
    .map((t) => `<g ${t}>${cornerOrnament()}</g>`)
    .join('');
  const med = medallion
    ? `
    <path d="M128 40 H170 M230 40 H272" stroke="url(#gold)" stroke-width="0.8"/>
    <path d="M128 40 l-5 -4 l-5 4 l5 4 z M282 40 l-5 -4 l-5 4 l5 4 z" fill="url(#gold)"/>
    <circle cx="200" cy="40" r="26" fill="none" stroke="url(#gold)" stroke-width="0.6" opacity="0.8"/>
    <circle cx="200" cy="40" r="22" fill="#0C0A16" fill-opacity="0.92" stroke="url(#gold)" stroke-width="1.5"/>
    <circle cx="200" cy="40" r="18.5" fill="none" stroke="url(#gold)" stroke-width="0.45" opacity="0.7"/>`
    : '';
  const pl = plaque
    ? `
    <path d="M52 536 L76 511 H324 L348 536 L324 561 H76 Z" fill="#0C0A16" fill-opacity="0.93" stroke="url(#gold)" stroke-width="1.5"/>
    <path d="M61 536 L79 517 H321 L339 536 L321 555 H79 Z" fill="none" stroke="url(#gold)" stroke-width="0.5" opacity="0.75"/>
    <path d="M40 536 l-5 -4 l-5 4 l5 4 z M370 536 l-5 -4 l-5 4 l5 4 z" fill="url(#gold)"/>`
    : '';
  return `
  <g>
    <rect x="10.5" y="10.5" width="379" height="579" rx="13" fill="none" stroke="url(#gold)" stroke-width="2.4"/>
    <rect x="18" y="18" width="364" height="564" rx="9" fill="none" stroke="url(#gold)" stroke-width="0.8" opacity="0.85"/>
    ${corners}
    ${med}
    ${pl}
  </g>`;
}

/** Assemble a full card face. */
export function card({ bg, extraDefs = '', art, texture: tex = {} }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  ${baseDefs({ bg, extra: extraDefs })}
  <g clip-path="url(#outer)">
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <g clip-path="url(#inner)">${art}</g>
    ${texture(tex)}
    ${frame()}
  </g>
</svg>`;
}
