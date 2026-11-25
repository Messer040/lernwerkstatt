import type { Kapitel } from '../../../core/types';
import { eq, l, m, v } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

// Stirnräder: Übersetzung, Drehsinn, mehrstufige Getriebe, Drehmoment.
export const uebersetzung: Kapitel = {
  id: 'uebersetzung',
  title: 'Zahnräder: Übersetzung und Getriebe',
  kurz: 'i = z_2 : z_1 = n_1 : n_2, Zwischenrad, mehrstufig, Drehmoment',
  formeln: [
    { name: 'Übersetzung', f: eq('i = z_2 : z_1 = ' + v('n_1 : n_2') + ' = ' + l('d_2 : d_1')), g: 'Index 1 = treibendes Rad, Index 2 = getriebenes Rad. i hat keine Einheit' },
    { name: 'Drehzahl am Abtrieb', f: eq(v('n_2') + ' = ' + v('n_1') + ' : i = ' + v('n_1') + ' · z_1 : z_2'), g: 'n in 1/min' },
    { name: 'Ins Langsame, ins Schnelle', f: eq('i > 1: ' + v('n_2') + ' < ' + v('n_1') + '   ·   i < 1: ' + v('n_2') + ' > ' + v('n_1')), g: 'Das grössere Rad dreht immer langsamer' },
    { name: 'Umfangsgeschwindigkeit', f: eq(v('v') + ' = π · ' + l('d_1') + ' · ' + v('n_1') + ' = π · ' + l('d_2') + ' · ' + v('n_2')), g: 'Beide Teilkreise haben dasselbe v. d in m, n in 1/min gibt m/min' },
    { name: 'Zwischenrad', f: eq('i = (z_Z : z_1) · (z_3 : z_Z) = z_3 : z_1'), g: 'Ändert den Drehsinn, nicht die Übersetzung' },
    { name: 'Mehrstufig', f: eq('i_ges = i_1 · i_2 · i_3 …') + ' · ' + eq('η_ges = η_1 · η_2 · …'), g: 'Stufen werden multipliziert, nie addiert' },
    { name: 'Drehmoment', f: eq(m('M_2') + ' = ' + m('M_1') + ' · i · η'), g: 'M in Nm, η = Wirkungsgrad (0 bis 1)' },
    { name: 'Leistung', f: eq('P = ' + m('M') + ' · ω = ' + m('M') + ' · 2 · π · ' + v('n') + ' : 60'), g: 'P in W, n in 1/min. P_2 = P_1 · η' },
  ],
  karten: [
    { id: 'einstufig', title: 'Ein Radpaar', ziel: 'Du rechnest i, n_2 und z_2 und weisst, ob es ins Langsame oder ins Schnelle geht.' },
    { id: 'drehsinn', title: 'Drehsinn und Zwischenrad', ziel: 'Du bestimmst den Drehsinn jedes Rades und weisst, dass ein Zwischenrad die Übersetzung nicht ändert.', hilfreich: ['einstufig'] },
    { id: 'mehrstufig', title: 'Mehrstufige Getriebe', ziel: 'Du multiplizierst die Stufen zu i_ges und legst eine fehlende Stufe aus.', hilfreich: ['einstufig'] },
    { id: 'moment', title: 'Drehmoment und Wirkungsgrad', ziel: 'Du rechnest M_2 = M_1 · i · η, auch rückwärts, und weisst, dass ein Getriebe keine Leistung gewinnt.', hilfreich: ['mehrstufig'] },
  ],
  aufgaben: AUFGABEN,
};
