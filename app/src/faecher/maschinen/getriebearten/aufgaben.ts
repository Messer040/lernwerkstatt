// Aufgaben zum Kapitel Getriebearten: Zahnradgetriebe erkennen und Lage der Wellen.
import { task, type Task } from '../../../core/types';
import { pick } from '../../../core/zahl';
import * as B from './bilder';
import { ART, ARTEN, type Art } from './bilder';

/** Mischt Optionen; gibt Reihenfolge zurück, damit asks() bei jedem Aufruf gleich bleibt. */
const mische = (n: number) => {
  const r = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
};
/** Auswahl aus Optionen (Index 0 = richtig) in gemischter Reihenfolge. */
const wahl = (k: string, ord: number[], opts: string[], why: (string | undefined)[]) => ({
  kind: 'choice' as const, k,
  opts: ord.map((i) => opts[i]),
  a: ord.indexOf(0),
  why: ord.map((i) => why[i]),
});

const LAGE = ['Wellen liegen parallel', 'Wellen schneiden sich', 'Wellen kreuzen sich', 'Wellen fluchten (gleiche Achse)'];
const lageIdx = (a: Art) => (a === 'stirn' ? 0 : a === 'kegel' ? 1 : 2);

const MERK: Record<Art, string> = {
  stirn: 'Beide Wellen liegen nebeneinander in derselben Richtung. Sie treffen sich nie.',
  kegel: 'Die Achsen treffen sich in einem Punkt S. Meist unter 90°.',
  schraube: 'Die Achsen liegen in verschiedenen Ebenen. Sie treffen sich nicht und sind nicht parallel. Zwei schrägverzahnte Räder.',
  schnecke: 'Die Achsen liegen in verschiedenen Ebenen, meist unter 90°. Unten die Schnecke mit Gewinde, oben das Schneckenrad.',
};

export const AUFGABEN: Task[] = [
  task({
    id: 'g1', karte: 'arten', stufe: 1, familie: 'bild', src: 'nach Buch Aufgabe 4.5.4',
    title: 'Vier Getriebe benennen',
    gen: () => ({ ord: mische(4) }),
    draw: () => B.getriebeUebersicht(),
    text: () => 'Benenne die Zahnradgetriebe 1 bis 4.',
    asks: (p) => ARTEN.map((art, i) => {
      const namen = [ART[art].name, ...ARTEN.filter((x) => x !== art).map((x) => ART[x].name)];
      return wahl(`Bild ${i + 1}`, p.ord, namen, [undefined, ...ARTEN.filter((x) => x !== art).map(() => MERK[art])]);
    }),
    tipps: () => ['Schau zuerst, wie die Wellen zueinander liegen.', 'Parallel = Stirnräder. Schneiden sich = Kegelräder.', 'Kreuzen sich: Gewinde unten = Schnecke. Schräges Rad = Schraubenrad.'],
    loesung: () => ARTEN.map((a, i) => `${i + 1}) ${ART[a].name}, ${ART[a].lage}.`),
  }),

  task({
    id: 'g2', karte: 'lage', stufe: 1, familie: 'bild', src: 'nach Buch Aufgabe 4.5.4',
    title: 'Lage der Wellen bei vier Getrieben',
    gen: () => ({ ord: mische(4) }),
    draw: () => B.getriebeUebersicht(),
    text: () => 'Wie liegen die Wellen bei den Getrieben 1 bis 4 zueinander?',
    asks: (p) => ARTEN.map((art, i) => {
      const r = lageIdx(art);
      const opts = [LAGE[r], ...LAGE.filter((_, j) => j !== r)];
      return wahl(`Bild ${i + 1}`, p.ord, opts, [undefined, MERK[art], MERK[art], MERK[art]]);
    }),
    tipps: () => ['Verlängere die Mittellinien der Wellen.', 'Treffen sie sich? Dann schneiden sie sich.', 'Treffen sie sich nicht und sind nicht parallel? Dann kreuzen sie sich.'],
    loesung: () => ARTEN.map((a, i) => `${i + 1}) ${ART[a].lage}.`),
  }),

  task({
    id: 'g3', karte: 'arten', stufe: 1, familie: 'bild',
    title: 'Welches Getriebe ist das?',
    gen: () => ({ art: pick(ARTEN), ord: mische(4) }),
    draw: (p) => B.getriebe(p.art),
    text: () => 'Wie heisst dieses Zahnradgetriebe?',
    asks: (p) => {
      const andere = ARTEN.filter((x) => x !== p.art);
      return [wahl('Getriebe', p.ord, [ART[p.art as Art].name, ...andere.map((x) => ART[x].name)], [undefined, ...andere.map(() => MERK[p.art as Art])])];
    },
    tipps: () => ['Wie liegen die Wellen zueinander?', 'Kegelform = Kegelrad. Gewinde = Schnecke.', 'Schräge Linien auf einem Rad = Schrägverzahnung.'],
    loesung: (p) => [`${ART[p.art as Art].name}. ${ART[p.art as Art].lage}.`, MERK[p.art as Art]],
  }),

  task({
    id: 'g4', karte: 'lage', stufe: 1, familie: 'bild',
    title: 'Wie liegen diese Wellen?',
    gen: () => ({ art: pick(ARTEN), ord: mische(4) }),
    draw: (p) => B.getriebe(p.art),
    text: () => 'Wie liegen die beiden Wellen dieses Getriebes zueinander?',
    asks: (p) => {
      const r = lageIdx(p.art);
      return [wahl('Lage', p.ord, [LAGE[r], ...LAGE.filter((_, j) => j !== r)], [undefined, MERK[p.art as Art], MERK[p.art as Art], MERK[p.art as Art]])];
    },
    tipps: () => ['Zeichne in Gedanken die Mittellinien weiter.', 'Liegen beide Mittellinien in derselben Ebene?', 'Gleiche Ebene: parallel oder schneiden. Verschiedene Ebenen: kreuzen.'],
    loesung: (p) => [`${ART[p.art as Art].lage}.`, MERK[p.art as Art]],
  }),

  task({
    id: 'g5', karte: 'wahl', stufe: 2, familie: 'umgekehrt',
    title: 'Getriebe für sich schneidende Wellen',
    gen: () => ({ ord: mische(4) }),
    draw: () => B.getriebe('kegel'),
    text: () => 'Eine Antriebswelle liegt waagrecht. Die Abtriebswelle steht senkrecht dazu. Die beiden Achsen treffen sich in einem Punkt. Welches Getriebe passt?',
    asks: (p) => [wahl('Getriebe', p.ord,
      ['Kegelradgetriebe', 'Stirnradgetriebe', 'Schneckengetriebe', 'Schraubenradgetriebe'],
      [undefined, 'Stirnräder brauchen parallele Wellen.', 'Bei der Schnecke kreuzen sich die Wellen. Sie treffen sich nicht.', 'Beim Schraubenrad kreuzen sich die Wellen. Sie treffen sich nicht.'])],
    tipps: () => ['Die Achsen treffen sich: Sie schneiden sich.', 'Welches Rad hat die Form eines Kegels?', 'Die Kegelspitzen liegen im Schnittpunkt S.'],
    loesung: () => ['Kegelradgetriebe. Die Achsen schneiden sich im Punkt S.'],
  }),

  task({
    id: 'g6', karte: 'wahl', stufe: 2, familie: 'umgekehrt',
    title: 'Grosse Übersetzung in einer Stufe',
    gen: () => ({ i: pick([20, 30, 40, 50]), ord: mische(4) }),
    draw: () => B.getriebe('schnecke'),
    text: (p) => `Ein Förderband braucht die Übersetzung i = ${p.i} in einer einzigen Stufe. Die Wellen dürfen sich kreuzen. Welches Getriebe nimmst du?`,
    asks: (p) => [wahl('Getriebe', p.ord,
      ['Schneckengetriebe', 'Schraubenradgetriebe', 'Kegelradgetriebe', 'Stirnradgetriebe'],
      [undefined, 'Schraubenräder kreuzen auch, übertragen aber nur kleine Kräfte und kleine Übersetzungen.', 'Beim Kegelrad schneiden sich die Wellen. Grosse Übersetzungen in einer Stufe sind nicht üblich.', 'Stirnräder brauchen parallele Wellen. Für i = ' + p.i + ' bräuchte es mehrere Stufen.'])],
    tipps: () => ['Welches Getriebe hat ein Gewinde wie eine Schraube?', 'Eine Umdrehung der Schnecke dreht das Rad nur um einen Zahn weiter (bei 1 Gang).', 'i = Zähnezahl Rad : Anzahl Gänge der Schnecke'],
    loesung: (p) => [`Schneckengetriebe. Mit einer eingängigen Schnecke und ${p.i} Zähnen am Schneckenrad ist i = ${p.i}.`, 'Die Wellen kreuzen sich. Das Getriebe kann selbsthemmend sein.'],
  }),

  task({
    id: 'g7', karte: 'lage', stufe: 2, familie: 'begruenden',
    title: 'Was heisst «Wellen kreuzen sich»?',
    gen: () => ({ ord: mische(4) }),
    draw: () => B.getriebe('schraube'),
    text: () => 'Was bedeutet: Die Wellen kreuzen sich?',
    asks: (p) => [wahl('Bedeutung', p.ord,
      ['Die Achsen liegen in verschiedenen Ebenen. Sie treffen sich nicht und sind nicht parallel.',
        'Die Achsen treffen sich in einem Punkt.',
        'Die Achsen liegen nebeneinander in gleicher Richtung.',
        'Die Achsen liegen auf einer Linie hintereinander.'],
      [undefined, 'Das ist «schneiden sich», wie beim Kegelradgetriebe.', 'Das ist «parallel», wie beim Stirnradgetriebe.', 'Das ist «fluchten», wie bei einer Kupplung.'])],
    tipps: () => ['Denk an zwei Strassen: eine Brücke über eine andere Strasse.', 'Die Strassen treffen sich nie, sind aber nicht parallel.', 'Verschiedene Ebenen.'],
    loesung: () => ['Kreuzen heisst: verschiedene Ebenen, kein Schnittpunkt, nicht parallel.', 'Beispiel: Brücke über eine Strasse. Bei Schraubenrad- und Schneckengetriebe.'],
  }),

  task({
    id: 'g8', karte: 'wahl', stufe: 2, familie: 'fehler',
    title: 'Fehler finden: Lösung eines Kollegen',
    gen: () => ({ ord: mische(4) }),
    draw: () => B.getriebeUebersicht(),
    text: () => 'Ein Kollege schreibt zu den Bildern: 1) Stirnradgetriebe, Wellen parallel. 2) Kegelradgetriebe, Wellen kreuzen sich. 3) Schraubenradgetriebe, Wellen kreuzen sich. 4) Schneckengetriebe, Wellen kreuzen sich. Wo steckt der Fehler?',
    asks: (p) => [wahl('Fehler', p.ord,
      ['Bei 2: Beim Kegelradgetriebe schneiden sich die Wellen.', 'Bei 3: Das ist ein Stirnradgetriebe.', 'Bei 4: Die Wellen liegen parallel.', 'Bei 1: Die Wellen schneiden sich.'],
      [undefined, 'Bild 3 hat ein Rad in Vorderansicht über einem schrägverzahnten Rad. Die Wellen kreuzen sich: Schraubenradgetriebe.', 'Die Schnecke liegt unter dem Rad, die Achsen kreuzen sich.', 'Bei 1 liegen beide Wellen waagrecht übereinander: parallel.'])],
    tipps: () => ['Prüfe jede Zeile einzeln.', 'Bei welchem Getriebe treffen sich die Achsen?', 'Kegelräder: Achsen treffen sich im Punkt S.'],
    loesung: () => ['Zeile 2 ist falsch. Beim Kegelradgetriebe schneiden sich die Wellen. Alles andere stimmt.'],
  }),
];
