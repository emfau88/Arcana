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

# Gate G1 — PASS · STOP für die Designfreigabe des Eigentümers

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
