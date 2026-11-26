# PROJECT_STATUS — Personal Oracle (Arbeitstitel ARCANA)

**Stand:** 26.11.2026 · **Version:** 0.2.0 · **Phase:** G2 abgeschlossen (PASS). **Visual Overhaul läuft:** V00/V01 freigegeben, V02 (Tagesorakel) fertig zur Freigabe auf `design/visual-overhaul` (nicht gemergt, V03 nicht begonnen) · **Nächstes Gate:** G3 (Härtung) nach dem Overhaul

Ein neuer Agent liest zuerst diese Datei, dann `AGENTS.md`, `docs/DECISIONS.md` und `docs/GATE_REPORTS.md`.

## Orte

| Was | Wo |
|---|---|
| Projektroot (neu, isoliert) | `%USERPROFILE%\Documents\PersonalOracle-Web` |
| Git | eigenes Repo, Branch `main`, Remote `https://github.com/emfau88/Arcana` (öffentlich) |
| Preview (Handy) | https://emfau88.github.io/Arcana/ (GitHub Pages aus `main`, Workflow `.github/workflows/pages.yml`) |
| Design-Vorschau | https://emfau88.github.io/Arcana/preview/ (Branch `design/visual-overhaul`, eigene Datenbank, D-29) |
| Visual Overhaul | `docs/visual/` (Audit, Art Direction, Asset-Anfragen, Roadmap, Performance) |
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

- **Freigabe des Tagesorakel-Screens (V02)** durch den Eigentümer in der Design-Vorschau. Erst danach Merge nach `main` und V03 (Asset-Paket in `docs/visual/ASSET_REQUESTS.md` §0.1).
- **Rückmeldung des Eigentümers** zum G2-Bericht, danach G3.
- Kartenkunst ist durch Deck v2 ersetzt (D-26). Archetyp-Sigillen und App-Icon sind noch im Vektorstil (`BACKLOG.md`).
- Kaltstart im Emulator zuletzt 3,8 s unter Rechnerlast (vorher 2,4 s). In G3 auf ruhigem Rechner bzw. Gerät messen.
- Menschliches Lektorat der Texte vor dem Release.
- D-08 (geschlechtsinklusive DE-Archetypnamen) wartet noch auf ein Eigentümerurteil.
- Name „ARCANA“ und App-ID sind vorläufig (G4).
- TalkBack wurde nicht manuell geprüft. Als Ersatz wurden die Accessibility-Labels per uiautomator geprüft (G3).

## Nächstes Arbeitspaket (nach Rückmeldung)

G3: S11 Speicher unter Last, Abbruch und Upgrade (inkl. optionalem PWA-Cache), S12 vollständige Q01–Q16-Matrix inklusive TalkBack, S13 Release-Modus-Testbuild mit SHA-256 und Messungen.

## Schnellprüfung

```powershell
npm ci
npm run check
npm run test:e2e
```
