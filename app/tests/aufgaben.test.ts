// Prüft jede Aufgabe aller Fächer mit vielen Zufallswerten.
import { describe, expect, it } from 'vitest';
import { FAECHER } from '../src/faecher';
import { isChoice, pruefeAuswahl, pruefeZahl, TOL } from '../src/core/pruefen';
import { fmt } from '../src/core/zahl';
import { aufgabenKarte } from '../src/core/ui/aufgabe';
import { note, waehleTest } from '../src/core/ui/seiten';

const LAEUFE = 50;

for (const fach of FAECHER) {
  for (const kap of fach.kapitel) {
    describe(`${fach.title} › ${kap.title}`, () => {
      it('hat eindeutige IDs und gültige Lernkarten', () => {
        const ids = kap.aufgaben.map((t) => t.id);
        expect(new Set(ids).size).toBe(ids.length);
        const karten = new Set(kap.karten.map((k) => k.id));
        for (const t of kap.aufgaben) expect(karten.has(t.karte), `${t.id}: Karte ${t.karte}`).toBe(true);
      });

      it('jede Lernkarte hat Aufgaben', () => {
        for (const k of kap.karten) expect(kap.aufgaben.some((t) => t.karte === k.id), k.id).toBe(true);
      });

      for (const t of kap.aufgaben) {
        it(`${t.id} ${t.title}`, () => {
          for (let n = 0; n < LAEUFE; n++) {
            const p = t.gen();
            const asks = t.asks(p);
            expect(asks.length).toBeGreaterThan(0);
            for (const a of asks) {
              if (isChoice(a)) {
                expect(a.a).toBeGreaterThanOrEqual(0);
                expect(a.a).toBeLessThan(a.opts.length);
                expect(new Set(a.opts).size, `${t.id}: doppelte Optionen`).toBe(a.opts.length);
                expect(pruefeAuswahl(a.a, a).ok).toBe(true);
              } else {
                expect(Number.isFinite(a.v), `${t.id}: ${a.k} endlich`).toBe(true);
                expect(a.v, `${t.id}: ${a.k} positiv`).toBeGreaterThan(0);
                // Musterlösung, so wie sie angezeigt wird, muss als richtig gelten
                expect(pruefeZahl(String(a.v).replace('.', ','), a).ok).toBe(true);
                expect(pruefeZahl(fmt(a.v), a).ok, `${t.id}: gerundete Anzeige ${fmt(a.v)} ≠ ${a.v}`).toBe(true);
              }
            }
            for (const fe of t.fehler?.(p) ?? []) {
              const a = asks[fe.ask];
              expect(a, `${t.id}: Fehler zeigt auf Teilfrage ${fe.ask}`).toBeDefined();
              if (!a || isChoice(a)) continue;
              // Fehlwert darf nicht mit der richtigen Antwort zusammenfallen
              expect(Math.abs(fe.v - a.v) > Math.abs(a.v) * TOL, `${t.id}: Fehlwert ${fe.v} ≈ richtig ${a.v}`).toBe(true);
              const u = pruefeZahl(String(fe.v), a, [fe]);
              expect(u.ok).toBe(false);
              expect(u.msg).toBe(fe.msg);
            }
            expect(t.tipps(p).length).toBeGreaterThanOrEqual(2);
            expect(t.loesung(p).length).toBeGreaterThan(0);
            for (const s of [t.text(p), ...t.tipps(p), ...t.loesung(p)]) {
              expect(s).not.toMatch(/undefined|NaN|Infinity|\[object/);
            }
            if (t.draw) {
              const svg = t.draw(p);
              expect(svg.tagName).toBe('svg');
              expect(svg.outerHTML).not.toMatch(/NaN|undefined|Infinity/);
            }
          }
        });
      }

      it('Aufgabenkarten lassen sich darstellen', () => {
        for (const t of kap.aufgaben) {
          const k = aufgabenKarte(t);
          expect(k.querySelector('h2')?.textContent).toBe(t.title);
          expect(k.querySelector('.schriftfeld')).not.toBeNull();
        }
      });

      it('Kapiteltest wählt passende Aufgaben', () => {
        const w = waehleTest(kap.aufgaben);
        expect(w.length).toBe(Math.min(8, kap.aufgaben.length));
        expect(new Set(w).size).toBe(w.length);
      });
    });
  }
}

describe('Kern', () => {
  it('Note', () => {
    expect(note(0, 10)).toBe(1);
    expect(note(10, 10)).toBe(6);
    expect(note(5, 10)).toBe(3.5);
  });
  it('Zahlen mit Komma, Apostroph und Einheitenfehler', () => {
    const a = { k: 'F', unit: 'N', v: 1250 };
    expect(pruefeZahl("1'250", a).ok).toBe(true);
    expect(pruefeZahl('1250,0', a).ok).toBe(true);
    expect(pruefeZahl('1,25', a).msg).toMatch(/Einheiten/);
    expect(pruefeZahl('abc', a).ok).toBe(false);
  });
});

describe('Wissensspeicher', () => {
  for (const fach of FAECHER.filter((f) => f.wissen)) {
    it(`${fach.title}: Einträge sind vollständig und verweisen auf echte Kapitel`, () => {
      const ids = fach.wissen!.map((w) => w.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const w of fach.wissen!) {
        expect(w.titel && w.text && w.quelle && w.thema, w.id).toBeTruthy();
        expect(w.datum).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        if (w.kapitel) expect(fach.kapitel.some((k) => k.id === w.kapitel), `${w.id}: Kapitel ${w.kapitel}`).toBe(true);
        expect(`${w.text}${w.formel ?? ''}`).not.toMatch(/undefined|NaN/);
      }
    });
  }
});
