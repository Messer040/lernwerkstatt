# STAND – Form- und Lagetoleranzen (Projekt Elias)

## Entscheide (16.11.2026)
- Basis: BEIDE Artifacts zusammenführen.
  - Aktuell (Zeichnungs-Engine, 14 Aufgaben, Rundlauf-Erklärung): https://claude.ai/artifact/SNFLju8UN6y1WzcxgSrKkz (slug cd6bec57-f8c2-42f1-9f18-095fde8e8c57)
  - Älter (308 Fragen, Messuhr, Blaupause, MCQ/FRAMES/Fehler-Daten, ISO-2768-Tabellen T1/T2, Glossar, Quellen): https://claude.ai/artifact/AcUtx7riJjidsu6VwMVkq8 (slug 4dd678a2-…, 2449 Zeilen; Daten ab ca. Zeile 580)
- Prüfungsform: unklar (Hand oder CAD) -> beides abdecken.
- Erstes Paket: "Ganze Teile tolerieren".
- Arbeitsweise: Pakete à 15–20 Min, danach veröffentlichen + STAND aktualisieren + anhalten.

## Paket 1 – Plan "Ganze Teile tolerieren"
- Leere Werkstattzeichnung + Funktionsbeschreibung.
- Lernende klicken Hotspots (Fläche/Achse) an, wählen Symbol, ⌀ ja/nein, Wert, Bezüge; setzen Bezugsbuchstaben selbst.
- Prüfung gegen Lösungssatz mit erlaubten Alternativen und Wertebereich (z. B. 0,01–0,03).
- Danach Musterlösung als Zeichnung einblenden.
- Werte-Hilfe aus den ISO-2768-Tabellen des alten Artifacts.

## Zeichenregeln (vom Nutzer gelernt)
- Wellenabsatz: Kante immer über den vollen grösseren Durchmesser (shaft()).
- Bezugslinie startet am linken/rechten Ende des Toleranzrahmens (tol()).
- Kanten hinter der Schnittebene zeichnen; Fasenkanten sichtbar dick.
- Bezugsdreieck auf Kontur = Fläche; in Masslinie = Achse/Mittelebene.
- Parallelität-Symbol '//'; Oberflächensymbol ISO 1302 mit Balken, 60°.

## Offene Korrekturen
- t2: allgemeines Oberflächensymbol nah an Mass 12.
- t5: Masshilfslinie ⌀40 kreuzt Bezug-A-Linie.
- ISO-13715-Symbol nur angenähert.

## Neue Unterlagen (16.11., 20:06)
- KRBK2 2-19/2-20: Einbauraum O-Ring (Kolben-/Stangen-/Flanschdichtung) mit Planlauf, Rundlauf, Ebenheit 0,02 CZ, Rz-Angaben -> Vorlage Teil "Deckel mit O-Ring-Nut".
- KRBK2 2-25: Wälzlagerung Welle (Lagerdeckel, Festlager, Loslager, Sicherungsringe), Bezüge A/B an Lagersitzen -> Vorlage Teil "Getriebewelle Fest-/Loslager", Bezug A-B.
- KRBK2 2-22/2-26/2-27: Richtlinien Formgestaltung, Übungen O-Ring, RWDR, Lagerbock, Keilriemenantrieb.
- Normen-Auszug: Sicherungsringe/Nuten/Federn, Gewinde/Schrauben, Zahnräder, Dichtelemente (RWDR-Einbaumasse, O-Ring-Nuten), Kleben/Falzen.
- Screenshots: Maschinenelemente-Darstellung, Fest-/Loslager, Schrauben/Muttern, Gusslagerbock.
- RM 09 S. 273-296: Mathe (Längen, Dreiecke) -> nicht FLT, später eigenes Mathe-Modul.
- Modell: Elias bleibt bei Opus 5.5.

## Paket 1a ERLEDIGT (16.11., ~20:25) – Version 1794857144-5116
- Neuer Aufgabentyp in full.js (buildFull), eingebunden per /*@@FULL@@*/ in index.html; build.py baut index_pub.html.
- g1 Getriebewelle 2:1 (Fest-/Loslager 6205), 7 Elemente, Bezüge A/B -> A-B, Prüfung mit Varianten + Wertebereich, Musterlösung.
- frame(): Bezugsfeld wird breiter bei A-B.
- Backup: index.backup-paket0.html. Screenshot-Test: shotg.py.
## Nächste Pakete
- 1b: Deckel/Flansch mit O-Ring-Nut (KRBK2 2-19/2-20), Ebenheit, Planlauf, Position Lochkreis.
- 1c: Lagerbock (Guss) mit Bezugssystem A|B|C.
- Später: Freistiche ISO 18388 in Wellen (vereinfachte Darstellung Fig. 69/3), Zahnradkörper (Rundlauf/Planlauf, Seite 123).

## Paket 1b ERLEDIGT (16.11., ~20:33) – Version 1794857588-64fc
- g2 Lagerdeckel 1:1: Schnitt A-A + Seitenansicht (Methode 1) + Einzelheit Z (4:1) der O-Ring-Nut.
- Engine neu: Bezugssysteme X|Y (Reihenfolge zählt), datumUse, Flächen ohne Toleranz (none:true), onRedraw (Lochkreis ⌀76 wird TED, sobald Position eingetragen), diaLine() für schräge Durchmessermasse, sheet({raOnly}) ohne Klammer-Symbol.
- shotg.py <id> <index> testet Musterlösung + Screenshot.
- Hinweis: Kopfzeile «/ 16 gelöst» erst beim nächsten Build aktiv.
## Nächstes Paket 1c: Lagerbock (Guss) mit Bezugssystem A|B|C

## Paket Kap. 10 (19.11.) – Zeichnungstechnik-Trainer
- Neue Unterlagen: Kap 07 Bemassung (51 S.), 08 Schweissnahtangaben (32), 09 Masstoleranzen (19), 10 Tolerierungen (13), 11 Oberfläche (21), 12 Zeichnungen/Stücklisten (56). PDFs in /mnt/user-data/uploads (Präfixe 52ba8d89, 0f2f7d93, ffaa55e7, 10ac5dd0, 84b51687, 557b6052).
- Titel jetzt «Zeichnungstechnik-Trainer». Kapitel-Filter (KAPS, t.kap; ohne kap = 'FL'), gespeichert in localStorage 'flt-kap'.
- K10: k10a–k10n (Grundlagen, Rahmen lesen, Stichproben ⊥/—/∥/Symmetrie, Neigung rechnen, Rahmen aus Text ×3, Messmittel, Gestell-Anforderungen, kreativ umgekehrt + Fehler). Helfer svgS(), gauge(), judge(), STP(), ENT(). Zahl-Fragen haben q.tol.
- Test: tk10.py. Nächste Pakete: Kap. 9 Masstoleranzen, Kap. 11 Oberfläche, Kap. 7 Bemassung, Kap. 8 Schweissnähte, Kap. 12 Zeichnungen/Stücklisten.
## Paket Kap. 9 (19.11.)
- K9: k9a–k9n (Begriffe, Spiel, Abmasse aus Grenzmassen, Istmass Gut/Nacharbeit/Ausschuss, ISO 2768 Kette vs. Gesamt, Lochreihe, Massketten, ISO-System + Lehren, H7/g6/n6/r6 mit fitDia, Passungen anwenden, Tabellenwerte, kreativ umgekehrt/Fehler/µm). Helfer tolT, shaftS, boreS, fitDia, Q, O.
- Hinweis: CSS setzt svg text font-size; grössere Schrift nur über style:'font-size:…px'.
## Paket Kap. 12 (19.11.)
- K12: k12a–k12n (Stücklistenregeln, Normbezeichnung lesen, Normteile zuordnen, Festigkeitsklassen, Werkstoffe, 18 F8/h9, Bügel gestreckte Länge, Keiltreiber lesen, Spannvorrichtung Funktion, Axialspiel, Gewindebohrer/Rändel, kreativ Fehler Stückliste / Normbezeichnung bilden / Demontagefolge). Helfer slist(), zylS().
- Nicht übernommen (braucht Originalbilder): Projektionsaufgaben, Fehlersuche-Bildpaare, Kurbelschwinge/Ventiltrieb/Lötverschraubung-Bildfragen. Idee: später eigene Projektionsaufgaben zeichnen.
- Offen: Kap. 7 Bemassung, Kap. 8 Schweissnähte, Kap. 11 Oberfläche.
## Paket Kap. 7 + 11 (19.11.)
- K11: k11a–k11j (Grundsymbole, Rz/Rmax/Ra, N-Klassen, Symbol lesen a–e, Rillenrichtung, Text→Symbol, wo kein Symbol, Bolzen wahr/falsch, kreativ Funktion→Ra, Fehler µm/mm). Helfer sym11().
- K7: k7a–k7k (Grundregeln, Bemassungsarten, Fasen/Senkungen, Kanten ISO 13715, Teilungen + Sehne, Formsymbole, funktions/fertigungs/prüfgerecht, Blech neutrale Faser, kreativ Koordinatenabstand, Fehler, Teilung umgekehrt).
- Offen: Kap. 8 Schweissnähte.
- k11k: Fehlersuche Oberflächensymbole nach Top Design 7 S.115 (eigener Halter, 7 Regeln R11, mark()).
## Paket Maschinenelemente (19.11.)
- Neues Kapitel 'ME': me1 Schraubenarten (Icons scrIcon), me2 Muttern/Scheiben, me3 Schraubensicherungen, me4 Elemente nach Funktion, me5 Fehler (Kunststoffring 150 °C), me6 umgekehrt, me7 Formelemente (Zentrierbohrung, Freistich, Kernloch M8 6,8, Durchgang M8 mittel 9, DIN 974, Anfräsung, T-Nut).
- Kapiteltest pro Kapitel (Pseudo-Aufgabe test-<kap>, buildTest): 10 zufällige Fragen aus dem Kapitel, Tipp = falsche Antworten ausgrauen bzw. Ansatz aus why, Lösung + Erklärung sofort, Note am Schluss.
