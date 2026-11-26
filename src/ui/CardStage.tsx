import type { CSSProperties, ReactNode } from 'react';
import { Corner, StarGlyph } from './Ornaments.tsx';
import './stage.css';

/**
 * Layer 2 for the hero card (ART_DIRECTION.md §4 "Kartenbühne"): aura, light rays,
 * floor light, gold glow, filigree corners and a one-time spark burst on reveal.
 * All CSS; the only motion is the reveal itself plus a short breathing of the aura
 * that ends after ≈10 s (E5). Reduced motion: static light, no burst.
 */
export function CardStage({ revealing, revealed, children }: { revealing: boolean; revealed: boolean; children: ReactNode }) {
  return (
    <div className={`cstage ${revealing ? 'is-revealing' : ''} ${revealed ? 'is-revealed' : ''}`}>
      <span className="cstage__rays" aria-hidden="true" />
      <span className="cstage__aura" aria-hidden="true" />
      <span className="cstage__crown" aria-hidden="true" />
      <span className="cstage__floor" aria-hidden="true" />
      <span className="cstage__motes" aria-hidden="true">
        {MOTES.map(([x, y, s, d], i) => (
          <i key={i} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}ms` } as CSSProperties}>
            <StarGlyph size={s} />
          </i>
        ))}
      </span>
      <div className="cstage__card">
        {children}
        <span className="cstage__frame" aria-hidden="true">
          <Corner className="corner--tl" />
          <Corner className="corner--tr" />
          <Corner className="corner--bl" />
          <Corner className="corner--br" />
        </span>
      </div>
      {revealing ? (
        <span className="cstage__sparks" aria-hidden="true">
          {SPARKS.map(([x, y, d], i) => (
            <i key={i} style={{ '--x': `${x}px`, '--y': `${y}px`, animationDelay: `${d}ms` } as CSSProperties} />
          ))}
        </span>
      ) : null}
    </div>
  );
}

/** Floating sparkles around the card: x %, y %, size px, twinkle delay ms. */
const MOTES: ReadonlyArray<readonly [number, number, number, number]> = [
  [8, 18, 10, 0],
  [90, 12, 12, 700],
  [4, 52, 8, 1400],
  [95, 44, 9, 300],
  [12, 84, 11, 1100],
  [88, 80, 8, 1800],
  [22, 4, 7, 500],
  [76, 95, 9, 900],
  [97, 66, 6, 1600],
  [2, 30, 6, 2100],
];

/** Spark end positions (px from centre) and delays: an even, hand-tuned burst. */
const SPARKS: ReadonlyArray<readonly [number, number, number]> = [
  [-150, -170, 0],
  [150, -160, 40],
  [-185, -20, 80],
  [190, 10, 20],
  [-140, 150, 60],
  [135, 165, 100],
  [-60, -215, 30],
  [70, -220, 90],
  [-30, 210, 50],
  [40, 205, 10],
  [-205, 90, 120],
  [210, -95, 70],
  [-110, -120, 140],
  [115, 110, 160],
];
