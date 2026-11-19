// Bauteilbilder für das Kapitel Kräfte addieren.
import {
  C, blatt, boden, bolzen, el, kiste, kraft, kraftWinkel, line, resultierende, seil, txt,
} from '../../../core/draw/svg';
import { fmt } from '../../../core/zahl';

const rad = (a: number) => (a * Math.PI) / 180;

export interface WKraft { F: number; dir: 1 | -1; lab?: string; pl?: string }

/** Wagen mit Kräften auf einer Wirkungslinie, optional mit Kräfteplan darunter. */
export function wagen(fs: WKraft[], o: { plan?: boolean; R?: string } = {}) {
  const n = fs.length;
  const s = blatt(o.plan ? 215 + n * 18 + 52 : 185, 'Wagen mit Kräften auf einer Wirkungslinie');
  boden(s, 110, 147, 420, 10);
  s.append(el('rect', { x: 275, y: 80, width: 90, height: 50, rx: 4, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.3 }));
  [295, 345].forEach((x) => s.append(el('circle', { cx: x, cy: 138, r: 9, fill: '#555' })));
  const sc = 150 / Math.max(...fs.map((q) => q.F), 1);
  let nr = 0, nl = 0;
  fs.forEach((q) => {
    if (q.F <= 0) return;
    if (q.dir > 0) {
      const y = 95 + nr++ * 26;
      kraft(s, 365, y, 365 + q.F * sc, y, q.lab, 365 + q.F * sc + 8, y + 5);
    } else {
      const y = 95 + nl++ * 26;
      kraft(s, 275, y, 275 - q.F * sc, y, q.lab, 275 - q.F * sc - 8, y + 5, { 'text-anchor': 'end' });
    }
  });
  if (o.plan) {
    txt(s, 20, 196, 'Kräfteplan: Kräfte aneinanderreihen', { 'font-size': 13, fill: C.GRAU });
    let v = 0;
    const pts = [0];
    fs.forEach((q) => { v += q.dir * q.F; pts.push(v); });
    const mn = Math.min(...pts), mx = Math.max(...pts), k = 380 / Math.max(mx - mn, 1), X = (u: number) => 130 + (u - mn) * k;
    line(s, X(0), 204, X(0), 215 + n * 18 + 16, { stroke: C.GRAU, 'stroke-dasharray': '3 3' });
    fs.forEach((q, i) => {
      if (q.F > 0) kraft(s, X(pts[i]), 215 + i * 18, X(pts[i + 1]), 215 + i * 18, q.pl ?? (q.lab && !q.lab.includes('=') ? q.lab : ''), (X(pts[i]) + X(pts[i + 1])) / 2, 215 + i * 18 - 5, { 'text-anchor': 'middle', 'font-size': 12 });
    });
    const y = 215 + n * 18 + 6;
    if (Math.abs(v) > 1e-9) resultierende(s, X(0), y, X(v), y, o.R ?? '', Math.max(X(0), X(v)) + 12, y + 5);
    else {
      s.append(el('circle', { cx: X(0), cy: y, r: 5, fill: C.R }));
      txt(s, X(0) + 12, y + 5, o.R ?? '', { fill: C.R, 'font-weight': 600 });
    }
  }
  return s;
}

/** Zwei rechtwinklige Kräfte. show: 0 = nur Kräfte, 1 = mit Rechteck, 2 = mit Resultierender und Winkel. */
export function rechtwinklig(p: { F1: number; F2: number }, show: 0 | 1 | 2 = 0, ohneZahlen = false) {
  const s = blatt(290, 'Zwei rechtwinklige Kräfte an einem Punkt');
  const x0 = 170, y0 = 240, sc = Math.min(300 / p.F1, 170 / p.F2), x1 = x0 + p.F1 * sc, y1 = y0 - p.F2 * sc;
  s.append(el('circle', { cx: x0, cy: y0, r: 7, fill: C.STAHL, stroke: C.STAHLRAND }));
  if (show >= 1) {
    line(s, x1, y0, x1, y1, { stroke: C.GRAU, 'stroke-dasharray': '5 4' });
    line(s, x0, y1, x1, y1, { stroke: C.GRAU, 'stroke-dasharray': '5 4' });
  }
  if (show >= 2) {
    resultierende(s, x0, y0, x1, y1, ohneZahlen ? 'F_r' : `F_r = ${fmt(Math.hypot(p.F1, p.F2))} N`, x1 + 12, y1 + 4);
    const a = Math.atan2(p.F2, p.F1);
    s.append(el('path', { d: `M${x0 + 46},${y0} A46,46 0 0 0 ${x0 + 46 * Math.cos(a)},${y0 - 46 * Math.sin(a)}`, fill: 'none', stroke: C.INK }));
    txt(s, x0 + 52, y0 - 10, 'α', { 'font-size': 14 });
  }
  kraft(s, x0, y0, x1, y0, ohneZahlen ? 'F_1' : `F_1 = ${p.F1} N`, x1 + 8, y0 + 5);
  kraft(s, x0, y0, x0, y1, ohneZahlen ? 'F_2' : `F_2 = ${p.F2} N`, x0 - 10, y1 - 8, { 'text-anchor': 'middle' });
  return s;
}

/** Spannzylinder mit Rückholfeder. */
export function spannzylinder(p: { F1: number; F2: number }, o: { Fr?: string } = {}) {
  const s = blatt(230, 'Spannzylinder mit Rückholfeder');
  const y = 110;
  boden(s, 20, 30, 50, 160);
  s.append(el('rect', { x: 70, y: y - 36, width: 70, height: 72, rx: 6, fill: C.STAHL, stroke: C.STAHLRAND }));
  line(s, 140, y, 250, y, { stroke: '#555', 'stroke-width': 10 });
  s.append(el('rect', { x: 240, y: y - 56, width: 200, height: 112, fill: '#e6eef7', stroke: C.STAHLRAND }));
  s.append(el('rect', { x: 400, y: y - 52, width: 26, height: 104, fill: C.STAHL, stroke: C.STAHLRAND }));
  let d = `M250,${y}`;
  for (let i = 1; i <= 10; i++) d += ` L${250 + 15 * i},${y + (i % 2 ? -22 : 22)}`;
  s.append(el('path', { d, fill: 'none', stroke: '#555', 'stroke-width': 1.6 }));
  txt(s, 320, y - 64, 'Rückholfeder', { 'font-size': 12, 'text-anchor': 'middle' });
  txt(s, 413, y - 64, 'Kolben', { 'font-size': 12, 'text-anchor': 'middle' });
  kraft(s, 540, y, 432, y, `F_1 = ${p.F1} N`, 546, y + 5);
  kraft(s, 390, y + 40, 320, y + 40, `F_2 = ${p.F2} N (Feder)`, 360, y + 70, { 'text-anchor': 'middle', 'font-size': 13 });
  resultierende(s, 230, y - 20, 150, y - 20, o.Fr ?? 'F_r = ?', 150, y - 40);
  txt(s, 96, y + 60, 'Werkstück', { 'font-size': 12, 'text-anchor': 'middle' });
  return s;
}

/** Mast von oben mit zwei rechtwinkligen Drähten. res = Resultierende und Spannseil zeigen. */
export function mast(p: { F1: number; F2: number; a1: number }, o: { res?: boolean } = {}) {
  const s = blatt(300, 'Mast in der Draufsicht mit zwei Drahtzügen');
  const cx = 280, cy = 150;
  s.append(el('circle', { cx, cy, r: 24, fill: '#d7dbe2', stroke: '#555' }));
  txt(s, cx - 30, cy - 70, 'Mast (Draufsicht)', { 'font-size': 12, 'text-anchor': 'end' });
  const k = 110 / Math.max(p.F1, p.F2);
  kraftWinkel(s, cx, cy, p.a1, p.F1 * k + 24, `F_1 = ${p.F1} N`);
  kraftWinkel(s, cx, cy, p.a1 - 90, p.F2 * k + 24, `F_2 = ${p.F2} N`, { dy: 16 });
  line(s, cx, cy - 60, cx, cy - 24, { stroke: '#777', 'stroke-dasharray': '4 3' });
  s.append(el('path', { d: `M${cx},${cy - 50} A50,50 0 0 1 ${cx + 50 * Math.cos(rad(p.a1))},${cy - 50 * Math.sin(rad(p.a1))}`, fill: 'none', stroke: C.INK }));
  txt(s, cx + 12, cy - 56, `${90 - p.a1}°`, { 'font-size': 13 });
  txt(s, cx + 44, cy + 6, '90°', { 'font-size': 13 });
  if (o.res) {
    const Fr = Math.hypot(p.F1, p.F2), ar = p.a1 - (Math.atan2(p.F2, p.F1) * 180) / Math.PI;
    kraftWinkel(s, cx, cy, ar, Fr * k * 0.75 + 24, `F_r = ${fmt(Fr)} N`, { res: true });
    const e = [cx - 150 * Math.cos(rad(ar)), cy + 150 * Math.sin(rad(ar))];
    line(s, cx, cy, e[0], e[1], { stroke: '#555', 'stroke-width': 2.5, 'stroke-dasharray': '8 4' });
    txt(s, e[0], e[1] + 22, 'Spannseil', { 'font-size': 13, 'text-anchor': 'middle' });
  }
  return s;
}

/** Seilrolle mit hängender Last. al = Neigung des Zugseils zur Senkrechten. */
export function seilrolle(p: { FG: number; al: number }, o: { res?: boolean } = {}) {
  const s = blatt(310, 'Seilrolle mit Last und schräg gezogenem Seil');
  const cx = 330, cy = 170, r = 55;
  s.append(el('rect', { x: cx - 8, y: 60, width: 16, height: cy - 60, fill: C.GESTELL, stroke: '#555' }));
  const aR = rad(p.al);
  const t1 = [cx + r, cy], t2 = [cx - r * Math.cos(aR), cy - r * Math.sin(aR)];
  s.append(el('circle', { cx, cy, r, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.5 }));
  bolzen(s, cx, cy);
  s.append(el('path', { d: `M${t1[0]},${t1[1]} A${r},${r} 0 0 0 ${t2[0]},${t2[1]}`, fill: 'none', stroke: '#444', 'stroke-width': 3 }));
  seil(s, t1[0], t1[1], t1[0], cy + 70);
  kiste(s, t1[0] - 24, cy + 70, 48, 40);
  kraft(s, t1[0] + 40, cy + 70, t1[0] + 40, cy + 120, `F_G = ${p.FG} N`, t1[0] + 48, cy + 110);
  const L = 90, e = [t2[0] - L * Math.sin(aR), t2[1] - L * Math.cos(aR)];
  line(s, t2[0], t2[1], e[0], e[1], { stroke: '#444', 'stroke-width': 3 });
  kraftWinkel(s, e[0], e[1], 90 + p.al, 40, 'F = F_G', { dx: -12, dy: -2, t: { 'text-anchor': 'end' } });
  line(s, t2[0], t2[1], t2[0], t2[1] - 80, { stroke: '#777', 'stroke-dasharray': '4 3' });
  txt(s, t2[0] - 6, t2[1] - 70, `${p.al}°`, { 'font-size': 13, 'text-anchor': 'end' });
  if (o.res) kraftWinkel(s, cx, cy, (-90 + (90 + p.al)) / 2, 80, `F_r = ${fmt(2 * p.FG * Math.cos(rad((180 - p.al) / 2)))} N`, { res: true });
  return s;
}

/** Hubseil mit zwei Strängen am Behälter. */
export function hubseil(p: { al: number; F: number }, o: { FG?: string; F?: string; note?: string } = {}) {
  const s = blatt(300, 'Zweisträngiges Hubseil mit Behälter');
  const hx = 320, hy = 40, a = rad(p.al / 2), L = 130, yb = hy + L * Math.cos(a), xl = hx - L * Math.sin(a), xr = hx + L * Math.sin(a);
  s.append(el('path', { d: `M${hx},${hy - 26} l0,14 a10,10 0 1 0 -10,10`, fill: 'none', stroke: '#444', 'stroke-width': 3 }));
  line(s, hx, hy, xl, yb, { stroke: '#444', 'stroke-width': 2.5 });
  line(s, hx, hy, xr, yb, { stroke: '#444', 'stroke-width': 2.5 });
  kiste(s, xl - 30, yb, xr - xl + 60, 70);
  txt(s, hx, yb + 40, 'Behälter', { 'text-anchor': 'middle', 'font-size': 13 });
  kraft(s, hx, yb + 74, hx, yb + 120, o.FG ?? 'F_G = ?', hx + 10, yb + 110);
  s.append(el('path', { d: `M${hx - 30 * Math.sin(a)},${hy + 30 * Math.cos(a)} A30,30 0 0 0 ${hx + 30 * Math.sin(a)},${hy + 30 * Math.cos(a)}`, fill: 'none', stroke: C.INK }));
  txt(s, hx, hy + 52, `α = ${p.al}°`, { 'text-anchor': 'middle', 'font-size': 13 });
  kraftWinkel(s, xr, yb, 90 - p.al / 2, 60, o.F ?? `F = ${p.F} kN`, { dx: 6 });
  txt(s, 30, 30, o.note ?? 'Seil: Tragkraft je Strang', { 'font-size': 13 });
  return s;
}

/** Zwei Personen ziehen an einer Kiste, Seile im Winkel g2. */
export function zweiPersonen(p: { F1: number; F2: number; g2: number }) {
  const s = blatt(300, 'Kiste mit zwei Seilen im Winkel');
  const cx = 230, cy = 150;
  kiste(s, cx - 40, cy - 30, 80, 60);
  kraftWinkel(s, cx + 40, cy, p.g2 / 2, 120, `F_1 = ${p.F1} N`);
  kraftWinkel(s, cx + 40, cy, -p.g2 / 2, 120, `F_2 = ${p.F2} N`, { dy: 4, dx: 10 });
  line(s, cx + 40, cy, cx + 200, cy, { stroke: '#777', 'stroke-dasharray': '4 3' });
  txt(s, cx + 120, cy - 8, `${p.g2}°`, { 'font-size': 13 });
  return s;
}
