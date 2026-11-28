# BACKLOG

Priorität: P0 = Produktkern (G2/G3), später = nach Eigentümerfreigabe. Keine P1/P2-Funktionen ohne Freigabe.

> **Seit 26.11.2026 gilt die Produktvision V2.** Neue Funktionen, Pakete und ihre Reihenfolge stehen in `docs/product/MASTER_ROADMAP_V2.md` (Bulks mit „Fertig, wenn“). Diese Liste führt nur noch offene Einzelpunkte aus G2/G3 und dem Design-Feinschliff; sie werden in den passenden Bulk übernommen (G3-Härtung → V07.5, IndexedDB-Upgrade → V03.1, Grimoire-Hervorhebung → V05.3, Fragebogen → V04.1).

## G2 (erledigt)

- [x] S06: 19 Karten (Illustration + DE/EN-Texte), 4 Themen, 126 neue Karte×Thema-Botschaften. Validator-Stufe `p0` grün.
- [x] S07: Profil bearbeiten, neu bestimmen oder Archetyp selbst wählen. Alle 8 Typen im UI erreichbar.
- [x] S08: Datumsgrenze um Mitternacht bei offener App (E2E-Test). Die Rückkehr aus dem Hintergrund prüft den Tag ebenfalls neu (`onResume`).
- [x] S09: alle 6 Themen im Orakel, Verwerfen-Pfad, Detailansicht je Position.
- [x] S10: leere und Fehlerzustände, Sprach- und Bewegungseinstellungen, Prototyp-Hinweise entfernt.

## Härtung (G3)

- [ ] Release-Modus-Testbuild mit zulässiger Testsignatur, SHA-256, Größe, Startup, Reveal und Scroll. Kaltstart auf ruhigem Rechner nachmessen (zuletzt 3,8 s unter Last). Testbuild, Signatur, SHA-256 und Größe erledigt (V05.6, S-59, `docs/TESTPAKET.md`); Startup, Reveal und Scroll im Release-Build folgen in QG-V05 (die Browser-Messung ist gelaufen, `docs/visual/PERFORMANCE.md` „V05“).
- [ ] TalkBack von Hand mit echten Wischgesten und Doppeltipp, auf einem echten Gerät (V07.5). Der Grundcheck in QG-V05 (Namen, Lesereihenfolge, Fokus nach dem Wechsel, S-61) lief auf dem Emulator; Gesten lassen sich dort per adb nicht einspielen, und die Tastaturnavigation von TalkBack erreichte nur die Tab-Leiste. Auf dem Gerät prüfen, ob der Inhalt per Wischen in der richtigen Reihenfolge erreichbar ist.
- [x] Upgrade-Pfad der IndexedDB (Schema-Version 2) testen: Unit-Tests mit drei Fixtures (V03.1) und Android 0.2.0 → 0.3.0 mit echtem Datenbestand, 9/9 PASS (QG-V03, `scripts/android-migration.mjs`).
- [ ] Zeitzonenwechsel bei laufender App und Tageswechsel im Hintergrund (Android) gezielt testen.
- [ ] Optionaler PWA-Cache (Service Worker) prüfen: Offline auch im Browser.
- [ ] Vollständige Q01–Q16-Matrix, Lizenzliste der Abhängigkeiten.

## Später (Produktvision V2, nach Marktdaten)

- [ ] Virtuelle Talismane und spirituelle Sammelobjekte als **kostenlose** Entdeckungsinhalte (1.3+): gefunden über Reise, Kartenstufen, Meilensteine. Keine Zufallsziehung, keine Lootbox, keine virtuelle Währung, nie käuflich (R6).
- [ ] Premium-Decks als Serie nach dem ersten Deck in 1.2 (R7, `docs/product/MONETIZATION_CONCEPT.md` §2.4).
- [ ] Spirituelle Themenreisen (7–21 Tage) als Einzelkauf oder Abo-Inhalt (R7).
- [ ] Visueller PDF-Export des Grimoires (E6), unabhängig von der Sicherung.

## Design-Feinschliff (später, Eigentümer entscheidet den Zeitpunkt)

- [x] Kartenkunst ersetzt durch Deck v2 (D-26, D-27).
- [ ] Archetyp-Sigillen und App-Icon an das gemalte Deck angleichen (eigener kleiner Auftrag).
- [ ] Optional nachbessern: XII (Baum kein klares T, Lichtkranz schwach), XVII (sieben kleine Sterne fehlen), Rückseite wirkt flacher als die Vorderseiten.
- [x] Grimoire-Sammlung: Am Anfang sind fast alle Karten verdeckt. Entdeckte Karten hervorheben oder filtern. Erledigt mit V05.3: Im Kapitel Karten stehen nur die entdeckten, der Rest ist eine Zeile (Design-Plan Punkt 7, S-55).
- [ ] Lange Kartentitel (Längenklasse `l`, z. B. „Die Hohepriesterin“) sind in der kleinen Rasteransicht klein.
- [ ] Menschliches Lektorat aller Texte (Ton, Rhythmus). XIII und XV dabei ruhig halten.
- [x] Optional 5. oder 6. Frage im Fragebogen. Erledigt in V04.1: sieben Fragen, Ergänzungs-Archetyp, Angebot an Bestandsnutzer (D-53).

## Reise und Identität (nach V04)

- [ ] Hundert-Tage- und Jubiläums-Rückblicke, Jahrbuch, Sternbild „Hundert“: eigener Bereich `jubilees`, noch nicht gebaut; danach in `BUILD_FEATURES` eintragen (S-22).
- [x] B-07: die vom Eigentümer gewählte Variante B eingebaut (Panel unter der Fußzeile, D-59).
- [ ] Optional: Willkommen als „Buch als Bühne“ neu anordnen, damit A06 unabgedunkelt wirkt (S-27).
- [ ] V07.5, echtes Gerät: Bildschirmwechsel auf bildreiche Screens (Enthüllung, „Heute“, Grimoire) mit `scripts/android-trace.mjs` messen; auf dem Emulator bleibt ein langer Frame von 100–230 ms (B-13, S-31).
- [ ] V07.5, echtes Gerät: Das Android-WebView holt `favicon.svg` bei jeder Navigation und liest es als SVG-Dokument (38–54 ms Hauptthread). Auf dem Emulator ohne messbare Wirkung auf die Frames; auf dem Gerät prüfen, ob sich das Entfernen in der App lohnt (S-31).

## Leistung (B-08, Ausnahme des Eigentümers D-67, Behebung spätestens in V07.5)

- [ ] Option 1, kleine Variante (unsichtbar, ≈ 1,5–2 h mit Messung): Orakel, Willkommen mit Fragebogen und die Detailteile des Grimoires als eigene Chunks laden und im Leerlauf vorladen; die Identität erst nach dem ersten Bild berechnen. Ziel: „Heute“ sichtbar ≤ 1.250 ms, Erststart ≤ 1.600 ms (`docs/visual/PERFORMANCE.md` „V05“).
- [ ] Option 2, große Variante (unsichtbar, weitere ≈ 1,5–2 h, riskanter): nur die aktive Sprache der Oberflächen- und Kartentexte im Start-JS, die andere beim Sprachwechsel nachladen.
- [ ] Falls weder 1 noch 2 reicht: Raumbild auf „Heute“ nach der Karte laden (sichtbar, nur nach Rückfrage).

## Bekannte Kleinigkeiten

- [ ] Capacitor-Bridge loggt im Debug-Build `[object Object]`-Zeilen in Logcat (Bridge-eigenes Logging, kein App-Fehler). In Release-Builds prüfen.
- [ ] Der erste Kaltstart direkt nach `pm clear` ist langsam (~7 s bis zum ersten Screen im Emulator, WebView-Initialisierung). Spätere Starts liegen im Median bei 2,4 s. Auf einem echten Gerät in G3 messen.
- [ ] Android-Build braucht lokal `ANDROID_HOME` (oder `android/local.properties`, nicht versioniert), siehe README.

## Später (nur nach separater Freigabe)

- Finaler Name, App-ID, Store-Entwürfe (G4)
- Premium/Billing (G5, siehe Billing-Notiz in `DECISIONS.md`)
- Weitere Decks, umgekehrte Karten, Benachrichtigungen
