# AGENTS.md — Personal Oracle

## Unverhandelbare Regeln

1. **Greenfield:** Nur im eindeutig genehmigten neuen Projektroot arbeiten. Mirror/Heartvia (`com.energycrafted.mirror`) bleibt unverändert, einschließlich Git, Builds, Daten, Signing und Store. Kein Schreiben in oder unter den Altpfad; keine Symlinks/Junctions zurück in den Altpfad. Keine Ausführung von Build-/Install-/Testbefehlen im alten Repo.
2. **Web-first:** TypeScript, Vite, HTML/CSS, bevorzugt React bei begründetem Bedarf; Capacitor Android früh integrieren. Kein Flutter-Neubau. Ein gemeinsamer Web-Code für Browser und gebündelte Android-App, keine externe Website im Wrapper.
3. Vor Implementierung `docs/briefing/00_START_HERE.md` bis `07_START_PROMPT.md` lesen (oder das übergebene Starterpaket, solange es noch nicht kopiert ist). Produktumfang aus `02_PRODUCT_SPEC.md`; keine spontanen P1/P2-Erweiterungen.
4. G0 selbst abschließen, wenn sicher; G1 mit echtem Browser- und Android-Emulator-Flow liefern und auf ausdrückliche Designfreigabe warten. G2/G3 nach Freigabe selbst prüfen. Vor Upload, Veröffentlichung, Kosten oder Produktionsänderungen immer explizite Freigabe. Kein physisches Handy verwenden.
5. Kein Backend, keine Runtime-KI, kein Tracking, kein Pflichtkonto, keine CDN-Assets im Offline-Kern. Alle privaten Inhalte lokal. Keine Dark Patterns und keine behauptete Vorhersage/Diagnose.
6. Kleine überprüfbare Slices. Tests, echte Screenshots, Build-Artefakte und nachvollziehbare Reports. Kein Mockup als Funktionsbeleg. `PASS`, `FAIL`, `BLOCKED`, `NOT RUN` ehrlich unterscheiden. Niemals fremde Arbeit überschreiben, Tests kaschieren oder ungefragt pushen.
7. Aktualisiere `docs/PROJECT_STATUS.md` und `docs/DECISIONS.md` nach jedem Slice/Gate. Lies den Status bei einem neuen Agentenlauf zuerst. Wenn ein Gate blockiert ist, behebe es oder liefere die sichere verbleibende Arbeit; nicht stillschweigend weitergehen.

Wenn die Dateien noch nicht im neuen Repo liegen, kopiere sie ausschließlich in das neue Repo, nachdem der Pfad sicher verifiziert wurde. Die alte App ist keine Arbeitskopie und kein Fallback-Ziel.
