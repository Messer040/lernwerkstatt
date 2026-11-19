# Anleitung: Ein Physik-Kapitel in die neue Lernwerkstatt umziehen

Für jedes Modell (auch Sonnet) gedacht. Muster: `app/src/faecher/physik/drehmoment/` (fertig umgezogen).
Vorher lesen: `CLAUDE.md`, `docs/ARCHITEKTUR.md`. Nicht nachfragen, nach dieser Anleitung entscheiden.

## Reihenfolge der Kapitel
1. Kräfte addieren · 2. Kräfte zerlegen · 3. An der Wand · 4. Lagerkräfte · 5. Kettenaufgaben · 6. Umfangskraft · 7. Reibung ·
8. Arbeit, Energie · 9. Leistung, Wirkungsgrad · 10. Einfache Maschinen · 11. Beschleunigungs- und Gewichtskraft · 12. Bewegungen · 13. Biegen · 14. Knobelaufgaben

## Wo die alten Aufgaben liegen (`physik/index.html`, Zeilennummern Stand 19.11.2026)
| Kapitel | Tab-Key | Arrays (Zeile) |
| --- | --- | --- |
| Kräfte addieren | `kraft` | KTASKS (262), KB (2192), KK (2241) |
| Kräfte zerlegen | `zerl` | ZTASKS (1056), ZB (2216), ZK (2255) |
| An der Wand | `wand` | WTASKS (1193) |
| Lagerkräfte | `lager` | LTASKS (335), CTASKS (1725) |
| Kettenaufgaben | `kette` | KETTE (2531) |
| Umfangskraft | `umf` | UTASKS (428), UB (1826), UK (1865) |
| Reibung | `reib` | RTASKS (493), RB (1935), RK (1984) |
| Arbeit, Energie | `arb` | ATASKS (604), AB (2049), AK (2105) |
| Leistung, Wirkungsgrad | `leist` | PTASKS (655) |
| Einfache Maschinen | `masch` | ETASKS (741), MB (2427), MK (2473) |
| Beschleunigung, Gewichtskraft | `bkraft` | BB (2289), BK (2326) |
| Bewegungen | `beweg` | GTASKS (1593), KTASKS2 (1641) |
| Biegen | `biege` | GB (2360), GK (2385) |
| Knobel | `knobel` | XTASKS (836) |
Zeichenfunktionen (`drawXxx`) stehen meist direkt über den Arrays. Formeln/Erklärtexte: `secs.<key>` im alten File.
Kennzahl, Grafikmotive und Buchdaten: `docs/STAND_physik.md`.

## Übersetzung alt → neu
| alt | neu |
| --- | --- |
| `lvl: 1/2/3` | `stufe: 1/2/3` |
| `hints(p)` | `tipps(p)`: genau 3 Stufen (Prinzip, erster Schritt, ganzer Weg). Fehlende Stufe ergänzen. |
| `sol(p)` | `loesung(p)` |
| `solDraw(p)` | `loesungsbild(p)` |
| `asks(p) = [{k, unit, v}]` | gleich; Auswahl neu als `{kind:'choice', k, opts, a, why}` |
| `bk()`, `src` | weglassen bzw. `src` übernehmen |
| `draw(p)` mit `mkSvg`, `force`, `dimH`, `dimV`, `ground`, `beam`, `pin`, `pivot`, `box`, `rot` | `blatt`, `kraft`, `massH`, `massV`, `boden`, `balken`, `bolzen`, `drehbock`, `kiste`, `moment` aus `core/draw/svg.ts` |
| `CF CL CM CR` | `C.F C.L C.M C.R` |
| `f() l() m() eq()` | gleich, aus `core/text.ts` |
| `g` (9.81) | lokal `const g = 9.81` |
Fehlt ein Zeichenbaustein, in `core/draw/svg.ts` ergänzen (wiederverwendbar) und nicht im Kapitel duplizieren.

## Pflicht pro Kapitel
1. Ordner `app/src/faecher/physik/<kapitel>/` mit `bilder.ts`, `aufgaben.ts`, `index.ts` (Formeln, 3–5 Lernkarten mit Ziel).
2. Alle alten Aufgaben übernehmen. Jede bekommt `karte`, `stufe`, `familie`.
3. **Fehlerwerte** (`fehler`): mindestens 1 typischer Denkfehler pro Rechenaufgabe, mit kurzer Erklärung (vertauschte Hebelarme, mm statt m, Radius statt Durchmesser, sin statt cos, vergessenes g, falsches Vorzeichen …).
4. Mindestens 4 Familien im Kapitel, darunter **Fehler finden**, **Schätzen** und **Umgekehrt**. Fehlende als neue Aufgaben ergänzen (Muster: d10–d13).
5. In `app/src/faecher/index.ts` eintragen und aus `geplant` streichen.
6. `cd app && npm test && npm run build` → alles grün.
7. Bilder prüfen: Screenshot bei 390 px und 1440 px, keine überlappenden Beschriftungen.
8. In `docs/ARCHITEKTUR.md` Tabelle «Umgezogen» ergänzen, in `docs/VERBESSERUNGEN.md` Auffälliges eintragen.
9. Commit (kurz, deutsch), push auf `main`. Elias kurz berichten: Anzahl Aufgaben, was neu ist, was offen bleibt.

## Nicht tun
- Den alten Trainer nicht ändern oder löschen (bleibt online, bis alles umgezogen ist).
- Nichts speichern (kein localStorage), keine Freischaltung.
- Keine neue Farbe in der Oberfläche. Farbe nur in Bildern und Formeln.
- Elias nicht nach Buchdetails fragen.
