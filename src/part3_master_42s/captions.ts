// =====================================================================
//  CAPTIONS — Waveform-aligned 42-Second Part 3 Master Voiceover
//  [start_s, end_s, text, yellowWords?, redWords?]
// =====================================================================
export type Sentence = [number, number, string, string[]?, string[]?];

export const DURATION_42S = 1260; // 42.0s @ 30 FPS

export const SENTENCES_42S: Sentence[] = [
  [0.20, 4.45, 'Minutes after this final photo was taken, Dev fell from that balcony.', ['FINAL', 'PHOTO'], ['DEV', 'FELL', 'BALCONY.']],
  [4.60, 8.13, "Four friends gave an alibi. But their stories don't add up.", ['FOUR', 'ALIBI.'], ["DON'T", 'ADD', 'UP.']],
  [8.30, 10.95, 'Rahul swore Dev walked out the front gate alone.', ['RAHUL', 'ALONE.'], []],
  [11.20, 13.84, 'Meera claimed Arjun followed him into the dark.', ['MEERA', 'FOLLOWED'], ['ARJUN']],
  [14.10, 16.51, 'Kabir heard two people fighting in the hallway.', ['KABIR', 'FIGHTING'], ['HALLWAY.']],
  [16.80, 17.63, "Don't touch me!", ['TOUCH'], ["DON'T", 'TOUCH', 'ME!']],
  [17.80, 20.19, 'And Nisha heard someone scream on the stairs.', ['NISHA', 'SCREAM'], ['STAIRS.']],
  [20.40, 21.91, 'None of their stories matched.', ['NONE'], ['MATCHED.']],
  [22.10, 24.04, 'Then Arjun asked one question.', ['ONE', 'QUESTION.'], []],
  [24.30, 26.24, 'Did anyone actually see Dev fall?', ['SEE'], ['FALL?']],
  [27.00, 28.84, 'Silence. Nobody had.', ['SILENCE.'], ['NOBODY', 'HAD.']],
  [29.20, 32.61, 'Because that night, Dev was secretly recording the hallway...', ['SECRETLY', 'RECORDING'], []],
  [32.80, 35.05, 'Facing the exact balcony where he fell.', ['BALCONY'], ['FELL.']],
  [35.30, 38.10, 'And that video is still inside the abandoned house.', ['VIDEO', 'INSIDE'], ['ABANDONED']],
  [38.90, 40.97, 'Look at the window again. Because...', ['WINDOW'], ['BECAUSE...']],
];

export type Chunk = {start: number; end: number; words: {t: string; s: number; e: number; hl: 0 | 1 | 2}[]};

/** splits sentences into <=4-word chunks and spreads time by letter count */
export function buildChunks42s(fps: number = 30): Chunk[] {
  const out: Chunk[] = [];
  for (const [a, b, text, yel = [], red = []] of SENTENCES_42S) {
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
      const wTotal = g.join("").length;
      const wArr = g.map((w) => {
        const wDur = dur * (w.length / wTotal);
        const ws = wt;
        const we = wt + wDur;
        wt = we;
        const clean = w.toUpperCase().replace(/[^A-Z0-9?!']/g, "");
        const isRed = red.some((r) => r.toUpperCase().replace(/[^A-Z0-9?!']/g, "") === clean);
        const isYel = yel.some((y) => y.toUpperCase().replace(/[^A-Z0-9?!']/g, "") === clean);
        return {
          t: w,
          s: Math.round(ws * fps),
          e: Math.round(we * fps),
          hl: (isRed ? 2 : isYel ? 1 : 0) as 0 | 1 | 2,
        };
      });
      out.push({
        start: Math.round(t * fps),
        end: Math.round((t + dur) * fps),
        words: wArr,
      });
      t += dur;
    }
  }
  return out;
}

