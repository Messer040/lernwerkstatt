// Aufgaben zum Kapitel Reibung: Haftreibung, Gleitreibung, Rollreibung, schiefe Ebene, Reibmoment.
import { task, type Task } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { fmt, pick, rng } from '../../../core/zahl';
import * as B from './bilder';

const g = 9.81;
const rad = (d: number) => (d * Math.PI) / 180;
const b = (t: string) => `<b>${t}</b>`;
const r2 = (x: number) => Math.round(x * 100) / 100;

export const AUFGABEN: Task[] = [
  // ---------- Gleiten: Haft- und Gleitreibung ----------

  task({
    id: 'r1', karte: 'gleiten', stufe: 1, familie: 'rechnen',
    title: 'Kiste auf dem Boden: Reibungskraft',
    gen: () => ({ m: rng(20, 120, 10), mu: pick([0.15, 0.2, 0.25, 0.3, 0.4, 0.5]) }),
    draw: (p) => B.kisteBoden({ m: `m = ${p.m} kg`, F: 'F', FG: 'F_G', FN: 'F_N', FR: 'F_R = ?', mu: `μ = ${fmt(p.mu, 2)}` }),
    text: (p) => `Eine Kiste mit m = ${p.m} kg wird über einen waagrechten Boden gezogen. Die Gleitreibungszahl ist ${b('μ = ' + fmt(p.mu, 2))}. Berechne a) die Normalkraft F_N und b) die Reibungskraft F_R. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) F_N', unit: 'N', v: p.m * g },
      { k: 'b) F_R', unit: 'N', v: p.mu * p.m * g },
    ],
    fehler: (p) => [
      { ask: 0, v: p.m, msg: 'Du hast die Masse als Kraft genommen. Die Gewichtskraft ist F_G = m · g.' },
      { ask: 1, v: p.mu * p.m, msg: 'Du hast g vergessen. Erst F_N = m · g rechnen, dann mal μ.' },
      { ask: 1, v: (p.m * g) / p.mu, msg: 'Du hast durch μ geteilt. Die Reibungskraft ist F_R = μ · F_N.' },
    ],
    tipps: () => [
      'Auf waagrechtem Boden ist die Normalkraft gleich der Gewichtskraft.',
      'F_N = F_G = m · g. Danach F_R = μ · F_N.',
      'Rechne zuerst F_N in Newton. Dann multiplizierst du mit μ.',
    ],
    loesung: (p) => [
      `Normalkraft: ${eq(f('F_N') + ' = ' + f('F_G') + ' = m · g = ' + p.m + ' kg · 9,81 m/s² = ' + f(fmt(p.m * g) + ' N'))}`,
      `Formel: ${eq(f('F_R') + ' = μ · ' + f('F_N'))}`,
      `Einsetzen: ${eq(f('F_R') + ' = ' + fmt(p.mu, 2) + ' · ' + fmt(p.m * g) + ' N')}`,
      `Resultat: ${eq(f('F_R = ' + fmt(p.mu * p.m * g) + ' N'))}`,
      'Die Reibungskraft wirkt immer gegen die Bewegung. Die Grösse der Auflagefläche spielt keine Rolle.',
    ],
  }),

  task({
    id: 'r2', karte: 'gleiten', stufe: 1, familie: 'umgekehrt',
    title: 'Reibungszahl bestimmen',
    gen: () => {
      const FN = rng(200, 900, 50);
      return { FN, FR: Math.round(FN * pick([0.12, 0.18, 0.24, 0.3, 0.36, 0.42])) };
    },
    draw: (p) => B.kisteBoden({ F: `F = ${p.FR} N`, FG: 'F_G', FN: `F_N = ${p.FN} N`, FR: 'F_R', mu: 'μ = ?' }),
    text: (p) => `Ein Maschinenschlitten drückt mit ${f('F_N = ' + p.FN + ' N')} auf seine Führung. Für eine gleichmässige Bewegung braucht es die Zugkraft ${f('F = ' + p.FR + ' N')}. Wie gross ist die Reibungszahl μ?`,
    asks: (p) => [{ k: 'μ', unit: '', v: p.FR / p.FN }],
    fehler: (p) => [
      { ask: 0, v: p.FN / p.FR, msg: 'Verkehrt herum. Die Reibungszahl ist F_R : F_N und liegt unter 1.' },
      { ask: 0, v: p.FR * p.FN, msg: 'Du hast multipliziert. Für μ musst du die Reibungskraft durch die Normalkraft teilen.' },
    ],
    tipps: () => [
      'Bei gleichmässiger Bewegung ist die Zugkraft gleich der Reibungskraft.',
      'F_R = μ · F_N. Stelle nach μ um.',
      'μ = F_R : F_N. Die Einheit Newton kürzt sich weg.',
    ],
    loesung: (p) => [
      `Gleichmässige Bewegung: ${eq(f('F_R') + ' = ' + f('F') + ' = ' + p.FR + ' N')}`,
      `Umstellen: ${eq('μ = ' + f('F_R') + ' : ' + f('F_N'))}`,
      `Einsetzen: ${eq('μ = ' + p.FR + ' N : ' + p.FN + ' N')}`,
      `Resultat: ${eq('μ = ' + fmt(p.FR / p.FN, 2))}`,
      'Die Reibungszahl hat keine Einheit.',
    ],
  }),

  task({
    id: 'r3', karte: 'gleiten', stufe: 2, familie: 'rechnen',
    title: 'Haftreibung und Gleitreibung',
    gen: () => {
      const m0 = pick([0.3, 0.4, 0.5, 0.6]);
      return { m: rng(50, 200, 10), mu0: m0, mu: r2(m0 - pick([0.1, 0.15, 0.2])) };
    },
    draw: (p) => B.kisteBoden({ m: `m = ${p.m} kg`, F: 'F = ?', FG: 'F_G', FN: 'F_N', FR: 'F_R', mu: `μ₀ = ${fmt(p.mu0, 2)} · μ = ${fmt(p.mu, 2)}` }),
    text: (p) => `Eine Maschine mit m = ${p.m} kg steht auf dem Hallenboden. Die Haftreibungszahl ist ${b('μ₀ = ' + fmt(p.mu0, 2))}, die Gleitreibungszahl ${b('μ = ' + fmt(p.mu, 2))}. Berechne a) die Kraft zum Losreissen und b) die Kraft zum Weiterschieben. (g = 9,81 m/s²)`,
    asks: (p) => [
      { k: 'a) Losreissen', unit: 'N', v: p.mu0 * p.m * g },
      { k: 'b) Weiterschieben', unit: 'N', v: p.mu * p.m * g },
    ],
    fehler: (p) => [
      { ask: 0, v: p.mu * p.m * g, msg: 'Du hast die Gleitreibungszahl genommen. Zum Losreissen gilt die Haftreibungszahl μ₀.' },
      { ask: 1, v: p.mu0 * p.m * g, msg: 'Du hast die Haftreibungszahl genommen. Sobald die Maschine rutscht, gilt die Gleitreibungszahl μ.' },
    ],
    tipps: () => [
      'Zuerst die Normalkraft: F_N = m · g.',
      'Losreissen: Haftreibung überwinden, also mit μ₀ rechnen.',
      'Weiterschieben: Gleitreibung, also mit μ rechnen.',
    ],
    loesung: (p) => {
      const FN = p.m * g;
      return [
        `Normalkraft: ${eq(f('F_N') + ' = m · g = ' + p.m + ' kg · 9,81 m/s² = ' + f(fmt(FN) + ' N'))}`,
        `Losreissen (Haftreibung): ${eq(f('F') + ' = μ₀ · ' + f('F_N') + ' = ' + fmt(p.mu0, 2) + ' · ' + fmt(FN) + ' N = ' + f(fmt(p.mu0 * FN) + ' N'))}`,
        `Weiterschieben (Gleitreibung): ${eq(f('F') + ' = μ · ' + f('F_N') + ' = ' + fmt(p.mu, 2) + ' · ' + fmt(FN) + ' N = ' + f(fmt(p.mu * FN) + ' N'))}`,
        'Das Anschieben ist am schwersten. Rutscht die Maschine einmal, geht es leichter.',
      ];
    },
  }),

  task({
    id: 'r4', karte: 'gleiten', stufe: 2, familie: 'rechnen',
    title: 'Werkstück im Schraubstock',
    gen: () => ({ FN: rng(2000, 8000, 500), mu: pick([0.12, 0.15, 0.2, 0.25]) }),
    draw: (p) => B.klemm(p),
    text: (p) => `Ein Werkstück ist zwischen zwei Backen gespannt. Jede Backe drückt mit ${f('F_N = ' + p.FN + ' N')}. Die Haftreibungszahl ist ${b('μ₀ = ' + fmt(p.mu, 2))}. Welche Kraft F kann man am Werkstück höchstens ziehen, bevor es rutscht?`,
    asks: (p) => [{ k: 'F', unit: 'N', v: 2 * p.mu * p.FN }],
    fehler: (p) => [
      { ask: 0, v: p.mu * p.FN, msg: 'Du hast nur eine Reibfläche gerechnet. Das Werkstück berührt zwei Backen.' },
      { ask: 0, v: 2 * p.FN, msg: 'Du hast μ₀ vergessen. Die Reibungskraft ist μ₀ · F_N je Fläche.' },
    ],
    tipps: () => [
      'Das Werkstück hat zwei Reibflächen: links und rechts.',
      'An jeder Fläche wirkt F_R = μ₀ · F_N.',
      'F = 2 · μ₀ · F_N',
    ],
    loesung: (p) => [
      `Reibungskraft an einer Backe: ${eq(f('F_R') + ' = μ₀ · ' + f('F_N') + ' = ' + fmt(p.mu, 2) + ' · ' + p.FN + ' N = ' + f(fmt(p.mu * p.FN) + ' N'))}`,
      `Zwei Reibflächen halten das Werkstück: ${eq(f('F') + ' = 2 · ' + f('F_R'))}`,
      `Resultat: ${eq(f('F = ' + fmt(2 * p.mu * p.FN) + ' N'))}`,
      'Zähle immer, wie viele Flächen reiben.',
    ],
  }),

  task({
    id: 'rb1', karte: 'gleiten', stufe: 1, familie: 'rechnen', src: 'Buch Reibung, Nr. 1',
    title: 'Ladestation: Palette anschieben',
    gen: () => ({ FG: pick([2500, 3500, 4200]), mu0: pick([0.12, 0.15, 0.2]), mu: pick([0.06, 0.08, 0.1]) }),
    draw: (p) => B.palette(p, { mu: `μ₀ = ${fmt(p.mu0)}, μ = ${fmt(p.mu)}` }),
    text: (p) => `In einer Ladestation werden Werkstücke auf Paletten gespannt. Die Gesamtlast ist ${f('F_G = ' + p.FG + ' N')}. Wie gross ist a) die Kraft zum Anschieben aus der Ruhe bei μ₀ = ${fmt(p.mu0)} und b) die Kraft zum Weiterschieben bei μ = ${fmt(p.mu)}?`,
    asks: (p) => [
      { k: 'a) F anschieben', unit: 'N', v: p.mu0 * p.FG },
      { k: 'b) F weiterschieben', unit: 'N', v: p.mu * p.FG },
    ],
    fehler: (p) => [
      { ask: 0, v: p.mu * p.FG, msg: 'Du hast die Gleitreibungszahl genommen. Zum Anschieben aus der Ruhe gilt μ₀.' },
      { ask: 1, v: p.mu0 * p.FG, msg: 'Du hast die Haftreibungszahl genommen. Beim Weiterschieben gilt die kleinere Gleitreibungszahl μ.' },
    ],
    tipps: () => [
      'Waagrechte Fläche: F_N = F_G.',
      'Anschieben: Haftreibung μ₀. Weiterschieben: Gleitreibung μ.',
      'F = μ · F_G, einmal mit μ₀ und einmal mit μ.',
    ],
    loesung: (p) => [
      `a) ${eq(f('F') + ' = μ₀ · ' + f('F_N') + ' = ' + fmt(p.mu0) + ' · ' + p.FG + ' = ' + f(fmt(p.mu0 * p.FG) + ' N'))}`,
      `b) ${eq(f('F') + ' = μ · ' + f('F_N') + ' = ' + fmt(p.mu) + ' · ' + p.FG + ' = ' + f(fmt(p.mu * p.FG) + ' N'))}`,
      'Losreissen braucht mehr Kraft als Weiterschieben.',
    ],
  }),

  task({
    id: 'rb5', karte: 'gleiten', stufe: 2, familie: 'umgekehrt', src: 'Buch Reibung, Nr. 5',
    title: 'Reibschlüssige Schraubenverbindung',
    gen: () => ({ F: pick([2, 3.2, 4, 5]), mu: pick([0.15, 0.2]), n: pick([2, 3]) }),
    draw: (p) => B.schraubenverbindung(p),
    text: (p) => `Zwei Flachstäbe 80 × 12 werden mit ${f('F = ' + fmt(p.F) + ' kN')} auf Zug belastet. Die Stäbe liegen überlappt aufeinander, es gibt also eine Reibfläche. Die Zugkraft soll nur durch Reibung übertragen werden. Wie gross muss die Spannkraft F_N je Schraube mindestens sein? μ = ${fmt(p.mu)}, ${p.n} Schrauben.`,
    asks: (p) => [{ k: 'F_N je Schraube', unit: 'N', v: (p.F * 1000) / (p.mu * p.n) }],
    fehler: (p) => [
      { ask: 0, v: (p.F * 1000) / p.mu, msg: 'Das ist die Spannkraft aller Schrauben zusammen. Teile noch durch die Anzahl Schrauben.' },
      { ask: 0, v: (p.F * 1000 * p.mu) / p.n, msg: 'Du hast mit μ multipliziert. Die Spannkraft ist F : μ, denn F = μ · F_N.' },
    ],
    tipps: () => [
      'Die Reibungskraft muss mindestens so gross sein wie die Zugkraft: F_R = F.',
      'F_R = μ · F_N,gesamt. Stelle nach F_N,gesamt um.',
      'F_N,gesamt = F : μ. Dann durch die Anzahl Schrauben teilen. F in N einsetzen.',
    ],
    loesung: (p) => [
      `${eq(f('F_N,gesamt') + ' = ' + fmt(p.F * 1000) + ' N : ' + fmt(p.mu) + ' = ' + fmt((p.F * 1000) / p.mu) + ' N')}`,
      `${eq(f('F_N') + ' = ' + fmt((p.F * 1000) / p.mu) + ' : ' + p.n + ' = ' + f(fmt((p.F * 1000) / (p.mu * p.n)) + ' N'))} je Schraube`,
      'Mit zwei Reibflächen (Laschen oben und unten) würde die halbe Spannkraft reichen.',
      'Warnung: Zu wenig Vorspannung lässt die Stäbe rutschen. Dann tragen die Schrauben auf Abscherung und können versagen.',
    ],
  }),

  task({
    id: 'cr5', karte: 'gleiten', stufe: 1, familie: 'schaetzen', src: 'Kreativ · Abschätzen, ohne Taschenrechner',
    title: 'Kiste verschieben im Kopf',
    gen: () => {
      const mu0 = pick([0.3, 0.4, 0.5]);
      return { m: pick([20, 40, 50, 80, 100]), mu0, mu: r2(mu0 - pick([0.1, 0.15, 0.2])) };
    },
    draw: (p) => B.palette({ FG: p.m * 10 }, { FG: `m = ${p.m} kg`, mu: `μ₀ = ${fmt(p.mu0)}, μ = ${fmt(p.mu)}` }),
    text: (p) => `Ohne Taschenrechner, mit g ≈ 10 m/s²: Eine Kiste mit m = ${p.m} kg steht auf dem Boden. Die Haftreibungszahl ist μ₀ = ${fmt(p.mu0)}, die Gleitreibungszahl μ = ${fmt(p.mu)}. Mit welcher Kraft musst du sie a) losreissen und b) weiterschieben?`,
    asks: (p) => [
      { k: 'a) F₀', unit: 'N', v: p.mu0 * p.m * 10, tol: 0.03 },
      { k: 'b) F', unit: 'N', v: p.mu * p.m * 10, tol: 0.03 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.m * 10, msg: 'Das ist nur die Gewichtskraft. Mal μ₀ fehlt noch.' },
      { ask: 1, v: p.mu0 * p.m * 10, msg: 'Du hast μ₀ genommen. Beim Weiterschieben gilt μ.' },
    ],
    tipps: (p) => [
      `Zuerst die Gewichtskraft schätzen: F_G ≈ m · 10.`,
      `F_G ≈ ${p.m * 10} N. Dann mal μ₀ bzw. μ.`,
      'Rechne im Kopf: Mal 0,4 heisst mal 4 und durch 10.',
    ],
    loesung: (p) => [
      `${eq('F_G ≈ ' + p.m + ' · 10 = ' + p.m * 10 + ' N')}`,
      `a) ${eq(fmt(p.mu0) + ' · ' + p.m * 10 + ' = ' + fmt(p.mu0 * p.m * 10) + ' N')}, b) ${eq(fmt(p.mu) + ' · ' + p.m * 10 + ' = ' + fmt(p.mu * p.m * 10) + ' N')}`,
      'Mit g = 9,81 wären die Werte knapp 2 % kleiner. Zum Abschätzen reicht g ≈ 10.',
    ],
  }),

  task({
    id: 'r6', karte: 'gleiten', stufe: 2, familie: 'waswaere', src: 'Kreativ · Was wäre wenn',
    title: 'Was wäre wenn: Kiste hochkant',
    gen: () => ({ m: pick([30, 40, 60, 80]), mu: pick([0.2, 0.3, 0.4]), k: pick([2, 3]) }),
    draw: (p) => B.kistenPaar({ m: `m = ${p.m} kg` }),
    text: (p) => `Eine Kiste mit m = ${p.m} kg liegt flach auf dem Boden. Du stellst sie hochkant. Die Auflagefläche wird dadurch ${p.k}-mal kleiner. Die Gleitreibungszahl bleibt ${b('μ = ' + fmt(p.mu))}. a) Was passiert mit der Reibungskraft? b) Wie gross ist sie nach dem Aufstellen? (g = 9,81 m/s²)`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Reibungskraft', opts: ['wird kleiner', 'bleibt gleich', 'wird grösser'], a: 1,
        why: [
          `Die Fläche wird ${p.k}-mal kleiner, aber auch der Druck steigt. Die Reibungskraft hängt nur von F_N und μ ab.`,
          undefined,
          'Die Fläche wird nicht grösser. Und die Reibungskraft hängt nicht von ihr ab.',
        ],
      },
      { k: 'b) F_R', unit: 'N', v: p.mu * p.m * g },
    ],
    fehler: (p) => [
      { ask: 1, v: (p.mu * p.m * g) / p.k, msg: `Du hast durch ${p.k} geteilt. Die Auflagefläche spielt für die Reibungskraft keine Rolle.` },
      { ask: 1, v: p.mu * p.m * g * p.k, msg: `Du hast mit ${p.k} multipliziert. Die Auflagefläche spielt für die Reibungskraft keine Rolle.` },
    ],
    tipps: () => [
      'Welche Grössen stehen in F_R = μ · F_N? Kommt die Fläche vor?',
      'F_N ist die Gewichtskraft. Sie bleibt gleich, μ auch.',
      'F_R = μ · m · g, wie vorher.',
    ],
    loesung: (p) => [
      `${eq(f('F_R') + ' = μ · m · g = ' + fmt(p.mu) + ' · ' + p.m + ' kg · 9,81 m/s² = ' + f(fmt(p.mu * p.m * g) + ' N'))}`,
      'Die Auflagefläche kommt in der Formel nicht vor. Flach oder hochkant: Die Reibungskraft ist gleich.',
      'Hochkant kippt die Kiste aber leichter. Das ist ein anderes Thema.',
    ],
  }),

  // ---------- Schräge: Reibung auf der schiefen Ebene ----------

  task({
    id: 'rbx2', karte: 'schraege', stufe: 2, familie: 'rechnen', src: 'Buch Reibung, 2. Beispiel',
    title: 'Paket auf dem Förderband',
    gen: () => ({ FG: pick([80, 120, 150, 200]), al: pick([15, 20, 25]), mu: pick([0.5, 0.6, 0.7]) }),
    draw: (p) => B.ebene(p, { FG: `F_G = ${p.FG} N`, comp: [60, 70], al: `α = ${p.al}°`, FR: 'F_R' }),
    text: (p) => `Ein Förderband transportiert Pakete mit ${f('F_G = ' + p.FG + ' N')} nach oben. Das Band ist um ${p.al}° geneigt. Wie gross sind a) die Normalkraft F_N und b) die Reibungskraft F_R bei μ = ${fmt(p.mu)}?`,
    asks: (p) => {
      const FN = p.FG * Math.cos(rad(p.al));
      return [{ k: 'a) F_N', unit: 'N', v: FN }, { k: 'b) F_R', unit: 'N', v: p.mu * FN }];
    },
    fehler: (p) => [
      { ask: 0, v: p.FG * Math.sin(rad(p.al)), msg: 'Das ist die Hangabtriebskraft. Die Normalkraft steht senkrecht auf der Fläche: F_G · cos α.' },
      { ask: 0, v: p.FG, msg: 'Auf der Schräge ist F_N kleiner als F_G. Rechne F_G · cos α.' },
      { ask: 1, v: p.mu * p.FG * Math.sin(rad(p.al)), msg: 'Du hast F_G · sin α als Normalkraft genommen. Das ist die Hangabtriebskraft.' },
    ],
    tipps: () => [
      'Auf der schiefen Ebene ist F_N kleiner als F_G: F_N = F_G · cos α.',
      'Zuerst F_N, dann F_R = μ · F_N.',
      'Der Winkel liegt zwischen F_G und F_N. Darum cos.',
    ],
    loesung: (p) => {
      const FN = p.FG * Math.cos(rad(p.al));
      return [
        `a) ${eq(f('F_N') + ' = ' + p.FG + ' N · cos ' + p.al + '° = ' + f(fmt(FN) + ' N'))}`,
        `b) ${eq(f('F_R') + ' = ' + fmt(p.mu) + ' · ' + fmt(FN) + ' = ' + f(fmt(p.mu * FN) + ' N'))}`,
        'Hier zieht die Reibung das Paket mit nach oben. Ohne Reibung würde es zurückrutschen.',
      ];
    },
  }),

  task({
    id: 'cr1', karte: 'schraege', stufe: 2, familie: 'rechnen', src: 'Kreativ · Neue Situation',
    title: 'Lieferwagen auf der Rampe',
    gen: () => ({ m: pick([2000, 2500, 3000]), al: pick([10, 12, 15]), mu0: pick([0.5, 0.6, 0.7]) }),
    draw: (p) => B.ebene({ al: p.al }, { FG: 'F_G', comp: [55, 70], al: `α = ${p.al}°`, m: `m = ${p.m} kg`, mu: `μ₀ = ${fmt(p.mu0)} (Reifen auf Asphalt)` }),
    text: (p) => `Ein Lieferwagen (m = ${p.m} kg) steht mit angezogener Handbremse auf einer Rampe mit ${p.al}° Neigung. Die blockierten Reifen haften mit μ₀ = ${fmt(p.mu0)}. g = 9,81 m/s². Berechne a) die Hangabtriebskraft F_H, b) die grösste Haftreibungskraft F_R,max und c) die Sicherheit gegen Rutschen S = F_R,max : F_H.`,
    asks: (p) => {
      const G = p.m * g, a = rad(p.al);
      return [
        { k: 'a) F_H', unit: 'N', v: G * Math.sin(a) },
        { k: 'b) F_R,max', unit: 'N', v: p.mu0 * G * Math.cos(a) },
        { k: 'c) S', unit: '', v: p.mu0 / Math.tan(a) },
      ];
    },
    fehler: (p) => {
      const G = p.m * g, a = rad(p.al);
      return [
        { ask: 0, v: G * Math.cos(a), msg: 'Das ist die Normalkraft. Die Hangabtriebskraft ist F_G · sin α.' },
        { ask: 1, v: p.mu0 * G * Math.sin(a), msg: 'Du hast sin statt cos genommen. Die Reibung hängt von der Normalkraft F_G · cos α ab.' },
        { ask: 2, v: Math.tan(a) / p.mu0, msg: 'Verkehrt herum. S ist die Haltekraft geteilt durch die Hangabtriebskraft.' },
      ];
    },
    tipps: () => [
      'F_G = m · g. Dann in Hangabtrieb und Normalkraft zerlegen.',
      'F_H = F_G · sin α, F_N = F_G · cos α, F_R,max = μ₀ · F_N.',
      'S > 1 heisst: Der Wagen bleibt stehen.',
    ],
    loesung: (p) => {
      const G = p.m * g, a = rad(p.al), FH = G * Math.sin(a), FR = p.mu0 * G * Math.cos(a);
      return [
        `${eq(f('F_G') + ' = ' + p.m + ' · 9,81 = ' + fmt(G) + ' N')}`,
        `a) ${eq(f('F_H') + ' = ' + fmt(G) + ' · sin ' + p.al + '° = ' + f(fmt(FH) + ' N'))}`,
        `b) ${eq(f('F_R,max') + ' = ' + fmt(p.mu0) + ' · ' + fmt(G) + ' · cos ' + p.al + '° = ' + f(fmt(FR) + ' N'))}`,
        `c) ${eq('S = ' + fmt(FR) + ' : ' + fmt(FH) + ' = ' + fmt(FR / FH, 2))}`,
        'Es gilt S = μ₀ : tan α. Die Masse kürzt sich weg. Ein leerer und ein voller Wagen sind gleich sicher.',
        'Warnung: Auf Eis sinkt μ₀ auf etwa 0,1. Dann rutscht der Wagen schon bei kleinen Neigungen. Es besteht Unfallgefahr.',
      ];
    },
  }),

  task({
    id: 'cr2', karte: 'schraege', stufe: 2, familie: 'umgekehrt', src: 'Kreativ · Umgekehrt gefragt',
    title: 'Förderband: Wie steil darf es sein?',
    gen: () => ({ mu0: pick([0.4, 0.5, 0.6, 0.7]), FG: pick([80, 120, 200]) }),
    draw: (p) => B.ebene({ al: (Math.atan(p.mu0) * 180) / Math.PI }, { FG: `F_G = ${p.FG} N`, comp: [60, 70], al: 'α = ?' }),
    text: (p) => `Pakete (${f('F_G = ' + p.FG + ' N')}) sollen auf einem Förderband nicht zurückrutschen. Die Haftreibungszahl ist μ₀ = ${fmt(p.mu0)}. Bei welchem Neigungswinkel α beginnen sie gerade zu rutschen? Wie gross ist dann die Hangabtriebskraft?`,
    asks: (p) => {
      const a = Math.atan(p.mu0);
      return [{ k: 'α', unit: '°', v: (a * 180) / Math.PI }, { k: 'F_H', unit: 'N', v: p.FG * Math.sin(a) }];
    },
    fehler: (p) => [
      { ask: 0, v: (Math.asin(p.mu0) * 180) / Math.PI, msg: 'Du hast sin α = μ₀ gesetzt. Richtig ist tan α = μ₀.' },
      { ask: 1, v: p.FG * p.mu0, msg: 'Du hast F_G · μ₀ gerechnet. Die Hangabtriebskraft ist F_G · sin α.' },
    ],
    tipps: () => [
      'Grenzfall: Hangabtriebskraft = grösste Haftreibungskraft.',
      'F_G · sin α = μ₀ · F_G · cos α. F_G kürzt sich weg.',
      'tan α = μ₀. Mit der Taste tan⁻¹ auf dem Rechner.',
    ],
    loesung: (p) => {
      const a = Math.atan(p.mu0);
      return [
        `Grenzfall: ${eq('F_H = F_R,max')}`,
        `${eq('F_G · sin α = μ₀ · F_G · cos α')} ⇒ ${eq('tan α = μ₀ = ' + fmt(p.mu0))}`,
        `${eq('α = ' + fmt((a * 180) / Math.PI, 1) + '°')}`,
        `${eq(f('F_H') + ' = ' + p.FG + ' · sin ' + fmt((a * 180) / Math.PI, 1) + '° = ' + f(fmt(p.FG * Math.sin(a)) + ' N'))}`,
        'Das Gewicht spielt für den Winkel keine Rolle. Nur μ₀ zählt.',
      ];
    },
  }),

  task({
    id: 'rb6', karte: 'schraege', stufe: 3, familie: 'kette', src: 'Buch Reibung, Nr. 6',
    title: 'Bohreinheit auf der Schräge',
    gen: () => ({ FG: pick([1200, 1500, 2000]), Ff: pick([1200, 1800, 2400]), al: pick([20, 30]), mu: pick([0.05, 0.07, 0.1]), d: pick([120, 142]) }),
    draw: (p) => B.ebene(p, { FG: `F_G = ${p.FG} N`, F: 'F = ?', al: `α = ${p.al}°`, m: `F_f = ${p.Ff} N (Vorschubkraft)`, mu: `μ = ${fmt(p.mu)}, Zahnrad d = ${p.d} mm` }),
    text: (p) => `Eine Bohreinheit (${f('F_G = ' + p.FG + ' N')}) fährt auf einer um ${p.al}° geneigten Führung nach oben. Beim Bohren wirkt die Vorschubkraft ${f('F_f = ' + p.Ff + ' N')} parallel zur Führung gegen die Bewegung. Sie wird über Zahnrad (${l('d = ' + p.d + ' mm')}) und Zahnstange angetrieben. Wie gross sind a) die Umfangskraft am Zahnrad bei μ = ${fmt(p.mu)} und b) das Antriebsmoment?`,
    asks: (p) => {
      const a = rad(p.al), F = p.Ff + p.FG * Math.sin(a) + p.mu * p.FG * Math.cos(a);
      return [{ k: 'a) F_u', unit: 'N', v: F }, { k: 'b) M', unit: 'Nm', v: (F * p.d) / 2000 }];
    },
    fehler: (p) => {
      const a = rad(p.al), F = p.Ff + p.FG * Math.sin(a) + p.mu * p.FG * Math.cos(a);
      return [
        { ask: 0, v: p.Ff + p.mu * p.FG * Math.cos(a), msg: 'Du hast die Hangabtriebskraft F_G · sin α vergessen. Die Einheit fährt bergauf.' },
        { ask: 0, v: p.Ff + p.FG * Math.sin(a) - p.mu * p.FG * Math.cos(a), msg: 'Die Reibung wirkt gegen die Bewegung, also gegen die Fahrtrichtung. Beim Aufwärtsfahren addierst du sie.' },
        { ask: 1, v: (F * p.d) / 1000, msg: 'Du hast den Durchmesser als Hebelarm genommen. Der Hebelarm ist der Radius d : 2.' },
      ];
    },
    tipps: () => [
      'Drei Kräfte wirken gegen die Bewegung: Vorschubkraft, Hangabtriebskraft und Reibung.',
      'F_H = F_G · sin α, F_N = F_G · cos α, F_R = μ · F_N.',
      'F_u = F_f + F_H + F_R, M = F_u · d : 2 mit d in m.',
    ],
    loesung: (p) => {
      const a = rad(p.al), FH = p.FG * Math.sin(a), FN = p.FG * Math.cos(a), FR = p.mu * FN, F = p.Ff + FH + FR;
      return [
        `${eq(f('F_H') + ' = ' + p.FG + ' · sin ' + p.al + '° = ' + fmt(FH) + ' N')}`,
        `${eq(f('F_N') + ' = ' + p.FG + ' · cos ' + p.al + '° = ' + fmt(FN) + ' N')}, ${eq(f('F_R') + ' = ' + fmt(p.mu) + ' · ' + fmt(FN) + ' = ' + fmt(FR) + ' N')}`,
        `a) ${eq(f('F_u') + ' = ' + p.Ff + ' + ' + fmt(FH) + ' + ' + fmt(FR) + ' = ' + f(fmt(F) + ' N'))}`,
        `b) ${eq(m('M') + ' = ' + fmt(F) + ' N · ' + fmt(p.d / 2000, 3) + ' m = ' + m(fmt((F * p.d) / 2000) + ' Nm'))}`,
      ];
    },
  }),

  task({
    id: 'r7', karte: 'schraege', stufe: 2, familie: 'fehler', src: 'Kreativ · Fehler finden',
    title: 'Fehler finden: Lenas Reibungskraft',
    gen: () => ({ FG: pick([400, 500, 800, 1000]), al: pick([20, 25, 30, 35, 40]), mu: pick([0.2, 0.3, 0.4]) }),
    draw: (p) => B.ebene(p, { FG: `F_G = ${p.FG} N`, comp: [60, 70], al: `α = ${p.al}°`, FR: 'F_R', mu: `μ = ${fmt(p.mu)}` }),
    text: (p) => `Lena rechnet die Reibungskraft einer Kiste auf einer schiefen Ebene (${f('F_G = ' + p.FG + ' N')}, α = ${p.al}°, μ = ${fmt(p.mu)}): «F_R = μ · F_G = ${fmt(p.mu)} · ${p.FG} N = ${fmt(p.mu * p.FG)} N». a) Was ist falsch? b) Wie gross ist F_R richtig?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: [
          'Sie hat F_G statt F_N genommen. Auf der Schräge ist F_N = F_G · cos α.',
          'Sie hätte μ durch F_G teilen müssen.',
          'Sie hätte F_G · sin α nehmen müssen.',
          'Nichts, die Rechnung stimmt.',
        ],
        a: 0,
        why: [
          undefined,
          'Die Formel F_R = μ · F_N bleibt. Du multiplizierst, du teilst nicht.',
          'F_G · sin α ist die Hangabtriebskraft, nicht die Normalkraft.',
          'F_R = μ · F_N. Auf der Schräge ist F_N kleiner als F_G. Das stimmt also nicht.',
        ],
      },
      { k: 'b) F_R', unit: 'N', v: p.mu * p.FG * Math.cos(rad(p.al)) },
    ],
    fehler: (p) => [
      { ask: 1, v: p.mu * p.FG, msg: 'Das ist Lenas Wert. Sie hat F_G statt F_N eingesetzt. Rechne mit F_G · cos α.' },
      { ask: 1, v: p.mu * p.FG * Math.sin(rad(p.al)), msg: 'Du hast sin statt cos genommen. F_N = F_G · cos α.' },
    ],
    tipps: () => [
      'Welche Kraft drückt die Kiste auf die Fläche? Das ist F_N.',
      'Auf der Schräge ist F_N kleiner als F_G. Der Winkel α liegt zwischen F_G und F_N.',
      'F_R = μ · F_G · cos α',
    ],
    loesung: (p) => [
      `Lena hat F_G eingesetzt. Auf der Schräge gilt: ${eq(f('F_N') + ' = ' + f('F_G') + ' · cos α')}`,
      `${eq(f('F_R') + ' = μ · ' + f('F_G') + ' · cos α = ' + fmt(p.mu) + ' · ' + p.FG + ' N · cos ' + p.al + '° = ' + f(fmt(p.mu * p.FG * Math.cos(rad(p.al))) + ' N'))}`,
      `Lenas Wert ist ${fmt((1 - Math.cos(rad(p.al))) * 100, 0)} % zu gross.`,
    ],
  }),

  // ---------- Moment: Reibung an Dreh- und Gleitteilen ----------

  task({
    id: 'r5', karte: 'moment', stufe: 3, familie: 'kette',
    title: 'Backenbremse: Bremsmoment',
    gen: () => ({ FN: rng(400, 1500, 100), mu: pick([0.3, 0.35, 0.4, 0.45]), d: pick([200, 250, 300, 400]) }),
    draw: (p) => B.bremse(p),
    loesungsbild: (p) => B.bremse(p, { FR: `F_R = ${fmt(p.mu * p.FN)} N`, M: `M = ${fmt((p.mu * p.FN * p.d) / 2000)} Nm` }),
    text: (p) => `Eine Bremsbacke drückt mit ${f('F_N = ' + p.FN + ' N')} auf eine Bremstrommel mit ${l('d = ' + p.d + ' mm')}. Die Reibungszahl ist ${b('μ = ' + fmt(p.mu, 2))}. Berechne a) die Reibungskraft F_R am Umfang und b) das Bremsmoment M.`,
    asks: (p) => [
      { k: 'a) F_R', unit: 'N', v: p.mu * p.FN },
      { k: 'b) M', unit: 'Nm', v: (p.mu * p.FN * p.d) / 2000 },
    ],
    fehler: (p) => [
      { ask: 1, v: (p.mu * p.FN * p.d) / 1000, msg: 'Du hast den Durchmesser als Hebelarm genommen. Der Hebelarm ist der Radius d : 2.' },
      { ask: 1, v: (p.mu * p.FN * p.d) / 2, msg: 'Das Resultat steht in Nmm, weil d in mm war. Teile durch 1000 für Nm.' },
    ],
    tipps: () => [
      'Zuerst die Reibungskraft: F_R = μ · F_N.',
      'Die Reibungskraft wirkt am Umfang. Sie ist eine Umfangskraft.',
      'M = F_R · d : 2, mit d in m.',
    ],
    loesung: (p) => {
      const FR = p.mu * p.FN;
      return [
        `Reibungskraft: ${eq(f('F_R') + ' = μ · ' + f('F_N') + ' = ' + fmt(p.mu, 2) + ' · ' + p.FN + ' N = ' + f(fmt(FR) + ' N'))}`,
        `Sie greift am Umfang an, gegen die Drehrichtung. Hebelarm: ${eq(l('d : 2 = ' + fmt(p.d / 2000, 3) + ' m'))}`,
        `Bremsmoment: ${eq(m('M') + ' = ' + f('F_R') + ' · ' + l('d : 2') + ' = ' + fmt(FR) + ' N · ' + fmt(p.d / 2000, 3) + ' m')}`,
        `Resultat: ${eq(m('M = ' + fmt((FR * p.d) / 2000) + ' Nm'))}`,
        'Hier kommen zwei Themen zusammen: Reibung und Umfangskraft.',
      ];
    },
  }),

  task({
    id: 'rbx1', karte: 'moment', stufe: 1, familie: 'rechnen', src: 'Buch Reibung, 1. Beispiel',
    title: 'Rutschkupplung',
    gen: () => ({ FN: pick([1.5, 2, 2.4, 3]), mu: pick([0.4, 0.5, 0.67]), d: pick([120, 160, 200]) }),
    draw: (p) => B.rutschkupplung(p),
    text: (p) => `Die Tellerfedern einer Rutschkupplung drücken mit ${f('F_N = ' + fmt(p.FN) + ' kN')} auf die Beläge. Der mittlere Reibdurchmesser ist ${l('ø' + p.d + ' mm')}. Wie gross sind a) die Reibungskraft F_R bei μ = ${fmt(p.mu)} und b) das übertragbare Drehmoment M am Kettenrad? Es gibt zwei Reibflächen.`,
    asks: (p) => {
      const FR = p.mu * p.FN * 1000;
      return [{ k: 'a) F_R', unit: 'N', v: FR }, { k: 'b) M', unit: 'Nm', v: (2 * FR * p.d) / 2000 }];
    },
    fehler: (p) => {
      const FR = p.mu * p.FN * 1000;
      return [
        { ask: 0, v: p.mu * p.FN, msg: 'Du hast kN nicht in N umgerechnet. 1 kN = 1000 N.' },
        { ask: 1, v: (FR * p.d) / 2000, msg: 'Du hast nur eine Reibfläche gerechnet. Die Kupplung hat zwei.' },
        { ask: 1, v: (2 * FR * p.d) / 1000, msg: 'Du hast den Durchmesser als Hebelarm genommen. Der Hebelarm ist der Radius.' },
      ];
    },
    tipps: () => [
      'F_R = μ · F_N. Rechne F_N zuerst in N um.',
      'Jede Reibfläche überträgt M_R = F_R · r. Der Radius ist d : 2.',
      'Zwei Flächen: M = 2 · F_R · r.',
    ],
    loesung: (p) => {
      const FR = p.mu * p.FN * 1000;
      return [
        `a) ${eq(f('F_R') + ' = ' + fmt(p.mu) + ' · ' + fmt(p.FN * 1000) + ' N = ' + f(fmt(FR) + ' N'))}`,
        `b) ${eq(m('M') + ' = 2 · ' + fmt(FR) + ' N · ' + l(fmt(p.d / 2000, 3) + ' m') + ' = ' + m(fmt((2 * FR * p.d) / 2000) + ' Nm'))}`,
        'Wird das Drehmoment grösser, rutscht die Kupplung. So schützt sie die Maschine vor Überlast.',
      ];
    },
  }),

  task({
    id: 'rb2', karte: 'moment', stufe: 1, familie: 'rechnen', src: 'Buch Reibung, Nr. 2',
    title: 'Elektromagnetische Kupplung',
    gen: () => ({ FN: pick([100, 125, 160]), mu: pick([0.4, 0.5, 0.62]), d: pick([70, 85, 100]) }),
    draw: (p) => B.luefter(p),
    text: (p) => `Ein Lüftergebläse wird über eine elektromagnetische Kupplung geschaltet. Wie gross sind bei ${f('F_N = ' + p.FN + ' N')} und μ = ${fmt(p.mu)} a) die Reibungskraft F_R und b) das Reibungsmoment M_R? Der Reibdurchmesser ist ${l('ø' + p.d + ' mm')}. Die Kupplung hat eine Reibfläche.`,
    asks: (p) => {
      const FR = p.mu * p.FN;
      return [{ k: 'a) F_R', unit: 'N', v: FR }, { k: 'b) M_R', unit: 'Nm', v: (FR * p.d) / 2000 }];
    },
    fehler: (p) => [
      { ask: 1, v: (p.mu * p.FN * p.d) / 1000, msg: 'Du hast den Durchmesser als Hebelarm genommen. Der Hebelarm ist der Radius d : 2.' },
      { ask: 1, v: (p.mu * p.FN * p.d) / 2, msg: 'Das Resultat steht in Nmm, weil d in mm war. Teile durch 1000 für Nm.' },
    ],
    tipps: () => [
      'F_R = μ · F_N',
      'M_R = F_R · r, mit r = d : 2.',
      'Der Radius muss in Meter stehen, damit das Resultat in Nm kommt.',
    ],
    loesung: (p) => {
      const FR = p.mu * p.FN;
      return [
        `a) ${eq(f('F_R') + ' = ' + fmt(p.mu) + ' · ' + p.FN + ' = ' + f(fmt(FR) + ' N'))}`,
        `b) ${eq(m('M_R') + ' = ' + fmt(FR) + ' N · ' + fmt(p.d / 2000, 4) + ' m = ' + m(fmt((FR * p.d) / 2000, 3) + ' Nm'))}`,
      ];
    },
  }),

  task({
    id: 'cr3', karte: 'moment', stufe: 2, familie: 'fehler', src: 'Kreativ · Fehler finden',
    title: 'Rutschkupplung: Wo steckt der Fehler?',
    gen: () => ({ FN: pick([1.5, 2, 3]), mu: pick([0.4, 0.5, 0.6]), d: pick([120, 160, 200]) }),
    draw: (p) => B.rutschkupplung(p),
    text: (p) => {
      const FR = p.mu * p.FN * 1000;
      return `Eine Lernende berechnet das übertragbare Drehmoment der Rutschkupplung (zwei Reibflächen, ø${p.d}):<br>Zeile 1: ${eq(f('F_R') + ' = ' + fmt(p.mu) + ' · ' + fmt(p.FN * 1000) + ' N = ' + fmt(FR) + ' N')}<br>Zeile 2: ${eq(m('M') + ' = ' + f('F_R') + ' · d = ' + fmt(FR) + ' N · ' + fmt(p.d / 1000, 2) + ' m = ' + fmt((FR * p.d) / 1000) + ' Nm')}<br>Das Resultat stimmt zufällig. Der Weg ist trotzdem falsch. Finde die zwei Fehler. Wie gross ist M_R je Reibfläche und das gesamte M?`;
    },
    asks: (p) => {
      const FR = p.mu * p.FN * 1000;
      return [{ k: 'M_R je Fläche', unit: 'Nm', v: (FR * p.d) / 2000 }, { k: 'M gesamt', unit: 'Nm', v: (FR * p.d) / 1000 }];
    },
    fehler: (p) => {
      const FR = p.mu * p.FN * 1000;
      return [
        { ask: 0, v: (FR * p.d) / 1000, msg: 'Du hast den Durchmesser als Hebelarm genommen. Der Hebelarm ist der Radius d : 2.' },
        { ask: 1, v: (FR * p.d) / 2000, msg: 'Das ist erst eine Reibfläche. Die Kupplung hat zwei.' },
      ];
    },
    tipps: () => [
      'Welcher Hebelarm gehört in M_R = F_R · ? Der Radius oder der Durchmesser?',
      'Wie viele Reibflächen hat die Kupplung? Wie viele hat Zeile 2 gezählt?',
      'M_R = F_R · d : 2 je Fläche. M = 2 · M_R.',
    ],
    loesung: (p) => {
      const FR = p.mu * p.FN * 1000;
      return [
        'Fehler 1: Der Hebelarm ist der Radius r = d : 2, nicht d.',
        'Fehler 2: Die zwei Reibflächen fehlen. M = 2 · F_R · r.',
        `${eq(m('M_R') + ' = ' + fmt(FR) + ' · ' + fmt(p.d / 2000, 3) + ' = ' + m(fmt((FR * p.d) / 2000) + ' Nm'))} je Fläche`,
        `${eq(m('M') + ' = 2 · ' + fmt((FR * p.d) / 2000) + ' = ' + m(fmt((FR * p.d) / 1000) + ' Nm'))}`,
        'Die zwei Fehler heben sich hier auf, weil d = 2 · r. Bei einer Kupplung mit nur einer Reibfläche wäre das Resultat doppelt zu gross.',
      ];
    },
  }),

  task({
    id: 'rb7', karte: 'moment', stufe: 3, familie: 'kette', src: 'Buch Reibung, Nr. 7',
    title: 'Getriebewelle in Gleitlagern',
    gen: () => ({ F1: pick([12, 18, 20]), F2: pick([10, 13.5, 15]), a: 450, b: 680, l: 1580, dA: 100, dB: 125, mu: pick([0.05, 0.06, 0.08]) }),
    draw: (p) => B.getriebewelle(p),
    loesungsbild: (p) => {
      const FB = (p.F1 * p.a + p.F2 * (p.a + p.b)) / p.l;
      return B.getriebewelle(p, { FA: `F_A = ${fmt(p.F1 + p.F2 - FB, 2)} kN`, FB: `F_B = ${fmt(FB, 2)} kN` });
    },
    text: (p) => `Die Zwischenwelle eines Grossgetriebes ist in Gleitlagern gelagert. Die Zahnradkräfte sind ${f('F_1 = ' + fmt(p.F1) + ' kN')} und ${f('F_2 = ' + fmt(p.F2) + ' kN')}. Die Lagerzapfen haben ø${p.dA} (A) und ø${p.dB} (B). Wie gross sind a) die Lagerkräfte, b) die Reibungskräfte in A und B bei μ = ${fmt(p.mu)} und c) das gesamte Reibungsmoment?`,
    asks: (p) => {
      const FB = (p.F1 * p.a + p.F2 * (p.a + p.b)) / p.l, FA = p.F1 + p.F2 - FB;
      return [
        { k: 'a) F_A', unit: 'kN', v: FA },
        { k: 'a) F_B', unit: 'kN', v: FB },
        { k: 'b) F_RA', unit: 'N', v: p.mu * FA * 1000 },
        { k: 'b) F_RB', unit: 'N', v: p.mu * FB * 1000 },
        { k: 'c) M_R', unit: 'Nm', v: (p.mu * (FA * 1000 * p.dA + FB * 1000 * p.dB)) / 2000 },
      ];
    },
    fehler: (p) => {
      const FB = (p.F1 * p.a + p.F2 * (p.a + p.b)) / p.l, FA = p.F1 + p.F2 - FB;
      return [
        { ask: 0, v: FB, msg: 'Du hast A und B vertauscht. F_B liegt näher an den beiden Zahnrädern und trägt mehr.' },
        { ask: 2, v: p.mu * FB * 1000, msg: 'Du hast die Lagerkraft von B genommen. In A wirkt F_A.' },
        { ask: 4, v: (p.mu * (FA + FB) * 1000 * p.dA) / 2000, msg: 'Jedes Lager hat seinen eigenen Zapfendurchmesser. Rechne F_RA · r_A + F_RB · r_B.' },
      ];
    },
    tipps: (p) => [
      'Drei Schritte: Lagerkräfte, Reibungskräfte, Reibungsmoment.',
      `a) Drehpunkt in A: F_B · ${p.l} = F_1 · ${p.a} + F_2 · ${p.a + p.b}. b) F_R = μ · F_N je Lager.`,
      'c) M_R = F_RA · r_A + F_RB · r_B. Die Radien sind d : 2 in m.',
    ],
    loesung: (p) => {
      const FB = (p.F1 * p.a + p.F2 * (p.a + p.b)) / p.l, FA = p.F1 + p.F2 - FB, RA = p.mu * FA * 1000, RBf = p.mu * FB * 1000;
      return [
        `a) ${eq(f('F_B') + ' = (' + fmt(p.F1) + ' · ' + p.a + ' + ' + fmt(p.F2) + ' · ' + (p.a + p.b) + ') : ' + p.l + ' = ' + f(fmt(FB, 2) + ' kN'))}, ${eq(f('F_A') + ' = ' + fmt(p.F1 + p.F2) + ' − ' + fmt(FB, 2) + ' = ' + f(fmt(FA, 2) + ' kN'))}`,
        `b) ${eq(f('F_RA') + ' = ' + fmt(p.mu) + ' · ' + fmt(FA * 1000) + ' = ' + fmt(RA) + ' N')}, ${eq(f('F_RB') + ' = ' + fmt(p.mu) + ' · ' + fmt(FB * 1000) + ' = ' + fmt(RBf) + ' N')}`,
        `c) ${eq(m('M_R') + ' = ' + fmt(RA) + ' · ' + fmt(p.dA / 2000, 4) + ' + ' + fmt(RBf) + ' · ' + fmt(p.dB / 2000, 4) + ' = ' + m(fmt((RA * p.dA) / 2000 + (RBf * p.dB) / 2000) + ' Nm'))}`,
        'Drei Themen in einer Aufgabe: Lagerkräfte, Reibung und Drehmoment.',
      ];
    },
  }),

  // ---------- Rollen: Rollreibung und Wälzführungen ----------

  task({
    id: 'rbx3', karte: 'rollen', stufe: 1, familie: 'rechnen', src: 'Buch Reibung, Beispiel Rollreibung',
    title: 'Laufrad eines Brückenkrans',
    gen: () => ({ d: pick([250, 280, 320, 400]), FN: pick([20, 30, 38, 50]), f: pick([0.5, 0.6]) }),
    draw: (p) => B.laufrad(p),
    text: (p) => `Das Laufrad eines Brückenkrans hat ${l('d = ' + p.d + ' mm')} und wird mit ${f('F_N = ' + p.FN + ' kN')} belastet. Wie gross ist die Rollreibungskraft F_R bei der Rollreibungszahl f = ${fmt(p.f)} mm?`,
    asks: (p) => [{ k: 'F_R', unit: 'N', v: (p.f * p.FN * 1000) / (p.d / 2) }],
    fehler: (p) => [
      { ask: 0, v: (p.f * p.FN * 1000) / p.d, msg: 'Du hast den Durchmesser eingesetzt. In F_R = f · F_N : r steht der Radius.' },
      { ask: 0, v: (p.f * p.FN) / (p.d / 2), msg: 'Du hast kN nicht in N umgerechnet. 1 kN = 1000 N.' },
    ],
    tipps: () => [
      'Rollreibung: F_R = f · F_N : r.',
      'r = d : 2. f und r beide in mm. F_N in N.',
      'f = 0,5 mm ist eine Länge, keine reine Zahl wie μ.',
    ],
    loesung: (p) => [
      `${eq(f('F_R') + ' = ' + fmt(p.f) + ' mm · ' + p.FN * 1000 + ' N : ' + p.d / 2 + ' mm = ' + f(fmt((p.f * p.FN * 1000) / (p.d / 2)) + ' N'))}`,
      'Rollen ist viel leichter als Gleiten: Mit μ = 0,1 wären es ' + fmt(0.1 * p.FN * 1000) + ' N.',
    ],
  }),

  task({
    id: 'rb3', karte: 'rollen', stufe: 2, familie: 'rechnen', src: 'nach Buch Reibung, Nr. 3',
    title: 'Maschinenschlitten auf Wälzkörpern',
    gen: () => ({ FG: pick([480, 640, 800]), a: pick([80, 90, 100]), b: pick([140, 150, 160]), mu: pick([0.003, 0.005]), mu2: pick([0.08, 0.1, 0.12]) }),
    draw: (p) => B.schlitten(p),
    text: (p) => `Der Schlitten einer Werkzeugmaschine (${f('F_G = ' + p.FG + ' N')}) ist auf Wälzkörpern gelagert. Wie gross sind a) die Lagerkräfte F_A und F_B, b) die Verschiebekraft bei μ = ${fmt(p.mu, 3)} und c) die Verschiebekraft, wenn derselbe Schlitten auf einer Gleitführung mit μ = ${fmt(p.mu2)} läuft? d) Wievielmal leichter geht die Wälzführung?`,
    asks: (p) => [
      { k: 'a) F_A', unit: 'N', v: (p.FG * p.b) / (p.a + p.b) },
      { k: 'a) F_B', unit: 'N', v: (p.FG * p.a) / (p.a + p.b) },
      { k: 'b) F', unit: 'N', v: p.mu * p.FG },
      { k: 'c) F Gleitführung', unit: 'N', v: p.mu2 * p.FG },
      { k: 'd) Faktor', unit: '', v: p.mu2 / p.mu },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.FG * p.a) / (p.a + p.b), msg: 'Du hast A und B vertauscht. Das Lager näher am Schwerpunkt trägt mehr.' },
      { ask: 2, v: (p.mu * p.FG * p.b) / (p.a + p.b), msg: 'Du hast nur die Reibung an einem Lager gerechnet. Beide Wälzkörper rollen. Die Normalkraft ist F_A + F_B = F_G.' },
      { ask: 4, v: p.mu / p.mu2, msg: 'Verkehrt herum. Die Gleitführung braucht mehr Kraft, der Faktor ist grösser als 1.' },
    ],
    tipps: () => [
      'Lagerkräfte wie im Kapitel Lagerkräfte: Drehpunkt in A.',
      'Verschiebekraft: F = μ · (F_A + F_B) = μ · F_G.',
      'Der Faktor ist das Verhältnis der Reibungszahlen.',
    ],
    loesung: (p) => {
      const FB = (p.FG * p.a) / (p.a + p.b);
      return [
        `a) ${eq(f('F_B') + ' = ' + p.FG + ' · ' + p.a + ' : ' + (p.a + p.b) + ' = ' + f(fmt(FB) + ' N'))}, ${eq(f('F_A') + ' = ' + p.FG + ' − ' + fmt(FB) + ' = ' + f(fmt(p.FG - FB) + ' N'))}`,
        `b) ${eq(f('F') + ' = ' + fmt(p.mu, 3) + ' · ' + p.FG + ' = ' + f(fmt(p.mu * p.FG, 3) + ' N'))}`,
        `c) ${eq(f('F') + ' = ' + fmt(p.mu2) + ' · ' + p.FG + ' = ' + f(fmt(p.mu2 * p.FG) + ' N'))}`,
        `d) ${eq(fmt(p.mu2) + ' : ' + fmt(p.mu, 3) + ' = ' + fmt(p.mu2 / p.mu))}`,
        'Wälzkörper machen den Schlitten fast reibungsfrei. Darum braucht er so wenig Kraft.',
      ];
    },
  }),

  task({
    id: 'rb4', karte: 'rollen', stufe: 2, familie: 'rechnen', src: 'Buch Reibung, Nr. 4',
    title: 'Rollennaht-Schweissmaschine',
    gen: () => ({ FN: pick([1.5, 2, 3]), f: pick([0.4, 0.6]), d: pick([100, 120, 150]) }),
    draw: (p) => B.schweiss(p),
    text: (p) => `Die Elektrodenrollen einer Rollennaht-Schweissmaschine (${l('ø' + p.d + ' mm')}) drücken mit ${f('F_N = ' + fmt(p.FN) + ' kN')} auf die Bleche. Wie gross sind a) die Rollreibungskraft F_R je Rolle bei f = ${fmt(p.f)} cm und b) das Antriebsmoment M an der unteren Elektrode? Nur die untere Rolle wird angetrieben. Die obere läuft über das Blech mit. Das Antriebsmoment muss darum die Rollreibung beider Rollen überwinden.`,
    asks: (p) => {
      const FR = (p.f * 10 * p.FN * 1000) / (p.d / 2);
      return [{ k: 'a) F_R', unit: 'N', v: FR }, { k: 'b) M', unit: 'Nm', v: (2 * FR * p.d) / 2000 }];
    },
    fehler: (p) => {
      const FR = (p.f * 10 * p.FN * 1000) / (p.d / 2);
      return [
        { ask: 0, v: FR / 10, msg: 'Du hast f in cm eingesetzt. Rechne f in mm um, denn der Radius steht in mm.' },
        { ask: 1, v: (FR * p.d) / 2000, msg: 'Du hast nur eine Rolle gerechnet. Die untere Rolle treibt auch die obere an.' },
      ];
    },
    tipps: (p) => [
      `f in mm umrechnen: ${fmt(p.f)} cm = ${fmt(p.f * 10)} mm.`,
      'F_R = f · F_N : r',
      'Die untere Rolle muss die Rollreibung beider Rollen überwinden: M = 2 · F_R · r.',
    ],
    loesung: (p) => {
      const FR = (p.f * 10 * p.FN * 1000) / (p.d / 2);
      return [
        `a) ${eq(f('F_R') + ' = ' + fmt(p.f * 10) + ' mm · ' + fmt(p.FN * 1000) + ' N : ' + p.d / 2 + ' mm = ' + f(fmt(FR) + ' N'))}`,
        `b) ${eq(m('M') + ' = 2 · ' + fmt(FR) + ' N · ' + fmt(p.d / 2000, 3) + ' m = ' + m(fmt((2 * FR * p.d) / 2000) + ' Nm'))}`,
        'Die obere Rolle hat keinen eigenen Antrieb. Ihre Rollreibung muss über das Blech von der unteren Rolle überwunden werden.',
      ];
    },
  }),

  task({
    id: 'cr4', karte: 'rollen', stufe: 3, familie: 'kette', src: 'Kreativ · Themen kombiniert',
    title: 'Schiebetor auf zwei Rollen',
    gen: () => ({ FG: pick([3000, 4000, 5000]), L: 6, a: pick([0.5, 0.8]), b: pick([3.5, 4]), xs: 3, d: pick([80, 100, 120]), f: pick([0.5, 0.8]) }),
    draw: (p) => B.tor(p),
    text: (p) => `Ein Schiebetor (${f('F_G = ' + p.FG + ' N')}, Schwerpunkt ${l(fmt(p.xs - p.a) + ' m')} neben Rolle A) läuft auf zwei Rollen A und B (Abstand ${l(fmt(p.b - p.a) + ' m')}). Die Rollen haben ${l('d = ' + p.d + ' mm')}, die Rollreibungszahl ist f = ${fmt(p.f)} mm. Berechne a) die Rollenkräfte F_A und F_B, b) die Rollreibungskraft an jeder Rolle und c) die Schiebekraft F.`,
    asks: (p) => {
      const ll = p.b - p.a, x = p.xs - p.a, FB = (p.FG * x) / ll, FA = p.FG - FB, r = p.d / 2;
      return [
        { k: 'a) F_A', unit: 'N', v: FA },
        { k: 'a) F_B', unit: 'N', v: FB },
        { k: 'b) F_R,A', unit: 'N', v: (p.f * FA) / r },
        { k: 'b) F_R,B', unit: 'N', v: (p.f * FB) / r },
        { k: 'c) F', unit: 'N', v: (p.f * p.FG) / r },
      ];
    },
    fehler: (p) => {
      const ll = p.b - p.a, x = p.xs - p.a, FB = (p.FG * x) / ll;
      return [
        { ask: 0, v: FB, msg: 'Du hast A und B vertauscht. Der Schwerpunkt liegt näher an B, also trägt B mehr.' },
        { ask: 4, v: (p.f * p.FG) / p.d, msg: 'Du hast den Durchmesser eingesetzt. In F_R = f · F_N : r steht der Radius.' },
        { ask: 2, v: (p.f * p.FG) / (p.d / 2), msg: 'Du hast die ganze Gewichtskraft auf Rolle A gerechnet. A trägt nur F_A.' },
      ];
    },
    tipps: (p) => [
      `a) Lagerkräfte: Drehpunkt in A, F_B · ${fmt(p.b - p.a)} = F_G · ${fmt(p.xs - p.a)}`,
      'b) Rollreibung je Rolle: F_R = f · F_N : r',
      'c) F = F_R,A + F_R,B',
    ],
    loesung: (p) => {
      const ll = p.b - p.a, x = p.xs - p.a, FB = (p.FG * x) / ll, FA = p.FG - FB, r = p.d / 2;
      return [
        `a) ${eq(f('F_B') + ' = ' + p.FG + ' · ' + fmt(x) + ' : ' + fmt(ll) + ' = ' + f(fmt(FB) + ' N'))}, ${eq(f('F_A') + ' = ' + f(fmt(FA) + ' N'))}`,
        `b) ${eq('F_R,A = ' + fmt(p.f) + ' · ' + fmt(FA) + ' : ' + r + ' = ' + fmt((p.f * FA) / r) + ' N')}, ${eq('F_R,B = ' + fmt(p.f) + ' · ' + fmt(FB) + ' : ' + r + ' = ' + fmt((p.f * FB) / r) + ' N')}`,
        `c) ${eq(f('F') + ' = ' + f(fmt((p.f * p.FG) / r) + ' N'))}`,
        'Für die Schiebekraft allein hätte F = f · F_G : r gereicht. Die Aufteilung brauchst du für die Auslegung der Rollen.',
      ];
    },
  }),
];
