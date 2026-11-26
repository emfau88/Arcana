import { useId, type ReactNode } from 'react';
import './ornaments.css';

/**
 * Gold ornament language (ART_DIRECTION.md §4) as inline SVG: crisp at any density,
 * no image files. Gold is a three-stop gradient (highlight, body, shadow) so the
 * ornaments read as polished metal rather than flat lines.
 */

/** Document-unique, render-stable id usable inside url(#…) (no colons). */
function useGradientId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

function GoldGradient({ id, diagonal = false }: { id: string; diagonal?: boolean }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={diagonal ? '1' : '0'} y2="1">
      <stop offset="0" stopColor="#fff4d2" />
      <stop offset="0.45" stopColor="#e3c27e" />
      <stop offset="1" stopColor="#9a7338" />
    </linearGradient>
  );
}

/** Soft four-point sparkle with a smaller diagonal glint (the ✦ of the mockup). */
export function StarGlyph({ size = 12, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" opacity="0.55" d="M12 6.5l1 4.5 4.5 1-4.5 1-1 4.5-1-4.5-4.5-1 4.5-1z" transform="rotate(45 12 12)" />
      <path fill="currentColor" d="M12 0c.6 6.2 1.9 9.4 4.3 10.8C18 11.7 20.6 11.9 24 12c-3.4.1-6 .3-7.7 1.2C13.9 14.6 12.6 17.8 12 24c-.6-6.2-1.9-9.4-4.3-10.8C6 12.3 3.4 12.1 0 12c3.4-.1 6-.3 7.7-1.2C10.1 9.4 11.4 6.2 12 0z" />
    </svg>
  );
}

/** Triple moon: waxing and waning crescents (horns outward) around a ringed star. */
export function Emblem({ width = 128 }: { width?: number }) {
  const g = useGradientId('emblem-gold');
  return (
    <svg className="emblem" width={width} viewBox="0 0 140 48" aria-hidden="true">
      <defs>
        <GoldGradient id={g} />
        <radialGradient id={`${g}-glow`}>
          <stop offset="0" stopColor="#fff1c8" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#e3c27e" stopOpacity="0.16" />
          <stop offset="1" stopColor="#e3c27e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${g}-disc`}>
          <stop offset="0" stopColor="#2a1d4a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#0b1024" stopOpacity="0.6" />
        </radialGradient>
        <mask id={`${g}-left`}>
          <circle cx="40" cy="24" r="16" fill="#fff" />
          <circle cx="33.5" cy="24" r="15" fill="#000" />
        </mask>
        <mask id={`${g}-right`}>
          <circle cx="100" cy="24" r="16" fill="#fff" />
          <circle cx="106.5" cy="24" r="15" fill="#000" />
        </mask>
      </defs>
      <ellipse cx="70" cy="24" rx="44" ry="22" fill={`url(#${g}-glow)`} />
      {/* Horizon line with end pearls */}
      <path d="M2 24H22M118 24h20" stroke={`url(#${g})`} strokeWidth="0.7" />
      <circle cx="2.5" cy="24" r="1.3" fill="#f6e6b8" />
      <circle cx="137.5" cy="24" r="1.3" fill="#f6e6b8" />
      {/* Crescents */}
      <circle cx="40" cy="24" r="16" fill={`url(#${g})`} mask={`url(#${g}-left)`} />
      <circle cx="100" cy="24" r="16" fill={`url(#${g})`} mask={`url(#${g}-right)`} />
      {/* Full moon ring with star */}
      <circle cx="70" cy="24" r="17" fill={`url(#${g}-disc)`} stroke={`url(#${g})`} strokeWidth="1.4" />
      <circle cx="70" cy="24" r="14.2" fill="none" stroke="#e3c27e" strokeOpacity="0.35" strokeWidth="0.5" />
      <path
        fill={`url(#${g})`}
        d="M70 11c.5 6.6 1.6 9.4 3.5 10.5 1.5.9 3.6 1.3 7.5 1.5-3.9.2-6 .6-7.5 1.5-1.9 1.1-3 3.9-3.5 10.5-.5-6.6-1.6-9.4-3.5-10.5-1.5-.9-3.6-1.3-7.5-1.5 3.9-.2 6-.6 7.5-1.5 1.9-1.1 3-3.9 3.5-10.5z"
      />
      <path fill="#fff4d2" opacity="0.7" d="M70 17.5l.9 5.6 5.6.9-5.6.9-.9 5.6-.9-5.6-5.6-.9 5.6-.9z" transform="rotate(45 70 24)" />
      <circle cx="70" cy="24" r="1.4" fill="#fffaf0" />
    </svg>
  );
}

/** Triple-moon emblem plus the ARCANA word mark (localised app name). */
export function Brand({ name }: { name: string }) {
  return (
    <div className="brand">
      <Emblem />
      <span className="brand__word">{name}</span>
    </div>
  );
}

type FlankTag = 'p' | 'h1' | 'h2';

/** ✦ — text — ✦ : eyebrow with sparkle flanks and tapering gold lines. */
export function Flank({ children, className = '', as: Tag = 'p', tabIndex }: { children: ReactNode; className?: string; as?: FlankTag; tabIndex?: number }) {
  return (
    <Tag className={`flank ${className}`} tabIndex={tabIndex}>
      <span className="flank__line" aria-hidden="true" />
      <StarGlyph size={10} className="flank__star" />
      <span className="flank__text">{children}</span>
      <StarGlyph size={10} className="flank__star" />
      <span className="flank__line" aria-hidden="true" />
    </Tag>
  );
}

/**
 * Baroque corner flourish (drawn for the top-left corner, mirrored via CSS):
 * double rule, C-scrolls with curled ends, two acanthus leaves and a pearl.
 */
export function Corner({ className }: { className: string }) {
  const g = useGradientId('corner-gold');
  return (
    <svg className={`corner ${className}`} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <GoldGradient id={g} diagonal />
        <radialGradient id={`${g}-pearl`} cx="0.35" cy="0.35">
          <stop offset="0" stopColor="#fffdf4" />
          <stop offset="0.6" stopColor="#ecd8a6" />
          <stop offset="1" stopColor="#a07b3e" />
        </radialGradient>
      </defs>
      <g fill="none" stroke={`url(#${g})`} strokeLinecap="round">
        <path d="M2.5 63V22Q2.5 2.5 22 2.5H63" strokeWidth="1.5" />
        <path d="M7.5 63V25Q7.5 7.5 25 7.5H63" strokeWidth="0.6" opacity="0.75" />
        <path d="M14 46C13 28 22 15 44 14" strokeWidth="1.15" />
        <path d="M44 14c6-.3 8.6 5 4.8 7.3-2.7 1.6-5.4-.6-3.8-2.8 1-1.3 2.6-.8 2.7.3" strokeWidth="1.05" />
        <path d="M14 46c-.3 6 5 8.6 7.3 4.8 1.6-2.7-.6-5.4-2.8-3.8-1.3 1-.8 2.6.3 2.7" strokeWidth="1.05" />
      </g>
      <g fill={`url(#${g})`}>
        <path d="M16.5 16.5c4.5-7.5 13-9.6 19.5-6.4-6.2.4-11.6 2.7-15.6 7.4-1.2-.2-2.6-.4-3.9-1z" />
        <path d="M16.5 16.5c-7.5 4.5-9.6 13-6.4 19.5.4-6.2 2.7-11.6 7.4-15.6-.2-1.2-.4-2.6-1-3.9z" />
        <path d="M26 21.5c3.6-2.6 8-2.9 11.2-.9-3.4.1-6.6 1.2-9.3 3.3-.6-.8-1.2-1.6-1.9-2.4z" opacity="0.85" />
        <path d="M21.5 26c-2.6 3.6-2.9 8-.9 11.2.1-3.4 1.2-6.6 3.3-9.3-.8-.6-1.6-1.2-2.4-1.9z" opacity="0.85" />
      </g>
      <circle cx="12.5" cy="12.5" r="3" fill={`url(#${g}-pearl)`} />
    </svg>
  );
}

/** Panel with double gold rule and baroque corners. */
export function OrnatePanel({
  children,
  className = '',
  as: Tag = 'section',
  ...rest
}: { children: ReactNode; className?: string; as?: 'section' | 'div' | 'article' } & Record<string, unknown>) {
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

/** Laurel sprig for plaques (drawn pointing left, mirrored via CSS). */
export function Laurel({ className }: { className?: string }) {
  const g = useGradientId('laurel-gold');
  const leaves: ReadonlyArray<readonly [number, number, number]> = [
    [31, 9.6, -32],
    [31.5, 16.2, 30],
    [24, 9.2, -28],
    [24.5, 16.6, 26],
    [17, 9.8, -22],
    [17.6, 17.4, 22],
    [10.2, 11.4, -16],
    [10.8, 18.4, 16],
  ];
  return (
    <svg className={`laurel ${className ?? ''}`} viewBox="0 0 42 26" aria-hidden="true">
      <defs>
        <GoldGradient id={g} />
      </defs>
      <path d="M40 13.2C30 12.8 16 13.6 3.5 15.4" fill="none" stroke={`url(#${g})`} strokeWidth="0.9" strokeLinecap="round" />
      <g fill={`url(#${g})`}>
        {leaves.map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx="4.6" ry="1.9" transform={`rotate(${r} ${x} ${y})`} />
        ))}
        <ellipse cx="4.2" cy="15.2" rx="3.6" ry="1.6" transform="rotate(-6 4.2 15.2)" />
      </g>
    </svg>
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
