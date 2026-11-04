// =====================================================================
//  SOUND CUES — [frame, file (public/audio/sfx/*.wav), volume 0..1, playbackRate?]
// =====================================================================
import {E, kf} from "./math";

export type Cue = [number, string, number, number?];

const steps = (from: number, to: number, every: number, vol: number): Cue[] => {
  const out: Cue[] = [];
  for (let f = from, i = 0; f < to; f += every, i++) out.push([f, "footstep", vol + (i % 2) * 0.05, 0.9 + (i % 3) * 0.06]);
  return out;
};

export const CUES: Cue[] = [
  // --- hook: four friends / one photograph / four different memories ---
  [0, "impact_boom", 0.9],
  [0, "static_burst", 0.65],
  [0, "glitch_hit", 0.75],
  [8, "name_tick", 0.5],
  [16, "name_tick", 0.5],
  [24, "name_tick", 0.5],
  [32, "name_tick", 0.5],
  [50, "whoosh_soft", 0.5],
  [52, "paper_flip", 0.4],
  [93, "whoosh", 0.5],
  [96, "glass_shimmer", 0.5],
  [95, "bubble_pop", 0.5],
  [100, "bubble_pop", 0.5],
  [105, "bubble_pop", 0.5],
  [110, "bubble_pop", 0.5],
  [132, "reverse_swell", 0.8],
  // --- Rahul ---
  [168, "impact_boom", 0.8],
  [175, "whoosh_soft", 0.45],
  ...steps(190, 262, 14, 0.28),
  // --- Meera ---
  [270, "whoosh_soft", 0.45],
  ...steps(278, 330, 14, 0.26),
  // --- Kabir: the muffled argument ---
  [339, "whoosh_soft", 0.45],
  [345, "argument_muffled", 0.75],
  // --- Nisha: "Don't touch me!" ---
  [408, "whoosh_soft", 0.45],
  [432, "reverse_swell", 0.85],
  [468, "shout_burst", 1.0],
  [468, "impact_boom", 0.9],
  [468, "glitch_hit", 0.8],
  [469, "static_burst", 0.5],
  [472, "ear_ring", 0.35],
  [512, "sting_high", 0.4],
  // --- the night branches ---
  [525, "whoosh", 0.5],
  [534, "scan_sweep", 0.45],
  [560, "name_tick", 0.4],
  [568, "name_tick", 0.4],
  [576, "name_tick", 0.4],
  [584, "name_tick", 0.4],
  [590, "impact_boom", 0.5],
  [590, "glitch_hit", 0.5],
  // --- Arjun asks ---
  [618, "thump_low", 0.8],
  [618, "whoosh", 0.4],
  [744, "bubble_pop", 0.6],
  [744, "sting_high", 0.35],
  // --- Silence. Nobody had. ---
  [846, "sub_drop", 0.6],
  [852, "ear_ring", 0.22],
  [870, "scan_sweep", 0.4],
  [900, "glitch_hit", 0.4],
  // --- Meera remembers ---
  [966, "thump_low", 0.8],
  [966, "bubble_pop", 0.6],
  [967, "sting_high", 0.5],
  [1000, "whoosh_soft", 0.5],
  ...steps(1036, 1084, 14, 0.3),
  [1098, "ui_click", 0.35],
  [1108, "rec_beep", 0.7],
  ...steps(1118, 1175, 12, 0.22),
  [1209, "whoosh", 0.5],
  [1209, "lens_whir", 0.5],
  // --- Arjun remembers the phone ---
  [1278, "reverse_swell", 0.85],
  [1296, "thump_low", 0.7],
  [1314, "crack_glass", 1.0],
  [1314, "impact_boom", 0.9],
  [1314, "glitch_hit", 0.6],
  [1330, "glass_shimmer", 0.4],
  [1356, "sting_high", 0.4],
  // --- the house ---
  [1428, "door_creak", 0.8],
  [1428, "thump_low", 0.6],
  [1429, "whoosh", 0.4],
  [1428, "wind_night", 0.5],
  // --- black + end card ---
  [1545, "thump_low", 1.0],
  [1551, "sub_drop", 0.9],
  [1565, "count_tick", 0.45, 0.8],
  [1590, "rec_beep", 0.5],
];

export function bedVolume(f: number): number {
  return kf(f, [
    [0, 0.34], [160, 0.3], [462, 0.26], [466, 0.04], [469, 0.5, E.out], [500, 0.24], [520, 0.26],
    [843, 0.2], [846, 0.0], [900, 0.0], [962, 0.2], [1300, 0.26], [1311, 0.04], [1315, 0.5, E.out],
    [1345, 0.22], [1428, 0.3], [1538, 0.1], [1545, 0.0], [1553, 0.28], [1610, 0.28], [1620, 0.12],
  ]);
}

/** morning ambience in the living room — gone in the silence and in the exterior */
export function roomVolume(f: number): number {
  return kf(f, [[0, 0], [20, 0.3], [525, 0.3], [535, 0.1], [618, 0.1], [630, 0.3], [843, 0.3], [846, 0], [962, 0], [972, 0.3], [1296, 0.3], [1428, 0]]);
}

export function heartVolume(f: number): number {
  return kf(f, [[0, 0.5], [468, 0.9], [525, 0.6], [846, 0.4], [966, 0.7], [1314, 1.0], [1545, 1.0]]);
}
