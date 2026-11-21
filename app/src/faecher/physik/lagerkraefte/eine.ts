// Lernkarte «Bauteil mit einer Lagerstelle».
import { task, type Task } from '../../../core/types';
import { eq, f, l } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import * as B from './bilder';

const deg = (r: number) => (r * 180) / Math.PI;

export const EINE: Task[] = [
  task({
    id: 'l24', karte: 'eine', stufe: 1, familie: 'rechnen',
    title: 'Hebel mit einer Lagerstelle', src: 'nach Buch Lagerkräfte, Beispiel 2',
    gen: () => {
      let F1: number, F2: number;
      do { F1 = pick([1.5, 2, 2.5, 3, 4]); F2 = pick([1, 1.2, 1.7, 2, 2.5]); } while (F1 === F2);
      return { F1, F2 };
    },
    draw: (p) => B.krafteck(p, 1),
    loesungsbild: (p) => B.krafteck(p, 3),
    text: (p) => `An einem Hebel mit nur einem Lager A greifen ${f('F_1 = ' + fmt(p.F1) + ' kN')} waagrecht und ${f('F_2 = ' + fmt(p.F2) + ' kN')} senkrecht an. Das Lager hebt beide auf: ${f('F_Ax')} wirkt gegen F_1, ${f('F_Ay')} wirkt gegen F_2. Berechne a) die Lagerkraft F_A und b) den Winkel α zwischen F_A und der Waagrechten.`,
    asks: (p) => [
      { k: 'a) F_A', unit: 'kN', v: Math.hypot(p.F1, p.F2) },
      { k: 'b) α', unit: '°', v: deg(Math.atan2(p.F2, p.F1)) },
    ],
    fehler: (p) => [
      { ask: 0, v: p.F1 + p.F2, msg: 'Die Teilkräfte stehen rechtwinklig. Sie werden nicht einfach zusammengezählt. Rechne F_A = √(F_Ax² + F_Ay²).' },
      { ask: 1, v: 90 - deg(Math.atan2(p.F2, p.F1)), msg: 'Das ist der Winkel zur Senkrechten. Gefragt ist der Winkel zur Waagrechten: tan α = F_Ay : F_Ax.' },
      { ask: 1, v: p.F2 / p.F1, msg: 'Das ist tan α. Den Winkel bekommst du mit der Taste tan⁻¹.' },
    ],
    tipps: () => [
      'Nur eine Lagerstelle: Es gilt das Gleichgewicht der Kräfte.',
      'F_Ax = F_1 und F_Ay = F_2. Sie stehen rechtwinklig.',
      'F_A = √(F_Ax² + F_Ay²) und tan α = F_Ay : F_Ax',
    ],
    loesung: (p) => [
      `Teilkräfte: ${eq(f('F_Ax') + ' = ' + f('F_1') + ' = ' + fmt(p.F1) + ' kN')} und ${eq(f('F_Ay') + ' = ' + f('F_2') + ' = ' + fmt(p.F2) + ' kN')}`,
      `Krafteck (rechtwinklig): ${eq(f('F_A') + ' = √(' + fmt(p.F1) + '² + ' + fmt(p.F2) + '²) kN = ' + f(fmt(Math.hypot(p.F1, p.F2), 3) + ' kN'))}`,
      `${eq('tan α = ' + fmt(p.F2) + ' : ' + fmt(p.F1) + ' = ' + fmt(p.F2 / p.F1, 3))}, also ${eq('α = ' + fmt(deg(Math.atan2(p.F2, p.F1)), 1) + '°')}`,
    ],
  }),

  task({
    id: 'l25', karte: 'eine', stufe: 2, familie: 'rechnen',
    title: 'Umlenkrolle mit Pendelstange', src: 'nach Buch Lagerkräfte, Nr. 4',
    gen: () => ({ F: rng(800, 3000, 100) }),
    draw: (p) => B.umlenk(p),
    loesungsbild: (p) => B.umlenk(p, { res: `Resultierende ${fmt(p.F * Math.SQRT2)} N`, al: 'α = 45°' }),
    text: (p) => `Ein Zugseil wird über eine Rolle um 90° umgelenkt. Beide Seilenden ziehen mit ${f('F = ' + p.F + ' N')}: eines waagrecht nach links, eines senkrecht nach oben. Die Rollenachse A wird von einer Pendelstange gehalten. Berechne a) die Belastung F_A der Rollenachse und b) den Winkel α, unter dem sich die Pendelstange zur Senkrechten einstellt.`,
    asks: (p) => [
      { k: 'a) F_A', unit: 'N', v: p.F * Math.SQRT2 },
      { k: 'b) α', unit: '°', v: 45 },
    ],
    fehler: (p) => [
      { ask: 0, v: 2 * p.F, msg: 'Die zwei Seilkräfte stehen rechtwinklig. Sie werden nicht einfach zusammengezählt. Pythagoras: F_A = √(F² + F²).' },
      { ask: 0, v: p.F, msg: 'Das ist nur eine Seilkraft. Die Achse spürt beide Seilkräfte zusammen.' },
      { ask: 1, v: 1, msg: 'Das ist tan α = 1. Der Winkel dazu ist 45°.' },
    ],
    tipps: () => [
      'Die Rolle hat nur eine Lagerstelle. Darum gilt das Gleichgewicht der Kräfte, nicht der Momente.',
      'Die beiden Seilkräfte stehen rechtwinklig: F_A = √(F² + F²).',
      'Eine Pendelstange nimmt nur Kräfte in ihrer Längsrichtung auf. Sie stellt sich in Richtung von F_A ein. Gleich grosse Seilkräfte ergeben 45°.',
    ],
    loesung: (p) => [
      'Bauteil mit einer Lagerstelle: Die Lagerkraft hebt die Seilkräfte auf.',
      `Krafteck (rechtwinklig): ${eq(f('F_A') + ' = √(' + f('F_x') + '² + ' + f('F_y') + '²) = √(' + p.F + '² + ' + p.F + '²) N = ' + f(fmt(p.F * Math.SQRT2) + ' N'))}`,
      `Winkel: ${eq('tan α = ' + f('F_x') + ' : ' + f('F_y') + ' = ' + p.F + ' : ' + p.F + ' = 1')}, also ${eq('α = 45°')}`,
      'Die Pendelstange liegt genau auf der Wirkungslinie der Lagerkraft. Sonst würde sie sich drehen, bis sie es tut.',
    ],
  }),

  task({
    id: 'l26', karte: 'eine', stufe: 2, familie: 'rechnen',
    title: 'Hebel mit Feder', src: 'nach Buch Lagerkräfte, Nr. 5',
    gen: () => ({ F1: rng(2000, 4000, 100), F3: rng(200, 500, 20), a: pick([120, 140, 160]), b: pick([100, 118, 130]) }),
    draw: (p) => B.hebelFeder(p),
    loesungsbild: (p) => {
      const R = p.F1 - p.F3, F2 = (R * p.b) / p.a;
      return B.hebelFeder(p, { F2: `F_2 = ${fmt(F2)} N`, FA: `F_A = ${fmt(F2 + R)} N` });
    },
    text: (p) => `An einem Hebel drückt ein Bolzen rechts mit ${f('F_1 = ' + fmt(p.F1 / 1000, 2) + ' kN')} nach unten. Eine Rückstellfeder um den Bolzen drückt mit ${f('F_3 = ' + p.F3 + ' N')} dagegen. Der Hebel dreht im Lager A. Die Abstände sind ${l(p.a + ' mm')} (links) und ${l(p.b + ' mm')} (rechts). Berechne a) die Kraft F_2 am linken Ende und b) die Belastung F_A des Hebellagers.`,
    asks: (p) => {
      const R = p.F1 - p.F3, F2 = (R * p.b) / p.a;
      return [{ k: 'a) F_2', unit: 'N', v: F2 }, { k: 'b) F_A', unit: 'N', v: F2 + R }];
    },
    fehler: (p) => {
      const R = p.F1 - p.F3, F2 = (R * p.b) / p.a;
      return [
        { ask: 0, v: (p.F1 * p.b) / p.a, msg: 'Die Feder fehlt. Rechts wirkt nur F_1 − F_3 auf den Hebel.' },
        { ask: 0, v: (R * p.a) / p.b, msg: 'Die Abstände sind vertauscht. F_2 · a = (F_1 − F_3) · b.' },
        { ask: 1, v: F2 + p.F1, msg: 'Rechts wirkt nur F_1 − F_3, denn die Feder drückt dagegen.' },
      ];
    },
    tipps: () => [
      'Rechne zuerst die Kraft, die rechts wirklich auf den Hebel wirkt: F_1 − F_3. Achtung: F_1 in N umrechnen.',
      'Drehpunkt in A: F_2 · a = (F_1 − F_3) · b',
      'Lagerkraft: F_A = F_2 + (F_1 − F_3). Alle Kräfte am Hebel zeigen nach unten, A hält nach oben.',
    ],
    loesung: (p) => {
      const R = p.F1 - p.F3, F2 = (R * p.b) / p.a;
      return [
        `Kraft rechts: ${eq(f('F_1') + ' − ' + f('F_3') + ' = ' + p.F1 + ' N − ' + p.F3 + ' N = ' + f(R + ' N'))}`,
        `Momente um A: ${eq(f('F_2') + ' · ' + p.a + ' mm = ' + R + ' N · ' + p.b + ' mm')}`,
        `${eq(f('F_2 = ' + fmt(F2) + ' N'))}`,
        `Kräftegleichgewicht: ${eq(f('F_A') + ' = ' + fmt(F2) + ' N + ' + R + ' N = ' + f(fmt(F2 + R) + ' N'))}`,
      ];
    },
  }),

  task({
    id: 'l27', karte: 'eine', stufe: 2, familie: 'rechnen',
    title: 'Winkelhebel: Lager mit zwei Teilkräften', src: 'nach Buch Lagerkräfte, Nr. 6',
    gen: () => ({ F: rng(5, 15, 1), h: pick([80, 95, 110]), c: pick([100, 120, 150]) }),
    draw: (p) => B.winkelhebel(p),
    loesungsbild: (p) => {
      const F1 = (p.F * p.h) / p.c;
      return B.winkelhebel(p, { F1: `F_1 = ${fmt(F1, 3)} kN`, FA: `F_A = ${fmt(Math.hypot(p.F, F1), 3)} kN` });
    },
    text: (p) => `An einem Winkelhebel zieht die Kolbenkraft ${f('F = ' + p.F + ' kN')} waagrecht. Ihr Abstand zum Lager A ist ${l(p.h + ' mm')}. Am anderen Arm wirkt senkrecht die Kraft F_1 im Abstand ${l(p.c + ' mm')}. Berechne a) die Kraft F_1 und b) die Lagerkraft F_A.`,
    asks: (p) => {
      const F1 = (p.F * p.h) / p.c;
      return [{ k: 'a) F_1', unit: 'kN', v: F1 }, { k: 'b) F_A', unit: 'kN', v: Math.hypot(p.F, F1) }];
    },
    fehler: (p) => {
      const F1 = (p.F * p.h) / p.c;
      return [
        { ask: 0, v: (p.F * p.c) / p.h, msg: 'Die Hebelarme sind vertauscht. F · h = F_1 · c, also F_1 = F · h : c.' },
        { ask: 1, v: p.F + F1, msg: 'Die Teilkräfte im Lager stehen rechtwinklig. Pythagoras: F_A = √(F_Ax² + F_Ay²).' },
        { ask: 1, v: p.F, msg: 'Das ist nur die waagrechte Teilkraft F_Ax. Dazu kommt F_Ay = F_1.' },
      ];
    },
    tipps: (p) => [
      `Drehpunkt in A. Der Hebelarm von F ist senkrecht (${p.h} mm), der von F_1 waagrecht (${p.c} mm).`,
      `F · ${p.h} mm = F_1 · ${p.c} mm`,
      'Nur eine Lagerstelle: F_Ax = F und F_Ay = F_1. Sie stehen rechtwinklig: F_A = √(F_Ax² + F_Ay²).',
    ],
    loesung: (p) => {
      const F1 = (p.F * p.h) / p.c, FA = Math.hypot(p.F, F1);
      return [
        `Momente um A: ${eq(f('F') + ' · ' + l(p.h + ' mm') + ' = ' + f('F_1') + ' · ' + l(p.c + ' mm'))}`,
        `${eq(f('F_1') + ' = ' + p.F + ' kN · ' + p.h + ' : ' + p.c + ' = ' + f(fmt(F1, 3) + ' kN'))}`,
        `Teilkräfte im Lager: ${eq(f('F_Ax') + ' = ' + p.F + ' kN')} (hält F) und ${eq(f('F_Ay') + ' = ' + fmt(F1, 3) + ' kN')} (hält F_1)`,
        `Krafteck: ${eq(f('F_A') + ' = √(' + p.F + '² + ' + fmt(F1, 3) + '²) kN = ' + f(fmt(FA, 3) + ' kN'))}`,
      ];
    },
  }),

  task({
    id: 'l28', karte: 'eine', stufe: 2, familie: 'rechnen',
    title: 'Umlenkhebel einer Bremsanlage', src: 'eigene Variante zu Buch Nr. 6',
    gen: () => ({ F: pick([0.6, 0.8, 1, 1.2, 1.5]), h: pick([60, 80, 100]), c: pick([90, 120, 150]) }),
    draw: (p) => B.winkelhebel(p, { F: `F = ${fmt(p.F)} kN` }),
    text: (p) => `Ein Umlenkhebel lenkt die Kraft eines Bremsseils um. Das Seil zieht waagrecht mit ${f('F = ' + fmt(p.F) + ' kN')} im Abstand ${l(p.h + ' mm')} vom Lager A. Am anderen Arm drückt die Bremsstange senkrecht mit F_1 im Abstand ${l(p.c + ' mm')}. Berechne a) F_1, b) die Lagerkraft F_A und c) den Winkel α von F_A zur Waagrechten.`,
    asks: (p) => {
      const F1 = (p.F * p.h) / p.c;
      return [
        { k: 'a) F_1', unit: 'kN', v: F1 },
        { k: 'b) F_A', unit: 'kN', v: Math.hypot(p.F, F1) },
        { k: 'c) α', unit: '°', v: deg(Math.atan2(F1, p.F)) },
      ];
    },
    fehler: (p) => {
      const F1 = (p.F * p.h) / p.c;
      return [
        { ask: 0, v: (p.F * p.c) / p.h, msg: 'Die Hebelarme sind vertauscht. F · h = F_1 · c.' },
        { ask: 1, v: p.F + F1, msg: 'Die Teilkräfte stehen rechtwinklig. Pythagoras statt Addition.' },
        { ask: 2, v: 90 - deg(Math.atan2(F1, p.F)), msg: 'Das ist der Winkel zur Senkrechten. Gefragt ist der Winkel zur Waagrechten.' },
      ];
    },
    tipps: (p) => [
      `Momente um A: F · ${p.h} mm = F_1 · ${p.c} mm`,
      'Nur ein Lager: F_Ax = F und F_Ay = F_1.',
      'F_A = √(F_Ax² + F_Ay²), tan α = F_Ay : F_Ax',
    ],
    loesung: (p) => {
      const F1 = (p.F * p.h) / p.c;
      return [
        `${eq(f('F_1') + ' = ' + fmt(p.F) + ' kN · ' + p.h + ' : ' + p.c + ' = ' + f(fmt(F1, 3) + ' kN'))}`,
        `${eq(f('F_A') + ' = √(' + fmt(p.F) + '² + ' + fmt(F1, 3) + '²) = ' + f(fmt(Math.hypot(p.F, F1), 3) + ' kN'))}`,
        `${eq('tan α = ' + fmt(F1, 3) + ' : ' + fmt(p.F) + ' ⇒ α = ' + fmt(deg(Math.atan2(F1, p.F)), 1) + '°')}`,
      ];
    },
  }),

  task({
    id: 'l29', karte: 'eine', stufe: 2, familie: 'fehler',
    title: 'Fehler finden: Bens Lagerkraft',
    gen: () => ({ F: rng(5, 15, 1), h: pick([80, 95, 110]), c: pick([100, 120, 150]) }),
    draw: (p) => B.winkelhebel(p, { F1: `F_1 = ${fmt((p.F * p.h) / p.c, 3)} kN` }),
    text: (p) => {
      const F1 = (p.F * p.h) / p.c;
      return `An einem Winkelhebel mit einem Lager A wirken ${f('F = ' + p.F + ' kN')} waagrecht und ${f('F_1 = ' + fmt(F1, 3) + ' kN')} senkrecht. Ben rechnet die Lagerkraft: «F_A = F + F_1 = ${fmt(p.F + F1, 3)} kN». Was ist falsch?`;
    },
    asks: (p) => {
      const F1 = (p.F * p.h) / p.c;
      return [{
        kind: 'choice', k: 'Fehler',
        opts: [
          `Die Teilkräfte stehen rechtwinklig. Richtig ist F_A = √(F² + F_1²) = ${fmt(Math.hypot(p.F, F1), 3)} kN.`,
          'Er muss F_1 von F abziehen.',
          'Nichts. Bei einem Lager zählt man alle Kräfte zusammen.',
        ],
        a: 0,
        why: [
          undefined,
          'Abziehen geht nur bei Kräften auf derselben Linie. Hier stehen sie rechtwinklig zueinander.',
          'Zusammenzählen geht nur bei Kräften auf derselben Linie. Rechtwinklige Kräfte setzt man mit Pythagoras zusammen.',
        ],
      }];
    },
    tipps: () => [
      'Zeichne die zwei Teilkräfte als Krafteck. In welchem Winkel stehen sie?',
      'Sie stehen im rechten Winkel. Die Lagerkraft ist die Diagonale.',
      'F_A = √(F_Ax² + F_Ay²)',
    ],
    loesung: (p) => {
      const F1 = (p.F * p.h) / p.c;
      return [
        'Die waagrechte und die senkrechte Teilkraft stehen im rechten Winkel zueinander.',
        `${eq(f('F_A') + ' = √(' + p.F + '² + ' + fmt(F1, 3) + '²) kN = ' + f(fmt(Math.hypot(p.F, F1), 3) + ' kN'))}`,
        'Kontrolle mit Gefühl: Die Diagonale ist immer kürzer als die Summe der beiden Seiten.',
      ];
    },
  }),
];
