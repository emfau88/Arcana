# PROGRESSION_DESIGN · Reise, Meilensteine, Vertiefung

**Stand:** 26.11.2026 · ersetzt das „Progressionskonzept“ in `docs/visual/VISUAL_ROADMAP.md` (Analyse aus V01) als verbindliche Spezifikation. Grundlage: Entscheidung E6 (wachsende Reise ohne Verlust) und Leitplanken L2/L3 in `PRODUCT_VISION_V2.md`.

## 1 · Drei Achsen, klar getrennt

| Achse | Was wächst | Wodurch | Was es öffnet |
|---|---|---|---|
| **Reise** (Zeit) | Reisetag, Station, Runde | **nur** Tage mit Nutzung | Meilensteine: Archetyp-Kapitel, Rückblicke, Symbole, gestalterische Freischaltungen |
| **Vertiefung** (Tätigkeit) | Stufe je Karte (1–4), Kapitel je Archetyp gelesen, Zahlenprofil vollständig | Begegnungen **oder** freiwillige Tätigkeit (Studium, Reflexion) | Texte und Ansichten der jeweiligen Karte bzw. Welt |
| **Sammlung** (Entdeckung) | Karten, Symbole, Engelszahlen, Rituale im Grimoire | jede Nutzung | Grimoire-Seiten, „x von y“ |

**Warum getrennt:** Würden Tätigkeiten die Reise beschleunigen, entstünde Grinding („10 Reflexionen für den nächsten Meilenstein“). Würde Zeit die Vertiefung öffnen, wäre Tiefe Warten. So gilt: **Die Reise belohnt Wiederkommen, die Vertiefung belohnt Beschäftigung. Beides ohne Druck.**

## 2 · Die Reise

### 2.1 Reisetag

`journeyDays` = Anzahl verschiedener lokaler Kalendertage (`dateKey`), an denen mindestens eine **zählende Handlung** stattfand:

| zählt | zählt nicht |
|---|---|
| Tageskarte enthüllt | App nur geöffnet |
| Legung gespeichert | ungespeicherte Legung |
| Kartenstudium abgeschlossen (ab 1.0) | Einstellungen ändern |
| Tagebucheintrag geschrieben (ab 1.0) | Teilen (ohne Tracking nicht erfassbar, gewollt) |
| Engelszahl-Begegnung festgehalten (ab 1.0) | Lexikon nur lesen |
| Mond-Intention oder -Reflexion (ab 1.1) | |

Der Wert **sinkt nie**: Er wird aus gespeicherten Fakten abgeleitet, und Fakten werden nur durch „Alle Daten löschen“ entfernt. Pausen ändern nichts. Eine geänderte Gerätezeit kann keinen Tag „abziehen“. Ein Tag in der Zukunft (Uhr falsch) zählt einmal, wie jeder andere Tag.

### 2.2 Narrenreise: Wege, Stationen, Runden

Vorhanden seit V02 (`journeyPosition`): 21 Stationen je Runde in drei Wegen zu sieben Stationen (äußerer, innerer, höherer Weg). **Station n entspricht Karte n (I–XXI)**, der Reisende ist der Narr (0).

| Element | Inhalt | Menge |
|---|---|---|
| Stationstext | 2–3 Sätze: der Narr begegnet der Karte. Lesart je Runde: **Runde 1** „Begegnung“, **Runde 2** „Wiederkehr“, **Runde 3+** „Weisheit“ | 21 × 3 = 63 je Sprache |
| Wegeinführung | beim Betreten eines Weges (Station 1, 8, 15) | 3 × 3 Runden = 9 |
| Rundenabschluss | Sternbild der Runde wird gezeichnet + kurzer Abschlusstext | 1 je Runde (Runden 1–3 eigene Texte, danach Variante) |

Ab Runde 4 wiederholen sich die Lesarten von Runde 3. Bis dahin (Reisetag 63+) tragen Rückblicke, Vertiefungen und andere Welten die Abwechslung.

### 2.3 Sternkarte

Kapitel VII „Reise“ im Grimoire: eine dunkle Himmelskarte (Hintergrund A19), darauf je Runde ein Sternbild aus 21 Sternen (SVG). Jeder Stern ist ein Reisetag. Meilensteine leuchten heller und tragen Datum und Titel. Tippen öffnet den Eintrag dieses Tages (Tageskarte, Rückblick). Barrierefrei: Liste derselben Einträge als Textalternative.

## 3 · Meilensteine

Jeder Meilenstein öffnet **echten Inhalt** oder eine **gestalterische Freischaltung** mit Dauerwert. Kein Abzeichen ohne Inhalt.

### 3.1 Rhythmus (gilt unbegrenzt)

| Rhythmus | Ereignis | Inhalt |
|---|---|---|
| alle 7 Reisetage | **Wochenrückblick** | aus eigenen Daten: die 7 Karten der Woche als Reihe, häufigstes Thema, Licht/Schatten-Balance (Ton der Karten), eigene Notizen als Zitate, eine Rückblick-Legung als Angebot |
| alle 21 Reisetage | **Rundenabschluss** | Sternbild, Rundentext, Station-Lesart wechselt |
| alle 30 Reisetage | **Monatsrückblick** | wie Woche, über 30 Tage, dazu „Karte des Monats“ (häufigste), Zahlenbegegnungen |
| alle 50 Reisetage ab 100 | **Jubiläum** | Rückblick seit Beginn + eine gestalterische Freischaltung aus dem Pool (§3.3), solange vorhanden |
| 365, dann jährlich | **Jahresbuch** | großer Rückblick, teilbar als Ex-Libris-Seite |

### 3.2 Feste Meilensteine bis 365

| Reisetag | Meilenstein | Belohnung (Typ) | Herkunft im Auftrag |
|---|---|---|---|
| 1 | Erste Karte, Archetyp enthüllt | Grimoire-Einband mit Namen der Archetypen, Station I | wie Auftrag |
| 2 | Einladung: deine Zahlen | Weltvorstellung Numerologie (nichts gesperrt) | neu |
| 3 | Archetyp-Kapitel I „Deine Gabe“ | Inhalt (C6) | „vertiefende Archetyp-Botschaft“ |
| 4 | Einladung: Engelszahlen | Weltvorstellung | neu |
| 6 | Einladung: Symbole | Weltvorstellung | neu |
| 7 | Erster Wochenrückblick | Inhalt (datenbasiert) + Rückblick-Legung | wie Auftrag |
| 10 | Dein Symbol | persönliches Symbol = Leitsymbol des Hauptarchetyps, im Ex Libris | „spirituelles Symbol“ (Tag 14), vorgezogen |
| 14 | Kartenrücken „Mondsichel“ | gestalterisch (A20), wählbar für verdeckte Karten | neu |
| 21 | Erste Runde vollendet | Sternbild I + Archetyp-Kapitel II „Deine Verbindungen“ (erweitertes Profil) | „erweitertes Archetypenprofil“ |
| 30 | Erster Monatsrückblick | Inhalt (datenbasiert) | wie Auftrag |
| 42 | Zweite Runde vollendet | Sternbild II + Archetyp-Kapitel III „Dein Schatten“ | neu |
| 50 | Grimoire-Kapitel „Ex Libris“ veredelt | Goldschnitt-Variante des Einbands + persönliche Widmungsseite (eigener Satz, privat) | „besonderes Grimoire-Kapitel“ |
| 63 | Dritte Runde vollendet | Sternbild III + Archetyp-Kapitel IV „Dein Weg“, Stationen lesen sich nun als „Weisheit“ | neu |
| 75 | Kartenrücken „Sternenkompass“ | gestalterisch (A21) | neu |
| 100 | Der erweiterte Pfad | Hundert-Tage-Rückblick, Ergänzungsarchetyp-Kapitel „Zwei Stimmen“ (bei Ergänzung) bzw. „Die andere Seite“ (Archetyp mit der zweithöchsten Punktzahl), Sternbild „Hundert“ | „erweiterter Entwicklungspfad“ |
| 150, 200, 250, 300 | Jubiläum | Rückblick + Freischaltung aus Pool §3.3 | Regel |
| 365 | Ein Jahr | Jahresbuch, Kartenrücken „Goldenes Rad“ (A22) | Regel |

### 3.3 Pool gestalterischer Freischaltungen (für Jubiläen)

Reihenfolge fest, kein Zufall: (1) Grimoire-Lesebändchen in Wahlfarbe (CSS) bei 150, (2) Tagesansicht-Ornamentsatz „Lorbeer“ (SVG-Variante der Goldecken) bei 200, (3) Sternkarten-Himmel „Morgendämmerung“ (CSS-Verlauf) bei 250, danach nur noch Rückblicke, bis ein Update neue Einträge bringt. Neue Pool-Einträge kommen mit Updates. Freischaltungen sind **nie kaufbar** (keine Vermischung von Reise und Geld).

**Backlog (1.3+):** virtuelle Talismane und spirituelle Sammelobjekte als weitere kostenlose Entdeckungen. Sie werden über feste Reisetage, Kartenstufen oder Meilensteine gefunden, nie über Zufall. Keine Lootbox, keine virtuelle Währung, nicht käuflich, kein Sammelzwang (nichts geht verloren, nichts ist zeitlich begrenzt). Darstellung im Grimoire-Kapitel „Symbole“.

### 3.4 Was ein Meilenstein nicht tut

- kein Countdown („noch 3 Tage bis …“). Die Sternkarte zeigt den **nächsten** Meilenstein nur als Silhouette ohne Druck
- keine Push-Nachricht zu Meilensteinen
- keine Wiederholung: Jeder Meilenstein-Moment erscheint einmal (Flag `seen`), bleibt im Grimoire nachlesbar

## 4 · Kartenvertiefung

Stufen und Bedingungen: `PRODUCT_SYSTEMS.md` §D. Hier die Regeln für die Ableitung.

```ts
interface CardEncounters {
  cardId: string;
  days: Set<string>;            // dateKeys mit Tageskarte oder gespeicherter Legung mit dieser Karte
  themes: Set<ThemeId>;         // Themen dieser Begegnungen
  roles: Set<RoleId>;           // Rollen in Legungen
  studied: { part1: boolean; part2: boolean }; // aus Ereignissen 'card.studied'
  reflections: number;          // Notizen an Tageskarte/Legung mit dieser Karte + Studiumsantworten mit Text
}

level(e) =
  4 if level3(e) && e.reflections >= 1
  3 if e.days.size >= 4 || e.themes.size >= 3 || e.studied.part2
  2 if e.days.size >= 2 || e.studied.part1
  1 if e.days.size >= 1
  0 otherwise
```

- Mehrere Legungen am selben Tag ergeben **einen** Tag (kein Farmen).
- Teil 2 des Studiums setzt Teil 1 voraus. Eine Stufe fällt nie zurück, weil alle Bedingungen monoton sind.
- „Neu“-Glanz für eine Stufe erscheint einmal (`seen`-Flag `level:<cardId>:<n>`).

**Grimoire-Kopfzahl:** „22 entdeckt · 9 verstanden · 4 vertieft · 1 verinnerlicht“ statt nur „x / 22“.

## 5 · Archetyp-Kapitel und Zahlen-Vertiefung

| Welt | Fortschritt | Ableitung |
|---|---|---|
| Archetyp | Kapitel I–IV über Reisetage (3, 21, 42, 63), Ergänzungskapitel bei 100 | `journeyDays` |
| Numerologie | Profil vollständig, sobald Geburtsdatum eingetragen. Jahresverlauf (Edition) | Daten + Entitlement |
| Engelszahlen | eigene Begegnungen und Favoriten; häufigste eigene Zahl im Ex Libris | Tagebuch |
| Symbole | entdeckt über Kartenstufe 3 (Symbole der Karte) und Meilenstein Tag 10 | Ableitung aus Kartenstufen |
| Mond (1.1) | Zyklen mit Intention + Reflexion | Tagebuch |

## 6 · Welten vorstellen, nicht freischalten

Neue Nutzer sehen am ersten Tag nur Tageskarte, Archetyp und Grimoire. Alle Welten sind ab Tag 1 im Tab „Entdecken“ erreichbar, aber **vorgestellt** werden sie nacheinander (Tag 2 Zahlen, Tag 4 Engelszahlen, Tag 6 Symbole, 1.1: erster Neumond nach Tag 3). Wer selbst sucht, findet alles sofort. So bleibt der Einstieg ruhig, ohne künstliche Sperren.

## 7 · Rückblicke (datenbasiert, ohne neue Inhalte)

Rückblicke sind der günstigste Inhalt mit dem höchsten persönlichen Wert, weil sie nur eigene Daten neu ordnen.

| Baustein | Quelle | Beispiel |
|---|---|---|
| Kartenreihe | Tageskarten des Zeitraums | 7 kleine Karten |
| Thema | häufigstes aktives Thema | „Deine Woche stand im Zeichen von Veränderung & Entscheidungen“ |
| Balance | Ton der Karten (`light`/`twilight`/`shadow`) | „Drei lichte, drei dämmrige, eine schattige Karte“ |
| Wiederkehr | Karte mit ≥ 2 Begegnungen im Zeitraum | „Der Stern kam zweimal zu dir“ |
| Eigene Worte | 1–2 Notizen (nur in der App, nie im Share-Bild) | Zitat mit Datum |
| Zahl | häufigste eigene Engelszahl / persönliches Monatsthema | „Dein persönlicher Monat: 7, Rückzug und Klarheit“ |
| Angebot | Rückblick-Legung | 1 neue Karte als Impuls für die nächste Woche |

Satzbausteine: etwa 40 Vorlagen je Sprache (`CONTENT_MASTERPLAN.md` §3), deterministisch ausgewählt.

## 8 · Randfälle

| Fall | Verhalten | Test |
|---|---|---|
| Zeitzonenwechsel | `dateKey` aus lokalem Datum zum Zeitpunkt der Handlung. Reise in Richtung Datumsgrenze kann zwei Handlungen auf einen Tag legen oder einen Tag „überspringen“: zählt so, wie gespeichert | Unit (Clock-Injektion) |
| Uhr zurückgestellt | kein Verlust, Fakten bleiben. Doppelte `dateKey` werden einmal gezählt | Unit |
| Neuinstallation / Daten gelöscht | Reise beginnt neu (lokal, ohne Konto, transparent im Löschdialog genannt) | E2E |
| Inhaltsupdate ändert Meilenstein-Tabelle | Meilensteine sind abgeleitet: neue erscheinen rückwirkend als erreicht, einmalig als „neu“. Bereits gesehene bleiben gesehen | Migrationstest |
| Fragebogen erneut | Archetyp-Kapitel beziehen sich auf den **aktuellen** Archetyp. Bereits gelesene Kapitel anderer Archetypen bleiben im Grimoire unter „Begegnete Archetypen“ | Unit + E2E |

## 9 · Abnahmekriterien (messbar)

1. `journeyDays` ist monoton: Property-Test über 1.000 zufällige Ereignisfolgen (inklusive Pausen, Zeitsprünge).
2. Jede Zeile der Meilenstein-Tabelle hat einen `reward` mit Inhalt oder Gestaltung (Test über die Tabelle).
3. Kein Text in Reise, Meilensteinen, Rückblicken enthält Formulierungen aus der Verbotsliste (Content-Gate: „verloren“, „verpasst“, „Serie“, „Streak“, „nur noch“, „beeil“, „letzte Chance“ u. a.).
4. Jede Kartenstufe ist ohne Zufall erreichbar (E2E: Studium Teil 1 und 2, eine Notiz → Stufe 4).
5. Migration: Ein G2-Datenbestand mit 40 Tageskarten und 10 Legungen ergibt nach dem Update sofort den richtigen Reisetag, die richtigen Stufen und die richtigen Meilensteine (Fixture-Test).
6. Usability (8–12 Personen): niemand beschreibt die Reise als Druck oder Pflicht. Mindestens 7 von 10 verstehen, wie die Reise wächst.
