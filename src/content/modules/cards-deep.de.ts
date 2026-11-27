/**
 * Modul cards-deep, Deutsch (V05.1): Kartentiefe mit fünfzehn Texten je Karte.
 * Beschrieben wird das gemalte Deck dieser App (S-34), nicht das klassische Bild.
 * Gruppe 1 (S-29): 0–VII, der Narr und der äußere Weg.
 */
import { deepTable, type DeepCard } from './cards-deep-keys.ts';
import type { TextTable } from './registry.ts';

const cards: Record<string, DeepCard> = {
  'major-00-fool': {
    light:
      'Der Narr bringt die Frische eines Anfangs, der noch nichts beweisen muss. Er traut dem Weg, bevor er ihn kennt, und bleibt offen für das, was ihm unterwegs begegnet. In seinem Licht wird Nichtwissen zu Neugier.',
    shadow:
      'Wo Leichtigkeit nicht mehr hinschaut, wird sie leicht zu Leichtsinn. Und manchmal ist ein Aufbruch auch ein Weg, etwas Unbequemem auszuweichen. Gehst du gerade auf etwas zu oder von etwas weg?',
    keyword:
      'Aufbruch heißt beim Narren nicht Flucht, sondern Bereitschaft: Das Bündel ist gepackt, der Blick geht nach vorn. Es genügt, dass der erste Schritt möglich ist, auch wenn das Ziel noch im Nebel liegt.',
    symbols:
      'Stab und Bündel lehnen abgelegt an einem Felsen, als hätte jemand kurz innegehalten, bevor es weitergeht. Neben der Felskante wächst eine weiße Rose, unten füllt Nebel das Tal, und eine blasse Sonne steigt auf. Der Abgrund ist da, doch das Bild wirkt wie ein tiefer Atemzug vor dem Weg.',
    roles: {
      light: 'Deine Neugier trägt dich, und du darfst anfangen, bevor du alles kannst.',
      shadow: 'Vielleicht übersiehst du, wie nah die Kante ist. Leichtigkeit braucht auch einen Blick auf den Boden.',
      root: 'Ein früherer Anfang klingt nach, einer, bei dem du einfach losgegangen bist. Was du damals gelernt hast, steckt noch in deinem Gepäck.',
      possibility: 'Ein Weg, den du noch nicht planen kannst, könnte sich öffnen. Vielleicht zeigt er sich erst, wenn du einen ersten Schritt wagst.',
      bridge: 'Der Narr verbindet Mut und Unbefangenheit. Du kannst unsicher und bereit zugleich sein.',
    },
    study: [
      'Auf diesem Bild ist niemand zu sehen: Stab und Bündel sind abgelegt, die Kante ist leer. Der Aufbruch hat noch nicht begonnen, oder er macht gerade Pause. Was würdest du an dieser Stelle tun, wenn es dein Gepäck wäre?',
      'Denk an einen Anfang in deinem Leben, für den du nicht bereit warst und den du trotzdem gewagt hast. Was hat dich damals losgehen lassen? Wofür könntest du diesen Mut heute brauchen?',
    ],
    question: 'Welchen Anfang schiebe ich auf, weil ich auf den perfekten Moment warte?',
    reflections: ['Was darf ich heute zum ersten Mal versuchen?', 'Welches Gepäck könnte ich unterwegs ablegen?'],
    ritual: 'Stell dich ans offene Fenster, atme tief ein und sag leise einen Satz, mit dem du heute beginnen möchtest.',
  },
  'major-01-magician': {
    light:
      'Der Magier weiß, dass alles Nötige schon auf dem Tisch liegt. Er bündelt seine Aufmerksamkeit und macht aus einer Idee einen Handgriff. In seinem Licht wird Können sichtbar.',
    shadow:
      'Wer viel kann, kann auch beeindrucken wollen, statt etwas zu bewirken. Dann wird Geschick zur Vorführung und der Wille zum Drang, alles im Griff zu haben. Wofür setzt du dein Können gerade ein, und für wen?',
    keyword:
      'Wille ist beim Magier keine Härte, sondern gerichtete Aufmerksamkeit: ein Ziel, eine Hand, ein Werkzeug. Was er will, beginnt er, statt nur davon zu träumen.',
    symbols:
      'Auf dem rot verhangenen Tisch liegen Kelch, Münze, Schwert und Stab, die überlieferten Zeichen der vier Elemente. In der Mitte steigt ein Lichtstrahl zu einer goldenen liegenden Acht auf, dem Zeichen für das Unendliche. Rosen und Lilien am Tischrand verbinden Leidenschaft und Klarheit.',
    roles: {
      light: 'Dein Geschick trägt dich, auch das, das du selbst kaum bemerkst.',
      shadow: 'Möglicherweise verteilst du deine Kraft auf zu viele Werkzeuge zugleich. Eine Sache ganz zu tun, könnte mehr bewirken.',
      root: 'Eine Fähigkeit, die du früh gelernt hast, ist bis heute lebendig. Sie ist dir vielleicht selbstverständlicher geworden, als sie es verdient.',
      possibility: 'Aus einer Idee, die schon länger in dir liegt, könnte jetzt ein erster Handgriff werden.',
      bridge: 'Zwischen Denken und Tun baut der Magier eine Brücke. Oft fehlt zwischen Plan und Ausführung nur eine klare Entscheidung.',
    },
    study: [
      'Vier Dinge liegen auf dem Tisch: Kelch, Münze, Schwert und Stab. Jedes steht für eine andere Art, in der Welt zu wirken, vom Fühlen bis zum Handeln. Welches davon liegt dir am nächsten, und welches benutzt du selten?',
      'Wähle eine Idee, die du schon länger mit dir trägst. Überlege, welches Werkzeug du bereits hast, um sie zu beginnen, und was der kleinste erste Handgriff wäre. Was hält dich davon ab, ihn heute zu tun?',
    ],
    question: 'Wofür möchte ich mein Können einsetzen, wenn niemand zusieht?',
    reflections: ['Welche Idee wartet darauf, dass ich sie anfange?', 'Worauf richte ich heute meine ganze Aufmerksamkeit?'],
    ritual: 'Räume deinen Tisch bis auf einen einzigen Gegenstand frei, den du heute brauchst, und arbeite eine Weile nur damit.',
  },
  'major-02-high-priestess': {
    light:
      'Die Hohepriesterin kennt die Kraft des Abwartens. Sie hört auf das, was unter den Worten liegt, und lässt eine Ahnung reifen, bevor sie spricht. In ihrem Licht wird Stille zu einer Form von Wissen.',
    shadow:
      'Wer viel ahnt, kann sich auch hinter dem Schweigen verstecken. Dann bleibt etwas ungesagt, das gesagt werden möchte, oder eine Vermutung wird nie geprüft. Was weißt du längst und sprichst es nicht aus?',
    keyword:
      'Intuition ist das Wissen, das schneller ist als die Begründung. Die Hohepriesterin nimmt es ernst und prüft es dennoch in Ruhe.',
    symbols:
      'Eine dunkle und eine helle Säule rahmen einen Vorhang mit gestickten Granatäpfeln, dahinter leuchtet ein großer Mond. Vor ihnen liegt eine leere, halb geöffnete Schriftrolle am stillen Wasser. Das Bild spricht vom Dazwischen: zwischen hell und dunkel, zwischen Gesagtem und Ungesagtem.',
    roles: {
      light: 'Was dich trägt, ist dein feines Gespür für das, was noch keinen Namen hat.',
      shadow: 'Vielleicht hältst du eine Ahnung für Gewissheit, oder du übergehst sie, weil sie leise ist.',
      root: 'Etwas Unausgesprochenes aus früherer Zeit schwingt noch mit. Es wirkt vielleicht gerade deshalb, weil es nie Worte bekam.',
      possibility: 'Wenn du einer leisen Ahnung Raum gibst, könnte sich eine Antwort zeigen, die schon da war.',
      bridge: 'Die Hohepriesterin verbindet Wissen und Nichtwissen. Dazwischen liegt ein ruhiger Raum, in dem du noch nicht entscheiden musst.',
    },
    study: [
      'Vorn im Bild liegt eine Schriftrolle, leer und nur halb geöffnet. Manches Wissen ist noch nicht aufgeschrieben, vielleicht nicht einmal gedacht. Was würdest du auf diese Rolle schreiben, wenn sie dir gehörte?',
      'Erinnere dich an eine Ahnung, die sich später als stimmig erwiesen hat. Wie hat sie sich damals angefühlt, im Körper und in den Gedanken? Woran erkennst du eine solche Ahnung, wenn sie wiederkommt?',
    ],
    question: 'Welcher leisen Stimme in mir gebe ich zu selten Raum?',
    reflections: ['Was spüre ich, bevor ich es begründen kann?', 'Wo dürfte ich heute weniger reden und mehr hören?'],
    ritual: 'Setz dich an ein Fenster, schau eine Minute in den Himmel und schreib danach ein einziges Wort auf, das dir dabei kam.',
  },
  'major-03-empress': {
    light:
      'Die Herrscherin lässt wachsen, statt zu drängen. Sie kennt den Wert von Pflege, Wärme und Zeit, für andere und für sich selbst. In ihrem Licht wird Fürsorge zu Fülle.',
    shadow:
      'Fürsorge kann zu viel werden, wenn sie nichts mehr loslassen kann oder sich selbst vergisst. Dann wird aus Pflege Überfürsorge oder Erschöpfung. Wen umsorgst du gerade, und wer sorgt für dich?',
    keyword:
      'Schöpfung meint bei der Herrscherin das Hervorbringen im weitesten Sinn: ein Garten, eine Beziehung, ein Werk, ein Zuhause. Sie erschafft nicht aus dem Nichts, sondern aus Pflege und Geduld.',
    symbols:
      'Ein goldenes Schild in Herzform lehnt in reifem Weizen, darüber schwebt ein Kranz aus zwölf Sternen. Grüne Hügel, Zypressen und ein kleiner Wasserfall zeigen eine Landschaft, in der alles gedeiht. Das Herz steht dort, wo geerntet wird: Fülle wächst aus dem, was man liebt.',
    roles: {
      light: 'Was du gepflegt hast, trägt dich jetzt, auch wenn es still gewachsen ist.',
      shadow: 'Leicht gerät aus dem Blick, was du selbst brauchst, während du für alles andere sorgst.',
      root: 'Eine Erfahrung von Geborgenheit, oder ihr Fehlen, prägt dich bis heute. Sie zeigt sich darin, wie du für dich und andere sorgst.',
      possibility: 'Etwas, das du geduldig nährst, könnte reifen und Früchte tragen.',
      bridge: 'Geben und Empfangen gehören bei der Herrscherin zusammen. Wer für andere sorgt, darf auch selbst versorgt werden.',
    },
    study: [
      'Das Herz im Weizen ist kein zartes Herz, sondern ein Schild aus Gold. Fürsorge kann schützen und stark sein. Wo in deinem Leben braucht etwas Zartes einen solchen Schutz?',
      'Denk an etwas, das in deinem Leben gerade wächst: ein Vorhaben, eine Beziehung, eine Fähigkeit. Was braucht es von dir, um gut weiterzuwachsen, Zeit, Ruhe oder Aufmerksamkeit? Welche kleine Pflege könntest du ihm diese Woche schenken?',
    ],
    question: 'Wie würde ich mich selbst versorgen, wenn ich mein eigener Garten wäre?',
    reflections: ['Wofür bin ich heute dankbar, das still gewachsen ist?', 'Wo darf ich mir mehr Zeit lassen, damit etwas reifen kann?'],
    ritual: 'Gieß eine Pflanze oder trink langsam ein Glas Wasser und denk dabei an etwas, das du wachsen lassen möchtest.',
  },
  'major-04-emperor': {
    light:
      'Der Herrscher gibt Halt. Er schafft Ordnung, übernimmt Verantwortung und steht zu dem, was er zusagt. In seinem Licht wird ein klarer Rahmen zu einem Ort, an dem man sich sicher bewegen kann.',
    shadow:
      'Wo Ordnung keinen Raum mehr lässt, wird Struktur zur Mauer. Dann geht es um Kontrolle statt um Halt, für andere oder für dich selbst. Welche Regel hältst du fest, obwohl sie dir nicht mehr dient?',
    keyword:
      'Struktur ist für den Herrscher das Gerüst, an dem etwas wachsen kann: Absprachen, Gewohnheiten, Grenzen. Sie ist kein Selbstzweck, sondern trägt, damit anderes frei sein kann.',
    symbols:
      'Ein leerer Thron aus dunklem Basalt steht auf breiten Stufen, seine Armlehnen enden in steinernen Widderköpfen. Auf dem Sitz liegen Reichsapfel und Zepter, dahinter glühen rote Berge in der Dämmerung. Niemand sitzt auf dem Thron: Die Verantwortung wartet darauf, übernommen zu werden.',
    roles: {
      light: 'Deine Verlässlichkeit gibt dir Halt, für andere und für dich selbst.',
      shadow: 'Vielleicht hältst du an einem Plan fest, der nicht mehr zu dem passt, was gerade ist.',
      root: 'Regeln und Erwartungen aus deiner Herkunft sind noch spürbar. Manche geben dir Halt, andere sind dir vielleicht zu eng geworden.',
      possibility: 'Ein klarer Rahmen könnte dir Freiheit schenken, statt sie zu nehmen.',
      bridge: 'Der Herrscher verbindet Halt und Verantwortung. Wer für Ordnung sorgt, kann anderen Raum geben.',
    },
    study: [
      'Der Thron ist leer, Zepter und Reichsapfel liegen bereit. Macht ist hier kein Besitz, sondern eine Aufgabe, die jemand übernehmen kann. Für welchen Bereich deines Lebens würdest du dich auf diesen Thron setzen?',
      'Wähle einen Bereich deines Alltags, in dem es gerade unübersichtlich ist. Welche eine Regel, Absprache oder feste Zeit könnte dort Halt geben? Wie fühlt sich der Gedanke an, sie eine Woche lang auszuprobieren?',
    ],
    question: 'Wofür bin ich bereit, Verantwortung zu übernehmen, und wofür nicht mehr?',
    reflections: ['Welche Ordnung würde mir heute das Leben leichter machen?', 'Wo halte ich zu fest, und wo zu locker?'],
    ritual: 'Schreib drei Dinge auf, die du heute verlässlich erledigen willst, und streiche jedes durch, sobald es getan ist.',
  },
  'major-05-hierophant': {
    light:
      'Der Hierophant bewahrt, was sich bewährt hat, und gibt es weiter. Er weiß, dass niemand alles allein herausfinden muss. In seinem Licht wird Lernen zu einer Verbindung zwischen Menschen und Zeiten.',
    shadow:
      'Überliefertes kann zur Gewohnheit werden, die keiner mehr prüft. Dann folgt man Regeln, weil es sie gibt, oder wartet auf die Erlaubnis anderer. Wessen Zustimmung brauchst du, bevor du deinem eigenen Urteil traust?',
    keyword:
      'Tradition bedeutet hier weitergegebene Erfahrung: Wissen, das viele vor dir gesammelt haben. Sie wird lebendig, wenn du sie verstehst und auf deine Weise weiterführst.',
    symbols:
      'In einer hohen, stillen Halle steht ein goldener Stab mit drei Ringen, auf dem Schachbrettboden davor kreuzen sich zwei große Schlüssel. Bücher am Rand erinnern an gesammeltes Wissen. Die Schlüssel liegen offen da: Wissen will geteilt werden und öffnet Türen.',
    roles: {
      light: 'Dich trägt, was andere vor dir gelernt und an dich weitergegeben haben.',
      shadow: 'Unbemerkt folgst du vielleicht einer Regel, die nie wirklich deine eigene war.',
      root: 'Werte aus deiner Familie oder deiner Schulzeit leben in dir weiter. Manche trägst du gern, andere nur aus Gewohnheit.',
      possibility: 'Ein Gespräch mit jemandem, der den Weg kennt, könnte dir eine Tür öffnen.',
      bridge: 'Überliefertes und Eigenes finden beim Hierophanten zusammen. Du kannst lernen, ohne dich selbst aufzugeben.',
    },
    study: [
      'Zwei Schlüssel liegen gekreuzt auf dem Boden der Halle. Einer könnte für das stehen, was dir überliefert wurde, der andere für das, was du selbst herausgefunden hast. Welche Tür würdest du mit beiden zusammen öffnen?',
      'Denk an einen Menschen, von dem du etwas Wichtiges gelernt hast. Was hat dieser Mensch dir mitgegeben, das du bis heute nutzt? Wem könntest du etwas davon weitergeben?',
    ],
    question: 'Welche Überlieferung möchte ich bewahren, und welche darf mit mir enden?',
    reflections: ['Wen könnte ich heute um Rat fragen?', 'Welcher meiner Werte zeigt sich in dem, was ich heute tue?'],
    ritual: 'Lies einen Absatz aus einem Buch, das dir viel bedeutet, und schreib einen Satz daraus ab, den du heute mitnehmen willst.',
  },
  'major-06-lovers': {
    light:
      'Die Liebenden stehen für Verbindungen, die aus freier Wahl entstehen. Sie zeigen, wie zwei Verschiedene sich einander zuneigen, ohne sich aufzugeben. In ihrem Licht wird eine Entscheidung zum Ausdruck dessen, was dir wirklich wichtig ist.',
    shadow:
      'Wer sich nach Nähe sehnt, entscheidet manchmal gegen sich selbst. Dann wird aus Verbindung Anpassung, oder aus einer Wahl ein Aufschieben. Wo entscheidest du eher, um gemocht zu werden, als nach deinem Herzen?',
    keyword:
      'Verbindung entsteht bei den Liebenden dort, wo zwei Eigenständige sich frei aufeinander zubewegen. Gemeint ist Liebe ebenso wie Freundschaft und der Einklang mit den eigenen Werten.',
    symbols:
      'Zwei ganz verschiedene Bäume wachsen auf einem Hügel, einer mit flammend orangem Laub, einer voller roter Äpfel. Ihre Kronen neigen sich zueinander und geben den Blick auf einen Berggipfel frei, über dem eine goldene Sonne mit Flügeln steht. Verschieden zu bleiben und sich doch zu begegnen, ist die Kunst dieses Bildes.',
    roles: {
      light: 'Eine Verbindung, in der du so sein darfst, wie du bist, gibt dir Kraft.',
      shadow: 'Vielleicht übersiehst du, wo du dich anpasst, nur um Nähe nicht zu gefährden.',
      root: 'Eine frühere Entscheidung des Herzens hat Spuren hinterlassen. Sie hat mitgeprägt, was dir heute in Beziehungen wichtig ist.',
      possibility: 'Eine Wahl, die Herz und Verstand gleichermaßen tragen, könnte dir neue Klarheit schenken.',
      bridge: 'Die Liebenden verbinden zwei Verschiedene, ohne sie gleich zu machen. Dasselbe gilt für widersprüchliche Wünsche in dir.',
    },
    study: [
      'Zwei Bäume, verschieden in Laub und Frucht, wachsen aus demselben Hügel. Zwischen ihren Kronen öffnet sich ein Blick, den keiner allein freigeben könnte. Welche Verbindung in deinem Leben öffnet dir einen solchen Blick?',
      'Denk an eine Entscheidung, die gerade ansteht, groß oder klein. Schreib auf, was dein Verstand dazu sagt und was dein Herz dazu sagt. Wo stimmen beide überein, und wo nicht?',
    ],
    question: 'Welche Verbindung in meinem Leben möchte ich bewusster wählen?',
    reflections: ['Wem möchte ich heute mit offenem Herzen begegnen?', 'Was sagen meine Werte zu der Wahl, die vor mir liegt?'],
    ritual: 'Schreib einem Menschen, der dir wichtig ist, einen kurzen Gruß ohne besonderen Anlass.',
  },
  'major-07-chariot': {
    light:
      'Der Wagen bringt Bewegung mit Richtung. Er vereint widerstreitende Kräfte, ohne eine davon zu unterdrücken, und hält seinen Kurs. In seinem Licht wird Entschlossenheit zu ruhiger Führung.',
    shadow:
      'Wer unbedingt ankommen will, übersieht leicht, was am Weg liegt. Dann wird aus Richtung Verbissenheit, und alles, was bremst, erscheint als Gegner. Welchen Kurs hältst du nur noch aus Gewohnheit?',
    keyword:
      'Richtung ist für den Wagen mehr als ein Ziel: Sie ist die Entscheidung, wohin die eigene Kraft fließen soll. Wer eine Richtung hat, kann auch Umwege gehen, ohne sich zu verlieren.',
    symbols:
      'Ein leerer, prachtvoller Wagen steht vor einer ummauerten Stadt im Mondlicht, über dem Sitz ein nachtblauer Baldachin mit goldenen Sternen. Vor den Rädern liegen zwei Kugeln, eine dunkle und eine helle. Es gibt keine Zugtiere: Was diesen Wagen bewegt, ist die Entscheidung, ihn zu lenken.',
    roles: {
      light: 'Wenn du weißt, wohin du willst, trägt dich deine Entschlossenheit.',
      shadow: 'Womöglich ziehen zwei Wünsche in verschiedene Richtungen, und du hörst nur den lauteren.',
      root: 'Ein Ziel, das du früher mit viel Kraft verfolgt hast, wirkt noch nach. Es hat dir gezeigt, was dich antreibt.',
      possibility: 'Sobald du dich für eine Richtung entscheidest, könnte vieles leichter in Bewegung kommen.',
      bridge: 'Im Wagen werden Gegensätze in dieselbe Richtung gelenkt. Beide Kräfte dürfen bleiben.',
    },
    study: [
      'Vor den Rädern des Wagens liegen zwei Kugeln, eine dunkle und eine helle. Sie ruhen, und doch braucht der Wagen beide Seiten, um im Gleichgewicht zu fahren. Welche zwei Seiten in dir möchten gerade in verschiedene Richtungen?',
      'Schreib ein Ziel für die nächsten Wochen in einem Satz auf. Notiere darunter, was dich dorthin zieht und was dich bremst. Was könnte beides gemeinsam in eine Richtung lenken?',
    ],
    question: 'Wohin möchte ich meine Kraft lenken, wenn ich ehrlich zu mir bin?',
    reflections: ['Welche Richtung fühlt sich heute stimmig an?', 'Was bremst mich, und was davon darf ich ernst nehmen?'],
    ritual: 'Geh ein paar Minuten zügig und mit klarem Ziel, etwa bis zur nächsten Ecke, und spüre, wie sich eine gewählte Richtung anfühlt.',
  },
  // Gruppe 2 (S-29): VIII–XIV, der innere Weg.
  'major-08-strength': {
    light:
      'Die Kraft zeigt eine Stärke, die nicht laut sein muss. Sie zähmt nicht mit Gewalt, sondern mit Geduld und Zuwendung, auch das Wilde in einem selbst. In ihrem Licht wird Sanftheit zu Standhaftigkeit.',
    shadow:
      'Wer immer sanft bleiben will, schluckt manchmal, was gesagt werden müsste. Dann wird aus Geduld Duldung, und die eigene Kraft richtet sich nach innen. Wo hältst du dich zurück, obwohl dir ein klares Wort zustünde?',
    keyword: 'Sanftheit ist hier keine Schwäche, sondern Kraft, die sich nicht beweisen muss. Sie hält das Wilde, statt es zu bekämpfen.',
    symbols:
      'Ein ruhiger Löwe liegt mit gekreuzten Pranken im Morgenlicht, neben ihm wächst eine Blume aus einem gesprungenen Stein, umgeben von einem schwebenden Blütenkranz. Darüber schwebt eine goldene liegende Acht. Das Starke und das Zarte teilen dasselbe Licht, keines bedroht das andere.',
    roles: {
      light: 'Geduld mit dir selbst gibt dir mehr Kraft, als Druck es könnte.',
      shadow: 'Gut möglich, dass du deine Stärke unterschätzt, weil sie leise ist.',
      root: 'Etwas Schweres, das du früher getragen hast, steckt noch als Kraft in dir. Vielleicht ist sie größer, als du ihr zutraust.',
      possibility: 'Wenn du dem Schwierigen freundlich begegnest, könnte es seine Wucht verlieren.',
      bridge: 'Die Kraft verbindet Mut und Zärtlichkeit. Beides darf in derselben Hand liegen.',
    },
    study: [
      'Ein Löwe ruht neben einer Blume, die aus einem gesprungenen Stein wächst. Keiner der beiden weicht dem anderen aus. Was in diesem Bild ist für dich das Starke, und was das Zarte?',
      'Erinnere dich an eine Situation, in der du ruhig geblieben bist, obwohl es in dir getobt hat. Was hat dir damals geholfen, freundlich mit dir zu bleiben? Wo könntest du diese Ruhe gerade gebrauchen?',
    ],
    question: 'Welches Wilde in mir möchte gehalten werden, nicht bekämpft?',
    reflections: ['Wie kann ich heute freundlich und klar zugleich sein?', 'Wem gegenüber darf ich heute geduldiger sein, mir selbst eingeschlossen?'],
    ritual: 'Leg eine Hand auf deinen Bauch, spüre drei Atemzüge lang, wie er sich hebt und senkt, und lass die Schultern sinken.',
  },
  'major-09-hermit': {
    light:
      'Der Eremit sucht die Stille nicht, um zu fliehen, sondern um zu finden. Er trägt sein eigenes Licht und braucht keinen Beifall, um seinem Weg zu trauen. In seinem Licht wird Alleinsein zu Sammlung.',
    shadow:
      'Rückzug kann auch Schutz vor einer Nähe sein, die gerade unbequem ist. Dann wird aus Einkehr Abschottung, und die Antwort bleibt oben auf dem Berg. Mit wem würdest du gern teilen, was du im Stillen gefunden hast?',
    keyword:
      'Rückzug heißt beim Eremiten, für eine Weile den Lärm zu verlassen, um die eigene Stimme wieder zu hören. Er ist ein Weg nach innen, kein Abschied von der Welt.',
    symbols:
      'Auf einem verschneiten Gipfel in tiefer Nacht steht ein Wanderstab, an seinem gebogenen Ende hängt eine Laterne. In ihrem Glas leuchtet ein kleiner Stern, der den Schnee ringsum warm färbt. Das Licht reicht nicht weit, aber genau so weit, wie der nächste Schritt es braucht.',
    roles: {
      light: 'Deine Fähigkeit, allein zu sein, ohne dich einsam zu fühlen, ist eine stille Stütze.',
      shadow: 'Unter Umständen ziehst du dich zurück, wo ein Gespräch dir mehr helfen würde.',
      root: 'Vielleicht hat dir eine frühere Zeit des Alleinseins gezeigt, was dir wichtig ist. Diese Klarheit kannst du wieder aufsuchen.',
      possibility: 'In einer stillen Stunde könnte eine Antwort auftauchen, die im Trubel keinen Platz hatte.',
      bridge: 'Der Eremit verbindet Rückzug und Rückkehr. Was du im Stillen findest, darf wieder unter Menschen.',
    },
    study: [
      'Die Laterne hängt am Stab, niemand hält ihn, und sie leuchtet trotzdem. Ihr Licht reicht nur ein Stück in die Nacht. Welcher Schritt in deinem Leben braucht gerade nicht mehr Licht als dieses?',
      'Nimm dir fünf Minuten ohne Bildschirm und ohne Gespräch. Achte darauf, welcher Gedanke immer wiederkommt, wenn es still wird. Was möchte er dir sagen?',
    ],
    question: 'Was weiß ich nur, wenn ich ganz bei mir bin?',
    reflections: ['Wann war ich heute ganz bei mir?', 'Welches Licht trage ich, das anderen den Weg zeigen könnte?'],
    ritual: 'Schalte am Abend für ein paar Minuten alle Lampen bis auf eine aus und sitz still in ihrem Licht.',
  },
  'major-10-wheel': {
    light:
      'Das Glücksrad erinnert daran, dass nichts stillsteht. Was oben ist, dreht sich weiter, und was unten war, kommt wieder ins Licht. In seinem Licht wird Wandel zu einer Bewegung, der man vertrauen kann.',
    shadow:
      'Wer nur auf das Rad schaut, kann vergessen, was in der eigenen Hand liegt. Dann wird Wandel zur Ausrede, nichts zu tun, oder zur Angst vor jeder Drehung. Was hängt in dieser Lage wirklich von dir ab?',
    keyword:
      'Wandel ist beim Glücksrad der Normalfall, nicht die Ausnahme: Zeiten wechseln, wie ein Rad sich dreht. Wer das annimmt, kann in schweren Phasen hoffen und in leichten dankbar sein.',
    symbols:
      'Ein goldenes Rad mit acht Speichen schwebt in einem violetten Himmel, sein Rand ist mit kleinen Sonnen, Monden und Sternen verziert. Unter ihm liegt eine weite Landschaft, um es herum ziehen leichte Wolken. Das Rad hat keinen Anfang und kein Ende, nur eine Mitte, die ruhig bleibt, während der Rand sich dreht.',
    roles: {
      light: 'Dich stützt das Wissen, dass sich Dinge wenden können, auch zum Guten.',
      shadow: 'Unbewusst wartest du vielleicht auf eine Wende, statt selbst einen Schritt zu tun.',
      root: 'Ein wiederkehrendes Muster aus früheren Jahren dreht sich noch mit. Es zu erkennen, ist der erste Schritt, anders zu antworten.',
      possibility: 'Eine Wendung könnte sich zeigen, wenn du beweglich bleibst und hinschaust.',
      bridge: 'Das Glücksrad verbindet Oben und Unten zu einem Kreis. Beides gehört zum selben Weg.',
    },
    study: [
      'Acht Speichen führen vom Rand zur Mitte des Rades. Der Rand dreht sich, die Nabe bleibt an ihrem Platz. Was ist in deinem Leben gerade der bewegte Rand, und was die ruhige Mitte?',
      'Leg zwei Zeitabschnitte deines Lebens nebeneinander: eine schwere Phase, die sich gewendet hat, und eine leichte, die vorüberging. Was haben dir beide über Wandel beigebracht? Welche Haltung möchtest du in die nächste Drehung mitnehmen?',
    ],
    question: 'Welchen Kreis möchte ich in meinem Leben nicht noch einmal drehen?',
    reflections: ['Was darf sich heute verändern, ohne dass ich es festhalte?', 'Was bleibt in mir ruhig, während sich außen viel bewegt?'],
    ritual: 'Zeichne einen Kreis auf ein Blatt, schreib an den Rand, was sich gerade bewegt, und in die Mitte, was gleich bleibt.',
  },
  'major-11-justice': {
    light:
      'Die Gerechtigkeit sieht genau hin und wägt ab, bevor sie urteilt. Sie verlangt Ehrlichkeit nach außen und nach innen und steht zu den Folgen des eigenen Handelns. In ihrem Licht wird Klarheit zu Frieden mit der eigenen Entscheidung.',
    shadow:
      'Wer ganz gerecht sein will, wird manchmal hart, mit anderen oder mit sich. Dann wiegt jeder Fehler zu schwer, und Milde scheint verboten. Wo urteilst du strenger, als es der Sache dient?',
    keyword:
      'Klarheit bedeutet bei der Gerechtigkeit, die Dinge so zu sehen, wie sie sind, nicht wie man sie gern hätte. Erst dann lässt sich fair abwägen.',
    symbols:
      'Ein aufrechtes Schwert ist die Achse einer goldenen Waage, beide Schalen hängen auf gleicher Höhe. Dahinter fällt ein tiefroter Vorhang, zwei Säulen und flache Stufen rahmen die Nische. Das Schwert trennt, die Waage gleicht aus: Klarheit und Ausgleich gehören zusammen.',
    roles: {
      light: 'Deine Ehrlichkeit mit dir selbst ist ein fester Boden.',
      shadow: 'Leicht kann ein Urteil über dich oder andere den Blick auf die ganze Lage verstellen.',
      root: 'Eine frühere Entscheidung und ihre Folgen sind noch spürbar. Sie lädt dich ein, Verantwortung zu übernehmen, ohne dich zu verurteilen.',
      possibility: 'Ein ehrliches Gespräch könnte etwas ins Gleichgewicht bringen, das lange schief hing.',
      bridge: 'Die Gerechtigkeit verbindet Strenge und Fairness. Wer klar sieht, kann auch milde urteilen.',
    },
    study: [
      'Das Schwert steht senkrecht, die beiden Schalen der Waage hängen genau auf einer Höhe. Nichts wiegt hier schwerer als das andere. Was würdest du in die eine Schale legen, und was in die andere?',
      'Wähle eine Entscheidung, die du vor dir herschiebst. Schreib ehrlich auf, was für jede Möglichkeit spricht, auch das, was du ungern zugibst. Was zeigt sich, wenn beides auf dem Papier steht?',
    ],
    question: 'Wo bin ich mir selbst gegenüber ungerecht, ohne es zu merken?',
    reflections: ['Was wäre heute ehrlich, auch wenn es unbequem ist?', 'Wem schulde ich noch ein klärendes Wort?'],
    ritual: 'Schreib einen Satz auf, in dem du dir selbst etwas verzeihst, und lies ihn einmal laut.',
  },
  'major-12-hanged-man': {
    light:
      'Der Gehängte lässt los, wo Kämpfen nichts mehr bringt. Er hält inne, sieht die Dinge von der anderen Seite und findet darin eine neue Ordnung. In seinem Licht wird eine Pause zu einer Einsicht.',
    shadow:
      'Abwarten kann zu einer Haltung werden, hinter der man sich versteckt. Dann bleibt etwas in der Schwebe, obwohl längst ein Schritt möglich wäre. Wartest du gerade, weil die Zeit es braucht, oder weil du es brauchst?',
    keyword:
      'Innehalten ist beim Gehängten keine Untätigkeit, sondern bewusstes Anhalten, damit sich etwas zeigen kann. Wer stillhält, sieht oft, was im Laufen verborgen bleibt.',
    symbols:
      'Ein lebendiger Baum wächst am Ufer eines stillen Sees, sein Stamm teilt sich oben in zwei weit ausladende Äste. Hinter der Gabelung leuchtet ein heller Schein am Abendhimmel und spiegelt sich im Wasser. Nichts hängt hier, nichts ist gefesselt: Das Bild zeigt eine Pause, in der sich der Blick weitet.',
    roles: {
      light: 'Dich trägt die Bereitschaft, eine Lage auch von der anderen Seite zu sehen.',
      shadow: 'Es kann sein, dass du an einer Sichtweise festhältst, weil ein Wechsel unbequem wäre.',
      root: 'Eine Zeit, in der du warten musstest, ist noch in dir. Vielleicht hat sie dich gelehrt, was sich nicht erzwingen lässt.',
      possibility: 'Wenn du aufhörst zu ziehen, könnte sich etwas von selbst lösen.',
      bridge: 'Der Gehängte verbindet Hingabe und Einsicht. Im Loslassen kann sich ein neuer Blick öffnen.',
    },
    study: [
      'Der Baum steht still am Wasser, hinter seiner Gabelung leuchtet ein Schein, der sich im See spiegelt. Im Spiegel steht alles kopfüber und ist doch dasselbe Bild. Welche Lage in deinem Leben würde sich verändern, wenn du sie einmal umgekehrt betrachtest?',
      'Nimm eine Frage, die dich gerade beschäftigt, und schreib sie so auf, wie ein wohlwollender Mensch sie dir stellen würde. Was verändert sich, wenn du sie so liest? Welche Antwort hattest du bisher übersehen?',
    ],
    question: 'Was in meinem Leben möchte ich nicht länger erzwingen?',
    reflections: ['Wo könnte mir eine Pause heute mehr zeigen als Eile?', 'Wie sähe mein Tag aus, wenn ich ihn von seinem Ende her betrachte?'],
    ritual: 'Stell für eine Minute alles ab, was dich antreibt, und schau nur zu, wie sich draußen etwas bewegt: Blätter, Wolken, Menschen.',
  },
  'major-13-death': {
    light:
      'Die Karte Tod steht für Abschiede, die Raum schaffen. Sie erlaubt, etwas zu beenden, das seine Zeit gehabt hat, und vertraut darauf, dass danach etwas wachsen kann. In ihrem Licht wird Loslassen zu einem Akt der Fürsorge.',
    shadow:
      'Abschiede können zu schnell kommen, wenn sie nur der Unruhe folgen. Oder sie werden so lange vermieden, dass das Alte alle Kraft bindet. Was beendest du zu früh, und was zu spät?',
    keyword: 'Abschied heißt bei dieser Karte, ein Kapitel bewusst zu schließen, statt es offen ausfransen zu lassen. Er schmerzt und befreit zugleich.',
    symbols:
      'Im Vordergrund blüht eine weiße Rose, dahinter liegt ein nachtdunkles Tal. Ein Fluss zieht eine schmale Linie aus Licht zu einer aufgehenden Sonne zwischen zwei Türmen. Das Bild ist still und dunkel, doch der Weg des Wassers führt zum Morgen.',
    roles: {
      light: 'Halt gibt dir deine Fähigkeit, Abschied zu nehmen, wenn etwas vorbei ist.',
      shadow: 'Vielleicht bindet etwas Vergangenes mehr Kraft, als du dir eingestehst.',
      root: 'Ein früherer Abschied ist noch nicht ganz zu Ende erzählt. Er darf betrauert und gewürdigt werden.',
      possibility: 'Wo etwas endet, könnte Raum für etwas entstehen, das du dir noch nicht vorstellen kannst.',
      bridge: 'Die Karte Tod verbindet Ende und Anfang. Zwischen beiden liegt ein stiller Übergang.',
    },
    study: [
      'Eine weiße Rose blüht hell vor dem dunklen Tal, und hinten, am Ende des Flusses, geht die Sonne auf. Ein Abschied und ein Anfang stehen im selben Bild. Was davon zieht deinen Blick zuerst an?',
      'Schreib auf, was in deinem Leben zu Ende gegangen ist oder zu Ende gehen möchte. Notiere daneben, wofür du ihm dankbar bist. Was könnte in dem Raum wachsen, der dadurch frei wird?',
    ],
    question: 'Welchen Abschied habe ich noch nicht gewürdigt?',
    reflections: ['Was darf heute zu Ende gehen?', 'Welche Erinnerung möchte ich behalten, wenn ich das Alte loslasse?'],
    ritual: 'Räume eine Sache weg, die du nicht mehr brauchst, und sag ihr innerlich danke, bevor du sie weglegst.',
  },
  'major-14-temperance': {
    light:
      'Die Mäßigkeit findet das rechte Maß zwischen zu viel und zu wenig. Sie mischt, was getrennt scheint, mit Geduld und ruhiger Hand. In ihrem Licht wird Ausgleich zu einer Kunst, die man üben kann.',
    shadow:
      'Wer immer ausgleichen will, kann die eigene Haltung verlieren. Dann wird aus der Mitte ein Kompromiss, der niemandem gerecht wird, am wenigsten dir. Wo verdünnst du, was eigentlich klar sein dürfte?',
    keyword: 'Maß meint bei der Mäßigkeit nicht Verzicht, sondern die Mischung, die gerade guttut. Es wird nicht einmal gefunden, sondern immer wieder neu abgestimmt.',
    symbols:
      'Zwei goldene Kelche, einer über dem anderen, sind durch einen klaren Bogen aus Wasser verbunden. Neben dem Teich blühen Iris, ein Pfad führt durch grüne Wiesen zu fernen Bergen im Morgenlicht. Nichts geht beim Umgießen verloren: Das Wasser fließt ruhig von einer Form in die andere.',
    roles: {
      light: 'Dein Sinn für das rechte Maß hilft dir, auch in vollen Zeiten im Gleichgewicht zu bleiben.',
      shadow: 'Möglicherweise suchst du einen Mittelweg, wo eine klare Entscheidung leichter wäre.',
      root: 'Eine Zeit, in der du zu viel oder zu wenig hattest, prägt noch dein Gespür für Maß.',
      possibility: 'Aus zwei Dingen, die nicht zusammenzupassen scheinen, könnte etwas Neues entstehen.',
      bridge: 'Die Mäßigkeit verbindet Gegensätze, indem sie sie geduldig mischt. Keines muss verschwinden.',
    },
    study: [
      'Ein Kelch gießt Wasser in einen zweiten, ohne dass eine Hand ihn hält. Der Bogen des Wassers ist ruhig und ununterbrochen. Was in deinem Leben möchte gerade ebenso langsam und stetig von einem Zustand in einen anderen fließen?',
      'Schau auf eine gewöhnliche Woche deines Lebens: Arbeit, Ruhe, Menschen, Zeit für dich. Wo ist zu viel, wo zu wenig? Welche kleine Verschiebung würde die Mischung stimmiger machen?',
    ],
    question: 'Welche zwei Seiten in mir möchten miteinander wirken statt gegeneinander?',
    reflections: ['Wovon nehme ich heute ein wenig weniger, und wovon ein wenig mehr?', 'Was bringt mich zurück in meine Mitte?'],
    ritual: 'Mach heute eine Sache bewusst halb so schnell wie sonst, etwa das Anziehen oder den Abwasch, und spüre, wie sich das Tempo anfühlt.',
  },
};

export const texts: TextTable = deepTable(cards);
