import type { Kapitel } from '../../../core/types';
import { AUFGABEN } from './aufgaben';
import { AUFGABEN2 } from './aufgaben2';

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

export const gpsVertieft: Kapitel = {
  id: 'gps2',
  title: 'GPS vertieft',
  kurz: 'Rangordnung rechnen, Modifikatoren, Winkel, Material, Bezüge',
  formeln: [
    { name: 'SX / SN', f: 'grösster / kleinster Messwert', g: '' },
    { name: 'SR', f: 'SR = SX − SN', g: 'Spanne der Grössenmasse' },
    { name: 'SA', f: 'SA = (x₁ + … + xₙ) : n', g: 'Mittelwert aller Messwerte' },
    { name: 'SD', f: 'SD = (SX + SN) : 2', g: 'Mittelwert aus grösstem und kleinstem' },
    { name: 'SM', f: 'sortieren, dann mittlerer Wert', g: 'Gerade Anzahl: Mittelwert der zwei mittleren Werte' },
    { name: 'SQ', f: 'Standardabweichung der Messwerte', g: 'Streuung um den Mittelwert' },
    { name: 'Hülle E, Welle', f: 'GN ≤ oberes Grenzmass · LP ≥ unteres Grenzmass', g: '' },
    { name: 'Hülle E, Bohrung', f: 'GX ≥ unteres Grenzmass · LP ≤ oberes Grenzmass', g: '' },
    { name: 'Wirksame Grenzmasse, Bohrung', f: 'MMVS = MMS − t · LMVS = LMS + t', g: 't = geometrische Toleranz' },
    { name: 'Wirksame Grenzmasse, Welle', f: 'MMVS = MMS + t · LMVS = LMS − t', g: '' },
    { name: 'Schnitte', f: 'ACS beliebiger Querschnitt · ALS beliebiger Längsschnitt · SCS bestimmter Querschnitt', g: '' },
  ],
  karten: [
    { id: 'rangordnung', title: 'Rangordnung rechnen', ziel: 'Du bestimmst SX, SN, SA, SM, SD und SR aus einem Prüfprotokoll.' },
    { id: 'modifikatoren', title: 'Modifikatoren', ziel: 'Du wählst Hülle, berechnete Durchmesser, Querschnitte und Ergänzungen richtig.', hilfreich: ['rangordnung'] },
    { id: 'winkel', title: 'Winkelgrössenmass', ziel: 'Du erklärst Winkelgrössenmasse, ihren Standard und Teilbereiche.', hilfreich: ['modifikatoren'] },
    { id: 'material', title: 'Material-Bedingung', ziel: 'Du erklärst MMR und Reziprozität und berechnest wirksame Grenzmasse.' },
    { id: 'allgemeines', title: 'Allgemeintoleranz, Oberfläche, Bezüge', ziel: 'Du erklärst Allgemeintoleranzen, die Mindestangabe der Oberfläche, Bezugsstellen und Situationselemente.' },
  ],
  aufgaben: AUFGABEN2,
};
