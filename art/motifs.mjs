// Reusable motifs for the "Nocturne" deck (original vector art, created for this project).
import { f, polar, sparkle, starPoints, wave } from './lib.mjs';

/** Deterministic pseudo-random numbers so every render is identical. */
export function rng(seed) {
  let x = seed >>> 0 || 1;
  return () => {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    return x / 4294967296;
  };
}

/** Radial gradient in user space. stops: [offset, color, opacity?][] */
export function radial(id, cx, cy, r, stops) {
  const s = stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('');
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse">${s}</radialGradient>`;
}

/** Linear gradient in bounding-box units. dir: 'v' (top→bottom) | 'h' (left→right) | 'd' (diagonal). */
export function linear(id, stops, dir = 'v') {
  const [x2, y2] = dir === 'h' ? [1, 0] : dir === 'd' ? [1, 1] : [0, 1];
  const s = stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('');
  return `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${s}</linearGradient>`;
}

/** A scatter of small stars / dust. */
export function starDots(seed, n, x0, y0, x1, y1, { maxR = 1.3, fill = '#F3E6C4' } = {}) {
  const r = rng(seed);
  let out = '';
  for (let i = 0; i < n; i++) {
    out += `<circle cx="${f(x0 + (x1 - x0) * r())}" cy="${f(y0 + (y1 - y0) * r())}" r="${f(0.35 + maxR * r())}" fill="${fill}" opacity="${f(0.3 + 0.55 * r())}"/>`;
  }
  return out;
}

/** Radiating lines; `alt` shortens every second ray. */
export function rays(cx, cy, r0, r1, n, { width = 0.7, opacity = 0.5, rot = 0, alt = 0, stroke = 'url(#gold)' } = {}) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const a = rot + (i * 360) / n;
    const [x1, y1] = polar(cx, cy, r0, a);
    const [x2, y2] = polar(cx, cy, alt && i % 2 ? r1 - alt : r1, a);
    out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" opacity="${opacity}"/>`;
  }
  return out;
}

/** Mountain / hill silhouette from left to right, closed down to `base`. */
export function ridge(points, { fill, stroke = 'url(#gold)', sw = 1, opacity = 1, base = 520 } = {}) {
  const [first] = points;
  const last = points[points.length - 1];
  const d = `M${first[0]} ${base} ${points.map(([x, y]) => `L${x} ${y}`).join(' ')} L${last[0]} ${base} Z`;
  return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" opacity="${opacity}"/>`;
}

/** Soft heraldic cloud. */
export function cloud(cx, cy, s = 1, fill = '#F4EEF8', opacity = 0.92) {
  const X = (n) => f(cx + n * s);
  const Y = (n) => f(cy + n * s);
  return `<path d="M${X(-46)} ${Y(10)} C ${X(-54)} ${Y(-6)}, ${X(-36)} ${Y(-18)}, ${X(-22)} ${Y(-10)} C ${X(-18)} ${Y(-30)}, ${X(12)} ${Y(-34)}, ${X(18)} ${Y(-13)} C ${X(34)} ${Y(-22)}, ${X(54)} ${Y(-6)}, ${X(46)} ${Y(10)} Q ${X(0)} ${Y(16)} ${X(-46)} ${Y(10)} Z" fill="${fill}" stroke="url(#gold)" stroke-width="0.9" opacity="${opacity}"/>`;
}

/** Stack of sine waves (water). */
export function waves(y0, n, { gap = 11, x0 = 18, x1 = 382, amp = 2.4, len = 30, sw = 0.9, opacity = 0.6, stroke = 'url(#gold)' } = {}) {
  let out = '';
  for (let i = 0; i < n; i++) {
    out += `<path d="${wave(y0 + i * gap, x0, x1, Math.max(0.8, amp - i * 0.15), len + i * 2, i * 1.1)}" fill="none" stroke="${stroke}" stroke-width="${f(Math.max(0.3, sw - i * 0.08))}" opacity="${f(Math.max(0.12, opacity - i * 0.1))}"/>`;
  }
  return out;
}

/** Five-petal heraldic rose. */
export function rose(cx, cy, r, { fill = '#F7F1EA', center = '#E9C46A', stroke = '#9C8466', leaf = '#5E6526' } = {}) {
  let sepals = '';
  for (let i = 0; i < 5; i++) {
    const [sx, sy] = polar(cx, cy, r * 1.05, i * 72 + 36);
    sepals += `<path d="M${cx} ${cy} L${sx} ${sy}" stroke="${leaf}" stroke-width="${f(r * 0.18)}" stroke-linecap="round"/>`;
  }
  let petals = '';
  for (let i = 0; i < 5; i++) {
    const [px, py] = polar(cx, cy, r * 0.5, i * 72);
    petals += `<circle cx="${px}" cy="${py}" r="${f(r * 0.52)}" fill="${fill}" stroke="${stroke}" stroke-width="0.8"/>`;
  }
  return `${sepals}${petals}<circle cx="${cx}" cy="${cy}" r="${f(r * 0.3)}" fill="${center}" stroke="${stroke}" stroke-width="0.8"/>`;
}

/** Simple five-dot blossom for garlands. */
export function blossom(cx, cy, r, fill) {
  let out = '';
  for (let i = 0; i < 5; i++) {
    const [px, py] = polar(cx, cy, r * 0.62, i * 72);
    out += `<circle cx="${px}" cy="${py}" r="${f(r * 0.48)}" fill="${fill}" stroke="#7A4A2A" stroke-width="0.4"/>`;
  }
  return `${out}<circle cx="${cx}" cy="${cy}" r="${f(r * 0.32)}" fill="#E9B44C"/>`;
}

/** Leaf as a pointed ellipse, rotated. */
export function leaf(cx, cy, len, width, rot, fill = '#6E7A30') {
  return `<path d="M${f(-len / 2)} 0 Q 0 ${f(-width)} ${f(len / 2)} 0 Q 0 ${f(width)} ${f(-len / 2)} 0 Z" fill="${fill}" stroke="#3E4418" stroke-width="0.5" transform="translate(${cx} ${cy}) rotate(${rot})"/>`;
}

/** Chalice whose bowl rim sits at `top`; total height ≈ 54·s. */
export function chalice(cx, top, s = 1, fill = 'url(#goldV)') {
  const k = (n) => f(n * s);
  return `
    <path d="M${f(cx - k(22))} ${top} Q${f(cx - k(22))} ${f(top + k(30))} ${cx} ${f(top + k(34))} Q${f(cx + k(22))} ${f(top + k(30))} ${f(cx + k(22))} ${top} Z" fill="${fill}" stroke="#5B3F22" stroke-width="0.8"/>
    <rect x="${f(cx - k(2.5))}" y="${f(top + k(33))}" width="${k(5)}" height="${k(17)}" fill="${fill}" stroke="#5B3F22" stroke-width="0.6"/>
    <circle cx="${cx}" cy="${f(top + k(40))}" r="${k(4)}" fill="${fill}" stroke="#5B3F22" stroke-width="0.6"/>
    <ellipse cx="${cx}" cy="${f(top + k(51))}" rx="${k(14)}" ry="${k(4)}" fill="${fill}" stroke="#5B3F22" stroke-width="0.8"/>
    <ellipse cx="${cx}" cy="${top}" rx="${k(22)}" ry="${k(4)}" fill="#2E2212" stroke="#5B3F22" stroke-width="0.6" opacity="0.7"/>`;
}

/** Lemniscate (∞). */
export function infinity(cx, cy, w, h, attrs = 'fill="none" stroke="url(#gold)" stroke-width="3"') {
  const R = (n) => f(cx + n);
  const U = (n) => f(cy + n);
  return `<path d="M${cx} ${cy} C ${R(w * 0.25)} ${U(-h)}, ${R(w)} ${U(-h)}, ${R(w)} ${cy} C ${R(w)} ${U(h)}, ${R(w * 0.25)} ${U(h)}, ${cx} ${cy} C ${R(-w * 0.25)} ${U(-h)}, ${R(-w)} ${U(-h)}, ${R(-w)} ${cy} C ${R(-w)} ${U(h)}, ${R(-w * 0.25)} ${U(h)}, ${cx} ${cy} Z" ${attrs}/>`;
}

/** Crenellated tower with lit windows. */
export function tower(x, top, w, bottom, { fill = 'url(#towerFill)', window = '#FFD58A' } = {}) {
  const merlon = w / 5;
  let crown = `M${x} ${top}`;
  for (let i = 0; i < 5; i++) {
    const x0 = x + i * merlon;
    crown += i % 2 === 0 ? ` V${top - 9} H${f(x0 + merlon)} V${top}` : ` H${f(x0 + merlon)}`;
  }
  const body = `<path d="${crown} V${bottom} H${x} Z" fill="${fill}" stroke="url(#gold)" stroke-width="1"/>`;
  const cx = f(x + w / 2);
  const win = (y) => `<path d="M${f(cx - 4)} ${y + 10} V${y} A4 4 0 0 1 ${f(cx + 4)} ${y} V${y + 10} Z" fill="${window}" opacity="0.85"/>`;
  return `${body}${win(top + 22)}${win(top + 62)}<line x1="${x}" y1="${top + 4}" x2="${x + w}" y2="${top + 4}" stroke="url(#gold)" stroke-width="0.5" opacity="0.6"/>`;
}

/** Archimedean spiral (ram horn, curl). */
export function spiral(cx, cy, turns, r0, r1, { rot = 0, dir = 1, sw = 1.6, stroke = 'url(#gold)' } = {}) {
  let d = '';
  const steps = Math.round(turns * 36);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const [x, y] = polar(cx, cy, r0 + (r1 - r0) * t, rot + dir * t * turns * 360);
    d += `${i ? ' L' : 'M'}${x} ${y}`;
  }
  return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>`;
}

/** Small n-point star. */
export function smallStar(cx, cy, r, n = 8, fill = 'url(#gold)', rot = 0) {
  return `<polygon points="${starPoints(cx, cy, r, r * 0.42, n, rot)}" fill="${fill}"/>`;
}

/** Points along a quadratic Bézier with tangent angle (deg). */
export function quadPoints(x0, y0, cx, cy, x1, y1, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t ** 2 * x1;
    const y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t ** 2 * y1;
    const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx);
    const dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy);
    out.push([f(x), f(y), f((Math.atan2(dy, dx) * 180) / Math.PI)]);
  }
  return out;
}

/** Several sparkles: list of [x, y, r]. */
export function sparkles(list, attrs = 'fill="url(#gold)"') {
  return list.map(([x, y, r]) => sparkle(x, y, r, attrs)).join('');
}
