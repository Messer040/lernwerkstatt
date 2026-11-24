// Aufgaben zum Kapitel Einfache Maschinen, Flaschenzüge: Rollen, schiefe Ebene, Keil, Schraube.
import { task, type Task } from '../../../core/types';
import { eq, f, l } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import * as B from './bilder';

const g = 9.81;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const d2 = (x: number) => fmt(x, 2);
const KR = {
  neu: 'Kreativ · Neue Situation',
  um: 'Kreativ · Umgekehrt gefragt',
  komb: 'Kreativ · Themen kombiniert',
  fehl: 'Kreativ · Fehler finden',
  kopf: 'Kreativ · Abschätzen, ohne Taschenrechner',
  wenn: 'Kreativ · Was wäre wenn',
  bild: 'Kreativ · Bild deuten',
  beg: 'Kreativ · Begründen',
};

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

/** Schiefe Ebene aus Höhe und Länge zeichnen. */
const eb = (p: { h: number; s: number }, o: Parameters<typeof B.ebene>[1] = {}) =>
  B.ebene({ al: Math.max(8, deg(Math.asin(p.h / p.s))) }, { FG: 'F_G', F: 'F', h: `h = ${fmt(p.h)} m`, l: `s = ${fmt(p.s)} m`, ...o });

export const AUFGABEN: Task[] = [
  // ---------- Rollen und Flaschenzüge ----------

  task({
    id: 'm1', karte: 'rollen', stufe: 1, familie: 'rechnen', src: 'Rechenbuch, Rollen',
    title: 'Feste Rolle',
    gen: () => ({ m: rng(10, 60, 5), h: rng(1, 6, 1) }),
    draw: (p) => B.rolle({ typ: 'fest', F: 'F = ?', FG: 'F_G', h: `Hubhöhe h = ${p.h} m`, m: `m = ${p.m} kg` }),
    text: (p) => `Eine Last mit m = ${p.m} kg wird mit einer festen Rolle um ${l('h = ' + p.h + ' m')} gehoben. Reibung wird vernachlässigt. Berechne a) die Zugkraft F und b) den Seilweg s. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) F', unit: 'N', v: p.m * g },
      { k: 'b) s', unit: 'm', v: p.h },
    ],
    fehler: (p) => [
      { ask: 0, v: p.m, msg: 'Du hast g vergessen. Die Zugkraft ist die Gewichtskraft F_G = m · g.' },
      { ask: 1, v: 2 * p.h, msg: 'Doppelter Weg gilt für die lose Rolle. Bei der festen Rolle ist der Seilweg gleich der Hubhöhe.' },
    ],
    tipps: () => ['Die feste Rolle ändert nur die Richtung der Kraft.', 'Die Zugkraft F ist gleich der Gewichtskraft F_G = m · g. Der Seilweg s ist gleich der Hubhöhe h.', 'F = m · g und s = h'],
    loesung: (p) => [
      `Gewichtskraft: ${eq(f('F_G') + ' = m · g = ' + p.m + ' kg · 9,81 m/s² = ' + f(fmt(p.m * g) + ' N'))}`,
      `Feste Rolle: ${eq(f('F') + ' = ' + f('F_G') + ' = ' + f(fmt(p.m * g) + ' N'))}`,
      `Seilweg: ${eq(l('s') + ' = ' + l('h') + ' = ' + l(p.h + ' m'))}`,
      'Vorstellung: Man spart keine Kraft. Man zieht aber bequem nach unten statt nach oben.',
    ],
  }),

  task({
    id: 'm2', karte: 'rollen', stufe: 1, familie: 'rechnen', src: 'Rechenbuch, Rollen',
    title: 'Lose Rolle',
    gen: () => ({ m: rng(20, 120, 10), h: rng(1, 6, 1) }),
    draw: (p) => B.rolle({ typ: 'lose', F: 'F = ?', FG: 'F_G', h: `Hubhöhe h = ${p.h} m`, m: `m = ${p.m} kg` }),
    text: (p) => `Eine Last mit m = ${p.m} kg hängt an einer losen Rolle. Sie wird um ${l('h = ' + p.h + ' m')} gehoben. Reibung und Rollengewicht werden vernachlässigt. Berechne a) die Zugkraft F und b) den Seilweg s. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) F', unit: 'N', v: (p.m * g) / 2 },
      { k: 'b) s', unit: 'm', v: 2 * p.h },
    ],
    fehler: (p) => [
      { ask: 0, v: p.m * g, msg: 'Du hast nicht halbiert. Zwei Seilstränge tragen die Last, jeder nur die Hälfte.' },
      { ask: 1, v: p.h, msg: 'Der Seilweg ist doppelt so lang wie die Hubhöhe. Halbe Kraft heisst doppelter Weg.' },
    ],
    tipps: () => ['Die Last hängt an zwei Seilsträngen. Jeder trägt die Hälfte.', 'F = F_G : 2. Dafür musst du doppelt so viel Seil ziehen.', 'F = m · g : 2 und s = 2 · h'],
    loesung: (p) => [
      `Gewichtskraft: ${eq(f('F_G') + ' = m · g = ' + f(fmt(p.m * g) + ' N'))}`,
      `Zwei tragende Seile: ${eq(f('F') + ' = ' + f('F_G') + ' : 2 = ' + f(fmt((p.m * g) / 2) + ' N'))}`,
      `Seilweg: ${eq(l('s') + ' = 2 · ' + l('h') + ' = ' + l(2 * p.h + ' m'))}`,
      `Goldene Regel: ${eq(f('F') + ' · ' + l('s') + ' = ' + f('F_G') + ' · ' + l('h'))}. Halbe Kraft, doppelter Weg. Die Arbeit bleibt gleich.`,
    ],
  }),

  task({
    id: 'm3', karte: 'rollen', stufe: 2, familie: 'rechnen', src: 'Rechenbuch, Flaschenzug',
    title: 'Flaschenzug',
    gen: () => ({ m: rng(100, 800, 100), n: pick([2, 3, 4, 6]), h: rng(1, 5, 1) }),
    draw: (p) => B.rolle({ typ: 'zug', n: p.n, F: 'F = ?', FG: 'F_G', h: `Hubhöhe h = ${p.h} m`, m: `m = ${p.m} kg` }),
    text: (p) => `Ein Flaschenzug hat n = ${p.n} tragende Seile. Er hebt m = ${p.m} kg um ${l('h = ' + p.h + ' m')}. Reibung wird vernachlässigt. Berechne a) die Zugkraft F und b) den Seilweg s. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) F', unit: 'N', v: (p.m * g) / p.n },
      { k: 'b) s', unit: 'm', v: p.n * p.h },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.m * g) / (p.n + 1), msg: 'Du hast ein Seil zu viel gezählt. Das Zugseil trägt die Last nicht. Teile durch n.' },
      { ask: 1, v: p.h, msg: 'Der Seilweg ist n-mal so lang wie die Hubhöhe: s = n · h.' },
    ],
    tipps: () => ['Zähle die Seile, an denen die untere Flasche hängt. Das sind die tragenden Seile.', 'F = F_G : n und s = n · h', 'Rechne zuerst F_G = m · g. Teile dann durch n.'],
    loesung: (p) => [
      `Gewichtskraft: ${eq(f('F_G') + ' = m · g = ' + f(fmt(p.m * g) + ' N'))}`,
      `Die Last verteilt sich auf ${p.n} Seile: ${eq(f('F') + ' = ' + f('F_G') + ' : n = ' + fmt(p.m * g) + ' N : ' + p.n + ' = ' + f(fmt((p.m * g) / p.n) + ' N'))}`,
      `Seilweg: ${eq(l('s') + ' = n · ' + l('h') + ' = ' + p.n + ' · ' + p.h + ' m = ' + l(p.n * p.h + ' m'))}`,
      `Kontrolle mit der Arbeit: ${eq(fmt((p.m * g) / p.n) + ' N · ' + p.n * p.h + ' m = ' + fmt(p.m * g * p.h) + ' J')} und ${eq(fmt(p.m * g) + ' N · ' + p.h + ' m = ' + fmt(p.m * g * p.h) + ' J')}. Gleich.`,
    ],
  }),

  task({
    id: 'm4', karte: 'rollen', stufe: 2, familie: 'rechnen', src: 'Rechenbuch, Flaschenzug mit η',
    title: 'Flaschenzug mit Wirkungsgrad',
    gen: () => ({ m: rng(100, 800, 100), n: pick([2, 3, 4, 6]), eta: pick([0.8, 0.85, 0.9]) }),
    draw: (p) => B.rolle({ typ: 'zug', n: p.n, F: 'F = ?', FG: 'F_G', m: `m = ${p.m} kg`, x: `η = ${fmt(p.eta, 2)}` }),
    text: (p) => `Ein Flaschenzug mit n = ${p.n} tragenden Seilen hebt m = ${p.m} kg. Wegen der Reibung ist der Wirkungsgrad η = ${fmt(p.eta, 2)}. Berechne a) die Zugkraft ohne Reibung und b) die wirkliche Zugkraft F. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) ohne Reibung', unit: 'N', v: (p.m * g) / p.n },
      { k: 'b) F', unit: 'N', v: (p.m * g) / p.n / p.eta },
    ],
    fehler: (p) => [
      { ask: 1, v: (p.m * g) / p.n, msg: 'Das ist die Kraft ohne Reibung. Mit Reibung brauchst du mehr Kraft: durch η teilen.' },
      { ask: 1, v: ((p.m * g) / p.n) * p.eta, msg: 'Du hast mit η multipliziert. Die Kraft wird dadurch kleiner. Mit Reibung braucht es mehr Kraft, also durch η teilen.' },
    ],
    tipps: () => ['Zuerst ohne Reibung: F = F_G : n.', 'Mit Reibung braucht man mehr Kraft. Also durch η teilen.', 'F = F_G : (n · η)'],
    loesung: (p) => [
      `Ohne Reibung: ${eq(f('F') + ' = ' + f('F_G') + ' : n = ' + fmt(p.m * g) + ' N : ' + p.n + ' = ' + f(fmt((p.m * g) / p.n) + ' N'))}`,
      `Mit Reibung: ${eq(f('F') + ' = ' + f('F_G') + ' : (n · η) = ' + fmt(p.m * g) + ' N : (' + p.n + ' · ' + fmt(p.eta, 2) + ')')}`,
      `Resultat: ${eq(f('F = ' + fmt((p.m * g) / p.n / p.eta) + ' N'))}`,
      'Kontrolle: Die wirkliche Kraft muss grösser sein als die Kraft ohne Reibung.',
    ],
  }),

  task({
    id: 'm5', karte: 'rollen', stufe: 1, familie: 'bild', src: KR.bild,
    title: 'Wie viele Seile tragen?',
    gen: () => ({ n: pick([2, 3, 4, 5]), m: pick([100, 200, 300, 400, 500]) }),
    draw: (p) => B.rolle({ typ: 'zug', n: p.n, anzahl: false, F: 'F = ?', FG: 'F_G', m: `m = ${p.m} kg` }),
    text: (p) => `Schau auf das Bild. Das Seil läuft von oben über die Rollen zur Last. a) Wie viele Seile tragen die untere Flasche mit der Last? b) Berechne die Zugkraft F bei m = ${p.m} kg ohne Reibung. (g = 9,81 m/s²)`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) tragende Seile', opts: ['2', '3', '4', '5', '6'], a: p.n - 2,
        why: ['2', '3', '4', '5', '6'].map((_, i) =>
          i === p.n - 2 ? undefined : i === p.n - 1 ? 'Du hast das Zugseil mitgezählt. Es führt zur Hand und trägt die Last nicht.' : i === p.n - 3 ? 'Zähle nochmals. Jedes Seil, das von der oberen zur unteren Flasche läuft, trägt.' : 'Zähle die Seile zwischen den beiden Flaschen.'),
      },
      { k: 'b) F', unit: 'N', v: (p.m * g) / p.n },
    ],
    fehler: (p) => [{ ask: 1, v: (p.m * g) / (p.n + 1), msg: 'Du hast durch ein Seil zu viel geteilt. Das Zugseil trägt nicht.' }],
    tipps: () => ['Zähle nur die Seile zwischen der oberen und der unteren Flasche.', 'Das Seil, an dem die Hand zieht, trägt die Last nicht mit.', 'F = m · g : n'],
    loesung: (p) => [
      `Zwischen den beiden Flaschen laufen ${p.n} Seile. Das sind die tragenden Seile: ${eq('n = ' + p.n)}`,
      `Zugkraft: ${eq(f('F') + ' = m · g : n = ' + p.m + ' kg · 9,81 m/s² : ' + p.n + ' = ' + f(fmt((p.m * g) / p.n) + ' N'))}`,
      'Das Zugseil läuft nur zur Hand. Es trägt keine Last.',
    ],
  }),

  task({
    id: 'm6', karte: 'rollen', stufe: 2, familie: 'fehler', src: KR.fehl,
    title: 'Fehler finden: Tims Flaschenzug',
    gen: () => ({ m: rng(200, 800, 100), n: pick([2, 3, 4]) }),
    draw: (p) => B.rolle({ typ: 'zug', n: p.n, F: 'F = ?', FG: 'F_G', m: `m = ${p.m} kg`, hl: true }),
    text: (p) => `Tim hebt m = ${p.m} kg mit einem Flaschenzug mit n = ${p.n} tragenden Seilen. Er rechnet: «F = F_G : (n + 1) = ${fmt(p.m * g)} N : ${p.n + 1} = ${fmt((p.m * g) / (p.n + 1))} N, denn ich ziehe ja auch am Zugseil.» a) Was ist falsch? b) Wie gross ist die Zugkraft richtig? (g = 9,81 m/s²)`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: [
          'Das Zugseil trägt die Last nicht. Er hat ein Seil zu viel gezählt.',
          'Er hätte mit n multiplizieren müssen.',
          'Er hätte g weglassen müssen.',
          'Nichts, die Rechnung stimmt.',
        ],
        a: 0,
        why: [undefined, 'Mehr Seile heissen weniger Kraft. Man teilt durch n, man multipliziert nicht.', 'Die Gewichtskraft ist m · g. Ohne g fehlt die Erdanziehung.', 'Es tragen nur die n Seile an der unteren Flasche. Das Zugseil zählt nicht.'],
      },
      { k: 'b) F', unit: 'N', v: (p.m * g) / p.n },
    ],
    fehler: (p) => [{ ask: 1, v: (p.m * g) / (p.n + 1), msg: 'Das ist Tims Wert. Er hat das Zugseil mitgezählt.' }],
    tipps: () => ['Schau im Bild, welche Seile die Last tragen (blau markiert).', 'Das Zugseil läuft zur Hand. Es trägt nichts.', 'F = F_G : n'],
    loesung: (p) => [
      'Tim hat das Zugseil als tragendes Seil mitgezählt. Es hält die Last aber nicht.',
      `Richtig: ${eq(f('F') + ' = ' + f('F_G') + ' : n = ' + fmt(p.m * g) + ' N : ' + p.n + ' = ' + f(fmt((p.m * g) / p.n) + ' N'))}`,
      'Kontrolle: Tims Wert ist zu klein. Mit so wenig Kraft könnte er die Last nicht halten.',
    ],
  }),

  task({
    id: 'm7', karte: 'rollen', stufe: 2, familie: 'umgekehrt', src: KR.um,
    title: 'Wie viele tragende Seile braucht es?',
    gen: () => ({ m: pick([100, 150, 200, 250, 300]), Fmax: pick([400, 500, 600]) }),
    draw: (p) => B.rolle({ typ: 'zug', n: 3, anzahl: false, F: `F ≤ ${p.Fmax} N`, FG: 'F_G', m: `m = ${p.m} kg` }),
    text: (p) => `Ein Monteur kann dauernd höchstens ${f(p.Fmax + ' N')} Zugkraft aufbringen. Er will m = ${p.m} kg mit einem Flaschenzug heben, ohne Reibung. a) Wie viele tragende Seile braucht der Flaschenzug mindestens? b) Wie gross ist die Zugkraft mit dieser Seilzahl? (g = 9,81 m/s²)`,
    asks: (p) => {
      const n = Math.ceil((p.m * g) / p.Fmax);
      return [
        { k: 'a) n mindestens', unit: '', v: n },
        { k: 'b) F', unit: 'N', v: (p.m * g) / n },
      ];
    },
    fehler: (p) => [{ ask: 0, v: Math.ceil((p.m * g) / p.Fmax) - 1, msg: 'Mit einem Seil weniger wäre die Kraft zu gross. Runde auf, nie ab. Es muss eine ganze Seilzahl sein.' }],
    tipps: () => ['Aus F = F_G : n folgt n = F_G : F.', 'Rechne F_G = m · g. Teile durch die erlaubte Kraft.', 'Das Ergebnis ist selten ganz. Runde immer auf die nächste ganze Zahl auf.'],
    loesung: (p) => {
      const FG = p.m * g, r = FG / p.Fmax, n = Math.ceil(r);
      return [
        `Gewichtskraft: ${eq(f('F_G') + ' = ' + p.m + ' kg · 9,81 m/s² = ' + f(fmt(FG) + ' N'))}`,
        `Seile: ${eq('n = ' + f('F_G') + ' : ' + f('F') + ' = ' + fmt(FG) + ' N : ' + p.Fmax + ' N = ' + d2(r))}`,
        `Aufrunden: ${eq('n = ' + n)}`,
        `Zugkraft: ${eq(f('F') + ' = ' + fmt(FG) + ' N : ' + n + ' = ' + f(fmt(FG / n) + ' N'))}. Das liegt unter ${p.Fmax} N.`,
      ];
    },
  }),

  task({
    id: 'm8', karte: 'rollen', stufe: 1, familie: 'schaetzen', src: KR.kopf,
    title: 'Flaschenzug im Kopf',
    gen: () => ({ m: pick([100, 200, 500, 1000]), n: pick([2, 4, 5]) }),
    draw: (p) => B.rolle({ typ: 'zug', n: p.n, F: 'F = ?', FG: 'F_G', m: `m = ${p.m} kg` }),
    text: (p) => `Ohne Taschenrechner: Ein Flaschenzug hat ${p.n} tragende Seile und hebt m = ${p.m} kg. Schätze die Zugkraft F ohne Reibung. Rechne mit g ≈ 10 m/s². Eine Abweichung von 5 % ist erlaubt.`,
    asks: (p) => [{ k: 'F', unit: 'N', v: (p.m * g) / p.n, tol: 0.05 }],
    fehler: (p) => [{ ask: 0, v: p.m / p.n, msg: 'Du hast g vergessen. Die Last wiegt m · g, nicht nur m.' }],
    tipps: () => ['Gewichtskraft grob: F_G ≈ m · 10.', 'Teile F_G durch die Zahl der tragenden Seile.', 'Beispiel: 200 kg ≈ 2000 N. Bei 4 Seilen sind das 500 N.'],
    loesung: (p) => [
      `Gewichtskraft gerundet: ${eq(f('F_G') + ' ≈ ' + p.m + ' · 10 = ' + f(p.m * 10 + ' N'))}`,
      `Zugkraft gerundet: ${eq(f('F') + ' ≈ ' + p.m * 10 + ' N : ' + p.n + ' = ' + f(fmt((p.m * 10) / p.n) + ' N'))}`,
      `Genau mit g = 9,81: ${eq(f('F = ' + fmt((p.m * g) / p.n) + ' N'))}`,
    ],
  }),

  task({
    id: 'm9', karte: 'rollen', stufe: 2, familie: 'begruenden', src: KR.beg,
    title: 'Was kostet der Flaschenzug?',
    gen: () => ({ n: pick([3, 4, 5]), h: pick([1, 2, 3]), m: pick([100, 200, 300]) }),
    draw: (p) => B.rolle({ typ: 'zug', n: p.n, F: 'F', FG: 'F_G', h: `Hubhöhe h = ${p.h} m`, m: `m = ${p.m} kg` }),
    text: (p) => `Ein Flaschenzug mit n = ${p.n} tragenden Seilen hebt eine Last um ${l('h = ' + p.h + ' m')}. Man braucht dafür nur den ${p.n}-ten Teil der Kraft. a) Was bezahlt man dafür? b) Wie viele Meter Seil muss man ziehen?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Preis',
        opts: [
          `Man zieht ${p.n}-mal so viel Seil. Die Arbeit bleibt gleich.`,
          `Die Arbeit wird auch ${p.n}-mal kleiner.`,
          `Man braucht ${p.n}-mal mehr Arbeit.`,
          'Nichts. Man hat Arbeit gespart.',
        ],
        a: 0,
        why: [undefined, 'Weniger Kraft heisst nicht weniger Arbeit. Der Weg wird länger, die Arbeit F · s bleibt.', 'Die Arbeit bleibt gleich. Nur Kraft und Weg tauschen sich aus.', 'Arbeit lässt sich mit einfachen Maschinen nicht sparen. Das ist die goldene Regel.'],
      },
      { k: 'b) Seilweg s', unit: 'm', v: p.n * p.h },
    ],
    fehler: (p) => [{ ask: 1, v: p.h, msg: 'Das ist nur die Hubhöhe. Der Seilweg ist n-mal so lang: s = n · h.' }],
    tipps: () => ['Goldene Regel: Was man an Kraft spart, zahlt man an Weg.', 'F · s = F_G · h. Kleine Kraft F heisst grosser Weg s.', 's = n · h'],
    loesung: (p) => [
      `Goldene Regel: ${eq(f('F') + ' · ' + l('s') + ' = ' + f('F_G') + ' · ' + l('h'))}`,
      `Mit ${f('F = F_G : n')} folgt ${eq(l('s') + ' = n · ' + l('h') + ' = ' + p.n + ' · ' + p.h + ' m = ' + l(p.n * p.h + ' m'))}`,
      'Man zieht mehr Seil und braucht weniger Kraft. Die Arbeit bleibt dieselbe.',
    ],
  }),

  // ---------- Schiefe Ebene ----------

  task({
    id: 'm10', karte: 'ebene', stufe: 1, familie: 'rechnen', src: 'Rechenbuch, schiefe Ebene',
    title: 'Rampe',
    gen: () => {
      const h = pick([1, 1.2, 1.5, 2]), s = pick([4, 5, 6, 8]);
      return { m: rng(50, 400, 50), h, s };
    },
    draw: (p) => eb(p, { F: 'F = ?', m: `m = ${p.m} kg` }),
    text: (p) => `Ein Fass mit m = ${p.m} kg wird über eine Rampe auf eine Ladefläche gerollt. Die Rampe ist ${l('s = ' + p.s + ' m')} lang und ${l('h = ' + fmt(p.h) + ' m')} hoch. Reibung wird vernachlässigt. Berechne a) die Gewichtskraft F_G und b) die Kraft F entlang der Rampe. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) F_G', unit: 'N', v: p.m * g },
      { k: 'b) F', unit: 'N', v: (p.m * g * p.h) / p.s },
    ],
    fehler: (p) => [
      { ask: 0, v: p.m, msg: 'Du hast g vergessen. F_G = m · g.' },
      { ask: 1, v: (p.m * g * p.s) / p.h, msg: 'Du hast h und s vertauscht. Die Kraft muss kleiner sein als F_G, nicht grösser.' },
      { ask: 1, v: p.m * g, msg: 'Das ist die ganze Gewichtskraft. Die Rampe nimmt einen Teil ab: F = F_G · h : s.' },
    ],
    tipps: () => ['Goldene Regel: Arbeit auf der Rampe = Hubarbeit.', 'F · s = F_G · h', 'F = F_G · h : s'],
    loesung: (p) => [
      `Gewichtskraft: ${eq(f('F_G') + ' = m · g = ' + f(fmt(p.m * g) + ' N'))}`,
      `Goldene Regel: ${eq(f('F') + ' · ' + l('s') + ' = ' + f('F_G') + ' · ' + l('h'))}`,
      `Umstellen: ${eq(f('F') + ' = ' + f('F_G') + ' · ' + l('h') + ' : ' + l('s') + ' = ' + fmt(p.m * g) + ' N · ' + fmt(p.h) + ' m : ' + p.s + ' m')}`,
      `Resultat: ${eq(f('F = ' + fmt((p.m * g * p.h) / p.s) + ' N'))}`,
      'Vorstellung: Je länger die Rampe, desto kleiner die Kraft. Der Weg wird aber länger.',
    ],
  }),

  task({
    id: 'm11', karte: 'ebene', stufe: 2, familie: 'rechnen', src: 'Rechenbuch, schiefe Ebene',
    title: 'Kraft zerlegen auf der schiefen Ebene',
    gen: () => ({ m: rng(50, 300, 50), al: pick([15, 20, 25, 30, 35]) }),
    draw: (p) => B.ebene({ al: p.al }, { comp: [60, 70], FH: 'F_H = ?', FN: 'F_N = ?', al: `α = ${p.al}°`, m: `m = ${p.m} kg` }),
    text: (p) => `Eine Kiste mit m = ${p.m} kg liegt auf einer schiefen Ebene mit α = ${p.al}°. Berechne a) die Gewichtskraft F_G, b) die Hangabtriebskraft F_H und c) die Normalkraft F_N. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) F_G', unit: 'N', v: p.m * g },
      { k: 'b) F_H', unit: 'N', v: p.m * g * Math.sin(rad(p.al)) },
      { k: 'c) F_N', unit: 'N', v: p.m * g * Math.cos(rad(p.al)) },
    ],
    fehler: (p) => [
      { ask: 1, v: p.m * g * Math.cos(rad(p.al)), msg: 'Du hast sin und cos vertauscht. Die Hangabtriebskraft F_H ist die Seite gegenüber von α: sin α.' },
      { ask: 2, v: p.m * g * Math.sin(rad(p.al)), msg: 'Du hast sin und cos vertauscht. Die Normalkraft F_N ist die Seite neben α: cos α.' },
      { ask: 0, v: p.m, msg: 'Du hast g vergessen. F_G = m · g.' },
    ],
    tipps: () => ['Die Gewichtskraft ist die Hypotenuse. F_H und F_N sind die Katheten.', 'F_H zeigt den Hang hinunter: F_H = F_G · sin α. F_N drückt senkrecht auf die Ebene: F_N = F_G · cos α.', 'Rechne zuerst F_G = m · g. Dann sin und cos mit α.'],
    loesung: (p) => {
      const G = p.m * g;
      return [
        `Gewichtskraft: ${eq(f('F_G') + ' = m · g = ' + f(fmt(G) + ' N'))}`,
        `Hangabtriebskraft: ${eq(f('F_H') + ' = ' + f('F_G') + ' · sin α = ' + fmt(G) + ' N · sin ' + p.al + '° = ' + f(fmt(G * Math.sin(rad(p.al))) + ' N'))}`,
        `Normalkraft: ${eq(f('F_N') + ' = ' + f('F_G') + ' · cos α = ' + fmt(G) + ' N · cos ' + p.al + '° = ' + f(fmt(G * Math.cos(rad(p.al))) + ' N'))}`,
        'Kontrolle: Bei α = 0° wäre F_H = 0 und F_N = F_G. Bei steilerem Hang wächst F_H und F_N sinkt.',
      ];
    },
  }),

  task({
    id: 'm12', karte: 'ebene', stufe: 3, familie: 'rechnen', src: 'Rechenbuch, schiefe Ebene mit Reibung',
    title: 'Schiefe Ebene mit Reibung',
    gen: () => ({ m: rng(50, 300, 50), al: pick([15, 20, 25, 30]), mu: pick([0.1, 0.15, 0.2, 0.25]) }),
    draw: (p) => B.ebene({ al: p.al }, { F: 'F = ?', FR: 'F_R', al: `α = ${p.al}°`, m: `m = ${p.m} kg`, mu: `μ = ${fmt(p.mu, 2)}` }),
    text: (p) => `Eine Kiste mit m = ${p.m} kg wird gleichmässig eine schiefe Ebene mit α = ${p.al}° hinaufgezogen. Die Reibungszahl ist μ = ${fmt(p.mu, 2)}. Berechne a) die Hangabtriebskraft F_H, b) die Reibungskraft F_R und c) die Zugkraft F. (g = 9,81 m/s²)`,
    asks: (p) => {
      const G = p.m * g, FH = G * Math.sin(rad(p.al)), FR = p.mu * G * Math.cos(rad(p.al));
      return [
        { k: 'a) F_H', unit: 'N', v: FH },
        { k: 'b) F_R', unit: 'N', v: FR },
        { k: 'c) F', unit: 'N', v: FH + FR },
      ];
    },
    fehler: (p) => {
      const G = p.m * g, FH = G * Math.sin(rad(p.al)), FR = p.mu * G * Math.cos(rad(p.al));
      return [
        { ask: 1, v: p.mu * G, msg: 'Du hast F_G statt F_N eingesetzt. Auf der Schräge gilt F_N = F_G · cos α.' },
        { ask: 2, v: FH, msg: 'Das ist nur die Hangabtriebskraft. Die Reibung kommt dazu.' },
        { ask: 2, v: FH - FR, msg: 'Beim Hinaufziehen wirken F_H und F_R beide gegen die Bewegung. Sie werden addiert.' },
      ];
    },
    tipps: () => ['F_H = F_G · sin α. Die Reibung hängt von der Normalkraft ab.', 'F_R = μ · F_N = μ · F_G · cos α. Beim Hinaufziehen wirken F_H und F_R beide gegen die Bewegung.', 'F = F_H + F_R'],
    loesung: (p) => {
      const G = p.m * g, FH = G * Math.sin(rad(p.al)), FN = G * Math.cos(rad(p.al)), FR = p.mu * FN;
      return [
        `Gewichtskraft: ${eq(f('F_G') + ' = m · g = ' + f(fmt(G) + ' N'))}`,
        `Hangabtrieb: ${eq(f('F_H') + ' = ' + f('F_G') + ' · sin α = ' + f(fmt(FH) + ' N'))}`,
        `Normalkraft: ${eq(f('F_N') + ' = ' + f('F_G') + ' · cos α = ' + f(fmt(FN) + ' N'))}`,
        `Reibung: ${eq(f('F_R') + ' = μ · ' + f('F_N') + ' = ' + fmt(p.mu, 2) + ' · ' + fmt(FN) + ' N = ' + f(fmt(FR) + ' N'))}`,
        `Zugkraft: ${eq(f('F') + ' = ' + f('F_H') + ' + ' + f('F_R') + ' = ' + f(fmt(FH + FR) + ' N'))}`,
        'Typischer Fehler: die Reibung mit F_G statt mit F_N rechnen.',
      ];
    },
  }),

  task({
    id: 'm13', karte: 'ebene', stufe: 1, familie: 'rechnen', src: 'Buch, Schiefe Ebene, Nr. 1',
    title: 'Schrägaufzug',
    gen: buch({ FG: 600, s: 7.5, h: 4 }, () => ({ FG: pick([400, 600, 800]), s: pick([6, 7.5, 10]), h: pick([3, 4]) })),
    draw: (p) => eb(p, { FG: `F_G = ${p.FG} N`, F: 'F = ?' }),
    text: (p) => `Ein Schrägaufzug hebt eine Last ${f('F_G = ' + p.FG + ' N')} auf ${l('s = ' + fmt(p.s) + ' m')} Weglänge um ${l('h = ' + p.h + ' m')}. Wie gross ist die Zugkraft F (ohne Reibung)?`,
    asks: (p) => [{ k: 'F', unit: 'N', v: (p.FG * p.h) / p.s }],
    fehler: (p) => [{ ask: 0, v: (p.FG * p.s) / p.h, msg: 'Du hast h und s vertauscht. Die Kraft auf der schiefen Ebene ist kleiner als F_G.' }],
    tipps: () => ['Goldene Regel: Zugarbeit = Hubarbeit.', 'F · s = F_G · h', 'F = F_G · h : s'],
    loesung: (p) => [
      `${eq(f('F') + ' = ' + p.FG + ' · ' + p.h + ' : ' + fmt(p.s) + ' = ' + f(fmt((p.FG * p.h) / p.s) + ' N'))}`,
      'Langer Weg, kleine Kraft. Die Arbeit bleibt gleich.',
    ],
  }),

  task({
    id: 'm14', karte: 'ebene', stufe: 1, familie: 'rechnen', src: 'Buch, Nr. 2',
    title: 'Rampe mit Gleitschienen',
    gen: buch({ FG: 3.6, s: 8, h: 2.8, F: 1000 }, () => ({ FG: pick([2.4, 3.6, 4.8]), s: pick([6, 8]), h: pick([2, 2.8]), F: pick([800, 1000]) })),
    draw: (p) => eb(p, { FG: `F_G = ${fmt(p.FG)} kN`, F: 'F = ?' }),
    text: (p) => `Eine Last ${f(fmt(p.FG) + ' kN')} wird auf ${l(p.s + ' m')} langen Gleitschienen auf eine ${l(fmt(p.h) + ' m')} hohe Rampe gezogen. a) Welche Zugkraft ist nötig? b) Wie lang müssen die Schienen mindestens sein, wenn nur ${f(p.F + ' N')} Zugkraft verfügbar sind?`,
    asks: (p) => [
      { k: 'a) F', unit: 'N', v: (p.FG * 1000 * p.h) / p.s },
      { k: 'b) s_min', unit: 'm', v: (p.FG * 1000 * p.h) / p.F },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.FG * 1000 * p.s) / p.h, msg: 'Du hast h und s vertauscht. Die Zugkraft muss kleiner sein als F_G.' },
      { ask: 1, v: (p.FG * 1000 * p.h) / p.s, msg: 'Das ist die Kraft aus a). Bei b) ist die Kraft vorgegeben und die Länge gesucht: s = F_G · h : F.' },
    ],
    tipps: () => ['a) F = F_G · h : s. Achtung: F_G in kN, F in N.', 'b) Stelle F · s = F_G · h nach s um.', 's = F_G · h : F. Rechne F_G zuerst in N um.'],
    loesung: (p) => [
      `a) ${eq(f('F') + ' = ' + fmt(p.FG * 1000) + ' · ' + fmt(p.h) + ' : ' + p.s + ' = ' + f(fmt((p.FG * 1000 * p.h) / p.s) + ' N'))}`,
      `b) ${eq(l('s') + ' = ' + fmt(p.FG * 1000) + ' · ' + fmt(p.h) + ' : ' + p.F + ' = ' + l(fmt((p.FG * 1000 * p.h) / p.F, 2) + ' m'))}`,
    ],
  }),

  task({
    id: 'm15', karte: 'ebene', stufe: 1, familie: 'umgekehrt', src: 'Buch, Nr. 3',
    title: 'Schrägaufzug: Hubhöhe gesucht',
    gen: buch({ FG: 45, s: 300, F: 1000 }, () => ({ FG: pick([30, 45, 60]), s: pick([200, 300]), F: pick([800, 1000, 1500]) })),
    draw: (p) => B.ebene({ al: 12 }, { FG: `F_G = ${p.FG} kN`, F: `F = ${p.F} N`, h: 'h = ?', l: `s = ${p.s} m` }),
    text: (p) => `Ein Wagen (${f('F_G = ' + p.FG + ' kN')}) wird auf einem ${l(p.s + ' m')} langen Schrägaufzug mit ${f('F = ' + p.F + ' N')} hochgezogen. Welche Hubhöhe hat der Aufzug?`,
    asks: (p) => [{ k: 'h', unit: 'm', v: (p.F * p.s) / (p.FG * 1000) }],
    fehler: (p) => [{ ask: 0, v: (p.F * p.s) / p.FG, msg: 'F_G ist in kN gegeben, F in N. Rechne F_G in N um, bevor du teilst.' }],
    tipps: () => ['Goldene Regel: F · s = F_G · h. Gesucht ist h.', 'h = F · s : F_G. Gleiche Einheiten!', 'F_G = 45 kN sind 45 000 N.'],
    loesung: (p) => [
      `${eq(l('h') + ' = ' + p.F + ' · ' + p.s + ' : ' + fmt(p.FG * 1000) + ' = ' + l(fmt((p.F * p.s) / (p.FG * 1000), 2) + ' m'))}`,
      'Kontrolle: Die Hubhöhe muss kleiner sein als die Weglänge s.',
    ],
  }),

  task({
    id: 'm16', karte: 'ebene', stufe: 2, familie: 'rechnen', src: 'Buch, Nr. 4',
    title: 'Lkw an der Steigung',
    gen: buch({ s: 3.5, h: 210, m: 6.5 }, () => ({ s: pick([2, 3.5, 5]), h: pick([150, 210, 300]), m: pick([6.5, 12, 18]) })),
    draw: (p) => B.ebene({ al: 8 }, { FG: `m = ${fmt(p.m)} t`, F: 'F = ?', h: `h = ${p.h} m`, l: `s = ${fmt(p.s)} km` }),
    text: (p) => `Ein Lkw (m = ${p.m} t) fährt auf ${l(fmt(p.s) + ' km')} Strecke ${l(p.h + ' m')} hoch. Welche Zugkraft ist ohne Reibung nötig? Wie viel Prozent Steigung hat die Strasse ungefähr?`,
    asks: (p) => {
      const FG = p.m * 1000 * g;
      return [
        { k: 'F', unit: 'N', v: (FG * p.h) / (p.s * 1000) },
        { k: 'Steigung', unit: '%', v: p.h / (p.s * 10) },
      ];
    },
    fehler: (p) => [
      { ask: 0, v: (p.m * 1000 * p.h) / (p.s * 1000), msg: 'Du hast g vergessen. F_G = m · g.' },
      { ask: 1, v: p.h / (p.s * 1000), msg: 'Das ist das Verhältnis ohne Prozent. Multipliziere mit 100.' },
    ],
    tipps: () => ['F_G = m · g. Rechne t in kg und km in m um.', 'F = F_G · h : s. Beide Längen in m.', 'Steigung ≈ h : s · 100 %'],
    loesung: (p) => {
      const FG = p.m * 1000 * g;
      return [
        `${eq(f('F_G') + ' = ' + p.m * 1000 + ' kg · 9,81 m/s² = ' + fmt(FG) + ' N')}`,
        `${eq(f('F') + ' = ' + fmt(FG) + ' · ' + p.h + ' : ' + p.s * 1000 + ' = ' + f(fmt((FG * p.h) / (p.s * 1000)) + ' N'))}`,
        `${eq('Steigung ≈ ' + p.h + ' : ' + p.s * 1000 + ' = ' + fmt(p.h / (p.s * 10), 1) + ' %')}`,
      ];
    },
  }),

  task({
    id: 'm17', karte: 'ebene', stufe: 2, familie: 'rechnen', src: 'Buch, Nr. 5',
    title: 'Kessel auf dem Ladebalken',
    gen: buch({ s: 4.8, h: 1.2, F: 650 }, () => ({ s: pick([4, 4.8, 6]), h: pick([1, 1.2, 1.5]), F: pick([500, 650, 800]) })),
    draw: (p) => eb(p, { FG: 'F_G = ?', F: `F = ${p.F} N`, comp: [50, 80], FN: 'F_N = ?' }),
    text: (p) => `Ein Kessel wird auf einem ${l(fmt(p.s) + ' m')} langen Ladebalken mit ${f('F = ' + p.F + ' N')} auf eine ${l(fmt(p.h) + ' m')} hohe Ladefläche gerollt. a) Wie gross ist die Gewichtskraft? b) Wie gross sind der Neigungswinkel α und die Normalkraft F_N?`,
    asks: (p) => {
      const FG = (p.F * p.s) / p.h, a = Math.asin(p.h / p.s);
      return [
        { k: 'a) F_G', unit: 'N', v: FG },
        { k: 'b) α', unit: '°', v: deg(a) },
        { k: 'b) F_N', unit: 'N', v: FG * Math.cos(a) },
      ];
    },
    fehler: (p) => [
      { ask: 0, v: (p.F * p.h) / p.s, msg: 'Du hast h und s vertauscht. F_G ist grösser als F: F_G = F · s : h.' },
      { ask: 1, v: p.h / p.s, msg: 'Das ist erst sin α. Mit der Taste sin⁻¹ rechnest du den Winkel in Grad aus.' },
    ],
    tipps: () => ['a) Goldene Regel: F · s = F_G · h. Stelle nach F_G um.', 'b) sin α = h : s. Winkel mit sin⁻¹.', 'F_N = F_G · cos α'],
    loesung: (p) => {
      const FG = (p.F * p.s) / p.h, a = Math.asin(p.h / p.s);
      return [
        `a) ${eq(f('F_G') + ' = ' + p.F + ' · ' + fmt(p.s) + ' : ' + fmt(p.h) + ' = ' + f(fmt(FG) + ' N'))}`,
        `b) ${eq('sin α = ' + fmt(p.h) + ' : ' + fmt(p.s) + ' ⇒ α = ' + fmt(deg(a), 2) + '°')}`,
        `${eq(f('F_N') + ' = ' + fmt(FG) + ' · cos ' + fmt(deg(a), 2) + '° = ' + f(fmt(FG * Math.cos(a)) + ' N'))}`,
        'Kontrolle: F = F_G · sin α = ' + fmt(FG * Math.sin(a)) + ' N. Das ist die Zugkraft. Stimmt.',
      ];
    },
  }),

  task({
    id: 'm18', karte: 'ebene', stufe: 2, familie: 'rechnen', src: KR.neu,
    title: 'Rollstuhlrampe planen',
    gen: () => ({ h: pick([0.3, 0.45, 0.6]), st: 6, m: pick([90, 110, 130]) }),
    draw: (p) => B.ebene({ al: 8 }, { FG: `m = ${p.m} kg`, F: 'F = ?', h: `h = ${fmt(p.h)} m`, l: 's = ?' }),
    text: (p) => `Eine Rollstuhlrampe soll ${l(fmt(p.h) + ' m')} überwinden. Die Steigung darf höchstens ${p.st} % betragen (h : waagrechte Länge). Rollstuhl und Person wiegen m = ${p.m} kg. Berechne a) die waagrechte Länge der Rampe, b) die Rampenlänge s und c) die Schubkraft F ohne Rollreibung. (g = 9,81 m/s²)`,
    asks: (p) => {
      const x = p.h / (p.st / 100), sl = Math.hypot(x, p.h);
      return [
        { k: 'a) Länge waagrecht', unit: 'm', v: x },
        { k: 'b) s', unit: 'm', v: sl },
        { k: 'c) F', unit: 'N', v: (p.m * g * p.h) / sl },
      ];
    },
    fehler: (p) => [
      { ask: 0, v: p.h / p.st, msg: 'Du hast 6 statt 0,06 eingesetzt. 6 % sind 6 : 100 = 0,06.' },
      { ask: 2, v: p.m * g, msg: 'Das ist die ganze Gewichtskraft. Auf der Rampe braucht es nur den Anteil F_G · h : s.' },
    ],
    tipps: () => ['a) 6 % heisst: 6 cm Höhe pro 1 m Länge. Länge = h : 0,06.', 'b) Rampenlänge mit Pythagoras aus waagrechter Länge und h.', 'c) F = F_G · h : s'],
    loesung: (p) => {
      const x = p.h / (p.st / 100), sl = Math.hypot(x, p.h);
      return [
        `a) ${eq(fmt(p.h) + ' : 0,0' + p.st + ' = ' + fmt(x, 2) + ' m')}`,
        `b) ${eq(l('s') + ' = √(' + fmt(x, 2) + '² + ' + fmt(p.h) + '²) = ' + fmt(sl, 2) + ' m')}`,
        `c) ${eq(f('F') + ' = ' + p.m + ' · 9,81 · ' + fmt(p.h) + ' : ' + fmt(sl, 2) + ' = ' + f(fmt((p.m * g * p.h) / sl) + ' N'))}`,
        'Eine flache Rampe ist lang, aber gut zu bewältigen.',
      ];
    },
  }),

  task({
    id: 'm19', karte: 'ebene', stufe: 1, familie: 'schaetzen', src: KR.kopf,
    title: 'Schiefe Ebene im Kopf',
    gen: () => ({ FG: pick([200, 400, 800, 1000]), n: pick([2, 4, 5, 10]) }),
    draw: (p) => B.ebene({ al: deg(Math.asin(1 / p.n)) }, { FG: `F_G = ${p.FG} N`, F: 'F = ?', h: 'h', l: `s = ${p.n} · h` }),
    text: (p) => `Ohne Taschenrechner: Eine Rampe ist ${p.n}-mal so lang wie hoch. Wie gross ist die Zugkraft für eine Last von ${f(p.FG + ' N')} (ohne Reibung)?`,
    asks: (p) => [{ k: 'F', unit: 'N', v: p.FG / p.n }],
    fehler: (p) => [{ ask: 0, v: p.FG * p.n, msg: 'Du hast multipliziert. Die Rampe macht die Kraft kleiner: F = F_G : n.' }],
    tipps: () => ['F = F_G · h : s. Hier ist s = n · h.', 'Das h kürzt sich. Es bleibt F = F_G : n.', 'Teile die Last durch die Zahl, wie viel länger die Rampe ist.'],
    loesung: (p) => [`${eq(f('F') + ' = ' + p.FG + ' : ' + p.n + ' = ' + f(fmt(p.FG / p.n) + ' N'))}`],
  }),

  task({
    id: 'm20', karte: 'ebene', stufe: 2, familie: 'waswaere', src: KR.wenn,
    title: 'Was wäre, wenn die Rampe doppelt so lang ist?',
    gen: () => ({ FG: pick([400, 600, 800, 1000]), h: pick([1, 1.2, 1.5]), s: pick([4, 5, 6]) }),
    draw: (p) => eb(p, { FG: `F_G = ${p.FG} N`, F: 'F = ?' }),
    text: (p) => `Eine Last ${f('F_G = ' + p.FG + ' N')} wird über eine ${l('s = ' + p.s + ' m')} lange Rampe auf ${l('h = ' + fmt(p.h) + ' m')} Höhe gezogen. Reibung wird vernachlässigt. Danach ersetzt man die Rampe durch eine doppelt so lange (gleiche Höhe). a) Wie gross ist F bei der alten Rampe? b) Wie gross ist F bei der neuen Rampe? c) Was passiert mit der Arbeit?`,
    asks: (p) => [
      { k: 'a) F alt', unit: 'N', v: (p.FG * p.h) / p.s },
      { k: 'b) F neu', unit: 'N', v: (p.FG * p.h) / (2 * p.s) },
      {
        kind: 'choice', k: 'c) Arbeit',
        opts: ['Sie bleibt gleich.', 'Sie wird halb so gross.', 'Sie wird doppelt so gross.'],
        a: 0,
        why: [undefined, 'Die Kraft halbiert sich, aber der Weg verdoppelt sich. Das Produkt F · s bleibt.', 'Der Weg verdoppelt sich, aber die Kraft halbiert sich. Das Produkt bleibt gleich.'],
      },
    ],
    fehler: (p) => [{ ask: 1, v: (2 * p.FG * p.h) / p.s, msg: 'Du hast die Kraft verdoppelt. Eine längere Rampe braucht weniger Kraft.' }],
    tipps: () => ['F = F_G · h : s. Bei doppeltem s wird F halb so gross.', 'Die Höhe h bleibt gleich. Nur s ändert sich: s_neu = 2 · s.', 'Arbeit = F · s. Kraft halb, Weg doppelt.'],
    loesung: (p) => [
      `Alt: ${eq(f('F') + ' = ' + p.FG + ' · ' + fmt(p.h) + ' : ' + p.s + ' = ' + f(fmt((p.FG * p.h) / p.s) + ' N'))}`,
      `Neu: ${eq(f('F') + ' = ' + p.FG + ' · ' + fmt(p.h) + ' : ' + 2 * p.s + ' = ' + f(fmt((p.FG * p.h) / (2 * p.s)) + ' N'))}`,
      `Arbeit: ${eq(fmt((p.FG * p.h) / p.s) + ' N · ' + p.s + ' m = ' + fmt(p.FG * p.h) + ' J')} und ${eq(fmt((p.FG * p.h) / (2 * p.s)) + ' N · ' + 2 * p.s + ' m = ' + fmt(p.FG * p.h) + ' J')}. Gleich.`,
    ],
  }),

  // ---------- Keil ----------

  task({
    id: 'm21', karte: 'keil', stufe: 2, familie: 'rechnen', src: 'Buch, Keil, Nr. 6',
    title: 'Rollbiegewerkzeug',
    gen: buch({ F1: 2400, al: 30 }, () => ({ F1: pick([1500, 2400, 3000]), al: pick([20, 30, 40]) })),
    draw: (p) => B.keil(p, { note: 'Keilfläche zur Senkrechten geneigt' }),
    text: (p) => `Ein Keilstempel drückt mit ${f('F_1 = ' + fmt(p.F1) + ' N')} senkrecht nach unten. Seine Keilfläche ist um ${p.al}° zur Senkrechten geneigt und schiebt einen Seitenschieber waagrecht. Berechne a) das Wegverhältnis s_2 : s_1 und b) die Kraft F_2 im Seitenschieber (ohne Reibung).`,
    asks: (p) => [
      { k: 'a) s_2 : s_1', unit: '', v: Math.tan(rad(p.al)) },
      { k: 'b) F_2', unit: 'N', v: p.F1 / Math.tan(rad(p.al)) },
    ],
    fehler: (p) => [
      { ask: 0, v: 1 / Math.tan(rad(p.al)), msg: 'Du hast den Kehrwert. Der Schieber fährt weniger weit als der Stempel: s_2 : s_1 = tan α.' },
      { ask: 1, v: p.F1 * Math.tan(rad(p.al)), msg: 'Du hast mit tan α multipliziert. Aus F_1 · s_1 = F_2 · s_2 folgt F_2 = F_1 : tan α.' },
    ],
    tipps: () => ['Goldene Regel: F_1 · s_1 = F_2 · s_2.', 'Senkt sich der Stempel um s_1, fährt der Schieber s_2 = s_1 · tan α.', 'F_2 = F_1 : tan α'],
    loesung: (p) => [
      `${eq('s_2 : s_1 = tan ' + p.al + '° = ' + fmt(Math.tan(rad(p.al)), 3))}`,
      `${eq(f('F_2') + ' = ' + fmt(p.F1) + ' : ' + fmt(Math.tan(rad(p.al)), 3) + ' = ' + f(fmt(p.F1 / Math.tan(rad(p.al))) + ' N'))}`,
      'Ein schlanker Keil (kleiner Winkel) gibt grosse Kraft, aber wenig Weg.',
    ],
  }),

  task({
    id: 'm22', karte: 'keil', stufe: 3, familie: 'rechnen', src: 'Buch, Keil, Nr. 7',
    title: 'Keiltriebpresse mit Verlusten',
    gen: buch({ F1: 12.5, al: 30, v: 60 }, () => ({ F1: pick([10, 12.5, 20]), al: pick([20, 30]), v: pick([40, 50, 60]) })),
    draw: (p) => B.keil({ F1: p.F1 * 1000, al: p.al }, { F1: `F_1 = ${fmt(p.F1)} kN`, note: `Reibungsverluste ${p.v} %` }),
    text: (p) => `Bei einer Keiltriebpresse drückt der Keil mit ${f('F_1 = ' + fmt(p.F1) + ' kN')}. Der Keilwinkel ist ${p.al}°, so dass s_2 = s_1 · tan ${p.al}°. Die Reibungsverluste betragen ${p.v} %. Wie gross ist die Stösselkraft F_2 a) ohne Verluste und b) mit Verlusten?`,
    asks: (p) => [
      { k: 'a) F_2 ohne Verluste', unit: 'kN', v: p.F1 / Math.tan(rad(p.al)) },
      { k: 'b) F_2 mit Verlusten', unit: 'kN', v: (p.F1 / Math.tan(rad(p.al))) * (1 - p.v / 100) },
    ],
    fehler: (p) => {
      const F = p.F1 / Math.tan(rad(p.al));
      return [
        { ask: 0, v: p.F1 * Math.tan(rad(p.al)), msg: 'Du hast mit tan α multipliziert. Richtig ist F_2 = F_1 : tan α.' },
        { ask: 1, v: F, msg: 'Das ist der Wert ohne Verluste. Die Verluste musst du abziehen: mal η.' },
        { ask: 1, v: F / (1 - p.v / 100), msg: 'Du hast durch η geteilt. Bei Verlusten kommt weniger Kraft an. Multipliziere mit η.' },
      ];
    },
    tipps: (p) => ['Zuerst ohne Reibung: F_2 = F_1 : tan α.', `Verluste ${p.v} % heisst: Es bleiben ${100 - p.v} %. Das ist η = ${fmt(1 - p.v / 100, 2)}.`, 'F_2 mit Verlusten = F_2 ohne Verluste · η'],
    loesung: (p) => {
      const F = p.F1 / Math.tan(rad(p.al));
      return [
        `${eq(f('F_2,th') + ' = ' + fmt(p.F1) + ' : tan ' + p.al + '° = ' + fmt(F, 2) + ' kN')}`,
        `${eq(f('F_2') + ' = ' + fmt(F, 2) + ' · ' + fmt(1 - p.v / 100, 2) + ' = ' + f(fmt(F * (1 - p.v / 100), 2) + ' kN'))}`,
      ];
    },
  }),

  task({
    id: 'm23', karte: 'keil', stufe: 2, familie: 'waswaere', src: KR.wenn,
    title: 'Was wäre, wenn der Keil schlanker wird?',
    gen: () => ({ F1: pick([1200, 1500, 2000, 2400]), al: pick([20, 30, 40]) }),
    draw: (p) => B.keil(p),
    text: (p) => `Ein Keilstempel mit ${f('F_1 = ' + fmt(p.F1) + ' N')} schiebt einen Schieber. Die Keilfläche ist um ${p.al}° geneigt. Man macht den Winkel halb so gross (${p.al / 2}°). Reibung wird vernachlässigt. Berechne a) F_2 beim alten Winkel und b) F_2 beim halben Winkel. c) Was gewinnt man, was verliert man?`,
    asks: (p) => [
      { k: 'a) F_2 alt', unit: 'N', v: p.F1 / Math.tan(rad(p.al)) },
      { k: 'b) F_2 neu', unit: 'N', v: p.F1 / Math.tan(rad(p.al / 2)) },
      {
        kind: 'choice', k: 'c) Gewinn und Preis',
        opts: [
          'Mehr Kraft am Schieber, aber der Schieber fährt weniger weit.',
          'Mehr Kraft am Schieber und mehr Weg.',
          'Weniger Kraft am Schieber, dafür mehr Weg.',
          'Es ändert sich nichts.',
        ],
        a: 0,
        why: [undefined, 'Kraft und Weg tauschen sich aus. Mehr von beidem gibt es nicht.', 'Ein schlankerer Keil gibt mehr Kraft, nicht weniger.', 'Der Winkel steckt in tan α. Eine Änderung wirkt sich auf Kraft und Weg aus.'],
      },
    ],
    fehler: (p) => [{ ask: 1, v: 2 * (p.F1 / Math.tan(rad(p.al))), msg: 'Du hast nur verdoppelt. Der Tangens ist nicht proportional zum Winkel. Rechne F_1 : tan(α : 2).' }],
    tipps: () => ['F_2 = F_1 : tan α. Setze den neuen Winkel ein.', 'tan(15°) ist nicht die Hälfte von tan(30°). Rechne beide mit dem Taschenrechner.', 'Kleiner Winkel gibt grosse Kraft, aber kleinen Weg: s_2 = s_1 · tan α.'],
    loesung: (p) => [
      `Alt: ${eq(f('F_2') + ' = ' + fmt(p.F1) + ' : tan ' + p.al + '° = ' + f(fmt(p.F1 / Math.tan(rad(p.al))) + ' N'))}`,
      `Neu: ${eq(f('F_2') + ' = ' + fmt(p.F1) + ' : tan ' + p.al / 2 + '° = ' + f(fmt(p.F1 / Math.tan(rad(p.al / 2))) + ' N'))}`,
      'Der schlankere Keil gibt mehr Kraft. Der Schieber fährt dafür weniger weit (s_2 = s_1 · tan α).',
    ],
  }),

  // ---------- Schraube und Spindel ----------

  task({
    id: 'm24', karte: 'schraube', stufe: 3, familie: 'rechnen', src: 'Rechenbuch, Schraube',
    title: 'Spindel-Wagenheber',
    gen: () => ({ FH: rng(100, 300, 50), l: pick([200, 250, 300, 400]), P: pick([4, 5, 6, 8]), eta: pick([0.3, 0.35, 0.4]) }),
    draw: (p) => B.hebelSpindel(p),
    text: (p) => `An einem Spindel-Wagenheber dreht man mit ${f('F_H = ' + p.FH + ' N')} am Hebel mit ${l('l = ' + p.l + ' mm')}. Die Spindel hat die Steigung ${l('P = ' + p.P + ' mm')}. Der Wirkungsgrad ist η = ${fmt(p.eta, 2)}. Berechne a) den Weg der Hand bei einer Umdrehung und b) die Hubkraft F in kN.`,
    asks: (p) => [
      { k: 'a) Handweg', unit: 'mm', v: 2 * Math.PI * p.l },
      { k: 'b) F', unit: 'kN', v: (p.FH * 2 * Math.PI * p.l * p.eta) / p.P / 1000 },
    ],
    fehler: (p) => [
      { ask: 0, v: Math.PI * p.l, msg: 'Das ist der halbe Weg. Die Hand läuft auf einem Kreis mit Radius l: s = 2 · π · l.' },
      { ask: 1, v: (p.FH * 2 * Math.PI * p.l) / p.P / 1000, msg: 'Du hast den Wirkungsgrad vergessen. Mit Reibung kommt nur der Anteil η an.' },
    ],
    tipps: () => ['Bei einer Umdrehung macht die Hand einen Kreis: s = 2 · π · l. Die Last hebt sich dabei um die Steigung P.', 'Goldene Regel mit Wirkungsgrad: F · P = F_H · 2 · π · l · η', 'F = F_H · 2 · π · l · η : P. Das Ergebnis in N, dann durch 1000 für kN.'],
    loesung: (p) => {
      const sH = 2 * Math.PI * p.l, F = (p.FH * sH * p.eta) / p.P;
      return [
        `Weg der Hand pro Umdrehung: ${eq(l('s') + ' = 2 · π · ' + l('l') + ' = 2 · π · ' + p.l + ' mm = ' + l(fmt(sH) + ' mm'))}`,
        `Weg der Last pro Umdrehung: ${eq(l('P = ' + p.P + ' mm'))}`,
        `Goldene Regel mit Wirkungsgrad: ${eq(f('F') + ' · ' + l('P') + ' = ' + f('F_H') + ' · ' + l('s') + ' · η')}`,
        `Umstellen: ${eq(f('F') + ' = ' + p.FH + ' N · ' + fmt(sH) + ' mm · ' + fmt(p.eta, 2) + ' : ' + p.P + ' mm = ' + f(fmt(F) + ' N'))}`,
        `Resultat: ${eq(f('F = ' + fmt(F / 1000) + ' kN'))}`,
        'Vorstellung: Die Hand macht einen sehr langen Weg, die Last einen sehr kurzen. Darum wird die Kraft riesig.',
      ];
    },
  }),

  task({
    id: 'm25', karte: 'schraube', stufe: 1, familie: 'rechnen', src: 'Buch, Schraube, Beispiel',
    title: 'Spindelpresse prägt',
    gen: buch({ F1: 120, d: 1200, P: 6 }, () => ({ F1: pick([80, 120, 150]), d: pick([800, 1200]), P: pick([4, 6, 8]) })),
    draw: (p) => B.spindelpresse(p),
    text: (p) => `Eine Spindelpresse hat ein Handrad mit ${l('d = ' + p.d + ' mm')}. Die Gewindespindel hat P = ${p.P} mm Steigung. Am Handrad wirkt ${f('F_1 = ' + p.F1 + ' N')}. Wie gross ist die Prägekraft F_2 (ohne Reibung)?`,
    asks: (p) => [{ k: 'F_2', unit: 'N', v: (p.F1 * Math.PI * p.d) / p.P }],
    fehler: (p) => [
      { ask: 0, v: (p.F1 * Math.PI * (p.d / 2)) / p.P, msg: 'Du hast den Radius statt den Durchmesser eingesetzt. Die Hand läuft pro Umdrehung π · d.' },
      { ask: 0, v: (p.F1 * p.d) / p.P, msg: 'Du hast π vergessen. Der Weg der Hand pro Umdrehung ist π · d.' },
    ],
    tipps: () => ['Eine Umdrehung: Weg am Handrad π · d, Weg der Spindel P.', 'Goldene Regel: F_1 · π · d = F_2 · P', 'F_2 = F_1 · π · d : P'],
    loesung: (p) => [
      `${eq(f('F_2') + ' = ' + p.F1 + ' · π · ' + p.d + ' : ' + p.P + ' = ' + f(fmt((p.F1 * Math.PI * p.d) / p.P) + ' N'))}`,
      'Eine Schraube ist eine schiefe Ebene, die um einen Zylinder gewickelt ist.',
    ],
  }),

  task({
    id: 'm26', karte: 'schraube', stufe: 2, familie: 'rechnen', src: 'Buch, Schraube, Nr. 1',
    title: 'Abzieher',
    gen: buch({ F1: 95, l: 220, P: 1.5, g: 'M36 × 1,5' }, () => ({ F1: pick([60, 95, 120]), l: pick([180, 220, 300]), P: 1.5, g: 'M36 × 1,5' })),
    draw: (p) => B.abzieher(p),
    text: (p) => `Die Spindel eines Abziehers hat ein Gewinde ${p.g} (P = ${fmt(p.P)} mm). Sie wird über einen ${l(p.l + ' mm')} langen Hebel mit beidseitig je ${f(p.F1 + ' N')} gedreht. Welche Zugkraft F_2 entsteht ohne Reibung?`,
    asks: (p) => [{ k: 'F_2', unit: 'N', v: (2 * p.F1 * Math.PI * p.l) / p.P }],
    fehler: (p) => [
      { ask: 0, v: (p.F1 * Math.PI * p.l) / p.P, msg: 'Du hast nur eine Hand gezählt. Es drücken zwei Hände, je F_1.' },
      { ask: 0, v: (2 * p.F1 * Math.PI * (p.l / 2)) / p.P, msg: 'Du hast den Radius statt den Durchmesser eingesetzt. Der Hebel ist l lang, die Hände laufen auf dem Kreis mit d = l.' },
    ],
    tipps: () => ['Beide Hände laufen auf einem Kreis mit d = l.', 'Zwei Hände: 2 · F_1 · π · d = F_2 · P', 'F_2 = 2 · F_1 · π · l : P'],
    loesung: (p) => [
      `${eq(f('F_2') + ' = 2 · ' + p.F1 + ' · π · ' + p.l + ' : ' + fmt(p.P) + ' = ' + f(fmt((2 * p.F1 * Math.PI * p.l) / p.P) + ' N'))}`,
      'Aus zwei Händen entstehen viele Kilonewton. Darum löst ein Abzieher auch festsitzende Lager.',
    ],
  }),

  task({
    id: 'm27', karte: 'schraube', stufe: 2, familie: 'rechnen', src: 'Buch, Schraube, Nr. 2',
    title: 'Spindelpresse mit Verlusten',
    gen: buch({ d: 400, P: 10, F1: 96, F2: 15700, v: 65 }, () => ({ d: pick([300, 400, 500]), P: pick([8, 10]), F1: pick([80, 96, 120]), F2: pick([12000, 15700]), v: pick([50, 65]) })),
    draw: (p) => B.spindelpresse({ d: p.d, P: p.P, F1: p.F1 }),
    text: (p) => `Eine Spindelpresse hat ein Handrad ${l('d = ' + p.d + ' mm')} und eine Spindel mit P = ${p.P} mm. a) Welche Presskraft F_2 entsteht theoretisch mit ${f('F_1 = ' + p.F1 + ' N')}? b) Welche Handkraft braucht es für ${f(p.F2 + ' N')} ohne Reibung? c) Welche Handkraft braucht es bei ${p.v} % Reibungsverlusten?`,
    asks: (p) => {
      const b = (p.F2 * p.P) / (Math.PI * p.d);
      return [
        { k: 'a) F_2', unit: 'N', v: (p.F1 * Math.PI * p.d) / p.P },
        { k: 'b) F_1', unit: 'N', v: b },
        { k: 'c) F_1', unit: 'N', v: b / (1 - p.v / 100) },
      ];
    },
    fehler: (p) => {
      const b = (p.F2 * p.P) / (Math.PI * p.d);
      return [
        { ask: 0, v: (p.F1 * Math.PI * (p.d / 2)) / p.P, msg: 'Du hast den Radius statt den Durchmesser eingesetzt.' },
        { ask: 1, v: (p.F2 * Math.PI * p.d) / p.P, msg: 'Du hast die Formel nicht umgestellt. F_1 = F_2 · P : (π · d).' },
        { ask: 2, v: b, msg: 'Das ist die Handkraft ohne Reibung. Mit Verlusten braucht es mehr Kraft.' },
        { ask: 2, v: b * (1 - p.v / 100), msg: 'Du hast mit η multipliziert. Es braucht mehr Kraft, nicht weniger. Teile durch η.' },
      ];
    },
    tipps: (p) => ['F_1 · π · d = F_2 · P. Für b) nach F_1 umstellen.', 'b) F_1 = F_2 · P : (π · d)', `c) Nur ${100 - p.v} % kommen an: η = ${fmt(1 - p.v / 100, 2)}. F_1 = F_1,th : η`],
    loesung: (p) => {
      const b = (p.F2 * p.P) / (Math.PI * p.d);
      return [
        `a) ${eq(f('F_2') + ' = ' + p.F1 + ' · π · ' + p.d + ' : ' + p.P + ' = ' + f(fmt((p.F1 * Math.PI * p.d) / p.P) + ' N'))}`,
        `b) ${eq(f('F_1') + ' = ' + p.F2 + ' · ' + p.P + ' : (π · ' + p.d + ') = ' + f(fmt(b) + ' N'))}`,
        `c) ${eq(f('F_1') + ' = ' + fmt(b) + ' : ' + fmt(1 - p.v / 100, 2) + ' = ' + f(fmt(b / (1 - p.v / 100)) + ' N'))}`,
      ];
    },
  }),

  task({
    id: 'm28', karte: 'schraube', stufe: 2, familie: 'rechnen', src: 'Buch, Schraube, Nr. 3',
    title: 'Schraubstock mit Spannhebel',
    gen: buch({ F2: 12, r: 250, P: 5, v: 70 }, () => ({ F2: pick([8, 12, 15]), r: pick([200, 250]), P: pick([4, 5, 6]), v: pick([60, 70]) })),
    draw: (p) => B.spindelpresse({ d: 2 * p.r, P: p.P, F1: '?' }, { F1: 'F_1 = ?', F2: `F_2 = ${p.F2} kN`, note: `Schraubstock: Hebelradius ${p.r} mm, Gewinde Tr 22 × ${p.P}` }),
    text: (p) => `Ein Schraubstock hat eine Spindel Tr 22 × ${p.P} (P = ${p.P} mm). Der Spannhebel wird im Radius ${l(p.r + ' mm')} gedreht. Welche Handkraft F_1 braucht es für ${f(p.F2 + ' kN')} Spannkraft a) ohne Reibung und b) bei ${p.v} % Reibungsverlusten?`,
    asks: (p) => {
      const t = (p.F2 * 1000 * p.P) / (Math.PI * 2 * p.r);
      return [
        { k: 'a) F_1 ohne Reibung', unit: 'N', v: t },
        { k: 'b) F_1 mit Verlusten', unit: 'N', v: t / (1 - p.v / 100) },
      ];
    },
    fehler: (p) => {
      const t = (p.F2 * 1000 * p.P) / (Math.PI * 2 * p.r);
      return [
        { ask: 0, v: (p.F2 * 1000 * p.P) / (Math.PI * p.r), msg: 'Du hast den Radius statt den Durchmesser eingesetzt. Der Kreis hat d = 2 · r.' },
        { ask: 1, v: t * (1 - p.v / 100), msg: 'Du hast mit η multipliziert. Mit Reibung braucht es mehr Kraft. Teile durch η.' },
      ];
    },
    tipps: (p) => [`Der Kreis hat d = 2 · r = ${2 * p.r} mm.`, 'F_1 = F_2 · P : (π · d). F_2 zuerst in N.', `Dann durch η = ${fmt(1 - p.v / 100, 2)} teilen.`],
    loesung: (p) => {
      const t = (p.F2 * 1000 * p.P) / (Math.PI * 2 * p.r);
      return [
        `${eq(f('F_1,th') + ' = ' + p.F2 * 1000 + ' · ' + p.P + ' : (π · ' + 2 * p.r + ') = ' + fmt(t) + ' N')}`,
        `${eq(f('F_1') + ' = ' + fmt(t) + ' : ' + fmt(1 - p.v / 100, 2) + ' = ' + f(fmt(t / (1 - p.v / 100)) + ' N'))}`,
        'Schrauben haben hohe Reibung. Dafür halten sie selbst, ohne zurückzudrehen (Selbsthemmung).',
      ];
    },
  }),

  task({
    id: 'm29', karte: 'schraube', stufe: 3, familie: 'rechnen', src: 'Buch, Schraube, Nr. 4',
    title: 'Scheren-Wagenheber',
    gen: buch(
      { FG: 10, w: 480, h: 320, r: 125, P: 4, v: 65, g: 'Tr 20 × 4' },
      () => ({ FG: pick([8, 10, 12]), w: 480, h: pick([240, 320, 400]), r: pick([100, 125]), P: 4, v: pick([60, 65]), g: 'Tr 20 × 4' }),
    ),
    draw: (p) => B.wagenheber(p),
    text: (p) => `Ein Scheren-Wagenheber (Rhombus ${p.w} mm breit, ${p.h} mm hoch) trägt ${f('F_G = ' + p.FG + ' kN')}. Die Gewindespindel ${p.g} liegt waagrecht zwischen B und dem rechten Gelenk. Die Kurbel hat r = ${p.r} mm. Berechne a) den Winkel der Stangen zur Waagrechten, b) die Stangenkraft F_I, c) die Spindelkraft F_2 und d) die Handkraft an der Kurbel bei ${p.v} % Reibungsverlusten.`,
    asks: (p) => {
      const a = Math.atan2(p.h / 2, p.w / 2), FI = (p.FG * 1000) / (2 * Math.sin(a)), F2 = (p.FG * 1000) / Math.tan(a);
      return [
        { k: 'a) α', unit: '°', v: deg(a) },
        { k: 'b) F_I', unit: 'N', v: FI },
        { k: 'c) F_2', unit: 'N', v: F2 },
        { k: 'd) F_1', unit: 'N', v: (F2 * p.P) / (2 * Math.PI * p.r * (1 - p.v / 100)) },
      ];
    },
    fehler: (p) => {
      const a = Math.atan2(p.h / 2, p.w / 2), F2 = (p.FG * 1000) / Math.tan(a);
      return [
        { ask: 0, v: deg(Math.atan2(p.w, p.h)), msg: 'Du hast Breite und Höhe vertauscht. tan α = Höhe : Breite (je halb).' },
        { ask: 1, v: (p.FG * 1000) / Math.sin(a), msg: 'Bei A teilt sich F_G auf zwei Stangen. Teile durch 2 · sin α.' },
        { ask: 3, v: (F2 * p.P) / (2 * Math.PI * p.r), msg: 'Du hast die Reibungsverluste vergessen. Teile durch η.' },
      ];
    },
    tipps: () => ['a) tan α = (h : 2) : (b : 2). b) Bei A teilt sich F_G auf zwei Stangen: F_I = F_G : (2 · sin α).', 'c) Die Spindel hält die waagrechten Anteile beider Stangen: F_2 = 2 · F_I · cos α.', 'd) F_1 · 2π · r · η = F_2 · P'],
    loesung: (p) => {
      const a = Math.atan2(p.h / 2, p.w / 2), FI = (p.FG * 1000) / (2 * Math.sin(a)), F2 = (p.FG * 1000) / Math.tan(a), F1 = (F2 * p.P) / (2 * Math.PI * p.r * (1 - p.v / 100));
      return [
        `a) ${eq('tan α = ' + p.h / 2 + ' : ' + p.w / 2 + ' ⇒ α = ' + fmt(deg(a), 2) + '°')}`,
        `b) ${eq(f('F_I') + ' = ' + p.FG * 1000 + ' : (2 · sin ' + fmt(deg(a), 2) + '°) = ' + f(fmt(FI) + ' N'))}`,
        `c) ${eq(f('F_2') + ' = 2 · ' + fmt(FI) + ' · cos α = ' + f(fmt(F2) + ' N'))}`,
        `d) ${eq(f('F_1') + ' = ' + fmt(F2) + ' · ' + p.P + ' : (2π · ' + p.r + ' · ' + fmt(1 - p.v / 100, 2) + ') = ' + f(fmt(F1) + ' N'))}`,
        'Je tiefer der Wagenheber steht (flache Stangen), desto grösser F_2. Am Anfang kurbelt man darum am schwersten.',
      ];
    },
  }),

  task({
    id: 'm30', karte: 'schraube', stufe: 2, familie: 'umgekehrt', src: KR.um,
    title: 'Spindelpresse: Welche Steigung?',
    gen: () => ({ F1: pick([100, 150]), d: pick([400, 600]), F2: pick([40000, 60000]) }),
    draw: (p) => B.spindelpresse({ F1: p.F1, d: p.d, P: '?' }, { F2: `F_2 = ${p.F2 / 1000} kN` }),
    text: (p) => `Eine Spindelpresse soll mit ${f('F_1 = ' + p.F1 + ' N')} am Handrad (${l('d = ' + p.d + ' mm')}) eine Presskraft von ${f(fmt(p.F2 / 1000) + ' kN')} erreichen (ohne Reibung). Wie gross darf die Gewindesteigung P höchstens sein?`,
    asks: (p) => [{ k: 'P_max', unit: 'mm', v: (p.F1 * Math.PI * p.d) / p.F2 }],
    fehler: (p) => [
      { ask: 0, v: (p.F1 * p.d) / p.F2, msg: 'Du hast π vergessen. Der Weg der Hand pro Umdrehung ist π · d.' },
      { ask: 0, v: p.F2 / (p.F1 * Math.PI * p.d), msg: 'Du hast den Bruch verkehrt gestellt. P = F_1 · π · d : F_2.' },
    ],
    tipps: () => ['F_1 · π · d = F_2 · P. Gesucht ist P.', 'Stelle nach P um: P = F_1 · π · d : F_2.', 'F_2 zuerst in N: 40 kN sind 40 000 N.'],
    loesung: (p) => [
      `${eq(l('P') + ' = ' + p.F1 + ' · π · ' + p.d + ' : ' + p.F2 + ' = ' + l(fmt((p.F1 * Math.PI * p.d) / p.F2, 2) + ' mm'))}`,
      'Kleine Steigung heisst grosse Kraft, aber viele Umdrehungen.',
    ],
  }),

  task({
    id: 'm31', karte: 'schraube', stufe: 2, familie: 'fehler', src: KR.fehl,
    title: 'Abzieher: Wo steckt der Fehler?',
    gen: () => ({ F1: pick([80, 95]), l: pick([200, 220]), P: 1.5 }),
    draw: (p) => B.abzieher(p),
    text: (p) => `Ein Lernender rechnet die Zugkraft des Abziehers (Hebel ${p.l} mm, beidseitig je ${p.F1} N, P = 1,5 mm):<ol style="margin:8px 0 8px 18px;background:#fff6e5;padding:8px 8px 8px 26px;border-radius:6px"><li>F_2 = F_1 · π · d : P</li><li>F_2 = ${p.F1} · π · ${p.l / 2} : 1,5 = ${fmt((p.F1 * Math.PI * (p.l / 2)) / 1.5)} N</li></ol>a) Welche Fehler hat er gemacht? b) Wie gross ist F_2 richtig?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: [
          'Er hat den Radius statt den Durchmesser eingesetzt und nur eine Hand gezählt.',
          'Er hat die Steigung falsch eingesetzt.',
          'Er hat π vergessen.',
          'Es gibt keinen Fehler.',
        ],
        a: 0,
        why: [undefined, 'P = 1,5 mm ist richtig eingesetzt. Schau auf d und auf die Zahl der Hände.', 'π steht in der Rechnung. Schau auf d und auf die Hände.', 'Das Resultat ist 4-mal zu klein. Zwei Fehler heben sich nicht auf.'],
      },
      { k: 'b) F_2', unit: 'N', v: (2 * p.F1 * Math.PI * p.l) / 1.5 },
    ],
    fehler: (p) => [{ ask: 1, v: (p.F1 * Math.PI * (p.l / 2)) / 1.5, msg: 'Das ist der falsche Wert des Lernenden. Nimm d = l und zwei Hände.' }],
    tipps: () => ['Welcher Durchmesser beschreibt den Kreis der Hände?', 'Wie viele Hände drücken?', 'F_2 = 2 · F_1 · π · l : P'],
    loesung: (p) => [
      'Fehler 1: Er hat den Radius ' + p.l / 2 + ' mm statt den Durchmesser ' + p.l + ' mm eingesetzt.',
      'Fehler 2: Er hat nur eine Hand gezählt. Es sind zwei.',
      `${eq(f('F_2') + ' = 2 · ' + p.F1 + ' · π · ' + p.l + ' : 1,5 = ' + f(fmt((2 * p.F1 * Math.PI * p.l) / 1.5) + ' N'))}`,
      'Das falsche Resultat war 4-mal zu klein.',
    ],
  }),

  task({
    id: 'm32', karte: 'schraube', stufe: 3, familie: 'kette', src: KR.komb,
    title: 'Schraubstock hält das Werkstück',
    gen: () => ({ F1: pick([100, 150]), r: pick([200, 250]), P: 5, v: 70, mu: pick([0.15, 0.2]) }),
    draw: (p) => B.spindelpresse({ d: 2 * p.r, P: p.P, F1: p.F1 }, { F2: 'F_Spann', note: 'Werkstück im Schraubstock, 2 Backen' }),
    text: (p) => `Am Spannhebel eines Schraubstocks (Radius ${l(p.r + ' mm')}, P = ${p.P} mm, ${p.v} % Reibungsverluste) wirkt ${f('F_1 = ' + p.F1 + ' N')}. Zwischen Backen und Werkstück ist μ₀ = ${fmt(p.mu)}. Berechne a) die Spannkraft und b) die grösste Schnittkraft, die das Werkstück aushält, ohne zu rutschen (zwei Backen).`,
    asks: (p) => {
      const Fs = ((p.F1 * Math.PI * 2 * p.r) / p.P) * (1 - p.v / 100);
      return [
        { k: 'a) F_Spann', unit: 'N', v: Fs },
        { k: 'b) F_max', unit: 'N', v: 2 * p.mu * Fs },
      ];
    },
    fehler: (p) => {
      const Fs = ((p.F1 * Math.PI * 2 * p.r) / p.P) * (1 - p.v / 100);
      return [
        { ask: 0, v: (p.F1 * Math.PI * 2 * p.r) / p.P, msg: 'Du hast die Verluste vergessen. Es kommen nur ' + (100 - p.v) + ' % an.' },
        { ask: 1, v: p.mu * Fs, msg: 'Du hast nur eine Reibfläche gezählt. Zwei Backen drücken, also zwei Reibflächen.' },
      ];
    },
    tipps: () => ['a) Spannkraft aus der Schraube: F_Spann = F_1 · π · d : P · η.', 'b) Zwei Reibflächen: F_max = 2 · μ₀ · F_Spann', 'Rechne zuerst a) und setze das Resultat in b) ein.'],
    loesung: (p) => {
      const Fs = ((p.F1 * Math.PI * 2 * p.r) / p.P) * (1 - p.v / 100);
      return [
        `a) ${eq(f('F_Spann') + ' = ' + p.F1 + ' · π · ' + 2 * p.r + ' : ' + p.P + ' · ' + fmt(1 - p.v / 100, 2) + ' = ' + f(fmt(Fs) + ' N'))}`,
        `b) ${eq(f('F_max') + ' = 2 · ' + fmt(p.mu) + ' · ' + fmt(Fs) + ' = ' + f(fmt(2 * p.mu * Fs) + ' N'))}`,
        'Kombiniert: Schraube und Reibung.',
      ];
    },
  }),
];
