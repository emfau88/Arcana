# PROJECT_STATUS — Personal Oracle (Arbeitstitel ARCANA)

**Stand:** 27.11.2026 · **Version:** 0.4.1 (27.11.2026: Textdurchsicht aller Texte in DE und EN und Korrekturen aus dem Design-Plan gemergt, Pull Requests [#5](https://github.com/emfau88/Arcana/pull/5) und [#6](https://github.com/emfau88/Arcana/pull/6), Merge-Commit `dae2854`, **Tag `v0.4.1`**, D-62, D-63) · **Phase:** G2 abgeschlossen (PASS). V02 (Tagesorakel) abgeschlossen und gemergt, **Tag `v0.2.1`**. **V03 freigegeben und gemergt** (27.11.2026, `2f1e1de`, **Tag `v0.3.0`**): Datenmodell v2 mit Migration und Sicherungsformat, abgeleitete Schicht, Content-Module, Rechte, globales Designsystem (D-43 bis D-51). QG-V03 PASS mit den Eigentümer-Ausnahmen aus D-52 (B-07 → V04.3, Leistungsmessung → vor QG-V05, Desktop kein Kriterium). Pull Request [#3](https://github.com/emfau88/Arcana/pull/3) gemergt. **V04 freigegeben und gemergt** (27.11.2026, `8b2419b`, **Tag `v0.4.0`**, Pull Request [#4](https://github.com/emfau88/Arcana/pull/4), D-61), Pages-Vorschau aktualisiert: Fragebogen v2 (D-53), Enthüllung, „Ich“, „Warum?“, Bibliothek der acht, Linsen, Narrenreise mit Meilenstein-Moment, Sternkarte, Rückblicke, Kapitel und Teilen-Karte; alle neuen Screens als Vorschlag aus vorhandenen Bausteinen auf den B2-Bildern (D-58). B-07 ist mit Variante B behoben (Eigentümer, D-59), B-13 und B-14 sind behoben (S-30, S-31). Die Prüfliste „Nachprüfen“ in `SELF_DECISIONS.md` bleibt für Rückmeldungen offen. V05 ist auf `feature/v05-karten` geplant (S-29) und beginnt erst auf Zuruf des Eigentümers (D-60). Seit D-57 stellt der Agent V04 im Alleingang fertig; neue Screens entstehen als Vorschlag zur gesammelten Durchsicht. Seit 27.11.2026 entscheidet der Agent offene Punkte selbst und hält die Alternativen in `docs/SELF_DECISIONS.md` fest (D-56). **Produktvision V2** (D-38, D-39): Pakete V03–V07 bis Release 1.0 in `docs/product/MASTER_ROADMAP_V2.md`. G3 (Härtung) ist Bulk V07.5

Ein neuer Agent liest zuerst diese Datei, dann `AGENTS.md`, `docs/DECISIONS.md` und `docs/GATE_REPORTS.md`.

## Orte

| Was | Wo |
|---|---|
| Projektroot (neu, isoliert) | `%USERPROFILE%\Documents\PersonalOracle-Web` |
| Git | eigenes Repo, Remote `https://github.com/emfau88/Arcana` (öffentlich). `main` = freigegebener Stand (0.4.1, Tag `v0.4.1`), `feature/v05-karten` = V05 (bisher nur Plan und Doku, kein V05-Code), `feature/v04-identitaet`, `feature/v03-fundament` und `design/visual-overhaul` = V04, V03 und V02 (gemergt, bleiben als Referenz), `fix/v04-texte` und `fix/v041-layout` = 0.4.1 (gemergt). Sicherung je Paket mit Commits, Push, Nachweisen und Tags (D-40, `AGENTS.md`) |
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
| QG-V04 | **PASS, freigegeben** (D-61): Funktion, Kontrast (B-07, D-59), Android (B-13, B-14, S-30, S-31); Merge `8b2419b`, Tag `v0.4.0`, Pages-Vorschau aktualisiert. Prüfliste „Nachprüfen“ bleibt für Rückmeldungen | siehe „Nachweise V04“ unten |
| 0.4.1 (kein Paket-Gate) | **PASS, gemergt** (D-62, D-63): Textdurchsicht und Design-Plan Punkte 1, 3, 4; Merge `dae2854`, Tag `v0.4.1` | Check 204 Unit-Tests, E2E 32 bestanden, Android 13/13, Kaltstart 1,55 s, APK 12,6 MB; siehe „Korrekturen aus dem Design-Plan“ unten |
| G3–G5 | NOT RUN | G3 ist Bulk V07.5 |

## Was funktioniert (Browser und Android-Emulator)

Stand 0.4.1 (27.11.2026).

- **Erste Sitzung:** Willkommen, 7 freiwillige Fragen (Fragebogen v2), Wahl aus 6 Themen und Archetyp-Enthüllung mit Porträt (4,3 s, überspringbar, bei reduzierter Bewegung statisch). Überspringen führt zum offenen Profil. Die Hauptaktion bleibt auf jedem Schritt im ersten Bildschirm (0.4.1).
- **Identität („Ich“):** Hauptarchetyp und zweite Stimme (bei höchstens 1 Punkt Abstand ab 4 Antworten), ausführliches Profil in Absätzen, „Warum?“ als Rechnung aus den eigenen Antworten, Bibliothek der acht Archetypen, Archetyp selbst wählen oder offen lassen, Fragen erneut beantworten. Bestehende Profile aus dem kürzeren Fragebogen bleiben gültig und sehen das Angebot „Drei neue Fragen“ (E9, D-53).
- **Deck:** 22 gemalte Karten plus Rückseite (Deck v2), 6 Themen, alle Texte in DE und EN, in beiden Sprachen vollständig durchgesehen (D-62).
- **Tageskarte:** eine Karte pro lokalem Kalendertag (auch über Mitternacht und nach dem Zurückkehren aus dem Hintergrund), freiwillige Enthüllung, Botschaft, Linse je Archetyp und Karte (zweite Stimme jeden dritten Reisetag), Reflexionsfrage, Mini-Ritual, Notiz, höchstens ein Hinweis pro Tag. Nach Neustart erscheint dieselbe Karte.
- **Reise:** Reisetag aus allen zählenden Handlungen (abgeleitet, nie gezählt), Narrenreise mit 63 Stationen, Meilensteine mit Meilenstein-Moment, Sternkarte mit Liste als Textalternative, Wochen- und Monatsrückblick aus eigenen Daten, Archetyp-Kapitel I–IV und „Zwei Stimmen“. Keine Streaks, kein Verlust bei Pausen.
- **Drei-Karten-Orakel** mit Situation, Herausforderung und Impuls in allen 6 Themen, einzeln aufdeckbar, speichern oder verwerfen. Die Deutung wird unveränderlich gespeichert. Ein halb aufgedecktes Reading wird wiederhergestellt.
- **Grimoire** mit Sammlung (x/22), Verlauf, Detailansicht, Reise, Rückblicken, Kapiteln und „Neu“-Markierungen. Das Buch mit sieben Kapiteln kommt in V05.3.
- **Teilen:** Archetypkarte als Story (1080 × 1920) und Beitrag (1080 × 1350) über das Teilen-Blatt des Systems, ohne private Felder, auch offline.
- **Einstellungen** (eigene Seite unter „Ich“): Thema, Sprache (DE/EN), Bewegung, „Alle Daten löschen“.
- **Daten:** Schema 2 mit additiver Migration aus 0.2, Sicherungsformat als Typ mit Prüfer (die Oberfläche dazu kommt in V07.3), Rechteabfrage ohne Billing.
- **Android:** gebündelter Build ohne Remote-URL, offline lauffähig. Zurück-Regeln, Insets, Schriftgrößen 130 %/200 % und reduzierte Bewegung sind geprüft; das Update von 0.3.0 auf 0.4.1 behält die Daten.

**Noch nicht gebaut (Plan bis 1.0):** Kartenseite mit Vertiefung, Rollen-Legungen, Grimoire als Buch, Tagebuch mit Suche, Kartenrücken (V05); Entdecken-Tab, Numerologie, Engelszahlen, Symbol-Lexikon (V06); weitere Teilen-Vorlagen, Erinnerung, Sicherung und Wiederherstellung, Edition, Härtung, Store (V07).

## Offene Punkte

Fortschritt je Paket und Bulk als Checkliste: `docs/product/MASTER_ROADMAP_V2.md` §0.1.

- [x] **Freigabe des Tagesorakel-Screens (V02)** durch den Eigentümer (26.11.2026), B-05/B-06 behoben (D-42).
- [x] PR-Merge nach `main` (`553c5d9`), Tag `v0.2.1`, Branch `feature/v03-fundament` angelegt.
- [x] V03 Fundament auf `feature/v03-fundament` (Version 0.3.0), QG-V03 mit Ausnahmen D-52.
- [x] **Freigabe und Merge von V03** durch den Eigentümer (27.11.2026, Merge-Commit `2f1e1de`), Tag `v0.3.0`, `main` in `feature/v04-identitaet` gemergt.
- [x] V04 Identität und Reise (`MASTER_ROADMAP_V2.md` §0.1): freigegeben und gemergt (27.11.2026, Pull Request [#4](https://github.com/emfau88/Arcana/pull/4), `8b2419b`, Tag `v0.4.0`, D-61).
- [x] **Eigentümer:** B-07-Variante gewählt: B, Panel unter der Fußzeile (27.11.2026, D-59), eingebaut und geprüft.
- [x] **Eigentümer:** V04 freigegeben (27.11.2026, D-61). Die Prüfliste „Nachprüfen“ in `SELF_DECISIONS.md` bleibt als Liste für spätere Rückmeldungen.
- [ ] **Eigentümer:** Start von V05 freigeben (D-60); Plan in S-29.
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
- [x] **0.4.1** gemergt (27.11.2026, `dae2854`), Tag `v0.4.1`: Textdurchsicht (#5, D-62) und Design-Plan Punkte 1, 3 und 4 (#6, D-63); danach `main` in `feature/v05-karten` gemergt. Der Tag `v0.4.0` trug intern noch Version 0.3.0; 0.4.1 ist die erste Version mit stimmender Nummer in Paket, Android-Projekt und App.
- [ ] Design-Plan (`SELF_DECISIONS.md` S-39 bis S-41, D-63): Punkte 2 (Bühnen), 5 (Enthüllung als Moment) und 6 (Sternkarte) an Mustern entscheiden, bevor V05 die Screens baut. **Die Muster liegen vor** (27.11.2026, Branch `muster/design-plan`, je zwei Varianten als echte Screens, S-42; Aufnahmen im Design-Plan des Eigentümers), **entschieden vom Eigentümer am 27.11.2026 (D-64): Punkt 2 Variante A, Punkt 5 Variante B, Punkt 6 Variante A**; der Einbau in V05 ist offen; 7 kommt mit V05.3; 8 (Mindestschrift 12 px) und 9 (Prüfbreite 375 px, automatische Prüfung je Pull Request) sind noch nicht beauftragt.
- [ ] **Eigentümer:** Kontotyp und Erstellungsdatum des Play-Kontos nennen (alte App überschreiben oder neuer Eintrag, E11/E17). Die alte App hat laut Eigentümer keine Nutzer.
- [x] Live-Seite des Eigentümers (Claude-Dokument „ARCANA · Masterplan V2“) auf den Stand 0.4.1 gebracht (27.11.2026): Fortschritt, V04 im Detail, 0.4.1, nächste Schritte.
- [x] Doku-Altlasten bereinigt (27.11.2026): README (stand auf G2/0.2.0), Roadmap §0, §3, §5, §9 und §10, `ASSET_REQUESTS.md` §0 und §0.1, `GATE_REPORTS.md` (Berichte je Paket ergänzt), „Orte“ und „Was funktioniert“ in dieser Datei. Der Stand liegt jetzt auch auf `main`.

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
| B-13 | Android-Emulator: Beim Wechsel vom Fragebogen zur Archetyp-Enthüllung entstanden zwei lange Frames (bei ≈ +100 ms und ≈ +240 ms nach dem Tippen, 117–233 ms). Ursache (Trace, `scripts/android-trace.mjs`): Der Hauptthread ist fast frei; der GPU-Thread des Emulators rastert den neuen Screen in Schritten zu 15–21 ms. Beim Tippen laden erst die kursive Serifenschrift, der Raum A05 und das Porträt. Einzelne Ebenen auszublenden (Animation, Vektorlandschaft, Schrift-Halos, Bild, Porträt) änderte nichts | **erledigt** (S-31): Schrift, Raum und Porträts laden schon auf dem Themenschritt. Danach 56,6–58,8 fps in 7 von 7 Läufen (Kriterium V04.2 ≥ 50 fps), meist nur noch ein langer Frame (117–183 ms) direkt beim Wechsel. Diesen Frame zeigt der Emulator bei jedem Wechsel auf einen bildreichen Screen, auch beim Tab-Wechsel auf „Heute“ (167–233 ms) und „Grimoire“ (100–117 ms), die es schon vor V04 gab. Die Grenze ≤ 120 ms aus §6 gilt unter den Referenzbedingungen im Browser; Prüfung auf einem echten Gerät in V07.5 | `visual/perf/v04-android-b13-b14.json`, `scripts/android-trace.mjs` |
| B-14 | Android-Emulator: Das erste Teilen-Bild direkt nach dem Fragebogen brauchte manchmal ≈ 13,3 s statt ≤ 1,5 s (4 von 19 Läufen, heute 2 von 2 reproduziert). Ursache (Trace): Die Karte war nach ≈ 0,5 s gezeichnet, danach wartete die PNG-Kodierung. Chromium kodiert `toBlob` auf dem Hauptthread nur in Leerlaufphasen; auf einer ganz ruhigen Seite gibt es keine, dann greifen feste Fristen (Android: 4 s + 9 s) | **erledigt** (S-30): Die PNG-Kodierung läuft in einem kleinen Worker (`OffscreenCanvas.convertToBlob`), `toBlob` bleibt als Rückfall. Danach im selben Ablauf 230–299 ms; Story online 288–311 ms, offline nach Kaltstart 479–639 ms, Beitrag 94–137 ms (7 von 7 Läufen ≤ 1,5 s). Bild unverändert (Bildvergleich im E2E) | `visual/perf/v04-android-b13-b14.json`, `tests/e2e/identity.spec.ts` |
| B-12 | Nach B-10: Bei 130 % Schrift (DE, 360 px) ist der Name „Herausforderung“ über der gezogenen Legung dreizeilig, die mittlere Karte sitzt dadurch 17 px tiefer als die äußeren (gleich groß, nur nicht auf einer Linie). Bei normaler Schrift auf einer Linie | offen, kosmetisch; wird in V05.2 mit der neuen Legung gelöst (S-10). Mögliche Lösung: Kopfzeilen der drei Spalten als gemeinsame Zeile (CSS-Subgrid) | `visual/evidence/v03-review-360-de130-412-en.webp` |

## Textdurchsicht V04 (27.11.2026, Branch `fix/v04-texte`, D-62)

Der Eigentümer hat die Textprüfung von V04 dem Agenten übertragen. Gelesen: alle V04-Texte vollständig in DE und EN (8 Profile mit Enthüllungssätzen, 176 Linsen, 136 Reise- und Rückblicktexte, 40 Kapitel je Sprache). Urteil: Ton einheitlich und ruhig, keine Vorhersagen, keine Druckwörter, Schatten als Fragen. Für V04 fehlen keine Texte; bewusst nicht geschrieben sind die Edition-Texte (S-15) und die Jubiläums-Rückblicke (S-22).

| # | Befund | Korrektur | Entscheidung |
|---|---|---|---|
| T-01 | Rückblick nannte wiederkehrende Karten als nackten Titel: „Der Tod ist dir 3-mal begegnet“ (EN „Death came to you 3 times“); bei „Die Liebenden“ war das Verb falsch (drei von vier Bausteinen) | „Die Karte „{card}“ …“ / “The card “{card}” …” | S-35 |
| T-02 | Linse Verwandelnde × Tod: „Der Tod ist dir vertraut wie eine Werkstatt“ | „Die Karte Tod ist dir vertraut …“ / “The Death card …” | S-35 |
| T-03 | „Als Suchende gehst du …“ sprach die Person 39-mal weiblich an (8 Profile, 31 Kapitel), obwohl D-08 geschlechtsinklusive Namen will | Anrede ohne „als <Name>“; die Namen bleiben | S-32 |
| T-04 | 138 von 176 Linsen je Sprache hielten zwei Hauptsätze mit Semikolon zusammen (Folge der Ein-Satz-Regel) | zwei schlichte Sätze; Regel 1–2 Sätze | S-33 |
| T-05 | 12 Kapitelstellen beschrieben Bilder der klassischen Karten (Kind auf dem Pferd, tanzende Gestalt, Gestalten in Ketten), das gemalte Deck zeigt aber keine Figuren | beschrieben wird, was das Deck zeigt (Sonnenblumen, Erde im Kranz, offene Fesseln …) | S-34 |
| T-06 | Enthüllungssatz und erster Satz der Beschreibung wiederholten die Essenz fast wörtlich (z. B. Weise dreimal „Du suchst das Verstehen hinter den Dingen“) | acht Enthüllungssätze je Sprache neu, dazu die Beschreibungsanfänge, die die Essenz wiederholten (DE fünf, EN vier) | S-36 |
| T-07 | „In der Bildsprache dieser App“ achtmal | „In diesem Grimoire stehen dir drei Karten besonders nah“ | S-34 |
| T-08 | Verrenkte Satzanfänge durch die Abwechslungsregel („Gestalten möchte in dir auch eine schaffende Seite“), zwei unklare Bezüge (Station XV und XX, Wiederkehr) | natürliche Wortstellung | – |
| T-09 | EN: Germanismen („On the way it shows who …“, „Like a red thread“), „who“ für Karten ohne Person (Stern, Mond, Rad …), sechs Schlussfragen mit nachgestelltem „soon“ | idiomatisches Englisch | – |

Prüfungen auf dem Branch (27.11.2026): `npm run check` PASS (200 Unit-Tests, Content-Gate 0 Fehler und 0 Warnungen, Start-JS 139,4 kB, größtes Modul `chapters.de` 13,6 kB gz); E2E auf dem Produktions-Build PASS, nach beiden Durchgängen je 27 bestanden, 41 bewusst übersprungen, 0 fehlgeschlagen ( der Bildvergleich der Teilen-Karte ist unverändert, sie zeigt Name, Essenz und Stärken). Android-Emulator und Leistung gegen die Referenz: NOT RUN (reine Textänderung, kein neuer Code im Startpfad). **Zweiter Durchgang (Eigentümer 27.11.2026: auch die übrigen Texte):** alle Kartentexte aus G2 (22 Karten: Essenz, 132 Tagesbotschaften, 66 Positionstexte, Reflexion, Ritual), Schlagworte, Themen, Fragebogen und sämtliche Oberflächentexte in `src/i18n/`, je DE und EN. Die Kartentexte sind gut und brauchten wenig:

| # | Befund | Korrektur | Entscheidung |
|---|---|---|---|
| T-10 | Fünf Tagesbotschaften behaupteten etwas über die Lage der Person („Ein Übergang ist fast geschafft“, „Jetzt ist ein guter Moment …“, „Vor dir liegt eine Wahl …“) | mit „vielleicht“ als Möglichkeit formuliert, wie der Rest des Decks | S-37 |
| T-11 | Teufel, Position Situation: „Gewohnheit oder Abhängigkeit“ klingt nach Diagnose | „Gewohnheit oder Bindung“ (wie Essenz und Schlagworte) | S-37 |
| T-12 | Oberfläche verwies dreimal auf „im Profil“, der Tab heißt seit V04 „Ich“ | „unter „Ich““ / “under “Me”” | – |
| T-13 | „So entstand Sehende“ und „Suchende liegt nur einen Punkt hinter Sehende“ lasen sich ohne Artikel holprig | Namen in Anführungszeichen: „So entstand „Sehende““ | S-32 |
| T-14 | EN: Positionsname „Impulse“ (falscher Freund), „Choose myself“, „Area of life“, „Faith“, einzelne Germanismen | „Next step“, „Choose it myself“, „Life theme“, „Confidence“ | S-38 |

Inhaltsversion des Kerns jetzt `p0-2026-11-27.1`. Gespeicherte Legungen behalten ihren alten Positionsnamen (D-09). Offen bleibt E18: ein menschliches Lektorat vor 1.0. Die Stationstexte der Narrenreise erzählen weiter von Figuren („Die Hohepriesterin sitzt zwischen zwei Säulen“); das ist dort Erzählung, keine Bildbeschreibung, und bleibt.

## Korrekturen aus dem Design-Plan (27.11.2026, Branch `fix/v041-layout`, Version 0.4.1, D-63)

Der Eigentümer hat nach dem Design-Audit die Punkte 1, 3 und 4 freigegeben. Der Branch baut auf `fix/v04-texte` auf.

| Punkt | Vorher | Nachher | Beleg |
|---|---|---|---|
| 1 Hauptaktion sichtbar | Bei 375 × 812 px begann „Archetyp enthüllen“ bei 881 px, „Drei Karten ziehen“ bei 1.114 px, „Zur Tageskarte“ stand am Ende von 1.512 px | Die Hauptaktion bleibt am unteren Rand stehen (`.sticky-action`). Gemessen bei 360 × 800, 375 × 812, 412 × 915 (DE), 360 × 780 (EN) und 360 × 800 mit 130 % Schrift: alle drei Knöpfe vollständig im ersten Bildschirm und nicht verdeckt | `tests/e2e/layout.spec.ts` (drei Handy-Projekte) |
| 3 Absätze | Beschreibung (bis 180 Wörter) und Kapitel (bis 250 Wörter) als ein Absatz | Beschreibungen in drei Absätzen, Kapitel in drei bis fünf, kein Absatz über 100 Wörter, die Schlussfrage abgesetzt in der Kursiv-Serife (`src/ui/Prose.tsx`). 96 Texte je Sprache gegliedert | `tests/unit/prose.test.tsx` |
| 4a Willkommen | „Ohne Konto. Alles bleibt auf diesem Gerät.“ bei 375 × 812 px abgeschnitten | Zeile direkt unter „Beginnen“; bei 360 × 780 bis 412 × 915 px stehen Knopf, Zeile und „Fragen überspringen“ im ersten Bildschirm (bei 130 % Schrift wird gescrollt, wie auf „Heute“) | `layout.spec.ts` |
| 4b Zähler | „1 / 22“ las sich als römische I | gerade Ziffern (`lining-nums`) | Aufnahme im Pull Request |
| 4c Positionsnamen | „Herausforderung“ brach bei 360 bis 412 px in zwei Zeilen | einzeilig bei normaler Schrift (Abstand zum Nachbarn ≥ 22 px); bei 130 % Schrift bricht es weiter mit Trennstrich um | `layout.spec.ts` |

Nebenbei gefunden: Der Tag `v0.4.0` trägt in `package.json`, im Android-Projekt und in der App noch die Version 0.3.0 (versionCode 4). Dieser Branch setzt 0.4.1 und versionCode 5.

Prüfungen auf dem Branch: `npm run check` PASS (204 Unit-Tests, Content-Gate 0 Fehler und 0 Warnungen, Start-JS 139,5 kB); E2E auf dem Produktions-Build PASS (32 bestanden, 44 bewusst übersprungen, 0 fehlgeschlagen; neu `layout.spec.ts` auf 412 × 915, 360 × 780 und 320 × 640 px). **Android-Emulator (Pixel 7, API 36, Debug-Build 0.4.1): PASS**, 13 von 13 Prüfungen plus zwei Sichtprüfungen der Schriftgrößen, in jedem vollständigen Lauf: Update von 0.3.0 (versionCode 4) auf 0.4.1 (5) behält die Daten, Erststart, Fragebogen bis Enthüllung, Tageskarte, Legung, Zurück-Regeln, Kaltstart Median 1,55 s und 1,50 s (Grenze 3,0 s), Flugmodus, reduzierte Bewegung, alle Knöpfe beschriftet, Ziele ≥ 48 dp, Einstellungen zurückgesetzt; APK 12,6 MB. Dabei gefunden und behoben: Auf Screens ohne Tab-Leiste schien im Streifen der Gestenleiste Inhalt unter der klebenden Hauptaktion durch; der Schleier reicht jetzt durch den Streifen und ist unten deckend (`visual/evidence/v041-android.webp`). Kontrastmessung der neuen Leiste: NOT RUN; der Schleier ist dunkler als jeder Hintergrund darunter, der Knopf selbst ist unverändert. Nach den zwei CSS-Korrekturen aus dem Android-Lauf lief `npm run check` erneut (PASS), die E2E nicht noch einmal. Leistung gegen die Referenz: NOT RUN (D-52).

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
| Android-Emulator (Pixel 7, Debug-Build) | PASS 15/15 (2 × CHECK Schriftgröße per Screenshot), zuletzt nach S-30/S-31 erneut 15/15 (Kaltstart Median 1,64 s): Erststart, Fragebogen mit sieben Fragen → Enthüllung, Tageskarte, Legung, Grimoire, „Ich“, Zurück-Regeln, Kaltstart behält die Karte, Kaltstart Median 1,49 s (Grenze 3,0 s), Flugmodus, 130 %/200 % Schrift, reduzierte Bewegung, alle Knöpfe beschriftet, Ziele ≥ 48 dp, Einstellungen zurückgesetzt. APK 12,8 MB (Grenze 25 MB; V03 8,1 MB, dazu die B2-Bilder) | `scripts/android-evidence.mjs`, `visual/evidence/v04-android.webp` |
| Android V04: Enthüllung | PASS: 56,6–58,8 fps in 7 von 7 Läufen nach S-31 (Kriterium V04.2 ≥ 50 fps), meist ein langer Frame beim Bildschirmwechsel wie bei jedem Wechsel auf einen bildreichen Screen (B-13) | `scripts/android-v04.mjs`, `scripts/android-trace.mjs` |
| Android V04: Teilen | PASS: Teilen-Blatt offline 12/12; Export nach S-30 in 7 von 7 Läufen ≤ 1,5 s (Story 0,23–0,64 s, Beitrag 0,09–0,14 s), auch direkt nach dem Fragebogen (B-14) | `scripts/android-v04.mjs`, `visual/perf/v04-android-b13-b14.json` |
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
| Pages-Vorschau | PASS: nach dem Merge automatisch gebaut (Workflow „Pages preview“, Lauf 46040386919); https://emfau88.github.io/Arcana/ lädt mit demselben Start-Bundle wie der geprüfte Build, Willkommen sichtbar, CSP aktiv, keine Konsolenfehler | `.github/workflows/pages.yml` |

## Nächstes Arbeitspaket

V04 ist freigegeben und gemergt (Pull Request [#4](https://github.com/emfau88/Arcana/pull/4), `8b2419b`, Tag `v0.4.0`), danach 0.4.1 mit Textdurchsicht und den ersten Design-Korrekturen (Tag `v0.4.1`); `main` ist in `feature/v05-karten` übernommen. Die Punkte 2, 5 und 6 des Design-Plans sind an Mustern entschieden (D-64: Orakel A, Enthüllung B, Sternkarte A) und werden mit den V05-Screens eingebaut; Vorlage ist der Branch `muster/design-plan` (S-42). Auftrag D-57 sah danach V05 vor; der Eigentümer hat am 27.11.2026 entschieden, zuerst V04 abzuschließen und V05 noch nicht zu beginnen (D-60). Der Branch `feature/v05-karten` enthält bisher nur den Plan (S-29), keinen V05-Code. Geplante Reihenfolge, sobald der Eigentümer V05 freigibt (S-29):

1. **V05.1 Logik und Texte:** Modul `cards-deep` je Sprache (Licht, Schatten, Schlüsselwort, Symbolik, Rollen R4–R8, Studium in zwei Teilen, persönliche Frage, zwei Reflexionsfragen, Ritual; ≈ 330 Texte), geschrieben in drei Gruppen zu sieben Karten (die drei Wege der Narrenreise), mit Content-Gate; Studien-Logik (jede Stufe in ≤ 2 Sitzungen, Unit).
2. **V05.2 Legungs-Engine** mit Rollen R1–R8 und Matrix-Test (jede Kombination vollständig in DE/EN, keine Zukunftsversprechen); alte Legungen bleiben unverändert.
3. **V05.4 Tagebuch und Suche** als Logik (Suche über 1.000 Einträge ≤ 50 ms, einzeln löschen).
4. **B3 exportieren** wie B2 (D-55), dann die Screens als Vorschlag: V05.1 Kartenseite, V05.3 Grimoire als Buch, V05.5 Kartenrücken, V05.6 Orakel-Gestaltung.
5. Vor QG-V05: Leistungsmessung gegen die Referenz (D-52) zusammen mit B-08 (B-13 und B-14 sind behoben, S-30, S-31).

**Braucht den Eigentümer:** Freigabe für den Start von V05 (D-60), E10 Kartenrücken, E11 App-ID und E17 geschlossener Test (vor V05.6), E15 nur falls Edition-Inhalte sichtbar werden sollen. Der Eigentümer prüft gesammelt (`SELF_DECISIONS.md`, Nachprüfen). Die frühere G3-Liste (S11–S13) steckt in V07.5.

## Schnellprüfung

```powershell
npm ci
npm run check
npm run test:e2e
```
