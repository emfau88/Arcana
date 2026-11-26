# PROJECT_STATUS — Personal Oracle (Arbeitstitel ARCANA)

**Stand:** 26.11.2026 · **Version:** 0.2.1 · **Phase:** G2 abgeschlossen (PASS). **Visual Overhaul läuft:** V00/V01 freigegeben, V02 (Tagesorakel) **abgeschlossen**: freigegeben am 26.11.2026, B-05/B-06 behoben (D-42), gemergt nach `main` (`553c5d9`), **Tag `v0.2.1`** als Rücksprungpunkt. **V03 läuft** auf `feature/v03-fundament`. **Produktvision V2** freigegeben (D-38, D-39): Pakete V03–V07 bis Release 1.0 in `docs/product/MASTER_ROADMAP_V2.md` · **Nächster Schritt:** V03.5 Globales Designsystem (V03.1 Datenmodell v2, V03.2 Abgeleitete Schicht, V03.3 Content-Module und V03.4 Rechte fertig, D-44 bis D-48; E9 und E20 entschieden, D-47). G3 (Härtung) ist jetzt Bulk V07.5

Ein neuer Agent liest zuerst diese Datei, dann `AGENTS.md`, `docs/DECISIONS.md` und `docs/GATE_REPORTS.md`.

## Orte

| Was | Wo |
|---|---|
| Projektroot (neu, isoliert) | `%USERPROFILE%\Documents\PersonalOracle-Web` |
| Git | eigenes Repo, Remote `https://github.com/emfau88/Arcana` (öffentlich). `main` = freigegebener Stand (0.2.1, Tag `v0.2.1`), `feature/v03-fundament` = V03 in Arbeit, `design/visual-overhaul` = V02 (abgeschlossen, bleibt als Referenz). Sicherung je Paket mit Commits, Push, Nachweisen und Tags (D-40, `AGENTS.md`) |
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
| G3–G5 | NOT RUN | G3 startet erst nach Rückmeldung zum G2-Bericht |

## Was funktioniert (Browser und Android-Emulator)

- First-Run mit Willkommen, 4 freiwilligen Fragen, Wahl aus 6 Themen und Archetyp-Enthüllung. Überspringen führt zum neutralen Profil.
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
- [ ] V03 Fundament (`MASTER_ROADMAP_V2.md` §0.1, braucht keine Bilder) auf `feature/v03-fundament`.
- [ ] **Bild-Bulk B2** (A05 + A07 als Stilprobe, dann A08–A14, A06, A19) kann parallel angefordert werden: `docs/visual/ASSET_REQUESTS.md` §0.1.
- [ ] Offene Produktentscheidungen E8–E20: `MASTER_ROADMAP_V2.md` §9 (E19 entschieden, D-43; E8/E9/E20 vor V04).
- [ ] **Rückmeldung des Eigentümers** zum G2-Bericht (G3 ist jetzt Bulk V07.5).
- [ ] Archetyp-Sigillen und App-Icon an Deck v2 angleichen (noch Vektorstil, `BACKLOG.md`).
- [ ] Kaltstart im Release-Build und auf echtem Gerät messen (V07.5). Emulator mit V02: Median 1,95 s unter Rechnerlast (vorher 2,4 s).
- [ ] Menschliches Lektorat der Texte vor dem Release (E18).
- [ ] D-08 (geschlechtsinklusive DE-Archetypnamen) wartet noch auf ein Eigentümerurteil.
- [ ] Name „ARCANA“ und App-ID festlegen (E11, vor dem geschlossenen Test).
- [ ] TalkBack manuell prüfen (V07.5). Bisher nicht manuell geprüft. Als Ersatz wurden die Accessibility-Labels per uiautomator geprüft (G3).

## Bekannte offene Fehler und Grenzfälle (Stand V02, 26.11.2026)

| # | Befund | Status | Wo |
|---|---|---|---|
| B-01 | Enthüllung, wenn sofort beim Fertigladen getippt wird: 46 fps, 2 Ruckler, schlechtester Frame 183 ms (Grenze ≥ 50 fps, ≤ 120 ms). Mit 300 ms Abstand 53–54 fps | **erledigt** (D-41): Schriften werden vorgewärmt, solange die Karte verdeckt ist; danach schlechtester Frame 50 ms, 0 Ruckler | `docs/visual/PERFORMANCE.md` „V02 final“ |
| B-02 | Android-Kaltstart im ersten Lauf unter Last nicht vergleichbar | **erledigt:** zweiter Lauf Median 1,95 s bis zum ersten Screen (Debug-Build, 45–75 % Last, also eher zu hoch), Grenze ≤ 3,0 s | ebenda |
| B-03 | Android-E2E: Tippen auf „Zur Tageskarte“ kam nicht an | **erledigt:** Fehler im Testskript (Knoten außerhalb des Sichtbereichs mit leeren Bounds, falsche Scrollrichtung), behoben in `scripts/android-evidence.mjs`; zweiter Lauf 13/13 PASS | ebenda |
| B-04 | Capacitor-Bridge loggt im Debug-Build `[object Object]` in Logcat | bekannt, im Release-Build prüfen (V07.5) | `docs/BACKLOG.md` |
| B-05 | Bei 360 px Breite berührt die obere Goldkante der Karte die Datumszeile um wenige Pixel | erledigt (D-42): 13 px statt 8 px Luft über dem Kartenrahmen im Kompaktmodus, „Reise fortsetzen“ bleibt bei 360, 412 und Desktop über der Tab-Leiste | `evidence/v02-b05-360.webp` |
| B-06 | Android: Beim Scrollen läuft Text unter die durchsichtige Statusleiste (vermutlich schon vor V02) | erledigt (D-42): dunkles Band in Höhe der Statusleiste, Android-Lauf 3: 13/13 PASS | `evidence/v02-b06-android.webp` |
| B-07 | Mindestkontrast (R2, gilt ab QG-V03): bei 200 % Schrift liegt der Kernsatz über der hellen Sonnenkarte bei 3,0:1, am Desktop (EN, 1280 px) die kleine Zeile über dem Kartentitel bei 4,4:1. Bei 412 und 360 px ist jeder Text ≥ 4,9:1 | offen, optische Korrektur in V03.5 nach Rückfrage | `today-showcase.mjs --contrast` |
| B-08 | „Heute sichtbar“ +22–27 % zu `main` (normiert ≈ 1.210–1.270 ms), Grenze ab QG-V03 ≤ 1.250 ms | offen, V03.5 (unsichtbar optimieren) | `docs/visual/PERFORMANCE.md` |

## Nächstes Arbeitspaket (nach Freigabe)

V03 Fundament und globales Designsystem (`docs/product/MASTER_ROADMAP_V2.md` §3): Datenmodell v2 mit Sicherungsformat, Navigation, Designsystem auf allen Screens, Mindestkontrast und Leistungsbudgets im Gate. Die frühere G3-Liste (S11–S13) steckt in V07.5.

## Schnellprüfung

```powershell
npm ci
npm run check
npm run test:e2e
```
