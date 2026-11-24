// Bauteilbilder für das Kapitel Biegen.
// Längen blau (feste Farbe). Blech wie bei Stäben: blauer Rand, hellblaue Füllung.
import { C, blatt, el, line, stab, txt } from '../../../core/draw/svg';

type S = SVGSVGElement;
type P = [number, number];

export type Dreh = 'L' | 'R';
export type Start = 'N' | 'E' | 'S' | 'W';

const RICHT: Record<Start, P> = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
const rad = (g: number) => (g * Math.PI) / 180;

/** Eckpunkte (in mm, y nach unten) eines Streckenzugs mit 90°-Drehungen. */
export function eckpunkte(legs: number[], turns: Dreh[], start: Start): P[] {
  let h = RICHT[start];
  const pts: P[] = [[0, 0]];
  legs.forEach((len, i) => {
    const q = pts[i];
    pts.push([q[0] + h[0] * len, q[1] + h[1] * len]);
    const t = turns[i];
    if (t === 'L') h = [h[1], -h[0]];
    else if (t === 'R') h = [-h[1], h[0]];
  });
  return pts;
}

/** Skaliert die Punkte in das Zeichenfeld (x 90 bis 390, y 45 bis 235). */
function passen(pts: P[], bw = 300, bh = 190, kmax = 4) {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  const w = Math.max(...xs) - x0;
  const h = Math.max(...ys) - y0;
  const k = Math.min(kmax, bw / Math.max(w, 1), bh / Math.max(h, 1));
  const ox = 90 + (bw - w * k) / 2 - x0 * k;
  const oy = 45 + (bh - h * k) / 2 - y0 * k;
  return { px: pts.map(([x, y]): P => [ox + x * k, oy + y * k]), k };
}

/** Blech als dicker Streckenzug mit runden Ecken. */
function blech(s: S, px: P[], th: number) {
  const d = 'M' + px.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L');
  s.append(el('path', { d, fill: 'none', stroke: C.STAHLRAND, 'stroke-width': th, 'stroke-linejoin': 'round' }));
  s.append(el('path', { d, fill: 'none', stroke: C.STAHL, 'stroke-width': Math.max(2, th - 3), 'stroke-linejoin': 'round' }));
}

/** Beschriftung jedes Schenkels, auf der Aussenseite der Figur. */
function schenkel(s: S, px: P[], texte: (string | undefined)[], th: number) {
  const cx = px.reduce((a, p) => a + p[0], 0) / px.length;
  const cy = px.reduce((a, p) => a + p[1], 0) / px.length;
  texte.forEach((t, i) => {
    if (!t) return;
    const a = px[i];
    const b = px[i + 1];
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    let nx = -(b[1] - a[1]);
    let ny = b[0] - a[0];
    const n = Math.hypot(nx, ny) || 1;
    nx /= n;
    ny /= n;
    if (nx * (mx - cx) + ny * (my - cy) < 0) {
      nx = -nx;
      ny = -ny;
    }
    const d = th / 2 + 12;
    const an = nx > 0.4 ? 'start' : nx < -0.4 ? 'end' : 'middle';
    txt(s, mx + nx * d, my + ny * d + 5, t, { fill: C.L, 'font-size': 14, 'text-anchor': an });
  });
}

function infos(s: S, zeilen: string[]) {
  zeilen.forEach((t, i) => txt(s, 480, 70 + i * 24, t, { 'font-size': 14, 'font-weight': t.startsWith('L ') || t.startsWith('L=') ? 600 : 400 }));
}

/** Blechwinkel mit Öffnungswinkel be. Schenkel a waagrecht, Schenkel b unter dem Winkel. */
export function winkel(o: { a: number; b: number; be: number; s: number; r: number; ta?: string; tb?: string; info?: string[] }) {
  const s = blatt(280, 'Gebogenes Blech');
  const be = rad(o.be);
  const pts: P[] = [
    [o.a, 0],
    [0, 0],
    [o.b * Math.cos(be), -o.b * Math.sin(be)],
  ];
  const { px, k } = passen(pts);
  const th = Math.min(14, Math.max(6, o.s * k));
  blech(s, px, th);
  schenkel(s, px, [o.ta ?? `a = ${o.a}`, o.tb ?? `b = ${o.b}`], th);
  // Winkel β in der Öffnung
  const c = px[1];
  const u = (q: P): P => {
    const dx = q[0] - c[0];
    const dy = q[1] - c[1];
    const n = Math.hypot(dx, dy) || 1;
    return [dx / n, dy / n];
  };
  const u1 = u(px[0]);
  const u2 = u(px[2]);
  const bx = u1[0] + u2[0];
  const by = u1[1] + u2[1];
  const bn = Math.hypot(bx, by) || 1;
  txt(s, c[0] + (bx / bn) * (th / 2 + 52), c[1] + (by / bn) * (th / 2 + 52) + 5, `β = ${o.be}°`, { 'text-anchor': 'middle', 'font-size': 14 });
  infos(s, [`s = ${o.s} mm`, `r = ${o.r} mm (innen)`, ...(o.info ?? [])]);
  return s;
}

/** Profil aus mehreren Schenkeln mit 90°-Biegungen. */
export function profil(o: { legs: number[]; turns: Dreh[]; start: Start; texte?: (string | undefined)[]; s: number; r: number; info?: string[] }) {
  const s = blatt(280, 'Biegeprofil');
  const { px, k } = passen(eckpunkte(o.legs, o.turns, o.start));
  const th = Math.min(14, Math.max(6, o.s * k));
  blech(s, px, th);
  const namen = 'abcdefg';
  schenkel(s, px, o.texte ?? o.legs.map((l, i) => `${namen[i]} = ${l}`), th);
  infos(s, [`s = ${o.s} mm`, `r = ${o.r} mm (innen)`, ...(o.info ?? [])]);
  return s;
}

/** Rückfederung: Werkstück-Schenkel bei α_2, gestrichelt der Schenkel am Werkzeug bei α_1. */
export function rueckfeder(o: { a2: number; a1?: number; t1?: string; t2?: string; info?: string[] }) {
  const s = blatt(280, 'Rückfederung');
  const cx = 150, cy = 240, L = 200;
  const pol = (w: number, r: number): P => [cx + r * Math.cos(rad(w)), cy - r * Math.sin(rad(w))];
  const bogen = (w: number, r: number, dash = false) => {
    const a = pol(0, r);
    const b = pol(w, r);
    s.append(
      el('path', {
        d: `M${a[0]},${a[1]} A${r},${r} 0 0 0 ${b[0]},${b[1]}`,
        fill: 'none',
        stroke: dash ? C.GRAU : C.INK,
        'stroke-width': 1.2,
        'stroke-dasharray': dash ? '4 3' : '0',
      }),
    );
  };
  stab(s, cx, cy, cx + L, cy, 9);
  if (o.a1 !== undefined) {
    const e = pol(o.a1, L - 20);
    line(s, cx, cy, e[0], e[1], { stroke: C.GRAU, 'stroke-width': 4, 'stroke-dasharray': '8 5' });
    bogen(o.a1, 80, true);
  }
  const e2 = pol(o.a2, L - 20);
  stab(s, cx, cy, e2[0], e2[1], 9);
  bogen(o.a2, 55);
  txt(s, e2[0] + 12, e2[1] + 4, o.t2 ?? `Werkstück: α_2 = ${o.a2}°`, { 'font-size': 14 });
  // Werkzeug-Beschriftung (gestrichelt) im rechten Feld, damit sie nie am Rand klebt
  const t1 = o.a1 !== undefined ? (o.t1 ?? `Werkzeug: α_1 = ${o.a1}°`) : o.t1;
  if (t1) txt(s, 480, 70, t1, { 'font-size': 14, fill: C.GRAU });
  (o.info ?? []).forEach((t, i) => txt(s, 480, 94 + i * 24, t, { 'font-size': 14 }));
  return s;
}
