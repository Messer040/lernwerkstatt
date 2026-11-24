// Bauteilbilder für das Kapitel «Umfangskraft».
import { C, balken, blatt, bolzen, boden, el, kiste, kraft, line, massH, massV, moment, ref, seil, txt } from '../../../core/draw/svg';
import { fmt } from '../../../core/zahl';

type S = SVGSVGElement;
type A = Record<string, string | number>;

/** Drehmoment- oder Drehzahlbeschriftung (grün). */
const gl = (s: S, x: number, y: number, t: string, o: A = {}) => txt(s, x, y, t, { fill: C.M, 'font-weight': 600, 'font-size': 14, ...o });

/** Geschwindigkeitspfeil (orange). */
function tempo(s: S, x1: number, y1: number, x2: number, y2: number, lab: string, lx: number, ly: number, o: A = {}) {
  line(s, x1, y1, x2, y2, { stroke: C.V, 'stroke-width': 3, 'marker-end': ref(s, 'V') });
  if (lab) txt(s, lx, ly, lab, { fill: C.V, 'font-weight': 600, 'font-size': 13, ...o });
}

/** Zahnrad mit Zähnen (z Zähne, Teilkreisradius r). */
function zahnrad(s: S, cx: number, cy: number, r: number, z: number, o: { h?: number; fill?: string; nabe?: boolean } = {}) {
  const n = Math.max(8, Math.min(46, z)), h = o.h ?? 6, pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a0 = (i * 2 * Math.PI) / n, da = (2 * Math.PI) / n;
    [[0, r - h / 2], [0.18, r + h / 2], [0.5, r + h / 2], [0.68, r - h / 2]].forEach(([f, rr]) =>
      pts.push(`${(cx + rr * Math.cos(a0 + f * da)).toFixed(1)},${(cy + rr * Math.sin(a0 + f * da)).toFixed(1)}`));
  }
  s.append(el('polygon', { points: pts.join(' '), fill: o.fill ?? C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.2 }));
  s.append(el('circle', { cx, cy, r: r - h / 2 - 1, fill: 'none', stroke: '#fff', 'stroke-dasharray': '8 3 2 3' }));
  if (o.nabe !== false) {
    s.append(el('circle', { cx, cy, r: Math.min(12, r * 0.3), fill: C.GESTELL, stroke: '#555' }));
    bolzen(s, cx, cy);
  }
}

/** Scheibe (Riemen, Rad), optional mit Speichen. */
function scheibe(s: S, cx: number, cy: number, r: number, o: { fill?: string; speichen?: boolean } = {}) {
  s.append(el('circle', { cx, cy, r, fill: o.fill ?? C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.4 }));
  if (o.speichen)
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      line(s, cx + 14 * Math.cos(a), cy + 14 * Math.sin(a), cx + (r - 8) * Math.cos(a), cy + (r - 8) * Math.sin(a), { stroke: C.STAHLRAND, 'stroke-width': 4 });
    }
  s.append(el('circle', { cx, cy, r: Math.min(14, r * 0.35), fill: C.GESTELL, stroke: '#555' }));
  bolzen(s, cx, cy);
}

/** Zahnrad in Seitenansicht (Getriebe von der Seite). */
function seite(s: S, x: number, y: number, r: number, fill?: string) {
  s.append(el('rect', { x: x - 8, y: y - r, width: 16, height: 2 * r, fill: fill ?? C.STAHL, stroke: C.STAHLRAND }));
  for (let yy = y - r + 4; yy < y + r - 2; yy += 6) line(s, x - 8, yy, x + 8, yy + 3, { stroke: C.STAHLRAND, 'stroke-width': 0.7 });
}

const motor = (s: S, x: number, y: number, w: number, h: number) =>
  s.append(el('rect', { x, y, width: w, height: h, rx: 8, fill: '#b9d7a8', stroke: '#3b6d11' }));

// ---------- Rad, Paar ----------

export function rad(p: { d: number }, o: { typ: 'riemen' | 'zahn'; M: string; Fu: string; len?: number; dlab?: string }) {
  const s = blatt(300, 'Rad mit Umfangskraft am Umfang');
  const cx = 330, cy = 160, r = Math.max(45, Math.min(105, p.d * 0.4));
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
  moment(s, cx, cy, Math.min(30, r * 0.5), true);
  gl(s, cx, cy + r + 26, o.M, { 'text-anchor': 'middle' });
  kraft(s, cx, cy - r, cx + (o.len ?? 95), cy - r, o.Fu, cx + 12, cy - r - 10);
  line(s, cx, cy, cx, cy - r, { stroke: C.L, 'stroke-width': 2.2, 'stroke-dasharray': '6 4' });
  txt(s, cx - 8, r >= 80 ? cy - r / 2 - 4 : cy - r - 8, 'd : 2', { fill: C.L, 'font-size': 13, 'text-anchor': 'end' });
  massV(s, cy - r, cy + r, cx - r - 45, o.dlab ?? `d = ${p.d}`, cx - 4);
  return s;
}

export function paar(p: { d1: number; d2: number }, o: { M1: string; M2: string; Fu: string }) {
  const s = blatt(310, 'Zwei Zahnräder im Eingriff');
  const k = Math.min(360 / (p.d1 + p.d2), 230 / p.d2), r1 = (p.d1 * k) / 2, r2 = (p.d2 * k) / 2, cy = 150, c1 = 175 + r1, c2 = c1 + r1 + r2;
  [[c1, r1], [c2, r2]].forEach(([c, r]) => {
    s.append(el('circle', { cx: c, cy, r: r + 6, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.3 }));
    s.append(el('circle', { cx: c, cy, r, fill: 'none', stroke: '#fff', 'stroke-dasharray': '10 3 2 3' }));
    s.append(el('circle', { cx: c, cy, r: 9, fill: C.GESTELL, stroke: '#555' }));
    bolzen(s, c, cy);
  });
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

// ---------- Velo ----------

export function velo(p: { F: number; l: number; d1: number; d2: number; D: number }, o: { FK?: string; FA?: string; M1?: string } = {}) {
  const s = blatt(330, 'Fahrradantrieb mit Kurbel, Kette und Hinterrad');
  const c1 = 215, c2 = 445, cy = 170, R = 110, r1 = 42, r2 = 18, lk = 88;
  boden(s, 90, cy + R, 500, 14);
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
  kraft(s, c2 - 70, cy - r2 - 13, c1 + 70, cy - r1 + 1 - 13, o.FK ?? 'F_K = ?', (c1 + c2) / 2 - 10, cy - 72, { 'text-anchor': 'middle' });
  kraft(s, c2 + 6, cy + R + 7, c2 - 95, cy + R + 7, o.FA ?? 'F_A = ?', c2 - 100, cy + R + 30);
  massH(s, c1 - lk, c1, cy + 70, `l = ${p.l}`, cy + 10);
  txt(s, 20, 24, `Kettenblatt d_1 = ${p.d1} · Ritzel d_2 = ${p.d2} · Hinterrad D = ${p.D}`, { 'font-size': 14, fill: C.L });
  return s;
}

// ---------- Buch-Aufgaben ----------

export function zahnpaar(p: { z1: number; z2: number; m: number; M1: number }, o: { M1?: string; M2?: string; Fu?: string; z2?: string } = {}) {
  const s = blatt(300, 'Zahnradgetriebe mit Ritzel und Rad');
  const k = Math.min(2.2, 95 / p.z2), r1 = p.z1 * k, r2 = p.z2 * k, cy = 145, c1 = 170 + r1 * 0.2, c2 = c1 + r1 + r2;
  zahnrad(s, c1, cy, r1, p.z1, { fill: '#cfe0f3' });
  zahnrad(s, c2, cy, r2, p.z2);
  moment(s, c1, cy, Math.max(16, r1 * 0.6), true);
  moment(s, c2, cy, Math.max(18, r2 * 0.5), false);
  gl(s, c1 + r1, cy + r1 + 30, o.M1 ?? `M_1 = ${p.M1} N·m`, { 'text-anchor': 'end' });
  gl(s, c2, cy + r2 + 28, o.M2 ?? 'M_2 = ?', { 'text-anchor': 'middle' });
  txt(s, c1 - r1 - 6, cy - r1 - 6, `z_1 = ${p.z1}`, { 'text-anchor': 'end' });
  txt(s, c2 + r2 * 0.5, cy - r2 - 10, o.z2 ?? `z_2 = ${p.z2}`);
  kraft(s, c1 + r1, cy - 60, c1 + r1, cy - 4, o.Fu ?? 'F_u = ?', c1 + r1 - 8, cy - 48, { 'text-anchor': 'end' });
  txt(s, 30, 30, `m = ${p.m} mm`, { fill: C.L });
  return s;
}

export function zahnriemen(p: { z1: number; z2: number; M1: number }, o: { M1?: string; M2?: string } = {}) {
  const s = blatt(280, 'Zahnriementrieb mit Spannrolle');
  const r1 = p.z1 * 1.6, r2 = p.z2 * 1.9, c1 = 140, c2 = 440, cy = 120;
  const rb = { stroke: '#444', 'stroke-width': 7, 'stroke-dasharray': '3 2' };
  line(s, c1, cy - r1, c2, cy - r2, rb);
  const px = 300, pr = 26, py = cy + r1 + pr + 2, R = pr + 3;
  const Lp = [px - R * 0.5, py - R * 0.866], Rt = [px + R * 0.866, py - R * 0.5];
  line(s, c1, cy + r1, Lp[0], Lp[1], rb);
  s.append(el('path', { d: `M${Lp[0]},${Lp[1]} A${R},${R} 0 0 1 ${Rt[0]},${Rt[1]}`, fill: 'none', ...rb }));
  line(s, Rt[0], Rt[1], c2, cy + r2, rb);
  zahnrad(s, c1, cy, r1, p.z1, { h: 5, fill: '#cfe0f3' });
  zahnrad(s, c2, cy, r2, p.z2, { h: 5 });
  scheibe(s, px, py, pr, { fill: '#d7dbe2' });
  txt(s, px, py + pr + 18, 'Spannrolle (drückt von aussen)', { 'font-size': 12, 'text-anchor': 'middle' });
  moment(s, c1, cy, 20, true);
  moment(s, c2, cy, 40, true);
  txt(s, c1, cy - r1 - 12, `z_1 = ${p.z1}`, { 'text-anchor': 'middle' });
  txt(s, c2, cy - r2 - 14, `z_2 = ${p.z2}`, { 'text-anchor': 'middle' });
  gl(s, c1 - r1 - 12, cy + 5, o.M1 ?? `M_1 = ${p.M1} N·m`, { 'text-anchor': 'end' });
  gl(s, c2 + r2 + 8, cy + 6, o.M2 ?? 'M_2 = ?');
  return s;
}

export function schnecke(p: { z1: number; z2: number; n1: number; M2: number }, o: { M2?: string; n2?: string; M1?: string } = {}) {
  const s = blatt(290, 'Schneckengetriebe mit Motor');
  const cx = 360, cy = 105, R = 80, yS = cy + R + 14;
  boden(s, 180, 268, 360, 10);
  s.append(el('rect', { x: 260, y: yS - 22, width: 200, height: 90, fill: '#d7dbe2', stroke: '#555' }));
  zahnrad(s, cx, cy, R, p.z2, { h: 5 });
  moment(s, cx, cy, 36, true);
  txt(s, cx + R + 12, cy - R + 10, `z_2 = ${p.z2}`);
  gl(s, cx + R + 12, cy + 10, o.M2 ?? `M_2 = ${p.M2} N·m`);
  gl(s, cx + R + 12, cy + 34, o.n2 ?? 'n_2 = ?');
  s.append(el('rect', { x: 300, y: yS - 12, width: 120, height: 24, rx: 4, fill: C.HOLZ, stroke: '#555' }));
  for (let x = 306; x < 416; x += 10) line(s, x, yS - 12, x + 8, yS + 12, { stroke: '#8a6a3a' });
  line(s, 180, yS, 300, yS, { stroke: '#555', 'stroke-width': 6 });
  motor(s, 70, yS - 34, 110, 68);
  txt(s, 125, yS + 52, 'Motor', { 'text-anchor': 'middle', 'font-size': 13 });
  gl(s, 70, yS - 44, `n_1 = ${p.n1}/min`);
  if (o.M1) gl(s, 70, yS - 62, o.M1);
  txt(s, 360, yS + 40, `z_1 = ${p.z1} (Schnecke)`, { 'text-anchor': 'middle', 'font-size': 13 });
  return s;
}

export function presse(p: { F: number; d: number; z1: number; mm: number }, o: { M1?: string; M2?: string } = {}) {
  const s = blatt(310, 'Montagepresse mit Pinole und Zahnrädern');
  const xR = 150, cy = 120, R = (p.d / 2) * 1.1, c2 = xR + 12 + R, r1 = (p.z1 * p.mm * 1.1) / 2, c1x = c2 + (R + r1) * 0.75, c1y = cy + (R + r1) * 0.66;
  [[60, 30], [60, 240]].forEach(([x, y]) => boden(s, x, y, 40, 30));
  s.append(el('rect', { x: xR - 50, y: 10, width: 52, height: 280, fill: '#d7dbe2', stroke: '#555' }));
  for (let y = 20; y < 280; y += 12) line(s, xR + 2, y, xR + 10, y + 6, { stroke: '#555' });
  txt(s, xR - 24, 30, 'Pinole', { 'font-size': 12, 'text-anchor': 'middle' });
  zahnrad(s, c2, cy, R, 48, { h: 5 });
  zahnrad(s, c1x, c1y, r1, p.z1, { h: 5, fill: '#cfe0f3' });
  moment(s, c2, cy, 30, false);
  moment(s, c1x, c1y, Math.max(16, r1 * 0.6), true);
  gl(s, c2 + 8, cy - R - 8, o.M2 ?? 'M_2 = ?');
  gl(s, c1x + r1 + 8, c1y + 20, o.M1 ?? 'M_1 = ?');
  txt(s, c1x + r1 + 8, c1y - 4, `z_1 = ${p.z1}, m = ${fmt(p.mm)} mm`, { 'font-size': 13 });
  txt(s, c2, cy + R * 0.62, `ø${p.d}`, { fill: C.L, 'font-size': 13, 'text-anchor': 'middle' });
  kraft(s, xR - 24, 300, xR - 24, 232, '');
  txt(s, xR + 16, 270, `F = ${fmt(p.F)} kN`, { fill: C.F, 'font-weight': 600, 'font-size': 14 });
  return s;
}

export function verdichter(p: { M1: number; d1: number; i: number }, o: { M1?: string; M2?: string; F?: string } = {}) {
  const s = blatt(300, 'Kolbenverdichter mit Keilriemenantrieb');
  const c1 = 170, cy = 130, R = 100, c2 = 470, r = R / p.i;
  boden(s, 40, 262, 560, 10);
  s.append(el('rect', { x: c2 - 50, y: cy + r - 4, width: 120, height: 262 - cy - r + 4, fill: '#d7dbe2', stroke: '#555' }));
  line(s, c1, cy - R, c2, cy - r, { stroke: '#444', 'stroke-width': 6 });
  line(s, c1, cy + R, c2, cy + r, { stroke: '#444', 'stroke-width': 6 });
  scheibe(s, c1, cy, R, { speichen: true });
  motor(s, c2 - 6, cy - 46, 96, 92);
  scheibe(s, c2, cy, r, { fill: '#cfe0f3' });
  txt(s, c2 + 46, cy - 54, 'Motor', { 'font-size': 13, 'text-anchor': 'middle' });
  txt(s, c1, 20, 'Kompressor (Schwungrad)', { 'font-size': 13, 'text-anchor': 'middle' });
  moment(s, c2, cy, r * 0.6, true);
  gl(s, c2 + 46, cy - 72, o.M1 ?? `M_1 = ${p.M1} N·m`, { 'text-anchor': 'middle' });
  kraft(s, 320, cy - R / 2 - 34, 390, cy - R / 2 - 46, o.F ?? 'F = ?', 330, cy - R / 2 - 50);
  gl(s, 24, 56, o.M2 ?? 'M_2 = ?');
  txt(s, 24, 80, `i = ${fmt(p.i)}`, { 'font-size': 14 });
  txt(s, c2 - 56, 248, `Motorscheibe d_w1 = ${p.d1}`, { fill: C.L, 'font-size': 14, 'text-anchor': 'end' });
  return s;
}

export function winde(p: { FG: number; dT: number; i: number; l1: number }, o: { F1?: string; FG?: string; M1?: string; M2?: string } = {}) {
  const s = blatt(345, 'Räderwinde mit Kurbel und Seiltrommel');
  const cx = 380, cy = 150, Rz = 105, Rt = (p.dT / 2) * 0.55, rp = Rz / p.i, px = cx - Rz - rp, py = cy - 60, ang = Math.atan2(py - cy, px - cx);
  const pX = cx + (Rz + rp) * Math.cos(ang), pY = cy + (Rz + rp) * Math.sin(ang);
  zahnrad(s, cx, cy, Rz, 60, { h: 5, nabe: false });
  scheibe(s, cx, cy, Rt, { fill: C.HOLZ });
  zahnrad(s, pX, pY, rp, 18, { h: 5, fill: '#cfe0f3' });
  const L = 150;
  balken(s, pX - L - 10, pX + 8, pY, 11);
  s.append(el('circle', { cx: pX - L, cy: pY, r: 8, fill: '#444' }));
  kraft(s, pX - L, pY + 60, pX - L, pY + 8, o.F1 ?? 'F_1 = ?', pX - L + 10, pY + 48);
  massH(s, pX - L, pX, pY - 36, `l_1 = ${p.l1}`, pY - 8);
  gl(s, pX - L - 14, pY - 12, o.M1 ?? 'M_1 = ?', { 'text-anchor': 'end' });
  seil(s, cx + Rt, cy, cx + Rt, cy + 118);
  kiste(s, cx + Rt - 30, cy + 118, 60, 36);
  kraft(s, cx + Rt, cy + 156, cx + Rt, cy + 192, o.FG ?? `F_G = ${fmt(p.FG)} kN`, cx + Rt + 10, cy + 186);
  moment(s, cx, cy, Rt * 0.6, false);
  gl(s, cx + Rz + 8, cy - Rz + 16, o.M2 ?? 'M_2 = ?');
  massV(s, cy - Rt, cy + Rt, cx - Rz - 20, `ø${p.dT}`, cx - 6);
  txt(s, cx + Rz - 30, cy + Rz + 10, `i = ${fmt(p.i)}`, { 'font-size': 14 });
  return s;
}

export function pkw(p: { M: number; n: number; rR: number }, o: { Fu?: string } = {}) {
  const s = blatt(280, 'Pkw-Antrieb mit Schaltgetriebe und Ausgleichsgetriebe');
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
  kraft(s, xr, yG - 2, xr + 70, yG - 2, '');
  txt(s, xr + 10, yG + 30, o.Fu ?? 'F_u = ?', { fill: C.F, 'font-weight': 600, 'font-size': 13 });
  massV(s, yG - rR, yG, xr + rR + 70, `r_R = ${p.rR}`, xr + 4);
  gl(s, 90, 40, `M = ${p.M} N·m bei n = ${p.n}/min`);
  return s;
}

export function hubwerk(p: { z1: number; z2: number; z3: number; z4: number; FG: number; dT: number; n: number }, o: { FG?: string; v?: string; M?: string } = {}) {
  const s = blatt(335, 'Hubwerk mit zweistufigem Getriebe');
  const k = 0.9, r1 = p.z1 * k, r2 = p.z2 * k, r3 = p.z3 * k, r4 = p.z4 * k, y3 = 80, y2 = y3 + r3 + r4, y1 = y2 + r1 + r2, xg1 = 330, xg2 = 430, rT = Math.min(58, (p.dT / 2) * 0.4);
  [[y3, 40, xg1 + 30], [y2, xg1 - 30, xg2 + 30], [y1, xg2 - 30, 520]].forEach(([y, a, b]) => line(s, a, y, b, y, { stroke: '#555', 'stroke-width': 6 }));
  s.append(el('rect', { x: 60, y: y3 - rT, width: 110, height: 2 * rT, rx: 4, fill: C.HOLZ, stroke: '#555' }));
  for (let x = 66; x < 170; x += 8) line(s, x, y3 - rT, x, y3 + rT, { stroke: '#b0923f' });
  txt(s, 115, y3 - rT - 8, 'Seiltrommel', { 'font-size': 12, 'text-anchor': 'middle' });
  seite(s, xg1, y3, r4);
  seite(s, xg1, y2, r3, '#cfe0f3');
  seite(s, xg2, y2, r2);
  seite(s, xg2, y1, r1, '#cfe0f3');
  txt(s, xg1 + 14, y3 - r4 + 12, `z_4 = ${p.z4}`, { 'font-size': 13 });
  txt(s, xg1 - 14, y2 + 22, `z_3 = ${p.z3}`, { 'font-size': 13, 'text-anchor': 'end' });
  txt(s, xg2 + 14, y2 - r2 + 12, `z_2 = ${p.z2}`, { 'font-size': 13 });
  txt(s, xg2 - 14, y1 + 22, `z_1 = ${p.z1}`, { 'font-size': 13, 'text-anchor': 'end' });
  motor(s, 500, y1 - 30, 110, 60);
  txt(s, 555, y1 - 4, 'Motor', { 'font-size': 13, 'text-anchor': 'middle' });
  gl(s, 555, y1 + 16, `n = ${p.n}/min`, { 'font-size': 13, 'text-anchor': 'middle' });
  seil(s, 80, y3 + rT, 80, 268);
  kiste(s, 56, 268, 48, 32);
  kraft(s, 80, 302, 80, 332, '');
  txt(s, 92, 326, o.FG ?? `F_G = ${fmt(p.FG)} kN`, { fill: C.F, 'font-weight': 600, 'font-size': 13 });
  tempo(s, 100, 240, 100, 200, '', 0, 0);
  txt(s, 108, 226, o.v ?? 'v = ?', { fill: C.V, 'font-weight': 600, 'font-size': 13 });
  massV(s, y3 - rT, y3 + rT, 34, `ø${p.dT}`, 60);
  gl(s, 200, y3 + rT + 30, o.M ?? 'M_T = ?');
  return s;
}

export function zahnwelle(p: { M: number; d: number; l: number; a: number }, o: { Fu?: string; RA?: string; RB?: string } = {}) {
  const s = blatt(300, 'Welle mit Zahnrad und zwei Lagern');
  const k = 380 / p.l, xA = 170, X = (v: number) => xA + v * k, xB = X(p.l), xZ = X(p.a), y = 170, R = Math.min(80, p.d * 0.5);
  boden(s, 40, 262, 560, 10);
  [xA, xB].forEach((x) => {
    s.append(el('rect', { x: x - 20, y: y + 14, width: 40, height: 262 - y - 14, fill: C.GESTELL, stroke: '#555' }));
    s.append(el('circle', { cx: x, cy: y, r: 16, fill: '#d7dbe2', stroke: '#555' }));
  });
  balken(s, xA - 44, xB + 40, y, 14);
  s.append(el('rect', { x: xZ - 14, y: y - R, width: 28, height: 2 * R, fill: C.STAHL, stroke: C.STAHLRAND }));
  for (let yy = y - R + 6; yy < y + R; yy += 8) line(s, xZ - 14, yy, xZ + 14, yy + 4, { stroke: C.STAHLRAND });
  s.append(el('rect', { x: xZ - 14, y: y - R - 50, width: 28, height: 50, fill: '#cfe0f3', stroke: C.STAHLRAND, 'stroke-dasharray': '4 3' }));
  txt(s, xZ + 22, y - R - 30, 'Gegenrad', { 'font-size': 12 });
  kraft(s, xZ + 30, y - R - 4, xZ + 30, y - R + 44, o.Fu ?? 'F_u = ?', xZ + 38, y - R + 30, { 'font-size': 13 });
  txt(s, xZ + 22, y + R - 6, `d = ${p.d} mm`, { fill: C.L, 'font-size': 13 });
  motor(s, xA - 100, y - 26, 56, 52);
  gl(s, xA - 72, y - 36, `M = ${p.M} N·m`, { 'text-anchor': 'middle', 'font-size': 13 });
  txt(s, xA - 6, y - 24, 'A', { 'font-weight': 600, 'text-anchor': 'end' });
  txt(s, xB + 6, y - 24, 'B', { 'font-weight': 600 });
  kraft(s, xA, y + 70, xA, y + 20, o.RA ?? 'F_A = ?', xA - 26, y + 62, { 'font-size': 13, 'text-anchor': 'end' });
  kraft(s, xB, y + 70, xB, y + 20, o.RB ?? 'F_B = ?', xB + 26, y + 62, { 'font-size': 13 });
  massH(s, xA, xZ, 292, `a = ${p.a}`, y + 16);
  massH(s, xA, xB, 30, `l = ${p.l}`, y - 16);
  return s;
}

/** Querschnitt eines Bohrers mit Umfangskraft an der Schneide. */
export function bohrer(p: { d: number }, o: { M: string; Fu: string }) {
  const s = blatt(280, 'Bohrer im Querschnitt mit Umfangskraft an der Schneide');
  const cx = 320, cy = 150, r = 85;
  s.append(el('circle', { cx, cy, r, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.6 }));
  const cid = `${s.getAttribute('data-mid')}cl`;
  s.append(el('clipPath', { id: cid }, el('circle', { cx, cy, r })));
  [[-1, -0.45], [1, 0.45]].forEach(([sx, sy]) => {
    s.append(el('circle', { cx: cx + sx * r * 0.78, cy: cy + sy * r * 0.78, r: r * 0.4, fill: '#fff', stroke: C.STAHLRAND, 'stroke-width': 1.3, 'clip-path': `url(#${cid})` }));
  });
  s.append(el('circle', { cx, cy, r, fill: 'none', stroke: C.STAHLRAND, 'stroke-width': 1.6 }));
  s.append(el('circle', { cx, cy, r: 6, fill: C.GESTELL, stroke: '#555' }));
  bolzen(s, cx, cy);
  moment(s, cx, cy, 30, true);
  gl(s, cx, cy + r + 24, o.M, { 'text-anchor': 'middle' });
  kraft(s, cx, cy - r, cx + 100, cy - r, o.Fu, cx + 110, cy - r - 8);
  line(s, cx, cy, cx, cy - r, { stroke: C.L, 'stroke-width': 2.2, 'stroke-dasharray': '6 4' });
  txt(s, cx - 8, cy - r / 2 - 4, 'd : 2', { fill: C.L, 'font-size': 13, 'text-anchor': 'end' });
  massV(s, cy - r, cy + r, cx - r - 45, `d = ${p.d}`, cx - 4);
  return s;
}

/** Seiltrommel und Zahnrad auf einer Welle (Ansicht von vorn). */
export function trommelrad(p: { FG: number; d: number; d2: number }, o: { M?: string; Fu?: string } = {}) {
  const s = blatt(330, 'Seiltrommel und Zahnrad auf derselben Welle');
  const cx = 300, cy = 130, R2 = 105, r1 = (R2 * p.d) / p.d2;
  zahnrad(s, cx, cy, R2, 40, { h: 6, nabe: false });
  s.append(el('circle', { cx, cy, r: r1, fill: C.HOLZ, stroke: '#555', 'stroke-width': 1.4 }));
  s.append(el('circle', { cx, cy, r: 8, fill: C.GESTELL, stroke: '#555' }));
  bolzen(s, cx, cy);
  seil(s, cx + r1, cy, cx + r1, cy + 112);
  kiste(s, cx + r1 - 26, cy + 112, 52, 34);
  kraft(s, cx + r1, cy + 148, cx + r1, cy + 184, `F_G = ${p.FG} N`, cx + r1 + 12, cy + 176);
  moment(s, cx, cy, Math.max(14, r1 * 0.55), true);
  gl(s, cx - 12, cy + r1 + 24, o.M ?? 'M = ?', { 'text-anchor': 'middle' });
  kraft(s, cx, cy - R2, cx - 100, cy - R2, o.Fu ?? 'F_u = ?', cx - 108, cy - R2 - 8, { 'text-anchor': 'end' });
  massV(s, cy - r1, cy + r1, cx - R2 - 80, `Trommel ø${p.d}`, cx - r1 - 4);
  txt(s, cx + R2 + 14, cy - R2 + 14, `Zahnrad ø${p.d2}`, { fill: C.L, 'font-size': 14 });
  return s;
}
