// Alle Fächer. Ein neues Fach = ein neuer Ordner + ein Eintrag hier.
import type { Fach } from '../core/types';
import { drehmoment } from './physik/drehmoment';

export const FAECHER: Fach[] = [
  {
    id: 'physik',
    title: 'Physik',
    kurz: 'Kräfte, Momente, Lager, Reibung, Arbeit',
    kapitel: [drehmoment],
    geplant: ['Kräfte addieren', 'Kräfte zerlegen', 'An der Wand', 'Lagerkräfte', 'Kettenaufgaben', 'Umfangskraft', 'Reibung', 'Arbeit, Energie', 'Leistung, Wirkungsgrad', 'Einfache Maschinen, Flaschenzüge', 'Beschleunigungs- und Gewichtskraft', 'Bewegungen', 'Biegen: Zuschnitt'],
  },
];

export const findeFach = (id: string) => FAECHER.find((f) => f.id === id);
export const findeKapitel = (fach: string, kap: string) => findeFach(fach)?.kapitel.find((k) => k.id === kap);
