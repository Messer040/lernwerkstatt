// Bauteilbilder für das Kapitel Zahnräder: Übersetzung.
// Vorderansicht (Räder in einer Reihe mit Drehsinn) und Getriebeschema (Seitenansicht, mehrstufig).
import { C, blatt, drehsinn, el, line, radSeite, txt } from '../../../core/draw/svg';
import { kranz } from '../zahnrad/bilder';

const FARBEN = ['#cfe0f3', C.STAHL, '#d9e8f7', '#bcd5ef'];

export interface Reihe {
  zs: number[];
  /** Drehsinn von Rad 1: true = im Uhrzeigersinn */
  cw: boolean;
  /** Beschriftung oben pro Rad (Standard «z_i = …») */
  oben?: string[];
  /** Beschriftung unten pro Rad (z. B. Drehzahl) */
  unten?: string[];
  /** Für diese Räder statt Pfeil ein «?» zeichnen */
  frage?: number[];
  /** Pfeil nur bei Rad 1 (und Fragen) zeichnen */
  nurErster?: boolean;
}

/** Räder in einer Reihe, jedes greift ins nächste. Drehsinn wechselt von Rad zu Rad. */
export function reihe(o: Reihe) {
  const s = blatt(300, 'Zahnräder in einer Reihe mit Drehsinn');
  const summe = o.zs.reduce((a, b) => a + b, 0);
  const k = Math.min(540 / (summe + 4), 170 / Math.max(...o.zs));
  const cy = 145;
  let cx = 320 - (k * summe) / 2 + (k * o.zs[0]) / 2;
  const mitten: { cx: number; cy: number; r: number }[] = [];
  let ph = 0, cyAkt = cy;
  o.zs.forEach((z, i) => {
    const r = (z * k) / 2, ap = (2 * Math.PI) / z;
    if (i === 0) {
      ph = Math.PI / 2 - 0.25 * ap; // Zahnmitte zeigt nach rechts
    } else {
      // Zahnmitte des Vorgängers suchen, die am nächsten bei 0° liegt, und das Rad dort ansetzen
      const v = mitten[i - 1], zv = o.zs[i - 1], apv = (2 * Math.PI) / zv;
      const basis = -Math.PI / 2 + ph + 0.25 * apv;
      const j = Math.round(-basis / apv);
      const th = basis + j * apv;
      cx = v.cx + (v.r + r) * Math.cos(th);
      cyAkt = v.cy + (v.r + r) * Math.sin(th);
      ph = th + Math.PI + Math.PI / 2 - 0.75 * ap; // Lückenmitte zeigt zum Vorgänger
    }
    kranz(s, cx, cyAkt, r, z, FARBEN[i % FARBEN.length], { echt: true, phase: ph });
    mitten.push({ cx, cy: cyAkt, r });
  });
  mitten.forEach((g, i) => {
    const cw = i % 2 === 0 ? o.cw : !o.cw;
    const ra = g.r + k;
    const rp = Math.max(g.r * 0.62, 20);
    if (o.frage?.includes(i)) {
      txt(s, g.cx, g.cy + 8, '?', { fill: C.V, 'font-weight': 700, 'font-size': 22, 'text-anchor': 'middle' });
    } else if (!o.nurErster || i === 0) {
      drehsinn(s, g.cx, g.cy, rp, cw, -90, 110);
    }
    // Erstes Rad: Text nach links, letztes Rad: nach rechts, damit er nicht über das Nachbarrad läuft
    const letzt = i === mitten.length - 1;
    const [xt, anker] = i === 0 && g.r < 50 ? [g.cx + 12, 'end'] : letzt && i > 0 && g.r < 50 && g.cx < 540 ? [g.cx - 12, 'start'] : [g.cx, 'middle'];
    txt(s, xt, Math.min(g.cy - ra - 10, g.cy - rp - 12), o.oben?.[i] ?? `z_${i + 1} = ${o.zs[i]}`, { 'text-anchor': anker, 'font-size': 14 });
    // Untere Beschriftung tiefer setzen, wenn sie der vorherigen zu nahe kommt
    const yU = g.cy + ra + 22 + (i > 0 && o.unten?.[i - 1] && g.cx - mitten[i - 1].cx < 110 ? 20 : 0);
    if (o.unten?.[i]) txt(s, xt, yU, o.unten[i], { 'text-anchor': anker, 'font-size': 14, fill: o.unten[i].startsWith('M') ? C.M : C.V, 'font-weight': 600 });
  });
  return s;
}

export interface Schema {
  /** Stufen: [treibendes Rad, getriebenes Rad] */
  stufen: [number, number][];
  /** Beschriftung pro Rad, Reihenfolge z_1, z_2, z_3 … (Standard «z_i = …») */
  namen?: string[];
  an?: string;
  ab?: string;
  /** Seiltrommel an der Abtriebswelle */
  trommel?: string;
}

/** Getriebeschema in der Seitenansicht: Wellen waagrecht, Räder als Rechtecke. */
export function schema(o: Schema) {
  const n = o.stufen.length;
  const halb = o.stufen.flat().map((z) => z / 2);
  // Höhe in «Radien»: oberstes Rad oben, dann pro Stufe r_a + r_b, unterstes Rad unten
  const einheiten = halb[0] + o.stufen.reduce((a, [za, zb]) => a + za / 2 + zb / 2, 0) + halb[halb.length - 1];
  const k = Math.min(230 / einheiten, 3.2);
  const h = Math.round(einheiten * k + 80);
  const s = blatt(h, 'Getriebeschema mit Wellen und Zahnrädern');
  const dx = n === 1 ? 0 : Math.min(160, 280 / (n - 1));
  const X = o.stufen.map((_, i) => 280 + i * dx - ((n - 1) * dx) / 2 + 30);
  const Y: number[] = [40 + halb[0] * k];
  o.stufen.forEach(([za, zb], i) => Y.push(Y[i] + ((za + zb) / 2) * k));
  const xEnde = o.trommel ? 560 : 600;
  // Wellen: Welle i läuft von Rad b_{i-1} bis Rad a_i
  for (let w = 0; w <= n; w++) {
    const x1 = w === 0 ? 40 : X[w - 1] - 28;
    const x2 = w === n ? xEnde : X[w] + 28;
    s.append(el('rect', { x: x1, y: Y[w] - 4, width: x2 - x1, height: 8, fill: '#dfe6ee', stroke: C.STAHLRAND, 'stroke-width': 1 }));
    // Lager an beiden Enden
    for (const xl of [x1 + 10, x2 - 10]) {
      if ((w === 0 && xl < 60) || (w === n && xl > xEnde - 30 && !o.trommel)) continue;
      s.append(el('rect', { x: xl - 5, y: Y[w] - 12, width: 10, height: 6, fill: C.GESTELL, stroke: '#555' }));
      s.append(el('rect', { x: xl - 5, y: Y[w] + 6, width: 10, height: 6, fill: C.GESTELL, stroke: '#555' }));
    }
  }
  let nr = 0;
  o.stufen.forEach(([za, zb], i) => {
    radSeite(s, X[i], Y[i], (za / 2) * k, FARBEN[0]);
    radSeite(s, X[i], Y[i + 1], (zb / 2) * k, C.STAHL);
    const na = o.namen?.[nr] ?? `z_${nr + 1} = ${za}`;
    const nb = o.namen?.[nr + 1] ?? `z_${nr + 2} = ${zb}`;
    nr += 2;
    txt(s, X[i] + 32, Y[i] + 20, na, { 'font-size': 14 });
    txt(s, X[i] - 32, Y[i + 1] - 8, nb, { 'font-size': 14, 'text-anchor': 'end' });
  });
  const farbe = (t: string) => (t.startsWith('M') ? C.M : C.V);
  if (o.an) txt(s, 44, Y[0] - 14, o.an, { fill: farbe(o.an), 'font-weight': 600, 'font-size': 14 });
  if (o.trommel) {
    const yT = Y[n], rT = Math.min(34, h / 2 - 20);
    s.append(el('rect', { x: 560, y: yT - rT, width: 44, height: 2 * rT, fill: C.HOLZ, stroke: '#8a6d1f', 'stroke-width': 1.2 }));
    line(s, 582, yT + rT, 582, Math.min(h - 6, yT + rT + 40), { stroke: C.INK, 'stroke-width': 2 });
    txt(s, 556, yT - rT - 8, o.trommel, { 'font-size': 14, 'text-anchor': 'end', fill: C.L, 'font-weight': 600 });
  } else if (o.ab) {
    txt(s, xEnde - 4, Y[n] + 26, o.ab, { fill: farbe(o.ab), 'font-weight': 600, 'font-size': 14, 'text-anchor': 'end' });
  }
  if (o.trommel && o.ab) txt(s, 556, Y[n] + 26, o.ab, { fill: C.V, 'font-weight': 600, 'font-size': 14, 'text-anchor': 'end' });
  return s;
}
