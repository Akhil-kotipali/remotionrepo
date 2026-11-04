import {STAGE} from "./config";
import {RigPose, REST, STANCE} from "./rig/FriendRig";
import {FriendId} from "./stick/friendDesigns";
import {E, clamp, kf, noise, pulse, V2} from "./math";

// ---------------------------------------------------------------------
//  WHO IS SPEAKING (everyone else looks at them)
// ---------------------------------------------------------------------
const SPEAK: [number, FriendId][] = [
  [0, "arjun"], [738, "rahul"], [806, "kabir"], [838, "nisha"], [872, "meera"], [936, "arjun"],
];
export const speakerAt = (f: number): FriendId => {
  let s: FriendId = "arjun";
  for (const [t, id] of SPEAK) if (f >= t) s = id;
  return s;
};

const BLINKS: Record<string, number[]> = {
  arjun: [150, 330, 700, 980, 1180, 1600],
  meera: [180, 420, 660, 900, 1020],
  nisha: [200, 360, 700, 1000],
  rahul: [170, 400, 760, 960],
  kabir: [190, 380, 640, 840],
};
const blinkAmt = (id: string, f: number) => {
  let b = 0;
  for (const s of BLINKS[id] ?? []) {
    const t = f - s;
    if (t >= 0 && t <= 6) b = Math.max(b, 1 - Math.abs(t - 3) / 3);
  }
  return b;
};

const mix = (a: V2, b: V2, t: number): V2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// ---------------------------------------------------------------------
//  WORLD POSITIONS (x offsets over time)
// ---------------------------------------------------------------------
export function charX(id: FriendId, f: number): number {
  const base = (STAGE as any)[id].x as number;
  if (id === "arjun") return kf(f, [[135, -240], [215, base, E.soft]]);
  if (id === "nisha") return base + kf(f, [[842, 0], [870, -34, E.soft]]);
  if (id === "meera") return base + kf(f, [[876, 0], [900, 26, E.soft]]);
  return base;
}

// ---------------------------------------------------------------------
//  POSES
// ---------------------------------------------------------------------
export function charPose(id: FriendId, f: number): RigPose {
  const st = STANCE[id];
  const sp = speakerAt(f);
  const tx = sp === id ? STAGE.arjun.x : charX(sp, f);
  let lookX = clamp((tx - charX(id, f)) / 360, -1, 1) * 0.9;
  const seed = id.length * 7;
  const breath = Math.sin(f * 0.09 + seed) * 1.5;
  const sway = Math.sin(f * 0.021 + seed) * 2.2;

  let handL: V2 = st.handL;
  let handR: V2 = st.handR;
  let lean = Math.sin(f * 0.031 + seed) * 0.8;
  let headTilt = lookX * 4;
  let lookY = 0.05;
  let eyeOpen = 0.9;
  let brow = 0.05;
  let mouth = 0;
  let footL: V2 = st.footL;
  let footR: V2 = st.footR;
  let hipY = 0;
  let prop: RigPose["prop"] = id === "kabir" ? "book" : "none";
  let propAmt = id === "kabir" ? 1 : 0;
  let photoSide = 0;

  // everybody reacts to "Nobody remembered anyone else…" — slow head shakes in turn
  const shakeAt: Record<string, number> = {rahul: 672, meera: 684, kabir: 696, nisha: 708};
  if (shakeAt[id] !== undefined) {
    const t = f - shakeAt[id];
    if (t >= 0 && t < 30) headTilt += Math.sin(t * 0.55) * 7 * (1 - t / 30);
    if (t >= 0 && t < 36) brow += 0.5 * Math.sin((t / 36) * Math.PI);
  }

  if (id === "arjun") {
    prop = "photo";
    propAmt = kf(f, [[135, 1], [140, 1]]);
    photoSide = 0;
    const walking = kf(f, [[150, 0], [160, 1], [205, 1], [217, 0]]);
    const ph = ((f - 150) / 32) * Math.PI * 2;
    footL = [96 + 9 * walking * Math.sin(ph), 416 - 14 * walking * Math.max(0, Math.cos(ph))];
    footR = [144 + 9 * walking * Math.sin(ph + Math.PI), 416 - 14 * walking * Math.max(0, Math.cos(ph + Math.PI))];
    hipY = walking * Math.abs(Math.sin(ph)) * 3;
    // holds the photo at chest; lifts it toward the others at the stop
    const lift = kf(f, [[215, 0], [240, 1, E.out]]) * kf(f, [[666, 1], [690, 0.15]]);
    handL = mix([96, 152], [90, 118], lift);
    handR = mix([142, 152], [146, 118], lift);
    if (f > 936) {
      const down = kf(f, [[936, 0], [960, 1]]);
      handL = mix(handL, [96, 164], down);
      handR = mix(handR, [140, 164], down);
    }
    lookY = f > 930 ? 0.75 : 0.1;
    // CU #1 (1167): unsettled / thinking; CU #2 (1557): blank, wide-eyed
    if (f >= 1167 && f < 1260) {
      eyeOpen = 1.0; brow = 0.55; mouth = 0.1; lookY = 0.55; lean = -1.5;
    }
    if (f >= 1557) {
      const k = kf(f, [[1557, 0], [1580, 1]]);
      eyeOpen = 0.9 + 0.3 * k; brow = 0.3 + 0.7 * k; mouth = 0.25 * k; lookY = 0.3; lean = -2.5 * k;
      lookX = 0;
      handL = mix(handL, [100, 176], k);
      handR = mix(handR, [138, 176], k);
    }
    if (f >= 666 && f < 936) {
      lookY = 0.05;
    }
  }

  if (id === "rahul") {
    // shrug: "probably a reflection"
    const k = kf(f, [[734, 0], [748, 1, E.out], [796, 1], [812, 0]]);
    handL = mix(st.handL, [36, 156], k);
    handR = mix(st.handR, [204, 156], k);
    if (k > 0) {
      eyeOpen = 0.9; brow = 0.4 * k; mouth = -0.2 * k; lean += 2 * k;
      headTilt += -6 * k;
    }
  }
  if (id === "kabir") {
    // "hold on — no": hand up, head shake
    const k = kf(f, [[804, 0], [816, 1, E.out], [840, 1], [852, 0]]);
    handR = mix(st.handR, [176, 112], k);
    if (k > 0) {
      headTilt += Math.sin((f - 806) * 0.9) * 8 * k;
      brow = -0.2 + 0.1 * k; mouth = -0.3 * k;
    }
    propAmt = 1 - k * 0.9;
  }
  if (id === "nisha") {
    // goes quiet: arms hug in, head drops
    const k = kf(f, [[840, 0], [866, 1, E.soft], [1000, 1], [1030, 0.4]]);
    handL = mix(st.handL, [128, 156], k);
    handR = mix(st.handR, [112, 166], k);
    lookY = 0.05 + 0.7 * k;
    headTilt += 6 * k;
    brow = 0.1 + 0.7 * k;
    mouth = -0.2 * k;
    lean += -2 * k;
  }
  if (id === "meera") {
    // "something strange": steps in, then points at Arjun
    const w = kf(f, [[872, 0], [884, 1, E.soft]]);
    eyeOpen = 0.9 + 0.25 * w;
    brow = 0.1 + 0.6 * w;
    const pt = kf(f, [[934, 0], [952, 1, E.out], [1002, 1], [1014, 0.6]]);
    handR = mix(st.handR, [236, 112], pt);
    lean += 3 * pt;
    mouth = 0.25 * pt;
  }

  // CU #2 — the friends fade behind (still alive)
  return {
    ...REST,
    lean,
    headTilt,
    hipY,
    hipX: sway,
    handL,
    handR,
    footL,
    footR,
    eyeOpen,
    brow,
    mouth,
    lookX,
    lookY,
    blink: blinkAmt(id, f),
    breath,
    prop,
    propAmt,
    photoSide,
  };
}

// ---------------------------------------------------------------------
//  CAMERA  (living room)
// ---------------------------------------------------------------------
export function cameraAt(f: number) {
  const K: [number, number, number, number][] = [
    [135, 1.02, 540, 990],
    [200, 1.14, 570, 1100],
    [255, 1.24, 590, 1150],
    [665, 1.24, 590, 1150],
    [666, 1.3, 560, 1190],
    [726, 1.34, 570, 1180],
    [740, 1.75, 810, 1150],
    [802, 1.78, 820, 1150],
    [816, 2.0, 930, 1130],
    [836, 2.0, 930, 1130],
    [850, 2.0, 400, 1170],
    [868, 2.0, 400, 1170],
    [886, 1.9, 240, 1130],
    [934, 1.9, 240, 1130],
    [950, 1.35, 560, 1190],
    [1010, 2.3, 610, 1090],
    [1166, 2.3, 610, 1090],
    [1167, 2.7, 610, 1100],
    [1208, 2.9, 610, 1100],
    [1556, 2.9, 610, 1100],
    [1557, 2.6, 610, 1110],
    [1638, 3.15, 610, 1110],
  ];
  const ch = (i: number) => kf(f, K.map((k) => [k[0], k[i]] as [number, number]), E.soft);
  const s = ch(1);
  const x = ch(2);
  const y = ch(3);
  const rot = kf(f, [[135, 0], [936, 0], [1010, -1.2], [1166, -1.2], [1167, 0.6], [1208, 0.6], [1557, -1.4], [1638, -2.2]], E.soft);
  return {s, x, y, rot};
}

import {HITS, heartbeatFrames} from "./config";
export function cameraShake(f: number) {
  let kick = 0;
  for (const h of HITS) kick = Math.max(kick, pulse(f, h, 11));
  const hb = heartbeatFrames().reduce((m, b) => Math.max(m, pulse(f, b, 6)), 0);
  const tense = kf(f, [[0, 0.7], [567, 1.6], [666, 0.8], [936, 1.6], [1296, 1.2], [1557, 2]]);
  const dx = noise(f * 0.07, 1) * 1.5 * tense + Math.sin(f * 1.9) * 14 * kick * kick;
  const dy = noise(f * 0.06, 5) * 1.5 * tense + Math.cos(f * 2.3) * 14 * kick * kick + hb * 1.5;
  return {dx, dy};
}

export function lightLevel(f: number) {
  // the wall tube light hums; flickers when the sixth figure appears and when Meera points
  const calm = 0.93 + 0.05 * noise(f * 0.3, 3);
  const storm = Math.max(kf(f, [[936, 0], [944, 1], [990, 1], [1006, 0]]), kf(f, [[1557, 0], [1566, 1], [1620, 1], [1636, 0.6]]));
  const dips = Math.abs(Math.sin(f * 0.9) * Math.sin(f * 1.7)) > 0.8 ? 0.35 : 1;
  return calm * (1 - storm * 0.6) + storm * 0.6 * dips;
}
