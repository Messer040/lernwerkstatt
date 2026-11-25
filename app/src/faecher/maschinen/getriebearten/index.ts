import type { Kapitel } from '../../../core/types';
import { AUFGABEN } from './aufgaben';

export const getriebearten: Kapitel = {
  id: 'getriebe',
  title: 'Getriebearten',
  kurz: 'Zahnradgetriebe erkennen, Lage der Wellen',
  formeln: [
    { name: 'Stirnradgetriebe', f: 'Wellen liegen parallel', g: 'Gerade oder schräg verzahnte Stirnräder' },
    { name: 'Kegelradgetriebe', f: 'Wellen schneiden sich', g: 'Achsen treffen sich im Punkt S, meist unter 90°' },
    { name: 'Schraubenradgetriebe', f: 'Wellen kreuzen sich', g: 'Zwei schrägverzahnte Räder, verschiedene Ebenen, kleine Kräfte' },
    { name: 'Schneckengetriebe', f: 'Wellen kreuzen sich', g: 'Schnecke und Schneckenrad, grosse Übersetzung in einer Stufe, kann selbsthemmend sein' },
    { name: 'Merkhilfe', f: 'gleiche Ebene: parallel oder schneiden · verschiedene Ebenen: kreuzen', g: '' },
  ],
  karten: [
    { id: 'arten', title: 'Getriebe erkennen', ziel: 'Du benennst Stirnrad-, Kegelrad-, Schraubenrad- und Schneckengetriebe am Bild.' },
    { id: 'lage', title: 'Lage der Wellen', ziel: 'Du sagst, ob die Wellen parallel liegen, sich schneiden oder sich kreuzen.', hilfreich: ['arten'] },
    { id: 'wahl', title: 'Getriebe auswählen', ziel: 'Du wählst das passende Getriebe für eine Aufgabe und findest Fehler in einer Zuordnung.', hilfreich: ['lage'] },
  ],
  aufgaben: AUFGABEN,
};
