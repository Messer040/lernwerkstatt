// Seiten: Start, Fach, Kapitel, Kapiteltest.
import type { Fach, Kapitel, Stufe, Task } from '../types';
import { STUFEN } from '../types';
import { aufgabenKarte } from './aufgabe';
import { h } from './dom';

const link = (href: string, ...k: (Node | string)[]) => h('a', { href }, ...k);

export function startSeite(faecher: Fach[]): HTMLElement {
  return h(
    'section',
    { class: 'seite' },
    h('h1', {}, 'Lernwerkstatt'),
    h('p', { class: 'unter' }, 'Wähle ein Fach. Alles ist frei zugänglich.'),
    h(
      'div',
      { class: 'kacheln' },
      ...faecher.map((f) =>
        link(`#/${f.id}`, h('strong', {}, f.title), h('span', {}, f.kurz), h('small', {}, `${f.kapitel.length} Kapitel`)),
      ),
    ),
    h('p', { class: 'fuss' }, 'Neue Version im Aufbau. ', link('../', 'Zu den bisherigen Trainern')),
  );
}

export function fachSeite(f: Fach): HTMLElement {
  return h(
    'section',
    { class: 'seite' },
    h('nav', { class: 'pfad' }, link('#/', 'Start'), ' › ', f.title),
    h('h1', {}, f.title),
    h(
      'div',
      { class: 'liste' },
      ...f.kapitel.map((k) =>
        link(`#/${f.id}/${k.id}`, h('strong', {}, k.title), h('span', {}, k.kurz), h('small', {}, `${k.aufgaben.length} Aufgaben`)),
      ),
    ),
  );
}

export function kapitelSeite(f: Fach, k: Kapitel, filter: { karte?: string; stufe?: Stufe }): HTMLElement {
  const seite = h('section', { class: 'seite' });
  seite.append(
    h('nav', { class: 'pfad' }, link('#/', 'Start'), ' › ', link(`#/${f.id}`, f.title), ' › ', k.title),
    h('h1', {}, k.title),
    h('div', { class: 'knoepfe' }, link(`#/${f.id}/${k.id}/test`, 'Kapiteltest starten')),
  );
  seite.querySelector('.knoepfe a')!.className = 'knopf haupt';

  // Formelkarte
  seite.append(
    h(
      'details',
      { class: 'formeln' },
      h('summary', {}, 'Formelkarte'),
      h(
        'dl',
        {},
        ...k.formeln.flatMap((fo) => [h('dt', {}, fo.name), h('dd', { html: fo.f + (fo.g ? `<small>${fo.g}</small>` : '') })]),
      ),
    ),
  );

  // Filter: Lernkarte und Stufe
  const basis = `#/${f.id}/${k.id}`;
  const q = (karte?: string, stufe?: Stufe) => {
    const s = new URLSearchParams();
    if (karte) s.set('karte', karte);
    if (stufe) s.set('stufe', String(stufe));
    const t = s.toString();
    return t ? `${basis}?${t}` : basis;
  };
  const chip = (href: string, label: string, aktiv: boolean) => {
    const a = link(href, label);
    a.className = 'chip' + (aktiv ? ' aktiv' : '');
    return a;
  };
  seite.append(
    h(
      'div',
      { class: 'filter', role: 'navigation', 'aria-label': 'Lernkarten' },
      chip(q(undefined, filter.stufe), 'Alle', !filter.karte),
      ...k.karten.map((c) => chip(q(c.id, filter.stufe), c.title, filter.karte === c.id)),
    ),
    h(
      'div',
      { class: 'filter', role: 'navigation', 'aria-label': 'Stufen' },
      chip(q(filter.karte), 'Alle Stufen', !filter.stufe),
      ...([1, 2, 3] as Stufe[]).map((s) => chip(q(filter.karte, s), `${s} · ${STUFEN[s]}`, filter.stufe === s)),
    ),
  );
  const kAkt = k.karten.find((c) => c.id === filter.karte);
  if (kAkt) seite.append(h('p', { class: 'ziel' }, `Ziel: ${kAkt.ziel}`));

  const liste = k.aufgaben.filter((t) => (!filter.karte || t.karte === filter.karte) && (!filter.stufe || t.stufe === filter.stufe));
  if (!liste.length) seite.append(h('p', {}, 'Für diese Auswahl gibt es noch keine Aufgaben.'));
  liste.forEach((t, i) => seite.append(aufgabenKarte(t, { nummer: i + 1 })));
  return seite;
}

const mischen = <T>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

/** Wählt Testaufgaben: Anteil Stufe 1/2/3 etwa 25/50/25 %, aufsteigend sortiert. */
export function waehleTest(aufgaben: Task[], n = 8): Task[] {
  const ziel: Record<Stufe, number> = { 1: Math.round(n * 0.25), 2: n - 2 * Math.round(n * 0.25), 3: Math.round(n * 0.25) };
  const wahl: Task[] = [];
  for (const s of [1, 2, 3] as Stufe[]) wahl.push(...mischen(aufgaben.filter((t) => t.stufe === s)).slice(0, ziel[s]));
  const rest = mischen(aufgaben.filter((t) => !wahl.includes(t)));
  while (wahl.length < Math.min(n, aufgaben.length)) wahl.push(rest.shift()!);
  return wahl.sort((a, b) => a.stufe - b.stufe);
}

/** Schweizer Note 1 bis 6, auf Zehntel gerundet. */
export const note = (p: number, max: number) => Math.round((5 * (max ? p / max : 0) + 1) * 10) / 10;

export function testSeite(f: Fach, k: Kapitel): HTMLElement {
  const auswahl = waehleTest(k.aufgaben);
  const stand = new Map<string, { p: number; max: number; karte: string }>();
  const start = Date.now();
  const uhr = h('span', { class: 'uhr' }, '0:00');
  const tick = setInterval(() => {
    if (!uhr.isConnected) return clearInterval(tick);
    const s = Math.floor((Date.now() - start) / 1000);
    uhr.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }, 1000);
  const bilanz = h('div', { class: 'bilanz', 'aria-live': 'polite' });
  const auswerten = h('button', { type: 'button', class: 'knopf haupt' }, 'Test auswerten');

  const seite = h(
    'section',
    { class: 'seite test' },
    h('nav', { class: 'pfad' }, link('#/', 'Start'), ' › ', link(`#/${f.id}/${k.id}`, k.title), ' › Kapiteltest'),
    h('h1', {}, `Kapiteltest: ${k.title}`),
    h(
      'p',
      { class: 'unter' },
      `${auswahl.length} Aufgaben, von leicht nach schwer. Tipps sind erlaubt, kosten aber Punkte. Nach dem Prüfen siehst du sofort die Erklärung. Zeit: `,
      uhr,
    ),
  );
  auswahl.forEach((t, i) =>
    seite.append(
      aufgabenKarte(t, {
        test: true,
        nummer: i + 1,
        geprueft: (p, max) => {
          stand.set(t.id, { p, max, karte: t.karte });
          zeigeBilanz(false);
        },
      }),
    ),
  );
  auswerten.onclick = () => zeigeBilanz(true);
  seite.append(h('div', { class: 'knoepfe' }, auswerten), bilanz);
  return seite;

  function zeigeBilanz(ende: boolean) {
    let p = 0;
    let max = 0;
    auswahl.forEach((t) => {
      const s = stand.get(t.id);
      p += s?.p ?? 0;
      max += s?.max ?? t.asks(t.gen()).length;
    });
    const offen = auswahl.length - stand.size;
    bilanz.replaceChildren();
    if (!ende && offen) {
      bilanz.append(h('p', {}, `Bearbeitet: ${stand.size} von ${auswahl.length}. Punkte bisher: ${p}.`));
      return;
    }
    const schwach = k.karten.filter((c) => [...stand.values()].some((s) => s.karte === c.id && s.p < s.max));
    bilanz.append(
      h('h2', {}, `Note ${note(p, max).toFixed(1).replace('.', ',')}`),
      h('p', {}, `${p} von ${max} Punkten.${offen ? ` ${offen} Aufgaben nicht bearbeitet (0 Punkte).` : ''}`),
      schwach.length
        ? h('p', {}, 'Nochmals üben: ', ...schwach.flatMap((c, i) => [i ? ', ' : '', link(`#/${f.id}/${k.id}?karte=${c.id}`, c.title)]))
        : h('p', {}, 'Alle Lernkarten sitzen. Stark!'),
      link(`#/${f.id}/${k.id}/test?n=${Date.now()}`, 'Neuer Test mit neuen Aufgaben'),
    );
  }
}
