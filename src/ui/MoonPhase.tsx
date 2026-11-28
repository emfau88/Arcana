import type { LevelPhase } from '../domain/study.ts';
import './moon-phase.css';

/**
 * Level of a card as a moon phase from new to full (PRODUCT_SYSTEMS D3), on the card page and in
 * the cards chapter of the book. A lit disc with the shadow drawn as a second ellipse.
 */
export function MoonPhase({ phase, size = 28 }: { phase: LevelPhase; size?: number }) {
  // Lit share of the disc: new 0, crescent ¼, half ½, gibbous ¾, full 1. The terminator is an
  // ellipse whose half-width follows the share (right side lit, like a waxing moon).
  const lit = { new: 0, crescent: 0.25, half: 0.5, gibbous: 0.75, full: 1 }[phase];
  const r = 10;
  const k = Math.abs(1 - 2 * lit) * r; // terminator half-width
  const sweep = lit > 0.5 ? 1 : 0;
  const d = lit === 0 || lit === 1 ? '' : `M 12 2 A ${r} ${r} 0 0 1 12 22 A ${k} ${r} 0 0 ${sweep} 12 2 Z`;
  return (
    <svg className="moon-phase" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r={r} className="moon-phase__dark" />
      {lit === 1 ? <circle cx="12" cy="12" r={r} className="moon-phase__lit" /> : null}
      {d ? <path d={d} className="moon-phase__lit" /> : null}
      <circle cx="12" cy="12" r={r} className="moon-phase__rim" />
    </svg>
  );
}
