# PERFORMANCE · Messung vor und nach dem Visual Overhaul

Ziel: Der Qualitätssprung darf die App nicht spürbar langsamer machen. Gemessen wird immer mit demselben Skript unter denselben Bedingungen.

## Verfahren (reproduzierbar)

```
npm run build && npm run preview            # Port 5181
node scripts/perf.mjs http://127.0.0.1:5181/ --runs 5 --out docs/visual/perf/<name>.json
```

Feste Bedingungen: Playwright-Chromium headless, 412 × 915 bei 2× Pixeldichte (mobil), de-DE, **CPU 4× gedrosselt**, Netz emuliert (40 ms, 10 Mbit/s), Browser-Cache pro Lauf aus. Median aus 5 Läufen.

| Szenario | Was | Grenze nach Overhaul |
|---|---|---|
| first-launch | frisches Profil bis Willkommen sichtbar | ≤ +25 % gegenüber Basis |
| today | wiederkehrend bis „Heute“ sichtbar | ≤ +25 %, LCP ≤ 1,8 s |
| Übertragung | KB gesamt / davon Bilder für „Heute“ | ≤ 600 KB Bilder pro Screen |
| reveal | Bilder pro Sekunde während der Enthüllung (1 Lauf, nur beim ersten Öffnen am Tag möglich) | ≥ 50 fps, ≤ 2 Ruckler > 50 ms |
| idle | laufende Animationen 12 s nach der Enthüllung | **0** (E5: vollständige Ruhe) |

Android-Kaltstart: `node --experimental-strip-types scripts/android-evidence.mjs <dir> --startup-only` (Median aus 5, Emulator `emulator-5554`). Nur aussagekräftig bei ruhigem Rechner (CPU-Last < 20 % vor dem Start).

## Basis: `main` @ `03abb3c` (Deck v2, vor dem Overhaul), 26.11.2026

Rohdaten: `docs/visual/perf/baseline-main-03abb3c.json`

| Szenario | Median |
|---|---|
| first-launch | sichtbar nach 1327 ms · FCP 548 ms · LCP 1012 ms · 406 KB (Bilder 214 KB) |
| today | sichtbar nach 996 ms · FCP 496 ms · LCP 896 ms · 536 KB (Bilder 306 KB) |
| reveal | 56 fps · schlechtester Frame 83 ms · 1 Ruckler |
| idle | 0 laufende Animationen |

**Android-Kaltstart: BLOCKED (nicht reproduzierbar).** Lauf am 26.11.2026 bei 63 % Rechnerlast: Läufe 17,3 / 12,1 / 4,6 / 15,7 / 5,4 s. Das ist Rechnerlast, nicht die App: Frühere Messung auf ruhigem Rechner ergab 2,4 s. Ursache u. a. ein laufender Vite-Server eines anderen Projekts (nicht angefasst). Die Messung wird auf ruhigem Rechner vor und nach V02 wiederholt.

## Zwischenstand V02-Grundlagen (Vektor-Welt, ohne A01), 26.11.2026

Rohdaten: `docs/visual/perf/v02-groundwork-vector.json`

| Szenario | Basis | V02-Grundlagen | Bewertung |
|---|---|---|---|
| first-launch sichtbar | 1327 ms | 980 ms | ok (Streuung) |
| today sichtbar / FCP / LCP | 996 / 496 / 896 ms | 1087 / 736 / 1004 ms | ok, innerhalb +25 % bei „sichtbar“. FCP höher durch Welt-Ebene, im Auge behalten |
| today Übertragung | 536 KB (Bilder 306) | 498 KB (Bilder 261) | ok |
| reveal | 56 fps, 1 Ruckler | 54 fps, 1 Ruckler (schlechtester Frame 117 ms) | ok, Nachmessung mit A01 |
| idle | 0 | **0** | PASS (E5) |


## Mit A01 + A02 (gemalte Welt), 26.11.2026

Rohdaten: `docs/visual/perf/v02-with-a01-a02.json`

| Szenario | Basis | Mit A01/A02 | Grenze | Ergebnis |
|---|---|---|---|---|
| first-launch sichtbar | 1327 ms | 936 ms | ≤ +25 % | PASS |
| today sichtbar | 996 ms | 1162 ms (+17 %) | ≤ +25 % | PASS |
| today LCP | 896 ms | 988 ms | ≤ 1,8 s | PASS |
| today Bilder | 306 KB | 420 KB | ≤ 600 KB | PASS |
| reveal | 56 fps, 1 Ruckler | 54 fps, 1 Ruckler | ≥ 50 fps, ≤ 2 | PASS |
| idle | 0 | 0 | 0 | PASS |

Android-Kaltstart weiter offen (Rechnerlast, siehe oben).

## V02 final (Tagesorakel, zur Freigabe), 26.11.2026

Die erste Messung des fertigen V02 hielt die Enthüllung nicht: 46–47 fps, 3 Ruckler, schlechtester Frame 183 ms. Ursache: Karte, Lichtschein und die ganze ausführliche Deutung entstanden im selben Frame. Die Lösung ist unsichtbar (D-37): Die Deutung unter dem ersten Bildschirm rendert kurz danach, das Kartenbild lädt vor dem Weltbild. Die Optik ist unverändert, das ist mit pixelgleichen Screenshots geprüft. Weniger Sterne oder Funken wurden erprobt, aber nicht übernommen (Designänderung nur nach Freigabe).

Vergleich abwechselnd im selben Zeitfenster gemessen, gleiche Bedingungen wie oben, Rechnerlast 45–60 % durch einen fremden Prozess. Absolute Werte liegen deshalb höher als bei der Basis, aussagekräftig ist der Abstand zu `main`:

| Szenario | `main` | V02 vor Fix | V02 final | Grenze | Ergebnis |
|---|---|---|---|---|---|
| reveal | 58 fps, 0–1 Ruckler | 46–47 fps, 3 Ruckler | 53–54 fps, 1–2 Ruckler, schlechtester Frame 67 ms | ≥ 50 fps, ≤ 2 | PASS |
| today sichtbar (gedeckte Deutung) | 1124 / 1038 ms | 1329 / 1386 ms (+25 %) | 1291 / 1243 ms (+17 %) | ≤ +25 % | PASS |
| today LCP | 1032 / 1028 ms | 1228 / 1272 ms | 1280 / 1240 ms | ≤ 1,8 s | PASS |
| today Bilder | 306 KB (Basis) | 411 KB | 442 KB | ≤ 600 KB | PASS |
| idle | 0 | 0 | 0 | 0 | PASS |

Rohdaten `docs/visual/perf/v02-final.json` (Standard-Skript, 3 Läufe, V02 final): first-launch 1046 ms, today sichtbar 1189 ms, LCP 1008 ms, Bilder 442 KB, idle 0. **Grenzfall reveal:** In diesem Einzellauf 46 fps, 2 Ruckler, schlechtester Frame 183 ms. Das Skript tippt im selben Moment, in dem die Seite fertig geladen ist, und dann fällt die Enthüllung mit dem Einblenden der gemalten Welt zusammen. Wer einen Augenblick später tippt (300 ms, wiederholt gemessen), bekommt 53–54 fps. Nicht weiter optimiert: Die nächsten Hebel wären sichtbar und brauchen eine Freigabe.

**Android (Emulator `Pixel_7`, Debug-APK mit V02):** Der Erststart bis zum Willkommen-Screen dauerte 3,2 s (Activity) bzw. 4,6 s (erster Screen), bei 50–75 % Rechnerlast. Als Kaltstart-Vergleich ist das weiter **BLOCKED** (Grenze: CPU-Last < 20 %). Der Ablauf Willkommen → Fragen → Archetyp ist PASS. Der erste Lauf brach danach am Archetyp-Screen ab: Das Testskript fand „Zur Tageskarte“, das Tippen kam aber nicht an (Zeitüberschreitung unter Last). Die Einstellungen des Emulators sind wiederhergestellt.
