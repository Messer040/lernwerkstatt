// Bauteilbilder für das Kapitel Einfache Maschinen, Flaschenzüge.
// Die schiefe Ebene kommt aus dem Kapitel Reibung.
import { C, balken, blatt, bolzen, boden, el, kiste, kraft, line, massH, massV, ref, txt } from '../../../core/draw/svg';
import { fmt } from '../../../core/zahl';
export { ebene } from '../reibung/bilder';

type S = SVGSVGElement;
const rad = (d: number) => (d * Math.PI) / 180;
const kl = (s: S, x: number, y: number, t: string, o: Record<string, string | number> = {}) => txt(s, x, y, t, { 'font-size': 13, ...o });
const HOLZ = { fill: '#f0c987', stroke: '#8a6a3a' };
const GRUEN = { fill: '#b9d7a8', stroke: '#3b6d11' };
const STAHL = { fill: C.STAHL, stroke: C.STAHLRAND };
const seil = (s: S, x1: number, y1: number, x2: number, y2: number) => line(s, x1, y1, x2, y2, { stroke: '#444', 'stroke-width': 2.2 });

/** Feste Rolle, lose Rolle oder Flaschenzug mit n tragenden Seilen. hl hebt die tragenden Seile hervor. */
export function rolle(o: { typ: 'fest' | 'lose' | 'zug'; n?: number; F?: string; FG?: string; h?: string; m?: string; x?: string; hl?: boolean; anzahl?: boolean }) {
  const s = blatt(310, o.typ === 'zug' ? 'Flaschenzug' : o.typ === 'fest' ? 'Feste Rolle' : 'Lose Rolle');
  boden(s, 200, 16, 240, 14);
  const r = (x: number, y: number, rr = 30) => {
    s.append(el('circle', { cx: x, cy: y, r: rr, ...STAHL, 'stroke-width': 1.5 }));
    bolzen(s, x, y);
  };
  const mark = (x1: number, y1: number, x2: number, y2: number) =>
    line(s, x1, y1, x2, y2, { stroke: C.L, 'stroke-width': 7, opacity: 0.5, 'stroke-linecap': 'round' });
  if (o.typ === 'fest') {
    seil(s, 320, 30, 320, 90);
    seil(s, 290, 90, 290, 200);
    seil(s, 350, 90, 350, 150);
    r(320, 90);
    kiste(s, 268, 200, 44, 40);
    if (o.FG) kraft(s, 290, 240, 290, 292, o.FG, 298, 284);
    if (o.F) kraft(s, 350, 150, 350, 225, o.F, 360, 205);
    if (o.hl) mark(290, 95, 290, 198);
  } else if (o.typ === 'lose') {
    seil(s, 290, 30, 290, 170);
    seil(s, 350, 170, 350, 112);
    seil(s, 320, 170, 320, 215);
    r(320, 170);
    kiste(s, 298, 215, 44, 40);
    if (o.FG) kraft(s, 320, 255, 320, 300, o.FG, 328, 296);
    if (o.F) kraft(s, 350, 112, 350, 45, o.F, 360, 70);
    if (o.hl) {
      mark(290, 34, 290, 165);
      mark(350, 165, 350, 115);
    }
  } else {
    const n = o.n ?? 2;
    seil(s, 320, 30, 320, 52);
    s.append(el('rect', { x: 282, y: 52, width: 76, height: 30, rx: 8, ...STAHL, 'stroke-width': 1.5 }));
    s.append(el('rect', { x: 282, y: 180, width: 76, height: 30, rx: 8, ...STAHL, 'stroke-width': 1.5 }));
    for (let i = 0; i < n; i++) {
      const x = 290 + (n === 1 ? 30 : (i * 60) / (n - 1));
      seil(s, x, 82, x, 180);
      if (o.hl) mark(x, 84, x, 178);
    }
    seil(s, 358, 62, 400, 62);
    s.append(el('circle', { cx: 400, cy: 74, r: 12, ...STAHL }));
    seil(s, 412, 74, 412, 130);
    if (o.F) kraft(s, 412, 130, 412, 205, o.F, 422, 185);
    seil(s, 320, 210, 320, 232);
    kiste(s, 298, 232, 44, 38);
    if (o.FG) kraft(s, 320, 270, 320, 304, o.FG, 328, 302);
    if (o.anzahl !== false) txt(s, 270, 135, `${n} tragende Seile`, { 'text-anchor': 'end', 'font-size': 14, fill: C.L });
    kl(s, 465, 60, 'Schema', { fill: C.GRAU, 'font-size': 12 });
  }
  if (o.h) txt(s, 60, 240, o.h, { 'font-size': 14, fill: C.L });
  if (o.m) txt(s, 60, 262, o.m, { 'font-size': 14 });
  if (o.x) txt(s, 60, 284, o.x, { 'font-size': 14 });
  return s;
}

/** Keilstempel schiebt einen Seitenschieber. */
export function keil(p: { al: number; F1: number }, o: { F1?: string; F2?: string; note?: string } = {}) {
  const s = blatt(300, 'Keilstempel'), a = rad(p.al), x0 = 200, yT = 40, H = 200, W = H * Math.tan(a);
  s.append(el('rect', { x: 120, y: 20, width: 30, height: 260, fill: ref(s, 'hat'), stroke: '#555' }));
  boden(s, 120, 262, 420, 18);
  s.append(el('polygon', { points: `150,${yT} ${x0},${yT} ${x0 + W},${yT + H} 150,${yT + H}`, ...HOLZ }));
  kl(s, 156, yT + 120, 'Keilstempel', { 'font-size': 12 });
  s.append(
    el('polygon', {
      points: `${x0 + W + 4},${yT + H} ${x0 + 4 + W * 0.35},${yT + H * 0.35} ${x0 + W + 120},${yT + H * 0.35} ${x0 + W + 120},${yT + H}`,
      ...STAHL,
    }),
  );
  kl(s, x0 + W + 60, yT + H - 14, 'Schieber', { 'font-size': 12, 'text-anchor': 'middle' });
  kraft(s, 175, yT - 30, 175, yT + 30, o.F1 ?? `F_1 = ${fmt(p.F1)} N`, 185, yT - 14);
  kraft(s, x0 + W + 124, yT + H * 0.65, x0 + W + 200, yT + H * 0.65, o.F2 ?? 'F_2 = ?', x0 + W + 150, yT + H * 0.65 - 12);
  s.append(el('path', { d: `M${x0},${yT + 60} A60,60 0 0 0 ${x0 + 60 * Math.sin(a)},${yT + 60 * Math.cos(a)}`, fill: 'none', stroke: C.INK }));
  line(s, x0, yT, x0, yT + 80, { stroke: '#777', 'stroke-dasharray': '4 3' });
  kl(s, x0 + 6, yT + 80, `${p.al}°`);
  if (o.note) kl(s, 560, 290, o.note, { 'font-size': 12, 'text-anchor': 'end' });
  return s;
}

/** Spindelpresse mit Handrad (Durchmesser d) und Steigung P. */
export function spindelpresse(p: { d: number; P: number | string; F1: number | string }, o: { F1?: string; F2?: string; note?: string } = {}) {
  const s = blatt(300, 'Spindelpresse'), cx = 320, R = Math.min(170, p.d * 0.25 + 60);
  boden(s, 140, 270, 360, 12);
  [cx - 120, cx + 120].forEach((x) => s.append(el('rect', { x: x - 10, y: 80, width: 20, height: 190, fill: C.GESTELL, stroke: '#555' })));
  s.append(el('rect', { x: cx - 140, y: 80, width: 280, height: 24, ...GRUEN }));
  line(s, cx, 30, cx, 210, { stroke: '#555', 'stroke-width': 14 });
  for (let y = 40; y < 200; y += 8) line(s, cx - 7, y, cx + 7, y + 4, { stroke: '#bbb' });
  s.append(el('ellipse', { cx, cy: 50, rx: R, ry: 12, fill: 'none', stroke: '#c99a3a', 'stroke-width': 6 }));
  s.append(el('rect', { x: cx - 50, y: 210, width: 100, height: 20, ...GRUEN }));
  kiste(s, cx - 30, 240, 60, 30);
  kraft(s, cx + R - 60, 72, cx + R + 10, 72, o.F1 ?? `F_1 = ${p.F1} N`, cx + R + 18, 77, { 'font-size': 13 });
  kraft(s, cx + 40, 190, cx + 40, 236, o.F2 ?? 'F_2 = ?', cx + 58, 218, { 'font-size': 13 });
  massH(s, cx - R, cx + R, 24, `d = ${p.d}`, 50);
  txt(s, cx - 150, 150, `P = ${typeof p.P === 'number' ? fmt(p.P) : p.P} mm`, { fill: C.L, 'font-size': 14, 'text-anchor': 'end' });
  if (o.note) kl(s, 30, 290, o.note, { 'font-size': 12 });
  return s;
}

/** Abzieher mit Spindel und Querhebel. */
export function abzieher(p: { F1: number; l: number }, o: { F1?: string } = {}) {
  const s = blatt(300, 'Abzieher'), cx = 320, L = Math.min(220, p.l * 0.9);
  line(s, cx - L, 40, cx + L, 40, { stroke: '#555', 'stroke-width': 10 });
  line(s, cx, 40, cx, 220, { stroke: '#555', 'stroke-width': 14 });
  for (let y = 60; y < 210; y += 8) line(s, cx - 7, y, cx + 7, y + 4, { stroke: '#bbb' });
  s.append(el('path', { d: `M${cx - 130},140 Q${cx - 160},140 ${cx - 150},250 L${cx - 120},250`, fill: 'none', stroke: C.STAHLRAND, 'stroke-width': 8 }));
  s.append(el('path', { d: `M${cx + 130},140 Q${cx + 160},140 ${cx + 150},250 L${cx + 120},250`, fill: 'none', stroke: C.STAHLRAND, 'stroke-width': 8 }));
  s.append(el('rect', { x: cx - 150, y: 120, width: 300, height: 26, rx: 8, ...STAHL }));
  s.append(el('rect', { x: cx - 60, y: 236, width: 120, height: 20, ...HOLZ }));
  kraft(s, cx - L, 24, cx - L + 60, 24);
  kraft(s, cx + L, 58, cx + L - 60, 58);
  const t = o.F1 ?? `F_1 = ${p.F1} N`;
  txt(s, cx - L, 14, t, { fill: C.F, 'font-weight': 600, 'font-size': 13 });
  txt(s, cx + L, 80, t, { fill: C.F, 'font-weight': 600, 'font-size': 13, 'text-anchor': 'end' });
  txt(s, cx + 16, 72, `Hebel ${p.l} mm`, { fill: C.L, 'font-size': 13 });
  return s;
}

/** Scheren-Wagenheber (Rhombus) mit waagrechter Spindel. */
export function wagenheber(p: { w: number; h: number; r: number; FG: number; g: string }, o: { FG?: string } = {}) {
  const s = blatt(330, 'Scheren-Wagenheber'), cx = 300, hw = (p.w / 2) * 0.45, hh = (p.h / 2) * 0.45, cy = 165;
  boden(s, cx - 160, cy + hh + 30, 320, 10);
  s.append(el('polygon', { points: `${cx - 30},${cy + hh + 30} ${cx + 30},${cy + hh + 30} ${cx},${cy + hh}`, fill: C.GESTELL, stroke: '#555' }));
  const A = [cx, cy - hh], B = [cx - hw, cy], D = [cx + hw, cy], Cc = [cx, cy + hh];
  ([[A, B], [B, Cc], [Cc, D], [D, A]] as number[][][]).forEach(([u, v]) => line(s, u[0], u[1], v[0], v[1], { stroke: C.STAHLRAND, 'stroke-width': 9 }));
  [A, B, Cc, D].forEach((q) => bolzen(s, q[0], q[1]));
  line(s, B[0] - 20, cy, D[0] + 40, cy, { stroke: '#555', 'stroke-width': 5 });
  s.append(el('circle', { cx: D[0] + 60, cy: cy + 40, r: 20, fill: 'none', stroke: '#777', 'stroke-dasharray': '4 3' }));
  line(s, D[0] + 40, cy, D[0] + 60, cy + 40, { stroke: '#555', 'stroke-width': 3 });
  txt(s, D[0] + 86, cy + 46, `r = ${p.r}`, { fill: C.L, 'font-size': 13 });
  kraft(s, cx, cy - hh - 50, cx, cy - hh - 8, o.FG ?? `F_G = ${p.FG} kN`, cx + 10, cy - hh - 30);
  txt(s, A[0] + 10, A[1] + 4, 'A', { 'font-weight': 600 });
  txt(s, B[0] - 22, B[1] - 8, 'B', { 'font-weight': 600 });
  txt(s, A[0] - 8 - hw / 2, (A[1] + B[1]) / 2 - 6, 'F_I', { fill: C.F, 'font-weight': 600, 'font-size': 13, 'text-anchor': 'end' });
  txt(s, D[0] + 12, D[1] - 10, 'F_2', { fill: C.F, 'font-weight': 600, 'font-size': 13 });
  massH(s, B[0], D[0], cy + hh + 56, `${p.w}`, cy);
  massV(s, A[1], Cc[1], B[0] - 50, `${p.h}`, cx);
  txt(s, 30, 30, `Spindel ${p.g}`, { 'font-size': 13 });
  return s;
}

/** Spindel-Wagenheber mit langem Hebel (Hebelkreis). */
export function hebelSpindel(p: { FH: number; l: number; P: number; eta: number }) {
  const s = blatt(300, 'Spindel-Wagenheber');
  boden(s, 230, 250, 180, 16);
  s.append(el('rect', { x: 278, y: 205, width: 84, height: 45, fill: C.GESTELL, stroke: '#555' }));
  s.append(el('rect', { x: 306, y: 92, width: 28, height: 120, fill: '#cfe0f3', stroke: C.STAHLRAND }));
  for (let y = 100; y < 210; y += 9) line(s, 306, y + 5, 334, y - 3, { stroke: C.STAHLRAND });
  kiste(s, 275, 48, 90, 44);
  txt(s, 320, 75, 'Last', { 'text-anchor': 'middle', 'font-size': 13 });
  kraft(s, 320, 2, 320, 46, 'F = ?', 330, 22);
  balken(s, 320, 535, 150, 12);
  s.append(el('rect', { x: 520, y: 138, width: 28, height: 24, rx: 6, fill: '#444' }));
  kraft(s, 534, 165, 534, 225, `F_H = ${p.FH} N`, 526, 215, { 'text-anchor': 'end' });
  massH(s, 320, 534, 118, `l = ${p.l}`, 142);
  line(s, 340, 181, 372, 181);
  line(s, 340, 190, 372, 190);
  txt(s, 378, 191, `Steigung P = ${p.P}`, { 'font-size': 13, fill: C.L });
  txt(s, 30, 285, `η = ${fmt(p.eta, 2)}`, { 'font-size': 14 });
  kl(s, 350, 285, 'F_H wirkt am Umfang des Hebelkreises', { 'font-size': 12, fill: C.GRAU });
  return s;
}
