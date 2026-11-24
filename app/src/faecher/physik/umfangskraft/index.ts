import type { Kapitel } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const umfangskraft: Kapitel = {
  id: 'umfang',
  title: 'Umfangskraft',
  kurz: 'Kraft am Rad, Zahnräder, Riemen, Übersetzung',
  formeln: [
    { name: 'Drehmoment am Rad', f: eq(m('M') + ' = ' + f('F_u') + ' · ' + l('d : 2')), g: 'M in Nm, F_u in N, d in m. Der Hebelarm ist der Radius' },
    { name: 'Umfangskraft', f: eq(f('F_u') + ' = 2 · ' + m('M') + ' : ' + l('d')), g: 'umgestellt. Mit M in Nmm und d in mm kommt F_u in N heraus' },
    { name: 'Zahnradgrösse', f: eq(l('d') + ' = m · z'), g: 'd = Teilkreisdurchmesser in mm, m = Modul in mm, z = Zähnezahl' },
    { name: 'Übersetzung', f: eq('i = z_2 : z_1 = ' + l('d_2') + ' : ' + l('d_1') + ' = n_1 : n_2'), g: 'Rad 1 treibt, Rad 2 wird getrieben' },
    { name: 'Drehmoment im Getriebe', f: eq(m('M_2') + ' = i · ' + m('M_1')), g: 'ohne Wirkungsgrad. Mehr Drehmoment heisst weniger Drehzahl' },
    { name: 'Drehzahl im Getriebe', f: eq('n_2 = n_1 : i'), g: 'Drehzahlen verhalten sich umgekehrt wie die Zähnezahlen' },
    { name: 'Zwei Stufen', f: eq('i = i_1 · i_2'), g: 'Schnecke: z_1 = Anzahl der Gänge' },
    { name: 'Gleiche Umfangskraft', f: eq(f('F_u') + ' am Rad 1 = ' + f('F_u') + ' am Rad 2'), g: 'am Zahneingriff und im Riemen' },
    { name: 'Gleiches Drehmoment', f: eq(m('M') + ' Trommel = ' + m('M') + ' Zahnrad'), g: 'zwei Teile auf derselben Welle' },
    { name: 'Umfangsgeschwindigkeit', f: eq('v = π · d · n'), g: 'd in m, n in 1/min gibt v in m/min' },
  ],
  karten: [
    { id: 'umfang', title: 'Umfangskraft am Rad', ziel: 'Du rechnest M = F_u · d : 2 und stellst nach F_u, M oder d um. Der Hebelarm ist der Radius.' },
    { id: 'getriebe', title: 'Zahnräder und Übersetzung', ziel: 'Du rechnest Umfangskraft, Drehmoment und Drehzahl an einem Radpaar mit i = z₂ : z₁.', hilfreich: ['umfang'] },
    { id: 'mehrstufig', title: 'Mehrere Stufen und Wellen', ziel: 'Du folgst dem Drehmoment durch mehrere Räder, Wellen und Lager bis zur Last.', hilfreich: ['getriebe'] },
    { id: 'pruefen', title: 'Fehler und Plausibilität', ziel: 'Du erkennst die typischen Fehler (d statt d : 2, i verkehrt) und prüfst, ob ein Resultat sinnvoll ist.', hilfreich: ['getriebe'] },
  ],
  aufgaben: AUFGABEN,
};
