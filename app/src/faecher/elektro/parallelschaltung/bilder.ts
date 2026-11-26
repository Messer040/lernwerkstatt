// Schaltbilder für das Kapitel Parallelschaltung.
// Farben: Spannung blau, Teilströme magenta, Gesamtstrom grün.
import { C, blatt, el, line, ref, txt } from '../../../core/draw/svg';

export type Typ = 'R' | 'lampe' | 'heiz' | 'draht' | 'offen';
export interface Zweig {
  name: string;
  /** Wert über dem Bauteil, z. B. «40 Ω» */
  wert?: string;
  /** Teilstrom im Zweig, z. B. «I1 = ?» */
  i?: string;
  typ?: Typ;
}

const XQ = 60, XA = 150, XB = 400, XM = 280, Y0 = 80, DY = 74;
const draht = { 'stroke-width': 1.8 };

function bauteil(s: SVGSVGElement, y: number, z: Zweig) {
  const typ = z.typ ?? 'R';
  if (typ === 'draht') {
    line(s, XA, y, XB, y, { 'stroke-width': 2.6 });
    txt(s, XM, y - 10, z.name, { 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 600 });
    return;
  }
  if (typ === 'lampe' || typ === 'offen') {
    s.append(el('circle', { cx: XM, cy: y, r: 16, fill: typ === 'offen' ? '#e4e7ec' : '#fff6c8', stroke: C.INK, 'stroke-width': 1.6 }));
    line(s, XM - 11, y - 11, XM + 11, y + 11, { 'stroke-width': 1.4 });
    line(s, XM - 11, y + 11, XM + 11, y - 11, { 'stroke-width': 1.4 });
    line(s, XA, y, XM - 16, y, draht);
    line(s, XM + 16, y, XB, y, draht);
    txt(s, XM + 20, y - 9, z.name, { 'font-size': 13, 'font-weight': 600 });
    if (typ === 'offen') txt(s, XM, y - 22, 'durchgebrannt', { 'text-anchor': 'middle', 'font-size': 12, fill: C.GRAU });
    else if (z.wert) txt(s, XM, y - 22, z.wert, { 'text-anchor': 'middle', 'font-size': 13 });
    return;
  }
  const w = Math.max(60, z.name.length * 8 + 18);
  line(s, XA, y, XM - w / 2, y, draht);
  line(s, XM + w / 2, y, XB, y, draht);
  s.append(el('rect', { x: XM - w / 2, y: y - 13, width: w, height: 26, rx: 3, fill: typ === 'heiz' ? '#fde3cf' : '#fff', stroke: C.INK, 'stroke-width': 1.6 }));
  txt(s, XM, y + 5, z.name, { 'text-anchor': 'middle', 'font-weight': 600, 'font-size': 14 });
  if (z.wert) txt(s, XM, y - 20, z.wert, { 'text-anchor': 'middle', 'font-size': 13 });
}

/** Parallelschaltung: Quelle links, 1 bis 4 Zweige zwischen zwei Sammelleitungen. */
export function parallel(zweige: Zweig[], o: { U?: string; I?: string; titel?: string } = {}) {
  const n = zweige.length;
  const ys = zweige.map((_, k) => Y0 + k * DY);
  const yb = ys[n - 1] + 56;
  const s = blatt(yb + 34, o.titel ?? 'Parallelschaltung');

  // Leitungen
  line(s, XQ, Y0, XA, Y0, draht);
  line(s, XA, Y0, XA, ys[n - 1], draht);
  line(s, XB, Y0, XB, yb, draht);
  line(s, XQ, yb, XB, yb, draht);
  const ym = (Y0 + yb) / 2;
  line(s, XQ, Y0, XQ, ym - 30, draht);
  line(s, XQ, ym + 30, XQ, yb, draht);

  // Quelle
  s.append(el('rect', { x: XQ - 26, y: ym - 30, width: 52, height: 60, rx: 6, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.5 }));
  txt(s, XQ, ym + 6, 'G', { 'text-anchor': 'middle', 'font-weight': 600, 'font-size': 18 });
  txt(s, XQ + 12, ym - 38, '+', { 'font-size': 15, 'font-weight': 600 });
  txt(s, XQ + 12, ym + 50, '−', { 'font-size': 15, 'font-weight': 600 });

  zweige.forEach((z, k) => {
    const y = ys[k];
    bauteil(s, y, z);
    for (const x of [XA, XB]) if (k > 0 || x === XB) s.append(el('circle', { cx: x, cy: y, r: 3.5, fill: C.INK }));
    if (z.i) {
      line(s, XA + 10, y + 13, XA + 62, y + 13, { stroke: C.F, 'stroke-width': 3, 'marker-end': ref(s, 'F') });
      txt(s, XA + 10, y + 32, z.i, { fill: C.F, 'font-weight': 600, 'font-size': 13 });
    }
  });
  if (n > 1) s.append(el('circle', { cx: XA, cy: Y0, r: 3.5, fill: C.INK }));

  // Gesamtstrom auf der Zuleitung
  if (o.I) {
    line(s, XQ + 30, Y0 - 12, XA - 20, Y0 - 12, { stroke: C.M, 'stroke-width': 3, 'marker-end': ref(s, 'M') });
    txt(s, XQ + 30, Y0 - 22, o.I, { fill: C.M, 'font-weight': 600, 'font-size': 13 });
  }
  // Spannung: liegt an jedem Zweig gleich
  if (o.U) {
    const xu = XB + 26;
    line(s, xu, Y0, xu, n > 1 ? ys[n - 1] : yb, { stroke: C.L, 'stroke-width': 3, 'marker-end': ref(s, 'L') });
    txt(s, xu + 10, ((n > 1 ? ys[n - 1] : yb) + Y0) / 2 + 5, o.U, { fill: C.L, 'font-weight': 600, 'font-size': 14 });
  }
  return s;
}
