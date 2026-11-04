// =====================================================================
//  CAPTIONS — Waveform-aligned to master neural voiceover (57.0s)
//  [start, end, text, yellowWords?, redWords?]
// =====================================================================
export type Sentence = [number, number, string, string[]?, string[]?];

export const SENTENCES: Sentence[] = [
  [0.20, 2.63, "What if your dead friend suddenly messaged you…", ['DEAD'], ['DEAD']],
  [2.71, 5.60, "and the message was something only you could understand?", ['ONLY', 'YOU']],
  [5.68, 8.80, "At 2:17 in the morning, Arjun was alone in his bedroom.", ['2:17', 'ALONE', 'ONE']],
  [8.88, 11.22, "His phone was restoring an old backup.", ['RESTORING', 'ONE']],
  [11.30, 13.00, "Then a conversation appeared.", ['CONVERSATION']],
  [13.08, 13.76, "The sender?"],
  [13.84, 14.15, "Dev.", ['DEV.']],
  [14.35, 15.33, "His best friend."],
  [15.45, 17.68, "Who had died exactly one year ago.", ['DIED', 'ONE'], ['DIED']],
  [17.95, 19.84, "Arjun opened the conversation.", ['CONVERSATION']],
  [19.92, 21.77, "There was one recovered message.", ['ONE']],
  [21.85, 23.28, "YOU SAID YOU WOULDN'T TELL THEM.", ["WOULDN'T"], ["WOULDN'T", 'TELL']],
  [23.80, 25.05, "His hands went cold.", ['COLD']],
  [25.13, 26.53, "He stared at the screen."],
  [26.75, 28.71, "Then another old message appeared.", ['ANOTHER']],
  [28.79, 30.91, "Do you remember what happened at the house?", ['HOUSE?'], ['HOUSE?']],
  [31.20, 33.81, "Arjun immediately closed the conversation.", ['CONVERSATION']],
  [33.89, 36.30, "He told himself it was just an old backup."],
  [36.38, 37.02, "A glitch."],
  [37.10, 37.88, "Nothing more."],
  [37.96, 39.37, "But then he noticed something.", ['NOTICED']],
  [39.45, 41.50, "The conversation wasn't from today.", ['CONVERSATION', 'TODAY.']],
  [41.58, 43.31, "It was from the night Dev died.", ['DEV.', 'DIED', 'NIGHT', 'DEV'], ['DIED', 'DIED.']],
  [43.80, 46.18, "Arjun opened the old conversation again.", ['CONVERSATION']],
  [46.26, 47.91, "There was a photograph attached.", ['PHOTOGRAPH']],
  [47.99, 48.81, "Five friends.", ['FIVE']],
  [48.89, 51.01, "Standing outside the abandoned house.", ['ONE', 'ABANDONED']],
  [51.09, 51.94, "He zoomed in."],
  [52.02, 52.88, "And whispered…"],
  [52.96, 54.83, "Why is everyone looking at me?", ['ONE', 'EVERYONE'], ['ME?']],
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
