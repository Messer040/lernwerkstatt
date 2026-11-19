// Einstieg: einfacher Hash-Router. Es wird nichts gespeichert.
import './style.css';
import { FAECHER, findeFach, findeKapitel } from './faecher';
import { fachSeite, kapitelSeite, startSeite, testSeite } from './core/ui/seiten';
import type { Stufe } from './core/types';
import { h } from './core/ui/dom';

const main = document.getElementById('app')!;

function route() {
  const [pfad, query = ''] = location.hash.replace(/^#\/?/, '').split('?');
  const teile = pfad.split('/').filter(Boolean);
  const q = new URLSearchParams(query);
  let seite: HTMLElement;
  const [fachId, kapId, modus] = teile;
  const fach = fachId ? findeFach(fachId) : undefined;
  const kap = fach && kapId ? findeKapitel(fach.id, kapId) : undefined;
  if (!fachId) seite = startSeite(FAECHER);
  else if (fach && !kapId) seite = fachSeite(fach);
  else if (fach && kap && modus === 'test') seite = testSeite(fach, kap);
  else if (fach && kap) {
    const st = Number(q.get('stufe'));
    seite = kapitelSeite(fach, kap, { karte: q.get('karte') ?? undefined, stufe: [1, 2, 3].includes(st) ? (st as Stufe) : undefined });
  } else seite = h('section', { class: 'seite' }, h('h1', {}, 'Nicht gefunden'), h('a', { href: '#/' }, 'Zum Start'));
  main.replaceChildren(seite);
  window.scrollTo(0, 0);
  document.title = (seite.querySelector('h1')?.textContent ?? 'Lernwerkstatt') + ' · Lernwerkstatt';
}

window.addEventListener('hashchange', route);
route();
