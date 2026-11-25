// Aufgaben zu GPS vertieft: Rangordnungsgrössenmasse rechnen, Modifikatoren (ISO 14405-1, -3),
// Material-Bedingung (ISO 2692), Allgemeintoleranz (ISO 22081), Oberfläche (ISO 21920), Bezüge (ISO 5459).
// Zahlen: alle Messwerte auf 0,01 mm. Ergebnisse liegen auf dem 0,01-Raster, damit die Anzeige stimmt.
import { task, type Task, type Fehler } from '../../../core/types';
import { pick } from '../../../core/zahl';
import { fmt } from '../../../core/zahl';
import { reihen, wahl, type P } from './aufgaben';

const pad = (x: number) => x.toFixed(2).replace('.', ',');
const f2 = (h: number) => pad(h / 100);
const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const TOL = 0.0004;
const num = (k: string, h: number) => ({ k, unit: 'mm', v: h / 100, tol: TOL });

/** Messreihe in Hundertstel mm. Wiederholt, bis die Prüfung ok ist. */
function reihe(n: number, ok: (v: number[]) => boolean = () => true) {
  for (let t = 0; t < 20000; t++) {
    const nenn = rnd(5, 9) * 100;
    const v = Array.from({ length: n }, () => nenn + rnd(-12, 12));
    if (new Set(v).size < n - 1) continue;
    if (ok(v)) return v;
  }
  throw new Error('keine Messreihe gefunden');
}
const sorted = (v: number[]) => [...v].sort((a, b) => a - b);
const mx = (v: number[]) => Math.max(...v);
const mn = (v: number[]) => Math.min(...v);
const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const med = (v: number[]) => { const s = sorted(v), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const gridMean = (n: number) => (v: number[]) => v.reduce((a, b) => a + b, 0) % n === 0;
const even = (x: number) => x % 2 === 0;
const protokoll = (v: number[]) => `Zweipunktgrössenmass an ${v.length} Messstellen, in mm: ${v.map((x) => f2(x)).join(' · ')}`;
const weit = (a: number, b: number) => Math.abs(a - b) > 0.0005 * Math.max(a, b);
const fe = (ask: number, h: number, msg: string): Fehler => ({ ask, v: h / 100, msg });

/** Einfache Auswahlfrage mit einer Teilfrage. */
const einfach = (
  id: string, karte: string, stufe: 1 | 2 | 3, familie: Task['familie'], title: string, src: string,
  text: string, richtig: string, falsche: [string, string][], tipps: string[], loesung: string[],
) =>
  task<P>({
    id, karte, stufe, familie, title, src: `nach Swissmem ISO-GPS-Guide, ${src}`,
    gen: reihen,
    text: () => text,
    asks: (p) => [wahl('Antwort', p.o[0], richtig, falsche)],
    tipps: () => tipps,
    loesung: () => loesung,
  });

export const AUFGABEN2: Task[] = [
  // ===== Karte: Rangordnung rechnen =====
  task<{ v: number[] }>({
    id: 'm1', karte: 'rangordnung', stufe: 1, familie: 'rechnen', src: 'nach Swissmem ISO-GPS-Guide, Rangordnungsgrössenmasse (S. 22–27)',
    title: 'Grösstes, kleinstes, Spanne',
    gen: () => ({ v: reihe(rnd(7, 9)) }),
    text: (p) => `${protokoll(p.v)}. Bestimme SX, SN und SR.`,
    asks: (p) => [num('SX', mx(p.v)), num('SN', mn(p.v)), num('SR', mx(p.v) - mn(p.v))],
    fehler: (p) => [fe(2, mx(p.v), 'Das ist SX. Die Spanne SR ist SX minus SN.')],
    tipps: () => ['SX ist der grösste Wert, SN der kleinste.', 'SR ist die Differenz von SX und SN.', 'Suche zuerst den grössten und den kleinsten Messwert.'],
    loesung: (p) => [`SX = ${f2(mx(p.v))} mm`, `SN = ${f2(mn(p.v))} mm`, `SR = SX − SN = ${f2(mx(p.v))} − ${f2(mn(p.v))} = ${f2(mx(p.v) - mn(p.v))} mm`],
  }),
  task<{ v: number[] }>({
    id: 'm2', karte: 'rangordnung', stufe: 2, familie: 'rechnen', src: 'nach Swissmem ISO-GPS-Guide, Mittleres Grössenmass SA',
    title: 'Mittleres Grössenmass SA',
    gen: () => {
      const n = pick([5, 10]);
      return { v: reihe(n, (v) => gridMean(n)(v) && weit(mean(v) / 100, med(v) / 100) && weit(mean(v) / 100, (mx(v) + mn(v)) / 200)) };
    },
    text: (p) => `${protokoll(p.v)}. Bestimme das mittlere Grössenmass SA (arithmetischer Mittelwert).`,
    asks: (p) => [num('SA', mean(p.v))],
    fehler: (p) => [fe(0, med(p.v), 'Das ist der Median SM. SA ist die Summe aller Werte geteilt durch ihre Anzahl.'), fe(0, (mx(p.v) + mn(p.v)) / 2, 'Das ist SD, der Mittelwert aus grösstem und kleinstem Wert. SA nimmt alle Werte.')],
    tipps: () => ['Addiere alle Messwerte.', 'Teile die Summe durch die Anzahl der Messwerte.', 'SA = (x1 + x2 + … + xn) : n'],
    loesung: (p) => [`Summe = ${f2(p.v.reduce((a, b) => a + b, 0))} mm`, `SA = Summe : n = ${f2(p.v.reduce((a, b) => a + b, 0))} : ${p.v.length} = ${f2(mean(p.v))} mm`],
  }),
  task<{ v: number[] }>({
    id: 'm3', karte: 'rangordnung', stufe: 2, familie: 'rechnen', src: 'nach Swissmem ISO-GPS-Guide, Mittelwert aus grösstem und kleinstem Grössenmass SD',
    title: 'Mittelwert aus grösstem und kleinstem SD',
    gen: () => ({ v: reihe(rnd(7, 9), (v) => even(mx(v) + mn(v)) && weit(mean(v) / 100, (mx(v) + mn(v)) / 200)) }),
    text: (p) => `${protokoll(p.v)}. Bestimme SD.`,
    asks: (p) => [num('SD', (mx(p.v) + mn(p.v)) / 2)],
    fehler: (p) => [fe(0, mean(p.v), 'Das ist SA, der Mittelwert aller Werte. SD nimmt nur den grössten und den kleinsten Wert.')],
    tipps: () => ['Du brauchst nur zwei Werte.', 'Suche SX und SN.', 'SD = (SX + SN) : 2'],
    loesung: (p) => [`SX = ${f2(mx(p.v))} mm, SN = ${f2(mn(p.v))} mm`, `SD = (SX + SN) : 2 = ${f2((mx(p.v) + mn(p.v)) / 2)} mm`],
  }),
  task<{ v: number[] }>({
    id: 'm4', karte: 'rangordnung', stufe: 2, familie: 'rechnen', src: 'nach Swissmem ISO-GPS-Guide, Median-Grössenmass SM, ungerade Anzahl',
    title: 'Median bei ungerader Anzahl',
    gen: () => ({ v: reihe(pick([7, 9]), (v) => v[(v.length - 1) / 2] !== med(v)) }),
    text: (p) => `${protokoll(p.v)}. Bestimme das Median-Grössenmass SM.`,
    asks: (p) => [num('SM', med(p.v))],
    fehler: (p) => [fe(0, p.v[(p.v.length - 1) / 2], 'Das ist der mittlere Wert der unsortierten Reihe. Sortiere zuerst der Grösse nach.')],
    tipps: () => ['Sortiere die Werte vom kleinsten zum grössten.', 'Bei ungerader Anzahl gibt es einen Wert genau in der Mitte.', 'Es ist der Wert an der Stelle (n + 1) : 2.'],
    loesung: (p) => [`Sortiert: ${sorted(p.v).map(f2).join(' · ')}`, `Mitte = Stelle ${(p.v.length + 1) / 2}: SM = ${f2(med(p.v))} mm`],
  }),
  task<{ v: number[] }>({
    id: 'm5', karte: 'rangordnung', stufe: 3, familie: 'rechnen', src: 'nach Swissmem ISO-GPS-Guide, Median-Grössenmass SM, gerade Anzahl',
    title: 'Median bei gerader Anzahl',
    gen: () => ({ v: reihe(pick([6, 8]), (v) => { const s = sorted(v), n = s.length; return s[n / 2 - 1] !== s[n / 2] && even(s[n / 2 - 1] + s[n / 2]); }) }),
    text: (p) => `${protokoll(p.v)}. Bestimme das Median-Grössenmass SM.`,
    asks: (p) => [num('SM', med(p.v))],
    fehler: (p) => { const s = sorted(p.v); return [fe(0, s[p.v.length / 2 - 1], 'Das ist nur der untere der beiden mittleren Werte. Bei gerader Anzahl nimmst du den Mittelwert der zwei mittleren.')]; },
    tipps: () => ['Sortiere die Werte.', 'Bei gerader Anzahl gibt es zwei mittlere Werte.', 'SM ist der Mittelwert dieser beiden Werte.'],
    loesung: (p) => { const s = sorted(p.v), n = s.length; return [`Sortiert: ${s.map(f2).join(' · ')}`, `Mittlere Werte: ${f2(s[n / 2 - 1])} und ${f2(s[n / 2])}`, `SM = (${f2(s[n / 2 - 1])} + ${f2(s[n / 2])}) : 2 = ${f2(med(p.v))} mm`]; },
  }),
  task<{ v: number[] }>({
    id: 'm6', karte: 'rangordnung', stufe: 3, familie: 'rechnen', src: 'nach Swissmem ISO-GPS-Guide, Prüfprotokoll mit 9 Messstellen (S. 22–27)',
    title: 'Ganzes Prüfprotokoll',
    gen: () => ({ v: reihe(9, (v) => gridMean(9)(v) && even(mx(v) + mn(v)) && v[4] !== med(v)) }),
    text: (p) => `${protokoll(p.v)}. Bestimme SX, SN, SA, SM und SD.`,
    asks: (p) => [num('SX', mx(p.v)), num('SN', mn(p.v)), num('SA', mean(p.v)), num('SM', med(p.v)), num('SD', (mx(p.v) + mn(p.v)) / 2)],
    tipps: () => ['Sortiere die Werte einmal. Dann liest du SX, SN und SM ab.', 'SA ist die Summe geteilt durch 9.', 'SD ist der Mittelwert von SX und SN.'],
    loesung: (p) => [`Sortiert: ${sorted(p.v).map(f2).join(' · ')}`, `SX = ${f2(mx(p.v))} · SN = ${f2(mn(p.v))} · SM (5. Wert) = ${f2(med(p.v))}`, `SA = ${f2(p.v.reduce((a, b) => a + b, 0))} : 9 = ${f2(mean(p.v))}`, `SD = (${f2(mx(p.v))} + ${f2(mn(p.v))}) : 2 = ${f2((mx(p.v) + mn(p.v)) / 2)} (alles in mm)`],
  }),
  task<{ sx: number; sr: number }>({
    id: 'm7', karte: 'rangordnung', stufe: 3, familie: 'umgekehrt', src: 'nach Swissmem ISO-GPS-Guide, Spanne SR',
    title: 'Kleinstes Mass aus der Spanne',
    gen: () => ({ sx: rnd(5, 9) * 100 + rnd(3, 12), sr: rnd(5, 30) }),
    text: (p) => `Bei einer Prüfung gilt: SX = ${f2(p.sx)} mm und SR = ${f2(p.sr)} mm. Wie gross ist das kleinste Grössenmass SN?`,
    asks: (p) => [num('SN', p.sx - p.sr)],
    fehler: (p) => [fe(0, p.sx + p.sr, 'Du hast addiert. Die Spanne ist SX minus SN, also SN = SX minus SR.')],
    tipps: () => ['SR = SX − SN.', 'Stelle die Gleichung nach SN um.', 'SN = SX − SR'],
    loesung: (p) => [`SR = SX − SN, also SN = SX − SR`, `SN = ${f2(p.sx)} − ${f2(p.sr)} = ${f2(p.sx - p.sr)} mm`],
  }),
  task<{ w: number[]; o: number[][] }>({
    id: 'm8', karte: 'rangordnung', stufe: 2, familie: 'fehler', src: 'nach Swissmem ISO-GPS-Guide, Median-Grössenmass SM',
    title: 'Median falsch bestimmt',
    gen: () => {
      for (;;) {
        const w = Array.from({ length: 5 }, () => rnd(40, 99)).map((x) => x / 10);
        if (new Set(w).size === 5 && w[2] !== sorted(w.map((x) => x * 10))[2] / 10) return { w, o: reihen().o };
      }
    },
    text: (p) => `Ein Kollege hat die Messwerte ${p.w.map((x) => fmt(x, 1)).join(' · ')} und sagt: «Der Median ist ${fmt(p.w[2], 1)}, das ist der Wert in der Mitte.» Was ist falsch?`,
    asks: (p) => [wahl('Fehler', p.o[0], 'Er hat die Werte nicht sortiert', [
      ['Er muss den Mittelwert aller Werte nehmen', 'Nein. Der Mittelwert aller Werte ist SA, nicht der Median SM.'],
      ['Er muss den grössten Wert nehmen', 'Nein. Der grösste Wert ist SX.'],
      ['Bei fünf Werten zählt der zweite Wert', 'Nein. Bei fünf sortierten Werten ist der dritte der mittlere.'],
    ])],
    tipps: () => ['Der Median gehört zu einer sortierten Reihe.', 'Ist die Reihe sortiert?', 'Sortiere, dann nimm den dritten Wert.'],
    loesung: (p) => [`Sortiert: ${sorted(p.w).map((x) => fmt(x, 1)).join(' · ')}`, `Der Median ist ${fmt(sorted(p.w)[2], 1)}.`],
  }),
  task<{ ok: boolean; d: number; sx: number; o: number[][] }>({
    id: 'm9', karte: 'rangordnung', stufe: 3, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Grösstes Grössenmass SX',
    title: 'Gut oder Ausschuss?',
    gen: () => { const ok = Math.random() < 0.5; const d = rnd(5, 9); return { ok, d, sx: d + (ok ? rnd(3, 9) : rnd(11, 16)) / 100, o: reihen().o }; },
    text: (p) => `Auf der Zeichnung steht Ø${p.d} ±0,1 mit dem Modifikator SX. Die Prüfung ergibt SX = ${pad(p.sx)} mm. Ist die Spezifikation erfüllt?`,
    asks: (p) => {
      const ja = 'Ja, SX liegt innerhalb der Grenzen', nein = 'Nein, SX liegt über der oberen Grenze';
      return [wahl('Antwort', p.o[0], p.ok ? ja : nein, p.ok
        ? [[nein, `Nein. Die obere Grenze ist ${pad(p.d + 0.1)} mm. SX liegt darunter.`], ['Nein, die Streuung der Werte ist zu gross', 'Nein. Die Streuung wird hier nicht begrenzt.'], ['Ja, aber nur wenn auch der Mittelwert stimmt', 'Nein. Der Mittelwert wird hier nicht verlangt.']]
        : [[ja, `Nein. Die obere Grenze ist ${pad(p.d + 0.1)} mm. SX liegt darüber.`], ['Ja, der Mittelwert liegt sicher innerhalb', 'Nein. Verlangt ist SX, nicht der Mittelwert.'], ['Nein, SX liegt unter der unteren Grenze', `Nein. Die untere Grenze ist ${pad(p.d - 0.1)} mm. SX liegt darüber.`]])];
    },
    tipps: () => ['Das grösste Grössenmass muss zwischen den Grenzen liegen.', 'Bestimme die obere Grenze: Nennmass plus 0,1.', 'Vergleiche SX mit der oberen Grenze.'],
    loesung: (p) => [`Grenzen: ${pad(p.d - 0.1)} mm bis ${pad(p.d + 0.1)} mm`, `SX = ${pad(p.sx)} mm ${p.ok ? 'liegt in den Grenzen' : 'liegt über der oberen Grenze'}.`],
  }),
  einfach('m10', 'rangordnung', 1, 'begruenden', 'Was beschreibt SQ?', 'Standardabweichung SQ', 'Was sagt die Standardabweichung SQ über eine Messreihe?',
    'Die Streuung der Werte um ihren Mittelwert',
    [['Den Unterschied zwischen grösstem und kleinstem Wert', 'Nein. Das ist die Spanne SR.'], ['Den Wert in der Mitte der sortierten Reihe', 'Nein. Das ist der Median SM.'], ['Den Mittelwert aller Werte', 'Nein. Das ist SA.']],
    ['Es geht um die Streuung.', 'Wie weit liegen die Werte vom Mittelwert weg?', 'SQ ist die Streuung um den Mittelwert.'],
    ['SQ = Standardabweichung der örtlichen Grössenmasse.', 'Beispiel im Guide: Bei 9 Messwerten um 20 mm ergibt sich SQ = 0,0766 mm.']),

  // ===== Karte: Modifikatoren (ISO 14405-1) =====
  task<{ u: number; l: number }>({
    id: 'm11', karte: 'modifikatoren', stufe: 2, familie: 'rechnen', src: 'nach Swissmem ISO-GPS-Guide, Hüllbedingung (S. 29)',
    title: 'Hüllbedingung an der Welle',
    gen: () => { const u = rnd(5, 9) * 100 - rnd(0, 2); return { u, l: u - rnd(2, 6) }; },
    text: (p) => `Eine Welle hat die Grenzmasse ${f2(p.u)} mm und ${f2(p.l)} mm. Es gilt die Hüllbedingung E. Wie gross darf der Durchmesser des kleinsten umschriebenen Zylinders (Hüllzylinder) höchstens sein? Wie klein darf das Zweipunktgrössenmass mindestens sein?`,
    asks: (p) => [num('Hüllzylinder GN, höchstens', p.u), num('Zweipunktmass LP, mindestens', p.l)],
    fehler: (p) => [fe(0, p.l, 'Das ist die untere Grenze. Der Hüllzylinder darf höchstens das obere Grenzmass haben.')],
    tipps: () => ['Bei der Welle liegt die Maximum-Material-Grenze oben.', 'Der Hüllzylinder (GN) begrenzt die Maximum-Material-Seite.', 'Das Zweipunktmass LP begrenzt die Minimum-Material-Seite.'],
    loesung: (p) => [`Hüllzylinder (GN) ≤ oberes Grenzmass = ${f2(p.u)} mm`, `Zweipunktmass (LP) ≥ unteres Grenzmass = ${f2(p.l)} mm`],
  }),
  task<{ u: number; l: number }>({
    id: 'm12', karte: 'modifikatoren', stufe: 2, familie: 'rechnen', src: 'nach Swissmem ISO-GPS-Guide, Hüllbedingung (S. 29)',
    title: 'Hüllbedingung an der Bohrung',
    gen: () => { const l = rnd(5, 9) * 100 + rnd(0, 2); return { l, u: l + rnd(2, 6) }; },
    text: (p) => `Eine Bohrung hat die Grenzmasse ${f2(p.l)} mm und ${f2(p.u)} mm. Es gilt die Hüllbedingung E. Wie klein darf das grösste einbeschriebene Element (Pferchelement) mindestens sein? Wie gross darf das Zweipunktgrössenmass höchstens sein?`,
    asks: (p) => [num('Pferchelement GX, mindestens', p.l), num('Zweipunktmass LP, höchstens', p.u)],
    fehler: (p) => [fe(0, p.u, 'Das ist die obere Grenze. Beim Innenmass liegt die Maximum-Material-Grenze unten.')],
    tipps: () => ['Bei der Bohrung liegt die Maximum-Material-Grenze unten.', 'Das Pferchelement (GX) begrenzt die Maximum-Material-Seite.', 'Das Zweipunktmass LP begrenzt die andere Seite.'],
    loesung: (p) => [`Pferchelement (GX) ≥ unteres Grenzmass = ${f2(p.l)} mm`, `Zweipunktmass (LP) ≤ oberes Grenzmass = ${f2(p.u)} mm`],
  }),
  einfach('m13', 'modifikatoren', 1, 'begruenden', 'Was bewirkt die Hüllbedingung?', 'Hüllbedingung E (S. 29)', 'Eine Welle hat das Mass Ø20 −0,02 mit der Hüllbedingung E. Was gilt für die Form?',
    'Die Formabweichung darf die Masstoleranz nicht überschreiten',
    [['Die Form ist völlig frei', 'Nein. Die Hüllbedingung begrenzt die Form durch die Masstoleranz.'], ['Die Form hat eine eigene, engere Toleranz', 'Nein. Dazu brauchst du eine Formtoleranz. Die Hülle nutzt die Masstoleranz.'], ['Nur die Geradheit ist begrenzt', 'Nein. Auch Rundheit und Parallelität der Mantellinien sind begrenzt.']],
    ['Die Hüllbedingung verbindet Mass und Form.', 'Sie hebt die Unabhängigkeit auf.', 'Form und Parallelität bleiben innerhalb der Masstoleranz.'],
    ['Mit E können Formabweichung und Parallelität gegenüberliegender Mantellinien die Masstoleranz nicht überschreiten.', 'E ist nur bei Grössenmasselementen anwendbar (Kreis, Zylinder, Kugel, parallele Flächen).']),
  task<{ s: number; o: number[][] }>({
    id: 'm14', karte: 'modifikatoren', stufe: 2, familie: 'waswaere', src: 'nach Swissmem ISO-GPS-Guide, berechnete Grössenmasse CC, CA, CV (S. 20–21)',
    title: 'Welcher berechnete Durchmesser?',
    gen: () => ({ s: rnd(0, 2), o: reihen().o }),
    text: (p) => ['Ein O-Ring ist nicht formstabil. Du willst sein Mass über den Umfang festlegen.', 'Ein durchströmtes Rohr soll einen gleichbleibenden Volumenstrom ermöglichen.', 'Ein zylindrisches Bauteil muss nach dem Befüllen ein festes Volumen fassen.'][p.s],
    asks: (p) => {
      const N = ['Umfangsbezogener Durchmesser (CC)', 'Flächenbezogener Durchmesser (CA)', 'Volumenbezogener Durchmesser (CV)'];
      const r = p.s;
      return [wahl('Merkmal', p.o[0], N[r], [...N.filter((_, i) => i !== r).map((n) => [n, `Nein. Passend ist ${N[r]}.`] as [string, string]), ['Zweipunktgrössenmass (LP)', `Nein. Der Standard LP misst nur zwischen zwei Punkten. Passend ist ${N[r]}.`]])];
    },
    tipps: () => ['Es gibt drei berechnete Durchmesser.', 'Umfang, Fläche oder Volumen: Was ist im Text wichtig?', 'O-Ring: Umfang. Durchströmt: Fläche. Befüllt: Volumen.'],
    loesung: (p) => [['CC: Anwendung z. B. bei nicht formstabilen Bauteilen wie O-Ringen.', 'CA: Anwendung bei durchströmten Querschnitten für einen konstanten Volumenstrom.', 'CV: Anwendung bei Bauteilen mit definiertem Volumen, etwa nach dem Befüllen.'][p.s]],
  }),
  task<{ s: number; o: number[][] }>({
    id: 'm15', karte: 'modifikatoren', stufe: 2, familie: 'waswaere', src: 'nach Swissmem ISO-GPS-Guide, globale Grössenmasse GG, GN, GX (S. 17)',
    title: 'Passung oder Prozess?',
    gen: () => ({ s: rnd(0, 1), o: reihen().o }),
    text: (p) => ['Eine Welle muss in eine Bohrung passen (Spiel-, Übergangs- oder Übermasspassung). Welches Merkmal sichert die Passungsfunktion?', 'Du überwachst die Fertigung. Das Messergebnis soll gut reproduzierbar sein und Ausreisser sollen wenig stören. Welches Merkmal passt?'][p.s],
    asks: (p) => {
      const A = ['GN bzw. GX (umschrieben bzw. einbeschrieben)', 'GG (totale kleinste Abweichungsquadrate)'];
      const r = p.s;
      return [wahl('Merkmal', p.o[0], A[r], [[A[1 - r], `Nein. Passend ist ${A[r]}.`], ['SR (Spanne der Grössenmasse)', 'Nein. SR gibt nur die Spanne an.'], ['LS (sphärisches Grössenmass)', 'Nein. LS bezieht sich auf eine Kugel.']])];
    },
    tipps: () => ['Es gibt zwei Anwendungen: Passung und Prozess.', 'Passung: Hülle oder Pferch.', 'Prozess: ein Merkmal, das Ausreisser ausgleicht.'],
    loesung: (p) => [['GN und GX sichern die Passungsfunktion. Lokale Abweichungen sind dabei nicht begrenzt.', 'GG liefert stabile Messergebnisse, weil Ausreisser wenig Einfluss haben. Es eignet sich für die Prozessüberwachung.'][p.s]],
  }),
  task<{ s: number; o: number[][] }>({
    id: 'm16', karte: 'modifikatoren', stufe: 1, familie: 'umgekehrt', src: 'nach Swissmem ISO-GPS-Guide, Querschnitt und Längsschnitt (S. 30–34)',
    title: 'ACS, ALS, SCS',
    gen: () => ({ s: rnd(0, 2), o: reihen().o }),
    text: (p) => `Was bedeutet der Modifikator ${['ACS', 'ALS', 'SCS'][p.s]}?`,
    asks: (p) => {
      const N = ['Beliebiger Querschnitt', 'Beliebiger Längsschnitt', 'Bestimmter Querschnitt'];
      const r = p.s;
      return [wahl('Bedeutung', p.o[0], N[r], [...N.filter((_, i) => i !== r).map((n) => [n, `Nein. ${['ACS', 'ALS', 'SCS'][r]} heisst ${N[r]}.`] as [string, string]), ['Beliebiger Teilbereich', `Nein. ${['ACS', 'ALS', 'SCS'][r]} heisst ${N[r]}.`]])];
    },
    tipps: () => ['A = any (beliebig), S = specific (bestimmt).', 'C = cross section (Querschnitt), L = longitudinal (Längsschnitt).', 'Setze die Buchstaben zusammen.'],
    loesung: (p) => [`${['ACS', 'ALS', 'SCS'][p.s]} = ${['Beliebiger Querschnitt (any cross section)', 'Beliebiger Längsschnitt (any longitudinal section)', 'Bestimmter Querschnitt (specific fixed cross section)'][p.s]}`],
  }),
  einfach('m17', 'modifikatoren', 2, 'begruenden', 'ACS nur mit welchen Merkmalen?', 'ACS (S. 30)', 'Mit welchen Merkmalen darf ACS kombiniert werden?',
    'Mit einem globalen Merkmal (GG, GC, GN, GX) oder der Hüllbedingung',
    [['Nur mit dem Zweipunktgrössenmass LP', 'Nein. ACS gehört zu globalen Merkmalen oder zur Hülle.'], ['Nur mit einem Rangordnungsmass wie SX', 'Nein. Rangordnungsmasse ergänzen örtliche Merkmale.'], ['Mit jedem Merkmal ohne Einschränkung', 'Nein. Es gibt die genannte Einschränkung.']],
    ['ACS legt den Querschnitt fest.', 'Es braucht ein Merkmal, das den Querschnitt auswertet.', 'Globale Merkmale GG, GC, GN, GX oder E.'],
    ['ACS darf nur mit einem globalen Merkmal (GG, GC, GN, GX) oder mit der Hüllbedingung E verwendet werden.']),
  einfach('m18', 'modifikatoren', 3, 'begruenden', 'Wann braucht es den Schnittebenenindikator?', 'Schnittebenenindikator (S. 30–35)', 'Wann musst du bei ACS oder ALS einen Schnittebenenindikator ergänzen?',
    'Wenn die Schnittachse nicht die Achse des tolerierten Elements ist',
    [['Immer, bei jedem ACS und ALS', 'Nein. Bei der eigenen Achse darf er fehlen.'], ['Nie, er ist nur eine Hilfe', 'Nein. In den genannten Fällen ist er zwingend.'], ['Nur bei Bohrungen, nicht bei Wellen', 'Nein. Es hängt von der Achse ab, nicht von Welle oder Bohrung.']],
    ['Es geht um die Achse, zu der der Schnitt gehört.', 'Ist es die eigene Achse des Elements?', 'Ist es eine andere Achse oder eine Dicke, braucht es den Indikator.'],
    ['Der Indikator darf fehlen, wenn die Achse die des tolerierten Elements selbst ist.', 'Bei jeder anderen Achse und bei einer Dicke ist er zwingend.']),
  einfach('m19', 'modifikatoren', 3, 'begruenden', 'Wann ist SCS zwingend?', 'Bestimmter Querschnitt SCS (S. 33)', 'Ein bestimmter Querschnitt wird mit einem TED-Mass festgelegt. Wann muss SCS trotzdem angegeben werden?',
    'Wenn das TED-Mass nicht eindeutig dem Ort der Spezifikation zugeordnet ist',
    [['Nie, das TED-Mass genügt immer', 'Nein. Bei unklarer Zuordnung wäre die Spezifikation mehrdeutig.'], ['Immer, auch bei klarer Zuordnung', 'Nein. Bei klarer Zuordnung darf SCS wegfallen.'], ['Nur bei Wellen mit Hüllbedingung', 'Nein. Der Grund ist die Zuordnung, nicht die Hülle.']],
    ['Es geht um Mehrdeutigkeit.', 'Ist klar, wo der Schnitt liegt?', 'Ohne klare Zuordnung braucht es SCS.'],
    ['Bei klarer Zuordnung kann SCS fehlen. Sonst ist es zwingend, damit die Spezifikation eindeutig bleibt.']),
  task<P>({
    id: 'm20', karte: 'modifikatoren', stufe: 1, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Anzahl nx und Hinweiszeichen (S. 37)',
    title: 'Anzahl und Hinweiszeichen',
    gen: reihen,
    text: () => 'Zwei Fragen zu Ergänzungen an Grössenmassen.',
    asks: (p) => [
      wahl('3x Ø28 +0,05/−0,02', p.o[0], 'Die Spezifikation gilt für drei Grössenmasselemente', [['Das Mass gilt dreimal hintereinander', 'Nein. Es gilt für drei verschiedene Elemente.'], ['Die Toleranz wird dreimal verengt', 'Nein. 3x gibt die Anzahl der Elemente an.'], ['Es gilt nur für das dritte Element', 'Nein. Es gilt für alle drei.']]),
      wahl('Nummeriertes Hinweiszeichen am Ende', p.o[1], 'Eine ergänzende Anforderung, erklärt nahe dem Schriftfeld', [['Eine zweite Masstoleranz', 'Nein. Das Zeichen hat keine eigene Toleranz.'], ['Die Anzahl der Messungen', 'Nein. Es verweist auf eine Anforderung.'], ['Ein Hinweis auf die Hüllbedingung', 'Nein. Die Hülle hat ein eigenes Symbol.']]),
    ],
    tipps: () => ['nx steht vor der Spezifikation.', 'Das Hinweiszeichen verweist auf einen Text.', 'Der Text steht nahe dem Schriftfeld oder in einem anderen Dokument.'],
    loesung: () => ['nx als erstes Element nennt die Anzahl der Geometrieelemente.', 'Ein nummeriertes Hinweiszeichen (z. B. «vor dem Verchromen») verweist auf eine ergänzende Anforderung. Die Bedeutung steht nahe dem Schriftfeld oder in einem ergänzenden Dokument.'],
  }),
  einfach('m21', 'modifikatoren', 3, 'begruenden', 'Modifikator CT', 'Gemeinsam toleriertes Element CT (S. 34)', 'Du schreibst 8x Ø50 mit dem Modifikator CT. Was bewirkt CT?',
    'Die acht Elemente gelten als ein gemeinsam toleriertes Element',
    [['Jedes der acht Elemente wird einzeln geprüft', 'Nein. Genau das macht CT nicht.'], ['Es setzt die Hüllbedingung ausser Kraft', 'Nein. CT wird sogar mit globalen Massen oder E genutzt.'], ['Es wählt das Zweipunktgrössenmass', 'Nein. CT ändert nur die Zusammenfassung der Elemente.']],
    ['CT heisst gemeinsam toleriert.', 'Die Elemente der Anzahl nx werden zusammengefasst.', 'Eine Gruppe wird wie ein Element behandelt.'],
    ['CT betrachtet die mit nx festgelegten Elemente als ein toleriertes Element. Es geht nur mit globalen Massen (z. B. GX) oder mit E.', 'Hinweis des Guides: UF und CT sind geometrisch nicht eindeutig definiert.']),
  task<P>({
    id: 'm22', karte: 'modifikatoren', stufe: 2, familie: 'waswaere', src: 'nach Swissmem ISO-GPS-Guide, Freier Zustand und Einspannbedingung (S. 34)',
    title: 'Freier Zustand bei dünnem Teil',
    gen: reihen,
    text: () => 'Ein dünnwandiges, nicht formstabiles Teil hat eine Einspannbedingung auf der Zeichnung (Aufspannung an Bezugsstellen, Anzugsmoment). Zwei Fragen.',
    asks: (p) => [
      wahl('Ohne Modifikator für freien Zustand', p.o[0], 'Die Spezifikation gilt im gespannten Zustand', [['Sie gilt im freien Zustand', 'Nein. Dann stünde der Modifikator für den freien Zustand dabei.'], ['Sie gilt in einem beliebigen Zustand', 'Nein. Der Zustand ist durch die Einspannbedingung festgelegt.'], ['Sie gilt nur, solange das Teil liegt', 'Nein. Es zählt die vereinbarte Einspannung.']]),
      wahl('Das Mass soll im freien Zustand gelten', p.o[1], 'Du ergänzt den Modifikator für den freien Zustand', [['Du streichst die Einspannbedingung', 'Nein. Dann gälte der Standard des starren Werkstücks.'], ['Du ergänzt die Hüllbedingung', 'Nein. Die Hülle regelt Mass und Form, nicht den Zustand.'], ['Du verweist auf die Referenztemperatur', 'Nein. Die Temperatur hat damit nichts zu tun.']]),
    ],
    tipps: () => ['NR bedeutet nicht formstabil.', 'Ohne Zusatz gilt die angegebene Einspannung.', 'Für den freien Zustand gibt es einen eigenen Modifikator.'],
    loesung: () => ['Mit Einspannbedingung gilt die Spezifikation im gespannten Zustand.', 'Soll sie im freien Zustand gelten, fügst du den Modifikator für den freien Zustand zum Mass hinzu.', 'Ohne Einspannbedingung gilt nach ISO 8015 ohnehin der freie Zustand. Dann kann der Modifikator nicht angewendet werden.'],
  }),
  einfach('m23', 'modifikatoren', 2, 'begruenden', 'Zeichnungsspezifischer Standard', 'zeichnungsspezifischer Default-Spezifikationsoperator (S. 38)', 'Du willst, dass auf der ganzen Zeichnung für alle linearen Grössenmasse GG statt LP gilt. Wie legst du das fest?',
    'Mit Verweis auf die Norm und dem Symbol im oder nahe dem Schriftfeld',
    [['Mit dem Symbol an jedem einzelnen Mass', 'Nein. Das wäre keine Festlegung für die ganze Zeichnung.'], ['Mit einer Fussnote beim Werkstoff', 'Nein. Der Standard gehört in oder nahe das Schriftfeld.'], ['Das lässt sich nicht ändern', 'Nein. Der Standard kann zeichnungsspezifisch geändert werden.']],
    ['Der Standard gilt für die ganze Zeichnung.', 'Der Ort ist beim Schriftfeld.', 'Verweis auf die Norm plus Modifikatorsymbol.'],
    ['Ein zeichnungsspezifischer Standard steht im oder nahe dem Schriftfeld: Verweis auf ISO 14405-1 und das Symbol des gewünschten Merkmals.', 'Weitere Modifikatoren dürfen zur besseren Lesbarkeit in Klammern dahinter stehen.']),
  einfach('m24', 'modifikatoren', 2, 'begruenden', 'Teilbereich mit Länge', 'Teilbereich (S. 35)', 'Am Mass steht 20 ±0,1 mit «/5». Was bedeutet das?',
    'Es gilt in jedem beliebigen Teilbereich der Länge 5 mm',
    [['Es gilt nur an einer festen Stelle bei 5 mm', 'Nein. Eine feste Stelle würde mit TED-Massen festgelegt.'], ['Es gilt für das Mass 5 mm statt 20 mm', 'Nein. Die 5 ist die Länge des Teilbereichs.'], ['Es gilt fünfmal am Werkstück', 'Nein. Die Anzahl stünde als nx vor dem Mass.']],
    ['Der Schrägstrich nennt eine Länge.', 'Die Länge ist als TED festgelegt.', 'Der Teilbereich ist beliebig, nur seine Länge ist fest.'],
    ['«/ Länge» steht für einen beliebigen Teilbereich mit dieser Länge. Länge und Ort eines festen Teilbereichs würden dagegen mit TED-Massen festgelegt.']),
  einfach('m25', 'modifikatoren', 3, 'begruenden', 'Richtungselement-Indikator', 'Richtungselement-Indikator (S. 36)', 'Wann musst du einen Richtungselement-Indikator (Messrichtungsanzeiger) angeben?',
    'Wenn das Merkmal eine zusätzliche Nebenbedingung der Richtung erfüllen muss',
    [['Immer, bei jedem Grössenmass', 'Nein. Nur bei der genannten Bedingung.'], ['Nur beim Zweipunktgrössenmass', 'Nein. Er hängt nicht vom Merkmal ab.'], ['Nur bei Winkelgrössenmassen', 'Nein. Er gilt auch bei linearen Grössenmassen.']],
    ['Es geht um die Richtung.', 'Die Nebenbedingung der Richtung gehört zum Merkmal.', 'Auch wenn das Mass die Länge des Elements deutlich überschreitet, braucht es ihn.'],
    ['Der Indikator ist unabhängig vom Merkmal nötig, sobald eine Nebenbedingung der Richtung gilt. Überschreitet das Mass die Länge des Elements deutlich, muss er stets ergänzt werden.']),

  // ===== Karte: Winkelgrössenmass (ISO 14405-3) =====
  einfach('m26', 'winkel', 1, 'begruenden', 'Winkelgrössenmasselemente', 'Winkelgrössenmasse (S. 49)', 'Welche Elemente können ein Winkelgrössenmass haben?',
    'Kegel, Keil und zwei sich schneidende Geraden',
    [['Zylinder und parallele Ebenen', 'Nein. Das sind lineare Grössenmasselemente.'], ['Jede beliebige ebene Fläche', 'Nein. Ein Winkelgrössenmass braucht Kegel oder Keil.'], ['Zwei parallele Geraden', 'Nein. Parallele Geraden bilden keinen Winkel.']],
    ['Ein Winkelgrössenmass ist ein intrinsisches Merkmal.', 'Es braucht einen Winkel am Element selbst.', 'Kegel und Keil, auch abgeschnitten.'],
    ['Winkelgrössenmasselemente: Kegel und Kegelstumpf, Keil und abgeschnittener Keil, zwei gegenüberliegende Mantellinien eines Kegels, zwei gegenüberliegende Linien eines Keils.']),
  task<P>({
    id: 'm27', karte: 'winkel', stufe: 2, familie: 'waswaere', src: 'nach Swissmem ISO-GPS-Guide, zeichnungsspezifischer Standard für Winkel (S. 63)',
    title: 'Standard für Winkel ändern',
    gen: reihen,
    text: () => 'In der Nähe des Schriftfeldes steht ein Verweis auf ISO 14405-3 mit dem Symbol für das globale Winkelgrössenmass mit totalen kleinsten Abweichungsquadraten. Was ändert sich?',
    asks: (p) => [wahl('Antwort', p.o[0], 'Der Standard aller Winkelgrössenmasse der Zeichnung wechselt zu diesem globalen Merkmal', [
      ['Nur das nächste Winkelmass ändert sich', 'Nein. Der Verweis gilt für alle Winkelgrössenmasse der Zeichnung.'], ['Es ändert sich nichts, es ist nur ein Hinweis', 'Nein. Der Standard wird geändert.'], ['Auch alle linearen Grössenmasse ändern sich', 'Nein. Für lineare gilt ein eigener Verweis auf ISO 14405-1.']])],
    tipps: () => ['Der Verweis steht beim Schriftfeld.', 'Er gilt für die ganze Zeichnung.', 'Er betrifft nur Winkelgrössenmasse.'],
    loesung: () => ['Der Standard (Zwei-Linien-Winkelgrössenmass mit Minimax) wird für alle Winkelgrössenmasse der Zeichnung durch das genannte Merkmal ersetzt.'],
  }),
  einfach('m28', 'winkel', 2, 'begruenden', 'Winkel im Teilbereich', 'Teilbereich-Winkelgrössenmass (S. 58–59)', 'Das Teilbereich-Winkelgrössenmass mit «Winkelabstand 40°» steht an einem Kegel. Was bedeutet das?',
    'Es gilt in jedem beliebigen Teilbereich mit Winkelabstand 40°',
    [['Der Kegel hat einen Öffnungswinkel von 40°', 'Nein. Der Wert beschreibt die Grösse des Teilbereichs.'], ['Es gilt nur an einer festen Stelle', 'Nein. Der Teilbereich ist beliebig.'], ['Es gilt für den ganzen Kegel', 'Nein. Es gilt nur für den eingeschränkten Teilbereich.']],
    ['Der Teilbereich ist begrenzt.', 'Bei Kegeln gibt man einen Winkelabstand an, bei Keilen einen linearen Abstand.', 'Er gilt an jeder beliebigen Stelle.'],
    ['Ein Teilbereich-Winkelgrössenmass ist ein örtliches Mass. Bei Kegeln steht ein Winkelabstand, bei Keilen ein linearer Abstand.']),
  task<P>({
    id: 'm29', karte: 'winkel', stufe: 3, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Winkelgrössenmasse Rangordnung (S. 56–60)',
    title: 'Rangordnungsmasse bei Winkeln',
    gen: reihen,
    text: () => 'Du misst ein Winkelgrössenmass an 9 Stellen und bildest SX, SN, SA, SM, SD, SR und SQ. Welche Aussage stimmt?',
    asks: (p) => [wahl('Antwort', p.o[0], 'Die Rechenregeln sind dieselben wie bei linearen Grössenmassen', [
      ['Bei Winkeln gibt es keine Rangordnungsmasse', 'Nein. Sie sind auch für Winkelgrössenmasse definiert.'], ['Bei Winkeln gelten andere Formeln für SA und SM', 'Nein. Mittelwert und Median werden gleich gebildet.'], ['Rangordnungsmasse stehen bei Winkeln allein', 'Nein. Sie ergänzen ein örtliches Winkelgrössenmass.']])],
    tipps: () => ['Vergleiche mit den linearen Grössenmassen.', 'Die Merkmale haben dieselben Symbole.', 'Nur die Messwerte sind Winkel.'],
    loesung: () => ['Die Rangordnungsmasse SX, SN, SA, SM, SD, SR, SQ gelten auch für Winkel. Sie werden zusätzlich zu einem örtlichen Winkelgrössenmass angegeben.'],
  }),

  // ===== Karte: Material-Bedingung (ISO 2692) =====
  task<{ bohrung: boolean; mms: number; t: number; lms: number }>({
    id: 'm30', karte: 'material', stufe: 3, familie: 'rechnen', src: 'nach Swissmem ISO-GPS-Guide, Maximum-Material-Bedingung (S. 142–144)',
    title: 'Wirksames Grenzmass',
    gen: () => {
      const bohrung = Math.random() < 0.5; const n = rnd(5, 9) * 100;
      return { bohrung, mms: n, t: rnd(2, 8), lms: bohrung ? n + rnd(2, 6) : n - rnd(2, 6) };
    },
    text: (p) => `${p.bohrung ? 'Bohrung' : 'Welle'}: Maximum-Material-Grössenmass MMS = ${f2(p.mms)} mm, Minimum-Material-Grössenmass LMS = ${f2(p.lms)} mm. Die geometrische Toleranz ist t = ${f2(p.t)} mm. Berechne MMVS (wirksames Maximum-Material-Grössenmass) und LMVS (wirksames Minimum-Material-Grössenmass).`,
    asks: (p) => [num('MMVS', p.bohrung ? p.mms - p.t : p.mms + p.t), num('LMVS', p.bohrung ? p.lms + p.t : p.lms - p.t)],
    fehler: (p) => [fe(0, p.bohrung ? p.mms + p.t : p.mms - p.t, `Falsches Vorzeichen. Bei ${p.bohrung ? 'der Bohrung wird t von MMS abgezogen' : 'der Welle wird t zu MMS addiert'}.`)],
    tipps: () => ['Das wirksame Mass liegt ausserhalb der Grenzen auf der sicheren Seite.', 'Bohrung: MMVS = MMS − t und LMVS = LMS + t.', 'Welle: MMVS = MMS + t und LMVS = LMS − t.'],
    loesung: (p) => p.bohrung
      ? [`MMVS = MMS − t = ${f2(p.mms)} − ${f2(p.t)} = ${f2(p.mms - p.t)} mm`, `LMVS = LMS + t = ${f2(p.lms)} + ${f2(p.t)} = ${f2(p.lms + p.t)} mm`]
      : [`MMVS = MMS + t = ${f2(p.mms)} + ${f2(p.t)} = ${f2(p.mms + p.t)} mm`, `LMVS = LMS − t = ${f2(p.lms)} − ${f2(p.t)} = ${f2(p.lms - p.t)} mm`],
  }),
  einfach('m31', 'material', 2, 'begruenden', 'Was erlaubt die MMR?', 'Maximum-Material-Bedingung (S. 142)', 'Was erlaubt die Maximum-Material-Bedingung (MMR)?',
    'Die geometrische Toleranz darf überschritten werden, solange die Gesamtsumme stimmt',
    [['Auch die Masstoleranz darf überschritten werden', 'Nein. Die dimensionellen Toleranzen müssen eingehalten werden.'], ['Die Toleranzen dürfen frei vergrössert werden', 'Nein. Es gilt die Gesamttoleranzsumme.'], ['Die Form darf beliebig sein', 'Nein. Die Gesamtsumme begrenzt alles.']],
    ['MMR heisst Maximum-Material-Bedingung.', 'Es geht um das Zusammenspiel von Mass und Geometrie.', 'Die geometrische Toleranz gewinnt Spielraum, das Mass nicht.'],
    ['Die MMR erlaubt, eine eingetragene geometrische Toleranz zu überschreiten, solange die Gesamttoleranzsumme eingehalten wird. Die Masstoleranzen bleiben bindend.']),
  einfach('m32', 'material', 2, 'begruenden', 'Wo gilt die MMR?', 'Maximum-Material-Bedingung (S. 142)', 'Auf welche Elemente kann die Maximum-Material-Bedingung angewendet werden?',
    'Auf abgeleitete Elemente (Achsen, Symmetrieebenen) einfacher Elemente',
    [['Auf jede integrale Fläche', 'Nein. Nur auf abgeleitete Elemente.'], ['Auf alle Freiformflächen', 'Nein. Es braucht einfache Elemente wie Zylinder oder Parallelebenenpaare.'], ['Auf jede Oberflächenangabe', 'Nein. Sie betrifft Mass und Geometrie, nicht die Rauheit.']],
    ['Die MMR wirkt auf Mittelelemente.', 'Achsen und Symmetrieebenen sind abgeleitet.', 'Einfache Elemente: Zylinder, Parallelebenenpaare.'],
    ['Die MMR gilt für abgeleitete Elemente (Achsen, Symmetrieebenen) von einfachen Elementen (Zylinder, Parallelebenenpaare).']),
  einfach('m33', 'material', 3, 'begruenden', 'Reziprozitätsbedingung', 'Reziprozitätsbedingung (S. 142)', 'Zur MMR kommt die Reziprozitätsbedingung. Was gilt dann?',
    'Mass- und Geometrietoleranz teilen sich die Summe frei, die Minimum-Material-Grenze bleibt',
    [['Beide Toleranzen dürfen beliebig überschritten werden', 'Nein. Die Minimum-Material-Grenze ist immer einzuhalten.'], ['Die Masstoleranz darf zur Minimum-Material-Seite wachsen', 'Nein. Sie darf nur zur Maximum-Material-Seite wachsen.'], ['Die Geometrietoleranz entfällt', 'Nein. Sie bleibt, nur die Aufteilung ist frei.']],
    ['Reziprok heisst wechselseitig.', 'Die Summe beider Toleranzen ist die Grösse.', 'Das Mass wächst nur zur Maximum-Material-Seite.'],
    ['Mit Reziprozität lässt sich die Summe beider Toleranzen beliebig aufteilen. Die Masstoleranz darf nur zur Maximum-Material-Seite wachsen. Die Reziprozität gibt es nur zusammen mit der Maximum- oder Minimum-Materialbedingung.']),

  // ===== Karte: Allgemeintoleranz, Oberfläche, Bezüge =====
  task<P>({
    id: 'm34', karte: 'allgemeines', stufe: 2, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Allgemeine Spezifikationen (S. 146–147)',
    title: 'Allgemeintoleranzen',
    gen: reihen,
    text: () => 'Zwei Fragen zu den allgemeinen Spezifikationen.',
    asks: (p) => [
      wahl('Welche Norm ersetzt ISO 22081 für Form und Lage?', p.o[0], 'ISO 2768-2', [['ISO 2768-1', 'Nein. Teil 1 regelt lineare Masse und Winkel.'], ['ISO 13920', 'Nein. Das ist die Norm für Schweissen.'], ['ISO 8062', 'Nein. Das ist eine komplementäre Norm für Gussteile.']]),
      wahl('Die allgemeine geometrische Spezifikation gilt', p.o[1], 'Nur für integrale Flächen ohne individuelle Spezifikation', [['Für alle Elemente, auch Bezugselemente', 'Nein. Bezugselemente im Bezugsfeld sind ausgenommen.'], ['Nur für Achsen und Mittelebenen', 'Nein. Sie gilt für integrale Flächen.'], ['Auch für Elemente mit eigener Toleranz', 'Nein. Individuelle Angaben gehen vor.']]),
    ],
    tipps: () => ['ISO 22081 ersetzt eine ältere Norm.', 'Die geometrische Allgemeintoleranz ist ein Flächenprofil.', 'Individuelle Angaben und Bezugselemente sind ausgenommen.'],
    loesung: () => ['ISO 22081 ersetzt ISO 2768-2 (Form und Lage ohne einzelne Toleranzeintragungen).', 'Die allgemeine geometrische Spezifikation gilt nur für integrale Flächen. Bezugselemente und Elemente mit individueller Spezifikation sind ausgenommen.'],
  }),
  einfach('m35', 'allgemeines', 3, 'fehler', 'Allgemeintoleranz bei Nicht-Grössenmassen', 'Dimensionelle Allgemeintoleranz (S. 147)', 'Auf der Zeichnung steht die dimensionelle Allgemeintoleranz für lineare Grössenmasse. Ein Kollege wendet sie auch auf den Abstand zweier Flächen an, der kein Grössenmass ist. Stimmt das?',
    'Nein, sie gilt nur für lineare Grössenmasse und Winkelgrössenmasse',
    [['Ja, sie gilt für jedes Mass auf der Zeichnung', 'Nein. Nicht-Grössenmasse sind ausgenommen.'], ['Ja, aber nur mit Hüllbedingung', 'Nein. Die Hülle ändert daran nichts.'], ['Nein, sie gilt nur für Radien', 'Nein. Sie gilt für lineare Grössenmasse und Winkelgrössenmasse.']],
    ['Unterscheide Grössenmasse und andere Masse.', 'ISO 14405-1 und -3 sind Grössenmasse.', 'ISO 14405-2 behandelt die anderen Masse.'],
    ['Die dimensionelle Allgemeintoleranz gilt nur für Grössenmasse nach ISO 14405-1 und -3, nicht für Nicht-Grössenmasse (ISO 14405-2).']),
  einfach('m36', 'allgemeines', 2, 'begruenden', 'Plus-Minus bei Nicht-Grössenmassen', 'Nicht-Grössenmasse (S. 40–45)', 'Zwischen zwei Flächen steht 50 ±0,1. Es ist kein Grössenmass. Was ist das Problem?',
    'Die Plus-Minus-Tolerierung ist hier mehrdeutig und lässt sich nicht deuten',
    [['Die Toleranz ist zu klein für die Fertigung', 'Nein. Es geht nicht um die Grösse der Toleranz.'], ['Das Mass braucht zwingend eine Hüllbedingung', 'Nein. Die Hülle gilt nur für Grössenmasselemente.'], ['Es fehlt die Angabe der Rauheit', 'Nein. Die Rauheit hat damit nichts zu tun.']],
    ['Was ist ein Grössenmass?', 'Der Abstand zweier Flächen ist oft keines.', 'Eindeutig wird es mit geometrischer Tolerierung.'],
    ['Bei Nicht-Grössenmassen ist die Plus-Minus-Tolerierung mehrdeutig. Eindeutig wird die Spezifikation mit geometrischer Tolerierung, z. B. Position oder Profil mit Bezügen.', 'Das ist keine blosse Übersetzung. Die Wahl hängt von der Funktion ab.']),
  task<P>({
    id: 'm37', karte: 'allgemeines', stufe: 1, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Oberflächenbeschaffenheit ISO 21920 (S. 126–131)',
    title: 'Mindestangabe Oberfläche',
    gen: reihen,
    text: () => 'Zwei Fragen zur Oberflächenangabe nach der Normreihe ISO 21920.',
    asks: (p) => [
      wahl('Mindestangabe, z. B. Rz 10, besteht aus', p.o[0], 'Grafischem Symbol, Parameter und Grenzwert', [['Nur dem Parameter und dem Grenzwert', 'Nein. Das grafische Symbol gehört dazu.'], ['Symbol, Parameter, Filter und Auswertelänge', 'Nein. Filter und Länge sind bei Defaults nicht nötig.'], ['Nur dem grafischen Symbol', 'Nein. Parameter und Grenzwert fehlen.']]),
      wahl('Das «Rundum»-Symbol', p.o[1], 'Ist in ISO 21920-1 nicht mehr definiert', [['Gilt weiterhin für alle Flächen einer Kontur', 'Nein. Es ist wegen Mehrdeutigkeit entfallen.'], ['Gilt nur bei Rz', 'Nein. Es gibt es gar nicht mehr.'], ['Steht neu im Schriftfeld', 'Nein. Sammelangaben stehen nahe dem Schriftfeld, aber ohne dieses Symbol.']]),
    ],
    tipps: () => ['Die Normreihe hat drei Teile.', 'Bei Defaults genügt eine Mindestangabe.', 'Um Mehrdeutigkeit zu vermeiden, gibt es manche Symbole nicht mehr.'],
    loesung: () => ['Mindestangabe: grafisches Symbol, Parameter, Grenzwert (z. B. Rz 10), sofern alle Defaults gelten sollen.', 'Das «Rundum»-Symbol ist in ISO 21920-1 nicht mehr definiert, um Mehrdeutigkeit zu vermeiden.'],
  }),
  task<P>({
    id: 'm38', karte: 'allgemeines', stufe: 2, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Bezugsstellen ISO 5459 (S. 67–68)',
    title: 'Bezugsstellen zeichnen',
    gen: reihen,
    text: () => 'Wie wird die Bezugsstelle in der Zeichnung gekennzeichnet?',
    asks: (p) => [
      wahl('Punktförmige Bezugsstelle', p.o[0], 'Mit einem Kreuz', [['Mit einem gefüllten Kreis', 'Nein. Der Punkt wird als Kreuz gezeichnet.'], ['Mit einem Dreieck', 'Nein. Das Dreieck gehört zum Bezugselement-Indikator.'], ['Mit einer Strichlinie', 'Nein. Eine Linie ist es bei der Linienform.']]),
      wahl('Offene linienförmige Bezugsstelle', p.o[1], 'Mit zwei Kreuzen als Abschluss', [['Mit einem Kreuz in der Mitte', 'Nein. Die offene Linie hat zwei Kreuze an den Enden.'], ['Ohne Kreuze', 'Nein. Ohne Kreuze wäre die Länge nicht begrenzt.'], ['Mit drei Kreuzen', 'Nein. Es sind zwei.']]),
      wahl('Wie wird die Lage der Bezugsstellen angegeben?', p.o[2], 'Mit TED-Massen', [['Mit Toleranzen am Mass', 'Nein. Die Lage ist theoretisch exakt.'], ['Mit dem Hinweiszeichen', 'Nein. Dieses ist für ergänzende Anforderungen.'], ['Gar nicht, sie ist frei', 'Nein. Die Lage wird festgelegt.']]),
    ],
    tipps: () => ['Bezugsstellen sind Berührstellen auf dem Bezugselement.', 'Punkt: ein Kreuz. Offene Linie: zwei Kreuze.', 'Die Lage ist theoretisch exakt.'],
    loesung: () => ['Punktförmig: Kreuz (breite Volllinie).', 'Linienförmig und offen: durch zwei Kreuze abgeschlossen. Die Linie kann gerade, kreisförmig oder beliebig gekrümmt sein.', 'Die Lage der Bezugsstellen wird mit TED-Massen angegeben.'],
  }),
  task<P>({
    id: 'm39', karte: 'allgemeines', stufe: 3, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Situationselemente (S. 70)',
    title: 'Situationselemente eines Bezugssystems',
    gen: reihen,
    text: () => 'Ein Bezugssystem A|B|C besteht aus drei zueinander rechtwinkligen Ebenen. Welches Situationselement entsteht jeweils?',
    asks: (p) => {
      const N = ['Ebene [PL]', 'Gerade [SL]', 'Punkt [PT]'];
      const mk = (k: string, r: number, o: number[]) => wahl(k, o, N[r], N.filter((_, i) => i !== r).map((n) => [n, `Nein. Richtig ist ${N[r]}.`] as [string, string]));
      return [mk('Primärer Bezug A', 0, p.o[0]), mk('Schnitt von primärem und sekundärem Bezug', 1, p.o[1]), mk('Schnitt aller drei Bezüge', 2, p.o[2])];
    },
    tipps: () => ['Denke an Ebenen, die sich schneiden.', 'Zwei Ebenen schneiden sich in einer Geraden.', 'Eine dritte Ebene schneidet die Gerade in einem Punkt.'],
    loesung: () => ['A: Ebene (PL).', 'A mit B: Gerade (SL).', 'A, B und C: Punkt (PT).'],
  }),
  einfach('m40', 'allgemeines', 2, 'begruenden', 'Gestapelte Toleranzindikatoren', 'Toleranzindikatoren (S. 73)', 'Du hast mehrere geometrische Spezifikationen und stapelst die Toleranzindikatoren untereinander. In welcher Reihenfolge sollten sie stehen?',
    'Nach der Weite der Toleranzzone, die grösste oben',
    [['Nach der Weite der Toleranzzone, die kleinste oben', 'Nein. Die Weiten nehmen von oben nach unten ab.'], ['Alphabetisch nach dem Namen der Toleranz', 'Nein. Massgebend ist die Weite der Zone.'], ['Nach der Reihenfolge der Bezüge', 'Nein. Die Bezüge bestimmen die Reihenfolge nicht.']],
    ['Es geht um die Zonenweite.', 'Absteigend von oben nach unten.', 'Die grösste Toleranz steht zuoberst.'],
    ['Die Toleranzindikatoren sollen nach den Weiten der Toleranzzonen absteigend von oben nach unten angeordnet werden.']),
  einfach('m41', 'allgemeines', 1, 'begruenden', 'Bezugsdreieck', 'Bezugselement-Indikator (S. 66)', 'Das Bezugsdreieck am Bezugselement kann leer oder ausgefüllt gezeichnet sein. Was bedeutet der Unterschied?',
    'Es gibt keinen Unterschied',
    [['Ausgefüllt ist ein Hauptbezug, leer ein Nebenbezug', 'Nein. Die Reihenfolge steht im Toleranzindikator.'], ['Ausgefüllt gilt für Flächen, leer für Achsen', 'Nein. Die Füllung hat keine Bedeutung.'], ['Ausgefüllt verlangt die Hüllbedingung', 'Nein. Dafür gibt es das Symbol E.']],
    ['Prüfe die Beschreibung des Bezugselement-Indikators.', 'Die Füllung hat keine Bedeutung.', 'Leer und ausgefüllt sind gleichwertig.'],
    ['Zwischen ausgefülltem und leerem Bezugsdreieck gibt es keinen Unterschied.']),
];
