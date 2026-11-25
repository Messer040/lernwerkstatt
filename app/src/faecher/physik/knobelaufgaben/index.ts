import type { Kapitel } from '../../../core/types';
import { eq, f, l, v as w } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const knobelaufgaben: Kapitel = {
  id: 'knobel',
  title: 'Knobelaufgaben',
  kurz: 'Mobile, Brücke, Gabelstapler, Kugelbahn: anders denken',
  formeln: [
    { name: 'Mobile: oberer Stab', f: eq('m_1 · ' + l('c') + ' = (m_2 + m_3) · ' + l('d')), g: 'Der untere Stab zählt am oberen Stab als ein Gewicht. Masse in g, Abstand in cm' },
    { name: 'Mobile: unterer Stab', f: eq('m_2 · ' + l('a') + ' = m_3 · ' + l('b')), g: 'Kurzer Arm, grosse Masse. g kürzt sich weg' },
    { name: 'Lagerkraft rückwärts', f: eq(f('F_B') + ' = ' + f('F_G') + ' − ' + f('F_A') + ',  ' + l('x') + ' = ' + f('F_B') + ' · ' + l('l') + ' : ' + f('F_G')), g: 'x = Abstand der Last von Lager A, l = Lagerabstand' },
    { name: 'Kippgrenze', f: eq(f('F_L') + ' · ' + l('a') + ' = ' + f('F_G') + ' · ' + l('b') + ',  m_L = m_S · ' + l('b') + ' : ' + l('a')), g: 'K = Kippkante = Drehpunkt. a = Abstand der Last, b = Abstand des Schwerpunkts' },
    { name: 'Kippsicherheit', f: eq('m_zul = m_L : S'), g: 'S = Sicherheit, z. B. 1,5. Mehr Sicherheit heisst weniger Last' },
    { name: 'Energie unten', f: eq(w('m · g · h_1 = m · v² : 2') + ',  v = √(2 · g · h_1)'), g: 'h_1 in m, g = 9,81 m/s², v in m/s' },
    { name: 'Höhe nach Verlust', f: eq(l('h_2') + ' = ' + l('h_1') + ' · (1 − Verlust)'), g: 'Verlust als Anteil der Energie, z. B. 0,2 für 20 %. Höhe ist proportional zur Energie' },
  ],
  karten: [
    { id: 'mobile', title: 'Mobile: Hebel übereinander', ziel: 'Du behandelst einen unteren Stab als ein Gewicht am oberen Stab und rechnest von oben nach unten.' },
    { id: 'bruecke', title: 'Brücke: rückwärts rechnen', ziel: 'Du bestimmst aus einer gemessenen Lagerkraft die Position der Last.' },
    { id: 'kippen', title: 'Kippen: Standmoment gegen Kippmoment', ziel: 'Du findest die Kippgrenze und rechnest mit Kippsicherheit.', hilfreich: ['mobile'] },
    { id: 'bahn', title: 'Kugelbahn: Energie mit Verlust', ziel: 'Du verfolgst die Energie vom Start über den tiefsten Punkt bis zum Umkehrpunkt.' },
  ],
  aufgaben: AUFGABEN,
};
