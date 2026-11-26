# PROJECT_STATUS — Personal Oracle (Arbeitstitel ARCANA)

**Stand:** 26.11.2026 · **Phase:** G1 abgeschlossen, **STOP: wartet auf die Designfreigabe des Eigentümers** · **Nächstes Gate:** G2 (erst nach Freigabe)

Ein neuer Agent liest zuerst diese Datei, dann `AGENTS.md`, `docs/DECISIONS.md` und `docs/GATE_REPORTS.md`.

## Orte

| Was | Wo |
|---|---|
| Projektroot (neu, isoliert) | `%USERPROFILE%\Documents\PersonalOracle-Web` |
| Git | eigenes Repo, Branch `main`, Remote `https://github.com/emfau88/Arcana` (öffentlich) |
| Preview (Handy) | https://emfau88.github.io/Arcana/ (GitHub Pages, Workflow `.github/workflows/pages.yml`) |
| Lokale Preview | `npm run build && npm run preview` → http://127.0.0.1:5181/ |
| Debug-APK | `android\app\build\outputs\apk\debug\app-debug.apk` (nicht versioniert) |
| Nachweise | `docs/evidence/browser`, `docs/evidence/android` |
| Starterpaket | `docs/briefing/` liegt nur lokal (per `.gitignore` nicht im öffentlichen Repo) |
| Altprojekt Mirror/Heartvia | unberührt, nicht gelesen, nicht durchsucht |

## Gates

| Gate | Status | Beleg |
|---|---|---|
| G0 | PASS | `docs/GATE_REPORTS.md`, `docs/ISOLATION_REPORT.md` |
| G1 | PASS, Freigabe offen | `docs/GATE_REPORTS.md`, `docs/TEST_EVIDENCE.md` |
| G2–G5 | NOT RUN | erst nach Designfreigabe |

## Was funktioniert (Browser und Android-Emulator)

- First-Run mit Willkommen, 4 freiwilligen Fragen, Themenwahl und Archetyp-Enthüllung. Überspringen führt zum neutralen Profil.
- Tageskarte: eine Karte pro lokalem Kalendertag, freiwillige Enthüllung, Botschaft, Reflexionsfrage, Mini-Ritual, Notiz. Nach Neustart erscheint dieselbe Karte.
- Drei-Karten-Orakel mit Situation, Herausforderung und Impuls, einzeln aufdeckbar. Die Deutung wird unveränderlich gespeichert. Ein halb aufgedecktes Reading wird wiederhergestellt.
- Grimoire mit Sammlung, Verlauf und Detailansicht. Profil mit Archetyp, Thema, Sprache (DE/EN), Bewegung und „Alle Daten löschen“.
- Android: gebündelter Build ohne Remote-URL, offline lauffähig. Back-Regeln, Insets, Schriftgrößen 130 %/200 % und reduzierte Bewegung sind geprüft.

## Offene Punkte

- **Designfreigabe** durch den Eigentümer (Stil, Kartenwelt, Typografie). Danach folgt G2.
- Fehlende P0-Inhalte stehen in `docs/CONTENT_INVENTORY.md`: 19 Karten, 4 Themen, Karte×Thema-Texte.
- Name „ARCANA“ und App-ID sind vorläufig (G4).
- TalkBack wurde nicht manuell geprüft. Als Ersatz wurden die Accessibility-Labels per uiautomator geprüft.

## Nächstes Arbeitspaket (nach Freigabe)

G2 / S06: Content-Produktion (22 Karten, 6 Themen) im freigegebenen Stil, dann S07–S10. Die Schätzung steht in `docs/GATE_REPORTS.md`.

## Schnellprüfung

```powershell
npm ci
npm run check
npm run test:e2e
```
