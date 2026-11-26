# TEST_EVIDENCE — G1

**Datum:** 26.11.2026 · Alle Screenshots sind echte Aufnahmen (Playwright-Chromium bzw. `adb screencap` vom Emulator), verkleinert als WebP. Es gibt keine Mockups.

## Automatische Prüfungen

| ID | Befehl | Ergebnis | Bemerkung |
|---|---|---|---|
| Q01 | `npm run typecheck` | PASS | App und Node-Configs, strict |
| Q01 | `npm run lint` | PASS | 0 Warnungen |
| Q01/Q08 | `npm run validate:content` | PASS (G1-Stufe) | 0 Fehler, 0 Warnungen. P0-Vollständigkeit: NOT YET (siehe `CONTENT_INVENTORY.md`) |
| Q01 | `npm test` | PASS, 56/56 | Uhr/Zufall, Archetypen (alle 256 Antwortkombinationen, alle 8 Typen erreichbar, Tie-Break a/b/c), Tagesorakel, Readings, Speicher (Doppeltap, zwei Tabs, korrupte Datensätze, Löschen), Router, i18n, Textzoom |
| Q01 | `npm run build` | PASS | JS 327 kB, CSS 31 kB (unkomprimiert), CSP-Meta injiziert |
| Q02/Q10/Q12 | `npm run test:e2e` | PASS, 14 bestanden / 18 übersprungen | Übersprungene Tests laufen bewusst nur in einem Viewport (z. B. Persistenzlogik nur einmal). Viewports: 412 DE, 360 EN, 320 DE, Desktop 1440 DE |

E2E deckt ab: vollständigen Flow mit Reload-Persistenz und ohne horizontalen Overflow, Skip ergibt ein neutrales Profil, eine einzige Antwort ergibt ein neutrales Profil, Wiederherstellung eines halb aufgedeckten Readings, Notiz nach Reload, Back, Sprachwechsel, „Alle Daten löschen“, reduzierte Bewegung, Tastaturbedienung, Accessible Names, strikte CSP und dass keine externen Requests stattfinden.

## Android-Emulator (`emulator-5554`, Pixel 7, API 36, WebView 133)

Debug-APK `app-debug.apk`, 5,74 MB, SHA-256 `cbbaff2cc24c136ea44d49ebf2607f732997a70fc9ad0592cfc182de833891b3`. Paket `com.energycrafted.personaloracle.dev`, versionName 0.1.0, minSdk 24, targetSdk 36, einzige Berechtigung `INTERNET`. Der Build ist gebündelt, es gibt kein `server.url`. Lauf über `node scripts/android-evidence.mjs`, Rohdaten in `docs/evidence/android/android-results.json`.

| Check | Ergebnis | Detail |
|---|---|---|
| Erststart zeigt Willkommen | PASS | Systemsprache EN |
| Fragebogen → Archetyp | PASS | |
| Tageskarte aufgedeckt | PASS | The Sun |
| Drei-Karten-Reading gezogen, aufgedeckt, gespeichert | PASS | |
| Back im Profil → Heute, Back auf Heute → App minimiert | PASS | |
| Force-Stop + Kaltstart: gleiche Tageskarte | PASS | The Sun |
| Kaltstart bis erster Screen, Median aus 5 (Debug-Build) | PASS | 2,29 s (3,16 / 2,62 / 2,29 / 2,21 / 2,25 s). Ziel ≤ 2,5 s |
| Kaltstart im Flugmodus | PASS | App vollständig nutzbar, 7,9 s (Einzellauf direkt nach Netzwechsel) |
| Systemschrift 130 % und 200 % | PASS (visuell geprüft) | Screenshots 17–20. Karteninschriften bleiben im Rahmen, UI-Text skaliert mit |
| Reduzierte Bewegung (Animationen aus) | PASS | Enthüllung sofort |
| Klickbare Elemente mit Label (uiautomator) | PASS | 0 ohne Namen |
| Touch-Ziele ≥ 48 dp | PASS | |
| Emulator-Einstellungen wiederhergestellt | PASS | |
| TalkBack manuell | NOT RUN | Ersatzweise der Labelcheck oben. Folgt in G3 |
| Release-Modus-Build | NOT RUN | G3/S13 |

Der erste Start nach Neuinstallation braucht im Emulator ~9 s bis zum ersten Screen (WebView-Initialisierung). Das ist als Beobachtung im Backlog vermerkt.

## Screenshot-Sequenzen

- **Android (EN):** `docs/evidence/android/01-welcome.webp` … `21-reduzierte-bewegung.webp`: Willkommen, Frage, Thema, Archetyp, Heute verdeckt, Enthüllung, Botschaft, Orakel verdeckt und aufgedeckt, gespeichert, Grimoire, Profil, Neustart persistiert, Offline-Kaltstart, Schrift 130 %/200 %, reduzierte Bewegung.
- **Browser DE, 412 px:** `docs/evidence/browser/01-welcome-de-412.webp` … `22-heute-nach-neuladen-de-412.webp`, inklusive ganzseitiger Aufnahmen (`*-lang-*`).
- **Browser EN, Desktop:** `docs/evidence/browser/01-welcome-en-desktop.webp` … `18-heute-nach-neuladen-en-desktop.webp`.

Die Bildfolgen nach Nummer gelesen ergeben die Flow-Sequenz (kein Video).

## Messwerte Browser

Die erste Karte war in jedem Lauf deutlich unter dem 90-Sekunden-Ziel erreichbar: Welcome → 4 Antworten → Thema → Archetyp → Heute → Enthüllung dauert automatisiert wenige Sekunden. Für reale Nutzer ist das eine Testhypothese für G5. Externe Requests: 0. Konsolenfehler: 0.
