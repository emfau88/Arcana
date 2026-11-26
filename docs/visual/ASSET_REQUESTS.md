# ASSET_REQUESTS · Externe Bild-Assets (Produktvision V2, in Bulks)

Dieses Manifest legt fest, welche Bilder extern (z. B. mit ChatGPT) erzeugt werden. Alles andere entsteht im Code (Liste in Abschnitt 5). Jeder Prompt ist einzeln kopierbar und setzt kein Wissen über dieses Projekt voraus.

**Seit 26.11.2026 nach Produktvision V2 geordnet:** Bilder kommen in **Bulks**, je einer pro Paket aus `docs/product/MASTER_ROADMAP_V2.md`. Angefordert wird **immer nur der nächste Bulk**. Spezifikationen, Prompts und Abnahmekriterien stehen schon für alle geplanten Assets hier, damit der Stil über alle Bulks gleich bleibt.

**Lieferung:** Dateien mit exakt dem genannten Namen, möglichst in Originalauflösung (PNG), in einen Ordner deiner Wahl legen und mir den Pfad nennen. Den Export in WebP, die Größen und die Prüfung übernehme ich. Die Originale bitte außerhalb des Repos aufbewahren.

**Hinweis zur Auflösung:** ChatGPT liefert Hochformate meist als 1024 × 1536 (2:3). Das genügt als Master. Ist eine höhere Auflösung verfügbar, bitte die höchste nehmen.

**Stil-Anker:** Bei jeder Anfrage `bg-today.png` (A01) als Referenzbild mitgeben und dazuschreiben: „Match the painting style, light and palette of the attached reference image.“ Bei Kartenrücken zusätzlich `public/cards/card-back.webp`.

## 0 · Übersicht

| ID | Datei | Bulk / Paket | Wofür | Erzeugung | Status |
|---|---|---|---|---|---|
| A01 | `bg-today.png` | B1 / V02 | Hintergrundwelt Tagesorakel | einzeln | geliefert, eingebaut |
| A02 | `fg-today-foliage.png` | B1 / V02 | Pflanzenecken (Tiefe) | einzeln, transparent | geliefert, eingebaut |
| A05 | `bg-profile.png` | **B2 / V04** | „Ich“, Archetyp-Enthüllung | einzeln | **jetzt angefordert** |
| A06 | `bg-welcome.png` | **B2 / V04** | Willkommen, 7 Fragen | einzeln | **jetzt angefordert** |
| A07–A14 | `archetype-<id>.png` (8×) | **B2 / V04** | Archetyp-Porträts | einzeln, eine Serie | **jetzt angefordert** |
| A19 | `bg-starmap.png` | **B2 / V04** | Sternkarte (Reise), Rückblicke | einzeln | **jetzt angefordert** |
| A03 | `bg-oracle.png` | B3 / V05 | Orakel, Legungen | einzeln | nach QG-V04 |
| A04 | `bg-grimoire.png` | B3 / V05 | Grimoire (Buch, Kapitel) | einzeln | nach QG-V04 |
| A15 | `grimoire-book.png` | B3 / V05 | Buch-Einband im Grimoire | einzeln, transparent | nach QG-V04 |
| A20 | `cardback-crescent.png` | B3 / V05 | Kartenrücken „Mondsichel“ (Meilenstein 14) | einzeln | nach QG-V04 |
| A21 | `cardback-compass.png` | B3 / V05 | Kartenrücken „Sternenkompass“ (Meilenstein 75) | einzeln | nach QG-V04 |
| A23–A29 | `grimoire-vignettes.png` | B3 / V05 | 7 Kapitel-Vignetten plus Schlussvignette | ein Sheet, transparent | nach QG-V04 |
| A30 | `parchment-tile.png` | B3 / V05 | Pergament der Buchseiten | einzeln, kachelbar | nach QG-V04 |
| A32 | `bg-discover.png` | B4 / V06 | Entdecken (Zahlen, Engelszahlen, Symbole) | einzeln | nach QG-V05 |
| A33 | `symbols-sheet-1.png`, `symbols-sheet-2.png` | B4 / V06 | 24 Symbole des Lexikons | 2 Sheets, transparent | nach QG-V05 und finaler Symbolliste |
| A18 | `store-feature.png` | B5 / V07 | Store-Grafik 1024 × 500 | einzeln | nach QG-V06 und E11 (Name) |
| A22 | `cardback-golden-wheel.png` | B5 / V07 | Kartenrücken „Goldenes Rad“ (Tag 365) | einzeln | nach QG-V06 |
| A31 | `cardback-edition.png` | B5 / V07 | Kartenrücken der Edition | einzeln | nur mit Billing-Freigabe (E14) |
| A34 | `bg-moon.png` | B6 / 1.1 | Mondwelt | einzeln | nach Release 1.0 |
| – | Zusatzdeck (23 Bilder) | B7 / 1.2 | erstes Kartendeck als Einzelkauf | Serie | nach Entscheidung, eigene Anfrage |
| A16 | `props-sheet.png` | zurückgestellt | Dekor-Objekte | Sheet | nur falls ein Screen es braucht |
| A17 | `card-<id>.png` | zurückgestellt | figurative Ersatzkarten | einzeln | Entscheidung E3 |

**Stand der Bulks** (wird bei jeder Lieferung abgehakt):

- [x] B1 · A01, A02 geliefert und eingebaut (V02)
- [ ] B2 · für V04, Ablauf in §0.1 · **geliefert 26.11.2026 (11/11)**, Einbau in V04
- [ ] B3 · für V05 · teilweise geliefert (A03, A04, A15, A20, A21, A23–A29, A30)
- [ ] B4 · für V06 · teilweise geliefert (A32, zwei Symbol-Sheets A33)
- [ ] B5 · für V07 · teilweise geliefert (A18, A22, Kartenrücken Edition)
- [ ] B6 · für 1.1 · A34 geliefert
- [ ] B7 · für 1.2 · Zusatzdeck in Arbeit (Rücken und erste Karten geliefert)

**Lieferweg:** Ein Bild-Agent legt die Masters nach und nach in `%USERPROFILE%\Pictures\Arcana\<Bulk>\` ab (nicht im Repo). Eingebaut wird **erst im Paket, das sie braucht** (B2 in V04, B3 in V05 usw.): dort geprüft, als WebP exportiert und ins Repo übernommen. Bis dahin bleiben sie im Lieferordner.

**Bis Release 1.0:** 2 geliefert, ≈ 30 neue Dateien. Zahlen, Engelszahlen, Medaillons, Monde, Sternbilder, Ornamente und Stufen-Symbole entstehen im Code (Abschnitt 5).

## 0.1 · Aktuelle Anforderung: Bulk B2 (für V04 Identität und Reise)

V04 baut Fragebogen, Archetyp-Enthüllung, „Ich“ und die Sternkarte. Die Bilder werden erst in V04 eingebaut. Sie jetzt zu erzeugen spart Wartezeit, ändert aber nichts an V02 oder V03.

| Reihenfolge | ID | Datei | Wofür in V04 |
|---|---|---|---|
| 1 | A05 | `bg-profile.png` | Bühne der Enthüllung und Hintergrund von „Ich“ |
| 2 | A07 | `archetype-seeker.png` | **Stilprobe** der Porträt-Serie |
| – | – | – | **Stopp:** A05 und A07 zuerst schicken. Ich prüfe Beschnitt, Kontrast und Wirkung zusammen und gebe die Serie frei oder schlage Korrekturen am Prompt vor |
| 3 | A08–A14 | `archetype-<id>.png` (7×) | restliche Porträts, im selben Chatverlauf wie A07. Werden in V04 auch für die teilbare Archetypkarte (1080 × 1920) gebraucht, darum möglichst hohe Auflösung |
| 4 | A06 | `bg-welcome.png` | Willkommen und Fragen, erster Eindruck, später Store-Screenshots |
| 5 | A19 | `bg-starmap.png` | Sternkarte im Kapitel „Reise“, Wochen- und Monatsrückblick |

**Stand B2:**

- [x] A05 und A07 erzeugt und geschickt
- [x] Serie geprüft (26.11.2026): Stil, Farbwelt und Format (1024 × 1536) stimmig, keine Schrift im Bild. **Offen für den Eigentümer:** alle acht Porträts zeigen Frauen mit ähnlichen Gesichtszügen (meist hell und blond); die Archetypen sind für alle Menschen gedacht. **Eigentümer 26.11.2026: vorerst so lassen**
- [x] A08–A14 erzeugt und geschickt
- [x] A06 erzeugt und geschickt
- [x] A19 erzeugt und geschickt
- [ ] alle B2-Bilder im Layout geprüft (Beschnitt, Kontrast), als WebP exportiert und im Repo (V04)

**Warum diese Reihenfolge:** Die Porträts sind der größte und riskanteste Teil (acht Bilder als Serie). Eine Stilprobe mit der zugehörigen Bühne verhindert, dass acht Bilder neu erzeugt werden müssen.

**Nicht in B2:** A03, A04, A15 (Orakel und Grimoire werden erst in V05 umgebaut), alle Kartenrücken (Auswahl kommt in V05), A32/A33 (V06).

## 0.2 · Erkenntnisse aus A01 (gelten für alle Hintergründe)

- Die App verankert Hintergründe oben und skaliert sie auf mindestens 118 % der Bildschirmbreite. Auf schmalen Handys fallen links und rechts je bis zu 9 % weg. Wichtige Motive gehören in die mittleren 80 % der Breite.
- Die unteren etwa 15 % blenden in die Nacht über (Tab-Leiste, Pflanzenecken). Dort nichts Wichtiges.
- Dunkle, ruhige Zonen hinter Text funktionieren: Auf A01 sind alle Texte gemessen bei mindestens 5,9:1 Kontrast. Helle Lichtquellen (Mond, Fenster, Lichtkegel) gehören nicht hinter Überschriften.
- 1024 × 1536 PNG genügt als Master. Die Codex-Lieferung von A01/A02 hatte genau das richtige Format.

## Gemeinsamer Stilblock (in jedem Prompt bereits enthalten)

> Luxurious mystical high-fantasy illustration for a premium spiritual oracle app. Painterly digital artwork with the depth of a matte painting: layered atmospheric perspective, soft volumetric light, fine film grain, delicate antique-gold highlights. Palette: deep petrol teal and midnight blue, dark violet, subtle magenta accents, warm antique-gold light sources. Elegant, adult, calm and enchanting, not cartoonish, not neon, no mobile-game look. Absolutely no text, letters, numbers, logos, watermarks or signatures.

---

## A01 · Hintergrundwelt Tagesorakel (Bulk B1, geliefert)

| Feld | Wert |
|---|---|
| Asset-ID | A01 `bg-today` |
| Dateiname Lieferung / Export | `bg-today.png` → `bg-today.webp`, `bg-today-720.webp` |
| Zielverzeichnis | `public/world/` |
| Verwendung | Screen „Heute“ (verdeckt und enthüllt), ganzflächig hinter allem. Am Desktop in der App-Spalte, außen unscharf erweitert |
| Priorität | P0 |
| Master | mind. 1024 × 1536, besser 1536 × 2304 |
| Export | 1080 × 1620 (≤ 320 KB) und 720 × 1080 (≤ 160 KB), WebP q ~78 |
| Seitenverhältnis | 2:3 Hochformat |
| Format / Transparenz | PNG-Master, keine Transparenz |
| Motiv | Nächtliche Märchenlandschaft vom erhöhten Standpunkt: in der Ferne links eine Burg mit warm leuchtenden Fenstern, rechts ein schmaler Wasserfall, im Vordergrund an den Rändern Lavendel und weiße Lilien, darüber ein Sternenhimmel mit Milchstraße in Petrol und Violett, eine schmale Mondsichel oben rechts |
| Komposition | Ruhiges, **dunkleres Zentrum** (Breite 25–75 %, Höhe 22–72 %). Dort liegt die Karte. Details nur an den Seiten und im unteren Fünftel. Horizont bei ca. 60 % Höhe |
| Freizuhalten | oben 0–15 %: ruhiger Himmel (Logo, Datum). Mitte: siehe oben. Unten 72–100 %: dunkel und ruhig (Botschafts-Panel, Tab-Leiste) |
| Beschnitt | Wird per `cover` auf Seitenverhältnisse bis 9:20 beschnitten. Links und rechts fallen bis zu 15 % weg, wichtige Elemente gehören in die mittleren 70 % der Breite |
| Referenz | Mockup links, Hintergrund hinter der Herrscherin-Karte |
| Abnahme | kein Text. Zentrum ruhig genug für Kartenglanz und Text (Kontrast ≥ 4,5:1 mit Panel). Wirkt auch mit 40 % Abdunklung noch magisch. Keine harten Kanten an Beschnittgrenzen |

**Prompt (kopierfertig):**

```text
Luxurious mystical high-fantasy illustration for a premium spiritual oracle app. Painterly digital artwork with the depth of a matte painting: layered atmospheric perspective, soft volumetric light, fine film grain, delicate antique-gold highlights. Palette: deep petrol teal and midnight blue, dark violet, subtle magenta accents, warm antique-gold light sources. Elegant, adult, calm and enchanting, not cartoonish, not neon, no mobile-game look. Absolutely no text, letters, numbers, logos, watermarks or signatures.

Vertical portrait background, 2:3. A serene enchanted night landscape seen from a high terrace: far away on the left a slender fairy-tale castle with a few warmly glowing windows on a cliff, on the right a thin silver waterfall falling into mist, rolling violet hills and a calm valley with soft fog, the horizon at about 60% of the image height. A deep starry sky with a faint teal-violet milky way and a thin crescent moon in the upper right corner. Along the lower left and lower right edges, dark silhouettes of lavender and a few white lilies, slightly out of focus.

Composition is critical: the central area (middle 50% of the width, from 22% to 72% of the height) must stay calm, softly lit and darker than the edges, with no important objects, because a glowing tarot card will be placed there later. The top 15% is quiet sky. The bottom quarter fades into deep shadow. Keep all important details within the middle 70% of the width; the left and right edges may be cropped.
```

---

## A02 · Vordergrund-Ranken Tagesorakel (Bulk B1, geliefert)

| Feld | Wert |
|---|---|
| Asset-ID / Datei | A02 `fg-today-foliage.png` → `fg-today-foliage.webp` (mit Alpha) |
| Ziel | `public/world/` |
| Verwendung | Liegt vor dem Hintergrund und hinter dem Inhalt, nur an Rändern und Ecken. Leichte Parallaxe beim Scrollen (bei reduzierter Bewegung statisch) |
| Master / Export | 1024 × 1536 → 1080 × 1620 WebP mit Alpha, ≤ 200 KB |
| Seitenverhältnis | 2:3 |
| Transparenz | **ja**, alles außer den Pflanzen transparent |
| Motiv | Dunkle Efeuranken mit Goldglanz an den oberen Ecken, Lavendel und weiße Lilien an den unteren Ecken, ein paar winzige Glühwürmchen-Lichter |
| Freizuhalten | gesamte Mitte (Breite 15–85 %, Höhe 10–90 %) **leer** |
| Abnahme | saubere Alphakanten ohne weißen Saum. Wirkt auf dunklem Grund. Mitte frei |

**Prompt:**

```text
Luxurious mystical high-fantasy illustration element for a premium spiritual oracle app, painterly digital artwork with soft volumetric light, fine grain and delicate antique-gold highlights. Palette: deep petrol teal, dark violet, antique gold. No text, letters, numbers, logos or watermarks.

Transparent background PNG, vertical 2:3. A decorative frame made only of plants placed in the corners: dark ivy vines with gold-glinting leaf edges hanging from the top-left and top-right corners, clusters of lavender and two or three white lilies rising from the bottom-left and bottom-right corners, a few tiny warm firefly lights. The entire center of the image (from 15% to 85% of the width and from 10% to 90% of the height) must be completely empty and transparent. Clean edges, no background color, no ground, no sky.
```

---

## A03 · Hintergrund Orakel/Legungen (Bulk B3, V05)

| Feld | Wert |
|---|---|
| Datei / Ziel | `bg-oracle.png` → `public/world/bg-oracle.webp` (+ `-720`) |
| Verwendung | Orakel: Wahl der Legung, Legungen mit 2–7 Karten, Deutung |
| Master / Export / Format | wie A01 (2:3, PNG → WebP ≤ 320/160 KB, keine Transparenz) |
| Motiv | Innenraum eines Sternenobservatoriums: großes gotisches Rundbogenfenster mit Blick auf eine Galaxie und einen großen Mond, davor ein runder Steintisch (die Karten liegen später darauf), Wolkenschleier am Boden, Mondlicht fällt auf den Tisch |
| Komposition | Tischplatte bei 40–60 % Höhe, die mittleren 80 % der Breite frei (drei Karten nebeneinander). Fenster oben mittig |
| Freizuhalten | oben 0–18 % (Themen-Chips, Titel), unten 60–100 % dunkel (Deutungspanels) |
| Abnahme | drei Karten auf dem Tisch wirken wie auf einer Bühne, Fenster verdeckt keine Chips |

```text
Luxurious mystical high-fantasy illustration for a premium spiritual oracle app. Painterly digital artwork with the depth of a matte painting: layered atmospheric perspective, soft volumetric light, fine film grain, delicate antique-gold highlights. Palette: deep petrol teal and midnight blue, dark violet, subtle magenta accents, warm antique-gold light sources. Elegant, adult, calm and enchanting, not cartoonish, not neon, no mobile-game look. Absolutely no text, letters, numbers, logos, watermarks or signatures.

Vertical portrait background, 2:3. Inside a quiet celestial observatory tower at night: a tall gothic arched window in the upper middle opens onto a violet galaxy and a large luminous moon. In front of it a wide round stone table with a dark velvet surface, its top seen slightly from above at 40 to 60% of the image height, lit by a soft beam of moonlight. Low drifting clouds of mist around the floor, a few faint floating gold dust motes, brass astronomical instruments only at the far left and right edges in shadow. The table surface across the middle 80% of the width must be empty and calm, because three tarot cards will be placed there later. The top 18% and the bottom 40% stay dark and quiet. Keep important details within the middle 70% of the width. The app crops up to 9% on the left and right edges and fades the bottom 15% into darkness, so keep every important motif within the middle 80% of the width and above 85% of the height.
```

---

## A04 · Hintergrund Grimoire (Bulk B3, V05)

| Feld | Wert |
|---|---|
| Datei / Ziel | `bg-grimoire.png` → `public/world/bg-grimoire.webp` (+ `-720`) |
| Verwendung | Grimoire: Einband, Inhaltsverzeichnis, Kapitel (die Buchseiten selbst nutzen A30) |
| Master / Export / Format | wie A01 |
| Motiv | Private Bibliothek eines Magiers bei Nacht: Bücherregale mit alten Folianten links und rechts, ein Lesepult, warmes Laternenlicht, Mondlicht durch ein hohes Fenster, schwebende Staubkörner |
| Komposition | Mitte als dunkle, ruhige Wandfläche (Kartenraster liegt darüber), Licht von oben links |
| Freizuhalten | Breite 10–90 %, Höhe 15–95 % ruhig und dunkel |
| Abnahme | das Kartenraster bleibt klar lesbar, „Schatzkammer“-Gefühl |

```text
Luxurious mystical high-fantasy illustration for a premium spiritual oracle app. Painterly digital artwork with the depth of a matte painting: layered atmospheric perspective, soft volumetric light, fine film grain, delicate antique-gold highlights. Palette: deep petrol teal and midnight blue, dark violet, subtle magenta accents, warm antique-gold light sources. Elegant, adult, calm and enchanting, not cartoonish, not neon, no mobile-game look. Absolutely no text, letters, numbers, logos, watermarks or signatures.

Vertical portrait background, 2:3. The private night library of a gentle mage: tall dark wooden bookshelves with old leather-bound books along the left and right edges, a brass lantern glowing warmly on a shelf at the upper left, moonlight falling through a tall narrow window at the top center, floating golden dust motes, a hint of violet mist. The whole middle of the image (from 10% to 90% of the width and from 15% to 95% of the height) is a calm, dark, softly textured wall in shadow with no objects, because a grid of cards will be displayed on top. The bookshelves reach about a quarter of the width in from each side, so they stay visible when the outer edges are cropped. Spines of books without any readable text. The app crops up to 9% on the left and right edges and fades the bottom 15% into darkness, so keep every important motif within the middle 80% of the width and above 85% of the height.
```

---

## A05 · Hintergrund „Ich“ und Archetyp-Enthüllung (Bulk B2, V04)

| Feld | Wert |
|---|---|
| Datei / Ziel | `bg-profile.png` → `public/world/bg-profile.webp` (+ `-720`) |
| Verwendung | „Ich“ (Profil), Archetyp-Enthüllung (Bühne, auf der das Porträt erscheint) |
| Master / Export / Format | wie A01 |
| Motiv | Sternenkuppel eines Planetariums mit goldenen Konstellationslinien, Bodenspiegelung, ein Lichtkegel von oben in die Mitte (dort steht später das Archetyp-Porträt) |
| Freizuhalten | Mitte 20–80 % Breite, 12–60 % Höhe als Lichtkegel ohne Objekte, unten 60–100 % dunkel |
| Abnahme | Enthüllungsmoment wirkt wie ein Bühnenauftritt |

```text
Luxurious mystical high-fantasy illustration for a premium spiritual oracle app. Painterly digital artwork with the depth of a matte painting: layered atmospheric perspective, soft volumetric light, fine film grain, delicate antique-gold highlights. Palette: deep petrol teal and midnight blue, dark violet, subtle magenta accents, warm antique-gold light sources. Elegant, adult, calm and enchanting, not cartoonish, not neon, no mobile-game look. Absolutely no text, letters, numbers, logos, watermarks or signatures.

Vertical portrait background, 2:3. Inside a vast celestial dome at night: the curved ceiling is a deep teal and violet star map with fine glowing gold constellation lines and small engraved planetary rings, a polished dark marble floor reflects the stars. A soft column of warm golden light falls from the top center onto an empty circular dais in the middle of the floor. The central area (from 20% to 80% of the width and from 12% to 60% of the height) contains only the soft light column and no objects, because a portrait will be placed there. The bottom 40% fades into deep shadow. The app crops up to 9% on the left and right edges and fades the bottom 15% into darkness, so keep every important motif within the middle 80% of the width and above 85% of the height.
```

---

## A06 · Hintergrund Willkommen (Bulk B2, V04)

| Feld | Wert |
|---|---|
| Datei / Ziel | `bg-welcome.png` → `public/world/bg-welcome.webp` (+ `-720`) |
| Verwendung | Willkommen, 7 Fragen, Themenwahl. Erster Eindruck und Store-Screenshots |
| Master / Export / Format | wie A01 |
| Motiv | Ein großes, offenes, leuchtendes Grimoire auf einem Steinsockel unter einem Sternenportal, Seiten mit Mond- und Sternkarten (ohne Schrift), goldene Lichtfäden steigen auf |
| Freizuhalten | obere Hälfte für Logo und Titel ruhig, unteres Drittel dunkel für Buttons |
| Abnahme | starker erster Eindruck, ohne Text lesbar |

```text
Luxurious mystical high-fantasy illustration for a premium spiritual oracle app. Painterly digital artwork with the depth of a matte painting: layered atmospheric perspective, soft volumetric light, fine film grain, delicate antique-gold highlights. Palette: deep petrol teal and midnight blue, dark violet, subtle magenta accents, warm antique-gold light sources. Elegant, adult, calm and enchanting, not cartoonish, not neon, no mobile-game look. Absolutely no text, letters, numbers, logos, watermarks or signatures.

Vertical portrait background, 2:3. A large ancient open grimoire rests on a carved stone pedestal at about 55 to 70% of the image height, its parchment pages show only drawn moon phases, star charts and a sun diagram without any writing. Thin threads of golden light and tiny sparks rise from the pages into a night sky framed by a tall arched portal of dark stone covered in starlight. Lavender and crystals at the far lower edges. The upper half of the image is calm open night sky with soft stars, because a logo and a title will be placed there. The bottom 25% fades into deep shadow. Keep important details within the middle 70% of the width. The app crops up to 9% on the left and right edges and fades the bottom 15% into darkness, so keep every important motif within the middle 80% of the width and above 85% of the height.
```

---

## A07–A14 · Archetyp-Porträts (Bulk B2, V04, 8 einzelne Bilder)

| Feld | Wert |
|---|---|
| Dateien | `archetype-seeker.png`, `archetype-guardian.png`, `archetype-visionary.png`, `archetype-alchemist.png`, `archetype-wanderer.png`, `archetype-creator.png`, `archetype-sage.png`, `archetype-renewer.png` |
| Ziel | `public/archetypes/` (720 × 1080 und Thumbnail 240 × 360, WebP, ≤ 180 KB / 30 KB; zusätzlich 1080 × 1620 nur für Teilen-Bilder, lazy geladen) |
| Verwendung | Archetyp-Enthüllung (groß, auf A05), „Ich“, Grimoire-Kapitel „Archetypen“ (alle acht lesbar), Teilen-Bild „Mein Archetyp“ (J2) |
| Master / Format | mind. 1024 × 1536, 2:3, PNG, keine Transparenz |
| Komposition | Figur oder Hauptsymbol mittig. Kopf bzw. Fokus bei 30–40 % Höhe. Unteres Viertel ruhig und dunkel (Name wird darunter bzw. per Verlauf eingeblendet). Kein Rahmen (den legt die App darüber) |
| Figuren | erwachsene, mystische Figuren, divers, **individuell und ausdrucksstark, Gesichter ausdrücklich erlaubt** (Entscheidung E2). Emotional ansprechend, würdevoll, keine Sexualisierung |
| Konsistenz | Alle acht mit identischem Stilblock und gleicher Lichtlogik erzeugen, am besten in einem Chatverlauf nacheinander |
| Abnahme | die acht sind auf Thumbnail-Größe klar unterscheidbar und wirken als Serie. Kein Text |

**Gemeinsamer Anfang für alle acht Prompts** (`[MOTIV]` ersetzen):

```text
Luxurious mystical high-fantasy character illustration for a premium spiritual oracle app, part of a series of eight archetype portraits. Painterly digital artwork with the depth of a matte painting, soft volumetric light, fine film grain, delicate antique-gold highlights. Palette: deep petrol teal and midnight blue, dark violet, subtle magenta accents, warm antique-gold light. Elegant, adult, dignified and calm, not cartoonish, not neon, no mobile-game look, no sexualization. Vertical portrait 2:3, no border or frame, full bleed. The figure or main symbol is centered, its focus at about 35% of the height; the lowest quarter of the image is calm dark ground. The figure has an individual, expressive and emotionally engaging face and posture, a distinct personality, dignified and warm. Absolutely no text, letters, numbers, logos, watermarks or signatures.

[MOTIV]
```

| ID | `[MOTIV]` |
|---|---|
| A07 seeker (Suchende) | A hooded traveler holding up a small brass lantern with a star-shaped flame, standing at a crossroads of glowing paths under a starry sky, a compass rose faintly drawn in light on the ground. |
| A08 guardian (Hütende) | A cloaked figure standing calmly before a softly glowing arched doorway into a moonlit garden, one hand resting on a tall staff, a protective circle of gentle light and white flowers around them. |
| A09 visionary (Sehende) | A figure in a flowing violet robe seen from the side, gazing into a sky full of luminous constellations that form flowing patterns, faint images of a moon and an eye-like nebula reflected in a still pool at their feet. |
| A10 alchemist (Verwandelnde) | A figure at a stone workbench holding a glass flask in which dark smoke turns into golden light, brass alembics and crystals around, warm sparks rising, violet shadows. |
| A11 wanderer (Wandernde) | A figure with a long cloak and walking staff seen from behind on a mountain ridge at dawn, wind in the cloak, a winding path disappearing toward a distant glowing horizon, a few birds. |
| A12 creator (Schaffende) | A figure shaping a small glowing sphere of light between both hands, from which tiny golden leaves, flowers and stars unfold, an atelier of shadows behind them. |
| A13 sage (Weise) | An elderly calm figure in deep teal robes reading an open book in a niche of a night library, a single warm lamp, an owl silhouette on the shelf, floating dust of light. |
| A14 renewer (Erneuernde) | A figure kneeling at the edge of a dark lake at sunrise, releasing a small glowing lotus onto the water, behind them withered branches beginning to sprout fresh luminous leaves. |

---

## A15 · Grimoire-Buch (Bulk B3, V05)

| Feld | Wert |
|---|---|
| Datei / Ziel | `grimoire-book.png` → `public/world/grimoire-book.webp` (Alpha) |
| Verwendung | Einband des Grimoires (Einstieg ins Buch) und Kopf des Inhaltsverzeichnisses |
| Master / Export | 1536 × 1024 (3:2 quer) → 900 × 600 WebP mit Alpha, ≤ 140 KB |
| Transparenz | ja |
| Motiv | Geschlossenes, kostbares Grimoire, dunkelvioletter Ledereinband mit goldenen Beschlägen, Mondphasen und Stern auf dem Deckel, Lesebändchen, leicht schräge Aufsicht |
| Abnahme | saubere Alphakanten, ohne Schrift auf dem Einband |

```text
Luxurious mystical high-fantasy object illustration for a premium spiritual oracle app, painterly digital artwork with soft volumetric light, fine grain and delicate antique-gold highlights. Transparent background PNG, horizontal 3:2. A single closed precious grimoire seen slightly from above at a gentle angle: deep violet leather cover with ornate antique-gold corner fittings, an embossed gold design of a row of moon phases above a radiant eight-pointed star, a violet silk ribbon bookmark, gilded page edges, a soft warm glow around the book. No text, letters, numbers, logos or watermarks on the cover or anywhere. Nothing else in the image, clean edges, no table, no shadow plane.
```

---

## A16 · Dekor-Objekte als Sheet (zurückgestellt)

| Feld | Wert |
|---|---|
| Datei / Ziel | `props-sheet.png` → einzeln ausgeschnitten nach `public/world/props/` |
| Master | 1536 × 1024, transparent |
| Motiv | 6 Objekte in einem 3 × 2-Raster mit viel Abstand: Amethyst-Kristallgruppe, Messing-Astrolabium, Laterne, Glasphiole mit violettem Licht, zwei gekreuzte alte Schlüssel, Federkiel |
| Abnahme | Objekte berühren sich nicht, gleiche Lichtrichtung |

```text
Luxurious mystical high-fantasy asset sheet for a premium spiritual oracle app, painterly digital artwork, soft light from the upper left, delicate antique-gold highlights. Transparent background PNG, horizontal 3:2. Six separate objects arranged in a clean 3 by 2 grid with generous empty space between them, none touching: an amethyst crystal cluster, a brass astrolabe, a small ornate brass lantern with a warm glow, a glass vial with swirling violet light, two crossed antique golden keys, a dark quill feather with gold tip. Same scale and lighting for all. No text, letters, numbers, logos or watermarks, no background, no table.
```

---

## A17 · Figurative Ersatzkarten (zurückgestellt, Entscheidung E3)

Erst wenn Deck v2 im neuen UI geprüft ist (V02/V03). Regeln aus `docs/CODEX_ASSET_PROMPT.md` gelten weiter: 2:3, Master ≥ 1024 × 1536, kein Rahmen, kein Text, Schutzzonen. **Figuren sind jetzt erlaubt.** Kandidaten mit dem größten Gewinn durch Figuren: III Herrscherin, VI Liebende, II Hohepriesterin, XVII Stern, IX Eremit, I Magier. Die Prompts formuliere ich pro Karte, wenn du die Auswahl bestätigst.

---

## A19 · Sternkarte (Bulk B2, V04)

| Feld | Wert |
|---|---|
| Datei / Ziel | `bg-starmap.png` → `public/world/bg-starmap.webp` (+ `-720`) |
| Verwendung | Kapitel „Reise“ (Sternkarte mit einem Sternbild je Runde, Meilensteinen als hellen Sternen), Wochen- und Monatsrückblick. Steht fest, der Inhalt scrollt darüber |
| Master / Export / Format | wie A01 (2:3, PNG → WebP ≤ 320/160 KB, keine Transparenz) |
| Motiv | Eine alte Himmelskarte, lebendig bei Nacht: tiefer Nachthimmel, schwacher Nebelschleier, kaum sichtbare goldene Gravurlinien eines Sternatlas (konzentrische Kreise, Meridianbögen), Astrolabium-Ringe nur an den Rändern |
| Komposition | Fläche 10–90 % Breite und 12–88 % Höhe dunkel, ruhig, kontrastarm, ohne helle Punkte. Die App zeichnet Sterne, Linien und Beschriftungen darauf |
| Freizuhalten | keine Sternbilder, Tierkreiszeichen, Planeten, Gradzahlen oder Buchstaben (alte Atlanten enthalten oft welche) |
| Abnahme | Goldene Punkte von 2 px (#EFD9A4) heben sich überall in der Innenfläche mit ≥ 3:1 ab. Lesetext im Panel ≥ 4,5:1. Keine Schrift und keine Zeichen. Wirkt auch bei 30 % Abdunklung noch wie eine Himmelskarte |

```text
Luxurious mystical high-fantasy illustration for a premium spiritual oracle app. Painterly digital artwork with the depth of a matte painting: layered atmospheric perspective, soft volumetric light, fine film grain, delicate antique-gold highlights. Palette: deep petrol teal and midnight blue, dark violet, subtle magenta accents, warm antique-gold light sources. Elegant, adult, calm and enchanting, not cartoonish, not neon, no mobile-game look. Absolutely no text, letters, numbers, logos, watermarks or signatures.

Vertical portrait background, 2:3. An antique celestial chart come alive at night, seen straight on: a deep midnight-blue and petrol-teal night sky, a very faint violet nebula drifting diagonally, a few tiny dim background stars, and extremely subtle antique-gold engraved lines of an old star atlas: large concentric circles and curved meridian arcs centered slightly below the middle, like the faint grid of a planisphere, drawn at very low opacity. Delicate ornamental astrolabe rings and small engraved gold flourishes only along the outer edges and in the corners. No constellations, no zodiac signs, no planets, no symbols, no degree markings, no numbers and no letters anywhere. The entire area from 10% to 90% of the width and from 12% to 88% of the height must stay dark, calm and low in contrast with no bright spots, because glowing constellations will be drawn on top of it later. The app crops up to 9% on the left and right edges and fades the bottom 15% into darkness, so keep every important motif within the middle 80% of the width and above 85% of the height.
```

---

## A20, A21, A22, A31 · Kartenrücken (Bulks B3 und B5)

Wählbare Rückseiten für verdeckte Karten (Heute, Orakel). Freigeschaltet über Meilensteine (A20 an Reisetag 14, A21 an Tag 75, A22 an Tag 365) bzw. mit der Edition (A31). Gleiche Geometrie wie die vorhandene Rückseite von Deck v2.

| Feld | Wert |
|---|---|
| Dateien / Ziel | `cardback-crescent.png`, `cardback-compass.png`, `cardback-golden-wheel.png`, `cardback-edition.png` → `public/cards/backs/<name>.webp` (720 × 1080, ≤ 140 KB) plus Thumbnail wie `public/cards/thumbs` |
| Master / Format | mind. 1024 × 1536, 2:3, PNG, keine Transparenz. Kein Rahmen-Overlay der App: der Rand gehört zum Motiv (wie bei `card-back`) |
| Komposition | streng spiegelsymmetrisch (links/rechts und oben/unten). Schmaler goldener Zierrand etwa 5 % vom Rand eingerückt. Äußere 3 % ruhig (die App rundet die Ecken mit 36 px bei 720 × 1080) |
| Referenz | `public/cards/card-back.webp` mitgeben: gleiche Randstärke, gleiche Dichte, anderes Motiv |
| Abnahme | als Thumbnail (120 px breit) klar von der Standard-Rückseite und voneinander unterscheidbar. Symmetrie sichtbar. Kein Text. Die Kartenaura der App (Gold- und Teal-Glanz) wirkt darauf nicht überladen |

**Gemeinsamer Anfang** (`[MOTIV]` ersetzen):

```text
Original luxurious oracle card back design for a premium spiritual oracle app, portrait 2:3, full bleed. Painterly digital artwork with delicate antique-gold line ornament, soft inner glow and fine grain. Palette: deep midnight blue and petrol teal, dark violet, subtle magenta accents, warm antique gold. The design is perfectly mirror-symmetric left to right and top to bottom. A thin ornamental antique-gold border is inset about 5% from the edges, matching the border weight and density of the attached reference card back. The outer 3% stays calm because the corners will be rounded. Match the painting style of the attached reference. Absolutely no text, letters, numbers, logos, watermarks or signatures.

[MOTIV]
```

| ID | Bulk | `[MOTIV]` |
|---|---|---|
| A20 Mondsichel | B3 | In the center a large slender crescent moon embraced by delicate night-blooming vines and two white lilies, tiny silver dew-like stars scattered symmetrically around it on a deep teal field. |
| A21 Sternenkompass | B3 | In the center an ornate eight-pointed star compass rose with fine radiating gold rays and petrol-teal enamel segments, set within three concentric engraved astrolabe rings on a midnight-blue field. |
| A22 Goldenes Rad | B5 | In the center a radiant golden wheel with eight spokes, each spoke ending in a small sun or moon disc, a wreath of laurel and wheat ears woven around it, warm antique gold dominating over a deep violet field. |
| A31 Edition | B5 (nur mit Billing) | In the center a luminous night lotus blooming above a deep violet starfield mandala, its petals edged in gold with a soft magenta glow, fine concentric rings of tiny stars around it. |

---

## A23–A29 · Kapitel-Vignetten des Grimoires (Bulk B3, V05)

| Feld | Wert |
|---|---|
| Datei / Ziel | `grimoire-vignettes.png` → einzeln ausgeschnitten nach `public/world/vignettes/<kapitel>.webp` (320 × 320, Alpha, ≤ 30 KB je Datei) |
| Verwendung | Inhaltsverzeichnis und Kapitelanfänge des Grimoires (Karten, Archetypen, Symbole, Tagebuch, Rituale, Zahlen, Reise), Schlussvignette am Kapitelende |
| Master | 1536 × 1024 (3:2 quer), transparent, Raster 4 × 2 mit viel Abstand |
| Stil | wie gold gestochene Vignetten in einem alten Buch: feine antike Goldlinien, sanft gemalte Lichter in Petrol und Violett, gleiche Linienstärke für alle |
| Abnahme | jede Vignette bei 96 px und 160 px erkennbar. Abstand zwischen den Motiven ≥ 40 px, nichts berührt sich. Saubere Alphakanten. Kein Text, keine Ziffern (auch nicht bei „Zahlen“) |

| Position | ID | Kapitel | Motiv |
|---|---|---|---|
| oben 1 | A23 | Karten | drei aufgefächerte Karten mit leerer Rückseite, darüber ein kleiner Stern |
| oben 2 | A24 | Archetypen | Silhouette einer Gestalt mit Kapuze im Profil in einem Ring aus acht kleinen Sternen |
| oben 3 | A25 | Symbole | Schlüssel, Feder und ein augenförmiges Amulett, zusammen arrangiert |
| oben 4 | A26 | Tagebuch | offenes Buch mit Federkiel und kleinem Tintenfass |
| unten 1 | A27 | Rituale | flache Schale mit Wasser, in der sich eine Mondsichel spiegelt, daneben ein Lavendelzweig |
| unten 2 | A28 | Zahlen | heilige Geometrie: Kreis, Dreieck und Quadrat ineinander, neun kleine Punkte |
| unten 3 | A29 | Reise | gewundener Pfad aus kleinen Sternen, der zu einer fernen, erleuchteten Bogentür führt |
| unten 4 | – | Schlussvignette | kleines symmetrisches Goldornament mit einem winzigen Stern |

```text
Luxurious mystical asset sheet for a premium spiritual oracle app: eight small vignettes in the style of gilded engravings from an antique grimoire, fine antique-gold line work with soft painted highlights and a gentle petrol-teal and violet glow, the same line weight and lighting for all. Transparent background PNG, horizontal 3:2. The eight vignettes are arranged in a clean grid of 4 columns and 2 rows with generous empty space between them; none touch each other; each has a roughly circular composition of the same size.
Top row, left to right: (1) three fanned tarot cards showing only plain ornamented backs with a small star above them; (2) the silhouette of a hooded figure in profile inside a ring of eight small stars; (3) an antique key, a feather and an eye-shaped amulet arranged together; (4) an open journal with a quill and a small inkwell.
Bottom row, left to right: (5) a shallow bowl of water reflecting a crescent moon, with a sprig of lavender; (6) sacred geometry of an interlocking circle, triangle and square with nine small dots; (7) a winding path of small stars leading to a distant glowing arched door; (8) a small symmetric gold flourish tailpiece with a tiny star in its center.
No text, letters, numbers or numerals, no logos or watermarks, no background, no frame around the vignettes.
```

---

## A30 · Pergament der Buchseiten (Bulk B3, V05)

| Feld | Wert |
|---|---|
| Datei / Ziel | `parchment-tile.png` → `public/world/parchment-tile.webp` (512 × 512, ≤ 90 KB) |
| Verwendung | Seitenfläche der Grimoire-Kapitel unter dunkler Tinte (Text in `#2B2238`). Ränder, Schatten und Goldschnitt entstehen per CSS |
| Master | 1024 × 1024 (1:1), keine Transparenz |
| Abnahme | 2 × 2 gekachelt ohne sichtbare Naht (falls nötig mache ich die Kachel selbst nahtlos). Helligkeitsschwankung gering (L* innerhalb von 8 Punkten), damit Tintentext überall ≥ 7:1 erreicht. Keine Flecken, Falten, Brandkanten, Zeichen |

```text
Seamless tileable texture, square 1:1, for the pages of a precious book in a premium app: aged warm ivory parchment paper with very subtle fibers, faint soft mottling and a gentle uneven tone, extremely low contrast, evenly lit from the front. No stains darker than a light tan, no folds, no creases, no torn or burned edges, no vignette, no shadows, no text, no letters, no symbols, no drawings. The texture must tile seamlessly in all directions.
```

---

## A32 · Entdecken-Welt (Bulk B4, V06)

| Feld | Wert |
|---|---|
| Datei / Ziel | `bg-discover.png` → `public/world/bg-discover.webp` (+ `-720`) |
| Verwendung | Entdecken-Hub (Suche, drei Welten), Zahlen, Engelszahlen, Symbol-Lexikon |
| Master / Export / Format | wie A01 |
| Motiv | Mondbeschienener Kreuzgang eines alten Tempels des Wissens, offen zum Himmel: schlanke Steinbögen links und rechts, oben mittig eine schwebende Armillarsphäre aus Messing über einem stillen Spiegelbecken, feine Linien heiliger Geometrie aus Licht in der Luft, Glühwürmchen, violetter Bodennebel |
| Komposition | Armillarsphäre klein zwischen 6 % und 26 % Höhe, weich beleuchtet, nicht heller als Mondlicht. Ab 30 % Höhe die mittleren 80 % der Breite ruhig und dunkel (Suchfeld, Welten-Kacheln, Listen) |
| Freizuhalten | keine Ziffern, Buchstaben oder Tierkreiszeichen, auch nicht als Gravur |
| Abnahme | Listen und Suchfeld bleiben klar lesbar (≥ 4,5:1 mit Panel). Wirkt als eigene Welt neben A03 (Observatorium) und A04 (Bibliothek) |

```text
Luxurious mystical high-fantasy illustration for a premium spiritual oracle app. Painterly digital artwork with the depth of a matte painting: layered atmospheric perspective, soft volumetric light, fine film grain, delicate antique-gold highlights. Palette: deep petrol teal and midnight blue, dark violet, subtle magenta accents, warm antique-gold light sources. Elegant, adult, calm and enchanting, not cartoonish, not neon, no mobile-game look. Absolutely no text, letters, numbers, logos, watermarks or signatures.

Vertical portrait background, 2:3. A moonlit cloister of an ancient temple of knowledge, open to the starry night sky: slender carved stone arches along the left and right edges, faint geometric patterns in the stone, a few fireflies, soft violet mist on the floor. In the upper center, between 6% and 26% of the image height, a small brass armillary sphere floats softly lit above a still reflecting pool, surrounded by faint luminous lines of sacred geometry (circles and triangles) drawn in light in the air; it is never brighter than moonlight. No numerals, letters, zodiac signs or symbols anywhere. From 30% of the height downward, the middle 80% of the width stays calm and dark, because a search field and lists will be placed there. The app crops up to 9% on the left and right edges and fades the bottom 15% into darkness, so keep every important motif within the middle 80% of the width and above 85% of the height.
```

---

## A33 · Symbole des Lexikons (Bulk B4, V06, nach finaler Symbolliste)

| Feld | Wert |
|---|---|
| Dateien / Ziel | `symbols-sheet-1.png`, `symbols-sheet-2.png` → einzeln ausgeschnitten nach `public/symbols/<id>.webp` (256 × 256, Alpha, ≤ 20 KB) |
| Verwendung | Symbol-Lexikon (Liste 48 px, Detailseite 160 px), Kartenseiten, Teilen (J3), entdeckte Symbole im Grimoire |
| Master | je 1536 × 1024 (3:2 quer), transparent, Raster 4 × 3 |
| Liste | Die Liste wird in V06 mit den Bildern von Deck v2 abgeglichen (`docs/product/CONTENT_MASTERPLAN.md` §6). Vorläufig: Sheet 1 Sonne, Mond, Stern, Lotus, Schlüssel, Schmetterling, Phönix, Schlange, Baum, Eule, Krone, Kelch. Sheet 2 Schwert, Stab, Rose, Lilie, Auge, Feder, Rad, Säulen, Waage, Laterne, Lemniskate, Ähre |
| Abnahme | bei 48 px unterscheidbar (klare Silhouette). Gleiche Linienstärke und Lichtrichtung wie A23–A29. Kein Text. **Ersatz:** gelingt die Serie nicht, zeichne ich die Symbole als SVG-Linien im Stil der vorhandenen Icons |

**Prompt (Sheet 1, für Sheet 2 die Liste tauschen):**

```text
Luxurious mystical asset sheet for a premium spiritual oracle app: twelve symbol emblems in the style of gilded engravings from an antique grimoire, fine antique-gold line work with a soft petrol-teal and violet inner glow, the same line weight, scale and lighting for all, each with a clear, simple silhouette that is still recognizable when shown very small. Transparent background PNG, horizontal 3:2. The twelve emblems are arranged in a clean grid of 4 columns and 3 rows with generous empty space between them; none touch each other; each fits inside an invisible circle of the same size.
Row 1: a radiant sun, a crescent moon, an eight-pointed star, a lotus flower.
Row 2: an antique key, a butterfly, a phoenix with spread wings, a coiled serpent.
Row 3: a tree with roots and crown, an owl, a crown, a chalice.
No text, letters, numbers, logos or watermarks, no background, no frames.
```

Sheet 2, Zeilen: `Row 1: an upright sword, a wooden staff with a few leaves, a rose, a white lily. Row 2: a single open eye, a feather, an eight-spoked wheel, two pillars side by side. Row 3: balanced scales, a small lantern with a warm flame, an infinity loop (lemniscate), an ear of wheat.`

---

## A18 · Store-Grafik (Bulk B5, V07, nach Entscheidung E11)

| Feld | Wert |
|---|---|
| Datei / Ziel | `store-feature.png` → Store-Eintrag (nicht in der App) |
| Master / Export | mind. 2048 × 1000 oder 1536 × 750 (≈ 2,05:1 quer) → 1024 × 500 PNG/JPEG |
| Verwendung | Feature-Grafik im Play Store. Name und Emblem setze ich im Code darüber (finaler Name nach E11) |
| Komposition | Panorama der Nachtwelt aus A01. Linke Hälfte ruhig und dunkel (dort stehen Emblem und Name), Burg und Wasserfall rechts. Ränder ohne wichtige Details |
| Abnahme | wirkt auch in kleiner Darstellung (Breite 320 px). Gleiche Welt wie A01. Kein Text im Bild |

```text
Luxurious mystical high-fantasy illustration for a premium spiritual oracle app. Painterly digital artwork with the depth of a matte painting: layered atmospheric perspective, soft volumetric light, fine film grain, delicate antique-gold highlights. Palette: deep petrol teal and midnight blue, dark violet, subtle magenta accents, warm antique-gold light sources. Elegant, adult, calm and enchanting, not cartoonish, not neon, no mobile-game look. Absolutely no text, letters, numbers, logos, watermarks or signatures.

Wide horizontal panorama, about 2:1. The same enchanted night landscape as the attached reference, seen from a high terrace: on the right a slender fairy-tale castle with a few warmly glowing windows on a cliff and a thin silver waterfall falling into mist, rolling violet hills and a calm valley with soft fog, a deep starry sky with a faint teal-violet milky way and a thin crescent moon. Dark silhouettes of lavender and white lilies along the lower edge. The left half of the image is calm, darker open sky and soft hills without important objects, because a logo will be placed there. Keep all important details at least 8% away from every edge.
```

---

## A34 · Mondwelt (Bulk B6, Release 1.1)

| Feld | Wert |
|---|---|
| Datei / Ziel | `bg-moon.png` → `public/world/bg-moon.webp` (+ `-720`) |
| Verwendung | Mond-Bereich (aktuelle Phase, Mondkalender, Neumond-Intention, Vollmond-Reflexion) |
| Master / Export / Format | wie A01 |
| Motiv | stiller See bei Nacht, darin ein runder Steinbogen (Mondtor), dessen Öffnung leeren Sternenhimmel rahmt. Schilf und weiße Nachtblüten an den unteren Rändern, silberner Nebel |
| Komposition | **Kein Mond im Bild.** Die App zeichnet die aktuelle Phase in die Öffnung des Tores. Öffnung horizontal mittig, Mittelpunkt bei 30–40 % Höhe, Durchmesser ≈ 45 % der Bildbreite. Ab 62 % Höhe ruhig und dunkel (Kalender, Texte) |
| Abnahme | kein Mond, kein heller Fleck in der Öffnung. Mittelpunkt der Öffnung auf ±3 % bestimmbar (ich kalibriere die Position im Code). Mondphase als SVG darin wirkt natürlich |

```text
Luxurious mystical high-fantasy illustration for a premium spiritual oracle app. Painterly digital artwork with the depth of a matte painting: layered atmospheric perspective, soft volumetric light, fine film grain, delicate antique-gold highlights. Palette: deep petrol teal and midnight blue, dark violet, subtle magenta accents, warm antique-gold light sources. Elegant, adult, calm and enchanting, not cartoonish, not neon, no mobile-game look. Absolutely no text, letters, numbers, logos, watermarks or signatures.

Vertical portrait background, 2:3. A vast still lake at night seen from the shore, the calm water mirroring the stars. In the middle distance a large circular stone moon gate (a perfectly round arch of old carved stone) stands in the shallow water; its round opening is horizontally centered, its center at about 35% of the image height, its diameter about 45% of the image width, and it frames only empty dark starry sky. Tall reeds and a few white night-blooming flowers along the lower left and lower right edges, soft silver mist on the water. Important: there is no moon anywhere in the image and no bright spot inside the opening, because the current moon phase will be drawn there later. From 62% of the height downward the image stays calm and dark. The app crops up to 9% on the left and right edges and fades the bottom 15% into darkness, so keep every important motif within the middle 80% of the width and above 85% of the height.
```

---

## 5 · Was ich selbst im Code erstelle (keine Bilddateien)

| Element | Technik | Paket |
|---|---|---|
| Logo-Emblem (Mondphasen + Stern) und Wortmarke ARCANA | SVG + Cormorant Garamond | vorhanden |
| Ornamente (Kopfornamente, Eckschnörkel, Überschriften-Flanken, Trenner) | SVG-Komponenten | vorhanden |
| Ornament-Panels, Buttons, Chips, Tabs, Navigation | CSS + SVG-Ecken | vorhanden, V03 überall |
| Kartenaura, Lichtstrahlen, Glühen, Bühnenlicht | CSS-Verläufe, `box-shadow`, Masken | vorhanden |
| Sterne, Funken, Partikel | CSS (wenige Elemente, zeitlich begrenzt) | vorhanden |
| Sternenpfad auf „Heute“ | SVG | V02 |
| Sternbilder der Sternkarte (ein Sternbild je Runde), Meilenstein-Sterne | SVG auf A19 | V04 |
| Meilenstein-Moment (Lichtaufgang) | CSS-Verläufe, reduziert: Überblenden | V04 |
| Stufen-Symbol der Kartenvertiefung (Mondphase neu → voll) | SVG | V05 |
| Buchseiten: Ränder, Goldschnitt, Seitenschatten, Lesebändchen | CSS auf A30 | V05 |
| Ex Libris (Rahmen, Siegel) | SVG | V05 |
| Zahlen-Medaillon (große Ziffer im Ornamentring) | SVG + Cormorant Garamond | V06 |
| Engelszahl-Darstellung, Ziffernmuster | Typografie + SVG | V06 |
| Tab-Icons „Entdecken“ (Kompass-Stern) und „Ich“ (Medaillon) | SVG im Stil der vorhandenen Icons | V04 / V06 |
| Teilen-Vorlagen (Story und Feed) | Canvas mit eingebetteten Schriften, nutzt vorhandene Bilder | V07 |
| Edition-Siegel | SVG | V07 |
| Mondphasen, Mondkalender | SVG (berechnet) | 1.1 |
| Themen-Icons (Herz, Aktentasche, Kompass, Waage, Lotus, Feder) | SVG im Stil der vorhandenen Icons | vorhanden |
| Farbabdunklung und Vignette über Hintergründen | CSS-Verläufe pro Screen | vorhanden |
| Desktop-Erweiterung des Hintergrunds | gleiches Bild, unscharf und abgedunkelt | vorhanden |
| Soundeffekte (optional) | Web-Audio-Synthese (Glocke, Papier), keine Dateien | nicht geplant vor 1.0 |

## 6 · Wiederverwendung vorhandener Assets

| Vorhanden | Weiter genutzt für |
|---|---|
| Deck v2 (22 Karten + Rückseite) | alle Karten, Teilen (J1). Glanz kommt per CSS |
| Kartenrückseite v2 | Standard-Rückseite, Referenz für A20–A22 und A31, Logo-Motiv (Mondphasen) |
| A01 Nachtwelt | Heute, neutraler Hintergrund in V03 für Screens ohne eigene Welt, Referenz für alle Bulks, Basis für A18 |
| A02 Pflanzenecken | Tiefe auf allen Welten |
| Archetyp-Porträts (B2) | Enthüllung, „Ich“, Grimoire-Kapitel „Archetypen“, Teilen (J2) |
| Rahmenvorlage und Schutzzonen (`docs/assets/`) | künftige Ersatzkarten (A17) und Zusatzdecks (B7) |
| Papierkorn `grain.webp` | als Overlay auf Panels |
| App-Icon (Vektor) | bleibt bis G4 |
