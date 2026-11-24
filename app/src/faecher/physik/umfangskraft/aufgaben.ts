// Aufgaben zum Kapitel Umfangskraft: Räder, Zahnräder, Riemen, Getriebe.
import { task, type Task } from '../../../core/types';
import { eq, f, l, m, v as vv } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import * as B from './bilder';

const g = 9.81;
const GANG = [4.12, 2.85, 1.95, 1.38, 1.09];

export const AUFGABEN: Task[] = [
  // ---------- Grundlagen: Umfangskraft am Rad ----------

  task({
    id: 'u1', karte: 'umfang', stufe: 1, familie: 'rechnen',
    title: 'Riemenscheibe: Umfangskraft berechnen',
    gen: () => ({ M: rng(20, 120, 10), d: rng(100, 250, 10) }),
    draw: (p) => B.rad(p, { typ: 'riemen', M: `M = ${p.M} Nm`, Fu: 'F_u = ?' }),
    text: (p) => `Eine Riemenscheibe überträgt das Drehmoment ${m('M = ' + p.M + ' Nm')}. Ihr Durchmesser ist ${l('d = ' + p.d + ' mm')}. Wie gross ist die Umfangskraft F_u im Riemen?`,
    asks: (p) => [{ k: 'F_u', unit: 'N', v: (2000 * p.M) / p.d }],
    fehler: (p) => [
      { ask: 0, v: (1000 * p.M) / p.d, msg: 'Du hast den Durchmesser als Hebelarm genommen. Der Hebelarm ist der Radius d : 2.' },
      { ask: 0, v: (p.M * p.d) / 2000, msg: 'Du hast multipliziert. Für die Kraft musst du das Drehmoment <b>durch</b> den Hebelarm teilen.' },
    ],
    tipps: (p) => [
      'Die Umfangskraft greift am Umfang an. Ihr Hebelarm ist der Radius d : 2.',
      'M = F_u · d : 2. Stelle nach F_u um.',
      `F_u = 2 · ${p.M} Nm : ${fmt(p.d / 1000, 3)} m. Der Durchmesser muss in Meter stehen.`,
    ],
    loesung: (p) => [
      `Formel: ${eq(m('M') + ' = ' + f('F_u') + ' · ' + l('d : 2'))}`,
      `Umstellen: ${eq(f('F_u') + ' = 2 · ' + m('M') + ' : ' + l('d'))}`,
      `Einsetzen: ${eq(f('F_u') + ' = 2 · ' + m(p.M + ' Nm') + ' : ' + l(fmt(p.d / 1000, 3) + ' m'))}`,
      `Resultat: ${eq(f('F_u = ' + fmt((2000 * p.M) / p.d) + ' N'))}`,
      'Vorstellung: Das Rad ist ein Hebel. Der Radius ist der Hebelarm.',
    ],
  }),

  task({
    id: 'u2', karte: 'umfang', stufe: 1, familie: 'rechnen',
    title: 'Zahnrad: Drehmoment berechnen',
    gen: () => ({ Fu: rng(200, 1500, 100), d: rng(60, 240, 20) }),
    draw: (p) => B.rad(p, { typ: 'zahn', M: 'M = ?', Fu: `F_u = ${p.Fu} N` }),
    text: (p) => `An einem Zahnrad mit dem Teilkreisdurchmesser ${l('d = ' + p.d + ' mm')} wirkt die Umfangskraft ${f('F_u = ' + p.Fu + ' N')}. Welches Drehmoment M überträgt das Zahnrad?`,
    asks: (p) => [{ k: 'M', unit: 'Nm', v: (p.Fu * p.d) / 2000 }],
    fehler: (p) => [
      { ask: 0, v: (p.Fu * p.d) / 1000, msg: 'Du hast den Durchmesser als Hebelarm genommen. Der Hebelarm ist der Radius d : 2.' },
      { ask: 0, v: (p.Fu * p.d) / 2, msg: 'Das Resultat steht in Nmm, weil d in mm war. Teile durch 1000 für Nm.' },
    ],
    tipps: () => [
      'Der Hebelarm ist der halbe Durchmesser.',
      'M = F_u · d : 2, mit d in Meter.',
      'Radius in Meter: d : 2000.',
    ],
    loesung: (p) => [
      `Formel: ${eq(m('M') + ' = ' + f('F_u') + ' · ' + l('d : 2'))}`,
      `Radius: ${eq(l('d : 2 = ' + p.d / 2 + ' mm = ' + fmt(p.d / 2000, 3) + ' m'))}`,
      `Einsetzen: ${eq(m('M') + ' = ' + f(p.Fu + ' N') + ' · ' + l(fmt(p.d / 2000, 3) + ' m'))}`,
      `Resultat: ${eq(m('M = ' + fmt((p.Fu * p.d) / 2000) + ' Nm'))}`,
    ],
  }),

  task({
    id: 'u4', karte: 'umfang', stufe: 2, familie: 'rechnen',
    title: 'Seiltrommel mit Zahnrad auf einer Welle',
    gen: () => ({ FG: rng(1000, 5000, 500), d: pick([150, 200, 250]), d2: pick([300, 400, 500]) }),
    draw: (p) => B.trommel(p),
    loesungsbild: (p) => B.trommel(p, { Fu: `F_u = ${fmt((p.FG * p.d) / p.d2)} N`, M: `M = ${fmt((p.FG * p.d) / 2000)} Nm` }),
    text: (p) => `Auf einer Welle sitzen eine Seiltrommel und ein Zahnrad. Am Seil der Trommel (${l('Durchmesser ' + p.d + ' mm')}) hängt die Last ${f('F_G = ' + p.FG + ' N')}. Das Zahnrad hat ${l('d = ' + p.d2 + ' mm')}. Berechne a) das Drehmoment M an der Welle und b) die Umfangskraft F_u am Zahnrad.`,
    asks: (p) => [
      { k: 'a) M', unit: 'Nm', v: (p.FG * p.d) / 2000 },
      { k: 'b) F_u', unit: 'N', v: (p.FG * p.d) / p.d2 },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.FG * p.d) / 1000, msg: 'Du hast den Durchmesser der Trommel als Hebelarm genommen. Das Seil zieht am Radius.' },
      { ask: 1, v: p.FG, msg: 'Trommel und Zahnrad haben verschiedene Durchmesser. Die Umfangskraft am Zahnrad ist nicht gleich der Last.' },
      { ask: 1, v: (p.FG * p.d2) / p.d, msg: 'Verkehrt herum. Das Zahnrad ist grösser als die Trommel, also ist seine Umfangskraft kleiner als die Last.' },
    ],
    tipps: () => [
      'Trommel und Zahnrad sitzen auf derselben Welle. Sie haben dasselbe Drehmoment.',
      'M = F_G · Trommelradius. Danach F_u = 2 · M : d.',
      'Das Drehmoment ist in Nm, der Durchmesser des Zahnrads in m.',
    ],
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
    id: 'u18', karte: 'umfang', stufe: 2, familie: 'waswaere',
    title: 'Was wäre wenn: grössere Riemenscheibe',
    gen: () => {
      const d = pick([100, 120, 150]), k = pick([2, 3]);
      return { M: pick([40, 60, 80, 100]), d, k, dn: d * k };
    },
    draw: (p) => B.rad({ d: p.dn }, { typ: 'riemen', M: `M = ${p.M} Nm`, Fu: 'F_u = ?', dlab: `d neu = ${p.dn}` }),
    text: (p) => `Eine Riemenscheibe mit ${l('d = ' + p.d + ' mm')} überträgt ${m('M = ' + p.M + ' Nm')}. Du tauschst sie gegen eine Scheibe mit ${l('d = ' + p.dn + ' mm')}, also dem ${p.k}-fachen Durchmesser. Das Drehmoment bleibt gleich. a) Was passiert mit der Umfangskraft im Riemen? b) Wie gross ist sie danach?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Umfangskraft im Riemen', opts: ['wird kleiner', 'bleibt gleich', 'wird grösser'], a: 0,
        why: [undefined, 'Das Drehmoment bleibt gleich, aber der Hebelarm wird länger. Dann genügt eine kleinere Kraft.', 'Ein längerer Hebelarm braucht weniger Kraft, nicht mehr.'],
      },
      { k: 'b) F_u neu', unit: 'N', v: (2000 * p.M) / p.dn },
    ],
    fehler: (p) => [
      { ask: 1, v: (2000 * p.M) / p.d, msg: 'Das ist die Kraft vorher. Rechne mit dem neuen Durchmesser.' },
      { ask: 1, v: (2000 * p.M * p.k) / p.d, msg: `Du hast mit ${p.k} multipliziert statt geteilt. Ein grösserer Durchmesser gibt eine kleinere Kraft.` },
    ],
    tipps: () => [
      'Das Drehmoment bleibt gleich. Nur der Hebelarm ändert sich.',
      'F_u = 2 · M : d mit dem neuen Durchmesser.',
      'Doppelter Durchmesser heisst halbe Umfangskraft.',
    ],
    loesung: (p) => [
      `Neuer Durchmesser: ${eq(l('d') + ' = ' + p.dn + ' mm = ' + fmt(p.dn / 1000, 3) + ' m')}`,
      `${eq(f('F_u') + ' = 2 · ' + m(p.M + ' Nm') + ' : ' + l(fmt(p.dn / 1000, 3) + ' m') + ' = ' + f(fmt((2000 * p.M) / p.dn) + ' N'))}`,
      `Vorher waren es ${fmt((2000 * p.M) / p.d)} N. Der Durchmesser ist ${p.k}-mal grösser, die Kraft ${p.k}-mal kleiner.`,
      'Darum haben Riemenscheiben für grosse Drehmomente einen grossen Durchmesser.',
    ],
  }),

  task({
    id: 'u19', karte: 'umfang', stufe: 2, familie: 'umgekehrt',
    title: 'Umgekehrt: Wie klein darf die Scheibe sein?',
    gen: () => ({ M: pick([30, 40, 50, 60]), Fmax: pick([400, 500, 600, 800]) }),
    draw: (p) => B.rad({ d: (2000 * p.M) / p.Fmax }, { typ: 'riemen', M: `M = ${p.M} Nm`, Fu: `F_u = ${p.Fmax} N`, dlab: 'd = ?' }),
    text: (p) => `Ein Riemen darf höchstens die Umfangskraft ${f('F_u = ' + p.Fmax + ' N')} übertragen. Die Scheibe soll ${m('M = ' + p.M + ' Nm')} übertragen. Wie gross muss ihr Durchmesser d mindestens sein?`,
    asks: (p) => [{ k: 'd', unit: 'mm', v: (2000 * p.M) / p.Fmax }],
    fehler: (p) => [
      { ask: 0, v: (1000 * p.M) / p.Fmax, msg: 'Das ist der Radius. Gefragt ist der Durchmesser. Er ist doppelt so gross.' },
      { ask: 0, v: (2 * p.M) / p.Fmax, msg: 'Das Resultat steht in Meter. Gefragt ist mm. Rechne mal 1000.' },
    ],
    tipps: () => [
      'Stelle M = F_u · d : 2 nach d um.',
      'd = 2 · M : F_u. Das Resultat kommt in Meter heraus.',
      'Rechne das Resultat in mm um: mal 1000.',
    ],
    loesung: (p) => [
      `Umstellen: ${eq(l('d') + ' = 2 · ' + m('M') + ' : ' + f('F_u'))}`,
      `Einsetzen: ${eq(l('d') + ' = 2 · ' + m(p.M + ' Nm') + ' : ' + f(p.Fmax + ' N') + ' = ' + fmt((2 * p.M) / p.Fmax, 3) + ' m')}`,
      `Resultat: ${eq(l('d = ' + fmt((2000 * p.M) / p.Fmax) + ' mm'))}`,
      'Eine kleinere Scheibe würde den Riemen überlasten. Eine grössere ist immer erlaubt.',
    ],
  }),

  // ---------- Zahnräder und Übersetzung ----------

  task({
    id: 'u3', karte: 'getriebe', stufe: 2, familie: 'rechnen',
    title: 'Zahnradpaar: Kraft und Drehmoment',
    gen: () => ({ M1: rng(10, 60, 5), d1: pick([80, 100, 120]), d2: pick([160, 200, 240]) }),
    draw: (p) => B.paar(p, { M1: `M_1 = ${p.M1} Nm`, M2: 'M_2 = ?', Fu: 'F_u = ?' }),
    loesungsbild: (p) => B.paar(p, { M1: `M_1 = ${p.M1} Nm`, M2: `M_2 = ${fmt((p.M1 * p.d2) / p.d1)} Nm`, Fu: `F_u = ${fmt((2000 * p.M1) / p.d1)} N` }),
    text: (p) => `Rad 1 treibt Rad 2 an. Rad 1 hat ${l('d_1 = ' + p.d1 + ' mm')} und das Drehmoment ${m('M_1 = ' + p.M1 + ' Nm')}. Rad 2 hat ${l('d_2 = ' + p.d2 + ' mm')}. Berechne a) die Umfangskraft F_u am Zahneingriff und b) das Drehmoment M_2 am Rad 2.`,
    asks: (p) => [
      { k: 'a) F_u', unit: 'N', v: (2000 * p.M1) / p.d1 },
      { k: 'b) M_2', unit: 'Nm', v: (p.M1 * p.d2) / p.d1 },
    ],
    fehler: (p) => [
      { ask: 0, v: (1000 * p.M1) / p.d1, msg: 'Du hast den Durchmesser als Hebelarm genommen. Der Hebelarm ist der Radius d_1 : 2.' },
      { ask: 1, v: (p.M1 * p.d1) / p.d2, msg: 'Verkehrt herum. Das grosse Rad hat das grössere Drehmoment.' },
      { ask: 1, v: ((2000 * p.M1) / p.d1 * p.d2) / 1000, msg: 'Du hast mit d_2 statt mit d_2 : 2 gerechnet. Der Hebelarm ist der Radius.' },
    ],
    tipps: () => [
      'Am Zahneingriff wirkt an beiden Rädern dieselbe Umfangskraft.',
      'F_u = 2 · M_1 : d_1',
      'M_2 = F_u · d_2 : 2',
    ],
    loesung: (p) => {
      const Fu = (2000 * p.M1) / p.d1;
      return [
        'Am Zahneingriff drückt Rad 1 auf Rad 2. Die Umfangskraft ist an beiden Rädern gleich gross.',
        `${eq(f('F_u') + ' = 2 · ' + m('M_1') + ' : ' + l('d_1') + ' = 2 · ' + p.M1 + ' Nm : ' + fmt(p.d1 / 1000, 3) + ' m = ' + f(fmt(Fu) + ' N'))}`,
        `${eq(m('M_2') + ' = ' + f('F_u') + ' · ' + l('d_2 : 2') + ' = ' + fmt(Fu) + ' N · ' + fmt(p.d2 / 2000, 3) + ' m = ' + m(fmt((p.M1 * p.d2) / p.d1) + ' Nm'))}`,
        `Kontrolle: Das grosse Rad hat den ${fmt(p.d2 / p.d1)}-fachen Durchmesser. Sein Drehmoment ist darum ${fmt(p.d2 / p.d1)}-mal so gross.`,
        'Vorstellung: gleiche Kraft, längerer Hebelarm, grösseres Drehmoment.',
      ];
    },
  }),

  task({
    id: 'u6', karte: 'getriebe', stufe: 1, familie: 'rechnen',
    title: 'Zahnradgetriebe: Umfangskraft und M_2', src: 'Buch Umfangskraft, Beispiel',
    gen: () => ({ M1: pick([80, 100, 135, 160]), m: pick([2, 2.5, 3, 4]), z1: pick([15, 17, 20]), z2: pick([45, 51, 58, 60]) }),
    draw: (p) => B.zahnradpaar(p, { Fu: 'F_u = ?' }),
    text: (p) => `Ein Zahnradgetriebe wird mit ${m('M_1 = ' + p.M1 + ' Nm')} angetrieben. Die Zähne haben den Modul ${l('m = ' + fmt(p.m) + ' mm')}. Das treibende Rad hat z_1 = ${p.z1}, das getriebene z_2 = ${p.z2} Zähne. Wie gross sind a) die Umfangskraft F_u am Zahnrad z_1 und b) das Drehmoment M_2?`,
    asks: (p) => [
      { k: 'a) F_u', unit: 'N', v: (2 * p.M1 * 1000) / (p.m * p.z1) },
      { k: 'b) M_2', unit: 'Nm', v: (p.M1 * p.z2) / p.z1 },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.M1 * 1000) / (p.m * p.z1), msg: 'Du hast d als Hebelarm genommen. Der Hebelarm ist d : 2, also muss im Zähler eine 2 stehen.' },
      { ask: 0, v: (2 * p.M1) / (p.m * p.z1), msg: 'M_1 muss in Nmm stehen, weil m in mm ist. Rechne M_1 mal 1000.' },
      { ask: 1, v: (p.M1 * p.z1) / p.z2, msg: 'Verkehrt herum. Das Rad mit mehr Zähnen hat das grössere Drehmoment.' },
    ],
    tipps: () => [
      'Der Durchmesser folgt aus Modul und Zähnezahl: d = m · z.',
      'M = F_u · d : 2, also F_u = 2 · M : (m · z). M in Nmm einsetzen.',
      'M_2 : M_1 = z_2 : z_1',
    ],
    loesung: (p) => {
      const Fu = (2 * p.M1 * 1000) / (p.m * p.z1);
      return [
        `Durchmesser von Rad 1: ${eq(l('d_1') + ' = m · z_1 = ' + fmt(p.m) + ' mm · ' + p.z1 + ' = ' + fmt(p.m * p.z1) + ' mm')}`,
        `a) ${eq(f('F_u') + ' = 2 · ' + m('M_1') + ' : ' + l('d_1') + ' = 2 · ' + p.M1 * 1000 + ' Nmm : ' + fmt(p.m * p.z1) + ' mm = ' + f(fmt(Fu) + ' N'))}`,
        `b) ${eq(m('M_2') + ' = ' + m('M_1') + ' · z_2 : z_1 = ' + p.M1 + ' · ' + p.z2 + ' : ' + p.z1 + ' = ' + m(fmt((p.M1 * p.z2) / p.z1) + ' Nm'))}`,
        'Das grosse Rad hat das grössere Drehmoment, aber die kleinere Drehzahl.',
      ];
    },
  }),

  task({
    id: 'u7', karte: 'getriebe', stufe: 1, familie: 'rechnen',
    title: 'Zahnriementrieb', src: 'Buch Umfangskraft, Nr. 1',
    gen: () => ({ z1: pick([12, 15, 18, 20]), M1: pick([120, 180, 240, 300]), z2: pick([30, 35, 40, 48]) }),
    draw: (p) => B.zahnriemen(p),
    text: (p) => `Die Zahnriemenscheibe z_1 = ${p.z1} wird mit ${m('M_1 = ' + p.M1 + ' Nm')} angetrieben. Wie gross sind a) die Übersetzung i und b) das Drehmoment M_2 an der getriebenen Scheibe mit z_2 = ${p.z2}?`,
    asks: (p) => [
      { k: 'a) i', unit: '', v: p.z2 / p.z1 },
      { k: 'b) M_2', unit: 'Nm', v: (p.M1 * p.z2) / p.z1 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.z1 / p.z2, msg: 'Verkehrt herum. i = z_2 : z_1, die getriebene Scheibe steht im Zähler.' },
      { ask: 1, v: (p.M1 * p.z1) / p.z2, msg: 'Verkehrt herum. Die grössere Scheibe hat das grössere Drehmoment.' },
      { ask: 1, v: p.M1, msg: 'Die Scheiben sind verschieden gross. Das Drehmoment ändert sich mit i.' },
    ],
    tipps: () => ['i = z_2 : z_1', 'M_2 = i · M_1', 'Die Spannrolle ändert nichts an der Übersetzung.'],
    loesung: (p) => [
      `a) ${eq('i = z_2 : z_1 = ' + p.z2 + ' : ' + p.z1 + ' = ' + fmt(p.z2 / p.z1, 3))}`,
      `b) ${eq(m('M_2') + ' = i · ' + m('M_1') + ' = ' + fmt(p.z2 / p.z1, 3) + ' · ' + p.M1 + ' Nm = ' + m(fmt((p.M1 * p.z2) / p.z1) + ' Nm'))}`,
      'Die Spannrolle hält nur den Riemen gespannt. Sie überträgt kein Drehmoment.',
    ],
  }),

  task({
    id: 'u8', karte: 'getriebe', stufe: 2, familie: 'rechnen',
    title: 'Schneckengetriebe', src: 'Buch Umfangskraft, Nr. 2',
    gen: () => ({ z1: pick([1, 2]), z2: pick([30, 32, 40, 50]), n1: pick([1440, 2880]), M2: pick([60, 80, 120]) }),
    draw: (p) => B.schnecke(p),
    text: (p) => `An der Abtriebswelle eines Schneckengetriebes ist das Drehmoment ${m('M_2 = ' + p.M2 + ' Nm')} erforderlich. Die Schnecke hat z_1 = ${p.z1} Gang, das Schneckenrad z_2 = ${p.z2} Zähne. Wie gross sind a) die Drehzahl n_2 bei der Motordrehzahl n_1 = ${p.n1}/min und b) das Drehmoment M_1 des Motors (ohne Wirkungsgrad)?`,
    asks: (p) => [
      { k: 'a) n_2', unit: '1/min', v: (p.n1 * p.z1) / p.z2 },
      { k: 'b) M_1', unit: 'Nm', v: (p.M2 * p.z1) / p.z2 },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.n1 * p.z2) / p.z1, msg: 'Verkehrt herum. Das Schneckenrad dreht viel langsamer als der Motor.' },
      { ask: 1, v: (p.M2 * p.z2) / p.z1, msg: 'Verkehrt herum. Der schnelle Motor hat das kleinere Drehmoment als die langsame Abtriebswelle.' },
    ],
    tipps: () => [
      'Eine eingängige Schnecke zählt wie ein Zahnrad mit z_1 = 1.',
      'i = z_2 : z_1, n_2 = n_1 : i',
      'M_1 = M_2 : i',
    ],
    loesung: (p) => {
      const i = p.z2 / p.z1;
      return [
        `${eq('i = ' + p.z2 + ' : ' + p.z1 + ' = ' + fmt(i))}`,
        `a) ${eq('n_2 = ' + p.n1 + ' : ' + fmt(i) + ' = ' + fmt(p.n1 / i) + '/min')}`,
        `b) ${eq(m('M_1') + ' = ' + p.M2 + ' : ' + fmt(i) + ' = ' + m(fmt(p.M2 / i, 3) + ' Nm'))}`,
        'In Wirklichkeit hat ein Schneckengetriebe einen schlechten Wirkungsgrad. Der Motor braucht dann mehr als dieses M_1.',
      ];
    },
  }),

  task({
    id: 'u10', karte: 'getriebe', stufe: 1, familie: 'rechnen',
    title: 'Kolbenverdichter mit Keilriemen', src: 'Buch Umfangskraft, Nr. 4',
    gen: () => ({ M1: pick([30, 40, 48, 60]), d1: pick([125, 160, 180]), i: pick([2.5, 2.84, 3.2]) }),
    draw: (p) => B.verdichter(p),
    text: (p) => `Ein Kolbenkompressor wird über Keilriemen angetrieben. Der Motor gibt ${m('M_1 = ' + p.M1 + ' Nm')} ab. Die Motorscheibe hat ${l('d_w1 = ' + p.d1 + ' mm')}, die Übersetzung ist i = ${fmt(p.i)}. Wie gross sind a) die Zugkraft F im Keilriemen und b) das Drehmoment am Kompressor?`,
    asks: (p) => [
      { k: 'a) F', unit: 'N', v: (2 * p.M1 * 1000) / p.d1 },
      { k: 'b) M_2', unit: 'Nm', v: p.M1 * p.i },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.M1 * 1000) / p.d1, msg: 'Du hast den Durchmesser als Hebelarm genommen. Der Hebelarm ist der Radius d : 2.' },
      { ask: 0, v: (2 * p.M1) / p.d1, msg: 'M_1 muss in Nmm stehen, weil d in mm ist. Rechne M_1 mal 1000.' },
      { ask: 1, v: p.M1 / p.i, msg: 'Verkehrt herum. Das Schwungrad ist grösser als die Motorscheibe und hat das grössere Drehmoment.' },
    ],
    tipps: () => [
      'Die Riemenkraft wirkt am Umfang der Motorscheibe.',
      'F = 2 · M_1 : d_w1, mit M_1 in Nmm.',
      'M_2 = i · M_1',
    ],
    loesung: (p) => [
      `a) ${eq(f('F') + ' = 2 · ' + p.M1 * 1000 + ' Nmm : ' + p.d1 + ' mm = ' + f(fmt((2 * p.M1 * 1000) / p.d1) + ' N'))}`,
      `b) ${eq(m('M_2') + ' = ' + fmt(p.i) + ' · ' + p.M1 + ' Nm = ' + m(fmt(p.M1 * p.i) + ' Nm'))}`,
    ],
  }),

  task({
    id: 'u22', karte: 'getriebe', stufe: 1, familie: 'bild',
    title: 'Bild deuten: treibendes und getriebenes Rad',
    gen: () => ({ M1: pick([20, 30, 40]), d1: pick([80, 100, 120]), d2: pick([160, 200, 240]) }),
    draw: (p) => B.paar(p, { M1: `M_1 = ${p.M1} Nm`, M2: 'M_2 = ?', Fu: 'F_u' }),
    text: () => 'Rad 1 treibt Rad 2 an. Rad 2 ist grösser. Schau das Bild an und beantworte drei Fragen.',
    asks: () => [
      {
        kind: 'choice', k: 'Welches Rad hat das grössere Drehmoment?', opts: ['Rad 1 (klein)', 'Rad 2 (gross)', 'Beide gleich'], a: 1,
        why: ['Bei gleicher Kraft hat das Rad mit dem längeren Hebelarm das grössere Drehmoment.', undefined, 'Die Umfangskraft ist gleich, aber die Hebelarme sind verschieden.'],
      },
      {
        kind: 'choice', k: 'Wie verhält sich die Umfangskraft am Zahneingriff?', opts: ['Am kleinen Rad grösser', 'Am grossen Rad grösser', 'An beiden Rädern gleich gross'], a: 2,
        why: ['Die Räder drücken gegenseitig aufeinander. Nach dem Wechselwirkungsgesetz sind die Kräfte gleich gross.', 'Die Räder drücken gegenseitig aufeinander. Nach dem Wechselwirkungsgesetz sind die Kräfte gleich gross.', undefined],
      },
      {
        kind: 'choice', k: 'Welches Rad dreht langsamer?', opts: ['Rad 1 (klein)', 'Rad 2 (gross)', 'Beide gleich schnell'], a: 1,
        why: ['Das kleine Rad muss mehr Umdrehungen machen, damit am Zahneingriff gleich viel Umfang vorbeiläuft.', undefined, 'Die Umfänge sind verschieden. Darum sind die Drehzahlen verschieden.'],
      },
    ],
    tipps: () => ['Die Umfangskraft ist an beiden Rädern gleich.', 'Das Drehmoment ist Kraft mal Radius.', 'Am Zahneingriff läuft gleich viel Umfang vorbei.'],
    loesung: (p) => [
      `Die Umfangskraft ist gleich: ${eq(f('F_u') + ' = 2 · ' + m('M_1') + ' : ' + l('d_1') + ' = ' + f(fmt((2000 * p.M1) / p.d1) + ' N'))}`,
      `Rad 2 hat den ${fmt(p.d2 / p.d1)}-fachen Durchmesser. Sein Drehmoment ist ${fmt(p.d2 / p.d1)}-mal so gross: ${eq(m('M_2 = ' + fmt((p.M1 * p.d2) / p.d1) + ' Nm'))}`,
      'Seine Drehzahl ist im gleichen Verhältnis kleiner.',
      'Merke: Mehr Drehmoment kostet Drehzahl.',
    ],
  }),

  task({
    id: 'u20', karte: 'getriebe', stufe: 1, familie: 'schaetzen',
    title: 'Schätzen: Kettenkraft am Fahrrad',
    gen: () => ({ F: pick([200, 300, 400]), l: pick([150, 200]), d1: pick([100, 200]) }),
    draw: (p) => B.velo({ ...p, d2: 70, D: 680 }, { nurKette: true }),
    text: (p) => `Du trittst mit ${f('F = ' + p.F + ' N')} auf die waagrechte Kurbel (${l('l = ' + p.l + ' mm')}). Das Kettenblatt hat ${l('d_1 = ' + p.d1 + ' mm')}. Ohne Taschenrechner: Welche Kettenkraft F_K ist etwa richtig?`,
    asks: (p) => {
      const FK = (2 * p.F * p.l) / p.d1;
      return [{
        kind: 'choice', k: 'F_K etwa',
        opts: [`${fmt(FK / 10, 0)} N`, `${fmt(FK, 0)} N`, `${fmt(FK * 10, 0)} N`], a: 1,
        why: ['Zu klein. Die Kette zieht stärker als dein Fuss, weil der Kettenblatt-Radius kleiner ist als die Kurbel.', undefined, 'Zu gross. Das Verhältnis von Kurbel zu Radius ist nur etwa 1 bis 4.'],
      }];
    },
    tipps: () => ['Kurbel und Kettenblatt sitzen auf derselben Welle. Sie haben dasselbe Drehmoment.', 'F · l = F_K · d_1 : 2', 'Vergleiche Kurbellänge mit dem Radius des Kettenblatts.'],
    loesung: (p) => {
      const FK = (2 * p.F * p.l) / p.d1;
      return [
        `Radius des Kettenblatts: ${eq(l(fmt(p.d1 / 2, 0) + ' mm'))}. Kurbel: ${eq(l(p.l + ' mm'))}.`,
        `Die Kurbel ist ${fmt(p.l / (p.d1 / 2))}-mal so lang wie der Radius. Also ist die Kettenkraft ${fmt(p.l / (p.d1 / 2))}-mal so gross wie F.`,
        `${eq(f('F_K') + ' = ' + p.F + ' N · ' + fmt(p.l / (p.d1 / 2)) + ' = ' + f(fmt(FK, 0) + ' N'))}`,
        'Darum sind Fahrradketten so stark gebaut.',
      ];
    },
  }),

  // ---------- Mehrere Stufen und Wellen ----------

  task({
    id: 'u5', karte: 'mehrstufig', stufe: 3, familie: 'kette',
    title: 'Fahrradantrieb: vom Pedal zur Strasse',
    gen: () => ({ F: rng(150, 400, 50), l: pick([165, 170, 175]), d1: pick([160, 180, 200]), d2: pick([60, 70, 80]), D: pick([660, 680, 700]) }),
    draw: (p) => B.velo(p),
    text: (p) => `Die Fahrerin drückt mit ${f('F = ' + p.F + ' N')} senkrecht auf die waagrechte Kurbel (${l('l = ' + p.l + ' mm')}). Das Kettenblatt hat ${l('d_1 = ' + p.d1 + ' mm')}, das Ritzel ${l('d_2 = ' + p.d2 + ' mm')} und das Hinterrad ${l('D = ' + p.D + ' mm')}. Berechne a) das Drehmoment M_1 an der Kurbel, b) die Kettenkraft F_K, c) das Drehmoment M_2 am Hinterrad und d) die Antriebskraft F_A auf der Strasse.`,
    asks: (p) => {
      const M1 = (p.F * p.l) / 1000, FK = (2000 * M1) / p.d1, M2 = (FK * p.d2) / 2000;
      return [
        { k: 'a) M_1', unit: 'Nm', v: M1 },
        { k: 'b) F_K', unit: 'N', v: FK },
        { k: 'c) M_2', unit: 'Nm', v: M2 },
        { k: 'd) F_A', unit: 'N', v: (2000 * M2) / p.D },
      ];
    },
    fehler: (p) => {
      const M1 = (p.F * p.l) / 1000, FK = (2000 * M1) / p.d1;
      return [
        { ask: 0, v: p.F * p.l, msg: 'Die Kurbel steht in mm. Rechne sie in Meter um, sonst kommt Nmm heraus.' },
        { ask: 1, v: (1000 * M1) / p.d1, msg: 'Du hast den Durchmesser des Kettenblatts als Hebelarm genommen. Der Hebelarm ist der Radius.' },
        { ask: 3, v: FK, msg: 'Das Hinterrad ist viel grösser als das Ritzel. Die Kraft am Umfang des Hinterrads ist darum viel kleiner als die Kettenkraft.' },
      ];
    },
    tipps: () => [
      'Gehe der Kraft nach: Pedal, Kettenblatt, Kette, Ritzel, Hinterrad, Strasse.',
      'M_1 = F · l. Dann F_K = 2 · M_1 : d_1. Die Kette überträgt diese Kraft zum Ritzel.',
      'M_2 = F_K · d_2 : 2 und F_A = 2 · M_2 : D',
    ],
    loesung: (p) => {
      const M1 = (p.F * p.l) / 1000, FK = (2000 * M1) / p.d1, M2 = (FK * p.d2) / 2000, FA = (2000 * M2) / p.D;
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
    id: 'u9', karte: 'mehrstufig', stufe: 2, familie: 'rechnen',
    title: 'Montagepresse', src: 'Buch Umfangskraft, Nr. 3',
    gen: () => ({ F: pick([1, 1.5, 2, 2.5]), d: pick([100, 120]), z1: pick([18, 20, 22]), mm: 2.5 }),
    draw: (p) => B.presse(p),
    text: (p) => `An der Pinole einer Montagepresse ist eine Kraft ${f('F = ' + fmt(p.F) + ' kN')} nötig. Das Zahnrad an der Pinole hat ${l('ø' + p.d + ' mm')}. Dasselbe Rad greift in die Pinole und in ein Antriebsrad mit z_1 = ${p.z1} und ${l('m = ' + fmt(p.mm) + ' mm')}. Wie gross sind a) das Drehmoment M_2 und b) das Drehmoment M_1 des Antriebsrades?`,
    asks: (p) => {
      const M2 = (p.F * 1000 * p.d) / 2000;
      return [
        { k: 'a) M_2', unit: 'Nm', v: M2 },
        { k: 'b) M_1', unit: 'Nm', v: (M2 * p.z1 * p.mm) / p.d },
      ];
    },
    fehler: (p) => {
      const M2 = (p.F * 1000 * p.d) / 2000;
      return [
        { ask: 0, v: (p.F * p.d) / 2000, msg: 'F steht in kN. Rechne F zuerst in N um.' },
        { ask: 0, v: (p.F * 1000 * p.d) / 1000, msg: 'Du hast den Durchmesser als Hebelarm genommen. Der Hebelarm ist der Radius.' },
        { ask: 1, v: (M2 * p.d) / (p.z1 * p.mm), msg: 'Verkehrt herum. Das kleine Antriebsrad hat das kleinere Drehmoment.' },
      ];
    },
    tipps: (p) => [
      'Die Pinole ist eine Zahnstange. Die Kraft F wirkt am Umfang des grossen Rades: M_2 = F · d : 2.',
      `Zähnezahl des grossen Rades: z_2 = d : m = ${p.d} : ${fmt(p.mm)} = ${fmt(p.d / p.mm)}.`,
      'M_1 = M_2 · z_1 : z_2',
    ],
    loesung: (p) => {
      const M2 = (p.F * 1000 * p.d) / 2000, z2 = p.d / p.mm;
      return [
        `a) ${eq(m('M_2') + ' = ' + f(fmt(p.F * 1000) + ' N') + ' · ' + l(fmt(p.d / 2000, 3) + ' m') + ' = ' + m(fmt(M2) + ' Nm'))}`,
        `b) ${eq('z_2 = ' + p.d + ' : ' + fmt(p.mm) + ' = ' + fmt(z2))}, ${eq(m('M_1') + ' = ' + fmt(M2) + ' · ' + p.z1 + ' : ' + fmt(z2) + ' = ' + m(fmt((M2 * p.z1) / z2) + ' Nm'))}`,
        'Kontrolle: Am Zahneingriff wirkt dieselbe Umfangskraft wie an der Pinole, weil das grosse Rad beide berührt.',
      ];
    },
  }),

  task({
    id: 'u11', karte: 'mehrstufig', stufe: 2, familie: 'rechnen',
    title: 'Räderwinde', src: 'Buch Umfangskraft, Nr. 5',
    gen: () => ({ FG: pick([1.5, 2, 2.5]), dT: pick([160, 180, 200]), i: pick([3, 3.3, 4]), mm: 3, z1: pick([20, 25, 30]), l1: pick([250, 300, 350]) }),
    draw: (p) => B.winde(p, { F1: 'F_1 = ?', FG: `F_G = ${fmt(p.FG)} kN` }),
    text: (p) => `Mit einer Räderwinde soll eine Last ${f('F_G = ' + fmt(p.FG) + ' kN')} gehoben werden. Die Seiltrommel hat ${l('ø' + p.dT + ' mm')}. Wie gross sind a) das Drehmoment M_2 an der Seiltrommel, b) das Drehmoment M_1 an der Antriebswelle bei i = ${fmt(p.i)}, c) die Umfangskraft F_u an den Zahnflanken bei ${l('m = ' + p.mm + ' mm')} und z_1 = ${p.z1}, d) die Handkraft F_1 an der Kurbel mit ${l('l_1 = ' + p.l1 + ' mm')}?`,
    asks: (p) => {
      const M2 = (p.FG * p.dT) / 2, M1 = M2 / p.i;
      return [
        { k: 'a) M_2', unit: 'Nm', v: M2 },
        { k: 'b) M_1', unit: 'Nm', v: M1 },
        { k: 'c) F_u', unit: 'N', v: (2 * M1 * 1000) / (p.mm * p.z1) },
        { k: 'd) F_1', unit: 'N', v: (M1 * 1000) / p.l1 },
      ];
    },
    fehler: (p) => {
      const M2 = (p.FG * p.dT) / 2, M1 = M2 / p.i;
      return [
        { ask: 0, v: p.FG * p.dT, msg: 'Du hast den Durchmesser der Trommel als Hebelarm genommen. Das Seil zieht am Radius.' },
        { ask: 1, v: M2 * p.i, msg: 'Verkehrt herum. Das Getriebe untersetzt: Die Antriebswelle hat das kleinere Drehmoment.' },
        { ask: 2, v: (M1 * 1000) / (p.mm * p.z1), msg: 'Du hast d_1 als Hebelarm genommen. Der Hebelarm ist d_1 : 2, also muss im Zähler eine 2 stehen.' },
        { ask: 3, v: M1 / p.l1, msg: 'Die Kurbellänge steht in mm. Rechne M_1 in Nmm um (mal 1000).' },
      ];
    },
    tipps: () => [
      'Gehe von der Last zur Kurbel: Trommel, Getriebe, Kurbel.',
      'M_2 = F_G · d_T : 2, danach M_1 = M_2 : i',
      'd_1 = m · z_1, F_u = 2 · M_1 : d_1. Kurbel: M_1 = F_1 · l_1.',
    ],
    loesung: (p) => {
      const M2 = (p.FG * p.dT) / 2, M1 = M2 / p.i, d1 = p.mm * p.z1;
      return [
        `a) ${eq(m('M_2') + ' = ' + fmt(p.FG * 1000) + ' N · ' + fmt(p.dT / 2000, 3) + ' m = ' + m(fmt(M2) + ' Nm'))}`,
        `b) ${eq(m('M_1') + ' = ' + fmt(M2) + ' : ' + fmt(p.i) + ' = ' + m(fmt(M1) + ' Nm'))}`,
        `c) ${eq(l('d_1') + ' = ' + p.mm + ' · ' + p.z1 + ' = ' + d1 + ' mm')}, ${eq(f('F_u') + ' = 2 · ' + fmt(M1 * 1000) + ' Nmm : ' + d1 + ' mm = ' + f(fmt((2 * M1 * 1000) / d1) + ' N'))}`,
        `d) ${eq(f('F_1') + ' = ' + fmt(M1 * 1000) + ' Nmm : ' + p.l1 + ' mm = ' + f(fmt((M1 * 1000) / p.l1) + ' N'))}`,
        `Mit ${fmt((M1 * 1000) / p.l1)} N Handkraft hebt man ${fmt(p.FG * 1000)} N. Das ist die Wirkung von Kurbel und Getriebe.`,
      ];
    },
  }),

  task({
    id: 'u12', karte: 'mehrstufig', stufe: 3, familie: 'rechnen',
    title: 'Pkw-Antrieb mit Schaltgetriebe', src: 'Buch Umfangskraft, Nr. 6',
    gen: () => ({ M: pick([180, 220, 260]), n: 4200, iA: pick([3.38, 3.7]), rR: pick([290, 295, 310]), nmax: pick([6000, 6200, 6500]) }),
    draw: (p) => B.pkw(p),
    text: (p) => `Ein Pkw-Motor gibt sein grösstes Drehmoment ${m('M = ' + p.M + ' Nm')} ab. Das Schaltgetriebe hat die Übersetzungen 4,12 / 2,85 / 1,95 / 1,38 / 1,09 (Gang 1 bis 5). Das Ausgleichsgetriebe hat i_A = ${fmt(p.iA)}. Berechne a) die Gesamtübersetzungen in den Gängen 1 bis 5, b) die grösste Umfangskraft je Hinterrad im 1. und im 5. Gang bei ${l('r_R = ' + p.rR + ' mm')} und c) die Höchstgeschwindigkeit im 5. Gang bei n = ${p.nmax}/min.`,
    asks: (p) => {
      const G = GANG.map((x) => x * p.iA), Fu = (ig: number) => (p.M * ig) / 2 / (p.rR / 1000);
      return [
        ...G.map((x, i) => ({ k: `a) i_ges ${i + 1}. Gang`, unit: '', v: x })),
        { k: 'b) F_u 1. Gang', unit: 'N', v: Fu(G[0]) },
        { k: 'b) F_u 5. Gang', unit: 'N', v: Fu(G[4]) },
        { k: 'c) v 5. Gang', unit: 'km/h', v: (Math.PI * 2 * (p.rR / 1000) * p.nmax / G[4] * 60) / 1000 },
      ];
    },
    fehler: (p) => {
      const G = GANG.map((x) => x * p.iA), r = p.rR / 1000;
      return [
        { ask: 0, v: GANG[0] + p.iA, msg: 'Übersetzungen hintereinander werden multipliziert, nicht addiert.' },
        { ask: 5, v: (p.M * G[0]) / r, msg: 'Das Drehmoment verteilt sich auf zwei Hinterräder. Teile durch 2.' },
        { ask: 6, v: (p.M * G[4]) / r, msg: 'Das Drehmoment verteilt sich auf zwei Hinterräder. Teile durch 2.' },
        { ask: 7, v: (Math.PI * r * p.nmax / G[4] * 60) / 1000, msg: 'Der Weg pro Umdrehung ist der Umfang π · d, nicht π · r.' },
        { ask: 7, v: (Math.PI * 2 * r * p.nmax * 60) / 1000, msg: 'Die Räder drehen langsamer als der Motor. Teile die Motordrehzahl durch i_ges.' },
      ];
    },
    tipps: () => [
      'i_ges = i_Gang · i_A',
      'Das Drehmoment an der Hinterachse ist M · i_ges. Es verteilt sich auf zwei Räder. F_u = M_Rad : r_R.',
      'Raddrehzahl = n : i_ges. v = π · d · n_Rad mit d = 2 · r_R. Dann von m/min in km/h: mal 60 : 1000.',
    ],
    loesung: (p) => {
      const G = GANG.map((x) => x * p.iA), r = p.rR / 1000;
      const nR = p.nmax / G[4], v = Math.PI * 2 * r * nR;
      return [
        `a) ${G.map((x, i) => i + 1 + '. Gang: ' + GANG[i] + ' · ' + fmt(p.iA) + ' = ' + fmt(x, 2)).join('; ')}`,
        `b) 1. Gang: ${eq(m('M_Rad') + ' = ' + p.M + ' · ' + fmt(G[0], 3) + ' : 2 = ' + fmt((p.M * G[0]) / 2) + ' Nm')}, ${eq(f('F_u') + ' = ' + fmt((p.M * G[0]) / 2) + ' : ' + fmt(r, 3) + ' = ' + f(fmt((p.M * G[0]) / 2 / r) + ' N'))}`,
        `5. Gang: ${eq(f('F_u') + ' = ' + p.M + ' · ' + fmt(G[4], 3) + ' : 2 : ' + fmt(r, 3) + ' = ' + f(fmt((p.M * G[4]) / 2 / r) + ' N'))}`,
        `c) ${eq('n_Rad = ' + p.nmax + ' : ' + fmt(G[4], 3) + ' = ' + fmt(nR) + '/min')}, ${eq(vv('v') + ' = π · ' + fmt(2 * r, 2) + ' m · ' + fmt(nR) + '/min = ' + fmt(v) + ' m/min = ' + vv(fmt(v * 0.06) + ' km/h'))}`,
        'Kleiner Gang: grosse Zugkraft, kleine Geschwindigkeit. Grosser Gang: umgekehrt.',
      ];
    },
  }),

  task({
    id: 'u13', karte: 'mehrstufig', stufe: 3, familie: 'rechnen',
    title: 'Hubwerk mit zweistufigem Getriebe', src: 'Buch Umfangskraft, Nr. 7',
    gen: () => ({ z1: pick([15, 17]), z2: pick([51, 57]), z3: pick([19, 21]), z4: pick([60, 65]), FG: pick([2, 3, 4]), dT: pick([250, 280]), n: pick([550, 700, 950]) }),
    draw: (p) => B.hubwerk(p),
    text: (p) => `Die Seiltrommel (${l('ø' + p.dT + ' mm')}) eines Hubwerks wird über ein zweistufiges Getriebe angetrieben: z_1 = ${p.z1}, z_2 = ${p.z2}, z_3 = ${p.z3}, z_4 = ${p.z4}. Der Motor dreht mit n = ${p.n}/min. Gehoben werden höchstens ${f('F_G = ' + fmt(p.FG) + ' kN')}. Berechne a) die Drehzahl der Seiltrommel, b) die Hubgeschwindigkeit, c) das Drehmoment an der Seiltrommel und d) das Drehmoment am Motor.`,
    asks: (p) => {
      const i = (p.z2 / p.z1) * (p.z4 / p.z3), nT = p.n / i, MT = (p.FG * p.dT) / 2;
      return [
        { k: 'a) n_T', unit: '1/min', v: nT },
        { k: 'b) v', unit: 'm/min', v: Math.PI * (p.dT / 1000) * nT },
        { k: 'c) M_T', unit: 'Nm', v: MT },
        { k: 'd) M_Mot', unit: 'Nm', v: MT / i },
      ];
    },
    fehler: (p) => {
      const i = (p.z2 / p.z1) * (p.z4 / p.z3), nT = p.n / i, MT = (p.FG * p.dT) / 2;
      return [
        { ask: 0, v: p.n * i, msg: 'Verkehrt herum. Die Trommel dreht langsamer als der Motor.' },
        { ask: 0, v: p.n / (p.z2 / p.z1), msg: 'Das Getriebe hat zwei Stufen. Du hast nur die erste gerechnet.' },
        { ask: 1, v: Math.PI * p.dT * nT, msg: 'Der Durchmesser muss in Meter stehen, sonst kommt mm/min heraus.' },
        { ask: 2, v: p.FG * p.dT, msg: 'Du hast den Durchmesser als Hebelarm genommen. Das Seil zieht am Radius.' },
        { ask: 3, v: MT * i, msg: 'Verkehrt herum. Der schnelle Motor hat das kleinere Drehmoment.' },
      ];
    },
    tipps: () => [
      'Gesamtübersetzung zweistufig: i = (z_2 : z_1) · (z_4 : z_3).',
      'n_T = n : i und v = π · d_T · n_T',
      'M_T = F_G · d_T : 2 und M_Mot = M_T : i',
    ],
    loesung: (p) => {
      const i1 = p.z2 / p.z1, i2 = p.z4 / p.z3, i = i1 * i2, nT = p.n / i, MT = (p.FG * p.dT) / 2;
      return [
        `${eq('i = ' + p.z2 + '/' + p.z1 + ' · ' + p.z4 + '/' + p.z3 + ' = ' + fmt(i1, 3) + ' · ' + fmt(i2, 3) + ' = ' + fmt(i, 3))}`,
        `a) ${eq('n_T = ' + p.n + ' : ' + fmt(i, 3) + ' = ' + fmt(nT) + '/min')}`,
        `b) ${eq(vv('v') + ' = π · ' + fmt(p.dT / 1000, 3) + ' m · ' + fmt(nT) + '/min = ' + vv(fmt(Math.PI * (p.dT / 1000) * nT) + ' m/min'))}`,
        `c) ${eq(m('M_T') + ' = ' + fmt(p.FG * 1000) + ' N · ' + fmt(p.dT / 2000, 3) + ' m = ' + m(fmt(MT) + ' Nm'))}`,
        `d) ${eq(m('M_Mot') + ' = ' + fmt(MT) + ' : ' + fmt(i, 3) + ' = ' + m(fmt(MT / i) + ' Nm'))}`,
      ];
    },
  }),

  task({
    id: 'u14', karte: 'mehrstufig', stufe: 2, familie: 'umgekehrt',
    title: 'Räderwinde: Was schaffe ich von Hand?', src: 'Kreativ · Umgekehrt gefragt',
    gen: () => ({ F1: pick([120, 150, 180]), l1: pick([250, 300, 350]), i: pick([3, 3.3, 4, 5]), dT: pick([160, 180, 200]) }),
    draw: (p) => B.winde(p, { F1: `F_1 = ${p.F1} N`, FG: 'F_G = ?' }),
    text: (p) => `Du kannst an der Kurbel (${l('l_1 = ' + p.l1 + ' mm')}) dauernd ${f('F_1 = ' + p.F1 + ' N')} aufbringen. Die Übersetzung ist i = ${fmt(p.i)}, die Seiltrommel hat ${l('ø' + p.dT + ' mm')}. Welche Last F_G kannst du höchstens heben (ohne Reibung)? Welcher Masse entspricht das? (g = 9,81 m/s²)`,
    asks: (p) => {
      const FG = (p.F1 * p.l1 * p.i) / (p.dT / 2);
      return [{ k: 'F_G', unit: 'N', v: FG }, { k: 'm', unit: 'kg', v: FG / g }];
    },
    fehler: (p) => {
      const FG = (p.F1 * p.l1 * p.i) / (p.dT / 2);
      return [
        { ask: 0, v: (p.F1 * p.l1 * p.i) / p.dT, msg: 'Du hast den Durchmesser der Trommel als Hebelarm genommen. Das Seil zieht am Radius.' },
        { ask: 0, v: FG / (p.i * p.i), msg: 'Verkehrt herum. Das Getriebe verstärkt das Drehmoment: M_2 = i · M_1.' },
        { ask: 1, v: FG, msg: 'Das ist die Gewichtskraft in N. Die Masse folgt aus m = F_G : g.' },
      ];
    },
    tipps: () => [
      'Rückwärts rechnen: zuerst M_1 = F_1 · l_1.',
      'M_2 = i · M_1',
      'F_G = M_2 : (d_T : 2), danach m = F_G : g',
    ],
    loesung: (p) => {
      const M1 = (p.F1 * p.l1) / 1000, M2 = M1 * p.i, FG = M2 / (p.dT / 2000);
      return [
        `${eq(m('M_1') + ' = ' + p.F1 + ' N · ' + fmt(p.l1 / 1000, 3) + ' m = ' + fmt(M1) + ' Nm')}`,
        `${eq(m('M_2') + ' = ' + fmt(p.i) + ' · ' + fmt(M1) + ' = ' + fmt(M2) + ' Nm')}`,
        `${eq(f('F_G') + ' = ' + fmt(M2) + ' Nm : ' + fmt(p.dT / 2000, 3) + ' m = ' + f(fmt(FG) + ' N'))}`,
        `${eq('m = ' + fmt(FG) + ' N : 9,81 m/s² = ' + fmt(FG / g) + ' kg')}`,
        'Wie bei der Räderwinde im Buch, nur in umgekehrter Richtung gerechnet.',
      ];
    },
  }),

  task({
    id: 'u16', karte: 'mehrstufig', stufe: 3, familie: 'kette',
    title: 'Zahnrad auf der Welle: Umfangskraft und Lagerkräfte', src: 'Kreativ · Themen kombiniert',
    gen: () => ({ M: pick([60, 90, 120, 150]), d: pick([100, 120, 150]), l: pick([400, 500, 600]), a: pick([100, 120, 150]) }),
    draw: (p) => B.welle(p),
    loesungsbild: (p) => {
      const Fu = (2000 * p.M) / p.d, FB = (Fu * p.a) / p.l;
      return B.welle(p, { Fu: `F_u = ${fmt(Fu)} N`, RA: `F_A = ${fmt(Fu - FB)} N`, RB: `F_B = ${fmt(FB)} N` });
    },
    text: (p) => `Ein Motor treibt eine Welle mit ${m('M = ' + p.M + ' Nm')} an. Auf der Welle sitzt ein Zahnrad mit ${l('d = ' + p.d + ' mm')}. Das Gegenrad drückt mit der Umfangskraft F_u senkrecht auf das Zahnrad. Die Lager A und B haben den Abstand ${l('l = ' + p.l + ' mm')}, das Zahnrad sitzt ${l('a = ' + p.a + ' mm')} neben A. Berechne a) die Umfangskraft F_u und b) die Lagerkräfte F_A und F_B.`,
    asks: (p) => {
      const Fu = (2000 * p.M) / p.d;
      return [
        { k: 'a) F_u', unit: 'N', v: Fu },
        { k: 'b) F_A', unit: 'N', v: (Fu * (p.l - p.a)) / p.l },
        { k: 'b) F_B', unit: 'N', v: (Fu * p.a) / p.l },
      ];
    },
    fehler: (p) => {
      const Fu = (2000 * p.M) / p.d;
      return [
        { ask: 0, v: (1000 * p.M) / p.d, msg: 'Du hast den Durchmesser als Hebelarm genommen. Der Hebelarm ist der Radius d : 2.' },
        { ask: 1, v: (Fu * p.a) / p.l, msg: 'Die Hebelarme sind vertauscht. Das Lager A liegt näher am Zahnrad und trägt mehr.' },
        { ask: 2, v: (Fu * (p.l - p.a)) / p.l, msg: 'Die Hebelarme sind vertauscht. Das Lager B liegt weiter weg und trägt weniger.' },
        { ask: 2, v: Fu, msg: 'Beide Lager teilen sich die Kraft. B trägt nur einen Teil von F_u.' },
      ];
    },
    tipps: () => [
      'Zuerst die Umfangskraft: F_u = 2 · M : d. Sie ist die Last für die Lagerrechnung.',
      'Drehpunkt in A: F_B · l = F_u · a',
      'F_A = F_u − F_B',
    ],
    loesung: (p) => {
      const Fu = (2000 * p.M) / p.d, FB = (Fu * p.a) / p.l;
      return [
        `a) ${eq(f('F_u') + ' = 2 · ' + p.M * 1000 + ' Nmm : ' + p.d + ' mm = ' + f(fmt(Fu) + ' N'))}`,
        `b) Drehpunkt in A: ${eq(f('F_B') + ' = ' + fmt(Fu) + ' · ' + p.a + ' : ' + p.l + ' = ' + f(fmt(FB) + ' N'))}`,
        `${eq(f('F_A') + ' = ' + fmt(Fu) + ' − ' + fmt(FB) + ' = ' + f(fmt(Fu - FB) + ' N'))}`,
        'Zwei Kapitel in einer Aufgabe: Die Umfangskraft ist die Last für die Lagerrechnung. So rechnet man Getriebewellen.',
      ];
    },
  }),

  // ---------- Fehler finden und prüfen ----------

  task({
    id: 'u15', karte: 'pruefen', stufe: 2, familie: 'fehler',
    title: 'Schneckengetriebe: Wo steckt der Fehler?', src: 'Kreativ · Fehler finden',
    gen: () => ({ z1: pick([1, 2]), z2: pick([30, 40, 50]), n1: 1440, M2: pick([60, 90, 120]) }),
    draw: (p) => B.schnecke(p),
    text: (p) => {
      const i = p.z2 / p.z1;
      return `Ein Lernender rechnet für dieses Schneckengetriebe das Motordrehmoment so:<br>Zeile 1: ${eq('i = ' + p.z2 + ' : ' + p.z1 + ' = ' + fmt(i))}<br>Zeile 2: ${eq(m('M_1') + ' = i · ' + m('M_2') + ' = ' + fmt(i) + ' · ' + p.M2 + ' = ' + fmt(i * p.M2) + ' Nm')}<br>Finde den Fehler. Wie gross sind das richtige M_1 und die Abtriebsdrehzahl n_2 (n_1 = ${p.n1}/min)?`;
    },
    asks: (p) => [
      { k: 'M_1', unit: 'Nm', v: (p.M2 * p.z1) / p.z2 },
      { k: 'n_2', unit: '1/min', v: (p.n1 * p.z1) / p.z2 },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.M2 * p.z2) / p.z1, msg: 'Das ist der Fehler aus Zeile 2. Der schnelle Motor kann nicht das grössere Drehmoment haben als die langsame Welle.' },
      { ask: 1, v: (p.n1 * p.z2) / p.z1, msg: 'Verkehrt herum. Das Schneckenrad dreht viel langsamer als der Motor.' },
    ],
    tipps: () => [
      'Mach den Plausibilitätstest: Das Getriebe untersetzt stark. Muss der Motor mehr oder weniger Drehmoment liefern als die Abtriebswelle?',
      'Langsame Welle = grosses Drehmoment. Also M_1 = M_2 : i.',
      'n_2 = n_1 : i',
    ],
    loesung: (p) => {
      const i = p.z2 / p.z1;
      return [
        'Fehler in Zeile 2: Es wurde mit i multipliziert statt dividiert. Dann hätte der schnelle Motor ein grösseres Drehmoment als die langsame Welle. Das ist unmöglich.',
        `${eq(m('M_1') + ' = ' + m('M_2') + ' : i = ' + p.M2 + ' : ' + fmt(i) + ' = ' + m(fmt(p.M2 / i, 3) + ' Nm'))}`,
        `${eq('n_2 = ' + p.n1 + ' : ' + fmt(i) + ' = ' + fmt(p.n1 / i) + '/min')}`,
        'Merksatz: Drehmomente verhalten sich wie die Zähnezahlen, aber umgekehrt wie die Drehzahlen.',
      ];
    },
  }),

  task({
    id: 'u17', karte: 'pruefen', stufe: 1, familie: 'schaetzen',
    title: 'Getriebe im Kopf rechnen', src: 'Kreativ · Abschätzen, ohne Taschenrechner',
    gen: () => ({ z1: pick([10, 15, 20]), k: pick([2, 3, 4, 5]), M1: pick([20, 30, 40, 50]), n1: pick([600, 900, 1200, 1500]) }),
    draw: (p) => B.zahnradpaar({ z1: p.z1, z2: p.z1 * p.k, M1: p.M1 }),
    text: (p) => `Ohne Taschenrechner: Ein Ritzel mit z_1 = ${p.z1} treibt ein Rad mit z_2 = ${p.z1 * p.k}. Das Ritzel dreht mit n_1 = ${p.n1}/min und ${m('M_1 = ' + p.M1 + ' Nm')}. Wie gross sind n_2 und M_2?`,
    asks: (p) => [
      { k: 'n_2', unit: '1/min', v: p.n1 / p.k },
      { k: 'M_2', unit: 'Nm', v: p.M1 * p.k },
    ],
    fehler: (p) => [
      { ask: 0, v: p.n1 * p.k, msg: 'Das grosse Rad dreht langsamer als das Ritzel. Du musst teilen.' },
      { ask: 1, v: p.M1 / p.k, msg: 'Das grosse Rad hat das grössere Drehmoment. Du musst multiplizieren.' },
    ],
    tipps: (p) => [`Wie oft passt z_1 in z_2? Das ist i = ${p.k}.`, 'Die Drehzahl wird i-mal kleiner, das Drehmoment i-mal grösser.', 'n_2 = n_1 : i und M_2 = i · M_1'],
    loesung: (p) => [
      `${eq('i = ' + p.z1 * p.k + ' : ' + p.z1 + ' = ' + p.k)}`,
      `${eq('n_2 = ' + p.n1 + ' : ' + p.k + ' = ' + fmt(p.n1 / p.k) + '/min')}, ${eq(m('M_2') + ' = ' + p.k + ' · ' + p.M1 + ' = ' + m(p.M1 * p.k + ' Nm'))}`,
      'Plausibel? Langsameres Rad heisst grösseres Drehmoment. Das Produkt M · n bleibt gleich (ohne Verluste).',
    ],
  }),

  task({
    id: 'u21', karte: 'pruefen', stufe: 1, familie: 'fehler',
    title: 'Fehler finden: Bens Umfangskraft',
    gen: () => ({ M: pick([30, 40, 50, 60, 80]), d: pick([100, 120, 160, 200]) }),
    draw: (p) => B.rad(p, { typ: 'riemen', M: `M = ${p.M} Nm`, Fu: 'F_u = ?' }),
    text: (p) => `Ben rechnet die Umfangskraft einer Riemenscheibe mit M = ${p.M} Nm und d = ${p.d} mm: «F_u = ${p.M} Nm : ${fmt(p.d / 1000, 3)} m = ${fmt((1000 * p.M) / p.d)} N». Was ist falsch?`,
    asks: (p) => [{
      kind: 'choice', k: 'Fehler',
      opts: [
        `Er hat den Durchmesser statt den Radius genommen. Richtig sind ${fmt((2000 * p.M) / p.d)} N.`,
        'Er hätte M mit d multiplizieren müssen.',
        'Er hätte d in mm einsetzen müssen.',
        'Nichts, die Rechnung stimmt.',
      ],
      a: 0,
      why: [
        undefined,
        'Das Drehmoment ist Kraft mal Hebelarm. Für die Kraft musst du teilen.',
        'Mit mm käme ein 1000-mal falsches Resultat heraus. Meter ist richtig.',
        `Mach die Probe: ${fmt((1000 * p.M) / p.d)} N · ${fmt(p.d / 2000, 3)} m = ${fmt(p.M / 2)} Nm. Das sind nur halb so viel wie ${p.M} Nm.`,
      ],
    }],
    tipps: () => ['Mach die Probe: Kraft mal Hebelarm muss wieder das Drehmoment geben.', 'Der Hebelarm der Umfangskraft ist der Radius.', 'Ben hat mit d statt mit d : 2 gerechnet.'],
    loesung: (p) => [
      `Der Hebelarm ist der Radius: ${eq(l('d : 2 = ' + fmt(p.d / 2000, 3) + ' m'))}`,
      `${eq(f('F_u') + ' = ' + m(p.M + ' Nm') + ' : ' + l(fmt(p.d / 2000, 3) + ' m') + ' = ' + f(fmt((2000 * p.M) / p.d) + ' N'))}`,
      'Merke: Immer die Probe machen. F_u · d : 2 muss wieder M ergeben.',
    ],
  }),
] as Task[];
