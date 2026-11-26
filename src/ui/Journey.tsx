import { useId } from 'react';
import type { JourneyPosition } from '../domain/oracle.ts';
import { Laurel, StarGlyph } from './Ornaments.tsx';
import './journey.css';

const STEP = 44;
const X0 = 22;

/**
 * The visible journey (VISUAL_ROADMAP.md, progression concept): a plaque with the
 * journey day and a star path of the seven stations of the current path. Reached
 * stations glow gold, today glows teal, the last station of a path is a crescent.
 * Nothing can be lost: pauses never move the position back (E6).
 */
export function Journey({ position, plaque, caption, label }: { position: JourneyPosition; plaque: string; caption: string; label: string }) {
  const g = `jp-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const current = position.station - 1;
  const xCur = X0 + current * STEP;
  return (
    <section className="journey" aria-label={label}>
      <p className="journey__plaque">
        <Laurel />
        <span className="journey__plaque-text">
          <StarGlyph size={10} className="journey__spark" /> {plaque}
        </span>
        <Laurel className="laurel--right" />
      </p>
      <svg className="journey__path" viewBox="0 0 308 40" aria-hidden="true">
        <defs>
          <linearGradient id={`${g}-gold`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff4d2" />
            <stop offset="0.5" stopColor="#e3c27e" />
            <stop offset="1" stopColor="#9a7338" />
          </linearGradient>
          <linearGradient id={`${g}-line`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e3c27e" stopOpacity="0.2" />
            <stop offset="1" stopColor="#ecd08f" />
          </linearGradient>
          <radialGradient id={`${g}-teal`}>
            <stop offset="0" stopColor="#4fd1c5" stopOpacity="0.55" />
            <stop offset="1" stopColor="#4fd1c5" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={`M${X0} 20H${X0 + 6 * STEP}`} stroke="#e3c27e" strokeOpacity="0.25" strokeWidth="1" />
        {current > 0 ? <path d={`M${X0} 20H${xCur}`} stroke={`url(#${g}-line)`} strokeWidth="1.6" /> : null}
        {Array.from({ length: 7 }, (_, i) => {
          const x = X0 + i * STEP;
          const reached = i < current;
          const isCurrent = i === current;
          const last = i === 6;
          if (isCurrent) {
            return (
              <g key={i} className="journey__now">
                <circle cx={x} cy="20" r="19" fill={`url(#${g}-teal)`} />
                <circle cx={x} cy="20" r="12" fill="#0b1830" stroke="#4fd1c5" strokeWidth="1.6" />
                <circle cx={x} cy="20" r="8.5" fill={`url(#${g}-gold)`} />
                <path fill="#1a1230" d={`M${x} 14.5l1.3 4.2 4.2 1.3-4.2 1.3-1.3 4.2-1.3-4.2-4.2-1.3 4.2-1.3z`} />
              </g>
            );
          }
          if (last) {
            // Crescent = end of this path of seven (a milestone, never a lock).
            return (
              <path
                key={i}
                d={`M${x + 3} 10a10 10 0 1 0 0 20a8 8 0 1 1 0-20z`}
                fill={reached ? `url(#${g}-gold)` : '#141a36'}
                stroke="#e3c27e"
                strokeOpacity={reached ? 1 : 0.5}
                strokeWidth="1"
              />
            );
          }
          return reached ? (
            <g key={i}>
              <circle cx={x} cy="20" r="8" fill={`url(#${g}-gold)`} />
              <path fill="#2a1d14" opacity="0.75" d={`M${x} 15.6l1 3.4 3.4 1-3.4 1-1 3.4-1-3.4-3.4-1 3.4-1z`} />
            </g>
          ) : (
            <circle key={i} cx={x} cy="20" r="6.5" fill="#121735" stroke="#e3c27e" strokeOpacity="0.45" strokeWidth="1" />
          );
        })}
      </svg>
      <p className="sr-only">{caption}</p>
    </section>
  );
}
