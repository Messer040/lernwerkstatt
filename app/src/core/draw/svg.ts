// Gemeinsame Zeichenbausteine für Bauteilbilder.
// Feste Farben: Kräfte magenta, Resultierende violett, Längen blau, Momente grün, Energie/Geschwindigkeit orange.

export const NS = 'http://www.w3.org/2000/svg';
export const C = {
  F: '#c2185b',
  R: '#6a3fb5',
  L: '#1d5a9e',
  M: '#2e7d4f',
  V: '#c2410c',
  INK: '#18212b',
  GRAU: '#5a6673',
  BLATT: '#e6e7ea',
  STAHL: '#a9cbee',
  STAHLRAND: '#2b4c7e',
  GESTELL: '#a7a9c4',
  HOLZ: '#f3d98b',
} as const;

type Attrs = Record<string, string | number>;

export function el<K extends keyof SVGElementTagNameMap>(t: K, a: Attrs = {}, ...k: Node[]): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, t);
  for (const i in a) e.setAttribute(i, String(a[i]));
  k.forEach((c) => e.append(c));
  return e;
}

let svgZaehler = 0;

/** Neues Zeichenblatt 640 × h mit eigenen Pfeilspitzen. */
export function blatt(h = 300, titel = 'Bauteilbild'): SVGSVGElement {
  const id = `s${++svgZaehler}`;
  const s = el('svg', { viewBox: `0 0 640 ${h}`, role: 'img', 'aria-label': titel, 'data-mid': id });
  const mk = (n: string, fill: string, ref = 9) =>
    el(
      'marker',
      { id: `${id}${n}`, viewBox: '0 0 10 10', refX: ref, refY: 5, markerWidth: 5, markerHeight: 5, orient: 'auto' },
      el('path', { d: 'M0,0L10,5L0,10z', fill }),
    );
  const defs = el(
    'defs',
    {},
    mk('F', C.F),
    mk('M', C.M, 8),
    mk('R', C.R),
    mk('V', C.V),
    el(
      'marker',
      {
        id: `${id}D`,
        viewBox: '0 0 10 6',
        refX: 10,
        refY: 3,
        markerWidth: 9,
        markerHeight: 5.4,
        orient: 'auto-start-reverse',
        markerUnits: 'userSpaceOnUse',
      },
      el('path', { d: 'M0,0L10,3L0,6z', fill: C.INK }),
    ),
    el(
      'pattern',
      { id: `${id}hat`, patternUnits: 'userSpaceOnUse', width: 6, height: 6, patternTransform: 'rotate(45)' },
      el('rect', { width: 6, height: 6, fill: '#bdbdbd' }),
      el('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: '#8a8a8a', 'stroke-width': 1.2 }),
    ),
  );
  s.append(defs, el('rect', { x: 0, y: 0, width: 640, height: h, fill: C.BLATT }));
  return s;
}

const mid = (s: SVGSVGElement) => s.getAttribute('data-mid')!;
const ref = (s: SVGSVGElement, n: string) => `url(#${mid(s)}${n})`;

/** «F_G» → F mit tiefgestelltem G */
function tief(t: string): string {
  return String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/_([A-Za-z0-9]+(?:,max)?)/g, '<tspan dy="4" font-size="70%">$1</tspan><tspan dy="-4" font-size="1">​</tspan>');
}

export function txt(s: SVGSVGElement, x: number, y: number, t: string, o: Attrs = {}): SVGTextElement {
  const e = el('text', { x, y, 'font-size': 15, fill: C.INK, ...o });
  e.innerHTML = tief(t);
  s.append(e);
  return e;
}

export function line(s: SVGSVGElement, x1: number, y1: number, x2: number, y2: number, o: Attrs = {}) {
  const e = el('line', { x1, y1, x2, y2, stroke: C.INK, 'stroke-width': 1, ...o });
  s.append(e);
  return e;
}

/** Kraftpfeil von (x1,y1) nach (x2,y2) mit Beschriftung. */
export function kraft(s: SVGSVGElement, x1: number, y1: number, x2: number, y2: number, label?: string, lx = 0, ly = 0, o: Attrs = {}) {
  line(s, x1, y1, x2, y2, { stroke: C.F, 'stroke-width': 3.2, 'marker-end': ref(s, 'F') });
  if (label) txt(s, lx, ly, label, { fill: C.F, 'font-weight': 600, ...o });
}

/** Resultierende (violett). */
export function resultierende(s: SVGSVGElement, x1: number, y1: number, x2: number, y2: number, label?: string, lx = 0, ly = 0) {
  line(s, x1, y1, x2, y2, { stroke: C.R, 'stroke-width': 4, 'marker-end': ref(s, 'R') });
  if (label) txt(s, lx, ly, label, { fill: C.R, 'font-weight': 600 });
}

/** Waagrechte Bemassung auf Höhe y, Hilfslinien ab ya (links) und yb (rechts). */
export function massH(s: SVGSVGElement, x1: number, x2: number, y: number, label: string, ya: number, yb?: number, o: { aussen?: boolean } = {}) {
  const d = y < ya ? -5 : 5;
  line(s, x1, ya, x1, y + d);
  line(s, x2, yb ?? ya, x2, y + d);
  line(s, x1, y, x2, y, { 'marker-start': ref(s, 'D'), 'marker-end': ref(s, 'D') });
  if (o.aussen) txt(s, Math.max(x1, x2) + 8, y + 5, label, { fill: C.L });
  else txt(s, (x1 + x2) / 2, y - 6, label, { 'text-anchor': 'middle', fill: C.L });
}

/** Senkrechte Bemassung bei x, Hilfslinien ab xa. */
export function massV(s: SVGSVGElement, y1: number, y2: number, x: number, label: string, xa: number) {
  const d = x < xa ? -5 : 5;
  line(s, xa, y1, x + d, y1);
  line(s, xa, y2, x + d, y2);
  line(s, x, y1, x, y2, { 'marker-start': ref(s, 'D'), 'marker-end': ref(s, 'D') });
  const my = (y1 + y2) / 2;
  txt(s, x - 6, my, label, { 'text-anchor': 'middle', fill: C.L, transform: `rotate(-90 ${x - 6} ${my})` });
}

export function boden(s: SVGSVGElement, x: number, y: number, w: number, h: number) {
  s.append(el('rect', { x, y, width: w, height: h, fill: ref(s, 'hat'), stroke: '#555', 'stroke-width': 1 }));
}

export function balken(s: SVGSVGElement, x1: number, x2: number, y: number, th = 14) {
  s.append(el('rect', { x: x1, y: y - th / 2, width: x2 - x1, height: th, rx: th / 2, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.3 }));
  line(s, x1 + 6, y, x2 - 6, y, { stroke: '#fff', 'stroke-dasharray': '10 3 2 3' });
}

export function bolzen(s: SVGSVGElement, x: number, y: number) {
  s.append(el('circle', { cx: x, cy: y, r: 5.5, fill: '#fff', stroke: C.INK, 'stroke-width': 1.3 }));
  s.append(el('circle', { cx: x, cy: y, r: 1.6, fill: C.INK }));
}

export function drehbock(s: SVGSVGElement, x: number, y: number, h = 45) {
  s.append(el('polygon', { points: `${x},${y - 6} ${x - 24},${y + h} ${x + 24},${y + h}`, fill: C.GESTELL, stroke: '#555' }));
}

export function kiste(s: SVGSVGElement, x: number, y: number, w: number, h: number) {
  s.append(el('rect', { x, y, width: w, height: h, rx: 4, fill: C.HOLZ, stroke: '#555' }));
}

export function sechskant(s: SVGSVGElement, cx: number, cy: number, r = 22) {
  const p: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    p.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  s.append(el('polygon', { points: p.join(' '), fill: C.GESTELL, stroke: '#555', 'stroke-width': 1.3 }));
}

/** Drehpfeil (Moment) um (cx,cy). cw = im Uhrzeigersinn. */
export function moment(s: SVGSVGElement, cx: number, cy: number, r: number, cw: boolean) {
  const a1 = (-150 * Math.PI) / 180,
    a2 = (-30 * Math.PI) / 180;
  const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [A, B] = cw ? [p(a1), p(a2)] : [p(a2), p(a1)];
  s.append(
    el('path', {
      d: `M${A[0]},${A[1]} A${r},${r} 0 0 ${cw ? 1 : 0} ${B[0]},${B[1]}`,
      fill: 'none',
      stroke: C.M,
      'stroke-width': 2.5,
      'marker-end': ref(s, 'M'),
    }),
  );
}
