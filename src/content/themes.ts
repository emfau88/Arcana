import type { Localized, ThemeContent } from './schema.ts';
import type { PositionId } from '../domain/types.ts';

/** The six P0 life themes. Order = order in every theme picker. */
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
  {
    id: 'career',
    label: { de: 'Beruf & Lebensweg', en: 'Career & life path' },
    description: {
      de: 'Arbeit, Fähigkeiten und die Richtung, in die du gehst.',
      en: 'Work, abilities and the direction you are heading in.',
    },
    readingIntro: {
      de: 'Diese Legung schaut auf deinen Weg: was dich gerade beschäftigt, was dich aufhält und welcher Schritt dir offensteht.',
      en: 'This spread looks at your path: what occupies you now, what holds you up and which step is open to you.',
    },
  },
  {
    id: 'change',
    label: { de: 'Veränderung & Entscheidungen', en: 'Change & decisions' },
    description: {
      de: 'Übergänge, Abwägungen und der Mut zum nächsten Schritt.',
      en: 'Transitions, weighing things up and the courage for the next step.',
    },
    readingIntro: {
      de: 'Diese Legung trifft keine Entscheidung für dich. Sie bietet drei Blickwinkel, mit denen du deine eigene Abwägung prüfen kannst.',
      en: 'This spread does not decide for you. It offers three angles from which to test your own weighing-up.',
    },
  },
  {
    id: 'balance',
    label: { de: 'Innere Balance', en: 'Inner balance' },
    description: {
      de: 'Ruhe, Grenzen und das, was dir Kraft gibt.',
      en: 'Calm, boundaries and what gives you strength.',
    },
    readingIntro: {
      de: 'Diese Legung schaut auf dein inneres Gleichgewicht: was dich gerade fordert und was dich wieder sammelt.',
      en: 'This spread looks at your inner balance: what is asking a lot of you right now and what helps you gather yourself.',
    },
  },
  {
    id: 'creativity',
    label: { de: 'Kreativität & Wachstum', en: 'Creativity & growth' },
    description: {
      de: 'Ideen, Neugier und das, was in dir wachsen will.',
      en: 'Ideas, curiosity and what wants to grow in you.',
    },
    readingIntro: {
      de: 'Diese Legung schaut auf das, was entstehen möchte: wo dein Funke liegt, was ihn dämpft und wie er Raum bekommt.',
      en: 'This spread looks at what wants to come into being: where your spark lies, what dims it and how it can find room.',
    },
  },
];

export const POSITION_LABELS: Readonly<Record<PositionId, Localized>> = {
  situation: { de: 'Situation', en: 'Situation' },
  challenge: { de: 'Herausforderung', en: 'Challenge' },
  impulse: { de: 'Impuls', en: 'Next step' },
};
