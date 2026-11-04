// =====================================================================
//  CAPTIONS — Experimental Paced & Tension Audio (57.0s)
//  Synchronized to public/audio/voiceover_part1_experiment.wav
// =====================================================================
export type Sentence = [number, number, string, string[]?, string[]?];

export const SENTENCES: Sentence[] = [
  [0.25, 3.42, "What if your dead friend messaged you?", ["DEAD"], ["DEAD"]],
  [5.40, 9.30, "Arjun was alone in his bedroom.", ["ALONE"], ["ALONE"]],
  [9.60, 13.75, "His phone was restoring an old backup.", ["RESTORING"], []],
  [14.00, 16.79, "Dev died one year ago.", ["DIED", "ONE"], ["DIED"]],
  [17.80, 21.11, "Arjun opened the conversation.", ["CONVERSATION"], []],
  [24.20, 26.68, "His hands went cold.", ["COLD"], ["COLD"]],
  [31.50, 35.33, "He told himself it was just a glitch.", ["GLITCH."], []],
  [36.50, 39.63, "Until he saw the timestamp.", ["TIMESTAMP."], []],
  [40.50, 42.79, "The night Dev died.", ["NIGHT", "DIED."], ["DIED."]],
  [43.80, 48.11, "Five friends outside the abandoned house.", ["FIVE", "ABANDONED"], []],
  [52.80, 56.39, "Why is everyone looking at me?", ["EVERYONE"], ["ME?"]],
];

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
      if (cur.length >= 3) {
        groups.push(cur);
        cur = [];
      }
    }
    if (cur.length) groups.push(cur);

    const totalLen = words.reduce((acc, w) => acc + w.length, 0);
    const durFrames = Math.round((b - a) * fps);
    let startF = Math.round(a * fps);

    for (const grp of groups) {
      const grpLen = grp.reduce((acc, w) => acc + w.length, 0);
      const grpDur = Math.max(8, Math.round((grpLen / totalLen) * durFrames));
      const endF = startF + grpDur;

      let wf = startF;
      const wItems = grp.map((w) => {
        const wFr = Math.max(3, Math.round((w.length / grpLen) * grpDur));
        const up = w.toUpperCase().replace(/[^A-Z0-9?]/g, "");
        const hl: 0 | 1 | 2 = red.includes(up) ? 2 : yel.includes(up) ? 1 : 0;
        const res = {t: w, s: wf, e: wf + wFr, hl};
        wf += wFr;
        return res;
      });

      out.push({start: startF, end: endF, words: wItems});
      startF = endF;
    }
  }
  return out;
}

