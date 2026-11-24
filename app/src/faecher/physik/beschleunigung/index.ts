import type { Kapitel } from '../../../core/types';
import { eq, f, v as w } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const beschleunigungGewichtskraft: Kapitel = {
  id: 'beschleunigung',
  title: 'Beschleunigungs- und Gewichtskraft',
  kurz: 'F = m · a, F_G = m · g, v-t-Diagramm, Aufzug und Ladung',
  formeln: [
    { name: 'Beschleunigungskraft', f: eq(f('F') + ' = m · ' + w('a')), g: 'F in N, m in kg, a in m/s². 1 N = 1 kg · m/s²' },
    { name: 'Beschleunigung', f: eq(w('a') + ' = Δv : Δt'), g: 'Δv in m/s, Δt in s. Im v-t-Diagramm ist a die Steigung der Linie' },
    { name: 'Gewichtskraft', f: eq(f('F_G') + ' = m · g'), g: 'g = 9,81 m/s² auf der Erde, 1,62 m/s² auf dem Mond. m in kg' },
    { name: 'Seilkraft beim Anheben', f: eq(f('F_S') + ' = m · (g + a)'), g: 'a nach oben: das Seil trägt mehr. a nach unten: F_S = m · (g − a)' },
    { name: 'Haltekraft der Ladung', f: eq(f('F_Gurt') + ' = m · a − μ_0 · m · g'), g: 'Ladung beim Bremsen. Die Gurte halten, was die Haftreibung nicht schafft' },
    { name: 'Umrechnen', f: eq('km/h : 3,6 = m/s'), g: '1 t = 1000 kg, 1 kN = 1000 N, g (Gramm) : 1000 = kg' },
  ],
  karten: [
    { id: 'kraftgesetz', title: 'Beschleunigungskraft F = m · a', ziel: 'Du rechnest F = m · a, stellst nach m und a um und rechnest t, g und km/h richtig in kg und m/s um.' },
    { id: 'gewicht', title: 'Gewichtskraft und Masse', ziel: 'Du unterscheidest die Masse in kg von der Gewichtskraft in N und rechnest F_G = m · g auf Erde und Mond.', hilfreich: ['kraftgesetz'] },
    { id: 'vt', title: 'Bewegung im v-t-Diagramm', ziel: 'Du liest die Beschleunigung als Steigung im v-t-Diagramm ab und rechnest daraus die Kraft.', hilfreich: ['kraftgesetz'] },
    { id: 'kombi', title: 'Gewichtskraft und Beschleunigung zusammen', ziel: 'Du setzt F_G und F_a zusammen: Seilkraft beim Aufzug und Haltekraft der Ladung beim Bremsen.', hilfreich: ['kraftgesetz', 'gewicht'] },
  ],
  aufgaben: AUFGABEN,
};
