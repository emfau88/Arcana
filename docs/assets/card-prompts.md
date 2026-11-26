# ARCANA · Kartenprompts

Die vier Stilproben vom 26.11.2026 wurden mit dem integrierten OpenAI-Bildgenerator ImageGen erzeugt. Jeder Block enthält die vollständige Eingabe für den ausgewählten Master. Das Werkzeug hat weder einen Seed noch eine konkrete Modellversion ausgegeben. Ein erneuter Aufruf kann ein anderes Bild ergeben. Der SHA-256-Wert identifiziert den ursprünglichen PNG-Master.

## WebP-Export

Die ausgewählten PNG-Dateien werden außerhalb des Repos unter ihrem jeweiligen Namen `<assetId>.png` bereitgestellt. Mit Python und Pillow (hier 11.3.0) lassen sich die vier Exportpaare erneut erzeugen.

```sh
python scripts/assets/export-cards.py MASTER_DIR card-high-priestess card-death card-sun card-back
```

Die Master messen jeweils 1024 × 1536 px. Das Skript verkleinert die Malerei in Lanczos-Qualität und legt bei den Vorderseiten die RGBA-Rahmenvorlage darüber. Bei der Hohepriesterin versetzt es das Motiv um 34 px nach unten und verlängert den Himmel an der Oberkante, damit zwischen Mond und Medaillon Platz bleibt. Die Vorderseiten verwenden WebP-Qualität 85. Für die Rückseite zentriert es die Kompassnabe, dreht die obere Bildhälfte um 180° und ergänzt zwei Goldlinien bei 19 und 32 px. Beide Rückseitengrößen werden mit einer reduzierten Farbpalette verlustfrei kodiert, um die pixelsymmetrische Drehung zu erhalten.

## card-high-priestess

SHA-256 des Masters  `9507e67c6954258681a925b7a7669003e98a4172b90b6da9b07aa3401c62c5d0`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat, edge-to-edge illustration for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges, very fine tarnished-gold highlights catching the light. Restrict fine detail to the focal subject. Compose for a tiny printed card as well as a large master. Work in a portrait 2:3 master, ideally 1440 by 2160. The central 85% of the width and the vertical band from 14% to 82% contain all important symbols. Leave the top 12% and bottom 15% as quiet, continuing scenery. No imitation lettering, glyphs, numbers, signature, watermark, ornamental corners, UI shapes, figures, faces, animals or religious symbols. Original composition.

Two free-standing pillars on a low terrace at the edge of still water: one of veined obsidian, the other of pale honed limestone. Each is capped with a small upward crescent, silhouetted clearly against an indigo-violet twilight. Between the pillars hangs a soft, deep aubergine veil with a few individually embroidered pomegranates on a winding branch, stitched in faded garnet and brass. Its shallow drape dips in front of the bottom edge of a large luminous pearl moon centered about a third of the way down. Show the color change where moonlight catches a fold. In front, a single, half-rolled, entirely blank ivory scroll rests horizontally on the terrace, with a quiet reflection below. Indigo, mist violet, silver and aged brass. Mood of held breath and attentive silence. Elegant, spare architecture with no arch or roof.
```

## card-death

SHA-256 des Masters  `c7554dcee5734d463927598883744cc8633428efba350f3c64620aa5549ece33`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat, edge-to-edge illustration for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges, very fine tarnished-gold highlights catching the light. Restrict fine detail to the focal subject. Compose for a tiny printed card as well as a large master. Work in a portrait 2:3 master, ideally 1440 by 2160. The central 85% of the width and the vertical band from 14% to 82% contain all important symbols. Leave the top 12% and bottom 15% as quiet, continuing scenery. No imitation lettering, glyphs, numbers, signature, watermark, ornamental corners, UI shapes, figures, faces, animals or religious symbols. Original composition.

Predawn in a very dark ink-blue valley; the sky is still the almost black color of fountain pen ink. In the middle distance a graceful narrow S-shaped river traces a single line of muted amber light toward a small rising sun between two dark, simple, widely separated towers. The sun breaks through a very narrow band of warmth at the low horizon. Two-thirds of the picture should be deep blue-black and near-black wine shadow, with great quiet shapes and a sparse scattering of soft violet mist across the water. In the near foreground, a single white rose in full bloom on a short leafy branch is seen in three-quarter view. The whole luminous, ivory-white flower head is safely inside the card about 40% across and 64% down, approximately one quarter of the picture width. Its softly sculpted, pale petals and dark leaves are the one immediately identifiable foreground silhouette. Its delicate, angled stem is caught by a fine line of reflected gold. Make the shaded riverbank feel alive and peaceful. A very carefully restrained palette of Payne’s grey, deep indigo, ivory and antique brass, painterly gouache texture. A moment of letting go, hopeful, still, never ominous. No pink or orange sky, cemetery, ruin, tombstone, skull or bones.
```

## card-sun

SHA-256 des Masters  `fb8a91d1134f9cd505be1122150df3122e32133f1fc7499ae5a8963cbaf5ee97`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. A single flat, edge-to-edge illustration for a fine press oracle book. Matte gouache and translucent ink glazes on fine-grained cotton paper, planes of atmospheric color with selectively sharp hand-painted edges, very fine tarnished-gold highlights catching the light. Restrict fine detail to the focal subject. Compose for a tiny printed card as well as a large master. Work in a portrait 2:3 master, ideally 1440 by 2160. The central 85% of the width and the vertical band from 14% to 82% contain all important symbols. Leave the top 12% and bottom 15% as quiet, continuing scenery. No imitation lettering, glyphs, numbers, signature, watermark, ornamental corners, UI shapes, figures, faces, animals or religious symbols. Original composition.

A radiant golden sun centered in the upper middle above a low old terracotta brick garden wall lined with sunflowers. The unbroken sun disc is a luminous, warm apricot-gold circle, with restrained slender rays painted in fine brass and a gentle ochre halo. Place its center around 34% down so it has space above and does not touch the top. Below it, compose an asymmetrical botanical group of sunflowers with expressive seed heads, curling saffron petals and substantial sage-green leaves. Three main heads of varied size are readable at thumbnail scale, with a few quieter profiles. They rise from behind the wall into clear sky. The wall crosses at about 72% of image height, brickwork quietly dissolving into warm shadow near the bottom. Peach, rose and honey-gold morning light, softly rolling distant landscape. Sunny and open, no faces in the flowers or the sun.
```

## card-back

SHA-256 des Masters  `b43ceba1927fd3da6def4d9e04963982dc643e999c62553c3820f138255f8924`

```text
Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

Use case: illustration-story. Full-bleed flat print artwork for the reverse of the same fine press oracle book deck. Portrait 2:3 master, ideally 1440 by 2160. A precise 180-degree rotationally symmetric astronomical bookbinding design, dead-on flat. Dark ink-violet matte paper, understated brushed pigment and faintest fine grain. In the exact center a single elegant eight-point compass rose engraved in muted brushed brass, with exactly four long cardinal points alternating with four shorter diagonal points, beautiful faceted gold and shadow planes. Set the rose within two or three delicate concentric instrument rings with a sparse rhythm of small unlabeled ticks. Compass diameter roughly 64% of card width. A simple horizontal row of small lunar phases with a full moon in the center at 21% of card height, reproduced rotated 180 degrees at 79%. Open quiet space around all three elements and clean dark paper all the way to each edge. The thin double-line exterior gold border will be drawn in print finishing; generate just the internal artwork. No outer border, ornamental corners, card mockup, perspective, banner, plaque, cartouche, medallion at the top, dominant light direction, mock lettering, zodiac glyphs, words, orientation labels, watermark or symbols of religion.
```
