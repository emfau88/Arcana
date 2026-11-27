import { useEffect, useMemo, useState } from 'react';
import './world.css';

/**
 * Layer 1 of every screen (docs/visual/ART_DIRECTION.md §1): an illustrated world behind
 * the content. Until the painted backgrounds (docs/visual/ASSET_REQUESTS.md A01–A06) are
 * delivered, a vector night landscape stands in. When an image is registered in
 * WORLD_IMAGES it is layered on top of the vector scene and fades in once decoded.
 *
 * Everything here is static after a short entrance: a few stars twinkle three times
 * (≈10 s) and then the scene is completely still (E5). Reduced motion: no animation.
 */
export type WorldScene = 'today' | 'calm' | 'welcome' | 'profile' | 'profile-calm' | 'starmap';

const base = import.meta.env.BASE_URL;
/** Painted backgrounds by scene; filled when the assets from ASSET_REQUESTS.md arrive. */
const WORLD_IMAGES: Partial<Record<WorldScene, { src: string; srcSmall: string; foliage?: string }>> = {
  // A01 "Nachtterrasse" + A02 "Pflanzenecken" (ChatGPT, 26.11.2026; masters outside the repo)
  today: { src: 'world/bg-today.webp', srcSmall: 'world/bg-today-720.webp', foliage: 'world/fg-today' },
  // V03.5: the same night world, dimmed, as the neutral backdrop of screens without their own
  // world yet (ASSET_REQUESTS: A01 "neutraler Hintergrund in V03"). Same file: no extra download.
  calm: { src: 'world/bg-today.webp', srcSmall: 'world/bg-today-720.webp' },
  // B2 (26.11.2026, D-55): A06 welcome and questions, A05 reveal and "Ich", A19 star map.
  welcome: { src: 'world/bg-welcome.webp', srcSmall: 'world/bg-welcome-720.webp' },
  profile: { src: 'world/bg-profile.webp', srcSmall: 'world/bg-profile-720.webp' },
  'profile-calm': { src: 'world/bg-profile.webp', srcSmall: 'world/bg-profile-720.webp' },
  starmap: { src: 'world/bg-starmap.webp', srcSmall: 'world/bg-starmap-720.webp' },
};
const CORNERS = ['tl', 'tr', 'bl', 'br'] as const;

interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
  twinkle: boolean;
}

/** Deterministic star field, so every render and every screenshot is identical. */
function makeStars(count: number, seed: number): Star[] {
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  return Array.from({ length: count }, (_, i) => {
    const y = Math.pow(rnd(), 1.6) * 62; // denser towards the top
    return { x: rnd() * 100, y, r: 0.35 + rnd() * rnd() * 1.25, o: 0.35 + rnd() * 0.6, twinkle: i % 9 === 0 };
  });
}

export function World({ scene }: { scene: WorldScene }) {
  const stars = useMemo(() => makeStars(scene === 'today' ? 120 : 80, 7), [scene]);
  const image = WORLD_IMAGES[scene];
  const [loaded, setLoaded] = useState<string | null>(null);
  const painted = Boolean(image && loaded === image.src);
  const pageLoaded = usePageLoaded();
  return (
    <div className={`world-scene world-scene--${scene} ${painted ? 'is-painted' : ''}`} aria-hidden="true">
      <div className="world-scene__sky" />
      <div className="world-scene__milkyway" />
      <svg className="world-scene__stars" viewBox="0 0 100 100" preserveAspectRatio="xMidYMin slice">
        {stars.map((st, i) => (
          <circle
            key={i}
            className={st.twinkle ? 'world-star world-star--twinkle' : 'world-star'}
            cx={st.x}
            cy={st.y}
            r={st.r * 0.16}
            opacity={st.o}
            style={st.twinkle ? { animationDelay: `${(i % 5) * 0.7}s` } : undefined}
          />
        ))}
      </svg>
      {scene === 'today' ? <Moon /> : null}
      <Landscape detailed={scene === 'today'} />
      {image ? (
        <picture className={`world-scene__image ${painted ? 'is-loaded' : ''}`}>
          <source media="(max-width: 520px)" srcSet={`${base}${image.srcSmall}`} />
          <img src={`${base}${image.src}`} alt="" decoding="async" fetchPriority="low" onLoad={() => setLoaded(image.src)} />
        </picture>
      ) : null}
      <div className="world-scene__veil" />
      <div className="world-scene__dim" />
      {/* B-08: the corners come after the page has loaded, so they do not compete with the card
          for bandwidth. They used to follow the painting anyway; the moment is practically the same. */}
      {image?.foliage && painted && pageLoaded ? (
        <div className="world-scene__foliage">
          {CORNERS.map((c) => (
            <img key={c} className={`foliage foliage--${c}`} src={`${base}${image.foliage}-${c}.webp`} alt="" decoding="async" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** True once the window's load event has fired (decoration that may wait for it). */
function usePageLoaded() {
  const [done, setDone] = useState(() => document.readyState === 'complete');
  useEffect(() => {
    if (done) return;
    const on = () => setDone(true);
    window.addEventListener('load', on, { once: true });
    return () => window.removeEventListener('load', on);
  }, [done]);
  return done;
}

function Moon() {
  return (
    <svg className="world-scene__moon" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="moon-glow">
          <stop offset="0" stopColor="#f6e6b8" stopOpacity="0.32" />
          <stop offset="1" stopColor="#f6e6b8" stopOpacity="0" />
        </radialGradient>
        <mask id="moon-cut">
          <rect width="100" height="100" fill="#fff" />
          <circle cx="58" cy="44" r="21" fill="#000" />
        </mask>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#moon-glow)" />
      <circle cx="50" cy="50" r="22" fill="#f3e6c4" mask="url(#moon-cut)" />
    </svg>
  );
}

/** Vector stand-in for A01: castle left, waterfall right, hills, fog, lavender edges. */
function Landscape({ detailed }: { detailed: boolean }) {
  return (
    <svg className="world-scene__land" viewBox="0 0 400 860" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="land-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2350" />
          <stop offset="1" stopColor="#141633" />
        </linearGradient>
        <linearGradient id="land-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1838" />
          <stop offset="1" stopColor="#0c0f22" />
        </linearGradient>
        <linearGradient id="land-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e0d20" />
          <stop offset="1" stopColor="#060812" />
        </linearGradient>
        <linearGradient id="fall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dfe8f2" stopOpacity="0.75" />
          <stop offset="0.7" stopColor="#9fc3cf" stopOpacity="0.35" />
          <stop offset="1" stopColor="#9fc3cf" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="window-glow">
          <stop offset="0" stopColor="#ffd98f" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffb85c" stopOpacity="0" />
        </radialGradient>
        <filter id="mistblur" x="-100%" y="-5%" width="300%" height="110%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Far range */}
      <path d="M0 560 C40 520 70 532 105 512 C140 492 170 520 205 506 C245 490 280 470 320 494 C350 510 378 500 400 488 V860 H0Z" fill="url(#land-far)" opacity="0.9" />
      {/* Fog over the valley */}
      <ellipse cx="200" cy="560" rx="260" ry="26" fill="#6b5f9e" opacity="0.18" filter="url(#soft)" />

      {detailed ? (
        <g>
          {/* Castle on a cliff, left */}
          <g fill="#120f26">
            <path d="M18 600 L30 540 L52 528 L70 548 L84 600Z" />
            <rect x="38" y="486" width="10" height="52" />
            <path d="M36 486 L43 462 L50 486Z" />
            <rect x="54" y="500" width="13" height="40" />
            <path d="M52 500 L60.5 474 L69 500Z" />
            <rect x="27" y="508" width="9" height="34" />
            <path d="M25.5 508 L31.5 490 L37.5 508Z" />
            <rect x="44" y="515" width="16" height="25" />
          </g>
          <g>
            <circle cx="43" cy="500" r="7" fill="url(#window-glow)" />
            <rect x="42" y="498" width="2" height="3.4" fill="#ffd98f" />
            <circle cx="60.5" cy="514" r="6" fill="url(#window-glow)" />
            <rect x="59.5" y="512" width="2" height="3" fill="#ffd98f" />
            <circle cx="52" cy="526" r="5" fill="url(#window-glow)" opacity="0.8" />
            <rect x="51" y="524.5" width="1.8" height="2.6" fill="#ffcf7a" />
          </g>
          {/* Cliff and waterfall, right */}
          <path d="M318 520 C330 500 352 496 372 508 L400 500 V640 H312Z" fill="#141331" />
          <path d="M340 506 C341 540 338 580 340 628 L355 628 C353 580 353 540 351 506Z" fill="url(#fall)" opacity="0.55" filter="url(#mistblur)" />
          <path d="M344 506 C345 540 343 580 345.5 628 L349.5 628 C348.5 580 348.5 540 347.5 506Z" fill="url(#fall)" opacity="0.8" />
          <ellipse cx="348" cy="626" rx="30" ry="9" fill="#cfe0ea" opacity="0.16" filter="url(#soft)" />
        </g>
      ) : null}

      {/* Mid hills */}
      <path d="M0 640 C60 610 120 628 180 616 C240 604 300 620 350 606 C372 600 388 604 400 600 V860 H0Z" fill="url(#land-mid)" />
      <ellipse cx="200" cy="640" rx="240" ry="20" fill="#4a3f7a" opacity="0.16" filter="url(#soft)" />
      {/* Near ground: the terrace */}
      <path d="M0 700 C90 684 160 694 220 690 C290 686 350 692 400 684 V860 H0Z" fill="url(#land-near)" />

      {detailed ? (
        <g opacity="0.95">
          {/* Lavender and lilies at the lower corners */}
          {LAVENDER.map(([x, h, lean], i) => (
            <g key={i}>
              <path d={`M${x} 860 Q${x + lean * 0.4} ${860 - h * 0.6} ${x + lean} ${860 - h}`} stroke="#1d1a33" strokeWidth="1.6" fill="none" />
              {Array.from({ length: 6 }, (_, k) => (
                <ellipse key={k} cx={x + lean * (0.72 + k * 0.055)} cy={860 - h * (0.72 + k * 0.055)} rx="2.1" ry="3.4" fill={k % 2 ? '#6d4f9e' : '#8a66b8'} opacity={0.55 + k * 0.06} />
              ))}
            </g>
          ))}
          <g fill="#e9e2f2" opacity="0.7">
            <path d="M30 792 c-6 -8 -4 -16 2 -20 c2 6 4 12 -2 20z" />
            <path d="M30 792 c6 -8 10 -12 16 -12 c-3 6 -8 10 -16 12z" />
            <path d="M372 786 c6 -8 4 -16 -2 -20 c-2 6 -4 12 2 20z" />
            <path d="M372 786 c-6 -8 -10 -12 -16 -12 c3 6 8 10 16 12z" />
          </g>
        </g>
      ) : null}
    </svg>
  );
}

/** x, height, lean of lavender stems (lower left and lower right corners). */
const LAVENDER: ReadonlyArray<readonly [number, number, number]> = [
  [8, 120, 10],
  [20, 150, 4],
  [34, 105, 14],
  [48, 82, 18],
  [394, 125, -10],
  [382, 152, -5],
  [368, 108, -14],
  [354, 80, -18],
];
