// Bauteilbilder für das Kapitel Reibung.
import {
  C, blatt, boden, bolzen, el, geschw, kiste, kraft, line, massH, massV, mittellinie, moment, ref, txt,
} from '../../../core/draw/svg';
import { fmt } from '../../../core/zahl';

type S = SVGSVGElement;
const rad = (d: number) => (d * Math.PI) / 180;
const gl = (s: S, x: number, y: number, t: string, o: Record<string, string | number> = {}) =>
  txt(s, x, y, t, { fill: C.M, 'font-weight': 600, 'font-size': 14, ...o });
const kl = (s: S, x: number, y: number, t: string, o: Record<string, string | number> = {}) =>
  txt(s, x, y, t, { 'font-size': 13, ...o });
const kt = (s: S, x: number, y: number, t: string, o: Record<string, string | number> = {}) =>
  txt(s, x, y, t, { fill: C.F, 'font-weight': 600, 'font-size': 13, ...o });
const schiene = (s: S, x1: number, x2: number, y: number) =>
  s.append(el('rect', { x: x1, y, width: x2 - x1, height: 12, fill: C.GESTELL, stroke: '#555' }));

const ROT = { fill: '#e7b9a4', stroke: '#8a4b33' };
const HOLZ = { fill: '#f0c987', stroke: '#8a6a3a' };
const GRAU = { fill: '#d7dbe2', stroke: '#555' };
const GRUEN = { fill: '#b9d7a8', stroke: '#3b6d11' };

/** Kiste auf waagrechtem Boden mit allen Kräften. */
export function kisteBoden(o: { m?: string; F?: string; Flen?: number; FG?: string; FN?: string; FR?: string; Rlen?: number; mu?: string }) {
  const s = blatt(280, 'Kiste auf dem Boden');
  boden(s, 120, 200, 400, 14);
  kiste(s, 240, 130, 110, 70);
  if (o.m) txt(s, 295, 122, o.m, { 'text-anchor': 'middle', 'font-size': 14 });
  if (o.F) kraft(s, 350, 165, 350 + (o.Flen ?? 95), 165, o.F, 358, 155);
  if (o.FG) kraft(s, 295, 160, 295, 250, o.FG, 303, 246);
  if (o.FN) kraft(s, 262, 262, 262, 203, o.FN, 254, 256, { 'text-anchor': 'end' });
  if (o.FR) kraft(s, 238, 194, 238 - (o.Rlen ?? 75), 194, o.FR, 236, 182, { 'text-anchor': 'end' });
  if (o.mu) txt(s, 410, 235, o.mu, { 'font-size': 14 });
  return s;
}

/** Werkstück zwischen zwei Backen. */
export function klemm(p: { FN: number }, o: { F?: string } = {}) {
  const s = blatt(260, 'Werkstück im Schraubstock');
  [185, 405].forEach((x) => s.append(el('rect', { x, y: 85, width: 50, height: 140, fill: C.GESTELL, stroke: '#555' })));
  kiste(s, 235, 105, 170, 95);
  kraft(s, 95, 152, 183, 152, `F_N = ${p.FN} N`, 60, 140);
  kraft(s, 545, 152, 457, 152, `F_N = ${p.FN} N`, 470, 140);
  kraft(s, 320, 103, 320, 35, o.F ?? 'F = ?', 330, 50);
  kraft(s, 243, 120, 243, 180, 'F_R', 249, 196, { 'font-size': 13 });
  kraft(s, 397, 120, 397, 180, 'F_R', 372, 196, { 'font-size': 13 });
  kl(s, 320, 160, 'Werkstück', { 'text-anchor': 'middle' });
  kl(s, 210, 245, 'Backe', { 'text-anchor': 'middle' });
  kl(s, 430, 245, 'Backe', { 'text-anchor': 'middle' });
  return s;
}

/** Backenbremse an einer Trommel. */
export function bremse(p: { FN: number; d: number }, o: { FR?: string; M?: string } = {}) {
  const s = blatt(310, 'Backenbremse'), cx = 320, cy = 185, r = 88;
  s.append(el('circle', { cx, cy, r, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.6 }));
  s.append(el('circle', { cx, cy, r: 13, fill: C.GESTELL, stroke: '#555' }));
  bolzen(s, cx, cy);
  s.append(el('rect', { x: cx - 45, y: cy - r - 22, width: 90, height: 20, rx: 3, fill: '#444' }));
  kl(s, cx + 52, cy - r - 8, 'Bremsbacke');
  kraft(s, cx, 18, cx, cy - r - 24, `F_N = ${p.FN} N`, cx + 10, 34);
  kraft(s, cx - 8, cy - r + 13, cx - 88, cy - r + 13, o.FR ?? 'F_R = ?', cx - 96, cy - r + 19, { 'text-anchor': 'end' });
  moment(s, cx, cy, 34, true);
  gl(s, cx, cy + 56, o.M ?? 'M = ?', { 'text-anchor': 'middle', 'font-size': 15 });
  kl(s, cx + r + 10, cy + 4, 'Drehrichtung', { fill: C.M });
  massV(s, cy - r, cy + r, cx - r - 70, `d = ${p.d}`, cx - 4);
  return s;
}

/** Schiefe Ebene mit Körper. Alle Beschriftungen kommen über o. */
export function ebene(
  p: { al: number },
  o: { FG?: string; F?: string; FR?: string; FH?: string; FN?: string; comp?: [number, number]; compN?: boolean; h?: string; l?: string; al?: string; m?: string; mu?: string } = {},
) {
  const s = blatt(300, 'Schiefe Ebene'), a = rad(p.al), A = [110, 262], bw = 400 * Math.cos(a), bh = 400 * Math.sin(a);
  const B = [A[0] + bw, 262], T = [A[0] + bw, 262 - bh], u = [Math.cos(a), -Math.sin(a)], n = [-Math.sin(a), -Math.cos(a)];
  s.append(el('polygon', { points: `${A} ${B} ${T}`, fill: ref(s, 'hat'), stroke: '#555' }));
  const M = [A[0] + bw * 0.55, 262 - bh * 0.55], c = [M[0] + n[0] * 20, M[1] + n[1] * 20], deg = -p.al;
  s.append(el('rect', { x: M[0] - 32, y: M[1] - 40, width: 64, height: 40, rx: 3, fill: C.HOLZ, stroke: '#555', transform: `rotate(${deg} ${M[0]} ${M[1]})` }));
  if (o.comp) {
    line(s, c[0], c[1], c[0] - u[0] * o.comp[0], c[1] - u[1] * o.comp[0], { stroke: '#e08aa9', 'stroke-width': 3, 'marker-end': ref(s, 'F') });
    kt(s, c[0] - u[0] * o.comp[0] - 8, c[1] - u[1] * o.comp[0] + 4, o.FH ?? 'F_H', { 'text-anchor': 'end' });
    if (o.compN !== false) {
      line(s, c[0], c[1], c[0] - n[0] * o.comp[1], c[1] - n[1] * o.comp[1], { stroke: '#e08aa9', 'stroke-width': 3, 'marker-end': ref(s, 'F') });
      kt(s, c[0] - n[0] * o.comp[1] + 12, c[1] - n[1] * o.comp[1] + 8, o.FN ?? 'F_N');
    }
  }
  kraft(s, c[0], c[1], c[0], c[1] + 78, o.FG ?? 'F_G', c[0] - 9, c[1] + 62, { 'text-anchor': 'end' });
  if (o.F) kraft(s, c[0] + u[0] * 34, c[1] + u[1] * 34, c[0] + u[0] * 112, c[1] + u[1] * 112, o.F, c[0] + u[0] * 112 - 4, c[1] + u[1] * 112 - 12, { 'text-anchor': 'end' });
  if (o.FR) kraft(s, M[0] - u[0] * 36 + n[0] * 4, M[1] - u[1] * 36 + n[1] * 4, M[0] - u[0] * 96 + n[0] * 4, M[1] - u[1] * 96 + n[1] * 4, o.FR, M[0] - u[0] * 100, M[1] - u[1] * 100 - 12, { 'text-anchor': 'end', 'font-size': 13 });
  if (o.h) massV(s, T[1], 262, B[0] + 34, o.h, B[0]);
  if (o.l) {
    const q = [A[0] + bw * 0.82 - n[0] * 14, 262 - bh * 0.82 - n[1] * 14];
    s.append(el('rect', { x: q[0] - 34, y: q[1] - 13, width: 68, height: 18, rx: 3, fill: '#e6e7ea', transform: `rotate(${deg} ${q[0]} ${q[1]})` }));
    txt(s, q[0], q[1], o.l, { fill: C.L, 'text-anchor': 'middle', 'font-size': 14, transform: `rotate(${deg} ${q[0]} ${q[1]})` });
  }
  if (o.al) {
    s.append(el('path', { d: `M${A[0] + 62},262 A62,62 0 0 0 ${A[0] + 62 * Math.cos(a)},${262 - 62 * Math.sin(a)}`, fill: 'none', stroke: C.INK }));
    kl(s, A[0] + 70, 256, o.al);
  }
  if (o.m) txt(s, 30, 40, o.m, { 'font-size': 14 });
  if (o.mu) txt(s, 30, 62, o.mu, { 'font-size': 14 });
  return s;
}

/** Palette auf einer Schiene. */
export function palette(p: { FG: number }, o: { FG?: string; F?: string; mu: string }) {
  const s = blatt(270, 'Palette auf Schiene'), y = 150;
  boden(s, 60, y + 40, 520, 14);
  schiene(s, 100, 540, y + 28);
  s.append(el('rect', { x: 200, y, width: 240, height: 28, ...GRAU }));
  s.append(el('rect', { x: 230, y: y - 46, width: 180, height: 46, rx: 3, ...HOLZ }));
  kl(s, 320, y - 18, 'Werkstück', { 'text-anchor': 'middle' });
  kraft(s, 320, y - 120, 320, y - 50, o.FG ?? `F_G = ${p.FG} N`, 330, y - 100);
  kraft(s, 120, y + 14, 196, y + 14, o.F ?? 'F = ?', 120, y + 6, { 'font-size': 14 });
  kraft(s, 450, y + 20, 520, y + 20);
  kt(s, 526, y + 24, 'F_R', { 'font-size': 15 });
  geschw(s, 250, y - 70, 180, y - 70, 'v', 170, y - 76, { 'text-anchor': 'end' });
  txt(s, 30, 30, o.mu, { 'font-size': 14 });
  return s;
}

/** Rutschkupplung mit Tellerfedern und zwei Reibflächen. */
export function rutschkupplung(p: { FN: number; d: number; mu: number }, o: { FN?: string; d?: string } = {}) {
  const s = blatt(300, 'Rutschkupplung'), cy = 150;
  s.append(el('rect', { x: 60, y: cy - 30, width: 520, height: 60, ...ROT }));
  mittellinie(s, 40, cy, 600, cy);
  [260, 400].forEach((x) => s.append(el('rect', { x: x - 6, y: cy - 90, width: 12, height: 60, ...GRAU })));
  s.append(el('rect', { x: 300, y: cy - 120, width: 60, height: 90, fill: C.STAHL, stroke: C.STAHLRAND }));
  kl(s, 330, cy - 128, 'Kettenrad', { 'text-anchor': 'middle', 'font-size': 12 });
  [290, 360].forEach((x) => s.append(el('rect', { x, y: cy - 100, width: 10, height: 62, fill: C.HOLZ, stroke: '#8a6a3a' })));
  for (let i = 0; i < 4; i++) s.append(el('path', { d: `M${226 + i * 8},${cy - 88} l6,10 l-6,10 l6,10 l-6,10 l6,10`, fill: 'none', stroke: '#555', 'stroke-width': 1.5 }));
  kl(s, 220, cy - 50, 'Tellerfedern', { 'text-anchor': 'end', 'font-size': 12 });
  kraft(s, 240, cy - 70, 284, cy - 70);
  kraft(s, 420, cy - 70, 376, cy - 70);
  kt(s, 426, cy - 66, o.FN ?? `F_N = ${fmt(p.FN)} kN`);
  massV(s, cy - 95, cy + 95, 600, o.d ?? `ø${p.d}`, 370);
  [290, 360].forEach((x) => s.append(el('rect', { x, y: cy + 38, width: 10, height: 57, fill: C.HOLZ, stroke: '#8a6a3a', opacity: 0.6 })));
  kl(s, 330, cy + 120, '2 Reibflächen (Kupplungsbeläge)', { 'text-anchor': 'middle', 'font-size': 12 });
  txt(s, 30, 30, `μ = ${fmt(p.mu)}`, { 'font-size': 14 });
  return s;
}

/** Laufrad auf einer Schiene. */
export function laufrad(p: { d: number; FN: number; f: number }, o: { FN?: string; FR?: string } = {}) {
  const s = blatt(290, 'Laufrad auf Schiene'), cx = 320, cy = 130, r = 90;
  schiene(s, 140, 500, cy + r);
  boden(s, 140, cy + r + 12, 360, 10);
  s.append(el('circle', { cx, cy, r, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 2 }));
  s.append(el('circle', { cx, cy, r: r - 14, fill: 'none', stroke: C.STAHLRAND }));
  bolzen(s, cx, cy);
  kraft(s, cx, 8, cx, cy - 6, o.FN ?? `F_N = ${p.FN} kN`, cx + 10, 28);
  kraft(s, cx + 20, cy + r - 4, cx + 90, cy + r - 4);
  kt(s, cx + 96, cy + r - 8, o.FR ?? 'F_R = ?', { 'font-size': 15 });
  massV(s, cy, cy + r, cx - r - 30, `r = ${p.d / 2}`, cx);
  txt(s, 30, 30, `f = ${fmt(p.f)} mm`, { 'font-size': 14 });
  return s;
}

/** Elektromagnetische Kupplung am Lüfter. */
export function luefter(p: { FN: number; d: number; mu: number }) {
  const s = blatt(290, 'Elektromagnetische Kupplung'), cy = 150;
  s.append(el('rect', { x: 60, y: cy - 28, width: 520, height: 56, ...ROT }));
  mittellinie(s, 40, cy, 600, cy);
  s.append(el('rect', { x: 220, y: cy - 110, width: 90, height: 220, fill: C.STAHL, stroke: C.STAHLRAND }));
  s.append(el('rect', { x: 320, y: cy - 110, width: 40, height: 220, fill: '#cfe0f3', stroke: C.STAHLRAND }));
  [cy - 100, cy + 80].forEach((y) => s.append(el('rect', { x: 310, y, width: 10, height: 20, fill: C.HOLZ, stroke: '#8a6a3a' })));
  [cy - 80, cy + 40].forEach((y) => {
    s.append(el('rect', { x: 240, y, width: 46, height: 40, fill: '#fff', stroke: '#c62828' }));
    for (let i = 0; i < 4; i++) line(s, 244, y + 6 + i * 9, 282, y + 6 + i * 9, { stroke: '#c62828' });
  });
  kl(s, 200, cy - 120, 'Ringmagnet', { 'text-anchor': 'end', 'font-size': 12 });
  kraft(s, 400, cy - 90, 326, cy - 90, `F_N = ${p.FN} N`, 404, cy - 98, { 'font-size': 13 });
  massV(s, cy - 90, cy + 90, 560, `ø${p.d}`, 330);
  kl(s, 330, cy + 134, 'Kupplungsbelag (1 Reibfläche)', { 'text-anchor': 'middle', 'font-size': 12 });
  kl(s, 520, cy + 50, 'Lüfterwelle', { 'font-size': 12 });
  txt(s, 30, 30, `μ = ${fmt(p.mu)}`, { 'font-size': 14 });
  return s;
}

/** Schlitten auf zwei Wälzkörpern. */
export function schlitten(p: { FG: number; a: number; b: number }, o: { FA?: string; FB?: string } = {}) {
  const s = blatt(300, 'Schlitten auf Wälzkörpern'), k = 380 / (p.a + p.b), xA = 130, xF = xA + p.a * k, xB = xF + p.b * k, y = 130;
  const h = ref(s, 'hat');
  s.append(el('rect', { x: 80, y: y - 80, width: 480, height: 60, fill: h, stroke: '#555' }));
  s.append(el('rect', { x: xA - 20, y: y - 20, width: 40, height: 12, fill: h, stroke: '#555' }));
  s.append(el('rect', { x: xB - 20, y: y - 20, width: 40, height: 12, fill: h, stroke: '#555' }));
  s.append(el('rect', { x: xA - 9, y: y - 8, width: 18, height: 16, fill: C.HOLZ, stroke: '#555' }));
  s.append(el('circle', { cx: xB, cy: y, r: 9, fill: C.HOLZ, stroke: '#555' }));
  s.append(el('rect', { x: 80, y: y + 10, width: 180, height: 40, fill: h, stroke: '#555' }));
  s.append(el('rect', { x: 400, y: y + 10, width: 160, height: 40, fill: h, stroke: '#555' }));
  kraft(s, xF, y - 60, xF, y + 40, `F_G = ${p.FG} N`, xF + 8, y + 30);
  kraft(s, xA, y + 110, xA, y + 14, o.FA ?? 'F_A = ?', xA + 10, y + 100);
  kraft(s, xB, y + 110, xB, y + 14, o.FB ?? 'F_B = ?', xB + 10, y + 100);
  massH(s, xA, xF, y - 98, `${p.a}`, y - 80);
  massH(s, xF, xB, y - 98, `${p.b}`, y - 80);
  kl(s, 600, y + 80, 'Wälzkörper', { 'text-anchor': 'end', 'font-size': 12 });
  return s;
}

/** Rollennaht-Schweissmaschine. */
export function schweiss(p: { d: number; FN: number; f: number }, o: { M?: string } = {}) {
  const s = blatt(300, 'Rollennaht-Schweissmaschine'), cx = 300, r = (p.d / 2) * 0.8, y = 150;
  s.append(el('rect', { x: 90, y: y - 4, width: 440, height: 8, fill: C.STAHL, stroke: C.STAHLRAND }));
  kl(s, 540, y + 22, 'Blechstreifen', { 'text-anchor': 'end', 'font-size': 12 });
  [y - 4 - r, y + 4 + r].forEach((cyy) => {
    s.append(el('circle', { cx, cy: cyy, r, ...HOLZ, 'stroke-width': 1.5 }));
    bolzen(s, cx, cyy);
  });
  kraft(s, cx - 60, y - 4 - r, cx - 60, y - 8);
  kt(s, cx - 68, y - 30, `F_N = ${fmt(p.FN)} kN`, { 'text-anchor': 'end' });
  kraft(s, cx - 60, y + 4 + r, cx - 60, y + 8);
  geschw(s, 430, y - 20, 500, y - 20, 'v', 504, y - 16);
  moment(s, cx, y + 4 + r, 22, true);
  gl(s, cx + r + 10, y + 4 + r + 6, o.M ?? 'M = ?');
  massH(s, cx - r, cx + r, 292, `ø${p.d}`, y + 4 + r);
  txt(s, 30, 30, `f = ${fmt(p.f)} cm`, { 'font-size': 14 });
  return s;
}

/** Zwei überlappte Flachstäbe mit zwei Schrauben. */
export function schraubenverbindung(p: { F: number; mu: number; n: number }, o: { FN?: string } = {}) {
  const s = blatt(270, 'Reibschlüssige Schraubenverbindung'), y = 130;
  s.append(el('rect', { x: 80, y, width: 320, height: 30, fill: C.STAHL, stroke: C.STAHLRAND }));
  s.append(el('rect', { x: 240, y: y - 30, width: 320, height: 30, fill: '#cfe0f3', stroke: C.STAHLRAND }));
  [300, 360].forEach((x) => {
    s.append(el('rect', { x: x - 12, y: y - 62, width: 24, height: 124, ...GRUEN }));
    s.append(el('rect', { x: x - 22, y: y - 62, width: 44, height: 20, ...GRUEN }));
    s.append(el('rect', { x: x - 22, y: y + 42, width: 44, height: 20, ...GRUEN }));
  });
  kraft(s, 330, y - 90, 330, y - 36);
  kt(s, 338, y - 74, o.FN ?? 'F_N = ? je Schraube');
  kraft(s, 90, y + 15, 30, y + 15);
  kt(s, 30, y + 50, `F = ${fmt(p.F)} kN`);
  kraft(s, 550, y - 15, 610, y - 15);
  kt(s, 610, y - 30, `F = ${fmt(p.F)} kN`, { 'text-anchor': 'end' });
  txt(s, 30, 30, `μ = ${fmt(p.mu)}, ${p.n} Schrauben, 1 Reibfläche`, { 'font-size': 14 });
  return s;
}

/** Getriebewelle in zwei Gleitlagern. */
export function getriebewelle(
  p: { F1: number; F2: number; a: number; b: number; l: number; dA: number; dB: number },
  o: { FA?: string; FB?: string } = {},
) {
  const s = blatt(310, 'Getriebewelle in Gleitlagern'), k = 440 / p.l, xA = 100, X = (v: number) => xA + v * k, y = 150;
  const x1 = X(p.a), x2 = X(p.a + p.b), xB = X(p.l);
  s.append(el('rect', { x: xA - 20, y: y - 22, width: xB - xA + 40, height: 44, rx: 6, ...ROT }));
  mittellinie(s, xA - 40, y, xB + 40, y);
  [[x1, 90], [x2, 70]].forEach(([x, r]) => s.append(el('rect', { x: x - 9, y: y - r, width: 18, height: 2 * r, fill: C.STAHL, stroke: C.STAHLRAND })));
  [xA, xB].forEach((x) => {
    s.append(el('rect', { x: x - 14, y: y + 22, width: 28, height: 16, fill: ref(s, 'hat'), stroke: '#555' }));
    s.append(el('rect', { x: x - 14, y: y - 38, width: 28, height: 16, fill: ref(s, 'hat'), stroke: '#555' }));
  });
  kraft(s, x1, y - 150, x1, y - 94, `F_1 = ${fmt(p.F1)} kN`, x1 + 8, y - 136);
  kraft(s, x2, y - 130, x2, y - 74, `F_2 = ${fmt(p.F2)} kN`, x2 + 8, y - 116);
  kraft(s, xA, y + 100, xA, y + 42, o.FA ?? 'F_A = ?', xA + 10, y + 90, { 'font-size': 13 });
  kraft(s, xB, y + 100, xB, y + 42, o.FB ?? 'F_B = ?', xB + 10, y + 90, { 'font-size': 13 });
  txt(s, xA, y - 46, 'A', { 'font-weight': 600, 'text-anchor': 'middle' });
  txt(s, xB, y - 46, 'B', { 'font-weight': 600, 'text-anchor': 'middle' });
  massH(s, xA, x1, y + 122, `${p.a}`, y + 40);
  massH(s, x1, x2, y + 122, `${p.b}`, y + 40);
  massH(s, xA, xB, y + 146, `${p.l}`, y + 40);
  kl(s, xA - 24, y - 60, `ø${p.dA}`, { fill: C.L, 'text-anchor': 'end' });
  kl(s, xB + 24, y - 60, `ø${p.dB}`, { fill: C.L });
  return s;
}

/** Schiebetor auf zwei Laufrollen. */
export function tor(p: { L: number; a: number; b: number; xs: number; FG: number; d: number; f: number }) {
  const s = blatt(300, 'Schiebetor auf zwei Rollen'), k = 440 / p.L, x0 = 100, X = (v: number) => x0 + v * k, yR = 230;
  const xA = X(p.a), xB = X(p.b), xS = X(p.xs);
  schiene(s, 60, 600, yR + 12);
  boden(s, 60, yR + 24, 540, 10);
  s.append(el('rect', { x: x0, y: 70, width: p.L * k, height: yR - 70 - 20, fill: 'none', stroke: '#555', 'stroke-width': 3 }));
  for (let x = x0 + 20; x < x0 + p.L * k; x += 22) line(s, x, 72, x, yR - 22, { stroke: '#888' });
  line(s, x0, yR - 20, x0 + p.L * k, yR - 20, { stroke: '#555', 'stroke-width': 6 });
  [xA, xB].forEach((x) => {
    s.append(el('circle', { cx: x, cy: yR - 2, r: 14, fill: C.STAHL, stroke: C.STAHLRAND }));
    bolzen(s, x, yR - 2);
  });
  txt(s, xA - 20, yR - 24, 'A', { 'font-weight': 600 });
  txt(s, xB + 8, yR - 24, 'B', { 'font-weight': 600 });
  kraft(s, xS, 110, xS, 170, `F_G = ${p.FG} N`, xS + 8, 130, { 'font-size': 13 });
  kraft(s, x0 - 10, 150, x0 - 70, 150, 'F = ?', x0 - 40, 138, { 'font-size': 13, 'text-anchor': 'middle' });
  massH(s, xA, xS, 40, `${fmt(p.xs - p.a)} m`, 110);
  massH(s, xA, xB, yR + 56, `${fmt(p.b - p.a)} m`, yR + 14);
  txt(s, 560, 30, `d = ${p.d} mm, f = ${fmt(p.f)} mm`, { 'font-size': 13, 'text-anchor': 'end' });
  return s;
}

/** Zwei Flächen mit Reibung: Vergleich Auflagefläche (Kiste hochkant und flach). */
export function kistenPaar(o: { m: string }) {
  const s = blatt(240, 'Kiste flach und hochkant');
  boden(s, 60, 190, 520, 14);
  s.append(el('rect', { x: 110, y: 130, width: 150, height: 60, rx: 4, fill: C.HOLZ, stroke: '#555' }));
  s.append(el('rect', { x: 390, y: 70, width: 60, height: 120, rx: 4, fill: C.HOLZ, stroke: '#555' }));
  kl(s, 185, 165, o.m, { 'text-anchor': 'middle' });
  kl(s, 420, 62, o.m, { 'text-anchor': 'middle' });
  kl(s, 185, 225, 'flach', { 'text-anchor': 'middle', fill: C.GRAU });
  kl(s, 420, 225, 'hochkant', { 'text-anchor': 'middle', fill: C.GRAU });
  kraft(s, 260, 160, 330, 160, 'F', 300, 150);
  kraft(s, 450, 160, 520, 160, 'F', 490, 150);
  return s;
}
