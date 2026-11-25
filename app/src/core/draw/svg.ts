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
  BLATT: '#ffffff',
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
    mk('L', C.L),
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
export const ref = (s: SVGSVGElement, n: string) => `url(#${mid(s)}${n})`;

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

/** Drehsinn (Bewegung, orange) als Bogenpfeil um (cx,cy). cw = im Uhrzeigersinn. mitte = Winkel der Bogenmitte in Grad (0 = rechts, −90 = oben). */
export function drehsinn(s: SVGSVGElement, cx: number, cy: number, r: number, cw: boolean, mitte = -90, spanne = 100) {
  const a1 = ((mitte - spanne / 2) * Math.PI) / 180,
    a2 = ((mitte + spanne / 2) * Math.PI) / 180;
  const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [A, B] = cw ? [p(a1), p(a2)] : [p(a2), p(a1)];
  s.append(
    el('path', {
      d: `M${A[0].toFixed(1)},${A[1].toFixed(1)} A${r},${r} 0 0 ${cw ? 1 : 0} ${B[0].toFixed(1)},${B[1].toFixed(1)}`,
      fill: 'none',
      stroke: C.V,
      'stroke-width': 2.5,
      'marker-end': ref(s, 'V'),
    }),
  );
}

/** Kraftpfeil unter Winkel ang (Grad, math. positiv = nach oben) mit Länge len. Gibt die Spitze zurück. */
export function kraftWinkel(
  s: SVGSVGElement, x: number, y: number, ang: number, len: number, lab?: string,
  o: { res?: boolean; dx?: number; dy?: number; t?: Record<string, string | number> } = {},
): [number, number] {
  const a = (ang * Math.PI) / 180;
  const ex = x + len * Math.cos(a), ey = y - len * Math.sin(a);
  const c = o.res ? C.R : C.F;
  line(s, x, y, ex, ey, { stroke: c, 'stroke-width': o.res ? 4 : 3.2, 'marker-end': ref(s, o.res ? 'R' : 'F') });
  if (lab) txt(s, ex + (o.dx ?? 8), ey + (o.dy ?? -6), lab, { fill: c, 'font-weight': 600, 'font-size': 14, ...(o.t ?? {}) });
  return [ex, ey];
}

/** Stab (Strebe, Schenkel, Leiter): blauer Stahlstab mit runden Enden. */
export function stab(s: SVGSVGElement, x1: number, y1: number, x2: number, y2: number, wd = 7) {
  line(s, x1, y1, x2, y2, { stroke: C.STAHLRAND, 'stroke-width': wd, 'stroke-linecap': 'round' });
  line(s, x1, y1, x2, y2, { stroke: C.STAHL, 'stroke-width': wd - 3, 'stroke-linecap': 'round' });
}

/** Seil (dünne dunkle Linie). */
export function seil(s: SVGSVGElement, x1: number, y1: number, x2: number, y2: number) {
  line(s, x1, y1, x2, y2, { stroke: '#444', 'stroke-width': 2.2 });
}

/** Geschwindigkeitspfeil (orange). */
export function geschw(s: SVGSVGElement, x1: number, y1: number, x2: number, y2: number, label?: string, lx = 0, ly = 0, o: Attrs = {}) {
  line(s, x1, y1, x2, y2, { stroke: C.V, 'stroke-width': 3, 'marker-end': ref(s, 'V') });
  if (label) txt(s, lx, ly, label, { fill: C.V, 'font-weight': 600, ...o });
}

/** Mittellinie (Strichpunkt). */
export function mittellinie(s: SVGSVGElement, x1: number, y1: number, x2: number, y2: number) {
  line(s, x1, y1, x2, y2, { stroke: C.GRAU, 'stroke-dasharray': '10 3 2 3', 'stroke-width': 0.8 });
}

/** Zahnrad mit Teilkreisradius r. Die Zähnezahl z wirkt nur auf die Optik (8 bis 46 Zähne). */
export function zahnrad(s: SVGSVGElement, cx: number, cy: number, r: number, z: number, o: { h?: number; fill?: string; nabe?: boolean } = {}) {
  const n = Math.max(8, Math.min(46, Math.round(z))), h = o.h ?? 6, pts: string[] = [];
  const prof: [number, number][] = [[0, -h / 2], [0.18, h / 2], [0.5, h / 2], [0.68, -h / 2]];
  for (let i = 0; i < n; i++) {
    const a0 = (i * 2 * Math.PI) / n, da = (2 * Math.PI) / n;
    prof.forEach(([q, dr]) => pts.push(`${(cx + (r + dr) * Math.cos(a0 + q * da)).toFixed(1)},${(cy + (r + dr) * Math.sin(a0 + q * da)).toFixed(1)}`));
  }
  s.append(el('polygon', { points: pts.join(' '), fill: o.fill ?? C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.2 }));
  s.append(el('circle', { cx, cy, r: r - h / 2 - 1, fill: 'none', stroke: '#fff', 'stroke-dasharray': '8 3 2 3' }));
  if (o.nabe !== false) {
    s.append(el('circle', { cx, cy, r: Math.min(12, r * 0.3), fill: C.GESTELL, stroke: '#555' }));
    bolzen(s, cx, cy);
  }
}

/** Riemenscheibe oder Rolle (Draufsicht), optional mit Speichen. */
export function scheibe(s: SVGSVGElement, cx: number, cy: number, r: number, o: { fill?: string; speichen?: boolean } = {}) {
  s.append(el('circle', { cx, cy, r, fill: o.fill ?? C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.4 }));
  if (o.speichen)
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      line(s, cx + 14 * Math.cos(a), cy + 14 * Math.sin(a), cx + (r - 8) * Math.cos(a), cy + (r - 8) * Math.sin(a), { stroke: C.STAHLRAND, 'stroke-width': 4 });
    }
  s.append(el('circle', { cx, cy, r: Math.min(14, r * 0.35), fill: C.GESTELL, stroke: '#555' }));
  bolzen(s, cx, cy);
}

/** Zahnrad in der Seitenansicht (Rechteck mit Schraffur). */
export function radSeite(s: SVGSVGElement, x: number, y: number, r: number, fill: string = C.STAHL) {
  s.append(el('rect', { x: x - 8, y: y - r, width: 16, height: 2 * r, fill, stroke: C.STAHLRAND }));
  for (let yy = y - r + 4; yy < y + r - 2; yy += 6) line(s, x - 8, yy, x + 8, yy + 3, { stroke: C.STAHLRAND, 'stroke-width': 0.7 });
}

/** Kräfteplan: Pfeile aneinandergereiht (Winkel in Grad), Resultierende von A nach E. */
export function kraefteplan(
  fs: { F: number; a: number; lab: string }[],
  o: { h?: number; titel?: string; Mk?: number; R?: string | false } = {},
) {
  const h = o.h ?? 280;
  const s = blatt(h, 'Kräfteplan');
  let x = 0, y = 0;
  const pts: [number, number][] = [[0, 0]];
  fs.forEach((q) => {
    x += q.F * Math.cos((q.a * Math.PI) / 180);
    y += q.F * Math.sin((q.a * Math.PI) / 180);
    pts.push([x, y]);
  });
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const W = Math.max(...xs) - Math.min(...xs) || 1, Hh = Math.max(...ys) - Math.min(...ys) || 1;
  const kk = Math.min(420 / W, (h - 90) / Hh);
  const X = (u: number) => 110 + (u - Math.min(...xs)) * kk;
  const Y = (v: number) => h - 45 - (v - Math.min(...ys)) * kk;
  txt(s, 20, 26, o.titel ?? 'Kräfteplan: Kräfte aneinanderreihen', { 'font-size': 13, fill: C.GRAU });
  const cxm = pts.reduce((a, p) => a + X(p[0]), 0) / pts.length, cym = pts.reduce((a, p) => a + Y(p[1]), 0) / pts.length;
  // Beschriftungen liegen immer auf der Seite ohne andere Pfeile (weg vom Schwerpunkt des Plans)
  const aussen = (px: number, py: number, t: string) => {
    let dx = px - cxm, dy = py - cym;
    const n = Math.hypot(dx, dy);
    if (n < 1) { dx = -1; dy = 1; } else { dx /= n; dy /= n; }
    if (Math.abs(dy) < 0.3) dy = 1;
    txt(s, px + dx * 16, py + dy * 16 + 5, t, { 'font-weight': 600, 'text-anchor': 'middle' });
  };
  const seitlich = (x0: number, y0: number, x1: number, y1: number, t: string, oben: boolean) => {
    const len = Math.hypot(x1 - x0, y1 - y0) || 1, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    let nx = -(y1 - y0) / len, ny = (x1 - x0) / len;
    const d = nx * (mx - cxm) + ny * (my - cym);
    if (Math.abs(d) < 1) { if (oben ? ny > 0 : ny < 0) { nx = -nx; ny = -ny; } } else if (d < 0) { nx = -nx; ny = -ny; }
    const w = t.replace(/_/g, '').length * 8.5;
    const off = 12 + (w / 2) * Math.abs(nx) + 9 * Math.abs(ny);
    return [mx + nx * off, my + ny * off + 5];
  };
  aussen(X(0), Y(0), 'A');
  fs.forEach((q, i) => {
    const [a, b] = pts[i], [c, d] = pts[i + 1];
    const [lx, ly] = seitlich(X(a), Y(b), X(c), Y(d), q.lab, true);
    kraft(s, X(a), Y(b), X(c), Y(d), q.lab, lx, ly - 4, { 'font-size': 13, 'text-anchor': 'middle' });
  });
  const [ex, ey] = pts[pts.length - 1];
  aussen(X(ex), Y(ey), 'E');
  if (o.R !== false) {
    const [lx, ly] = seitlich(X(0), Y(0), X(ex), Y(ey), o.R ?? 'F_r', false);
    resultierende(s, X(0), Y(0), X(ex), Y(ey), o.R ?? 'F_r', lx, ly);
    s.lastElementChild!.setAttribute('text-anchor', 'middle');
  }
  if (o.Mk) txt(s, 20, 48, `M_k = ${o.Mk} N/mm`, { 'font-size': 13, fill: C.GRAU });
  return s;
}

/** Waagrechte Balken (Anteil 0..1) mit Text rechts. */
export function saeulen(titel: string, rows: { v: number; t: string }[]) {
  const s = blatt(70 + rows.length * 46, titel);
  txt(s, 30, 34, titel, { 'font-weight': 600 });
  rows.forEach((r, i) => {
    const y = 56 + i * 46;
    s.append(el('rect', { x: 30, y, width: 420, height: 24, rx: 4, fill: '#fff', stroke: '#c9ced6' }));
    if (r.v > 0) s.append(el('rect', { x: 30, y, width: Math.max(3, 420 * Math.min(1, r.v)), height: 24, rx: 4, fill: C.F }));
    txt(s, 462, y + 17, r.t, { 'font-size': 14 });
  });
  return s;
}
