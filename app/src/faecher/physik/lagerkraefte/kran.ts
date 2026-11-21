// Lernkarte «Wandernde Last und Kombiniertes» (Kran, Winde).
import { task, type Task } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import * as B from './bilder';

export const KRAN: Task[] = [
  task({
    id: 'l30', karte: 'kran', stufe: 3, familie: 'rechnen',
    title: 'Laufkran mit zwei Stellungen', src: 'nach Buch Lagerkräfte, Nr. 8',
    gen: () => ({ F1: rng(8, 20, 1), F2: pick([50, 60, 70]), F3: pick([15, 20, 25]), L: 10, x1: pick([2.5, 3, 3.5]), xg: pick([4.6, 5]), x2: pick([6.8, 7.5, 8]) }),
    draw: (p) => B.traeger({ l: p.L, loads: [{ x: p.x1, F: p.F1 + p.F3, lab: `F_1 + F_3 = ${p.F1 + p.F3} kN`, anc: true }, { x: p.xg, F: p.F2, lab: `F_2 = ${p.F2} kN` }] }, { segs: [`${fmt(p.x1)} m`, '', ''], ex: [p.xg, `${fmt(p.xg)} m`], tot: `l = ${p.L} m` }),
    text: (p) => `Ein Laufkran mit der Spannweite ${l('l = ' + p.L + ' m')} hebt die Last ${f('F_1 = ' + p.F1 + ' kN')}. Die Laufkatze hat ${f('F_3 = ' + p.F3 + ' kN')}. Sie trägt die Last an derselben Stelle. Die Kranbrücke hat ${f('F_2 = ' + p.F2 + ' kN')} im Abstand ${l(fmt(p.xg) + ' m')} von A. Berechne F_A und F_B a) mit der Laufkatze bei ${l(fmt(p.x1) + ' m')} und b) bei ${l(fmt(p.x2) + ' m')} von A.`,
    asks: (p) => {
      const G = p.F1 + p.F3, B1 = (G * p.x1 + p.F2 * p.xg) / p.L, B2 = (G * p.x2 + p.F2 * p.xg) / p.L, T = G + p.F2;
      return [
        { k: 'a) F_A', unit: 'kN', v: T - B1 },
        { k: 'a) F_B', unit: 'kN', v: B1 },
        { k: 'b) F_A', unit: 'kN', v: T - B2 },
        { k: 'b) F_B', unit: 'kN', v: B2 },
      ];
    },
    fehler: (p) => {
      const G = p.F1 + p.F3, T = G + p.F2;
      return [
        { ask: 0, v: T, msg: 'Das ist die Summe aller Lasten. Davon trägt F_B noch einen Teil. Ziehe F_B ab.' },
        { ask: 1, v: (p.F1 * p.x1 + p.F2 * p.xg) / p.L, msg: 'Die Laufkatze fehlt. Sie wirkt zusammen mit der Last: F_1 + F_3.' },
        { ask: 2, v: T, msg: 'Das ist die Summe aller Lasten. Davon trägt F_B noch einen Teil. Ziehe F_B ab.' },
        { ask: 3, v: (p.F1 * p.x2 + p.F2 * p.xg) / p.L, msg: 'Die Laufkatze fehlt. Sie wirkt zusammen mit der Last: F_1 + F_3.' },
      ];
    },
    tipps: (p) => [
      'Last und Laufkatze greifen an derselben Stelle an. Fasse sie zusammen: F_1 + F_3.',
      `Drehpunkt in A: F_B · l = (F_1 + F_3) · x + F_2 · ${fmt(p.xg)} m`,
      `Rechne zweimal: einmal mit x = ${fmt(p.x1)} m, einmal mit x = ${fmt(p.x2)} m. F_A = Summe aller Lasten − F_B.`,
    ],
    loesung: (p) => {
      const G = p.F1 + p.F3, T = G + p.F2, B1 = (G * p.x1 + p.F2 * p.xg) / p.L, B2 = (G * p.x2 + p.F2 * p.xg) / p.L;
      return [
        `Zusammenfassen: ${eq(p.F1 + ' kN + ' + p.F3 + ' kN = ' + G + ' kN')}. Summe aller Lasten: ${eq(T + ' kN')}`,
        `a) ${eq(f('F_B') + ' = (' + G + ' kN · ' + fmt(p.x1) + ' m + ' + p.F2 + ' kN · ' + fmt(p.xg) + ' m) : ' + p.L + ' m = ' + f(fmt(B1, 3) + ' kN'))}, ${eq(f('F_A') + ' = ' + T + ' − ' + fmt(B1, 3) + ' = ' + f(fmt(T - B1, 3) + ' kN'))}`,
        `b) ${eq(f('F_B') + ' = (' + G + ' kN · ' + fmt(p.x2) + ' m + ' + p.F2 + ' kN · ' + fmt(p.xg) + ' m) : ' + p.L + ' m = ' + f(fmt(B2, 3) + ' kN'))}, ${eq(f('F_A') + ' = ' + T + ' − ' + fmt(B2, 3) + ' = ' + f(fmt(T - B2, 3) + ' kN'))}`,
        'Fährt die Laufkatze nach rechts, wird B stärker und A schwächer belastet. Die Summe bleibt gleich.',
      ];
    },
  }),

  task({
    id: 'l31', karte: 'kran', stufe: 3, familie: 'umgekehrt',
    title: 'Hallenkran: Wie weit darf die Katze fahren?', src: 'Kreativ: umgekehrt gefragt',
    gen: () => {
      let r: { L: number; F2: number; F1: number; F3: number; FBm: number; xg: number; x1: number };
      do {
        const L = pick([10, 12, 16]), F2 = pick([30, 40, 50]), F1 = pick([50, 80, 100]), F3 = pick([10, 15, 20]), xt = L * pick([0.7, 0.75, 0.8, 0.85]);
        const FBm = Math.round((F2 * L / 2 + (F1 + F3) * xt) / L);
        r = { L, F2, F1, F3, FBm, xg: L / 2, x1: (FBm * L - (F2 * L) / 2) / (F1 + F3) };
      } while (r.x1 > r.L - 0.3 || r.x1 < r.L / 2);
      return r;
    },
    draw: (p) => B.hallenkran({ ...p, x1: p.L * 0.8 }, { x1lab: 'x = ?', FB: `F_B,max = ${p.FBm} kN` }),
    loesungsbild: (p) => B.hallenkran(p, { x1lab: `x = ${fmt(p.x1, 2)} m`, FB: `F_B = ${p.FBm} kN`, FA: `F_A = ${fmt(p.F1 + p.F2 + p.F3 - p.FBm)} kN` }),
    text: (p) => `Die Kranbahn rechts (Lager B) darf höchstens mit ${f('F_B,max = ' + p.FBm + ' kN')} belastet werden. Die Kranbrücke (${l('l = ' + p.L + ' m')}) wiegt ${f('F_2 = ' + p.F2 + ' kN')}. Ihr Schwerpunkt liegt in der Mitte. Die Laufkatze wiegt ${f('F_3 = ' + p.F3 + ' kN')}, die Last ${f('F_1 = ' + p.F1 + ' kN')}. a) Wie weit darf die Laufkatze von A wegfahren? b) Wie gross ist F_A in dieser Stellung?`,
    asks: (p) => [
      { k: 'a) x max', unit: 'm', v: p.x1 },
      { k: 'b) F_A', unit: 'kN', v: p.F1 + p.F2 + p.F3 - p.FBm },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.FBm * p.L) / (p.F1 + p.F3), msg: 'Das Gewicht der Kranbrücke fehlt. Sie dreht in der Mitte mit: F_2 · l : 2.' },
      { ask: 1, v: p.F1 + p.F2 + p.F3, msg: 'Das ist die Summe aller Lasten. Davon trägt B einen Teil (F_B,max). Ziehe ihn ab.' },
    ],
    tipps: (p) => [
      'Das ist die Lagerkraft-Rechnung rückwärts: F_B ist bekannt, der Abstand x ist gesucht.',
      `Drehpunkt in A: F_B,max · l = F_2 · ${fmt(p.L / 2)} m + (F_1 + F_3) · x`,
      'Nach x umstellen: x = (F_B,max · l − F_2 · l : 2) : (F_1 + F_3)',
    ],
    loesung: (p) => [
      'Drehpunkt in A. F_B ist jetzt gegeben, x ist gesucht.',
      `${eq(f(p.FBm + ' kN') + ' · ' + l(p.L + ' m') + ' = ' + f(p.F2 + ' kN') + ' · ' + l(fmt(p.L / 2) + ' m') + ' + ' + f(p.F1 + p.F3 + ' kN') + ' · ' + l('x'))}`,
      `${eq(l('x') + ' = (' + fmt(p.FBm * p.L) + ' − ' + fmt((p.F2 * p.L) / 2) + ') kN·m : ' + (p.F1 + p.F3) + ' kN = ' + l(fmt(p.x1, 2) + ' m'))}`,
      `b) ${eq(f('F_A') + ' = ' + p.F1 + ' + ' + p.F2 + ' + ' + p.F3 + ' − ' + p.FBm + ' = ' + f(fmt(p.F1 + p.F2 + p.F3 - p.FBm) + ' kN'))}`,
      'Fährt die Katze weiter nach rechts, wird die Kranbahn B überlastet.',
    ],
  }),

  task({
    id: 'l32', karte: 'kran', stufe: 3, familie: 'kette',
    title: 'Seilwinde: Masse, Drehmoment und Lagerkräfte', src: 'Kreativ: Themen kombiniert',
    gen: () => {
      let a: number, ll: number;
      do { ll = pick([600, 800, 1000]); a = pick([200, 250, 300]); } while (a / ll === 0.5);
      return { m: pick([200, 300, 400, 500]), d: pick([160, 200, 250]), l: ll, a };
    },
    draw: (p) => B.winde(p),
    loesungsbild: (p) => {
      const F = p.m * 9.81;
      return B.winde(p, { M: `M = ${fmt((F * p.d) / 2000)} N·m`, RA: `F_A = ${fmt((F * (p.l - p.a)) / p.l)} N`, RB: `F_B = ${fmt((F * p.a) / p.l)} N` });
    },
    text: (p) => `Eine Seilwinde hebt eine Last mit m = ${p.m} kg. Die Seiltrommel hat ${l('d = ' + p.d + ' mm')}. Das Seil läuft im Abstand ${l('a = ' + p.a + ' mm')} vom Lager A ab. Die Lager A und B haben den Abstand ${l('l = ' + p.l + ' mm')}. Rechne mit g = 9,81 m/s². Berechne a) die Gewichtskraft F_G, b) das Drehmoment M, das der Motor liefern muss, und c) die Lagerkräfte F_A und F_B. Das Eigengewicht der Welle zählt nicht.`,
    asks: (p) => {
      const F = p.m * 9.81;
      return [
        { k: 'a) F_G', unit: 'N', v: F },
        { k: 'b) M', unit: 'N·m', v: (F * p.d) / 2000 },
        { k: 'c) F_A', unit: 'N', v: (F * (p.l - p.a)) / p.l },
        { k: 'c) F_B', unit: 'N', v: (F * p.a) / p.l },
      ];
    },
    fehler: (p) => {
      const F = p.m * 9.81;
      return [
        { ask: 0, v: p.m, msg: 'Das ist die Masse in kg. Die Gewichtskraft ist F_G = m · g.' },
        { ask: 1, v: (F * p.d) / 1000, msg: 'Du hast mit dem Durchmesser gerechnet. Der Hebelarm ist der Radius d : 2.' },
        { ask: 2, v: (F * p.a) / p.l, msg: 'Die Lager sind vertauscht. F_B · l = F_G · a und F_A = F_G − F_B.' },
        { ask: 3, v: (F * (p.l - p.a)) / p.l, msg: 'Die Lager sind vertauscht. F_B · l = F_G · a.' },
      ];
    },
    tipps: () => [
      'a) F_G = m · g',
      'b) Die Seilkraft greift am Trommelumfang an. Hebelarm = d : 2, in m.',
      'c) Für die Lager zählt nur, wo das Seil abläuft: Drehpunkt in A, F_B · l = F_G · a.',
    ],
    loesung: (p) => {
      const F = p.m * 9.81;
      return [
        `a) ${eq(f('F_G') + ' = ' + p.m + ' kg · 9,81 m/s² = ' + f(fmt(F) + ' N'))}`,
        `b) ${eq(m('M') + ' = ' + f('F_G') + ' · ' + l('d : 2') + ' = ' + fmt(F) + ' N · ' + fmt(p.d / 2000, 3) + ' m = ' + m(fmt((F * p.d) / 2000) + ' N·m'))}`,
        `c) Drehpunkt in A: ${eq(f('F_B') + ' = ' + fmt(F) + ' · ' + p.a + ' : ' + p.l + ' = ' + f(fmt((F * p.a) / p.l) + ' N'))}`,
        `${eq(f('F_A') + ' = ' + fmt(F) + ' − ' + fmt((F * p.a) / p.l) + ' = ' + f(fmt((F * (p.l - p.a)) / p.l) + ' N'))}`,
        'Drei Themen in einer Aufgabe: Masse gibt Kraft, Kraft gibt Drehmoment, Kraft gibt Lagerkräfte.',
      ];
    },
  }),
];
