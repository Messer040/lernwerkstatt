import type { Kapitel } from '../../../core/types';
import { eq, f, l } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const einfacheMaschinen: Kapitel = {
  id: 'maschinen',
  title: 'Einfache Maschinen, Flaschenzüge',
  kurz: 'Goldene Regel, Rollen, Flaschenzug, schiefe Ebene, Keil, Schraube',
  formeln: [
    { name: 'Goldene Regel', f: eq(f('F') + ' · ' + l('s') + ' = ' + f('F_G') + ' · ' + l('h')), g: 'Was man an Kraft spart, zahlt man an Weg. Die Arbeit bleibt gleich (ohne Reibung)' },
    { name: 'Feste Rolle', f: eq(f('F') + ' = ' + f('F_G') + ' · ' + l('s') + ' = ' + l('h')), g: 'ändert nur die Richtung der Kraft' },
    { name: 'Lose Rolle, Flaschenzug', f: eq(f('F') + ' = ' + f('F_G') + ' : n · ' + l('s') + ' = n · ' + l('h')), g: 'n = Zahl der tragenden Seile (ohne Zugseil)' },
    { name: 'Mit Wirkungsgrad', f: eq(f('F') + ' = ' + f('F_G') + ' : (n · η)'), g: 'Mit Reibung braucht es mehr Kraft. η kleiner als 1' },
    { name: 'Schiefe Ebene', f: eq(f('F') + ' = ' + f('F_G') + ' · ' + l('h') + ' : ' + l('s')), g: 'h = Höhe, s = Länge der Schräge, ohne Reibung' },
    { name: 'Zerlegung auf der Schräge', f: eq(f('F_H') + ' = ' + f('F_G') + ' · sin α · ' + f('F_N') + ' = ' + f('F_G') + ' · cos α'), g: 'F_H = Hangabtriebskraft, F_N = Normalkraft' },
    { name: 'Keil', f: eq(l('s_2') + ' = ' + l('s_1') + ' · tan α · ' + f('F_2') + ' = ' + f('F_1') + ' : tan α'), g: 'α = Keilwinkel zur Kraftrichtung, ohne Reibung' },
    { name: 'Schraube, Spindel', f: eq(f('F_1') + ' · π · d = ' + f('F_2') + ' · ' + l('P')), g: 'd = Kreisdurchmesser der Hand in mm, P = Steigung in mm. Mit Reibung: mal η' },
  ],
  karten: [
    { id: 'rollen', title: 'Rollen und Flaschenzüge', ziel: 'Du zählst die tragenden Seile, rechnest F = F_G : n und s = n · h und erklärst, warum die Arbeit gleich bleibt.' },
    { id: 'ebene', title: 'Schiefe Ebene', ziel: 'Du rechnest F = F_G · h : s, zerlegst F_G in F_H und F_N und berücksichtigst die Reibung.', hilfreich: ['rollen'] },
    { id: 'keil', title: 'Keil', ziel: 'Du rechnest s_2 = s_1 · tan α und F_2 = F_1 : tan α und rechnest Verluste mit η.', hilfreich: ['ebene'] },
    { id: 'schraube', title: 'Schraube und Spindel', ziel: 'Du rechnest F_1 · π · d = F_2 · P, setzt Durchmesser und Hände richtig ein und rechnest mit dem Wirkungsgrad.', hilfreich: ['ebene'] },
  ],
  aufgaben: AUFGABEN,
};
