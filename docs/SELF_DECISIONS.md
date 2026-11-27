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
| S-17 | 27.11.2026 | Neue V04-Screens als Vorschlag | aus vorhandenen Bausteinen und B2-Bildern, Enthüllung 4,3 s in vier Schritten | D-57, V04.2–V04.7 |
| S-18 | 27.11.2026 | Einstellungen auf „Ich“ | eigene Unterseite `#/me/settings` | V04.6 |
| S-19 | 27.11.2026 | Neue Screens laden | bei Bedarf, Texte in eigener Datei, im Leerlauf vorgeladen | V04, Start-JS |
| S-20 | 27.11.2026 | Wann der Meilenstein-Moment erscheint | einmal, auf „Heute“ nach der Karte, nur wenn etwas Gebautes aufgeht | V04.4 |
| S-21 | 27.11.2026 | Resonanzkarten im Profil | alle Bilder sichtbar, Kartenseite erst nach der Begegnung | V04.2, Leitplanken |
| S-22 | 27.11.2026 | Jubiläen und Hundert-Tage-Rückblick | eigener Bereich, noch nicht gebaut, kein Hinweis darauf | V04.5 |
| S-23 | 27.11.2026 | Lesbarkeit über A05 (Lichtsäule) | Halo, helleres Gold, abgedunkelte Bühne für „Warum?“ und Teilen, Schleier unten | V04.6, D-49 |
| S-24 | 27.11.2026 | Vorschau des Teilen-Bildes | Data-URL statt Blob-URL, CSP bleibt streng | V04.7 |
| S-25 | 27.11.2026 | Zurück über zwei Ebenen | Herkunft der Herkunft einmal im Link | V04 |
| S-26 | 27.11.2026 | Notizen im Rückblick | als Zitat im Text statt eigener Abschnitt, kurze Daten unter den Karten | V04.5 |
| S-27 | 27.11.2026 | A06 hinter Willkommen und Fragen | abgedunkelt wie die ruhigen Screens | V04.6 |
| S-28 | 27.11.2026 | Bildvergleich der Teilen-Karte | Feed-Karte auf ein Viertel verkleinert, je Sprache eine Referenz | V04.7 |
| S-30 | 27.11.2026 | PNG-Kodierung der Teilen-Karte (B-14) | in einem kleinen Worker statt `toBlob` auf dem Hauptthread; `toBlob` als Rückfall | V04.7 |
| S-31 | 27.11.2026 | Bildschirmwechsel zur Enthüllung (B-13) | Schrift, Raum A05 und Porträts schon auf dem Themenschritt laden; Favicon nicht angefasst | V04.2 |

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
- [ ] **Neue V04-Screens** als Ganzes (S-17): `visual/evidence/v04-identitaet-de-412.webp` (Enthüllung, „Ich“, „Warum?“, Bibliothek, Profil), `v04-reise-teilen-de-412.webp` (Sternkarte, Rückblick, Kapitel, Teilen) und `v04-screens-en-360.webp`
- [ ] Takt der Enthüllung: Porträt, Name nach 0,9 s, Satz nach 1,5 s, zweite Stimme nach 2,7 s, Rest nach 3,5 s (S-17)
- [ ] Abgedunkelte Bühne A05 bei „Warum?“ und Teilen, Schleier unten bei „Ich“ (S-23)
- [ ] A06 abgedunkelt hinter Willkommen und Fragen; Alternative „Buch als Bühne“ (S-27)
- [x] **B-07 wählen:** Eigentümer hat B gewählt (27.11.2026, D-59), eingebaut
- [ ] Meilenstein-Moment auf „Heute“ (Gestaltung und Zeitpunkt, S-20)
- [ ] Eigene Notizen als Zitat im Rückblick-Text (S-26)

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

## S-17 · Neue V04-Screens als Vorschlag

**Entschieden:** Enthüllung, „Ich“, „Warum?“, Bibliothek der acht Archetypen, Profilseite, Sternkarte, Rückblick, Kapitel, Meilenstein-Moment und Teilen entstehen ausschließlich aus vorhandenen Bausteinen (Panel, Messing-Panel, Flank, Ghost- und Quiet-Button, Kartenraster, Chips) auf den B2-Bildern. Die Enthüllung läuft in Schritten: Porträt sofort, Name nach 0,9 s, Enthüllungssatz nach 1,5 s, zweite Stimme nach 2,7 s, Erklärung und Knopf nach 3,5 s; nach 4,3 s steht alles. „Überspringen“ zeigt sofort alles, reduzierte Bewegung zeigt es ohne Animation (E2E: Knopf nach höchstens 800 ms sichtbar). Die Bibliothek zeigt die acht in fester Reihenfolge, der eigene Archetyp und die zweite Stimme tragen einen Chip.

**Warum:** D-57: Gestaltung wird an echten Screens entschieden. Neue Bausteine hätten zuerst ein eigenes Muster gebraucht.

**Alternativen:** Enthüllung in einem Schritt (schneller, aber ohne Moment); längerer Takt bis 8 s (Grenze aus V04.2, wirkt beim zweiten Ansehen zäh); Bibliothek mit dem eigenen Archetyp zuerst (persönlicher, aber die Reihenfolge springt je Person).

**Wechsel kostet:** Der Takt ist eine Konstante (`REVEAL_STEPS` in `Onboarding.tsx`), die Reihenfolge eine Zeile in `Identity.tsx`. Gestaltung je Screen in der zugehörigen CSS-Datei.

## S-18 · Einstellungen auf „Ich“

**Entschieden:** Sprache, Bewegung, Datenschutz (mit „Alle Daten löschen“) und Info liegen auf einer eigenen Unterseite `#/me/settings`, erreichbar über „Einstellungen“ unten auf „Ich“. „Ich“ zeigt nur noch Identität: Archetyp, zweite Stimme, Wahl von Hand, Profil, Bibliothek, Teilen.

**Warum:** „Ich“ wird mit der zweiten Säule (V06: Zahlen) lang; Einstellungen dazwischen würden das Profil zerteilen.

**Alternativen:** Einstellungen unten auf „Ich“ wie bis 0.3 (ein Tipp weniger); eigener Tab (die Tab-Leiste hat vier Plätze).

**Wechsel kostet:** eine Route und eine Zeile; die Einstellungen sind ein eigener Baustein.

## S-19 · Neue Screens laden

**Entschieden:** Alle neuen Screens sind eigene Chunks (`React.lazy`), ihre Texte liegen in `src/i18n/screens.de.ts` und `screens.en.ts` statt im Start-Bundle. Nach dem Start lädt die App im Leerlauf alle Screens und das Modul `archetypes` vor, damit die Enthüllung auch offline vollständig ist. Start-JS 139,1 kB (V03: 132 kB, Schrittbudget +8 kB, Grenze 160 kB).

**Warum:** Ohne Aufteilung läge das Start-JS über dem Schrittbudget.

**Alternativen:** alles im Start-Bundle (einfacher, ≈ 25 kB mehr); Screen-Texte im Content-Modul (einheitlicher, aber es sind Oberflächentexte, keine Inhalte); kein Vorladen (spart Daten, aber offline fehlen Screens).

**Wechsel kostet:** je Screen eine Importzeile in `App.tsx`.

## S-20 · Wann der Meilenstein-Moment erscheint

**Entschieden:** Der Moment steht auf „Heute“ unter der aufgedeckten Karte, nur an dem Reisetag, an dem ein Meilenstein erreicht wird, nur wenn dieser Meilenstein etwas öffnet, das es in der App schon gibt (Kapitel, Rückblick, Sternbild), und nur einmal (Gesehen-Markierung). Er nennt, was aufgegangen ist; „Ansehen“ führt zur Reise, „Schön“ schließt ihn. „Neu“ im Grimoire bleibt, bis der Eintrag geöffnet wurde.

**Warum:** Ein Moment ohne gebautes Ziel wäre eine Ankündigung (D-54). Vor der Karte würde er das Tagesritual unterbrechen.

**Alternativen:** eigenes Overlay (stärker, aber unterbricht); nur „Neu“ im Grimoire (leiser, aber Meilensteine gehen unter); an Folgetagen zeigen, bis gesehen (verlässlicher, aber nach Pausen gestapelt).

**Wechsel kostet:** eine Funktion (`milestoneMoment` in `src/domain/unlocks.ts`).

## S-21 · Resonanzkarten im Profil

**Entschieden:** Die drei Resonanzkarten eines Archetyps zeigen immer Bild und Namen, auch wenn die Person die Karte noch nicht gezogen hat. Die Kartenseite öffnet sich erst nach der ersten Begegnung, wie überall im Grimoire.

**Warum:** Wissen wird nie gesperrt (Leitplanken); das Profil soll vollständig lesbar sein. Die Kartenseite gehört zur eigenen Sammlung.

**Alternativen:** unbekannte Karten verdeckt zeigen (wirkt wie eine Sperre); Kartenseite immer öffnen (die Sammlung verliert ihre Bedeutung).

**Wechsel kostet:** eine Bedingung in `Identity.tsx`.

## S-22 · Jubiläen und Hundert-Tage-Rückblick

**Entschieden:** Hundert-Tage- und Jubiläums-Rückblicke, Jahrbuch und das Sternbild „Hundert“ bilden einen eigenen Bereich (`jubilees`), der noch nicht gebaut ist. Hinweise verweisen nur auf gebaute Bereiche, bis dahin also nicht darauf. Gebaut sind Kapitel, Wochen- und Monatsrückblick und die Sternkarte.

**Warum:** V04.5 verlangt Woche und Monat. Ein gemeinsamer Bereich „Rückblicke“ hätte Hinweise auf noch fehlende Jubiläen ausgelöst.

**Alternativen:** Jubiläen jetzt mitbauen (Texte und Gestaltung ohne Auftrag); gemeinsamer Bereich mit Ausnahme im Code (unübersichtlich).

**Wechsel kostet:** ein Eintrag in `BUILD_FEATURES` (`src/domain/hints.ts`), sobald die Ansicht steht (BACKLOG).

## S-23 · Lesbarkeit über A05 (Lichtsäule)

**Entschieden:** A05 hat in der Mitte eine helle Lichtsäule. Damit jeder Lesetext 4,5:1 erreicht, gilt auf „Ich“, der Enthüllung und der Profilseite: Schrift-Halo für Überschriften, Augenbrauen und freistehenden Text; Augenbrauen und freistehende Beschriftungen im helleren Gold (wie auf der Karte von „Heute“, ebenso auf A06); freistehender Kleintext in Hellgrau statt Grau; Ghost-Knöpfe mit dunklerer Füllung; ein Schleier, der A05 nach unten abdunkelt. „Warum?“ und Teilen zeigen A05 abgedunkelt (Szene `profile-calm`, wie die ruhigen Screens). Der Hinweis vor der Archetyp-Wahl steht in der Textfarbe statt in Grau, weil er beim Aufklappen genau vor der Lichtsäule liegt.

**Warum:** Messung mit `scripts/evidence.mjs --contrast` (360/390/412 px, DE/EN, 130 % Schrift). Der Halo allein reichte nicht.

**Alternativen:** A05 überall abdunkeln (sicher, aber das Licht verschwindet); Texte auf Panels legen (lesbar, aber schwer); Bildausschnitt verschieben, damit die Säule seitlich liegt (verliert die Mitte des Bildes).

**Wechsel kostet:** CSS in `screens.css` und `world.css`, keine Logik.

## S-24 · Vorschau des Teilen-Bildes

**Entschieden:** Die Vorschau zeigt das gerenderte PNG als Data-URL. Die CSP bleibt bei `img-src 'self' data:`.

**Warum:** Eine Blob-URL wird von der strengen CSP blockiert.

**Alternativen:** `blob:` in der CSP erlauben (öffnet die Richtlinie für alle Bilder); Vorschau als Canvas im DOM (zweiter Zeichenweg).

**Wechsel kostet:** eine Funktion in `SharePreview.tsx`.

## S-25 · Zurück über zwei Ebenen

**Entschieden:** Ein `from` im Link darf selbst einmal ein `from` tragen (URL-kodiert), z. B. Ich → Bibliothek → Archetyp → Zurück → Zurück → Ich. Tiefer geht es nicht; `isSafeFrom` prüft Pfad und inneres `from`.

**Warum:** Der zweite Zurück-Schritt landete sonst im Grimoire statt auf „Ich“ (im E2E gefunden).

**Alternativen:** Browser-Verlauf (`history.back`, nach Neuladen oder Deep Link nicht deterministisch); Stapel im Speicher (geht beim Neuladen verloren).

**Wechsel kostet:** `originOf` und `isSafeFrom` in `src/app/router.ts`; Unit-Test vorhanden.

## S-26 · Notizen im Rückblick

**Entschieden:** Eigene Notizen stehen als Zitat direkt nach dem Satz, der sie ankündigt, nicht in einem eigenen Abschnitt am Ende. Unter den Karten steht ein kurzes Datum (z. B. „21. Nov.“).

**Warum:** Der ankündigende Satz stand sonst weit von den Notizen entfernt.

**Alternativen:** eigener Abschnitt „Deine Worte“ (klarer getrennt); keine Daten unter den Karten (ruhiger).

**Wechsel kostet:** Markup in `JourneyScreens.tsx`.

## S-27 · A06 hinter Willkommen und Fragen

**Entschieden:** A06 (das leuchtende Buch) wird hinter Willkommen, Fragen und Themenwahl abgedunkelt wie die ruhigen Screens. Das Buch bleibt sichtbar.

**Warum:** Ohne Abdunkelung liegen Überschrift und Themenliste über dem hellsten Teil des Bildes; der Kontrast fiel unter 4,5:1.

**Alternativen:** „Buch als Bühne“: Titel in die obere Hälfte, Fächer der Karten weglassen (zeigt A06 voll, aber eigener Umbau); Nachtwelt A01 wie bisher (kein neues Bild); Texte auf Panels.

**Wechsel kostet:** eine Zeile in `world.css`; „Buch als Bühne“ wäre ein eigener Umbau des Willkommens.

## S-28 · Bildvergleich der Teilen-Karte

**Entschieden:** Der Bildvergleichstest (V04.7) verkleinert die Feed-Karte im selben Browser auf ein Viertel (270 × 338) und vergleicht sie mit einer Referenz je Sprache (höchstens 1 % abweichende Pixel). Die Referenzen liegen unter `tests/e2e/identity.spec.ts-snapshots/` und gelten für Chromium unter Windows.

**Warum:** Volle Größe wären ≈ 1,5 MB je Referenz im öffentlichen Repo; ein Viertel zeigt Layoutfehler (Umbruch, Lage, Farben) genauso.

**Alternativen:** volle Größe (genauer, aber groß); Prüfsumme der Pixel (bricht bei jeder Glättungsänderung); nur Layoutmaße aus dem Renderer (schon als Unit-Test vorhanden, sieht aber keine Bildfehler).

**Wechsel kostet:** ein Aufruf in `identity.spec.ts`; neue Referenzen mit `--update-snapshots`.

## S-30 · PNG-Kodierung der Teilen-Karte im Worker (B-14)

**Entschieden:** Die Karte wird wie bisher auf dem Hauptthread gezeichnet. Das fertige Bild geht als `ImageBitmap` an einen Worker (`src/share/encode.worker.ts`, 0,35 kB), der es 1:1 auf ein `OffscreenCanvas` gleicher Größe zeichnet und mit `convertToBlob` als PNG kodiert. Fehlen Worker, `OffscreenCanvas` oder `createImageBitmap`, oder scheitert der Worker, kodiert wie bisher `toBlob`.

**Warum:** Der Trace zeigte: Die Karte war nach ≈ 0,5 s gezeichnet, danach war der Hauptthread frei und es entstand kein Frame. Chromium kodiert `toBlob` auf dem Hauptthread nur in Leerlaufphasen, die an Frames hängen; ohne sie greifen feste Fristen (Android: 4 s bis zum erzwungenen Start, 9 s bis zum Abschluss), daher die ≈ 13,3 s. In einem Worker kodiert Chromium sofort. Nachher 230–299 ms im Ablauf, der vorher 13,2–13,5 s brauchte; alle 7 Läufe ≤ 1,5 s. Das Bild bleibt gleich (Bildvergleich im E2E); der Hauptthread wird zusätzlich entlastet.

**Alternativen:** während der Kodierung Frames erzwingen (`requestAnimationFrame`-Schleife, damit Leerlaufphasen entstehen; hängt an Interna des Schedulers); WebP statt PNG (wird ohnehin im Worker kodiert, ändert aber das Dateiformat beim Teilen); eigener PNG-Kodierer in JavaScript (mehr Code und Startgewicht).

**Wechsel kostet:** eine Funktion in `src/share/render.ts`.

## S-31 · Bildschirmwechsel zur Enthüllung (B-13)

**Entschieden:** Auf dem letzten Fragebogenschritt (Thema) lädt die App im Leerlauf, was die Enthüllung braucht: die kursive Serifenschrift, den Raum A05 in der passenden Größe und die Porträts des voraussichtlichen Haupt- und Ergänzungs-Archetyps (`src/ui/warm.ts`, `warmWorld`). Auf dem Bildschirm ändert sich nichts.

**Warum:** Trace und Versuche auf dem kalt gestarteten Emulator: Der Hauptthread ist beim Wechsel fast frei, der GPU-Thread rastert in Schritten zu 15–21 ms. Beim Tippen begannen erst Schrift, Raum und Porträt zu laden. Vorladen nahm den zweiten langen Frame weg (3 von 3 Läufen, nachher 7 von 7 Läufen mit 56,6–58,8 fps, meist 1 statt 2 lange Frames). Einzelne Ebenen auszublenden (Animation, Vektorlandschaft, Schrift-Halos, Bild, Porträt) änderte nichts; der verbleibende Frame beim Wechsel (117–183 ms) tritt auch beim Tab-Wechsel auf „Heute“ (167–233 ms) und „Grimoire“ (100–117 ms) auf und gehört zum Emulator. Die Grenze ≤ 120 ms aus §6 gilt unter den Referenzbedingungen (Playwright, 4× CPU-Drosselung), für den Emulator verlangt V04.2 ≥ 50 fps.

**Nicht übernommen:** Im Android-WebView wird `favicon.svg` bei jeder Navigation neu geholt und als SVG-Dokument gelesen (38–54 ms Hauptthread). Das Entfernen brachte in 3 Läufen keine messbare Besserung, daher bleibt es (BACKLOG, Prüfung auf echtem Gerät in V07.5).

**Alternativen:** Inhalte der Enthüllung erst kurz vor ihrem Moment einhängen (mehr Umbau, Wirkung unklar, weil schon das Ausblenden einzelner Ebenen nichts änderte); sichtbare Abstriche (weniger Ebenen, kein Halo), nur nach Rückfrage; nichts tun und auf dem echten Gerät messen.

**Wechsel kostet:** ein Effekt im Fragebogen.
