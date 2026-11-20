import type { Kapitel } from '../../../core/types';
import { eq, f } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const kraefteZerlegen: Kapitel = {
  id: 'zerlegen',
  title: 'Kräfte zerlegen',
  kurz: 'Teilkräfte: rechtwinklig, symmetrisch, an Streben und Seilen',
  formeln: [
    { name: 'Rechtwinklig zerlegen', f: eq(f('F_x') + ' = F · cos α,  ' + f('F_y') + ' = F · sin α'), g: 'α = Winkel zur x-Richtung, F in N' },
    { name: 'Pythagoras', f: eq(f('F') + '² = ' + f('F₁') + '² + ' + f('F₂') + '²'), g: 'F = Hypotenuse, die schräge Kraft ist die grösste' },
    { name: 'Schräge Kraft', f: eq(f('F') + ' = ' + f('F_senkrecht') + ' : cos α'), g: 'α = Winkel zwischen F und der senkrechten Teilkraft' },
    { name: 'Zwei gleiche Teilkräfte', f: eq(f('F₁') + ' = ' + f('F_G') + ' : (2 · cos β)'), g: 'β = Winkel jeder Teilkraft zur Senkrechten' },
    { name: 'Flache Seile', f: eq(f('F₁') + ' = ' + f('F_G') + ' : (2 · sin α)'), g: 'α = Winkel zur Waagrechten, kleines α gibt grosse F₁' },
    { name: 'Sinussatz', f: eq(f('F₁') + ' = ' + f('F_G') + ' · sin β₂ : sin(β₁ + β₂)'), g: 'Jede Kraft ist proportional zum Sinus des gegenüberliegenden Winkels' },
  ],
  karten: [
    { id: 'rechtwinklig', title: 'Rechtwinklig zerlegen', ziel: 'Du zerlegst eine schräge Kraft in zwei rechtwinklige Teilkräfte mit sin, cos und Pythagoras.' },
    { id: 'symmetrisch', title: 'Zwei gleiche Teilkräfte', ziel: 'Du berechnest die Kräfte in zwei symmetrischen Schenkeln, Seilen oder Flächen.', hilfreich: ['rechtwinklig'] },
    { id: 'flach', title: 'Kleine Winkel, grosse Kräfte', ziel: 'Du erkennst, warum flache Seile und Kniehebel riesige Kräfte erzeugen.', hilfreich: ['symmetrisch'] },
    { id: 'streben', title: 'Streben, Seile und Keile', ziel: 'Du machst Bauteile frei und findest Zug- und Druckkräfte aus dem Kräftedreieck.', hilfreich: ['rechtwinklig'] },
    { id: 'ungleich', title: 'Ungleiche Seile und räumlich', ziel: 'Du zerlegst mit dem Sinussatz und in drei Dimensionen.', hilfreich: ['streben', 'symmetrisch'] },
  ],
  aufgaben: AUFGABEN,
};
