// Bauteilbilder für das Kapitel Zahnräder: Masse berechnen.
import { C, blatt, el, line, massH, massV, mittellinie, txt } from '../../../core/draw/svg';

const blau = (s: SVGSVGElement, x: number, y: number, t: string, o: Record<string, string | number> = {}) =>
  txt(s, x, y, t, { fill: C.L, 'font-weight': 600, 'font-size': 14, ...o });

/** Zahnkranz mit Kopf-, Teil- und Fusskreis. zv = gezeichnete Zähnezahl. */
function kranz(s: SVGSVGElement, cx: number, cy: number, r: number, z: number, fill: string = C.STAHL, o: { echt?: boolean; phase?: number } = {}) {
  const zv = o.echt ? Math.round(z) : Math.max(18, Math.min(36, Math.round(z)));
  const mv = (2 * r) / zv, ra = r + mv, rf = r - 1.25 * mv, ap = (2 * Math.PI) / zv, ph = o.phase ?? 0;
  const pts: string[] = [];
  const P = (rr: number, a: number) => `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`;
  for (let i = 0; i < zv; i++) {
    const a0 = i * ap - Math.PI / 2 + ph;
    pts.push(P(rf, a0), P(ra, a0 + 0.16 * ap), P(ra, a0 + 0.34 * ap), P(rf, a0 + 0.5 * ap));
  }
  s.append(el('polygon', { points: pts.join(' '), fill, stroke: C.STAHLRAND, 'stroke-width': 1.2 }));
  s.append(el('circle', { cx, cy, r: Math.min(16, r * 0.25), fill: C.GESTELL, stroke: '#555' }));
  s.append(el('circle', { cx, cy, r, fill: 'none', stroke: C.L, 'stroke-width': 1.2, 'stroke-dasharray': '12 3 2 3' }));
  mittellinie(s, cx - ra - 12, cy, cx + ra + 12, cy);
  mittellinie(s, cx, cy - ra - 12, cx, cy + ra + 12);
  return { ra, rf, ap };
}

/** Ein Zahnrad mit beschrifteten Kreisen d_a, d, d_f. */
export function rad(p: { z: number }, o: { d?: string; da?: string; df?: string; z?: string; m?: string } = {}) {
  const s = blatt(300, 'Zahnrad mit Kopf-, Teil- und Fusskreis');
  const cx = 170, cy = 150, r = 105;
  const { ra, rf } = kranz(s, cx, cy, r, p.z);
  const marke = (rr: number, a: number, ty: number, t: string) => {
    const x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
    s.append(el('circle', { cx: x, cy: y, r: 3, fill: C.L }));
    line(s, x, y, 330, ty, { stroke: C.L });
    line(s, 330, ty, 350, ty, { stroke: C.L });
    blau(s, 356, ty + 5, t);
  };
  marke(ra, -0.75, 60, o.da ?? 'd_a  Kopfkreis');
  marke(r, -0.1, 140, o.d ?? 'd  Teilkreis');
  marke(rf, 0.55, 220, o.df ?? 'd_f  Fusskreis');
  if (o.z) txt(s, 30, 30, o.z);
  if (o.m) blau(s, 30, 52, o.m, { 'font-weight': 400 });
  return s;
}

/** Ausschnitt Verzahnung (gestreckt) mit h_a, h_f, h, p und Kopfspiel c. */
export function zahn(o: { ha?: string; hf?: string; h?: string; p?: string; c?: string; m?: string } = {}) {
  const s = blatt(300, 'Zahn mit Kopfhöhe, Fusshöhe und Teilung');
  const yK = 60, yT = 124, yF = 204, x0 = 170, pw = 150; // Kopf-, Teil-, Fusslinie; Teilung in px
  const pts: string[] = [`${x0 - 20},${yF}`];
  for (let i = 0; i < 3; i++) {
    const a = x0 + i * pw;
    pts.push(`${a},${yF}`, `${a + 30},${yK}`, `${a + 50},${yK}`, `${a + 80},${yF}`);
  }
  pts.push(`${x0 + 3 * pw - 20},${yF}`, `${x0 + 3 * pw - 20},${yF + 40}`, `${x0 - 20},${yF + 40}`);
  s.append(el('polygon', { points: pts.join(' '), fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.2 }));
  line(s, x0 - 30, yK, x0 + 3 * pw - 10, yK, { stroke: C.GRAU, 'stroke-width': 0.6 });
  line(s, x0 - 30, yT, x0 + 3 * pw - 10, yT, { stroke: C.L, 'stroke-width': 1.2, 'stroke-dasharray': '12 3 2 3' });
  txt(s, x0 + 3 * pw - 24, yT - 6, 'Teilkreis', { fill: C.L, 'font-size': 13, 'text-anchor': 'end' });
  // Gegenrad: Kopf reicht bis yF - c
  const yG = yF - 16;
  line(s, x0 + 88, yG, x0 + pw - 8, yG, { stroke: C.GRAU, 'stroke-dasharray': '5 3' });
  txt(s, x0 + 115, yG - 8, 'Kopf Gegenrad', { fill: C.GRAU, 'font-size': 11, 'text-anchor': 'middle' });
  massV(s, yK, yT, x0 - 45, o.ha ?? 'h_a', x0 - 30);
  massV(s, yT, yF, x0 - 45, o.hf ?? 'h_f', x0 - 30);
  massV(s, yK, yF, x0 - 105, o.h ?? 'h', x0 - 30);
  massH(s, x0 + 40, x0 + pw + 40, 32, o.p ?? 'p', yK);
  line(s, x0 + 115, yG, x0 + 115, yF, { stroke: C.L, 'stroke-width': 1.6 });
  blau(s, x0 + 121, yF - 3, o.c ?? 'c', { 'font-size': 13 });
  if (o.m) blau(s, 20, 28, o.m, { 'font-weight': 400 });
  return s;
}

/** Zwei Räder im Eingriff mit Achsabstand a. */
export function paar(p: { z1: number; z2: number }, o: { z1?: string; z2?: string; a?: string; m?: string } = {}) {
  const s = blatt(300, 'Zwei Zahnräder im Eingriff');
  const k = Math.min(440 / (p.z1 + p.z2), 176 / Math.max(p.z1, p.z2)); // gleiche Teilung für beide Räder
  const r1 = (p.z1 * k) / 2, r2 = (p.z2 * k) / 2, cy = 128;
  const c1 = 330 - (r1 + r2) / 2, c2 = c1 + r1 + r2;
  const ap1 = (2 * Math.PI) / p.z1, ap2 = (2 * Math.PI) / p.z2;
  // Rad 1: Zahnmitte bei 0°, Rad 2: Lückenmitte bei 180°, damit die Zähne ineinandergreifen
  kranz(s, c1, cy, r1, p.z1, '#cfe0f3', { echt: true, phase: Math.PI / 2 - 0.25 * ap1 });
  kranz(s, c2, cy, r2, p.z2, C.STAHL, { echt: true, phase: (3 * Math.PI) / 2 - 0.75 * ap2 });
  massH(s, c1, c2, cy + Math.max(r1, r2) + k + 30, o.a ?? 'a', cy);
  txt(s, c1, cy - r1 - k - 18, o.z1 ?? `z_1 = ${p.z1}`, { 'text-anchor': 'middle' });
  txt(s, Math.min(c2 + r2 * 0.6, 600), cy - r2 * 0.8 - k - 6, o.z2 ?? `z_2 = ${p.z2}`, { 'text-anchor': 'start' });
  if (o.m) blau(s, 20, 28, o.m, { 'font-weight': 400 });
  return s;
}
