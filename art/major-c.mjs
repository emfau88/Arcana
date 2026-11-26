// Original illustrations for the "Nocturne" deck: XVII, XVIII, XX, XXI.
// Symbolic still-lifes without figures, traditional major-arcana symbolism, own composition.
import { f, polar, starPoints, card } from './lib.mjs';
import { radial, linear, starDots, rays, ridge, cloud, waves, leaf, tower, smallStar, sparkles } from './motifs.mjs';

const WARM = 'fill="#FFF4D2"';
const COOL = 'fill="#EEF2FF"';

/* ------------------------------------------------------------------------- XVII · Star (twilight) */
export function star() {
  const extraDefs = `
    ${radial('halo', 200, 156, 150, [[0, '#FFFFFF', 0.85], [0.3, '#DCE4FF', 0.4], [1, '#7A8AD8', 0]])}
    ${linear('pool', [[0, '#3A5A9A'], [1, '#121E40']])}
    ${linear('land', [[0, '#3A4A5A'], [1, '#141C24']])}
    ${linear('jug', [[0, '#F2D8A0'], [1, '#A87A3A']])}
    ${linear('stream', [[0, '#F4FAFF'], [1, '#A8C8F0']])}`;

  const jug = (x, y, rot) => `
    <g transform="translate(${x} ${y}) rotate(${rot})">
      <path d="M-6 -18 C -20 -14, -22 8, -10 20 L -6 24 H6 L10 20 C 22 8, 20 -14, 6 -18 Z" fill="url(#jug)" stroke="#5B3F22" stroke-width="0.8"/>
      <ellipse cx="0" cy="25" rx="8" ry="2.4" fill="url(#jug)" stroke="#5B3F22" stroke-width="0.6"/>
      <rect x="-6" y="-26" width="12" height="9" fill="url(#jug)" stroke="#5B3F22" stroke-width="0.7"/>
      <ellipse cx="0" cy="-26" rx="8" ry="2.6" fill="#3A2A14" stroke="#5B3F22" stroke-width="0.6"/>
      <path d="M12 -12 C 24 -12, 24 6, 15 8" fill="none" stroke="#A87A3A" stroke-width="2.4"/>
      <path d="M-15 -2 H15" stroke="#7A5418" stroke-width="0.8" opacity="0.7"/>
    </g>`;
  const mouth = (x, y, rot) => {
    const a = (rot * Math.PI) / 180;
    return [f(x + 26 * Math.sin(a)), f(y - 26 * Math.cos(a))];
  };
  const [ax, ay] = mouth(256, 344, -118);
  const [bx, by] = mouth(150, 336, -118);
  let small = '';
  const spots = [[86, 112], [314, 112], [62, 196], [338, 196], [104, 270], [296, 270], [200, 256]];
  for (const [x, y] of spots) small += `<polygon points="${starPoints(x, y, 11, 4, 8)}" fill="#FFF8E0" filter="url(#glow)"/>`;

  const art = `
    ${starDots(17, 90, 24, 70, 376, 340, { maxR: 1.2 })}
    <circle cx="200" cy="156" r="150" fill="url(#halo)"/>
    ${rays(200, 156, 56, 140, 32, { alt: 30, opacity: 0.4 })}
    <polygon points="${starPoints(200, 156, 54, 20, 8)}" fill="#FFF8E0" stroke="url(#gold)" stroke-width="1.2" filter="url(#glowStrong)"/>
    <polygon points="${starPoints(200, 156, 38, 16, 8, 22.5)}" fill="url(#gold)" opacity="0.75"/>
    <circle cx="200" cy="156" r="7" fill="#FFFFFF"/>
    ${small}
    ${ridge([[230, 392], [290, 352], [340, 338], [382, 344]], { fill: 'url(#land)', sw: 0.8, base: 430 })}
    <path d="M330 342 V292" stroke="#4A3422" stroke-width="4"/>
    <circle cx="330" cy="280" r="20" fill="#2E4A32" stroke="url(#gold)" stroke-width="0.8"/>
    ${leaf(318, 272, 12, 4, -30, '#4A6A3A')}${leaf(340, 286, 12, 4, 30, '#4A6A3A')}
    <path d="M18 380 Q 100 370 170 396 Q 200 404 230 392 Q 300 384 382 396 V520 H18 Z" fill="url(#land)" stroke="url(#gold)" stroke-width="0.8"/>
    <path d="M110 424 Q200 404 300 424 Q340 452 300 482 Q200 502 110 482 Q76 452 110 424 Z" fill="url(#pool)" stroke="url(#gold)" stroke-width="1"/>
    <ellipse cx="${ax - 12}" cy="436" rx="14" ry="3" fill="none" stroke="#C8DAF4" stroke-width="0.8" opacity="0.7"/>
    <ellipse cx="${ax - 12}" cy="436" rx="26" ry="5.4" fill="none" stroke="#C8DAF4" stroke-width="0.6" opacity="0.45"/>
    <path d="M140 462 Q200 456 260 462 M150 476 Q200 472 250 476" fill="none" stroke="#C8DAF4" stroke-width="0.7" opacity="0.4"/>
    <path d="M${ax} ${ay} Q ${ax - 14} ${ay + 30} ${ax - 12} 436" fill="none" stroke="url(#stream)" stroke-width="3.4" stroke-linecap="round" filter="url(#glow)"/>
    <path d="M${bx} ${by} Q ${bx - 20} ${by + 14} ${bx - 26} 392" fill="none" stroke="url(#stream)" stroke-width="3.4" stroke-linecap="round" filter="url(#glow)"/>
    <path d="M${bx - 26} 392 q-14 6 -24 4 M${bx - 26} 392 q-6 10 -16 14 M${bx - 26} 392 q4 12 -2 22 M${bx - 26} 392 q12 8 14 20" fill="none" stroke="#C8DAF4" stroke-width="1.1" opacity="0.7"/>
    ${jug(256, 344, -118)}${jug(150, 336, -118)}
    ${[[40, 410], [70, 430], [210, 506], [350, 420]].map(([x, y]) => smallStar(x, y, 3, 8, '#DCE4FF')).join('')}`;

  return card({
    bg: { cx: 200, cy: 160, r: 460, stops: [[0, '#5A6AB8'], [0.35, '#2C3880'], [0.7, '#141A44'], [1, '#070A1C']] },
    extraDefs,
    art,
  });
}

/* --------------------------------------------------------------------------- XVIII · Moon (shadow) */
export function moon() {
  const extraDefs = `
    ${radial('halo', 200, 150, 170, [[0, '#F4F0FF', 0.75], [0.35, '#B8B0E8', 0.3], [1, '#5A4E9A', 0]])}
    ${radial('disc', 188, 138, 56, [[0, '#FFFDF0'], [0.55, '#E8E0C8'], [1, '#A89A7A']])}
    ${linear('towerStone', [[0, '#22223A'], [0.5, '#46465E'], [1, '#1C1C2C']], 'h')}
    ${linear('pool', [[0, '#2A3A6A'], [1, '#0E142A']])}
    ${linear('path', [[0, '#C8B88A', 0.5], [1, '#F2E2B0', 0.9]])}
    ${linear('land', [[0, '#22283E'], [1, '#0C0E18']])}
    ${linear('dew', [[0, '#FFF2C8'], [1, '#E0A85A']])}
    <clipPath id="moonClip"><circle cx="200" cy="150" r="48"/></clipPath>`;

  const drop = (x, y, s = 1) =>
    `<path d="M${x} ${f(y - 7 * s)} C ${f(x + 4 * s)} ${f(y - 1 * s)}, ${f(x + 4 * s)} ${f(y + 4 * s)}, ${x} ${f(y + 5 * s)} C ${f(x - 4 * s)} ${f(y + 4 * s)}, ${f(x - 4 * s)} ${f(y - 1 * s)}, ${x} ${f(y - 7 * s)} Z" fill="url(#dew)" opacity="0.9"/>`;
  const drops = [[150, 222, 1], [176, 240, 0.9], [200, 216, 1.1], [224, 240, 0.9], [250, 222, 1], [162, 266, 0.8], [200, 260, 0.9], [238, 266, 0.8], [200, 296, 0.7]]
    .map(([x, y, s]) => drop(x, y, s))
    .join('');

  const art = `
    ${starDots(18, 60, 24, 70, 376, 320, { maxR: 1.1 })}
    <circle cx="200" cy="150" r="170" fill="url(#halo)"/>
    ${rays(200, 150, 56, 136, 32, { alt: 30, opacity: 0.38 })}
    <circle cx="200" cy="150" r="48" fill="url(#disc)" filter="url(#glow)"/>
    <g clip-path="url(#moonClip)">
      <circle cx="226" cy="140" r="44" fill="#2E2864" opacity="0.5"/>
      <g fill="#8A7E64" opacity="0.25"><circle cx="180" cy="136" r="8"/><circle cx="196" cy="166" r="6"/><circle cx="172" cy="160" r="4"/></g>
    </g>
    <circle cx="200" cy="150" r="48" fill="none" stroke="url(#gold)" stroke-width="1.6"/>
    ${drops}
    ${ridge([[18, 340], [80, 312], [140, 330], [200, 302], [260, 330], [320, 306], [382, 336]], { fill: '#2A2C4A', sw: 0.7, base: 400 })}
    <path d="M18 360 Q200 350 382 360 V520 H18 Z" fill="url(#land)" stroke="url(#gold)" stroke-width="0.8"/>
    ${tower(52, 270, 40, 430, { fill: 'url(#towerStone)', window: '#FFE6A8' })}
    ${tower(308, 270, 40, 430, { fill: 'url(#towerStone)', window: '#FFE6A8' })}
    <path d="M186 446 C 160 414, 240 394, 206 362 C 188 344, 214 322, 200 304 L 204 304 C 222 324, 198 346, 216 362 C 256 394, 176 416, 214 446 Z" fill="url(#path)"/>
    <path d="M60 452 Q200 432 340 452 Q370 480 330 504 Q200 520 70 504 Q30 480 60 452 Z" fill="url(#pool)" stroke="url(#gold)" stroke-width="1"/>
    <ellipse cx="200" cy="474" rx="22" ry="4" fill="none" stroke="#C8D0F4" stroke-width="0.8" opacity="0.6"/>
    <ellipse cx="200" cy="474" rx="44" ry="8" fill="none" stroke="#C8D0F4" stroke-width="0.6" opacity="0.4"/>
    <ellipse cx="200" cy="474" rx="70" ry="13" fill="none" stroke="#C8D0F4" stroke-width="0.5" opacity="0.25"/>
    ${[[36, 446], [50, 442], [350, 446], [364, 442]].map(([x, y]) => `<path d="M${x} ${y} q-2 -14 -6 -20 M${x} ${y} q2 -16 0 -24 M${x} ${y} q4 -12 8 -16" fill="none" stroke="#5A6A8A" stroke-width="1" stroke-linecap="round" opacity="0.8"/>`).join('')}
    ${sparkles([[90, 120, 3.4], [312, 112, 3.6], [120, 230, 2.4], [284, 230, 2.4]], COOL)}`;

  return card({
    bg: { cx: 200, cy: 150, r: 470, stops: [[0, '#4A4888'], [0.35, '#28285A'], [0.7, '#121430'], [1, '#060712']] },
    extraDefs,
    art,
    texture: { light: 0.07, dark: 0.18 },
  });
}

/* ------------------------------------------------------------------------ XX · Judgement (light) */
export function judgement() {
  const extraDefs = `
    ${radial('halo', 286, 130, 180, [[0, '#FFFBEF', 0.9], [0.35, '#FFE6B0', 0.4], [1, '#C8D8F0', 0]])}
    ${linear('horn', [[0, '#FFF0C0'], [0.5, '#E0B060'], [1, '#9A6A28']])}
    ${linear('sea', [[0, '#7AA0C8'], [1, '#22385A']])}
    ${linear('peak', [[0, '#E8EEF8'], [1, '#7A8AA8']])}
    ${linear('beam', [[0, '#FFF8E0', 0], [0.5, '#FFF4D0', 0.75], [1, '#FFF8E0', 0]], 'h')}`;

  const arc = (r) => {
    const [x1, y1] = polar(150, 228, r, 192);
    const [x2, y2] = polar(150, 228, r, 258);
    return `<path d="M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}" fill="none" stroke="#FFF4D0" stroke-width="1.4" stroke-linecap="round" opacity="${f(0.9 - r / 120)}"/>`;
  };
  const column = (x, w, top) => `
    <rect x="${x - w / 2}" y="${top}" width="${w}" height="${430 - top}" fill="url(#beam)"/>
    <ellipse cx="${x}" cy="432" rx="${w * 0.9}" ry="4" fill="#FFF4D0" opacity="0.75" filter="url(#glow)"/>
    ${sparkles([[x - 3, top + 30, 3], [x + 4, top + 70, 2.4], [x - 2, top + 110, 2]], 'fill="#FFFFFF" opacity="0.9"')}`;

  const art = `
    <circle cx="286" cy="130" r="180" fill="url(#halo)"/>
    ${rays(286, 130, 40, 200, 36, { alt: 50, opacity: 0.35 })}
    ${ridge([[18, 368], [50, 300], [90, 330], [130, 372]], { fill: 'url(#peak)', base: 420 })}
    ${ridge([[270, 372], [310, 318], [345, 286], [382, 334]], { fill: 'url(#peak)', base: 420 })}
    <rect x="18" y="370" width="364" height="150" fill="url(#sea)"/>
    <line x1="18" y1="370" x2="382" y2="370" stroke="url(#gold)" stroke-width="0.8"/>
    ${waves(386, 10, { gap: 12, amp: 1.8, len: 28, sw: 0.8, opacity: 0.55 })}
    ${column(120, 22, 300)}${column(200, 26, 276)}${column(280, 22, 300)}
    ${arc(34)}${arc(50)}${arc(66)}
    <path d="M269.7 152.5 L266.3 147.5 L169.2 205.7 Q150 205 136.7 207.9 Q140 232 163.3 248.1 Q170 228 178 219.1 Z" fill="url(#horn)" stroke="#5B3F22" stroke-width="0.9"/>
    <ellipse cx="150" cy="228" rx="24" ry="6" fill="#3A2A14" stroke="url(#gold)" stroke-width="0.8" transform="rotate(56.5 150 228)"/>
    <path d="M214 180 L214 214 M236 168 L236 202" stroke="url(#gold)" stroke-width="0.8"/>
    <path d="M206 206 H244 V236 L225 246 L206 236 Z" fill="#FBF6EE" stroke="url(#gold)" stroke-width="0.8" transform="rotate(-8 225 221)"/>
    <g transform="rotate(-8 225 221)">${rays(225, 222, 6, 12, 12, { width: 1, opacity: 0.9 })}<circle cx="225" cy="222" r="5" fill="url(#gold)"/></g>
    ${cloud(292, 122, 1.35, '#FFFDF8', 0.95)}${cloud(338, 156, 0.9, '#FBF4EE', 0.92)}${cloud(240, 154, 0.85, '#FBF4EE', 0.92)}
    ${sparkles([[70, 140, 3.6], [110, 96, 3], [60, 240, 2.6]], WARM)}`;

  return card({
    bg: { cx: 286, cy: 130, r: 500, stops: [[0, '#FFF6E0'], [0.2, '#E8E4E8'], [0.42, '#9AB4D8'], [0.7, '#3E5A88'], [1, '#121E36']] },
    extraDefs,
    art,
    texture: { light: 0.05, dark: 0.08 },
  });
}

/* --------------------------------------------------------------------------- XXI · World (light) */
export function world() {
  const cx = 200;
  const cy = 290;
  const extraDefs = `
    ${radial('halo', cx, cy, 180, [[0, '#FFF4DA', 0.75], [0.45, '#C8A8F0', 0.25], [1, '#6A4AB0', 0]])}
    ${radial('globe', cx - 14, cy - 14, 56, [[0, '#9AC4F4'], [0.6, '#3A5AB0'], [1, '#1A2460']])}
    ${linear('ribbon', [[0, '#E05A6A'], [1, '#8A1E34']])}`;

  const rx = 104;
  const ry = 160;
  let wreath = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#4E6A26" stroke-width="3"/>`;
  const N = 48;
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    if (Math.abs(Math.sin(t)) < 0.12) continue; // leave room for the ribbons at top and bottom
    const x = f(cx + rx * Math.sin(t));
    const y = f(cy - ry * Math.cos(t));
    const tangent = (Math.atan2(ry * Math.sin(t), rx * Math.cos(t)) * 180) / Math.PI;
    wreath += leaf(x, y, 18, 5, tangent + 35, i % 2 ? '#7A9A44' : '#5E7E30');
    wreath += leaf(x, y, 16, 4.4, tangent - 35, i % 2 ? '#5E7E30' : '#7A9A44');
    if (i % 4 === 0) wreath += `<circle cx="${x}" cy="${y}" r="2.2" fill="url(#gold)"/>`;
  }
  const bow = (y, dir) => `
    <path d="M${cx} ${y} C ${cx - 10} ${y - 14}, ${cx - 28} ${y - 12}, ${cx - 26} ${y} C ${cx - 28} ${y + 12}, ${cx - 10} ${y + 14}, ${cx} ${y} C ${cx + 10} ${y - 14}, ${cx + 28} ${y - 12}, ${cx + 26} ${y} C ${cx + 28} ${y + 12}, ${cx + 10} ${y + 14}, ${cx} ${y} Z" fill="url(#ribbon)" stroke="#5A0E1E" stroke-width="0.8"/>
    <path d="M${cx - 3} ${y} C ${cx - 8} ${y + dir * 16}, ${cx - 16} ${y + dir * 22}, ${cx - 20} ${y + dir * 30} M${cx + 3} ${y} C ${cx + 8} ${y + dir * 16}, ${cx + 16} ${y + dir * 22}, ${cx + 20} ${y + dir * 30}" fill="none" stroke="#B8344A" stroke-width="3" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${y}" r="4" fill="url(#gold)"/>`;
  const emblem = (x, y, inner) => `
    <circle cx="${x}" cy="${y}" r="24" fill="#1A1236" fill-opacity="0.85" stroke="url(#gold)" stroke-width="1.2"/>
    <circle cx="${x}" cy="${y}" r="19" fill="none" stroke="url(#gold)" stroke-width="0.5" opacity="0.7"/>
    ${inner}`;
  const tri = (x, y, up, color, bar) => {
    const d = up ? `M${x} ${y - 10} L${x + 10} ${y + 7} H${x - 10} Z` : `M${x} ${y + 10} L${x + 10} ${y - 7} H${x - 10} Z`;
    const b = bar ? `<line x1="${x - 8}" y1="${up ? y + 1 : y - 1}" x2="${x + 8}" y2="${up ? y + 1 : y - 1}" stroke="${color}" stroke-width="1.6"/>` : '';
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/>${b}`;
  };
  let meridians = '';
  for (const w of [16, 34, 50]) meridians += `<ellipse cx="${cx}" cy="${cy}" rx="${w}" ry="50" fill="none" stroke="#DCE8FF" stroke-width="0.6" opacity="0.45"/>`;

  const art = `
    ${starDots(21, 80, 24, 70, 376, 520, { maxR: 1.2 })}
    <circle cx="${cx}" cy="${cy}" r="180" fill="url(#halo)"/>
    ${rays(cx, cy, 64, 92, 36, { opacity: 0.35 })}
    ${wreath}
    ${bow(cy - ry, -1)}${bow(cy + ry, 1)}
    <ellipse cx="${cx}" cy="${cy}" rx="78" ry="20" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.8" transform="rotate(-18 ${cx} ${cy})"/>
    <circle cx="${cx}" cy="${cy}" r="50" fill="url(#globe)" stroke="url(#gold)" stroke-width="1.6" filter="url(#glow)"/>
    ${meridians}
    <path d="M${cx - 50} ${cy} H${cx + 50} M${cx - 44} ${cy - 22} H${cx + 44} M${cx - 44} ${cy + 22} H${cx + 44}" stroke="#DCE8FF" stroke-width="0.6" opacity="0.45"/>
    <g fill="#9ED09A" opacity="0.42">
      <ellipse cx="${cx - 16}" cy="${cy - 20}" rx="16" ry="10" transform="rotate(-20 ${cx - 16} ${cy - 20})"/>
      <ellipse cx="${cx + 18}" cy="${cy + 12}" rx="12" ry="18" transform="rotate(15 ${cx + 18} ${cy + 12})"/>
      <ellipse cx="${cx - 22}" cy="${cy + 22}" rx="8" ry="5"/>
    </g>
    <path d="M${cx - 78} ${cy} A78 20 0 0 0 ${cx + 78} ${cy}" fill="none" stroke="url(#gold)" stroke-width="1.2" transform="rotate(-18 ${cx} ${cy})"/>
    ${smallStar(...polar(cx, cy, 80, 70), 5, 8, '#FFF4D2')}
    ${emblem(78, 112, tri(78, 112, true, '#BFE0FF', true))}
    ${emblem(322, 112, tri(322, 112, true, '#FFB070', false))}
    ${emblem(78, 456, tri(78, 456, false, '#C8D88A', true))}
    ${emblem(322, 456, tri(322, 456, false, '#8AC0F0', false))}
    ${sparkles([[150, 110, 3], [252, 112, 3.4], [56, 290, 3], [344, 290, 3], [150, 470, 2.6], [252, 470, 2.6]], WARM)}`;

  return card({
    bg: { cx, cy, r: 450, stops: [[0, '#5A44A0'], [0.35, '#33266E'], [0.7, '#181238'], [1, '#080616']] },
    extraDefs,
    art,
  });
}
