import { useId, type ReactNode } from 'react';
import './ornaments.css';

/**
 * Gold ornament language (ART_DIRECTION.md §4) as inline SVG: crisp at any density,
 * no image files, colours from CSS (currentColor + gold gradient).
 */

/** Document-unique, render-stable id usable inside url(#…) (no colons). */
function useGradientId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

function GoldGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#f6e6b8" />
      <stop offset="0.55" stopColor="#d9b56e" />
      <stop offset="1" stopColor="#9a7338" />
    </linearGradient>
  );
}

/** Eight-pointed star used as glyph in flanks, buttons and the emblem. */
export function StarGlyph({ size = 12, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 0l2.1 8.2L20.5 3.5 15.8 9.9 24 12l-8.2 2.1 4.7 6.4-6.4-4.7L12 24l-2.1-8.2-6.4 4.7 4.7-6.4L0 12l8.2-2.1L3.5 3.5l6.4 4.7z"
      />
    </svg>
  );
}

/** Logo emblem: a row of moon phases under a radiant star. */
export function Emblem({ width = 132 }: { width?: number }) {
  const g = useGradientId('emblem-gold');
  const phases = [-2, -1, 0, 1, 2];
  return (
    <svg className="emblem" width={width} viewBox="0 0 132 44" aria-hidden="true">
      <defs>
        <GoldGradient id={g} />
        <radialGradient id={`${g}-glow`}>
          <stop offset="0" stopColor="#f6e6b8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f6e6b8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="66" cy="12" r="12" fill={`url(#${g}-glow)`} />
      <path
        fill={`url(#${g})`}
        d="M66 2l1.5 7 6-3.5-3.5 6 7 1.5-7 1.5 3.5 6-6-3.5-1.5 7-1.5-7-6 3.5 3.5-6-7-1.5 7-1.5-3.5-6 6 3.5z"
      />
      <path d="M8 34H50M82 34h42" stroke={`url(#${g})`} strokeWidth="0.8" opacity="0.7" />
      {phases.map((p) => {
        const cx = 66 + p * 11;
        const full = p === 0;
        // Waxing on the left, waning on the right; the centre is the full moon.
        const shift = p < 0 ? 2.6 + (2 + p) * 1.6 : -(2.6 + (2 - p) * 1.6);
        return (
          <g key={p}>
            <circle cx={cx} cy="34" r="4.2" fill="none" stroke={`url(#${g})`} strokeWidth="0.7" />
            {full ? (
              <circle cx={cx} cy="34" r="4.2" fill={`url(#${g})`} />
            ) : (
              <path
                fill={`url(#${g})`}
                d={`M${cx} 29.8a4.2 4.2 0 0 ${p < 0 ? 0 : 1} 0 8.4a${Math.abs(shift)} 4.2 0 0 ${p < 0 ? 1 : 0} 0 -8.4z`}
              />
            )}
          </g>
        );
      })}
      <circle cx="4" cy="34" r="1.2" fill={`url(#${g})`} />
      <circle cx="128" cy="34" r="1.2" fill={`url(#${g})`} />
    </svg>
  );
}

/** Emblem plus the ARCANA word mark (UI text, localised app name). */
export function Brand({ name, compact = false }: { name: string; compact?: boolean }) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`}>
      <Emblem width={compact ? 96 : 132} />
      <span className="brand__word">{name}</span>
    </div>
  );
}

/** ✦ — text — ✦ : eyebrow with star flanks and fading gold lines. */
export function Flank({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flank ${className}`}>
      <span className="flank__line" aria-hidden="true" />
      <StarGlyph size={9} className="flank__star" />
      <span className="flank__text">{children}</span>
      <StarGlyph size={9} className="flank__star" />
      <span className="flank__line" aria-hidden="true" />
    </p>
  );
}

/** Filigree corner, drawn for the top-left corner and mirrored via CSS. */
export function Corner({ className }: { className: string }) {
  return (
    <svg className={`corner ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M2 38V14C2 7.4 7.4 2 14 2h24M6 38V16c0-5.5 4.5-10 10-10h22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M11 11c3-4 8-4 10 0-4-1-7 0-10 0zM11 11c-4 3-4 8 0 10-1-4 0-7 0-10z" fill="currentColor" opacity="0.85" />
      <circle cx="11" cy="11" r="1.6" fill="currentColor" />
    </svg>
  );
}

/** Panel with double gold rule and filigree corners. */
export function OrnatePanel({ children, className = '', as: Tag = 'section', ...rest }: { children: ReactNode; className?: string; as?: 'section' | 'div' | 'article' } & Record<string, unknown>) {
  return (
    <Tag className={`ornate ${className}`} {...rest}>
      <Corner className="corner--tl" />
      <Corner className="corner--tr" />
      <Corner className="corner--bl" />
      <Corner className="corner--br" />
      {children}
    </Tag>
  );
}

/** Line – crescent – line. */
export function CrescentDivider() {
  return (
    <div className="crescent-divider" aria-hidden="true">
      <span />
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="currentColor" d="M15 2a10 10 0 1 0 7 17A8 8 0 0 1 15 2z" />
      </svg>
      <span />
    </div>
  );
}
