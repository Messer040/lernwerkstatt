import type { Kapitel } from '../../../core/types';
import { eq, f, l, r } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const kraefteAddieren: Kapitel = {
  id: 'addieren',
  title: 'Kräfte addieren',
  kurz: 'Resultierende: auf einer Linie, rechtwinklig, unter Winkel',
  formeln: [
    { name: 'Gleiche Richtung', f: eq(r('F_r') + ' = ' + f('F₁') + ' + ' + f('F₂')), g: 'F in N, Kräfte auf einer Wirkungslinie' },
    { name: 'Entgegengesetzt', f: eq(r('F_r') + ' = ' + f('F₁') + ' − ' + f('F₂')), g: 'Die grössere Kraft bestimmt die Richtung' },
    { name: 'Gleichgewicht', f: eq('Σ F = 0'), g: 'Die Resultierende ist null, der Kräfteplan schliesst sich' },
    { name: 'Rechtwinklig', f: eq(r('F_r') + ' = √(' + f('F₁') + '² + ' + f('F₂') + '²)'), g: 'tan α = F₂ : F₁, α = Winkel zwischen F_r und F₁' },
    { name: 'Gleich grosse Kräfte', f: eq(r('F_r') + ' = 2 · F · cos(γ : 2)'), g: 'γ = Winkel zwischen den beiden Kräften' },
    { name: 'Kräftemassstab', f: eq(l('l') + ' = ' + f('F') + ' : M_k'), g: 'M_k in N/mm, l = Pfeillänge in mm' },
  ],
  karten: [
    { id: 'linie', title: 'Auf einer Wirkungslinie', ziel: 'Du addierst und subtrahierst Kräfte auf einer Linie und erkennst Gleichgewicht.' },
    { id: 'plan', title: 'Kräfteplan und Massstab', ziel: 'Du rechnest Pfeillängen mit dem Kräftemassstab und liest F_r aus dem Plan.', hilfreich: ['linie'] },
    { id: 'rechtwinklig', title: 'Rechtwinklige Kräfte', ziel: 'Du berechnest F_r und den Winkel mit Pythagoras und Tangens.', hilfreich: ['linie'] },
    { id: 'winkel', title: 'Kräfte unter beliebigem Winkel', ziel: 'Du setzt zwei Kräfte unter einem Winkel zusammen, rechnerisch und im Kräfteplan.', hilfreich: ['rechtwinklig', 'plan'] },
  ],
  aufgaben: AUFGABEN,
};
