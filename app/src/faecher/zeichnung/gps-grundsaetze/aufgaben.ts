// Aufgaben zu den GPS-Grundsätzen (ISO 8015) und den Grössenmassmerkmalen (ISO 14405-1).
// Alles Auswahlfragen. Normnummern stehen nur in den Erklärungen, nie in den Antworten.
import { task, type ChoiceAsk, type Task } from '../../../core/types';
import { pick } from '../../../core/zahl';
import * as B from './bilder';

export const mische = (n: number) => {
  const r = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
};
/** Neue Reihenfolgen für bis zu 3 Teilfragen (je 5 Plätze). */
export const reihen = () => ({ o: [mische(5), mische(5), mische(5)] });
export type P = ReturnType<typeof reihen>;

/** Auswahlfrage. Die richtige Antwort steht an wechselnder Stelle. */
export const wahl = (k: string, o: number[], richtig: string, falsch: [string, string][]): ChoiceAsk => {
  const opts = [richtig, ...falsch.map((f) => f[0])];
  const why = [undefined, ...falsch.map((f) => f[1])];
  const ord = o.filter((i) => i < opts.length);
  return { kind: 'choice', k, opts: ord.map((i) => opts[i]), a: ord.indexOf(0), why: ord.map((i) => why[i]) };
};

const STUFEN = ['Fundamentale GPS-Normen', 'Allgemeine GPS-Normen', 'Komplementäre GPS-Normen'];

// ---- Grössenmassmerkmale (Übersicht nach ISO 14405-1) ----
type Gruppe = 'örtlich' | 'global' | 'kombi' | 'rang';
const GRUPPEN: Record<Gruppe, string> = {
  örtlich: 'Örtliches Grössenmass',
  global: 'Globales Grössenmass',
  kombi: 'Kombination aus örtlichem und globalem Grössenmass',
  rang: 'Rangordnungsgrössenmass',
};
const MERKMAL: { s: string; n: string; g: Gruppe }[] = [
  { s: 'LP', n: 'Zweipunktgrössenmass', g: 'örtlich' },
  { s: 'LS', n: 'Sphärisches Grössenmass', g: 'örtlich' },
  { s: 'CC', n: 'Umfangsbezogener Durchmesser', g: 'örtlich' },
  { s: 'CA', n: 'Flächenbezogener Durchmesser', g: 'örtlich' },
  { s: 'GG', n: 'Totale kleinste Abweichungsquadrate', g: 'global' },
  { s: 'GC', n: 'Minimax-Assoziationskriterium', g: 'global' },
  { s: 'GX', n: 'Grösstes einbeschriebenes Geometrieelement', g: 'global' },
  { s: 'GN', n: 'Kleinstes umschriebenes Geometrieelement', g: 'global' },
  { s: 'CV', n: 'Volumenbezogener Durchmesser', g: 'global' },
  { s: 'E', n: 'Hüllbedingung', g: 'kombi' },
  { s: 'SX', n: 'Grösstes Grössenmass', g: 'rang' },
  { s: 'SN', n: 'Kleinstes Grössenmass', g: 'rang' },
  { s: 'SA', n: 'Mittleres Grössenmass', g: 'rang' },
  { s: 'SM', n: 'Median-Grössenmass', g: 'rang' },
  { s: 'SD', n: 'Mittelwert aus kleinstem und grösstem Grössenmass', g: 'rang' },
  { s: 'SR', n: 'Spanne der Grössenmasse', g: 'rang' },
  { s: 'SQ', n: 'Standardabweichung von Grössenmassen', g: 'rang' },
];
type M = (typeof MERKMAL)[number];
/** Drei Ablenker, zuerst aus derselben Gruppe. */
const ablenker = (m: M): M[] => {
  const gleich = MERKMAL.filter((x) => x.g === m.g && x !== m);
  const andere = MERKMAL.filter((x) => x.g !== m.g);
  const r: M[] = [];
  while (r.length < 3) {
    const q = gleich.length - r.filter((x) => x.g === m.g).length > 0 ? pick(gleich.filter((x) => !r.includes(x))) : pick(andere.filter((x) => !r.includes(x)));
    r.push(q);
  }
  return r;
};

const WARUM_GRUPPE = (m: M) => `${m.s} (${m.n}) gehört zur Gruppe «${GRUPPEN[m.g]}».`;

export const AUFGABEN: Task[] = [
  // ===== Karte 1: Grundsätze I =====
  task<P>({
    id: 'g1', karte: 'grundsaetze', stufe: 1, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz des Aufrufens',
    title: 'Wann gilt das GPS-Regelwerk?',
    gen: reihen,
    text: () => 'Auf einer Zeichnung steht ein GPS-Modifikator, zum Beispiel die Hüllbedingung. Was gilt damit für das GPS-Regelwerk der ISO?',
    asks: (p) => [wahl('Antwort', p.o[0], 'Das gesamte Regelwerk gilt als aufgerufen', [
      ['Nur die Norm dieses einen Modifikators gilt', 'Nein. Wer einen Teilbereich aufruft, ruft das ganze Regelwerk auf.'],
      ['Nur die Normen der ersten Stufe gelten', 'Nein. Die Stufen regeln die Rangfolge, nicht den Umfang des Aufrufs.'],
      ['Das Regelwerk gilt nur bei einem Vermerk im Schriftfeld', 'Nein. Der Aufruf geschieht schon durch den Modifikator. Der Vermerk macht ihn nur vertragsrechtlich eindeutig.'],
    ])],
    tipps: () => ['Es geht um den Grundsatz des Aufrufens.', 'Ein Teilbereich reicht für den Aufruf.', 'Ein Teil aufgerufen heisst: das ganze Regelwerk gilt.'],
    loesung: () => ['Grundsatz des Aufrufens: Wird ein Teilbereich des GPS-Regelwerks aufgerufen, gilt das gesamte Regelwerk als aufgerufen.'],
  }),
  task<P>({
    id: 'g2', karte: 'grundsaetze', stufe: 2, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz des Aufrufens',
    title: 'Eindeutig im Vertrag',
    gen: reihen,
    text: () => 'Du willst, dass das ISO-GPS-Regelwerk im vertragsrechtlichen Sinn eindeutig gilt. Was machst du zuerst?',
    asks: (p) => [wahl('Antwort', p.o[0], 'Ich vereinbare es mit einem Hinweis', [
      ['Ich zeichne einen Modifikator ein', 'Ein Modifikator ruft das Regelwerk zwar auf. Vertragsrechtlich eindeutig ist es erst mit der Vereinbarung.'],
      ['Ich liste alle Normen im Schriftfeld auf', 'Das ersetzt keine Vereinbarung des Regelwerks.'],
      ['Ich warte, bis der Lieferant nachfragt', 'Nein. Die Konstruktion legt das fest, nicht der Lieferant.'],
    ])],
    tipps: () => ['Es geht um eine Vereinbarung, nicht um ein Symbol.', 'Auf der Zeichnung steht ein kurzer Hinweis mit «Tolerierung».', 'Der Hinweis lautet «Tolerierung ISO 8015» oder gleichwertig.'],
    loesung: () => ['Zuerst vereinbaren: Hinweis «Tolerierung ISO 8015» (oder gleichwertig) auf der Zeichnung.', 'Erst dann gilt der Grundsatz des Aufrufens im vertragsrechtlichen Sinn eindeutig.'],
  }),
  task<P>({
    id: 'g3', karte: 'grundsaetze', stufe: 1, familie: 'bild', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz der GPS-Normenhierarchie',
    title: 'Stufen der GPS-Normen',
    gen: reihen,
    draw: () => B.hierarchie(),
    text: () => 'Das Bild zeigt die drei Stufen der GPS-Normen. Ordne die Normen der richtigen Stufe zu.',
    asks: (p) => [
      ['ISO 8015', 0],
      ['ISO 1101', 1],
      ['ISO 8062', 2],
    ].map(([n, i], j) => {
      const r = i as number;
      return wahl(`${n}`, p.o[j], STUFEN[r], STUFEN.filter((_, x) => x !== r).map((st) => [st, `${n} steht in der Stufe «${STUFEN[r]}».`] as [string, string]));
    }),
    tipps: () => ['Fundamental = die Grundsätze und Regeln.', 'ISO 1101 regelt die Tolerierung im Allgemeinen.', 'ISO 8062 gehört zu den Zusatznormen, den komplementären.'],
    loesung: () => ['ISO 8015: fundamentale GPS-Norm (1. Stufe).', 'ISO 1101: allgemeine GPS-Norm (2. Stufe).', 'ISO 8062: komplementäre GPS-Norm (3. Stufe).'],
  }),
  task<P>({
    id: 'g4', karte: 'grundsaetze', stufe: 2, familie: 'waswaere', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz der GPS-Normenhierarchie',
    title: 'Regel von oben nach unten',
    gen: reihen,
    text: () => 'Eine Regel steht in einer fundamentalen GPS-Norm. Eine komplementäre Norm sagt zu dieser Regel nichts. Was gilt?',
    asks: (p) => [wahl('Antwort', p.o[0], 'Die Regel gilt auch in der komplementären Norm', [
      ['Die Regel gilt dort nicht, weil die Norm schweigt', 'Nein. Regeln einer höheren Stufe gelten unten mit, solange dort nichts anderes steht.'],
      ['Die Regel gilt nur, wenn die Zeichnung sie wiederholt', 'Nein. Die Hierarchie macht das überflüssig.'],
      ['Die komplementäre Norm hat immer Vorrang', 'Nein. Nur eine ausdrücklich andere Regel verdrängt die höhere.'],
    ])],
    tipps: () => ['Denk an die Pfeilrichtung im Bild der Hierarchie.', 'Oben gilt unten mit.', 'Nur eine ausdrücklich andere Regel unten ändert das.'],
    loesung: () => ['Regeln einer höheren Stufe gelten grundsätzlich auch in tieferen Stufen, falls dort keine anderen Regeln festgelegt werden.'],
  }),
  task<P>({
    id: 'g5', karte: 'grundsaetze', stufe: 2, familie: 'waswaere', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz der bestimmenden Zeichnung',
    title: 'Mündlich abgemacht',
    gen: reihen,
    text: () => 'Der Kunde sagt: «Die Bohrung muss rund sein, das haben wir mündlich abgemacht.» Auf der Zeichnung steht keine Rundheitstoleranz. Kann er sie verlangen?',
    asks: (p) => [wahl('Antwort', p.o[0], 'Nein, was nicht in der Zeichnung steht, gilt nicht', [
      ['Ja, mündliche Abmachungen gehen vor', 'Nein. Die Zeichnung ist bestimmend.'],
      ['Ja, aber nur wenn der Lieferant zustimmt', 'Nein. Es gilt der Inhalt der Zeichnung, nicht die Zustimmung danach.'],
      ['Ja, die Funktion der Bohrung verlangt es immer', 'Nein. Die Funktion allein ersetzt keine Angabe in der Zeichnung.'],
    ])],
    tipps: () => ['Welches Dokument ist bestimmend?', 'Anforderungen, die nicht in der Produktspezifikation stehen, zählen nicht.', 'Das ist das Endgültigkeitsprinzip.'],
    loesung: () => ['Grundsatz der bestimmenden Zeichnung: Anforderungen, die nicht in der Produktspezifikation stehen, können nicht geltend gemacht werden (Endgültigkeitsprinzip).'],
  }),
  task<P>({
    id: 'g6', karte: 'grundsaetze', stufe: 2, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz der bestimmenden Zeichnung',
    title: 'Was ist das Original?',
    gen: reihen,
    text: () => 'Die Produktdefinitionsdaten haben den Klassifizierungscode 3: Datensatz mit Entwurfsmodell oder kommentiertem Modell und vereinfachter Zeichnung. Was ist das Original?',
    asks: (p) => [wahl('Antwort', p.o[0], 'Der Datensatz', [
      ['Die vereinfachte Zeichnung', 'Nein. Die Zeichnung ist hier nur vereinfacht und nicht das Original.'],
      ['Der Papierausdruck der Zeichnung', 'Nein. Ein Ausdruck ist nur eine Kopie.'],
      ['Die Stückliste', 'Nein. Die Stückliste gehört dazu, ist aber nicht das Original.'],
    ])],
    tipps: () => ['Bei Code 3 liegt das Modell im Datensatz.', 'Die Zeichnung ist vereinfacht.', 'Der Datensatz ist das Original.'],
    loesung: () => ['Bei Klassifizierungscode 3 ist der Datensatz das Original (nach ISO 16792).', 'Ohne Zeichnung (Code 5) gilt die Dokumentation nach ISO 11442 als Zeichnung.'],
  }),
  task<P>({
    id: 'g7', karte: 'grundsaetze', stufe: 1, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz des Geometrieelementes',
    title: 'Für welchen Bereich gilt eine Spezifikation?',
    gen: reihen,
    text: () => 'Eine Formtoleranz steht an einer Welle. Wofür gilt sie standardmässig?',
    asks: (p) => [wahl('Antwort', p.o[0], 'Für das ganze Element, nur dieses eine', [
      ['Nur für die Mitte des Geometrieelementes', 'Nein. Standardmässig gilt sie über das gesamte Element.'],
      ['Für alle Elemente mit gleichem Durchmesser', 'Nein. Sie gilt nur für das eine Element, an dem sie steht.'],
      ['Für das Element und angrenzende Flächen', 'Nein. Angrenzende Flächen brauchen eine eigene Angabe.'],
    ])],
    tipps: () => ['Jede Spezifikation gehört zu einem einzigen Element.', 'Sie gilt standardmässig über die ganze Länge.', 'Für andere Elemente braucht es eigene Angaben.'],
    loesung: () => ['Grundsatz des Geometrieelementes: Jede GPS-Spezifikation gilt standardmässig für das gesamte Geometrieelement und nur für ein einziges Geometrieelement.'],
  }),
  task<P & { d: number; z: string }>({
    id: 'g8', karte: 'grundsaetze', stufe: 2, familie: 'waswaere', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz der Unabhängigkeit',
    title: 'Mass und Form getrennt',
    gen: () => ({ ...reihen(), d: pick([20, 25, 30, 40]), z: pick(['0,005', '0,01', '0,02']) }),
    text: (p) => `Eine Welle hat das Mass Ø${p.d} ±0,05 und eine Zylindrizität von ${p.z}. Es steht keine Hüllbedingung auf der Zeichnung. Wie sind die beiden Anforderungen zu erfüllen?`,
    asks: (p) => [wahl('Antwort', p.o[0], 'Beide unabhängig voneinander', [
      ['Die Zylindrizität muss in der Masstoleranz liegen', 'Nein. Das wäre die Hüllbedingung. Ohne sie bleibt jede Anforderung für sich.'],
      ['Die Masstoleranz begrenzt auch die Form', 'Nein. Ohne besondere Angabe gibt es keine solche Abhängigkeit.'],
      ['Die Zylindrizität gilt nur, wenn das Mass stimmt', 'Nein. Beide gelten immer, jede für sich.'],
    ])],
    tipps: () => ['Das ist der Grundsatz der Unabhängigkeit.', 'Eine Abhängigkeit braucht eine Norm oder eine besondere Angabe.', 'Ohne Angabe gelten Mass und Form getrennt.'],
    loesung: () => ['Grundsatz der Unabhängigkeit: Grössenmass, Form, Richtung und Ort müssen unabhängig voneinander erfüllt werden.', 'Nur eine Norm oder eine besondere Angabe stellt eine Abhängigkeit her.'],
  }),
  task<P>({
    id: 'g9', karte: 'grundsaetze', stufe: 3, familie: 'umgekehrt', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz der Unabhängigkeit',
    title: 'Was stellt eine Abhängigkeit her?',
    gen: reihen,
    text: () => 'Mass und Form sollen voneinander abhängen. Welche Angabe stellt das her?',
    asks: (p) => [wahl('Antwort', p.o[0], 'Die Hüllbedingung am Grössenmass', [
      ['Eine enge Formtoleranz am selben Element', 'Nein. Eine enge Toleranz bleibt unabhängig vom Mass.'],
      ['Eine enge Masstoleranz', 'Nein. Auch eine enge Masstoleranz macht noch keine Abhängigkeit.'],
      ['Eine Allgemeintoleranz im Schriftfeld', 'Nein. Sie legt nur Werte fest und verbindet nichts.'],
    ])],
    tipps: () => ['Das Symbol ist ein Kreis mit einem Buchstaben.', 'Es gehört zu den Grössenmassmerkmalen.', 'Es ist die Hüllbedingung, Symbol E.'],
    loesung: () => ['Die Hüllbedingung (E) am Grössenmass verbindet Mass und Form.', 'Auch die Elementgruppen-Spezifikation (ISO 5458) stellt eine Abhängigkeit her.'],
  }),
  task<P>({
    id: 'g10', karte: 'grundsaetze', stufe: 1, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz der Dezimaldarstellung',
    title: 'Wie wird «50» gelesen?',
    gen: reihen,
    text: () => 'Auf einer Zeichnung steht das Mass 50 ohne Dezimalstellen. Wie ist es zu lesen?',
    asks: (p) => [wahl('Antwort', p.o[0], 'Als 50,000… mit lauter Nullen', [
      ['Als gerundeter Wert mit freier Stelle', 'Nein. Nicht angegebene Dezimalstellen sind Nullen, nicht frei.'],
      ['Als Richtwert ohne feste Grenze', 'Nein. Das Mass ist genau 50.'],
      ['Als 50,0 mit offener zweiter Stelle', 'Nein. Auch die zweite und alle weiteren Stellen sind Null.'],
    ])],
    tipps: () => ['Es geht um die Stellen hinter dem Komma.', 'Was nicht dasteht, ist null.', 'Das Mass ist genau 50, ohne Rest.'],
    loesung: () => ['Grundsatz der Dezimaldarstellung: Nicht angegebene Dezimalstellen sind als Nullen zu interpretieren. 50 ist 50,000…'],
  }),

  // ===== Karte 2: Grundsätze II =====
  task<P>({
    id: 'g11', karte: 'grundsaetze2', stufe: 1, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz der Standardfestlegung',
    title: 'Standard bei Grössenmassen',
    gen: reihen,
    text: () => 'Auf der Zeichnung steht das lineare Grössenmass Ø30 ±0,02 ohne weitere Angabe. Welcher Spezifikationsoperator gilt standardmässig?',
    asks: (p) => [wahl('Linear', p.o[0], 'Das Zweipunktgrössenmass', [
      ['Die Hüllbedingung', 'Nein. Die Hüllbedingung ist ein Modifikator, der den Standard ändert.'],
      ['Das kleinste umschriebene Geometrieelement', 'Nein. Das ist ein globales Merkmal und nur mit Symbol gültig.'],
      ['Das mittlere Grössenmass', 'Nein. Das ist ein Rangordnungsgrössenmass und nur mit Symbol gültig.'],
    ])],
    tipps: () => ['Der Standard ist unsichtbar. Er gilt ohne Symbol.', 'Er misst zwischen zwei gegenüberliegenden Punkten.', 'Zweipunktgrössenmass, Symbol LP (ISO 14405-1).'],
    loesung: () => ['Standard für lineare Grössenmasse: Zweipunktgrössenmass (LP).', 'Er ist in der Zeichnung nicht sichtbar. Jedes Modifikatorsymbol ändert ihn.'],
  }),
  task<P>({
    id: 'g12', karte: 'grundsaetze2', stufe: 2, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz der Standardfestlegung',
    title: 'Standard bei Winkelmassen',
    gen: reihen,
    text: () => 'Auf der Zeichnung steht das Winkelgrössenmass 32° ±1° ohne weitere Angabe. Welcher Spezifikationsoperator gilt standardmässig?',
    asks: (p) => [wahl('Winkel', p.o[0], 'Zwei-Linien-Winkelmass mit Minimax-Kriterium', [
      ['Zwei-Linien-Winkelmass mit kleinsten Quadraten', 'Nein. Der Standard nutzt das Minimax-Kriterium.'],
      ['Zweipunkt-Winkelmass', 'Nein. Das Zweipunktmass ist der Standard der linearen Grössenmasse.'],
      ['Winkelmass mit Hüllbedingung', 'Nein. Eine Hülle ist kein Standard, sie braucht ein Symbol.'],
    ])],
    tipps: () => ['Winkel werden mit Linien erfasst, nicht mit Punkten.', 'Das Kriterium heisst Minimax.', 'Standard: Zwei-Linien-Winkelgrössenmass mit Minimax (ISO 14405-3).'],
    loesung: () => ['Standard für Winkelgrössenmasse: Zwei-Linien-Winkelgrössenmass mit Minimax-Assoziationskriterium.'],
  }),
  task<P>({
    id: 'g13', karte: 'grundsaetze2', stufe: 2, familie: 'waswaere', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz der Standardfestlegung',
    title: 'Modifikator ersetzt den Standard',
    gen: reihen,
    text: () => 'Am Mass Ø30 ±0,02 steht das Symbol E (Hüllbedingung). Gilt zusätzlich noch das Zweipunktgrössenmass als Standard?',
    asks: (p) => [wahl('Antwort', p.o[0], 'Nein, der Standard gilt dann nicht', [
      ['Ja, beide gelten gleichzeitig', 'Nein. Ein Modifikator ersetzt den Standardspezifikationsoperator.'],
      ['Ja, aber nur für die Gutteile', 'Nein. Eine solche Unterscheidung gibt es nicht.'],
      ['Nur wenn die Zeichnung es wiederholt', 'Nein. Wiederholen ändert nichts. Der Modifikator hat den Standard ersetzt.'],
    ])],
    tipps: () => ['Es geht um den Grundsatz der Standardfestlegung.', 'Modifikatoren ändern den Standard.', 'Danach gilt der Standard nicht mehr.'],
    loesung: () => ['Ein Modifikatorsymbol ändert den standardmässigen Spezifikationsoperator.', 'Dann gilt der Standard der ISO nicht mehr.'],
  }),
  task<P>({
    id: 'g14', karte: 'grundsaetze2', stufe: 1, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz der Referenzbedingungen',
    title: 'Bei welcher Temperatur gilt die Zeichnung?',
    gen: reihen,
    text: () => 'Bei welcher Temperatur gelten alle GPS-Spezifikationen standardmässig?',
    asks: (p) => [wahl('Temperatur', p.o[0], '20 °C', [
      ['23 °C', 'Nein. 23 °C gilt z. B. für Kunststoffe, aber nur mit eigener Angabe.'],
      ['25 °C', 'Nein. Das ist keine Referenztemperatur der ISO.'],
      ['15 °C', 'Nein. Die Referenztemperatur ist 20 °C.'],
      ['Raumtemperatur der Werkstatt', 'Nein. Die Norm legt 20 °C fest, nicht die Werkstatt.'],
    ])],
    tipps: () => ['Es gibt genau eine Referenztemperatur.', 'Sie steht in einer Basisnorm der ISO.', 'Die Prüftemperatur beträgt 20 °C.'],
    loesung: () => ['Grundsatz der Referenzbedingungen: Standardmässig gelten alle Spezifikationen bei der Referenztemperatur 20 °C (ISO 1).'],
  }),
  task<P>({
    id: 'g15', karte: 'grundsaetze2', stufe: 3, familie: 'waswaere', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz der Referenzbedingungen',
    title: 'Kunststoffteil bei 23 °C',
    gen: reihen,
    text: () => 'Ein Kunststoffteil soll bei 23 °C ±2 K und 50 % ±10 % relativer Luftfeuchtigkeit geprüft werden. Was muss die Zeichnung tun?',
    asks: (p) => [wahl('Antwort', p.o[0], 'Die andere Bedingung ausdrücklich festlegen', [
      ['Nichts, 20 °C gilt automatisch auch für Kunststoff', 'Nein. 20 °C gilt nur, solange nichts anderes festgelegt ist.'],
      ['Nichts, der Prüfer wählt die Temperatur', 'Nein. Die Konstruktion legt die Bedingungen fest.'],
      ['Nur die Temperatur festlegen, die Feuchtigkeit nicht', 'Nein. Alle abweichenden Bedingungen müssen festgelegt werden.'],
    ])],
    tipps: () => ['Standard ist 20 °C.', 'Abweichungen muss man schreiben.', 'Temperatur und Feuchtigkeit gehören beide auf die Zeichnung (z. B. mit Verweis auf ISO 291).'],
    loesung: () => ['Zusätzliche oder andere Bedingungen müssen separat festgelegt werden.', 'Beispiel aus dem Guide: Verweis auf ISO 291 mit 23 °C und 50 % relativer Luftfeuchtigkeit.'],
  }),
  task<P>({
    id: 'g16', karte: 'grundsaetze2', stufe: 2, familie: 'waswaere', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz des starren Werkstückes',
    title: 'Dünnes Blech',
    gen: reihen,
    text: () => 'Ein dünnes Blech verformt sich schon durch sein Eigengewicht. Auf der Zeichnung steht keine Einspannbedingung. Wie gilt die Spezifikation?',
    asks: (p) => [wahl('Antwort', p.o[0], 'Für das starre Werkstück im freien Zustand', [
      ['Für das Blech so, wie es auf dem Tisch liegt', 'Nein. Die Schwerkraft zählt nicht. Das Werkstück gilt als unendlich steif.'],
      ['Für das Blech im üblichen Prüfaufbau', 'Nein. Es gibt keinen üblichen Aufbau ohne Angabe.'],
      ['Für das Blech nach Wahl des Prüfers', 'Nein. Der Prüfer wählt nicht frei.'],
    ])],
    tipps: () => ['Standard: Das Werkstück ist unendlich steif.', 'Verformung durch Kräfte oder Schwerkraft zählt nicht.', 'Bei biegsamen Teilen muss die Einspannung angegeben werden.'],
    loesung: () => ['Grundsatz des starren Werkstückes: Alle Spezifikationen gelten im freien Zustand ohne Verformung durch äussere Kräfte.', 'Bei dünnen Blechen, Elastomerteilen und dünnwandigen Grossteilen ist eine Einspannbedingung zwingend (z. B. Verweis auf ISO 10579).'],
  }),
  task<P>({
    id: 'g17', karte: 'grundsaetze2', stufe: 2, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz der Dualität',
    title: 'Messgerät nicht vorgeschrieben',
    gen: () => ({ ...reihen() }),
    text: () => 'Die Zeichnung schreibt kein Messgerät vor. Weshalb nicht?',
    asks: (p) => [
      wahl('Grund', p.o[0], 'Die Spezifikation ist unabhängig von jedem Messverfahren', [
        ['Das Messgerät steht im Prüfplan, nicht in der Norm', 'Nein. Es hat einen anderen Grund: Die Spezifikation hängt nicht vom Messverfahren ab.'],
        ['Jedes Messgerät liefert dasselbe Resultat', 'Nein. Verschiedene Geräte haben verschiedene Unsicherheit.'],
        ['Die Messunsicherheit ist immer null', 'Nein. Messunsicherheit gibt es immer.'],
      ]),
      wahl('Folge', p.o[1], 'Methodenunsicherheit', [
        ['Schätzfehler der Zeichnung', 'Nein. Das ist kein Begriff der Norm.'],
        ['Fertigungstoleranz', 'Nein. Das ist die Toleranz am Teil, keine Unsicherheit der Prüfung.'],
        ['Einspannunsicherheit', 'Nein. Gemeint ist der Unterschied zwischen Spezifikations- und Verifikationsoperator.'],
      ]),
    ],
    tipps: () => ['Das ist der Grundsatz der Dualität.', 'Der Prüfer bildet die Spezifikation nach, so gut es geht.', 'Der Unterschied heisst Methodenunsicherheit.'],
    loesung: () => ['Grundsatz der Dualität: Der Spezifikationsoperator ist unabhängig von Messverfahren und Messeinrichtung.', 'Der Verifikationsoperator bildet ihn nach, aber nicht vollständig. Der Unterschied ist die Methodenunsicherheit, ein Teil der Messunsicherheit.'],
  }),
  task<P>({
    id: 'g18', karte: 'grundsaetze2', stufe: 3, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz der Verantwortlichkeit',
    title: 'Wer ist wofür verantwortlich?',
    gen: reihen,
    text: () => 'Zwei Fragen zur Verantwortung. Wer trägt sie?',
    asks: (p) => [
      wahl('Mehrdeutigkeit der Spezifikation', p.o[0], 'Die Konstruktion', [
        ['Die Fertigung', 'Nein. Die Fertigung setzt die Zeichnung um.'],
        ['Die Messtechnik', 'Nein. Die Messtechnik prüft die Zeichnung.'],
        ['Der Kunde beim Einkauf', 'Nein. Die Spezifikation kommt aus der Konstruktion.'],
      ]),
      wahl('Messunsicherheit beim Nachweis', p.o[1], 'Die Partei, die den Nachweis führt', [
        ['Die Konstruktion', 'Nein. Die Konstruktion verantwortet die Spezifikation.'],
        ['Immer der Lieferant', 'Nein. Es zählt, wer den Nachweis führt, auch der Kunde.'],
        ['Der Hersteller des Messgeräts', 'Nein. Er liefert das Gerät, aber nicht den Nachweis.'],
      ]),
    ],
    tipps: () => ['Zwei Operatoren, zwei Verantwortliche.', 'Spezifikation gegen Funktion: Konstruktion.', 'Verifikation gegen Spezifikation: die Partei, die prüft und bewertet (ISO 14253-1).'],
    loesung: () => ['Konstruktion: Annäherung des Spezifikationsoperators an die Funktion (Mehrdeutigkeit).', 'Prüfende Partei: Annäherung des Verifikationsoperators an die Spezifikation (Messunsicherheit).'],
  }),
  task<P>({
    id: 'g19', karte: 'grundsaetze2', stufe: 3, familie: 'fehler', src: 'nach Swissmem ISO-GPS-Guide, Grundsatz der allgemeinen Spezifikation',
    title: 'Zwei Allgemeintoleranzen',
    gen: reihen,
    text: () => 'Auf einer Zeichnung stehen zwei Allgemeintoleranzen. Es steht nirgends, für welches Merkmal welche gilt. Die beiden widersprechen sich. Wie ist das zu behandeln?',
    asks: (p) => [wahl('Antwort', p.o[0], 'Nur die tolerantere von beiden muss gelten', [
      ['Nur die engere von beiden muss gelten', 'Nein. Bei Mehrdeutigkeit muss nur die tolerantere eingehalten werden.'],
      ['Nur die zuerst genannte muss gelten', 'Nein. Die Reihenfolge der Angaben entscheidet nicht.'],
      ['Beide müssen gleichzeitig gelten', 'Nein. Das wäre die strengere Lesart. Die Norm verlangt nur die tolerantere.'],
    ])],
    tipps: () => ['Die Zeichnung ist unklar. Wer trägt das Risiko?', 'Die Konstruktion hat nicht angegeben, was gilt.', 'Es genügt die tolerantere (weniger strenge).'],
    loesung: () => ['Grundsatz der allgemeinen Spezifikation: Bei Widerspruch ohne Zuordnung liegt Mehrdeutigkeit vor.', 'Dann muss nur die toleranteste der allgemeinen Spezifikationen eingehalten werden.'],
  }),

  // ===== Karte 3: Grössenmassmerkmale =====
  task<{ m: M; ab: M[]; o: number[] }>({
    id: 'g20', karte: 'grossenmass', stufe: 1, familie: 'umgekehrt', src: 'nach Swissmem ISO-GPS-Guide, Übersicht ISO 14405-1',
    title: 'Symbol zum Namen',
    gen: () => { const m = pick(MERKMAL); return { m, ab: ablenker(m), o: mische(4) }; },
    text: (p) => `Welches Grössenmassmerkmal gehört zum Symbol ${p.m.s}?`,
    asks: (p) => [{ kind: 'choice', k: `Symbol ${p.m.s}`, ...(() => { const opts = [p.m.n, ...p.ab.map((x) => x.n)]; return { opts: p.o.map((i) => opts[i]), a: p.o.indexOf(0), why: p.o.map((i) => (i === 0 ? undefined : `Nein. ${p.ab[i - 1].n} hat das Symbol ${p.ab[i - 1].s}.`)) }; })() }],
    tipps: (p) => ['Schau in die Übersicht der Grössenmassmerkmale.', `Das Symbol ${p.m.s} gehört zur Gruppe «${GRUPPEN[p.m.g]}».`, `${p.m.s} steht für ${p.m.n}.`],
    loesung: (p) => [`${p.m.s} = ${p.m.n}.`, WARUM_GRUPPE(p.m)],
  }),
  task<{ m: M; ab: M[]; o: number[] }>({
    id: 'g21', karte: 'grossenmass', stufe: 2, familie: 'rechnen', src: 'nach Swissmem ISO-GPS-Guide, Übersicht ISO 14405-1',
    title: 'Name zum Symbol',
    gen: () => { const m = pick(MERKMAL); return { m, ab: ablenker(m), o: mische(4) }; },
    text: (p) => `Du willst ${p.m.n.charAt(0).toLowerCase() + p.m.n.slice(1)} vorschreiben. Welches Symbol gehört dazu?`,
    asks: (p) => [{ kind: 'choice', k: 'Symbol', ...(() => { const opts = [p.m.s, ...p.ab.map((x) => x.s)]; return { opts: p.o.map((i) => opts[i]), a: p.o.indexOf(0), why: p.o.map((i) => (i === 0 ? undefined : `Nein. ${p.ab[i - 1].s} steht für ${p.ab[i - 1].n}.`)) }; })() }],
    tipps: (p) => ['Gleiche Gruppe heisst oft ähnliche Buchstaben.', `Das gesuchte Symbol gehört zur Gruppe «${GRUPPEN[p.m.g]}».`, `Gesucht: ${p.m.s}.`],
    loesung: (p) => [`${p.m.n} = ${p.m.s}.`, WARUM_GRUPPE(p.m)],
  }),
  task<{ m: M; o: number[][] }>({
    id: 'g22', karte: 'grossenmass', stufe: 2, familie: 'bild', src: 'nach Swissmem ISO-GPS-Guide, Übersicht ISO 14405-1',
    title: 'Gruppe im Bild finden',
    gen: () => ({ m: pick(MERKMAL), o: [mische(4)] }),
    draw: () => B.massmerkmale(),
    text: (p) => `Das Bild zeigt die vier Gruppen der Grössenmassmerkmale. In welcher Gruppe steht das Symbol ${p.m.s}?`,
    asks: (p) => {
      const richtig = GRUPPEN[p.m.g];
      const falsch = (Object.values(GRUPPEN) as string[]).filter((x) => x !== richtig);
      const opts = [richtig, ...falsch];
      return [{ kind: 'choice', k: `Symbol ${p.m.s}`, opts: p.o[0].map((i) => opts[i]), a: p.o[0].indexOf(0), why: p.o[0].map((i) => (i === 0 ? undefined : `Nein. ${WARUM_GRUPPE(p.m)}`)) }];
    },
    tipps: () => ['Suche das Symbol in einer der vier Spalten.', 'Lies die Überschrift der Spalte.', 'Die Spalte mit dem Symbol nennt die Gruppe.'],
    loesung: (p) => [WARUM_GRUPPE(p.m)],
  }),
  task<P>({
    id: 'g23', karte: 'grossenmass', stufe: 3, familie: 'fehler', src: 'nach Swissmem ISO-GPS-Guide, Fussnote 5 der Übersicht ISO 14405-1',
    title: 'Rangordnung allein?',
    gen: reihen,
    text: () => 'Ein Kollege schreibt an ein Mass nur SX (grösstes Grössenmass). Was ist falsch daran?',
    asks: (p) => [wahl('Fehler', p.o[0], 'Es ist kein eigenes Merkmal, nur eine Ergänzung', [
      ['Das Symbol SX ist nicht gültig', 'Nein. SX ist gültig, aber nur als Ergänzung.'],
      ['Es braucht ein globales Merkmal dazu', 'Nein. SX ist ein Rangordnungsgrössenmass. Es ergänzt örtliche Merkmale.'],
      ['Es gilt nur mit der Hüllbedingung', 'Nein. Es gilt zusammen mit einem örtlichen Grössenmass, nicht mit E.'],
    ])],
    tipps: () => ['Schau auf die Fussnote zu den Rangordnungsgrössenmassen.', 'Sie sind keine eigenständigen Massmerkmale.', 'Beispiele im Guide: LS SX ALS und LP SD ACS.'],
    loesung: () => ['Rangordnungsgrössenmasse sind keine eigenständigen Massmerkmale.', 'Sie ergänzen örtliche Grössenmasse. Beispiele aus dem Guide: LS SX ALS, LP SD ACS.'],
  }),
  task<P>({
    id: 'g24', karte: 'grossenmass', stufe: 3, familie: 'begruenden', src: 'nach Swissmem ISO-GPS-Guide, Fussnote 1 der Übersicht ISO 14405-1',
    title: 'Platzhalter im Symbol',
    gen: reihen,
    text: () => 'Beim Querschnittsgrössenmass mit diversen Assoziationskriterien (ACS, ALS, SCS) steht im Symbol ein Platzhalter. Wofür steht er?',
    asks: (p) => [wahl('Platzhalter', p.o[0], 'Für GG, GC, GX oder GN', [
      ['Für LP, LS, CC oder CA', 'Nein. Das sind örtliche Merkmale. Der Platzhalter steht für globale Kriterien.'],
      ['Für SX, SN, SA oder SM', 'Nein. Das sind Rangordnungsgrössenmasse.'],
      ['Für GG, GC, CV oder E', 'Nein. CV und E gehören nicht zu den vier Kriterien des Platzhalters.'],
    ])],
    tipps: () => ['Es geht um Assoziationskriterien.', 'Sie gehören zu den globalen Grössenmassen.', 'Vier Kriterien: GG, GC, GX, GN.'],
    loesung: () => ['Der Platzhalter steht für eines der Assoziationskriterien GG, GC, GX oder GN.', 'Dasselbe gilt für Teilbereichsgrössenmasse mit diversen Kriterien.'],
  }),
];
