// Original illustrations for the "Nocturne" deck: VIII–XV (without the G1 cards).
// Symbolic still-lifes without figures, traditional major-arcana symbolism, own composition.
// Note: bounding-box gradients (goldV, linear()) need shapes with width and height – never use
// them on perfectly vertical or horizontal lines.
import { f, polar, crescentPath, starPoints, card } from './lib.mjs';
import { radial, linear, starDots, rays, ridge, cloud, waves, rose, blossom, leaf, infinity, tower, quadPoints, sparkles } from './motifs.mjs';

const WARM = 'fill="#FFF4D2"';
const COOL = 'fill="#EEE8FF"';

/* ---------------------------------------------------------------------- VIII · Strength (light) */
export function strength() {
  const extraDefs = `
    ${radial('halo', 200, 268, 190, [[0, '#FFF6E0', 0.9], [0.45, '#FFD8A0', 0.35], [1, '#F0A070', 0]])}
    ${linear('stone', [[0, '#8A7A70'], [1, '#3E322C']])}
    ${linear('meadow', [[0, '#8A9A40'], [1, '#34400F']])}
    ${linear('lily', [[0, '#FFFFFF'], [1, '#F2E4D8']])}
    ${linear('hill', [[0, '#D0A8A4'], [1, '#7A5468']])}`;

  let ring = `<circle cx="200" cy="268" r="84" fill="none" stroke="#5E6A2A" stroke-width="3"/>`;
  for (let i = 0; i < 24; i++) {
    const a = i * 15;
    const [x, y] = polar(200, 268, 84, a);
    ring += leaf(x, y, 16, 4.6, a + (i % 2 ? 40 : -40), '#6E7A30');
  }
  const colors = ['#F28AA0', '#FFE0E6', '#F7C46A'];
  for (let i = 0; i < 12; i++) {
    const [x, y] = polar(200, 268, 84, i * 30 + 7);
    ring += blossom(x, y, 7, colors[i % 3]);
  }
  let petals = '';
  for (let i = 0; i < 6; i++) {
    const [x, y] = polar(200, 246, 13, i * 60);
    petals += leaf(x, y, 26, 6.5, i * 60 - 90, 'url(#lily)');
  }

  const art = `
    <circle cx="200" cy="268" r="190" fill="url(#halo)"/>
    ${rays(200, 268, 100, 160, 36, { opacity: 0.3 })}
    ${infinity(200, 112, 36, 16, 'fill="none" stroke="#7A3A22" stroke-width="5.6" opacity="0.5"')}
    ${infinity(200, 112, 36, 16, 'fill="none" stroke="#FFF0C8" stroke-width="3" filter="url(#glow)"')}
    ${ridge([[18, 402], [80, 372], [150, 392], [220, 362], [300, 388], [382, 366]], { fill: 'url(#hill)', sw: 0.7 })}
    <path d="M18 430 Q200 410 382 430 V520 H18 Z" fill="url(#meadow)" stroke="url(#gold)" stroke-width="0.9"/>
    ${ring}
    <path d="M200 424 C 194 380, 206 330, 200 256" fill="none" stroke="#5E6526" stroke-width="3"/>
    ${leaf(190, 360, 30, 6, -60)}${leaf(210, 318, 28, 6, 60)}${leaf(192, 296, 22, 5, -70)}
    ${petals}
    <circle cx="200" cy="246" r="5" fill="#E9B44C"/>
    ${[0, 60, 120, 180, 240, 300].map((a) => { const [x, y] = polar(200, 246, 9, a); return `<circle cx="${x}" cy="${y}" r="1.4" fill="#B8742A"/>`; }).join('')}
    <path d="M138 474 C 136 444, 160 422, 200 420 C 240 422, 264 444, 262 474 Z" fill="url(#stone)" stroke="url(#gold)" stroke-width="1.1"/>
    <path d="M200 421 L196 436 L203 448 L197 462 L201 474" fill="none" stroke="#1E1612" stroke-width="1.6"/>
    <path d="M150 458 Q170 450 186 456 M214 446 Q232 440 248 448" stroke="url(#gold)" stroke-width="0.5" opacity="0.4" fill="none"/>
    ${[[52, 462], [96, 488], [312, 470], [352, 494], [282, 500], [122, 506]].map(([x, y], i) => blossom(x, y, 4.4, colors[i % 3])).join('')}
    ${sparkles([[84, 150, 4], [318, 156, 4.5], [64, 300, 3], [338, 312, 3]], WARM)}`;

  return card({
    bg: { cx: 200, cy: 260, r: 460, stops: [[0, '#FFE9CC'], [0.25, '#F0B48A'], [0.5, '#B86A60'], [0.75, '#4E2434'], [1, '#180A12']] },
    extraDefs,
    art,
    texture: { light: 0.05, dark: 0.09 },
  });
}

/* -------------------------------------------------------------------------- IX · Hermit (shadow) */
export function hermit() {
  const lx = 246;
  const ly = 208;
  const extraDefs = `
    ${radial('lamp', lx, ly, 170, [[0, '#FFE7A8', 0.8], [0.25, '#F2B860', 0.3], [1, '#8A5A2A', 0]])}
    ${linear('mtn', [[0, '#4A5270'], [1, '#141828']])}
    ${linear('mtnFar', [[0, '#2E3450'], [1, '#121524']])}
    ${linear('snow', [[0, '#F4F6FF'], [1, '#B8C0DA']])}
    ${radial('glass', lx, ly, 18, [[0, '#FFFFFF'], [0.5, '#FFE6A0'], [1, '#E8A040']])}
    ${linear('staff', [[0, '#A07A4A'], [1, '#5A3E22']], 'h')}`;

  const art = `
    ${starDots(9, 70, 24, 70, 376, 320, { maxR: 1.2 })}
    <path d="${crescentPath(92, 112, 15, 'left', 1.3)}" fill="#E8E4FF" opacity="0.85" filter="url(#glow)"/>
    ${ridge([[18, 360], [60, 322], [110, 346], [160, 300], [220, 340], [280, 290], [330, 330], [382, 310]], { fill: 'url(#mtnFar)', sw: 0.6, opacity: 0.95 })}
    <circle cx="${lx}" cy="${ly}" r="170" fill="url(#lamp)"/>
    ${ridge([[18, 500], [70, 452], [120, 412], [165, 362], [200, 320], [240, 364], [290, 412], [340, 442], [382, 470]], { fill: 'url(#mtn)' })}
    <path d="M165 362 L200 320 L240 364 L227 357 L214 370 L200 354 L186 368 L176 357 Z" fill="url(#snow)" stroke="url(#gold)" stroke-width="0.6"/>
    <path d="M120 412 L134 404 L142 412 M290 412 L278 404 L270 414 M86 440 L100 432 M316 430 L330 438" fill="none" stroke="#C8D0E8" stroke-width="1" opacity="0.5"/>
    ${[[188, 380], [178, 398], [170, 418], [160, 438], [150, 460]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.4" fill="#C8D0E8" opacity="0.45"/>`).join('')}
    <path d="M196 324 L212 162 L218 162 L202 324 Z" fill="url(#staff)" stroke="#2E2010" stroke-width="0.5"/>
    <path d="M215 162 C 216 138, 246 136, ${lx} 160" fill="none" stroke="#8A6A44" stroke-width="4" stroke-linecap="round"/>
    <path d="M${lx} 160 V176" stroke="url(#gold)" stroke-width="1.2"/>
    ${rays(lx, ly, 26, 100, 16, { opacity: 0.35, stroke: '#FFE2A0' })}
    <path d="M${lx - 12} 182 H${lx + 12} L${lx + 8} 176 H${lx - 8} Z" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.6"/>
    <polygon points="${lx - 12},182 ${lx + 12},182 ${lx + 14},${ly} ${lx + 12},234 ${lx - 12},234 ${lx - 14},${ly}" fill="url(#glass)" stroke="url(#gold)" stroke-width="1.2" filter="url(#glow)"/>
    <line x1="${lx}" y1="182" x2="${lx + 0.01}" y2="234" stroke="url(#gold)" stroke-width="0.6" opacity="0.6"/>
    <polygon points="${starPoints(lx, ly, 9, 4.5, 6)}" fill="#FFFFFF" filter="url(#glow)"/>
    <path d="M${lx - 12} 234 H${lx + 12} L${lx + 7} 241 H${lx - 7} Z" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.6"/>
    ${sparkles([[310, 120, 3], [140, 180, 2.4], [330, 250, 2.6]], COOL)}`;

  return card({
    bg: { cx: lx, cy: ly, r: 480, stops: [[0, '#3A4064'], [0.35, '#1E2340'], [0.7, '#0E1124'], [1, '#05060E']] },
    extraDefs,
    art,
    texture: { light: 0.07, dark: 0.2 },
  });
}

/* ------------------------------------------------------------- X · Wheel of Fortune (twilight) */
export function wheel() {
  const cx = 200;
  const cy = 284;
  const extraDefs = `
    ${radial('halo', cx, cy, 190, [[0, '#E6D8FF', 0.55], [0.5, '#9A80E0', 0.2], [1, '#4A3A9A', 0]])}
    ${radial('wheelFill', cx, cy, 112, [[0, '#3A2E7A'], [0.7, '#241C52'], [1, '#151036']])}
    ${radial('hub', cx - 4, cy - 4, 18, [[0, '#FFF6DA'], [1, '#C8964A']])}`;

  let spokes = '';
  for (let i = 0; i < 8; i++) {
    const [x1, y1] = polar(cx, cy, 18, i * 45);
    const [x2, y2] = polar(cx, cy, 82, i * 45);
    const [dx, dy] = polar(cx, cy, 60, i * 45);
    spokes += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="url(#gold)" stroke-width="1.8"/>`;
    spokes += `<polygon points="${starPoints(dx, dy, 4.5, 2, 4, i * 45)}" fill="url(#gold)"/>`;
  }
  const glyphs = [
    (x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="none" stroke="url(#gold)" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="1.4" fill="url(#gold)"/>`,
    (x, y) => `<path d="${crescentPath(x, y, 5.5, 'left', 1.3)}" fill="url(#gold)"/>`,
    (x, y) => `<polygon points="${starPoints(x, y, 6, 2.6, 5)}" fill="url(#gold)"/>`,
    (x, y) => `<path d="M${x} ${y - 6} L${x + 5.5} ${y + 4} H${x - 5.5} Z" fill="none" stroke="url(#gold)" stroke-width="1.2"/>`,
  ];
  let rim = '';
  for (let i = 0; i < 8; i++) {
    const [x, y] = polar(cx, cy, 94, i * 45 + 22.5);
    rim += glyphs[i % 4](x, y);
  }

  const art = `
    ${starDots(10, 70, 24, 70, 376, 520, { maxR: 1.1 })}
    <circle cx="${cx}" cy="${cy}" r="190" fill="url(#halo)"/>
    ${rays(cx, cy, 116, 172, 48, { alt: 22, opacity: 0.35 })}
    <circle cx="${cx}" cy="${cy}" r="112" fill="url(#wheelFill)" stroke="url(#gold)" stroke-width="2.4" filter="url(#glow)"/>
    <circle cx="${cx}" cy="${cy}" r="105" fill="none" stroke="url(#gold)" stroke-width="0.6" opacity="0.8"/>
    <circle cx="${cx}" cy="${cy}" r="84" fill="none" stroke="url(#gold)" stroke-width="1.4"/>
    <circle cx="${cx}" cy="${cy}" r="78" fill="none" stroke="url(#gold)" stroke-width="0.6" stroke-dasharray="1.2 4.4" opacity="0.8"/>
    ${rim}
    <circle cx="${cx}" cy="${cy}" r="40" fill="none" stroke="url(#gold)" stroke-width="1.2"/>
    ${spokes}
    <circle cx="${cx}" cy="${cy}" r="18" fill="url(#hub)" stroke="#5B3F22" stroke-width="0.8"/>
    <polygon points="${starPoints(cx, cy, 11, 4.6, 8)}" fill="#8A5A1E" opacity="0.7"/>
    <circle cx="${cx}" cy="${cy}" r="3" fill="#FFF8E4"/>
    ${cloud(78, 112, 0.85, '#E4DCF6', 0.85)}${cloud(322, 112, 0.85, '#E4DCF6', 0.85)}
    ${cloud(82, 470, 1, '#E4DCF6', 0.85)}${cloud(318, 470, 1, '#E4DCF6', 0.85)}
    ${sparkles([[108, 94, 3.4], [292, 94, 3.4], [112, 452, 3.4], [288, 452, 3.4]], COOL)}
    ${sparkles([[56, 256, 3], [344, 256, 3], [200, 432, 3.6], [200, 134, 3.2]], COOL)}`;

  return card({
    bg: { cx, cy, r: 440, stops: [[0, '#4A3C8E'], [0.4, '#2A2160'], [0.75, '#151034'], [1, '#080614']] },
    extraDefs,
    art,
  });
}

/* ----------------------------------------------------------------------- XI · Justice (twilight) */
export function justice() {
  const extraDefs = `
    ${radial('halo', 200, 220, 180, [[0, '#FFE8D0', 0.6], [0.5, '#E09080', 0.2], [1, '#8A3A5A', 0]])}
    ${linear('veil', [[0, '#5A1E4A'], [1, '#2A0C24']])}
    ${linear('pillar', [[0, '#3A3048'], [0.5, '#6A5A7A'], [1, '#2A2234']], 'h')}
    ${linear('blade', [[0, '#FFFFFF'], [0.5, '#D8DCEA'], [1, '#8A90A8']], 'h')}
    ${linear('dais', [[0, '#6A5A70'], [1, '#2A2030']])}`;

  const pillar = (x) => `
    <rect x="${x}" y="128" width="42" height="342" fill="url(#pillar)" stroke="url(#gold)" stroke-width="1.1"/>
    ${[10, 21, 32].map((dx) => `<line x1="${x + dx}" y1="136" x2="${x + dx}" y2="464" stroke="url(#gold)" stroke-width="0.5" opacity="0.35"/>`).join('')}
    <path d="M${x - 6} 128 H${x + 48} L${x + 42} 116 H${x} Z" fill="url(#pillar)" stroke="url(#gold)" stroke-width="1"/>
    <rect x="${x - 6}" y="458" width="54" height="12" fill="url(#pillar)" stroke="url(#gold)" stroke-width="1"/>`;
  const pan = (x) => `
    <path d="M${x} 199 L${x - 24} 268 M${x} 199 L${x + 24} 268" stroke="url(#gold)" stroke-width="0.9"/>
    <path d="M${x - 28} 268 Q${x} 292 ${x + 28} 268 Z" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.8"/>
    <circle cx="${x}" cy="196" r="3.4" fill="url(#gold)"/>`;
  let floor = '';
  for (let i = 0; i < 8; i++) floor += `<path d="M${200 + (i - 3.5) * 30} 440 L${200 + (i - 3.5) * 70} 520" stroke="url(#gold)" stroke-width="0.5" opacity="0.3"/>`;

  const art = `
    <path d="M100 116 H300 V470 H100 Z" fill="url(#veil)"/>
    ${[124, 152, 180, 220, 248, 276].map((x, i) => `<path d="M${x} 120 C ${x + (i % 2 ? 5 : -5)} 220, ${x + (i % 2 ? -4 : 4)} 340, ${x} 468" fill="none" stroke="#1A0614" stroke-width="1.2" opacity="0.6"/>`).join('')}
    <circle cx="200" cy="220" r="180" fill="url(#halo)"/>
    ${rays(200, 196, 20, 110, 24, { opacity: 0.3 })}
    ${pillar(58)}${pillar(300)}
    <rect x="108" y="193" width="184" height="6" rx="3" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.6"/>
    ${pan(112)}${pan(288)}
    <path d="M200 100 L208 118 V318 H192 V118 Z" fill="url(#blade)" stroke="#5A5E78" stroke-width="0.8" filter="url(#glow)"/>
    <path d="M200 112 V314" stroke="#8A90A8" stroke-width="0.8"/>
    <circle cx="200" cy="196" r="8" fill="none" stroke="url(#gold)" stroke-width="2"/>
    <rect x="162" y="318" width="76" height="8" rx="3" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.7"/>
    <circle cx="162" cy="322" r="4.4" fill="url(#goldV)"/><circle cx="238" cy="322" r="4.4" fill="url(#goldV)"/>
    <rect x="195" y="326" width="10" height="40" fill="#4A2A1A" stroke="#2A160C" stroke-width="0.6"/>
    ${[332, 340, 348, 356].map((y) => `<path d="M195 ${y} L205 ${y + 4}" stroke="#8A5A3A" stroke-width="0.8"/>`).join('')}
    <circle cx="200" cy="372" r="8" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.7"/>
    <rect x="140" y="380" width="120" height="18" fill="url(#dais)" stroke="url(#gold)" stroke-width="1"/>
    <rect x="118" y="398" width="164" height="20" fill="url(#dais)" stroke="url(#gold)" stroke-width="1"/>
    <rect x="96" y="418" width="208" height="22" fill="url(#dais)" stroke="url(#gold)" stroke-width="1"/>
    <rect x="18" y="440" width="364" height="80" fill="#1A0C18"/>
    <line x1="18" y1="440" x2="382" y2="440" stroke="url(#gold)" stroke-width="0.9"/>
    ${floor}
    ${sparkles([[150, 150, 3], [250, 150, 3], [140, 330, 2.6], [262, 330, 2.6]], WARM)}`;

  return card({
    bg: { cx: 200, cy: 220, r: 460, stops: [[0, '#7A3050'], [0.35, '#4A1A38'], [0.7, '#221024'], [1, '#0C0610']] },
    extraDefs,
    art,
    texture: { light: 0.07, dark: 0.16 },
  });
}

/* ------------------------------------------------------------------ XII · Hanged Man (twilight) */
export function hangedMan() {
  const extraDefs = `
    ${radial('halo', 200, 168, 130, [[0, '#FFF4D0', 0.9], [0.3, '#FFE09A', 0.45], [1, '#F0B860', 0]])}
    ${linear('wood', [[0, '#5A3E26'], [0.5, '#9A7048'], [1, '#4A321E']], 'h')}
    ${linear('woodH', [[0, '#9A7048'], [1, '#4A321E']])}
    ${linear('lake', [[0, '#2A5A70'], [1, '#0C1E2A']])}
    ${linear('bank', [[0, '#2E4A3A'], [1, '#12201A']])}
    ${linear('hills', [[0, '#2A4A58'], [1, '#12242C']])}
    <clipPath id="lakeClip"><rect x="18" y="426" width="364" height="96"/></clipPath>`;

  const cluster = (x, y, n, spread, seed) => {
    let out = '';
    for (let i = 0; i < n; i++) {
      const a = (i * 360) / n + seed * 17;
      const [lx, ly] = polar(x, y, spread * (0.5 + ((i * 7 + seed) % 5) / 10), a);
      out += leaf(lx, ly, 14, 4.4, a - 90, i % 2 ? '#6E8A3A' : '#88A24A');
    }
    return out;
  };
  const treeAndHalo = `
    <circle cx="200" cy="168" r="130" fill="url(#halo)"/>
    ${rays(200, 150, 52, 120, 32, { opacity: 0.4, alt: 20 })}
    <circle cx="200" cy="150" r="44" fill="none" stroke="#FFF2C8" stroke-width="2.4" filter="url(#glow)"/>
    <circle cx="200" cy="150" r="52" fill="none" stroke="url(#gold)" stroke-width="0.8" stroke-dasharray="1.4 4.4"/>
    <path d="M178 424 C 190 416, 191 400, 192 380 C 193 300, 195 220, 195 150 H205 C 205 220, 207 300, 208 380 C 209 400, 210 416, 222 424 Z" fill="url(#wood)" stroke="url(#gold)" stroke-width="0.8"/>
    <path d="M192 412 C 180 418, 168 420, 158 426 M208 412 C 220 418, 232 420, 242 426" fill="none" stroke="#5A3E26" stroke-width="3" stroke-linecap="round"/>
    <path d="M104 140 C 140 134, 170 140, 196 144 L204 144 C 230 140, 260 134, 296 140 L296 152 C 260 148, 230 152, 204 156 L196 156 C 170 152, 140 148, 104 152 Z" fill="url(#woodH)" stroke="url(#gold)" stroke-width="0.8"/>
    ${cluster(108, 140, 9, 16, 1)}${cluster(292, 140, 9, 16, 3)}${cluster(156, 140, 5, 10, 2)}${cluster(244, 140, 5, 10, 4)}
    ${leaf(214, 300, 16, 4.4, 30, '#6E8A3A')}${leaf(186, 250, 14, 4, -30, '#6E8A3A')}${leaf(212, 360, 12, 3.6, 40, '#6E8A3A')}`;

  const art = `
    ${starDots(12, 40, 24, 70, 376, 300, { maxR: 1 })}
    ${ridge([[18, 404], [70, 380], [130, 396], [190, 372], [260, 394], [320, 374], [382, 392]], { fill: 'url(#hills)', sw: 0.6, base: 430 })}
    ${treeAndHalo}
    <path d="M18 414 Q200 404 382 414 V428 H18 Z" fill="url(#bank)" stroke="url(#gold)" stroke-width="0.8"/>
    <rect x="18" y="426" width="364" height="96" fill="url(#lake)"/>
    <g clip-path="url(#lakeClip)">
      <g transform="translate(0 426) scale(1 -0.34) translate(0 -426)" opacity="0.32">${treeAndHalo}</g>
      ${waves(436, 7, { gap: 11, amp: 1.6, len: 26, sw: 0.7, opacity: 0.5 })}
    </g>
    <line x1="18" y1="426" x2="382" y2="426" stroke="url(#gold)" stroke-width="0.8"/>
    ${[[34, 420], [48, 418], [352, 420], [366, 418]].map(([x, y]) => `<path d="M${x} ${y} q-2 -16 -6 -22 M${x} ${y} q2 -18 0 -26 M${x} ${y} q4 -14 8 -18" fill="none" stroke="#6E8A6A" stroke-width="1" stroke-linecap="round" opacity="0.8"/>`).join('')}
    ${sparkles([[74, 200, 3], [328, 200, 3], [96, 300, 2.4], [306, 300, 2.4]], WARM)}`;

  return card({
    bg: { cx: 200, cy: 220, r: 460, stops: [[0, '#3E6A82'], [0.35, '#22445A'], [0.7, '#10222E'], [1, '#060E14']] },
    extraDefs,
    art,
  });
}

/* ------------------------------------------------------------------------ XIII · Death (shadow) */
export function death() {
  const extraDefs = `
    ${radial('dawn', 200, 362, 210, [[0, '#FFE8C8', 0.85], [0.3, '#F0B090', 0.4], [1, '#7A5A7A', 0]])}
    ${radial('disc', 196, 352, 40, [[0, '#FFFBEF'], [0.6, '#FFE0B0'], [1, '#F0A878']])}
    ${linear('towerStone', [[0, '#141822'], [0.5, '#2E3444'], [1, '#10141C']], 'h')}
    ${linear('river', [[0, '#E0D4E0'], [1, '#4A5878']])}
    ${linear('land', [[0, '#1E222C'], [1, '#0A0C12']])}`;

  const petal = (x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3" fill="#F7F1EA" opacity="0.85" transform="rotate(${rot} ${x} ${y})"/>`;
  const art = `
    ${starDots(13, 40, 24, 70, 376, 240, { maxR: 1 })}
    <circle cx="200" cy="362" r="210" fill="url(#dawn)"/>
    ${rays(200, 362, 46, 180, 28, { opacity: 0.35, stroke: '#FFE8C8' })}
    <circle cx="200" cy="362" r="38" fill="url(#disc)" stroke="url(#gold)" stroke-width="1.4" filter="url(#glow)"/>
    <path d="M150 170 q6 -6 12 0 q6 -6 12 0 M226 150 q5 -5 10 0 q5 -5 10 0" fill="none" stroke="#2A2234" stroke-width="1.1" stroke-linecap="round" opacity="0.7"/>
    ${tower(112, 250, 36, 364, { fill: 'url(#towerStone)', window: '#FFE0A8' })}
    ${tower(252, 250, 36, 364, { fill: 'url(#towerStone)', window: '#FFE0A8' })}
    <path d="M18 362 H382 V520 H18 Z" fill="url(#land)"/>
    <path d="M18 362 Q90 352 150 362 M250 362 Q320 352 382 362" fill="none" stroke="url(#gold)" stroke-width="0.8"/>
    <path d="M192 362 C 172 398, 242 418, 212 456 C 194 482, 164 498, 140 520 H262 C 270 500, 252 480, 262 456 C 280 420, 218 396, 208 362 Z" fill="url(#river)" opacity="0.7" stroke="url(#gold)" stroke-width="0.6"/>
    <path d="M196 380 Q206 384 214 380 M204 410 Q220 416 234 410 M210 446 Q226 452 240 446 M190 486 Q212 492 236 486" fill="none" stroke="#FFF4E4" stroke-width="0.8" opacity="0.6"/>
    <path d="M18 420 C 60 400, 100 404, 130 430 L 150 520 H18 Z M382 410 C 340 396, 300 404, 276 428 L 262 520 H382 Z" fill="#0C0E16" stroke="url(#gold)" stroke-width="0.7"/>
    <path d="M100 498 C 98 476, 104 462, 100 444" fill="none" stroke="#4E5A22" stroke-width="2.2"/>
    ${leaf(92, 476, 16, 4.6, -30, '#4E5A22')}${leaf(110, 466, 14, 4, 30, '#4E5A22')}
    ${rose(100, 440, 18, { fill: '#FAF6F0', center: '#F2D48A', stroke: '#8A8090', leaf: '#3E4A1A' })}
    ${petal(150, 424, 30)}${petal(172, 446, -20)}${petal(316, 470, 60)}
    ${sparkles([[80, 120, 3], [322, 120, 3.4], [60, 240, 2.4], [342, 234, 2.4]], WARM)}`;

  return card({
    bg: { cx: 200, cy: 362, r: 460, stops: [[0, '#C89A9A'], [0.25, '#6A5272'], [0.55, '#262840'], [0.8, '#10121E'], [1, '#06070C']] },
    extraDefs,
    art,
    texture: { light: 0.07, dark: 0.18 },
  });
}

/* ------------------------------------------------------------------- XIV · Temperance (light) */
export function temperance() {
  const extraDefs = `
    ${radial('halo', 302, 300, 140, [[0, '#FFF6DA', 0.95], [0.4, '#FFE0A0', 0.4], [1, '#F0C080', 0]])}
    ${linear('waterArc', [[0, '#F4FBFF'], [1, '#8AC0E8']])}
    ${linear('pool', [[0, '#5A8AB0'], [1, '#1E3A58']])}
    ${linear('hill', [[0, '#8AA48A'], [1, '#3A5244']])}
    ${linear('meadow', [[0, '#6E8A5A'], [1, '#22301E']])}
    ${linear('path', [[0, '#F2DDB0'], [1, '#B8955A']])}`;

  const iris = (x, y, s = 1) => {
    const k = (n) => f(n * s);
    return `
      <path d="M${x} 520 C ${x - 2} ${y + 30}, ${x + 2} ${y + 16}, ${x} ${y + 6}" fill="none" stroke="#4E6A2E" stroke-width="${k(2)}"/>
      ${leaf(x - k(6), y + k(36), k(34), k(3.4), -78, '#5E7A34')}${leaf(x + k(6), y + k(40), k(30), k(3.2), 78, '#5E7A34')}
      <path d="M${x} ${y + k(6)} C ${x - k(12)} ${y + k(2)}, ${x - k(12)} ${y - k(10)}, ${x - k(4)} ${y - k(4)} Z" fill="#7A6AD8"/>
      <path d="M${x} ${y + k(6)} C ${x + k(12)} ${y + k(2)}, ${x + k(12)} ${y - k(10)}, ${x + k(4)} ${y - k(4)} Z" fill="#7A6AD8"/>
      <path d="M${x} ${y + k(4)} C ${x - k(6)} ${y - k(8)}, ${x + k(6)} ${y - k(8)}, ${x} ${y + k(4)} Z" fill="#B8AEF4"/>
      <circle cx="${x}" cy="${y + k(2)}" r="${k(1.6)}" fill="#F2C44A"/>`;
  };
  const drops = [[204, 214], [222, 230], [236, 252]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#F4FBFF" opacity="0.9"/>`).join('');

  const art = `
    <circle cx="302" cy="300" r="140" fill="url(#halo)"/>
    ${rays(302, 300, 24, 110, 20, { opacity: 0.35 })}
    <circle cx="302" cy="300" r="22" fill="#FFF8E4" stroke="url(#gold)" stroke-width="1.2" filter="url(#glow)"/>
    ${ridge([[170, 360], [250, 298], [282, 322], [302, 314], [322, 322], [346, 290], [382, 318]], { fill: 'url(#hill)', base: 400 })}
    ${ridge([[18, 352], [60, 330], [120, 346], [180, 336], [230, 360]], { fill: 'url(#hill)', base: 400, opacity: 0.85 })}
    <path d="M18 380 Q200 366 382 380 V520 H18 Z" fill="url(#meadow)" stroke="url(#gold)" stroke-width="0.8"/>
    <path d="M232 520 C 250 470, 332 452, 304 412 C 286 388, 300 356, 300 336 L 304 336 C 308 356, 300 388, 318 410 C 352 452, 292 482, 302 520 Z" fill="url(#path)" opacity="0.9"/>
    <path d="M24 452 Q110 432 196 452 Q216 476 190 496 Q110 512 30 496 Q12 474 24 452 Z" fill="url(#pool)" stroke="url(#gold)" stroke-width="0.9"/>
    <path d="M50 466 Q80 462 110 466 M90 480 Q120 476 160 480 M60 492 Q90 489 120 492" fill="none" stroke="#C8E0F4" stroke-width="0.8" opacity="0.6"/>
    ${iris(40, 430, 0.9)}${iris(64, 420)}${iris(188, 432, 0.85)}
    <path d="M165 209 Q232 180 256 296" fill="none" stroke="#2A5A8A" stroke-width="7" stroke-linecap="round" opacity="0.35"/>
    <path d="M165 209 Q232 180 256 296" fill="none" stroke="url(#waterArc)" stroke-width="4.6" stroke-linecap="round" filter="url(#glow)"/>
    <path d="M168 206 Q230 180 254 290" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.9"/>
    ${drops}
    <g transform="rotate(38 132 214)">
      <path d="M109 190 Q109 220 132 224 Q155 220 155 190 Z" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.8"/>
      <rect x="129.4" y="222" width="5.2" height="18" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.6"/>
      <ellipse cx="132" cy="241" rx="14" ry="4" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.8"/>
      <ellipse cx="132" cy="190" rx="23" ry="4.2" fill="#2E2212" stroke="#5B3F22" stroke-width="0.6" opacity="0.8"/>
    </g>
    <path d="M235 300 Q235 330 258 334 Q281 330 281 300 Z" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.8"/>
    <rect x="255.4" y="332" width="5.2" height="18" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.6"/>
    <ellipse cx="258" cy="351" rx="14" ry="4" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.8"/>
    <ellipse cx="258" cy="300" rx="23" ry="4.2" fill="#8AC0E8" stroke="#5B3F22" stroke-width="0.6"/>
    ${sparkles([[78, 120, 4], [190, 104, 3], [330, 140, 3.6], [96, 300, 2.8]], WARM)}`;

  return card({
    bg: { cx: 302, cy: 300, r: 480, stops: [[0, '#FFF4DC'], [0.22, '#CFE2EE'], [0.45, '#7AA6C8'], [0.75, '#2E4C70'], [1, '#101C2E']] },
    extraDefs,
    art,
    texture: { light: 0.05, dark: 0.08 },
  });
}

/* -------------------------------------------------------------------------- XV · Devil (shadow) */
export function devil() {
  const extraDefs = `
    ${radial('ember', 200, 230, 180, [[0, '#FF7A4A', 0.5], [0.4, '#B82A2A', 0.2], [1, '#4A0A14', 0]])}
    ${linear('stone', [[0, '#22141A'], [0.5, '#3E262C'], [1, '#160C10']], 'h')}
    ${linear('horn', [[0, '#F2D8A0'], [1, '#8A5A2A']])}
    ${linear('iron', [[0, '#B8B0B8'], [1, '#4A4248']])}`;

  const chain = (x0, y0, cx, cy, x1, y1, n) =>
    quadPoints(x0, y0, cx, cy, x1, y1, n)
      .map(([x, y, a], i) =>
        i === n - 1
          ? `<path d="M${f(x - 5)} ${f(y - 2)} A6 3.6 0 1 1 ${f(x + 3)} ${f(y + 3)}" fill="none" stroke="url(#iron)" stroke-width="2" transform="rotate(${a} ${x} ${y})"/>`
          : `<ellipse cx="${x}" cy="${y}" rx="6" ry="${i % 2 ? 1.6 : 3.6}" fill="none" stroke="url(#iron)" stroke-width="2" transform="rotate(${a} ${x} ${y})"/>`,
      )
      .join('');
  const smoke = [
    'M168 306 C 150 270, 186 250, 166 214 C 152 188, 172 166, 162 140',
    'M200 306 C 214 276, 186 262, 204 236',
    'M232 306 C 250 270, 214 250, 234 214 C 248 188, 228 166, 238 140',
  ]
    .map((d) => `<path d="${d}" fill="none" stroke="#9A8A9A" stroke-width="5" stroke-linecap="round" opacity="0.22" filter="url(#glow)"/>`)
    .join('');

  const art = `
    <circle cx="200" cy="230" r="180" fill="url(#ember)"/>
    ${starDots(15, 26, 24, 70, 376, 260, { maxR: 0.9, fill: '#F2B8A0' })}
    ${smoke}
    <path d="${crescentPath(200, 186, 36, 'left', 1.25)}" transform="rotate(-90 200 186)" fill="url(#horn)" stroke="url(#gold)" stroke-width="1" filter="url(#glow)"/>
    <circle cx="200" cy="200" r="5" fill="#FFE0B0" opacity="0.9" filter="url(#glow)"/>
    ${rays(200, 186, 44, 92, 20, { opacity: 0.25 })}
    <path d="M18 446 L60 438 L96 450 L140 440 L260 440 L300 452 L340 440 L382 448 V520 H18 Z" fill="#0E0608" stroke="url(#gold)" stroke-width="0.9"/>
    <rect x="130" y="306" width="140" height="14" fill="url(#stone)" stroke="url(#gold)" stroke-width="1"/>
    <path d="M140 320 H260 V430 H140 Z" fill="url(#stone)" stroke="url(#gold)" stroke-width="1.1"/>
    <rect x="152" y="332" width="96" height="86" fill="none" stroke="url(#gold)" stroke-width="0.5" opacity="0.6"/>
    <rect x="120" y="430" width="160" height="16" fill="url(#stone)" stroke="url(#gold)" stroke-width="1"/>
    <circle cx="160" cy="362" r="6" fill="none" stroke="url(#iron)" stroke-width="2.2"/>
    <circle cx="240" cy="362" r="6" fill="none" stroke="url(#iron)" stroke-width="2.2"/>
    ${chain(156, 370, 118, 420, 82, 470, 9)}
    ${chain(244, 370, 282, 420, 318, 470, 9)}
    ${[[110, 488], [296, 492], [180, 500]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#FF8A5A" opacity="0.8" filter="url(#glow)"/>`).join('')}
    ${sparkles([[92, 128, 2.6], [312, 128, 2.6]], 'fill="#F2C8A0"')}`;

  return card({
    bg: { cx: 200, cy: 230, r: 460, stops: [[0, '#5A1418'], [0.3, '#320A12'], [0.65, '#16060A'], [1, '#070305']] },
    extraDefs,
    art,
    texture: { light: 0.07, dark: 0.24 },
  });
}
