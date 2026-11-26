# MASTER_ROADMAP_V2 · Pakete, Bulks, Aufwand, Release-Umfang

**Stand:** 26.11.2026 · **Status:** verbindliche Planungsgrundlage. Umgesetzt wird **nur ein vom Eigentümer freigegebenes Paket**. Jedes Paket endet mit einem Bericht und wartet auf Freigabe. Grundlage: `PRODUCT_VISION_V2.md`, `PRODUCT_SYSTEMS.md`, `PROGRESSION_DESIGN.md`, `CONTENT_MASTERPLAN.md`, `INFORMATION_ARCHITECTURE.md`, `MONETIZATION_CONCEPT.md`. Bilder: `docs/visual/ASSET_REQUESTS.md`.

**Aufwand** in Agenten-Sitzungen (eine Sitzung ≈ ein zusammenhängender Arbeitslauf mit Tests und Bericht). Kalenderzeit hängt zusätzlich an Freigaben, Bildproduktion und Textprüfung durch den Eigentümer.

## 0 · Kurzfassung

| Paket | Version | Inhalt | Sitzungen | Bilder (Bulk) | Abschluss |
|---|---|---|---|---|---|
| **V02** Tagesorakel abschließen | 0.2 | läuft (Perf-Regression, Vergleich, Freigabe) | 1–2 | B1 (fertig) | Freigabe Tagesorakel, Merge nach `main` |
| **V03** Fundament und globales Designsystem | 0.3 | Datenmodell v2, Content-Module, Entitlements, Designsystem auf alle Screens | 3–4 | keine | QG-V03 |
| **V04** Identität und Reise | 0.4 | Fragebogen v2, Enthüllung, „Ich“, Linse je Karte, Narrenreise, Meilensteine, Sternkarte, Rückblicke, **teilbare Archetypkarte** | 7–8 | B2 | QG-V04, Pages-Vorschau |
| **V05** Karten, Legungen, Grimoire | 0.5 | Kartenvertiefung, Rollen-Legungen, Grimoire als Buch, Tagebuch | 7–8 | B3 | QG-V05, **geschlossener Test** |
| **V06** Zahlen und Symbole | 0.6 | Entdecken-Tab, Numerologie als **zweite Säule der Identität**, Engelszahlen, Symbol-Lexikon | 6–7 | B4 | QG-V06, Test-Update |
| **V07** Release 1.0 | 1.0 | weitere Teilen-Vorlagen, Erinnerung, **Sicherung und Wiederherstellung**, Edition (falls Billing freigegeben), Härtung (G3), Store (G4) | 7–8 | B5 | G3, G4 → **öffentlicher Release** |
| 1.1 | 1.1 | Mondphasen und Rituale | 3–4 | B6 | Update |
| 1.2 | 1.2 | erstes Premium-Deck, visueller PDF-Export, zwei Edition-Legungen, Mondreise, Sanfter Spiegel | 5–7 | B7 | Update |
| 1.3+ | – | spirituelle Themenreisen, weitere Decks, Traumtagebuch, Namenszahlen, Jahreskreis, virtuelle Talismane (Backlog), ggf. Kleine Arkana | offen | offen | nach Marktdaten (G5) |

**Summe bis 1.0: ≈ 31–37 Sitzungen** (nach den Ergänzungen R1–R7, §11). Bei etwa drei Sitzungen pro Woche plus Freigaben und Bildproduktion: **≈ 11–13 Wochen** bis zum öffentlichen Release. Größter Unsicherheitsfaktor: Textproduktion und Prüfung (≈ 1.500 Texte je Sprache).

## 1 · Reihenfolge und Begründung

Vorschlag aus dem Auftrag: V02 Tagesorakel · V03 Global Visual · V04 Spiritual Core · V05 Visual Excellence · V06 Esoteric Expansion · V07 Growth & Monetization.

| Änderung | Begründung |
|---|---|
| **V03 wird „Fundament und globales Designsystem“** statt reiner Gestaltung | Ein globaler Gestaltungspass mit neuen Hintergrundwelten würde Screens schmücken, die in V04/V05 funktional umgebaut werden. Doppelte Arbeit. V03 überträgt nur das V02-Designsystem (Farben, Typografie, Ornamente, Tab-Leiste, Panels) ohne neue Bilder auf alle Screens und legt die Technik für alles Weitere (Datenmodell v2, Module, Entitlements) |
| **Gestaltung pro Bereich im selben Paket wie die Funktion** | Onboarding und Profil werden in V04 neu gebaut, also kommen ihre Welten (A05, A06) und die Porträts (A07–A14) in V04. Orakel und Grimoire werden in V05 neu gebaut, also kommen A03, A04, A15 und die Vignetten dort |
| **„Visual Excellence“ entfällt als eigenes Paket** | Feinschliff ist Teil jedes Paket-Gates (Screenshot-Review, Kontrast, Perf). Was übrig bleibt, ist Härtung in V07 |
| **„Spiritual Core“ wird geteilt** in V04 (Identität, Reise) und V05 (Karten, Legungen, Grimoire) | ein Paket mit allem wäre zu groß für eine überprüfbare Freigabe (> 12 Sitzungen) |
| **„Esoteric Expansion“ wird V06 ohne Mond** | Mond ist ein natürlicher monatlicher Inhaltsstrom und das stärkste Argument für ein Update kurz nach dem Release (1.1) |
| **Geschlossener Test schon ab 0.5** | früher Marktkontakt. Bei neuen privaten Google-Play-Konten kann ein geschlossener Test mit Mindestanzahl an Testern über mehrere Wochen Pflicht vor dem Produktionszugang sein (prüfen, E17). Ab 0.5 lohnt sich der Test inhaltlich |
| **Monetarisierung ist kein eigenes Paket am Ende**, sondern ein Teil von V07, der den Release nie blockiert | Billing braucht Freigabe (E14, E15). Ohne Freigabe erscheint 1.0 kostenlos, die Edition folgt als 1.0.x |

## 2 · Release-Umfang 1.0 (erster öffentlicher Release)

### Gehört in 1.0

| System | Umfang in 1.0 |
|---|---|
| A Tagesritual | Tageskarte, Botschaft, Linse je Archetyp und Karte, wechselnde Reflexion und Ritual, Tagesenergien-Zeile (Tageszahl), ein Hinweis pro Tag, Meilenstein-Moment |
| B Reise | Reisetag aus allen Aktivitäten, Narrenreise (63 Stationen), Meilensteine bis 365, Sternkarte, Wochen- und Monatsrückblick |
| C Identität | Fragebogen v2 (7 Fragen), Haupt- und Ergänzungsarchetyp, „Warum?“, Enthüllung mit Porträt, Profil, Kapitel I–IV, „Ich“ mit zwei Säulen (Archetypen, Zahlen) |
| D Kartenvertiefung | 4 Stufen über Begegnungen **oder** Studium |
| E Grimoire | Buch mit 7 Kapiteln, Tagebuch, Suche, „Neu“-Markierung, Ex Libris, **lokale Sicherung und Wiederherstellung** |
| F Legungen | Klassisch, Licht und Schatten, Neuanfang, Rückblick (Free), Zwei Wege, Verbindung (Edition) |
| G Numerologie (zweite Säule) | Geburtsdatum freiwillig, Lebenszahl, Geburtstagszahl, persönliches Jahr/Monat/Tag, Lebenskarte, Archetyp und Zahl, Tagesresonanz, Jahreskarte und Jahreskapitel |
| H Engelszahlen, Symbole | Nachschlagen jeder Folge, 22 kuratierte, Begegnungen, Favoriten, 24 Symbole |
| J Teilen | Archetypkarte (schon ab V04) plus 4 Vorlagen (Tageskarte, Engelszahl/Symbol, Lebenszahl, Meilenstein/Ex Libris) |
| K Erinnerung | optional, lokal, ab Reisetag 3 angeboten |
| Edition | nur wenn E14/E15 freigegeben, sonst 1.0.x |

### Nicht in 1.0 (bewusst später)

Mondphasen und Mondrituale (1.1) · Premium-Decks, visueller PDF-Export, Innerer Konflikt, Lebensweg, Mondreise, Sanfter Spiegel (1.2) · Themenreisen, Traumtagebuch, Namenszahlen, Jahreskreis, virtuelle Talismane als kostenlose Entdeckung (1.3+, Backlog) · Kleine Arkana (nur bei Nachfrage) · Astrologie, Meditationen (Audio), Kristalle als Kaufempfehlung, Cloud-Sync, Konto (nicht geplant).

### Warum dieser Umfang trägt

Ein Release ohne Identität, Reise und Grimoire wäre „noch eine Tarot-App“. Ein Release mit allem (Mond, Decks, Abo) würde den Marktkontakt um 5–7 Wochen verschieben. 1.0 enthält die drei verbindenden Systeme (Identität, Reise, Grimoire) und zwei große Suchfelder (Numerologie, Engelszahlen). Das reicht für eine klare Store-Positionierung („dein persönliches Grimoire“) und für Teilbares.

## 3 · Pakete im Detail

Jedes Paket: Bulks in fester Reihenfolge, jeweils mit „Fertig, wenn“. Nach jedem Bulk: `npm run check`, betroffene E2E, `PROJECT_STATUS.md` und `DECISIONS.md` aktualisieren.

### V02 · Tagesorakel abschließen (läuft)

Läuft in einer eigenen Sitzung. Offen: Perf-Regression der Enthüllung (29 fps) und von „Heute sichtbar“ (+39 %), Vergleichsbilder, Emulator, Bericht. **Fertig, wenn** der Eigentümer den Tagesorakel-Screen freigibt und `design/visual-overhaul` nach `main` gemergt ist (nur nach ausdrücklicher Freigabe).

### V03 · Fundament und globales Designsystem (0.3)

**Ziel:** Alles, was die folgenden Pakete brauchen, einmal sauber legen. Alte Screens sehen danach zum V02-Screen passend aus, ohne neue Bilder.
**Abhängigkeiten:** V02 gemergt. **Bilder:** keine. **Inhalte:** keine neuen Texte außer UI-Schlüsseln.

| Bulk | Arbeit | Fertig, wenn |
|---|---|---|
| V03.1 Datenmodell v2 | Schema v2 (`journal`, `events`, `favorites`, `seen`, kv `personal`, kv `entitlements`), Validatoren mit Standardwerten, Migration v1 → v2 additiv und idempotent, `onversionchange`. **Sicherungsformat** (`BackupFile`, IA §5.7) als Typ, Serialisierer und Prüfer ohne UI, Klärung E19 | Upgrade-Test mit drei Fixtures (leer, voll, teilweise defekt) grün. Daten aus 0.2.0 bleiben bit-gleich lesbar. Löschen entfernt alle Stores (E2E). Roundtrip serialisieren → prüfen → einlesen auf Fixture-Daten identisch (Unit) |
| V03.2 Abgeleitete Schicht | `journeyDays` erweitert, `cardEncounters`, `milestonesReached` als reine Funktionen mit Clock-Injektion | Unit-Tests mit Randfällen (Zeitzone, Mitternacht, doppelte Tage, defekte Datensätze) grün. Keine Zähler gespeichert |
| V03.3 Content-Module | Aufteilung in Module, dynamischer Import je Sprache, Validator je Modul, Bundle-Report im Build | Start-JS ≤ 160 KB gzip. Validator meldet fehlende EN/DE-Texte je Modul. Offline-Build lädt alle Module ohne Netz (E2E im Flugmodus) |
| V03.4 Entitlements | `has(right)`, `CoreOnlyProvider`, `TestProvider` | Unit-Tests. Kein UI-Element liest Kaufstatus direkt (Lint-Regel oder Test) |
| V03.5 Globales Designsystem | V02-Bausteine (Panels, Überschriften mit Flanken, Tasten, Tab-Leiste, Ornamente, Nachtwelt A01 als neutraler Hintergrund) auf Orakel, Grimoire, Profil, Onboarding, Einstellungen | Screenshot-Review aller Screens 360/390/412 und Desktop. Mindestkontrast nach §6 für jeden Lesetext. Keine Überläufe. Absolute Perf-Grenzen nach §6 eingehalten; liegt die freigegebene V02-Version darüber, wird das hier behoben (zuerst unsichtbar, sichtbare Abstriche nur nach Rückfrage) |

**Aufwand:** 3–4 Sitzungen. **Gate QG-V03:** alle Fertig-Kriterien, `npm run check` und alle E2E grün, Android-Debug-Build startet und migriert einen 0.2.0-Datenbestand.

### V04 · Identität und Reise (0.4)

**Ziel:** Die App kennt den Menschen (Archetypen) und zeigt seinen Weg (Reise).
**Abhängigkeiten:** V03. **Bilder:** Bulk B2 (A05, A06, A07–A14, A19), Anfrage **jetzt** (siehe `ASSET_REQUESTS.md`). **Inhalte (je Sprache):** ≈ 520 Texte (Linsen 176, Fragebogen 15, Archetyp-Profile ≈ 150, Kapitel 40, Reise 96, Rückblick-Bausteine 40) plus UI-Schlüssel.

| Bulk | Arbeit | Fertig, wenn |
|---|---|---|
| V04.1 Fragebogen v2 | 7 Fragen, Punktmodell (+2/+1), Haupt- und Ergänzungsarchetyp (≥ 60 %), `questionnaireVersion` | Balance-Test über alle 16.384 Kombinationen: jeder Archetyp ist Haupt in 10–15 % der Fälle. Ergänzung in 40–70 %. Ablauf ≤ 75 s (E2E mit Zeitmessung bei 8 s pro Frage). Bestehende Profile bleiben gültig (Angebot zum Neubestimmen, kein Zwang, E9) |
| V04.2 Enthüllung und Profil | Porträt-Enthüllung (≤ 8 s, überspringbar, reduziert statisch), „Warum?“, ausführliches Profil, alle acht lesbar | Enthüllung ≥ 50 fps auf dem Referenz-Emulator. Reduzierte Bewegung ohne Animation (E2E). „Warum?“ entspricht der Rechnung (Snapshot) |
| V04.3 Heute erweitert | Linse je Archetyp × Karte, Ergänzungslinse jeden dritten Tag, Varianten-Indizes im Datensatz, Hinweis-Logik (A6) | Gespeicherte Tageskarten früherer Versionen zeigen weiter ihren alten Text (D-09). Höchstens ein Hinweis pro Tag (Unit) |
| V04.4 Narrenreise und Meilensteine | 63 Stationen, Wege, Meilensteintabelle, Meilenstein-Moment, „Neu“-Markierungen | Für Reisetage 1–400 liefert jeder Tag genau eine Station und die richtigen Meilensteine (Tabellen-Test). Kein Text enthält Druckwörter (Content-Gate) |
| V04.5 Sternkarte und Rückblicke | Sternkarte (SVG auf A19), Wochen- und Monatsrückblick aus eigenen Daten, Textalternative | Rückblick mit 0, 1 und 30 Einträgen ohne Lücken (Unit). Sternkarte mit 400 Tagen ≤ 16 ms pro Frame beim Scrollen. Liste als Alternative für Screenreader |
| V04.6 „Ich“ und Gestaltung | Profil wird „Ich“ (Layout mit zwei Säulen, Zahlen-Säule erscheint erst in V06), Welten A05/A06 in Onboarding, Enthüllung, Ich | Screenshot-Review. Erste Sitzung bis zur Karte ≤ 90 s (E2E-Pfad). Bildbudget ≤ 600 KB je Screen |
| V04.7 Teilen-Kern und Archetypkarte | Canvas-Renderer mit eingebetteten Schriften, `ShareModel`-Typen, System-Teilen (Web Share mit Datei, Capacitor Share, Download als Ersatz, E20), Vorlage J2 (Porträt, Name, Essenz, 3 Stärken) in Story 1080 × 1920 und Feed 1080 × 1350, Einstieg aus Enthüllung und „Ich“ | Export ≤ 1,5 s auf dem Referenz-Emulator. Ein `ShareModel` kann Antworten, Scores und Notizen nicht enthalten (Typ-Test). Bildvergleichstest. Branding ≤ 6 % der Fläche, Text ≥ 4,5:1. Funktioniert offline |

**Aufwand:** 7–8 Sitzungen (davon ≈ 2 für Texte, 1 für den Teilen-Kern). Ehrlich: 0.4 läuft nur in der Pages-Vorschau. Die Archetypkarte bringt früh Rückmeldung zur Wirkung; organisches Wachstum beginnt mit dem geschlossenen Test und 1.0, der Teilen-Kern ist dann schon erprobt. **Gate QG-V04:** Fertig-Kriterien, Textprüfung der Schaufenster-Texte durch den Eigentümer, Perf-Budgets, Pages-Vorschau aktualisiert.

### V05 · Karten, Legungen, Grimoire (0.5 → geschlossener Test)

**Ziel:** Tiefe. Jede Handlung hinterlässt eine Spur im Buch.
**Abhängigkeiten:** V04 (Reise, Kapitel I–IV). **Bilder:** Bulk B3 (A03, A04, A15, A20, A21, A23–A29, A30). **Inhalte:** ≈ 390 Texte (Kartentiefe 330, Legungen ≈ 40, Kapitel- und Systemtexte).

| Bulk | Arbeit | Fertig, wenn |
|---|---|---|
| V05.1 Kartenseite und Vertiefung | Kartenseite mit 4 Ebenen, Stufen über Begegnungen oder Studium, Mondphasen-Symbol als Stufe | Jede Stufe in ≤ 2 Studien-Sitzungen erreichbar, ohne Zufall (Unit). Ungespeicherte Legungen zählen nicht, mehrere am Tag = ein Tag (Unit) |
| V05.2 Rollen-Legungen | Legungs-Engine mit Rollen R1–R8, Licht und Schatten, Neuanfang, Rückblick-Legung. Zwei Wege und Verbindung gebaut, aber nur mit `edition.spreads` sichtbar | Matrix-Test: jede Kartenkombination jeder Legung ergibt vollständigen Text in DE/EN. Kein Positionsname verspricht Zukunft (Content-Gate). Alte Readings werden unverändert angezeigt |
| V05.3 Grimoire als Buch | Einband (A15), Inhaltsverzeichnis, 7 Kapitel mit Vignetten, Pergament (A30), Leerzustände, „Neu“-Glanz | jeder gespeicherte Eintrag in ≤ 3 Taps auffindbar (E2E). Jedes Kapitel hat einen gestalteten Leerzustand (Screenshot-Review) |
| V05.4 Tagebuch und Suche | Tagebuch mit Filtern, Notizen aus Tageskarte und Legung zusammen mit `journal`, lokale Suche | Suche über 1.000 Einträge ≤ 50 ms. Einzelne Einträge löschbar (E2E) |
| V05.5 Kartenrücken | Auswahl in Einstellungen, Freischaltung über Meilensteine 14 und 75 | Rücken wechselt in Heute und Orakel. Nicht freigeschaltete Rücken erscheinen nicht als Kaufangebot |
| V05.6 Orakel-Gestaltung und Testpaket | A03 im Orakel, Release-Build mit Testsignatur, Testanleitung, App-ID final (E11) | geschlossener Test kann starten (Freigabe E11, E17) |

**Aufwand:** 7–8 Sitzungen. **Gate QG-V05:** Fertig-Kriterien, alle Perf-Budgets, TalkBack-Grundcheck, Version 0.5 im geschlossenen Test (nur nach Freigabe).

### V06 · Zahlen und Symbole (0.6)

**Ziel:** Zwei Wissenswelten mit großem Suchvolumen, verbunden mit Identität und Tagesritual.
**Abhängigkeiten:** V03 (Module, `personal`), V05 (Tagebuch, Grimoire-Kapitel). **Bilder:** Bulk B4 (A32, A33). **Inhalte:** ≈ 500 Texte (Numerologie ≈ 190, Brücken der zweiten Säule ≈ 30, Engelszahlen 160, Symbole 120).

| Bulk | Arbeit | Fertig, wenn |
|---|---|---|
| V06.1 Entdecken-Tab | fünfte Navigationsposition (E8), Hub mit Suche, Routen | 5 Tabs lesbar auf 360 px mit Label (Screenshot), Android-Zurück korrekt (E2E) |
| V06.2 Numerologie | Geburtsdatum (freiwillig, einzeln löschbar), Rechenfunktionen, Rechenweg, Zahlseiten, Tageszahl in Heute | ≥ 20 Testvektoren inkl. 15.07.1990 → 5, 29.11.1987 → 11, 22.04.1996 → 33, 29.02., Jahreswechsel, drei Zeitzonen. Rechenweg = Funktion (Snapshot). Geburtsdatum in keinem Share-Modell (Typ-Test) |
| V06.3 Engelszahlen | Eingabe (Ziffern, `hh:mm`), 22 kuratierte, zusammengesetzte Deutung, Begegnung festhalten, Favoriten | Property-Test: jede Eingabe aus 1–6 Ziffern oder `hh:mm` liefert eine Deutung. Begegnung zählt als Reisetag (Unit) |
| V06.4 Symbol-Lexikon | 24 Symbole, Verweise auf Karten, Entdeckung über Stufe 3 und Meilensteine | alle Verweise gültig (Validator). Nachschlagen nie gesperrt (E2E) |
| V06.5 Gestaltung | A32 als Welt, A33 Symbolbilder (oder SVG-Ersatz), Medaillon für Zahlen in Code | Screenshot-Review, Bildbudget, Kontrast |
| V06.6 Zweite Säule verbinden | „Ich“ mit Zahlen-Säule, Lebenskarte (G9), Archetyp und Zahl (G10), Tagesresonanz in „Heute“ (G11), Jahreskarte und Jahreskapitel im Grimoire (G12), Einladung zum Geburtsdatum (G13), Teilen-Vorlage Lebenszahl (J4) | Ohne Geburtsdatum keine Lücke, sondern eine Einladung (E2E). Lebenskarte für alle 12 Lebenszahlen korrekt (Unit). Höchstens ein Hinweis pro Tag bleibt erhalten (Unit). Geburtsdatum in keinem Share-Modell (Typ-Test) |

**Aufwand:** 6–7 Sitzungen. **Gate QG-V06:** Fertig-Kriterien, Test-Update an den geschlossenen Test (nach Freigabe).

### V07 · Release 1.0

**Ziel:** Veröffentlichungsreif, teilbar, ehrlich gehärtet.
**Abhängigkeiten:** V06 und mindestens 2 Wochen Rückmeldungen aus dem geschlossenen Test. **Bilder:** Bulk B5 (A18, A22, A31 nur mit Billing). **Inhalte:** ≈ 130 Texte (Teilen, Erinnerung, Sicherung, Edition, Store-Texte, Datenschutzerklärung).

| Bulk | Arbeit | Fertig, wenn |
|---|---|---|
| V07.1 Teilen (weitere Vorlagen) | J1 Tageskarte, J3 Engelszahl/Symbol, J5 Meilenstein/Ex Libris auf dem Kern aus V04.7 (J4 kommt mit V06.6) | Export ≤ 1,5 s auf dem Referenz-Emulator. Kein Share-Modell erreicht Notizen, Antworten oder Geburtsdatum (Typ-Test). Bildvergleichstest |
| V07.2 Erinnerung | lokale Benachrichtigung, Angebot ab Reisetag 3, Uhrzeit wählbar, Android-13-Berechtigung (E13) | Ablehnen wird nie erneut gefragt (E2E). Text ohne Druckwörter. Abschalten in Einstellungen wirkt sofort |
| V07.3 Sicherung und Wiederherstellung | UI unter Ich › Einstellungen, Erstellen mit Vorschau, Prüfen, Ersetzen in einer Transaktion, Hinweis nach je 30 Reisetagen ohne Sicherung (`INFORMATION_ARCHITECTURE.md` §5.7, Format aus V03.1) | Roundtrip sichern → löschen → wiederherstellen identisch (E2E). Sicherungen aus 0.2.0 und 0.4 werden migriert. Neuere Sicherung wird ohne Änderung abgelehnt. 1.000 Einträge ≤ 2 s / ≤ 3 s. Emulator: Datei speichern und wieder einlesen. Kann bei Bedarf als Zusatz in 0.5 vorgezogen werden, falls Testnutzer neu installieren müssen |
| V07.4 Edition (nur mit Freigabe E14/E15) | Edition-Inhalte, Play-Billing-Plugin, Kauf, Wiederherstellen, Edition-Seite | Kauf, Erstattung, offline und Wiederherstellen getestet mit Lizenztestern. Ohne Billing sind Edition-Inhalte unsichtbar (E2E) |
| V07.5 Härtung (G3) | Q01–Q16-Matrix, TalkBack, Zeitzonen, Upgrade 0.2 → 1.0, Kaltstart, Release-Build, Lizenzliste | alle Punkte des bisherigen G3 PASS oder begründet NOT RUN |
| V07.6 Store (G4) | Name, Icon, Store-Texte DE/EN, Screenshots, Datenschutzerklärung, Inhaltsbewertung, Data-Safety-Angaben | Eigentümer gibt Store-Eintrag und Veröffentlichung ausdrücklich frei |

**Aufwand:** 7–8 Sitzungen (ohne Billing 5–6). **Gate:** G3 (Agent), G4 (Eigentümer).

## 4 · Nach dem Release

| Version | Inhalt | Abhängigkeit | Aufwand | Bilder |
|---|---|---|---|---|
| **1.1 Mond** | Mondphase (Meeus), Kalender, Deutung, Neumond-Intention, Vollmond-Reflexion, 12 Rituale (6 Edition), Mond in Heute, Teilen J6 | 1.0 | 3–4 | B6: A34 Mondwelt |
| **1.2** | erstes Premium-Deck (Einzelkauf), visueller PDF-Export (E6), Innerer Konflikt und Lebensweg (Edition), Mondreise (E16), Sanfter Spiegel | 1.1, Billing | 5–7 | B7: Deck (23 Bilder), Anfrage erst nach Entscheidung |
| **1.3+** | spirituelle Themenreisen (Einzelkauf, Edition-Erweiterung oder Abo), weitere Premium-Decks als Serie, Traumtagebuch mit Symbolen, Namenszahlen (E12), Jahreskreis (8 Feste), virtuelle Talismane und Sammelobjekte als **kostenlose** Entdeckung (Backlog: keine Zufallsziehung, keine Lootbox, keine virtuelle Währung). Kleine Arkana nur bei klarer Nachfrage | Marktdaten (G5) | offen | offen |

**G5 · Marktvalidierung** (Eigentümer): 90 Tage nach 1.0. Grundlage: Play-Console-Zahlen (`MONETIZATION_CONCEPT.md` §6). Entscheidet über Abo, Decks, Kleine Arkana.

## 5 · Bilder je Paket (Bulks)

Angefordert wird **immer nur der nächste Bulk**. Details, Prompts und Abnahmekriterien in `docs/visual/ASSET_REQUESTS.md`.

| Bulk | Paket | Assets | Anzahl | Status |
|---|---|---|---|---|
| B1 | V02 | A01 Nachtwelt, A02 Pflanzenecken | 2 | geliefert |
| **B2** | V04 | A05 Ich/Enthüllung, A06 Willkommen, A07–A14 Archetyp-Porträts, A19 Sternkarte | 11 | **jetzt anfordern** |
| B3 | V05 | A03 Orakel, A04 Grimoire, A15 Buch, A20/A21 Kartenrücken, A23–A29 Kapitel-Vignetten (ein Sheet), A30 Pergament | 13 (12 Dateien) | nach QG-V04 |
| B4 | V06 | A32 Entdecken-Welt, A33 Symbole (2 Sheets à 12) | 3 Dateien | nach QG-V05 |
| B5 | V07 | A18 Store-Grafik, A22 Kartenrücken „Goldenes Rad“, A31 Edition-Rücken (nur mit Billing) | 2–3 | nach QG-V06 |
| B6 | 1.1 | A34 Mondwelt | 1 | nach 1.0 |
| B7 | 1.2 | Zusatzdeck | 23 | nach Entscheidung |
| zurückgestellt | – | A16 Dekor-Sheet (nur falls ein Screen es braucht), A17 figurative Ersatzkarten (E3) | – | – |

**Bewertung des Bildbedarfs:** ≈ 32 neue Bilddateien bis 1.0 (plus 2 vorhanden). Das ist bewusst klein: Zahlen, Engelszahlen, Medaillons, Monde, Sternbilder, Ornamente und Stufen-Symbole entstehen als SVG/CSS im Code.

## 6 · Qualitäts-Gates und Budgets

### Gilt für jedes Paket-Gate (QG-Vxx)

| Prüfung | Grenze | Werkzeug |
|---|---|---|
| Statische Prüfung, Unit, Content-Validator | grün | `npm run check` |
| E2E | grün, neue Abläufe mit eigenen Tests | Playwright |
| Leistung | alle absoluten Obergrenzen der Tabelle „Leistungsbudgets“ unten; Schrittgrenze je Paket begründet | `scripts/perf.mjs`, Build-Report, Emulator |
| Inhalt je Modul und Sprache | ≤ 40 KB gzip | Build-Report |
| **Mindestkontrast** | **jeder** relevante Lesetext (Botschaft, Fließtext, Listen, Labels, Tab-Beschriftung, Hinweise) ≥ 4,5:1 als Mindestwert: gemessen gegen den hellsten 5-%-Anteil der Hintergrundpixel unter der Schrift (p95), nicht im Mittel. Große Schrift (≥ 24 px, oder ≥ 18,7 px fett), Icons und Ränder von Bedienelementen ≥ 3:1. Der Median wird nur zusätzlich berichtet | Kontrastskript (aus `scripts/today-showcase.mjs --contrast`, auf alle Screens erweitert) |
| Layout | keine Überläufe bei 360/390/412 und Desktop, große Schrift (130 %) | Showcase-Skripte |
| Reduzierte Bewegung | keine Bewegung außer Überblenden | E2E |
| DE/EN | vollständig, keine Kürzungen in der UI | Validator, Screenshot-Review |
| Android | Debug-Build startet, Kernpfad auf dem Emulator | Emulator |
| Datenschutz | keine neuen Netzwerkanfragen zur Laufzeit, keine privaten Felder in Share-Modellen | Netzwerk-Log im E2E, Typ-Test |
| Bericht | PASS/FAIL/BLOCKED/NOT RUN ehrlich, Screenshots, Status und Entscheidungen aktualisiert | – |

### Leistungsbudgets (feste Referenzbasis und absolute Obergrenzen)

**Referenzbedingungen** (wie `docs/visual/PERFORMANCE.md`): Playwright-Chromium headless, 412 × 915 bei 2× Pixeldichte, de-DE, CPU 4× gedrosselt, Netz 40 ms / 10 Mbit/s, Cache aus, Median aus 5 Läufen.

**Feste Referenzbasis:** `main` @ `03abb3c` (Version 0.2.0 mit Deck v2, vor dem Visual Overhaul), Rohdaten `docs/visual/perf/baseline-main-03abb3c.json`. Sie bleibt bis 1.0 unverändert, damit sich kleine Verschlechterungen von Paket zu Paket nicht aufsummieren. Bei belastetem Rechner wird sie im selben Lauf abwechselnd mitgemessen und jeder Wert auf sie normiert (Messwert × Referenzwert ÷ Referenz-Messwert desselben Laufs).

| Kennzahl | Referenz | Absolute Obergrenze (Gate) | Schrittgrenze je Paket |
|---|---|---|---|
| Erststart sichtbar | 1.327 ms | ≤ 1.600 ms (Referenz + 20 %) | ≤ +10 % |
| „Heute“ sichtbar | 996 ms | ≤ 1.250 ms (Referenz + 25 %) | ≤ +10 % |
| „Heute“ FCP | 496 ms | ≤ 900 ms | – |
| „Heute“ LCP | 896 ms | ≤ 1.400 ms | ≤ +10 % |
| Übertragung je Screen | 536 KB | ≤ 900 KB, davon Bilder ≤ 600 KB | – |
| Start-JS (gzip) | 132 KB | ≤ 160 KB | ≤ +8 KB |
| Enthüllung und Übergänge | 56 fps, 1 Ruckler | ≥ 50 fps, ≤ 2 Ruckler über 50 ms, schlechtester Frame ≤ 120 ms | – |
| Leerlauf | 0 | 0 laufende Animationen 12 s nach der Enthüllung | – |
| Android-Kaltstart (Emulator, ruhiger Rechner) | 2,4 s | ≤ 3,0 s | – |
| Android-APK | wird in V03 gemessen | ≤ 25 MB | – |

Regeln:

- Eine **absolute Obergrenze** überschritten → Gate **FAIL**, kein Weiter ohne Behebung oder ausdrückliche Ausnahme des Eigentümers.
- Die **Schrittgrenze** (gegenüber der zuletzt freigegebenen Version) überschritten → im Bericht begründen, Eigentümer entscheidet. Sie fängt Verschlechterungen früh ab, ersetzt aber nicht die absoluten Grenzen.
- Zuerst unsichtbare Optimierungen. Sichtbare Abstriche (weniger Effekte, schwächere Bilder) nur nach Rückfrage mit den Optionen und ihrer Wirkung.
- Einmal sauber messen (abwechselnd gegen die Referenz), dann entscheiden. Keine endlosen Messschleifen.
- V02 wird mit seinem vereinbarten Gate abgeschlossen. Ab QG-V03 gelten diese Grenzen; liegt die freigegebene V02-Version darüber, wird das in V03.5 behoben.

### Versionen

| Version | Kanal | Zweck |
|---|---|---|
| 0.2 | Pages-Vorschau | Tagesorakel |
| 0.3 | intern | Fundament |
| 0.4 | Pages-Vorschau | Identität und Reise am Handy prüfen |
| 0.5 | geschlossener Test (Play) | erste echte Nutzer |
| 0.6 | geschlossener Test | Zahlen und Symbole |
| 1.0 | öffentlich | Release |

## 7 · Testkonzept

| Ebene | Inhalt |
|---|---|
| Unit | reine Ableitungen (Reise, Stufen, Meilensteine, Rückblick), Numerologie-Vektoren, Engelszahl-Komposition, Fragebogen-Balance, Entitlements, Migration |
| Property | Engelszahl-Eingaben, Reisetage 1–1.000, Legungs-Matrix |
| Content | Vollständigkeit, Längen, Verbotslisten, Anfangs-Duplikate, Referenzen |
| Snapshot | Rechenweg, „Warum?“, Share-Bilder (Bildvergleich) |
| E2E (Browser) | erste Sitzung, Tagesritual, Legungen, Grimoire-Wege, Entdecken, Löschen, Offline, Migration |
| Emulator | Kernpfad, Zurück-Taste, Benachrichtigung, Teilen, TalkBack-Stichprobe |
| Perf | A/B gegen letzte Basis, gleiche Last, abwechselnde Läufe |
| Manuell (Eigentümer) | Schaufenster-Texte, Screenshot-Review, Handy über Pages |

## 8 · Technische Risiken

| Risiko | Wirkung | Gegenmaßnahme |
|---|---|---|
| **Textmenge** (≈ 1.500 je Sprache) | Verzögerung, Qualitätsabfall, Wiederholungen | Rollen statt Legungstexte, Rückblicke aus Daten, Produktion je Paket, Validator für Wiederholungen, Stichprobenprüfung, E18 |
| **Performance** durch Bildwelten und Effekte (V02 zeigte +39 %) | Ruckeln auf Mittelklasse-Geräten | Budgets je Gate, A/B gegen Basis, Bilder außerhalb des kritischen Pfads, Effekte ohne große Filter |
| **Bundle-Wachstum** | langsamer Start | Content-Module mit Lazy Loading, Budget im Build |
| **IndexedDB-Migration** | Datenverlust | nur additive Upgrades, Fixtures, keine Umschreibungen, defekte Datensätze überspringen |
| **Zeitzonen und Datumsgrenzen** | falsche Tageskarte, falsche Zahlen | `dateKey` lokal, Clock-Injektion, Tests in drei Zeitzonen |
| **Fünf Tabs auf 360 px** | gedrängte Navigation | Label ≤ 9 Zeichen, Screenshot-Test, Alternative in E8 |
| **Bildstil-Drift** zwischen Bulks | uneinheitliche Welt | gemeinsamer Stilblock in jedem Prompt, Referenzbild A01 bei jeder Anfrage, Abnahmekriterien |
| **Billing ohne Server** | Manipulation | bewusst akzeptiert (Preis < 10 €), lokale Signaturprüfung |
| **Play-Anforderungen** (Testpflicht, Adresse, Data Safety) | Release verzögert sich | geschlossener Test ab 0.5, Checkliste in `MONETIZATION_CONCEPT.md` §4 früh klären |
| **Benachrichtigungen auf Android 13+** | Berechtigung abgelehnt | Angebot erst ab Tag 3, App funktioniert vollständig ohne |
| **Deutungsanspruch** (Zahlen, Engel) | Beschwerden, Store-Richtlinien | „symbolische Deutung“ auf jeder Seite, Verbotslisten, keine Vorhersagen |

## 9 · Offene Entscheidungen

| # | Frage | Empfehlung | gebraucht vor |
|---|---|---|---|
| E8 | Fünf Tabs mit „Entdecken“ ab V06 | ja | V06 |
| E9 | Fragebogen v2 (7 Fragen) für Bestandsnutzer: Angebot zum Neubestimmen statt Zwang | Angebot, Profil bleibt | V04 |
| E10 | Kartenrücken als Meilenstein-Belohnung (A20–A22) | ja | V05 |
| E11 | Finaler App-Name und App-ID (lässt sich nach dem ersten Play-Upload nicht mehr ändern) | vor dem geschlossenen Test festlegen | V05.6 |
| E12 | Namenszahlen erst ab 1.3 | ja | – |
| E13 | Lokale Benachrichtigungen über das offizielle Capacitor-Plugin (Projektabhängigkeit, kostenlos, ohne Dienst) | ja | V07 |
| E14 | Billing für 1.0 und Technik Option A (eigenes Plugin mit Play Billing) | Entscheidung bis V06 | V07 |
| E15 | Play-Konto, Händlerprofil, öffentliche Adresse, Datenschutzerklärung, steuerliche Klärung | früh klären | V05.6 / V07 |
| E16 | Abo erst nach 1.1, nur mit Inhaltsstrom | ja | nach 1.1 |
| E17 | Geschlossener Test: Kanal, Testergruppe (ggf. Mindestanzahl und Dauer für neue Konten prüfen) | ab 0.5 | V05.6 |
| E18 | Menschliches Lektorat vor 1.0 (Kosten) oder Prüfung durch den Eigentümer | mindestens Schaufenster-Texte durch Lektorat | V07 |
| E19 | Sicherung auf Android: Datei über System-Teilen und Datei-Auswahl, oder zusätzlich das offizielle Capacitor-Dateisystem-Plugin (Projektabhängigkeit, kostenlos, ohne Dienst). Visueller PDF-Export später Free oder Edition | Teilen/Auswahl zuerst, Plugin nur wenn nötig; PDF-Export Free | V03.1 |
| E20 | Teilen auf Android über das offizielle Capacitor-Share-Plugin (Projektabhängigkeit, kostenlos, ohne Dienst) | ja | V04 |

## 10 · Nächste Schritte

1. **V02 abschließen** (läuft): Perf-Regression behoben (Commit `198130c`), restliche Grenzfälle und Abnahmetests, Pull Request nach `main`, Merge erst nach ausdrücklicher Freigabe, dann Tag `v0.2.1` (D-40).
2. **Bulk B2 anfordern** (parallel, damit die Bilder zu V04 bereitliegen): A05, A06, A07–A14, A19. Die Porträts werden in V04 auch für die teilbare Archetypkarte gebraucht.
3. **V03 freigeben und umsetzen** (keine Bilder nötig) auf dem neuen Branch `feature/v03-fundament` vom Tag `v0.2.1`.
4. Entscheidungen E8, E9 und E20 vor V04 bestätigen, E19 in V03.1 klären.

## 11 · Ergänzungen nach der Freigabe (26.11.2026)

Der Eigentümer hat den Masterplan nach unabhängiger Prüfung grundsätzlich freigegeben, mit folgenden Ergänzungen. Paketstruktur und alle Qualitäts-Gates bleiben bestehen; der Aufwand bis 1.0 steigt um ≈ 2–3 Sitzungen.

| # | Ergänzung | umgesetzt in |
|---|---|---|
| R1 | Leistungsbudgets gegen eine feste Referenzbasis und mit absoluten Obergrenzen, nicht nur +25 % zur Vorversion | §6 „Leistungsbudgets“, `INFORMATION_ARCHITECTURE.md` §7 |
| R2 | Mindestkontrast für jeden relevanten Lesetext, nicht nur im Median | §6 „Mindestkontrast“, V03.5 |
| R3 | Lokale Sicherung und Wiederherstellung spätestens für 1.0, unabhängig vom späteren PDF-Export | V03.1 (Format), V07.3 (UI), `INFORMATION_ARCHITECTURE.md` §5.7, `PRODUCT_SYSTEMS.md` E5/E6 |
| R4 | Teilbare Archetypkarte schon in V04 | V04.7, `PRODUCT_SYSTEMS.md` C11 und J2 |
| R5 | Numerologie als zweite Säule der Identität, eng verbunden mit Archetypen, Tagesorakel und Grimoire | V06.6, `PRODUCT_SYSTEMS.md` C10 und G9–G13, `PRODUCT_VISION_V2.md` §2 und §5 |
| R6 | Virtuelle Talismane und Sammelobjekte nicht streichen, sondern als kostenlose spätere Entdeckung im Backlog; keine Lootboxen, keine virtuelle Währung | §4 (1.3+), `PRODUCT_VISION_V2.md` §5, `PRODUCT_SYSTEMS.md` K, `docs/BACKLOG.md` |
| R7 | Premium-Decks und spirituelle Themenreisen als langfristige Monetarisierung | `MONETIZATION_CONCEPT.md` §2.4, §4 (1.2, 1.3+), `PRODUCT_SYSTEMS.md` K |
