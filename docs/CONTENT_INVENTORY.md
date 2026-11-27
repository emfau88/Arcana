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
| Fragebogen | 7 Fragen × 4 Antworten (V04.1, Version 2), jeder Typ mindestens 3× primär und 2× sekundär. Struktur in `core`, Texte im Modul `identity` (D-46, D-53) | 7 Fragen | 0 |
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

## Textmodule (V03/V04)

Texte außerhalb des Kerns liegen als Module in `src/content/modules/` und werden je Sprache bei Bedarf geladen (D-46). Jede Änderung erhöht die Version in `MODULE_VERSIONS` (`registry.ts`). `npm run validate:content` prüft jedes Modul gegen seine Regeln in `modules/validate.ts`.

| Modul | Version | Schlüssel je Sprache | Inhalt | Sichtbar in der App |
|---|---|---|---|---|
| `identity` | `identity-2026-11-27.2` | 211 | 7 Fragen und 28 Antworten des Fragebogens; 176 Linsen (8 Archetypen × 22 Karten, je ein Satz, V04.3) | ja (Fragebogen, Linse auf „Heute“ und im Grimoire) |
| `journey` | `journey-2026-11-27.1` | 96 | 63 Stationstexte (21 Stationen × 3 Lesarten Begegnung, Wiederkehr, Weisheit), 9 Pfadtexte, 4 Rundentexte, 20 Meilensteintexte (D-54). Keine Countdown- oder Druckformulierungen (Validator) | nein, noch keine Oberfläche (V04.4 Logik und Texte) |

## Was automatisch geprüft wird

- **Validator (`npm run validate:content`):** Vollständigkeit in DE und EN, Satzzahl (2–4 Sätze je Botschaft), keine Platzhalter, eindeutige IDs, Reihenfolge 0–21, verbotene Begriffe (Vorhersage, Heil- oder Finanzversprechen) und typische Aussagen über Gedanken oder Gefühle anderer. Außerdem muss es für jede `assetId` ein gerendertes Bild geben.
- **Rituale:** Keine Kerzen, kein Feuer, keine Substanzen, kein körperliches Risiko. Das wurde beim Schreiben beachtet und per Stichwortsuche geprüft (0 Treffer), aber nicht vom Validator.
- **Unit-Test `content-matrix`:** jede Karte × jedes Thema × jede Sprache ergibt eine vollständige Tageskarte, die Archetyp-Linse funktioniert für alle 8 Typen, jede Karte funktioniert in jeder Position, die 6 Thementexte einer Karte sind alle verschieden.

## Hinweise für die spätere Redaktion

- XIII (Tod) und XV (Teufel) sind bewusst ruhig und nicht beängstigend formuliert. Bei einer Überarbeitung so lassen.
- Die Texte sind eigene Arbeit und automatisch geprüft. Ein menschlicher Lektoratsdurchgang (Ton, Rhythmus) ist vor dem Release sinnvoll und steht im Backlog.
