// Kleine DOM-Helfer.
export function h<K extends keyof HTMLElementTagNameMap>(
  t: K,
  a: Record<string, string> = {},
  ...k: (Node | string | null | undefined | false)[]
): HTMLElementTagNameMap[K] {
  const e = document.createElement(t);
  for (const i in a) {
    if (i === 'html') e.innerHTML = a[i];
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
