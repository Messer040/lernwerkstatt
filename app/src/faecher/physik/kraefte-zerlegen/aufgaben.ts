// Aufgaben zum Kapitel Kräfte zerlegen.
import { task, type Task } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import { saeulen } from '../../../core/draw/svg';
import * as B from './bilder';

const rad = (a: number) => (a * Math.PI) / 180;
const deg = (x: number) => (x * 180) / Math.PI;
/** Kraft je Schenkel/Seil bei symmetrischer Anordnung, be = Winkel zur Senkrechten (rad). */
const sym = (FG: number, be: number) => FG / (2 * Math.cos(be));

export const AUFGABEN: Task[] = [
  // ───────── Karte: rechtwinklig ─────────
  task({
    id: 'z1', karte: 'rechtwinklig', stufe: 1, familie: 'rechnen',
    title: 'Schlitten: Kraft in zwei rechtwinklige Teilkräfte zerlegen',
    gen: () => {
      const F = rng(100, 400, 20), a = pick([20, 25, 30, 35, 40]);
      return { F, F1: Math.round(F * Math.cos(rad(a))) };
    },
    draw: (p) => B.schraeg({ F: p.F, al: deg(Math.acos(p.F1 / p.F)) }, { Fx: `F_1 = ${p.F1} N`, Fy: 'F_2 = ?', alTxt: 'α = ?' }),
    text: (p) => `Ein Schlitten wird an einem schrägen Seil mit ${f('F = ' + p.F + ' N')} gezogen. Für die Fortbewegung wirkt davon nur die waagrechte Teilkraft ${f('F₁ = ' + p.F1 + ' N')}. Berechne a) die senkrechte Teilkraft F₂, die den Schlitten vorn anhebt, und b) den Winkel α zwischen Seil und Boden.`,
    asks: (p) => [
      { k: 'a) F₂', unit: 'N', v: Math.sqrt(p.F * p.F - p.F1 * p.F1) },
      { k: 'b) α', unit: '°', v: deg(Math.acos(p.F1 / p.F)) },
    ],
    fehler: (p) => [
      { ask: 0, v: p.F - p.F1, msg: 'Kräfte, die rechtwinklig zueinander stehen, darfst du nicht einfach abziehen. F ist die Hypotenuse: Pythagoras.' },
      { ask: 1, v: 90 - deg(Math.acos(p.F1 / p.F)), msg: 'Das ist der Winkel zur Senkrechten. F₁ berührt den Winkel α, also gilt cos α = F₁ : F.' },
    ],
    tipps: () => [
      'Die Teilkräfte stehen rechtwinklig zueinander. F ist die Hypotenuse.',
      'Pythagoras: F₂ = √(F² − F₁²)',
      'F₁ berührt den Winkel: cos α = F₁ : F',
    ],
    loesung: (p) => [
      `Rechtwinkliges Kräftedreieck: ${eq(f('F') + '² = ' + f('F₁') + '² + ' + f('F₂') + '²')}`,
      `${eq(f('F₂') + ' = √((' + p.F + ' N)² − (' + p.F1 + ' N)²) = ' + f(fmt(Math.sqrt(p.F * p.F - p.F1 * p.F1)) + ' N'))}`,
      `Winkel: ${eq('cos α = ' + f('F₁') + ' : ' + f('F') + ' = ' + p.F1 + ' : ' + p.F + ' = ' + fmt(p.F1 / p.F, 3))}, also ${eq('α = ' + fmt(deg(Math.acos(p.F1 / p.F)), 1) + '°')}`,
    ],
    loesungsbild: (p) => B.schraeg({ F: p.F, al: deg(Math.acos(p.F1 / p.F)) }, {
      Fx: `F_1 = ${p.F1} N`, Fy: `F_2 = ${fmt(Math.sqrt(p.F * p.F - p.F1 * p.F1))} N`, alTxt: `α = ${fmt(deg(Math.acos(p.F1 / p.F)), 1)}°`,
    }),
  }),

  task({
    id: 'z11', karte: 'rechtwinklig', stufe: 2, familie: 'rechnen',
    title: 'Dieselmotor: Kolben und Pleuel', src: 'Buch Kräfte, Nr. 3',
    gen: () => ({ F: pick([30, 42, 50]), al: pick([10, 15, 20]) }),
    draw: (p) => B.diesel(p),
    text: (p) => `Auf den Kolben eines Dieselmotors wirkt ${f('F = ' + p.F + ' kN')}. Die Pleuelstange steht ${p.al}° schräg. Wie gross sind ohne Reibung a) die Kraft F_N, mit der der Kolben auf die Zylinderwand drückt, und b) die Kraft F_P in der Pleuelstange?`,
    asks: (p) => [
      { k: 'a) F_N', unit: 'kN', v: p.F * Math.tan(rad(p.al)) },
      { k: 'b) F_P', unit: 'kN', v: p.F / Math.cos(rad(p.al)) },
    ],
    fehler: (p) => [
      { ask: 0, v: p.F / Math.tan(rad(p.al)), msg: 'Gegenkathete und Ankathete sind vertauscht. Es gilt tan α = F_N : F, also F_N = F · tan α.' },
      { ask: 1, v: p.F * Math.cos(rad(p.al)), msg: 'Multipliziert statt dividiert. F_P ist die Hypotenuse und muss grösser sein als F.' },
      { ask: 1, v: p.F / Math.sin(rad(p.al)), msg: 'F liegt am Winkel an, also gehört cos α in die Rechnung, nicht sin α.' },
    ],
    tipps: () => [
      'F wird zerlegt in F_P (entlang der Pleuelstange) und F_N (waagrecht).',
      'Zeichne das Kräftedreieck: F senkrecht, F_N waagrecht, F_P schräg als Hypotenuse.',
      'cos α = F : F_P und tan α = F_N : F',
    ],
    loesung: (p) => [
      `a) ${eq(f('F_N') + ' = ' + p.F + ' · tan ' + p.al + '° = ' + f(fmt(p.F * Math.tan(rad(p.al)), 2) + ' kN'))}`,
      `b) ${eq(f('F_P') + ' = ' + p.F + ' : cos ' + p.al + '° = ' + f(fmt(p.F / Math.cos(rad(p.al)), 2) + ' kN'))}`,
      'F_P ist immer etwas grösser als F. Die Hypotenuse ist die längste Seite.',
    ],
  }),

  task({
    id: 'z13', karte: 'rechtwinklig', stufe: 1, familie: 'rechnen',
    title: 'Schrägstirnrad: Umfangs- und Axialkraft', src: 'Buch Kräfte, Nr. 6',
    gen: () => ({ FN: pick([140, 500, 1200]), be: pick([10, 15, 20]) }),
    draw: (p) => B.schraegrad(p),
    text: (p) => `Ein Schrägstirnrad hat den Schrägungswinkel β = ${p.be}°. Auf die Zahnflanken wirkt ${f('F_N = ' + p.FN + ' N')}. Wie gross sind die Umfangskraft F_u und die Axialkraft F_a?`,
    asks: (p) => [
      { k: 'F_u', unit: 'N', v: p.FN * Math.cos(rad(p.be)) },
      { k: 'F_a', unit: 'N', v: p.FN * Math.sin(rad(p.be)) },
    ],
    fehler: (p) => [
      { ask: 0, v: p.FN * Math.sin(rad(p.be)), msg: 'sin und cos sind vertauscht. F_u liegt am Winkel β an, also gilt F_u = F_N · cos β.' },
      { ask: 1, v: p.FN * Math.cos(rad(p.be)), msg: 'sin und cos sind vertauscht. F_a liegt gegenüber von β, also gilt F_a = F_N · sin β.' },
    ],
    tipps: () => [
      'F_N ist um β gegen die Umfangsrichtung geneigt. F_N ist die Hypotenuse.',
      'Zeichne das Dreieck: F_u liegt am Winkel β an, F_a liegt gegenüber.',
      'F_u = F_N · cos β und F_a = F_N · sin β',
    ],
    loesung: (p) => [
      `${eq(f('F_u') + ' = ' + p.FN + ' · cos ' + p.be + '° = ' + f(fmt(p.FN * Math.cos(rad(p.be))) + ' N'))}`,
      `${eq(f('F_a') + ' = ' + p.FN + ' · sin ' + p.be + '° = ' + f(fmt(p.FN * Math.sin(rad(p.be))) + ' N'))}`,
      'Die Axialkraft drückt die Welle in Längsrichtung. Darum braucht ein Schrägstirnrad ein Axiallager.',
    ],
  }),

  task({
    id: 'z18', karte: 'rechtwinklig', stufe: 2, familie: 'fehler',
    title: 'Pleuelkraft: Wo steckt der Fehler?', src: 'Kreativ · Fehler finden',
    gen: () => ({ F: pick([30, 42, 50]), al: pick([12, 15, 18]) }),
    draw: (p) => B.diesel(p),
    text: (p) => `Ein Lernender rechnet die Pleuelkraft so:<ol class="fehlerliste"><li>F_P = F · cos ${p.al}°</li><li>F_P = ${p.F} · ${fmt(Math.cos(rad(p.al)), 3)} = ${fmt(p.F * Math.cos(rad(p.al)), 2)} kN</li></ol>Finde den Fehler. Wie gross ist F_P richtig?`,
    asks: (p) => [{ k: 'F_P', unit: 'kN', v: p.F / Math.cos(rad(p.al)) }],
    fehler: (p) => [{ ask: 0, v: p.F * Math.cos(rad(p.al)), msg: 'Das ist der Wert des Lernenden. Er hat multipliziert statt dividiert.' }],
    tipps: () => [
      'Plausibilität: Kann die Pleuelkraft kleiner sein als F, wenn F ihr senkrechter Anteil ist?',
      'F ist die Ankathete, F_P die Hypotenuse.',
      'cos α = F : F_P, also F_P = F : cos α',
    ],
    loesung: (p) => [
      'Fehler: Multipliziert statt dividiert. F ist der senkrechte Anteil von F_P, also die kürzere Seite.',
      `${eq(f('F_P') + ' = ' + p.F + ' : cos ' + p.al + '° = ' + f(fmt(p.F / Math.cos(rad(p.al)), 2) + ' kN'))}`,
      'Test: Die Hypotenuse (schräge Kraft) ist immer die grösste Kraft im Dreieck.',
    ],
  }),

  task({
    id: 'z17', karte: 'rechtwinklig', stufe: 3, familie: 'kette',
    title: 'Schrägstirnrad aus dem Drehmoment', src: 'Kreativ · Themen kombiniert',
    gen: () => ({ M: pick([50, 120, 200]), d: pick([80, 100, 150]), be: pick([10, 15, 20]) }),
    draw: (p) => B.schraegrad({ be: p.be, FN: '?' }, { FN: 'F_N = ?' }),
    text: (p) => `Ein Schrägstirnrad (${l('d = ' + p.d + ' mm')}, β = ${p.be}°) überträgt ${m('M = ' + p.M + ' N·m')}. Berechne a) die Umfangskraft F_u, b) die Normalkraft F_N auf die Flanken und c) die Axialkraft F_a.`,
    asks: (p) => {
      const Fu = (2 * p.M * 1000) / p.d;
      return [
        { k: 'a) F_u', unit: 'N', v: Fu },
        { k: 'b) F_N', unit: 'N', v: Fu / Math.cos(rad(p.be)) },
        { k: 'c) F_a', unit: 'N', v: Fu * Math.tan(rad(p.be)) },
      ];
    },
    fehler: (p) => {
      const Fu = (2 * p.M * 1000) / p.d;
      return [
        { ask: 0, v: (p.M * 1000) / p.d, msg: 'Du hast den Durchmesser als Hebelarm genommen. Der Hebelarm ist der Radius d : 2.' },
        { ask: 1, v: Fu * Math.cos(rad(p.be)), msg: 'Multipliziert statt dividiert. F_N ist die Hypotenuse und grösser als F_u.' },
        { ask: 2, v: Fu / Math.tan(rad(p.be)), msg: 'Tangens ist vertauscht. Die Axialkraft ist die kleine Kraft: F_a = F_u · tan β.' },
      ];
    },
    tipps: () => [
      'Erst das Drehmoment in die Umfangskraft umrechnen, dann zerlegen.',
      'F_u = M : r = 2 · M : d. Rechne M in N·mm und d in mm.',
      'F_N = F_u : cos β und F_a = F_u · tan β',
    ],
    loesung: (p) => {
      const Fu = (2 * p.M * 1000) / p.d;
      return [
        `a) ${eq(f('F_u') + ' = 2 · ' + p.M * 1000 + ' N·mm : ' + p.d + ' mm = ' + f(fmt(Fu) + ' N'))}`,
        `b) ${eq(f('F_N') + ' = ' + fmt(Fu) + ' : cos ' + p.be + '° = ' + f(fmt(Fu / Math.cos(rad(p.be))) + ' N'))}`,
        `c) ${eq(f('F_a') + ' = ' + fmt(Fu) + ' · tan ' + p.be + '° = ' + f(fmt(Fu * Math.tan(rad(p.be))) + ' N'))}`,
        'Kombiniert: Drehmoment, Umfangskraft, Kräfte zerlegen.',
      ];
    },
  }),

  // ───────── Karte: symmetrisch ─────────
  task({
    id: 'z2', karte: 'symmetrisch', stufe: 1, familie: 'rechnen',
    title: 'Stechzirkel: Kraft in den Schenkeln',
    gen: () => ({ FG: rng(4, 12, 1), al: pick([60, 90, 120]) }),
    draw: (p) => B.spreiz(p, { FG: `F_G = ${p.FG} N` }),
    text: (p) => `Ein Stechzirkel steht senkrecht auf einer Unterlage. Oben drückt ${f('F_G = ' + p.FG + ' N')}. Der Öffnungswinkel zwischen den Schenkeln ist α = ${p.al}°. Mit welcher Kraft F₁ drückt jeder Schenkel in seiner Richtung auf die Unterlage?`,
    asks: (p) => [{ k: 'F₁ = F₂', unit: 'N', v: sym(p.FG, rad(p.al / 2)) }],
    fehler: (p) => [
      { ask: 0, v: p.FG / 2, msg: 'Du hast den Winkel vergessen. Die Schenkel stehen schräg. Nur ihr senkrechter Anteil trägt F_G.' },
      ...(p.al !== 90 ? [{ ask: 0, v: p.FG / (2 * Math.sin(rad(p.al / 2))), msg: 'sin und cos sind vertauscht. Der Winkel α : 2 liegt zur Senkrechten, also gehört cos in die Rechnung.' }] : []),
    ],
    tipps: () => [
      'Die Anordnung ist symmetrisch. Beide Schenkelkräfte sind gleich gross.',
      'Jeder Schenkel steht unter α : 2 zur Senkrechten. Nur sein senkrechter Anteil trägt.',
      '2 · F₁ · cos(α : 2) = F_G',
    ],
    loesung: (p) => [
      `Winkel jedes Schenkels zur Senkrechten: ${eq('α : 2 = ' + p.al / 2 + '°')}`,
      `Senkrechte Anteile: ${eq('2 · ' + f('F₁') + ' · cos(α : 2) = ' + f('F_G'))}`,
      `${eq(f('F₁') + ' = ' + f('F_G') + ' : (2 · cos ' + p.al / 2 + '°) = ' + p.FG + ' N : ' + fmt(2 * Math.cos(rad(p.al / 2)), 3) + ' = ' + f(fmt(sym(p.FG, rad(p.al / 2))) + ' N'))}`,
      'Je weiter der Zirkel geöffnet ist, desto grösser werden die Schenkelkräfte. Bei α = 120° ist jede so gross wie F_G.',
    ],
  }),

  task({
    id: 'z3', karte: 'symmetrisch', stufe: 2, familie: 'rechnen',
    title: 'Stehleiter auf ebenem Boden',
    gen: () => ({ FG: rng(600, 900, 50), al: pick([30, 40, 50]) }),
    draw: (p) => B.spreiz(p, { typ: 'leiter', FG: `F_G = ${p.FG} N` }),
    text: (p) => `Auf einer Stehleiter steht oben eine Person mit ${f('F_G = ' + p.FG + ' N')}. Die beiden Leiterteile schliessen den Winkel α = ${p.al}° ein und stehen symmetrisch. Wie gross ist die Kraft F₁ in jedem Leiterteil?`,
    asks: (p) => [{ k: 'F₁ = F₂', unit: 'N', v: sym(p.FG, rad(p.al / 2)) }],
    fehler: (p) => [
      { ask: 0, v: p.FG / 2, msg: 'Du hast den Winkel vergessen. Die Leiterteile stehen schräg. Nur ihr senkrechter Anteil trägt F_G.' },
      { ask: 0, v: p.FG / (2 * Math.sin(rad(p.al / 2))), msg: 'sin und cos sind vertauscht. Der Winkel α : 2 liegt zur Senkrechten, also gehört cos in die Rechnung.' },
    ],
    tipps: () => [
      'Symmetrisch: Beide Leiterteile tragen gleich viel.',
      'Jeder Leiterteil steht unter α : 2 zur Senkrechten.',
      'F₁ = F_G : (2 · cos(α : 2))',
    ],
    loesung: (p) => [
      `${eq('2 · ' + f('F₁') + ' · cos(α : 2) = ' + f('F_G'))}`,
      `${eq(f('F₁') + ' = ' + p.FG + ' N : (2 · cos ' + p.al / 2 + '°) = ' + f(fmt(sym(p.FG, rad(p.al / 2))) + ' N'))}`,
      `Auffällig: Die Summe beider Kräfte ist ${fmt(2 * sym(p.FG, rad(p.al / 2)))} N. Das ist mehr als F_G, weil die Kräfte schräg wirken.`,
    ],
  }),

  task({
    id: 'z4', karte: 'symmetrisch', stufe: 2, familie: 'rechnen',
    title: 'Gemälde am Draht',
    gen: () => {
      const [L, b] = pick([[2, 1], [2, 1.2], [2.6, 1], [2.5, 1.5], [1.6, 0.8]]);
      return { FG: rng(80, 250, 10), L, b, hw: b / 2, hh: Math.sqrt(L * L - b * b) / 2 };
    },
    draw: (p) => B.haengend(p, { typ: 'bild', FG: `F_G = ${p.FG} N`, b: `b = ${fmt(p.b)} m`, L: `Draht gesamt L = ${fmt(p.L)} m` }),
    text: (p) => `Ein Gemälde mit ${f('F_G = ' + p.FG + ' N')} hängt waagrecht an einem Draht mit der Länge ${l('L = ' + fmt(p.L) + ' m')}. Der Draht läuft über einen Haken. Seine Enden sind ${l('b = ' + fmt(p.b) + ' m')} voneinander entfernt. Berechne a) den Winkel β zwischen Draht und Senkrechter und b) die Zugkraft F im Draht.`,
    asks: (p) => [
      { k: 'a) β', unit: '°', v: deg(Math.asin(p.b / p.L)) },
      { k: 'b) F', unit: 'N', v: sym(p.FG, Math.asin(p.b / p.L)) },
    ],
    fehler: (p) => [
      { ask: 0, v: deg(Math.acos(p.b / p.L)), msg: 'Das ist der Winkel zur Waagrechten. β wird zur Senkrechten gemessen: sin β = b : L.' },
      { ask: 1, v: p.FG / 2, msg: 'Du hast den Winkel vergessen. Der Draht hängt schräg. Nur sein senkrechter Anteil trägt F_G.' },
      { ask: 1, v: p.FG / (2 * Math.sin(Math.asin(p.b / p.L))), msg: 'sin und cos sind vertauscht. β liegt zur Senkrechten, also gehört cos β in die Rechnung.' },
    ],
    tipps: () => [
      'Jede Drahthälfte ist L : 2 lang. Waagrecht überbrückt sie b : 2.',
      'sin β = (b : 2) : (L : 2) = b : L',
      'F = F_G : (2 · cos β)',
    ],
    loesung: (p) => {
      const be = Math.asin(p.b / p.L);
      return [
        `Halber Draht ${fmt(p.L / 2)} m (Hypotenuse), halber Abstand ${fmt(p.b / 2)} m (Gegenkathete).`,
        `${eq('sin β = ' + fmt(p.b / 2) + ' m : ' + fmt(p.L / 2) + ' m = ' + fmt(p.b / p.L, 3))}, also ${eq('β = ' + fmt(deg(be), 1) + '°')}`,
        `Senkrechte Anteile: ${eq('2 · ' + f('F') + ' · cos β = ' + f('F_G'))}`,
        `${eq(f('F') + ' = ' + p.FG + ' N : (2 · cos ' + fmt(deg(be), 1) + '°) = ' + f(fmt(sym(p.FG, be)) + ' N'))}`,
      ];
    },
  }),

  task({
    id: 'z5', karte: 'symmetrisch', stufe: 2, familie: 'rechnen',
    title: 'Rohr am Kranhaken',
    gen: () => {
      const [wd, h] = pick([[3200, 1200], [2400, 1600], [3000, 2000], [2400, 900]]);
      return { FG: rng(1500, 4000, 500), b: wd, h, hw: wd / 2, hh: h };
    },
    draw: (p) => B.haengend(p, { FG: `F_G = ${p.FG} N`, b: `b = ${p.b}`, h: `h = ${p.h}` }),
    text: (p) => `Ein Rohr mit ${f('F_G = ' + p.FG + ' N')} hängt an zwei gleich langen Seilstücken am Kranhaken. Die Anschlagpunkte sind ${l('b = ' + p.b + ' mm')} voneinander entfernt. Der Haken liegt ${l('h = ' + p.h + ' mm')} darüber. Berechne a) die Länge eines Seilstücks und b) die Zugkraft F im Seil.`,
    asks: (p) => {
      const L = Math.hypot(p.b / 2, p.h);
      return [
        { k: 'a) Seillänge', unit: 'mm', v: L },
        { k: 'b) F', unit: 'N', v: (p.FG * L) / (2 * p.h) },
      ];
    },
    fehler: (p) => {
      const L = Math.hypot(p.b / 2, p.h);
      return [
        { ask: 0, v: Math.hypot(p.b, p.h), msg: 'Du hast die ganze Breite b genommen. Ein Seilstück überbrückt waagrecht nur b : 2.' },
        { ask: 1, v: (p.FG * L) / p.b, msg: 'Der senkrechte Anteil ist h : Seillänge (cos β), nicht (b : 2) : Seillänge.' },
        { ask: 1, v: p.FG / 2, msg: 'Du hast den Winkel vergessen. Die Seile hängen schräg. Nur ihr senkrechter Anteil trägt F_G.' },
      ];
    },
    tipps: () => [
      'Ein Seilstück ist die Hypotenuse: waagrecht b : 2, senkrecht h.',
      'cos β = h : Seillänge',
      'F = F_G : (2 · cos β)',
    ],
    loesung: (p) => {
      const L = Math.hypot(p.b / 2, p.h);
      return [
        `Seillänge: ${eq('√((' + p.b / 2 + ' mm)² + (' + p.h + ' mm)²) = ' + fmt(L) + ' mm')}`,
        `${eq('cos β = ' + p.h + ' : ' + fmt(L) + ' = ' + fmt(p.h / L, 3))}`,
        `${eq(f('F') + ' = ' + f('F_G') + ' : (2 · cos β) = ' + p.FG + ' N : (2 · ' + fmt(p.h / L, 3) + ') = ' + f(fmt((p.FG * L) / (2 * p.h)) + ' N'))}`,
        'Mit einem längeren Seil wird β kleiner. Die Seile hängen steiler. Die Zugkraft sinkt.',
      ];
    },
  }),

  task({
    id: 'z12', karte: 'symmetrisch', stufe: 2, familie: 'rechnen',
    title: 'V-Führung einer Werkzeugmaschine', src: 'Buch Kräfte, Nr. 5',
    gen: () => ({ F: pick([2, 3.5, 5]), w: pick([60, 90, 120]) }),
    draw: (p) => B.vFuehrung(p),
    text: (p) => `Eine V-Führung mit ${p.w}° Öffnungswinkel wird vom Schlitten senkrecht mit ${f('F = ' + fmt(p.F) + ' kN')} belastet. Wie gross sind die Normalkräfte F_N1 und F_N2 auf die Gleitflächen?`,
    asks: (p) => {
      const N = p.F / (2 * Math.sin(rad(p.w / 2)));
      return [{ k: 'F_N1', unit: 'kN', v: N }, { k: 'F_N2', unit: 'kN', v: N }];
    },
    fehler: (p) => [0, 1].flatMap((i) => [
      { ask: i, v: p.F / 2, msg: 'Du hast den Winkel vergessen. Jede Gleitfläche ist schräg. Nur der senkrechte Anteil von F_N trägt F.' },
      ...(p.w !== 90 ? [{ ask: i, v: p.F / (2 * Math.cos(rad(p.w / 2))), msg: 'sin und cos sind vertauscht. Die Normalkraft steht senkrecht auf der Fläche. Ihr senkrechter Anteil ist F_N · sin(w : 2).' }] : []),
    ]),
    tipps: (p) => [
      'Symmetrisch: F_N1 = F_N2. Jede Normalkraft steht senkrecht auf ihrer Fläche.',
      `Der senkrechte Anteil jeder Normalkraft ist F_N · sin ${p.w / 2}°.`,
      `2 · F_N · sin ${p.w / 2}° = F`,
    ],
    loesung: (p) => {
      const N = p.F / (2 * Math.sin(rad(p.w / 2)));
      return [
        `${eq('2 · ' + f('F_N') + ' · sin ' + p.w / 2 + '° = ' + fmt(p.F) + ' kN')}`,
        `${eq(f('F_N1') + ' = ' + f('F_N2') + ' = ' + fmt(p.F) + ' : (2 · sin ' + p.w / 2 + '°) = ' + f(fmt(N, 3) + ' kN'))}`,
        'Die Summe der Normalkräfte ist grösser als F. Darum hat eine V-Führung mehr Reibung als eine Flachführung.',
      ];
    },
  }),

  task({
    id: 'z19', karte: 'symmetrisch', stufe: 1, familie: 'schaetzen',
    title: 'Schätzen: Zwei Seile im Winkel von 120°',
    gen: () => ({ FG: pick([200, 400, 600, 800]) }),
    draw: (p) => B.spreiz({ al: 120 }, { FG: `F_G = ${p.FG} N`, F1: 'F = ?', F2: 'F = ?' }),
    text: (p) => `Eine Last mit ${f('F_G = ' + p.FG + ' N')} hängt an zwei Seilen. Die Seile schliessen den Winkel 120° ein. Ohne Taschenrechner: Wie gross ist die Kraft in jedem Seil ungefähr?`,
    asks: (p) => [{
      kind: 'choice', k: 'Kraft je Seil',
      opts: [`${p.FG / 2} N`, `${p.FG} N`, `${p.FG * 2} N`],
      a: 1,
      why: [
        'So wenig gäbe es nur bei senkrecht hängenden Seilen (0°). Hier sind sie weit gespreizt.',
        undefined,
        'Zu viel. Bei 120° ist α : 2 = 60° und cos 60° = 0,5. Die 2 im Nenner hebt die 0,5 auf.',
      ],
    }],
    tipps: () => [
      'Rechne mit F = F_G : (2 · cos(α : 2)).',
      'α : 2 = 60°. Und cos 60° = 0,5.',
      '2 · 0,5 = 1. Also ist F genau so gross wie F_G.',
    ],
    loesung: (p) => [
      `${eq(f('F') + ' = ' + f('F_G') + ' : (2 · cos 60°) = ' + f(p.FG + ' N') + ' : (2 · 0,5) = ' + f(p.FG + ' N'))}`,
      'Merke: Bei 120° trägt jedes Seil so viel wie die ganze Last. Bei grösseren Winkeln wird es noch mehr.',
      'Warnung: Seile mit grossem Öffnungswinkel können überlastet werden und reissen. Prüfe immer den Winkel.',
    ],
  }),

  task({
    id: 'z22', karte: 'symmetrisch', stufe: 1, familie: 'fehler',
    title: 'Fehler finden: Stehleiter halbiert',
    gen: () => ({ FG: rng(600, 900, 50), al: pick([30, 40, 50]) }),
    draw: (p) => B.spreiz(p, { typ: 'leiter', FG: `F_G = ${p.FG} N` }),
    text: (p) => `Max rechnet die Kraft in einem Leiterteil: «F₁ = F_G : 2 = ${p.FG} N : 2 = ${p.FG / 2} N». Die Leiter ist um α = ${p.al}° gespreizt. Was ist falsch?`,
    asks: (p) => [{
      kind: 'choice', k: 'Fehler',
      opts: [
        `Er hat den Winkel vergessen. Richtig ist F₁ = F_G : (2 · cos ${p.al / 2}°) = ${fmt(sym(p.FG, rad(p.al / 2)))} N.`,
        'Er hätte F_G mit 2 multiplizieren müssen.',
        'Nichts, beide Teile tragen gleich viel, also stimmt die Hälfte.',
      ],
      a: 0,
      why: [
        undefined,
        'Dann wäre F₁ grösser als F_G. Das ist zu viel. Der Winkel verändert die Kraft nur um den Faktor 1 : cos(α : 2).',
        'Gleich viel stimmt, aber nur der senkrechte Anteil ist F_G : 2. Die Kraft im Leiterteil ist grösser, weil sie schräg wirkt.',
      ],
    }],
    tipps: () => [
      'Stehen die Leiterteile senkrecht oder schräg?',
      'Bei schrägen Teilen trägt nur der senkrechte Anteil von F₁.',
      'F₁ · cos(α : 2) = F_G : 2',
    ],
    loesung: (p) => [
      `Max rechnet, als ständen die Leiterteile senkrecht (α = 0°). Dann stimmt F_G : 2.`,
      `Bei ${p.al}° gilt: ${eq(f('F₁') + ' = ' + f('F_G') + ' : (2 · cos ' + p.al / 2 + '°) = ' + f(fmt(sym(p.FG, rad(p.al / 2))) + ' N'))}`,
      'Die Kraft im schrägen Teil ist immer grösser als die halbe Last.',
    ],
  }),

  // ───────── Karte: flach ─────────
  task({
    id: 'z16', karte: 'flach', stufe: 2, familie: 'rechnen',
    title: 'Wäscheleine: Warum reisst sie?', src: 'Kreativ · Neue Situation',
    gen: () => ({ FG: pick([50, 100, 150]), al: pick([3, 5, 10]) }),
    draw: (p) => B.leine(p),
    text: (p) => `An einer straff gespannten Leine hängt in der Mitte eine Last ${f('F_G = ' + p.FG + ' N')}. Die Leine hängt nur ${p.al}° durch. Wie gross ist die Kraft F_S in jeder Leinenhälfte?`,
    asks: (p) => [{ k: 'F_S', unit: 'N', v: p.FG / (2 * Math.sin(rad(p.al))) }],
    fehler: (p) => [
      { ask: 0, v: p.FG / 2, msg: 'Du hast den Winkel vergessen. Die Leine ist fast waagrecht. Dann ist F_S riesig, nicht klein.' },
      { ask: 0, v: p.FG / (2 * Math.cos(rad(p.al))), msg: 'cos und sin sind vertauscht. α liegt zur Waagrechten. Der senkrechte Anteil ist F_S · sin α.' },
    ],
    tipps: () => [
      'Wie beim Kniehebel: Zwei Stränge teilen sich F_G.',
      'Senkrechter Anteil je Strang: F_S · sin α.',
      'F_S = F_G : (2 · sin α)',
    ],
    loesung: (p) => [
      `${eq(f('F_S') + ' = ' + p.FG + ' : (2 · sin ' + p.al + '°) = ' + f(fmt(p.FG / (2 * Math.sin(rad(p.al)))) + ' N'))}`,
      `Das ist ${fmt(1 / (2 * Math.sin(rad(p.al))), 1)}-mal die Last! Eine straffe Leine reisst darum schneller als eine lockere.`,
      'Warnung: Eine fast waagrechte Leine kann bei kleiner Last reissen. Das Seil schnellt zurück und kann verletzen.',
    ],
  }),

  task({
    id: 'z15', karte: 'flach', stufe: 3, familie: 'rechnen',
    title: 'Schliesseinheit mit Kniehebel', src: 'Buch Kräfte, Nr. 8',
    gen: () => ({ F: pick([5, 10, 15]) }),
    draw: (p) => B.kniehebel({ F: p.F, al: 10 }),
    text: (p) => `Das Werkzeug einer Spritzgiessmaschine wird über einen Kniehebel geschlossen. Der Kolben drückt mit ${f('F = ' + p.F + ' kN')} auf das Gelenk. Wie gross sind die Kräfte F₁ in den Kniehebeln und die Schliesskräfte F_s bei α = 10°, 5° und 2°?`,
    asks: (p) => [10, 5, 2].flatMap((a) => [
      { k: 'F₁ bei ' + a + '°', unit: 'kN', v: p.F / (2 * Math.sin(rad(a))) },
      { k: 'F_s bei ' + a + '°', unit: 'kN', v: p.F / (2 * Math.tan(rad(a))) },
    ]),
    fehler: (p) => [10, 5, 2].flatMap((a, i) => [
      { ask: 2 * i, v: p.F / (2 * Math.cos(rad(a))), msg: 'cos und sin sind vertauscht. Der senkrechte Anteil je Hebel ist F₁ · sin α. Bei kleinem α ist F₁ riesig.' },
      { ask: 2 * i + 1, v: (p.F * Math.tan(rad(a))) / 2, msg: 'Du hast mit tan α multipliziert statt geteilt. Je kleiner α, desto grösser wird die Schliesskraft.' },
    ]),
    tipps: () => [
      'Am Gelenk teilt sich F auf zwei Hebel. Senkrechter Anteil je Hebel: F₁ · sin α.',
      'F₁ = F : (2 · sin α)',
      'Der waagrechte Anteil ist die Schliesskraft: F_s = F₁ · cos α = F : (2 · tan α)',
    ],
    loesung: (p) => [
      ...[10, 5, 2].map((a) => `α = ${a}°: ${eq(f('F₁') + ' = ' + p.F + ' : (2 · sin ' + a + '°) = ' + fmt(p.F / (2 * Math.sin(rad(a))), 2) + ' kN')}, ${eq(f('F_s') + ' = ' + fmt(p.F / (2 * Math.tan(rad(a))), 2) + ' kN')}`),
      'Je flacher der Kniehebel, desto grösser die Schliesskraft. Bei α → 0 wird sie theoretisch unendlich.',
      'Warnung: Die Maschine darf nie mit offener Schutztür fahren. Die Schliesskraft ist enorm und quetscht Hände.',
    ],
    loesungsbild: (p) => saeulen('Schliesskraft F_s', [10, 5, 2].map((a) => ({
      v: 1 / Math.tan(rad(a)) / (1 / Math.tan(rad(2))), t: `α = ${a}°: ${fmt(p.F / (2 * Math.tan(rad(a))), 1)} kN`,
    }))),
  }),

  task({
    id: 'z20', karte: 'flach', stufe: 2, familie: 'umgekehrt',
    title: 'Umgekehrt: Wie stark muss die Leine durchhängen?',
    gen: () => ({ FG: pick([100, 150, 200]), Fmax: pick([300, 400, 500, 600]) }),
    draw: (p) => B.leine({ al: deg(Math.asin(p.FG / (2 * p.Fmax))) }, { FG: `F_G = ${p.FG} N`, FS: `F_max = ${p.Fmax} N`, alTxt: 'α = ?' }),
    text: (p) => `Eine Leine hält höchstens ${f('F_max = ' + p.Fmax + ' N')} aus. In der Mitte hängt eine Last ${f('F_G = ' + p.FG + ' N')}. Wie gross muss der Durchhang-Winkel α (zur Waagrechten) mindestens sein?`,
    asks: (p) => [{ k: 'α_min', unit: '°', v: deg(Math.asin(p.FG / (2 * p.Fmax))) }],
    fehler: (p) => [
      { ask: 0, v: deg(Math.asin(p.FG / p.Fmax)), msg: 'Du hast den Faktor 2 vergessen. Zwei Leinenhälften tragen die Last gemeinsam.' },
      { ask: 0, v: deg(Math.acos(p.FG / (2 * p.Fmax))), msg: 'cos statt sin. Der Winkel liegt zur Waagrechten. Der senkrechte Anteil ist F · sin α.' },
    ],
    tipps: () => [
      'Wie bei der Wäscheleine, nur rückwärts: F_G = 2 · F_max · sin α.',
      'sin α = F_G : (2 · F_max)',
      'α = Umkehrfunktion von sin (sin⁻¹ am Taschenrechner)',
    ],
    loesung: (p) => [
      `${eq('sin α = ' + f('F_G') + ' : (2 · ' + f('F_max') + ') = ' + p.FG + ' : ' + 2 * p.Fmax + ' = ' + fmt(p.FG / (2 * p.Fmax), 3))}`,
      `${eq('α_min = ' + fmt(deg(Math.asin(p.FG / (2 * p.Fmax))), 1) + '°')}`,
      'Kleinerer Winkel heisst grössere Seilkraft. Wer die Leine straffer spannt, überschreitet F_max.',
    ],
  }),

  task({
    id: 'z21', karte: 'flach', stufe: 2, familie: 'waswaere',
    title: 'Was wäre wenn: Leine doppelt so stark durchhängen lassen',
    gen: () => {
      const [a1, a2] = pick([[3, 6], [4, 8], [5, 10]]);
      return { FG: pick([100, 150, 200]), a1, a2 };
    },
    draw: (p) => B.leine({ al: p.a1, FG: p.FG }, { FS: 'F_S = ?' }),
    text: (p) => `Eine Leine hängt ${p.a1}° durch. In der Mitte hängt eine Last ${f('F_G = ' + p.FG + ' N')}. Du lockerst die Leine, bis sie ${p.a2}° durchhängt. a) Wie verändert sich die Kraft in der Leine? b) Wie gross ist sie nach dem Lockern?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Kraft in der Leine',
        opts: ['wird etwa halb so gross', 'bleibt gleich', 'wird etwa doppelt so gross'], a: 0,
        why: [undefined, 'Die Last bleibt gleich, aber der Winkel ändert sich. Bei kleinem Winkel gilt F ~ 1 : sin α.', 'Es ist umgekehrt: Ein grösserer Winkel macht die Kraft kleiner.'],
      },
      { k: 'b) F_S neu', unit: 'N', v: p.FG / (2 * Math.sin(rad(p.a2))) },
    ],
    fehler: (p) => [{ ask: 1, v: p.FG / (2 * Math.sin(rad(p.a1))), msg: 'Das ist die Kraft vorher. Rechne mit dem neuen Winkel.' }],
    tipps: () => [
      'Nur der Winkel ändert sich. F_G bleibt gleich.',
      'F_S = F_G : (2 · sin α). Setze den neuen Winkel ein.',
      'Bei kleinen Winkeln verdoppelt sich sin α ungefähr, wenn sich α verdoppelt.',
    ],
    loesung: (p) => [
      `Vorher: ${eq(f('F_S') + ' = ' + p.FG + ' : (2 · sin ' + p.a1 + '°) = ' + fmt(p.FG / (2 * Math.sin(rad(p.a1)))) + ' N')}`,
      `Nachher: ${eq(f('F_S') + ' = ' + p.FG + ' : (2 · sin ' + p.a2 + '°) = ' + f(fmt(p.FG / (2 * Math.sin(rad(p.a2)))) + ' N'))}`,
      'Doppelter Durchhang heisst etwa halbe Kraft. Darum hängt man schwere Lasten an lockere Seile.',
    ],
  }),

  // ───────── Karte: streben ─────────
  task({
    id: 'z6', karte: 'streben', stufe: 2, familie: 'rechnen',
    title: 'Leitungsmast mit Ankerseil',
    gen: () => {
      const [h, a] = pick([[6000, 2500], [8000, 3000], [6000, 3500], [7500, 4000]]);
      return { F: rng(800, 2000, 100), h, a };
    },
    draw: (p) => B.mastAnker(p, { F: `F = ${p.F} N` }),
    text: (p) => `An der Mastspitze zieht die Leitung waagrecht mit ${f('F = ' + p.F + ' N')}. Ein Ankerseil hält dagegen. Es ist in der Höhe ${l('h = ' + p.h + ' mm')} befestigt und ${l('a = ' + p.a + ' mm')} neben dem Mast im Boden verankert. Berechne a) den Winkel β zwischen Seil und Mast, b) die Ankerseilkraft F₁ und c) die Mastkraft F₂.`,
    asks: (p) => {
      const be = Math.atan(p.a / p.h);
      return [
        { k: 'a) β', unit: '°', v: deg(be) },
        { k: 'b) F₁', unit: 'N', v: p.F / Math.sin(be) },
        { k: 'c) F₂', unit: 'N', v: p.F / Math.tan(be) },
      ];
    },
    fehler: (p) => {
      const be = Math.atan(p.a / p.h);
      return [
        { ask: 0, v: deg(Math.atan(p.h / p.a)), msg: 'Gegenkathete und Ankathete sind vertauscht. β liegt am Mast: tan β = a : h.' },
        { ask: 1, v: p.F / Math.cos(be), msg: 'sin und cos sind vertauscht. Der waagrechte Anteil der Seilkraft ist F₁ · sin β.' },
        { ask: 2, v: p.F * Math.tan(be), msg: 'Du hast mit tan β multipliziert statt geteilt. F₂ ist grösser als F.' },
      ];
    },
    tipps: () => [
      'Zeichne das Kräftedreieck: F waagrecht, F₂ senkrecht, F₁ schräg.',
      'tan β = a : h. Der waagrechte Anteil der Seilkraft hält F: F₁ · sin β = F.',
      'F₂ = F : tan β',
    ],
    loesung: (p) => {
      const be = Math.atan(p.a / p.h);
      return [
        `${eq('tan β = ' + p.a + ' : ' + p.h + ' = ' + fmt(p.a / p.h, 3))}, also ${eq('β = ' + fmt(deg(be), 1) + '°')}`,
        `Waagrecht: ${eq(f('F₁') + ' · sin β = ' + f('F'))}, also ${eq(f('F₁') + ' = ' + p.F + ' N : sin ' + fmt(deg(be), 1) + '° = ' + f(fmt(p.F / Math.sin(be)) + ' N'))}`,
        `Senkrecht: ${eq(f('F₂') + ' = ' + f('F') + ' : tan β = ' + f(fmt(p.F / Math.tan(be)) + ' N'))}`,
        'Das Seil wird gezogen. Der Mast wird gedrückt. Je steiler das Seil, desto grösser beide Kräfte.',
      ];
    },
  }),

  task({
    id: 'z7', karte: 'streben', stufe: 2, familie: 'rechnen',
    title: 'Wanddrehkran: Kräfte in den Streben',
    gen: () => {
      const [h, b] = pick([[1620, 2160], [1500, 2000], [1200, 1600], [1500, 3600], [1000, 2400]]);
      return { FG: pick([3, 4, 5, 6, 8]), h, b };
    },
    draw: (p) => B.kran(p, { FG: `F_G = ${p.FG} kN` }),
    text: (p) => `An einem Wanddrehkran hängt die Last ${f('F_G = ' + p.FG + ' kN')}. Die waagrechte Strebe II ist ${l('b = ' + p.b + ' mm')} lang. Die schräge Strebe I ist ${l('h = ' + p.h + ' mm')} darüber an der Wand befestigt. Berechne a) die Kraft in Strebe I und b) die Kraft in Strebe II.`,
    asks: (p) => {
      const L = Math.hypot(p.h, p.b);
      return [
        { k: 'a) F_I', unit: 'kN', v: (p.FG * L) / p.h },
        { k: 'b) F_II', unit: 'kN', v: (p.FG * p.b) / p.h },
      ];
    },
    fehler: (p) => {
      const L = Math.hypot(p.h, p.b);
      return [
        { ask: 0, v: (p.FG * L) / p.b, msg: 'Strebe I trägt die Last mit ihrem senkrechten Anteil. Das ist sin α, nicht cos α.' },
        { ask: 1, v: (p.FG * p.h) / p.b, msg: 'tan α ist umgekehrt. F_II = F_G : tan α mit tan α = h : b.' },
      ];
    },
    tipps: () => [
      'Der Winkel α zwischen den Streben: tan α = h : b.',
      'Nur Strebe I hat einen senkrechten Anteil. Er trägt die Last: F_I · sin α = F_G.',
      'F_II = F_G : tan α',
    ],
    loesung: (p) => {
      const al = Math.atan(p.h / p.b);
      return [
        `${eq('tan α = ' + p.h + ' : ' + p.b + ' = ' + fmt(p.h / p.b, 3))}, also ${eq('α = ' + fmt(deg(al), 1) + '°')}`,
        `Senkrecht: ${eq(f('F_I') + ' · sin α = ' + f('F_G'))}, also ${eq(f('F_I') + ' = ' + p.FG + ' kN : sin ' + fmt(deg(al), 1) + '° = ' + f(fmt(p.FG / Math.sin(al)) + ' kN'))}`,
        `Waagrecht: ${eq(f('F_II') + ' = ' + f('F_G') + ' : tan α = ' + f(fmt(p.FG / Math.tan(al)) + ' kN'))}`,
        'Strebe I wird gezogen. Man könnte sie durch ein Seil ersetzen. Strebe II wird gedrückt.',
      ];
    },
  }),

  task({
    id: 'z14', karte: 'streben', stufe: 3, familie: 'rechnen',
    title: 'Keilspanner', src: 'Buch Kräfte, Nr. 7',
    gen: () => ({ FG: pick([15, 25, 40]), al: pick([10, 15, 20]) }),
    draw: (p) => B.keil(p),
    text: (p) => `Mit einem Keilspanner wird eine Baugruppe (${f('F_G = ' + p.FG + ' kN')}) in der Höhe justiert. Der Keil hat ${p.al}° Neigung. Die Baugruppe wird links waagrecht geführt. Wie gross sind ohne Reibung a) die Normalkräfte F_NA (Führung) und F_NB (Keilfläche) und b) die Normalkraft F_NC unter dem Keil und die Zugkraft F in der Schraube?`,
    asks: (p) => {
      const a = rad(p.al);
      return [
        { k: 'a) F_NA', unit: 'kN', v: p.FG * Math.tan(a) },
        { k: 'a) F_NB', unit: 'kN', v: p.FG / Math.cos(a) },
        { k: 'b) F_NC', unit: 'kN', v: p.FG },
        { k: 'b) F', unit: 'kN', v: p.FG * Math.tan(a) },
      ];
    },
    fehler: (p) => {
      const a = rad(p.al);
      return [
        { ask: 0, v: p.FG / Math.tan(a), msg: 'tan ist vertauscht. F_NA liegt gegenüber von α: F_NA = F_G · tan α.' },
        { ask: 1, v: p.FG * Math.cos(a), msg: 'Multipliziert statt dividiert. F_NB ist die Hypotenuse und grösser als F_G.' },
        { ask: 3, v: p.FG / Math.tan(a), msg: 'tan ist vertauscht. Die Schraubenkraft ist klein: F = F_NB · sin α = F_G · tan α.' },
      ];
    },
    tipps: () => [
      'Baugruppe freimachen: F_G nach unten, F_NA waagrecht, F_NB senkrecht zur Keilfläche.',
      'F_NB · cos α = F_G und F_NA = F_NB · sin α',
      'Keil freimachen: F_NB von oben, F_NC von unten, F von der Schraube.',
    ],
    loesung: (p) => {
      const a = rad(p.al);
      return [
        `a) ${eq(f('F_NB') + ' = ' + p.FG + ' : cos ' + p.al + '° = ' + f(fmt(p.FG / Math.cos(a), 2) + ' kN'))}, ${eq(f('F_NA') + ' = ' + p.FG + ' · tan ' + p.al + '° = ' + f(fmt(p.FG * Math.tan(a), 2) + ' kN'))}`,
        `b) ${eq(f('F_NC') + ' = F_NB · cos α = ' + f(fmt(p.FG) + ' kN'))}, ${eq(f('F') + ' = F_NB · sin α = ' + f(fmt(p.FG * Math.tan(a), 2) + ' kN'))}`,
        'Ein flacher Keil hebt eine grosse Last mit kleiner Schraubenkraft.',
      ];
    },
  }),

  // ───────── Karte: ungleich ─────────
  task({
    id: 'z8', karte: 'ungleich', stufe: 3, familie: 'rechnen',
    title: 'Stehleiter auf geneigtem Boden',
    gen: () => {
      const al = pick([30, 40, 50]);
      return { FG: rng(600, 900, 50), al, de: pick(al === 30 ? [5, 10] : [5, 10, 15]) };
    },
    draw: (p) => B.leiterSchief(p, { FG: `F_G = ${p.FG} N` }),
    text: (p) => `Eine Stehleiter mit dem Öffnungswinkel α = ${p.al}° steht auf einem Boden mit der Neigung δ = ${p.de}°. Teil 1 steht höher. Oben steht eine Person mit ${f('F_G = ' + p.FG + ' N')}. Berechne a) den Winkel β₁ von Teil 1 zur Senkrechten, b) den Winkel β₂ von Teil 2, c) die Kraft F₁ in Teil 1 und d) die Kraft F₂ in Teil 2.`,
    asks: (p) => {
      const b1 = rad(p.al / 2 + p.de), b2 = rad(p.al / 2 - p.de);
      return [
        { k: 'a) β₁', unit: '°', v: p.al / 2 + p.de },
        { k: 'b) β₂', unit: '°', v: p.al / 2 - p.de },
        { k: 'c) F₁', unit: 'N', v: (p.FG * Math.sin(b2)) / Math.sin(rad(p.al)) },
        { k: 'd) F₂', unit: 'N', v: (p.FG * Math.sin(b1)) / Math.sin(rad(p.al)) },
      ];
    },
    fehler: (p) => {
      const b1 = rad(p.al / 2 + p.de), b2 = rad(p.al / 2 - p.de), sa = Math.sin(rad(p.al));
      return [
        { ask: 0, v: p.al / 2, msg: 'Du hast die Bodenneigung vergessen. Teil 1 steht höher. Sein Winkel zur Senkrechten wird grösser: β₁ = α : 2 + δ.' },
        { ask: 1, v: p.al / 2, msg: 'Du hast die Bodenneigung vergessen. Teil 2 steht tiefer. Sein Winkel zur Senkrechten wird kleiner: β₂ = α : 2 − δ.' },
        { ask: 2, v: (p.FG * Math.sin(b1)) / sa, msg: 'Zu F₁ gehört der Sinus des anderen Winkels (β₂). Das ist die Kraft F₂.' },
        { ask: 2, v: p.FG / (2 * Math.cos(rad(p.al / 2))), msg: 'Du hast symmetrisch gerechnet. Der Boden ist aber geneigt. Die beiden Teile tragen ungleich viel.' },
        { ask: 3, v: (p.FG * Math.sin(b2)) / sa, msg: 'Zu F₂ gehört der Sinus des anderen Winkels (β₁). Das ist die Kraft F₁.' },
      ];
    },
    tipps: () => [
      'Die ganze Leiter kippt um die Bodenneigung δ. Ein Teil wird steiler, der andere flacher: β₁ = α : 2 + δ und β₂ = α : 2 − δ.',
      'Waagrecht heben sich die Anteile auf: F₁ · sin β₁ = F₂ · sin β₂. Zeichne das Kräftedreieck mit F_G.',
      'Sinussatz im Kräftedreieck: F₁ = F_G · sin β₂ : sin α und F₂ = F_G · sin β₁ : sin α',
    ],
    loesung: (p) => {
      const B1 = p.al / 2 + p.de, B2 = p.al / 2 - p.de, b1 = rad(B1), b2 = rad(B2), sa = Math.sin(rad(p.al));
      return [
        `Winkel: ${eq('β₁ = ' + p.al / 2 + '° + ' + p.de + '° = ' + B1 + '°')} und ${eq('β₂ = ' + p.al / 2 + '° − ' + p.de + '° = ' + B2 + '°')}`,
        'Kräftedreieck mit dem Sinussatz. Gegenüber von F_G liegt der Winkel 180° − α.',
        `${eq(f('F₁') + ' = ' + f('F_G') + ' · sin β₂ : sin α = ' + p.FG + ' N · sin ' + B2 + '° : sin ' + p.al + '° = ' + f(fmt((p.FG * Math.sin(b2)) / sa) + ' N'))}`,
        `${eq(f('F₂') + ' = ' + f('F_G') + ' · sin β₁ : sin α = ' + p.FG + ' N · sin ' + B1 + '° : sin ' + p.al + '° = ' + f(fmt((p.FG * Math.sin(b1)) / sa) + ' N'))}`,
        'Der steilere Teil trägt mehr. Achtung: Zu F₁ gehört der Sinus des anderen Winkels.',
        'Warnung: Eine Leiter auf schiefem Boden kippt leichter und belastet einen Teil stärker. Stelle sie auf ebenen Grund.',
      ];
    },
  }),

  task({
    id: 'z9', karte: 'ungleich', stufe: 3, familie: 'rechnen',
    title: 'Strassenleuchte an zwei ungleichen Seilen',
    gen: () => {
      const [l1, l2, wd, d] = pick([[10, 17, 21, 8], [13, 15, 14, 12], [13, 20, 21, 12], [15, 20, 25, 12]]);
      return { FG: rng(150, 400, 50), l1, l2, w: wd, d, H: pick([8, 10]) };
    },
    draw: (p) => B.lampe(p, { FG: `F_G = ${p.FG} N` }),
    text: (p) => `Eine Strassenleuchte mit ${f('F_G = ' + p.FG + ' N')} hängt ${l('H = ' + p.H + ' m')} über der Strasse an zwei Seilen mit ${l('l₁ = ' + p.l1 + ' m')} und ${l('l₂ = ' + p.l2 + ' m')}. Die Haken sitzen auf gleicher Höhe an zwei Hauswänden. Die Wände sind ${l('w = ' + p.w + ' m')} voneinander entfernt. Berechne a) die Höhe der Haken über der Strasse, b) die Seilkraft F₁ und c) die Seilkraft F₂.`,
    asks: (p) => {
      const x1 = Math.sqrt(p.l1 ** 2 - p.d ** 2), x2 = p.w - x1, t1 = Math.atan2(x1, p.d), t2 = Math.atan2(x2, p.d);
      return [
        { k: 'a) Hakenhöhe', unit: 'm', v: p.H + p.d },
        { k: 'b) F₁', unit: 'N', v: (p.FG * Math.sin(t2)) / Math.sin(t1 + t2) },
        { k: 'c) F₂', unit: 'N', v: (p.FG * Math.sin(t1)) / Math.sin(t1 + t2) },
      ];
    },
    fehler: (p) => {
      const x1 = Math.sqrt(p.l1 ** 2 - p.d ** 2), x2 = p.w - x1, t1 = Math.atan2(x1, p.d), t2 = Math.atan2(x2, p.d);
      return [
        { ask: 0, v: p.H, msg: 'Das ist die Höhe der Leuchte. Die Haken liegen um den Durchhang d höher.' },
        { ask: 1, v: (p.FG * Math.sin(t1)) / Math.sin(t1 + t2), msg: 'Das ist die Kraft im anderen Seil. Zu F₁ gehört der Sinus des Winkels von Seil 2.' },
        { ask: 1, v: p.FG / 2, msg: 'Du hast die Last einfach halbiert. Die Seile sind ungleich lang und hängen unterschiedlich schräg.' },
        { ask: 2, v: (p.FG * Math.sin(t2)) / Math.sin(t1 + t2), msg: 'Das ist die Kraft im anderen Seil. Zu F₂ gehört der Sinus des Winkels von Seil 1.' },
        { ask: 2, v: p.FG / 2, msg: 'Du hast die Last einfach halbiert. Die Seile sind ungleich lang und hängen unterschiedlich schräg.' },
      ];
    },
    tipps: () => [
      'Die Leuchte hängt um d tiefer als die Haken. Waagrecht gilt x₁ + x₂ = w. Pythagoras zweimal: l₁² = x₁² + d² und l₂² = x₂² + d².',
      'Subtrahiere die beiden Gleichungen: x₂ − x₁ = (l₂² − l₁²) : w. Dann kennst du x₁, x₂ und d, also die Winkel: tan θ = x : d.',
      'F₁ = F_G · sin θ₂ : sin(θ₁ + θ₂) und F₂ = F_G · sin θ₁ : sin(θ₁ + θ₂)',
    ],
    loesung: (p) => {
      const x1 = Math.sqrt(p.l1 ** 2 - p.d ** 2), x2 = p.w - x1, t1 = Math.atan2(x1, p.d), t2 = Math.atan2(x2, p.d);
      const D = (a: number) => fmt(deg(a), 1);
      return [
        `${eq('x₂ − x₁ = (l₂² − l₁²) : w = (' + p.l2 ** 2 + ' − ' + p.l1 ** 2 + ') : ' + p.w + ' = ' + fmt(x2 - x1) + ' m')}. Mit ${eq('x₁ + x₂ = ' + p.w + ' m')} folgt ${eq('x₁ = ' + fmt(x1) + ' m')} und ${eq('x₂ = ' + fmt(x2) + ' m')}.`,
        `Durchhang: ${eq('d = √(l₁² − x₁²) = ' + fmt(p.d) + ' m')}. Hakenhöhe: ${eq(p.H + ' m + ' + fmt(p.d) + ' m = ' + fmt(p.H + p.d) + ' m')}`,
        `Winkel zur Senkrechten: ${eq('θ₁ = ' + D(t1) + '°')} und ${eq('θ₂ = ' + D(t2) + '°')}`,
        `${eq(f('F₁') + ' = ' + f('F_G') + ' · sin θ₂ : sin(θ₁ + θ₂) = ' + f(fmt((p.FG * Math.sin(t2)) / Math.sin(t1 + t2)) + ' N'))}`,
        `${eq(f('F₂') + ' = ' + f('F_G') + ' · sin θ₁ : sin(θ₁ + θ₂) = ' + f(fmt((p.FG * Math.sin(t1)) / Math.sin(t1 + t2)) + ' N'))}`,
        'Das kürzere, steilere Seil trägt mehr.',
      ];
    },
  }),

  task({
    id: 'z10', karte: 'ungleich', stufe: 3, familie: 'rechnen',
    title: 'Spannreck: räumliche Zerlegung',
    gen: () => ({ A: 5.5, B: 4, s: 2.4, h: pick([2.4, 1.6, 2]), F: pick([4, 5, 6]) }),
    draw: (p) => B.reck(p),
    text: (p) => `Ein Spannreck wird mit vier Seilen verspannt. Jedes Seil zieht mit ${f('F = ' + p.F + ' kN')} an einem Pfostenkopf. Die Bodenanker bilden ein Rechteck mit ${l('A = ' + fmt(p.A) + ' m')} und ${l('B = ' + fmt(p.B) + ' m')}. Die Reckstange ist ${l('s = ' + fmt(p.s) + ' m')} lang und ${l('h = ' + fmt(p.h) + ' m')} hoch. Berechne a) die Länge eines Seils, b) die Kraft F₁, mit der ein Pfosten auf den Boden gedrückt wird, und c) die Zugkraft in der Reckstange.`,
    asks: (p) => {
      const dx = (p.A - p.s) / 2, dy = p.B / 2, L = Math.hypot(dx, dy, p.h);
      return [
        { k: 'a) Seillänge', unit: 'm', v: L },
        { k: 'b) F₁', unit: 'kN', v: (2 * p.F * p.h) / L },
        { k: 'c) Stangenkraft', unit: 'kN', v: (2 * p.F * dx) / L },
      ];
    },
    fehler: (p) => {
      const dx = (p.A - p.s) / 2, dy = p.B / 2, L = Math.hypot(dx, dy, p.h);
      return [
        { ask: 0, v: Math.hypot(dx, dy), msg: 'Das Seil geht auch in die Höhe. Es überbrückt drei Strecken: dx, dy und h.' },
        { ask: 1, v: (p.F * p.h) / L, msg: 'An jedem Pfosten ziehen zwei Seile. Rechne ihre senkrechten Anteile zusammen.' },
        { ask: 2, v: (p.F * dx) / L, msg: 'An jedem Pfosten ziehen zwei Seile. Ihre Anteile in Stangenrichtung addieren sich.' },
      ];
    },
    tipps: () => [
      'Ein Seil überbrückt drei Strecken: (A − s) : 2 in Stangenrichtung, B : 2 quer dazu und h in der Höhe.',
      'Seillänge = √(dx² + dy² + h²). Die Seilkraft teilt sich im Verhältnis der Strecken auf.',
      'An jedem Pfosten ziehen zwei Seile. Die Queranteile heben sich auf, die anderen addieren sich.',
    ],
    loesung: (p) => {
      const dx = (p.A - p.s) / 2, dy = p.B / 2, L = Math.hypot(dx, dy, p.h);
      return [
        `Strecken eines Seils: ${eq('dx = (' + fmt(p.A) + ' − ' + fmt(p.s) + ') : 2 = ' + fmt(dx) + ' m')}, ${eq('dy = ' + fmt(dy) + ' m')}, ${eq('h = ' + fmt(p.h) + ' m')}`,
        `Seillänge: ${eq('√(' + fmt(dx) + '² + ' + fmt(dy) + '² + ' + fmt(p.h) + '²) = ' + fmt(L, 3) + ' m')}`,
        `Senkrechter Anteil je Seil: ${eq(p.F + ' kN · ' + fmt(p.h) + ' : ' + fmt(L, 3) + ' = ' + fmt((p.F * p.h) / L) + ' kN')}. Zwei Seile je Pfosten: ${eq(f('F₁ = ' + fmt((2 * p.F * p.h) / L) + ' kN'))}`,
        `Anteil in Stangenrichtung je Seil: ${eq(p.F + ' kN · ' + fmt(dx) + ' : ' + fmt(L, 3) + ' = ' + fmt((p.F * dx) / L) + ' kN')}. Zwei Seile: Stangenkraft ${eq(fmt((2 * p.F * dx) / L) + ' kN')} (Zug).`,
        'Die Queranteile der beiden Seile eines Pfostens sind gleich gross und entgegengesetzt. Sie heben sich auf.',
      ];
    },
  }),
];
