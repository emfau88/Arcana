import type { CardContent } from './schema.ts';

/**
 * G1 vertical slice: three representative cards with deliberately different light
 * (twilight · shadow · light). Texts are original, written for this project.
 * Tone: symbolic reflection, never prediction, diagnosis or claims about other people.
 */
export const CARDS: readonly CardContent[] = [
  {
    id: 'major-02-high-priestess',
    deckId: 'nocturne',
    order: 2,
    assetId: 'card-high-priestess',
    tone: 'twilight',
    title: { de: 'Die Hohepriesterin', en: 'The High Priestess' },
    essence: {
      de: 'Stille, Intuition und das, was noch nicht ausgesprochen ist.',
      en: 'Stillness, intuition and what has not yet been spoken.',
    },
    themes: {
      self: {
        de: 'Nicht jede Antwort liegt an der Oberfläche. Gib dem Leisen in dir einen Moment Raum, bevor du dich festlegst. Was du bereits ahnst, darf zunächst eine Vermutung bleiben – prüfe sie, statt sie wegzuwischen.',
        en: 'Not every answer lies on the surface. Give the quiet part of you a moment of room before you commit. What you already sense may stay a hunch for now – test it rather than brushing it aside.',
      },
      love: {
        de: 'Du musst nicht jede Unklarheit sofort auflösen. Achte darauf, welche Fragen zwischen euch noch offen sind und welche Antworten du bereits vermutest. Unterscheide Vermutung von dem, was du tatsächlich weißt.',
        en: 'You do not have to resolve every uncertainty right away. Notice which questions are still open between you, and which answers you already suspect. Distinguish what you know from what you assume.',
      },
    },
    positions: {
      situation: {
        de: 'Unter der Oberfläche bewegt sich mehr, als bisher ausgesprochen wurde.',
        en: 'More is moving beneath the surface than has been said so far.',
      },
      challenge: {
        de: 'Der Wunsch nach einer sofortigen Antwort kann den Blick auf Alternativen verengen.',
        en: 'The wish for an immediate answer can narrow your view of the alternatives.',
      },
      impulse: {
        de: 'Halte inne und höre zu – auch dem, was zwischen den Worten liegt.',
        en: 'Pause and listen – including to what lies between the words.',
      },
    },
    reflection: {
      de: 'Welche Information fehlt mir, bevor ich eine Entscheidung treffe?',
      en: 'What information am I missing before I make a decision?',
    },
    ritual: {
      de: 'Nimm dir zwei ruhige Minuten und notiere einen Gedanken, dem du heute Aufmerksamkeit schenken möchtest.',
      en: 'Take two quiet minutes and write down one thought you want to give your attention to today.',
    },
  },
  {
    id: 'major-16-tower',
    deckId: 'nocturne',
    order: 16,
    assetId: 'card-tower',
    tone: 'shadow',
    title: { de: 'Der Turm', en: 'The Tower' },
    essence: {
      de: 'Plötzliche Klarheit, wenn ein brüchiges Gefüge nachgibt.',
      en: 'Sudden clarity as a fragile structure gives way.',
    },
    themes: {
      self: {
        de: 'Manchmal zeigt sich erst im Umbruch, was wirklich trägt. Wenn eine Gewissheit gerade wackelt, musst du sie nicht krampfhaft festhalten. Frage dich, welcher Teil davon schon länger nicht mehr zu dir passt.',
        en: 'Sometimes it takes an upheaval to show what truly holds. If a certainty is shaking right now, you don’t have to cling to it. Ask yourself which part of it stopped fitting you a while ago.',
      },
      love: {
        de: 'Ein offenes Wort kann zunächst unbequem sein und trotzdem Luft schaffen. Wenn sich in einer Beziehung etwas verschiebt, schau genau hin, statt die Risse zu übermalen. Ehrlichkeit braucht dabei keine Härte.',
        en: 'An honest word can be uncomfortable at first and still let air in. If something is shifting in a relationship, look closely rather than painting over the cracks. Honesty does not need to be harsh.',
      },
    },
    positions: {
      situation: {
        de: 'Etwas, das stabil wirkte, zeigt Risse – oder hat sie schon länger.',
        en: 'Something that seemed solid is showing cracks – or has been for a while.',
      },
      challenge: {
        de: 'Die Angst vor dem Einsturz kann dich an etwas festhalten lassen, das dich nicht mehr trägt.',
        en: 'Fear of collapse can keep you holding on to something that no longer carries you.',
      },
      impulse: {
        de: 'Lass zu, dass sich Überholtes löst, und baue auf dem, was standhält.',
        en: 'Let what is outdated fall away, and build on what stands firm.',
      },
    },
    reflection: {
      de: 'Welche Gewissheit darf ich heute ehrlich überprüfen?',
      en: 'Which certainty can I honestly re-examine today?',
    },
    ritual: {
      de: 'Schreibe eine Annahme über dich auf. Streiche ein Wort darin, das nicht mehr stimmt, und lies den Satz neu.',
      en: 'Write down one assumption you hold about yourself. Cross out a word that is no longer true and read the sentence again.',
    },
  },
  {
    id: 'major-19-sun',
    deckId: 'nocturne',
    order: 19,
    assetId: 'card-sun',
    tone: 'light',
    title: { de: 'Die Sonne', en: 'The Sun' },
    essence: {
      de: 'Wärme, Lebensfreude und ein klarer Blick.',
      en: 'Warmth, vitality and a clear view.',
    },
    themes: {
      self: {
        de: 'Etwas darf gerade leicht sein. Bemerke, wo du dich lebendig und sichtbar fühlst, ohne es sofort zu bewerten. Freude ist kein Lohn, den du dir erst verdienen musst.',
        en: 'Something is allowed to feel light right now. Notice where you feel alive and visible, without judging it straight away. Joy is not a reward you first have to earn.',
      },
      love: {
        de: 'Wärme wächst dort, wo sie gezeigt wird. Vielleicht ist jetzt ein guter Moment, Zuneigung offen auszusprechen – ohne eine bestimmte Antwort zu erwarten. Kleine, ehrliche Gesten zählen mehr als große Pläne.',
        en: 'Warmth grows where it is shown. This may be a good moment to express affection openly – without expecting a particular answer. Small, honest gestures count for more than grand plans.',
      },
    },
    positions: {
      situation: {
        de: 'In dieser Lage steckt mehr Licht, als du ihr gerade zugestehst.',
        en: 'There is more light in this situation than you are currently granting it.',
      },
      challenge: {
        de: 'Der Wunsch, immer zu strahlen, kann verdecken, was noch Pflege braucht.',
        en: 'The wish to shine at all times can hide what still needs care.',
      },
      impulse: {
        de: 'Zeig dich so, wie du bist, und teile, was dich wärmt.',
        en: 'Show yourself as you are, and share what warms you.',
      },
    },
    reflection: {
      de: 'Wo darf ich mir heute erlauben, einfach froh zu sein?',
      en: 'Where can I allow myself to simply be glad today?',
    },
    ritual: {
      de: 'Stell dich für einen Atemzug ans Fenster oder ins Licht und benenne still drei Dinge, die heute gut sind.',
      en: 'Stand by a window or in the light for one breath and silently name three things that are good today.',
    },
  },
];
