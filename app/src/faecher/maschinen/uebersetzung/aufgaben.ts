// Aufgaben zum Kapitel Zahnräder: Übersetzung (Stirnräder, ein- und mehrstufig).
// i = z_2 : z_1 = n_1 : n_2 = d_2 : d_1. Mehrstufig: i_ges = i_1 · i_2 · … Drehmoment: M_2 = M_1 · i · η.
import { task, type ChoiceAsk, type Task } from '../../../core/types';
import { eq, l, m, v } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import * as B from './bilder';

const MOTOR = [710, 940, 1440, 1450, 2850, 2900] as const;
const MODUL = [1, 1.5, 2, 2.5, 3, 4] as const;
const PI = Math.PI;
const rpm = (x: number) => fmt(x) + ' /min';

/** Reihenfolge der Antworten mischen. Die richtige Antwort steht in der Eingabe an erster Stelle. */
function mischen(opts: string[], why: (string | undefined)[]): { opts: string[]; a: number; why: (string | undefined)[] } {
  const idx = opts.map((_, i) => i).sort(() => Math.random() - 0.5);
  return { opts: idx.map((i) => opts[i]), a: idx.indexOf(0), why: idx.map((i) => why[i]) };
}
const auswahl = (k: string, x: { opts: string[]; a: number; why: (string | undefined)[] }): ChoiceAsk => ({ kind: 'choice', k, ...x });

const DREH = ['im Uhrzeigersinn', 'gegen den Uhrzeigersinn'];
const sinn = (cw: boolean) => (cw ? DREH[0] : DREH[1]);

const F = {
  i: eq('i = z_2 : z_1 = ' + v('n_1 : n_2')),
  n2: eq(v('n_2') + ' = ' + v('n_1') + ' : i'),
  ig: eq('i_ges = i_1 · i_2'),
  M: eq(m('M_2') + ' = ' + m('M_1') + ' · i · η'),
};

const LISTE: Task[] = [
  // ---------- Einstufig: i, Drehzahl, Zähnezahl ----------

  task({
    id: 'u1', karte: 'einstufig', stufe: 1, familie: 'rechnen',
    title: 'Übersetzung und Drehzahl',
    gen: () => { const z1 = rng(14, 30, 1); return { z1, z2: z1 + rng(10, 60, 1), n1: pick(MOTOR) }; },
    draw: (p) => B.reihe({ zs: [p.z1, p.z2], cw: true, unten: [rpm(p.n1), 'n_2 = ?'], frage: [1] }),
    text: (p) => `Das treibende Rad hat z_1 = ${p.z1} Zähne und dreht mit ${v('n_1 = ' + rpm(p.n1))}. Das getriebene Rad hat z_2 = ${p.z2} Zähne. Berechne a) die Übersetzung i und b) die Drehzahl n_2.`,
    asks: (p) => [
      { k: 'a) i', unit: '', v: p.z2 / p.z1 },
      { k: 'b) n_2', unit: '1/min', v: (p.n1 * p.z1) / p.z2 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.z1 / p.z2, msg: 'Verkehrt herum. i = z_2 : z_1, das getriebene Rad steht oben.' },
      { ask: 1, v: (p.n1 * p.z2) / p.z1, msg: 'Das grosse Rad dreht langsamer. Teile durch i: n_2 = n_1 : i.' },
    ],
    tipps: (p) => [
      'Treibend = Index 1, getrieben = Index 2. Das grössere Rad dreht langsamer.',
      `i = z_2 : z_1 = ${p.z2} : ${p.z1}`,
      `n_2 = n_1 : i = ${fmt(p.n1)} /min : ${fmt(p.z2 / p.z1)}`,
    ],
    loesung: (p) => [
      `Formel: ${F.i}`,
      `a) ${eq('i = ' + p.z2 + ' : ' + p.z1 + ' = ' + fmt(p.z2 / p.z1))}`,
      `b) ${eq(v('n_2') + ' = ' + v(rpm(p.n1)) + ' : ' + fmt(p.z2 / p.z1) + ' = ' + v(rpm((p.n1 * p.z1) / p.z2)))}`,
      'Kontrolle: i > 1, also ins Langsame. n_2 ist kleiner als n_1.',
    ],
  }),

  task({
    id: 'u2', karte: 'einstufig', stufe: 2, familie: 'umgekehrt',
    title: 'Zähnezahl für eine gewünschte Drehzahl',
    gen: () => { const z1 = rng(16, 30, 2), i = pick([1.5, 2, 2.5, 3, 4]), n1 = pick(MOTOR); return { z1, i, n1, n2: n1 / i }; },
    draw: (p) => B.reihe({ zs: [p.z1, p.z1 * p.i], cw: false, oben: [`z_1 = ${p.z1}`, 'z_2 = ?'], unten: [rpm(p.n1), rpm(p.n2)] }),
    text: (p) => `Ein Motor dreht mit ${v('n_1 = ' + rpm(p.n1))}. Sein Ritzel hat z_1 = ${p.z1} Zähne. Die Arbeitswelle soll mit ${v('n_2 = ' + rpm(p.n2))} drehen. Wie viele Zähne braucht das Rad auf der Arbeitswelle?`,
    asks: (p) => [{ k: 'z_2', unit: '', v: p.z1 * p.i }],
    fehler: (p) => [
      { ask: 0, v: p.z1 / p.i, msg: 'Zu klein. Die Arbeitswelle dreht langsamer, also braucht sie das grössere Rad: z_2 = z_1 · n_1 : n_2.' },
    ],
    tipps: (p) => [
      'Zähne und Drehzahlen stehen umgekehrt im Verhältnis: z_2 : z_1 = n_1 : n_2.',
      `Zuerst i = n_1 : n_2 = ${fmt(p.n1)} : ${fmt(p.n2)}`,
      'Dann z_2 = i · z_1. Das Resultat muss eine ganze Zahl sein.',
    ],
    loesung: (p) => [
      `${eq('i = ' + v('n_1 : n_2') + ' = ' + fmt(p.n1) + ' : ' + fmt(p.n2) + ' = ' + fmt(p.i))}`,
      `${eq('z_2 = i · z_1 = ' + fmt(p.i) + ' · ' + p.z1 + ' = ' + fmt(p.z1 * p.i))}`,
    ],
  }),

  task({
    id: 'u3', karte: 'einstufig', stufe: 2, familie: 'rechnen',
    title: 'Umfangsgeschwindigkeit am Teilkreis',
    gen: () => ({ m: pick(MODUL), z1: rng(15, 30, 1), z2: rng(40, 90, 1), n1: pick(MOTOR) }),
    draw: (p) => B.reihe({ zs: [p.z1, p.z2], cw: true, oben: [`z_1 = ${p.z1}`, `z_2 = ${p.z2}`], unten: [rpm(p.n1), ''] }),
    text: (p) => `Ein Radpaar hat den Modul ${l('m = ' + fmt(p.m) + ' mm')}. Das Ritzel (z_1 = ${p.z1}) dreht mit ${v('n_1 = ' + rpm(p.n1))}, das Rad hat z_2 = ${p.z2}. a) Wie gross ist die Umfangsgeschwindigkeit v am Teilkreis in m/s? b) Wie gross ist n_2?`,
    asks: (p) => [
      { k: 'a) v', unit: 'm/s', v: (PI * p.m * p.z1 * p.n1) / 60000 },
      { k: 'b) n_2', unit: '1/min', v: (p.n1 * p.z1) / p.z2 },
    ],
    fehler: (p) => {
      const vv = (PI * p.m * p.z1 * p.n1) / 60000;
      return [
        { ask: 0, v: vv * 60, msg: 'Das ist m/min. Für m/s noch durch 60 teilen.' },
        { ask: 0, v: vv * 1000, msg: 'd ist in mm. Zuerst in m umrechnen (durch 1000).' },
        { ask: 0, v: (PI * p.m * p.z2 * p.n1) / 60000, msg: 'Du hast d_2 mit n_1 kombiniert. Nimm d und n vom gleichen Rad.' },
      ];
    },
    tipps: (p) => [
      'Beide Teilkreise rollen aufeinander ab. Sie haben die gleiche Umfangsgeschwindigkeit.',
      `d_1 = m · z_1 = ${fmt(p.m * p.z1)} mm = ${fmt(p.m * p.z1 / 1000, 3)} m`,
      'v = π · d_1 · n_1, dann von m/min durch 60 in m/s.',
    ],
    loesung: (p) => {
      const d1 = (p.m * p.z1) / 1000;
      return [
        `${eq(l('d_1') + ' = m · z_1 = ' + fmt(p.m) + ' mm · ' + p.z1 + ' = ' + l(fmt(d1 * 1000) + ' mm'))}`,
        `a) ${eq(v('v') + ' = π · ' + l('d_1') + ' · ' + v('n_1') + ' = π · ' + fmt(d1, 3) + ' m · ' + fmt(p.n1) + ' /min = ' + fmt(PI * d1 * p.n1) + ' m/min = ' + v(fmt((PI * d1 * p.n1) / 60) + ' m/s'))}`,
        `b) ${eq(v('n_2') + ' = ' + v('n_1') + ' · z_1 : z_2 = ' + v(rpm((p.n1 * p.z1) / p.z2)))}`,
        'Kontrolle: v = π · d_2 · n_2 gibt denselben Wert.',
      ];
    },
  }),

  task({
    id: 'u4', karte: 'einstufig', stufe: 1, familie: 'waswaere',
    title: 'Was wäre, wenn das Ritzel doppelt so viele Zähne hätte?',
    gen: () => {
      const z1 = rng(14, 24, 1);
      return {
        z1, z2: rng(50, 80, 1),
        w: mischen(
          ['n_2 wird doppelt so gross.', 'n_2 wird halb so gross.', 'n_2 bleibt gleich.', 'n_2 wird viermal so gross.'],
          [undefined, 'Mehr Zähne am Ritzel heisst: i = z_2 : z_1 wird kleiner. Dann dreht das Rad schneller.', 'Die Übersetzung ändert sich, also auch n_2.', 'n_2 ist proportional zu z_1. Doppelt z_1 gibt doppelt n_2, nicht viermal.'],
        ),
      };
    },
    draw: (p) => B.reihe({ zs: [p.z1, p.z2], cw: true, oben: [`z_1 = ${p.z1} → ${2 * p.z1}`, `z_2 = ${p.z2}`], nurErster: true }),
    text: (p) => `Ein Ritzel mit ${p.z1} Zähnen treibt ein Rad mit ${p.z2} Zähnen. Der Motor dreht gleich schnell weiter. Das Ritzel wird durch eines mit ${2 * p.z1} Zähnen ersetzt (das Rad bleibt, der Achsabstand wird angepasst). Was passiert mit der Drehzahl n_2?`,
    asks: (p) => [auswahl('Aussage', p.w)],
    tipps: () => ['n_2 = n_1 · z_1 : z_2', 'Was passiert mit dem Bruch, wenn z_1 doppelt so gross wird?', 'n_1 und z_2 bleiben gleich.'],
    loesung: (p) => [
      `Vorher: ${eq('i = ' + p.z2 + ' : ' + p.z1 + ' = ' + fmt(p.z2 / p.z1))}. Nachher: ${eq('i = ' + p.z2 + ' : ' + 2 * p.z1 + ' = ' + fmt(p.z2 / (2 * p.z1)))}.`,
      'Die Übersetzung halbiert sich. Darum dreht das Rad doppelt so schnell.',
    ],
  }),

  task({
    id: 'u5', karte: 'einstufig', stufe: 2, familie: 'begruenden',
    title: 'Ins Langsame oder ins Schnelle?',
    gen: () => {
      const z2 = rng(15, 25, 1), z1 = z2 + rng(15, 40, 1);
      return {
        z1, z2,
        w: mischen(
          ['Ins Schnelle: n_2 grösser, M_2 kleiner als am Antrieb.', 'Ins Langsame: n_2 kleiner, M_2 grösser als am Antrieb.', 'Ins Schnelle: n_2 grösser, M_2 grösser als am Antrieb.', 'Weder noch: n_2 und M_2 bleiben gleich.'],
          [undefined, 'Hier treibt das grosse Rad das kleine. i = z_2 : z_1 ist kleiner als 1.', 'Mehr Drehzahl und mehr Drehmoment zugleich gibt es nicht. Die Leistung bleibt (fast) gleich.', 'Bei verschiedenen Zähnezahlen ändern sich n und M immer.'],
        ),
      };
    },
    draw: (p) => B.reihe({ zs: [p.z1, p.z2], cw: false, oben: [`z_1 = ${p.z1} (treibt)`, `z_2 = ${p.z2}`], nurErster: true }),
    text: (p) => `Das treibende Rad hat ${p.z1} Zähne, das getriebene Rad ${p.z2} Zähne. Die Übersetzung ist ${eq('i = ' + p.z2 + ' : ' + p.z1 + ' = ' + fmt(p.z2 / p.z1))}. Was stimmt?`,
    asks: (p) => [auswahl('Aussage', p.w)],
    tipps: () => ['i > 1 heisst ins Langsame, i < 1 heisst ins Schnelle.', 'Die Leistung P = M · ω bleibt (ohne Verluste) gleich.', 'Steigt die Drehzahl, muss das Drehmoment sinken.'],
    loesung: (p) => [
      `${eq('i = ' + fmt(p.z2 / p.z1))} < 1: Übersetzung ins Schnelle.`,
      `${eq(v('n_2') + ' = ' + v('n_1') + ' : i')} wird grösser, ${eq(m('M_2') + ' = ' + m('M_1') + ' · i · η')} wird kleiner.`,
    ],
  }),

  task({
    id: 'u6', karte: 'einstufig', stufe: 1, familie: 'schaetzen',
    title: 'Kopfrechnen: Drehzahl am Rad',
    gen: () => {
      const n1 = pick([1500, 3000, 1200, 900]), k = pick([2, 3, 4, 5, 6]), z1 = pick([12, 15, 18, 20]);
      const r = n1 / k;
      return {
        n1, k, z1,
        w: mischen(
          [`etwa ${fmt(r)} /min`, `etwa ${fmt(n1 * k)} /min`, `etwa ${fmt(r / k)} /min`, `etwa ${fmt(n1 - k * 100)} /min`],
          [undefined, 'Das grosse Rad dreht langsamer, nicht schneller.', 'Du hast zweimal durch i geteilt.', 'Übersetzungen werden geteilt, nicht abgezogen.'],
        ),
      };
    },
    draw: (p) => B.reihe({ zs: [p.z1, p.z1 * p.k], cw: true, unten: [rpm(p.n1), 'n_2 ≈ ?'], frage: [1] }),
    text: (p) => `Ohne Rechner: Ein Ritzel mit ${p.z1} Zähnen dreht mit ${v(rpm(p.n1))}. Es treibt ein Rad mit ${p.z1 * p.k} Zähnen. Wie schnell dreht das Rad ungefähr?`,
    asks: (p) => [auswahl('Schätzung', p.w)],
    tipps: (p) => ['Wie oft passt z_1 in z_2?', `${p.z1 * p.k} : ${p.z1} = ${p.k}`, `Teile ${p.n1} durch ${p.k}.`],
    loesung: (p) => [`${eq('i = ' + p.z1 * p.k + ' : ' + p.z1 + ' = ' + p.k)}`, `${eq(v('n_2') + ' = ' + p.n1 + ' : ' + p.k + ' = ' + v(rpm(p.n1 / p.k)))}`],
  }),

  task({
    id: 'u7', karte: 'einstufig', stufe: 3, familie: 'kette',
    title: 'Radpaar aus Achsabstand und Übersetzung',
    gen: () => { const mm = pick(MODUL), z1 = rng(16, 30, 2), i = pick([1.5, 2, 2.5, 3]); return { mm, z1, i, z2: z1 * i, a: (mm * (z1 + z1 * i)) / 2 }; },
    draw: (p) => B.reihe({ zs: [p.z1, p.z2], cw: true, oben: ['z_1 = ?', 'z_2 = ?'], nurErster: true }),
    text: (p) => `Zwei Wellen haben den Achsabstand ${l('a = ' + fmt(p.a) + ' mm')}. Sie sollen mit Zahnrädern vom Modul ${l('m = ' + fmt(p.mm) + ' mm')} und der Übersetzung i = ${fmt(p.i)} verbunden werden. Wie viele Zähne haben a) das Ritzel z_1 und b) das Rad z_2?`,
    asks: (p) => [
      { k: 'a) z_1', unit: '', v: p.z1 },
      { k: 'b) z_2', unit: '', v: p.z2 },
    ],
    fehler: (p) => [
      { ask: 0, v: (2 * p.a) / p.mm, msg: 'Das ist z_1 + z_2 zusammen. Teile noch durch (1 + i).' },
      { ask: 0, v: (2 * p.a) / (p.mm * p.i), msg: 'Im Nenner steht 1 + i, nicht nur i. z_1 + z_2 = z_1 · (1 + i).' },
      { ask: 0, v: p.a / (p.mm * (1 + p.i)), msg: 'Der Faktor 2 fehlt: a = m · (z_1 + z_2) : 2.' },
    ],
    tipps: (p) => [
      'Achsabstand: a = m · (z_1 + z_2) : 2. Übersetzung: z_2 = i · z_1.',
      `Zuerst z_1 + z_2 = 2 · a : m = ${fmt((2 * p.a) / p.mm)}`,
      `z_1 + i · z_1 = z_1 · (1 + i), also z_1 = ${fmt((2 * p.a) / p.mm)} : ${fmt(1 + p.i)}`,
    ],
    loesung: (p) => [
      `${eq('z_1 + z_2 = 2 · ' + l('a') + ' : m = 2 · ' + fmt(p.a) + ' : ' + fmt(p.mm) + ' = ' + fmt(p.z1 + p.z2))}`,
      `${eq('z_1 · (1 + i) = ' + fmt(p.z1 + p.z2))} → ${eq('z_1 = ' + fmt(p.z1 + p.z2) + ' : ' + fmt(1 + p.i) + ' = ' + p.z1)}`,
      `${eq('z_2 = i · z_1 = ' + fmt(p.i) + ' · ' + p.z1 + ' = ' + p.z2)}`,
      `Probe: ${eq(fmt(p.mm) + ' · (' + p.z1 + ' + ' + p.z2 + ') : 2 = ' + fmt(p.a) + ' mm')}`,
    ],
  }),

  // ---------- Drehsinn und Zwischenrad ----------

  task({
    id: 'u8', karte: 'drehsinn', stufe: 1, familie: 'bild',
    title: 'In welche Richtung dreht das Rad?',
    gen: () => ({ z1: rng(14, 26, 1), z2: rng(28, 50, 1), cw: Math.random() < 0.5 }),
    draw: (p) => B.reihe({ zs: [p.z1, p.z2], cw: p.cw, frage: [1] }),
    text: (p) => `Rad 1 dreht ${sinn(p.cw)} (Pfeil). In welche Richtung dreht Rad 2?`,
    asks: (p) => [{
      kind: 'choice', k: 'Rad 2 dreht',
      opts: [DREH[0], DREH[1]],
      a: p.cw ? 1 : 0,
      why: p.cw ? ['Aussenverzahnte Räder drehen immer gegeneinander.', undefined] : [undefined, 'Aussenverzahnte Räder drehen immer gegeneinander.'],
    }],
    tipps: () => ['Schau auf die Stelle, wo die Zähne ineinandergreifen.', 'Dort bewegen sich beide Zähne in dieselbe Richtung.', 'Darum drehen zwei aussenverzahnte Räder gegensinnig.'],
    loesung: (p) => [`Rad 2 dreht ${sinn(!p.cw)}.`, 'Regel: Jedes weitere Rad in der Reihe kehrt den Drehsinn um.'],
  }),

  task({
    id: 'u9', karte: 'drehsinn', stufe: 2, familie: 'rechnen',
    title: 'Zwischenrad',
    gen: () => ({ z1: rng(15, 28, 1), zz: rng(18, 40, 1), z3: rng(35, 70, 1), n1: pick(MOTOR), cw: Math.random() < 0.5 }),
    draw: (p) => B.reihe({ zs: [p.z1, p.zz, p.z3], cw: p.cw, oben: [`z_1 = ${p.z1}`, `z_Z = ${p.zz}`, `z_3 = ${p.z3}`], unten: [rpm(p.n1), '', 'n_3 = ?'], frage: [1, 2] }),
    text: (p) => `Rad 1 (z_1 = ${p.z1}, ${v('n_1 = ' + rpm(p.n1))}) treibt über ein Zwischenrad (z_Z = ${p.zz}) das Rad 3 (z_3 = ${p.z3}). Berechne a) die Übersetzung i von Rad 1 zu Rad 3, b) die Drehzahl n_3. c) Rad 1 dreht ${sinn(p.cw)}. Wie dreht Rad 3?`,
    asks: (p) => [
      { k: 'a) i', unit: '', v: p.z3 / p.z1 },
      { k: 'b) n_3', unit: '1/min', v: (p.n1 * p.z1) / p.z3 },
      { kind: 'choice', k: 'c) Rad 3 dreht', opts: [DREH[0], DREH[1]], a: p.cw ? 0 : 1, why: p.cw ? [undefined, 'Zwei Wechsel (1→Z, Z→3) heben sich auf. Rad 3 dreht wie Rad 1.'] : ['Zwei Wechsel (1→Z, Z→3) heben sich auf. Rad 3 dreht wie Rad 1.', undefined] },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.zz / p.z1) * p.z3, msg: 'Die Zähnezahl des Zwischenrades kürzt sich weg: i = (z_Z : z_1) · (z_3 : z_Z) = z_3 : z_1.' },
      { ask: 0, v: p.zz / p.z1, msg: 'Das ist nur die Übersetzung bis zum Zwischenrad. Gefragt ist bis Rad 3.' },
      { ask: 1, v: (p.n1 * p.z1) / p.zz, msg: 'Das ist die Drehzahl des Zwischenrades. Rad 3 hat n_3 = n_1 · z_1 : z_3.' },
    ],
    tipps: (p) => [
      'Ein Zwischenrad ändert nur den Drehsinn, nicht die Übersetzung.',
      `i = (z_Z : z_1) · (z_3 : z_Z). z_Z kürzt sich weg: i = z_3 : z_1 = ${p.z3} : ${p.z1}`,
      'n_3 = n_1 : i. Drehsinn: Jedes Rad in der Reihe kehrt ihn um.',
    ],
    loesung: (p) => [
      `a) ${eq('i = (z_Z : z_1) · (z_3 : z_Z) = z_3 : z_1 = ' + p.z3 + ' : ' + p.z1 + ' = ' + fmt(p.z3 / p.z1))}`,
      `b) ${eq(v('n_3') + ' = ' + v(rpm(p.n1)) + ' : ' + fmt(p.z3 / p.z1) + ' = ' + v(rpm((p.n1 * p.z1) / p.z3)))}`,
      `c) Rad 1 ${sinn(p.cw)}, Zwischenrad ${sinn(!p.cw)}, Rad 3 ${sinn(p.cw)}.`,
    ],
  }),

  task({
    id: 'u10', karte: 'drehsinn', stufe: 1, familie: 'begruenden',
    title: 'Wozu ein Zwischenrad?',
    gen: () => ({
      z: [rng(15, 24, 1), rng(16, 30, 1), rng(30, 50, 1)],
      w: mischen(
        ['Es kehrt den Drehsinn um, die Übersetzung bleibt gleich.', 'Es vergrössert die Übersetzung um z_Z : z_1.', 'Es verkleinert die Übersetzung um z_1 : z_Z.', 'Es ändert weder Drehsinn noch Übersetzung.'],
        [undefined, 'z_Z steht einmal im Zähler und einmal im Nenner. Es kürzt sich weg.', 'z_Z kürzt sich weg. Die Übersetzung bleibt z_3 : z_1.', 'Der Drehsinn ändert sich: Mit Zwischenrad dreht Rad 3 wie Rad 1.'],
      ),
    }),
    draw: (p) => B.reihe({ zs: p.z, cw: true, oben: ['Rad 1', 'Zwischenrad', 'Rad 3'] }),
    text: () => 'Zwischen zwei Zahnrädern sitzt ein drittes Rad, ein Zwischenrad. Was bewirkt es?',
    asks: (p) => [auswahl('Aussage', p.w)],
    tipps: () => ['Schreibe die Gesamtübersetzung als Produkt der zwei Paare.', 'i = (z_Z : z_1) · (z_3 : z_Z)', 'Was passiert mit z_Z? Und wie oft wechselt der Drehsinn?'],
    loesung: () => [
      `${eq('i = (z_Z : z_1) · (z_3 : z_Z) = z_3 : z_1')}. Das Zwischenrad kürzt sich weg.`,
      'Der Drehsinn wechselt zweimal. Rad 3 dreht wie Rad 1. Ohne Zwischenrad würde es gegensinnig drehen.',
      'Nebenbei überbrückt ein Zwischenrad einen grösseren Achsabstand.',
    ],
  }),

  task({
    id: 'u11', karte: 'drehsinn', stufe: 2, familie: 'bild',
    title: 'Räderzug: Drehsinn und Drehzahl am letzten Rad',
    gen: () => {
      const anz = pick([3, 4]);
      const zs = Array.from({ length: anz }, (_, i) => (i === 0 ? rng(14, 22, 1) : rng(16, 34, 1)));
      return { zs, n1: pick(MOTOR), cw: Math.random() < 0.5 };
    },
    draw: (p) => B.reihe({ zs: p.zs, cw: p.cw, frage: [p.zs.length - 1], nurErster: true, unten: [rpm(p.n1)] }),
    text: (p) => `Im Bild greifen ${p.zs.length} Räder ineinander. Rad 1 dreht ${sinn(p.cw)} mit ${v('n_1 = ' + rpm(p.n1))}. a) Wie dreht das letzte Rad? b) Mit welcher Drehzahl dreht es?`,
    asks: (p) => {
      const gleich = p.zs.length % 2 === 1;
      const richtig = gleich ? p.cw : !p.cw;
      return [
        { kind: 'choice', k: 'a) Letztes Rad dreht', opts: [DREH[0], DREH[1]], a: richtig ? 0 : 1, why: richtig ? [undefined, 'Zähle die Wechsel: Jedes Paar kehrt den Drehsinn um.'] : ['Zähle die Wechsel: Jedes Paar kehrt den Drehsinn um.', undefined] },
        { k: `b) n_${p.zs.length}`, unit: '1/min', v: (p.n1 * p.zs[0]) / p.zs[p.zs.length - 1] },
      ];
    },
    fehler: (p) => [
      { ask: 1, v: (p.n1 * p.zs[p.zs.length - 2]) / p.zs[p.zs.length - 1], msg: 'Nur das letzte Paar reicht nicht. Die Zwischenräder kürzen sich weg: n = n_1 · z_1 : z_letzt.' },
      { ask: 1, v: (p.n1 * p.zs[p.zs.length - 1]) / p.zs[0], msg: 'Verkehrt herum. n_letzt = n_1 · z_1 : z_letzt.' },
    ],
    tipps: (p) => [
      'Jedes Paar kehrt den Drehsinn um. Alle Räder dazwischen sind Zwischenräder.',
      `Es gibt ${p.zs.length - 1} Paare, also ${p.zs.length - 1} Wechsel.`,
      `Für die Drehzahl zählen nur z_1 = ${p.zs[0]} und z_${p.zs.length} = ${p.zs[p.zs.length - 1]}.`,
    ],
    loesung: (p) => {
      const L = p.zs.length, zl = p.zs[L - 1];
      return [
        `a) ${L - 1} Wechsel. ${L - 1 === 2 ? 'Gerade Zahl' : 'Ungerade Zahl'}: Das letzte Rad dreht ${sinn(L % 2 === 1 ? p.cw : !p.cw)}.`,
        `b) ${eq('i = z_' + L + ' : z_1 = ' + zl + ' : ' + p.zs[0] + ' = ' + fmt(zl / p.zs[0]))}, ${eq(v('n_' + L) + ' = ' + v(rpm(p.n1)) + ' : ' + fmt(zl / p.zs[0]) + ' = ' + v(rpm((p.n1 * p.zs[0]) / zl)))}`,
      ];
    },
  }),

  // ---------- Mehrstufig ----------

  task({
    id: 'u12', karte: 'mehrstufig', stufe: 2, familie: 'rechnen',
    title: 'Zweistufiges Getriebe',
    gen: () => ({ z1: rng(14, 22, 1), z2: rng(40, 70, 1), z3: rng(15, 24, 1), z4: rng(45, 75, 1), n1: pick(MOTOR) }),
    draw: (p) => B.schema({ stufen: [[p.z1, p.z2], [p.z3, p.z4]], an: 'n_1 = ' + rpm(p.n1), ab: 'n_ab = ?' }),
    text: (p) => `Ein zweistufiges Stirnradgetriebe hat z_1 = ${p.z1}, z_2 = ${p.z2}, z_3 = ${p.z3}, z_4 = ${p.z4}. Der Motor dreht mit ${v('n_1 = ' + rpm(p.n1))}. Berechne a) i_1, b) i_2, c) die Gesamtübersetzung i_ges, d) die Abtriebsdrehzahl n_ab.`,
    asks: (p) => {
      const i1 = p.z2 / p.z1, i2 = p.z4 / p.z3;
      return [
        { k: 'a) i_1', unit: '', v: i1 },
        { k: 'b) i_2', unit: '', v: i2 },
        { k: 'c) i_ges', unit: '', v: i1 * i2 },
        { k: 'd) n_ab', unit: '1/min', v: p.n1 / (i1 * i2) },
      ];
    },
    fehler: (p) => {
      const i1 = p.z2 / p.z1, i2 = p.z4 / p.z3;
      return [
        { ask: 2, v: i1 + i2, msg: 'Stufen hintereinander werden multipliziert, nicht addiert: i_ges = i_1 · i_2.' },
        { ask: 3, v: p.n1 / (i1 + i2), msg: 'i_ges ist das Produkt i_1 · i_2, nicht die Summe.' },
        { ask: 3, v: p.n1 / i1, msg: 'Das ist erst die Zwischenwelle. Teile noch durch i_2.' },
      ];
    },
    tipps: () => [
      'Jede Stufe hat ihre eigene Übersetzung. Hintereinander werden sie multipliziert.',
      'i_1 = z_2 : z_1, i_2 = z_4 : z_3',
      'i_ges = i_1 · i_2, n_ab = n_1 : i_ges',
    ],
    loesung: (p) => {
      const i1 = p.z2 / p.z1, i2 = p.z4 / p.z3;
      return [
        `a) ${eq('i_1 = ' + p.z2 + ' : ' + p.z1 + ' = ' + fmt(i1))}`,
        `b) ${eq('i_2 = ' + p.z4 + ' : ' + p.z3 + ' = ' + fmt(i2))}`,
        `c) ${eq('i_ges = ' + fmt(i1) + ' · ' + fmt(i2) + ' = ' + fmt(i1 * i2))}`,
        `d) ${eq(v('n_ab') + ' = ' + v(rpm(p.n1)) + ' : ' + fmt(i1 * i2) + ' = ' + v(rpm(p.n1 / (i1 * i2))))}`,
      ];
    },
  }),

  task({
    id: 'u13', karte: 'mehrstufig', stufe: 2, familie: 'umgekehrt',
    title: 'Zweite Stufe auslegen',
    gen: () => { const z1 = rng(14, 20, 1), z2 = z1 * pick([2, 3, 4]), z3 = rng(16, 24, 2), i2 = pick([2, 2.5, 3, 3.5, 4]); return { z1, z2, z3, i2, z4: z3 * i2, n1: pick(MOTOR) }; },
    draw: (p) => B.schema({ stufen: [[p.z1, p.z2], [p.z3, Math.round(p.z4)]], namen: [`z_1 = ${p.z1}`, `z_2 = ${p.z2}`, `z_3 = ${p.z3}`, 'z_4 = ?'], an: 'n_1 = ' + rpm(p.n1), ab: 'n_ab = ' + rpm(p.n1 / ((p.z2 / p.z1) * p.i2)) }),
    text: (p) => `Ein Motor mit ${v('n_1 = ' + rpm(p.n1))} treibt ein zweistufiges Getriebe. Die erste Stufe hat z_1 = ${p.z1} und z_2 = ${p.z2}. Am Abtrieb soll ${v('n_ab = ' + rpm(p.n1 / ((p.z2 / p.z1) * p.i2)))} herauskommen. Das Ritzel der zweiten Stufe hat z_3 = ${p.z3}. Berechne a) i_ges, b) i_2 und c) z_4.`,
    asks: (p) => {
      const i1 = p.z2 / p.z1;
      return [
        { k: 'a) i_ges', unit: '', v: i1 * p.i2 },
        { k: 'b) i_2', unit: '', v: p.i2 },
        { k: 'c) z_4', unit: '', v: p.z4 },
      ];
    },
    fehler: (p) => {
      const i1 = p.z2 / p.z1;
      return [
        { ask: 1, v: i1 * p.i2 - i1, msg: 'Übersetzungen werden multipliziert. Also teilen, nicht abziehen: i_2 = i_ges : i_1.' },
        { ask: 2, v: p.z3 / p.i2, msg: 'Die zweite Stufe geht ins Langsame. z_4 ist grösser als z_3: z_4 = i_2 · z_3.' },
      ];
    },
    tipps: (p) => [
      'Rechne vom Ziel rückwärts: zuerst die gesamte Übersetzung.',
      `i_ges = n_1 : n_ab, i_1 = ${p.z2} : ${p.z1}`,
      'i_2 = i_ges : i_1, dann z_4 = i_2 · z_3.',
    ],
    loesung: (p) => {
      const i1 = p.z2 / p.z1, ig = i1 * p.i2;
      return [
        `a) ${eq('i_ges = ' + v('n_1 : n_ab') + ' = ' + fmt(p.n1) + ' : ' + fmt(p.n1 / ig) + ' = ' + fmt(ig))}`,
        `b) ${eq('i_1 = ' + p.z2 + ' : ' + p.z1 + ' = ' + fmt(i1))}, ${eq('i_2 = i_ges : i_1 = ' + fmt(ig) + ' : ' + fmt(i1) + ' = ' + fmt(p.i2))}`,
        `c) ${eq('z_4 = i_2 · z_3 = ' + fmt(p.i2) + ' · ' + p.z3 + ' = ' + fmt(p.z4))}`,
      ];
    },
  }),

  task({
    id: 'u14', karte: 'mehrstufig', stufe: 3, familie: 'kette',
    title: 'Seilwinde: Hubgeschwindigkeit',
    gen: () => ({ z1: rng(14, 20, 1), z2: rng(50, 80, 1), z3: rng(15, 22, 1), z4: rng(55, 85, 1), n1: pick([940, 1440, 1450]), dT: pick([160, 200, 250, 315]) }),
    draw: (p) => B.schema({ stufen: [[p.z1, p.z2], [p.z3, p.z4]], an: 'n_1 = ' + rpm(p.n1), trommel: 'ø' + p.dT + ' mm', ab: 'v = ?' }),
    text: (p) => `Eine Seilwinde wird über ein zweistufiges Getriebe angetrieben: z_1 = ${p.z1}, z_2 = ${p.z2}, z_3 = ${p.z3}, z_4 = ${p.z4}. Der Motor dreht mit ${v('n_1 = ' + rpm(p.n1))}. Die Seiltrommel hat den Durchmesser ${l(p.dT + ' mm')}. Berechne a) die Trommeldrehzahl n_T und b) die Hubgeschwindigkeit v in m/min.`,
    asks: (p) => {
      const i = (p.z2 / p.z1) * (p.z4 / p.z3), n = p.n1 / i;
      return [
        { k: 'a) n_T', unit: '1/min', v: n },
        { k: 'b) v', unit: 'm/min', v: (PI * p.dT * n) / 1000 },
      ];
    },
    fehler: (p) => {
      const i = (p.z2 / p.z1) * (p.z4 / p.z3), n = p.n1 / i;
      return [
        { ask: 0, v: p.n1 / ((p.z2 / p.z1) + (p.z4 / p.z3)), msg: 'Die Stufen werden multipliziert, nicht addiert.' },
        { ask: 1, v: (p.dT * n) / 1000, msg: 'Der Umfang ist π · d. Das π fehlt.' },
        { ask: 1, v: (PI * p.dT * n) / 2000, msg: 'Du hast mit dem Radius gerechnet. Umfang = π · d (Durchmesser).' },
        { ask: 1, v: (PI * p.dT * p.n1) / 1000, msg: 'Die Trommel dreht nicht mit der Motordrehzahl. Nimm n_T.' },
      ];
    },
    tipps: () => [
      'Pro Umdrehung wickelt die Trommel einen Umfang Seil auf.',
      'i_ges = (z_2 : z_1) · (z_4 : z_3), n_T = n_1 : i_ges',
      'v = π · d_T · n_T. d_T in m einsetzen.',
    ],
    loesung: (p) => {
      const i = (p.z2 / p.z1) * (p.z4 / p.z3), n = p.n1 / i;
      return [
        `${eq('i_ges = (' + p.z2 + ' : ' + p.z1 + ') · (' + p.z4 + ' : ' + p.z3 + ') = ' + fmt(i))}`,
        `a) ${eq(v('n_T') + ' = ' + v(rpm(p.n1)) + ' : ' + fmt(i) + ' = ' + v(rpm(n)))}`,
        `b) ${eq(v('v') + ' = π · ' + l('d_T') + ' · ' + v('n_T') + ' = π · ' + fmt(p.dT / 1000, 3) + ' m · ' + fmt(n) + ' /min = ' + v(fmt((PI * p.dT * n) / 1000) + ' m/min'))}`,
      ];
    },
  }),

  task({
    id: 'u15', karte: 'mehrstufig', stufe: 3, familie: 'rechnen',
    title: 'Dreistufiges Getriebe',
    gen: () => ({ zs: [rng(13, 18, 1), rng(40, 60, 1), rng(14, 20, 1), rng(42, 64, 1), rng(15, 22, 1), rng(45, 66, 1)], n1: pick([1440, 1450, 2850, 2900]) }),
    draw: (p) => B.schema({ stufen: [[p.zs[0], p.zs[1]], [p.zs[2], p.zs[3]], [p.zs[4], p.zs[5]]], an: 'n_1 = ' + rpm(p.n1), ab: 'n_ab = ?' }),
    text: (p) => `Ein Getriebemotor hat drei Stufen: z_1 = ${p.zs[0]}, z_2 = ${p.zs[1]}, z_3 = ${p.zs[2]}, z_4 = ${p.zs[3]}, z_5 = ${p.zs[4]}, z_6 = ${p.zs[5]}. Der Motor dreht mit ${v('n_1 = ' + rpm(p.n1))}. Berechne a) i_ges und b) n_ab.`,
    asks: (p) => {
      const i = (p.zs[1] / p.zs[0]) * (p.zs[3] / p.zs[2]) * (p.zs[5] / p.zs[4]);
      return [
        { k: 'a) i_ges', unit: '', v: i },
        { k: 'b) n_ab', unit: '1/min', v: p.n1 / i },
      ];
    },
    fehler: (p) => {
      const s = p.zs[1] / p.zs[0] + p.zs[3] / p.zs[2] + p.zs[5] / p.zs[4];
      return [
        { ask: 0, v: s, msg: 'Stufen hintereinander werden multipliziert, nicht addiert.' },
        { ask: 0, v: (p.zs[1] + p.zs[3] + p.zs[5]) / (p.zs[0] + p.zs[2] + p.zs[4]), msg: 'Die Zähne aller Räder zusammenzählen geht nicht. Rechne jede Stufe für sich und multipliziere.' },
      ];
    },
    tipps: () => [
      'Drei Stufen, drei Übersetzungen. Alle multiplizieren.',
      'i_ges = (z_2 : z_1) · (z_4 : z_3) · (z_6 : z_5)',
      'n_ab = n_1 : i_ges',
    ],
    loesung: (p) => {
      const a = p.zs[1] / p.zs[0], b = p.zs[3] / p.zs[2], c = p.zs[5] / p.zs[4];
      return [
        `${eq('i_1 = ' + fmt(a) + ', i_2 = ' + fmt(b) + ', i_3 = ' + fmt(c))}`,
        `a) ${eq('i_ges = ' + fmt(a) + ' · ' + fmt(b) + ' · ' + fmt(c) + ' = ' + fmt(a * b * c))}`,
        `b) ${eq(v('n_ab') + ' = ' + v(rpm(p.n1)) + ' : ' + fmt(a * b * c) + ' = ' + v(rpm(p.n1 / (a * b * c))))}`,
      ];
    },
  }),

  task({
    id: 'u16', karte: 'mehrstufig', stufe: 2, familie: 'fehler',
    title: 'Fehler finden: Rechnung zum Getriebe',
    gen: () => {
      const z1 = rng(14, 20, 1), z2 = rng(45, 70, 1), z3 = rng(15, 22, 1), z4 = rng(40, 66, 1), n1 = pick(MOTOR);
      return { z1, z2, z3, z4, n1, f: rng(0, 3, 1) };
    },
    draw: (p) => B.schema({ stufen: [[p.z1, p.z2], [p.z3, p.z4]], an: 'n_1 = ' + rpm(p.n1), ab: 'n_ab' }),
    text: (p) => {
      const i1r = p.z2 / p.z1, i2r = p.z4 / p.z3;
      const s1 = p.f === 0 ? `i_1 = ${p.z1} : ${p.z2} = ${fmt(p.z1 / p.z2, 3)}` : `i_1 = ${p.z2} : ${p.z1} = ${fmt(i1r)}`;
      const i1 = p.f === 0 ? p.z1 / p.z2 : i1r;
      const i2 = p.f === 1 ? p.z3 / p.z4 : i2r;
      const s2 = p.f === 1 ? `i_2 = ${p.z3} : ${p.z4} = ${fmt(i2, 3)}` : `i_2 = ${p.z4} : ${p.z3} = ${fmt(i2r)}`;
      const ig = p.f === 2 ? i1 + i2 : i1 * i2;
      const s3 = `i_ges = ${fmt(i1, p.f === 0 ? 3 : undefined)} ${p.f === 2 ? '+' : '·'} ${fmt(i2, p.f === 1 ? 3 : undefined)} = ${fmt(ig)}`;
      const nab = p.f === 3 ? p.n1 * ig : p.n1 / ig;
      const s4 = `n_ab = ${fmt(p.n1)} /min ${p.f === 3 ? '·' : ':'} ${fmt(ig)} = ${fmt(nab)} /min`;
      return `Getriebe: z_1 = ${p.z1}, z_2 = ${p.z2}, z_3 = ${p.z3}, z_4 = ${p.z4}, ${v('n_1 = ' + rpm(p.n1))}. Ein Lernender rechnet:<br>1. ${eq(s1)}<br>2. ${eq(s2)}<br>3. ${eq(s3)}<br>4. ${eq(s4)}<br>In welchem Schritt steckt der Fehler?`;
    },
    asks: (p) => {
      const W = [
        'Schritt 1 stimmt. Das getriebene Rad z_2 steht im Zähler.',
        'Schritt 2 stimmt: i_2 = z_4 : z_3.',
        'Schritt 3 stimmt. Die Stufen werden multipliziert.',
        'Schritt 4 stimmt. Die Abtriebsdrehzahl ist n_1 : i_ges.',
      ];
      const why = [0, 1, 2, 3].map((i) => (i === p.f ? undefined : W[i]));
      return [{ kind: 'choice', k: 'Fehler in', opts: ['Schritt 1', 'Schritt 2', 'Schritt 3', 'Schritt 4'], a: p.f, why }];
    },
    tipps: () => ['Prüfe jeden Schritt einzeln mit den Formeln.', 'i = z_getrieben : z_treibend. i_ges = i_1 · i_2.', 'Ins Langsame heisst: n_ab ist kleiner als n_1.'],
    loesung: (p) => {
      const i1 = p.z2 / p.z1, i2 = p.z4 / p.z3;
      const grund = [
        'Schritt 1: z_1 und z_2 sind vertauscht. Richtig: i_1 = z_2 : z_1.',
        'Schritt 2: z_3 und z_4 sind vertauscht. Richtig: i_2 = z_4 : z_3.',
        'Schritt 3: Die Stufen wurden addiert. Richtig: i_ges = i_1 · i_2.',
        'Schritt 4: Es wurde mit i_ges multipliziert. Die Abtriebswelle dreht aber langsamer: n_ab = n_1 : i_ges.',
      ][p.f];
      return [grund, `Richtig: ${eq('i_ges = ' + fmt(i1) + ' · ' + fmt(i2) + ' = ' + fmt(i1 * i2))}, ${eq(v('n_ab = ' + rpm(p.n1 / (i1 * i2))))}`];
    },
  }),

  // ---------- Drehmoment und Wirkungsgrad ----------

  task({
    id: 'u17', karte: 'moment', stufe: 2, familie: 'rechnen',
    title: 'Drehmoment am Abtrieb',
    gen: () => ({ z1: rng(14, 24, 1), z2: rng(40, 80, 1), n1: pick(MOTOR), M1: rng(10, 80, 2), eta: pick([0.95, 0.96, 0.97, 0.98]) }),
    draw: (p) => B.reihe({ zs: [p.z1, p.z2], cw: true, unten: ['M_1 = ' + p.M1 + ' Nm', 'M_2 = ?'] }),
    text: (p) => `Ein Ritzel (z_1 = ${p.z1}) wird mit ${m('M_1 = ' + p.M1 + ' Nm')} bei ${v('n_1 = ' + rpm(p.n1))} angetrieben. Es treibt ein Rad mit z_2 = ${p.z2}. Der Wirkungsgrad der Stufe ist η = ${fmt(p.eta)}. Berechne a) n_2 und b) das Drehmoment M_2.`,
    asks: (p) => [
      { k: 'a) n_2', unit: '1/min', v: (p.n1 * p.z1) / p.z2 },
      { k: 'b) M_2', unit: 'Nm', v: (p.M1 * p.z2 * p.eta) / p.z1 },
    ],
    fehler: (p) => [
      { ask: 1, v: (p.M1 * p.z1) / p.z2, msg: 'Ins Langsame wird das Drehmoment grösser, nicht kleiner. M_2 = M_1 · i · η.' },
      { ask: 1, v: (p.M1 * p.z2) / p.z1, msg: 'Das gilt ohne Verluste. Multipliziere noch mit η.' },
      { ask: 1, v: (p.M1 * p.z2) / (p.z1 * p.eta), msg: 'η steht als Faktor, nicht als Teiler. Verluste machen M_2 kleiner.' },
    ],
    tipps: (p) => [
      'Drehzahl und Drehmoment verhalten sich umgekehrt. Die Verluste nehmen etwas weg.',
      `i = ${p.z2} : ${p.z1} = ${fmt(p.z2 / p.z1)}`,
      'n_2 = n_1 : i, M_2 = M_1 · i · η',
    ],
    loesung: (p) => {
      const i = p.z2 / p.z1;
      return [
        `${eq('i = ' + fmt(i))}`,
        `a) ${eq(v('n_2') + ' = ' + v(rpm(p.n1)) + ' : ' + fmt(i) + ' = ' + v(rpm(p.n1 / i)))}`,
        `b) ${eq(m('M_2') + ' = ' + m(p.M1 + ' Nm') + ' · ' + fmt(i) + ' · ' + fmt(p.eta) + ' = ' + m(fmt(p.M1 * i * p.eta) + ' Nm'))}`,
      ];
    },
  }),

  task({
    id: 'u18', karte: 'moment', stufe: 2, familie: 'kette',
    title: 'Vom Motor zum Drehmoment',
    gen: () => ({ P: pick([0.75, 1.1, 1.5, 2.2, 3, 4, 5.5]), n1: pick([1440, 1450, 2850, 2900]), z1: rng(15, 22, 1), z2: rng(45, 80, 1), eta: pick([0.95, 0.96, 0.97]) }),
    draw: (p) => B.schema({ stufen: [[p.z1, p.z2]], an: `P = ${fmt(p.P)} kW`, ab: 'M_2 = ?' }),
    text: (p) => `Ein Motor mit ${v('P = ' + fmt(p.P) + ' kW')} dreht mit ${v('n_1 = ' + rpm(p.n1))}. Er treibt über ein Radpaar (z_1 = ${p.z1}, z_2 = ${p.z2}, η = ${fmt(p.eta)}) eine Welle. Berechne a) das Motordrehmoment M_1 und b) das Drehmoment M_2 an der Welle.`,
    asks: (p) => {
      const M1 = (p.P * 1000) / ((2 * PI * p.n1) / 60);
      return [
        { k: 'a) M_1', unit: 'Nm', v: M1 },
        { k: 'b) M_2', unit: 'Nm', v: M1 * (p.z2 / p.z1) * p.eta },
      ];
    },
    fehler: (p) => {
      const M1 = (p.P * 1000) / ((2 * PI * p.n1) / 60);
      return [
        { ask: 0, v: M1 / 60, msg: 'n ist in 1/min. Für 1/s noch durch 60 teilen: ω = 2 · π · n : 60.' },
        { ask: 0, v: M1 / 1000, msg: 'P in W einsetzen, nicht in kW.' },
        { ask: 0, v: M1 * 2 * PI, msg: 'Die Winkelgeschwindigkeit ist ω = 2 · π · n. Das 2 · π gehört in den Nenner.' },
      ];
    },
    tipps: () => [
      'Leistung = Drehmoment mal Winkelgeschwindigkeit: P = M · ω.',
      'ω = 2 · π · n : 60 (n in 1/min). Dann M_1 = P : ω.',
      'M_2 = M_1 · i · η',
    ],
    loesung: (p) => {
      const w = (2 * PI * p.n1) / 60, M1 = (p.P * 1000) / w, i = p.z2 / p.z1;
      return [
        `${eq('ω = 2 · π · ' + fmt(p.n1) + ' : 60 = ' + fmt(w) + ' 1/s')}`,
        `a) ${eq(m('M_1') + ' = P : ω = ' + fmt(p.P * 1000) + ' W : ' + fmt(w) + ' 1/s = ' + m(fmt(M1) + ' Nm'))}`,
        `b) ${eq('i = ' + fmt(i))}, ${eq(m('M_2') + ' = ' + fmt(M1) + ' Nm · ' + fmt(i) + ' · ' + fmt(p.eta) + ' = ' + m(fmt(M1 * i * p.eta) + ' Nm'))}`,
      ];
    },
  }),

  task({
    id: 'u19', karte: 'moment', stufe: 3, familie: 'umgekehrt',
    title: 'Welches Motordrehmoment braucht es?',
    gen: () => ({ M2: rng(200, 1200, 50), i1: pick([2.5, 3, 3.5, 4]), i2: pick([3, 4, 4.5, 5]), eta: pick([0.96, 0.97, 0.98]) }),
    draw: (p) => B.schema({ stufen: [[18, Math.round(18 * p.i1)], [16, Math.round(16 * p.i2)]], namen: ['', `i_1 = ${fmt(p.i1)}`, '', `i_2 = ${fmt(p.i2)}`], an: 'M_1 = ?', ab: 'M_ab = ' + p.M2 + ' Nm' }),
    text: (p) => `Eine Förderschnecke braucht ${m('M_ab = ' + p.M2 + ' Nm')}. Sie wird über ein zweistufiges Getriebe angetrieben: i_1 = ${fmt(p.i1)}, i_2 = ${fmt(p.i2)}. Jede Stufe hat η = ${fmt(p.eta)}. Welches Drehmoment M_1 muss der Motor mindestens abgeben?`,
    asks: (p) => [{ k: 'M_1', unit: 'Nm', v: p.M2 / (p.i1 * p.i2 * p.eta * p.eta) }],
    fehler: (p) => [
      { ask: 0, v: (p.M2 * p.eta * p.eta) / (p.i1 * p.i2), msg: 'Rückwärts gerechnet steht η im Nenner. Der Motor muss die Verluste zusätzlich liefern.' },
      { ask: 0, v: p.M2 / (p.i1 * p.i2 * p.eta), msg: 'Zwei Stufen, zwei Wirkungsgrade: η_ges = η · η.' },
      { ask: 0, v: p.M2 / (p.i1 * p.i2), msg: 'Die Verluste fehlen. Teile noch durch η_ges = η · η.' },
    ],
    tipps: () => [
      'Vorwärts: M_ab = M_1 · i_ges · η_ges. Jetzt nach M_1 umstellen.',
      'i_ges = i_1 · i_2, η_ges = η · η',
      'M_1 = M_ab : (i_ges · η_ges)',
    ],
    loesung: (p) => {
      const ig = p.i1 * p.i2, eg = p.eta * p.eta;
      return [
        `${eq('i_ges = ' + fmt(p.i1) + ' · ' + fmt(p.i2) + ' = ' + fmt(ig))}, ${eq('η_ges = ' + fmt(p.eta) + ' · ' + fmt(p.eta) + ' = ' + fmt(eg, 4))}`,
        `${eq(m('M_1') + ' = ' + m(p.M2 + ' Nm') + ' : (' + fmt(ig) + ' · ' + fmt(eg, 4) + ') = ' + m(fmt(p.M2 / (ig * eg)) + ' Nm'))}`,
        'Kontrolle: Ohne Verluste wären es etwas weniger. Der Motor muss die Verluste mitliefern.',
      ];
    },
  }),

  task({
    id: 'u20', karte: 'moment', stufe: 1, familie: 'schaetzen',
    title: 'Kopfrechnen: Drehmoment nach zwei Stufen',
    gen: () => {
      const M1 = pick([10, 20, 25, 50]), i1 = pick([2, 3, 4]), i2 = pick([5, 6]);
      const r = M1 * i1 * i2;
      return {
        M1, i1, i2,
        w: mischen(
          [`etwa ${r} Nm`, `etwa ${M1 * (i1 + i2)} Nm`, `etwa ${fmt(M1 / (i1 * i2))} Nm`, `etwa ${r * 10} Nm`],
          [undefined, 'Stufen werden multipliziert, nicht addiert.', 'Ins Langsame wird das Drehmoment grösser.', 'Eine Null zu viel. Rechne M_1 · i_1 · i_2.'],
        ),
      };
    },
    draw: (p) => B.schema({ stufen: [[18, 18 * p.i1], [16, 16 * p.i2]], namen: ['', `i_1 = ${p.i1}`, '', `i_2 = ${p.i2}`], an: `M_1 = ${p.M1} Nm`, ab: 'M_ab ≈ ?' }),
    text: (p) => `Ohne Rechner und ohne Verluste: Ein Motor gibt ${m('M_1 = ' + p.M1 + ' Nm')} ab. Das Getriebe hat zwei Stufen mit i_1 = ${p.i1} und i_2 = ${p.i2}. Wie gross ist das Drehmoment am Abtrieb ungefähr?`,
    asks: (p) => [auswahl('Schätzung', p.w)],
    tipps: (p) => ['M_ab = M_1 · i_ges', `i_ges = ${p.i1} · ${p.i2} = ${p.i1 * p.i2}`, `${p.M1} · ${p.i1 * p.i2}`],
    loesung: (p) => [`${eq('i_ges = ' + p.i1 + ' · ' + p.i2 + ' = ' + p.i1 * p.i2)}`, `${eq(m('M_ab') + ' = ' + p.M1 + ' Nm · ' + p.i1 * p.i2 + ' = ' + m(p.M1 * p.i1 * p.i2 + ' Nm'))}`, 'Mit Verlusten (η ≈ 0,95 pro Stufe) etwa 10 % weniger.'],
  }),

  task({
    id: 'u21', karte: 'moment', stufe: 2, familie: 'fehler',
    title: 'Fehler finden: Behauptung zum Getriebe',
    gen: () => ({
      i: pick([3, 4, 5, 6]),
      w: mischen(
        ['Falsch. Die Leistung bleibt (fast) gleich. Das Drehmoment steigt, die Drehzahl sinkt.', 'Richtig. Ein Getriebe ins Langsame vervielfacht die Leistung.', 'Richtig, aber nur ohne Verluste.', 'Falsch. Die Leistung sinkt um den Faktor i.'],
        [undefined, 'Ein Getriebe erzeugt keine Energie. P_2 = P_1 · η, also etwas weniger.', 'Auch ohne Verluste bleibt P gleich. Nur M und n tauschen.', 'Die Leistung sinkt nur um die Verluste (η), nicht um i.'],
      ),
    }),
    draw: (p) => B.reihe({ zs: [20, 20 * Math.min(p.i, 4)], cw: true, oben: ['Motor', `i = ${p.i}`], nurErster: true }),
    text: (p) => `Ein Kollege sagt: «Das Getriebe hat i = ${p.i}. Also kommt am Abtrieb ${p.i}-mal mehr Leistung heraus.» Was stimmt?`,
    asks: (p) => [auswahl('Aussage', p.w)],
    tipps: () => ['P = M · ω. Was macht das Getriebe mit M, was mit ω?', 'M wird i-mal grösser, ω wird i-mal kleiner.', 'Das Produkt bleibt gleich. Verluste machen es etwas kleiner.'],
    loesung: (p) => [
      `${eq(m('M_2') + ' = ' + m('M_1') + ' · ' + p.i + ' · η')}, ${eq(v('n_2') + ' = ' + v('n_1') + ' : ' + p.i)}`,
      `${eq('P_2 = ' + m('M_2') + ' · ω_2 = ' + m('M_1') + ' · ' + p.i + ' · η · ω_1 : ' + p.i + ' = P_1 · η')}`,
      'Ein Getriebe wandelt Drehzahl in Drehmoment um. Leistung gewinnt es nie.',
    ],
  }),
];

export const AUFGABEN: Task[] = LISTE.map((t) =>
  t.fehler
    ? {
        ...t,
        // Fehlwerte, die zufällig sehr nahe am richtigen Wert liegen, fallen weg.
        fehler: (p) =>
          t.fehler!(p).filter((e) => {
            const a = t.asks(p)[e.ask];
            return 'kind' in a && a.kind === 'choice' ? true : Math.abs(e.v - (a as { v: number }).v) > 0.05 * Math.abs((a as { v: number }).v);
          }),
      }
    : t,
);
