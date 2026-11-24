// Aufgaben zum Kapitel Biegen: gestreckte Länge, Ausgleichswert v, Profile, Rückfederung.
import { task, type Task } from '../../../core/types';
import { eq, f, l } from '../../../core/text';
import { fmt, pick } from '../../../core/zahl';
import * as B from './bilder';

const rad = (g: number) => (g * Math.PI) / 180;
/** Korrekturfaktor k, höchstens 1 */
const kKor = (r: number, s: number) => Math.min(1, 0.65 + 0.5 * Math.log10(r / s));
/** Ausgleichswert v je Biegestelle (DIN 6935), be = Öffnungswinkel β in Grad */
const vAus = (r: number, s: number, be = 90) => {
  const k = kKor(r, s);
  const bogen = rad(180 - be) * (r + (s / 2) * k);
  if (be <= 90) return 2 * (r + s) - bogen;
  if (be <= 165) return 2 * (r + s) * Math.tan(rad((180 - be) / 2)) - bogen;
  return 0;
};
/** Tabellenwert: v auf 0,1 mm gerundet */
const vt = (r: number, s: number, be = 90) => Math.round(vAus(r, s, be) * 10) / 10;

interface Form {
  name: string;
  turns: B.Dreh[];
  start: B.Start;
}
const FORMEN: Form[] = [
  { name: 'Winkel', turns: ['L'], start: 'S' },
  { name: 'U-Profil', turns: ['L', 'L'], start: 'S' },
  { name: 'Z-Profil', turns: ['L', 'R'], start: 'S' },
  { name: 'Wellenprofil', turns: ['R', 'R', 'L'], start: 'N' },
  { name: 'Hutprofil', turns: ['L', 'R', 'R', 'L'], start: 'E' },
];
const NAMEN = 'abcdefg';
const aufzaehlung = (legs: number[]) => legs.map((x, i) => `${NAMEN[i]} = ${x} mm`).join(', ');

export const AUFGABEN: Task[] = [
  // ---------- Gestreckte Länge bei 90° ----------

  task({
    id: 'b1', karte: 'grund', stufe: 1, familie: 'rechnen', src: 'Biegen, Grundaufgabe',
    title: 'Winkel 90°: Zuschnitt mit Tabellenwert',
    gen: () => {
      const s = pick([1, 2, 3]);
      const r = pick([4, 6, 10]);
      return { a: pick([40, 50, 60]), b: pick([25, 30, 40]), s, r, v: vt(r, s) };
    },
    draw: (p) => B.winkel({ a: p.a, b: p.b, be: 90, s: p.s, r: p.r, info: ['L = ?'] }),
    text: (p) => `Ein Blechwinkel (Blechdicke s = ${p.s} mm) wird auf 90° gebogen. Der Innenradius ist r = ${p.r} mm. Die Schenkel sind aussen gemessen: ${l('a = ' + p.a + ' mm')} und ${l('b = ' + p.b + ' mm')}. Der Ausgleichswert ist v = ${fmt(p.v, 1)} mm (Tabelle DIN 6935). Wie gross ist die gestreckte Länge L?`,
    asks: (p) => [{ k: 'L', unit: 'mm', v: p.a + p.b - p.v }],
    fehler: (p) => [
      { ask: 0, v: p.a + p.b, msg: 'Du hast v vergessen. Die Aussenmasse zählen die Ecke doppelt. Darum ziehst du v ab.' },
      { ask: 0, v: p.a + p.b + p.v, msg: 'Du hast v addiert. Das Blech wird beim Biegen nicht länger. v wird abgezogen.' },
    ],
    tipps: (p) => [
      'Die Schenkel sind Aussenmasse. Die Ecke ist darin doppelt gezählt.',
      'Zähle a und b zusammen. Dann ziehst du den Ausgleichswert v einmal ab.',
      `L = a + b − v = ${p.a} + ${p.b} − ${fmt(p.v, 1)}.`,
    ],
    loesung: (p) => [
      `${eq(l('L') + ' = a + b − v = ' + p.a + ' + ' + p.b + ' − ' + fmt(p.v, 1) + ' = ' + l(fmt(p.a + p.b - p.v, 1) + ' mm'))}`,
      'Die Aussenmasse zählen die Ecke doppelt. Darum ist L kleiner als a + b.',
    ],
  }),

  task({
    id: 'b2', karte: 'grund', stufe: 1, familie: 'fehler', src: 'Kreativ · Fehler finden',
    title: 'Zuschnitt: Wo steckt der Fehler?',
    gen: () => ({ a: pick([50, 60]), b: pick([30, 40]), s: 2, r: 4, v: vt(4, 2) }),
    draw: (p) => B.winkel({ a: p.a, b: p.b, be: 90, s: p.s, r: p.r, info: ['L = ?'] }),
    text: (p) => `Eine Lernende rechnet die gestreckte Länge eines 90°-Winkels (s = ${p.s} mm, r = ${p.r} mm, v = ${fmt(p.v, 1)} mm): «L = a + b + v = ${p.a} + ${p.b} + ${fmt(p.v, 1)} = ${fmt(p.a + p.b + p.v, 1)} mm». a) Was ist falsch? b) Wie gross ist L richtig?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: [
          'Sie addiert v. Der Ausgleichswert wird abgezogen.',
          'Sie zieht v nur einmal ab. Es braucht zwei Abzüge.',
          'Sie rechnet ohne die Blechdicke. Die Dicke muss dazu.',
          'Nichts. Die Formel L = a + b + v stimmt.',
        ],
        a: 0,
        why: [
          undefined,
          'Pro Biegestelle gibt es genau ein v. Der Winkel hat eine Biegestelle.',
          'Die Blechdicke steckt schon im Ausgleichswert v. Du musst sie nicht extra zählen.',
          'Die Formel heisst L = a + b − v. Vor v steht ein Minus.',
        ],
      },
      { k: 'b) L', unit: 'mm', v: p.a + p.b - p.v },
    ],
    fehler: (p) => [
      { ask: 1, v: p.a + p.b + p.v, msg: 'Das ist der falsche Wert der Lernenden. v wird abgezogen, nicht addiert.' },
      { ask: 1, v: p.a + p.b, msg: 'Du hast v ganz weggelassen. Es wird einmal abgezogen.' },
    ],
    tipps: () => [
      'Wird das gebogene Blech vor dem Biegen länger oder kürzer sein als a + b?',
      'Die Ecke zählt in den Aussenmassen doppelt. Dieser Betrag muss weg.',
      'L = a + b − v.',
    ],
    loesung: (p) => [
      'Fehler: v wird abgezogen, nicht addiert. Die Aussenmasse zählen die Ecke doppelt.',
      `${eq(l('L') + ' = ' + p.a + ' + ' + p.b + ' − ' + fmt(p.v, 1) + ' = ' + l(fmt(p.a + p.b - p.v, 1) + ' mm'))}`,
      `Mit dem falschen Zuschnitt wäre das Teil ${fmt(2 * p.v, 1)} mm zu lang.`,
    ],
  }),

  task({
    id: 'b3', karte: 'grund', stufe: 1, familie: 'bild', src: 'Kreativ · Bild deuten',
    title: 'Bild deuten: Wie viele Biegestellen?',
    gen: () => {
      const form = pick(FORMEN);
      const [s, r] = pick([[2, 2], [2, 4], [3, 3], [3, 6]]);
      const legs = Array.from({ length: form.turns.length + 1 }, () => pick([20, 30, 40, 50]));
      return { form, s, r, legs, v: vt(r, s) };
    },
    draw: (p) => B.profil({ legs: p.legs, turns: p.form.turns, start: p.form.start, s: p.s, r: p.r, info: ['L = ?'] }),
    text: (p) => `Das Bild zeigt ein Blechteil. Alle Biegungen sind 90°. Aussenmasse: ${l(aufzaehlung(p.legs))}. Der Ausgleichswert ist v = ${fmt(p.v, 1)} mm je Biegestelle. a) Wie viele Biegestellen hat das Teil? b) Wie gross ist die gestreckte Länge L?`,
    asks: (p) => {
      const n = p.legs.length - 1;
      return [
        {
          kind: 'choice', k: 'a) Biegestellen',
          opts: ['1 Biegestelle', '2 Biegestellen', '3 Biegestellen', '4 Biegestellen'],
          a: n - 1,
          why: [0, 1, 2, 3].map((i) => (i === n - 1 ? undefined : 'Zähle die Knicke im Bild. Die Zahl der Biegestellen ist die Zahl der Schenkel minus 1.')),
        },
        { k: 'b) L', unit: 'mm', v: p.legs.reduce((a: number, x: number) => a + x, 0) - n * p.v },
      ];
    },
    fehler: (p) => {
      const sum = p.legs.reduce((a: number, x: number) => a + x, 0);
      return [
        { ask: 1, v: sum - p.legs.length * p.v, msg: 'Du hast so oft v abgezogen, wie es Schenkel gibt. Es zählen die Biegestellen: ein Schenkel weniger.' },
        { ask: 1, v: sum, msg: 'Du hast v vergessen. Jede Biegestelle braucht einen Abzug.' },
      ];
    },
    tipps: () => [
      'Jede Biegestelle zieht einen Ausgleichswert v von der Summe der Aussenmasse ab.',
      'Zähle die Knicke im Bild. Dann zählst du alle Schenkel zusammen.',
      'L = Summe der Schenkel − Anzahl Biegestellen · v.',
    ],
    loesung: (p) => {
      const n = p.legs.length - 1;
      const sum = p.legs.reduce((a: number, x: number) => a + x, 0);
      return [
        `a) ${p.legs.length} Schenkel haben ${n} Biegestellen. Das Teil heisst ${p.form.name}.`,
        `b) ${eq(l('L') + ' = ' + p.legs.join(' + ') + ' − ' + n + ' · ' + fmt(p.v, 1) + ' = ' + l(fmt(sum - n * p.v, 1) + ' mm'))}`,
      ];
    },
  }),

  task({
    id: 'b4', karte: 'grund', stufe: 1, familie: 'schaetzen', src: 'Kreativ · Abschätzen, ohne Taschenrechner',
    title: 'Zuschnitt im Kopf: Faustregel v ≈ 2 · s',
    gen: () => ({ a: pick([30, 40, 50]), b: pick([20, 30, 40]), s: pick([2, 3]) }),
    draw: (p) => B.winkel({ a: p.a, b: p.b, be: 90, s: p.s, r: p.s, info: ['L ≈ ?'] }),
    text: (p) => `Ohne Taschenrechner: Ein Winkel wird auf 90° gebogen. Die Blechdicke ist s = ${p.s} mm. Der Innenradius ist gleich gross wie die Blechdicke: r = ${p.s} mm. Aussenmasse: ${l('a = ' + p.a + ' mm')} und ${l('b = ' + p.b + ' mm')}. Faustregel: Bei r = s ist v ≈ 2 · s. Wie lang ist der Zuschnitt L ungefähr? Eine Abweichung von 3 % ist erlaubt.`,
    asks: (p) => [{ k: 'L', unit: 'mm', v: p.a + p.b - vAus(p.s, p.s), tol: 0.03 }],
    fehler: (p) => [
      { ask: 0, v: p.a + p.b, msg: 'Du hast v vergessen. Ziehe 2 · s ab.' },
      { ask: 0, v: p.a + p.b + 2 * p.s, msg: 'Du hast 2 · s addiert. Bei Aussenmassen wird v abgezogen.' },
    ],
    tipps: (p) => [
      'Die Faustregel liefert v ohne Tabelle. Dann gilt L = a + b − v.',
      `v ≈ 2 · s = 2 · ${p.s} mm.`,
      `L ≈ ${p.a} + ${p.b} − ${2 * p.s}.`,
    ],
    loesung: (p) => [
      `Schätzung: ${eq(l('L') + ' ≈ ' + p.a + ' + ' + p.b + ' − 2 · ' + p.s + ' = ' + l(p.a + p.b - 2 * p.s + ' mm'))}`,
      `Genau (Formel): v = ${fmt(vAus(p.s, p.s), 2)} mm, also L = ${fmt(p.a + p.b - vAus(p.s, p.s), 1)} mm. Die Schätzung liegt nahe daran.`,
      'Die Faustregel gilt nur bei r ≈ s. Bei grösserem Radius wird v grösser.',
    ],
  }),

  task({
    id: 'b5', karte: 'grund', stufe: 2, familie: 'umgekehrt', src: 'Kreativ · Umgekehrt gefragt',
    title: 'Schenkel aus der Zuschnittlänge',
    gen: () => {
      const [s, r] = pick([[2, 4], [2, 6], [3, 6]]);
      return { L: pick([120, 150, 180]), a: pick([40, 50]), s, r, v: vt(r, s) };
    },
    draw: (p) => B.winkel({ a: p.a, b: p.L - p.a + p.v, be: 90, s: p.s, r: p.r, tb: 'b = ?', info: [`L = ${p.L} mm`] }),
    text: (p) => `Aus einem Blechstreifen ${l('L = ' + p.L + ' mm')} (s = ${p.s} mm) wird ein 90°-Winkel mit r = ${p.r} mm gebogen. Der Ausgleichswert ist v = ${fmt(p.v, 1)} mm. Ein Schenkel soll ${l('a = ' + p.a + ' mm')} haben (Aussenmass). Wie lang wird der andere Schenkel b (Aussenmass)?`,
    asks: (p) => [{ k: 'b', unit: 'mm', v: p.L - p.a + p.v }],
    fehler: (p) => [
      { ask: 0, v: p.L - p.a - p.v, msg: 'Du hast v beim Umstellen mit dem falschen Vorzeichen genommen. Aus L = a + b − v folgt b = L − a + v.' },
      { ask: 0, v: p.L - p.a, msg: 'Du hast v vergessen. Aus L = a + b − v folgt b = L − a + v.' },
    ],
    tipps: () => [
      'Stelle L = a + b − v nach b um.',
      'Das Minus vor v wird beim Umstellen zum Plus.',
      'b = L − a + v.',
    ],
    loesung: (p) => [
      `${eq('b = L − a + v = ' + p.L + ' − ' + p.a + ' + ' + fmt(p.v, 1) + ' = ' + l(fmt(p.L - p.a + p.v, 1) + ' mm'))}`,
      'Umgekehrt gefragt: Der Zuschnitt ist da, das Bauteilmass ist gesucht.',
    ],
  }),

  // ---------- Ausgleichswert v selbst berechnen ----------

  task({
    id: 'b6', karte: 'formel', stufe: 2, familie: 'rechnen', src: 'Biegen, Formel',
    title: 'Ausgleichswert selbst berechnen',
    gen: () => ({ s: pick([2, 3, 4]), r: pick([6, 10, 16]), a: pick([50, 80]), b: pick([40, 60]) }),
    draw: (p) => B.winkel({ a: p.a, b: p.b, be: 90, s: p.s, r: p.r, info: ['L = ?'] }),
    text: (p) => `Berechne für s = ${p.s} mm, r = ${p.r} mm und β = 90° a) den Korrekturfaktor k, b) den Ausgleichswert v und c) die gestreckte Länge L für ${l('a = ' + p.a + ' mm')} und ${l('b = ' + p.b + ' mm')}.`,
    asks: (p) => {
      const v = vAus(p.r, p.s);
      return [
        { k: 'a) k', unit: '', v: kKor(p.r, p.s) },
        { k: 'b) v', unit: 'mm', v },
        { k: 'c) L', unit: 'mm', v: p.a + p.b - v },
      ];
    },
    fehler: (p) => {
      const k = kKor(p.r, p.s);
      const roh = 0.65 + 0.5 * Math.log10(p.r / p.s);
      const aus: { ask: number; v: number; msg: string }[] = [
        { ask: 1, v: (Math.PI / 2) * (p.r + (p.s / 2) * k), msg: 'Du hast nur den Bogen gerechnet. Vorne fehlt der Teil 2 · (r + s).' },
        { ask: 2, v: p.a + p.b, msg: 'Du hast v vergessen. Es wird einmal abgezogen.' },
      ];
      if (roh > 1.03) aus.push({ ask: 0, v: roh, msg: 'Der Korrekturfaktor ist höchstens 1. Du hast die Obergrenze vergessen.' });
      return aus;
    },
    tipps: () => [
      'Drei Schritte: erst k, dann v, dann L.',
      'k = 0,65 + 0,5 · lg(r : s). Ist das Resultat grösser als 1, nimmst du k = 1.',
      'v = 2 · (r + s) − π/2 · (r + s/2 · k). Dann L = a + b − v.',
    ],
    loesung: (p) => {
      const k = kKor(p.r, p.s);
      const v = vAus(p.r, p.s);
      return [
        `a) ${eq('k = 0,65 + 0,5 · lg(' + p.r + ' : ' + p.s + ') = ' + fmt(k, 3))}`,
        `b) ${eq('v = 2 · (' + p.r + ' + ' + p.s + ') − π/2 · (' + p.r + ' + ' + fmt(p.s / 2) + ' · ' + fmt(k, 3) + ') = ' + fmt(v, 2) + ' mm')}`,
        `c) ${eq(l('L') + ' = ' + p.a + ' + ' + p.b + ' − ' + fmt(v, 2) + ' = ' + l(fmt(p.a + p.b - v, 1) + ' mm'))}`,
        'Vergleich mit der Tabelle: Dort steht v gerundet auf ' + fmt(v, 1) + ' mm.',
      ];
    },
  }),

  task({
    id: 'b7', karte: 'formel', stufe: 3, familie: 'rechnen', src: 'Biegen, stumpfer Winkel',
    title: 'Biegung mit β über 90°',
    gen: () => ({ a: pick([40, 60]), b: pick([40, 50]), s: 2, r: pick([4, 6]), be: pick([110, 120, 135]) }),
    draw: (p) => B.winkel({ a: p.a, b: p.b, be: p.be, s: p.s, r: p.r, info: ['L = ?'] }),
    text: (p) => `Ein Blech (s = ${p.s} mm, r = ${p.r} mm) wird so gebogen, dass der Öffnungswinkel β = ${p.be}° beträgt. Aussenmasse ${l('a = ' + p.a + ' mm')}, ${l('b = ' + p.b + ' mm')}. Berechne k, v und L.`,
    asks: (p) => {
      const v = vAus(p.r, p.s, p.be);
      return [
        { k: 'k', unit: '', v: kKor(p.r, p.s) },
        { k: 'v', unit: 'mm', v },
        { k: 'L', unit: 'mm', v: p.a + p.b - v },
      ];
    },
    fehler: (p) => {
      const v90 = vAus(p.r, p.s, 90);
      return [
        { ask: 1, v: v90, msg: 'Du hast die Formel für 90° benutzt. Über 90° gilt die Formel mit dem Tangens.' },
        { ask: 2, v: p.a + p.b - v90, msg: 'Du hast mit v für 90° gerechnet. Bei diesem Winkel ist v kleiner.' },
      ];
    },
    tipps: () => [
      'Über 90° (bis 165°) gilt die Formel mit tan((180° − β) : 2).',
      'Erst k wie immer, dann v mit dem Tangens. Der Bogen nutzt den Winkel 180° − β.',
      'v = 2 · (r + s) · tan((180° − β) : 2) − π · (180° − β) : 180° · (r + s/2 · k). Dann L = a + b − v.',
    ],
    loesung: (p) => {
      const k = kKor(p.r, p.s);
      const v = vAus(p.r, p.s, p.be);
      const h = (180 - p.be) / 2;
      return [
        `${eq('k = 0,65 + 0,5 · lg(' + p.r + ' : ' + p.s + ') = ' + fmt(k, 3))}`,
        `${eq('v = 2 · ' + (p.r + p.s) + ' · tan ' + h + '° − π · ' + (180 - p.be) + '/180 · (' + p.r + ' + ' + fmt(p.s / 2) + ' · ' + fmt(k, 3) + ') = ' + fmt(v, 2) + ' mm')}`,
        `${eq(l('L') + ' = ' + p.a + ' + ' + p.b + ' − ' + fmt(v, 2) + ' = ' + l(fmt(p.a + p.b - v, 1) + ' mm'))}`,
        'Je stumpfer der Winkel, desto kleiner v. Ab 165° ist v praktisch null.',
      ];
    },
  }),

  task({
    id: 'b8', karte: 'formel', stufe: 2, familie: 'waswaere', src: 'Kreativ · Was wäre wenn',
    title: 'Was wäre wenn: grösserer Biegeradius',
    gen: () => {
      const s = pick([2, 3]);
      return { a: pick([50, 60]), b: pick([30, 40]), s, r1: s, r2: 4 * s };
    },
    draw: (p) => B.winkel({ a: p.a, b: p.b, be: 90, s: p.s, r: p.r2, info: ['neuer Radius'] }),
    text: (p) => `Ein 90°-Winkel (s = ${p.s} mm, ${l('a = ' + p.a + ' mm')}, ${l('b = ' + p.b + ' mm')}) wird mit r = ${p.r1} mm gebogen. Jetzt nimmst du das vierfache Werkzeug: r = ${p.r2} mm. Aussenmasse und Blech bleiben gleich. a) Was passiert mit v und L? b) Wie gross ist L jetzt?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Änderung',
        opts: [
          'v wird grösser. L wird kürzer.',
          'v wird kleiner. L wird länger.',
          'v bleibt gleich. L bleibt gleich.',
          'v wird grösser. L wird länger.',
        ],
        a: 0,
        why: [
          undefined,
          'Ein grösserer Radius macht den Bogen länger. Das vergrössert v.',
          'v hängt vom Radius ab: v = 2 · (r + s) − π/2 · (r + s/2 · k).',
          'v wird abgezogen. Ein grösserer Abzug macht L kürzer, nicht länger.',
        ],
      },
      { k: 'b) L neu', unit: 'mm', v: p.a + p.b - vAus(p.r2, p.s) },
    ],
    fehler: (p) => [
      { ask: 1, v: p.a + p.b - vAus(p.r1, p.s), msg: 'Das ist L für den kleinen Radius. Mit grösserem r wird v grösser.' },
    ],
    tipps: () => [
      'Aussenmasse bleiben gleich. Nur v ändert sich, weil r anders ist.',
      'Rechne v für den neuen Radius mit der Formel. Erst k, dann v.',
      'L = a + b − v mit dem neuen v.',
    ],
    loesung: (p) => {
      const v1 = vAus(p.r1, p.s);
      const v2 = vAus(p.r2, p.s);
      return [
        `${eq('v(r = ' + p.r1 + ') = ' + fmt(v1, 2) + ' mm,   v(r = ' + p.r2 + ') = ' + fmt(v2, 2) + ' mm')}`,
        `${eq(l('L') + ' = ' + p.a + ' + ' + p.b + ' − ' + fmt(v2, 2) + ' = ' + l(fmt(p.a + p.b - v2, 1) + ' mm'))}`,
        `Vorher war L = ${fmt(p.a + p.b - v1, 1)} mm. Der Zuschnitt wird ${fmt(v2 - v1, 1)} mm kürzer.`,
      ];
    },
  }),

  task({
    id: 'b9', karte: 'formel', stufe: 2, familie: 'begruenden', src: 'Kreativ · Begründen',
    title: 'Begründen: flache Biegung',
    gen: () => ({ be: pick([140, 150, 160]), s: pick([2, 3]), r: pick([4, 6]), a: 50, b: 40 }),
    draw: (p) => B.winkel({ a: p.a, b: p.b, be: p.be, s: p.s, r: p.r, info: ['v = ?'] }),
    text: (p) => `Ein Blech (s = ${p.s} mm, r = ${p.r} mm) wird nur wenig abgewinkelt. Der Öffnungswinkel ist β = ${p.be}°. a) Ist v kleiner oder grösser als bei 90°? b) Wie gross ist v?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Vergleich',
        opts: [
          'Kleiner. Je flacher die Biegung, desto weniger Ausgleich.',
          'Grösser. Je flacher die Biegung, desto mehr Ausgleich.',
          'Gleich gross. Nur Dicke und Radius zählen.',
          'Gleich gross. v gilt für jede Biegung desselben Blechs.',
        ],
        a: 0,
        why: [
          undefined,
          'Bei flacher Biegung wird das Blech kaum gestaucht. Der Ausgleich ist klein.',
          'Der Winkel steckt in der Formel: Er bestimmt, wie viel Blech gebogen wird.',
          'v gilt nur für den Winkel, für den es berechnet wurde. Bei 90° ist v grösser.',
        ],
      },
      { k: 'b) v', unit: 'mm', v: vAus(p.r, p.s, p.be) },
    ],
    fehler: (p) => [{ ask: 1, v: vAus(p.r, p.s, 90), msg: 'Das ist v für 90°. Bei diesem Winkel gilt die Formel mit dem Tangens.' }],
    tipps: () => [
      'Denke an den Grenzfall: Bei β = 180° ist das Blech gerade. Dort ist v null.',
      'Über 90° gilt die Formel mit tan((180° − β) : 2).',
      'v = 2 · (r + s) · tan((180° − β) : 2) − π · (180° − β) : 180° · (r + s/2 · k).',
    ],
    loesung: (p) => {
      const k = kKor(p.r, p.s);
      const h = (180 - p.be) / 2;
      return [
        `a) Kleiner. Bei 90° ist v = ${fmt(vAus(p.r, p.s, 90), 2)} mm, hier nur ${fmt(vAus(p.r, p.s, p.be), 2)} mm.`,
        `b) ${eq('k = ' + fmt(k, 3) + ',   v = 2 · ' + (p.r + p.s) + ' · tan ' + h + '° − π · ' + (180 - p.be) + '/180 · (' + p.r + ' + ' + fmt(p.s / 2) + ' · ' + fmt(k, 3) + ') = ' + fmt(vAus(p.r, p.s, p.be), 2) + ' mm')}`,
        'Ab 165° rechnet man mit v ≈ 0.',
      ];
    },
  }),

  // ---------- Profile mit mehreren Biegestellen ----------

  task({
    id: 'b10', karte: 'profile', stufe: 2, familie: 'rechnen', src: 'Biegen, zwei Biegestellen',
    title: 'U-Profil aus Blech',
    gen: () => ({ a: pick([30, 40]), b: pick([60, 80]), c: pick([30, 40]), s: pick([2, 3]), r: pick([4, 6]) }),
    draw: (p) => B.profil({ legs: [p.a, p.b, p.c], turns: ['L', 'L'], start: 'S', s: p.s, r: p.r, info: ['L = ?'] }),
    text: (p) => `Ein U-Profil (s = ${p.s} mm, r = ${p.r} mm) hat zwei 90°-Biegungen. Die Aussenmasse sind ${l('a = ' + p.a + ' mm')}, ${l('b = ' + p.b + ' mm')} und ${l('c = ' + p.c + ' mm')}. Wie gross sind a) v je Biegestelle und b) die gestreckte Länge L?`,
    asks: (p) => {
      const v = vAus(p.r, p.s);
      return [
        { k: 'a) v je Biegestelle', unit: 'mm', v },
        { k: 'b) L', unit: 'mm', v: p.a + p.b + p.c - 2 * v },
      ];
    },
    fehler: (p) => {
      const v = vAus(p.r, p.s);
      return [
        { ask: 1, v: p.a + p.b + p.c - v, msg: 'Du hast v nur einmal abgezogen. Das U-Profil hat zwei Biegestellen.' },
        { ask: 1, v: p.a + p.b + p.c, msg: 'Du hast v vergessen. Jede Biegestelle braucht einen Abzug.' },
      ];
    },
    tipps: () => [
      'Jede Biegestelle bekommt ein v.',
      'Zähle die Biegestellen im Bild. Ein U hat zwei.',
      'L = a + b + c − 2 · v.',
    ],
    loesung: (p) => {
      const v = vAus(p.r, p.s);
      return [
        `a) ${eq('v = ' + fmt(v, 2) + ' mm')} (Formel oder Tabelle)`,
        `b) ${eq(l('L') + ' = ' + p.a + ' + ' + p.b + ' + ' + p.c + ' − 2 · ' + fmt(v, 2) + ' = ' + l(fmt(p.a + p.b + p.c - 2 * v, 1) + ' mm'))}`,
      ];
    },
  }),

  task({
    id: 'b11', karte: 'profile', stufe: 2, familie: 'fehler', src: 'Kreativ · Fehler finden',
    title: 'Fehler finden: Hutprofil',
    gen: () => {
      const [s, r] = pick([[2, 2], [2, 4]]);
      const fl = pick([20, 30]);
      const w = pick([25, 35]);
      const t = pick([40, 50, 60]);
      return { legs: [fl, w, t, w, fl], s, r, v: vt(r, s) };
    },
    draw: (p) => B.profil({ legs: p.legs, turns: ['L', 'R', 'R', 'L'], start: 'E', s: p.s, r: p.r, info: ['L = ?'] }),
    text: (p) => {
      const sum = p.legs.reduce((a: number, x: number) => a + x, 0);
      return `Ein Hutprofil (s = ${p.s} mm, r = ${p.r} mm, v = ${fmt(p.v, 1)} mm, alle Biegungen 90°) hat die Aussenmasse ${l(aufzaehlung(p.legs))}. Marco rechnet: «L = a + b + c + d + e − 2 · v = ${sum} − 2 · ${fmt(p.v, 1)} = ${fmt(sum - 2 * p.v, 1)} mm». a) Was ist falsch? b) Wie gross ist L richtig?`;
    },
    asks: (p) => {
      const sum = p.legs.reduce((a: number, x: number) => a + x, 0);
      return [
        {
          kind: 'choice', k: 'a) Fehler',
          opts: [
            'Er zieht v nur zweimal ab. Es gibt vier Biegestellen.',
            'Er muss v zur Summe addieren, nicht abziehen.',
            'Er darf die Schenkel a und e nicht mitrechnen.',
            'Nichts. Bei einem Hutprofil zählt man zwei Biegestellen.',
          ],
          a: 0,
          why: [
            undefined,
            'v wird abgezogen. Die Ecken sind in den Aussenmassen doppelt gezählt.',
            'Alle Schenkel gehören zum Zuschnitt. Auch die Flansche a und e werden gebogen und geschnitten.',
            'Im Bild sind vier Knicke zu sehen: je einer zwischen zwei Schenkeln.',
          ],
        },
        { k: 'b) L', unit: 'mm', v: sum - 4 * p.v },
      ];
    },
    fehler: (p) => {
      const sum = p.legs.reduce((a: number, x: number) => a + x, 0);
      return [
        { ask: 1, v: sum - 2 * p.v, msg: 'Das ist Marcos Resultat. Das Hutprofil hat vier Biegestellen, also vier Abzüge.' },
        { ask: 1, v: sum, msg: 'Du hast v vergessen. Jede Biegestelle braucht einen Abzug.' },
      ];
    },
    tipps: () => [
      'Zähle die Biegestellen im Bild und vergleiche mit Marcos Abzügen.',
      'Fünf Schenkel haben vier Biegestellen.',
      'L = Summe der Schenkel − 4 · v.',
    ],
    loesung: (p) => {
      const sum = p.legs.reduce((a: number, x: number) => a + x, 0);
      return [
        'Fehler: Marco zieht v nur zweimal ab. Es gibt vier Biegestellen.',
        `${eq(l('L') + ' = ' + p.legs.join(' + ') + ' − 4 · ' + fmt(p.v, 1) + ' = ' + l(fmt(sum - 4 * p.v, 1) + ' mm'))}`,
        `Mit Marcos Zuschnitt wäre das Teil ${fmt(2 * p.v, 1)} mm zu lang.`,
      ];
    },
  }),

  task({
    id: 'b12', karte: 'profile', stufe: 3, familie: 'rechnen', src: 'Kreativ · Wellenprofil',
    title: 'Wellenprofil mit drei Biegestellen',
    gen: () => ({ legs: [pick([30, 40]), pick([40, 50]), pick([30, 40]), pick([30, 50])], s: pick([2, 3]), r: pick([6, 10]) }),
    draw: (p) => B.profil({ legs: p.legs, turns: ['R', 'R', 'L'], start: 'N', s: p.s, r: p.r, info: ['L = ?'] }),
    text: (p) => `Ein Wellenprofil (s = ${p.s} mm, r = ${p.r} mm) hat drei 90°-Biegungen. Aussenmasse: ${l(aufzaehlung(p.legs))}. a) Berechne v je Biegestelle mit der Formel. b) Wie lang ist der Zuschnitt L?`,
    asks: (p) => {
      const v = vAus(p.r, p.s);
      const sum = p.legs.reduce((a: number, x: number) => a + x, 0);
      return [
        { k: 'a) v', unit: 'mm', v },
        { k: 'b) L', unit: 'mm', v: sum - 3 * v },
      ];
    },
    fehler: (p) => {
      const v = vAus(p.r, p.s);
      const sum = p.legs.reduce((a: number, x: number) => a + x, 0);
      return [
        { ask: 1, v: sum - 2 * v, msg: 'Du hast v nur zweimal abgezogen. Zähle die Knicke im Bild: Es sind drei.' },
        { ask: 1, v: sum - 4 * v, msg: 'Du hast v viermal abgezogen. Vier Schenkel haben nur drei Biegestellen.' },
      ];
    },
    tipps: () => [
      'Erst v mit der Formel (erst k, dann v). Dann zählst du die Biegestellen.',
      'Vier Schenkel haben drei Biegestellen.',
      'L = a + b + c + d − 3 · v.',
    ],
    loesung: (p) => {
      const k = kKor(p.r, p.s);
      const v = vAus(p.r, p.s);
      const sum = p.legs.reduce((a: number, x: number) => a + x, 0);
      return [
        `a) ${eq('k = ' + fmt(k, 3) + ',   v = 2 · ' + (p.r + p.s) + ' − π/2 · (' + p.r + ' + ' + fmt(p.s / 2) + ' · ' + fmt(k, 3) + ') = ' + fmt(v, 2) + ' mm')}`,
        `b) ${eq(l('L') + ' = ' + p.legs.join(' + ') + ' − 3 · ' + fmt(v, 2) + ' = ' + l(fmt(sum - 3 * v, 1) + ' mm'))}`,
      ];
    },
  }),

  task({
    id: 'b13', karte: 'profile', stufe: 3, familie: 'kette', src: 'Kreativ · Kombiniert',
    title: 'Blechhalter: Zuschnitt und Masse',
    gen: () => ({ a: pick([40, 60]), b: pick([80, 100]), c: pick([40, 60]), w: pick([30, 50]), s: 3, r: 6 }),
    draw: (p) => B.profil({ legs: [p.a, p.b, p.c], turns: ['L', 'L'], start: 'S', s: p.s, r: p.r, info: [`Breite ${p.w} mm`, 'Stahl'] }),
    text: (p) => `Ein U-förmiger Blechhalter (s = ${p.s} mm, r = ${p.r} mm, Breite ${p.w} mm) hat die Aussenmasse ${l('a = ' + p.a + ' mm')}, ${l('b = ' + p.b + ' mm')} und ${l('c = ' + p.c + ' mm')}. Stahl: Dichte 7,85 kg/dm³. Berechne a) die gestreckte Länge, b) das Volumen des Zuschnitts in cm³ und c) die Masse in g.`,
    asks: (p) => {
      const L = p.a + p.b + p.c - 2 * vAus(p.r, p.s);
      const V = (L * p.w * p.s) / 1000;
      return [
        { k: 'a) L', unit: 'mm', v: L },
        { k: 'b) V', unit: 'cm³', v: V },
        { k: 'c) m', unit: 'g', v: V * 7.85 },
      ];
    },
    fehler: (p) => {
      const v = vAus(p.r, p.s);
      return [
        { ask: 0, v: p.a + p.b + p.c - v, msg: 'Du hast v nur einmal abgezogen. Das U hat zwei Biegestellen.' },
        { ask: 0, v: p.a + p.b + p.c, msg: 'Du hast v vergessen. Der Zuschnitt ist kürzer als die Summe der Aussenmasse.' },
      ];
    },
    tipps: () => [
      'Drei Schritte: erst L, dann das Volumen, dann die Masse.',
      'Volumen: V = L · Breite · s. Das gibt mm³. Durch 1000 teilen gibt cm³.',
      '7,85 kg/dm³ ist dasselbe wie 7,85 g/cm³. Masse m = V · Dichte.',
    ],
    loesung: (p) => {
      const v = vAus(p.r, p.s);
      const L = p.a + p.b + p.c - 2 * v;
      const V = (L * p.w * p.s) / 1000;
      return [
        `a) ${eq(l('L') + ' = ' + (p.a + p.b + p.c) + ' − 2 · ' + fmt(v, 2) + ' = ' + l(fmt(L, 1) + ' mm'))}`,
        `b) ${eq('V = ' + fmt(L, 1) + ' · ' + p.w + ' · ' + p.s + ' = ' + fmt(L * p.w * p.s) + ' mm³ = ' + fmt(V, 2) + ' cm³')}`,
        `c) ${eq('m = ' + fmt(V, 2) + ' cm³ · 7,85 g/cm³ = ' + fmt(V * 7.85) + ' g')}`,
        'Kombiniert: Biegen und Masse berechnen.',
      ];
    },
  }),

  // ---------- Rückfederung ----------

  task({
    id: 'b14', karte: 'rueck', stufe: 2, familie: 'rechnen', src: 'Biegen, Rückfederung',
    title: 'Rückfederung: Werkzeug richtig einstellen',
    gen: () => ({ a2: 90, s: pick([1, 2]), r2: pick([10, 20]), kR: pick([0.96, 0.93, 0.9]) }),
    draw: (p) => B.rueckfeder({ a2: p.a2, t1: 'Werkzeug: α_1 = ?', info: [`k_R = ${fmt(p.kR, 2)}`, `r_2 = ${p.r2} mm`, `s = ${p.s} mm`] }),
    text: (p) => `Ein Blech (s = ${p.s} mm) soll am Werkstück den Winkel α_2 = ${p.a2}° und den Innenradius r_2 = ${p.r2} mm haben. Der Rückfederungsfaktor ist k_R = ${fmt(p.kR, 2)}. Auf welchen Winkel α_1 und welchen Radius r_1 muss das Werkzeug eingestellt werden?`,
    asks: (p) => [
      { k: 'α_1', unit: '°', v: p.a2 / p.kR },
      { k: 'r_1', unit: 'mm', v: p.kR * (p.r2 + 0.5 * p.s) - 0.5 * p.s },
    ],
    fehler: (p) => [
      { ask: 0, v: p.a2 * p.kR, msg: 'Du hast mit k_R multipliziert. Das Werkzeug muss weiter biegen: α_1 = α_2 : k_R.' },
      { ask: 1, v: p.r2, msg: 'Du hast den Radius nicht korrigiert. Auch der Radius federt zurück.' },
      { ask: 1, v: p.r2 / p.kR, msg: 'Beim Radius gilt eine andere Formel: r_1 = k_R · (r_2 + 0,5 · s) − 0,5 · s.' },
    ],
    tipps: () => [
      'Das Blech federt nach dem Biegen zurück. Das Werkzeug muss darum weiter biegen.',
      'Der Winkel: α_1 = α_2 : k_R. Der Radius hat eine eigene Formel.',
      'r_1 = k_R · (r_2 + 0,5 · s) − 0,5 · s.',
    ],
    loesung: (p) => [
      `${eq('α_1 = ' + p.a2 + '° : ' + fmt(p.kR, 2) + ' = ' + fmt(p.a2 / p.kR, 1) + '°')}`,
      `${eq('r_1 = ' + fmt(p.kR, 2) + ' · (' + p.r2 + ' + ' + fmt(0.5 * p.s) + ') − ' + fmt(0.5 * p.s) + ' = ' + fmt(p.kR * (p.r2 + 0.5 * p.s) - 0.5 * p.s, 2) + ' mm')}`,
      'Das Werkzeug biegt etwas weiter und enger. Das Blech federt danach auf das gewünschte Mass zurück.',
      `${f('Warnung:')} Prüfe den Winkel nie mit der Hand im Werkzeug der Abkantpresse. Das Werkzeug kann sich senken. Es droht Quetschgefahr für die Finger.`,
    ],
    loesungsbild: (p) => B.rueckfeder({ a2: p.a2, a1: p.a2 / p.kR, t1: `Werkzeug: α_1 = ${fmt(p.a2 / p.kR, 1)}°`, info: [`k_R = ${fmt(p.kR, 2)}`, `r_2 = ${p.r2} mm`, `s = ${p.s} mm`] }),
  }),

  task({
    id: 'b15', karte: 'rueck', stufe: 2, familie: 'fehler', src: 'Kreativ · Fehler finden',
    title: 'Fehler finden: Werkzeugwinkel',
    gen: () => ({ a2: pick([60, 90, 120]), kR: pick([0.93, 0.95, 0.97]) }),
    draw: (p) => B.rueckfeder({ a2: p.a2, t1: 'Werkzeug: α_1 = ?', info: [`k_R = ${fmt(p.kR, 2)}`] }),
    text: (p) => `Ein Blech soll am Werkstück ${p.a2}° haben. Der Rückfederungsfaktor ist k_R = ${fmt(p.kR, 2)}. Jan rechnet: «α_1 = α_2 · k_R = ${p.a2}° · ${fmt(p.kR, 2)} = ${fmt(p.a2 * p.kR, 1)}°». a) Was ist falsch? b) Wie gross ist α_1 richtig?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: [
          'Er muss durch k_R teilen, nicht multiplizieren.',
          'Er muss k_R von α_2 abziehen.',
          'Er darf k_R nicht brauchen. Der Winkel bleibt gleich.',
          'Nichts. Das Werkzeug muss weniger weit biegen.',
        ],
        a: 0,
        why: [
          undefined,
          'k_R ist ein Faktor und keine Winkelgrösse. Er wird nicht abgezogen.',
          'Das Blech federt zurück. Ohne Korrektur bleibt das Werkstück zu offen.',
          'Das Blech federt auf. Das Werkzeug muss darum weiter biegen, nicht weniger weit.',
        ],
      },
      { k: 'b) α_1', unit: '°', v: p.a2 / p.kR },
    ],
    fehler: (p) => [{ ask: 1, v: p.a2 * p.kR, msg: 'Das ist Jans Wert. Er ist kleiner als α_2. Das Werkzeug muss aber weiter biegen: durch k_R teilen.' }],
    tipps: () => [
      'Das Blech federt zurück. Muss das Werkzeug mehr oder weniger weit biegen?',
      'k_R ist kleiner als 1. Das Resultat α_1 muss grösser sein als α_2.',
      'α_1 = α_2 : k_R.',
    ],
    loesung: (p) => [
      'Fehler: Jan multipliziert. Dann wäre α_1 kleiner als α_2. Das Blech würde noch weiter aufspringen.',
      `${eq('α_1 = ' + p.a2 + '° : ' + fmt(p.kR, 2) + ' = ' + fmt(p.a2 / p.kR, 1) + '°')}`,
    ],
  }),

  task({
    id: 'b16', karte: 'rueck', stufe: 3, familie: 'umgekehrt', src: 'Kreativ · Umgekehrt gefragt',
    title: 'Rückfederungsfaktor aus dem Versuch',
    gen: () => ({ a1: pick([92, 93, 94, 95]), a2: 90, neu: pick([60, 120]) }),
    draw: (p) => B.rueckfeder({ a2: p.a2, a1: p.a1, info: ['Versuchsstück'] }),
    text: (p) => `Beim Probebiegen stellst du das Werkzeug auf α_1 = ${p.a1}°. Das Werkstück federt auf α_2 = ${p.a2}° zurück. a) Wie gross ist k_R? b) Gleiches Blech, gleicher Radius: Auf welchen Winkel α_1 stellst du das Werkzeug für ein Werkstück mit α_2 = ${p.neu}°?`,
    asks: (p) => [
      { k: 'a) k_R', unit: '', v: p.a2 / p.a1 },
      { k: 'b) α_1', unit: '°', v: (p.neu * p.a1) / p.a2 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.a1 / p.a2, msg: 'Du hast gedreht. k_R ist kleiner als 1: α_2 : α_1.' },
      { ask: 1, v: p.neu * (p.a2 / p.a1), msg: 'Du hast mit k_R multipliziert. Das Werkzeug muss weiter biegen: durch k_R teilen.' },
    ],
    tipps: () => [
      'Die Formel α_1 = α_2 : k_R lässt sich nach k_R umstellen.',
      'k_R = α_2 : α_1. Das Resultat ist kleiner als 1.',
      'Mit diesem k_R rechnest du für das neue Werkstück α_1 = α_2 : k_R.',
    ],
    loesung: (p) => [
      `a) ${eq('k_R = α_2 : α_1 = ' + p.a2 + '° : ' + p.a1 + '° = ' + fmt(p.a2 / p.a1, 3))}`,
      `b) ${eq('α_1 = ' + p.neu + '° : ' + fmt(p.a2 / p.a1, 3) + ' = ' + fmt((p.neu * p.a1) / p.a2, 1) + '°')}`,
      'Umgekehrt gefragt: Der Versuch liefert k_R, danach stellst du jedes Werkstück richtig ein.',
    ],
  }),

  task({
    id: 'b17', karte: 'rueck', stufe: 2, familie: 'waswaere', src: 'Kreativ · Was wäre wenn',
    title: 'Was wäre wenn: grösserer Radius',
    gen: () => ({ a2: pick([60, 90]), kR1: pick([0.96, 0.97]), kR2: pick([0.9, 0.88, 0.85]), r1: 10, r2: 40 }),
    draw: (p) => B.rueckfeder({ a2: p.a2, info: ['gleiches Blech', `r = ${p.r1} mm oder ${p.r2} mm`] }),
    text: (p) => `Ein Blech wird zuerst mit r = ${p.r1} mm gebogen (k_R = ${fmt(p.kR1, 2)}). Jetzt nimmst du r = ${p.r2} mm. Gleiches Blech. Der Tabellenwert ist k_R = ${fmt(p.kR2, 2)}. a) Wie ändert sich die Rückfederung? b) Auf welchen Winkel α_1 stellst du das Werkzeug für α_2 = ${p.a2}°?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Änderung',
        opts: [
          'Das Blech federt stärker zurück. k_R wird kleiner.',
          'Das Blech federt weniger zurück. k_R wird grösser.',
          'Die Rückfederung bleibt gleich. Nur die Dicke zählt.',
          'Das Blech federt nur bei kleinem Radius zurück.',
        ],
        a: 0,
        why: [
          undefined,
          'Je grösser der Radius im Vergleich zur Dicke, desto weniger wird das Blech bleibend verformt. Es federt stärker zurück.',
          'Der Radius zählt mit. Das Verhältnis r : s bestimmt die Rückfederung.',
          'Jedes Blech federt zurück. Bei grossem Radius sogar stärker.',
        ],
      },
      { k: 'b) α_1', unit: '°', v: p.a2 / p.kR2 },
    ],
    fehler: (p) => [{ ask: 1, v: p.a2 / p.kR1, msg: 'Das ist der Winkel für den alten Radius. Für r = ' + p.r2 + ' mm gilt der neue k_R.' }],
    tipps: () => [
      'Ein grosser Radius biegt das Blech nur sanft. Es bleibt kaum bleibend verformt.',
      'Der neue k_R ist kleiner als der alte. Das Werkzeug muss weiter biegen.',
      'α_1 = α_2 : k_R mit dem neuen k_R.',
    ],
    loesung: (p) => [
      'a) Mit grösserem Radius federt das Blech stärker zurück. k_R wird kleiner.',
      `b) ${eq('α_1 = ' + p.a2 + '° : ' + fmt(p.kR2, 2) + ' = ' + fmt(p.a2 / p.kR2, 1) + '°')}`,
      `Beim alten Radius waren es nur ${fmt(p.a2 / p.kR1, 1)}°.`,
    ],
  }),

  task({
    id: 'b18', karte: 'rueck', stufe: 2, familie: 'begruenden', src: 'Kreativ · Begründen',
    title: 'Begründen: Welches Blech federt stärker zurück?',
    gen: () => ({ paar: pick([['weiches Kupfer', 'Federstahl'], ['weiches Aluminium', 'Edelstahl'], ['Reinkupfer', 'Federbandstahl']]) }),
    text: (p) => `Zwei Bleche mit gleicher Dicke werden mit gleichem Radius auf 90° gebogen: ${p.paar[0]} und ${p.paar[1]}. Welches Blech muss das Werkzeug weiter überbiegen? Begründe.`,
    asks: (p) => [
      {
        kind: 'choice', k: 'Auswahl',
        opts: [
          `${p.paar[1]}. Es ist fester und federt stärker zurück.`,
          `${p.paar[0]}. Es ist weicher und federt stärker zurück.`,
          'Beide gleich. Dicke und Radius sind gleich.',
          `${p.paar[0]}. Es ist weicher und verformt sich bleibend.`,
        ],
        a: 0,
        why: [
          undefined,
          'Ein weicher Werkstoff wird beim Biegen bleibend verformt. Er federt wenig zurück.',
          'Auch der Werkstoff zählt. Fester Werkstoff federt stärker zurück.',
          'Das stimmt für das weiche Blech. Darum braucht es aber nur wenig Überbiegen.',
        ],
      },
    ],
    tipps: () => [
      'Rückfederung ist der elastische Anteil der Verformung.',
      'Ein fester Werkstoff hat einen grossen elastischen Bereich.',
      'Je fester der Werkstoff, desto kleiner ist k_R.',
    ],
    loesung: (p) => [
      `${p.paar[1]} ist fester. Es verformt sich beim Biegen stärker elastisch und springt nach dem Entlasten weiter auf.`,
      `${p.paar[0]} bleibt fast so, wie du es biegst. Der k_R-Wert liegt nahe bei 1.`,
      'Merke: fester Werkstoff, kleiner k_R, mehr Überbiegen.',
    ],
  }),
];
