# V06-Plan · Zahlen und Symbole (0.6)

**Stand:** 28.11.2026 · Entwurf des Agenten, **wartet auf den Zuruf des Eigentümers** (V06 beginnt erst dann). Reihenfolge und Alternativen: `docs/SELF_DECISIONS.md` S-62.
**Grundlage:** `docs/product/MASTER_ROADMAP_V2.md` §5 „V06“ und §6, `PRODUCT_SYSTEMS.md` C10, E (Kapitel III und VI, E4), G, H und J4, `CONTENT_MASTERPLAN.md` §1–9, `INFORMATION_ARCHITECTURE.md` §2 und §5, `PROGRESSION_DESIGN.md` §5–6, `docs/visual/ASSET_REQUESTS.md` A25, A28, A32 und A33.

**Ziel:** Ein neuer Tab „Entdecken“ bündelt zwei Wissenswelten: Zahlen mit Engelszahlen, und Symbole. Die Numerologie wird die zweite Säule der Identität und ist mit „Heute“, „Ich“ und dem Grimoire verbunden. Am Ende steht Version 0.6.0.

## 1 · Was schon da ist

| Baustein | seit | Stand |
|---|---|---|
| Speicher `personal` mit `birthDate` (geprüft beim Laden); die Sicherung nimmt das Geburtsdatum nur auf Wunsch mit | V03 | vorhanden, noch ohne Oberfläche |
| Speicher `favorites`, Tagebuchart `number-encounter`, Ereignis `world.introduced` | V03 | vorhanden; Tagebucheinträge zählen schon als Reisetag |
| Recht `edition.numbers` | V03.4 | ohne Billing unsichtbar |
| Hinweise: Merkmal `worlds` (Weltvorstellung an Tag 2, 4 und 6) und `symbols` („Dein Symbol“ an Tag 10), die Texte dazu | V04 | geschrieben, aber verborgen, bis die Welt existiert (D-54) |
| 21 Symbol-IDs mit der Resonanz der Archetypen | V04.2 | es fehlen Baum, Krone und Schwert; die Resonanzzahlen sind noch nicht hinterlegt |
| Teilen-Kern mit Typ-Schutz (`birthDate` ist ein verbotenes Feld) | V04.7 | vorhanden |
| Vignetten Symbole (A25) und Zahlen (A28) | B3 | exportiert in `art/b3/vignettes/`, noch nicht eingebaut |
| A32 Entdecken-Welt, A33 zwei Symbol-Sheets | B4 | im Lieferordner, noch nicht geprüft und exportiert |

## 2 · Reihenfolge

Wie in V05 (S-29): zuerst Logik und Texte, die ohne Oberfläche vollständig prüfbar sind, dann Bilder und Screens, zuletzt die Verbindungen. So kann V06 sofort beginnen, auch solange E8 offen ist, und neue Hinweise erscheinen erst, wenn ihre Seiten stehen.

| Schritt | Bulk | Arbeit | Fertig, wenn | Belege |
|---|---|---|---|---|
| 0 | Vorbereitung | Branch `feature/v06-zahlen` von `main` (steht, mit diesem Plan). **Symbol-Abgleich:** alle 22 Kartenbilder ansehen und festhalten, welches der 24 Symbole wirklich im Bild steht; daraus die endgültige Liste. B4 prüfen und exportieren: A32 als Welt in zwei Größen, 24 Symbole einzeln (256 px, je ≤ 20 KB) | Liste der 24 Symbole mit Kartenverweisen steht; jedes Symbol kommt in mindestens einem Bild vor oder wird begründet ersetzt; Export im Budget | Kontaktbogen, Exportbericht, Eintrag in `SELF_DECISIONS.md` |
| 1 | V06.2 Numerologie: Logik und Texte | reine Rechenfunktionen in `src/domain/numerology.ts`: Reduktion mit und ohne Meisterzahlen, Lebenszahl, Geburtstagszahl, persönliches Jahr, Monat und Tag, Rechenweg als Daten, Zahl → Karte, Resonanzzahlen der Archetypen. Modul `numbers`, Teil Numerologie: ≈ 190 Texte je Sprache in zwei Gruppen | ≥ 20 Testvektoren grün (15.07.1990 → 5, 29.11.1987 → 11, 22.04.1996 → 33, 29.02.2000, Jahreswechsel, drei Zeitzonen); Content-Gate mit Deutungs-Markierung und Verbotsliste | Unit, Content-Gate |
| 2 | V06.3 Engelszahlen: Logik und Texte | `src/domain/angel.ts`: Eingabe lesen (1–6 Ziffern, `hh:mm`, Aliase wie `11:11` → 1111), 22 kuratierte Folgen, Muster (Wiederholung, Spiegel, Treppe, Paar, Rahmen, gemischt), zusammengesetzte Deutung. Texte: 22 Folgen × 6 plus Ziffern und Muster, 160 je Sprache | Property-Test: jede Eingabe aus 1–6 Ziffern oder `hh:mm` ergibt eine Deutung; eine festgehaltene Begegnung zählt als Reisetag (Unit) | Unit, Property, Content-Gate |
| 3 | V06.4 Symbol-Lexikon: Logik und Texte | Modul `symbols`: 24 Symbole × Name, Bedeutung, Licht, Schatten und Reflexion (120 je Sprache), Verweise auf die Karten aus Schritt 0, `discoveredSymbols` aus Kartenstufe 3 und Meilenstein Tag 10 | alle Verweise gültig (Validator); Entdeckung abgeleitet, nichts zusätzlich gespeichert | Unit, Validator |
| 4 | V06.1 Entdecken und V06.5 Gestaltung (braucht E8) | fünfter Tab „Entdecken“ / „Discover“, Hub mit Suche über alle drei Welten, Routen `#/discover/…`. Seiten: Zahlen und Zahlseite; Engelszahlen mit Eingabe, „Begegnung festhalten“ und Favorit; Symbol-Lexikon und Symbolseite; Geburtsdatum unter `#/me/birthdate` (freiwillig, mit Grund, einzeln löschbar). A32 als Welt, A33 als Symbolbilder, Medaillon der Zahlen in Code | 5 Tabs mit Label lesbar auf 360 px, auch bei 130 % Schrift; Android-Zurück korrekt (E2E); Nachschlagen nie gesperrt (E2E); Bildbudget und Kontrast | E2E, Screenshots DE/EN, Kontrast, Layout, Emulator |
| 5 | V06.6 Zweite Säule verbinden | „Ich“ mit der Zahlen-Säule (Lebenszahl, Lebenskarte, persönliches Jahr) oder einer Einladung; Lebenskarte auf ihrer Kartenseite markiert; Archetyp und Zahl (16 Texte); Tagesenergien-Zeile in „Heute“ mit Tageszahl und Tagesresonanz (nur mit Geburtsdatum); Grimoire mit sieben Kapiteln (neu: III Symbole, VI Zahlen mit Jahreskarte und Jahreskapitel); Weltvorstellungen an Tag 2, 4 und 6 und „Dein Symbol“ an Tag 10 werden sichtbar; Teilen-Vorlage Lebenszahl (ohne Datum und Rechenweg); Ex Libris, falls freigegeben | ohne Geburtsdatum keine Lücke, sondern eine Einladung (E2E); Lebenskarte für alle 12 Lebenszahlen richtig (Unit); höchstens ein Hinweis pro Tag (Unit); Geburtsdatum in keinem Share-Modell (Typ-Test) | Unit, E2E, Screenshots, Emulator |
| 6 | Durchsicht und Gate | alle neuen Texte in Deutsch und Englisch vollständig lesen, Symboltexte gegen die Kartenbilder prüfen. QG-V06: `npm run check`, E2E, Kontrast jedes Lesetexts, Layout bei 360/390/412 px und 130 %, Android-Emulator (5 Tabs, Zurück, Schrift 130 % und 200 %), Start-JS und APK, kurze A/B-Messung von „Heute“ gegen 0.5.0; Gate-Bericht und Pull Request | Gate-Bericht mit ehrlichem PASS/FAIL/BLOCKED/NOT RUN; Merge nur auf Zuruf, danach Tag `v0.6.0` | `docs/GATE_REPORTS.md` |

Nach jedem Schritt: getrennte Commits (Code, Nachweise, Doku), Push auf `feature/v06-zahlen`, Status, Roadmap, Checklisten und Live-Seite nachgezogen, kurzer Bericht.

## 3 · Regeln beim Bauen

- **Der Start bleibt leicht (B-08, D-67):** Entdecken, alle neuen Seiten und die Module `numbers` und `symbols` laden erst bei Bedarf. „Heute“ bekommt nur die kleine Rechnung für die Tageszahl; ihre Texte laden nach. Ziel: Start-JS höchstens +2 kB (Grenze 160 kB, Schrittgrenze +8 kB). Jedes Modul bleibt ≤ 40 KB gzip je Sprache; wenn nötig, wird `numbers` in Numerologie und Engelszahlen geteilt.
- **Geburtsdatum:** freiwillig, nur lokal, einzeln löschbar, nie in einem Share-Modell (Typ-Test), nicht in der ersten Sitzung, in der Sicherung nur auf Wunsch (wie schon vorgesehen).
- **Deutung markiert:** Jede Bedeutungsseite trägt „symbolische Deutung“ oder beginnt mit „traditionell steht … für“. Keine Vorhersagen, keine Aussagen über andere; die Verbotslisten aus `CONTENT_MASTERPLAN.md` §7 kommen ins Content-Gate.
- **Nichts gesperrt, keine Attrappen:** Wissen ist immer nachschlagbar. Die Edition-Teile (ausführliche Herausforderungen, Jahresverlauf) entstehen wie „Zwei Wege“ in V05.2: vorhanden, aber ohne Billing unsichtbar.
- **Nichts ankündigen, was nicht gebaut ist:** Weltvorstellungen und „Dein Symbol“ werden erst sichtbar, wenn ihre Seiten stehen (Schritt 5).
- **Optik:** Bestehende Screens ändern sich nur dort, wo die Produktunterlagen es verlangen (fünfter Tab, Tagesenergien-Zeile, sieben Grimoire-Kapitel, Zahlen-Säule in „Ich“). Neue Screens entstehen als Vorschlag zur gesammelten Durchsicht in der Prüfliste, wie in V04 und V05.
- **Texte:** Der Agent schreibt sie (D-62) in Gruppen, die einzeln durch das Content-Gate gehen. Die erste Gruppe jedes Moduls steht als Stilprobe in der Prüfliste; die Arbeit wartet nicht darauf (wie S-29 und D-54).
- **Android** nur im Emulator (`emulator-5554`).

## 4 · Entscheidungen des Eigentümers

| # | Frage | Empfehlung | gebraucht vor |
|---|---|---|---|
| Start | V06 beginnen | – | Schritt 0 |
| E8 | Fünf Tabs mit „Entdecken“ | ja. Die Alternative wäre ein Einstieg über „Heute“ und das Grimoire; das ist schlechter, weil Nachschlagen (Engelszahl gesehen, sofort suchen) einen direkten Weg braucht | Schritt 4 |
| Ex Libris | Die persönliche erste Seite des Grimoires (E4, Release 1.0) hat noch keinen Bulk; sie braucht die Kernzahlen und das Symbol | in V06.6 einbauen; die Teilen-Vorlage J5 bleibt in V07.1 | Schritt 5 |

Kann warten: E14 Billing (vor V07), E11, E15 und E17 (geschlossener Test; das Test-Update aus QG-V06 bleibt bis dahin BLOCKED), E18 Lektorat.

## 5 · Risiken

| Risiko | Gegenmaßnahme |
|---|---|
| Der Start wird langsamer (B-08 ist schon offen) | alles Neue nachladen; Build-Report nach jedem Schritt; A/B-Messung von „Heute“ gegen 0.5.0 im Gate |
| Fünf Tabs sind auf 360 px zu eng, besonders bei 130 % und 200 % Schrift | Label ≤ 9 Zeichen („Entdecken“ 9, „Discover“ 8), Screenshot-Test, Emulator mit großer Schrift |
| Ein Symbol der Liste steht in keinem Kartenbild | Abgleich in Schritt 0, Ersatz begründen; fehlt dafür ein Bild, zeichne ich es als SVG im Stil der Icons (Ersatzregel A33) |
| Datumsgrenzen und Zeitzonen | Clock-Injektion, Tests in drei Zeitzonen und am Jahreswechsel |
| Deutungsanspruch bei Zahlen und Engelszahlen | Markierung auf jeder Seite, Verbotslisten, keine Vorhersagen |
| Textmenge (≈ 500 je Sprache) | Gruppen mit eigenem Gate, Wiederholungsprüfung, vollständige Durchsicht in Deutsch und Englisch in Schritt 6 |
| Sieben statt fünf Kapitel verschieben die römischen Ziffern im Grimoire | E2E und Nachweisskript suchen die Kapitel über ihren Namen, nicht über die Ziffer |

## 6 · Aufwand

Die Roadmap rechnet mit 6–7 Sitzungen; mit Ex Libris und der vollständigen Textdurchsicht eher 7–8. Der Engpass sind die Texte, nicht die Technik.
