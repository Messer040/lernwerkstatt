import type { Kapitel } from '../../../core/types';
import { eq, l } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

// Formeln wie in der Tabelle aus dem Unterricht (Kopfspiel c = 0,25 · m).
export const zahnrad: Kapitel = {
  id: 'zahnrad',
  title: 'Zahnräder: Masse berechnen',
  kurz: 'Modul, Teilung, Kopf- und Fusskreis, Achsabstand',
  formeln: [
    { name: 'Zahnteilung', f: eq(l('p') + ' = π · m'), g: 'p = Teilung in mm, m = Modul in mm' },
    { name: 'Modul', f: eq('m = ' + l('p') + ' : π = ' + l('d') + ' : z'), g: 'z = Zähnezahl. Der Modul ist genormt (Modulreihe)' },
    { name: 'Kopfhöhe', f: eq(l('h_a') + ' = 1 · m'), g: 'vom Teilkreis bis zum Zahnkopf' },
    { name: 'Fusshöhe', f: eq(l('h_f') + ' = m + c = 1,25 · m'), g: 'vom Teilkreis bis zum Zahnfuss' },
    { name: 'Zahnhöhe', f: eq(l('h') + ' = h_a + h_f = 2 · m + c = 2,25 · m'), g: '' },
    { name: 'Teilkreisdurchmesser', f: eq(l('d') + ' = m · z'), g: 'd in mm' },
    { name: 'Kopfkreisdurchmesser', f: eq(l('d_a') + ' = d + 2 · h_a = d + 2 · m = m · (z + 2)'), g: 'aussen, mit dem Messschieber messbar' },
    { name: 'Kopfspiel', f: eq(l('c') + ' = h_f − h_a = 1,25 · m − 1 · m = 0,25 · m'), g: 'Luft zwischen Zahnkopf und Zahnfuss des Gegenrades' },
    { name: 'Fusskreisdurchmesser', f: eq(l('d_f') + ' = d − 2 · h_f = d − 2 · 1,25 · m = m · (z − 2,5)'), g: '' },
    { name: 'Achsabstand', f: eq(l('a') + ' = (d_1 + d_2) : 2 = m · (z_1 + z_2) : 2'), g: 'Räder im Eingriff haben denselben Modul' },
  ],
  karten: [
    { id: 'grund', title: 'Modul, Teilkreis, Teilung', ziel: 'Du rechnest mit d = m · z und p = π · m und stellst nach m oder z um.' },
    { id: 'kreise', title: 'Kopfkreis, Fusskreis, Zahnhöhe', ziel: 'Du rechnest h_a, h_f, h, c, d_a und d_f und bestimmst den Modul aus einem gemessenen Kopfkreis.', hilfreich: ['grund'] },
    { id: 'paar', title: 'Radpaar und Achsabstand', ziel: 'Du rechnest den Achsabstand und stellst nach einer Zähnezahl um.', hilfreich: ['grund'] },
    { id: 'pruefen', title: 'Fehler und Plausibilität', ziel: 'Du erkennst vergessenes Kopfspiel, verwechselte Kreise und Masse, die nicht zusammenpassen.', hilfreich: ['kreise'] },
  ],
  aufgaben: AUFGABEN,
};
