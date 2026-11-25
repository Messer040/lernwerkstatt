// Einstieg: Schale und Hash-Router. Es wird nichts gespeichert.
// Routen: #/  ·  #/<fach>  ·  #/<fach>/wissen  ·  #/<fach>/<kapitel>?karte=…&stufe=…  ·  #/<fach>/<kapitel>/a/<id>  ·  #/<fach>/<kapitel>/test
import './style.css';
import { FAECHER, findeFach, findeKapitel } from './faecher';
import { aufgabeSeite, fachSeite, kapitelSeite, startSeite, testSeite, wissenSeite, type Filter } from './core/ui/seiten';
import type { Stufe } from './core/types';
import { h } from './core/ui/dom';

// Marke: eine Massangabe mit Masspfeilen und Hilfslinien, das Zeichen des Konstrukteurs
const MARKE = `<svg viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="6" fill="currentColor"/>
<g stroke="var(--ground)" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M6 8v13M22 8v13"/><path d="M6 14.5h16"/></g>
<g fill="var(--ground)"><path d="M6 14.5l4-2.4v4.8z"/><path d="M22 14.5l-4-2.4v4.8z"/></g></svg>`;

const leiste = h(
  'header',
  { class: 'leiste' },
  h('a', { href: '#/', class: 'marke', 'aria-label': 'Lernwerkstatt, zum Start', html: `${MARKE}<span>Lernwerkstatt</span>` }),
  h('nav', { class: 'rechts', 'aria-label': 'Weitere' }, h('a', { href: '../' }, 'Alle Trainer')),
);
const main = h('main', { class: 'wrap', id: 'inhalt' });
document.getElementById('app')!.replaceChildren(leiste, main);

function route() {
  const [pfad, query = ''] = location.hash.replace(/^#\/?/, '').split('?');
  const [fachId, kapId, modus, aufgabeId] = pfad.split('/').filter(Boolean);
  const q = new URLSearchParams(query);
  const st = Number(q.get('stufe'));
  const filter: Filter = { karte: q.get('karte') ?? undefined, stufe: [1, 2, 3].includes(st) ? (st as Stufe) : undefined };
  const fach = fachId ? findeFach(fachId) : undefined;
  const kap = fach && kapId ? findeKapitel(fach.id, kapId) : undefined;

  let seite: HTMLElement;
  if (!fachId) seite = startSeite(FAECHER);
  else if (fach && kapId === 'wissen' && fach.wissen?.length) seite = wissenSeite(fach);
  else if (fach && !kapId) seite = fachSeite(fach);
  else if (fach && kap && modus === 'test') seite = testSeite(fach, kap);
  else if (fach && kap && modus === 'a' && aufgabeId) seite = aufgabeSeite(fach, kap, aufgabeId, filter);
  else if (fach && kap) seite = kapitelSeite(fach, kap, filter);
  else seite = h('section', {}, h('h1', {}, 'Seite nicht gefunden'), h('p', {}, h('a', { href: '#/' }, 'Zum Start')));

  main.replaceChildren(seite);
  window.scrollTo(0, 0);
  document.title = `${seite.querySelector('h1')?.textContent ?? 'Lernwerkstatt'} · Lernwerkstatt`;
}

window.addEventListener('hashchange', route);
route();
