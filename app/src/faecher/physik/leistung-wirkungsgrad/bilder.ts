// Bauteilbilder für das Kapitel Leistung, Wirkungsgrad.
// Hubbild und Auto kommen aus dem Kapitel Arbeit, Energie.
import { C, blatt, boden, bolzen, el, geschw, kiste, kraft, line, massV, ref, txt } from '../../../core/draw/svg';
export { heben, auto } from '../arbeit-energie/bilder';

/** Leistungsfluss: Zufuhr, ein bis drei Bausteine, Abgabe, Verlust nach unten. */
export function fluss(blocks: [string, string][], P: string[], o: { loss?: string[] } = {}) {
  const s = blatt(250, 'Leistungsfluss'), n = blocks.length;
  const bw = n > 2 ? 96 : 120, gap = n > 2 ? 62 : 95, x0 = (640 - (n * bw + (n + 1) * gap)) / 2;
  for (let i = 0; i <= n; i++) {
    const xa = x0 + i * (bw + gap), xb = xa + gap;
    line(s, xa + 6, 110, xb - 6, 110, { stroke: C.V, 'stroke-width': i === 0 ? 5 : i === n ? 3 : 4, 'marker-end': ref(s, 'V') });
    if (P[i]) txt(s, (xa + xb) / 2, 64, P[i], { fill: C.V, 'font-weight': 600, 'text-anchor': 'middle', 'font-size': 14 });
  }
  blocks.forEach(([nm, eta], i) => {
    const x = x0 + gap + i * (bw + gap);
    s.append(el('rect', { x, y: 75, width: bw, height: 70, rx: 6, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.4 }));
    txt(s, x + bw / 2, 105, nm, { 'text-anchor': 'middle', 'font-weight': 600 });
    txt(s, x + bw / 2, 128, eta, { 'text-anchor': 'middle', 'font-size': 14 });
    line(s, x + bw / 2, 147, x + bw / 2, 195, { stroke: '#999', 'stroke-width': 4, 'marker-end': ref(s, 'D') });
    txt(s, x + bw / 2, 218, o.loss?.[i] ?? 'Verlust (Wärme)', { 'text-anchor': 'middle', 'font-size': 13, fill: C.GRAU });
  });
  return s;
}

/** Förderband mit Last, Zugkraft und Bandgeschwindigkeit. */
export function band(o: { F?: string; v?: string }) {
  const s = blatt(260, 'Förderband');
  s.append(el('rect', { x: 190, y: 168, width: 260, height: 44, fill: '#bbb', stroke: '#444', 'stroke-width': 2 }));
  [190, 450].forEach((x) => {
    s.append(el('circle', { cx: x, cy: 190, r: 22, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.5 }));
    bolzen(s, x, 190);
    line(s, x, 212, x, 238, { 'stroke-width': 3, stroke: '#777' });
  });
  boden(s, 150, 238, 340, 12);
  kiste(s, 290, 126, 60, 42);
  if (o.v) geschw(s, 360, 112, 440, 112, o.v, 362, 100);
  if (o.F) kraft(s, 200, 150, 280, 150, o.F, 196, 138);
  return s;
}

/** Person steigt eine Treppe: Masse, Höhe, Zeit. */
export function treppe(o: { m: string; h: string; t: string }) {
  const s = blatt(260, 'Treppe steigen'), y0 = 225, st = 5, dx = 56, dy = 20;
  let d = `M110,${y0}`;
  for (let i = 0; i < st; i++) d += ` L${110 + i * dx},${y0 - (i + 1) * dy} L${110 + (i + 1) * dx},${y0 - (i + 1) * dy}`;
  d += ` L${110 + st * dx},${y0} Z`;
  s.append(el('path', { d, fill: '#e6e7ea', stroke: '#555' }));
  const px = 110 + 3 * dx + 28, py = y0 - 4 * dy;
  s.append(el('circle', { cx: px, cy: py - 52, r: 9, fill: '#444' }));
  line(s, px, py - 43, px, py - 16, { stroke: '#444', 'stroke-width': 5 });
  line(s, px, py - 16, px - 8, py, { stroke: '#444', 'stroke-width': 4 });
  line(s, px, py - 16, px + 10, py - 2, { stroke: '#444', 'stroke-width': 4 });
  massV(s, y0 - st * dy, y0, 70, o.h, 106);
  txt(s, 420, 70, o.m, { 'font-size': 14 });
  txt(s, 420, 92, o.t, { 'font-size': 14 });
  txt(s, 420, 114, 'P = ?', { 'font-size': 14, fill: C.V, 'font-weight': 600 });
  return s;
}
