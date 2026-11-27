# PROJECT_STATUS — Personal Oracle (Arbeitstitel ARCANA)

**Stand:** 27.11.2026 · **Version:** 0.3.0 · **Phase:** G2 abgeschlossen (PASS). V02 (Tagesorakel) abgeschlossen und gemergt, **Tag `v0.2.1`**. **V03 freigegeben und gemergt** (27.11.2026, `2f1e1de`, **Tag `v0.3.0`**): Datenmodell v2 mit Migration und Sicherungsformat, abgeleitete Schicht, Content-Module, Rechte, globales Designsystem (D-43 bis D-51). QG-V03 PASS mit den Eigentümer-Ausnahmen aus D-52 (B-07 → V04.3, Leistungsmessung → vor QG-V05, Desktop kein Kriterium). Pull Request [#3](https://github.com/emfau88/Arcana/pull/3) gemergt. **V04 läuft** auf `feature/v04-identitaet` (vom Tag `v0.3.0`): V04.1 Fragebogen v2 fertig (D-53), V04.4 Narrenreise als Logik und Texte fertig, Oberfläche wartet auf ein Muster für den Eigentümer (D-54), B2-Bilder als WebP vorbereitet (D-55). Seit 27.11.2026 entscheidet der Agent offene Punkte selbst und hält die Alternativen in `docs/SELF_DECISIONS.md` fest (D-56). **Produktvision V2** (D-38, D-39): Pakete V03–V07 bis Release 1.0 in `docs/product/MASTER_ROADMAP_V2.md`. G3 (Härtung) ist Bulk V07.5

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
| V04 (laufend) | V04.1 PASS, V04.4 Logik/Texte PASS, Rest offen | siehe „Nachweise V04“ unten |
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
- [ ] V04 Identität und Reise auf `feature/v04-identitaet` (`MASTER_ROADMAP_V2.md` §0.1): V04.1 [x], V04.4 Logik und Texte [x], V04.2/V04.3/V04.5–V04.7 offen.
- [x] Schwelle der Ergänzung: im Auftrag des Eigentümers selbst entschieden, höchstens 1 Punkt Abstand ab 4 Antworten (D-53; Vergleich und Alternativen in `SELF_DECISIONS.md` S-01).
- [x] Reisetexte: Eigentümer 27.11.2026 „nach eigenem Ermessen, später optimieren“ (D-54, S-02); Feinschliff im Lektorat.
- [ ] Bei Gelegenheit: selbst entschiedene Punkte durchsehen (`docs/SELF_DECISIONS.md`, D-56).
- [ ] **Eigentümer:** Angebots-Panel „Drei neue Fragen“ im Profil ansehen (bestehende Bausteine, `visual/evidence/v04-angebot-profil-360.webp`).
- [ ] **Eigentümer:** erstes Muster für die neuen V04-Screens (Porträt-Enthüllung, „Ich“, Sternkarte, Meilenstein-Moment, Teilen-Karte), bevor sie gebaut werden.
- [x] **Bild-Bulk B2** geliefert (11/11) und als WebP im Budget exportiert (`art/b2/`, D-55); Einbau mit den V04-Screens.
- [ ] Offene Produktentscheidungen E8–E20: `MASTER_ROADMAP_V2.md` §9 (E9, E19, E20 entschieden; E8 offen).
- [ ] **Rückmeldung des Eigentümers** zum G2-Bericht (G3 ist jetzt Bulk V07.5).
- [ ] Archetyp-Sigillen und App-Icon an Deck v2 angleichen (noch Vektorstil, `BACKLOG.md`).
- [ ] Kaltstart im Release-Build und auf echtem Gerät messen (V07.5). Emulator mit V02: Median 1,95 s unter Rechnerlast (vorher 2,4 s).
- [ ] Menschliches Lektorat der Texte vor dem Release (E18).
- [ ] D-08 (geschlechtsinklusive DE-Archetypnamen) wartet noch auf ein Eigentümerurteil.
- [ ] Name „ARCANA“ und App-ID festlegen (E11, vor dem geschlossenen Test).
- [ ] TalkBack manuell prüfen (V07.5). Bisher nicht manuell geprüft. Als Ersatz wurden die Accessibility-Labels per uiautomator geprüft (G3).

## Bekannte offene Fehler und Grenzfälle (Stand V03, 27.11.2026)

| # | Befund | Status | Wo |
|---|---|---|---|
| B-01 | Enthüllung, wenn sofort beim Fertigladen getippt wird: 46 fps, 2 Ruckler, schlechtester Frame 183 ms (Grenze ≥ 50 fps, ≤ 120 ms). Mit 300 ms Abstand 53–54 fps | **erledigt** (D-41): Schriften werden vorgewärmt, solange die Karte verdeckt ist; danach schlechtester Frame 50 ms, 0 Ruckler | `docs/visual/PERFORMANCE.md` „V02 final“ |
| B-02 | Android-Kaltstart im ersten Lauf unter Last nicht vergleichbar | **erledigt:** zweiter Lauf Median 1,95 s bis zum ersten Screen (Debug-Build, 45–75 % Last, also eher zu hoch), Grenze ≤ 3,0 s | ebenda |
| B-03 | Android-E2E: Tippen auf „Zur Tageskarte“ kam nicht an | **erledigt:** Fehler im Testskript (Knoten außerhalb des Sichtbereichs mit leeren Bounds, falsche Scrollrichtung), behoben in `scripts/android-evidence.mjs`; zweiter Lauf 13/13 PASS | ebenda |
| B-04 | Capacitor-Bridge loggt im Debug-Build `[object Object]` in Logcat | bekannt, im Release-Build prüfen (V07.5) | `docs/BACKLOG.md` |
| B-05 | Bei 360 px Breite berührt die obere Goldkante der Karte die Datumszeile um wenige Pixel | erledigt (D-42): 13 px statt 8 px Luft über dem Kartenrahmen im Kompaktmodus, „Reise fortsetzen“ bleibt bei 360, 412 und Desktop über der Tab-Leiste | `evidence/v02-b05-360.webp` |
| B-06 | Android: Beim Scrollen läuft Text unter die durchsichtige Statusleiste (vermutlich schon vor V02) | erledigt (D-42): dunkles Band in Höhe der Statusleiste, Android-Lauf 3: 13/13 PASS | `evidence/v02-b06-android.webp` |
| B-07 | Mindestkontrast (R2): Auf „Heute“ läuft freistehender Text beim Scrollen über die unteren Lilien (A02). Fußzeile bei 360 px 1,2–2,8:1 (Tod, Teufel, Wagen), Kernsatz bei 200 % Schrift ohne Halo 2,5–2,96:1 (mit Halo ≥ 3:1). Alle übrigen Screens ≥ 4,9:1 (nach D-51 bei 360 px DE ≥ 5,0:1) | **verschoben nach V04.3** (Eigentümer, D-49, D-52): sichtbare Lösung wird dort gewählt (Lilien abdunkeln, Panel unter der Fußzeile oder Ecken beim Scrollen ausblenden). Desktop-Befund entfällt | `today-showcase.mjs --contrast`, D-49 |
| B-08 | „Heute sichtbar“ lag mit V02 bei +22–27 % zu `main` (normiert ≈ 1.210–1.270 ms, Grenze ≤ 1.250 ms) | unsichtbar verbessert (D-50): eine Runde normiert ≈ 1.168 ms. **Messung gegen die Referenz vor QG-V05** (D-52). Android-Kaltstart V03 1,58 s (Grenze 3,0 s) | `docs/visual/PERFORMANCE.md` „V03.5“ |
| B-09 | Bei 360 × 800 lag beim Wagen „Reise fortsetzen“ 4 px unter der Tab-Leiste (Schlagworte zweizeilig, Kernsatz dreizeilig; bestand schon vor V03) | erledigt (D-51): Die Kartenbühne ist 10 % kleiner, alle 22 Karten DE und EN haben die Hauptaktion über der Tab-Leiste | `visual/evidence/v03-d51-karte-90.webp` |
| B-10 | Orakel bei 360 px und 130 % Schrift (DE): Das lange Wort „Herausforderung“ verbreiterte die mittlere Positionsspalte, „Impuls“ ragte rechts über den Rand; über der gezogenen Legung liefen die drei Positionsnamen ineinander („SITUATIONHERAUSFORDERUNGIMPULS“). Vermutlich seit G2, gefunden mit dem neuen Textprüfer in `scripts/evidence.mjs` und dem Kontaktbogen | erledigt (V03.5): Spalten bleiben gleich breit (`minmax(0, 1fr)`), lange Namen brechen in ihrer Spalte um (`hyphens: auto`, Android trennt „HERAUS-FORDE-RUNG“). Bei normaler Schrift unverändert | `visual/evidence/v03-b10-orakel-130.webp`, `visual/evidence/v03-review-360-de130-412-en.webp` |
| B-11 | Android-Emulator: In den ersten 1–2 s nach dem Start zeigt der Bildschirm Zwischenzustände beim Zeichnen (Lichtschein als graue Fläche, Rahmen halb gezeichnet). Tritt mit 0.2.0 genauso auf, Endbild nach wenigen Sekunden korrekt | Beobachtung, kein Rückschritt; auf echtem Gerät in V07.5 prüfen | `visual/evidence/v03-android-migration.webp` |
| B-12 | Nach B-10: Bei 130 % Schrift (DE, 360 px) ist der Name „Herausforderung“ über der gezogenen Legung dreizeilig, die mittlere Karte sitzt dadurch 17 px tiefer als die äußeren (gleich groß, nur nicht auf einer Linie). Bei normaler Schrift auf einer Linie | offen, kosmetisch; wird in V05.2 mit der neuen Legung gelöst (S-10). Mögliche Lösung: Kopfzeilen der drei Spalten als gemeinsame Zeile (CSS-Subgrid) | `visual/evidence/v03-review-360-de130-412-en.webp` |

## Nachweise V04 (Stand 27.11.2026)

| Prüfung | Ergebnis | Beleg |
|---|---|---|
| `npm run check` | PASS: 142 Unit-Tests, Content-Gate 0 Fehler (Modul `identity` 35, `journey` 96 Schlüssel je Sprache), Start-JS 133,6 kB (Grenze 160 kB), `journey` als eigenes Modul 5,8/5,3 kB gz | lokaler Lauf |
| E2E (Produktions-Build) | PASS: 23 bestanden, 33 je Projekt bewusst übersprungen, 0 fehlgeschlagen; neu: sieben Fragen, Zeitmessung, E9-Angebot | `tests/e2e/flow.spec.ts` |
| Balance Fragebogen v2 | PASS: 16.384 Kombinationen, Haupt 11,3–14,2 %, Ergänzung 65,6 % (≤ 1 Punkt, ab 4 Antworten; bei übersprungenen Fragen stabil 66–70 %), 56/56 Paare | `tests/unit/archetypes.test.ts` |
| Ablauf Fragebogen | PASS: App-Zeit 2,7 s + 7 × 8 s Lesezeit = 58,7 s (Grenze 75 s) | E2E-Ausgabe |
| Tabellen-Test Reise Tag 1–400 | PASS | `tests/unit/journey.test.ts` |
| Layout Fragen 5–7 bei 360 px, 130 % Schrift DE/EN | PASS: kein Text außerhalb, keine Seitwärtsbewegung | `visual/evidence/v04-fragen-5-7-360-130.webp` |
| Evidence-Durchlauf 360 DE 130 % und 412 EN | PASS: keine Layout- oder Kontrastfehler, keine externen Anfragen | lokaler Lauf |
| B2-Export | PASS: 30 Dateien im Budget, 4,2 MB | `art/b2/export-report.json`, `visual/evidence/v04-b2-export.webp` |
| Android-Emulator mit V04 | NOT RUN (folgt zum QG-V04; die Prüfskripte sind auf sieben Fragen vorbereitet) | – |
| Leistung gegen die Referenz | NOT RUN (D-52: vor QG-V05) | – |
| Regelvergleich Ergänzung | 13 Regeln über alle vollständigen und teilweisen Antwortsätze verglichen | `scripts/analyze-complement.ts`, `SELF_DECISIONS.md` S-01 |
| V03 nach `main` | PASS: Merge-Commit `2f1e1de` ohne Konflikte, Tag `v0.3.0` gepusht | GitHub #3 |

## Nächstes Arbeitspaket

V04 Identität und Reise (`docs/product/MASTER_ROADMAP_V2.md` §3) auf `feature/v04-identitaet` (vom Tag `v0.3.0`). Ohne Eigentümer möglich: V04.3-Linsentexte (176 je Sprache) und die Logik für die Hinweise (A6). Mit Eigentümer: Muster für die neuen Screens (V04.2, V04.4-Oberfläche, V04.5–V04.7), B-07-Lösung in V04.3. Die frühere G3-Liste (S11–S13) steckt in V07.5.

## Schnellprüfung

```powershell
npm ci
npm run check
npm run test:e2e
```
