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

Endgültige Messung „nach“ erfolgt mit eingebautem A01.
