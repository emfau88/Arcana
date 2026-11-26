# ARCANA · Kartenprompts

Die 22 Vorderseiten und die Rückseite entstanden am 26.11.2026 mit dem integrierten OpenAI-Bildgenerator ImageGen. Die vier freigegebenen Stilproben waren II, XIII, XIX und die Rückseite. Jeder Block enthält die vollständige Eingabe für den ausgewählten PNG-Master. Das Werkzeug stellte keine konkrete Modellversion und keinen Seed bereit. Eine Neugenerierung kann vom ausgewählten Master abweichen. Die SHA-256-Prüfsummen identifizieren die Originale.

## WebP-Export

Das Masterarchiv außerhalb des Repos enthält 23 PNG-Dateien mit jeweils 1024 × 1536 px. Die Dateien in einen externen Ordner entpacken und den folgenden Befehl im Projektroot ausführen. Er verwendet Node.js, die mit `npm ci` installierte Projektschrift und Python mit Pillow (hier 11.3.0).

```sh
python scripts/assets/export-cards.py MASTER_DIR
```

Für eine einzelne Karte die `assetId` anhängen, etwa `card-moon`. Der vollständige Lauf erzeugt auch das beschriftete Raster `docs/assets/deck-overview-v2.webp`.

Das Skript verkleinert die Malerei mit Lanczos. Bei II, V, X, XIV, XVII, XVIII und XX richtet es das Motiv innerhalb der Schutzzonen aus. Anschließend legt es bei allen Vorderseiten die RGBA-Rahmenvorlage darüber und kodiert beide Größen als WebP mit Qualität 85. Für die Rückseite zentriert es die Kompassnabe, dreht die obere Bildhälfte um 180° und ergänzt zwei Goldlinien bei 19 und 32 px. Beide Rückseitengrößen verwenden eine reduzierte Farbpalette und verlustfreies WebP für eine pixelgenaue Drehsymmetrie.

## card-fool

SHA-256 des Masters `48c7e18a1e9ccc68a7ebd68f5fd9ee21fe78d18deeefc4df633a58c3b1614e9e`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Light family. Soft overhead light through warm morning haze, honey gold and pale peach with sage or rose accents, muted purplish depths. Shape the light in broad translucent washes, preserve a clear darker silhouette in the middle register.

A traveler has set down a slender wooden walking staff and a distinct tied travel bundle against a rock on a narrow cliff edge. Center this still life at mid-height. A single clear white rose grows beside the rocky lip; beyond it a lavender mountain valley fills with layered mist. A pale sun rises in a peach-and-gold sky with precisely two tiny distant birds. The path invites an open beginning. Keep the cloth bundle visually distinct from the wood and the cliff.
```

## card-magician

SHA-256 des Masters `ef3f14a1c8db3536962740fec8ec1657d99b01053aeebb080bc62ae67f3d1bfd`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Light family. Soft overhead light through warm morning haze, honey gold and pale peach with sage or rose accents, muted purplish depths. Shape the light in broad translucent washes, preserve a clear darker silhouette in the middle register.

A red-draped altar table seen in three-quarter view under soft amber light. Arrange four physical tools distinctly across its top: a shallow brass goblet, a round coin stamped only with a simple star, a short sheathed or resting sword, and a slim wooden wand. In the center a slender wand of light rises to a delicate single floating horizontal golden infinity loop. A modest garland of red roses and white lilies crosses the near edge of the rich red drapery. Quiet workshop mastery, direct and luminous, no voluminous flame, no person.
```

## card-high-priestess

SHA-256 des Masters `9507e67c6954258681a925b7a7669003e98a4172b90b6da9b07aa3401c62c5d0`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat, edge-to-edge illustration for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges, very fine tarnished-gold highlights catching the light. Restrict fine detail to the focal subject. Compose for a tiny printed card as well as a large master. Work in a portrait 2:3 master, ideally 1440 by 2160. The central 85% of the width and the vertical band from 14% to 82% contain all important symbols. Leave the top 12% and bottom 15% as quiet, continuing scenery. No imitation lettering, glyphs, numbers, signature, watermark, ornamental corners, UI shapes, figures, faces, animals or religious symbols. Original composition.

Two free-standing pillars on a low terrace at the edge of still water: one of veined obsidian, the other of pale honed limestone. Each is capped with a small upward crescent, silhouetted clearly against an indigo-violet twilight. Between the pillars hangs a soft, deep aubergine veil with a few individually embroidered pomegranates on a winding branch, stitched in faded garnet and brass. Its shallow drape dips in front of the bottom edge of a large luminous pearl moon centered about a third of the way down. Show the color change where moonlight catches a fold. In front, a single, half-rolled, entirely blank ivory scroll rests horizontally on the terrace, with a quiet reflection below. Indigo, mist violet, silver and aged brass. Mood of held breath and attentive silence. Elegant, spare architecture with no arch or roof.
```

## card-empress

SHA-256 des Masters `5804fd9314a7ecf321d5ffbf95dcbe00d472d1f91c12add258d6e80f8370ce1b`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Light family. Soft overhead light through warm morning haze, honey gold and pale peach with sage or rose accents, muted purplish depths. Shape the light in broad translucent washes, preserve a clear darker silhouette in the middle register.

A ripe golden wheat field in warm summer morning light. A substantial heart-shaped golden shield leans into the wheat in the foreground, its chased surface bearing a discreet botanical relief only. In the space just above the shield hangs a small oval circlet made of exactly twelve separate tiny golden stars; arrange them evenly like the hours on an unnumbered clock. Soft green hills with a few cypress trees and a small white waterfall in the distance. Let individual wheat stalks cross the shield near its foot. No crown, person or glyphs.
```

## card-emperor

SHA-256 des Masters `cfe72e66f8a55fe14db78ec7a139fdad7038a9489a6624ddb06a782e031fb5b1`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Twilight family. Indigo and mist violet with cool silver light falling gently from above, dark aubergine and blue-black depth, sparing warm antique brass. Calm, tactile surfaces. In open landscapes the distant horizon sits around the middle to lower middle of the scene.

A monumental, empty basalt throne on broad low steps, seen slightly from below against severe red-orange mountain ridges at dusk. The two armrest ends are carved as compact ram heads with curling horns, recognizably stone sculptures. A small burnished golden orb and slender gold scepter lie together on the seat, visible in the raking light. Strong rectilinear silhouette, weight, structure and responsibility; the stone back is plain with a touch of natural veining. No human figure or carved human face, no living animals.
```

## card-hierophant

SHA-256 des Masters `e020b281c2fd4caee4a432871fb464ba2fbdb9a7082b95262ee7b81062520f01`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Twilight family. Indigo and mist violet with cool silver light falling gently from above, dark aubergine and blue-black depth, sparing warm antique brass. Calm, tactile surfaces. In open landscapes the distant horizon sits around the middle to lower middle of the scene.

A quiet high-vaulted hall, soft light through a tall round arch and two gray columns. A freestanding golden staff is the central silhouette. Around the upper part of its shaft are three distinct horizontal elliptical brass hoops, open in the middle and seen obliquely as three stacked circular rings. No bars sticking sideways, no cross-shaped finial, no staff shaped like a religious cross. On a checkered stone floor in the foreground rest two large, crisply silhouetted antique keys crossed diagonally. Intimate civic archive atmosphere, silence, handed-down wisdom.
```

## card-lovers

SHA-256 des Masters `f3b10222e63d027a15c89366737be8c58e8904022c2ee17f054501515875dabf`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Light family. Soft overhead light through warm morning haze, honey gold and pale peach with sage or rose accents, muted purplish depths. Shape the light in broad translucent washes, preserve a clear darker silhouette in the middle register.

Two unmistakably different trees rise from a single rolling green hill. One has fiery orange flame-shaped leaves (painted leaves, no actual fire), the other bears red apples among sage leaves. Their crowns incline toward each other, creating an opening onto one mountain peak in the center. In a clearing of soft clouds above this peak, a warm, softly luminous golden sun has a delicate pair of gold wings. Wide harmonious silhouettes, no human bodies, no figures in the clouds, no birds or animals.
```

## card-chariot

SHA-256 des Masters `0962fa3e38c07d875808a688637b72e785c5534d1c866417b1c986b01f9ba981`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Twilight family. Indigo and mist violet with cool silver light falling gently from above, dark aubergine and blue-black depth, sparing warm antique brass. Calm, tactile surfaces. In open landscapes the distant horizon sits around the middle to lower middle of the scene.

One empty, dignified ceremonial chariot, seen in three-quarter view, before a distant moonlit walled city. A suspended midnight-blue canopy above its carriage has embroidered gold stars; a single winged brass emblem is affixed to the front. Make the wheels and their rims distinct and the canopy high enough to reveal the empty seat. One dark polished stone sphere and one ivory sphere rest separately on the ground by the wheels. Deep indigo sky, lower violet horizon. No horses or other animals, no driver, no person.
```

## card-strength

SHA-256 des Masters `119578fdbf90dd3292b9b86188a7b0ced3a6e6fa5ea74f0ae4d00730c667bc6d`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Light family. Soft overhead light through warm morning haze, honey gold and pale peach with sage or rose accents, muted purplish depths. Shape the light in broad translucent washes, preserve a clear darker silhouette in the middle register.

A calm adult lion resting in side view, forepaws folded, warm tawny mane, eyes relaxed. Beside its paws, one upright flower grows from a clear crack in a low stone, embraced by a suspended circular garland of loose blossoms. A delicate horizontal golden infinity loop floats in the space above it. Keep the lion gentle, quietly alert, with generous quiet meadow and peach dawn visible beyond. The lion and the flower share the same plane of light. No roaring, no other animal or person.
```

## card-hermit

SHA-256 des Masters `a8b28f9af116e722e4268ec8e5806406e5333f747e574b2b8381798417a73093`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Shadow family. Inky midnight blues and restrained deep wine, large areas of genuine near-black, one small source of soft warm gold. Paint the darks in broad translucent layers and reserve the brightest reflective touch for the focal object. Thoughtful and tranquil.

On a high snowy mountain peak at night a tall slightly irregular walking staff holds one brass lantern hanging from its curved top. The lantern is large enough to read as the central object; its slightly frosted glass encloses a soft star-shaped point of amber light. Place the lantern in the middle register so it is backed by a dark unbroken sky. A very thin silver crescent is distant and off to one side. A few quiet snow ridges take the faint warm reflection. Midnight blue-black and Prussian blue, solitude and inward stillness. No footprints, people or animals.
```

## card-wheel

SHA-256 des Masters `9979d2bc74569152e625959bb51b88a9524e5f557733d1286946e7b78d3d4524`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Twilight family. Indigo and mist violet with cool silver light falling gently from above, dark aubergine and blue-black depth, sparing warm antique brass. Calm, tactile surfaces. In open landscapes the distant horizon sits around the middle to lower middle of the scene.

A single large ornamented golden wheel floats in a layered violet sky. Its rim is hand-chased brass and its hub solid, connected by exactly eight clearly separated spokes, like compass directions at equal 45-degree intervals, with clean dark negative space between them. Around the rim, celestial decoration made exclusively of tiny suns, crescents, stars and dots, absolutely no writing, zodiac glyphs or numbers. Four small, soft low-contrast clouds drift around the wheel in the outer quadrants, all comfortably inside the painted scene. Keep a little depth and patina in the metal.
```

## card-justice

SHA-256 des Masters `78bee11e9caf3026eabf7aa11b008413e81d14a4e1dcb1f88bb39d155ecbbb48`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Twilight family. Indigo and mist violet with cool silver light falling gently from above, dark aubergine and blue-black depth, sparing warm antique brass. Calm, tactile surfaces. In open landscapes the distant horizon sits around the middle to lower middle of the scene.

An unadorned upright sword with a slender brass hilt is the central axis of a perfectly balanced golden weighing scale, both pans suspended at the same height on physically credible fine cords. An empty niche framed by two gray-violet stone columns holds the objects; a rich deep crimson curtain hangs behind. Between the pans and the curtain leave ample tonal separation. A few shallow stone steps below ground the composition. Silver blade, brass pans, quiet frontal view and clear geometry. No figure, heraldry, religious symbols or engraved lettering.
```

## card-hanged-man

SHA-256 des Masters `8f22167e38b91d796b2674d26c3d6d4e1de249349ed03449569174c64ab9413a`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Twilight family. Indigo and mist violet with cool silver light falling gently from above, dark aubergine and blue-black depth, sparing warm antique brass. Calm, tactile surfaces. In open landscapes the distant horizon sits around the middle to lower middle of the scene.

A living tree growing on the wooded shore of a calm lake at dusk. Its trunk forks at the top into two widely spreading gently curved limbs, giving a loose T-shaped silhouette with many fresh leafy twigs and visible natural taper. Branches weave asymmetrically into airy leaf clusters. A soft circular halo glows in the sky behind the fork, reflected faintly in the still water. A lyrical pause and change of perspective. This is unequivocally a naturally grown tree, no sawn wood, beam, post, rope, noose, person or gallows.
```

## card-death

SHA-256 des Masters `c7554dcee5734d463927598883744cc8633428efba350f3c64620aa5549ece33`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat, edge-to-edge illustration for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges, very fine tarnished-gold highlights catching the light. Restrict fine detail to the focal subject. Compose for a tiny printed card as well as a large master. Work in a portrait 2:3 master, ideally 1440 by 2160. The central 85% of the width and the vertical band from 14% to 82% contain all important symbols. Leave the top 12% and bottom 15% as quiet, continuing scenery. No imitation lettering, glyphs, numbers, signature, watermark, ornamental corners, UI shapes, figures, faces, animals or religious symbols. Original composition.

Predawn in a very dark ink-blue valley; the sky is still the almost black color of fountain pen ink. In the middle distance a graceful narrow S-shaped river traces a single line of muted amber light toward a small rising sun between two dark, simple, widely separated towers. The sun breaks through a very narrow band of warmth at the low horizon. Two-thirds of the picture should be deep blue-black and near-black wine shadow, with great quiet shapes and a sparse scattering of soft violet mist across the water. In the near foreground, a single white rose in full bloom on a short leafy branch is seen in three-quarter view. The whole luminous, ivory-white flower head is safely inside the card about 40% across and 64% down, approximately one quarter of the picture width. Its softly sculpted, pale petals and dark leaves are the one immediately identifiable foreground silhouette. Its delicate, angled stem is caught by a fine line of reflected gold. Make the shaded riverbank feel alive and peaceful. A very carefully restrained palette of Payne’s grey, deep indigo, ivory and antique brass, painterly gouache texture. A moment of letting go, hopeful, still, never ominous. No pink or orange sky, cemetery, ruin, tombstone, skull or bones.
```

## card-temperance

SHA-256 des Masters `25d8d5ced67b2e44bf8eb0cd06771049e2a9eed8c0d73eb3886dc558b644f9da`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Light family. Soft overhead light through warm morning haze, honey gold and pale peach with sage or rose accents, muted purplish depths. Shape the light in broad translucent washes, preserve a clear darker silhouette in the middle register.

Two antique golden cups, one tilted gently above the other, connected by a single graceful and continuous descending arc of clear water. The lower cup rests on a flat pale stone at the edge of a small pond; show the upper cup suspended in the open air, no hand. A group of irises grows beside the water. A fine footpath leads behind them through soft green meadows to distant blue mountains and a peach sunrise. Keep the two open cup rims and the water arc clearly legible at thumbnail size, like a still moment in a painting.
```

## card-devil

SHA-256 des Masters `8c0181294f0c082a21cb048d26c61518dc30c50ccdd22842c6e92c60441aea50`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Shadow family. Inky midnight blues and restrained deep wine, large areas of genuine near-black, one small source of soft warm gold. Paint the darks in broad translucent layers and reserve the brightest reflective touch for the focal object. Thoughtful and tranquil.

A quiet still life about the freedom to recognize attachments. In the center foreground, in sharp focus and bright enough to read at a tiny size, two substantial slack iron chains each terminate in a wide-open ancient bronze cuff. The two open cuffs are the main silhouettes, about a quarter card width each, presented at a natural three-quarter viewing angle around mid-height, resting on the ground, beautifully patinated, their open mouths unmistakable even in miniature. Broad silver-bronze glints along thick metal arcs contrast clearly against the dark matte floor. A small restrained dark stone pedestal recedes behind them in the middle distance, substantially less conspicuous than the chains. Wisps of warm air, restrained black-cherry and charcoal shadows; one little thin golden crescent above the pedestal about a quarter of the way down. Single low amber light reflected from outside the scene. The bottom sixth is just shaded ground extending forward. Two open chains only; no extra shackles or objects, confined body, demon, horns, pentagram, fire pit, person, torture imagery or threatening atmosphere. Painted surface, tender and reflective.
```

## card-tower

SHA-256 des Masters `e65e08e27725170085f439d5e39ab8ab41b4d390e208b427e963308e938e794f`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Shadow family. Inky midnight blues and restrained deep wine, large areas of genuine near-black, one small source of soft warm gold. Paint the darks in broad translucent layers and reserve the brightest reflective touch for the focal object. Thoughtful and tranquil.

One tall intact stone tower on a quiet ridge under a blue-black night sky. A single fine branching stroke of golden lightning touches the tower top on the diagonal. Its small crown-shaped gold cap lifts just clear of the masonry, with a visible gap. Two warm-lit windows and a handful of small drifting sparks echo the light. The tower body is calm and upright. Concentrate the light on this sudden moment of clarity. No explosion, falling stones, structural collapse, people, bodies, conflagration or storm spectacle.
```

## card-star

SHA-256 des Masters `644c3ed068b0bb5d69b8f01267713fce65e929980bc8ab300f52e8d695ee2018`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Twilight family. Indigo and mist violet with cool silver light falling gently from above, dark aubergine and blue-black depth, sparing warm antique brass. Calm, tactile surfaces. In open landscapes the distant horizon sits around the middle to lower middle of the scene.

In deep nocturne blue one large luminous eight-pointed star hangs in a clear open patch of sky with exactly seven smaller pinprick stars around it. No other stars or speckled constellations. Below, two earthenware amphorae tipped at different angles pour two separate visible streams; one stream ripples a pool, the other wets the dry land at its edge. No hands. A solitary small tree is outlined on a distant hill. Cool silver starlight picks out the vessel rims with a touch of restrained brass, an atmosphere of renewal.
```

## card-moon

SHA-256 des Masters `34f53556e6bf5fca280b0853368287c9ac44229457abe9b1ff048157566bf3c9`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Shadow family. Inky midnight blues and restrained deep wine, large areas of genuine near-black, one small source of soft warm gold. Paint the darks in broad translucent layers and reserve the brightest reflective touch for the focal object. Thoughtful and tranquil.

A large low moon in the middle upper sky, its softly visible full circular disc containing a luminous golden crescent along one edge. The light side and shadow side together read as one single moon. A few downward teardrops of moonlight float below it. A winding pale path crosses the valley through two dark towers and curves around the edge of a motionless foreground pool. Near-black ink and blue-violet with the single lunar source in warm ivory-brass. Evocative and dreamlike with generous quiet space, no wolves, dogs, crayfish, figures, faces or frightening elements.
```

## card-sun

SHA-256 des Masters `fb8a91d1134f9cd505be1122150df3122e32133f1fc7499ae5a8963cbaf5ee97`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat, edge-to-edge illustration for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges, very fine tarnished-gold highlights catching the light. Restrict fine detail to the focal subject. Compose for a tiny printed card as well as a large master. Work in a portrait 2:3 master, ideally 1440 by 2160. The central 85% of the width and the vertical band from 14% to 82% contain all important symbols. Leave the top 12% and bottom 15% as quiet, continuing scenery. No imitation lettering, glyphs, numbers, signature, watermark, ornamental corners, UI shapes, figures, faces, animals or religious symbols. Original composition.

A radiant golden sun centered in the upper middle above a low old terracotta brick garden wall lined with sunflowers. The unbroken sun disc is a luminous, warm apricot-gold circle, with restrained slender rays painted in fine brass and a gentle ochre halo. Place its center around 34% down so it has space above and does not touch the top. Below it, compose an asymmetrical botanical group of sunflowers with expressive seed heads, curling saffron petals and substantial sage-green leaves. Three main heads of varied size are readable at thumbnail scale, with a few quieter profiles. They rise from behind the wall into clear sky. The wall crosses at about 72% of image height, brickwork quietly dissolving into warm shadow near the bottom. Peach, rose and honey-gold morning light, softly rolling distant landscape. Sunny and open, no faces in the flowers or the sun.
```

## card-judgement

SHA-256 des Masters `5ae069b7b0a6b35c99c9f1eedbf7c531c3a241cd5022d2b4e06f539847ba0da3`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Light family. Soft overhead light through warm morning haze, honey gold and pale peach with sage or rose accents, muted purplish depths. Shape the light in broad translucent washes, preserve a clear darker silhouette in the middle register.

A single handsome golden trumpet emerging diagonally from soft morning clouds, its wide flared bell distinct against peach and pale gold sky. A small cloth pennant hangs from it and bears just one simple round sun emblem with short rays. Air and light can be felt around the instrument. Slender, translucent vertical beams of sunrise rise from quiet water below toward the sky, snow-crowned mountains in the distance. No herald, angel, religious figure or cross. An awakening and the very first moment of a new chapter.
```

## card-world

SHA-256 des Masters `6884cb1c84c22337d21b9669a1937b5c0840414505eb1d6dab44e57576bbebaf`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat edge-to-edge painting for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges and very fine aged-brass highlights. Detail stays concentrated on the main silhouette. Portrait 2:3 master, ideally 1440 by 2160. All important objects fit inside the central 84% of the width, between 15% and 81% of the height. Continue quiet scenery to the edges and leave breathing room at the top and bottom. Original composition. Unmarked objects and surfaces; no glyphs, calligraphy, decorative borders, corner ornaments, plaques, watermark, signature or religious insignia.

Light family. Soft overhead light through warm morning haze, honey gold and pale peach with sage or rose accents, muted purplish depths. Shape the light in broad translucent washes, preserve a clear darker silhouette in the middle register.

An elegant oval laurel wreath of softly lit sage and brass leaves, tied with visible crimson ribbons, encircles one small, softly glowing blue-green planet suspended in open space. Soft warm light from above gilds the leaves against a deep violet starry sky. The wreath is the dominant complete, readable oval, entirely within the central safe region. Four very small neutral plain golden triangle emblems sit in the four outer quadrants of the scene, about 16 and 84 percent across and 23 and 75 percent down, well away from the actual canvas corners. Delicate hand-painted gold and warm rosy illumination without excessive glow. Wholeness and quiet completion; no figure, creature, astrological glyph or decorative frame.
```

## card-back

SHA-256 des Masters `b43ceba1927fd3da6def4d9e04963982dc643e999c62553c3820f138255f8924`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. Full-bleed flat print artwork for the reverse of the same fine press oracle book deck. Portrait 2:3 master, ideally 1440 by 2160. A precise 180-degree rotationally symmetric astronomical bookbinding design, dead-on flat. Dark ink-violet matte paper, understated brushed pigment and faintest fine grain. In the exact center a single elegant eight-point compass rose engraved in muted brushed brass, with exactly four long cardinal points alternating with four shorter diagonal points, beautiful faceted gold and shadow planes. Set the rose within two or three delicate concentric instrument rings with a sparse rhythm of small unlabeled ticks. Compass diameter roughly 64% of card width. A simple horizontal row of small lunar phases with a full moon in the center at 21% of card height, reproduced rotated 180 degrees at 79%. Open quiet space around all three elements and clean dark paper all the way to each edge. The thin double-line exterior gold border will be drawn in print finishing; generate just the internal artwork. No outer border, ornamental corners, card mockup, perspective, banner, plaque, cartouche, medallion at the top, dominant light direction, mock lettering, zodiac glyphs, words, orientation labels, watermark or symbols of religion.
```
