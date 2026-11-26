# MERGE_RECOMMENDATION · Branches und Asset-Integration (V00)

Stand: 26.11.2026, geprüft mit `git fetch --prune` gegen `github.com/emfau88/Arcana`.

## Befund: Die Ausgangslage im Auftrag ist überholt

Der Auftrag geht von zwei Branches aus (`main` und `assets/karten-v2`) und von einem offenen Überschreib-Risiko durch `npm run art`. Beides trifft nicht mehr zu:

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Remote-Branches | nur `main` | `git branch -a` zeigt `origin/main`, kein `origin/assets/karten-v2` mehr |
| `assets/karten-v2` (Codex, Commits `ecedb8d`, `1f8a047`) | am 26.11.2026 als Pull Request #1 per Squash in `main` übernommen | `main` = `03abb3c` „Deck v2: painted card art for all 22 cards and back“ |
| Korrekturen vor dem Merge | erledigt im Integrations-Commit `f2a2070` (im Squash enthalten) | heller Rahmen-Halo für 9 Karten, 9-MB-PNG durch 240-KB-WebP ersetzt, Doku D-26/D-27 |
| `npm run art` überschreibt Karten | **beseitigt** | `scripts/render-art.mjs` rendert Karten nur noch mit `--legacy-cards <Ordner>` und verweigert jedes Ziel unter `public/`. Gegenprobe: `npm run art` ausgeführt, `public/cards/card-fool.webp` blieb bitgleich (MD5 vorher = nachher) |
| Tests nach Integration | PASS | `npm run check` (63/63 Unit, Content-Gate P0, Build), E2E 19 bestanden / 25 bewusst übersprungen, Titelprüfung 44/44, Android-Lauf vollständig (Kaltstart unter Last: CHECK) |
| Live-Stand | Deck v2 auf GitHub Pages | ausgelieferte `card-fool.webp` = lokale Datei (MD5 `115e1e66…`) |
| Verlorene Arbeit | keine | Die Codex-Commits stecken vollständig im Squash-Commit. Das 9-MB-PNG ist bewusst nicht in der Historie von `main` |

Die Bewertungsspalte „Asset-Branch V2“ im Review beschreibt also den heutigen `main`.

## Empfehlung

1. **Kein weiterer Merge nötig.** `main` ist die Integrationsbasis mit Deck v2.
2. **Neuer Arbeitsbranch `design/visual-overhaul`** von `main` (lokal angelegt, nicht gepusht). Dort entstehen V01–V03.
3. **Merge nach `main` nur in freigegebenen Etappen**, weil `main` automatisch die öffentliche Vorschau baut:
   - nach V02 (Tagesorakel-Slice) als Vorschau nur, wenn der Eigentümer den Look freigibt,
   - sonst bleibt der Slice auf dem Branch, und Screenshots kommen als Nachweis.
4. **Optional:** Pages zusätzlich aus dem Design-Branch bauen, damit du am Handy testen kannst, ohne `main` zu ändern. Dafür bräuchte es eine Workflow-Änderung. Ich mache das nur auf deine Anweisung.

## Verbleibende technische Risiken (vor V02 klären)

| Risiko | Bewertung | Maßnahme |
|---|---|---|
| Kartenrahmen ist ins Bild eingebrannt | mittel: Ein neuer, ornamentaler Rahmen im Mockup-Stil erfordert einen Neuexport aller 23 Karten aus den PNG-Mastern | Die Master liegen nur im Codex-Cache (`%USERPROFILE%\.codex\generated_images\…\ARCANA-Karten-v2-Master.zip`). **Sicherung durch den Eigentümer ist Pflicht**, sonst ist ein Rahmenwechsel nur auf den 720-px-WebPs möglich (Qualitätsverlust) |
| Neue Hintergrundbilder kosten Ladezeit und Speicher | mittel | WebP, ≤ 350 KB pro Screen, `image-set` für zwei Größen, Vorladen nur für den Startscreen |
| Ambient-Animationen (Partikel, Glühen) | mittel: Das Briefing verbietet kontinuierliches Rendering im Idle | nur CSS-Animationen mit wenigen Elementen, nach 8–12 s pausieren bzw. nur bei Interaktion, komplett aus bei reduzierter Bewegung |
| Strikte CSP `default-src 'self'` | gering | Alle Assets lokal. Keine Inline-Styles von außen |
| Kaltstart Android zuletzt 3,8 s unter Rechnerlast | offen | Auf ruhigem Rechner nachmessen, bevor große Hintergründe dazukommen. Danach Messung mit Hintergründen |
| Speicher- und Datenmodell | gering | V01–V03 ändern nur Darstellung. Progression (V04) braucht ggf. neue IndexedDB-Felder. Abwärtskompatibel wie bei `archetypeSource` (D-23) |
