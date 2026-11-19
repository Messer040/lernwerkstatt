// Aufgaben zum Kapitel Drehmoment und Hebelgesetz.
import { task, type Task } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import * as B from './bilder';

const g = 9.81;
const rad = (a: number) => (a * Math.PI) / 180;

export const AUFGABEN: Task[] = [
  task({
    id: 'd1', karte: 'moment', stufe: 1, familie: 'rechnen',
    title: 'Schraubenschlüssel: Drehmoment berechnen',
    gen: () => ({ F: rng(80, 250, 10), l: rng(150, 400, 25) }),
    draw: (p) => B.schluessel(p, 'M'),
    text: (p) => `Ein Monteur zieht eine Schraube an. Er drückt mit ${f('F = ' + p.F + ' N')} senkrecht auf den Schlüssel. Der Hebelarm ist ${l('l = ' + p.l + ' mm')}. Wie gross ist das Drehmoment M?`,
    asks: (p) => [{ k: 'M', unit: 'Nm', v: (p.F * p.l) / 1000 }],
    fehler: (p) => [
      { ask: 0, v: p.F / (p.l / 1000), msg: 'Drehmoment heisst Kraft <b>mal</b> Hebelarm, nicht geteilt.' },
    ],
    tipps: (p) => [
      'Das Drehmoment ist Kraft mal Hebelarm.',
      `Rechne den Hebelarm zuerst in Meter um: ${p.l} mm = ${fmt(p.l / 1000, 3)} m.`,
      `M = ${p.F} N · ${fmt(p.l / 1000, 3)} m`,
    ],
    loesung: (p) => [
      `Formel: ${eq(m('M') + ' = ' + f('F') + ' · ' + l('l'))}`,
      `Hebelarm in Meter: ${l(p.l + ' mm = ' + fmt(p.l / 1000, 3) + ' m')}`,
      `Einsetzen: ${eq(m('M') + ' = ' + f(p.F + ' N') + ' · ' + l(fmt(p.l / 1000, 3) + ' m'))}`,
      `Resultat: ${eq(m('M = ' + fmt((p.F * p.l) / 1000) + ' Nm'))}`,
      'Vorstellung: Doppelter Hebelarm ergibt doppeltes Drehmoment bei gleicher Kraft.',
    ],
  }),

  task({
    id: 'd2', karte: 'moment', stufe: 1, familie: 'umgekehrt',
    title: 'Schraubenschlüssel: Kraft berechnen',
    gen: () => ({ M: rng(20, 120, 10), l: rng(200, 400, 25) }),
    draw: (p) => B.schluessel(p, 'F'),
    text: (p) => `Eine Schraube soll mit ${m('M = ' + p.M + ' Nm')} angezogen werden. Der Schlüssel hat den Hebelarm ${l('l = ' + p.l + ' mm')}. Welche Kraft F ist nötig?`,
    asks: (p) => [{ k: 'F', unit: 'N', v: (p.M * 1000) / p.l }],
    fehler: (p) => [{ ask: 0, v: (p.M * p.l) / 1000, msg: 'Du hast M mal l gerechnet. Für die Kraft musst du M <b>durch</b> l teilen.' }],
    tipps: (p) => [
      'Stelle M = F · l nach F um.',
      'F = M : l. Der Hebelarm muss in Meter stehen.',
      `F = ${p.M} Nm : ${fmt(p.l / 1000, 3)} m`,
    ],
    loesung: (p) => [
      `Formel umstellen: ${eq(f('F') + ' = ' + m('M') + ' : ' + l('l'))}`,
      `Einsetzen: ${eq(f('F') + ' = ' + m(p.M + ' Nm') + ' : ' + l(fmt(p.l / 1000, 3) + ' m'))}`,
      `Resultat: ${eq(f('F = ' + fmt((p.M * 1000) / p.l) + ' N'))}`,
      'Vorstellung: Ein längerer Schlüssel braucht weniger Kraft für dasselbe Drehmoment.',
    ],
  }),

  task({
    id: 'd3', karte: 'gleichgewicht', stufe: 1, familie: 'rechnen',
    title: 'Zweiseitiger Hebel: Brechstange',
    gen: () => ({ F1: rng(600, 2400, 200), l1: rng(150, 300, 50), l2: rng(600, 1000, 100) }),
    draw: (p) => B.hebel({ l1: p.l1, lr: p.l2 }, { kiste: true, f1: `F_1 = ${p.F1} N`, d1: `l_1 = ${p.l1}`, rechts: [[p.l2, 'F_2 = ?']], masse: [[p.l2, `l_2 = ${p.l2}`, 0]] }),
    text: (p) => `Eine Kiste drückt mit ${f('F₁ = ' + p.F1 + ' N')} auf das kurze Ende einer Brechstange. Die Hebelarme sind ${l('l₁ = ' + p.l1 + ' mm')} und ${l('l₂ = ' + p.l2 + ' mm')}. Mit welcher Kraft F₂ muss man drücken, damit Gleichgewicht herrscht?`,
    asks: (p) => [{ k: 'F₂', unit: 'N', v: (p.F1 * p.l1) / p.l2 }],
    fehler: (p) => [{ ask: 0, v: (p.F1 * p.l2) / p.l1, msg: 'Die Hebelarme sind vertauscht. Die grosse Kraft gehört zum kurzen Arm.' }],
    tipps: () => [
      'Im Gleichgewicht gilt: linksdrehendes Moment = rechtsdrehendes Moment.',
      'F₁ · l₁ = F₂ · l₂',
      'F₂ = F₁ · l₁ : l₂. Die Einheit mm kürzt sich weg.',
    ],
    loesung: (p) => [
      `Hebelgesetz: ${eq(f('F₁') + ' · ' + l('l₁') + ' = ' + f('F₂') + ' · ' + l('l₂'))}`,
      `Umstellen: ${eq(f('F₂') + ' = ' + f('F₁') + ' · ' + l('l₁') + ' : ' + l('l₂'))}`,
      `Einsetzen: ${eq(f('F₂') + ' = ' + f(p.F1 + ' N') + ' · ' + l(p.l1 + ' mm') + ' : ' + l(p.l2 + ' mm'))}`,
      `Resultat: ${eq(f('F₂ = ' + fmt((p.F1 * p.l1) / p.l2) + ' N'))}`,
      'Die Einheit mm kürzt sich weg. Umrechnen ist hier nicht nötig.',
    ],
  }),

  task({
    id: 'd4', karte: 'einseitig', stufe: 2, familie: 'rechnen',
    title: 'Einseitiger Hebel: Schubkarre',
    gen: () => ({ m: rng(40, 90, 10), l1: rng(300, 500, 50), l2: rng(1000, 1400, 100) }),
    draw: B.schubkarre,
    text: (p) => `Eine Schubkarre ist mit m = ${p.m} kg beladen. Der Schwerpunkt der Last liegt ${l('l₁ = ' + p.l1 + ' mm')} hinter der Radachse D. Die Griffe sind ${l('l₂ = ' + p.l2 + ' mm')} von D entfernt. Berechne a) die Gewichtskraft F_G und b) die Kraft F an den Griffen. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) F_G', unit: 'N', v: p.m * g },
      { k: 'b) F', unit: 'N', v: (p.m * g * p.l1) / p.l2 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.m, msg: 'Die Masse ist noch keine Kraft. Rechne F_G = m · g.' },
      { ask: 1, v: (p.m * g * p.l2) / p.l1, msg: 'Die Hebelarme sind vertauscht. Die Last liegt näher am Rad als die Griffe.' },
      { ask: 1, v: (p.m * p.l1) / p.l2, msg: 'Du hast mit der Masse statt mit der Gewichtskraft gerechnet.' },
    ],
    tipps: () => [
      'Zuerst die Gewichtskraft: F_G = m · g.',
      'Drehpunkt ist die Radachse D. Beide Kräfte greifen auf derselben Seite an: einseitiger Hebel.',
      'F · l₂ = F_G · l₁',
    ],
    loesung: (p) => {
      const FG = p.m * g;
      return [
        `Gewichtskraft: ${eq(f('F_G') + ' = m · g = ' + p.m + ' kg · 9,81 m/s² = ' + f(fmt(FG) + ' N'))}`,
        `Hebelgesetz um D: ${eq(f('F') + ' · ' + l('l₂') + ' = ' + f('F_G') + ' · ' + l('l₁'))}`,
        `Umstellen und einsetzen: ${eq(f('F') + ' = ' + f(fmt(FG) + ' N') + ' · ' + l(p.l1 + ' mm') + ' : ' + l(p.l2 + ' mm'))}`,
        `Resultat: ${eq(f('F = ' + fmt((FG * p.l1) / p.l2) + ' N'))}`,
        'Vorstellung: Das Rad trägt den Rest der Last. Je näher die Last am Rad liegt, desto leichter wird es an den Griffen.',
      ];
    },
  }),

  task({
    id: 'd5', karte: 'gleichgewicht', stufe: 2, familie: 'rechnen',
    title: 'Hebel mit drei Kräften',
    gen: () => ({ F1: rng(400, 800, 100), l1: pick([300, 400, 500]), F2: pick([100, 150, 200]), l2: pick([200, 300]), l3: pick([500, 600]) }),
    draw: (p) => B.hebel({ l1: p.l1, lr: p.l3 }, { f1: `F_1 = ${p.F1} N`, d1: `l_1 = ${p.l1}`, rechts: [[p.l2, `F_2 = ${p.F2} N`], [p.l3, 'F_3 = ?']], masse: [[p.l2, `l_2 = ${p.l2}`, 0], [p.l3, `l_3 = ${p.l3}`, 1]] }),
    text: (p) => `An einem Hebel greifen drei Kräfte an: links ${f('F₁ = ' + p.F1 + ' N')} mit ${l('l₁ = ' + p.l1 + ' mm')}, rechts ${f('F₂ = ' + p.F2 + ' N')} mit ${l('l₂ = ' + p.l2 + ' mm')} und F₃ mit ${l('l₃ = ' + p.l3 + ' mm')}. Wie gross muss F₃ sein, damit Gleichgewicht herrscht?`,
    asks: (p) => [{ k: 'F₃', unit: 'N', v: (p.F1 * p.l1 - p.F2 * p.l2) / p.l3 }],
    fehler: (p) => [
      { ask: 0, v: (p.F1 * p.l1 + p.F2 * p.l2) / p.l3, msg: 'F₂ dreht in die gleiche Richtung wie F₃. Ihr Moment hilft also mit und wird abgezogen, nicht addiert.' },
      { ask: 0, v: (p.F1 * p.l1) / p.l3, msg: 'Du hast F₂ vergessen. Alle Momente zählen.' },
    ],
    tipps: () => [
      'Summe aller linksdrehenden Momente = Summe aller rechtsdrehenden Momente.',
      'F₁ · l₁ = F₂ · l₂ + F₃ · l₃',
      'F₃ = (F₁ · l₁ − F₂ · l₂) : l₃',
    ],
    loesung: (p) => {
      const ML = (p.F1 * p.l1) / 1000, M2 = (p.F2 * p.l2) / 1000, F3 = (p.F1 * p.l1 - p.F2 * p.l2) / p.l3;
      return [
        `Hebelgesetz: ${eq('Σ ' + m('M links') + ' = Σ ' + m('M rechts'))}`,
        `Ausgeschrieben: ${eq(f('F₁') + ' · ' + l('l₁') + ' = ' + f('F₂') + ' · ' + l('l₂') + ' + ' + f('F₃') + ' · ' + l('l₃'))}`,
        `Linksdrehend: ${eq(m('M₁') + ' = ' + p.F1 + ' N · ' + fmt(p.l1 / 1000, 2) + ' m = ' + m(fmt(ML) + ' Nm'))}`,
        `Rechtsdrehend von F₂: ${eq(m('M₂') + ' = ' + p.F2 + ' N · ' + fmt(p.l2 / 1000, 2) + ' m = ' + m(fmt(M2) + ' Nm'))}`,
        `Für F₃ bleibt: ${eq(m('M₃') + ' = ' + fmt(ML) + ' Nm − ' + fmt(M2) + ' Nm = ' + m(fmt(ML - M2) + ' Nm'))}`,
        `Resultat: ${eq(f('F₃') + ' = ' + m(fmt(ML - M2) + ' Nm') + ' : ' + l(fmt(p.l3 / 1000, 2) + ' m') + ' = ' + f(fmt(F3) + ' N'))}`,
      ];
    },
  }),

  task({
    id: 'd6', karte: 'einseitig', stufe: 2, familie: 'rechnen',
    title: 'Bremspedal mit Hauptzylinder',
    gen: () => ({ FP: rng(80, 150, 10), l1: rng(220, 300, 10), l2: rng(50, 80, 5) }),
    draw: B.pedal,
    text: (p) => `Der Fahrer drückt mit ${f('F_P = ' + p.FP + ' N')} auf das Bremspedal. Das Pedal dreht um D. Die Hebelarme sind ${l('l₁ = ' + p.l1 + ' mm')} und ${l('l₂ = ' + p.l2 + ' mm')}. Wie gross ist die Kraft F_K an der Druckstange?`,
    asks: (p) => [{ k: 'F_K', unit: 'N', v: (p.FP * p.l1) / p.l2 }],
    fehler: (p) => [{ ask: 0, v: (p.FP * p.l2) / p.l1, msg: 'Die Hebelarme sind vertauscht. Das Pedal soll die Kraft verstärken, nicht schwächen.' }],
    tipps: () => [
      'Beide Hebelarme werden vom Drehpunkt D aus gemessen.',
      'F_P · l₁ = F_K · l₂',
      'F_K = F_P · l₁ : l₂',
    ],
    loesung: (p) => [
      `Hebelgesetz um D: ${eq(f('F_P') + ' · ' + l('l₁') + ' = ' + f('F_K') + ' · ' + l('l₂'))}`,
      `Umstellen: ${eq(f('F_K') + ' = ' + f('F_P') + ' · ' + l('l₁') + ' : ' + l('l₂'))}`,
      `Einsetzen: ${eq(f('F_K') + ' = ' + f(p.FP + ' N') + ' · ' + l(p.l1 + ' mm') + ' : ' + l(p.l2 + ' mm'))}`,
      `Resultat: ${eq(f('F_K = ' + fmt((p.FP * p.l1) / p.l2) + ' N'))}`,
      `Vorstellung: Das Pedal verstärkt die Fusskraft um den Faktor l₁ : l₂ = ${fmt(p.l1 / p.l2)}.`,
    ],
  }),

  task({
    id: 'd7', karte: 'einseitig', stufe: 2, familie: 'rechnen',
    title: 'Seilwinde mit Handkurbel',
    gen: () => ({ FG: rng(400, 900, 100), L: rng(300, 450, 50), R: rng(80, 120, 10) }),
    draw: B.winde,
    text: (p) => `An einer Seilwinde hängt eine Last mit ${f('F_G = ' + p.FG + ' N')}. Die Trommel hat den Radius ${l('R = ' + p.R + ' mm')}. Die Kurbel hat die Länge ${l('L = ' + p.L + ' mm')}. Welche Handkraft F_H hält die Last im Gleichgewicht?`,
    asks: (p) => [{ k: 'F_H', unit: 'N', v: (p.FG * p.R) / p.L }],
    fehler: (p) => [
      { ask: 0, v: (p.FG * p.L) / p.R, msg: 'Die Hebelarme sind vertauscht. Die Kurbel ist länger als der Trommelradius, also braucht die Hand weniger Kraft.' },
      { ask: 0, v: (p.FG * 2 * p.R) / p.L, msg: 'Du hast den Durchmesser genommen. Das Seil zieht am Radius R.' },
    ],
    tipps: () => [
      'Drehpunkt ist die Trommelachse. Das Seil zieht am Trommelradius R.',
      'F_H · L = F_G · R',
      'F_H = F_G · R : L',
    ],
    loesung: (p) => [
      `Hebelgesetz um die Trommelachse: ${eq(f('F_H') + ' · ' + l('L') + ' = ' + f('F_G') + ' · ' + l('R'))}`,
      `Umstellen: ${eq(f('F_H') + ' = ' + f('F_G') + ' · ' + l('R') + ' : ' + l('L'))}`,
      `Einsetzen: ${eq(f('F_H') + ' = ' + f(p.FG + ' N') + ' · ' + l(p.R + ' mm') + ' : ' + l(p.L + ' mm'))}`,
      `Resultat: ${eq(f('F_H = ' + fmt((p.FG * p.R) / p.L) + ' N'))}`,
      'Vorstellung: Der Radius der Trommel ist der Hebelarm der Last. Die Kurbel ist der Hebelarm der Hand.',
    ],
  }),

  task({
    id: 'd8', karte: 'kombi', stufe: 3, familie: 'kette',
    title: 'Sicherheitsventil mit Hebel und Gewicht',
    gen: () => ({ p: rng(4, 10, 1), d: pick([30, 40, 50]), a: pick([80, 100, 120]), b: pick([400, 450, 500, 600]) }),
    draw: B.ventil,
    text: (p) => `Ein Dampfkessel steht unter dem Druck p = ${p.p} bar. Das Ventil hat den Durchmesser d = ${p.d} mm. Es soll genau bei diesem Druck öffnen. Die Hebelarme sind ${l('a = ' + p.a + ' mm')} und ${l('b = ' + p.b + ' mm')}. Berechne a) die Kraft F_V des Dampfes auf das Ventil und b) die nötige Gewichtskraft F_G. (Das Eigengewicht des Hebels wird vernachlässigt.)`,
    asks: (p) => {
      const FV = (p.p * 0.1 * Math.PI * p.d * p.d) / 4;
      return [
        { k: 'a) F_V', unit: 'N', v: FV },
        { k: 'b) F_G', unit: 'N', v: (FV * p.a) / p.b },
      ];
    },
    fehler: (p) => {
      const FV = (p.p * 0.1 * Math.PI * p.d * p.d) / 4;
      return [
        { ask: 0, v: FV * 10, msg: 'Der Druck ist noch in bar. 1 bar = 0,1 N/mm².' },
        { ask: 0, v: FV * 4, msg: 'Bei der Kreisfläche fehlt «: 4». A = π · d² : 4.' },
        { ask: 1, v: (FV * p.b) / p.a, msg: 'Die Hebelarme sind vertauscht. Das Gewicht hängt weiter aussen, also genügt weniger Kraft.' },
      ];
    },
    tipps: () => [
      'Schritt 1: Kraft aus Druck, F = p · A. Schritt 2: Hebelgesetz um D.',
      'Die Ventilfläche ist ein Kreis: A = π · d² : 4. Und 1 bar = 0,1 N/mm².',
      'F_V = p · A, danach F_G · b = F_V · a',
    ],
    loesung: (p) => {
      const A = (Math.PI * p.d * p.d) / 4, FV = p.p * 0.1 * A;
      return [
        `Ventilfläche: ${eq('A = π · d² : 4 = π · (' + p.d + ' mm)² : 4 = ' + fmt(A) + ' mm²')}`,
        `Druck umrechnen: ${eq('p = ' + p.p + ' bar = ' + fmt(p.p * 0.1, 1) + ' N/mm²')}`,
        `Kraft des Dampfes: ${eq(f('F_V') + ' = p · A = ' + fmt(p.p * 0.1, 1) + ' N/mm² · ' + fmt(A) + ' mm² = ' + f(fmt(FV) + ' N'))}`,
        `Hebelgesetz um D: ${eq(f('F_G') + ' · ' + l('b') + ' = ' + f('F_V') + ' · ' + l('a'))}`,
        `Einsetzen: ${eq(f('F_G') + ' = ' + f(fmt(FV) + ' N') + ' · ' + l(p.a + ' mm') + ' : ' + l(p.b + ' mm'))}`,
        `Resultat: ${eq(f('F_G = ' + fmt((FV * p.a) / p.b) + ' N'))}`,
        'Vorstellung: Der Dampf drückt nahe am Drehpunkt. Das Gewicht hängt weit aussen. Darum genügt ein kleines Gewicht.',
      ];
    },
  }),

  task({
    id: 'd9', karte: 'moment', stufe: 3, familie: 'bild',
    title: 'Schräge Kraft: wirksamer Hebelarm',
    gen: () => ({ F: rng(100, 300, 20), L: pick([200, 250, 300]), al: pick([30, 60]) }),
    draw: (p) => B.schraeg(p, false),
    loesungsbild: (p) => B.schraeg(p, true),
    text: (p) => `Die Kraft ${f('F = ' + p.F + ' N')} greift am Ende eines Schlüssels mit der Länge L = ${p.L} mm an. Sie wirkt schräg, unter α = ${p.al}° zum Schlüssel. Berechne a) den wirksamen Hebelarm l und b) das Drehmoment M.`,
    asks: (p) => {
      const le = p.L * Math.sin(rad(p.al));
      return [
        { k: 'a) l', unit: 'mm', v: le },
        { k: 'b) M', unit: 'Nm', v: (p.F * le) / 1000 },
      ];
    },
    fehler: (p) => [
      { ask: 0, v: p.L * Math.cos(rad(p.al)), msg: 'Kosinus statt Sinus. Der Hebelarm liegt dem Winkel α gegenüber.' },
      { ask: 0, v: p.L, msg: 'Das ist die ganze Schlüssellänge. Der wirksame Hebelarm ist der senkrechte Abstand zur Wirkungslinie.' },
      { ask: 1, v: (p.F * p.L) / 1000, msg: 'Du hast mit der ganzen Länge L gerechnet. Bei schräger Kraft zählt nur der wirksame Hebelarm l.' },
    ],
    tipps: () => [
      'Der Hebelarm ist der senkrechte Abstand vom Drehpunkt D zur Wirkungslinie der Kraft.',
      'Im Bild entsteht ein rechtwinkliges Dreieck mit der Hypotenuse L.',
      'l = L · sin α, danach M = F · l',
    ],
    loesung: (p) => {
      const le = p.L * Math.sin(rad(p.al));
      return [
        'Der Hebelarm steht immer senkrecht auf der Wirkungslinie. Im Bild ist er blau gestrichelt.',
        `Rechtwinkliges Dreieck: ${eq(l('l') + ' = L · sin α = ' + p.L + ' mm · sin ' + p.al + '° = ' + l(fmt(le) + ' mm'))}`,
        `Drehmoment: ${eq(m('M') + ' = ' + f('F') + ' · ' + l('l') + ' = ' + f(p.F + ' N') + ' · ' + l(fmt(le / 1000, 3) + ' m'))}`,
        `Resultat: ${eq(m('M = ' + fmt((p.F * le) / 1000) + ' Nm'))}`,
        `Vergleich: Senkrecht (α = 90°) wäre M = ${fmt((p.F * p.L) / 1000)} Nm. Schräg ziehen verschenkt Drehmoment.`,
      ];
    },
  }),

  // ---------- neue Familien ----------

  task({
    id: 'd10', karte: 'moment', stufe: 1, familie: 'fehler',
    title: 'Fehler finden: Lenas Drehmoment',
    gen: () => ({ F: rng(100, 200, 10), l: pick([250, 300, 400]) }),
    draw: (p) => B.schluessel(p, 'M'),
    text: (p) => `Lena rechnet das Drehmoment am Schlüssel aus: «M = ${p.F} N · ${p.l} mm = ${fmt(p.F * p.l)} Nm». Was ist falsch?`,
    asks: (p) => [{
      kind: 'choice', k: 'Fehler',
      opts: [
        `Sie hat mm nicht in m umgerechnet. Richtig ist M = ${fmt((p.F * p.l) / 1000)} Nm.`,
        'Sie hätte F durch l teilen müssen.',
        'Sie hätte den doppelten Hebelarm nehmen müssen.',
        'Nichts, die Rechnung stimmt.',
      ],
      a: 0,
      why: [undefined, 'M = F · l bleibt richtig. Das Problem ist die Einheit.', 'Der Hebelarm geht vom Drehpunkt bis zur Kraft. Er wird nicht verdoppelt.', `Ein Monteur schafft mit der Hand etwa 20 bis 100 Nm. ${fmt(p.F * p.l)} Nm ist viel zu gross.`],
    }],
    tipps: () => ['Schau auf die Einheiten in Lenas Rechnung.', 'N · mm ergibt Nmm, nicht Nm.', '1 Nm = 1000 Nmm'],
    loesung: (p) => [
      `N · mm ergibt ${m('Nmm')}. Lena hat ${fmt(p.F * p.l)} Nmm gerechnet, aber Nm hingeschrieben.`,
      `Umrechnen: ${eq(m(fmt(p.F * p.l) + ' Nmm = ' + fmt((p.F * p.l) / 1000) + ' Nm'))}`,
      'Kontrolle mit Gefühl: Ein Monteur schafft von Hand etwa 20 bis 100 Nm.',
    ],
  }),

  task({
    id: 'd11', karte: 'moment', stufe: 1, familie: 'schaetzen',
    title: 'Schätzen: Radmutter anziehen',
    gen: () => ({ M: pick([100, 110, 120, 130]), l: pick([400, 500]) }),
    draw: (p) => B.schluessel(p, 'F'),
    text: (p) => `Du ziehst eine Radmutter am Auto mit ${m('M = ' + p.M + ' Nm')} an. Dein Schlüssel ist ${l('l = ' + p.l + ' mm')} lang. Ohne Taschenrechner: Welche Handkraft brauchst du ungefähr?`,
    asks: (p) => {
      const F = (p.M * 1000) / p.l;
      return [{
        kind: 'choice', k: 'Kraft etwa',
        opts: [`${fmt(F / 10, 0)} N`, `${fmt(F, 0)} N`, `${fmt(F * 10, 0)} N`],
        a: 1,
        why: ['Zu klein. Hast du mit 5 m statt 0,5 m gerechnet?', undefined, 'Zu gross. Hast du mm nicht in m umgerechnet?'],
      }];
    },
    tipps: () => ['F = M : l', 'Rechne l in Meter: 500 mm = 0,5 m.', 'Durch 0,5 teilen heisst mal 2 rechnen.'],
    loesung: (p) => [
      `${eq(f('F') + ' = ' + m(p.M + ' Nm') + ' : ' + l(fmt(p.l / 1000, 1) + ' m') + ' = ' + f(fmt((p.M * 1000) / p.l, 0) + ' N'))}`,
      'Das entspricht etwa dem Gewicht von 20 bis 30 kg. Das schafft man gut von Hand.',
    ],
  }),

  task({
    id: 'd12', karte: 'einseitig', stufe: 2, familie: 'waswaere',
    title: 'Was wäre wenn: Last in der Schubkarre verschieben',
    gen: () => ({ m: rng(50, 90, 10), l1: 500, l1n: pick([300, 350]), l2: rng(1200, 1400, 100) }),
    draw: (p) => B.schubkarre({ m: p.m, l1: p.l1, l2: p.l2 }),
    text: (p) => `In der Schubkarre liegen m = ${p.m} kg. Der Schwerpunkt liegt ${l('l₁ = ' + p.l1 + ' mm')} hinter der Radachse, die Griffe sind ${l('l₂ = ' + p.l2 + ' mm')} entfernt. Du schiebst die Last nach vorne, bis ${l('l₁ = ' + p.l1n + ' mm')}. a) Was passiert mit der Kraft an den Griffen? b) Wie gross ist sie danach? (g = 9,81 m/s²)`,
    asks: (p) => [
      { kind: 'choice', k: 'a) Kraft an den Griffen', opts: ['wird kleiner', 'bleibt gleich', 'wird grösser'], a: 0, why: [undefined, 'Das Moment der Last hängt vom Hebelarm ab. Der wird kürzer.', 'Der Hebelarm der Last wird kürzer, also auch ihr Moment.'] },
      { k: 'b) F neu', unit: 'N', v: (p.m * g * p.l1n) / p.l2 },
    ],
    fehler: (p) => [{ ask: 1, v: (p.m * g * p.l1) / p.l2, msg: 'Das ist die Kraft vorher. Rechne mit dem neuen Hebelarm.' }],
    tipps: () => ['Nur der Hebelarm der Last ändert sich.', 'F · l₂ = F_G · l₁ mit dem neuen l₁', 'F_neu = m · g · l₁,neu : l₂'],
    loesung: (p) => {
      const FG = p.m * g;
      return [
        `Der Hebelarm der Last sinkt von ${p.l1} mm auf ${p.l1n} mm. Das Moment der Last sinkt im gleichen Verhältnis.`,
        `${eq(f('F_neu') + ' = ' + f(fmt(FG) + ' N') + ' · ' + l(p.l1n + ' mm') + ' : ' + l(p.l2 + ' mm') + ' = ' + f(fmt((FG * p.l1n) / p.l2) + ' N'))}`,
        `Vorher waren es ${fmt((FG * p.l1) / p.l2)} N. Darum lädt man schwere Sachen möglichst nahe ans Rad.`,
      ];
    },
  }),

  task({
    id: 'd13', karte: 'gleichgewicht', stufe: 2, familie: 'umgekehrt',
    title: 'Umgekehrt: Wie lang muss die Brechstange sein?',
    gen: () => ({ F1: rng(1600, 3000, 200), l1: rng(100, 200, 25), F2: pick([300, 350, 400]) }),
    draw: (p) => B.hebel({ l1: p.l1, lr: (p.F1 * p.l1) / p.F2 }, { kiste: true, f1: `F_1 = ${p.F1} N`, d1: `l_1 = ${p.l1}`, rechts: [[(p.F1 * p.l1) / p.F2, `F_2 = ${p.F2} N`]], masse: [[(p.F1 * p.l1) / p.F2, 'l_2 = ?', 0]] }),
    text: (p) => `Eine Kiste drückt mit ${f('F₁ = ' + p.F1 + ' N')} auf eine Brechstange, ${l('l₁ = ' + p.l1 + ' mm')} vom Drehpunkt entfernt. Du kannst höchstens mit ${f('F₂ = ' + p.F2 + ' N')} drücken. Wie lang muss der Hebelarm l₂ mindestens sein?`,
    asks: (p) => [{ k: 'l₂', unit: 'mm', v: (p.F1 * p.l1) / p.F2 }],
    fehler: (p) => [{ ask: 0, v: (p.F2 * p.l1) / p.F1, msg: 'Die Kräfte sind vertauscht. Mit wenig Kraft brauchst du einen langen Arm.' }],
    tipps: () => ['Gleichgewicht: F₁ · l₁ = F₂ · l₂', 'Stelle nach l₂ um.', 'l₂ = F₁ · l₁ : F₂'],
    loesung: (p) => [
      `Hebelgesetz: ${eq(f('F₁') + ' · ' + l('l₁') + ' = ' + f('F₂') + ' · ' + l('l₂'))}`,
      `Umstellen: ${eq(l('l₂') + ' = ' + f('F₁') + ' · ' + l('l₁') + ' : ' + f('F₂'))}`,
      `Resultat: ${eq(l('l₂ = ' + fmt((p.F1 * p.l1) / p.F2) + ' mm'))}`,
      'Merke: Kraft sparen kostet Weg. Der lange Arm bewegt sich weiter als der kurze.',
    ],
  }),
];
