// Aufgaben zum Kapitel Arbeit, Energie: Hub-, Reibungs-, Spannarbeit, potenzielle und kinetische Energie.
import { task, type Task } from '../../../core/types';
import { eq, f, l, v as w } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import * as B from './bilder';

const g = 9.81;
const kin = (m: number, kmh: number) => (m * (kmh / 3.6) ** 2) / 2;

export const AUFGABEN: Task[] = [
  // ---------- Arbeit: Kraft mal Weg ----------

  task({
    id: 'a1', karte: 'arbeit', stufe: 1, familie: 'rechnen',
    title: 'Mechanische Arbeit: Kiste schieben',
    gen: () => ({ F: rng(100, 600, 50), s: rng(2, 20, 1) }),
    draw: (p) => B.schieben({ F: `F = ${p.F} N`, s: `s = ${p.s} m`, W: 'W = ?' }),
    text: (p) => `Eine Kiste wird mit der Kraft ${f('F = ' + p.F + ' N')} über den Weg ${l('s = ' + p.s + ' m')} geschoben. Die Kraft wirkt in Wegrichtung. Wie gross ist die mechanische Arbeit W?`,
    asks: (p) => [{ k: 'W', unit: 'J', v: p.F * p.s }],
    fehler: (p) => [
      { ask: 0, v: p.F + p.s, msg: 'Du hast addiert. Arbeit ist Kraft mal Weg: W = F · s.' },
      { ask: 0, v: p.F / p.s, msg: 'Du hast geteilt. Arbeit ist Kraft mal Weg: W = F · s.' },
    ],
    tipps: () => [
      'Arbeit ist Kraft mal Weg.',
      'W = F · s. Die Einheit ist N·m = J (Joule).',
      'Setze F in N und s in m ein und multipliziere.',
    ],
    loesung: (p) => [
      `Formel: ${eq(w('W') + ' = ' + f('F') + ' · ' + l('s'))}`,
      `Einsetzen: ${eq(w('W') + ' = ' + f(p.F + ' N') + ' · ' + l(p.s + ' m'))}`,
      `Resultat: ${eq(w('W = ' + fmt(p.F * p.s) + ' N·m = ' + fmt(p.F * p.s) + ' J'))}`,
      'Arbeit ist die Fläche im Kraft-Weg-Diagramm. Doppelter Weg bedeutet doppelte Arbeit.',
    ],
  }),

  task({
    id: 'a2', karte: 'arbeit', stufe: 1, familie: 'rechnen',
    title: 'Hubarbeit: Last heben',
    gen: () => ({ m: rng(50, 500, 50), h: rng(2, 12, 1) }),
    draw: (p) => B.heben({ h: `h = ${p.h} m`, m: `m = ${p.m} kg`, lines: ['W = ?'], c0: true }),
    text: (p) => `Ein Kran hebt eine Last mit m = ${p.m} kg um ${l('h = ' + p.h + ' m')}. Berechne a) die Gewichtskraft F_G und b) die Hubarbeit W. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) F_G', unit: 'N', v: p.m * g },
      { k: 'b) W', unit: 'J', v: p.m * g * p.h },
    ],
    fehler: (p) => [
      { ask: 0, v: p.m, msg: 'Du hast die Masse als Kraft genommen. Die Gewichtskraft ist F_G = m · g.' },
      { ask: 1, v: p.m * p.h, msg: 'Du hast g vergessen. Die Last wiegt F_G = m · g. Erst damit mal h rechnen.' },
      { ask: 1, v: p.m * g, msg: 'Das ist nur die Gewichtskraft. Es fehlt noch mal h.' },
    ],
    tipps: () => [
      'Beim Heben ist die Kraft die Gewichtskraft. Der Weg ist die Höhe.',
      'F_G = m · g. Danach W = F_G · h.',
      'W = m · g · h. Rechne zuerst F_G in N.',
    ],
    loesung: (p) => [
      `Gewichtskraft: ${eq(f('F_G') + ' = m · g = ' + p.m + ' kg · 9,81 m/s² = ' + f(fmt(p.m * g) + ' N'))}`,
      `Hubarbeit: ${eq(w('W') + ' = ' + f('F_G') + ' · ' + l('h') + ' = ' + fmt(p.m * g) + ' N · ' + p.h + ' m')}`,
      `Resultat: ${eq(w('W = ' + fmt(p.m * g * p.h) + ' J = ' + fmt((p.m * g * p.h) / 1000) + ' kJ'))}`,
      'Diese Arbeit steckt danach als potenzielle Energie in der Last.',
    ],
  }),

  task({
    id: 'abx1', karte: 'arbeit', stufe: 1, familie: 'rechnen', src: 'Buch Arbeit, Beispiel Hubarbeit',
    title: 'Gussstück heben',
    gen: () => ({ FG: pick([1500, 2000, 3000]), h: pick([1.5, 2, 2.5]) }),
    draw: (p) => B.lift(p, { lab: 'Gussstück', FG: `F_G = ${p.FG} N` }),
    text: (p) => `Ein Gussstück mit ${f('F_G = ' + p.FG + ' N')} wird ${l(fmt(p.h) + ' m')} hoch gehoben. Welche Arbeit ist dafür nötig?`,
    asks: (p) => [{ k: 'W', unit: 'N·m', v: p.FG * p.h }],
    fehler: (p) => [
      { ask: 0, v: p.FG + p.h, msg: 'Du hast addiert. Hubarbeit ist Kraft mal Weg: W = F_G · h.' },
      { ask: 0, v: p.FG / p.h, msg: 'Du hast geteilt. Hubarbeit ist Kraft mal Weg: W = F_G · h.' },
    ],
    tipps: () => [
      'Die Gewichtskraft ist schon gegeben. Du brauchst kein g mehr.',
      'Hubarbeit: W = F_G · h.',
      'Kraft in N mal Höhe in m gibt N·m.',
    ],
    loesung: (p) => [
      `${eq(w('W') + ' = ' + f('F_G') + ' · ' + l('h') + ' = ' + p.FG + ' N · ' + fmt(p.h) + ' m = ' + w(fmt(p.FG * p.h) + ' N·m'))}`,
      'Im F-s-Diagramm ist das die Rechteckfläche: Kraft mal Weg.',
    ],
  }),

  task({
    id: 'abx2', karte: 'arbeit', stufe: 1, familie: 'rechnen', src: 'Buch Arbeit, Beispiel Reibungsarbeit',
    title: 'Maschinentisch verschieben',
    gen: () => ({ m: pick([200, 300, 500]), s: pick([1000, 1500, 2000]), mu: pick([0.05, 0.08, 0.1]) }),
    draw: (p) => B.schieb2({ s: p.s }, { FG: `m = ${p.m} kg`, s: `s = ${fmt(p.s / 1000)} m`, mu: `μ = ${fmt(p.mu)}` }),
    text: (p) => `Ein Maschinentisch mit m = ${p.m} kg wird ${l(fmt(p.s / 1000) + ' m')} weit verschoben. Wie gross ist die Reibungsarbeit bei μ = ${fmt(p.mu)}? (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) F_N', unit: 'N', v: p.m * g },
      { k: 'b) W', unit: 'N·m', v: (p.mu * p.m * g * p.s) / 1000 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.m, msg: 'Du hast die Masse als Kraft genommen. Die Normalkraft ist F_N = m · g.' },
      { ask: 1, v: p.mu * p.m * g * p.s, msg: 'Du hast s in mm eingesetzt. Für N·m brauchst du s in m.' },
      { ask: 1, v: (p.m * g * p.s) / 1000, msg: 'Du hast μ vergessen. Die Reibungskraft ist F_R = μ · F_N.' },
    ],
    tipps: () => [
      'Die Arbeit gegen die Reibung ist Reibungskraft mal Weg.',
      'F_N = F_G = m · g. Dann F_R = μ · F_N und W = F_R · s.',
      'Rechne s in m um: s : 1000.',
    ],
    loesung: (p) => [
      `Normalkraft: ${eq(f('F_N') + ' = m · g = ' + p.m + ' · 9,81 = ' + f(fmt(p.m * g) + ' N'))}`,
      `Reibungskraft: ${eq(f('F_R') + ' = μ · ' + f('F_N') + ' = ' + fmt(p.mu) + ' · ' + fmt(p.m * g) + ' = ' + f(fmt(p.mu * p.m * g) + ' N'))}`,
      `Arbeit: ${eq(w('W') + ' = ' + f('F_R') + ' · ' + l('s') + ' = ' + fmt(p.mu * p.m * g) + ' N · ' + fmt(p.s / 1000) + ' m = ' + w(fmt((p.mu * p.m * g * p.s) / 1000) + ' N·m'))}`,
      'Diese Arbeit wird zu Wärme. Man bekommt sie nicht zurück.',
    ],
  }),

  task({
    id: 'ab1', karte: 'arbeit', stufe: 1, familie: 'rechnen', src: 'Buch Arbeit, Nr. 1',
    title: 'Aufzug',
    gen: () => ({ FG: pick([8000, 11200, 15000]), h: pick([9, 12.5, 15]) }),
    draw: (p) => B.lift(p, { lab: 'Maschine', FG: `F_G = ${p.FG} N` }),
    text: (p) => `Ein Aufzug fördert eine Maschine mit ${f('F_G = ' + p.FG + ' N')} auf ${l(fmt(p.h) + ' m')} Höhe. Welche Hubarbeit ist nötig (in kN·m)?`,
    asks: (p) => [{ k: 'W', unit: 'kN·m', v: (p.FG * p.h) / 1000 }],
    fehler: (p) => [
      { ask: 0, v: p.FG * p.h, msg: 'Das ist die Arbeit in N·m. Gefragt ist kN·m: durch 1000 teilen.' },
      { ask: 0, v: (p.FG * p.h * g) / 1000, msg: 'Du hast mit g multipliziert. F_G ist schon eine Kraft in N.' },
    ],
    tipps: () => [
      'Hubarbeit ist Gewichtskraft mal Höhe.',
      'W = F_G · h. Das gibt N·m.',
      '1 kN·m = 1000 N·m. Teile am Schluss durch 1000.',
    ],
    loesung: (p) => [
      `${eq(w('W') + ' = ' + f('F_G') + ' · ' + l('h') + ' = ' + p.FG + ' N · ' + fmt(p.h) + ' m = ' + fmt(p.FG * p.h) + ' N·m')}`,
      `${eq(w('W = ' + fmt((p.FG * p.h) / 1000) + ' kN·m'))}`,
    ],
  }),

  task({
    id: 'ab2', karte: 'arbeit', stufe: 2, familie: 'kette', src: 'Buch Arbeit, Nr. 2',
    title: 'Betonpumpe',
    gen: () => ({ V: pick([3, 5, 8]), rho: 2.45, h: pick([8, 11.5, 15]) }),
    draw: (p) => B.beton({ h: `h = ${fmt(p.h)} m`, V: `V = ${p.V} m³ Beton, ρ = ${fmt(p.rho)} kg/dm³` }),
    text: (p) => `Eine Betonpumpe fördert ${p.V} m³ Beton (ρ = ${fmt(p.rho)} kg/dm³) auf ${l(fmt(p.h) + ' m')} Höhe. Wie gross sind a) die Masse und b) die Hubarbeit in kN·m? (g = 9,81 m/s²)`,
    asks: (p) => {
      const mm = p.V * p.rho * 1000;
      return [
        { k: 'a) m', unit: 'kg', v: mm },
        { k: 'b) W', unit: 'kN·m', v: (mm * g * p.h) / 1000 },
      ];
    },
    fehler: (p) => {
      const mm = p.V * p.rho * 1000;
      return [
        { ask: 0, v: p.V * p.rho, msg: 'Du hast m³ nicht in dm³ umgerechnet. 1 m³ = 1000 dm³.' },
        { ask: 1, v: (mm * p.h) / 1000, msg: 'Du hast g vergessen. Erst F_G = m · g rechnen, dann mal h.' },
      ];
    },
    tipps: () => [
      'Zuerst die Masse, dann die Gewichtskraft, dann die Arbeit.',
      'm = V · ρ mit V in dm³. F_G = m · g. W = F_G · h.',
      '1 m³ = 1000 dm³. Zum Schluss durch 1000 für kN·m.',
    ],
    loesung: (p) => {
      const mm = p.V * p.rho * 1000;
      return [
        `${eq('m = ' + p.V * 1000 + ' dm³ · ' + fmt(p.rho) + ' kg/dm³ = ' + fmt(mm) + ' kg')}`,
        `${eq(f('F_G') + ' = ' + fmt(mm) + ' · 9,81 = ' + f(fmt(mm * g) + ' N'))}`,
        `${eq(w('W') + ' = ' + f('F_G') + ' · ' + l('h') + ' = ' + fmt(mm * g) + ' · ' + fmt(p.h) + ' = ' + w(fmt((mm * g * p.h) / 1000) + ' kN·m'))}`,
      ];
    },
  }),

  task({
    id: 'ab3', karte: 'arbeit', stufe: 2, familie: 'kette', src: 'Buch Arbeit, Nr. 3',
    title: 'Zylindrisches Werkstück heben',
    gen: () => ({ L: pick([1, 1.5, 2]), d: pick([300, 435, 500]), rho: 7.25, h: pick([0.8, 1.2]) }),
    draw: (p) => B.lift({ h: p.h }, { cyl: true, lab: `ø${p.d} × ${fmt(p.L)} m`, FG: 'F_G = ?' }),
    text: (p) => `Ein zylindrisches Werkstück aus Gusseisen (ρ = ${fmt(p.rho)} kg/dm³) ist ${l(fmt(p.L) + ' m')} lang und hat ${l('ø' + p.d + ' mm')}. Es wird mit einem Kran ${l(fmt(p.h) + ' m')} hoch gehoben. Berechne a) das Volumen, b) die Masse und c) die Hubarbeit in kN·m. (g = 9,81 m/s²)`,
    asks: (p) => {
      const V = (Math.PI / 4) * (p.d / 100) ** 2 * p.L * 10, mm = V * p.rho;
      return [
        { k: 'a) V', unit: 'dm³', v: V },
        { k: 'b) m', unit: 'kg', v: mm },
        { k: 'c) W', unit: 'kN·m', v: (mm * g * p.h) / 1000 },
      ];
    },
    fehler: (p) => {
      const V = (Math.PI / 4) * (p.d / 100) ** 2 * p.L * 10, mm = V * p.rho;
      return [
        { ask: 0, v: Math.PI * (p.d / 100) ** 2 * p.L * 10, msg: 'Du hast π · d² gerechnet. Die Kreisfläche ist π/4 · d².' },
        { ask: 0, v: (Math.PI / 4) * p.d ** 2 * p.L * 10, msg: 'Du hast d in mm eingesetzt. Rechne in dm: d = ' + fmt(p.d / 100, 2) + ' dm.' },
        { ask: 2, v: (mm * p.h) / 1000, msg: 'Du hast g vergessen. Erst F_G = m · g rechnen, dann mal h.' },
      ];
    },
    tipps: (p) => [
      'Zuerst das Volumen des Zylinders, dann die Masse, dann die Arbeit.',
      `Rechne in dm: d = ${fmt(p.d / 100, 2)} dm, l = ${fmt(p.L * 10)} dm. V = π/4 · d² · l, m = V · ρ.`,
      'W = m · g · h. Durch 1000 für kN·m.',
    ],
    loesung: (p) => {
      const V = (Math.PI / 4) * (p.d / 100) ** 2 * p.L * 10, mm = V * p.rho;
      return [
        `${eq('V = π/4 · ' + fmt(p.d / 100, 2) + '² · ' + fmt(p.L * 10) + ' = ' + fmt(V) + ' dm³')}`,
        `${eq('m = ' + fmt(V) + ' · ' + fmt(p.rho) + ' = ' + fmt(mm) + ' kg')}`,
        `${eq(w('W') + ' = ' + fmt(mm) + ' · 9,81 · ' + fmt(p.h) + ' = ' + w(fmt((mm * g * p.h) / 1000) + ' kN·m'))}`,
      ];
    },
  }),

  task({
    id: 'ab4', karte: 'arbeit', stufe: 1, familie: 'rechnen', src: 'Buch Arbeit, Nr. 4',
    title: 'Vorschubeinheit',
    gen: () => ({ FG: pick([2000, 3250, 4000]), s: pick([300, 430, 600]), mu: pick([0.05, 0.08, 0.1]) }),
    draw: (p) => B.schieb2({ s: p.s }, { FG: `F_G = ${p.FG} N`, mu: `μ = ${fmt(p.mu)}` }),
    text: (p) => `Eine Vorschubeinheit (${f('F_G = ' + p.FG + ' N')}) legt ${l(p.s + ' mm')} zurück. Die Reibungszahl der Führung ist μ = ${fmt(p.mu)}. Wie gross sind a) die Reibungskraft und b) die Reibungsarbeit?`,
    asks: (p) => [
      { k: 'a) F_R', unit: 'N', v: p.mu * p.FG },
      { k: 'b) W', unit: 'N·m', v: (p.mu * p.FG * p.s) / 1000 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.FG / p.mu, msg: 'Du hast durch μ geteilt. Die Reibungskraft ist F_R = μ · F_N.' },
      { ask: 1, v: p.mu * p.FG * p.s, msg: 'Du hast s in mm eingesetzt. Für N·m brauchst du s in m.' },
    ],
    tipps: () => [
      'Auf der waagrechten Führung ist F_N = F_G.',
      'F_R = μ · F_G. Danach W = F_R · s.',
      'Rechne s in m um: s : 1000.',
    ],
    loesung: (p) => [
      `a) ${eq(f('F_R') + ' = μ · ' + f('F_G') + ' = ' + fmt(p.mu) + ' · ' + p.FG + ' = ' + f(fmt(p.mu * p.FG) + ' N'))}`,
      `b) ${eq(w('W') + ' = ' + f('F_R') + ' · ' + l('s') + ' = ' + fmt(p.mu * p.FG) + ' · ' + fmt(p.s / 1000, 3) + ' = ' + w(fmt((p.mu * p.FG * p.s) / 1000) + ' N·m'))}`,
    ],
  }),

  task({
    id: 'ab6', karte: 'arbeit', stufe: 3, familie: 'kette', src: 'Buch Arbeit, Nr. 6',
    title: 'Drehversuch: Arbeit in W·h',
    gen: () => ({ Fc: pick([500, 650, 800]), l: pick([300, 425, 500]), d: pick([60, 85, 100]), f: pick([0.25, 0.5]) }),
    draw: (p) => B.drehV(p),
    text: (p) => `Bei einem Drehversuch wirkt die Schnittkraft ${f('F_c = ' + p.Fc + ' N')}. Eine Welle (${l('l = ' + p.l + ' mm')}, mittlerer ${l('d = ' + p.d + ' mm')}) wird mit dem Vorschub f = ${fmt(p.f)} mm pro Umdrehung überdreht. Berechne a) die Anzahl Umdrehungen, b) den Schnittweg s und c) die Arbeit in W·h.`,
    asks: (p) => {
      const U = p.l / p.f, s = (Math.PI * p.d * U) / 1000;
      return [
        { k: 'a) Umdrehungen', unit: '', v: U },
        { k: 'b) Schnittweg s', unit: 'm', v: s },
        { k: 'c) W', unit: 'W·h', v: (p.Fc * s) / 3600 },
      ];
    },
    fehler: (p) => {
      const U = p.l / p.f, s = (Math.PI * p.d * U) / 1000;
      return [
        { ask: 0, v: p.l * p.f, msg: 'Du hast multipliziert. Umdrehungen = Länge : Vorschub.' },
        { ask: 1, v: p.l / 1000, msg: 'Das ist nur die Länge der Welle. Die Schneide läuft am Umfang entlang: s = π · d · Umdrehungen.' },
        { ask: 2, v: p.Fc * s, msg: 'Das ist die Arbeit in N·m. Für W·h teilst du durch 3600.' },
      ];
    },
    tipps: () => [
      'Die Schnittkraft wirkt am Umfang. Darum zählt der Weg am Umfang.',
      'Umdrehungen = l : f. Schnittweg = π · d · Umdrehungen. Dann W = F_c · s.',
      '1 W·h = 3600 N·m. d in m einsetzen.',
    ],
    loesung: (p) => {
      const U = p.l / p.f, s = (Math.PI * p.d * U) / 1000, W = p.Fc * s;
      return [
        `${eq('Umdrehungen = ' + p.l + ' : ' + fmt(p.f) + ' = ' + fmt(U))}`,
        `${eq(l('s') + ' = π · ' + fmt(p.d / 1000, 3) + ' m · ' + fmt(U) + ' = ' + l(fmt(s) + ' m'))}`,
        `${eq(w('W') + ' = ' + f('F_c') + ' · ' + l('s') + ' = ' + p.Fc + ' · ' + fmt(s) + ' = ' + fmt(W) + ' N·m = ' + w(fmt(W / 3600) + ' W·h'))}`,
        'Die Länge der Welle allein ist nicht der Weg der Schneide. Sie wickelt sich um die Welle.',
      ];
    },
  }),

  task({
    id: 'ca1', karte: 'arbeit', stufe: 1, familie: 'kette', src: 'Kreativ · Neue Situation',
    title: 'Treppe steigen: was kostet der Strom?',
    gen: () => ({ m: pick([60, 70, 80]), n: pick([3, 4, 5]), hs: 3, pr: pick([0.25, 0.3]) }),
    draw: (p) => B.lift({ h: p.n * p.hs }, { lab: 'du', FG: `m = ${p.m} kg`, h: `h = ${p.n * p.hs} m` }),
    text: (p) => `Du (m = ${p.m} kg) steigst ${p.n} Stockwerke zu je ${p.hs} m hoch. Berechne a) deine Hubarbeit in kJ und b) diese Arbeit in W·h. c) Wie oft müsstest du hochsteigen, bis du so viel Arbeit geleistet hast, wie 1 Fr. Strom bei ${fmt(p.pr, 2)} Fr. pro kW·h liefert? (g = 9,81 m/s²)`,
    asks: (p) => {
      const W = p.m * g * p.n * p.hs;
      return [
        { k: 'a) W', unit: 'kJ', v: W / 1000 },
        { k: 'b) W', unit: 'W·h', v: W / 3600 },
        { k: 'c) Anzahl', unit: 'Mal', v: 1 / ((W / 3.6e6) * p.pr) },
      ];
    },
    fehler: (p) => {
      const W = p.m * g * p.n * p.hs;
      return [
        { ask: 0, v: W, msg: 'Das ist die Arbeit in N·m. Gefragt ist kJ: durch 1000 teilen.' },
        { ask: 1, v: (p.m * p.n * p.hs) / 3600, msg: 'Du hast g vergessen. F_G = m · g, dann mal h.' },
        { ask: 2, v: 1 / ((W / 3600) * p.pr), msg: 'Du hast W·h statt kW·h eingesetzt. Der Preis gilt für 1 kW·h = 1000 W·h.' },
      ];
    },
    tipps: (p) => [
      'Hubarbeit: W = m · g · h. Die Höhe ist ' + p.n + ' · ' + p.hs + ' m.',
      '1 W·h = 3600 N·m. 1 kW·h = 3,6 · 10⁶ N·m.',
      'Für 1 Fr. bekommst du (1 : Preis) kW·h. Teile diese Energie durch die Arbeit einer Treppe.',
    ],
    loesung: (p) => {
      const W = p.m * g * p.n * p.hs;
      return [
        `a) ${eq(w('W') + ' = ' + p.m + ' · 9,81 · ' + p.n * p.hs + ' = ' + fmt(W) + ' N·m = ' + w(fmt(W / 1000) + ' kJ'))}`,
        `b) ${eq(fmt(W) + ' : 3600 = ' + w(fmt(W / 3600, 2) + ' W·h') + ' = ' + fmt(W / 3.6e6, 4) + ' kW·h')}`,
        `c) ${eq(fmt(W / 3.6e6, 4) + ' kW·h · ' + fmt(p.pr, 2) + ' Fr. = ' + fmt((W / 3.6e6) * p.pr, 5) + ' Fr. pro Treppe')}`,
        `${eq('1 Fr. : ' + fmt((W / 3.6e6) * p.pr, 5) + ' Fr. = ' + fmt(1 / ((W / 3.6e6) * p.pr)) + ' Mal')}`,
        'Muskelarbeit ist am Strompreis gemessen fast nichts wert. Darum lohnen sich Maschinen.',
      ];
    },
  }),

  task({
    id: 'a7', karte: 'arbeit', stufe: 2, familie: 'fehler', src: 'Kreativ · Fehler finden',
    title: 'Fehler finden: Hubarbeit von Noah',
    gen: () => ({ m: rng(40, 200, 20), h: rng(2, 10, 1) }),
    draw: (p) => B.heben({ h: `h = ${p.h} m`, m: `m = ${p.m} kg`, lines: ['W = ?'], c0: true }),
    text: (p) => `Noah hebt mit einem Kran eine Last von m = ${p.m} kg um ${l('h = ' + p.h + ' m')}. Er rechnet: «W = m · h = ${p.m} kg · ${p.h} m = ${p.m * p.h} N·m». a) Was ist falsch? b) Wie gross ist die Hubarbeit richtig? (g = 9,81 m/s²)`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: [
          'Er hat g vergessen. Die Kraft ist F_G = m · g, nicht die Masse.',
          'Er hätte durch h teilen müssen.',
          'Er hätte die Höhe in mm einsetzen müssen.',
          'Nichts, die Rechnung stimmt.',
        ],
        a: 0,
        why: [
          undefined,
          'Arbeit ist Kraft mal Weg. Du multiplizierst, du teilst nicht.',
          'Dann käme nicht N·m heraus. Die Höhe gehört in m.',
          'Kg mal m ist keine Arbeit. Es fehlt die Kraft: F_G = m · g.',
        ],
      },
      { k: 'b) W', unit: 'N·m', v: p.m * g * p.h },
    ],
    fehler: (p) => [{ ask: 1, v: p.m * p.h, msg: 'Das ist Noahs Wert. Er hat die Masse statt der Gewichtskraft eingesetzt. Rechne mit m · g · h.' }],
    tipps: () => [
      'Welche Einheit hat die Masse? Und welche braucht die Arbeit?',
      'Arbeit ist Kraft mal Weg. Die Kraft beim Heben ist F_G = m · g.',
      'W = m · g · h',
    ],
    loesung: (p) => [
      `Noah hat die Masse statt der Kraft genommen. Die Gewichtskraft ist ${eq(f('F_G') + ' = m · g = ' + p.m + ' · 9,81 = ' + f(fmt(p.m * g) + ' N'))}`,
      `${eq(w('W') + ' = ' + f('F_G') + ' · ' + l('h') + ' = ' + fmt(p.m * g) + ' · ' + p.h + ' = ' + w(fmt(p.m * g * p.h) + ' N·m'))}`,
      'Noahs Wert war etwa zehnmal zu klein. Der Faktor ist g ≈ 9,81.',
    ],
  }),

  // ---------- Feder: Spannarbeit ----------

  task({
    id: 'abx3', karte: 'feder', stufe: 1, familie: 'rechnen', src: 'Buch Arbeit, Beispiel Feder-Spannarbeit',
    title: 'Feder vorspannen',
    gen: () => ({ R: pick([5, 9.25, 12, 20]), s: pick([15, 20, 25, 30]) }),
    draw: (p) => B.feder(p, { R: `R = ${fmt(p.R)} N/mm`, F: 'F' }),
    text: (p) => `Welche Spannarbeit ist nötig, wenn eine Feder mit der Federrate R = ${fmt(p.R)} N/mm um ${l(p.s + ' mm')} vorgespannt wird?`,
    asks: (p) => [{ k: 'W', unit: 'N·m', v: (p.R * p.s * p.s) / 2000 }],
    fehler: (p) => [
      { ask: 0, v: (p.R * p.s * p.s) / 2, msg: 'Das ist die Arbeit in N·mm. Für N·m teilst du noch durch 1000.' },
      { ask: 0, v: (p.R * p.s * p.s) / 1000, msg: 'Du hast den Faktor : 2 vergessen. Die Federkraft wächst von 0 an, das gibt ein Dreieck.' },
    ],
    tipps: () => [
      'Die Federkraft wächst mit dem Weg. Die Arbeit ist die Dreieckfläche.',
      'W = R · s² : 2. Mit R in N/mm und s in mm kommt N·mm heraus.',
      'Teile durch 1000, dann hast du N·m.',
    ],
    loesung: (p) => [
      `${eq(w('W') + ' = R · s² : 2 = ' + fmt(p.R) + ' N/mm · (' + p.s + ' mm)² : 2 = ' + fmt((p.R * p.s * p.s) / 2) + ' N·mm = ' + w(fmt((p.R * p.s * p.s) / 2000, 3) + ' N·m'))}`,
      'Dreieck statt Rechteck: Die Federkraft wächst von 0 an. Darum : 2.',
    ],
  }),

  task({
    id: 'ab5', karte: 'feder', stufe: 1, familie: 'rechnen', src: 'Buch Arbeit, Nr. 5',
    title: 'Druckfeder',
    gen: () => ({ R: pick([10, 24.5, 30]), s: pick([15, 23, 30]) }),
    draw: (p) => B.feder(p, { R: `R = ${fmt(p.R)} N/mm`, F: 'F = ?' }),
    text: (p) => `Eine Druckfeder mit R = ${fmt(p.R)} N/mm wird ohne Vorspannung eingebaut. Wie gross sind a) die Federkraft bei ${l('s = ' + p.s + ' mm')} und b) die Spannarbeit?`,
    asks: (p) => [
      { k: 'a) F', unit: 'N', v: p.R * p.s },
      { k: 'b) W', unit: 'N·m', v: (p.R * p.s * p.s) / 2000 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.R / p.s, msg: 'Du hast geteilt. Die Federkraft ist F = R · s.' },
      { ask: 1, v: (p.R * p.s * p.s) / 1000, msg: 'Du hast den Faktor : 2 vergessen. Die Arbeit ist die Dreieckfläche.' },
      { ask: 1, v: (p.R * p.s * p.s) / 2, msg: 'Das ist die Arbeit in N·mm. Für N·m teilst du noch durch 1000.' },
    ],
    tipps: () => [
      'Die Feder folgt dem Federgesetz: Kraft und Weg sind proportional.',
      'a) F = R · s. b) W = F · s : 2, weil die Kraft von 0 anwächst.',
      'Für N·m teilst du N·mm durch 1000.',
    ],
    loesung: (p) => [
      `a) ${eq(f('F') + ' = R · s = ' + fmt(p.R) + ' · ' + p.s + ' = ' + f(fmt(p.R * p.s) + ' N'))}`,
      `b) ${eq(w('W') + ' = F · s : 2 = ' + fmt(p.R * p.s) + ' · ' + p.s + ' : 2 = ' + fmt((p.R * p.s * p.s) / 2) + ' N·mm = ' + w(fmt((p.R * p.s * p.s) / 2000, 3) + ' N·m'))}`,
    ],
  }),

  task({
    id: 'a6', karte: 'feder', stufe: 2, familie: 'waswaere', src: 'Kreativ · Was wäre wenn',
    title: 'Was wäre wenn: Feder doppelt so weit spannen',
    gen: () => ({ R: pick([5, 8, 10, 12]), s: pick([10, 15, 20]), k: pick([2, 3]) }),
    draw: (p) => B.feder({ s: p.s }, { R: `R = ${fmt(p.R)} N/mm`, F: 'F', W: `W bei s = ${p.s} mm` }),
    text: (p) => `Eine Feder mit R = ${fmt(p.R)} N/mm wird um ${l(p.s + ' mm')} gespannt. Dann spannst du sie um ${l('s = ' + p.k * p.s + ' mm')}, also ${p.k}-mal so weit. a) Wie ändert sich die Spannarbeit? b) Wie gross ist sie bei ${p.k * p.s} mm?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Spannarbeit',
        opts: [`${p.k}-mal so gross`, `${p.k * p.k}-mal so gross`, 'gleich gross'],
        a: 1,
        why: [
          `Der Weg wird ${p.k}-mal grösser und auch die Kraft. Beide Grössen wachsen, die Arbeit wächst also mit s².`,
          undefined,
          'Weiter spannen kostet mehr Arbeit. Die Arbeit bleibt nicht gleich.',
        ],
      },
      { k: 'b) W', unit: 'N·m', v: (p.R * (p.k * p.s) ** 2) / 2000 },
    ],
    fehler: (p) => [
      { ask: 1, v: (p.k * p.R * p.s * p.s) / 2000, msg: `Du hast die alte Arbeit mit ${p.k} multipliziert. Der Weg steht im Quadrat: W = R · s² : 2.` },
      { ask: 1, v: (p.R * (p.k * p.s) ** 2) / 2, msg: 'Das ist die Arbeit in N·mm. Für N·m teilst du noch durch 1000.' },
    ],
    tipps: () => [
      'Bei der Feder wächst die Kraft mit dem Weg. Wie wächst dann die Arbeit?',
      'W = R · s² : 2. Der Weg steht im Quadrat.',
      'Setze den neuen Weg s = k · s₁ ein. Dann durch 1000 für N·m.',
    ],
    loesung: (p) => [
      `Neuer Weg: ${eq(l('s') + ' = ' + p.k + ' · ' + p.s + ' mm = ' + l(p.k * p.s + ' mm'))}`,
      `${eq(w('W') + ' = R · s² : 2 = ' + fmt(p.R) + ' · ' + p.k * p.s + '² : 2 = ' + fmt((p.R * (p.k * p.s) ** 2) / 2) + ' N·mm = ' + w(fmt((p.R * (p.k * p.s) ** 2) / 2000, 3) + ' N·m'))}`,
      `Vergleich mit vorher (${fmt((p.R * p.s * p.s) / 2000, 3)} N·m): Faktor ${p.k}² = ${p.k * p.k}. Doppelter Weg gibt vierfache Arbeit.`,
    ],
  }),

  // ---------- Energie: potenziell und kinetisch ----------

  task({
    id: 'a3', karte: 'energie', stufe: 2, familie: 'umgekehrt',
    title: 'Potenzielle Energie: Höhe gesucht',
    gen: () => ({ W: rng(4, 20, 2), m: rng(100, 400, 50) }),
    draw: (p) => B.heben({ h: 'h = ?', m: `m = ${p.m} kg`, lines: [`W_pot = ${p.W} kJ`], c0: true }),
    text: (p) => `Eine Last mit m = ${p.m} kg soll die potenzielle Energie ${w('W_pot = ' + p.W + ' kJ')} speichern. Auf welche Höhe h muss man sie heben? (g = 9,81 m/s²)`,
    asks: (p) => [{ k: 'h', unit: 'm', v: (p.W * 1000) / (p.m * g) }],
    fehler: (p) => [
      { ask: 0, v: p.W / (p.m * g), msg: 'Du hast kJ nicht in J umgerechnet. 1 kJ = 1000 J.' },
      { ask: 0, v: (p.W * 1000) / p.m, msg: 'Du hast g vergessen. Es gilt W_pot = m · g · h.' },
    ],
    tipps: () => [
      'W_pot = m · g · h. Stelle nach h um.',
      'h = W_pot : (m · g). Rechne W_pot in J.',
      '1 kJ = 1000 J. Dann teilst du durch m · g.',
    ],
    loesung: (p) => [
      `Formel: ${eq(w('W_pot') + ' = m · g · ' + l('h'))}`,
      `Umstellen: ${eq(l('h') + ' = ' + w('W_pot') + ' : (m · g)')}`,
      `Einsetzen: ${eq(l('h') + ' = ' + p.W * 1000 + ' J : (' + p.m + ' kg · 9,81 m/s²)')}`,
      `Resultat: ${eq(l('h = ' + fmt((p.W * 1000) / (p.m * g)) + ' m'))}`,
      'Potenzielle Energie ist gespeicherte Hubarbeit. Je höher und je schwerer, desto mehr Energie.',
    ],
  }),

  task({
    id: 'a4', karte: 'energie', stufe: 2, familie: 'rechnen',
    title: 'Kinetische Energie: fahrendes Auto',
    gen: () => ({ m: rng(800, 1600, 100), v: pick([36, 54, 72, 90, 108]) }),
    draw: (p) => B.auto({ v: `v = ${p.v} km/h`, m: `m = ${p.m} kg`, W: 'W_kin = ?' }),
    text: (p) => `Ein Auto mit m = ${p.m} kg fährt mit ${w('v = ' + p.v + ' km/h')}. Berechne a) die Geschwindigkeit in m/s und b) die kinetische Energie W_kin in kJ.`,
    asks: (p) => [
      { k: 'a) v', unit: 'm/s', v: p.v / 3.6 },
      { k: 'b) W_kin', unit: 'kJ', v: kin(p.m, p.v) / 1000 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.v * 3.6, msg: 'Verkehrt herum. km/h in m/s: durch 3,6 teilen.' },
      { ask: 1, v: (p.m * p.v * p.v) / 2000, msg: 'Du hast v in km/h eingesetzt. Die Formel braucht m/s.' },
      { ask: 1, v: (p.m * (p.v / 3.6)) / 2000, msg: 'Du hast das Quadrat bei v vergessen. W_kin = m · v² : 2.' },
      { ask: 1, v: (p.m * (p.v / 3.6) ** 2) / 1000, msg: 'Du hast : 2 vergessen. W_kin = m · v² : 2.' },
    ],
    tipps: () => [
      'km/h in m/s: durch 3,6 teilen.',
      'W_kin = m · v² : 2. Die Geschwindigkeit wird quadriert.',
      'Das Resultat kommt in J. Durch 1000 für kJ.',
    ],
    loesung: (p) => {
      const v = p.v / 3.6;
      return [
        `Umrechnen: ${eq('v = ' + p.v + ' km/h : 3,6 = ' + fmt(v) + ' m/s')}`,
        `Formel: ${eq(w('W_kin') + ' = m · v² : 2')}`,
        `Einsetzen: ${eq(w('W_kin') + ' = ' + p.m + ' kg · (' + fmt(v) + ' m/s)² : 2')}`,
        `Resultat: ${eq(w('W_kin = ' + fmt(p.m * v * v / 2) + ' J = ' + fmt((p.m * v * v) / 2000) + ' kJ'))}`,
        'Doppelte Geschwindigkeit bedeutet vierfache Energie. Darum wird der Bremsweg viermal so lang.',
      ];
    },
  }),

  task({
    id: 'abx4', karte: 'energie', stufe: 1, familie: 'rechnen', src: 'Buch Energie, Beispiel Standuhr',
    title: 'Uhrengewicht hochziehen',
    gen: () => ({ FG: pick([30, 45, 60]), h: pick([1.2, 1.6, 1.8]) }),
    draw: (p) => B.lift(p, { lab: 'Uhrengewicht', FG: `F_G = ${p.FG} N` }),
    text: (p) => `Das Gewicht einer Standuhr (${f('F_G = ' + p.FG + ' N')}) wird ${l(fmt(p.h) + ' m')} hochgezogen. Wie gross ist seine potenzielle Energie?`,
    asks: (p) => [{ k: 'W_p', unit: 'N·m', v: p.FG * p.h }],
    fehler: (p) => [
      { ask: 0, v: p.FG * p.h * g, msg: 'Du hast mit g multipliziert. F_G ist schon eine Kraft in N.' },
      { ask: 0, v: p.FG / p.h, msg: 'Du hast geteilt. Es gilt W_p = F_G · h.' },
    ],
    tipps: () => [
      'Potenzielle Energie ist gespeicherte Hubarbeit.',
      'W_p = F_G · h. Die Kraft ist schon gegeben.',
      'Kraft in N mal Höhe in m gibt N·m.',
    ],
    loesung: (p) => [
      `${eq(w('W_p') + ' = ' + f('F_G') + ' · ' + l('h') + ' = ' + p.FG + ' N · ' + fmt(p.h) + ' m = ' + w(fmt(p.FG * p.h) + ' N·m'))}`,
      'Diese Energie gibt das Gewicht beim langsamen Absinken an das Uhrwerk ab.',
    ],
  }),

  task({
    id: 'ab7', karte: 'energie', stufe: 2, familie: 'kette', src: 'Buch Energie, Nr. 7',
    title: 'Pumpspeicherwerk',
    gen: () => ({ L: pick([0.3, 0.32, 0.5]), B: pick([60, 85, 100]), T: pick([10, 16.5, 20]), h: pick([200, 283, 400]) }),
    draw: (p) => B.pumpspeicher(p),
    text: (p) => `Das Oberbecken eines Pumpspeicherwerks ist ${fmt(p.L)} km lang, ${p.B} m breit und ${fmt(p.T)} m tief. Die Fallhöhe bis zum Unterbecken ist ${l(p.h + ' m')}. Berechne a) das Volumen und b) die gespeicherte Energie in kW·h und c) in MW·h. (ρ Wasser = 1000 kg/m³, g = 9,81 m/s²)`,
    asks: (p) => {
      const V = p.L * 1000 * p.B * p.T, W = V * 1000 * g * p.h;
      return [
        { k: 'a) V', unit: 'm³', v: V },
        { k: 'b) W', unit: 'kW·h', v: W / 3.6e6 },
        { k: 'c) W', unit: 'MW·h', v: W / 3.6e9 },
      ];
    },
    fehler: (p) => {
      const V = p.L * 1000 * p.B * p.T, W = V * 1000 * g * p.h;
      return [
        { ask: 0, v: p.L * p.B * p.T, msg: 'Du hast die Länge in km eingesetzt. Rechne in m: 1 km = 1000 m.' },
        { ask: 1, v: W / 3600, msg: 'Das sind W·h. Für kW·h teilst du durch 3,6 · 10⁶, nicht durch 3600.' },
        { ask: 1, v: (V * 1000 * p.h) / 3.6e6, msg: 'Du hast g vergessen. Es gilt W_p = m · g · h.' },
      ];
    },
    tipps: () => [
      'Zuerst das Volumen in m³, dann die Masse, dann die potenzielle Energie.',
      'm = V · 1000 kg/m³. W_p = m · g · h in J.',
      '1 kW·h = 3,6 · 10⁶ J. 1 MW·h = 1000 kW·h.',
    ],
    loesung: (p) => {
      const V = p.L * 1000 * p.B * p.T, mm = V * 1000, W = mm * g * p.h;
      return [
        `${eq('V = ' + fmt(p.L * 1000) + ' · ' + p.B + ' · ' + fmt(p.T) + ' = ' + fmt(V) + ' m³')}`,
        `${eq('m = ' + fmt(V) + ' · 1000 = ' + fmt(mm / 1e6, 1) + ' · 10⁶ kg')}`,
        `${eq(w('W_p') + ' = m · g · h = ' + fmt(W / 1e12, 3) + ' · 10¹² N·m')}`,
        `${eq(fmt(W / 3.6e6) + ' kW·h = ' + w(fmt(W / 3.6e9, 1) + ' MW·h'))}`,
        'Vereinfachung: Für alles Wasser zählt dieselbe Fallhöhe.',
      ];
    },
  }),

  task({
    id: 'ab8', karte: 'energie', stufe: 2, familie: 'kette', src: 'Buch Energie, Nr. 8',
    title: 'Splitter einer Schleifscheibe',
    gen: () => ({ v: pick([35, 50, 80]), m: pick([5, 12, 20]), s: pick([1, 1.5, 3]) }),
    draw: (p) => B.schleifscheibe({ m: `m = ${p.m} g`, v: `v_c = ${p.v} m/s` }),
    text: (p) => `Von einer Hochgeschwindigkeits-Schleifscheibe (${w('v_c = ' + p.v + ' m/s')}) löst sich ein Teilchen mit m = ${p.m} g. Wie gross sind a) seine kinetische Energie und b) die mittlere Bremskraft, wenn es in der Haut nach ${l(fmt(p.s) + ' mm')} gestoppt wird?`,
    asks: (p) => {
      const W = ((p.m / 1000) * p.v * p.v) / 2;
      return [
        { k: 'a) W_k', unit: 'N·m', v: W },
        { k: 'b) F', unit: 'N', v: W / (p.s / 1000) },
      ];
    },
    fehler: (p) => {
      const W = ((p.m / 1000) * p.v * p.v) / 2;
      return [
        { ask: 0, v: (p.m * p.v * p.v) / 2, msg: 'Du hast die Masse in g eingesetzt. Rechne in kg: ' + p.m + ' g = ' + fmt(p.m / 1000, 3) + ' kg.' },
        { ask: 1, v: W / p.s, msg: 'Du hast den Weg in mm eingesetzt. Für N brauchst du s in m.' },
      ];
    },
    tipps: (p) => [
      'Die ganze Bewegungsenergie wird auf dem kurzen Weg abgebaut: W = F · s.',
      `m in kg: ${p.m} g = ${fmt(p.m / 1000, 3)} kg. W_k = m · v² : 2, dann F = W : s.`,
      's in m einsetzen: s : 1000.',
    ],
    loesung: (p) => {
      const W = ((p.m / 1000) * p.v * p.v) / 2;
      return [
        `a) ${eq(w('W_k') + ' = ' + fmt(p.m / 1000, 3) + ' · ' + p.v + '² : 2 = ' + w(fmt(W) + ' N·m'))}`,
        `b) ${eq(f('F') + ' = ' + w('W') + ' : ' + l('s') + ' = ' + fmt(W) + ' : ' + fmt(p.s / 1000, 4) + ' = ' + f(fmt(W / (p.s / 1000)) + ' N'))}`,
        'Warnung: Ein Splitter von wenigen Gramm trifft mit der Kraft von über einer Tonne Gewicht. Arbeite nur mit Schutzhaube und Schutzbrille. Sonst drohen schwere Augenverletzungen.',
      ];
    },
  }),

  task({
    id: 'ab9', karte: 'energie', stufe: 1, familie: 'rechnen', src: 'Buch Energie, Nr. 9',
    title: 'Pkw abbremsen',
    gen: () => ({ m: pick([900, 1200, 1600]), v1: pick([30, 50, 60]), v2: pick([80, 100, 120]) }),
    draw: (p) => B.wagen({ m: `m = ${p.m} kg`, v: `${p.v1} / ${p.v2} km/h` }),
    text: (p) => `Ein Pkw (m = ${p.m} kg) wird bis zum Stillstand abgebremst. Welche Bremsarbeit ist nötig a) bei ${w('v_1 = ' + p.v1 + ' km/h')} und b) bei ${w('v_2 = ' + p.v2 + ' km/h')}?`,
    asks: (p) => [
      { k: 'a) W', unit: 'kN·m', v: kin(p.m, p.v1) / 1000 },
      { k: 'b) W', unit: 'kN·m', v: kin(p.m, p.v2) / 1000 },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.m * p.v1 * p.v1) / 2000, msg: 'Du hast v in km/h eingesetzt. Die Formel braucht m/s: durch 3,6 teilen.' },
      { ask: 1, v: (p.m * p.v2 * p.v2) / 2000, msg: 'Du hast v in km/h eingesetzt. Die Formel braucht m/s: durch 3,6 teilen.' },
      { ask: 1, v: (p.m * (p.v2 / 3.6)) / 2000, msg: 'Du hast das Quadrat bei v vergessen. W = m · v² : 2.' },
    ],
    tipps: () => [
      'Die Bremsarbeit ist gleich der kinetischen Energie.',
      'km/h in m/s: durch 3,6. Dann W = m · v² : 2.',
      'Rechne das Resultat von N·m in kN·m um: durch 1000.',
    ],
    loesung: (p) => [
      `a) ${eq(p.v1 + ' km/h = ' + fmt(p.v1 / 3.6, 3) + ' m/s')}, ${eq(w('W') + ' = ' + p.m + ' · ' + fmt(p.v1 / 3.6, 3) + '² : 2 = ' + w(fmt(kin(p.m, p.v1) / 1000) + ' kN·m'))}`,
      `b) ${eq(p.v2 + ' km/h = ' + fmt(p.v2 / 3.6, 3) + ' m/s')}, ${eq(w('W') + ' = ' + w(fmt(kin(p.m, p.v2) / 1000) + ' kN·m'))}`,
      `Faktor ${fmt((p.v2 / p.v1) ** 2, 2)}: Die Energie wächst mit dem Quadrat der Geschwindigkeit.`,
    ],
  }),

  task({
    id: 'ca3', karte: 'energie', stufe: 2, familie: 'fehler', src: 'Kreativ · Fehler finden',
    title: 'Bewegungsenergie: Wo steckt der Fehler?',
    gen: () => ({ m: pick([800, 1200, 1500]), v: pick([36, 54, 72, 90]) }),
    draw: (p) => B.wagen({ m: `m = ${p.m} kg`, v: `v = ${p.v} km/h` }),
    text: (p) => `Ein Lernender berechnet die Bewegungsenergie eines Autos (m = ${p.m} kg, v = ${p.v} km/h):<ol style="margin:8px 0 8px 18px;background:#fff6e5;padding:8px 8px 8px 26px;border-radius:6px"><li>W_k = m · v² : 2</li><li>W_k = ${p.m} · ${p.v}² : 2 = ${fmt((p.m * p.v * p.v) / 2)} N·m</li></ol>a) Was ist falsch? b) Wie gross ist die richtige Energie? c) Um welchen Faktor war das Resultat falsch?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: [
          'Er hat v in km/h eingesetzt. Die Formel braucht m/s.',
          'Das Quadrat bei v fehlt.',
          'Die Masse müsste in Tonnen stehen.',
          'Nichts, die Rechnung stimmt.',
        ],
        a: 0,
        why: [
          undefined,
          'Das Quadrat steht in seiner Rechnung. Schau dir die Einheit von v an.',
          'Für N·m braucht man kg. Die Masse stimmt.',
          'Das Resultat ist viel zu gross. Die Einheit von v passt nicht.',
        ],
      },
      { k: 'b) W_k', unit: 'N·m', v: kin(p.m, p.v) },
      { k: 'c) Faktor', unit: '', v: 12.96 },
    ],
    fehler: (p) => [
      { ask: 1, v: (p.m * p.v * p.v) / 2, msg: 'Das ist der falsche Wert des Lernenden. Rechne v erst in m/s um: durch 3,6.' },
      { ask: 2, v: 3.6, msg: 'Der Faktor 3,6 steckt in v. Die Energie hat v im Quadrat: 3,6² = 12,96.' },
    ],
    tipps: () => [
      'Welche Einheit muss v haben, damit N·m herauskommt?',
      'km/h : 3,6 = m/s. Dann W_k = m · v² : 2.',
      'Faktor = (3,6)², weil v im Quadrat steht.',
    ],
    loesung: (p) => [
      'Fehler: v wurde in km/h eingesetzt. Die Formel braucht m/s.',
      `${eq(p.v + ' km/h : 3,6 = ' + fmt(p.v / 3.6) + ' m/s')}`,
      `${eq(w('W_k') + ' = ' + p.m + ' · ' + fmt(p.v / 3.6) + '² : 2 = ' + w(fmt(kin(p.m, p.v)) + ' N·m'))}`,
      'Faktor: 3,6² = 12,96. Das Resultat war fast 13-mal zu gross.',
    ],
  }),

  task({
    id: 'ca5', karte: 'energie', stufe: 1, familie: 'schaetzen', src: 'Kreativ · Abschätzen, ohne Taschenrechner',
    title: 'Doppelt so schnell = ?',
    gen: () => ({ v: pick([20, 30, 40]), W: pick([20, 30, 40, 50]) }),
    draw: (p) => B.wagen({ m: `W_k = ${p.W} kJ bei ${p.v} km/h`, v: `v = ${p.v} km/h` }),
    text: (p) => `Ohne Taschenrechner: Ein Auto hat bei ${p.v} km/h die Bewegungsenergie ${p.W} kJ. Wie gross ist sie a) bei ${2 * p.v} km/h und b) bei ${3 * p.v} km/h?`,
    asks: (p) => [
      { k: 'a) W_k', unit: 'kJ', v: 4 * p.W },
      { k: 'b) W_k', unit: 'kJ', v: 9 * p.W },
    ],
    fehler: (p) => [
      { ask: 0, v: 2 * p.W, msg: 'Die Energie wächst mit v². Doppelte Geschwindigkeit gibt 2² = 4-fache Energie.' },
      { ask: 1, v: 3 * p.W, msg: 'Die Energie wächst mit v². Dreifache Geschwindigkeit gibt 3² = 9-fache Energie.' },
    ],
    tipps: () => [
      'W_k wächst mit v².',
      'Doppelte Geschwindigkeit: 2² = 4-fache Energie.',
      'Dreifache Geschwindigkeit: 3² = 9-fache Energie.',
    ],
    loesung: (p) => [
      `a) ${eq('4 · ' + p.W + ' = ' + 4 * p.W + ' kJ')}`,
      `b) ${eq('9 · ' + p.W + ' = ' + 9 * p.W + ' kJ')}`,
      'Darum ist der Bremsweg bei doppeltem Tempo viermal so lang.',
    ],
  }),

  // ---------- Erhaltung: Energie wandelt sich um ----------

  task({
    id: 'a5', karte: 'erhaltung', stufe: 3, familie: 'rechnen',
    title: 'Energieerhaltung: Fallhammer',
    gen: () => ({ m: rng(50, 300, 50), h: pick([0.8, 1, 1.25, 1.5, 1.8, 2, 2.5]) }),
    draw: (p) => B.fall({ h: `h = ${fmt(p.h, 2)} m`, m: `m = ${p.m} kg`, v: 'v = ?' }),
    text: (p) => `Der Bär eines Fallhammers hat m = ${p.m} kg. Er fällt aus ${l('h = ' + fmt(p.h, 2) + ' m')} auf das Werkstück. Reibung wird vernachlässigt. Berechne a) die potenzielle Energie W_pot am Start und b) die Geschwindigkeit v beim Aufprall. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) W_pot', unit: 'J', v: p.m * g * p.h },
      { k: 'b) v', unit: 'm/s', v: Math.sqrt(2 * g * p.h) },
    ],
    fehler: (p) => [
      { ask: 0, v: p.m * p.h, msg: 'Du hast g vergessen. Es gilt W_pot = m · g · h.' },
      { ask: 1, v: 2 * g * p.h, msg: 'Du hast die Wurzel vergessen. Aus m · g · h = m · v² : 2 folgt v = √(2 · g · h).' },
      { ask: 1, v: Math.sqrt(g * p.h), msg: 'Du hast den Faktor 2 vergessen. v = √(2 · g · h).' },
    ],
    tipps: () => [
      'Oben hat der Bär nur potenzielle Energie: W_pot = m · g · h.',
      'Beim Aufprall ist alles in kinetische Energie umgewandelt: W_kin = W_pot.',
      'm · g · h = m · v² : 2. Die Masse kürzt sich: v = √(2 · g · h).',
    ],
    loesung: (p) => [
      `Oben: ${eq(w('W_pot') + ' = m · g · ' + l('h') + ' = ' + p.m + ' kg · 9,81 m/s² · ' + fmt(p.h, 2) + ' m = ' + w(fmt(p.m * g * p.h) + ' J'))}`,
      `Energieerhaltung: ${eq(w('W_kin') + ' = ' + w('W_pot'))}, also ${eq('m · v² : 2 = m · g · h')}`,
      `Die Masse kürzt sich weg: ${eq('v = √(2 · g · h)')}`,
      `Einsetzen: ${eq('v = √(2 · 9,81 m/s² · ' + fmt(p.h, 2) + ' m)')}`,
      `Resultat: ${eq('v = ' + fmt(Math.sqrt(2 * g * p.h)) + ' m/s')}`,
      'Die Aufprallgeschwindigkeit hängt nur von der Höhe ab, nicht von der Masse.',
    ],
  }),

  task({
    id: 'abx5', karte: 'erhaltung', stufe: 2, familie: 'kette', src: 'Buch Energie, Beispiel Fallhammer',
    title: 'Riemenfallhammer',
    gen: () => ({ m: pick([150, 250, 400]), v: pick([5, 6, 7]), s: pick([3, 5, 8]) }),
    draw: (p) => B.hammer(p, { v: `v = ${p.v} m/s` }),
    text: (p) => `Der Bär eines Riemenfallhammers (m = ${p.m} kg) trifft mit ${w('v = ' + p.v + ' m/s')} auf. Wie gross sind a) seine kinetische Energie und b) die mittlere Verformungskraft bei ${l(p.s + ' mm')} Verformungsweg?`,
    asks: (p) => {
      const W = (p.m * p.v * p.v) / 2;
      return [
        { k: 'a) W_k', unit: 'N·m', v: W },
        { k: 'b) F', unit: 'kN', v: W / p.s },
      ];
    },
    fehler: (p) => {
      const W = (p.m * p.v * p.v) / 2;
      return [
        { ask: 0, v: p.m * p.v * p.v, msg: 'Du hast : 2 vergessen. W_k = m · v² : 2.' },
        { ask: 1, v: W / (p.s / 1000), msg: 'Das ist die Kraft in N. Gefragt ist kN: durch 1000 teilen.' },
        { ask: 1, v: (2 * W) / p.s, msg: 'Du hast mit dem Wert ohne : 2 gerechnet. Rechne zuerst W_k richtig.' },
      ];
    },
    tipps: () => [
      'Die ganze Bewegungsenergie wird im Verformungsweg abgebaut.',
      'W_k = m · v² : 2. Dann W = F · s, also F = W : s mit s in m.',
      'Das Resultat kommt in N. Durch 1000 für kN.',
    ],
    loesung: (p) => {
      const W = (p.m * p.v * p.v) / 2;
      return [
        `a) ${eq(w('W_k') + ' = ' + p.m + ' · ' + p.v + '² : 2 = ' + w(fmt(W) + ' N·m'))}`,
        `b) ${eq(f('F') + ' = ' + w('W') + ' : ' + l('s') + ' = ' + fmt(W) + ' N·m : ' + fmt(p.s / 1000, 3) + ' m = ' + f(fmt(W / p.s) + ' kN'))}`,
        'Kurzer Verformungsweg heisst riesige Kraft. Darum schmiedet ein Hammer so wirksam.',
      ];
    },
  }),

  task({
    id: 'ab10', karte: 'erhaltung', stufe: 3, familie: 'kette', src: 'Buch Energie, Nr. 10',
    title: 'Pendelschlagwerk',
    gen: () => ({ m: pick([15, 21.735, 30]), h: pick([1200, 1407, 1500]), h2: pick([150, 220, 400]) }),
    draw: (p) => B.pendel(p),
    text: (p) => `Der Hammer eines Pendelschlagwerks (m = ${fmt(p.m, 3)} kg) wird ${l(p.h + ' mm')} hoch angehoben. Berechne a) seine potenzielle Energie, b) seine Geschwindigkeit beim Auftreffen auf die Probe und c) die verbrauchte Schlagarbeit, wenn er danach bis ${l('s_2 = ' + p.h2 + ' mm')} durchschwingt. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) W_p', unit: 'N·m', v: (p.m * g * p.h) / 1000 },
      { k: 'b) v', unit: 'm/s', v: Math.sqrt((2 * g * p.h) / 1000) },
      { k: 'c) W', unit: 'N·m', v: (p.m * g * (p.h - p.h2)) / 1000 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.m * g * p.h, msg: 'Du hast h in mm eingesetzt. Für N·m brauchst du h in m.' },
      { ask: 1, v: (2 * g * p.h) / 1000, msg: 'Du hast die Wurzel vergessen. v = √(2 · g · h).' },
      { ask: 1, v: Math.sqrt((g * p.h) / 1000), msg: 'Du hast den Faktor 2 vergessen. v = √(2 · g · h).' },
      { ask: 2, v: (p.m * g * p.h2) / 1000, msg: 'Das ist die Energie, die noch übrig ist. Verbraucht ist Energie vorher minus Energie nachher.' },
    ],
    tipps: () => [
      'a) W_p = m · g · h mit h in m.',
      'b) Unten ist W_p ganz in W_k umgewandelt: v = √(2 · g · h). c) Verbraucht = vorher minus nachher.',
      'c) W = m · g · (h − s₂)',
    ],
    loesung: (p) => [
      `a) ${eq(w('W_p') + ' = ' + fmt(p.m, 3) + ' · 9,81 · ' + fmt(p.h / 1000, 3) + ' = ' + w(fmt((p.m * g * p.h) / 1000) + ' N·m'))}`,
      `b) ${eq(w('v') + ' = √(2 · 9,81 · ' + fmt(p.h / 1000, 3) + ') = ' + w(fmt(Math.sqrt((2 * g * p.h) / 1000), 3) + ' m/s'))}`,
      `c) ${eq(w('W') + ' = ' + fmt(p.m, 3) + ' · 9,81 · (' + fmt(p.h / 1000, 3) + ' − ' + fmt(p.h2 / 1000, 3) + ') = ' + w(fmt((p.m * g * (p.h - p.h2)) / 1000) + ' N·m'))}`,
      'Die Masse kürzt sich bei v heraus: Jeder Körper fällt aus derselben Höhe gleich schnell.',
    ],
  }),

  task({
    id: 'ca2', karte: 'erhaltung', stufe: 3, familie: 'umgekehrt', src: 'Kreativ · Umgekehrt gefragt, kombiniert',
    title: 'Puffer für einen Rollwagen auslegen',
    gen: () => ({ m: pick([200, 400, 500]), v: pick([0.5, 1, 1.5]), s: pick([40, 50, 80]) }),
    draw: (p) => B.feder({ s: p.s }, { R: `Wagen m = ${p.m} kg, v = ${fmt(p.v)} m/s`, F: 'F_max = ?' }),
    text: (p) => `Ein Rollwagen (m = ${p.m} kg) fährt mit ${w('v = ' + fmt(p.v) + ' m/s')} gegen einen Federpuffer. Der Puffer darf höchstens ${l(p.s + ' mm')} einfedern. Berechne a) die Bewegungsenergie, b) die nötige Federrate R und c) die grösste Federkraft.`,
    asks: (p) => {
      const W = (p.m * p.v * p.v) / 2;
      return [
        { k: 'a) W_k', unit: 'N·m', v: W },
        { k: 'b) R', unit: 'N/mm', v: (2 * W * 1000) / (p.s * p.s) },
        { k: 'c) F_max', unit: 'N', v: (2 * W * 1000) / p.s },
      ];
    },
    fehler: (p) => {
      const W = (p.m * p.v * p.v) / 2;
      return [
        { ask: 0, v: p.m * p.v * p.v, msg: 'Du hast : 2 vergessen. W_k = m · v² : 2.' },
        { ask: 1, v: (2 * W) / (p.s * p.s), msg: 'Du hast W in N·m eingesetzt. Bei R in N/mm und s in mm brauchst du W in N·mm.' },
        { ask: 1, v: (W * 1000) / (p.s * p.s), msg: 'Du hast den Faktor 2 vergessen. Aus W = R · s² : 2 folgt R = 2 · W : s².' },
        { ask: 2, v: (W * 1000) / p.s, msg: 'Das ist die mittlere Kraft F = W : s. Die grösste Kraft ist F_max = R · s.' },
      ];
    },
    tipps: () => [
      'Die ganze Bewegungsenergie muss in die Feder: W_k = R · s² : 2.',
      'Nach R umstellen: R = 2 · W : s². W in N·mm einsetzen.',
      'F_max = R · s',
    ],
    loesung: (p) => {
      const W = (p.m * p.v * p.v) / 2, R = (2 * W * 1000) / (p.s * p.s);
      return [
        `${eq(w('W_k') + ' = ' + p.m + ' · ' + fmt(p.v) + '² : 2 = ' + w(fmt(W) + ' N·m') + ' = ' + fmt(W * 1000) + ' N·mm')}`,
        `${eq('R = 2 · ' + fmt(W * 1000) + ' : ' + p.s + '² = ' + fmt(R) + ' N/mm')}`,
        `${eq(f('F_max') + ' = ' + fmt(R) + ' · ' + p.s + ' = ' + f(fmt(R * p.s) + ' N'))}`,
        'Umgekehrt gefragt: Die Energie ist bekannt, die Federrate ist gesucht.',
      ];
    },
  }),

  task({
    id: 'ca4', karte: 'erhaltung', stufe: 3, familie: 'kette', src: 'Kreativ · Themen kombiniert',
    title: 'Bremsweg aus Reibung und Energie',
    gen: () => ({ m: pick([1000, 1300, 1600]), v: pick([50, 80, 100]), mu: pick([0.4, 0.7, 0.8]) }),
    draw: (p) => B.wagen({ m: `m = ${p.m} kg, μ = ${fmt(p.mu)}`, v: `v = ${p.v} km/h` }),
    text: (p) => `Ein Auto (m = ${p.m} kg) fährt mit ${w(p.v + ' km/h')}. Es macht eine Vollbremsung, die Reifen gleiten mit μ = ${fmt(p.mu)}. Berechne a) die Bewegungsenergie, b) die Reibungskraft und c) den Bremsweg (ohne Reaktionszeit). (g = 9,81 m/s²)`,
    asks: (p) => {
      const W = kin(p.m, p.v), FR = p.mu * p.m * g;
      return [
        { k: 'a) W_k', unit: 'kN·m', v: W / 1000 },
        { k: 'b) F_R', unit: 'N', v: FR },
        { k: 'c) s', unit: 'm', v: W / FR },
      ];
    },
    fehler: (p) => {
      const W = kin(p.m, p.v), FR = p.mu * p.m * g;
      return [
        { ask: 0, v: (p.m * p.v * p.v) / 2000, msg: 'Du hast v in km/h eingesetzt. Die Formel braucht m/s: durch 3,6 teilen.' },
        { ask: 1, v: p.mu * p.m, msg: 'Du hast g vergessen. F_R = μ · F_N = μ · m · g.' },
        { ask: 2, v: W / 1000 / FR, msg: 'Du hast W in kN·m durch F_R in N geteilt. Rechne W in N·m: dann kommt s in m heraus.' },
      ];
    },
    tipps: () => [
      'Die Reibungsarbeit vernichtet die Bewegungsenergie: F_R · s = W_k.',
      'a) W_k mit v in m/s. b) F_R = μ · m · g. c) s = W_k : F_R.',
      'Setze W_k in N·m ein, nicht in kN·m.',
    ],
    loesung: (p) => {
      const v = p.v / 3.6, W = kin(p.m, p.v), FR = p.mu * p.m * g;
      return [
        `a) ${eq(w('W_k') + ' = ' + p.m + ' · ' + fmt(v, 3) + '² : 2 = ' + w(fmt(W / 1000) + ' kN·m'))}`,
        `b) ${eq(f('F_R') + ' = ' + fmt(p.mu) + ' · ' + p.m + ' · 9,81 = ' + f(fmt(FR) + ' N'))}`,
        `c) ${eq(l('s') + ' = ' + w('W_k') + ' : ' + f('F_R') + ' = ' + fmt(W) + ' : ' + fmt(FR) + ' = ' + l(fmt(W / FR) + ' m'))}`,
        'Die Masse kürzt sich: s = v² : (2 · μ · g). Ein schweres Auto bremst nicht kürzer, aber auch nicht länger.',
        'Warnung: Auf nasser Strasse sinkt μ stark. Dann wird der Bremsweg viel länger. Halte genug Abstand, sonst droht ein Auffahrunfall.',
      ];
    },
  }),

  task({
    id: 'a8', karte: 'erhaltung', stufe: 2, familie: 'waswaere', src: 'Kreativ · Was wäre wenn',
    title: 'Was wäre wenn: doppelte Fallhöhe',
    gen: () => ({ h: pick([0.8, 1, 1.25, 1.5, 2]), m: rng(50, 300, 50) }),
    draw: (p) => B.fall({ h: `h = ${fmt(p.h, 2)} m`, m: `m = ${p.m} kg`, v: 'v = ?' }),
    text: (p) => `Der Bär eines Fallhammers (m = ${p.m} kg) fällt aus ${l('h = ' + fmt(p.h, 2) + ' m')}. Jetzt hebst du ihn auf die doppelte Höhe ${l('2 · h = ' + fmt(2 * p.h, 2) + ' m')}. Reibung wird vernachlässigt. a) Wie ändert sich die Aufprallgeschwindigkeit? b) Wie gross ist sie aus der doppelten Höhe? (g = 9,81 m/s²)`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Aufprallgeschwindigkeit',
        opts: ['doppelt so gross', 'etwa 1,4-mal so gross (√2)', '4-mal so gross', 'gleich gross'],
        a: 1,
        why: [
          'Verdoppelt wird die Energie, nicht die Geschwindigkeit. Die Energie hängt von v² ab.',
          undefined,
          'Vierfach würde die Energie, wenn v doppelt wäre. Hier wird aber die Energie doppelt.',
          'Aus grösserer Höhe fällt der Bär schneller. Die Masse spielt keine Rolle, die Höhe schon.',
        ],
      },
      { k: 'b) v', unit: 'm/s', v: Math.sqrt(2 * g * 2 * p.h) },
    ],
    fehler: (p) => [
      { ask: 1, v: 2 * Math.sqrt(2 * g * p.h), msg: 'Du hast die Geschwindigkeit verdoppelt. Verdoppelt wird die Höhe, v wächst nur um √2.' },
      { ask: 1, v: Math.sqrt(2 * g * p.h), msg: 'Das ist die Geschwindigkeit aus der alten Höhe. Setze 2 · h ein.' },
    ],
    tipps: () => [
      'Die Energie wird doppelt so gross. v hängt von der Energie über v² ab.',
      'v = √(2 · g · h). Setze 2 · h ein.',
      'Die Masse kürzt sich weg.',
    ],
    loesung: (p) => [
      `${eq('v = √(2 · g · 2h) = √(2 · 9,81 m/s² · ' + fmt(2 * p.h, 2) + ' m) = ' + w(fmt(Math.sqrt(2 * g * 2 * p.h)) + ' m/s'))}`,
      `Vergleich mit vorher (${fmt(Math.sqrt(2 * g * p.h))} m/s): Faktor √2 ≈ 1,41.`,
      'Doppelte Höhe heisst doppelte Energie. Doppelte Energie heisst nur 1,41-fache Geschwindigkeit.',
    ],
  }),
];
