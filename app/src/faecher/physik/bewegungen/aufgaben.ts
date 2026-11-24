// Aufgaben zum Kapitel Bewegungen: v = s : t, Vorschub, Umfangsgeschwindigkeit, zusammengesetzte Bewegungen.
import { task, type Task } from '../../../core/types';
import { eq, l, v as w } from '../../../core/text';
import { fmt, pick } from '../../../core/zahl';
import * as B from './bilder';

/** Umfangsgeschwindigkeit in m/min (d in mm, n in 1/min) */
const vmin = (d: number, n: number) => (Math.PI * d / 1000) * n;
/** Drehzahl in 1/min aus v in m/min und d in mm */
const nvon = (v: number, d: number) => v / (Math.PI * d / 1000);
const deg = (r: number) => (r * 180) / Math.PI;

export const AUFGABEN: Task[] = [
  // ---------- Geradlinige Bewegung: v = s : t ----------

  task({
    id: 'v1', karte: 'gerade', stufe: 1, familie: 'rechnen', src: 'nach Buch geradlinige Bewegung, Nr. 1',
    title: 'Hubgeschwindigkeit der Hebebühne',
    gen: () => {
      const [s, t] = pick([[1.5, 10], [1.6, 8], [1.8, 12], [2, 8], [2, 10], [1.5, 6]]);
      return { s, t };
    },
    draw: (p) => B.hebebuehne({ s: `s = ${fmt(p.s)} m`, t: `t = ${p.t} s`, v: 'v = ?' }),
    text: (p) => `Eine Hebebühne hebt einen Pkw in ${p.t} s auf ${l(fmt(p.s) + ' m')} Höhe. Wie gross ist die Hubgeschwindigkeit v a) in m/s und b) in m/min?`,
    asks: (p) => [
      { k: 'a) v', unit: 'm/s', v: p.s / p.t },
      { k: 'b) v', unit: 'm/min', v: (p.s / p.t) * 60 },
    ],
    fehler: (p) => [
      { ask: 0, v: (p.s / p.t) * 60, msg: 'Das ist die Geschwindigkeit in m/min. Gefragt sind m/s. Du teilst Weg durch Zeit in s.' },
      { ask: 0, v: p.t / p.s, msg: 'Du hast Zeit durch Weg geteilt. Die Geschwindigkeit ist Weg durch Zeit: v = s : t.' },
      { ask: 1, v: p.s / p.t, msg: 'Das ist noch m/s. Für m/min multiplizierst du mit 60.' },
    ],
    tipps: () => ['Geschwindigkeit ist Weg pro Zeit.', 'v = s : t. Mit s in m und t in s erhältst du m/s.', 'Für m/min multiplizierst du das Resultat in m/s mit 60.'],
    loesung: (p) => [
      `a) ${eq(w('v') + ' = ' + l('s') + ' : t = ' + fmt(p.s) + ' m : ' + p.t + ' s = ' + w(fmt(p.s / p.t, 3) + ' m/s'))}`,
      `b) ${eq(fmt(p.s / p.t, 3) + ' m/s · 60 s/min = ' + w(fmt((p.s / p.t) * 60) + ' m/min'))}`,
    ],
  }),

  task({
    id: 'v2', karte: 'gerade', stufe: 1, familie: 'rechnen', src: 'nach Buch geradlinige Bewegung, Nr. 2',
    title: 'Höhenunterschied im Aufzug',
    gen: () => ({ v: pick([120, 150, 180, 204, 240]), t: pick([8, 10, 12, 15]) }),
    draw: (p) => B.aufzugSchacht({ v: `v = ${p.v} m/min`, s: 's = ?', t: `t = ${p.t} s` }),
    text: (p) => `Ein Personenaufzug fährt mit ${w('v = ' + p.v + ' m/min')}. Welchen Höhenunterschied s legt er in ${p.t} s zurück?`,
    asks: (p) => [{ k: 's', unit: 'm', v: (p.v / 60) * p.t }],
    fehler: (p) => [
      { ask: 0, v: p.v * p.t, msg: 'Du hast m/min mit s multipliziert. Die Einheiten passen nicht zusammen. Rechne v zuerst in m/s um: durch 60.' },
      { ask: 0, v: p.v / p.t, msg: 'Du hast geteilt. Der Weg ist Geschwindigkeit mal Zeit: s = v · t.' },
    ],
    tipps: () => ['Gleiche zuerst die Einheiten an.', 'v in m/s: m/min durch 60. Dann s = v · t.', 'Oder die Zeit in min: t durch 60, dann mal v in m/min.'],
    loesung: (p) => [
      `Einheit: ${eq(w('v') + ' = ' + p.v + ' m/min : 60 = ' + fmt(p.v / 60, 3) + ' m/s')}`,
      `Weg: ${eq(l('s') + ' = v · t = ' + fmt(p.v / 60, 3) + ' m/s · ' + p.t + ' s = ' + l(fmt((p.v / 60) * p.t) + ' m'))}`,
    ],
  }),

  task({
    id: 'v3', karte: 'gerade', stufe: 1, familie: 'rechnen', src: 'eigene Variante zu Buch Nr. 2',
    title: 'Förderband im Lager',
    gen: () => ({ v: pick([0.5, 0.8, 1.2]), s: pick([18, 24, 30]) }),
    draw: (p) => B.foerderband({ v: `v = ${fmt(p.v, 1)} m/s`, s: `s = ${p.s} m` }),
    text: (p) => `Ein Paket fährt auf einem Förderband mit ${w('v = ' + fmt(p.v, 1) + ' m/s')}. Das Band ist ${l(p.s + ' m')} lang. Wie lange braucht das Paket a) in s und b) in min?`,
    asks: (p) => [
      { k: 'a) t', unit: 's', v: p.s / p.v },
      { k: 'b) t', unit: 'min', v: p.s / p.v / 60 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.s * p.v, msg: 'Du hast multipliziert. Die Zeit ist Weg durch Geschwindigkeit: t = s : v.' },
      { ask: 1, v: p.s / p.v, msg: 'Das ist die Zeit in s. Für min teilst du noch durch 60.' },
    ],
    tipps: () => ['Stelle v = s : t nach t um.', 't = s : v. Mit s in m und v in m/s erhältst du s.', 'Für min teilst du das Resultat in s durch 60.'],
    loesung: (p) => [
      `a) ${eq('t = s : v = ' + p.s + ' m : ' + fmt(p.v, 1) + ' m/s = ' + fmt(p.s / p.v) + ' s')}`,
      `b) ${eq(fmt(p.s / p.v) + ' s : 60 = ' + fmt(p.s / p.v / 60, 3) + ' min')}`,
    ],
  }),

  task({
    id: 'v4', karte: 'gerade', stufe: 2, familie: 'rechnen', src: 'nach Buch geradlinige Bewegung, Nr. 4',
    title: 'Kastenprofil schweissen',
    gen: () => ({ L: pick([975, 1275, 1575]), a: 75, v1: pick([0.25, 0.3, 0.4]), v2: pick([4, 5, 6]) }),
    draw: (p) => B.kasten({ L: p.L, a: p.a, v1: `v_f = ${fmt(p.v1, 2)} m/min`, v2: `${p.v2} m/min` }),
    text: (p) => `Ein Schweissautomat verschweisst ein Profil der Länge ${l(p.L + ' mm')}. Nähte und Lücken sind je ${l(p.a + ' mm')} lang. Er beginnt und endet mit einer Naht. Er schweisst mit ${w('v_f = ' + fmt(p.v1, 2) + ' m/min')}. Die Lücken überbrückt er im Eilgang mit ${w(p.v2 + ' m/min')}. Berechne a) die Anzahl Nähte, b) die Schweisszeit, c) die Eilgangzeit und d) die Gesamtzeit für eine Profilseite. Gib die Zeiten in s an.`,
    asks: (p) => {
      const N = (p.L / p.a + 1) / 2, t1 = ((N * p.a) / 1000 / p.v1) * 60, t2 = (((N - 1) * p.a) / 1000 / p.v2) * 60;
      return [
        { k: 'a) Nähte', unit: '', v: N },
        { k: 'b) t Schweissen', unit: 's', v: t1 },
        { k: 'c) t Eilgang', unit: 's', v: t2 },
        { k: 'd) t gesamt', unit: 's', v: t1 + t2 },
      ];
    },
    fehler: (p) => {
      const N = (p.L / p.a + 1) / 2, t1 = ((N * p.a) / 1000 / p.v1) * 60;
      return [
        { ask: 0, v: p.L / p.a, msg: 'Das sind alle Abschnitte, Nähte und Lücken zusammen. Nur jeder zweite ist eine Naht.' },
        { ask: 1, v: t1 / 60, msg: 'Das ist die Zeit in min. Gefragt sind s: mal 60.' },
        { ask: 1, v: ((p.L / p.a / 2) * p.a) / 1000 / p.v1 * 60, msg: 'Du hast die Hälfte der Abschnitte gerechnet. Die Naht am Anfang und am Ende zählt mit: (Abschnitte + 1) : 2.' },
      ];
    },
    tipps: (p) => [
      'Zähle zuerst die Abschnitte. Naht und Lücke wechseln sich ab.',
      `Abschnitte: ${p.L} : ${p.a}. Nähte = (Abschnitte + 1) : 2. Lücken = Nähte − 1.`,
      't = Weg : v_f. Weg in m, weil v_f in m/min steht. Dann mal 60 für s.',
    ],
    loesung: (p) => {
      const n = p.L / p.a, N = (n + 1) / 2, t1 = ((N * p.a) / 1000 / p.v1) * 60, t2 = (((N - 1) * p.a) / 1000 / p.v2) * 60;
      return [
        `a) ${eq(p.L + ' : ' + p.a + ' = ' + n + ' Abschnitte')}. ${eq('Nähte = (' + n + ' + 1) : 2 = ' + N)}, Lücken: ${N - 1}.`,
        `b) ${eq('t = ' + N + ' · ' + fmt(p.a / 1000, 3) + ' m : ' + fmt(p.v1, 2) + ' m/min = ' + fmt(t1 / 60, 3) + ' min = ' + fmt(t1) + ' s')}`,
        `c) ${eq('t = ' + (N - 1) + ' · ' + fmt(p.a / 1000, 3) + ' m : ' + p.v2 + ' m/min = ' + fmt(t2 / 60, 3) + ' min = ' + fmt(t2) + ' s')}`,
        `d) ${eq('t = ' + fmt(t1) + ' s + ' + fmt(t2) + ' s = ' + fmt(t1 + t2) + ' s')}`,
      ];
    },
  }),

  task({
    id: 'v5', karte: 'gerade', stufe: 2, familie: 'umgekehrt', src: 'Kreativ · Umgekehrt gefragt',
    title: 'Wie schnell muss das Band laufen?',
    gen: () => {
      const s = pick([18, 24, 30]);
      return { s, t: pick([20, 30, 40, 60].filter((x) => x !== s)) };
    },
    draw: (p) => B.foerderband({ v: 'v = ?', s: `s = ${p.s} m` }),
    text: (p) => `Ein Paket muss ein ${l(p.s + ' m')} langes Förderband in höchstens ${p.t} s durchlaufen. Wie schnell muss das Band mindestens laufen? Gib v a) in m/s und b) in m/min an.`,
    asks: (p) => [
      { k: 'a) v', unit: 'm/s', v: p.s / p.t },
      { k: 'b) v', unit: 'm/min', v: (p.s / p.t) * 60 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.t / p.s, msg: 'Du hast Zeit durch Weg geteilt. Die Geschwindigkeit ist Weg durch Zeit.' },
      { ask: 1, v: p.s / p.t / 60, msg: 'Du hast durch 60 geteilt. Von m/s zu m/min gehst du mit mal 60.' },
    ],
    tipps: () => ['Gesucht ist die kleinste Geschwindigkeit. Die Zeit ist die Obergrenze.', 'v = s : t. Das gibt m/s.', 'Für m/min multiplizierst du mit 60.'],
    loesung: (p) => [
      `a) ${eq(w('v') + ' = s : t = ' + p.s + ' m : ' + p.t + ' s = ' + w(fmt(p.s / p.t, 3) + ' m/s'))}`,
      `b) ${eq(fmt(p.s / p.t, 3) + ' · 60 = ' + w(fmt((p.s / p.t) * 60) + ' m/min'))}`,
    ],
  }),

  task({
    id: 'v6', karte: 'gerade', stufe: 1, familie: 'schaetzen', src: 'Kreativ · Abschätzen, ohne Taschenrechner',
    title: 'Bremsweg im Kopf: Wie weit in 5 Sekunden?',
    gen: () => ({ v: pick([36, 72, 108, 144]), t: pick([5, 8, 10]) }),
    draw: () => B.saeulen('36 km/h sind genau 10 m/s', [{ v: 1, t: '36 km/h = 10 m/s' }, { v: 2, t: '72 km/h = 20 m/s' }, { v: 3, t: '108 km/h = 30 m/s' }]),
    text: (p) => `Ohne Taschenrechner: Ein Auto fährt mit ${w('v = ' + p.v + ' km/h')} gleichmässig. Wie weit kommt es in ${p.t} s? Merke: 36 km/h sind 10 m/s. Eine Abweichung von 5 % ist erlaubt.`,
    asks: (p) => [{ k: 's', unit: 'm', v: (p.v / 3.6) * p.t, tol: 0.05 }],
    fehler: (p) => [
      { ask: 0, v: p.v * p.t, msg: 'Du hast km/h mit s multipliziert. Rechne zuerst in m/s: 36 km/h sind 10 m/s.' },
    ],
    tipps: () => ['36 km/h sind 10 m/s. Das ist dein Anker.', 'Wie viele Mal passen 36 km/h in die Geschwindigkeit? Das gibt die Geschwindigkeit in Zehnern von m/s.', 'Beispiel: 72 km/h = 20 m/s. Mal die Zeit gibt den Weg.'],
    loesung: (p) => [
      `Geschwindigkeit: ${eq(p.v + ' km/h = ' + (p.v / 36) * 10 + ' m/s')}`,
      `Weg: ${eq('s = ' + (p.v / 36) * 10 + ' m/s · ' + p.t + ' s = ' + fmt((p.v / 3.6) * p.t) + ' m')}`,
    ],
  }),

  task({
    id: 'v7', karte: 'gerade', stufe: 2, familie: 'fehler', src: 'Kreativ · Fehler finden',
    title: 'Fehler finden: Aufzug',
    gen: () => ({ v: pick([120, 150, 180, 204, 240]), t: pick([8, 10, 12, 15]) }),
    draw: (p) => B.aufzugSchacht({ v: `v = ${p.v} m/min`, s: 's = ?', t: `t = ${p.t} s` }),
    text: (p) => `Ein Aufzug fährt mit ${w('v = ' + p.v + ' m/min')} während ${p.t} s. Tim rechnet: «s = v · t = ${p.v} · ${p.t} = ${fmt(p.v * p.t)} m». a) Was ist falsch? b) Wie gross ist s richtig?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: [
          'Er hat m/min und s nicht angeglichen. v muss zuerst in m/s.',
          'Er muss durch t teilen statt multiplizieren.',
          'Er muss v mit 3,6 teilen.',
          'Nichts, die Rechnung stimmt.',
        ],
        a: 0,
        why: [
          undefined,
          'Der Weg ist Geschwindigkeit mal Zeit. Das stimmt bei Tim. Die Einheiten stimmen nicht.',
          'Die 3,6 gehört zu km/h und m/s. Hier steht m/min.',
          'Der Aufzug wäre in 10 s über 1000 m hoch gefahren. Das kann nicht stimmen.',
        ],
      },
      { k: 'b) s richtig', unit: 'm', v: (p.v / 60) * p.t },
    ],
    fehler: (p) => [{ ask: 1, v: p.v * p.t, msg: 'Das ist Tims Wert. Er hat m/min mit s multipliziert. Teile v zuerst durch 60.' }],
    tipps: () => ['Schau auf die Einheiten von v und t.', 'v steht in m/min, t in s. Das passt nicht zusammen.', 'v durch 60 gibt m/s. Dann s = v · t.'],
    loesung: (p) => [
      'Tim hat m/min mit s multipliziert. Das Resultat ist 60-mal zu gross.',
      `Richtig: ${eq(l('s') + ' = ' + fmt(p.v / 60, 3) + ' m/s · ' + p.t + ' s = ' + l(fmt((p.v / 60) * p.t) + ' m'))}`,
      'Kontrolle: Ein Aufzug fährt in 10 s etwa 20 bis 40 m. Tims Wert ist viel zu gross.',
    ],
  }),

  // ---------- Vorschub beim Drehen, Bohren, Fräsen ----------

  task({
    id: 'v8', karte: 'vorschub', stufe: 2, familie: 'rechnen', src: 'nach Buch geradlinige Bewegung, Nr. 3',
    title: 'Welle schruppen und reiben',
    gen: () => ({ L1: pick([110, 124, 140]), L2: pick([70, 82, 90]), f: pick([0.5, 0.6, 0.8]), n: pick([250, 280, 315]), f2: pick([0.25, 0.32, 0.4]), n2: pick([160, 200, 250]) }),
    draw: (p) => B.welle({ L1: p.L1, L2: p.L2, n: `n = ${p.n}/min`, f: `f = ${fmt(p.f, 2)} mm` }),
    text: (p) => `Eine Welle wird auf ${l(p.L1 + ' mm')} und auf ${l(p.L2 + ' mm')} Länge in je einem Schnitt geschruppt. Der Vorschub ist f = ${fmt(p.f, 2)} mm, die Drehzahl n = ${p.n}/min. Danach wird die Bohrung mit n = ${p.n2}/min und f = ${fmt(p.f2, 2)} mm gerieben. Berechne a) die Vorschubgeschwindigkeit beim Schruppen, b) die Gesamtzeit für beide Schruppschnitte und c) die Vorschubgeschwindigkeit beim Reiben.`,
    asks: (p) => {
      const v = p.f * p.n;
      return [
        { k: 'a) v_f', unit: 'mm/min', v },
        { k: 'b) t', unit: 'min', v: (p.L1 + p.L2) / v },
        { k: 'c) v_f Reiben', unit: 'mm/min', v: p.f2 * p.n2 },
      ];
    },
    fehler: (p) => {
      const v = p.f * p.n;
      return [
        { ask: 0, v: p.n / p.f, msg: 'Du hast geteilt. Der Vorschub je Umdrehung wird mit der Drehzahl multipliziert: v_f = f · n.' },
        { ask: 1, v: p.L1 / v, msg: 'Du hast nur den ersten Schnitt gerechnet. Addiere beide Wege.' },
        { ask: 2, v: p.f2 + p.n2, msg: 'Du hast addiert. Es heisst v_f = f · n.' },
      ];
    },
    tipps: (p) => ['Vorschubgeschwindigkeit: Vorschub je Umdrehung mal Umdrehungen pro Minute.', `v_f = f · n. Der Weg beim Schruppen ist ${p.L1} mm + ${p.L2} mm.`, 't = Weg : v_f. Das Resultat kommt in min, weil v_f in mm/min steht.'],
    loesung: (p) => {
      const v = p.f * p.n;
      return [
        `a) ${eq(w('v_f') + ' = f · n = ' + fmt(p.f, 2) + ' mm · ' + p.n + '/min = ' + w(fmt(v) + ' mm/min'))}`,
        `b) ${eq('t = (' + p.L1 + ' + ' + p.L2 + ') mm : ' + fmt(v) + ' mm/min = ' + fmt((p.L1 + p.L2) / v, 3) + ' min')} (≈ ${fmt(((p.L1 + p.L2) / v) * 60)} s)`,
        `c) ${eq(w('v_f') + ' = ' + fmt(p.f2, 2) + ' mm · ' + p.n2 + '/min = ' + w(fmt(p.f2 * p.n2) + ' mm/min'))}`,
      ];
    },
  }),

  task({
    id: 'v9', karte: 'vorschub', stufe: 2, familie: 'rechnen', src: 'nach Buch geradlinige Bewegung, Nr. 5',
    title: 'Fräser wechseln',
    gen: () => {
      const z = pick([6, 8, 10, 12]);
      return { z, n: pick([200, 240, 300]), fz: pick([0.05, 0.08, 0.1]), z2: pick([4, 6, 8].filter((x) => x !== z)) };
    },
    draw: (p) => B.fraeser({ z: p.z, n: `n = ${p.n}/min`, fz: `f_z = ${fmt(p.fz, 2)} mm` }),
    text: (p) => `Ein Fräser mit ${p.z} Zähnen arbeitet mit n = ${p.n}/min und dem Vorschub je Schneide f_z = ${fmt(p.fz, 2)} mm. Er wird durch einen Fräser mit ${p.z2} Zähnen ersetzt. Vorschub je Schneide und Vorschubgeschwindigkeit sollen gleich bleiben. Berechne a) die Vorschubgeschwindigkeit und b) die neue Drehzahl.`,
    asks: (p) => {
      const v = p.z * p.fz * p.n;
      return [
        { k: 'a) v_f', unit: 'mm/min', v },
        { k: 'b) n neu', unit: '1/min', v: v / (p.z2 * p.fz) },
      ];
    },
    fehler: (p) => [
      { ask: 0, v: p.fz * p.n, msg: 'Du hast die Zähnezahl z vergessen. Beim Fräsen gilt v_f = z · f_z · n.' },
      { ask: 1, v: (p.n * p.z2) / p.z, msg: 'Du hast das Verhältnis verkehrt. Weniger Zähne brauchen mehr Drehzahl.' },
    ],
    tipps: () => ['Beim Fräsen schneidet jeder Zahn. Alle Zähne zählen.', 'v_f = z · f_z · n. Für die neue Drehzahl stellst du nach n um.', 'n neu = v_f : (z neu · f_z)'],
    loesung: (p) => {
      const v = p.z * p.fz * p.n;
      return [
        `a) ${eq(w('v_f') + ' = z · f_z · n = ' + p.z + ' · ' + fmt(p.fz, 2) + ' mm · ' + p.n + '/min = ' + w(fmt(v) + ' mm/min'))}`,
        `b) ${eq('n = v_f : (z · f_z) = ' + fmt(v) + ' : (' + p.z2 + ' · ' + fmt(p.fz, 2) + ') = ' + fmt(v / (p.z2 * p.fz)) + '/min')}`,
        'Weniger Zähne brauchen mehr Drehzahl für denselben Vorschub.',
      ];
    },
  }),

  task({
    id: 'v10', karte: 'vorschub', stufe: 3, familie: 'rechnen', src: 'nach Buch geradlinige Bewegung, Nr. 6',
    title: 'Grundlochbohrung',
    gen: () => ({ n: pick([500, 710, 900]), f: pick([0.1, 0.12, 0.16]), t: pick([40, 50, 63]), ls: 3, la: 2, z: pick([10, 15, 20]) }),
    draw: (p) => B.bohrung({ t: p.t, la: p.la, ls: p.ls }),
    text: (p) => `Eine Bohrmaschine läuft mit n = ${p.n}/min und f = ${fmt(p.f, 2)} mm. Gebohrt wird ein ${l(p.t + ' mm')} tiefes Grundloch. Für den Anschnitt kommen ${l(p.ls + ' mm')}, für den Anlauf ${l(p.la + ' mm')} dazu. Für Rückweg, Spannen und Nebenzeiten rechnest du ${p.z} % Zuschlag zur Vorschubzeit. Berechne a) die Vorschubgeschwindigkeit, b) die Vorschubzeit für ein Loch in s und c) die Anzahl Bohrungen pro Stunde (ganze Zahl, abrunden).`,
    asks: (p) => {
      const v = p.f * p.n, L = p.t + p.ls + p.la, t = (L / v) * 60;
      return [
        { k: 'a) v_f', unit: 'mm/min', v },
        { k: 'b) t', unit: 's', v: t },
        { k: 'c) Bohrungen', unit: '', v: Math.floor(3600 / (t * (1 + p.z / 100))) },
      ];
    },
    fehler: (p) => {
      const v = p.f * p.n, L = p.t + p.ls + p.la, t = (L / v) * 60;
      return [
        { ask: 0, v: p.n / p.f, msg: 'Du hast geteilt. Es heisst v_f = f · n.' },
        { ask: 1, v: (p.t / v) * 60, msg: 'Du hast nur die Lochtiefe gerechnet. Anschnitt und Anlauf zählen zum Vorschubweg.' },
        { ask: 2, v: Math.floor(3600 / t), msg: 'Du hast den Zuschlag vergessen. Pro Loch dauert es länger als die Vorschubzeit.' },
      ];
    },
    tipps: (p) => ['Erst die Vorschubgeschwindigkeit, dann den Weg, dann die Zeit.', `v_f = f · n. Weg L = ${p.t} + ${p.ls} + ${p.la} mm. t = L : v_f.`, `Zeit je Loch mit Zuschlag: t · ${fmt(1 + p.z / 100, 2)}. Anzahl = 3600 s : Zeit je Loch, abrunden.`],
    loesung: (p) => {
      const v = p.f * p.n, L = p.t + p.ls + p.la, t = (L / v) * 60, tg = t * (1 + p.z / 100);
      return [
        `a) ${eq(w('v_f') + ' = ' + fmt(p.f, 2) + ' mm · ' + p.n + '/min = ' + w(fmt(v) + ' mm/min'))}`,
        `b) ${eq('L = ' + p.t + ' + ' + p.ls + ' + ' + p.la + ' = ' + L + ' mm')}, ${eq('t = ' + L + ' : ' + fmt(v) + ' · 60 = ' + fmt(t) + ' s')}`,
        `c) ${eq('t mit Zuschlag = ' + fmt(t) + ' · ' + fmt(1 + p.z / 100, 2) + ' = ' + fmt(tg) + ' s')}, ${eq('3600 : ' + fmt(tg) + ' = ' + fmt(3600 / tg))} → ${Math.floor(3600 / tg)} Bohrungen`,
      ];
    },
  }),

  task({
    id: 'v11', karte: 'vorschub', stufe: 2, familie: 'fehler', src: 'Kreativ · Fehler finden',
    title: 'Fehler finden: Fräsen',
    gen: () => ({ z: pick([6, 8, 10]), fz: pick([0.05, 0.08, 0.1]), n: pick([200, 240, 300]) }),
    draw: (p) => B.fraeser({ z: p.z, n: `n = ${p.n}/min`, fz: `f_z = ${fmt(p.fz, 2)} mm` }),
    text: (p) => `Ein Walzenfräser hat ${p.z} Zähne, n = ${p.n}/min und f_z = ${fmt(p.fz, 2)} mm. Fabio rechnet: «v_f = f_z · n = ${fmt(p.fz, 2)} · ${p.n} = ${fmt(p.fz * p.n)} mm/min». a) Was ist falsch? b) Wie gross ist v_f richtig?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: [
          'Er hat die Zähnezahl z vergessen. Alle Zähne schneiden.',
          'Er hat n in m/min gerechnet.',
          'Er muss f_z durch z teilen.',
          'Nichts, die Formel stimmt.',
        ],
        a: 0,
        why: [
          undefined,
          'Die Drehzahl n steht in 1/min. Das ist richtig eingesetzt.',
          'Beim Fräsen wird multipliziert, nicht geteilt. Der Vorschub je Schneide gilt für jeden Zahn.',
          `Die Formel f · n gilt beim Drehen. Beim Fräsen hat der Fräser ${p.z} Schneiden. Alle schieben vor.`,
        ],
      },
      { k: 'b) v_f richtig', unit: 'mm/min', v: p.z * p.fz * p.n },
    ],
    fehler: (p) => [{ ask: 1, v: p.fz * p.n, msg: 'Das ist Fabios Wert. Er hat z vergessen. Multipliziere noch mit der Zähnezahl.' }],
    tipps: () => ['Beim Drehen hat der Meissel eine Schneide. Wie viele hat ein Fräser?', 'Jeder Zahn schiebt den Fräser um f_z vor.', 'v_f = z · f_z · n'],
    loesung: (p) => [
      'Fabio hat die Zähnezahl vergessen.',
      `Richtig: ${eq(w('v_f') + ' = z · f_z · n = ' + p.z + ' · ' + fmt(p.fz, 2) + ' · ' + p.n + ' = ' + w(fmt(p.z * p.fz * p.n) + ' mm/min'))}`,
    ],
  }),

  task({
    id: 'v12', karte: 'vorschub', stufe: 2, familie: 'waswaere', src: 'Kreativ · Was wäre wenn',
    title: 'Was wäre wenn: Doppelter Vorschub',
    gen: () => ({ L: pick([120, 160, 200]), f: pick([0.2, 0.25, 0.4]), n: pick([250, 400, 500]) }),
    draw: (p) => B.welle({ L1: p.L, L2: Math.round(p.L / 2), n: `n = ${p.n}/min`, f: `f = ${fmt(p.f, 2)} mm`, v: 'v_f' }),
    text: (p) => `Beim Längsdrehen legt der Meissel ${l(p.L + ' mm')} zurück. Die Drehzahl ist n = ${p.n}/min, der Vorschub f = ${fmt(p.f, 2)} mm. Jetzt verdoppelst du den Vorschub. n bleibt gleich. a) Wie ändert sich die Zeit? b) Wie gross ist die neue Zeit in s?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Zeit',
        opts: ['Die Zeit halbiert sich.', 'Die Zeit bleibt gleich.', 'Die Zeit verdoppelt sich.', 'Die Zeit wird viermal kleiner.'],
        a: 0,
        why: [undefined, 'Doppelter Vorschub heisst doppelte Vorschubgeschwindigkeit. Der Meissel ist schneller am Ziel.', 'Es geht schneller, nicht langsamer. Doppelte Geschwindigkeit, gleicher Weg.', 'Der Vorschub wird nur doppelt so gross. Die Zeit sinkt im gleichen Verhältnis, nicht stärker.'],
      },
      { k: 'b) t neu', unit: 's', v: (p.L / (2 * p.f * p.n)) * 60 },
    ],
    fehler: (p) => [
      { ask: 1, v: (p.L / (p.f * p.n)) * 60, msg: 'Das ist die alte Zeit. Mit doppeltem Vorschub ist v_f doppelt so gross.' },
      { ask: 1, v: (p.L / (2 * p.f * p.n)), msg: 'Das ist die Zeit in min. Gefragt sind s: mal 60.' },
    ],
    tipps: () => ['v_f = f · n. Was passiert mit v_f, wenn f doppelt so gross wird?', 'v_f wird doppelt so gross. Der Weg bleibt gleich.', 't = L : v_f mit dem neuen v_f. Mal 60 für s.'],
    loesung: (p) => [
      `Neue Geschwindigkeit: ${eq(w('v_f') + ' = 2 · ' + fmt(p.f, 2) + ' · ' + p.n + ' = ' + fmt(2 * p.f * p.n) + ' mm/min')}`,
      `Zeit: ${eq('t = ' + p.L + ' : ' + fmt(2 * p.f * p.n) + ' · 60 = ' + fmt((p.L / (2 * p.f * p.n)) * 60) + ' s')}`,
      `Vorher: ${fmt((p.L / (p.f * p.n)) * 60)} s. Doppelte Geschwindigkeit halbiert die Zeit.`,
    ],
  }),

  task({
    id: 'v13', karte: 'vorschub', stufe: 3, familie: 'umgekehrt', src: 'Kreativ · Umgekehrt gefragt',
    title: 'Welche Drehzahl braucht die Bohrung?',
    gen: () => ({ tief: pick([30, 40, 50]), f: pick([0.12, 0.16, 0.2]), t: pick([12, 15, 20]) }),
    draw: (p) => B.bohrung({ t: p.tief, la: 2, ls: 3 }),
    text: (p) => `Ein Loch ist ${l(p.tief + ' mm')} tief. Anschnitt und Anlauf geben zusammen ${l('5 mm')} dazu. Der Vorschub ist f = ${fmt(p.f, 2)} mm. Das Bohren darf höchstens ${p.t} s dauern. Welche Drehzahl n ist mindestens nötig?`,
    asks: (p) => [{ k: 'n', unit: '1/min', v: ((p.tief + 5) * 60) / (p.f * p.t) }],
    fehler: (p) => [
      { ask: 0, v: (p.tief + 5) / (p.f * p.t), msg: 'Du hast die Zeit in s eingesetzt. n steht in 1/min. Rechne t zuerst in min: durch 60.' },
      { ask: 0, v: (p.tief * 60) / (p.f * p.t), msg: 'Du hast Anschnitt und Anlauf vergessen. Der Weg ist Tiefe plus 5 mm.' },
    ],
    tipps: () => ['Stelle v_f = f · n nach n um.', 'v_f = Weg : Zeit. Die Zeit in min. Dann n = v_f : f.', 'Weg = Tiefe + 5 mm. t in min = t in s : 60.'],
    loesung: (p) => {
      const L = p.tief + 5, vf = (L / p.t) * 60;
      return [
        `Weg: ${eq('L = ' + p.tief + ' + 5 = ' + L + ' mm')}`,
        `Geschwindigkeit: ${eq(w('v_f') + ' = L : t = ' + L + ' mm : ' + fmt(p.t / 60, 3) + ' min = ' + fmt(vf) + ' mm/min')}`,
        `Drehzahl: ${eq('n = v_f : f = ' + fmt(vf) + ' : ' + fmt(p.f, 2) + ' = ' + w(fmt(vf / p.f) + '/min'))}`,
      ];
    },
  }),

  // ---------- Umfangsgeschwindigkeit v = π · d · n ----------

  task({
    id: 'v14', karte: 'umfang', stufe: 1, familie: 'rechnen', src: 'nach Buch kreisförmige Bewegung, Nr. 1',
    title: 'Winkelschleifer',
    gen: () => ({ d: pick([115, 125, 180, 230]), n: pick([6000, 8000, 10000]) }),
    draw: (p) => B.rund({ name: 'Trennscheibe', fill: '#d7dbe2', d: `d = ${p.d} mm`, n: `n = ${p.n}/min`, v: 'v = ?' }),
    text: (p) => `Die Trennscheibe eines Winkelschleifers hat ${l('d = ' + p.d + ' mm')} und dreht mit n = ${p.n}/min. Wie gross ist die Geschwindigkeit am Umfang in m/s?`,
    asks: (p) => [{ k: 'v', unit: 'm/s', v: vmin(p.d, p.n) / 60 }],
    fehler: (p) => [
      { ask: 0, v: vmin(p.d, p.n), msg: 'Das ist die Geschwindigkeit in m/min. Teile noch durch 60 für m/s.' },
      { ask: 0, v: (Math.PI * p.d * p.n) / 60, msg: 'Du hast d in mm eingesetzt. Rechne d zuerst in m um: durch 1000.' },
    ],
    tipps: (p) => ['Ein Punkt am Rand legt pro Umdrehung den Umfang zurück.', `v = π · d · n. d in m: ${p.d} mm = ${fmt(p.d / 1000, 3)} m. Das Resultat ist in m/min.`, 'Für m/s teilst du durch 60.'],
    loesung: (p) => [
      `${eq('v = π · ' + fmt(p.d / 1000, 3) + ' m · ' + p.n + '/min = ' + fmt(vmin(p.d, p.n)) + ' m/min')}`,
      `${eq(fmt(vmin(p.d, p.n)) + ' : 60 = ' + w(fmt(vmin(p.d, p.n) / 60) + ' m/s'))}`,
    ],
  }),

  task({
    id: 'v15', karte: 'umfang', stufe: 1, familie: 'rechnen', src: 'nach Buch kreisförmige Bewegung, Nr. 3',
    title: 'Riemenscheibe am Motor',
    gen: () => ({ d: pick([80, 90, 112, 125]), n: pick([1400, 2800]) }),
    draw: (p) => B.rund({ name: 'Riemenscheibe', d: `d = ${p.d} mm`, n: `n = ${p.n}/min`, v: 'v = ?' }),
    text: (p) => `Die Riemenscheibe eines Elektromotors hat ${l('d = ' + p.d + ' mm')} und läuft mit n = ${p.n}/min. Wie gross ist die Umfangsgeschwindigkeit in m/s?`,
    asks: (p) => [{ k: 'v', unit: 'm/s', v: vmin(p.d, p.n) / 60 }],
    fehler: (p) => [
      { ask: 0, v: vmin(p.d, p.n), msg: 'Das ist m/min. Für m/s teilst du durch 60.' },
      { ask: 0, v: (Math.PI * p.d * p.n) / 60, msg: 'Du hast d in mm eingesetzt. Teile d zuerst durch 1000.' },
    ],
    tipps: () => ['v = π · d · n', 'd in m, n in 1/min. Das gibt m/min.', 'Durch 60 gibt m/s.'],
    loesung: (p) => [`${eq('v = π · ' + fmt(p.d / 1000, 3) + ' · ' + p.n + ' : 60 = ' + w(fmt(vmin(p.d, p.n) / 60) + ' m/s'))}`],
  }),

  task({
    id: 'v16', karte: 'umfang', stufe: 1, familie: 'rechnen', src: 'nach Buch kreisförmige Bewegung, Nr. 6',
    title: 'Bohrer',
    gen: () => ({ d: pick([8, 10, 12, 18, 22]), n: pick([355, 500, 710, 1000]) }),
    draw: (p) => B.rund({ name: 'Bohrer (Querschnitt)', fill: '#f3d98b', d: `d = ${p.d} mm`, n: `n = ${p.n}/min`, v: 'v_c = ?' }),
    text: (p) => `Ein Bohrer mit ${l('d = ' + p.d + ' mm')} arbeitet mit n = ${p.n}/min. Berechne die Schnittgeschwindigkeit in m/min.`,
    asks: (p) => [{ k: 'v_c', unit: 'm/min', v: vmin(p.d, p.n) }],
    fehler: (p) => [
      { ask: 0, v: vmin(p.d, p.n) / 60, msg: 'Du hast durch 60 geteilt. Das gibt m/s. Gefragt sind m/min.' },
      { ask: 0, v: (Math.PI * p.d * p.n) / 2000, msg: 'Du hast den Radius statt den Durchmesser genommen. Es heisst π · d, mit dem ganzen Durchmesser.' },
    ],
    tipps: () => ['v_c = π · d · n', 'd in m einsetzen: mm durch 1000.', 'n in 1/min gibt direkt m/min.'],
    loesung: (p) => [`${eq('v_c = π · ' + fmt(p.d / 1000, 3) + ' m · ' + p.n + '/min = ' + w(fmt(vmin(p.d, p.n)) + ' m/min'))}`],
  }),

  task({
    id: 'v17', karte: 'umfang', stufe: 1, familie: 'rechnen', src: 'eigene Variante zu Buch Nr. 1',
    title: 'Velorad',
    gen: () => ({ d: pick([622, 660, 700]), n: pick([150, 200, 250]) }),
    draw: (p) => B.rund({ name: 'Velorad', fill: '#e6eef7', d: `d = ${p.d} mm`, n: `n = ${p.n}/min`, v: 'v = ?' }),
    text: (p) => `Ein Velorad hat ${l('d = ' + p.d + ' mm')} und dreht mit n = ${p.n}/min. Wie schnell fährt das Velo a) in m/min und b) in km/h?`,
    asks: (p) => [
      { k: 'a) v', unit: 'm/min', v: vmin(p.d, p.n) },
      { k: 'b) v', unit: 'km/h', v: vmin(p.d, p.n) * 0.06 },
    ],
    fehler: (p) => [
      { ask: 0, v: vmin(p.d, p.n) / 2, msg: 'Du hast den Radius statt den Durchmesser genommen. Der Umfang ist π · d.' },
      { ask: 1, v: vmin(p.d, p.n) / 60, msg: 'Du hast durch 60 geteilt. Das gibt m/s. Für km/h: mal 60, dann durch 1000.' },
    ],
    tipps: () => ['Das Rad rollt ohne Rutschen. Fahrgeschwindigkeit = Umfangsgeschwindigkeit.', 'v = π · d · n gibt m/min.', 'Für km/h: m/min mal 60 gibt m/h. Dann durch 1000.'],
    loesung: (p) => [
      `a) ${eq('v = π · ' + fmt(p.d / 1000, 3) + ' · ' + p.n + ' = ' + w(fmt(vmin(p.d, p.n)) + ' m/min'))}`,
      `b) ${eq(fmt(vmin(p.d, p.n)) + ' · 60 : 1000 = ' + w(fmt(vmin(p.d, p.n) * 0.06) + ' km/h'))}`,
    ],
  }),

  task({
    id: 'v18', karte: 'umfang', stufe: 2, familie: 'schaetzen', src: 'Kreativ · Abschätzen, ohne Taschenrechner',
    title: 'Winkelschleifer im Kopf',
    gen: () => ({ d: pick([100, 125, 150]), n: pick([3000, 6000, 9000]) }),
    draw: (p) => B.rund({ name: 'Trennscheibe', fill: '#d7dbe2', d: `d = ${p.d} mm`, n: `n = ${p.n}/min`, v: 'v ≈ ?' }),
    text: (p) => `Ohne Taschenrechner: Eine Trennscheibe hat ${l('d = ' + p.d + ' mm')} und dreht mit n = ${p.n}/min. Wie schnell ist der Rand in m/s? Rechne mit π ≈ 3. Eine Abweichung von 8 % ist erlaubt.`,
    asks: (p) => [{ k: 'v', unit: 'm/s', v: vmin(p.d, p.n) / 60, tol: 0.08 }],
    fehler: (p) => [{ ask: 0, v: vmin(p.d, p.n), msg: 'Das ist m/min. Teile durch 60 für m/s.' }],
    tipps: () => ['Rechne mit π ≈ 3. d in m: mm durch 1000.', 'Erst 3 mal d, dann mal n. Das gibt m/min.', 'Durch 60 für m/s. Rechne mit gerundeten Zahlen.'],
    loesung: (p) => [
      `Schätzung: ${eq('3 · ' + fmt(p.d / 1000, 3) + ' · ' + p.n + ' : 60 ≈ ' + fmt((3 * p.d / 1000 * p.n) / 60) + ' m/s')}`,
      `Genau: ${fmt(vmin(p.d, p.n) / 60)} m/s. Die Schätzung liegt nahe daran.`,
    ],
  }),

  task({
    id: 'v19', karte: 'umfang', stufe: 2, familie: 'waswaere', src: 'Kreativ · Was wäre wenn',
    title: 'Was wäre wenn: Scheibe nutzt sich ab',
    gen: () => {
      const [d, d2] = pick([[230, 180], [200, 150], [180, 140]]);
      return { d, d2, n: pick([6000, 8000]) };
    },
    draw: (p) => B.rund({ name: 'Trennscheibe', fill: '#d7dbe2', d: `d = ${p.d} mm`, n: `n = ${p.n}/min`, v: 'v = ?' }),
    text: (p) => `Eine neue Trennscheibe hat ${l('d = ' + p.d + ' mm')}. Sie läuft mit n = ${p.n}/min. Nach einiger Zeit ist sie auf ${l(p.d2 + ' mm')} abgenutzt. Die Drehzahl bleibt gleich. a) Was passiert mit der Umfangsgeschwindigkeit? b) Wie gross ist sie jetzt in m/s?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Änderung',
        opts: ['v sinkt im gleichen Verhältnis wie d.', 'v bleibt gleich, weil n gleich bleibt.', 'v steigt, weil die Scheibe kleiner wird.', 'v sinkt doppelt so stark wie d.'],
        a: 0,
        why: [undefined, 'Nur n bleibt gleich. v hängt auch von d ab: v = π · d · n.', 'Ein kleinerer Umfang ist pro Umdrehung kürzer. v sinkt.', 'v ist proportional zu d, nicht zu d². Es sinkt im gleichen Verhältnis.'],
      },
      { k: 'b) v neu', unit: 'm/s', v: vmin(p.d2, p.n) / 60 },
    ],
    fehler: (p) => [
      { ask: 1, v: vmin(p.d, p.n) / 60, msg: 'Das ist die Geschwindigkeit der neuen Scheibe. Setze den abgenutzten Durchmesser ein.' },
      { ask: 1, v: vmin(p.d2, p.n), msg: 'Das ist m/min. Teile durch 60 für m/s.' },
    ],
    tipps: () => ['v = π · d · n. Welche Grösse ändert sich?', 'Nur d wird kleiner. n bleibt.', 'Setze den neuen Durchmesser ein.'],
    loesung: (p) => [
      `Neu: ${eq('v = π · ' + fmt(p.d2 / 1000, 3) + ' · ' + p.n + ' : 60 = ' + w(fmt(vmin(p.d2, p.n) / 60) + ' m/s'))}`,
      `Vorher: ${fmt(vmin(p.d, p.n) / 60)} m/s. Verhältnis: ${fmt(p.d2 / p.d, 2)}. Bei gleicher Drehzahl ändert sich v im gleichen Verhältnis wie d.`,
      'Darum hat eine abgenutzte Scheibe weniger Schnittleistung. Man schaltet auf eine höhere Drehzahl oder tauscht die Scheibe.',
    ],
  }),

  // ---------- Drehzahl und Durchmesser bestimmen ----------

  task({
    id: 'v20', karte: 'drehzahl', stufe: 2, familie: 'umgekehrt', src: 'nach Buch kreisförmige Bewegung, Nr. 2',
    title: 'Drehzahlen beim Längsdrehen',
    gen: () => ({ v: pick([50, 70, 90, 120]) }),
    draw: (p) => B.rund({ name: 'Werkstück (Längsdrehen)', d: 'd = 25 … 150 mm', n: 'n = ?', v: `v_c = ${p.v} m/min` }),
    text: (p) => `Beim Längsdrehen soll die Schnittgeschwindigkeit ${w('v_c = ' + p.v + ' m/min')} betragen. Welche Drehzahlen sind für die Durchmesser 25, 40, 80 und 150 mm nötig? Im Buch liest du sie aus dem Schaubild ab. Hier rechnest du sie.`,
    asks: (p) => [25, 40, 80, 150].map((d) => ({ k: 'n bei ' + d + ' mm', unit: '1/min', v: nvon(p.v, d) })),
    fehler: (p) => [
      { ask: 0, v: p.v / (Math.PI * 25), msg: 'Du hast d in mm eingesetzt. Rechne d zuerst in m um: durch 1000.' },
      { ask: 3, v: nvon(p.v, 75), msg: 'Du hast mit dem Radius gerechnet. Setze den Durchmesser ein: 150 mm.' },
    ],
    tipps: () => ['Stelle v = π · d · n nach n um.', 'n = v : (π · d). d in m.', 'Grosser Durchmesser braucht kleine Drehzahl.'],
    loesung: (p) => [25, 40, 80, 150].map((d) => `${eq('n = ' + p.v + ' : (π · ' + fmt(d / 1000, 3) + ') = ' + fmt(nvon(p.v, d)) + '/min')}`),
  }),

  task({
    id: 'v21', karte: 'drehzahl', stufe: 1, familie: 'umgekehrt', src: 'nach Buch kreisförmige Bewegung, Nr. 5',
    title: 'Kleine Schleifscheibe',
    gen: () => ({ d: pick([32, 45, 60]), v: pick([15, 18, 25]) }),
    draw: (p) => B.rund({ name: 'Schleifscheibe', fill: '#e8d9b5', d: `d = ${p.d} mm`, n: 'n = ?', v: `v_c = ${p.v} m/s` }),
    text: (p) => `Eine Schleifscheibe mit ${l('d = ' + p.d + ' mm')} soll mit ${w('v_c = ' + p.v + ' m/s')} arbeiten. Welche Drehzahl ist nötig?`,
    asks: (p) => [{ k: 'n', unit: '1/min', v: nvon(p.v * 60, p.d) }],
    fehler: (p) => [
      { ask: 0, v: nvon(p.v, p.d), msg: 'Du hast m/s eingesetzt. Die Drehzahl steht in 1/min: rechne v zuerst in m/min, mal 60.' },
    ],
    tipps: () => ['Zuerst v in m/min: m/s mal 60.', 'n = v : (π · d), d in m.', 'Kleine Scheiben brauchen hohe Drehzahlen.'],
    loesung: (p) => [`${eq('n = ' + p.v * 60 + ' m/min : (π · ' + fmt(p.d / 1000, 3) + ' m) = ' + w(fmt(nvon(p.v * 60, p.d)) + '/min'))}`],
  }),

  task({
    id: 'v22', karte: 'drehzahl', stufe: 1, familie: 'umgekehrt', src: 'nach Buch kreisförmige Bewegung, Nr. 7',
    title: 'Schaftfräser',
    gen: () => ({ d: pick([4, 6, 8, 10]), v: pick([30, 45, 60]) }),
    draw: (p) => B.rund({ name: 'Schaftfräser (Querschnitt)', fill: '#f3d98b', d: `d = ${p.d} mm`, n: 'n = ?', v: `v_c = ${p.v} m/min` }),
    text: (p) => `Ein Schaftfräser mit ${l('d = ' + p.d + ' mm')} soll mit ${w('v_c = ' + p.v + ' m/min')} einen hochfesten Stahl bearbeiten. Welche Drehzahl ist nötig?`,
    asks: (p) => [{ k: 'n', unit: '1/min', v: nvon(p.v, p.d) }],
    fehler: (p) => [
      { ask: 0, v: p.v / (Math.PI * p.d), msg: 'Du hast d in mm eingesetzt. Teile d zuerst durch 1000.' },
      { ask: 0, v: nvon(p.v, p.d / 2), msg: 'Du hast den Radius statt den Durchmesser eingesetzt.' },
    ],
    tipps: () => ['n = v_c : (π · d)', 'd in m: mm durch 1000.', 'Kleine Werkzeuge brauchen hohe Drehzahlen.'],
    loesung: (p) => [`${eq('n = ' + p.v + ' : (π · ' + fmt(p.d / 1000, 3) + ') = ' + w(fmt(nvon(p.v, p.d)) + '/min'))}`, 'Kleine Werkzeuge brauchen hohe Drehzahlen.'],
  }),

  task({
    id: 'v23', karte: 'drehzahl', stufe: 2, familie: 'umgekehrt', src: 'nach Buch kreisförmige Bewegung, Nr. 4',
    title: 'Höchstdrehzahl einer Schleifscheibe',
    gen: () => ({ d: pick([150, 180, 200, 250]), v1: 25, v2: 35 }),
    draw: (p) => B.rund({ name: 'Schleifscheibe', fill: '#e8d9b5', d: `d = ${p.d} mm`, n: 'n_max = ?', v: 'v ≤ 25 bzw. 35 m/s' }),
    text: (p) => `Eine Schleifscheibe mit ${l('d = ' + p.d + ' mm')} darf am Umfang höchstens ${p.v1} m/s (Zustellung von Hand) bzw. ${p.v2} m/s (maschinell) erreichen. Welche Drehzahl darf sie in beiden Fällen höchstens haben?`,
    asks: (p) => [
      { k: 'n von Hand', unit: '1/min', v: nvon(p.v1 * 60, p.d) },
      { k: 'n maschinell', unit: '1/min', v: nvon(p.v2 * 60, p.d) },
    ],
    fehler: (p) => [
      { ask: 0, v: nvon(p.v1, p.d), msg: 'Du hast m/s eingesetzt. Rechne v zuerst in m/min: mal 60.' },
      { ask: 1, v: nvon(p.v1 * 60, p.d), msg: 'Das ist die Drehzahl für Handzustellung. Hier gilt die höhere Geschwindigkeit: 35 m/s.' },
    ],
    tipps: () => ['m/s zuerst in m/min umrechnen: mal 60.', 'n = v : (π · d), d in m.', 'Zwei Geschwindigkeiten ergeben zwei Drehzahlen.'],
    loesung: (p) => [
      `${eq(p.v1 + ' m/s = ' + p.v1 * 60 + ' m/min')}, ${eq('n = ' + p.v1 * 60 + ' : (π · ' + fmt(p.d / 1000, 3) + ') = ' + fmt(nvon(p.v1 * 60, p.d)) + '/min')}`,
      `${eq(p.v2 + ' m/s = ' + p.v2 * 60 + ' m/min')}, ${eq('n = ' + p.v2 * 60 + ' : (π · ' + fmt(p.d / 1000, 3) + ') = ' + fmt(nvon(p.v2 * 60, p.d)) + '/min')}`,
      'Warnung: Diese Drehzahl darf nie überschritten werden. Sonst kann die Scheibe zerspringen und Personen verletzen.',
    ],
  }),

  task({
    id: 'v24', karte: 'drehzahl', stufe: 2, familie: 'umgekehrt', src: 'eigene Variante zu Buch Nr. 4',
    title: 'Kreissägeblatt',
    gen: () => ({ d: pick([190, 250, 315]), v: pick([50, 60, 70]) }),
    draw: (p) => B.rund({ name: 'Kreissägeblatt', fill: '#d7dbe2', d: `d = ${p.d} mm`, n: 'n_max = ?', v: `v ≤ ${p.v} m/s` }),
    text: (p) => `Ein Kreissägeblatt mit ${l('d = ' + p.d + ' mm')} darf am Umfang höchstens ${p.v} m/s erreichen. Welche Drehzahl darf die Säge höchstens haben?`,
    asks: (p) => [{ k: 'n_max', unit: '1/min', v: nvon(p.v * 60, p.d) }],
    fehler: (p) => [{ ask: 0, v: nvon(p.v, p.d), msg: 'Du hast m/s eingesetzt. Rechne v zuerst in m/min: mal 60.' }],
    tipps: () => ['m/s mal 60 gibt m/min.', 'n = v : (π · d)', 'd in m.'],
    loesung: (p) => [`${eq('n = ' + p.v * 60 + ' : (π · ' + fmt(p.d / 1000, 3) + ') = ' + fmt(nvon(p.v * 60, p.d)) + '/min')}`],
  }),

  task({
    id: 'v25', karte: 'drehzahl', stufe: 2, familie: 'umgekehrt', src: 'nach Buch kreisförmige Bewegung, Nr. 8',
    title: 'Antriebsrolle eines Transportbands',
    gen: () => ({ n: pick([200, 250, 315, 400]), v: pick([30, 40, 50]) }),
    draw: (p) => B.rund({ name: 'Antriebsrolle', d: 'd = ?', n: `n = ${p.n}/min`, v: `v = ${p.v} m/min` }),
    text: (p) => `Die Antriebsrolle eines Transportbands dreht mit n = ${p.n}/min. Das Band soll ${w('v = ' + p.v + ' m/min')} erreichen. Welchen Durchmesser in mm muss die Rolle haben?`,
    asks: (p) => [{ k: 'd', unit: 'mm', v: (p.v / (Math.PI * p.n)) * 1000 }],
    fehler: (p) => [
      { ask: 0, v: p.v / (Math.PI * p.n) / 2 * 1000, msg: 'Das ist der Radius. Gefragt ist der Durchmesser: mal 2.' },
      { ask: 0, v: (p.v * p.n) / Math.PI, msg: 'Du hast mit n multipliziert. Beim Umstellen nach d teilst du durch n.' },
    ],
    tipps: () => ['v = π · d · n nach d umstellen.', 'd = v : (π · n). Das Resultat ist in m.', 'Mal 1000 für mm.'],
    loesung: (p) => [`${eq('d = ' + p.v + ' : (π · ' + p.n + ') = ' + fmt((p.v / (Math.PI * p.n)), 4) + ' m = ' + l(fmt((p.v / (Math.PI * p.n)) * 1000) + ' mm'))}`],
  }),

  task({
    id: 'v26', karte: 'drehzahl', stufe: 2, familie: 'umgekehrt', src: 'nach Buch kreisförmige Bewegung, Nr. 9',
    title: 'Grösster Walzendurchmesser',
    gen: () => ({ n: pick([10, 14, 18]), v: pick([40, 50, 60]) }),
    draw: (p) => B.rund({ name: 'Walze', d: 'd_max = ?', n: `n = ${p.n}/min`, v: `v ≤ ${p.v} m/min` }),
    text: (p) => `Eine Drehmaschine hat die kleinste Drehzahl ${p.n}/min. Die Schnittgeschwindigkeit darf höchstens ${p.v} m/min sein. Welcher grösste Walzendurchmesser kann noch bearbeitet werden (in mm)?`,
    asks: (p) => [{ k: 'd', unit: 'mm', v: (p.v / (Math.PI * p.n)) * 1000 }],
    fehler: (p) => [{ ask: 0, v: (p.v / (Math.PI * p.n)) * 500, msg: 'Das ist der Radius. Gefragt ist der Durchmesser: mal 2.' }],
    tipps: () => ['d = v : (π · n)', 'Der grösste Durchmesser gehört zur kleinsten Drehzahl.', 'Das Resultat ist in m. Mal 1000 für mm.'],
    loesung: (p) => [`${eq('d = ' + p.v + ' : (π · ' + p.n + ') = ' + fmt(p.v / (Math.PI * p.n), 3) + ' m = ' + l(fmt((p.v / (Math.PI * p.n)) * 1000) + ' mm'))}`],
  }),

  task({
    id: 'v27', karte: 'drehzahl', stufe: 3, familie: 'rechnen', src: 'nach Buch kreisförmige Bewegung, Nr. 10',
    title: 'Seiltrommel mit zwei Drehzahlen',
    gen: () => ({ d: pick([180, 220, 250]), n1: pick([20, 30, 40]), v2: pick([50, 70, 90]) }),
    draw: (p) => B.rund({ name: 'Seiltrommel', seil: true, d: `d = ${p.d} mm`, n: `n_1 = ${p.n1}/min`, v: 'v_1, v_2' }),
    text: (p) => `Eine Seiltrommel mit ${l('d = ' + p.d + ' mm')} kann mit zwei Drehzahlen angetrieben werden. a) Mit welcher Geschwindigkeit v_1 holt sie das Seil bei n_1 = ${p.n1}/min ein? b) Wie gross muss n_2 sein, damit das Seil mit ${w('v_2 = ' + p.v2 + ' m/min')} abläuft?`,
    asks: (p) => [
      { k: 'a) v_1', unit: 'm/min', v: vmin(p.d, p.n1) },
      { k: 'b) n_2', unit: '1/min', v: nvon(p.v2, p.d) },
    ],
    fehler: (p) => [
      { ask: 0, v: (Math.PI * p.d * p.n1) / 1000 / 2, msg: 'Du hast den Radius statt den Durchmesser genommen. Der Umfang ist π · d.' },
      { ask: 1, v: p.v2 * Math.PI * (p.d / 1000), msg: 'Du hast multipliziert. Für n stellst du um: n = v : (π · d).' },
    ],
    tipps: () => ['Das Seil hat die Umfangsgeschwindigkeit der Trommel.', 'a) v = π · d · n. b) n = v : (π · d).', 'd in m einsetzen.'],
    loesung: (p) => [
      `a) ${eq('v_1 = π · ' + fmt(p.d / 1000, 3) + ' · ' + p.n1 + ' = ' + w(fmt(vmin(p.d, p.n1)) + ' m/min'))}`,
      `b) ${eq('n_2 = ' + p.v2 + ' : (π · ' + fmt(p.d / 1000, 3) + ') = ' + fmt(nvon(p.v2, p.d)) + '/min')}`,
    ],
  }),

  task({
    id: 'v28', karte: 'drehzahl', stufe: 2, familie: 'fehler', src: 'Kreativ · Fehler finden',
    title: 'Fehler finden: Drehzahl',
    gen: () => ({ v: pick([60, 80, 100]), d: pick([40, 50, 63]) }),
    draw: (p) => B.rund({ name: 'Werkstück', d: `d = ${p.d} mm`, n: 'n = ?', v: `v_c = ${p.v} m/min` }),
    text: (p) => `Ein Werkstück mit ${l('d = ' + p.d + ' mm')} soll mit ${w('v_c = ' + p.v + ' m/min')} gedreht werden. Anna rechnet: «n = v_c : (π · d) = ${p.v} : (π · ${p.d}) = ${fmt(p.v / (Math.PI * p.d), 2)}/min». a) Was ist falsch? b) Wie gross ist n richtig?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Fehler',
        opts: [
          'Sie hat d in mm eingesetzt. Es muss in m sein.',
          'Sie muss mit π multiplizieren statt teilen.',
          'Sie muss v noch durch 60 teilen.',
          'Nichts, die Rechnung stimmt.',
        ],
        a: 0,
        why: [
          undefined,
          'Doch, man teilt durch π · d. Aus v = π · d · n folgt n = v : (π · d).',
          'Hier steht v schon in m/min. Das passt zu n in 1/min.',
          'Eine Drehzahl von weniger als 1 pro Minute ist nicht möglich. Die Maschine stünde fast still.',
        ],
      },
      { k: 'b) n richtig', unit: '1/min', v: nvon(p.v, p.d) },
    ],
    fehler: (p) => [{ ask: 1, v: p.v / (Math.PI * p.d), msg: 'Das ist Annas Wert. Sie hat d in mm eingesetzt. Teile d durch 1000.' }],
    tipps: () => ['Ist eine Drehzahl von 0,5/min sinnvoll?', 'Schau auf die Einheit von d in der Formel.', 'd in m: mm durch 1000.'],
    loesung: (p) => [
      'Anna hat d in mm statt in m eingesetzt. Ihr Resultat ist 1000-mal zu klein.',
      `Richtig: ${eq('n = ' + p.v + ' : (π · ' + fmt(p.d / 1000, 3) + ') = ' + w(fmt(nvon(p.v, p.d)) + '/min'))}`,
    ],
  }),

  // ---------- Zwei Bewegungen zusammen ----------

  task({
    id: 'v29', karte: 'zusammen', stufe: 3, familie: 'rechnen', src: 'nach Buch geradlinige Bewegung, Nr. 7',
    title: 'Laufkran: zwei Bewegungen gleichzeitig',
    gen: () => ({ vH: pick([5, 6.3, 8]), vW: pick([15, 19, 24]), t: pick([20, 24, 30]) }),
    draw: (p) => B.hallenkran({ vH: p.vH, vW: p.vW }),
    loesungsbild: (p) => B.hallenkran({ vH: p.vH, vW: p.vW, res: true, labR: `v = ${fmt(Math.hypot(p.vH, p.vW))} m/min` }),
    text: (p) => `Ein Hallenkran hebt eine Last mit ${w('v_H = ' + fmt(p.vH) + ' m/min')} und fährt sie gleichzeitig waagrecht mit ${w('v_W = ' + p.vW + ' m/min')}. Berechne a) die resultierende Geschwindigkeit v, b) den Weg der Last in ${p.t} s und c) den Winkel α zur Waagrechten.`,
    asks: (p) => {
      const v = Math.hypot(p.vH, p.vW);
      return [
        { k: 'a) v', unit: 'm/min', v },
        { k: 'b) s', unit: 'm', v: (v * p.t) / 60 },
        { k: 'c) α', unit: '°', v: deg(Math.atan2(p.vH, p.vW)) },
      ];
    },
    fehler: (p) => {
      const v = Math.hypot(p.vH, p.vW);
      return [
        { ask: 0, v: p.vH + p.vW, msg: 'Du hast die Beträge addiert. Die zwei Geschwindigkeiten stehen rechtwinklig. Du brauchst Pythagoras.' },
        { ask: 1, v: v * p.t, msg: 'Du hast t in s eingesetzt. v steht in m/min: rechne t zuerst in min, durch 60.' },
        { ask: 2, v: deg(Math.atan2(p.vW, p.vH)), msg: 'Das ist der Winkel zur Senkrechten. Gefragt ist der Winkel zur Waagrechten: tan α = v_H : v_W.' },
      ];
    },
    tipps: () => ['Die zwei Geschwindigkeiten stehen rechtwinklig. Du setzt sie wie Kräfte zusammen.', 'v = √(v_H² + v_W²). Weg s = v · t mit t in min. tan α = v_H : v_W.', 'Warnung: t ist in s, v in m/min. Rechne t durch 60 in min, sonst wird der Weg 60-mal zu gross.'],
    loesung: (p) => {
      const v = Math.hypot(p.vH, p.vW);
      return [
        `a) ${eq(w('v') + ' = √(' + fmt(p.vH) + '² + ' + p.vW + '²) = ' + w(fmt(v, 3) + ' m/min'))}`,
        `b) ${eq(p.t + ' s = ' + fmt(p.t / 60, 2) + ' min')}, ${eq(l('s') + ' = ' + fmt(v, 3) + ' · ' + fmt(p.t / 60, 2) + ' = ' + l(fmt((v * p.t) / 60, 3) + ' m'))}`,
        `c) ${eq('tan α = ' + fmt(p.vH) + ' : ' + p.vW + ' ⇒ α = ' + fmt(deg(Math.atan2(p.vH, p.vW)), 1) + '°')}`,
      ];
    },
  }),

  task({
    id: 'v30', karte: 'zusammen', stufe: 2, familie: 'rechnen', src: 'eigene Variante zu Buch Nr. 7',
    title: 'Boot über den Fluss',
    gen: () => ({ vB: pick([2, 2.5, 3]), vS: pick([1, 1.5, 2]), b: pick([60, 80, 100]) }),
    draw: (p) => B.fluss({ vB: `v_B = ${fmt(p.vB, 1)} m/s`, vS: `v_S = ${fmt(p.vS, 1)} m/s`, b: `b = ${p.b} m` }),
    text: (p) => `Ein Boot fährt quer über einen Fluss (${l('b = ' + p.b + ' m')}) mit ${w('v_B = ' + fmt(p.vB, 1) + ' m/s')}. Die Strömung treibt es mit ${w('v_S = ' + fmt(p.vS, 1) + ' m/s')} ab. Berechne a) die resultierende Geschwindigkeit, b) die Zeit bis zum anderen Ufer und c) wie weit das Boot flussabwärts abgetrieben wird.`,
    asks: (p) => [
      { k: 'a) v', unit: 'm/s', v: Math.hypot(p.vB, p.vS) },
      { k: 'b) t', unit: 's', v: p.b / p.vB },
      { k: 'c) Abtrieb', unit: 'm', v: (p.vS * p.b) / p.vB },
    ],
    fehler: (p) => [
      { ask: 0, v: p.vB + p.vS, msg: 'Du hast die Beträge addiert. Die Geschwindigkeiten stehen rechtwinklig. Du brauchst Pythagoras.' },
      { ask: 1, v: p.b / Math.hypot(p.vB, p.vS), msg: 'Du hast die resultierende Geschwindigkeit mit der Breite verrechnet. Das Boot muss nur quer über b. Dafür zählt nur v_B.' },
      { ask: 2, v: p.vS * p.b, msg: 'Du hast die Breite statt die Zeit genommen. Abtrieb = v_S · t.' },
    ],
    tipps: () => ['Wie beim Laufkran: zwei rechtwinklige Geschwindigkeiten.', 'Die Zeit hängt nur von der Quergeschwindigkeit ab: t = b : v_B.', 'Abtrieb = v_S · t'],
    loesung: (p) => [
      `a) ${eq('v = √(' + fmt(p.vB, 1) + '² + ' + fmt(p.vS, 1) + '²) = ' + fmt(Math.hypot(p.vB, p.vS), 3) + ' m/s')}`,
      `b) ${eq('t = b : v_B = ' + p.b + ' m : ' + fmt(p.vB, 1) + ' m/s = ' + fmt(p.b / p.vB) + ' s')}`,
      `c) ${eq(fmt(p.vS, 1) + ' m/s · ' + fmt(p.b / p.vB) + ' s = ' + fmt((p.vS * p.b) / p.vB) + ' m')}`,
      'Die Strömung verlängert die Fahrzeit nicht. Sie verschiebt nur den Landepunkt.',
    ],
  }),

  task({
    id: 'v31', karte: 'zusammen', stufe: 2, familie: 'begruenden', src: 'Kreativ · Begründen',
    title: 'Begründen: Stärkere Strömung',
    gen: () => ({ vB: pick([2, 2.5, 3]), vS: pick([1, 1.5]), b: pick([60, 80, 100]) }),
    draw: (p) => B.fluss({ vB: `v_B = ${fmt(p.vB, 1)} m/s`, vS: `v_S = ${fmt(p.vS, 1)} m/s`, b: `b = ${p.b} m` }),
    text: (p) => `Ein Boot fährt mit ${w('v_B = ' + fmt(p.vB, 1) + ' m/s')} quer über einen Fluss (${l('b = ' + p.b + ' m')}). Die Strömung ist ${w('v_S = ' + fmt(p.vS, 1) + ' m/s')}. Nach einem Gewitter ist die Strömung doppelt so schnell. a) Was ändert sich? b) Wie weit wird das Boot jetzt abgetrieben (in m)?`,
    asks: (p) => [
      {
        kind: 'choice', k: 'a) Wirkung',
        opts: [
          'Die Fahrzeit bleibt gleich. Nur der Abtrieb wird doppelt so gross.',
          'Die Fahrzeit wird länger, weil das Boot schneller wird.',
          'Die Fahrzeit wird kürzer, weil die Strömung mithilft.',
          'Das Boot kommt gar nicht mehr am anderen Ufer an.',
        ],
        a: 0,
        why: [
          undefined,
          'Quer zum Ufer zählt nur v_B. Das ändert nicht. Die Fahrzeit bleibt.',
          'Die Strömung schiebt längs zum Ufer, nicht quer. Sie hilft nicht beim Queren.',
          'Das Boot kommt an. Es landet nur weiter flussabwärts.',
        ],
      },
      { k: 'b) Abtrieb', unit: 'm', v: (2 * p.vS * p.b) / p.vB },
    ],
    fehler: (p) => [
      { ask: 1, v: (p.vS * p.b) / p.vB, msg: 'Das ist der Abtrieb bei der alten Strömung. Rechne mit der doppelten Strömung.' },
      { ask: 1, v: (4 * p.vS * p.b) / p.vB, msg: 'Der Abtrieb wird nur doppelt so gross, nicht viermal. Er ist v_S · t, und t bleibt gleich.' },
    ],
    tipps: () => ['Zwei Bewegungen laufen unabhängig: quer und längs.', 'Quer: t = b : v_B. Das ändert sich nicht.', 'Längs: Abtrieb = 2 · v_S · t.'],
    loesung: (p) => [
      `Zeit: ${eq('t = ' + p.b + ' : ' + fmt(p.vB, 1) + ' = ' + fmt(p.b / p.vB) + ' s')}. Sie bleibt gleich.`,
      `Abtrieb: ${eq('2 · ' + fmt(p.vS, 1) + ' m/s · ' + fmt(p.b / p.vB) + ' s = ' + fmt((2 * p.vS * p.b) / p.vB) + ' m')}`,
    ],
  }),

  task({
    id: 'v32', karte: 'zusammen', stufe: 2, familie: 'bild', src: 'Kreativ · Bild deuten',
    title: 'Bild deuten: Kran mit Diagonale',
    gen: () => {
      const [vH, vW] = pick([[6, 8], [5, 12], [9, 12], [8, 15], [12, 16]]);
      return { vH, vW };
    },
    draw: (p) => B.hallenkran({ vH: p.vH, vW: p.vW, res: true, labR: 'v = ?' }),
    text: (p) => `Das Bild zeigt die Bewegung einer Kranlast. Die Last hebt mit ${w('v_H = ' + p.vH + ' m/min')} und fährt mit ${w('v_W = ' + p.vW + ' m/min')} seitwärts. Der dicke Pfeil ist die resultierende Geschwindigkeit. Lies aus dem Bild ab, wie die Pfeile stehen. Berechne a) v und b) den Winkel α zur Waagrechten.`,
    asks: (p) => [
      { k: 'a) v', unit: 'm/min', v: Math.hypot(p.vH, p.vW) },
      { k: 'b) α', unit: '°', v: deg(Math.atan2(p.vH, p.vW)) },
    ],
    fehler: (p) => [
      { ask: 0, v: p.vH + p.vW, msg: 'Du hast addiert. Der dicke Pfeil ist die Diagonale. Sie ist kürzer als die Summe der zwei Seiten.' },
      { ask: 1, v: deg(Math.atan2(p.vW, p.vH)), msg: 'Das ist der Winkel zur Senkrechten. Der Winkel α im Bild liegt an der Waagrechten.' },
    ],
    tipps: () => ['Die zwei Pfeile bilden ein rechtwinkliges Dreieck. Der dicke Pfeil ist die lange Seite.', 'v = √(v_H² + v_W²). tan α = v_H : v_W.', 'Die Zahlen gehören zu einem bekannten Dreieck. Kontrolliere am Schluss, ob v kleiner als v_H + v_W ist.'],
    loesung: (p) => [
      `a) ${eq(w('v') + ' = √(' + p.vH + '² + ' + p.vW + '²) = ' + w(fmt(Math.hypot(p.vH, p.vW)) + ' m/min'))}`,
      `b) ${eq('tan α = ' + p.vH + ' : ' + p.vW + ' ⇒ α = ' + fmt(deg(Math.atan2(p.vH, p.vW)), 1) + '°')}`,
    ],
  }),

  task({
    id: 'v33', karte: 'zusammen', stufe: 3, familie: 'umgekehrt', src: 'Kreativ · Umgekehrt gefragt',
    title: 'Wie schnell muss die Katze fahren?',
    gen: () => {
      const [v, vH] = pick([[10, 6], [13, 5], [15, 9], [17, 8], [25, 7]]);
      return { v, vH, vW: Math.round(Math.sqrt(v * v - vH * vH)), s: pick([20, 30, 40]) };
    },
    draw: (p) => B.hallenkran({ vH: p.vH, vW: p.vW, res: true, labW: 'v_W = ?', labR: `v = ${p.v} m/min` }),
    text: (p) => `Ein Kran soll eine Last mit ${w('v = ' + p.v + ' m/min')} schräg bewegen. Gehoben wird mit ${w('v_H = ' + p.vH + ' m/min')}. a) Wie schnell muss die Katze seitwärts fahren (v_W)? b) Wie lange dauert ein schräger Weg von ${l(p.s + ' m')} in s?`,
    asks: (p) => [
      { k: 'a) v_W', unit: 'm/min', v: p.vW },
      { k: 'b) t', unit: 's', v: (p.s / p.v) * 60 },
    ],
    fehler: (p) => [
      { ask: 0, v: p.v - p.vH, msg: 'Du hast subtrahiert. Die Geschwindigkeiten stehen rechtwinklig. Es gilt v² = v_H² + v_W².' },
      { ask: 1, v: p.s / p.v, msg: 'Das ist die Zeit in min. Gefragt sind s: mal 60.' },
    ],
    tipps: () => ['Stelle Pythagoras nach v_W um.', 'v_W = √(v² − v_H²)', 'b) t = s : v. Das gibt min. Mal 60 für s.'],
    loesung: (p) => [
      `a) ${eq('v_W = √(' + p.v + '² − ' + p.vH + '²) = √' + (p.v * p.v - p.vH * p.vH) + ' = ' + w(p.vW + ' m/min'))}`,
      `b) ${eq('t = ' + p.s + ' m : ' + p.v + ' m/min = ' + fmt(p.s / p.v, 3) + ' min = ' + fmt((p.s / p.v) * 60) + ' s')}`,
    ],
  }),
];
