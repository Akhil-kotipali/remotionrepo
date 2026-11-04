// =====================================================================
//  CAPTIONS — Waveform-aligned Part 2 Viral Loop Cut (50.0s)
//  [start, end, text, yellowWords?, redWords?]
// =====================================================================
export type Sentence = [number, number, string, string[]?, string[]?];

export const SENTENCES_LOOP: Sentence[] = [[0.15, 2.22, 'There were five people in this photograph.', ['FIVE'], []], [2.25, 4.09, 'So who is standing in that window?', ['WHO'], ['WINDOW?']], [4.6, 7.5, 'The next morning, Arjun showed the photo to his friends.', ['PHOTO'], []], [8.0, 9.71, 'It was taken the night Dev died.', ['NIGHT', 'DEV'], ['DIED.']], [10.3, 11.97, 'Meera had taken the picture.', ['MEERA'], []], [12.1, 14.33, 'Nobody remembered anyone else being there.', ['NOBODY'], []], [14.5, 16.9, 'Rahul said it was probably a reflection.', ['REFLECTION.'], []], [17.0, 19.35, "That's impossible. He's facing forward.", ['IMPOSSIBLE.'], ['IMPOSSIBLE.']], [19.6, 20.75, 'Nisha went quiet.', ['QUIET.'], []], [21.0, 22.83, 'And Meera said something strange.', ['STRANGE.'], []], [23.0, 25.06, 'Why does that person look like Arjun?', ['ARJUN?'], ['ARJUN?']], [25.5, 26.91, 'Arjun looked closer.', [], []], [27.2, 29.16, 'The figure was wearing the same jacket.', ['JACKET.'], []], [29.5, 31.53, 'Standing at the exact same angle.', ['EXACT', 'ANGLE.'], []], [32.2, 35.95, 'It looked like his own reflection... but that was impossible.', ['REFLECTION...'], ['IMPOSSIBLE.']], [36.6, 38.54, 'Then he turned the photograph over.', ['TURNED'], []], [40.5, 42.88, 'IF WE FORGET, WATCH THE VIDEO.', ['FORGET,', 'VIDEO.'], ['FORGET,']], [43.5, 44.71, 'Arjun had written it.', ['ARJUN'], []], [45.0, 46.95, 'And he had no memory of doing so.', ['NO', 'MEMORY'], ['MEMORY']], [47.8, 50.0, 'Wait... look at the window again.', ['WINDOW'], ['AGAIN.']]];

export type Chunk = {start: number; end: number; words: {t: string; s: number; e: number; hl: 0 | 1 | 2}[]};

/** splits sentences into ≤4-word chunks and spreads time by letter count */
export function buildChunksLoop(fps: number): Chunk[] {
  const out: Chunk[] = [];
  for (const [a, b, text, yel = [], red = []] of SENTENCES_LOOP) {
    const words = text.split(/\s+/);
    const groups: string[][] = [];
    let cur: string[] = [];
    for (const w of words) {
      cur.push(w);
      if (cur.length >= 4 || /[.?!…,]$/.test(w)) {
        groups.push(cur);
        cur = [];
      }
    }
    if (cur.length) groups.push(cur);
    if (groups.length > 1 && groups[groups.length - 1].length === 1 && groups[groups.length - 2].length < 4) {
      const last = groups.pop()!;
      groups[groups.length - 1].push(...last);
    }
    const total = words.join("").length;
    let t = a;
    for (const g of groups) {
      const share = g.join("").length / total;
      const dur = (b - a) * share;
      let wt = t;
      const ws = g.map((w) => {
        const wdur = dur * (w.length / g.join("").length);
        const up = w.toUpperCase();
        const o = {t: w, s: Math.round(wt * fps), e: Math.round((wt + wdur) * fps), hl: (red.includes(up) ? 2 : yel.includes(up) ? 1 : 0) as 0 | 1 | 2};
        wt += wdur;
        return o;
      });
      out.push({start: Math.round(t * fps), end: Math.round((t + dur) * fps) + 2, words: ws});
      t += dur;
    }
  }
  return out;
}
