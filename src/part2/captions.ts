// =====================================================================
//  CAPTIONS — Waveform-aligned multi-character viral voiceover (57.0s)
//  [start, end, text, yellowWords?, redWords?]
// =====================================================================
export type Sentence = [number, number, string, string[]?, string[]?];

export const SENTENCES: Sentence[] = [[0.15, 2.21, 'There were five people in this photograph.', ['FIVE'], []], [2.25, 4.09, 'So who is standing in that window?', ['WHO'], ['WINDOW?']], [4.7, 7.77, 'The next morning, Arjun showed the photograph to his friends.', ['PHOTOGRAPH'], []], [8.6, 10.31, 'It was taken the night Dev died.', ['NIGHT', 'DEV'], ['DIED.']], [10.7, 12.23, 'Five friends were visible.', ['FIVE'], []], [12.3, 13.97, 'Meera had taken the picture.', ['MEERA'], []], [14.0, 15.37, 'Everything looked normal.', [], []], [15.6, 18.67, 'Until Arjun zoomed into the glass window behind them.', ['GLASS', 'WINDOW'], []], [18.9, 20.25, 'There was a sixth figure.', ['SIXTH'], ['SIXTH']], [20.6, 22.12, 'Standing behind the group.', ['BEHIND'], []], [22.3, 24.55, 'Nobody remembered anyone else being there.', ['NOBODY'], []], [24.6, 27.02, 'Rahul said it was probably a reflection.', ['REFLECTION.'], []], [27.05, 28.3, 'Kabir disagreed.', ['DISAGREED.'], []], [28.35, 29.5, 'Nisha went quiet.', ['QUIET.'], []], [29.55, 31.38, 'And Meera said something strange.', ['STRANGE.'], []], [31.4, 33.46, 'Why does that person look like Arjun?', ['ARJUN?'], ['ARJUN?']], [33.6, 35.01, 'Arjun looked closer.', [], []], [35.15, 37.11, 'The figure was wearing the same jacket.', ['JACKET.'], []], [37.25, 39.28, 'Standing at the exact same angle.', ['EXACT', 'ANGLE.'], []], [41.5, 43.06, 'It was his own reflection.', ['REFLECTION.'], ['REFLECTION.']], [43.2, 45.14, 'Then he turned the photograph over.', ['TURNED'], []], [47.7, 50.08, 'IF WE FORGET, WATCH THE VIDEO.', ['FORGET,', 'VIDEO.'], ['FORGET,']], [50.3, 51.51, 'Arjun had written it.', ['ARJUN'], []], [51.7, 54.38, 'And he had absolutely no memory of doing so.', ['NO', 'MEMORY'], ['MEMORY']], [54.55, 56.01, 'Look at the window again...', ['WINDOW'], ['AGAIN...']]];

export type Chunk = {start: number; end: number; words: {t: string; s: number; e: number; hl: 0 | 1 | 2}[]};

/** splits sentences into ≤4-word chunks and spreads time by letter count */
export function buildChunks(fps: number): Chunk[] {
  const out: Chunk[] = [];
  for (const [a, b, text, yel = [], red = []] of SENTENCES) {
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
