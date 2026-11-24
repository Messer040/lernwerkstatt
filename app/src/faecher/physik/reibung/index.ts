import type { Kapitel } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const reibung: Kapitel = {
  id: 'reibung',
  title: 'Reibung',
  kurz: 'Haftreibung, Gleitreibung, Rollreibung, Schräge, Reibmoment',
  formeln: [
    { name: 'Reibungskraft', f: eq(f('F_R') + ' = μ · ' + f('F_N')), g: 'F_R in N, μ ohne Einheit, F_N = Normalkraft in N' },
    { name: 'Normalkraft, waagrecht', f: eq(f('F_N') + ' = ' + f('F_G') + ' = m · g'), g: 'm in kg, g = 9,81 m/s²' },
    { name: 'Normalkraft, schiefe Ebene', f: eq(f('F_N') + ' = ' + f('F_G') + ' · cos α'), g: 'α = Neigungswinkel der Ebene' },
    { name: 'Hangabtriebskraft', f: eq(f('F_H') + ' = ' + f('F_G') + ' · sin α'), g: 'zieht den Körper die Schräge hinunter' },
    { name: 'Haften oder Gleiten', f: eq('μ₀ > μ'), g: 'μ₀ = Haftreibungszahl (Losreissen), μ = Gleitreibungszahl (Bewegung)' },
    { name: 'Grenzwinkel', f: eq('tan α = μ₀'), g: 'Ab diesem Winkel beginnt der Körper zu rutschen' },
    { name: 'Rollreibung', f: eq(f('F_R') + ' = f · ' + f('F_N') + ' : ' + l('r')), g: 'f = Rollreibungszahl in mm, r = Radius in mm' },
    { name: 'Reibmoment', f: eq(m('M_R') + ' = ' + f('F_R') + ' · ' + l('d : 2')), g: 'M_R in Nm, d in m. Bei n Reibflächen: mal n' },
  ],
  karten: [
    { id: 'gleiten', title: 'Haft- und Gleitreibung', ziel: 'Du rechnest F_R = μ · F_N, erkennst, wann μ₀ und wann μ gilt, und zählst die Reibflächen.' },
    { id: 'schraege', title: 'Reibung auf der Schräge', ziel: 'Du zerlegst F_G in F_H und F_N und rechnest damit Reibung, Grenzwinkel und Sicherheit.', hilfreich: ['gleiten'] },
    { id: 'moment', title: 'Reibung an Dreh- und Gleitteilen', ziel: 'Du rechnest Reibmoment an Kupplung, Bremse und Gleitlager mit Radius und Anzahl Reibflächen.', hilfreich: ['gleiten'] },
    { id: 'rollen', title: 'Rollreibung und Wälzführungen', ziel: 'Du rechnest F_R = f · F_N : r und vergleichst Rollen mit Gleiten.', hilfreich: ['gleiten'] },
  ],
  aufgaben: AUFGABEN,
};
