# PRODUCT_SYSTEMS · Funktionsspezifikation A–K

**Stand:** 26.11.2026 · Grundlage: `PRODUCT_VISION_V2.md`. Datenmodelle stehen in `INFORMATION_ARCHITECTURE.md` §5, Textmengen in `CONTENT_MASTERPLAN.md`, Bilder in `docs/visual/ASSET_REQUESTS.md`, Pakete und Aufwand in `MASTER_ROADMAP_V2.md`.

**Release-Zuordnung:** **1.0** = erster öffentlicher Release · **1.1** = erstes Update (Mond) · **1.2+** = spätere Updates · **—** = nicht geplant. **Free/Edition** = kostenlos oder Teil der einmaligen Premium-Edition (`MONETIZATION_CONCEPT.md`).

## 0 · Übersicht und Abhängigkeiten

Drei **gemeinsame Systeme** tragen alles: **Identität** (Wer bin ich?), **Reise** (Wie lange bin ich schon unterwegs, was habe ich erlebt?) und **Grimoire** (Was habe ich gesammelt und geschrieben?). Jede Themenwelt schreibt in mindestens eines davon (Leitplanke L1).

| System | Release | schreibt in | hängt ab von |
|---|---|---|---|
| A Tagesorakel | vorhanden, Ausbau 1.0 | Grimoire (Tagebuch, Karten), Reise (Tag) | C (Linse), D (Begegnungen), G (Tageszahl), I (Mond, 1.1) |
| B Spirituelle Reise | 1.0 | Reise | Fakten aus A, D, F, G, H, I |
| C Identität und Archetypen | 1.0 | Identität, Grimoire (Kapitel Archetypen) | Fragebogen, Porträts A07–A14 |
| D Kartenvertiefung | 1.0 | Grimoire (Karten) | A, F (Begegnungen), Tagebuch (Reflexionen) |
| E Grimoire | 1.0 | – (ist das Ziel) | A, B, C, D, F, G, H |
| F Legungen | 3 neue in 1.0, weitere 1.2 | Grimoire (Tagebuch), D | Rollentexte je Karte |
| G Numerologie (zweite Säule der Identität) | 1.0 (Geburtsdatum) | Identität, Grimoire (Zahlen, Karten), A | freiwilliges Geburtsdatum, C (Resonanz) |
| H Engelszahlen und Symbole | 1.0 | Grimoire (Zahlen, Symbole), Tagebuch | Symbol-Lexikon, D (Symbole je Karte) |
| I Mond und Rituale | 1.1 | Grimoire (Tagebuch, Rituale), A | lokale Mondberechnung |
| J Teilen | Archetypkarte ab V04, übrige Vorlagen 1.0 | – | A, C, G, H, B |
| K Erweiterungen | bewertet in §K | – | – |

```
          Fragebogen ─► C Identität ◄─ G Numerologie
                          │   ▲
                          ▼   │
   I Mond (1.1) ─► A Tagesorakel ◄─ D Begegnungen ◄─ F Legungen
                          │                 ▲
                          ▼                 │
                    B Reise (Tage) ──► E Grimoire ◄── H Zahlen & Symbole
                          │                 │
                          └──► J Teilen ◄───┘
```

---

## A · Das tägliche Orakel

**Zweck:** täglicher Anlass zur Rückkehr, kürzester Weg zum Wert (≤ 90 s bis zur ersten Karte). **Wirtschaftlich:** treibt D1/D7 und ist das häufigste Teilmotiv.

### Funktionen

| # | Funktion | Release | Free/Edition |
|---|---|---|---|
| A1 | Eine Karte pro lokalem Kalendertag, gespeichert, freiwillig enthüllt (vorhanden). Ziehung bleibt echt zufällig (kryptografisch), keine Wiederholung der Karte des Vortags | vorhanden | Free |
| A2 | **Tagesbotschaft** Karte × aktives Thema (vorhanden, 132 Texte) | vorhanden | Free |
| A3 | **Archetyp-Linse je Karte**: statt eines festen Satzes pro Archetyp (heute jeden Tag gleich) ein kurzer Text aus ein bis zwei Sätzen pro Archetyp × Karte (176, S-33). Mit Ergänzungsarchetyp: an jedem dritten Tag dessen Linse | 1.0 | Free |
| A4 | **Wechselnde Reflexion und Ritual**: pro Karte 3 Reflexionsfragen und 2 Rituale. Die Variante ergibt sich aus der Zahl der bisherigen Begegnungen mit dieser Karte (deterministisch, im Datensatz gespeichert) | 1.0 | Free |
| A5 | **Tagesenergien-Zeile**: persönliche Tageszahl (G, nur mit Geburtsdatum) und Mondphase (I, ab 1.1). Je eine Zeile mit Symbol, tippbar zur Erklärung. Kein Dashboard: höchstens zwei Einträge | 1.0 / 1.1 | Free |
| A6 | **Entdeckungshinweis**: höchstens ein Hinweis pro Tag auf neue Inhalte (z. B. „Licht und Schatten der Herrscherin ist jetzt im Grimoire“, „Neu: Wochenrückblick“). Priorität: Meilenstein > Kartenstufe > Weltvorstellung | 1.0 | Free |
| A7 | **Meilenstein-Moment** nach der Enthüllung, wenn der heutige Tag einen erreicht (B) | 1.0 | Free |
| A8 | **Reise fortsetzen** (V02): führt zur Botschaft, danach zu Reflexion, Notiz, Hinweis | vorhanden (V02) | Free |
| A9 | **Weltvorstellung**: an Nutzungstag 2, 4 und 6 stellt der Hinweis (A6) je eine Welt vor (Zahlen, Engelszahlen, Symbole). Nur Einladung, nichts ist gesperrt | 1.0 | Free |

**Stabil und reproduzierbar:** Der gespeicherte `DailyRecord` ist maßgeblich. Varianten-Indizes (A3/A4) werden beim Erzeugen bestimmt und mitgespeichert, nie nachträglich neu berechnet. Profiländerungen ändern vergangene Tage nicht (PR-07 bleibt).

**Nicht übernommen:** Gewichtung der Ziehung nach unbekannten Karten. Die Ziehung bleibt ehrlich zufällig, die Begegnungen steuern die **Texte**, nicht die **Karte**.

**Abnahme:** Über 66 simulierte Nutzungstage (Unit-Test mit festem Zufall) wiederholt sich keine Kombination aus Botschaft, Linse, Reflexion und Ritual innerhalb von 21 Tagen. Tagesgrenze, Zeitzonenwechsel und Neustart liefern denselben Datensatz (bestehende Tests plus neue Fälle). Erste Karte in ≤ 90 s (Usability-Test 8 von 10).

---

## B · Die spirituelle Reise

**Zweck:** sichtbarer, wachsender Fortschritt ohne Druck. **Wirtschaftlich:** Langzeitbindung, Meilensteine sind teilbar. Vollständiges Design in `PROGRESSION_DESIGN.md`.

| # | Funktion | Release | Free/Edition |
|---|---|---|---|
| B1 | **Reisetag** = Anzahl verschiedener Tage mit Nutzung (vorhanden: Tageskarte oder gespeicherte Legung; ab 1.0 zusätzlich: Kartenstudium, Tagebucheintrag, Zahlenbegegnung, Mondeintrag) | V02 / 1.0 | Free |
| B2 | **Narrenreise**: 21 Stationen je Runde (drei Wege zu sieben), jede Station trägt einen kurzen Erzähltext (Station III: der Narr begegnet der Herrscherin). Runde 1, 2 und 3+ haben eigene Lesarten | 1.0 | Free |
| B3 | **Sternkarte** im Kapitel „Reise“: jede abgeschlossene Runde zeichnet ein Sternbild (SVG). Erreichte Meilensteine sind Sterne mit Datum | 1.0 | Free |
| B4 | **Meilensteine** mit echtem Inhalt (Tabelle in `PROGRESSION_DESIGN.md` §3), definiert bis Tag 365 und als Regel darüber hinaus | 1.0 | Free |
| B5 | **Wochenrückblick** (alle 7 Reisetage) und **Monatsrückblick** (alle 30): aus eigenen Daten erzeugt (gezogene Karten, häufigstes Thema, Element-Balance der Karten, eigene Notizen als Zitate). Optional mit einer Rückblick-Legung (F) | 1.0 | Free |
| B6 | **Archetyp-Kapitel** werden über die Reise geöffnet (Tag 3, 21, 42, 63) | 1.0 | Free (Kapitel I–IV), Edition: Ergänzungsarchetyp-Vertiefung |

**Abnahme:** Pausen ändern den Reisetag nicht (Test: 30 Tage Pause → gleicher Stand). Kein Text enthält Verlust-, Druck- oder Schuldformulierungen (Content-Gate). Jeder Meilenstein bis Tag 100 öffnet einen konkreten Inhalt oder eine gestalterische Freischaltung (Test über die Meilenstein-Tabelle: kein Eintrag ohne `reward`).

---

## C · Spirituelle Identität und Archetypen

**Zweck:** emotionaler Kern und Anker der Personalisierung. **Wirtschaftlich:** stärkster Teilmoment („Mein Archetyp“), Grundlage der Edition (erweiterte Profile).

| # | Funktion | Release | Free/Edition |
|---|---|---|---|
| C1 | **Fragebogen v2**: 7 Fragen (bisher 4) mit je 4 Antworten, eine Frage pro Ansicht, jede überspringbar. Ziel ≤ 75 s. Jede Antwort gewichtet einen Haupt- (+2) und einen Neben-Archetyp (+1). Ausgewogen: jeder Archetyp ist gleich oft primär und sekundär erreichbar (Test über alle 4⁷ = 16.384 Kombinationen) | 1.0 | Free |
| C2 | **Haupt- und Ergänzungsarchetyp**: Haupt = höchste Punktzahl (Tie-Break D-07). Ergänzung = zweithöchste, nur wenn sie höchstens 1 Punkt hinter dem Hauptwert liegt und mindestens 4 Fragen beantwortet sind (D-53; ursprünglich ≥ 60 %, das ergab bei 87 % eine Ergänzung), sonst keine (ehrlich: nicht jeder hat eine klare Ergänzung) | 1.0 | Free |
| C3 | **„Warum dieser Archetyp?“**: Liste der eigenen Antworten mit ihrem Beitrag. Macht die Herleitung nachvollziehbar und verhindert den Eindruck einer Diagnose | 1.0 | Free |
| C4 | **Enthüllung als Höhepunkt**: Porträt (A07–A14) tritt aus dem Licht, Name, ein Satz Essenz, dann als zweiter Moment der Ergänzungsarchetyp. ≤ 8 s, überspringbar, bei reduzierter Bewegung statisch | 1.0 | Free |
| C5 | **Ausführliches Profil** je Archetyp: Beschreibung, 3 Stärken, 2 innere Spannungen, Schatten als 3 Fragen, Beziehungsmuster, 2 Entwicklungspotenziale, 2–3 Symbole, 3 zugeordnete Karten, 3 Rituale, 5 Reflexionsfragen | 1.0 | Free: Beschreibung, Stärken, Schatten, Entwicklung, Karten, Symbole. Edition: Beziehungsmuster, innere Spannungen, Ritualreihe |
| C6 | **Vier Archetyp-Kapitel** über die Reise (B6): I „Deine Gabe“, II „Deine Verbindungen“, III „Dein Schatten“, IV „Dein Weg“ | 1.0 | Free |
| C7 | **Ergänzung als Modifikator**: 8 kurze Texte „… als deine Ergänzung“. Das Paar wird zusammengesetzt, nicht als neuer Typ ausgegeben | 1.0 | Edition (Vertiefung), Name und Kurztext Free |
| C8 | **Alle acht entdecken**: Das Grimoire zeigt alle acht Archetypen (Porträt, Essenz). Eigene sind hervorgehoben, die anderen sind lesbar (kein Sammelzwang) | 1.0 | Free |
| C9 | **Sanfter Spiegel** (ab Reisetag 30): „Deine Karten sprachen zuletzt oft vom Wandernden.“ Angebot, nicht Zwang, den Fragebogen erneut zu machen. Grundlage: Archetyp-Zuordnung der gezogenen Karten (3 Karten je Archetyp) | 1.2 | Free |
| C10 | **Identität im Profil („Ich“)** mit **zwei Säulen**: links Archetypen, rechts Zahlen (Lebenszahl, Lebenskarte, persönliches Jahr), darunter Symbol und Reisestand, als „Ex Libris“ teilbar (J). Bis V06 nur die Archetyp-Säule; die Zahlen-Säule erscheint erst mit V06 (keine leere Attrappe) | 1.0 | Free |
| C11 | **Teilbare Archetypkarte** schon in V04 (J2): Porträt, Name, Essenz, drei Stärken, im Story- und Feed-Format, direkt aus Enthüllung und „Ich“ | 0.4 (V04) | Free |

**Bewertung Fragebogen:** 4 Fragen reichen für einen Typ, aber nicht für ein überzeugendes Profil mit Ergänzung (zu viele Gleichstände, zu wenig Spreizung). 7 Fragen bleiben unter 90 s und geben genug Signal. Mehr als 8 Fragen senken die Aktivierung.

**Abnahme:** alle 8 Haupt- und alle 56 Haupt/Ergänzungs-Paare erreichbar (Test). Anteil ohne Ergänzung bei gleichverteilten Antworten 20–40 % (Simulation). Usability: 8 von 10 können erklären, warum sie ihren Archetyp haben. Kein Text behauptet ein objektives Wesen (Content-Gate).

---

## D · Kartenentdeckung und Kartenvertiefung

**Zweck:** Langzeitwert der 22 Karten. **Wirtschaftlich:** Bindung, Lernmotiv (Tarot lernen ist ein eigenes Suchfeld).

| Stufe | Inhalt | erreicht durch (eins genügt) |
|---|---|---|
| 1 Entdeckt | Essenz, Botschaft zum Thema (vorhanden) | erste Begegnung (Tageskarte oder gespeicherte Legung) |
| 2 Verstanden | Licht und Schatten der Karte, Schlüsselwort-Erklärung | Begegnung an 2 verschiedenen Tagen **oder** Kartenstudium Teil 1 |
| 3 Vertieft | Themenrad (alle 6 Themen), Rollen in Legungen, Symbolik der Karte (Bildsymbole, verlinkt ins Lexikon) | Begegnung an 4 verschiedenen Tagen oder in 3 verschiedenen Themen **oder** Kartenstudium Teil 2 |
| 4 Verinnerlicht | eigene Seite: alle eigenen Notizen zu dieser Karte, zweites Ritual, persönliche Frage, Goldrahmen im Grimoire | Stufe 3 **und** mindestens eine eigene Reflexion zu dieser Karte (Notiz an Tageskarte, Legung oder Studium) |

| # | Funktion | Release | Free/Edition |
|---|---|---|---|
| D1 | Begegnungen werden **abgeleitet** (verschiedene Tage, Themen, Rollen), nicht gezählt. Ungespeicherte Legungen zählen nicht, mehrere Legungen am selben Tag zählen als ein Tag (kein Farmen) | 1.0 | Free |
| D2 | **Kartenstudium**: aus der Kartenseite heraus, 2 kurze Teile (je 1–2 min): Lesen und eine Frage beantworten (Freitext optional, ein Tipp auf „Gelesen“ genügt für Teil 1). Freiwillig, beliebig oft | 1.0 | Free |
| D3 | Stufenanzeige im Grimoire: Mondphasen-Symbol (neu → voll) statt Balken | 1.0 | Free |
| D4 | Normale Legungen sind unabhängig von Stufen immer vollständig nutzbar. Keine Karte ist je gesperrt | 1.0 | Free |
| D5 | **Decks** als Kunst-Varianten derselben 22 Karten (Bedeutung hängt an der Karte, nicht am Deck). Deckwahl im Profil, Begegnungen zählen deckübergreifend | 1.2 | erstes Zusatzdeck: einzeln kaufbar |
| D6 | Kleine Arkana | — (nur bei Nachfrage) | — |

**Abnahme:** jede Stufe ohne Zufall erreichbar (E2E: Studium öffnet Stufe 2 und 3). Begegnungslogik gegen Farmen getestet. Bestehende Nutzerdaten ergeben nach dem Update sofort die richtigen Stufen (Migrationstest mit G2-Datenbestand).

---

## E · Das persönliche Grimoire

**Zweck:** das Alleinstellungsmerkmal, ein Buch, das durch Nutzung wertvoller wird. **Wirtschaftlich:** Bindung und Wertigkeit (Store-Screenshots), Ort für Edition-Inhalte.

**Struktur:** Einband (A15) → Inhaltsverzeichnis mit 7 Kapiteln → Kapitelseiten. Jedes Kapitel zeigt **„x von y“** und eine schön gestaltete erste Seite, auch wenn es leer ist.

| Kapitel | Inhalt | Leerer Zustand (wirkt fertig, lädt ein) | Release |
|---|---|---|---|
| I Karten | 22 Karten mit Stufe, Kartenseite mit allen geöffneten Ebenen | „Deine erste Karte wartet auf dich“ + Weg zur Tageskarte | 1.0 |
| II Archetypen | eigene zwei hervorgehoben, alle acht lesbar, Kapitel I–IV | erscheint nie leer (Profil oder Einladung zum Fragebogen) | 1.0 |
| III Symbole | 24 Symbole, entdeckt über Kartenstufe 3 und Meilensteine | Silhouetten mit Namen und Herkunftshinweis („im Bild des Sterns“) | 1.0 |
| IV Tagebuch | Tageskarten, Legungen, Reflexionen, Zahlen-, Mond-Einträge, Filter und Suche | „Hier schreibst du mit“ + erste Reflexion | 1.0 |
| V Rituale | durchgeführte (selbst markiert) und gemerkte Rituale | 3 einfache Einstiegsrituale | 1.0 |
| VI Zahlen | Kernzahlen (G), gemerkte Engelszahlen und Begegnungen (H) | Einladung, Geburtsdatum freiwillig einzutragen | 1.0 |
| VII Reise | Sternkarte, Meilensteine, Rückblicke | Station 1 ist immer erreicht | 1.0 |

| # | Funktion | Release | Free/Edition |
|---|---|---|---|
| E1 | Buch-Präsentation: Pergament-Seiten (`--parchment`), Kapitel-Vignetten (A23–A29), Ornamente per SVG, Seitenwechsel als Übergang (reduziert: Überblenden) | 1.0 | Free |
| E2 | **„Neu im Grimoire“**: kleiner Teal-Glanz an neuen Einträgen, bis sie angesehen wurden | 1.0 | Free |
| E3 | Suche über Tagebuch und Lexika (lokal) | 1.0 | Free |
| E4 | **Ex Libris**: persönliche erste Seite (Archetyp, Kernzahlen, Symbol, Reisetag), teilbar ohne private Daten | 1.0 | Free |
| E5 | **Lokale Sicherung und Wiederherstellung**: alle eigenen Daten als eine versionierte Datei exportieren und auf demselben oder einem neuen Gerät wiederherstellen (ersetzen nach Vorschau und Bestätigung). Geburtsdatum nur auf Wunsch enthalten. Details `INFORMATION_ARCHITECTURE.md` §5.7 | 1.0 (spätestens) | Free (Datensicherung ist kein Premium) |
| E6 | **Visueller PDF-Export** des Grimoires (gestaltete Seiten zum Lesen oder Drucken), unabhängig von der Sicherung | 1.2+ | Free oder Edition (E19) |
| E6 | Zusätzliche Kapitel (Mond 1.1, Träume 1.3+) erscheinen, wenn die Welt erscheint | 1.1+ | je nach Welt |

**Abnahme:** jedes Kapitel hat einen gestalteten Leerzustand (Screenshot-Review). Ein gespeicherter Eintrag ist in ≤ 3 Taps auffindbar (E2E). Kein Kapitel zeigt gesperrte Inhalte als Kaufdruck (keine Schlösser auf Free-Inhalten, Edition-Inhalte als eigener, ruhig markierter Abschnitt).

---

## F · Kartenlegungen

**Zweck:** Tiefe für aktive Nutzer. **Wirtschaftlich:** größere Legungen sind der natürlichste Premium-Inhalt.

**Prinzip:** Eine Legung ist eine Anordnung von **Rollen**. Jede Karte hat einen Text pro Rolle. Neue Legungen brauchen dadurch keine neuen Kartentexte, nur neue Anordnungen und Rahmentexte.

| Rolle | Frage der Position | Kartentexte |
|---|---|---|
| R1 Kern (Situation) | Was steht im Mittelpunkt? | vorhanden |
| R2 Herausforderung | Was macht es schwer? | vorhanden |
| R3 Impuls | Welcher nächste Schritt ist möglich? | vorhanden |
| R4 Licht (Ressource) | Was trägt dich? | neu |
| R5 Schatten (blinder Fleck) | Was übersiehst du vielleicht? | neu |
| R6 Wurzel | Was wirkt aus dem Gewesenen nach? | neu |
| R7 Möglichkeit | Was könnte sich öffnen? | neu |
| R8 Brücke (Integration) | Was verbindet die Seiten? | neu |

| Legung | Karten | Rollen (Position: Rolle) | Release | Free/Edition |
|---|---|---|---|---|
| Klassisch (vorhanden) | 3 | Kern, Herausforderung, Impuls | vorhanden | Free |
| Licht und Schatten | 3 | Licht, Schatten, Brücke | 1.0 | Free |
| Neuanfang | 4 | Was endet: Wurzel · Was bleibt: Licht · Was beginnt: Möglichkeit · Erster Schritt: Impuls | 1.0 | Free |
| Rückblick (Woche/Monat) | eigene Karten + 1 | die gezogenen Karten des Zeitraums als Rückschau, dazu 1 neue Karte als Impuls. Ab Reisetag 7 | 1.0 | Free |
| Zwei Wege (Entscheidung) | 5 | Kern · Weg A: Möglichkeit · Weg B: Möglichkeit · Was wirklich zählt: Licht · Rat: Impuls. Rahmen: „was jeder Weg in dir anspricht“, keine Vorhersage | 1.0 | Edition |
| Verbindung (Beziehung) | 5 | Ich: Kern · Die Verbindung: Brücke · Was ich gebe: Licht · Was ich brauche: Schatten · Impuls. **Keine Position über Gedanken oder Gefühle der anderen Person** | 1.0 | Edition |
| Innerer Konflikt | 4 | Seite A: Kern · Seite B: Herausforderung · Was beide wollen: Licht · Brücke | 1.2 | Edition |
| Lebensweg | 7 | Wurzel · Kern · Licht · Schatten · Möglichkeit · Herausforderung · Impuls | 1.2 | Edition |

Die 6 Themen bleiben Filter für Rahmentexte und Botschaft (klassisch, Licht und Schatten, Neuanfang). Zwei Wege und Verbindung haben feste Themen.

**Abnahme:** Jede Legung ergibt für jede Kartenkombination einen vollständigen Text (Matrix-Test). Kein Positionsname verspricht Zukunft oder Wissen über andere (Content-Gate). Edition-Legungen sind im Orakel sichtbar beschrieben, aber nie als Unterbrechung einer laufenden Legung.

---

## G · Numerologie

**Zweck:** **zweite Säule der persönlichen spirituellen Identität** neben den Archetypen. Sie ist keine Nachschlage-Ecke, sondern eng mit Archetyp, Tagesorakel und Grimoire verbunden (G9–G13). **Wirtschaftlich:** großes Suchfeld, teilbar (Lebenszahl), Edition-Vertiefung. Rechenregeln verbindlich in `CONTENT_MASTERPLAN.md` §5.

| # | Funktion | Release | Free/Edition |
|---|---|---|---|
| G1 | Geburtsdatum **freiwillig**, nur lokal, eigener Datensatz, einzeln löschbar, mit Hinweis warum es gebraucht wird | 1.0 | Free |
| G2 | **Lebenszahl** (Komponentenmethode, Meisterzahlen 11, 22, 33 bleiben) mit sichtbarem Rechenweg | 1.0 | Free |
| G3 | **Geburtstagszahl** (Tag des Monats, 11 und 22 bleiben) | 1.0 | Free |
| G4 | **Persönliches Jahr, Monat, Tag** (Kalenderjahr-Konvention, reduziert auf 1–9) | 1.0 | Free |
| G5 | Zahlenprofil-Ansicht: große Ziffer in einem Ornament-Medaillon (Code, kein Bild), Essenz, Stärken, Herausforderungen, Reflexion | 1.0 | Free: Essenz, Stärken, Reflexion. Edition: Herausforderungen ausführlich, Jahresverlauf (12 Monate) |
| G6 | Persönliche Tageszahl in der Tagesenergien-Zeile (A5), Jahreszahl als Kapitel im Grimoire | 1.0 | Free |
| G7 | Zuordnung Zahl ↔ Karte (1 Magier … 9 Eremit, 11 Gerechtigkeit/Kraft je nach Zählung, siehe Content) und Zahl ↔ Archetyp-Resonanz als Brücke zu C und D | 1.0 | Free |
| G8 | Namenszahlen (Ausdruck, Seelenzahl, Persönlichkeit) | 1.3+ (Entscheidung E12) | Edition-Erweiterung |
| G9 | **Lebenskarte**: die Große-Arkana-Karte zur Lebenszahl (Zuordnung G7). Erscheint in „Ich“, ist im Grimoire auf ihrer Kartenseite markiert und zählt dort als eigene Begegnung „deine Lebenskarte“ | 1.0 | Free |
| G10 | **Archetyp und Zahl**: ein Satz, wie Lebenszahl und Hauptarchetyp zusammenwirken. Liegt die Lebenszahl unter den Resonanzzahlen des Archetyps (Tabelle `CONTENT_MASTERPLAN.md` §4): „verstärkend“, sonst „ergänzend“. 8 × 2 Texte, kein Kombinationstext je Paar | 1.0 | Free |
| G11 | **Tagesresonanz**: Die Tagesenergien-Zeile (A5) zeigt die persönliche Tageszahl. Entspricht sie der Zahl der Tageskarte (oder deren Quersumme), erscheint ein kurzer Resonanz-Hinweis. Höchstens ein Hinweis pro Tag (A6) | 1.0 | Free |
| G12 | **Jahreskarte und Jahreskapitel**: persönliches Jahr → Karte des Jahres. Das Grimoire-Kapitel „Zahlen“ beginnt mit dem laufenden Jahr (Zahl, Karte, Jahrestext), Monatswechsel als Eintrag | 1.0 | Free: Jahr. Edition: Monatsverlauf (G5) |
| G13 | **Einladung zur zweiten Säule**: Nach der Archetyp-Enthüllung und am Reisetag 2 (Weltvorstellung) wird das Geburtsdatum freundlich angeboten, nie verlangt. Ohne Datum bleibt die Zahlen-Säule eine Einladung, keine Lücke | 1.0 | Free |

**Abnahme:** Rechenfunktionen mit dokumentierten Testvektoren (mind. 20 Daten inklusive Meisterzahlen, Schaltjahr 29.02., Jahreswechsel, Zeitzone). Rechenweg in der UI entspricht der Funktion (Snapshot-Test). Ohne Geburtsdatum keine leeren Lücken, sondern eine Einladung.

---

## H · Engelszahlen und spirituelle Symbole

**Zweck:** Entdeckungswelt mit Nachschlage-Charakter. **Wirtschaftlich:** sehr hohes Suchvolumen, ideal teilbar, sehr geringer Bildbedarf.

| # | Funktion | Release | Free/Edition |
|---|---|---|---|
| H1 | **Nachschlagen** jeder Zahlenfolge (Ziffern, Uhrzeit `11:11`). 22 kuratierte Folgen mit vollem Text (111 … 999, 000, 1111, 2222, 1010, 1212, 1234, 1122, 1313, 1414, 2121, 0101; `11:11` = 1111, `22:22` = 2222) | 1.0 | Free |
| H2 | **Zusammengesetzte Deutung** für jede andere Folge aus Ziffern-Grundbedeutungen und Muster (Wiederholung, Spiegel, Treppe). Sichtbar gekennzeichnet: „aus den Ziffern zusammengesetzt“ | 1.0 | Free |
| H3 | **Begegnung festhalten**: Zahl, Datum, optional Ort-Stichwort und Notiz (Tagebuch). Begegnungen zählen als Reisetag (B1) | 1.0 | Free |
| H4 | Favoriten, Häufigkeit eigener Zahlen im Grimoire (Kapitel Zahlen) | 1.0 | Free |
| H5 | **Symbol-Lexikon**: 24 Symbole (Liste im Content-Masterplan), je Bedeutung, Licht, Schatten, Reflexion, Karten, in denen es vorkommt | 1.0 | Free |
| H6 | Symbole werden über Kartenstufe 3 und Meilensteine **entdeckt** (im Grimoire hervorgehoben), sind im Lexikon aber immer nachschlagbar (keine Sperre von Wissen) | 1.0 | Free |
| H7 | Teilbare Symbolkarte (J) | 1.0 | Free |

**Rahmen:** Jede Seite trägt den Hinweis „traditionelle symbolische Bedeutung, keine Botschaft mit Gewissheit“. Content-Gate verbietet: „Engel sagen dir“, „wird passieren“, „garantiert“, „Zeichen, dass er/sie …“.

**Abnahme:** jede Eingabe aus 1–6 Ziffern oder `hh:mm` liefert eine Deutung (Property-Test). 22 kuratierte Folgen vollständig in DE/EN. Suche ≤ 50 ms (lokal).

---

## I · Mondphasen und Rituale (Release 1.1)

**Zweck:** monatlicher Rhythmus und Ritual-Welt. **Wirtschaftlich:** natürlicher Inhaltsstrom und beste Grundlage für ein späteres Abo.

| # | Funktion | Release | Free/Edition |
|---|---|---|---|
| I1 | **Aktuelle Mondphase** lokal berechnet (Algorithmus nach Meeus, Kap. 47–49), 8 benannte Phasen, Beleuchtung in %, nächster Neu- und Vollmond mit lokaler Uhrzeit. Sachlich als „Astronomie“ markiert | 1.1 | Free |
| I2 | **Mondkalender** des Monats (SVG-Monde, keine Bilder) | 1.1 | Free |
| I3 | **Symbolische Bedeutung** je Phase, als „Deutung“ markiert | 1.1 | Free |
| I4 | **Neumond-Intention**: kurzer geführter Ablauf (3 Schritte, Text), Intention im Tagebuch. **Vollmond-Reflexion**: Rückschau auf die Intention desselben Zyklus | 1.1 | Free |
| I5 | **Loslass-, Ruhe- und Wachstumsrituale**: 12 einfache Rituale ohne Feuer, Substanzen, Käufe oder Risiko | 1.1 | Free: 6, Edition: Ritualreihe 6 |
| I6 | **Mondreise** (geführter Zyklus über 29 Tage, ein kurzer Impuls je Phase) | 1.2 | Edition oder späteres Abo |
| I7 | Mond in der Tagesenergien-Zeile (A5) | 1.1 | Free |

**Abnahme:** Phasenzeiten gegen Referenzwerte (Meeus Beispiel 49.a und veröffentlichte Tabellen für 2026/2027) innerhalb von ±10 min. Phasenname pro lokalem Tag in drei Zeitzonen getestet (UTC−10, UTC, UTC+14). Kein Ritual verlangt Gegenstände, die man kaufen müsste (Content-Gate).

---

## J · Organische Verbreitung (Teilen)

**Zweck:** Wachstum ohne Werbebudget. **Wirtschaftlich:** einziger skalierbarer Akquisekanal neben ASO.

| # | Vorlage | Inhalt (Whitelist) | Formate | Release |
|---|---|---|---|---|
| J1 | Tageskarte | Kartenbild, Name, Schlagworte, Essenz, Datum ohne Jahr optional | 1080×1920 (Story), 1080×1350 (Feed) | 1.0 |
| J2 | Archetyp | Porträt, Name, Essenz, 3 Stärken | beide | **0.4 (V04)** |
| J3 | Engelszahl / Symbol | Zahl bzw. Symbol, Kurzbedeutung, Reflexionsfrage | beide | 1.0 |
| J4 | Lebenszahl | Zahl, Name, Essenz. **Kein Geburtsdatum, kein Rechenweg** | beide | 1.0 |
| J5 | Meilenstein / Ex Libris | Reisetag, Station, Archetyp, Symbol | beide | 1.0 |
| J6 | Mondphase | Phase, Deutungssatz | beide | 1.1 |

**Technik:** lokal per Canvas mit eingebetteten Schriften, dezentes Branding (Emblem + „ARCANA“), Ausgabe über das System-Teilen (Web Share API im Browser, Capacitor Share im Android-Paket). Kein Server, keine Links mit Tracking.

**Datenschutz per Konstruktion:** Jede Vorlage bekommt ein eigenes `ShareModel`, das Notizen, Antworten und Geburtsdatum **als Typ nicht enthalten kann**. Ein Test prüft, dass kein Share-Modell diese Felder erreicht, und ein Bildvergleichstest erkennt Regressionen.

**Abnahme:** Export ≤ 1,5 s auf dem Referenz-Emulator, Bild scharf auf 1080 px, Branding ≤ 6 % der Fläche, Kontrast Text ≥ 4,5:1.

---

## K · Spätere Erweiterungen (bewertet, nicht beauftragt)

| Erweiterung | Nutzen | Aufwand | Risiko | Empfehlung |
|---|---|---|---|---|
| Optionale Erinnerung | hoch (Bindung) | S | Berechtigung Android 13+ | **vorziehen in 1.0**, opt-in, ab Reisetag 3 angeboten, Wortlaut ohne Druck |
| Zusätzliche Premium-Kartendecks (Kunst-Varianten) | mittel bis hoch (**langfristige Monetarisierung**, Wertigkeit) | M je Deck (23 Bilder, keine Texte) | Stilkonsistenz | **1.2** erstes Deck als Einzelkauf, danach eine Deck-Serie (`MONETIZATION_CONCEPT.md` §2.4) |
| Saisonale Inhalte (Jahreskreis, 8 Feste) | mittel (Rückkehr, Abo-Basis) | M | Inhaltsstrom muss gehalten werden | nach 1.1, nur mit Abo-Entscheidung |
| Spirituelle Themenreisen (7–21 Tage, z. B. Loslassen, Neubeginn, Selbstvertrauen) | mittel bis hoch (Rückkehr, **langfristige Monetarisierung**) | M je Reise (Text, kein Bild) | Content-Menge | 1.2+, Einzelkauf, Edition-Erweiterung oder Abo (`MONETIZATION_CONCEPT.md` §2.4). Die Narrenreise bleibt immer kostenlos |
| Traumtagebuch + Traumsymbole | mittel | M | Deutungsanspruch | 1.3+, nutzt Tagebuch und Symbol-Lexikon |
| Besondere Grimoire-Illustrationen | ästhetisch | S je Bulk | Assetflut | als Meilenstein-Belohnung in kleinen Bulks |
| Weitere Archetypen | gering | L | entwertet die acht | **nicht geplant** |
| Meditationen (Audio) | mittel | XL | Produktion, Lizenzen | **gestrichen** |
| Astrologische Geburtsprofile | mittel | XL | sensible Daten, Konkurrenz | **nicht in der Roadmap** |
| Kristalle als Kaufempfehlung | gering | M | Kaufdruck | **gestrichen** |
| Virtuelle Talismane und spirituelle Sammelobjekte | mittel (Entdeckungsfreude) | M (Bild-Sheet + Texte) | Sammelzwang | **Backlog 1.3+**: kostenlose Entdeckungsinhalte, gefunden über Reise, Kartenstufen oder Meilensteine. Keine Zufallsziehung, keine Lootbox, keine virtuelle Währung, nie käuflich |
| Cloud-Sync, Konto | mittel | XL | Backend, Kosten, Datenschutz | **nicht in der Roadmap** (lokaler Export statt Sync) |
