// Bauteilbilder für das Kapitel Drehmoment und Hebelgesetz.
import {
  C, balken, blatt, boden, bolzen, drehbock, el, kiste, kraft, line, massH, massV, moment, sechskant, txt,
} from '../../../core/draw/svg';
import { fmt } from '../../../core/zahl';

export function schluessel(p: { F?: number; l: number; M?: number }, gesucht: 'M' | 'F') {
  const s = blatt(260, 'Schraubenschlüssel mit Kraft am Hebelende');
  const cx = 160, cy = 150, x = cx + p.l;
  balken(s, cx - 6, x + 18, cy, 18);
  sechskant(s, cx, cy);
  bolzen(s, cx, cy);
  txt(s, cx - 40, cy + 6, 'D', { 'font-weight': 600 });
  kraft(s, x, cy + 10, x, cy + 80, gesucht === 'F' ? 'F = ?' : `F = ${p.F} N`, x + 10, cy + 60);
  massH(s, cx, x, cy - 58, `l = ${p.l} mm`, cy - 26, cy - 12);
  moment(s, cx, cy, 38, true);
  txt(s, cx - 46, cy - 34, gesucht === 'M' ? 'M = ?' : `M = ${p.M} Nm`, { fill: C.M, 'font-weight': 600, 'text-anchor': 'end' });
  return s;
}

export function schraeg(p: { F: number; L: number; al: number }, zeigeL: boolean) {
  const s = blatt(300, 'Schlüssel mit schräger Kraft und wirksamem Hebelarm');
  const cx = 120, cy = 70, L = p.L, a = (p.al * Math.PI) / 180, ex = cx + L, ux = -Math.cos(a), uy = Math.sin(a);
  balken(s, cx - 6, ex + 16, cy, 18);
  sechskant(s, cx, cy);
  bolzen(s, cx, cy);
  txt(s, cx - 42, cy + 6, 'D', { 'font-weight': 600 });
  const t = L * Math.cos(a), fx = ex + ux * t, fy = cy + uy * t;
  line(s, ex - ux * 45, cy - uy * 45, fx + ux * 25, fy + uy * 25, { stroke: C.F, 'stroke-dasharray': '6 4' });
  txt(s, ex - ux * 45 + 6, cy - uy * 45 + 4, 'Wirkungslinie', { fill: C.F, 'font-size': 13 });
  kraft(s, ex, cy, ex + ux * 80, cy + uy * 80, `F = ${p.F} N`, ex + ux * 80 + 14, cy + uy * 80 + 12);
  line(s, cx, cy, fx, fy, { stroke: C.L, 'stroke-width': 2.5, 'stroke-dasharray': '7 4' });
  const n = 9, h = Math.hypot(cx - fx, cy - fy), wx = (cx - fx) / h, wy = (cy - fy) / h;
  s.append(el('polyline', {
    points: `${fx - ux * n},${fy - uy * n} ${fx - ux * n + wx * n},${fy - uy * n + wy * n} ${fx + wx * n},${fy + wy * n}`,
    fill: 'none', stroke: C.L,
  }));
  txt(s, (cx + fx) / 2 - 10, (cy + fy) / 2 + 22, zeigeL ? `l = ${fmt(L * Math.sin(a))} mm` : 'l = ?', { fill: C.L, 'font-weight': 600, 'text-anchor': 'end' });
  massH(s, cx, ex, cy - 42, `L = ${L} mm`, cy - 22, cy - 12);
  s.append(el('path', { d: `M${ex - 38},${cy} A38,38 0 0 0 ${ex + ux * 38},${cy + uy * 38}`, fill: 'none', stroke: C.INK }));
  txt(s, ex - 58, cy + 24, `α = ${p.al}°`, { 'font-size': 14, 'text-anchor': 'end' });
  return s;
}

type Rechts = [len: number, lab: string];
export function hebel(
  p: { l1: number; lr: number },
  o: { kiste?: boolean; f1: string; d1: string; rechts: Rechts[]; masse: [len: number, lab: string, reihe: number][] },
) {
  const s = blatt(280, 'Zweiseitiger Hebel auf Drehbock');
  const y = 150, x0 = 90, k = 460 / (p.l1 + p.lr), xD = x0 + p.l1 * k;
  boden(s, xD - 70, y + 52, 140, 14);
  drehbock(s, xD, y + 7);
  balken(s, x0 - 16, x0 + 460 + 16, y);
  bolzen(s, xD, y);
  txt(s, xD - 6, y + 40, 'D', { 'font-weight': 600, fill: '#fff', 'font-size': 14 });
  if (o.kiste) kiste(s, x0 - 28, y - 7 - 42, 56, 42);
  kraft(s, x0, y + 9, x0, y + 78, o.f1, x0 - 10, y + 100, { 'text-anchor': 'middle' });
  o.rechts.forEach(([len, lab]) => {
    const x = xD + len * k, nah = Math.abs(x - xD) < 90;
    kraft(s, x, y + 9, x, y + 78, lab, x + 10, nah ? y + 98 : y + 70, x > 520 ? { 'text-anchor': 'end', dx: -20 } : {});
  });
  massH(s, x0, xD, y - 70, o.d1, y - 12);
  o.masse.forEach(([len, lab, reihe]) => massH(s, xD, xD + len * k, y - 70 - reihe * 26, lab, y - 12));
  return s;
}

export function schubkarre(p: { m: number; l1: number; l2: number }) {
  const s = blatt(290, 'Schubkarre mit Last');
  const y = 180, x0 = 110, k = 440 / 1400, xL = x0 + p.l1 * k, xH = x0 + p.l2 * k;
  boden(s, 40, y + 30, 340, 13);
  s.append(el('circle', { cx: x0, cy: y, r: 30, fill: '#555', stroke: '#222' }));
  s.append(el('circle', { cx: x0, cy: y, r: 17, fill: '#ddd' }));
  balken(s, x0 - 8, xH + 16, y);
  s.append(el('polygon', { points: `${xL - 55},${y - 7} ${xL + 55},${y - 7} ${xL + 68},${y - 62} ${xL - 68},${y - 62}`, fill: C.HOLZ, stroke: '#555' }));
  s.append(el('rect', { x: xH - 4, y: y - 13, width: 26, height: 26, rx: 6, fill: '#444' }));
  bolzen(s, x0, y);
  txt(s, x0 - 52, y + 6, 'D', { 'font-weight': 600 });
  kraft(s, xL, y - 40, xL, y + 26, 'F_G = ?', xL + 10, y - 25);
  txt(s, xL + 12, y - 70, `m = ${p.m} kg`, { 'font-size': 14 });
  kraft(s, xH, y + 85, xH, y + 12, 'F = ?', xH + 12, y + 70);
  massH(s, x0, xL, y - 100, `l_1 = ${p.l1}`, y - 35, y - 64);
  massH(s, x0, xH, y - 128, `l_2 = ${p.l2}`, y - 35, y - 16);
  return s;
}

export function pedal(p: { FP: number; l1: number; l2: number }) {
  const s = blatt(330, 'Bremspedal mit Hauptzylinder');
  const xD = 260, yD = 48, k = 0.8, yr = yD + p.l2 * k, yb = yD + p.l1 * k;
  boden(s, 232, 10, 85, 22);
  s.append(el('polygon', { points: `${xD - 16},32 ${xD + 16},32 ${xD},${yD}`, fill: C.GESTELL, stroke: '#555' }));
  s.append(el('rect', { x: xD, y: yr - 3, width: 95, height: 6, fill: '#888', stroke: '#444' }));
  s.append(el('rect', { x: xD + 85, y: yr - 13, width: 95, height: 26, rx: 3, fill: '#cfe0f3', stroke: C.STAHLRAND }));
  s.append(el('rect', { x: xD + 90, y: yr - 11, width: 8, height: 22, fill: '#555' }));
  txt(s, xD + 190, yr + 5, 'zur Bremse', { 'font-size': 13 });
  txt(s, xD + 88, yr + 30, 'Hauptzylinder', { 'font-size': 13 });
  s.append(el('rect', { x: xD - 8, y: yD - 8, width: 16, height: yb - yD + 22, rx: 8, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.3 }));
  s.append(el('rect', { x: xD - 22, y: yb - 20, width: 13, height: 40, rx: 4, fill: '#444' }));
  bolzen(s, xD, yD);
  bolzen(s, xD, yr);
  txt(s, xD + 14, yD + 2, 'D', { 'font-weight': 600 });
  kraft(s, xD + 14, yr - 16, xD + 78, yr - 16, 'F_K = ?', xD + 16, yr - 24);
  kraft(s, xD - 110, yb, xD - 25, yb, `F_P = ${p.FP} N`, xD - 150, yb - 10);
  massV(s, yD, yr, xD - 40, `l_2 = ${p.l2}`, xD - 10);
  massV(s, yD, yb, xD - 75, `l_1 = ${p.l1}`, xD - 24);
  return s;
}

export function winde(p: { FG: number; L: number; R: number }) {
  const s = blatt(330, 'Seilwinde mit Handkurbel');
  const cx = 390, cy = 135, k = 0.5, R = p.R * k, xh = cx - p.L * k, xr = cx + R;
  boden(s, 300, 285, 105, 14);
  s.append(el('polygon', { points: `${cx - 34},285 ${cx + 14},285 ${cx + 8},${cy} ${cx - 8},${cy}`, fill: C.GESTELL, stroke: '#555' }));
  s.append(el('circle', { cx, cy, r: R, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.5 }));
  balken(s, xh - 8, cx + 8, cy, 13);
  s.append(el('rect', { x: xh - 7, y: cy - 2, width: 14, height: 40, rx: 5, fill: '#444' }));
  bolzen(s, cx, cy);
  txt(s, cx - 14, cy + 30, 'Trommel', { 'font-size': 13 });
  txt(s, xh + 24, cy + 30, 'Kurbel', { 'font-size': 13 });
  line(s, xr, cy, xr, 220, { 'stroke-width': 1.6 });
  kiste(s, xr - 22, 220, 44, 36);
  kraft(s, xr, 256, xr, 312, `F_G = ${p.FG} N`, xr + 10, 300);
  kraft(s, xh, cy - 62, xh, cy - 10, 'F_H = ?', xh - 70, cy - 40);
  massH(s, xh, cx, 40, `L = ${p.L}`, cy - 66, cy - R - 4);
  massH(s, cx, xr, 62, `R = ${p.R}`, cy - R - 4, cy - 4, { aussen: true });
  return s;
}

export function ventil(p: { p: number; d: number; a: number; b: number }) {
  const s = blatt(300, 'Sicherheitsventil mit Hebel und Gewicht');
  const xD = 110, y = 112, k = 0.7, xv = xD + p.a * k, xw = xD + p.b * k;
  s.append(el('rect', { x: 60, y: 180, width: 300, height: 84, fill: '#cfe0f3', stroke: C.STAHLRAND }));
  boden(s, 60, 165, xv - 18 - 60, 16);
  boden(s, xv + 18, 165, 360 - xv - 18, 16);
  drehbock(s, xD, y + 7, 46);
  s.append(el('rect', { x: xv - 4, y: y + 6, width: 8, height: 46, fill: C.STAHL, stroke: C.STAHLRAND }));
  s.append(el('rect', { x: xv - 20, y: y + 50, width: 40, height: 9, fill: C.STAHL, stroke: C.STAHLRAND }));
  balken(s, xD - 14, xw + 18, y);
  bolzen(s, xD, y);
  bolzen(s, xv, y);
  bolzen(s, xw, y);
  txt(s, xD - 40, y + 6, 'D', { 'font-weight': 600 });
  txt(s, 70, 222, 'Dampfkessel');
  txt(s, 70, 244, `p = ${p.p} bar`);
  kraft(s, xv, 250, xv, 188, 'F_V = ?', xv + 12, 236);
  txt(s, xv + 30, y + 48, `Ventil ⌀ d = ${p.d}`, { 'font-size': 14 });
  line(s, xw, y + 6, xw, 150, { 'stroke-width': 1.6 });
  kiste(s, xw - 20, 150, 40, 50);
  kraft(s, xw, 200, xw, 262, 'F_G = ?', xw + 12, 250);
  massH(s, xD, xv, y - 36, `a = ${p.a}`, y - 12);
  massH(s, xD, xw, y - 64, `b = ${p.b}`, y - 12);
  return s;
}
