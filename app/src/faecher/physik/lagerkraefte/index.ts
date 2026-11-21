import type { Kapitel } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const lagerkraefte: Kapitel = {
  id: 'lager',
  title: 'Lagerkräfte',
  kurz: 'Träger, Wellen, Kragarme, Hebel und Kräne in ihren Lagern',
  formeln: [
    { name: 'Momentengleichgewicht', f: eq('Σ ' + m('M links') + ' = Σ ' + m('M rechts')), g: 'Drehpunkt in ein Lager legen, dann fällt dessen Kraft weg' },
    { name: 'Eine Last auf zwei Lagern', f: eq(f('F_B') + ' = ' + f('F') + ' · ' + l('a') + ' : ' + l('l') + ',  ' + f('F_A') + ' = ' + f('F') + ' − ' + f('F_B')), g: 'a = Abstand der Last von A, l = Lagerabstand' },
    { name: 'Mehrere Lasten', f: eq(f('F_B') + ' · ' + l('l') + ' = ' + f('F_1') + ' · ' + l('l_1') + ' + ' + f('F_2') + ' · ' + l('l_2')), g: 'Alle Abstände vom gleichen Drehpunkt aus messen' },
    { name: 'Kräftegleichgewicht', f: eq(f('F_A') + ' + ' + f('F_B') + ' = Σ ' + f('F')), g: 'Summe der Lagerkräfte = Summe der Lasten' },
    { name: 'Last ausserhalb der Lager', f: eq(f('F_B') + ' = ' + f('F') + ' · (' + l('l') + ' + ' + l('c') + ') : ' + l('l') + ',  ' + f('F_A') + ' = ' + f('F_B') + ' − ' + f('F')), g: 'c = Überstand. F_A wirkt dann nach unten' },
    { name: 'Eine Lagerstelle', f: eq(f('F_A') + ' = √(' + f('F_Ax') + '² + ' + f('F_Ay') + '²)'), g: 'Teilkräfte stehen rechtwinklig. tan α = F_Ay : F_Ax' },
    { name: 'Gewichtskraft', f: eq(f('F_G') + ' = m · g'), g: 'm in kg, g = 9,81 m/s², F_G in N' },
  ],
  karten: [
    { id: 'zwei', title: 'Träger auf zwei Lagern', ziel: 'Du legst den Drehpunkt in ein Lager und berechnest beide Lagerkräfte bei einer oder mehreren Lasten.' },
    { id: 'kragarm', title: 'Last ausserhalb der Lager', ziel: 'Du erkennst, warum ein Lager nach unten ziehen kann, und rechnest Überstände richtig.', hilfreich: ['zwei'] },
    { id: 'eine', title: 'Bauteil mit einer Lagerstelle', ziel: 'Du berechnest Lagerkraft und Winkel mit dem Krafteck, wenn nur ein Lager da ist.', hilfreich: ['zwei'] },
    { id: 'kran', title: 'Wandernde Last und Kombiniertes', ziel: 'Du verbindest Lagerkräfte mit Gewichtskraft und Drehmoment und rechnest rückwärts.', hilfreich: ['zwei', 'kragarm'] },
  ],
  aufgaben: AUFGABEN,
};
