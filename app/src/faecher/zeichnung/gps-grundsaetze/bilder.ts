// Wiederverwendbare Bilder zu ISO GPS (eigene Zeichnungen, keine Buchbilder).
// hierarchie(): die drei Stufen der GPS-Normen. massmerkmale(): die vier Gruppen der Grössenmassmerkmale.
import { C, blatt, el, txt } from '../../../core/draw/svg';

const box = (s: SVGSVGElement, x: number, y: number, w: number, h: number, fill = '#f2f4f7', stroke = C.STAHLRAND) =>
  s.append(el('rect', { x, y, width: w, height: h, rx: 4, fill, stroke, 'stroke-width': 1.4 }));

/** Drei Stufen der GPS-Normenhierarchie. `fragen` ersetzt Namen durch Fragezeichen. */
export function hierarchie(fragen = false): SVGSVGElement {
  const s = blatt(250, 'Hierarchie der GPS-Normen');
  const stufen = [
    ['1. Stufe', 'Fundamentale GPS-Normen', 'Grundsätze und Regeln'],
    ['2. Stufe', 'Allgemeine GPS-Normen', 'Tolerierung im Allgemeinen'],
    ['3. Stufe', 'Komplementäre GPS-Normen', 'Zusatz für Verfahren und Werkstoffe'],
  ];
  stufen.forEach(([st, name, wie], i) => {
    const y = 20 + i * 70;
    box(s, 150, y, 340, 48, i === 0 ? '#dbe8f6' : '#f2f4f7');
    txt(s, 320, y + 21, fragen ? '?' : name, { 'text-anchor': 'middle', 'font-weight': 600 });
    txt(s, 320, y + 39, fragen ? '' : wie, { 'text-anchor': 'middle', 'font-size': 12, fill: C.GRAU });
    txt(s, 60, y + 29, st, { 'font-size': 14, fill: C.L });
    if (i < 2) {
      s.append(el('line', { x1: 320, y1: y + 48, x2: 320, y2: y + 70, stroke: C.INK, 'stroke-width': 1.4, 'marker-end': `url(#${s.getAttribute('data-mid')}D)` }));
    }
  });
  txt(s, 500, 134, 'Regeln der höheren Stufe', { 'font-size': 12, fill: C.GRAU });
  txt(s, 500, 148, 'gelten auch unten', { 'font-size': 12, fill: C.GRAU });
  return s;
}

/** Die vier Gruppen der Grössenmassmerkmale mit Symbolen. */
export function massmerkmale(): SVGSVGElement {
  const s = blatt(270, 'Grössenmassmerkmale nach Gruppen');
  const spalten: [string, string[]][] = [
    ['Örtliches Grössenmass', ['LP Zweipunkt', 'LS sphärisch', 'ACS Querschnitt', 'CC umfangsbezogen', 'CA flächenbezogen']],
    ['Globales Grössenmass', ['GG Abw.quadrate', 'GC Minimax', 'GX einbeschrieben', 'GN umschrieben', 'CV volumenbezogen']],
    ['Kombination', ['E Hüllbedingung']],
    ['Rangordnung', ['SX grösstes', 'SN kleinstes', 'SA mittleres', 'SM Median', 'SD Mittel Min/Max', 'SR Spanne', 'SQ Standardabw.']],
  ];
  const w = 150, gap = 10;
  spalten.forEach(([kopf, zeilen], i) => {
    const x = 8 + i * (w + gap);
    box(s, x, 12, w, 34, '#dbe8f6');
    txt(s, x + w / 2, 33, kopf, { 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 600 });
    zeilen.forEach((z, j) => {
      const y = 54 + j * 29;
      box(s, x, y, w, 25);
      const [sym, ...rest] = z.split(' ');
      txt(s, x + 6, y + 17, sym, { 'font-size': 12, 'font-weight': 700, fill: C.L });
      txt(s, x + 6 + sym.length * 8 + 6, y + 17, rest.join(' '), { 'font-size': 10.5, fill: C.INK });
    });
  });
  return s;
}
