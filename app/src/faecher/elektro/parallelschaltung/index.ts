import type { Kapitel } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const parallelschaltung: Kapitel = {
  id: 'parallel',
  title: 'Parallelschaltung',
  kurz: 'Ersatzwiderstand, Teilströme, Knotenregel, Geräte am Netz',
  formeln: [
    { name: 'Spannung', f: eq(l('U') + ' = ' + l('U1') + ' = ' + l('U2') + ' = …'), g: 'An jedem Zweig liegt dieselbe Spannung. U in V' },
    { name: 'Knotenregel', f: eq(m('I') + ' = ' + f('I1') + ' + ' + f('I2') + ' + ' + f('I3') + ' + …'), g: 'Gesamtstrom = Summe der Teilströme. I in A' },
    { name: 'Teilstrom', f: eq(f('I1') + ' = ' + l('U') + ' : R1'), g: 'gilt für jeden Zweig' },
    { name: 'Ersatzwiderstand', f: eq('1 : R = 1 : R1 + 1 : R2 + 1 : R3 + …'), g: 'R ist kleiner als der kleinste Teilwiderstand. R in Ω' },
    { name: 'Zwei Widerstände', f: eq('R = R1 · R2 : (R1 + R2)'), g: '«Produkt durch Summe», nur für zwei' },
    { name: 'n gleiche Widerstände', f: eq('R = R1 : n'), g: 'und ' + m('I') + ' = n · ' + f('I1') },
    { name: 'Leitwerte', f: eq('G = G1 + G2 + G3 + …') + ' · ' + eq('G = 1 : R'), g: 'G in S, 1 S = 1 : Ω, 1 mS = 0,001 S' },
    { name: 'Stromteiler', f: eq(f('I1') + ' : ' + f('I2') + ' = R2 : R1'), g: 'kleinerer Widerstand, grösserer Strom' },
  ],
  karten: [
    { id: 'ersatz', title: 'Ersatzwiderstand', ziel: 'Du rechnest R mit Kehrwerten, mit «Produkt durch Summe» und mit Leitwerten. Du weisst: R ist kleiner als der kleinste Widerstand.' },
    { id: 'strom', title: 'Teilströme und Knotenregel', ziel: 'Du rechnest Teilströme mit I1 = U : R1, wendest die Knotenregel an und rechnest einen unbekannten Zweig rückwärts.', hilfreich: ['ersatz'] },
    { id: 'gleich', title: 'Gleiche Bauteile und Unterbruch', ziel: 'Du rechnest gleiche Lampen parallel im Kopf und erklärst, was bei einer durchgebrannten Lampe passiert.', hilfreich: ['strom'] },
    { id: 'praxis', title: 'Geräte am Netz, Sicherung, Kurzschluss', ziel: 'Du rechnest den Strom einer Steckdosenleiste, prüfst die Sicherung und erklärst den Kurzschluss.', hilfreich: ['strom'] },
  ],
  aufgaben: AUFGABEN,
};
