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
      draw/svg.ts           Zeichenbausteine: blatt, kraft, massH/V, balken, bolzen, …
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
| Drehmoment, Hebelgesetz | physik/ Tab «Drehmoment» (d1–d9) | neu/#/physik/dreh (d1–d13, mit Fehlerwerten) |
