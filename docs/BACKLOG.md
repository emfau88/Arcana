# BACKLOG

Priorität: P0 = Produktkern (G2/G3), später = nach Eigentümerfreigabe. Keine P1/P2-Funktionen ohne Freigabe.

## Nach Designfreigabe (G2)

- [ ] S06: 19 Karten (Illustration + DE/EN-Texte), 4 Themen, 126 Karte×Thema-Botschaften. Redaktion, Validator-Stufe `p0` grün.
- [ ] S07: Profil bearbeiten und neu bestimmen, alle 8 Typen im UI erreichbar (Logik ist getestet). Optional 5. oder 6. Frage.
- [ ] S08: Datumsgrenze um Mitternacht während die App offen ist, Resume nach Hintergrund, Zeitzonenwechsel.
- [ ] S09: alle 6 Themen im Orakel, Verwerfen-Pfad, Detailansicht je Position.
- [ ] S10: leere und Fehlerzustände (IndexedDB nicht verfügbar, voll), Sprach-/Bewegungs-Einstellungen final, Grimoire-Filter falls nötig.

## Härtung (G3)

- [ ] Release-Modus-Testbuild mit zulässiger Testsignatur, SHA-256, Größe, Startup, Reveal und Scroll.
- [ ] TalkBack manuell auf dem Emulator (in G1 nur ein uiautomator-Labelcheck).
- [ ] Upgrade-Pfad der IndexedDB (Schema-Version 2) testen.
- [ ] Optionaler PWA-Cache (Service Worker) prüfen: Offline auch im Browser.
- [ ] Vollständige Q01–Q16-Matrix, Lizenzliste der Abhängigkeiten.

## Bekannte Kleinigkeiten

- [ ] Capacitor-Bridge loggt im Debug-Build `[object Object]`-Zeilen in Logcat (Bridge-eigenes Logging, kein App-Fehler). In Release-Builds prüfen.
- [ ] Der erste Kaltstart direkt nach `pm clear` ist langsam (~9 s bis zum ersten Screen im Emulator, WebView-Initialisierung). Spätere Starts liegen im Median bei 2,3 s. Auf einem echten Gerät in G3 messen.

## Später (nur nach separater Freigabe)

- Finaler Name, App-ID, Store-Entwürfe (G4)
- Premium/Billing (G5, siehe Billing-Notiz in `DECISIONS.md`)
- Weitere Decks, umgekehrte Karten, Benachrichtigungen
