# ARCANA · Personal Oracle (Arbeitstitel)

## ▶ Jetzt auf dem Handy testen: **[emfau88.github.io/Arcana](https://emfau88.github.io/Arcana/)**

Link auf dem Handy öffnen (Chrome oder Safari). Die App läuft komplett im Browser. Alle Eingaben bleiben lokal auf deinem Gerät, es gibt kein Konto, keinen Server und kein Tracking.

> **Stand: G2 abgeschlossen (Version 0.2.0).**
> Alle 22 Karten und alle 6 Themen sind enthalten, in Deutsch und Englisch. Die Kartenillustrationen sind ein vorläufiger Stil und werden später eventuell durch eigene Assets ersetzt. Die Seite wird bei jedem Push auf `main` automatisch neu gebaut.

---

Ein persönliches, symbolisches Tagesorakel: ein kurzes freiwilliges Profil mit acht Archetypen, eine Tageskarte pro Kalendertag, ein Drei-Karten-Orakel (Situation, Herausforderung, Impuls) und ein Grimoire mit Sammlung, Verlauf und Notizen. Die Deutungen sind Reflexionsimpulse, keine Vorhersage und keine Diagnose.

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
npm run check             # typecheck + lint + content + test + build
npm run art               # Karten-Artwork neu rendern (art/*.mjs → public/cards, docs/assets)
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
| `src/domain` | Reine Logik: Archetypen-Scoring, Tagesorakel, Readings, Uhr/Zufall injizierbar |
| `src/content` | Kuratierte DE/EN-Inhalte, Schema und Validator |
| `src/platform` | IndexedDB-Speicher, Android-Brücke, Textzoom |
| `src/features` | Heute, Orakel, Grimoire, Profil, Onboarding |
| `art/` | Generatoren für die eigenen Kartenillustrationen (Registry `art/deck.mjs`) |
| `android/` | Capacitor-Android-Projekt |
| `tests/` | Unit- und E2E-Tests |
| `docs/` | Status, Entscheidungen, Gate-Berichte, Testnachweise, Screenshots |

Der aktuelle Stand steht in [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md), die Gate-Berichte (G0–G2) in [docs/GATE_REPORTS.md](docs/GATE_REPORTS.md).

## Datenschutz

Es gibt kein Backend, keine Runtime-KI, kein Tracking und keine CDN-Assets. Fonts und Bilder liegen im Paket. Profil, Tageskarten, Readings und Notizen liegen nur in der IndexedDB des jeweiligen Browsers oder Geräts. „Alle Daten löschen“ im Profil entfernt sie vollständig. Ein Android-Backup ist deaktiviert.

## Lizenzen

Kartenillustrationen und Texte sind eigene Werke dieses Projekts. Die Schriften Cormorant Garamond und Manrope stehen unter der SIL Open Font License 1.1. Details und die Regeln zum späteren Austausch der Kartenbilder: [docs/ASSET_LICENSES.md](docs/ASSET_LICENSES.md).
