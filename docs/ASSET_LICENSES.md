# ASSET_LICENSES

| Asset | Pfad | Herkunft | Lizenz / Recht |
|---|---|---|---|
| Kartenillustrationen (3 + Rückseite), Thumbnails | `public/cards/` | eigenes Werk, prozedural erzeugt durch `art/cards.mjs`, `art/lib.mjs`, `scripts/render-art.mjs` (SVG → WebP mit lokalem Chromium) | Projekteigentum |
| Papier-/Kornstruktur | `public/textures/grain.webp` | eigenes Werk, generiert | Projekteigentum |
| Favicon, App-Icons (Web 192/512, Android-Mipmaps, adaptive Icons) | `public/favicon.svg`, `public/icons/`, `android/app/src/main/res/` | eigenes Werk, aus derselben Pipeline (`render-art.mjs --android`). Die Android-Standardicons von Capacitor wurden entfernt. | Projekteigentum |
| Archetyp-Sigillen, UI-Icons | `src/ui/Sigil.tsx`, `src/ui/Icons.tsx` | eigenes Werk (Inline-SVG) | Projekteigentum |
| Schrift Cormorant Garamond (variabel) | `node_modules/@fontsource-variable/cormorant-garamond` → Build | Christian Thalmann / Fontsource | SIL Open Font License 1.1 |
| Schrift Manrope (variabel) | `node_modules/@fontsource-variable/manrope` → Build | Mikhail Sharanda / Fontsource | SIL Open Font License 1.1 |
| Texte (Karten, Themen, Archetypen, Fragen, UI) DE/EN | `src/content/`, `src/i18n/` | eigenes Werk | Projekteigentum |
| Kartennamen der Haupt-Arkana | – | traditionelle, gemeinfreie Bezeichnungen | gemeinfrei |

Es gibt keine fremden Bilder, keine Stock-Grafiken, keine KI-generierten Bilder, keine Assets aus dem Altprojekt und keine CDN-Ressourcen.

Für die npm-Abhängigkeiten gelten deren Lizenzen (überwiegend MIT/Apache-2.0). Eine vollständige Lizenzliste für Release-Builds gehört zu G3/S13.
