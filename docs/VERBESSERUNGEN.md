# Verbesserungsliste

Laufende Liste mit allem, was beim Arbeiten auffällt. Gedacht für kleine Aufgaben zwischendurch.
Regel: Wer etwas bemerkt, trägt es hier ein. Erledigtes wird abgehakt und mit Datum versehen, nicht gelöscht.

Aufwand: S = unter 30 Min., M = eine Sitzung, L = mehrere Sitzungen.

## Wichtig

- [ ] **Bruchdarstellung für lange Bilder** (M, Wunsch 19.11.): Lange Teile nach ISO 128 mit Bruchlinie verkürzt zeichnen, Masslinie durchgehend, Mass = wahre Länge (ISO 129). Damit passen Bilder aufs Handy. Baustein in `core/draw/svg.ts`, Regel in `docs/UMZUG.md`.
- [ ] **Formel-Check beim Prüfen** (M, Wunsch 20.11.): Jede Aufgabe listet ihre nötigen Formeln. Nach «Antwort prüfen» anzeigen. Ins Task-Format und als Pflicht in `docs/UMZUG.md`.
- [ ] **Prüfungsnah mischen** (M, Wunsch 20.11.): Wie BBZ-Prüfungen: mit Bild, Strichskizze, reiner Text, Auswahl a–e, Punkte (2 P / 4 P). Vorlagen: privates Repo `unterlagen/bilder/2026-11-20-pruefungen/`.
- [ ] **Drehmoment: Aufgaben vom BBZ-Blatt** (M, 20.11.): Riemenscheibe, Knebel, Pronyscher Zaum, Zahnradtrieb (Moment am grossen Rad = F · r₂), Kragträger mit zwei Kräften. Fehlerwerte: M : r₂ statt F · r₂, mm statt m.

- [ ] **Tür- und Leiterbild nicht massstäblich** (S, 20.11.): Die Tür ist im Bild mindestens 230 px breit, damit die Beschriftungen Platz haben. Leiter: Werte stehen im Infoblock oben links, am Pfeil nur das Symbol. Beim Baustein «Wand» (`boden` mit 30 px) einen eigenen Baustein `wand()` in `core/draw/svg.ts` anlegen, wenn weitere Kapitel (Lagerkräfte, Kettenaufgaben) Wandbilder brauchen.
- [ ] **Kraftpfeil-Beschriftung** (S, 20.11.): Pfeilspitzen sind etwa 16 px breit. Beschriftung neben senkrechten Pfeilen mindestens 16 px versetzen, sonst überlappt die Spitze die Schrift. Im Baustein `kraft` als Parameter abfangen.

- [ ] **Bilder am Handy** (M, neu): Die SVGs haben 520 px Mindestbreite, am Handy muss man seitlich wischen. Möglichkeiten: grössere Schrift im Bild bei schmalem Bildschirm, Hochformat-Varianten oder Zoom per Antippen.
- [ ] **Physik umziehen** (L, neu): ~~An der Wand~~ (erledigt 20.11.), Beschleunigung, ~~Lagerkräfte~~ (erledigt 21.11.), ~~Kettenaufgaben~~ (erledigt 22.11.), ~~Umfangskraft~~, ~~Reibung~~ (erledigt 24.11.), Arbeit, Leistung, Einfache Maschinen, Biegen, Bewegungen, Knobel, Einheiten. Pro Kapitel Fehlerwerte und 3 Tipps ergänzen.
- [ ] **Labor «Wann rutscht die Kiste?»** (M, 24.11.): Der alte Trainer hat im Tab Reibung einen Schieberegler-Versuch (Zugkraft, F_N, μ₀). Im neuen Format gibt es noch keinen Laborbaustein. Erst bauen, wenn mehrere Kapitel Labore brauchen (auch Hebel, Flaschenzug).
- [ ] **F_R doppelt belegt** (S, 24.11.): F_R heisst im Kapitel Reibung Reibungskraft, in Kräfte addieren Resultierende (R). Im Buch abgleichen und einheitlich benennen.
- [ ] **Zeichnungstechnik umziehen** (L, neu): Kap. 7, 9, 10, 11, 12, FL, ME ins neue Format.
- [ ] **Prüfungssimulation über mehrere Kapitel** (M, neu): 15–20 gemischte Aufgaben, Zeitlimit, keine Tipps, Note und Auswertung pro Kapitel.

## Mittel

- [ ] **Neue Kapitel aus BBZ-Prüfungen** (L, 20.11.): Druckfestigkeit/Flächenpressung, Zugfestigkeit/Beanspruchungsarten, Mathematik-Repetition (Gewichtskraft, Pythagoras, Anschnittlänge 118°, gestreckte Länge, Flächen).

- [ ] **Offline-App** (M, neu): Service Worker, damit `neu/` ohne Netz läuft. `manifest.webmanifest` auf `neu/` zeigen lassen, sobald neu der Hauptweg ist.
- [ ] **Lernkarten-Hinweis «hilfreich» anzeigen** (S, neu): Das Feld `hilfreich` ist in den Daten, wird aber noch nicht angezeigt. Als Links unter dem Ziel zeigen.
- [ ] **Neue Aufgabentypen Physik** (L, neu): Pfeil setzen, Freikörperbild, Kräfteplan, im Bild tippen (Plan, Abschnitt «Aufgabentypen pro Fach»).
- [ ] **Zeichnungs-Baukasten** (L, neu): Bemassen, Toleranzrahmen bauen, Bezüge setzen, Fehler in Zeichnung antippen, Teilpunkte pro Element.
- [ ] **Papier-Modus / Drucken** (M, neu): Test als druckbare Seite mit Lösungen hinten.
- [ ] **Suche über alle Aufgaben** (M, neu): nach Stichwort, z. B. «Zahnrad» oder «Passung».
- [ ] **Bild-Beschreibungen** (S, neu): `blatt(h, titel)` bekommt heute meist einen allgemeinen Titel. Pro Aufgabe einen genaueren Titel für Screenreader setzen.
- [ ] **Bildtest automatisch** (M, neu): Playwright-Test, der jedes Bild bei 390 px aufnimmt und überlappende Beschriftungen meldet (Textboxen gegeneinander prüfen).

## Klein

- [ ] **Vorschau: Bilder mit festen Zufallswerten** (S, neu): Die Vorschaubilder ziehen bei jedem Laden neue Zahlen. Für ein ruhigeres Bild die Werte der Vorschau fest halten (z. B. Mitte der Bereiche).

- [ ] **Design: Schriftfeld am Handy** (S, neu): Bricht auf zwei Zeilen um, das ist ok. Prüfen, ob «Massstab» am Handy weggelassen werden soll.
- [ ] **Design: Formelkarte auf der Aufgabenseite am Handy** (S, neu): Sie steht unter der Aufgabe und ist zugeklappt. Besser wäre ein Knopf «Formeln» oben, der sie als Blatt öffnet.
- [ ] **Design: Inspector-Warnung «rainbow-chart»** (–, bewusst): Die Bauteilbilder nutzen 5 feste Farben (Kraft, Länge, Moment, Resultierende, Energie). Das ist der Farbcode des Trainers und bleibt.

- [ ] **Schubkarre: Label F_G liegt auf der Kiste** (S, neu, Bild `schubkarre`): lesbar, aber Label besser rechts neben den Pfeil ausserhalb der Kiste.
- [ ] **Formelkarte als eigene Seite** (S, neu): heute nur aufklappbar im Kapitel. Zusätzlich eine Seite mit allen Formeln eines Fachs.
- [ ] **CI-Prüfung «neu/ aktuell»** (S, neu): Der Workflow vergleicht den Build mit `neu/`. Falls das wegen anderer Hashes einmal falsch Alarm schlägt, Schritt entfernen und stattdessen per Action bauen und veröffentlichen.
- [ ] **Aufräumen im Repo-Ordner** (S, alt): `full.png`, `m_bau.png`, `m_wahl.png` liegen ungetrackt im Hauptordner. Löschen oder nach `docs/` verschieben.
- [ ] **Tiefgestellte Zeichen vereinheitlichen** (S, alt): Im Text mal `F₁`, mal `F_1`. Eine Schreibweise festlegen.
- [ ] **Tausender-Apostroph im alten Physik-Trainer** (S, alt): Neu zeigt 39'000, alt 39000. Erledigt sich mit dem Umzug.

- [ ] **Formelzeichen F_R bei Reibung** (S, neu): Im Kapitel «Kräfte addieren» heisst die Resultierende durchgehend F_r. Im Kapitel Reibung F_R für die Reibkraft beibehalten oder zu F_Reib ändern.
- [ ] **Bilder am Handy scrollen waagrecht** (S, neu): `.blatt .bild svg` hat `min-width: 520px`. Prüfen, ob schmalere Bilder mit grösserer Schrift besser lesbar wären.
- [ ] **Lagerkräfte: Labor und Bild-Erklärung fehlen** (M, 21.11.): Im alten Trainer gab es ein Labor «Last verschieben» (Regler, F_A und F_B als Balken) und Schritt-Bilder pro Aufgabe. Neu gibt es nur Tipps und Lösungsbilder. Labor als eigene Karte oder Baustein nachbauen.
- [ ] **Lagerkräfte: Vorzeichen statt Betrag** (S, 21.11.): Negative Lagerkräfte werden als Betrag plus Auswahl «nach oben/unten» gefragt (l16, l17), weil der Test nur positive Zahlen zulässt. Prüfen, ob Eingabe mit Minus besser lernt.
- [ ] **Lagerkräfte: Hallenkran und Anhänger** (S, 21.11.): Bild l21 (Anhänger) hat enge Bemassung unten (l und x-Mass übereinander) und «B» liegt auf dem Rad. Hallenkran l31: Katze im Fragebild bei 0,8 · l, damit die Beschriftung F_2 nicht das Seil kreuzt.
- [ ] **Zerlegen: Erklärschritte fehlen** (M, neu): Im alten Trainer führten Schritt-Bilder (Kräfteparallelogramm, `drawPara`/`PF`) durch jede Zerlegung. Neu gibt es nur Tipps und ein Lösungsbild bei z1 und z15. Parallelogramm-Bild als Baustein in `svg.ts` nachbauen.
- [ ] **Schrift auf Schraffur: Halo als Baustein** (S, neu): In `kraefte-zerlegen/bilder.ts` steht lokal `HALO` (weisser Rand um Schrift). Als Option von `txt()` nach `svg.ts` verschieben und bei V-Führung, Keil, Schrägrad nutzen.
- [ ] **Zerlegen: Stehleiter-Label bei engem Winkel** (S, neu): `spreiz` setzt α neben die Spitze, wenn α < 80°. Bei sehr engem Winkel (< 20°) prüfen, ob F₁/F₂ noch Platz haben.
- [ ] **Hubseil-Bild: F_max-Label** (S, neu, Bild `hubseil`): Label «F_max» liegt dicht am Strang. Beim nächsten Seil-Kapitel prüfen.

- [ ] **Kettenaufgaben: Zwischenwerte als Auswahl** (M, 22.11.): Bei langen Ketten (ke1: 7 Teilfragen) hilft ein «Zwischenergebnis prüfen»-Knopf pro Teilfrage. Heute gibt es nur Prüfen am Ende.
- [ ] **Kettenaufgaben: Bild-Erklärung fehlt** (M, 22.11.): Im alten Trainer gab es Schritt-Bilder (Dominokette). Neu nur Lösungsbild bei ke1–ke4, ke6.

- [ ] **Umfangskraft: Labor fehlt** (M, 24.11.): Das alte Labor «Gleiches Drehmoment, anderer Durchmesser» (zwei Schieberegler) ist noch nicht im neuen Trainer. Neue Kapitel haben noch keinen Platz für interaktive Labore.
- [ ] **Umfangskraft: Buchwerte nicht fest** (S, 24.11.): Im alten Trainer kam die erste Aufgabe mit den Buchwerten (bk). Neu sind alle Werte zufällig. Bei Bedarf die Buchwerte als erste Ziehung ergänzen.
- [ ] **Umfangskraft: Seiltrommel-Bild nicht massstäblich** (S, 24.11.): Zähnezahl im Bild nur Optik (8 bis 46 Zähne). Bei der Montagepresse ist z_2 = 48 fest gezeichnet.

## Erledigt

- [x] 24.11.2026: Kapitel «Umfangskraft» umgezogen (u1–u22: 17 alte Aufgaben + 5 neue: Was wäre wenn u18, Umgekehrt u19, Schätzen u20, Fehler finden u21, Bild deuten u22). Dabei gefunden und behoben: Alte Aufgabe cu3 (Zahnrad auf der Welle) erlaubte a = l : 2. Dann sind F_A und F_B gleich gross und ein vertauschter Hebelarm bleibt unbemerkt. Neu: l aus 400, 500, 600 mm. Alte Aufgabe cu2 hatte einen orangen Kasten in der Oberfläche. Neu: Zeilen mit Formelfarbe. Neue Bausteine in `svg.ts`: `zahnrad`, `scheibe`, `radSeite`, `geschw`, `mittellinie`.

- [x] 22.11.2026: Kapitel «Kettenaufgaben» umgezogen (ke1–ke12: 6 alte + 6 neue: Schätzen ke7, Umgekehrt ke8, Was wäre wenn ke9, Fehler finden ke10–ke12). Dabei gefunden und behoben: Alte Aufgabe ke1 (Wandkonsole) erlaubte a = l. Dann ist F_Sy = F und F_Ay = 0, und die Antwort 0 ist nicht prüfbar. Neu: a höchstens 0,75 · l. Alte Aufgaben ke3 und ke5 hatten bei a = l : 2 gleich grosse Lagerkräfte F_A und F_B. Neu: dieser Fall wird ausgeschlossen. Alte Aufgabe ke6 erlaubte β = 45°, dann sind sin β und cos β gleich und der Fehlwert fällt mit der richtigen Antwort zusammen. Neu: β aus 30°, 40°, 50°, 60°.

- [x] 21.11.2026: Kapitel «Lagerkräfte» umgezogen (l1–l32: 26 alte Aufgaben aus Register, Kreativ und Buch + 6 neue: Fehler finden l13 und l29, Was wäre wenn l14, Umgekehrt l15, Schätzen l22, Begründen l23). Dabei gefunden: Alte Aufgabe «Träger mit Kragarm» hatte ein negatives F_A als Antwort. Neu: Betrag plus Richtung. Alte Feder-Aufgabe (b5) erlaubte Fehlwerte, die zu nah an der richtigen Antwort lagen. F_3 jetzt 200 bis 500 N.

- [x] 20.11.2026: Kapitel «Kräfte zerlegen» umgezogen (z1–z22, 18 alte + 4 neue: Schätzen z19, Fehler finden z22, Umgekehrt z20, Was wäre wenn z21). Dabei gefunden und behoben: Im alten Trainer standen die Normalkraft-Pfeile der V-Führung (zb5) und der Keilspanner-Pfeil F_NB nicht senkrecht zur Fläche. Neu gezeichnet. Der alte Trainer bleibt unverändert. Neuer Baustein `stab` in `svg.ts`, `ref` wird exportiert.

- [x] 19.11.2026: Kapitel «Kräfte addieren» umgezogen (a1–a17). Dabei gefunden und behoben: Alte Aufgabe «Hubseil: Wie gross darf α sein?» (ck2) gab bei F = 8 kN und F_G = 18 kN NaN, weil F_G > 2 · F. Neu: F ab 10 kN. Neue Bausteine in `svg.ts`: `kraftWinkel`, `seil`, `kraefteplan`, `saeulen`.

- [x] 19.11.2026: Vorschau «Weitere Aufgaben» unter der Formelkarte: zugeschnittene Bauteilbilder, Stufe, aktuelle Aufgabe markiert. Handy: waagrechter Streifen. Dabei behoben: rechte Spalte lief am Handy über den Rand.

- [x] 19.11.2026: Neues Design (Stil «Achromatic ledger», Schrift Geist): farblose Oberfläche, Farbe nur in Bildern und Formeln, Zeichnungsblatt mit Schriftfeld, Aufgabenliste plus Einzelansicht mit Blättern, kommende Kapitel als «folgt». Inspector: vorher 2 FAIL / 5 WARN, nachher 0 FAIL.
- [x] 19.11.2026: Auswahl-Optionen werden gemischt.

- [x] 19.11.2026: Neues Gerüst Vite + TypeScript, Kapitel Drehmoment umgezogen, Fehlerwerte, 3-stufige Tipps, Kapiteltest mit Note.
- [x] 19.11.2026: Schweizer Tausender-Apostroph in `fmt()`.
- [x] 19.11.2026: Label «m = … kg» in der Schubkarre überlappte die Kistenkante.
