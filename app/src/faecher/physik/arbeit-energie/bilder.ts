// Bauteilbilder für das Kapitel Arbeit, Energie.
import {
  C, blatt, boden, bolzen, el, geschw, kiste, kraft, line, massH, massV, mittellinie, moment, seil, txt,
} from '../../../core/draw/svg';
import { fmt } from '../../../core/zahl';

type S = SVGSVGElement;
type A = Record<string, string | number>;

const GRAU = { fill: '#d7dbe2', stroke: '#555' };
const gestrichelt = (s: S, x: number, y: number, w: number, h: number) =>
  s.append(el('rect', { x, y, width: w, height: h, rx: 4, fill: 'none', stroke: '#777', 'stroke-dasharray': '6 4' }));
const kl = (s: S, x: number, y: number, t: string, o: A = {}) => txt(s, x, y, t, { 'font-size': 13, ...o });
const arbeitText = (s: S, x: number, y: number, t: string, o: A = {}) =>
  txt(s, x, y, t, { fill: C.V, 'font-weight': 600, ...o });

/** Kiste wird verschoben: Kraft, Weg, gesuchte Arbeit. */
export function schieben(o: { F?: string; s?: string; W?: string }) {
  const s = blatt(250, 'Kiste verschieben');
  boden(s, 100, 200, 450, 14);
  gestrichelt(s, 150, 140, 80, 60);
  kiste(s, 370, 140, 80, 60);
  if (o.F) kraft(s, 450, 170, 535, 170, o.F, 458, 160);
  if (o.s) massH(s, 150, 370, 105, o.s, 136);
  if (o.W) arbeitText(s, 300, 235, o.W, { 'text-anchor': 'middle' });
  return s;
}

/** Last am Seil unter einem Träger, Zielhöhe gestrichelt. */
export function heben(o: { h?: string; m?: string; FG?: string; lines?: string[]; c0?: boolean } = {}) {
  const s = blatt(300, 'Last heben');
  boden(s, 150, 250, 340, 14);
  s.append(el('rect', { x: 200, y: 28, width: 240, height: 14, fill: C.GESTELL, stroke: '#555' }));
  seil(s, 320, 42, 320, 100);
  gestrichelt(s, 290, 210, 60, 40);
  kiste(s, 290, 100, 60, 40);
  kraft(s, 320, 125, 320, 192, o.FG ?? 'F_G', 328, 186);
  if (o.h) massV(s, 140, 250, 250, o.h, 286);
  if (o.m) txt(s, 362, 118, o.m, { 'font-size': 14 });
  (o.lines ?? []).forEach((t, i) =>
    txt(s, 400, 170 + i * 22, t, { 'font-size': 14, fill: i === 0 && o.c0 ? C.V : C.INK, 'font-weight': i === 0 && o.c0 ? 600 : 400 }),
  );
  return s;
}

/** Auto in Fahrt: Masse, Geschwindigkeit, gesuchte Energie. */
export function auto(o: { v?: string; m?: string; W?: string }) {
  const s = blatt(240, 'Auto');
  boden(s, 100, 195, 440, 14);
  s.append(el('rect', { x: 240, y: 118, width: 95, height: 36, rx: 10, fill: '#cfe0f3', stroke: '#2b4c7e' }));
  s.append(el('rect', { x: 200, y: 148, width: 180, height: 34, rx: 10, fill: '#a9cbee', stroke: '#2b4c7e' }));
  [235, 345].forEach((x) => {
    s.append(el('circle', { cx: x, cy: 182, r: 13, fill: '#444' }));
    s.append(el('circle', { cx: x, cy: 182, r: 5, fill: '#ccc' }));
  });
  if (o.v) geschw(s, 390, 165, 490, 165, o.v, 395, 152);
  if (o.m) txt(s, 290, 108, o.m, { 'text-anchor': 'middle', 'font-size': 14 });
  if (o.W) arbeitText(s, 290, 228, o.W, { 'text-anchor': 'middle' });
  return s;
}

/** Fallhammer: Bär oben, Werkstück auf dem Amboss. */
export function fall(o: { h?: string; m?: string; v?: string } = {}) {
  const s = blatt(300, 'Fallhammer');
  boden(s, 200, 255, 240, 14);
  s.append(el('rect', { x: 280, y: 230, width: 80, height: 25, fill: C.GESTELL, stroke: '#555' }));
  kiste(s, 285, 55, 70, 50);
  gestrichelt(s, 285, 180, 70, 50);
  if (o.h) massV(s, 105, 230, 245, o.h, 281);
  if (o.v) geschw(s, 390, 150, 390, 222, o.v, 400, 200);
  if (o.m) txt(s, 365, 85, o.m, { 'font-size': 14 });
  kl(s, 365, 248, 'Werkstück');
  return s;
}

/** Last am Kran mit Hubhöhe h. */
export function lift(p: { h: number }, o: { lab?: string; FG?: string; h?: string; cyl?: boolean } = {}) {
  const s = blatt(300, 'Last am Kran'), yG = 265, k = Math.min(170 / p.h, 120), y1 = yG - p.h * k, xb = 300;
  boden(s, 120, yG, 400, 12);
  gestrichelt(s, xb - 40, yG - 40, 80, 40);
  s.append(el('rect', { x: xb - 80, y: 10, width: 160, height: 12, fill: C.GESTELL, stroke: '#555' }));
  seil(s, xb, 22, xb, y1 - 40);
  if (o.cyl) s.append(el('rect', { x: xb - 60, y: y1 - 40, width: 120, height: 40, rx: 20, ...GRAU }));
  else kiste(s, xb - 40, y1 - 40, 80, 40);
  if (o.lab) txt(s, xb, y1 - 14, o.lab, { 'text-anchor': 'middle', 'font-size': 12 });
  kraft(s, xb + 60, y1 - 30, xb + 60, y1 + 30, o.FG ?? '', xb + 76, y1 + 16);
  massV(s, y1, yG, xb - 110, o.h ?? `h = ${fmt(p.h)} m`, xb - 40);
  geschw(s, xb - 60, y1 + 50, xb - 60, y1 + 10, 'v', xb - 68, y1 + 34, { 'text-anchor': 'end' });
  return s;
}

/** Betonpumpe mit Förderhöhe. */
export function beton(o: { h: string; V: string }) {
  const s = blatt(300, 'Betonpumpe'), yG = 265;
  boden(s, 20, yG, 600, 12);
  s.append(el('rect', { x: 40, y: 70, width: 220, height: yG - 70, fill: '#e6eef7', stroke: '#2b4c7e' }));
  for (let y = 100; y < yG; y += 50)
    for (let x = 60; x < 240; x += 60) s.append(el('rect', { x, y, width: 34, height: 28, fill: '#a9cbee', stroke: '#2b4c7e' }));
  s.append(el('rect', { x: 380, y: yG - 50, width: 150, height: 36, rx: 4, fill: '#f0c987', stroke: '#8a6a3a' }));
  [400, 500].forEach((x) => s.append(el('circle', { cx: x, cy: yG - 12, r: 12, fill: '#444' })));
  line(s, 450, yG - 50, 360, 90, { stroke: '#c99a3a', 'stroke-width': 6 });
  line(s, 360, 90, 240, 70, { stroke: '#c99a3a', 'stroke-width': 5 });
  seil(s, 240, 70, 240, 60);
  massV(s, 60, yG, 580, o.h, 250);
  txt(s, 330, 40, o.V, { 'font-size': 13, 'text-anchor': 'middle' });
  return s;
}

/** Schlitten mit Reibkraft, Gewichtskraft und Weg. */
export function schieb2(p: { s: number }, o: { F?: string; FR?: string; FG?: string; s?: string; mu?: string } = {}) {
  const s = blatt(260, 'Maschinenteil verschieben'), y = 170, k = Math.min(1, 300 / p.s);
  boden(s, 60, y, 520, 12);
  kiste(s, 120, y - 60, 80, 60);
  gestrichelt(s, 120 + p.s * k, y - 60, 80, 60);
  kraft(s, 200, y - 30, 270, y - 30, o.F ?? 'F', 276, y - 26);
  kraft(s, 140, y - 6, 90, y - 6, o.FR ?? 'F_R', 84, y - 12, { 'text-anchor': 'end' });
  kraft(s, 160, y - 60, 160, y - 110, 'F_N', 168, y - 98);
  kraft(s, 160, y + 12, 160, y + 56, o.FG ?? 'F_G', 150, y + 38, { 'text-anchor': 'end' });
  massH(s, 200, 200 + p.s * k, y + 78, o.s ?? `s = ${p.s} mm`, y + 12);
  if (o.mu) txt(s, 30, 30, o.mu, { 'font-size': 14 });
  return s;
}

/** Druckfeder mit Weg s und Kraft-Weg-Diagramm (Dreieck = Spannarbeit). */
export function feder(p: { s: number }, o: { F?: string; R?: string; W?: string } = {}) {
  const s = blatt(280, 'Druckfeder'), y = 110, L0 = 200, k = (L0 * 0.6) / Math.max(p.s, 1), Ls = Math.max(60, L0 - p.s * Math.min(k, 4));
  boden(s, 40, y - 40, 20, 80);
  let d = `M60,${y}`;
  for (let i = 1; i <= 10; i++) d += ` L${60 + (Ls * i) / 10},${y + (i % 2 ? -22 : 22)}`;
  s.append(el('path', { d, fill: 'none', stroke: '#2b4c7e', 'stroke-width': 2.5 }));
  s.append(el('rect', { x: 60 + Ls, y: y - 30, width: 12, height: 60, fill: C.GESTELL, stroke: '#555' }));
  kraft(s, 60 + Ls + 90, y, 60 + Ls + 14, y, o.F ?? 'F', 60 + Ls + 50, y - 12);
  line(s, 60 + L0, y + 10, 60 + L0, y + 30, { stroke: '#777', 'stroke-dasharray': '4 3' });
  massH(s, 60 + Ls, 60 + L0, y + 56, `s = ${p.s} mm`, y + 30, undefined, { aussen: true });
  const gx = 380, gy = 250, W = 210, Hh = 170;
  line(s, gx, gy, gx + W + 10, gy, { 'marker-end': `url(#${s.getAttribute('data-mid')}D)` });
  line(s, gx, gy, gx, gy - Hh - 10, { 'marker-end': `url(#${s.getAttribute('data-mid')}D)` });
  s.append(el('polygon', { points: `${gx},${gy} ${gx + W * 0.85},${gy} ${gx + W * 0.85},${gy - Hh * 0.85}`, fill: C.V, opacity: 0.5, stroke: C.F }));
  txt(s, gx + W * 0.6, gy - 20, o.W ?? 'W = F · s : 2', { 'font-size': 13, 'text-anchor': 'middle' });
  txt(s, gx + W + 10, gy + 18, 's', { fill: C.L, 'font-weight': 600 });
  txt(s, gx - 8, gy - Hh, 'F', { fill: C.F, 'font-weight': 600, 'text-anchor': 'end' });
  if (o.R) txt(s, 30, 30, o.R, { 'font-size': 14 });
  return s;
}

/** Riemenfallhammer mit Bär, Werkstück und Amboss. */
export function hammer(p: { m: number; s: number }, o: { v?: string } = {}) {
  const s = blatt(300, 'Fallhammer'), yG = 270;
  boden(s, 160, yG, 320, 12);
  s.append(el('polygon', { points: `200,${yG} 260,30 380,30 440,${yG}`, ...GRAU }));
  s.append(el('rect', { x: 270, y: yG - 40, width: 100, height: 40, fill: '#a9cbee', stroke: '#2b4c7e' }));
  txt(s, 320, yG - 14, 'Amboss', { 'text-anchor': 'middle', 'font-size': 12 });
  s.append(el('rect', { x: 300, y: yG - 58, width: 40, height: 18, fill: '#e57373', stroke: '#8a2a2a' }));
  s.append(el('rect', { x: 296, y: 90, width: 48, height: 90, fill: '#f0c987', stroke: '#8a6a3a' }));
  txt(s, 320, 140, 'Bär', { 'text-anchor': 'middle', 'font-size': 12 });
  geschw(s, 380, 100, 380, 170, o.v ?? 'v', 388, 140, { stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke' });
  txt(s, 30, 30, `m = ${p.m} kg`, { 'font-size': 14 });
  txt(s, 30, 52, `Verformungsweg ${p.s} mm`, { 'font-size': 14 });
  return s;
}

/** Werkstück wird überdreht: Schnittkraft, Länge, Durchmesser. */
export function drehV(p: { Fc: number; l: number; d: number; f: number }) {
  const s = blatt(260, 'Überdrehen einer Welle'), cy = 110;
  s.append(el('rect', { x: 60, y: cy - 50, width: 440, height: 100, rx: 6, fill: '#a9cbee', stroke: '#2b4c7e' }));
  mittellinie(s, 40, cy, 560, cy);
  moment(s, 120, cy, 30, true);
  s.append(el('polygon', { points: `380,${cy + 50} 400,${cy + 50} 410,${cy + 130} 360,${cy + 130}`, fill: '#f3d98b', stroke: '#555' }));
  kraft(s, 390, cy + 40, 390, cy + 120);
  txt(s, 420, cy + 100, `F_c = ${p.Fc} N`, { fill: C.F, 'font-weight': 600 });
  geschw(s, 350, cy + 70, 290, cy + 70, 'v_f', 284, cy + 74, { 'text-anchor': 'end' });
  massV(s, cy - 50, cy + 50, 530, `d = ${p.d} mm`, 500);
  massH(s, 60, 500, 24, `l = ${p.l} mm`, cy - 50);
  txt(s, 30, 250, `f = ${fmt(p.f)} mm pro Umdrehung`, { 'font-size': 13 });
  return s;
}

/** Pumpspeicherwerk: Oberbecken, Unterbecken, Druckleitung. */
export function pumpspeicher(p: { L: number; B: number; T: number; h: number }) {
  const s = blatt(290, 'Pumpspeicherwerk');
  s.append(el('path', { d: 'M20,270 L180,70 L300,70 L600,270 Z', fill: '#cfc2a4', stroke: '#7a6a4a' }));
  s.append(el('rect', { x: 185, y: 55, width: 110, height: 18, fill: '#5aa0d8' }));
  s.append(el('rect', { x: 470, y: 250, width: 130, height: 20, fill: '#5aa0d8' }));
  line(s, 240, 73, 520, 250, { stroke: '#444', 'stroke-width': 4, 'stroke-dasharray': '8 4' });
  txt(s, 240, 46, 'Oberbecken', { 'font-size': 12, 'text-anchor': 'middle' });
  txt(s, 535, 285, 'Unterbecken', { 'font-size': 12, 'text-anchor': 'middle' });
  massV(s, 64, 260, 610, `h = ${p.h} m`, 300);
  txt(s, 30, 30, `${fmt(p.L)} km × ${p.B} m × ${fmt(p.T)} m`, { 'font-size': 13 });
  return s;
}

/** Schleifscheibe mit abfliegendem Teilchen. */
export function schleifscheibe(o: { m: string; v: string }) {
  const s = blatt(290, 'Schleifscheibe'), cx = 300, cy = 160, r = 95;
  s.append(el('circle', { cx, cy, r, fill: '#e8d9b5', stroke: '#2b4c7e', 'stroke-width': 1.6 }));
  s.append(el('circle', { cx, cy, r: 16, fill: C.GESTELL, stroke: '#555' }));
  bolzen(s, cx, cy);
  moment(s, cx, cy, 42, true);
  s.append(el('circle', { cx, cy: cy - r - 8, r: 7, fill: '#444' }));
  geschw(s, cx + 14, cy - r - 8, cx + 140, cy - r - 8, o.v, cx + 30, cy - r - 22);
  kl(s, cx - 14, cy - r - 4, o.m, { 'text-anchor': 'end' });
  txt(s, 30, 30, 'Schleifscheibe', { 'font-size': 15, 'font-weight': 600 });
  return s;
}

/** Auto seitlich mit Masse und Geschwindigkeit. */
export function wagen(o: { v?: string; m?: string } = {}) {
  const s = blatt(220, 'Auto'), yG = 180;
  boden(s, 40, yG, 560, 12);
  s.append(el('path', { d: `M180,${yG - 25} Q180,100 240,95 L290,62 L400,62 L450,95 Q500,98 505,${yG - 25} Z`, fill: '#a9cbee', stroke: '#2b4c7e' }));
  [225, 460].forEach((x) => s.append(el('circle', { cx: x, cy: yG - 18, r: 18, fill: '#444' })));
  if (o.v) geschw(s, 520, 110, 600, 110, o.v, 600, 96, { 'text-anchor': 'end' });
  if (o.m) txt(s, 40, 40, o.m, { 'font-size': 14 });
  return s;
}

/** Pendelschlagwerk: Hammer in Startlage, Probe unten, Steighöhe nach dem Schlag. */
export function pendel(p: { m: number; h: number; h2: number }) {
  const s = blatt(320, 'Pendelschlagwerk'), px = 320, py = 50, L = 190, a = (120 * Math.PI) / 180;
  s.append(el('rect', { x: 300, y: 40, width: 40, height: 260, fill: '#d7dbe2', stroke: '#555' }));
  bolzen(s, px, py);
  const hx = px + L * Math.sin(a), hy = py - L * Math.cos(a);
  line(s, px, py, hx, hy, { stroke: '#555', 'stroke-width': 6 });
  s.append(el('rect', { x: hx - 18, y: hy - 14, width: 36, height: 28, fill: C.GESTELL, stroke: '#555' }));
  line(s, px, py, px, py + L, { stroke: '#999', 'stroke-width': 4, 'stroke-dasharray': '6 4' });
  s.append(el('rect', { x: px - 12, y: py + L + 16, width: 24, height: 24, fill: '#f0c987', stroke: '#8a6a3a' }));
  txt(s, px + 30, py + L + 34, 'Probe', { 'font-size': 12 });
  const yb = py + L;
  line(s, 140, yb, 520, yb, { stroke: '#777', 'stroke-dasharray': '4 3' });
  massV(s, hy, yb, 560, `h = ${p.h} mm`, hx + 18);
  const h2y = yb - (p.h2 / p.h) * (yb - hy);
  line(s, 140, h2y, 300, h2y, { stroke: '#777', 'stroke-dasharray': '4 3' });
  massV(s, h2y, yb, 110, `s_2 = ${p.h2} mm`, 140);
  txt(s, 30, 30, `m = ${fmt(p.m, 3)} kg`, { 'font-size': 14 });
  return s;
}
