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

> **Ab QG-V03 (D-39, R1):** Maßgeblich sind die **absoluten Obergrenzen** gegen die feste Referenz `main` @ `03abb3c` (`docs/product/MASTER_ROADMAP_V2.md` §6 „Leistungsbudgets“): Erststart ≤ 1.600 ms, „Heute“ sichtbar ≤ 1.250 ms, FCP ≤ 900 ms, LCP ≤ 1.400 ms, Übertragung ≤ 900 KB (Bilder ≤ 600 KB), Start-JS ≤ 160 KB gzip, Enthüllung ≥ 50 fps mit ≤ 2 Rucklern und schlechtestem Frame ≤ 120 ms, Leerlauf 0, Android-Kaltstart ≤ 3,0 s, APK ≤ 25 MB. Die relativen Grenzen in der Tabelle oben galten für das V02-Gate. Bei belastetem Rechner wird die Referenz im selben Lauf abwechselnd mitgemessen und jeder Wert auf sie normiert.

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

**Android (Emulator `Pixel_7`, Debug-APK mit V02), 26.11.2026:** Alle 13 Prüfungen sind PASS: Erststart, Fragen bis Archetyp, Tageskarte enthüllt, Drei-Karten-Orakel, Back-Regeln, Kaltstart mit derselben Karte, Flugmodus, reduzierte Bewegung, Labels und Touch-Ziele ≥ 48 dp. Einstellungen sind wiederhergestellt. **Kaltstart bis erster Screen: Median 1,95 s** (5 Läufe: 2,36 / 1,98 / 1,95 / 1,82 / 1,70 s; Debug-Build). Davor lag der Wert bei 2,4 s auf ruhigem Rechner. Der Rechner war diesmal nicht ruhig (45–75 % Last), der Wert ist also eher zu hoch als zu niedrig. Der erste Versuch brach am Archetyp-Screen ab. Das lag am Testskript: Ein Button außerhalb des sichtbaren Bereichs meldet leere Bounds, und das Skript scrollte in die falsche Richtung. Behoben in `scripts/android-evidence.mjs`. Nachweis: `evidence/v02-android-en.webp`.

## V02 · Grenzfall Enthüllung behoben (B-01, D-41), 26.11.2026

**Ursache:** Beim Aufdecken baute der Browser die Schrift-Instanzen für Titel, Schlagworte und Kernsatz sowie die Ersatzschrift für „✦“ erst im Frame der Enthüllung auf. Das ergab ein Layout von 70–90 ms bei 4× CPU-Drosselung, dazu einen zweiten kompletten Layoutdurchlauf, sobald die Kursivschrift nachgeladen war. **Lösung (unsichtbar):** Solange die Karte verdeckt ist, legt „Heute“ im Leerlauf einmal einen unsichtbaren Block mit denselben Textklassen außerhalb des Bildschirms an (D-41). Optik und Ablauf sind unverändert.

Abwechselnd gemessen, gleiche Bedingungen, Tippen direkt nach dem Laden (der Fall aus „V02 final“), 5 Runden. Rohdaten `perf/v02-b01-ab.json`:

| Stand | fps | schlechtester Frame | Ruckler > 50 ms | Grenze | Ergebnis |
|---|---|---|---|---|---|
| `main` @ `03abb3c` | 58–59 | 50–67 ms | 0–1 | – | Referenz |
| V02 vor D-41 | 49–54 | 117–133 ms | 1 | ≥ 50 fps, ≤ 120 ms, ≤ 2 | FAIL |
| V02 mit D-41 | 54–56 | 50 ms | 0 | ≥ 50 fps, ≤ 120 ms, ≤ 2 | **PASS** |

**Abgleich mit den absoluten Obergrenzen (gelten ab QG-V03, MASTER_ROADMAP §6):** Rechner ruhig (Referenz 966 ms statt 996 ms, kaum Normierung nötig).

| Kennzahl | V02 Endstand | Obergrenze | Ergebnis |
|---|---|---|---|
| „Heute“ sichtbar (15 Runden verschachtelt) | 1.175–1.230 ms, +22–27 % zu `main` (normiert ≈ 1.210–1.270 ms) | ≤ 1.250 ms | **Grenzfall** → V03.5 (B-08) |
| „Heute“ FCP | ≈ 500 ms | ≤ 900 ms | PASS |
| „Heute“ LCP | 1.008–1.096 ms | ≤ 1.400 ms | PASS |
| Übertragung / Bilder | 702–714 KB / ≤ 473 KB | ≤ 900 / ≤ 600 KB | PASS |
| Start-JS | 132,4 KB gzip | ≤ 160 KB | PASS |
| Enthüllung | 54–56 fps, schlechtester Frame 50 ms | ≥ 50 fps, ≤ 120 ms | PASS |
| Leerlauf | 0 Animationen | 0 | PASS |
| Android-Kaltstart | 1,95 s (unter Last) | ≤ 3,0 s | PASS |

D-41 verändert „Heute sichtbar“ nicht: Der Vorwärm-Block entsteht nur bei verdeckter Karte und erst nach dem Laden (geprüft: beim Laden eines aufgedeckten Tages erscheint er nie). Das V02-Gate (≤ +25 % zu `main`) liegt damit im Messrauschen an der Grenze. Laut Masterplan wird das in V03.5 gegen die absolute Grenze behoben, ohne optische Abstriche.

## V03.5 · Ladeänderungen und schlanker Abschluss (D-50, D-52), 27.11.2026

**Unsichtbare Änderungen für B-08 (D-50):** Wiederkehrende Nutzer warten beim Start nicht mehr auf das Textmodul (es lädt im Hintergrund). Die Pflanzenecken A02 laden erst nach dem `load`-Ereignis, das D-41-Vorwärmen der Schriften startet nach `load` (spätestens nach 2,5 s). Das Endbild ist gleich; die Ecken erscheinen einen Augenblick später.

**Kennzahl „Heute sichtbar“:** Sie endet in `scripts/perf.mjs` faktisch mit dem `load`-Ereignis, weil `page.goto` darauf wartet. Der Bildschirm steht im Browser schon nach ≈ 470–550 ms (≈ 40 ms später als `main`). Die Referenz wurde genauso gemessen; die Kennzahl bleibt deshalb unverändert.

| Kennzahl | Wert | Grenze | Ergebnis |
|---|---|---|---|
| „Heute“ sichtbar (eine verschachtelte Runde, V03 1.064 ms gegen `main` 907 ms) | normiert ≈ 1.168 ms; ältere Runden vor der letzten Änderung 1.212–1.315 ms | ≤ 1.250 ms | im Rahmen, **nicht abschließend** (nur eine Runde) |
| Start-JS | 132,7 kB gzip | ≤ 160 kB | PASS |
| Android-Kaltstart V03 (Emulator `Pixel_7`, Debug, Median aus 5) | 1,58 s (1,83 / 1,66 / 1,58 / 1,58 / 1,56 s); 0.2.0 im selben Lauf 1,57 s | ≤ 3,0 s | PASS |
| Android-APK 0.3.0 (Debug) | 8,1 MB | ≤ 25 MB | PASS |

**Entscheidung des Eigentümers (D-52):** Keine weiteren Messrunden in V03. Die Messung gegen die Referenz läuft vor dem geschlossenen Test (QG-V05) und in der Härtung (V07.5), weil V04 neue Bilder bringt und Messungen davor sofort veralten. Für Android zählt der Kaltstart. Reserve, falls die Messung vor QG-V05 knapp wird: Kartenbilder in 560 px Breite per `srcset`/`sizes` ausliefern (Heldenkarte höchstens 272 CSS-px), spart ≈ 60 KB bei der Rückseite.

Die Rohdaten der einen Runde aus der Vorgänger-Sitzung wurden nicht gesichert; die Werte stammen aus deren Übergabe.

## V04 · Android: Enthüllung und Teilen (B-13, B-14), 27.11.2026

Gemessen auf dem Emulator `Pixel_7` (2 GB RAM, Host-GPU über den GL-Übersetzer des Emulators, WebView 147, Debug-APK), vor jeder Serie kalt gestartet, erster Lauf nach der Installation verworfen. Werkzeuge: `scripts/android-trace.mjs` (Frames, Chrome-Trace, Versuche mit eingespieltem CSS/JS), `scripts/trace-analyze.mjs`, `scripts/android-v04.mjs`. Rohdaten: `docs/visual/perf/v04-android-b13-b14.json`.

| Messung | vorher | nachher | Grenze | Ergebnis |
|---|---|---|---|---|
| Enthüllung (fps) | 52,4–58,0 (9 Läufe) | 56,6–58,8 (7 Läufe) | ≥ 50 fps (V04.2, Emulator) | PASS |
| Enthüllung, Frames > 50 ms | 2 in jedem Lauf | 1 (6 Läufe), 2 (1 Lauf) | – | besser |
| Enthüllung, schlechtester Frame | 117–233 ms | 117–183 ms | ≤ 120 ms gilt unter Referenzbedingungen (§6) | Emulator-Wert, siehe unten |
| Tab-Wechsel zum Vergleich (schlechtester Frame) | „Heute“ 167–233, „Grimoire“ 100–117, „Ich“ 67, „Orakel“ 33–50 ms | – | – | – |
| Erste Story direkt nach dem Fragebogen | 13.215 / 13.520 ms | 230–299 ms | ≤ 1,5 s | PASS |
| Story / Beitrag online | 0,36–1,21 s / 0,13–0,25 s | 288–311 / 94–135 ms | ≤ 1,5 s | PASS |
| Story / Beitrag offline nach Kaltstart | 0,51–1,65 s / 0,16–1,61 s | 479–639 / 94–137 ms | ≤ 1,5 s | PASS |

**B-14:** Die Karte war nach ≈ 0,5 s gezeichnet; danach wartete `toBlob`, weil Chromium PNG auf dem Hauptthread nur in Leerlaufphasen kodiert und eine ganz ruhige Seite keine erzeugt (feste Fristen auf Android 4 s + 9 s). Lösung S-30: Kodierung im Worker.

**B-13:** Beim Wechsel ist der Hauptthread fast frei; der GPU-Thread rastert in Schritten zu 15–21 ms (36 verworfene Frames in 1,5 s). Einzelne Ebenen auszublenden änderte nichts. Vorladen von Schrift, Raum und Porträt auf dem Themenschritt (S-31) nimmt den zweiten langen Frame weg. Der erste bleibt und tritt auf dem Emulator bei jedem Wechsel auf einen bildreichen Screen auf; Messung auf einem echten Gerät in V07.5.

## V05 · Messung vor QG-V05 (D-52, B-08), 28.11.2026

Gemessen mit `scripts/perf.mjs` unter den festen Bedingungen, abwechselnd gegen die Referenz `main` @ `03abb3c` (eigener Build im selben Lauf), 3 Runden zu je 5 Läufen. Der Rechner war nebenher belastet (CPU-Last 40–88 %), deshalb ist jeder Wert auf die Referenz derselben Runde normiert: Wert × Basiswert ÷ Referenz. Rohdaten beider Serien: `docs/visual/perf/v05-qg-ab.json`.

**Serie A: `feature/v05-karten` @ `54dd029` (Stand des Branches)**

| Kennzahl | Runde 1 / 2 / 3 | Grenze (§6) | Ergebnis |
|---|---|---|---|
| „Heute“ sichtbar, normiert | 1.260 / 1.311 / 1.313 ms (roh 1.292 / 1.352 / 1.281 ms, Referenz roh 1.021 / 1.027 / 972 ms) | ≤ 1.250 ms | **FAIL** (alle Runden, auch roh) |
| Erststart, normiert | 1.704 / 1.500 / 1.646 ms (roh 1.193 / 1.038 / 1.150 ms, Referenz roh 929 / 918 / 927 ms) | ≤ 1.600 ms | **FAIL** (2 von 3 Runden) |
| FCP „Heute“, normiert | 543 / 561 / 528 ms | ≤ 900 ms | PASS |
| LCP „Heute“, normiert | 1.122 / 1.266 / 1.099 ms | ≤ 1.400 ms | PASS |
| Übertragung „Heute“ / davon Bilder | 780 KB / 473 KB | ≤ 900 KB / ≤ 600 KB | PASS |
| Enthüllung | 52 / 55 / 57 fps, je 1 Ruckler, schlechtester Frame 50–67 ms | ≥ 50 fps, ≤ 2 Ruckler, ≤ 120 ms | PASS |
| Leerlauf | 0 laufende Animationen | 0 | PASS |
| Start-JS | 144,6 kB gzip | ≤ 160 kB | PASS |
| Android-Kaltstart | – | ≤ 3,0 s | **NOT RUN** (Emulator aus; folgt kalt gestartet mit dem Debug-Build, vergleichbar mit V03) |
| APK | Release 12,9 MB, Debug 14,1 MB | ≤ 25 MB | PASS |

**Ursache (Ladeverlauf und CPU-Profil unter 4× Drosselung):** Seit der Referenz ist der Hauptteil des Start-JS von 121,5 auf 137,8 KB gzip gewachsen (V03 bis V05: Datenmodell, Identität, Reise, Grimoire, Legungen). Der Browser braucht länger, bis er den Code ausgeführt und die Seite einmal aufgebaut hat; erst dann fragt er Kartenrückseite und Raumbild an. Die Rückseite startet bei ≈ 722 ms statt ≈ 608 ms, und `bg-today-720` und die Rückseite halten das `load`-Ereignis auf, an dem die Kennzahl endet. Die Bilder selbst sind nicht der Engpass: Übertragung und Bildanteil liegen deutlich unter den Grenzen.

**Versuch: Kartenbilder in 560 px (S-60, Reserve aus D-52), nicht übernommen.** Große Karten luden per `srcset`/`sizes` eine 560 × 840-Fassung (Bildqualität geprüft, PSNR ≥ 35 dB). Serie B, gleiche Bedingungen: Bilder auf „Heute“ 318–352 KB statt 473 KB, aber „Heute“ sichtbar normiert 1.260 / 1.297 / 1.357 ms, also kein messbarer Gewinn; Erststart 1.572 / 1.718 / 1.827 ms. Die Enthüllung hatte 2 / 3 / 3 Ruckler (schlechtester Frame 83–117 ms) gegen je 1 in Serie A und bei der Referenz; ob das an der Änderung lag oder am Rauschen (eine Messung je Runde), ist offen. Weil die Änderung das Problem nicht löst und ein Risiko für die Enthüllung trägt, ist sie zurückgenommen; der Stand des Branches ist Serie A.

**Ergebnis:** B-08 ist nicht behoben. Zwei absolute Grenzen werden gerissen: „Heute“ sichtbar um ≈ 10–60 ms (normiert), der Erststart in zwei von drei Runden um ≈ 50–100 ms. Alle übrigen gemessenen Grenzen halten.

**Optionen (Entscheidung beim Eigentümer):**

| Option | Was | Sichtbar? | Aufwand mit neuer Messung | Erwartung |
|---|---|---|---|---|
| 1 · Kleine Variante (Empfehlung) | Orakel, Willkommen mit Fragebogen und die Detailteile des Grimoires erst bei Bedarf laden und im Leerlauf vorladen; die Identität erst nach dem ersten Bild berechnen | nein | ≈ 1,5–2 h | Start-JS sinkt um geschätzt 8–12 kB gzip (Orakel, Willkommen und Grimoire-Teile sind im Quelltext ≈ 11 kB gzip), „Heute“ wird früher fertig; ob es unter 1.250 ms reicht, zeigt erst die Messung |
| 2 · Große Variante (zusätzlich) | nur die aktive Sprache der Oberflächen- und Kartentexte laden, die andere erst beim Sprachwechsel | nein | weitere ≈ 1,5–2 h | weitere ≈ 10–15 kB gzip (die Kartentexte beider Sprachen stecken im Start-JS), aber riskanter (Sprachwechsel, Tests, Content-Gate) |
| 3 · Ausnahme wie D-52 | Ergebnis hinnehmen, Behebung in der Härtung V07.5 | nein | – | QG-V05 mit dokumentierter Ausnahme |
| 4 · Raumbild nach der Karte laden | Das Gemälde erscheint einen Augenblick nach der Karte | **ja** (nur nach Rückfrage) | ≈ 1 h | „Heute“ sichtbar dürfte deutlich sinken, das Bild blendet aber sichtbar später ein |

**Entscheidung des Eigentümers (D-67, 28.11.2026):** Ausnahme wie D-52. Das Ergebnis wird hingenommen und vermerkt, V05 wird nach den übrigen QG-V05-Prüfungen gemergt. B-08 wird spätestens in der Härtung V07.5 behoben, zuerst mit Option 1, bei Bedarf mit Option 2; Option 4 nur nach Rückfrage. Bis dahin prüft jedes Gate das Start-JS-Budget (≤ 160 kB, Stand 144,6 kB), damit der Abstand nicht unbemerkt wächst.
