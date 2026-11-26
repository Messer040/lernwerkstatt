// Aufgaben zum Kapitel Parallelschaltung (eigene Aufgaben, Buchaufgaben folgen mit «ergänzen»).
// Farben im Text: Spannung blau (l), Teilstrom magenta (f), Gesamtstrom grün (m).
import { task, type Task } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { fmt, pick } from '../../../core/zahl';
import { parallel } from './bilder';

const sp = l; // Spannung
const it = f; // Teilstrom
const ig = m; // Gesamtstrom

const par = (...r: number[]) => 1 / r.reduce((s, x) => s + 1 / x, 0);
const KREATIV = 'Kreativ';

/** Auswahl mit wechselnder Stelle der richtigen Antwort. opts[0] und why[0] gehören zur richtigen Antwort. */
function wahl(k: string, opts: string[], why: string[], pos: number) {
  const n = opts.length, s = pos % n;
  const o = opts.map((_, i) => opts[(i - s + n) % n]);
  const w = why.map((_, i) => why[(i - s + n) % n]);
  return { kind: 'choice' as const, k, opts: o, a: s, why: w.map((x, i) => (i === s ? undefined : x)) };
}
const pos = () => pick([0, 1, 2, 3]);

export const AUFGABEN: Task[] = [
  // ---------- Ersatzwiderstand ----------

  task({
    id: 'p1', karte: 'ersatz', stufe: 1, familie: 'rechnen', src: KREATIV,
    title: 'Zwei Widerstände parallel',
    gen: () => ({ r1: pick([12, 15, 20, 24]), r2: pick([30, 40, 48, 60]), u: pick([24, 48]) }),
    draw: (p) => parallel([{ name: 'R1', wert: `${p.r1} Ω`, i: 'I1 = ?' }, { name: 'R2', wert: `${p.r2} Ω`, i: 'I2 = ?' }], { U: `U = ${p.u} V`, I: 'I = ?' }),
    text: (p) => `R1 = ${p.r1} Ω und R2 = ${p.r2} Ω liegen parallel an ${sp('U = ' + p.u + ' V')}. Berechne a) den Teilstrom I1, b) den Teilstrom I2, c) den Gesamtstrom I und d) den Ersatzwiderstand R.`,
    asks: (p) => [
      { k: 'a) I1', unit: 'A', v: p.u / p.r1 },
      { k: 'b) I2', unit: 'A', v: p.u / p.r2 },
      { k: 'c) I', unit: 'A', v: p.u / p.r1 + p.u / p.r2 },
      { k: 'd) R', unit: 'Ω', v: par(p.r1, p.r2) },
    ],
    fehler: (p) => [
      { ask: 0, v: p.u / (p.r1 + p.r2), msg: 'Das wäre der Strom in Reihe. Parallel liegt an jedem Widerstand die volle Spannung: I1 = U : R1.' },
      { ask: 3, v: p.r1 + p.r2, msg: 'Das ist die Formel der Reihenschaltung. Parallel ist R kleiner als der kleinste Widerstand.' },
    ],
    tipps: () => [
      'Parallel liegt an jedem Widerstand dieselbe Spannung U.',
      'I1 = U : R1 und I2 = U : R2. Der Gesamtstrom ist die Summe.',
      'R = U : I oder R = R1 · R2 : (R1 + R2). Beide Wege geben dasselbe.',
    ],
    loesung: (p) => {
      const i1 = p.u / p.r1, i2 = p.u / p.r2, R = par(p.r1, p.r2);
      return [
        `a) ${eq(it('I1') + ' = ' + sp('U') + ' : R1 = ' + p.u + ' V : ' + p.r1 + ' Ω = ' + it(fmt(i1) + ' A'))}`,
        `b) ${eq(it('I2') + ' = ' + p.u + ' V : ' + p.r2 + ' Ω = ' + it(fmt(i2) + ' A'))}`,
        `c) ${eq(ig('I') + ' = ' + it('I1') + ' + ' + it('I2') + ' = ' + fmt(i1) + ' A + ' + fmt(i2) + ' A = ' + ig(fmt(i1 + i2) + ' A'))}`,
        `d) ${eq('R = R1 · R2 : (R1 + R2) = ' + p.r1 * p.r2 + ' : ' + (p.r1 + p.r2) + ' = ' + fmt(R) + ' Ω')}`,
        `Probe: ${eq('R = ' + sp('U') + ' : ' + ig('I') + ' = ' + p.u + ' V : ' + fmt(i1 + i2) + ' A = ' + fmt(R) + ' Ω')}. R ist kleiner als R1.`,
      ];
    },
  }),

  task({
    id: 'p2', karte: 'ersatz', stufe: 2, familie: 'rechnen', src: KREATIV,
    title: 'Drei Widerstände: Kehrwerte addieren',
    gen: () => {
      const [r1, r2, r3] = pick([[100, 150, 300], [60, 120, 120], [20, 30, 60], [40, 60, 120], [200, 300, 600], [30, 60, 60]] as const);
      return { r1, r2, r3, u: pick([12, 24]) };
    },
    draw: (p) => parallel([{ name: 'R1', wert: `${p.r1} Ω` }, { name: 'R2', wert: `${p.r2} Ω` }, { name: 'R3', wert: `${p.r3} Ω` }], { U: `U = ${p.u} V`, I: 'I = ?' }),
    text: (p) => `Drei Widerstände liegen parallel an ${sp('U = ' + p.u + ' V')}: R1 = ${p.r1} Ω, R2 = ${p.r2} Ω, R3 = ${p.r3} Ω. Berechne a) den Ersatzwiderstand R und b) den Gesamtstrom I in mA.`,
    asks: (p) => {
      const R = par(p.r1, p.r2, p.r3);
      return [
        { k: 'a) R', unit: 'Ω', v: R },
        { k: 'b) I', unit: 'mA', v: (p.u / R) * 1000 },
      ];
    },
    fehler: (p) => [
      { ask: 0, v: 1 / p.r1 + 1 / p.r2 + 1 / p.r3, msg: 'Das ist 1 : R. Du musst am Schluss noch den Kehrwert bilden.' },
      { ask: 0, v: p.r1 + p.r2 + p.r3, msg: 'Das ist die Formel der Reihenschaltung. Parallel addierst du die Kehrwerte.' },
      { ask: 0, v: (p.r1 * p.r2 * p.r3) / (p.r1 + p.r2 + p.r3), msg: '«Produkt durch Summe» gilt nur für zwei Widerstände. Bei drei addierst du die Kehrwerte.' },
    ],
    tipps: () => [
      'Parallel addierst du die Kehrwerte: 1 : R = 1 : R1 + 1 : R2 + 1 : R3.',
      'Rechne die drei Brüche aus und zähle sie zusammen. Dann den Kehrwert bilden.',
      'I = U : R. Mal 1000 ergibt mA.',
    ],
    loesung: (p) => {
      const s = 1 / p.r1 + 1 / p.r2 + 1 / p.r3, R = 1 / s;
      return [
        `a) ${eq('1 : R = 1 : ' + p.r1 + ' + 1 : ' + p.r2 + ' + 1 : ' + p.r3 + ' = ' + fmt(s, 5) + ' 1/Ω')}`,
        `${eq('R = 1 : ' + fmt(s, 5) + ' = ' + fmt(R) + ' Ω')}`,
        `b) ${eq(ig('I') + ' = ' + sp('U') + ' : R = ' + p.u + ' V : ' + fmt(R) + ' Ω = ' + ig(fmt((p.u / R) * 1000) + ' mA'))}`,
        'Kontrolle: R ist kleiner als der kleinste Widerstand ' + Math.min(p.r1, p.r2, p.r3) + ' Ω.',
      ];
    },
  }),

  task({
    id: 'p3', karte: 'ersatz', stufe: 2, familie: 'rechnen', src: KREATIV,
    title: 'Widerstände in kΩ, Ströme in mA',
    gen: () => ({ r1: pick([1, 1.5, 2.2, 3.3]), r2: pick([4.7, 6.8, 10]), u: pick([5, 9, 12]) }),
    draw: (p) => parallel([{ name: 'R1', wert: `${fmt(p.r1)} kΩ`, i: 'I1 = ?' }, { name: 'R2', wert: `${fmt(p.r2)} kΩ`, i: 'I2 = ?' }], { U: `U = ${p.u} V`, I: 'I = ?' }),
    text: (p) => `R1 = ${fmt(p.r1)} kΩ und R2 = ${fmt(p.r2)} kΩ liegen parallel an ${sp('U = ' + p.u + ' V')}. Berechne a) I1 in mA, b) I2 in mA, c) I in mA und d) R in kΩ.`,
    asks: (p) => [
      { k: 'a) I1', unit: 'mA', v: p.u / p.r1 },
      { k: 'b) I2', unit: 'mA', v: p.u / p.r2 },
      { k: 'c) I', unit: 'mA', v: p.u / p.r1 + p.u / p.r2 },
      { k: 'd) R', unit: 'kΩ', v: par(p.r1, p.r2) },
    ],
    fehler: (p) => [
      { ask: 3, v: p.r1 + p.r2, msg: 'Das ist die Formel der Reihenschaltung. Parallel: R = R1 · R2 : (R1 + R2).' },
      { ask: 2, v: p.u / (p.r1 + p.r2), msg: 'Du hast mit R1 + R2 gerechnet. Parallel ist der Gesamtstrom die Summe der Teilströme.' },
    ],
    tipps: () => ['Bleib bei kΩ und mA: V : kΩ = mA.', 'I1 = U : R1, I2 = U : R2, I = I1 + I2.', 'R = U : I. Mit V und mA kommt R in kΩ heraus.'],
    loesung: (p) => {
      const i1 = p.u / p.r1, i2 = p.u / p.r2;
      return [
        `a) ${eq(it('I1') + ' = ' + p.u + ' V : ' + fmt(p.r1) + ' kΩ = ' + it(fmt(i1) + ' mA'))}`,
        `b) ${eq(it('I2') + ' = ' + p.u + ' V : ' + fmt(p.r2) + ' kΩ = ' + it(fmt(i2) + ' mA'))}`,
        `c) ${eq(ig('I') + ' = ' + fmt(i1) + ' mA + ' + fmt(i2) + ' mA = ' + ig(fmt(i1 + i2) + ' mA'))}`,
        `d) ${eq('R = ' + sp('U') + ' : ' + ig('I') + ' = ' + p.u + ' V : ' + fmt(i1 + i2, 3) + ' mA = ' + fmt(par(p.r1, p.r2), 3) + ' kΩ')}`,
        'Trick: Mit kΩ und mA brauchst du keine Zehnerpotenzen.',
      ];
    },
  }),

  task({
    id: 'p4', karte: 'ersatz', stufe: 1, familie: 'schaetzen', src: KREATIV + ' · Schätzen',
    title: 'Schätzen: ein kleiner und ein sehr grosser Widerstand',
    gen: () => ({ r1: pick([47, 100, 220]), f: pick([50, 100]), pos: pos() }),
    draw: (p) => parallel([{ name: 'R1', wert: `${p.r1} Ω` }, { name: 'R2', wert: `${fmt((p.r1 * p.f) / 1000)} kΩ` }], { U: 'U' }),
    text: (p) => `R1 = ${p.r1} Ω und R2 = ${fmt((p.r1 * p.f) / 1000)} kΩ liegen parallel. a) Schätze ohne Rechner: Wie gross ist der Ersatzwiderstand ungefähr? b) Rechne genau nach.`,
    asks: (p) => {
      const r2 = p.r1 * p.f;
      return [
        wahl('a) Schätzung', [
          `knapp unter ${p.r1} Ω`,
          `etwa ${fmt((r2 + p.r1) / 2000)} kΩ`,
          `etwa ${fmt(r2 / 1000)} kΩ`,
          `etwa ${fmt((r2 + p.r1) / 1000, 2)} kΩ`,
        ], [
          '',
          'Das ist der Mittelwert. Parallel ist R kleiner als der kleinste Widerstand.',
          'Der grosse Widerstand bestimmt nicht. Fast der ganze Strom nimmt den leichten Weg durch R1.',
          'Das ist R1 + R2, also die Reihenschaltung.',
        ], p.pos),
        { k: 'b) R', unit: 'Ω', v: par(p.r1, r2) },
      ];
    },
    fehler: (p) => [{ ask: 1, v: p.r1 + p.r1 * p.f, msg: 'Das ist R1 + R2. Parallel: R = R1 · R2 : (R1 + R2).' }],
    tipps: () => ['Parallel ist R immer kleiner als der kleinste Widerstand.', 'Durch den grossen Widerstand fliesst kaum Strom. Er ändert fast nichts.', 'Genau: R = R1 · R2 : (R1 + R2).'],
    loesung: (p) => {
      const r2 = p.r1 * p.f;
      return [
        `a) Der kleine Widerstand bestimmt: R liegt knapp unter ${p.r1} Ω.`,
        `b) ${eq('R = ' + p.r1 + ' · ' + r2 + ' : (' + p.r1 + ' + ' + r2 + ') = ' + fmt(par(p.r1, r2)) + ' Ω')}`,
        `Faustregel: Ist ein Widerstand mehr als 10-mal grösser, ist R fast gleich dem kleineren.`,
      ];
    },
  }),

  task({
    id: 'p5', karte: 'ersatz', stufe: 1, familie: 'fehler', src: KREATIV + ' · Fehler finden',
    title: 'Fehler finden: Widerstände addiert',
    gen: () => ({ r1: pick([20, 30, 40, 60]), r2: pick([60, 120]), pos: pos() }),
    draw: (p) => parallel([{ name: 'R1', wert: `${p.r1} Ω` }, { name: 'R2', wert: `${p.r2} Ω` }], { U: 'U', I: 'I' }),
    text: (p) => `Mia rechnet den Ersatzwiderstand der Schaltung im Bild: «R = ${p.r1} Ω + ${p.r2} Ω = ${p.r1 + p.r2} Ω». a) Was ist falsch? b) Wie gross ist R richtig?`,
    asks: (p) => [
      wahl('a) Fehler', [
        'Sie hat wie bei Reihe addiert. Parallel ist R kleiner als jeder Teilwiderstand.',
        'Die Zahl stimmt, nur die Einheit ist falsch.',
        'Sie hätte die Widerstände subtrahieren müssen.',
        'Nichts, so rechnet man jede Schaltung.',
      ], [
        '',
        'Ω ist die richtige Einheit. Falsch ist die Formel.',
        'Subtrahieren gibt es hier nicht. Parallel addierst du die Kehrwerte.',
        'Addieren gilt nur in Reihe. Parallel teilt sich der Strom auf zwei Wege, das macht es leichter.',
      ], p.pos),
      { k: 'b) R', unit: 'Ω', v: par(p.r1, p.r2) },
    ],
    fehler: (p) => [{ ask: 1, v: p.r1 + p.r2, msg: 'Das ist Mias Fehler. Parallel: R = R1 · R2 : (R1 + R2).' }],
    tipps: () => ['Zwei Wege für den Strom: Ist das leichter oder schwerer als ein Weg?', 'Parallel wird R kleiner. Mehr Wege, mehr Strom.', 'R = R1 · R2 : (R1 + R2)'],
    loesung: (p) => [
      'a) Mia hat die Formel der Reihenschaltung genommen.',
      `b) ${eq('R = ' + p.r1 + ' · ' + p.r2 + ' : (' + p.r1 + ' + ' + p.r2 + ') = ' + p.r1 * p.r2 + ' : ' + (p.r1 + p.r2) + ' = ' + fmt(par(p.r1, p.r2)) + ' Ω')}`,
      'Kontrolle: Parallel muss R kleiner als der kleinste Widerstand sein.',
    ],
  }),

  task({
    id: 'p6', karte: 'ersatz', stufe: 2, familie: 'umgekehrt', src: KREATIV + ' · Umgekehrt',
    title: 'Welcher Widerstand fehlt?',
    gen: () => {
      const [r1, R] = pick([[60, 40], [30, 20], [100, 75], [12, 8], [150, 100], [40, 24]] as const);
      return { r1, R, u: pick([12, 24]) };
    },
    draw: (p) => parallel([{ name: 'R1', wert: `${p.r1} Ω` }, { name: 'R2', wert: 'R2 = ?', i: 'I2 = ?' }], { U: `U = ${p.u} V` }),
    text: (p) => `Zu R1 = ${p.r1} Ω schaltet man R2 parallel. Der Ersatzwiderstand soll R = ${p.R} Ω sein. Die Schaltung liegt an ${sp('U = ' + p.u + ' V')}. Berechne a) R2 und b) den Teilstrom I2 in mA.`,
    asks: (p) => {
      const r2 = (p.R * p.r1) / (p.r1 - p.R);
      return [
        { k: 'a) R2', unit: 'Ω', v: r2 },
        { k: 'b) I2', unit: 'mA', v: (p.u / r2) * 1000 },
      ];
    },
    fehler: (p) => [
      { ask: 0, v: p.r1 - p.R, msg: 'R2 = R1 − R gilt in Reihe. Parallel rechnest du mit den Kehrwerten: 1 : R2 = 1 : R − 1 : R1.' },
      { ask: 1, v: (p.u / p.R) * 1000, msg: 'Das ist der Gesamtstrom. Durch R2 fliesst nur I2 = U : R2.' },
    ],
    tipps: () => ['1 : R = 1 : R1 + 1 : R2. Stelle nach 1 : R2 um.', '1 : R2 = 1 : R − 1 : R1. Dann den Kehrwert bilden.', 'Kurzform: R2 = R · R1 : (R1 − R). Dann I2 = U : R2.'],
    loesung: (p) => {
      const r2 = (p.R * p.r1) / (p.r1 - p.R);
      return [
        `a) ${eq('1 : R2 = 1 : ' + p.R + ' − 1 : ' + p.r1 + ' = ' + fmt(1 / p.R - 1 / p.r1, 5) + ' 1/Ω')}, ${eq('R2 = ' + fmt(r2) + ' Ω')}`,
        `b) ${eq(it('I2') + ' = ' + sp('U') + ' : R2 = ' + p.u + ' V : ' + fmt(r2) + ' Ω = ' + it(fmt((p.u / r2) * 1000) + ' mA'))}`,
        `Probe: ${eq(p.r1 + ' · ' + fmt(r2) + ' : (' + p.r1 + ' + ' + fmt(r2) + ') = ' + fmt(par(p.r1, r2)) + ' Ω')}`,
      ];
    },
  }),

  task({
    id: 'p7', karte: 'ersatz', stufe: 2, familie: 'rechnen', src: KREATIV,
    title: 'Mit Leitwerten rechnen',
    gen: () => ({ r1: pick([100, 200, 250]), r2: pick([400, 500, 1000]), r3: pick([500, 1000, 2000]) }),
    draw: (p) => parallel([{ name: 'R1', wert: `${p.r1} Ω` }, { name: 'R2', wert: `${p.r2} Ω` }, { name: 'R3', wert: `${p.r3} Ω` }], { U: 'U' }),
    text: (p) => `Parallel addieren sich die Leitwerte: G = G1 + G2 + G3. R1 = ${p.r1} Ω, R2 = ${p.r2} Ω, R3 = ${p.r3} Ω. Berechne a) den Gesamtleitwert G in mS und b) den Ersatzwiderstand R.`,
    asks: (p) => {
      const G = 1000 / p.r1 + 1000 / p.r2 + 1000 / p.r3;
      return [
        { k: 'a) G', unit: 'mS', v: G },
        { k: 'b) R', unit: 'Ω', v: 1000 / G },
      ];
    },
    fehler: (p) => [
      { ask: 0, v: 1000 / (p.r1 + p.r2 + p.r3), msg: 'Du hast zuerst die Widerstände addiert. Rechne jeden Leitwert einzeln: G1 = 1 : R1.' },
      { ask: 1, v: p.r1 + p.r2 + p.r3, msg: 'Das ist die Reihenschaltung. Parallel ist R = 1 : G.' },
    ],
    tipps: () => ['Leitwert = Kehrwert des Widerstands. 1 : 100 Ω = 0,01 S = 10 mS.', 'G1 = 1000 : R1 in mS. Dann G = G1 + G2 + G3.', 'R = 1 : G. Mit G in mS: R = 1000 : G in Ω.'],
    loesung: (p) => {
      const g1 = 1000 / p.r1, g2 = 1000 / p.r2, g3 = 1000 / p.r3, G = g1 + g2 + g3;
      return [
        `a) ${eq('G = ' + fmt(g1) + ' mS + ' + fmt(g2) + ' mS + ' + fmt(g3) + ' mS = ' + fmt(G) + ' mS')}`,
        `b) ${eq('R = 1 : G = 1000 : ' + fmt(G) + ' = ' + fmt(1000 / G) + ' Ω')}`,
        'Leitwerte sind der schnellste Weg bei drei und mehr Zweigen.',
      ];
    },
  }),

  // ---------- Teilströme und Knotenregel ----------

  task({
    id: 'p8', karte: 'strom', stufe: 1, familie: 'bild', src: KREATIV + ' · Bild deuten',
    title: 'Knotenregel am Bild',
    gen: () => ({ i1: pick([0.5, 1, 1.5, 2]), i2: pick([1, 2, 2.5, 3]), i3: pick([0.5, 1, 1.5, 2, 3]), u: pick([12, 24]) }),
    draw: (p) => parallel([{ name: 'R1', i: `I1 = ${fmt(p.i1)} A` }, { name: 'R2', i: `I2 = ${fmt(p.i2)} A` }, { name: 'R3', wert: 'R3 = ?', i: 'I3 = ?' }], { U: `U = ${p.u} V`, I: `I = ${fmt(p.i1 + p.i2 + p.i3)} A` }),
    text: (p) => `Lies die Ströme im Bild ab. Die Schaltung liegt an ${sp('U = ' + p.u + ' V')}. Berechne a) den Teilstrom I3 und b) den Widerstand R3.`,
    asks: (p) => [
      { k: 'a) I3', unit: 'A', v: p.i3 },
      { k: 'b) R3', unit: 'Ω', v: p.u / p.i3 },
    ],
    fehler: (p) => {
      const I = p.i1 + p.i2 + p.i3;
      return [
        { ask: 0, v: I + p.i1 + p.i2, msg: 'Du hast addiert. Was in den Knoten fliesst, fliesst wieder heraus: I3 = I − I1 − I2.' },
        { ask: 1, v: p.u / I, msg: 'Das ist der Ersatzwiderstand. Für R3 nimmst du nur I3.' },
      ].filter((e) => Math.abs(e.v - (e.ask === 0 ? p.i3 : p.u / p.i3)) > 0.05 * e.v);
    },
    tipps: () => ['Knotenregel: Was in einen Knoten fliesst, fliesst wieder heraus.', 'I = I1 + I2 + I3, also I3 = I − I1 − I2.', 'An R3 liegt die volle Spannung U. R3 = U : I3.'],
    loesung: (p) => {
      const I = p.i1 + p.i2 + p.i3;
      return [
        `a) ${eq(it('I3') + ' = ' + ig('I') + ' − ' + it('I1') + ' − ' + it('I2') + ' = ' + fmt(I) + ' A − ' + fmt(p.i1) + ' A − ' + fmt(p.i2) + ' A = ' + it(fmt(p.i3) + ' A'))}`,
        `b) ${eq('R3 = ' + sp('U') + ' : ' + it('I3') + ' = ' + p.u + ' V : ' + fmt(p.i3) + ' A = ' + fmt(p.u / p.i3) + ' Ω')}`,
        'Der Strom teilt sich auf, die Spannung nicht.',
      ];
    },
  }),

  task({
    id: 'p9', karte: 'strom', stufe: 2, familie: 'rechnen', src: KREATIV,
    title: 'Gesamtstrom ist bekannt: Stromteiler',
    gen: () => ({ i: pick([3, 5, 6]), r1: pick([10, 20, 30]), r2: pick([20, 40, 60]) }),
    draw: (p) => parallel([{ name: 'R1', wert: `${p.r1} Ω`, i: 'I1 = ?' }, { name: 'R2', wert: `${p.r2} Ω`, i: 'I2 = ?' }], { U: 'U = ?', I: `I = ${p.i} A` }),
    text: (p) => `In die Parallelschaltung aus R1 = ${p.r1} Ω und R2 = ${p.r2} Ω fliesst ${ig('I = ' + p.i + ' A')}. Berechne a) den Ersatzwiderstand R, b) die Spannung U, c) den Teilstrom I1 und d) den Teilstrom I2.`,
    asks: (p) => {
      const R = par(p.r1, p.r2), U = R * p.i;
      return [
        { k: 'a) R', unit: 'Ω', v: R },
        { k: 'b) U', unit: 'V', v: U },
        { k: 'c) I1', unit: 'A', v: U / p.r1 },
        { k: 'd) I2', unit: 'A', v: U / p.r2 },
      ];
    },
    fehler: (p) => [
      { ask: 2, v: (p.i * p.r1) / (p.r1 + p.r2), msg: 'Verhältnis vertauscht. Durch den kleineren Widerstand fliesst der grössere Strom: I1 = I · R2 : (R1 + R2).' },
      { ask: 2, v: p.i / 2, msg: 'Der Strom teilt sich nur bei gleichen Widerständen halb-halb. Rechne I1 = U : R1.' },
    ].filter((e) => p.r1 !== p.r2 || e.ask !== 2),
    tipps: () => ['Zuerst R, dann U = R · I. Diese Spannung liegt an beiden Widerständen.', 'I1 = U : R1, I2 = U : R2.', 'Probe: I1 + I2 = I. Der kleinere Widerstand führt den grösseren Strom.'],
    loesung: (p) => {
      const R = par(p.r1, p.r2), U = R * p.i;
      return [
        `a) ${eq('R = ' + p.r1 + ' · ' + p.r2 + ' : (' + p.r1 + ' + ' + p.r2 + ') = ' + fmt(R) + ' Ω')}`,
        `b) ${eq(sp('U') + ' = R · ' + ig('I') + ' = ' + fmt(R, 3) + ' Ω · ' + p.i + ' A = ' + sp(fmt(U) + ' V'))}`,
        `c) ${eq(it('I1') + ' = ' + fmt(U, 3) + ' V : ' + p.r1 + ' Ω = ' + it(fmt(U / p.r1) + ' A'))}`,
        `d) ${eq(it('I2') + ' = ' + fmt(U, 3) + ' V : ' + p.r2 + ' Ω = ' + it(fmt(U / p.r2) + ' A'))}`,
        `Probe: ${eq(fmt(U / p.r1) + ' A + ' + fmt(U / p.r2) + ' A = ' + p.i + ' A')}. Kurzweg Stromteiler: ${eq(it('I1') + ' : ' + it('I2') + ' = R2 : R1')}`,
      ];
    },
  }),

  task({
    id: 'p10', karte: 'strom', stufe: 2, familie: 'umgekehrt', src: KREATIV + ' · Umgekehrt',
    title: 'Unbekannten Zweig aus dem Gesamtstrom finden',
    gen: () => ({ r1: pick([12, 16, 24, 48]), i2: pick([0.5, 1, 1.5, 2]) }),
    draw: (p) => parallel([{ name: 'R1', wert: `${p.r1} Ω`, i: 'I1' }, { name: 'R2', wert: 'R2 = ?', i: 'I2' }], { U: 'U = 24 V', I: `I = ${fmt(24 / p.r1 + p.i2)} A` }),
    text: (p) => `R1 = ${p.r1} Ω und ein unbekannter Widerstand R2 liegen parallel an ${sp('U = 24 V')}. Der Strommesser in der Zuleitung zeigt ${ig('I = ' + fmt(24 / p.r1 + p.i2) + ' A')}. Berechne a) I1, b) I2 und c) R2.`,
    asks: (p) => [
      { k: 'a) I1', unit: 'A', v: 24 / p.r1 },
      { k: 'b) I2', unit: 'A', v: p.i2 },
      { k: 'c) R2', unit: 'Ω', v: 24 / p.i2 },
    ],
    fehler: (p) => [
      { ask: 2, v: 24 / (24 / p.r1 + p.i2), msg: 'Das ist der Ersatzwiderstand. Für R2 brauchst du nur den Strom durch R2.' },
      { ask: 2, v: 24 / (24 / p.r1 + p.i2) - p.r1, msg: 'R2 = R − R1 gilt nur in Reihe. Rechne R2 = U : I2.' },
    ].filter((e) => e.v > 0),
    tipps: () => ['I1 kannst du sofort rechnen: An R1 liegt die volle Spannung.', 'Knotenregel: I2 = I − I1.', 'R2 = U : I2.'],
    loesung: (p) => {
      const i1 = 24 / p.r1, I = i1 + p.i2;
      return [
        `a) ${eq(it('I1') + ' = 24 V : ' + p.r1 + ' Ω = ' + it(fmt(i1) + ' A'))}`,
        `b) ${eq(it('I2') + ' = ' + ig('I') + ' − ' + it('I1') + ' = ' + fmt(I) + ' A − ' + fmt(i1) + ' A = ' + it(fmt(p.i2) + ' A'))}`,
        `c) ${eq('R2 = ' + sp('U') + ' : ' + it('I2') + ' = 24 V : ' + fmt(p.i2) + ' A = ' + fmt(24 / p.i2) + ' Ω')}`,
      ];
    },
  }),

  task({
    id: 'p11', karte: 'strom', stufe: 2, familie: 'fehler', src: KREATIV + ' · Fehler finden',
    title: 'Fehler finden: Stromteiler verkehrt herum',
    gen: () => ({ i: pick([3, 4, 6]), r1: pick([10, 20]), r2: pick([30, 40, 60]), pos: pos() }),
    draw: (p) => parallel([{ name: 'R1', wert: `${p.r1} Ω`, i: 'I1' }, { name: 'R2', wert: `${p.r2} Ω`, i: 'I2' }], { I: `I = ${p.i} A`, U: 'U' }),
    text: (p) => `Tim rechnet den Strom durch R1 = ${p.r1} Ω. Gegeben: R2 = ${p.r2} Ω, ${ig('I = ' + p.i + ' A')}. Er schreibt: «I1 = I · R1 : (R1 + R2) = ${fmt((p.i * p.r1) / (p.r1 + p.r2))} A». a) Was ist falsch? b) Wie gross ist I1 richtig?`,
    asks: (p) => [
      wahl('a) Fehler', [
        'Das Verhältnis ist vertauscht. Der kleinere Widerstand führt den grösseren Strom.',
        'Er hätte I durch 2 teilen müssen.',
        'Er hätte R1 + R2 als Ersatzwiderstand nehmen müssen.',
        'Nichts, die Rechnung stimmt.',
      ], [
        '',
        'Halb-halb gilt nur bei gleichen Widerständen.',
        'R1 + R2 ist die Reihenschaltung. Hier sind sie parallel.',
        'Prüfe: R1 ist der kleinere Widerstand. Nach Tim bekäme er den kleineren Strom.',
      ], p.pos),
      { k: 'b) I1', unit: 'A', v: (p.i * p.r2) / (p.r1 + p.r2) },
    ],
    fehler: (p) => [{ ask: 1, v: (p.i * p.r1) / (p.r1 + p.r2), msg: 'Das ist Tims Wert. Richtig: I1 = I · R2 : (R1 + R2).' }],
    tipps: () => ['Welcher Weg ist leichter für den Strom: der kleine oder der grosse Widerstand?', 'Stromteiler: I1 : I2 = R2 : R1. Das ist umgekehrt wie beim Spannungsteiler.', 'I1 = I · R2 : (R1 + R2). Sicherer Weg: zuerst U = R · I, dann I1 = U : R1.'],
    loesung: (p) => {
      const R = par(p.r1, p.r2), U = R * p.i;
      return [
        'a) Tim hat den Spannungsteiler der Reihenschaltung genommen. Beim Strom ist es umgekehrt.',
        `b) ${eq(it('I1') + ' = ' + p.i + ' A · ' + p.r2 + ' Ω : (' + p.r1 + ' Ω + ' + p.r2 + ' Ω) = ' + it(fmt((p.i * p.r2) / (p.r1 + p.r2)) + ' A'))}`,
        `Probe: ${eq(sp('U') + ' = ' + fmt(R, 3) + ' Ω · ' + p.i + ' A = ' + fmt(U) + ' V')}, ${eq(it('I1') + ' = ' + fmt(U, 3) + ' V : ' + p.r1 + ' Ω = ' + fmt(U / p.r1) + ' A')}`,
      ];
    },
  }),

  task({
    id: 'p12', karte: 'strom', stufe: 2, familie: 'waswaere', src: KREATIV + ' · Was wäre wenn',
    title: 'Was wäre wenn: ein dritter Widerstand kommt dazu',
    gen: () => ({ r1: pick([20, 30, 40]), r2: pick([40, 60]), r3: pick([24, 30, 60]), u: 24, pos: pos(), pos2: pos() }),
    draw: (p) => parallel([{ name: 'R1', wert: `${p.r1} Ω`, i: 'I1' }, { name: 'R2', wert: `${p.r2} Ω`, i: 'I2' }, { name: 'R3 neu', wert: `${p.r3} Ω`, i: 'I3' }], { U: `U = ${p.u} V`, I: 'I' }),
    text: (p) => `R1 = ${p.r1} Ω und R2 = ${p.r2} Ω liegen parallel an ${sp('U = ' + p.u + ' V')}. Jetzt schaltet man R3 = ${p.r3} Ω dazu. a) Was passiert mit dem Strom I1? b) Was passiert mit dem Ersatzwiderstand R? c) Wie gross ist der Gesamtstrom I jetzt?`,
    asks: (p) => [
      wahl('a) I1', ['I1 bleibt gleich.', 'I1 wird kleiner.', 'I1 wird grösser.', 'I1 wird null.'], [
        '',
        'In Reihe würde er kleiner. Parallel liegt an R1 weiter die volle Spannung.',
        'An R1 ändert sich nichts: gleiche Spannung, gleicher Widerstand.',
        'R1 bleibt angeschlossen. Ein neuer Zweig nimmt keinem alten den Strom weg.',
      ], p.pos),
      wahl('b) R', ['R wird kleiner.', 'R wird grösser.', 'R bleibt gleich.'], [
        '',
        'Mehr Wege für den Strom machen es leichter. R sinkt.',
        'Es fliesst mehr Strom bei gleicher Spannung. Also ist R kleiner.',
      ], p.pos2),
      { k: 'c) I', unit: 'A', v: p.u / p.r1 + p.u / p.r2 + p.u / p.r3 },
    ],
    fehler: (p) => [{ ask: 2, v: p.u / p.r1 + p.u / p.r2, msg: 'Das ist der Strom vorher. Rechne den Strom durch R3 dazu.' }],
    tipps: () => ['Parallel hat jeder Zweig die volle Spannung, unabhängig von den anderen.', 'Die alten Teilströme bleiben gleich. Neu kommt I3 = U : R3 dazu.', 'I = I1 + I2 + I3.'],
    loesung: (p) => {
      const i1 = p.u / p.r1, i2 = p.u / p.r2, i3 = p.u / p.r3;
      return [
        'a) I1 bleibt gleich. An R1 liegt weiter die volle Spannung.',
        'b) R wird kleiner, weil es einen Weg mehr für den Strom gibt.',
        `c) ${eq(ig('I') + ' = ' + fmt(i1) + ' A + ' + fmt(i2) + ' A + ' + fmt(i3) + ' A = ' + ig(fmt(i1 + i2 + i3) + ' A'))}`,
        'So ist es im Haus: Jedes neue Gerät erhöht den Strom in der Zuleitung.',
      ];
    },
  }),

  // ---------- Gleiche Bauteile, Unterbruch ----------

  task({
    id: 'p13', karte: 'gleich', stufe: 1, familie: 'rechnen', src: KREATIV,
    title: 'Gleiche Lampen parallel am Netz',
    gen: () => ({ rl: pick([529, 1058, 2645]), n: pick([3, 4, 5, 6]) }),
    draw: (p) => parallel([{ name: 'L1', typ: 'lampe', wert: `${p.rl} Ω`, i: 'I_L = ?' }, { name: 'L2', typ: 'lampe' }, { name: '…', typ: 'lampe' }, { name: 'L' + p.n, typ: 'lampe' }], { U: 'U = 230 V', I: 'I = ?' }),
    text: (p) => `${p.n} gleiche Lampen mit je R_L = ${p.rl} Ω hängen parallel an ${sp('U = 230 V')}. Berechne a) den Ersatzwiderstand R, b) den Strom durch eine Lampe I_L in mA und c) den Gesamtstrom I.`,
    asks: (p) => [
      { k: 'a) R', unit: 'Ω', v: p.rl / p.n },
      { k: 'b) I_L', unit: 'mA', v: (230 / p.rl) * 1000 },
      { k: 'c) I', unit: 'A', v: (230 / p.rl) * p.n },
    ],
    fehler: (p) => [
      { ask: 0, v: p.rl * p.n, msg: 'n · R gilt in Reihe. Bei n gleichen Widerständen parallel: R = R_L : n.' },
      { ask: 2, v: 230 / p.rl, msg: 'Das ist der Strom einer Lampe. Alle Lampen ziehen Strom: I = n · I_L.' },
    ],
    tipps: () => ['n gleiche Widerstände parallel: R = R1 : n.', 'Jede Lampe hat die volle Spannung: I_L = U : R_L.', 'I = n · I_L. Probe: I = U : R.'],
    loesung: (p) => [
      `a) ${eq('R = R_L : n = ' + p.rl + ' Ω : ' + p.n + ' = ' + fmt(p.rl / p.n) + ' Ω')}`,
      `b) ${eq(it('I_L') + ' = 230 V : ' + p.rl + ' Ω = ' + it(fmt((230 / p.rl) * 1000) + ' mA'))}`,
      `c) ${eq(ig('I') + ' = ' + p.n + ' · ' + fmt(230 / p.rl, 4) + ' A = ' + ig(fmt((230 / p.rl) * p.n) + ' A'))}`,
      `Probe: ${eq('230 V : ' + fmt(p.rl / p.n) + ' Ω = ' + fmt((230 / p.rl) * p.n) + ' A')}`,
    ],
  }),

  task({
    id: 'p14', karte: 'gleich', stufe: 1, familie: 'schaetzen', src: KREATIV + ' · Kopfrechnen',
    title: 'Kopfrechnen: gleiche Widerstände',
    gen: () => ({ r: pick([1, 2, 4, 10]), n: pick([2, 4, 5]) }),
    draw: (p) => parallel(Array.from({ length: Math.min(p.n, 4) }, (_, k) => ({ name: p.n > 4 && k === 2 ? '…' : 'R' + (p.n > 4 && k === 3 ? p.n : k + 1), wert: `${p.r} kΩ` })), { U: 'U' }),
    text: (p) => `${p.n} gleiche Widerstände mit je ${p.r} kΩ liegen parallel. Rechne im Kopf: Wie gross ist der Ersatzwiderstand in Ω?`,
    asks: (p) => [{ k: 'R', unit: 'Ω', v: (p.r * 1000) / p.n }],
    fehler: (p) => [
      { ask: 0, v: p.r * 1000 * p.n, msg: 'Das ist die Reihenschaltung. Parallel teilst du durch die Anzahl.' },
      { ask: 0, v: (p.r * 1000) / 2, msg: 'Halbieren gilt nur für zwei gleiche Widerstände. Teile durch die Anzahl.' },
    ].filter((e) => !(e.v === (p.r * 1000) / p.n)),
    tipps: () => ['Gleiche Widerstände parallel: R = R1 : n.', `1 kΩ = 1000 Ω.`, 'Beispiel: 4 × 1 kΩ parallel = 1000 Ω : 4 = 250 Ω.'],
    loesung: (p) => [
      `${eq('R = ' + p.r * 1000 + ' Ω : ' + p.n + ' = ' + fmt((p.r * 1000) / p.n) + ' Ω')}`,
      'n gleiche Wege: Der Strom wird n-mal so gross, der Widerstand n-mal so klein.',
    ],
  }),

  task({
    id: 'p15', karte: 'gleich', stufe: 1, familie: 'begruenden', src: KREATIV + ' · Begründen',
    title: 'Eine Lampe brennt durch',
    gen: () => ({ n: pick([3, 4]), il: pick([0.5, 1, 1.5]), pos: pos() }),
    draw: (p) => parallel(Array.from({ length: p.n }, (_, k) => ({ name: 'L' + (k + 1), typ: k === 1 ? ('offen' as const) : ('lampe' as const), i: k === 0 ? `I_L = ${fmt(p.il)} A` : undefined })), { U: 'U = 230 V', I: 'I = ?' }),
    text: (p) => `${p.n} gleiche Lampen hängen parallel an ${sp('U = 230 V')}. Jede zieht ${it('I_L = ' + fmt(p.il) + ' A')}. Lampe L2 brennt durch. a) Was passiert mit den anderen Lampen? b) Wie gross ist der Gesamtstrom jetzt?`,
    asks: (p) => [
      wahl('a) Andere Lampen', [
        'Sie leuchten gleich hell weiter.',
        'Alle gehen aus.',
        'Sie leuchten heller.',
        'Sie leuchten schwächer.',
      ], [
        '',
        'Das wäre in Reihe so. Parallel hat jede Lampe ihren eigenen Weg.',
        'Heller würden sie nur mit mehr Spannung. Die Spannung bleibt 230 V.',
        'Jede Lampe hat weiter die volle Spannung. Ihr Strom bleibt gleich.',
      ], p.pos),
      { k: 'b) I', unit: 'A', v: (p.n - 1) * p.il },
    ],
    fehler: (p) => [{ ask: 1, v: p.n * p.il, msg: 'Das ist der Strom vorher. Durch L2 fliesst jetzt nichts mehr.' }],
    tipps: () => ['Parallel hat jeder Zweig die volle Spannung, unabhängig von den anderen.', 'Ein offener Zweig führt keinen Strom. Die anderen merken nichts.', 'I = (n − 1) · I_L.'],
    loesung: (p) => [
      'a) Die anderen Lampen leuchten gleich hell weiter. Darum schaltet man im Haus alles parallel.',
      `b) ${eq(ig('I') + ' = ' + (p.n - 1) + ' · ' + fmt(p.il) + ' A = ' + ig(fmt((p.n - 1) * p.il) + ' A'))}`,
      'Vergleich Reihe: Dort gehen bei einem Unterbruch alle Lampen aus.',
    ],
  }),

  // ---------- Praxis: Netz, Sicherung, Kurzschluss ----------

  task({
    id: 'p16', karte: 'praxis', stufe: 2, familie: 'kette', src: KREATIV + ' · Praxis',
    title: 'Steckdosenleiste und Sicherung',
    gen: () => {
      const [rw, rf, rl, sich] = pick([[26.5, 44, 529, 16], [26.5, 44, 529, 13], [35, 53, 1058, 10], [23, 38, 529, 16], [35, 66, 529, 13]] as const);
      return { rw, rf, rl, sich };
    },
    draw: (p) => parallel([{ name: 'Wasserkocher', typ: 'heiz', wert: `${fmt(p.rw)} Ω`, i: 'I_W = ?' }, { name: 'Föhn', typ: 'heiz', wert: `${fmt(p.rf)} Ω` }, { name: 'Lampe', typ: 'lampe', wert: `${p.rl} Ω` }], { U: 'U = 230 V', I: 'I = ?' }),
    text: (p) => `An einer Steckdosenleiste (${sp('230 V')}) laufen gleichzeitig ein Wasserkocher (${fmt(p.rw)} Ω), ein Föhn (${fmt(p.rf)} Ω) und eine Lampe (${p.rl} Ω). Die Leitung ist mit ${p.sich} A abgesichert. Berechne a) den Strom des Wasserkochers I_W und b) den Gesamtstrom I. c) Löst die Sicherung aus?`,
    asks: (p) => {
      const I = 230 / p.rw + 230 / p.rf + 230 / p.rl, raus = I > p.sich;
      return [
        { k: 'a) I_W', unit: 'A', v: 230 / p.rw },
        { k: 'b) I', unit: 'A', v: I },
        {
          kind: 'choice', k: 'c) Sicherung',
          opts: [`Ja, I ist grösser als ${p.sich} A.`, `Nein, I ist kleiner als ${p.sich} A.`, 'Das hängt davon ab, welches Gerät zuerst eingesteckt wird.'],
          a: raus ? 0 : 1,
          why: [
            raus ? undefined : `Vergleiche: ${fmt(I)} A ist kleiner als ${p.sich} A.`,
            raus ? `Vergleiche: ${fmt(I)} A ist grösser als ${p.sich} A.` : undefined,
            'Die Reihenfolge spielt keine Rolle. Es zählt die Summe der Ströme, die gleichzeitig fliessen.',
          ],
        },
      ];
    },
    fehler: (p) => [
      { ask: 1, v: 230 / (p.rw + p.rf + p.rl), msg: 'Du hast die Widerstände addiert. Die Geräte sind parallel: Addiere die Ströme.' },
      { ask: 0, v: 230 * p.rw, msg: 'Du hast U mal R gerechnet. Der Strom ist I = U : R.' },
    ],
    tipps: () => ['Alle Geräte an der Leiste sind parallel. Jedes hat 230 V.', 'I_Gerät = 230 V : R_Gerät. Der Gesamtstrom ist die Summe.', 'Die Sicherung vergleicht den Gesamtstrom mit ihrem Nennstrom.'],
    loesung: (p) => {
      const iw = 230 / p.rw, ifo = 230 / p.rf, il = 230 / p.rl, I = iw + ifo + il;
      return [
        `a) ${eq(it('I_W') + ' = 230 V : ' + fmt(p.rw) + ' Ω = ' + it(fmt(iw) + ' A'))}`,
        `b) Föhn ${eq(fmt(ifo) + ' A')}, Lampe ${eq(fmt(il) + ' A')}. ${eq(ig('I') + ' = ' + fmt(iw) + ' + ' + fmt(ifo) + ' + ' + fmt(il) + ' = ' + ig(fmt(I) + ' A'))}`,
        `c) ${I > p.sich ? `${fmt(I)} A > ${p.sich} A: Die Sicherung löst aus.` : `${fmt(I)} A < ${p.sich} A: Die Sicherung hält.`}`,
        'Warnung: Stecke keine Steckdosenleisten hintereinander. Folge: Die Zuleitung wird überlastet und kann einen Brand auslösen.',
      ];
    },
  }),

  task({
    id: 'p17', karte: 'praxis', stufe: 2, familie: 'begruenden', src: KREATIV + ' · Begründen',
    title: 'Kurzschluss: ein Draht parallel zur Lampe',
    gen: () => ({ rl: pick([24, 36, 48]), rd: pick([0.02, 0.05, 0.1]), u: 12, pos: pos() }),
    draw: (p) => parallel([{ name: 'Lampe', typ: 'lampe', wert: `${p.rl} Ω` }, { name: `Draht ${fmt(p.rd)} Ω`, typ: 'draht' }], { U: `U = ${p.u} V`, I: 'I = ?' }),
    text: (p) => `Eine Lampe (${p.rl} Ω) hängt an einer Autobatterie mit ${sp('U = ' + p.u + ' V')}. Ein Draht mit ${fmt(p.rd)} Ω fällt so, dass er parallel zur Lampe liegt. a) Was passiert? b) Wie gross ist der Ersatzwiderstand R? c) Welcher Strom würde fliessen? (Innenwiderstand der Batterie vernachlässigt.)`,
    asks: (p) => {
      const R = par(p.rl, p.rd);
      return [
        wahl('a) Folge', [
          'Fast der ganze Strom fliesst durch den Draht. Der Strom wird riesig, die Lampe geht fast aus.',
          'Die Lampe leuchtet heller, weil sie mehr Strom bekommt.',
          'Nichts, der Draht hat ja kaum Widerstand.',
          'Die Lampe bekommt die doppelte Spannung.',
        ], [
          '',
          'Der Draht nimmt der Lampe den Strom weg. Die Spannung an der Lampe bricht in der Praxis zusammen.',
          'Gerade weil der Draht kaum Widerstand hat, fliesst ein riesiger Strom: I = U : R.',
          'Parallel ist die Spannung an beiden Zweigen gleich. Sie wird nicht grösser.',
        ], p.pos),
        { k: 'b) R', unit: 'Ω', v: R },
        { k: 'c) I', unit: 'A', v: p.u / R },
      ];
    },
    fehler: (p) => [
      { ask: 1, v: p.rl + p.rd, msg: 'Das ist die Reihenschaltung. Parallel ist R kleiner als der kleinste Widerstand, also kleiner als der Draht.' },
      { ask: 2, v: p.u / p.rl, msg: 'Das ist nur der Strom durch die Lampe. Der Draht führt fast den ganzen Strom.' },
    ],
    tipps: () => ['Parallel ist R kleiner als der kleinste Widerstand. Hier ist das der Draht.', 'R = R_L · R_D : (R_L + R_D). Das ist fast genau R_D.', 'I = U : R. Das ist ein Kurzschluss.'],
    loesung: (p) => {
      const R = par(p.rl, p.rd);
      return [
        'a) Der Draht ist ein Kurzschluss. Fast der ganze Strom fliesst durch ihn.',
        `b) ${eq('R = ' + p.rl + ' · ' + fmt(p.rd) + ' : (' + p.rl + ' + ' + fmt(p.rd) + ') = ' + fmt(R, 4) + ' Ω')}. Das ist fast genau der Drahtwiderstand.`,
        `c) ${eq(ig('I') + ' = ' + p.u + ' V : ' + fmt(R, 4) + ' Ω = ' + ig(fmt(p.u / R) + ' A'))}. In Wirklichkeit begrenzt der Innenwiderstand der Batterie den Strom etwas.`,
        'Warnung: Lege nie einen Draht oder ein Werkzeug über die Pole einer Batterie. Folge: Der Draht glüht, es gibt Funken und Brandgefahr, eine Autobatterie kann explodieren.',
      ];
    },
  }),

  task({
    id: 'p18', karte: 'praxis', stufe: 3, familie: 'kette', src: KREATIV + ' · Praxis',
    title: 'Heizlüfter mit drei Stufen',
    gen: () => {
      const [r1, r2] = pick([[46, 92], [53, 106], [40, 60], [46, 69], [92, 46]] as const);
      return { r1, r2 };
    },
    draw: (p) => parallel([{ name: 'Heizdraht 1', typ: 'heiz', wert: `R1 = ${p.r1} Ω`, i: 'I1' }, { name: 'Heizdraht 2', typ: 'heiz', wert: `R2 = ${p.r2} Ω`, i: 'I2' }], { U: 'U = 230 V', I: 'I' }),
    text: (p) => `Ein Heizlüfter hat zwei Heizdrähte: R1 = ${p.r1} Ω und R2 = ${p.r2} Ω. Mit zwei Schaltern wählt man: Stufe 1 = nur R1, Stufe 2 = nur R2, Stufe 3 = beide parallel. Berechne an ${sp('230 V')} den Strom a) in Stufe 1, b) in Stufe 2, c) in Stufe 3 und d) den Ersatzwiderstand in Stufe 3.`,
    asks: (p) => [
      { k: 'a) I Stufe 1', unit: 'A', v: 230 / p.r1 },
      { k: 'b) I Stufe 2', unit: 'A', v: 230 / p.r2 },
      { k: 'c) I Stufe 3', unit: 'A', v: 230 / p.r1 + 230 / p.r2 },
      { k: 'd) R Stufe 3', unit: 'Ω', v: par(p.r1, p.r2) },
    ],
    fehler: (p) => {
      const i1 = 230 / p.r1, i2 = 230 / p.r2;
      return [
        { ask: 2, v: (i1 * i2) / (i1 + i2), msg: '«Produkt durch Summe» gilt für Widerstände, nicht für Ströme. Ströme addierst du: I = I1 + I2.' },
        { ask: 2, v: 230 / (p.r1 + p.r2), msg: 'Du hast die Drähte in Reihe gerechnet. In Stufe 3 sind sie parallel.' },
        { ask: 3, v: p.r1 + p.r2, msg: 'Das ist die Reihenschaltung. Parallel: R = R1 · R2 : (R1 + R2).' },
      ];
    },
    tipps: () => ['In jeder Stufe hat jeder eingeschaltete Draht die volle Spannung 230 V.', 'Stufe 1 und 2: I = 230 V : R. Stufe 3: Teilströme addieren.', 'R in Stufe 3 = 230 V : I oder R1 · R2 : (R1 + R2).'],
    loesung: (p) => {
      const i1 = 230 / p.r1, i2 = 230 / p.r2;
      return [
        `a) ${eq(it('I1') + ' = 230 V : ' + p.r1 + ' Ω = ' + it(fmt(i1) + ' A'))}`,
        `b) ${eq(it('I2') + ' = 230 V : ' + p.r2 + ' Ω = ' + it(fmt(i2) + ' A'))}`,
        `c) ${eq(ig('I') + ' = ' + fmt(i1) + ' A + ' + fmt(i2) + ' A = ' + ig(fmt(i1 + i2) + ' A'))}`,
        `d) ${eq('R = ' + p.r1 + ' · ' + p.r2 + ' : (' + p.r1 + ' + ' + p.r2 + ') = ' + fmt(par(p.r1, p.r2)) + ' Ω')}`,
        'Stufe 3 heizt am stärksten, weil am meisten Strom fliesst.',
      ];
    },
  }),
];
