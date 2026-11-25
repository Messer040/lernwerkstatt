// Bauteilbilder für das Kapitel Knobelaufgaben: Mobile, Gabelstapler, Kugelbahn.
import { C, balken, blatt, boden, bolzen, el, geschw, kiste, kraft, line, massH, massV, ref, txt } from '../../../core/draw/svg';
import { fmt } from '../../../core/zahl';

const faden = (s: SVGSVGElement, x1: number, y1: number, x2: number, y2: number) =>
  line(s, x1, y1, x2, y2, { stroke: '#444', 'stroke-width': 1.5 });

/** Mobile aus zwei Stäben. Masse in cm, Stäbe und Fäden gewichtslos. */
export function mobile(
  p: { m1: number | string; c: number; d: number; a: number; b: number },
  o: { m2?: string; m3?: string; d?: string; b?: string } = {},
) {
  const s = blatt(320, 'Mobile aus zwei Stäben');
  const k = 6, xP = 300, y1 = 70, y2 = 165;
  const xL = xP - p.c * k, xR = xP + p.d * k, x2a = xR - p.a * k, x2b = xR + p.b * k;
  boden(s, 220, 14, 160, 12);
  faden(s, xP, 26, xP, y1);
  balken(s, xL - 8, xR + 8, y1, 8);
  bolzen(s, xP, y1);
  faden(s, xL, y1 + 4, xL, y1 + 60);
  s.append(el('circle', { cx: xL, cy: y1 + 82, r: 22, fill: C.HOLZ, stroke: '#555' }));
  txt(s, xL, y1 + 87, `${p.m1} g`, { 'text-anchor': 'middle', 'font-size': 13 });
  faden(s, xR, y1 + 4, xR, y2);
  balken(s, x2a - 8, x2b + 8, y2, 8);
  bolzen(s, xR, y2);
  faden(s, x2a, y2 + 4, x2a, y2 + 50);
  s.append(el('rect', { x: x2a - 24, y: y2 + 50, width: 48, height: 40, rx: 3, fill: C.STAHL, stroke: C.STAHLRAND }));
  txt(s, x2a, y2 + 75, o.m2 ?? 'm_2 = ?', { 'text-anchor': 'middle', 'font-size': 12 });
  faden(s, x2b, y2 + 4, x2b, y2 + 50);
  s.append(el('polygon', { points: `${x2b},${y2 + 50} ${x2b - 28},${y2 + 94} ${x2b + 28},${y2 + 94}`, fill: '#c9b8e8', stroke: '#555' }));
  txt(s, x2b, y2 + 112, o.m3 ?? 'm_3 = ?', { 'text-anchor': 'middle', 'font-size': 12 });
  massH(s, xL, xP, y1 - 22, `c = ${p.c}`, y1 - 8);
  massH(s, xP, xR, y1 - 22, o.d ?? `d = ${p.d}`, y1 - 8);
  massH(s, x2a, xR, y2 - 20, `a = ${p.a}`, y2 - 8);
  massH(s, xR, x2b, y2 - 20, o.b ?? `b = ${p.b}`, y2 - 8, undefined, p.b < 10 ? { aussen: true } : {});
  txt(s, 20, 306, 'Masse in cm. Stäbe und Fäden sind gewichtslos.', { 'font-size': 12, fill: C.GRAU });
  return s;
}

/** Gabelstapler mit Last. Kippkante K = Vorderachse. */
export function stapler(p: { mS: number | string; a: number; b: number }, o: { mL?: string; FL?: string; FG?: string; b?: string } = {}) {
  const s = blatt(300, 'Gabelstapler mit Last');
  const k = 0.16, xK = 250, yG = 235, xLoad = xK - p.a * k, xS = xK + p.b * k;
  boden(s, 60, yG, 520, 14);
  s.append(el('rect', { x: xK - 22, y: 150, width: p.b * k + 150, height: 62, rx: 8, fill: C.STAHL, stroke: C.STAHLRAND, 'stroke-width': 1.4 }));
  s.append(el('rect', { x: xK + 40, y: 95, width: 110, height: 58, rx: 6, fill: 'none', stroke: C.STAHLRAND, 'stroke-width': 3 }));
  s.append(el('rect', { x: xK - 34, y: 60, width: 12, height: 165, fill: '#777', stroke: '#444' }));
  s.append(el('rect', { x: xLoad - 70, y: 205, width: xK - 34 - (xLoad - 70), height: 7, fill: '#555' }));
  kiste(s, xLoad - 48, 135, 96, 70);
  txt(s, xLoad, 125, o.mL ?? 'm_L = ?', { 'text-anchor': 'middle', 'font-size': 14 });
  const xH = xK + p.b * k + 100;
  [xK, xH].forEach((x) => {
    s.append(el('circle', { cx: x, cy: yG - 22, r: 22, fill: '#444' }));
    s.append(el('circle', { cx: x, cy: yG - 22, r: 8, fill: '#ccc' }));
  });
  s.append(el('circle', { cx: xS, cy: 182, r: 5, fill: '#fff', stroke: C.INK }));
  txt(s, xS + 10, 176, 'S', { 'font-size': 13, 'font-weight': 600 });
  kraft(s, xLoad, 170, xLoad, 228, o.FL ?? 'F_L', xLoad - 8, 224, { 'text-anchor': 'end' });
  kraft(s, xS, 182, xS, 228, o.FG ?? 'F_G', xS + 8, 224);
  line(s, xK, yG - 44, xK, yG + 40, { stroke: C.M, 'stroke-dasharray': '5 4', 'stroke-width': 1.5 });
  txt(s, xK + 4, yG + 56, 'Kippkante K', { 'font-size': 13, fill: C.M, 'text-anchor': 'middle' });
  massH(s, xLoad, xK, yG + 30, `a = ${p.a}`, yG + 2);
  massH(s, xK, xS, yG + 30, o.b ?? `b = ${p.b}`, yG + 2);
  txt(s, 470, 60, `Stapler m_S = ${p.mS} kg`, { 'font-size': 14, 'text-anchor': 'middle' });
  return s;
}

/** Kugelbahn: Start links, tiefster Punkt in der Mitte, Umkehrpunkt rechts. */
export function bahn(
  p: { h1: number; m: number; loss: number },
  o: { h1?: string; h2?: string; v?: string; m?: string } = {},
) {
  const s = blatt(300, 'Kugelbahn mit Reibungsverlust');
  const k = 38, yB = 262, xa = 90, xb = 320, xc = 560;
  const h2 = p.h1 * (1 - p.loss / 100), y1 = yB - p.h1 * k, y2 = yB - h2 * k;
  s.append(el('path', {
    d: `M${xa - 30},${y1} L${xa},${y1} C${xa + 110},${y1} ${xb - 110},${yB} ${xb},${yB} C${xb + 110},${yB} ${xc - 110},${y2} ${xc},${y2} L${xc + 30},${y2} L${xc + 30},${yB + 16} L${xa - 30},${yB + 16} Z`,
    fill: ref(s, 'hat'), stroke: '#555',
  }));
  const kugel = (x: number, y: number, strich: boolean) =>
    s.append(el('circle', { cx: x, cy: y - 11, r: 11, ...(strich ? { fill: 'none', stroke: '#777', 'stroke-dasharray': '4 3' } : { fill: C.HOLZ, stroke: '#555' }) }));
  kugel(xa - 8, y1, false);
  kugel(xb, yB, true);
  kugel(xc + 8, y2, true);
  massV(s, y1, yB, xa - 48, o.h1 ?? `h_1 = ${fmt(p.h1)} m`, xa - 30);
  massV(s, y2, yB, xc + 52, o.h2 ?? 'h_2 = ?', xc + 30);
  if (o.v !== '') geschw(s, xb + 16, yB - 28, xb + 86, yB - 28, o.v ?? 'v = ?', xb + 20, yB - 40);
  txt(s, xa + 20, y1 - 26, o.m ?? `m = ${p.m} kg`, { 'font-size': 14 });
  txt(s, 400, 40, `Weg nach oben: Verlust ${p.loss} %`, { 'font-size': 13, fill: C.GRAU, 'text-anchor': 'middle' });
  return s;
}
