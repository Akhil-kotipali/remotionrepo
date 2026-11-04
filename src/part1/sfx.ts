// =====================================================================
//  SOUND CUES — [frame, file (public/audio/sfx/*.wav), volume 0..1, playbackRate?]
//  Tweak freely. VO sits on its own track (see Part1.tsx).
// =====================================================================
import {FOOTSTEPS} from "./config";
import {kf, E} from "./math";

export type Cue = [number, string, number, number?];

export const CUES: Cue[] = [
  // --- cold open: bang in frame 0 (heavy cinematic hook impact) ---
  [0, "sub_drop", 0.85],
  [0, "static_burst", 0.55],
  [0, "glitch_hit", 0.6],
  [70, "scramble", 0.28],
  [81, "reverse_swell", 0.55],
  [126, "reverse_swell", 0.7],
  // --- smash cut into the bedroom ---
  [162, "impact_boom", 0.9],
  [162, "whoosh", 0.5],
  [163, "glitch_hit", 0.5],
  // --- phone slides in, restore runs ---
  [244, "whoosh_soft", 0.5],
  [255, "data_scan", 0.45],
  [318, "ui_click", 0.4],
  [330, "notif_ping", 0.85],
  [333, "phone_buzz", 0.7],
  // --- contact card: UNKNOWN → DEV ---
  [376, "ui_click", 0.4],
  [378, "whoosh_soft", 0.4],
  [392, "scramble", 0.4],
  [408, "impact_boom", 0.65],
  [408, "glitch_hit", 0.5],
  [440, "reverse_swell", 0.8],
  // --- cut to Arjun CU ---
  [462, "thump_low", 0.85],
  [466, "sting_high", 0.3],
  // --- chat opens, first message types ---
  [533, "whoosh_soft", 0.45],
  [537, "ui_click", 0.4],
  [585, "ui_click", 0.25],
  [598, "riser", 0.5],
  [639, "type_m1", 0.8],
  [703, "impact_boom", 1.0],
  [703, "glitch_hit", 0.8],
  [704, "static_burst", 0.5],
  // --- "His hands went cold" ---
  [724, "breath", 0.5],
  [795, "phone_buzz", 0.8],
  [801, "notif_ping", 0.7],
  [853, "type_m2", 0.8],
  [916, "glitch_hit", 0.4],
  // --- he closes it, steps away ---
  [934, "whoosh", 0.5],
  [938, "ui_click", 0.4],
  [950, "breath", 0.35],
  ...FOOTSTEPS.map((f, i): Cue => [f, "footstep", 0.34 + (i % 2) * 0.06, 0.92 + (i % 3) * 0.05]),
  // --- he notices something ---
  [1122, "whoosh_soft", 0.5],
  [1126, "phone_buzz", 0.7],
  [1128, "sting_high", 0.55],
  [1180, "scramble", 0.5],
  [1203, "reverse_swell", 0.7],
  [1239, "impact_boom", 0.85],
  [1239, "glitch_hit", 0.6],
  [1278, "reverse_swell", 0.8],
  // --- the old thread + photo ---
  [1314, "impact_boom", 0.9],
  [1314, "glitch_hit", 0.5],
  [1318, "ui_click", 0.4],
  [1334, "data_scan", 0.5],
  [1389, "reverse_swell", 0.65],
  // --- photograph: shutter + five ticks (pitch rises) ---
  [1425, "camera_shutter", 1.0],
  [1425, "impact_boom", 0.55],
  [1426, "whoosh", 0.55],
  [1437, "count_tick", 0.7, 1.0],
  [1451, "count_tick", 0.7, 1.12],
  [1465, "count_tick", 0.7, 1.26],
  [1479, "count_tick", 0.7, 1.41],
  [1493, "count_tick", 0.75, 1.59],
  // --- zoom into Arjun ---
  [1524, "riser", 0.7],
  [1548, "sting_high", 0.3],
  // --- black ---
  [1641, "thump_low", 1.0],
  [1641, "sub_drop", 0.9],
  [1655, "count_tick", 0.45, 0.8],
  [1690, "glitch_hit", 0.35],
];

/** low dark drone under everything — ducks for the big beats */
export function bedVolume(f: number): number {
  const base = 0.3;
  const v = kf(f, [
    [0, 0.36], [150, 0.3], [690, 0.26], [699, 0.04], [704, 0.5, E.out], [730, 0.24],
    [930, 0.26], [1236, 0.22], [1239, 0.4], [1300, 0.26], [1425, 0.32], [1620, 0.42],
    [1635, 0.08], [1641, 0.0], [1650, 0.28], [1700, 0.28], [1710, 0.12],
  ]);
  return v * (base / 0.3);
}

/** room tone (crickets, air) — only exists in the bedroom */
export function roomVolume(f: number): number {
  return kf(f, [[150, 0], [175, 0.42], [696, 0.42], [704, 0.1], [740, 0.35], [1120, 0.35], [1400, 0.35], [1425, 0]]);
}

/** heartbeat intensity over the film */
export function heartVolume(f: number): number {
  return kf(f, [[0, 0.5], [462, 0.55], [700, 0.95], [800, 1.0], [936, 0.55], [1128, 0.8], [1425, 0.95], [1634, 1.0]]);
}
