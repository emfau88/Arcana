import { major } from './define.ts';
import type { CardContent } from './schema.ts';

/** Major arcana 0–7 (without II, which lives in cards.ts). Original texts, written for this project. */
export const CARDS_A: readonly CardContent[] = [
  major(0, 'fool', 'light', {
    title: { de: 'Der Narr', en: 'The Fool' },
    essence: {
      de: 'Ein offener Anfang, Neugier und der Mut, ohne fertigen Plan loszugehen.',
      en: 'An open beginning, curiosity and the courage to set out without a finished plan.',
    },
    themes: {
      self: {
        de: 'Du musst nicht alles wissen, um den ersten Schritt zu machen. Erlaube dir, neu anzufangen – mit allem Staunen, das dazugehört. Neugier ist heute ein besserer Kompass als Perfektion.',
        en: 'You don’t need to know everything to take the first step. Allow yourself to begin anew, with all the wonder that comes with it. Today curiosity is a better compass than perfection.',
      },
      love: {
        de: 'Begegne einem Menschen heute so, als würdest du ihn zum ersten Mal sehen. Lass alte Erwartungen für einen Moment beiseite. Offenheit schafft Raum für etwas, das du noch nicht kennst.',
        en: 'Meet someone today as if you were seeing them for the first time. Set old expectations aside for a moment. Openness makes room for something you do not know yet.',
      },
      career: {
        de: 'Ein neuer Weg beginnt selten mit einem perfekten Plan. Probier einen kleinen Schritt aus, der dich neugierig macht, und schau, was er dir zeigt. Lernen gehört zu jedem Anfang dazu.',
        en: 'A new path rarely begins with a perfect plan. Try one small step that makes you curious and see what it shows you. Learning is part of every beginning.',
      },
      change: {
        de: 'Vor einem Sprung ins Neue darf Unsicherheit da sein. Prüfe, was du mitnehmen willst und was du zurücklassen kannst. Leichtes Gepäck macht den Anfang einfacher.',
        en: 'Uncertainty is allowed before a leap into something new. Check what you want to take with you and what you can leave behind. Travelling light makes beginning easier.',
      },
      balance: {
        de: 'Nicht alles braucht heute einen Zweck. Gönn dir einen Moment, in dem du einfach schaust, was passiert. Leichtigkeit ist auch eine Form von Kraft.',
        en: 'Not everything needs a purpose today. Allow yourself a moment of simply watching what happens. Lightness is a kind of strength, too.',
      },
      creativity: {
        de: 'Fang an, bevor du dich bereit fühlst. Eine erste Skizze darf schief sein und trotzdem den Weg öffnen. Das Unfertige ist der Ort, an dem Neues entsteht.',
        en: 'Start before you feel ready. A first sketch may be crooked and still open the way. The unfinished is where new things begin.',
      },
    },
    positions: {
      situation: {
        de: 'Etwas Neues steht offen, auch wenn der Weg noch nicht sichtbar ist.',
        en: 'Something new stands open, even if the path is not yet visible.',
      },
      challenge: {
        de: 'Leichtsinn und Leichtigkeit liegen nah beieinander – achte auf deinen Boden.',
        en: 'Recklessness and lightness lie close together – mind where you step.',
      },
      impulse: {
        de: 'Geh einen ersten kleinen Schritt und bleib dabei neugierig.',
        en: 'Take a first small step and stay curious as you go.',
      },
    },
    reflection: {
      de: 'Was würde ich ausprobieren, wenn ich keine Angst vor Fehlern hätte?',
      en: 'What would I try if I were not afraid of making mistakes?',
    },
    ritual: {
      de: 'Geh heute einen vertrauten Weg in eine andere Richtung oder in anderem Tempo und achte auf eine Sache, die dir neu auffällt.',
      en: 'Walk a familiar route today in a different direction or at a different pace, and notice one thing that strikes you as new.',
    },
  }),

  major(1, 'magician', 'light', {
    title: { de: 'Der Magier', en: 'The Magician' },
    essence: {
      de: 'Konzentration, Können und die Kraft, eine Idee in Handlung zu verwandeln.',
      en: 'Focus, skill and the power to turn an idea into action.',
    },
    themes: {
      self: {
        de: 'Du hast mehr Werkzeuge zur Hand, als du gerade bemerkst. Schau, welche Fähigkeiten du schon mitbringst, und richte sie auf ein klares Ziel. Aufmerksamkeit ist heute dein stärkstes Mittel.',
        en: 'You have more tools at hand than you currently notice. Look at the abilities you already bring and point them at one clear aim. Attention is your strongest means today.',
      },
      love: {
        de: 'Worte können Brücken bauen. Sag klar, was dir wichtig ist, statt darauf zu hoffen, dass es erraten wird. Du gestaltest mit, wie eine Begegnung verläuft.',
        en: 'Words can build bridges. Say clearly what matters to you instead of hoping it will be guessed. You help shape how an encounter unfolds.',
      },
      career: {
        de: 'Bündle deine Kräfte auf eine Aufgabe. Was du heute konzentriert angehst, kann mehr bewegen als vieles nebeneinander. Zeig, was du kannst, ohne es größer zu machen, als es ist.',
        en: 'Bundle your energy into one task. What you approach with focus today can move more than many things at once. Show what you can do without making it bigger than it is.',
      },
      change: {
        de: 'Du bist der Veränderung nicht nur ausgesetzt, du kannst sie auch gestalten. Überlege, welcher konkrete Schritt in deiner Hand liegt. Kleine, bewusste Handlungen verschieben oft mehr als große Pläne.',
        en: 'You are not only exposed to change – you can also shape it. Consider which concrete step is in your hands. Small, deliberate actions often shift more than big plans.',
      },
      balance: {
        de: 'Kraft entsteht dort, wo Absicht und Handlung zusammenfinden. Wähle heute eine Sache, die du ganz tust, statt vieles halb. Das sammelt dich.',
        en: 'Strength arises where intention and action meet. Choose one thing today that you do fully rather than many things by halves. That gathers you.',
      },
      creativity: {
        de: 'Deine Idee wartet auf die erste Handbewegung. Leg dir die Mittel zurecht, die du schon hast, und beginne damit. Gestalten heißt, aus dem Vorhandenen etwas Neues zu machen.',
        en: 'Your idea is waiting for the first movement of your hands. Lay out the means you already have and begin with them. Creating means making something new from what is there.',
      },
    },
    positions: {
      situation: {
        de: 'Die Mittel für den nächsten Schritt sind bereits vorhanden.',
        en: 'The means for the next step are already there.',
      },
      challenge: {
        de: 'Zerstreute Energie verpufft – Können braucht eine Richtung.',
        en: 'Scattered energy fizzles out – skill needs a direction.',
      },
      impulse: {
        de: 'Richte deine Aufmerksamkeit auf eine Sache und handle.',
        en: 'Focus your attention on one thing and act.',
      },
    },
    reflection: {
      de: 'Welche meiner Fähigkeiten nutze ich gerade zu wenig?',
      en: 'Which of my abilities am I using too little right now?',
    },
    ritual: {
      de: 'Leg vier Gegenstände vor dich, die du heute brauchst, und nenne für jeden still eine Absicht.',
      en: 'Lay out four objects you need today and silently name one intention for each.',
    },
  }),

  major(3, 'empress', 'light', {
    title: { de: 'Die Herrscherin', en: 'The Empress' },
    essence: {
      de: 'Fülle, Fürsorge und das, was unter guter Pflege wächst.',
      en: 'Abundance, care and what grows when it is well tended.',
    },
    themes: {
      self: {
        de: 'Behandle dich heute so freundlich, wie du einen guten Garten behandeln würdest. Wachstum braucht Zeit, Wärme und Geduld. Was du pflegst, darf in seinem eigenen Tempo kommen.',
        en: 'Treat yourself today as kindly as you would a good garden. Growth needs time, warmth and patience. What you tend is allowed to come at its own pace.',
      },
      love: {
        de: 'Fürsorge zeigt sich in kleinen Gesten. Achte darauf, wie du Nähe schenkst – und ob du dir selbst dabei auch etwas gönnst. Geben und Empfangen dürfen im Fluss sein.',
        en: 'Care shows itself in small gestures. Notice how you offer closeness – and whether you also allow yourself something. Giving and receiving can flow both ways.',
      },
      career: {
        de: 'Gute Arbeit wächst mit Pflege, nicht nur mit Druck. Schau, welches Projekt gerade Aufmerksamkeit braucht, damit es reifen kann. Auch Geduld ist eine Leistung.',
        en: 'Good work grows with care, not only with pressure. See which project needs attention right now so that it can ripen. Patience is an achievement, too.',
      },
      change: {
        de: 'Veränderung kann wie eine Jahreszeit sein, die langsam einzieht. Gib dem Neuen Nährboden, statt es zu erzwingen. Was gut verwurzelt ist, trägt später Früchte.',
        en: 'Change can be like a season that arrives slowly. Give the new some fertile ground instead of forcing it. What is well rooted bears fruit later.',
      },
      balance: {
        de: 'Sinnliche Kleinigkeiten können dich wieder erden: frische Luft, ein weicher Stoff, ein vertrauter Duft. Nimm wahr, was dir gerade guttut. Dein Wohlbefinden ist kein Luxus.',
        en: 'Small sensory things can ground you again: fresh air, a soft fabric, a familiar scent. Notice what does you good right now. Your wellbeing is not a luxury.',
      },
      creativity: {
        de: 'Kreativität liebt Fülle. Sammle Eindrücke, Farben und Fundstücke, ohne gleich auszuwählen. Aus diesem reichen Boden wächst später das, was du gestalten willst.',
        en: 'Creativity loves abundance. Collect impressions, colours and finds without choosing straight away. From this rich soil, what you want to make will grow later.',
      },
    },
    positions: {
      situation: {
        de: 'Hier wächst etwas, das Pflege und Geduld verdient.',
        en: 'Something is growing here that deserves care and patience.',
      },
      challenge: {
        de: 'Wer nur für andere sorgt, vergisst leicht die eigene Fülle.',
        en: 'Caring only for others makes it easy to forget your own abundance.',
      },
      impulse: {
        de: 'Gib dem, was dir wichtig ist, Zeit und Wärme.',
        en: 'Give what matters to you time and warmth.',
      },
    },
    reflection: {
      de: 'Was in meinem Leben möchte heute gepflegt werden?',
      en: 'What in my life would like to be tended today?',
    },
    ritual: {
      de: 'Kümmere dich um etwas Lebendiges – eine Pflanze, ein Tier oder dich selbst – und nimm dir dafür bewusst fünf Minuten.',
      en: 'Look after something living – a plant, an animal or yourself – and consciously give it five minutes.',
    },
  }),

  major(4, 'emperor', 'twilight', {
    title: { de: 'Der Herrscher', en: 'The Emperor' },
    essence: {
      de: 'Struktur, Verantwortung und ein klarer Rahmen, der Halt gibt.',
      en: 'Structure, responsibility and a clear framework that gives support.',
    },
    themes: {
      self: {
        de: 'Ein klarer Rahmen kann Freiheit schaffen. Überlege, welche Regel oder Gewohnheit dir wirklich hilft und welche nur aus Pflicht besteht. Du darfst deine eigene Ordnung bauen.',
        en: 'A clear framework can create freedom. Consider which rule or habit really helps you and which exists only out of duty. You are allowed to build your own order.',
      },
      love: {
        de: 'Verlässlichkeit ist eine leise Form von Zuneigung. Sag deutlich, wo deine Grenzen liegen, und halte, was du zusagst. Klarheit kann Nähe sicherer machen.',
        en: 'Reliability is a quiet form of affection. Say clearly where your boundaries lie, and keep what you promise. Clarity can make closeness feel safer.',
      },
      career: {
        de: 'Struktur hilft, wenn vieles gleichzeitig ansteht. Lege Prioritäten fest und übernimm Verantwortung für das, was in deinem Bereich liegt. Führung beginnt bei der eigenen Planung.',
        en: 'Structure helps when a lot is due at once. Set priorities and take responsibility for what lies within your area. Leadership begins with your own planning.',
      },
      change: {
        de: 'In Zeiten des Wandels gibt ein fester Plan Orientierung. Ordne deine Optionen, bevor du wählst, und setze dir einen klaren Zeitpunkt für die Entscheidung. Ein Rahmen nimmt dem Ungewissen etwas von seiner Schwere.',
        en: 'In times of change, a firm plan offers orientation. Arrange your options before you choose, and set yourself a clear point for the decision. A framework takes some of the weight out of uncertainty.',
      },
      balance: {
        de: 'Ein gleichmäßiger Rhythmus kann dich tragen. Achte heute auf feste Pausen und ein klares Ende für deine Aufgaben. Grenzen schützen deine Kraft.',
        en: 'A steady rhythm can carry you. Pay attention today to regular breaks and a clear end to your tasks. Boundaries protect your strength.',
      },
      creativity: {
        de: 'Auch Kreativität profitiert von Struktur. Gib deiner Idee einen festen Zeitraum und eine einfache Regel. Innerhalb von Grenzen wird Spiel oft erstaunlich frei.',
        en: 'Creativity benefits from structure, too. Give your idea a fixed time slot and one simple rule. Within limits, play often becomes surprisingly free.',
      },
    },
    positions: {
      situation: {
        de: 'Diese Lage verlangt nach Ordnung und klaren Zuständigkeiten.',
        en: 'This situation calls for order and clear responsibilities.',
      },
      challenge: {
        de: 'Kontrolle kann zur Starre werden, wenn sie keinen Raum mehr lässt.',
        en: 'Control can turn rigid when it leaves no room.',
      },
      impulse: {
        de: 'Schaffe einen Rahmen, der dich trägt, ohne dich einzuengen.',
        en: 'Create a framework that supports you without confining you.',
      },
    },
    reflection: {
      de: 'Wo würde mir heute eine klare Grenze helfen?',
      en: 'Where would a clear boundary help me today?',
    },
    ritual: {
      de: 'Räume eine kleine Fläche auf – eine Schublade oder einen Tischrand – und spüre, wie sich Ordnung anfühlt.',
      en: 'Tidy one small surface – a drawer or the edge of a desk – and notice how order feels.',
    },
  }),

  major(5, 'hierophant', 'twilight', {
    title: { de: 'Der Hierophant', en: 'The Hierophant' },
    essence: {
      de: 'Überlieferung, Werte und das Wissen, das wir voneinander lernen.',
      en: 'Tradition, values and the knowledge we learn from one another.',
    },
    themes: {
      self: {
        de: 'Welche Werte hast du übernommen, und welche hast du dir selbst ausgesucht? Beides darf nebeneinander bestehen. Prüfe heute eine Überzeugung darauf, ob sie noch zu dir passt.',
        en: 'Which values did you take on, and which did you choose yourself? Both can exist side by side. Today, test one belief to see whether it still fits you.',
      },
      love: {
        de: 'Gemeinsame Werte können eine Verbindung tragen. Sprich darüber, was euch beiden wichtig ist, statt es vorauszusetzen. Rituale und Gewohnheiten dürfen gemeinsam neu vereinbart werden.',
        en: 'Shared values can carry a connection. Talk about what matters to both of you instead of assuming it. Rituals and habits can be agreed on anew, together.',
      },
      career: {
        de: 'Von anderen zu lernen ist keine Schwäche. Frag heute jemanden mit Erfahrung um Rat oder teile dein eigenes Wissen. Bewährte Wege können ein guter Ausgangspunkt sein.',
        en: 'Learning from others is not a weakness. Ask someone with experience for advice today, or share your own knowledge. Proven paths can be a good starting point.',
      },
      change: {
        de: 'Vor einer Entscheidung lohnt der Blick auf deine Werte. Welche Möglichkeit passt zu dem, was dir grundsätzlich wichtig ist? Rat von außen kann helfen, die Entscheidung bleibt deine.',
        en: 'Before a decision, it is worth looking at your values. Which option fits what matters to you at heart? Outside advice can help; the decision stays yours.',
      },
      balance: {
        de: 'Kleine Rituale können Halt geben. Wiederhole heute bewusst etwas, das dir guttut, und gib ihm einen festen Platz. Vertrautes kann beruhigen.',
        en: 'Small rituals can give support. Today, deliberately repeat something that does you good, and give it a fixed place. The familiar can be calming.',
      },
      creativity: {
        de: 'Jede Kunst hat ihre Lehrjahre. Studier ein Vorbild, eine Technik oder eine alte Form und lerne daraus. Wer die Regeln kennt, kann sie später bewusst brechen.',
        en: 'Every craft has its years of learning. Study a role model, a technique or an old form and learn from it. Knowing the rules lets you break them on purpose later.',
      },
    },
    positions: {
      situation: {
        de: 'Überlieferte Regeln und Erwartungen prägen diese Lage.',
        en: 'Inherited rules and expectations shape this situation.',
      },
      challenge: {
        de: 'Was alle so machen, muss nicht zu dir passen.',
        en: 'What everyone does need not fit you.',
      },
      impulse: {
        de: 'Hol dir Rat, und prüfe ihn an deinen eigenen Werten.',
        en: 'Seek advice, and test it against your own values.',
      },
    },
    reflection: {
      de: 'Welche Überzeugung trage ich, ohne sie je selbst geprüft zu haben?',
      en: 'Which belief do I carry without ever having examined it myself?',
    },
    ritual: {
      de: 'Schreib drei Werte auf, die dir wichtig sind, und markiere den, nach dem du heute handeln möchtest.',
      en: 'Write down three values that matter to you and mark the one you want to act on today.',
    },
  }),

  major(6, 'lovers', 'light', {
    title: { de: 'Die Liebenden', en: 'The Lovers' },
    essence: {
      de: 'Verbindung, Wahl und die Übereinstimmung mit dem eigenen Herzen.',
      en: 'Connection, choice and being in tune with your own heart.',
    },
    themes: {
      self: {
        de: 'Echte Entscheidungen entstehen, wenn Kopf und Herz sich zuhören. Spür nach, was du wirklich willst, nicht nur, was vernünftig klingt. Stimmigkeit fühlt sich oft ruhig an.',
        en: 'Real choices emerge when head and heart listen to each other. Sense what you really want, not just what sounds sensible. Being in tune often feels calm.',
      },
      love: {
        de: 'Nähe lebt von bewussten Entscheidungen. Frag dich, was du in eine Verbindung einbringen möchtest und was du dir wünschst. Ehrliche Worte über beides schaffen Vertrauen.',
        en: 'Closeness thrives on conscious choices. Ask yourself what you want to bring into a connection and what you wish for. Honest words about both build trust.',
      },
      career: {
        de: 'Arbeit fühlt sich leichter an, wenn sie zu deinen Werten passt. Prüfe, wo dein Beruf und deine Überzeugungen zusammenfinden und wo sie sich reiben. Gute Zusammenarbeit beginnt mit klaren Absprachen.',
        en: 'Work feels lighter when it fits your values. Check where your job and your convictions meet and where they rub against each other. Good collaboration begins with clear agreements.',
      },
      change: {
        de: 'Vor dir liegt eine Wahl, die mehr ist als ein Abwägen von Vor- und Nachteilen. Frag dich, welcher Weg zu dem Menschen passt, der du sein möchtest. Diese Frage ergänzt deine Liste, sie ersetzt sie nicht.',
        en: 'Ahead of you lies a choice that is more than weighing pros and cons. Ask yourself which path fits the person you want to be. That question complements your list; it does not replace it.',
      },
      balance: {
        de: 'Balance entsteht, wenn du mit dir im Einklang bist. Achte heute darauf, wo du Ja sagst und Nein meinst. Ein ehrliches Ja zu dir selbst gibt Ruhe.',
        en: 'Balance arises when you are in harmony with yourself. Notice today where you say yes and mean no. An honest yes to yourself brings calm.',
      },
      creativity: {
        de: 'Ideen werden lebendig, wenn zwei Dinge zusammenkommen, die vorher getrennt waren. Verbinde heute etwas Ungewohntes miteinander. Aus der Begegnung entsteht Neues.',
        en: 'Ideas come alive when two things meet that were separate before. Combine something unusual today. Something new is born of the meeting.',
      },
    },
    positions: {
      situation: {
        de: 'Es geht um eine Wahl, die deine Werte berührt.',
        en: 'This is about a choice that touches your values.',
      },
      challenge: {
        de: 'Es allen recht machen zu wollen, kann die eigene Stimme übertönen.',
        en: 'Wanting to please everyone can drown out your own voice.',
      },
      impulse: {
        de: 'Wähle das, was mit deinem Herzen und deinem Verstand übereinstimmt.',
        en: 'Choose what agrees with both your heart and your mind.',
      },
    },
    reflection: {
      de: 'Welche Wahl würde sich auch in einem Jahr noch stimmig anfühlen?',
      en: 'Which choice would still feel right a year from now?',
    },
    ritual: {
      de: 'Leg eine Hand aufs Herz, atme dreimal ruhig und frag still: Was ist mir heute wirklich wichtig?',
      en: 'Place a hand on your heart, take three calm breaths and quietly ask: What really matters to me today?',
    },
  }),

  major(7, 'chariot', 'twilight', {
    title: { de: 'Der Wagen', en: 'The Chariot' },
    essence: {
      de: 'Entschlossenheit, Richtung und die Kunst, gegensätzliche Kräfte zu lenken.',
      en: 'Determination, direction and the art of steering opposing forces.',
    },
    themes: {
      self: {
        de: 'Du kommst voran, wenn du weißt, wohin du willst. Unterschiedliche Wünsche in dir dürfen da sein, solange du die Zügel hältst. Ein klares Ziel bündelt deine Kraft.',
        en: 'You move forward when you know where you want to go. Different wishes within you may exist as long as you hold the reins. A clear goal gathers your strength.',
      },
      love: {
        de: 'Auch Verbindungen brauchen manchmal eine gemeinsame Richtung. Sprich darüber, wohin ihr wollt, statt euch treiben zu lassen. Unterschiede lassen sich lenken, wenn beide mitsteuern.',
        en: 'Connections sometimes need a shared direction, too. Talk about where you want to go instead of drifting. Differences can be steered when both of you take a hand.',
      },
      career: {
        de: 'Jetzt ist ein guter Moment, ein Vorhaben entschlossen voranzubringen. Setz dir ein konkretes Etappenziel und bleib dran. Hindernisse sind leichter zu nehmen, wenn das Ziel klar ist.',
        en: 'Now is a good moment to push a project forward with determination. Set yourself a concrete milestone and stay with it. Obstacles are easier to take when the goal is clear.',
      },
      change: {
        de: 'Bewegung entsteht, wenn du eine Richtung wählst. Du musst nicht jede Unsicherheit klären, um loszufahren. Lege fest, was dein nächster Abschnitt ist, und korrigiere unterwegs.',
        en: 'Movement begins when you choose a direction. You do not have to clear up every uncertainty before setting off. Decide what your next stretch is, and adjust along the way.',
      },
      balance: {
        de: 'Zwei Kräfte ziehen an dir – vielleicht Pflicht und Erholung. Keine davon muss verlieren. Lenke bewusst, wann welche ihren Raum bekommt.',
        en: 'Two forces are pulling at you – perhaps duty and rest. Neither has to lose. Steer consciously when each gets its room.',
      },
      creativity: {
        de: 'Eine Idee braucht Schwung, um anzukommen. Nimm dir ein Projekt vor und bring es ein deutliches Stück voran. Fertig ist oft wichtiger als perfekt.',
        en: 'An idea needs momentum to arrive. Pick one project and move it forward by a clear stretch. Finished often matters more than perfect.',
      },
    },
    positions: {
      situation: {
        de: 'Du bist in Bewegung, auch wenn noch nicht alles in eine Richtung zieht.',
        en: 'You are in motion, even if not everything pulls in the same direction yet.',
      },
      challenge: {
        de: 'Gegensätzliche Wünsche können dich bremsen, wenn niemand lenkt.',
        en: 'Opposing wishes can slow you down when no one is steering.',
      },
      impulse: {
        de: 'Wähle ein Ziel und halte die Zügel mit ruhiger Hand.',
        en: 'Choose a goal and hold the reins with a steady hand.',
      },
    },
    reflection: {
      de: 'Wohin will ich in den nächsten Wochen wirklich?',
      en: 'Where do I really want to go in the coming weeks?',
    },
    ritual: {
      de: 'Schreib dein Ziel für diese Woche in einem Satz auf und leg den Zettel dorthin, wo du ihn morgen früh siehst.',
      en: 'Write your goal for this week in one sentence and put the note where you will see it tomorrow morning.',
    },
  }),
];
