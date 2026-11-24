// Bauteilbilder für das Kapitel Umfangskraft.
import {
  C, balken, blatt, boden, bolzen, el, geschw, kiste, kraft, line, massH, massV, mittellinie, moment, radSeite, ref, scheibe, seil, txt, zahnrad,
} from '../../../core/draw/svg';
import { fmt } from '../../../core/zahl';

const gl = (s: SVGSVGElement, x: number, y: number, t: string, o: Record<string, string | number> = {}) =>
  txt(s, x, y, t, { fill: C.M, 'font-weight': 600, 'font-size': 14, ...o });

const grau = '#d7dbe2';
const gruen = { fill: '#b9d7a8', stroke: '#3b6d11' };

/** Rad mit Umfangskraft am Umfang (Riemenscheibe, Zahnrad oder Scheibe). */
export function rad(
  p: { d: number },
  o: { typ?: 'riemen' | 'zahn'; M: string; Fu: string; len?: number; dlab?: string },
) {
  const s = blatt(300, 'Rad mit Umfangskraft');
  const cx = 330, cy = 150, r = Math.max(45, Math.min(105, p.d * 0.4));
  if (o.typ === 'riemen') {
    line(s, cx, cy - r, 620, cy - r + 18, { stroke: '#444', 'stroke-width': 5 });
    line(s, cx, cy + r, 620, cy + r - 18, { stroke: '#444', 'stroke-width': 5 });
  }
  s.append(el('circle', { cx, cy, r, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.6 }));
  if (o.typ === 'zahn') {
    s.append(el('circle', { cx, cy, r: r + 7, fill: 'none', stroke: C.STAHLRAND, 'stroke-width': 1.2 }));
    s.append(el('circle', { cx, cy, r, fill: 'none', stroke: '#fff', 'stroke-dasharray': '10 3 2 3' }));
  }
  s.append(el('circle', { cx, cy, r: 14, fill: C.GESTELL, stroke: '#555' }));
  bolzen(s, cx, cy);
  const klein = r < 60;
  moment(s, cx, cy, klein ? 22 : 30, true);
  gl(s, cx, cy + r + 26, o.M, { 'text-anchor': 'middle', 'font-size': 15 });
  kraft(s, cx, cy - r, cx + (o.len ?? 95), cy - r, o.Fu, cx + 12, cy - r - 10);
  line(s, cx, cy, cx, cy - r, { stroke: C.L, 'stroke-width': 2.2, 'stroke-dasharray': '6 4' });
  txt(s, cx - 8, klein ? cy - r - 8 : cy - r / 2 - 4, 'd : 2', { fill: C.L, 'font-size': 13, 'text-anchor': 'end' });
  massV(s, cy - r, cy + r, cx - r - 45, o.dlab ?? `d = ${p.d}`, cx - 4);
  return s;
}

/** Zwei Zahnräder im Eingriff, gleiche Umfangskraft. */
export function paar(p: { d1: number; d2: number }, o: { M1: string; M2: string; Fu: string }) {
  const s = blatt(310, 'Zahnradpaar im Eingriff');
  const k = Math.min(360 / (p.d1 + p.d2), 230 / p.d2), r1 = (p.d1 * k) / 2, r2 = (p.d2 * k) / 2, cy = 150;
  const c1 = 175 + r1, c2 = c1 + r1 + r2;
  zahnrad(s, c1, cy, r1, 18, { fill: '#cfe0f3', h: 8 });
  zahnrad(s, c2, cy, r2, 36, { h: 8 });
  moment(s, c1, cy, 22, true);
  moment(s, c2, cy, 22, false);
  gl(s, c1 - r1 - 14, cy + 5, o.M1, { 'text-anchor': 'end' });
  gl(s, c2, cy + 42, o.M2, { 'text-anchor': 'middle' });
  kraft(s, c1 + r1, cy - 48, c1 + r1, cy + 6, o.Fu, c1 + r1 - 8, cy - r1 - 24, { 'text-anchor': 'end' });
  massH(s, c1 - r1, c1 + r1, cy + r2 + 34, `d_1 = ${p.d1}`, cy);
  massH(s, c2 - r2, c2 + r2, cy + r2 + 34, `d_2 = ${p.d2}`, cy);
  txt(s, c1 + r1 - 10, 20, 'Rad 1 (treibend)', { 'text-anchor': 'end', 'font-size': 13 });
  txt(s, c1 + r1 + 14, 20, 'Rad 2 (getrieben)', { 'font-size': 13 });
  return s;
}

/** Fahrradantrieb von der Kurbel bis zur Strasse. */
export function velo(p: { F: number; l: number; d1: number; d2: number; D: number }, o: { nurKette?: boolean } = {}) {
  const s = blatt(330, 'Fahrradantrieb mit Kurbel, Kette und Hinterrad');
  const c1 = 215, c2 = 445, cy = 170, R = 110, r1 = 42, r2 = 18, lk = 88;
  boden(s, 90, cy + R, 410, 14);
  s.append(el('circle', { cx: c2, cy, r: R, fill: 'none', stroke: '#444', 'stroke-width': 7 }));
  s.append(el('circle', { cx: c2, cy, r: R - 9, fill: 'none', stroke: '#999' }));
  line(s, c1, cy - r1, c2, cy - r2, { stroke: '#444', 'stroke-width': 3 });
  line(s, c1, cy + r1, c2, cy + r2, { stroke: '#444', 'stroke-width': 3 });
  s.append(el('circle', { cx: c1, cy, r: r1, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.4 }));
  s.append(el('circle', { cx: c2, cy, r: r2, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.4 }));
  balken(s, c1 - lk - 8, c1 + 6, cy, 11);
  s.append(el('rect', { x: c1 - lk - 20, y: cy - 7, width: 40, height: 10, rx: 3, fill: '#444' }));
  bolzen(s, c1, cy);
  bolzen(s, c2, cy);
  kraft(s, c1 - lk, cy - 70, c1 - lk, cy - 10, `F = ${p.F} N`, c1 - lk - 8, cy - 50, { 'text-anchor': 'end' });
  kraft(s, c2 - 70, cy - r2 - 13, c1 + 70, cy - r1 + 1 - 13, 'F_K = ?', (c1 + c2) / 2 - 10, cy - 72, { 'text-anchor': 'middle' });
  if (!o.nurKette) kraft(s, c2 + 6, cy + R + 7, c2 - 95, cy + R + 7, 'F_A = ?', c2 - 100, cy + R + 30);
  massH(s, c1 - lk, c1, cy + 70, `l = ${p.l}`, cy + 10);
  txt(s, 20, 24, `Kettenblatt d_1 = ${p.d1} · Ritzel d_2 = ${p.d2} · Hinterrad D = ${p.D}`, { 'font-size': 14, fill: C.L });
  return s;
}

/** Zahnradpaar mit Zähnezahlen und Modul. */
export function zahnradpaar(p: { z1: number; z2: number; M1: number; m?: number }, o: { Fu?: string; M2?: string } = {}) {
  const s = blatt(300, 'Zahnradgetriebe');
  const k = Math.min(2.2, 95 / p.z2), r1 = p.z1 * k, r2 = p.z2 * k, cy = 145, c1 = 170 + r1 * 0.2, c2 = c1 + r1 + r2;
  zahnrad(s, c1, cy, r1, p.z1, { fill: '#cfe0f3' });
  zahnrad(s, c2, cy, r2, p.z2);
  moment(s, c1, cy, Math.max(16, r1 * 0.6), true);
  moment(s, c2, cy, Math.max(18, r2 * 0.5), false);
  gl(s, c1 + r1, cy + r1 + 30, `M_1 = ${p.M1} Nm`, { 'text-anchor': 'end' });
  gl(s, c2, cy + r2 + 28, o.M2 ?? 'M_2 = ?', { 'text-anchor': 'middle' });
  txt(s, c1 - r1 - 6, cy - r1 - 6, `z_1 = ${p.z1}`, { 'text-anchor': 'end' });
  txt(s, c2 + r2 * 0.5, cy - r2 - 10, `z_2 = ${p.z2}`);
  if (o.Fu) kraft(s, c1 + r1, cy - 60, c1 + r1, cy - 4, o.Fu, c1 + r1 - 8, cy - 48, { 'text-anchor': 'end' });
  if (p.m) txt(s, 30, 30, `m = ${fmt(p.m)} mm`, { fill: C.L });
  return s;
}

/** Zahnriementrieb mit Spannrolle. */
export function zahnriemen(p: { z1: number; z2: number; M1: number }, o: { M2?: string } = {}) {
  const s = blatt(280, 'Zahnriementrieb mit Spannrolle');
  const r1 = p.z1 * 1.6, r2 = p.z2 * 1.9, c1 = 140, c2 = 440, cy = 120;
  const band = { stroke: '#444', 'stroke-width': 7, 'stroke-dasharray': '3 2' };
  line(s, c1, cy - r1, c2, cy - r2, band);
  const px = 300, pr = 26, py = cy + r1 + pr + 2, R = pr + 3;
  const L = [px - R * 0.5, py - R * 0.866], Rt = [px + R * 0.866, py - R * 0.5];
  line(s, c1, cy + r1, L[0], L[1], band);
  s.append(el('path', { d: `M${L[0]},${L[1]} A${R},${R} 0 0 1 ${Rt[0]},${Rt[1]}`, fill: 'none', ...band }));
  line(s, Rt[0], Rt[1], c2, cy + r2, band);
  zahnrad(s, c1, cy, r1, p.z1, { h: 5, fill: '#cfe0f3' });
  zahnrad(s, c2, cy, r2, p.z2, { h: 5 });
  scheibe(s, px, py, pr, { fill: grau });
  txt(s, px, py + pr + 18, 'Spannrolle (drückt von aussen)', { 'font-size': 12, 'text-anchor': 'middle' });
  moment(s, c1, cy, 20, true);
  moment(s, c2, cy, 40, true);
  txt(s, c1, cy - r1 - 12, `z_1 = ${p.z1}`, { 'text-anchor': 'middle' });
  txt(s, c2, cy - r2 - 14, `z_2 = ${p.z2}`, { 'text-anchor': 'middle' });
  gl(s, c1 - r1 - 12, cy + 5, `M_1 = ${p.M1} Nm`, { 'text-anchor': 'end' });
  gl(s, c2 + r2 + 8, cy + 6, o.M2 ?? 'M_2 = ?');
  return s;
}

/** Schneckengetriebe: Motor, Schnecke, Schneckenrad. */
export function schnecke(p: { z1: number; z2: number; n1: number; M2: number }, o: { M1?: string; n2?: string } = {}) {
  const s = blatt(290, 'Schneckengetriebe');
  const cx = 360, cy = 105, R = 80, yS = cy + R + 14;
  boden(s, 180, 268, 360, 10);
  s.append(el('rect', { x: 260, y: yS - 22, width: 200, height: 90, fill: grau, stroke: '#555' }));
  zahnrad(s, cx, cy, R, p.z2, { h: 5 });
  moment(s, cx, cy, 36, true);
  txt(s, cx + R + 12, cy - R + 10, `z_2 = ${p.z2}`);
  gl(s, cx + R + 12, cy + 10, `M_2 = ${p.M2} Nm`);
  gl(s, cx + R + 12, cy + 34, o.n2 ?? 'n_2 = ?');
  s.append(el('rect', { x: 300, y: yS - 12, width: 120, height: 24, rx: 4, fill: C.HOLZ, stroke: '#555' }));
  for (let x = 306; x < 416; x += 10) line(s, x, yS - 12, x + 8, yS + 12, { stroke: '#8a6a3a' });
  line(s, 180, yS, 300, yS, { stroke: '#555', 'stroke-width': 6 });
  s.append(el('rect', { x: 70, y: yS - 34, width: 110, height: 68, rx: 8, ...gruen }));
  txt(s, 125, yS + 52, 'Motor', { 'text-anchor': 'middle', 'font-size': 13 });
  gl(s, 70, yS - 44, `n_1 = ${p.n1}/min`);
  txt(s, 360, yS + 40, `z_1 = ${p.z1} (Schnecke)`, { 'text-anchor': 'middle', 'font-size': 13 });
  if (o.M1) gl(s, 70, yS + 74, o.M1);
  return s;
}

/** Montagepresse: Pinole (Zahnstange), grosses Rad, Antriebsrad. */
export function presse(p: { F: number; d: number; z1: number; mm: number }) {
  const s = blatt(310, 'Montagepresse mit Zahnstange und Zahnrädern');
  const xR = 150, cy = 120, R = (p.d / 2) * 1.1, c2 = xR + 12 + R, r1 = (p.z1 * p.mm * 1.1) / 2;
  const c1x = c2 + (R + r1) * 0.75, c1y = cy + (R + r1) * 0.66;
  [[60, 30], [60, 240]].forEach(([x, y]) => s.append(el('rect', { x, y, width: 40, height: 30, fill: ref(s, 'hat'), stroke: '#555' })));
  s.append(el('rect', { x: xR - 50, y: 10, width: 52, height: 280, fill: grau, stroke: '#555' }));
  for (let y = 20; y < 280; y += 12) line(s, xR + 2, y, xR + 10, y + 6, { stroke: '#555' });
  txt(s, xR - 24, 30, 'Pinole', { 'font-size': 12, 'text-anchor': 'middle' });
  zahnrad(s, c2, cy, R, 48, { h: 5 });
  zahnrad(s, c1x, c1y, r1, p.z1, { h: 5, fill: '#cfe0f3' });
  moment(s, c2, cy, 30, false);
  moment(s, c1x, c1y, Math.max(16, r1 * 0.6), true);
  gl(s, c2 + 8, cy - R - 8, 'M_2 = ?');
  gl(s, c1x + r1 + 8, c1y + 20, 'M_1 = ?');
  txt(s, c1x + r1 + 8, c1y - 4, `z_1 = ${p.z1}, m = ${fmt(p.mm)} mm`, { 'font-size': 13 });
  line(s, c2, cy, c2 + R * 0.7, cy - R * 0.7, { stroke: C.L, 'stroke-width': 1.5 });
  txt(s, c2 + R * 0.7 + 6, cy - R * 0.7 - 4, `ø${p.d}`, { fill: C.L, 'font-size': 13 });
  kraft(s, xR - 24, 300, xR - 24, 232);
  txt(s, xR + 16, 270, `F = ${fmt(p.F)} kN`, { fill: C.F, 'font-weight': 600, 'font-size': 14 });
  return s;
}

/** Kolbenverdichter mit Keilriemen. */
export function verdichter(p: { M1: number; d1: number; i: number }) {
  const s = blatt(315, 'Kolbenverdichter mit Keilriemenantrieb');
  const c1 = 170, cy = 130, R = 100, c2 = 470, r = R / p.i;
  boden(s, 40, 262, 560, 10);
  s.append(el('rect', { x: c2 - 50, y: cy + r - 4, width: 120, height: 262 - cy - r + 4, fill: grau, stroke: '#555' }));
  line(s, c1, cy - R, c2, cy - r, { stroke: '#444', 'stroke-width': 6 });
  line(s, c1, cy + R, c2, cy + r, { stroke: '#444', 'stroke-width': 6 });
  scheibe(s, c1, cy, R, { speichen: true });
  s.append(el('rect', { x: c2 - 6, y: cy - 46, width: 96, height: 92, rx: 8, ...gruen }));
  scheibe(s, c2, cy, r, { fill: '#cfe0f3' });
  txt(s, c2 + 46, cy - 54, 'Motor', { 'font-size': 13, 'text-anchor': 'middle' });
  txt(s, c1, 20, 'Kompressor (Schwungrad)', { 'font-size': 13, 'text-anchor': 'middle' });
  moment(s, c2, cy, r * 0.6, true);
  gl(s, c2 + 46, cy - 72, `M_1 = ${p.M1} Nm`, { 'text-anchor': 'middle' });
  kraft(s, 320, cy - R / 2 - 34, 390, cy - R / 2 - 46, 'F = ?', 330, cy - R / 2 - 50);
  gl(s, 24, 56, 'M_2 = ?');
  txt(s, 24, 80, `i = ${fmt(p.i)}`, { 'font-size': 14 });
  massH(s, c2 - r, c2 + r, 300, `d_w1 = ${p.d1}`, cy);
  return s;
}

/** Räderwinde: Kurbel, Ritzel, grosses Zahnrad mit Seiltrommel. */
export function winde(p: { dT: number; i: number; l1: number; FG?: number }, o: { F1?: string; FG?: string } = {}) {
  const s = blatt(345, 'Räderwinde mit Kurbel, Ritzel und Seiltrommel');
  const cx = 380, cy = 150, Rz = 105, Rt = (p.dT / 2) * 0.55, rp = Rz / p.i;
  const px = cx - Rz - rp, py = cy - 60, ang = Math.atan2(py - cy, px - cx);
  const pX = cx + (Rz + rp) * Math.cos(ang), pY = cy + (Rz + rp) * Math.sin(ang);
  zahnrad(s, cx, cy, Rz, 60, { h: 5, nabe: false });
  scheibe(s, cx, cy, Rt, { fill: C.HOLZ });
  zahnrad(s, pX, pY, rp, 18, { h: 5, fill: '#cfe0f3' });
  const L = 150;
  balken(s, pX - L - 10, pX + 8, pY, 11);
  s.append(el('circle', { cx: pX - L, cy: pY, r: 8, fill: '#444' }));
  kraft(s, pX - L, pY + 60, pX - L, pY + 8, o.F1 ?? 'F_1 = ?', pX - L + 10, pY + 48);
  massH(s, pX - L, pX, pY - 36, `l_1 = ${p.l1}`, pY - 8);
  gl(s, pX - L - 14, pY - 12, 'M_1 = ?', { 'text-anchor': 'end' });
  seil(s, cx + Rt, cy, cx + Rt, cy + 118);
  kiste(s, cx + Rt - 30, cy + 118, 60, 36);
  kraft(s, cx + Rt, cy + 156, cx + Rt, cy + 192, o.FG ?? `F_G = ${fmt(p.FG ?? 0)} kN`, cx + Rt + 10, cy + 186);
  moment(s, cx, cy, Rt * 0.6, false);
  gl(s, cx + Rz + 8, cy - Rz + 16, 'M_2 = ?');
  massV(s, cy - Rt, cy + Rt, cx - Rz - 20, `ø${p.dT}`, cx - 6);
  txt(s, cx + Rz - 30, cy + Rz + 10, `i = ${fmt(p.i)}`, { 'font-size': 14 });
  return s;
}

/** Pkw-Antrieb: Motor, Schaltgetriebe, Kardanwelle, Ausgleichsgetriebe, Rad. */
export function pkw(p: { M: number; n: number; rR: number }, o: { Fu?: string } = {}) {
  const s = blatt(260, 'Pkw-Antrieb');
  const yG = 230, rR = 40, xr = 480;
  boden(s, 20, yG, 600, 10);
  s.append(el('path', { d: `M60,${yG - 40} Q60,130 140,120 L220,80 Q300,60 400,80 L470,120 Q560,128 570,${yG - 40} Z`, fill: '#e6eef7', stroke: C.STAHLRAND, 'stroke-width': 1.5 }));
  [160, xr].forEach((x) => {
    s.append(el('circle', { cx: x, cy: yG - rR, r: rR, fill: '#444' }));
    s.append(el('circle', { cx: x, cy: yG - rR, r: 16, fill: '#bbb' }));
  });
  s.append(el('rect', { x: 90, y: 130, width: 60, height: 50, rx: 6, fill: C.STAHL, stroke: C.STAHLRAND }));
  txt(s, 120, 124, 'Motor', { 'font-size': 12, 'text-anchor': 'middle' });
  s.append(el('rect', { x: 150, y: 140, width: 40, height: 34, fill: '#cfe0f3', stroke: C.STAHLRAND }));
  txt(s, 170, 112, 'Schaltgetriebe i', { 'font-size': 12 });
  line(s, 190, 160, xr - 16, yG - rR, { stroke: '#555', 'stroke-width': 4 });
  txt(s, 300, 170, 'Kardanwelle', { 'font-size': 12 });
  s.append(el('circle', { cx: xr, cy: yG - rR, r: 12, fill: '#cfe0f3', stroke: C.STAHLRAND }));
  txt(s, xr - 10, 140, 'Ausgleichsgetriebe i_A', { 'font-size': 12, 'text-anchor': 'middle' });
  kraft(s, xr, yG - 2, xr + 70, yG - 2);
  txt(s, xr + 10, yG + 26, o.Fu ?? 'F_u = ?', { fill: C.F, 'font-weight': 600, 'font-size': 13 });
  massV(s, yG - rR, yG, xr + rR + 70, `r_R = ${p.rR}`, xr + 4);
  gl(s, 90, 40, `M = ${p.M} Nm bei n = ${p.n}/min`);
  return s;
}

/** Hubwerk mit zweistufigem Getriebe (Seitenansicht). */
export function hubwerk(p: { z1: number; z2: number; z3: number; z4: number; dT: number; n: number; FG: number }) {
  const s = blatt(335, 'Hubwerk mit zweistufigem Getriebe');
  const k = 0.9, r1 = p.z1 * k, r2 = p.z2 * k, r3 = p.z3 * k, r4 = p.z4 * k;
  const y3 = 80, y2 = y3 + r3 + r4, y1 = y2 + r1 + r2, xg1 = 330, xg2 = 430, rT = Math.min(58, (p.dT / 2) * 0.4);
  ([[y3, 40, xg1 + 30], [y2, xg1 - 30, xg2 + 30], [y1, xg2 - 30, 520]] as const).forEach(([y, a, b]) =>
    line(s, a, y, b, y, { stroke: '#555', 'stroke-width': 6 }));
  s.append(el('rect', { x: 60, y: y3 - rT, width: 110, height: 2 * rT, rx: 4, fill: C.HOLZ, stroke: '#555' }));
  for (let x = 66; x < 170; x += 8) line(s, x, y3 - rT, x, y3 + rT, { stroke: '#b0923f' });
  txt(s, 115, y3 - rT - 8, 'Seiltrommel', { 'font-size': 12, 'text-anchor': 'middle' });
  radSeite(s, xg1, y3, r4);
  radSeite(s, xg1, y2, r3, '#cfe0f3');
  radSeite(s, xg2, y2, r2);
  radSeite(s, xg2, y1, r1, '#cfe0f3');
  txt(s, xg1 + 14, y3 - r4 + 12, `z_4 = ${p.z4}`, { 'font-size': 13 });
  txt(s, xg1 - 14, y2 + 22, `z_3 = ${p.z3}`, { 'font-size': 13, 'text-anchor': 'end' });
  txt(s, xg2 + 14, y2 - r2 + 12, `z_2 = ${p.z2}`, { 'font-size': 13 });
  txt(s, xg2 - 14, y1 + 22, `z_1 = ${p.z1}`, { 'font-size': 13, 'text-anchor': 'end' });
  s.append(el('rect', { x: 500, y: y1 - 30, width: 110, height: 60, rx: 8, ...gruen }));
  txt(s, 555, y1 - 4, 'Motor', { 'font-size': 13, 'text-anchor': 'middle' });
  gl(s, 555, y1 + 16, `n = ${p.n}/min`, { 'font-size': 13, 'text-anchor': 'middle' });
  seil(s, 80, y3 + rT, 80, 268);
  kiste(s, 56, 268, 48, 32);
  kraft(s, 80, 302, 80, 332);
  txt(s, 92, 326, `F_G = ${fmt(p.FG)} kN`, { fill: C.F, 'font-weight': 600, 'font-size': 13 });
  geschw(s, 100, 240, 100, 200, 'v = ?', 108, 226, { 'font-size': 13 });
  massV(s, y3 - rT, y3 + rT, 34, `ø${p.dT}`, 60);
  gl(s, 200, y3 + rT + 30, 'M_T = ?');
  return s;
}

/** Welle mit Motor, Zahnrad und zwei Lagern. */
export function welle(p: { M: number; d: number; l: number; a: number }, o: { Fu?: string; RA?: string; RB?: string } = {}) {
  const s = blatt(315, 'Getriebewelle mit Zahnrad und zwei Lagern');
  const k = 380 / p.l, xA = 170, X = (v: number) => xA + v * k, xB = X(p.l), xZ = X(p.a), y = 170, R = Math.min(80, p.d * 0.5);
  boden(s, 40, 262, 560, 10);
  [xA, xB].forEach((x) => {
    s.append(el('rect', { x: x - 20, y: y + 14, width: 40, height: 262 - y - 14, fill: C.GESTELL, stroke: '#555' }));
    s.append(el('circle', { cx: x, cy: y, r: 16, fill: grau, stroke: '#555' }));
  });
  balken(s, xA - 56, xB + 40, y, 14);
  s.append(el('rect', { x: xZ - 14, y: y - R, width: 28, height: 2 * R, fill: C.STAHL, stroke: C.STAHLRAND }));
  for (let yy = y - R + 6; yy < y + R; yy += 8) line(s, xZ - 14, yy, xZ + 14, yy + 4, { stroke: C.STAHLRAND });
  s.append(el('rect', { x: xZ - 14, y: y - R - 50, width: 28, height: 50, fill: '#cfe0f3', stroke: C.STAHLRAND, 'stroke-dasharray': '4 3' }));
  txt(s, xZ + 22, y - R - 30, 'Gegenrad', { 'font-size': 12 });
  kraft(s, xZ + 30, y - R - 4, xZ + 30, y - R + 44, o.Fu ?? 'F_u = ?', xZ + 38, y - R + 30, { 'font-size': 13 });
  txt(s, xZ + 22, y + R - 6, `d = ${p.d} mm`, { fill: C.L, 'font-size': 13 });
  s.append(el('rect', { x: xA - 110, y: y - 26, width: 56, height: 52, rx: 6, ...gruen }));
  gl(s, xA - 82, y - 36, `M = ${p.M} Nm`, { 'text-anchor': 'middle', 'font-size': 13 });
  txt(s, xA - 6, y - 24, 'A', { 'font-weight': 600, 'text-anchor': 'end' });
  txt(s, xB + 6, y - 24, 'B', { 'font-weight': 600 });
  kraft(s, xA, y + 70, xA, y + 20, o.RA ?? 'F_A = ?', xA - 26, y + 62, { 'font-size': 13, 'text-anchor': 'end' });
  kraft(s, xB, y + 70, xB, y + 20, o.RB ?? 'F_B = ?', xB + 26, y + 62, { 'font-size': 13 });
  massH(s, xA, xZ, 298, `a = ${p.a}`, y + 16);
  massH(s, xA, xB, 30, `l = ${p.l}`, y - 16);
  return s;
}

/** Seiltrommel und Zahnrad auf einer Welle (Frontansicht). */
export function trommel(p: { d: number; d2: number; FG: number }, o: { Fu?: string; M?: string } = {}) {
  const s = blatt(345, 'Seiltrommel und Zahnrad auf einer Welle');
  const cx = 270, cy = 135, Rz = Math.max(70, Math.min(105, p.d2 * 0.22)), Rt = (Rz * p.d) / p.d2;
  zahnrad(s, cx, cy, Rz, 40, { nabe: false });
  scheibe(s, cx, cy, Rt, { fill: C.HOLZ });
  mittellinie(s, cx - Rz - 20, cy, cx + Rz + 20, cy);
  seil(s, cx + Rt, cy, cx + Rt, cy + 118);
  kiste(s, cx + Rt - 30, cy + 118, 60, 36);
  kraft(s, cx + Rt, cy + 156, cx + Rt, cy + 192, `F_G = ${p.FG} N`, cx + Rt + 10, cy + 186);
  kraft(s, cx + 90, cy - Rz, cx, cy - Rz, o.Fu ?? 'F_u = ?', cx + 20, cy - Rz - 12);
  moment(s, cx, cy, Math.max(20, Rt * 0.6), true);
  gl(s, cx - 10, cy + Rz + 26, o.M ?? 'M = ?', { 'text-anchor': 'end', 'font-size': 15 });
  massV(s, cy - Rz, cy + Rz, cx - Rz - 30, `d = ${p.d2}`, cx - 8);
  txt(s, 24, 28, `Seiltrommel d = ${p.d} mm`, { fill: C.L, 'font-size': 14 });
  return s;
}
