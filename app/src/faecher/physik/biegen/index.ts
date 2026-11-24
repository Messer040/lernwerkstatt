import type { Kapitel } from '../../../core/types';
import { eq, f, l } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const biegen: Kapitel = {
  id: 'biegen',
  title: 'Biegen: Zuschnitt',
  kurz: 'Gestreckte Länge, Ausgleichswert v, Profile, Rückfederung',
  formeln: [
    { name: 'Gestreckte Länge', f: eq(l('L') + ' = ' + l('a') + ' + ' + l('b') + ' − v'), g: 'a, b = Aussenmasse in mm, v = Ausgleichswert je Biegestelle in mm. Bei n Biegestellen: L = Summe der Schenkel − n · v' },
    { name: 'Korrekturfaktor', f: eq('k = 0,65 + 0,5 · lg(r : s)'), g: 'r = Innenradius in mm, s = Blechdicke in mm, k höchstens 1' },
    { name: 'Ausgleichswert bis 90°', f: eq('v = 2 · (r + s) − π · (180° − β) : 180° · (r + s/2 · k)'), g: 'β = Öffnungswinkel zwischen den Schenkeln. Bei β = 90° ist (180° − β) : 180° = 1/2' },
    { name: 'Ausgleichswert über 90°', f: eq('v = 2 · (r + s) · tan((180° − β) : 2) − π · (180° − β) : 180° · (r + s/2 · k)'), g: 'Gilt von β = 90° bis 165°. Ab 165° ist v ≈ 0' },
    { name: 'Faustregel', f: eq('v ≈ 2 · s'), g: 'Nur bei β = 90° und r ≈ s. ' + f('Warnung:') + ' Bei grösserem Radius ist v grösser. Die Faustregel gibt dann einen zu langen Zuschnitt' },
    { name: 'Rückfederung', f: eq('α_1 = α_2 : k_R,   r_1 = k_R · (r_2 + 0,5 · s) − 0,5 · s'), g: 'α_1, r_1 = am Werkzeug, α_2, r_2 = am Werkstück, k_R = Rückfederungsfaktor (kleiner als 1)' },
    { name: 'Masse des Zuschnitts', f: eq('m = ρ · V,   V = L · Breite · s'), g: 'ρ in g/cm³ (Stahl 7,85), V in cm³. mm³ : 1000 = cm³' },
  ],
  karten: [
    { id: 'grund', title: 'Gestreckte Länge bei 90°', ziel: 'Du rechnest L = a + b − v mit dem Tabellenwert und kennst die Faustregel v ≈ 2 · s.' },
    { id: 'formel', title: 'Ausgleichswert v berechnen', ziel: 'Du rechnest k und v mit der Formel, auch bei Winkeln über 90°.', hilfreich: ['grund'] },
    { id: 'profile', title: 'Profile mit mehreren Biegestellen', ziel: 'Du zählst die Biegestellen und ziehst für jede ein v ab. Du rechnest damit auch die Masse des Zuschnitts.', hilfreich: ['grund'] },
    { id: 'rueck', title: 'Rückfederung', ziel: 'Du stellst Werkzeugwinkel und Werkzeugradius so ein, dass das Werkstück nach dem Zurückfedern passt.', hilfreich: ['grund'] },
  ],
  aufgaben: AUFGABEN,
};
