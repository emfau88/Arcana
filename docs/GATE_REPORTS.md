# GATE_REPORTS

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
G3 (Härtung: S11 Speicher unter Last und Upgrade, S12 Q01–Q16-Matrix inklusive TalkBack, S13 Release-Modus-Testbuild). Start erst nach Rückmeldung des Eigentümers zum G2-Bericht.

