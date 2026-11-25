// Gemeinsames Datenmodell für alle Fächer.
// Ein Fach hat Kapitel, ein Kapitel hat Lernkarten, eine Lernkarte hat Aufgaben.

/** 1 = Verstehen, 2 = Anwenden, 3 = Meistern */
export type Stufe = 1 | 2 | 3;

export const STUFEN: Record<Stufe, string> = { 1: 'Verstehen', 2: 'Anwenden', 3: 'Meistern' };

/** Fragefamilie. Jede Lernkarte soll Aufgaben aus mehreren Familien haben. */
export type Familie =
  | 'rechnen'
  | 'umgekehrt'
  | 'schaetzen'
  | 'fehler'
  | 'bild'
  | 'waswaere'
  | 'begruenden'
  | 'kette';

export const FAMILIEN: Record<Familie, string> = {
  rechnen: 'Rechnen',
  umgekehrt: 'Umgekehrt',
  schaetzen: 'Schätzen',
  fehler: 'Fehler finden',
  bild: 'Bild deuten',
  waswaere: 'Was wäre wenn',
  begruenden: 'Begründen',
  kette: 'Kette',
};

/** Zahlenantwort mit fester Einheit. */
export interface NumAsk {
  kind?: 'num';
  /** Bezeichnung, z. B. «a) F_G» */
  k: string;
  unit: string;
  v: number;
  /** relative Toleranz, Standard 0.015 */
  tol?: number;
}

/** Auswahlantwort. a = Index der richtigen Option. */
export interface ChoiceAsk {
  kind: 'choice';
  k: string;
  opts: string[];
  a: number;
  /** Erklärung pro falscher Option (gleicher Index wie opts) */
  why?: (string | undefined)[];
}

export type Ask = NumAsk | ChoiceAsk;

/** Typischer Fehlerwert: Wer genau diesen Wert eingibt, bekommt diese Meldung. */
export interface Fehler {
  /** Index in asks() */
  ask: number;
  v: number;
  msg: string;
}

export interface Task<P = any> {
  id: string;
  karte: string;
  stufe: Stufe;
  familie: Familie;
  title: string;
  /** Herkunft, z. B. «nach Buch S. 42» (optional) */
  src?: string;
  gen(): P;
  draw?(p: P): SVGSVGElement;
  /** HTML-Text der Aufgabe */
  text(p: P): string;
  asks(p: P): Ask[];
  fehler?(p: P): Fehler[];
  /** Tipps in steigender Hilfe: Prinzip, erster Schritt, ganzer Weg */
  tipps(p: P): string[];
  /** Lösungsschritte als HTML */
  loesung(p: P): string[];
  loesungsbild?(p: P): SVGSVGElement;
}

/** Hilfsfunktion: hält den Typ von P innerhalb einer Aufgabe fest. */
export function task<P>(t: Task<P>): Task<P> {
  return t;
}

export interface Karte {
  id: string;
  title: string;
  /** Lernziel in einem Satz */
  ziel: string;
  /** Hinweis, welche Karten hilfreich sind (keine Sperre) */
  hilfreich?: string[];
}

export interface Formel {
  name: string;
  /** HTML der Formel */
  f: string;
  /** Grössen mit Einheit */
  g?: string;
}

export interface Kapitel {
  id: string;
  title: string;
  kurz: string;
  formeln: Formel[];
  karten: Karte[];
  aufgaben: Task[];
}

/** Eintrag im Wissensspeicher («Nachschlagen»). Eigene Worte, nie Buchtext wörtlich. */
export interface Wissen {
  id: string;
  thema: string;
  art: 'formel' | 'begriff' | 'merksatz' | 'lehrer' | 'bild';
  titel: string;
  /** HTML */
  text: string;
  formel?: string;
  /** Name einer Bildfunktion, falls vorhanden */
  bild?: string;
  /** Kapitel-ID, auf das der Eintrag verweist */
  kapitel?: string;
  /** Unterlage, z. B. «Swissmem ISO-GPS-Guide S. 8, 25.11.2026» */
  quelle: string;
  /** ISO-Datum */
  datum: string;
}

export interface Fach {
  id: string;
  title: string;
  kurz: string;
  kapitel: Kapitel[];
  /** Kapitel, die noch im alten Trainer liegen und folgen */
  geplant?: string[];
  /** Wissensspeicher: Seite «Nachschlagen» */
  wissen?: Wissen[];
}
