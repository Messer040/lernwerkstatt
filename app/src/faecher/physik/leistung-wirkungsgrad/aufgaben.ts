// Aufgaben zum Kapitel Leistung, Wirkungsgrad: Leistung, Wirkungsgrad, Gesamtwirkungsgrad, Energiekosten.
import { task, type Task } from '../../../core/types';
import { eq, f, l, v as w } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import * as B from './bilder';

const g = 9.81;
const d2 = (x: number) => fmt(x, 2);

export const AUFGABEN: Task[] = [
  // ---------- Leistung: Arbeit pro Zeit ----------

  task({
    id: 'p1', karte: 'leistung', stufe: 1, familie: 'rechnen',
    title: 'Leistung aus Arbeit und Zeit',
    gen: () => ({ W: rng(2000, 20000, 1000), t: rng(4, 40, 2) }),
    draw: (p) => B.heben({ h: 'h', lines: [`W = ${p.W} J`, `t = ${p.t} s`, 'P = ?'], c0: true }),
    text: (p) => `Ein Hubwerk verrichtet die Arbeit ${w('W = ' + p.W + ' J')} in der Zeit t = ${p.t} s. Wie gross ist die Leistung P?`,
    asks: (p) => [{ k: 'P', unit: 'W', v: p.W / p.t }],
    fehler: (p) => [{ ask: 0, v: p.W * p.t, msg: 'Du hast multipliziert. Leistung ist Arbeit pro Zeit: P = W : t.' }],
    tipps: () => ['Leistung ist Arbeit pro Zeit.', 'P = W : t. Die Einheit ist J/s = W (Watt).', 'Teile die Arbeit in J durch die Zeit in s.'],
    loesung: (p) => [
      `Formel: ${eq(w('P') + ' = ' + w('W') + ' : t')}`,
      `Einsetzen: ${eq(w('P') + ' = ' + p.W + ' J : ' + p.t + ' s')}`,
      `Resultat: ${eq(w('P = ' + fmt(p.W / p.t) + ' W'))}`,
      'Vorstellung: Dieselbe Arbeit in der halben Zeit braucht die doppelte Leistung.',
    ],
  }),

  task({
    id: 'p2', karte: 'leistung', stufe: 2, familie: 'rechnen',
    title: 'Kran: Hubleistung',
    gen: () => ({ m: rng(300, 1000, 100), h: rng(4, 12, 1), t: rng(5, 20, 5) }),
    draw: (p) => B.heben({ h: `h = ${p.h} m`, m: `m = ${p.m} kg`, lines: ['P = ?', `t = ${p.t} s`], c0: true }),
    text: (p) => `Ein Kran hebt m = ${p.m} kg in t = ${p.t} s um ${l('h = ' + p.h + ' m')}. Berechne a) die Hubarbeit W und b) die Hubleistung P in kW. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) W', unit: 'J', v: p.m * g * p.h },
      { k: 'b) P', unit: 'kW', v: (p.m * g * p.h) / p.t / 1000 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.m * p.h, msg: 'Du hast g vergessen. Die Kraft beim Heben ist F_G = m · g.' },
      { ask: 1, v: (p.m * g * p.h * p.t) / 1000, msg: 'Du hast mit der Zeit multipliziert. Leistung ist Arbeit : Zeit.' },
    ],
    tipps: () => ['Zuerst die Hubarbeit: W = m · g · h.', 'Dann die Leistung: P = W : t.', 'Rechne am Schluss in kW um: 1 kW = 1000 W.'],
    loesung: (p) => {
      const W = p.m * g * p.h;
      return [
        `Hubarbeit: ${eq(w('W') + ' = m · g · ' + l('h') + ' = ' + p.m + ' kg · 9,81 m/s² · ' + p.h + ' m = ' + w(fmt(W) + ' J'))}`,
        `Leistung: ${eq(w('P') + ' = ' + w('W') + ' : t = ' + fmt(W) + ' J : ' + p.t + ' s = ' + w(fmt(W / p.t) + ' W'))}`,
        `Resultat: ${eq(w('P = ' + d2(W / p.t / 1000) + ' kW'))}`,
      ];
    },
  }),

  task({
    id: 'p3', karte: 'leistung', stufe: 2, familie: 'rechnen',
    title: 'Förderband: Leistung aus Kraft und Geschwindigkeit',
    gen: () => ({ F: rng(200, 2000, 100), v: pick([0.5, 0.8, 1.2, 1.5, 2]) }),
    draw: (p) => B.band({ F: `F = ${p.F} N`, v: `v = ${fmt(p.v, 1)} m/s` }),
    text: (p) => `Ein Förderband zieht mit der Kraft ${f('F = ' + p.F + ' N')}. Es läuft mit ${w('v = ' + fmt(p.v, 1) + ' m/s')}. Welche Leistung P braucht das Band?`,
    asks: (p) => [{ k: 'P', unit: 'W', v: p.F * p.v }],
    fehler: (p) => [{ ask: 0, v: p.F / p.v, msg: 'Du hast geteilt. Bei gleichmässiger Bewegung gilt P = F · v.' }],
    tipps: () => ['Bei gleichmässiger Bewegung gilt: Leistung = Kraft mal Geschwindigkeit.', 'P = F · v', 'F in N mal v in m/s ergibt W.'],
    loesung: (p) => [
      `Formel: ${eq(w('P') + ' = ' + f('F') + ' · v')}`,
      `Einsetzen: ${eq(w('P') + ' = ' + f(p.F + ' N') + ' · ' + fmt(p.v, 1) + ' m/s')}`,
      `Resultat: ${eq(w('P = ' + fmt(p.F * p.v) + ' W'))}`,
      `Herleitung: ${eq('P = W : t = F · s : t = F · v')}, weil s : t die Geschwindigkeit ist.`,
    ],
  }),

  task({
    id: 'p7', karte: 'leistung', stufe: 2, familie: 'fehler', src: 'Kreativ · Fehler finden',
    title: 'Fehler finden: Leistung von Mia',
    gen: () => ({ W: rng(6000, 30000, 2000), t: rng(4, 12, 2) }),
    draw: (p) => B.heben({ h: 'h', lines: [`W = ${p.W} J`, `t = ${p.t} s`, 'P = ?'], c0: true }),
    text: (p) => `Ein Hubwerk verrichtet ${w('W = ' + p.W + ' J')} in t = ${p.t} s. Mia rechnet: «P = W · t = ${p.W} J · ${p.t} s = ${p.W * p.t}». a) Was ist falsch? b) Wie gross ist die Leistung richtig?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: [
          'Sie hat multipliziert. Leistung ist Arbeit durch Zeit.',
          'Sie hätte die Zeit in Minuten einsetzen müssen.',
          'Sie hätte W in kJ einsetzen müssen.',
          'Nichts, die Rechnung stimmt.',
        ],
        a: 0,
        why: [
          undefined,
          'Die Einheit W (Watt) ist J pro Sekunde. Die Zeit gehört in s.',
          'Das ändert nur die Zahl, nicht den Fehler. Der Fehler liegt in der Formel.',
          'J · s ist keine Leistung. Die Einheit der Leistung ist J/s = W.',
        ],
      },
      { k: 'b) P', unit: 'W', v: p.W / p.t },
    ],
    fehler: (p) => [{ ask: 1, v: p.W * p.t, msg: 'Das ist Mias Wert. Er hat die Einheit J·s. Leistung ist W : t.' }],
    tipps: () => ['Schau auf die Einheit von Mias Resultat. Ist das eine Leistung?', 'Leistung ist Arbeit pro Zeit. «Pro» heisst teilen.', 'P = W : t'],
    loesung: (p) => [
      `Mia hat multipliziert. Ihr Resultat hat die Einheit J·s. Eine Leistung hat die Einheit J/s = W.`,
      `Richtig: ${eq(w('P') + ' = ' + w('W') + ' : t = ' + p.W + ' J : ' + p.t + ' s = ' + w(fmt(p.W / p.t) + ' W'))}`,
      'Kontrolle: Dieselbe Arbeit in kürzerer Zeit muss eine grössere Leistung geben.',
    ],
  }),

  task({
    id: 'p8', karte: 'leistung', stufe: 1, familie: 'schaetzen', src: 'Kreativ · Abschätzen, ohne Taschenrechner',
    title: 'Wie viel leistet ein Mensch auf der Treppe?',
    gen: () => ({ m: pick([60, 70, 80, 90]), h: pick([3, 6]), t: pick([8, 10, 12, 15, 20]) }),
    draw: (p) => B.treppe({ m: `m = ${p.m} kg`, h: `h = ${p.h} m`, t: `t = ${p.t} s` }),
    text: (p) => `Ohne Taschenrechner: Eine Person mit m = ${p.m} kg steigt in t = ${p.t} s um ${l('h = ' + p.h + ' m')} die Treppe hoch. Schätze die Leistung. Rechne mit g ≈ 10 m/s². Eine Abweichung von 8 % ist erlaubt.`,
    asks: (p) => [{ k: 'P', unit: 'W', v: (p.m * g * p.h) / p.t, tol: 0.08 }],
    fehler: (p) => [{ ask: 0, v: (p.m * p.h) / p.t, msg: 'Du hast g vergessen. Die Person hebt ihr Gewicht F_G = m · g, nicht ihre Masse.' }],
    tipps: () => ['Die Person hebt ihr eigenes Gewicht. Das ist Hubarbeit.', 'W = m · g · h mit g ≈ 10. Dann P = W : t.', 'Beispiel: 70 kg · 10 · 3 m = 2100 J. Teile durch die Zeit.'],
    loesung: (p) => [
      `Hubarbeit gerundet: ${eq(w('W') + ' ≈ ' + p.m + ' kg · 10 m/s² · ' + p.h + ' m = ' + w(p.m * 10 * p.h + ' J'))}`,
      `Leistung gerundet: ${eq(w('P') + ' ≈ ' + p.m * 10 * p.h + ' J : ' + p.t + ' s ≈ ' + w(fmt((p.m * 10 * p.h) / p.t) + ' W'))}`,
      `Genau mit g = 9,81: ${eq(w('P = ' + fmt((p.m * g * p.h) / p.t) + ' W'))}`,
      'Ein Mensch leistet auf der Treppe einige hundert Watt. Das hält er nur kurz durch.',
    ],
  }),

  task({
    id: 'p10', karte: 'leistung', stufe: 2, familie: 'umgekehrt', src: 'Kreativ · Umgekehrt gefragt',
    title: 'Auto: Zugkraft aus Leistung und Tempo',
    gen: () => ({ P: pick([15, 20, 30, 45, 60]), kmh: pick([36, 54, 72, 90, 108]) }),
    draw: (p) => B.auto({ v: `v = ${p.kmh} km/h`, m: `P = ${p.P} kW`, W: 'F = ?' }),
    text: (p) => `Ein Auto fährt gleichmässig mit ${w('v = ' + p.kmh + ' km/h')}. An den Rädern liegt die Leistung ${w('P = ' + p.P + ' kW')} an. Berechne a) die Geschwindigkeit v in m/s und b) die Antriebskraft F.`,
    asks: (p) => [
      { k: 'a) v', unit: 'm/s', v: p.kmh / 3.6 },
      { k: 'b) F', unit: 'N', v: (p.P * 1000) / (p.kmh / 3.6) },
    ],
    fehler: (p) => [
      { ask: 0, v: p.kmh * 3.6, msg: 'Du hast mit 3,6 multipliziert. Von km/h nach m/s teilst du durch 3,6.' },
      { ask: 1, v: (p.P * 1000) / p.kmh, msg: 'Du hast v nicht in m/s umgerechnet. Teile erst durch 3,6.' },
      { ask: 1, v: p.P * 1000 * (p.kmh / 3.6), msg: 'Du hast multipliziert. Aus P = F · v folgt F = P : v.' },
    ],
    tipps: () => ['Aus P = F · v folgt F = P : v.', 'Rechne zuerst km/h in m/s um: durch 3,6. Dann kW in W: mal 1000.', 'F = P in W : v in m/s'],
    loesung: (p) => [
      `Geschwindigkeit: ${eq(w('v') + ' = ' + p.kmh + ' : 3,6 = ' + w(fmt(p.kmh / 3.6) + ' m/s'))}`,
      `Umstellen: ${eq(f('F') + ' = ' + w('P') + ' : v')}`,
      `Einsetzen: ${eq(f('F') + ' = ' + p.P * 1000 + ' W : ' + fmt(p.kmh / 3.6) + ' m/s = ' + f(fmt((p.P * 1000) / (p.kmh / 3.6)) + ' N'))}`,
      'Bei gleicher Leistung wird die Zugkraft kleiner, wenn das Auto schneller fährt.',
    ],
  }),

  // ---------- Wirkungsgrad ----------

  task({
    id: 'p4', karte: 'wirkungsgrad', stufe: 2, familie: 'rechnen',
    title: 'Wirkungsgrad eines Elektromotors',
    gen: () => ({ Pzu: pick([2.2, 3, 4, 5.5, 7.5]), eta: pick([0.75, 0.8, 0.85, 0.9]) }),
    draw: (p) => B.fluss([['Motor', `η = ${fmt(p.eta, 2)}`]], [`P_zu = ${fmt(p.Pzu, 1)} kW`, 'P_ab = ?']),
    text: (p) => `Ein Elektromotor nimmt ${w('P_zu = ' + fmt(p.Pzu, 1) + ' kW')} auf. Sein Wirkungsgrad ist η = ${fmt(p.eta, 2)}. Berechne a) die abgegebene Leistung P_ab und b) die Verlustleistung.`,
    asks: (p) => [
      { k: 'a) P_ab', unit: 'kW', v: p.Pzu * p.eta },
      { k: 'b) Verlust', unit: 'kW', v: p.Pzu * (1 - p.eta) },
    ],
    fehler: (p) => [
      { ask: 0, v: p.Pzu / p.eta, msg: 'Du hast geteilt. Die abgegebene Leistung ist kleiner als die zugeführte: P_ab = η · P_zu.' },
      { ask: 1, v: p.Pzu * p.eta, msg: 'Das ist die abgegebene Leistung. Der Verlust ist der Rest: P_zu − P_ab.' },
    ],
    tipps: () => ['Wirkungsgrad = abgegebene Leistung : zugeführte Leistung.', 'P_ab = η · P_zu', 'Verlust = P_zu − P_ab'],
    loesung: (p) => [
      `Formel: ${eq('η = ' + w('P_ab') + ' : ' + w('P_zu'))}`,
      `Umstellen: ${eq(w('P_ab') + ' = η · ' + w('P_zu') + ' = ' + fmt(p.eta, 2) + ' · ' + fmt(p.Pzu, 1) + ' kW = ' + w(d2(p.Pzu * p.eta) + ' kW'))}`,
      `Verlust: ${eq(w('P_zu') + ' − ' + w('P_ab') + ' = ' + d2(p.Pzu * (1 - p.eta)) + ' kW')}`,
      `Der Wirkungsgrad ist immer kleiner als 1. Hier gehen ${fmt((1 - p.eta) * 100, 0)} % als Wärme verloren.`,
    ],
  }),

  task({
    id: 'p14', karte: 'wirkungsgrad', stufe: 1, familie: 'begruenden', src: 'Kreativ · Begründen',
    title: 'Kann ein Motor η = 1,05 haben?',
    gen: () => ({ Pzu: pick([2, 4, 5, 10]), eta: pick([0.6, 0.7, 0.8, 0.9]) }),
    draw: (p) => B.fluss([['Motor', 'η = ?']], [`P_zu = ${p.Pzu} kW`, `P_ab = ${fmt(p.Pzu * p.eta, 1)} kW`]),
    text: (p) => `Ein Prospekt behauptet: «Unser Motor hat den Wirkungsgrad η = 1,05.» a) Warum ist das nicht möglich? b) Ein anderer Motor nimmt ${w('P_zu = ' + p.Pzu + ' kW')} auf und gibt ${w('P_ab = ' + fmt(p.Pzu * p.eta, 1) + ' kW')} ab. Wie gross ist sein Wirkungsgrad η?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Warum nicht?',
        opts: [
          'Er würde mehr Leistung abgeben, als er aufnimmt. Energie entsteht nie aus dem Nichts.',
          'Der Wirkungsgrad muss immer genau 1 sein.',
          'Wirkungsgrade gibt man nur in Prozent an.',
          'Das ist möglich, wenn der Motor gut gekühlt ist.',
        ],
        a: 0,
        why: [
          undefined,
          'Wegen der Verluste (Reibung, Wärme) ist η immer kleiner als 1.',
          'Man darf η auch als Dezimalzahl angeben. Das ändert nichts am Fehler.',
          'Kühlung senkt die Verluste. Sie macht aber nie mehr Leistung als zugeführt wird.',
        ],
      },
      { k: 'b) η', unit: '', v: p.eta },
    ],
    fehler: (p) => [{ ask: 1, v: 1 / p.eta, msg: 'Du hast P_zu durch P_ab geteilt. Es gilt η = P_ab : P_zu. Das Resultat ist kleiner als 1.' }],
    tipps: () => ['Was kommt hinten aus dem Motor heraus? Kann es mehr sein als das, was hineingeht?', 'η = P_ab : P_zu. Die abgegebene Leistung steht oben im Bruch.', 'Teile die abgegebene durch die zugeführte Leistung. Beide in kW.'],
    loesung: (p) => [
      'Ein Wirkungsgrad über 1 hiesse: Es kommt mehr Leistung heraus als hineingeht. Das gibt es nicht. Ein Teil geht immer als Wärme verloren.',
      `${eq('η = ' + w('P_ab') + ' : ' + w('P_zu') + ' = ' + fmt(p.Pzu * p.eta, 1) + ' kW : ' + p.Pzu + ' kW = ' + w(fmt(p.eta, 2)))}`,
      `Das sind ${fmt(p.eta * 100, 0)} %.`,
    ],
  }),

  task({
    id: 'p12', karte: 'wirkungsgrad', stufe: 2, familie: 'fehler', src: 'Kreativ · Fehler finden',
    title: 'Fehler finden: Motorleistung von Lisa',
    gen: () => ({ Pab: pick([1.5, 2, 2.4, 3, 4.5]), eta: pick([0.6, 0.7, 0.75, 0.8]) }),
    draw: (p) => B.fluss([['Hubwerk', `η = ${fmt(p.eta, 2)}`]], ['P_zu = ?', `P_ab = ${fmt(p.Pab, 1)} kW`]),
    text: (p) => `Ein Hubwerk muss ${w('P_ab = ' + fmt(p.Pab, 1) + ' kW')} abgeben. Sein Wirkungsgrad ist η = ${fmt(p.eta, 2)}. Lisa rechnet: «P_zu = η · P_ab = ${fmt(p.eta, 2)} · ${fmt(p.Pab, 1)} kW = ${d2(p.eta * p.Pab)} kW». a) Was stimmt nicht? b) Welche Motorleistung P_zu ist richtig?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: [
          'Lisa muss teilen: P_zu = P_ab : η. Der Motor muss mehr liefern, als am Ende ankommt.',
          'Lisa hätte P_ab und P_zu addieren müssen.',
          'Lisa hätte η in Prozent einsetzen müssen.',
          'Nichts, die Rechnung stimmt.',
        ],
        a: 0,
        why: [
          undefined,
          'Addieren gibt keinen Wirkungsgrad. Es gilt η = P_ab : P_zu.',
          'Mit 80 statt 0,8 wäre das Ergebnis 100-mal zu gross.',
          'Lisas Motorleistung ist kleiner als die Leistung, die ankommen soll. Das geht nicht.',
        ],
      },
      { k: 'b) P_zu', unit: 'kW', v: p.Pab / p.eta },
    ],
    fehler: (p) => [{ ask: 1, v: p.Pab * p.eta, msg: 'Das ist Lisas Wert. Sie hat multipliziert statt geteilt. P_zu muss grösser sein als P_ab.' }],
    tipps: () => ['Vergleiche P_zu mit P_ab. Welche Grösse muss grösser sein?', 'η = P_ab : P_zu. Stelle nach P_zu um.', 'P_zu = P_ab : η'],
    loesung: (p) => [
      `Lisa hat mit η multipliziert. Dann wäre P_zu kleiner als P_ab. Das ist unmöglich, denn die Verluste kommen dazu.`,
      `Richtig: ${eq(w('P_zu') + ' = ' + w('P_ab') + ' : η = ' + fmt(p.Pab, 1) + ' kW : ' + fmt(p.eta, 2) + ' = ' + w(d2(p.Pab / p.eta) + ' kW'))}`,
      'Merke: Zugeführt ist immer mehr als abgegeben.',
    ],
  }),

  task({
    id: 'p5', karte: 'wirkungsgrad', stufe: 3, familie: 'rechnen',
    title: 'Hubwerk: nötige Motorleistung',
    gen: () => ({ m: rng(300, 1000, 100), h: rng(4, 10, 1), t: rng(5, 20, 5), eta: pick([0.7, 0.75, 0.8, 0.85]) }),
    draw: (p) => B.heben({ h: `h = ${p.h} m`, m: `m = ${p.m} kg`, lines: ['P_zu = ?', `t = ${p.t} s`, `η = ${fmt(p.eta, 2)}`], c0: true }),
    text: (p) => `Ein Hubwerk soll m = ${p.m} kg in t = ${p.t} s um ${l('h = ' + p.h + ' m')} heben. Der Wirkungsgrad des Hubwerks ist η = ${fmt(p.eta, 2)}. Berechne a) die Hubleistung P_ab und b) die nötige Motorleistung P_zu, beide in kW. (g = 9,81 m/s²)`,
    asks: (p) => {
      const Pab = (p.m * g * p.h) / p.t / 1000;
      return [
        { k: 'a) P_ab', unit: 'kW', v: Pab },
        { k: 'b) P_zu', unit: 'kW', v: Pab / p.eta },
      ];
    },
    fehler: (p) => {
      const Pab = (p.m * g * p.h) / p.t / 1000;
      return [
        { ask: 1, v: Pab * p.eta, msg: 'Du hast mit η multipliziert. Der Motor muss mehr liefern als die Last braucht: P_zu = P_ab : η.' },
        { ask: 1, v: Pab, msg: 'Das ist nur die Hubleistung. Die Verluste fehlen noch: P_zu = P_ab : η.' },
      ];
    },
    tipps: () => ['Die Hubleistung ist die abgegebene Leistung: P_ab = m · g · h : t.', 'Der Motor muss mehr liefern, weil Verluste entstehen.', 'P_zu = P_ab : η. Achtung: teilen, nicht multiplizieren.'],
    loesung: (p) => {
      const Pab = (p.m * g * p.h) / p.t;
      return [
        `Hubleistung: ${eq(w('P_ab') + ' = m · g · h : t = ' + p.m + ' kg · 9,81 m/s² · ' + p.h + ' m : ' + p.t + ' s = ' + w(fmt(Pab) + ' W'))}`,
        `In kW: ${eq(w('P_ab = ' + d2(Pab / 1000) + ' kW'))}`,
        `Wirkungsgrad umstellen: ${eq(w('P_zu') + ' = ' + w('P_ab') + ' : η')}`,
        `Resultat: ${eq(w('P_zu') + ' = ' + d2(Pab / 1000) + ' kW : ' + fmt(p.eta, 2) + ' = ' + w(d2(Pab / 1000 / p.eta) + ' kW'))}`,
        'Kontrolle: P_zu muss grösser sein als P_ab. Wenn nicht, hast du multipliziert statt geteilt.',
      ];
    },
  }),

  task({
    id: 'p9', karte: 'wirkungsgrad', stufe: 3, familie: 'umgekehrt', src: 'Kreativ · Umgekehrt gefragt, kombiniert',
    title: 'Wie lange braucht der Motor?',
    gen: () => ({ Pzu: pick([3, 4, 5.5, 7.5]), eta: pick([0.75, 0.8, 0.85]), m: pick([500, 800, 1000, 1200]), h: pick([4, 6, 8, 10]) }),
    draw: (p) => B.heben({ h: `h = ${p.h} m`, m: `m = ${p.m} kg`, lines: ['t = ?', `P_zu = ${fmt(p.Pzu, 1)} kW`, `η = ${fmt(p.eta, 2)}`], c0: true }),
    text: (p) => `Ein Motor nimmt ${w('P_zu = ' + fmt(p.Pzu, 1) + ' kW')} auf. Das Hubwerk hat den Wirkungsgrad η = ${fmt(p.eta, 2)}. Es hebt m = ${p.m} kg um ${l('h = ' + p.h + ' m')}. Berechne a) die abgegebene Leistung P_ab, b) die Hubarbeit W und c) die Hubzeit t. (g = 9,81 m/s²)`,
    asks: (p) => {
      const W = p.m * g * p.h, Pab = p.Pzu * p.eta;
      return [
        { k: 'a) P_ab', unit: 'kW', v: Pab },
        { k: 'b) W', unit: 'J', v: W },
        { k: 'c) t', unit: 's', v: W / (Pab * 1000) },
      ];
    },
    fehler: (p) => {
      const W = p.m * g * p.h, Pab = p.Pzu * p.eta;
      return [
        { ask: 0, v: p.Pzu / p.eta, msg: 'Du hast geteilt. Abgegeben wird weniger: P_ab = η · P_zu.' },
        { ask: 2, v: W / (p.Pzu * 1000), msg: 'Du hast mit P_zu gerechnet. Fürs Heben zählt nur die abgegebene Leistung P_ab = η · P_zu.' },
        { ask: 2, v: (Pab * 1000) / W, msg: 'Du hast den Bruch umgekehrt. Die Zeit ist t = W : P_ab.' },
      ];
    },
    tipps: () => ['Fürs Heben zählt nur die abgegebene Leistung: P_ab = η · P_zu.', 'Die Hubarbeit ist W = m · g · h. Aus P = W : t folgt t = W : P.', 't = W : P_ab mit P_ab in W (kW mal 1000).'],
    loesung: (p) => {
      const W = p.m * g * p.h, Pab = p.Pzu * p.eta;
      return [
        `Abgabe: ${eq(w('P_ab') + ' = η · ' + w('P_zu') + ' = ' + fmt(p.eta, 2) + ' · ' + fmt(p.Pzu, 1) + ' kW = ' + w(d2(Pab) + ' kW'))}`,
        `Hubarbeit: ${eq(w('W') + ' = m · g · h = ' + p.m + ' · 9,81 · ' + p.h + ' = ' + w(fmt(W) + ' J'))}`,
        `Zeit: ${eq('t = ' + w('W') + ' : ' + w('P_ab') + ' = ' + fmt(W) + ' J : ' + fmt(Pab * 1000) + ' W = ' + fmt(W / (Pab * 1000)) + ' s')}`,
        'Ein stärkerer Motor oder ein besseres Getriebe verkürzt die Zeit.',
      ];
    },
  }),

  task({
    id: 'p11', karte: 'wirkungsgrad', stufe: 2, familie: 'waswaere', src: 'Kreativ · Was wäre wenn',
    title: 'Was wäre wenn: Getriebe läuft schlechter',
    gen: () => ({ Pab: pick([2, 3, 4]), e1: pick([0.9, 0.85]), e2: pick([0.7, 0.6]) }),
    draw: (p) => B.fluss([['Hubwerk', `η = ${fmt(p.e1, 2)} → ${fmt(p.e2, 2)}`]], ['P_zu = ?', `P_ab = ${p.Pab} kW`]),
    text: (p) => `Ein Hubwerk muss ${w('P_ab = ' + p.Pab + ' kW')} abgeben. Neu hat sein Wirkungsgrad η = ${fmt(p.e1, 2)}. Nach Jahren ohne Schmierung sinkt er auf η = ${fmt(p.e2, 2)}. Die Last bleibt gleich. Berechne a) P_zu mit dem abgenutzten Getriebe und b) die Mehrleistung gegenüber dem neuen Zustand, beide in kW. c) Wohin geht die Mehrleistung?`,
    asks: (p) => [
      { k: 'a) P_zu (abgenutzt)', unit: 'kW', v: p.Pab / p.e2 },
      { k: 'b) Mehrleistung', unit: 'kW', v: p.Pab / p.e2 - p.Pab / p.e1 },
      {
        kind: 'choice', k: 'c) Wohin geht sie?',
        opts: ['In die Last. Sie wird schneller gehoben.', 'Als Wärme in Getriebe und Umgebung.', 'Sie wird im Motor gespeichert.', 'Sie verschwindet, ohne etwas zu tun.'],
        a: 1,
        why: [
          'Die Last braucht gleich viel. Die Abgabe P_ab ist ja gleich geblieben.',
          undefined,
          'Ein Motor speichert keine Leistung. Das Mehr geht verloren.',
          'Energie verschwindet nie. Sie wird zu Wärme.',
        ],
      },
    ],
    fehler: (p) => [
      { ask: 0, v: p.Pab * p.e2, msg: 'Du hast mit η multipliziert. P_zu muss grösser sein als P_ab: P_zu = P_ab : η.' },
      { ask: 1, v: p.Pab / p.e1, msg: 'Das ist P_zu bei gutem Wirkungsgrad. Gefragt ist der Unterschied zu P_zu bei schlechtem.' },
    ],
    tipps: () => ['Rechne beide Fälle einzeln: P_zu = P_ab : η.', 'Die Mehrleistung ist der Unterschied der beiden P_zu.', 'Mehrleistung = P_zu (schlecht) − P_zu (gut)'],
    loesung: (p) => [
      `Mit η = ${fmt(p.e1, 2)}: ${eq(w('P_zu') + ' = ' + p.Pab + ' : ' + fmt(p.e1, 2) + ' = ' + d2(p.Pab / p.e1) + ' kW')}`,
      `Mit η = ${fmt(p.e2, 2)}: ${eq(w('P_zu') + ' = ' + p.Pab + ' : ' + fmt(p.e2, 2) + ' = ' + w(d2(p.Pab / p.e2) + ' kW'))}`,
      `Mehrleistung: ${eq(d2(p.Pab / p.e2) + ' − ' + d2(p.Pab / p.e1) + ' = ' + w(d2(p.Pab / p.e2 - p.Pab / p.e1) + ' kW'))}`,
      'Die Last merkt nichts davon. Der Mehrbedarf wird zu Wärme und Stromkosten.',
    ],
  }),

  // ---------- Gesamtwirkungsgrad: Verluste hintereinander ----------

  task({
    id: 'p6', karte: 'kette', stufe: 3, familie: 'kette',
    title: 'Gesamtwirkungsgrad: Motor und Getriebe',
    gen: () => ({ Pzu: pick([2.2, 3, 4, 5.5, 7.5, 11]), e1: pick([0.85, 0.88, 0.9]), e2: pick([0.9, 0.95, 0.97]) }),
    draw: (p) => B.fluss([['Motor', `η_1 = ${fmt(p.e1, 2)}`], ['Getriebe', `η_2 = ${fmt(p.e2, 2)}`]], [`P_zu = ${fmt(p.Pzu, 1)} kW`, '', 'P_ab = ?']),
    text: (p) => `Ein Motor mit η_1 = ${fmt(p.e1, 2)} treibt ein Getriebe mit η_2 = ${fmt(p.e2, 2)} an. Der Motor nimmt ${w('P_zu = ' + fmt(p.Pzu, 1) + ' kW')} auf. Berechne a) den Gesamtwirkungsgrad η_ges und b) die Leistung P_ab am Getriebeausgang.`,
    asks: (p) => [
      { k: 'a) η_ges', unit: '', v: p.e1 * p.e2 },
      { k: 'b) P_ab', unit: 'kW', v: p.Pzu * p.e1 * p.e2 },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.e1 + p.e2) / 2, msg: 'Du hast den Mittelwert gerechnet. Die Wirkungsgrade werden multipliziert: η_ges = η_1 · η_2.' },
      { ask: 1, v: p.Pzu * p.e1, msg: 'Du hast nur den Motor gerechnet. Das Getriebe verliert auch noch etwas.' },
    ],
    tipps: () => ['Die Leistung fliesst nacheinander durch Motor und Getriebe.', 'Einzelne Wirkungsgrade werden multipliziert: η_ges = η_1 · η_2.', 'P_ab = η_ges · P_zu'],
    loesung: (p) => [
      `Gesamtwirkungsgrad: ${eq('η_ges = η_1 · η_2 = ' + fmt(p.e1, 2) + ' · ' + fmt(p.e2, 2) + ' = ' + fmt(p.e1 * p.e2, 3))}`,
      `Abgegebene Leistung: ${eq(w('P_ab') + ' = η_ges · ' + w('P_zu') + ' = ' + fmt(p.e1 * p.e2, 3) + ' · ' + fmt(p.Pzu, 1) + ' kW')}`,
      `Resultat: ${eq(w('P_ab = ' + d2(p.Pzu * p.e1 * p.e2) + ' kW'))}`,
      'Typischer Fehler: Wirkungsgrade addieren. Der Gesamtwirkungsgrad ist immer kleiner als der kleinste Einzelwert.',
    ],
  }),

  task({
    id: 'p15', karte: 'kette', stufe: 3, familie: 'kette', src: 'Kreativ · Kette mit drei Gliedern',
    title: 'Seilwinde: Motor, Getriebe, Trommel',
    gen: () => ({ e1: pick([0.9, 0.92]), e2: pick([0.95, 0.97]), e3: pick([0.9, 0.92, 0.95]), m: pick([500, 800, 1000]), v: pick([0.2, 0.25, 0.4, 0.5]) }),
    draw: (p) => B.fluss([['Motor', `η_1 = ${fmt(p.e1, 2)}`], ['Getriebe', `η_2 = ${fmt(p.e2, 2)}`], ['Trommel', `η_3 = ${fmt(p.e3, 2)}`]], ['P_zu = ?', '', '', `v = ${fmt(p.v, 2)} m/s`]),
    text: (p) => `Eine Seilwinde hebt eine Last mit m = ${p.m} kg gleichmässig mit ${w('v = ' + fmt(p.v, 2) + ' m/s')}. Die Kette hat drei Glieder: Motor η_1 = ${fmt(p.e1, 2)}, Getriebe η_2 = ${fmt(p.e2, 2)}, Trommel η_3 = ${fmt(p.e3, 2)}. Berechne a) η_ges, b) die Hubleistung P_ab in kW und c) die Motorleistung P_zu in kW. (g = 9,81 m/s²)`,
    asks: (p) => {
      const eg = p.e1 * p.e2 * p.e3, Pab = (p.m * g * p.v) / 1000;
      return [
        { k: 'a) η_ges', unit: '', v: eg },
        { k: 'b) P_ab', unit: 'kW', v: Pab },
        { k: 'c) P_zu', unit: 'kW', v: Pab / eg },
      ];
    },
    fehler: (p) => {
      const eg = p.e1 * p.e2 * p.e3, Pab = (p.m * g * p.v) / 1000;
      return [
        { ask: 0, v: (p.e1 + p.e2 + p.e3) / 3, msg: 'Du hast den Mittelwert gerechnet. Alle drei Wirkungsgrade werden multipliziert.' },
        { ask: 1, v: (p.m * p.v) / 1000, msg: 'Du hast g vergessen. Die Last hat die Kraft F_G = m · g, und P = F · v.' },
        { ask: 2, v: Pab * eg, msg: 'Du hast mit η_ges multipliziert. P_zu muss grösser sein als P_ab: P_zu = P_ab : η_ges.' },
      ];
    },
    tipps: () => ['Rechne vom Ausgang her: Die Last braucht P_ab = F_G · v.', 'η_ges = η_1 · η_2 · η_3. Dann P_zu = P_ab : η_ges.', 'F_G = m · g in N. P_ab in W durch 1000 gibt kW.'],
    loesung: (p) => {
      const eg = p.e1 * p.e2 * p.e3, Pab = (p.m * g * p.v) / 1000;
      return [
        `Gesamtwirkungsgrad: ${eq('η_ges = ' + fmt(p.e1, 2) + ' · ' + fmt(p.e2, 2) + ' · ' + fmt(p.e3, 2) + ' = ' + fmt(eg, 3))}`,
        `Hubleistung: ${eq(w('P_ab') + ' = ' + f('F_G') + ' · v = ' + fmt(p.m * g) + ' N · ' + fmt(p.v, 2) + ' m/s = ' + w(d2(Pab) + ' kW'))}`,
        `Motorleistung: ${eq(w('P_zu') + ' = ' + w('P_ab') + ' : η_ges = ' + d2(Pab) + ' kW : ' + fmt(eg, 3) + ' = ' + w(d2(Pab / eg) + ' kW'))}`,
        'Jedes Glied verliert etwas. Darum wählt man den Motor etwas stärker, als die Last allein braucht.',
      ];
    },
  }),

  task({
    id: 'p16', karte: 'kette', stufe: 3, familie: 'umgekehrt', src: 'Kreativ · Umgekehrt gefragt',
    title: 'Welcher Motorwirkungsgrad fehlt?',
    gen: () => ({ e1: pick([0.8, 0.85, 0.9]), e2: pick([0.9, 0.95]), Pzu: pick([4, 6, 8]) }),
    draw: (p) => B.fluss([['Motor', 'η_1 = ?'], ['Getriebe', `η_2 = ${fmt(p.e2, 2)}`]], [`P_zu = ${p.Pzu} kW`, '', `η_ges = ${fmt(p.e1 * p.e2, 3)}`]),
    text: (p) => `Eine Antriebskette aus Motor und Getriebe hat den Gesamtwirkungsgrad η_ges = ${fmt(p.e1 * p.e2, 3)}. Das Getriebe hat η_2 = ${fmt(p.e2, 2)}. Der Motor nimmt ${w('P_zu = ' + p.Pzu + ' kW')} auf. Berechne a) den Wirkungsgrad η_1 des Motors und b) die gesamte Verlustleistung in kW.`,
    asks: (p) => [
      { k: 'a) η_1', unit: '', v: p.e1 },
      { k: 'b) Verlust', unit: 'kW', v: p.Pzu * (1 - p.e1 * p.e2) },
    ],
    fehler: (p) => [
      { ask: 0, v: p.e1 * p.e2 * p.e2, msg: 'Du hast multipliziert. Um ein Glied herauszurechnen, teilst du: η_1 = η_ges : η_2.' },
      { ask: 1, v: p.Pzu * p.e1 * p.e2, msg: 'Das ist die abgegebene Leistung. Der Verlust ist der Rest: P_zu − P_ab.' },
    ],
    tipps: () => ['Es gilt η_ges = η_1 · η_2. Stelle nach η_1 um.', 'η_1 = η_ges : η_2', 'Verlust = P_zu · (1 − η_ges)'],
    loesung: (p) => [
      `Umstellen: ${eq('η_1 = η_ges : η_2 = ' + fmt(p.e1 * p.e2, 3) + ' : ' + fmt(p.e2, 2) + ' = ' + w(fmt(p.e1, 2)))}`,
      `Abgabe: ${eq(w('P_ab') + ' = η_ges · ' + w('P_zu') + ' = ' + d2(p.Pzu * p.e1 * p.e2) + ' kW')}`,
      `Verlust: ${eq(w('P_zu') + ' − ' + w('P_ab') + ' = ' + p.Pzu + ' − ' + d2(p.Pzu * p.e1 * p.e2) + ' = ' + w(d2(p.Pzu * (1 - p.e1 * p.e2)) + ' kW'))}`,
    ],
  }),

  // ---------- Energie und Kosten ----------

  task({
    id: 'p17', karte: 'kosten', stufe: 1, familie: 'rechnen',
    title: 'Heizofen: Leistung mal Zeit',
    gen: () => ({ P: pick([1.5, 2, 2.5, 3]), t: pick([2, 3, 4, 5]) }),
    draw: (p) => B.fluss([['Heizofen', 'η = 1']], [`P = ${fmt(p.P, 1)} kW`, 'Wärme'], { loss: ['kein Verlust'] }),
    text: (p) => `Ein Heizofen hat die Leistung ${w('P = ' + fmt(p.P, 1) + ' kW')} und läuft t = ${p.t} h. Berechne a) die Energie W in kWh und b) die Energie in MJ. (1 kWh = 3,6 MJ)`,
    asks: (p) => [
      { k: 'a) W', unit: 'kWh', v: p.P * p.t },
      { k: 'b) W', unit: 'MJ', v: p.P * p.t * 3.6 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.P / p.t, msg: 'Du hast geteilt. Energie ist Leistung mal Zeit: W = P · t.' },
      { ask: 1, v: (p.P * p.t) / 3.6, msg: 'Du hast durch 3,6 geteilt. Von kWh nach MJ multiplizierst du mit 3,6.' },
    ],
    tipps: () => ['Energie ist Leistung mal Zeit.', 'W = P · t. Mit P in kW und t in h kommt kWh heraus.', '1 kWh = 3,6 MJ'],
    loesung: (p) => [
      `Energie: ${eq(w('W') + ' = P · t = ' + fmt(p.P, 1) + ' kW · ' + p.t + ' h = ' + w(fmt(p.P * p.t) + ' kWh'))}`,
      `In MJ: ${eq(fmt(p.P * p.t) + ' kWh · 3,6 = ' + w(fmt(p.P * p.t * 3.6) + ' MJ'))}`,
      'Das ist die Arbeit, die der Zähler misst. Darum rechnet man Stromkosten mit kWh.',
    ],
  }),

  task({
    id: 'p13', karte: 'kosten', stufe: 2, familie: 'rechnen',
    title: 'Was kostet der Motor pro Tag?',
    gen: () => ({ Pab: pick([2, 3, 4, 5.5]), eta: pick([0.8, 0.85, 0.9]), t: pick([4, 6, 8]), pr: pick([0.15, 0.2, 0.25]) }),
    draw: (p) => B.fluss([['Motor', `η = ${fmt(p.eta, 2)}`]], ['P_zu = ?', `P_ab = ${fmt(p.Pab, 1)} kW`]),
    text: (p) => `Ein Motor gibt ${w('P_ab = ' + fmt(p.Pab, 1) + ' kW')} ab. Sein Wirkungsgrad ist η = ${fmt(p.eta, 2)}. Er läuft t = ${p.t} h pro Tag. Eine kWh Strom kostet ${fmt(p.pr, 2)} Fr. Berechne a) P_zu in kW, b) die bezogene Energie in kWh, c) die Stromkosten pro Tag in Fr.`,
    asks: (p) => {
      const Pzu = p.Pab / p.eta;
      return [
        { k: 'a) P_zu', unit: 'kW', v: Pzu },
        { k: 'b) W_zu', unit: 'kWh', v: Pzu * p.t },
        { k: 'c) Kosten', unit: 'Fr.', v: Pzu * p.t * p.pr },
      ];
    },
    fehler: (p) => {
      const Pzu = p.Pab / p.eta;
      return [
        { ask: 0, v: p.Pab * p.eta, msg: 'Du hast mit η multipliziert. Bezogen wird mehr, als abgegeben wird: P_zu = P_ab : η.' },
        { ask: 1, v: p.Pab * p.t, msg: 'Du hast die abgegebene Leistung genommen. Bezahlt wird die zugeführte Energie, also mit P_zu.' },
        { ask: 2, v: Pzu * p.t / p.pr, msg: 'Du hast durch den Preis geteilt. Kosten = Energie in kWh mal Preis pro kWh.' },
      ];
    },
    tipps: () => ['Bezahlt wird, was der Motor aus dem Netz bezieht. Das ist P_zu.', 'P_zu = P_ab : η. Dann W_zu = P_zu · t und Kosten = W_zu · Preis.', 'kW mal h gibt kWh. kWh mal Fr. pro kWh gibt Fr.'],
    loesung: (p) => {
      const Pzu = p.Pab / p.eta;
      return [
        `Zugeführt: ${eq(w('P_zu') + ' = ' + w('P_ab') + ' : η = ' + fmt(p.Pab, 1) + ' : ' + fmt(p.eta, 2) + ' = ' + w(d2(Pzu) + ' kW'))}`,
        `Energie: ${eq(w('W_zu') + ' = ' + w('P_zu') + ' · t = ' + d2(Pzu) + ' kW · ' + p.t + ' h = ' + w(fmt(Pzu * p.t) + ' kWh'))}`,
        `Kosten: ${eq(fmt(Pzu * p.t) + ' kWh · ' + fmt(p.pr, 2) + ' Fr./kWh = ' + w(d2(Pzu * p.t * p.pr) + ' Fr.'))}`,
        `Ohne Verluste wären es ${d2(p.Pab * p.t * p.pr)} Fr. Der Wirkungsgrad kostet täglich ${d2(Pzu * p.t * p.pr - p.Pab * p.t * p.pr)} Fr.`,
      ];
    },
  }),
];
