// Schaltbilder für das Kapitel Masche mit mehreren Quellen.
// Farben: Erzeugerspannung blau, Teilspannung magenta, Strom grün.
import { C, blatt, el, line, ref, txt } from '../../../core/draw/svg';

export interface Schalt {
  /** Beschriftung der Quelle links, z. B. «U01 = 12 V» */
  u01: string;
  /** Beschriftung der Quelle rechts. Ohne Angabe gibt es nur eine Quelle. */
  u02?: string;
  /** true: U02 treibt in dieselbe Richtung wie U01 */
  gleich?: boolean;
  /** Werte unter den Widerständen, z. B. «270 Ω» oder «?» */
  r1: string;
  r2: string;
  r3: string;
  /** Beschriftung des Stroms, z. B. «I = ?» */
  strom?: string;
  /** Beschriftung der Teilspannungen U1, U2, U3 */
  abfall?: [string, string, string];
}

const XL = 160, XR = 500, YT = 80, YB = 230, YM = 155;
const X1 = 260, X2 = 400, X3 = 330;

function widerstand(s: SVGSVGElement, cx: number, y: number, name: string) {
  s.append(el('rect', { x: cx - 30, y: y - 13, width: 60, height: 26, rx: 3, fill: '#fff', stroke: C.INK, 'stroke-width': 1.6 }));
  txt(s, cx, y + 5, name, { 'text-anchor': 'middle', 'font-weight': 600 });
}

function quelle(s: SVGSVGElement, x: number) {
  s.append(el('rect', { x: x - 28, y: YM - 30, width: 56, height: 60, rx: 6, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.5 }));
  txt(s, x, YM + 6, 'G', { 'text-anchor': 'middle', 'font-weight': 600, 'font-size': 18 });
}

function erzeugerPfeil(s: SVGSVGElement, x: number, hoch: boolean) {
  const [y1, y2] = hoch ? [YM + 30, YM - 30] : [YM - 30, YM + 30];
  line(s, x, y1, x, y2, { stroke: C.L, 'stroke-width': 3.2, 'marker-end': ref(s, 'L') });
}

export function schaltung(p: Schalt, titel = 'Masche mit Quellen und Widerständen'): SVGSVGElement {
  const s = blatt(300, titel);
  const zwei = p.u02 !== undefined;
  const draht = { 'stroke-width': 1.8 };
  const klein = { 'font-size': 14 };

  // Leitungen (enden an den Bauteilkanten)
  line(s, XL, YT, X1 - 30, YT, draht);
  line(s, X1 + 30, YT, X2 - 30, YT, draht);
  line(s, X2 + 30, YT, XR, YT, draht);
  line(s, XL, YT, XL, YM - 30, draht);
  line(s, XL, YM + 30, XL, YB, draht);
  if (zwei) {
    line(s, XR, YT, XR, YM - 30, draht);
    line(s, XR, YM + 30, XR, YB, draht);
  } else {
    line(s, XR, YT, XR, YB, draht);
  }
  line(s, XL, YB, X3 - 30, YB, draht);
  line(s, X3 + 30, YB, XR, YB, draht);

  widerstand(s, X1, YT, 'R1');
  widerstand(s, X2, YT, 'R2');
  widerstand(s, X3, YB, 'R3');
  txt(s, X1, YT + 34, p.r1, { 'text-anchor': 'middle', ...klein });
  txt(s, X2, YT + 34, p.r2, { 'text-anchor': 'middle', ...klein });
  txt(s, X3, YB - 20, p.r3, { 'text-anchor': 'middle', ...klein });

  // Quelle links: treibt im Uhrzeigersinn (links nach oben)
  quelle(s, XL);
  erzeugerPfeil(s, XL - 42, true);
  txt(s, XL - 52, YM + 5, p.u01, { 'text-anchor': 'end', fill: C.L, 'font-weight': 600, ...klein });
  txt(s, XL + 44, YM - 12, '+', { 'text-anchor': 'middle' });
  txt(s, XL + 44, YM + 22, '−', { 'text-anchor': 'middle' });

  if (zwei) {
    const g = p.gleich !== false;
    quelle(s, XR);
    // gleich: rechts nach unten (im Uhrzeigersinn), entgegen: rechts nach oben
    erzeugerPfeil(s, XR + 42, !g);
    txt(s, XR + 52, YM + 5, p.u02!, { fill: C.L, 'font-weight': 600, ...klein });
    txt(s, XR - 44, YM - 12, g ? '−' : '+', { 'text-anchor': 'middle' });
    txt(s, XR - 44, YM + 22, g ? '+' : '−', { 'text-anchor': 'middle' });
  }

  txt(s, 330, YM + 5, 'Umlaufrichtung M ↻', { 'text-anchor': 'middle', fill: C.GRAU, 'font-size': 13 });

  if (p.strom) {
    line(s, X1, YB + 32, X1 - 80, YB + 32, { stroke: C.M, 'stroke-width': 3, 'marker-end': ref(s, 'M') });
    txt(s, X1 - 45, YB + 54, p.strom, { 'text-anchor': 'middle', fill: C.M, 'font-weight': 600, ...klein });
  }

  if (p.abfall) {
    const [a1, a2, a3] = p.abfall;
    const pf = (x1: number, x2: number, y: number) =>
      line(s, x1, y, x2, y, { stroke: C.F, 'stroke-width': 3.2, 'marker-end': ref(s, 'F') });
    const bs = { 'text-anchor': 'middle', fill: C.F, 'font-weight': 600, ...klein };
    pf(X1 - 30, X1 + 30, YT - 28);
    txt(s, X1, YT - 38, a1, bs);
    pf(X2 - 30, X2 + 30, YT - 28);
    txt(s, X2, YT - 38, a2, bs);
    pf(X3 + 30, X3 - 30, YB + 32);
    txt(s, X3 + 25, YB + 54, a3, bs);
  }
  return s;
}
