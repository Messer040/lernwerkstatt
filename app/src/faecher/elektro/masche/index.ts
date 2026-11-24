import type { Kapitel } from '../../../core/types';
import { eq, f, l, m } from '../../../core/text';
import { AUFGABEN } from './aufgaben';

export const masche: Kapitel = {
  id: 'masche',
  title: 'Masche mit mehreren Quellen',
  kurz: 'Reihenschaltung, Erzeugerspannungen, Teilspannungen',
  formeln: [
    { name: 'Gesamtwiderstand in Reihe', f: eq('R = R1 + R2 + R3'), g: 'R in Ω' },
    { name: 'Summe der Erzeugerspannungen', f: eq(l('ΣU0') + ' = ' + l('U01') + ' ± ' + l('U02')), g: 'gleich gepolt: plus, entgegengesetzt: minus. U in V' },
    { name: 'Strom in der Masche', f: eq(m('I') + ' = ' + l('ΣU0') + ' : R'), g: 'I in A (1 A = 1000 mA)' },
    { name: 'Teilspannung', f: eq(f('U3') + ' = R3 · ' + m('I')), g: 'gilt für jeden Widerstand: U1, U2, U3' },
    { name: 'Maschenregel', f: eq(l('ΣU0') + ' = ' + f('U1') + ' + ' + f('U2') + ' + ' + f('U3')), g: 'Probe für jede Rechnung' },
    { name: 'Kurzweg (Spannungsteiler)', f: eq(f('U3') + ' = ' + l('ΣU0') + ' · R3 : R'), g: 'ohne den Strom auszurechnen' },
  ],
  karten: [
    { id: 'reihe', title: 'Reihenschaltung', ziel: 'Du berechnest Gesamtwiderstand und Strom von Widerständen in Reihe.' },
    { id: 'masche', title: 'Zwei Quellen in einer Masche', ziel: 'Du erkennst gleich und entgegengesetzt gepolte Quellen und berechnest ΣU0 und den Strom.', hilfreich: ['reihe'] },
    { id: 'teil', title: 'Teilspannungen und Probe', ziel: 'Du berechnest U1, U2 und U3 und prüfst mit der Maschenregel.', hilfreich: ['masche'] },
    { id: 'kombi', title: 'Was wäre wenn', ziel: 'Du sagst voraus, wie sich Strom und Teilspannungen bei einer Änderung verhalten.', hilfreich: ['teil'] },
  ],
  aufgaben: AUFGABEN,
};
