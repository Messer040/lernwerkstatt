// Bauteilbilder für das Kapitel Kräfte zerlegen.
import {
  C, blatt, boden, bolzen, el, kiste, kraft, kraftWinkel, line, massH, massV, ref, seil, stab, txt,
} from '../../../core/draw/svg';
import { fmt } from '../../../core/zahl';

const rad = (a: number) => (a * Math.PI) / 180;
const LEICHT = '#e08aa9'; // helle Teilkräfte
const HALO = { stroke: '#fff', 'stroke-width': 3.5, 'paint-order': 'stroke' }; // Schrift auf Schraffur lesbar machen

type Opt = Record<string, string | boolean | number | undefined>;

function teil(s: SVGSVGElement, x1: number, y1: number, x2: number, y2: number) {
  line(s, x1, y1, x2, y2, { stroke: LEICHT, 'stroke-width': 3, 'marker-end': ref(s, 'F') });
}

/** Schräge Kraft F mit rechtwinkligen Teilkräften. al = Winkel zur Waagrechten (vert: zur Senkrechten). */
export function schraeg(p: { F: number; al: number }, o: Opt = {}) {
  const s = blatt(300, 'Schräge Kraft mit Teilkräften');
  const x0 = 170, y0 = 245, Lp = 235;
  const vert = !!o.vert, stg = (o.stage as number | undefined) ?? 2;
  const a = rad(vert ? 90 - p.al : p.al);
  const x1 = x0 + Lp * Math.cos(a), y1 = y0 - Lp * Math.sin(a);
  line(s, x0 - 30, y0, x0 + 290, y0, { stroke: C.GRAU, 'stroke-dasharray': '3 4' });
  if (vert) line(s, x0, y0 + 10, x0, y0 - 225, { stroke: C.GRAU, 'stroke-dasharray': '3 4' });
  if (vert) {
    if (stg >= 1) {
      teil(s, x0, y0, x0, y1);
      txt(s, x0 - 10, (y0 + y1) / 2, String(o.Fy ?? 'F_y'), { fill: C.F, 'text-anchor': 'end', 'font-weight': 600 });
    }
    if (stg >= 2) {
      teil(s, x0, y1, x1, y1);
      txt(s, (x0 + x1) / 2, y1 - 10, String(o.Fx ?? 'F_x'), { fill: C.F, 'text-anchor': 'middle', 'font-weight': 600 });
    }
    const r = 50;
    s.append(el('path', { d: `M${x0},${y0 - r} A${r},${r} 0 0 1 ${x0 + r * Math.cos(a)},${y0 - r * Math.sin(a)}`, fill: 'none', stroke: C.INK }));
    txt(s, x0 + 10, y0 - r - 8, `β = ${p.al}°`, { 'font-size': 14 });
    kraft(s, x0, y0, x1, y1, String(o.F ?? `F = ${p.F} N`), (x0 + x1) / 2 + 16, (y0 + y1) / 2 + 14);
  } else {
    if (stg >= 1) {
      teil(s, x0, y0, x1, y0);
      txt(s, (x0 + x1) / 2, y0 + 20, String(o.Fx ?? 'F_x'), { fill: C.F, 'text-anchor': 'middle', 'font-weight': 600 });
    }
    if (stg >= 2) {
      teil(s, x1, y0, x1, y1);
      txt(s, x1 + 10, (y0 + y1) / 2, String(o.Fy ?? 'F_y'), { fill: C.F, 'font-weight': 600 });
    }
    const r = 55;
    s.append(el('path', { d: `M${x0 + r},${y0} A${r},${r} 0 0 0 ${x0 + r * Math.cos(a)},${y0 - r * Math.sin(a)}`, fill: 'none', stroke: C.INK }));
    txt(s, x0 + r + 8, y0 - 12, String(o.alTxt ?? `α = ${p.al}°`), { 'font-size': 14 });
    kraft(s, x0, y0, x1, y1, String(o.F ?? `F = ${p.F} N`), (x0 + x1) / 2 - 14, (y0 + y1) / 2 - 12, { 'text-anchor': 'end' });
  }
  s.append(el('circle', { cx: x0, cy: y0, r: 6, fill: C.STAHL, stroke: C.STAHLRAND }));
  return s;
}

/** Zwei Schenkel (Stechzirkel oder Stehleiter) mit Last oben. */
export function spreiz(p: { al: number }, o: { typ?: 'leiter'; FG?: string; F1?: string; F2?: string } = {}) {
  const s = blatt(300, 'Zwei Schenkel mit Last an der Spitze');
  const ax = 320, ay = 66, L = 185, h = rad(p.al / 2), ux = Math.sin(h), uy = Math.cos(h), fx = L * ux, fy = ay + L * uy;
  const leiter = o.typ === 'leiter';
  boden(s, ax - fx - 60, fy, 2 * fx + 120, 12);
  stab(s, ax, ay, ax - fx, fy, leiter ? 9 : 6);
  stab(s, ax, ay, ax + fx, fy, leiter ? 9 : 6);
  if (leiter) {
    [0.3, 0.5, 0.7].forEach((t) => line(s, ax - fx * t - 7, ay + L * uy * t, ax - fx * t + 9, ay + L * uy * t, { stroke: C.STAHLRAND, 'stroke-width': 3 }));
    line(s, ax - fx * 0.62, ay + L * uy * 0.62, ax + fx * 0.62, ay + L * uy * 0.62, { stroke: '#777', 'stroke-width': 1.5 });
  }
  bolzen(s, ax, ay);
  kraft(s, ax, 8, ax, ay - 8, o.FG, ax + 10, 26);
  const seiten: [number, string, string][] = [[-1, o.F1 ?? 'F_1 = ?', 'end'], [1, o.F2 ?? 'F_2 = ?', 'start']];
  seiten.forEach(([g, lab, anc]) => {
    const nx = g * uy * 16, ny = -ux * 16;
    kraft(s, ax + g * fx * 0.42 + nx, ay + L * uy * 0.42 + ny, ax + g * fx * 0.8 + nx, ay + L * uy * 0.8 + ny, lab, ax + g * fx * 0.6 + nx * 2, ay + L * uy * 0.6 + ny * 2 + 4, { 'text-anchor': anc, 'font-size': 14 });
  });
  if (p.al < 80) {
    // enger Winkel: Beschriftung neben die Spitze, sonst liegt sie auf den Schenkeln
    s.append(el('path', { d: `M${ax - 30 * ux},${ay + 30 * uy} A30,30 0 0 0 ${ax + 30 * ux},${ay + 30 * uy}`, fill: 'none', stroke: C.INK }));
    txt(s, ax + 24, ay + 24, `α = ${p.al}°`, { 'font-size': 14 });
  } else {
    s.append(el('path', { d: `M${ax - 46 * ux},${ay + 46 * uy} A46,46 0 0 0 ${ax + 46 * ux},${ay + 46 * uy}`, fill: 'none', stroke: C.INK }));
    txt(s, ax, ay + 66, `α = ${p.al}°`, { 'text-anchor': 'middle', 'font-size': 14 });
  }
  return s;
}

/** Last an zwei gleich langen Seilen (Bild, Rohr). hw = halbe Breite, hh = Höhe (nur Verhältnis zählt). */
export function haengend(
  p: { hw: number; hh: number },
  o: { typ?: 'bild'; FG?: string; F?: string; b?: string; h?: string; L?: string } = {},
) {
  const s = blatt(310, 'Last an zwei gleich langen Seilen');
  const hx = 320, hy = 40, k = Math.min(140 / p.hw, 115 / p.hh), wx = p.hw * k, wy = p.hh * k, yL = hy + wy;
  boden(s, 260, 8, 120, 12);
  line(s, hx, 20, hx, hy, { 'stroke-width': 3, stroke: '#555' });
  seil(s, hx, hy, hx - wx, yL);
  seil(s, hx, hy, hx + wx, yL);
  bolzen(s, hx, hy);
  let yb: number;
  if (o.typ === 'bild') {
    yb = yL + 78;
    s.append(el('rect', { x: hx - wx - 12, y: yL, width: 2 * wx + 24, height: 78, fill: C.HOLZ, stroke: '#6b4f1d', 'stroke-width': 4 }));
  } else {
    yb = yL + 50;
    s.append(el('rect', { x: hx - wx - 22, y: yL, width: 2 * wx + 44, height: 50, rx: 6, fill: C.GESTELL, stroke: '#555' }));
    line(s, hx - wx - 22, yL + 12, hx + wx + 22, yL + 12, { stroke: '#777' });
    line(s, hx - wx - 22, yL + 38, hx + wx + 22, yL + 38, { stroke: '#777' });
  }
  kraft(s, hx, yL + 26, hx, yb + 30, o.FG, hx + 10, yb + 26);
  kraft(s, hx - wx * 0.75 - 14, hy + wy * 0.75 - 8, hx - wx * 0.3 - 14, hy + wy * 0.3 - 8, o.F ?? 'F = ?', hx - wx * 0.5 - 24, hy + wy * 0.5 - 12, { 'text-anchor': 'end' });
  if (o.b) massH(s, hx - wx, hx + wx, yb + 66, o.b, yb + 2);
  if (o.h) massV(s, hy, yL, hx + wx + 70, o.h, hx + wx + 4);
  if (o.L) txt(s, hx + wx * 0.5 + 16, hy + wy * 0.5 - 4, o.L, { fill: C.L, 'font-size': 14 });
  line(s, hx, hy, hx, yL, { stroke: C.GRAU, 'stroke-dasharray': '3 4' });
  txt(s, hx + 6, hy + 34, 'β', { 'font-size': 14 });
  return s;
}

/** Mast mit waagrechtem Zug und Ankerseil. */
export function mastAnker(p: { h: number; a: number }, o: { F?: string; F1?: string; F2?: string } = {}) {
  const s = blatt(300, 'Mast mit Ankerseil');
  const yG = 255, k = Math.min(180 / p.h, 170 / p.a), mx = 380, ty = yG - p.h * k, axx = mx - p.a * k;
  boden(s, 120, yG, 440, 12);
  seil(s, mx, ty, axx, yG);
  s.append(el('rect', { x: mx - 6, y: ty, width: 12, height: p.h * k + 8, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.3 }));
  bolzen(s, mx, ty);
  kraft(s, mx + 8, ty, mx + 95, ty, o.F, mx + 20, ty - 10);
  massV(s, ty, yG, mx + 130, `h = ${p.h}`, mx + 8);
  massH(s, axx, mx, yG + 34, `a = ${p.a}`, yG + 2);
  txt(s, (mx + axx) / 2 - 14, (ty + yG) / 2, o.F1 ?? 'F_1 = ?', { fill: C.F, 'font-weight': 600, 'text-anchor': 'end' });
  txt(s, mx + 14, (ty + yG) / 2 + 20, o.F2 ?? 'F_2 = ?', { fill: C.F, 'font-weight': 600 });
  txt(s, mx - 10, ty + 50, 'β', { 'font-size': 14, 'text-anchor': 'end' });
  return s;
}

/** Wanddrehkran mit schräger Strebe I und waagrechter Strebe II. */
export function kran(p: { h: number; b: number }, o: { FG?: string; F1?: string; F2?: string } = {}) {
  const s = blatt(310, 'Wanddrehkran mit zwei Streben');
  const k = Math.min(270 / p.b, 140 / p.h), wx = 190, yB = 205, yT = yB - p.h * k, tx = wx + p.b * k;
  boden(s, 165, 25, 25, 255);
  stab(s, wx, yT, tx, yB);
  stab(s, wx, yB, tx, yB);
  bolzen(s, wx, yT);
  bolzen(s, wx, yB);
  bolzen(s, tx, yB);
  seil(s, tx, yB + 6, tx, yB + 34);
  kiste(s, tx - 20, yB + 34, 40, 34);
  kraft(s, tx, yB + 68, tx, yB + 100, o.FG, tx + 10, yB + 92);
  txt(s, (wx + tx) / 2 + 8, (yT + yB) / 2 - 12, o.F1 ?? 'Strebe I', { fill: C.F, 'font-weight': 600 });
  txt(s, (wx + tx) / 2, yB + 22, o.F2 ?? 'Strebe II', { fill: C.F, 'font-weight': 600, 'text-anchor': 'middle' });
  massV(s, yT, yB, 130, `h = ${p.h}`, 165);
  massH(s, wx, tx, yT - 20, `b = ${p.b}`, yT - 8, yB - 9);
  txt(s, tx - 52, yB - 8, 'α', { 'font-size': 14 });
  return s;
}

/** Stehleiter auf geneigtem Boden. */
export function leiterSchief(p: { al: number; de: number }, o: { FG?: string } = {}) {
  const s = blatt(310, 'Stehleiter auf geneigtem Boden');
  const ax = 330, ay = 62, L = 190, bh = rad(p.al / 2 + p.de), bl = rad(p.al / 2 - p.de);
  const A = [ax - L * Math.sin(bh), ay + L * Math.cos(bh)], B = [ax + L * Math.sin(bl), ay + L * Math.cos(bl)];
  const t = Math.tan(rad(p.de)), gy = (x: number) => A[1] + (x - A[0]) * t;
  s.append(el('polygon', {
    points: `${A[0] - 70},${gy(A[0] - 70)} ${B[0] + 90},${gy(B[0] + 90)} ${B[0] + 90},300 ${A[0] - 70},300`,
    fill: ref(s, 'hat'), stroke: '#555',
  }));
  stab(s, ax, ay, A[0], A[1], 9);
  stab(s, ax, ay, B[0], B[1], 9);
  bolzen(s, ax, ay);
  kraft(s, ax, 8, ax, ay - 8, o.FG, ax + 10, 26);
  line(s, ax, ay, ax, ay + 150, { stroke: C.GRAU, 'stroke-dasharray': '3 4' });
  txt(s, ax - 8, ay + 150, 'β_1', { 'font-size': 13, 'text-anchor': 'end' });
  txt(s, ax + 6, ay + 150, 'β_2', { 'font-size': 13 });
  txt(s, (ax + A[0]) / 2 - 18, (ay + A[1]) / 2, 'Teil 1', { fill: C.F, 'font-weight': 600, 'text-anchor': 'end' });
  txt(s, (ax + B[0]) / 2 + 18, (ay + B[1]) / 2, 'Teil 2', { fill: C.F, 'font-weight': 600 });
  txt(s, 30, 40, `Öffnungswinkel α = ${p.al}°`, { 'font-size': 14 });
  txt(s, 30, 62, `Bodenneigung δ = ${p.de}°`, { 'font-size': 14 });
  return s;
}

/** Leuchte an zwei ungleich langen Seilen zwischen zwei Hauswänden. */
export function lampe(p: { w: number; d: number; H: number; l1: number; l2: number }, o: { FG?: string } = {}) {
  const s = blatt(310, 'Leuchte an zwei ungleich langen Seilen');
  const k = Math.min(400 / p.w, 130 / p.d), xa = 320 - (p.w * k) / 2, xb = 320 + (p.w * k) / 2, yh = 62;
  const x1 = Math.sqrt(p.l1 * p.l1 - p.d * p.d), lx = xa + x1 * k, ly = yh + p.d * k;
  s.append(el('rect', { x: xa - 34, y: 30, width: 34, height: 262, fill: ref(s, 'hat'), stroke: '#555' }));
  s.append(el('rect', { x: xb, y: 30, width: 34, height: 262, fill: ref(s, 'hat'), stroke: '#555' }));
  boden(s, xa, 280, xb - xa, 12);
  seil(s, xa, yh, lx, ly);
  seil(s, xb, yh, lx, ly);
  s.append(el('circle', { cx: lx, cy: ly + 12, r: 12, fill: C.HOLZ, stroke: '#555' }));
  kraft(s, lx, ly + 24, lx, ly + 70, o.FG, lx + 10, ly + 62);
  massH(s, xa, xb, 36, `w = ${p.w} m`, yh - 4);
  txt(s, (xa + lx) / 2 + 12, (yh + ly) / 2 - 2, `l_1 = ${p.l1} m`, { fill: C.L, 'font-size': 14 });
  txt(s, (xb + lx) / 2, (yh + ly) / 2 + 20, `l_2 = ${p.l2} m`, { fill: C.L, 'font-size': 14, 'text-anchor': 'middle' });
  massV(s, ly, 280, xb - 40, `H = ${p.H} m`, lx + 14);
  return s;
}

/** Spannreck von oben: vier Seile an zwei Pfosten. */
export function reck(p: { A: number; B: number; s: number; h: number; F: number }) {
  const s = blatt(310, 'Spannreck mit vier Seilen in der Draufsicht');
  const k = Math.min(360 / p.A, 190 / p.B), cx = 300, cy = 160, ax = (p.A * k) / 2, by = (p.B * k) / 2, sx = (p.s * k) / 2;
  ([[-1, -1], [1, -1], [-1, 1], [1, 1]] as const).forEach(([i, j]) => {
    seil(s, cx + i * sx, cy, cx + i * ax, cy + j * by);
    s.append(el('rect', { x: cx + i * ax - 7, y: cy + j * by - 7, width: 14, height: 14, fill: C.GESTELL, stroke: '#555' }));
  });
  stab(s, cx - sx, cy, cx + sx, cy, 6);
  bolzen(s, cx - sx, cy);
  bolzen(s, cx + sx, cy);
  massH(s, cx - ax, cx + ax, 30, `A = ${fmt(p.A)} m`, cy - by - 9);
  massV(s, cy - by, cy + by, cx - ax - 40, `B = ${fmt(p.B)} m`, cx - ax - 9);
  txt(s, cx, cy - 10, `s = ${fmt(p.s)} m`, { fill: C.L, 'text-anchor': 'middle', 'font-size': 14 });
  txt(s, cx, cy + 22, 'Reckstange', { 'text-anchor': 'middle', 'font-size': 12, fill: C.GRAU });
  txt(s, 500, 120, 'Draufsicht', { 'font-size': 13, fill: C.GRAU });
  txt(s, 500, 146, `Höhe h = ${fmt(p.h)} m`, { 'font-size': 14, fill: C.L });
  txt(s, 500, 170, `F = ${p.F} kN je Seil`, { 'font-size': 14, fill: C.F, 'font-weight': 600 });
  return s;
}

/** Dieselmotor: Kolben und schräge Pleuelstange. */
export function diesel(p: { F: number; al: number }, o: { F?: string; FN?: string; FP?: string } = {}) {
  const s = blatt(320, 'Kolben und Pleuelstange');
  const cx = 300;
  s.append(el('rect', { x: cx - 90, y: 20, width: 20, height: 200, fill: ref(s, 'hat'), stroke: '#555' }));
  s.append(el('rect', { x: cx + 70, y: 20, width: 20, height: 200, fill: ref(s, 'hat'), stroke: '#555' }));
  s.append(el('rect', { x: cx - 70, y: 70, width: 140, height: 80, rx: 4, fill: '#d7dbe2', stroke: '#555' }));
  bolzen(s, cx, 120);
  const a = rad(p.al), L = 170, e = [cx + L * Math.sin(a), 120 + L * Math.cos(a)];
  line(s, cx, 120, e[0], e[1], { stroke: C.STAHL, 'stroke-width': 18 });
  line(s, cx, 120, e[0], e[1], { stroke: C.STAHLRAND, 'stroke-width': 1 });
  txt(s, cx + 80, 180, 'Pleuelstange', { 'font-size': 12 });
  txt(s, cx - 60, 64, 'Kolben', { 'font-size': 12 });
  kraft(s, cx, 6, cx, 66, o.F ?? `F = ${p.F} kN`, cx + 10, 17);
  kraftWinkel(s, cx - 12, 120, 180, 70, o.FN ?? 'F_N = ?', { dx: -8, t: { 'text-anchor': 'end' } });
  kraftWinkel(s, e[0] - 20, e[1] - 60, -90 + p.al, 70, o.FP ?? 'F_P = ?', { dx: 10 });
  line(s, e[0], e[1], e[0], e[1] - 60, { stroke: '#777', 'stroke-dasharray': '4 3' });
  txt(s, e[0] - 24, e[1] - 30, `${p.al}°`, { 'font-size': 13, 'text-anchor': 'end' });
  return s;
}

/** V-Führung mit Schlitten. w = Öffnungswinkel. */
export function vFuehrung(p: { F: number; w: number }) {
  const s = blatt(300, 'V-Führung einer Werkzeugmaschine');
  const cx = 320, yv = 170, h = 90, ha = rad(p.w / 2), dx = h * Math.tan(ha);
  s.append(el('polygon', { points: `120,${yv - h} ${cx - dx},${yv - h} ${cx},${yv} ${cx + dx},${yv - h} 520,${yv - h} 520,40 120,40`, fill: C.STAHL, stroke: C.STAHLRAND }));
  s.append(el('polygon', { points: `120,${yv - h + 6} ${cx - dx},${yv - h + 6} ${cx},${yv + 6} ${cx + dx},${yv - h + 6} 520,${yv - h + 6} 520,280 120,280`, fill: ref(s, 'hat'), stroke: '#555' }));
  txt(s, 140, 60, 'Schlitten', { 'font-size': 12 });
  txt(s, 140, 270, 'Bett', { 'font-size': 12 });
  kraft(s, cx, 40, cx, 110, `F = ${fmt(p.F)} kN`, cx + 10, 60);
  const m1 = [cx - dx / 2, yv - h / 2], m2 = [cx + dx / 2, yv - h / 2];
  // Normalkräfte stehen senkrecht auf den Flanken und zeigen vom Bett zum Schlitten
  const t1 = [m1[0] - 60 * Math.cos(ha), m1[1] + 60 * Math.sin(ha)], t2 = [m2[0] + 60 * Math.cos(ha), m2[1] + 60 * Math.sin(ha)];
  kraft(s, t1[0], t1[1], m1[0], m1[1], 'F_N1 = ?', t1[0] - 6, t1[1] + 20, { 'font-size': 13, 'text-anchor': 'end', ...HALO });
  kraft(s, t2[0], t2[1], m2[0], m2[1], 'F_N2 = ?', t2[0] + 6, t2[1] + 20, { 'font-size': 13, ...HALO });
  txt(s, cx, yv + 30, `${p.w}°`, { 'text-anchor': 'middle', 'font-size': 14 });
  return s;
}

/** Schrägstirnrad von vorne mit Normalkraft und Teilkräften. */
export function schraegrad(p: { be: number; FN: number | string }, o: { FN?: string } = {}) {
  const s = blatt(280, 'Schrägstirnrad: Zahnflanken von vorne');
  const x0 = 200, y0 = 40, W = 240, H = 200, b = rad(p.be);
  s.append(el('rect', { x: x0, y: y0, width: W, height: H, fill: C.STAHL, stroke: C.STAHLRAND }));
  for (let x = x0 + 6; x + H * Math.tan(b) < x0 + W; x += 24) line(s, x, y0, x + H * Math.tan(b), y0 + H, { stroke: C.STAHLRAND });
  const c = [x0 + W / 2, y0 + H / 2 - 30], L = 130;
  kraft(s, c[0], c[1], c[0] + L * Math.sin(b), c[1] + L * Math.cos(b), o.FN ?? `F_N = ${p.FN} N`, c[0] + L * Math.sin(b) + 8, c[1] + L * Math.cos(b), HALO);
  kraft(s, c[0], c[1], c[0], c[1] + L * Math.cos(b), 'F_u = ?', c[0] - 8, c[1] + L * Math.cos(b) - 6, { 'text-anchor': 'end', ...HALO });
  kraft(s, c[0], c[1], c[0] + L * Math.sin(b), c[1], 'F_a = ?', c[0] + L * Math.sin(b) + 6, c[1] - 6, HALO);
  line(s, c[0], c[1], c[0], c[1] - 40, { stroke: '#777', 'stroke-dasharray': '4 3' });
  txt(s, c[0] + 14, c[1] + 34, `β = ${p.be}°`, { 'font-size': 13, ...HALO });
  txt(s, 30, 30, 'Schrägstirnrad (Zahnflanken von vorne)', { 'font-size': 13 });
  return s;
}

/** Keilspanner: Baugruppe auf einem Keil, links waagrecht geführt. */
export function keil(p: { FG: number; al: number }) {
  const s = blatt(310, 'Keilspanner mit Baugruppe');
  const a = rad(p.al), yb = 230, x1 = 200, x2 = 470, yT = yb - (x2 - x1) * Math.tan(a);
  s.append(el('rect', { x: 60, y: 40, width: 40, height: 220, fill: ref(s, 'hat'), stroke: '#555' }));
  s.append(el('rect', { x: 60, y: yb, width: 500, height: 30, fill: ref(s, 'hat'), stroke: '#555' }));
  s.append(el('polygon', { points: `${x1},${yb} ${x2},${yb} ${x2},${yT}`, fill: C.GESTELL, stroke: '#555' }));
  s.append(el('polygon', { points: `100,${yb - 20} 100,60 ${x2},60 ${x2},${yT - 4} ${x1},${yb - 4} ${x1},${yb - 20}`, fill: C.STAHL, stroke: C.STAHLRAND }));
  line(s, 100, yb - 12, x1 + 60, yb - 12, { stroke: '#555', 'stroke-width': 8 });
  txt(s, 120, yb - 24, 'Schraube', { 'font-size': 12 });
  kraft(s, 330, 10, 330, 58, `F_G = ${p.FG} kN`, 340, 30);
  kraft(s, 60, 100, 98, 100, 'F_NA', 54, 92, { 'text-anchor': 'end', 'font-size': 13 });
  const m = [(x1 + x2) / 2 + 40, yb - ((x2 - x1) / 2 + 40) * Math.tan(a)];
  // F_NB: Kraft des Keils auf die Baugruppe, senkrecht zur Keilfläche nach oben links
  kraft(s, m[0], m[1], m[0] - 55 * Math.sin(a), m[1] - 55 * Math.cos(a), 'F_NB', m[0] - 55 * Math.sin(a) - 8, m[1] - 55 * Math.cos(a) - 4, { 'font-size': 13, 'text-anchor': 'end' });
  kraft(s, x2 - 40, yb + 60, x2 - 40, yb + 4, 'F_NC', x2 - 30, yb + 56, { 'font-size': 13 });
  kraft(s, x1 + 80, yb - 12, x1 + 20, yb - 12, 'F', x1 + 86, yb - 26, { 'font-size': 13 });
  txt(s, x2 + 8, yb - 8, `α = ${p.al}°`, { 'font-size': 13 });
  return s;
}

/** Kniehebel einer Schliesseinheit. al = Winkel der Hebel zur Waagrechten. */
export function kniehebel(p: { F: number; al: number }) {
  const s = blatt(300, 'Kniehebel mit Kolben und Werkzeug');
  const cy = 110, L = 150, a = rad(p.al), jx = 320, jy = cy + L * Math.sin(a), xL = jx - L * Math.cos(a), xR = jx + L * Math.cos(a);
  s.append(el('rect', { x: xL - 40, y: cy - 60, width: 30, height: 120, fill: ref(s, 'hat'), stroke: '#555' }));
  s.append(el('rect', { x: xR + 10, y: cy - 60, width: 24, height: 120, fill: C.STAHL, stroke: C.STAHLRAND }));
  s.append(el('rect', { x: xR + 34, y: cy - 40, width: 50, height: 80, fill: '#f0c987', stroke: '#6b4f1d' }));
  txt(s, xR + 59, cy - 68, 'Werkzeug', { 'font-size': 12, 'text-anchor': 'middle' });
  line(s, xL - 10, cy, jx, jy, { stroke: '#777', 'stroke-width': 10 });
  line(s, jx, jy, xR + 10, cy, { stroke: '#777', 'stroke-width': 10 });
  [xL - 10, jx, xR + 10].forEach((x, i) => bolzen(s, x, i === 1 ? jy : cy));
  txt(s, (xL + jx) / 2 - 10, (cy + jy) / 2 + 26, '1', { 'font-weight': 600 });
  txt(s, (xR + jx) / 2 + 10, (cy + jy) / 2 + 26, '2', { 'font-weight': 600 });
  s.append(el('rect', { x: jx - 14, y: jy + 8, width: 28, height: 90, fill: '#d7dbe2', stroke: '#555' }));
  kraft(s, jx + 30, jy + 90, jx + 30, jy + 20, `F = ${p.F} kN (Kolben)`, jx + 40, jy + 70, { 'font-size': 13 });
  line(s, xL - 10, cy, xR + 10, cy, { stroke: '#777', 'stroke-dasharray': '4 3' });
  txt(s, xR - 50, cy + 18, 'α', { 'font-size': 14 });
  kraft(s, xR + 90, cy, xR + 140, cy, 'F_s = ?', xR + 92, cy - 12, { 'font-size': 13 });
  return s;
}

/** Straff gespannte Leine mit Last in der Mitte. al = Durchhang-Winkel zur Waagrechten. */
export function leine(p: { al: number; FG?: number }, o: { FG?: string; FS?: string; alTxt?: string } = {}) {
  const s = blatt(280, 'Gespannte Leine mit Last in der Mitte');
  const y = 60, a = rad(p.al), xL = 110, xR = 530, xm = 320, ym = y + (xm - xL) * Math.tan(a);
  boden(s, 60, 250, 520, 10);
  [xL, xR].forEach((x) => s.append(el('rect', { x: x - 8, y: y - 10, width: 16, height: 260 - y, fill: C.GESTELL, stroke: '#555' })));
  line(s, xL, y, xm, ym, { stroke: '#444', 'stroke-width': 2.5 });
  line(s, xm, ym, xR, y, { stroke: '#444', 'stroke-width': 2.5 });
  kiste(s, xm - 22, ym + 6, 44, 36);
  kraft(s, xm, ym + 44, xm, ym + 90, o.FG ?? `F_G = ${p.FG} N`, xm + 10, ym + 80);
  line(s, xL, y, xL + 120, y, { stroke: '#777', 'stroke-dasharray': '4 3' });
  txt(s, xL + 60, y - 8, o.alTxt ?? `α = ${p.al}°`, { 'font-size': 13 });
  kraftWinkel(s, xm, ym, 180 - p.al, 70, o.FS ?? 'F_S = ?', { dy: 30, dx: -6, t: { 'text-anchor': 'end' } });
  return s;
}
