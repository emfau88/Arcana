# SELF_DECISIONS · Selbst entschiedene Punkte mit Alternativen

Seit 27.11.2026 entscheidet der Agent offene Punkte innerhalb des Auftrags selbst (D-56). Hier steht je Punkt, was entschieden wurde, warum, welche Alternativen es gab und was ein späterer Wechsel kostet. So lässt sich rückblickend gezielt prüfen und ändern.

**Auftrag 27.11.2026 (D-57):** V04 im Alleingang fertigstellen, danach V05. Neue Screens entstehen als Vorschlag; der Eigentümer prüft sie gesammelt zusammen mit der Prüfliste unten.

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
| S-11 | 27.11.2026 | Linse an Ergänzungstagen und Hinweise | jeder dritte Reisetag, beim Ziehen festgelegt; Hinweise nur für vorhandene Inhalte | V04.3 |
| S-12 | 27.11.2026 | Karten je Archetyp (Resonanz) | jede Karte zugeordnet, nur Tod und Stern doppelt | V04.2, CONTENT_MASTERPLAN §4 |
| S-13 | 27.11.2026 | Wo Profile und Kapitel liegen | zwei eigene Module, bei Bedarf geladen | V04.2, V04.5 |
| S-14 | 27.11.2026 | Aufbau der Rückblicke | über Reisetage, ruhiger Satz bei weniger als zwei Karten, keine Rückblick-Legung vor V05 | V04.5 |
| S-15 | 27.11.2026 | Edition-Texte (Spannungen, Beziehungsmuster, Ritualreihe) | noch nicht geschrieben | V04.2, AGENTS.md |
| S-16 | 27.11.2026 | Teilen in der Android-App | Bild in den App-Cache schreiben, dann Capacitor Share | V04.7 |

## Nachprüfen (Prüfliste für den Eigentümer)

Was nach dem Alleingang auf jeden Fall angesehen werden sollte. Abgehakt wird erst nach der Durchsicht.

- [ ] Angebot „Drei neue Fragen“ im Profil (`visual/evidence/v04-angebot-profil-360.webp`, S-05)
- [ ] Ton der Reisetexte, Stichprobe: Stationen 1, 13, 21 in allen drei Lesarten und Meilenstein Tag 7 (`src/content/modules/journey.de.ts`, S-02)
- [ ] Linsen, Stichprobe von 10: Suchende × Narr, Hütende × Turm, Sehende × Stern, Verwandelnde × Tod, Wandernde × Wagen, Schaffende × Herrscherin, Weise × Eremit, Erneuernde × Gericht, Suchende × Teufel, Hütende × Mond (`src/content/modules/identity-lens.de.ts`, S-11)
- [ ] Überschrift an Ergänzungstagen „Durch die Linse deiner zweiten Stimme“ (S-11)
- [ ] **Schaufenster-Texte vollständig** (CONTENT_MASTERPLAN §8): acht Archetyp-Beschreibungen und Enthüllungssätze (`src/content/modules/archetypes.de.ts`)
- [ ] Neue Kartenzuordnung je Archetyp (Sehende mit Glücksrad, Hütende mit Herrscher, Verwandelnde mit Teufel, Wandernde mit Liebenden, Weise mit Gehängtem; S-12)
- [ ] Kapitel, Stichprobe: Suchende I, Hütende III, Weise IV, Erneuernde „Zwei Stimmen“ (`src/content/modules/chapters.de.ts`)
- [ ] Rückblick-Bausteine, besonders der Ton bei vielen Schattenkarten (`review.balance.shadow.*` in `journey.de.ts`, S-14)

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

## S-11 · Linse an Ergänzungstagen und Hinweise

**Entschieden:** Mit Ergänzungs-Archetyp spricht an jedem dritten Reisetag (3, 6, 9 …) die Ergänzung (`COMPLEMENT_LENS_EVERY` in `src/domain/lens.ts`). Die Wahl fällt beim Aufdecken und wird mit der Tageskarte gespeichert (Varianten-Index, Ergänzung), damit eine spätere Profiländerung frühere Tage nicht umschreibt (D-09). Die Überschrift lautet dann „Durch die Linse deiner zweiten Stimme“, das Siegel zeigt die Ergänzung. Fehlt der Modultext, erscheint die allgemeine Linse des Archetyps statt eines leeren Felds. Hinweise (A6) zeigen nur auf Bereiche, die der Build wirklich enthält (`BUILD_FEATURES` in `src/domain/hints.ts`, wächst mit jedem Paket).

**Alternativen:** Ergänzung nach Kalendertag statt Reisetag (springt bei Pausen, wirkt zufällig); jeden zweiten Tag (die Hauptstimme träte zu oft zurück); beide Linsen jeden Tag untereinander (mehr Text auf „Heute“, sichtbare Änderung). Hinweise für alles aus der Tabelle (würde auf noch leere Seiten zeigen).

**Wechsel kostet:** eine Konstante; gespeicherte Tage behalten ihre Linse. Die Überschrift ist ein Text in `src/i18n/`.

## S-12 · Karten je Archetyp (Resonanz)

**Entschieden:** Der Vorschlag aus CONTENT_MASTERPLAN §4 wurde geändert: Sehende bekommen das Glücksrad statt des Sterns, Hütende den Herrscher statt der Herrscherin, Verwandelnde den Teufel statt des Magiers, Wandernde die Liebenden statt des Narren, Weise den Gehängten statt des Eremiten. Jetzt gehört jede der 22 Karten zu einem Archetyp, nur Tod (Verwandelnde, Erneuernde) und Stern (Suchende, Erneuernde) zu zweien (`src/content/resonance.ts`).

**Warum:** Im Vorschlag kam der Stern dreimal vor, fünf Karten nie (Herrscher, Liebende, Glücksrad, Gehängter, Teufel). Der „Sanfte Spiegel“ (C9, 1.2) zählt die Archetypen der gezogenen Karten; mit der alten Liste hätte er Suchende, Sehende und Erneuernde bevorzugt. Die neuen Karten passen zum Bild der Archetypen (Muster und Kreisläufe, schützende Ordnung, lösbare Bindungen, Wahl am Scheideweg, neuer Blickwinkel).

**Alternativen:** Vorschlag unverändert lassen (einfacher, aber unausgewogen); 22 Karten ohne Doppelung auf 8 × 3 Plätze (geht rechnerisch nicht ohne zwei Doppelungen); vier Karten je Archetyp (mehr Text, keine Vorgabe dafür).

**Wechsel kostet:** eine Zeile in `resonance.ts` und der Satz mit den Karten in der Beschreibung (DE/EN); ein Unit-Test prüft, dass die Beschreibung ihre Karten nennt.

## S-13 · Wo Profile und Kapitel liegen

**Entschieden:** Ausführliche Profile im Modul `archetypes`, Kapitel im Modul `chapters`, beide bei Bedarf geladen. Das Startmodul `identity` enthält weiter nur Fragebogen und Linsen.

**Warum:** Die Kapitel sind lang (≈ 40 kB roh je Sprache) und werden nur im Grimoire gelesen. Im Startmodul würden sie jeden Start belasten, auch den ersten.

**Alternativen:** alles in `identity` wie in CONTENT_MASTERPLAN §1 skizziert (ein Modul weniger, aber Start ≈ 25 kB gz mehr); Kapitel je Archetyp einzeln (kleinste Ladung, aber 16 Dateien und mehr Verwaltung).

**Wechsel kostet:** Schlüssel bleiben gleich, nur der Eintrag in `registry.ts` und der Ladeort ändern sich.

## S-14 · Aufbau der Rückblicke

**Entschieden:** Ein Rückblick deckt Reisetage ab (Woche = 7, Monat = 30 Tage mit Nutzung), nicht Kalendertage. Sätze kommen aus 40 Bausteinen, deterministisch nach Nummer des Rückblicks gewählt. Mit weniger als zwei Tageskarten gibt es statt Thema und Balance einen ruhigen Satz („Auch Stille gehört zur Reise“). Höchstens zwei eigene Notizen, die neuesten. Die Rückblick-Legung (Angebot aus PROGRESSION_DESIGN §7) kommt erst mit den Legungen in V05; bis dahin wird nicht auf sie hingewiesen.

**Alternativen:** Kalenderwochen (würden nach Pausen leere oder halbe Rückblicke zeigen); Satzwahl per Zufall (nicht reproduzierbar); Balance als Zahlen („3 lichte, 3 dämmrige, 1 schattige“) statt als Satz (genauer, aber in DE schwierig zu beugen; die Zahlen kann die Oberfläche zusätzlich zeigen).

**Wechsel kostet:** Bausteine sind Texte im Modul, die Auswahl eine Funktion in `src/domain/review.ts`.

## S-15 · Edition-Texte

**Entschieden:** Innere Spannungen, Beziehungsmuster und die Ritualreihe (C5, Edition) werden noch nicht geschrieben.

**Warum:** Ohne freigegebenes Billing werden Edition-Inhalte nicht angezeigt (AGENTS.md, keine Attrappen). Ungenutzte Texte würden veralten und das Lektorat doppelt belasten.

**Alternative:** jetzt schreiben und versteckt mitliefern (fertig, wenn Billing kommt, aber Lektorat und Gate für unsichtbaren Text).

**Wechsel kostet:** etwa 40 Texte je Sprache, sobald V07 (Billing) freigegeben ist.

## S-16 · Teilen in der Android-App

**Entschieden:** Die App schreibt das fertige Bild mit `@capacitor/filesystem` in ihren Cache und übergibt die Datei an `@capacitor/share` (System-Teilen-Blatt). Im Browser wird Web Share mit Datei genutzt, sonst ein Download. Beide Plugins sind offizielle Capacitor-Pakete (MIT), ohne Laufzeitdienst, ohne Konto und ohne Kosten; nichts verlässt das Gerät, solange die Person kein Ziel wählt.

**Warum:** Die Android-WebView kennt kein Web Share, und Capacitor Share nimmt Dateien nur als Pfad an, nicht als Data-URL. Ein Download in der WebView landet nicht verlässlich in der Galerie.

**Alternativen:** nur Download (in der App unzuverlässig, kein Teilen-Blatt); Bild als Data-URL an Share (vom Plugin nicht unterstützt); eigenes natives Plugin (mehr Code, gleiche Wirkung); Teilen nur im Browser (die App ist der Hauptweg).

**Wechsel kostet:** eine Funktion in `src/share/share.ts`; die Plugins lassen sich ohne Datenmigration entfernen.

