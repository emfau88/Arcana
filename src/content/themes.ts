import type { Localized, ThemeContent } from './schema.ts';
import type { PositionId } from '../domain/types.ts';

/** G1 ships two of the six P0 themes. The remaining four are listed in CONTENT_INVENTORY.md. */
export const THEMES: readonly ThemeContent[] = [
  {
    id: 'self',
    label: { de: 'Selbstentdeckung', en: 'Self-discovery' },
    description: {
      de: 'Wer du bist und wer du werden möchtest.',
      en: 'Who you are and who you are becoming.',
    },
    readingIntro: {
      de: 'Diese Legung schaut auf dich selbst: wo du stehst, was dich bremst und was dich weiterführt.',
      en: 'This spread looks at yourself: where you stand, what holds you back and what carries you on.',
    },
  },
  {
    id: 'love',
    label: { de: 'Liebe & Beziehungen', en: 'Love & relationships' },
    description: {
      de: 'Nähe, Vertrauen und wie du dich verbindest.',
      en: 'Closeness, trust and how you connect.',
    },
    readingIntro: {
      de: 'Diese Legung schaut auf deine Verbindungen – auf das, was du selbst darin gestalten kannst, nicht auf Gedanken anderer.',
      en: 'This spread looks at your connections – at what you can shape yourself, not at what others think.',
    },
  },
];

export const POSITION_LABELS: Readonly<Record<PositionId, Localized>> = {
  situation: { de: 'Situation', en: 'Situation' },
  challenge: { de: 'Herausforderung', en: 'Challenge' },
  impulse: { de: 'Impuls', en: 'Impulse' },
};
