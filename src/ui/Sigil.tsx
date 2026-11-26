import { useId, type ReactNode } from 'react';
import type { ArchetypeId } from '../domain/types.ts';

/**
 * Archetype emblems: one consistent medallion, eight distinct glyphs.
 * Original geometric line art drawn for this project (no external symbol sets).
 */

const pol = (r: number, deg: number, c = 50): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [c + r * Math.cos(a), c + r * Math.sin(a)];
};

function spiralPath(): string {
  let d = '';
  for (let t = 0; t <= Math.PI * 3.6; t += 0.12) {
    const r = 3 + 2.55 * t;
    const x = 50 + r * Math.cos(t + Math.PI);
    const y = 52 + r * Math.sin(t + Math.PI);
    d += `${d ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d;
}

function renewerArc(): string {
  const [x1, y1] = pol(27, 40, 50);
  const [x2, y2] = pol(27, 330, 50);
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A27 27 0 1 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

const GLYPHS: Record<ArchetypeId, ReactNode> = {
  seeker: (
    <>
      <circle cx="50" cy="50" r="25" strokeWidth="1" opacity="0.6" />
      <path d="M50 16 L55.5 44.5 L82 50 L55.5 55.5 L50 84 L44.5 55.5 L18 50 L44.5 44.5 Z" fill="var(--g-fill)" />
      <circle cx="50" cy="50" r="4" fill="var(--g-solid)" stroke="none" />
    </>
  ),
  guardian: (
    <>
      <path d="M50 17 L77 27 V49 C77 66 65 78 50 84 C35 78 23 66 23 49 V27 Z" fill="var(--g-fill)" />
      <path d="M50 37 C58 46 58 56 50 64 C42 56 42 46 50 37 Z" fill="var(--g-solid)" stroke="none" />
      <path d="M50 64 V72" />
    </>
  ),
  visionary: (
    <>
      <path d="M17 52 Q50 24 83 52 Q50 80 17 52 Z" fill="var(--g-fill)" />
      <circle cx="50" cy="52" r="11" />
      <circle cx="50" cy="52" r="4.2" fill="var(--g-solid)" stroke="none" />
      <path d="M50 26 V15 M34 30 L28.5 21 M66 30 L71.5 21" />
    </>
  ),
  alchemist: (
    <>
      <circle cx="50" cy="54" r="30" strokeWidth="1" opacity="0.6" />
      <path d="M50 22 L77 70 H23 Z" fill="var(--g-fill)" />
      <path d="M33 57 H67" />
      <circle cx="50" cy="47" r="6" fill="var(--g-solid)" stroke="none" />
    </>
  ),
  wanderer: (
    <>
      <path d={spiralPath()} fill="none" />
      <path d="M78 24 l2.2 5.6 5.6 2.2 -5.6 2.2 -2.2 5.6 -2.2 -5.6 -5.6 -2.2 5.6 -2.2 Z" fill="var(--g-solid)" stroke="none" />
    </>
  ),
  creator: (
    <>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="50" cy="33" rx="7.5" ry="16" transform={`rotate(${a} 50 50)`} fill="var(--g-fill)" />
      ))}
      <circle cx="50" cy="50" r="6.5" fill="var(--g-solid)" stroke="none" />
    </>
  ),
  sage: (
    <>
      <path d="M19 70 Q35 61 50 70 Q65 61 81 70 V43 Q65 34 50 43 Q35 34 19 43 Z" fill="var(--g-fill)" />
      <path d="M50 43 V70 M27 48 Q36 44 44 48 M27 55 Q36 51 44 55 M56 48 Q64 44 73 48 M56 55 Q64 51 73 55" strokeWidth="1.2" />
      <path d="M50 14 l2.4 6.6 6.6 2.4 -6.6 2.4 -2.4 6.6 -2.4 -6.6 -6.6 -2.4 6.6 -2.4 Z" fill="var(--g-solid)" stroke="none" />
    </>
  ),
  renewer: (
    <>
      <path d={renewerArc()} fill="none" />
      <path d="M62.5 20.5 L71 25.5 L62 29" fill="none" />
      <path d="M50 64 V44 M50 52 C42 52 37 46 37 39 C45 39 50 44 50 52 Z M50 48 C57 48 62 42 62 35 C55 35 50 40 50 48 Z" fill="var(--g-fill)" />
    </>
  ),
};

export interface SigilProps {
  archetype: ArchetypeId | null;
  size?: number;
  title?: string;
  className?: string;
}

/** Medallion with the archetype glyph; `null` shows the open (neutral) seal. */
export function Sigil({ archetype, size = 120, title, className }: SigilProps) {
  const uid = useId().replace(/:/g, '');
  const gold = `sg-gold-${uid}`;
  const disc = `sg-disc-${uid}`;
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const [x1, y1] = pol(45.5, i * 7.5);
    const [x2, y2] = pol(i % 4 === 0 ? 42 : 43.6, i * 7.5);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 4 === 0 ? 0.9 : 0.5} />;
  });
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ ['--g-fill' as string]: 'rgba(216,184,121,0.12)', ['--g-solid' as string]: `url(#${gold})` }}
    >
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F8E9BD" />
          <stop offset="0.45" stopColor="#D2AE6C" />
          <stop offset="0.7" stopColor="#F0D89C" />
          <stop offset="1" stopColor="#A88140" />
        </linearGradient>
        <radialGradient id={disc} cx="0.5" cy="0.42" r="0.6">
          <stop offset="0" stopColor="#3A2F70" />
          <stop offset="0.7" stopColor="#1C1638" />
          <stop offset="1" stopColor="#100D22" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48.5" fill={`url(#${disc})`} stroke={`url(#${gold})`} strokeWidth="1.4" />
      <g stroke={`url(#${gold})`} opacity="0.85">{ticks}</g>
      <circle cx="50" cy="50" r="40.5" fill="none" stroke={`url(#${gold})`} strokeWidth="0.7" />
      <g
        transform="translate(50 50) scale(0.72) translate(-50 -50)"
        fill="none"
        stroke={`url(#${gold})`}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {archetype ? (
          GLYPHS[archetype]
        ) : (
          <>
            <circle cx="50" cy="50" r="22" strokeDasharray="2 5" />
            <path d="M50 30 l3.5 16.5 16.5 3.5 -16.5 3.5 -3.5 16.5 -3.5 -16.5 -16.5 -3.5 16.5 -3.5 Z" fill="var(--g-fill)" />
          </>
        )}
      </g>
    </svg>
  );
}
