# VISUAL_ROADMAP · Umsetzungsplan Visual Overhaul (V02–V05)

Grundlage: `VISUAL_AUDIT.md`, `ART_DIRECTION.md`, `ASSET_REQUESTS.md`. Arbeitsbranch `design/visual-overhaul`. Merge nach `main` nur nach Freigabe (siehe `MERGE_RECOMMENDATION.md`).

> **Abgelöst seit 26.11.2026 (D-38):** Gültig ist hier nur noch **V02**. Die Pakete V03–V05 unten sind durch die Produktvision V2 ersetzt; maßgeblich sind die Pakete V03–V07 in `docs/product/MASTER_ROADMAP_V2.md` (Gates und Leistungsbudgets dort §6, Android in jedem Paket-Gate). Die Gestaltungsideen in den alten Abschnitten V03–V05 bleiben als Quelle für die V2-Bulks stehen.

**Unveränderlich in allen Paketen:** IDs, Lokalisierung DE/EN, Datenmodelle und Sammelstände bleiben erhalten. Offline-Kern ohne externe Laufzeit-Abhängigkeiten, keine laufenden KI-Kosten. Reduzierte Bewegung und 200 % Systemschrift funktionieren. Kein Text in Illustrationen. AGENTS.md gilt.

**Messungen nur, wo nötig:** pro Paket `npm run check`, E2E, Screenshots DE 412 + EN Desktop + DE 320/130 %. Android-Lauf nur bei V02-Abschluss und V05.

## Reihenfolge auf einen Blick

| Paket | Inhalt | Braucht von dir | Ergebnis |
|---|---|---|---|
| **V02** | Tagesorakel-Slice im Mockup-Niveau | A01 (+ optional A02), Entscheidungen E1–E4 | ein Screen, der „wie das Mockup“ wirkt |
| ~~V03~~ | ~~Design-System auf alle Screens übertragen~~ | abgelöst | siehe `MASTER_ROADMAP_V2.md` V03 Fundament |
| ~~V04~~ | ~~Sichtbare Reise (Progression, ohne Druck)~~ | abgelöst | siehe `MASTER_ROADMAP_V2.md` V04 Identität und Reise |
| ~~V05~~ | ~~Archetypen als Bilder, Feinschliff, Abnahme~~ | abgelöst | siehe `MASTER_ROADMAP_V2.md` V05–V07 |

---

## V02 · Tagesorakel-Slice (Vorzeige-Screen)

**Bulk 1 · Design-Tokens und Grundlagen**
- neue Farb-Tokens aus `ART_DIRECTION.md` in `tokens.css`, alte `--ink-*`/`--brass-*` darauf gemappt
- Weltebene als wiederverwendbare Komponente (`<World scene="today">`): Bild, Verlauf, Vignette, Desktop-Erweiterung, Einblenden nach Laden
- *Fertig, wenn:* alle bestehenden Screens unverändert gut aussehen (Screenshot-Vergleich) und `npm run check` PASS ist.

**Bulk 2 · Ornament-Bibliothek (SVG)**
- Logo-Emblem mit Wortmarke, Überschriften-Flanken, Eckornamente, Ornament-Panel, Mondsichel-Trenner
- *Fertig, wenn:* die Komponenten in einer Testseite in DE/EN scharf auf 1×/3× dargestellt werden, ohne Bilddateien.

**Bulk 3 · Kartenbühne**
- Aura, Strahlen, Bodenlicht, mehrschichtiges Goldglühen um die Karte (Deck v2 bleibt unverändert)
- Enthüllung: Drehung + Aura blüht auf + ein Funkenstoß. Partikel pausieren nach 10 s, bei reduzierter Bewegung statisch
- *Fertig, wenn:* die Enthüllung flüssig läuft (keine Ruckler auf dem Emulator). Im Leerlauf läuft nach 10 s keine Animation mehr (Performance-Panel). Bei reduzierter Bewegung gibt es keine Bewegung.

**Bulk 4 · Screen „Heute“ neu komponiert**
- Kopf mit Logo und Datum, Eyebrow „Tag n deiner Reise“ (nur wenn E6 zustimmt, sonst nur Datum), Kartenbühne, Schlagworte, Kurzbotschaft im Ornament-Panel, darunter die vollständigen Texte
- neuer Primär-CTA (dunkle Pille, Gold- und Magenta-Kontur, Serifenschrift), Tab-Leiste aus Glas mit leuchtendem aktivem Icon
- Hintergrund A01 eingebunden (WebP 2 Größen)
- *Fertig, wenn:* Kontrast ≥ 4,5:1 gemessen ist, 360 px und 200 % Schrift ohne Überlauf funktionieren, der Screen gesamt ≤ 600 KB lädt und Screenshots DE/EN plus Android vorliegen. **Dein Urteil „wirkt wie das Mockup“ ist das eigentliche Abnahmekriterium.**

**Danach STOP:** Screenshots vorlegen. Merge nach `main` (öffentliche Vorschau) nur auf deine Freigabe.

**Stand 26.11.2026: V02 fertig zur Freigabe, nicht gemergt.** Umgesetzt sind Bulk 1–4 plus die acht Abschlusspunkte des Eigentümers:

- [x] Bulk 1 · Design-Tokens und Grundlagen
- [x] Bulk 2 · Ornament-Bibliothek (SVG)
- [x] Bulk 3 und 4 · gemalte Welt (A01, A02), Kartenbühne, Ritual-Aktion, Tab-Leiste
- [x] 1. Triple-Moon-Emblem mit großer Wortmarke ARCANA
- [x] 2. Sternenpfad mit Plakette „Tag n · Weg“ (D-34)
- [x] 3. „Reise fortsetzen“ führt zur Botschaft (D-35)
- [x] 4. Erster Bildschirm gemessen von 360 × 800 bis 412 × 915 (D-36)
- [x] 5. Petrol-, Teal- und Magenta-Akzente
- [x] 6. Barocke Goldecken und Lorbeer
- [x] 7. Medaillon in der aktiven Tab-Leiste
- [x] 8. Lesbare Langtexte
- [x] Leistung ohne optische Abstriche (D-37, D-41), Android 13/13 PASS
- [x] Freigabe durch den Eigentümer (26.11.2026), B-05 und B-06 behoben (D-42)
- [x] Merge (`553c5d9`), Tag `v0.2.1` (Schritte in `docs/product/MASTER_ROADMAP_V2.md` §0.1)

Nachweise in `evidence/v02-final-*.webp`, Messwerte in `PERFORMANCE.md` (alle Grenzwerte PASS ohne optische Abstriche, D-37). Merge und V03 erst nach Freigabe des Tagesorakel-Screens.

## V03 · Design-System auf alle Screens

**Bulk 1 · Orakel:** Themen-Chips mit Akzentfarben und Icons, Mondphasen-Kopf, drei Karten auf der Bühne (mittlere größer und vorn), Deutung in Ornament-Panels. Positionen bleiben Situation/Herausforderung/Impuls.
**Bulk 2 · Grimoire:** Buch-Kopf (A15), Sammlungsfortschritt als Astrolabium-Bogen, unentdeckte Karten zurückhaltend (gedimmt, kleiner Glanz statt 20 gleicher Rückseiten in voller Stärke), Verlauf als Tagebuchseiten.
**Bulk 3 · Willkommen, Fragen, Profil:** Weltbilder A05/A06, neue Buttons und Panels, Logo groß.
*Fertig, wenn:* alle Screens den gemeinsamen Stil zeigen, E2E PASS ist, Screenshots DE/EN vorliegen und kein Screen über 600 KB lädt.

## V04 · Sichtbare Reise (Progression)

Siehe Konzept unten. Umsetzung nur der freigegebenen Bausteine.
**Bulk 1 · Datenbasis:** neue, abwärtskompatible IndexedDB-Felder (z. B. Begegnungen pro Karte, aktive Tage). Bestehende Daten werden beim Start einmalig abgeleitet, nichts geht verloren.
**Bulk 2 · Darstellung:** Pfad der Reise auf „Heute“ und im Profil, Meilenstein-Momente, Karten-Vertiefung im Grimoire.
**Bulk 3 · Teilen:** Kartenbild als Datei teilen (lokal erzeugt, kein Server).
*Fertig, wenn:* Migrations-Tests mit alten Datenständen bestehen, keine Bestrafungs- oder Druck-Texte existieren (Content-Gate prüft das) und das Teilen offline funktioniert.

## V05 · Archetypen-Bilder, Feinschliff, Abnahme

**Bulk 1:** acht Archetyp-Porträts (A07–A14) in Enthüllung, Profil und Grimoire. Enthüllungs-Choreografie: Licht, Aufbau, Name.
**Bulk 2:** ausgewählte figurative Ersatzkarten (A17), falls in V02/V03 entschieden.
**Bulk 3:** Gesamtprüfung: Performance (Kaltstart Android auf ruhigem Rechner), Größe des App-Pakets, Barrierefreiheit, vollständige Screenshot-Sequenzen DE/EN, Android.
*Fertig, wenn:* alle Abnahmekriterien aus `ART_DIRECTION.md` §8 PASS sind und dein Gesamturteil vorliegt.

---

## Progressionskonzept (nur Analyse, keine Umsetzung)

### Problem

Readings sind unbegrenzt. Wer viel zieht, kennt nach einem Abend alle 22 Karten. Die Sammlung ist dann „fertig“, und es bleibt kein Grund wiederzukommen. Gleichzeitig verbieten unsere Regeln Manipulation, Bestrafung verpasster Tage, künstliche Verknappung und vorgetäuschte spirituelle Autorität.

### Kernidee

**Nicht das Finden begrenzen, sondern das Vertiefen belohnen.** Eine Karte zu entdecken ist der Anfang, nicht das Ziel. Jede Karte hat mehrere Ebenen, die sich durch echte Beschäftigung öffnen. Zeit vergeht nur durch Nutzung, nie gegen den Nutzer.

### Bausteine, priorisiert

| Prio | Baustein | Beschreibung | Warum fair |
|---|---|---|---|
| **1** | **Karten-Vertiefung** | Jede Karte hat drei Stufen: *Begegnung* (erstes Ziehen), *Vertraut* (z. B. dreimal begegnet oder einmal Reflexion notiert), *Verinnerlicht* (z. B. eine Reflexion zu einer anderen Lebenssituation). Jede Stufe öffnet einen vorhandenen oder neuen Text (z. B. Schatten-Aspekt, Ritual, Symbolik) und einen Glanz-Zustand der Karte im Grimoire | belohnt Auseinandersetzung, nicht Klicks. Nichts wird verknappt. Alle Inhalte sind über Beschäftigung erreichbar |
| **2** | **Pfad der Reise** (Narrenreise 0–XXI) | Ein Sternenpfad mit Stationen, der an **Tagen mit Nutzung** wächst (nicht Kalendertage). Wer eine Woche pausiert, steht danach an derselben Stelle. Die Stationen folgen der Narrenreise als Erzählung | keine Streak-Logik, keine Verluste. Pausen sind neutral |
| **3** | **Sammlung als Schatz** | Grimoire zeigt Entdeckt und Vertieft getrennt („22 begegnet · 9 vertraut · 3 verinnerlicht“). Zusätzlich Archetypen als Sammlung: Alle acht Bilder sind sichtbar, das eigene ist hervorgehoben | macht Fortschritt nach dem „Alles gefunden“ sichtbar |
| 4 | **Meilenstein-Momente** | z. B. erste Begegnung mit allen Karten eines Themas, erste Reflexion, Station „Der Stern“ erreicht: kurze, schöne Szene (Licht, Text), einmalig | Feier ohne Druck, kein Countdown |
| 5 | **Archetyp-Entwicklung** | Nach einigen Wochen sanfter Hinweis „Deine Karten zuletzt sprechen eher vom Wandernden“, mit dem Angebot (nicht Zwang), den Archetyp neu zu bestimmen | ehrlich als Spiegel der eigenen Wahl gerahmt, keine Schicksalsbehauptung |
| 6 | **Teilbares Kartenbild** | Tageskarte mit Schlagworten als Bild (lokal erzeugt) | Wachstum ohne Werbung, kein Tracking |
| 7 | **Freiwilliger Tageszähler** | Nur „Tag 12 deiner Reise“ = Anzahl Tage mit Nutzung. **Kein** „Streak verloren“, kein Feuer-Symbol, keine Erinnerung ohne Einwilligung | Entscheidung E6 |

### Bewusst abgelehnt

| Idee | Grund |
|---|---|
| Tageslimit für Readings | künstliche Verknappung |
| Streaks mit Verlust, „Rette deine Serie“ | Bestrafung verpasster Tage |
| Seltenheitsstufen, Zufalls-„Drops“ | Lootbox-Dynamik, und keine Tarotkarte ist wertvoller als eine andere |
| Karten nur gegen Bezahlung oder Wartezeit | Paywall-Druck in P0 |
| „Das Universum hat dir diese Karte geschickt“ | vorgetäuschte spirituelle Autorität |
| Push-Benachrichtigungen mit Schuldgefühl („Deine Karte wartet…“) | Manipulation |

### Offene Produktfragen (für V04)

- Welche Texte bilden die Stufen *Vertraut* und *Verinnerlicht*? Vorhandene Inhalte reichen für Stufe 2. Stufe 3 braucht ca. 22 neue Kurztexte pro Sprache.
- Zählen Readings aus dem Orakel für die Vertiefung genauso wie die Tageskarte? (Vorschlag: ja, mit gleichem Gewicht.)

## Entscheidungen des Eigentümers (getroffen am 26.11.2026)

| Nr. | Frage | Entscheidung |
|---|---|---|
| E1 | Mockup-Elemente: Ist die Liste „nicht übernehmen“ in `VISUAL_AUDIT.md` §4 so in Ordnung (keine 78 Karten, keine Seltenheit, kein Past/Future, keine Glocke)? | freigegeben |
| E2 | Archetypen als Figuren mit abgewandtem Gesicht oder Kapuze | **keine** Einschränkung auf Kapuze/abgewandt: individuell, ausdrucksstark, Gesichter erlaubt |
| E3 | Figurative Ersatzkarten: erst nach V02 entscheiden, welche (Kandidaten in `ASSET_REQUESTS.md` A17) | freigegeben, Auswahl nach V02 |
| E4 | Kartenrahmen: CSS-Glanz auf dem vorhandenen Rahmen statt ornamentalem Neuexport. Ein Neuexport setzt die gesicherten PNG-Master voraus | freigegeben: zuerst CSS, später ggf. ornamentaler Rahmen (Master gesichert) |
| E5 | Ambient-Animation: Partikel und Aura-Atmen 10 s nach Screen-Eintritt, danach Ruhe (Briefing-Regel bleibt) | freigegeben: gezielt, hochwertig, bei Inaktivität vollständige Ruhe |
| E6 | Tageszähler „Tag n deiner Reise“ = Tage mit Nutzung, ohne Verlust | freigegeben: wachsende Reise ohne Verlust bei Pausen |
| E7 | Vorschau des Design-Branches auf Pages zum Testen am Handy (Workflow-Änderung) | ja: separate Vorschau unter `/preview/`, main bleibt unverändert |

**Zusätzliche Vorgaben (26.11.2026):** Master gesichert. Architektur und alle Funktionen bleiben. Performance wird reproduzierbar vor und nach dem Overhaul gemessen (`docs/visual/PERFORMANCE.md`). Optisch kompromisslos am Mockup orientiert: erheblicher Qualitätssprung, nicht nur hübscher. Höchste Priorität: Atmosphäre, Karteninszenierung, Lichtführung, Goldornamente, Tiefe.
