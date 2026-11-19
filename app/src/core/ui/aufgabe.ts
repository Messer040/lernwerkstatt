// Aufgabenkarte: Bild, Text, Antwortfelder, Tipps, Prüfen, Lösung.
import type { ChoiceAsk, NumAsk, Task } from '../types';
import { FAMILIEN, STUFEN } from '../types';
import { isChoice, pruefeAuswahl, pruefeZahl, type Urteil } from '../pruefen';
import { h } from './dom';

export interface KartenOptionen {
  /** Testmodus: Tipps kosten Punkte, keine neuen Zahlen */
  test?: boolean;
  nummer?: number;
  /** wird nach dem Prüfen aufgerufen */
  geprueft?: (punkte: number, max: number) => void;
}

/** Abzug pro genutztem Tipp im Testmodus */
export const TIPP_ABZUG = 0.25;

export function aufgabenKarte(t: Task, opt: KartenOptionen = {}): HTMLElement {
  const karte = h('article', { class: 'aufgabe', 'data-id': t.id });
  let p = t.gen();
  aufbauen();
  return karte;

  function aufbauen() {
    karte.replaceChildren();
    const asks = t.asks(p);
    const fehler = t.fehler?.(p) ?? [];
    let tippNr = 0;
    let fertig = false;
    const tipps = t.tipps(p);

    const kopf = h(
      'header',
      { class: 'kopf' },
      h('span', { class: `stufe s${t.stufe}` }, `${t.stufe} · ${STUFEN[t.stufe]}`),
      h('span', { class: 'familie' }, FAMILIEN[t.familie]),
      opt.nummer ? h('span', { class: 'nr' }, `Aufgabe ${opt.nummer}`) : null,
    );
    const titel = h('h3', {}, t.title);
    const bild = t.draw ? h('figure', { class: 'bild' }, t.draw(p)) : null;
    const text = h('p', { class: 'text', html: t.text(p) });

    // Antwortfelder
    const lesen: (() => Urteil)[] = [];
    const zeilen = asks.map((a, i) => {
      const meldung = h('div', { class: 'meldung', 'aria-live': 'polite' });
      const zeile = h('div', { class: 'antwort' });
      if (isChoice(a)) {
        let wahl: number | null = null;
        const knoepfe = a.opts.map((o, j) => {
          const b = h('button', { type: 'button', class: 'option', 'aria-pressed': 'false' }, o);
          b.onclick = () => {
            if (fertig) return;
            wahl = j;
            knoepfe.forEach((k, n) => k.setAttribute('aria-pressed', String(n === j)));
          };
          return b;
        });
        zeile.append(h('div', { class: 'label', html: a.k }), h('div', { class: 'optionen' }, ...knoepfe), meldung);
        lesen.push(() => {
          const u = pruefeAuswahl(wahl, a as ChoiceAsk);
          knoepfe.forEach((k, n) => {
            k.classList.toggle('richtig', fertig && n === a.a);
            k.classList.toggle('falsch', n === wahl && !u.ok);
          });
          return u;
        });
      } else {
        const id = `${t.id}-${i}-${Math.random().toString(36).slice(2, 7)}`;
        const inp = h('input', { id, type: 'text', inputmode: 'decimal', autocomplete: 'off', placeholder: '?' });
        inp.addEventListener('keydown', (e) => e.key === 'Enter' && pruefen());
        zeile.append(
          h('label', { for: id, class: 'label', html: a.k }),
          h('div', { class: 'feld' }, inp, h('span', { class: 'einheit' }, (a as NumAsk).unit)),
          meldung,
        );
        lesen.push(() => pruefeZahl(inp.value, a as NumAsk, fehler.filter((e) => e.ask === i)));
      }
      return { zeile, meldung };
    });

    const tippBox = h('ol', { class: 'tipps' });
    const loesung = h('div', { class: 'loesung', hidden: '' });
    const ergebnis = h('div', { class: 'ergebnis', 'aria-live': 'polite' });

    const bTipp = h('button', { type: 'button', class: 'knopf leise' }, tippLabel());
    const bPruefen = h('button', { type: 'button', class: 'knopf haupt' }, 'Antwort prüfen');
    const bLoesung = h('button', { type: 'button', class: 'knopf leise' }, 'Lösung zeigen');
    const bNeu = h('button', { type: 'button', class: 'knopf leise' }, 'Neue Zahlen');

    function tippLabel() {
      return tippNr >= tipps.length ? 'Keine Tipps mehr' : `Tipp ${tippNr + 1} von ${tipps.length}${opt.test ? ` (−${TIPP_ABZUG} P.)` : ''}`;
    }
    bTipp.onclick = () => {
      if (tippNr >= tipps.length || fertig) return;
      tippBox.append(h('li', { html: tipps[tippNr] }));
      tippNr++;
      bTipp.textContent = tippLabel();
      if (tippNr >= tipps.length) bTipp.setAttribute('disabled', '');
    };
    bPruefen.onclick = () => pruefen();
    bLoesung.onclick = () => zeigeLoesung();
    bNeu.onclick = () => {
      p = t.gen();
      aufbauen();
    };

    function zeigeLoesung() {
      if (!loesung.hidden) return;
      loesung.hidden = false;
      loesung.append(h('h4', {}, 'Lösungsweg'), h('ol', {}, ...t.loesung(p).map((s) => h('li', { html: s }))));
      if (t.loesungsbild) loesung.append(h('figure', { class: 'bild' }, t.loesungsbild(p)));
      bLoesung.setAttribute('disabled', '');
    }

    function pruefen() {
      if (fertig && opt.test) return;
      const urteile = lesen.map((f) => f());
      if (opt.test && urteile.some((u) => !u.ok && 'leer' in u && u.leer)) {
        ergebnis.textContent = 'Bitte alle Teilfragen beantworten.';
        return;
      }
      urteile.forEach((u, i) => {
        const { meldung, zeile } = zeilen[i];
        zeile.classList.toggle('ok', u.ok);
        zeile.classList.toggle('nok', !u.ok);
        meldung.innerHTML = u.ok ? '✓ Richtig.' : `✗ ${u.msg ?? 'Noch nicht richtig.'}`;
      });
      const richtig = urteile.filter((u) => u.ok).length;
      const alle = richtig === asks.length;
      if (opt.test || alle) {
        fertig = true;
        lesen.forEach((f) => f()); // markiert die richtige Option
        karte.querySelectorAll('input').forEach((i) => i.setAttribute('readonly', ''));
        bPruefen.setAttribute('disabled', '');
        bTipp.setAttribute('disabled', '');
        zeigeLoesung();
      }
      const punkte = Math.max(0, richtig - (opt.test ? tippNr * TIPP_ABZUG : 0));
      ergebnis.textContent = alle ? 'Alles richtig.' : `${richtig} von ${asks.length} richtig.`;
      if (opt.test) ergebnis.textContent += ` Punkte: ${punkte} von ${asks.length}.`;
      opt.geprueft?.(punkte, asks.length);
    }

    karte.append(
      kopf,
      titel,
      ...(bild ? [bild] : []),
      text,
      h('div', { class: 'antworten' }, ...zeilen.map((z) => z.zeile)),
      tippBox,
      h('div', { class: 'knoepfe' }, bPruefen, bTipp, opt.test ? null : bLoesung, opt.test ? null : bNeu),
      ergebnis,
      loesung,
    );
  }
}
