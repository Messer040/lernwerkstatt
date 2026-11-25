// Wiederverwendbare Bilder der vier Zahnradgetriebe (eigene Zeichnungen).
// Auch für Probeprüfungen gedacht: getriebe('stirn'), getriebeUebersicht().
import { C, blatt, el, ref, txt } from '../../../core/draw/svg';

export type Art = 'stirn' | 'kegel' | 'schraube' | 'schnecke';

export const ART: Record<Art, { name: string; lage: string; kurz: string }> = {
  stirn: { name: 'Stirnradgetriebe', lage: 'Wellen liegen parallel', kurz: 'parallel' },
  kegel: { name: 'Kegelradgetriebe', lage: 'Wellen schneiden sich', kurz: 'schneiden sich' },
  schraube: { name: 'Schraubenradgetriebe', lage: 'Wellen kreuzen sich', kurz: 'kreuzen sich' },
  schnecke: { name: 'Schneckengetriebe', lage: 'Wellen kreuzen sich', kurz: 'kreuzen sich' },
};
export const ARTEN: Art[] = ['stirn', 'kegel', 'schraube', 'schnecke'];

type G = SVGGElement;
const STAHL = C.STAHL, RAND = C.STAHLRAND;
const add = (g: G, t: keyof SVGElementTagNameMap, a: Record<string, string | number>) => { const e = el(t, a); g.append(e); return e; };
const ml = (g: G, x1: number, y1: number, x2: number, y2: number) =>
  add(g, 'line', { x1, y1, x2, y2, stroke: C.GRAU, 'stroke-width': 0.8, 'stroke-dasharray': '10 3 2 3' });
const rect = (g: G, x: number, y: number, w: number, h: number, fill: string = STAHL) =>
  add(g, 'rect', { x, y, width: w, height: h, fill, stroke: RAND, 'stroke-width': 1.2 });

/** Welle waagrecht oder senkrecht, Dicke 10. */
function welle(g: G, x1: number, y1: number, x2: number, y2: number) {
  if (y1 === y2) rect(g, Math.min(x1, x2), y1 - 5, Math.abs(x2 - x1), 10, '#dfe6ee');
  else rect(g, x1 - 5, Math.min(y1, y2), 10, Math.abs(y2 - y1), '#dfe6ee');
  ml(g, x1 + (y1 === y2 ? -6 : 0), y1 + (y1 === y2 ? 0 : -6), x2 + (y1 === y2 ? 6 : 0), y2 + (y1 === y2 ? 0 : 6));
}
/** Lager: zwei schraffierte Klötze beidseits der Welle. */
function lager(s: SVGSVGElement, g: G, x: number, y: number, senk = false) {
  const h = { fill: ref(s, 'hat'), stroke: '#555', 'stroke-width': 1 };
  if (!senk) { add(g, 'rect', { x: x - 8, y: y - 15, width: 16, height: 9, ...h }); add(g, 'rect', { x: x - 8, y: y + 6, width: 16, height: 9, ...h }); }
  else { add(g, 'rect', { x: x - 15, y: y - 8, width: 9, height: 16, ...h }); add(g, 'rect', { x: x + 6, y: y - 8, width: 9, height: 16, ...h }); }
}
/** Rad in Vorderansicht (Achse zeigt aus dem Blatt). */
function radVorne(g: G, cx: number, cy: number, r: number) {
  add(g, 'circle', { cx, cy, r, fill: STAHL, stroke: RAND, 'stroke-width': 1.2 });
  add(g, 'circle', { cx, cy, r: r - 6, fill: 'none', stroke: RAND, 'stroke-width': 0.6, 'stroke-dasharray': '10 3 2 3' });
  add(g, 'circle', { cx, cy, r: Math.max(10, r * 0.3), fill: '#dfe6ee', stroke: RAND });
  add(g, 'circle', { cx, cy, r: 5, fill: '#fff', stroke: RAND });
  ml(g, cx - r - 8, cy, cx + r + 8, cy); ml(g, cx, cy - r - 8, cx, cy + r + 8);
}
/** Schräge Linien (Schrägverzahnung oder Schneckengewinde) in einem Rechteck. */
function schraeg(g: G, x: number, y: number, w: number, h: number, dx: number, n: number) {
  for (let i = 0; i <= n; i++) {
    const xx = x + (i * w) / n;
    const x2 = Math.min(x + w, Math.max(x, xx + dx));
    add(g, 'line', { x1: xx, y1: y, x2, y2: y + h, stroke: RAND, 'stroke-width': 0.8 });
  }
}

/** Zeichnet eine Getriebeart in ein Feld 160 × 200 (lokale Koordinaten). */
function zeichne(s: SVGSVGElement, g: G, art: Art) {
  if (art === 'stirn') {
    welle(g, 10, 55, 150, 55); welle(g, 10, 135, 150, 135);
    rect(g, 70, 25, 22, 60); rect(g, 70, 85, 22, 100);
    [40, 122].forEach((x) => { lager(s, g, x, 55); lager(s, g, x, 135); });
  }
  if (art === 'kegel') {
    // Achsen schneiden sich in S (50,140). Teilkegel unter 45°: Radius = Abstand zu S.
    welle(g, 50, 10, 50, 100); welle(g, 90, 140, 155, 140);
    add(g, 'polygon', { points: '10,100 90,100 72,118 28,118', fill: STAHL, stroke: RAND, 'stroke-width': 1.2 });
    add(g, 'polygon', { points: '90,100 90,180 72,162 72,118', fill: STAHL, stroke: RAND, 'stroke-width': 1.2 });
    ml(g, 50, 100, 50, 150); ml(g, 40, 140, 90, 140);
    add(g, 'line', { x1: 50, y1: 140, x2: 81, y2: 109, stroke: C.GRAU, 'stroke-width': 0.6 });
    add(g, 'line', { x1: 50, y1: 140, x2: 19, y2: 109, stroke: C.GRAU, 'stroke-width': 0.6 });
    add(g, 'line', { x1: 50, y1: 140, x2: 81, y2: 171, stroke: C.GRAU, 'stroke-width': 0.6 });
    add(g, 'circle', { cx: 50, cy: 140, r: 2, fill: C.INK });
    add(g, 'text', { x: 38, y: 156, 'font-size': 13, fill: C.INK }).textContent = 'S';
    lager(s, g, 50, 30, true); lager(s, g, 50, 72, true); lager(s, g, 115, 140); lager(s, g, 140, 140);
  }
  if (art === 'schraube') {
    radVorne(g, 80, 72, 46);
    welle(g, 10, 150, 150, 150);
    rect(g, 66, 118, 28, 64); schraeg(g, 66, 118, 28, 64, 14, 5);
    lager(s, g, 32, 150); lager(s, g, 128, 150);
  }
  if (art === 'schnecke') {
    radVorne(g, 80, 74, 62);
    welle(g, 10, 158, 150, 158);
    rect(g, 46, 136, 68, 44); schraeg(g, 46, 136, 68, 44, 10, 9);
    lager(s, g, 26, 158); lager(s, g, 134, 158);
  }
}

/** Ein Getriebe gross, optional mit Nummer oder Name darunter. */
export function getriebe(art: Art, o: { titel?: string } = {}) {
  const s = blatt(300, 'Zahnradgetriebe');
  const g = el('g', { transform: 'translate(220,0) scale(1.35)' }) as SVGGElement;
  zeichne(s, g, art);
  s.append(g);
  if (o.titel) txt(s, 328, 290, o.titel, { 'text-anchor': 'middle' });
  return s;
}

/** Alle vier nebeneinander mit Nummern 1 bis 4 (Reihenfolge wählbar). */
export function getriebeUebersicht(reihe: Art[] = ARTEN) {
  const s = blatt(270, 'Vier Zahnradgetriebe');
  reihe.forEach((art, i) => {
    const g = el('g', { transform: `translate(${i * 158 + 2},4) scale(0.98)` }) as SVGGElement;
    zeichne(s, g, art);
    s.append(g);
    const x = i * 158 + 80;
    s.append(el('circle', { cx: x, cy: 240, r: 13, fill: 'none', stroke: C.INK }));
    txt(s, x, 245, String(i + 1), { 'text-anchor': 'middle' });
  });
  return s;
}
