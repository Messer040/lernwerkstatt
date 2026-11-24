// Aufgaben zum Kapitel Reihenschaltung (Buch 3.7.1, Aufgaben 1–15, Aufgabe 7 steht im Kapitel Masche).
// Farben im Text: Gesamtspannung blau (l), Teilspannung magenta (f), Strom grün (m).
import { task, type Task } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import { reihe } from './bilder';

const ug = l; // Gesamtspannung
const ut = f; // Teilspannung
const st = m; // Strom

/** Beim ersten Aufruf die Buchwerte, danach Zufallswerte. */
function buch<P>(b: P, zufall: () => P): () => P {
  let erst = true;
  return () => {
    if (erst) {
      erst = false;
      return b;
    }
    return zufall();
  };
}
const d3 = (x: number) => fmt(x, 3);
const BUCH = 'Buch 3.7.1';

export const AUFGABEN: Task[] = [
  // ---------- Ersatzwiderstand und Strom ----------

  task({
    id: 'r1', karte: 'ersatz', stufe: 1, familie: 'rechnen', src: BUCH + ', Beispiel 1',
    title: 'Drei Widerstände an 24 V',
    gen: buch({ r1: 470, r2: 1200, r3: 1500, u: 24 }, () => ({ r1: pick([220, 330, 470, 680]), r2: pick([1000, 1200, 1500]), r3: pick([1500, 1800, 2200]), u: pick([12, 24]) })),
    draw: (p) => reihe([{ name: 'R1', wert: `${p.r1} Ω`, u: 'U1 = ?' }, { name: 'R2', wert: `${p.r2} Ω`, u: 'U2 = ?' }, { name: 'R3', wert: `${p.r3} Ω`, u: 'U3 = ?' }], { U: `U = ${p.u} V`, I: 'I = ?' }),
    text: (p) => `Die Widerstände R1 = ${p.r1} Ω, R2 = ${p.r2} Ω und R3 = ${p.r3} Ω liegen in Reihe an ${ug('U = ' + p.u + ' V')}. Berechne a) den Ersatzwiderstand R, b) den Strom I in mA und c) die Teilspannung U3.`,
    asks: (p) => {
      const R = p.r1 + p.r2 + p.r3;
      return [
        { k: 'a) R', unit: 'Ω', v: R },
        { k: 'b) I', unit: 'mA', v: (p.u / R) * 1000 },
        { k: 'c) U3', unit: 'V', v: (p.r3 * p.u) / R },
      ];
    },
    fehler: (p) => {
      return [
        { ask: 0, v: 1 / (1 / p.r1 + 1 / p.r2 + 1 / p.r3), msg: 'Das ist die Formel der Parallelschaltung. In Reihe addierst du: R = R1 + R2 + R3.' },
        { ask: 1, v: (p.u / p.r1) * 1000, msg: 'Du hast nur mit R1 gerechnet. Der Strom fliesst durch alle Widerstände: I = U : R.' },
        { ask: 2, v: p.u / 3, msg: 'Du hast U durch 3 geteilt. Das stimmt nur bei gleichen Widerständen. Rechne U3 = R3 · I.' },
      ];
    },
    tipps: () => ['In Reihe addierst du die Widerstände. Der Strom ist überall gleich.', 'R = R1 + R2 + R3, dann I = U : R.', 'U3 = R3 · I. Rechne mit I in A.'],
    loesung: (p) => {
      const R = p.r1 + p.r2 + p.r3, I = p.u / R;
      return [
        `a) ${eq('R = ' + p.r1 + ' Ω + ' + p.r2 + ' Ω + ' + p.r3 + ' Ω = ' + fmt(R) + ' Ω')}`,
        `b) ${eq(st('I') + ' = ' + ug('U') + ' : R = ' + p.u + ' V : ' + fmt(R) + ' Ω = ' + fmt(I, 5) + ' A = ' + st(fmt(I * 1000) + ' mA'))}`,
        `c) ${eq(ut('U3') + ' = R3 · ' + st('I') + ' = ' + p.r3 + ' Ω · ' + fmt(I, 5) + ' A = ' + ut(fmt(p.r3 * I) + ' V'))}`,
        `Probe: ${eq(ut('U1') + ' + ' + ut('U2') + ' + ' + ut('U3') + ' = ' + fmt(p.r1 * I) + ' + ' + fmt(p.r2 * I) + ' + ' + fmt(p.r3 * I) + ' = ' + ug(fmt(p.u) + ' V'))}`,
      ];
    },
  }),

  task({
    id: 'r2', karte: 'ersatz', stufe: 1, familie: 'rechnen', src: BUCH + ', Nr. 1',
    title: 'Zwei Widerstände an 220 V',
    gen: buch({ r1: 25, r2: 35, u: 220 }, () => ({ r1: rng(10, 40, 5), r2: rng(45, 90, 5), u: pick([24, 110, 230]) })),
    draw: (p) => reihe([{ name: 'R1', wert: `${p.r1} Ω`, u: 'U1 = ?' }, { name: 'R2', wert: `${p.r2} Ω`, u: 'U2 = ?' }], { U: `U = ${p.u} V`, I: 'I = ?' }),
    text: (p) => `Die Widerstände R1 = ${p.r1} Ω und R2 = ${p.r2} Ω liegen in Reihe an ${ug('U = ' + p.u + ' V')}. Berechne a) den Ersatzwiderstand R, b) die Stromstärke I und c) die Teilspannungen U1 und U2.`,
    asks: (p) => {
      const R = p.r1 + p.r2, I = p.u / R;
      return [
        { k: 'a) R', unit: 'Ω', v: R },
        { k: 'b) I', unit: 'A', v: I },
        { k: 'c) U1', unit: 'V', v: p.r1 * I },
        { k: 'c) U2', unit: 'V', v: p.r2 * I },
      ];
    },
    fehler: (p) => [
      { ask: 1, v: p.u * (p.r1 + p.r2), msg: 'Du hast U mal R gerechnet. Der Strom ist I = U : R.' },
      { ask: 2, v: p.u / 2, msg: 'Die Spannung teilt sich nicht halb-halb. Sie teilt sich im Verhältnis der Widerstände: U1 = R1 · I.' },
    ],
    tipps: () => ['R = R1 + R2. Der Strom ist überall gleich gross.', 'I = U : R', 'U1 = R1 · I und U2 = R2 · I. Probe: U1 + U2 = U.'],
    loesung: (p) => {
      const R = p.r1 + p.r2, I = p.u / R;
      return [
        `a) ${eq('R = ' + p.r1 + ' Ω + ' + p.r2 + ' Ω = ' + R + ' Ω')}`,
        `b) ${eq(st('I') + ' = ' + p.u + ' V : ' + R + ' Ω = ' + st(fmt(I) + ' A'))}`,
        `c) ${eq(ut('U1') + ' = ' + p.r1 + ' Ω · ' + fmt(I, 4) + ' A = ' + ut(fmt(p.r1 * I) + ' V'))}, ${eq(ut('U2') + ' = ' + p.r2 + ' Ω · ' + fmt(I, 4) + ' A = ' + ut(fmt(p.r2 * I) + ' V'))}`,
        `Probe: ${eq(fmt(p.r1 * I) + ' V + ' + fmt(p.r2 * I) + ' V = ' + p.u + ' V')}`,
      ];
    },
  }),

  task({
    id: 'r3', karte: 'ersatz', stufe: 2, familie: 'rechnen', src: BUCH + ', Nr. 2',
    title: 'Widerstände in kΩ an 9 V',
    gen: buch({ r1: 1.5, r2: 2.2, r3: 6.8, u: 9 }, () => ({ r1: pick([1, 1.5, 2.2]), r2: pick([2.2, 3.3, 4.7]), r3: pick([4.7, 6.8, 10]), u: pick([5, 9, 12]) })),
    draw: (p) => reihe([{ name: 'R1', wert: `${fmt(p.r1)} kΩ`, u: 'U1' }, { name: 'R2', wert: `${fmt(p.r2)} kΩ`, u: 'U2' }, { name: 'R3', wert: `${fmt(p.r3)} kΩ`, u: 'U3 = ?' }], { U: `U = ${p.u} V`, I: 'I = ?' }),
    text: (p) => `Die Widerstände R1 = ${fmt(p.r1)} kΩ, R2 = ${fmt(p.r2)} kΩ und R3 = ${fmt(p.r3)} kΩ liegen in Reihe an ${ug('U = ' + p.u + ' V')}. Berechne a) den Ersatzwiderstand R in kΩ, b) die Stromstärke I in mA und c) die Teilspannung U3.`,
    asks: (p) => {
      const R = p.r1 + p.r2 + p.r3;
      return [
        { k: 'a) R', unit: 'kΩ', v: R },
        { k: 'b) I', unit: 'mA', v: p.u / R },
        { k: 'c) U3', unit: 'V', v: (p.u * p.r3) / R },
      ];
    },
    fehler: (p) => [
      { ask: 2, v: p.u * p.r3, msg: 'Du hast U mal R3 gerechnet. Die Teilspannung ist U3 = R3 · I.' },
    ],
    tipps: () => ['Bleib bei kΩ und mA. Es gilt: V : kΩ = mA.', 'R = R1 + R2 + R3, I = U : R', 'U3 = R3 · I. Auch hier gilt: kΩ · mA = V.'],
    loesung: (p) => {
      const R = p.r1 + p.r2 + p.r3, I = p.u / R;
      return [
        `a) ${eq('R = ' + fmt(p.r1) + ' + ' + fmt(p.r2) + ' + ' + fmt(p.r3) + ' = ' + fmt(R) + ' kΩ')}`,
        `b) ${eq(st('I') + ' = ' + p.u + ' V : ' + fmt(R) + ' kΩ = ' + st(d3(I) + ' mA'))}`,
        `c) ${eq(ut('U3') + ' = ' + fmt(p.r3) + ' kΩ · ' + d3(I) + ' mA = ' + ut(fmt(p.r3 * I) + ' V'))}`,
        'Trick: Mit kΩ und mA brauchst du keine Zehnerpotenzen.',
      ];
    },
  }),

  task({
    id: 'r4', karte: 'teil', stufe: 2, familie: 'bild', src: BUCH + ', Nr. 3',
    title: 'Eine Teilspannung ist bekannt',
    gen: buch({ r1: 50, r2: 150, r3: 200, u2: 75 }, () => ({ r1: rng(20, 100, 10), r2: rng(100, 200, 10), r3: rng(100, 300, 10), u2: pick([30, 45, 60, 75]) })),
    draw: (p) => reihe([{ name: 'R1', wert: `${p.r1} Ω`, u: 'U1' }, { name: 'R2', wert: `${p.r2} Ω`, u: `U2 = ${p.u2} V` }, { name: 'R3', wert: `${p.r3} Ω`, u: 'U3' }], { U: 'U = ?', I: 'I' }),
    text: (p) => `Drei Widerstände sind nach dem Bild geschaltet: R1 = ${p.r1} Ω, R2 = ${p.r2} Ω, R3 = ${p.r3} Ω. An R2 misst man ${ut('U2 = ' + p.u2 + ' V')}. Berechne a) die Stromstärke I in mA, b) die Teilspannungen U1 und U3, c) die Gesamtspannung U und d) den Ersatzwiderstand R.`,
    asks: (p) => {
      const I = p.u2 / p.r2;
      return [
        { k: 'a) I', unit: 'mA', v: I * 1000 },
        { k: 'b) U1', unit: 'V', v: p.r1 * I },
        { k: 'b) U3', unit: 'V', v: p.r3 * I },
        { k: 'c) U', unit: 'V', v: (p.r1 + p.r2 + p.r3) * I },
        { k: 'd) R', unit: 'Ω', v: p.r1 + p.r2 + p.r3 },
      ];
    },
    fehler: (p) => [{ ask: 0, v: (p.u2 / (p.r1 + p.r2 + p.r3)) * 1000, msg: 'U2 liegt nur an R2. Darum gilt I = U2 : R2, nicht durch den Ersatzwiderstand.' }],
    tipps: () => ['Von R2 kennst du Spannung und Widerstand. Daraus folgt der Strom.', 'I = U2 : R2. Dieser Strom fliesst durch alle Widerstände.', 'U1 = R1 · I, U3 = R3 · I, U = U1 + U2 + U3, R = R1 + R2 + R3.'],
    loesung: (p) => {
      const I = p.u2 / p.r2, R = p.r1 + p.r2 + p.r3;
      return [
        `a) ${eq(st('I') + ' = ' + ut('U2') + ' : R2 = ' + p.u2 + ' V : ' + p.r2 + ' Ω = ' + st(fmt(I * 1000) + ' mA'))}`,
        `b) ${eq(ut('U1') + ' = ' + p.r1 + ' Ω · ' + fmt(I, 3) + ' A = ' + ut(fmt(p.r1 * I) + ' V'))}, ${eq(ut('U3') + ' = ' + p.r3 + ' Ω · ' + fmt(I, 3) + ' A = ' + ut(fmt(p.r3 * I) + ' V'))}`,
        `c) ${eq(ug('U') + ' = ' + fmt(p.r1 * I) + ' + ' + p.u2 + ' + ' + fmt(p.r3 * I) + ' = ' + ug(fmt(R * I) + ' V'))}`,
        `d) ${eq('R = ' + p.r1 + ' + ' + p.r2 + ' + ' + p.r3 + ' = ' + R + ' Ω')}. Probe: ${eq(fmt(R * I) + ' V : ' + R + ' Ω = ' + fmt(I, 3) + ' A')}`,
      ];
    },
  }),

  task({
    id: 'r5', karte: 'fehler', stufe: 1, familie: 'fehler', src: 'Kreativ · Fehler finden',
    title: 'Fehler finden: Ersatzwiderstand mit falscher Einheit',
    gen: () => ({ r1: rng(20, 100, 10), r2: rng(100, 200, 10), r3: rng(100, 300, 10) }),
    draw: (p) => reihe([{ name: 'R1', wert: `${p.r1} Ω` }, { name: 'R2', wert: `${p.r2} Ω` }, { name: 'R3', wert: `${p.r3} Ω` }], { U: 'U', I: 'I' }),
    text: (p) => `Lena schreibt zur Schaltung mit R1 = ${p.r1} Ω, R2 = ${p.r2} Ω und R3 = ${p.r3} Ω: «R = ${p.r1 + p.r2 + p.r3} V». a) Was ist falsch? b) Wie gross ist R richtig?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: ['Die Zahl stimmt, aber die Einheit ist falsch. Ein Widerstand hat die Einheit Ω.', 'Sie hätte die Widerstände multiplizieren müssen.', 'Sie hätte durch 3 teilen müssen.', 'Nichts, V und Ω sind dasselbe.'],
        a: 0,
        why: [undefined, 'In Reihe addierst du die Widerstände. Die Zahl stimmt.', 'Das wäre ein Mittelwert. In Reihe addierst du.', 'V ist die Einheit der Spannung, Ω die Einheit des Widerstands. 1 Ω = 1 V : 1 A.'],
      },
      { k: 'b) R', unit: 'Ω', v: p.r1 + p.r2 + p.r3 },
    ],
    fehler: (p) => [{ ask: 1, v: (p.r1 + p.r2 + p.r3) / 3, msg: 'Das ist der Mittelwert. In Reihe addierst du alle Widerstände.' }],
    tipps: () => ['Schau auf die Einheit. Was misst man in V, was in Ω?', 'R = R1 + R2 + R3. Einheit Ω.', 'U in V, I in A, R in Ω.'],
    loesung: (p) => [
      `Die Zahl stimmt: ${eq('R = ' + p.r1 + ' + ' + p.r2 + ' + ' + p.r3 + ' = ' + (p.r1 + p.r2 + p.r3) + ' Ω')}`,
      'Die Einheit ist falsch. V gehört zur Spannung, Ω zum Widerstand.',
      'In der Prüfung gibt eine falsche Einheit Abzug. Schreib die Einheit bei jedem Resultat dazu.',
    ],
  }),

  // ---------- Teilspannungen ----------

  task({
    id: 'r6', karte: 'teil', stufe: 2, familie: 'umgekehrt', src: BUCH + ', Nr. 4',
    title: 'Zweiten Widerstand rückwärts finden',
    gen: buch({ R: 140, i: 2, r1: 50 }, () => ({ R: rng(100, 300, 10), i: pick([0.5, 1.5, 2, 2.5]), r1: rng(20, 80, 10) })),
    draw: (p) => reihe([{ name: 'R1', wert: `${p.r1} Ω`, u: 'U1' }, { name: 'R2', wert: 'R2 = ?', u: 'U2' }], { U: 'U = ?', I: `I = ${fmt(p.i)} A` }),
    text: (p) => `Eine Reihenschaltung aus 2 Widerständen hat den Ersatzwiderstand R = ${p.R} Ω. Es fliesst ${st('I = ' + fmt(p.i) + ' A')}. R1 hat ${p.r1} Ω. Berechne a) den Widerstand R2, b) die Teilspannungen U1 und U2 und c) die Gesamtspannung U.`,
    asks: (p) => [
      { k: 'a) R2', unit: 'Ω', v: p.R - p.r1 },
      { k: 'b) U1', unit: 'V', v: p.r1 * p.i },
      { k: 'b) U2', unit: 'V', v: (p.R - p.r1) * p.i },
      { k: 'c) U', unit: 'V', v: p.R * p.i },
    ],
    fehler: (p) => [
      { ask: 0, v: p.R + p.r1, msg: 'Du hast addiert. R1 ist schon im Ersatzwiderstand enthalten: R2 = R − R1.' },
      { ask: 3, v: p.R / p.i, msg: 'Du hast R durch I geteilt. Die Spannung ist U = R · I.' },
    ],
    tipps: () => ['Aus R = R1 + R2 folgt R2 = R − R1.', 'U1 = R1 · I, U2 = R2 · I', 'U = R · I. Probe: U1 + U2 = U.'],
    loesung: (p) => [
      `a) ${eq('R2 = R − R1 = ' + p.R + ' Ω − ' + p.r1 + ' Ω = ' + (p.R - p.r1) + ' Ω')}`,
      `b) ${eq(ut('U1') + ' = ' + p.r1 + ' Ω · ' + fmt(p.i) + ' A = ' + ut(fmt(p.r1 * p.i) + ' V'))}, ${eq(ut('U2') + ' = ' + (p.R - p.r1) + ' Ω · ' + fmt(p.i) + ' A = ' + ut(fmt((p.R - p.r1) * p.i) + ' V'))}`,
      `c) ${eq(ug('U') + ' = R · ' + st('I') + ' = ' + p.R + ' Ω · ' + fmt(p.i) + ' A = ' + ug(fmt(p.R * p.i) + ' V'))}`,
    ],
  }),

  task({
    id: 'r7', karte: 'teil', stufe: 2, familie: 'umgekehrt', src: BUCH + ', Nr. 5',
    title: 'Fehlende Werte im Schaltbild',
    gen: buch({ i: 0.1, u1: 10, u: 24, r3: 56 }, () => ({ i: pick([0.05, 0.1, 0.2]), u1: pick([4, 6, 8, 10]), u: pick([24, 30, 36]), r3: pick([22, 33, 47, 56]) })),
    draw: (p) => reihe([{ name: 'R1', wert: 'R1 = ?', u: `U1 = ${p.u1} V` }, { name: 'R2', wert: 'R2 = ?', u: 'U2 = ?' }, { name: 'R3', wert: `${p.r3} Ω`, u: 'U3 = ?' }], { U: `U = ${p.u} V`, I: `I = ${fmt(p.i)} A` }),
    text: (p) => `Drei Widerstände sind nach dem Bild geschaltet. Bekannt: ${st('I = ' + fmt(p.i) + ' A')}, ${ut('U1 = ' + p.u1 + ' V')}, ${ug('U = ' + p.u + ' V')} und R3 = ${p.r3} Ω. Berechne R1, U3, U2, den Ersatzwiderstand R und R2.`,
    asks: (p) => {
      const u3 = p.r3 * p.i, u2 = p.u - p.u1 - u3;
      return [
        { k: 'R1', unit: 'Ω', v: p.u1 / p.i },
        { k: 'U3', unit: 'V', v: u3 },
        { k: 'U2', unit: 'V', v: u2 },
        { k: 'R', unit: 'Ω', v: p.u / p.i },
        { k: 'R2', unit: 'Ω', v: u2 / p.i },
      ];
    },
    fehler: (p) => [
      { ask: 0, v: p.u1 * p.i, msg: 'Du hast U mal I gerechnet. Der Widerstand ist R = U : I.' },
      { ask: 2, v: p.u - p.u1, msg: 'Du hast U3 vergessen. Es gilt U2 = U − U1 − U3.' },
    ],
    tipps: () => ['Der Strom ist überall gleich. Damit kannst du jedes Bauteil einzeln rechnen.', 'R1 = U1 : I, U3 = R3 · I, U2 = U − U1 − U3.', 'R = U : I und R2 = U2 : I. Probe: R1 + R2 + R3 = R.'],
    loesung: (p) => {
      const u3 = p.r3 * p.i, u2 = p.u - p.u1 - u3;
      return [
        `${eq('R1 = ' + ut('U1') + ' : ' + st('I') + ' = ' + p.u1 + ' V : ' + fmt(p.i) + ' A = ' + fmt(p.u1 / p.i) + ' Ω')}`,
        `${eq(ut('U3') + ' = R3 · ' + st('I') + ' = ' + p.r3 + ' Ω · ' + fmt(p.i) + ' A = ' + ut(fmt(u3) + ' V'))}`,
        `${eq(ut('U2') + ' = ' + ug('U') + ' − ' + ut('U1') + ' − ' + ut('U3') + ' = ' + p.u + ' − ' + p.u1 + ' − ' + fmt(u3) + ' = ' + ut(fmt(u2) + ' V'))}`,
        `${eq('R = ' + p.u + ' V : ' + fmt(p.i) + ' A = ' + fmt(p.u / p.i) + ' Ω')}, ${eq('R2 = ' + fmt(u2) + ' V : ' + fmt(p.i) + ' A = ' + fmt(u2 / p.i) + ' Ω')}`,
      ];
    },
  }),

  task({
    id: 'r8', karte: 'teil', stufe: 3, familie: 'rechnen', src: BUCH + ', Nr. 12',
    title: 'Vier Widerstände: messbare Teilspannungen',
    gen: buch({ r: [1.2, 2.2, 3.9, 4.7], u: 24 }, () => ({ r: [pick([1, 1.2, 1.5]), pick([2.2, 2.7]), pick([3.3, 3.9]), pick([4.7, 5.6])], u: pick([12, 24]) })),
    draw: (p) => reihe(p.r.map((r: number, i: number) => ({ name: 'R' + (i + 1), wert: `${fmt(r)} kΩ`, u: 'U' + (i + 1) })), { U: `U = ${p.u} V`, I: 'I' }),
    text: (p) => `Vier Widerstände (${p.r.map((r: number) => fmt(r) + ' kΩ').join(', ')}) liegen in Reihe an ${ug('U = ' + p.u + ' V')}. Man kann 10 verschiedene Teilspannungen messen: über einen, zwei, drei oder alle vier Widerstände nebeneinander. Berechne a) den Strom I in mA, b) U2, c) die Spannung über R2 und R3 zusammen (U23) und d) die Spannung über R1, R2 und R3 (U123).`,
    asks: (p) => {
      const R = p.r.reduce((a: number, b: number) => a + b, 0), I = p.u / R;
      return [
        { k: 'a) I', unit: 'mA', v: I },
        { k: 'b) U2', unit: 'V', v: p.r[1] * I },
        { k: 'c) U23', unit: 'V', v: (p.r[1] + p.r[2]) * I },
        { k: 'd) U123', unit: 'V', v: (p.r[0] + p.r[1] + p.r[2]) * I },
      ];
    },
    fehler: (p) => {
      const R = p.r.reduce((a: number, b: number) => a + b, 0), I = p.u / R;
      return [{ ask: 3, v: p.u - p.r[0] * I, msg: 'Du hast U1 abgezogen. Über R1, R2 und R3 liegt U − U4.' }];
    },
    tipps: () => ['Mehrere Widerstände nebeneinander wirken wie einer: Werte addieren.', 'I = U : (R1 + R2 + R3 + R4). Rechne mit kΩ und mA.', 'U23 = (R2 + R3) · I. Kurzweg für U123: U − U4.'],
    loesung: (p) => {
      const R = p.r.reduce((a: number, b: number) => a + b, 0), I = p.u / R;
      return [
        `a) ${eq('R = ' + fmt(R) + ' kΩ')}, ${eq(st('I') + ' = ' + p.u + ' V : ' + fmt(R) + ' kΩ = ' + st(d3(I) + ' mA'))}`,
        `b) ${eq(ut('U2') + ' = ' + fmt(p.r[1]) + ' kΩ · ' + d3(I) + ' mA = ' + ut(fmt(p.r[1] * I) + ' V'))}`,
        `c) ${eq(ut('U23') + ' = (' + fmt(p.r[1]) + ' + ' + fmt(p.r[2]) + ') kΩ · ' + d3(I) + ' mA = ' + ut(fmt((p.r[1] + p.r[2]) * I) + ' V'))}`,
        `d) ${eq(ut('U123') + ' = ' + ug('U') + ' − ' + ut('U4') + ' = ' + p.u + ' − ' + fmt(p.r[3] * I) + ' = ' + ut(fmt((p.r[0] + p.r[1] + p.r[2]) * I) + ' V'))}`,
        'Die 10 Spannungen: U1, U2, U3, U4, U12, U23, U34, U123, U234 und U1234 = U.',
      ];
    },
  }),

  task({
    id: 'r9', karte: 'teil', stufe: 3, familie: 'kette', src: BUCH + ', Nr. 13',
    title: 'Teilspannungen im Verhältnis',
    gen: buch({ r2: 180, u3: 16 }, () => ({ r2: pick([120, 150, 180, 240]), u3: pick([9, 18, 27]) })),
    draw: (p) => reihe([{ name: 'R1', u: 'U1' }, { name: 'R2', wert: `${p.r2} Ω`, u: 'U2' }, { name: 'R3', u: `U3 = ${p.u3} V` }, { name: 'R4', u: 'U4' }], { U: 'U = ?', I: 'I = ?' }),
    text: (p) => `Vier Widerstände liegen in Reihe. Die Teilspannungen verhalten sich wie U1 : U2 : U3 : U4 = 1 : 1,5 : 2,25 : 3,75. Bekannt sind R2 = ${p.r2} Ω und ${ut('U3 = ' + p.u3 + ' V')}. Berechne a) U1, b) die Gesamtspannung U, c) die Stromstärke I in mA, d) R1 und e) den Gesamtwiderstand R.`,
    asks: (p) => {
      const k = p.u3 / 2.25, I = (1.5 * k) / p.r2;
      return [
        { k: 'a) U1', unit: 'V', v: k },
        { k: 'b) U', unit: 'V', v: 8.5 * k },
        { k: 'c) I', unit: 'mA', v: I * 1000 },
        { k: 'd) R1', unit: 'Ω', v: k / I },
        { k: 'e) R', unit: 'Ω', v: (8.5 * k) / I },
      ];
    },
    fehler: (p) => {
      const k = p.u3 / 2.25;
      return [
        { ask: 0, v: p.u3 / 3, msg: 'U3 hat den Anteil 2,25, nicht 3. Ein Teil ist U3 : 2,25.' },
        { ask: 2, v: (p.u3 / p.r2) * 1000, msg: 'U3 liegt an R3, nicht an R2. Für R2 brauchst du U2 = 1,5 · U3 : 2,25.' },
        { ask: 1, v: 4 * k, msg: 'Du hast die Anteile gezählt statt addiert. Die Summe ist 1 + 1,5 + 2,25 + 3,75 = 8,5.' },
      ];
    },
    tipps: () => ['Ein Anteil «1» entspricht U1. Aus U3 = 2,25 Anteile folgt ein Anteil.', 'U1 = U3 : 2,25. U2 = 1,5 · U1. U = 8,5 · U1.', 'I = U2 : R2. Dann R1 = U1 : I und R = U : I. Die Widerstände stehen im selben Verhältnis wie die Spannungen.'],
    loesung: (p) => {
      const k = p.u3 / 2.25, I = (1.5 * k) / p.r2;
      return [
        `Ein Anteil: ${eq(ut('U1') + ' = ' + p.u3 + ' V : 2,25 = ' + ut(fmt(k) + ' V'))}`,
        `${eq(ut('U2') + ' = 1,5 · ' + fmt(k) + ' = ' + fmt(1.5 * k) + ' V')}, ${eq(ut('U4') + ' = 3,75 · ' + fmt(k) + ' = ' + fmt(3.75 * k) + ' V')}`,
        `${eq(ug('U') + ' = 8,5 · ' + fmt(k) + ' V = ' + ug(fmt(8.5 * k) + ' V'))}`,
        `${eq(st('I') + ' = ' + ut('U2') + ' : R2 = ' + fmt(1.5 * k) + ' V : ' + p.r2 + ' Ω = ' + st(fmt(I * 1000) + ' mA'))}`,
        `${eq('R1 = ' + fmt(k) + ' V : ' + fmt(I, 4) + ' A = ' + fmt(k / I) + ' Ω')}, ${eq('R = ' + fmt(8.5 * k) + ' V : ' + fmt(I, 4) + ' A = ' + fmt((8.5 * k) / I) + ' Ω')}`,
      ];
    },
  }),

  task({
    id: 'r10', karte: 'teil', stufe: 1, familie: 'schaetzen', src: 'Kreativ · Abschätzen, ohne Taschenrechner',
    title: 'Wer bekommt die grössere Spannung?',
    gen: () => ({ r1: pick([1, 2]), f: pick([2, 3, 4]), u: pick([12, 24]) }),
    draw: (p) => reihe([{ name: 'R1', wert: `${p.r1} kΩ`, u: 'U1' }, { name: 'R2', wert: `${p.r1 * p.f} kΩ`, u: 'U2 = ?' }], { U: `U = ${p.u} V` }),
    text: (p) => `Ohne Taschenrechner: R1 = ${p.r1} kΩ und R2 = ${p.r1 * p.f} kΩ liegen in Reihe an ${ug('U = ' + p.u + ' V')}. Wie gross ist U2?`,
    asks: (p) => [{ k: 'U2', unit: 'V', v: (p.u * p.f) / (p.f + 1) }],
    fehler: (p) => [
      { ask: 0, v: p.u / (p.f + 1), msg: 'Das ist U1. Am grösseren Widerstand liegt die grössere Spannung.' },
      { ask: 0, v: p.u / 2, msg: 'Halb-halb gilt nur bei gleichen Widerständen.' },
    ],
    tipps: () => ['Die Spannung teilt sich im Verhältnis der Widerstände.', `R2 ist ein Vielfaches von R1. Zähle die Teile: R1 = 1 Teil, R2 = mehrere Teile.`, 'U2 = U · R2 : (R1 + R2)'],
    loesung: (p) => [
      `Teile: R1 = 1 Teil, R2 = ${p.f} Teile, zusammen ${p.f + 1} Teile.`,
      `${eq('1 Teil = ' + p.u + ' V : ' + (p.f + 1) + ' = ' + fmt(p.u / (p.f + 1)) + ' V')}`,
      `${eq(ut('U2') + ' = ' + p.f + ' · ' + fmt(p.u / (p.f + 1)) + ' V = ' + ut(fmt((p.u * p.f) / (p.f + 1)) + ' V'))}`,
      'Merke: Der grössere Widerstand bekommt die grössere Spannung.',
    ],
  }),

  // ---------- Vorwiderstand ----------

  task({
    id: 'r11', karte: 'vorwid', stufe: 1, familie: 'rechnen', src: BUCH + ', Nr. 8',
    title: 'Vorwiderstand für eine Fahrradlampe',
    gen: buch({ ul: 6, il: 0.35, u: 24 }, () => ({ ul: pick([3, 4.5, 6]), il: pick([0.2, 0.25, 0.35, 0.5]), u: pick([24, 36, 48]) })),
    draw: (p) => reihe([{ name: 'Rv', wert: 'Rv = ?', u: 'U_v' }, { name: 'Lampe', typ: 'lampe', wert: `${p.ul} V / ${fmt(p.il)} A`, u: `${p.ul} V` }], { U: `U = ${p.u} V`, I: `I = ${fmt(p.il)} A` }),
    text: (p) => `Eine Lampe hat die Nennspannung ${ut(p.ul + ' V')} und den Nennstrom ${st(fmt(p.il) + ' A')}. Sie soll an ${ug('U = ' + p.u + ' V')} angeschlossen werden. Berechne a) die Spannung U_v am Vorwiderstand und b) den Vorwiderstand Rv.`,
    asks: (p) => [
      { k: 'a) U_v', unit: 'V', v: p.u - p.ul },
      { k: 'b) Rv', unit: 'Ω', v: (p.u - p.ul) / p.il },
    ],
    fehler: (p) => [
      { ask: 1, v: p.u / p.il, msg: 'Das ist der Gesamtwiderstand. Der Vorwiderstand nimmt nur U − U_Lampe auf.' },
      { ask: 1, v: p.ul / p.il, msg: 'Das ist der Widerstand der Lampe. Gefragt ist der Vorwiderstand.' },
    ],
    tipps: () => ['Der Vorwiderstand muss die überschüssige Spannung «schlucken».', 'U_v = U − U_Lampe. Der Strom ist der Nennstrom der Lampe.', 'Rv = U_v : I'],
    loesung: (p) => [
      `a) ${eq(ut('U_v') + ' = ' + ug('U') + ' − U_Lampe = ' + p.u + ' V − ' + p.ul + ' V = ' + ut(p.u - p.ul + ' V'))}`,
      `b) ${eq('Rv = ' + ut('U_v') + ' : ' + st('I') + ' = ' + (p.u - p.ul) + ' V : ' + fmt(p.il) + ' A = ' + fmt((p.u - p.ul) / p.il) + ' Ω')}`,
    ],
  }),

  task({
    id: 'r12', karte: 'vorwid', stufe: 2, familie: 'rechnen', src: BUCH + ', Nr. 10',
    title: 'Lötkolben in der Lötpause',
    gen: buch({ rl: 1610, u: 230, ul: 126 }, () => ({ rl: pick([1200, 1610, 2000]), u: 230, ul: pick([110, 126, 150]) })),
    draw: (p) => reihe([{ name: 'Rv', wert: 'Rv = ?', u: 'U_v' }, { name: 'Kolben', wert: `${p.rl} Ω`, u: `${p.ul} V`, typ: 'spule' }], { U: `U = ${p.u} V`, I: 'I' }),
    text: (p) => `Ein Lötkolben hat den Widerstand ${p.rl} Ω. Beim Löten liegt er an ${ug(p.u + ' V')}. In der Lötpause soll seine Spannung mit einem Vorwiderstand auf ${ut(p.ul + ' V')} sinken. Berechne a) den Strom I in mA in der Pause und b) den Vorwiderstand Rv. (Widerstandsänderung durch Wärme vernachlässigt.)`,
    asks: (p) => {
      const I = p.ul / p.rl;
      return [
        { k: 'a) I', unit: 'mA', v: I * 1000 },
        { k: 'b) Rv', unit: 'Ω', v: (p.u - p.ul) / I },
      ];
    },
    fehler: (p) => [
      { ask: 0, v: (p.u / p.rl) * 1000, msg: 'Das ist der Strom beim Löten. In der Pause liegen nur noch ' + p.ul + ' V am Kolben.' },
      { ask: 1, v: (p.u * p.rl) / p.ul, msg: 'Das ist der Gesamtwiderstand. Zieh den Kolben-Widerstand noch ab.' },
    ],
    tipps: () => ['Am Kolben kennst du Spannung und Widerstand. Daraus folgt der Strom.', 'I = U_Kolben : R_Kolben. Derselbe Strom fliesst durch Rv.', 'Rv = (U − U_Kolben) : I'],
    loesung: (p) => {
      const I = p.ul / p.rl;
      return [
        `a) ${eq(st('I') + ' = ' + p.ul + ' V : ' + p.rl + ' Ω = ' + st(fmt(I * 1000) + ' mA'))}`,
        `b) ${eq(ut('U_v') + ' = ' + p.u + ' − ' + p.ul + ' = ' + (p.u - p.ul) + ' V')}, ${eq('Rv = ' + (p.u - p.ul) + ' V : ' + fmt(I, 5) + ' A = ' + fmt((p.u - p.ul) / I) + ' Ω')}`,
        'Weniger Spannung heisst weniger Wärme. Die Spitze bleibt warm, verbrennt aber nicht.',
      ];
    },
  }),

  task({
    id: 'r13', karte: 'vorwid', stufe: 3, familie: 'kette', src: BUCH + ', Nr. 14',
    title: 'Relais: Anzugstrom und Haltestrom',
    gen: buch({ u: 48, ia: 29, ih: 22 }, () => ({ u: pick([24, 48]), ia: pick([25, 29, 35]), ih: pick([15, 18, 22]) })),
    draw: (p) => reihe([{ name: 'Rv', wert: 'Rv = ?', schalter: 'K1 (Kontakt)' }, { name: 'K1', typ: 'spule', wert: 'Spule', u: 'U_K = ?' }], { U: `U = ${p.u} V`, I: `I = ${p.ih} mA` }),
    text: (p) => `Ein ${p.u}-V-Relais braucht zum sicheren Anziehen ${st(p.ia + ' mA')}. Beim Anziehen ist Rv durch den Kontakt K1 überbrückt, die Spule liegt allein an ${ug(p.u + ' V')}. Danach öffnet K1, Rv liegt in Reihe. Der Haltestrom beträgt ${st(p.ih + ' mA')}. Berechne a) den Widerstand der Spule, b) den Vorwiderstand Rv und c) die Spannung an der Spule beim Haltestrom.`,
    asks: (p) => {
      const Rs = p.u / (p.ia / 1000);
      return [
        { k: 'a) R_Spule', unit: 'Ω', v: Rs },
        { k: 'b) Rv', unit: 'Ω', v: p.u / (p.ih / 1000) - Rs },
        { k: 'c) U_K', unit: 'V', v: (Rs * p.ih) / 1000 },
      ];
    },
    fehler: (p) => {
      const Rs = p.u / (p.ia / 1000);
      return [
        { ask: 1, v: p.u / (p.ih / 1000), msg: 'Das ist der Gesamtwiderstand beim Halten. Zieh den Spulenwiderstand ab.' },
        { ask: 2, v: p.u - (Rs * p.ih) / 1000, msg: 'Das ist die Spannung an Rv. Gefragt ist die Spannung an der Spule.' },
      ];
    },
    tipps: () => ['Beim Anziehen liegt nur die Spule an U. Daraus folgt ihr Widerstand.', 'R_Spule = U : I_an. Beim Halten: R_gesamt = U : I_halt.', 'Rv = R_gesamt − R_Spule. U_K = R_Spule · I_halt.'],
    loesung: (p) => {
      const Rs = p.u / (p.ia / 1000), Rg = p.u / (p.ih / 1000);
      return [
        `a) ${eq('R_Spule = ' + p.u + ' V : ' + fmt(p.ia / 1000, 3) + ' A = ' + fmt(Rs) + ' Ω')}`,
        `b) ${eq('R_gesamt = ' + p.u + ' V : ' + fmt(p.ih / 1000, 3) + ' A = ' + fmt(Rg) + ' Ω')}, ${eq('Rv = ' + fmt(Rg) + ' − ' + fmt(Rs) + ' = ' + fmt(Rg - Rs) + ' Ω')}`,
        `c) ${eq(ut('U_K') + ' = ' + fmt(Rs) + ' Ω · ' + fmt(p.ih / 1000, 3) + ' A = ' + ut(fmt((Rs * p.ih) / 1000) + ' V'))}`,
        'Zum Halten braucht das Relais weniger Strom. Der Vorwiderstand spart Energie und Wärme.',
      ];
    },
  }),

  task({
    id: 'r14', karte: 'vorwid', stufe: 3, familie: 'rechnen', src: BUCH + ', Nr. 15',
    title: 'Dunkelkammerleuchte: Vorwiderstände für 4 Stufen',
    gen: buch({ u: 6 }, () => ({ u: pick([5, 6, 9]) })),
    draw: (p) => reihe([{ name: 'Rv', wert: 'Rv = ?', u: 'U_v' }, { name: '20 LEDs', typ: 'led', wert: 'parallel', u: 'U_F' }], { U: `U = ${p.u} V`, I: 'I' }),
    text: (p) => `Eine Leuchte aus 20 parallelen Leuchtdioden liegt mit einem Vorwiderstand an ${ug('U = ' + p.u + ' V')}. Für 4 Helligkeitsstufen gilt: Stufe 1: U_F = 2 V bei 80 mA, Stufe 2: 2,2 V bei 180 mA, Stufe 3: 2,4 V bei 300 mA, Stufe 4: 2,6 V bei 440 mA. Berechne die Vorwiderstände Rv1 bis Rv4.`,
    asks: (p) => [
      { k: 'Rv1', unit: 'Ω', v: (p.u - 2) / 0.08 },
      { k: 'Rv2', unit: 'Ω', v: (p.u - 2.2) / 0.18 },
      { k: 'Rv3', unit: 'Ω', v: (p.u - 2.4) / 0.3 },
      { k: 'Rv4', unit: 'Ω', v: (p.u - 2.6) / 0.44 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.u / 0.08, msg: 'Du hast die ganze Spannung genommen. Am Vorwiderstand liegt nur U − U_F.' },
      { ask: 0, v: 2 / 0.08, msg: 'Das ist der Widerstand der Dioden. Gefragt ist der Vorwiderstand: (U − U_F) : I.' },
    ],
    tipps: () => ['Gleiches Vorgehen wie bei der Lampe, nur viermal.', 'U_v = U − U_F, dann Rv = U_v : I.', 'Rechne den Strom in A: 80 mA = 0,08 A.'],
    loesung: (p) => [
      `Stufe 1: ${eq('Rv1 = (' + p.u + ' − 2) V : 0,08 A = ' + fmt((p.u - 2) / 0.08) + ' Ω')}`,
      `Stufe 2: ${eq('Rv2 = (' + p.u + ' − 2,2) V : 0,18 A = ' + fmt((p.u - 2.2) / 0.18) + ' Ω')}`,
      `Stufe 3: ${eq('Rv3 = (' + p.u + ' − 2,4) V : 0,3 A = ' + fmt((p.u - 2.4) / 0.3) + ' Ω')}`,
      `Stufe 4: ${eq('Rv4 = (' + p.u + ' − 2,6) V : 0,44 A = ' + fmt((p.u - 2.6) / 0.44) + ' Ω')}`,
      'Je heller, desto kleiner der Vorwiderstand.',
    ],
  }),

  // ---------- Gleiche Bauteile in Reihe ----------

  task({
    id: 'r15', karte: 'gleich', stufe: 2, familie: 'rechnen', src: BUCH + ', Nr. 6',
    title: 'Spielzeugauto: eine Zelle falsch gepolt',
    gen: buch({ R: 37, n: 4, u0: 1.56 }, () => ({ R: pick([20, 30, 37, 45]), n: pick([3, 4, 6]), u0: pick([1.2, 1.5, 1.56]) })),
    draw: (p) => reihe([{ name: 'Motor', wert: `R = ${p.R} Ω`, typ: 'spule' }], { U: `${p.n} × ${fmt(p.u0)} V`, I: 'I = ?', zellen: `${p.n} Zellen` }),
    text: (p) => `Ein Spielzeugauto hat den Widerstand R = ${p.R} Ω. Es braucht ${p.n} Zellen in Reihe mit je ${ug('U01 = ' + fmt(p.u0) + ' V')}. Berechne den Strom in mA a) wenn alle Zellen richtig eingesetzt sind und b) wenn eine Zelle falsch gepolt ist. (Innenwiderstand vernachlässigt.)`,
    asks: (p) => [
      { k: 'a) I', unit: 'mA', v: ((p.n * p.u0) / p.R) * 1000 },
      { k: 'b) I', unit: 'mA', v: (((p.n - 2) * p.u0) / p.R) * 1000 },
    ],
    fehler: (p) => [
      { ask: 1, v: (((p.n - 1) * p.u0) / p.R) * 1000, msg: 'Die falsche Zelle fehlt nicht nur, sie arbeitet dagegen. Es bleiben n − 2 Zellen.' },
      { ask: 0, v: (p.u0 / p.R) * 1000, msg: 'Du hast nur eine Zelle gerechnet. In Reihe addieren sich die Spannungen: U = n · U01.' },
    ],
    tipps: () => ['In Reihe addieren sich die Zellenspannungen.', 'Eine falsch gepolte Zelle zieht ihre Spannung ab statt sie dazuzuzählen.', 'b) ΣU0 = (n − 2) · U01, dann I = ΣU0 : R.'],
    loesung: (p) => [
      `a) ${eq(ug('ΣU0') + ' = ' + p.n + ' · ' + fmt(p.u0) + ' V = ' + fmt(p.n * p.u0) + ' V')}, ${eq(st('I') + ' = ' + fmt(p.n * p.u0) + ' V : ' + p.R + ' Ω = ' + st(fmt((p.n * p.u0) / p.R, 4) + ' A = ' + fmt(((p.n * p.u0) / p.R) * 1000) + ' mA'))}`,
      `b) ${eq(ug('ΣU0') + ' = ' + (p.n - 1) + ' · ' + fmt(p.u0) + ' − ' + fmt(p.u0) + ' = ' + fmt((p.n - 2) * p.u0) + ' V')}, ${eq(st('I') + ' = ' + fmt((p.n - 2) * p.u0) + ' V : ' + p.R + ' Ω = ' + st(fmt(((p.n - 2) * p.u0) / p.R, 4) + ' A = ' + fmt((((p.n - 2) * p.u0) / p.R) * 1000) + ' mA'))}`,
      'Eine falsche Zelle kostet doppelt: Ihre Spannung fehlt und sie hebt eine andere auf.',
    ],
  }),

  task({
    id: 'r16', karte: 'gleich', stufe: 2, familie: 'waswaere', src: BUCH + ', Nr. 9',
    title: 'Lampenkette mit Drahtbrücken',
    gen: buch({ n: 20, u: 227, k: 3 }, () => ({ n: pick([10, 16, 20, 25]), u: pick([227, 230]), k: pick([1, 2, 3]) })),
    draw: (p) => reihe([{ name: 'L1', typ: 'lampe' }, { name: 'L2', typ: 'lampe' }, { name: '…', typ: 'lampe' }, { name: 'L' + p.n, typ: 'lampe' }], { U: `U = ${p.u} V`, I: 'I' }),
    text: (p) => `Eine Lampenkette aus ${p.n} gleichen Lampen in Reihe liegt an ${ug('U = ' + p.u + ' V')}. Für ${p.k} durchgebrannte Lampen legt man Drahtbrücken ein. Berechne a) die Spannung an jeder Lampe vorher, b) nachher und c) um wie viel Prozent sie gestiegen ist.`,
    asks: (p) => {
      const a = p.u / p.n, b = p.u / (p.n - p.k);
      return [
        { k: 'a) U vorher', unit: 'V', v: a },
        { k: 'b) U nachher', unit: 'V', v: b },
        { k: 'c) Zunahme', unit: '%', v: (b / a - 1) * 100 },
      ];
    },
    fehler: (p) => [
      { ask: 2, v: (p.k / p.n) * 100, msg: 'So einfach geht es nicht. Rechne (U_nachher : U_vorher − 1) · 100 %.' },
      { ask: 1, v: p.u / p.n, msg: 'Das ist die Spannung vorher. Nachher teilen sich weniger Lampen die Spannung.' },
    ],
    tipps: () => ['Gleiche Lampen teilen die Spannung gleichmässig.', 'U_Lampe = U : Anzahl Lampen. Nachher sind es ' + 'n − Brücken Lampen.', 'Zunahme in % = (U_nachher : U_vorher − 1) · 100'],
    loesung: (p) => {
      const a = p.u / p.n, b = p.u / (p.n - p.k);
      return [
        `a) ${eq(p.u + ' V : ' + p.n + ' = ' + ut(fmt(a) + ' V'))}`,
        `b) ${eq(p.u + ' V : ' + (p.n - p.k) + ' = ' + ut(fmt(b) + ' V'))}`,
        `c) ${eq('(' + fmt(b) + ' : ' + fmt(a) + ' − 1) · 100 % = ' + fmt((b / a - 1) * 100) + ' %')}`,
        'Die Lampen werden überlastet und brennen schneller durch. Drahtbrücken sind keine gute Idee.',
      ];
    },
  }),

  task({
    id: 'r17', karte: 'gleich', stufe: 3, familie: 'umgekehrt', src: BUCH + ', Nr. 11',
    title: 'Messschaltung mit drei Schaltern',
    gen: buch({ r4: 100, i3: 100, p: 20 }, () => ({ r4: pick([50, 100, 200]), i3: pick([50, 100, 200]), p: pick([10, 20, 25]) })),
    draw: (p) => reihe([{ name: 'R1', schalter: 'S1' }, { name: 'R2', schalter: 'S2' }, { name: 'R3', schalter: 'S3' }, { name: 'R4', wert: `${p.r4} Ω` }], { U: 'U', I: `I = ${p.i3} mA` }),
    text: (p) => `In einer Messschaltung liegen R1, R2, R3 und R4 = ${p.r4} Ω in Reihe. Die Schalter S1 bis S3 überbrücken R1 bis R3. Schliesst man S1, dann S2, dann S3, steigt der Strom jedes Mal um ${p.p} %. Sind alle Schalter zu, fliessen ${st(p.i3 + ' mA')}. Berechne a) die Spannung U, b) R3, c) R2 und d) R1.`,
    asks: (p) => {
      const f = 1 + p.p / 100, U = p.r4 * p.i3 / 1000;
      const I2 = p.i3 / f, I1 = I2 / f, I0 = I1 / f;
      const Rt = (i: number) => U / (i / 1000);
      return [
        { k: 'a) U', unit: 'V', v: U },
        { k: 'b) R3', unit: 'Ω', v: Rt(I2) - Rt(p.i3) },
        { k: 'c) R2', unit: 'Ω', v: Rt(I1) - Rt(I2) },
        { k: 'd) R1', unit: 'Ω', v: Rt(I0) - Rt(I1) },
      ];
    },
    fehler: (p) => {
      const U = p.r4 * p.i3 / 1000, f = 1 + p.p / 100;
      return [{ ask: 1, v: U / (p.i3 * (1 - p.p / 100) / 1000) - p.r4, msg: 'Rückwärts musst du durch 1,' + String(p.p).padStart(2, '0') + ' teilen, nicht ' + p.p + ' % abziehen.' }].filter((e) => Math.abs(e.v - (U / (p.i3 / f / 1000) - p.r4)) > 0.02 * e.v);
    },
    tipps: () => ['Wenn alle Schalter zu sind, fliesst der Strom nur noch durch R4. Daraus folgt U.', 'Rechne rückwärts: Vor dem letzten Schalten war der Strom I : 1,2 (bei 20 %).', 'Zu jedem Strom gehört ein Gesamtwiderstand R = U : I. Der Unterschied ist der überbrückte Widerstand.'],
    loesung: (p) => {
      const f = 1 + p.p / 100, U = p.r4 * p.i3 / 1000;
      const I2 = p.i3 / f, I1 = I2 / f, I0 = I1 / f, Rt = (i: number) => U / (i / 1000);
      return [
        `a) Alle zu: nur R4. ${eq(ug('U') + ' = ' + p.r4 + ' Ω · ' + fmt(p.i3 / 1000) + ' A = ' + ug(fmt(U) + ' V'))}`,
        `Ströme rückwärts: ${eq(fmt(p.i3) + ' → ' + fmt(I2) + ' → ' + fmt(I1) + ' → ' + fmt(I0) + ' mA')} (je durch ${fmt(f)})`,
        `Gesamtwiderstände: ${eq(fmt(Rt(p.i3)) + ' Ω, ' + fmt(Rt(I2)) + ' Ω, ' + fmt(Rt(I1)) + ' Ω, ' + fmt(Rt(I0)) + ' Ω')}`,
        `${eq('R3 = ' + fmt(Rt(I2) - Rt(p.i3)) + ' Ω')}, ${eq('R2 = ' + fmt(Rt(I1) - Rt(I2)) + ' Ω')}, ${eq('R1 = ' + fmt(Rt(I0) - Rt(I1)) + ' Ω')}`,
      ];
    },
  }),

  task({
    id: 'r18', karte: 'gleich', stufe: 1, familie: 'begruenden', src: 'Kreativ · Begründen',
    title: 'Eine Lampe brennt durch',
    gen: () => ({ n: pick([3, 4, 5]), u: pick([12, 24, 230]) }),
    draw: (p) => reihe([{ name: 'L1', typ: 'lampe' }, { name: 'L2', typ: 'lampe', u: 'U_L2 = ?' }, { name: 'L3', typ: 'lampe' }], { U: `U = ${p.u} V`, I: 'I' }),
    text: (p) => `${p.n} Lampen liegen in Reihe an ${ug('U = ' + p.u + ' V')}. Lampe L2 brennt durch (der Draht ist unterbrochen). a) Was passiert mit den anderen Lampen? b) Welche Spannung misst man jetzt an L2?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Andere Lampen',
        opts: ['Alle gehen aus. Der Stromkreis ist unterbrochen, I = 0.', 'Sie leuchten heller, weil eine Lampe weniger da ist.', 'Sie leuchten gleich weiter.', 'Nur die Lampe neben L2 geht aus.'],
        a: 0,
        why: [undefined, 'Heller würden sie bei einer Drahtbrücke. Hier ist der Kreis offen.', 'In Reihe gibt es nur einen Strompfad. Ist er offen, fliesst nirgends Strom.', 'Der Strom ist überall gleich. Wenn er an einer Stelle null ist, ist er überall null.'],
      },
      { k: 'b) U an L2', unit: 'V', v: p.u },
    ],
    fehler: (p) => [{ ask: 1, v: p.u / p.n, msg: 'Das war die Spannung vorher. Jetzt fliesst kein Strom. An den ganzen Lampen fällt keine Spannung ab, die ganze Spannung liegt an der Unterbrechung.' }],
    tipps: () => ['In Reihe gibt es nur einen Weg für den Strom.', 'Ohne Strom ist U = R · I = 0 an jeder ganzen Lampe.', 'Maschenregel: U = U1 + U2 + U3. Wenn U1 und U3 null sind, wie gross ist dann U2?'],
    loesung: (p) => [
      'a) Der Kreis ist offen. Es fliesst kein Strom. Alle Lampen gehen aus.',
      `b) An den ganzen Lampen ist ${eq('U = R · 0 = 0 V')}. Nach der Maschenregel liegt die ganze Spannung an L2: ${eq(ut('U_L2') + ' = ' + ug(p.u + ' V'))}`,
      'So findet man die kaputte Lampe: Dort misst man die volle Spannung.',
    ],
  }),
];
