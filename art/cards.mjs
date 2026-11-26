// Original illustrations for the G1 slice of the "Nocturne" deck.
// Symbolic still-lifes (no figures): traditional major-arcana symbolism, own composition.
import { W, H, f, polar, sparkle, crescentPath, starPoints, wave, card, baseDefs, texture, frame } from './lib.mjs';

/* ------------------------------------------------------------ II · High Priestess (twilight) */
export function highPriestess() {
  const extraDefs = `
    <radialGradient id="moonHalo" cx="200" cy="196" r="170" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#C9BEF5" stop-opacity="0.55"/>
      <stop offset="0.45" stop-color="#8C7FD0" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#5A4C9E" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="moonDisc" cx="182" cy="176" r="96" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#F6F2FF"/>
      <stop offset="0.45" stop-color="#C8BEEB"/>
      <stop offset="1" stop-color="#5E5396"/>
    </radialGradient>
    <linearGradient id="pillarLight" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#E7E0FA" stop-opacity="0.42"/>
      <stop offset="0.5" stop-color="#CFC5F0" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#A89BD8" stop-opacity="0.3"/>
    </linearGradient>
    <linearGradient id="pillarDark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#05040C"/>
      <stop offset="0.6" stop-color="#110E24"/>
      <stop offset="1" stop-color="#080712"/>
    </linearGradient>
    <linearGradient id="veil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2A2358" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#141030" stop-opacity="0.92"/>
    </linearGradient>
    <linearGradient id="parchment" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F3EEFF"/>
      <stop offset="1" stop-color="#BDB2E2"/>
    </linearGradient>
    <clipPath id="veilClip"><path d="M96 266 H304 V448 Q283.2 466 262.4 448 Q241.6 466 220.8 448 Q200 466 179.2 448 Q158.4 466 137.6 448 Q116.8 466 96 448 Z"/></clipPath>`;

  const pomegranate = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
      const x = 110 + col * 27 + (row % 2) * 13.5;
      const y = 292 + row * 34;
      pomegranate.push(
        `<g opacity="0.42"><circle cx="${x}" cy="${y}" r="4.6" fill="none" stroke="url(#gold)" stroke-width="0.8"/><path d="M${x - 3} ${y - 4.2} l1.2 -3 l1.8 2 l1.8 -2 l1.2 3" fill="none" stroke="url(#gold)" stroke-width="0.7"/></g>`,
      );
    }
  }
  const folds = [128, 163, 200, 237, 272]
    .map((x, i) => `<path d="M${x} 270 C ${x + (i % 2 ? 6 : -6)} 330, ${x + (i % 2 ? -5 : 5)} 390, ${x} 452" fill="none" stroke="url(#gold)" stroke-width="0.6" opacity="0.3"/>`)
    .join('');

  const pillar = (x, fill, flutes) => `
    <rect x="${x}" y="246" width="36" height="250" fill="${fill}" stroke="url(#gold)" stroke-width="1.2"/>
    ${flutes.map((dx) => `<line x1="${x + dx}" y1="252" x2="${x + dx}" y2="490" stroke="url(#gold)" stroke-width="0.5" opacity="0.35"/>`).join('')}
    <path d="M${x - 6} 246 H${x + 42} L${x + 38} 236 H${x - 2} Z" fill="${fill}" stroke="url(#gold)" stroke-width="1.1"/>
    <path d="M${x - 2} 236 Q${x + 18} 222 ${x + 38} 236" fill="none" stroke="url(#gold)" stroke-width="1"/>
    <path d="M${x + 2} 206 A16 16 0 0 0 ${x + 34} 206 A19 19 0 0 1 ${x + 2} 206 Z" fill="url(#moonDisc)" stroke="url(#gold)" stroke-width="1.1" filter="url(#glow)"/>
    <line x1="${x + 18}" y1="222" x2="${x + 18}" y2="229" stroke="url(#gold)" stroke-width="1.2"/>
    <rect x="${x - 6}" y="496" width="48" height="9" fill="${fill}" stroke="url(#gold)" stroke-width="1"/>
    <rect x="${x - 10}" y="505" width="56" height="8" fill="${fill}" stroke="url(#gold)" stroke-width="1"/>`;

  const textLines = [
    [182, 218],
    [182, 214],
    [182, 219],
    [182, 207],
    [182, 216],
    [182, 211],
  ]
    .map(([a, b], i) => `<line x1="${a}" y1="${388 + i * 8}" x2="${b}" y2="${388 + i * 8}" stroke="#6C5FA6" stroke-width="1.3" stroke-linecap="round" opacity="${0.7 - i * 0.07}"/>`)
    .join('');

  const art = `
    <circle cx="200" cy="196" r="170" fill="url(#moonHalo)"/>
    <path d="M96 248 Q96 118 200 98 Q304 118 304 248" fill="none" stroke="url(#gold)" stroke-width="1"/>
    <path d="M104 248 Q104 126 200 107 Q296 126 296 248" fill="none" stroke="url(#gold)" stroke-width="0.5" opacity="0.6"/>
    <circle cx="200" cy="196" r="88" fill="none" stroke="url(#gold)" stroke-width="0.5" opacity="0.55"/>
    <circle cx="200" cy="196" r="80" fill="none" stroke="url(#gold)" stroke-width="0.8" stroke-dasharray="1.4 5.4"/>
    <circle cx="200" cy="196" r="70" fill="url(#moonDisc)"/>
    <g fill="#7D71B8" opacity="0.28">
      <circle cx="178" cy="182" r="12"/><circle cx="224" cy="214" r="9"/><circle cx="208" cy="168" r="6"/>
      <circle cx="186" cy="224" r="7"/><circle cx="230" cy="180" r="5"/><circle cx="166" cy="206" r="4"/>
    </g>
    <circle cx="200" cy="196" r="70" fill="none" stroke="url(#gold)" stroke-width="1.7" filter="url(#glow)"/>
    ${sparkle(122, 112, 6)}${sparkle(284, 126, 5)}${sparkle(320, 92, 3.6)}${sparkle(82, 148, 3.6)}${sparkle(252, 88, 3)}${sparkle(150, 84, 2.6)}
    <path d="M96 266 H304 V448 Q283.2 466 262.4 448 Q241.6 466 220.8 448 Q200 466 179.2 448 Q158.4 466 137.6 448 Q116.8 466 96 448 Z" fill="url(#veil)" stroke="url(#gold)" stroke-width="1"/>
    <g clip-path="url(#veilClip)">${pomegranate.join('')}${folds}</g>
    <line x1="88" y1="264" x2="312" y2="264" stroke="url(#gold)" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="88" cy="264" r="3.6" fill="url(#gold)"/><circle cx="312" cy="264" r="3.6" fill="url(#gold)"/>
    ${pillar(60, 'url(#pillarDark)', [9, 18, 27])}
    ${pillar(304, 'url(#pillarLight)', [9, 18, 27])}
    <rect x="172" y="372" width="56" height="78" fill="url(#parchment)" opacity="0.94"/>
    ${textLines}
    <path d="${crescentPath(200, 428, 7, 'left', 1.3)}" fill="#6C5FA6" opacity="0.55"/>
    <rect x="166" y="364" width="68" height="11" rx="5.5" fill="url(#goldV)" stroke="#5A4630" stroke-width="0.6"/>
    <rect x="166" y="446" width="68" height="11" rx="5.5" fill="url(#goldV)" stroke="#5A4630" stroke-width="0.6"/>
    <g fill="none" stroke="url(#gold)">
      <path d="${wave(474, 18, 382, 2.6, 28)}" stroke-width="0.9" opacity="0.6"/>
      <path d="${wave(486, 18, 382, 2.4, 30, 1.2)}" stroke-width="0.8" opacity="0.46"/>
      <path d="${wave(498, 18, 382, 2.2, 32, 2.1)}" stroke-width="0.7" opacity="0.32"/>
      <path d="${wave(509, 18, 382, 2, 34, 3)}" stroke-width="0.6" opacity="0.2"/>
    </g>
    <g stroke="#ECE6FF" stroke-linecap="round" opacity="0.55">
      <line x1="186" y1="479" x2="214" y2="479" stroke-width="1.4"/>
      <line x1="191" y1="491" x2="209" y2="491" stroke-width="1.2"/>
      <line x1="195" y1="503" x2="205" y2="503" stroke-width="1"/>
    </g>`;

  return card({
    bg: { cx: 200, cy: 210, r: 420, stops: [[0, '#2B2560'], [0.38, '#18143A'], [0.75, '#0E0C22'], [1, '#07060F']] },
    extraDefs,
    art,
  });
}

/* ------------------------------------------------------------------- XVI · Tower (shadow) */
export function tower() {
  const extraDefs = `
    <radialGradient id="emberHalo" cx="300" cy="104" r="190" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FF9A5C" stop-opacity="0.5"/>
      <stop offset="0.35" stop-color="#C2412E" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#5A1020" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="fireHalo" cx="200" cy="196" r="120" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFB15E" stop-opacity="0.55"/>
      <stop offset="0.5" stop-color="#E0542F" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#E0542F" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="stone" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#1A1016"/>
      <stop offset="0.45" stop-color="#3A2530"/>
      <stop offset="1" stop-color="#140B10"/>
    </linearGradient>
    <linearGradient id="ember" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFE3A3"/>
      <stop offset="0.45" stop-color="#FF9B4A"/>
      <stop offset="1" stop-color="#C2321F"/>
    </linearGradient>
    <linearGradient id="bolt" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="0.5" stop-color="#FFF1C4"/>
      <stop offset="1" stop-color="#F2C76E"/>
    </linearGradient>`;

  const edgeX = (y) => [f(168 - ((y - 214) * 20) / 274), f(232 + ((y - 214) * 20) / 274)];
  let courses = '';
  for (let y = 234, i = 0; y < 488; y += 19, i++) {
    const [l, r] = edgeX(y);
    courses += `<line x1="${l}" y1="${y}" x2="${r}" y2="${y}" stroke="url(#gold)" stroke-width="0.55" opacity="0.4"/>`;
    const [l2, r2] = edgeX(y + 19);
    const span = Math.min(r, r2) - Math.max(l, l2);
    for (let k = 1; k < 4; k++) {
      const x = f(Math.max(l, l2) + (span * (k - (i % 2 ? 0.5 : 0))) / 4);
      if (x > Math.max(l, l2) + 4 && x < Math.min(r, r2) - 4)
        courses += `<line x1="${x}" y1="${y}" x2="${x}" y2="${Math.min(y + 19, 488)}" stroke="url(#gold)" stroke-width="0.45" opacity="0.3"/>`;
    }
  }
  const win = (x, y, w = 7, h = 13) =>
    `<path d="M${x - w} ${y + h} V${y - 6} A${w} ${w} 0 0 1 ${x + w} ${y - 6} V${y + h} Z" fill="url(#ember)" stroke="url(#gold)" stroke-width="0.8" filter="url(#glow)"/>`;
  const flame = (x, h, lean) =>
    `<path d="M${x - 7} 197 C ${x - 12} ${197 - h * 0.45}, ${x + lean - 3} ${197 - h * 0.6}, ${x + lean} ${197 - h} C ${x + lean + 6} ${197 - h * 0.62}, ${x + 12} ${197 - h * 0.4}, ${x + 7} 197 Z" fill="url(#ember)" opacity="0.95" filter="url(#glow)"/>`;
  const shard = (x, y, s, rot) =>
    `<rect x="${f(x - s / 2)}" y="${f(y - s / 2)}" width="${s}" height="${f(s * 0.8)}" fill="url(#gold)" opacity="0.85" transform="rotate(${rot} ${x} ${y})"/>`;
  const spark = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFC27A" opacity="0.9" filter="url(#glow)"/>`;

  const art = `
    <circle cx="300" cy="104" r="190" fill="url(#emberHalo)"/>
    <path d="M382 118 C 372 96, 344 88, 328 100 C 318 78, 284 74, 270 92 C 256 80, 230 86, 228 104 C 214 104, 204 114, 206 128 L 382 128 Z" fill="#2A1220" stroke="url(#gold)" stroke-width="0.9" opacity="0.92"/>
    <path d="M18 150 C 30 128, 58 120, 76 130 C 86 106, 122 102, 136 120 C 150 102, 182 106, 188 126 C 200 122, 214 130, 214 144 L 214 156 L 18 156 Z" fill="#1E0F1A" stroke="url(#gold)" stroke-width="0.9" opacity="0.92"/>
    <g fill="none" stroke="url(#gold)" stroke-width="0.5" opacity="0.45">
      <path d="M44 146 C 58 134, 78 134, 88 142 M104 140 C 116 128, 140 128, 150 138 M300 110 C 312 100, 330 100, 340 108 M246 112 C 256 104, 272 104, 280 110"/>
    </g>
    <path d="M18 176 C 34 160, 60 160, 72 170 C 84 156, 110 158, 116 172 L 116 182 L 18 182 Z" fill="#170B14" stroke="url(#gold)" stroke-width="0.6" opacity="0.6"/>
    <path d="M382 160 C 368 146, 344 146, 334 156 C 322 144, 300 148, 296 162 L 296 170 L 382 170 Z" fill="#1A0C16" stroke="url(#gold)" stroke-width="0.6" opacity="0.6"/>
    <circle cx="200" cy="196" r="120" fill="url(#fireHalo)"/>
    <polygon points="150,488 250,488 232,214 168,214" fill="url(#stone)" stroke="url(#gold)" stroke-width="1.3"/>
    ${courses}
    <path d="M160 214 V196 H172 V204 H184 V196 H196 V204 H204 V196 H216 V204 H228 V196 H240 V214 Z" fill="url(#stone)" stroke="url(#gold)" stroke-width="1.1"/>
    ${win(200, 262)}${win(184, 338)}${win(216, 338)}${win(200, 410)}
    <path d="M189 488 V470 A11 11 0 0 1 211 470 V488 Z" fill="#090407" stroke="url(#gold)" stroke-width="1"/>
    ${flame(178, 30, -4)}${flame(200, 44, 3)}${flame(222, 28, 5)}
    <g transform="translate(142 152) rotate(-28)">
      <path d="M-22 10 L-26 -12 L-12 0 L0 -19 L12 0 L26 -12 L22 10 Z" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.8"/>
      <rect x="-23" y="10" width="46" height="7" rx="1.5" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.8"/>
      <circle cx="0" cy="-19" r="2.6" fill="#FFE3A3"/><circle cx="-26" cy="-12" r="2.2" fill="#FFE3A3"/><circle cx="26" cy="-12" r="2.2" fill="#FFE3A3"/>
      <circle cx="0" cy="13.5" r="2" fill="#C2321F"/>
    </g>
    <polygon points="336,82 300,128 317,131 268,172 287,175 222,210 262,166 245,162 283,125 266,121 305,82" fill="#FFE9B8" opacity="0.55" filter="url(#soft)"/>
    <polygon points="336,82 300,128 317,131 268,172 287,175 222,210 262,166 245,162 283,125 266,121 305,82" fill="url(#bolt)" stroke="#FFF6DC" stroke-width="0.8" stroke-linejoin="round" filter="url(#glow)"/>
    ${shard(124, 228, 7, 18)}${shard(108, 270, 6, -24)}${shard(96, 316, 5, 40)}${shard(136, 300, 4.5, 12)}
    ${shard(278, 238, 7, -16)}${shard(294, 280, 6, 30)}${shard(308, 326, 5, -40)}${shard(264, 304, 4.5, 8)}
    ${spark(116, 248, 1.8)}${spark(102, 292, 1.4)}${spark(286, 258, 1.8)}${spark(300, 302, 1.4)}${spark(150, 262, 1.2)}${spark(252, 266, 1.2)}
    <path d="M18 512 L18 480 L52 470 L86 484 L124 468 L150 488 L250 488 L272 466 L306 482 L342 468 L382 478 L382 512 Z" fill="#0B0609" stroke="url(#gold)" stroke-width="1"/>
    <path d="M40 496 L70 490 M300 494 L336 488" stroke="url(#gold)" stroke-width="0.5" opacity="0.4"/>`;

  return card({
    bg: { cx: 280, cy: 140, r: 520, stops: [[0, '#4C1422'], [0.3, '#2A0C1A'], [0.65, '#140914'], [1, '#07040A']] },
    extraDefs,
    art,
    texture: { light: 0.08, dark: 0.26 },
  });
}

/* ---------------------------------------------------------------------- XIX · Sun (light) */
export function sun() {
  const cx = 200;
  const cy = 214;
  const extraDefs = `
    <radialGradient id="sunHalo" cx="${cx}" cy="${cy}" r="110" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFF8E2" stop-opacity="0.95"/>
      <stop offset="0.6" stop-color="#FFE7A6" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#FFD27A" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sunDisc" cx="188" cy="198" r="80" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFFCF0"/>
      <stop offset="0.5" stop-color="#FBE2A0"/>
      <stop offset="1" stop-color="#E6A64A"/>
    </radialGradient>
    <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFF4D2" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#F6C86A" stop-opacity="0.15"/>
    </linearGradient>
    <linearGradient id="brick" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9A5F2C"/>
      <stop offset="1" stop-color="#5E3415"/>
    </linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4A2A12"/>
      <stop offset="1" stop-color="#1E1008"/>
    </linearGradient>
    <radialGradient id="petal" cx="0.5" cy="0.8" r="0.9">
      <stop offset="0" stop-color="#FFD866"/>
      <stop offset="1" stop-color="#E39A22"/>
    </radialGradient>`;

  let rays = '';
  for (let i = 0; i < 16; i++) {
    const a = i * 22.5;
    const len = i % 2 === 0 ? 182 : 154;
    const [x1, y1] = polar(cx, cy, 72, a - 4);
    const [x2, y2] = polar(cx, cy, 72, a + 4);
    const [tx, ty] = polar(cx, cy, len, a);
    rays += `<polygon points="${x1},${y1} ${tx},${ty} ${x2},${y2}" fill="url(#ray)" stroke="url(#gold)" stroke-width="0.7" stroke-linejoin="round"/>`;
  }
  let wavy = '';
  for (let i = 0; i < 16; i++) {
    const a = i * 22.5 + 11.25;
    let d = '';
    for (let r = 76; r <= 150; r += 3) {
      const off = Math.sin(((r - 76) / 74) * Math.PI * 3) * 4.5;
      const [px, py] = polar(cx, cy, r, a + (off * 57.3) / r);
      d += `${d ? ' L' : 'M'}${px} ${py}`;
    }
    wavy += `<path d="${d}" fill="none" stroke="url(#gold)" stroke-width="1.3" stroke-linecap="round" opacity="0.85"/>`;
  }
  let bricks = '';
  for (let row = 0; row < 3; row++) {
    const y = 402 + row * 15;
    bricks += `<line x1="18" y1="${y}" x2="382" y2="${y}" stroke="#3E2210" stroke-width="0.9"/>`;
    for (let x = 18 + (row % 2 ? 17 : 0); x < 382; x += 34)
      bricks += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 15}" stroke="#3E2210" stroke-width="0.9"/>`;
  }
  const flower = (x, y, r, stemTop = 400) => {
    let petals = '';
    for (let i = 0; i < 18; i++) {
      petals += `<ellipse cx="${x}" cy="${f(y - r * 0.92)}" rx="${f(r * 0.2)}" ry="${f(r * 0.48)}" fill="url(#petal)" stroke="#9A5E18" stroke-width="0.5" transform="rotate(${i * 20} ${x} ${y})"/>`;
    }
    let seeds = '';
    for (let i = 0; i < 14; i++) {
      const [sx, sy] = polar(x, y, r * 0.32 * Math.sqrt((i + 0.5) / 14), i * 137.5);
      seeds += `<circle cx="${sx}" cy="${sy}" r="${f(r * 0.045)}" fill="#E8B04A" opacity="0.7"/>`;
    }
    return `
      <path d="M${x} ${stemTop} C ${x - 3} ${f((stemTop + y) / 2)}, ${x + 3} ${f((stemTop + y) / 2)}, ${x} ${y}" stroke="#5E6526" stroke-width="3" fill="none"/>
      <path d="M${x} ${f(y + r + 14)} C ${x + 10} ${f(y + r + 2)}, ${x + 24} ${f(y + r + 6)}, ${x + 26} ${f(y + r + 16)} C ${x + 16} ${f(y + r + 20)}, ${x + 6} ${f(y + r + 18)}, ${x} ${f(y + r + 14)} Z" fill="#76782E" stroke="#4A4A1A" stroke-width="0.6"/>
      ${petals}
      <circle cx="${x}" cy="${y}" r="${f(r * 0.5)}" fill="#4A2810" stroke="#2E1808" stroke-width="0.8"/>
      ${seeds}`;
  };

  const art = `
    ${rays}
    ${wavy}
    <circle cx="${cx}" cy="${cy}" r="110" fill="url(#sunHalo)"/>
    <circle cx="${cx}" cy="${cy}" r="64" fill="url(#sunDisc)" stroke="url(#gold)" stroke-width="2" filter="url(#glow)"/>
    <circle cx="${cx}" cy="${cy}" r="52" fill="none" stroke="#B07A2E" stroke-width="0.8" opacity="0.55"/>
    <circle cx="${cx}" cy="${cy}" r="44" fill="none" stroke="#B07A2E" stroke-width="0.9" stroke-dasharray="1.6 4.6" opacity="0.6"/>
    <polygon points="${starPoints(cx, cy, 20, 8, 8)}" fill="#E8B04A" stroke="#9A6A24" stroke-width="0.8" opacity="0.85"/>
    <circle cx="${cx}" cy="${cy}" r="5" fill="#FFF8E4"/>
    ${sparkle(86, 118, 5, 'fill="#FFF4D2"')}${sparkle(320, 104, 6, 'fill="#FFF4D2"')}${sparkle(332, 300, 3.6, 'fill="#FFF4D2"')}${sparkle(66, 286, 3.4, 'fill="#FFF4D2"')}${sparkle(268, 90, 3, 'fill="#FFF4D2"')}
    ${flower(90, 356, 21)}${flower(148, 336, 26)}${flower(254, 340, 25)}${flower(312, 360, 20)}
    <rect x="18" y="394" width="364" height="9" fill="#B07438" stroke="url(#gold)" stroke-width="1"/>
    <rect x="18" y="402" width="364" height="45" fill="url(#brick)"/>
    ${bricks}
    <line x1="18" y1="447" x2="382" y2="447" stroke="url(#gold)" stroke-width="0.9"/>
    <rect x="18" y="447" width="364" height="70" fill="url(#ground)"/>
    <path d="M18 470 Q120 458 200 466 T382 462" fill="none" stroke="url(#gold)" stroke-width="0.6" opacity="0.4"/>
    <path d="M18 490 Q140 480 220 488 T382 484" fill="none" stroke="url(#gold)" stroke-width="0.5" opacity="0.25"/>
    ${[34, 72, 118, 166, 214, 262, 304, 350]
      .map(
        (x, i) =>
          `<path d="M${x} ${458 + (i % 3) * 5} q-3 -9 -7 -12 M${x} ${458 + (i % 3) * 5} q1 -11 0 -15 M${x} ${458 + (i % 3) * 5} q4 -8 8 -10" fill="none" stroke="#A9A04A" stroke-width="1" stroke-linecap="round" opacity="0.7"/>`,
      )
      .join('')}
    ${[[96, 478], [186, 474], [276, 480], [340, 470]].map(([x, y]) => sparkle(x, y, 2.6, 'fill="#F6D58A" opacity="0.7"')).join('')}`;

  return card({
    bg: { cx, cy, r: 400, stops: [[0, '#FFF1C9'], [0.2, '#F4C76A'], [0.42, '#C98A35'], [0.7, '#6A3A15'], [1, '#26140A']] },
    extraDefs,
    art,
    texture: { light: 0.05, dark: 0.08 },
  });
}

/* --------------------------------------------------------------------------- Card back */
function backSigil(cx, cy, s = 1) {
  const R = (n) => f(n * s);
  let rays = '';
  for (let i = 0; i < 72; i++) {
    const long = i % 2 === 0;
    const [x1, y1] = polar(cx, cy, R(120), i * 5);
    const [x2, y2] = polar(cx, cy, R(long ? 172 : 148), i * 5);
    rays += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="url(#gold)" stroke-width="${long ? 0.7 : 0.45}" opacity="${long ? 0.55 : 0.35}"/>`;
  }
  let dots = '';
  for (let i = 0; i < 24; i++) {
    const [x, y] = polar(cx, cy, R(126), i * 15 + 7.5);
    dots += `<circle cx="${x}" cy="${y}" r="${R(1.5)}" fill="url(#gold)"/>`;
  }
  return `
    <circle cx="${cx}" cy="${cy}" r="${R(176)}" fill="url(#sigilHalo)"/>
    ${rays}
    ${dots}
    <circle cx="${cx}" cy="${cy}" r="${R(114)}" fill="none" stroke="url(#gold)" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="${R(109)}" fill="none" stroke="url(#gold)" stroke-width="0.8" stroke-dasharray="1.2 4.4"/>
    <circle cx="${cx}" cy="${cy}" r="${R(104)}" fill="#0F0C22" fill-opacity="0.6" stroke="url(#gold)" stroke-width="0.6"/>
    <polygon points="${starPoints(cx, cy, R(96), R(40), 8)}" fill="url(#starFill)" stroke="url(#gold)" stroke-width="1.3" stroke-linejoin="round"/>
    <polygon points="${starPoints(cx, cy, R(70), R(46), 8, 22.5)}" fill="none" stroke="url(#gold)" stroke-width="0.5" opacity="0.4"/>
    <circle cx="${cx}" cy="${cy}" r="${R(36)}" fill="#0E0B1E" stroke="url(#gold)" stroke-width="1.3"/>
    <circle cx="${cx}" cy="${cy}" r="${R(30)}" fill="none" stroke="url(#gold)" stroke-width="0.5" opacity="0.7"/>
    ${sparkle(cx, cy, R(24))}
    <circle cx="${cx}" cy="${cy}" r="${R(3.4)}" fill="#FFF4D8"/>`;
}

const sigilDefs = `
    <radialGradient id="sigilHalo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#6B5BB8" stop-opacity="0.35"/>
      <stop offset="0.6" stop-color="#3B2F78" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#1B1640" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="starFill" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#3D3280"/>
      <stop offset="1" stop-color="#1A153A"/>
    </radialGradient>
    <pattern id="lattice" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <path d="M0 0 H22 M0 0 V22" stroke="#D8B879" stroke-width="0.5" opacity="0.09"/>
    </pattern>`;

function moonRow(y, flip) {
  const xs = [138, 169, 200, 231, 262];
  const shapes = [
    `<path d="${crescentPath(xs[0], y, 8, 'left', 1.28)}" fill="url(#gold)"/>`,
    `<path d="M${xs[1]} ${y - 8} A8 8 0 0 0 ${xs[1]} ${y + 8} Z" fill="url(#gold)"/><circle cx="${xs[1]}" cy="${y}" r="8" fill="none" stroke="url(#gold)" stroke-width="0.8"/>`,
    `<circle cx="${xs[2]}" cy="${y}" r="8.5" fill="url(#gold)"/>`,
    `<path d="M${xs[3]} ${y - 8} A8 8 0 0 1 ${xs[3]} ${y + 8} Z" fill="url(#gold)"/><circle cx="${xs[3]}" cy="${y}" r="8" fill="none" stroke="url(#gold)" stroke-width="0.8"/>`,
    `<path d="${crescentPath(xs[4], y, 8, 'right', 1.28)}" fill="url(#gold)"/>`,
  ].join('');
  const line = `<line x1="104" y1="${y}" x2="124" y2="${y}" stroke="url(#gold)" stroke-width="0.7"/><line x1="276" y1="${y}" x2="296" y2="${y}" stroke="url(#gold)" stroke-width="0.7"/>`;
  return `<g ${flip ? `transform="rotate(180 200 ${y})"` : ''}>${shapes}${line}</g>`;
}

export function back() {
  const art = `
    <rect width="${W}" height="${H}" fill="url(#lattice)"/>
    <rect x="30" y="30" width="340" height="540" rx="6" fill="none" stroke="url(#gold)" stroke-width="0.6" opacity="0.7"/>
    ${moonRow(92, false)}
    ${moonRow(508, true)}
    ${backSigil(200, 300)}
    ${[
      [60, 66],
      [340, 66],
      [60, 534],
      [340, 534],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="none" stroke="url(#gold)" stroke-width="0.6" opacity="0.8"/>${sparkle(x, y, 7)}`)
      .join('')}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  ${baseDefs({ bg: { cx: 200, cy: 300, r: 400, stops: [[0, '#2C2558'], [0.5, '#17132F'], [1, '#0A0918']] }, extra: sigilDefs })}
  <g clip-path="url(#outer)">
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <g clip-path="url(#inner)">${art}</g>
    ${texture({ light: 0.08, dark: 0.2 })}
    ${frame({ medallion: false, plaque: false })}
  </g>
</svg>`;
}

/* ----------------------------------------------------------------------------- App icon */
/** variant: 'full' (square, with background) | 'round' | 'foreground' (adaptive, transparent). */
export function appIcon(variant = 'full') {
  const S = 512;
  const c = S / 2;
  const scale = variant === 'foreground' ? 1.05 : 1.32;
  const bgFill =
    variant === 'foreground'
      ? ''
      : variant === 'round'
        ? `<circle cx="${c}" cy="${c}" r="${c}" fill="url(#bg)"/>`
        : `<rect width="${S}" height="${S}" fill="url(#bg)"/>`;
  const defs = baseDefs({
    bg: { cx: c, cy: c * 0.9, r: S * 0.75, stops: [[0, '#2C2558'], [0.55, '#151130'], [1, '#0A0918']] },
    extra: sigilDefs,
  });
  const tex = variant === 'foreground' ? '' : `<rect width="${S}" height="${S}" filter="url(#grainLight)" opacity="0.07"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">
  ${defs}
  ${bgFill}
  <g ${variant === 'round' ? `clip-path="url(#roundClip)"` : ''}>${tex}</g>
  <defs><clipPath id="roundClip"><circle cx="${c}" cy="${c}" r="${c}"/></clipPath></defs>
  <g transform="translate(${c} ${c}) scale(${scale}) translate(-200 -300)">
    <circle cx="200" cy="300" r="114" fill="none" stroke="url(#gold)" stroke-width="3"/>
    <circle cx="200" cy="300" r="104" fill="#0F0C22" fill-opacity="0.7" stroke="url(#gold)" stroke-width="1.2"/>
    <polygon points="${starPoints(200, 300, 96, 40, 8)}" fill="url(#starFill)" stroke="url(#gold)" stroke-width="2.4" stroke-linejoin="round"/>
    <circle cx="200" cy="300" r="36" fill="#0E0B1E" stroke="url(#gold)" stroke-width="2.4"/>
    ${sparkle(200, 300, 26)}
    <circle cx="200" cy="300" r="4" fill="#FFF4D8"/>
  </g>
</svg>`;
}

/** Tileable paper grain for the UI background. */
export function grainTile() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <filter id="g" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="5" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.96  0 0 0 0 0.91  0 0 0 0 0.84  2.4 0 0 0 -1.25"/>
  </filter>
  <rect width="256" height="256" filter="url(#g)"/>
</svg>`;
}

export { H };
