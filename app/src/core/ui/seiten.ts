// Seiten: Start, Fach, Kapitel (Liste), Aufgabe (einzeln), Kapiteltest.
import type { Fach, Kapitel, Stufe, Task } from '../types';
import { einpassen } from '../draw/einpassen';
import { FAMILIEN, STUFEN } from '../types';
import { aufgabenKarte, stufenMarke } from './aufgabe';
import { h } from './dom';

type Kind = Node | string | null | undefined | false;
const link = (href: string, ...k: Kind[]) => h('a', { href }, ...k);
const knopf = (href: string, label: string, art = '') => h('a', { href, class: `knopf ${art}`.trim() }, label);
const pfeil = () => h('span', { class: 'pfeil', 'aria-hidden': 'true' });
const pfad = (...teile: Kind[]) => h('nav', { class: 'pfad', 'aria-label': 'Pfad' }, ...teile);
const titelzeile = (titel: string, unter?: string, ...aktion: Kind[]) =>
  h('div', { class: 'titelzeile' }, h('div', {}, h('h1', {}, titel), unter ? h('p', { class: 'unter' }, unter) : null), ...aktion);

const anzahl = (n: number, ein: string, mehr: string) => `${n} ${n === 1 ? ein : mehr}`;

function kapitelZeilen(f: Fach) {
  const folgt = (f.geplant ?? []).map((g) =>
    h('li', { class: 'folgt' }, h('div', { class: 'zeile' }, h('span', { class: 't' }, g), h('span', { class: 'r' }, 'folgt'))),
  );
  return h(
    'ul',
    { class: 'zeilen' },
    ...f.kapitel.map((k) =>
      h(
        'li',
        {},
        link(
          `#/${f.id}/${k.id}`,
          h('span', { class: 't' }, k.title),
          h('span', { class: 's' }, k.kurz),
          h('span', { class: 'r num' }, anzahl(k.aufgaben.length, 'Aufgabe', 'Aufgaben'), pfeil()),
        ),
      ),
    ),
    ...folgt,
  );
}
const zeilenKlasse = (root: HTMLElement) => {
  root.querySelectorAll('.zeilen a').forEach((a) => a.classList.add('zeile'));
  return root;
};

export function startSeite(faecher: Fach[]): HTMLElement {
  const total = faecher.reduce((s, f) => s + f.kapitel.reduce((t, k) => t + k.aufgaben.length, 0), 0);
  return zeilenKlasse(
    h(
      'section',
      {},
      titelzeile('Lernwerkstatt', `Physik, Elektrotechnik und Zeichnungstechnik für Konstrukteure EFZ · ${anzahl(total, 'Aufgabe', 'Aufgaben')} mit neuen Zahlen bei jedem Versuch`),
      h(
        'div',
        { class: 'raster zwei' },
        h(
          'div',
          { class: 'raster' },
          ...faecher.map((f) =>
            h(
              'section',
              { class: 'tafel' },
              h('header', {}, h('h2', {}, f.title), h('span', { class: 'meta num' }, `${f.kapitel.length} von ${f.kapitel.length + (f.geplant?.length ?? 0)} Kapiteln umgezogen`)),
              kapitelZeilen(f),
            ),
          ),
        ),
        h(
          'aside',
          { class: 'tafel seite-rechts' },
          h('header', {}, h('h2', {}, 'Noch im bisherigen Trainer')),
          h(
            'ul',
            { class: 'zeilen' },
            h('li', {}, link('../physik/', h('span', { class: 't' }, 'Physik'), h('span', { class: 's' }, 'Alle übrigen Kapitel, von Biegen bis Einfache Maschinen'), h('span', { class: 'r' }, pfeil()))),
            h('li', {}, link('../zeichnung/', h('span', { class: 't' }, 'Zeichnungstechnik'), h('span', { class: 's' }, 'Bemassung, Toleranzen, Oberfläche, Stücklisten, Maschinenelemente'), h('span', { class: 'r' }, pfeil()))),
          ),
        ),
      ),
    ),
  );
}

export function fachSeite(f: Fach): HTMLElement {
  return zeilenKlasse(
    h(
      'section',
      {},
      pfad(link('#/', 'Start'), ' / ', f.title),
      titelzeile(f.title, f.kurz, f.wissen?.length ? knopf(`#/${f.id}/wissen`, 'Nachschlagen') : null),
      h('section', { class: 'tafel' }, kapitelZeilen(f)),
    ),
  );
}

const ART_WISSEN: Record<string, string> = { formel: 'Formel', begriff: 'Begriff', merksatz: 'Merksatz', lehrer: 'Lehrerhinweis', bild: 'Bild' };

/** Nachschlagen: alle Wissenseinträge eines Fachs, nach Thema gruppiert. */
export function wissenSeite(f: Fach): HTMLElement {
  const alle = f.wissen ?? [];
  const themen = [...new Set(alle.map((w) => w.thema))];
  return h(
    'section',
    {},
    pfad(link('#/', 'Start'), ' / ', link(`#/${f.id}`, f.title), ' / Nachschlagen'),
    titelzeile(`${f.title}: Nachschlagen`, `${anzahl(alle.length, 'Eintrag', 'Einträge')}, nach Thema geordnet`),
    ...themen.map((t) =>
      h(
        'section',
        { class: 'tafel wissen' },
        h('header', {}, h('h2', {}, t)),
        ...alle
          .filter((w) => w.thema === t)
          .map((w) =>
            h(
              'article',
              { class: 'wissen-eintrag', id: w.id },
              h('h3', {}, w.titel, ' ', h('span', { class: 'meta' }, ART_WISSEN[w.art] ?? w.art)),
              h('p', { html: w.text }),
              w.formel ? h('p', { class: 'eq', html: w.formel }) : null,
              h(
                'p',
                { class: 'meta' },
                w.kapitel ? link(`#/${f.id}/${w.kapitel}`, 'Zum Kapitel') : null,
                w.kapitel ? ' · ' : null,
                `Quelle: ${w.quelle}`,
              ),
            ),
          ),
      ),
    ),
  );
}

export interface Filter {
  karte?: string;
  stufe?: Stufe;
}
export const gefiltert = (k: Kapitel, fi: Filter) =>
  k.aufgaben.filter((t) => (!fi.karte || t.karte === fi.karte) && (!fi.stufe || t.stufe === fi.stufe));
const query = (fi: Filter) => {
  const s = new URLSearchParams();
  if (fi.karte) s.set('karte', fi.karte);
  if (fi.stufe) s.set('stufe', String(fi.stufe));
  const t = s.toString();
  return t ? `?${t}` : '';
};

function formelkarte(k: Kapitel, offen: boolean) {
  const d = h(
    'details',
    { class: 'tafel formeln' },
    h('summary', {}, 'Formelkarte'),
    h('dl', {}, ...k.formeln.flatMap((fo) => [h('dt', {}, fo.name), h('dd', { html: fo.f + (fo.g ? `<small>${fo.g}</small>` : '') })])),
  );
  if (offen) d.setAttribute('open', '');
  return d;
}

const breit = () => window.matchMedia?.('(min-width: 960px)').matches ?? false;

export function kapitelSeite(f: Fach, k: Kapitel, fi: Filter): HTMLElement {
  const basis = `#/${f.id}/${k.id}`;
  const chip = (href: string, label: string, aktiv: boolean) =>
    h('a', { href, class: aktiv ? 'chip aktiv' : 'chip', ...(aktiv ? { 'aria-current': 'true' } : {}) }, label);
  const liste = gefiltert(k, fi);
  const q = query(fi);

  const zeilen = (aufgaben: Task[]) =>
    h(
      'ul',
      { class: 'zeilen' },
      ...aufgaben.map((t) =>
        h(
          'li',
          {},
          link(
            `${basis}/a/${t.id}${q}`,
            h('span', { class: 't' }, t.title),
            h('span', { class: 's' }, FAMILIEN[t.familie]),
            h('span', { class: 'r' }, stufenMarke(t.stufe), h('span', {}, STUFEN[t.stufe]), pfeil()),
          ),
        ),
      ),
    );

  // Gruppiert nach Lernkarte, in der Reihenfolge der Karten
  const gruppen = k.karten
    .filter((c) => !fi.karte || c.id === fi.karte)
    .map((c) => ({ c, t: liste.filter((t) => t.karte === c.id) }))
    .filter((g) => g.t.length);

  const listeTafel = h(
    'section',
    { class: 'tafel' },
    ...(gruppen.length
      ? gruppen.flatMap((g) => [h('div', { class: 'gruppe' }, h('h2', {}, g.c.title), h('p', {}, g.c.ziel)), zeilen(g.t)])
      : [h('p', { class: 'leer' }, 'Für diese Auswahl gibt es noch keine Aufgaben. ', link(basis, 'Filter zurücksetzen'))]),
  );

  return zeilenKlasse(
    h(
      'section',
      {},
      pfad(link('#/', 'Start'), ' / ', link(`#/${f.id}`, f.title), ' / ', k.title),
      titelzeile(
        k.title,
        `${anzahl(k.aufgaben.length, 'Aufgabe', 'Aufgaben')} in ${anzahl(k.karten.length, 'Lernkarte', 'Lernkarten')} · ${k.kurz}`,
        h(
          'div',
          { class: 'knoepfe' },
          liste.length ? knopf(`${basis}/a/${liste[0].id}${q}`, 'Der Reihe nach üben') : null,
          knopf(`${basis}/test`, 'Kapiteltest', 'haupt'),
        ),
      ),
      h(
        'div',
        { class: 'filter', role: 'navigation', 'aria-label': 'Lernkarte' },
        chip(`${basis}${query({ stufe: fi.stufe })}`, 'Alle Lernkarten', !fi.karte),
        ...k.karten.map((c) => chip(`${basis}${query({ karte: c.id, stufe: fi.stufe })}`, c.title, fi.karte === c.id)),
      ),
      h(
        'div',
        { class: 'filter', role: 'navigation', 'aria-label': 'Stufe' },
        chip(`${basis}${query({ karte: fi.karte })}`, 'Alle Stufen', !fi.stufe),
        ...([1, 2, 3] as Stufe[]).map((s) => chip(`${basis}${query({ karte: fi.karte, stufe: s })}`, `${s} · ${STUFEN[s]}`, fi.stufe === s)),
      ),
      h('div', { class: 'raster zwei' }, listeTafel, h('div', { class: 'seite-rechts' }, formelkarte(k, breit()))),
    ),
  );
}

export function aufgabeSeite(f: Fach, k: Kapitel, id: string, fi: Filter): HTMLElement {
  const basis = `#/${f.id}/${k.id}`;
  let liste = gefiltert(k, fi);
  let q = query(fi);
  if (!liste.some((t) => t.id === id)) {
    liste = k.aufgaben;
    q = '';
  }
  const i = liste.findIndex((t) => t.id === id);
  const t = liste[i];
  if (!t) return h('section', {}, titelzeile('Aufgabe nicht gefunden'), link(basis, 'Zum Kapitel'));
  const karte = k.karten.find((c) => c.id === t.karte);
  const vor = liste[i - 1];
  const nach = liste[i + 1];
  const blaettern = h(
    'nav',
    { class: 'blaettern', 'aria-label': 'Blättern' },
    vor ? knopf(`${basis}/a/${vor.id}${q}`, '‹ Vorherige', 'text') : h('span'),
    h('span', { class: 'mitte num' }, `${i + 1} von ${liste.length}`),
    nach ? knopf(`${basis}/a/${nach.id}${q}`, 'Nächste ›', 'haupt') : knopf(`${basis}/test`, 'Zum Kapiteltest', 'haupt'),
  );
  return h(
    'section',
    {},
    pfad(link('#/', 'Start'), ' / ', link(`#/${f.id}`, f.title), ' / ', link(`${basis}${q}`, k.title)),
    titelzeile(t.title, karte ? `${karte.title}: ${karte.ziel}` : undefined),
    h(
      'div',
      { class: 'raster zwei' },
      h('div', {}, aufgabenKarte(t, { karte: karte?.title, ohneTitel: true, nummer: `${i + 1} von ${liste.length}` }), blaettern),
      h('div', { class: 'seite-rechts' }, formelkarte(k, breit()), vorschau(basis, liste, t.id, q)),
    ),
  );
}

/** Vorschau der Aufgaben mit kleinem Bauteilbild und Stufe, zum schnellen Wechseln. */
function vorschau(basis: string, liste: Task[], aktiv: string, q: string): HTMLElement {
  const i = liste.findIndex((t) => t.id === aktiv);
  const eintraege = liste.map((t, n) => {
    const bild = t.draw ? t.draw(t.gen()) : null;
    bild?.removeAttribute('aria-label');
    bild?.setAttribute('aria-hidden', 'true');
    const a = h(
      'a',
      { href: `${basis}/a/${t.id}${q}`, class: t.id === aktiv ? 'vs aktiv' : 'vs', ...(t.id === aktiv ? { 'aria-current': 'page' } : {}) },
      h('span', { class: 'vs-bild' }, bild ?? ''),
      h(
        'span',
        { class: 'vs-text' },
        h('span', { class: 'vs-titel' }, t.title),
        h('span', { class: 'vs-meta' }, stufenMarke(t.stufe), ` ${STUFEN[t.stufe]} · ${n + 1}`),
      ),
    );
    return h('li', {}, a);
  });
  const liste_ = h('ol', { class: 'vorschau-liste' }, ...eintraege);
  const tafel = h(
    'section',
    { class: 'tafel vorschau' },
    h('header', {}, h('h2', {}, 'Weitere Aufgaben'), h('span', { class: 'meta num' }, `${i + 1} von ${liste.length}`)),
    liste_,
  );
  requestAnimationFrame(() => {
    // Vorschaubilder auf das Bauteil zuschneiden (Hintergrund weglassen), damit man es klein erkennt
    liste_.querySelectorAll<SVGSVGElement>('.vs-bild svg').forEach((svg) => einpassen(svg, { rand: 10 }));
    // aktive Aufgabe in der Liste sichtbar machen, ohne die Seite zu verschieben
    const el = liste_.querySelector<HTMLElement>('.aktiv');
    if (el) liste_.scrollTo({ top: el.offsetTop - 8, left: el.offsetLeft - 12 });
  });
  return tafel;
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
    { class: 'test' },
    pfad(link('#/', 'Start'), ' / ', link(`#/${f.id}`, f.title), ' / ', link(`#/${f.id}/${k.id}`, k.title)),
    titelzeile(
      `Kapiteltest: ${k.title}`,
      `${auswahl.length} Aufgaben, von leicht nach schwer. Ein Tipp kostet 0,25 Punkte. Nach dem Prüfen siehst du sofort den Lösungsweg.`,
      h('p', { class: 'unter num' }, 'Zeit ', uhr),
    ),
  );
  auswahl.forEach((t, i) =>
    seite.append(
      aufgabenKarte(t, {
        test: true,
        nummer: `${i + 1} von ${auswahl.length}`,
        karte: k.karten.find((c) => c.id === t.karte)?.title,
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
    const pt = (x: number) => String(x).replace('.', ',');
    bilanz.replaceChildren();
    if (!ende && offen) {
      bilanz.append(h('p', { class: 'unter num' }, `Bearbeitet: ${stand.size} von ${auswahl.length} · Punkte bisher: ${pt(p)}`));
      return;
    }
    const schwach = k.karten.filter((c) => [...stand.values()].some((s) => s.karte === c.id && s.p < s.max));
    bilanz.append(
      h(
        'section',
        { class: 'tafel aufgabe' },
        h('p', { class: 'note' }, `Note ${note(p, max).toFixed(1).replace('.', ',')}`),
        h('p', { class: 'num' }, `${pt(p)} von ${max} Punkten.${offen ? ` ${anzahl(offen, 'Aufgabe', 'Aufgaben')} nicht bearbeitet (0 Punkte).` : ''}`),
        schwach.length
          ? h('p', {}, 'Nochmals üben: ', ...schwach.flatMap((c, i) => [i ? ', ' : '', link(`#/${f.id}/${k.id}?karte=${c.id}`, c.title)]))
          : h('p', {}, 'Alle Lernkarten sitzen.'),
        h('div', { class: 'knoepfe' }, knopf(`#/${f.id}/${k.id}/test?n=${Date.now()}`, 'Neuer Test', 'haupt'), knopf(`#/${f.id}/${k.id}`, 'Zum Kapitel')),
      ),
    );
  }
}
