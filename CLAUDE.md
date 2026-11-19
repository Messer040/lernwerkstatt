# Arbeitsregeln für Claude in diesem Repo

Elias lernt Konstrukteur EFZ (Schweiz). Antworten in einfachem, klarem Deutsch, kurze Sätze, Schweizer ss, Warnungen mit «Warnung:». Er arbeitet oft am Handy.

## Projekt
- `physik/index.html`: Physik-Trainer. Aufgabe = {id, lvl, src, title, gen(), draw(p), text(p), asks(p)=[{k,unit,v}], hints(p), sol(p), solDraw?}. Tabs in TOPICS, Pools in SETS, Abschnitte secs.<key>. Kapiteltest: addKapTest().
- `zeichnung/src/index.html`: Zeichnungstechnik-Trainer. Aufgabe = {id, kap, type, title, text, draw(), questions:[{q,opts,a}|{q,num:1,a,tol}]} oder entry. Kapitel in KAPS. Nach Änderungen `python3 zeichnung/src/build.py` ausführen.
- Stand und Buchdaten: `docs/STAND_*.md`. Nach jedem Paket ergänzen.

## Rezept pro Kapitel (nicht nachfragen)
1. Formelkarte. 2. Aufgaben nach Buch (eigene Werte erlaubt, Annahmen in den Aufgabentext). 3. 4–6 kreative Aufgaben: neue Situation, umgekehrt gefragt, kombiniert, Fehler finden, Kopfrechnen. 4. Eigene Varianten. 5. Kapiteltest läuft automatisch mit.
- Buchtreue ist unwichtig. Elias nicht um Buchvergleich bitten.
- Immer ein Bauteilbild zeichnen, eigene Motive. Feste Farben: Kräfte magenta, Resultierende violett, Längen blau, Momente grün, Energie/Geschwindigkeit orange.
- Alle Resultate im Code rechnen und an Buchbeispielen prüfen.

## Ablauf
1. Ändern. 2. Tests in `tests/` laufen lassen (alle «fb ok», keine JS-Fehler). 3. Neue Zeichnungen per Screenshot prüfen (keine Überlappungen, Handy-Breite). 4. Commit mit kurzer deutscher Nachricht, push auf `main`. 5. Elias kurz berichten.

## Alte Artifacts als Quelle
- Liste aller alten Lern-Artifacts mit Links: README im privaten Repo `Messer040/lernwerkstatt-unterlagen`.
- Beim Ausbau eines neuen Themas (Lager, Wellen, Werkstoffe, Festigkeit, Elektro, ABU) zuerst die passenden alten Artifacts mit read_artifact öffnen. Gute Erklärungen, Aufgaben und Grafiken übernehmen und verbessern. Kein 1:1-Kopieren.
- Überholt (nicht mehr nötig): Kräfte-Trainer, Kräfte Lerner, Kräfte zeichnerisch lösen, Form- und Lagetoleranzen (alt), Wärmebehandlung (alt).
- Neue Buch-PDFs und Fotos immer ins private Repo legen (`unterlagen/pdf/`, `unterlagen/bilder/<datum>/`), nie ins öffentliche.
