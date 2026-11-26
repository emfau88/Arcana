# G2-Plan · Vollständiger P0-Kern

**Freigabe (26.11.2026):** Der Eigentümer hat G2 freigegeben. Die Karten entstehen vorerst im bisherigen Stil. Später können sie durch eigene Assets ersetzt werden, deshalb muss der Austausch einfach bleiben. Feinschliff am Design folgt später.

| Bulk | Inhalt | Fertig, wenn | Status |
|---|---|---|---|
| 1 · Texte | 4 neue Themen (Beruf, Veränderung, Balance, Kreativität). 19 neue Karten mit allen Texten. 12 fehlende Thementexte der 3 bestehenden Karten. Alles in DE und EN. | `npm run validate:content` meldet in der P0-Stufe 0 Fehler: 22 Karten, 6 Themen, 132 Thementexte je Sprache | erledigt (P0-Stufe PASS, 0 Fehler, 0 Warnungen) |
| 2 · Kartenkunst | 19 Illustrationen im bisherigen Stil. Rahmenvorlage für spätere Ersatz-Assets. Übersichtsbild aller 22 Karten. | Alle 22 Karten liegen als WebP vor. Titel passen in DE und EN. Die Austauschregel ist dokumentiert. | erledigt (22 + Rückseite, 44/44 Inschriften passen, Regel in `ASSET_LICENSES.md`) |
| 3 · Funktionen | Prototyp-Hinweise entfernen, alle 6 Themen freischalten. Archetyp im Profil vollständig ansehen und selbst korrigieren. Test für den Tageswechsel um Mitternacht. Test über die gesamte Inhaltsmatrix (Karte × Thema × Sprache). | Die Anforderungen PR-01 bis PR-08 funktionieren im normalen Ablauf. Unit- und E2E-Tests sind grün. | erledigt (Unit 63/63, E2E 19 bestanden / 25 bewusst übersprungen) |
| 4 · Nachweis | Browser-Screenshots, neue APK und Emulator-Lauf. Docs aktualisieren, G2-Bericht schreiben, Push und neuer Pages-Stand. | Der G2-Bericht steht mit Belegen auf PASS und der Play-Link zeigt den vollen Stand. | erledigt (siehe `GATE_REPORTS.md`) |

Nicht Teil von G2: Release-Build, TalkBack-Prüfung von Hand, PWA-Offline-Cache. Diese Punkte kommen in G3.
