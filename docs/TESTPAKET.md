# Testpaket 0.5 · Testanleitung

Stand 28.11.2026 · Version **0.5.0** (versionCode 6) · Branch `feature/v05-karten` · V05.6, S-59

Das Testpaket ist ein Android-Build im Release-Modus, mit einer eigenen **Testsignatur** und der Entwicklungs-App-ID `com.energycrafted.personaloracle.dev` (Name „Arcana“). Es dient zum Ausprobieren auf dem Emulator und, wenn der Eigentümer es weitergibt, auf Testgeräten. Für Google Play ist es **nicht** gedacht.

| Für den geschlossenen Test fehlt noch | Wer | Status |
|---|---|---|
| Finaler App-Name und App-ID (E11, nach dem ersten Upload nicht mehr änderbar) | Eigentümer | **BLOCKED** |
| Play-Konto: Kontotyp, Erstellungsdatum, alte App überschreiben oder neuer Eintrag (E15, E17) | Eigentümer | **BLOCKED** |
| Kanal und Testergruppe des geschlossenen Tests (E17) | Eigentümer | **BLOCKED** |
| Upload-Schlüssel für Play (eigener Schlüssel außerhalb des Repos, nicht der Testschlüssel) | nach E11 und E15 | offen |
| App-Bundle (AAB) mit der finalen ID | nach E11 | offen |

## Für Testerinnen und Tester

### Installieren

1. Android 7.0 oder neuer.
2. Die Datei `arcana-0.5.0-test.apk` auf das Gerät laden. Wer mag, vergleicht die SHA-256-Prüfsumme mit der unten im Abschnitt „Nachweis“.
3. Beim Öffnen fragt Android, ob die App, mit der die Datei geöffnet wird (z. B. „Dateien“ oder der Browser), Apps installieren darf. Erlauben, installieren, danach kann die Erlaubnis wieder entzogen werden.
4. Lief schon eine Entwicklerversion von Arcana mit anderer Signatur, lehnt Android die Installation ab. Dann die alte Version zuerst deinstallieren; ihre Daten gehen dabei verloren. Spätere Testpakete mit derselben Testsignatur installieren sich darüber und behalten die Daten.

Arcana braucht kein Konto, keine Anmeldung und kein Internet. Alles bleibt auf dem Gerät, die App sendet nichts. **Deinstallieren löscht alle Einträge**; eine Sicherung gibt es in dieser Version noch nicht.

### Ausprobieren

Am ersten Tag (etwa 15 Minuten):

1. **Willkommen:** die Fragen beantworten oder überspringen, danach die Enthüllung des Archetyps.
2. **Heute:** die Tageskarte aufdecken; Botschaft, Frage, kleines Ritual, eine Notiz schreiben.
3. **Orakel:** eine Legung wählen (Drei Karten, Licht und Schatten, Neuanfang), ein Thema wählen, ziehen, Karten einzeln oder alle aufdecken, im Grimoire speichern oder verwerfen.
4. **Grimoire:** das Buch öffnen. Karten (Kartenseite und Kartenstudium), Archetypen, Tagebuch (schreiben, suchen, filtern, eigene Worte löschen), Rituale („Heute gemacht“), Reise (Sternkarte, einen Stern antippen).
5. **Ich:** Profil, „Warum?“, die Archetypkarte teilen, Einstellungen (Sprache Deutsch oder Englisch, Bewegung, Thema).

An den folgenden Tagen:

- Jeden Tag eine Karte. Pausen kosten nichts, es gibt keine Serien.
- An den Reisetagen 2, 5 und 10 öffnet sich ein neuer Kartenrücken (Auswahl in den Einstellungen).
- Ab Reisetag 7 bietet das Orakel den Wochenrückblick an, ab Tag 30 den Monatsrückblick.

Gern auch: große Schrift in den Android-Einstellungen, Flugmodus, die App über Mitternacht offen lassen oder aus dem Hintergrund zurückholen, beide Sprachen.

### Rückmelden

- Was unklar, holprig oder falsch wirkte, welche Texte nicht passen, ob etwas abstürzt oder hängt.
- Dazu: Gerät, Android-Version, Schriftgröße, Sprache und gern ein Bildschirmfoto, ohne private Notizen.
- Rückmeldungen gehen über den Weg, den der Eigentümer nennt. Die App selbst sammelt nichts.

### Was bewusst noch fehlt

Zahlen und Numerologie, Symbole und der Bereich „Entdecken“ (0.6); Erinnerung, Sicherung und Wiederherstellung, weitere Teilen-Vorlagen (0.7 bis 1.0). Es gibt keine Käufe, keine Werbung und keine gesperrten Inhalte.

## Für den Bau

Voraussetzungen wie beim Debug-Build: Node, Android Studio mit SDK. Gebaut wird aus einem sauberen Stand des Branches.

```powershell
npm ci
npm run check
npm run android:sync
```

```powershell
cd android; $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"; .\gradlew.bat assembleRelease
```

Ergebnis: `android\app\build\outputs\apk\release\app-release.apk` (nicht versioniert). Zum Weitergeben als `arcana-<version>-test.apk` kopieren.

**Testschlüssel (S-59):** `android/app/build.gradle` liest die Signatur aus `android/keystore.properties` (Felder `storeFile`, `storePassword`, `keyAlias`, `keyPassword`). Diese Datei und der Schlüssel `android/keystore/arcana-test.jks` liegen nur lokal und sind per `.gitignore` ausgeschlossen; das Kennwort steht nirgends im Repo. Fehlt die Datei, bleibt der Release-Build unsigniert und lässt sich nicht installieren. Einen neuen Testschlüssel erzeugt `keytool` aus Android Studio:

```powershell
& "C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -genkeypair -keystore android\keystore\arcana-test.jks -storetype PKCS12 -alias arcana-test -keyalg RSA -keysize 3072 -validity 9125 -dname "CN=Arcana Test Signature, O=Test, C=DE"
```

Ein neuer Schlüssel heißt: Bestehende Testinstallationen müssen einmal deinstalliert werden. Den Schlüssel deshalb nicht löschen, solange getestet wird.

Prüfen nach dem Bau (Build-Tools aus dem SDK): `apksigner verify --print-certs` (Signatur gültig, Zertifikat „Arcana Test Signature“), `aapt2 dump badging` (Version, keine Debug-Kennung, Berechtigungen) und die SHA-256-Prüfsumme der Datei.

## Nachweis

Build vom 28.11.2026 (Stand des Commits mit dieser Datei). Vor dem geschlossenen Test wird auf dem Endstand von QG-V05 neu gebaut; Prüfsumme und Größe ändern sich dann.

| Prüfung | Ergebnis |
|---|---|
| Release-Build | PASS: `app-release.apk`, 12.927.686 Bytes (12,9 MB; Debug-Build 14,1 MB) |
| SHA-256 der APK | `6cc46d50f383ea22c3c014fa4de31ba2870501fe9a629a36615b2b534f73ca7f` |
| Signatur | PASS: APK Signature Scheme v2 gültig, ein Signierer, `CN=Arcana Test Signature, O=Test, C=DE`, Zertifikat-SHA-256 `69fb6ce85ae7f8f806a77e6d40327beba35e5d4a3dda5e4f20d824bb1a71e01d` |
| Manifest | PASS: Version 0.5.0 (6), minSdk 24, targetSdk 36, nicht debugbar, Sicherung aus, keine Remote-URL; Berechtigung `INTERNET` plus die app-interne `DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` aus AndroidX |
| Rauchtest Android-Emulator (Pixel 7, emulator-5554, App-Daten frisch) | PASS 9/9 mit echten Taps: Start, Willkommen überspringen, Heute, Orakel mit Legungsauswahl, drei Karten ziehen, alle aufdecken, speichern, „Neue Legung“ erscheint, kein Absturz und kein ANR im Logcat; Aufnahmen `docs/visual/evidence/v05-testpaket-android.webp` |
| Leistung im Release-Build | NOT RUN: folgt mit der Leistungsmessung vor QG-V05 (D-52, Roadmap §6) |
| Echtes Gerät | NOT RUN: nur Emulator (AGENTS.md) |
