// Templates for replacing the card art later (e.g. with commissioned illustrations).
// frameOnly(): the shared frame on a transparent background.
// safeZones(): the frame plus guides that show where the UI draws numeral and title.
import { W, H, baseDefs, frame } from './lib.mjs';

const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  ${baseDefs({ bg: { cx: 200, cy: 300, r: 400, stops: [[0, '#000'], [1, '#000']] } })}
  ${inner}
</svg>`;

export function frameOnly() {
  return svg(frame());
}

export function safeZones() {
  const label = (x, y, text, anchor = 'middle') =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="sans-serif" font-size="9" fill="#1A1A1A">${text}</text>`;
  return svg(`
    <rect width="${W}" height="${H}" rx="20" fill="#F4F1EA"/>
    <rect x="18" y="18" width="364" height="564" rx="9" fill="#DDE8F4"/>
    <rect x="30" y="72" width="340" height="430" fill="#CDEBD0" stroke="#3A8A4A" stroke-dasharray="4 3"/>
    ${label(200, 290, 'Motivbereich / art area 340 x 430 (x 30-370, y 72-502)')}
    ${label(200, 304, 'Kein Text im Bild / no text in the image')}
    <circle cx="200" cy="40" r="30" fill="#F4C8C8" stroke="#B83A3A" stroke-dasharray="3 3"/>
    ${label(200, 84, 'UI: Zahl / numeral (Medaillon)')}
    <rect x="40" y="506" width="320" height="60" fill="#F4C8C8" stroke="#B83A3A" stroke-dasharray="3 3"/>
    ${label(200, 580, 'UI: Titel / title (Plakette)')}
    ${frame()}
    ${label(392, 596, 'Raster 400 x 600 = 2:3 · Export 720 x 1080 + 240 x 360 WebP', 'end')}`);
}
