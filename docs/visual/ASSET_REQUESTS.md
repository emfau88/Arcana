# ASSET_REQUESTS · Externe Bild-Assets für das Visual Overhaul

Dieses Manifest legt fest, welche Bilder extern (z. B. mit ChatGPT) erzeugt werden. Alles andere entsteht im Code (Liste in Abschnitt 5). Jeder Prompt ist einzeln kopierbar und setzt kein Wissen über dieses Projekt voraus.

**Lieferung:** Dateien mit exakt dem genannten Namen, möglichst in Originalauflösung (PNG), in einen Ordner deiner Wahl legen und mir den Pfad nennen. Den Export in WebP, die Größen und die Prüfung übernehme ich. Die Originale bitte außerhalb des Repos aufbewahren.

**Hinweis zur Auflösung:** ChatGPT liefert Hochformate meist als 1024 × 1536 (2:3). Das genügt als Master. Ist eine höhere Auflösung verfügbar, bitte die höchste nehmen.

## 0 · Übersicht und Reihenfolge

| ID | Datei | Priorität | Wofür | Erzeugung |
|---|---|---|---|---|
| **A01** | `bg-today.png` | **P0** | Hintergrundwelt Tagesorakel | einzeln |
| A02 | `fg-today-foliage.png` | P0 optional | Vordergrund-Ranken für Tiefe (Tagesorakel) | einzeln, transparent |
| A03 | `bg-oracle.png` | P1 | Hintergrund Orakel/Readings | einzeln |
| A04 | `bg-grimoire.png` | P1 | Hintergrund Grimoire/Sammlung | einzeln |
| A05 | `bg-profile.png` | P1 | Hintergrund Profil und Archetyp-Enthüllung | einzeln |
| A06 | `bg-welcome.png` | P1 | Willkommen und Onboarding | einzeln |
| A07–A14 | `archetype-<id>.png` (8×) | P1 | Archetyp-Porträts | einzeln, gleicher Stilblock |
| A15 | `grimoire-book.png` | P1 | Buch-Objekt im Grimoire-Kopf | einzeln, transparent |
| A16 | `props-sheet.png` | P2 | Dekor-Objekte (Kristall, Astrolabium, Laterne, Phiole, Schlüssel, Federkiel) | Asset-Sheet, transparent |
| A17 | `card-<id>.png` (ausgewählte) | P2 | figurative Ersatzkarten nach Test im neuen UI | einzeln, nach Entscheidung E3 |
| A18 | `store-feature.png` | P2 | Store-Grafik 1024 × 500 | einzeln, erst in G4 |

**Status 26.11.2026:** A01 und A02 sind geliefert und in V02 eingebaut (D-33). V02 braucht keine weiteren Assets. Das nächste Paket steht in Abschnitt 0.1 und wird erst nach deiner Freigabe des Tagesorakel-Screens angefragt.

## 0.1 · V03-Paket (konkrete Anforderung nach V02)

| Reihenfolge | ID | Datei | Wofür in V03 |
|---|---|---|---|
| 1 | A03 | `bg-oracle.png` | Orakel: drei Karten auf einem Tisch im Observatorium. Zweitwichtigster Screen |
| 2 | A06 | `bg-welcome.png` | Willkommen und Fragen: erster Eindruck, später Store-Screenshots |
| 3 | A04 | `bg-grimoire.png` | Grimoire: Sammlung als Schatzkammer |
| 4 | A15 | `grimoire-book.png` | Buch-Objekt im Grimoire-Kopf (transparent) |
| 5 | A05 | `bg-profile.png` | Profil und Archetyp-Enthüllung (Porträts A07–A14 folgen erst in V05) |

Nicht in V03: A07–A14 (V05), A16 (P2), A17 (Entscheidung E3: Deck v2 trägt die Bühne bei hellen und dunklen Karten, Empfehlung: erst nach V03 entscheiden), A18 (G4). Die Pflanzenecken aus A02 werden auf den anderen Screens wiederverwendet, ein neues Vordergrund-Asset ist nicht nötig.

**Erkenntnisse aus A01, gelten für A03–A06** (in die Prompts unten eingearbeitet):

- Die App verankert Hintergründe oben und skaliert sie auf mindestens 118 % der Bildschirmbreite. Auf schmalen Handys fallen links und rechts je bis zu 9 % weg. Wichtige Motive gehören in die mittleren 80 % der Breite.
- Die unteren etwa 15 % blenden in die Nacht über (Tab-Leiste, Pflanzenecken). Dort nichts Wichtiges.
- Dunkle, ruhige Zonen hinter Text funktionieren: Auf A01 sind alle Texte gemessen bei mindestens 5,9:1 Kontrast. Helle Lichtquellen (Mond, Fenster, Lichtkegel) gehören nicht hinter Überschriften.
- 1024 × 1536 PNG genügt als Master. Die Codex-Lieferung von A01/A02 hatte genau das richtige Format.


## Gemeinsamer Stilblock (in jedem Prompt bereits enthalten)

> Luxurious mystical high-fantasy illustration for a premium spiritual oracle app. Painterly digital artwork with the depth of a matte painting: layered atmospheric perspective, soft volumetric light, fine film grain, delicate antique-gold highlights. Palette: deep petrol teal and midnight blue, dark violet, subtle magenta accents, warm antique-gold light sources. Elegant, adult, calm and enchanting, not cartoonish, not neon, no mobile-game look. Absolutely no text, letters, numbers, logos, watermarks or signatures.

---

## A01 · Hintergrundwelt Tagesorakel (P0)

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

## A02 · Vordergrund-Ranken Tagesorakel (P0 optional)

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

## A03 · Hintergrund Orakel/Readings (P1)

| Feld | Wert |
|---|---|
| Datei / Ziel | `bg-oracle.png` → `public/world/bg-oracle.webp` (+ `-720`) |
| Verwendung | Orakel-Start, Legung, Deutung |
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

## A04 · Hintergrund Grimoire/Sammlung (P1)

| Feld | Wert |
|---|---|
| Datei / Ziel | `bg-grimoire.png` → `public/world/bg-grimoire.webp` (+ `-720`) |
| Verwendung | Sammlung, Verlauf, Detailansichten |
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

## A05 · Hintergrund Profil/Archetypen (P1)

| Feld | Wert |
|---|---|
| Datei / Ziel | `bg-profile.png` → `public/world/bg-profile.webp` (+ `-720`) |
| Verwendung | Profil, Archetyp-Enthüllung |
| Master / Export / Format | wie A01 |
| Motiv | Sternenkuppel eines Planetariums mit goldenen Konstellationslinien, Bodenspiegelung, ein Lichtkegel von oben in die Mitte (dort steht später das Archetyp-Porträt) |
| Freizuhalten | Mitte 20–80 % Breite, 12–60 % Höhe als Lichtkegel ohne Objekte, unten 60–100 % dunkel |
| Abnahme | Enthüllungsmoment wirkt wie ein Bühnenauftritt |

```text
Luxurious mystical high-fantasy illustration for a premium spiritual oracle app. Painterly digital artwork with the depth of a matte painting: layered atmospheric perspective, soft volumetric light, fine film grain, delicate antique-gold highlights. Palette: deep petrol teal and midnight blue, dark violet, subtle magenta accents, warm antique-gold light sources. Elegant, adult, calm and enchanting, not cartoonish, not neon, no mobile-game look. Absolutely no text, letters, numbers, logos, watermarks or signatures.

Vertical portrait background, 2:3. Inside a vast celestial dome at night: the curved ceiling is a deep teal and violet star map with fine glowing gold constellation lines and small engraved planetary rings, a polished dark marble floor reflects the stars. A soft column of warm golden light falls from the top center onto an empty circular dais in the middle of the floor. The central area (from 20% to 80% of the width and from 12% to 60% of the height) contains only the soft light column and no objects, because a portrait will be placed there. The bottom 40% fades into deep shadow. The app crops up to 9% on the left and right edges and fades the bottom 15% into darkness, so keep every important motif within the middle 80% of the width and above 85% of the height.
```

---

## A06 · Hintergrund Willkommen (P1)

| Feld | Wert |
|---|---|
| Datei / Ziel | `bg-welcome.png` → `public/world/bg-welcome.webp` (+ `-720`) |
| Verwendung | Willkommen, Fragen, Themenwahl. Erster Eindruck und Store-Screenshots |
| Master / Export / Format | wie A01 |
| Motiv | Ein großes, offenes, leuchtendes Grimoire auf einem Steinsockel unter einem Sternenportal, Seiten mit Mond- und Sternkarten (ohne Schrift), goldene Lichtfäden steigen auf |
| Freizuhalten | obere Hälfte für Logo und Titel ruhig, unteres Drittel dunkel für Buttons |
| Abnahme | starker erster Eindruck, ohne Text lesbar |

```text
Luxurious mystical high-fantasy illustration for a premium spiritual oracle app. Painterly digital artwork with the depth of a matte painting: layered atmospheric perspective, soft volumetric light, fine film grain, delicate antique-gold highlights. Palette: deep petrol teal and midnight blue, dark violet, subtle magenta accents, warm antique-gold light sources. Elegant, adult, calm and enchanting, not cartoonish, not neon, no mobile-game look. Absolutely no text, letters, numbers, logos, watermarks or signatures.

Vertical portrait background, 2:3. A large ancient open grimoire rests on a carved stone pedestal at about 55 to 70% of the image height, its parchment pages show only drawn moon phases, star charts and a sun diagram without any writing. Thin threads of golden light and tiny sparks rise from the pages into a night sky framed by a tall arched portal of dark stone covered in starlight. Lavender and crystals at the far lower edges. The upper half of the image is calm open night sky with soft stars, because a logo and a title will be placed there. The bottom 25% fades into deep shadow. Keep important details within the middle 70% of the width. The app crops up to 9% on the left and right edges and fades the bottom 15% into darkness, so keep every important motif within the middle 80% of the width and above 85% of the height.
```

---

## A07–A14 · Archetyp-Porträts (P1, 8 einzelne Bilder)

| Feld | Wert |
|---|---|
| Dateien | `archetype-seeker.png`, `archetype-guardian.png`, `archetype-visionary.png`, `archetype-alchemist.png`, `archetype-wanderer.png`, `archetype-creator.png`, `archetype-sage.png`, `archetype-renewer.png` |
| Ziel | `public/archetypes/` (720 × 1080 und Thumbnail 240 × 360, WebP, ≤ 180 KB / 30 KB) |
| Verwendung | Archetyp-Enthüllung (groß), Profil, Archetypen-Kacheln in der Sammlung |
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

## A15 · Grimoire-Buch (P1)

| Feld | Wert |
|---|---|
| Datei / Ziel | `grimoire-book.png` → `public/world/grimoire-book.webp` (Alpha) |
| Verwendung | Kopf des Grimoire-Screens, darüber der Sammlungsfortschritt |
| Master / Export | 1536 × 1024 (3:2 quer) → 900 × 600 WebP mit Alpha, ≤ 140 KB |
| Transparenz | ja |
| Motiv | Geschlossenes, kostbares Grimoire, dunkelvioletter Ledereinband mit goldenen Beschlägen, Mondphasen und Stern auf dem Deckel, Lesebändchen, leicht schräge Aufsicht |
| Abnahme | saubere Alphakanten, ohne Schrift auf dem Einband |

```text
Luxurious mystical high-fantasy object illustration for a premium spiritual oracle app, painterly digital artwork with soft volumetric light, fine grain and delicate antique-gold highlights. Transparent background PNG, horizontal 3:2. A single closed precious grimoire seen slightly from above at a gentle angle: deep violet leather cover with ornate antique-gold corner fittings, an embossed gold design of a row of moon phases above a radiant eight-pointed star, a violet silk ribbon bookmark, gilded page edges, a soft warm glow around the book. No text, letters, numbers, logos or watermarks on the cover or anywhere. Nothing else in the image, clean edges, no table, no shadow plane.
```

---

## A16 · Dekor-Objekte als Sheet (P2)

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

## A17 · Figurative Ersatzkarten (P2, nach Entscheidung)

Erst wenn Deck v2 im neuen UI geprüft ist (V02/V03). Regeln aus `docs/CODEX_ASSET_PROMPT.md` gelten weiter: 2:3, Master ≥ 1024 × 1536, kein Rahmen, kein Text, Schutzzonen. **Figuren sind jetzt erlaubt.** Kandidaten mit dem größten Gewinn durch Figuren: III Herrscherin, VI Liebende, II Hohepriesterin, XVII Stern, IX Eremit, I Magier. Die Prompts formuliere ich pro Karte, wenn du die Auswahl bestätigst.

## A18 · Store-Grafik (P2, G4)

Erst mit finalem Namen und Logo.

---

## 5 · Was ich selbst im Code erstelle (keine Bilddateien)

| Element | Technik |
|---|---|
| Logo-Emblem (Mondphasen + Stern) und Wortmarke ARCANA | SVG + Cormorant Garamond |
| Ornamente (Kopfornamente, Eckschnörkel, Überschriften-Flanken, Trenner) | SVG-Komponenten |
| Ornament-Panels, Buttons, Chips, Tabs, Navigation | CSS + SVG-Ecken |
| Kartenaura, Lichtstrahlen, Glühen, Bühnenlicht | CSS-Verläufe, `box-shadow`, Masken |
| Sterne, Funken, Partikel | CSS (wenige Elemente, zeitlich begrenzt) |
| Sternenpfad (Fortschritt), Astrolabium-Bogen | SVG |
| Themen-Icons (Herz, Aktentasche, Kompass, Waage, Lotus, Feder) | SVG im Stil der vorhandenen Icons |
| Farbabdunklung und Vignette über Hintergründen | CSS-Verläufe pro Screen |
| Desktop-Erweiterung des Hintergrunds | gleiches Bild, unscharf und abgedunkelt |
| Soundeffekte (P2, optional) | Web-Audio-Synthese (Glocke, Papier), keine Dateien |

## 6 · Wiederverwendung vorhandener Assets

| Vorhanden | Weiter genutzt für |
|---|---|
| Deck v2 (22 Karten + Rückseite) | alle Karten. Glanz kommt per CSS |
| Kartenrückseite v2 | verdeckte Karten, Logo-Motiv (Mondphasen) |
| Rahmenvorlage und Schutzzonen (`docs/assets/`) | künftige Ersatzkarten (A17) |
| Papierkorn `grain.webp` | als Overlay auf Panels |
| App-Icon (Vektor) | bleibt bis G4 |
