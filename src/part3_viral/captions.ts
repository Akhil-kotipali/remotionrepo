// =====================================================================
//  CAPTIONS — Waveform-aligned 26-Second Part 3 Master Viral Voiceover
//  [start, end, text, yellowWords?, redWords?]
// =====================================================================
export type Sentence = [number, number, string, string[]?, string[]?];

export const DURATION_VIRAL = 780; // 26.0s @ 30 FPS

export const SENTENCES_VIRAL: Sentence[] = [
  [0.15, 2.18, 'Five friends. One photograph.', ['FIVE', 'ONE'], []],
  [1.85, 3.75, 'And four completely different memories.', ['FOUR', 'DIFFERENT'], ['DIFFERENT']],
  [3.9, 5.44, 'Rahul said Dev left alone.', ['ALONE.'], []],
  [5.6, 7.48, 'Meera swore Arjun followed him.', ['FOLLOWING'], ['ARJUN']],
  [7.5, 8.83, 'Kabir heard them fighting.', ['FIGHTING.'], []],
  [9.1, 9.89, "Don't touch me!", ['TOUCH'], ['TOUCH', 'ME!']],
  [10.4, 11.79, 'None of their stories matched.', ['NONE'], ['MATCHED.']],
  [12.4, 14.31, 'Did anyone actually see him fall?', ['SEE'], ['FALL?']],
  [15.0, 15.82, 'Nobody had.', ['NOBODY'], ['HAD.']],
  [16.6, 20.0, 'Because that night, Dev was secretly recording in the hallway...', ['SECRETLY', 'RECORDING'], []],
  [20.3, 23.06, 'And that video is still inside the abandoned house.', ['VIDEO', 'INSIDE'], ['ABANDONED']],
  [24.2, 25.6, 'Look at the window again.', ['WINDOW'], ['AGAIN.']],
];

export type Chunk = {start: number; end: number; words: {t: string; s: number; e: number; hl: 0 | 1 | 2}[]};

/** splits sentences into <=4-word chunks and spreads time by letter count */
export function buildChunksViral(fps: number = 30): Chunk[] {
  const out: Chunk[] = [];
  for (const [a, b, text, yel = [], red = []] of SENTENCES_VIRAL) {
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
        const up = w.toUpperCase().replace(/[.,!?:;"'…]/g, "");
        const o = {
          t: w,
          s: Math.round(wt * fps),
          e: Math.round((wt + wdur) * fps),
          hl: (red.some(r => r.toUpperCase().includes(up)) ? 2 : yel.some(y => y.toUpperCase().includes(up)) ? 1 : 0) as 0 | 1 | 2,
        };
        wt += wdur;
        return o;
      });
      out.push({start: Math.round(t * fps), end: Math.round((t + dur) * fps) + 2, words: ws});
      t += dur;
    }
  }
  return out;
}

