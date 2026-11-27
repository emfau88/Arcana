# ARCANA · Personal Oracle (Arbeitstitel)

## ▶ Jetzt auf dem Handy testen: **[emfau88.github.io/Arcana](https://emfau88.github.io/Arcana/)**

Link auf dem Handy öffnen (Chrome oder Safari). Die App läuft komplett im Browser. Alle Eingaben bleiben lokal auf deinem Gerät, es gibt kein Konto, keinen Server und kein Tracking.

> **Stand: Version 0.4.1 (27.11.2026).** Drei von sechs Paketen bis zum Release 1.0 sind fertig: Tagesorakel (V02), Fundament (V03), Identität und Reise (V04).
> Enthalten sind 22 gemalte Karten (Deck v2, siehe [docs/ASSET_LICENSES.md](docs/ASSET_LICENSES.md)), 6 Themen, 8 Archetypen mit Fragebogen und die Narrenreise, alles in Deutsch und Englisch. Als Nächstes kommt V05 (Kartenvertiefung, Legungen, Grimoire als Buch, Tagebuch). Die Seite wird bei jedem Push auf `main` automatisch neu gebaut.

---

ARCANA ist ein persönliches, symbolisches Orakel mit drei verbindenden Systemen: **Identität** (acht Archetypen aus sieben freiwilligen Fragen, mit „Warum?“ als nachvollziehbarer Rechnung), **Reise** (Narrenreise mit 63 Stationen, Meilensteine ohne Streak-Druck, Sternkarte, Wochen- und Monatsrückblick) und **Grimoire** (Sammlung, Verlauf, Notizen, Kapitel). Dazu kommen eine Tageskarte pro Kalendertag mit einer Linse je Archetyp, ein Drei-Karten-Orakel (Situation, Herausforderung, Impuls) und eine teilbare Archetypkarte. Die Deutungen sind Reflexionsimpulse, keine Vorhersage und keine Diagnose.

Der Plan bis 1.0 steht in [docs/product/MASTER_ROADMAP_V2.md](docs/product/MASTER_ROADMAP_V2.md).

Derselbe Web-Code läuft im Browser und als gebündelte Android-App (Capacitor). Die App lädt dabei keine Remote-URL.

## Voraussetzungen

- Node.js ≥ 22.12 (getestet mit 22.17.1) und npm 10
- Android (optional): Android Studio mit JDK 21 (JBR), Android SDK 36, ein Emulator

## Befehle

```powershell
npm ci                    # Abhängigkeiten exakt nach Lockfile
npm run dev               # Entwicklungsserver: http://127.0.0.1:5180/
npm run build             # Produktions-Build nach dist/
npm run preview           # Produktions-Build ansehen: http://127.0.0.1:5181/
npm test                  # Unit-Tests (Vitest)
npm run test:e2e          # Browser-E2E (Playwright, baut und startet die Preview selbst)
npm run validate:content  # Inhalts-Validator (DE/EN, verbotene Begriffe, Vollständigkeit)
npm run typecheck         # TypeScript strict
npm run lint              # ESLint, 0 Warnungen erlaubt
npm run check             # typecheck + lint + content + test + build (mit Bundle-Report und Budgets)
npm run art               # Icons, Papierkorn und Kartenvorlagen rendern (art/*.mjs → public/icons, docs/assets)
```

## Android (nur Emulator)

```powershell
npm run android:sync
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"   # oder android/local.properties mit sdk.dir
cd android; .\gradlew.bat assembleDebug --offline; cd ..
adb -s emulator-5554 install -r android\app\build\outputs\apk\debug\app-debug.apk
```

- Entwicklungs-ID: `com.energycrafted.personaloracle.dev`. Die endgültige App-ID legt der Eigentümer vor dem Release fest.
- `--offline` nutzt nur den lokalen Gradle-Cache. Ohne Cache das Flag weglassen.
- Emulator-Nachweise: `node --experimental-strip-types scripts/android-evidence.mjs <Zielordner> --serial emulator-5554` (APK vorher installieren). Das Skript läuft nur auf Emulatoren und stellt die Systemeinstellungen danach wieder her.

## Projektstruktur

| Pfad | Inhalt |
|---|---|
| `src/domain` | Reine Logik: Archetypen-Scoring und „Warum?“, Tagesorakel, Linsen, Readings, Reise, Meilensteine, Rückblicke, Sternkarte, Rechte; Uhr und Zufall injizierbar |
| `src/content` | Kuratierte DE/EN-Inhalte, Schema und Validator; `modules/` lädt Identität, Archetypen, Kapitel und Reise je Sprache nach |
| `src/platform` | IndexedDB-Speicher (Schema 2 mit Migration), Android-Brücke, Textzoom |
| `src/features` | Heute, Orakel, Grimoire, Identität („Ich“), Reise, Teilen, Einstellungen, Onboarding |
| `src/share`, `src/ui`, `src/i18n` | Renderer der Teilen-Karte, gemeinsame Bausteine, Oberflächentexte DE/EN |
| `art/` | Vektorgeneratoren für Icons, Textur, Kartenrahmen und das alte Vektordeck |
| `scripts/assets/` | Export des gemalten Kartendecks aus den PNG-Mastern (Python + Pillow) |
| `android/` | Capacitor-Android-Projekt |
| `tests/` | Unit- und E2E-Tests |
| `docs/` | Status, Entscheidungen, Gate-Berichte, Testnachweise, Screenshots |

Der aktuelle Stand steht in [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md), die Gate-Berichte (G0–G2, danach je Paket) in [docs/GATE_REPORTS.md](docs/GATE_REPORTS.md), die Entscheidungen in [docs/DECISIONS.md](docs/DECISIONS.md) und [docs/SELF_DECISIONS.md](docs/SELF_DECISIONS.md).

## Datenschutz

Es gibt kein Backend, keine Runtime-KI, kein Tracking und keine CDN-Assets. Fonts und Bilder liegen im Paket. Profil, Tageskarten, Readings und Notizen liegen nur in der IndexedDB des jeweiligen Browsers oder Geräts. „Alle Daten löschen“ unter „Ich“ › Einstellungen entfernt sie vollständig. Ein Android-Backup ist deaktiviert.

## Lizenzen

Texte, Icons und Vektorgrafiken sind eigene Werke dieses Projekts. Die Kartenillustrationen entstanden mit dem OpenAI-Bildgenerator (Herkunft und Prompts dokumentiert). Die Schriften Cormorant Garamond und Manrope stehen unter der SIL Open Font License 1.1. Details und die Regeln zum späteren Austausch der Kartenbilder: [docs/ASSET_LICENSES.md](docs/ASSET_LICENSES.md).
