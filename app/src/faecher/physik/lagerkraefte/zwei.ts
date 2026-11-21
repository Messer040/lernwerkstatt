// Lernkarte «Träger auf zwei Lagern».
import { task, type Task } from '../../../core/types';
import { eq, f, l } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import * as B from './bilder';

/** Standardlösung: eine Last F im Abstand a von A, Lagerabstand ll. */
const stdLoesung = (F: number, a: number, ll: number, u: string) => {
  const FB = (F * a) / ll;
  return [
    `Freimachen: Die Lager werden durch die Kräfte ${f('F_A')} und ${f('F_B')} ersetzt.`,
    `Drehpunkt in A wählen. Dann hat ${f('F_A')} keinen Hebelarm und fällt weg.`,
    `Momentengleichgewicht um A: ${eq(f('F_B') + ' · ' + l('l') + ' = ' + f('F') + ' · ' + l('a'))}`,
    `${eq(f('F_B') + ' = ' + f(fmt(F) + ' ' + u) + ' · ' + l(a + ' mm') + ' : ' + l(ll + ' mm') + ' = ' + f(fmt(FB) + ' ' + u))}`,
    `Kräftegleichgewicht: ${eq(f('F_A') + ' = ' + f('F') + ' − ' + f('F_B') + ' = ' + fmt(F) + ' ' + u + ' − ' + fmt(FB) + ' ' + u + ' = ' + f(fmt(F - FB) + ' ' + u))}`,
    `Kontrolle um B: ${eq(f('F_A') + ' · ' + l('l') + ' = ' + f('F') + ' · ' + l('b'))} ergibt ${fmt((F * (ll - a)) / ll)} ${u}. Das stimmt.`,
  ];
};

export const ZWEI: Task[] = [
  task({
    id: 'l1', karte: 'zwei', stufe: 1, familie: 'rechnen',
    title: 'Träger mit Last in der Mitte',
    gen: () => ({ F: rng(2, 12, 1), l: rng(1200, 3000, 200) }),
    draw: (p) => B.traeger({ l: p.l, loads: [{ x: p.l / 2, F: p.F, lab: `F = ${p.F} kN` }] }, { segs: [`${p.l / 2}`, `${p.l / 2}`], tot: `l = ${p.l}` }),
    loesungsbild: (p) => B.traeger({ l: p.l, loads: [{ x: p.l / 2, F: p.F, lab: `F = ${p.F} kN` }] }, { RA: `F_A = ${fmt(p.F / 2)} kN`, RB: `F_B = ${fmt(p.F / 2)} kN` }),
    text: (p) => `Ein Träger liegt auf den Lagern A und B. Der Lagerabstand ist ${l('l = ' + p.l + ' mm')}. Genau in der Mitte wirkt die Kraft ${f('F = ' + p.F + ' kN')}. Wie gross sind die Lagerkräfte F_A und F_B?`,
    asks: (p) => [{ k: 'F_A', unit: 'kN', v: p.F / 2 }, { k: 'F_B', unit: 'kN', v: p.F / 2 }],
    fehler: (p) => [
      { ask: 0, v: p.F, msg: 'Das ist die ganze Last. Ein Lager trägt nur einen Teil davon.' },
      { ask: 0, v: p.F / 4, msg: 'Du hast zweimal durch 2 geteilt. Die Last verteilt sich nur auf zwei Lager.' },
      { ask: 1, v: p.F, msg: 'Das ist die ganze Last. Ein Lager trägt nur einen Teil davon.' },
      { ask: 1, v: p.F / 4, msg: 'Du hast zweimal durch 2 geteilt. Die Last verteilt sich nur auf zwei Lager.' },
    ],
    tipps: () => [
      'Die Last liegt symmetrisch. Beide Lager tragen gleich viel.',
      'Die Last verteilt sich auf zwei gleiche Lager.',
      'F_A = F_B = F : 2',
    ],
    loesung: (p) => [
      'Die Last wirkt genau in der Mitte. Der Träger ist symmetrisch belastet.',
      `Jedes Lager trägt die Hälfte: ${eq(f('F_A') + ' = ' + f('F_B') + ' = ' + f('F') + ' : 2')}`,
      `Resultat: ${eq(f('F_A = F_B = ' + fmt(p.F / 2) + ' kN'))}`,
      `Kontrolle: ${eq(f('F_A') + ' + ' + f('F_B') + ' = ' + fmt(p.F) + ' kN')}. Das ist gleich der Last.`,
    ],
  }),

  task({
    id: 'l2', karte: 'zwei', stufe: 1, familie: 'rechnen',
    title: 'Träger mit Last ausserhalb der Mitte',
    gen: () => {
      const ll = rng(1000, 2400, 200);
      return { F: rng(2, 12, 1), l: ll, a: Math.round(pick([0.2, 0.25, 0.3, 0.4, 0.6, 0.7, 0.75]) * ll) };
    },
    draw: (p) => B.traeger({ l: p.l, loads: [{ x: p.a, F: p.F, lab: `F = ${p.F} kN` }] }, { segs: [`a = ${p.a}`, `b = ${p.l - p.a}`], tot: `l = ${p.l}` }),
    loesungsbild: (p) => B.traeger({ l: p.l, loads: [{ x: p.a, F: p.F, lab: `F = ${p.F} kN` }] }, { RA: `F_A = ${fmt((p.F * (p.l - p.a)) / p.l)} kN`, RB: `F_B = ${fmt((p.F * p.a) / p.l)} kN` }),
    text: (p) => `Auf einem Träger mit dem Lagerabstand ${l('l = ' + p.l + ' mm')} wirkt die Kraft ${f('F = ' + p.F + ' kN')}. Sie greift im Abstand ${l('a = ' + p.a + ' mm')} vom Lager A an. Berechne die Lagerkräfte F_A und F_B.`,
    asks: (p) => [
      { k: 'F_A', unit: 'kN', v: (p.F * (p.l - p.a)) / p.l },
      { k: 'F_B', unit: 'kN', v: (p.F * p.a) / p.l },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.F * p.a) / p.l, msg: 'Die Lager sind vertauscht. Das Lager nahe der Last trägt mehr. Die Hebelarme gehören zum anderen Lager.' },
      { ask: 0, v: p.F / 2, msg: 'Halbe Last gilt nur, wenn die Last in der Mitte steht.' },
      { ask: 1, v: (p.F * (p.l - p.a)) / p.l, msg: 'Die Lager sind vertauscht. F_B · l = F · a. Der Hebelarm der Last um A ist a.' },
      { ask: 1, v: p.F / 2, msg: 'Halbe Last gilt nur, wenn die Last in der Mitte steht.' },
    ],
    tipps: () => [
      'Wähle den Drehpunkt in einem Lager, zum Beispiel in A.',
      'Um A drehen zwei Kräfte: F mit dem Hebelarm a und F_B mit dem Hebelarm l.',
      'F_B · l = F · a. Danach: F_A = F − F_B.',
    ],
    loesung: (p) => [...stdLoesung(p.F, p.a, p.l, 'kN'), 'Vorstellung: Das Lager, das näher an der Last liegt, trägt mehr.'],
  }),

  task({
    id: 'l3', karte: 'zwei', stufe: 1, familie: 'rechnen',
    title: 'Wälzführung', src: 'nach Buch Lagerkräfte, Nr. 1',
    gen: () => ({ F: rng(300, 900, 50), a: pick([60, 82, 100, 120]), b: pick([80, 104, 140]) }),
    draw: (p) => B.traeger({ l: p.a + p.b, loads: [{ x: p.a, F: p.F, lab: `F = ${p.F} N` }] }, { segs: [`${p.a}`, `${p.b}`], tot: `l = ${p.a + p.b}` }),
    loesungsbild: (p) => B.traeger({ l: p.a + p.b, loads: [{ x: p.a, F: p.F, lab: `F = ${p.F} N` }] }, { RA: `F_A = ${fmt((p.F * p.b) / (p.a + p.b))} N`, RB: `F_B = ${fmt((p.F * p.a) / (p.a + p.b))} N` }),
    text: (p) => `Ein Maschinenschlitten läuft auf zwei Wälzführungen A und B. Im Betrieb wirkt die Gesamtbelastung ${f('F = ' + p.F + ' N')}. Sie greift ${l(p.a + ' mm')} rechts von A und ${l(p.b + ' mm')} links von B an. Wie gross sind die Belastungen F_A und F_B der Führungen?`,
    asks: (p) => [
      { k: 'F_A', unit: 'N', v: (p.F * p.b) / (p.a + p.b) },
      { k: 'F_B', unit: 'N', v: (p.F * p.a) / (p.a + p.b) },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.F * p.a) / (p.a + p.b), msg: 'Die Führungen sind vertauscht. F_A gehört zum Abstand b, den die Last zu B hat.' },
      { ask: 1, v: (p.F * p.b) / (p.a + p.b), msg: 'Die Führungen sind vertauscht. F_B gehört zum Abstand a, den die Last zu A hat.' },
    ],
    tipps: (p) => [
      `Ersatzbild: Der Schlitten ist ein Träger auf zwei Stützen A und B. Lagerabstand l = ${p.a} mm + ${p.b} mm.`,
      'Drehpunkt in A. Dann F_B im Lager B ansetzen.',
      `F_B · l = F · ${p.a} mm. Danach F_A = F − F_B.`,
    ],
    loesung: (p) => {
      const L = p.a + p.b, FB = (p.F * p.a) / L;
      return [
        `Ersatzbild: Träger auf zwei Stützen. ${eq(l('l = ' + p.a + ' mm + ' + p.b + ' mm = ' + L + ' mm'))}`,
        'Drehpunkt in A. F_B in B ansetzen.',
        `Momentengleichgewicht: ${eq(f('F_B') + ' · ' + l('l') + ' = ' + f('F') + ' · ' + l(p.a + ' mm'))}`,
        `${eq(f('F_B') + ' = ' + p.F + ' N · ' + p.a + ' mm : ' + L + ' mm = ' + f(fmt(FB) + ' N'))}`,
        `Kräftegleichgewicht: ${eq(f('F_A') + ' = ' + p.F + ' N − ' + fmt(FB) + ' N = ' + f(fmt(p.F - FB) + ' N'))}`,
      ];
    },
  }),

  task({
    id: 'l4', karte: 'zwei', stufe: 1, familie: 'rechnen',
    title: 'Fräsmaschine: Fräsdorn', src: 'nach Buch Lagerkräfte, Nr. 3',
    gen: () => {
      let a: number, b: number;
      do { a = pick([150, 180, 200]); b = pick([180, 210, 250]); } while (a === b);
      return { F: pick([2, 2.5, 3, 3.5, 4, 5]), a, b };
    },
    draw: (p) => B.traeger({ l: p.a + p.b, loads: [{ x: p.a, F: p.F, lab: `F = ${fmt(p.F)} kN` }] }, { segs: [`${p.a}`, `${p.b}`], tot: `l = ${p.a + p.b}` }),
    loesungsbild: (p) => B.traeger({ l: p.a + p.b, loads: [{ x: p.a, F: p.F, lab: `F = ${fmt(p.F)} kN` }] }, { RA: `F_A = ${fmt((p.F * p.b) / (p.a + p.b))} kN`, RB: `F_B = ${fmt((p.F * p.a) / (p.a + p.b))} kN` }),
    text: (p) => `Der Fräsdorn ist in A und B gelagert. Die Schnittkraft ${f('F = ' + fmt(p.F) + ' kN')} greift ${l(p.a + ' mm')} von A und ${l(p.b + ' mm')} von B an. Wie gross sind die Kräfte in den Lagern A und B? Wenn alle Kräfte die Richtung wechseln, bleiben die Beträge gleich. Du darfst die Last also normal von oben zeichnen.`,
    asks: (p) => [
      { k: 'F_A', unit: 'kN', v: (p.F * p.b) / (p.a + p.b) },
      { k: 'F_B', unit: 'kN', v: (p.F * p.a) / (p.a + p.b) },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.F * p.a) / (p.a + p.b), msg: 'Die Lager sind vertauscht. F_A gehört zum Abstand b.' },
      { ask: 1, v: (p.F * p.b) / (p.a + p.b), msg: 'Die Lager sind vertauscht. F_B gehört zum Abstand a.' },
    ],
    tipps: (p) => [
      `Ersatzbild: Der Dorn ist ein Träger auf zwei Stützen. Lagerabstand l = ${p.a + p.b} mm.`,
      `Drehpunkt in A: F_B · l = F · ${p.a} mm`,
      'F_A = F − F_B',
    ],
    loesung: (p) => {
      const L = p.a + p.b, FB = (p.F * p.a) / L;
      return [
        `${eq(l('l = ' + p.a + ' mm + ' + p.b + ' mm = ' + L + ' mm'))}`,
        `Drehpunkt in A: ${eq(f('F_B') + ' = ' + fmt(p.F) + ' kN · ' + p.a + ' mm : ' + L + ' mm = ' + f(fmt(FB, 3) + ' kN'))}`,
        `${eq(f('F_A') + ' = ' + fmt(p.F) + ' kN − ' + fmt(FB, 3) + ' kN = ' + f(fmt(p.F - FB, 3) + ' kN'))}`,
      ];
    },
  }),

  task({
    id: 'l5', karte: 'zwei', stufe: 1, familie: 'rechnen',
    title: 'Getriebewelle mit zwei Zahnrädern', src: 'nach Buch Lagerkräfte, Beispiel 1',
    gen: () => ({ F1: pick([1.5, 2, 2.5, 3]), F2: pick([2.5, 3.1, 3.5, 4]), l1: pick([180, 210, 240]), l2: pick([350, 380, 420]), l: 560 }),
    draw: (p) => B.traeger({ l: p.l, loads: [{ x: p.l1, F: p.F1, lab: `F_1 = ${fmt(p.F1)} kN`, anc: true }, { x: p.l2, F: p.F2, lab: `F_2 = ${fmt(p.F2)} kN` }] }, { segs: [`l_1 = ${p.l1}`, '', ''], ex: [p.l2, `l_2 = ${p.l2}`], tot: `l = ${p.l}` }),
    loesungsbild: (p) => {
      const FB = (p.F1 * p.l1 + p.F2 * p.l2) / p.l;
      return B.traeger({ l: p.l, loads: [{ x: p.l1, F: p.F1, lab: 'F_1', anc: true }, { x: p.l2, F: p.F2, lab: 'F_2' }] }, { RA: `F_A = ${fmt(p.F1 + p.F2 - FB, 3)} kN`, RB: `F_B = ${fmt(FB, 3)} kN` });
    },
    text: (p) => `Eine Getriebewelle ist in A und B gelagert (${l('l = ' + p.l + ' mm')}). Zwei Zahnräder drücken mit ${f('F_1 = ' + fmt(p.F1) + ' kN')} bei ${l('l_1 = ' + p.l1 + ' mm')} und ${f('F_2 = ' + fmt(p.F2) + ' kN')} bei ${l('l_2 = ' + p.l2 + ' mm')}, beide von A aus gemessen. Wie gross sind die Lagerkräfte F_A und F_B?`,
    asks: (p) => {
      const FB = (p.F1 * p.l1 + p.F2 * p.l2) / p.l;
      return [{ k: 'F_A', unit: 'kN', v: p.F1 + p.F2 - FB }, { k: 'F_B', unit: 'kN', v: FB }];
    },
    fehler: (p) => [
      { ask: 0, v: p.F1 + p.F2, msg: 'Das ist die Summe der Lasten. Davon trägt F_B noch einen Teil. Ziehe F_B ab.' },
      { ask: 1, v: (p.F1 * p.l1) / p.l, msg: 'F_2 fehlt. Beide Zahnräder drehen um A. Rechne F_1 · l_1 + F_2 · l_2.' },
      { ask: 1, v: (p.F2 * p.l2) / p.l, msg: 'F_1 fehlt. Beide Zahnräder drehen um A. Rechne F_1 · l_1 + F_2 · l_2.' },
    ],
    tipps: () => [
      'Drehpunkt in A. Setze F_B in B an.',
      'F_B · l = F_1 · l_1 + F_2 · l_2',
      'F_A = F_1 + F_2 − F_B',
    ],
    loesung: (p) => {
      const FB = (p.F1 * p.l1 + p.F2 * p.l2) / p.l;
      return [
        'Drehpunkt in A. F_B in B ansetzen.',
        `Momentengleichgewicht: ${eq(f('F_B') + ' · ' + l('l') + ' = ' + f('F_1') + ' · ' + l('l_1') + ' + ' + f('F_2') + ' · ' + l('l_2'))}`,
        `${eq(f('F_B') + ' = (' + fmt(p.F1) + ' kN · ' + p.l1 + ' mm + ' + fmt(p.F2) + ' kN · ' + p.l2 + ' mm) : ' + p.l + ' mm = ' + f(fmt(FB, 3) + ' kN'))}`,
        `Kräftegleichgewicht: ${eq(f('F_A') + ' = ' + fmt(p.F1) + ' kN + ' + fmt(p.F2) + ' kN − ' + fmt(FB, 3) + ' kN = ' + f(fmt(p.F1 + p.F2 - FB, 3) + ' kN'))}`,
      ];
    },
  }),

  task({
    id: 'l6', karte: 'zwei', stufe: 1, familie: 'rechnen',
    title: 'Träger mit zwei Kräften', src: 'nach Buch Lagerkräfte, Nr. 2',
    gen: () => ({ F1: rng(3000, 8000, 500), F2: rng(2000, 6000, 500), l: pick([1000, 1200, 1500]), a: pick([200, 300, 400]), c: pick([200, 250, 300]) }),
    draw: (p) => B.traeger({ l: p.l, loads: [{ x: p.a, F: p.F1, lab: `F_1 = ${p.F1} N`, anc: true }, { x: p.l - p.c, F: p.F2, lab: `F_2 = ${p.F2} N` }] }, { segs: [`${p.a}`, '', `${p.c}`], tot: `l = ${p.l}` }),
    loesungsbild: (p) => {
      const FB = (p.F1 * p.a + p.F2 * (p.l - p.c)) / p.l;
      return B.traeger({ l: p.l, loads: [{ x: p.a, F: p.F1, lab: 'F_1', anc: true }, { x: p.l - p.c, F: p.F2, lab: 'F_2' }] }, { RA: `F_A = ${fmt(p.F1 + p.F2 - FB)} N`, RB: `F_B = ${fmt(FB)} N` });
    },
    text: (p) => `Ein Träger mit dem Lagerabstand ${l('l = ' + p.l + ' mm')} wird durch ${f('F_1 = ' + p.F1 + ' N')} (${l(p.a + ' mm')} von A) und ${f('F_2 = ' + p.F2 + ' N')} (${l(p.c + ' mm')} von B) belastet. Wie gross sind die Lagerkräfte F_A und F_B? Das Gewicht des Trägers zählt nicht.`,
    asks: (p) => {
      const FB = (p.F1 * p.a + p.F2 * (p.l - p.c)) / p.l;
      return [{ k: 'F_A', unit: 'N', v: p.F1 + p.F2 - FB }, { k: 'F_B', unit: 'N', v: FB }];
    },
    fehler: (p) => {
      const FBf = (p.F1 * p.a + p.F2 * p.c) / p.l;
      return [
        { ask: 0, v: p.F1 + p.F2 - FBf, msg: 'F_2 ist von B aus bemasst. Ihr Hebelarm um A ist l − c, nicht c.' },
        { ask: 1, v: FBf, msg: 'F_2 ist von B aus bemasst. Ihr Hebelarm um A ist l − c, nicht c.' },
      ];
    },
    tipps: (p) => [
      `Achtung: F_2 ist von B aus bemasst. Ihr Hebelarm um A ist l − ${p.c} mm = ${p.l - p.c} mm.`,
      `Drehpunkt in A: F_B · l = F_1 · ${p.a} mm + F_2 · ${p.l - p.c} mm`,
      'F_A = F_1 + F_2 − F_B',
    ],
    loesung: (p) => {
      const x2 = p.l - p.c, FB = (p.F1 * p.a + p.F2 * x2) / p.l;
      return [
        `Hebelarm von F_2 um A: ${eq(l(p.l + ' mm − ' + p.c + ' mm = ' + x2 + ' mm'))}`,
        `Momentengleichgewicht: ${eq(f('F_B') + ' · ' + l('l') + ' = ' + f('F_1') + ' · ' + l('l_1') + ' + ' + f('F_2') + ' · ' + l('l_2'))}`,
        `${eq(f('F_B') + ' = (' + p.F1 + ' N · ' + p.a + ' mm + ' + p.F2 + ' N · ' + x2 + ' mm) : ' + p.l + ' mm = ' + f(fmt(FB) + ' N'))}`,
        `Kräftegleichgewicht: ${eq(f('F_A') + ' = ' + p.F1 + ' N + ' + p.F2 + ' N − ' + fmt(FB) + ' N = ' + f(fmt(p.F1 + p.F2 - FB) + ' N'))}`,
      ];
    },
  }),

  task({
    id: 'l7', karte: 'zwei', stufe: 2, familie: 'rechnen',
    title: 'Welle mit zwei Kräften',
    gen: () => {
      const ll = pick([400, 500, 600, 800]);
      return { F1: rng(2, 8, 1), F2: rng(1, 6, 1), l: ll, l1: Math.round(pick([0.2, 0.25, 0.3]) * ll), l2: Math.round(pick([0.6, 0.7, 0.75]) * ll) };
    },
    draw: (p) => B.traeger({ l: p.l, loads: [{ x: p.l1, F: p.F1, lab: `F_1 = ${p.F1} kN` }, { x: p.l2, F: p.F2, lab: `F_2 = ${p.F2} kN` }] }, { segs: [`l_1 = ${p.l1}`, '', ''], ex: [p.l2, `l_2 = ${p.l2}`], tot: `l = ${p.l}` }),
    loesungsbild: (p) => {
      const FB = (p.F1 * p.l1 + p.F2 * p.l2) / p.l;
      return B.traeger({ l: p.l, loads: [{ x: p.l1, F: p.F1, lab: 'F_1' }, { x: p.l2, F: p.F2, lab: 'F_2' }] }, { RA: `F_A = ${fmt(p.F1 + p.F2 - FB)} kN`, RB: `F_B = ${fmt(FB)} kN` });
    },
    text: (p) => `Eine Welle ist in A und B gelagert. Der Lagerabstand ist ${l('l = ' + p.l + ' mm')}. Ein Zahnrad drückt mit ${f('F_1 = ' + p.F1 + ' kN')} im Abstand ${l('l_1 = ' + p.l1 + ' mm')} von A. Eine Riemenscheibe drückt mit ${f('F_2 = ' + p.F2 + ' kN')} im Abstand ${l('l_2 = ' + p.l2 + ' mm')} von A. Berechne F_A und F_B.`,
    asks: (p) => {
      const FB = (p.F1 * p.l1 + p.F2 * p.l2) / p.l;
      return [{ k: 'F_A', unit: 'kN', v: p.F1 + p.F2 - FB }, { k: 'F_B', unit: 'kN', v: FB }];
    },
    fehler: (p) => [
      { ask: 0, v: p.F1 + p.F2, msg: 'Das ist die Summe der Lasten. Davon trägt F_B noch einen Teil. Ziehe F_B ab.' },
      { ask: 1, v: (p.F1 * p.l1) / p.l, msg: 'F_2 fehlt. Beide Kräfte drehen um A. Rechne F_1 · l_1 + F_2 · l_2.' },
      { ask: 1, v: (p.F2 * p.l2) / p.l, msg: 'F_1 fehlt. Beide Kräfte drehen um A. Rechne F_1 · l_1 + F_2 · l_2.' },
    ],
    tipps: () => [
      'Drehpunkt in A. Beide Lasten drehen rechts herum. F_B dreht links herum.',
      'F_B · l = F_1 · l_1 + F_2 · l_2',
      'F_A = F_1 + F_2 − F_B',
    ],
    loesung: (p) => {
      const FB = (p.F1 * p.l1 + p.F2 * p.l2) / p.l;
      return [
        'Drehpunkt in A wählen.',
        `Momentengleichgewicht um A: ${eq(f('F_B') + ' · ' + l('l') + ' = ' + f('F_1') + ' · ' + l('l_1') + ' + ' + f('F_2') + ' · ' + l('l_2'))}`,
        `Einsetzen: ${eq(f('F_B') + ' = (' + p.F1 + ' kN · ' + p.l1 + ' mm + ' + p.F2 + ' kN · ' + p.l2 + ' mm) : ' + p.l + ' mm')}`,
        `${eq(f('F_B = ' + fmt(FB) + ' kN'))}`,
        `Kräftegleichgewicht: ${eq(f('F_A') + ' = ' + f('F_1') + ' + ' + f('F_2') + ' − ' + f('F_B') + ' = ' + f(fmt(p.F1 + p.F2 - FB) + ' kN'))}`,
        `Kontrolle: ${eq(f('F_A') + ' + ' + f('F_B') + ' = ' + fmt(p.F1 + p.F2) + ' kN')}. Das ist die Summe der Lasten.`,
      ];
    },
  }),

  task({
    id: 'l8', karte: 'zwei', stufe: 2, familie: 'rechnen',
    title: 'Werkbank auf zwei Böcken', src: 'eigene Variante zu Buch Nr. 2',
    gen: () => ({ F1: rng(300, 700, 50), F2: rng(150, 450, 50), l: pick([1600, 1800, 2000]), a: pick([300, 400, 500]), c: pick([300, 400, 500]) }),
    draw: (p) => B.traeger({ l: p.l, loads: [{ x: p.a, F: p.F1, lab: `F_1 = ${p.F1} N`, anc: true }, { x: p.l - p.c, F: p.F2, lab: `F_2 = ${p.F2} N` }] }, { segs: [`${p.a}`, '', `${p.c}`], tot: `l = ${p.l}` }),
    text: (p) => `Eine Werkbankplatte liegt auf zwei Böcken A und B (${l('l = ' + p.l + ' mm')}). Ein Schraubstock drückt mit ${f('F_1 = ' + p.F1 + ' N')} im Abstand ${l(p.a + ' mm')} von A. Ein Werkstück drückt mit ${f('F_2 = ' + p.F2 + ' N')} im Abstand ${l(p.c + ' mm')} von B. Wie gross sind F_A und F_B?`,
    asks: (p) => {
      const FB = (p.F1 * p.a + p.F2 * (p.l - p.c)) / p.l;
      return [{ k: 'F_A', unit: 'N', v: p.F1 + p.F2 - FB }, { k: 'F_B', unit: 'N', v: FB }];
    },
    fehler: (p) => {
      const FBf = (p.F1 * p.a + p.F2 * p.c) / p.l;
      return [
        { ask: 0, v: p.F1 + p.F2 - FBf, msg: 'F_2 ist von B aus bemasst. Ihr Hebelarm um A ist l − c, nicht c.' },
        { ask: 1, v: FBf, msg: 'F_2 ist von B aus bemasst. Ihr Hebelarm um A ist l − c, nicht c.' },
      ];
    },
    tipps: (p) => [
      `Wie bei Aufgabe l6: F_2 ist von B aus bemasst. Ihr Hebelarm um A ist l − ${p.c} mm.`,
      `F_B · l = F_1 · ${p.a} mm + F_2 · ${p.l - p.c} mm`,
      'F_A = F_1 + F_2 − F_B',
    ],
    loesung: (p) => {
      const x = p.l - p.c, FB = (p.F1 * p.a + p.F2 * x) / p.l;
      return [
        `Hebelarm F_2 um A: ${eq(p.l + ' − ' + p.c + ' = ' + x + ' mm')}`,
        `${eq(f('F_B') + ' = (' + p.F1 + ' · ' + p.a + ' + ' + p.F2 + ' · ' + x + ') N·mm : ' + p.l + ' mm = ' + f(fmt(FB) + ' N'))}`,
        `${eq(f('F_A') + ' = ' + p.F1 + ' + ' + p.F2 + ' − ' + fmt(FB) + ' = ' + f(fmt(p.F1 + p.F2 - FB) + ' N'))}`,
      ];
    },
  }),

  task({
    id: 'l9', karte: 'zwei', stufe: 2, familie: 'rechnen',
    title: 'Kranbahn mit Laufkatze',
    gen: () => {
      const ll = pick([4000, 5000, 6000, 8000]);
      return { m: rng(400, 1500, 100), l: ll, a: Math.round(pick([0.2, 0.25, 0.3, 0.4]) * ll) };
    },
    draw: (p) => B.traeger({ l: p.l, loads: [{ x: p.a, F: 1, lab: `m = ${p.m} kg`, box: true }] }, { segs: [`a = ${p.a}`, ''], tot: `l = ${p.l}` }),
    text: (p) => `Auf einer Kranbahn mit dem Lagerabstand ${l('l = ' + p.l + ' mm')} steht eine Laufkatze mit Last. Die Masse ist m = ${p.m} kg. Die Laufkatze steht ${l('a = ' + p.a + ' mm')} vom Lager A entfernt. Berechne a) die Gewichtskraft F_G, b) F_B und c) F_A. Rechne mit g = 9,81 m/s².`,
    asks: (p) => {
      const FG = p.m * 9.81;
      return [
        { k: 'a) F_G', unit: 'N', v: FG },
        { k: 'b) F_B', unit: 'N', v: (FG * p.a) / p.l },
        { k: 'c) F_A', unit: 'N', v: (FG * (p.l - p.a)) / p.l },
      ];
    },
    fehler: (p) => {
      const FG = p.m * 9.81;
      return [
        { ask: 0, v: p.m, msg: 'Das ist die Masse in kg. Die Gewichtskraft ist F_G = m · g.' },
        { ask: 1, v: (FG * (p.l - p.a)) / p.l, msg: 'Die Lager sind vertauscht. F_B · l = F_G · a.' },
        { ask: 2, v: (FG * p.a) / p.l, msg: 'Die Lager sind vertauscht. F_A = F_G − F_B.' },
      ];
    },
    tipps: () => [
      'Zuerst die Gewichtskraft: F_G = m · g.',
      'Dann wie bei einer Einzellast: Drehpunkt in A.',
      'F_B · l = F_G · a. Danach F_A = F_G − F_B.',
    ],
    loesung: (p) => {
      const FG = p.m * 9.81;
      return [
        `Gewichtskraft: ${eq(f('F_G') + ' = m · g = ' + p.m + ' kg · 9,81 m/s² = ' + f(fmt(FG) + ' N'))}`,
        `Momentengleichgewicht um A: ${eq(f('F_B') + ' · ' + l('l') + ' = ' + f('F_G') + ' · ' + l('a'))}`,
        `${eq(f('F_B') + ' = ' + fmt(FG) + ' N · ' + p.a + ' mm : ' + p.l + ' mm = ' + f(fmt((FG * p.a) / p.l) + ' N'))}`,
        `${eq(f('F_A') + ' = ' + f('F_G') + ' − ' + f('F_B') + ' = ' + f(fmt((FG * (p.l - p.a)) / p.l) + ' N'))}`,
        'Vorstellung: Fährt die Laufkatze zu A, steigt F_A. Steht sie genau über A, trägt A alles.',
      ];
    },
  }),

  task({
    id: 'l10', karte: 'zwei', stufe: 2, familie: 'rechnen',
    title: 'Spannpratze am Frästisch',
    gen: () => ({ F: rng(6, 12, 1), a: rng(25, 40, 5), b: rng(60, 90, 10) }),
    draw: (p) => B.pratze(p),
    loesungsbild: (p) => {
      const FS = (p.F * p.b) / (p.a + p.b);
      return B.pratze(p, { RA: `F_S = ${fmt(FS)} kN`, RB: `F_B = ${fmt(p.F - FS)} kN` });
    },
    text: (p) => `Eine Schraube zieht die Spannpratze mit ${f('F_Sch = ' + p.F + ' kN')} nach unten. Die Pratze liegt in A auf dem Werkstück und in B auf dem Stützklotz. Die Abstände sind ${l('a = ' + p.a + ' mm')} und ${l('b = ' + p.b + ' mm')}. Berechne a) die Spannkraft F_S auf das Werkstück und b) die Kraft F_B auf den Stützklotz.`,
    asks: (p) => [
      { k: 'a) F_S', unit: 'kN', v: (p.F * p.b) / (p.a + p.b) },
      { k: 'b) F_B', unit: 'kN', v: (p.F * p.a) / (p.a + p.b) },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.F * p.a) / (p.a + p.b), msg: 'a und b sind vertauscht. Die Schraube sitzt nahe am Werkstück. Darum geht der grössere Teil dorthin.' },
      { ask: 0, v: p.F, msg: 'Das ist die ganze Schraubenkraft. Ein Teil davon geht in den Stützklotz.' },
      { ask: 1, v: (p.F * p.b) / (p.a + p.b), msg: 'a und b sind vertauscht. Der Stützklotz ist weit weg von der Schraube und bekommt wenig.' },
    ],
    tipps: () => [
      'Die Pratze ist ein Träger auf zwei Lagern A und B. Die Schraube ist die Last.',
      'Drehpunkt in B: F_S · (a + b) = F_Sch · b',
      'F_B = F_Sch − F_S',
    ],
    loesung: (p) => {
      const FS = (p.F * p.b) / (p.a + p.b);
      return [
        `Die Pratze ist ein Träger auf zwei Lagern. Lagerabstand: ${eq(l('a + b = ' + (p.a + p.b) + ' mm'))}`,
        `Momentengleichgewicht um B: ${eq(f('F_S') + ' · (' + l('a') + ' + ' + l('b') + ') = ' + f('F_Sch') + ' · ' + l('b'))}`,
        `${eq(f('F_S') + ' = ' + p.F + ' kN · ' + p.b + ' mm : ' + (p.a + p.b) + ' mm = ' + f(fmt(FS) + ' kN'))}`,
        `${eq(f('F_B') + ' = ' + f('F_Sch') + ' − ' + f('F_S') + ' = ' + f(fmt(p.F - FS) + ' kN'))}`,
        'Vorstellung: Die Schraube sitzt nahe am Werkstück. Darum geht der grössere Teil der Kraft auf das Werkstück. Das will man beim Spannen.',
      ];
    },
  }),

  task({
    id: 'l11', karte: 'zwei', stufe: 3, familie: 'rechnen',
    title: 'Träger mit Eigengewicht und Last',
    gen: () => {
      const ll = pick([2000, 3000, 4000]);
      return { F: rng(3, 10, 1), FG: pick([0.8, 1, 1.2, 1.5, 2]), l: ll, a: Math.round(pick([0.2, 0.25, 0.3]) * ll) };
    },
    draw: (p) => B.traeger({ l: p.l, loads: [{ x: p.a, F: p.F, lab: `F = ${p.F} kN`, anc: true }, { x: p.l / 2, F: p.FG, lab: `F_G = ${fmt(p.FG)} kN` }] }, { segs: [`a = ${p.a}`, '', ''], ex: [p.l / 2, `l : 2 = ${p.l / 2}`], tot: `l = ${p.l}` }),
    text: (p) => `Ein Träger hat das Eigengewicht ${f('F_G = ' + fmt(p.FG) + ' kN')}. Es greift in der Trägermitte an. Zusätzlich wirkt ${f('F = ' + p.F + ' kN')} im Abstand ${l('a = ' + p.a + ' mm')} von A. Der Lagerabstand ist ${l('l = ' + p.l + ' mm')}. Berechne F_A und F_B.`,
    asks: (p) => {
      const FB = (p.F * p.a + (p.FG * p.l) / 2) / p.l;
      return [{ k: 'F_A', unit: 'kN', v: p.F + p.FG - FB }, { k: 'F_B', unit: 'kN', v: FB }];
    },
    fehler: (p) => [
      { ask: 0, v: p.F + p.FG, msg: 'Das ist die Summe der Lasten. Davon trägt F_B noch einen Teil. Ziehe F_B ab.' },
      { ask: 1, v: (p.F * p.a) / p.l, msg: 'Das Eigengewicht fehlt. Es greift in der Mitte an und dreht auch um A.' },
      { ask: 1, v: (p.F * p.a) / p.l + p.FG, msg: 'Das Eigengewicht hat nur den Hebelarm l : 2, nicht l. Es verteilt sich je zur Hälfte auf beide Lager.' },
    ],
    tipps: () => [
      'Das Eigengewicht ist eine zusätzliche Kraft in der Mitte, also bei l : 2.',
      'F_B · l = F · a + F_G · l : 2',
      'F_A = F + F_G − F_B',
    ],
    loesung: (p) => {
      const FB = (p.F * p.a + (p.FG * p.l) / 2) / p.l;
      return [
        `Das Eigengewicht greift im Schwerpunkt an: ${eq(l('l : 2 = ' + p.l / 2 + ' mm'))}`,
        `Momentengleichgewicht um A: ${eq(f('F_B') + ' · ' + l('l') + ' = ' + f('F') + ' · ' + l('a') + ' + ' + f('F_G') + ' · ' + l('l : 2'))}`,
        `${eq(f('F_B') + ' = (' + p.F + ' kN · ' + p.a + ' mm + ' + fmt(p.FG) + ' kN · ' + p.l / 2 + ' mm) : ' + p.l + ' mm = ' + f(fmt(FB) + ' kN'))}`,
        `${eq(f('F_A') + ' = ' + f('F') + ' + ' + f('F_G') + ' − ' + f('F_B') + ' = ' + f(fmt(p.F + p.FG - FB) + ' kN'))}`,
        `Kontrolle: Das Eigengewicht verteilt sich je zur Hälfte (${fmt(p.FG / 2)} kN) auf beide Lager.`,
      ];
    },
  }),

  task({
    id: 'l12', karte: 'zwei', stufe: 1, familie: 'schaetzen',
    title: 'Brett auf zwei Böcken: Kopfrechnen mit Anteilen',
    gen: () => ({ l: pick([2, 3, 4]), F1: pick([600, 800, 1000]), q: pick([[1, 4], [3, 4], [1, 5], [2, 5], [1, 3]]), F2: pick([100, 200, 300]) }),
    draw: (p) => {
      const t = p.q[0] / p.q[1];
      return B.traeger(
        { l: p.l, loads: [{ x: p.l * t, F: p.F1, lab: `F_1 = ${p.F1} N`, anc: t < 0.5 }, { x: p.l / 2, F: p.F2, lab: `F_2 = ${p.F2} N`, anc: t > 0.5 }] },
        { segs: t < 0.5 ? [`${p.q[0]}/${p.q[1]} · l`, '', ''] : ['', '', `${p.q[1] - p.q[0]}/${p.q[1]} · l`], tot: `l = ${p.l} m` },
      );
    },
    text: (p) => `Ein Maler (${f('F_1 = ' + p.F1 + ' N')}) steht auf einem Brett zwischen zwei Böcken A und B. Er steht bei ${p.q[0]}/${p.q[1]} der Länge, von A aus gemessen. Ein Farbeimer (${f('F_2 = ' + p.F2 + ' N')}) steht genau in der Mitte. Rechne ohne Taschenrechner, nur mit Anteilen: Wie viel tragen A und B?`,
    asks: (p) => {
      const FB = (p.F1 * p.q[0]) / p.q[1] + p.F2 / 2;
      return [{ k: 'F_A', unit: 'N', v: p.F1 + p.F2 - FB }, { k: 'F_B', unit: 'N', v: FB }];
    },
    fehler: (p) => {
      const FB = (p.F1 * p.q[0]) / p.q[1] + p.F2 / 2;
      return [
        { ask: 0, v: FB, msg: 'Die Lager sind vertauscht. Das Lager, das näher beim Maler liegt, trägt mehr.' },
        { ask: 1, v: p.F1 + p.F2 - FB, msg: 'Die Lager sind vertauscht. Das Lager, das näher beim Maler liegt, trägt mehr.' },
      ];
    },
    tipps: (p) => [
      'Faustregel: Das Lager B trägt den Anteil «Abstand von A geteilt durch l» jeder Last.',
      `Der Maler steht bei ${p.q[0]}/${p.q[1]}. Also trägt B ${p.q[0]}/${p.q[1]} von ${p.F1} N.`,
      'Der Eimer in der Mitte verteilt sich halb-halb.',
    ],
    loesung: (p) => {
      const t = p.q[0] / p.q[1], b1 = p.F1 * t, FB = b1 + p.F2 / 2;
      return [
        `Maler: B trägt ${p.q[0]}/${p.q[1]} · ${p.F1} N = ${fmt(b1)} N. A trägt den Rest: ${fmt(p.F1 - b1)} N.`,
        `Eimer in der Mitte: je ${fmt(p.F2 / 2)} N.`,
        `${eq(f('F_B') + ' = ' + fmt(b1) + ' + ' + fmt(p.F2 / 2) + ' = ' + f(fmt(FB) + ' N'))} und ${eq(f('F_A') + ' = ' + fmt(p.F1 - b1) + ' + ' + fmt(p.F2 / 2) + ' = ' + f(fmt(p.F1 + p.F2 - FB) + ' N'))}`,
        `Plausibel? Das Lager näher beim Maler muss mehr tragen. Die Summe muss ${p.F1 + p.F2} N ergeben.`,
        'Die Faustregel ist das Momentengleichgewicht in Kurzform: F_B · l = F · x, also F_B = F · (x : l).',
      ];
    },
  }),

  task({
    id: 'l13', karte: 'zwei', stufe: 1, familie: 'fehler',
    title: 'Fehler finden: Annas Lagerkraft',
    gen: () => {
      const ll = pick([1000, 1200, 1500, 2000]);
      return { F: rng(2, 10, 1), l: ll, a: Math.round(pick([0.2, 0.25, 0.3]) * ll) };
    },
    draw: (p) => B.traeger({ l: p.l, loads: [{ x: p.a, F: p.F, lab: `F = ${p.F} kN` }] }, { segs: [`a = ${p.a}`, `b = ${p.l - p.a}`], tot: `l = ${p.l}`, RA: 'F_A = ?', RB: 'F_B = ?' }),
    text: (p) => `Anna rechnet die Lagerkraft F_A: «F_A = F · a : l = ${p.F} kN · ${p.a} mm : ${p.l} mm = ${fmt((p.F * p.a) / p.l)} kN». Die Last steht viel näher bei A als bei B. Was ist falsch?`,
    asks: (p) => [{
      kind: 'choice', k: 'Fehler',
      opts: [
        `Anna hat F_A und F_B vertauscht. Richtig ist F_A = F · (l − a) : l = ${fmt((p.F * (p.l - p.a)) / p.l)} kN.`,
        'Sie muss durch a teilen, nicht durch l.',
        'Nichts. Das Lager nahe der Last trägt weniger.',
        'Sie muss das Ergebnis noch durch 2 teilen.',
      ],
      a: 0,
      why: [
        undefined,
        'Der Hebelarm der Lagerkraft ist der Lagerabstand l. Darum steht l im Nenner.',
        'Umgekehrt: Das Lager nahe der Last trägt mehr. Annas Wert ist kleiner als der von B.',
        'Halbieren gilt nur, wenn die Last in der Mitte steht.',
      ],
    }],
    tipps: () => [
      'Prüfe mit Gefühl: Welches Lager trägt mehr, wenn die Last nahe bei A steht?',
      'Das Lager nahe der Last trägt mehr. Annas F_A ist aber klein.',
      'Mit Drehpunkt in B: F_A · l = F · b. Der Hebelarm von F um B ist b.',
    ],
    loesung: (p) => [
      'Drehpunkt in B: Der Hebelarm der Last ist b = l − a.',
      `${eq(f('F_A') + ' · ' + l('l') + ' = ' + f('F') + ' · ' + l('b'))}`,
      `${eq(f('F_A') + ' = ' + p.F + ' kN · ' + (p.l - p.a) + ' mm : ' + p.l + ' mm = ' + f(fmt((p.F * (p.l - p.a)) / p.l) + ' kN'))}`,
      `Annas Wert ${fmt((p.F * p.a) / p.l)} kN gehört zu F_B. Darum der Merksatz: Die Hebelarme gehören zum anderen Lager.`,
    ],
  }),

  task({
    id: 'l14', karte: 'zwei', stufe: 2, familie: 'waswaere',
    title: 'Was wäre wenn: Last näher an Lager A',
    gen: () => {
      const ll = pick([1000, 1200, 1500]);
      return { F: rng(2, 10, 1), l: ll, a: Math.round(pick([0.4, 0.6, 0.8]) * ll) };
    },
    draw: (p) => B.traeger({ l: p.l, loads: [{ x: p.a / 2, F: p.F, lab: `F = ${p.F} kN` }] }, { segs: [`a = ${p.a / 2}`, `${p.l - p.a / 2}`], tot: `l = ${p.l}` }),
    text: (p) => `Ein Träger (${l('l = ' + p.l + ' mm')}) trägt ${f('F = ' + p.F + ' kN')} im Abstand ${l('a = ' + p.a + ' mm')} von A. Du schiebst die Last auf die Hälfte des Abstands, also auf ${l('a = ' + p.a / 2 + ' mm')} (Bild). a) Was passiert mit F_A? b) Wie gross ist F_A danach?`,
    asks: (p) => [
      { kind: 'choice', k: 'a) F_A wird', opts: ['grösser', 'gleich gross', 'kleiner'], a: 0, why: [undefined, 'Die Last wandert. Dann ändern sich die Lagerkräfte. Nur ihre Summe bleibt gleich.', 'Das Lager A liegt jetzt näher an der Last. Ein näheres Lager trägt mehr, nicht weniger.'] },
      { k: 'b) F_A neu', unit: 'kN', v: (p.F * (p.l - p.a / 2)) / p.l },
    ],
    fehler: (p) => [
      { ask: 1, v: (p.F * (p.l - p.a)) / p.l, msg: 'Das ist F_A vorher. Rechne mit dem neuen Abstand a : 2.' },
      { ask: 1, v: (p.F * p.a) / 2 / p.l, msg: 'Das ist F_B nach dem Verschieben. F_A = F − F_B.' },
    ],
    tipps: () => [
      'Die Last wandert zu A. Das Lager A trägt dann mehr.',
      'F_B · l = F · a_neu. Dann F_A = F − F_B.',
      'a_neu = a : 2',
    ],
    loesung: (p) => {
      const an = p.a / 2, FB = (p.F * an) / p.l;
      return [
        `Neuer Abstand: ${eq(l('a_neu = ' + p.a + ' mm : 2 = ' + an + ' mm'))}`,
        `${eq(f('F_B') + ' = ' + p.F + ' kN · ' + an + ' mm : ' + p.l + ' mm = ' + f(fmt(FB) + ' kN'))}`,
        `${eq(f('F_A') + ' = ' + p.F + ' kN − ' + fmt(FB) + ' kN = ' + f(fmt(p.F - FB) + ' kN'))}`,
        `Vorher waren es ${fmt((p.F * (p.l - p.a)) / p.l)} kN. Die Last wandert zu A, also steigt F_A. Die Summe bleibt ${p.F} kN.`,
      ];
    },
  }),

  task({
    id: 'l15', karte: 'zwei', stufe: 2, familie: 'umgekehrt',
    title: 'Umgekehrt: Wie schwer darf die Last sein?',
    gen: () => {
      const ll = pick([1000, 1200, 1500]);
      return { Fb: rng(3, 8, 1), l: ll, a: Math.round(pick([0.4, 0.6, 0.75]) * ll) };
    },
    draw: (p) => B.traeger({ l: p.l, loads: [{ x: p.a, F: 1, lab: 'F = ?' }] }, { segs: [`a = ${p.a}`, `${p.l - p.a}`], tot: `l = ${p.l}`, RB: `F_B ≤ ${p.Fb} kN` }),
    text: (p) => `Ein Träger (${l('l = ' + p.l + ' mm')}) liegt auf den Lagern A und B. Die Last F greift im Abstand ${l('a = ' + p.a + ' mm')} von A an. Das Lager B darf höchstens ${f('F_B = ' + p.Fb + ' kN')} tragen. a) Wie gross darf F höchstens sein? b) Wie gross ist dann F_A?`,
    asks: (p) => {
      const F = (p.Fb * p.l) / p.a;
      return [{ k: 'a) F max', unit: 'kN', v: F }, { k: 'b) F_A', unit: 'kN', v: F - p.Fb }];
    },
    fehler: (p) => {
      const F = (p.Fb * p.l) / p.a;
      return [
        { ask: 0, v: (p.Fb * p.a) / p.l, msg: 'Du hast mit dem Kehrwert gerechnet. F_B · l = F · a, also F = F_B · l : a.' },
        { ask: 0, v: p.Fb, msg: 'F_B ist nur ein Teil der Last. F ist grösser als F_B.' },
        { ask: 1, v: F, msg: 'Das ist die ganze Last. F_A = F − F_B.' },
      ];
    },
    tipps: () => [
      'Du kennst F_B und suchst F. Stelle die Formel F_B · l = F · a um.',
      'F = F_B · l : a',
      'F_A = F − F_B',
    ],
    loesung: (p) => {
      const F = (p.Fb * p.l) / p.a;
      return [
        `Momentengleichgewicht um A: ${eq(f('F_B') + ' · ' + l('l') + ' = ' + f('F') + ' · ' + l('a'))}`,
        `Umstellen: ${eq(f('F') + ' = ' + f('F_B') + ' · ' + l('l') + ' : ' + l('a') + ' = ' + p.Fb + ' kN · ' + p.l + ' mm : ' + p.a + ' mm = ' + f(fmt(F) + ' kN'))}`,
        `${eq(f('F_A') + ' = ' + f('F') + ' − ' + f('F_B') + ' = ' + fmt(F) + ' kN − ' + p.Fb + ' kN = ' + f(fmt(F - p.Fb) + ' kN'))}`,
        'Steht die Last näher an A, darf sie schwerer sein, denn B trägt dann weniger davon.',
      ];
    },
  }),
];
