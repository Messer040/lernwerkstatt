// Bauteilbilder für das Kapitel «Kettenaufgaben».
import { C, balken, blatt, bolzen, boden, el, kiste, kraft, line, massH, massV, seil, txt } from '../../../core/draw/svg';
import { fmt } from '../../../core/zahl';

const rad = (a: number) => (a * Math.PI) / 180;

/** Schraffierte Wand links von x. */
const wand = (s: SVGSVGElement, x: number, y1: number, y2: number) => boden(s, x - 30, y1, 30, y2 - y1);

/** Lager (Bock mit Wellenauge) bei x, Wellenmitte y, Boden yG. */
function lager(s: SVGSVGElement, x: number, y: number, yG: number) {
  s.append(el('rect', { x: x - 18, y: y + 14, width: 36, height: yG - y - 14, fill: C.GESTELL, stroke: '#555' }));
  s.append(el('circle', { cx: x, cy: y, r: 16, fill: '#d7dbe2', stroke: '#555' }));
}

/** Pfeil unter Winkel (Grad, math. positiv) von (x,y) mit Länge len. */
function pfeil(s: SVGSVGElement, x: number, y: number, ang: number, len: number, lab: string, o: { dx?: number; dy?: number; anchor?: string } = {}) {
  const a = rad(ang), ex = x + len * Math.cos(a), ey = y - len * Math.sin(a);
  kraft(s, x, y, ex, ey, lab, ex + (o.dx ?? 8), ey + (o.dy ?? -6), { 'font-size': 13, 'text-anchor': o.anchor ?? 'start' });
}

/** Wandkonsole: Träger bei A (Wand), Zugstab von C schräg zur Wand. al = Winkel Stab zur Waagrechten. */
export function konsole(p: { l: number; a: number; al: number; F: number }, o: { S?: string; F?: string; res?: boolean } = {}) {
  const s = blatt(330, 'Wandkonsole mit Zugstab');
  const a = rad(p.al), xw = 110, yA = 230;
  const L = Math.min(380, 190 / Math.tan(a)), k = L / p.l, xC = xw + L, xF = xw + p.a * k, yT = yA - L * Math.tan(a);
  wand(s, xw, Math.max(20, yT - 30), 290);
  balken(s, xw, xC, yA, 12);
  line(s, xC, yA, xw, yT, { stroke: '#555', 'stroke-width': 4 });
  [[xw, yA], [xw, yT], [xC, yA]].forEach(([x, y]) => bolzen(s, x, y));
  txt(s, xw + 10, yA + 28, 'A', { 'font-weight': 600 });
  txt(s, xC + 10, yA + 22, 'C', { 'font-weight': 600 });
  kraft(s, xF, yA - 70, xF, yA - 8, o.F ?? `F = ${fmt(p.F)} kN`, xF - 10, yA - 24, { 'text-anchor': 'end' });
  s.append(el('path', { d: `M${xC - 60},${yA} A60,60 0 0 1 ${xC - 60 * Math.cos(a)},${yA - 60 * Math.sin(a)}`, fill: 'none', stroke: C.INK }));
  txt(s, xC - 30, yA + 24, `α = ${p.al}°`, { 'font-size': 13, 'text-anchor': 'end' });
  massH(s, xw, xF, yA + 50, `a = ${p.a}`, yA + 8);
  massH(s, xw, xC, yA + 72, `l = ${p.l}`, yA + 8);
  txt(s, (xw + xC) / 2 + 36, (yA + yT) / 2 - 8, o.S ?? 'Zugstab: F_S = ?', { fill: C.F, 'font-weight': 600, 'font-size': 13 });
  if (o.res) {
    pfeil(s, xw, yA, 90, 56, 'F_Ay', { dx: 8, dy: 0 });
    pfeil(s, xw, yA, 0, 56, 'F_Ax', { dx: -10, dy: 20, anchor: 'end' });
  }
  return s;
}

/** Schwenkkran an der Wand mit zwei Lagern O (oben) und U (unten). */
export function schwenkkran(p: { h: number; a: number; F: number; G: number; e: number; n: number; u?: string }, o: { FO?: string; S?: string } = {}) {
  const s = blatt(340, 'Schwenkkran an der Wand');
  const xw = 110, yO = 60, yU = yO + Math.min(190, Math.max(110, p.h * 0.3)), xm = xw + 30;
  const R = 330, k = R / p.a, xe = xm + R;
  wand(s, xw, 20, 310);
  line(s, xm, yO - 14, xm, yU + 20, { stroke: '#777', 'stroke-width': 12 });
  [[yO, 'O'], [yU, 'U']].forEach(([y, n]) => {
    s.append(el('rect', { x: xw, y: (y as number) - 10, width: 30, height: 20, fill: C.GESTELL, stroke: '#555' }));
    txt(s, xm + 12, (y as number) + 28, String(n), { 'font-weight': 600, fill: C.INK });
  });
  line(s, xm, yO + 4, xe, yO + 4, { stroke: '#c99a3a', 'stroke-width': 10 });
  line(s, xm, yU - 10, xm + R * 0.6, yO + 10, { stroke: '#c99a3a', 'stroke-width': 6 });
  const xG = xm + p.e * k, u = p.u ?? '';
  if (p.G > 0) kraft(s, xG, yO - 50, xG, yO - 6, `G = ${fmt(p.G)} kN`, xG + 10, yO - 36, { 'font-size': 13 });
  seil(s, xe - 10, yO + 10, xe - 10, yO + 110);
  kiste(s, xe - 34, yO + 110, 48, 34);
  kraft(s, xe - 10, yO + 146, xe - 10, yO + 200, `F = ${fmt(p.F)} kN`, xe + 2, yO + 190);
  massV(s, yO, yU, 60, `h = ${p.h}${u}`, xw - 2);
  massH(s, xm, xe - 10, yO + 238, `a = ${p.a}${u}`, yO + 150, yO + 205);
  txt(s, xm + 30, yU + 56, o.S ?? (p.n > 0 ? `${p.n} Schrauben am Lager O` : 'Lager O nimmt nur waagrechte Kraft auf'), { 'font-size': 12, fill: C.GRAU });
  if (o.FO) kraft(s, xw + 30, yO, xw - 40, yO, o.FO, xw - 40, yO - 12, { 'font-size': 13, 'text-anchor': 'end' });
  return s;
}

/** Zahnradwelle: Motor links, Zahnrad im Abstand a von Lager A, Lager A und B im Abstand l. */
export function zahnradwelle(p: { M: number; d: number; l: number; a: number }, o: { M?: string; Fn?: string; RA?: string; RB?: string } = {}) {
  const s = blatt(300, 'Zahnradwelle mit zwei Lagern');
  const k = 340 / p.l, xA = 190, X = (v: number) => xA + v * k, xB = X(p.l), xZ = X(p.a), y = 140, R = 62, yG = 262;
  boden(s, 60, yG, 520, 10);
  lager(s, xA, y, yG);
  lager(s, xB, y, yG);
  balken(s, xA - 60, xB + 30, y, 14);
  s.append(el('rect', { x: xZ - 14, y: y - R, width: 28, height: 2 * R, fill: C.STAHL, stroke: C.STAHLRAND }));
  for (let yy = y - R + 5; yy < y + R; yy += 7) line(s, xZ - 14, yy, xZ + 14, yy, { stroke: C.STAHLRAND });
  s.append(el('rect', { x: 70, y: y - 28, width: 56, height: 56, rx: 6, fill: '#cfe8c8', stroke: C.M }));
  txt(s, 98, y - 36, o.M ?? `M = ${p.M} N·m`, { 'text-anchor': 'middle', 'font-size': 13, fill: C.M, 'font-weight': 600 });
  txt(s, 98, y + 4, 'Motor', { 'text-anchor': 'middle', 'font-size': 12 });
  txt(s, xZ + 20, y + R + 14, `d = ${p.d} mm, Eingriffswinkel 20°`, { 'font-size': 13, fill: C.L });
  kraft(s, xZ + 34, y - R - 44, xZ + 34, y - R + 2, o.Fn ?? 'F_n = ?', xZ + 44, y - R - 24, { 'font-size': 13 });
  txt(s, xA - 6, y - 24, 'A', { 'font-weight': 600, 'text-anchor': 'end' });
  txt(s, xB + 6, y - 24, 'B', { 'font-weight': 600 });
  kraft(s, xA, y + 76, xA, y + 22, o.RA ?? 'F_A = ?', xA - 22, y + 66, { 'font-size': 13, 'text-anchor': 'end' });
  kraft(s, xB, y + 76, xB, y + 22, o.RB ?? 'F_B = ?', xB + 22, y + 66, { 'font-size': 13 });
  massH(s, xA, xZ, 286, `a = ${p.a}`, y + 90);
  massH(s, xA, xB, 22, `l = ${p.l}`, y - 20);
  return s;
}

/** Riemenscheibe fliegend: Scheibe im Abstand c rechts von Lager B. Draufsicht, Trume waagrecht. */
export function riemenscheibe(p: { M: number; d: number; l: number; c: number }, o: { M?: string; F1?: string; F2?: string; RA?: string; RB?: string } = {}) {
  const s = blatt(310, 'Fliegende Riemenscheibe');
  const k = 280 / (p.l + p.c), xA = 170, X = (v: number) => xA + v * k, xB = X(p.l), xP = X(p.l + p.c), y = 130, R = 58, yG = 262;
  boden(s, 50, yG, 440, 10);
  lager(s, xA, y, yG);
  lager(s, xB, y, yG);
  balken(s, xA - 70, xP + 12, y, 14);
  s.append(el('rect', { x: 40, y: y - 30, width: 56, height: 60, rx: 6, fill: '#cfe8c8', stroke: C.M }));
  txt(s, 68, y - 38, o.M ?? `M = ${p.M} N·m`, { 'text-anchor': 'middle', 'font-size': 13, fill: C.M, 'font-weight': 600 });
  txt(s, 68, y + 4, 'Motor', { 'text-anchor': 'middle', 'font-size': 12 });
  s.append(el('rect', { x: xP - 12, y: y - R, width: 24, height: 2 * R, fill: '#cfe0f3', stroke: C.STAHLRAND }));
  line(s, xP, y - R, xP + 110, y - R + 6, { stroke: '#444', 'stroke-width': 5 });
  line(s, xP, y + R, xP + 110, y + R - 6, { stroke: '#444', 'stroke-width': 5 });
  kraft(s, xP + 40, y - R + 2, xP + 40, y - R + 46, o.F1 ?? 'F_1', xP + 52, y - R + 28, { 'font-size': 13 });
  kraft(s, xP + 40, y + R - 2, xP + 40, y + R + 42, o.F2 ?? 'F_2', xP + 52, y + R + 30, { 'font-size': 13 });
  txt(s, xP + 14, y - R - 10, 'Zugtrum', { 'font-size': 12 });
  txt(s, xP + 14, y + R + 58, 'Leertrum', { 'font-size': 12 });
  txt(s, xP + 16, y + 4, `d = ${p.d}`, { fill: C.L, 'font-size': 13 });
  txt(s, xA - 6, y - 24, 'A', { 'font-weight': 600, 'text-anchor': 'end' });
  txt(s, xB + 6, y - 24, 'B', { 'font-weight': 600 });
  if (o.RA) kraft(s, xA, y + 22, xA, y + 76, o.RA, xA - 22, y + 66, { 'font-size': 13, 'text-anchor': 'end' });
  if (o.RB) kraft(s, xB, y + 76, xB, y + 22, o.RB, xB + 22, y + 66, { 'font-size': 13 });
  massH(s, xA, xB, 290, `l = ${p.l}`, y + 90);
  massH(s, xB, xP, 290, `c = ${p.c}`, y + 90);
  txt(s, 30, 26, 'Draufsicht: Riemenkräfte wirken quer zur Welle', { 'font-size': 13, fill: C.GRAU });
  return s;
}

/** Kiste auf Rampe, Seil läuft zur Winde. */
export function rampeWinde(p: { m: number; al: number; mu: number; d: number; l: number; a: number }) {
  const s = blatt(300, 'Seilwinde an der Rampe');
  const a = rad(p.al), x0 = 50, y0 = 266, L = 300, xT = x0 + L * Math.cos(a), yT = y0 - L * Math.sin(a);
  s.append(el('polygon', { points: `${x0},${y0} ${xT},${y0} ${xT},${yT}`, fill: '#e9e3d3', stroke: '#7a6a4a' }));
  const bx = x0 + L * 0.42 * Math.cos(a), by = y0 - L * 0.42 * Math.sin(a);
  const g = el('g', { transform: `rotate(${-p.al} ${bx} ${by})` });
  s.append(g);
  g.append(el('rect', { x: bx - 28, y: by - 36, width: 56, height: 36, rx: 3, fill: C.HOLZ, stroke: '#555' }));
  line(s, bx + 28 * Math.cos(a) - 18 * Math.sin(a), by - 28 * Math.sin(a) - 18 * Math.cos(a), xT + 30, yT - 20, { stroke: '#444', 'stroke-width': 2.4 });
  s.append(el('rect', { x: xT + 8, y: yT - 56, width: 92, height: 56, rx: 6, fill: '#d7dbe2', stroke: '#555' }));
  s.append(el('circle', { cx: xT + 54, cy: yT - 24, r: 20, fill: C.HOLZ, stroke: '#555' }));
  txt(s, xT + 54, yT - 64, 'Seilwinde', { 'text-anchor': 'middle', 'font-size': 12 });
  txt(s, x0 + 62, y0 - 8, `α = ${p.al}°`, { 'font-size': 14 });
  txt(s, 26, 26, `μ = ${fmt(p.mu)}`, { fill: C.F, 'font-size': 14, 'font-weight': 600 });
  txt(s, 26, 46, `Trommel d = ${p.d} mm`, { fill: C.L, 'font-size': 14 });
  txt(s, 26, 66, `Lager l = ${p.l} mm`, { fill: C.L, 'font-size': 14 });
  txt(s, 26, 86, `Trommel a = ${p.a} mm neben A`, { fill: C.L, 'font-size': 14 });
  txt(s, 26, 106, `Kiste m = ${p.m} kg`, { fill: C.F, 'font-size': 14, 'font-weight': 600 });
  return s;
}

/** Hebel mit schrägem Zug F1 links (Winkel be zum Hebel), Last F2 rechts. */
export function hebelSchraeg(p: { l1: number; l2: number; be: number; F1: number }, o: { F1?: string; F2?: string } = {}) {
  const s = blatt(280, 'Hebel mit schrägem Zug');
  const y = 130, xD = 400, k = Math.min(1.15, 190 / Math.max(p.l1, p.l2)), x1 = xD - p.l1 * k, x2 = xD + p.l2 * k, b = rad(p.be);
  balken(s, x1 - 10, x2 + 10, y, 12);
  s.append(el('polygon', { points: `${xD},${y + 6} ${xD - 18},${y + 40} ${xD + 18},${y + 40}`, fill: C.GESTELL, stroke: '#555' }));
  bolzen(s, xD, y);
  boden(s, xD - 50, y + 40, 100, 10);
  txt(s, xD + 12, y + 28, 'D', { 'font-weight': 600 });
  const ex = x1 - 110 * Math.cos(b), ey = y + 110 * Math.sin(b);
  kraft(s, x1, y, ex, ey, o.F1 ?? `F_1 = ${p.F1} N`, ex - 10, ey + 20);
  s.append(el('path', { d: `M${x1 - 50},${y} A50,50 0 0 0 ${x1 - 50 * Math.cos(b)},${y + 50 * Math.sin(b)}`, fill: 'none', stroke: C.INK }));
  txt(s, x1 - 58, y - 8, `β = ${p.be}°`, { 'font-size': 13, 'text-anchor': 'end' });
  seil(s, x2, y + 6, x2, y + 80);
  kiste(s, x2 - 22, y + 80, 44, 34);
  kraft(s, x2 + 40, y + 86, x2 + 40, y + 134, o.F2 ?? 'F_2 = ?', x2 + 50, y + 126);
  massH(s, x1, xD, y - 44, `l_1 = ${p.l1}`, y - 8);
  massH(s, xD, x2, y - 44, `l_2 = ${p.l2}`, y - 8);
  return s;
}
