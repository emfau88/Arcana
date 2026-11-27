/**
 * Content module `archetypes`, German (V04.2). Detailed profiles, reveal sentences, second-voice
 * texts and symbol labels. Voice: "du", calm, symbolic; shadows as questions; no diagnosis, no
 * prediction. Names without article (D-08); the text never
 * addresses the reader as "als <Name>", which would read as feminine singular (S-32). Keys: see archetype-keys.ts.
 */
import { archetypeTable } from './archetype-keys.ts';
import type { TextTable } from './registry.ts';

export const texts: TextTable = archetypeTable(
  {
    seeker: {
      description:
        'Du gehst der Welt mit Fragen entgegen. Dich zieht an, was noch nicht erklärt ist: ein Gedanke, der nicht aufgeht, ein Ort, den du nicht kennst, ein Gespräch, das tiefer führen könnte. Antworten sind für dich Zwischenstationen, selten Endpunkte. Darin liegt Freiheit, denn du lässt dich nicht leicht auf eine einzige Sicht festlegen.\n\nIn diesem Grimoire stehen dir drei Karten besonders nah: der Narr, der mit leichtem Gepäck aufbricht, der Eremit, der mit seiner Laterne nach innen leuchtet, und der Stern, der Orientierung schenkt, ohne ein Ziel vorzuschreiben. Die Laterne ist dein Leitsymbol. Sie zeigt nie den ganzen Weg, nur die nächsten Schritte, und das genügt dir oft.\n\nDeine Gabe ist die Offenheit, mit der du Neues hereinlässt. Eine Einladung an dich kann sein, dem Gefundenen Zeit zu geben, damit es Wurzeln schlagen darf.',
      strengths: [
        'Du stellst Fragen, die andere übersehen, und öffnest damit Gespräche, die sonst an der Oberfläche blieben.',
        'Neues schreckt dich selten ab. Du kannst eine Weile im Ungewissen bleiben, ohne sofort eine Lösung zu erzwingen.',
        'Du lernst aus vielen Quellen und verbindest Erfahrungen, die auf den ersten Blick nichts miteinander zu tun haben.',
      ],
      shadows: [
        'Welche Antwort hast du schon gefunden, traust dich aber noch nicht, sie gelten zu lassen?',
        'Wo hält dich die Suche nach dem Richtigen davon ab, das Gute schon zu nehmen?',
      ],
      growth: 'Eine Frage eine Weile mit dir tragen, statt gleich zur nächsten zu springen.',
      reflections: [
        'Was habe ich zuletzt entdeckt, das ich noch gar nicht gewürdigt habe?',
        'Wo in meinem Leben darf ich ankommen, wenigstens für eine Zeit?',
        'Welche Frage stelle ich immer wieder, und was sucht sie eigentlich?',
        'Wer begleitet mich gern auf meinen Umwegen?',
      ],
      reveal: 'Nicht jedes Ziel muss feststehen, damit ein Weg Sinn ergibt. Deine Fragen dürfen dich führen.',
      complement: 'Neugier ist das Geschenk dieser zweiten Stimme. Sie erinnert dich daran, auch Vertrautes noch einmal mit offenen Augen anzusehen.',
    },
    guardian: {
      description:
        'Bei dir finden andere Halt. Menschen spüren in deiner Nähe, dass etwas verlässlich bleibt, auch wenn ringsum vieles in Bewegung ist. Du merkst früh, was ein Raum, eine Gruppe oder eine Beziehung braucht, und kümmerst dich darum, oft ohne viel Aufhebens. Fürsorge ist für dich keine Pflicht, sondern eine Form von Aufmerksamkeit.\n\nIn diesem Grimoire stehen dir drei Karten besonders nah: der Herrscher, der Ordnung und sichere Grenzen gibt, die Kraft, die mit sanfter Hand statt mit Härte führt, und die Mäßigkeit, die ausgleicht und Maß hält. Die Lilie ist dein Leitsymbol, ein Zeichen für Reinheit und Schutz, die nicht laut sein müssen.\n\nDeine Gabe ist Beständigkeit. Eine Einladung an dich kann sein, denselben Schutz, den du anderen schenkst, auch dir selbst zu gönnen und deine eigenen Bedürfnisse nicht erst am Ende des Tages zu bemerken.',
      strengths: [
        'Auf dich ist Verlass. Was du zusagst, trägst du durch, und andere können darauf bauen.',
        'Du spürst Grenzen fein, deine eigenen und die der anderen, und gehst achtsam mit ihnen um.',
        'In unruhigen Zeiten bleibst du ein ruhender Punkt, an dem sich andere sammeln können.',
      ],
      shadows: [
        'Was würde geschehen, wenn du einmal um Hilfe bittest, statt sie nur zu geben?',
        'Wann hältst du an Gewohntem fest, obwohl es dir längst zu eng geworden ist?',
      ],
      growth: 'Fürsorge so verteilen, dass auch für dich selbst etwas übrig bleibt.',
      reflections: [
        'Wo darf ich heute weniger tragen?',
        'Welche meiner Grenzen verdient gerade mehr Achtung?',
        'Wer gibt mir Halt, wenn ich ihn brauche?',
        'Was beschütze ich aus Gewohnheit, und was aus echter Überzeugung?',
      ],
      reveal: 'Deine Stärke zeigt sich leise, in Treue und Achtsamkeit. Auch du darfst an einem sicheren Ort ausruhen.',
      complement: 'Diese zweite Stimme gibt dir Bodenhaftung. Sie lädt dich ein, gut für das zu sorgen, was dir wichtig ist, dich selbst eingeschlossen.',
    },
    visionary: {
      description:
        'Du nimmst wahr, was zwischen den Zeilen liegt. Du ahnst Zusammenhänge, bevor du sie benennen kannst, und Bilder, Träume oder ein plötzliches Gefühl sprechen oft deutlicher zu dir als lange Erklärungen. Diese Feinfühligkeit lässt dich die Welt aufmerksam beobachten, und du erkennst Muster, wo andere nur Zufall sehen.\n\nIn diesem Grimoire stehen dir drei Karten besonders nah: die Hohepriesterin, die das innere Wissen hütet, der Mond, der durch Zwielicht und Ahnungen führt, und das Glücksrad, das von Kreisläufen und Wendepunkten erzählt. Das Auge ist dein Leitsymbol, ein Blick, der nach innen wie nach außen reicht.\n\nDeine Gabe ist Weitblick. Eine Einladung an dich kann sein, deine Eingebungen freundlich zu prüfen und ihnen einen ersten kleinen, greifbaren Schritt zu geben, damit sie nicht nur Bilder bleiben.',
      strengths: [
        'Du nimmst Stimmungen und Zwischentöne wahr, die anderen leicht entgehen.',
        'Deine Vorstellungskraft öffnet Möglichkeiten, an die noch niemand gedacht hat.',
        'Du erkennst Muster und Wiederholungen und siehst dadurch Zusammenhänge, die über den Moment hinausreichen.',
      ],
      shadows: [
        'Welche Ahnung nimmst du ernster als das, was gerade wirklich vor dir liegt?',
        'Wann zweifelst du an deiner Wahrnehmung, nur weil andere sie nicht teilen?',
      ],
      growth: 'Der eigenen Wahrnehmung trauen und sie zugleich offen für andere Sichtweisen halten.',
      reflections: [
        'Welches Bild kehrt in letzter Zeit immer wieder zu mir zurück?',
        'Was sagt mir mein Bauchgefühl, wenn ich ihm eine Minute Stille gebe?',
        'Welcher Kreislauf in meinem Leben wiederholt sich gerade?',
        'Wie kann ich eine Idee von heute in einen kleinen Schritt verwandeln?',
      ],
      reveal: 'Deine Ahnungen sind eine Sprache, die du lesen lernen darfst. Sie verlangt keine Eile, nur Aufmerksamkeit.',
      complement: 'Mit dieser zweiten Stimme öffnet sich dein Blick für Zwischentöne. Neben Fakten bekommen auch deine Eingebungen einen Platz.',
    },
    alchemist: {
      description:
        'Du gehst nicht um das Schwierige herum, sondern hindurch. Du hast erfahren, dass in Krisen, Brüchen und unbequemen Gefühlen oft ein Rohstoff steckt, aus dem etwas Neues werden kann. Diese Haltung gibt dir Tiefe und eine besondere Art von Mut. Andere suchen dich vielleicht gerade dann auf, wenn etwas ins Wanken gerät.\n\nIn diesem Grimoire stehen dir drei Karten besonders nah: der Tod, der von Abschied und Wandel erzählt, der Turm, der festgefahrene Mauern öffnet, und der Teufel, der auf Bindungen hinweist, die sich lösen lassen, sobald man sie erkennt. Der Phönix ist dein Leitsymbol, das Bild eines Wesens, das aus der Asche neu aufsteigt.\n\nDeine Gabe ist Ausdauer im Wandel. Eine Einladung an dich kann sein, zwischen dem zu unterscheiden, was verwandelt werden will, und dem, was einfach angenommen werden darf.',
      strengths: [
        'Du hältst schwierige Gefühle aus, ohne vor ihnen davonzulaufen, und findest darin oft einen Sinn.',
        'Aus Fehlern und Umwegen machst du Erfahrung, die dir und anderen weiterhilft.',
        'Wenn etwas zerbricht, siehst du schon die Teile, aus denen sich etwas Neues bauen lässt.',
      ],
      shadows: [
        'Suchst du manchmal die Tiefe, wo auch Leichtigkeit erlaubt wäre?',
        'Welche Veränderung wünschst du dir bei anderen, die vielleicht eigentlich deine eigene ist?',
      ],
      growth: 'Auch kleinen, ruhigen Veränderungen ihren Wert zugestehen, nicht nur den großen Umbrüchen.',
      reflections: [
        'Welche Erfahrung von früher trägt heute eine Stärke in sich?',
        'Woran klammere ich mich, und was würde geschehen, wenn ich es lockerer halte?',
        'Wo darf ich heute einfach annehmen, statt zu verändern?',
        'Welcher Teil von mir ist gerade im Umbau?',
      ],
      reveal: 'Was du durchlebt hast, muss keine Last bleiben. In deinen Händen kann daraus etwas werden, das trägt.',
      complement: 'Hier spricht der Mut zur Tiefe mit. Auch ein schwerer Abschnitt kann so zum Rohstoff für etwas Neues werden.',
    },
    wanderer: {
      description:
        'Unterwegs kommst du bei dir an. Bewegung klärt deinen Kopf, und neue Orte, Menschen oder Aufgaben zeigen dir Seiten an dir, die im Stillstand verborgen blieben. Du brauchst Weite, im Raum wie im Denken, und vertraust darauf, dass sich der Weg unter deinen Schritten formt. Diese Haltung macht dich anpassungsfähig und offen für Begegnungen.\n\nIn diesem Grimoire stehen dir drei Karten besonders nah: der Wagen, der mit Willen und Richtung voranfährt, die Liebenden, die an jeder Weggabelung eine Wahl aus dem Herzen verlangen, und die Welt, die das Gefühl beschreibt, angekommen und zugleich frei zu sein. Die Feder ist dein Leitsymbol, leicht genug, um mit dem Wind zu reisen.\n\nDeine Gabe ist Vertrauen in den Weg. Eine Einladung an dich kann sein, auch Wurzeln zuzulassen und zu bemerken, welche Orte und Menschen dich wirklich nähren.',
      strengths: [
        'Du findest dich schnell in neuen Situationen zurecht und machst aus Umwegen Entdeckungen.',
        'Du begegnest fremden Menschen und Sichtweisen offen und ohne vorschnelles Urteil.',
        'Bewegung, ob draußen oder im Kopf, hilft dir, festgefahrene Fragen wieder in Fluss zu bringen.',
      ],
      shadows: [
        'Wann ist ein Aufbruch Neugier, und wann eher ein Ausweichen vor Nähe?',
        'Was würdest du entdecken, wenn du an einem Ort länger bleibst als gewohnt?',
      ],
      growth: 'Freiheit und Verbindlichkeit so verbinden, dass beide Platz haben.',
      reflections: [
        'Wo fühle ich mich zu Hause, auch wenn ich unterwegs bin?',
        'Welche Entscheidung wartet an meiner nächsten Weggabelung?',
        'Was nehme ich von meinen letzten Wegen mit?',
        'Wer oder was lässt mich gern bleiben?',
      ],
      reveal: 'Jeder Weg schenkt dir ein Stück mehr von dir selbst. Und jeder Ort, an den du gern zurückkehrst, auch.',
      complement: 'Bewegung und Weite kommen mit dieser zweiten Stimme in dein Leben. Ab und zu darf ein neuer Weg locken, auch im Kleinen.',
    },
    creator: {
      description:
        'In dir steckt die Freude am Machen. Ideen bleiben bei dir selten nur Gedanken, sie wollen Form annehmen, sei es als Bild, als Text, als Projekt oder als liebevoll gedeckter Tisch. Du hast Freude am Gestalten und steckst andere oft mit deiner Begeisterung an. Schaffen ist für dich eine Art, mit der Welt zu sprechen.\n\nIn diesem Grimoire stehen dir drei Karten besonders nah: der Magier, der die vorhandenen Mittel zu etwas Neuem verbindet, die Herrscherin, die Wachstum und Fülle nährt, und die Sonne, die Freude und Lebendigkeit ausstrahlt. Der Stab ist dein Leitsymbol, ein Zeichen für Tatkraft und den Funken, der etwas in Gang setzt.\n\nDeine Gabe ist Ausdruck. Eine Einladung an dich kann sein, auch Unfertiges zu zeigen und deinen Wert nicht allein an dem zu messen, was am Ende daraus entsteht.',
      strengths: [
        'Du siehst in einfachen Dingen Material für etwas Neues und fängst einfach an.',
        'Deine Begeisterung steckt an und bringt andere dazu, selbst etwas zu wagen.',
        'Du gibst Gefühlen und Ideen eine Form, die man sehen, hören oder anfassen kann.',
      ],
      shadows: [
        'Was würdest du erschaffen, wenn niemand es je bewerten würde?',
        'Wann beginnst du lieber etwas Neues, als das Begonnene in Ruhe reifen zu lassen?',
      ],
      growth: 'Pausen als Teil des Schaffens ansehen, in denen Neues still heranwächst.',
      reflections: [
        'Welche Idee wartet schon länger darauf, dass ich sie beginne?',
        'Wobei vergesse ich die Zeit, weil es mir einfach Freude macht?',
        'Was darf heute unvollkommen bleiben?',
        'Mit wem könnte ich etwas gemeinsam gestalten?',
      ],
      reveal: 'Was durch dich entsteht, trägt deine Handschrift. Auch das Unfertige gehört schon dazu.',
      complement: 'Deine Lust am Gestalten wird durch diese zweite Stimme geweckt. Schon ein kleiner Anfang zählt dann als Werk.',
    },
    sage: {
      description:
        'Dich interessiert, was die Dinge im Innersten zusammenhält. Du hörst genau zu, wägst ab und nimmst dir Zeit, bevor du urteilst. Wissen ist für dich kein Besitz, sondern eine Lampe, die Klarheit in verworrene Lagen bringt, für dich und für andere. Viele schätzen deinen ruhigen Rat und deine Fähigkeit, das Wesentliche zu benennen.\n\nIn diesem Grimoire stehen dir drei Karten besonders nah: der Hierophant, der überliefertes Wissen weitergibt, die Gerechtigkeit, die ehrlich abwägt, und der Gehängte, der die Welt aus einem neuen Blickwinkel betrachtet und dadurch Einsicht gewinnt. Die Eule ist dein Leitsymbol, die auch im Dunkeln sieht und gerade in der Stille aufmerksam ist.\n\nDeine Gabe ist Klarheit. Eine Einladung an dich kann sein, dein Wissen mit Gefühl zu verbinden und dir Nähe zu erlauben, wo Abstand gerade bequemer wäre.',
      strengths: [
        'Du kannst Verwirrendes ordnen und das Wesentliche in wenigen Worten benennen.',
        'Du urteilst nicht vorschnell, sondern hörst erst zu und prüfst, was wirklich gesagt wurde.',
        'Andere vertrauen deinem Rat, weil du ehrlich bist, auch wenn es unbequem ist.',
      ],
      shadows: [
        'Wann versteckst du ein Gefühl hinter einer klugen Erklärung?',
        'Was würde sich öffnen, wenn du einmal nicht wissen müsstest?',
      ],
      growth: 'Eigene Unsicherheit zeigen und darin eine Form von Weisheit erkennen.',
      reflections: [
        'Was habe ich zuletzt von jemandem gelernt, den ich unterschätzt habe?',
        'Welche Sicht auf eine Sache könnte ich heute einmal umdrehen?',
        'Wo spricht mein Kopf, und wo mein Herz?',
        'Welches Wissen möchte ich weitergeben?',
      ],
      reveal: 'In deiner Ruhe liegt eine Klarheit, die auch anderen Orientierung gibt. Sie wächst, wenn du nicht alles wissen musst.',
      complement: 'Ein klarer, ruhiger Blick begleitet dich als zweite Stimme. Vor Entscheidungen hilft er dir, kurz innezuhalten und genau hinzusehen.',
    },
    renewer: {
      description:
        'Wo etwas endet, siehst du oft schon, was beginnen könnte. Du spürst, wann etwas seine Zeit gehabt hat, und findest den Mut, es loszulassen, damit Raum für Neues entsteht. Diese Fähigkeit ist kostbar, denn Loslassen fällt vielen schwer, während du oft schon den nächsten Keim bemerkst. Neubeginn ist für dich kein Bruch, sondern ein natürlicher Rhythmus, wie bei den Jahreszeiten.\n\nIn diesem Grimoire stehen dir drei Karten besonders nah: der Tod, der Abschiede würdigt, das Gericht, das zu einem bewussten Neuanfang ruft, und der Stern, der nach stürmischen Zeiten Hoffnung schenkt. Der Lotus ist dein Leitsymbol, eine Blüte, die aus trübem Wasser klar und schön aufsteigt.\n\nDeine Gabe ist Erneuerung. Eine Einladung an dich kann sein, Abschiede bewusst zu würdigen, statt sofort nach vorn zu eilen, und Dingen Zeit zu geben, die noch reifen wollen.',
      strengths: [
        'Du kannst loslassen, was nicht mehr passt, und schaffst damit Raum für Neues.',
        'Nach schweren Zeiten findest du zurück ins Leben und machst anderen Mut, dasselbe zu tun.',
        'Du erkennst den richtigen Moment für einen Neuanfang und gehst ihn mit Zuversicht an.',
      ],
      shadows: [
        'Welcher Abschied bräuchte noch etwas Trauer, bevor der Neubeginn wirklich trägt?',
        'Wann ist ein Neuanfang eine Erneuerung, und wann ein Ausweichen vor dem Bleiben?',
      ],
      growth: 'Geduld mit dem haben, was langsam wächst, und ihm Pflege statt Eile schenken.',
      reflections: [
        'Was in mir beginnt gerade, ganz leise, neu zu wachsen?',
        'Wofür bin ich einem abgeschlossenen Kapitel dankbar?',
        'Was darf noch bleiben, obwohl ich es loslassen wollte?',
        'Welche Hoffnung trägt mich in diesen Tagen?',
      ],
      reveal: 'Loslassen ist bei dir ein Akt des Vertrauens. Was du verabschiedest, darfst du vorher würdigen.',
      complement: 'Loslassen fällt mit dieser zweiten Stimme etwas leichter. Ein Abschluss darf Platz für Neues schaffen.',
    },
  },
  {
    lantern: 'Laterne',
    star: 'Stern',
    key: 'Schlüssel',
    lily: 'Lilie',
    pillars: 'Säulen',
    rose: 'Rose',
    eye: 'Auge',
    moon: 'Mond',
    feather: 'Feder',
    phoenix: 'Phönix',
    serpent: 'Schlange',
    chalice: 'Kelch',
    wheel: 'Rad',
    wheat: 'Ähre',
    staff: 'Stab',
    sun: 'Sonne',
    lotus: 'Lotus',
    owl: 'Eule',
    scales: 'Waage',
    butterfly: 'Schmetterling',
    lemniscate: 'Lemniskate',
  },
);
