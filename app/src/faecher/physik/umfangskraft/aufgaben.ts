// Aufgaben zum Kapitel «Umfangskraft».
// Umgezogen aus dem alten Trainer: u1–u5, Buch ubx, ub1–ub7, kreativ cu1–cu4. Neu: u3–u6, u14–u17, u23, u27, u28.
import { task, type Task } from '../../../core/types';
import { eq, f, l, m, v } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import * as B from './bilder';

const g = 9.81;
const GAENGE = [4.12, 2.85, 1.95, 1.38, 1.09];

/** Umfangskraft in N aus Drehmoment in N·m und Durchmesser in mm. */
const Fu = (M: number, d: number) => (2000 * M) / d;

export const AUFGABEN: Task[] = [
  // ================= Karte «rad»: Umfangskraft am Rad =================
  task({
    id: 'u1', karte: 'rad', stufe: 1, familie: 'rechnen',
    title: 'Riemenscheibe: Umfangskraft berechnen',
    gen: () => ({ M: rng(20, 120, 10), d: rng(100, 250, 10) }),
    draw: (p) => B.rad(p, { typ: 'riemen', M: `M = ${p.M} Nm`, Fu: 'F_u = ?' }),
    loesungsbild: (p) => B.rad(p, { typ: 'riemen', M: `M = ${p.M} Nm`, Fu: `F_u = ${fmt(Fu(p.M, p.d))} N` }),
    text: (p) => `Eine Riemenscheibe überträgt das Drehmoment ${m('M = ' + p.M + ' Nm')}. Ihr Durchmesser ist ${l('d = ' + p.d + ' mm')}. Wie gross ist die Umfangskraft F_u im Riemen?`,
    asks: (p) => [{ k: 'F_u', unit: 'N', v: Fu(p.M, p.d) }],
    fehler: (p) => [{ ask: 0, v: (1000 * p.M) / p.d, msg: 'Du hast den Durchmesser als Hebelarm genommen. Der Hebelarm ist der Radius d : 2.' }],
    tipps: () => [
      'Die Umfangskraft greift am Umfang an. Ihr Hebelarm ist der Radius d : 2.',
      'M = F_u · d : 2. Stelle nach F_u um.',
      'F_u = 2 · M : d. Rechne den Durchmesser in Meter um.',
    ],
    loesung: (p) => [
      `Formel: ${eq(m('M') + ' = ' + f('F_u') + ' · ' + l('d : 2'))}`,
      `Umstellen: ${eq(f('F_u') + ' = 2 · ' + m('M') + ' : ' + l('d'))}`,
      `Einsetzen: ${eq(f('F_u') + ' = 2 · ' + m(p.M + ' Nm') + ' : ' + l(fmt(p.d / 1000, 3) + ' m'))}`,
      `Resultat: ${eq(f('F_u = ' + fmt(Fu(p.M, p.d)) + ' N'))}`,
      'Vorstellung: Das Rad ist ein Hebel. Der Radius ist der Hebelarm.',
    ],
  }),

  task({
    id: 'u2', karte: 'rad', stufe: 1, familie: 'rechnen',
    title: 'Zahnrad: Drehmoment berechnen',
    gen: () => ({ Fu: rng(200, 1500, 100), d: rng(60, 240, 20) }),
    draw: (p) => B.rad(p, { typ: 'zahn', M: 'M = ?', Fu: `F_u = ${p.Fu} N` }),
    loesungsbild: (p) => B.rad(p, { typ: 'zahn', M: `M = ${fmt((p.Fu * p.d) / 2000)} Nm`, Fu: `F_u = ${p.Fu} N` }),
    text: (p) => `An einem Zahnrad mit dem Teilkreisdurchmesser ${l('d = ' + p.d + ' mm')} wirkt die Umfangskraft ${f('F_u = ' + p.Fu + ' N')}. Welches Drehmoment M überträgt das Zahnrad?`,
    asks: (p) => [{ k: 'M', unit: 'Nm', v: (p.Fu * p.d) / 2000 }],
    fehler: (p) => [{ ask: 0, v: (p.Fu * p.d) / 1000, msg: 'Du hast den Durchmesser als Hebelarm genommen. Der Hebelarm ist der halbe Durchmesser.' }],
    tipps: () => ['Hebelarm ist der halbe Durchmesser.', 'M = F_u · d : 2, mit d in Meter.', 'M = F_u · (d : 2000)'],
    loesung: (p) => [
      `Formel: ${eq(m('M') + ' = ' + f('F_u') + ' · ' + l('d : 2'))}`,
      `Radius: ${eq(l('d : 2 = ' + p.d / 2 + ' mm = ' + fmt(p.d / 2000, 3) + ' m'))}`,
      `Einsetzen: ${eq(m('M') + ' = ' + f(p.Fu + ' N') + ' · ' + l(fmt(p.d / 2000, 3) + ' m'))}`,
      `Resultat: ${eq(m('M = ' + fmt((p.Fu * p.d) / 2000) + ' Nm'))}`,
    ],
  }),

  task({
    id: 'u3', karte: 'rad', stufe: 1, familie: 'fehler',
    title: 'Fehler finden: Pias Riemenscheibe',
    gen: () => ({ M: pick([20, 30, 40, 60]), d: pick([100, 125, 160, 200]) }),
    draw: (p) => B.rad(p, { typ: 'riemen', M: `M = ${p.M} Nm`, Fu: 'F_u = ?' }),
    text: (p) => `Pia berechnet die Umfangskraft einer Riemenscheibe (${m('M = ' + p.M + ' Nm')}, ${l('d = ' + p.d + ' mm')}) so: «F_u = M : d = ${p.M} Nm : ${fmt(p.d / 1000, 3)} m = ${fmt((1000 * p.M) / p.d)} N». Was ist falsch?`,
    asks: (p) => [{
      kind: 'choice', k: 'Fehler',
      opts: [
        `Der Hebelarm ist der Radius d : 2, nicht d. Richtig ist F_u = ${fmt(Fu(p.M, p.d))} N.`,
        'Sie hätte M mit d multiplizieren müssen.',
        'Sie hätte den Durchmesser nicht in Meter umrechnen dürfen.',
        'Nichts, die Rechnung stimmt.',
      ],
      a: 0,
      why: [
        undefined,
        'Multiplizieren gäbe die Einheit N·m². Das ist keine Kraft.',
        'Für Nm und N muss die Länge in m stehen. Das hat Pia richtig gemacht.',
        'Mache die Probe: Kraft mal Radius muss wieder M ergeben. Pias Kraft gibt nur die Hälfte von M.',
      ],
    }],
    tipps: () => [
      'Mache die Probe: Kraft mal Hebelarm muss wieder M ergeben.',
      'Der Hebelarm einer Umfangskraft ist der Radius d : 2.',
      'Rechne Pias Kraft mal den Radius. Das Resultat ist nur M : 2.',
    ],
    loesung: (p) => [
      `Pia setzt den ganzen Durchmesser ein. Die Kraft greift aber am Umfang an. Ihr Hebelarm ist der Radius ${l('d : 2 = ' + fmt(p.d / 2000, 3) + ' m')}.`,
      `Richtig: ${eq(f('F_u') + ' = 2 · ' + m('M') + ' : ' + l('d') + ' = ' + f(fmt(Fu(p.M, p.d)) + ' N'))}`,
      `Probe: ${fmt(Fu(p.M, p.d))} N · ${fmt(p.d / 2000, 3)} m = ${fmt(p.M)} Nm. Das stimmt mit M überein.`,
    ],
  }),

  task({
    id: 'u4', karte: 'rad', stufe: 1, familie: 'schaetzen',
    title: 'Schätzen: Umfangskraft am Bohrer',
    gen: () => ({ M: pick([4, 5, 6, 8]), d: pick([8, 10, 12]) }),
    draw: (p) => B.bohrer(p, { M: `M = ${p.M} Nm`, Fu: 'F_u = ?' }),
    text: (p) => `Eine Bohrmaschine gibt am Bohrer das Drehmoment ${m('M = ' + p.M + ' Nm')} ab. Der Bohrer hat ${l('d = ' + p.d + ' mm')}. Ohne Taschenrechner: Wie gross ist die Umfangskraft an der Schneide ungefähr?`,
    asks: (p) => {
      const F = Math.round(Fu(p.M, p.d) / 10) * 10;
      return [{
        kind: 'choice', k: 'Kraft etwa',
        opts: [`${fmt(F / 10, 0)} N`, `${fmt(F, 0)} N`, `${fmt(F * 10, 0)} N`],
        a: 1,
        why: ['Zu klein. Prüfe die Umrechnung: 12 mm sind 0,012 m.', undefined, 'Zu gross. Prüfe die Umrechnung: 12 mm sind 0,012 m.'],
      }];
    },
    tipps: () => ['F_u = 2 · M : d', 'Der Durchmesser muss in Meter stehen. 10 mm sind 0,01 m.', 'Durch 0,01 teilen heisst mal 100 rechnen.'],
    loesung: (p) => [
      `${eq(f('F_u') + ' = 2 · ' + m(p.M + ' Nm') + ' : ' + l(fmt(p.d / 1000, 3) + ' m') + ' = ' + f(fmt(Fu(p.M, p.d), 0) + ' N'))}`,
      'Das ist etwa das Gewicht von 70 bis 200 kg an einem winzigen Hebel. Darum ist ein Bohrer an der Schneide stark belastet.',
    ],
  }),

  task({
    id: 'u5', karte: 'rad', stufe: 2, familie: 'waswaere',
    title: 'Was wäre wenn: Doppelt so grosse Riemenscheibe',
    gen: () => ({ M: pick([30, 40, 60, 80]), d: pick([100, 125, 160]) }),
    draw: (p) => B.rad({ d: 2 * p.d }, { typ: 'riemen', M: `M = ${p.M} Nm`, Fu: 'F_u = ?' }),
    text: (p) => `Eine Riemenscheibe mit ${l('d = ' + p.d + ' mm')} überträgt ${m('M = ' + p.M + ' Nm')}. Du ersetzt sie durch eine Scheibe mit doppeltem Durchmesser. Das Drehmoment bleibt gleich. a) Was passiert mit der Umfangskraft? b) Wie gross ist sie danach?`,
    asks: (p) => [
      { kind: 'choice', k: 'a) Umfangskraft', opts: ['wird halb so gross', 'bleibt gleich', 'wird doppelt so gross'], a: 0, why: [undefined, 'Der Hebelarm wird doppelt so gross. Für dasselbe Moment braucht es dann weniger Kraft.', 'Es ist umgekehrt: Ein längerer Hebelarm braucht weniger Kraft.'] },
      { k: 'b) F_u neu', unit: 'N', v: Fu(p.M, 2 * p.d) },
    ],
    fehler: (p) => [
      { ask: 1, v: Fu(p.M, p.d), msg: 'Das ist die Kraft vorher. Rechne mit dem neuen Durchmesser.' },
      { ask: 1, v: Fu(p.M, p.d) * 2, msg: 'Eine grössere Scheibe braucht weniger Kraft, nicht mehr.' },
    ],
    tipps: () => ['Das Drehmoment bleibt gleich. Nur der Hebelarm ändert sich.', 'F_u = 2 · M : d mit dem neuen Durchmesser 2 · d.', 'Doppelter Durchmesser heisst halbe Kraft.'],
    loesung: (p) => [
      `Neuer Durchmesser: ${l('2 · ' + p.d + ' mm = ' + 2 * p.d + ' mm')}`,
      `${eq(f('F_u') + ' = 2 · ' + m(p.M + ' Nm') + ' : ' + l(fmt((2 * p.d) / 1000, 3) + ' m') + ' = ' + f(fmt(Fu(p.M, 2 * p.d)) + ' N'))}`,
      `Vorher waren es ${fmt(Fu(p.M, p.d))} N. Doppelter Hebelarm ergibt halbe Kraft.`,
    ],
  }),

  task({
    id: 'u6', karte: 'rad', stufe: 2, familie: 'umgekehrt',
    title: 'Umgekehrt: Wie klein darf die Scheibe sein?',
    gen: () => ({ M: pick([40, 60, 80, 100]), Fmax: pick([500, 800, 1000, 1250]) }),
    draw: (p) => B.rad({ d: Math.round((2000 * p.M) / p.Fmax) }, { typ: 'riemen', M: `M = ${p.M} Nm`, Fu: `F_u max = ${p.Fmax} N`, dlab: 'd = ?' }),
    text: (p) => `Ein Riemen darf höchstens mit ${f('F_u = ' + p.Fmax + ' N')} belastet werden. Die Scheibe soll ${m('M = ' + p.M + ' Nm')} übertragen. Wie klein darf der Durchmesser d der Scheibe höchstens sein?`,
    asks: (p) => [{ k: 'd', unit: 'mm', v: (2000 * p.M) / p.Fmax }],
    fehler: (p) => [{ ask: 0, v: (1000 * p.M) / p.Fmax, msg: 'Du hast mit dem Radius als Durchmesser gerechnet. Der Radius ist erst die Hälfte von d.' }],
    tipps: () => ['Stelle M = F_u · d : 2 nach d um.', 'd = 2 · M : F_u. Das Resultat kommt in Meter heraus.', 'Rechne das Resultat in mm um.'],
    loesung: (p) => [
      `Umstellen: ${eq(l('d') + ' = 2 · ' + m('M') + ' : ' + f('F_u'))}`,
      `Einsetzen: ${eq(l('d') + ' = 2 · ' + m(p.M + ' Nm') + ' : ' + f(p.Fmax + ' N') + ' = ' + fmt((2 * p.M) / p.Fmax, 3) + ' m = ' + l(fmt((2000 * p.M) / p.Fmax) + ' mm'))}`,
      'Eine kleinere Scheibe hätte einen kürzeren Hebelarm. Dann wäre die Riemenkraft zu gross.',
    ],
  }),

  // ================= Karte «paar»: Zahnradpaar und Übersetzung =================
  task({
    id: 'u7', karte: 'paar', stufe: 1, familie: 'rechnen',
    title: 'Zahnradgetriebe: Umfangskraft und Drehmoment', src: 'Buch Umfangskraft, Beispiel',
    gen: () => ({ M1: pick([80, 100, 135, 160]), m: pick([2, 2.5, 3, 4]), z1: pick([15, 17, 20]), z2: pick([45, 51, 58, 60]) }),
    draw: (p) => B.zahnpaar(p),
    text: (p) => `Ein Zahnradgetriebe wird mit ${m('M_1 = ' + p.M1 + ' N·m')} angetrieben. Die Zähne haben den Modul ${l('m = ' + fmt(p.m) + ' mm')}. Das treibende Rad hat z_1 = ${p.z1}, das getriebene z_2 = ${p.z2} Zähne. Wie gross sind a) die Umfangskraft F_u am Zahnrad z_1 und b) das Drehmoment M_2?`,
    asks: (p) => [
      { k: 'a) F_u', unit: 'N', v: (2 * p.M1 * 1000) / (p.m * p.z1) },
      { k: 'b) M_2', unit: 'N·m', v: (p.M1 * p.z2) / p.z1 },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.M1 * 1000) / (p.m * p.z1), msg: 'Du hast d als Hebelarm genommen. Der Hebelarm ist d : 2.' },
      { ask: 1, v: (p.M1 * p.z1) / p.z2, msg: 'Verhältnis verdreht. Das grosse Rad hat das grössere Drehmoment.' },
    ],
    tipps: () => ['Durchmesser aus Modul und Zähnezahl: d = m · z.', 'F_u = 2 · M : d. M in N·mm einsetzen.', 'M_2 : M_1 = z_2 : z_1'],
    loesung: (p) => {
      const F = (2 * p.M1 * 1000) / (p.m * p.z1);
      return [
        `Teilkreisdurchmesser: ${eq(l('d_1') + ' = m · z_1 = ' + fmt(p.m) + ' mm · ' + p.z1 + ' = ' + l(fmt(p.m * p.z1) + ' mm'))}`,
        `a) ${eq(f('F_u') + ' = 2 · ' + m('M_1') + ' : ' + l('d_1') + ' = 2 · ' + p.M1 * 1000 + ' N·mm : ' + fmt(p.m * p.z1) + ' mm = ' + f(fmt(F) + ' N'))}`,
        `b) ${eq(m('M_2') + ' = ' + m('M_1') + ' · z_2 : z_1 = ' + p.M1 + ' · ' + p.z2 + ' : ' + p.z1 + ' = ' + m(fmt((p.M1 * p.z2) / p.z1) + ' N·m'))}`,
        'Das grosse Rad hat das grössere Drehmoment, aber die kleinere Drehzahl.',
      ];
    },
  }),

  task({
    id: 'u8', karte: 'paar', stufe: 1, familie: 'rechnen',
    title: 'Zahnriementrieb', src: 'Buch Umfangskraft, Nr. 1',
    gen: () => ({ z1: pick([12, 15, 18, 20]), M1: pick([120, 180, 240, 300]), z2: pick([30, 35, 40, 48]) }),
    draw: (p) => B.zahnriemen(p),
    text: (p) => `Die Zahnriemenscheibe z_1 = ${p.z1} wird mit ${m('M_1 = ' + p.M1 + ' N·m')} angetrieben. Wie gross sind a) die Übersetzung i und b) das Drehmoment M_2 an der getriebenen Scheibe mit z_2 = ${p.z2}?`,
    asks: (p) => [
      { k: 'a) i', unit: '', v: p.z2 / p.z1 },
      { k: 'b) M_2', unit: 'N·m', v: (p.M1 * p.z2) / p.z1 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.z1 / p.z2, msg: 'Verdreht. Die Übersetzung ist i = z_2 : z_1, also getrieben durch treibend.' },
      { ask: 1, v: (p.M1 * p.z1) / p.z2, msg: 'Du hast durch i geteilt. Die grössere Scheibe hat das grössere Drehmoment.' },
    ],
    tipps: () => ['i = z_2 : z_1', 'M_2 = i · M_1', 'Die Spannrolle ändert nichts an der Übersetzung.'],
    loesung: (p) => [
      `a) ${eq('i = z_2 : z_1 = ' + p.z2 + ' : ' + p.z1 + ' = ' + fmt(p.z2 / p.z1, 3))}`,
      `b) ${eq(m('M_2') + ' = i · ' + m('M_1') + ' = ' + fmt(p.z2 / p.z1, 3) + ' · ' + p.M1 + ' N·m = ' + m(fmt((p.M1 * p.z2) / p.z1) + ' N·m'))}`,
      'Die Spannrolle hält nur den Riemen gespannt. Sie überträgt kein Drehmoment.',
    ],
  }),

  task({
    id: 'u9', karte: 'paar', stufe: 1, familie: 'rechnen',
    title: 'Kolbenverdichter mit Keilriemen', src: 'Buch Umfangskraft, Nr. 4',
    gen: () => ({ M1: pick([30, 40, 48, 60]), d1: pick([125, 160, 180]), i: pick([2.5, 2.84, 3.2]) }),
    draw: (p) => B.verdichter(p),
    text: (p) => `Ein Kolbenkompressor wird über Keilriemen angetrieben. Der Motor gibt ${m('M_1 = ' + p.M1 + ' N·m')} ab. Die Motorscheibe hat ${l('d_w1 = ' + p.d1 + ' mm')}, die Übersetzung ist i = ${fmt(p.i)}. Wie gross sind a) die Zugkraft F im Keilriemen und b) das Drehmoment M_2 am Kompressor?`,
    asks: (p) => [
      { k: 'a) F', unit: 'N', v: Fu(p.M1, p.d1) },
      { k: 'b) M_2', unit: 'N·m', v: p.M1 * p.i },
    ],
    fehler: (p) => [
      { ask: 0, v: (1000 * p.M1) / p.d1, msg: 'Du hast d als Hebelarm genommen. Der Hebelarm ist d : 2.' },
      { ask: 1, v: p.M1 / p.i, msg: 'Der Kompressor läuft langsamer. Darum hat er das grössere Drehmoment, nicht das kleinere.' },
    ],
    tipps: () => ['Die Riemenkraft wirkt am Umfang der Motorscheibe: F = 2 · M_1 : d_w1.', 'M_2 = i · M_1', 'Rechne d_w1 in Meter oder M_1 in N·mm.'],
    loesung: (p) => [
      `a) ${eq(f('F') + ' = 2 · ' + p.M1 * 1000 + ' N·mm : ' + p.d1 + ' mm = ' + f(fmt(Fu(p.M1, p.d1)) + ' N'))}`,
      `b) ${eq(m('M_2') + ' = ' + fmt(p.i) + ' · ' + p.M1 + ' = ' + m(fmt(p.M1 * p.i) + ' N·m'))}`,
    ],
  }),

  task({
    id: 'u10', karte: 'paar', stufe: 2, familie: 'rechnen',
    title: 'Zahnradpaar: Kraft und Drehmoment',
    gen: () => ({ M1: rng(10, 60, 5), d1: pick([80, 100, 120]), d2: pick([160, 200, 240]) }),
    draw: (p) => B.paar(p, { M1: `M_1 = ${p.M1} Nm`, M2: 'M_2 = ?', Fu: 'F_u = ?' }),
    loesungsbild: (p) => B.paar(p, { M1: `M_1 = ${p.M1} Nm`, M2: `M_2 = ${fmt((p.M1 * p.d2) / p.d1)} Nm`, Fu: `F_u = ${fmt(Fu(p.M1, p.d1))} N` }),
    text: (p) => `Rad 1 treibt Rad 2 an. Rad 1 hat ${l('d_1 = ' + p.d1 + ' mm')} und das Drehmoment ${m('M_1 = ' + p.M1 + ' Nm')}. Rad 2 hat ${l('d_2 = ' + p.d2 + ' mm')}. Berechne a) die Umfangskraft F_u am Zahneingriff und b) das Drehmoment M_2 am Rad 2.`,
    asks: (p) => [
      { k: 'a) F_u', unit: 'N', v: Fu(p.M1, p.d1) },
      { k: 'b) M_2', unit: 'Nm', v: (p.M1 * p.d2) / p.d1 },
    ],
    fehler: (p) => [
      { ask: 0, v: (1000 * p.M1) / p.d1, msg: 'Du hast d_1 als Hebelarm genommen. Der Hebelarm ist d_1 : 2.' },
      { ask: 1, v: (p.M1 * p.d1) / p.d2, msg: 'Verhältnis verdreht. Das grosse Rad hat das grössere Drehmoment.' },
    ],
    tipps: () => ['Am Zahneingriff wirkt an beiden Rädern dieselbe Umfangskraft.', 'F_u = 2 · M_1 : d_1', 'M_2 = F_u · d_2 : 2'],
    loesung: (p) => {
      const F = Fu(p.M1, p.d1);
      return [
        'Am Zahneingriff drückt Rad 1 auf Rad 2. Die Umfangskraft ist an beiden Rädern gleich gross.',
        `${eq(f('F_u') + ' = 2 · ' + m('M_1') + ' : ' + l('d_1') + ' = 2 · ' + p.M1 + ' Nm : ' + fmt(p.d1 / 1000, 3) + ' m = ' + f(fmt(F) + ' N'))}`,
        `${eq(m('M_2') + ' = ' + f('F_u') + ' · ' + l('d_2 : 2') + ' = ' + fmt(F) + ' N · ' + fmt(p.d2 / 2000, 3) + ' m = ' + m(fmt((p.M1 * p.d2) / p.d1) + ' Nm'))}`,
        `Kontrolle: Das grosse Rad hat den ${fmt(p.d2 / p.d1)}-fachen Durchmesser. Sein Drehmoment ist darum ${fmt(p.d2 / p.d1)}-mal so gross.`,
        'Vorstellung: gleiche Kraft, längerer Hebelarm, grösseres Drehmoment.',
      ];
    },
  }),

  task({
    id: 'u11', karte: 'paar', stufe: 2, familie: 'rechnen',
    title: 'Schneckengetriebe', src: 'Buch Umfangskraft, Nr. 2',
    gen: () => ({ z1: pick([1, 2]), z2: pick([30, 32, 40, 50]), n1: pick([1440, 2880]), M2: pick([60, 80, 120]) }),
    draw: (p) => B.schnecke(p),
    text: (p) => `An der Abtriebswelle eines Schneckengetriebes ist das Drehmoment ${m('M_2 = ' + p.M2 + ' N·m')} erforderlich. Die Schnecke hat z_1 = ${p.z1} ${p.z1 === 1 ? 'Gang' : 'Gänge'}, das Schneckenrad z_2 = ${p.z2} Zähne. Wie gross sind a) die Drehzahl n_2 bei der Motordrehzahl n_1 = ${p.n1}/min und b) das Drehmoment M_1 des Motors (ohne Wirkungsgrad)?`,
    asks: (p) => [
      { k: 'a) n_2', unit: '1/min', v: (p.n1 * p.z1) / p.z2 },
      { k: 'b) M_1', unit: 'N·m', v: (p.M2 * p.z1) / p.z2 },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.n1 * p.z2) / p.z1, msg: 'Das Schneckenrad dreht langsamer als der Motor, nicht schneller.' },
      { ask: 1, v: (p.M2 * p.z2) / p.z1, msg: 'Der Motor läuft schnell. Er braucht darum weniger Drehmoment als die langsame Abtriebswelle.' },
    ],
    tipps: () => ['Eine eingängige Schnecke zählt wie ein Zahnrad mit z_1 = 1.', 'i = z_2 : z_1, n_2 = n_1 : i', 'M_1 = M_2 : i'],
    loesung: (p) => {
      const i = p.z2 / p.z1;
      return [
        `${eq('i = ' + p.z2 + ' : ' + p.z1 + ' = ' + fmt(i))}`,
        `a) ${eq('n_2 = ' + p.n1 + ' : ' + fmt(i) + ' = ' + fmt(p.n1 / i) + '/min')}`,
        `b) ${eq(m('M_1') + ' = ' + p.M2 + ' : ' + fmt(i) + ' = ' + m(fmt(p.M2 / i, 3) + ' N·m'))}`,
        'In Wirklichkeit hat ein Schneckengetriebe einen schlechten Wirkungsgrad. Der Motor braucht dann mehr als dieses M_1.',
      ];
    },
  }),

  task({
    id: 'u12', karte: 'paar', stufe: 1, familie: 'schaetzen',
    title: 'Getriebe im Kopf rechnen', src: 'Kreativ · Abschätzen, ohne Taschenrechner',
    gen: () => ({ z1: pick([10, 15, 20]), k: pick([2, 3, 4, 5]), M1: pick([20, 30, 40, 50]), n1: pick([600, 900, 1200, 1500]) }),
    draw: (p) => B.zahnpaar({ z1: p.z1, z2: p.z1 * p.k, M1: p.M1, m: 2 }),
    text: (p) => `Ohne Taschenrechner: Ein Ritzel mit z_1 = ${p.z1} treibt ein Rad mit z_2 = ${p.z1 * p.k}. Das Ritzel dreht mit n_1 = ${p.n1}/min und ${m('M_1 = ' + p.M1 + ' N·m')}. Wie gross sind n_2 und M_2?`,
    asks: (p) => [
      { k: 'n_2', unit: '1/min', v: p.n1 / p.k },
      { k: 'M_2', unit: 'N·m', v: p.M1 * p.k },
    ],
    fehler: (p) => [
      { ask: 0, v: p.n1 * p.k, msg: 'Das grosse Rad dreht langsamer. Die Drehzahl wird durch i geteilt.' },
      { ask: 1, v: p.M1 / p.k, msg: 'Das grosse Rad hat das grössere Drehmoment. Es wird mit i multipliziert.' },
    ],
    tipps: (p) => [`Wie oft passt z_1 in z_2? Das ist i = ${p.k}.`, 'Die Drehzahl wird i-mal kleiner, das Drehmoment i-mal grösser.', `n_2 = ${p.n1} : ${p.k}, M_2 = ${p.k} · ${p.M1}`],
    loesung: (p) => [
      `${eq('i = ' + p.z1 * p.k + ' : ' + p.z1 + ' = ' + p.k)}`,
      `${eq('n_2 = ' + p.n1 + ' : ' + p.k + ' = ' + fmt(p.n1 / p.k) + '/min')}, ${eq(m('M_2') + ' = ' + p.k + ' · ' + p.M1 + ' = ' + m(p.M1 * p.k + ' N·m'))}`,
      'Plausibel? Langsameres Rad = grösseres Drehmoment. Das Produkt M · n bleibt gleich (ohne Verluste).',
    ],
  }),

  task({
    id: 'u13', karte: 'paar', stufe: 2, familie: 'fehler',
    title: 'Schneckengetriebe: Wo steckt der Fehler?', src: 'Kreativ · Fehler finden',
    gen: () => ({ z1: pick([1, 2]), z2: pick([30, 40, 50]), n1: 1440, M2: pick([60, 90, 120]) }),
    draw: (p) => B.schnecke(p),
    text: (p) => {
      const i = p.z2 / p.z1;
      return `Ein Lernender rechnet für dieses Schneckengetriebe das Motordrehmoment so:<ol style="margin:8px 0 8px 18px"><li>i = ${p.z2} : ${p.z1} = ${fmt(i)}</li><li>M_1 = i · M_2 = ${fmt(i)} · ${p.M2} = ${fmt(i * p.M2)} N·m</li></ol>a) In welcher Zeile steckt der Fehler? b) Wie gross ist das richtige M_1? c) Wie gross ist die Abtriebsdrehzahl n_2 bei n_1 = ${p.n1}/min?`;
    },
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: [
          'Zeile 2: Es wurde mit i multipliziert statt durch i geteilt.',
          'Zeile 1: Die Übersetzung muss z_1 : z_2 heissen.',
          'Beide Zeilen stimmen. Der Motor braucht eben viel Drehmoment.',
          'Zeile 2: M_1 muss mit der Drehzahl multipliziert werden.',
        ],
        a: 0,
        why: [
          undefined,
          'Zeile 1 stimmt. i = z_2 : z_1 ist die Übersetzung ins Langsame. Der Fehler kommt danach.',
          'Plausibilitäts-Test: Der schnelle Motor kann nicht mehr Drehmoment haben als die langsame Abtriebswelle.',
          'Das Drehmoment wird nie mit der Drehzahl multipliziert. Sonst käme die Leistung heraus.',
        ],
      },
      { k: 'b) M_1', unit: 'N·m', v: (p.M2 * p.z1) / p.z2 },
      { k: 'c) n_2', unit: '1/min', v: (p.n1 * p.z1) / p.z2 },
    ],
    fehler: (p) => [
      { ask: 1, v: (p.M2 * p.z2) / p.z1, msg: 'Das ist der falsche Wert des Lernenden. Du musst durch i teilen, nicht multiplizieren.' },
      { ask: 2, v: (p.n1 * p.z2) / p.z1, msg: 'Die Abtriebswelle dreht langsamer als der Motor. Teile n_1 durch i.' },
    ],
    tipps: () => ['Mache den Plausibilitäts-Test: Das Getriebe untersetzt stark. Muss der Motor mehr oder weniger Drehmoment liefern als die Abtriebswelle?', 'Langsame Welle = grosses Drehmoment. M_1 = M_2 : i', 'n_2 = n_1 : i'],
    loesung: (p) => {
      const i = p.z2 / p.z1;
      return [
        'Fehler in Zeile 2: Es wurde mit i multipliziert statt dividiert. Dann hätte der schnelle Motor ein grösseres Drehmoment als die langsame Welle. Das ist unmöglich.',
        `${eq(m('M_1') + ' = ' + m('M_2') + ' : i = ' + p.M2 + ' : ' + fmt(i) + ' = ' + m(fmt(p.M2 / i, 3) + ' N·m'))}`,
        `${eq('n_2 = ' + p.n1 + ' : ' + fmt(i) + ' = ' + fmt(p.n1 / i) + '/min')}`,
        'Merksatz: Drehmomente verhalten sich wie die Zähnezahlen, aber umgekehrt wie die Drehzahlen.',
      ];
    },
  }),

  task({
    id: 'u14', karte: 'paar', stufe: 1, familie: 'fehler',
    title: 'Fehler finden: Wo ist die Umfangskraft grösser?',
    gen: () => ({ M1: pick([20, 30, 40]), d1: pick([80, 100]), d2: pick([160, 200, 240]) }),
    draw: (p) => B.paar(p, { M1: `M_1 = ${p.M1} Nm`, M2: 'M_2 = ?', Fu: 'F_u = ?' }),
    text: (p) => `Rad 1 (${l('d_1 = ' + p.d1 + ' mm')}, ${m('M_1 = ' + p.M1 + ' Nm')}) treibt Rad 2 (${l('d_2 = ' + p.d2 + ' mm')}) an. Pia sagt: «Das grosse Rad hat mehr Zähne. Darum ist seine Umfangskraft grösser.» Stimmt das?`,
    asks: (p) => [{
      kind: 'choice', k: 'Urteil',
      opts: [
        `Nein. Am Zahneingriff ist die Umfangskraft an beiden Rädern gleich gross (${fmt(Fu(p.M1, p.d1))} N). Nur das Drehmoment ist am grossen Rad grösser.`,
        'Ja. Das grosse Rad hat die grössere Umfangskraft.',
        'Nein. Die Umfangskraft ist am kleinen Rad grösser.',
        'Nein. Die Umfangskraft ist am Zahneingriff null.',
      ],
      a: 0,
      why: [
        undefined,
        'Die Zähne drücken gegeneinander. Wirkung und Gegenwirkung sind gleich gross. Das grosse Rad hat nur den längeren Hebelarm.',
        'Auch das stimmt nicht. Zwei Räder drücken sich mit derselben Kraft.',
        'Ohne Umfangskraft würde sich das getriebene Rad nicht drehen.',
      ],
    }],
    tipps: () => ['Die Zähne von Rad 1 drücken auf die Zähne von Rad 2.', 'Wirkung und Gegenwirkung sind gleich gross.', 'Was unterscheidet die Räder dann? Der Hebelarm. Also das Drehmoment.'],
    loesung: (p) => [
      `Rad 1: ${eq(f('F_u') + ' = 2 · ' + m('M_1') + ' : ' + l('d_1') + ' = ' + f(fmt(Fu(p.M1, p.d1)) + ' N'))}`,
      'Dieselbe Kraft drückt auf Rad 2. Sie hat dort aber den längeren Hebelarm.',
      `${eq(m('M_2') + ' = ' + f('F_u') + ' · ' + l('d_2 : 2') + ' = ' + m(fmt((p.M1 * p.d2) / p.d1) + ' Nm'))}`,
    ],
  }),

  task({
    id: 'u15', karte: 'paar', stufe: 2, familie: 'begruenden',
    title: 'Begründen: Langsam heisst stark',
    gen: () => ({ z1: pick([15, 20]), i: pick([2, 3, 4, 5]) }),
    draw: (p) => B.zahnpaar({ z1: p.z1, z2: p.z1 * p.i, M1: 40, m: 2 }, { M1: 'M_1', M2: 'M_2', Fu: 'F_u' }),
    text: (p) => `Ein Ritzel mit z_1 = ${p.z1} treibt ein Rad mit z_2 = ${p.z1 * p.i} an. Was gilt für das grosse Rad im Vergleich zum Ritzel? (ohne Verluste)`,
    asks: (p) => [{
      kind: 'choice', k: 'Aussage',
      opts: [
        `Die Drehzahl ist ${p.i}-mal kleiner und das Drehmoment ${p.i}-mal grösser. Das Produkt M · n bleibt gleich.`,
        `Die Drehzahl ist ${p.i}-mal grösser und das Drehmoment ${p.i}-mal kleiner.`,
        `Drehzahl und Drehmoment sind beide ${p.i}-mal grösser.`,
        'Drehzahl und Drehmoment bleiben gleich.',
      ],
      a: 0,
      why: [
        undefined,
        'Verdreht. Das grosse Rad braucht länger für eine Umdrehung. Es dreht langsamer.',
        'Dann käme mehr Leistung heraus, als hineingeht. Das ist unmöglich.',
        'Die Räder haben verschiedene Durchmesser. Die Hebelarme sind verschieden, also auch das Drehmoment.',
      ],
    }],
    tipps: () => ['Bei jedem Zahn, der eingreift, dreht sich das Ritzel weiter als das grosse Rad.', 'Das grosse Rad hat den längeren Hebelarm bei derselben Kraft.', 'Leistung = M · n. Sie kann nicht grösser werden.'],
    loesung: (p) => [
      `Übersetzung: ${eq('i = ' + p.z1 * p.i + ' : ' + p.z1 + ' = ' + p.i)}`,
      'Das Ritzel dreht i-mal, bis das grosse Rad einmal dreht. Es ist langsamer.',
      'Dieselbe Umfangskraft wirkt an einem i-mal längeren Hebelarm. Das Drehmoment ist i-mal grösser.',
      'Merksatz: Langsam heisst stark. Schnell heisst schwach.',
    ],
  }),

  task({
    id: 'u16', karte: 'paar', stufe: 2, familie: 'umgekehrt',
    title: 'Umgekehrt: Wie viele Zähne braucht das Rad?',
    gen: () => ({ z1: pick([15, 18, 20]), M1: pick([20, 30, 40]), k: pick([2, 3, 4, 5]) }),
    draw: (p) => B.zahnpaar({ z1: p.z1, z2: p.z1 * p.k, M1: p.M1, m: 2 }, { M2: `M_2 = ${p.M1 * p.k} N·m`, z2: 'z_2 = ?' }),
    text: (p) => `Ein Ritzel mit z_1 = ${p.z1} Zähnen wird mit ${m('M_1 = ' + p.M1 + ' N·m')} angetrieben. Das getriebene Rad soll ${m('M_2 = ' + p.M1 * p.k + ' N·m')} abgeben (ohne Verluste). Wie viele Zähne z_2 braucht das Rad?`,
    asks: (p) => [{ k: 'z_2', unit: 'Zähne', v: p.z1 * p.k }],
    fehler: (p) => [{ ask: 0, v: p.z1 / p.k, msg: 'Verdreht. Das Rad mit dem grösseren Drehmoment hat mehr Zähne, nicht weniger.' }],
    tipps: () => ['Drehmomente verhalten sich wie die Zähnezahlen: M_2 : M_1 = z_2 : z_1', 'Stelle nach z_2 um.', 'z_2 = z_1 · M_2 : M_1'],
    loesung: (p) => [
      `Formel: ${eq(m('M_2') + ' : ' + m('M_1') + ' = z_2 : z_1')}`,
      `Umstellen: ${eq('z_2 = z_1 · ' + m('M_2') + ' : ' + m('M_1') + ' = ' + p.z1 + ' · ' + p.M1 * p.k + ' : ' + p.M1 + ' = ' + p.z1 * p.k)}`,
      `Kontrolle: Das Drehmoment soll ${p.k}-mal grösser werden. Das Rad hat darum ${p.k}-mal so viele Zähne.`,
    ],
  }),

  task({
    id: 'u17', karte: 'paar', stufe: 2, familie: 'waswaere',
    title: 'Was wäre wenn: Ritzel mit mehr Zähnen',
    gen: () => ({ z1: pick([15, 20]), z1n: pick([25, 30]), z2: pick([45, 60, 75]), M1: pick([30, 40, 60]) }),
    draw: (p) => B.zahnpaar({ z1: p.z1n, z2: p.z2, M1: p.M1, m: 2 }, { M2: 'M_2 = ?', Fu: 'F_u' }),
    text: (p) => `Ein Ritzel mit z_1 = ${p.z1} treibt ein Rad mit z_2 = ${p.z2} an. Das Ritzel liefert ${m('M_1 = ' + p.M1 + ' N·m')}. Du tauschst das Ritzel gegen eines mit z_1 = ${p.z1n} Zähnen. M_1 bleibt gleich. a) Was passiert mit M_2? b) Wie gross ist M_2 danach?`,
    asks: (p) => [
      { kind: 'choice', k: 'a) M_2', opts: ['wird kleiner', 'bleibt gleich', 'wird grösser'], a: 0, why: [undefined, 'Die Übersetzung ändert sich. Also ändert sich auch M_2.', 'Ein grösseres Ritzel gibt eine kleinere Übersetzung. Das Rad bekommt weniger Drehmoment.'] },
      { k: 'b) M_2 neu', unit: 'N·m', v: (p.M1 * p.z2) / p.z1n },
    ],
    fehler: (p) => [
      { ask: 1, v: (p.M1 * p.z2) / p.z1, msg: 'Das ist M_2 vorher. Rechne mit der neuen Zähnezahl des Ritzels.' },
      { ask: 1, v: (p.M1 * p.z1n) / p.z2, msg: 'Verhältnis verdreht. Es gilt M_2 = M_1 · z_2 : z_1.' },
    ],
    tipps: () => ['M_2 = M_1 · z_2 : z_1. Nur z_1 ändert sich.', 'Setze die neue Zähnezahl des Ritzels ein.', 'Ein grösseres Ritzel gibt eine kleinere Übersetzung.'],
    loesung: (p) => [
      `Vorher: ${eq(m('M_2') + ' = ' + p.M1 + ' · ' + p.z2 + ' : ' + p.z1 + ' = ' + fmt((p.M1 * p.z2) / p.z1) + ' N·m')}`,
      `Nachher: ${eq(m('M_2') + ' = ' + p.M1 + ' · ' + p.z2 + ' : ' + p.z1n + ' = ' + m(fmt((p.M1 * p.z2) / p.z1n) + ' N·m'))}`,
      'Das Rad dreht dafür schneller. Merke: Grosses treibendes Ritzel gibt weniger Kraft und mehr Tempo.',
    ],
  }),

  // ================= Karte «welle»: Mehrere Räder auf einer Welle =================
  task({
    id: 'u18', karte: 'welle', stufe: 2, familie: 'rechnen',
    title: 'Seiltrommel mit Zahnrad auf einer Welle',
    gen: () => ({ FG: rng(1000, 5000, 500), d: pick([150, 200, 250]), d2: pick([300, 400, 500]) }),
    draw: (p) => B.trommelrad(p),
    text: (p) => `Auf einer Welle sitzen eine Seiltrommel und ein Zahnrad. Am Seil der Trommel (${l('Durchmesser ' + p.d + ' mm')}) hängt die Last ${f('F_G = ' + p.FG + ' N')}. Das Zahnrad hat ${l('d = ' + p.d2 + ' mm')}. Berechne a) das Drehmoment M an der Welle und b) die Umfangskraft F_u am Zahnrad.`,
    asks: (p) => [
      { k: 'a) M', unit: 'Nm', v: (p.FG * p.d) / 2000 },
      { k: 'b) F_u', unit: 'N', v: (p.FG * p.d) / p.d2 },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.FG * p.d) / 1000, msg: 'Du hast den Trommeldurchmesser als Hebelarm genommen. Der Hebelarm ist der Trommelradius.' },
      { ask: 1, v: p.FG, msg: 'F_u ist nicht gleich F_G. Gleich ist das Drehmoment. Die Radien sind verschieden.' },
      { ask: 1, v: (p.FG * p.d2) / p.d, msg: 'Verdreht. Das Zahnrad ist grösser als die Trommel. Seine Kraft ist darum kleiner als die Last.' },
    ],
    tipps: () => ['Trommel und Zahnrad sitzen auf derselben Welle. Sie haben dasselbe Drehmoment.', 'M = F_G · Trommelradius', 'F_u = 2 · M : d'],
    loesung: (p) => {
      const M = (p.FG * p.d) / 2000;
      return [
        `Drehmoment aus der Last: ${eq(m('M') + ' = ' + f('F_G') + ' · Trommelradius = ' + p.FG + ' N · ' + fmt(p.d / 2000, 3) + ' m = ' + m(fmt(M) + ' Nm'))}`,
        'Dieselbe Welle, also dasselbe Drehmoment am Zahnrad.',
        `${eq(f('F_u') + ' = 2 · ' + m('M') + ' : ' + l('d') + ' = 2 · ' + fmt(M) + ' Nm : ' + fmt(p.d2 / 1000, 2) + ' m = ' + f(fmt((p.FG * p.d) / p.d2) + ' N'))}`,
        'Vorstellung: Das Zahnrad ist grösser als die Trommel. Darum ist die Umfangskraft kleiner als die Last.',
      ];
    },
  }),

  task({
    id: 'u19', karte: 'welle', stufe: 2, familie: 'rechnen',
    title: 'Montagepresse', src: 'Buch Umfangskraft, Nr. 3',
    gen: () => ({ F: pick([1, 1.5, 2, 2.5]), d: pick([100, 120]), z1: pick([18, 20, 22]), mm: 2.5 }),
    draw: (p) => B.presse(p),
    text: (p) => `An der Pinole einer Montagepresse ist eine Kraft ${f('F = ' + fmt(p.F) + ' kN')} nötig. Das Zahnrad an der Pinole hat ${l('ø' + p.d + ' mm')}. Dasselbe Rad greift in die Pinole und in ein Antriebsrad mit z_1 = ${p.z1} und ${l('m = ' + fmt(p.mm) + ' mm')}. Wie gross sind a) das Drehmoment M_2 und b) das Drehmoment M_1 des Antriebsrades?`,
    asks: (p) => {
      const M2 = (p.F * 1000 * p.d) / 2000;
      return [
        { k: 'a) M_2', unit: 'N·m', v: M2 },
        { k: 'b) M_1', unit: 'N·m', v: (M2 * p.z1 * p.mm) / p.d },
      ];
    },
    fehler: (p) => {
      const M2 = (p.F * 1000 * p.d) / 2000;
      return [
        { ask: 0, v: (p.F * 1000 * p.d) / 1000, msg: 'Du hast ø als Hebelarm genommen. Der Hebelarm ist der Radius.' },
        { ask: 1, v: (M2 * p.d) / (p.z1 * p.mm), msg: 'Verdreht. Das Antriebsrad ist kleiner. Es hat darum das kleinere Drehmoment.' },
        { ask: 1, v: M2, msg: 'M_1 ist nicht gleich M_2. Die beiden Räder sind verschieden gross.' },
      ];
    },
    tipps: (p) => ['Die Pinole ist eine Zahnstange. Die Kraft F wirkt am Umfang des grossen Rades: M_2 = F · d : 2.', `Zähnezahl des grossen Rades: z_2 = d : m = ${p.d} : ${fmt(p.mm)} = ${fmt(p.d / p.mm)}.`, 'M_1 = M_2 · z_1 : z_2'],
    loesung: (p) => {
      const M2 = (p.F * 1000 * p.d) / 2000, z2 = p.d / p.mm;
      return [
        `a) ${eq(m('M_2') + ' = ' + f(fmt(p.F * 1000) + ' N') + ' · ' + l(fmt(p.d / 2000, 3) + ' m') + ' = ' + m(fmt(M2) + ' N·m'))}`,
        `b) ${eq('z_2 = ' + p.d + ' : ' + fmt(p.mm) + ' = ' + fmt(z2))}, ${eq(m('M_1') + ' = ' + fmt(M2) + ' · ' + p.z1 + ' : ' + fmt(z2) + ' = ' + m(fmt((M2 * p.z1) / z2) + ' N·m'))}`,
        'Kontrolle: Am Zahneingriff wirkt dieselbe Umfangskraft wie an der Pinole, weil das grosse Rad beide berührt.',
      ];
    },
  }),

  task({
    id: 'u20', karte: 'welle', stufe: 2, familie: 'rechnen',
    title: 'Räderwinde', src: 'Buch Umfangskraft, Nr. 5',
    gen: () => ({ FG: pick([1.5, 2, 2.5]), dT: pick([160, 180, 200]), i: pick([3, 3.3, 4]), mm: 3, z1: pick([20, 25, 30]), l1: pick([250, 300, 350]) }),
    draw: (p) => B.winde(p),
    text: (p) => `Mit einer Räderwinde soll eine Last ${f('F_G = ' + fmt(p.FG) + ' kN')} gehoben werden. Die Seiltrommel hat ${l('ø' + p.dT + ' mm')}. Wie gross sind a) das Drehmoment M_2 an der Seiltrommel, b) das Drehmoment M_1 an der Antriebswelle bei i = ${fmt(p.i)}, c) die Umfangskraft F_u an den Zahnflanken bei ${l('m = ' + p.mm + ' mm')} und z_1 = ${p.z1}, d) die Handkraft F_1 an der Kurbel mit ${l('l_1 = ' + p.l1 + ' mm')}?`,
    asks: (p) => {
      const M2 = (p.FG * 1000 * p.dT) / 2000, M1 = M2 / p.i;
      return [
        { k: 'a) M_2', unit: 'N·m', v: M2 },
        { k: 'b) M_1', unit: 'N·m', v: M1 },
        { k: 'c) F_u', unit: 'N', v: (2 * M1 * 1000) / (p.mm * p.z1) },
        { k: 'd) F_1', unit: 'N', v: (M1 * 1000) / p.l1 },
      ];
    },
    fehler: (p) => {
      const M2 = (p.FG * 1000 * p.dT) / 2000, M1 = M2 / p.i;
      return [
        { ask: 0, v: (p.FG * 1000 * p.dT) / 1000, msg: 'Du hast ø als Hebelarm genommen. Der Hebelarm ist der Trommelradius.' },
        { ask: 1, v: M2 * p.i, msg: 'Die Antriebswelle dreht schneller. Sie hat das kleinere Drehmoment: M_1 = M_2 : i.' },
        { ask: 2, v: (M1 * 1000) / (p.mm * p.z1), msg: 'Du hast d_1 als Hebelarm genommen. Der Hebelarm ist d_1 : 2.' },
        { ask: 3, v: (2 * M1 * 1000) / (p.mm * p.z1), msg: 'Das ist die Umfangskraft am Zahnrad. Die Kurbel hat einen anderen Hebelarm, l_1.' },
      ];
    },
    tipps: () => ['a) M_2 = F_G · d_T : 2', 'b) M_1 = M_2 : i. c) d_1 = m · z_1 und F_u = 2 · M_1 : d_1', 'd) Kurbel: M_1 = F_1 · l_1'],
    loesung: (p) => {
      const M2 = (p.FG * 1000 * p.dT) / 2000, M1 = M2 / p.i, d1 = p.mm * p.z1;
      return [
        `a) ${eq(m('M_2') + ' = ' + fmt(p.FG * 1000) + ' N · ' + fmt(p.dT / 2000, 3) + ' m = ' + m(fmt(M2) + ' N·m'))}`,
        `b) ${eq(m('M_1') + ' = ' + fmt(M2) + ' : ' + fmt(p.i) + ' = ' + m(fmt(M1) + ' N·m'))}`,
        `c) ${eq(l('d_1') + ' = ' + p.mm + ' · ' + p.z1 + ' = ' + d1 + ' mm')}, ${eq(f('F_u') + ' = 2 · ' + fmt(M1 * 1000) + ' N·mm : ' + d1 + ' mm = ' + f(fmt((2 * M1 * 1000) / d1) + ' N'))}`,
        `d) ${eq(f('F_1') + ' = ' + fmt(M1 * 1000) + ' N·mm : ' + p.l1 + ' mm = ' + f(fmt((M1 * 1000) / p.l1) + ' N'))}`,
        `Mit ${fmt((M1 * 1000) / p.l1)} N Handkraft hebt man ${fmt(p.FG * 1000)} N. Das ist die Wirkung von Kurbel und Getriebe.`,
      ];
    },
  }),

  task({
    id: 'u21', karte: 'welle', stufe: 2, familie: 'umgekehrt',
    title: 'Räderwinde: Was schaffe ich von Hand?', src: 'Kreativ · Umgekehrt gefragt',
    gen: () => ({ F1: pick([120, 150, 180]), l1: pick([250, 300, 350]), i: pick([3, 3.3, 4, 5]), dT: pick([160, 180, 200]) }),
    draw: (p) => B.winde({ ...p, FG: 0 }, { F1: `F_1 = ${p.F1} N`, FG: 'F_G = ?' }),
    text: (p) => `Du kannst an der Kurbel (${l('l_1 = ' + p.l1 + ' mm')}) dauernd ${f('F_1 = ' + p.F1 + ' N')} aufbringen. Die Übersetzung ist i = ${fmt(p.i)}, die Seiltrommel hat ${l('ø' + p.dT + ' mm')}. Welche Last F_G kannst du höchstens heben (ohne Reibung)? Welcher Masse entspricht das (g = 9,81 m/s²)?`,
    asks: (p) => {
      const FG = (p.F1 * p.l1 * p.i) / (p.dT / 2);
      return [
        { k: 'F_G', unit: 'N', v: FG },
        { k: 'm', unit: 'kg', v: FG / g },
      ];
    },
    fehler: (p) => {
      const FG = (p.F1 * p.l1 * p.i) / (p.dT / 2);
      return [
        { ask: 0, v: (p.F1 * p.l1 * p.i) / p.dT, msg: 'Du hast den Trommeldurchmesser als Hebelarm genommen. Der Hebelarm ist der Radius.' },
        { ask: 0, v: (p.F1 * p.l1) / (p.i * (p.dT / 2)), msg: 'Die Trommel hat das grössere Drehmoment. Multipliziere mit i, teile nicht.' },
        { ask: 1, v: FG, msg: 'Das ist die Kraft in N. Für die Masse teilst du durch g.' },
      ];
    },
    tipps: () => ['Rückwärts rechnen: zuerst M_1 = F_1 · l_1.', 'M_2 = i · M_1', 'F_G = M_2 : (d_T : 2), dann m = F_G : g'],
    loesung: (p) => {
      const M1 = (p.F1 * p.l1) / 1000, M2 = M1 * p.i, FG = M2 / (p.dT / 2000);
      return [
        `${eq(m('M_1') + ' = ' + p.F1 + ' N · ' + fmt(p.l1 / 1000, 3) + ' m = ' + fmt(M1) + ' N·m')}`,
        `${eq(m('M_2') + ' = ' + fmt(p.i) + ' · ' + fmt(M1) + ' = ' + fmt(M2) + ' N·m')}`,
        `${eq(f('F_G') + ' = ' + fmt(M2) + ' N·m : ' + fmt(p.dT / 2000, 3) + ' m = ' + f(fmt(FG) + ' N'))}`,
        `${eq('m = ' + fmt(FG) + ' : 9,81 = ' + fmt(FG / g) + ' kg')}`,
        'Wie im Buch (Räderwinde), nur in umgekehrter Richtung gerechnet.',
      ];
    },
  }),

  task({
    id: 'u22', karte: 'welle', stufe: 3, familie: 'kette',
    title: 'Zahnrad auf der Welle: Umfangskraft und Lagerkräfte', src: 'Kreativ · Themen kombiniert',
    gen: () => {
      let p;
      do p = { M: pick([60, 90, 120, 150]), d: pick([100, 120, 150]), l: pick([300, 400, 500]), a: pick([100, 120, 150]) };
      while (2 * p.a === p.l);
      return p;
    },
    draw: (p) => B.zahnwelle(p),
    loesungsbild: (p) => {
      const F = Fu(p.M, p.d), FB = (F * p.a) / p.l;
      return B.zahnwelle(p, { Fu: `F_u = ${fmt(F)} N`, RA: `F_A = ${fmt(F - FB)} N`, RB: `F_B = ${fmt(FB)} N` });
    },
    text: (p) => `Ein Motor treibt eine Welle mit ${m('M = ' + p.M + ' N·m')}. Auf der Welle sitzt ein Zahnrad mit ${l('d = ' + p.d + ' mm')}. Das Gegenrad drückt mit der Umfangskraft F_u senkrecht auf das Zahnrad. Die Lager A und B haben den Abstand ${l('l = ' + p.l + ' mm')}, das Zahnrad sitzt ${l('a = ' + p.a + ' mm')} neben A. Berechne a) die Umfangskraft F_u und b) die Lagerkräfte F_A und F_B.`,
    asks: (p) => {
      const F = Fu(p.M, p.d);
      return [
        { k: 'a) F_u', unit: 'N', v: F },
        { k: 'b) F_A', unit: 'N', v: (F * (p.l - p.a)) / p.l },
        { k: 'b) F_B', unit: 'N', v: (F * p.a) / p.l },
      ];
    },
    fehler: (p) => {
      const F = Fu(p.M, p.d);
      return [
        { ask: 0, v: (1000 * p.M) / p.d, msg: 'Du hast d als Hebelarm genommen. Der Hebelarm ist d : 2.' },
        { ask: 1, v: (F * p.a) / p.l, msg: 'F_A und F_B sind vertauscht. Das Lager näher am Zahnrad trägt mehr.' },
        { ask: 2, v: (F * (p.l - p.a)) / p.l, msg: 'F_A und F_B sind vertauscht. Das Lager näher am Zahnrad trägt mehr.' },
      ];
    },
    tipps: () => ['Zuerst die Umfangskraft: F_u = 2 · M : d.', 'Dann wie bei den Lagerkräften: Drehpunkt in A, F_B · l = F_u · a.', 'F_A = F_u − F_B'],
    loesung: (p) => {
      const F = Fu(p.M, p.d), FB = (F * p.a) / p.l;
      return [
        `a) ${eq(f('F_u') + ' = 2 · ' + p.M * 1000 + ' N·mm : ' + p.d + ' mm = ' + f(fmt(F) + ' N'))}`,
        `b) Drehpunkt in A: ${eq(f('F_B') + ' = ' + fmt(F) + ' · ' + p.a + ' : ' + p.l + ' = ' + f(fmt(FB) + ' N'))}`,
        `${eq(f('F_A') + ' = ' + fmt(F) + ' − ' + fmt(FB) + ' = ' + f(fmt(F - FB) + ' N'))}`,
        'Zwei Kapitel in einer Aufgabe: Die Umfangskraft ist die Last für die Lagerrechnung. So rechnet man Getriebewellen.',
      ];
    },
  }),

  task({
    id: 'u23', karte: 'welle', stufe: 2, familie: 'fehler',
    title: 'Fehler finden: Last und Umfangskraft',
    gen: () => ({ FG: pick([2000, 3000, 4000]), d: pick([200, 250]), d2: pick([400, 500]) }),
    draw: (p) => B.trommelrad(p),
    text: (p) => `Auf einer Welle sitzen eine Seiltrommel (${l('ø' + p.d + ' mm')}) und ein Zahnrad (${l('ø' + p.d2 + ' mm')}). Am Seil hängt ${f('F_G = ' + p.FG + ' N')}. Tom sagt: «Auf derselben Welle ist alles gleich. Darum ist die Umfangskraft am Zahnrad auch ${p.FG} N.» Stimmt das?`,
    asks: (p) => [{
      kind: 'choice', k: 'Urteil',
      opts: [
        `Nein. Gleich ist das Drehmoment, nicht die Kraft. Das Zahnrad ist grösser. Darum ist F_u = ${fmt((p.FG * p.d) / p.d2)} N, kleiner als F_G.`,
        'Ja. Auf einer Welle wirkt überall dieselbe Kraft.',
        `Nein. F_u ist grösser als F_G, nämlich ${fmt((p.FG * p.d2) / p.d)} N.`,
        'Nein. F_u ist null, weil sich die Welle nicht dreht.',
      ],
      a: 0,
      why: [
        undefined,
        'Auf einer Welle ist das Drehmoment gleich. Die Radien sind aber verschieden. Darum sind die Kräfte verschieden.',
        'Verdreht. Ein grösserer Hebelarm braucht weniger Kraft für dasselbe Drehmoment.',
        'Die Welle hält die Last im Gleichgewicht. Die Umfangskraft braucht es trotzdem.',
      ],
    }],
    tipps: () => ['Was ist auf der ganzen Welle gleich: die Kraft oder das Drehmoment?', 'M = F_G · r_Trommel = F_u · r_Zahnrad', 'Welcher Radius ist grösser? Dann ist die Kraft dort kleiner.'],
    loesung: (p) => [
      `Drehmoment: ${eq(m('M') + ' = ' + f(p.FG + ' N') + ' · ' + l(fmt(p.d / 2000, 3) + ' m') + ' = ' + m(fmt((p.FG * p.d) / 2000) + ' Nm'))}`,
      `Umfangskraft: ${eq(f('F_u') + ' = 2 · ' + m('M') + ' : ' + l('d') + ' = ' + f(fmt((p.FG * p.d) / p.d2) + ' N'))}`,
      'Merke: Auf einer Welle ist das Drehmoment gleich. Die Kräfte hängen vom Radius ab.',
    ],
  }),

  // ================= Karte «antrieb»: Antriebsstränge =================
  task({
    id: 'u24', karte: 'antrieb', stufe: 3, familie: 'rechnen',
    title: 'Fahrradantrieb: vom Pedal zur Strasse',
    gen: () => ({ F: rng(150, 400, 50), l: pick([165, 170, 175]), d1: pick([160, 180, 200]), d2: pick([60, 70, 80]), D: pick([660, 680, 700]) }),
    draw: (p) => B.velo(p),
    loesungsbild: (p) => {
      const M1 = (p.F * p.l) / 1000, FK = Fu(M1, p.d1), M2 = (FK * p.d2) / 2000;
      return B.velo(p, { FK: `F_K = ${fmt(FK)} N`, FA: `F_A = ${fmt(Fu(M2, p.D))} N` });
    },
    text: (p) => `Die Fahrerin drückt mit ${f('F = ' + p.F + ' N')} senkrecht auf die waagrechte Kurbel (${l('l = ' + p.l + ' mm')}). Das Kettenblatt hat ${l('d_1 = ' + p.d1 + ' mm')}, das Ritzel ${l('d_2 = ' + p.d2 + ' mm')} und das Hinterrad ${l('D = ' + p.D + ' mm')}. Berechne a) das Drehmoment M_1 an der Kurbel, b) die Kettenkraft F_K, c) das Drehmoment M_2 am Hinterrad und d) die Antriebskraft F_A auf der Strasse.`,
    asks: (p) => {
      const M1 = (p.F * p.l) / 1000, FK = Fu(M1, p.d1), M2 = (FK * p.d2) / 2000;
      return [
        { k: 'a) M_1', unit: 'Nm', v: M1 },
        { k: 'b) F_K', unit: 'N', v: FK },
        { k: 'c) M_2', unit: 'Nm', v: M2 },
        { k: 'd) F_A', unit: 'N', v: Fu(M2, p.D) },
      ];
    },
    fehler: (p) => {
      const M1 = (p.F * p.l) / 1000, FK = Fu(M1, p.d1), M2 = (FK * p.d2) / 2000;
      return [
        { ask: 1, v: (1000 * M1) / p.d1, msg: 'Du hast d_1 als Hebelarm genommen. Der Hebelarm ist d_1 : 2.' },
        { ask: 2, v: (FK * p.d2) / 1000, msg: 'Du hast d_2 als Hebelarm genommen. Der Hebelarm ist d_2 : 2.' },
        { ask: 3, v: (1000 * M2) / p.D, msg: 'Du hast D als Hebelarm genommen. Der Hebelarm ist D : 2.' },
      ];
    },
    tipps: () => ['Gehe der Kraft nach: Pedal, Kettenblatt, Kette, Ritzel, Hinterrad, Strasse.', 'M_1 = F · l. Dann F_K = 2 · M_1 : d_1. Die Kette überträgt diese Kraft zum Ritzel.', 'M_2 = F_K · d_2 : 2 und F_A = 2 · M_2 : D'],
    loesung: (p) => {
      const M1 = (p.F * p.l) / 1000, FK = Fu(M1, p.d1), M2 = (FK * p.d2) / 2000, FA = Fu(M2, p.D);
      return [
        `Kurbel: ${eq(m('M_1') + ' = ' + f('F') + ' · ' + l('l') + ' = ' + p.F + ' N · ' + fmt(p.l / 1000, 3) + ' m = ' + m(fmt(M1) + ' Nm'))}`,
        `Kettenblatt: ${eq(f('F_K') + ' = 2 · ' + m('M_1') + ' : ' + l('d_1') + ' = 2 · ' + fmt(M1) + ' Nm : ' + fmt(p.d1 / 1000, 2) + ' m = ' + f(fmt(FK) + ' N'))}`,
        `Ritzel: ${eq(m('M_2') + ' = ' + f('F_K') + ' · ' + l('d_2 : 2') + ' = ' + fmt(FK) + ' N · ' + fmt(p.d2 / 2000, 3) + ' m = ' + m(fmt(M2) + ' Nm'))}`,
        `Hinterrad: ${eq(f('F_A') + ' = 2 · ' + m('M_2') + ' : ' + l('D') + ' = 2 · ' + fmt(M2) + ' Nm : ' + fmt(p.D / 1000, 2) + ' m = ' + f(fmt(FA) + ' N'))}`,
        'Auffällig: Die Kettenkraft ist viel grösser als die Pedalkraft. Die Antriebskraft auf der Strasse ist viel kleiner.',
      ];
    },
  }),

  task({
    id: 'u25', karte: 'antrieb', stufe: 3, familie: 'rechnen',
    title: 'Pkw-Antrieb mit Schaltgetriebe', src: 'Buch Umfangskraft, Nr. 6',
    gen: () => ({ M: pick([180, 220, 260]), n: 4200, iA: pick([3.38, 3.7]), rR: pick([290, 295, 310]), nmax: pick([6000, 6200, 6500]) }),
    draw: (p) => B.pkw(p),
    text: (p) => `Ein Pkw-Motor gibt sein grösstes Drehmoment ${m('M = ' + p.M + ' N·m')} ab. Das Schaltgetriebe hat die Übersetzungen 4,12 / 2,85 / 1,95 / 1,38 / 1,09 (Gang 1 bis 5). Das Ausgleichsgetriebe hat i_A = ${fmt(p.iA)}. Berechne a) die Gesamtübersetzungen in den Gängen 1 bis 5, b) die grösste Umfangskraft je Hinterrad im 1. und im 5. Gang bei ${l('r_R = ' + p.rR + ' mm')} und c) die Höchstgeschwindigkeit im 5. Gang bei n = ${p.nmax}/min.`,
    asks: (p) => {
      const G = GAENGE.map((x) => x * p.iA), r = p.rR / 1000;
      return [
        ...G.map((x, i) => ({ k: `a) i_ges ${i + 1}. Gang`, unit: '', v: x })),
        { k: 'b) F_u 1. Gang', unit: 'N', v: (p.M * G[0]) / 2 / r },
        { k: 'b) F_u 5. Gang', unit: 'N', v: (p.M * G[4]) / 2 / r },
        { k: 'c) v 5. Gang', unit: 'km/h', v: ((Math.PI * 2 * r * p.nmax) / G[4]) * 0.06 },
      ];
    },
    fehler: (p) => {
      const G = GAENGE.map((x) => x * p.iA), r = p.rR / 1000;
      return [
        { ask: 0, v: GAENGE[0], msg: 'Das ist nur der Gang. Multipliziere noch mit der Übersetzung des Ausgleichsgetriebes i_A.' },
        { ask: 5, v: (p.M * G[0]) / r, msg: 'Das Drehmoment verteilt sich auf zwei Hinterräder. Teile durch 2.' },
        { ask: 6, v: (p.M * G[4]) / r, msg: 'Das Drehmoment verteilt sich auf zwei Hinterräder. Teile durch 2.' },
        { ask: 7, v: (Math.PI * 2 * r * p.nmax) / G[4], msg: 'Das sind m/min. Für km/h rechnest du mal 60 und teilst durch 1000.' },
      ];
    },
    tipps: () => ['i_ges = i_Gang · i_A', 'Drehmoment an der Hinterachse: M · i_ges. Es verteilt sich auf zwei Räder. F_u = M_Rad : r_R.', 'Raddrehzahl = n : i_ges. v = π · d · n_Rad mit d = 2 · r_R. Dann m/min in km/h: · 60 : 1000.'],
    loesung: (p) => {
      const G = GAENGE.map((x) => x * p.iA), r = p.rR / 1000;
      return [
        `a) ${G.map((x, i) => `${i + 1}. Gang: ${GAENGE[i]} · ${fmt(p.iA)} = ${fmt(x, 2)}`).join('; ')}`,
        `b) 1. Gang: ${eq(m('M_Rad') + ' = ' + p.M + ' · ' + fmt(G[0], 3) + ' : 2 = ' + fmt((p.M * G[0]) / 2) + ' N·m')}, ${eq(f('F_u') + ' = ' + fmt((p.M * G[0]) / 2) + ' : ' + fmt(r, 3) + ' = ' + f(fmt((p.M * G[0]) / 2 / r) + ' N'))}`,
        `5. Gang: ${eq(f('F_u') + ' = ' + p.M + ' · ' + fmt(G[4], 3) + ' : 2 : ' + fmt(r, 3) + ' = ' + f(fmt((p.M * G[4]) / 2 / r) + ' N'))}`,
        `c) ${eq('n_Rad = ' + p.nmax + ' : ' + fmt(G[4], 3) + ' = ' + fmt(p.nmax / G[4]) + '/min')}, ${eq(v('v') + ' = π · ' + fmt(2 * r, 2) + ' m · ' + fmt(p.nmax / G[4]) + '/min = ' + fmt((Math.PI * 2 * r * p.nmax) / G[4]) + ' m/min = ' + v(fmt(((Math.PI * 2 * r * p.nmax) / G[4]) * 0.06) + ' km/h'))}`,
        'Kleiner Gang: grosse Zugkraft, kleine Geschwindigkeit. Grosser Gang: umgekehrt.',
      ];
    },
  }),

  task({
    id: 'u26', karte: 'antrieb', stufe: 3, familie: 'rechnen',
    title: 'Hubwerk mit zweistufigem Getriebe', src: 'Buch Umfangskraft, Nr. 7',
    gen: () => ({ z1: pick([15, 17]), z2: pick([51, 57]), z3: pick([19, 21]), z4: pick([60, 65]), FG: pick([2, 3, 4]), dT: pick([250, 280]), n: pick([550, 700, 950]) }),
    draw: (p) => B.hubwerk(p),
    text: (p) => `Die Seiltrommel (${l('ø' + p.dT + ' mm')}) eines Hubwerks wird über ein zweistufiges Getriebe angetrieben: z_1 = ${p.z1}, z_2 = ${p.z2}, z_3 = ${p.z3}, z_4 = ${p.z4}. Der Motor dreht mit n = ${p.n}/min. Gehoben werden höchstens ${f('F_G = ' + fmt(p.FG) + ' kN')}. Berechne a) die Drehzahl der Seiltrommel, b) die Hubgeschwindigkeit, c) das Drehmoment an der Seiltrommel und d) das Drehmoment am Motor.`,
    asks: (p) => {
      const i = ((p.z2 / p.z1) * p.z4) / p.z3, nT = p.n / i, MT = (p.FG * 1000 * p.dT) / 2000;
      return [
        { k: 'a) n_T', unit: '1/min', v: nT },
        { k: 'b) v', unit: 'm/min', v: Math.PI * (p.dT / 1000) * nT },
        { k: 'c) M_T', unit: 'N·m', v: MT },
        { k: 'd) M_Mot', unit: 'N·m', v: MT / i },
      ];
    },
    fehler: (p) => {
      const i = ((p.z2 / p.z1) * p.z4) / p.z3, nT = p.n / i, MT = (p.FG * 1000 * p.dT) / 2000;
      return [
        { ask: 0, v: p.n * i, msg: 'Die Trommel dreht langsamer als der Motor. Teile durch i.' },
        { ask: 1, v: (Math.PI * (p.dT / 2000) * nT), msg: 'Der Weg pro Umdrehung ist der Umfang π · d, nicht π · r.' },
        { ask: 2, v: (p.FG * 1000 * p.dT) / 1000, msg: 'Du hast ø als Hebelarm genommen. Der Hebelarm ist der Trommelradius.' },
        { ask: 3, v: MT * i, msg: 'Der Motor dreht schneller. Er hat das kleinere Drehmoment: M_Mot = M_T : i.' },
      ];
    },
    tipps: () => ['Gesamtübersetzung zweistufig: i = (z_2 : z_1) · (z_4 : z_3).', 'n_T = n : i, v = π · d_T · n_T', 'M_T = F_G · d_T : 2, M_Mot = M_T : i'],
    loesung: (p) => {
      const i1 = p.z2 / p.z1, i2 = p.z4 / p.z3, i = i1 * i2, nT = p.n / i, MT = (p.FG * 1000 * p.dT) / 2000;
      return [
        `${eq('i = ' + p.z2 + '/' + p.z1 + ' · ' + p.z4 + '/' + p.z3 + ' = ' + fmt(i1, 3) + ' · ' + fmt(i2, 3) + ' = ' + fmt(i, 3))}`,
        `a) ${eq('n_T = ' + p.n + ' : ' + fmt(i, 3) + ' = ' + fmt(nT) + '/min')}`,
        `b) ${eq(v('v') + ' = π · ' + fmt(p.dT / 1000, 3) + ' m · ' + fmt(nT) + '/min = ' + v(fmt(Math.PI * (p.dT / 1000) * nT) + ' m/min'))}`,
        `c) ${eq(m('M_T') + ' = ' + fmt(p.FG * 1000) + ' N · ' + fmt(p.dT / 2000, 3) + ' m = ' + m(fmt(MT) + ' N·m'))}`,
        `d) ${eq(m('M_Mot') + ' = ' + fmt(MT) + ' : ' + fmt(i, 3) + ' = ' + m(fmt(MT / i) + ' N·m'))}`,
      ];
    },
  }),

  task({
    id: 'u27', karte: 'antrieb', stufe: 2, familie: 'schaetzen',
    title: 'Schätzen: Kettenkraft am Velo',
    gen: () => ({ F: pick([250, 300, 350]), l: pick([170, 175]), d1: pick([170, 180, 190]), d2: 70, D: 680 }),
    draw: (p) => B.velo(p),
    text: (p) => `Du trittst mit ${f('F = ' + p.F + ' N')} auf das Pedal. Die Kurbel ist ${l('l = ' + p.l + ' mm')} lang, das Kettenblatt hat ${l('d_1 = ' + p.d1 + ' mm')}. Ohne Taschenrechner: Wie gross ist die Kettenkraft ungefähr?`,
    asks: (p) => {
      const FK = Math.round(Fu((p.F * p.l) / 1000, p.d1) / 10) * 10;
      return [{
        kind: 'choice', k: 'Kettenkraft etwa',
        opts: [`${fmt(FK / 10, 0)} N`, `${fmt(FK, 0)} N`, `${fmt(FK * 10, 0)} N`],
        a: 1,
        why: ['Viel zu klein. Die Kette trägt mehr als das Pedal, nicht weniger.', undefined, 'Zu gross. Prüfe die Umrechnung von mm in m.'],
      }];
    },
    tipps: () => ['Kurbellänge und Kettenblatt-Radius sind etwa gleich lang. Fast.', 'Die Kurbel ist etwa doppelt so lang wie der Radius des Kettenblatts.', 'Die Kettenkraft ist darum etwa doppelt so gross wie die Pedalkraft.'],
    loesung: (p) => {
      const M1 = (p.F * p.l) / 1000;
      return [
        `${eq(m('M_1') + ' = ' + p.F + ' N · ' + fmt(p.l / 1000, 3) + ' m = ' + fmt(M1) + ' Nm')}`,
        `${eq(f('F_K') + ' = 2 · ' + m('M_1') + ' : ' + l('d_1') + ' = ' + f(fmt(Fu(M1, p.d1), 0) + ' N'))}`,
        'Faustregel: Die Kurbel ist etwa doppelt so lang wie der Radius des Kettenblatts. Die Kette zieht darum etwa doppelt so stark wie du trittst.',
      ];
    },
  }),

  task({
    id: 'u28', karte: 'antrieb', stufe: 3, familie: 'waswaere',
    title: 'Was wäre wenn: Grösseres Ritzel',
    gen: () => ({ F: rng(200, 350, 50), l: pick([170, 175]), d1: pick([180, 200]), d2: pick([60, 70]), d2n: pick([80, 90]), D: pick([680, 700]) }),
    draw: (p) => B.velo({ ...p, d2: p.d2n }),
    text: (p) => `Beim Velo drückt die Fahrerin mit ${f('F = ' + p.F + ' N')} auf die Kurbel (${l('l = ' + p.l + ' mm')}). Kettenblatt ${l('d_1 = ' + p.d1 + ' mm')}, Hinterrad ${l('D = ' + p.D + ' mm')}. Sie wechselt das Ritzel von ${l('d_2 = ' + p.d2 + ' mm')} auf ${l('d_2 = ' + p.d2n + ' mm')}. a) Was passiert mit der Antriebskraft F_A auf der Strasse? b) Wie gross ist F_A danach?`,
    asks: (p) => {
      const FK = Fu((p.F * p.l) / 1000, p.d1);
      return [
        { kind: 'choice', k: 'a) F_A', opts: ['wird kleiner', 'bleibt gleich', 'wird grösser'], a: 2, why: ['Verdreht. Ein grösseres Ritzel hat den längeren Hebelarm. Das Rad bekommt mehr Drehmoment.', 'Das Ritzel ändert den Hebelarm der Kettenkraft. Also ändert sich F_A.', undefined] },
        { k: 'b) F_A neu', unit: 'N', v: Fu((FK * p.d2n) / 2000, p.D) },
      ];
    },
    fehler: (p) => {
      const FK = Fu((p.F * p.l) / 1000, p.d1);
      return [{ ask: 1, v: Fu((FK * p.d2) / 2000, p.D), msg: 'Das ist F_A vorher. Rechne mit dem neuen Ritzel.' }];
    },
    tipps: () => ['Die Kettenkraft F_K bleibt gleich. Nur der Hebelarm am Ritzel ändert sich.', 'M_2 = F_K · d_2 : 2 mit dem neuen d_2. Dann F_A = 2 · M_2 : D.', 'Zuerst F_K aus M_1 = F · l und F_K = 2 · M_1 : d_1.'],
    loesung: (p) => {
      const M1 = (p.F * p.l) / 1000, FK = Fu(M1, p.d1), M2 = (FK * p.d2n) / 2000;
      return [
        `Kettenkraft: ${eq(f('F_K') + ' = 2 · ' + m(fmt(M1) + ' Nm') + ' : ' + l(fmt(p.d1 / 1000, 2) + ' m') + ' = ' + f(fmt(FK) + ' N'))}`,
        `Ritzel: ${eq(m('M_2') + ' = ' + f(fmt(FK) + ' N') + ' · ' + l(fmt(p.d2n / 2000, 3) + ' m') + ' = ' + m(fmt(M2) + ' Nm'))}`,
        `Strasse: ${eq(f('F_A') + ' = 2 · ' + m(fmt(M2) + ' Nm') + ' : ' + l(fmt(p.D / 1000, 2) + ' m') + ' = ' + f(fmt(Fu(M2, p.D)) + ' N'))}`,
        `Vorher waren es ${fmt(Fu((FK * p.d2) / 2000, p.D))} N. Mehr Kraft auf der Strasse heisst: Das Rad dreht bei gleicher Trittfrequenz langsamer. Das ist ein leichterer Gang.`,
      ];
    },
  }),
];
