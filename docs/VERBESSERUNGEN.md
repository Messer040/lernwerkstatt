# Verbesserungsliste

Laufende Liste mit allem, was beim Arbeiten auffällt. Gedacht für kleine Aufgaben zwischendurch.
Regel: Wer etwas bemerkt, trägt es hier ein. Erledigtes wird abgehakt und mit Datum versehen, nicht gelöscht.

Aufwand: S = unter 30 Min., M = eine Sitzung, L = mehrere Sitzungen.

## Wichtig

- [ ] **Messuhr-Zeichnungen überarbeiten (Form und Lage)** (M, 24.11., Kontrolle nach Hinweis von Elias): Betrifft k10c, k10d, k10e, k10m, k10n. Fehler: 1. Bezug A und Messtisch fehlen (k10c, k10e, k10m, k10n). 2. Teile sind nur Linien oder leere Rechtecke, ohne Material (k10e Z-Profil, k10d Leisten). 3. Zeiger stehen bei allen Uhren gleich, egal welcher Wert angezeigt wird. 4. k10m: Text sagt «eine Messuhr wandert», Bild zeigt zwei Uhren. 5. k10d: unklar, was Leiste und was Messschiene ist, Taster ragen in die Leiste. Lösung: Hilfsfunktion `messuhr(...)` mit Messtisch, Bezug A, gefülltem Teil, Taster bis zur Fläche, Zeiger passend zum Wert.
- [ ] **Messuhr-Bilder: Taster ragt in die Leiste** (S, 24.11.): Bei Geradheit (k10d) und Parallelität zeigt der Taster von oben, ragt aber 2 Einheiten in die Leiste hinein. Taster bis zur Oberkante zeichnen. Ausserdem stehen die Werte der nächsten Zeile sehr nah an der Leiste darüber.
- [x] Messuhr bei Rechtwinkligkeit zeigte nach unten statt waagerecht an die Fläche (24.11., Elias bemerkt): behoben, k10c und Aufgabe «Kollege».
- [ ] **Zeichnungstechnik: Antworten abwechslungsreicher machen, für alle Fragen** (L, 24.11.): Test gemacht bei Aufgabe me2 «Muttern und Scheiben» (24.11., Elias prüft). Standard für alle ca. 197 Fragen: 1. Anzahl Antworten je nach Frage (3 bis 5), nicht immer 3. 2. Falsche Antworten sind Fachwörter, die der richtigen Antwort nah sind: gleiche Familie (andere Mutter, andere Sicherung) oder ähnlich klingend (Nutmutter, Nutenstein, Schlitzmutter, Kronenmutter). Keine offensichtlich fremden Teile wie Kegelstift bei einer Mutterfrage (zu leicht, Elias 24.11.). Nicht immer die gleichen Wörter. 3. Die richtige Antwort steht an wechselnden Stellen. Heute steht sie fast überall an erster Stelle (`a:0`). 4. Keine Normnummern in den Antworten (nur in der Erklärung), nie erfundene Nummern, Antworten gleich lang (siehe CLAUDE.md «Regel für Antworten»). 5. Aufpassen: Keine falsche Antwort darf auch richtig sein (z. B. Sicherungsring DIN 471 beim Wälzlager). Vorgehen: ein Kapitel pro Sitzung. Reihenfolge: Maschinenelemente (7 Aufgaben), Bemassung, Masstoleranzen, Form und Lage, Oberfläche, Zeichnungen.
- [ ] **Zeichnungstechnik: Bild zur Frage («Bild zeigen»)** (M, 24.11.): Pro Frage ein Knopf, der eine kleine Zeichnung zum Problem zeigt. Das Bild bleibt nach der Antwort stehen. Mechanismus: Feld `fig` pro Frage (S). Dann Kapitel für Kapitel Bilder zeichnen, zuerst Bemassung. Beispiele von Elias: «Steigende Bemassung erkennt man an …» (Kreis am Ursprung, Masszahlen an den Masshilfslinien) und «Fase 30° statt 45°: Wie bemassen?» (Länge und Winkel getrennt, im Vergleich zu 2 × 45°). Reine Wissensfragen brauchen kein Bild.
- [ ] **Zeichnungstechnik: Erklärung zur gewählten falschen Antwort** (M, 24.11.): Die Sofort-Rückmeldung zeigt die Erklärung zur richtigen Antwort. Besser: pro falsche Option ein eigener Satz «Warum nicht?». Braucht neue Daten (`whyNot`) in den Fragen.
- [ ] **Zeichnungstechnik: Sofort-Rückmeldung auch bei Mehrfach- und Zahlenfragen** (S, 24.11.): Bisher nur bei Fragen mit einer Antwort.
- [ ] **Bruchdarstellung für lange Bilder** (M, Wunsch 19.11.): Lange Teile nach ISO 128 mit Bruchlinie verkürzt zeichnen, Masslinie durchgehend, Mass = wahre Länge (ISO 129). Damit passen Bilder aufs Handy. Baustein in `core/draw/svg.ts`, Regel in `docs/UMZUG.md`.
- [ ] **Formel-Check beim Prüfen** (M, Wunsch 20.11.): Jede Aufgabe listet ihre nötigen Formeln. Nach «Antwort prüfen» anzeigen. Ins Task-Format und als Pflicht in `docs/UMZUG.md`.
- [ ] **Prüfungsnah mischen** (M, Wunsch 20.11.): Wie BBZ-Prüfungen: mit Bild, Strichskizze, reiner Text, Auswahl a–e, Punkte (2 P / 4 P). Vorlagen: privates Repo `unterlagen/bilder/2026-11-20-pruefungen/`.
- [ ] **Drehmoment: Aufgaben vom BBZ-Blatt** (M, 20.11.): Riemenscheibe, Knebel, Pronyscher Zaum, Zahnradtrieb (Moment am grossen Rad = F · r₂), Kragträger mit zwei Kräften. Fehlerwerte: M : r₂ statt F · r₂, mm statt m.

- [ ] **Tür- und Leiterbild nicht massstäblich** (S, 20.11.): Die Tür ist im Bild mindestens 230 px breit, damit die Beschriftungen Platz haben. Leiter: Werte stehen im Infoblock oben links, am Pfeil nur das Symbol. Beim Baustein «Wand» (`boden` mit 30 px) einen eigenen Baustein `wand()` in `core/draw/svg.ts` anlegen, wenn weitere Kapitel (Lagerkräfte, Kettenaufgaben) Wandbilder brauchen.
- [ ] **Kraftpfeil-Beschriftung** (S, 20.11.): Pfeilspitzen sind etwa 16 px breit. Beschriftung neben senkrechten Pfeilen mindestens 16 px versetzen, sonst überlappt die Spitze die Schrift. Im Baustein `kraft` als Parameter abfangen.

- [ ] **Bilder am Handy** (M, neu): Die SVGs haben 520 px Mindestbreite, am Handy muss man seitlich wischen. Möglichkeiten: grössere Schrift im Bild bei schmalem Bildschirm, Hochformat-Varianten oder Zoom per Antippen.
- [ ] **Physik umziehen** (L, neu): ~~An der Wand~~ (erledigt 20.11.), Beschleunigung, ~~Lagerkräfte~~ (erledigt 21.11.), ~~Kettenaufgaben~~ (erledigt 22.11.), ~~Umfangskraft~~, ~~Reibung~~ (erledigt 24.11.), ~~Arbeit, Energie~~ (erledigt 24.11.), ~~Leistung~~ (erledigt 24.11.), ~~Einfache Maschinen~~ (erledigt 24.11.), ~~Beschleunigung~~ (erledigt 24.11.), ~~Bewegungen~~ (erledigt 24.11.), ~~Biegen~~ (erledigt 24.11.), Knobel, Einheiten. Pro Kapitel Fehlerwerte und 3 Tipps ergänzen.
- [ ] **Labor «Wann rutscht die Kiste?»** (M, 24.11.): Der alte Trainer hat im Tab Reibung einen Schieberegler-Versuch (Zugkraft, F_N, μ₀). Im neuen Format gibt es noch keinen Laborbaustein. Erst bauen, wenn mehrere Kapitel Labore brauchen (auch Hebel, Flaschenzug).
- [ ] **Labor «Energie wandelt sich um»** (M, 24.11.): Der alte Trainer hat im Tab Arbeit einen Schieberegler-Versuch (Kugel fällt, W_pot und W_kin als Balken). Fehlt im neuen Format, wie das Reibungs-Labor.
- [ ] **Feder-Bild: Kraft-Weg-Diagramm nur schematisch** (S, 24.11.): Das Dreieck zeigt immer dieselbe Form und nicht die Werte der Aufgabe. Achsen mit F_max und s beschriften.
- [ ] **Ct-Preisfrage ca1** (S, 24.11.): Die Rappen-Frage ergab Werte unter 1 Rp. (Anzeige mit 2 Stellen zu ungenau). Ersetzt durch «Wie oft Treppe steigen für 1 Fr.». Bei kleinen Resultaten künftig so umformulieren.
- [ ] **F_R doppelt belegt** (S, 24.11.): F_R heisst im Kapitel Reibung Reibungskraft, in Kräfte addieren Resultierende (R). Im Buch abgleichen und einheitlich benennen.
- [ ] **Labor «Gleiche Arbeit, andere Zeit»** (M, 24.11.): Der alte Tab Leistung hat Schieberegler für Hubzeit und η mit Leistungsfluss. Fehlt im neuen Format, wie die anderen Labore.
- [ ] **Bild-Erklärung (Stepper) fehlt im neuen Format** (M, 24.11.): Der alte Trainer hat für p1–p6 Schritt-für-Schritt-Erklärungen (EK). Im neuen Format gibt es keinen Stepper-Baustein.
- [ ] **Doppelte Grundaufgaben Elektro** (S, 24.11.): Kapitel Masche hat noch e1–e3 zur Reihenschaltung. Jetzt gibt es ein eigenes Kapitel. Prüfen, ob e1–e3 dort bleiben oder ins Kapitel Reihenschaltung wandern.
- [ ] **Buchwerte-Helfer in den Kern** (S, 24.11.): `buch(b, zufall)` in `elektro/reihenschaltung/aufgaben.ts` liefert beim ersten Mal die Buchwerte. Nach `core/` verschieben und auch in Masche nutzen.
- [ ] **Labor «Goldene Regel am Flaschenzug»** (M, 24.11.): Der alte Trainer hat Schieberegler für n und m (Kraft sinkt, Seilweg wächst, Arbeit bleibt). Fehlt im neuen Format, wie die anderen Labore.
- [ ] **Bild-Erklärung Einfache Maschinen fehlt** (M, 24.11.): Im alten Trainer gab es Schritte für alle Aufgaben (EK). Neu nur Tipps und Lösungen.
- [ ] **Spindelpresse: Beschriftung F_2 nahe am Pfosten** (S, 24.11.): Bei langem Text («F_2 = 12 kN») endet die Schrift am rechten Pfosten. Pfeil weiter links setzen oder Text kleiner.
- [ ] **Scheren-Wagenheber nicht massstäblich** (S, 24.11.): Rhombus mit Faktor 0,45 gezeichnet, damit Beschriftungen Platz haben.
- [ ] **Buchwerte-Helfer `buch` doppelt** (S, 24.11.): Jetzt auch in `einfache-maschinen/aufgaben.ts`. Nach `core/zahl.ts` verschieben (siehe Punkt «Buchwerte-Helfer in den Kern»).
- [ ] **Zeichnungstechnik umziehen** (L, neu): Kap. 7, 9, 10, 11, 12, FL, ME ins neue Format.
- [ ] **Prüfungssimulation über mehrere Kapitel** (M, neu): 15–20 gemischte Aufgaben, Zeitlimit, keine Tipps, Note und Auswertung pro Kapitel.

- [ ] **Elektrotechnik: weitere Kapitel** (L, 24.11.): ~~Reihenschaltung~~ (erledigt 24.11.), Parallelschaltung, gemischte Schaltungen, Spannungsteiler, elektrische Leistung. Das Kapitel `elektro/masche` ist der Anfang (Fach `elektro`).
- [ ] **Elektrotechnik: Labor «Quelle umpolen»** (M, 24.11.): Schieberegler für U02 und R3 mit Schalter gleich/entgegengesetzt, Strompfeil wird dicker oder dünner. Der Prototyp lag als Chat-Grafik vor. Braucht den Laborbaustein (siehe Labor Reibung).
- [ ] **Elektrotechnik: Pfeilrichtung im Buch abgleichen** (S, 24.11.): Im Bild zeigt der blaue Pfeil die Antriebsrichtung der Quelle (Strom raus am Pluspol). Prüfen, ob das Buch den Pfeil gleich zeichnet, und im Zweifel anpassen.
- [ ] **Elektrotechnik: Begriff «Teilspannung»** (S, 24.11.): Im Kapitel heissen U1 bis U3 durchgehend Teilspannung, U01 und U02 Erzeugerspannung. Mit dem Buch abgleichen (Begriff Spannungsabfall).

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
- [ ] **Labor «Kraft, Masse, Beschleunigung»** (M, 24.11.): Der alte Tab hat nur Aufgaben, aber ein Schieberegler-Versuch (m und a ändern, F wächst) würde F = m · a zeigen. Braucht den Laborbaustein.
- [ ] **Aufzug-Bild nicht massstäblich** (S, 24.11.): Schacht und Kabine sind schematisch. Kraftpfeile haben immer dieselbe Länge, auch wenn F_S grösser oder kleiner als F_G ist. Pfeillängen aus den Werten ableiten.
- [ ] **Heben-Bild: Label F_G berührt Pfeilspitze** (S, 24.11.): Im Bild `heben` (Aufgabe b14) steht F_G direkt an der Pfeilspitze. Siehe Punkt «Kraftpfeil-Beschriftung».
- [ ] **Bewegungen: Bilder nicht massstäblich** (S, 24.11.): Hallenkran-Pfeile mit Faktor 5 px je m/min, Förderband und Hebebühne ohne Massstab. Am Handy muss man seitlich wischen (siehe «Bilder am Handy»).
- [ ] **Bewegungen: alter Hallenkran im Lager-Modus** (S, 24.11.): Der alte `drawHallenkran` hatte einen Modus mit Lagerkräften (Aufgabe b8). Im neuen Kapitel gibt es nur den Geschwindigkeits-Modus. Prüfen, ob das Kapitel Lagerkräfte den Kran schon eigen zeichnet.
- [ ] **Bewegungen: Bild-Erklärung (Stepper) fehlt** (M, 24.11.): Der alte Trainer hatte für g7 und die Kreisaufgaben Schritt-für-Schritt-Bilder. Neu nur Tipps, Lösung und ein Lösungsbild bei v29.
- [ ] **Bewegungen: Buch-Schaubild Drehzahl** (S, 24.11.): Buchaufgabe 2 liest die Drehzahlen aus einem Schaubild. Im Kapitel (v20) rechnet man sie. Ein Schaubild-Baustein mit Ablesen fehlt.
- [ ] **Biegen: Radius im Bild nicht gezeichnet** (S, 24.11.): Die Bilder zeigen Schenkel mit runden Ecken, aber nicht den Innenradius r. Nur als Zahl im Infofeld.
- [ ] **Biegen: Faustregel v ≈ 2·s nur bei r ≈ s** (S, 24.11.): Bei r = 4·s liegt v schon 40 % darüber. Aufgabe b4 nennt das, die Formelkarte warnt. Im Buch die Gültigkeit der Faustregel abgleichen.
- [ ] **Biegen: Winkel über 165°** (S, 24.11.): Die Formel setzt v = 0 ab β = 165°. Aufgaben nutzen höchstens 160°. Im Buch prüfen, ob die Grenze so gilt.
