// Bauteilbilder für das Kapitel «An der Wand».
import { C, blatt, boden, bolzen, el, kiste, kraft, line, massH, massV, ref, seil, stab, txt } from '../../../core/draw/svg';
import { fmt } from '../../../core/zahl';

const rad = (a: number) => (a * Math.PI) / 180;
/** Schraffierte Wand links von x (Breite 30). */
const wand = (s: SVGSVGElement, x: number, y1: number, y2: number) => boden(s, x - 30, y1, 30, y2 - y1);

/** Haken in der Wand, Seil zieht schräg nach unten. al = Winkel zur Wand. */
export function haken(p: { F: number; al: number }, o: { F?: string; al?: string; comp?: boolean } = {}) {
  const s = blatt(300, 'Haken in der Wand mit schrägem Seil');
  const a = rad(p.al), ux = Math.sin(a), uy = Math.cos(a), hx = 206, hy = 90;
  wand(s, 200, 15, 290);
  s.append(el('rect', { x: 168, y: hy - 4, width: 34, height: 8, fill: '#777', stroke: '#444' }));
  s.append(el('circle', { cx: hx, cy: hy, r: 6, fill: 'none', stroke: '#444', 'stroke-width': 3 }));
  line(s, hx, hy, hx + ux * 230, hy + uy * 230, { stroke: '#444', 'stroke-width': 2 });
  kraft(s, hx, hy, hx + ux * 125, hy + uy * 125, o.F ?? `F = ${p.F} N`, hx + ux * 125 + 10, hy + uy * 125);
  line(s, hx, hy, hx, hy + 190, { stroke: C.GRAU, 'stroke-dasharray': '4 4' });
  s.append(el('path', { d: `M${hx},${hy + 58} A58,58 0 0 0 ${hx + 58 * ux},${hy + 58 * uy}`, fill: 'none', stroke: C.INK }));
  const lx = o.comp ? hx + ux * 125 + 14 : hx + 66 * ux + 14 * Math.cos(a);
  const ly = o.comp ? hy + 34 : hy + 66 * uy - 14 * Math.sin(a) + 4;
  txt(s, lx, ly, o.al ?? `α = ${p.al}°`, { 'font-size': 14 });
  txt(s, 120, hy - 14, 'Dübel', { 'font-size': 12, fill: C.GRAU });
  txt(s, 215, 282, 'Wand', { 'font-size': 12, fill: C.GRAU });
  if (o.comp) {
    line(s, hx, hy, hx + ux * 125, hy, { stroke: '#e08aa9', 'stroke-width': 3, 'marker-end': ref(s, 'F') });
    line(s, hx + ux * 125, hy, hx + ux * 125, hy + uy * 125, { stroke: '#e08aa9', 'stroke-width': 3, 'marker-end': ref(s, 'F') });
    txt(s, hx + ux * 62, hy - 8, 'F_A', { fill: C.F, 'font-weight': 600, 'text-anchor': 'middle' });
    txt(s, hx + ux * 125 + 12, hy + uy * 125 - 28, 'F_Q', { fill: C.F, 'font-weight': 600 });
  }
  return s;
}

/** Wandkonsole: waagrechter Zugstab oben, schräge Druckstrebe unten. */
export function konsole(p: { F: number; b: number; h: number }, o: { Z?: string; D?: string } = {}) {
  const s = blatt(300, 'Wandkonsole mit Zugstab und Druckstrebe');
  const k = Math.min(360 / p.b, 170 / p.h), yT = 90, xE = 110 + p.b * k, yB = yT + p.h * k;
  wand(s, 110, 20, 290);
  stab(s, 110, yT, xE, yT);
  stab(s, 110, yB, xE, yT);
  [[110, yT], [110, yB], [xE, yT]].forEach(([x, y]) => bolzen(s, x, y));
  kiste(s, xE - 24, yT - 48, 48, 40);
  kraft(s, xE, yT - 30, xE, yT + 60, `F = ${p.F} N`, xE + 16, yT + 52);
  txt(s, (110 + xE) / 2 - 10, yT - 12, o.Z ?? 'Zugstab: F_Z = ?', { fill: C.F, 'font-weight': 600, 'text-anchor': 'middle', 'font-size': 14 });
  txt(s, xE - 14, (yT + yB) / 2 + 46, o.D ?? 'Druckstrebe: F_D = ?', { fill: C.F, 'font-weight': 600, 'font-size': 14, 'text-anchor': 'end' });
  massV(s, yT, yB, 48, `h = ${p.h}`, 110);
  massH(s, 110, xE, yB + 34, `b = ${p.b}`, yB + 8, yT + 8);
  return s;
}

/** Wandwinkel, oben angeschraubt, unten an der Kippkante K. */
export function schraubK(p: { F: number; a: number; h: number }, o: { S?: string } = {}) {
  const s = blatt(300, 'Wandwinkel mit Schrauben und Kippkante');
  const k = Math.min(330 / p.a, 170 / p.h), yTop = 80, yS = yTop + 16, yK = yS + p.h * k, xL = 150 + p.a * k, xE = xL + 40;
  wand(s, 150, 20, 290);
  s.append(el('rect', { x: 150, y: yTop, width: 12, height: yK - yTop, fill: C.STAHL, stroke: C.STAHLRAND }));
  s.append(el('rect', { x: 150, y: yTop, width: xE - 150, height: 12, fill: C.STAHL, stroke: C.STAHLRAND }));
  line(s, 162, yK - 14, xE - 30, yTop + 12, { stroke: C.STAHLRAND, 'stroke-width': 4 });
  s.append(el('rect', { x: 112, y: yS - 4, width: 50, height: 8, fill: '#555' }));
  s.append(el('rect', { x: 162, y: yS - 8, width: 7, height: 16, fill: '#555' }));
  s.append(el('circle', { cx: 150, cy: yK, r: 5, fill: '#fff', stroke: C.INK }));
  txt(s, 160, yK + 18, 'Kippkante K', { 'font-size': 13, fill: C.M });
  kiste(s, xL - 24, yTop - 42, 48, 42);
  kraft(s, xL, yTop - 22, xL, yTop + 60, `F = ${p.F} N`, xL + 16, yTop + 54);
  kraft(s, 240, yS + 30, 172, yS + 30, o.S ?? 'F_S = ?', 246, yS + 35);
  txt(s, 176, yS + 16, 'Schraubenkraft', { 'font-size': 12, fill: C.GRAU });
  massV(s, yS, yK, 78, `h = ${p.h}`, 150);
  massH(s, 150, xL, yTop - 62, `a = ${p.a}`, yTop - 4, yTop - 46);
  return s;
}

/** Tür an zwei Scharnieren. */
export function tuer(p: { FG: number; b: number; h: number }, o: { O?: string; U?: string; V?: string; h?: string } = {}) {
  const s = blatt(310, 'Tür an zwei Scharnieren');
  const k = Math.min(330 / p.b, 170 / p.h), yO = 62, yU = yO + p.h * k, xR = 124 + Math.max(p.b * k, 230), xS = (124 + xR) / 2, yS = (yO + yU) / 2;
  wand(s, 120, 20, 300);
  s.append(el('rect', { x: 124, y: yO - 18, width: xR - 124, height: yU - yO + 36, fill: '#f3e3c3', stroke: '#6b4f1d', 'stroke-width': 2 }));
  [yO, yU].forEach((y) => s.append(el('rect', { x: 116, y: y - 9, width: 14, height: 18, rx: 2, fill: '#555' })));
  s.append(el('circle', { cx: xS, cy: yS, r: 5, fill: '#fff', stroke: C.INK }));
  txt(s, xS + 8, yS - 8, 'S', { 'font-weight': 600, 'font-size': 13 });
  kraft(s, xS, yS, xS, yS + 62, `F_G = ${p.FG} N`, xS + 16, yS + 56);
  kraft(s, 196, yO, 134, yO, o.O ?? 'F_O = ?', 206, yO + 5);
  kraft(s, 134, yU, 196, yU, o.U ?? 'F_U = ?', 208, yU + 5);
  kraft(s, 140, yU + 52, 140, yU + 12, o.V ?? 'F_V = ?', 154, yU + 44);
  massV(s, yO, yU, 62, o.h ?? `h = ${p.h}`, 120);
  massH(s, 124, xR, yO - 38, `b = ${p.b}`, yO - 20);
  return s;
}

/** Leiter an glatter Wand mit Person. */
export function leiter(
  p: { L: number; al: number; FG: number; FL: number; s: number },
  o: { FG?: string; FL?: string; W?: string; N?: string; R?: string } = {},
) {
  const s = blatt(310, 'Leiter an glatter Wand mit Person');
  const a = rad(p.al), yG = 262, xW = 470;
  const k = Math.min(330 / (p.L * Math.cos(a)), 220 / (p.L * Math.sin(a)));
  const xF = xW - p.L * Math.cos(a) * k, yT = yG - p.L * Math.sin(a) * k;
  const P = (t: number): [number, number] => [xF + (xW - xF) * t, yG + (yT - yG) * t];
  s.append(el('rect', { x: xW, y: 20, width: 30, height: yG - 20, fill: ref(s, 'hat'), stroke: '#555' }));
  boden(s, 50, yG, 450, 12);
  stab(s, xF, yG, xW, yT, 9);
  [0.2, 0.4, 0.6, 0.8].forEach((t) => {
    const [x, y] = P(t);
    s.append(el('circle', { cx: x, cy: y, r: 2.5, fill: C.STAHLRAND }));
  });
  const [px, py] = P(p.s / p.L), [mx, my] = P(0.5);
  s.append(el('circle', { cx: px, cy: py - 30, r: 9, fill: C.HOLZ, stroke: '#555' }));
  s.append(el('rect', { x: px - 9, y: py - 21, width: 18, height: 22, rx: 4, fill: C.HOLZ, stroke: '#555' }));
  kraft(s, px, py - 12, px, py + 38, o.FG ?? 'F_G', px - 16, py + 8, { 'font-size': 13, 'text-anchor': 'end' });
  kraft(s, mx, my, mx, my + 46, o.FL ?? 'F_L', mx + 16, my + 44, { 'font-size': 13 });
  kraft(s, xW, yT, xW - 66, yT, o.W ?? 'F_W = ?', xW - 70, yT - 8, { 'text-anchor': 'end' });
  kraft(s, xF, yG + 46, xF, yG + 4, o.N ?? 'F_N = ?', xF + 16, yG + 40);
  kraft(s, xF - 76, yG - 6, xF - 6, yG - 6, o.R ?? 'F_R', xF - 80, yG - 12, { 'text-anchor': 'end' });
  s.append(el('path', { d: `M${xF + 46},${yG} A46,46 0 0 0 ${xF + 46 * Math.cos(a)},${yG - 46 * Math.sin(a)}`, fill: 'none', stroke: C.INK }));
  txt(s, xF + 52, yG - 8, `α = ${p.al}°`, { 'font-size': 13 });
  txt(s, 30, 30, `Leiterlänge L = ${fmt(p.L)} m`, { fill: C.L, 'font-size': 14 });
  txt(s, 30, 52, `Person bei s = ${fmt(p.s)} m (ab Fuss)`, { fill: C.L, 'font-size': 14 });
  txt(s, 30, 74, `Person: F_G = ${p.FG} N`, { fill: C.F, 'font-size': 14, 'font-weight': 600 });
  txt(s, 30, 96, `Leiter: F_L = ${p.FL} N (in der Mitte)`, { fill: C.F, 'font-size': 14, 'font-weight': 600 });
  txt(s, 30, 118, 'Wand glatt (ohne Reibung)', { 'font-size': 13, fill: C.GRAU });
  return s;
}

/** Waagrechter Ausleger mit Seil, Last und Eigengewicht. */
export function ausleger(p: { L: number; h: number; a: number; F: number; FE: number }) {
  const s = blatt(310, 'Wandausleger mit Seilabspannung');
  const k = Math.min(440 / p.L, 140 / p.h), yA = 170, xE = 100 + p.L * k, xL = 100 + p.a * k, xM = 100 + (p.L * k) / 2, yT = yA - p.h * k;
  wand(s, 100, 15, 300);
  seil(s, xE, yA, 100, yT);
  stab(s, 100, yA, xE, yA, 9);
  bolzen(s, 100, yA);
  bolzen(s, 100, yT);
  bolzen(s, xE, yA);
  seil(s, xL, yA + 5, xL, yA + 26);
  kiste(s, xL - 18, yA + 26, 36, 30);
  kraft(s, xL, yA + 56, xL, yA + 92, `F = ${p.F} kN`, xL + 16, yA + 86, { 'font-size': 14 });
  kraft(s, xM, yA, xM, yA + 46, `F_E = ${fmt(p.FE)} kN`, xM - 16, yA + 40, { 'text-anchor': 'end', 'font-size': 13 });
  txt(s, (100 + xE) / 2 + 10, (yA + yT) / 2 - 8, 'Seil: F_S = ?', { fill: C.F, 'font-weight': 600 });
  txt(s, 110, yA + 26, 'A', { 'font-weight': 600 });
  massV(s, yT, yA, 46, `h = ${p.h}`, 100);
  massH(s, 100, xL, yA + 112, `a = ${p.a}`, yA + 8);
  massH(s, 100, xE, yA + 134, `L = ${p.L}`, yA + 8);
  return s;
}
