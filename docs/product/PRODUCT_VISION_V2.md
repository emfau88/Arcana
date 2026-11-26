# PRODUCT_VISION_V2 · ARCANA als persönliche spirituelle Erlebniswelt

**Stand:** 26.11.2026 · **Status:** vom Eigentümer freigegeben (26.11.2026) mit Ergänzungen R1–R7 (siehe `MASTER_ROADMAP_V2.md` §11), Entscheidungen E8–E20 offen (siehe `MASTER_ROADMAP_V2.md` §9) · **Ersetzt:** den Produktumfang aus `docs/briefing/02_PRODUCT_SPEC.md` (P0/P1/P2-Liste). Die Regeln des Briefings gelten weiter (Isolation, Offline-Kern, keine Runtime-KI, kein Tracking, keine Vorhersage- oder Diagnosebehauptung).

Zugehörige Dokumente: `PRODUCT_SYSTEMS.md` (Funktionen A–K), `PROGRESSION_DESIGN.md` (Reise und Vertiefung), `CONTENT_MASTERPLAN.md` (Inhalte und Mengen), `INFORMATION_ARCHITECTURE.md` (Navigation und Datenmodell), `MONETIZATION_CONCEPT.md`, `MASTER_ROADMAP_V2.md` (Pakete, Aufwand, Release-Umfang), `docs/visual/ASSET_REQUESTS.md` (Bilder).

## 1 · Vision in einem Satz

**ARCANA ist ein persönliches Grimoire, das mit dir wächst.** Tarot ist die Tür. Dahinter liegen deine Archetypen, deine Zahlen, deine Symbole und eine Reise, die jeden Tag, an dem du wiederkommst, eine Seite weiterschreibt.

Nutzenversprechen für den Store (Arbeitsfassung): *„Ziehe deine Tageskarte, entdecke deinen spirituellen Archetyp und deine Lebenszahl und schreibe dein eigenes Grimoire, offline und ohne Konto.“*

## 2 · Was sich gegenüber V1 ändert

| Thema | V1 (Briefing, G2-Stand) | V2 (diese Vision) |
|---|---|---|
| Kern | Tageskarte, 3-Karten-Orakel, Sammlung 22 Karten, 8 Archetypen | dieselben Bausteine, aber als **ein verbundenes System**: jede Handlung hinterlässt eine Spur im Grimoire und auf der Reise |
| Langzeitmotivation | Sammlung ist nach wenigen Readings komplett | Reise ohne Ende (Tage mit Nutzung), 4 Vertiefungsstufen je Karte, Rückblicke aus eigenen Daten |
| Identität | 1 Archetyp aus 4 Fragen | **zwei Säulen:** Archetypen (Haupt- und Ergänzungsarchetyp aus 7 Fragen, Profile, Porträts) und Zahlen (Lebenszahl, Geburtstagszahl, persönliches Jahr). Beide sind nachvollziehbar hergeleitet und eng mit Tagesorakel und Grimoire verbunden |
| Themenwelten | nur Tarot | Tarot + Zahlen (Numerologie, Engelszahlen) + Symbole, danach Mond und Rituale |
| Grimoire | Raster und Verlauf | ein Buch mit Kapiteln, das sichtbar dicker wird |
| Wachstum | keines | teilbare Bilder (Archetypkarte schon ab V04), ASO über drei starke Suchfelder (Tarot, Numerologie, Engelszahlen) |
| Geld | P0 kostenlos, nur Schnittstelle | kostenloser, vollständiger Kern plus einmalige „Edition“; langfristig Premium-Decks und spirituelle Themenreisen; Abo erst bei echtem Inhaltsstrom |
| Daten | nur „Alle Daten löschen“ | zusätzlich lokale **Sicherung und Wiederherstellung** als Datei (spätestens 1.0), unabhängig vom späteren PDF-Export |

## 3 · Zielgruppe und Positionierung

**Primär (Hypothese):** Erwachsene, überwiegend Frauen von etwa 18 bis 45, mit Interesse an Tarot, Spiritualität und Selbstreflexion. Sie nutzen bereits Horoskop-, Tarot- oder Engelszahlen-Apps und vermissen Tiefe, Schönheit und Privatsphäre.

**Positionierung gegen den Markt:** Fast jede Einzelfunktion gibt es schon. Viele Konkurrenten sind laut, werbefinanziert, kontopflichtig oder nach dem ersten Tag hinter einer Paywall. ARCANA setzt dagegen auf vier Punkte:

1. **Wertigkeit:** gemalte Welt, Gold, Licht. Wirkt wie ein Buch, nicht wie ein Dashboard (Mockup und V02 sind verbindlich).
2. **Persönlich und nachvollziehbar:** Das Profil entsteht sichtbar aus den eigenen Antworten, Zahlen werden transparent berechnet, nichts ist vorgetäuschte Diagnose.
3. **Wachsend ohne Druck:** keine Streaks, keine Verluste, keine künstliche Verknappung. Wer wiederkommt, bekommt mehr. Wer pausiert, verliert nichts.
4. **Privat:** offline, ohne Konto, ohne Tracking. Das kann im Store als „Keine Daten erfasst“ belegt werden und ist ein echtes Verkaufsargument.

## 4 · Leitplanken (gelten für jede neue Funktion)

| # | Regel | Prüfbar durch |
|---|---|---|
| L1 | **Ein System, keine Werkzeugsammlung.** Jede Funktion schreibt in mindestens eines der drei gemeinsamen Systeme: Grimoire, Reise oder Identität. Sonst wird sie nicht gebaut | Funktionsspezifikation nennt die Verbindung (`PRODUCT_SYSTEMS.md`, Spalte „schreibt in“) |
| L2 | **Tage öffnen den Pfad, Tätigkeiten vertiefen den Inhalt.** Der Reisefortschritt zählt nur Tage mit Nutzung. Freiwillige Tätigkeiten (Reflexion, Studium, Ritual) vertiefen Karten, Archetypen und Zahlen, beschleunigen die Reise aber nicht | Unit-Tests der Ableitungen |
| L3 | **Keine Strafe, keine Verknappung, keine Lootbox.** Keine Streak-Verluste, keine Tageslimits für Legungen, keine Zufallsbelohnungen, keine Schuld-Texte | Content-Gate (verbotene Formulierungen), Review |
| L4 | **Symbolisch, nie prophetisch.** Keine Vorhersagen, keine Aussagen über Gedanken anderer, keine Heil- oder Finanzversprechen, keine „objektiven Engelsbotschaften“ | Content-Gate je Modul |
| L5 | **Astronomie und Deutung getrennt.** Messbares (Mondphase, Datum, Rechenweg) wird sachlich angezeigt, die Deutung als Deutung gekennzeichnet | UI-Review, Texte |
| L6 | **Privat bleibt privat.** Geburtsdatum, Notizen und Antworten verlassen das Gerät nie und erscheinen nie in geteilten Bildern | Typ-getrennte Share-Modelle, Tests |
| L7 | **Ruhe statt Überladung.** Pro Screen eine Hauptaktion, neue Welten werden nacheinander vorgestellt (nicht freigeschaltet) | Screen-Contract, Usability-Test |
| L8 | **Wiederverwendbare Struktur vor neuer Struktur.** Neue Inhalte nutzen vorhandene Bausteine (Rollen, Facetten, Kapitel, Share-Vorlagen). Neue Bildserien nur, wenn ein Code-Ornament es nicht leisten kann | Asset-Plan, Review |

## 5 · Kritische Bewertung der erweiterten Vision

**Insgesamt:** Die Richtung ist richtig und wirtschaftlich klüger als V1. Die 22-Karten-Sammlung allein trägt keine Monate. Identität, Zahlen und eine wachsende Reise geben Gründe zum Wiederkommen und zum Teilen. Engelszahlen und Numerologie sind zudem eigene, große Suchfelder im Store. Das größte Risiko ist nicht die Technik, sondern **Breite ohne Tiefe**: elf Systeme mit dünnem Inhalt wirken wie ein „Esoterik-Supermarkt“, das Gegenteil der Positionierung.

### Was ich übernehme und für besonders wertvoll halte

| System | Warum |
|---|---|
| **E Grimoire als Buch** | stärkstes Alleinstellungsmerkmal. Macht jede andere Funktion wertvoller, weil sie dort eine Spur hinterlässt |
| **B Reise ohne Streaks** | Bindung ohne Manipulation. Ehrlich kommunizierbar, bereits in V02 begonnen |
| **C Archetypen ausbauen** | emotionaler Kern, teilbar („Ich bin die Wandernde“), wichtigster Moment im Onboarding |
| **D Kartenvertiefung** | löst das Problem „nach einem Abend alles gesammelt“ |
| **G Numerologie (Geburtsdatum)** | **zweite Säule der Identität** neben den Archetypen: Lebenszahl und Lebenskarte, Resonanz mit dem Archetyp, persönliche Tageszahl im Tagesorakel, Jahreskapitel im Grimoire. Lokal berechenbar, wenig Bildbedarf, großes Suchvolumen |
| **H Engelszahlen** | sehr hohes Suchvolumen, billig im Inhalt, ideal teilbar |
| **J Teilen** | einziger organischer Wachstumshebel ohne Werbebudget |

### Was ich ändere (bessere Alternative)

| Vorschlag aus dem Auftrag | Problem | Alternative |
|---|---|---|
| Legung „Tagesimpuls“ | doppelt zum Tagesorakel | gestrichen. Das Tagesorakel ist der Tagesimpuls |
| Legungen „Liebe“, „Beruf“ als eigene Legungen | das sind Themen, keine Strukturen. Neue Namen über derselben Funktion | 6 Themen bleiben Filter. Neue Legungen unterscheiden sich in der **Struktur** (Rollen der Positionen): Licht und Schatten, Zwei Wege, Verbindung, Innerer Konflikt, Neuanfang, Lebensweg, Rückblick |
| Kartenvertiefung nur über Begegnungen | Zufall entscheidet. Eine bestimmte Karte fünfmal zu ziehen kann Monate dauern | jede Stufe ist **entweder** über Begegnungen **oder** über ein freiwilliges Kartenstudium erreichbar (Lesen, eine Frage beantworten). Kein Glücksfaktor |
| Kapitel „Meine Tarotkarten“ und „Vertiefte Kartenbedeutungen“ getrennt | Doppelstruktur | ein Kapitel „Karten“, die Vertiefung ist die Seite der Karte |
| Kapitel „Entdeckungen“ und „Reise und Meilensteine“ getrennt | Doppelstruktur | ein Kapitel „Reise“ |
| „Orakel und Legungen“, „Reflexionen“, „Mondreflexionen“ als drei Kapitel | Verlauf wird zersplittert | ein Kapitel „Tagebuch“ mit Filtern (Tageskarten, Legungen, Reflexionen, Mond, Zahlen) |
| Neue Kombination Haupt- plus Ergänzungsarchetyp | 56 Paarungen wären 56 Texte | 8 Volltexte plus 8 kurze „als Ergänzung“-Texte, kombiniert. Ehrlich: die Paarung ist eine Zusammenstellung, kein neunter Typ |
| Numerologie mit Namenszahlen (Ausdruck, Seele, Persönlichkeit) | braucht den vollen Namen (sensibel), Umlaut-Regeln, mehr Inhalt | erste Version nur mit Geburtsdatum (Lebenszahl, Geburtstagszahl, persönliches Jahr, Monat, Tag). Namenszahlen als späteres Vertiefungspaket |
| Symbole als eigene große Welt | eigene Bildserie, eigene Navigation, wenig Eigenwert | Symbol-Lexikon (24 Symbole), entdeckt über die Karten (jede Karte trägt Symbole) und Meilensteine. Später Basis fürs Traumtagebuch |
| Mondphasen vor dem ersten Release | +2 Wochen, eigene Hintergrundwelt, eigene Journale | als **erstes Update (1.1)**. Mond ist ein natürlicher monatlicher Inhaltsstrom und das beste Argument für ein späteres Abo |
| Eigenes Paket „Visual Excellence“ am Ende | doppelte Arbeit: Screens werden in V03 gestaltet und in V04/V05 umgebaut | Gestaltung und Umbau **pro Bereich in einem Paket**. Härtung bleibt im Release-Paket |
| Release erst nach Monetarisierung (V07) | lange Bauzeit ohne Marktkontakt | geschlossener Test ab Version 0.5, öffentlicher Release 1.0 mit Kernumfang, Billing blockiert den Release nie |

### Was ich streiche oder verschiebe

| Idee | Bewertung | Empfehlung |
|---|---|---|
| Astrologische Geburtsprofile | braucht Geburtszeit und -ort (sensibel), Ephemeriden, sehr viel Inhalt. Starke Konkurrenz (Horoskop-Apps) | **nicht in der Roadmap** bis zur Marktvalidierung |
| Meditationen (Audio) | Sprecher, Musik, Produktion, Lizenzen. Großer Aufwand, schwache Differenzierung | streichen. Stattdessen kurze geführte Text-Rituale |
| Kristalle als Kaufempfehlung | Gefahr von Kaufdruck (Steine kaufen), widerspricht „Rituale ohne Käufe“ | streichen. Höchstens als Symbol im Lexikon |
| Virtuelle Talismane und spirituelle Sammelobjekte | reizvoll als Entdeckung, aber Gefahr von Sammelzwang und Lootbox-Dynamik | **nicht gestrichen, im Backlog (1.3+)** als kostenlose Entdeckungsinhalte: gefunden über Reise und Vertiefung, nie über Zufall, nie käuflich, keine virtuelle Währung |
| Kleine Arkana (56 Karten) | rund 2.500 neue Texte je Sprache plus 56 Bilder | erst nach Release, nur bei Nachfrage, ggf. Premium-Paket |
| Weitere Archetypen | jede Erweiterung entwertet die acht und kostet Porträt plus Volltext | nicht geplant. Tiefe statt Breite |
| Seltenheiten, Abzeichen ohne Inhalt | Lootbox-Dynamik, bedeutungslos | gestrichen (bleibt E1) |
| Traumtagebuch | gute Bindung, nutzt Tagebuch und Symbol-Lexikon | **später (Version 1.3+)**, nach dem Symbol-Lexikon |
| Saisonale Inhalte (Jahreskreisfeste) | wiederkehrender Inhalt, Abo-Grundlage | **nach dem Mond-Update**, wenn ein Abo geprüft wird |
| Optionale Benachrichtigungen | stärkster Bindungshebel, billig | **vorziehen in Release 1.0** (opt-in, ohne Schuld-Formulierungen) |

## 6 · Erfolgsmaße (Hypothesen, keine Zusagen)

| Ebene | Messgröße | Ziel (Hypothese) | Quelle |
|---|---|---|---|
| Aktivierung | erste Karte enthüllt / Installationen | ≥ 70 % | Play-Console-Aggregate, Usability-Test 8/10 in ≤ 90 s |
| Bindung | D1 / D7 / D30 | ≥ 30 % / ≥ 15 % / ≥ 6 % | Play Console (Aggregate, kein eigenes Tracking) |
| Tiefe | Anteil Nutzer mit ≥ 1 Reflexion in Woche 1 | qualitativ im Test, keine Telemetrie | freiwillige Tests |
| Wachstum | Teilungen sind nicht messbar (kein Tracking). Indikator: Store-Besucher aus externen Quellen | steigend | Play Console Akquisitionsberichte |
| Store | Conversion Besucher → Installation | ≥ 30 % (eigene Basis nach 28 Tagen) | Play Console |
| Umsatz | Käufer / aktive Nutzer (Edition) | 1,5–3 % (reine Rechenannahme) | Play Console |
| Qualität | Absturzfreie Nutzer, Bewertung | ≥ 99,5 %, ≥ 4,5 Sterne | Play Console |

Entscheidung nach dem Release bleibt G5: **ITERATE / EXPAND / HOLD / STOP**, mit genau einem nächsten Experiment.

## 7 · Was ARCANA ausdrücklich nicht ist

- keine KI-Chat-App, keine „echten“ Hellseher, keine Live-Readings
- keine Horoskop-App (keine Sternzeichen-Tageshoroskope, keine Geburtshoroskope)
- kein Shop für Steine, Kerzen oder Räucherwerk
- kein Social Network (keine Profile, keine Feeds, keine Kommentare)
- keine Gesundheits-, Therapie- oder Finanzberatung
