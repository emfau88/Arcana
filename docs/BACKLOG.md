# BACKLOG

Priorität: P0 = Produktkern (G2/G3), später = nach Eigentümerfreigabe. Keine P1/P2-Funktionen ohne Freigabe.

## G2 (erledigt)

- [x] S06: 19 Karten (Illustration + DE/EN-Texte), 4 Themen, 126 neue Karte×Thema-Botschaften. Validator-Stufe `p0` grün.
- [x] S07: Profil bearbeiten, neu bestimmen oder Archetyp selbst wählen. Alle 8 Typen im UI erreichbar.
- [x] S08: Datumsgrenze um Mitternacht bei offener App (E2E-Test). Die Rückkehr aus dem Hintergrund prüft den Tag ebenfalls neu (`onResume`).
- [x] S09: alle 6 Themen im Orakel, Verwerfen-Pfad, Detailansicht je Position.
- [x] S10: leere und Fehlerzustände, Sprach- und Bewegungseinstellungen, Prototyp-Hinweise entfernt.

## Härtung (G3)

- [ ] Release-Modus-Testbuild mit zulässiger Testsignatur, SHA-256, Größe, Startup, Reveal und Scroll. Kaltstart auf ruhigem Rechner nachmessen (zuletzt 3,8 s unter Last).
- [ ] TalkBack manuell auf dem Emulator (bisher nur ein uiautomator-Labelcheck).
- [ ] Upgrade-Pfad der IndexedDB (Schema-Version 2) testen, Datenbestand aus 0.1.0 → 0.2.0.
- [ ] Zeitzonenwechsel bei laufender App und Tageswechsel im Hintergrund (Android) gezielt testen.
- [ ] Optionaler PWA-Cache (Service Worker) prüfen: Offline auch im Browser.
- [ ] Vollständige Q01–Q16-Matrix, Lizenzliste der Abhängigkeiten.

## Design-Feinschliff (später, Eigentümer entscheidet den Zeitpunkt)

- [x] Kartenkunst ersetzt durch Deck v2 (D-26, D-27).
- [ ] Archetyp-Sigillen und App-Icon an das gemalte Deck angleichen (eigener kleiner Auftrag).
- [ ] Optional nachbessern: XII (Baum kein klares T, Lichtkranz schwach), XVII (sieben kleine Sterne fehlen), Rückseite wirkt flacher als die Vorderseiten.
- [ ] Grimoire-Sammlung: Am Anfang sind fast alle Karten verdeckt. Entdeckte Karten hervorheben oder filtern.
- [ ] Lange Kartentitel (Längenklasse `l`, z. B. „Die Hohepriesterin“) sind in der kleinen Rasteransicht klein.
- [ ] Menschliches Lektorat aller Texte (Ton, Rhythmus). XIII und XV dabei ruhig halten.
- [ ] Optional 5. oder 6. Frage im Fragebogen.

## Bekannte Kleinigkeiten

- [ ] Capacitor-Bridge loggt im Debug-Build `[object Object]`-Zeilen in Logcat (Bridge-eigenes Logging, kein App-Fehler). In Release-Builds prüfen.
- [ ] Der erste Kaltstart direkt nach `pm clear` ist langsam (~7 s bis zum ersten Screen im Emulator, WebView-Initialisierung). Spätere Starts liegen im Median bei 2,4 s. Auf einem echten Gerät in G3 messen.
- [ ] Android-Build braucht lokal `ANDROID_HOME` (oder `android/local.properties`, nicht versioniert), siehe README.

## Später (nur nach separater Freigabe)

- Finaler Name, App-ID, Store-Entwürfe (G4)
- Premium/Billing (G5, siehe Billing-Notiz in `DECISIONS.md`)
- Weitere Decks, umgekehrte Karten, Benachrichtigungen
