# TEST_EVIDENCE — G2

**Datum:** 26.11.2026 · **Version:** 0.2.0 · Alle Screenshots sind echte Aufnahmen (Playwright-Chromium bzw. `adb screencap` vom Emulator), verkleinert als WebP. Es gibt keine Mockups. Die G1-Werte stehen in der Git-Historie dieser Datei.

## Automatische Prüfungen

| ID | Befehl | Ergebnis | Bemerkung |
|---|---|---|---|
| Q01 | `npm run typecheck` | PASS | App und Node-Configs, strict |
| Q01 | `npm run lint` | PASS | 0 Warnungen |
| Q01/Q08 | `npm run validate:content` | PASS (P0-Stufe) | 22/22 Karten, 6/6 Themen, 132/132 Karte×Thema-Texte je Sprache, 8/8 Archetypen, 4/4 Fragen, 0 Fehler, 0 Warnungen, alle Bilder vorhanden |
| Q01 | `npm test` | PASS, 63/63 | wie G1, dazu: Inhaltsmatrix 22 × 6 × 2, Archetyp-Linse für alle 8 Typen, jede Karte in jeder Position, manuelle Archetyp-Korrektur speichern, alte Profile ohne neues Feld lesen, ungültige Herkunft als defekt überspringen, Reading-Fallback bei Teilinhalten |
| Q01 | `npm run build` | PASS | JS 395 kB (125 kB gzip), CSS 30,5 kB, CSP-Meta injiziert. Kartenbilder 2,1 MB (23 Vollbilder + 23 Thumbnails) |
| Q02/Q10/Q12 | `npm run test:e2e` | PASS, 19 bestanden / 25 übersprungen | Übersprungene Tests laufen bewusst nur in einem oder zwei Viewports. Viewports: 412 DE, 360 EN, 320 DE, Desktop 1440 DE |
| – | `node scripts/check-card-titles.mjs` | PASS, 44/44 | Alle Ziffern und Titel (22 Karten × DE/EN) passen ohne Abschneiden in den Rahmen |

Neu in G2 (E2E): alle sechs Themen ergeben ein vollständiges Drei-Karten-Reading in DE und EN. Ein neuer lokaler Tag um Mitternacht bringt eine neue verdeckte Karte, die Karte von gestern bleibt im Verlauf. Der Archetyp lässt sich im Profil ansehen, von Hand korrigieren oder offen lassen. Weiterhin abgedeckt: vollständiger Flow mit Reload-Persistenz und ohne horizontalen Overflow, Überspringen und Einzelantwort ergeben ein neutrales Profil, halb aufgedecktes Reading wird wiederhergestellt, Notiz nach Reload, Back, Sprachwechsel, „Alle Daten löschen“, reduzierte Bewegung, Tastatur, Accessible Names, strikte CSP und keine externen Requests.

## Browser-Nachweis (`scripts/evidence.mjs`)

| Lauf | Build | Ergebnis |
|---|---|---|
| DE, 412 px | Produktion (Preview 5181) | 25 Aufnahmen, 0 Konsolen- oder Seitenfehler, 0 externe Requests, Daten nach Reload vorhanden |
| EN, Desktop 1440 px | Produktion (Preview 5181) | 25 Aufnahmen, 0 Fehler, 0 externe Requests, Daten nach Reload vorhanden |
| DE, 320 px, Schrift 130 % | Dev-Server 5180 (siehe D-24) | 21 Aufnahmen, 0 Fehler, kein horizontaler Überlauf |

Die erste enthüllte Tageskarte war im automatisierten Lauf nach etwa 10 s erreicht, inklusive bewusster Wartezeiten für die Screenshots. Ziel ist ≤ 90 s für echte Nutzer (Hypothese für G5).

## Android-Emulator (`emulator-5554`, Pixel 7, API 36, WebView 133)

Debug-APK `app-debug.apk`, 7,31 MB (7.313.918 Byte), SHA-256 `f67be5db737bfe612290515909dfa82a0238c94abebb67b3658e36682cd5b5b9`. Paket `com.energycrafted.personaloracle.dev`, versionName 0.2.0, versionCode 2, minSdk 24, targetSdk 36, einzige Berechtigung `INTERNET`. Der Build ist gebündelt, es gibt kein `server.url`. Lauf über `node --experimental-strip-types scripts/android-evidence.mjs`, Rohdaten in `docs/evidence/android/android-results.json`.

| Check | Ergebnis | Detail |
|---|---|---|
| Erststart zeigt Willkommen | PASS | Systemsprache EN |
| Fragebogen → Themenwahl (6 Themen) → Archetyp | PASS | |
| Tageskarte aufgedeckt | PASS | The Star |
| Drei-Karten-Reading gezogen, aufgedeckt, gespeichert | PASS | Star, Temperance, Magician |
| Back im Profil → Heute, Back auf Heute → App minimiert | PASS | |
| Force-Stop + Kaltstart: gleiche Tageskarte | PASS | The Star |
| Kaltstart bis erster Screen, Median aus 5 (Debug-Build) | PASS | 2,41 s (2,41 / 2,31 / 2,29 / 2,42 / 2,42 s). Ziel ≤ 2,5 s |
| Kaltstart im Flugmodus | PASS | App vollständig nutzbar, 6,8 s (Einzellauf direkt nach Netzwechsel) |
| Systemschrift 130 % und 200 % | PASS (visuell geprüft) | Screenshots 17–20. Karteninschriften bleiben im Rahmen, UI-Text skaliert mit |
| Reduzierte Bewegung (Animationen aus) | PASS | Enthüllung sofort |
| Klickbare Elemente mit Label (uiautomator) | PASS | 0 ohne Namen |
| Touch-Ziele ≥ 48 dp | PASS | |
| Emulator-Einstellungen wiederhergestellt | PASS | Schrift, Flugmodus, Animationen wie vorher |
| TalkBack manuell | NOT RUN | Ersatzweise der Labelcheck oben. Folgt in G3 |
| Release-Modus-Build | NOT RUN | G3/S13 |

Der erste Start nach `pm clear` braucht im Emulator ~7 s bis zum ersten Screen (WebView-Initialisierung, wie in G1).

## Screenshot-Sequenzen

- **Android (EN):** `docs/evidence/android/01-welcome.webp` … `21-reduzierte-bewegung.webp`.
- **Browser DE, 412 px:** `docs/evidence/browser/*-de-412.webp` (01–25), inklusive leerem Grimoire, ganzseitiger Aufnahmen (`*-lang-*`), Archetyp-Auswahl im Profil und Archetyp-Ansicht aus dem Profil.
- **Browser EN, Desktop:** `docs/evidence/browser/*-en-desktop.webp` (01–25), gleiche Schritte.
- **Browser DE, 320 px, Schrift 130 %:** `docs/evidence/browser/*-de-320-font130.webp` (01–21).
- **Deck-Übersicht:** `docs/assets/deck-overview.webp` (alle 22 Karten und Rückseite).

Die Bildfolgen nach Nummer gelesen ergeben die Flow-Sequenz (kein Video).
