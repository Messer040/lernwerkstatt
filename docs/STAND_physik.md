# STAND Physik-Trainer (Elias) – 16.11.2026
- Quelle: /home/claude/physik/index.html (eine Datei, kein Build). Test: python3 test.py (füllt alle Lösungen ein, Screenshot full.png).
- Stil nach seinem PDF «Kraefte-Zeichnungen»: Geräte, Hebel hellblau, Kräfte magenta, Resultierende violett, Längen blau, Momente grün, Gestell schraffiert.
- Buch: Rechenbuch Metall, Technische Physik (34. Aufl. 2024 S). Reihenfolge: Kräfte (Darstellen, grafisch, rechnerisch, Beschleunigungskraft, Gewichtskraft, Drehmoment/Hebelgesetz, Lagerkräfte, Umfangskraft, Reibung) -> Arbeit, Energie, Leistung, Wirkungsgrad, Einfache Maschinen, Rollen/Flaschenzüge -> Fluidmechanik -> Werkstoffprüfung -> Festigkeitslehre.
- Fertig: Register «Kräfte addieren» (Labor + k1–k5), «Drehmoment, Hebelgesetz» (2 Labore + d1–d9).
- Aufgabenformat: {id,lvl,title,gen,draw,text,asks,hints,sol,solDraw?}; taskCard() rendert; neue Themen = neues Array + section in TOPICS.
- Nächstes Paket B: Lagerkräfte (Labor Träger mit verschiebbarer Last; Aufgaben: mittig, aussermittig, zwei Lasten, Welle mit Zahnrad, Spannpratze, Kragarm, Kran mit Laufkatze).
- Danach: Umfangskraft, Reibung, Arbeit/Energie (potenzielle Energie), Leistung/Wirkungsgrad, Flaschenzüge.

## Paket B ERLEDIGT (16.11., ~21:20)
- Register «Lagerkräfte»: Labor (verschiebbare Last) + l1–l7 (mittig, aussermittig, Welle 2 Kräfte, Kranbahn mit Masse, Spannpratze, Kragarm mit negativem F_A, Eigengewicht).
- drawBeam(p,o) mit o.segs/o.ex/o.tot/o.RA/o.RB/o.negA; drawPratze. Artifact-Slug 62f77965-996f-4840-a47b-b7b3d03046d8.
- Backup vor Paket B: index.paketA.html.
## Nächstes Paket C: Umfangskraft und Drehmoment + Reibung. Danach D: Arbeit, Energie (potenziell), Leistung, Wirkungsgrad. E: Rollen, Flaschenzüge.

## Paket C ERLEDIGT (16.11., ~21:30)
- Register «Umfangskraft» (Labor + u1–u5: Riemenscheibe, Zahnrad, Zahnradpaar, Seiltrommel+Zahnrad, Fahrradantrieb) und «Reibung» (Labor Haft/Gleit + r1–r5: Kiste, Reibungszahl, Haft/Gleit, Schraubstock 2 Flächen, Backenbremse).
- Toleranz Prüfung: 1,5 %, bei Werten < 5 mind. ±0,006. Backup: index.paketB.html. t3.py <ids> macht Einzel-Screenshots.
- Offen: Formelzeichen-Konflikt F_R (Resultierende vs. Reibung) mit Buch abgleichen.
## Nächstes Paket D: Arbeit, Energie (potenzielle Energie), Leistung, Wirkungsgrad. Dann E: Einfache Maschinen, Rollen, Flaschenzüge.

## Paket D ERLEDIGT (16.11., ~21:40) – 44 Aufgaben, 7 Register
- Kräfte addieren: + Karte «Wann Sinus, wann Kosinus?» + k6 (Winkel zur Waagrechten), k7 (Winkel zur Senkrechten).
- Register «Arbeit, Energie» (Labor Energieumwandlung + a1–a5) und «Leistung, Wirkungsgrad» (Labor + p1–p6). Farbe orange (CW) für W, P, v.
- fmt() entfernt jetzt Endnullen. Backup: index.paketC.html.
## Nächstes Paket E: Einfache Maschinen (schiefe Ebene, Keil, Schraube), Rollen und Flaschenzüge. Danach evtl. Bewegungen (v, a), Fluidmechanik (Druck, Kolben), Festigkeitslehre (Zug, Druck, Flächenpressung, Abscherung).

## Verbesserungsrunde ERLEDIGT (16.11., ~21:50)
- taskCard neu: diagnose() erkennt Faktor 1000/100/10, 3,6, 9,81, 2, 4, Vorzeichen, vertauschte Felder. Enter = Prüfen.
- Prüfungsmodus (Register «Prüfung»): 8 gemischte Aufgaben (2/4/2), keine Tipps, Auswertung mit Punkten + Lösungswegen. Exam-Karten haben id exam-<id>, schreiben nicht in __cur.
- Tabs zeigen Fortschritt n/N; Register «Einheiten»; Reset-Knopf; Handy: Zeichnungen min. 520 px breit, seitlich wischbar.
- Tests: test.py (44 ok), t4.py (Regler, Diagnose, Prüfung, Handy). Backup index.paketD.html.
- FLT-Artifact: Zähler 16, Symbolname «Zylinderform (Zylindrizität)».

## Paket E ERLEDIGT (16.11., ~22:00) – 52 Aufgaben, 8 Themen-Register + Einheiten + Prüfung
- Register «Einfache Maschinen, Flaschenzüge»: Labor goldene Regel + e1–e8 (feste Rolle, lose Rolle, Flaschenzug, mit η, Rampe, Kraft zerlegen, schiefe Ebene mit Reibung, Schraubenspindel).
- drawRolle (fest/lose/zug n), drawEbene (comp, F, FR, h, l, al), drawSpindel. Backup index.vorE.html.
- Mechanik-Kapitel «Kräfte» und «Arbeit, Energie, Leistung, Wirkungsgrad» des Rechenbuchs sind damit abgedeckt (ausser Beschleunigungskraft).
## Mögliche nächste Pakete: F Bewegungen + Beschleunigungskraft; G Fluidmechanik; H Festigkeitslehre.

## Knobelaufgaben ERLEDIGT (16.11., ~21:55) – 56 Aufgaben
- Register «Knobelaufgaben» (XTASKS): x1 Mobile (zwei Hebel), x2 Lastwagen auf Brücke (Position rückwärts), x3 Gabelstapler (Kippgrenze, Sicherheit 1,5), x4 Kugelbahn (Energie mit Verlust). Eigene Zeichnungen drawMobile, drawStapler, drawBahn.
- Elias wünscht: eigene, kreative Aufgaben statt Motive aus seinem PDF. Künftig neue Motive wählen.

## Bild-Erklärung ERLEDIGT (16.11., ~22:00)
- Neuer Stil (aus Elias' Führungen-Chat): stepper(frames) mit Abspielen/Schritt weiter/Von vorn + Boxen «So liest du das Bild», «Ein Bild aus dem Alltag», «Typische Falle», «Für den Test». Daten in ERKL[id](p) -> {frames,lesen,alltag,falle?,test}. Knopf «▶ Bild-Erklärung» erscheint, wenn ERKL[t.id] existiert.
- Bisher für k1–k7. drawForces(o.planN,o.showR), drawRecht(p,stufe,noNum), drawSchraeg(o.stage). Test: t5.py.
- Skill-Vorschlag «lehrmittel-formulierungen» erweitert (Führungen, Physik-Begriffe, Erklärstil) – Elias muss ihn auf der Karte speichern.
- Nächster sinnvoller Schritt: ERKL auch für Drehmoment (d1–d9) und Lagerkräfte (l1–l7).

## Bild-Erklärung Drehmoment + Lagerkräfte ERLEDIGT (16.11., ~22:10)
- momentFrames(mk): 5 Schritte (Bild lesen, Drehpunkt-Ring, Wirkungslinien + blaue Hebelarme, Drehsinn, Gleichung). Zeichenfunktionen liefern s._geo={D,F:[{p,d,n}],piv?,thru?}. ME(id,alltag,falle,test) registriert ERKL für d1–d9, l1–l7.
- Bekannt: Bei kurzen Hebelarmen liegen die Schilder «Arm F_x» eng beieinander (z. B. Seilwinde, Brechstange).
- Noch ohne Bild-Erklärung: Umfangskraft, Reibung, Arbeit/Energie, Leistung, Einfache Maschinen, Knobelaufgaben.

## Bild-Erklärung für ALLE 56 Aufgaben ERLEDIGT (16.11., ~22:20) – Version 1794862985-eaf1 + 1
- EK(id,frames,lesen,alltag,falle,test); Helfer TF (gleiche Zeichnung, Denkschritte), MF (momentFrames), kiste(), hub(), fall(), zeit(), rolle(); neue Zeichnungen drawBars, drawArea; drawRolle(o.hl), drawEbene(o.compN), drawKiste optional FG/FN; _geo für drawRad, drawBremse, drawStapler.
- Nur Denkschritte ohne Bildaufbau (TF): u3, u5, r4, p3, e8, x1.
- t5.py prüft alle Erklärungen (Schritte durchklicken). Backup index.vorStil3.html.

## Register «Kräfte zerlegen» ERLEDIGT (17.11., ~07:40) – 66 Aufgaben
- Quelle der Typen: Arbeitsblatt BBZ Baselland «Kraft/Statik» S. 7/8 und 8/8 (Aufg. 3–16). Eigene Texte, neue Zahlen.
- ZTASKS z1–z10: Schlitten (rechtwinklig), Stechzirkel, Stehleiter eben, Gemälde, Rohr am Haken, Leitungsmast, Wanddrehkran, Stehleiter geneigt, Strassenleuchte, Spannreck (räumlich).
- Zeichnungen: drawPara (Kräfteparallelogramm in 3 Stufen, für Bild-Erklärung PF), drawSpreiz, drawHang, drawMast, drawKran, drawSchief, drawLampe, drawReck.
- Nicht umgesetzt: Kranausleger Bild 20/1 (120°-Geometrie), Verständnisfrage p1 (steht als Merksatz in der Erklärkarte).
- Backup index.vorZerl.html.

## Register «An der Wand» ERLEDIGT (17.11., ~11:55) – 72 Aufgaben
- WTASKS w1 Haken schräg, w2 Konsole mit Druckstrebe, w3 angeschraubte Konsole (Kippkante), w4 Tür an Scharnieren, w5 Leiter an glatter Wand (μ min), w6 Wandausleger mit Seil + Eigengewicht.
- momentFrames: neues _geo.pivAt für eigenen Drehpunkt-Text. Backup index.vorWand.html.
- OFFEN: Elias will Aufgaben auf dem Handy OHNE Taschenrechner lösen, mit Auswahl-Optionen. Vorschläge gemacht, Antwort abwarten.

## Handy-Modus ERLEDIGT (17.11., ~12:10)
- Schalter in jeder Aufgabe: Eintippen | 4 Antworten | Ansatz wählen. MODE global, localStorage 'tp-mode', setMode() baut alle Karten neu (CARDS, c._build), Zahlen bleiben.
- 4 Antworten: distract(a,asks) = andere Teilantwort, Faktor 2 bzw. 1/2, Faktor 10/1000, 9,81, Winkel 90−α; fmtN 3 gültige Ziffern. Falsche Wahl -> diagnose() erklärt den Fehler.
- Ansatz wählen: ansatzOf(t,p) = letzter Tipp mit «=»; 2 falsche aus anderen Aufgaben desselben Registers; danach «Das Tool rechnet» mit Resultaten, zählt als gelöst. Im Prüfungsmodus wird «Ansatz» zu «4 Antworten».
- Test t6.py: 72/72 richtig mit Auswahl. Backup index.vorHandy.html.

## Probetest Kräfte ERLEDIGT (17.11., ~17:00) – 80 Aufgaben
- Register «Probetest Kräfte» (QTASKS q1–q8): Tauziehen, Kranhaken mit Hakenmasse, Schiff mit 2 Schleppern, Bus mit Anhänger (Gleichgewicht + F_R), Kräfteplan im Massstab, rechtwinklig, drei Kräfte (erst Linie, dann Pythagoras), zwei unbekannte Kräfte (Gleichungssystem).
- Test-Ablauf: «Probetest starten» -> 8 Karten ohne Tipps -> «Abgeben» -> Punkte + Note (5·P/Max+1) + Lösungswege. Darunter Einzelübung.
- Backup index.vorProbe.html.

## Register «Lagerkräfte Buch» ERLEDIGT (18.11., ~18:45) – 88 Aufgaben
- Quelle: Rechenbuch Metall, Technische Physik, Lagerkräfte (Theorieseite + Aufgaben 1–8). Texte umformuliert, Buchwerte beim ersten gen() (bk-Helfer, p.book), danach Zufallswerte.
- BTASKS b1 Wälzführung, b2 Träger, b3 Fräsdorn, b4 Umlenkrolle (Krafteck, 45°), b5 Hebel mit Feder, b6 Winkelhebel (F_A = √), b7 Containerfahrzeug (Überhang), b8 Laufkran 2 Stellungen.
- Buchresultate (eigene Rechnung): b1 251,6/198,4 N; b2 5325/5175 N; b3 1,885/1,615 kN; b4 2121 N, 45°; b5 2208/4828 N; b6 7,92/12,75 kN; b7 4,72/50,28 kN; b8 53,2/38,8 und 42,64/49,36 kN.
- Karten: 4 Schritte (ΣM_l = ΣM_r), Darstellungsmöglichkeiten (Bauteilbild, Ersatzbild, freigemachtes Bild, Krafteck).
- Neue Zeichnungen: drawUmlenk, drawHebel5, drawWinkel. Backup index.vorBuch.html.

## Neues Konzept (18.11., Sprachgespräch) – umgesetzt für Lagerkräfte + Drehmoment
- Trainer bleibt, KEIN Fortschritt mehr (updateTabs leer, kein «gelöst»). Etikett t.src («Buch …, Nr. x» / «eigene Variante zu …»).
- Pro Thema: Buchaufgaben mit Buchwerten (bk) zuerst, dann eigene Aufgaben und Varianten. Fotos sofort verarbeiten (später nicht mehr sichtbar).
- Register nach Buch geordnet; Probetest hinter Knobel. Lagerkräfte Buch in Register Lagerkräfte zusammengeführt (BEX bx1/bx2 Beispiele, BTASKS Nr.1–8, LVAR lv1–lv3).
- Drehmoment: Karte Hebelarten, DBOOK dbx/db1/db2, DVAR dv1–dv3 in TASKS. 99 Aufgaben. distract() kann Lösung 0.
- Nächste Blätter: Elias schickt sie einzeln neu (Umfangskraft, Reibung, Arbeit/Energie, Kräfte, Bewegungen, Volumen, gestreckte Längen). Mathe-Themen vor Physik einordnen.

## Paket Bewegungen (18.11.)
- Neuer Tab «Bewegungen» (vor Kräfte): Formelkarte, Buch geradlinig g1–g7, Buch kreisförmig k1b–k10b, eigene gv1, gv2, kv1, kv2.
- Bauteilbilder: drawHallenkran (Modus lager/vel), drawHebe, drawAufzug, drawWelleG, drawKasten, drawFraeser, drawBohrung, drawDisk.
- Laufkran b8: zeigt jetzt den Hallenkran, Ersatzbild in der Lösung (solDraw).
- Annahmen: g4 Nahtfolge beginnt und endet mit Naht; k2b Drehzahlen gerechnet statt aus Schaubild gelesen.
- Nächstes Paket: Mathe (gestreckte Längen, Volumen/Masse) vor Physik.

## Probe kreative Aufgaben, Lagerkräfte (18.11.)
- CTASKS c1–c6 in secs.lager, Block «Kreative Aufgaben (Probe)» zwischen Buch und Eigene.
- Arten (src-Label KR): neu (c1 Sprungbrett, c6 Anhänger), umgekehrt (c2 Hallenkran x_max, c6c), kombiniert (c3 Seilwinde: m→F→M→Lager), Fehler finden (c4), Kopfrechnen mit Anteilen (c5).
- Neue Bilder: drawSprung, drawWindeW, drawAnh, person(). drawHallenkran: o.x1lab, lange FA/FB-Labels unten.
- Wenn gut: dasselbe Muster für andere Kapitel übernehmen.

## Paket Umfangskraft (19.11.)
- secs.umf: Formelkarte «Übersetzung der Drehmomente», Buch UB (ubx Beispiel, ub1–ub7), «Kreative Aufgaben» UK (cu1 umgekehrt Räderwinde, cu2 Fehler Schnecke, cu3 kombiniert Zahnrad+Lagerkräfte, cu4 Kopfrechnen), dann eigene u1–u5.
- Bilder: gear(), pulley(), gside(); drawZP, drawZR, drawSchn, drawPresse, drawVerd, drawRW, drawPkw, drawHubw (Seitenansicht), drawZW.
- Annahmen: ub3 grosses Rad ø120 greift in Pinole und z_1 (z_2 = 48). ub6 b) nur 1. und 5. Gang abgefragt, c) nur 5. Gang.

## Buchdaten Reibung (Fotos 19.11.)
Bsp1 Rutschkupplung FN 2,4 kN, μ 0,67, ø160 (r 80), 2 Reibflächen → FR 1608 N, M 257 N·m. Bsp2 Förderband FG 120 N, α 25°, μ 0,6 → FN 108,8, FR 65,3 N. Bsp3 Kranlaufrad d 280, FN 38 kN, f 0,5 mm → 136 N.
1 Ladestation FG 3500, μ0 0,15 / μ 0,08. 2 Kupplung FN 125, μ 0,62, ø85. 3 Maschinenschlitten FG 450, Abstände 82 / 104, μ 0,005. 4 Schweissmaschine FN 2 kN, f 0,6 cm, ø120 (untere angetrieben). 5 Schraubenverbindung Flachstäbe 80×12, F 3,2 kN, μ 0,2, 2 Schrauben. 6 Bohreinheit FG 1500, Ff 1800, 30°, μ 0,07, d 142. 7 Getriebewelle F1 18, F2 13,5 kN, 450/680/1580, Zapfen A ø100, B ø125, μ 0,06.
## Buchdaten Arbeit/Energie
Bsp: 2000 N·1,5 m; m 300 kg μ 0,08 s 1,5 m; Feder 150 N/60 mm; R 9,25 s 25; Standuhr 45 N 1,6 m; Fallhammer 250 kg 6 m/s, 5 mm.
1 Aufzug 11200 N 12,5 m. 2 Betonpumpe 5 m³ ρ 2,45 h 11,5. 3 Zylinder l 1,5 m d 435 ρ 7,25 h 0,8. 4 Vorschubeinheit 3250 N s 430 μ 0,08. 5 Feder R 24,5 s 23. 6 Drehversuch Fc 650, l 425, d 85, f 0,5 (W in W·h). 7 Pumpspeicher 0,32 km × 85 m × 16,5 m, h 283. 8 Schleifscheibe 80 m/s 12 g, 1,5 mm. 9 Pkw 1200 kg 60/120 km/h. 10 Pendelschlagwerk 21,735 kg, 1407 mm, Steighöhe 220 mm.

## Paket Reibung + Arbeit/Energie (19.11.)
- secs.reib: Formelkarte, Buch RB (rbx1–3, rb1–rb7), Kreativ RK (cr1 Lieferwagen Rampe, cr2 Grenzwinkel, cr3 Fehler Rutschkupplung, cr4 Schiebetor Lager+Rollreibung, cr5 Kopf).
- secs.arb: Formelkarte, Buch AB (abx1–5, ab1–ab10), Kreativ AK (ca1 Treppe/Strompreis, ca2 Puffer auslegen, ca3 Fehler km/h, ca4 Bremsweg, ca5 v²-Kopf).
- Konstante G9 = 9.81 (g war belegt).
- Annahmen: rb2 eine Reibfläche; rb4 beide Rollen zählen (M = 2·F_R·r); rb5 eine Reibfläche; rb6 Einheit fährt hoch, F_f parallel; ab7 Fallhöhe für alles Wasser gleich.

## Paket Kräfte nach Buch (19.11.)
- secs.kraft: Karte «5 Schritte», Buch KB (kbx Spannzylinder, kb1 Mast, kb2 Seilrolle, kb4 Hubseil), Kreativ KK (ck1 zwei Personen, ck2 Hubseil α_max, ck3 3-4-5).
- secs.zerl: Karte Zerlegen, Buch ZB (zb3 Diesel, zb5 V-Führung, zb6 Schrägstirnrad, zb7 Keilspanner, zb8 Kniehebel), Kreativ ZK (cz1 Wäscheleine, cz2 Schrägstirnrad aus M, cz3 Fehler Pleuel).
- Helfer: dg(), fA(), drawPlan() (Kräfteplan A→E mit violetter Resultierender), drawMastB, drawSeilR, drawHubseil, drawDiesel, drawVF, drawSStirn, drawKeil, drawKnie, drawLeine, drawSpZyl.
- Neue Arbeitsweise: Buchtreue unwichtig; Annahmen in Aufgabentext; nicht nachfragen.

## Paket Beschleunigung + Biegen (19.11.)
- Spannrolle drawZR: drückt jetzt von aussen auf den Riemen.
- Neuer Tab «Beschleunigungs- und Gewichtskraft» (bkraft, nach «An der Wand»): BB bb1–bb11, BK cb1 Aufzug, cb2 Linearantrieb max Masse, cb3 Ladung bremsen (Reibung), cb4 Fehler Einheiten, cb5 Mond Kopf. drawVT (v-t-Diagramm), drawLinear, drawBall, drawHubZ, drawAufzugA. GM = 1.62.
- Neuer Mathe-Tab «Biegen: Zuschnitt» (biege, ganz vorne): Formeln DIN 6935, GB gb1–gb5 (Tabellenwert, k und v, U-Profil, β > 90°, Rückfederung), GK cg1–cg3. kKor(), vAus(), drawBieg, drawRueck.

## Paket Schiefe Ebene, Keil, Schraube (19.11.)
- secs.masch: Karte «Goldene Regel», MB (mb1–mb5 schiefe Ebene, mb6–mb7 Keil, mbx + mb8–mb11 Schraube inkl. Wagenheber), MK (cm1 Rollstuhlrampe 6 %, cm2 Steigung P gesucht, cm3 Fehler Abzieher, cm4 Schraubstock + Reibung, cm5 Kopf).
- Bilder: ebD (drawEbene aus h und s), drawKeilW, drawSpPr, drawAbz, drawWHeber.
- Keil Nr. 6: Keilfläche 30° zur Senkrechten ⇒ F_2 = F_1 : tan 30°.

## Paket Kettenaufgaben (19.11.)
- Neuer Tab «Kettenaufgaben» (kette, nach Lagerkräfte): KETTE ke1 Wandkonsole mit Zugstab (nur Winkel), ke2 Schwenkkran Wand (oberes Lager Zug, Schrauben), ke3 Zahnradwelle M→F_u→F_r→F_n→Lager, ke4 Riemenscheibe fliegend (F_A Gegenrichtung), ke5 Seilwinde an Rampe (m→F_S→M→Lager), ke6 Hebel mit schrägem Zug (r_1 = l_1 · sin β → F_2 → F_D).
- Bilder: wallV, drawKonsoleK, drawSchwenk, drawZWelle, drawRiemen, drawRampW, drawHebelS.
- Fix dunkler Modus: button/input color explizit (beide Trainer).
- Zeichnungstechnik: Navigation neu (Kapitel-Chips ohne Kap.-Nummern, horizontal scrollbar; Leiste ◀ x/n Titel ▶; Liste aufklappbar; Nummern pro Kapitel).
- Kapiteltest am Ende jedes Tabs (addKapTest, taskCard opt.test: Tipp nehmen, Antwort prüfen, Lösungsweg + 'Für den Test', Auswertung mit Note). Ausgenommen: Prüfung, Probetest, Einheiten.
