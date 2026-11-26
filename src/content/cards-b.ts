import { major } from './define.ts';
import type { CardContent } from './schema.ts';

/**
 * Major arcana 8–15. Original texts, written for this project.
 * XIII and XV are read symbolically (endings, habits) and never as threat or danger.
 */
export const CARDS_B: readonly CardContent[] = [
  major(8, 'strength', 'light', {
    title: { de: 'Die Kraft', en: 'Strength' },
    essence: {
      de: 'Sanfte Stärke, Geduld und Mut, der ohne Härte auskommt.',
      en: 'Gentle strength, patience and courage that needs no harshness.',
    },
    themes: {
      self: {
        de: 'Stärke zeigt sich nicht nur im Durchhalten, sondern auch im freundlichen Umgang mit dir selbst. Begegne deinen unruhigen Seiten mit Geduld statt mit Strenge. So wird aus Mut etwas Beständiges.',
        en: 'Strength shows not only in holding out but also in treating yourself kindly. Meet your restless sides with patience rather than severity. That is how courage becomes something lasting.',
      },
      love: {
        de: 'Geduld kann mehr bewirken als Druck. Wenn etwas zwischen euch schwierig ist, bleib ruhig und zugewandt. Sanftheit ist keine Schwäche, sondern eine bewusste Haltung.',
        en: 'Patience can achieve more than pressure. If something between you is difficult, stay calm and open. Gentleness is not weakness but a conscious stance.',
      },
      career: {
        de: 'Du musst nicht laut sein, um zu überzeugen. Ruhige Beharrlichkeit trägt oft weiter als ein schneller Auftritt. Vertrau auf das, was du dir erarbeitet hast.',
        en: 'You do not have to be loud to convince. Calm persistence often carries further than a quick show. Trust in what you have worked for.',
      },
      change: {
        de: 'Veränderung braucht Mut, aber keinen Zwang. Geh in deinem Tempo und erkenne an, was dich Kraft kostet. Mut darf auch zittern und trotzdem weitergehen.',
        en: 'Change takes courage, but not force. Go at your own pace and acknowledge what costs you strength. Courage may tremble and still keep going.',
      },
      balance: {
        de: 'Deine Kraft erneuert sich, wenn du sie nicht ständig beweisen musst. Gönn dir heute eine Pause ohne schlechtes Gewissen. Ausruhen ist Teil von Stärke.',
        en: 'Your strength renews itself when you do not constantly have to prove it. Allow yourself a break today without guilt. Rest is part of strength.',
      },
      creativity: {
        de: 'Bleib bei einer Idee, auch wenn sie gerade widerspenstig ist. Geduldiges Weiterarbeiten zähmt oft, was anfangs nicht gelingen wollte. Hartnäckigkeit und Freude können zusammengehen.',
        en: 'Stay with an idea even when it is being stubborn. Patient work often tames what would not succeed at first. Persistence and joy can go together.',
      },
    },
    positions: {
      situation: {
        de: 'In dir steckt mehr Ruhe und Stärke, als die Lage gerade vermuten lässt.',
        en: 'There is more calm and strength in you than the situation currently suggests.',
      },
      challenge: {
        de: 'Ungeduld mit dir selbst kann deine Kraft aufzehren.',
        en: 'Impatience with yourself can wear down your strength.',
      },
      impulse: {
        de: 'Begegne dem Schwierigen mit ruhiger, freundlicher Beharrlichkeit.',
        en: 'Meet what is difficult with calm, kind persistence.',
      },
    },
    reflection: {
      de: 'Wo kann ich heute sanft und trotzdem standhaft sein?',
      en: 'Where can I be gentle and still stand firm today?',
    },
    ritual: {
      de: 'Atme viermal langsam aus, länger als du einatmest, und sag dir still: Ich habe Zeit.',
      en: 'Breathe out slowly four times, longer than you breathe in, and quietly tell yourself: I have time.',
    },
  }),

  major(9, 'hermit', 'shadow', {
    title: { de: 'Der Eremit', en: 'The Hermit' },
    essence: {
      de: 'Rückzug, innere Einkehr und das Licht, das man nur im Stillen findet.',
      en: 'Retreat, reflection and the light found only in quiet.',
    },
    themes: {
      self: {
        de: 'Nicht jede Antwort findet sich im Austausch mit anderen. Ein wenig Abstand kann dir helfen, deine eigene Stimme wieder zu hören. Rückzug ist keine Flucht, wenn du ihn bewusst wählst.',
        en: 'Not every answer is found in exchange with others. A little distance can help you hear your own voice again. Retreat is not escape when you choose it consciously.',
      },
      love: {
        de: 'Auch in Nähe braucht jeder Mensch eigenen Raum. Nimm dir Zeit für dich und sag offen, dass du sie brauchst. So bleibt Rückzug verständlich und wird kein stilles Rätsel.',
        en: 'Everyone needs room of their own, even in closeness. Take time for yourself and say openly that you need it. That way, retreat stays understandable rather than becoming a silent puzzle.',
      },
      career: {
        de: 'Vertiefung kann jetzt mehr bringen als Sichtbarkeit. Nimm dir ungestörte Zeit für eine Aufgabe, die Konzentration braucht. Was du dir allein erarbeitest, kann später anderen den Weg zeigen.',
        en: 'Going deeper may bring more now than being visible. Take undisturbed time for a task that needs concentration. What you work out alone can later light the way for others.',
      },
      change: {
        de: 'Bevor du dich entscheidest, hilft vielleicht ein Schritt zurück. Frag dich in Ruhe, was du selbst willst, ohne die Stimmen anderer. Deine eigene Laterne reicht für den nächsten Abschnitt.',
        en: 'Before you decide, a step back may help. Ask yourself quietly what you want, without the voices of others. Your own lantern is enough for the next stretch.',
      },
      balance: {
        de: 'Stille kann nähren. Plane heute eine Zeit ohne Bildschirm und ohne Gespräche ein, und sei sie nur kurz. Was zur Ruhe kommt, wird klarer.',
        en: 'Silence can nourish. Plan a time today without screens or conversation, even if it is short. What comes to rest becomes clearer.',
      },
      creativity: {
        de: 'Manche Ideen brauchen eine geschützte Phase. Arbeite eine Weile für dich, bevor du etwas zeigst. Im Alleinsein kann ein eigener Ton entstehen.',
        en: 'Some ideas need a sheltered phase. Work on your own for a while before showing anything. A voice of your own can emerge in solitude.',
      },
    },
    positions: {
      situation: {
        de: 'Ein Rückzug ist gerade wichtiger als neuer Trubel.',
        en: 'Stepping back matters more right now than new bustle.',
      },
      challenge: {
        de: 'Aus Rückzug kann Isolation werden, wenn er kein Ende findet.',
        en: 'Retreat can turn into isolation if it never ends.',
      },
      impulse: {
        de: 'Such die Stille, finde deine Antwort und bring sie dann zurück.',
        en: 'Seek the quiet, find your answer, then bring it back.',
      },
    },
    reflection: {
      de: 'Was würde ich hören, wenn es um mich herum ganz still wäre?',
      en: 'What would I hear if everything around me were completely quiet?',
    },
    ritual: {
      de: 'Setz dich fünf Minuten ohne Ablenkung hin, nur mit einem Blatt Papier, und schreib den ersten Gedanken auf, der bleibt.',
      en: 'Sit for five minutes without distractions, with just a sheet of paper, and write down the first thought that stays.',
    },
  }),

  major(10, 'wheel', 'twilight', {
    title: { de: 'Das Glücksrad', en: 'Wheel of Fortune' },
    essence: {
      de: 'Zyklen, Wendepunkte und der Moment, in dem sich etwas dreht.',
      en: 'Cycles, turning points and the moment when something turns.',
    },
    themes: {
      self: {
        de: 'Alles bewegt sich in Kreisen: Hochs, Tiefs und Übergänge. Erkenne, an welchem Punkt des Rades du gerade stehst, ohne dich darauf festzulegen. Was sich dreht, bleibt nicht für immer gleich.',
        en: 'Everything moves in circles: highs, lows and transitions. Notice where on the wheel you stand right now, without fixing yourself there. What turns does not stay the same for ever.',
      },
      love: {
        de: 'Beziehungen haben ihre Jahreszeiten. Eine leichtere oder schwerere Phase sagt nicht alles über das Ganze. Schau, was du in diesem Abschnitt beitragen kannst.',
        en: 'Relationships have their seasons. A lighter or heavier phase does not say everything about the whole. See what you can contribute in this stretch.',
      },
      career: {
        de: 'Gelegenheiten kommen und gehen in Wellen. Halte die Augen offen für eine Wendung, die sich jetzt bietet. Bereit zu sein heißt, beweglich zu bleiben.',
        en: 'Opportunities come and go in waves. Keep your eyes open for a turn that is presenting itself now. Being ready means staying flexible.',
      },
      change: {
        de: 'Manches lässt sich nicht steuern, nur beantworten. Konzentriere dich auf das, was in deinem Einfluss liegt, und lass den Rest sich drehen. Auch Zufälle lassen Raum für eigene Entscheidungen.',
        en: 'Some things cannot be steered, only answered. Focus on what lies within your influence and let the rest turn. Chance, too, leaves room for choices of your own.',
      },
      balance: {
        de: 'Nichts bleibt, wie es ist – weder das Gute noch das Schwere. Diese Einsicht kann entlasten. Genieße, was trägt, und vertrau darauf, dass Schweres sich verändert.',
        en: 'Nothing stays as it is – neither the good nor the hard. That insight can be a relief. Enjoy what carries you, and trust that what is heavy will change.',
      },
      creativity: {
        de: 'Kreativität hat Phasen: Sammeln, Reifen, Gestalten, Loslassen. Erkenne, in welcher du gerade bist, und arbeite mit ihr statt gegen sie. Der nächste Schwung kommt.',
        en: 'Creativity has phases: gathering, ripening, making, letting go. Recognise which one you are in and work with it rather than against it. The next swing will come.',
      },
    },
    positions: {
      situation: {
        de: 'Etwas ist in Bewegung geraten, das sich nicht ganz kontrollieren lässt.',
        en: 'Something has started moving that cannot be fully controlled.',
      },
      challenge: {
        de: 'Festhalten an einem Zustand kann gegen den natürlichen Wandel arbeiten.',
        en: 'Clinging to one state can work against natural change.',
      },
      impulse: {
        de: 'Nutze die Wendung, die sich jetzt zeigt, und bleib beweglich.',
        en: 'Use the turn that is showing itself now, and stay flexible.',
      },
    },
    reflection: {
      de: 'Welcher Kreislauf in meinem Leben wiederholt sich gerade?',
      en: 'Which cycle in my life is repeating itself right now?',
    },
    ritual: {
      de: 'Denk an eine schwierige Phase, die vorbeigegangen ist, und notiere, was dir damals geholfen hat.',
      en: 'Think of a difficult phase that has passed, and note down what helped you then.',
    },
  }),

  major(11, 'justice', 'twilight', {
    title: { de: 'Die Gerechtigkeit', en: 'Justice' },
    essence: {
      de: 'Klarheit, Ausgleich und die Verantwortung für das eigene Handeln.',
      en: 'Clarity, balance and responsibility for your own actions.',
    },
    themes: {
      self: {
        de: 'Ein ehrlicher Blick auf dich selbst darf klar und trotzdem fair sein. Erkenne an, was dir gelungen ist und was du anders machen möchtest. Verantwortung ist kein Urteil, sondern eine Wahl.',
        en: 'An honest look at yourself can be clear and still fair. Acknowledge what you did well and what you would like to do differently. Responsibility is not a verdict but a choice.',
      },
      love: {
        de: 'Gleichgewicht in einer Verbindung entsteht nicht von selbst. Schau, ob Geben und Nehmen sich gerade fair anfühlen. Ein ruhiges, klares Gespräch kann mehr ausgleichen als stilles Aufrechnen.',
        en: 'Balance in a connection does not arise by itself. Check whether giving and taking feel fair right now. A calm, clear conversation can balance more than silent score-keeping.',
      },
      career: {
        de: 'Faire Entscheidungen brauchen klare Fakten. Prüfe die Lage nüchtern, bevor du handelst, und steh zu dem, was du verantwortest. Klarheit schafft Vertrauen.',
        en: 'Fair decisions need clear facts. Examine the situation soberly before you act, and stand by what you are responsible for. Clarity builds trust.',
      },
      change: {
        de: 'Leg die Möglichkeiten nebeneinander und wäge sie ehrlich ab. Welche Folgen kannst du tragen, welche nicht? Eine Entscheidung wird stimmiger, wenn du ihre Gründe benennen kannst.',
        en: 'Lay the options side by side and weigh them honestly. Which consequences can you carry, and which not? A decision feels more coherent when you can name its reasons.',
      },
      balance: {
        de: 'Ausgleich heißt nicht, dass alles gleich viel Raum bekommt. Prüfe, wo du zu viel gibst und wo zu wenig. Kleine Korrekturen bringen dich wieder ins Lot.',
        en: 'Balance does not mean everything gets the same room. Check where you give too much and where too little. Small corrections bring you back into line.',
      },
      creativity: {
        de: 'Auch Gestaltung braucht ein ehrliches Urteil. Schau dein Werk mit klarem Blick an: Was trägt, was kann weg? Kürzen ist oft der kreativste Schritt.',
        en: 'Making things needs honest judgement, too. Look at your work with clear eyes: what carries it, what can go? Cutting is often the most creative step.',
      },
    },
    positions: {
      situation: {
        de: 'Die Lage verlangt nach einem klaren, fairen Blick.',
        en: 'The situation calls for a clear, fair look.',
      },
      challenge: {
        de: 'Vorschnelle Urteile – über andere oder dich – verzerren das Bild.',
        en: 'Hasty judgements – about others or yourself – distort the picture.',
      },
      impulse: {
        de: 'Wäge ehrlich ab und übernimm Verantwortung für deine Wahl.',
        en: 'Weigh things honestly and take responsibility for your choice.',
      },
    },
    reflection: {
      de: 'Was wäre heute eine faire Entscheidung – auch mir selbst gegenüber?',
      en: 'What would be a fair decision today – towards myself, too?',
    },
    ritual: {
      de: 'Zeichne eine Linie in die Mitte eines Blattes und schreib links, was du gibst, und rechts, was du bekommst.',
      en: 'Draw a line down the middle of a page and write what you give on the left and what you receive on the right.',
    },
  }),

  major(12, 'hanged-man', 'twilight', {
    title: { de: 'Der Gehängte', en: 'The Hanged Man' },
    essence: {
      de: 'Innehalten, Perspektivwechsel und die Kraft des Abwartens.',
      en: 'Pausing, a change of perspective and the power of waiting.',
    },
    themes: {
      self: {
        de: 'Manchmal hilft es, die Dinge einmal umgekehrt zu betrachten. Wenn du feststeckst, muss das nicht Stillstand bedeuten. Nutze die Pause, um einen neuen Blickwinkel zu finden.',
        en: 'Sometimes it helps to look at things the other way round. Being stuck need not mean standing still. Use the pause to find a new angle.',
      },
      love: {
        de: 'Versuch heute, eine Situation einmal von der anderen Seite aus zu sehen. Frag nach, statt zu vermuten. Ein Perspektivwechsel kann festgefahrene Gespräche lösen.',
        en: 'Try today to see a situation from the other side. Ask rather than assume. A change of perspective can loosen conversations that are stuck.',
      },
      career: {
        de: 'Nicht jedes Projekt lässt sich beschleunigen. Wenn etwas gerade warten muss, nutze die Zeit zum Nachdenken und Umplanen. Oft zeigt sich im Stillstand die bessere Lösung.',
        en: 'Not every project can be sped up. If something has to wait right now, use the time to think and re-plan. The better solution often appears during a standstill.',
      },
      change: {
        de: 'Eine Entscheidung darf reifen. Wenn du dich hin- und hergerissen fühlst, warte bewusst einen Tag und betrachte die Frage danach von einer anderen Seite. Abwarten kann eine aktive Wahl sein.',
        en: 'A decision is allowed to ripen. If you feel torn, wait a day on purpose and then look at the question from another side. Waiting can be an active choice.',
      },
      balance: {
        de: 'Loslassen bedeutet nicht aufgeben. Gönn dir heute einen Moment, in dem du nichts erreichen musst. Wer sich einer Pause ganz überlässt, kann tief zur Ruhe kommen.',
        en: 'Letting go does not mean giving up. Allow yourself a moment today in which you have nothing to achieve. Giving yourself over to a pause can bring deep rest.',
      },
      creativity: {
        de: 'Dreh deine Idee einmal um – auf dem Papier oder im Kopf. Was passiert, wenn du vom Ende her anfängst? Ungewohnte Blickwinkel bringen frische Lösungen.',
        en: 'Turn your idea upside down – on paper or in your mind. What happens if you start from the end? Unusual angles bring fresh solutions.',
      },
    },
    positions: {
      situation: {
        de: 'Etwas hängt in der Schwebe und lässt sich gerade nicht erzwingen.',
        en: 'Something is suspended and cannot be forced right now.',
      },
      challenge: {
        de: 'Ungeduld kann verhindern, dass du siehst, was die Pause dir zeigt.',
        en: 'Impatience can keep you from seeing what the pause is showing you.',
      },
      impulse: {
        de: 'Wechsle bewusst die Perspektive und lass die Lage zu dir sprechen.',
        en: 'Change your perspective on purpose and let the situation speak to you.',
      },
    },
    reflection: {
      de: 'Wie sähe meine Lage aus, wenn ich sie von der anderen Seite betrachte?',
      en: 'What would my situation look like if I saw it from the other side?',
    },
    ritual: {
      de: 'Sieh dir einen vertrauten Raum aus einer ungewohnten Position an – im Sitzen auf dem Boden oder von der Tür aus – und notiere, was dir neu auffällt.',
      en: 'Look at a familiar room from an unusual position – sitting on the floor or from the doorway – and note what strikes you as new.',
    },
  }),

  major(13, 'death', 'shadow', {
    title: { de: 'Der Tod', en: 'Death' },
    essence: {
      de: 'Ein Abschluss, der Raum für Neues schafft.',
      en: 'An ending that makes room for something new.',
    },
    themes: {
      self: {
        de: 'Diese Karte spricht von Abschlüssen, nicht von Gefahr. Vielleicht ist eine alte Rolle oder Gewohnheit an ihr natürliches Ende gekommen. Was du loslässt, schafft Platz für das, was jetzt zu dir passt.',
        en: 'This card speaks of endings, not of danger. Perhaps an old role or habit has reached its natural end. What you let go of makes room for what fits you now.',
      },
      love: {
        de: 'Manches in einer Verbindung darf zu Ende gehen, damit anderes wachsen kann – etwa ein altes Muster oder ein ungesagter Groll. Schau, was du bereit bist abzuschließen. Ein Abschied von einer Gewohnheit kann Nähe erneuern.',
        en: 'Some things in a connection may come to an end so that others can grow – an old pattern, perhaps, or an unspoken grudge. See what you are ready to close. Saying goodbye to a habit can renew closeness.',
      },
      career: {
        de: 'Ein Kapitel im Beruf kann sich schließen, auch wenn das zunächst unbequem ist. Würdige, was war, und schau, was du daraus mitnimmst. Ein klarer Abschluss macht den nächsten Anfang leichter.',
        en: 'A chapter at work may be closing, even if that feels uncomfortable at first. Honour what was, and see what you take with you. A clear ending makes the next beginning easier.',
      },
      change: {
        de: 'Veränderung beginnt oft mit einem Ende. Wenn du spürst, dass etwas ausläuft, musst du es nicht künstlich am Leben halten. Gib dir Zeit für den Übergang, er gehört dazu.',
        en: 'Change often begins with an ending. If you sense that something is running out, you do not have to keep it going artificially. Give yourself time for the transition – it is part of it.',
      },
      balance: {
        de: 'Loslassen kann erleichtern. Trenn dich heute bewusst von einer Kleinigkeit, die dich belastet – einer Aufgabe, einem Gegenstand, einem Gedanken. Leere ist auch Raum.',
        en: 'Letting go can bring relief. Today, deliberately part with one small thing that weighs on you – a task, an object, a thought. Emptiness is also space.',
      },
      creativity: {
        de: 'Nicht jede Idee muss fertig werden. Beende bewusst ein Projekt, das dich nur noch Kraft kostet. Aus dem, was übrig bleibt, kann neuer Stoff entstehen.',
        en: 'Not every idea has to be finished. Consciously end a project that only drains you now. New material can grow from what remains.',
      },
    },
    positions: {
      situation: {
        de: 'Etwas geht zu Ende oder hat sich bereits überlebt.',
        en: 'Something is coming to an end or has already run its course.',
      },
      challenge: {
        de: 'Das Festhalten am Vertrauten kann den Übergang schwerer machen.',
        en: 'Holding on to the familiar can make the transition harder.',
      },
      impulse: {
        de: 'Schließe bewusst ab, was vorbei ist, und lass Raum entstehen.',
        en: 'Close what is over, consciously, and let space open up.',
      },
    },
    reflection: {
      de: 'Was in meinem Leben ist bereit, abgeschlossen zu werden?',
      en: 'What in my life is ready to be brought to a close?',
    },
    ritual: {
      de: 'Schreib eine Gewohnheit auf, die du hinter dir lassen möchtest, falte den Zettel zusammen und leg ihn bewusst beiseite.',
      en: 'Write down a habit you would like to leave behind, fold the note and deliberately put it aside.',
    },
  }),

  major(14, 'temperance', 'light', {
    title: { de: 'Die Mäßigkeit', en: 'Temperance' },
    essence: {
      de: 'Ausgleich, Geduld und die Kunst der richtigen Mischung.',
      en: 'Balance, patience and the art of the right blend.',
    },
    themes: {
      self: {
        de: 'Du musst nicht zwischen Extremen wählen. Oft liegt das Stimmige in einer Mischung, die nur zu dir passt. Probier heute aus, was ein wenig mehr oder ein wenig weniger verändert.',
        en: 'You do not have to choose between extremes. What fits is often a blend that suits only you. Try out today what a little more or a little less would change.',
      },
      love: {
        de: 'Nähe braucht Ausgleich zwischen Ich und Wir. Achte darauf, ob beide Seiten genug Raum haben. Geduldige kleine Schritte verbinden oft besser als große Gesten.',
        en: 'Closeness needs a balance between me and us. Notice whether both sides have enough room. Patient small steps often connect better than grand gestures.',
      },
      career: {
        de: 'Ein gleichmäßiges Tempo trägt weiter als ein Sprint. Verteile deine Kräfte so, dass du auch morgen noch gut arbeiten kannst. Verbinde, was bisher getrennt lief.',
        en: 'A steady pace carries further than a sprint. Spread your energy so that you can still work well tomorrow. Bring together what has been running separately.',
      },
      change: {
        de: 'Nicht jede Veränderung muss radikal sein. Vielleicht findest du einen Weg, Altes und Neues zu verbinden. Ein schrittweiser Übergang kann Kraft sparen.',
        en: 'Not every change has to be radical. Perhaps you can find a way to combine old and new. A gradual transition can save strength.',
      },
      balance: {
        de: 'Balance entsteht durch viele kleine Anpassungen. Achte heute auf deinen Rhythmus aus Tun und Ruhen. Das richtige Maß fühlt sich oft unspektakulär und gut an.',
        en: 'Balance comes from many small adjustments. Pay attention today to your rhythm of doing and resting. The right measure often feels unspectacular, and good.',
      },
      creativity: {
        de: 'Mische, was du sonst trennst: Farben, Stile, Ideen. Aus ungewohnten Verbindungen entsteht oft etwas Eigenes. Geh dabei geduldig vor und probier in kleinen Mengen.',
        en: 'Mix what you usually keep apart: colours, styles, ideas. Something of your own often grows from unusual combinations. Go patiently and try things in small amounts.',
      },
    },
    positions: {
      situation: {
        de: 'Gegensätze suchen gerade nach einem gemeinsamen Maß.',
        en: 'Opposites are looking for a common measure right now.',
      },
      challenge: {
        de: 'Extreme wirken verlockend, bringen dich aber aus dem Gleichgewicht.',
        en: 'Extremes are tempting but throw you off balance.',
      },
      impulse: {
        de: 'Finde die Mischung, die dir guttut, und geh geduldig vor.',
        en: 'Find the blend that does you good, and proceed patiently.',
      },
    },
    reflection: {
      de: 'Wo wäre heute ein Mittelweg stimmiger als ein Entweder-oder?',
      en: 'Where would a middle way feel truer today than an either-or?',
    },
    ritual: {
      de: 'Gieß Wasser langsam von einem Glas in ein anderes und wieder zurück, und atme dabei ruhig mit.',
      en: 'Slowly pour water from one glass into another and back again, breathing calmly as you do.',
    },
  }),

  major(15, 'devil', 'shadow', {
    title: { de: 'Der Teufel', en: 'The Devil' },
    essence: {
      de: 'Bindungen und Gewohnheiten, die festhalten – und die Freiheit, sie zu erkennen.',
      en: 'Ties and habits that hold on – and the freedom of recognising them.',
    },
    themes: {
      self: {
        de: 'Diese Karte lädt dazu ein, ehrlich auf Gewohnheiten zu schauen, die dich festhalten. Oft sind die Ketten lockerer, als sie sich anfühlen. Schon das Erkennen eines Musters ist ein erster Schritt in die Freiheit.',
        en: 'This card invites you to look honestly at habits that hold you. The chains are often looser than they feel. Simply recognising a pattern is a first step towards freedom.',
      },
      love: {
        de: 'Achte darauf, wo Nähe zu Abhängigkeit wird oder wo du aus Gewohnheit nachgibst. Eine gute Verbindung lässt beiden Luft. Du darfst klar benennen, was du brauchst.',
        en: 'Notice where closeness turns into dependence or where you give in out of habit. A good connection leaves both people room to breathe. You may clearly name what you need.',
      },
      career: {
        de: 'Manchmal hält uns etwas fest, das wir gar nicht mehr wollen – ein Anspruch, eine Erwartung, ein Muster. Prüfe, ob du aus Überzeugung oder aus Gewohnheit weitermachst. Klarheit darüber gibt dir Wahlfreiheit zurück.',
        en: 'Sometimes we are held by something we no longer even want – a standard, an expectation, a pattern. Check whether you carry on out of conviction or out of habit. Clarity about that gives you back freedom of choice.',
      },
      change: {
        de: 'Was hindert dich daran, dich zu bewegen? Benenne die Bequemlichkeit oder Angst, die dich bindet, ohne dich dafür zu verurteilen. Was benannt ist, verliert oft an Macht.',
        en: 'What is stopping you from moving? Name the comfort or fear that binds you, without judging yourself for it. What is named often loses some of its power.',
      },
      balance: {
        de: 'Ein kurzer Genuss kann zur Gewohnheit werden, die dir nicht guttut. Schau freundlich und ehrlich hin, wo das bei dir der Fall ist. Kleine Änderungen sind ein guter Anfang.',
        en: 'A brief pleasure can become a habit that does not serve you. Look kindly and honestly at where this is the case for you. Small changes are a good start.',
      },
      creativity: {
        de: 'Auch der Schatten kann kreativ sein. Gib einer Seite von dir Ausdruck, die du sonst versteckst – im Schreiben, Zeichnen oder Tanzen. So wird aus Spannung Gestaltung.',
        en: 'The shadow can be creative, too. Give expression to a side of yourself you usually hide – in writing, drawing or dancing. That way tension turns into creation.',
      },
    },
    positions: {
      situation: {
        de: 'Eine Gewohnheit oder Abhängigkeit prägt die Lage stärker als gedacht.',
        en: 'A habit or dependency shapes the situation more than you thought.',
      },
      challenge: {
        de: 'Bequemlichkeit kann sich wie Sicherheit anfühlen und dich doch binden.',
        en: 'Comfort can feel like safety and still bind you.',
      },
      impulse: {
        de: 'Erkenne, was dich festhält – die Kette ist lockerer, als sie scheint.',
        en: 'Recognise what holds you – the chain is looser than it seems.',
      },
    },
    reflection: {
      de: 'Welche Gewohnheit hält mich fest, obwohl ich sie nicht mehr will?',
      en: 'Which habit holds me even though I no longer want it?',
    },
    ritual: {
      de: 'Verzichte heute eine Stunde lang bewusst auf eine kleine Gewohnheit, etwa das Handy, und beobachte, was dir dabei auffällt.',
      en: 'Today, consciously go without one small habit for an hour – your phone, for instance – and observe what you notice.',
    },
  }),
];
