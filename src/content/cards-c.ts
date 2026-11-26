import { major } from './define.ts';
import type { CardContent } from './schema.ts';

/** Major arcana 17, 18, 20 and 21 (XVI and XIX live in cards.ts). Original texts, written for this project. */
export const CARDS_C: readonly CardContent[] = [
  major(17, 'star', 'twilight', {
    title: { de: 'Der Stern', en: 'The Star' },
    essence: {
      de: 'Hoffnung, Erneuerung und ein ruhiges Licht nach dem Sturm.',
      en: 'Hope, renewal and a calm light after the storm.',
    },
    themes: {
      self: {
        de: 'Nach einer schweren Zeit darf wieder Zuversicht wachsen. Erlaube dir, an etwas Gutes zu glauben, ohne es schon beweisen zu müssen. Hoffnung ist eine leise, aber verlässliche Kraft.',
        en: 'After a hard time, confidence may grow again. Allow yourself to believe in something good without having to prove it yet. Hope is a quiet but reliable strength.',
      },
      love: {
        de: 'Offenheit und Vertrauen dürfen langsam zurückkehren. Zeig dich so, wie du bist, ohne Masken. Echtheit kann eine Verbindung vertiefen.',
        en: 'Openness and trust may return slowly. Show yourself as you are, without masks. Authenticity can deepen a connection.',
      },
      career: {
        de: 'Ein langfristiges Ziel kann wie ein Leitstern wirken. Erinnere dich daran, warum du einen Weg eingeschlagen hast. Diese Klarheit gibt dir Ausdauer für die nächsten Schritte.',
        en: 'A long-term goal can act like a guiding star. Remind yourself why you set out on a path. That clarity gives you stamina for the next steps.',
      },
      change: {
        de: 'Nach einem Umbruch zeigt sich oft ein neues Licht. Lass dir Zeit, dich neu auszurichten. Du musst nicht alles sofort wissen, ein erster heller Punkt reicht zur Orientierung.',
        en: 'After an upheaval, a new light often appears. Give yourself time to reorient. You do not have to know everything at once – one bright point is enough to steer by.',
      },
      balance: {
        de: 'Erholung braucht Zeit und Vertrauen. Gönn dir heute etwas, das dich auffüllt, statt dich weiter zu fordern. Ruhige Stunden sind kein verlorener Tag.',
        en: 'Recovery takes time and trust. Allow yourself something today that refills you instead of asking more of you. Quiet hours are not a lost day.',
      },
      creativity: {
        de: 'Inspiration kommt oft, wenn du offen bist. Schau in den Himmel, hör Musik oder geh ohne Ziel hinaus. Lass dich von etwas Schönem daran erinnern, warum du gestaltest.',
        en: 'Inspiration often comes when you are open. Look at the sky, listen to music or go outside without a goal. Let something beautiful remind you why you create.',
      },
    },
    positions: {
      situation: {
        de: 'Nach einer unruhigen Zeit öffnet sich wieder ein ruhiger Raum.',
        en: 'After a restless time, a calm space is opening again.',
      },
      challenge: {
        de: 'Zweifel können verhindern, dass du dem neuen Licht vertraust.',
        en: 'Doubt can stop you from trusting the new light.',
      },
      impulse: {
        de: 'Vertraue der Hoffnung und folge dem hellsten Punkt, den du siehst.',
        en: 'Trust in hope and follow the brightest point you can see.',
      },
    },
    reflection: {
      de: 'Woran glaube ich, auch wenn ich es noch nicht sehen kann?',
      en: 'What do I believe in, even though I cannot see it yet?',
    },
    ritual: {
      de: 'Schau heute Abend in den Himmel oder auf ein Licht und denk an einen Wunsch, der dir wichtig ist.',
      en: 'Look at the sky or at a light this evening and think of a wish that matters to you.',
    },
  }),

  major(18, 'moon', 'shadow', {
    title: { de: 'Der Mond', en: 'The Moon' },
    essence: {
      de: 'Unsicherheit, Träume und Wege, die man nur im Halbdunkel erkennt.',
      en: 'Uncertainty, dreams and paths you only see in half-light.',
    },
    themes: {
      self: {
        de: 'Nicht alles ist gerade klar, und das ist in Ordnung. Gefühle und Ahnungen können im Halbdunkel lauter werden. Unterscheide behutsam zwischen dem, was du fühlst, und dem, was du sicher weißt.',
        en: 'Not everything is clear right now, and that is all right. Feelings and hunches can grow louder in half-light. Gently tell apart what you feel from what you know for sure.',
      },
      love: {
        de: 'Wo Unsicherheit herrscht, wachsen schnell Vermutungen. Prüfe, ob deine Sorgen auf Tatsachen beruhen oder auf Ängsten. Eine ehrliche Frage klärt oft mehr als langes Grübeln.',
        en: 'Where there is uncertainty, assumptions grow quickly. Check whether your worries rest on facts or on fears. An honest question often clears up more than long brooding.',
      },
      career: {
        de: 'Wenn die Lage unübersichtlich ist, helfen kleine, überprüfbare Schritte. Hol dir die Informationen, die dir fehlen, bevor du Großes entscheidest. Auch dein Bauchgefühl verdient Beachtung.',
        en: 'When the situation is unclear, small, verifiable steps help. Get the information you are missing before deciding anything big. Your gut feeling deserves attention, too.',
      },
      change: {
        de: 'Du siehst den Weg nicht ganz, aber den nächsten Abschnitt. Geh vorsichtig und bleib aufmerksam. Diese Karte ersetzt keine verlässlichen Informationen, sie lädt nur zum genauen Hinsehen ein.',
        en: 'You cannot see the whole path, but you can see the next stretch. Go carefully and stay alert. This card does not replace reliable information; it only invites you to look closely.',
      },
      balance: {
        de: 'Unruhige Gedanken mögen die Nacht. Schreib sie auf, bevor du schlafen gehst, damit sie nicht kreisen müssen. Am Morgen sieht manches anders aus.',
        en: 'Restless thoughts like the night. Write them down before you go to sleep so they do not have to circle. Many things look different in the morning.',
      },
      creativity: {
        de: 'Träume und innere Bilder sind wertvoller Stoff. Halte fest, was dir im Halbschlaf oder beim Tagträumen begegnet. Nicht alles muss Sinn ergeben, um zu inspirieren.',
        en: 'Dreams and inner images are valuable material. Capture what comes to you half-asleep or while daydreaming. Not everything has to make sense to inspire.',
      },
    },
    positions: {
      situation: {
        de: 'Die Lage ist undurchsichtig, und nicht alles ist, wie es scheint.',
        en: 'The situation is unclear, and not everything is as it seems.',
      },
      challenge: {
        de: 'Ängste können Schatten größer erscheinen lassen, als sie sind.',
        en: 'Fears can make shadows look larger than they are.',
      },
      impulse: {
        de: 'Geh langsam, prüfe, was du siehst, und vertrau deinem Gespür.',
        en: 'Go slowly, check what you see, and trust your sense of things.',
      },
    },
    reflection: {
      de: 'Welche meiner Sorgen beruht auf einer Annahme, die ich prüfen könnte?',
      en: 'Which of my worries rests on an assumption I could check?',
    },
    ritual: {
      de: 'Leg heute Abend Papier neben dein Bett und notiere morgen früh das erste Bild oder Gefühl, das du aus der Nacht mitbringst.',
      en: 'Put paper next to your bed tonight and tomorrow morning note the first image or feeling you bring with you from the night.',
    },
  }),

  major(20, 'judgement', 'light', {
    title: { de: 'Das Gericht', en: 'Judgement' },
    essence: {
      de: 'Erwachen, Rückschau und der Ruf zu einem neuen Kapitel.',
      en: 'Awakening, looking back and the call to a new chapter.',
    },
    themes: {
      self: {
        de: 'Schau zurück und erkenne, wie weit du gekommen bist. Aus dieser Rückschau kann ein Ruf entstehen: Was will jetzt in dir wach werden? Du darfst dich neu entscheiden.',
        en: 'Look back and see how far you have come. A call can arise from that review: what wants to wake up in you now? You are allowed to choose anew.',
      },
      love: {
        de: 'Eine ehrliche Rückschau kann eine Verbindung erneuern. Was hast du gelernt, und was möchtest du künftig anders machen? Vergebung, auch dir selbst gegenüber, kann Raum öffnen.',
        en: 'An honest look back can renew a connection. What have you learned, and what would you like to do differently from now on? Forgiveness, towards yourself as well, can open space.',
      },
      career: {
        de: 'Vielleicht spürst du einen Ruf nach etwas, das besser zu dir passt. Nimm ihn ernst und prüf ihn in Ruhe. Deine bisherige Erfahrung ist das Fundament für den nächsten Schritt.',
        en: 'You may feel a call towards something that suits you better. Take it seriously and examine it calmly. Your experience so far is the foundation for the next step.',
      },
      change: {
        de: 'Ein Kapitel ist durchdacht, ein neues kann beginnen. Zieh Bilanz, bevor du entscheidest: Was hat sich bewährt, was nicht? Mit dieser Klarheit kannst du bewusst neu anfangen.',
        en: 'One chapter has been thought through; a new one can begin. Look back before you decide: what has proved itself, and what has not? With that clarity you can begin anew, consciously.',
      },
      balance: {
        de: 'Lass alte Vorwürfe gegen dich selbst los. Du hast getan, was dir damals möglich war. Ein milder Blick zurück macht den Weg nach vorn leichter.',
        en: 'Let go of old reproaches against yourself. You did what was possible for you at the time. A gentle look back makes the way forward lighter.',
      },
      creativity: {
        de: 'Ein altes Projekt ruft vielleicht nach dir. Hol etwas Liegengebliebenes hervor und betrachte es mit frischen Augen. Manches Werk wartet nur auf den richtigen Moment.',
        en: 'An old project may be calling you. Bring out something that was left lying and look at it with fresh eyes. Some work is only waiting for the right moment.',
      },
    },
    positions: {
      situation: {
        de: 'Ein innerer Ruf wird lauter: Etwas will neu beginnen.',
        en: 'An inner call is growing louder: something wants to begin anew.',
      },
      challenge: {
        de: 'Ein zu strenges Urteil über die Vergangenheit kann den Neuanfang blockieren.',
        en: 'Judging the past too harshly can block a fresh start.',
      },
      impulse: {
        de: 'Zieh ehrlich Bilanz und folge dem Ruf, der sich stimmig anfühlt.',
        en: 'Review honestly, then follow the call that feels right.',
      },
    },
    reflection: {
      de: 'Welcher Ruf in mir wartet darauf, gehört zu werden?',
      en: 'Which call in me is waiting to be heard?',
    },
    ritual: {
      de: 'Lies einen alten Eintrag, eine Nachricht oder sieh ein Foto von vor einem Jahr an und notiere, was sich seitdem in dir verändert hat.',
      en: 'Read an old entry or message, or look at a photo from a year ago, and note what has changed in you since then.',
    },
  }),

  major(21, 'world', 'light', {
    title: { de: 'Die Welt', en: 'The World' },
    essence: {
      de: 'Vollendung, Ganzheit und das Gefühl, angekommen zu sein.',
      en: 'Completion, wholeness and the feeling of having arrived.',
    },
    themes: {
      self: {
        de: 'Ein Kreis schließt sich. Würdige, was du erreicht hast, bevor du zum Nächsten eilst. Ankommen ist ein eigener, wertvoller Moment.',
        en: 'A circle is closing. Honour what you have achieved before rushing on to the next thing. Arriving is a precious moment of its own.',
      },
      love: {
        de: 'Ganzheit beginnt bei dir. Wenn du dich selbst als vollständig erlebst, kann Nähe freier werden. Feiere, was in deinen Verbindungen gut gewachsen ist.',
        en: 'Wholeness begins with you. When you experience yourself as complete, closeness can become freer. Celebrate what has grown well in your connections.',
      },
      career: {
        de: 'Ein Vorhaben kommt zum Abschluss oder ist näher daran, als du denkst. Bring es sauber zu Ende und nimm dir Zeit, den Erfolg wahrzunehmen. Danach öffnet sich der nächste Kreis.',
        en: 'A project is coming to completion, or is closer than you think. Bring it to a clean finish and take time to take in the success. Afterwards, the next circle opens.',
      },
      change: {
        de: 'Ein Übergang ist fast geschafft. Schau, was du auf diesem Weg gewonnen hast. Mit diesem Wissen kannst du die nächste Schwelle gelassen betreten.',
        en: 'A transition is almost complete. Look at what you have gained along the way. With that knowledge you can cross the next threshold calmly.',
      },
      balance: {
        de: 'Du bist mehr als deine Aufgaben. Spür heute, wie die verschiedenen Teile deines Lebens zusammengehören. Ganzheit fühlt sich oft wie Weite an.',
        en: 'You are more than your tasks. Sense today how the different parts of your life belong together. Wholeness often feels like spaciousness.',
      },
      creativity: {
        de: 'Ein Werk will vollendet und gezeigt werden. Gib ihm den letzten Schliff und teile es mit jemandem. Was rund ist, darf in die Welt.',
        en: 'A work wants to be completed and shown. Give it the final touch and share it with someone. What is whole may go out into the world.',
      },
    },
    positions: {
      situation: {
        de: 'Etwas rundet sich ab – ein Ziel ist erreicht oder in greifbarer Nähe.',
        en: 'Something is rounding off – a goal is reached or within reach.',
      },
      challenge: {
        de: 'Wer nur auf das Nächste schaut, übersieht, was schon vollendet ist.',
        en: 'Looking only to the next thing means missing what is already complete.',
      },
      impulse: {
        de: 'Feiere den Abschluss und tritt dann offen in den nächsten Kreis.',
        en: 'Celebrate the completion, then step openly into the next circle.',
      },
    },
    reflection: {
      de: 'Was habe ich bereits vollendet, ohne es wirklich zu würdigen?',
      en: 'What have I already completed without truly honouring it?',
    },
    ritual: {
      de: 'Schreib drei Dinge auf, die du in diesem Jahr abgeschlossen hast, und lies sie dir einmal laut vor.',
      en: 'Write down three things you have completed this year and read them aloud to yourself once.',
    },
  }),
];
