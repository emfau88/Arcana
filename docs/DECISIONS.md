# DECISIONS

Format: ID · Entscheidung · Begründung · Status. Eigentümerentscheidungen sind markiert.

| ID | Entscheidung | Begründung | Status |
|---|---|---|---|
| D-01 | Web-first-Neubau in einem eigenen Root, kein Umbau von Heartvia | Eigentümerentscheidung, endgültig | fest (Eigentümer) |
| D-02 | Vite 8 + React 19 + TypeScript 5.9 strict | React erleichtert den zustandsreichen Reveal-/Grimoire-Flow. TS 5.9 ist mit typescript-eslint kompatibel. | fest |
| D-03 | Exakte Versionspins (kein `^`), Lockfile versioniert | Reproduzierbarer Build | fest |
| D-04 | Hash-Routing (`#/today` …) und `base: './'` | Funktioniert identisch unter `file`-artigen WebView-Origins, auf GitHub Pages im Unterpfad und lokal, ohne Server-Rewrites | fest |
| D-05 | IndexedDB als einzige Persistenz (DB `personal-oracle`), kein localStorage | Transaktionen, atomares „Tageskarte nur einmal“ (`addDailyIfAbsent`), strikte Durability. Defekte Datensätze werden übersprungen, nicht gelöscht. | fest |
| D-06 | Uhr und Zufall injizierbar, lokaler Kalendertag als Schlüssel | Deterministische Tests für Datumsgrenzen und Ziehungen | fest |
| D-07 | Archetyp-Scoring: Primär +2, Sekundär +1. Ab 2 Antworten gibt es ein Ergebnis, sonst neutral. Tie-Break: a) mehr Primärtreffer, b) Primärtreffer in der frühesten Frage, c) kanonische Reihenfolge | Transparent, testbar (alle 256 Kombinationen, alle 8 Typen erreichbar) | fest |
| D-08 | Geschlechtsinklusive DE-Archetypnamen: Suchende, Hütende, Sehende, Verwandelnde, Wandernde, Schaffende, Weise, Erneuernde | Spec erlaubt sprachliche Optimierung in G1. Partizipform statt „-in“ | zur Freigabe |
| D-09 | Gespeicherte Deutungen sind unveränderlich und tragen eine Content-Version | PR-07: Profiländerungen ändern alte Readings nicht | fest |
| D-10 | Kartenkunst: eigene, prozedural erzeugte Illustrationen (`art/*.mjs` → WebP), keine fremden Bilder, keine KI-Bilder | Rechtssicher, konsistent, reproduzierbar | vorläufig freigegeben (Eigentümer, siehe D-22) |
| D-11 | Schriften Cormorant Garamond + Manrope lokal (Fontsource, OFL), nur latin + latin-ext | Kein CDN, kleineres Paket | fest |
| D-12 | Billing: P0 komplett kostenlos, kein Billing-SDK, nur Entitlement-Schnittstelle (`src/domain/entitlements.ts`) | Siehe Billing-Notiz unten | fest für P0 |
| D-13 | Strikte CSP (`default-src 'self'`) nur im Build injiziert | Keine externen Origins. Der Dev-Server bleibt HMR-fähig. | fest |
| D-14 | Capacitor 8.6 Android, dev-ID `com.energycrafted.personaloracle.dev`, App-Name „Arcana“ (Arbeitstitel) | Briefing. Finale ID und Name folgen in G4. | vorläufig (Eigentümer in G4) |
| D-15 | Android-Backup deaktiviert (`allowBackup=false`, Data-Extraction-Rules schließen alles aus) | Private Inhalte bleiben auf dem Gerät | fest |
| D-16 | Gradle-Wrapper auf den lokal vorhandenen Gradle 8.14, Build mit `--offline` | Keine Downloads oder globalen Installationen ohne Zustimmung. AGP 8.13 war im Cache. | fest für lokal |
| D-17 | SystemBars `insetsHandling: 'css'`, Safe-Area per `max(env(), --safe-area-inset-*)` | Der Emulator-WebView 133 liegt unter Capacitors Schwelle (140). Dort polstert Capacitor die Ränder nativ, neuere WebViews nutzen `env()`. | fest |
| D-18 | Android-Schriftskalierung: UI-Text skaliert mit, Karteninschriften kompensieren über `--text-zoom` | Lesbarkeit bleibt erhalten, ohne dass Kartentitel bei 200 % aus dem Rahmen laufen | fest |
| D-19 | Kartentitel passen sich per Längenklasse (`data-fit`) an | „THE HIGH PRIESTESS“ und lange DE-Titel ohne Abschneiden | fest |
| D-20 | GitHub-Pages-Preview des Prototyps | Eigentümer hat am 26.11.2026 den Push nach `emfau88/Arcana` und einen Play-Link für das Handy angefragt. Das ist eine Vorschau, kein Release. | genehmigt (Eigentümer) |
| D-21 | Starterpaket `docs/briefing/` nicht im öffentlichen Repo | Internes Strategiedokument. Es bleibt lokal und kann auf Wunsch ergänzt werden. | offen für Eigentümer |
| D-22 | G2 mit den Karten im bisherigen Stil abschließen. Die Kunst bleibt austauschbar (feste Dateinamen je `assetId`, Rahmenvorlage und Schutzzonen in `docs/assets/`, Regel in `ASSET_LICENSES.md`). Design-Feinschliff folgt später. | Eigentümer am 26.11.2026: Karten werden vermutlich später durch eigene Assets ersetzt, erst muss alles stehen und funktionieren | fest (Eigentümer) |
| D-23 | Archetyp im Profil selbst wählbar oder offen lassen. Das Profil merkt sich die Herkunft (`archetypeSource`: `questions` oder `manual`). Alte Profile ohne das Feld bleiben gültig, ein unbekannter Wert wird wie ein defekter Datensatz übersprungen. | PR-02 verlangt ein editierbares Profil. Wer sich im Ergebnis nicht wiederfindet, soll nicht erneut alle Fragen beantworten müssen. Keine Schema-Migration nötig. | fest |
| D-24 | Browser-Nachweis mit 130 % Schrift läuft auf dem Dev-Server (5180), nicht auf dem Produktions-Build | Die strikte CSP im Build blockiert das per Playwright eingefügte Test-Stylesheet. Das ist gewollt (D-13). DE 412 und EN Desktop laufen auf dem Produktions-Build. | fest |
| D-25 | Version 0.2.0 (Android versionCode 2) für den G2-Stand | Klarer Unterschied zum G1-Prototyp 0.1.0 bei Tests und Upgrade-Pfad | fest |

## Billing-Notiz (S05, technische Kurzrecherche)

Diese Einschätzung stammt aus Fachwissen. Ein Abgleich mit aktuellen offiziellen Quellen ist **NOT RUN** und Pflicht vor jeder Premium-Entscheidung (G5).

- Für Capacitor gibt es kein offizielles Play-Billing-Plugin. Optionen: ein Community-Plugin, ein eigenes kleines Capacitor-Plugin um die Play Billing Library oder ein Drittanbieter-SDK. Ein Drittanbieter-SDK bringt Abhängigkeit, Datenschutzfragen und eventuell Kosten mit sich.
- Kaufprüfung: Eine robuste Verifikation läuft normalerweise serverseitig. Das kollidiert mit „kein Backend“. Eine reine Client-Prüfung ist möglich, aber leichter zu umgehen.
- Store-Gebühren für digitale Inhalte fallen an (Höhe abhängig vom Programm, aktuell prüfen).
- Die Web-Version kann Play Billing nicht nutzen. Premium im Web bräuchte einen eigenen Zahlungsweg (nicht im Scope).
- Konsequenz: Die Entitlement-Schnittstelle ist so geschnitten, dass P0-Inhalte nie gesperrt sind. Billing ist ein separater, später genehmigter Auftrag.
