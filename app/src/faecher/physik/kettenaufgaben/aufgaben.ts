// Aufgaben zum Kapitel «Kettenaufgaben»: Das Resultat eines Schritts füttert den nächsten.
import { task, type Task } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { fmt, pick } from '../../../core/zahl';
import * as B from './bilder';

const rad = (a: number) => (a * Math.PI) / 180;
const G9 = 9.81;

/** Mischt eine Liste (Fisher-Yates). */
function mische<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

// ---------- Rechenkerne (ein Ort pro Aufgabentyp) ----------
const konsoleK = (p: { l: number; a: number; al: number; F: number }) => {
  const a = rad(p.al), Sy = (p.F * p.a) / p.l, S = Sy / Math.sin(a), Sx = S * Math.cos(a), Ay = p.F - Sy;
  return { Sy, S, Sx, Ay, h: p.l * Math.tan(a), FA: Math.hypot(Sx, Ay) };
};
const kranK = (p: { h: number; a: number; F: number; G: number; e: number; n: number }) => {
  const M = (p.F * p.a) / 1000 + (p.G * p.e) / 1000, FO = M / (p.h / 1000);
  return { M, FO, je: FO / p.n, Uy: p.F + p.G, FU: Math.hypot(FO, p.F + p.G) };
};
const zahnK = (p: { M: number; d: number; l: number; a: number }) => {
  const Fu = (2 * p.M * 1000) / p.d, Fr = Fu * Math.tan(rad(20)), Fn = Fu / Math.cos(rad(20)), FB = (Fn * p.a) / p.l;
  return { Fu, Fr, Fn, FB, FA: Fn - FB };
};
const riemenK = (p: { M: number; d: number; l: number; c: number }) => {
  const Fu = (2 * p.M * 1000) / p.d, FW = 3 * Fu, FB = (FW * (p.l + p.c)) / p.l;
  return { Fu, F2: Fu, F1: 2 * Fu, FW, FB, FA: FB - FW };
};
const windeK = (p: { m: number; al: number; mu: number; d: number; l: number; a: number }) => {
  const G = p.m * G9, a = rad(p.al), FH = G * Math.sin(a), FR = p.mu * G * Math.cos(a), S = FH + FR;
  return { G, FH, FR, S, M: (S * p.d) / 2000, FB: (S * p.a) / p.l, FA: (S * (p.l - p.a)) / p.l };
};
const hebelK = (p: { l1: number; l2: number; be: number; F1: number }) => {
  const b = rad(p.be), r1 = p.l1 * Math.sin(b), F2 = (p.F1 * r1) / p.l2, Dx = p.F1 * Math.cos(b), Dy = p.F1 * Math.sin(b) + F2;
  return { r1, M1: (p.F1 * r1) / 1000, F2, Dx, Dy, D: Math.hypot(Dx, Dy) };
};

const genKonsole = () => {
  const lg = pick([800, 1000, 1200]);
  return { l: lg, a: Math.round(lg * pick([0.4, 0.5, 0.6, 0.75])), al: pick([25, 30, 35, 40]), F: pick([2, 3, 4, 5]) };
};
const genKran = () => ({ h: pick([400, 500, 600]), a: pick([2000, 2500, 3000]), F: pick([5, 8, 10]), G: pick([1, 1.5, 2]), e: pick([1000, 1200, 1500]), n: 4 });
const genZahn = () => {
  let a: number, lg: number;
  do { lg = pick([300, 400, 500]); a = pick([100, 120, 150]); } while (2 * a === lg);
  return { M: pick([60, 90, 120, 150]), d: pick([100, 120, 160]), l: lg, a };
};
const genRiemen = () => ({ M: pick([20, 30, 40]), d: pick([100, 125, 160]), l: pick([200, 250, 300]), c: pick([60, 80, 100]) });
const genHebel = () => ({ l1: pick([150, 180, 200]), l2: pick([80, 100, 120]), be: pick([30, 40, 50, 60]), F1: pick([200, 300, 400]) });

export const AUFGABEN: Task[] = [
  task({
    id: 'ke1', karte: 'wand', stufe: 2, familie: 'kette',
    title: 'Wandkonsole mit Zugstab: nur ein Winkel gegeben',
    gen: genKonsole,
    draw: (p) => B.konsole(p),
    loesungsbild: (p) => B.konsole(p, { res: true, S: `F_S = ${fmt(konsoleK(p).S, 2)} kN` }),
    text: (p) => `Ein waagrechter Träger (Länge ${l('l = ' + p.l + ' mm')}) ist bei A an der Wand gelenkig befestigt. Am Ende C hält ihn ein Zugstab. Der Stab steigt unter ${p.al}° zur Waagrechten zur Wand hoch. Im Abstand ${l('a = ' + p.a + ' mm')} von A hängt ${f('F = ' + fmt(p.F) + ' kN')}. Das Eigengewicht zählt nicht. Berechne der Reihe nach: a) die Höhe h des oberen Wandanschlusses, b) die senkrechte Komponente F_Sy des Stabs (Momente um A), c) die Stabkraft F_S, d) die waagrechte Komponente F_Sx, e) die Lagerkräfte F_Ax und F_Ay und f) die gesamte Lagerkraft F_A.`,
    asks: (p) => {
      const k = konsoleK(p);
      return [
        { k: 'a) h', unit: 'mm', v: k.h },
        { k: 'b) F_Sy', unit: 'kN', v: k.Sy },
        { k: 'c) F_S', unit: 'kN', v: k.S },
        { k: 'd) F_Sx', unit: 'kN', v: k.Sx },
        { k: 'e) F_Ax', unit: 'kN', v: k.Sx },
        { k: 'e) F_Ay', unit: 'kN', v: k.Ay },
        { k: 'f) F_A', unit: 'kN', v: k.FA },
      ];
    },
    fehler: (p) => {
      const k = konsoleK(p), a = rad(p.al);
      return [
        { ask: 0, v: p.l / Math.tan(a), msg: 'tan α ist Gegenkathete durch Ankathete: h : l. Du hast h und l vertauscht.' },
        { ask: 1, v: p.F, msg: 'Der Stab trägt nicht die ganze Last. Nur F_Sy hat einen Hebelarm um A, und der ist l. Rechne F · a : l.' },
        { ask: 2, v: k.Sy / Math.cos(a), msg: 'Kosinus statt Sinus. F_Sy liegt dem Winkel gegenüber: F_S = F_Sy : sin α.' },
        { ask: 3, v: k.Sy, msg: 'Das ist die senkrechte Komponente F_Sy. Die waagrechte Komponente ist F_S · cos α.' },
        { ask: 5, v: p.F + k.Sy, msg: 'Der Stab trägt einen Teil der Last. Zieh F_Sy von F ab: F_Ay = F − F_Sy.' },
        { ask: 6, v: k.Sx + k.Ay, msg: 'Die Teilkräfte stehen rechtwinklig. Addiere nicht, sondern rechne mit Pythagoras.' },
      ];
    },
    tipps: () => [
      'Zuerst die Grösse, die du sofort rechnen kannst: das Moment um A. Nur die senkrechte Komponente des Stabs dreht.',
      'Hebelgesetz um A: F_Sy · l = F · a. Danach zerlegst du: F_S = F_Sy : sin α und F_Sx = F_S · cos α.',
      'Gleichgewicht: F_Ax = F_Sx, F_Ay = F − F_Sy, F_A = √(F_Ax² + F_Ay²).',
    ],
    loesung: (p) => {
      const k = konsoleK(p);
      return [
        `a) ${eq(l('h') + ' = ' + p.l + ' · tan ' + p.al + '° = ' + l(fmt(k.h) + ' mm'))}`,
        `b) ${eq(f('F_Sy') + ' · ' + p.l + ' = ' + fmt(p.F) + ' · ' + p.a)}, also ${eq(f('F_Sy') + ' = ' + f(fmt(k.Sy, 3) + ' kN'))}`,
        `c) ${eq(f('F_S') + ' = ' + fmt(k.Sy, 3) + ' : sin ' + p.al + '° = ' + f(fmt(k.S, 3) + ' kN'))} (Zug)`,
        `d) ${eq(f('F_Sx') + ' = ' + fmt(k.S, 3) + ' · cos ' + p.al + '° = ' + f(fmt(k.Sx, 3) + ' kN'))}`,
        `e) ${eq(f('F_Ax') + ' = ' + f(fmt(k.Sx, 3) + ' kN'))} (der Träger drückt gegen die Wand), ${eq(f('F_Ay') + ' = ' + fmt(p.F) + ' − ' + fmt(k.Sy, 3) + ' = ' + f(fmt(k.Ay, 3) + ' kN'))}`,
        `f) ${eq(f('F_A') + ' = √(' + fmt(k.Sx, 3) + '² + ' + fmt(k.Ay, 3) + '²) = ' + f(fmt(k.FA, 3) + ' kN'))}`,
        'Kette: Winkel, Hebelgesetz, Zerlegen, Gleichgewicht. Je flacher der Stab, desto grösser F_S.',
      ];
    },
  }),

  task({
    id: 'ke2', karte: 'wand', stufe: 3, familie: 'kette',
    title: 'Schwenkkran an der Wand: oberes Lager zieht',
    gen: genKran,
    draw: (p) => B.schwenkkran(p),
    loesungsbild: (p) => B.schwenkkran(p, { FO: `F_O = ${fmt(kranK(p).FO, 1)} kN` }),
    text: (p) => `Ein Schwenkkran hängt an zwei Lagern an der Wand. Das obere Lager O nimmt nur waagrechte Kräfte auf. Das untere Lager U nimmt waagrechte und senkrechte Kräfte auf. Der Lagerabstand ist ${l('h = ' + p.h + ' mm')}. Die Last ${f('F = ' + fmt(p.F) + ' kN')} hängt in ${l('a = ' + p.a + ' mm')} Ausladung. Der Ausleger wiegt ${f('G = ' + fmt(p.G) + ' kN')}. Sein Schwerpunkt liegt ${l(p.e + ' mm')} von der Kransäule entfernt. Berechne a) das Kippmoment um U, b) die Lagerkraft F_O, c) die Zugkraft je Schraube am Lager O (${p.n} Schrauben), d) die Lagerkräfte F_Ux und F_Uy und e) F_U gesamt.`,
    asks: (p) => {
      const k = kranK(p);
      return [
        { k: 'a) M', unit: 'kN·m', v: k.M },
        { k: 'b) F_O', unit: 'kN', v: k.FO },
        { k: 'c) F je Schraube', unit: 'kN', v: k.je },
        { k: 'd) F_Ux', unit: 'kN', v: k.FO },
        { k: 'd) F_Uy', unit: 'kN', v: k.Uy },
        { k: 'e) F_U', unit: 'kN', v: k.FU },
      ];
    },
    fehler: (p) => {
      const k = kranK(p);
      return [
        { ask: 0, v: k.M * 1000, msg: 'Du hast mm statt m eingesetzt. Rechne a und e durch 1000, dann stimmt die Einheit kN·m.' },
        { ask: 0, v: (p.F * p.a) / 1000, msg: 'Der Ausleger wiegt auch etwas. Sein Gewicht G hat den Hebelarm e und gehört zum Kippmoment.' },
        { ask: 1, v: (p.F * p.a) / 1000 / (p.h / 1000), msg: 'Das Gewicht des Auslegers fehlt im Moment. Rechne M = F · a + G · e.' },
        { ask: 2, v: k.FO, msg: 'Das ist die Kraft aller Schrauben zusammen. Teile durch die Anzahl der Schrauben.' },
        { ask: 4, v: p.F, msg: 'Das untere Lager trägt auch das Gewicht des Auslegers. F_Uy = F + G.' },
        { ask: 5, v: k.FO + k.Uy, msg: 'Die Teilkräfte stehen rechtwinklig. Addiere nicht, sondern rechne mit Pythagoras.' },
      ];
    },
    tipps: () => [
      'Dreh das Problem um U. Nur F_O hat dort einen Hebelarm (h). F_Ux und F_Uy gehen durch U.',
      'Zuerst das Kippmoment M = F · a + G · e (in m rechnen). Dann F_O = M : h.',
      'Waagrecht: F_Ux = F_O. Senkrecht trägt nur U: F_Uy = F + G. F_U = √(F_Ux² + F_Uy²).',
    ],
    loesung: (p) => {
      const k = kranK(p);
      return [
        `a) ${eq(m('M') + ' = ' + fmt(p.F) + ' · ' + fmt(p.a / 1000) + ' + ' + fmt(p.G) + ' · ' + fmt(p.e / 1000) + ' = ' + m(fmt(k.M, 3) + ' kN·m'))}`,
        `b) ${eq(f('F_O') + ' = ' + fmt(k.M, 3) + ' : ' + fmt(p.h / 1000) + ' = ' + f(fmt(k.FO, 2) + ' kN'))} (Zug, das Lager wird aus der Wand gezogen)`,
        `c) ${eq(fmt(k.FO, 2) + ' kN : ' + p.n + ' = ' + f(fmt(k.je, 2) + ' kN'))} je Schraube`,
        `d) ${eq(f('F_Ux') + ' = ' + f(fmt(k.FO, 2) + ' kN'))} (Druck), ${eq(f('F_Uy') + ' = ' + fmt(p.F) + ' + ' + fmt(p.G) + ' = ' + f(fmt(k.Uy) + ' kN'))}`,
        `e) ${eq(f('F_U') + ' = √(' + fmt(k.FO, 2) + '² + ' + fmt(k.Uy) + '²) = ' + f(fmt(k.FU, 2) + ' kN'))}`,
        'Warnung: Die Schrauben am oberen Lager werden auf Zug belastet. Sind Dübel oder Mauerwerk zu schwach, reisst der Kran aus der Wand. Lege die Dübel nach Herstellerangabe für Zuglast aus.',
      ];
    },
  }),

  task({
    id: 'ke3', karte: 'welle', stufe: 3, familie: 'kette',
    title: 'Zahnradwelle: vom Drehmoment zu den Lagerkräften',
    gen: genZahn,
    draw: (p) => B.zahnradwelle(p),
    loesungsbild: (p) => {
      const k = zahnK(p);
      return B.zahnradwelle(p, { Fn: `F_n = ${fmt(k.Fn)} N`, RA: `F_A = ${fmt(k.FA)} N`, RB: `F_B = ${fmt(k.FB)} N` });
    },
    text: (p) => `Ein Motor treibt eine Welle mit ${m('M = ' + p.M + ' N·m')} an. Das Zahnrad auf der Welle hat ${l('d = ' + p.d + ' mm')} und einen Eingriffswinkel von 20°. Es sitzt ${l('a = ' + p.a + ' mm')} neben Lager A. Der Lagerabstand ist ${l('l = ' + p.l + ' mm')}. Berechne a) die Umfangskraft F_u, b) die Radialkraft F_r = F_u · tan 20°, c) die Zahnnormalkraft F_n (sie belastet die Welle quer), d) die Lagerkräfte F_A und F_B.`,
    asks: (p) => {
      const k = zahnK(p);
      return [
        { k: 'a) F_u', unit: 'N', v: k.Fu },
        { k: 'b) F_r', unit: 'N', v: k.Fr },
        { k: 'c) F_n', unit: 'N', v: k.Fn },
        { k: 'd) F_A', unit: 'N', v: k.FA },
        { k: 'd) F_B', unit: 'N', v: k.FB },
      ];
    },
    fehler: (p) => {
      const k = zahnK(p);
      return [
        { ask: 0, v: (p.M * 1000) / p.d, msg: 'Du hast den Durchmesser als Radius eingesetzt. Es gilt F_u = M : r = 2 · M : d.' },
        { ask: 1, v: k.Fu * Math.sin(rad(20)), msg: 'Die Radialkraft rechnest du mit tan 20°, nicht mit sin 20°. F_r liegt gegenüber, F_u berührt den Winkel.' },
        { ask: 2, v: k.Fu + k.Fr, msg: 'F_u und F_r stehen rechtwinklig. Addiere nicht, sondern rechne mit Pythagoras oder F_u : cos 20°.' },
        { ask: 2, v: k.Fu, msg: 'Das ist nur die Umfangskraft. Die Welle spürt die ganze Zahnnormalkraft F_n.' },
        { ask: 3, v: k.FB, msg: 'Die Lager sind vertauscht. Das Lager näher beim Zahnrad trägt mehr.' },
        { ask: 4, v: k.FA, msg: 'Die Lager sind vertauscht. F_B hat den Hebelarm l, die Last den Hebelarm a von A aus gemessen.' },
      ];
    },
    tipps: () => [
      'Reihenfolge: Drehmoment, Umfangskraft, Zahnnormalkraft, Lagerkräfte.',
      'F_u = 2 · M : d (M in N·mm). F_n = F_u : cos 20°. Dann Drehpunkt in A: F_B · l = F_n · a.',
      'F_A = F_n − F_B. Das Zahnrad drückt quer auf die Welle mit der ganzen Kraft F_n.',
    ],
    loesung: (p) => {
      const k = zahnK(p);
      return [
        `a) ${eq(f('F_u') + ' = 2 · ' + p.M * 1000 + ' : ' + p.d + ' = ' + f(fmt(k.Fu) + ' N'))}`,
        `b) ${eq(f('F_r') + ' = ' + fmt(k.Fu) + ' · tan 20° = ' + f(fmt(k.Fr) + ' N'))}`,
        `c) ${eq(f('F_n') + ' = ' + fmt(k.Fu) + ' : cos 20° = ' + f(fmt(k.Fn) + ' N'))}`,
        `d) ${eq(f('F_B') + ' = ' + fmt(k.Fn) + ' · ' + p.a + ' : ' + p.l + ' = ' + f(fmt(k.FB) + ' N'))}, ${eq(f('F_A') + ' = ' + fmt(k.Fn) + ' − ' + fmt(k.FB) + ' = ' + f(fmt(k.FA) + ' N'))}`,
        'Kette: Drehmoment, Umfangskraft, Zerlegen mit dem Eingriffswinkel, Lagerkräfte. So legt man Lager in Getrieben aus.',
      ];
    },
  }),

  task({
    id: 'ke4', karte: 'welle', stufe: 3, familie: 'kette',
    title: 'Riemenscheibe fliegend: ein Lager zieht nach unten',
    gen: genRiemen,
    draw: (p) => B.riemenscheibe(p),
    loesungsbild: (p) => {
      const k = riemenK(p);
      return B.riemenscheibe(p, { F1: `F_1 = ${fmt(k.F1)} N`, F2: `F_2 = ${fmt(k.F2)} N`, RA: `F_A = ${fmt(k.FA)} N`, RB: `F_B = ${fmt(k.FB)} N` });
    },
    text: (p) => `Ein Motor gibt ${m('M = ' + p.M + ' N·m')} an eine Riemenscheibe (${l('d = ' + p.d + ' mm')}) ab. Die Scheibe sitzt fliegend, also ${l('c = ' + p.c + ' mm')} ausserhalb von Lager B. Der Lagerabstand ist ${l('l = ' + p.l + ' mm')}. Annahme: Der Zugtrum zieht doppelt so stark wie der Leertrum (F_1 = 2 · F_2). Beide Trume laufen parallel. Berechne a) die Umfangskraft F_u = F_1 − F_2, b) F_2 und F_1, c) die Wellenbelastung F_W = F_1 + F_2, d) die Lagerkraft F_B und e) den Betrag der Lagerkraft F_A.`,
    asks: (p) => {
      const k = riemenK(p);
      return [
        { k: 'a) F_u', unit: 'N', v: k.Fu },
        { k: 'b) F_2', unit: 'N', v: k.F2 },
        { k: 'b) F_1', unit: 'N', v: k.F1 },
        { k: 'c) F_W', unit: 'N', v: k.FW },
        { k: 'd) F_B', unit: 'N', v: k.FB },
        { k: 'e) F_A (Betrag)', unit: 'N', v: k.FA },
      ];
    },
    fehler: (p) => {
      const k = riemenK(p);
      return [
        { ask: 0, v: (p.M * 1000) / p.d, msg: 'Du hast den Durchmesser als Radius eingesetzt. Es gilt F_u = 2 · M : d.' },
        { ask: 1, v: k.Fu / 2, msg: 'Aus F_1 − F_2 = F_u und F_1 = 2 · F_2 folgt F_2 = F_u. Setze F_1 = 2 · F_2 ein.' },
        { ask: 3, v: k.Fu, msg: 'Beide Trume ziehen in dieselbe Richtung an der Welle. Addiere F_1 + F_2. Die Differenz ist nur die Umfangskraft.' },
        { ask: 4, v: k.FW, msg: 'Die Scheibe sitzt ausserhalb von B. Der Hebelarm ist l + c, nicht nur die Last selbst. Dann wird F_B grösser als F_W.' },
        { ask: 4, v: (k.FW * p.l) / (p.l + p.c), msg: 'Die Hebelarme sind vertauscht. F_B · l = F_W · (l + c).' },
        { ask: 5, v: k.FB + k.FW, msg: 'Lager A zieht entgegen F_W, B drückt mit F_B. Gleichgewicht: F_A = F_B − F_W.' },
      ];
    },
    tipps: () => [
      'Löse die zwei Gleichungen F_1 − F_2 = F_u und F_1 = 2 · F_2. Beide Trume wirken dann zusammen als F_W.',
      'F_u = 2 · M : d. Daraus F_2 = F_u, F_1 = 2 · F_u, F_W = 3 · F_u. Drehpunkt A: F_B · l = F_W · (l + c).',
      'Gleichgewicht der Kräfte: F_A = F_B − F_W. Lager A zieht entgegen der Wellenbelastung.',
    ],
    loesung: (p) => {
      const k = riemenK(p);
      return [
        `a) ${eq(f('F_u') + ' = 2 · ' + p.M * 1000 + ' : ' + p.d + ' = ' + f(fmt(k.Fu) + ' N'))}`,
        `b) ${eq(f('F_2') + ' = ' + f(fmt(k.F2) + ' N'))} und ${eq(f('F_1') + ' = ' + f(fmt(k.F1) + ' N'))}`,
        `c) ${eq(f('F_W') + ' = ' + fmt(k.F1) + ' + ' + fmt(k.F2) + ' = ' + f(fmt(k.FW) + ' N'))}`,
        `d) ${eq(f('F_B') + ' = ' + fmt(k.FW) + ' · (' + p.l + ' + ' + p.c + ') : ' + p.l + ' = ' + f(fmt(k.FB) + ' N'))}`,
        `e) ${eq(f('F_A') + ' = ' + fmt(k.FB) + ' − ' + fmt(k.FW) + ' = ' + f(fmt(k.FA) + ' N'))}, Richtung entgegen F_W`,
        'Bei fliegender Scheibe wird F_B grösser als die Last. Das innere Lager A hebt ab und muss die Welle nach unten halten.',
      ];
    },
  }),

  task({
    id: 'ke5', karte: 'last', stufe: 3, familie: 'kette',
    title: 'Seilwinde an der Rampe: Masse, Seilkraft, Drehmoment, Lager',
    gen: () => {
      let lg: number, a: number;
      do { lg = pick([400, 500]); a = pick([120, 150, 200]); } while (2 * a === lg);
      return { m: pick([300, 500, 800]), al: pick([15, 20, 25, 30]), mu: pick([0.1, 0.15, 0.2]), d: pick([150, 200, 250]), l: lg, a };
    },
    draw: (p) => B.rampeWinde(p),
    text: (p) => `Eine Winde zieht eine Kiste (m = ${p.m} kg) eine Rampe mit α = ${p.al}° hoch. Die Gleitreibungszahl ist μ = ${fmt(p.mu)}. Das Seil läuft parallel zur Rampe auf eine Trommel mit ${l('d = ' + p.d + ' mm')}. Die Trommelwelle liegt in den Lagern A und B (${l('l = ' + p.l + ' mm')}). Die Trommel sitzt ${l('a = ' + p.a + ' mm')} neben A. Berechne a) die Gewichtskraft F_G, b) die Seilkraft F_S, c) das Drehmoment an der Trommel und d) die Lagerkräfte F_A und F_B. Die Seilkraft wirkt quer auf die Welle.`,
    asks: (p) => {
      const k = windeK(p);
      return [
        { k: 'a) F_G', unit: 'N', v: k.G },
        { k: 'b) F_S', unit: 'N', v: k.S },
        { k: 'c) M', unit: 'N·m', v: k.M },
        { k: 'd) F_A', unit: 'N', v: k.FA },
        { k: 'd) F_B', unit: 'N', v: k.FB },
      ];
    },
    fehler: (p) => {
      const k = windeK(p), a = rad(p.al);
      return [
        { ask: 0, v: p.m, msg: 'Das ist die Masse in kg. Die Gewichtskraft ist F_G = m · g mit g = 9,81 m/s².' },
        { ask: 1, v: k.FH, msg: 'Die Reibung fehlt. Das Seil muss Hangabtrieb und Reibkraft aufbringen: F_S = F_H + F_R.' },
        { ask: 1, v: k.G * (Math.cos(a) + p.mu * Math.sin(a)), msg: 'Sinus und Kosinus sind vertauscht. Der Hangabtrieb ist F_G · sin α, die Normalkraft F_G · cos α.' },
        { ask: 2, v: (k.S * p.d) / 1000, msg: 'Du hast den Durchmesser als Hebelarm genommen. Der Hebelarm ist der Radius, also d : 2.' },
        { ask: 3, v: k.FB, msg: 'Die Lager sind vertauscht. Die Trommel sitzt näher bei A. Dann trägt A mehr.' },
        { ask: 4, v: k.FA, msg: 'Die Lager sind vertauscht. F_B · l = F_S · a, mit a von A aus gemessen.' },
      ];
    },
    tipps: () => [
      'Vier Schritte hintereinander: Gewichtskraft, Seilkraft, Drehmoment, Lagerkräfte.',
      'F_S = F_G · sin α + μ · F_G · cos α. M = F_S · d : 2. Dann Drehpunkt in A: F_B · l = F_S · a.',
      'F_A = F_S − F_B. Das Moment M brauchst du für die Lager nicht. Es ist ein Zwischenergebnis für den Motor.',
    ],
    loesung: (p) => {
      const k = windeK(p);
      return [
        `a) ${eq(f('F_G') + ' = ' + p.m + ' · 9,81 = ' + f(fmt(k.G) + ' N'))}`,
        `b) ${eq(f('F_H') + ' = ' + fmt(k.G) + ' · sin ' + p.al + '° = ' + fmt(k.FH) + ' N')}, ${eq(f('F_R') + ' = ' + fmt(p.mu) + ' · ' + fmt(k.G) + ' · cos ' + p.al + '° = ' + fmt(k.FR) + ' N')}, ${eq(f('F_S') + ' = ' + f(fmt(k.S) + ' N'))}`,
        `c) ${eq(m('M') + ' = ' + fmt(k.S) + ' · ' + fmt(p.d / 2000, 3) + ' = ' + m(fmt(k.M) + ' N·m'))}`,
        `d) ${eq(f('F_B') + ' = ' + fmt(k.S) + ' · ' + p.a + ' : ' + p.l + ' = ' + f(fmt(k.FB) + ' N'))}, ${eq(f('F_A') + ' = ' + fmt(k.S) + ' − ' + fmt(k.FB) + ' = ' + f(fmt(k.FA) + ' N'))}`,
        'Vier Kapitel in einer Kette: Gewichtskraft, schiefe Ebene mit Reibung, Drehmoment, Lagerkräfte.',
      ];
    },
  }),

  task({
    id: 'ke6', karte: 'last', stufe: 2, familie: 'kette',
    title: 'Hebel mit schrägem Zug: wirksamer Hebelarm zuerst',
    gen: genHebel,
    draw: (p) => B.hebelSchraeg(p),
    loesungsbild: (p) => B.hebelSchraeg(p, { F2: `F_2 = ${fmt(hebelK(p).F2)} N` }),
    text: (p) => `An einem Hebel mit Drehpunkt D zieht links ${f('F_1 = ' + p.F1 + ' N')} unter dem Winkel β = ${p.be}° zum Hebel. Rechts hängt eine Last F_2. Die Hebellängen sind ${l('l_1 = ' + p.l1 + ' mm')} und ${l('l_2 = ' + p.l2 + ' mm')}. Berechne a) den wirksamen Hebelarm r_1 von F_1, b) das Drehmoment M_1, c) die Last F_2 im Gleichgewicht und d) die Lagerkraft in D mit F_Dx, F_Dy und F_D.`,
    asks: (p) => {
      const k = hebelK(p);
      return [
        { k: 'a) r_1', unit: 'mm', v: k.r1 },
        { k: 'b) M_1', unit: 'N·m', v: k.M1 },
        { k: 'c) F_2', unit: 'N', v: k.F2 },
        { k: 'd) F_Dx', unit: 'N', v: k.Dx },
        { k: 'd) F_Dy', unit: 'N', v: k.Dy },
        { k: 'd) F_D', unit: 'N', v: k.D },
      ];
    },
    fehler: (p) => {
      const k = hebelK(p), b = rad(p.be);
      return [
        { ask: 0, v: p.l1, msg: 'Das ist der volle Hebel. Eine schräge Kraft dreht nur mit dem Anteil senkrecht zum Hebel: r_1 = l_1 · sin β.' },
        { ask: 0, v: p.l1 * Math.cos(b), msg: 'Kosinus statt Sinus. Der Winkel β liegt zwischen Kraft und Hebel. Der senkrechte Anteil liegt gegenüber: sin β.' },
        { ask: 1, v: (p.F1 * p.l1) / 1000, msg: 'Du hast l_1 statt r_1 eingesetzt. Die schräge Kraft dreht schwächer.' },
        { ask: 2, v: (p.F1 * p.l1) / p.l2, msg: 'Du hast l_1 statt r_1 eingesetzt. Rechne F_2 = M_1 : l_2 mit dem wirksamen Hebelarm.' },
        { ask: 3, v: p.F1 * Math.sin(b), msg: 'Sinus und Kosinus sind vertauscht. Längs zum Hebel wirkt F_1 · cos β.' },
        { ask: 5, v: k.Dx + k.Dy, msg: 'Die Teilkräfte stehen rechtwinklig. Addiere nicht, sondern rechne mit Pythagoras.' },
      ];
    },
    tipps: () => [
      'Ein schräger Zug dreht nur mit dem Anteil senkrecht zum Hebel. Beginne mit dem wirksamen Hebelarm.',
      'r_1 = l_1 · sin β. M_1 = F_1 · r_1. Gleichgewicht: M_1 = F_2 · l_2.',
      'In D: F_Dx = F_1 · cos β (längs), F_Dy = F_1 · sin β + F_2 (quer). F_D = √(F_Dx² + F_Dy²).',
    ],
    loesung: (p) => {
      const b = rad(p.be), k = hebelK(p);
      return [
        `a) ${eq(l('r_1') + ' = ' + p.l1 + ' · sin ' + p.be + '° = ' + l(fmt(k.r1) + ' mm'))}`,
        `b) ${eq(m('M_1') + ' = ' + p.F1 + ' · ' + fmt(k.r1 / 1000, 4) + ' = ' + m(fmt(k.M1) + ' N·m'))}`,
        `c) ${eq(f('F_2') + ' = ' + p.F1 + ' · ' + fmt(k.r1) + ' : ' + p.l2 + ' = ' + f(fmt(k.F2) + ' N'))}`,
        `d) ${eq(f('F_Dx') + ' = ' + p.F1 + ' · cos ' + p.be + '° = ' + fmt(k.Dx) + ' N')}, ${eq(f('F_Dy') + ' = ' + fmt(p.F1 * Math.sin(b)) + ' + ' + fmt(k.F2) + ' = ' + fmt(k.Dy) + ' N')}, ${eq(f('F_D') + ' = ' + f(fmt(k.D) + ' N'))}`,
        'Typischer Fehler: l_1 statt r_1 einsetzen. Eine schräge Kraft dreht weniger stark.',
      ];
    },
  }),

  // ---------- Neu: Schätzen, Umgekehrt, Was wäre wenn, Fehler finden ----------
  task({
    id: 'ke7', karte: 'wand', stufe: 1, familie: 'schaetzen',
    title: 'Schätzen: Zugkraft am oberen Kranlager im Kopf',
    gen: () => {
      let F: number, a: number, h: number;
      do { F = pick([4, 5, 6, 8]); a = pick([3, 4, 5, 6]); h = pick([1, 2]); } while (a / h === 2);
      const v = (F * a) / h;
      return { F, a, h, v, o: mische([0, 1, 2, 3]) };
    },
    draw: (p) => B.schwenkkran({ h: p.h, a: p.a, F: p.F, G: 0, e: 0, n: 0, u: ' m' }),
    text: (p) => `Ein Wandkran trägt ${f('F = ' + p.F + ' kN')} in ${l('a = ' + p.a + ' m')} Ausladung. Die Lager O und U sitzen ${l('h = ' + p.h + ' m')} übereinander. Das Eigengewicht zählt nicht. Schätze im Kopf: Wie gross ist die Zugkraft F_O am oberen Lager?`,
    asks: (p) => {
      const list = [`${fmt(p.v)} kN`, `${fmt(p.F)} kN`, `${fmt(2 * p.v)} kN`, `${fmt(p.v / 2)} kN`];
      return [{
        kind: 'choice', k: 'F_O ≈',
        opts: p.o.map((i: number) => list[i]),
        a: p.o.indexOf(0),
        why: p.o.map((i: number) => [undefined, 'Die Last allein ist es nicht. Der lange Hebel a gegen den kurzen Hebel h macht F_O grösser.', 'Das ist doppelt so viel. Rechne F · a : h genau.', 'Das ist nur halb so viel. Rechne F · a : h genau.'][i]),
      }];
    },
    tipps: () => [
      'Das Moment der Last um U wird allein von F_O gehalten.',
      'F_O · h = F · a. Also gilt F_O = F · (a : h).',
      'Prüfe die Grössenordnung: Ist a grösser als h, muss F_O grösser sein als F.',
    ],
    loesung: (p) => [
      `Momentengleichgewicht um U: ${eq(f('F_O') + ' · ' + l('h') + ' = ' + f('F') + ' · ' + l('a'))}`,
      `${eq(f('F_O') + ' = ' + p.F + ' kN · ' + p.a + ' : ' + p.h + ' = ' + f(fmt(p.v) + ' kN'))}`,
      `Die Ausladung ist ${fmt(p.a / p.h)}-mal so gross wie der Lagerabstand. Darum ist F_O ${fmt(p.a / p.h)}-mal so gross wie F.`,
    ],
  }),

  task({
    id: 'ke8', karte: 'wand', stufe: 3, familie: 'umgekehrt',
    title: 'Umgekehrt: Wie viel darf die Konsole tragen?',
    gen: () => {
      const q = genKonsole();
      const S = +((q.F * q.a) / q.l / Math.sin(rad(q.al))).toFixed(1);
      return { l: q.l, a: q.a, al: q.al, S, F: (S * Math.sin(rad(q.al)) * q.l) / q.a };
    },
    draw: (p) => B.konsole(p, { F: 'F = ?', S: `F_S,max = ${fmt(p.S)} kN` }),
    text: (p) => `Eine Wandkonsole hat einen waagrechten Träger (${l('l = ' + p.l + ' mm')}) und einen Zugstab unter ${p.al}° zur Waagrechten. Der Stab darf höchstens ${f('F_S = ' + fmt(p.S) + ' kN')} tragen. Die Last hängt im Abstand ${l('a = ' + p.a + ' mm')} von A. Wie gross darf die Last F höchstens sein?`,
    asks: (p) => [{ k: 'F max', unit: 'kN', v: p.F }],
    fehler: (p) => [
      { ask: 0, v: (p.S * p.l) / p.a, msg: 'Der Stab zieht schräg. Nur sein senkrechter Anteil F_S · sin α trägt die Last. Vergiss sin α nicht.' },
      { ask: 0, v: (p.S * Math.cos(rad(p.al)) * p.l) / p.a, msg: 'Kosinus statt Sinus. Der senkrechte Anteil liegt gegenüber dem Winkel: F_Sy = F_S · sin α.' },
      { ask: 0, v: p.S * Math.sin(rad(p.al)), msg: 'Der Hebel fehlt. Die Last hat den Hebelarm a, der Stab den Hebelarm l. Es gilt F · a = F_Sy · l.' },
    ],
    tipps: () => [
      'Gehe die Kette rückwärts: Stabkraft, senkrechte Komponente, Moment um A, Last.',
      'F_Sy = F_S · sin α. Dann F · a = F_Sy · l.',
      'F = F_S · sin α · l : a',
    ],
    loesung: (p) => {
      const Sy = p.S * Math.sin(rad(p.al));
      return [
        `Senkrechte Komponente: ${eq(f('F_Sy') + ' = ' + fmt(p.S) + ' · sin ' + p.al + '° = ' + fmt(Sy, 3) + ' kN')}`,
        `Momente um A: ${eq(f('F') + ' · ' + l('a') + ' = ' + f('F_Sy') + ' · ' + l('l'))}`,
        `${eq(f('F') + ' = ' + fmt(Sy, 3) + ' · ' + p.l + ' : ' + p.a + ' = ' + f(fmt(p.F, 3) + ' kN'))}`,
        'Die Kette lässt sich umkehren. Jeder Schritt bleibt gleich, nur die Reihenfolge ändert sich.',
      ];
    },
  }),

  task({
    id: 'ke9', karte: 'welle', stufe: 2, familie: 'waswaere',
    title: 'Was wäre wenn: Riemenscheibe weiter draussen',
    gen: () => {
      const q = genRiemen();
      return { ...q, c2: 2 * q.c };
    },
    draw: (p) => B.riemenscheibe({ M: p.M, d: p.d, l: p.l, c: p.c2 }),
    text: (p) => `Eine fliegende Riemenscheibe (${m('M = ' + p.M + ' N·m')}, ${l('d = ' + p.d + ' mm')}) sitzt ${l('c = ' + p.c + ' mm')} ausserhalb von Lager B. Der Lagerabstand ist ${l('l = ' + p.l + ' mm')}. Der Zugtrum zieht doppelt so stark wie der Leertrum. Du rückst die Scheibe auf ${l('c = ' + p.c2 + ' mm')} hinaus (Bild). a) Was passiert mit der Lagerkraft F_A? b) Wie gross ist F_A danach?`,
    asks: (p) => [
      { kind: 'choice', k: 'a) F_A', opts: ['bleibt gleich', 'wird doppelt so gross', 'wird halb so gross'], a: 1, why: ['F_A = F_W · c : l. Die Grösse c steckt drin.', undefined, 'Ein grösseres c vergrössert F_A. Es wird nicht kleiner.'] },
      { k: 'b) F_A neu', unit: 'N', v: riemenK({ ...p, c: p.c2 }).FA },
    ],
    fehler: (p) => [{ ask: 1, v: riemenK(p).FA, msg: 'Das ist der Wert vorher mit dem alten c. Setze den neuen Überstand ein.' }],
    tipps: () => [
      'Die Wellenlast F_W bleibt gleich. Nur der Überstand c ändert sich.',
      'Es gilt F_A = F_B − F_W = F_W · c : l. Wird c doppelt so gross, wird F_A doppelt so gross.',
      'F_A,neu = F_W · c_neu : l mit F_W = 3 · F_u und F_u = 2 · M : d.',
    ],
    loesung: (p) => {
      const k = riemenK(p), n = riemenK({ ...p, c: p.c2 });
      return [
        `Wellenlast: ${eq(f('F_W') + ' = 3 · 2 · ' + p.M * 1000 + ' : ' + p.d + ' = ' + fmt(k.FW) + ' N')}`,
        `Lager A: ${eq(f('F_A') + ' = ' + f('F_W') + ' · c : l')}`,
        `Neu: ${eq(f('F_A') + ' = ' + fmt(k.FW) + ' · ' + p.c2 + ' : ' + p.l + ' = ' + f(fmt(n.FA) + ' N'))}`,
        `Vorher waren es ${fmt(k.FA)} N. Doppelter Überstand heisst doppelte Kraft im Lager A.`,
      ];
    },
  }),

  task({
    id: 'ke10', karte: 'pruefen', stufe: 2, familie: 'fehler',
    title: 'Fehler finden: Bens Lagerkraft an der Zahnradwelle',
    gen: genZahn,
    draw: (p) => B.zahnradwelle(p),
    text: (p) => {
      const k = zahnK(p);
      return `Ben rechnet die Lagerkraft an der Zahnradwelle (M = ${p.M} N·m, d = ${p.d} mm, a = ${p.a} mm, l = ${p.l} mm). Er bestimmt F_u = ${fmt(k.Fu)} N. Dann schreibt er: «F_B = F_u · a : l = ${fmt((k.Fu * p.a) / p.l)} N». Was ist falsch?`;
    },
    asks: (p) => {
      const k = zahnK(p);
      return [{
        kind: 'choice', k: 'Fehler',
        opts: [
          `Die Welle spürt die ganze Zahnnormalkraft F_n = F_u : cos 20° = ${fmt(k.Fn)} N, nicht nur F_u.`,
          'Er muss mit dem Hebelarm l − a rechnen statt mit a.',
          'Er muss das Ergebnis noch durch 2 teilen, weil zwei Lager tragen.',
          'Nichts. Die Umfangskraft allein belastet die Welle.',
        ],
        a: 0,
        why: [
          undefined,
          'Von A aus gemessen hat die Last den Hebelarm a. Das stimmt. Der Fehler liegt in der Kraft.',
          'Die Aufteilung auf die Lager steckt schon im Verhältnis a : l. Es wird nicht nochmals geteilt.',
          'Der Zahn drückt schräg. Zur Umfangskraft kommt die Radialkraft dazu. Die Welle trägt beides.',
        ],
      }];
    },
    tipps: () => [
      'Welche Kraft drückt das Zahnrad wirklich auf die Welle?',
      'F_u ist nur der Anteil in Umfangsrichtung. Der Zahn drückt zusätzlich radial.',
      'Die ganze Kraft ist F_n = F_u : cos 20°.',
    ],
    loesung: (p) => {
      const k = zahnK(p);
      return [
        `Zahnnormalkraft: ${eq(f('F_n') + ' = ' + fmt(k.Fu) + ' : cos 20° = ' + f(fmt(k.Fn) + ' N'))}`,
        `Richtig: ${eq(f('F_B') + ' = ' + fmt(k.Fn) + ' · ' + p.a + ' : ' + p.l + ' = ' + f(fmt(k.FB) + ' N'))}`,
        'Ein Zwischenwert der Kette fehlte. Frage dich bei jeder Kette: Gehe ich mit der richtigen Kraft in den nächsten Schritt?',
      ];
    },
  }),

  task({
    id: 'ke11', karte: 'pruefen', stufe: 2, familie: 'fehler',
    title: 'Fehler finden: Bens Wellenbelastung am Riemen',
    gen: genRiemen,
    draw: (p) => B.riemenscheibe(p),
    text: (p) => {
      const k = riemenK(p);
      return `Ben löst die Riemenscheibe (M = ${p.M} N·m, d = ${p.d} mm, F_1 = 2 · F_2). Er findet F_1 = ${fmt(k.F1)} N und F_2 = ${fmt(k.F2)} N. Für die Wellenbelastung schreibt er: «F_W = F_1 − F_2 = ${fmt(k.Fu)} N». Was ist falsch?`;
    },
    asks: (p) => {
      const k = riemenK(p);
      return [{
        kind: 'choice', k: 'Fehler',
        opts: [
          `Er subtrahiert. Beide Trume ziehen in dieselbe Richtung an der Welle. Richtig ist F_W = F_1 + F_2 = ${fmt(k.FW)} N.`,
          'Die Wellenbelastung ist nur F_1, denn der Leertrum zieht nicht.',
          'Er muss F_1 und F_2 mit dem Hebelarm d multiplizieren.',
          'Nichts. Die Differenz der Trume ist die Wellenbelastung.',
        ],
        a: 0,
        why: [
          undefined,
          'Auch der Leertrum ist gespannt und zieht an der Welle.',
          'Die Wellenbelastung ist eine Kraft. Mit dem Hebelarm bildest du ein Moment, nicht eine Kraft.',
          'Die Differenz F_1 − F_2 ist die Umfangskraft. Sie bringt das Drehmoment, nicht die Belastung der Lager.',
        ],
      }];
    },
    tipps: () => [
      'Beide Trume ziehen am gleichen Wellenstück. In welche Richtung?',
      'Zwei parallele Kräfte in dieselbe Richtung addierst du.',
      'F_W = F_1 + F_2. Die Differenz F_1 − F_2 ist die Umfangskraft.',
    ],
    loesung: (p) => {
      const k = riemenK(p);
      return [
        `Umfangskraft (Differenz): ${eq(f('F_u') + ' = ' + f('F_1') + ' − ' + f('F_2') + ' = ' + fmt(k.Fu) + ' N')}`,
        `Wellenbelastung (Summe): ${eq(f('F_W') + ' = ' + fmt(k.F1) + ' + ' + fmt(k.F2) + ' = ' + f(fmt(k.FW) + ' N'))}`,
        'Merke: Die Differenz treibt das Moment. Die Summe belastet die Lager.',
      ];
    },
  }),

  task({
    id: 'ke12', karte: 'pruefen', stufe: 2, familie: 'fehler',
    title: 'Fehler finden: Bens Hebelarm am schrägen Zug',
    gen: genHebel,
    draw: (p) => B.hebelSchraeg(p),
    text: (p) => {
      const k = hebelK(p);
      return `Ben löst den Hebel mit schrägem Zug (F_1 = ${p.F1} N, β = ${p.be}°, l_1 = ${p.l1} mm, l_2 = ${p.l2} mm). Er schreibt: «M_1 = F_1 · l_1 = ${fmt((p.F1 * p.l1) / 1000)} N·m, also F_2 = ${fmt((p.F1 * p.l1) / p.l2)} N». Richtig ist F_2 = ${fmt(k.F2)} N. Was hat Ben falsch gemacht?`;
    },
    asks: (p) => [{
      kind: 'choice', k: 'Fehler',
      opts: [
        `Er nimmt den vollen Hebel l_1. Wirksam ist r_1 = l_1 · sin ${p.be}°.`,
        'Er hat die Hebellängen l_1 und l_2 vertauscht.',
        'Er muss F_1 durch sin β teilen statt multiplizieren.',
        'Er rechnet in der falschen Einheit. Es müsste m statt mm sein.',
      ],
      a: 0,
      why: [
        undefined,
        'Die Längen stehen richtig: M_1 wird durch l_2 geteilt. Der Fehler liegt im Moment M_1.',
        'Die Kraft wird nicht durch den Sinus geteilt. Der Sinus verkürzt den Hebelarm, und der wird multipliziert.',
        'Die Einheit passt. Der Fehler liegt im Hebelarm.',
      ],
    }],
    tipps: () => [
      'Welcher Teil von F_1 dreht den Hebel wirklich?',
      'Nur der Anteil senkrecht zum Hebel dreht. Das ist die Kraft F_1 · sin β am Hebel l_1.',
      'Gleichwertig: Kraft F_1 mal wirksamer Hebelarm r_1 = l_1 · sin β.',
    ],
    loesung: (p) => {
      const k = hebelK(p);
      return [
        `Wirksamer Hebelarm: ${eq(l('r_1') + ' = ' + p.l1 + ' · sin ' + p.be + '° = ' + l(fmt(k.r1) + ' mm'))}`,
        `Moment: ${eq(m('M_1') + ' = ' + p.F1 + ' · ' + fmt(k.r1 / 1000, 4) + ' = ' + m(fmt(k.M1) + ' N·m'))}`,
        `Last: ${eq(f('F_2') + ' = ' + fmt(k.M1 * 1000) + ' : ' + p.l2 + ' = ' + f(fmt(k.F2) + ' N'))}`,
        'Ein Fehler im ersten Schritt zieht sich durch die ganze Kette. Prüfe darum den ersten Schritt am genauesten.',
      ];
    },
  }),
];
