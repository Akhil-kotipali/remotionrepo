import {Easing, random} from "remotion";

export type V2 = [number, number];
export type Ease = (t: number) => number;
/** [frame, value, easeIntoThisKey?] */
export type KF = [number, number, Ease?];

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const rad = (d: number) => (d * Math.PI) / 180;
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const E = {
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  soft: Easing.bezier(0.45, 0, 0.2, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
  linear: (t: number) => t,
};

/** Smooth keyframe sampler. The ease on a key shapes the segment that ENDS on that key. */
export function kf(frame: number, keys: KF[], def: Ease = E.inOut): number {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, v0] = keys[i];
    const [f1, v1, ease] = keys[i + 1];
    if (frame <= f1) {
      const t = clamp((frame - f0) / Math.max(1, f1 - f0), 0, 1);
      return v0 + (v1 - v0) * (ease ?? def)(t);
    }
  }
  return keys[keys.length - 1][1];
}

/** smooth pseudo-noise in [-1,1] */
export const noise = (x: number, seed = 0) =>
  Math.sin(x * 1.7 + seed) * 0.5 + Math.sin(x * 2.9 + 1.3 + seed * 2) * 0.3 + Math.sin(x * 4.7 + 2.1 + seed * 3) * 0.2;

export const rnd = (seed: string | number) => random(String(seed));

/** 0..1 pulse that is 1 at `at` and decays over `len` frames */
export const pulse = (f: number, at: number, len: number) =>
  f < at ? 0 : Math.max(0, 1 - (f - at) / len);

/** Two-bone IK. bend=+1 bends clockwise (elbow/knee goes to the screen-left of a downward limb). */
export function ik(s: V2, t: V2, l1: number, l2: number, bend: 1 | -1) {
  const dx = t[0] - s[0];
  const dy = t[1] - s[1];
  const d = Math.hypot(dx, dy);
  const dd = clamp(d, Math.abs(l1 - l2) + 0.01, l1 + l2 - 0.01);
  const a = Math.atan2(dy, dx);
  const cosA = clamp((l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd), -1, 1);
  const ang = Math.acos(cosA);
  const elbow: V2 = [s[0] + l1 * Math.cos(a + bend * ang), s[1] + l1 * Math.sin(a + bend * ang)];
  const hand: V2 = [s[0] + dd * Math.cos(a), s[1] + dd * Math.sin(a)];
  return {elbow, hand};
}
