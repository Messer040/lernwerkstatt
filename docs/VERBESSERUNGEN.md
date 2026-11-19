# Verbesserungsliste

Laufende Liste mit allem, was beim Arbeiten auffällt. Gedacht für kleine Aufgaben zwischendurch.
Regel: Wer etwas bemerkt, trägt es hier ein. Erledigtes wird abgehakt und mit Datum versehen, nicht gelöscht.

Aufwand: S = unter 30 Min., M = eine Sitzung, L = mehrere Sitzungen.

## Wichtig

- [ ] **Auswahl-Optionen mischen** (S, neu): Die richtige Antwort steht heute immer an derselben Stelle (d10 oben, d11 Mitte). Die Optionen beim Anzeigen mischen, `a` mitführen.
- [ ] **Bilder am Handy** (M, neu): Die SVGs haben 520 px Mindestbreite, am Handy muss man seitlich wischen. Möglichkeiten: grössere Schrift im Bild bei schmalem Bildschirm, Hochformat-Varianten oder Zoom per Antippen.
- [ ] **Physik umziehen** (L, neu): Kräfte addieren, Kräfte zerlegen, An der Wand, Beschleunigung, Lagerkräfte, Kettenaufgaben, Umfangskraft, Reibung, Arbeit, Leistung, Einfache Maschinen, Biegen, Bewegungen, Knobel, Einheiten. Pro Kapitel Fehlerwerte und 3 Tipps ergänzen.
- [ ] **Zeichnungstechnik umziehen** (L, neu): Kap. 7, 9, 10, 11, 12, FL, ME ins neue Format.
- [ ] **Prüfungssimulation über mehrere Kapitel** (M, neu): 15–20 gemischte Aufgaben, Zeitlimit, keine Tipps, Note und Auswertung pro Kapitel.

## Mittel

- [ ] **Offline-App** (M, neu): Service Worker, damit `neu/` ohne Netz läuft. `manifest.webmanifest` auf `neu/` zeigen lassen, sobald neu der Hauptweg ist.
- [ ] **Lernkarten-Hinweis «hilfreich» anzeigen** (S, neu): Das Feld `hilfreich` ist in den Daten, wird aber noch nicht angezeigt. Als Links unter dem Ziel zeigen.
- [ ] **Neue Aufgabentypen Physik** (L, neu): Pfeil setzen, Freikörperbild, Kräfteplan, im Bild tippen (Plan, Abschnitt «Aufgabentypen pro Fach»).
- [ ] **Zeichnungs-Baukasten** (L, neu): Bemassen, Toleranzrahmen bauen, Bezüge setzen, Fehler in Zeichnung antippen, Teilpunkte pro Element.
- [ ] **Papier-Modus / Drucken** (M, neu): Test als druckbare Seite mit Lösungen hinten.
- [ ] **Suche über alle Aufgaben** (M, neu): nach Stichwort, z. B. «Zahnrad» oder «Passung».
- [ ] **Bild-Beschreibungen** (S, neu): `blatt(h, titel)` bekommt heute meist einen allgemeinen Titel. Pro Aufgabe einen genaueren Titel für Screenreader setzen.
- [ ] **Bildtest automatisch** (M, neu): Playwright-Test, der jedes Bild bei 390 px aufnimmt und überlappende Beschriftungen meldet (Textboxen gegeneinander prüfen).

## Klein

- [ ] **Schubkarre: Label F_G liegt auf der Kiste** (S, neu, Bild `schubkarre`): lesbar, aber Label besser rechts neben den Pfeil ausserhalb der Kiste.
- [ ] **Formelkarte als eigene Seite** (S, neu): heute nur aufklappbar im Kapitel. Zusätzlich eine Seite mit allen Formeln eines Fachs.
- [ ] **CI-Prüfung «neu/ aktuell»** (S, neu): Der Workflow vergleicht den Build mit `neu/`. Falls das wegen anderer Hashes einmal falsch Alarm schlägt, Schritt entfernen und stattdessen per Action bauen und veröffentlichen.
- [ ] **Aufräumen im Repo-Ordner** (S, alt): `full.png`, `m_bau.png`, `m_wahl.png` liegen ungetrackt im Hauptordner. Löschen oder nach `docs/` verschieben.
- [ ] **Tiefgestellte Zeichen vereinheitlichen** (S, alt): Im Text mal `F₁`, mal `F_1`. Eine Schreibweise festlegen.
- [ ] **Tausender-Apostroph im alten Physik-Trainer** (S, alt): Neu zeigt 39'000, alt 39000. Erledigt sich mit dem Umzug.

## Erledigt

- [x] 19.11.2026: Neues Gerüst Vite + TypeScript, Kapitel Drehmoment umgezogen, Fehlerwerte, 3-stufige Tipps, Kapiteltest mit Note.
- [x] 19.11.2026: Schweizer Tausender-Apostroph in `fmt()`.
- [x] 19.11.2026: Label «m = … kg» in der Schubkarre überlappte die Kistenkante.
