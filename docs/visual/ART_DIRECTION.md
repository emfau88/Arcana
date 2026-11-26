# ART_DIRECTION · ARCANA Visual Overhaul (V01)

Verbindliche Referenz: `docs/visual/reference/wunsch-mockup.webp`. Gilt für alle neuen Screens und Assets. Ergänzt `docs/briefing/03_UX_ART_CONTENT.md` (lokal) und ersetzt dessen G1-Farbvorschlag.

## 1 · Leitbild

**„Ein lebendiges Grimoire in einem nächtlichen Observatorium.“** Jeder Screen ist ein Ort, jede Karte ein Fund, jede Aktion ein kleines Ritual. Luxuriös und erwachsen, nie verspielt. Die Karte bleibt immer der Star.

Drei Ebenen pro Screen, von hinten nach vorn:
1. **Welt** (illustrierter Hintergrund, pro Bereich eine eigene Szene)
2. **Licht** (CSS: Farbverlauf, Vignette, Aura um die Karte, wenige Partikel)
3. **Inhalt** (Karten, Texte, Ornament-Panels, Buttons)

Optional als Ebene 4: ein Vordergrund mit Ranken oder Blüten am Rand für Tiefe. Die Lesbarkeit hat immer Vorrang vor Atmosphäre.

## 2 · Farbsystem (neue Tokens)

| Token | Wert | Rolle |
|---|---|---|
| `--night-950` | `#060812` | tiefster Grund, Ränder, Vignette |
| `--midnight-900` | `#0B1024` | Seitenhintergrund ohne Bild |
| `--petrol-800` | `#0E2A36` | kühle Tiefe, Himmel, Panels (Verlauf unten) |
| `--petrol-600` | `#14505C` | Lichtkanten, Hover |
| `--teal-glow` | `#4FD1C5` | nur Fortschritt und „neu entdeckt“-Glanz, sparsam |
| `--violet-800` | `#24143A` | Panels (Verlauf oben), Nebel |
| `--violet-600` | `#4A2A6E` | Akzentflächen, aktive Chips |
| `--magenta-500` | `#C2549A` | aktives Thema, Herz/Liebe, CTA-Kontur. Max. 5 % Fläche |
| `--gold-200` | `#F6E6B8` | Glanzpunkte, Titel auf Karten |
| `--gold-400` | `#D9B56E` | Ornamente, Linien, Icons |
| `--gold-600` | `#9A7338` | Schatten der Ornamente, Rahmenkanten |
| `--parchment` | `#EADBC0` | Grimoire-Seiten |
| `--text-1` | `#F4EDE3` | Lesetext |
| `--text-2` | `#C9BFD6` | Zweittext |

Bestehende `--ink-*` und `--brass-*` werden auf diese Tokens gemappt, damit nichts bricht.

**Kontrastregel:** Fließtext steht nie direkt auf Illustration. Es gibt immer eine Panel-Fläche ≥ 82 % Deckkraft oder einen Verlauf mit mindestens 4,5:1 (gemessen). Gold auf hellem Grund ist verboten.

## 3 · Typografie

| Rolle | Schrift | Stil |
|---|---|---|
| Logo und Wortmarke | Cormorant Garamond 500, Versalien, Sperrung 0,18 em | mit Mondphasen-Emblem (SVG) |
| Display H1 („Deine Tageskarte“, Kartenname) | Cormorant 500/600, 34–44 px mobil | Kartenname zusätzlich kursiv in `--gold-200` |
| Eyebrow („Tag 12 · Der erwachende Pfad“) | Manrope 600, Versalien, 11–12 px, Sperrung 0,22 em | in `--gold-400`, links und rechts kleine Sternornamente |
| Schlagworte („Schöpfung · Fülle · Fürsorge“) | Cormorant 600 Kapitälchen, 15 px | Mittelpunkt-Trenner |
| Fließtext | Manrope 400, 16–17 px, Zeilenhöhe 1,55 | unverändert lesbar |
| CTA-Beschriftung | **Cormorant 600, 19–20 px** | wie im Mockup. Mindestgröße wegen Lesbarkeit |

## 4 · Ornamentik (alles per SVG/CSS, keine Bilddateien)

- **Kopfornament:** Mondphasen-Reihe ◐◑●◐◑ mit Stern, für Logo und Reading-Kopf
- **Überschriften-Flanken:** ✦ — Titel — ✦ (Linie mit Verlauf nach außen)
- **Ornament-Panel:** doppelter Goldrand (1 px + 0,5 px, 4 px Abstand), Eckornamente als SVG-Schnörkel, Innenverlauf `--violet-800` → `--petrol-800`, Innenglanz oben, leichter Außenschatten
- **Trenner:** Linie mit Raute (vorhanden) plus Variante mit Mondsichel
- **Kartenbühne:** Aura (radialer Verlauf Gold → Magenta → transparent), 8–12 feine Strahlen, Lichtpunkt am Boden, Kartenrahmen mit äußerem Goldglühen (`box-shadow` in mehreren Schichten)
- **Partikel:** 12–20 kleine Sterne/Funken als CSS-Elemente, langsames Funkeln, **pausiert nach 10 s und bei reduzierter Bewegung**, kein Canvas-Dauerlauf (Briefing: kein Idle-Rendering)

## 5 · Komponenten

| Komponente | Gestaltung |
|---|---|
| Primär-CTA | dunkle Pille (`--violet-800` → `--night-950`), 1,5 px Goldkontur mit Verlauf, Magenta-Innenschein unten, Serifenschrift, Pfeil/Stern-Glyph. Höhe ≥ 52 px. Hover/Fokus: Glanzlauf (1×, nicht endlos) |
| Sekundär | Goldkontur, transparent |
| Chips (Themen) | Pille mit Icon. Aktiv: Magenta-Kontur + violetter Grund. Jedes Thema bekommt eine Akzentfarbe (Liebe Magenta, Beruf Gold, Selbst Teal, Veränderung Violett, Balance Petrol, Kreativität Bernstein) |
| Tab-Leiste | Glasfläche (`--night-950` 88 %, Blur), Goldlinie oben, aktives Icon mit Goldglühen und Label in Gold |
| Fortschritt | Sternenpfad: Knoten als kleine Sterne/Monde, verbunden durch Goldlinie, erreichte Knoten leuchten (Teal-Kern) |
| Statistik/Sammlung | Zahl groß in Cormorant, Bogen statt Balken (Halbkreis wie Astrolabium) |
| Kartenrahmen | Rahmen bleibt im Bild (Deck v2). Glanz kommt per CSS (Glühen, Aura). Ein neuer Ornamentrahmen wäre ein Neuexport aus den Mastern (Entscheidung E4) |

## 6 · Illustrationen (extern erzeugt)

- **Stil:** malerisch, wie Deck v2 (Gouache und Lasur, feines Korn, Goldhighlights), aber **stimmungsvoller, mit mehr Tiefe und Licht**, näher an High Fantasy. Petrol und Violett dominieren, warme Lichtquellen (Fenster, Laternen, Mond) setzen Akzente.
- **Menschen und Figuren sind erlaubt** (neu): mystische, würdevolle Figuren, erwachsen, divers, keine Sexualisierung. Archetypen sind individuell, ausdrucksstark und emotional ansprechend, Gesichter ausdrücklich erlaubt (E2, 26.11.2026). Die acht Figuren zusammen sind divers.
- **Kein Text im Bild**, keine Logos, keine Zahlen.
- **Hintergründe:** Zentrum ruhig und dunkler, weil dort Karte und Text liegen. Details an Rändern und oben. Kein starker Kontrast hinter Textzonen.
- Keine Kopie bestehender Tarot-Decks oder lebender Künstler.

## 7 · Bewegung

| Moment | Animation | Dauer | Reduzierte Bewegung |
|---|---|---|---|
| Screen-Eintritt | Hintergrund leichter Zoom 1,04 → 1, Inhalt blendet von unten ein | 600 ms | nur Einblenden |
| Karte enthüllen | Drehung (vorhanden) + Aura blüht auf + 1× Funkenstoß | 650 ms | sofort, statisches Aura-Bild |
| Fortschritts-Knoten erreicht | Knoten leuchtet auf | 400 ms | statisch |
| Ambient | Partikel funkeln, Aura „atmet“ (Opazität ±10 %) | 10 s, dann Pause | aus |

## 8 · Abnahmekriterien (gelten für jeden Screen)

1. Kontrast Text ≥ 4,5:1, große Schrift ≥ 3:1 (gemessen)
2. 360 px Breite, 200 % Systemschrift, Android-Emulator ohne Überlauf
3. Reduzierte Bewegung respektiert
4. Kein Bild > 350 KB, Screen-Assets gesamt ≤ 600 KB, erster Screen interaktiv ohne Bildwartezeit (Hintergrund blendet nach)
5. Echte Screenshots DE/EN als Nachweis
6. Eigentümerurteil: „wirkt wie das Mockup“
