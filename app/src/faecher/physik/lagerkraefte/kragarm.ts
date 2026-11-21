// Lernkarte «Überstehende Last» (Kragarm, Last ausserhalb der Lager).
import { task, type Task } from '../../../core/types';
import { eq, f, l } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import * as B from './bilder';

export const KRAGARM: Task[] = [
  task({
    id: 'l16', karte: 'kragarm', stufe: 3, familie: 'rechnen',
    title: 'Träger mit Kragarm',
    gen: () => {
      const ll = pick([800, 1000, 1200]);
      return { F: rng(2, 8, 1), l: ll, c: ll + pick([200, 300, 400]) };
    },
    draw: (p) => B.traeger({ l: p.l, end: p.c, loads: [{ x: p.c, F: p.F, lab: `F = ${p.F} kN`, anc: true }] }, { segs: ['', `c = ${p.c - p.l}`], tot: `l = ${p.l}` }),
    loesungsbild: (p) => {
      const FB = (p.F * p.c) / p.l;
      return B.traeger({ l: p.l, end: p.c, loads: [{ x: p.c, F: p.F, lab: 'F', anc: true }] }, { RA: `F_A = ${fmt(FB - p.F)} kN nach unten`, RB: `F_B = ${fmt(FB)} kN`, negA: true });
    },
    text: (p) => `Ein Träger ragt über das Lager B hinaus. Der Lagerabstand ist ${l('l = ' + p.l + ' mm')}. Am freien Ende, ${l(p.c - p.l + ' mm')} rechts von B, wirkt ${f('F = ' + p.F + ' kN')}. Berechne a) F_B und b) den Betrag von F_A. c) In welche Richtung wirkt F_A?`,
    asks: (p) => [
      { k: 'a) F_B', unit: 'kN', v: (p.F * p.c) / p.l },
      { k: 'b) F_A (Betrag)', unit: 'kN', v: (p.F * (p.c - p.l)) / p.l },
      {
        kind: 'choice', k: 'c) F_A wirkt', opts: ['nach oben', 'nach unten'], a: 1,
        why: ['Die Last am Überstand dreht den Träger um B. Das Ende bei A will nach oben. Darum muss A ihn nach unten halten.', undefined],
      },
    ],
    fehler: (p) => [
      { ask: 0, v: p.F, msg: 'B trägt die Last und zusätzlich die Haltekraft von A. Der Hebelarm der Last um A ist l + Überstand.' },
      { ask: 0, v: (p.F * p.l) / p.c, msg: 'Du hast mit dem Kehrwert gerechnet. F_B · l = F · (l + Überstand).' },
      { ask: 1, v: (p.F * p.c) / p.l, msg: 'Das ist F_B. Für F_A gilt: F_A = F_B − F.' },
      { ask: 1, v: p.F, msg: 'F_A ist nicht gleich F. F_B trägt F und zusätzlich F_A: F_A = F_B − F.' },
    ],
    tipps: () => [
      'Drehpunkt in A. Der Hebelarm der Last ist l + Überstand.',
      'F_B · l = F · (l + Überstand)',
      'F_A = F_B − F. Der Betrag ist die Haltekraft. Sie wirkt nach unten.',
    ],
    loesung: (p) => {
      const FB = (p.F * p.c) / p.l;
      return [
        `Drehpunkt in A. Hebelarm der Last: ${eq(l('l + Überstand = ' + p.c + ' mm'))}`,
        `Momentengleichgewicht um A: ${eq(f('F_B') + ' · ' + l('l') + ' = ' + f('F') + ' · ' + l(p.c + ' mm'))}`,
        `${eq(f('F_B') + ' = ' + p.F + ' kN · ' + p.c + ' mm : ' + p.l + ' mm = ' + f(fmt(FB) + ' kN'))}`,
        `Kräftegleichgewicht: ${eq(f('F_A') + ' = ' + f('F_B') + ' − ' + f('F') + ' = ' + f(fmt(FB - p.F) + ' kN'))}`,
        `${f('F_A')} wirkt nach unten. Lager A muss den Träger festhalten, sonst hebt er ab.`,
        `Auffällig: ${f('F_B')} ist grösser als die Last. B trägt die Last und zusätzlich die Haltekraft von A.`,
      ];
    },
  }),

  task({
    id: 'l17', karte: 'kragarm', stufe: 2, familie: 'rechnen',
    title: 'Sprungbrett im Schwimmbad', src: 'Kreativ: neue Situation',
    gen: () => ({ L: pick([3, 3.5, 4]), a: pick([1, 1.2, 1.5]), F: rng(600, 1000, 50) }),
    draw: (p) => B.sprungbrett(p),
    loesungsbild: (p) => B.sprungbrett(p, { res: true }),
    text: (p) => `Ein Sprungbrett ist bei A am Boden festgeschraubt. Bei B liegt es auf einer Stütze. Am Brettende steht eine Person mit ${f('F = ' + p.F + ' N')}. Das Brett ist ${l('L = ' + fmt(p.L) + ' m')} lang. Die Stütze steht ${l('a = ' + fmt(p.a) + ' m')} von A. Berechne a) die Kraft F_B auf die Stütze und b) den Betrag der Kraft F_A in der Verschraubung. c) Drückt oder zieht die Verschraubung?`,
    asks: (p) => [
      { k: 'a) F_B', unit: 'N', v: (p.F * p.L) / p.a },
      { k: 'b) F_A (Betrag)', unit: 'N', v: (p.F * (p.L - p.a)) / p.a },
      {
        kind: 'choice', k: 'c) Verschraubung', opts: ['drückt das Brett nach oben', 'zieht das Brett nach unten'], a: 1,
        why: ['Dann müsste F_B kleiner als F sein. F_B ist aber grösser als F. Also zieht A nach unten.', undefined],
      },
    ],
    fehler: (p) => [
      { ask: 0, v: p.F, msg: 'Die Stütze trägt nicht nur die Person. Sie hält das Brett gegen das Kippen um A.' },
      { ask: 0, v: (p.F * p.a) / p.L, msg: 'Du hast mit dem Kehrwert gerechnet. F_B · a = F · L, also F_B = F · L : a.' },
      { ask: 1, v: (p.F * p.L) / p.a, msg: 'Das ist F_B. Für F_A gilt: F_A = F_B − F.' },
    ],
    tipps: () => [
      'Drehpunkt in A: F_B · a = F · L.',
      'Die Person steht ausserhalb der Lager. Das Brett will bei A nach oben kippen.',
      'F_A = F_B − F. Die Verschraubung muss das Brett nach unten ziehen.',
    ],
    loesung: (p) => {
      const FB = (p.F * p.L) / p.a;
      return [
        `Drehpunkt in A: ${eq(f('F_B') + ' · ' + l(fmt(p.a) + ' m') + ' = ' + f(p.F + ' N') + ' · ' + l(fmt(p.L) + ' m'))}`,
        `${eq(f('F_B') + ' = ' + p.F + ' · ' + fmt(p.L) + ' : ' + fmt(p.a) + ' = ' + f(fmt(FB) + ' N'))}`,
        `Kräfte: Nach oben wirkt nur F_B. Nach unten wirken F und F_A. ${eq(f('F_A') + ' = ' + fmt(FB) + ' − ' + p.F + ' = ' + f(fmt(FB - p.F) + ' N'))}`,
        'c) F_A wirkt nach unten. Die Verschraubung zieht das Brett also nach unten. Ohne sie würde das Brett hochklappen.',
        `Merke: Die Stütze trägt hier ${fmt(FB / p.F, 2)}-mal das Gewicht der Person. Ein Lager kann mehr tragen als die Last selbst.`,
      ];
    },
  }),

  task({
    id: 'l18', karte: 'kragarm', stufe: 3, familie: 'rechnen',
    title: 'Containerfahrzeug', src: 'nach Buch Lagerkräfte, Nr. 7',
    gen: () => {
      let r: { F1: number; F2: number; l: number; d: number; c: number };
      do {
        r = { F1: rng(30, 45, 1), F2: rng(10, 25, 1), l: 3600, d: pick([2000, 2200, 2400]), c: pick([2500, 3000]) };
      } while (r.F1 * r.d - r.F2 * r.c < 2000);
      return r;
    },
    draw: (p) => B.traeger({ l: p.l, end: p.l + p.c, loads: [{ x: p.l - p.d, F: p.F1, lab: `F_1 = ${p.F1} kN` }, { x: p.l + p.c, F: p.F2, lab: `F_2 = ${p.F2} kN`, anc: true }] }, { segs: ['', `${p.d}`, `${p.c}`], tot: `l = ${p.l}` }),
    text: (p) => `Ein Fahrzeug mit der Gewichtskraft ${f('F_1 = ' + p.F1 + ' kN')} hebt einen Container mit ${f('F_2 = ' + p.F2 + ' kN')} an. Der Radstand ist ${l('l = ' + p.l + ' mm')}. F_1 greift ${l(p.d + ' mm')} vor der Hinterachse B an. Der Container hängt ${l(p.c + ' mm')} hinter der Hinterachse. Wie gross sind die Belastungen F_A (Vorderräder) und F_B (Hinterräder)?`,
    asks: (p) => {
      const FA = (p.F1 * p.d - p.F2 * p.c) / p.l;
      return [{ k: 'F_A', unit: 'kN', v: FA }, { k: 'F_B', unit: 'kN', v: p.F1 + p.F2 - FA }];
    },
    fehler: (p) => {
      const FAw = (p.F1 * p.d + p.F2 * p.c) / p.l;
      return [
        { ask: 0, v: FAw, msg: 'F_2 hängt auf der anderen Seite von B. Sein Moment um B dreht entgegen F_1. Es wird abgezogen.' },
        { ask: 0, v: (p.F1 * p.d) / p.l, msg: 'Der Container fehlt. Er dreht um B und entlastet die Vorderräder.' },
        { ask: 1, v: p.F1 + p.F2 - FAw, msg: 'Dieser Wert folgt aus einem falschen F_A. Das Moment des Containers um B muss abgezogen werden.' },
      ];
    },
    tipps: (p) => [
      'Wähle den Drehpunkt in B (Hinterachse). Dann fällt F_B weg.',
      'Um B drehen F_1 und F_2 in verschiedene Richtungen. F_2 hängt auf der anderen Seite von B.',
      `F_A · l + F_2 · ${p.c} mm = F_1 · ${p.d} mm. Danach F_B = F_1 + F_2 − F_A.`,
    ],
    loesung: (p) => {
      const FA = (p.F1 * p.d - p.F2 * p.c) / p.l;
      return [
        'Drehpunkt in B. Ersatzbild: Träger mit überstehendem Ende.',
        `Momentengleichgewicht: ${eq(f('F_A') + ' · ' + p.l + ' mm + ' + f('F_2') + ' · ' + p.c + ' mm = ' + f('F_1') + ' · ' + p.d + ' mm')}`,
        `${eq(f('F_A') + ' = (' + p.F1 + ' kN · ' + p.d + ' − ' + p.F2 + ' kN · ' + p.c + ') : ' + p.l + ' = ' + f(fmt(FA, 3) + ' kN'))}`,
        `${eq(f('F_B') + ' = ' + p.F1 + ' kN + ' + p.F2 + ' kN − ' + fmt(FA, 3) + ' kN = ' + f(fmt(p.F1 + p.F2 - FA, 3) + ' kN'))}`,
        'Die Vorderräder werden stark entlastet. Wäre der Container schwerer, würde das Fahrzeug vorn abheben.',
        'Warnung: Hebt das Fahrzeug vorn ab, kippt es. Es besteht Unfallgefahr. Darum gibt es Traglasttabellen.',
      ];
    },
  }),

  task({
    id: 'l19', karte: 'kragarm', stufe: 3, familie: 'rechnen',
    title: 'Velo mit Gepäck hinten', src: 'eigene Variante zu Buch Nr. 7',
    gen: () => ({ l: pick([1000, 1050, 1100]), F1: rng(600, 900, 50), d: pick([350, 400, 450]), F2: rng(100, 300, 50), c: pick([150, 200, 250]) }),
    draw: (p) => B.traeger({ l: p.l, end: p.l + p.c, loads: [{ x: p.l - p.d, F: p.F1, lab: `F_1 = ${p.F1} N` }, { x: p.l + p.c, F: p.F2, lab: `F_2 = ${p.F2} N` }] }, { segs: ['', `${p.d}`, `${p.c}`], tot: `l = ${p.l}` }),
    text: (p) => `Ein Velo hat den Radstand ${l('l = ' + p.l + ' mm')} zwischen Vorderrad A und Hinterrad B. Die Fahrerin drückt mit ${f('F_1 = ' + p.F1 + ' N')}, ${l(p.d + ' mm')} vor dem Hinterrad. Auf dem Gepäckträger liegt Gepäck mit ${f('F_2 = ' + p.F2 + ' N')}, ${l(p.c + ' mm')} hinter dem Hinterrad. Wie stark werden Vorderrad (F_A) und Hinterrad (F_B) belastet?`,
    asks: (p) => {
      const FA = (p.F1 * p.d - p.F2 * p.c) / p.l;
      return [{ k: 'F_A', unit: 'N', v: FA }, { k: 'F_B', unit: 'N', v: p.F1 + p.F2 - FA }];
    },
    fehler: (p) => {
      const FAw = (p.F1 * p.d + p.F2 * p.c) / p.l;
      return [
        { ask: 0, v: FAw, msg: 'Das Gepäck hängt auf der anderen Seite von B. Sein Moment um B wird abgezogen.' },
        { ask: 0, v: (p.F1 * p.d) / p.l, msg: 'Das Gepäck fehlt. Es dreht um B und entlastet das Vorderrad.' },
        { ask: 1, v: p.F1 + p.F2 - FAw, msg: 'Dieser Wert folgt aus einem falschen F_A. Das Moment des Gepäcks um B muss abgezogen werden.' },
      ];
    },
    tipps: (p) => [
      'Wie beim Containerfahrzeug: Drehpunkt in B (Hinterrad).',
      `F_A · l + F_2 · ${p.c} mm = F_1 · ${p.d} mm`,
      'F_B = F_1 + F_2 − F_A',
    ],
    loesung: (p) => {
      const FA = (p.F1 * p.d - p.F2 * p.c) / p.l;
      return [
        'Drehpunkt in B. Das Gepäck dreht um B entgegen der Fahrerin.',
        `${eq(f('F_A') + ' = (' + p.F1 + ' · ' + p.d + ' − ' + p.F2 + ' · ' + p.c + ') N·mm : ' + p.l + ' mm = ' + f(fmt(FA) + ' N'))}`,
        `${eq(f('F_B') + ' = ' + p.F1 + ' + ' + p.F2 + ' − ' + fmt(FA) + ' = ' + f(fmt(p.F1 + p.F2 - FA) + ' N'))}`,
        'Mit schwerem Gepäck weit hinten wird das Vorderrad leicht. Das Velo lenkt dann schlecht.',
      ];
    },
  }),

  task({
    id: 'l20', karte: 'kragarm', stufe: 2, familie: 'fehler',
    title: 'Wo steckt der Fehler?', src: 'Kreativ: Fehler finden',
    gen: () => ({ l: pick([1200, 1500, 1800]), a: pick([400, 500, 600]), c: pick([300, 400]), F1: rng(4, 10, 1), F2: rng(2, 5, 1) }),
    draw: (p) => B.traeger({ l: p.l, end: p.l + p.c, loads: [{ x: p.a, F: p.F1, lab: `F_1 = ${p.F1} kN`, anc: true }, { x: p.l + p.c, F: p.F2, lab: `F_2 = ${p.F2} kN` }] }, { segs: [`${p.a}`, '', `c = ${p.c}`], tot: `l = ${p.l}` }),
    text: (p) => {
      const FBf = (p.F1 * p.a + p.F2 * p.c) / p.l;
      return `Ein Lernender hat diese Lösung abgegeben:<ol><li>Drehpunkt in A.</li><li>F_B · ${p.l} = ${p.F1} · ${p.a} + ${p.F2} · ${p.c}</li><li>F_B = ${fmt(FBf)} kN</li><li>F_A = ${p.F1} + ${p.F2} − ${fmt(FBf)} = ${fmt(p.F1 + p.F2 - FBf)} kN</li></ol>Finde den Fehler. Berechne die richtigen Lagerkräfte F_A und F_B.`;
    },
    asks: (p) => {
      const FB = (p.F1 * p.a + p.F2 * (p.l + p.c)) / p.l;
      return [{ k: 'F_A', unit: 'kN', v: p.F1 + p.F2 - FB }, { k: 'F_B', unit: 'kN', v: FB }];
    },
    fehler: (p) => {
      const FBf = (p.F1 * p.a + p.F2 * p.c) / p.l;
      return [
        { ask: 0, v: p.F1 + p.F2 - FBf, msg: 'Das ist der Wert aus der falschen Lösung. Für F_2 gilt der Hebelarm l + c, nicht c.' },
        { ask: 1, v: FBf, msg: 'Das ist der Wert aus der falschen Lösung. Für F_2 gilt der Hebelarm l + c, nicht c.' },
      ];
    },
    tipps: () => [
      'Schau Zeile 2 an. Welcher Hebelarm gehört zu F_2?',
      'Der Hebelarm wird immer vom Drehpunkt aus gemessen, nicht vom nächsten Lager.',
      'Ein negatives F_A hiesse: Das Lager A zieht nach unten.',
    ],
    loesung: (p) => {
      const x = p.l + p.c, FB = (p.F1 * p.a + p.F2 * x) / p.l, FA = p.F1 + p.F2 - FB;
      return [
        `Fehler in Zeile 2: Für F_2 wurde der Hebelarm c = ${p.c} mm eingesetzt. Das ist der Abstand ab B. Der Drehpunkt liegt aber in A.`,
        `Richtiger Hebelarm: ${eq(l(p.l + ' + ' + p.c + ' = ' + x + ' mm'))}`,
        `${eq(f('F_B') + ' = (' + p.F1 + ' · ' + p.a + ' + ' + p.F2 + ' · ' + x + ') : ' + p.l + ' = ' + f(fmt(FB) + ' kN'))}`,
        `${eq(f('F_A') + ' = ' + p.F1 + ' + ' + p.F2 + ' − ' + fmt(FB) + ' = ' + f(fmt(FA) + ' kN'))}`,
        'Kontrolle mit Drehpunkt in B lohnt sich immer. So findest du solche Fehler selbst.',
      ];
    },
  }),

  task({
    id: 'l21', karte: 'kragarm', stufe: 3, familie: 'umgekehrt',
    title: 'Anhänger richtig beladen: die Stützlast', src: 'Kreativ: neue Situation und umgekehrt',
    gen: () => {
      let r: { l: number; FL: number; xL: number; F: number; x: number; S: number };
      let x2: number;
      do {
        r = { l: pick([2.4, 2.6, 2.8]), FL: pick([1500, 2000, 2500]), xL: pick([1.8, 2]), F: pick([4000, 5000, 6000]), x: pick([1.4, 1.6, 1.8]), S: pick([500, 600, 700]) };
        x2 = ((r.FL + r.F - r.S) * r.l - r.FL * r.xL) / r.F;
      } while (x2 < 0.9 || x2 > r.l - 0.1);
      return r;
    },
    draw: (p) => B.anhaenger(p),
    loesungsbild: (p) => {
      const FB = (p.FL * p.xL + p.F * p.x) / p.l;
      return B.anhaenger(p, { RA: `F_A = ${fmt(p.FL + p.F - FB)} N`, RB: `F_B = ${fmt(FB)} N` });
    },
    text: (p) => `Ein einachsiger Anhänger hängt bei A an der Kupplung des Autos. Die Achse B liegt ${l('l = ' + fmt(p.l) + ' m')} hinter der Kupplung. Der leere Anhänger wiegt ${f('F_L = ' + p.FL + ' N')}, Schwerpunkt ${l(fmt(p.xL) + ' m')} hinter A. Die Ladung wiegt ${f('F = ' + p.F + ' N')} und steht ${l('x = ' + fmt(p.x) + ' m')} hinter A. a) Wie gross ist die Stützlast F_A? b) Wie gross ist F_B? c) Wo muss die Ladung stehen, damit die Stützlast genau ${f(p.S + ' N')} beträgt?`,
    asks: (p) => {
      const FB = (p.FL * p.xL + p.F * p.x) / p.l;
      return [
        { k: 'a) F_A', unit: 'N', v: p.FL + p.F - FB },
        { k: 'b) F_B', unit: 'N', v: FB },
        { k: 'c) x', unit: 'm', v: ((p.FL + p.F - p.S) * p.l - p.FL * p.xL) / p.F },
      ];
    },
    fehler: (p) => [
      { ask: 0, v: p.FL + p.F, msg: 'Das ist die Summe der Gewichte. Davon trägt die Achse B den grössten Teil. Ziehe F_B ab.' },
      { ask: 1, v: (p.F * p.x) / p.l, msg: 'Das Gewicht des leeren Anhängers fehlt. Es dreht auch um A.' },
      { ask: 2, v: ((p.FL + p.F - p.S) * p.l) / p.F, msg: 'Das Moment des leeren Anhängers fehlt. Ziehe F_L · Abstand ab, bevor du durch F teilst.' },
    ],
    tipps: (p) => [
      `Drehpunkt in A (Kupplung): F_B · l = F_L · ${fmt(p.xL)} m + F · x`,
      'F_A = F_L + F − F_B',
      `c) Umgekehrt: F_A ist gegeben. Also kennst du F_B = F_L + F − ${p.S} N. Dann die Momentengleichung nach x umstellen.`,
    ],
    loesung: (p) => {
      const FB = (p.FL * p.xL + p.F * p.x) / p.l, FA = p.FL + p.F - FB, FB2 = p.FL + p.F - p.S, x2 = (FB2 * p.l - p.FL * p.xL) / p.F;
      return [
        `a) Drehpunkt in A: ${eq(f('F_B') + ' = (' + p.FL + ' · ' + fmt(p.xL) + ' + ' + p.F + ' · ' + fmt(p.x) + ') : ' + fmt(p.l) + ' = ' + f(fmt(FB) + ' N'))}`,
        `${eq(f('F_A') + ' = ' + p.FL + ' + ' + p.F + ' − ' + fmt(FB) + ' = ' + f(fmt(FA) + ' N'))}`,
        `c) Gesucht ist x für F_A = ${p.S} N. ${eq(f('F_B') + ' = ' + p.FL + ' + ' + p.F + ' − ' + p.S + ' = ' + fmt(FB2) + ' N')}`,
        `${eq(l('x') + ' = (' + fmt(FB2) + ' · ' + fmt(p.l) + ' − ' + p.FL + ' · ' + fmt(p.xL) + ') : ' + p.F + ' = ' + l(fmt(x2, 2) + ' m'))}`,
        'Ladung weiter nach vorne bringt mehr Stützlast. Ladung hinter der Achse hebt die Deichsel.',
        'Warnung: Eine zu kleine oder negative Stützlast lässt den Anhänger schlingern. Es besteht Unfallgefahr. Die erlaubte Stützlast steht in den Fahrzeugpapieren.',
      ];
    },
  }),

  task({
    id: 'l22', karte: 'kragarm', stufe: 2, familie: 'schaetzen',
    title: 'Schätzen: Lagerkraft beim Kragarm',
    gen: () => {
      const c = pick([200, 300]), k = pick([2, 3, 4]);
      return { F: pick([4, 6, 8, 10]), c, k, l: k * c };
    },
    draw: (p) => B.traeger({ l: p.l, end: p.l + p.c, loads: [{ x: p.l + p.c, F: p.F, lab: `F = ${p.F} kN`, anc: true }] }, { segs: ['', `c = ${p.c}`], tot: `l = ${p.l}` }),
    text: (p) => `Ein Träger liegt auf A und B (${l('l = ' + p.l + ' mm')}). Rechts von B ragt er ${l(p.c + ' mm')} über. Am Ende wirkt ${f('F = ' + p.F + ' kN')}. Der Abstand l ist ${p.k}-mal so gross wie der Überstand. Ohne Taschenrechner: Wie gross ist F_B ungefähr?`,
    asks: (p) => [{
      kind: 'choice', k: 'F_B etwa',
      opts: [`${fmt(p.F)} kN`, `${fmt(p.F * (1 + 1 / p.k))} kN`, `${fmt(2 * p.F)} kN`],
      a: 1,
      why: [
        'Zu klein. B trägt die Last und zusätzlich die Haltekraft von A.',
        undefined,
        'Zu gross. Der Überstand ist viel kleiner als der Lagerabstand. Der Zuschlag ist nur ein Bruchteil von F.',
      ],
    }],
    tipps: () => [
      'B trägt die Last und zusätzlich die Haltekraft von A.',
      'F_B = F · (l + Überstand) : l = F · (1 + Überstand : l)',
      'Überstand : l ist hier ein einfacher Bruch.',
    ],
    loesung: (p) => [
      `Der Überstand ist ${p.k}-mal kleiner als l: ${eq(p.c + ' : ' + p.l + ' = 1 : ' + p.k)}`,
      `${eq(f('F_B') + ' = ' + f('F') + ' · (1 + 1 : ' + p.k + ') = ' + p.F + ' kN · ' + fmt(1 + 1 / p.k, 3) + ' = ' + f(fmt(p.F * (1 + 1 / p.k)) + ' kN'))}`,
      'Merke: Je kürzer der Überstand, desto näher liegt F_B bei F.',
    ],
  }),

  task({
    id: 'l23', karte: 'kragarm', stufe: 2, familie: 'begruenden',
    title: 'Begründen: Warum zieht Lager A nach unten?',
    gen: () => ({ l: pick([800, 1000, 1200]), c: pick([200, 300, 400]), F: rng(2, 8, 1) }),
    draw: (p) => B.traeger({ l: p.l, end: p.l + p.c, loads: [{ x: p.l + p.c, F: p.F, lab: `F = ${p.F} kN`, anc: true }] }, { segs: ['', `c = ${p.c}`], tot: `l = ${p.l}`, RA: 'F_A = ? (nach unten)', negA: true }),
    text: (p) => `Ein Träger liegt auf A und B. Rechts von B ragt er ${l(p.c + ' mm')} über. Am Ende wirkt ${f('F = ' + p.F + ' kN')} nach unten. Die Rechnung zeigt: Das Lager A muss den Träger nach unten halten. Warum?`,
    asks: () => [{
      kind: 'choice', k: 'Begründung',
      opts: [
        'Die Last am Überstand dreht den Träger um B. Das Ende bei A will nach oben.',
        'Das Eigengewicht des Trägers drückt A nach unten.',
        'Lager B drückt zu stark nach oben und hebt A mit.',
      ],
      a: 0,
      why: [
        undefined,
        'Das Eigengewicht spielt hier keine Rolle. Es geht um das Moment der Last am Überstand.',
        'B reagiert auf die Last. Das ist die Folge, nicht der Grund.',
      ],
    }],
    tipps: () => [
      'Denke an eine Wippe. B ist der Drehpunkt.',
      'Die Last rechts von B drückt dieses Ende nach unten.',
      'Was passiert dann auf der anderen Seite von B, also bei A?',
    ],
    loesung: (p) => [
      'B wirkt wie der Drehpunkt einer Wippe. Die Last am Überstand drückt rechts nach unten.',
      'Links von B geht der Träger darum nach oben. Das Lager A hält ihn fest. Es zieht also nach unten.',
      `Rechnerisch: ${eq(f('F_A') + ' = ' + f('F_B') + ' − ' + f('F'))}. B trägt mehr als F, den Rest hält A nach unten.`,
    ],
  }),
];
