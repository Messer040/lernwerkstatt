// Aufgaben zum Kapitel Beschleunigungs- und Gewichtskraft:
// F = m · a, F_G = m · g, v-t-Diagramm, Aufzug und Ladung.
import { task, type Task } from '../../../core/types';
import { eq, f, l, v as w } from '../../../core/text';
import { fmt, pick } from '../../../core/zahl';
import * as B from './bilder';

const g = 9.81;
const GM = 1.62;
const d2 = (x: number) => fmt(x, 2);

export const AUFGABEN: Task[] = [
  // ---------- Beschleunigungskraft F = m · a ----------

  task({
    id: 'b1', karte: 'kraftgesetz', stufe: 1, familie: 'rechnen', src: 'nach Buch Beschleunigungskraft, Nr. 1',
    title: 'Sportwagen startet',
    gen: () => ({ m: pick([1100, 1300, 1600]), a: pick([3, 4, 5, 6]) }),
    draw: (p) => B.wagen({ m: `m = ${p.m} kg`, a: `a = ${p.a} m/s²`, F: 'F = ?' }),
    text: (p) => `Ein Sportwagen (m = ${p.m} kg) beschleunigt beim Start mit ${w('a = ' + p.a + ' m/s²')}. Wie gross ist die Kraft F?`,
    asks: (p) => [{ k: 'F', unit: 'N', v: p.m * p.a }],
    fehler: (p) => [
      { ask: 0, v: p.m / p.a, msg: 'Du hast geteilt. Die Kraft ist Masse mal Beschleunigung: F = m · a.' },
      { ask: 0, v: p.m + p.a, msg: 'Du hast addiert. Masse und Beschleunigung haben verschiedene Einheiten. Du multiplizierst sie.' },
    ],
    tipps: () => ['Eine Kraft beschleunigt eine Masse.', 'F = m · a. Die Masse in kg, die Beschleunigung in m/s². Das Resultat kommt in N.', 'Multipliziere die Masse mit der Beschleunigung.'],
    loesung: (p) => [
      `Formel: ${eq(f('F') + ' = m · a')}`,
      `Einsetzen: ${eq(f('F') + ' = ' + p.m + ' kg · ' + p.a + ' m/s²')}`,
      `Resultat: ${eq(f('F = ' + fmt(p.m * p.a) + ' N'))}`,
      '1 N = 1 kg · m/s². Darum ergibt kg mal m/s² direkt Newton.',
    ],
  }),

  task({
    id: 'b2', karte: 'kraftgesetz', stufe: 1, familie: 'rechnen', src: 'nach Buch, Nr. 2',
    title: 'Güterzug fährt an',
    gen: () => ({ m: pick([600, 850, 1200]), a: pick([0.1, 0.12, 0.15]) }),
    draw: (p) => B.zug({ m: `m = ${p.m} t`, a: `a = ${fmt(p.a, 2)} m/s²`, F: 'F = ?' }),
    text: (p) => `Ein Güterzug (m = ${p.m} t) fährt mit ${w('a = ' + fmt(p.a, 2) + ' m/s²')} an. Welche Beschleunigungskraft ist nötig? Gib sie in kN an.`,
    asks: (p) => [{ k: 'F', unit: 'kN', v: p.m * p.a }],
    fehler: (p) => [
      { ask: 0, v: p.m * 1000 * p.a, msg: 'Du hast die Tonnen in kg umgerechnet. Dann ist das Resultat in N. Gefragt sind kN: durch 1000 teilen.' },
      { ask: 0, v: p.m / p.a, msg: 'Du hast geteilt. Die Kraft ist Masse mal Beschleunigung.' },
    ],
    tipps: () => ['Rechne die Masse zuerst in kg: 1 t = 1000 kg.', 'F = m · a. Das Resultat kommt in N. Teile dann durch 1000 für kN.', 'Tipp: t mal m/s² ergibt direkt kN.'],
    loesung: (p) => [
      `In kg: ${eq(p.m + ' t = ' + p.m * 1000 + ' kg')}`,
      `Kraft: ${eq(f('F') + ' = ' + p.m * 1000 + ' kg · ' + fmt(p.a, 2) + ' m/s² = ' + fmt(p.m * 1000 * p.a) + ' N')}`,
      `Resultat: ${eq(f('F = ' + fmt(p.m * p.a) + ' kN'))}`,
    ],
  }),

  task({
    id: 'b3', karte: 'kraftgesetz', stufe: 2, familie: 'rechnen', src: 'nach Buch, Nr. 3',
    title: 'Elfmeter',
    gen: () => ({ m: pick([410, 420, 450]), v: pick([90, 108, 126]), t: pick([0.01, 0.02, 0.025]) }),
    draw: (p) => B.ball({ info: `m = ${p.m} g, Schussdauer t = ${fmt(p.t, 3)} s`, v: `v = ${p.v} km/h`, F: 'F = ?' }),
    text: (p) => `Ein Fussball (m = ${p.m} g) fliegt nach dem Schuss mit ${w('v = ' + p.v + ' km/h')}. Der Schuss dauert t = ${fmt(p.t, 3)} s. Wie gross sind a) die Beschleunigung und b) die mittlere Schusskraft?`,
    asks: (p) => {
      const a = p.v / 3.6 / p.t;
      return [
        { k: 'a) a', unit: 'm/s²', v: a },
        { k: 'b) F', unit: 'N', v: (p.m / 1000) * a },
      ];
    },
    fehler: (p) => {
      const a = p.v / 3.6 / p.t;
      return [
        { ask: 0, v: p.v / p.t, msg: 'Du hast v in km/h eingesetzt. Rechne zuerst in m/s: km/h durch 3,6.' },
        { ask: 1, v: p.m * a, msg: 'Du hast die Masse in g eingesetzt. Rechne zuerst in kg: g durch 1000.' },
        { ask: 1, v: (p.m / 1000) * (p.v / p.t), msg: 'Die Masse stimmt. Aber v steht noch in km/h. Teile v durch 3,6.' },
      ];
    },
    tipps: () => ['Zuerst die Einheiten: km/h durch 3,6 gibt m/s. g durch 1000 gibt kg.', 'a = v : t. Danach F = m · a.', 'Der Ball startet aus der Ruhe. Seine Geschwindigkeit ändert sich also um v.'],
    loesung: (p) => {
      const a = p.v / 3.6 / p.t;
      return [
        `Einheiten: ${eq(p.v + ' km/h = ' + fmt(p.v / 3.6) + ' m/s')}`,
        `a) ${eq('a = v : t = ' + fmt(p.v / 3.6) + ' : ' + fmt(p.t, 3) + ' = ' + w(fmt(a) + ' m/s²'))}`,
        `b) ${eq(f('F') + ' = m · a = ' + fmt(p.m / 1000, 3) + ' kg · ' + fmt(a) + ' m/s² = ' + f(fmt((p.m / 1000) * a) + ' N'))}`,
      ];
    },
  }),

  task({
    id: 'b4', karte: 'kraftgesetz', stufe: 1, familie: 'rechnen', src: 'nach Buch, Nr. 5',
    title: 'Linearantrieb mit und ohne Last',
    gen: () => ({ F: pick([30, 44, 60]), m: pick([2, 2.8, 3.5]), mo: pick([1, 2, 3]) }),
    draw: (p) => B.schlitten({ m: `m_Schlitten = ${fmt(p.m)} kg`, F: `F = ${p.F} N`, a: 'a = ?', last: `${p.mo} kg` }),
    text: (p) => `Ein Linearantrieb erzeugt höchstens ${f('F = ' + p.F + ' N')}. Der Schlitten hat m = ${fmt(p.m)} kg. a) Welche Beschleunigung erreicht er leer? b) Welche, wenn ein Objekt mit ${p.mo} kg darauf befestigt ist?`,
    asks: (p) => [
      { k: 'a) a leer', unit: 'm/s²', v: p.F / p.m },
      { k: 'b) a mit Last', unit: 'm/s²', v: p.F / (p.m + p.mo) },
    ],
    fehler: (p) => [
      { ask: 1, v: p.F / p.m, msg: 'Das ist der Wert ohne Last. Mit Last musst du beide Massen addieren.' },
      { ask: 1, v: p.F / p.mo, msg: 'Du hast nur die Last gerechnet. Der Schlitten bewegt sich auch mit.' },
      { ask: 0, v: p.F * p.m, msg: 'Du hast multipliziert. Aus F = m · a folgt a = F : m.' },
    ],
    tipps: () => ['Stelle F = m · a nach a um.', 'a = F : m. Mit Last zählt die ganze bewegte Masse.', 'Mit Last: a = F : (m_Schlitten + m_Last).'],
    loesung: (p) => [
      `Formel: ${eq('a = ' + f('F') + ' : m')}`,
      `a) ${eq('a = ' + p.F + ' : ' + fmt(p.m) + ' = ' + w(fmt(p.F / p.m) + ' m/s²'))}`,
      `b) ${eq('a = ' + p.F + ' : (' + fmt(p.m) + ' + ' + p.mo + ') = ' + w(fmt(p.F / (p.m + p.mo)) + ' m/s²'))}`,
      'Mehr Masse heisst bei gleicher Kraft weniger Beschleunigung.',
    ],
  }),

  task({
    id: 'b5', karte: 'kraftgesetz', stufe: 2, familie: 'umgekehrt', src: 'Kreativ · Umgekehrt gefragt',
    title: 'Linearantrieb: Wie schwer darf das Teil sein?',
    gen: () => ({ F: pick([44, 60, 80]), m: pick([2, 2.8]), a: pick([5, 8, 10]) }),
    draw: (p) => B.schlitten({ m: `m_Schlitten = ${fmt(p.m)} kg`, F: `F = ${p.F} N`, a: `a ≥ ${p.a} m/s²`, last: '?' }),
    text: (p) => `Ein Linearantrieb (${f('F = ' + p.F + ' N')}, Schlitten ${fmt(p.m)} kg) soll mindestens ${w('a = ' + p.a + ' m/s²')} erreichen. Wie schwer darf das Objekt auf dem Schlitten höchstens sein?`,
    asks: (p) => [{ k: 'm_max', unit: 'kg', v: p.F / p.a - p.m }],
    fehler: (p) => [
      { ask: 0, v: p.F / p.a, msg: 'Das ist die ganze bewegte Masse. Der Schlitten gehört nicht zum Objekt. Zieh seine Masse ab.' },
      { ask: 0, v: p.F * p.a - p.m, msg: 'Du hast F mal a gerechnet. Aus F = m · a folgt m = F : a.' },
    ],
    tipps: () => ['Stelle F = m · a nach m um.', 'Gesamtmasse = F : a. Davon gehört ein Teil dem Schlitten.', 'm_Objekt = F : a − m_Schlitten'],
    loesung: (p) => [
      `Gesamtmasse: ${eq('m_ges = ' + f('F') + ' : a = ' + p.F + ' : ' + p.a + ' = ' + fmt(p.F / p.a) + ' kg')}`,
      `Abzug Schlitten: ${eq('m_max = ' + fmt(p.F / p.a) + ' − ' + fmt(p.m) + ' = ' + w(fmt(p.F / p.a - p.m) + ' kg'))}`,
    ],
  }),

  task({
    id: 'b6', karte: 'kraftgesetz', stufe: 2, familie: 'waswaere', src: 'Kreativ · Was wäre wenn',
    title: 'Was wäre wenn: Doppelt so schnell anfahren',
    gen: () => ({ m: pick([800, 1000, 1200]), a: pick([1, 2, 3]), k: pick([2, 3]) }),
    draw: (p) => B.wagen({ m: `m = ${p.m} kg`, a: `a = ${p.a * p.k} m/s²`, F: 'F = ?' }),
    text: (p) => `Ein Wagen (m = ${p.m} kg) beschleunigt mit ${w('a = ' + p.a + ' m/s²')}. Jetzt soll er ${p.k}-mal so stark beschleunigen. Die Masse bleibt gleich. a) Wie ändert sich die Kraft? b) Wie gross ist die neue Kraft F?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Kraft',
        opts: [`Sie wird ${p.k}-mal so gross.`, 'Sie bleibt gleich.', `Sie wird ${p.k}-mal kleiner.`],
        a: 0,
        why: [
          undefined,
          'Die Masse bleibt gleich, aber a wird grösser. Dann wird F = m · a auch grösser.',
          'Das wäre bei grösserer Masse so. Hier wächst a. Dann wächst auch F.',
        ],
      },
      { k: 'b) F neu', unit: 'N', v: p.m * p.a * p.k },
    ],
    fehler: (p) => [
      { ask: 1, v: p.m * p.a, msg: 'Das ist die alte Kraft. Die neue Beschleunigung ist grösser.' },
      { ask: 1, v: (p.m * p.a) / p.k, msg: `Du hast durch ${p.k} geteilt. Kraft und Beschleunigung wachsen zusammen.` },
    ],
    tipps: () => ['F und a sind proportional: doppelte Beschleunigung braucht doppelte Kraft.', 'Rechne die neue Beschleunigung aus. Dann F = m · a.', 'Oder: alte Kraft mal Faktor.'],
    loesung: (p) => [
      `Neue Beschleunigung: ${eq('a = ' + p.k + ' · ' + p.a + ' = ' + p.a * p.k + ' m/s²')}`,
      `Kraft: ${eq(f('F') + ' = ' + p.m + ' · ' + p.a * p.k + ' = ' + f(fmt(p.m * p.a * p.k) + ' N'))}`,
      `Alte Kraft war ${fmt(p.m * p.a)} N. Neue Kraft ist ${p.k}-mal so gross.`,
    ],
  }),

  task({
    id: 'b7', karte: 'kraftgesetz', stufe: 2, familie: 'fehler', src: 'Kreativ · Fehler finden',
    title: 'Elfmeter: Wo steckt der Fehler?',
    gen: () => ({ m: pick([420, 450]), v: pick([90, 108]), t: pick([0.01, 0.02]) }),
    draw: (p) => B.ball({ info: `m = ${p.m} g, t = ${fmt(p.t, 2)} s`, v: `v = ${p.v} km/h`, F: 'F = ?' }),
    text: (p) => `Ein Lernender rechnet die Schusskraft:<ol style="margin:8px 0 8px 18px;background:#f2f4f7;padding:8px 8px 8px 26px;border-radius:6px"><li>a = ${p.v} : ${fmt(p.t, 2)} = ${fmt(p.v / p.t)} m/s²</li><li>F = ${p.m} · ${fmt(p.v / p.t)} = ${fmt(p.m * (p.v / p.t))} N</li></ol>a) Was ist falsch? b) Wie gross ist F richtig?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: [
          'Zwei Einheitenfehler: v steht in km/h statt m/s, m in g statt kg.',
          'Nur v ist falsch. Die Masse darf in g stehen.',
          'Nur m ist falsch. Die Geschwindigkeit darf in km/h stehen.',
          'Nichts, die Rechnung stimmt.',
        ],
        a: 0,
        why: [
          undefined,
          'Auch die Masse stimmt nicht. Newton gibt es nur mit kg und m/s².',
          'Auch v stimmt nicht. Für m/s² brauchst du v in m/s.',
          'Die Kraft wäre über zwei Millionen Newton. Das ist unmöglich für einen Fussball.',
        ],
      },
      { k: 'b) F richtig', unit: 'N', v: (p.m / 1000) * (p.v / 3.6 / p.t) },
    ],
    fehler: (p) => [
      { ask: 1, v: p.m * (p.v / p.t), msg: 'Das ist der falsche Wert aus der Aufgabe. Er hat beide Einheitenfehler.' },
      { ask: 1, v: (p.m / 1000) * (p.v / p.t), msg: 'Die Masse stimmt jetzt. Aber v steht noch in km/h. Teile v durch 3,6.' },
      { ask: 1, v: p.m * (p.v / 3.6 / p.t), msg: 'Die Geschwindigkeit stimmt jetzt. Aber m steht noch in g. Teile m durch 1000.' },
    ],
    tipps: () => ['Schau auf die Einheiten in beiden Zeilen.', 'Für N brauchst du kg und m/s². Rechne beide um.', 'a = v : 3,6 : t. Dann F = m : 1000 · a.'],
    loesung: (p) => [
      'Fehler 1: v steht in km/h statt in m/s (Faktor 3,6). Fehler 2: m steht in g statt in kg (Faktor 1000).',
      `Richtig: ${eq(f('F') + ' = ' + fmt(p.m / 1000, 3) + ' kg · ' + fmt(p.v / 3.6 / p.t) + ' m/s² = ' + f(fmt((p.m / 1000) * (p.v / 3.6 / p.t)) + ' N'))}`,
      `Das falsche Resultat war ${fmt(3600, 0)}-mal zu gross.`,
    ],
  }),

  // ---------- Gewichtskraft und Masse ----------

  task({
    id: 'b8', karte: 'gewicht', stufe: 1, familie: 'rechnen', src: 'nach Buch Gewichtskraft, Nr. 7',
    title: 'Gewichtskraft auf Erde und Mond',
    gen: () => ({ m: [pick([1, 2, 5]), pick([0.1, 0.25, 0.5]), pick([1.5, 2.5]), pick([1000, 2000])] }),
    draw: () => B.saeulen('Gewichtskraft von 1 kg', [{ v: 1, t: 'Erde: 9,81 N' }, { v: GM / g, t: 'Mond: 1,62 N' }]),
    text: (p) => `Berechne die Gewichtskraft auf der Erde (g = 9,81 m/s²) und auf dem Mond (g = 1,62 m/s²) für a) m = ${fmt(p.m[0])} kg, b) m = ${fmt(p.m[1] * 1000)} g, c) m = ${fmt(p.m[2] * 1000)} g und d) m = ${p.m[3] / 1000} t.`,
    asks: (p) =>
      p.m.flatMap((mm: number, i: number) => [
        { k: ['a', 'b', 'c', 'd'][i] + ') Erde', unit: 'N', v: mm * g },
        { k: ['a', 'b', 'c', 'd'][i] + ') Mond', unit: 'N', v: mm * GM },
      ]),
    fehler: (p) => [
      { ask: 1, v: p.m[0] * g, msg: 'Das ist der Wert für die Erde. Auf dem Mond gilt g = 1,62 m/s².' },
      { ask: 2, v: p.m[1] * 1000 * g, msg: 'Du hast die Gramm als kg eingesetzt. Rechne zuerst in kg: g durch 1000.' },
      { ask: 6, v: (p.m[3] / 1000) * g, msg: 'Du hast die Tonnen als kg eingesetzt. 1 t = 1000 kg.' },
    ],
    tipps: () => ['Die Gewichtskraft ist F_G = m · g. Die Masse muss in kg stehen.', 'Rechne zuerst alle Massen in kg um: g durch 1000, t mal 1000.', 'Danach mal 9,81 für die Erde und mal 1,62 für den Mond.'],
    loesung: (p) => [
      ...p.m.map(
        (mm: number, i: number) =>
          `${['a', 'b', 'c', 'd'][i]}) m = ${fmt(mm, 3)} kg: ${eq(f('F_G') + ' Erde = ' + f(fmt(mm * g) + ' N'))}, ${eq(f('F_G') + ' Mond = ' + f(fmt(mm * GM) + ' N'))}`,
      ),
      'Der Mond hat etwa ein Sechstel der Erdanziehung. Die Masse bleibt gleich.',
    ],
  }),

  task({
    id: 'b9', karte: 'gewicht', stufe: 1, familie: 'rechnen', src: 'nach Buch, Nr. 8',
    title: 'Astronaut',
    gen: () => ({ FG: pick([785, 883, 981, 1079]) }),
    draw: (p) => B.saeulen('Gleiche Masse, anderes Gewicht', [{ v: 1, t: `Erde: F_G = ${p.FG} N` }, { v: GM / g, t: 'Mond: F_G = ?' }]),
    text: (p) => `Ein Astronaut hat mit Raumanzug auf der Erde ${f('F_G = ' + p.FG + ' N')}. Wie gross sind a) seine Masse auf der Erde, b) seine Masse auf dem Mond und c) seine Gewichtskraft auf dem Mond?`,
    asks: (p) => [
      { k: 'a) m Erde', unit: 'kg', v: p.FG / g },
      { k: 'b) m Mond', unit: 'kg', v: p.FG / g },
      { k: 'c) F_G Mond', unit: 'N', v: (p.FG / g) * GM },
    ],
    fehler: (p) => [
      { ask: 0, v: p.FG * g, msg: 'Du hast multipliziert. Aus F_G = m · g folgt m = F_G : g.' },
      { ask: 1, v: p.FG / GM, msg: 'Die Masse ändert sich nicht. Sie ist auf dem Mond gleich wie auf der Erde.' },
      { ask: 2, v: p.FG, msg: 'Das ist die Gewichtskraft auf der Erde. Auf dem Mond ist sie etwa sechsmal kleiner.' },
    ],
    tipps: () => ['Aus F_G = m · g folgt m = F_G : g.', 'Die Masse ist überall gleich. Die Gewichtskraft hängt von g ab.', 'c) F_G auf dem Mond = m · 1,62 m/s².'],
    loesung: (p) => [
      `a) ${eq('m = ' + f('F_G') + ' : g = ' + p.FG + ' : 9,81 = ' + w(fmt(p.FG / g) + ' kg'))}`,
      `b) Gleich: ${fmt(p.FG / g)} kg. Die Masse ist die Menge Stoff. Sie hängt nicht vom Ort ab.`,
      `c) ${eq(f('F_G') + ' = ' + fmt(p.FG / g) + ' kg · 1,62 m/s² = ' + f(fmt((p.FG / g) * GM) + ' N'))}`,
    ],
  }),

  task({
    id: 'b10', karte: 'gewicht', stufe: 1, familie: 'rechnen', src: 'nach Buch, Nr. 9',
    title: 'Hubzylinder',
    gen: () => ({ m: pick([40, 60, 80, 120]) }),
    draw: (p) => B.hubzylinder({ m: `m = ${p.m} kg`, F: 'F = ?' }),
    text: (p) => `Ein senkrechter Hubzylinder hebt Lasten bis m = ${p.m} kg. Welche Kraft F muss er mindestens aufbringen?`,
    asks: (p) => [{ k: 'F', unit: 'N', v: p.m * g }],
    fehler: (p) => [
      { ask: 0, v: p.m, msg: 'Du hast die Masse als Kraft genommen. Die Gewichtskraft ist F_G = m · g.' },
      { ask: 0, v: p.m / g, msg: 'Du hast durch g geteilt. Die Kraft ist F_G = m · g.' },
    ],
    tipps: () => ['Beim langsamen Heben trägt der Zylinder genau das Gewicht der Last.', 'F = F_G = m · g', 'Setze m in kg und g = 9,81 m/s² ein.'],
    loesung: (p) => [
      `${eq(f('F') + ' = ' + f('F_G') + ' = m · g = ' + p.m + ' kg · 9,81 m/s² = ' + f(fmt(p.m * g) + ' N'))}`,
      'Zum Anfahren braucht der Zylinder etwas mehr, weil die Last beschleunigt wird.',
    ],
  }),

  task({
    id: 'b11', karte: 'gewicht', stufe: 1, familie: 'umgekehrt', src: 'nach Buch, Nr. 10',
    title: 'Hebebühne: Masse aus der Gewichtskraft',
    gen: () => ({ FG: pick([9810, 12753, 14715]) }),
    draw: (p) => B.hebebuehne({ m: 'm = ?', FG: `F_G = ${p.FG} N` }),
    text: (p) => `Eine Hebebühne hebt einen Pkw mit ${f('F_G = ' + p.FG + ' N')}. Wie gross ist seine Masse?`,
    asks: (p) => [{ k: 'm', unit: 'kg', v: p.FG / g }],
    fehler: (p) => [
      { ask: 0, v: p.FG * g, msg: 'Du hast multipliziert. Aus F_G = m · g folgt m = F_G : g.' },
      { ask: 0, v: p.FG, msg: 'Das ist die Gewichtskraft in N. Die Masse in kg bekommst du durch g.' },
    ],
    tipps: () => ['Stelle F_G = m · g nach m um.', 'm = F_G : g', 'Teile die Kraft in N durch 9,81 m/s².'],
    loesung: (p) => [
      `${eq('m = ' + f('F_G') + ' : g = ' + p.FG + ' : 9,81 = ' + w(fmt(p.FG / g) + ' kg'))}`,
      'Kontrolle: Etwa 10 N pro kg. Aus 12 753 N werden also etwa 1 275 kg.',
    ],
  }),

  task({
    id: 'b12', karte: 'gewicht', stufe: 2, familie: 'begruenden', src: 'nach Buch, Nr. 11',
    title: 'Fallendes Bauteil: Spielt die Höhe eine Rolle?',
    gen: () => ({ m: pick([2, 5, 8]), h: pick([2, 3, 5]) }),
    draw: (p) => B.fallend({ m: `m = ${p.m} kg`, h: `h = ${p.h} m`, F: 'F = ?' }),
    text: (p) => `Ein Bauteil (m = ${p.m} kg) wird aus ${l('h = ' + p.h + ' m')} Höhe fallen gelassen. Den Luftwiderstand lassen wir weg. a) Was ändert sich an der Kraft, wenn du das Teil aus der doppelten Höhe fallen lässt? b) Welche Kraft wirkt beim Fallen auf das Teil?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Doppelte Höhe',
        opts: ['Die Kraft bleibt gleich.', 'Die Kraft wird doppelt so gross.', 'Die Kraft wird halb so gross.'],
        a: 0,
        why: [
          undefined,
          'Die Höhe bestimmt nur, wie schnell das Teil unten ankommt. Die Kraft hängt nur von m und g ab.',
          'Die Kraft wird nicht kleiner. Beim Fallen wirkt immer F = m · g.',
        ],
      },
      { k: 'b) F', unit: 'N', v: p.m * g },
    ],
    fehler: (p) => [
      { ask: 1, v: p.m * g * p.h, msg: 'Du hast mit der Höhe multipliziert. Das wäre die Hubarbeit in J, keine Kraft.' },
      { ask: 1, v: p.m, msg: 'Du hast g vergessen. Die Kraft ist F = m · g.' },
    ],
    tipps: () => ['Beim freien Fall ist die Beschleunigung gleich g.', 'F = m · a mit a = g. Die Höhe brauchst du nicht.', 'F = m · 9,81 m/s²'],
    loesung: (p) => [
      `${eq(f('F') + ' = m · g = ' + p.m + ' kg · 9,81 m/s² = ' + f(fmt(p.m * g) + ' N'))}`,
      'Die Fallhöhe ist eine Falle: Die Kraft hängt nur von Masse und g ab. Die Höhe bestimmt nur, wie schnell das Teil unten ankommt.',
    ],
  }),

  task({
    id: 'b13', karte: 'gewicht', stufe: 1, familie: 'schaetzen', src: 'Kreativ · Abschätzen, ohne Taschenrechner',
    title: 'Auf dem Mond im Kopf',
    gen: () => ({ m: pick([60, 72, 90]) }),
    draw: () => B.saeulen('Mond: etwa 1/6 von g', [{ v: 1, t: 'Erde: g ≈ 10 m/s²' }, { v: 1 / 6, t: 'Mond: g ≈ 1,6 m/s²' }]),
    text: (p) => `Ohne Taschenrechner, mit g ≈ 10 m/s² und Mond ≈ 1/6 davon: Wie gross ist die Gewichtskraft einer Person mit m = ${p.m} kg a) auf der Erde und b) auf dem Mond? Eine Abweichung von 8 % ist erlaubt.`,
    asks: (p) => [
      { k: 'a) Erde', unit: 'N', v: p.m * g, tol: 0.08 },
      { k: 'b) Mond', unit: 'N', v: p.m * GM, tol: 0.08 },
    ],
    fehler: (p) => [
      { ask: 1, v: p.m * g, msg: 'Das ist die Gewichtskraft auf der Erde. Auf dem Mond ist sie etwa sechsmal kleiner.' },
      { ask: 0, v: p.m, msg: 'Du hast g vergessen. Die Gewichtskraft ist etwa m mal 10.' },
    ],
    tipps: () => ['Rechne mit g ≈ 10 statt 9,81.', 'Erde: m mal 10. Mond: das Resultat durch 6.', 'Beispiel: 60 kg gibt 600 N. Durch 6 gibt 100 N.'],
    loesung: (p) => [
      `a) ${eq(p.m + ' · 10 = ' + p.m * 10 + ' N')}`,
      `b) ${eq(p.m * 10 + ' : 6 = ' + fmt((p.m * 10) / 6) + ' N')}`,
      `Genau: Erde ${fmt(p.m * g)} N, Mond ${fmt(p.m * GM)} N. Die Schätzung liegt nahe daran.`,
    ],
  }),

  task({
    id: 'b14', karte: 'gewicht', stufe: 2, familie: 'umgekehrt', src: 'Kreativ · Umgekehrt gefragt',
    title: 'Wie viel darf am Haken hängen?',
    gen: () => ({ F: pick([2.5, 5, 8, 10]) }),
    draw: (p) => B.heben({ FG: 'F_G', lines: [`F_max = ${fmt(p.F)} kN`, 'm_max = ?'] }),
    text: (p) => `Ein Hebezeug darf mit höchstens ${f('F = ' + fmt(p.F) + ' kN')} belastet werden. Wie viel Masse darf höchstens hängen? Rechne zuerst die Kraft in N um.`,
    asks: (p) => [{ k: 'm_max', unit: 'kg', v: (p.F * 1000) / g }],
    fehler: (p) => [
      { ask: 0, v: p.F / g, msg: 'Du hast die kN nicht in N umgerechnet. 1 kN = 1000 N.' },
      { ask: 0, v: p.F * 1000 * g, msg: 'Du hast multipliziert. Aus F_G = m · g folgt m = F_G : g.' },
      { ask: 0, v: p.F * 1000, msg: 'Das ist die Kraft in N. Die Masse in kg bekommst du durch g.' },
    ],
    tipps: () => ['Die grösste Kraft ist die Gewichtskraft der grössten Last.', 'F in N = F in kN mal 1000. Dann m = F : g.', 'Rechne F · 1000 : 9,81.'],
    loesung: (p) => [
      `In N: ${eq(fmt(p.F) + ' kN = ' + fmt(p.F * 1000) + ' N')}`,
      `Masse: ${eq('m = ' + f('F_G') + ' : g = ' + fmt(p.F * 1000) + ' : 9,81 = ' + w(fmt((p.F * 1000) / g) + ' kg'))}`,
      'Beim Anfahren oder Bremsen wirkt mehr als das Gewicht. Plane darum Reserve ein.',
    ],
  }),

  // ---------- v-t-Diagramm ----------

  task({
    id: 'b15', karte: 'vt', stufe: 2, familie: 'rechnen', src: 'nach Buch, Nr. 4',
    title: 'Lkw: Anfahren und Vollbremsung',
    gen: () => ({ m: pick([10, 12, 18]), a: pick([0.8, 1, 1.2]), v: pick([54, 72, 90]), tb: pick([3, 4]), mL: pick([2000, 5000]) }),
    draw: (p) => {
      const t1 = p.v / 3.6 / p.a;
      return B.vt([[0, 0], [t1, p.v / 3.6], [t1 + p.tb, 0]], { tmax: Math.ceil((t1 + p.tb) / 4) * 4 + 4, dv: 5, titel: 'v-t-Diagramm Lkw' });
    },
    text: (p) => `Ein Lkw (m = ${p.m} t) beschleunigt mit ${w('a = ' + fmt(p.a) + ' m/s²')} auf ${w(p.v + ' km/h')}. Dann bremst er in t = ${p.tb} s bis zum Stillstand. a) Welche Beschleunigungskraft ist nötig? b) Wie gross ist die Verzögerung beim Bremsen? c) Welche Kraft wirkt dabei auf eine Ladung mit m = ${p.mL} kg?`,
    asks: (p) => {
      const ab = p.v / 3.6 / p.tb;
      return [
        { k: 'a) F', unit: 'kN', v: p.m * p.a },
        { k: 'b) Verzögerung', unit: 'm/s²', v: ab },
        { k: 'c) F Ladung', unit: 'kN', v: (p.mL * ab) / 1000 },
      ];
    },
    fehler: (p) => {
      const ab = p.v / 3.6 / p.tb;
      return [
        { ask: 0, v: p.m * 1000 * p.a, msg: 'Du hast die Tonnen in kg umgerechnet. Dann ist das Resultat in N. Gefragt sind kN.' },
        { ask: 1, v: p.v / p.tb, msg: 'Du hast v in km/h eingesetzt. Rechne zuerst in m/s: durch 3,6.' },
        { ask: 2, v: p.mL * ab, msg: 'Das Resultat steht in N. Gefragt sind kN: durch 1000 teilen.' },
      ];
    },
    tipps: () => ['a) F = m · a. b) Verzögerung = Geschwindigkeitsänderung durch Zeit, v in m/s.', 'Rechne die Tonnen in kg um und km/h durch 3,6 in m/s.', 'c) F_Ladung = m_Ladung · Verzögerung.'],
    loesung: (p) => {
      const ab = p.v / 3.6 / p.tb;
      return [
        `a) ${eq(f('F') + ' = ' + p.m * 1000 + ' kg · ' + fmt(p.a) + ' m/s² = ' + f(fmt(p.m * p.a) + ' kN'))}`,
        `b) ${eq(p.v + ' km/h = ' + fmt(p.v / 3.6) + ' m/s')}, ${eq('a = ' + fmt(p.v / 3.6) + ' : ' + p.tb + ' = ' + w(fmt(ab, 3) + ' m/s²'))}`,
        `c) ${eq(f('F') + ' = ' + p.mL + ' kg · ' + fmt(ab, 3) + ' m/s² = ' + f(d2((p.mL * ab) / 1000) + ' kN'))}`,
        'Warnung: Ungesicherte Ladung rutscht bei einer Vollbremsung nach vorne. Sie kann die Kabine durchschlagen und Menschen verletzen. Sichere die Ladung immer mit Gurten.',
      ];
    },
  }),

  task({
    id: 'b16', karte: 'vt', stufe: 2, familie: 'bild', src: 'nach Buch, Nr. 6',
    title: 'v-t-Diagramm lesen',
    gen: () => {
      const t1 = pick([8, 10]), t2 = pick([12, 14]);
      let t3 = pick([18, 20]);
      while (t3 - t2 === t1) t3 = pick([18, 20]);
      return { m: pick([900, 1000, 1400]), v: pick([20, 25, 30]), t1, t2, t3 };
    },
    draw: (p) => B.vt([[0, 0], [p.t1, p.v], [p.t2, p.v], [p.t3, 0]], { tmax: 24, dv: 10, dt: 4, titel: `Pkw, m = ${p.m} kg` }),
    text: (p) => `Ein Pkw (m = ${p.m} kg) fährt nach dem v-t-Diagramm. Lies die Werte ab. Wie gross sind a) die Beschleunigung und die Verzögerung, b) die Beschleunigungskraft und c) die Bremskraft?`,
    asks: (p) => {
      const a1 = p.v / p.t1, a2 = p.v / (p.t3 - p.t2);
      return [
        { k: 'a) a Anfahren', unit: 'm/s²', v: a1 },
        { k: 'a) Verzögerung', unit: 'm/s²', v: a2 },
        { k: 'b) F', unit: 'N', v: p.m * a1 },
        { k: 'c) F Bremsen', unit: 'N', v: p.m * a2 },
      ];
    },
    fehler: (p) => {
      const a1 = p.v / p.t1;
      return [
        { ask: 0, v: p.v / p.t3, msg: 'Du hast durch die ganze Fahrzeit geteilt. Zum Anfahren zählt nur die Zeit bis zur Höchstgeschwindigkeit.' },
        { ask: 1, v: p.v / p.t3, msg: 'Du hast durch die ganze Fahrzeit geteilt. Beim Bremsen zählt nur die Bremszeit.' },
        { ask: 2, v: p.m * p.v, msg: 'Du hast m mal v gerechnet. Zuerst a = Δv : Δt, dann F = m · a.' },
        { ask: 3, v: p.m * a1, msg: 'Das ist die Kraft beim Anfahren. Beim Bremsen ist die Steigung anders.' },
      ];
    },
    tipps: (p) => ['Die Steigung der Linie ist die Beschleunigung: a = Δv : Δt.', `Anfahren von 0 bis ${p.t1} s. Bremsen von ${p.t2} bis ${p.t3} s.`, 'F = m · a mit den beiden Beschleunigungen.'],
    loesung: (p) => {
      const a1 = p.v / p.t1, a2 = p.v / (p.t3 - p.t2);
      return [
        `a) ${eq('a = ' + p.v + ' : ' + p.t1 + ' = ' + w(fmt(a1) + ' m/s²'))}, ${eq('Verzögerung = ' + p.v + ' : ' + (p.t3 - p.t2) + ' = ' + w(fmt(a2) + ' m/s²'))}`,
        `b) ${eq(f('F') + ' = ' + p.m + ' · ' + fmt(a1) + ' = ' + f(fmt(p.m * a1) + ' N'))}`,
        `c) ${eq(f('F') + ' = ' + p.m + ' · ' + fmt(a2) + ' = ' + f(fmt(p.m * a2) + ' N'))}`,
        `Zwischen ${p.t1} und ${p.t2} s ist v konstant. Dann ist a = 0 und die Beschleunigungskraft ist null.`,
      ];
    },
  }),

  task({
    id: 'b17', karte: 'vt', stufe: 2, familie: 'bild', src: 'Kreativ · Bild deuten',
    title: 'Wo wirkt die grösste Kraft?',
    gen: () => {
      let a1 = pick([1, 2, 3]), a2 = pick([1, 2, 3]);
      while (a1 === a2) a2 = pick([1, 2, 3]);
      const d1 = pick([4, 5, 6]), e2 = pick([4, 5, 6]), d3 = pick([4, 6]);
      return { m: pick([800, 1000, 1200, 1500]), a1, a2, d1, d2: e2, d3, v1: a1 * d1, v2: a1 * d1 + a2 * e2 };
    },
    draw: (p) =>
      B.vt([[0, 0], [p.d1, p.v1], [p.d1 + p.d2, p.v2], [p.d1 + p.d2 + p.d3, p.v2]], {
        tmax: Math.ceil((p.d1 + p.d2 + p.d3) / 4) * 4, dv: 5, dt: 2, titel: `Pkw, m = ${p.m} kg`,
        marken: [
          { t: p.d1 / 2, v: p.v1 / 2, text: '1', dx: -14, dy: -8 },
          { t: p.d1 + p.d2 / 2, v: (p.v1 + p.v2) / 2, text: '2', dx: 14, dy: 18 },
          { t: p.d1 + p.d2 + p.d3 / 2, v: p.v2, text: '3', dx: 0, dy: -10 },
        ],
      }),
    text: (p) => `Das v-t-Diagramm zeigt die Fahrt eines Pkw (m = ${p.m} kg) in drei Abschnitten. a) In welchem Abschnitt wirkt die grösste Beschleunigungskraft? b) Wie gross ist sie?`,
    asks: (p) => {
      const gross = p.a1 > p.a2 ? 0 : 1;
      return [
        {
          kind: 'choice', k: 'a) Grösste Kraft',
          opts: ['Abschnitt 1', 'Abschnitt 2', 'Abschnitt 3'],
          a: gross,
          why: [
            gross === 0 ? undefined : 'Abschnitt 1 ist flacher als Abschnitt 2. Die Steigung ist kleiner. Also ist auch F kleiner.',
            gross === 1 ? undefined : 'Abschnitt 2 ist flacher als Abschnitt 1. Die Steigung ist kleiner. Also ist auch F kleiner.',
            'Im Abschnitt 3 ist v konstant. Die Steigung ist null. Also ist F = 0.',
          ],
        },
        { k: 'b) F', unit: 'kN', v: (p.m * Math.max(p.a1, p.a2)) / 1000 },
      ];
    },
    fehler: (p) => [
      { ask: 1, v: (p.m * Math.min(p.a1, p.a2)) / 1000, msg: 'Das ist die Kraft im anderen Abschnitt. Nimm den Abschnitt mit der grösseren Steigung.' },
      { ask: 1, v: (p.m * p.v2) / 1000, msg: 'Du hast mit der Geschwindigkeit gerechnet. Für F brauchst du die Steigung a = Δv : Δt.' },
      { ask: 1, v: p.m * Math.max(p.a1, p.a2), msg: 'Das Resultat steht in N. Gefragt sind kN: durch 1000 teilen.' },
    ],
    tipps: () => ['Eine steile Linie heisst grosse Beschleunigung. Dann ist auch die Kraft gross.', 'Lies Δv und Δt im steilsten Abschnitt ab. a = Δv : Δt.', 'F = m · a, dann durch 1000 für kN.'],
    loesung: (p) => {
      const a = Math.max(p.a1, p.a2);
      return [
        `Abschnitt 1: ${eq('a = ' + p.v1 + ' : ' + p.d1 + ' = ' + fmt(p.a1) + ' m/s²')}`,
        `Abschnitt 2: ${eq('a = (' + p.v2 + ' − ' + p.v1 + ') : ' + p.d2 + ' = ' + fmt(p.a2) + ' m/s²')}`,
        `Grösste Kraft in Abschnitt ${p.a1 > p.a2 ? 1 : 2}: ${eq(f('F') + ' = ' + p.m + ' kg · ' + fmt(a) + ' m/s² = ' + f(fmt((p.m * a) / 1000) + ' kN'))}`,
        'Abschnitt 3 hat die Steigung null. Dort wirkt keine Beschleunigungskraft.',
      ];
    },
  }),

  task({
    id: 'b18', karte: 'vt', stufe: 2, familie: 'umgekehrt', src: 'Kreativ · Umgekehrt gefragt',
    title: 'Bremszeit aus der Bremskraft',
    gen: () => ({ m: pick([8, 10, 12, 16]), FB: pick([20, 24, 30, 40]), v: pick([54, 72, 90]) }),
    draw: (p) => B.wagen({ m: `m = ${p.m} t`, F: `F_B = ${p.FB} kN`, a: 'a = ?', v: `v = ${p.v} km/h`, bremst: true }),
    text: (p) => `Ein Lieferwagen (m = ${p.m} t) fährt mit ${w('v = ' + p.v + ' km/h')}. Die Bremsen erzeugen die Kraft ${f('F_B = ' + p.FB + ' kN')}. Berechne a) die Verzögerung und b) die Zeit bis zum Stillstand.`,
    asks: (p) => {
      const a = p.FB / p.m;
      return [
        { k: 'a) Verzögerung', unit: 'm/s²', v: a },
        { k: 'b) Bremszeit', unit: 's', v: p.v / 3.6 / a },
      ];
    },
    fehler: (p) => {
      const a = p.FB / p.m;
      return [
        { ask: 0, v: p.FB * p.m, msg: 'Du hast multipliziert. Aus F = m · a folgt a = F : m.' },
        { ask: 1, v: p.v / a, msg: 'Du hast v in km/h eingesetzt. Rechne zuerst in m/s: durch 3,6.' },
        { ask: 1, v: a / (p.v / 3.6), msg: 'Verkehrt herum. Die Zeit ist v : a.' },
      ];
    },
    tipps: () => ['Aus F = m · a folgt a = F : m. kN durch t gibt direkt m/s².', 'Dann t = v : a mit v in m/s.', 'v in m/s = v in km/h : 3,6'],
    loesung: (p) => {
      const a = p.FB / p.m;
      return [
        `a) ${eq('a = ' + f('F') + ' : m = ' + p.FB + ' kN : ' + p.m + ' t = ' + w(fmt(a) + ' m/s²'))}`,
        `b) ${eq(p.v + ' km/h = ' + fmt(p.v / 3.6) + ' m/s')}, ${eq('t = v : a = ' + fmt(p.v / 3.6) + ' : ' + fmt(a) + ' = ' + w(fmt(p.v / 3.6 / a) + ' s'))}`,
      ];
    },
  }),

  // ---------- Gewichtskraft und Beschleunigung zusammen ----------

  task({
    id: 'b19', karte: 'kombi', stufe: 2, familie: 'rechnen', src: 'Kreativ · Themen kombiniert',
    title: 'Aufzug fährt an',
    gen: () => ({ m: pick([600, 800, 1000]), a: pick([0.8, 1, 1.5]) }),
    draw: (p) => B.aufzug({ m: `m = ${p.m} kg`, FS: 'F_S = ?', FG: 'F_G', a: `a = ${fmt(p.a)} m/s²` }),
    text: (p) => `Ein Aufzug (m = ${p.m} kg mit Personen) fährt mit ${w('a = ' + fmt(p.a) + ' m/s²')} nach oben an. Wie gross sind a) die Gewichtskraft, b) die Beschleunigungskraft und c) die Seilkraft F_S?`,
    asks: (p) => [
      { k: 'a) F_G', unit: 'N', v: p.m * g },
      { k: 'b) F_a', unit: 'N', v: p.m * p.a },
      { k: 'c) F_S', unit: 'N', v: p.m * (g + p.a) },
    ],
    fehler: (p) => [
      { ask: 2, v: p.m * p.a, msg: 'Das ist nur die Beschleunigungskraft. Das Seil trägt auch das Gewicht. Addiere F_G.' },
      { ask: 2, v: p.m * g, msg: 'Das ist nur die Gewichtskraft. Das gilt bei konstanter Fahrt. Beim Anfahren kommt F_a dazu.' },
      { ask: 2, v: p.m * (g - p.a), msg: 'Du hast subtrahiert. Beim Anfahren nach oben muss das Seil mehr tragen: F_S = F_G + F_a.' },
    ],
    tipps: () => ['Das Seil trägt die Last und beschleunigt sie zusätzlich.', 'F_S = F_G + F_a = m · g + m · a', 'F_S = m · (g + a)'],
    loesung: (p) => [
      `a) ${eq(f('F_G') + ' = ' + p.m + ' · 9,81 = ' + fmt(p.m * g) + ' N')}`,
      `b) ${eq(f('F_a') + ' = ' + p.m + ' · ' + fmt(p.a) + ' = ' + fmt(p.m * p.a) + ' N')}`,
      `c) ${eq(f('F_S') + ' = ' + f('F_G') + ' + ' + f('F_a') + ' = ' + f(fmt(p.m * (g + p.a)) + ' N'))}`,
      'Darum fühlst du dich beim Anfahren nach oben schwerer.',
    ],
  }),

  task({
    id: 'b20', karte: 'kombi', stufe: 3, familie: 'waswaere', src: 'Kreativ · Was wäre wenn',
    title: 'Was wäre wenn: Aufzug fährt nach unten an',
    gen: () => ({ m: pick([600, 800, 1000]), a: pick([0.8, 1, 1.5]) }),
    draw: (p) => B.aufzug({ m: `m = ${p.m} kg`, FS: 'F_S = ?', FG: 'F_G', a: `a = ${fmt(p.a)} m/s²`, ab: true }),
    text: (p) => `Derselbe Aufzug (m = ${p.m} kg) fährt jetzt nach unten an. Er beschleunigt nach unten mit ${w('a = ' + fmt(p.a) + ' m/s²')}. a) Ist die Seilkraft grösser, kleiner oder gleich wie im Stillstand? b) Wie gross ist F_S?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Seilkraft',
        opts: ['kleiner als im Stillstand', 'gleich wie im Stillstand', 'grösser als im Stillstand'],
        a: 0,
        why: [
          undefined,
          'Im Stillstand ist a = 0. Hier beschleunigt der Aufzug nach unten. Dann trägt das Seil weniger.',
          'Das gilt beim Anfahren nach oben. Hier zeigt a nach unten. Dann trägt das Seil weniger.',
        ],
      },
      { k: 'b) F_S', unit: 'N', v: p.m * (g - p.a) },
    ],
    fehler: (p) => [
      { ask: 1, v: p.m * (g + p.a), msg: 'Du hast addiert. Beim Anfahren nach unten zeigt a nach unten. Dann gilt F_S = F_G − F_a.' },
      { ask: 1, v: p.m * g, msg: 'Das ist die Seilkraft im Stillstand. Hier beschleunigt der Aufzug nach unten. Zieh F_a ab.' },
    ],
    tipps: () => ['Die Beschleunigung zeigt nach unten. Das Seil muss weniger tragen.', 'F_G − F_S = F_a. Stelle nach F_S um.', 'F_S = m · (g − a)'],
    loesung: (p) => [
      `Kräfte: ${eq(f('F_G') + ' − ' + f('F_S') + ' = ' + f('F_a'))}`,
      `Umgestellt: ${eq(f('F_S') + ' = m · (g − a) = ' + p.m + ' · (9,81 − ' + fmt(p.a) + ') = ' + f(fmt(p.m * (g - p.a)) + ' N'))}`,
      `Im Stillstand wären es ${fmt(p.m * g)} N. Darum fühlst du dich beim Anfahren nach unten leichter.`,
    ],
  }),

  task({
    id: 'b21', karte: 'kombi', stufe: 3, familie: 'umgekehrt', src: 'Kreativ · Umgekehrt gefragt',
    title: 'Wie stark darf der Aufzug anfahren?',
    gen: () => {
      const m = pick([600, 800, 1000]);
      return { m, FS: Math.round((m * (g + pick([1, 1.5, 2, 2.5]))) / 100) * 100 };
    },
    draw: (p) => B.aufzug({ m: `m = ${p.m} kg`, FS: `F_S ≤ ${fmt(p.FS)} N`, FG: 'F_G', a: 'a = ?' }),
    text: (p) => `Das Seil eines Aufzugs (m = ${p.m} kg mit Personen) darf höchstens mit ${f('F_S = ' + fmt(p.FS) + ' N')} belastet werden. Der Aufzug fährt nach oben an. Berechne a) die Gewichtskraft, b) die Kraft, die zum Beschleunigen bleibt, und c) die grösste Beschleunigung.`,
    asks: (p) => [
      { k: 'a) F_G', unit: 'N', v: p.m * g },
      { k: 'b) F_a', unit: 'N', v: p.FS - p.m * g },
      { k: 'c) a_max', unit: 'm/s²', v: (p.FS - p.m * g) / p.m },
    ],
    fehler: (p) => [
      { ask: 1, v: p.FS, msg: 'Das ist die ganze Seilkraft. Ein Teil davon trägt nur das Gewicht. Zieh F_G ab.' },
      { ask: 2, v: p.FS / p.m, msg: 'Du hast die Gewichtskraft vergessen. Von F_S bleibt nur F_S − F_G zum Beschleunigen.' },
      { ask: 2, v: (p.FS - p.m * g) * p.m, msg: 'Du hast multipliziert. Aus F = m · a folgt a = F : m.' },
    ],
    tipps: () => ['F_S = F_G + F_a. Stelle nach F_a um.', 'F_a = F_S − F_G. Dann a = F_a : m.', 'a_max = F_S : m − g'],
    loesung: (p) => [
      `a) ${eq(f('F_G') + ' = ' + p.m + ' · 9,81 = ' + f(fmt(p.m * g) + ' N'))}`,
      `b) ${eq(f('F_a') + ' = ' + f('F_S') + ' − ' + f('F_G') + ' = ' + fmt(p.FS) + ' − ' + fmt(p.m * g) + ' = ' + f(fmt(p.FS - p.m * g) + ' N'))}`,
      `c) ${eq('a_max = ' + f('F_a') + ' : m = ' + fmt(p.FS - p.m * g) + ' : ' + p.m + ' = ' + w(d2((p.FS - p.m * g) / p.m) + ' m/s²'))}`,
    ],
  }),

  task({
    id: 'b22', karte: 'kombi', stufe: 3, familie: 'kette', src: 'Kreativ · Themen kombiniert',
    title: 'Rutscht die Ladung beim Bremsen?',
    gen: () => ({ m: pick([500, 800, 1200]), a: pick([5.5, 6, 6.5, 7]), mu: pick([0.3, 0.4, 0.5]) }),
    draw: (p) => B.ladung({ m: `m = ${p.m} kg`, mu: `Ladung ${p.m} kg, μ_0 = ${fmt(p.mu)}`, a: `a = ${fmt(p.a, 2)} m/s²`, v: 'v' }),
    text: (p) => `Ein Lkw bremst mit ${w('a = ' + fmt(p.a, 2) + ' m/s²')}. Auf der Ladefläche steht eine Kiste (m = ${p.m} kg), Haftreibungszahl μ_0 = ${fmt(p.mu)}. a) Welche Kraft braucht die Kiste, um mitzubremsen? b) Wie gross ist die grösste Haftreibungskraft? c) Welche Kraft müssen die Spanngurte zusätzlich aufnehmen?`,
    asks: (p) => {
      const Fa = p.m * p.a, FR = p.mu * p.m * g;
      return [
        { k: 'a) F_a', unit: 'N', v: Fa },
        { k: 'b) F_R,max', unit: 'N', v: FR },
        { k: 'c) F_Gurt', unit: 'N', v: Fa - FR },
      ];
    },
    fehler: (p) => {
      const Fa = p.m * p.a, FR = p.mu * p.m * g;
      return [
        { ask: 1, v: p.mu * p.m, msg: 'Du hast g vergessen. Die Normalkraft ist F_N = m · g.' },
        { ask: 2, v: Fa, msg: 'Das ist die ganze Kraft. Ein Teil davon hält die Haftreibung. Zieh F_R,max ab.' },
        { ask: 2, v: FR, msg: 'Das ist die Haftreibung. Die Gurte halten den Rest: F_a − F_R,max.' },
      ];
    },
    tipps: () => ['Die Kiste braucht F_a = m · a, damit sie mitbremst. Die Reibung hilft ihr dabei.', 'F_R,max = μ_0 · m · g. Was die Reibung nicht schafft, halten die Gurte.', 'F_Gurt = F_a − F_R,max'],
    loesung: (p) => {
      const Fa = p.m * p.a, FR = p.mu * p.m * g;
      return [
        `a) ${eq(f('F_a') + ' = ' + p.m + ' · ' + fmt(p.a, 2) + ' = ' + fmt(Fa) + ' N')}`,
        `b) ${eq(f('F_R,max') + ' = ' + fmt(p.mu) + ' · ' + p.m + ' · 9,81 = ' + fmt(FR) + ' N')}`,
        `c) ${eq(f('F_Gurt') + ' = ' + fmt(Fa) + ' − ' + fmt(FR) + ' = ' + f(fmt(Fa - FR) + ' N'))}`,
        'Hier wirken Beschleunigungskraft und Reibung zusammen.',
        'Warnung: Ohne Gurte rutscht die Kiste nach vorne, sobald a grösser ist als μ_0 · g. Sie kann Personen in der Kabine verletzen.',
      ];
    },
  }),

  task({
    id: 'b23', karte: 'kombi', stufe: 2, familie: 'fehler', src: 'Kreativ · Fehler finden',
    title: 'Fehler finden: Seilkraft beim Anfahren',
    gen: () => ({ m: pick([600, 800, 1000]), a: pick([0.8, 1, 1.5]) }),
    draw: (p) => B.aufzug({ m: `m = ${p.m} kg`, FS: 'F_S = ?', FG: 'F_G', a: `a = ${fmt(p.a)} m/s²` }),
    text: (p) => `Ein Aufzug (m = ${p.m} kg) fährt mit ${w('a = ' + fmt(p.a) + ' m/s²')} nach oben an. Mia rechnet: «F_S = F_G − F_a = ${p.m} · 9,81 − ${p.m} · ${fmt(p.a)} = ${fmt(p.m * (g - p.a))} N». a) Was ist falsch? b) Wie gross ist F_S richtig?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: [
          'Sie muss F_a addieren. Beim Anfahren nach oben trägt das Seil mehr.',
          'Sie darf F_G nicht rechnen.',
          'Sie muss durch die Beschleunigung teilen.',
          'Nichts, die Rechnung stimmt.',
        ],
        a: 0,
        why: [
          undefined,
          'Doch, das Seil trägt immer das Gewicht. Dazu kommt beim Anfahren die Beschleunigungskraft.',
          'Aus F = m · a teilst du nicht. Du multiplizierst.',
          'Dann wäre die Seilkraft beim Anfahren kleiner als im Stillstand. Das ist beim Anfahren nach oben nicht so.',
        ],
      },
      { k: 'b) F_S richtig', unit: 'N', v: p.m * (g + p.a) },
    ],
    fehler: (p) => [
      { ask: 1, v: p.m * (g - p.a), msg: 'Das ist Mias Wert. Er gilt für das Anfahren nach unten, nicht nach oben.' },
      { ask: 1, v: p.m * p.a, msg: 'Das ist nur F_a. Das Seil trägt auch das Gewicht F_G.' },
    ],
    tipps: () => ['Fühlst du dich im Aufzug beim Anfahren nach oben schwerer oder leichter?', 'Schwerer. Das Seil trägt also mehr als das Gewicht.', 'F_S = F_G + F_a'],
    loesung: (p) => [
      `Mia hat F_a abgezogen. Beim Anfahren nach oben wird F_a addiert.`,
      `Richtig: ${eq(f('F_S') + ' = m · (g + a) = ' + p.m + ' · (9,81 + ' + fmt(p.a) + ') = ' + f(fmt(p.m * (g + p.a)) + ' N'))}`,
      `Kontrolle: Die Seilkraft muss grösser sein als die Gewichtskraft ${fmt(p.m * g)} N.`,
    ],
  }),
];
