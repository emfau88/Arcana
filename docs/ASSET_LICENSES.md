# ASSET_LICENSES

| Asset | Pfad | Herkunft | Lizenz / Recht |
|---|---|---|---|
| Kartenillustrationen v2 (22 Vorderseiten und Rückseite), jeweils mit Thumbnail | `public/cards/`, `public/cards/thumbs/` | OpenAI ImageGen, 26.11.2026. Eigene Bildauswahl, Komposition mit dem Projektrahmen, Ausrichtung der Motive innerhalb der Schutzzonen, drehsymmetrische Rückseite mit eigenem Goldrand und WebP-Export. Helle Karten (0, I, III, VI, VIII, XIV, XIX, XX, XXI) bekommen zusätzlich einen dunklen Halo unter den Rahmenlinien (`docs/assets/card-frame-halo.png`), damit Rahmen und Medaillon sichtbar bleiben. [Prompts und Master-Prüfsummen](assets/card-prompts.md) · [Exportskript](../scripts/assets/export-cards.py) | OpenAI überträgt dem Nutzer bzw. Geschäftskunden seine etwaigen Rechte am Output, soweit das anwendbare Recht dies zulässt. Ähnliche Ausgaben sind möglich. [EU-Nutzungsbedingungen, Abschnitt „Content“](https://openai.com/policies/eu-terms-of-use/) · [Services Agreement, § 4](https://openai.com/policies/services-agreement/) |
| Rahmenvorlage, Rahmen-Halo, Schutzzonen und ursprüngliche Deckübersicht (Vektordeck G1/G2) | `docs/assets/card-frame-template.png`, `card-frame-halo.png`, `card-safe-zones.png`, `deck-overview.webp` | eigenes Werk, aus der ursprünglichen Vektorpipeline (`art/template.mjs`, `scripts/render-art.mjs`) | Projekteigentum |
| Deckübersicht v2 und Titelprüfung DE/EN | `docs/assets/deck-overview-v2.webp`, `docs/assets/title-check-v2.webp` | Kontaktbogen aus den v2-Thumbnails und echter Chromium-Screenshot der Inschriften aus dem lokalen Dev-Server | Kartenillustrationen v2 und lokale Projektschriften wie hier angegeben |
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

Das Deck v2 ersetzt die vorläufigen Illustrationen aus D-22. Weitere Illustrationen lassen sich ohne Codeänderung einsetzen, wenn sie diese Regeln einhalten.

| Regel | Wert |
|---|---|
| Format | WebP, Seitenverhältnis 2:3 |
| Größen | Vollbild 720 × 1080 px (`public/cards/<assetId>.webp`) und Thumbnail 240 × 360 px (`public/cards/thumbs/<assetId>.webp`, gleicher Name) |
| Dateinamen | genau die `assetId` aus `src/content` bzw. `art/deck.mjs`, z. B. `card-fool.webp`, Rückseite `card-back.webp` |
| Kein Text im Bild | Ziffer und Titel setzt die App selbst (DE/EN, Schriftgröße). Medaillon oben und Titelplakette unten frei lassen bzw. im Rahmen gestalten |
| Rahmen und Schutzzonen | Vorlage `docs/assets/card-frame-template.png`, Schutzzonen `docs/assets/card-safe-zones.png`: Motiv im Bereich 340 × 430 (x 30–370, y 72–502 bei 400 × 600), Ziffer bei 6,7 % Höhe, Titel bei 89,3 % Höhe |
| Lizenz | Nur eigene oder eindeutig lizenzierte Bilder. Herkunft hier in der Tabelle eintragen |

Ablauf beim Austausch:

1. Die PNG-Master außerhalb des Repos aufbewahren. `python scripts/assets/export-cards.py MASTER_DIR` erzeugt Vollbilder, Thumbnails und Deckübersicht aus den Mastern. Für einzelne Karten die gewünschten `assetId`-Werte anhängen. Helle Karten stehen in `LIGHT_FRAMES` im Skript und erhalten den Rahmen-Halo. `npm run art` erzeugt nur noch Icons, Textur und die Vorlagen in `docs/assets/` und lässt `public/cards/` unberührt. Das alte Vektordeck gibt es nur noch auf Wunsch mit `npm run art -- --legacy-cards <Ordner außerhalb von public>`.
2. `npm run validate:content` prüft, dass für jede Karte Vollbild und Thumbnail existieren.
3. `node scripts/check-card-titles.mjs` (Dev-Server auf 5180, anderer Port per `PORT`) prüft, dass alle 44 Inschriften (22 × DE/EN) in den Rahmen passen.
4. Sichtkontrolle in der App, dann Eintrag in dieser Datei ergänzen.
