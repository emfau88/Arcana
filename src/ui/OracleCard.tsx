import type { CardContent } from '../content/schema.ts';
import type { Locale } from '../domain/types.ts';
import { toRoman } from '../i18n/index.ts';
import './card.css';

const base = import.meta.env.BASE_URL;
export const cardSrc = (assetId: string, thumb = false) => `${base}cards/${thumb ? 'thumbs/' : ''}${assetId}.webp`;

export type CardSize = 'hero' | 'spread' | 'grid' | 'mini';

/** The plaque holds ~10 capitals at full size; longer titles step down instead of being cut. */
export function titleFit(title: string): 'm' | 'l' | 'xl' | undefined {
  const n = title.length;
  if (n <= 11) return undefined;
  if (n <= 14) return 'm';
  if (n <= 18) return 'l';
  return 'xl';
}

export interface OracleCardProps {
  card: CardContent | null;
  locale: Locale;
  faceUp: boolean;
  size: CardSize;
  /** Accessible name. Required because the art carries no text. */
  label: string;
  onActivate?: () => void;
  /** Plays the flip/sheen when the card turns face up during this mount. */
  animated?: boolean;
  /** Title and numeral inside the card frame (hidden on small sizes). */
  inscription?: boolean;
  dimmed?: boolean;
  disabled?: boolean;
}

/**
 * A two-sided card with a real 3D flip (transform/opacity only).
 * Titles and numerals are rendered from localized content, never baked into the art.
 */
export function OracleCard({
  card,
  locale,
  faceUp,
  size,
  label,
  onActivate,
  animated = false,
  inscription = size === 'hero',
  dimmed = false,
  disabled = false,
}: OracleCardProps) {
  const thumb = size === 'grid' || size === 'mini' || size === 'spread';
  const cls = [
    'ocard',
    `ocard--${size}`,
    faceUp ? 'is-up' : '',
    animated ? 'is-animated' : '',
    dimmed ? 'is-dimmed' : '',
    onActivate && !disabled ? 'is-interactive' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <span className="ocard__inner">
      <span className="ocard__face ocard__back">
        <img
          src={cardSrc('card-back', thumb)}
          alt=""
          draggable={false}
          decoding="async"
          loading={size === 'hero' ? 'eager' : 'lazy'}
          fetchPriority={size === 'hero' && !faceUp ? 'high' : undefined}
        />
      </span>
      <span className="ocard__face ocard__front">
        {card ? (
          <>
            <img
              src={cardSrc(card.assetId, thumb)}
              alt=""
              draggable={false}
              decoding="async"
              loading={size === 'hero' ? 'eager' : 'lazy'}
              fetchPriority={size === 'hero' && faceUp ? 'high' : undefined}
            />
            {inscription ? (
              <>
                <span className="ocard__num" data-len={Math.min(toRoman(card.order).length, 5)} aria-hidden="true">
                  {toRoman(card.order)}
                </span>
                <span className="ocard__title" data-fit={titleFit(card.title[locale])} aria-hidden="true">
                  {card.title[locale]}
                </span>
              </>
            ) : (
              <>
                <span className="ocard__seal" aria-hidden="true" />
                <span className="ocard__mark" aria-hidden="true" />
              </>
            )}
            <span className="ocard__sheen" aria-hidden="true" />
          </>
        ) : null}
      </span>
    </span>
  );

  if (onActivate) {
    return (
      <button type="button" className={cls} aria-label={label} onClick={onActivate} disabled={disabled}>
        {inner}
      </button>
    );
  }
  // Decorative thumbnails (label "") sit inside an element that already names the card.
  if (!label) {
    return (
      <span className={cls} aria-hidden="true">
        {inner}
      </span>
    );
  }
  return (
    <span className={cls} role="img" aria-label={label}>
      {inner}
    </span>
  );
}
