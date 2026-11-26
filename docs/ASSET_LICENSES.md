# ASSET_LICENSES

| Asset | Pfad | Herkunft | Lizenz / Recht |
|---|---|---|---|
| Kartenillustrationen v2, Stilprobe II, XIII, XIX und Rückseite, jeweils mit Thumbnail | `public/cards/`, `public/cards/thumbs/` | OpenAI ImageGen, 26.11.2026. Eigene Bildauswahl, Komposition mit dem Projektrahmen, Ausrichtung von Mond und Kompass, drehsymmetrische Rückseite mit eigenem Goldrand und WebP-Export. [Prompts und Master-Prüfsummen](assets/card-prompts.md) · [Exportskript](../scripts/assets/export-cards.py) | OpenAI überträgt dem Nutzer bzw. Geschäftskunden seine etwaigen Rechte am Output, soweit das anwendbare Recht dies zulässt. Ähnliche Ausgaben sind möglich. [EU-Nutzungsbedingungen, Abschnitt „Content“](https://openai.com/policies/eu-terms-of-use/) · [Services Agreement, § 4](https://openai.com/policies/services-agreement/) |
| Übrige 19 Kartenillustrationen und Thumbnails | `public/cards/`, `public/cards/thumbs/` | eigenes Werk, prozedural erzeugt durch `art/lib.mjs`, `art/motifs.mjs`, `art/cards.mjs`, `art/major-a.mjs`, `art/major-b.mjs`, `art/major-c.mjs` (Registry `art/deck.mjs`), gerendert von `scripts/render-art.mjs` (SVG → WebP mit lokalem Chromium) | Projekteigentum |
| Rahmenvorlage, Schutzzonen, Deck-Übersicht | `docs/assets/` | eigenes Werk, aus derselben Pipeline (`art/template.mjs`) | Projekteigentum |
| Papier-/Kornstruktur | `public/textures/grain.webp` | eigenes Werk, generiert | Projekteigentum |
| Favicon, App-Icons (Web 192/512, Android-Mipmaps, adaptive Icons) | `public/favicon.svg`, `public/icons/`, `android/app/src/main/res/` | eigenes Werk, aus derselben Pipeline (`render-art.mjs --android`). Die Android-Standardicons von Capacitor wurden entfernt. | Projekteigentum |
| Archetyp-Sigillen, UI-Icons | `src/ui/Sigil.tsx`, `src/ui/Icons.tsx` | eigenes Werk (Inline-SVG) | Projekteigentum |
| Schrift Cormorant Garamond (variabel) | `node_modules/@fontsource-variable/cormorant-garamond` → Build | Christian Thalmann / Fontsource | SIL Open Font License 1.1 |
| Schrift Manrope (variabel) | `node_modules/@fontsource-variable/manrope` → Build | Mikhail Sharanda / Fontsource | SIL Open Font License 1.1 |
| Texte (Karten, Themen, Archetypen, Fragen, UI) DE/EN | `src/content/`, `src/i18n/` | eigenes Werk | Projekteigentum |
| Kartennamen der Haupt-Arkana | – | traditionelle, gemeinfreie Bezeichnungen | gemeinfrei |

Es gibt keine fremden Bildvorlagen, Stock-Grafiken, Assets aus dem Altprojekt oder CDN-Ressourcen.

Für die npm-Abhängigkeiten gelten deren Lizenzen (überwiegend MIT/Apache-2.0). Eine vollständige Lizenzliste für Release-Builds gehört zu G3/S13.

## Karten später austauschen

Die heutigen Illustrationen sind ein vorläufiger Stand (Eigentümerentscheidung D-22). Neue Assets lassen sich ohne Codeänderung einsetzen, wenn sie diese Regeln einhalten:

| Regel | Wert |
|---|---|
| Format | WebP, Seitenverhältnis 2:3 |
| Größen | Vollbild 720 × 1080 px (`public/cards/<assetId>.webp`) und Thumbnail 240 × 360 px (`public/cards/thumbs/<assetId>.webp`, gleicher Name) |
| Dateinamen | genau die `assetId` aus `src/content` bzw. `art/deck.mjs`, z. B. `card-fool.webp`, Rückseite `card-back.webp` |
| Kein Text im Bild | Ziffer und Titel setzt die App selbst (DE/EN, Schriftgröße). Medaillon oben und Titelplakette unten frei lassen bzw. im Rahmen gestalten |
| Rahmen und Schutzzonen | Vorlage `docs/assets/card-frame-template.png`, Schutzzonen `docs/assets/card-safe-zones.png`: Motiv im Bereich 340 × 430 (x 30–370, y 72–502 bei 400 × 600), Ziffer bei 6,7 % Höhe, Titel bei 89,3 % Höhe |
| Lizenz | Nur eigene oder eindeutig lizenzierte Bilder. Herkunft hier in der Tabelle eintragen |

Ablauf beim Austausch:

1. Dateien mit gleichem Namen nach `public/cards/` und `public/cards/thumbs/` legen. Wer selbst gezeichnete Bilder nutzt, entfernt den jeweiligen Eintrag aus `art/deck.mjs`, damit `npm run art` sie nicht überschreibt.
2. `npm run validate:content` prüft, dass für jede Karte Vollbild und Thumbnail existieren.
3. `node scripts/check-card-titles.mjs` (Dev-Server auf 5180) prüft, dass alle 44 Inschriften (22 × DE/EN) in den Rahmen passen.
4. Sichtkontrolle in der App, dann Eintrag in dieser Datei ergänzen.
