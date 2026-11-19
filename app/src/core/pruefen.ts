// Antworten prüfen und passende Rückmeldung finden.
import type { Ask, ChoiceAsk, Fehler, NumAsk } from './types';
import { parseZahl } from './zahl';

export const TOL = 0.015;

export type Urteil =
  | { ok: true; msg?: string }
  | { ok: false; leer?: boolean; msg?: string };

const nah = (x: number, v: number, tol: number) =>
  v === 0 ? Math.abs(x) < 1e-6 : Math.abs(x - v) <= Math.abs(v) * tol;

export const isChoice = (a: Ask): a is ChoiceAsk => a.kind === 'choice';

/** Prüft eine Zahlenantwort. fehler = typische Fehlwerte für genau diese Teilfrage. */
export function pruefeZahl(eingabe: string, a: NumAsk, fehler: Fehler[] = []): Urteil {
  const x = parseZahl(eingabe);
  if (eingabe.trim() === '') return { ok: false, leer: true, msg: 'Noch keine Zahl eingegeben.' };
  if (isNaN(x)) return { ok: false, msg: 'Das ist keine Zahl. Beispiel: 12,5' };
  const tol = a.tol ?? TOL;
  if (nah(x, a.v, tol)) return { ok: true };
  const f = fehler.find((e) => nah(x, e.v, tol));
  if (f) return { ok: false, msg: f.msg };
  // Einheitenfehler: Faktor 1000 daneben
  for (const k of [1000, 0.001, 1e6, 1e-6]) {
    if (nah(x, a.v * k, tol))
      return { ok: false, msg: `Die Grössenordnung stimmt nicht. Prüfe die Einheiten. Gefragt ist ${a.unit}.` };
  }
  if (nah(-x, a.v, tol)) return { ok: false, msg: 'Der Betrag stimmt, aber das Vorzeichen nicht.' };
  return { ok: false };
}

export function pruefeAuswahl(i: number | null, a: ChoiceAsk): Urteil {
  if (i === null) return { ok: false, leer: true, msg: 'Noch nichts ausgewählt.' };
  if (i === a.a) return { ok: true };
  return { ok: false, msg: a.why?.[i] };
}
