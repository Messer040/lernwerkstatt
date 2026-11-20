import type { Kapitel } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const anDerWand: Kapitel = {
  id: 'wand',
  title: 'An der Wand',
  kurz: 'Haken, Konsolen, Türen, Leitern: Kräfte an der Wand',
  formeln: [
    { name: 'Momentengleichgewicht', f: eq('Σ ' + m('M') + ' = 0'), g: 'Drehpunkt in Gelenk, Kippkante oder Fusspunkt legen' },
    { name: 'Kräftegleichgewicht', f: eq('Σ ' + f('F_waagrecht') + ' = 0,  Σ ' + f('F_senkrecht') + ' = 0'), g: 'F in N, jede Richtung einzeln' },
    { name: 'Schräger Zug an der Wand', f: eq(f('F_A') + ' = F · sin α,  ' + f('F_Q') + ' = F · cos α'), g: 'α = Winkel zwischen Seil und Wand' },
    { name: 'Kippen um eine Kante', f: eq(f('F_S') + ' = ' + f('F') + ' · ' + l('a') + ' : ' + l('h')), g: 'a = Hebelarm der Last, h = Hebelarm der Schrauben' },
    { name: 'Zugstab und Druckstrebe', f: eq(f('F_Z') + ' = F · b : h,  ' + f('F_D') + ' = F · √(b² + h²) : h'), g: 'b = Ausladung, h = Abstand der Wandgelenke' },
    { name: 'Leiter an glatter Wand', f: eq('μ ≥ ' + f('F_R') + ' : ' + f('F_N')), g: 'F_R = F_W, F_N = Gewicht von Person und Leiter' },
  ],
  karten: [
    { id: 'haken', title: 'Schräger Zug am Haken', ziel: 'Du zerlegst einen schrägen Zug in Auszugskraft und Querkraft an der Wand.' },
    { id: 'strebe', title: 'Konsole, Strebe und Seil', ziel: 'Du findest Zug- und Druckkräfte in Stäben und Seilen, die ein Teil an der Wand halten.', hilfreich: ['haken'] },
    { id: 'kippen', title: 'Kippen um eine Kante', ziel: 'Du legst den Drehpunkt in die Kippkante oder ein Scharnier und berechnest Schrauben- und Scharnierkräfte.' },
    { id: 'leiter', title: 'Leiter an glatter Wand', ziel: 'Du berechnest Wandkraft, Bodenkraft und die nötige Reibungszahl.', hilfreich: ['kippen'] },
  ],
  aufgaben: AUFGABEN,
};
