import type { QuestionContent } from './schema.ts';

/**
 * Four voluntary questions, four answers each. Every archetype is the primary (+2)
 * weight of exactly two answers and the secondary (+1) weight of exactly two answers,
 * so all eight are reachable and none is structurally favoured (tested).
 */
export const QUESTIONS: readonly QuestionContent[] = [
  {
    id: 'q-calling',
    prompt: {
      de: 'Was ruft dich in dieser Zeit am stärksten?',
      en: 'What is calling you most strongly these days?',
    },
    answers: [
      { id: 'a-question', label: { de: 'Eine Frage, die mich nicht loslässt', en: 'A question that won’t let me go' }, primary: 'seeker', secondary: 'sage' },
      { id: 'a-create', label: { de: 'Etwas, das ich erschaffen möchte', en: 'Something I want to bring into being' }, primary: 'creator', secondary: 'visionary' },
      { id: 'a-close', label: { de: 'Ein Kapitel, das ich abschließen will', en: 'A chapter I’m ready to close' }, primary: 'renewer', secondary: 'alchemist' },
      { id: 'a-people', label: { de: 'Menschen, für die ich da sein möchte', en: 'People I want to be there for' }, primary: 'guardian', secondary: 'wanderer' },
    ],
  },
  {
    id: 'q-decision',
    prompt: {
      de: 'Vor einer Entscheidung vertraust du zuerst …',
      en: 'Facing a decision, you first trust …',
    },
    answers: [
      { id: 'a-image', label: { de: '… dem Bild, das sich in mir zeigt', en: '… the image that rises within me' }, primary: 'visionary', secondary: 'seeker' },
      { id: 'a-transform', label: { de: '… meiner Kraft, aus Schwerem Wertvolles zu machen', en: '… my power to turn the difficult into something of value' }, primary: 'alchemist', secondary: 'renewer' },
      { id: 'a-path', label: { de: '… dem Weg, der sich beim Gehen zeigt', en: '… the path that appears as I walk' }, primary: 'wanderer', secondary: 'creator' },
      { id: 'a-known', label: { de: '… dem, was ich weiß und geprüft habe', en: '… what I know and have tested' }, primary: 'sage', secondary: 'guardian' },
    ],
  },
  {
    id: 'q-place',
    prompt: {
      de: 'Welcher Ort zieht dich an?',
      en: 'Which place draws you in?',
    },
    answers: [
      { id: 'a-road', label: { de: 'Eine Straße im ersten Morgenlicht', en: 'A road at first light' }, primary: 'wanderer', secondary: 'seeker' },
      { id: 'a-library', label: { de: 'Eine stille Bibliothek bei Kerzenschein', en: 'A quiet library by candlelight' }, primary: 'sage', secondary: 'alchemist' },
      { id: 'a-workshop', label: { de: 'Eine Werkstatt voller halbfertiger Ideen', en: 'A workshop full of half-finished ideas' }, primary: 'creator', secondary: 'wanderer' },
      { id: 'a-garden', label: { de: 'Ein Garten nach dem ersten Regen', en: 'A garden after the first rain' }, primary: 'renewer', secondary: 'visionary' },
    ],
  },
  {
    id: 'q-invite',
    prompt: {
      de: 'Was möchtest du mehr in dein Leben holen?',
      en: 'What would you like to invite more of into your life?',
    },
    answers: [
      { id: 'a-shelter', label: { de: 'Geborgenheit und Verlässlichkeit', en: 'Shelter and steadiness' }, primary: 'guardian', secondary: 'sage' },
      { id: 'a-direction', label: { de: 'Klarheit über meine eigene Richtung', en: 'Clarity about my own direction' }, primary: 'seeker', secondary: 'creator' },
      { id: 'a-intuition', label: { de: 'Mut, meiner Intuition zu folgen', en: 'Courage to follow my intuition' }, primary: 'visionary', secondary: 'renewer' },
      { id: 'a-heavy', label: { de: 'Die Kraft, Schweres zu verwandeln', en: 'The strength to transform what feels heavy' }, primary: 'alchemist', secondary: 'guardian' },
    ],
  },
];
