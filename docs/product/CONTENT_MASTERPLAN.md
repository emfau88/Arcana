# CONTENT_MASTERPLAN · Inhalte, Mengen, Regeln, Produktion

**Stand:** 26.11.2026 · Grundlage: `PRODUCT_SYSTEMS.md`. Inhalte bleiben lokal gebündelt, versioniert und typisiert (CT-01). Es gibt **keine Runtime-KI**: Texte werden vorab geschrieben, geprüft und mit der App ausgeliefert.

## 1 · Inhaltsarchitektur

Ein Inhaltspaket besteht ab V03 aus **Modulen**. Jedes Modul hat eine eigene Version, ein Schema, Validatorregeln und wird pro Sprache **bei Bedarf geladen** (dynamischer Import). So wächst das Start-Paket nicht mit jeder Welt.

| Modul | Inhalt | geladen | ab |
|---|---|---|---|
| `core` | Karten (Basis), Themen, Positionslabels, UI-nahe Kurztexte | beim Start | vorhanden |
| `cards-deep` | Facetten je Karte (Licht, Schatten, Symbolik, Rollen R4–R8, Varianten, Studium) | beim Öffnen einer Kartenseite oder Legung | V05 |
| `identity` | Fragebogen v2, Archetypen v2, Linse je Karte, Kapitel I–IV | Onboarding, Heute, Profil | V04 |
| `journey` | Stationen, Wege, Meilensteine, Rückblick-Bausteine | Heute (klein), Reise-Kapitel | V04 |
| `spreads` | Legungsdefinitionen, Rahmentexte, Synthese-Vorlagen | Orakel | V05 |
| `numbers` | Numerologie, Engelszahlen, Ziffern, Muster | Entdecken/Zahlen, Heute (Tageszahl) | V06 |
| `symbols` | 24 Symbole | Entdecken/Symbole, Kartenseite | V06 |
| `moon` | Phasen, Rituale, Intentions- und Reflexionsabläufe | Mond, Heute (Zeile) | 1.1 |

**Unveränderlichkeit bleibt:** Gespeicherte Tageskarten und Legungen speichern den gerenderten Text plus `contentVersion` (D-09). Neue Module ändern nie vergangene Einträge.

**Schlüssel statt Duplikate:** Bedeutungen hängen an der **Karte** (`major-03`), nicht am Deck. Zusatzdecks tauschen nur Bilder (`assetId` je Deck).

## 2 · Stimme und Regeln

Bestehende Regeln aus `03_UX_ART_CONTENT.md` gelten weiter: warm-mystisch, konkret, respektvoll, kurze Sätze, keine Vorhersagen, keine Aussagen über Gedanken anderer, keine Heil- oder Finanzversprechen, Rituale ohne Feuer, Substanzen, Risiko oder Käufe.

Neu für V2:

| Regel | Anwendung |
|---|---|
| **Deutung markieren** | Zahlen, Engelszahlen, Mond: jede Bedeutungsseite beginnt mit „traditionell steht … für“ oder trägt den Hinweis „symbolische Deutung“. Nie „das Universum sagt dir“ |
| **Astronomie sachlich** | Mondphase, Beleuchtung, Uhrzeit ohne Deutungsvokabular |
| **Schatten als Frage** | Schattenseiten, innere Spannungen und Herausforderungen sind Fragen oder Beobachtungen, nie Urteile |
| **Keine Druckwörter** | Reise und Meilensteine ohne „verloren“, „verpasst“, „Serie“, „nur noch“, „beeil dich“, „letzte Chance“ |
| **Keine Kaufaufforderung** | Rituale nennen nur, was jeder hat (Papier, Stift, Wasser, Fenster, Atem). Keine Kristalle, Kerzen, Räucherwerk als Voraussetzung |
| **Abwechslung** | kein Text beginnt mit denselben drei Wörtern wie mehr als 5 % der Texte seines Moduls (Validator, N-Gramm-Prüfung) |
| **Geschlechtsinklusiv (DE)** | Partizipformen wie bisher (D-08), direkte Anrede „du“ |
| **EN ist Adaption** | gleiche Aussage, natürliche Sprache, keine Wort-für-Wort-Übersetzung |

**Content-Gate:** `npm run validate:content` wird pro Modul erweitert: Vollständigkeit DE/EN, Längen, Satzzahl, Verbotslisten je Modul (Tabelle §7), Duplikat- und Anfangsprüfung, Referenzen (Karten-IDs, Symbol-IDs, Asset-IDs).

## 3 · Mengen (je Sprache)

Bestand G2: 264 Kartentexte, 56 Archetyp-Texte, 18 Thementexte, 20 Fragebogentexte, 22 Schlagwortzeilen.

| Modul / Baustein | Anzahl | Länge | Paket | Free/Edition |
|---|---|---|---|---|
| **Heute** Linse Archetyp × Karte | 176 | 1 Satz (15–25 Wörter) | V04 | Free |
| Zusatz-Reflexionsfragen (2 je Karte) | 44 | 1 Frage | V05 | Free |
| Zusatz-Ritual (1 je Karte) | 22 | 1–2 Sätze | V05 | Free |
| **Karten-Tiefe** Licht, Schatten | 44 | 2–3 Sätze | V05 | Free |
| Schlüsselwort-Erklärung | 22 | 2 Sätze | V05 | Free |
| Symbolik des Bildes (verlinkt) | 22 | 2–3 Sätze | V05 | Free |
| Rollen R4–R8 | 110 | 1–2 Sätze | V05 | Free |
| Studium (2 Teile: Leseimpuls + Frage) | 44 | 2–3 Sätze | V05 | Free |
| Persönliche Frage (Stufe 4) | 22 | 1 Frage | V05 | Free |
| **Identität** Fragebogen +3 Fragen | 15 | kurz | V04 | Free |
| Archetyp Beschreibung | 8 | 120–180 Wörter | V04 | Free |
| Stärken 3, innere Spannungen 2, Schatten-Fragen +2, Entwicklung +1, Beziehungsmuster 1 | 8 × 9 = 72 | 1–3 Sätze | V04 | Free / Edition (Spannungen, Beziehung) |
| Rituale 3, Reflexionsfragen +4 | 8 × 7 = 56 | kurz | V04 | Free / Edition (Ritualreihe) |
| Kapitel I–IV | 32 | 150–250 Wörter | V04 | Free |
| Als Ergänzung, Enthüllungssatz | 16 | 1–2 Sätze | V04 | Free / Edition (Vertiefung) |
| Ergänzungskapitel (Tag 100) | 8 | 150–250 Wörter | V04 | Free |
| **Reise** Stationen (21 × 3 Runden) | 63 | 2–3 Sätze | V04 | Free |
| Wegeinführungen, Rundenabschlüsse | 13 | 2–3 Sätze | V04 | Free |
| Meilenstein-Texte | 20 | 1–3 Sätze | V04 | Free |
| Rückblick-Bausteine | 40 | Satzvorlagen | V04 | Free |
| **Legungen** Definitionen, Rahmen, Labels, Synthesen (5 neue) | ~60 | kurz | V05 / V07 | Free / Edition |
| **Numerologie** 12 Zahlen × (Schlagworte, Essenz, Lebenszahl, Geburtstagszahl, 3 Stärken, 3 Herausforderungen, 2 Reflexionen) | ~140 | Lebenszahl 100–150 Wörter, sonst kurz | V06 | Free / Edition (Herausforderungen ausführlich) |
| Persönliches Jahr 1–9, Monat 1–9, Tag 1–9 × 3 | 45 | Jahr 80, Monat 40, Tag 1 Satz | V06 | Free / Edition (Jahresverlauf) |
| Rechenweg-Erklärungen | 6 | kurz | V06 | Free |
| **Zweite Säule** Archetyp und Zahl (8 Archetypen × verstärkend/ergänzend) | 16 | 1–2 Sätze | V06 | Free |
| Lebenskarte und Jahreskarte (Rahmensätze, Einladung zum Geburtsdatum, Tagesresonanz) | ≈ 14 | 1–2 Sätze | V06 | Free |
| Sicherung und Wiederherstellung (UI, Hinweise) | ≈ 15 | kurz | V07 | Free |
| **Engelszahlen** 22 Folgen × (Titel, Bedeutung, Licht, Schatten, Reflexion, Mini-Ritual) | 132 | Bedeutung 50–80 Wörter | V06 | Free |
| Ziffern 0–9 × 2, Muster 8 | 28 | kurz | V06 | Free |
| **Symbole** 24 × (Name, Bedeutung, Licht, Schatten, Reflexion) | 120 | Bedeutung 50–80 Wörter | V06 | Free |
| Weltvorstellungen, Teilen, Erinnerung, Systemtexte | ~60 + ~400 UI-Schlüssel | kurz | V04–V07 | Free |
| **Summe bis Release 1.0** | **≈ 1.500 Texte** | **≈ 40.000–45.000 Wörter** | | |
| **Mond (1.1)** 8 Phasen × 5, Abläufe 2 × 4, Rituale 12, Erklärung | ≈ 70 | | 1.1 | Free / Edition (6 Rituale) |
| **Mondreise (1.2)** | 29 | 1–2 Sätze | 1.2 | Edition oder Abo |
| **Themenreise (1.3+, je Reise)** | 30–60 | 1–3 Sätze | 1.3+ | Einzelkauf oder Abo |
| **Virtuelle Talismane (Backlog)** | je Talisman Name, Bedeutung, Fundort | kurz | 1.3+ | Free |

**Bewertung:** Die Inhaltsmenge ist der eigentliche Engpass, nicht die Technik. Zwei Hebel halten sie beherrschbar: (1) Rollen statt Legungs-Texten, (2) Rückblicke aus eigenen Daten statt neuer Texte. Ohne diese beiden Hebel wären es über 3.000 Texte je Sprache.

## 4 · Archetyp-Zuordnungen (geprüft in V04.2, S-12)

| Archetyp | Karten (3) | Leitsymbol | weitere Symbole | Resonanzzahlen |
|---|---|---|---|---|
| Suchende | Narr, Eremit, Stern | Laterne | Stern, Schlüssel | 5, 7 |
| Hütende | Herrscher, Kraft, Mäßigkeit | Lilie | Säulen, Rose | 2, 6 |
| Sehende | Hohepriesterin, Mond, Glücksrad | Auge | Mond, Feder | 2, 11 |
| Verwandelnde | Tod, Turm, Teufel | Phönix | Schlange, Kelch | 1, 8 |
| Wandernde | Wagen, Liebende, Welt | Feder | Rad, Ähre | 3, 5 |
| Schaffende | Magier, Herrscherin, Sonne | Stab | Sonne, Lotus | 3, 1 |
| Weise | Hierophant, Gerechtigkeit, Gehängter | Eule | Schlüssel, Waage | 4, 9 |
| Erneuernde | Tod, Gericht, Stern | Lotus | Schmetterling, Lemniskate | 9, 22 |

Die Zuordnungen sind Deutungskonventionen der App, keine Tradition. Sie werden im Profil als „deine Resonanz“ formuliert. Geprüft in V04.2: Jede der 22 Karten gehört zu einem Archetyp, nur Tod und Stern zu zweien (vorher: Stern dreimal, Herrscher, Liebende, Glücksrad, Gehängter und Teufel nie). So bleibt der spätere „Sanfte Spiegel“ (C9) ausgewogen. Struktur in `src/content/resonance.ts`, Begründung in `docs/SELF_DECISIONS.md` S-12. Resonanzzahlen kommen mit V06.

## 5 · Numerologie: verbindliches Rechenverfahren

Es gibt mehrere traditionelle Varianten (Ziffernsumme gesamt vs. Komponentenmethode, Meisterzahlen in Zyklen ja/nein, Jahreswechsel am 1.1. oder am Geburtstag). ARCANA nutzt **eine** dokumentierte Variante, die im Rechenweg sichtbar ist:

| Größe | Regel | Beispiel (geb. 15.07.1990, heute 26.11.2026) |
|---|---|---|
| Reduktion `r(n)` | Quersumme wiederholen bis 1–9. **Mit Meisterzahlen** `rm(n)`: stoppt bei 11, 22, 33 | |
| Lebenszahl | **Komponentenmethode:** `rm(rm(Monat) + rm(Tag) + rm(Jahr))`. Komponenten behalten 11 und 22 | Monat 7, Tag 15 → 6, Jahr 1990 → 19 → 10 → 1. 7 + 6 + 1 = 14 → **5** |
| Geburtstagszahl | `rm(Tag)`, 11 und 22 bleiben (33 kommt als Tag nicht vor) | 15 → **6** |
| Persönliches Jahr | **Kalenderjahr** (Wechsel am 1.1.): `r(r(Geburtsmonat) + r(Geburtstag) + r(laufendes Jahr))`, keine Meisterzahlen | 7 + 6 + r(2026) = 1 → 14 → **5** |
| Persönlicher Monat | `r(persönliches Jahr + r(Kalendermonat))` | 5 + r(11) = 2 → **7** |
| Persönlicher Tag | `r(persönlicher Monat + r(Kalendertag))`, lokaler Kalendertag | 7 + r(26) = 8 → 15 → **6** |

Weitere Testvektoren (Pflicht im Unit-Test): 29.11.1987 → Monat 11, Tag 29 → 11, Jahr 1987 → 25 → 7; 11 + 11 + 7 = 29 → **11** (Meisterzahl). 22.04.1996 → 4 + 22 + r(1996) = 25 → 7; 4 + 22 + 7 = 33 → **33**. Schaltjahr 29.02.2000. Jahreswechsel 31.12./1.1. für das persönliche Jahr.

**Zuordnung Zahl → Karte:** 1 Magier, 2 Hohepriesterin, 3 Herrscherin, 4 Herrscher, 5 Hierophant, 6 Liebende, 7 Wagen, 8 Kraft, 9 Eremit, 11 Gerechtigkeit (XI, Reihenfolge des Decks), 22 Narr (als XXII), 33 Herrscherin (3 + 3, App-Konvention).

**Nicht in 1.0:** Namenszahlen (Ausdruck, Seele, Persönlichkeit), Pinnacles, Challenges, Karmische Zahlen. Grund: brauchen den Namen oder vervielfachen den Inhalt. Entscheidung E12.

## 6 · Engelszahlen, Symbole, Mond: Listen

**Engelszahlen (22 kuratiert):** 000, 111, 222, 333, 444, 555, 666, 777, 888, 999, 0101, 1010, 1111, 1122, 1212, 1221, 1234, 1313, 1414, 2121, 2222, 1001. Aliase: `0000` → 000, `11:11` → 1111, `22:22` → 2222, `12:12` → 1212, `10:10` → 1010, `21:21` → 2121, `13:13` → 1313, `14:14` → 1414, `01:01` → 0101. 666 wird ruhig und ohne Angstbild gedeutet (Balance von Materiellem und Innerem).

**Zusammengesetzte Deutung:** Ziffern-Grundbedeutung (0–9) plus Muster: Wiederholung (`777`), Spiegel (`1221`), Treppe (`1234`, `4321`), Paar (`1122`), Rahmen (`1001`), gemischt. Die Seite sagt offen: „aus den Ziffern zusammengesetzt“.

**Symbole (24, endgültige Liste nach Abgleich mit den Bildern von Deck v2 in V06):** Sonne, Mond, Stern, Lotus, Schlüssel, Schmetterling, Phönix, Schlange, Baum, Eule, Krone, Kelch, Schwert, Stab, Rose, Lilie, Auge, Feder, Rad, Säulen, Waage, Laterne, Lemniskate, Ähre. Jedes Symbol verweist auf die Karten, in deren **Bild** es tatsächlich vorkommt (nicht auf die Tradition allein).

**Mondphasen (1.1):** Neumond, zunehmende Sichel, erstes Viertel, zunehmender Mond, Vollmond, abnehmender Mond, letztes Viertel, abnehmende Sichel. Hauptphasen gelten für den lokalen Kalendertag, in den der exakte Zeitpunkt fällt. Die Zwischenphasen füllen die Tage dazwischen.

## 7 · Verbotslisten je Modul (Content-Gate, Erweiterung)

| Modul | zusätzlich verboten (DE/EN sinngemäß) |
|---|---|
| alle | „wird passieren“, „garantiert“, „mit Sicherheit“, „das Universum will“, „dein Schicksal ist“, Gedanken/Gefühle anderer („er denkt an dich“), Heilung, Diagnose, Geldversprechen |
| journey | „verloren“, „verpasst“, „Serie“, „Streak“, „nur noch“, „beeil“, „letzte Chance“, „vergiss nicht“ |
| numbers (Engelszahlen) | „Engel sagen dir“, „ist ein Zeichen, dass er/sie“, „bedeutet sicher“, „Zwillingsflamme kommt“ |
| moon | „der Mond bewirkt“, „heilt“, „Energie reinigt“ als Tatsache |
| Rituale (alle Module) | „Kerze“, „Feuer“, „Räucher“, „Kristall kaufen“, „Salbei“, Substanzen, Fasten |
| Teilen-Vorlagen | Platzhalter für Notiz, Antwort, Geburtsdatum dürfen nicht existieren (Typ-Prüfung) |

## 8 · Produktionsablauf (pro Modul)

1. **Schema und Validator zuerst** (Felder, Längen, Verbotsliste). *Fertig, wenn* ein leeres Modul vom Validator mit klaren Fehlern abgelehnt wird.
2. **Entwurf DE**, dann **Adaption EN** durch den Agenten als eigene Arbeit (wie G2). Pro Modul eine kurze Stil-Probe (5 Texte) zur Eigentümer-Freigabe, bevor die Menge geschrieben wird.
3. **Automatische Prüfung** grün (Gate, Unit-Matrix).
4. **Review:** Schaufenster-Texte vollständig durch den Eigentümer (Archetyp-Beschreibungen und Enthüllungssätze, Lebenszahlen, die 10 häufigsten Engelszahlen, 10 Linsen-Stichproben). Übrige Texte Stichprobe 10 %. Entscheidung E18, ob vor 1.0 ein menschliches Lektorat beauftragt wird.
5. **Version** erhöhen, `CONTENT_INVENTORY.md` aktualisieren.

**Aufwand Eigentümer (Schätzung):** Stil-Proben 8 × 10 min, Schaufenster-Review etwa 3–4 h, Stichproben etwa 2–3 h bis Release 1.0.

## 9 · Tests für Inhalte

| Test | Prüft |
|---|---|
| Content-Gate je Modul | Vollständigkeit, Längen, Verbotslisten, Referenzen, Anfänge |
| Matrix Heute | jede Karte × Thema × Archetyp (inkl. ohne) × Variante ergibt einen vollständigen Tag |
| Matrix Legungen | jede Legung × jede Kartenkombination (Stichprobe 10.000, fester Zufall) × Thema |
| Numerologie-Vektoren | Abschnitt 5, mindestens 20 Fälle |
| Engelszahlen-Eingabe | jede Eingabe 1–6 Ziffern und `hh:mm` ergibt eine Seite (Property-Test) |
| Wiederholung | 66 simulierte Tage: keine identische Kombination in 21 Tagen |
| Share-Whitelist | kein Share-Modell erreicht Notiz, Antworten oder Geburtsdatum |
