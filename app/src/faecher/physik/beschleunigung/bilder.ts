// Bauteilbilder für das Kapitel Beschleunigungs- und Gewichtskraft.
// Kräfte magenta, Geschwindigkeit und Beschleunigung orange (feste Farben).
import { C, blatt, boden, el, geschw, kiste, kraft, line, massV, ref, saeulen, seil, txt } from '../../../core/draw/svg';
export { saeulen };
export { heben } from '../arbeit-energie/bilder';

type S = SVGSVGElement;
type A = Record<string, string | number>;

const kl = (s: S, x: number, y: number, t: string, o: A = {}) => txt(s, x, y, t, { 'font-size': 13, ...o });
const gestrichelt = (s: S, x: number, y: number, w: number, h: number) =>
  s.append(el('rect', { x, y, width: w, height: h, rx: 4, fill: 'none', stroke: '#777', 'stroke-dasharray': '6 4' }));
const GRAU = { fill: '#d7dbe2', stroke: '#555' };

/** Pkw von der Seite. x0 = linke Kante, yG = Boden unter den Rädern. Breite 180 px. */
function pkw(s: S, x0: number, yG: number) {
  s.append(el('rect', { x: x0 + 40, y: yG - 77, width: 95, height: 36, rx: 10, fill: '#cfe0f3', stroke: C.STAHLRAND }));
  s.append(el('rect', { x: x0, y: yG - 47, width: 180, height: 34, rx: 10, fill: C.STAHL, stroke: C.STAHLRAND }));
  [x0 + 35, x0 + 145].forEach((x) => {
    s.append(el('circle', { cx: x, cy: yG - 13, r: 13, fill: '#444' }));
    s.append(el('circle', { cx: x, cy: yG - 13, r: 5, fill: '#ccc' }));
  });
}

/** Pkw mit Kraft F, Beschleunigung a und Geschwindigkeit v. bremst: F und a zeigen nach hinten. */
export function wagen(o: { m?: string; F?: string; a?: string; v?: string; bremst?: boolean } = {}) {
  const s = blatt(240, 'Fahrzeug');
  boden(s, 60, 195, 520, 14);
  pkw(s, 230, 195);
  if (o.m) txt(s, 320, 106, o.m, { 'text-anchor': 'middle', 'font-size': 14 });
  if (o.v) geschw(s, 418, 92, 508, 92, o.v, 420, 80);
  if (o.bremst) {
    if (o.F) kraft(s, 222, 170, 132, 170, o.F, 222, 158, { 'text-anchor': 'end' });
    if (o.a) geschw(s, 222, 130, 132, 130, o.a, 222, 118, { 'text-anchor': 'end' });
  } else {
    if (o.F) kraft(s, 418, 170, 508, 170, o.F, 420, 158);
    if (o.a) geschw(s, 418, 130, 508, 130, o.a, 420, 118);
  }
  return s;
}

/** Güterzug mit Lok vorne rechts. */
export function zug(o: { m?: string; F?: string; a?: string } = {}) {
  const s = blatt(220, 'Güterzug');
  boden(s, 40, 172, 560, 12);
  s.append(el('rect', { x: 100, y: 104, width: 110, height: 52, rx: 4, fill: C.STAHL, stroke: C.STAHLRAND }));
  s.append(el('rect', { x: 215, y: 104, width: 110, height: 52, rx: 4, fill: C.STAHL, stroke: C.STAHLRAND }));
  s.append(el('rect', { x: 330, y: 96, width: 140, height: 60, rx: 6, fill: '#cfe0f3', stroke: C.STAHLRAND }));
  s.append(el('rect', { x: 420, y: 74, width: 50, height: 24, rx: 4, fill: '#cfe0f3', stroke: C.STAHLRAND }));
  [130, 180, 245, 295, 360, 440].forEach((x) => {
    s.append(el('circle', { cx: x, cy: 164, r: 8, fill: '#444' }));
  });
  if (o.m) txt(s, 100, 92, o.m, { 'font-size': 14 });
  if (o.F) kraft(s, 470, 130, 560, 130, o.F, 474, 118);
  if (o.a) geschw(s, 480, 90, 570, 90, o.a, 484, 78);
  return s;
}

/** Linearantrieb: Schlitten auf der Führung, optional mit Last. */
export function schlitten(o: { m?: string; F?: string; a?: string; last?: string }) {
  const s = blatt(250, 'Linearantrieb');
  const y = 160;
  s.append(el('rect', { x: 60, y, width: 520, height: 26, ...GRAU }));
  s.append(el('rect', { x: 220, y: y - 46, width: 150, height: 46, rx: 4, fill: C.STAHL, stroke: C.STAHLRAND }));
  txt(s, 295, y - 18, 'Schlitten', { 'text-anchor': 'middle', 'font-size': 13 });
  if (o.last) {
    kiste(s, 260, y - 86, 70, 40);
    txt(s, 295, y - 62, o.last, { 'text-anchor': 'middle', 'font-size': 13 });
  }
  if (o.F) kraft(s, 370, y - 24, 470, y - 24, o.F, 476, y - 20);
  if (o.a) geschw(s, 240, y + 58, 320, y + 58, o.a, 326, y + 63);
  if (o.m) txt(s, 30, 30, o.m, { 'font-size': 14 });
  return s;
}

/** Fussball beim Schuss: Kraft von links, Geschwindigkeit nach rechts. */
export function ball(o: { info?: string; F?: string; a?: string; v?: string } = {}) {
  const s = blatt(230, 'Fussball');
  const cx = 260, cy = 130;
  boden(s, 40, 170, 560, 10);
  s.append(el('circle', { cx, cy, r: 30, fill: '#fff', stroke: '#444', 'stroke-width': 2 }));
  [[0, -14], [-14, 8], [14, 8]].forEach(([dx, dy]) => s.append(el('circle', { cx: cx + dx, cy: cy + dy, r: 7, fill: '#444' })));
  if (o.F) kraft(s, 150, cy, 226, cy, o.F, 130, cy - 14);
  if (o.v) geschw(s, 300, cy - 50, 420, cy - 50, o.v, 426, cy - 46);
  if (o.a) geschw(s, 300, cy + 4, 380, cy + 4, o.a, 386, cy + 9);
  s.append(el('rect', { x: 580, y: 40, width: 12, height: 130, fill: '#fff', stroke: '#555' }));
  line(s, 592, 40, 632, 40, { stroke: '#555', 'stroke-width': 6 });
  if (o.info) txt(s, 30, 30, o.info, { 'font-size': 14 });
  return s;
}

/** Hubzylinder mit Last auf der Plattform. */
export function hubzylinder(o: { m?: string; F?: string }) {
  const s = blatt(280, 'Hubzylinder');
  const cx = 320;
  boden(s, 120, 250, 400, 12);
  s.append(el('rect', { x: cx - 90, y: 110, width: 180, height: 16, fill: C.GESTELL, stroke: '#555' }));
  kiste(s, cx - 50, 60, 100, 50);
  if (o.m) txt(s, cx, 90, o.m, { 'text-anchor': 'middle', 'font-size': 14 });
  s.append(el('rect', { x: cx - 20, y: 126, width: 40, height: 124, ...GRAU }));
  s.append(el('rect', { x: cx - 8, y: 126, width: 16, height: 60, fill: C.STAHL, stroke: C.STAHLRAND }));
  kl(s, cx + 30, 226, 'Hubzylinder');
  if (o.F) kraft(s, cx + 120, 210, cx + 120, 130, o.F, cx + 132, 176);
  return s;
}

/** Hebebühne mit Pkw. */
export function hebebuehne(o: { m?: string; FG?: string }) {
  const s = blatt(280, 'Hebebühne');
  const yG = 250, h = 120;
  boden(s, 80, yG, 480, 12);
  [150, 470].forEach((x) => s.append(el('rect', { x: x - 8, y: 60, width: 16, height: yG - 60, fill: C.GESTELL, stroke: '#555' })));
  s.append(el('rect', { x: 170, y: yG - h, width: 280, height: 8, fill: '#777' }));
  pkw(s, 230, yG - h);
  if (o.m) txt(s, 30, 34, o.m, { 'font-size': 14 });
  if (o.FG) kraft(s, 320, yG - h - 30, 320, yG - 28, o.FG, 330, yG - 40);
  return s;
}

/** Bauteil fällt aus der Höhe h. */
export function fallend(o: { m?: string; h?: string; F?: string }) {
  const s = blatt(300, 'Fallendes Bauteil');
  boden(s, 200, 262, 240, 14);
  kiste(s, 285, 50, 70, 50);
  if (o.m) txt(s, 320, 80, o.m, { 'text-anchor': 'middle', 'font-size': 14 });
  gestrichelt(s, 285, 212, 70, 50);
  if (o.h) massV(s, 100, 262, 250, o.h, 281);
  if (o.F) kraft(s, 320, 104, 320, 180, o.F, 330, 150);
  return s;
}

/** Aufzug im Schacht. ab = Beschleunigung nach unten. */
export function aufzug(o: { m?: string; FS?: string; FG?: string; a?: string; ab?: boolean }) {
  const s = blatt(300, 'Aufzug');
  s.append(el('rect', { x: 150, y: 10, width: 320, height: 280, fill: 'none', stroke: '#555', 'stroke-width': 2 }));
  s.append(el('rect', { x: 250, y: 110, width: 100, height: 80, rx: 4, fill: C.STAHL, stroke: C.STAHLRAND }));
  seil(s, 300, 10, 300, 110);
  if (o.m) txt(s, 300, 155, o.m, { 'text-anchor': 'middle', 'font-size': 13 });
  if (o.FS) kraft(s, 325, 104, 325, 34, o.FS, 335, 64);
  if (o.FG) kraft(s, 275, 190, 275, 262, o.FG, 292, 252);
  if (o.a) {
    if (o.ab) geschw(s, 520, 120, 520, 200, o.a, 530, 166);
    else geschw(s, 520, 200, 520, 120, o.a, 530, 166);
  }
  return s;
}

/** Lkw bremst, Kiste auf der Ladefläche. */
export function ladung(o: { m?: string; mu?: string; a?: string; v?: string }) {
  const s = blatt(250, 'Lkw mit Ladung');
  boden(s, 40, 195, 560, 14);
  s.append(el('rect', { x: 110, y: 150, width: 370, height: 22, fill: C.STAHL, stroke: C.STAHLRAND }));
  s.append(el('rect', { x: 400, y: 100, width: 80, height: 50, rx: 6, fill: '#cfe0f3', stroke: C.STAHLRAND }));
  s.append(el('rect', { x: 440, y: 110, width: 28, height: 22, rx: 3, fill: '#fff', stroke: C.STAHLRAND }));
  [160, 250, 430].forEach((x) => {
    s.append(el('circle', { cx: x, cy: 182, r: 13, fill: '#444' }));
    s.append(el('circle', { cx: x, cy: 182, r: 5, fill: '#ccc' }));
  });
  kiste(s, 170, 90, 100, 60);
  if (o.m) txt(s, 220, 125, o.m, { 'text-anchor': 'middle', 'font-size': 13 });
  if (o.a) geschw(s, 380, 112, 290, 112, o.a, 290, 100);
  if (o.v) geschw(s, 420, 70, 520, 70, o.v, 526, 75);
  if (o.mu) txt(s, 30, 30, o.mu, { 'font-size': 14 });
  return s;
}

/** v-t-Diagramm. marken beschriften Abschnitte (Position in Daten, Versatz in px). */
export function vt(
  pts: [number, number][],
  o: {
    tmax: number;
    dt?: number;
    dv?: number;
    vmax?: number;
    vl?: string;
    titel?: string;
    marken?: { t: number; v: number; text: string; dx?: number; dy?: number }[];
  },
) {
  const s = blatt(260, 'v-t-Diagramm');
  const x0 = 80, y0 = 210, W = 460, H = 160;
  const vm = o.vmax ?? Math.max(...pts.map((q) => q[1])) * 1.15;
  const X = (t: number) => x0 + (t / o.tmax) * W;
  const Y = (v: number) => y0 - (v / vm) * H;
  const dt = o.dt ?? 4, dv = o.dv ?? 10;
  for (let i = 0; i * dt <= o.tmax; i++) {
    const t = i * dt;
    line(s, X(t), y0, X(t), y0 - H, { stroke: '#d0d4da' });
    txt(s, X(t), y0 + 20, String(t), { 'text-anchor': 'middle', 'font-size': 12 });
  }
  for (let i = 0; i * dv <= vm; i++) {
    const v = i * dv;
    line(s, x0, Y(v), x0 + W, Y(v), { stroke: '#d0d4da' });
    txt(s, x0 - 8, Y(v) + 4, String(v), { 'text-anchor': 'end', 'font-size': 12 });
  }
  line(s, x0, y0, x0 + W + 20, y0, { 'marker-end': ref(s, 'D') });
  line(s, x0, y0, x0, y0 - H - 20, { 'marker-end': ref(s, 'D') });
  s.append(
    el('polyline', { points: pts.map((q) => `${X(q[0])},${Y(q[1])}`).join(' '), fill: 'none', stroke: C.V, 'stroke-width': 3.5 }),
  );
  txt(s, x0 + W + 26, y0 + 5, 't in s', { 'font-size': 13 });
  txt(s, x0, y0 - H - 30, o.vl ?? 'v in m/s', { 'font-size': 13, fill: C.V, 'font-weight': 600, 'text-anchor': 'middle' });
  if (o.titel) txt(s, x0 + W, 30, o.titel, { 'font-size': 13, 'text-anchor': 'end' });
  (o.marken ?? []).forEach((m) =>
    txt(s, X(m.t) + (m.dx ?? 0), Y(m.v) + (m.dy ?? 0), m.text, { 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 600 }),
  );
  return s;
}
