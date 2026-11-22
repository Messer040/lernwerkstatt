import type { Kapitel } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const kettenaufgaben: Kapitel = {
  id: 'kette',
  title: 'Kettenaufgaben',
  kurz: 'Mehrere Schritte hintereinander: Moment, Zerlegen, Gleichgewicht, Lager',
  formeln: [
    { name: 'Reihenfolge der Kette', f: eq(m('Σ M = 0') + '  →  zerlegen  →  ' + f('Σ F = 0')), g: 'Erst eine Grösse über das Moment, dann Kräfte zerlegen, dann Gleichgewicht der Kräfte' },
    { name: 'Wirksamer Hebelarm', f: eq(l('r') + ' = ' + l('l') + ' · sin β'), g: 'β = Winkel zwischen Kraft und Hebel. Nur der Anteil senkrecht zum Hebel dreht' },
    { name: 'Zerlegen', f: eq(f('F_x') + ' = F · cos α,  ' + f('F_y') + ' = F · sin α'), g: 'α = Winkel zur Waagrechten' },
    { name: 'Zusammensetzen', f: eq(f('F') + ' = √(' + f('F_x') + '² + ' + f('F_y') + '²)'), g: 'Teilkräfte stehen rechtwinklig' },
    { name: 'Umfangskraft', f: eq(f('F_u') + ' = 2 · ' + m('M') + ' : d'), g: 'M in N·mm, d in mm, F_u in N' },
    { name: 'Zahnnormalkraft', f: eq(f('F_n') + ' = ' + f('F_u') + ' : cos 20°'), g: 'Eingriffswinkel 20°. F_n belastet die Welle quer' },
    { name: 'Riemenzug', f: eq(f('F_u') + ' = ' + f('F_1') + ' − ' + f('F_2') + ',  ' + f('F_W') + ' = ' + f('F_1') + ' + ' + f('F_2')), g: 'Die Differenz treibt, die Summe belastet die Welle' },
    { name: 'Schiefe Ebene mit Reibung', f: eq(f('F_S') + ' = ' + f('F_G') + ' · (sin α + μ · cos α)'), g: 'Seilkraft parallel zur Ebene, F_G = m · g' },
  ],
  karten: [
    { id: 'last', title: 'Von der Last zum Lager', ziel: 'Du gehst von einer Last über Moment und Zerlegen bis zu den Lagerkräften und hältst die Reihenfolge ein.' },
    { id: 'wand', title: 'Konsole und Kran an der Wand', ziel: 'Du findest zuerst die Grösse, die du sofort rechnen kannst, und gehst daraus Schritt für Schritt weiter.', hilfreich: ['last'] },
    { id: 'welle', title: 'Zahnrad und Riemen auf der Welle', ziel: 'Du rechnest vom Drehmoment über die Umfangskraft zu den Lagerkräften.', hilfreich: ['last'] },
    { id: 'pruefen', title: 'Fehler in der Kette finden', ziel: 'Du erkennst, in welchem Schritt eine Kette kippt, und prüfst Zwischenwerte.', hilfreich: ['wand', 'welle'] },
  ],
  aufgaben: AUFGABEN,
};
