// Aufgaben zum Kapitel Zahnräder: Masse berechnen (Stirnräder, geradverzahnt, Kopfspiel c = 0,25 · m).
import { task, type Task } from '../../../core/types';
import { eq, l } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import * as B from './bilder';

/** Beim ersten Öffnen die Buchwerte, danach Zufallswerte. */
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

const MODUL = [0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5] as const;
const PI = Math.PI;
const mm = (x: number) => fmt(x, 2) + ' mm';

// Kurzformeln
const d_ = (m: number, z: number) => m * z;
const da_ = (m: number, z: number) => m * (z + 2);
const df_ = (m: number, z: number) => m * (z - 2.5);
const a_ = (m: number, z1: number, z2: number) => (m * (z1 + z2)) / 2;

const F = {
  d: eq(l('d') + ' = m · z'),
  p: eq(l('p') + ' = π · m'),
  da: eq(l('d_a') + ' = d + 2 · h_a = m · (z + 2)'),
  df: eq(l('d_f') + ' = d − 2 · h_f = m · (z − 2,5)'),
  a: eq(l('a') + ' = (d_1 + d_2) : 2 = m · (z_1 + z_2) : 2'),
};

const LISTE: Task[] = [
  // ---------- Grundgrössen: Modul, Teilkreis, Teilung ----------

  task({
    id: 'z1', karte: 'grund', stufe: 1, familie: 'rechnen',
    title: 'Teilkreisdurchmesser berechnen',
    gen: () => ({ m: pick(MODUL), z: rng(14, 80, 1) }),
    draw: (p) => B.rad(p, { z: `z = ${p.z}`, m: `m = ${fmt(p.m)} mm`, d: 'd = ?' }),
    text: (p) => `Ein Stirnrad hat ${p.z} Zähne und den Modul ${l('m = ' + fmt(p.m) + ' mm')}. Wie gross ist der Teilkreisdurchmesser d?`,
    asks: (p) => [{ k: 'd', unit: 'mm', v: d_(p.m, p.z) }],
    fehler: (p) => [
      { ask: 0, v: p.z / p.m, msg: 'Du hast geteilt. Der Teilkreisdurchmesser ist Modul mal Zähnezahl: d = m · z.' },
      { ask: 0, v: da_(p.m, p.z), msg: 'Das ist der Kopfkreisdurchmesser d_a. Gefragt ist der Teilkreis: d = m · z.' },
    ],
    tipps: (p) => [
      'Der Modul sagt, wie viel Teilkreisdurchmesser auf einen Zahn kommt.',
      'd = m · z',
      `d = ${fmt(p.m)} mm · ${p.z}`,
    ],
    loesung: (p) => [
      `Formel: ${F.d}`,
      `Einsetzen: ${eq(l('d') + ' = ' + fmt(p.m) + ' mm · ' + p.z)}`,
      `Resultat: ${eq(l('d = ' + mm(d_(p.m, p.z))))}`,
    ],
  }),

  task({
    id: 'z2', karte: 'grund', stufe: 1, familie: 'umgekehrt',
    title: 'Modul aus Teilkreis und Zähnezahl',
    gen: () => { const m = pick(MODUL), z = rng(16, 90, 1); return { m, z, d: d_(m, z) }; },
    draw: (p) => B.rad(p, { z: `z = ${p.z}`, d: `d = ${fmt(p.d, 2)} mm`, m: 'm = ?' }),
    text: (p) => `Ein Zahnrad hat ${p.z} Zähne. Sein Teilkreisdurchmesser ist ${l('d = ' + fmt(p.d, 2) + ' mm')}. Welchen Modul m hat das Rad?`,
    asks: (p) => [{ k: 'm', unit: 'mm', v: p.m }],
    fehler: (p) => [
      { ask: 0, v: p.d * p.z, msg: 'Du hast multipliziert. Stelle d = m · z nach m um: m = d : z.' },
      { ask: 0, v: p.z / p.d, msg: 'Verkehrt geteilt. m = d : z, also Durchmesser durch Zähnezahl.' },
    ],
    tipps: () => ['Der Modul ist Teilkreisdurchmesser pro Zahn.', 'm = d : z', 'Prüfe: Das Resultat ist ein Wert aus der Modulreihe (0,8; 1; 1,25; 1,5; 2; 2,5; 3; 4; 5 …).'],
    loesung: (p) => [
      `Formel: ${F.d}, umgestellt ${eq('m = ' + l('d') + ' : z')}`,
      `Einsetzen: ${eq('m = ' + l(fmt(p.d, 2) + ' mm') + ' : ' + p.z)}`,
      `Resultat: ${eq('m = ' + fmt(p.m) + ' mm')}`,
    ],
  }),

  task({
    id: 'z3', karte: 'grund', stufe: 1, familie: 'rechnen',
    title: 'Teilung aus dem Modul',
    gen: () => ({ m: pick(MODUL), z: rng(20, 60, 1) }),
    draw: () => B.zahn({ p: 'p = ?' }),
    text: (p) => `Ein Zahnrad hat den Modul ${l('m = ' + fmt(p.m) + ' mm')}. Wie gross ist die Teilung p, also der Abstand von Zahn zu Zahn auf dem Teilkreis?`,
    asks: (p) => [{ k: 'p', unit: 'mm', v: PI * p.m }],
    fehler: (p) => [
      { ask: 0, v: p.m / PI, msg: 'Verkehrt: m = p : π. Also ist p = π · m.' },
      { ask: 0, v: 2 * p.m, msg: 'Das wäre die Zahnhöhe ohne Kopfspiel. Die Teilung ist p = π · m.' },
    ],
    tipps: () => ['Der Teilkreisumfang ist π · d. Er verteilt sich auf z Zähne.', 'p = π · d : z = π · m', 'Rechne π · m.'],
    loesung: (p) => [
      `Formel: ${F.p}`,
      `Einsetzen: ${eq(l('p') + ' = π · ' + fmt(p.m) + ' mm')}`,
      `Resultat: ${eq(l('p = ' + fmt(PI * p.m, 3) + ' mm'))}`,
      'Herkunft: Umfang π · d geteilt durch z Zähne. Wegen d : z = m bleibt p = π · m.',
    ],
  }),

  task({
    id: 'z4', karte: 'grund', stufe: 2, familie: 'begruenden',
    title: 'Passt dieser Teilkreis?',
    gen: () => { const m = pick([2, 2.5, 3, 4]); const z = rng(14, 40, 1); return { m, z, d: m * z + pick([1, -1]) * m / 2 }; },
    draw: (p) => B.rad(p, { m: `m = ${fmt(p.m)} mm`, d: `d = ${fmt(p.d, 2)} mm`, z: 'z = ?' }),
    text: (p) => `Eine Kollegin plant ein Zahnrad mit dem Modul ${l('m = ' + fmt(p.m) + ' mm')} und dem Teilkreisdurchmesser ${l('d = ' + fmt(p.d, 2) + ' mm')}. Was stimmt?`,
    asks: (p) => [{
      kind: 'choice', k: 'Aussage',
      opts: [
        `Das geht nicht. z = d : m = ${fmt(p.d / p.m, 2)} ist keine ganze Zahl.`,
        `Das geht. Sie rundet auf z = ${Math.round(p.d / p.m + 0.01)} Zähne.`,
        'Das geht. Der Modul darf beliebig sein.',
        'Das geht. Nur der Kopfkreis muss eine ganze Zahl sein.',
      ],
      a: 0,
      why: [undefined,
        'Mit gerundetem z stimmt d = m · z nicht mehr. Entweder d oder m muss sich ändern.',
        'Der Modul ist genormt (Modulreihe). Ausserdem muss z ganzzahlig sein.',
        'Kein Durchmesser muss ganzzahlig sein. Ganzzahlig muss die Zähnezahl sein.'],
    }],
    tipps: () => ['Ein Zahnrad hat immer eine ganze Zahl Zähne.', 'Rechne z = d : m.', 'Ist das Resultat ganzzahlig?'],
    loesung: (p) => [
      `${eq('z = ' + l('d') + ' : m = ' + fmt(p.d, 2) + ' : ' + fmt(p.m) + ' = ' + fmt(p.d / p.m, 2))}`,
      'Die Zähnezahl ist keine ganze Zahl. Das Rad lässt sich so nicht bauen.',
      `Ausweg: d anpassen, z. B. ${eq(l('d') + ' = ' + fmt(p.m) + ' · ' + Math.round(p.d / p.m + 0.01) + ' = ' + fmt(p.m * Math.round(p.d / p.m + 0.01), 2) + ' mm')}.`,
    ],
  }),

  // ---------- Kopf- und Fusskreis, Zahnhöhe ----------

  task({
    id: 'z5', karte: 'kreise', stufe: 1, familie: 'rechnen',
    title: 'Kopfhöhe, Fusshöhe, Zahnhöhe',
    gen: () => ({ m: pick(MODUL) }),
    draw: (p) => B.zahn({ ha: 'h_a = ?', hf: 'h_f = ?', h: 'h = ?', m: `m = ${fmt(p.m)} mm` }),
    text: (p) => `Ein Zahnrad hat den Modul ${l('m = ' + fmt(p.m) + ' mm')}. Das Kopfspiel ist c = 0,25 · m. Berechne a) die Kopfhöhe h_a, b) die Fusshöhe h_f, c) die Zahnhöhe h.`,
    asks: (p) => [
      { k: 'a) h_a', unit: 'mm', v: p.m },
      { k: 'b) h_f', unit: 'mm', v: 1.25 * p.m },
      { k: 'c) h', unit: 'mm', v: 2.25 * p.m },
    ],
    fehler: (p) => [
      { ask: 1, v: p.m, msg: 'Die Fusshöhe ist grösser als die Kopfhöhe. Das Kopfspiel kommt dazu: h_f = m + c = 1,25 · m.' },
      { ask: 2, v: 2 * p.m, msg: 'Du hast das Kopfspiel vergessen. h = h_a + h_f = 2,25 · m.' },
    ],
    tipps: () => ['Die Kopfhöhe ist genau 1 Modul.', 'h_f = m + c, mit c = 0,25 · m.', 'h = h_a + h_f'],
    loesung: (p) => [
      `${eq(l('h_a') + ' = 1 · m = ' + mm(p.m))}`,
      `${eq(l('h_f') + ' = m + c = 1,25 · m = ' + mm(1.25 * p.m))}`,
      `${eq(l('h') + ' = h_a + h_f = 2,25 · m = ' + mm(2.25 * p.m))}`,
    ],
  }),

  task({
    id: 'z6', karte: 'kreise', stufe: 1, familie: 'rechnen',
    title: 'Kopfkreisdurchmesser',
    gen: () => ({ m: pick(MODUL), z: rng(14, 80, 1) }),
    draw: (p) => B.rad(p, { z: `z = ${p.z}`, m: `m = ${fmt(p.m)} mm`, da: 'd_a = ?' }),
    text: (p) => `Berechne den Kopfkreisdurchmesser d_a eines Stirnrades mit ${p.z} Zähnen und dem Modul ${l('m = ' + fmt(p.m) + ' mm')}.`,
    asks: (p) => [{ k: 'd_a', unit: 'mm', v: da_(p.m, p.z) }],
    fehler: (p) => [
      { ask: 0, v: p.m * (p.z + 1), msg: 'Die Kopfhöhe kommt zweimal dazu, oben und unten: d_a = d + 2 · h_a.' },
      { ask: 0, v: d_(p.m, p.z), msg: 'Das ist der Teilkreis. Der Kopfkreis ist um 2 · h_a grösser.' },
    ],
    tipps: () => ['Der Kopfkreis liegt eine Kopfhöhe ausserhalb des Teilkreises, auf beiden Seiten.', 'd_a = d + 2 · m', 'Kurz: d_a = m · (z + 2)'],
    loesung: (p) => [
      `Formel: ${F.da}`,
      `Einsetzen: ${eq(l('d_a') + ' = ' + fmt(p.m) + ' mm · (' + p.z + ' + 2)')}`,
      `Resultat: ${eq(l('d_a = ' + mm(da_(p.m, p.z))))}`,
    ],
  }),

  task({
    id: 'z7', karte: 'kreise', stufe: 1, familie: 'rechnen',
    title: 'Fusskreisdurchmesser',
    gen: () => ({ m: pick(MODUL), z: rng(14, 80, 1) }),
    draw: (p) => B.rad(p, { z: `z = ${p.z}`, m: `m = ${fmt(p.m)} mm`, df: 'd_f = ?' }),
    text: (p) => `Berechne den Fusskreisdurchmesser d_f eines Stirnrades mit ${p.z} Zähnen und dem Modul ${l('m = ' + fmt(p.m) + ' mm')}. Das Kopfspiel ist c = 0,25 · m.`,
    asks: (p) => [{ k: 'd_f', unit: 'mm', v: df_(p.m, p.z) }],
    fehler: (p) => [
      { ask: 0, v: p.m * (p.z - 2), msg: 'Du hast mit h_f = m gerechnet. Das Kopfspiel fehlt: h_f = 1,25 · m, also d_f = m · (z − 2,5).' },
      { ask: 0, v: p.m * (p.z - 1.25), msg: 'Die Fusshöhe geht zweimal weg, oben und unten: d_f = d − 2 · h_f.' },
    ],
    tipps: () => ['Der Fusskreis liegt eine Fusshöhe innerhalb des Teilkreises, auf beiden Seiten.', 'd_f = d − 2 · 1,25 · m', 'Kurz: d_f = m · (z − 2,5)'],
    loesung: (p) => [
      `Formel: ${F.df}`,
      `Einsetzen: ${eq(l('d_f') + ' = ' + fmt(p.m) + ' mm · (' + p.z + ' − 2,5)')}`,
      `Resultat: ${eq(l('d_f = ' + mm(df_(p.m, p.z))))}`,
    ],
  }),

  task({
    id: 'z8', karte: 'kreise', stufe: 2, familie: 'rechnen', src: 'nach Buch Aufgabe 4.5.7',
    title: 'Vom Teilkreis zu allen Massen',
    gen: buch({ m: 0.8, z: 47 }, () => ({ m: pick(MODUL), z: rng(18, 90, 1) })),
    draw: (p) => B.rad(p, { m: `m = ${fmt(p.m)} mm`, d: `d = ${fmt(d_(p.m, p.z), 2)} mm`, z: 'z = ?', da: 'd_a = ?', df: 'd_f = ?' }),
    text: (p) => `Der Teilkreisdurchmesser eines Zahnrades mit dem Modul ${l('m = ' + fmt(p.m) + ' mm')} beträgt ${l('d = ' + fmt(d_(p.m, p.z), 2) + ' mm')}. Berechne a) die Zähnezahl z, b) die Teilung p, c) den Kopfkreisdurchmesser d_a, d) den Fusskreisdurchmesser d_f.`,
    asks: (p) => [
      { k: 'a) z', unit: '', v: p.z },
      { k: 'b) p', unit: 'mm', v: PI * p.m },
      { k: 'c) d_a', unit: 'mm', v: da_(p.m, p.z) },
      { k: 'd) d_f', unit: 'mm', v: df_(p.m, p.z) },
    ],
    fehler: (p) => [
      { ask: 2, v: p.m * (p.z + 1), msg: 'Die Kopfhöhe kommt zweimal dazu: d_a = d + 2 · m.' },
      { ask: 3, v: p.m * (p.z - 2), msg: 'Kopfspiel vergessen. h_f = 1,25 · m, also d_f = d − 2,5 · m.' },
    ],
    tipps: () => ['Zuerst z aus d = m · z.', 'p = π · m', 'd_a = d + 2 · m und d_f = d − 2,5 · m'],
    loesung: (p) => {
      const d = d_(p.m, p.z);
      return [
        `a) ${eq('z = ' + l('d') + ' : m = ' + fmt(d, 2) + ' : ' + fmt(p.m) + ' = ' + p.z)}`,
        `b) ${eq(l('p') + ' = π · ' + fmt(p.m) + ' mm = ' + fmt(PI * p.m, 3) + ' mm')}`,
        `c) ${eq(l('d_a') + ' = ' + fmt(d, 2) + ' mm + 2 · ' + fmt(p.m) + ' mm = ' + mm(da_(p.m, p.z)))}`,
        `d) ${eq(l('d_f') + ' = ' + fmt(d, 2) + ' mm − 2,5 · ' + fmt(p.m) + ' mm = ' + mm(df_(p.m, p.z)))}`,
      ];
    },
  }),

  task({
    id: 'z9', karte: 'kreise', stufe: 2, familie: 'umgekehrt',
    title: 'Werkstatt: Modul eines alten Rades bestimmen',
    gen: () => { const m = pick(MODUL), z = rng(16, 70, 1); return { m, z, da: da_(m, z) }; },
    draw: (p) => B.rad(p, { z: `z = ${p.z} (gezählt)`, da: `d_a = ${fmt(p.da, 2)} mm`, m: 'm = ?' }),
    text: (p) => `Ein Zahnrad ohne Zeichnung muss ersetzt werden. Du zählst ${p.z} Zähne. Mit dem Messschieber misst du den Kopfkreis ${l('d_a = ' + fmt(p.da, 2) + ' mm')}. Welchen Modul m hat das Rad?`,
    asks: (p) => [{ k: 'm', unit: 'mm', v: p.m }],
    fehler: (p) => [
      { ask: 0, v: p.da / p.z, msg: 'Der Messschieber misst den Kopfkreis, nicht den Teilkreis. Es gilt d_a = m · (z + 2), also m = d_a : (z + 2).' },
    ],
    tipps: () => ['Den Teilkreis kann man nicht direkt messen. Den Kopfkreis schon.', 'd_a = m · (z + 2)', 'm = d_a : (z + 2)'],
    loesung: (p) => [
      `Formel: ${F.da}, umgestellt ${eq('m = ' + l('d_a') + ' : (z + 2)')}`,
      `Einsetzen: ${eq('m = ' + fmt(p.da, 2) + ' mm : ' + (p.z + 2))}`,
      `Resultat: ${eq('m = ' + fmt(p.m) + ' mm')}`,
      'Prüfe: Der Wert muss in der Modulreihe stehen. Sonst hast du falsch gemessen oder gezählt.',
    ],
  }),

  task({
    id: 'z10', karte: 'kreise', stufe: 2, familie: 'umgekehrt',
    title: 'Zähnezahl aus dem Kopfkreis',
    gen: () => { const m = pick(MODUL), z = rng(16, 80, 1); return { m, z, da: da_(m, z) }; },
    draw: (p) => B.rad(p, { m: `m = ${fmt(p.m)} mm`, da: `d_a = ${fmt(p.da, 2)} mm`, z: 'z = ?' }),
    text: (p) => `Ein Rohling für ein Zahnrad ist auf ${l('d_a = ' + fmt(p.da, 2) + ' mm')} gedreht. Es soll mit dem Modul ${l('m = ' + fmt(p.m) + ' mm')} verzahnt werden. Wie viele Zähne z bekommt das Rad?`,
    asks: (p) => [{ k: 'z', unit: '', v: p.z }],
    fehler: (p) => [
      { ask: 0, v: p.da / p.m, msg: 'd_a : m gibt z + 2. Ziehe noch 2 ab.' },
    ],
    tipps: () => ['Der Rohling hat den Kopfkreisdurchmesser.', 'd_a = m · (z + 2)', 'z = d_a : m − 2'],
    loesung: (p) => [
      `${eq('z = ' + l('d_a') + ' : m − 2 = ' + fmt(p.da, 2) + ' : ' + fmt(p.m) + ' − 2 = ' + p.z)}`,
    ],
  }),

  task({
    id: 'z11', karte: 'kreise', stufe: 2, familie: 'rechnen',
    title: 'Kopfspiel und Zahnhöhe',
    gen: () => ({ m: pick(MODUL) }),
    draw: (p) => B.zahn({ c: 'c = ?', h: 'h = ?', m: `m = ${fmt(p.m)} mm` }),
    text: (p) => `Zwei Räder mit dem Modul ${l('m = ' + fmt(p.m) + ' mm')} kämmen. Der Kopf des einen Rades reicht nicht ganz bis zum Fuss des anderen. Berechne a) das Kopfspiel c, b) die Zahnhöhe h.`,
    asks: (p) => [
      { k: 'a) c', unit: 'mm', v: 0.25 * p.m },
      { k: 'b) h', unit: 'mm', v: 2.25 * p.m },
    ],
    fehler: (p) => [
      { ask: 1, v: 2 * p.m, msg: 'h = h_a + h_f. Die Fusshöhe ist 1,25 · m, nicht 1 · m.' },
    ],
    tipps: () => ['c = h_f − h_a', 'h_f = 1,25 · m, h_a = 1 · m', 'h = h_a + h_f'],
    loesung: (p) => [
      `a) ${eq(l('c') + ' = h_f − h_a = 1,25 · m − 1 · m = 0,25 · m = ' + mm(0.25 * p.m))}`,
      `b) ${eq(l('h') + ' = 2 · m + c = 2,25 · m = ' + mm(2.25 * p.m))}`,
      'Das Kopfspiel verhindert, dass der Zahnkopf auf dem Zahnfuss des Gegenrades aufsitzt.',
    ],
  }),

  // ---------- Radpaar: Achsabstand ----------

  task({
    id: 'z12', karte: 'paar', stufe: 1, familie: 'rechnen', src: 'nach Buch Aufgabe 4.5.8',
    title: 'Achsabstand zweier Stirnräder',
    gen: buch({ m: 4, z1: 17, z2: 84 }, () => ({ m: pick(MODUL), z1: rng(14, 30, 1), z2: rng(32, 90, 1) })),
    draw: (p) => B.paar(p, { m: `m = ${fmt(p.m)} mm`, a: 'a = ?' }),
    text: (p) => `Zwei geradverzahnte Stirnräder mit dem Modul ${l('m = ' + fmt(p.m) + ' mm')} und den Zähnezahlen ${p.z1} und ${p.z2} stehen im Eingriff. Berechne den Achsabstand a.`,
    asks: (p) => [{ k: 'a', unit: 'mm', v: a_(p.m, p.z1, p.z2) }],
    fehler: (p) => [
      { ask: 0, v: p.m * (p.z1 + p.z2), msg: 'Das ist die Summe der Durchmesser. Der Achsabstand ist die Summe der Radien: durch 2 teilen.' },
      { ask: 0, v: (da_(p.m, p.z1) + da_(p.m, p.z2)) / 2, msg: 'Du hast mit den Kopfkreisen gerechnet. Die Räder berühren sich auf dem Teilkreis.' },
    ],
    tipps: () => ['Die Teilkreise berühren sich. Der Achsabstand ist Radius 1 plus Radius 2.', 'a = (d_1 + d_2) : 2', 'a = m · (z_1 + z_2) : 2'],
    loesung: (p) => [
      `Formel: ${F.a}`,
      `Einsetzen: ${eq(l('a') + ' = ' + fmt(p.m) + ' mm · (' + p.z1 + ' + ' + p.z2 + ') : 2')}`,
      `Resultat: ${eq(l('a = ' + mm(a_(p.m, p.z1, p.z2))))}`,
    ],
  }),

  task({
    id: 'z13', karte: 'paar', stufe: 2, familie: 'umgekehrt', src: 'nach Buch Aufgabe 4.5.9',
    title: 'Zähnezahl des Gegenrades',
    gen: buch({ m: 2, z1: 36, z2: 108 }, () => ({ m: pick(MODUL), z1: rng(14, 40, 1), z2: rng(42, 120, 1) })),
    draw: (p) => B.paar(p, { m: `m = ${fmt(p.m)} mm`, a: `a = ${fmt(a_(p.m, p.z1, p.z2), 2)} mm`, z2: 'z_2 = ?' }),
    text: (p) => `Der Achsabstand zweier geradverzahnter Stirnräder ist ${l('a = ' + fmt(a_(p.m, p.z1, p.z2), 2) + ' mm')}. Das erste Zahnrad hat ${p.z1} Zähne und den Modul ${l('m = ' + fmt(p.m) + ' mm')}. Berechne die Zähnezahl z_2 des zweiten Zahnrades.`,
    asks: (p) => [{ k: 'z_2', unit: '', v: p.z2 }],
    fehler: (p) => [
      { ask: 0, v: p.z1 + p.z2, msg: '2 · a : m ist die Summe beider Zähnezahlen. Ziehe z_1 noch ab.' },
      { ask: 0, v: a_(p.m, p.z1, p.z2) / p.m - p.z1, msg: 'Du hast vergessen, den Achsabstand zu verdoppeln: z_1 + z_2 = 2 · a : m.' },
    ],
    tipps: () => ['a = m · (z_1 + z_2) : 2. Stelle nach z_2 um.', 'z_1 + z_2 = 2 · a : m', 'z_2 = 2 · a : m − z_1'],
    loesung: (p) => {
      const a = a_(p.m, p.z1, p.z2);
      return [
        `Umstellen: ${eq('z_2 = 2 · ' + l('a') + ' : m − z_1')}`,
        `Einsetzen: ${eq('z_2 = 2 · ' + fmt(a, 2) + ' mm : ' + fmt(p.m) + ' mm − ' + p.z1)}`,
        `Resultat: ${eq('z_2 = ' + (p.z1 + p.z2) + ' − ' + p.z1 + ' = ' + p.z2)}`,
        `Anderer Weg: ${eq(l('d_1') + ' = ' + mm(d_(p.m, p.z1)))}, ${eq(l('d_2') + ' = 2 · a − d_1 = ' + mm(d_(p.m, p.z2)))}, ${eq('z_2 = d_2 : m')}.`,
      ];
    },
  }),

  task({
    id: 'z14', karte: 'paar', stufe: 3, familie: 'kette',
    title: 'Achsabstand und Übersetzung gegeben',
    gen: () => { const m = pick([1, 1.5, 2, 2.5, 3]), z1 = rng(14, 30, 1), i = pick([2, 3, 4]); return { m, z1, i, z2: i * z1 }; },
    draw: (p) => B.paar(p, { m: `m = ${fmt(p.m)} mm`, a: `a = ${fmt(a_(p.m, p.z1, p.z2), 2)} mm`, z1: 'z_1 = ?', z2: 'z_2 = ?' }),
    text: (p) => `Ein Getriebe soll die Übersetzung ${eq('i = z_2 : z_1 = ' + p.i)} haben. Der Achsabstand ist ${l('a = ' + fmt(a_(p.m, p.z1, p.z2), 2) + ' mm')}, der Modul ${l('m = ' + fmt(p.m) + ' mm')}. Berechne a) die Zähnezahl z_1 des Ritzels, b) die Zähnezahl z_2 des grossen Rades.`,
    asks: (p) => [
      { k: 'a) z_1', unit: '', v: p.z1 },
      { k: 'b) z_2', unit: '', v: p.z2 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.z1 + p.z2, msg: '2 · a : m ist z_1 + z_2. Teile diese Summe im Verhältnis 1 : i auf.' },
      { ask: 0, v: (p.z1 + p.z2) / p.i, msg: 'z_1 + z_2 = z_1 · (1 + i). Teile also durch (1 + i), nicht durch i.' },
    ],
    tipps: () => ['Zuerst die Summe der Zähnezahlen: z_1 + z_2 = 2 · a : m.', 'z_2 = i · z_1, also z_1 + i · z_1 = z_1 · (1 + i).', 'z_1 = (z_1 + z_2) : (1 + i)'],
    loesung: (p) => [
      `${eq('z_1 + z_2 = 2 · ' + l(fmt(a_(p.m, p.z1, p.z2), 2) + ' mm') + ' : ' + fmt(p.m) + ' mm = ' + (p.z1 + p.z2))}`,
      `${eq('z_1 = ' + (p.z1 + p.z2) + ' : (1 + ' + p.i + ') = ' + p.z1)}`,
      `${eq('z_2 = ' + p.i + ' · ' + p.z1 + ' = ' + p.z2)}`,
      `Probe: ${eq(l('a') + ' = ' + fmt(p.m) + ' · (' + p.z1 + ' + ' + p.z2 + ') : 2 = ' + mm(a_(p.m, p.z1, p.z2)))}`,
    ],
  }),

  task({
    id: 'z15', karte: 'paar', stufe: 3, familie: 'kette',
    title: 'Ersatzrad: messen, Modul, Achsabstand',
    gen: () => { const m = pick([1.5, 2, 2.5, 3]), z1 = rng(16, 30, 1), z2 = rng(40, 80, 1); return { m, z1, z2 }; },
    draw: (p) => B.paar(p, { z1: `z_1 = ${p.z1}, d_a1 = ${fmt(da_(p.m, p.z1), 2)} mm`, a: 'a = ?' }),
    text: (p) => `Am Ritzel eines Getriebes zählst du ${p.z1} Zähne und misst ${l('d_a1 = ' + fmt(da_(p.m, p.z1), 2) + ' mm')}. Das Gegenrad hat ${p.z2} Zähne. Berechne a) den Modul m, b) den Achsabstand a.`,
    asks: (p) => [
      { k: 'a) m', unit: 'mm', v: p.m },
      { k: 'b) a', unit: 'mm', v: a_(p.m, p.z1, p.z2) },
    ],
    fehler: (p) => [
      { ask: 0, v: da_(p.m, p.z1) / p.z1, msg: 'Gemessen ist der Kopfkreis. m = d_a : (z + 2).' },
      { ask: 1, v: p.m * (p.z1 + p.z2), msg: 'Durch 2 teilen. Der Achsabstand ist die Summe der Teilkreis-Radien.' },
    ],
    tipps: () => ['Erst den Modul aus dem Kopfkreis.', 'm = d_a1 : (z_1 + 2)', 'a = m · (z_1 + z_2) : 2'],
    loesung: (p) => [
      `a) ${eq('m = ' + l('d_a1') + ' : (z_1 + 2) = ' + fmt(da_(p.m, p.z1), 2) + ' mm : ' + (p.z1 + 2) + ' = ' + fmt(p.m) + ' mm')}`,
      `b) ${eq(l('a') + ' = ' + fmt(p.m) + ' mm · (' + p.z1 + ' + ' + p.z2 + ') : 2 = ' + mm(a_(p.m, p.z1, p.z2)))}`,
    ],
  }),

  task({
    id: 'z16', karte: 'paar', stufe: 1, familie: 'begruenden',
    title: 'Passen diese Räder zusammen?',
    gen: () => { const m1 = pick([2, 3]); return { m1, m2: m1 === 2 ? 2.5 : 4, z1: rng(18, 30, 1), z2: rng(40, 60, 1) }; },
    draw: (p) => B.paar(p, { z1: `m = ${fmt(p.m1)} mm`, z2: `m = ${fmt(p.m2)} mm`, a: 'a = ?' }),
    text: (p) => `Im Lager liegen ein Ritzel mit dem Modul ${l(fmt(p.m1) + ' mm')} und ein Rad mit dem Modul ${l(fmt(p.m2) + ' mm')}. Ein Kollege will sie zusammen einbauen. Was stimmt?`,
    asks: () => [{
      kind: 'choice', k: 'Aussage',
      opts: [
        'Das geht, wenn der Achsabstand stimmt.',
        'Das geht nicht. Räder im Eingriff brauchen denselben Modul.',
        'Das geht, das kleine Rad muss treiben.',
        'Das geht mit mehr Kopfspiel.',
      ],
      a: 1,
      why: [
        'Der Achsabstand passt nie richtig. Die Zähne haben verschiedene Teilungen p = π · m und greifen nicht ineinander.',
        undefined,
        'Welches Rad treibt, ändert nichts an der Teilung.',
        'Das Kopfspiel ändert die Zahnhöhe, nicht die Teilung. Die Zähne treffen trotzdem nicht in die Lücken.',
      ],
    }],
    tipps: () => ['Was muss bei beiden Rädern gleich sein, damit die Zähne in die Lücken passen?', 'Die Teilung p = π · m.', 'Gleiche Teilung heisst gleicher Modul.'],
    loesung: (p) => [
      `Teilung Ritzel: ${eq(l('p') + ' = π · ' + fmt(p.m1) + ' = ' + fmt(PI * p.m1, 2) + ' mm')}`,
      `Teilung Rad: ${eq(l('p') + ' = π · ' + fmt(p.m2) + ' = ' + fmt(PI * p.m2, 2) + ' mm')}`,
      'Die Zähne haben verschiedene Abstände. Sie passen nicht in die Lücken. Räder im Eingriff haben immer denselben Modul.',
    ],
  }),

  // ---------- Fehler und Plausibilität ----------

  task({
    id: 'z17', karte: 'pruefen', stufe: 2, familie: 'fehler',
    title: 'Fehler finden: Masse eines Rades',
    gen: () => ({ m: pick([2, 2.5, 3, 4]), z: rng(20, 50, 1) }),
    draw: (p) => B.rad(p, { z: `z = ${p.z}`, m: `m = ${fmt(p.m)} mm` }),
    text: (p) => `Ein Lernender rechnet für ein Rad mit ${p.z} Zähnen und ${l('m = ' + fmt(p.m) + ' mm')}: ${eq('d = ' + mm(d_(p.m, p.z)))}, ${eq('d_a = ' + mm(da_(p.m, p.z)))}, ${eq('d_f = ' + mm(p.m * (p.z - 2)))}. Welcher Wert ist falsch?`,
    asks: (p) => [{
      kind: 'choice', k: 'Falscher Wert',
      opts: [`d = ${mm(d_(p.m, p.z))}`, `d_a = ${mm(da_(p.m, p.z))}`, `d_f = ${mm(p.m * (p.z - 2))}`, 'Alle Werte stimmen.'],
      a: 2,
      why: ['d = m · z stimmt.', 'd_a = m · (z + 2) stimmt.', undefined, `d_f ist falsch. Er hat h_f = m genommen. Richtig ist h_f = 1,25 · m, also d_f = ${mm(df_(p.m, p.z))}.`],
    }],
    tipps: () => ['Prüfe jeden Wert mit der Formel.', 'd_f = m · (z − 2,5)', 'Wo fehlt das Kopfspiel?'],
    loesung: (p) => [
      `${eq(l('d') + ' = ' + fmt(p.m) + ' · ' + p.z + ' = ' + mm(d_(p.m, p.z)))} stimmt.`,
      `${eq(l('d_a') + ' = ' + fmt(p.m) + ' · (' + p.z + ' + 2) = ' + mm(da_(p.m, p.z)))} stimmt.`,
      `${eq(l('d_f') + ' = ' + fmt(p.m) + ' · (' + p.z + ' − 2,5) = ' + mm(df_(p.m, p.z)))}. Der Lernende hat das Kopfspiel vergessen.`,
    ],
  }),

  task({
    id: 'z18', karte: 'pruefen', stufe: 1, familie: 'schaetzen',
    title: 'Kopfrechnen: Kopfkreis',
    gen: () => { const m = pick([1, 2, 3, 5]); const z = pick([20, 30, 40, 50]); return { m, z }; },
    draw: (p) => B.rad(p, { z: `z = ${p.z}`, m: `m = ${fmt(p.m)} mm`, da: 'd_a = ?' }),
    text: (p) => `Ohne Taschenrechner: Ein Rad hat ${p.z} Zähne und ${l('m = ' + fmt(p.m) + ' mm')}. Wie gross ist der Kopfkreis d_a?`,
    asks: (p) => {
      const r = da_(p.m, p.z);
      const opts = [p.m * p.z, p.m * (p.z + 1), r, p.m * (p.z + 2.5)];
      return [{
        kind: 'choice', k: 'd_a',
        opts: opts.map((x) => mm(x)),
        a: 2,
        why: ['Das ist der Teilkreis d.', 'Die Kopfhöhe kommt zweimal dazu: + 2 · m.', undefined, 'Die 2,5 gehört zum Fusskreis, mit Minus.'],
      }];
    },
    tipps: () => ['Erst d = m · z im Kopf.', 'Dann zweimal m dazu.', 'd_a = d + 2 · m'],
    loesung: (p) => [`${eq(l('d') + ' = ' + fmt(p.m) + ' · ' + p.z + ' = ' + mm(d_(p.m, p.z)))}`, `${eq(l('d_a') + ' = ' + mm(d_(p.m, p.z)) + ' + 2 · ' + fmt(p.m) + ' mm = ' + mm(da_(p.m, p.z)))}`],
  }),

  task({
    id: 'z19', karte: 'pruefen', stufe: 2, familie: 'bild',
    title: 'Welcher Kreis ist welcher?',
    gen: () => ({ m: pick([2, 3, 4]), z: rng(24, 40, 1) }),
    draw: (p) => B.rad(p, { da: `${mm(df_(p.m, p.z))}`, d: `${mm(d_(p.m, p.z))}`, df: `${mm(da_(p.m, p.z))}`, z: `z = ${p.z}` }),
    text: (p) => `Im Bild hat jemand die drei Durchmesser angeschrieben (Modul ${l(fmt(p.m) + ' mm')}). Was stimmt?`,
    asks: () => [{
      kind: 'choice', k: 'Aussage',
      opts: [
        'Alles richtig angeschrieben.',
        'Kopfkreis und Fusskreis sind vertauscht.',
        'Teilkreis und Kopfkreis sind vertauscht.',
        'Teilkreis und Fusskreis sind vertauscht.',
      ],
      a: 1,
      why: ['Der äussere Kreis ist der grösste. Dort steht aber der kleinste Wert.', undefined, 'Der Teilkreis hat den mittleren Wert. Er ist richtig angeschrieben.', 'Der Teilkreis hat den mittleren Wert. Er ist richtig angeschrieben.'],
    }],
    tipps: () => ['Ordne die Kreise nach Grösse: aussen, Mitte, innen.', 'd_f < d < d_a', 'Wo steht der grösste Wert?'],
    loesung: (p) => [
      `Richtig: ${eq(l('d_a = ' + mm(da_(p.m, p.z))))} aussen, ${eq(l('d = ' + mm(d_(p.m, p.z))))} Mitte, ${eq(l('d_f = ' + mm(df_(p.m, p.z))))} innen.`,
      'Im Bild stehen Kopfkreis und Fusskreis vertauscht.',
    ],
  }),
];

/** Fehlwerte, die zu nah am richtigen Wert liegen (z. B. m = 1 oder grosse z), fallen weg. */
export const AUFGABEN: Task[] = LISTE.map((t) =>
  t.fehler
    ? {
        ...t,
        fehler: (p) =>
          t.fehler!(p).filter((e) => {
            const a = t.asks(p)[e.ask];
            return !('kind' in a) || a.kind !== 'choice' ? Math.abs(e.v - (a as { v: number }).v) > 0.05 * Math.abs((a as { v: number }).v) : true;
          }),
      }
    : t,
);
