# Architektur der neuen Lernwerkstatt

Stand: 19.11.2026. Plan: https://claude.ai/artifact/XpCfcASeZjhvUgjQAiqqWJ

## Entscheide
- Vite + TypeScript, Quellcode in `app/`, Build in `neu/` (wird mit committet, GitHub Pages liefert ihn direkt aus).
- Nur für Elias. Kein Konto, nichts wird gespeichert, keine Freischaltung.
- Paralleler Umbau: `physik/` und `zeichnung/` bleiben online, bis ihr Inhalt in `neu/` angekommen ist.

## Ordner
```
app/
  index.html
  src/
    main.ts                 Hash-Router (#/fach/kapitel, ?karte=…&stufe=…, /test)
    style.css               Design-System (Farben, Hell/Dunkel, Handy zuerst)
    core/
      types.ts              Fach, Kapitel, Karte, Task, Ask, Fehler, Stufe, Familie
      zahl.ts               rng, pick, fmt (Komma, 39'000), parseZahl
      pruefen.ts            Antwort prüfen, Fehlerwerte, Einheitenfehler
      text.ts               farbige Textbausteine f() l() m() r() v() eq()
      draw/svg.ts           Zeichenbausteine: blatt, kraft, kraftWinkel, kraefteplan, saeulen, massH/V, balken, bolzen, …
      ui/aufgabe.ts         Aufgabenkarte (Üben und Test)
      ui/seiten.ts          Start, Fach, Kapitel, Kapiteltest, Note
    faecher/
      index.ts              Liste aller Fächer
      physik/<kapitel>/     index.ts (Formeln, Karten), aufgaben.ts, bilder.ts
  tests/aufgaben.test.ts    jede Aufgabe 50× mit Zufallswerten
```

## Aufgabe (Task)
```
{ id, karte, stufe: 1|2|3, familie, title, src?,
  gen(), draw?(p), text(p), asks(p), fehler?(p), tipps(p), loesung(p), loesungsbild?(p) }
```
- `asks`: Zahl `{k, unit, v, tol?}` oder Auswahl `{kind:'choice', k, opts, a, why?}`.
- `fehler`: `{ask, v, msg}` = typischer Fehlwert mit Erklärung.
- `tipps`: 3 Stufen (Prinzip, erster Schritt, ganzer Weg).

## Ein neues Kapitel
1. Ordner `app/src/faecher/<fach>/<kapitel>/` mit `bilder.ts`, `aufgaben.ts`, `index.ts`.
2. In `app/src/faecher/index.ts` eintragen.
3. `cd app && npm test && npm run build`.
4. Screenshot bei 390 px prüfen, committen, pushen.

## Prüfungen
- `npm test`: Typen, IDs, Karten, 50 Zufallsläufe pro Aufgabe, Musterlösung richtig, Fehlwerte falsch und mit eigener Meldung, keine NaN/undefined in Text und Bild.
- GitHub Actions (`.github/workflows/pruefen.yml`) läuft bei jedem Push.

## Umgezogen
| Kapitel | alt | neu |
| --- | --- | --- |
| Kräfte addieren | physik/ Tab «Kräfte addieren» (k1–k5, Buch-Aufgaben KB, kreative KK) | neu/#/physik/addieren (a1–a17, 4 Lernkarten, Fehlerwerte) |
| Kräfte zerlegen | physik/ Tab «Kräfte zerlegen» (z1–z10, Buch-Aufgaben ZB, kreative ZK) | neu/#/physik/zerlegen (22 Aufgaben z1–z22, 5 Lernkarten, Fehlerwerte) |
| Drehmoment, Hebelgesetz | physik/ Tab «Drehmoment» (d1–d9) | neu/#/physik/dreh (d1–d13, mit Fehlerwerten) |
| An der Wand | physik/ Tab «An der Wand» (w1–w6) | neu/#/physik/wand (12 Aufgaben w1–w12, 4 Lernkarten, Fehlerwerte) |
| Lagerkräfte | physik/ Tab «Lagerkräfte» (l1–l7, lv1–lv3, c1–c6, Buch b1–b8, bx1–bx2) | neu/#/physik/lager (32 Aufgaben l1–l32, 4 Lernkarten, Fehlerwerte) |
| Kettenaufgaben | physik/ Tab «Kettenaufgaben» (ke1–ke6) | neu/#/physik/kette (12 Aufgaben ke1–ke12, 4 Lernkarten, Fehlerwerte) |
| Umfangskraft | physik/ Tab «Umfangskraft» (u1–u5, Buch ubx, ub1–ub7, kreativ cu1–cu4) | neu/#/physik/umfang (22 Aufgaben u1–u22, 4 Lernkarten, Fehlerwerte) |
| Reibung | physik/ Tab «Reibung» (r1–r5, Buch rbx1–rbx3, rb1–rb7, kreativ cr1–cr5) | neu/#/physik/reibung (22 Aufgaben, 4 Lernkarten, Fehlerwerte; neu r6 Was wäre wenn, r7 Fehler finden) |
| Arbeit, Energie | physik/ Tab «Arbeit, Energie» (a1–a5, Buch abx1–abx5, ab1–ab10, kreativ ca1–ca5) | neu/#/physik/arbeit (28 Aufgaben, 4 Lernkarten, Fehlerwerte; neu a6 Was wäre wenn Feder, a7 Fehler finden Hubarbeit, a8 Was wäre wenn Fallhöhe) |
| Leistung, Wirkungsgrad | physik/ Tab «Leistung, Wirkungsgrad» (p1–p6) | neu/#/physik/leistung (17 Aufgaben p1–p17, 4 Lernkarten, Fehlerwerte; neu Fehler finden p7/p12, Schätzen p8, Umgekehrt p9/p10/p16, Kette mit 3 Gliedern p15, Stromkosten p13/p17) |
| Masche mit mehreren Quellen (Elektrotechnik) | neu geschrieben (Buchaufgabe 7, Bild 2, S. 49 als e5) | neu/#/elektro/masche (12 Aufgaben e1–e12, 4 Lernkarten, Fehlerwerte; Bild `schaltung` in `faecher/elektro/masche/bilder.ts`) |
| Einfache Maschinen, Flaschenzüge | physik/ Tab «Einfache Maschinen» (e1–e8, Buch mb1–mb11, mbx, kreativ cm1–cm5) | neu/#/physik/maschinen (32 Aufgaben m1–m32, 4 Lernkarten, Fehlerwerte; neu m5 Bild deuten, m6/m31 Fehler finden, m7 Umgekehrt, m8 Schätzen, m9 Begründen, m20/m23 Was wäre wenn; Bilder `rolle`, `keil`, `spindelpresse`, `abzieher`, `wagenheber`, `hebelSpindel` in `faecher/physik/einfache-maschinen/bilder.ts`, Ebene aus Reibung) |
| Reihenschaltung (Elektrotechnik) | neu geschrieben nach Buch 3.7.1, Aufgaben 1–15 (Fotos im privaten Repo `unterlagen/bilder/2026-11-24-reihenschaltung/`) | neu/#/elektro/reihe (18 Aufgaben r1–r18, 5 Lernkarten, Fehlerwerte; Buch Nr. 7 steht als e5 im Kapitel Masche; Bild `reihe` in `faecher/elektro/reihenschaltung/bilder.ts`) |
| Beschleunigungs- und Gewichtskraft | physik/ Tab «Beschleunigungs- und Gewichtskraft» (bb1–bb11, kreativ cb1–cb5) | neu/#/physik/beschleunigung (23 Aufgaben b1–b23, 4 Lernkarten, Fehlerwerte; neu b6/b20 Was wäre wenn, b12 Begründen, b14/b18/b21 Umgekehrt, b17 Bild deuten, b23 Fehler finden; Bilder `wagen`, `zug`, `schlitten`, `ball`, `aufzug`, `ladung`, `vt` in `faecher/physik/beschleunigung/bilder.ts`) |
| Bewegungen | physik/ Tab «Bewegungen» (g1–g7, k1b–k10b, gv1, gv2, kv1, kv2) | neu/#/physik/bewegungen (33 Aufgaben v1–v33, 5 Lernkarten, Fehlerwerte; neu v5/v13/v33 Umgekehrt, v6/v18 Schätzen, v7/v11/v28 Fehler finden, v12/v19 Was wäre wenn, v31 Begründen, v32 Bild deuten; Zeiten bei v4, v10 in s statt min, damit die Anzeige genau genug bleibt; Bilder `hebebuehne`, `aufzugSchacht`, `welle`, `kasten`, `fraeser`, `bohrung`, `rund`, `hallenkran`, `foerderband`, `fluss` in `faecher/physik/bewegungen/bilder.ts`) |
| Biegen: Zuschnitt | physik/ Tab «Biegen: Zuschnitt» (gb1–gb5, cg1–cg3) | neu/#/physik/biegen (18 Aufgaben b1–b18, 4 Lernkarten, Fehlerwerte; neu b3 Bild deuten, b4 Schätzen (Faustregel v ≈ 2·s), b8/b17 Was wäre wenn, b9/b18 Begründen, b11 Fehler finden, b12 Wellenprofil, b15 Fehler finden, b16 Umgekehrt; Bilder `winkel`, `profil`, `rueckfeder` in `faecher/physik/biegen/bilder.ts`) |
| Parallelschaltung (Elektrotechnik) | neu geschrieben (keine Buchseiten vorhanden; alter Strom-Trainer deckt Parallel nicht ab) | neu/#/elektro/parallel (18 Aufgaben p1–p18, 4 Lernkarten, Fehlerwerte; Familien Rechnen, Umgekehrt, Schätzen/Kopfrechnen, Fehler finden, Bild deuten, Was wäre wenn, Begründen, Kette; Praxis: Steckdosenleiste mit Sicherung, Kurzschluss, Heizlüfter 3 Stufen; Bild `parallel` in `faecher/elektro/parallelschaltung/bilder.ts` mit Typen R, lampe, heiz, draht, offen) |
| Zahnräder: Masse berechnen (Maschinentechnik, neues Fach `maschinen`) | neu geschrieben nach Buch 4.5.7–4.5.9 und Formeltabelle aus dem Unterricht (Fotos im privaten Repo `unterlagen/bilder/2026-11-25-zahnraeder/`) | neu/#/maschinen/zahnrad (19 Aufgaben z1–z19, 4 Lernkarten, Fehlerwerte; Bilder `rad`, `zahn`, `paar` in `faecher/maschinen/zahnrad/bilder.ts`) |
| Getriebearten (Maschinentechnik) | neu geschrieben nach Buch 4.5.4 (Foto im privaten Repo `unterlagen/bilder/2026-11-25-zahnraeder/`) | neu/#/maschinen/getriebe (8 Aufgaben g1–g8, 3 Lernkarten) |
| Zahnräder: Übersetzung und Getriebe (Maschinentechnik) | neu geschrieben (Übersetzung bisher nur als Drehmoment-Aufgaben in Physik «Umfangskraft») | neu/#/maschinen/uebersetzung (21 Aufgaben u1–u21, 4 Lernkarten, Fehlerwerte; Familien Rechnen, Umgekehrt, Schätzen, Fehler finden, Bild deuten, Was wäre wenn, Begründen, Kette; Bilder `reihe` (Räder in einer Reihe mit Drehsinn, greifen echt ineinander) und `schema` (Getriebeschema Seitenansicht, 1–3 Stufen, optional Seiltrommel) in `faecher/maschinen/uebersetzung/bilder.ts`; neuer Baustein `drehsinn` in `core/draw/svg.ts`) |
| Knobelaufgaben | physik/ Tab «Knobelaufgaben» (x1–x4: Mobile, Lastwagen auf Brücke, Gabelstapler, Kugelbahn) | neu/#/physik/knobel (18 Aufgaben x1–x18, 4 Lernkarten, Fehlerwerte; neu x2/x8/x12/x17 Fehler finden, x3/x10/x14 Umgekehrt, x4/x7/x11/x18 Was wäre wenn, x6/x16 Schätzen, x15 Begründen; Bilder `mobile`, `stapler`, `bahn` in `faecher/physik/knobelaufgaben/bilder.ts`, Brücke nutzt `traeger` aus Lagerkräfte) |
| GPS-Grundsätze und Grössenmass (Zeichnungstechnik, neues Fach `zeichnung`) | neu geschrieben nach Swissmem ISO-GPS-Guide S. 5–16 (PDFs im privaten Repo `unterlagen/pdf/swissmem-iso-gps-guide-*.pdf`) | neu/#/zeichnung/gps (24 Aufgaben g1–g24, 3 Lernkarten, nur Auswahlfragen mit Erklärung pro falscher Antwort; Bilder `hierarchie`, `massmerkmale` in `faecher/zeichnung/gps-grundsaetze/bilder.ts`) |
| GPS vertieft (Zeichnungstechnik) | neu geschrieben nach Swissmem ISO-GPS-Guide S. 17–70, 100–147 (gleiche PDFs) | neu/#/zeichnung/gps2 (41 Aufgaben m1–m41, 5 Lernkarten; Zahlenaufgaben m1–m7, m11, m12, m30 mit Messwerten auf 0,01 mm und eigener Toleranz `tol: 0,0004`; sonst Auswahlfragen) |

## Wiederverwendbare Bilder (für Probeprüfungen)
- `faecher/maschinen/getriebearten/bilder.ts`: `getriebe(art)` zeichnet ein Getriebe gross, `getriebeUebersicht(reihe)` alle vier mit Nummern 1–4 in frei wählbarer Reihenfolge. `art` = `stirn` | `kegel` | `schraube` | `schnecke`. `ART[art]` liefert Name und Lage der Wellen. Eigene Zeichnungen, keine Buchbilder.
- `faecher/maschinen/zahnrad/bilder.ts`: `rad`, `zahn`, `paar`, `kranz` (Zahnkranz mit echter Verzahnung).
- `faecher/maschinen/uebersetzung/bilder.ts`: `reihe({zs, cw, frage?})` Räderzug mit Drehsinn-Pfeilen und «?», `schema({stufen, namen?, an?, ab?, trommel?})` Getriebeschema.
- `faecher/zeichnung/gps-grundsaetze/bilder.ts`: `hierarchie(fragen?)` (drei Stufen der GPS-Normen), `massmerkmale()` (vier Gruppen der Grössenmassmerkmale).

## Wissensspeicher (Nachschlagen)
- Pro Fach optional `wissen: Wissen[]` in `faecher/index.ts` (Typ `Wissen` in `core/types.ts`). Datei `faecher/<fach>/wissen.ts`.
- Seite `#/<fach>/wissen`, Knopf «Nachschlagen» auf der Fachseite. Einträge nach Thema gruppiert, mit Link zum Kapitel und Quelle.
- Neue Unterlagen: bestehende Einträge ergänzen, nicht doppelt anlegen. Bisher nur Fach `zeichnung`.

## Design
- Stil «Achromatic ledger» (Design-Skill, Seed 1226934261): Oberfläche ohne Farbe, Hauptknopf fast schwarz, Grund blaugrau #f2f4f7 (Zeichenpapier). Farbe nur auf Daten: Bauteilbilder, Formeln, richtig/falsch.
- Schrift Geist (lokal gebündelt über @fontsource), Geist Mono nur für IDs.
- Erkennungsmerkmal: Jedes Bild steht auf einem weissen Zeichnungsblatt mit Schriftfeld (Aufgabe, Stufe, Art, Lernkarte, Massstab).
- Seiten: Kapitel = Liste nach Lernkarten + Formelkarte rechts; Aufgabe = Einzelansicht mit Vorherige/Nächste; Test = alle Aufgaben untereinander.
- Prüfen: `node <skill>/scripts/inspect.mjs --app <url>` (Ziel 0 FAIL).
