# PROJECT_STATUS — Personal Oracle (Arbeitstitel ARCANA)

**Stand:** 27.11.2026 · **Version:** 0.3.0 · **Phase:** G2 abgeschlossen (PASS). V02 (Tagesorakel) abgeschlossen und gemergt, **Tag `v0.2.1`**. **V03 freigegeben und gemergt** (27.11.2026, `2f1e1de`, **Tag `v0.3.0`**): Datenmodell v2 mit Migration und Sicherungsformat, abgeleitete Schicht, Content-Module, Rechte, globales Designsystem (D-43 bis D-51). QG-V03 PASS mit den Eigentümer-Ausnahmen aus D-52 (B-07 → V04.3, Leistungsmessung → vor QG-V05, Desktop kein Kriterium). Pull Request [#3](https://github.com/emfau88/Arcana/pull/3) gemergt. **V04 fertig gebaut** auf `feature/v04-identitaet` (vom Tag `v0.3.0`), Pull Request [#4](https://github.com/emfau88/Arcana/pull/4) nach `main` offen, Merge erst nach Freigabe: Fragebogen v2 (D-53), Enthüllung, „Ich“, „Warum?“, Bibliothek der acht, Linsen, Narrenreise mit Meilenstein-Moment, Sternkarte, Rückblicke, Kapitel und Teilen-Karte; alle neuen Screens als Vorschlag aus vorhandenen Bausteinen auf den B2-Bildern (D-58). B-07 ist mit Variante B behoben (Eigentümer, D-59). Offen: Durchsicht der Screens und Schaufenster-Texte, B-13 und B-14 (Emulator-Messungen). Seit D-57 stellt der Agent V04 im Alleingang fertig; neue Screens entstehen als Vorschlag zur gesammelten Durchsicht. Seit 27.11.2026 entscheidet der Agent offene Punkte selbst und hält die Alternativen in `docs/SELF_DECISIONS.md` fest (D-56). **Produktvision V2** (D-38, D-39): Pakete V03–V07 bis Release 1.0 in `docs/product/MASTER_ROADMAP_V2.md`. G3 (Härtung) ist Bulk V07.5

Ein neuer Agent liest zuerst diese Datei, dann `AGENTS.md`, `docs/DECISIONS.md` und `docs/GATE_REPORTS.md`.

## Orte

| Was | Wo |
|---|---|
| Projektroot (neu, isoliert) | `%USERPROFILE%\Documents\PersonalOracle-Web` |
| Git | eigenes Repo, Remote `https://github.com/emfau88/Arcana` (öffentlich). `main` = freigegebener Stand (0.3.0, Tag `v0.3.0`), `feature/v03-fundament` = V03 (gemergt, bleibt als Referenz), `feature/v04-identitaet` = V04 in Arbeit (vom Tag `v0.3.0`), `design/visual-overhaul` = V02 (abgeschlossen, bleibt als Referenz). Sicherung je Paket mit Commits, Push, Nachweisen und Tags (D-40, `AGENTS.md`) |
| Preview (Handy) | https://emfau88.github.io/Arcana/ (GitHub Pages aus `main`, Workflow `.github/workflows/pages.yml`) |
| Design-Vorschau | https://emfau88.github.io/Arcana/preview/ (Branch `design/visual-overhaul`, eigene Datenbank, D-29) |
| Produktplan V2 | `docs/product/` (Vision, Systeme, Progression, Inhalte, Informationsarchitektur, Monetarisierung, Masterplan V02–V07) |
| Visual Overhaul | `docs/visual/` (Audit, Art Direction, Asset-Anfragen mit Bulks B1–B7, V02-Roadmap, Performance) |
| Deck-v2-Master (Sicherung) | `%USERPROFILE%\Documents\ARCANA-Assets\deck-v2-masters` (außerhalb Repo und Codex-Cache, mit SHA256SUMS) |
| Lokale Preview | `npm run build && npm run preview` → http://127.0.0.1:5181/ |
| Debug-APK | `android\app\build\outputs\apk\debug\app-debug.apk` (nicht versioniert) |
| Nachweise | `docs/evidence/browser`, `docs/evidence/android`, `docs/assets/deck-overview-v2.webp` |
| Kartenkunst | Deck v2 (gemalt, OpenAI ImageGen, D-26) in `public/cards/`, Export `scripts/assets/export-cards.py`. PNG-Master außerhalb des Repos. Austauschregel in `docs/ASSET_LICENSES.md` |
| Starterpaket | `docs/briefing/` liegt nur lokal (per `.gitignore` nicht im öffentlichen Repo) |
| Altprojekt Mirror/Heartvia | unberührt, nicht gelesen, nicht durchsucht |

## Gates

| Gate | Status | Beleg |
|---|---|---|
| G0 | PASS | `docs/GATE_REPORTS.md`, `docs/ISOLATION_REPORT.md` |
| G1 | PASS, Stil vorläufig freigegeben (D-22) | `docs/GATE_REPORTS.md` |
| G2 | PASS | `docs/GATE_REPORTS.md`, `docs/TEST_EVIDENCE.md`, `docs/G2_PLAN.md` |
| QG-V03 | PASS mit Ausnahmen (D-52) | Check 118/118, E2E 20 bestanden, Android-Migration 9/9, Kaltstart 1,58 s, APK 8,1 MB, Screenshots 360/390/412 DE/EN 130 % (`visual/evidence/v03-*`) |
| QG-V04 | Funktion PASS, Kontrast PASS (B-07 behoben, D-59); offen: Screenshot- und Textdurchsicht durch den Eigentümer, B-13 und B-14 (Emulator) | siehe „Nachweise V04“ unten |
| G3–G5 | NOT RUN | G3 ist Bulk V07.5 |

## Was funktioniert (Browser und Android-Emulator)

- First-Run mit Willkommen, 7 freiwilligen Fragen (Fragebogen v2, V04.1), Wahl aus 6 Themen und Archetyp-Enthüllung. Überspringen führt zum neutralen Profil. Haupt- und Ergänzungsarchetyp werden berechnet und gespeichert; die Ergänzung wird erst mit V04.2 sichtbar.
- Bestehende Profile aus dem kürzeren Fragebogen bleiben gültig und sehen im Profil das Angebot „Drei neue Fragen“ (E9, D-53).
- Volles Deck: 22 gemalte Karten plus Rückseite (Deck v2), 6 Themen, alle Texte in DE und EN.
- Tageskarte: eine Karte pro lokalem Kalendertag (auch über Mitternacht und nach dem Zurückkehren aus dem Hintergrund), freiwillige Enthüllung, Botschaft, Reflexionsfrage, Mini-Ritual, Notiz. Nach Neustart erscheint dieselbe Karte.
- Drei-Karten-Orakel mit Situation, Herausforderung und Impuls in allen 6 Themen, einzeln aufdeckbar, speichern oder verwerfen. Die Deutung wird unveränderlich gespeichert. Ein halb aufgedecktes Reading wird wiederhergestellt.
- Grimoire mit Sammlung (x/22), Verlauf und Detailansicht.
- Profil: Archetyp ansehen, Fragen erneut beantworten, Archetyp selbst wählen oder offen lassen. Thema, Sprache (DE/EN), Bewegung, „Alle Daten löschen“.
- Android: gebündelter Build ohne Remote-URL, offline lauffähig. Back-Regeln, Insets, Schriftgrößen 130 %/200 % und reduzierte Bewegung sind geprüft.

## Offene Punkte

Fortschritt je Paket und Bulk als Checkliste: `docs/product/MASTER_ROADMAP_V2.md` §0.1.

- [x] **Freigabe des Tagesorakel-Screens (V02)** durch den Eigentümer (26.11.2026), B-05/B-06 behoben (D-42).
- [x] PR-Merge nach `main` (`553c5d9`), Tag `v0.2.1`, Branch `feature/v03-fundament` angelegt.
- [x] V03 Fundament auf `feature/v03-fundament` (Version 0.3.0), QG-V03 mit Ausnahmen D-52.
- [x] **Freigabe und Merge von V03** durch den Eigentümer (27.11.2026, Merge-Commit `2f1e1de`), Tag `v0.3.0`, `main` in `feature/v04-identitaet` gemergt.
- [ ] V04 Identität und Reise auf `feature/v04-identitaet` (`MASTER_ROADMAP_V2.md` §0.1): V04.1, V04.3, V04.4, V04.5 [x]; V04.2, V04.6, V04.7 bis auf die Durchsicht und die Emulator-Messungen B-13/B-14 fertig. Pull Request [#4](https://github.com/emfau88/Arcana/pull/4) nach `main` offen, **Merge und Tag `v0.4.0` erst nach Freigabe**.
- [x] **Eigentümer:** B-07-Variante gewählt: B, Panel unter der Fußzeile (27.11.2026, D-59), eingebaut und geprüft.
- [ ] **Eigentümer:** die neuen Screens durchsehen (`SELF_DECISIONS.md`, Nachprüfen).
- [x] Schwelle der Ergänzung: im Auftrag des Eigentümers selbst entschieden, höchstens 1 Punkt Abstand ab 4 Antworten (D-53; Vergleich und Alternativen in `SELF_DECISIONS.md` S-01).
- [x] Reisetexte: Eigentümer 27.11.2026 „nach eigenem Ermessen, später optimieren“ (D-54, S-02); Feinschliff im Lektorat.
- [ ] Bei Gelegenheit: selbst entschiedene Punkte durchsehen (`docs/SELF_DECISIONS.md`, D-56).
- [ ] **Eigentümer:** Angebots-Panel „Drei neue Fragen“ im Profil ansehen (bestehende Bausteine, `visual/evidence/v04-angebot-profil-360.webp`).
- [x] Neue V04-Screens als Vorschlag gebaut statt zuerst ein Muster (D-57, D-58); Durchsicht siehe oben.
- [x] **Bild-Bulk B2** geliefert (11/11), als WebP im Budget exportiert (D-55) und mit den V04-Screens nach `public/` übernommen (D-58).
- [ ] Offene Produktentscheidungen E8–E20: `MASTER_ROADMAP_V2.md` §9 (E9, E19, E20 entschieden; E8 offen).
- [ ] **Rückmeldung des Eigentümers** zum G2-Bericht (G3 ist jetzt Bulk V07.5).
- [ ] Archetyp-Sigillen und App-Icon an Deck v2 angleichen (noch Vektorstil, `BACKLOG.md`).
- [ ] Kaltstart im Release-Build und auf echtem Gerät messen (V07.5). Emulator mit V02: Median 1,95 s unter Rechnerlast (vorher 2,4 s).
- [ ] Menschliches Lektorat der Texte vor dem Release (E18).
- [ ] D-08 (geschlechtsinklusive DE-Archetypnamen) wartet noch auf ein Eigentümerurteil.
- [ ] Name „ARCANA“ und App-ID festlegen (E11, vor dem geschlossenen Test).
- [ ] TalkBack manuell prüfen (V07.5). Bisher nicht manuell geprüft. Als Ersatz wurden die Accessibility-Labels per uiautomator geprüft (G3).

## Bekannte offene Fehler und Grenzfälle (Stand V04, 27.11.2026)

| # | Befund | Status | Wo |
|---|---|---|---|
| B-01 | Enthüllung, wenn sofort beim Fertigladen getippt wird: 46 fps, 2 Ruckler, schlechtester Frame 183 ms (Grenze ≥ 50 fps, ≤ 120 ms). Mit 300 ms Abstand 53–54 fps | **erledigt** (D-41): Schriften werden vorgewärmt, solange die Karte verdeckt ist; danach schlechtester Frame 50 ms, 0 Ruckler | `docs/visual/PERFORMANCE.md` „V02 final“ |
| B-02 | Android-Kaltstart im ersten Lauf unter Last nicht vergleichbar | **erledigt:** zweiter Lauf Median 1,95 s bis zum ersten Screen (Debug-Build, 45–75 % Last, also eher zu hoch), Grenze ≤ 3,0 s | ebenda |
| B-03 | Android-E2E: Tippen auf „Zur Tageskarte“ kam nicht an | **erledigt:** Fehler im Testskript (Knoten außerhalb des Sichtbereichs mit leeren Bounds, falsche Scrollrichtung), behoben in `scripts/android-evidence.mjs`; zweiter Lauf 13/13 PASS | ebenda |
| B-04 | Capacitor-Bridge loggt im Debug-Build `[object Object]` in Logcat | bekannt, im Release-Build prüfen (V07.5) | `docs/BACKLOG.md` |
| B-05 | Bei 360 px Breite berührt die obere Goldkante der Karte die Datumszeile um wenige Pixel | erledigt (D-42): 13 px statt 8 px Luft über dem Kartenrahmen im Kompaktmodus, „Reise fortsetzen“ bleibt bei 360, 412 und Desktop über der Tab-Leiste | `evidence/v02-b05-360.webp` |
| B-06 | Android: Beim Scrollen läuft Text unter die durchsichtige Statusleiste (vermutlich schon vor V02) | erledigt (D-42): dunkles Band in Höhe der Statusleiste, Android-Lauf 3: 13/13 PASS | `evidence/v02-b06-android.webp` |
| B-07 | Mindestkontrast (R2): Auf „Heute“ läuft freistehender Text beim Scrollen über die unteren Lilien (A02). Fußzeile bei 360 px 1,2–2,8:1 (Tod, Teufel, Wagen), Kernsatz bei 200 % Schrift ohne Halo 2,5–2,96:1 (mit Halo ≥ 3:1). Im V04-Durchlauf einzige Verstöße: Fußzeile bei 360 px und 130 % Schrift 3,47:1, Desktop 4,07:1 | **erledigt** (V04.3, D-59): Der Eigentümer hat aus drei Varianten (A Lilien dunkler, B Panel, C Ecken ausblenden) B gewählt. Die Fußzeile liegt jetzt auf einem ruhigen Panel. Danach kein Lesetext unter 4,5:1, auch nicht bei 360 px und 130 % Schrift; Fußzeile auf Tod, Teufel, Wagen bei 130 % ≥ 4,83:1 | `visual/evidence/v04-b07-varianten-zoom.webp`, `v04-b07-panel-de-360.webp` |
| B-08 | „Heute sichtbar“ lag mit V02 bei +22–27 % zu `main` (normiert ≈ 1.210–1.270 ms, Grenze ≤ 1.250 ms) | unsichtbar verbessert (D-50): eine Runde normiert ≈ 1.168 ms. **Messung gegen die Referenz vor QG-V05** (D-52). Android-Kaltstart V03 1,58 s (Grenze 3,0 s) | `docs/visual/PERFORMANCE.md` „V03.5“ |
| B-09 | Bei 360 × 800 lag beim Wagen „Reise fortsetzen“ 4 px unter der Tab-Leiste (Schlagworte zweizeilig, Kernsatz dreizeilig; bestand schon vor V03) | erledigt (D-51): Die Kartenbühne ist 10 % kleiner, alle 22 Karten DE und EN haben die Hauptaktion über der Tab-Leiste | `visual/evidence/v03-d51-karte-90.webp` |
| B-10 | Orakel bei 360 px und 130 % Schrift (DE): Das lange Wort „Herausforderung“ verbreiterte die mittlere Positionsspalte, „Impuls“ ragte rechts über den Rand; über der gezogenen Legung liefen die drei Positionsnamen ineinander („SITUATIONHERAUSFORDERUNGIMPULS“). Vermutlich seit G2, gefunden mit dem neuen Textprüfer in `scripts/evidence.mjs` und dem Kontaktbogen | erledigt (V03.5): Spalten bleiben gleich breit (`minmax(0, 1fr)`), lange Namen brechen in ihrer Spalte um (`hyphens: auto`, Android trennt „HERAUS-FORDE-RUNG“). Bei normaler Schrift unverändert | `visual/evidence/v03-b10-orakel-130.webp`, `visual/evidence/v03-review-360-de130-412-en.webp` |
| B-11 | Android-Emulator: In den ersten 1–2 s nach dem Start zeigt der Bildschirm Zwischenzustände beim Zeichnen (Lichtschein als graue Fläche, Rahmen halb gezeichnet). Tritt mit 0.2.0 genauso auf, Endbild nach wenigen Sekunden korrekt | Beobachtung, kein Rückschritt; auf echtem Gerät in V07.5 prüfen | `visual/evidence/v03-android-migration.webp` |
| B-13 | Android-Emulator: Die Archetyp-Enthüllung läuft mit 53,2–58,0 fps (7 von 9 Läufen; 41,5 und 43,7 fps in zwei Läufen, während der Emulator mit 2 GB RAM 870 MB ausgelagert hatte). Beim Wechsel vom Fragebogen zur Enthüllung entstehen 1–3 lange Frames in den ersten 550 ms nach dem Tippen, schlechtester Frame 100–333 ms; die strengere Regel aus §6 (≤ 120 ms) hielt nur in 3 von 9 Läufen. Die Animation danach läuft ohne lange Frames. Zwei unsichtbare Versuche brachten nichts und wurden nicht übernommen: Bilder vorab dekodieren (3 Läufe, 83–200 ms), Zustandsänderungen beim Speichern bündeln (4 Läufe, 100–167 ms) | offen; Ursache mit einem Trace des Bildschirmwechsels klären, zusammen mit der Leistungsmessung vor QG-V05 (D-52) | `scripts/android-v04.mjs`, `visual/evidence/v04-android.webp` |
| B-14 | Android-Emulator: Das erste Teilen-Bild (Story) direkt nach dem Fragebogen brauchte in 4 von 19 Läufen ≈ 13,3 s statt 0,36–1,21 s (immer fast genau gleich lang, nicht gezielt reproduzierbar: 6 Diagnoseläufe in Folge ohne Ausreißer). Beitrag online 0,13–0,25 s. Offline direkt nach dem Kaltstart (während die App im Leerlauf vorlädt) Story 0,51–1,65 s und Beitrag 0,16–1,61 s, zusammen 3 von 13 Läufen über 1,5 s. Aufschlüsselung im Normalfall: Schriften ≈ 1 ms, Porträt 130–210 ms, PNG-Kodierung 340–860 ms | offen; Kandidaten: PNG-Kodierung über `toBlob` wartet auf Leerlauf des Hauptthreads, Speicherdruck im Emulator. Mögliche unsichtbare Lösung: `OffscreenCanvas.convertToBlob`. Prüfen vor QG-V05 und auf echtem Gerät (V07.5) | `scripts/android-v04.mjs` |
| B-12 | Nach B-10: Bei 130 % Schrift (DE, 360 px) ist der Name „Herausforderung“ über der gezogenen Legung dreizeilig, die mittlere Karte sitzt dadurch 17 px tiefer als die äußeren (gleich groß, nur nicht auf einer Linie). Bei normaler Schrift auf einer Linie | offen, kosmetisch; wird in V05.2 mit der neuen Legung gelöst (S-10). Mögliche Lösung: Kopfzeilen der drei Spalten als gemeinsame Zeile (CSS-Subgrid) | `visual/evidence/v03-review-360-de130-412-en.webp` |

## Nachweise V04 (Stand 27.11.2026)

| Prüfung | Ergebnis | Beleg |
|---|---|---|
| `npm run check` | PASS: 199 Unit-Tests, Content-Gate 0 Fehler, 0 Warnungen (Module `identity` 211, `archetypes` 125, `chapters` 40, `journey` 136 Schlüssel je Sprache), Start-JS 139,1 kB (V03 132 kB, Grenze 160 kB), größtes Modul `chapters.de` 13,7 kB gz (Grenze 40 kB) | lokaler Lauf |
| E2E (Produktions-Build) | PASS: 27 bestanden, 41 je Projekt bewusst übersprungen, 0 fehlgeschlagen. Neu: „Ich“ → „Warum?“ (8 Summen, 7 Antworten) → Bibliothek (8, eigener markiert) → zweimal Zurück → Teilen (Data-URL, Export ≤ 1,5 s, Download-Name); Reise mit 7 Tagen und Notiz → „Neu“ → Sternkarte mit 21 Sternen → Wochenrückblick mit Notiz und 7 Karten; reduzierte Bewegung (Knopf nach ≤ 800 ms, kein „Überspringen“) | `tests/e2e/identity.spec.ts`, `flow.spec.ts`, `offline.spec.ts` |
| Bildvergleich Teilen-Karte | PASS: Beitrag 4:5 auf ein Viertel verkleinert, je Sprache eine Referenz, ≤ 1 % abweichende Pixel (S-28) | `tests/e2e/identity.spec.ts-snapshots/` |
| Kontrast aller Lesetexte | PASS (nach B-07, D-59): 360 px DE 130 % 533 Texte, 360 px EN 530, 390 px DE 526, 412 px DE 533, 412 px EN 529, je 0 Verstöße; neue Screens (Showcase) 412 px DE 515 und 360 px EN 515 Texte ohne Verstoß. Desktop ist kein Kriterium (D-52), dort 529 Texte ebenfalls ohne Verstoß | `scripts/evidence.mjs --contrast`, `scripts/v04-showcase.mjs --contrast` |
| Layout | PASS: kein Text außerhalb, keine Seitwärtsbewegung, keine abgeschnittenen Knopftexte (alle Durchläufe oben) | ebenda |
| Bildbudget je Screen | PASS: schwerster Screen Grimoire 364 KB (Budget 600 KB) | `scripts/v04-showcase.mjs` |
| Sternkarte V04.5 | PASS: 400 Tage, Scrollen in 90 Frames bei 4× CPU-Drosselung: Median 16,7 ms, p95 16,8 ms, Maximum 16,8 ms zwischen zwei Frames, also jeder Frame im 60-Hz-Takt | `scripts/v04-showcase.mjs --frames` |
| Teilen-Export im Browser | PASS: Story 75–312 ms, Beitrag ≈ 50 ms (Desktop-Chromium) | E2E, Showcase |
| Ablauf Fragebogen | PASS: App-Zeit 2,7 s + 7 × 8 s Lesezeit = 58,7 s (Grenze 75 s) | E2E-Ausgabe |
| Android-Emulator (Pixel 7, Debug-Build) | PASS 15/15 (2 × CHECK Schriftgröße per Screenshot): Erststart, Fragebogen mit sieben Fragen → Enthüllung, Tageskarte, Legung, Grimoire, „Ich“, Zurück-Regeln, Kaltstart behält die Karte, Kaltstart Median 1,49 s (Grenze 3,0 s), Flugmodus, 130 %/200 % Schrift, reduzierte Bewegung, alle Knöpfe beschriftet, Ziele ≥ 48 dp, Einstellungen zurückgesetzt. APK 12,8 MB (Grenze 25 MB; V03 8,1 MB, dazu die B2-Bilder) | `scripts/android-evidence.mjs`, `visual/evidence/v04-android.webp` |
| Android V04: Enthüllung | 53,2–58,0 fps in 7 von 9 Läufen (Kriterium V04.2 ≥ 50 fps); lange Frames beim Bildschirmwechsel, siehe B-13 | `scripts/android-v04.mjs` |
| Android V04: Teilen | Teilen-Blatt offline 8/8 PASS; Export ≤ 1,5 s in den meisten Läufen, Ausreißer siehe B-14 | `scripts/android-v04.mjs` |
| Balance Fragebogen v2 | PASS: 16.384 Kombinationen, Haupt 11,3–14,2 %, Ergänzung 65,6 % (≤ 1 Punkt, ab 4 Antworten; bei übersprungenen Fragen stabil 66–70 %), 56/56 Paare | `tests/unit/archetypes.test.ts` |
| Tabellen-Test Reise Tag 1–400 | PASS | `tests/unit/journey.test.ts` |
| Linse V04.3 | PASS: 176 Sätze je Sprache vorhanden und verschieden, Ergänzung jeden dritten Tag, Datensatz speichert Variante und Ergänzung, Rückfall auf die allgemeine Linse, alte Datensätze unverändert | `tests/unit/lens.test.ts` |
| Hinweis-Logik A6 | PASS: höchstens ein Hinweis pro Tag, Rangfolge, nur gebaute Bereiche (Kapitel, Wochen- und Monatsrückblick, Sternkarte; Jubiläen nicht, S-22), alle Belohnungen bis Tag 730 zugeordnet | `tests/unit/hints.test.ts` |
| „Warum?“ V04.2 | PASS: festes Beispiel exakt, Gründe für keine zweite Stimme, offenes Profil, Übereinstimmung mit der Rechnung für alle 16.384 Kombinationen | `tests/unit/why.test.ts` |
| Profile und Resonanz V04.2 | PASS: jede Karte zugeordnet (nur Tod und Stern doppelt), alle Symbole genutzt, jede Beschreibung nennt ihre drei Karten und das Leitsymbol, Schlüssel DE/EN vollständig | `tests/unit/archetype-profiles.test.ts` |
| Rückblicke V04.5 | PASS: 0, 1 und 30 Einträge ohne Lücken (DE/EN gerendert), Pausen ohne Lücke, Thema bei Gleichstand nach letzter Nutzung, deterministisch, Kapiteltage 3/21/42/63/100 | `tests/unit/review.test.ts`, `tests/unit/journey-screens.test.ts` |
| Teilen-Kern V04.7 | PASS: Typ-Test ohne private Felder, Schlüssel-Whitelist, alle acht Archetypen DE/EN in Story und Feed passend, Branding ≤ 6 %, Text ≥ 4,5:1 | `tests/unit/share.test.ts` |
| Screens als Vorschlag | Bögen für die Durchsicht: Identität 412 px DE, Reise und Teilen 412 px DE, 360 px EN, Android | `visual/evidence/v04-identitaet-de-412.webp`, `v04-reise-teilen-de-412.webp`, `v04-screens-en-360.webp`, `v04-android.webp` |
| B-07 | Varianten A, B, C bei 100 % und 130 % Schrift, nur B ohne Verstoß; B eingebaut (D-59), Fußzeile auf Tod, Teufel, Wagen ohne Verstoß (110 bzw. 108 Texte, 100 % und 130 % Schrift) | `visual/evidence/v04-b07-varianten.webp`, `v04-b07-varianten-zoom.webp`, `v04-b07-panel-de-360.webp` |
| B2-Bilder | PASS: 30 Dateien im Budget (4,2 MB), in `public/` eingebaut | `art/b2/export-report.json`, `visual/evidence/v04-b2-export.webp` |
| Leistung gegen die Referenz | NOT RUN (D-52: vor QG-V05) | – |
| Pages-Vorschau | NOT RUN (braucht Freigabe; Pages baut aus `main`) | – |

## Nächstes Arbeitspaket

V04 ist gebaut, Pull Request [#4](https://github.com/emfau88/Arcana/pull/4) nach `main` ist offen (Merge und Tag `v0.4.0` nach Freigabe). Auftrag D-57: danach V05 Karten, Legungen, Grimoire (`docs/product/MASTER_ROADMAP_V2.md` §3) auf eigenem Branch `feature/v05-karten`, gestapelt auf den V04-Kopf, bis V04 gemergt ist (wie D-52 für V04). Der Eigentümer prüft gesammelt (`SELF_DECISIONS.md`, Nachprüfen). Die frühere G3-Liste (S11–S13) steckt in V07.5.

## Schnellprüfung

```powershell
npm ci
npm run check
npm run test:e2e
```
