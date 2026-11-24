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
| Reihenschaltung (Elektrotechnik) | neu geschrieben nach Buch 3.7.1, Aufgaben 1–15 (Fotos im privaten Repo `unterlagen/bilder/2026-11-24-reihenschaltung/`) | neu/#/elektro/reihe (18 Aufgaben r1–r18, 5 Lernkarten, Fehlerwerte; Buch Nr. 7 steht als e5 im Kapitel Masche; Bild `reihe` in `faecher/elektro/reihenschaltung/bilder.ts`) |

## Design
- Stil «Achromatic ledger» (Design-Skill, Seed 1226934261): Oberfläche ohne Farbe, Hauptknopf fast schwarz, Grund blaugrau #f2f4f7 (Zeichenpapier). Farbe nur auf Daten: Bauteilbilder, Formeln, richtig/falsch.
- Schrift Geist (lokal gebündelt über @fontsource), Geist Mono nur für IDs.
- Erkennungsmerkmal: Jedes Bild steht auf einem weissen Zeichnungsblatt mit Schriftfeld (Aufgabe, Stufe, Art, Lernkarte, Massstab).
- Seiten: Kapitel = Liste nach Lernkarten + Formelkarte rechts; Aufgabe = Einzelansicht mit Vorherige/Nächste; Test = alle Aufgaben untereinander.
- Prüfen: `node <skill>/scripts/inspect.mjs --app <url>` (Ziel 0 FAIL).
