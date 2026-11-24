import type { Kapitel } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const reihenschaltung: Kapitel = {
  id: 'reihe',
  title: 'Reihenschaltung',
  kurz: 'Ersatzwiderstand, Teilspannungen, Vorwiderstand (Buch 3.7.1)',
  formeln: [
    { name: 'Ersatzwiderstand', f: eq('R = R1 + R2 + R3 + …'), g: 'R in Ω. Für n gleiche: R = n · R1' },
    { name: 'Strom', f: eq(m('I') + ' = ' + l('U') + ' : R'), g: 'überall gleich gross. I in A, 1 A = 1000 mA' },
    { name: 'Gesamtspannung', f: eq(l('U') + ' = ' + f('U1') + ' + ' + f('U2') + ' + ' + f('U3') + ' + …'), g: 'Maschenregel. Für n gleiche: U = n · U1' },
    { name: 'Teilspannung', f: eq(f('U1') + ' = R1 · ' + m('I')), g: 'gilt für jedes Bauteil' },
    { name: 'Spannungsteiler', f: eq(f('U1') + ' : ' + l('U') + ' = R1 : R') + ' · ' + eq(f('U1') + ' : ' + f('U2') + ' = R1 : R2'), g: 'grösserer Widerstand, grössere Spannung' },
    { name: 'Vorwiderstand', f: eq('Rv = (' + l('U') + ' − U_Gerät) : ' + m('I')), g: 'I = Nennstrom des Geräts' },
    { name: 'Einheiten-Trick', f: eq('V : kΩ = mA · kΩ · mA = V'), g: 'spart Zehnerpotenzen' },
  ],
  karten: [
    { id: 'ersatz', title: 'Ersatzwiderstand und Strom', ziel: 'Du addierst die Widerstände und rechnest mit I = U : R den Strom, auch mit kΩ und mA.' },
    { id: 'teil', title: 'Teilspannungen', ziel: 'Du rechnest U1 = R1 · I, prüfst mit der Maschenregel und rechnest aus einer bekannten Teilspannung rückwärts.', hilfreich: ['ersatz'] },
    { id: 'vorwid', title: 'Vorwiderstand', ziel: 'Du bestimmst den Vorwiderstand für Lampe, Lötkolben, Relais und LEDs.', hilfreich: ['teil'] },
    { id: 'gleich', title: 'Gleiche Bauteile, Brücken, Schalter', ziel: 'Du rechnest Lampenketten und Zellen in Reihe und erklärst, was bei Brücke und Unterbruch passiert.', hilfreich: ['teil'] },
    { id: 'fehler', title: 'Einheiten sicher', ziel: 'Du schreibst zu jedem Resultat die richtige Einheit: Ω, V, A.' },
  ],
  aufgaben: AUFGABEN,
};
