import type { Kapitel } from '../../../core/types';
import { eq, f, l, v as w } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const arbeitEnergie: Kapitel = {
  id: 'arbeit',
  title: 'Arbeit, Energie',
  kurz: 'Hubarbeit, Reibungsarbeit, Federarbeit, potenzielle und kinetische Energie',
  formeln: [
    { name: 'Mechanische Arbeit', f: eq(w('W') + ' = ' + f('F') + ' · ' + l('s')), g: 'W in N·m = J, F in N (Kraft in Wegrichtung), s in m' },
    { name: 'Hubarbeit', f: eq(w('W') + ' = ' + f('F_G') + ' · ' + l('h') + ' = m · g · ' + l('h')), g: 'm in kg, g = 9,81 m/s², h = Hubhöhe in m' },
    { name: 'Reibungsarbeit', f: eq(w('W') + ' = ' + f('F_R') + ' · ' + l('s') + ' = μ · ' + f('F_N') + ' · ' + l('s')), g: 'μ = Reibungszahl, F_N = Normalkraft in N' },
    { name: 'Spannarbeit der Feder', f: eq(w('W') + ' = ' + f('F') + ' · ' + l('s') + ' : 2 = R · ' + l('s') + '² : 2'), g: 'R = Federrate in N/mm, s = Federweg in mm. Ergebnis in N·mm, durch 1000 für N·m' },
    { name: 'Potenzielle Energie', f: eq(w('W_p') + ' = m · g · ' + l('h')), g: 'Lageenergie: gespeicherte Hubarbeit' },
    { name: 'Kinetische Energie', f: eq(w('W_k') + ' = m · v² : 2'), g: 'Bewegungsenergie, v in m/s. km/h : 3,6 = m/s' },
    { name: 'Energieerhaltung', f: eq(w('W_p') + ' = ' + w('W_k')), g: 'ohne Reibung. Daraus folgt v = √(2 · g · h)' },
    { name: 'Einheiten', f: eq('1 N·m = 1 J · 1 W·h = 3600 J · 1 kW·h = 3,6 · 10⁶ J'), g: 'J = Joule, W·h = Wattstunde' },
  ],
  karten: [
    { id: 'arbeit', title: 'Arbeit = Kraft mal Weg', ziel: 'Du rechnest Hubarbeit und Reibungsarbeit mit W = F · s und rechnest Einheiten um (N·m, kJ, W·h).' },
    { id: 'feder', title: 'Spannarbeit der Feder', ziel: 'Du rechnest W = R · s² : 2 und erklärst, warum die Federarbeit mit dem Quadrat des Wegs wächst.', hilfreich: ['arbeit'] },
    { id: 'energie', title: 'Potenzielle und kinetische Energie', ziel: 'Du rechnest W_p = m · g · h und W_k = m · v² : 2 und rechnest km/h in m/s um.', hilfreich: ['arbeit'] },
    { id: 'erhaltung', title: 'Energie wandelt sich um', ziel: 'Du setzt Energie vorher gleich Energie nachher und rechnest Fallgeschwindigkeit, Bremsweg und Federpuffer.', hilfreich: ['feder', 'energie'] },
  ],
  aufgaben: AUFGABEN,
};
