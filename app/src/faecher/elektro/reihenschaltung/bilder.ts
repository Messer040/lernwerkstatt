// Schaltbilder für das Kapitel Reihenschaltung.
// Farben: Gesamtspannung blau, Teilspannung magenta, Strom grün.
import { C, blatt, el, line, ref, txt } from '../../../core/draw/svg';

export type Typ = 'R' | 'lampe' | 'spule' | 'led';
export interface Teil {
  name: string;
  /** Wert über dem Bauteil, z. B. «470 Ω» */
  wert?: string;
  /** Teilspannung unter dem Bauteil, z. B. «U1 = ?» */
  u?: string;
  typ?: Typ;
  /** Schalter parallel zum Bauteil (überbrückt es, wenn zu) */
  schalter?: string;
}

const XL = 130, XR = 590, YT = 100, YB = 250, X0 = 205, X1 = 580;
const draht = { 'stroke-width': 1.8 };

function bauteil(s: SVGSVGElement, cx: number, t: Teil) {
  const typ = t.typ ?? 'R';
  if (typ === 'lampe') {
    s.append(el('circle', { cx, cy: YT, r: 16, fill: '#fff6c8', stroke: C.INK, 'stroke-width': 1.6 }));
    line(s, cx - 11, YT - 11, cx + 11, YT + 11, { 'stroke-width': 1.4 });
    line(s, cx - 11, YT + 11, cx + 11, YT - 11, { 'stroke-width': 1.4 });
    line(s, cx - 30, YT, cx - 16, YT, draht);
    line(s, cx + 16, YT, cx + 30, YT, draht);
    txt(s, cx, YT - 22, t.name, { 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 600 });
    return;
  }
  if (typ === 'led') {
    s.append(el('rect', { x: cx - 30, y: YT - 16, width: 60, height: 32, rx: 4, fill: '#fff', stroke: C.INK, 'stroke-width': 1.6 }));
    s.append(el('polygon', { points: `${cx - 8},${YT - 9} ${cx - 8},${YT + 9} ${cx + 7},${YT}`, fill: C.INK }));
    line(s, cx + 8, YT - 9, cx + 8, YT + 9, { 'stroke-width': 2 });
    line(s, cx + 14, YT - 4, cx + 24, YT - 12, { 'stroke-width': 1.2, 'marker-end': ref(s, 'D') });
    txt(s, cx, YT - 24, t.name, { 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 600 });
    return;
  }
  const spule = typ === 'spule';
  s.append(el('rect', { x: cx - 30, y: YT - 13, width: 60, height: 26, rx: 3, fill: spule ? '#d7dbe2' : '#fff', stroke: C.INK, 'stroke-width': 1.6 }));
  txt(s, cx, YT + 5, t.name, { 'text-anchor': 'middle', 'font-weight': 600, 'font-size': 14 });
}

/** Reihenschaltung: Quelle links, bis 4 Bauteile oben, Gesamtspannung unten. */
export function reihe(teile: Teil[], o: { U?: string; I?: string; titel?: string; zellen?: string } = {}) {
  const s = blatt(300, o.titel ?? 'Reihenschaltung');
  const n = teile.length, d = (X1 - X0) / n;
  const xs = teile.map((_, i) => X0 + (i + 0.5) * d);

  // Leitungen
  line(s, XL, YT, xs[0] - 30, YT, draht);
  xs.forEach((x, i) => line(s, x + 30, YT, i < n - 1 ? xs[i + 1] - 30 : XR, YT, draht));
  line(s, XR, YT, XR, YB, draht);
  line(s, XL, YB, XR, YB, draht);
  line(s, XL, YT, XL, 145, draht);
  line(s, XL, 205, XL, YB, draht);

  // Quelle
  s.append(el('rect', { x: XL - 26, y: 145, width: 52, height: 60, rx: 6, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.5 }));
  txt(s, XL, 181, 'G', { 'text-anchor': 'middle', 'font-weight': 600, 'font-size': 18 });
  if (o.zellen) txt(s, XL - 34, 180, o.zellen, { 'text-anchor': 'end', 'font-size': 13 });

  teile.forEach((t, i) => {
    const x = xs[i];
    bauteil(s, x, t);
    if (t.schalter) {
      line(s, x - 38, YT, x - 38, YT - 40, draht);
      line(s, x + 38, YT, x + 38, YT - 40, draht);
      line(s, x - 38, YT - 40, x - 12, YT - 40, draht);
      line(s, x - 12, YT - 40, x + 10, YT - 54, { 'stroke-width': 2 });
      line(s, x + 14, YT - 40, x + 38, YT - 40, draht);
      [x - 38, x + 38].forEach((cx) => s.append(el('circle', { cx, cy: YT, r: 3, fill: C.INK })));
      txt(s, x, YT - 62, t.schalter, { 'text-anchor': 'middle', 'font-size': 13 });
    } else if (t.wert) {
      txt(s, x, (t.typ ?? 'R') === 'R' || t.typ === 'spule' ? YT - 22 : YT - 44, t.wert, { 'text-anchor': 'middle', 'font-size': 13 });
    }
    if (t.u) {
      line(s, x - 28, YT + 28, x + 28, YT + 28, { stroke: C.F, 'stroke-width': 3, 'marker-end': ref(s, 'F') });
      txt(s, x, YT + 50, t.u, { 'text-anchor': 'middle', fill: C.F, 'font-weight': 600, 'font-size': 13 });
    }
  });

  // Strom oben links
  if (o.I) {
    line(s, XL + 8, YT - 12, xs[0] - (teile[0].schalter ? 50 : 38), YT - 12, { stroke: C.M, 'stroke-width': 3, 'marker-end': ref(s, 'M') });
    txt(s, XL + 2, YT - 22, o.I, { fill: C.M, 'font-weight': 600, 'font-size': 13 });
  }
  // Gesamtspannung unten
  if (o.U) {
    line(s, X0, YB - 32, X1, YB - 32, { stroke: C.L, 'stroke-width': 3, 'marker-end': ref(s, 'L') });
    txt(s, (X0 + X1) / 2, YB + 26, o.U, { 'text-anchor': 'middle', fill: C.L, 'font-weight': 600, 'font-size': 14 });
  }
  return s;
}
