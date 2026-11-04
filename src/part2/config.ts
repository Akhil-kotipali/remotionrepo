// =====================================================================
//  PART 2 — THE EXTRA PERSON  ·  master timeline (30 fps, 1080x1920)
//  Every number below is a FRAME. Change them here, nothing else.
// =====================================================================
export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 1710; // 57.0 s
export const sec = (s: number) => Math.round(s * FPS);

/** living-room plate is 1536x2752 → scaled to 1080 wide */
export const WORLD_W = 1080;
export const WORLD_H = 1935;

export const VO_FILE = "audio/voiceover.wav";
export const CAPTION_Y = 1490;

/** Where each friend stands in the living room (WORLD px). feet = floor contact, h = figure height */
export const STAGE = {
  meera: {x: 215, feet: 1345, h: 470},
  nisha: {x: 395, feet: 1385, h: 490},
  rahul: {x: 800, feet: 1375, h: 490},
  kabir: {x: 940, feet: 1335, h: 470},
  arjun: {x: 610, feet: 1450, h: 540},
} as const;

/** The photograph overlay is on screen in these windows (everything else = living room) */
export const PHOTO_WINDOWS: [number, number][] = [
  [0, 135],
  [255, 666],
  [1014, 1167],
  [1209, 1557],
];

export const SHOT = {
  hook: [0, 135],
  roomIntro: [135, 255],
  photoInsert: [255, 666], // taken the night Dev died → five → Meera → zoom → sixth figure
  roomDialogue: [666, 1014],
  analysis: [1014, 1167], // closer / jacket / same angle
  roomCU1: [1167, 1209], // "It wasn't a stranger"
  flipAndBack: [1209, 1557], // reflection → flip → handwriting
  roomCU2: [1557, 1641],
  endCard: [1641, 1710],
} as const;

/** Hard-impact frames: camera kick + vignette punch + flash */
export const HITS = [0, 135, 255, 567, 666, 936, 1014, 1167, 1209, 1296, 1428, 1557, 1641];
/** only these get a strong white flash */
export const MAJOR_HITS = [0, 567, 1296, 1641];

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
  seg(6, 135, 52, 40);
  seg(135, 255, 62, 58);
  seg(255, 468, 56, 48);
  seg(468, 666, 46, 28);
  seg(666, 936, 36, 32);
  seg(936, 1014, 28, 22);
  seg(1014, 1260, 26, 22);
  seg(1266, 1428, 38, 36);
  seg(1428, 1557, 30, 24);
  seg(1557, 1634, 24, 17);
  return out;
}

/** Arjun's walk-in footsteps (living room intro) */
export const FOOTSTEPS = [152, 168, 184, 200];
