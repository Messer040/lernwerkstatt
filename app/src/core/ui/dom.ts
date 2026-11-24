// Kleine DOM-Helfer.
/** «F_u» → F mit tiefgestelltem u. Tags bleiben unberührt. */
export function tiefstellen(html: string): string {
  return html
    .split(/(<[^>]*>)/)
    .map((t, i) => (i % 2 ? t : t.replace(/([A-Za-zΣ])_([A-Za-z0-9]+)/g, '$1<sub>$2</sub>')))
    .join('');
}

export function h<K extends keyof HTMLElementTagNameMap>(
  t: K,
  a: Record<string, string> = {},
  ...k: (Node | string | null | undefined | false)[]
): HTMLElementTagNameMap[K] {
  const e = document.createElement(t);
  for (const i in a) {
    if (i === 'html') e.innerHTML = tiefstellen(a[i]);
    else e.setAttribute(i, a[i]);
  }
  for (const c of k) if (c) e.append(c);
  return e;
}

export const html = (s: string) => {
  const t = document.createElement('template');
  t.innerHTML = s;
  return t.content;
};
