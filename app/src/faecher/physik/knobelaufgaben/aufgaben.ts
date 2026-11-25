// Aufgaben zum Kapitel Knobelaufgaben: Mobile, Brücke, Gabelstapler, Kugelbahn.
import { task, type ChoiceAsk, type Task } from '../../../core/types';
import { eq, f, l, m, v as w } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import { traeger } from '../lagerkraefte/bilder';
import * as B from './bilder';

const g = 9.81;

/** Auswahlfrage: Die richtige Antwort steht an einer wechselnden Stelle (pos). */
function waehle(k: string, richtig: string, falsch: [string, string][], pos: number): ChoiceAsk {
  const opts = falsch.map((x) => x[0]);
  const why: (string | undefined)[] = falsch.map((x) => x[1]);
  const i = pos % (falsch.length + 1);
  opts.splice(i, 0, richtig);
  why.splice(i, 0, undefined);
  return { kind: 'choice', k, opts, a: i, why };
}

const genMobile = () => {
  const [c, d] = pick([[30, 15], [40, 20], [30, 10], [24, 12], [36, 12]]);
  const [a, b] = pick([[10, 5], [12, 6], [15, 5], [10, 10], [20, 10]]);
  return { m1: rng(60, 240, 20), c, d, a, b, pos: rng(0, 3, 1) };
};

const BRUECKE = (p: { l: number; x: number; FG: number }, RA: string, seg: string) =>
  traeger(
    { l: p.l, loads: [{ x: p.x, F: 1, lab: `F_G = ${p.FG} kN`, box: true }] },
    { RA, RB: 'F_B = ?', segs: [seg, ''], tot: `l = ${p.l} m` },
  );

export const AUFGABEN: Task[] = [
  // ---------- Karte «mobile» ----------

  task({
    id: 'x1', karte: 'mobile', stufe: 2, familie: 'kette',
    title: 'Das Mobile: zwei Hebel übereinander',
    gen: genMobile,
    draw: (p) => B.mobile(p),
    text: (p) => `Ein Mobile soll im Gleichgewicht hängen. Links hängt eine Kugel mit ${p.m1} g. Rechts hängt ein zweiter Stab mit zwei unbekannten Figuren. Die Abstände sind ${l('c = ' + p.c + ' cm')}, ${l('d = ' + p.d + ' cm')}, ${l('a = ' + p.a + ' cm')} und ${l('b = ' + p.b + ' cm')}. Berechne a) die Masse, die insgesamt am rechten Ende des oberen Stabs hängen muss, b) m_2 und c) m_3.`,
    asks: (p) => {
      const M = (p.m1 * p.c) / p.d;
      return [
        { k: 'a) m_2 + m_3', unit: 'g', v: M },
        { k: 'b) m_2', unit: 'g', v: (M * p.b) / (p.a + p.b) },
        { k: 'c) m_3', unit: 'g', v: (M * p.a) / (p.a + p.b) },
      ];
    },
    fehler: (p) => {
      const M = (p.m1 * p.c) / p.d;
      const sum = 'Das ist die Summe m_2 + m_3. Sie muss noch auf die zwei Figuren aufgeteilt werden.';
      return [
        { ask: 0, v: (p.m1 * p.d) / p.c, msg: 'Die Hebelarme sind vertauscht. Der kürzere Arm d trägt die grössere Masse.' },
        { ask: 1, v: M, msg: sum },
        { ask: 2, v: M, msg: sum },
        ...(p.a !== p.b ? [
          { ask: 1, v: (M * p.a) / (p.a + p.b), msg: 'Das ist der Wert von m_3. Die Masse am kürzeren Arm muss grösser sein.' },
          { ask: 2, v: (M * p.b) / (p.a + p.b), msg: 'Das ist der Wert von m_2. Die Masse am kürzeren Arm muss grösser sein.' },
        ] : []),
      ];
    },
    tipps: () => [
      'Arbeite von oben nach unten. Der obere Stab «sieht» den unteren Stab nur als ein einziges Gewicht.',
      'Oberer Stab: m_1 · c = (m_2 + m_3) · d. Die Fallbeschleunigung g kürzt sich weg, darum darf man mit Massen rechnen.',
      'Unterer Stab: m_2 · a = m_3 · b. Die Summe aus a) teilt sich im umgekehrten Verhältnis der Hebelarme auf: m_2 = Summe · b : (a + b).',
    ],
    loesung: (p) => {
      const M = (p.m1 * p.c) / p.d, m2 = (M * p.b) / (p.a + p.b), m3 = (M * p.a) / (p.a + p.b);
      return [
        `Oberer Stab: ${eq('m_1 · ' + l('c') + ' = (m_2 + m_3) · ' + l('d'))}`,
        `${eq('m_2 + m_3 = ' + p.m1 + ' g · ' + p.c + ' cm : ' + p.d + ' cm = ' + fmt(M) + ' g')}`,
        `Unterer Stab: ${eq('m_2 · ' + l('a') + ' = m_3 · ' + l('b'))}. Die Masse am kürzeren Arm muss grösser sein.`,
        `Aufteilen im umgekehrten Verhältnis: ${eq('m_2 = ' + fmt(M) + ' g · ' + p.b + ' : (' + p.a + ' + ' + p.b + ') = ' + fmt(m2) + ' g')}`,
        `${eq('m_3 = ' + fmt(M) + ' g − ' + fmt(m2) + ' g = ' + fmt(m3) + ' g')}`,
        `Kontrolle unten: ${eq(fmt(m2) + ' g · ' + p.a + ' cm = ' + fmt(m3) + ' g · ' + p.b + ' cm')}. Beide Seiten ergeben ${fmt((M * p.a * p.b) / (p.a + p.b))}.`,
      ];
    },
    loesungsbild: (p) => {
      const M = (p.m1 * p.c) / p.d;
      return B.mobile(p, { m2: `${fmt((M * p.b) / (p.a + p.b))} g`, m3: `${fmt((M * p.a) / (p.a + p.b))} g` });
    },
  }),

  task({
    id: 'x2', karte: 'mobile', stufe: 2, familie: 'fehler',
    title: 'Fehler finden: Noahs Mobile',
    gen: genMobile,
    draw: (p) => B.mobile(p),
    text: (p) => {
      const falsch = (p.m1 * p.d) / p.c;
      return `Am Mobile hängt links im Abstand ${l('c = ' + p.c + ' cm')} eine Kugel mit ${p.m1} g. Rechts hängt im Abstand ${l('d = ' + p.d + ' cm')} der untere Stab. Noah rechnet die Masse, die am rechten Ende des oberen Stabs hängen muss: «m_2 + m_3 = m_1 · d : c = ${p.m1} g · ${p.d} cm : ${p.c} cm = ${fmt(falsch)} g». Was ist falsch?`;
    },
    asks: (p) => {
      const M = (p.m1 * p.c) / p.d;
      return [waehle('Fehler', `Er hat die Hebelarme vertauscht. Richtig ist m_1 · c : d = ${fmt(M)} g.`, [
        ['Er hätte m_1 · c · d rechnen müssen.', 'Beim Hebelgesetz steht auf jeder Seite Masse mal Hebelarm. Die Hebelarme werden nicht miteinander multipliziert.'],
        ['Er hätte die Fallbeschleunigung g mit einrechnen müssen.', 'g steht auf beiden Seiten der Gleichung und kürzt sich weg.'],
        ['Nichts, die Rechnung stimmt.', 'Der kürzere Arm trägt die grössere Masse. Bei Noah ist es umgekehrt.'],
      ], p.pos)];
    },
    tipps: () => [
      'Prüfe die Richtung: Welcher Arm ist länger? Welche Seite braucht dann die grössere Masse?',
      'Der rechte Arm d ist kürzer als der linke Arm c. Rechts muss also mehr Masse hängen als links.',
      'Noahs Resultat ist kleiner als m_1. Das passt nicht dazu.',
    ],
    loesung: (p) => {
      const M = (p.m1 * p.c) / p.d;
      return [
        `Hebelgesetz oben: ${eq('m_1 · ' + l('c') + ' = (m_2 + m_3) · ' + l('d'))}`,
        `Richtig umgestellt: ${eq('m_2 + m_3 = m_1 · ' + l('c') + ' : ' + l('d') + ' = ' + p.m1 + ' g · ' + p.c + ' cm : ' + p.d + ' cm = ' + fmt(M) + ' g')}`,
        'Merke: Kurzer Arm, grosse Masse. Langer Arm, kleine Masse.',
      ];
    },
  }),

  task({
    id: 'x3', karte: 'mobile', stufe: 3, familie: 'umgekehrt',
    title: 'Mobile umgekehrt: Abstände gesucht',
    gen: () => {
      for (;;) {
        const m3 = pick([20, 30, 40]), r = pick([2, 3]), a = pick([5, 8]), d = pick([10, 15, 20]), c = pick([30, 40]);
        const m1 = ((r + 1) * m3 * d) / c;
        if (Number.isInteger(m1)) return { m1, m2: r * m3, m3, a, b: r * a, c, d };
      }
    },
    draw: (p) => B.mobile(p, { m2: `${p.m2} g`, m3: `${p.m3} g`, d: 'd = ?', b: 'b = ?' }),
    text: (p) => `Ein Mobile hängt im Gleichgewicht. Die Massen sind bekannt: ${p.m1} g links am oberen Stab, ${p.m2} g (m_2) und ${p.m3} g (m_3) am unteren Stab. Bekannt sind auch ${l('a = ' + p.a + ' cm')} und ${l('c = ' + p.c + ' cm')}. Berechne a) den Abstand b und b) den Abstand d.`,
    asks: (p) => [
      { k: 'a) b', unit: 'cm', v: (p.m2 * p.a) / p.m3 },
      { k: 'b) d', unit: 'cm', v: (p.m1 * p.c) / (p.m2 + p.m3) },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.m3 * p.a) / p.m2, msg: 'Die Massen sind vertauscht. Die kleinere Masse m_3 braucht den längeren Arm.' },
      { ask: 1, v: (p.m1 * p.c) / p.m2, msg: 'Am rechten Ende des oberen Stabs hängt der ganze untere Stab: m_2 + m_3, nicht nur m_2.' },
    ],
    tipps: () => [
      'Zwei Stäbe, zwei Hebelgesetze. Starte unten.',
      'Unten: m_2 · a = m_3 · b. Oben: m_1 · c = (m_2 + m_3) · d.',
      'b = m_2 · a : m_3 und d = m_1 · c : (m_2 + m_3)',
    ],
    loesung: (p) => [
      `Unterer Stab: ${eq('m_2 · ' + l('a') + ' = m_3 · ' + l('b'))}`,
      `${eq(l('b') + ' = m_2 · ' + l('a') + ' : m_3 = ' + p.m2 + ' g · ' + p.a + ' cm : ' + p.m3 + ' g = ' + l(fmt((p.m2 * p.a) / p.m3) + ' cm'))}`,
      `Oberer Stab: ${eq('m_1 · ' + l('c') + ' = (m_2 + m_3) · ' + l('d'))}`,
      `${eq(l('d') + ' = m_1 · ' + l('c') + ' : (m_2 + m_3) = ' + p.m1 + ' g · ' + p.c + ' cm : ' + (p.m2 + p.m3) + ' g = ' + l(fmt((p.m1 * p.c) / (p.m2 + p.m3)) + ' cm'))}`,
      'Kontrolle: Die schwerere Figur m_2 hängt am kürzeren Arm. Das passt.',
    ],
  }),

  task({
    id: 'x4', karte: 'mobile', stufe: 2, familie: 'waswaere',
    title: 'Was wäre wenn: zweite Kugel am Mobile',
    gen: genMobile,
    draw: (p) => B.mobile(p),
    text: (p) => `Das Mobile hängt im Gleichgewicht. Links hängt im Abstand ${l('c = ' + p.c + ' cm')} eine Kugel mit ${p.m1} g. Rechts hängt im Abstand ${l('d = ' + p.d + ' cm')} der untere Stab. Du hängst eine zweite, gleiche Kugel an dieselbe Stelle links. a) Was passiert mit dem Mobile? b) Welche Masse müsste dann rechts am oberen Stab hängen, damit es wieder im Gleichgewicht ist?`,
    asks: (p) => [
      waehle('a) Das Mobile', 'Die linke Seite sinkt.', [
        ['Es bleibt im Gleichgewicht.', 'Links ist das Moment jetzt doppelt so gross. Rechts hat sich nichts geändert.'],
        ['Die rechte Seite sinkt.', 'Links wirkt jetzt mehr Moment. Die Seite mit dem grösseren Moment sinkt, also die linke.'],
      ], p.pos),
      { k: 'b) m_2 + m_3 neu', unit: 'g', v: (2 * p.m1 * p.c) / p.d },
    ],
    fehler: (p) => [{ ask: 1, v: (p.m1 * p.c) / p.d, msg: 'Das ist der alte Wert. Links hängen jetzt zwei Kugeln.' }],
    tipps: () => [
      'Vergleiche die Momente links und rechts. Was hat sich geändert?',
      'Links ist die Masse doppelt so gross, der Hebelarm bleibt.',
      'Neues Gleichgewicht: 2 · m_1 · c = (m_2 + m_3)neu · d',
    ],
    loesung: (p) => [
      `Das linke Moment verdoppelt sich. Das rechte bleibt gleich. Die linke Seite sinkt.`,
      `Neues Gleichgewicht: ${eq('2 · m_1 · ' + l('c') + ' = (m_2 + m_3) · ' + l('d'))}`,
      `${eq('m_2 + m_3 = 2 · ' + p.m1 + ' g · ' + p.c + ' cm : ' + p.d + ' cm = ' + fmt((2 * p.m1 * p.c) / p.d) + ' g')}`,
      'Doppelte Masse links braucht rechts die doppelte Masse. Der Hebelarm bleibt ja gleich.',
    ],
  }),

  // ---------- Karte «bruecke» ----------

  task({
    id: 'x5', karte: 'bruecke', stufe: 2, familie: 'umgekehrt',
    title: 'Lastwagen auf der Brücke: Position gesucht',
    gen: () => {
      const ll = pick([12, 15, 20, 24]), r = pick([0.6, 0.7, 0.75, 0.8]), FG = pick([80, 100, 120, 160]);
      return { l: ll, FG, FA: FG * r, x: (1 - r) * ll };
    },
    draw: (p) => traeger(
      { l: p.l, loads: [{ x: p.x, F: 1, lab: `F_G = ${p.FG} kN`, box: true }] },
      { RA: `F_A = ${fmt(p.FA)} kN`, RB: 'F_B = ?', segs: ['x = ?', ''], tot: `l = ${p.l} m` },
    ),
    text: (p) => `Ein Lastwagen mit ${f('F_G = ' + p.FG + ' kN')} steht auf einer Brücke mit ${l('l = ' + p.l + ' m')}. Ein Sensor im Lager A misst ${f('F_A = ' + fmt(p.FA) + ' kN')}. Berechne a) die Lagerkraft F_B und b) den Abstand x des Lastwagens vom Lager A.`,
    asks: (p) => [
      { k: 'a) F_B', unit: 'kN', v: p.FG - p.FA },
      { k: 'b) x', unit: 'm', v: p.x },
    ],
    fehler: (p) => [
      { ask: 0, v: p.FG + p.FA, msg: 'Die Lagerkräfte tragen zusammen die Last. Sie werden von F_G abgezogen, nicht addiert.' },
      { ask: 1, v: (p.FA * p.l) / p.FG, msg: 'Das ist der Abstand von Lager B. Gesucht ist x von Lager A aus.' },
    ],
    tipps: () => [
      'Diesmal läuft die Rechnung rückwärts. Beginne mit dem Kräftegleichgewicht.',
      'F_B = F_G − F_A',
      'Momentengleichgewicht um A: F_B · l = F_G · x. Stelle nach x um.',
    ],
    loesung: (p) => [
      `Kräftegleichgewicht: ${eq(f('F_B') + ' = ' + f('F_G') + ' − ' + f('F_A') + ' = ' + p.FG + ' kN − ' + fmt(p.FA) + ' kN = ' + f(fmt(p.FG - p.FA) + ' kN'))}`,
      `Momentengleichgewicht um A: ${eq(f('F_B') + ' · ' + l('l') + ' = ' + f('F_G') + ' · ' + l('x'))}`,
      `Umstellen: ${eq(l('x') + ' = ' + f('F_B') + ' · ' + l('l') + ' : ' + f('F_G') + ' = ' + fmt(p.FG - p.FA) + ' kN · ' + p.l + ' m : ' + p.FG + ' kN')}`,
      `Resultat: ${eq(l('x = ' + fmt(p.x) + ' m'))}`,
      `Kontrolle: A trägt ${fmt((p.FA / p.FG) * 100, 0)} % der Last. Also steht der Lastwagen näher bei A. Das passt: x ist kleiner als l : 2 = ${fmt(p.l / 2)} m.`,
    ],
  }),

  task({
    id: 'x6', karte: 'bruecke', stufe: 1, familie: 'schaetzen',
    title: 'Schätzen: Lastwagen bei einem Viertel der Brücke',
    gen: () => ({ l: pick([12, 16, 20, 24]), FG: pick([80, 100, 120, 160]), pos: rng(0, 3, 1) }),
    draw: (p) => BRUECKE({ l: p.l, x: p.l / 4, FG: p.FG }, 'F_A = ?', `x = ${fmt(p.l / 4)} m`),
    text: (p) => `Ein Lastwagen mit ${f('F_G = ' + p.FG + ' kN')} steht auf einer Brücke der Länge ${l('l = ' + p.l + ' m')}. Er steht genau ${l(fmt(p.l / 4) + ' m')} vom Lager A entfernt, also bei einem Viertel der Brücke. Ohne Rechnen: Wie viel trägt Lager A ungefähr?`,
    asks: (p) => [waehle('F_A etwa', `${fmt(p.FG * 0.75)} kN`, [
      [`${fmt(p.FG * 0.25)} kN`, 'So viel trägt Lager B. Der Lastwagen steht näher bei A, also trägt A mehr.'],
      [`${fmt(p.FG * 0.5)} kN`, 'Nur in der Mitte der Brücke tragen beide Lager gleich viel.'],
      [`${fmt(p.FG)} kN`, 'Dann müsste der Lastwagen genau über A stehen. Lager B würde nichts tragen.'],
    ], p.pos)],
    tipps: () => [
      'Je näher die Last bei einem Lager steht, desto mehr trägt dieses Lager.',
      'Lager B ist dreimal so weit weg wie Lager A. Es trägt darum nur ein Viertel.',
      'F_B = F_G · x : l = F_G : 4. Dann F_A = F_G − F_B.',
    ],
    loesung: (p) => [
      `Momentengleichgewicht um A: ${eq(f('F_B') + ' = ' + f('F_G') + ' · ' + l('x') + ' : ' + l('l') + ' = ' + p.FG + ' kN : 4 = ' + f(fmt(p.FG / 4) + ' kN'))}`,
      `${eq(f('F_A') + ' = ' + f('F_G') + ' − ' + f('F_B') + ' = ' + f(fmt(p.FG * 0.75) + ' kN'))}`,
      'Faustregel: Der Anteil eines Lagers ist der Abstand zum anderen Lager, geteilt durch die ganze Länge.',
    ],
  }),

  task({
    id: 'x7', karte: 'bruecke', stufe: 2, familie: 'waswaere',
    title: 'Was wäre wenn: Lastwagen fährt weiter',
    gen: () => {
      const ll = pick([12, 15, 20]);
      return { l: ll, FG: pick([100, 120, 160]), x1: ll * pick([0.25, 0.3]), x2: ll * pick([0.6, 0.7, 0.8]), pos: rng(0, 3, 1) };
    },
    draw: (p) => BRUECKE({ l: p.l, x: p.x1, FG: p.FG }, 'F_A = ?', `x₁ = ${fmt(p.x1)} m`),
    text: (p) => `Ein Lastwagen mit ${f('F_G = ' + p.FG + ' kN')} steht auf einer Brücke der Länge ${l('l = ' + p.l + ' m')}. Er steht zuerst ${l('x₁ = ' + fmt(p.x1) + ' m')} vom Lager A entfernt und fährt dann weiter bis ${l('x₂ = ' + fmt(p.x2) + ' m')} vom Lager A. a) Was passiert mit der Kraft im Lager A? b) Wie gross ist F_A am Ende?`,
    asks: (p) => [
      waehle('a) Kraft im Lager A', 'wird kleiner', [
        ['bleibt gleich', 'Die Last wandert. Mit ihr wandert die Lagerkraft: Das Lager, dem der Lastwagen näher kommt, trägt mehr.'],
        ['wird grösser', 'Der Lastwagen fährt von A weg, auf B zu. Dann trägt B mehr und A weniger.'],
      ], p.pos),
      { k: 'b) F_A', unit: 'kN', v: (p.FG * (p.l - p.x2)) / p.l },
    ],
    fehler: (p) => [
      { ask: 1, v: (p.FG * p.x2) / p.l, msg: 'Das ist F_B. Gesucht ist F_A. Für F_A zählt der Abstand l − x₂.' },
      { ask: 1, v: (p.FG * (p.l - p.x1)) / p.l, msg: 'Das ist F_A vor der Fahrt. Rechne mit der neuen Position x₂.' },
    ],
    tipps: () => [
      'Fährt der Lastwagen von A weg, übernimmt B einen grösseren Anteil.',
      'Momentengleichgewicht um B: F_A · l = F_G · (l − x₂)',
      'F_A = F_G · (l − x₂) : l',
    ],
    loesung: (p) => [
      'Der Lastwagen kommt B näher. Darum trägt B mehr und A weniger.',
      `Momentengleichgewicht um B: ${eq(f('F_A') + ' · ' + l('l') + ' = ' + f('F_G') + ' · (' + l('l') + ' − ' + l('x₂') + ')')}`,
      `${eq(f('F_A') + ' = ' + p.FG + ' kN · (' + p.l + ' m − ' + fmt(p.x2) + ' m) : ' + p.l + ' m = ' + f(fmt((p.FG * (p.l - p.x2)) / p.l) + ' kN'))}`,
      `Vorher waren es ${fmt((p.FG * (p.l - p.x1)) / p.l)} kN.`,
    ],
  }),

  task({
    id: 'x8', karte: 'bruecke', stufe: 2, familie: 'fehler',
    title: 'Fehler finden: Mias Lagerkraft',
    gen: () => {
      const ll = pick([12, 15, 20]), FG = pick([80, 100, 120, 160]), x = ll * pick([0.25, 0.3, 0.35]);
      return { l: ll, FG, x, pos: rng(0, 3, 1) };
    },
    draw: (p) => BRUECKE(p, 'F_A = ?', `x = ${fmt(p.x)} m`),
    text: (p) => `Ein Lastwagen mit ${f('F_G = ' + p.FG + ' kN')} steht ${l('x = ' + fmt(p.x) + ' m')} vom Lager A entfernt auf einer Brücke der Länge ${l('l = ' + p.l + ' m')}. Mia rechnet: «F_A = F_G · x : l = ${p.FG} kN · ${fmt(p.x)} m : ${p.l} m = ${fmt((p.FG * p.x) / p.l)} kN». Der Lastwagen steht näher bei A als bei B. Was ist falsch?`,
    asks: (p) => [waehle('Fehler', `Der Abstand x gehört zu F_B. Für F_A braucht es l − x. Richtig ist F_A = ${fmt((p.FG * (p.l - p.x)) / p.l)} kN.`, [
      ['Sie hätte durch x statt durch l teilen müssen.', 'Durch l teilen stimmt. Der Lagerabstand l ist die Bezugslänge für beide Lager.'],
      ['Sie hätte F_G und x vertauschen müssen.', 'Beide stehen im Zähler. Vertauschen ändert nichts am Produkt.'],
      ['Nichts, die Rechnung stimmt.', 'Der Lastwagen steht nahe bei A. Dann trägt A mehr als B. Bei Mia trägt A nur wenig.'],
    ], p.pos)],
    tipps: () => [
      'Prüfe das Resultat mit dem Gefühl: Wer trägt mehr, wenn die Last nahe bei A steht?',
      'Mias Resultat für F_A ist kleiner als die Hälfte von F_G. Das passt nicht zur Lage der Last.',
      'Momentengleichgewicht um B: F_A · l = F_G · (l − x)',
    ],
    loesung: (p) => [
      `Mias Formel liefert die Kraft F_B: ${eq(f('F_B') + ' = ' + f('F_G') + ' · ' + l('x') + ' : ' + l('l') + ' = ' + f(fmt((p.FG * p.x) / p.l) + ' kN'))}`,
      `Für F_A gilt der Abstand zu B: ${eq(f('F_A') + ' = ' + f('F_G') + ' · (' + l('l') + ' − ' + l('x') + ') : ' + l('l') + ' = ' + f(fmt((p.FG * (p.l - p.x)) / p.l) + ' kN'))}`,
      `Kontrolle: ${eq(f(fmt((p.FG * (p.l - p.x)) / p.l) + ' kN') + ' + ' + f(fmt((p.FG * p.x) / p.l) + ' kN') + ' = ' + f(p.FG + ' kN'))}`,
    ],
  }),

  // ---------- Karte «kippen» ----------

  task({
    id: 'x9', karte: 'kippen', stufe: 3, familie: 'rechnen',
    title: 'Kippt der Gabelstapler?',
    gen: () => ({ mS: rng(2000, 4000, 250), b: pick([900, 1000, 1100, 1200]), a: pick([500, 600, 700, 800]) }),
    draw: (p) => B.stapler(p),
    text: (p) => `Ein Gabelstapler hat die Masse m_S = ${p.mS} kg. Sein Schwerpunkt S liegt ${l('b = ' + p.b + ' mm')} hinter der Vorderachse. Die Last liegt ${l('a = ' + p.a + ' mm')} vor der Vorderachse. Die Vorderachse ist die Kippkante K. Berechne a) das Standmoment des Staplers um K, b) die Last m_L, bei der der Stapler gerade kippt, und c) die zulässige Last bei 1,5-facher Kippsicherheit. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) Standmoment', unit: 'Nm', v: (p.mS * g * p.b) / 1000 },
      { k: 'b) m_L (Kippgrenze)', unit: 'kg', v: (p.mS * p.b) / p.a },
      { k: 'c) m_L zulässig', unit: 'kg', v: (p.mS * p.b) / p.a / 1.5 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.mS * g * p.b, msg: 'Der Hebelarm steht noch in mm. Für Nm brauchst du Meter.' },
      { ask: 0, v: (p.mS * p.b) / 1000, msg: 'Die Masse ist noch keine Kraft. Es fehlt der Faktor g = 9,81 m/s².' },
      { ask: 1, v: (p.mS * p.a) / p.b, msg: 'Die Hebelarme sind vertauscht. Der Schwerpunkt liegt weiter von K weg als die Last.' },
      { ask: 2, v: ((p.mS * p.b) / p.a) * 1.5, msg: 'Mehr Sicherheit heisst weniger Last. Teile die Grenzlast durch 1,5.' },
    ],
    tipps: () => [
      'Der Stapler kippt um die Vorderachse. Sie ist der Drehpunkt.',
      'Standmoment: M_S = F_G · b. Kippmoment der Last: M_K = F_L · a. An der Kippgrenze sind beide gleich gross: m_L · a = m_S · b. Die Fallbeschleunigung g kürzt sich weg.',
      'Kippsicherheit 1,5 bedeutet: Das Standmoment muss 1,5-mal so gross sein wie das Kippmoment. Also die Grenzlast durch 1,5 teilen.',
    ],
    loesung: (p) => {
      const MS = (p.mS * g * p.b) / 1000, mk = (p.mS * p.b) / p.a;
      return [
        `Standmoment um K: ${eq(m('M_S') + ' = ' + f('F_G') + ' · ' + l('b') + ' = ' + p.mS + ' kg · 9,81 m/s² · ' + fmt(p.b / 1000, 2) + ' m = ' + m(fmt(MS) + ' Nm'))}`,
        `Kippgrenze: Kippmoment = Standmoment, also ${eq(f('F_L') + ' · ' + l('a') + ' = ' + f('F_G') + ' · ' + l('b'))}`,
        `g kürzt sich: ${eq('m_L = m_S · ' + l('b') + ' : ' + l('a') + ' = ' + p.mS + ' kg · ' + p.b + ' mm : ' + p.a + ' mm = ' + fmt(mk) + ' kg')}`,
        `Mit 1,5-facher Sicherheit: ${eq('m_L = ' + fmt(mk) + ' kg : 1,5 = ' + fmt(mk / 1.5) + ' kg')}`,
        'Überlegung: Rutscht die Last weiter nach vorn, wird a grösser. Dann sinkt die erlaubte Last. Darum hat jeder Stapler ein Lastdiagramm.',
      ];
    },
    loesungsbild: (p) => B.stapler(p, { mL: `Kippgrenze: ${fmt((p.mS * p.b) / p.a)} kg` }),
  }),

  task({
    id: 'x10', karte: 'kippen', stufe: 3, familie: 'umgekehrt',
    title: 'Umgekehrt: Wo muss der Schwerpunkt liegen?',
    gen: () => {
      for (;;) {
        const mS = rng(2000, 4000, 250), a = pick([900, 1000, 1100]), b0 = pick([700, 800, 1200, 1300]);
        if (Math.abs(b0 / a - 1) < 0.1) continue;
        const mL = Math.round((mS * b0) / a / 50) * 50;
        return { mS, a, mL, b: (mL * a) / mS };
      }
    },
    draw: (p) => B.stapler(p, { mL: `m_L = ${p.mL} kg`, b: 'b = ?', FL: 'F_L' }),
    text: (p) => `Ein Gabelstapler mit m_S = ${p.mS} kg soll eine Last von m_L = ${p.mL} kg tragen. Die Last liegt ${l('a = ' + p.a + ' mm')} vor der Vorderachse K. Wie weit hinter K muss der Schwerpunkt S mindestens liegen, damit der Stapler gerade nicht kippt?`,
    asks: (p) => [{ k: 'b mindestens', unit: 'mm', v: p.b }],
    fehler: (p) => [{ ask: 0, v: (p.mS * p.a) / p.mL, msg: 'Die Massen sind vertauscht. Die schwerere Seite braucht den kürzeren Hebelarm.' }],
    tipps: () => [
      'An der Kippgrenze sind Kippmoment und Standmoment gleich gross.',
      'm_L · a = m_S · b. Die Fallbeschleunigung g kürzt sich weg.',
      'b = m_L · a : m_S',
    ],
    loesung: (p) => [
      `Kippgrenze: ${eq('m_L · ' + l('a') + ' = m_S · ' + l('b'))}`,
      `Umstellen: ${eq(l('b') + ' = m_L · ' + l('a') + ' : m_S = ' + p.mL + ' kg · ' + p.a + ' mm : ' + p.mS + ' kg = ' + l(fmt(p.b) + ' mm'))}`,
      'Je schwerer die Last und je weiter sie vor K liegt, desto weiter hinten muss der Schwerpunkt des Staplers liegen.',
    ],
  }),

  task({
    id: 'x11', karte: 'kippen', stufe: 2, familie: 'waswaere',
    title: 'Was wäre wenn: Last weiter vorn',
    gen: () => {
      const a = pick([500, 600, 700, 800]), fa = pick([1.5, 2]);
      return { mS: rng(2000, 4000, 250), b: pick([900, 1000, 1100, 1200]), a, an: a * fa, pos: rng(0, 3, 1) };
    },
    draw: (p) => B.stapler(p),
    text: (p) => `Ein Gabelstapler hat die Masse m_S = ${p.mS} kg. Sein Schwerpunkt liegt ${l('b = ' + p.b + ' mm')} hinter der Vorderachse K. Die Last liegt zuerst ${l('a = ' + p.a + ' mm')} vor K. Der Fahrer hält die Last weiter vorn, bei ${l('a = ' + p.an + ' mm')}. a) Wie ändert sich die Kippgrenze? b) Wie gross ist sie dann?`,
    asks: (p) => [
      waehle('a) Die Kippgrenze', 'wird kleiner', [
        ['bleibt gleich', 'Der Hebelarm der Last wächst. Dann kippt der Stapler schon bei weniger Last.'],
        ['wird grösser', 'Ein längerer Hebelarm der Last vergrössert das Kippmoment. Die erlaubte Last sinkt.'],
      ], p.pos),
      { k: 'b) m_L neu', unit: 'kg', v: (p.mS * p.b) / p.an },
    ],
    fehler: (p) => [{ ask: 1, v: (p.mS * p.b) / p.a, msg: 'Das ist die alte Grenzlast. Rechne mit dem neuen Abstand a.' }],
    tipps: () => [
      'Das Standmoment bleibt gleich. Nur der Hebelarm der Last wird grösser.',
      'Kippgrenze: m_L · a = m_S · b mit dem neuen a.',
      'm_L = m_S · b : a_neu',
    ],
    loesung: (p) => [
      `Die Last hat jetzt einen längeren Hebelarm. Das Kippmoment wächst schneller. Die Grenzlast sinkt.`,
      `${eq('m_L = m_S · ' + l('b') + ' : ' + l('a') + ' = ' + p.mS + ' kg · ' + p.b + ' mm : ' + p.an + ' mm = ' + fmt((p.mS * p.b) / p.an) + ' kg')}`,
      `Vorher waren es ${fmt((p.mS * p.b) / p.a)} kg. Die Grenzlast ändert sich im umgekehrten Verhältnis zu a.`,
    ],
  }),

  task({
    id: 'x12', karte: 'kippen', stufe: 2, familie: 'fehler',
    title: 'Fehler finden: Leos Kippsicherheit',
    gen: () => ({ mS: rng(2000, 4000, 250), b: pick([900, 1000, 1100, 1200]), a: pick([500, 600, 700, 800]), pos: rng(0, 3, 1) }),
    draw: (p) => B.stapler(p),
    text: (p) => {
      const mk = (p.mS * p.b) / p.a;
      return `Ein Gabelstapler (m_S = ${p.mS} kg) hat den Schwerpunkt ${l('b = ' + p.b + ' mm')} hinter der Kippkante K. Die Last liegt ${l('a = ' + p.a + ' mm')} vor K. Leo rechnet: «Grenzlast m_L = m_S · b : a = ${fmt(mk)} kg. Mit 1,5-facher Kippsicherheit darf ich 1,5 · ${fmt(mk)} kg = ${fmt(mk * 1.5)} kg heben.» Was ist falsch?`;
    },
    asks: (p) => [waehle('Fehler', `Mehr Sicherheit heisst weniger Last. Richtig ist m_L : 1,5 = ${fmt((p.mS * p.b) / p.a / 1.5)} kg.`, [
      ['Die Grenzlast müsste zusätzlich mit g multipliziert werden.', 'Gefragt ist eine Masse in kg. Die Fallbeschleunigung g kürzt sich bei der Grenzlast weg.'],
      ['Er hätte a und b in der Grenzlast vertauschen müssen.', 'Die Grenzlast m_S · b : a stimmt. Der Schwerpunkt liegt hinter K, die Last davor.'],
      ['Nichts, die Rechnung stimmt.', 'Mit mehr als der Grenzlast kippt der Stapler. Die Sicherheit verlangt eine Last unter der Grenze.'],
    ], p.pos)],
    tipps: () => [
      'Was bedeutet «Sicherheit» für die erlaubte Last: mehr oder weniger?',
      'Bei der Grenzlast kippt der Stapler gerade. Wer sicher sein will, bleibt darunter.',
      'zulässige Last = Grenzlast : 1,5',
    ],
    loesung: (p) => {
      const mk = (p.mS * p.b) / p.a;
      return [
        `Die Grenzlast stimmt: ${eq('m_L = m_S · ' + l('b') + ' : ' + l('a') + ' = ' + fmt(mk) + ' kg')}`,
        `Mit Sicherheit 1,5 muss das Standmoment 1,5-mal so gross sein wie das Kippmoment. Also: ${eq('m_zul = ' + fmt(mk) + ' kg : 1,5 = ' + fmt(mk / 1.5) + ' kg')}`,
        `Leos ${fmt(mk * 1.5)} kg liegen über der Kippgrenze. Der Stapler würde kippen.`,
      ];
    },
  }),

  // ---------- Karte «bahn» ----------

  task({
    id: 'x13', karte: 'bahn', stufe: 3, familie: 'rechnen',
    title: 'Kugelbahn: Wie hoch kommt die Kugel?',
    gen: () => ({ m: rng(1, 5, 1), h1: pick([2, 2.5, 3, 4, 5]), loss: pick([10, 15, 20, 25]) }),
    draw: (p) => B.bahn(p),
    text: (p) => `Eine Kugel mit m = ${p.m} kg startet aus der Ruhe in der Höhe ${l('h_1 = ' + fmt(p.h1) + ' m')}. Bis zum tiefsten Punkt geht keine Energie verloren. Auf dem Weg nach oben gehen ${p.loss} % der Energie durch Reibung verloren. Berechne a) die potenzielle Energie am Start, b) die Geschwindigkeit v im tiefsten Punkt und c) die Höhe h_2, die die Kugel rechts erreicht. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) W_pot', unit: 'J', v: p.m * g * p.h1 },
      { k: 'b) v', unit: 'm/s', v: Math.sqrt(2 * g * p.h1) },
      { k: 'c) h_2', unit: 'm', v: p.h1 * (1 - p.loss / 100) },
    ],
    fehler: (p) => [
      { ask: 0, v: p.m * p.h1, msg: 'Es fehlt der Faktor g = 9,81 m/s². W_pot = m · g · h.' },
      { ask: 1, v: Math.sqrt(g * p.h1), msg: 'Der Faktor 2 fehlt. Aus m · g · h = m · v² : 2 folgt v = √(2 · g · h).' },
      { ask: 2, v: (p.h1 * p.loss) / 100, msg: 'Das ist der verlorene Teil. Gesucht ist die Höhe, die übrig bleibt.' },
    ],
    tipps: () => [
      'Führe Buch über die Energie: Start, tiefster Punkt, rechter Umkehrpunkt.',
      'Unten ist die ganze potenzielle Energie zu kinetischer Energie geworden: m · g · h_1 = m · v² : 2. Rechts oben steht die Kugel kurz still. Dort ist nur noch potenzielle Energie da, aber weniger als am Start.',
      'Es bleiben (100 − Verlust) % der Energie. Die Höhe ist proportional zur Energie. Also bleiben auch so viele Prozent der Höhe.',
    ],
    loesung: (p) => {
      const W = p.m * g * p.h1, r = 1 - p.loss / 100;
      return [
        `Start: ${eq(w('W_pot') + ' = m · g · ' + l('h_1') + ' = ' + p.m + ' kg · 9,81 m/s² · ' + fmt(p.h1) + ' m = ' + w(fmt(W) + ' J'))}`,
        `Tiefster Punkt: ${eq(w('W_kin') + ' = ' + w('W_pot'))}, also ${eq('v = √(2 · g · h_1) = √(2 · 9,81 m/s² · ' + fmt(p.h1) + ' m) = ' + w(fmt(Math.sqrt(2 * g * p.h1)) + ' m/s'))}`,
        `Rechts oben bleiben ${100 - p.loss} %: ${eq(w('W_pot,2') + ' = ' + fmt(r, 2) + ' · ' + fmt(W) + ' J = ' + w(fmt(W * r) + ' J'))}`,
        `Höhe: ${eq(l('h_2') + ' = ' + w('W_pot,2') + ' : (m · g) = ' + fmt(W * r) + ' J : (' + p.m + ' kg · 9,81 m/s²) = ' + l(fmt(p.h1 * r) + ' m'))}`,
        `Abkürzung: ${eq(l('h_2') + ' = ' + fmt(r, 2) + ' · ' + l('h_1'))}. Die Masse kürzt sich überall weg. Sie war für b) und c) gar nicht nötig.`,
      ];
    },
    loesungsbild: (p) => B.bahn(p, { h2: `h_2 = ${fmt(p.h1 * (1 - p.loss / 100))} m`, v: `v = ${fmt(Math.sqrt(2 * g * p.h1))} m/s` }),
  }),

  task({
    id: 'x14', karte: 'bahn', stufe: 3, familie: 'umgekehrt',
    title: 'Kugelbahn umgekehrt: Aus welcher Höhe gestartet?',
    gen: () => {
      const loss = pick([10, 15, 20, 25]), h2 = pick([1.2, 1.5, 1.8, 2, 2.4, 3]);
      return { m: rng(1, 5, 1), h2, loss, h1: h2 / (1 - loss / 100) };
    },
    draw: (p) => B.bahn(p, { h1: 'h_1 = ?', h2: `h_2 = ${fmt(p.h2)} m` }),
    text: (p) => `Eine Kugel mit m = ${p.m} kg rollt aus der Ruhe eine Bahn hinunter. Bis zum tiefsten Punkt geht keine Energie verloren. Auf dem Weg nach oben gehen ${p.loss} % der Energie verloren. Rechts erreicht sie die Höhe ${l('h_2 = ' + fmt(p.h2) + ' m')}. Berechne a) die Starthöhe h_1 und b) die Geschwindigkeit v im tiefsten Punkt. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) h_1', unit: 'm', v: p.h1 },
      { k: 'b) v', unit: 'm/s', v: Math.sqrt(2 * g * p.h1) },
    ],
    fehler: (p) => [
      { ask: 0, v: p.h2 * (1 - p.loss / 100), msg: 'Du hast den Verlust nochmals abgezogen. h_2 ist der Rest von h_1. Darum muss h_1 grösser sein als h_2.' },
      { ask: 1, v: Math.sqrt(2 * g * p.h2), msg: 'Das gilt für einen Start aus h_2. Die Kugel startet aber in h_1 und hat unten noch keine Energie verloren.' },
    ],
    tipps: () => [
      'Rechne rückwärts. h_2 ist der Rest nach dem Verlust.',
      'h_2 = h_1 · (1 − Verlust). Stelle nach h_1 um.',
      'h_1 = h_2 : (1 − Verlust). Danach v = √(2 · g · h_1).',
    ],
    loesung: (p) => [
      `Es bleiben ${100 - p.loss} % von h_1: ${eq(l('h_2') + ' = ' + fmt(1 - p.loss / 100, 2) + ' · ' + l('h_1'))}`,
      `Umstellen: ${eq(l('h_1') + ' = ' + fmt(p.h2) + ' m : ' + fmt(1 - p.loss / 100, 2) + ' = ' + l(fmt(p.h1) + ' m'))}`,
      `Unten ist noch nichts verloren: ${eq('v = √(2 · g · h_1) = √(2 · 9,81 m/s² · ' + fmt(p.h1) + ' m) = ' + w(fmt(Math.sqrt(2 * g * p.h1)) + ' m/s'))}`,
      'Die Masse wird nicht gebraucht. Sie kürzt sich weg.',
    ],
  }),

  task({
    id: 'x15', karte: 'bahn', stufe: 2, familie: 'begruenden',
    title: 'Begründen: Schwerere Kugel auf derselben Bahn',
    gen: () => ({ m: rng(1, 3, 1), h1: pick([2, 3, 4, 5]), loss: pick([10, 15, 20, 25]), pos1: rng(0, 2, 1), pos2: rng(0, 2, 1) }),
    draw: (p) => B.bahn(p, { m: `m = ${p.m} kg oder ${2 * p.m} kg` }),
    text: (p) => `Zwei Kugeln rollen aus der Ruhe dieselbe Bahn hinunter, beide aus ${l('h_1 = ' + fmt(p.h1) + ' m')}. Kugel A hat ${p.m} kg, Kugel B hat die doppelte Masse. Bis zum tiefsten Punkt geht keine Energie verloren. Auf dem Weg nach oben gehen bei beiden ${p.loss} % der Energie verloren. Vergleiche B mit A.`,
    asks: (p) => [
      waehle('a) Geschwindigkeit v unten', 'bleibt gleich', [
        ['wird grösser', 'Die Masse kürzt sich in m · g · h = m · v² : 2 weg. Schwere und leichte Kugeln fallen gleich schnell.'],
        ['wird kleiner', 'Die Masse kürzt sich in m · g · h = m · v² : 2 weg. Sie beeinflusst v nicht.'],
      ], p.pos1),
      waehle('b) Höhe h_2 rechts', 'bleibt gleich', [
        ['wird grösser', 'B hat mehr Energie, verliert aber im selben Verhältnis. Der Rest ist ein fester Anteil von h_1.'],
        ['wird kleiner', 'B verliert nicht mehr Prozent. h_2 ist ein fester Anteil von h_1, unabhängig von der Masse.'],
      ], p.pos2),
    ],
    tipps: () => [
      'Schreibe die Energiegleichung mit der Masse hin und schau, was sich kürzt.',
      'm · g · h_1 = m · v² : 2. Die Masse steht auf beiden Seiten.',
      'Der Verlust ist ein Prozentsatz der Energie. Die Höhe ist proportional zur Energie.',
    ],
    loesung: (p) => [
      `Unten: ${eq(w('m · g · h_1 = m · v² : 2'))}. Die Masse kürzt sich: ${eq('v = √(2 · g · h_1) = ' + fmt(Math.sqrt(2 * g * p.h1)) + ' m/s')}. Das gilt für A und für B.`,
      `Rechts: Es bleiben ${100 - p.loss} % der Energie. Die Höhe ist proportional zur Energie: ${eq(l('h_2') + ' = ' + fmt(1 - p.loss / 100, 2) + ' · ' + l('h_1') + ' = ' + l(fmt(p.h1 * (1 - p.loss / 100)) + ' m'))}`,
      'Beide Kugeln erreichen dieselbe Höhe. Die schwere Kugel hat mehr Energie, verliert aber auch mehr in Joule.',
    ],
  }),

  task({
    id: 'x16', karte: 'bahn', stufe: 1, familie: 'schaetzen',
    title: 'Schätzen: Wie schnell ist die Kugel unten?',
    gen: () => ({ h1: pick([2, 3, 4]), pos: rng(0, 2, 1) }),
    draw: (p) => B.bahn({ h1: p.h1, m: 1, loss: 0 }, { m: 'Kugel', h2: 'h_2 = h_1' }),
    text: (p) => `Eine Kugel startet aus der Ruhe in der Höhe ${l('h_1 = ' + fmt(p.h1) + ' m')}. Reibung gibt es keine. Ohne Taschenrechner: Wie schnell ist die Kugel im tiefsten Punkt ungefähr?`,
    asks: (p) => {
      const vv = Math.sqrt(2 * g * p.h1);
      return [waehle('v etwa', `${Math.round(vv)} m/s`, [
        [`${Math.round(vv / 2)} m/s`, 'Zu langsam. Wer aus dieser Höhe fällt, ist schneller.'],
        [`${Math.round(vv * 2)} m/s`, 'Zu schnell. Das wäre die doppelte Geschwindigkeit. Dafür bräuchte es die vierfache Höhe.'],
      ], p.pos)];
    },
    tipps: () => [
      'Alle potenzielle Energie wird zu kinetischer Energie. Die Masse spielt keine Rolle.',
      'Faustregel: v ≈ √(20 · h). Aus 5 m ergibt das 10 m/s. Zum Vergleich: 10 m/s sind 36 km/h.',
      'v = √(2 · g · h_1)',
    ],
    loesung: (p) => {
      const vv = Math.sqrt(2 * g * p.h1);
      return [
        `${eq('v = √(2 · g · h_1) = √(2 · 9,81 m/s² · ' + fmt(p.h1) + ' m) = ' + w(fmt(vv) + ' m/s'))}`,
        `Das sind ${fmt(vv * 3.6, 0)} km/h.`,
        'Faustregel: g ≈ 10 m/s². Dann ist v ≈ √(20 · h). Das lässt sich im Kopf überschlagen.',
      ];
    },
  }),

  task({
    id: 'x17', karte: 'bahn', stufe: 2, familie: 'fehler',
    title: 'Fehler finden: Laras Geschwindigkeit',
    gen: () => ({ h1: pick([2, 3, 4, 5]), loss: pick([10, 15, 20, 25]), pos: rng(0, 3, 1) }),
    draw: (p) => B.bahn({ h1: p.h1, m: 1, loss: p.loss }, { m: 'Kugel' }),
    text: (p) => {
      const h2 = p.h1 * (1 - p.loss / 100);
      return `Eine Kugel startet aus der Ruhe in ${l('h_1 = ' + fmt(p.h1) + ' m')}. Bis zum tiefsten Punkt geht keine Energie verloren. Erst auf dem Weg nach oben gehen ${p.loss} % verloren. Lara rechnet die Geschwindigkeit im tiefsten Punkt: «Es gehen ${p.loss} % verloren, also bleibt h_2 = ${fmt(h2)} m. v = √(2 · g · h_2) = ${fmt(Math.sqrt(2 * g * h2))} m/s.» Was ist falsch?`;
    },
    asks: (p) => [waehle('Fehler', `Der Verlust kommt erst nach dem tiefsten Punkt. Unten zählt noch h_1: v = ${fmt(Math.sqrt(2 * g * p.h1))} m/s.`, [
      ['Sie hätte die Masse der Kugel einsetzen müssen.', 'Die Masse kürzt sich in m · g · h = m · v² : 2 weg. Man braucht sie nicht.'],
      ['Sie hätte unter der Wurzel nur g · h rechnen müssen.', 'Der Faktor 2 gehört unter die Wurzel, denn m · g · h = m · v² : 2.'],
      ['Nichts, die Rechnung stimmt.', 'Der Verlust passiert nach dem tiefsten Punkt. Er ändert die Geschwindigkeit unten nicht.'],
    ], p.pos)],
    tipps: () => [
      'Überlege: Wann geht Energie verloren, vor oder nach dem tiefsten Punkt?',
      'Laut Aufgabe geht bis zum tiefsten Punkt keine Energie verloren.',
      'Unten gilt die ganze Starthöhe: v = √(2 · g · h_1)',
    ],
    loesung: (p) => [
      `Bis unten ist noch nichts verloren: ${eq('v = √(2 · g · h_1) = √(2 · 9,81 m/s² · ' + fmt(p.h1) + ' m) = ' + w(fmt(Math.sqrt(2 * g * p.h1)) + ' m/s'))}`,
      `Lara hat mit h_2 gerechnet. Das ergäbe ${fmt(Math.sqrt(2 * g * p.h1 * (1 - p.loss / 100)))} m/s. Das ist zu langsam.`,
      `Der Verlust zeigt sich erst rechts: ${eq(l('h_2') + ' = ' + fmt(1 - p.loss / 100, 2) + ' · ' + l('h_1') + ' = ' + l(fmt(p.h1 * (1 - p.loss / 100)) + ' m'))}`,
    ],
  }),

  task({
    id: 'x18', karte: 'bahn', stufe: 2, familie: 'waswaere',
    title: 'Was wäre wenn: mehr Reibung auf dem Weg nach oben',
    gen: () => ({ m: rng(1, 5, 1), h1: pick([2, 3, 4, 5]), loss: pick([10, 15, 20]), pos: rng(0, 3, 1) }),
    draw: (p) => B.bahn(p),
    text: (p) => `Eine Kugel mit m = ${p.m} kg startet aus der Ruhe in ${l('h_1 = ' + fmt(p.h1) + ' m')}. Auf dem Weg nach oben gehen ${p.loss} % der Energie verloren. Die Bahn wird rauer. Jetzt gehen auf dem Weg nach oben ${2 * p.loss} % verloren. a) Was passiert mit der Geschwindigkeit im tiefsten Punkt? b) Welche Höhe h_2 erreicht die Kugel jetzt?`,
    asks: (p) => [
      waehle('a) Geschwindigkeit v unten', 'bleibt gleich', [
        ['wird kleiner', 'Die Reibung wirkt erst auf dem Weg nach oben. Bis unten ändert sich nichts.'],
        ['wird grösser', 'Mehr Reibung macht die Kugel nicht schneller. Und sie wirkt ja erst nach dem tiefsten Punkt.'],
      ], p.pos),
      { k: 'b) h_2 neu', unit: 'm', v: p.h1 * (1 - (2 * p.loss) / 100) },
    ],
    fehler: (p) => [
      { ask: 1, v: p.h1 * (1 - p.loss / 100), msg: 'Das ist die alte Höhe mit dem kleineren Verlust. Rechne mit dem doppelten Verlust.' },
      { ask: 1, v: p.h1 * ((2 * p.loss) / 100), msg: 'Das ist der verlorene Teil. Gesucht ist die Höhe, die übrig bleibt.' },
    ],
    tipps: () => [
      'Wann wirkt die Reibung: vor oder nach dem tiefsten Punkt?',
      'Rechts bleibt der Anteil (100 − Verlust) % der Energie. Der Verlust ist jetzt doppelt so gross.',
      'h_2 = h_1 · (1 − 2 · Verlust)',
    ],
    loesung: (p) => [
      `Die Reibung wirkt erst nach dem tiefsten Punkt. Darum bleibt ${eq('v = ' + fmt(Math.sqrt(2 * g * p.h1)) + ' m/s')} gleich.`,
      `Neu bleiben ${100 - 2 * p.loss} % der Energie: ${eq(l('h_2') + ' = ' + fmt(1 - (2 * p.loss) / 100, 2) + ' · ' + fmt(p.h1) + ' m = ' + l(fmt(p.h1 * (1 - (2 * p.loss) / 100)) + ' m'))}`,
      `Vorher waren es ${fmt(p.h1 * (1 - p.loss / 100))} m. Doppelter Verlust heisst nicht halbe Höhe, sondern doppelt so viele Meter verloren.`,
    ],
  }),
];
