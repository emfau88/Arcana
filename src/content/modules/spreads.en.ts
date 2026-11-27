/**
 * Module spreads, English (V05.2). Spread frames: role names, name, tagline and intro per spread,
 * label and question per position. Card texts come from core (R1–R3) and cards-deep (R4–R8).
 * No position promises an outcome or claims to know what others think. "Two paths" and
 * "Connection" are edition spreads and only appear with that right.
 */
import type { TextTable } from './registry.ts';

export const texts: TextTable = {
  // ---- Roles R1–R8 (card page, level 3)
  'role.situation.label': 'Core',
  'role.challenge.label': 'Challenge',
  'role.impulse.label': 'Next step',
  'role.light.label': 'Light',
  'role.shadow.label': 'Shadow',
  'role.root.label': 'Root',
  'role.possibility.label': 'Possibility',
  'role.bridge.label': 'Bridge',

  // ---- Three cards (positions and intro from core)
  'spread.classic-3.name': 'Three cards',
  'spread.classic-3.tagline': 'Situation, challenge and next step for an open question.',

  // ---- Light and shadow
  'spread.light-shadow-3.name': 'Light and shadow',
  'spread.light-shadow-3.tagline': 'What carries you, what you may be overlooking and what joins the two.',
  'spread.light-shadow-3.intro':
    'This spread looks at both sides of the same situation. The first card shows what carries you, the second what lies in shadow, and the third how the two can come together.',
  'pos.light-shadow-3.1.label': 'Light',
  'pos.light-shadow-3.1.question': 'What carries you?',
  'pos.light-shadow-3.2.label': 'Shadow',
  'pos.light-shadow-3.2.question': 'What might you be overlooking?',
  'pos.light-shadow-3.3.label': 'Bridge',
  'pos.light-shadow-3.3.question': 'What joins the two sides?',

  // ---- New beginning
  'spread.new-beginning-4.name': 'New beginning',
  'spread.new-beginning-4.tagline': 'For transitions: what ends, what stays, what begins and where you can start.',
  'spread.new-beginning-4.intro':
    'A new beginning rarely starts from zero. This spread sorts out what is ending, what you take with you and what could open up, and closes with a first step.',
  'pos.new-beginning-4.1.label': 'What ends',
  'pos.new-beginning-4.1.question': 'What may come to an end?',
  'pos.new-beginning-4.2.label': 'What stays',
  'pos.new-beginning-4.2.question': 'What do you take with you?',
  'pos.new-beginning-4.3.label': 'What begins',
  'pos.new-beginning-4.3.question': 'What could open up?',
  'pos.new-beginning-4.4.label': 'First step',
  'pos.new-beginning-4.4.question': 'Where can you start?',

  // ---- Looking back (from journey day 7 or 30, from your own cards)
  'spread.review-week.name': 'Looking back on the week',
  'spread.review-week.tagline': 'Your cards of the last seven journey days and one new card for what matters now.',
  'spread.review-week.intro':
    'This spread starts with your own cards from the last seven journey days. The card you met most often among them shows what lingers, and one new card looks at what matters now.',
  'pos.review-week.1.label': 'What lingers',
  'pos.review-week.1.question': 'What lingers from these days?',
  'pos.review-week.2.label': 'What matters now',
  'pos.review-week.2.question': 'What next step is possible?',
  'review.week.past': 'Your week in cards',
  'spread.review-month.name': 'Looking back on the month',
  'spread.review-month.tagline': 'Your cards of the last thirty journey days and one new card for what matters now.',
  'spread.review-month.intro':
    'A month leaves more traces than everyday life lets you notice. From your own cards, the one that came with you most often steps forward, and a new card asks what you want to take from it.',
  'pos.review-month.1.label': 'What came with you',
  'pos.review-month.1.question': 'What lingers from this month?',
  'pos.review-month.2.label': 'What matters now',
  'pos.review-month.2.question': 'What do you want to take with you?',
  'review.month.past': 'Your month in cards',

  // ---- Two paths (edition, theme change & decisions)
  'spread.two-ways-5.name': 'Two paths',
  'spread.two-ways-5.tagline': 'For a decision: what each path stirs in you, without any prediction.',
  'spread.two-ways-5.intro':
    'This spread does not say which path is right. It shows what each path stirs in you, what truly matters to you and which advice can help you weigh them up.',
  'pos.two-ways-5.1.label': 'The question',
  'pos.two-ways-5.1.question': 'What is at the heart of your decision?',
  'pos.two-ways-5.2.label': 'Path A',
  'pos.two-ways-5.2.question': 'What does this path stir in you?',
  'pos.two-ways-5.3.label': 'Path B',
  'pos.two-ways-5.3.question': 'What does this path touch in you?',
  'pos.two-ways-5.4.label': 'What truly matters',
  'pos.two-ways-5.4.question': 'What truly matters to you here?',
  'pos.two-ways-5.5.label': 'Advice',
  'pos.two-ways-5.5.question': 'What can help you weigh it up?',

  // ---- Connection (edition, theme love & relationships): your own side only
  'spread.connection-5.name': 'Connection',
  'spread.connection-5.tagline': 'For a relationship, from your side: what you give, what you need and what connects you.',
  'spread.connection-5.intro':
    "This spread looks only at your side of a connection. It says nothing about the other person's thoughts or feelings. It helps you see your own part more clearly.",
  'pos.connection-5.1.label': 'Me',
  'pos.connection-5.1.question': 'Where do you stand in this connection right now?',
  'pos.connection-5.2.label': 'The connection',
  'pos.connection-5.2.question': 'What connects the two of you?',
  'pos.connection-5.3.label': 'What I give',
  'pos.connection-5.3.question': 'What are you bringing to it?',
  'pos.connection-5.4.label': 'What I need',
  'pos.connection-5.4.question': 'What might you be overlooking about your own needs?',
  'pos.connection-5.5.label': 'Next step',
  'pos.connection-5.5.question': 'What next step is yours to take?',
};
