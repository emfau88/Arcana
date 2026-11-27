# SELF_DECISIONS · Selbst entschiedene Punkte mit Alternativen

Seit 27.11.2026 entscheidet der Agent offene Punkte innerhalb des Auftrags selbst (D-56). Hier steht je Punkt, was entschieden wurde, warum, welche Alternativen es gab und was ein späterer Wechsel kostet. So lässt sich rückblickend gezielt prüfen und ändern.

Nicht hier, sondern weiter beim Eigentümer: Veröffentlichung, Kosten, Billing, Store, Merge nach `main` und neue Screens mit eigener Gestaltung (zuerst ein Muster). Grundsätzliche Entscheidungen stehen in [DECISIONS.md](DECISIONS.md).

| ID | Datum | Thema | Entschieden | Bezug |
|---|---|---|---|---|
| S-01 | 27.11.2026 | Wann es einen Ergänzungs-Archetyp gibt | höchstens 1 Punkt Abstand, ab 4 Antworten | D-53, V04.1 |
| S-02 | 27.11.2026 | Aufbau und Ton der Reisetexte | drei Lesarten je Runde, 1–2 ruhige Sätze | D-54, V04.4 |
| S-03 | 27.11.2026 | Mehrere Meilensteine am selben Tag | genau ein Text, feste Rangfolge | D-54, V04.4 |
| S-04 | 27.11.2026 | Reihenfolge der neuen Fragen | hinten angehängt, die ersten vier unverändert | D-53, V04.1 |
| S-05 | 27.11.2026 | Angebot an Bestandsnutzer | Panel im Profil, „Nicht jetzt“ blendet es dauerhaft aus | D-53, E9 |
| S-06 | 27.11.2026 | Ergänzung bei Wahl von Hand | bleibt, außer sie wird Hauptarchetyp | D-53 |
| S-07 | 27.11.2026 | Prüfung „Fragebogen ≤ 75 s“ | gemessene App-Zeit plus 7 × 8 s Lesezeit | V04.1 |
| S-08 | 27.11.2026 | B2-Bilder vorbereiten | außerhalb von `public/`, Mastergröße, nicht hochskaliert | D-55 |
| S-09 | 27.11.2026 | Pull Requests zusammenführen | Merge-Commit statt Squash | D-56 |
| S-10 | 27.11.2026 | B-12 Kopfzeilen der Legung bei 130 % Schrift | in V05.2 mit der neuen Legung lösen | PROJECT_STATUS |

## S-01 · Ergänzungs-Archetyp

**Entschieden:** Der zweite Archetyp (gleiche Rangfolge wie beim Hauptarchetyp) wird Ergänzung, wenn er **höchstens 1 Punkt** hinter dem Hauptarchetyp liegt und **mindestens 4 Fragen** beantwortet sind (`COMPLEMENT_MAX_GAP`, `MIN_ANSWERS_FOR_COMPLEMENT` in `src/domain/archetypes.ts`).

**Warum:** Jede Antwort gibt +2 und +1 Punkte, der Hauptarchetyp hat meist 5–8 Punkte. Eine Prozentschwelle ist darum nur ein versteckter Punktabstand und springt ungleichmäßig. Ein Punkt ist genau eine Zweitnennung, das lässt sich im „Warum?“ ehrlich erklären („liegt nur einen Punkt dahinter“). Mit zwei oder drei Antworten liegt fast alles nah beieinander, eine zweite Stimme wäre geraten.

**Zahlen** (`node --experimental-strip-types --no-warnings scripts/analyze-complement.ts`):

| Regel | mit Ergänzung (7 Antworten) | je Hauptarchetyp | bei 3 / 4 / 5 Antworten |
|---|---|---|---|
| **≤ 1 Punkt, ab 4 Antworten (gewählt)** | **65,6 %** | 61–68 % | 0 / 69 / 70 % |
| 75 % des Hauptwerts (erste Fassung) | 65,8 % | 62–68 % | 43 / 55 / 68 % |
| 60 % (Skizze in PRODUCT_SYSTEMS) | 86,8 % | 84–89 % | 75 / 76 / 85 % |
| ≤ 2 Punkte und zweimal erste Wahl | 56,6 % | 50–64 % | – |
| zwei Stufen (≤ 3 Punkte, davon 2–3 „leise Nebenstimme“) | 94,9 % | 93–96 % | – |
| immer den Zweiten zeigen | 100 % | 100 % | – |

Zielbereich laut Roadmap: 40–70 % mit Ergänzung. Alle Regeln erreichen alle 56 Paare.

**Alternativen:**

- **75 % des Hauptwerts:** bei sieben Antworten fast gleich, schwankt aber stark, wenn Fragen übersprungen werden, und ist schwerer zu erklären.
- **60 %:** fast jeder bekommt eine Ergänzung, sie sagt dann wenig aus.
- **Zwei Stufen (Ergänzung und „leise Nebenstimme“):** 95 % bekommen eine zweite Stimme, das Profil wird persönlicher. Braucht eigene Texte und Darstellung und schwächt den Hauptarchetyp. **Beste Option, falls sich Tester mehr Tiefe wünschen.**
- **Zweimal erste Wahl:** starke Bedeutung („du hast dich zweimal dafür entschieden“), aber ungleicher je Hauptarchetyp und zwei Bedingungen.
- **Immer den Zweiten:** einfach, aber auch bei klarem Profil eine Ergänzung, die nicht trägt.

**Wechsel kostet:** zwei Konstanten und die Tests in `tests/unit/archetypes.test.ts`; das Analyse-Skript zeigt die Wirkung sofort. Gespeicherte Profile behalten ihre Ergänzung (D-09); eine neue Regel wirkt erst beim nächsten Abschluss des Fragebogens.

## S-02 · Reisetexte

**Entschieden:** Je Station drei Lesarten nach Runde (1 Begegnung, 2 Wiederkehr, ab 3 Weisheit), ab Runde 4 die Weisheit-Texte. Je Text 1–2 ruhige Sätze in Du-Form, keine Vorhersage, keine Druck- oder Countdown-Wörter (Validator). Eigentümer 27.11.2026: Texte nach eigenem Ermessen, Feinschliff später.

**Alternativen:** eigene Texte für jede weitere Runde (mehr Abwechslung, ≈ 21 Texte je Runde und Sprache mehr); Stationstexte je Archetyp (persönlicher, achtmal so viele Texte); zufällige Variante statt fester Lesart (weniger vorhersehbar, aber nicht mehr reproduzierbar).

**Wechsel kostet:** Texte im Modul `journey` tauschen und die Modulversion erhöhen; die Logik bleibt. Lektorat steht im BACKLOG.

## S-03 · Meilensteine am selben Tag

**Entschieden:** Je Reisetag höchstens ein Meilensteintext, Rangfolge fester Meilenstein vor Jahr vor Jubiläum vor Monat vor Woche (`milestoneTextKey` in `src/domain/journey.ts`).

**Alternativen:** alle zutreffenden Texte nacheinander zeigen (vollständiger, aber laut); ein kombinierter Text (natürlicher, aber viele Kombinationen).

**Wechsel kostet:** eine Funktion und ihr Tabellen-Test.

## S-04 · Reihenfolge der neuen Fragen

**Entschieden:** Die drei neuen Fragen stehen hinter den ersten vier, deren IDs und Gewichte unverändert bleiben.

**Alternativen:** neu mischen (bessere Dramaturgie, aber gespeicherte Antworten verlören ihre Position und das Angebot müsste mitten im Fragebogen einsteigen).

**Wechsel kostet:** Reihenfolge in `src/content/questions.ts`; der Balance-Test prüft danach automatisch, ob die Verteilung noch stimmt.

## S-05 · Angebot an Bestandsnutzer

**Entschieden:** Ruhiges Panel „Drei neue Fragen“ im Profil, nur mit vorhandenen Bausteinen. „Nicht jetzt“ setzt eine Gesehen-Markierung, das Angebot kommt nicht wieder.

**Alternativen:** nach einiger Zeit noch einmal anbieten (mehr Antworten, aber näher an Druck); als einmaliger Tageshinweis auf „Heute“ über die Hinweis-Logik aus V04.3 (sichtbarer, braucht die Hinweis-Logik); dauerhaft kleiner Link im Profil statt Panel.

**Wechsel kostet:** `src/features/profile/Profile.tsx` und der Schlüssel `offer:questionnaire-v2`.

## S-06 · Ergänzung bei Wahl von Hand

**Entschieden:** Wer den Hauptarchetyp von Hand ändert, behält die Ergänzung aus dem Fragebogen, außer sie wird selbst Hauptarchetyp oder das Profil bleibt offen.

**Alternativen:** Ergänzung bei jeder Handwahl löschen (strenger); Ergänzung ebenfalls von Hand wählbar machen (mehr Kontrolle, eine Bedienung mehr).

**Wechsel kostet:** `setArchetype` in `src/app/store.tsx` und ein Unit-Test.

## S-07 · Prüfung „Fragebogen ≤ 75 s“

**Entschieden:** Der E2E-Test misst die echte App-Zeit für sieben Fragen und rechnet 7 × 8 s Lesezeit dazu (zuletzt 58,7 s).

**Alternative:** echte 8 s Wartezeit je Frage im Test (genauer am Wortlaut, aber jeder Lauf ≈ 1 Minute länger je Gerät).

**Wechsel kostet:** ein E2E-Test.

## S-08 · B2-Bilder

**Entschieden:** Export nach `art/b2/` außerhalb von `public/`, damit Web-Build und APK erst mit dem nutzenden Screen wachsen. Große Stufe in Mastergröße 1024 × 1536, nicht hochskaliert. A08 Hütende mit Qualität 0,88 statt 0,92 wegen des Budgets.

**Alternativen:** sofort nach `public/` (einfacher, aber größere App ohne Nutzen); größere Master anfordern.

**Offenes Risiko:** Die Teilen-Karte (V04.7, 1080 × 1920) ist breiter als die Master. Das Porträt wird dort leicht kleiner gesetzt oder um etwa 5 % hochskaliert. Bei sichtbarer Unschärfe größere Master anfordern.

**Wechsel kostet:** `scripts/export-art.mjs` erneut ausführen.

## S-09 · Pull Requests zusammenführen

**Entschieden:** Merge-Commit wie bei V02 (#2) und V03 (#3), danach Tag und `main` in den laufenden Paket-Branch mergen.

**Alternative:** Squash (kürzere Historie, aber gestapelte Branches müssten neu aufgesetzt werden).

**Wechsel kostet:** nichts für vergangene Merges; ab dem nächsten PR wählbar.

## S-10 · B-12 Kopfzeilen der Legung

**Entschieden:** Nicht jetzt beheben, sondern in V05.2 (Rollen-Legungen), wenn die Legung ohnehin neu gestaltet wird. Der Fehler ist kosmetisch (mittlere Karte 17 px tiefer, nur bei 130 % Schrift in DE).

**Alternative:** jetzt mit gemeinsamer Kopfzeile (CSS-Subgrid) beheben; ändert das Raster der Legung, und die Arbeit würde in V05 wahrscheinlich ersetzt.

**Wechsel kostet:** eine CSS-Änderung an der Legung plus Screenshot-Prüfung.
