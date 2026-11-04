// =====================================================================
//  CAPTIONS — Waveform-aligned multi-character viral voiceover (54.0s)
//  [start, end, text, yellowWords?, redWords?]
// =====================================================================
export type Sentence = [number, number, string, string[]?, string[]?];

export const SENTENCES: Sentence[] = [[0.15, 0.93, 'Five friends.', ['FIVE'], []], [1.6, 2.56, 'One photograph.', ['ONE'], []], [3.1, 5.09, 'And four completely different memories.', ['FOUR', 'DIFFERENT'], ['DIFFERENT']], [6.1, 8.68, 'Rahul remembered Dev leaving the house alone.', ['ALONE.'], []], [8.8, 11.06, 'Meera remembered Arjun following him.', ['FOLLOWING'], ['ARJUN']], [11.2, 13.39, 'Kabir remembered hearing an argument.', ['ARGUMENT.'], []], [13.45, 15.28, 'Nisha remembered someone shouting.', ['SHOUTING.'], []], [15.6, 16.41, "Don't touch me!", ['TOUCH'], ['TOUCH', 'ME!']], [17.3, 19.11, 'But nobody agreed on who said it.', ['NOBODY'], ['WHO']], [20.6, 22.61, 'Arjun listened without speaking.', ['WITHOUT'], []], [22.8, 24.46, 'Then he asked one question.', [], []], [24.8, 26.79, 'Did anyone actually see Dev fall?', ['SEE'], ['FALL?']], [28.2, 28.84, 'Silence.', [], []], [30.1, 30.92, 'Nobody had.', ['NOBODY'], ['HAD.']], [32.2, 34.11, 'Meera suddenly remembered something.', ['SUDDENLY'], []], [34.4, 37.93, 'That night, Dev had placed his phone against the hallway wall.', ['PHONE'], []], [38.0, 40.17, 'He wanted to record everyone together.', ['RECORD'], []], [40.35, 42.84, 'She thought the video was still on his old phone.', ['VIDEO', 'OLD', 'PHONE.'], []], [43.6, 45.26, 'Arjun remembered that phone.', ['PHONE.'], []], [45.6, 46.9, 'It had survived the night.', ['SURVIVED'], []], [47.5, 49.95, 'And it was still inside the abandoned house.', ['INSIDE'], ['ABANDONED']], [51.5, 53.24, 'The recording is still waiting...', ['RECORDING'], ['WAITING...']]];

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
