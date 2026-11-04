import {HITS, SPEAK, STAGE, Who, heartbeatFrames} from "./config";
import {REST, RigPose, STANCE} from "./rig/FriendRig";
import {FriendId} from "./stick/friendDesigns";
import {E, clamp, kf, noise, pulse, V2} from "./math";

export const speakerAt = (f: number): Who => {
  let s: Who = "none";
  for (const [t, id] of SPEAK) if (f >= t) s = id;
  return s;
};

const BLINKS: Record<string, number[]> = {
  arjun: [90, 300, 640, 860, 1100, 1380],
  meera: [60, 280, 520, 760, 1000, 1240],
  nisha: [120, 330, 560, 720, 1180],
  rahul: [80, 230, 600, 800, 1060],
  kabir: [100, 350, 650, 900, 1300],
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

/** during "Silence." everybody glances at somebody else */
const GLANCE: Record<string, FriendId> = {rahul: "kabir", kabir: "rahul", meera: "nisha", nisha: "meera", arjun: "meera"};

export function charPose(id: FriendId, f: number): RigPose {
  const st = STANCE[id];
  const sp = speakerAt(f);
  let tx: number;
  if (sp === "none") tx = f >= 846 && f < 966 ? (STAGE as any)[GLANCE[id] ?? "arjun"].x : STAGE.arjun.x;
  else if (sp === id) tx = STAGE.arjun.x;
  else tx = (STAGE as any)[sp].x;
  let lookX = clamp((tx - (STAGE as any)[id].x) / 360, -1, 1) * 0.9;
  const seed = id.length * 7;
  const breath = Math.sin(f * 0.09 + seed) * 1.5;
  const sway = Math.sin(f * 0.021 + seed) * 2.2;
  // everyone freezes in the silence: no sway
  const freeze = kf(f, [[846, 0], [856, 1], [960, 1], [972, 0]]);

  let handL: V2 = st.handL;
  let handR: V2 = st.handR;
  let lean = Math.sin(f * 0.031 + seed) * 0.8 * (1 - freeze);
  let headTilt = lookX * 4;
  let lookY = 0.05;
  let eyeOpen = 0.9;
  let brow = 0.05;
  let mouth = 0;
  let prop: RigPose["prop"] = id === "kabir" ? "book" : "none";
  let propAmt = id === "kabir" ? 1 : 0;

  // "Nobody had." — slow staggered head shakes
  const shake = ({rahul: 930, kabir: 936, nisha: 942, meera: 948} as Record<string, number>)[id];
  if (shake !== undefined) {
    const t = f - shake;
    if (t >= 0 && t < 40) headTilt += Math.sin(t * 0.4) * 8 * (1 - t / 40);
  }

  if (id === "rahul") {
    const k = kf(f, [[190, 0], [204, 1, E.out], [250, 1], [268, 0]]);
    handR = mix(st.handR, [236, 142], k);
    lean += 2.5 * k;
    brow += 0.2 * k;
    mouth = 0.15 * k;
  }
  if (id === "meera") {
    const k = kf(f, [[270, 0], [286, 1, E.out], [322, 1], [338, 0]]);
    handR = mix(st.handR, [190, 138], k);
    handL = mix(st.handL, [54, 188], k);
    mouth += 0.15 * k;
    // her second speech: shocked memory → explains
    const shock = kf(f, [[966, 0], [976, 1, E.out], [1010, 1], [1024, 0]]);
    handR = mix(handR, [128, 58], shock);
    eyeOpen = 0.9 + 0.3 * shock;
    brow += 0.8 * shock;
    mouth += 0.4 * shock;
    const talk = kf(f, [[1032, 0], [1046, 1], [1128, 1], [1140, 0]]);
    handR = mix(handR, [186, 150 + Math.sin((f - 1032) * 0.22) * 14], talk * (1 - shock));
    const chin = kf(f, [[1209, 0], [1226, 1, E.out], [1290, 1], [1300, 0.4]]);
    handR = mix(handR, [124, 90], chin);
    lookY += 0.3 * chin;
    lean += 2 * talk;
  }
  if (id === "kabir") {
    const k = kf(f, [[338, 0], [352, 1, E.out], [392, 1], [406, 0]]);
    handR = mix(st.handR, [150, 70], k);
    headTilt += 9 * k;
    brow += 0.4 * k;
    propAmt = 1 - k * 0.9;
  }
  if (id === "nisha") {
    const hug = kf(f, [[404, 0], [420, 1, E.soft], [1000, 1], [1030, 0.3]]);
    handL = mix(st.handL, [128, 156], hug);
    handR = mix(st.handR, [112, 166], hug);
    lookY += 0.35 * hug;
    brow += 0.4 * hug;
    // "Don't touch me!" — she flinches
    const fl = kf(f, [[466, 0], [472, 1, E.out], [500, 1], [516, 0.2]]);
    handL = mix(handL, [60, 116], fl);
    handR = mix(handR, [180, 116], fl);
    lean += -6 * fl;
    eyeOpen = 0.9 + 0.35 * fl;
    brow += 0.6 * fl;
    mouth += 0.6 * fl;
  }
  if (id === "arjun") {
    prop = "photo";
    propAmt = 1;
    const low = kf(f, [[846, 0], [866, 1], [960, 1], [976, 0]]);
    handL = mix([96, 152], [96, 176], low);
    handR = mix([142, 152], [140, 176], low);
    // asks the question
    const ask = kf(f, [[738, 0], [748, 1, E.out], [812, 1], [826, 0]]);
    lean += 2.5 * ask;
    mouth += 0.3 * ask * (0.6 + 0.4 * Math.sin(f * 0.7));
    brow += 0.5 * ask;
    lookY = 0.1;
    // remembers the phone — the realisation
    const rem = kf(f, [[1300, 0], [1314, 1, E.out]]);
    eyeOpen = 0.9 + 0.35 * rem;
    brow += 0.95 * rem;
    mouth += 0.35 * rem;
    lean += -3 * rem;
    lookY += 0.15 * rem;
    const flinch = pulse(f, 1314, 10);
    lean += -3 * flinch;
  }

  return {
    ...REST,
    lean,
    headTilt,
    hipX: sway * (1 - freeze),
    handL,
    handR,
    footL: st.footL,
    footR: st.footR,
    eyeOpen,
    brow,
    mouth,
    lookX,
    lookY,
    blink: blinkAmt(id, f),
    breath: breath * (1 - 0.6 * freeze),
    prop,
    propAmt,
    photoSide: 0,
  };
}

// ---------------------------------------------------------------------
//  CAMERA — hook wide → follows whoever is remembering (head sits under the memory panel)
// ---------------------------------------------------------------------
export function cameraAt(f: number) {
  const K: [number, number, number, number][] = [
    [0, 1.05, 540, 1010],
    [160, 1.14, 560, 1080],
    [168, 1.14, 560, 1080],
    [176, 1.8, 790, 875],     // Rahul
    [260, 1.8, 790, 875],
    [276, 1.8, 300, 862],     // Meera
    [330, 1.8, 300, 862],
    [344, 1.8, 780, 833],     // Kabir
    [398, 1.8, 780, 833],
    [412, 1.8, 400, 885],     // Nisha
    [520, 1.8, 400, 885],
    [530, 1.2, 560, 1150],    // timeline (world behind)
    [617, 1.2, 560, 1150],
    [618, 2.4, 610, 1050],    // Arjun listens
    [740, 2.4, 610, 1050],
    [844, 2.75, 610, 1055],   // asks
    [846, 1.2, 560, 1150],    // silence: pull back wide
    [964, 1.45, 560, 1130],
    [978, 1.8, 300, 862],     // Meera remembers
    [1290, 1.8, 300, 862],
    [1300, 2.4, 610, 1040],   // Arjun & the phone
    [1426, 2.9, 610, 1050],
  ];
  const ch = (i: number) => kf(f, K.map((k) => [k[0], k[i]] as [number, number]), E.soft);
  const rot = kf(f, [[0, 0], [846, 0], [900, -1.0], [964, -1.0], [978, 0], [1296, 0], [1426, -2.0]], E.soft);
  return {s: ch(1), x: ch(2), y: ch(3), rot};
}

export function cameraShake(f: number) {
  let kick = 0;
  for (const h of HITS) kick = Math.max(kick, pulse(f, h, 11));
  const hb = heartbeatFrames().reduce((m, b) => Math.max(m, pulse(f, b, 6)), 0);
  const tense = kf(f, [[0, 0.7], [468, 2.2], [525, 0.9], [846, 0.2], [966, 1.2], [1296, 2.2]]);
  const dx = noise(f * 0.07, 1) * 1.5 * tense + Math.sin(f * 1.9) * 14 * kick * kick;
  const dy = noise(f * 0.06, 5) * 1.5 * tense + Math.cos(f * 2.3) * 14 * kick * kick + hb * 1.5;
  return {dx, dy};
}

export function lightLevel(f: number) {
  const calm = 0.93 + 0.05 * noise(f * 0.3, 3);
  const storm = Math.max(kf(f, [[466, 0], [472, 1], [510, 1], [524, 0]]), kf(f, [[1312, 0], [1318, 1], [1400, 1], [1426, 0.7]]));
  const dips = Math.abs(Math.sin(f * 0.9) * Math.sin(f * 1.7)) > 0.8 ? 0.35 : 1;
  return calm * (1 - storm * 0.6) + storm * 0.6 * dips;
}
