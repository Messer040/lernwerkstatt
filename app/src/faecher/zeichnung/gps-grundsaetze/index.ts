import type { Kapitel } from '../../../core/types';
import { AUFGABEN } from './aufgaben';

export const gpsGrundsaetze: Kapitel = {
  id: 'gps',
  title: 'GPS-Grundsätze und Grössenmass',
  kurz: 'Grundsätze der ISO-GPS-Tolerierung, Grössenmassmerkmale',
  formeln: [
    { name: 'Aufrufen', f: 'Ein Teilbereich aufgerufen = ganzes GPS-Regelwerk gilt', g: 'Eindeutig im Vertrag: Hinweis «Tolerierung ISO 8015»' },
    { name: 'Normenhierarchie', f: 'fundamental → allgemein → komplementär', g: 'Regeln von oben gelten unten mit, ausser unten steht etwas anderes' },
    { name: 'Bestimmende Zeichnung', f: 'Was nicht in der Zeichnung steht, gilt nicht', g: 'Bei Klassifizierungscode 3 ist der Datensatz das Original' },
    { name: 'Geometrieelement', f: 'Eine Spezifikation = ein Element, ganz', g: '' },
    { name: 'Unabhängigkeit', f: 'Mass, Form, Richtung und Ort sind getrennt zu erfüllen', g: 'Abhängigkeit nur durch Norm oder Angabe, z. B. Hüllbedingung E' },
    { name: 'Dezimaldarstellung', f: '50 = 50,000…', g: 'Nicht angegebene Stellen sind Nullen' },
    { name: 'Standardfestlegung', f: 'Linear: Zweipunktgrössenmass (LP)', g: 'Winkel: Zwei-Linien-Winkelgrössenmass mit Minimax. Ein Modifikator ersetzt den Standard.' },
    { name: 'Referenzbedingungen', f: '20 °C', g: 'Andere Bedingungen separat festlegen, z. B. 23 °C ±2 K und 50 % ±10 %' },
    { name: 'Starres Werkstück', f: 'Freier Zustand, keine Verformung', g: 'Dünne Teile: Einspannbedingung angeben' },
    { name: 'Dualität', f: 'Spezifikation ≠ Messverfahren', g: 'Unterschied Spezifikation/Verifikation = Methodenunsicherheit' },
    { name: 'Allgemeine Spezifikation', f: 'Widerspruch ohne Zuordnung: nur die tolerantere gilt', g: '' },
    { name: 'Verantwortlichkeit', f: 'Konstruktion: Mehrdeutigkeit · prüfende Partei: Messunsicherheit', g: '' },
    { name: 'Grössenmassmerkmale', f: '4 Gruppen: örtlich · global · Kombination (E) · Rangordnung', g: 'Rangordnung (SX, SN …) nur als Ergänzung zu örtlichen Merkmalen' },
  ],
  karten: [
    { id: 'grundsaetze', title: 'Grundsätze I', ziel: 'Du erklärst Aufrufen, Normenhierarchie, bestimmende Zeichnung, Geometrieelement, Unabhängigkeit und Dezimaldarstellung.' },
    { id: 'grundsaetze2', title: 'Grundsätze II', ziel: 'Du erklärst Standardfestlegung, Referenzbedingungen, starres Werkstück, Dualität, allgemeine Spezifikation und Verantwortlichkeit.', hilfreich: ['grundsaetze'] },
    { id: 'grossenmass', title: 'Grössenmassmerkmale', ziel: 'Du ordnest Symbole und Namen der Grössenmassmerkmale zu und nennst ihre vier Gruppen.', hilfreich: ['grundsaetze2'] },
  ],
  aufgaben: AUFGABEN,
};
