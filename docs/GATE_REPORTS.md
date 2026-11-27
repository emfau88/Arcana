# GATE_REPORTS

G0 bis G2 sind die Gates des ersten Plans (26.11.2026). Seit der Produktvision V2 (D-38) endet jedes Paket mit einem Paket-Gate **QG-Vxx**; die frühere Härtung G3 ist Bulk V07.5, G4 (Store) ist V07.6. Die Paket-Gates stehen am Ende dieser Datei als Kurzbericht, die vollständigen Nachweise in `PROJECT_STATUS.md`.

---

# Gate G0 — PASS

Datum: 26.11.2026 · Root: `%USERPROFILE%\Documents\PersonalOracle-Web` · Dev-ID: `com.energycrafted.personaloracle.dev`

## Ziel und Anforderungen
S00 isolierter Root, S01 Toolchain und Architektur, S02 Git, Grundgerüst, Tests und ein erster Browserlauf.

## Ergebnis
| ID | Prüfung | Ergebnis | Beleg |
|---|---|---|---|
| S00 | Neuer Root ohne Überschneidung mit dem Altpfad, eigene ID | PASS | `ISOLATION_REPORT.md` |
| S01 | Toolchain (Node 22, JDK 21, SDK 36, Emulator API 36) dokumentiert, Architektur festgelegt | PASS | `ISOLATION_REPORT.md`, `DECISIONS.md` |
| S01 | Reuse-Prüfung | SKIP (bewusst, kein Altzugriff) | `REUSE_MATRIX.md` |
| S02 | Git, Vite/React/TS, Lockfile, Testskripte, Browserlauf | PASS | `package.json`, `package-lock.json` |

Keine Alt-Abhängigkeit. Weiter direkt zu G1 (keine Freigabewartezeit laut Briefing).

---

# Gate G1 — PASS · Freigabe für G2 am 26.11.2026 erteilt (Stil vorläufig, siehe D-22)

Datum: 26.11.2026 · Preview: https://emfau88.github.io/Arcana/ · lokal `npm run build && npm run preview` → http://127.0.0.1:5181/ · APK `android\app\build\outputs\apk\debug\app-debug.apk`

## Ziel und Anforderungen
S03 Designwelt, S04 funktionierender First-Run mit Persistenz, S05 Capacitor Android auf dem Emulator.

## G1-PASS-Kriterien
| Kriterium | Ergebnis | Beleg |
|---|---|---|
| Echter Web-End-to-End-Flow | PASS | E2E 14/14 in 4 Viewports, `TEST_EVIDENCE.md` |
| Echter Android-End-to-End-Flow (Emulator, gebündelt, keine Remote-URL) | PASS | `docs/evidence/android/`, `android-results.json` |
| Keine Crashes | PASS | 0 Page- oder Konsolenfehler im Browser. Android-Lauf vollständig ohne Absturz |
| Stabile Daily-/Grimoire-Daten nach Neustart | PASS | Reload (Browser) und Force-Stop/Kaltstart (Android) zeigen dieselbe Karte und denselben Verlauf |
| Sichtbare stilistische Eigenständigkeit | PASS (Eigentümerurteil offen) | Screenshots, Designentscheidungen unten |
| DE/EN-Belege | PASS | Browser DE 412 px, Browser EN Desktop, Android EN. Sprachwechsel als E2E-Test |
| Liste aller fehlenden P0-Inhalte | PASS | `CONTENT_INVENTORY.md` |
| Keine externe Runtime-Abhängigkeit | PASS | CSP `default-src 'self'`, 0 externe Requests, Android-Flugmodus-Kaltstart |

## Designentscheidungen (zur Freigabe)
- **Welt:** „Nachtobservatorium“. Tiefes Tinten-Violett (#100D1C), Messing- und Goldlinien, feines Papierkorn. Keine generische Esoterik-Optik mit Neon oder Kristallkugeln.
- **Karten:** Eigene geometrische Illustrationen mit Rahmen, Ziffer und Titel als echter Text, damit DE/EN und Schriftgrößen sauber funktionieren. Drei Töne (hell, Dämmerung, Schatten) sorgen für Abwechslung im Deck.
- **Typografie:** Cormorant Garamond für Titel und Deutung, Manrope für UI. Beide lokal eingebunden.
- **Ritual-Gefühl:** Freiwillige Enthüllung mit Kartendrehung. Bei reduzierter Bewegung wird sofort aufgedeckt.
- **Archetypen:** Acht eigene Sigillen. Der Schatten ist als offene Frage formuliert, nie als Urteil.
- **Ehrlichkeit:** Prototyp-Lücken sind im UI markiert („3 von 22 Karten“). Die Deutungen sind als symbolische Perspektive gekennzeichnet.

## Isolation
Neuer Root, eigene ID, keine Änderungen am Altprojekt. Ein Toolchain-Vorfall (npx-Cache) wurde behoben und ist dokumentiert in `ISOLATION_REPORT.md`.

## Offene Punkte / Restrisiken
- Stilurteil des Eigentümers.
- TalkBack manuell und Release-Modus-Build: NOT RUN (G3).
- Langsamer allererster Kaltstart im Emulator (~9 s). Auf einem echten Gerät in G3 messen.
- Name „ARCANA“ ist nicht markenrechtlich geprüft (G4).
- Content-Umfang: 19 Karten und 4 Themen fehlen. Das ist der größte Aufwandsblock.

## Aufwandsschätzung G2/G3 (nach Freigabe)

Schätzung in Agenten-Arbeitssitzungen, ohne Wartezeiten auf den Eigentümer.

| Bulk | Inhalt | Aufwand | Fertig, wenn |
|---|---|---|---|
| 1 | Kartenkunst: 19 Illustrationen im freigegebenen Stil | 2–3 Sitzungen | 22 Karten rendern konsistent, Titel passen in DE/EN bei 100–200 % |
| 2 | Texte: 19 Karten komplett + 4 Themen + 126 Karte×Thema-Botschaften, DE/EN, Redaktion | 3–4 Sitzungen | `validate:content` P0-Stufe ohne Fehler, Stichprobe aller Karten gelesen |
| 3 | S07–S10: Profil-Edit, Datumsgrenzen/Resume, alle Themen im Orakel, Leer- und Fehlerzustände | 2 Sitzungen | PR-01–08 im normalen Flow, E2E und Unit grün, G2-Bericht |
| 4 | G3-Härtung: Q01–Q16, Upgrade-Test, TalkBack, Release-Modus-Testbuild, Messungen | 2 Sitzungen | Matrix vollständig, keine kritischen oder hohen Fehler, reproduzierbarer Kandidat |

Summe etwa 9–11 Sitzungen. Das Hauptrisiko liegt in der Textqualität von Bulk 2. Dort ist ein kurzer Stichproben-Review durch den Eigentümer sinnvoll.

## Nächstes Arbeitspaket / benötigte Freigabe
**Designfreigabe des Eigentümers.** Danach folgt G2 Bulk 1. Bei Ablehnung korrigiere ich gezielt den Stil, ohne Features aufzustocken.

---

# Gate G2 — PASS

Datum: 26.11.2026 · Version 0.2.0 · Preview: https://emfau88.github.io/Arcana/ · lokal `npm run build && npm run preview` → http://127.0.0.1:5181/ · APK `android\app\build\outputs\apk\debug\app-debug.apk` (SHA-256 `f67be5db…cd5b5b9`)

## Ziel und Anforderungen
S06 Content-Produktion (22 Karten, 6 Themen), S07 Onboarding und Profil, S08 robustes Tagesorakel, S09 vollständiges Drei-Karten-Orakel, S10 Grimoire, Einstellungen, Leer- und Fehlerzustände. Auftrag des Eigentümers: Karten vorerst im bisherigen Stil, später austauschbar (D-22). Plan und Bulks: `G2_PLAN.md`.

## Anforderungen PR-01 bis PR-08 im normalen Ablauf
| ID | Anforderung | Ergebnis | Beleg |
|---|---|---|---|
| PR-01 | Erstöffnung: 4 freiwillige Fragen, Themenwahl (6), Überspringen, erste Tageskarte ohne Kauf oder Konto | PASS | E2E „complete flow“, „skipping“, „one question“. Browser 01–04, Android 01–04 |
| PR-02 | 8 Archetypen mit Beschreibung, Stärke, Schatten als Frage, Entwicklung. Antworten und Thema editierbar. Neutral beim Überspringen | PASS | Unit-Tests Scoring (256 Kombinationen). Neu: Archetyp im Profil ansehen, selbst wählen oder offen lassen (D-23). E2E „archetype can be viewed, corrected“. Browser 23–24 |
| PR-03 | Eine Karte pro lokalem Tag, freiwillige Enthüllung, Botschaft, Reflexionsfrage, Ritual. Nach Neustart gleich | PASS | Unit-Tests (Doppeltap, zwei Tabs). Neu: E2E „local midnight“. Android Force-Stop/Kaltstart |
| PR-04 | Drei-Karten-Orakel, 6 Themen, 3 verschiedene Karten, Enthüllung, Deutung je Position, Speichern/Verwerfen, ohne Limit | PASS | Neu: E2E „all six themes“ (DE/EN). Unit „every card in every position“. Browser 12–17, Android 09–12 |
| PR-05 | Grimoire: Sammlung x/22 ohne Doppelzählung, Verlauf, Detail, Notiz. Tageskarte automatisch, Reading nach Speichern | PASS | E2E Flow und Notiz. Browser 07 (leer), 18–20 |
| PR-06 | Vier Hauptbereiche, konsistentes Zurück, keine Sackgassen, Start auf der Tageskarte | PASS | Unit-Tests Router (inkl. Archetyp aus dem Profil). Android Back-Regeln |
| PR-07 | Personalisierung nach Thema und Archetyp. Gespeicherte Readings bleiben unverändert. Symbolische Perspektive gekennzeichnet | PASS | Unit „lens for 8 archetypes“, unveränderliche Readings. Hinweis im UI |
| PR-08 | Flugmodus ohne Konto, DE/EN mit Systemsprache, stabil über Neustart, Datenlöschung mit Bestätigung, keine Tracker | PASS | Android-Flugmodus-Kaltstart. E2E Sprachwechsel und Löschen. 0 externe Requests, CSP |

## G2-PASS-Kriterien
| Kriterium | Ergebnis | Beleg |
|---|---|---|
| PR-01–08 im normalen Flow vollständig | PASS | Tabelle oben |
| Keine Platzhalter | PASS | Prototyp-Hinweise („3 von 22“, Themen-Hinweis) entfernt. Validator prüft Platzhalter |
| Vollständige Content-Validierung | PASS | P0-Stufe 0 Fehler, 0 Warnungen. Inhaltsmatrix 22 × 6 × 2 als Unit-Test |
| Beide Plattformen erfolgreich | PASS | Browser: E2E 19/19 (25 bewusst übersprungen), Nachweis DE/EN. Android: alle Checks PASS |
| Android-Kern offline | PASS | Kaltstart im Flugmodus, App vollständig nutzbar |
| DE/EN | PASS | Browser DE 412 und 320, EN Desktop, Android EN, E2E in beiden Sprachen |
| Kein Konto, Backend oder Tracking | PASS | Kein neuer Netzwerkcode, CSP `default-src 'self'`, 0 externe Requests |
| Keine P1/P2-Funktionen ohne Freigabe | PASS | Nur P0-Umfang. Die manuelle Archetyp-Wahl gehört zu PR-02 (editierbares Profil) und stand im freigegebenen G2-Plan |

## Was in G2 dazukam
- 19 neue Karten mit allen Texten und 4 neue Themen, alles in DE und EN. Insgesamt 132 Karte×Thema-Botschaften je Sprache.
- 19 neue Illustrationen im bisherigen Stil, Deck-Übersicht, Rahmenvorlage und Schutzzonen für spätere Ersatz-Assets.
- Profil: Archetyp ansehen, Fragen erneut beantworten, selbst wählen oder offen lassen.
- Tests für Mitternacht, alle Themen und die gesamte Inhaltsmatrix.

## Offene Punkte / Restrisiken
- Kartenkunst ist vorläufig. Austausch geregelt in `ASSET_LICENSES.md`.
- Die Texte sind automatisch geprüft, ein menschliches Lektorat steht noch aus.
- In der Grimoire-Sammlung sind am Anfang fast alle Karten verdeckt. Eine Hervorhebung oder ein Filter wäre Design-Feinschliff (Backlog).
- Sehr lange Titel (Längenklasse `l`) sind in der kleinen Rasteransicht klein, aber lesbar und ohne Abschneiden.
- TalkBack manuell, Release-Modus-Build, PWA-Offline im Browser: NOT RUN, gehört zu G3.
- Der erste Start nach Neuinstallation dauert im Emulator ~7 s. Auf einem echten Gerät in G3 messen.

## Nächstes Arbeitspaket
Damals geplant: G3 (Härtung: S11 Speicher unter Last und Upgrade, S12 Q01–Q16-Matrix inklusive TalkBack, S13 Release-Modus-Testbuild). Seit der Produktvision V2 folgen stattdessen die Pakete V02 bis V07; G3 steckt in V07.5.

---

# Paket-Gates seit der Produktvision V2

Kurzberichte. Kriterien je Paket: `product/MASTER_ROADMAP_V2.md` §3 und §6. Einzelnachweise, offene Fehler und Messwerte: `PROJECT_STATUS.md`.

## V02 · Tagesorakel abschließen — PASS, freigegeben 26.11.2026

Version 0.2.1 · Pull Request [#2](https://github.com/emfau88/Arcana/pull/2) · Merge `553c5d9` · Tag `v0.2.1`

| Prüfung | Ergebnis |
|---|---|
| Check und E2E | PASS, E2E 19 bestanden, 0 fehlgeschlagen |
| Layout und Kontrast | PASS bei 412 und 360 px (≥ 4,9:1); Grenzfälle B-07 und B-08 offen, nach V03.5 verschoben |
| Leistung | PASS nach D-37 und D-41 (Enthüllung ohne Ruckler, schlechtester Frame 50 ms) |
| Android-Emulator | PASS 13/13, Kaltstart Median 1,95 s (Grenze 3,0 s) |
| Freigabe | Tagesorakel-Screen durch den Eigentümer; B-05 und B-06 danach behoben (D-42) |

## QG-V03 · Fundament und globales Designsystem — PASS mit Ausnahmen (D-52), freigegeben 27.11.2026

Version 0.3.0 · Pull Request [#3](https://github.com/emfau88/Arcana/pull/3) · Merge `2f1e1de` · Tag `v0.3.0`

| Prüfung | Ergebnis |
|---|---|
| Check | PASS, 118 Unit-Tests, Start-JS 132 kB (Grenze 160 kB) |
| E2E | PASS, 20 bestanden |
| Migration | PASS, Android übernimmt einen 0.2.0-Datenbestand, 9/9, jeder Datensatz unverändert |
| Android-Emulator | PASS, Kaltstart 1,58 s, APK 8,1 MB (Grenze 25 MB) |
| Layout | PASS bei 360/390/412 px, DE/EN, 130 % Schrift (B-10 behoben) |
| Kontrast | PASS außer B-07 (Fußzeile auf „Heute“), per Ausnahme nach V04.3 verschoben und dort behoben (D-59) |
| Leistung gegen die Referenz | NOT RUN, per Ausnahme vor QG-V05 (D-52) |

## QG-V04 · Identität und Reise — PASS, freigegeben 27.11.2026 (D-61)

Version 0.4.0 · Pull Request [#4](https://github.com/emfau88/Arcana/pull/4) · Merge `8b2419b` · Tag `v0.4.0` · Pages-Vorschau aktualisiert

| Prüfung | Ergebnis |
|---|---|
| Check | PASS, 199 Unit-Tests, Content-Gate 0 Fehler und 0 Warnungen, Start-JS 139,1 kB |
| E2E | PASS, 27 bestanden, 41 bewusst übersprungen, 0 fehlgeschlagen |
| Kontrast | PASS, kein Lesetext unter 4,5:1 bei 360/390/412 px, DE/EN, 130 % Schrift (B-07 mit Variante B behoben, D-59) |
| Bildbudget | PASS, schwerster Screen 364 KB (Budget 600 KB) |
| Android-Emulator | PASS 15/15, Kaltstart Median 1,49 s, APK 12,8 MB; Enthüllung 56,6–58,8 fps (B-13), Teilen-Export ≤ 1,5 s (B-14) |
| Leistung gegen die Referenz | NOT RUN (D-52: vor QG-V05) |
| Bekannt | Der Tag trägt in Paket, Android-Projekt und App noch die Nummer 0.3.0; behoben mit 0.4.1 |

## 0.4.1 · Textdurchsicht und Design-Korrekturen — PASS, gemergt 27.11.2026 (kein Paket-Gate)

Pull Requests [#5](https://github.com/emfau88/Arcana/pull/5) (D-62) und [#6](https://github.com/emfau88/Arcana/pull/6) (D-63) · Merge `dae2854` · Tag `v0.4.1`

| Prüfung | Ergebnis |
|---|---|
| Check | PASS, 204 Unit-Tests, Content-Gate 0 Fehler und 0 Warnungen, Start-JS 139,5 kB |
| E2E | PASS, 32 bestanden, 44 bewusst übersprungen, 0 fehlgeschlagen; nach zwei späteren CSS-Korrekturen nicht erneut gelaufen |
| Android-Emulator | PASS 13/13 in drei Läufen, Update 0.3.0 → 0.4.1 behält die Daten, Kaltstart 1,55 s und 1,50 s, APK 12,6 MB |
| Kontrast der klebenden Leiste | NOT RUN |
| Leistung gegen die Referenz | NOT RUN (D-52) |

## Nächstes Gate

QG-V05 (Karten, Legungen, Grimoire) mit geschlossenem Test. V05 beginnt erst auf Zuruf des Eigentümers (D-60); die Punkte 2, 5 und 6 des Design-Plans sind an Mustern entschieden (D-64) und werden in V05 eingebaut.
