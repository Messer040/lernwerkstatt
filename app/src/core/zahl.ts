// Zahlen erzeugen, formatieren und einlesen.

/** Zufallszahl aus [a, b] im Raster st. */
export const rng = (a: number, b: number, st: number): number => {
  const n = Math.round((b - a) / st);
  return +(a + st * Math.floor(Math.random() * (n + 1))).toFixed(10);
};

export const pick = <T>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];

/** Zahl mit Komma; ohne d werden je nach Grösse 0 bis 2 Stellen gezeigt. */
export const fmt = (x: number, d?: number): string => {
  if (!isFinite(x)) return '–';
  if (d === undefined) {
    const a = Math.abs(x);
    d = a >= 100 ? 0 : a >= 10 ? 1 : 2;
  }
  const t = x
    .toFixed(d)
    .replace('.', ',')
    .replace(/(,\d*?)0+$/, '$1')
    .replace(/,$/, '');
  // Tausender ab 10 000 mit Apostroph (Schweizer Schreibweise)
  return Math.abs(x) >= 10000 ? t.replace(/^(-?\d+)/, (g) => g.replace(/\B(?=(\d{3})+$)/g, "'")) : t;
};

/** Liest «1'250,5», «1 250.5» oder «1.25e3». Gibt NaN zurück, wenn nichts Sinnvolles drinsteht. */
export const parseZahl = (s: string): number => {
  const t = s.trim().replace(/['’\s]/g, '').replace(',', '.').replace('−', '-');
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return NaN;
  return Number(t);
};
