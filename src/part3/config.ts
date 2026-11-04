// =====================================================================
//  PART 3 — FIVE DIFFERENT MEMORIES  ·  master timeline (30 fps, 1080x1920)
//  Every number below is a FRAME. Change them here, nothing else.
// =====================================================================
export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 1620; // 54.0 s
export const sec = (s: number) => Math.round(s * FPS);

export const WORLD_W = 1080;
export const WORLD_H = 1935;
export const VO_FILE = "audio/voiceover_part3.wav";
export const CAPTION_Y = 1490;

/** Where each friend stands in the living room (WORLD px) */
export const STAGE = {
  meera: {x: 215, feet: 1345, h: 470},
  nisha: {x: 395, feet: 1385, h: 490},
  rahul: {x: 800, feet: 1375, h: 490},
  kabir: {x: 940, feet: 1335, h: 470},
  arjun: {x: 610, feet: 1450, h: 540},
} as const;

/** whose memory / who is talking, by frame */
export type Who = "rahul" | "meera" | "kabir" | "nisha" | "arjun" | "none";
export const SPEAK: [number, Who][] = [
  [0, "none"], [183, "rahul"], [264, "meera"], [333, "kabir"], [402, "nisha"], [525, "none"],
  [618, "arjun"], [846, "none"], [966, "meera"], [1296, "arjun"], [1428, "none"],
];

export const SHOT = {
  hook: [0, 168],
  rahul: [168, 264],
  meera: [264, 333],
  kabir: [333, 402],
  nisha: [402, 525], // incl. "Don't touch me!" at 468
  timeline: [525, 618], // the night branches into four versions
  arjunAsks: [618, 846],
  silence: [846, 966], // "Silence. Nobody had."
  meeraRemembers: [966, 1296],
  oldPhone: [1296, 1428],
  exterior: [1428, 1545],
  endCard: [1551, 1620],
} as const;

export const HITS = [0, 168, 264, 333, 402, 468, 525, 618, 744, 846, 966, 1296, 1314, 1428, 1545, 1551];
export const MAJOR_HITS = [0, 468, 1314, 1551];

export function heartbeatFrames(): number[] {
  const out: number[] = [];
  const seg = (from: number, to: number, i0: number, i1: number) => {
    let f = from;
    while (f < to) {
      out.push(Math.round(f));
      const t = (f - from) / Math.max(1, to - from);
      f += i0 + (i1 - i0) * t;
    }
  };
  seg(6, 168, 50, 44);
  seg(168, 468, 46, 38);
  seg(468, 525, 26, 24);
  seg(525, 846, 40, 34); // …stops dead for "Silence." (846–900)
  seg(900, 966, 48, 44);
  seg(966, 1296, 40, 28);
  seg(1296, 1545, 26, 16);
  return out;
}
