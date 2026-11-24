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
import { arbeitEnergie } from './physik/arbeit-energie';
import { leistungWirkungsgrad } from './physik/leistung-wirkungsgrad';
import { einfacheMaschinen } from './physik/einfache-maschinen';
import { beschleunigungGewichtskraft } from './physik/beschleunigung';
import { bewegungen } from './physik/bewegungen';
import { masche } from './elektro/masche';
import { reihenschaltung } from './elektro/reihenschaltung';

export const FAECHER: Fach[] = [
  {
    id: 'physik',
    title: 'Physik',
    kurz: 'Kräfte, Momente, Lager, Reibung, Arbeit',
    kapitel: [kraefteAddieren, kraefteZerlegen, drehmoment, anDerWand, lagerkraefte, kettenaufgaben, umfangskraft, reibung, arbeitEnergie, leistungWirkungsgrad, einfacheMaschinen, beschleunigungGewichtskraft, bewegungen],
    geplant: ['Biegen: Zuschnitt'],
  },
  {
    id: 'elektro',
    title: 'Elektrotechnik',
    kurz: 'Masche, Reihenschaltung, Spannungsquellen',
    kapitel: [reihenschaltung, masche],
    geplant: ['Parallelschaltung', 'Gemischte Schaltungen', 'Elektrische Leistung'],
  },
];

export const findeFach = (id: string) => FAECHER.find((f) => f.id === id);
export const findeKapitel = (fach: string, kap: string) => findeFach(fach)?.kapitel.find((k) => k.id === kap);
