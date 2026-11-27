/**
 * Modul spreads, Deutsch (V05.2). Rahmen der Legungen: Rollennamen, Name, Kurzbeschreibung und
 * Einleitung je Legung, Name und Frage je Position. Die Kartentexte kommen aus core (R1–R3) und
 * cards-deep (R4–R8). Keine Position verspricht ein Ergebnis oder weiß, was andere denken.
 * „Zwei Wege“ und „Verbindung“ sind Edition-Legungen und erscheinen nur mit diesem Recht.
 */
import type { TextTable } from './registry.ts';

export const texts: TextTable = {
  // ---- Rollen R1–R8 (Kartenseite, Stufe 3)
  'role.situation.label': 'Kern',
  'role.challenge.label': 'Herausforderung',
  'role.impulse.label': 'Impuls',
  'role.light.label': 'Licht',
  'role.shadow.label': 'Schatten',
  'role.root.label': 'Wurzel',
  'role.possibility.label': 'Möglichkeit',
  'role.bridge.label': 'Brücke',

  // ---- Drei Karten (Positionen und Einleitung aus core)
  'spread.classic-3.name': 'Drei Karten',
  'spread.classic-3.tagline': 'Situation, Herausforderung und nächster Schritt für eine offene Frage.',

  // ---- Licht und Schatten
  'spread.light-shadow-3.name': 'Licht und Schatten',
  'spread.light-shadow-3.tagline': 'Was dich trägt, was du vielleicht übersiehst und was beides verbindet.',
  'spread.light-shadow-3.intro':
    'Diese Legung schaut auf beide Seiten derselben Lage. Die erste Karte zeigt, was dich trägt, die zweite, was im Schatten liegt, und die dritte, wie beides zusammenfinden kann.',
  'pos.light-shadow-3.1.label': 'Licht',
  'pos.light-shadow-3.1.question': 'Was trägt dich?',
  'pos.light-shadow-3.2.label': 'Schatten',
  'pos.light-shadow-3.2.question': 'Was übersiehst du vielleicht?',
  'pos.light-shadow-3.3.label': 'Brücke',
  'pos.light-shadow-3.3.question': 'Was verbindet beide Seiten?',

  // ---- Neuanfang
  'spread.new-beginning-4.name': 'Neuanfang',
  'spread.new-beginning-4.tagline': 'Für Übergänge: was endet, was bleibt, was beginnt und womit du anfangen kannst.',
  'spread.new-beginning-4.intro':
    'Ein Neuanfang beginnt selten bei null. Diese Legung ordnet, was zu Ende geht, was du mitnimmst und was sich öffnen könnte, und endet mit einem ersten Schritt.',
  'pos.new-beginning-4.1.label': 'Was endet',
  'pos.new-beginning-4.1.question': 'Was darf zu Ende gehen?',
  'pos.new-beginning-4.2.label': 'Was bleibt',
  'pos.new-beginning-4.2.question': 'Was nimmst du mit?',
  'pos.new-beginning-4.3.label': 'Was beginnt',
  'pos.new-beginning-4.3.question': 'Was könnte sich öffnen?',
  'pos.new-beginning-4.4.label': 'Erster Schritt',
  'pos.new-beginning-4.4.question': 'Womit kannst du anfangen?',

  // ---- Rückblick (ab Reisetag 7 bzw. 30, aus den eigenen Karten)
  'spread.review-week.name': 'Rückblick auf die Woche',
  'spread.review-week.tagline': 'Deine Karten der letzten sieben Reisetage und eine neue Karte für das, was jetzt dran ist.',
  'spread.review-week.intro':
    'Diese Legung beginnt mit deinen eigenen Karten der letzten sieben Reisetage. Die Karte, die dir darin am häufigsten begegnet ist, zeigt, was nachwirkt, und eine neue Karte schaut auf das, was jetzt dran ist.',
  'pos.review-week.1.label': 'Was nachwirkt',
  'pos.review-week.1.question': 'Was wirkt aus diesen Tagen nach?',
  'pos.review-week.2.label': 'Was jetzt dran ist',
  'pos.review-week.2.question': 'Welcher nächste Schritt ist möglich?',
  'review.week.past': 'Deine Woche in Karten',
  'spread.review-month.name': 'Rückblick auf den Monat',
  'spread.review-month.tagline': 'Deine Karten der letzten dreißig Reisetage und eine neue Karte für das, was jetzt dran ist.',
  'spread.review-month.intro':
    'Ein Monat hinterlässt mehr Spuren, als man im Alltag bemerkt. Aus deinen eigenen Karten tritt die hervor, die dich am häufigsten begleitet hat, und eine neue Karte fragt, was du daraus mitnehmen möchtest.',
  'pos.review-month.1.label': 'Was dich begleitet hat',
  'pos.review-month.1.question': 'Was wirkt aus diesem Monat nach?',
  'pos.review-month.2.label': 'Was jetzt dran ist',
  'pos.review-month.2.question': 'Was möchtest du mitnehmen?',
  'review.month.past': 'Dein Monat in Karten',

  // ---- Zwei Wege (Edition, Thema Veränderung & Entscheidungen)
  'spread.two-ways-5.name': 'Zwei Wege',
  'spread.two-ways-5.tagline': 'Für eine Entscheidung: was jeder Weg in dir anspricht, ohne Vorhersage.',
  'spread.two-ways-5.intro':
    'Diese Legung sagt nicht, welcher Weg richtig ist. Sie zeigt, was jeder Weg in dir anspricht, was dir wirklich wichtig ist und welcher Rat dir beim Abwägen helfen kann.',
  'pos.two-ways-5.1.label': 'Die Frage',
  'pos.two-ways-5.1.question': 'Was steht im Mittelpunkt deiner Entscheidung?',
  'pos.two-ways-5.2.label': 'Weg A',
  'pos.two-ways-5.2.question': 'Was spricht dieser Weg in dir an?',
  'pos.two-ways-5.3.label': 'Weg B',
  'pos.two-ways-5.3.question': 'Was berührt dieser Weg in dir?',
  'pos.two-ways-5.4.label': 'Was wirklich zählt',
  'pos.two-ways-5.4.question': 'Was ist dir dabei wirklich wichtig?',
  'pos.two-ways-5.5.label': 'Rat',
  'pos.two-ways-5.5.question': 'Was kann dir beim Abwägen helfen?',

  // ---- Verbindung (Edition, Thema Liebe & Beziehungen): nur die eigene Seite
  'spread.connection-5.name': 'Verbindung',
  'spread.connection-5.tagline': 'Für eine Beziehung, aus deiner Sicht: was du gibst, was du brauchst und was euch verbindet.',
  'spread.connection-5.intro':
    'Diese Legung schaut nur auf deine Seite einer Verbindung. Über Gedanken und Gefühle der anderen Person sagt sie nichts. Sie hilft dir, deinen eigenen Anteil klarer zu sehen.',
  'pos.connection-5.1.label': 'Ich',
  'pos.connection-5.1.question': 'Wo stehst du gerade in dieser Verbindung?',
  'pos.connection-5.2.label': 'Die Verbindung',
  'pos.connection-5.2.question': 'Was verbindet euch?',
  'pos.connection-5.3.label': 'Was ich gebe',
  'pos.connection-5.3.question': 'Was bringst du ein?',
  'pos.connection-5.4.label': 'Was ich brauche',
  'pos.connection-5.4.question': 'Was übersiehst du vielleicht an deinen eigenen Bedürfnissen?',
  'pos.connection-5.5.label': 'Impuls',
  'pos.connection-5.5.question': 'Welcher nächste Schritt liegt bei dir?',
};
