import type { Kapitel } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const umfangskraft: Kapitel = {
  id: 'umfang',
  title: 'Umfangskraft',
  kurz: 'Kraft am Umfang, Zahnräder, Riemen, Übersetzung',
  formeln: [
    { name: 'Drehmoment am Rad', f: eq(m('M') + ' = ' + f('F_u') + ' · ' + l('d') + ' : 2'), g: 'M in Nm, F_u in N, d in m. Hebelarm ist der Radius' },
    { name: 'Umfangskraft', f: eq(f('F_u') + ' = 2 · ' + m('M') + ' : ' + l('d')), g: 'Mit M in N·mm und d in mm kommt F_u in N heraus' },
    { name: 'Zahnrad-Durchmesser', f: eq(l('d') + ' = m · z'), g: 'Modul m in mm, Zähnezahl z' },
    { name: 'Übersetzung', f: eq('i = z₂ : z₁ = ' + l('d₂') + ' : ' + l('d₁') + ' = n₁ : n₂'), g: 'z₁ = treibendes Rad, z₂ = getriebenes Rad' },
    { name: 'Drehmomente im Getriebe', f: eq(m('M₂') + ' = i · ' + m('M₁')), g: 'Ohne Wirkungsgrad. Langsam heisst stark' },
    { name: 'Zweistufiges Getriebe', f: eq('i = i₁ · i₂'), g: 'Die Übersetzungen der Stufen werden multipliziert' },
  ],
  karten: [
    { id: 'rad', title: 'Umfangskraft am Rad', ziel: 'Du rechnest zwischen Drehmoment, Durchmesser und Umfangskraft und nimmst den Radius als Hebelarm.' },
    { id: 'paar', title: 'Zahnradpaar und Übersetzung', ziel: 'Du erkennst, dass am Zahneingriff die Umfangskraft gleich ist, und rechnest Drehmoment und Drehzahl mit i.', hilfreich: ['rad'] },
    { id: 'welle', title: 'Mehrere Räder auf einer Welle', ziel: 'Du verfolgst das Drehmoment über Trommel, Zahnrad und Kurbel und rechnest bis zu den Lagerkräften.', hilfreich: ['paar'] },
    { id: 'antrieb', title: 'Antriebsstränge', ziel: 'Du gehst Schritt für Schritt von Motor oder Pedal bis zum Rad und kontrollierst jeden Zwischenwert.', hilfreich: ['welle'] },
  ],
  aufgaben: AUFGABEN,
};
