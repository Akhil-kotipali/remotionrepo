import {ARJUN, HITS, heartbeatFrames} from "./config";
import {ArjunPose, REST_POSE} from "./rig/ArjunRig";
import {E, kf, noise, pulse, V2} from "./math";

// ---------------------------------------------------------------------
//  ARJUN — performance, frame by frame (keyframes, not guesswork)
// ---------------------------------------------------------------------
const BLINKS = [40, 190, 331, 505, 590, 640, 1060, 1150, 1380, 1560];
const blinkAmt = (f: number) => {
  let b = 0;
  for (const s of BLINKS) {
    const t = f - s;
    if (t >= 0 && t <= 6) b = Math.max(b, 1 - Math.abs(t - 3) / 3);
  }
  return b;
};

export function arjunX(f: number) {
  return kf(f, [[1010, ARJUN.startX], [1112, ARJUN.startX + 125, E.soft]]);
}

export function arjunPose(f: number): ArjunPose {
  // breathing: slow → fast as fear rises
  const w = kf(f, [[0, 0], [462, 0.1], [540, 0.4], [700, 0.9], [800, 1], [936, 0.35], [1128, 0.6]]);
  const breath = ((1 - w) * Math.sin(f * 0.09) * 1.6 + w * Math.sin(f * 0.23) * 2.1) * 1.0;

  // phone hand: low → chest → low → chest
  const lowR: V2 = [148, 214];
  const chestR: V2 = [135, 156];
  const up1 = kf(f, [[222, 0], [250, 1, E.out]]);
  const down = kf(f, [[936, 0], [964, 1]]);
  const up2 = kf(f, [[1100, 0], [1126, 1, E.out]]);
  const raise = Math.min(1, up1 * (1 - down) + up2);
  const tAmp = kf(f, [[690, 0], [706, 1.3], [760, 2.4], [800, 1.1], [930, 0.8], [942, 0]]);
  const handR: V2 = [
    lowR[0] + (chestR[0] - lowR[0]) * raise + Math.sin(f * 2.1) * tAmp,
    lowR[1] + (chestR[1] - lowR[1]) * raise + Math.sin(f * 2.7 + 1) * tAmp * 0.8,
  ];

  // left hand: relaxed at side → clutches the phone with two hands when shocked
  const clutch = kf(f, [[716, 0], [738, 1, E.out], [925, 1], [952, 0]]);
  const handL: V2 = [
    92 + (handR[0] - 12 - 92) * clutch,
    214 + (handR[1] + 4 - 214) * clutch,
  ];

  // body language
  const lean = kf(f, [[0, 0], [700, 0], [714, -5, E.out], [760, -3], [936, -3], [962, -0.5], [1128, 0]]) + Math.sin(f * 0.031) * 0.8;
  const hipX = kf(f, [[0, 0], [700, 0], [716, -7, E.out], [936, -6], [962, 0]]) + Math.sin(f * 0.021) * 2.2;
  const hipY = kf(f, [[936, 0], [950, 4], [975, 1]]) + Math.sin(f * 0.09) * 0.4;

  // head: looks at floor → phone → away to window, shakes "no"
  const shake = kf(f, [[975, 0], [981, 1], [1008, 1], [1018, 0]]) * Math.sin((f - 975) * 0.55) * 6;
  const headTilt =
    kf(f, [[0, 1], [225, 5], [462, 7], [700, 7], [716, 2], [800, 4], [960, 4], [985, -5], [1090, -2], [1124, 6]]) + shake;
  const lookX = kf(f, [[0, -0.3], [225, 0], [958, 0], [986, 0.95], [1095, 0.8], [1124, 0]]) + (shake / 6) * 0.35;
  const lookY = kf(f, [[0, 0.45], [225, 0.7], [462, 0.75], [716, 0.9], [958, 0.6], [986, 0.1], [1100, 0.2], [1124, 0.8]]);

  // face
  const eyeOpen = kf(f, [[0, 0.82], [462, 0.95], [711, 0.95], [716, 1.2, E.out], [800, 1.12], [936, 0.9], [1124, 1.0]]);
  const brow = kf(f, [[0, 0.1], [462, 0.45], [711, 0.5], [718, 0.95, E.out], [936, 0.5], [1128, 0.85]]);
  const mouth = kf(f, [[0, 0], [708, 0], [718, 0.5, E.out], [770, 0.25], [936, 0.1], [962, -0.35]]);

  // walking to the window: natural grounded stride with forward foot swing
  const walkW = kf(f, [[1008, 0], [1026, 1], [1096, 1], [1114, 0]]);
  const ph = ((f - 1010) / 26) * Math.PI * 2;
  const amp = 16 * walkW;
  const lift = 14 * walkW;
  const stepL = Math.sin(ph);
  const stepR = Math.sin(ph + Math.PI);
  const footL: V2 = [96 + amp * stepL, 416 - lift * Math.max(0, stepL)];
  const footR: V2 = [144 + amp * stepR, 416 - lift * Math.max(0, stepR)];
  const bob = walkW * Math.abs(Math.sin(ph * 2)) * 3.2;

  const phoneGlow =
    kf(f, [[150, 0.3], [252, 0.8], [462, 0.9], [700, 1], [800, 0.95], [936, 0.8], [956, 0.14], [1100, 0.12], [1112, 0.95], [1128, 1]]) *
    (0.92 + 0.08 * noise(f * 0.5));

  return {
    ...REST_POSE,
    lean,
    headTilt,
    hipX,
    hipY: hipY + bob,
    handL,
    handR,
    footL,
    footR,
    eyeOpen,
    brow,
    mouth,
    lookX,
    lookY,
    blink: blinkAmt(f),
    breath,
    phone: 1,
    phoneGlow,
  };
}

// ---------------------------------------------------------------------
//  CAMERA — focus point (world px) + zoom + dutch tilt
//  Cuts are 1-frame keyframe pairs (…536 → 537).
// ---------------------------------------------------------------------
export function cameraAt(f: number) {
  const s = kf(f, [
    [150, 1.0], [252, 1.2], [461, 1.42], [462, 2.35], [536, 2.62],
    [537, 1.5], [710, 1.68], [711, 2.2], [801, 2.78], [935, 2.78],
    [936, 1.4], [1128, 1.62],
  ], E.soft);
  const x = kf(f, [
    [150, 540], [252, 520], [461, 505], [462, 505], [536, 500],
    [537, 500], [710, 505], [711, 490], [801, 492], [935, 492],
    [936, 520], [1128, 610],
  ], E.soft);
  const y = kf(f, [
    [150, 975], [252, 1040], [461, 1045], [462, 1010], [536, 1030],
    [537, 1040], [710, 1050], [711, 1020], [801, 1040], [935, 1040],
    [936, 1060], [1128, 1010],
  ], E.soft);
  const rot = kf(f, [[0, 0], [700, 0], [711, -1.4], [801, -2.4], [935, -2.4], [936, 0.4], [1128, -0.6]], E.soft);
  return {s, x, y, rot};
}

/** Handheld micro-shake + impact kicks (px) */
export function cameraShake(f: number) {
  const base = 1.6;
  let kick = 0;
  for (const h of HITS) kick = Math.max(kick, pulse(f, h, 11));
  const heartbeat = heartbeatFrames().reduce((m, b) => Math.max(m, pulse(f, b, 6)), 0);
  const tense = kf(f, [[0, 0.6], [700, 1.4], [800, 2], [936, 0.8], [1128, 1.3]]);
  const dx = noise(f * 0.07, 1) * base * tense + Math.sin(f * 1.9) * 14 * kick * kick;
  const dy = noise(f * 0.06, 5) * base * tense + Math.cos(f * 2.3) * 14 * kick * kick + heartbeat * 1.6;
  return {dx, dy};
}

/** lamp flicker: gentle at rest, violent when the message hits */
export function lampLevel(f: number) {
  const calm = 0.93 + 0.05 * noise(f * 0.31, 3) + 0.02 * Math.sin(f * 1.3);
  const storm = kf(f, [[704, 0], [712, 1], [770, 1], [782, 0]]);
  const dips = Math.abs(Math.sin(f * 0.9) * Math.sin(f * 1.7)) > 0.82 ? 0.35 : 1;
  return calm * (1 - storm) + storm * 0.55 * dips + (storm > 0 ? 0 : 0);
}
