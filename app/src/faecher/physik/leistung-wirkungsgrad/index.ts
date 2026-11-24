import type { Kapitel } from '../../../core/types';
import { eq, f, l, v as w } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const leistungWirkungsgrad: Kapitel = {
  id: 'leistung',
  title: 'Leistung, Wirkungsgrad',
  kurz: 'Leistung, Wirkungsgrad, Gesamtwirkungsgrad, Energie und Stromkosten',
  formeln: [
    { name: 'Leistung', f: eq(w('P') + ' = ' + w('W') + ' : t'), g: 'P in W = J/s, W = Arbeit in J, t = Zeit in s' },
    { name: 'Leistung aus Kraft und Tempo', f: eq(w('P') + ' = ' + f('F') + ' · v'), g: 'F in N, v in m/s. km/h : 3,6 = m/s' },
    { name: 'Wirkungsgrad', f: eq('η = ' + w('P_ab') + ' : ' + w('P_zu')), g: 'immer kleiner als 1. P_ab abgegeben, P_zu zugeführt, beide in W oder kW' },
    { name: 'Verlustleistung', f: eq(w('P_V') + ' = ' + w('P_zu') + ' − ' + w('P_ab')), g: 'geht als Wärme verloren' },
    { name: 'Gesamtwirkungsgrad', f: eq('η_ges = η_1 · η_2 · …'), g: 'Glieder hintereinander: multiplizieren, nie addieren' },
    { name: 'Energie aus Leistung', f: eq(w('W') + ' = P · t'), g: 'P in kW, t in h gibt kWh. 1 kWh = 3,6 MJ' },
    { name: 'Hubleistung', f: eq(w('P') + ' = m · g · ' + l('h') + ' : t'), g: 'm in kg, g = 9,81 m/s², h in m, t in s' },
  ],
  karten: [
    { id: 'leistung', title: 'Leistung = Arbeit pro Zeit', ziel: 'Du rechnest P = W : t und P = F · v und rechnest kW, W und km/h richtig um.' },
    { id: 'wirkungsgrad', title: 'Wirkungsgrad und Verlust', ziel: 'Du rechnest η = P_ab : P_zu, stellst nach P_zu um und erkennst, dass P_zu immer grösser ist als P_ab.', hilfreich: ['leistung'] },
    { id: 'kette', title: 'Gesamtwirkungsgrad', ziel: 'Du multiplizierst die Wirkungsgrade einer Kette und rechnest vom Ausgang zurück zur Motorleistung.', hilfreich: ['wirkungsgrad'] },
    { id: 'kosten', title: 'Energie und Stromkosten', ziel: 'Du rechnest W = P · t in kWh und berechnest Stromkosten mit der zugeführten Leistung.', hilfreich: ['wirkungsgrad'] },
  ],
  aufgaben: AUFGABEN,
};
