# CONTENT_INVENTORY

**Stand G2:** Die P0-Inhalte sind vollständig. `npm run validate:content` meldet in der P0-Stufe PASS (0 Fehler, 0 Warnungen).

| Bereich | Vorhanden | P0-Ziel | Fehlend |
|---|---|---|---|
| Karten (Haupt-Arkana 0–XXI, DE/EN) | 22 | 22 | 0 |
| Themen (Label, Beschreibung, Reading-Einleitung) | 6 | 6 | 0 |
| Karte×Thema-Botschaften | 132 je Sprache (22 × 6) | 132 | 0 |
| Positionsimpulse (Situation / Herausforderung / Impuls) | 66 je Sprache (22 × 3) | 66 | 0 |
| Reflexionsfrage und Mini-Ritual je Karte | 22 + 22 je Sprache | 22 + 22 | 0 |
| Archetypen (Name, Essenz, Stärke, Schatten als Frage, Entwicklung, Reflexion, Linse) | 8 | 8 | 0 |
| Fragebogen | 4 Fragen × 4 Antworten, jeder Typ 2× primär, 2× sekundär | 4–6 Fragen | 0 (5./6. Frage optional) |
| Kartenillustrationen | 22 + Rückseite | 22 + Rückseite | 0 |

## Themen

| ID | DE | EN |
|---|---|---|
| self | Selbstentdeckung | Self-discovery |
| love | Liebe & Beziehungen | Love & relationships |
| career | Beruf & Lebensweg | Career & life path |
| change | Veränderung & Entscheidungen | Change & decisions |
| balance | Innere Balance | Inner balance |
| creativity | Kreativität & Wachstum | Creativity & growth |

## Karten

Alle 22 Karten haben: Titel, Essenz, Botschaft je Thema (2–4 Sätze, 6 Themen), 3 Positionsimpulse, Reflexionsfrage und Mini-Ritual, jeweils in DE und EN. Die Texte liegen in `src/content/cards.ts` (II, XVI, XIX) und `src/content/cards-a.ts`, `cards-b.ts`, `cards-c.ts` (übrige 19).

0 Der Narr · I Der Magier · II Die Hohepriesterin · III Die Herrscherin · IV Der Herrscher · V Der Hierophant · VI Die Liebenden · VII Der Wagen · VIII Die Kraft · IX Der Eremit · X Das Glücksrad · XI Die Gerechtigkeit · XII Der Gehängte · XIII Der Tod · XIV Die Mäßigkeit · XV Der Teufel · XVI Der Turm · XVII Der Stern · XVIII Der Mond · XIX Die Sonne · XX Das Gericht · XXI Die Welt

## Was automatisch geprüft wird

- **Validator (`npm run validate:content`):** Vollständigkeit in DE und EN, Satzzahl (2–4 Sätze je Botschaft), keine Platzhalter, eindeutige IDs, Reihenfolge 0–21, verbotene Begriffe (Vorhersage, Heil- oder Finanzversprechen) und typische Aussagen über Gedanken oder Gefühle anderer. Außerdem muss es für jede `assetId` ein gerendertes Bild geben.
- **Rituale:** Keine Kerzen, kein Feuer, keine Substanzen, kein körperliches Risiko. Das wurde beim Schreiben beachtet und per Stichwortsuche geprüft (0 Treffer), aber nicht vom Validator.
- **Unit-Test `content-matrix`:** jede Karte × jedes Thema × jede Sprache ergibt eine vollständige Tageskarte, die Archetyp-Linse funktioniert für alle 8 Typen, jede Karte funktioniert in jeder Position, die 6 Thementexte einer Karte sind alle verschieden.

## Hinweise für die spätere Redaktion

- XIII (Tod) und XV (Teufel) sind bewusst ruhig und nicht beängstigend formuliert. Bei einer Überarbeitung so lassen.
- Die Texte sind eigene Arbeit und automatisch geprüft. Ein menschlicher Lektoratsdurchgang (Ton, Rhythmus) ist vor dem Release sinnvoll und steht im Backlog.
