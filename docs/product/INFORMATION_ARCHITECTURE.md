# INFORMATION_ARCHITECTURE · Navigation, Screens, Datenmodell

**Stand:** 26.11.2026 · Grundlage: `PRODUCT_SYSTEMS.md`. Technische Leitplanken unverändert: Web-first (React, TypeScript, Vite), Capacitor Android, IndexedDB, Hash-Routing, Offline-Kern, DE/EN, kein Konto, keine externen Laufzeit-Abhängigkeiten.

## 1 · Grundregel: Wissen der Welt vs. meine Spuren

| Bereich | Frage | enthält |
|---|---|---|
| **Heute** | Was ist heute für mich da? | Tageskarte, Tagesenergien, ein Hinweis, Reise-Plakette |
| **Orakel** | Ich habe eine Frage. | Legungen |
| **Entdecken** | Was bedeutet …? | Wissen: Numerologie, Engelszahlen, Symbole, später Mond, Träume |
| **Grimoire** | Was habe ich gesammelt und geschrieben? | meine Spuren: Karten (mit Stufe), Archetypen, Symbole, Tagebuch, Rituale, Zahlen, Reise |
| **Ich** | Wer bin ich hier? | Identität (Archetypen, Kernzahlen, Symbol, Reisestand), Einstellungen, Daten |

**Kanonischer Ort:** Jede Information hat **genau eine** Hauptseite. Andere Bereiche zeigen höchstens eine Zusammenfassung mit Link dorthin.

| Information | kanonische Seite | Zusammenfassung in |
|---|---|---|
| Kartenbedeutung (alle Ebenen) | Grimoire › Karten › Karte | Heute, Legung, Symbol |
| Archetyp-Profil | Grimoire › Archetypen › Archetyp | Ich, Heute (Linse) |
| Zahlenprofil (Bedeutungen) | Entdecken › Zahlen | Ich (Kernzahlen), Heute (Tageszahl), Grimoire › Zahlen (meine Einträge) |
| Engelszahl-Bedeutung | Entdecken › Engelszahlen › Zahl | Grimoire › Zahlen (Favoriten, Begegnungen) |
| Symbol-Bedeutung | Entdecken › Symbole › Symbol | Grimoire › Symbole (entdeckt), Kartenseite |
| Reise und Meilensteine | Grimoire › Reise (Sternkarte) | Heute (Plakette, Moment), Ich (Reisetag) |
| Tagebucheinträge | Grimoire › Tagebuch | jeweiliger Ursprung (Tageskarte, Legung) |

## 2 · Navigation

**Bis V05: vier Tabs** wie heute: Heute · Orakel · Grimoire · Profil (wird in V04 zu „Ich“).
**Ab V06 / Release 1.0: fünf Tabs** (Entscheidung E8):

| Position | Tab | Icon (SVG, vorhandener Stil) | Begründung |
|---|---|---|---|
| 1 | Heute | Sonne | Start, täglicher Einstieg |
| 2 | Orakel | Karten | aktive Frage |
| 3 | Entdecken | Kompass-Stern | bündelt alle Wissenswelten in **einem** Tab. Neue Welten kommen hier hinzu, ohne die Navigation zu ändern |
| 4 | Grimoire | Buch | Sammlung und Gedächtnis |
| 5 | Ich | Medaillon | Identität und Einstellungen |

Fünf Tabs sind auf 360 px mit Label lesbar (Tab-Breite 72 px, Label ≤ 9 Zeichen: „Entdecken“ hat 9, „Discover“ hat 8). Alternative bei Ablehnung: Entdecken als großer Einstieg auf „Heute“ und im Grimoire. Das ist schlechter, weil Nachschlagen (Engelszahl gesehen → sofort suchen) einen direkten Weg braucht.

### Routen (Hash)

| Route | Screen | ab |
|---|---|---|
| `#/today` | Heute | vorhanden |
| `#/oracle`, `#/oracle/:spreadId`, `#/reading/:id` | Orakel, Legung, gespeicherte Legung | vorhanden / V05 |
| `#/discover` | Entdecken-Hub mit Suche | V06 |
| `#/discover/numbers`, `#/discover/numbers/:n` | Numerologie, Zahlseite | V06 |
| `#/discover/angel`, `#/discover/angel/:seq` | Engelszahlen, Folge | V06 |
| `#/discover/symbols`, `#/discover/symbols/:id` | Lexikon, Symbol | V06 |
| `#/discover/moon` | Mond | 1.1 |
| `#/grimoire`, `#/grimoire/:chapter`, `#/grimoire/cards/:cardId`, `#/grimoire/archetypes/:id` | Buch, Kapitel, Seiten | V05 (Karten vorhanden) |
| `#/grimoire/journey` | Sternkarte | V04 (als eigene Seite), V05 im Buch |
| `#/me`, `#/me/settings`, `#/me/birthdate` | Ich, Einstellungen, Geburtsdatum | V04 / V06 |
| `#/me/backup` | Sicherung und Wiederherstellung | V07 (spätestens 1.0) |
| `#/share/:template` | Teilen-Vorschau (Archetypkarte ab V04) | V04 |
| `#/welcome`, `#/onboarding/*`, `#/reveal` | Einstieg | vorhanden, V04 neu |

Android-Zurück folgt der Routen-Historie, Tabs sind Wurzeln (bestehende Regel).

## 3 · Screen-Inventar (Release 1.0)

| Screen | Hauptaktion (genau eine) | Welt-Hintergrund | Paket |
|---|---|---|---|
| Willkommen | Beginnen | A06 | V04 |
| Fragen 1–7 | Antwort wählen | A06 (gedimmt) | V04 |
| Archetyp-Enthüllung | Zur Tageskarte | A05 + Porträt | V04 |
| Heute verdeckt / enthüllt | Karte enthüllen / Reise fortsetzen | A01 | V02 |
| Meilenstein-Moment (Overlay) | Weiter | A01 + Licht | V04 |
| Rückblick (Woche/Monat) | Rückblick-Legung (optional) | A19 | V04 |
| Orakel: Wahl der Legung | Legung beginnen | A03 | V05 |
| Legung (2–7 Karten) | Karte aufdecken → Speichern | A03 | V05 |
| Entdecken-Hub | Suchen | A32 | V06 |
| Zahlen / Zahlseite / Geburtsdatum | Geburtsdatum eintragen (falls leer) | A32 | V06 |
| Engelszahlen / Folge | Zahl eingeben / Begegnung festhalten | A32 | V06 |
| Symbol-Lexikon / Symbol | Symbol öffnen | A32 | V06 |
| Grimoire: Einband + Inhalt | Kapitel öffnen | A04 + A15 | V05 |
| Kapitel I–VII, Kartenseite, Studium | Studium beginnen / Notiz | A04 (Pergament) | V05 |
| Sternkarte | Tag öffnen | A19 | V04 |
| Ich (zwei Säulen: Archetypen, Zahlen) | Profil ansehen | A05 | V04 (Zahlen-Säule V06) |
| Sicherung | Sicherung erstellen / wiederherstellen | ruhig | V07 |
| Einstellungen | – | ruhig | V03 |
| Teilen (Vorschau-Sheet) | Teilen | – | V07 |

## 4 · Erste Sitzung und Wiederkehr

**Erste Sitzung (Ziel ≤ 90 s bis zur Karte):** Willkommen → 7 Fragen (je ≤ 8 s, überspringbar) → Enthüllung (≤ 8 s) → Heute verdeckt → Karte enthüllen → Botschaft. Kein Geburtsdatum, keine Benachrichtigungsfrage, kein Kauf in der ersten Sitzung.

**Tag 2–7:** Heute zeigt nach der Enthüllung höchstens einen Hinweis (Weltvorstellung, Kartenstufe, Meilenstein). Ab Reisetag 3 einmalig die Frage nach einer sanften Erinnerung (ablehnbar, nie wiederholt, später im Profil änderbar).

**Wiederkehr nach Pause:** keine Begrüßung mit Schuld („Lange nicht gesehen“), sondern Reisetag wie verlassen, ggf. ein Rückblick-Angebot.

## 5 · Datenmodell

### 5.1 Grundsatz: Fakten speichern, Fortschritt ableiten

Gespeichert werden nur **Fakten** (was wann passiert ist und was der Mensch geschrieben hat). Fortschritt (Reisetag, Stufen, Meilensteine, Symbole, Rückblicke) wird bei Bedarf **abgeleitet**. Vorteile: keine Zähler, die auseinanderlaufen; Updates der Regeln wirken rückwirkend und korrekt; Migrationen bleiben klein; alles ist deterministisch testbar.

### 5.2 Bestehende Typen (Erweiterungen sind optional, alte Datensätze bleiben gültig)

```ts
interface Profile {                    // kv 'profile'
  answers: Answers;
  themeId: ThemeId;
  archetypeId: ArchetypeId | null;     // Hauptarchetyp (bestehendes Feld, unverändert)
  archetypeSource?: ArchetypeSource;
  secondaryArchetypeId?: ArchetypeId | null;   // neu V04
  scores?: Record<ArchetypeId, number>;        // neu V04, für „Warum?“
  questionnaireVersion?: number;               // neu V04 (fehlt = 1)
  profileVersion: number;
  updatedAt: string;
}

interface DailyRecord {                // store 'daily' (unverändert + optional)
  /* … bestehende Felder … */
  variant?: { lens: number; reflection: number; ritual: number }; // neu V04/V05
  secondaryArchetypeId?: ArchetypeId | null;                      // neu V04
}

interface Reading {                    // store 'readings'
  /* … bestehende Felder … */
  spreadId?: string;                   // fehlt = 'classic-3'
  cardIds: CardId[];                   // bisher Tupel aus 3, als Array kompatibel
  roles?: RoleId[];                    // fehlt = ['core','challenge','impulse']
}

interface Settings {                   // kv 'settings'
  locale: Locale; motion: MotionPreference; onboardingDone: boolean;
  reminder?: { enabled: boolean; time: string /* 'HH:MM' */; askedAt?: string }; // V07
  cardBack?: string;                   // gewählter Kartenrücken (Freischaltung), V05
  deckId?: string;                     // gewähltes Deck, 1.2
}
```

### 5.3 Neue Speicher (Schema-Version 2, Paket V03)

```ts
interface PersonalData {               // kv 'personal' – sensibel, getrennt löschbar
  birthDate?: string;                  // 'YYYY-MM-DD', nur lokal, nie in Share-Modellen
  savedAt: string;
}

interface JournalEntry {               // store 'journal', keyPath id, Index dateKey, kind
  id: string;
  kind: 'reflection' | 'study' | 'number-encounter' | 'moon-intention' | 'moon-reflection' | 'free';
  dateKey: string;                     // lokaler Tag
  text: string;                        // darf leer sein (z. B. Begegnung ohne Notiz)
  refs: { cardId?: CardId; readingId?: string; sequence?: string; moonCycle?: string; ritualId?: string };
  createdAt: string; updatedAt: string;
}

interface ActivityEvent {              // store 'events', keyPath id, Index type, dateKey (nur anhängen)
  id: string;
  type: 'card.studied' | 'ritual.done' | 'review.opened' | 'world.introduced';
  dateKey: string; at: string;
  refs: { cardId?: CardId; part?: 1 | 2; ritualId?: string; reviewId?: string; world?: string };
}

interface Favorite {                   // store 'favorites', keyPath key
  key: string;                         // `${kind}:${id}`
  kind: 'angel' | 'symbol' | 'ritual' | 'card'; id: string; createdAt: string;
}

interface SeenFlag {                   // store 'seen', keyPath key – nur „neu“-Markierungen
  key: string;                         // 'milestone:21', 'level:major-03:2', 'chapter:seeker:1'
  seenAt: string;
}
```

Notizen an Tageskarten und Legungen bleiben **wo sie sind** (`note`-Feld). Das Tagebuch zeigt sie über eine abgeleitete Ansicht zusammen mit `journal` an. Keine Datenverschiebung, keine Migration der Notizen.

### 5.4 Abgeleitete Größen (reine Funktionen, Unit-getestet)

| Funktion | Eingaben | Ergebnis |
|---|---|---|
| `journeyDays` (erweitert) | daily, readings, journal, events | Zahl (monoton) |
| `journeyPosition` | Reisetag | Runde, Weg, Station (vorhanden) |
| `milestonesReached` | Reisetag, Tabelle | Liste mit `reward` |
| `cardEncounters`, `cardLevel` | daily, readings, journal, events | je Karte Tage, Themen, Rollen, Stufe |
| `discoveredSymbols` | Kartenstufen, Meilensteine | Symbol-IDs |
| `review(range)` | alle Fakten im Zeitraum | Rückblick-Modell |
| `numerology(birthDate, today)` | PersonalData, Clock | Kernzahlen mit Rechenweg |
| `moonPhase(date, tz)` | Clock | Phase, Beleuchtung, nächste Hauptphasen (1.1) |
| `entitlements` | Kaufstatus (V07) | Liste der Rechte |

### 5.5 Migration und Robustheit

| Regel | Umsetzung | Test |
|---|---|---|
| Schema-Upgrades nur additiv | v1 → v2 legt Stores an, schreibt keine Bestandsdaten um | Upgrade-Test mit G2-Fixture (leer, voll, teilweise defekt) |
| Idempotent | zweimal öffnen = gleiches Ergebnis | Unit |
| Alte Datensätze bleiben gültig | Validatoren akzeptieren fehlende neue Felder mit Standardwerten | Unit pro Typ |
| Defekte Datensätze | übersprungen und gemeldet, nie gelöscht (D-05) | vorhanden, erweitert |
| Paralleler Tab mit alter Version | `onversionchange` schließt die alte Verbindung, Hinweis zum Neuladen | E2E |
| Löschen | „Alle Daten löschen“ entfernt alle Stores. **Neu:** Geburtsdatum einzeln löschen, einzelne Tagebucheinträge löschen | E2E |
| Sicherung | Datei-Export aller Stores, Wiederherstellung über dieselbe additive Migration (§5.7) | Roundtrip-Test |
| Zeitzonen | `dateKey` lokal zum Zeitpunkt der Handlung, Ableitungen nutzen nur `dateKey` | Unit mit Clock |

### 5.6 Datenschutz-Klassen

| Klasse | Daten | darf in Share-Bild | darf in Sicherung (1.0) |
|---|---|---|---|
| öffentlich-tauglich | Karte, Archetyp-Name, Zahl (ohne Rechenweg), Symbol, Reisetag | ja (Whitelist) | ja |
| persönlich | Antworten, Scores, Notizen, Tagebuch, Begegnungen | **nie** | ja (Nutzer exportiert selbst) |
| sensibel | Geburtsdatum | **nie** | nur wenn beim Erstellen ausdrücklich angehakt (Standard: aus) |

### 5.7 Sicherung und Wiederherstellung (spätestens 1.0, Bulk V07.3; Format in V03.1)

**Zweck:** Ohne Konto und Cloud ist ein Gerätewechsel oder eine Neuinstallation sonst ein Totalverlust. Die Sicherung ist eine lokale Datei, die der Mensch selbst ablegt. Sie ist unabhängig vom späteren gestalteten PDF-Export (E6).

```ts
interface BackupFile {                // Datei `arcana-sicherung-YYYY-MM-DD.json`
  format: 'arcana-backup';
  formatVersion: 1;
  schemaVersion: number;              // IndexedDB-Schema zum Zeitpunkt der Sicherung
  appVersion: string; createdAt: string;
  includesPersonal: boolean;          // Geburtsdatum enthalten?
  stores: {
    kv: { profile?: Profile; settings?: Settings; personal?: PersonalData };  // keine Entitlements
    daily: DailyRecord[]; readings: Reading[]; journal: JournalEntry[];
    events: ActivityEvent[]; favorites: Favorite[]; seen: SeenFlag[];
  };
}
```

| Regel | Umsetzung | Test |
|---|---|---|
| Erstellen | Einstellungen › Sicherung: Vorschau (Anzahl Tage, Legungen, Einträge), Haken „Geburtsdatum einschließen“ (aus), dann Datei. Web: Download. Android: System-Teilen bzw. Speichern-Dialog | E2E Web, Emulator |
| Wiederherstellen | Datei wählen → Prüfung → Vorschau (was ersetzt wird) → Bestätigung → **ersetzen** aller Stores in einer Transaktion. Kein Zusammenführen in 1.0 | E2E |
| Ältere Sicherung | läuft durch dieselbe additive Migration wie die Datenbank | Fixture aus 0.2.0 und 0.4 |
| Neuere Sicherung als die App | abgelehnt mit Hinweis „App zuerst aktualisieren“, nichts verändert | Unit |
| Defekte Datei oder Einträge | Datei ungültig → nichts verändert. Einzelne defekte Einträge → übersprungen und genannt (D-05) | Unit |
| Käufe | nicht in der Datei; Edition kommt über „Käufe wiederherstellen“ | Unit |
| Roundtrip | sichern → alles löschen → wiederherstellen ergibt identische Daten (tiefer Vergleich) | E2E |
| Datenschutz | Datei ist unverschlüsselt; Hinweis beim Erstellen. Keine Netzwerkanfrage | Netzwerk-Log im E2E |
| Erinnerung | höchstens ein Hinweis (A6) nach je 30 Reisetagen ohne Sicherung, abschaltbar, ohne Druckwörter | Unit |

Technik: Web über Blob-Download und Datei-Eingabe. Android über System-Teilen bzw. Datei-Auswahl; das offizielle Capacitor-Dateisystem-Plugin kommt nur dazu, wenn das nicht reicht (E19 entschieden, D-43). Format, Serialisierer und Prüfer: `src/platform/storage/backup.ts` (V03.1, D-44).

## 6 · Entitlements (Vorbereitung für die Edition)

`src/domain/entitlements.ts` wird erweitert: `core.*` (immer) plus `edition.spreads`, `edition.identity`, `edition.numbers`, `edition.rituals`, `deck.<id>`. Ohne freigegebenes Billing liefert der Provider nur `core.*`, und Edition-Inhalte werden **nicht angezeigt** (keine Attrappen, keine Schlösser). Mit Billing (V07, Freigabe nötig) kommt ein Play-Billing-Provider dazu. Ein Testprovider für E2E schaltet alles frei. **Umgesetzt in V03.4 (D-48):** `CoreOnlyProvider`, `TestProvider`, im UI nur `useApp().has(right)`, durch eine ESLint-Regel abgesichert.

## 7 · Leistung und Paketgröße

Verbindlich sind die Budgets in `MASTER_ROADMAP_V2.md` §6 (absolute Obergrenzen, feste Referenzbasis, Schrittgrenze je Paket). Hier nur die datennahen Grenzen:

| Budget | Grenze | Messung |
|---|---|---|
| Inhalt je Modul und Sprache (gzip) | ≤ 40 KB | Build-Report |
| Ableitungen (Reise, Stufen, Rückblick) bei 1.000 Tagen Daten | ≤ 30 ms | Unit-Benchmark |
| Suche über 1.000 Einträge | ≤ 50 ms | Unit-Benchmark |
| Sicherung erstellen / wiederherstellen bei 1.000 Einträgen | ≤ 2 s / ≤ 3 s auf dem Referenz-Emulator | E2E, Emulator |
| Android-APK | ≤ 25 MB | Build |
