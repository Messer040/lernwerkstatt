// Aufgaben zum Kapitel «An der Wand».
import { task, type Task } from '../../../core/types';
import { eq, f, l } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import * as B from './bilder';

const rad = (a: number) => (a * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export const AUFGABEN: Task[] = [
  task({
    id: 'w1', karte: 'haken', stufe: 1, familie: 'rechnen',
    title: 'Haken in der Wand: schräger Zug',
    gen: () => ({ F: rng(200, 1200, 50), al: pick([20, 30, 40, 50, 60]) }),
    draw: (p) => B.haken(p),
    loesungsbild: (p) => B.haken(p, { comp: true }),
    text: (p) => `An einem Haken in der Wand zieht ein Seil schräg nach unten mit ${f('F = ' + p.F + ' N')}. Das Seil bildet mit der Wand den Winkel α = ${p.al}°. Berechne a) die Kraft F_A, die den Dübel aus der Wand zieht, und b) die Querkraft F_Q entlang der Wand.`,
    asks: (p) => [
      { k: 'a) F_A (Auszug)', unit: 'N', v: p.F * Math.sin(rad(p.al)) },
      { k: 'b) F_Q (quer)', unit: 'N', v: p.F * Math.cos(rad(p.al)) },
    ],
    fehler: (p) => [
      { ask: 0, v: p.F * Math.cos(rad(p.al)), msg: 'Kosinus statt Sinus. Der Winkel liegt an der Wand. Die Auszugskraft steht senkrecht zur Wand und liegt dem Winkel gegenüber.' },
      { ask: 0, v: p.F, msg: 'Das ist die ganze Seilkraft. Der Dübel spürt nur den Anteil senkrecht zur Wand.' },
      { ask: 1, v: p.F * Math.sin(rad(p.al)), msg: 'Sinus statt Kosinus. Die Kraft entlang der Wand berührt den Winkel.' },
    ],
    tipps: () => [
      'Zerlege F in eine Kraft senkrecht zur Wand und eine Kraft entlang der Wand.',
      'Der Winkel liegt an der Wand. Die Kraft entlang der Wand berührt ihn: Kosinus. Die Kraft senkrecht zur Wand liegt ihm gegenüber: Sinus.',
      'F_A = F · sin α und F_Q = F · cos α',
    ],
    loesung: (p) => [
      `Entlang der Wand (berührt α): ${eq(f('F_Q') + ' = ' + f('F') + ' · cos α = ' + p.F + ' N · cos ' + p.al + '° = ' + f(fmt(p.F * Math.cos(rad(p.al))) + ' N'))}`,
      `Senkrecht zur Wand (gegenüber α): ${eq(f('F_A') + ' = ' + f('F') + ' · sin α = ' + p.F + ' N · sin ' + p.al + '° = ' + f(fmt(p.F * Math.sin(rad(p.al))) + ' N'))}`,
      'Je flacher das Seil von der Wand weg zieht, desto grösser wird die Auszugskraft. Dübel halten Querkraft meist besser als Auszug.',
    ],
  }),

  task({
    id: 'w2', karte: 'strebe', stufe: 2, familie: 'rechnen',
    title: 'Wandkonsole mit Druckstrebe',
    gen: () => {
      let b: number, h: number;
      do { b = pick([300, 400, 500]); h = pick([200, 250, 300]); } while (b === h);
      return { F: rng(200, 800, 50), b, h };
    },
    draw: (p) => B.konsole(p),
    loesungsbild: (p) => B.konsole(p, { Z: `Zug: F_Z = ${fmt((p.F * p.b) / p.h)} N`, D: `Druck: F_D = ${fmt((p.F * Math.hypot(p.b, p.h)) / p.h)} N` }),
    text: (p) => `Eine Wandkonsole besteht aus einem waagrechten Stab oben und einer schrägen Strebe darunter. Beide sind gelenkig an der Wand befestigt. Am Ende steht eine Last mit ${f('F = ' + p.F + ' N')}. Die Ausladung ist ${l('b = ' + p.b + ' mm')}, der Abstand der Wandgelenke ${l('h = ' + p.h + ' mm')}. Berechne a) die Kraft F_Z im waagrechten Stab und b) die Kraft F_D in der Strebe.`,
    asks: (p) => [
      { k: 'a) F_Z', unit: 'N', v: (p.F * p.b) / p.h },
      { k: 'b) F_D', unit: 'N', v: (p.F * Math.hypot(p.b, p.h)) / p.h },
    ],
    fehler: (p) => {
      const L = Math.hypot(p.b, p.h);
      return [
        { ask: 0, v: (p.F * p.h) / p.b, msg: 'b und h sind vertauscht. Der waagrechte Anteil wächst mit der Ausladung b.' },
        { ask: 0, v: p.F, msg: 'Der Stab trägt nicht einfach die Last. Er hält die Konsole gegen das Wegkippen.' },
        { ask: 1, v: (p.F * p.b) / p.h, msg: 'Das ist die Kraft im waagrechten Stab. Die Strebe trägt zusätzlich die senkrechte Last.' },
        { ask: 1, v: (p.F * L) / p.b, msg: 'b und h sind vertauscht. Der senkrechte Anteil der Strebe ist h : Strebenlänge.' },
      ];
    },
    tipps: () => [
      'Betrachte den Knoten am Ende. Dort treffen Last, Stab und Strebe zusammen.',
      'Nur die Strebe hat einen senkrechten Anteil. Er muss F tragen: F_D · (h : Strebenlänge) = F.',
      'Strebenlänge = √(b² + h²). Waagrecht: F_Z = F_D · (b : Strebenlänge) = F · b : h.',
    ],
    loesung: (p) => {
      const L = Math.hypot(p.b, p.h);
      return [
        `Strebenlänge: ${eq('√(' + p.b + '² + ' + p.h + '²) = ' + fmt(L) + ' mm')}`,
        `Senkrecht am Knoten: ${eq(f('F_D') + ' · h : ' + fmt(L) + ' = ' + f('F'))}, also ${eq(f('F_D') + ' = ' + p.F + ' N · ' + fmt(L) + ' : ' + p.h + ' = ' + f(fmt((p.F * L) / p.h) + ' N'))}`,
        `Waagrecht am Knoten: ${eq(f('F_Z') + ' = ' + f('F') + ' · b : h = ' + p.F + ' N · ' + p.b + ' : ' + p.h + ' = ' + f(fmt((p.F * p.b) / p.h) + ' N'))}`,
        'Der obere Stab wird gezogen. Er zieht an der oberen Befestigung. Die Strebe wird gedrückt. Sie drückt unten gegen die Wand.',
      ];
    },
  }),

  task({
    id: 'w3', karte: 'kippen', stufe: 2, familie: 'rechnen',
    title: 'Angeschraubte Wandkonsole: Schraubenkraft',
    gen: () => {
      let a: number, h: number;
      do { a = pick([200, 250, 300, 400]); h = pick([100, 120, 150, 200]); } while (a === h);
      return { F: rng(300, 1500, 100), a, h };
    },
    draw: (p) => B.schraubK(p),
    text: (p) => `Ein Winkel ist oben mit zwei Schrauben an die Wand geschraubt. Unten liegt er an der Wand an. Auf dem Arm steht ${f('F = ' + p.F + ' N')} im Abstand ${l('a = ' + p.a + ' mm')} von der Wand. Der Abstand von den Schrauben zur unteren Kante ist ${l('h = ' + p.h + ' mm')}. Berechne a) die gesamte Schraubenkraft F_S, b) die Kraft je Schraube und c) die Anpresskraft F_K an der unteren Kante.`,
    asks: (p) => [
      { k: 'a) F_S', unit: 'N', v: (p.F * p.a) / p.h },
      { k: 'b) je Schraube', unit: 'N', v: (p.F * p.a) / p.h / 2 },
      { k: 'c) F_K', unit: 'N', v: (p.F * p.a) / p.h },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.F * p.h) / p.a, msg: 'a und h sind vertauscht. Die Last hat den grossen Hebelarm a, die Schrauben den kleinen Hebelarm h.' },
      { ask: 0, v: p.F, msg: 'Die Schrauben tragen nicht nur die Last. Sie halten das Kippmoment F · a gegen den Hebelarm h.' },
      { ask: 1, v: (p.F * p.a) / p.h, msg: 'Das ist die Kraft aller Schrauben zusammen. Teile durch 2.' },
      { ask: 2, v: p.F, msg: 'Waagrecht gleichen sich Schraubenkraft und Anpresskraft aus. F_K ist so gross wie F_S, nicht wie F.' },
    ],
    tipps: () => [
      'Die Last will den Winkel oben von der Wand wegkippen. Er kippt um die untere Kante K.',
      'Drehpunkt in K: F_S · h = F · a. Die Anpresskraft geht durch K und fällt weg.',
      'F_S = F · a : h. Waagrecht gilt F_K = F_S.',
    ],
    loesung: (p) => {
      const S = (p.F * p.a) / p.h;
      return [
        'Drehpunkt in der Kippkante K. Die Anpresskraft geht durch K und fällt weg.',
        `Momentengleichgewicht: ${eq(f('F_S') + ' · ' + l('h') + ' = ' + f('F') + ' · ' + l('a'))}`,
        `${eq(f('F_S') + ' = ' + p.F + ' N · ' + p.a + ' mm : ' + p.h + ' mm = ' + f(fmt(S) + ' N'))}`,
        `Zwei Schrauben: ${eq(fmt(S) + ' N : 2 = ' + f(fmt(S / 2) + ' N'))} je Schraube`,
        `Waagrecht: ${eq(f('F_K') + ' = ' + f('F_S') + ' = ' + f(fmt(S) + ' N'))}`,
        `Auffällig: Die Schraubenkraft ist ${fmt(p.a / p.h)}-mal so gross wie die Last. Der kurze Hebel h macht sie gross. Darum Schrauben möglichst weit von der Kippkante setzen.`,
      ];
    },
  }),

  task({
    id: 'w4', karte: 'kippen', stufe: 2, familie: 'rechnen',
    title: 'Tür an zwei Scharnieren',
    gen: () => ({ FG: rng(300, 800, 50), b: pick([800, 900, 1000]), h: pick([1500, 1600, 1800]) }),
    draw: (p) => B.tuer(p),
    text: (p) => `Eine Tür mit ${f('F_G = ' + p.FG + ' N')} hängt an zwei Scharnieren. Ihr Schwerpunkt S liegt in der Türmitte. Die Tür ist ${l('b = ' + p.b + ' mm')} breit. Die Scharniere sind ${l('h = ' + p.h + ' mm')} voneinander entfernt. Das untere Scharnier trägt das ganze Gewicht. Berechne a) die waagrechte Kraft F_O im oberen Scharnier, b) die waagrechte Kraft F_U im unteren Scharnier und c) die senkrechte Kraft F_V im unteren Scharnier.`,
    asks: (p) => [
      { k: 'a) F_O', unit: 'N', v: (p.FG * p.b) / 2 / p.h },
      { k: 'b) F_U', unit: 'N', v: (p.FG * p.b) / 2 / p.h },
      { k: 'c) F_V', unit: 'N', v: p.FG },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.FG * p.b) / p.h, msg: 'Der Hebelarm von F_G ist die halbe Türbreite, denn der Schwerpunkt liegt in der Mitte. Teile b durch 2.' },
      { ask: 0, v: (p.FG * p.h) / (p.b / 2), msg: 'b und h sind vertauscht. Die Last wirkt mit b : 2, die Scharnierkraft mit h.' },
      { ask: 1, v: (p.FG * p.b) / p.h, msg: 'Der Hebelarm von F_G ist die halbe Türbreite. Teile b durch 2.' },
      { ask: 2, v: p.FG / 2, msg: 'Laut Aufgabe trägt das untere Scharnier das ganze Gewicht, nicht die Hälfte.' },
    ],
    tipps: () => [
      'Die Tür will oben von der Wand wegkippen. Sie dreht um das untere Scharnier.',
      'Der Hebelarm von F_G ist die halbe Türbreite. Der Hebelarm von F_O ist h.',
      'F_O · h = F_G · b : 2. Waagrecht gilt F_U = F_O. Senkrecht gilt F_V = F_G.',
    ],
    loesung: (p) => {
      const O = (p.FG * p.b) / 2 / p.h;
      return [
        'Drehpunkt im unteren Scharnier. F_U und F_V gehen durch diesen Punkt.',
        `Momentengleichgewicht: ${eq(f('F_O') + ' · ' + l('h') + ' = ' + f('F_G') + ' · ' + l('b : 2'))}`,
        `${eq(f('F_O') + ' = ' + p.FG + ' N · ' + p.b / 2 + ' mm : ' + p.h + ' mm = ' + f(fmt(O) + ' N'))}`,
        `Waagrecht: ${eq(f('F_U') + ' = ' + f('F_O') + ' = ' + f(fmt(O) + ' N'))}. Oben zieht das Scharnier die Tür zur Wand, unten drückt es sie weg.`,
        `Senkrecht: ${eq(f('F_V') + ' = ' + f('F_G') + ' = ' + f(p.FG + ' N'))}`,
        'Je weiter die Scharniere auseinander liegen, desto kleiner sind die waagrechten Kräfte.',
      ];
    },
  }),

  task({
    id: 'w5', karte: 'leiter', stufe: 3, familie: 'rechnen',
    title: 'Leiter an einer glatten Wand',
    gen: () => {
      const L = pick([3, 4, 5]);
      return { L, al: pick([60, 65, 70]), FG: rng(600, 900, 50), FL: pick([100, 150, 200]), s: +(L * pick([0.6, 0.75, 0.8])).toFixed(2) };
    },
    draw: (p) => B.leiter(p),
    text: (p) => `Eine Leiter mit ${l('L = ' + fmt(p.L) + ' m')} und dem Eigengewicht ${f('F_L = ' + p.FL + ' N')} lehnt unter α = ${p.al}° an einer glatten Wand. Eine Person mit ${f('F_G = ' + p.FG + ' N')} steht ${l('s = ' + fmt(p.s) + ' m')} vom Fuss entfernt auf der Leiter. Die glatte Wand drückt nur waagrecht. Berechne a) die Wandkraft F_W, b) die Normalkraft F_N am Boden und c) die Reibungszahl μ, die der Boden mindestens haben muss.`,
    asks: (p) => {
      const c = Math.cos(rad(p.al)), sn = Math.sin(rad(p.al));
      const W = ((p.FG * p.s + (p.FL * p.L) / 2) * c) / (p.L * sn), N = p.FG + p.FL;
      return [
        { k: 'a) F_W', unit: 'N', v: W },
        { k: 'b) F_N', unit: 'N', v: N },
        { k: 'c) μ mindestens', unit: '', v: W / N, tol: 0.03 },
      ];
    },
    fehler: (p) => {
      const c = Math.cos(rad(p.al)), sn = Math.sin(rad(p.al));
      const W = ((p.FG * p.s + (p.FL * p.L) / 2) * c) / (p.L * sn), N = p.FG + p.FL;
      return [
        { ask: 0, v: ((p.FG * p.s + (p.FL * p.L) / 2) * sn) / (p.L * c), msg: 'sin und cos sind vertauscht. Die Gewichtskräfte haben den waagrechten Hebelarm Abstand · cos α. Die Wandkraft hat den senkrechten Hebelarm L · sin α.' },
        { ask: 0, v: (p.FG * p.s * c) / (p.L * sn), msg: 'Das Eigengewicht der Leiter fehlt. Es greift in der Leitermitte an und dreht ebenfalls.' },
        { ask: 1, v: p.FG, msg: 'Das Eigengewicht der Leiter F_L trägt der Boden auch. F_N = F_G + F_L.' },
        { ask: 2, v: N / W, msg: 'Zähler und Nenner sind vertauscht. μ = F_R : F_N, also kleine Kraft durch grosse Kraft.' },
        { ask: 2, v: W / p.FG, msg: 'Im Nenner fehlt das Leitergewicht. Teile durch F_N = F_G + F_L.' },
      ];
    },
    tipps: () => [
      'Drehpunkt im Fuss der Leiter. Dort greifen F_N und F_R an. Sie fallen weg.',
      'Hebelarme der Gewichtskräfte (waagrecht): Abstand · cos α. Hebelarm von F_W (senkrecht): L · sin α.',
      'F_W · L · sin α = F_G · s · cos α + F_L · (L : 2) · cos α. Dann F_N = F_G + F_L und μ = F_W : F_N.',
    ],
    loesung: (p) => {
      const c = Math.cos(rad(p.al)), sn = Math.sin(rad(p.al));
      const M = (p.FG * p.s + (p.FL * p.L) / 2) * c, W = M / (p.L * sn), N = p.FG + p.FL;
      return [
        `Drehpunkt im Fuss. Hebelarme der Gewichtskräfte (waagrecht): ${eq(fmt(p.s) + ' m · cos ' + p.al + '° = ' + fmt(p.s * c, 3) + ' m')} und ${eq(fmt(p.L / 2) + ' m · cos ' + p.al + '° = ' + fmt((p.L / 2) * c, 3) + ' m')}`,
        `Hebelarm der Wandkraft (senkrecht): ${eq(fmt(p.L) + ' m · sin ' + p.al + '° = ' + fmt(p.L * sn, 3) + ' m')}`,
        `${eq(f('F_W') + ' · ' + fmt(p.L * sn, 3) + ' m = ' + p.FG + ' N · ' + fmt(p.s * c, 3) + ' m + ' + p.FL + ' N · ' + fmt((p.L / 2) * c, 3) + ' m')}`,
        `${eq(f('F_W = ' + fmt(W) + ' N'))}`,
        `Senkrecht: ${eq(f('F_N') + ' = ' + f('F_G') + ' + ' + f('F_L') + ' = ' + f(N + ' N'))}`,
        `Waagrecht: ${eq(f('F_R') + ' = ' + f('F_W'))}. Mindestens nötig: ${eq('μ = ' + fmt(W) + ' N : ' + N + ' N = ' + fmt(W / N, 3))}`,
        'Je flacher die Leiter steht und je höher die Person steigt, desto grösser wird F_W. Dann rutscht die Leiter leichter weg.',
      ];
    },
  }),

  task({
    id: 'w6', karte: 'strebe', stufe: 3, familie: 'kette',
    title: 'Wandausleger mit Seilabspannung',
    gen: () => {
      const L = pick([2000, 2500, 3000]);
      return { L, h: pick([1000, 1200, 1500]), a: Math.round(L * pick([0.6, 0.75, 0.8])), F: rng(2, 8, 1), FE: pick([0.5, 0.8, 1]) };
    },
    draw: (p) => B.ausleger(p),
    text: (p) => `Ein waagrechter Ausleger mit ${l('L = ' + p.L + ' mm')} ist in A gelenkig an der Wand befestigt. Ein Seil hält sein Ende. Es ist ${l('h = ' + p.h + ' mm')} über A an der Wand befestigt. Im Abstand ${l('a = ' + p.a + ' mm')} hängt eine Last mit ${f('F = ' + p.F + ' kN')}. Das Eigengewicht des Auslegers ist ${f('F_E = ' + fmt(p.FE) + ' kN')}. Berechne a) die Seilkraft F_S, b) die waagrechte Gelenkkraft F_Ax und c) die senkrechte Gelenkkraft F_Ay in A.`,
    asks: (p) => {
      const M = p.F * p.a + (p.FE * p.L) / 2, len = Math.hypot(p.L, p.h);
      return [
        { k: 'a) F_S', unit: 'kN', v: ((M / p.L) * len) / p.h },
        { k: 'b) F_Ax', unit: 'kN', v: M / p.h },
        { k: 'c) F_Ay', unit: 'kN', v: p.F + p.FE - M / p.L },
      ];
    },
    fehler: (p) => {
      const M = p.F * p.a + (p.FE * p.L) / 2, Sv = M / p.L;
      return [
        { ask: 0, v: Sv, msg: 'Das ist nur der senkrechte Anteil der Seilkraft. Die Seilkraft ist grösser: F_S = Anteil · Seillänge : h.' },
        { ask: 0, v: M / p.h, msg: 'Das ist nur der waagrechte Anteil der Seilkraft (F_Ax). Rechne zur ganzen Seilkraft hoch.' },
        { ask: 1, v: Sv, msg: 'Das ist der senkrechte Seilanteil. Der waagrechte Anteil ist um L : h grösser.' },
        { ask: 2, v: p.F + p.FE, msg: 'Das Seil trägt einen Teil der Last. Ziehe den senkrechten Seilanteil von F + F_E ab.' },
      ];
    },
    tipps: () => [
      'Drehpunkt im Wandgelenk A. Die Gelenkkräfte fallen weg. Zerlege die Seilkraft am Auslegerende in senkrecht und waagrecht.',
      'Nur der senkrechte Anteil hat um A den Hebelarm L: F_S,senkrecht · L = F · a + F_E · L : 2.',
      'Seilkraft: F_S = F_S,senkrecht · Seillänge : h. Dann F_Ax = waagrechter Seilanteil und F_Ay = F + F_E − F_S,senkrecht.',
    ],
    loesung: (p) => {
      const M = p.F * p.a + (p.FE * p.L) / 2, len = Math.hypot(p.L, p.h), Sv = M / p.L;
      return [
        `Seillänge: ${eq('√(' + p.L + '² + ' + p.h + '²) = ' + fmt(len) + ' mm')}`,
        `Momente um A: ${eq('F_S,senkrecht · ' + l('L') + ' = ' + f('F') + ' · ' + l('a') + ' + ' + f('F_E') + ' · ' + l('L : 2'))}`,
        `${eq('F_S,senkrecht = (' + p.F + ' kN · ' + p.a + ' + ' + fmt(p.FE) + ' kN · ' + p.L / 2 + ') : ' + p.L + ' = ' + fmt(Sv, 3) + ' kN')}`,
        `${eq(f('F_S') + ' = ' + fmt(Sv, 3) + ' kN · ' + fmt(len) + ' : ' + p.h + ' = ' + f(fmt((Sv * len) / p.h) + ' kN'))}`,
        `Waagrecht: ${eq(f('F_Ax') + ' = ' + fmt(Sv, 3) + ' kN · ' + p.L + ' : ' + p.h + ' = ' + f(fmt(M / p.h) + ' kN'))}. Das Gelenk drückt den Ausleger von der Wand weg.`,
        `Senkrecht: ${eq(f('F_Ay') + ' = ' + p.F + ' kN + ' + fmt(p.FE) + ' kN − ' + fmt(Sv, 3) + ' kN = ' + f(fmt(p.F + p.FE - Sv) + ' kN'))}`,
      ];
    },
  }),

  // ---------- neue Familien ----------

  task({
    id: 'w7', karte: 'haken', stufe: 1, familie: 'fehler',
    title: 'Fehler finden: Tims Dübel',
    gen: () => ({ F: rng(200, 1200, 50), al: pick([20, 30, 40, 50, 60]) }),
    draw: (p) => B.haken(p, { F: `F = ${p.F} N`, al: `α = ${p.al}°` }),
    text: (p) => `Tim rechnet die Auszugskraft am Dübel: «F_A = F · cos α = ${p.F} N · cos ${p.al}° = ${fmt(p.F * Math.cos(rad(p.al)))} N». Der Winkel α = ${p.al}° liegt zwischen Seil und Wand. Was ist falsch?`,
    asks: (p) => [{
      kind: 'choice', k: 'Fehler',
      opts: [
        `Kosinus statt Sinus. Richtig ist F_A = F · sin α = ${fmt(p.F * Math.sin(rad(p.al)))} N.`,
        'Er hätte F durch cos α teilen müssen.',
        'Er hätte F_Q und F zusammenzählen müssen.',
        'Nichts, die Rechnung stimmt.',
      ],
      a: 0,
      why: [
        undefined,
        'Teilen macht die Kraft grösser als F. Der Dübel spürt aber nur einen Teil von F.',
        'Die Teilkräfte stehen im rechten Winkel zueinander. Sie werden nicht einfach zusammengezählt.',
        'Der Winkel liegt an der Wand. Die Auszugskraft liegt ihm gegenüber. Dazu gehört der Sinus.',
      ],
    }],
    tipps: () => [
      'Frage: Liegt die gesuchte Teilkraft am Winkel oder gegenüber?',
      'Die Auszugskraft steht senkrecht zur Wand. Der Winkel α liegt zwischen Seil und Wand.',
      'Gegenüber dem Winkel heisst Sinus.',
    ],
    loesung: (p) => [
      'Die Auszugskraft F_A steht senkrecht zur Wand. Sie liegt dem Winkel α gegenüber.',
      `Gegenüber heisst Sinus: ${eq(f('F_A') + ' = ' + f('F') + ' · sin α = ' + p.F + ' N · sin ' + p.al + '° = ' + f(fmt(p.F * Math.sin(rad(p.al))) + ' N'))}`,
      'Kontrolle mit Gefühl: Bei kleinem α zieht das Seil fast entlang der Wand. Dann muss F_A klein sein. Tims Wert ist dann fast so gross wie F.',
    ],
  }),

  task({
    id: 'w8', karte: 'kippen', stufe: 1, familie: 'schaetzen',
    title: 'Schätzen: Schraubenkraft am Wandwinkel',
    gen: () => {
      const h = pick([100, 150]), r = pick([2, 3, 4]);
      return { F: pick([100, 150, 200, 250, 300]), h, a: r * h, r };
    },
    draw: (p) => B.schraubK(p),
    text: (p) => `Ein Wandwinkel ist oben angeschraubt und liegt unten an. Die Last ist ${f('F = ' + p.F + ' N')}, der Hebelarm der Last ${l('a = ' + p.a + ' mm')} und der Abstand der Schrauben zur Kippkante ${l('h = ' + p.h + ' mm')}. Ohne Taschenrechner: Wie gross ist die Schraubenkraft F_S ungefähr?`,
    asks: (p) => [{
      kind: 'choice', k: 'F_S etwa',
      opts: [`${fmt(p.F)} N`, `${fmt(p.F * p.r)} N`, `${fmt(p.F * p.r * p.r)} N`],
      a: 1,
      why: [
        'Zu klein. Der Hebelarm a ist grösser als h. Die Schrauben müssen mehr halten als die Last.',
        undefined,
        'Zu gross. Das Verhältnis a : h kommt nur einmal vor, nicht im Quadrat.',
      ],
    }],
    tipps: () => [
      'Schaue nur auf das Verhältnis a : h.',
      'F_S = F · (a : h). Hier ist a ein Vielfaches von h.',
      'Rechne a : h im Kopf und nimm es mal F.',
    ],
    loesung: (p) => [
      `Verhältnis der Hebelarme: ${eq(p.a + ' : ' + p.h + ' = ' + p.r)}`,
      `${eq(f('F_S') + ' = ' + f('F') + ' · a : h = ' + p.F + ' N · ' + p.r + ' = ' + f(fmt(p.F * p.r) + ' N'))}`,
      'Merke: Je kürzer der Hebelarm der Schrauben, desto grösser ihre Kraft.',
    ],
  }),

  task({
    id: 'w9', karte: 'kippen', stufe: 2, familie: 'umgekehrt',
    title: 'Umgekehrt: Wie weit auseinander müssen die Scharniere sein?',
    gen: () => {
      const FG = rng(400, 800, 50), b = pick([800, 900, 1000]), Fz = pick([100, 150, 200]);
      return { FG, b, Fz, h: (FG * b) / 2 / Fz };
    },
    draw: (p) => B.tuer(p, { O: `F_O = ${p.Fz} N`, U: `F_U = ${p.Fz} N`, h: 'h = ?' }),
    text: (p) => `Eine Tür mit ${f('F_G = ' + p.FG + ' N')} und der Breite ${l('b = ' + p.b + ' mm')} hängt an zwei Scharnieren. Der Schwerpunkt liegt in der Türmitte. Ein Scharnier mit Dübel hält waagrecht höchstens ${f('F_O = ' + p.Fz + ' N')}. Wie weit müssen die Scharniere mindestens auseinander liegen (Abstand h)?`,
    asks: (p) => [{ k: 'h', unit: 'mm', v: p.h }],
    fehler: (p) => [
      { ask: 0, v: (p.FG * p.b) / p.Fz, msg: 'Der Hebelarm von F_G ist die halbe Türbreite. Teile b durch 2.' },
      { ask: 0, v: (p.Fz * p.b) / 2 / p.FG, msg: 'Die Kräfte sind vertauscht. Mit wenig zulässiger Kraft braucht es einen grossen Abstand.' },
    ],
    tipps: () => [
      'Drehpunkt im unteren Scharnier: F_O · h = F_G · b : 2.',
      'Stelle nach h um.',
      'h = F_G · b : (2 · F_O)',
    ],
    loesung: (p) => [
      `Momentengleichgewicht: ${eq(f('F_O') + ' · ' + l('h') + ' = ' + f('F_G') + ' · ' + l('b : 2'))}`,
      `Umstellen: ${eq(l('h') + ' = ' + f('F_G') + ' · ' + l('b : 2') + ' : ' + f('F_O'))}`,
      `Einsetzen: ${eq(l('h') + ' = ' + p.FG + ' N · ' + p.b / 2 + ' mm : ' + p.Fz + ' N = ' + l(fmt(p.h) + ' mm'))}`,
      'Merke: Kleine zulässige Kraft heisst grosser Abstand. Darum liegen Türscharniere weit auseinander.',
    ],
  }),

  task({
    id: 'w10', karte: 'kippen', stufe: 2, familie: 'waswaere',
    title: 'Was wäre wenn: Schrauben weiter von der Kippkante',
    gen: () => {
      const h = pick([100, 120, 150]);
      return { F: rng(300, 1200, 100), a: pick([200, 250, 300, 400]), h, hn: 2 * h };
    },
    draw: (p) => B.schraubK({ F: p.F, a: p.a, h: p.hn }),
    text: (p) => `Ein Wandwinkel trägt ${f('F = ' + p.F + ' N')} im Abstand ${l('a = ' + p.a + ' mm')}. Die Schrauben sitzen ${l('h = ' + p.h + ' mm')} über der Kippkante. Du setzt die Schrauben doppelt so hoch, also ${l('h = ' + p.hn + ' mm')} (Bild). a) Was passiert mit der Schraubenkraft? b) Wie gross ist sie danach?`,
    asks: (p) => [
      { kind: 'choice', k: 'a) Schraubenkraft', opts: ['wird halb so gross', 'bleibt gleich', 'wird doppelt so gross'], a: 0, why: [undefined, 'Der Hebelarm der Schrauben wird länger. Dann genügt eine kleinere Kraft.', 'Der Hebelarm der Schrauben wird länger, nicht kürzer. Die Kraft sinkt.'] },
      { k: 'b) F_S neu', unit: 'N', v: (p.F * p.a) / p.hn },
    ],
    fehler: (p) => [{ ask: 1, v: (p.F * p.a) / p.h, msg: 'Das ist die Kraft vorher. Rechne mit dem neuen Abstand h.' }],
    tipps: () => [
      'Nur der Hebelarm h der Schrauben ändert sich.',
      'F_S · h = F · a. Wird h doppelt so gross, wird F_S nur halb so gross.',
      'F_S,neu = F · a : h_neu',
    ],
    loesung: (p) => [
      `Momentengleichgewicht: ${eq(f('F_S') + ' · ' + l('h') + ' = ' + f('F') + ' · ' + l('a'))}`,
      `Neu: ${eq(f('F_S') + ' = ' + p.F + ' N · ' + p.a + ' mm : ' + p.hn + ' mm = ' + f(fmt((p.F * p.a) / p.hn) + ' N'))}`,
      `Vorher waren es ${fmt((p.F * p.a) / p.h)} N. Doppelter Hebelarm heisst halbe Kraft.`,
    ],
  }),

  task({
    id: 'w11', karte: 'haken', stufe: 2, familie: 'umgekehrt',
    title: 'Umgekehrt: Wie schräg darf das Seil ziehen?',
    gen: () => {
      const F = rng(400, 1200, 100), al0 = pick([20, 30, 40, 50]);
      const Fz = Math.round((F * Math.sin(rad(al0))) / 5) * 5;
      return { F, Fz, al: deg(Math.asin(Fz / F)) };
    },
    draw: (p) => B.haken(p, { F: `F = ${p.F} N`, al: 'α = ?' }),
    text: (p) => `Ein Dübel hält senkrecht zur Wand höchstens ${f('F_A = ' + p.Fz + ' N')}. Ein Seil zieht am Haken mit ${f('F = ' + p.F + ' N')} schräg nach unten. Wie gross darf der Winkel α zwischen Seil und Wand höchstens sein?`,
    asks: (p) => [{ k: 'α', unit: '°', v: p.al }],
    fehler: (p) => [{ ask: 0, v: 90 - p.al, msg: 'Kosinus statt Sinus. F_A liegt dem Winkel α gegenüber: sin α = F_A : F.' }],
    tipps: () => [
      'Es gilt F_A = F · sin α. Stelle nach sin α um.',
      'sin α = F_A : F',
      'α = sin⁻¹(F_A : F). Am Taschenrechner die Taste sin⁻¹ oder arcsin.',
    ],
    loesung: (p) => [
      `Formel umstellen: ${eq('sin α = ' + f('F_A') + ' : ' + f('F'))}`,
      `Einsetzen: ${eq('sin α = ' + p.Fz + ' N : ' + p.F + ' N = ' + fmt(p.Fz / p.F, 3))}`,
      `Winkel: ${eq('α = ' + fmt(p.al, 1) + '°')}`,
      'Zieht das Seil flacher von der Wand weg, wird der Winkel grösser und der Dübel hält nicht mehr.',
    ],
  }),

  task({
    id: 'w12', karte: 'leiter', stufe: 3, familie: 'fehler',
    title: 'Fehler finden: Bens Reibungszahl',
    gen: () => {
      const L = pick([3, 4, 5]);
      return { L, al: pick([60, 65, 70]), FG: rng(600, 900, 50), FL: pick([100, 150, 200]), s: +(L * pick([0.6, 0.75, 0.8])).toFixed(2) };
    },
    draw: (p) => {
      const W = ((p.FG * p.s + (p.FL * p.L) / 2) * Math.cos(rad(p.al))) / (p.L * Math.sin(rad(p.al)));
      return B.leiter(p, { W: `F_W = ${fmt(W)} N`, N: `F_N = ${p.FG + p.FL} N`, R: `F_R = ${fmt(W)} N` });
    },
    text: (p) => {
      const W = ((p.FG * p.s + (p.FL * p.L) / 2) * Math.cos(rad(p.al))) / (p.L * Math.sin(rad(p.al))), N = p.FG + p.FL;
      return `Eine Leiter lehnt an einer glatten Wand. Am Fuss wirken ${f('F_N = ' + N + ' N')} und ${f('F_R = ' + fmt(W) + ' N')}. Ben rechnet die nötige Reibungszahl: «μ = F_N : F_R = ${fmt(N / W)}». Was ist falsch?`;
    },
    asks: (p) => {
      const W = ((p.FG * p.s + (p.FL * p.L) / 2) * Math.cos(rad(p.al))) / (p.L * Math.sin(rad(p.al))), N = p.FG + p.FL;
      return [{
        kind: 'choice', k: 'Fehler',
        opts: [
          `Zähler und Nenner sind vertauscht. Richtig ist μ = F_R : F_N = ${fmt(W / N)}.`,
          'Die Reibungszahl muss mit der Wandkraft F_W gerechnet werden.',
          'Nichts. Eine Reibungszahl über 1 ist bei Holz und Aluminium normal.',
          'Er muss F_N noch durch 2 teilen.',
        ],
        a: 0,
        why: [
          undefined,
          'F_W und F_R sind gleich gross. Das ist nicht der Fehler.',
          'Trockene Böden haben meist μ unter 1. Ein Wert über 1 ist ein Warnsignal.',
          'F_N ist bereits die ganze Kraft senkrecht auf den Boden. Es wird nicht geteilt.',
        ],
      }];
    },
    tipps: () => [
      'Die Reibungskraft ist F_R = μ · F_N.',
      'Stelle nach μ um. Welche Kraft steht oben?',
      'μ = F_R : F_N',
    ],
    loesung: (p) => {
      const W = ((p.FG * p.s + (p.FL * p.L) / 2) * Math.cos(rad(p.al))) / (p.L * Math.sin(rad(p.al))), N = p.FG + p.FL;
      return [
        `Reibung: ${eq(f('F_R') + ' = μ · ' + f('F_N'))}`,
        `Umstellen: ${eq('μ = ' + f('F_R') + ' : ' + f('F_N') + ' = ' + fmt(W) + ' N : ' + N + ' N = ' + fmt(W / N, 3))}`,
        'Kontrolle mit Gefühl: Gummi auf Beton hat μ von etwa 0,6 bis 0,8. Ein Wert über 1 ist unrealistisch.',
      ];
    },
  }),
];
