import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Today: a sun whose lower half is a crescent – day and night of the daily ritual. */
export const IconToday = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2M5.5 5.5l1.5 1.5M17 17l1.5 1.5M18.5 5.5 17 7M7 17l-1.5 1.5" />
  </Svg>
);

/** Oracle: three fanned cards. */
export const IconOracle = (p: IconProps) => (
  <Svg {...p}>
    <rect x="8.5" y="3.5" width="7" height="11" rx="1.2" />
    <path d="M7.2 6.4 3.8 7.6l3 9.6 4.9-1.5" />
    <path d="m16.8 6.4 3.4 1.2-3 9.6-4.9-1.5" />
    <path d="M12 7.2v3.6M10.2 9h3.6" />
  </Svg>
);

/** Discover: a compass star in a ring (IA §2, tab 3). */
export const IconDiscover = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m12 4.6 1.6 5.8 5.8 1.6-5.8 1.6-1.6 5.8-1.6-5.8-5.8-1.6 5.8-1.6z" />
    <path d="m15.4 8.6-1.2 1.2M8.6 15.4l1.2-1.2M8.6 8.6l1.2 1.2M15.4 15.4l-1.2-1.2" strokeWidth={1.1} />
  </Svg>
);

/** Grimoire: bound book with a ribbon. */
export const IconGrimoire = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z" />
    <path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3" />
    <path d="M14.5 3v6l1.5-1.2L17.5 9V3" />
    <path d="m10 9.2.9 1.8 1.9.3-1.4 1.3.3 1.9-1.7-.9-1.7.9.3-1.9-1.4-1.3 1.9-.3z" strokeWidth={1.1} />
  </Svg>
);

/** Profile: a seal with a small star – your sigil. */
export const IconProfile = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="5.6" strokeDasharray="1.2 2.2" />
    <path d="m12 8.6.9 2.5 2.5.9-2.5.9-.9 2.5-.9-2.5-2.5-.9 2.5-.9z" />
  </Svg>
);

export const IconBack = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.5 6 8.5 12l6 6" />
  </Svg>
);

export const IconSparkle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" />
  </Svg>
);

export const IconMoon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />
  </Svg>
);

export const IconQuill = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 4c-6 .5-10.5 4.5-12 11l-1.5 5" />
    <path d="M8 15c3.5-.4 6.5-2.4 8.4-6" />
    <path d="M12.4 6.8C10 8.6 8.7 11.3 8 15" />
  </Svg>
);

export const IconCandle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 10h6v10H9z" />
    <path d="M12 7.5c-1.3-1.2-1-2.8 0-4.5 1 1.7 1.3 3.3 0 4.5z" />
    <path d="M12 7.5V10M7 20h10" />
  </Svg>
);

export const IconEye = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
    <circle cx="12" cy="12" r="2.6" />
  </Svg>
);

export const IconCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const IconInfo = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 8h.01" />
  </Svg>
);
