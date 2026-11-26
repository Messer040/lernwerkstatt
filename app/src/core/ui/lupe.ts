// Bauteilbilder: automatisch auf den Inhalt zuschneiden und per Antippen gross anzeigen (Lupe).
import { einpassen } from '../draw/einpassen';
import { h } from './dom';

const BILDER = '.blatt .bild svg, .loesung .bild svg';

let dialog: HTMLDialogElement | null = null;

function lupeOeffnen(svg: SVGSVGElement) {
  if (!dialog) {
    const zu = h('button', { class: 'knopf', type: 'button' }, 'Schliessen');
    dialog = h('dialog', { class: 'lupe', 'aria-label': 'Bild gross' }, h('div', { class: 'lupe-bild' }), h('div', { class: 'lupe-fuss' }, zu));
    zu.onclick = () => dialog!.close();
    // Antippen neben dem Bild schliesst ebenfalls
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog!.close(); });
    document.body.append(dialog);
  }
  const kopie = svg.cloneNode(true) as SVGSVGElement;
  kopie.removeAttribute('style');
  // Etwas grösser als gezeichnet (Schrift 18 px), damit man am Handy alles lesen kann. Wischen ist hier erlaubt.
  const vb = svg.viewBox.baseVal;
  kopie.style.width = `max(100%, ${Math.round(vb.width * 1.2)}px)`;
  dialog.querySelector('.lupe-bild')!.replaceChildren(kopie);
  dialog.showModal();
}

function vorbereiten(svg: SVGSVGElement) {
  if (svg.dataset.lupe) return;
  if (!einpassen(svg, { begrenzen: true })) return; // noch nicht sichtbar: später erneut
  svg.dataset.lupe = '1';
  const huelle = svg.parentElement as HTMLElement;
  huelle.classList.add('mit-lupe');
  huelle.setAttribute('role', 'button');
  huelle.setAttribute('tabindex', '0');
  huelle.setAttribute('aria-label', 'Bild vergrössern');
  huelle.title = 'Antippen zum Vergrössern';
  huelle.onclick = () => lupeOeffnen(svg);
  huelle.onkeydown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lupeOeffnen(svg); }
  };
}

/** Beobachtet den Inhalt und bereitet jedes neue Bauteilbild vor. */
export function bilderBeobachten(wurzel: HTMLElement) {
  const alle = () => wurzel.querySelectorAll<SVGSVGElement>(BILDER).forEach(vorbereiten);
  new MutationObserver(alle).observe(wurzel, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'open'] });
  wurzel.addEventListener('toggle', alle, true); // aufgeklappte <details>
  alle();
}
