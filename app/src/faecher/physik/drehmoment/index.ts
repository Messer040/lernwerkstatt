import type { Kapitel } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const drehmoment: Kapitel = {
  id: 'dreh',
  title: 'Drehmoment, Hebelgesetz',
  kurz: 'Kraft mal Hebelarm, Gleichgewicht am Hebel',
  formeln: [
    { name: 'Drehmoment', f: eq(m('M') + ' = ' + f('F') + ' · ' + l('l')), g: 'M in Nm, F in N, l in m' },
    { name: 'Hebelgesetz', f: eq('Σ ' + m('M links') + ' = Σ ' + m('M rechts')), g: 'Gleichgewicht: Momente heben sich auf' },
    { name: 'Zwei Kräfte', f: eq(f('F₁') + ' · ' + l('l₁') + ' = ' + f('F₂') + ' · ' + l('l₂')), g: 'l immer vom Drehpunkt aus messen' },
    { name: 'Schräge Kraft', f: eq(l('l') + ' = L · sin α'), g: 'l = senkrechter Abstand zur Wirkungslinie' },
  ],
  karten: [
    { id: 'moment', title: 'Drehmoment berechnen', ziel: 'Du berechnest M = F · l und stellst die Formel um.' },
    { id: 'gleichgewicht', title: 'Gleichgewicht am Hebel', ziel: 'Du setzt linksdrehende und rechtsdrehende Momente gleich.', hilfreich: ['moment'] },
    { id: 'einseitig', title: 'Hebel im Alltag', ziel: 'Du erkennst Drehpunkt und Hebelarme an echten Bauteilen.', hilfreich: ['gleichgewicht'] },
    { id: 'kombi', title: 'Kombiniert', ziel: 'Du verbindest Hebelgesetz mit Druck, Fläche oder Gewicht.', hilfreich: ['einseitig'] },
  ],
  aufgaben: AUFGABEN,
};
