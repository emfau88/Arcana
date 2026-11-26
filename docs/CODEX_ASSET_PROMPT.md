# Auftrag: Kartenbilder für ARCANA (22 Karten + Rückseite)

Du arbeitest im Repo `emfau88/Arcana` (Web-App „ARCANA · Personal Oracle“, Vite + React + Capacitor). Die App hat 22 Karten der großen Arkana. Die aktuellen Bilder sind vorläufige, prozedural erzeugte Vektorgrafiken. Deine Aufgabe: **23 neue, hochwertige Kartenbilder erstellen** (22 Vorderseiten + 1 Rückseite), die sich ohne Codeänderung einsetzen lassen. Die Integration in die Render-Pipeline übernimmt danach ein anderer Agent.

## 1 · Zuerst lesen

- `AGENTS.md` (Projektregeln, gelten auch für dich)
- `docs/ASSET_LICENSES.md`, Abschnitt „Karten später austauschen“
- `docs/assets/card-frame-template.png` (Rahmen, 720 × 1080, transparent), `docs/assets/card-safe-zones.png` (Schutzzonen), `docs/assets/deck-overview.webp` (heutige Motive als Orientierung)
- `src/content/cards.ts`, `cards-a.ts`, `cards-b.ts`, `cards-c.ts` (Bedeutung jeder Karte, DE/EN)
- `src/ui/card.css` (die App schreibt Ziffer und Titel selbst auf das Bild)

## 2 · Technische Pflichtregeln

| Regel | Wert |
|---|---|
| Format | 2:3 Hochformat. Master mindestens 1024 × 1536, besser 1440 × 2160 (Master **nicht** ins Repo) |
| Export Vollbild | `public/cards/<assetId>.webp`, 720 × 1080 px, WebP Qualität ~85, Ziel ≤ 200 KB |
| Export Thumbnail | `public/cards/thumbs/<assetId>.webp`, 240 × 360 px, Ziel ≤ 35 KB |
| Dateinamen | exakt die `assetId` aus der Tabelle unten. Vorhandene Dateien werden überschrieben |
| Kein Text | keine Buchstaben, Zahlen, römischen Ziffern, Namen, Signaturen, Wasserzeichen, Pseudo-Schrift |
| Rahmen | Der Bildgenerator zeichnet **keinen** Rahmen. Motiv vollflächig erzeugen, dann `docs/assets/card-frame-template.png` (720 × 1080) **oben drauf** legen. So bleiben Medaillon und Titelplakette exakt dort, wo die App Ziffer und Titel in Gold (#EFD9A4) hineinschreibt |
| Schutzzonen (bei 720 × 1080) | Hauptmotiv im Bereich x 54–666, y 130–904. Medaillon oben: Mittelpunkt (360, 72), Radius ~47. Titelplakette unten: x 94–626, y 920–1010. Dort nichts Wichtiges platzieren. Ecken werden von der App mit 36 px Radius abgerundet |
| Lesbarkeit | Muss auch als Thumbnail (240 × 360) und im Raster (~110 px breit) erkennbar sein: ein klares zentrales Symbol, starke Silhouette, guter Hell-Dunkel-Kontrast |
| Rückseite | `card-back`: **ohne** Medaillon und Plakette, also nicht mit dem Template überlagern. Eigener schmaler Goldrand im gleichen Stil (Außenkante ~19 px, Innenlinie ~32 px vom Rand). 180° drehsymmetrisch. Kein Text |
| Gesamtgröße | alle 46 Dateien zusammen ≤ 6 MB |

## 3 · Stil (Art Direction)

Welt „Nachtobservatorium“: ein hochwertiges, ruhiges Orakelbuch. Die Karten sind die Hauptdarsteller der App.

- Einheitlich für alle 23 Bilder: gleiche Maltechnik, gleiche Lichtlogik, gleiche Linienstärke der Goldakzente, ähnliche Horizonthöhe. Das Deck muss wie aus einer Hand wirken.
- Feine, malerische Illustration mit weichen Verläufen, zarten Messing-/Goldlinien als Akzent und dezentem Papierkorn. Kontrolliertes, weiches Licht.
- **Symbolische Szenen und Stillleben ohne menschliche Figuren oder Gesichter.** Tiere nur, wo unten genannt.
- App-Farben: Hintergrund #100D1C, Flächen #20192F, Gold #D8B879, Nebelviolett #A995CB.
- Drei Tonfamilien (Spalte „Ton“):
  - **light**: warme Morgendämmerung, Pfirsich, Gold, Rosé, sanftes Grün, Licht von oben
  - **twilight**: Indigo, Violett, Mitternachtsblau, silbriges Mondlicht, Goldakzente
  - **shadow**: fast schwarze Tinte, tiefes Karmin oder Blauschwarz, eine einzelne warme Lichtquelle
- Vermeiden: Neon, Kristallkugeln, Esoterik-Kitsch, übertriebene Lens-Flares, Horror, Blut, Totenköpfe, Skelette, Dämonen, Nacktheit, Symbole realer Religionen (z. B. Kreuz, Davidstern), Marken.
- **Keine Kopie bestehender Decks.** Nichts im Stil von Rider-Waite-Smith, Thoth, Marseille oder einem lebenden Künstler, und keine Prompts der Form „in the style of …“. Traditionelle Symbole sind erlaubt, die Komposition muss eigen sein.
- XIII, XV, XVI und XVIII sind ruhig und nicht beängstigend. Die App verspricht keine Zukunft, sondern bietet Reflexion an.

**Basis-Prompt** (englisch, für jedes Bild voranstellen und dann das Motiv ergänzen):

> Original illustrated oracle card artwork, portrait 2:3, "night observatory" aesthetic: refined painterly illustration with soft gradients, delicate brass-gold line accents, subtle paper grain, soft controlled light, calm and elegant, rich but restrained detail, symbolic scene, centered composition with a strong readable silhouette, full bleed, no border, no frame, no text, no letters, no numbers, no people, no faces.

## 4 · Motive (Symbolik aus dem heutigen Deck, reicher ausgeführt)

| Nr | assetId | Ton | Bedeutung | Motiv (englisch) |
|---|---|---|---|---|
| 0 | `card-fool` | light | offener Anfang, Neugier | Narrow cliff edge at dawn above a misty valley of lavender mountains; a small travel bundle tied to a staff leaning on a rock, a single white rose at the edge, a pale rising sun, two distant birds; peach and gold sky |
| I | `card-magician` | light | Konzentration, Können | A red-draped altar table in warm amber light holding a cup, a coin with a star, a short sword and a wooden wand; a slender wand of light rising in the center, a fine golden infinity loop floating above, garlands of red roses and white lilies |
| II | `card-high-priestess` | twilight | Stille, Intuition | Two pillars, one black and one pale, framing a dark veil embroidered with pomegranates; a large luminous full moon behind, a half-rolled blank scroll resting in front, small crescent moons atop the pillars, still water at the base |
| III | `card-empress` | light | Fülle, Fürsorge | A ripe golden wheat field before a soft green landscape with cypress trees and a small waterfall; a heart-shaped golden shield resting in the field, a circlet of twelve small stars above; warm summer light |
| IV | `card-emperor` | twilight | Struktur, Verantwortung | A massive stone throne carved with ram heads on broad steps before stark red-orange mountains at dusk; a golden orb and a scepter resting on the throne |
| V | `card-hierophant` | twilight | Überlieferung, Werte | A quiet temple hall between two grey columns under a high arch with soft light; a tall golden staff with three horizontal rings (no cross), two crossed keys lying on a checkered floor |
| VI | `card-lovers` | light | Verbindung, Wahl | A green hill with two trees, one with flame-shaped orange leaves and one bearing red apples, a single mountain peak between them, a winged golden sun among soft clouds above |
| VII | `card-chariot` | twilight | Entschlossenheit, Richtung | A canopied chariot decorated with stars and a winged emblem before a moonlit walled city, one dark and one light sphere resting at its wheels |
| VIII | `card-strength` | light | sanfte Stärke, Geduld | A calm resting lion lying beside a single upright flower growing from a cracked stone, a circular garland of blossoms around the flower, a golden infinity loop above, peach dawn over a meadow |
| IX | `card-hermit` | shadow | Rückzug, innere Einkehr | A lantern with a warm star-like light hanging from a tall staff on a snowy mountain peak at night, thin crescent moon, deep blue-black sky |
| X | `card-wheel` | twilight | Zyklen, Wendepunkte | A large ornamented golden wheel with eight spokes and celestial markings (no letters) floating in a violet sky, four small soft clouds near the corners |
| XI | `card-justice` | twilight | Klarheit, Ausgleich | An upright sword with balanced golden scales between two columns, a deep crimson curtain behind, stone steps below |
| XII | `card-hanged-man` | twilight | Innehalten, Perspektivwechsel | A living T-shaped tree with fresh leaves beside a calm lake at dusk, a soft halo of light behind the crossbar; no person, no rope, must not look like a gallows |
| XIII | `card-death` | shadow | Abschluss, Raum für Neues | A river winding toward a rising sun between two dark towers, a single white rose in the foreground; calm and hopeful; no skeleton, no skull |
| XIV | `card-temperance` | light | Ausgleich, richtige Mischung | Water flowing in a graceful arc between two golden cups, a path leading to distant mountains and a sunrise, irises beside a small pond |
| XV | `card-devil` | shadow | Bindungen erkennen | A dark pedestal in deep crimson-black space, two chains lying slack and clearly open on the ground, a faint heat haze and a golden crescent above; no demon, no horns, no pentagram |
| XVI | `card-tower` | shadow | plötzliche Klarheit | A tall stone tower struck by a golden lightning bolt, its crown lifting off, warm glowing windows, sparks drifting down; no people, no destruction scene |
| XVII | `card-star` | twilight | Hoffnung, Erneuerung | A large eight-pointed star with seven smaller stars in a deep blue night, two amphorae pouring water into a pool and onto the land, a small tree on a hill |
| XVIII | `card-moon` | shadow | Unsicherheit, Träume | A large moon showing a crescent within a full disc, falling droplets of light, a path winding between two towers toward a still pool |
| XIX | `card-sun` | light | Wärme, Lebensfreude | A radiant sun over a low brick wall lined with sunflowers, warm golden sky |
| XX | `card-judgement` | light | Erwachen, neues Kapitel | A golden trumpet with a small pennant showing a sun emblem emerging from clouds, beams of light rising from calm water toward the sky, snowy mountains |
| XXI | `card-world` | light | Vollendung, Ganzheit | An oval laurel wreath tied with red ribbons around a small glowing planet, four small triangle emblems in the corners, deep violet sky with stars |
| – | `card-back` | – | Rückseite | Symmetrical (180° rotational) card back: deep ink-violet, a central eight-pointed compass star inside concentric gold rings, a row of moon phases at top and bottom, fine gold line work, subtle grain, thin gold border |

## 5 · Ablauf

1. **Stilprobe:** Erst `card-high-priestess` (twilight), `card-death` (shadow), `card-sun` (light) und `card-back` erzeugen, mit Rahmen komponieren und exportieren. Dann **stoppen** und die vier Bilder dem Auftraggeber zur Freigabe zeigen. Nur wenn der Auftraggeber ausdrücklich „ohne Stopp“ sagt, direkt weitermachen.
2. **Alle Bilder:** die übrigen 19 im freigegebenen Stil.
3. **Export:** Rahmen überlagern (außer Rückseite), WebP in beiden Größen. Für Komposition und Export ein eigenes Skript unter `scripts/assets/` schreiben. Dafür das vorhandene Playwright-Chromium nutzen (siehe `scripts/render-art.mjs`) oder Werkzeuge deiner Umgebung, die nichts im Projekt installieren. **Keine neuen npm-Abhängigkeiten.**
4. **Übersicht:** `docs/assets/deck-overview-v2.webp` als Raster aller 23 Karten mit Beschriftung „Ziffer · assetId“ (die Beschriftung nur in der Übersicht, nie im Kartenbild).
5. **Prüfen:**
   - `npm ci`, dann `npm run validate:content` (prüft, dass alle Bilder vorhanden sind)
   - `npm run check`
   - `npm run dev` starten, dann `node scripts/check-card-titles.mjs docs/assets/title-check-v2.png`. Erwartet: „44/44 inscriptions fit“. Das Bild ansehen: Ziffer und Titel müssen auf dunklem Grund klar lesbar sein
   - die App bei 360 px Breite öffnen und Heute, Orakel und Grimoire-Sammlung ansehen
6. **Herkunft dokumentieren:**
   - In `docs/ASSET_LICENSES.md` die Zeile „Kartenillustrationen“ aktualisieren: Werkzeug bzw. Modell, Datum, Nutzungsrechte laut Anbieterbedingungen, eigene Nachbearbeitung.
   - Neue Datei `docs/assets/card-prompts.md` mit dem exakten Prompt (und ggf. Seed) je Karte, damit einzelne Bilder später nachgebaut werden können.

## 6 · Grenzen

- Nur diese Pfade ändern: `public/cards/**`, `docs/assets/deck-overview-v2.webp`, `docs/assets/title-check-v2.png`, `docs/assets/card-prompts.md`, `docs/ASSET_LICENSES.md`, `scripts/assets/**`.
- **Nicht** ändern: `src/`, `art/`, die übrigen `scripts/`, `package.json`, `package-lock.json`, `android/`.
- **`npm run art` nicht ausführen**, sonst werden die neuen Bilder durch die alten überschrieben.
- Keine Bilder aus dem Internet, keine Stockbilder, keine Assets aus anderen Projekten. Keine kostenpflichtigen Dienste außerhalb deiner eigenen Werkzeuge ohne Rückfrage. Keine Secrets oder persönlichen Daten in Dateien, Prompts oder Commits.
- Arbeite auf dem Branch `assets/karten-v2`, pushe den Branch und öffne einen Pull Request nach `main`. **Nicht mergen**, denn `main` baut automatisch die öffentliche Vorschau.

## 7 · Abschlussbericht (Deutsch)

- Liste aller 46 Dateien mit Pixelmaß und Dateigröße, dazu die Gesamtgröße
- Ergebnisse von `validate:content`, `check` und Titelprüfung (PASS/FAIL, ehrlich)
- verwendetes Werkzeug bzw. Modell und Nutzungsbedingungen
- Abweichungen vom Auftrag, schwache Karten und offene Fragen
- Link zum Pull Request
