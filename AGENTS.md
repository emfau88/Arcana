# AGENTS.md — Personal Oracle

## Unverhandelbare Regeln

1. **Greenfield:** Nur im eindeutig genehmigten neuen Projektroot arbeiten. Mirror/Heartvia (`com.energycrafted.mirror`) bleibt unverändert, einschließlich Git, Builds, Daten, Signing und Store. Kein Schreiben in oder unter den Altpfad; keine Symlinks/Junctions zurück in den Altpfad. Keine Ausführung von Build-/Install-/Testbefehlen im alten Repo.
2. **Web-first:** TypeScript, Vite, HTML/CSS, bevorzugt React bei begründetem Bedarf; Capacitor Android früh integrieren. Kein Flutter-Neubau. Ein gemeinsamer Web-Code für Browser und gebündelte Android-App, keine externe Website im Wrapper.
3. Vor Implementierung `docs/briefing/00_START_HERE.md` bis `07_START_PROMPT.md` lesen (oder das übergebene Starterpaket, solange es noch nicht kopiert ist); deren Regeln gelten weiter. **Der Produktumfang kommt seit 26.11.2026 aus `docs/product/`** (Produktvision V2, siehe Abschnitt unten), nicht mehr aus der P0/P1/P2-Liste in `02_PRODUCT_SPEC.md`. Umgesetzt wird nur das vom Eigentümer freigegebene Paket aus `docs/product/MASTER_ROADMAP_V2.md`; keine spontanen Erweiterungen darüber hinaus.
4. G0 selbst abschließen, wenn sicher; G1 mit echtem Browser- und Android-Emulator-Flow liefern und auf ausdrückliche Designfreigabe warten. G2/G3 nach Freigabe selbst prüfen. Vor Upload, Veröffentlichung, Kosten oder Produktionsänderungen immer explizite Freigabe. Kein physisches Handy verwenden.
5. Kein Backend, keine Runtime-KI, kein Tracking, kein Pflichtkonto, keine CDN-Assets im Offline-Kern. Alle privaten Inhalte lokal. Keine Dark Patterns und keine behauptete Vorhersage/Diagnose.
6. Kleine überprüfbare Slices. Tests, echte Screenshots, Build-Artefakte und nachvollziehbare Reports. Kein Mockup als Funktionsbeleg. `PASS`, `FAIL`, `BLOCKED`, `NOT RUN` ehrlich unterscheiden. Niemals fremde Arbeit überschreiben, Tests kaschieren oder ungefragt pushen.
7. Aktualisiere `docs/PROJECT_STATUS.md` und `docs/DECISIONS.md` nach jedem Slice/Gate. Lies den Status bei einem neuen Agentenlauf zuerst. Wenn ein Gate blockiert ist, behebe es oder liefere die sichere verbleibende Arbeit; nicht stillschweigend weitergehen.

Wenn die Dateien noch nicht im neuen Repo liegen, kopiere sie ausschließlich in das neue Repo, nachdem der Pfad sicher verifiziert wurde. Die alte App ist keine Arbeitskopie und kein Fallback-Ziel.

## Produktvision V2 (verbindlich seit 26.11.2026)

ARCANA ist keine reine Tarot-App mehr, sondern eine persönliche spirituelle Erlebniswelt mit drei verbindenden Systemen: **Identität** (Archetypen, Zahlen), **Reise** (Narrenreise, Meilensteine ohne Streak-Druck) und **Grimoire** (ein Buch, das durch Nutzung wächst). Nicht auf den alten, kleineren Umfang zurückfallen und nicht eigenmächtig darüber hinausgehen.

Lesereihenfolge für Produktfragen:

| Dokument | Inhalt |
|---|---|
| `docs/product/PRODUCT_VISION_V2.md` | Vision, Leitplanken L1–L8, was gestrichen oder verschoben ist |
| `docs/product/MASTER_ROADMAP_V2.md` | Pakete V02–V07, Bulks mit „Fertig, wenn“, Release-Umfang 1.0, Gates, Budgets, offene Entscheidungen E8–E20 |
| `docs/product/PRODUCT_SYSTEMS.md` | Funktionen A–K mit Release-Zuordnung und Free/Edition |
| `docs/product/PROGRESSION_DESIGN.md` | Reise, Meilensteine, Kartenvertiefung |
| `docs/product/CONTENT_MASTERPLAN.md` | Module, Textmengen, Stimme, Rechenregeln, Verbotslisten |
| `docs/product/INFORMATION_ARCHITECTURE.md` | Navigation, Routen, Datenmodell v2, Migration, Datenschutz-Klassen |
| `docs/product/MONETIZATION_CONCEPT.md` | Free-Kern, Edition, Decks, Abo-Bedingungen (nur Konzept) |
| `docs/visual/ASSET_REQUESTS.md` | Bild-Bulks; nur den Bulk des nächsten Pakets anfordern |

Feste Regeln aus V2:

- Fortschritt wird aus gespeicherten Fakten **abgeleitet**, nicht gezählt. Schema-Upgrades nur additiv; gespeicherte Einträge bleiben unveränderlich (D-09).
- Keine Streaks, keine Verluste bei Pausen, keine Druckwörter, keine gesperrten Wissensinhalte. Die Reise ist nie käuflich.
- Zahlen, Engelszahlen und Mond sind als **symbolische Deutung** markiert; Astronomie bleibt sachlich. Keine Vorhersagen, keine Aussagen über Gedanken anderer.
- Geburtsdatum nur freiwillig, lokal, einzeln löschbar und nie in Share-Bildern.
- Billing, Store-Konten, Preise, Abo, neue Abhängigkeiten mit Laufzeitdienst und Kosten brauchen eine eigene Freigabe. Ohne Billing werden Edition-Inhalte nicht angezeigt (keine Attrappen).
- Mondphasen kommen in 1.1. Astrologie, Audio-Meditationen, Kristalle als Kaufempfehlung, Konto und Cloud-Sync sind nicht geplant. Virtuelle Talismane bleiben als kostenlose Entdeckung im Backlog (1.3+), nie als Lootbox oder gegen virtuelle Währung.
- Identität hat zwei Säulen: Archetypen und Zahlen (Numerologie). Beide werden eng mit Tagesorakel und Grimoire verbunden.
- Lokale Sicherung und Wiederherstellung gehört spätestens in 1.0 (kein Premium).
- Gestaltung und Funktion eines Bereichs werden im selben Paket umgesetzt; jedes Paket-Gate prüft Perf-Budgets, Kontrast, Layout, DE/EN und Android.
- Leistung wird gegen die **feste Referenzbasis** `main` @ `03abb3c` mit **absoluten Obergrenzen** geprüft (`MASTER_ROADMAP_V2.md` §6), nicht nur relativ zur Vorversion. Kontrast gilt als **Mindestwert** für jeden Lesetext, nicht im Median.
- Optik und Design nie eigenmächtig ändern, auch nicht für Performance: zuerst unsichtbar optimieren, sichtbare Abstriche nur nach Rückfrage.

## Sicherung je Arbeitspaket (verbindlich seit 26.11.2026, D-40)

Jedes abgeschlossene Arbeitspaket wird so gesichert, dass es nachvollziehbar ist und man dorthin zurückspringen kann:

1. **Getrennte Commits** je Paket und Thema (z. B. Code des Pakets, Doku/Plan, Nachweise). Nur eigene Änderungen stagen; Dateien anderer laufender Sitzungen nicht mit committen. Keine destruktiven Git-Befehle (Force-Push, Reset, Rebase veröffentlichter Commits).
2. **Vor jedem Push** den Diff auf Zugangsdaten, Schlüssel, private Daten und vertrauliche Dokumente prüfen (das Repo ist öffentlich; `docs/briefing/` bleibt ignoriert). `npm run check` muss grün sein.
3. **Push** auf den Arbeitsbranch des Pakets, sobald es baut und abgeschlossen ist (für `emfau88/Arcana` freigegeben). Nie direkt auf `main`.
4. **Testnachweise**: Check, E2E, Screenshots, Perf gegen die Budgets und Android mit ehrlichem PASS/FAIL/BLOCKED/NOT RUN in `docs/PROJECT_STATUS.md`; bekannte offene Fehler ausdrücklich nennen.
5. **Pull Request nach `main`** vorbereiten. Gemergt wird erst nach ausdrücklicher Freigabe des Eigentümers.
6. **Tag** auf den freigegebenen Stand nach dem Merge (`v0.2.1`, dann `v0.3.0` …) als Rücksprungpunkt.
7. **Nächstes Paket** auf einem eigenen Branch vom getaggten Stand (`feature/v03-fundament`, `feature/v04-identitaet` …).
