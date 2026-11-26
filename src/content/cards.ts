import type { CardContent } from './schema.ts';

/**
 * II, XVI and XIX – the three cards of the G1 slice (twilight · shadow · light); the rest of
 * the deck lives in cards-a/b/c.ts. Texts are original, written for this project.
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
      career: {
        de: 'Im Beruf zählt heute vielleicht weniger das schnelle Handeln als das genaue Hinsehen. Sammle, was du beobachtest, bevor du es bewertest. Dein Gespür für Zwischentöne kann ein echter Beitrag sein.',
        en: 'At work, careful observation may count for more today than quick action. Gather what you notice before you judge it. Your feel for nuance can be a real contribution.',
      },
      change: {
        de: 'Eine Entscheidung muss nicht heute fallen, wenn wichtige Informationen noch fehlen. Schreib auf, was du weißt und was du nur vermutest. Oft wird der nächste Schritt klarer, wenn beides getrennt vor dir liegt.',
        en: 'A decision does not have to be made today if important information is still missing. Write down what you know and what you only suspect. The next step often becomes clearer once the two lie side by side.',
      },
      balance: {
        de: 'Stille ist kein Stillstand. Gönn dir einen Moment ohne neue Eindrücke und beobachte, was dann auftaucht. Was leise ist, braucht manchmal nur etwas Platz, um gehört zu werden.',
        en: 'Stillness is not standing still. Allow yourself a moment without new input and notice what comes up. What is quiet sometimes only needs a little room to be heard.',
      },
      creativity: {
        de: 'Ideen reifen oft im Verborgenen. Halte eine halbfertige Idee fest, ohne sie gleich zu zeigen oder zu bewerten. Was im Stillen wächst, darf erst einmal dir gehören.',
        en: 'Ideas often ripen out of sight. Hold on to a half-formed idea without showing or judging it straight away. What grows in quiet is allowed to belong to you first.',
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
      career: {
        de: 'Wenn ein Plan im Beruf ins Wanken gerät, zeigt sich, worauf du wirklich bauen kannst. Prüfe, welche Annahme sich gerade als brüchig erweist. Ein Umbau kann mühsam sein und trotzdem zu etwas Stabilerem führen.',
        en: 'When a plan at work starts to wobble, it shows what you can really build on. Check which assumption is turning out to be fragile. Rebuilding can be hard work and still lead to something more stable.',
      },
      change: {
        de: 'Manche Veränderung kündigt sich nicht an, sondern ist plötzlich da. Du musst nicht sofort alles neu ordnen. Sichere zuerst, was trägt, und entscheide den Rest Schritt für Schritt.',
        en: 'Some changes give no warning – they are simply there. You do not have to reorder everything at once. Secure what still holds first, and decide the rest step by step.',
      },
      balance: {
        de: 'Wenn vieles gleichzeitig ins Rutschen gerät, hilft ein fester Punkt. Das kann ein Atemzug, ein vertrauter Ort oder ein Gespräch sein. Du darfst Unruhe spüren, ohne dich von ihr steuern zu lassen.',
        en: 'When a lot starts to slide at once, a fixed point helps. It might be a breath, a familiar place or a conversation. You can feel unrest without letting it steer you.',
      },
      creativity: {
        de: 'Manchmal muss eine alte Form zerbrechen, damit etwas Eigenes entstehen kann. Wenn ein Projekt nicht mehr passt, darfst du es auseinandernehmen. Aus den Bruchstücken lässt sich oft Überraschendes bauen.',
        en: 'Sometimes an old form has to break so that something of your own can emerge. If a project no longer fits, you may take it apart. Surprising things can often be built from the pieces.',
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
      career: {
        de: 'Was dir leichtfällt, ist nicht weniger wert. Zeig heute etwas von dem, was du gut kannst, ohne dich kleiner zu machen. Sichtbarkeit beginnt oft mit einem einzigen klaren Beitrag.',
        en: 'What comes easily to you is worth no less. Show something of what you do well today, without making yourself smaller. Visibility often begins with a single clear contribution.',
      },
      change: {
        de: 'Eine Entscheidung darf sich auch gut anfühlen. Achte darauf, welche Möglichkeit dir Energie gibt und welche sie dir nimmt. Freude ist kein Beweis, aber ein wertvoller Hinweis.',
        en: 'A decision is allowed to feel good, too. Notice which option gives you energy and which one drains it. Joy is no proof, but it is a valuable hint.',
      },
      balance: {
        de: 'Wärme wirkt oft schneller als jeder Plan. Such dir heute etwas, das dir guttut, und lass es klein und einfach sein. Ein heller Moment am Tag kann viel ausgleichen.',
        en: 'Warmth often works faster than any plan. Find something today that does you good, and let it be small and simple. One bright moment in a day can balance out a lot.',
      },
      creativity: {
        de: 'Spiel ist ein ernstzunehmender Anfang. Probier etwas aus, ohne dass am Ende ein Ergebnis stehen muss. Was dir dabei Freude macht, zeigt dir, wohin deine Neugier will.',
        en: 'Play is a serious beginning. Try something out without needing a result at the end. Whatever brings you joy along the way shows you where your curiosity wants to go.',
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
