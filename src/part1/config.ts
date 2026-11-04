// =====================================================================
//  PART 1 — THE MESSAGE  ·  master timeline  (30 fps, 1080x1920)
//  Every number below is a FRAME. Change them here, nothing else.
// =====================================================================
export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 1710; // 57.0 s
export const sec = (s: number) => Math.round(s * FPS);

/** Bedroom plate is 1536x2752 → scaled to 1080 wide */
export const WORLD_W = 1080;
export const WORLD_H = 1935;

/** If you record your own voiceover, put it at public/audio/voiceover.wav|mp3 and edit the path. */
export const VO_FILE = "audio/voiceover.wav";

/** Where Arjun stands in WORLD pixels (feet position) and how tall he is. */
export const ARJUN = {feetY: 1440, height: 600, startX: 500};

/** Lamp + window light sources in WORLD pixels (measured on the bedroom plate). */
export const LAMP = {x: 451, y: 834};
export const WINDOW = {x: 714, y: 700};

/** Caption block centre (kept out of YouTube Shorts UI zones). */
export const CAPTION_Y = 1490;

/** The shots (for reference + transitions) */
export const SHOT = {
  coldOpen: [0, 162],
  bedroomWide: [162, 252],
  insertRestore: [252, 462],
  arjunCU1: [462, 537],
  insertChat1: [537, 711],
  arjunCU2: [711, 801],
  insertChat2: [801, 960],
  bedroomWalk: [936, 1128],
  insertDate: [1128, 1425],
  photo: [1425, 1524],
  photoZoom: [1524, 1641],
  endCard: [1641, 1710],
} as const;

/** Phone "insert" overlay windows (phone slides over the world) */
export const INSERTS: [number, number][] = [
  [0, 162],
  [252, 462],
  [537, 711],
  [801, 960],
  [1128, 1425],
];

/** Typed messages */
export const MSG1 = {text: "YOU SAID YOU WOULDN'T TELL THEM.", start: 639, cps: 15};
export const MSG2 = {text: "Do you remember what happened at the house?", start: 853, cps: 20.5};

/** Hard-impact frames (camera kick + flash + vignette punch) */
export const HITS = [162, 333, 420, 462, 703, 711, 801, 1128, 1239, 1314, 1425, 1641];

/** Heartbeat schedule — accelerates with the story, stops dead at the final cut. */
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
  seg(6, 162, 54, 46);
  seg(252, 462, 50, 38);
  seg(537, 703, 40, 24);
  seg(711, 801, 23, 21);
  seg(801, 936, 26, 30);
  seg(1000, 1128, 34, 30);
  seg(1128, 1425, 30, 20);
  seg(1425, 1634, 34, 18);
  return out;
}

/** Footstep frames while Arjun walks (matches walk cycle in choreo.ts) */
export const FOOTSTEPS = [1022, 1038, 1054, 1070, 1086, 1102];
