# VISUAL_AUDIT · Ist-Stand gegen Wunsch-Mockup (V00/V01)

**Referenz:** `docs/visual/reference/wunsch-mockup.webp` (vom Eigentümer, verbindlich für Qualität und Atmosphäre, nicht für Funktionen und Zahlen).
**Ist-Stand:** `main` @ `03abb3c` (Deck v2). Screenshots: `docs/visual/audit/ist-stand-de-412.webp` (Willkommen, Archetyp, Heute verdeckt, Orakel, Grimoire, Profil) und die vollständigen Sequenzen in `docs/evidence/browser/` (DE 412, EN Desktop, DE 320 mit 130 % Schrift) und `docs/evidence/android/`.
Reproduzierbar mit `npm run build && npm run preview` und `node scripts/evidence.mjs http://127.0.0.1:5181/ <Ordner> --locale de --width 412`. Die Aufnahmen entstanden am 26.11.2026 auf genau diesem Codestand: Der Tree von `f2a2070` ist identisch mit `03abb3c`.
Kartendecks im Vergleich: `docs/assets/deck-overview.webp` (v1, Vektor) und `docs/assets/deck-overview-v2.webp` (v2, gemalt).

## 1 · Gesamturteil

Die Technik ist solide (Offline, Persistenz, DE/EN, Tests, Android). Die Oberfläche ist sauber, ruhig und lesbar, wirkt aber wie eine **elegante Web-App mit schönen Karten**, nicht wie eine **magische Welt**. Das Mockup lebt von vier Dingen, die bei uns fast vollständig fehlen:

1. **Illustrierte Hintergrundwelten.** Jeder Screen steht in einem Ort (Burg, Wasserfall, Bibliothek, Sternenfenster). Bei uns gibt es nur Tinte, Korn und Vignette.
2. **Inszenierung der Karte.** Glühender Ornamentrahmen, Lichtkranz, Partikel, Tiefe. Bei uns liegt die Karte flach auf der Fläche.
3. **Ornamentik als Sprache.** Goldene Zierlinien, Eckornamente, Mondphasen, Sterne an Überschriften, Rahmen um Panels und Tabs. Bei uns gibt es nur dünne Linien und Standard-Panels.
4. **Sichtbare Reise.** Tag-Zähler, Pfad mit Stationen, Sammlungsfortschritt als Schatz. Bei uns gibt es keinen sichtbaren Fortschritt auf „Heute“ und eine technische Statistik im Grimoire.

## 2 · Bewertung (eigene Prüfung, subjektiv, 0–10)

| Bereich | Review „V2“ | Meine Bewertung (`main` heute) | Begründung |
|---|---|---|---|
| Visuelle Nähe zum Mockup gesamt | 48 % | **40 %** | Karten und Typografie sind nah, alles um sie herum nicht |
| Kartenillustrationen | 7 | **7** | Malerisch, einheitlich, symbolisch stark. Weniger emotional als die figurativen Mockup-Karten (Herrscherin als Person). Rahmen schlichter als im Mockup |
| Hintergrundwelten | 2 | **1,5** | Es existieren keine. Nur Farbverlauf, Korn und auf „Heute“ zwei feine Kreise |
| Typografie | 8 | **7** | Gute Schriften. Aber Hierarchie flach: wenig Größenkontrast, keine verzierten Überschriften, Buttons in Sans statt in der Display-Serife wie im Mockup |
| Goldornamente | 4 | **3** | Nur Trennlinie mit Raute und Kartenrahmen. Keine Eck- und Kopfornamente, keine Rahmen um Panels |
| Archetypen | 3 | **2,5** | Geometrische Sigillen in einem Kreis. Gute Texte, aber kein Bild, mit dem man sich identifiziert |
| Sammelatmosphäre | 4 | **3** | Am Anfang 18–21 identische Rückseiten im Raster, Fortschritt als Balken mit „4/22“ |
| Mystische Atmosphäre | 5 | **4** | Die Karten tragen fast allein |
| Interaktion und Inszenierung | – | **5** | Kartendrehung gut, sonst keine Licht- und Partikelmomente |
| Lesbarkeit und Barrierefreiheit | – | **8** | Kontraste, Touch-Ziele, 200 % Schrift, reduzierte Bewegung geprüft. Das muss im Redesign erhalten bleiben |

**Korrekturen am Review:**
- „Main 32 % / V2 48 %“: Es gibt nur noch einen Stand. `main` enthält V2 (siehe `MERGE_RECOMMENDATION.md`).
- „`npm run art` überschreibt V2“: bereits behoben und gegengeprüft.
- Typografie mit 8/10 ist zu großzügig. Die Schriftwahl stimmt, die Anwendung ist zu zurückhaltend.

## 3 · Abweichungen pro Screen

### Tagesorakel (Mockup links) — Ist: `06-heute-verdeckt`, `09-heute-enthuellt`, `10-heute-botschaft`

| Mockup | Ist | Lücke |
|---|---|---|
| Kopf mit Logo (Mondphasen + Stern + ARCANA-Wortmarke), Menü- und Glocken-Icon | Datum als Eyebrow, „Deine Tageskarte“ | Kein Branding auf dem Hauptscreen |
| „Your Oracle Journey · Day 12 · The Awakening Path“ | – | Keine Reise, kein Tag-Zähler |
| Hintergrund: nächtliche Burg, Wasserfall, Lavendel, Sternenhimmel in Petrol/Violett | dunkle Fläche | Fehlt komplett (größter Einzelhebel) |
| Karte groß, glühender Goldrahmen, Lichtkranz, Zahl im Medaillon, Titelplakette | Karte groß, Rahmen im Bild, flacher Schatten | Keine Aura, kein Glühen, keine Tiefe |
| „Today’s Oracle · The Empress“ + drei Schlagworte + kurzer Satz | Ziffer, Titel, Essenz, Botschaft (lange Texte darunter) | Schlagworte fehlen. Hierarchie gut, aber unspektakulär |
| 12-Day-Streak-Plakette, Pfad mit 6 Stationen | – | Progression fehlt (siehe V04, bewusst ohne Druck) |
| CTA „Continue Your Journey“: dunkle Pille mit Gold-/Magenta-Kontur | heller Gold-Button | Unser Button ist hochwertig, aber „Standard“. Im Mockup ist der CTA ein Schmuckstück |
| Tab-Leiste mit leuchtendem aktivem Icon, Goldlinie oben | schlichte Leiste, aktive Pille | Wenig Glanz |

### Orakel/Reading (Mockup rechts) — Ist: `12`–`17`

| Mockup | Ist | Lücke |
|---|---|---|
| Themen-Chips (Love, Career, Self-Discovery) mit Icons, aktives Thema magenta umrandet | Thema als Überschrift, Wahl im Startscreen | Themenwechsel weniger sichtbar, keine Themenfarbe |
| Mondphasen-Kopfornament, „Love Reading“ in Kursiv-Display, Untertitel „Insight · Direction · Potential“ | Eyebrow + Titel | Ornamentik fehlt |
| Drei Karten auf einer Bühne mit Wolken, Mondlicht, mittlere Karte hervorgehoben und größer | drei gleich große Karten nebeneinander | Keine räumliche Staffelung, keine Bühne |
| „Your Interpretation“-Panel: Ornamentrahmen, Icon je Position, kurze Texte | Karten-Panels untereinander, lange Texte | Panels nüchtern. Inhalt ist bei uns reicher und das bleibt so |
| „Past/Present/Future“ | Situation/Herausforderung/Impuls | **Bewusst nicht übernehmen**: Vergangenheit/Zukunft suggeriert Vorhersage (Produktregel) |
| „Save to My Grimoire“ + Teilen | Speichern, Verwerfen | Teilen fehlt (V04) |

### Sammlung/Grimoire (Mockup Mitte) — Ist: `18`, `19`, `07-grimoire-leer`

| Mockup | Ist | Lücke |
|---|---|---|
| Tabs Decks/Archetypes/Discoveries | Sammlung/Verlauf | Archetypen als Sammelobjekt fehlen |
| Deck-Fächer mit Lorbeer, „63/78 discovered“, Teal-Fortschritt mit Glanz | Balken + „4/22“ | Fortschritt technisch |
| Archetypen-Kacheln mit Illustration und Status | – | Fehlt |
| „Rarity Overview“ (Common … Mythic) | – | **Nicht übernehmen** (siehe 4) |
| Schatzkammer-Gefühl | Raster mit vielen gleichen Rückseiten | Unentdeckte Karten dominieren |

### Archetyp-Enthüllung und Profil — Ist: `04`, `05`, `21`–`24`

Im Mockup gibt es keine eigene Ansicht, die Archetypen-Kacheln zeigen aber die Richtung: **jede Archetype ist ein Bild** (Figur, Tier, Symbol in einer Szene). Bei uns ist es eine Sigille im Kreis mit vier Textpanels. Der Enthüllungsmoment hat keine Choreografie (kein Licht, kein Aufbau, kein Bild).

### Willkommen und Fragen — Ist: `01`–`03`

Solide, aber ohne Welt. Das Logo existiert nur als gesperrte Wortmarke. Für den ersten Eindruck im Store ist das zu schwach.

## 4 · Was vom Mockup bewusst nicht übernommen wird

| Element | Grund |
|---|---|
| 78 Karten, „63/78“ | Inhaltlich sind nur 22 große Arkana vorhanden. Kleine Arkana wären ein großes Content-Projekt (P2, eigene Freigabe) |
| Seltenheitsstufen Common bis Mythic | Bei Tarot ist keine Karte „wertvoller“. Seltenheit erzeugt Lootbox-Dynamik und widerspricht „keine künstliche Verknappung“ |
| Glocke/Benachrichtigungen | Benachrichtigungen sind P2 und brauchen Einwilligung |
| Past/Present/Future | Vorhersage-Rahmung (siehe oben) |
| „Mythic“, „Unlocked“ als Kaufdruck-Optik | keine Paywall-Ästhetik in P0 |
| Brennende Kerze, Räucherwerk im Bild | nur als Dekor im Hintergrund unproblematisch. Rituale in Texten bleiben ohne Feuer |

## 5 · Was gut ist und bleiben muss

- Kartendeck v2 als Basis: Stil, Farben und Symbolik passen in die Mockup-Welt. Der Rahmen braucht mehr Glanz (CSS-Aura statt Neuexport, siehe Art Direction).
- Typografie-Paar Cormorant Garamond + Manrope.
- Inhalte (Botschaft, Reflexion, Ritual) sind reicher als im Mockup. Das Mockup kürzt auf einen Satz. Wir zeigen zuerst kurz und darunter vollständig.
- Ehrliche Rahmung („symbolische Perspektive“), Barrierefreiheit, Offline-Kern.
