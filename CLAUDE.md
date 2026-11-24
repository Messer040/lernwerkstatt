# Arbeitsregeln für Claude in diesem Repo

Elias lernt Konstrukteur EFZ (Schweiz). Antworten in einfachem, klarem Deutsch, kurze Sätze, Schweizer ss, Warnungen mit «Warnung:». Er arbeitet oft am Handy.

## Projekt
- **Neu (Hauptweg ab jetzt):** `app/` = Vite + TypeScript, Build nach `neu/`. Aufbau und Aufgabenformat: `docs/ARCHITEKTUR.md`. Neue Kapitel nur noch hier. **Kapitel umziehen: `docs/UMZUG.md` befolgen.** Nach Änderungen: `cd app && npm test && npm run build`, `neu/` mit committen. Nichts speichern, keine Freischaltung, freie Themenwahl.
- Alt (bleibt online, bis umgezogen):
  - `physik/index.html`: Physik-Trainer. Aufgabe = {id, lvl, src, title, gen(), draw(p), text(p), asks(p)=[{k,unit,v}], hints(p), sol(p), solDraw?}. Tabs in TOPICS, Pools in SETS, Abschnitte secs.<key>. Kapiteltest: addKapTest().
  - `zeichnung/src/index.html`: Zeichnungstechnik-Trainer. Aufgabe = {id, kap, type, title, text, draw(), questions:[{q,opts,a}|{q,num:1,a,tol}]} oder entry. Kapitel in KAPS. Nach Änderungen `python3 zeichnung/src/build.py` ausführen.
- Stand und Buchdaten: `docs/STAND_*.md`. Nach jedem Paket ergänzen.
- **Planung:** `docs/LEHRPLAN.md` = Semesterplan der Schule (BBZ BL) und Abdeckung im Tool. Vor jedem neuen Kapitel lesen. Nach jedem Kapitel die Tabelle «Abdeckung» nachführen.

## Rezept pro Kapitel (nicht nachfragen)
1. Formelkarte. 2. Aufgaben nach Buch (eigene Werte erlaubt, Annahmen in den Aufgabentext). 3. 4–6 kreative Aufgaben: neue Situation, umgekehrt gefragt, kombiniert, Fehler finden, Kopfrechnen. 4. Eigene Varianten. 5. Kapiteltest läuft automatisch mit.
- Buchtreue ist unwichtig. Elias nicht um Buchvergleich bitten.
- Immer ein Bauteilbild zeichnen, eigene Motive. Feste Farben: Kräfte magenta, Resultierende violett, Längen blau, Momente grün, Energie/Geschwindigkeit orange.
- Alle Resultate im Code rechnen und an Buchbeispielen prüfen.

## Verbesserungsliste
- `docs/VERBESSERUNGEN.md` führen. Alles, was beim Arbeiten auffällt (Fehler, Ideen, Schulden), sofort dort eintragen, mit Aufwand S/M/L. Erledigtes abhaken mit Datum.
- Auf «mach was von der Liste» oder «Verbesserungen» hin: oberste offene S-Punkte zuerst erledigen.

## Ablauf
1. Ändern. 2. Tests: neu `cd app && npm test && npm run build`; alt `tests/` (alle «fb ok», keine JS-Fehler). 3. Neue Zeichnungen per Screenshot prüfen (keine Überlappungen, Handy-Breite). 4. Commit mit kurzer deutscher Nachricht, push auf `main`. 5. Elias kurz berichten.

## Alte Artifacts als Quelle
- Liste aller alten Lern-Artifacts mit Links: README im privaten Repo `Messer040/lernwerkstatt-unterlagen`.
- Beim Ausbau eines neuen Themas (Lager, Wellen, Werkstoffe, Festigkeit, Elektro, ABU) zuerst die passenden alten Artifacts mit read_artifact öffnen. Gute Erklärungen, Aufgaben und Grafiken übernehmen und verbessern. Kein 1:1-Kopieren.
- Überholt (nicht mehr nötig): Kräfte-Trainer, Kräfte Lerner, Kräfte zeichnerisch lösen, Form- und Lagetoleranzen (alt), Wärmebehandlung (alt).
- Neue Buch-PDFs und Fotos immer ins private Repo legen (`unterlagen/pdf/`, `unterlagen/bilder/<datum>/`), nie ins öffentliche.
