# ISOLATION_REPORT

**Datum:** 26.11.2026 · **Ergebnis:** PASS (mit einem dokumentierten, behobenen Vorfall)

## Arbeitsgrenze

| Prüfung | Ergebnis |
|---|---|
| Neuer Root | `%USERPROFILE%\Documents\PersonalOracle-Web`, neu angelegt, vorher nicht vorhanden |
| Überschneidung mit dem Altprojekt | keine. Der Root liegt nicht im oder unter dem Altpfad, es gibt keine Symlinks oder Junctions. |
| Altprojekt Mirror/Heartvia (`com.energycrafted.mirror`) | nicht gelesen, nicht durchsucht, nicht gebaut, nicht installiert, nicht verändert |
| Wiederverwendung aus dem Altprojekt | keine (siehe `REUSE_MATRIX.md`) |
| Git | eigenes Repository im neuen Root. Remote `emfau88/Arcana` nach Freigabe des Eigentümers. |
| Android-ID | `com.energycrafted.personaloracle.dev`, eigene ID |
| Signierung | Debug-Keystore des Android-SDK (nur lokale Debug-Builds). Keine Schlüssel im Repo (`*.jks`, `*.keystore` ignoriert). Alte Schlüssel nicht berührt. |
| Store / Play Console | kein Zugriff, keine Aktion |

## Android-Emulator

- Nur `emulator-5554` (AVD Pixel 7, API 36), kein physisches Gerät.
- Installiert, gestartet und gelöscht (`pm clear`) wurde ausschließlich `com.energycrafted.personaloracle.dev`. Das Evidence-Skript verweigert andere Pakete und echte Geräte.
- Emulator-Einstellungen (Schriftgröße, Flugmodus, Animationen) wurden vor den Tests erfasst und danach wiederhergestellt: `font 1.0, airplane 0, animator null, transition 1.0, window 1.0`. Kein Reset des Emulators.

## Toolchain (nichts global installiert oder aktualisiert)

| Werkzeug | Version | Quelle |
|---|---|---|
| Node / npm | 22.17.1 / 10.9.2 | vorhanden |
| Git | 2.50.1 | vorhanden |
| JDK | 21.0.6 (Android Studio JBR) | vorhanden, per Befehl gesetztes `JAVA_HOME` |
| Android SDK | Platform 36, Build-Tools 36.0.0 | vorhanden |
| Gradle / AGP | 8.14 / 8.13.0 | lokaler Cache, `--offline` |
| Playwright Chromium | aus dem lokalen Cache | kein Download |

Alle npm-Pakete liegen projektlokal in `node_modules`.

## Vorfall (ehrlich dokumentiert)

`npx prettier --version` hat Prettier 3.10.1 ohne Rückfrage in den globalen npx-Cache geladen (`%LOCALAPPDATA%\npm-cache\_npx\<hash>`). Das war ein Verstoß gegen „keine Installation außerhalb des Projektroots ohne Zustimmung“. Ich habe genau dieses Verzeichnis sofort entfernt und das Entfernen geprüft. Weitere Änderungen außerhalb des Roots gab es nicht. Prettier ist keine Projektabhängigkeit.
