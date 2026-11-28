/**
 * Modul symbols, Deutsch (V06.4). 24 Symbole mit Name, Bedeutung, Licht, Schatten und Reflexion.
 * Jede Bedeutung nennt die Überlieferung („gilt traditionell als“), nie eine Wirkung des Symbols.
 * Wo ein Symbol in einem Kartenbild steht, beschreibt der Text das gemalte Deck dieser App (S-34,
 * Abgleich S-64), nicht das klassische Bild. Namen wie im Modul `archetypes`.
 */
import { symbolsTable } from './symbols-keys.ts';
import type { TextTable } from './registry.ts';

export const texts: TextTable = symbolsTable({
  sun: {
    name: 'Sonne',
    meaning:
      'Die Sonne gilt traditionell als Zeichen für Leben, Klarheit und Bewusstsein. Sie macht sichtbar, was im Dunkeln lag, und schenkt Wärme, ohne etwas dafür zu verlangen. In vielen Kulturen steht sie für das Ich, das sich zeigen darf, wie es ist. In diesem Deck geht sie auf der Karte des Todes zwischen zwei Türmen auf und steht auf der Karte der Sonne hell über einer alten Gartenmauer. Ihr Licht erinnert daran, dass auch nach langen Nächten wieder Tag wird.',
    light: 'Die Sonne lädt dich ein, dich mit dem zu zeigen, was in dir hell und lebendig ist.',
    shadow: 'Wo willst du so hell strahlen, dass für Zweifel und Müdigkeit kein Platz mehr bleibt?',
    reflection: 'Was in deinem Leben fühlt sich gerade warm und klar an?',
  },
  moon: {
    name: 'Mond',
    meaning:
      'Der Mond gilt traditionell als Zeichen für das Unbewusste, für Träume, Gefühle und Zyklen. Er leuchtet nicht aus sich selbst, sondern spiegelt das Licht der Sonne, und jede Nacht zeigt er eine etwas andere Gestalt. Darum steht er für das, was wechselt und trotzdem wiederkehrt. In diesem Deck leuchtet er groß hinter dem Vorhang der Hohepriesterin und zeigt über dem Weg der Mondkarte seine volle Scheibe mit goldener Sichel. Sein Licht zeigt Umrisse, keine Einzelheiten.',
    light: 'Der Mond ermutigt dich, Gefühlen und Ahnungen zu trauen, auch wenn sie noch keine klare Form haben.',
    shadow: 'Wann verlierst du dich in Stimmungen, bis du kaum noch weißt, was Traum und was Wirklichkeit ist?',
    reflection: 'Welches Gefühl kehrt bei dir immer wieder, wie eine Phase des Mondes?',
  },
  star: {
    name: 'Stern',
    meaning:
      'Der Stern gilt traditionell als Zeichen für Hoffnung, Orientierung und Vertrauen. Seefahrer und Reisende lasen ihren Weg an den Sternen ab, lange bevor es Landkarten gab. Ein Stern ist weit entfernt und gibt doch Richtung, ohne ein Ziel vorzuschreiben. In diesem Deck leuchtet er im Glas der Laterne des Eremiten, schwebt als Kranz aus zwölf Sternen über der Herrscherin und steht groß mit acht Strahlen über der Sternkarte. Er steht für ein Licht, das erst in der Nacht sichtbar wird.',
    light: 'Der Stern erinnert dich daran, dass ein fernes Licht genügt, um die Richtung zu halten.',
    shadow: 'Wo wartest du auf ein Zeichen von oben, statt den nächsten eigenen Schritt zu gehen?',
    reflection: 'Was gibt dir gerade Orientierung, auch wenn das Ziel noch fern ist?',
  },
  lotus: {
    name: 'Lotus',
    meaning:
      'Der Lotus gilt traditionell als Zeichen für Reinheit, Erwachen und inneres Wachstum. Er wurzelt im Schlamm eines Teiches und öffnet seine Blüte doch sauber über dem Wasser. In alten Überlieferungen Indiens und Ägyptens steht er für einen Geist, der sich entfaltet, ohne seine Herkunft zu verleugnen. Jede Schicht des Weges gehört dazu, auch die trübe. Der Lotus erzählt davon, dass Schönheit aus dem wachsen kann, was zunächst schwer erscheint.',
    light: 'Der Lotus zeigt dir, dass du aus schwierigen Erfahrungen heraus wachsen und dich öffnen kannst.',
    shadow: 'Wann möchtest du nur die Blüte zeigen und den Schlamm verbergen, aus dem sie gewachsen ist?',
    reflection: 'Was ist in dir aus einer schweren Zeit gewachsen?',
  },
  key: {
    name: 'Schlüssel',
    meaning:
      'Der Schlüssel gilt traditionell als Zeichen für Zugang, Wissen und Entscheidung. Er öffnet und verschließt, und wer ihn hält, wählt, welche Tür sich bewegt. In alten Bildern tragen Hüterinnen und Hüter der Schwelle Schlüssel, die zwischen innen und außen vermitteln. In diesem Deck kreuzen sich zwei große Schlüssel auf dem Schachbrettboden in der Halle des Hierophanten. Sie liegen offen da, als dürfe jede und jeder sie aufheben.',
    light: 'Der Schlüssel erinnert dich daran, dass du manche Tür selbst öffnen kannst.',
    shadow: 'Welche Tür hältst du verschlossen, obwohl der Schlüssel längst in deiner Hand liegt?',
    reflection: 'Welches Wissen könnte dir gerade eine Tür öffnen?',
  },
  butterfly: {
    name: 'Schmetterling',
    meaning:
      'Der Schmetterling gilt traditionell als Zeichen für Verwandlung, Leichtigkeit und die Seele. Bevor er fliegen kann, lebt er als Raupe und ruht verborgen in einer Puppe, in der sich seine Gestalt ganz neu ordnet. Im Griechischen bedeutet Psyche zugleich Seele und Schmetterling. So steht er für Wandlung, die Zeit und Stille braucht. Sein Flug wirkt zart, und doch legen manche Arten weite Strecken zurück.',
    light: 'Der Schmetterling ermutigt dich, einer Veränderung Zeit zu lassen, bis sie sich von selbst entfaltet.',
    shadow: 'Wo möchtest du schon fliegen, während etwas in dir noch Ruhe in der Puppe braucht?',
    reflection: 'Welche Verwandlung geschieht gerade still in dir?',
  },
  phoenix: {
    name: 'Phönix',
    meaning:
      'Der Phönix gilt traditionell als Zeichen für Erneuerung und für die Kraft, nach einem Ende neu zu beginnen. Der Sage nach verbrennt der Vogel am Ende seines langen Lebens in Flammen und steigt aus seiner eigenen Asche wieder auf. Schon in der Antike erzählte man von ihm als Bild für Wiederkehr. Er steht für Wandel, der nichts beschönigt: Etwas vergeht wirklich. Und doch bleibt etwas, aus dem Neues entstehen kann.',
    light: 'Der Phönix zeigt dir, dass nach einem Ende etwas Neues in dir aufsteigen kann.',
    shadow: 'Wann hältst du an der Asche fest, obwohl du schon spürst, dass etwas Neues beginnen will?',
    reflection: 'Was ist in deinem Leben zu Ende gegangen und hat Platz für Neues gelassen?',
  },
  serpent: {
    name: 'Schlange',
    meaning:
      'Die Schlange gilt traditionell als Zeichen für Wandlung, Lebenskraft und Wissen. Sie häutet sich viele Male im Leben und lässt die alte Hülle einfach zurück. Viele Kulturen sehen in ihr eine Hüterin von Weisheit, und als Ouroboros, die sich in den eigenen Schwanz beißt, steht sie für den ewigen Kreislauf. Sie gilt als zwiespältig, wachsam und erdverbunden zugleich. Ihr Bild lädt ein, Altes abzulegen, wenn es zu eng geworden ist.',
    light: 'Die Schlange ermutigt dich, abzulegen, was dir zu eng geworden ist.',
    shadow: 'Welche alte Haut trägst du noch, weil sie vertraut ist, obwohl sie längst nicht mehr passt?',
    reflection: 'Was möchtest du ablegen, damit du wieder frei atmen kannst?',
  },
  tree: {
    name: 'Baum',
    meaning:
      'Der Baum gilt traditionell als Zeichen für Wachstum, Verwurzelung und Verbindung. Seine Wurzeln reichen in die Erde, seine Krone in den Himmel, und viele Mythen sehen in ihm eine Achse zwischen den Welten. Er wächst langsam und legt mit jedem Jahr einen Ring zu. In diesem Deck neigen sich auf der Karte der Liebenden zwei ganz verschiedene Bäume zueinander, und beim Gehängten wächst ein lebendiger Baum am stillen See. Ein Baum steht für Beständigkeit, die lebendig bleibt.',
    light: 'Der Baum lädt dich ein, tief zu wurzeln und dir trotzdem Raum zum Wachsen zu nehmen.',
    shadow: 'Wo stehst du so fest, dass kein Wind dich mehr bewegen darf?',
    reflection: 'Was gibt dir Wurzeln, und wohin möchtest du wachsen?',
  },
  owl: {
    name: 'Eule',
    meaning:
      'Die Eule gilt traditionell als Zeichen für Weisheit, Wachheit und den Blick ins Verborgene. In der griechischen Überlieferung begleitete sie Athene, die Göttin der Weisheit. Sie sieht und hört in der Nacht, wenn andere Tiere ruhen, und fliegt fast lautlos. Darum steht sie für ein Wissen, das in der Stille wächst und genau hinschaut. Ihr ruhiger Blick erinnert daran, dass Klarheit oft dann kommt, wenn es um uns leise geworden ist.',
    light: 'Die Eule ermutigt dich, still zu werden und genau hinzusehen, bevor du urteilst.',
    shadow: 'Wann ziehst du dich so sehr ins Beobachten zurück, dass du kaum noch teilnimmst?',
    reflection: 'Was siehst du klarer, sobald es still um dich ist?',
  },
  crown: {
    name: 'Krone',
    meaning:
      'Die Krone gilt traditionell als Zeichen für Würde, Verantwortung und Vollendung. Sie wird auf dem Kopf getragen, dem höchsten Punkt des Körpers, und verbindet in vielen Bildern das Irdische mit dem Höheren. Wer sie trägt, steht für etwas ein, das über die eigene Person hinausgeht. In diesem Deck hat sich die kleine goldene Krone auf der Karte des Turms ein Stück vom Mauerwerk gelöst. So zeigt sie auch, dass Würde beweglich bleibt und nicht festgemauert ist.',
    light: 'Die Krone erinnert dich an deine eigene Würde und daran, wofür du Verantwortung übernehmen magst.',
    shadow: 'Wo hältst du an Rang oder Ansehen fest, auch wenn es dir längst zu schwer geworden ist?',
    reflection: 'Wofür trägst du gerne Verantwortung?',
  },
  chalice: {
    name: 'Kelch',
    meaning:
      'Der Kelch gilt traditionell als Zeichen für Gefühl, Empfangen und Verbundenheit. Im Tarot gehört er zum Element Wasser und zu allem, was das Herz bewegt. Ein Kelch ist offen und kann nur halten, was in ihn hineinfließt. In diesem Deck steht er auf dem Tisch des Magiers, und auf der Karte der Mäßigkeit verbindet ein Bogen aus Wasser zwei goldene Kelche. Er erzählt davon, dass Fülle mit dem Empfangen beginnt.',
    light: 'Der Kelch lädt dich ein, offen anzunehmen, was dir an Zuwendung entgegenkommt.',
    shadow: 'Wann gibst du so viel aus deinem Kelch, dass für dich selbst nichts mehr bleibt?',
    reflection: 'Was füllt gerade deinen inneren Kelch?',
  },
  sword: {
    name: 'Schwert',
    meaning:
      'Das Schwert gilt traditionell als Zeichen für Klarheit, Wahrheit und Entscheidung. Im Tarot gehört es zum Element Luft, zum Denken und zum klaren Wort. Ein Schwert trennt, was zusammengewachsen ist, und schafft damit Unterscheidung. In diesem Deck liegt es auf dem Tisch des Magiers, und auf der Karte der Gerechtigkeit bildet es aufrecht die Achse der Waage. So zeigt es eine Klarheit, die im Gleichgewicht bleibt.',
    light: 'Das Schwert ermutigt dich, klar zu benennen, was du denkst und was du willst.',
    shadow: 'Wo werden deine Worte schärfer, als die Sache es verlangt?',
    reflection: 'Welche Entscheidung würde dir gerade Klarheit schenken?',
  },
  staff: {
    name: 'Stab',
    meaning:
      'Der Stab gilt traditionell als Zeichen für Willenskraft, Tatendrang und Wachstum. Im Tarot gehört er zum Element Feuer und zu allem, was in Bewegung kommt. Ein Wanderstab stützt auf dem Weg und gibt Halt, wenn der Boden uneben wird. In diesem Deck lehnt er beim Narren am Felsen, trägt beim Eremiten die Laterne und steht als goldener Stab mit drei Ringen in der Halle des Hierophanten. Er steht für die Kraft, aufzubrechen und weiterzugehen.',
    light: 'Der Stab gibt dir Schwung, eine Idee in die Tat umzusetzen.',
    shadow: 'Wann treibst du dich so an, dass dein Feuer dich mehr verbraucht als wärmt?',
    reflection: 'Wofür möchtest du gerade deine Kraft einsetzen?',
  },
  rose: {
    name: 'Rose',
    meaning:
      'Die Rose gilt traditionell als Zeichen für Liebe, Schönheit und das Geheimnis. Die rote Rose steht für Leidenschaft, die weiße für Reinheit und Neubeginn, und ihre Dornen erinnern daran, dass Schönheit verletzlich ist. In der Antike war sie auch ein Bild für Verschwiegenheit. In diesem Deck wächst eine weiße Rose neben der Felskante des Narren und blüht im Vordergrund der Karte des Todes. Am Tisch des Magiers stehen Rosen neben Lilien.',
    light: 'Die Rose lädt dich ein, Schönheit und Liebe in deinem Alltag bewusst wahrzunehmen.',
    shadow: 'Wo schirmst du dein Herz mit Dornen ab, obwohl du dir eigentlich Nähe wünschst?',
    reflection: 'Was blüht in deinem Leben, das du mehr würdigen möchtest?',
  },
  lily: {
    name: 'Lilie',
    meaning:
      'Die Lilie gilt traditionell als Zeichen für Reinheit, Unschuld und Klarheit. Mit ihrer hellen, aufrechten Blüte steht sie in vielen Bildern für einen klaren Geist und ein offenes Herz. Im Tarot erscheint sie oft neben der Rose, als Gegenpol der Leidenschaft. In diesem Deck stehen Lilien am Tisch des Magiers, und auf der Karte der Kraft wächst eine Lilie aus einem gesprungenen Stein. Sie zeigt, dass Zartes sich auch an harten Orten Raum schaffen kann.',
    light: 'Die Lilie erinnert dich daran, dass Klarheit und Sanftheit gut zusammenpassen.',
    shadow: 'Wann verlangst du von dir eine Reinheit, die keinen Fehler mehr erlaubt?',
    reflection: 'Wo darf etwas Zartes in dir wachsen?',
  },
  eye: {
    name: 'Auge',
    meaning:
      'Das Auge gilt traditionell als Zeichen für Wahrnehmung, Bewusstsein und innere Schau. In vielen Kulturen steht es für einen wachen Blick, der hinter die Oberfläche reicht. Das Auge des Horus galt im alten Ägypten als Zeichen der Ganzheit, und manche Lehren sprechen von einem inneren Auge der Intuition. Es lädt dazu ein, genau hinzusehen. Dazu gehört auch, sich selbst ehrlich zu betrachten.',
    light: 'Das Auge ermutigt dich, deiner Wahrnehmung zu trauen und genauer hinzusehen.',
    shadow: 'Wo schaust du lieber weg, weil das, was du sehen könntest, unbequem wäre?',
    reflection: 'Was siehst du, wenn du ehrlich hinschaust?',
  },
  feather: {
    name: 'Feder',
    meaning:
      'Die Feder gilt traditionell als Zeichen für Leichtigkeit, Freiheit und Wahrheit. Im alten Ägypten wurde der Überlieferung nach das Herz der Verstorbenen gegen die Feder der Maat gewogen, der Göttin der Wahrheit und Ordnung. Federn tragen Vögel durch die Luft, und lange Zeit schrieb man mit Federn seine Gedanken nieder. So verbindet sie Leichtigkeit mit Ausdruck. Wer eine Feder findet, mag darin eine Einladung sehen, etwas leichter zu nehmen.',
    light: 'Die Feder lädt dich ein, etwas leichter zu nehmen und deinen Gedanken Raum zu geben.',
    shadow: 'Wann wird Leichtigkeit zur Flucht vor dem, was eigentlich Gewicht hat?',
    reflection: 'Was würdest du aufschreiben, wenn niemand mitliest?',
  },
  wheel: {
    name: 'Rad',
    meaning:
      'Das Rad gilt traditionell als Zeichen für Kreisläufe, Wandel und Bewegung. Es dreht sich, und was eben oben war, wandert nach unten und wieder hinauf. Dabei bleibt seine Mitte ruhig, während der Rand sich bewegt. Viele Kulturen kennen das Rad als Bild für den Lauf der Zeit und der Jahreszeiten. In diesem Deck schwebt ein goldenes Rad mit acht Speichen im violetten Himmel des Glücksrads, und der leere Wagen steht auf seinen Rädern bereit.',
    light: 'Das Rad erinnert dich daran, dass sich auch schwierige Zeiten weiterdrehen.',
    shadow: 'Wo fühlst du dich dem Lauf der Dinge ausgeliefert, obwohl du in der ruhigen Mitte stehen könntest?',
    reflection: 'Welcher Kreislauf wiederholt sich gerade in deinem Leben?',
  },
  pillars: {
    name: 'Säulen',
    meaning:
      'Säulen gelten traditionell als Zeichen für Gleichgewicht, Halt und die Schwelle zwischen zwei Welten. Paarweise rahmen sie Tore und Tempel, und wer zwischen ihnen hindurchgeht, tritt in einen anderen Raum. Oft steht die eine für das Helle, die andere für das Dunkle. In diesem Deck rahmen eine dunkle und eine helle Säule den Vorhang der Hohepriesterin, und auf der Karte der Gerechtigkeit fassen zwei Säulen die Nische ein. Dazwischen liegt der Raum, in dem beide Seiten gelten dürfen.',
    light: 'Die Säulen ermutigen dich, beide Seiten einer Sache stehen zu lassen und dazwischen deinen Weg zu finden.',
    shadow: 'Wann teilst du die Welt so streng in Hell und Dunkel, dass kein Dazwischen mehr bleibt?',
    reflection: 'Zwischen welchen zwei Polen bewegst du dich gerade?',
  },
  scales: {
    name: 'Waage',
    meaning:
      'Die Waage gilt traditionell als Zeichen für Gerechtigkeit, Abwägen und Ausgleich. Sie zeigt nicht, was richtig ist, sondern macht sichtbar, wie die Gewichte verteilt sind. Schon im alten Ägypten und in Griechenland war sie ein Bild für ein faires Urteil. In diesem Deck ist ein aufrechtes Schwert die Achse der goldenen Waage, und beide Schalen hängen auf gleicher Höhe. So verbindet sie Klarheit mit Ausgleich.',
    light: 'Die Waage lädt dich ein, in Ruhe abzuwägen, bevor du dich entscheidest.',
    shadow: 'Wo wägst du so lange ab, dass die Entscheidung nie fällt?',
    reflection: 'Wo ist in deinem Leben gerade etwas aus dem Gleichgewicht geraten?',
  },
  lantern: {
    name: 'Laterne',
    meaning:
      'Die Laterne gilt traditionell als Zeichen für inneres Licht, Suche und Führung. Sie trägt eine kleine Flamme durch die Dunkelheit und bewahrt sie vor dem Wind. Ihr Licht reicht nicht weit, aber es genügt für die nächsten Schritte. In diesem Deck hängt sie am gebogenen Ende des Wanderstabs auf dem verschneiten Gipfel des Eremiten, und in ihrem Glas leuchtet ein kleiner Stern. Wer eine Laterne trägt, sucht nicht das ganze Ziel, sondern den Weg.',
    light: 'Die Laterne ermutigt dich, deinem eigenen Licht zu folgen, Schritt für Schritt.',
    shadow: 'Wann bleibst du mit deinem Licht so allein, dass niemand dich mehr findet?',
    reflection: 'Welcher nächste Schritt ist im Licht deiner Laterne schon zu sehen?',
  },
  lemniscate: {
    name: 'Lemniskate',
    meaning:
      'Die Lemniskate, die liegende Acht, gilt traditionell als Zeichen für Unendlichkeit, Gleichgewicht und ewigen Fluss. Als Zeichen ∞ steht sie in der Mathematik für das Unendliche, und ihre Linie läuft ohne Anfang und Ende in sich zurück. Ihre zwei Schleifen verbinden Gegensätze in einer einzigen Bewegung. In diesem Deck schwebt sie golden über dem Tisch des Magiers und über dem ruhigen Löwen der Kraft. Sie erzählt von Kraft, die sich erneuert, statt sich zu erschöpfen.',
    light: 'Die Lemniskate erinnert dich daran, dass Geben und Empfangen in einem Fluss bleiben dürfen.',
    shadow: 'Wo drehst du dich in Gedanken im Kreis, ohne zur Ruhe zu kommen?',
    reflection: 'Woraus schöpfst du Kraft, die sich immer wieder erneuert?',
  },
  wheat: {
    name: 'Ähre',
    meaning:
      'Die Ähre gilt traditionell als Zeichen für Fülle, Ernte und Dankbarkeit. Aus einem einzigen Korn wächst ein Halm mit vielen neuen Körnern, und so steht sie für das, was aus Geduld und Pflege entsteht. In alten Kulturen war sie den Göttinnen der Fruchtbarkeit und des Ackerbaus zugeordnet, etwa Demeter. In diesem Deck lehnt das goldene Herzschild der Herrscherin in reifem Weizen. Die Ähre erinnert daran, dass jede Ernte ihre Zeit braucht.',
    light: 'Die Ähre lädt dich ein, wahrzunehmen, was du schon geerntet hast, und dafür dankbar zu sein.',
    shadow: 'Wann willst du ernten, bevor das, was du gesät hast, reif werden konnte?',
    reflection: 'Wofür bist du heute dankbar, das langsam gewachsen ist?',
  },
});
