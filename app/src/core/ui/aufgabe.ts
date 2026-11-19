// Aufgabenkarte: Bild, Text, Antwortfelder, Tipps, Prüfen, Lösung.
import type { ChoiceAsk, NumAsk, Task } from '../types';
import { FAMILIEN, STUFEN } from '../types';
import { isChoice, pruefeAuswahl, pruefeZahl, type Urteil } from '../pruefen';
import { h } from './dom';

export interface KartenOptionen {
  /** Testmodus: Tipps kosten Punkte, keine neuen Zahlen */
  test?: boolean;
  /** z. B. «3 von 8» im Schriftfeld */
  nummer?: string;
  /** Titel der Lernkarte fürs Schriftfeld */
  karte?: string;
  /** Titel nicht in der Karte zeigen (steht schon als h1 auf der Seite) */
  ohneTitel?: boolean;
  /** wird nach dem Prüfen aufgerufen */
  geprueft?: (punkte: number, max: number) => void;
}

/** Abzug pro genutztem Tipp im Testmodus */
export const TIPP_ABZUG = 0.25;

export function aufgabenKarte(t: Task, opt: KartenOptionen = {}): HTMLElement {
  const karte = h('article', { class: 'aufgabe tafel', 'data-id': t.id });
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

    const titel = opt.ohneTitel ? null : h('h2', {}, t.title);
    const feld = (k: string, v: Node | string) => h('div', {}, h('b', {}, k), v);
    const schriftfeld = h(
      'div',
      { class: 'schriftfeld' },
      feld('Aufgabe', opt.nummer ?? h('span', { class: 'id' }, t.id)),
      feld('Stufe', h('span', {}, stufenMarke(t.stufe), ` ${t.stufe} · ${STUFEN[t.stufe]}`)),
      feld('Art', FAMILIEN[t.familie]),
      opt.karte ? feld('Lernkarte', opt.karte) : null,
      feld('Massstab', 'nicht massstäblich'),
    );
    const bild = t.draw ? h('figure', { class: 'blatt' }, h('div', { class: 'bild' }, t.draw(p)), schriftfeld) : null;
    const text = h('p', { class: 'text', html: t.text(p) });

    // Antwortfelder
    const lesen: (() => Urteil)[] = [];
    const zeilen = asks.map((a, i) => {
      const meldung = h('div', { class: 'meldung', 'aria-live': 'polite' });
      const zeile = h('div', { class: 'antwort' });
      if (isChoice(a)) {
        let wahl: number | null = null;
        // Reihenfolge mischen, damit die richtige Antwort nicht immer am selben Platz steht.
        const reihe = a.opts.map((_, j) => j).sort(() => Math.random() - 0.5);
        const knoepfe: HTMLButtonElement[] = [];
        reihe.forEach((j) => {
          const b = h('button', { type: 'button', class: 'option', 'aria-pressed': 'false' }, a.opts[j]);
          b.onclick = () => {
            if (fertig) return;
            wahl = j;
            knoepfe.forEach((k, n) => k.setAttribute('aria-pressed', String(n === j)));
          };
          knoepfe[j] = b;
        });
        zeile.append(h('div', { class: 'label', html: a.k }), h('div', { class: 'optionen' }, ...reihe.map((j) => knoepfe[j])), meldung);
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

    const bTipp = h('button', { type: 'button', class: 'knopf' }, tippLabel());
    const bPruefen = h('button', { type: 'button', class: 'knopf haupt' }, 'Antwort prüfen');
    const bLoesung = h('button', { type: 'button', class: 'knopf text' }, 'Lösung zeigen');
    const bNeu = h('button', { type: 'button', class: 'knopf text' }, 'Neue Zahlen');

    function tippLabel() {
      return tippNr >= tipps.length ? 'Keine Tipps mehr' : `Tipp ${tippNr + 1} von ${tipps.length}${opt.test ? ` (−${TIPP_ABZUG} P.)` : ''}`;
    }
    bTipp.onclick = () => {
      if (tippNr >= tipps.length || fertig) return;
      tippBox.append(h('li', {}, h('b', {}, `Tipp ${tippNr + 1}`), h('span', { html: tipps[tippNr] })));
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
      loesung.append(h('h3', {}, 'Lösungsweg'), h('ol', {}, ...t.loesung(p).map((s) => h('li', { html: s }))));
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
        meldung.innerHTML = u.ok ? 'Richtig.' : (u.msg ?? 'Noch nicht richtig. Versuch es nochmals oder nimm einen Tipp.');
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
      ergebnis.textContent = alle ? 'Alles richtig.' : `${richtig} von ${asks.length} Teilfragen richtig.`;
      if (opt.test) ergebnis.textContent += ` Punkte: ${punkte} von ${asks.length}.`;
      opt.geprueft?.(punkte, asks.length);
    }

    karte.append(
      ...(titel ? [titel] : []),
      ...(bild ? [bild] : [schriftfeld]),
      text,
      h('div', { class: 'antworten' }, ...zeilen.map((z) => z.zeile)),
      tippBox,
      h('div', { class: 'knoepfe' }, bPruefen, bTipp, opt.test ? null : bLoesung, opt.test ? null : bNeu),
      ergebnis,
      loesung,
    );
  }
}

/** Drei kleine Felder, gefüllt bis zur Stufe. */
export function stufenMarke(s: number): HTMLElement {
  const m = h('span', { class: 'stufenmarke', 'aria-hidden': 'true' });
  for (let i = 1; i <= 3; i++) m.append(h('i', i <= s ? { class: 'an' } : {}));
  return m;
}
