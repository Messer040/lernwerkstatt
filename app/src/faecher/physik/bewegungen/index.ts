import type { Kapitel } from '../../../core/types';
import { eq, f, l, v as w } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const bewegungen: Kapitel = {
  id: 'bewegungen',
  title: 'Bewegungen',
  kurz: 'v = s : t, Vorschub, Umfangsgeschwindigkeit, zwei Bewegungen zusammen',
  formeln: [
    { name: 'Geschwindigkeit', f: eq(w('v') + ' = ' + l('s') + ' : t'), g: 's in m, t in s, v in m/s. Umgestellt: s = v · t und t = s : v' },
    { name: 'Vorschubgeschwindigkeit (Drehen, Bohren)', f: eq(w('v_f') + ' = f · n'), g: 'f = Vorschub je Umdrehung in mm, n in 1/min, v_f in mm/min' },
    { name: 'Vorschubgeschwindigkeit (Fräsen)', f: eq(w('v_f') + ' = z · f_z · n'), g: 'z = Zähnezahl, f_z = Vorschub je Schneide in mm' },
    { name: 'Umfangsgeschwindigkeit', f: eq(w('v') + ' = π · ' + l('d') + ' · n'), g: 'd in m, n in 1/min, v in m/min. Umgestellt: n = v : (π · d) und d = v : (π · n)' },
    { name: 'Zwei Bewegungen im rechten Winkel', f: eq(w('v') + ' = √(v_1² + v_2²)'), g: 'Winkel: tan α = v_H : v_W. Wie beim Zusammensetzen von Kräften' },
    { name: 'Umrechnen', f: eq('m/min : 60 = m/s'), g: 'mm : 1000 = m, s : 60 = min, km/h : 3,6 = m/s. ' + f('Warnung:') + ' Einheiten zuerst angleichen, sonst ist das Resultat 60- oder 1000-mal falsch' },
  ],
  karten: [
    { id: 'gerade', title: 'Geradlinige Bewegung v = s : t', ziel: 'Du rechnest Weg, Zeit und Geschwindigkeit und gleichst m/s, m/min und km/h richtig an.' },
    { id: 'vorschub', title: 'Vorschub beim Drehen, Bohren und Fräsen', ziel: 'Du rechnest v_f = f · n und v_f = z · f_z · n und bestimmst daraus Zeiten und Drehzahlen.', hilfreich: ['gerade'] },
    { id: 'umfang', title: 'Umfangsgeschwindigkeit v = π · d · n', ziel: 'Du rechnest die Geschwindigkeit am Umfang einer drehenden Scheibe, eines Rads oder Werkzeugs.', hilfreich: ['gerade'] },
    { id: 'drehzahl', title: 'Drehzahl und Durchmesser bestimmen', ziel: 'Du stellst die Formel nach n oder d um und kennst die Höchstdrehzahl einer Schleifscheibe.', hilfreich: ['umfang'] },
    { id: 'zusammen', title: 'Zwei Bewegungen zusammen', ziel: 'Du setzt zwei Geschwindigkeiten im rechten Winkel zusammen: Kran und Boot im Fluss.', hilfreich: ['gerade'] },
  ],
  aufgaben: AUFGABEN,
};
