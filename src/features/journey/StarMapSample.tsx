/**
 * Samples for design plan point 6 (owner's choice, D-63). Two shapes for the star map of a round:
 *   A  three rings for the three paths: outside the outer path, inside it the inner, in the
 *      middle the higher one. The way leads inwards.
 *   B  one freely set constellation with fixed coordinates.
 * In both: the last star of each path is larger, today's star glows, lines are fine, and a
 * numeral shows only for the star that is selected (today's by default). The list below the map
 * stays the text version. Sample code: strings are inline, removed after the choice.
 */
import { useState } from 'react';
import type { MusterVariant } from '../../app/muster.ts';
import type { StarMap, StarNode } from '../../domain/starmap.ts';
import type { Locale } from '../../domain/types.ts';
import { toRoman } from '../../i18n/index.ts';

const VIEW = 320;
const C = VIEW / 2;
const RING_R = [136, 92, 48] as const;
const STEP = 360 / 7;

function ringPosition(station: number): { x: number; y: number } {
  const k = station - 1;
  const path = Math.floor(k / 7);
  // One spiral inwards: each ring continues half a step after the last star of the ring before.
  const deg = -90 + k * STEP - path * (STEP / 2);
  const rad = (deg * Math.PI) / 180;
  const r = RING_R[path] ?? RING_R[2];
  return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) };
}

/** Fixed coordinates of the constellation of round 1 (hand-set, bottom left to top). */
const FREE: ReadonlyArray<readonly [number, number]> = [
  [36, 286], [72, 262], [106, 276], [140, 250], [130, 214], [164, 194], [204, 210],
  [238, 186], [270, 204], [292, 170], [272, 136], [238, 126], [206, 146], [174, 122],
  [144, 136], [110, 116], [82, 138], [54, 110], [72, 76], [110, 56], [152, 34],
];

function position(variant: MusterVariant, station: number): { x: number; y: number } {
  if (variant === 'a') return ringPosition(station);
  const p = FREE[station - 1] ?? FREE[0]!;
  return { x: p[0], y: p[1] };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

function linePath(variant: MusterVariant, upTo: number): string {
  let d = '';
  for (let s = 1; s <= upTo; s++) {
    const p = position(variant, s);
    if (s === 1) d += `M${r1(p.x)} ${r1(p.y)}`;
    else if (variant === 'a' && Math.floor((s - 1) / 7) === Math.floor((s - 2) / 7)) {
      const r = RING_R[Math.floor((s - 1) / 7)] ?? RING_R[2];
      d += `A${r} ${r} 0 0 1 ${r1(p.x)} ${r1(p.y)}`;
    } else d += `L${r1(p.x)} ${r1(p.y)}`;
  }
  return d;
}

function starPath(x: number, y: number, s: number): string {
  const k = s * 0.26;
  return `M${r1(x)} ${r1(y - s)}l${r1(k)} ${r1(s - k)} ${r1(s - k)} ${r1(k)} ${r1(k - s)} ${r1(k)} ${r1(-k)} ${r1(s - k)} ${r1(-k)} ${r1(k - s)} ${r1(k - s)} ${r1(-k)} ${r1(s - k)} ${r1(-k)}z`;
}

const TEXT = {
  de: { reached: 'erreicht', current: 'heute', ahead: 'noch vor dir', paths: ['Äußerer Weg', 'Innerer Weg', 'Höherer Weg'], hint: 'Tippe einen Stern an.' },
  en: { reached: 'reached', current: 'today', ahead: 'still ahead', paths: ['Outer path', 'Inner path', 'Higher path'], hint: 'Tap a star.' },
} as const;

export function StarMapSample({
  map,
  variant,
  label,
  locale,
  cardTitle,
}: {
  map: StarMap;
  variant: MusterVariant;
  label: string;
  locale: Locale;
  cardTitle(station: number): string;
}) {
  const [selected, setSelected] = useState<number>(map.reached);
  const tx = TEXT[locale];
  const sel = map.nodes.find((n) => n.station === selected) ?? map.nodes[0]!;
  const size = (n: StarNode) => (n.station % 7 === 0 ? 10 : n.state === 'current' ? 8 : 5.6);

  return (
    <div className={`starmap-sample starmap-sample--${variant}`}>
      <figure className="starmap starmap--sample" role="img" aria-label={label}>
        <svg viewBox={`0 0 ${VIEW} ${VIEW}`}>
          <defs>
            <radialGradient id="sms-gold">
              <stop offset="0" stopColor="#fff8e0" />
              <stop offset="0.5" stopColor="#ecd08e" />
              <stop offset="1" stopColor="#a67c3c" />
            </radialGradient>
            <radialGradient id="sms-glow">
              <stop offset="0" stopColor="#fff1c4" stopOpacity="0.75" />
              <stop offset="0.35" stopColor="#4fd1c5" stopOpacity="0.38" />
              <stop offset="1" stopColor="#4fd1c5" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sms-core">
              <stop offset="0" stopColor="#f6e6b8" stopOpacity="0.28" />
              <stop offset="1" stopColor="#f6e6b8" stopOpacity="0" />
            </radialGradient>
          </defs>
          {variant === 'a' ? <circle cx={C} cy={C} r="30" fill="url(#sms-core)" className="starmap-sample__core" /> : null}
          {variant === 'a' ? (
            <g className="starmap-sample__orbits">
              {RING_R.map((r) => (
                <circle key={r} cx={C} cy={C} r={r} />
              ))}
            </g>
          ) : (
            <path d={linePath(variant, 21)} className="starmap-sample__line" />
          )}
          {map.reached > 1 ? <path d={linePath(variant, map.reached)} className="starmap-sample__line starmap-sample__line--reached" /> : null}
          {map.nodes.map((n) => {
            const p = position(variant, n.station);
            const end = n.station % 7 === 0;
            const isSel = n.station === selected;
            return (
              <g key={n.station} className={`starmap-sample__star starmap-sample__star--${n.state}${isSel ? ' is-selected' : ''}`} onClick={() => setSelected(n.station)}>
                {n.state === 'current' ? <circle cx={p.x} cy={p.y} r="22" fill="url(#sms-glow)" /> : null}
                {isSel && n.state !== 'current' ? <circle cx={p.x} cy={p.y} r="11" className="starmap-sample__ring" /> : null}
                {n.state === 'ahead' ? (
                  end ? (
                    <path d={starPath(p.x, p.y, 7)} className="starmap-sample__ghost" />
                  ) : (
                    <circle cx={p.x} cy={p.y} r="2.3" className="starmap-sample__dot" />
                  )
                ) : (
                  <path d={starPath(p.x, p.y, size(n))} fill="url(#sms-gold)" />
                )}
                {isSel ? (
                  <text x={p.x} y={p.y + (p.y > VIEW - 40 ? -16 : 24)} className="starmap-sample__num">
                    {toRoman(n.station)}
                  </text>
                ) : null}
                <circle cx={p.x} cy={p.y} r="15" fill="transparent" />
              </g>
            );
          })}
        </svg>
      </figure>
      <p className="starmap-sample__caption" aria-live="polite">
        <span className="starmap-sample__caption-num">{toRoman(sel.station)}</span> {cardTitle(sel.station)}
        <span className="starmap-sample__caption-state">
          {tx.paths[sel.path]} · {tx[sel.state]}
        </span>
      </p>
    </div>
  );
}
