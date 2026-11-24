// Bauteilbilder für das Kapitel Bewegungen.
// Geschwindigkeit orange, Längen blau, Drehzahl grün (feste Farben).
import { C, blatt, boden, el, geschw, kiste, line, massH, massV, mittellinie, ref, seil, txt, bolzen } from '../../../core/draw/svg';

type S = SVGSVGElement;
type A = Record<string, string | number>;

const kl = (s: S, x: number, y: number, t: string, o: A = {}) => txt(s, x, y, t, { 'font-size': 13, ...o });
const GRAU = { fill: '#d7dbe2', stroke: '#555' };

/** Hebebühne mit Pkw. h = Höhe der Plattform (px über dem Boden). */
export function hebebuehne(o: { s?: string; t?: string; v?: string } = {}) {
  const s = blatt(280, 'Hebebühne');
  const yG = 250, h = 130;
  boden(s, 80, yG, 480, 12);
  [150, 470].forEach((x) => s.append(el('rect', { x: x - 8, y: 60, width: 16, height: yG - 60, fill: C.GESTELL, stroke: '#555' })));
  s.append(el('rect', { x: 170, y: yG - h, width: 280, height: 8, fill: '#777' }));
  s.append(el('path', { d: `M190,${yG - h} l10,-26 l60,-12 l120,0 l40,14 l20,24 z`, fill: '#cfe0f3', stroke: C.STAHLRAND }));
  [230, 400].forEach((x) => s.append(el('circle', { cx: x, cy: yG - h - 2, r: 12, fill: '#444' })));
  s.append(el('rect', { x: 170, y: yG - 8, width: 280, height: 8, fill: 'none', stroke: '#777', 'stroke-dasharray': '4 3' }));
  geschw(s, 520, yG - 20, 520, yG - h, o.v ?? 'v = ?', 530, yG - h / 2);
  massV(s, yG - h, yG, 110, o.s ?? 's', 142);
  if (o.t) txt(s, 250, 30, o.t, { 'font-size': 15 });
  return s;
}

/** Personenaufzug im Schacht. */
export function aufzugSchacht(o: { v?: string; s?: string; t?: string } = {}) {
  const s = blatt(300, 'Personenaufzug');
  s.append(el('rect', { x: 240, y: 10, width: 160, height: 280, fill: 'none', stroke: '#555', 'stroke-width': 2 }));
  for (let y = 40; y < 290; y += 40) line(s, 240, y, 252, y, { stroke: '#999' });
  s.append(el('rect', { x: 270, y: 70, width: 100, height: 70, rx: 4, fill: C.STAHL, stroke: C.STAHLRAND }));
  s.append(el('rect', { x: 270, y: 200, width: 100, height: 70, rx: 4, fill: 'none', stroke: '#777', 'stroke-dasharray': '6 4' }));
  seil(s, 320, 10, 320, 70);
  geschw(s, 420, 240, 420, 90, o.v ?? 'v', 430, 170);
  massV(s, 105, 235, 200, o.s ?? 's', 238);
  if (o.t) txt(s, 30, 40, o.t, { 'font-size': 15 });
  return s;
}

/** Welle in drei Stufen, links eingespannt, rechts der Drehmeissel. */
export function welle(o: { L1: number; L2: number; n: string; f: string; v?: string }) {
  const s = blatt(285, 'Welle drehen');
  const k = Math.min(2.6, 430 / (o.L1 + 40)), x0 = 560, yc = 130, xa = x0 - o.L1 * k, xb = x0 - o.L2 * k;
  s.append(el('rect', { x: xa - 40, y: yc - 55, width: 40, height: 110, fill: C.GESTELL, stroke: '#555' }));
  s.append(el('rect', { x: xa, y: yc - 40, width: xb - xa, height: 80, fill: C.STAHL, stroke: C.STAHLRAND }));
  s.append(el('rect', { x: xb, y: yc - 30, width: x0 - xb, height: 60, fill: C.STAHL, stroke: C.STAHLRAND }));
  mittellinie(s, xa - 50, yc, x0 + 20, yc);
  s.append(el('polygon', { points: `${x0 + 8},${yc - 32} ${x0 + 30},${yc - 60} ${x0 + 46},${yc - 60} ${x0 + 18},${yc - 32}`, fill: C.HOLZ, stroke: '#555' }));
  geschw(s, x0 + 40, yc - 72, x0 - 30, yc - 72, o.v ?? 'v_f = ?', x0 - 36, yc - 80, { 'text-anchor': 'end' });
  txt(s, xa - 20, yc - 68, o.n, { 'text-anchor': 'middle', fill: C.M, 'font-weight': 600 });
  massH(s, xa, x0, yc + 130, `${o.L1} mm`, yc + 42);
  massH(s, xb, x0, yc + 100, `${o.L2} mm`, yc + 32);
  txt(s, 30, 30, o.f, { 'font-size': 14 });
  return s;
}

/** Kastenprofil mit Nähten (dunkel) und Lücken. */
export function kasten(o: { L: number; a: number; v1: string; v2: string }) {
  const s = blatt(200, 'Kastenprofil');
  const k = 520 / o.L, x0 = 60, y = 90;
  s.append(el('rect', { x: x0, y: y - 18, width: o.L * k, height: 36, fill: C.STAHL, stroke: C.STAHLRAND }));
  for (let i = 0; i * o.a < o.L - 1e-9; i++) {
    if (i % 2 === 0) s.append(el('rect', { x: x0 + i * o.a * k, y: y - 22, width: o.a * k, height: 8, fill: '#555' }));
  }
  massH(s, x0, x0 + o.L * k, y + 60, `${o.L} mm`, y + 20);
  [0, 1, 2].forEach((i) => massH(s, x0 + i * o.a * k, x0 + (i + 1) * o.a * k, y - 44, `${o.a}`, y - 24));
  kl(s, x0, y + 92, `Dunkel: Schweissnaht (${o.v1}). Hell: Eilgang (${o.v2}).`);
  return s;
}

/** Walzenfräser von vorn mit z Zähnen. */
export function fraeser(o: { z: number; n: string; fz: string; v?: string }) {
  const s = blatt(270, 'Fräser');
  const cx = 320, cy = 120, r = 80, pts: string[] = [];
  for (let i = 0; i < 2 * o.z; i++) {
    const a = (i * Math.PI) / o.z, rr = i % 2 ? r : r + 14;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  s.append(el('polygon', { points: pts.join(' '), fill: C.HOLZ, stroke: '#555' }));
  s.append(el('circle', { cx, cy, r: 20, fill: C.GESTELL, stroke: '#555' }));
  bolzen(s, cx, cy);
  geschw(s, cx - 60, cy + 122, cx + 60, cy + 122, o.v ?? 'v_f', cx + 66, cy + 127);
  txt(s, 40, 40, `z = ${o.z} Zähne`, { 'font-size': 15 });
  txt(s, 40, 62, `${o.n}, ${o.fz}`, { 'font-size': 14, fill: C.M });
  return s;
}

/** Grundlochbohrung im Schnitt. t = Tiefe in mm. */
export function bohrung(o: { t: number; la: number; ls: number }) {
  const s = blatt(300, 'Grundlochbohrung');
  const k = 2.8, yT = 110, x = 320, d = 40;
  s.append(el('rect', { x: 200, y: yT, width: 240, height: o.t * k + 40, fill: ref(s, 'hat'), stroke: '#555' }));
  s.append(el('polygon', { points: `${x - d / 2},${yT} ${x + d / 2},${yT} ${x + d / 2},${yT + o.t * k} ${x},${yT + o.t * k + 12} ${x - d / 2},${yT + o.t * k}`, fill: '#fff', stroke: '#555' }));
  s.append(el('rect', { x: x - d / 2 + 3, y: 20, width: d - 6, height: yT - 30, fill: C.HOLZ, stroke: '#555' }));
  geschw(s, x + 40, 30, x + 40, 80, 'v_f', x + 46, 60);
  massV(s, yT, yT + o.t * k, 180, `${o.t} mm`, x - d / 2);
  kl(s, 460, yT + 4, `Anschnitt ${o.ls} mm`, { fill: C.L });
  kl(s, 460, yT + 24, `Anlauf ${o.la} mm`, { fill: C.L });
  return s;
}

/** Runde Scheibe (Schleifscheibe, Rad, Riemenscheibe, Walze, Trommel) mit Drehzahl, Durchmesser und Umfangsgeschwindigkeit. */
export function rund(o: { name?: string; fill?: string; n?: string; d?: string; v?: string; seil?: boolean }) {
  const s = blatt(290, o.name ?? 'Scheibe');
  const cx = 300, cy = 150, r = 95;
  s.append(el('circle', { cx, cy, r, fill: o.fill ?? C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.6 }));
  s.append(el('circle', { cx, cy, r: 16, fill: C.GESTELL, stroke: '#555' }));
  bolzen(s, cx, cy);
  // Drehpfeil (Drehzahl, grün)
  const rr = 42, a1 = (-150 * Math.PI) / 180, a2 = (-30 * Math.PI) / 180;
  s.append(el('path', {
    d: `M${cx + rr * Math.cos(a1)},${cy + rr * Math.sin(a1)} A${rr},${rr} 0 0 1 ${cx + rr * Math.cos(a2)},${cy + rr * Math.sin(a2)}`,
    fill: 'none', stroke: C.M, 'stroke-width': 2.5, 'marker-end': ref(s, 'M'),
  }));
  if (o.n) txt(s, cx, cy + 66, o.n, { 'text-anchor': 'middle', fill: C.M, 'font-weight': 600 });
  if (o.seil) {
    seil(s, cx + r, cy, cx + r, cy + 130);
    geschw(s, cx + r + 16, cy + 120, cx + r + 16, cy + 40, o.v ?? 'v', cx + r + 24, cy + 90);
  } else {
    geschw(s, cx, cy - r, cx + 120, cy - r, o.v ?? 'v', cx + 12, cy - r - 10);
  }
  if (o.d) massV(s, cy - r, cy + r, cx - r - 50, o.d, cx - 8);
  if (o.name) txt(s, 30, 30, o.name, { 'font-size': 15, 'font-weight': 600 });
  return s;
}

/** Hallenkran: Last wird gehoben (v_H) und gefahren (v_W). res = resultierende Geschwindigkeit zeigen. */
export function hallenkran(o: { vH: number; vW: number; res?: boolean; labH?: string; labW?: string; labR?: string }) {
  const s = blatt(300, 'Hallenkran');
  const yB = 78, xc = 200;
  [[44, 70], [570, 596]].forEach(([a, b]) => s.append(el('rect', { x: a, y: yB, width: b - a, height: 300 - yB, fill: ref(s, 'hat'), stroke: '#555' })));
  boden(s, 20, 288, 600, 12);
  s.append(el('rect', { x: 60, y: yB - 14, width: 520, height: 22, rx: 3, fill: C.HOLZ, stroke: '#8a6a3a', 'stroke-width': 1.5 }));
  s.append(el('rect', { x: xc - 22, y: yB - 34, width: 44, height: 16, rx: 3, ...GRAU }));
  [xc - 12, xc + 12].forEach((c) => s.append(el('circle', { cx: c, cy: yB - 16, r: 4, ...GRAU })));
  const hy = yB + 120;
  seil(s, xc, yB + 8, xc, hy);
  kiste(s, xc - 20, hy + 10, 40, 40);
  const k = 5, x0 = xc + 26, y0 = hy + 30, mx = o.vW * k, my = o.vH * k;
  geschw(s, x0, y0, x0 + mx, y0, o.labW ?? `v_W = ${o.vW} m/min`, x0 + 4, y0 + 18);
  geschw(s, x0, y0, x0, y0 - my, o.labH ?? `v_H = ${o.vH} m/min`, x0 + 6, y0 - my - 6);
  if (o.res) {
    line(s, x0, y0, x0 + mx, y0 - my, { stroke: C.V, 'stroke-width': 4, 'marker-end': ref(s, 'V') });
    line(s, x0 + mx, y0, x0 + mx, y0 - my, { stroke: C.GRAU, 'stroke-dasharray': '4 3' });
    line(s, x0, y0 - my, x0 + mx, y0 - my, { stroke: C.GRAU, 'stroke-dasharray': '4 3' });
    txt(s, x0 + mx + 10, y0 - my + 18, o.labR ?? 'v', { fill: C.V, 'font-weight': 600 });
  }
  const al = Math.atan2(o.vH, o.vW);
  s.append(el('path', { d: `M${x0 + 40},${y0} A40,40 0 0 0 ${x0 + 40 * Math.cos(al)},${y0 - 40 * Math.sin(al)}`, fill: 'none', stroke: C.INK }));
  txt(s, x0 + 46, y0 - 8, 'α', { 'font-size': 14 });
  return s;
}

/** Förderband mit Paket. */
export function foerderband(o: { v: string; s?: string }) {
  const s = blatt(200, 'Förderband');
  s.append(el('rect', { x: 80, y: 110, width: 480, height: 24, rx: 12, fill: '#bbb', stroke: '#444' }));
  [92, 548].forEach((x) => s.append(el('circle', { cx: x, cy: 122, r: 11, fill: C.STAHL, stroke: C.STAHLRAND })));
  kiste(s, 120, 74, 40, 36);
  geschw(s, 170, 90, 250, 90, o.v, 176, 80);
  if (o.s) massH(s, 92, 548, 170, o.s, 136);
  return s;
}

/** Boot quer über den Fluss, Strömung nach rechts. */
export function fluss(o: { vB: string; vS: string; b: string }) {
  const s = blatt(260, 'Boot im Fluss');
  s.append(el('rect', { x: 60, y: 40, width: 520, height: 180, fill: '#cfe3f5' }));
  line(s, 60, 40, 580, 40, { stroke: '#3b6d11', 'stroke-width': 4 });
  line(s, 60, 220, 580, 220, { stroke: '#3b6d11', 'stroke-width': 4 });
  s.append(el('polygon', { points: '180,215 200,190 220,215', fill: C.HOLZ, stroke: '#555' }));
  geschw(s, 200, 188, 200, 110, o.vB, 208, 140);
  geschw(s, 206, 200, 290, 200, o.vS, 296, 204);
  [110, 400, 500].forEach((x) => geschw(s, x, 130, x + 40, 130));
  massV(s, 40, 220, 30, o.b, 60);
  return s;
}

/** Säulen für Vergleiche (z. B. v am Umfang bei verschiedenen Durchmessern). */
export { saeulen } from '../../../core/draw/svg';
