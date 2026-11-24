// Alle Fächer. Ein neues Fach = ein neuer Ordner + ein Eintrag hier.
import type { Fach } from '../core/types';
import { drehmoment } from './physik/drehmoment';
import { kraefteAddieren } from './physik/kraefte-addieren';
import { kraefteZerlegen } from './physik/kraefte-zerlegen';
import { anDerWand } from './physik/an-der-wand';
import { lagerkraefte } from './physik/lagerkraefte';
import { kettenaufgaben } from './physik/kettenaufgaben';
import { umfangskraft } from './physik/umfangskraft';
import { reibung } from './physik/reibung';

export const FAECHER: Fach[] = [
  {
    id: 'physik',
    title: 'Physik',
    kurz: 'Kräfte, Momente, Lager, Reibung, Arbeit',
    kapitel: [kraefteAddieren, kraefteZerlegen, drehmoment, anDerWand, lagerkraefte, kettenaufgaben, umfangskraft, reibung],
    geplant: ['Arbeit, Energie', 'Leistung, Wirkungsgrad', 'Einfache Maschinen, Flaschenzüge', 'Beschleunigungs- und Gewichtskraft', 'Bewegungen', 'Biegen: Zuschnitt'],
  },
];

export const findeFach = (id: string) => FAECHER.find((f) => f.id === id);
export const findeKapitel = (fach: string, kap: string) => findeFach(fach)?.kapitel.find((k) => k.id === kap);
