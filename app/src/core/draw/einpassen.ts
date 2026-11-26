// Bilder auf den Inhalt zuschneiden, damit sie am Handy ohne Wischen gross genug sind.
// Die Zeichnungen haben ein Blatt von 640 px Breite. Oft nutzt das Bauteil nur 300–500 px davon.
// einpassen() setzt die viewBox auf den Inhalt plus Rand. Braucht ein Bild, das im Dokument steht.

/** Rand um den Inhalt in Bildeinheiten. Deckt auch Pfeilspitzen (Marker) ab, die nicht im Rahmen zählen. */
const RAND = 14;

/** Rahmen des Inhalts in Bildeinheiten [x0, y0, x1, y1] oder null, wenn nichts messbar ist. */
export function inhaltRahmen(svg: SVGSVGElement): [number, number, number, number] | null {
  const ctm = svg.getScreenCTM?.();
  if (!ctm) return null;
  const inv = ctm.inverse();
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const c of Array.from(svg.children)) {
    if (!(c instanceof SVGGraphicsElement) || c.tagName === 'defs') continue;
    if (c.tagName === 'rect' && c.getAttribute('width') === '640') continue; // Blatt-Hintergrund
    const r = c.getBoundingClientRect();
    if (!r.width && !r.height) continue;
    const a = new DOMPoint(r.left, r.top).matrixTransform(inv);
    const b = new DOMPoint(r.right, r.bottom).matrixTransform(inv);
    x0 = Math.min(x0, a.x, b.x); y0 = Math.min(y0, a.y, b.y);
    x1 = Math.max(x1, a.x, b.x); y1 = Math.max(y1, a.y, b.y);
  }
  return isFinite(x0) ? [x0, y0, x1, y1] : null;
}

/**
 * Schneidet das Bild auf den Inhalt zu. Mit `begrenzen` wird das Bild am grossen Bildschirm
 * höchstens etwas grösser als gezeichnet (sonst wirken kleine Bauteile riesig).
 */
export function einpassen(svg: SVGSVGElement, o: { rand?: number; begrenzen?: boolean } = {}): boolean {
  if (svg.dataset.eingepasst) return true;
  const box = inhaltRahmen(svg);
  if (!box) return false;
  const r = o.rand ?? RAND;
  const w = box[2] - box[0] + 2 * r;
  const h = box[3] - box[1] + 2 * r;
  svg.setAttribute('viewBox', `${round(box[0] - r)} ${round(box[1] - r)} ${round(w)} ${round(h)}`);
  if (o.begrenzen) svg.style.maxWidth = `${Math.round(w * 1.15)}px`;
  svg.dataset.eingepasst = '1';
  return true;
}

const round = (v: number) => Math.round(v * 10) / 10;
