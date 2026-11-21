// Bauteilbilder für das Kapitel «Lagerkräfte».
import { C, balken, blatt, boden, bolzen, drehbock, el, kiste, kraft, line, massH, massV, ref, resultierende, seil, stab, txt } from '../../../core/draw/svg';
import { fmt } from '../../../core/zahl';

const HOLZ2 = '#f0c987';
const HOLZ2R = '#8a6a3a';

export interface Last {
  x: number;
  F: number;
  lab: string;
  box?: boolean;
  anc?: boolean;
}

/** Träger auf zwei Lagern (A links, B rechts). Lasten und Lagerkräfte als Pfeile. */
export function traeger(
  p: { l: number; end?: number; loads: Last[] },
  o: { segs?: string[] | null; ex?: [number, string]; tot?: string; RA?: string; RB?: string; negA?: boolean } = {},
) {
  const s = blatt(315, 'Träger auf zwei Lagern');
  const tot = Math.max(p.l, p.end || 0, ...p.loads.map((q) => q.x));
  const k = 440 / tot, X = (v: number) => 100 + v * k, y = 165, XA = X(0), XB = X(p.l);
  boden(s, XA - 34, y + 54, 68, 10);
  drehbock(s, XA, y + 14, 40);
  boden(s, XB - 34, y + 54, 68, 10);
  drehbock(s, XB, y + 14, 30);
  [-12, 0, 12].forEach((d) => s.append(el('circle', { cx: XB + d, cy: y + 49, r: 4.5, fill: '#fff', stroke: '#555' })));
  balken(s, XA - 18, X(tot) + 18, y, 16);
  txt(s, XA - 46, y + 40, 'A', { 'font-weight': 600 });
  txt(s, XB + 34, y + 40, 'B', { 'font-weight': 600 });
  p.loads.forEach((q) => {
    if (q.box) kiste(s, X(q.x) - 22, y - 8 - 34, 44, 34);
    kraft(s, X(q.x), y - (q.box ? 46 : 64), X(q.x), y - 10, q.lab, X(q.x) + 9, y - (q.box ? 52 : 44), q.anc ? { 'text-anchor': 'end', dx: -18 } : {});
  });
  const R = (x: number, lab: string, neg?: boolean) => {
    if (neg) kraft(s, x, y + 70, x, y + 116, lab, x + 10, y + 104);
    else kraft(s, x, y + 118, x, y + 72, lab, x + 10, y + 104);
  };
  R(XA, o.RA || 'F_A = ?', o.negA);
  R(XB, o.RB || 'F_B = ?');
  const pts = [...new Set([0, ...p.loads.map((q) => q.x), p.l, tot])].sort((a, b) => a - b);
  pts.slice(1).forEach((v, i) => {
    if (o.segs && o.segs[i]) massH(s, X(pts[i]), X(v), y - 94, o.segs[i], y - 12);
  });
  if (o.ex) massH(s, XA, X(o.ex[0]), y - 118, o.ex[1], y - 12);
  if (o.tot) massH(s, XA, XB, y - 142, o.tot, y - 12);
  return s;
}

/** Spannpratze am Frästisch. */
export function pratze(p: { F: number; a: number; b: number }, o: { RA?: string; RB?: string } = {}) {
  const s = blatt(290, 'Spannpratze am Frästisch');
  const k = 2.4, xA = 200, xS = xA + p.a * k, xB = xA + (p.a + p.b) * k;
  boden(s, 120, 215, 360, 50);
  kiste(s, 130, 165, xA - 130 + 34, 50);
  s.append(el('rect', { x: xB - 34, y: 165, width: 130, height: 50, fill: C.GESTELL, stroke: '#555' }));
  s.append(el('rect', { x: xS - 24, y: 226, width: 48, height: 15, fill: '#cfe0f3', stroke: C.STAHLRAND }));
  s.append(el('rect', { x: xS - 5, y: 122, width: 10, height: 112, fill: '#cfe0f3', stroke: C.STAHLRAND }));
  balken(s, xA - 26, xB + 26, 150, 18);
  s.append(el('rect', { x: xS - 13, y: 126, width: 26, height: 15, fill: C.STAHL, stroke: C.STAHLRAND }));
  txt(s, 136, 211, 'Werkstück', { 'font-size': 12 });
  txt(s, xB + 92, 211, 'Stützklotz', { 'font-size': 12, 'text-anchor': 'end' });
  txt(s, 130, 258, 'Frästisch', { 'font-size': 13 });
  txt(s, xA - 22, 138, 'A', { 'font-weight': 600, 'text-anchor': 'end' });
  txt(s, xB + 22, 138, 'B', { 'font-weight': 600 });
  kraft(s, xS, 50, xS, 120, `F_Sch = ${p.F} kN`, xS + 10, 66);
  kraft(s, xA, 208, xA, 163, o.RA ?? 'F_S = ?', xA - 9, 184, { 'text-anchor': 'end', 'font-size': 13 });
  kraft(s, xB, 208, xB, 163, o.RB ?? 'F_B = ?', xB + 9, 184, { 'font-size': 13 });
  massH(s, xA, xS, 98, `a = ${p.a}`, 138);
  massH(s, xS, xB, 98, `b = ${p.b}`, 138);
  return s;
}

function person(s: SVGSVGElement, x: number, yF: number, h = 70, fill = '#5a6673') {
  const k = h / 70;
  s.append(el('circle', { cx: x, cy: yF - 62 * k, r: 8 * k, fill }));
  line(s, x, yF - 54 * k, x, yF - 26 * k, { stroke: fill, 'stroke-width': 4 });
  line(s, x, yF - 26 * k, x - 9 * k, yF, { stroke: fill, 'stroke-width': 4 });
  line(s, x, yF - 26 * k, x + 9 * k, yF, { stroke: fill, 'stroke-width': 4 });
  line(s, x, yF - 48 * k, x + 12 * k, yF - 36 * k, { stroke: fill, 'stroke-width': 3.5 });
  line(s, x, yF - 48 * k, x - 12 * k, yF - 36 * k, { stroke: fill, 'stroke-width': 3.5 });
}

/** Sprungbrett: bei A verschraubt, bei B auf Stütze, Person am Ende. */
export function sprungbrett(p: { L: number; a: number; F: number }, o: { res?: boolean } = {}) {
  const s = blatt(335, 'Sprungbrett im Schwimmbad');
  const k = 420 / p.L, xA = 90, X = (v: number) => xA + v * k, y = 120, xB = X(p.a), xE = X(p.L);
  s.append(el('rect', { x: 20, y: y + 8, width: xB + 40 - 20, height: 150, fill: ref(s, 'hat'), stroke: '#555' }));
  s.append(el('rect', { x: xB + 40, y: y + 70, width: 620 - xB - 40, height: 88, fill: '#cfe3f5' }));
  txt(s, xB + 60, y + 110, 'Schwimmbecken', { 'font-size': 13, fill: C.STAHLRAND });
  s.append(el('rect', { x: xA - 14, y: y - 4, width: 22, height: 18, fill: C.GESTELL, stroke: '#555' }));
  drehbock(s, xB, y + 8, 0);
  s.append(el('rect', { x: xB - 14, y: y + 7, width: 28, height: 8, fill: C.GESTELL, stroke: '#555' }));
  s.append(el('rect', { x: xA - 10, y: y - 6, width: xE - xA + 10, height: 12, rx: 4, fill: HOLZ2, stroke: HOLZ2R }));
  bolzen(s, xA, y);
  txt(s, xA - 6, y - 14, 'A', { 'font-weight': 600, 'text-anchor': 'end' });
  txt(s, xB - 8, y - 14, 'B', { 'font-weight': 600, 'text-anchor': 'end' });
  person(s, xE - 16, y - 6, 70);
  kraft(s, xE - 4, y - 110, xE - 4, y - 12, `F = ${p.F} N`, xE - 10, y - 96, { 'text-anchor': 'end' });
  if (o.res) {
    kraft(s, xA, y + 6, xA, y + 56, `F_A = ${fmt((p.F * (p.L - p.a)) / p.a)} N`, xA + 10, y + 50);
    kraft(s, xB, y + 70, xB, y + 16, `F_B = ${fmt((p.F * p.L) / p.a)} N`, xB + 10, y + 58);
  } else {
    kraft(s, xA, y + 6, xA, y + 56, 'F_A = ?', xA + 10, y + 50);
    kraft(s, xB, y + 70, xB, y + 16, 'F_B = ?', xB + 10, y + 58);
  }
  massH(s, xA, xB, y + 182, `a = ${fmt(p.a)} m`, y + 158);
  massH(s, xA, xE, y + 206, `L = ${fmt(p.L)} m`, y);
  return s;
}

/** Hallenkran: Kranbrücke auf zwei Kranbahnen, Laufkatze mit Last. */
export function hallenkran(
  p: { L: number; x1: number; xg: number; F1: number; F2: number; F3: number },
  o: { x1lab?: string; F1?: string; F2?: string; F3?: string; FA?: string; FB?: string } = {},
) {
  const s = blatt(390, 'Hallenkran mit Laufkatze');
  const X = (v: number) => 70 + (v / p.L) * 500, yB = 100;
  [[44, 70], [570, 596]].forEach(([a, b]) => s.append(el('rect', { x: a, y: yB, width: b - a, height: 300 - yB, fill: ref(s, 'hat'), stroke: '#555' })));
  boden(s, 20, 300, 600, 12);
  s.append(el('rect', { x: 60, y: yB - 14, width: 520, height: 22, rx: 3, fill: HOLZ2, stroke: HOLZ2R, 'stroke-width': 1.5 }));
  const xc = X(p.x1);
  s.append(el('rect', { x: xc - 22, y: yB - 34, width: 44, height: 16, rx: 3, fill: C.GESTELL, stroke: '#555' }));
  [xc - 12, xc + 12].forEach((c) => s.append(el('circle', { cx: c, cy: yB - 16, r: 4, fill: C.GESTELL, stroke: '#555' })));
  seil(s, xc, yB + 8, xc, yB + 70);
  s.append(el('path', { d: `M${xc},${yB + 70} l0,8 a7,7 0 1 1 -7,7`, fill: 'none', stroke: '#444', 'stroke-width': 3 }));
  kiste(s, xc - 22, yB + 92, 44, 34);
  kraft(s, xc, yB + 128, xc, yB + 170, o.F1 ?? `F_1 = ${p.F1} kN`, xc + 9, yB + 164, { 'font-size': 13 });
  kraft(s, xc - 30, yB - 58, xc - 30, yB - 36);
  txt(s, xc - 42, yB - 48, o.F3 ?? `F_3 = ${p.F3} kN`, { fill: C.F, 'font-weight': 600, 'font-size': 13, 'text-anchor': 'end' });
  const xg = X(p.xg);
  kraft(s, xg, yB + 10, xg, yB + 56, o.F2 ?? `F_2 = ${p.F2} kN`, xg - 10, yB + 50, { 'font-size': 13, 'text-anchor': 'end' });
  kraft(s, 60, yB + 70, 60, yB + 12);
  {
    const t = o.FA ?? 'F_A', lg = t.length > 4;
    txt(s, lg ? 76 : 38, lg ? yB + 190 : yB + 52, t, { fill: C.F, 'font-weight': 600, 'text-anchor': lg ? 'start' : 'end', 'font-size': 13 });
  }
  kraft(s, 580, yB + 70, 580, yB + 12);
  {
    const t = o.FB ?? 'F_B', lg = t.length > 4;
    txt(s, lg ? 564 : 602, lg ? yB + 190 : yB + 52, t, { fill: C.F, 'font-weight': 600, 'font-size': 13, 'text-anchor': lg ? 'end' : 'start' });
  }
  massH(s, 60, xc, 330, o.x1lab ?? `${fmt(p.x1)} m`, 314);
  massH(s, 60, xg, 350, `${fmt(p.xg)} m`, 314);
  massH(s, 60, 580, yB - 66, `l = ${p.L} m`, yB - 16);
  return s;
}

/** Seilwinde: Welle in zwei Lagern, Seiltrommel, Last am Seil. */
export function winde(p: { l: number; a: number; d: number; m: number }, o: { M?: string; RA?: string; RB?: string } = {}) {
  const s = blatt(320, 'Seilwinde mit Welle in zwei Lagern');
  const k = 400 / p.l, xA = 120, X = (v: number) => xA + v * k, xB = X(p.l), xT = X(p.a), y = 95, yG = 300;
  const dr = Math.max(26, Math.min(48, p.d * 0.16));
  boden(s, 40, yG, 560, 12);
  [xA, xB].forEach((x) => {
    s.append(el('polygon', { points: `${x - 18},${yG} ${x + 18},${yG} ${x + 12},${y + 14} ${x - 12},${y + 14}`, fill: C.GESTELL, stroke: '#555' }));
    s.append(el('circle', { cx: x, cy: y, r: 16, fill: '#d7dbe2', stroke: '#555' }));
  });
  balken(s, xA - 46, xB + 30, y, 14);
  s.append(el('rect', { x: xT - 40, y: y - dr, width: 80, height: 2 * dr, rx: 4, fill: C.HOLZ, stroke: '#555' }));
  for (let i = -30; i <= 30; i += 10) line(s, xT + i, y - dr, xT + i, y + dr, { stroke: '#b0923f' });
  s.append(el('rect', { x: xA - 110, y: y - 26, width: 56, height: 52, rx: 6, fill: C.STAHL, stroke: C.STAHLRAND }));
  txt(s, xA - 82, y + 44, 'Motor', { 'font-size': 12, 'text-anchor': 'middle' });
  txt(s, xA - 82, y - 34, o.M ?? 'M = ?', { 'text-anchor': 'middle', fill: C.M, 'font-weight': 600, 'font-size': 13 });
  seil(s, xT + 30, y + dr, xT + 30, y + 130);
  kiste(s, xT + 8, y + 130, 44, 40);
  txt(s, xT + 58, y + 156, `m = ${p.m} kg`, { 'font-size': 13 });
  txt(s, xA - 4, y - 24, 'A', { 'font-weight': 600, 'text-anchor': 'end' });
  txt(s, xB + 4, y - 24, 'B', { 'font-weight': 600 });
  kraft(s, xA, y + 68, xA, y + 20, o.RA ?? 'F_A = ?', xA + 22, y + 60, { 'font-size': 13 });
  kraft(s, xB, y + 68, xB, y + 20, o.RB ?? 'F_B = ?', xB + 22, y + 60, { 'font-size': 13 });
  massH(s, xA, xT + 30, y - dr - 24, `a = ${p.a}`, y - dr);
  massH(s, xA, xB, y - dr - 46, `l = ${p.l}`, y - 16);
  txt(s, xT + 50, y + dr + 18, `d = ${p.d} mm`, { fill: C.L, 'font-size': 13 });
  return s;
}

/** Anhänger an der Kupplung (A) mit Achse (B). */
export function anhaenger(
  p: { l: number; xL: number; FL: number; x: number; F: number },
  o: { F?: string; FL?: string; RA?: string; RB?: string; xlab?: string } = {},
) {
  const s = blatt(318, 'Anhänger mit Ladung');
  const k = 380 / (p.l + 0.4), xA = 150, X = (v: number) => xA + v * k, yG = 250, yK = 170, xB = X(p.l);
  boden(s, 20, yG, 600, 12);
  s.append(el('path', { d: `M20,${yG - 20} L20,110 L80,100 L118,140 L118,${yG - 20} Z`, fill: C.STAHL, stroke: C.STAHLRAND }));
  s.append(el('circle', { cx: 70, cy: yG - 20, r: 20, fill: '#444' }));
  txt(s, 30, 96, 'Auto', { 'font-size': 12 });
  line(s, 118, yK, xA, yK, { stroke: '#555', 'stroke-width': 4 });
  s.append(el('circle', { cx: xA, cy: yK, r: 6, fill: '#555' }));
  line(s, xA, yK, X(0.6), yK - 14, { stroke: '#555', 'stroke-width': 4 });
  s.append(el('rect', { x: X(0.6), y: yK - 60, width: X(p.l + 0.4) - X(0.6), height: 46, fill: '#e6eef7', stroke: C.STAHLRAND }));
  s.append(el('circle', { cx: xB, cy: yG - 22, r: 22, fill: '#444' }));
  line(s, xB, yK - 14, xB, yG - 22, { stroke: '#555', 'stroke-width': 3 });
  kiste(s, X(p.x) - 26, yK - 110, 52, 50);
  txt(s, X(p.x), yK - 118, 'Ladung', { 'font-size': 12, 'text-anchor': 'middle' });
  kraft(s, X(p.x), yK - 90, X(p.x), yK - 30, o.F ?? `F = ${p.F} N`, X(p.x) + 30, yK - 82, { 'font-size': 13 });
  const xL = X(p.xL);
  kraft(s, xL, yK - 60, xL, yK - 14, o.FL ?? `F_L = ${p.FL} N`, xL + 8, yK - 24, { 'font-size': 13 });
  kraft(s, xA, yK + 60, xA, yK + 8, o.RA ?? 'F_A = ? (Stützlast)', xA + 10, yK + 50, { 'font-size': 13 });
  kraft(s, xB + 30, yG - 30, xB + 30, yG - 80, o.RB ?? 'F_B = ?', xB + 38, yG - 50, { 'font-size': 13 });
  txt(s, xA - 6, yK - 10, 'A', { 'font-weight': 600, 'text-anchor': 'end' });
  txt(s, xB - 28, yG - 8, 'B', { 'font-weight': 600 });
  massH(s, xA, xB, yG + 34, `l = ${fmt(p.l)} m`, yG - 2);
  massH(s, xA, X(p.x), 28, o.xlab ?? `x = ${fmt(p.x)} m`, yK - 110);
  massH(s, xA, xL, yG + 52, `${fmt(p.xL)} m`, yG - 2);
  return s;
}

/** Umlenkrolle, Seil links und oben, Pendelstange schräg zum Boden. */
export function umlenk(p: { F: number }, o: { F1?: string; F2?: string; res?: string; al?: string } = {}) {
  const s = blatt(300, 'Umlenkrolle mit Pendelstange');
  const cx = 300, cy = 120, r = 40, px = cx + 135, py = cy + 135;
  boden(s, px - 40, py + 14, 80, 12);
  s.append(el('polygon', { points: `${px},${py} ${px - 16},${py + 14} ${px + 16},${py + 14}`, fill: C.GESTELL, stroke: '#555' }));
  stab(s, cx, cy, px, py, 9);
  bolzen(s, px, py);
  line(s, cx, cy + r, 110, cy + r, { stroke: '#444', 'stroke-width': 2.5 });
  line(s, cx + r, cy, cx + r, 20, { stroke: '#444', 'stroke-width': 2.5 });
  s.append(el('circle', { cx, cy, r, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.5 }));
  bolzen(s, cx, cy);
  txt(s, cx - r - 6, cy - r + 4, 'A', { 'font-weight': 600, 'text-anchor': 'end' });
  kraft(s, 170, cy + r, 90, cy + r, o.F1 ?? `F = ${p.F} N`, 96, cy + r - 10);
  kraft(s, cx + r, 70, cx + r, 14, o.F2 ?? `F = ${p.F} N`, cx + r + 10, 34);
  if (o.res) resultierende(s, cx, cy, cx - 70, cy - 70, o.res, cx - 76, cy - 78);
  line(s, px, py, px, py - 80, { stroke: C.GRAU, 'stroke-dasharray': '4 4' });
  s.append(el('path', { d: `M${px},${py - 50} A50,50 0 0 0 ${px - 35.4},${py - 35.4}`, fill: 'none', stroke: C.INK }));
  txt(s, px - 12, py - 58, o.al ?? 'α = ?', { 'font-size': 14, 'text-anchor': 'end' });
  txt(s, (cx + px) / 2 - 14, (cy + py) / 2 + 16, 'Pendelstange', { 'font-size': 12, fill: C.GRAU, 'text-anchor': 'end' });
  return s;
}

/** Hebel mit Lager A, Bolzen rechts und Feder. */
export function hebelFeder(
  p: { F1: number; F3: number; a: number; b: number },
  o: { F1?: string; F2?: string; F3?: string; FA?: string } = {},
) {
  const s = blatt(305, 'Hebel mit Bolzen und Feder');
  const k = Math.min(1.5, 420 / (p.a + p.b)), xA = 110 + p.a * k, y = 150, xL = xA - p.a * k, xR = xA + p.b * k;
  boden(s, xA - 40, y + 50, 80, 12);
  drehbock(s, xA, y + 7, 43);
  balken(s, xL - 14, xR + 14, y);
  [xA, xL, xR].forEach((x) => bolzen(s, x, y));
  txt(s, xA + 16, y + 36, 'A', { 'font-weight': 600 });
  kraft(s, xL, y - 80, xL, y - 10, o.F2 ?? 'F_2 = ?', xL + 9, y - 58);
  kraft(s, xR, y - 84, xR, y - 10, o.F1 ?? `F_1 = ${fmt(p.F1 / 1000, 2)} kN`, xR - 9, y - 66, { 'text-anchor': 'end' });
  for (let i = 0; i < 5; i++) line(s, xR + 14, y - 60 + i * 10, xR + 30, y - 55 + i * 10, { stroke: '#b05a2a', 'stroke-width': 2.5 });
  kraft(s, xR + 22, y - 8, xR + 22, y - 62);
  txt(s, xR + 36, y - 30, o.F3 ?? `F_3 = ${p.F3} N`, { fill: C.F, 'font-weight': 600, 'font-size': 14 });
  txt(s, xR + 36, y - 8, 'Feder', { 'font-size': 12, fill: C.GRAU });
  kraft(s, xA, y + 108, xA, y + 66, o.FA ?? 'F_A = ?', xA + 9, y + 100);
  massH(s, xL, xA, y + 130, `${p.a}`, y + 12);
  massH(s, xA, xR, y + 130, `${p.b}`, y + 12);
  return s;
}

/** Winkelhebel: Lager A, waagrechte Kraft F am Abstand h, senkrechte Kraft F_1 am Abstand c. */
export function winkelhebel(p: { F: number; h: number; c: number }, o: { F?: string; F1?: string; FA?: string } = {}) {
  const s = blatt(305, 'Winkelhebel mit einem Lager');
  const k = Math.min(1.5, 150 / p.h, 190 / p.c), ax = 250, ay = 205, ty = ay - p.h * k, rx = ax + p.c * k;
  boden(s, ax - 40, ay + 30, 80, 12);
  s.append(el('polygon', { points: `${ax},${ay} ${ax - 20},${ay + 30} ${ax + 20},${ay + 30}`, fill: C.GESTELL, stroke: '#555' }));
  stab(s, ax, ay, ax, ty, 11);
  stab(s, ax, ay, rx, ay, 11);
  [[ax, ay], [ax, ty], [rx, ay]].forEach(([x, y]) => bolzen(s, x, y));
  txt(s, ax + 14, ay - 14, 'A', { 'font-weight': 600 });
  kraft(s, ax - 8, ty, ax - 96, ty, o.F ?? `F = ${p.F} kN`, ax - 100, ty - 10, { 'text-anchor': 'end' });
  kraft(s, rx, ay + 8, rx, ay + 72, o.F1 ?? 'F_1 = ?', rx + 9, ay + 64);
  if (o.FA) kraft(s, ax + 80, ay - 50, ax + 8, ay - 6, o.FA, ax + 84, ay - 56);
  massV(s, ty, ay, ax - 60, `${p.h}`, ax - 12);
  massH(s, ax, rx, ay + 88, `${p.c}`, ay + 34, ay + 80);
  return s;
}

/** Krafteck für ein Lager mit zwei Teilkräften. st: 0 = nur F_Ax … 3 = mit Zahlenwert. */
export function krafteck(p: { F1: number; F2: number }, st: number) {
  const s = blatt(260, 'Krafteck am Lager');
  const k = 170 / Math.max(p.F1, p.F2), A = [170, 50], E1 = [A[0] + p.F1 * k, A[1]], E = [E1[0], A[1] + p.F2 * k];
  s.append(el('circle', { cx: A[0], cy: A[1], r: 5, fill: C.STAHL, stroke: C.STAHLRAND }));
  txt(s, A[0] - 12, A[1] + 5, 'A', { 'font-weight': 600, 'text-anchor': 'end' });
  kraft(s, A[0], A[1], E1[0], E1[1], `F_Ax = ${fmt(p.F1)} kN`, (A[0] + E1[0]) / 2, A[1] - 10, { 'text-anchor': 'middle' });
  if (st >= 1) kraft(s, E1[0], E1[1], E[0], E[1], `F_Ay = ${fmt(p.F2)} kN`, E[0] + 10, (E1[1] + E[1]) / 2);
  if (st >= 2) {
    resultierende(s, A[0], A[1], E[0], E[1], st >= 3 ? `F_A = ${fmt(Math.hypot(p.F1, p.F2), 3)} kN` : 'F_A', (A[0] + E[0]) / 2 - 12, (A[1] + E[1]) / 2 + 14);
    s.lastElementChild!.setAttribute('text-anchor', 'end');
    const a = Math.atan2(p.F2, p.F1);
    s.append(el('path', { d: `M${A[0] + 50},${A[1]} A50,50 0 0 1 ${A[0] + 50 * Math.cos(a)},${A[1] + 50 * Math.sin(a)}`, fill: 'none', stroke: C.INK }));
    txt(s, A[0] + 58, A[1] + 22, 'α', { 'font-size': 14 });
  }
  return s;
}
