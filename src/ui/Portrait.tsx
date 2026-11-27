import { portraitSrc, type PortraitSize } from '../content/assets.ts';
import type { ArchetypeId } from '../domain/types.ts';
import { Sigil } from './Sigil.tsx';
import './portrait.css';

/**
 * Archetype portrait (B2, A07–A14) in an arched brass frame. 720 px for the reveal and "Ich",
 * 240 px thumbnails elsewhere; the 1024 px master is only for share images.
 */
export function ArchetypePortrait({
  id,
  size,
  alt,
  className = '',
  eager = false,
  seal = false,
}: {
  id: ArchetypeId;
  size: Exclude<PortraitSize, 1024>;
  alt: string;
  className?: string;
  eager?: boolean;
  /** The archetype's sigil as a small seal on the lower edge of the frame. */
  seal?: boolean;
}) {
  const thumb = size === 240;
  return (
    <span className={`portrait ${thumb ? 'portrait--thumb' : 'portrait--large'} ${className}`}>
      <span className="portrait__frame">
        <img
          src={portraitSrc(id, size)}
          width={thumb ? 240 : 720}
          height={thumb ? 360 : 1080}
          alt={alt}
          decoding="async"
          loading={eager ? 'eager' : 'lazy'}
        />
      </span>
      {seal ? <Sigil archetype={id} size={thumb ? 32 : 52} className="portrait__seal" /> : null}
    </span>
  );
}

