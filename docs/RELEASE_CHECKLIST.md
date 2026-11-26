# RELEASE_CHECKLIST

Stand G2: noch kein Release-Kandidat. Die Liste wird in G3/G4 abgehakt.

## G3 — technischer Kandidat
- [ ] `npm ci && npm run check && npm run test:e2e` grün auf sauberem Checkout
- [ ] Release-Modus-Testbuild (zulässige Testsignatur, dev-ID), SHA-256 und Größe dokumentiert
- [ ] Manifest: nur `INTERNET`, Backup aus, kein `server.url`, keine Debug-Endpunkte
- [ ] Startup, Reveal und Scroll gemessen. Kein Overflow, kein Crash, keine ANRs
- [ ] Q01–Q16 vollständig
- [ ] Lizenzliste der Abhängigkeiten

## G4 — nur mit Eigentümerfreigabe
- [ ] Finaler Name und dauerhafte App-ID bestätigt
- [ ] Eigene Produktionssignierung (Schlüssel außerhalb des Repos)
- [ ] Produktions-AAB, Emulator-Smoke-Test
- [ ] Store-Entwürfe DE/EN, echte Screenshots, Datenschutz, Data Safety, Alterszielgruppe
- [ ] Ausdrückliche Freigabe für jede Console-Aktion. Keine Änderung an Heartvia
