// Aufgaben zum Kapitel Kräfte addieren (Resultierende).
import { task, type Task } from '../../../core/types';
import { eq, f, l, r } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import { kraefteplan, saeulen } from '../../../core/draw/svg';
import * as B from './bilder';

const rad = (a: number) => (a * Math.PI) / 180;
const deg = (x: number) => (x * 180) / Math.PI;

export const AUFGABEN: Task[] = [
  task({
    id: 'a1', karte: 'linie', stufe: 1, familie: 'rechnen',
    title: 'Zwei Kräfte in gleicher Richtung',
    gen: () => ({ F1: rng(150, 400, 10), F2: rng(100, 300, 10) }),
    draw: (p) => B.wagen([{ F: p.F1, dir: 1, lab: `F_1 = ${p.F1} N` }, { F: p.F2, dir: 1, lab: `F_2 = ${p.F2} N` }]),
    text: (p) => `Zwei Arbeiter ziehen einen Wagen in die gleiche Richtung. Sie ziehen mit ${f('F₁ = ' + p.F1 + ' N')} und ${f('F₂ = ' + p.F2 + ' N')}. Wie gross ist die resultierende Kraft F_r?`,
    asks: (p) => [{ k: 'F_r', unit: 'N', v: p.F1 + p.F2 }],
    fehler: (p) => [{ ask: 0, v: Math.abs(p.F1 - p.F2), msg: 'Die Kräfte zeigen in die gleiche Richtung. Sie unterstützen sich. Du musst addieren, nicht abziehen.' }],
    tipps: (p) => [
      'Die Kräfte liegen auf der gleichen Wirkungslinie und zeigen in die gleiche Richtung.',
      'Gleiche Richtung: Kräfte addieren.',
      `F_r = F₁ + F₂ = ${p.F1} N + ${p.F2} N`,
    ],
    loesung: (p) => [
      `Gleiche Richtung: ${eq(r('F_r') + ' = ' + f('F₁') + ' + ' + f('F₂'))}`,
      `Einsetzen: ${eq(r('F_r') + ' = ' + f(p.F1 + ' N') + ' + ' + f(p.F2 + ' N'))}`,
      `Resultat: ${eq(r('F_r = ' + (p.F1 + p.F2) + ' N'))} nach rechts`,
      'Zeichnerisch: Hänge den zweiten Pfeil an die Spitze des ersten. Die Resultierende reicht vom Anfang bis zur letzten Spitze.',
    ],
    loesungsbild: (p) => B.wagen([{ F: p.F1, dir: 1, lab: 'F_1' }, { F: p.F2, dir: 1, lab: 'F_2' }], { plan: true, R: `F_r = ${p.F1 + p.F2} N` }),
  }),

  task({
    id: 'a2', karte: 'linie', stufe: 1, familie: 'rechnen',
    title: 'Zwei Kräfte in entgegengesetzter Richtung',
    gen: () => {
      const F2 = rng(100, 300, 10);
      return { F1: F2 + rng(40, 250, 10), F2 };
    },
    draw: (p) => B.wagen([{ F: p.F1, dir: 1, lab: `F_1 = ${p.F1} N` }, { F: p.F2, dir: -1, lab: `F_2 = ${p.F2} N` }]),
    text: (p) => `An einem Wagen zieht ${f('F₁ = ' + p.F1 + ' N')} nach rechts und ${f('F₂ = ' + p.F2 + ' N')} nach links. Wie gross ist die resultierende Kraft F_r? In welche Richtung wirkt sie?`,
    asks: (p) => [
      { k: 'F_r', unit: 'N', v: p.F1 - p.F2 },
      { kind: 'choice', k: 'Richtung', opts: ['nach rechts', 'nach links'], a: 0, why: [undefined, 'Die grössere Kraft gewinnt. F₁ ist grösser als F₂ und zieht nach rechts.'] },
    ],
    fehler: (p) => [{ ask: 0, v: p.F1 + p.F2, msg: 'Die Kräfte zeigen gegeneinander. Sie heben sich teilweise auf. Du musst abziehen, nicht addieren.' }],
    tipps: () => [
      'Die Kräfte zeigen gegeneinander. Sie heben sich teilweise auf.',
      'Entgegengesetzte Richtung: kleinere Kraft von der grösseren abziehen.',
      'F_r = F₁ − F₂. Die Richtung der grösseren Kraft gewinnt.',
    ],
    loesung: (p) => [
      `Entgegengesetzte Richtung: ${eq(r('F_r') + ' = ' + f('F₁') + ' − ' + f('F₂'))}`,
      `Einsetzen: ${eq(r('F_r') + ' = ' + f(p.F1 + ' N') + ' − ' + f(p.F2 + ' N'))}`,
      `Resultat: ${eq(r('F_r = ' + (p.F1 - p.F2) + ' N'))}`,
      'Richtung: Die Resultierende zeigt in die Richtung der grösseren Kraft, hier nach rechts.',
    ],
    loesungsbild: (p) => B.wagen([{ F: p.F1, dir: 1, lab: 'F_1' }, { F: p.F2, dir: -1, lab: 'F_2' }], { plan: true, R: `F_r = ${p.F1 - p.F2} N` }),
  }),

  task({
    id: 'a3', karte: 'linie', stufe: 2, familie: 'rechnen',
    title: 'Drei Kräfte auf einer Wirkungslinie',
    gen: () => ({ F1: rng(200, 400, 10), F2: rng(150, 300, 10), F3: rng(80, 200, 10) }),
    draw: (p) => B.wagen([
      { F: p.F1, dir: 1, lab: `F_1 = ${p.F1} N` },
      { F: p.F2, dir: 1, lab: `F_2 = ${p.F2} N` },
      { F: p.F3, dir: -1, lab: `F_3 = ${p.F3} N` },
    ]),
    text: (p) => `Zwei Arbeiter schieben einen Wagen mit ${f('F₁ = ' + p.F1 + ' N')} und ${f('F₂ = ' + p.F2 + ' N')} nach rechts. Die Reibung bremst mit ${f('F₃ = ' + p.F3 + ' N')} nach links. Wie gross ist die resultierende Kraft F_r?`,
    asks: (p) => [{ k: 'F_r', unit: 'N', v: p.F1 + p.F2 - p.F3 }],
    fehler: (p) => [
      { ask: 0, v: p.F1 + p.F2 + p.F3, msg: 'Die Reibung zeigt nach links. Sie bremst und wird abgezogen, nicht addiert.' },
      { ask: 0, v: p.F1 + p.F2, msg: 'Du hast die Reibung vergessen. Alle Kräfte zählen.' },
    ],
    tipps: () => [
      'Lege eine positive Richtung fest: nach rechts ist plus.',
      'Kräfte nach rechts addieren, Kräfte nach links abziehen.',
      'F_r = F₁ + F₂ − F₃',
    ],
    loesung: (p) => [
      'Richtung festlegen: nach rechts positiv.',
      `Summe: ${eq(r('F_r') + ' = ' + f('F₁') + ' + ' + f('F₂') + ' − ' + f('F₃'))}`,
      `Einsetzen: ${eq(r('F_r') + ' = ' + p.F1 + ' N + ' + p.F2 + ' N − ' + p.F3 + ' N')}`,
      `Resultat: ${eq(r('F_r = ' + (p.F1 + p.F2 - p.F3) + ' N'))} nach rechts`,
    ],
    loesungsbild: (p) => B.wagen([{ F: p.F1, dir: 1, lab: 'F_1' }, { F: p.F2, dir: 1, lab: 'F_2' }, { F: p.F3, dir: -1, lab: 'F_3' }], { plan: true, R: `F_r = ${p.F1 + p.F2 - p.F3} N` }),
  }),

  task({
    id: 'a4', karte: 'linie', stufe: 2, familie: 'umgekehrt',
    title: 'Gleichgewicht: fehlende Kraft',
    gen: () => ({ F1: rng(200, 400, 10), F2: rng(100, 300, 10) }),
    draw: (p) => B.wagen([
      { F: p.F1, dir: 1, lab: `F_1 = ${p.F1} N` },
      { F: p.F2, dir: 1, lab: `F_2 = ${p.F2} N` },
      { F: p.F1 + p.F2, dir: -1, lab: 'F_3 = ?' },
    ]),
    text: (p) => `Ein Wagen soll in Ruhe bleiben. Nach rechts ziehen ${f('F₁ = ' + p.F1 + ' N')} und ${f('F₂ = ' + p.F2 + ' N')}. Wie gross muss die Haltekraft F₃ nach links sein?`,
    asks: (p) => [{ k: 'F₃', unit: 'N', v: p.F1 + p.F2 }],
    fehler: (p) => [{ ask: 0, v: Math.abs(p.F1 - p.F2), msg: 'F₁ und F₂ ziehen in die gleiche Richtung. Die Haltekraft muss ihre <b>Summe</b> aufheben, nicht die Differenz.' }],
    tipps: () => [
      'Ruhe bedeutet Gleichgewicht: Die resultierende Kraft ist null.',
      'F₁ + F₂ − F₃ = 0',
      'F₃ = F₁ + F₂',
    ],
    loesung: (p) => [
      `Gleichgewicht: ${eq(r('F_r') + ' = 0')}`,
      `Ansatz: ${eq(f('F₁') + ' + ' + f('F₂') + ' − ' + f('F₃') + ' = 0')}`,
      `Umstellen: ${eq(f('F₃') + ' = ' + f('F₁') + ' + ' + f('F₂') + ' = ' + p.F1 + ' N + ' + p.F2 + ' N')}`,
      `Resultat: ${eq(f('F₃ = ' + (p.F1 + p.F2) + ' N'))}`,
      'Zeichnerisch: Der Kräfteplan schliesst sich. Die letzte Spitze trifft wieder den Anfang.',
    ],
    loesungsbild: (p) => B.wagen([{ F: p.F1, dir: 1, lab: 'F_1' }, { F: p.F2, dir: 1, lab: 'F_2' }, { F: p.F1 + p.F2, dir: -1, lab: 'F_3' }], { plan: true, R: 'F_r = 0' }),
  }),

  task({
    id: 'a5', karte: 'rechtwinklig', stufe: 2, familie: 'rechnen',
    title: 'Zwei Kräfte im rechten Winkel',
    gen: () => {
      let F1 = 0, F2 = 0;
      do {
        F1 = rng(200, 500, 20);
        F2 = rng(120, 400, 20);
      } while (F1 === F2);
      return { F1, F2 };
    },
    draw: (p) => B.rechtwinklig(p, 0),
    text: (p) => `An einem Punkt greifen zwei Kräfte rechtwinklig zueinander an: ${f('F₁ = ' + p.F1 + ' N')} waagrecht und ${f('F₂ = ' + p.F2 + ' N')} senkrecht. Berechne a) die resultierende Kraft F_r und b) den Winkel α zwischen F_r und F₁.`,
    asks: (p) => [
      { k: 'a) F_r', unit: 'N', v: Math.hypot(p.F1, p.F2) },
      { k: 'b) α', unit: '°', v: deg(Math.atan2(p.F2, p.F1)) },
    ],
    fehler: (p) => [
      { ask: 0, v: p.F1 + p.F2, msg: 'Rechtwinklige Kräfte darfst du nicht einfach addieren. Die Resultierende ist die Diagonale des Rechtecks: Pythagoras.' },
      { ask: 1, v: deg(Math.atan2(p.F1, p.F2)), msg: 'Gegenkathete und Ankathete sind vertauscht. Es gilt tan α = F₂ : F₁.' },
    ],
    tipps: () => [
      'Hier darf man nicht einfach addieren. Die Kräfte haben verschiedene Richtungen.',
      'Die Kräfte bilden ein Rechteck. Die Resultierende ist die Diagonale. Pythagoras: F_r² = F₁² + F₂²',
      'Winkel: tan α = F₂ : F₁',
    ],
    loesung: (p) => {
      const R = Math.hypot(p.F1, p.F2), a = deg(Math.atan2(p.F2, p.F1));
      return [
        'Kräfteparallelogramm: Die Resultierende ist die Diagonale des Rechtecks.',
        `Pythagoras: ${eq(r('F_r') + ' = √(' + f('F₁') + '² + ' + f('F₂') + '²)')}`,
        `Einsetzen: ${eq(r('F_r') + ' = √((' + p.F1 + ' N)² + (' + p.F2 + ' N)²)')}`,
        `Resultat: ${eq(r('F_r = ' + fmt(R) + ' N'))}`,
        `Winkel: ${eq('tan α = ' + f('F₂') + ' : ' + f('F₁') + ' = ' + p.F2 + ' : ' + p.F1 + ' = ' + fmt(p.F2 / p.F1, 3))}, also ${eq('α = ' + fmt(a, 1) + '°')}`,
        `Kontrolle: F_r ist grösser als jede Einzelkraft, aber kleiner als die Summe ${p.F1 + p.F2} N.`,
      ];
    },
    loesungsbild: (p) => B.rechtwinklig(p, 2),
  }),

  task({
    id: 'a6', karte: 'plan', stufe: 1, familie: 'rechnen',
    title: 'Spannzylinder mit Rückholfeder',
    src: 'Buch Kräfte, Beispiel',
    gen: () => ({ F1: pick([240, 320, 400, 500]), F2: pick([60, 80, 100]), Mk: pick([5, 8, 10]) }),
    draw: (p) => B.spannzylinder(p),
    text: (p) => `Am Kolben eines Spannzylinders wirkt ${f('F₁ = ' + p.F1 + ' N')}. Die Rückholfeder ist mit ${f('F₂ = ' + p.F2 + ' N')} gespannt und wirkt dagegen. a) Wie lang werden die Pfeile bei einem Kräftemassstab von M_k = ${p.Mk} N/mm? b) Welche Spannkraft F_r wirkt auf das Werkstück?`,
    asks: (p) => [
      { k: 'a) l₁', unit: 'mm', v: p.F1 / p.Mk },
      { k: 'a) l₂', unit: 'mm', v: p.F2 / p.Mk },
      { k: 'b) F_r', unit: 'N', v: p.F1 - p.F2 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.F1 * p.Mk, msg: 'Der Massstab sagt, wie viele Newton auf 1 mm kommen. Länge = Kraft <b>geteilt durch</b> M_k.' },
      { ask: 2, v: p.F1 + p.F2, msg: 'Die Feder wirkt gegen den Kolben. Du musst F₂ von F₁ abziehen.' },
    ],
    tipps: () => [
      'Pfeillänge l = F : M_k. Die Kräfte liegen auf einer Wirkungslinie und zeigen gegeneinander.',
      'Teile jede Kraft durch M_k. Für F_r ziehst du die kleinere Kraft von der grösseren ab.',
      'l₁ = F₁ : M_k, l₂ = F₂ : M_k, F_r = F₁ − F₂',
    ],
    loesung: (p) => [
      `a) ${eq(l('l₁') + ' = ' + p.F1 + ' : ' + p.Mk + ' = ' + l(fmt(p.F1 / p.Mk) + ' mm'))}, ${eq(l('l₂') + ' = ' + p.F2 + ' : ' + p.Mk + ' = ' + l(fmt(p.F2 / p.Mk) + ' mm'))}`,
      `b) ${eq(r('F_r') + ' = ' + p.F1 + ' − ' + p.F2 + ' = ' + r((p.F1 - p.F2) + ' N'))}`,
      'Grafisch: Pfeil l₂ an die Spitze von l₁ setzen, aber rückwärts. Die Resultierende reicht von A bis E.',
    ],
    loesungsbild: (p) => kraefteplan([{ F: p.F1, a: 180, lab: 'F_1' }, { F: p.F2, a: 0, lab: 'F_2' }], { R: `F_r = ${p.F1 - p.F2} N`, h: 200, Mk: p.Mk }),
  }),

  task({
    id: 'a7', karte: 'rechtwinklig', stufe: 3, familie: 'rechnen',
    title: 'Freileitungsmast',
    src: 'Buch Kräfte, Nr. 1',
    gen: () => ({ F1: pick([600, 800, 1000]), F2: pick([900, 1200, 1500]), a1: 50 }),
    draw: (p) => B.mast(p),
    text: (p) => `Zwei waagrechte Drähte ziehen am Mast mit ${f('F₁ = ' + p.F1 + ' N')} und ${f('F₂ = ' + p.F2 + ' N')}. Sie stehen rechtwinklig zueinander. a) Wie gross ist die Resultierende F_r? b) Welchen Winkel bildet F_r mit F₁? c) In welche Richtung muss ein Spannseil wirken, damit der Mast sich nicht biegt? Gib den Winkel zu F₁ an, gemessen auf der anderen Seite.`,
    asks: (p) => {
      const a = deg(Math.atan2(p.F2, p.F1));
      return [
        { k: 'a) F_r', unit: 'N', v: Math.hypot(p.F1, p.F2) },
        { k: 'b) Winkel F_r zu F₁', unit: '°', v: a },
        { k: 'c) Winkel Seil zu F₁', unit: '°', v: 180 - a },
      ];
    },
    fehler: (p) => {
      const a = deg(Math.atan2(p.F2, p.F1));
      return [
        { ask: 0, v: p.F1 + p.F2, msg: 'Rechtwinklige Kräfte addiert man nicht einfach. Nimm Pythagoras.' },
        { ask: 1, v: deg(Math.atan2(p.F1, p.F2)), msg: 'Der Winkel liegt zwischen F_r und F₁. Es gilt tan φ = F₂ : F₁, nicht umgekehrt.' },
        { ask: 2, v: a, msg: 'Das ist der Winkel von F_r selbst. Das Spannseil zieht <b>entgegen</b> F_r: 180° − φ.' },
      ];
    },
    tipps: () => [
      'Rechtwinklig: Pythagoras, F_r = √(F₁² + F₂²).',
      'Winkel: tan φ = F₂ : F₁',
      'Das Spannseil zieht genau entgegen F_r: 180° − φ.',
    ],
    loesung: (p) => {
      const R = Math.hypot(p.F1, p.F2), a = deg(Math.atan2(p.F2, p.F1));
      return [
        `a) ${eq(r('F_r') + ' = √(' + p.F1 + '² + ' + p.F2 + '²) = ' + r(fmt(R) + ' N'))}`,
        `b) ${eq('tan φ = ' + p.F2 + ' : ' + p.F1 + ' ⇒ φ = ' + fmt(a, 1) + '°')}`,
        `c) Das Spannseil zieht entgegen F_r: ${eq('180° − ' + fmt(a, 1) + '° = ' + fmt(180 - a, 1) + '°')} zu F₁.`,
      ];
    },
    loesungsbild: (p) => B.mast(p, { res: true }),
  }),

  task({
    id: 'a8', karte: 'winkel', stufe: 2, familie: 'rechnen',
    title: 'Seilrolle: Kraft auf die Achse',
    src: 'Buch Kräfte, Nr. 2',
    gen: () => ({ FG: pick([1000, 1500, 2000]), al: pick([30, 45, 60]) }),
    draw: (p) => B.seilrolle(p),
    text: (p) => `Eine Last ${f('F_G = ' + p.FG + ' N')} wird über eine Seilrolle hochgezogen. Das Zugseil verläuft um ${p.al}° zur Senkrechten geneigt. Wie gross ist die Resultierende F_r auf die Achse?`,
    asks: (p) => [
      { k: 'Winkel zwischen den Seilkräften', unit: '°', v: 180 - p.al },
      { k: 'F_r', unit: 'N', v: 2 * p.FG * Math.cos(rad((180 - p.al) / 2)) },
    ],
    fehler: (p) => [
      { ask: 0, v: p.al, msg: `Die ${p.al}° sind der Winkel zur Senkrechten. Gefragt ist der Winkel zwischen den beiden Kräften an der Rolle: 180° − ${p.al}°.` },
      { ask: 1, v: 2 * p.FG, msg: '2 · F_G gilt nur, wenn beide Stränge senkrecht nach unten ziehen. Bei schrägem Seil ist F_r kleiner.' },
    ],
    tipps: (p) => [
      'Beide Seilstränge ziehen mit F_G an der Rolle: einer nach unten, einer schräg nach oben.',
      `Winkel zwischen den beiden Kräften: 180° − ${p.al}°.`,
      'Gleich grosse Kräfte: F_r = 2 · F · cos(Winkel : 2).',
    ],
    loesung: (p) => {
      const g2 = 180 - p.al, R = 2 * p.FG * Math.cos(rad(g2 / 2));
      return [
        `Beide Stränge ziehen mit ${p.FG} N. Winkel zwischen ihnen: ${eq('180° − ' + p.al + '° = ' + g2 + '°')}`,
        `${eq(r('F_r') + ' = 2 · ' + p.FG + ' · cos ' + fmt(g2 / 2, 1) + '° = ' + r(fmt(R) + ' N'))}`,
        'Zieht man senkrecht nach unten (0°), wäre F_r = 2 · F_G. Je schräger, desto kleiner.',
      ];
    },
    loesungsbild: (p) => kraefteplan([{ F: p.FG, a: -90, lab: 'F_G' }, { F: p.FG, a: 90 + p.al, lab: 'F' }], { R: `F_r = ${fmt(2 * p.FG * Math.cos(rad((180 - p.al) / 2)))} N`, h: 300 }),
  }),

  task({
    id: 'a9', karte: 'winkel', stufe: 2, familie: 'rechnen',
    title: 'Hubseil: zulässige Last je nach Winkel',
    src: 'Buch Kräfte, Nr. 4',
    gen: () => ({ F: pick([8, 10, 12.5]) }),
    draw: (p) => B.hubseil({ F: p.F, al: 60 }),
    text: (p) => `Ein Hubseil mit der Tragkraft ${f('F = ' + fmt(p.F) + ' kN')} je Strang hebt Behälter mit zwei Strängen. Wie gross ist die zulässige Gewichtskraft F_G bei den Lastzugwinkeln α = 30°, 60°, 90° und 120°?`,
    asks: (p) => [30, 60, 90, 120].map((a) => ({ k: 'F_G bei ' + a + '°', unit: 'kN', v: 2 * p.F * Math.cos(rad(a / 2)) })),
    fehler: (p) => [
      { ask: 1, v: 2 * p.F * Math.cos(rad(60)), msg: 'Du hast cos α genommen. Jeder Strang ist nur um α : 2 zur Senkrechten geneigt: cos(α : 2).' },
      { ask: 2, v: 2 * p.F, msg: '2 · F gilt nur bei senkrechten Strängen. Bei 90° trägt nur der senkrechte Anteil jedes Strangs.' },
    ],
    tipps: () => [
      'Jeder Strang ist um α : 2 zur Senkrechten geneigt.',
      'Senkrechter Anteil je Strang: F · cos(α : 2).',
      'Zwei Stränge: F_G = 2 · F · cos(α : 2)',
    ],
    loesung: (p) => [
      ...[30, 60, 90, 120].map((a) => `α = ${a}°: ${eq(f('F_G') + ' = 2 · ' + fmt(p.F) + ' · cos ' + a / 2 + '° = ' + f(fmt(2 * p.F * Math.cos(rad(a / 2)), 2) + ' kN'))}`),
      'Bei 120° trägt das Seil nur noch so viel wie ein einzelner Strang.',
      'Warnung: Bei grossem Lastzugwinkel steigt die Seilkraft stark. Das Seil kann reissen und die Last fallen. Halte α möglichst unter 90°.',
    ],
    loesungsbild: (p) => saeulen('Zulässige Last F_G (Anteil von 2 · F)', [30, 60, 90, 120].map((a) => ({ v: Math.cos(rad(a / 2)), t: `α = ${a}°: ${fmt(2 * p.F * Math.cos(rad(a / 2)), 2)} kN` }))),
  }),

  task({
    id: 'a10', karte: 'winkel', stufe: 2, familie: 'rechnen',
    title: 'Zwei Personen ziehen eine Kiste',
    gen: () => ({ F1: pick([200, 300, 400]), F2: pick([250, 350, 450]), g2: pick([40, 60, 80]) }),
    draw: (p) => B.zweiPersonen(p),
    text: (p) => `Zwei Personen ziehen eine Kiste mit ${f('F₁ = ' + p.F1 + ' N')} und ${f('F₂ = ' + p.F2 + ' N')}. Die Seile bilden einen Winkel von ${p.g2}°. Wie gross ist die Resultierende F_r?`,
    asks: (p) => [{ k: 'F_r', unit: 'N', v: Math.sqrt(p.F1 ** 2 + p.F2 ** 2 + 2 * p.F1 * p.F2 * Math.cos(rad(p.g2))) }],
    fehler: (p) => [
      { ask: 0, v: p.F1 + p.F2, msg: 'Die Seile stehen schräg. Ein Teil der Kräfte hebt sich seitlich auf. F_r ist kleiner als die Summe.' },
      { ask: 0, v: Math.hypot(p.F1, p.F2), msg: 'Pythagoras gilt nur bei 90°. Hier ist der Winkel kleiner, die Resultierende also grösser.' },
    ],
    tipps: (p) => [
      'Beide Kräfte ziehen schräg. Einfach addieren geht nicht.',
      `Zerlege jede Kraft in x und y: F_x = F · cos(±${p.g2 / 2}°), F_y = F · sin(±${p.g2 / 2}°).`,
      'F_r = √(ΣF_x² + ΣF_y²)',
    ],
    loesung: (p) => {
      const h = rad(p.g2 / 2), X = (p.F1 + p.F2) * Math.cos(h), Y = (p.F1 - p.F2) * Math.sin(h);
      return [
        `${eq('ΣF_x = (' + p.F1 + ' + ' + p.F2 + ') · cos ' + p.g2 / 2 + '° = ' + fmt(X) + ' N')}`,
        `${eq('ΣF_y = (' + p.F1 + ' − ' + p.F2 + ') · sin ' + p.g2 / 2 + '° = ' + fmt(Y) + ' N')}`,
        `${eq(r('F_r') + ' = √(' + fmt(X) + '² + ' + fmt(Y) + '²) = ' + r(fmt(Math.hypot(X, Y)) + ' N'))}`,
        `Weniger als ${p.F1 + p.F2} N: Ein Teil der Kräfte hebt sich seitlich auf.`,
      ];
    },
    loesungsbild: (p) => kraefteplan([{ F: p.F1, a: p.g2 / 2, lab: 'F_1' }, { F: p.F2, a: -p.g2 / 2, lab: 'F_2' }], { R: `F_r = ${fmt(Math.sqrt(p.F1 ** 2 + p.F2 ** 2 + 2 * p.F1 * p.F2 * Math.cos(rad(p.g2))))} N` }),
  }),

  task({
    id: 'a11', karte: 'winkel', stufe: 3, familie: 'umgekehrt',
    title: 'Hubseil: Wie gross darf α sein?',
    gen: () => ({ F: pick([10, 12.5, 16]), FG: pick([12, 15, 18]), al: 80 }),
    draw: (p) => B.hubseil(p, { FG: `F_G = ${p.FG} kN`, F: `F_max = ${fmt(p.F)} kN` }),
    text: (p) => `Ein Behälter mit ${f('F_G = ' + p.FG + ' kN')} soll mit zwei Seilsträngen gehoben werden. Jeder Strang trägt höchstens ${f(fmt(p.F) + ' kN')}. Wie gross darf der Lastzugwinkel α höchstens sein?`,
    asks: (p) => [{ k: 'α_max', unit: '°', v: 2 * deg(Math.acos(p.FG / (2 * p.F))) }],
    fehler: (p) => [{ ask: 0, v: deg(Math.acos(p.FG / (2 * p.F))), msg: 'Das ist erst der halbe Winkel α : 2. Der Lastzugwinkel α ist doppelt so gross.' }],
    tipps: () => [
      'Wie bei der Aufgabe zuvor, nur rückwärts: F_G = 2 · F · cos(α : 2).',
      'cos(α : 2) = F_G : (2 · F)',
      'Mit der Umkehrfunktion cos⁻¹ den halben Winkel bestimmen, dann mal 2.',
    ],
    loesung: (p) => {
      const c = p.FG / (2 * p.F);
      return [
        `${eq('cos(α : 2) = ' + p.FG + ' : (2 · ' + fmt(p.F) + ') = ' + fmt(c, 3))}`,
        `${eq('α : 2 = ' + fmt(deg(Math.acos(c)), 1) + '°')} ⇒ ${eq('α_max = ' + fmt(2 * deg(Math.acos(c)), 1) + '°')}`,
        'Umgekehrt gefragt: Die Kräfte sind bekannt, der Winkel ist gesucht.',
      ];
    },
  }),

  task({
    id: 'a12', karte: 'rechtwinklig', stufe: 1, familie: 'schaetzen',
    title: '3-4-5 im Kopf',
    gen: () => {
      const k = pick([10, 20, 50, 100]);
      return { F1: 3 * k, F2: 4 * k };
    },
    draw: (p) => B.rechtwinklig(p, 0),
    text: (p) => `Ohne Taschenrechner: Zwei rechtwinklige Kräfte ${f('F₁ = ' + p.F1 + ' N')} und ${f('F₂ = ' + p.F2 + ' N')}. Wie gross ist die Resultierende F_r?`,
    asks: (p) => [{ k: 'F_r', unit: 'N', v: Math.hypot(p.F1, p.F2) }],
    fehler: (p) => [{ ask: 0, v: p.F1 + p.F2, msg: 'Addieren geht nur auf einer Linie. Hier stehen die Kräfte im rechten Winkel: 3-4-5.' }],
    tipps: () => [
      'Das Verhältnis ist 3 : 4.',
      '3-4-5-Dreieck: Die Hypotenuse ist 5 Teile.',
      'Ein Teil ist F₁ : 3.',
    ],
    loesung: (p) => [
      `${eq(p.F1 + ' : ' + p.F2 + ' = 3 : 4')} ⇒ ${eq(r('F_r') + ' = 5 · ' + p.F1 / 3 + ' = ' + r(Math.hypot(p.F1, p.F2) + ' N'))}`,
      'Merke das 3-4-5-Dreieck. Es kommt an Prüfungen oft vor.',
    ],
  }),

  // ---------- neue Familien ----------

  task({
    id: 'a13', karte: 'rechtwinklig', stufe: 1, familie: 'fehler',
    title: 'Fehler finden: Toms Resultierende',
    gen: () => ({ F1: pick([200, 300, 400]), F2: pick([250, 350, 450]) }),
    draw: (p) => B.rechtwinklig(p, 0),
    text: (p) => `Tom rechnet die Resultierende zweier rechtwinkliger Kräfte: «F_r = ${p.F1} N + ${p.F2} N = ${p.F1 + p.F2} N». Was ist falsch?`,
    asks: (p) => [{
      kind: 'choice', k: 'Fehler',
      opts: [
        `Rechtwinklige Kräfte addiert man nicht. Richtig ist F_r = √(F₁² + F₂²) = ${fmt(Math.hypot(p.F1, p.F2))} N.`,
        'Er hätte F₂ von F₁ abziehen müssen.',
        'Er hätte die Summe durch 2 teilen müssen.',
        'Nichts, die Rechnung stimmt.',
      ],
      a: 0,
      why: [
        undefined,
        'Abziehen gilt nur bei entgegengesetzter Richtung. Hier stehen die Kräfte im rechten Winkel.',
        'Eine Hälfte gibt es hier nicht. Die Diagonale ist kürzer als die Summe, aber länger als jede Einzelkraft.',
        `Die Resultierende ist die Diagonale des Rechtecks. Sie ist kürzer als ${p.F1 + p.F2} N.`,
      ],
    }],
    tipps: () => ['Zeichne die beiden Kräfte als Rechteck. Wo liegt die Resultierende?', 'Die Diagonale ist kürzer als die beiden Seiten zusammen.', 'Pythagoras: F_r = √(F₁² + F₂²)'],
    loesung: (p) => [
      'Toms Rechnung stimmt nur, wenn beide Kräfte in die gleiche Richtung zeigen.',
      `Bei 90° gilt Pythagoras: ${eq(r('F_r') + ' = √(' + p.F1 + '² + ' + p.F2 + '²) = ' + r(fmt(Math.hypot(p.F1, p.F2)) + ' N'))}`,
      'Kontrolle: Die Diagonale eines Rechtecks ist immer kürzer als die beiden Seiten zusammen.',
    ],
    loesungsbild: (p) => B.rechtwinklig(p, 2),
  }),

  task({
    id: 'a14', karte: 'winkel', stufe: 2, familie: 'schaetzen',
    title: 'Schätzen: Zwei gleich starke Kräfte bei 120°',
    gen: () => ({ F: pick([100, 200, 300, 400]) }),
    draw: (p) => B.zweiPersonen({ F1: p.F, F2: p.F, g2: 120 }),
    text: (p) => `Zwei Personen ziehen mit je ${f('F = ' + p.F + ' N')} an einer Kiste. Die Seile bilden einen Winkel von 120°. Ohne Taschenrechner: Wie gross ist F_r ungefähr?`,
    asks: (p) => [{
      kind: 'choice', k: 'F_r etwa',
      opts: [`${fmt(p.F / 2, 0)} N`, `${fmt(p.F, 0)} N`, `${fmt(p.F * 2, 0)} N`],
      a: 1,
      why: ['Zu klein. Bei 120° heben sich die Kräfte nicht so stark auf.', undefined, `Das gäbe es nur bei 0°, wenn beide in die gleiche Richtung ziehen. Bei 120° ist es weniger als ${fmt(p.F * 2, 0)} N.`],
    }],
    tipps: () => ['Gleich grosse Kräfte: F_r = 2 · F · cos(Winkel : 2).', 'Winkel : 2 = 60°. Es gilt cos 60° = 0,5.', '2 · 0,5 = 1. Also F_r = F.'],
    loesung: (p) => [
      `${eq(r('F_r') + ' = 2 · ' + p.F + ' N · cos 60° = 2 · ' + p.F + ' N · 0,5 = ' + r(p.F + ' N'))}`,
      'Merke: Bei 120° zwischen zwei gleich grossen Kräften ist die Resultierende so gross wie jede einzelne.',
    ],
    loesungsbild: (p) => kraefteplan([{ F: p.F, a: 60, lab: 'F_1' }, { F: p.F, a: -60, lab: 'F_2' }], { R: `F_r = ${p.F} N` }),
  }),

  task({
    id: 'a15', karte: 'rechtwinklig', stufe: 2, familie: 'umgekehrt',
    title: 'Umgekehrt: Wie gross darf die zweite Kraft sein?',
    gen: () => {
      const [F1, F2, Fr] = pick([[300, 400, 500], [600, 800, 1000], [500, 1200, 1300], [800, 600, 1000]]);
      return { F1, F2, Fr };
    },
    draw: (p) => B.rechtwinklig(p, 0, true),
    text: (p) => `Ein Bauteil darf höchstens mit ${r('F_r = ' + p.Fr + ' N')} belastet werden. Es wird bereits waagrecht mit ${f('F₁ = ' + p.F1 + ' N')} gezogen. Senkrecht dazu kommt F₂. Wie gross darf F₂ höchstens sein?`,
    asks: (p) => [{ k: 'F₂', unit: 'N', v: Math.sqrt(p.Fr ** 2 - p.F1 ** 2) }],
    fehler: (p) => [
      { ask: 0, v: p.Fr - p.F1, msg: 'Rechtwinklige Kräfte rechnet man nicht mit Plus und Minus. Stelle Pythagoras um: F₂² = F_r² − F₁².' },
      { ask: 0, v: Math.sqrt(p.Fr ** 2 + p.F1 ** 2), msg: 'Du hast addiert. Die Resultierende ist die Hypotenuse, sie ist die längste Seite. F₂² = F_r² − F₁².' },
    ],
    tipps: () => ['Die Resultierende ist die Diagonale. F₁ und F₂ sind die Seiten.', 'F_r² = F₁² + F₂². Stelle nach F₂ um.', 'F₂ = √(F_r² − F₁²)'],
    loesung: (p) => [
      `Pythagoras umstellen: ${eq(f('F₂') + ' = √(' + r('F_r') + '² − ' + f('F₁') + '²)')}`,
      `Einsetzen: ${eq(f('F₂') + ' = √(' + p.Fr + '² − ' + p.F1 + '²)')}`,
      `Resultat: ${eq(f('F₂ = ' + fmt(Math.sqrt(p.Fr ** 2 - p.F1 ** 2)) + ' N'))}`,
      'Umgekehrt gefragt: Die Resultierende ist bekannt, eine Seite ist gesucht.',
    ],
    loesungsbild: (p) => B.rechtwinklig(p, 2),
  }),

  task({
    id: 'a16', karte: 'winkel', stufe: 2, familie: 'fehler',
    title: 'Fehler finden: Bens Hubseil',
    gen: () => ({ F: pick([8, 10, 12.5]), al: pick([60, 90, 120]) }),
    draw: (p) => B.hubseil(p),
    text: (p) => `Ben prüft ein Hubseil: «Jeder Strang trägt ${fmt(p.F)} kN. Bei α = ${p.al}° trägt das Seil also F_G = 2 · ${fmt(p.F)} kN = ${fmt(2 * p.F)} kN.» Was ist falsch?`,
    asks: (p) => [{
      kind: 'choice', k: 'Fehler',
      opts: [
        `Die Stränge stehen schräg. Nur der senkrechte Anteil trägt: F_G = 2 · F · cos(α : 2) = ${fmt(2 * p.F * Math.cos(rad(p.al / 2)), 1)} kN.`,
        `Er hätte nicht verdoppeln dürfen: F_G = ${fmt(p.F)} kN.`,
        'Er hätte durch 2 teilen müssen.',
        'Nichts, die Rechnung stimmt.',
      ],
      a: 0,
      why: [
        undefined,
        'Zwei Stränge tragen mehr als einer. Nur bei 120° trägt das Seil gleich viel wie ein Strang.',
        'Zwei Stränge teilen sich die Last. Das Seil trägt mehr als ein Strang, nicht weniger.',
        'Das gilt nur, wenn die Stränge senkrecht hängen (0°). Je grösser der Winkel, desto weniger trägt das Seil.',
      ],
    }],
    tipps: () => ['Wie hängen die Stränge? Senkrecht oder schräg?', 'Bei schrägen Strängen trägt nur der senkrechte Anteil.', 'F_G = 2 · F · cos(α : 2)'],
    loesung: (p) => [
      `Bens Rechnung gilt nur bei senkrechten Strängen (α = 0°). Bei ${p.al}° zählt der senkrechte Anteil.`,
      `${eq(f('F_G') + ' = 2 · ' + fmt(p.F) + ' · cos ' + p.al / 2 + '° = ' + f(fmt(2 * p.F * Math.cos(rad(p.al / 2)), 1) + ' kN'))}`,
      'Warnung: Wer mit 2 · F rechnet, überlastet das Seil. Es kann reissen und die Last fallen.',
    ],
  }),

  task({
    id: 'a17', karte: 'plan', stufe: 2, familie: 'umgekehrt',
    title: 'Massstab wählen',
    gen: () => {
      const Mk = pick([5, 8, 10, 20]);
      return { Mk, l1: pick([40, 60, 80]), l2: pick([30, 50, 70]) };
    },
    draw: (p) => kraefteplan([{ F: p.Mk * p.l1, a: 0, lab: `F_1 = ${p.Mk * p.l1} N` }, { F: p.Mk * p.l2, a: 90, lab: `F_2 = ${p.Mk * p.l2} N` }], { R: 'F_r' }),
    text: (p) => `Du zeichnest einen Kräfteplan. Die Kraft ${f('F₁ = ' + p.Mk * p.l1 + ' N')} soll ${l('l₁ = ' + p.l1 + ' mm')} lang werden. a) Welchen Kräftemassstab M_k brauchst du? b) Wie lang wird dann der Pfeil für ${f('F₂ = ' + p.Mk * p.l2 + ' N')}?`,
    asks: (p) => [
      { k: 'a) M_k', unit: 'N/mm', v: p.Mk },
      { k: 'b) l₂', unit: 'mm', v: p.l2 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.l1 / (p.Mk * p.l1), msg: 'Das ist Länge : Kraft. Der Massstab ist Kraft : Länge (N pro mm).' },
      { ask: 1, v: p.Mk * p.l2 * p.Mk, msg: 'Die Länge ist Kraft <b>geteilt durch</b> M_k, nicht mal M_k.' },
    ],
    tipps: () => ['Der Kräftemassstab sagt, wie viele Newton auf 1 mm kommen.', 'M_k = F : l. Mit demselben M_k rechnest du die zweite Länge.', 'l₂ = F₂ : M_k'],
    loesung: (p) => [
      `a) ${eq('M_k = ' + f('F₁') + ' : ' + l('l₁') + ' = ' + p.Mk * p.l1 + ' N : ' + p.l1 + ' mm = ' + p.Mk + ' N/mm')}`,
      `b) ${eq(l('l₂') + ' = ' + f('F₂') + ' : M_k = ' + p.Mk * p.l2 + ' N : ' + p.Mk + ' N/mm = ' + l(p.l2 + ' mm'))}`,
      'Der Massstab gilt für alle Pfeile im selben Plan.',
    ],
  }),
];

