// Original illustrations for the "Nocturne" deck: 0, I, III, IV, V, VI, VII.
// Symbolic still-lifes without figures, traditional major-arcana symbolism, own composition.
import { f, polar, crescentPath, starPoints, card } from './lib.mjs';
import { radial, linear, starDots, rays, ridge, cloud, rose, blossom, leaf, chalice, infinity, spiral, smallStar, tower, sparkles } from './motifs.mjs';

const WARM = 'fill="#FFF4D2"';

/* ------------------------------------------------------------------------ 0 · Fool (light) */
export function fool() {
  const sx = 286;
  const sy = 150;
  const extraDefs = `
    ${radial('sunHalo', sx, sy, 150, [[0, '#FFF9E8', 0.95], [0.35, '#FFE2A8', 0.45], [1, '#F2A97A', 0]])}
    ${radial('sunDisc', sx - 8, sy - 10, 50, [[0, '#FFFDF4'], [0.6, '#FFE6A8'], [1, '#F0B060']])}
    ${linear('cliff', [[0, '#5A3A26'], [1, '#1E120A']])}
    ${linear('abyss', [[0, '#6B5A8E', 0], [1, '#241C3C', 0.92]])}
    ${linear('mist', [[0, '#FFFFFF', 0], [0.5, '#FFF2E6', 0.55], [1, '#FFFFFF', 0]], 'h')}
    ${linear('bundle', [[0, '#D0606A'], [1, '#7A2232']])}
    ${linear('far', [[0, '#B49AC0'], [1, '#7A6694']])}
    ${linear('mid', [[0, '#7A6498'], [1, '#43355E']])}`;

  const surface = (x) => f(372 + (x - 18) * 0.075);
  const tufts = [40, 64, 92, 170, 196, 226, 248]
    .map((x) => {
      const y = surface(x);
      return `<path d="M${x} ${y} q-3 -8 -6 -10 M${x} ${y} q1 -10 0 -13 M${x} ${y} q4 -7 7 -9" fill="none" stroke="#B8A85A" stroke-width="1" stroke-linecap="round" opacity="0.8"/>`;
    })
    .join('');

  const art = `
    ${starDots(7, 22, 30, 70, 200, 220, { maxR: 1 })}
    ${rays(sx, sy, 46, 150, 32, { alt: 44, opacity: 0.5, width: 0.8 })}
    <circle cx="${sx}" cy="${sy}" r="150" fill="url(#sunHalo)"/>
    <circle cx="${sx}" cy="${sy}" r="36" fill="url(#sunDisc)" stroke="url(#gold)" stroke-width="1.6" filter="url(#glow)"/>
    <circle cx="${sx}" cy="${sy}" r="28" fill="none" stroke="#C88A3A" stroke-width="0.7" stroke-dasharray="1.4 4" opacity="0.6"/>
    <path d="M108 152 q6 -6 12 0 q6 -6 12 0 M136 138 q5 -5 10 0 q5 -5 10 0" fill="none" stroke="#5A4060" stroke-width="1.1" stroke-linecap="round" opacity="0.7"/>
    ${ridge([[18, 318], [60, 292], [100, 306], [150, 262], [200, 292], [240, 256], [290, 296], [340, 270], [382, 290]], { fill: 'url(#far)', opacity: 0.85, sw: 0.7 })}
    <path d="M150 262 l-10 12 l8 -2 l6 6 l6 -8 z M240 256 l-9 11 l7 -1 l5 6 l6 -9 z" fill="#F4EEF8" opacity="0.7"/>
    ${ridge([[18, 352], [80, 326], [130, 342], [190, 310], [250, 346], [310, 320], [382, 344]], { fill: 'url(#mid)', sw: 0.8 })}
    <rect x="18" y="330" width="364" height="44" fill="url(#mist)" filter="url(#soft)" opacity="0.9"/>
    <rect x="18" y="360" width="364" height="160" fill="url(#abyss)"/>
    <path d="M18 372 C 70 368, 130 374, 190 380 C 225 383, 250 388, 270 394 L 262 410 L 276 432 L 258 458 L 270 488 L 252 520 L 18 520 Z" fill="url(#cliff)" stroke="url(#gold)" stroke-width="1.1"/>
    <path d="M30 410 C 90 404, 160 414, 240 420 M26 448 C 90 440, 170 452, 250 458 M40 486 C 100 480, 170 488, 240 494" fill="none" stroke="url(#gold)" stroke-width="0.5" opacity="0.3"/>
    ${tufts}
    <line x1="148" y1="378" x2="210" y2="236" stroke="url(#goldV)" stroke-width="4" stroke-linecap="round"/>
    <line x1="148" y1="378" x2="210" y2="236" stroke="#5B3F22" stroke-width="0.6" opacity="0.6"/>
    <path d="M212 236 C 238 228, 250 252, 240 266 C 230 280, 208 274, 205 258 C 203 247, 206 240, 212 236 Z" fill="url(#bundle)" stroke="url(#gold)" stroke-width="1"/>
    <g fill="#F2C46A" opacity="0.8"><circle cx="222" cy="250" r="1.6"/><circle cx="231" cy="259" r="1.6"/><circle cx="216" cy="262" r="1.6"/><circle cx="232" cy="245" r="1.3"/></g>
    <circle cx="211" cy="237" r="3.2" fill="url(#gold)"/>
    <path d="M100 386 C 98 376, 102 366, 98 354" fill="none" stroke="#5E6526" stroke-width="2"/>
    ${leaf(92, 372, 14, 4, -30, '#6E7A30')}${leaf(106, 366, 12, 3.5, 30, '#6E7A30')}
    ${rose(98, 350, 10)}
    <g transform="translate(134 318)">
      <path d="M0 0 C -8 -10, -16 -4, -10 4 C -6 8, -2 4, 0 0 Z M0 0 C 8 -10, 16 -4, 10 4 C 6 8, 2 4, 0 0 Z" fill="#F7E9C8" stroke="url(#gold)" stroke-width="0.6"/>
      <line x1="0" y1="-3" x2="0" y2="4" stroke="#5B3F22" stroke-width="1"/>
    </g>
    ${sparkles([[78, 112, 4.5], [182, 96, 3.2], [348, 232, 3.6], [52, 236, 3], [330, 84, 2.6]], WARM)}`;

  return card({
    bg: { cx: sx, cy: sy, r: 480, stops: [[0, '#FFF0D2'], [0.22, '#F6C796'], [0.45, '#D08E8A'], [0.7, '#5E4A7C'], [1, '#1C1730']] },
    extraDefs,
    art,
    texture: { light: 0.05, dark: 0.08 },
  });
}

/* -------------------------------------------------------------------- I · Magician (light) */
export function magician() {
  const extraDefs = `
    ${radial('aura', 200, 200, 190, [[0, '#FFF4D6', 0.85], [0.4, '#FFC870', 0.35], [1, '#E0702E', 0]])}
    ${linear('cloth', [[0, '#A0222F'], [1, '#4A0C18']])}
    ${linear('tableTop', [[0, '#E8C27A'], [1, '#8A5E28']])}
    ${linear('blade', [[0, '#F4F2F8'], [1, '#9EA4B8']], 'h')}
    ${radial('coin', 156, 328, 20, [[0, '#FFF0C0'], [1, '#B8862E']])}
    ${radial('tip', 200, 150, 26, [[0, '#FFFFFF'], [0.35, '#FFF2C8', 0.9], [1, '#FFD27A', 0]])}
    ${linear('ground', [[0, '#3A2214'], [1, '#160C06']])}`;

  const redRose = { fill: '#C83A4A', center: '#F2C46A', stroke: '#6A1A22', leaf: '#4E5A22' };
  const vine = (flip) => `
    <g ${flip ? 'transform="translate(400 0) scale(-1 1)"' : ''}>
      <path d="M18 84 C 50 90, 70 110, 66 150 C 64 176, 48 196, 40 214" fill="none" stroke="#4E5A22" stroke-width="2"/>
      ${leaf(46, 96, 16, 5, 20, '#5E6A2A')}${leaf(68, 128, 16, 5, 70, '#5E6A2A')}${leaf(56, 178, 14, 4, 110, '#5E6A2A')}
      ${rose(34, 92, 9, redRose)}${rose(66, 112, 10, redRose)}${rose(58, 162, 8, redRose)}${rose(40, 212, 7, redRose)}
    </g>`;
  const lily = (x, y, s = 1) => {
    let petals = '';
    for (let i = 0; i < 6; i++) petals += leaf(...polar(x, y, 7 * s, i * 60), 14 * s, 4 * s, i * 60 - 90, '#FBF6EE');
    return `<path d="M${x} 520 C ${x - 3} ${y + 20}, ${x + 3} ${y + 10}, ${x} ${y}" fill="none" stroke="#5E6526" stroke-width="2"/>${leaf(x - 8, y + 26, 18, 4, -50)}${petals}<circle cx="${x}" cy="${y}" r="${f(2.6 * s)}" fill="#E9B44C"/>`;
  };

  const art = `
    <circle cx="200" cy="200" r="190" fill="url(#aura)"/>
    ${rays(200, 150, 26, 130, 24, { alt: 34, opacity: 0.45 })}
    ${infinity(200, 102, 34, 15, 'fill="none" stroke="#7A3A12" stroke-width="5.4" opacity="0.55"')}
    ${infinity(200, 102, 34, 15, 'fill="none" stroke="#FFF0C4" stroke-width="2.8" filter="url(#glow)"')}
    ${vine(false)}${vine(true)}
    <circle cx="200" cy="150" r="26" fill="url(#tip)"/>
    <rect x="195" y="154" width="10" height="166" rx="5" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.8"/>
    <path d="M195 178 H205 M195 296 H205" stroke="#5B3F22" stroke-width="1"/>
    <circle cx="200" cy="150" r="7" fill="#FFFFFF" filter="url(#glow)"/>
    <circle cx="200" cy="322" r="6" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.8"/>
    <rect x="62" y="350" width="276" height="10" fill="url(#tableTop)" stroke="url(#gold)" stroke-width="1"/>
    <path d="M66 360 H334 V470 H66 Z" fill="url(#cloth)" stroke="url(#gold)" stroke-width="1"/>
    <line x1="66" y1="374" x2="334" y2="374" stroke="url(#gold)" stroke-width="1.2" opacity="0.8"/>
    ${[110, 155, 200, 245, 290].map((x) => `<path d="M${x} 378 C ${x - 4} 410, ${x + 4} 440, ${x} 470" fill="none" stroke="#2A0610" stroke-width="1" opacity="0.5"/>`).join('')}
    ${sparkles([[132, 420, 4], [200, 430, 5], [268, 420, 4]], 'fill="url(#gold)" opacity="0.75"')}
    ${chalice(104, 298, 0.95)}
    <circle cx="156" cy="334" r="16" fill="url(#coin)" stroke="url(#gold)" stroke-width="1"/>
    <circle cx="156" cy="334" r="12" fill="none" stroke="#7A5418" stroke-width="0.7"/>
    <polygon points="${starPoints(156, 334, 10, 4, 5)}" fill="none" stroke="#7A5418" stroke-width="1"/>
    <path d="M250 266 L255 280 V330 H245 V280 Z" fill="url(#blade)" stroke="#5A5E78" stroke-width="0.8"/>
    <line x1="250" y1="280" x2="250" y2="328" stroke="#8A90A8" stroke-width="0.7"/>
    <rect x="234" y="330" width="32" height="5" rx="2" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.6"/>
    <rect x="247" y="335" width="6" height="10" fill="#5A2E1A"/>
    <circle cx="250" cy="347" r="3.4" fill="url(#goldV)"/>
    <rect x="292" y="298" width="8" height="52" rx="3" fill="#8A5A2E" stroke="url(#gold)" stroke-width="0.7"/>
    ${leaf(302, 300, 12, 3.5, -40, '#7A8A34')}${leaf(290, 306, 10, 3, 220, '#7A8A34')}
    <rect x="18" y="470" width="364" height="50" fill="url(#ground)"/>
    <line x1="18" y1="470" x2="382" y2="470" stroke="url(#gold)" stroke-width="0.9"/>
    ${lily(48, 478)}${lily(352, 478)}${lily(196, 488, 0.9)}
    ${rose(96, 492, 10, redRose)}${rose(142, 486, 9, redRose)}${rose(252, 488, 9, redRose)}${rose(306, 494, 10, redRose)}
    ${sparkles([[132, 192, 4], [268, 186, 4], [318, 250, 3], [86, 254, 3]], WARM)}`;

  return card({
    bg: { cx: 200, cy: 200, r: 460, stops: [[0, '#F9DFA6'], [0.25, '#E0A050'], [0.5, '#9A4A2A'], [0.75, '#4A1A1E'], [1, '#1A0A0E']] },
    extraDefs,
    art,
    texture: { light: 0.06, dark: 0.1 },
  });
}

/* --------------------------------------------------------------------- III · Empress (light) */
export function empress() {
  const extraDefs = `
    ${radial('halo', 200, 220, 190, [[0, '#FFF8DA', 0.9], [0.45, '#F6DC8A', 0.35], [1, '#C8A040', 0]])}
    ${linear('field', [[0, '#C79A3A'], [1, '#5A3E12']])}
    ${linear('hillFar', [[0, '#9AA64E'], [1, '#56622A']])}
    ${linear('shield', [[0, '#F6E6B0'], [1, '#B88E3E']])}
    ${linear('fall', [[0, '#F4FAFF', 0.95], [1, '#A8C8E0', 0.7]])}
    ${linear('cypress', [[0, '#40602C'], [1, '#18280E']])}`;

  const cypress = (x, top, bottom, w = 15) =>
    `<path d="M${x} ${top} C ${x + w} ${top + 60}, ${x + w} ${bottom - 30}, ${x} ${bottom} C ${x - w} ${bottom - 30}, ${x - w} ${top + 60}, ${x} ${top} Z" fill="url(#cypress)" stroke="url(#gold)" stroke-width="0.6"/>`;
  let crown = `<circle cx="200" cy="158" r="56" fill="none" stroke="url(#gold)" stroke-width="0.6" stroke-dasharray="1.2 4" opacity="0.7"/>`;
  for (let i = 0; i < 12; i++) {
    const [x, y] = polar(200, 158, 56, i * 30);
    crown += `<polygon points="${starPoints(x, y, 7.5, 3.2, 6)}" fill="#FFF2C8" stroke="#8A6420" stroke-width="0.8" filter="url(#glow)"/>`;
  }
  let wheat = '';
  const stalk = (x, top, lean, scale, op) => {
    let grains = '';
    for (let k = 0; k < 6; k++) {
      const gy = top + k * 4.2 * scale;
      const gx = x + lean * (1 - k / 8);
      grains += `<ellipse cx="${f(gx - 2.4 * scale)}" cy="${f(gy)}" rx="${f(1.6 * scale)}" ry="${f(3.4 * scale)}" fill="#F2CF6E" transform="rotate(-24 ${f(gx - 2.4 * scale)} ${f(gy)})"/>`;
      grains += `<ellipse cx="${f(gx + 2.4 * scale)}" cy="${f(gy)}" rx="${f(1.6 * scale)}" ry="${f(3.4 * scale)}" fill="#E2B652" transform="rotate(24 ${f(gx + 2.4 * scale)} ${f(gy)})"/>`;
    }
    return `<g opacity="${op}"><path d="M${x} 520 Q ${f(x + lean * 0.4)} ${f((520 + top) / 2)} ${f(x + lean)} ${top}" fill="none" stroke="#B8903C" stroke-width="${f(1.2 * scale)}"/>${grains}</g>`;
  };
  for (let i = 0; i < 26; i++) wheat += stalk(f(24 + i * 14 + ((i * 7) % 5)), 400 + ((i * 13) % 14), ((i % 3) - 1) * 4, 0.8, 0.75);
  for (let i = 0; i < 18; i++) wheat += stalk(f(30 + i * 20 + ((i * 11) % 7)), 432 + ((i * 17) % 18), ((i % 4) - 1.5) * 4, 1.15, 1);

  const art = `
    <circle cx="200" cy="220" r="190" fill="url(#halo)"/>
    ${crown}
    ${ridge([[18, 330], [70, 302], [130, 318], [190, 292], [250, 310], [310, 288], [382, 312]], { fill: 'url(#hillFar)', sw: 0.8 })}
    <path d="M268 300 H312 L306 312 H274 Z" fill="#5A6A2A" stroke="url(#gold)" stroke-width="0.7"/>
    <rect x="280" y="310" width="20" height="82" fill="url(#fall)"/>
    ${[284, 290, 296].map((x) => `<line x1="${x}" y1="312" x2="${x}" y2="390" stroke="#FFFFFF" stroke-width="0.7" opacity="0.7"/>`).join('')}
    <ellipse cx="290" cy="392" rx="26" ry="6" fill="#DDEBF4" opacity="0.8" stroke="url(#gold)" stroke-width="0.6"/>
    ${cypress(46, 222, 400)}${cypress(76, 250, 400, 12)}${cypress(334, 226, 400)}${cypress(362, 252, 400, 12)}
    <path d="M200 344 C 148 308, 138 272, 156 252 C 172 236, 192 242, 200 260 C 208 242, 228 236, 244 252 C 262 272, 252 308, 200 344 Z" fill="url(#shield)" stroke="url(#gold)" stroke-width="1.8" filter="url(#glow)"/>
    <path d="M200 332 C 156 302, 150 274, 163 259 C 175 247, 191 252, 200 268 C 209 252, 225 247, 237 259 C 250 274, 244 302, 200 332 Z" fill="none" stroke="#9A7430" stroke-width="0.7"/>
    <circle cx="200" cy="280" r="12" fill="none" stroke="#6A4A18" stroke-width="3"/>
    <path d="M200 292 V318 M190 305 H210" stroke="#6A4A18" stroke-width="3" stroke-linecap="round"/>
    <rect x="18" y="392" width="364" height="128" fill="url(#field)"/>
    <line x1="18" y1="392" x2="382" y2="392" stroke="url(#gold)" stroke-width="0.8"/>
    ${wheat}
    ${sparkles([[96, 132, 4], [306, 128, 4.5], [70, 300, 3], [336, 196, 3]], WARM)}`;

  return card({
    bg: { cx: 200, cy: 220, r: 460, stops: [[0, '#FBEFC4'], [0.25, '#D9C070'], [0.5, '#7E8A3A'], [0.78, '#2E3818'], [1, '#10140A']] },
    extraDefs,
    art,
    texture: { light: 0.05, dark: 0.1 },
  });
}

/* ------------------------------------------------------------------- IV · Emperor (twilight) */
export function emperor() {
  const extraDefs = `
    ${radial('dusk', 200, 300, 230, [[0, '#FFC07A', 0.75], [0.4, '#E0703A', 0.3], [1, '#8A2A2A', 0]])}
    ${linear('mtn', [[0, '#7A2E2A'], [1, '#2A0E14']])}
    ${linear('mtnFar', [[0, '#B8583E'], [1, '#5A1E22']])}
    ${linear('throne', [[0, '#4A4A60'], [0.5, '#8A8AA2'], [1, '#3A3A50']], 'h')}
    ${linear('throneTop', [[0, '#B8B8CC'], [1, '#5A5A70']])}
    ${radial('orb', 164, 352, 18, [[0, '#FFF0C0'], [1, '#A8782A']])}`;

  const ramEnd = (x, dir) => `${spiral(x, 334, 1.4, 2, 11, { rot: dir > 0 ? 90 : 270, dir, sw: 1.8 })}`;
  const art = `
    <circle cx="200" cy="300" r="230" fill="url(#dusk)"/>
    ${ridge([[18, 300], [60, 238], [90, 268], [130, 196], [170, 258], [200, 228], [240, 268], [280, 186], [320, 248], [350, 218], [382, 276]], { fill: 'url(#mtnFar)', sw: 0.8 })}
    <path d="M130 196 l-10 16 l8 -3 l4 7 l6 -12 z M280 186 l-10 16 l8 -3 l5 7 l6 -12 z" fill="#F4D8C0" opacity="0.6"/>
    ${ridge([[18, 384], [50, 330], [80, 352], [112, 298], [150, 372], [250, 372], [290, 306], [320, 344], [352, 318], [382, 372]], { fill: 'url(#mtn)' })}
    <path d="M144 400 V196 H256 V400 Z" fill="url(#throne)" stroke="url(#gold)" stroke-width="1.3"/>
    <rect x="152" y="206" width="96" height="120" fill="none" stroke="url(#gold)" stroke-width="0.6" opacity="0.7"/>
    <rect x="134" y="182" width="132" height="14" fill="url(#throneTop)" stroke="url(#gold)" stroke-width="1.1"/>
    ${spiral(144, 172, 1.5, 2, 12, { rot: 270, dir: -1, sw: 1.8 })}${spiral(256, 172, 1.5, 2, 12, { rot: 90, dir: 1, sw: 1.8 })}
    <path d="M188 236 Q200 230 212 236 L207 270 Q200 278 193 270 Z" fill="#C8C8D8" stroke="url(#gold)" stroke-width="1"/>
    ${spiral(182, 244, 1.3, 2.5, 13, { rot: 180, dir: -1, sw: 2.2 })}${spiral(218, 244, 1.3, 2.5, 13, { rot: 180, dir: 1, sw: 2.2 })}
    <circle cx="196" cy="248" r="1.4" fill="#2A2A3A"/><circle cx="204" cy="248" r="1.4" fill="#2A2A3A"/>
    <rect x="118" y="330" width="26" height="70" fill="url(#throne)" stroke="url(#gold)" stroke-width="1"/>
    <rect x="256" y="330" width="26" height="70" fill="url(#throne)" stroke="url(#gold)" stroke-width="1"/>
    ${ramEnd(131, -1)}${ramEnd(269, 1)}
    <rect x="126" y="370" width="148" height="30" fill="url(#throneTop)" stroke="url(#gold)" stroke-width="1"/>
    <rect x="112" y="400" width="176" height="52" fill="url(#throne)" stroke="url(#gold)" stroke-width="1.2"/>
    <rect x="124" y="410" width="152" height="32" fill="none" stroke="url(#gold)" stroke-width="0.6" opacity="0.7"/>
    ${spiral(200, 426, 1.2, 2, 9, { sw: 1.2 })}
    <rect x="96" y="452" width="208" height="18" fill="url(#throneTop)" stroke="url(#gold)" stroke-width="1"/>
    <line x1="164" y1="337" x2="164" y2="326" stroke="url(#gold)" stroke-width="2"/>
    <line x1="159" y1="330" x2="169" y2="330" stroke="url(#gold)" stroke-width="2"/>
    <circle cx="164" cy="354" r="15" fill="url(#orb)" stroke="url(#gold)" stroke-width="1"/>
    <path d="M149 354 H179 M164 339 V369" stroke="#7A5418" stroke-width="0.8" opacity="0.8"/>
    <line x1="232" y1="368" x2="236" y2="252" stroke="url(#goldV)" stroke-width="4.4" stroke-linecap="round"/>
    <ellipse cx="236" cy="238" rx="8" ry="11" fill="none" stroke="url(#gold)" stroke-width="3.2"/>
    <line x1="224" y1="253" x2="248" y2="253" stroke="url(#gold)" stroke-width="3.2" stroke-linecap="round"/>
    <rect x="18" y="470" width="364" height="50" fill="#1E0E12"/>
    <line x1="18" y1="470" x2="382" y2="470" stroke="url(#gold)" stroke-width="0.9"/>
    <path d="M40 492 L120 486 M280 488 L360 494" stroke="url(#gold)" stroke-width="0.5" opacity="0.4"/>
    ${sparkles([[74, 112, 3.6], [330, 120, 4], [110, 160, 2.6], [300, 92, 2.6]], WARM)}`;

  return card({
    bg: { cx: 200, cy: 280, r: 480, stops: [[0, '#F2A066'], [0.3, '#B24A30'], [0.6, '#4E1A26'], [1, '#120810']] },
    extraDefs,
    art,
    texture: { light: 0.06, dark: 0.16 },
  });
}

/* --------------------------------------------------------------- V · Hierophant (twilight) */
export function hierophant() {
  const extraDefs = `
    ${radial('nave', 200, 200, 180, [[0, '#F2E6FF', 0.7], [0.45, '#B49AE0', 0.25], [1, '#5A3E9A', 0]])}
    ${linear('pillar', [[0, '#2E2844'], [0.5, '#6A6288'], [1, '#221E36']], 'h')}
    ${linear('silver', [[0, '#F4F4FA'], [1, '#8A8EA6']])}
    ${linear('dais', [[0, '#5A5078'], [1, '#2A2440']])}`;

  const pillar = (x) => `
    <rect x="${x}" y="150" width="44" height="320" fill="url(#pillar)" stroke="url(#gold)" stroke-width="1.1"/>
    ${[10, 22, 34].map((dx) => `<line x1="${x + dx}" y1="158" x2="${x + dx}" y2="464" stroke="url(#gold)" stroke-width="0.5" opacity="0.35"/>`).join('')}
    <path d="M${x - 6} 150 H${x + 50} L${x + 44} 138 H${x} Z" fill="url(#pillar)" stroke="url(#gold)" stroke-width="1"/>
    ${spiral(x + 4, 144, 1.2, 1.5, 6, { rot: 0, dir: -1, sw: 1 })}${spiral(x + 40, 144, 1.2, 1.5, 6, { rot: 0, dir: 1, sw: 1 })}
    <rect x="${x - 6}" y="470" width="56" height="12" fill="url(#pillar)" stroke="url(#gold)" stroke-width="1"/>`;
  const key = (flip, fill) => `
    <g transform="translate(200 462) ${flip ? 'scale(-1 1)' : ''} rotate(-38)">
      <rect x="-40" y="-2.6" width="70" height="5.2" rx="2" fill="${fill}" stroke="#5B3F22" stroke-width="0.6"/>
      <circle cx="-46" cy="0" r="9" fill="none" stroke="${fill}" stroke-width="4"/>
      <circle cx="-46" cy="0" r="9" fill="none" stroke="#5B3F22" stroke-width="0.5"/>
      <path d="M22 2.6 V12 H28 V7 H32 V2.6 Z" fill="${fill}" stroke="#5B3F22" stroke-width="0.6"/>
    </g>`;
  let tiles = '';
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 14; i++) {
      const x = 18 + i * 26 + (row % 2) * 13 - 13;
      tiles += `<rect x="${x}" y="${484 + row * 12}" width="13" height="12" fill="#4A3E6A" opacity="${0.6 - row * 0.12}"/>`;
    }
  }

  const art = `
    <path d="M110 470 V180 A90 100 0 0 1 290 180 V470 Z" fill="#120E26" opacity="0.6"/>
    <circle cx="200" cy="200" r="180" fill="url(#nave)"/>
    ${rays(200, 168, 22, 116, 16, { opacity: 0.32 })}
    <path d="M110 180 A90 100 0 0 1 290 180" fill="none" stroke="url(#gold)" stroke-width="1.6"/>
    <path d="M120 182 A80 90 0 0 1 280 182" fill="none" stroke="url(#gold)" stroke-width="0.6" opacity="0.6" stroke-dasharray="1.2 4.2"/>
    <path d="M192 76 H208 L204 92 H196 Z" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.6"/>
    <path d="M182 184 L186 138 Q200 120 214 138 L218 184 Z" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.9" filter="url(#glow)"/>
    <path d="M184 170 H216 M185 156 H215 M187 143 H213" stroke="#7A5418" stroke-width="1.4"/>
    ${[[192, 163], [200, 163], [208, 163], [196, 150], [204, 150]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#C8303E"/>`).join('')}
    <path d="M200 108 V124 M194 114 H206" stroke="url(#gold)" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="197.8" y="194" width="4.4" height="212" rx="2.2" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.5"/>
    <path d="M191 208 H209 M186 222 H214 M181 236 H219" stroke="url(#gold)" stroke-width="3.2" stroke-linecap="round"/>
    <rect x="140" y="404" width="120" height="14" fill="url(#dais)" stroke="url(#gold)" stroke-width="1"/>
    <rect x="124" y="418" width="152" height="14" fill="url(#dais)" stroke="url(#gold)" stroke-width="1"/>
    ${pillar(62)}${pillar(294)}
    ${tiles}
    <line x1="18" y1="484" x2="382" y2="484" stroke="url(#gold)" stroke-width="0.8"/>
    ${key(false, 'url(#goldV)')}${key(true, 'url(#silver)')}
    ${sparkles([[150, 120, 3.4], [250, 120, 3.4], [160, 300, 2.6], [240, 300, 2.6], [200, 370, 3]], 'fill="#F2E6FF"')}`;

  return card({
    bg: { cx: 200, cy: 220, r: 440, stops: [[0, '#4A3A7A'], [0.4, '#2A2050'], [0.75, '#140F2A'], [1, '#080614']] },
    extraDefs,
    art,
  });
}

/* ------------------------------------------------------------------------ VI · Lovers (light) */
export function lovers() {
  const extraDefs = `
    ${radial('halo', 200, 140, 170, [[0, '#FFF8E6', 0.95], [0.4, '#FFD9A0', 0.4], [1, '#F0907A', 0]])}
    ${radial('disc', 192, 124, 40, [[0, '#FFFDF2'], [0.6, '#FFE2A0'], [1, '#EFA858']])}
    ${linear('wing', [[0, '#FFF6EA'], [1, '#E8B4A0']])}
    ${linear('peak', [[0, '#C8A8C8'], [1, '#6A4E78']])}
    ${linear('meadow', [[0, '#7A863A'], [1, '#2A3014']])}
    ${linear('flame', [[0, '#FFE9A0'], [0.5, '#FF9A4A'], [1, '#C8402A']])}
    ${linear('canopy', [[0, '#4E6A2E'], [1, '#22341A']])}`;

  let wings = '';
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 5; i++) {
      const L = 74 - i * 9;
      const a = side < 0 ? 250 + i * 14 : 110 - i * 14;
      const [cx, cy] = polar(200 + side * 26, 134, L / 2 + 4, a);
      wings += `<ellipse cx="${cx}" cy="${cy}" rx="${f(L / 2)}" ry="7" fill="url(#wing)" stroke="url(#gold)" stroke-width="0.8" transform="rotate(${a - 90} ${cx} ${cy})"/>`;
    }
  }
  const flameAt = (x, y, s = 1) =>
    `<path d="M${x} ${f(y - 11 * s)} C ${f(x + 6 * s)} ${f(y - 3 * s)}, ${f(x + 5 * s)} ${f(y + 6 * s)}, ${x} ${f(y + 7 * s)} C ${f(x - 5 * s)} ${f(y + 6 * s)}, ${f(x - 6 * s)} ${f(y - 3 * s)}, ${x} ${f(y - 11 * s)} Z" fill="url(#flame)"/>`;
  const tree = (x, inner) => `
    <path d="M${x - 6} 470 C ${x - 4} 420, ${x - 5} 370, ${x - 3} 330 H${x + 3} C ${x + 5} 370, ${x + 4} 420, ${x + 6} 470 Z" fill="#5A3A22" stroke="url(#gold)" stroke-width="0.7"/>
    <circle cx="${x}" cy="300" r="46" fill="url(#canopy)" stroke="url(#gold)" stroke-width="1"/>
    ${inner}`;
  let flames = '';
  for (let i = 0; i < 9; i++) {
    const [px, py] = polar(92, 300, i === 8 ? 0 : 28, i * 45);
    flames += flameAt(px, py, i === 8 ? 1.2 : 1);
  }
  let fruits = '';
  for (let i = 0; i < 9; i++) {
    const [px, py] = polar(308, 300, i === 8 ? 0 : 27, i * 45 + 22);
    fruits += `<circle cx="${px}" cy="${py}" r="5.4" fill="#D8404A" stroke="#6A1A22" stroke-width="0.6"/><circle cx="${f(px - 1.8)}" cy="${f(py - 1.8)}" r="1.4" fill="#FFD0C8" opacity="0.8"/>`;
  }

  const art = `
    <circle cx="200" cy="140" r="170" fill="url(#halo)"/>
    ${rays(200, 124, 40, 130, 24, { alt: 34, opacity: 0.45 })}
    ${wings}
    <circle cx="200" cy="124" r="30" fill="url(#disc)" stroke="url(#gold)" stroke-width="1.6" filter="url(#glow)"/>
    <circle cx="200" cy="124" r="22" fill="none" stroke="#C88A3A" stroke-width="0.7" stroke-dasharray="1.4 4" opacity="0.6"/>
    ${cloud(200, 196, 1.1, '#FFF2EA', 0.92)}${cloud(132, 214, 0.7, '#FBE6E0', 0.85)}${cloud(270, 216, 0.75, '#FBE6E0', 0.85)}
    ${ridge([[18, 420], [120, 392], [170, 334], [200, 284], [230, 334], [280, 392], [382, 420]], { fill: 'url(#peak)' })}
    <path d="M200 284 L186 306 L194 302 L200 310 L207 301 L214 306 Z" fill="#FBF4FA" opacity="0.8"/>
    ${tree(92, flames)}${tree(308, fruits)}
    <path d="M18 446 Q200 424 382 446 V520 H18 Z" fill="url(#meadow)" stroke="url(#gold)" stroke-width="0.9"/>
    ${[[50, 470], [130, 458], [178, 486], [236, 466], [290, 482], [350, 462], [96, 494], [320, 500]].map(([x, y], i) => blossom(x, y, 4.6, i % 2 ? '#F7D0D8' : '#FFF4E8')).join('')}
    ${sparkles([[70, 120, 4], [336, 112, 4.5], [52, 214, 2.8], [352, 224, 3]], WARM)}`;

  return card({
    bg: { cx: 200, cy: 150, r: 480, stops: [[0, '#FFEFD6'], [0.22, '#F4B98E'], [0.45, '#C26E6C'], [0.72, '#56284A'], [1, '#1C0E22']] },
    extraDefs,
    art,
    texture: { light: 0.05, dark: 0.09 },
  });
}

/* --------------------------------------------------------------------- VII · Chariot (twilight) */
export function chariot() {
  const extraDefs = `
    ${radial('halo', 200, 230, 190, [[0, '#C8D4FF', 0.45], [0.5, '#7A8AD0', 0.15], [1, '#3A4A8A', 0]])}
    ${linear('canopy', [[0, '#24307A'], [1, '#0E1438']])}
    ${linear('stone', [[0, '#5A6080'], [0.5, '#9298B4'], [1, '#444862']], 'h')}
    ${linear('city', [[0, '#2A3262'], [1, '#141A38']])}
    ${linear('road', [[0, '#1A2040'], [1, '#0A0E1E']])}
    ${radial('lightOrb', 248, 460, 22, [[0, '#FFFFFF'], [1, '#B4B8D6']])}
    ${radial('darkOrb', 148, 460, 22, [[0, '#4A4E6A'], [1, '#080A16']])}`;

  let wall = `<path d="M18 290`;
  for (let x = 18; x < 382; x += 16) wall += ` V282 H${x + 8} V290 H${x + 16}`;
  wall += ` V340 H18 Z" fill="url(#city)" stroke="url(#gold)" stroke-width="0.8"/>`;
  let canopyStars = '';
  for (let i = 0; i < 9; i++) canopyStars += smallStar(124 + i * 19, 124 + (i % 2) * 12, 3.6, 8, 'url(#gold)');
  const wheel = (cx) => {
    let spokes = '';
    for (let i = 0; i < 8; i++) {
      const [x, y] = polar(cx, 420, 34, i * 45);
      spokes += `<line x1="${cx}" y1="420" x2="${x}" y2="${y}" stroke="url(#gold)" stroke-width="1.6"/>`;
    }
    return `<circle cx="${cx}" cy="420" r="38" fill="#0E1230" fill-opacity="0.75" stroke="url(#gold)" stroke-width="3"/>
      <circle cx="${cx}" cy="420" r="33" fill="none" stroke="url(#gold)" stroke-width="0.6" opacity="0.7"/>${spokes}
      <circle cx="${cx}" cy="420" r="6" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.6"/>`;
  };
  const wing = (dir) =>
    `<path d="M${200 + dir * 9} 338 C ${200 + dir * 24} 326, ${200 + dir * 42} 326, ${200 + dir * 56} 330 C ${200 + dir * 44} 336, ${200 + dir * 30} 344, ${200 + dir * 9} 344 Z" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.6"/>
     <path d="M${200 + dir * 20} 334 l${dir * 6} 7 M${200 + dir * 30} 332 l${dir * 6} 7 M${200 + dir * 40} 331 l${dir * 5} 6" stroke="#5B3F22" stroke-width="0.6"/>`;

  const art = `
    ${starDots(17, 60, 24, 70, 376, 270, { maxR: 1.2 })}
    <circle cx="200" cy="230" r="190" fill="url(#halo)"/>
    ${tower(28, 244, 30, 340, { fill: 'url(#city)' })}${tower(70, 258, 26, 340, { fill: 'url(#city)' })}
    ${tower(304, 258, 26, 340, { fill: 'url(#city)' })}${tower(342, 244, 30, 340, { fill: 'url(#city)' })}
    ${wall}
    <rect x="18" y="340" width="364" height="180" fill="url(#road)"/>
    <line x1="18" y1="340" x2="382" y2="340" stroke="url(#gold)" stroke-width="0.8"/>
    <path d="M40 520 L180 340 M360 520 L220 340" stroke="url(#gold)" stroke-width="0.6" opacity="0.35"/>
    <rect x="118" y="132" width="8" height="168" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.6"/>
    <rect x="274" y="132" width="8" height="168" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.6"/>
    <path d="M108 112 Q200 90 292 112 V150 Q276 162 261 150 Q246 162 231 150 Q216 162 200 150 Q184 162 169 150 Q154 162 139 150 Q124 162 108 150 Z" fill="url(#canopy)" stroke="url(#gold)" stroke-width="1.2"/>
    ${canopyStars}
    <path d="M104 292 H296 V302 H104 Z" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.7"/>
    <path d="M110 302 H290 V412 H110 Z" fill="url(#stone)" stroke="url(#gold)" stroke-width="1.3"/>
    <rect x="124" y="314" width="152" height="86" fill="none" stroke="url(#gold)" stroke-width="0.6" opacity="0.7"/>
    ${wing(-1)}${wing(1)}
    <circle cx="200" cy="340" r="9" fill="url(#goldV)" stroke="#5B3F22" stroke-width="0.8"/>
    <polygon points="${starPoints(200, 378, 11, 4.5, 8)}" fill="url(#gold)"/>
    <path d="${crescentPath(122, 284, 12, 'left', 1.3)}" fill="#E8ECFF" stroke="url(#gold)" stroke-width="0.6"/>
    <path d="${crescentPath(278, 284, 12, 'right', 1.3)}" fill="#E8ECFF" stroke="url(#gold)" stroke-width="0.6"/>
    ${wheel(112)}${wheel(288)}
    <ellipse cx="148" cy="480" rx="22" ry="4" fill="#000" opacity="0.4"/><ellipse cx="248" cy="480" rx="22" ry="4" fill="#000" opacity="0.4"/>
    <circle cx="148" cy="462" r="18" fill="url(#darkOrb)" stroke="url(#gold)" stroke-width="1"/>
    <circle cx="248" cy="462" r="18" fill="url(#lightOrb)" stroke="url(#gold)" stroke-width="1"/>
    ${sparkles([[86, 104, 3.6], [318, 98, 4], [200, 228, 3.4], [56, 196, 2.6], [346, 196, 2.6]], 'fill="#E8ECFF"')}`;

  return card({
    bg: { cx: 200, cy: 200, r: 460, stops: [[0, '#3E4C92'], [0.35, '#222A62'], [0.7, '#10143A'], [1, '#060818']] },
    extraDefs,
    art,
  });
}
