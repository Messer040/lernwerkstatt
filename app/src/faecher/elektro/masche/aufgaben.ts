// Aufgaben zum Kapitel Masche mit mehreren Quellen.
// Farben im Text: Erzeugerspannung blau (l), Teilspannung magenta (f), Strom grün (m).
import { task, type Task } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import { schaltung } from './bilder';

const ue = l; // Erzeugerspannung
const ut = f; // Teilspannung
const st = m; // Strom

type R3 = { r1: number; r2: number; r3: number };
const quellen = () => ({ u1: pick([12, 15, 24]), u2: pick([3, 6, 9]) });
const widerst = (): R3 => ({ r1: rng(100, 400, 10), r2: rng(100, 300, 10), r3: rng(100, 300, 10) });
const Rg = (p: R3) => p.r1 + p.r2 + p.r3;
/** Strom in mA aus Spannung in V und Widerstand in Ω */
const mA = (u: number, r: number) => (u / r) * 1000;
/** Strom in A als Text */
const A = (u: number, r: number) => fmt(u / r, 4);
const mische = (n: number) => {
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

let buchwerte = true;

export const AUFGABEN: Task[] = [
  task({
    id: 'e1', karte: 'reihe', stufe: 1, familie: 'rechnen',
    title: 'Drei Widerstände in Reihe',
    gen: () => ({ u: pick([6, 9, 12, 24]), ...widerst() }),
    draw: (p) => schaltung({ u01: `U01 = ${p.u} V`, r1: `${p.r1} Ω`, r2: `${p.r2} Ω`, r3: `${p.r3} Ω`, strom: 'I = ?' }),
    text: (p) => `Eine Quelle mit ${ue('U01 = ' + p.u + ' V')} speist drei Widerstände in Reihe: R1 = ${p.r1} Ω, R2 = ${p.r2} Ω und R3 = ${p.r3} Ω. Berechne a) den Gesamtwiderstand R und b) den Strom I.`,
    asks: (p) => [
      { k: 'a) R', unit: 'Ω', v: Rg(p) },
      { k: 'b) I', unit: 'mA', v: mA(p.u, Rg(p)) },
    ],
    fehler: (p) => [
      { ask: 0, v: 1 / (1 / p.r1 + 1 / p.r2 + 1 / p.r3), msg: 'Das ist die Formel für die Parallelschaltung. In Reihe addierst du die Widerstände.' },
      { ask: 1, v: mA(p.u, p.r1), msg: 'Du hast nur mit R1 gerechnet. Der Strom fliesst durch alle drei Widerstände. Nimm den Gesamtwiderstand.' },
    ],
    tipps: () => [
      'In einer Reihenschaltung addierst du die Widerstände.',
      'R = R1 + R2 + R3. Danach das Ohmsche Gesetz: I = U : R.',
      'Rechne den Strom zuerst in A. Danach in mA: 1 A = 1000 mA.',
    ],
    loesung: (p) => [
      `Gesamtwiderstand: ${eq('R = R1 + R2 + R3 = ' + p.r1 + ' Ω + ' + p.r2 + ' Ω + ' + p.r3 + ' Ω = ' + fmt(Rg(p)) + ' Ω')}`,
      `Ohmsches Gesetz: ${eq(st('I') + ' = ' + ue('U01') + ' : R')}`,
      `Einsetzen: ${eq(st('I') + ' = ' + ue(p.u + ' V') + ' : ' + fmt(Rg(p)) + ' Ω = ' + A(p.u, Rg(p)) + ' A')}`,
      `Resultat: ${eq(st('I = ' + fmt(mA(p.u, Rg(p))) + ' mA'))}`,
    ],
  }),

  task({
    id: 'e2', karte: 'reihe', stufe: 1, familie: 'umgekehrt',
    title: 'Fehlenden Widerstand finden',
    gen: () => {
      const u = pick([6, 9, 12, 15, 24]);
      const i = pick([10, 20, 25, 40, 50]);
      const rg = Math.round((u * 1000) / i);
      const r1 = Math.round((rg * 0.2) / 10) * 10;
      const r2 = Math.round((rg * 0.3) / 10) * 10;
      return { u, i, rg, r1, r2, r3: rg - r1 - r2 };
    },
    draw: (p) => schaltung({ u01: `U01 = ${p.u} V`, r1: `${p.r1} Ω`, r2: `${p.r2} Ω`, r3: '?', strom: `I = ${p.i} mA` }),
    text: (p) => `Eine Quelle mit ${ue('U01 = ' + p.u + ' V')} treibt den Strom ${st('I = ' + p.i + ' mA')} durch drei Widerstände in Reihe. Bekannt sind R1 = ${p.r1} Ω und R2 = ${p.r2} Ω. Berechne a) den Gesamtwiderstand R und b) den Widerstand R3.`,
    asks: (p) => [
      { k: 'a) R', unit: 'Ω', v: p.rg },
      { k: 'b) R3', unit: 'Ω', v: p.r3 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.u * p.i, msg: 'Du hast U mal I gerechnet. Für den Widerstand teilst du U durch I.' },
      { ask: 1, v: p.rg, msg: 'Das ist der Gesamtwiderstand. R1 und R2 musst du noch abziehen.' },
    ],
    tipps: () => [
      'Das Ohmsche Gesetz gilt für die ganze Reihenschaltung: R = U : I.',
      'Rechne den Strom in A: 1 mA = 0,001 A.',
      'R3 = R − R1 − R2',
    ],
    loesung: (p) => [
      `Gesamtwiderstand: ${eq('R = ' + ue('U01') + ' : ' + st('I') + ' = ' + p.u + ' V : ' + fmt(p.i / 1000, 3) + ' A = ' + fmt(p.rg) + ' Ω')}`,
      `In Reihe gilt: ${eq('R = R1 + R2 + R3')}. Umgestellt: ${eq('R3 = R − R1 − R2')}`,
      `Einsetzen: ${eq('R3 = ' + fmt(p.rg) + ' Ω − ' + p.r1 + ' Ω − ' + p.r2 + ' Ω = ' + fmt(p.r3) + ' Ω')}`,
    ],
  }),

  task({
    id: 'e3', karte: 'reihe', stufe: 1, familie: 'schaetzen',
    title: 'Gesamtwiderstand schätzen',
    gen: () => ({ r1: pick([2.2, 4.7, 10]), r2: pick([22, 47, 100]), ord: mische(4) }),
    text: (p) => `Ein Widerstand mit ${fmt(p.r1)} kΩ und einer mit ${p.r2} Ω liegen in Reihe. Wie gross ist der Gesamtwiderstand ungefähr? Schätze, ohne zu rechnen.`,
    asks: (p) => {
      const opts = [
        `ca. ${fmt(p.r1)} kΩ`,
        `ca. ${p.r2} Ω`,
        `ca. ${fmt(p.r1 + p.r2)} kΩ`,
        `ca. ${fmt(p.r1 / 10)} kΩ`,
      ];
      const why = [
        undefined,
        'Der kleine Widerstand allein ist nicht der Gesamtwert. Der grosse liegt auch im Strompfad.',
        'Du hast kΩ und Ω einfach zusammengezählt. Zuerst die Einheiten gleich machen.',
        'In Reihe ist der Gesamtwiderstand nie kleiner als der grösste Einzelwiderstand.',
      ];
      return [{ kind: 'choice', k: 'Gesamtwiderstand', opts: p.ord.map((i: number) => opts[i]), a: p.ord.indexOf(0), why: p.ord.map((i: number) => why[i]) }];
    },
    tipps: () => [
      'In Reihe addierst du die Widerstände.',
      'Rechne beide in dieselbe Einheit. 1 kΩ = 1000 Ω.',
      'Der kleine Widerstand ist im Vergleich fast vernachlässigbar.',
    ],
    loesung: (p) => [
      `In Reihe addierst du: ${eq('R = R1 + R2')}`,
      `Gleiche Einheit: ${eq(fmt(p.r1 * 1000) + ' Ω + ' + p.r2 + ' Ω = ' + fmt(p.r1 * 1000 + p.r2) + ' Ω')}`,
      `Das sind etwa ${fmt(p.r1)} kΩ. Der kleine Widerstand ändert fast nichts.`,
    ],
  }),

  task({
    id: 'e4', karte: 'masche', stufe: 1, familie: 'bild',
    title: 'Polung der Quellen im Bild erkennen',
    gen: () => ({ ...quellen(), gleich: Math.random() < 0.5 }),
    draw: (p) => schaltung({ u01: `U01 = ${p.u1} V`, u02: `U02 = ${p.u2} V`, gleich: p.gleich, r1: '', r2: '', r3: '' }),
    text: () => `Das Bild zeigt zwei Quellen in einer Masche. Die blauen Pfeile zeigen, in welche Richtung jede Quelle den Strom antreibt. Sind die Quellen gleich oder entgegengesetzt gepolt? Berechne danach die Summe der Erzeugerspannungen ΣU0.`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Polung', opts: ['gleich gepolt', 'entgegengesetzt gepolt'], a: p.gleich ? 0 : 1,
        why: p.gleich
          ? [undefined, 'Beide Pfeile laufen im Uhrzeigersinn um die Masche. Sie wirken in dieselbe Richtung.']
          : ['Hier zeigt ein Pfeil gegen die Umlaufrichtung M. Die Quellen ziehen gegeneinander.', undefined],
      },
      { k: 'b) ΣU0', unit: 'V', v: p.gleich ? p.u1 + p.u2 : p.u1 - p.u2 },
    ],
    fehler: (p) => [
      p.gleich
        ? { ask: 1, v: p.u1 - p.u2, msg: 'Du hast subtrahiert. Beide Pfeile zeigen in dieselbe Richtung: Die Spannungen addieren sich.' }
        : { ask: 1, v: p.u1 + p.u2, msg: 'Du hast addiert. Ein Pfeil zeigt gegen M: Die kleinere Spannung wird abgezogen.' },
    ],
    tipps: () => [
      'Schau, in welche Richtung jeder blaue Pfeil im Vergleich zu M zeigt.',
      'Gleiche Richtung: ΣU0 = U01 + U02. Gegenrichtung: ΣU0 = U01 − U02.',
      'Zeigt ein Pfeil gegen M, zählt seine Spannung negativ.',
    ],
    loesung: (p) => [
      p.gleich
        ? 'Beide Pfeile laufen im Uhrzeigersinn, wie M. Die Quellen sind gleich gepolt.'
        : 'U01 läuft im Uhrzeigersinn, U02 dagegen. Die Quellen sind entgegengesetzt gepolt.',
      `Formel: ${eq(ue('ΣU0') + ' = ' + ue('U01') + (p.gleich ? ' + ' : ' − ') + ue('U02'))}`,
      `Einsetzen: ${eq(ue('ΣU0') + ' = ' + p.u1 + ' V' + (p.gleich ? ' + ' : ' − ') + p.u2 + ' V = ' + fmt(p.gleich ? p.u1 + p.u2 : p.u1 - p.u2) + ' V')}`,
    ],
  }),

  task({
    id: 'e5', karte: 'masche', stufe: 2, familie: 'rechnen',
    title: 'Zwei Quellen: Strom gleich und entgegengesetzt',
    src: 'Aufgabe 7, Bild 2 (S. 49)',
    gen: () => {
      if (buchwerte) {
        buchwerte = false;
        return { u1: 12, u2: 6, r1: 270, r2: 120, r3: 180 };
      }
      return { ...quellen(), ...widerst() };
    },
    draw: (p) => schaltung({ u01: `U01 = ${p.u1} V`, u02: `U02 = ${p.u2} V`, gleich: true, r1: `${p.r1} Ω`, r2: `${p.r2} Ω`, r3: `${p.r3} Ω`, strom: 'I = ?' }),
    text: (p) => `Zwei Quellen mit ${ue('U01 = ' + p.u1 + ' V')} und ${ue('U02 = ' + p.u2 + ' V')} liegen mit R1 = ${p.r1} Ω, R2 = ${p.r2} Ω und R3 = ${p.r3} Ω in einer Masche. Die Innenwiderstände sind vernachlässigbar. Berechne den Strom I, wenn die Quellen a) gleich und b) entgegengesetzt gepolt sind.`,
    asks: (p) => [
      { k: 'a) I (gleich gepolt)', unit: 'mA', v: mA(p.u1 + p.u2, Rg(p)) },
      { k: 'b) I (entgegengesetzt)', unit: 'mA', v: mA(p.u1 - p.u2, Rg(p)) },
    ],
    fehler: (p) => [
      { ask: 0, v: mA(p.u1 - p.u2, Rg(p)), msg: 'Du hast die Quellen subtrahiert. Gleich gepolt heisst: Die Spannungen addieren sich.' },
      { ask: 1, v: mA(p.u1 + p.u2, Rg(p)), msg: 'Du hast die Quellen addiert. Entgegengesetzt gepolt heisst: U02 wird von U01 abgezogen.' },
    ],
    tipps: () => [
      'Die Masche hat nur einen Strom I. Er hängt von ΣU0 und vom Gesamtwiderstand R ab.',
      'R = R1 + R2 + R3. Dann ΣU0 = U01 ± U02 und I = ΣU0 : R.',
      'Rechne den Strom in A und danach in mA.',
    ],
    loesung: (p) => {
      const R = Rg(p);
      const a = p.u1 + p.u2, b = p.u1 - p.u2;
      return [
        `Gesamtwiderstand: ${eq('R = ' + p.r1 + ' Ω + ' + p.r2 + ' Ω + ' + p.r3 + ' Ω = ' + fmt(R) + ' Ω')}`,
        `a) gleich gepolt: ${eq(ue('ΣU0') + ' = ' + p.u1 + ' V + ' + p.u2 + ' V = ' + a + ' V')}`,
        `${eq(st('I') + ' = ' + a + ' V : ' + fmt(R) + ' Ω = ' + A(a, R) + ' A = ' + st(fmt(mA(a, R)) + ' mA'))}`,
        `b) entgegengesetzt: ${eq(ue('ΣU0') + ' = ' + p.u1 + ' V − ' + p.u2 + ' V = ' + b + ' V')}`,
        `${eq(st('I') + ' = ' + b + ' V : ' + fmt(R) + ' Ω = ' + A(b, R) + ' A = ' + st(fmt(mA(b, R)) + ' mA'))}`,
        'Beim Umpolen ändern sich nur die Quellen. Die Widerstände bleiben gleich.',
      ];
    },
    loesungsbild: (p) => {
      const R = Rg(p), b = p.u1 - p.u2, I = b / R;
      return schaltung({
        u01: `U01 = ${p.u1} V`, u02: `U02 = ${p.u2} V`, gleich: false,
        r1: `${p.r1} Ω`, r2: `${p.r2} Ω`, r3: `${p.r3} Ω`,
        strom: `I = ${fmt(I * 1000)} mA`,
        abfall: [`U1 = ${fmt(I * p.r1)} V`, `U2 = ${fmt(I * p.r2)} V`, `U3 = ${fmt(I * p.r3)} V`],
      }, 'Fall b: entgegengesetzt gepolt, mit Teilspannungen');
    },
  }),

  task({
    id: 'e6', karte: 'masche', stufe: 2, familie: 'waswaere',
    title: 'Was passiert beim Umpolen?',
    gen: () => ({ ...quellen(), ...widerst(), ord: mische(4) }),
    draw: (p) => schaltung({ u01: `U01 = ${p.u1} V`, u02: `U02 = ${p.u2} V`, gleich: true, r1: `${p.r1} Ω`, r2: `${p.r2} Ω`, r3: `${p.r3} Ω`, strom: 'I' }),
    text: (p) => `Zwei gleich gepolte Quellen mit ${ue('U01 = ' + p.u1 + ' V')} und ${ue('U02 = ' + p.u2 + ' V')} treiben den Strom ${st('I')} durch R1 = ${p.r1} Ω, R2 = ${p.r2} Ω und R3 = ${p.r3} Ω. Dann polt jemand die Quelle U02 um.`,
    asks: (p) => {
      const opts = ['I wird kleiner', 'I bleibt gleich', 'I wird grösser', 'I wird null'];
      const why = [
        undefined,
        'Die Widerstände ändern sich nicht. Aber ΣU0 ändert sich: von U01 + U02 auf U01 − U02.',
        'Entgegengesetzt gepolt ziehen die Quellen gegeneinander. ΣU0 wird kleiner, nicht grösser.',
        'I wäre nur null, wenn U01 gleich U02 wäre. Hier ist U01 grösser.',
      ];
      return [
        { kind: 'choice', k: 'a) Was passiert mit I?', opts: p.ord.map((i: number) => opts[i]), a: p.ord.indexOf(0), why: p.ord.map((i: number) => why[i]) },
        { k: 'b) I nach dem Umpolen', unit: 'mA', v: mA(p.u1 - p.u2, Rg(p)) },
      ];
    },
    fehler: (p) => [{ ask: 1, v: mA(p.u1 + p.u2, Rg(p)), msg: 'Das ist der Strom vor dem Umpolen. Nach dem Umpolen zählt U02 negativ.' }],
    tipps: () => [
      'Beim Umpolen ändert sich die Richtung des Pfeils von U02. Die Widerstände bleiben gleich.',
      'Vorher ΣU0 = U01 + U02. Nachher ΣU0 = U01 − U02.',
      'I = ΣU0 : R. Eine kleinere Summe gibt einen kleineren Strom.',
    ],
    loesung: (p) => {
      const R = Rg(p), v = p.u1 + p.u2, n = p.u1 - p.u2;
      return [
        `Vorher: ${eq(ue('ΣU0') + ' = ' + v + ' V')}, also ${eq(st('I') + ' = ' + fmt(mA(v, R)) + ' mA')}`,
        `Nachher: ${eq(ue('ΣU0') + ' = ' + p.u1 + ' V − ' + p.u2 + ' V = ' + n + ' V')}`,
        `Einsetzen: ${eq(st('I') + ' = ' + n + ' V : ' + fmt(R) + ' Ω = ' + st(fmt(mA(n, R)) + ' mA'))}`,
        'Der Strom wird kleiner, weil die Quellen jetzt gegeneinander arbeiten.',
      ];
    },
  }),

  task({
    id: 'e7', karte: 'masche', stufe: 3, familie: 'umgekehrt',
    title: 'Fehlende Quellenspannung berechnen',
    gen: () => {
      for (;;) {
        const r = widerst();
        const R = Rg(r);
        const i = pick([10, 15, 20, 25, 30]);
        const ud = +((i * R) / 1000).toFixed(2);
        const u2 = pick([3, 4, 6, 9]);
        if (Math.abs(ud - u2) < 0.15 * u2 + 0.3) continue;
        return { ...r, i, ud, u2, u1: +(ud + u2).toFixed(2) };
      }
    },
    draw: (p) => schaltung({ u01: `U01 = ${fmt(p.u1, 2)} V`, u02: 'U02 = ?', gleich: false, r1: `${p.r1} Ω`, r2: `${p.r2} Ω`, r3: `${p.r3} Ω`, strom: `I = ${p.i} mA` }),
    text: (p) => `Zwei Quellen sind entgegengesetzt gepolt. Bekannt sind ${ue('U01 = ' + fmt(p.u1, 2) + ' V')}, R1 = ${p.r1} Ω, R2 = ${p.r2} Ω, R3 = ${p.r3} Ω und der Strom ${st('I = ' + p.i + ' mA')}. Wie gross ist die Spannung U02?`,
    asks: (p) => [{ k: 'U02', unit: 'V', v: p.u2 }],
    fehler: (p) => [
      { ask: 0, v: p.ud, msg: 'Das ist nur die Summe der Teilspannungen (ΣU0). Zieh sie von U01 ab: U02 = U01 − ΣU0.' },
      { ask: 0, v: p.u1 + p.ud, msg: 'Du hast addiert. Entgegengesetzt gepolt heisst: U01 − U02 = ΣU0.' },
    ],
    tipps: () => [
      'Aus dem Strom und den Widerständen kennst du die Summe aller Teilspannungen: ΣU0 = I · R.',
      'Entgegengesetzt gepolt gilt: ΣU0 = U01 − U02.',
      'Stelle um: U02 = U01 − I · R.',
    ],
    loesung: (p) => [
      `Gesamtwiderstand: ${eq('R = ' + p.r1 + ' Ω + ' + p.r2 + ' Ω + ' + p.r3 + ' Ω = ' + fmt(Rg(p)) + ' Ω')}`,
      `Summe der Teilspannungen: ${eq(ue('ΣU0') + ' = ' + st('I') + ' · R = ' + fmt(p.i / 1000, 3) + ' A · ' + fmt(Rg(p)) + ' Ω = ' + fmt(p.ud, 2) + ' V')}`,
      `Entgegengesetzt: ${eq(ue('ΣU0') + ' = ' + ue('U01') + ' − ' + ue('U02'))}. Umgestellt: ${eq(ue('U02') + ' = ' + ue('U01') + ' − ' + ue('ΣU0'))}`,
      `Einsetzen: ${eq(ue('U02') + ' = ' + fmt(p.u1, 2) + ' V − ' + fmt(p.ud, 2) + ' V = ' + ue(fmt(p.u2) + ' V'))}`,
    ],
  }),

  task({
    id: 'e8', karte: 'teil', stufe: 2, familie: 'rechnen',
    title: 'Teilspannung U3 an R3',
    gen: () => ({ ...quellen(), ...widerst() }),
    draw: (p) => schaltung({ u01: `U01 = ${p.u1} V`, u02: `U02 = ${p.u2} V`, gleich: true, r1: `${p.r1} Ω`, r2: `${p.r2} Ω`, r3: `${p.r3} Ω`, strom: 'I', abfall: ['U1', 'U2', 'U3 = ?'] }),
    text: (p) => `Zwei Quellen mit ${ue('U01 = ' + p.u1 + ' V')} und ${ue('U02 = ' + p.u2 + ' V')} treiben den Strom durch R1 = ${p.r1} Ω, R2 = ${p.r2} Ω und R3 = ${p.r3} Ω. Berechne die Teilspannung ${ut('U3')} an R3, wenn die Quellen a) gleich und b) entgegengesetzt gepolt sind.`,
    asks: (p) => [
      { k: 'a) U3 (gleich gepolt)', unit: 'V', v: ((p.u1 + p.u2) / Rg(p)) * p.r3 },
      { k: 'b) U3 (entgegengesetzt)', unit: 'V', v: ((p.u1 - p.u2) / Rg(p)) * p.r3 },
    ],
    fehler: (p) => [
      { ask: 0, v: ((p.u1 - p.u2) / Rg(p)) * p.r3, msg: 'Du hast die Quellen subtrahiert. Gleich gepolt heisst: addieren.' },
      { ask: 0, v: ((p.u1 + p.u2) * p.r3) / (p.r1 + p.r2), msg: 'Im Nenner fehlt R3. Der Gesamtwiderstand enthält alle drei Widerstände.' },
      { ask: 1, v: ((p.u1 + p.u2) / Rg(p)) * p.r3, msg: 'Du hast die Quellen addiert. Entgegengesetzt gepolt heisst: U02 abziehen.' },
    ],
    tipps: () => [
      'Du brauchst zuerst den Strom I. Er ist in der ganzen Masche gleich gross.',
      'R = R1 + R2 + R3, dann ΣU0, dann I = ΣU0 : R.',
      'U3 = R3 · I',
    ],
    loesung: (p) => {
      const R = Rg(p), a = p.u1 + p.u2, b = p.u1 - p.u2;
      return [
        `Schritt 1: ${eq('R = ' + p.r1 + ' Ω + ' + p.r2 + ' Ω + ' + p.r3 + ' Ω = ' + fmt(R) + ' Ω')}`,
        `Schritt 2 (a): ${eq(ue('ΣU0') + ' = ' + p.u1 + ' V + ' + p.u2 + ' V = ' + a + ' V')}`,
        `Schritt 3 (a): ${eq(st('I') + ' = ' + a + ' V : ' + fmt(R) + ' Ω = ' + A(a, R) + ' A')}`,
        `Schritt 4 (a): ${eq(ut('U3') + ' = R3 · ' + st('I') + ' = ' + p.r3 + ' Ω · ' + A(a, R) + ' A = ' + ut(fmt((a / R) * p.r3) + ' V'))}`,
        `b) entgegengesetzt: ${eq(ue('ΣU0') + ' = ' + b + ' V')}, ${eq(st('I') + ' = ' + A(b, R) + ' A')}, ${eq(ut('U3') + ' = ' + ut(fmt((b / R) * p.r3) + ' V'))}`,
        `Kurzweg: ${eq(ut('U3') + ' = ' + ue('ΣU0') + ' · R3 : R')}. Die Teilspannung hat denselben Anteil an ΣU0 wie R3 am Gesamtwiderstand.`,
      ];
    },
  }),

  task({
    id: 'e9', karte: 'teil', stufe: 2, familie: 'rechnen',
    title: 'Alle Teilspannungen und die Probe',
    gen: () => ({ ...quellen(), ...widerst() }),
    draw: (p) => schaltung({ u01: `U01 = ${p.u1} V`, u02: `U02 = ${p.u2} V`, gleich: true, r1: `${p.r1} Ω`, r2: `${p.r2} Ω`, r3: `${p.r3} Ω`, strom: 'I', abfall: ['U1 = ?', 'U2 = ?', 'U3 = ?'] }),
    loesungsbild: (p) => {
      const R = Rg(p), I = (p.u1 + p.u2) / R;
      return schaltung({
        u01: `U01 = ${p.u1} V`, u02: `U02 = ${p.u2} V`, gleich: true,
        r1: `${p.r1} Ω`, r2: `${p.r2} Ω`, r3: `${p.r3} Ω`,
        strom: `I = ${fmt(I * 1000)} mA`,
        abfall: [`U1 = ${fmt(I * p.r1)} V`, `U2 = ${fmt(I * p.r2)} V`, `U3 = ${fmt(I * p.r3)} V`],
      }, 'Alle Teilspannungen');
    },
    text: (p) => `Zwei gleich gepolte Quellen mit ${ue('U01 = ' + p.u1 + ' V')} und ${ue('U02 = ' + p.u2 + ' V')} treiben den Strom durch R1 = ${p.r1} Ω, R2 = ${p.r2} Ω und R3 = ${p.r3} Ω. Berechne die Teilspannungen ${ut('U1')}, ${ut('U2')} und ${ut('U3')}. Prüfe danach: Wie gross ist die Summe U1 + U2 + U3?`,
    asks: (p) => {
      const I = (p.u1 + p.u2) / Rg(p);
      return [
        { k: 'a) U1', unit: 'V', v: I * p.r1 },
        { k: 'b) U2', unit: 'V', v: I * p.r2 },
        { k: 'c) U3', unit: 'V', v: I * p.r3 },
        { k: 'd) U1 + U2 + U3', unit: 'V', v: p.u1 + p.u2 },
      ];
    },
    fehler: (p) => {
      const s = p.u1 + p.u2;
      const msg = 'Das ist die ganze Summe ΣU0. An einem einzelnen Widerstand liegt nur ein Teil davon.';
      return [{ ask: 0, v: s, msg }, { ask: 1, v: s, msg }, { ask: 2, v: s, msg }];
    },
    tipps: () => [
      'Berechne zuerst den Strom I = ΣU0 : R. Er ist überall gleich.',
      'Jede Teilspannung ist Widerstand mal Strom: U1 = R1 · I, U2 = R2 · I, U3 = R3 · I.',
      'Die Summe der Teilspannungen muss genau ΣU0 ergeben. Das ist die Probe.',
    ],
    loesung: (p) => {
      const R = Rg(p), s = p.u1 + p.u2, I = s / R;
      return [
        `Strom: ${eq(st('I') + ' = ' + s + ' V : ' + fmt(R) + ' Ω = ' + A(s, R) + ' A')}`,
        `${eq(ut('U1') + ' = R1 · ' + st('I') + ' = ' + p.r1 + ' Ω · ' + A(s, R) + ' A = ' + ut(fmt(I * p.r1) + ' V'))}`,
        `${eq(ut('U2') + ' = R2 · ' + st('I') + ' = ' + p.r2 + ' Ω · ' + A(s, R) + ' A = ' + ut(fmt(I * p.r2) + ' V'))}`,
        `${eq(ut('U3') + ' = R3 · ' + st('I') + ' = ' + p.r3 + ' Ω · ' + A(s, R) + ' A = ' + ut(fmt(I * p.r3) + ' V'))}`,
        `Probe: ${eq(ut('U1 + U2 + U3') + ' = ' + fmt(I * p.r1) + ' V + ' + fmt(I * p.r2) + ' V + ' + fmt(I * p.r3) + ' V = ' + ue(s + ' V'))}`,
        'Die Maschenregel stimmt: Die Teilspannungen ergeben zusammen ΣU0.',
      ];
    },
  }),

  task({
    id: 'e10', karte: 'teil', stufe: 2, familie: 'fehler',
    title: 'Fehler in der Rechnung finden',
    gen: () => ({ ...quellen(), ...widerst(), ord: mische(4) }),
    text: (p) => {
      const R = Rg(p), falsch = p.u1 - p.u2;
      return `Zwei Quellen sind <b>gleich</b> gepolt: U01 = ${p.u1} V, U02 = ${p.u2} V. Die Widerstände sind R1 = ${p.r1} Ω, R2 = ${p.r2} Ω und R3 = ${p.r3} Ω. Eine Schülerin rechnet: ΣU0 = ${p.u1} V − ${p.u2} V = ${falsch} V und I = ${falsch} V : ${fmt(R)} Ω = ${fmt(mA(falsch, R))} mA. Wo liegt der Fehler? Wie gross ist der richtige Strom?`;
    },
    asks: (p) => {
      const opts = [
        'Gleich gepolte Quellen werden addiert: ΣU0 = U01 + U02.',
        'Der Gesamtwiderstand muss R1 + R2 sein.',
        'Der Strom folgt aus I = ΣU0 · R.',
        'Nichts, die Rechnung stimmt.',
      ];
      const why = [
        undefined,
        'Alle drei Widerstände liegen im Strompfad. R = R1 + R2 + R3.',
        'Das Ohmsche Gesetz heisst I = U : R, nicht U mal R.',
        'Die Quellen sind gleich gepolt. Dann addieren sich ihre Spannungen.',
      ];
      return [
        { kind: 'choice', k: 'a) Fehler', opts: p.ord.map((i: number) => opts[i]), a: p.ord.indexOf(0), why: p.ord.map((i: number) => why[i]) },
        { k: 'b) richtiger Strom I', unit: 'mA', v: mA(p.u1 + p.u2, Rg(p)) },
      ];
    },
    fehler: (p) => [{ ask: 1, v: mA(p.u1 - p.u2, Rg(p)), msg: 'Das ist der falsche Wert der Schülerin. Gleich gepolt: addieren.' }],
    tipps: () => [
      'Prüfe jeden Schritt einzeln: ΣU0, dann R, dann I.',
      'Gleich gepolt heisst: Beide Quellen treiben in dieselbe Richtung.',
      'Dann gilt ΣU0 = U01 + U02.',
    ],
    loesung: (p) => {
      const R = Rg(p), s = p.u1 + p.u2;
      return [
        'Der Gesamtwiderstand R und das Ohmsche Gesetz sind richtig angewendet. Der Fehler steckt in ΣU0.',
        `Gleich gepolt: ${eq(ue('ΣU0') + ' = ' + p.u1 + ' V + ' + p.u2 + ' V = ' + s + ' V')}`,
        `${eq(st('I') + ' = ' + s + ' V : ' + fmt(R) + ' Ω = ' + st(fmt(mA(s, R)) + ' mA'))}`,
      ];
    },
  }),

  task({
    id: 'e11', karte: 'teil', stufe: 1, familie: 'begruenden',
    title: 'Warum ist der Strom überall gleich?',
    gen: () => ({ ord: mische(4) }),
    draw: () => schaltung({ u01: 'U01', u02: 'U02', gleich: true, r1: '', r2: '', r3: '', strom: 'I' }),
    text: () => `In der Masche mit zwei Quellen und drei Widerständen ist der Strom ${st('I')} an jeder Stelle gleich gross. Warum?`,
    asks: (p) => {
      const opts = [
        'Die Masche hat keine Verzweigung. Der Strom hat nur einen Weg.',
        'Weil alle Widerstände gleich gross sind.',
        'Weil nur die grössere Quelle den Strom bestimmt.',
        'Weil im ersten Widerstand die Hälfte des Stroms verbraucht wird.',
      ];
      const why = [
        undefined,
        'Die Widerstände dürfen verschieden gross sein. Der Strom bleibt trotzdem gleich.',
        'Beide Quellen wirken zusammen. Ihre Summe ΣU0 bestimmt den Strom.',
        'Strom wird nicht verbraucht. Er fliesst im Kreis weiter. Verbraucht wird Spannung.',
      ];
      return [{ kind: 'choice', k: 'Begründung', opts: p.ord.map((i: number) => opts[i]), a: p.ord.indexOf(0), why: p.ord.map((i: number) => why[i]) }];
    },
    tipps: () => [
      'Denke an einen Wasserkreislauf ohne Abzweigung.',
      'Was in einen Widerstand hineinfliesst, fliesst auch wieder heraus.',
      'Strom verschwindet nicht. Nur die Spannung nimmt Schritt für Schritt ab.',
    ],
    loesung: () => [
      'Die Masche ist ein geschlossener Kreis ohne Verzweigung.',
      'Jede Ladung muss durch alle Bauteile hintereinander. Es gibt keinen anderen Weg.',
      `Darum gilt überall derselbe Strom ${st('I')}. Die Teilspannungen sind verschieden, weil die Widerstände verschieden sind.`,
    ],
  }),

  task({
    id: 'e12', karte: 'kombi', stufe: 3, familie: 'waswaere',
    title: 'Was wäre wenn R3 doppelt so gross wäre?',
    gen: () => ({ ...quellen(), ...widerst() }),
    draw: (p) => schaltung({ u01: `U01 = ${p.u1} V`, u02: `U02 = ${p.u2} V`, gleich: true, r1: `${p.r1} Ω`, r2: `${p.r2} Ω`, r3: `${p.r3} Ω`, strom: 'I' }),
    text: (p) => `Zwei gleich gepolte Quellen mit ${ue('U01 = ' + p.u1 + ' V')} und ${ue('U02 = ' + p.u2 + ' V')} treiben den Strom durch R1 = ${p.r1} Ω, R2 = ${p.r2} Ω und R3 = ${p.r3} Ω. Jetzt wird R3 durch einen doppelt so grossen Widerstand ersetzt. Berechne a) den neuen Gesamtwiderstand, b) den neuen Strom und c) die neue Teilspannung ${ut('U3')}.`,
    asks: (p) => {
      const R = Rg(p) + p.r3, s = p.u1 + p.u2;
      return [
        { k: 'a) neues R', unit: 'Ω', v: R },
        { k: 'b) neuer Strom I', unit: 'mA', v: mA(s, R) },
        { k: 'c) neue Teilspannung U3', unit: 'V', v: (s / R) * 2 * p.r3 },
      ];
    },
    fehler: (p) => {
      const s = p.u1 + p.u2;
      return [
        { ask: 1, v: mA(s, Rg(p)), msg: 'Das ist der alte Strom. Mit dem grösseren R3 ist der Gesamtwiderstand grösser und der Strom kleiner.' },
        { ask: 2, v: 2 * (s / Rg(p)) * p.r3, msg: 'Du hast die alte Teilspannung einfach verdoppelt. Aber auch der Strom hat sich geändert.' },
        { ask: 0, v: 2 * Rg(p), msg: 'Nur R3 wird doppelt so gross, nicht alle Widerstände.' },
      ];
    },
    tipps: () => [
      'Nur R3 ändert sich. Die Quellen und R1, R2 bleiben gleich.',
      'Neues R3 = 2 · R3. Dann alles neu: R, I, U3.',
      'U3 = neues R3 · neuer Strom.',
    ],
    loesung: (p) => {
      const R = Rg(p) + p.r3, s = p.u1 + p.u2, I = s / R;
      return [
        `Neues R3: ${eq('2 · ' + p.r3 + ' Ω = ' + 2 * p.r3 + ' Ω')}`,
        `a) ${eq('R = ' + p.r1 + ' Ω + ' + p.r2 + ' Ω + ' + 2 * p.r3 + ' Ω = ' + fmt(R) + ' Ω')}`,
        `b) ${eq(st('I') + ' = ' + ue(s + ' V') + ' : ' + fmt(R) + ' Ω = ' + A(s, R) + ' A = ' + st(fmt(I * 1000) + ' mA'))}`,
        `c) ${eq(ut('U3') + ' = ' + 2 * p.r3 + ' Ω · ' + A(s, R) + ' A = ' + ut(fmt(I * 2 * p.r3) + ' V'))}`,
        'Der Strom sinkt, aber U3 steigt trotzdem: R3 bekommt einen grösseren Anteil von ΣU0.',
      ];
    },
  }),
];
