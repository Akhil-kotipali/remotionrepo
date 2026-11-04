// =====================================================================
//  SOUND CUES — [frame, file (public/audio/sfx/*.wav), volume 0..1, playbackRate?]
// =====================================================================
import {FOOTSTEPS, PHOTO_WINDOWS} from "./config";
import {E, kf} from "./math";

export type Cue = [number, string, number, number?];

export const CUES: Cue[] = [
  // --- viral hook: millisecond 0 shutter snap + sub drop impact ---
  [0, "camera_shutter", 1.0],
  [0, "sub_drop", 0.95],
  [0, "glitch_hit", 0.7],
  [0, "static_burst", 0.6],
  [52, "count_tick", 0.7, 1.0],
  [60, "count_tick", 0.7, 1.12],
  [68, "count_tick", 0.7, 1.26],
  [76, "count_tick", 0.7, 1.41],
  [84, "count_tick", 0.75, 1.59],
  [96, "sting_high", 0.65],
  [96, "glitch_hit", 0.6],
  [96, "glass_shimmer", 0.55],
  [96, "sub_drop", 0.75],
  [104, "reverse_swell", 0.7],
  // --- smash cut into the living room (next morning) ---
  [135, "impact_boom", 0.8],
  [135, "whoosh", 0.5],
  [136, "glitch_hit", 0.45],
  ...FOOTSTEPS.map((f, i): Cue => [f, "footstep", 0.34 + (i % 2) * 0.06, 0.92 + (i % 3) * 0.05]),
  [160, "name_tick", 0.4],
  [210, "name_tick", 0.5],
  [222, "name_tick", 0.5],
  [234, "name_tick", 0.5],
  [245, "name_tick", 0.5],
  // --- photo comes up: "taken the night Dev died" ---
  [252, "whoosh_soft", 0.5],
  [255, "paper_flip", 0.5],
  [262, "sting_high", 0.3],
  // --- five friends visible ---
  [324, "count_tick", 0.6, 1.0],
  [333, "count_tick", 0.6, 1.12],
  [342, "count_tick", 0.6, 1.26],
  [351, "count_tick", 0.6, 1.41],
  [360, "count_tick", 0.65, 1.59],
  // --- Meera takes the picture ---
  [366, "whoosh_soft", 0.4],
  [392, "ui_click", 0.4],
  [403, "camera_shutter", 1.0],
  // --- the magnifier ---
  [468, "lens_whir", 0.6],
  [508, "whoosh_soft", 0.45],
  [524, "ui_click", 0.35],
  [531, "reverse_swell", 0.8],
  // --- the sixth figure ---
  [567, "impact_boom", 0.9],
  [567, "glass_shimmer", 0.7],
  [568, "glitch_hit", 0.6],
  [600, "sting_high", 0.35],
  // --- back in the room ---
  [666, "thump_low", 0.8],
  [666, "whoosh", 0.4],
  [672, "bubble_pop", 0.45],
  [684, "bubble_pop", 0.45],
  [696, "bubble_pop", 0.45],
  [708, "bubble_pop", 0.45],
  [746, "bubble_pop", 0.5],
  [812, "bubble_pop", 0.55],
  [850, "bubble_pop", 0.4],
  [905, "riser", 0.5],
  [940, "bubble_pop", 0.6],
  [940, "sting_high", 0.4],
  // --- analysis ---
  [1014, "thump_low", 0.8],
  [1014, "glitch_hit", 0.5],
  [1050, "whoosh", 0.5],
  [1053, "scan_sweep", 0.5],
  [1068, "match_beep", 0.4],
  [1090, "match_beep", 0.4, 1.12],
  [1120, "match_beep", 0.45],
  [1150, "match_beep", 0.45, 1.26],
  [1167, "thump_low", 0.6],
  [1209, "whoosh_soft", 0.5],
  [1236, "impact_boom", 0.6],
  [1238, "match_beep", 0.6, 1.5],
  // --- flip the photograph ---
  [1260, "reverse_swell", 0.8],
  [1266, "paper_flip", 0.9],
  [1296, "impact_boom", 0.9],
  [1297, "thump_low", 0.6],
  // --- the handwriting in eerie silence ---
  [1354, "marker_write", 1.0],
  [1434, "scan_sweep", 0.55],
  [1444, "match_beep", 0.55],
  // --- no memory of doing so → blackout loop whisper ---
  [1530, "riser", 0.6],
  [1557, "thump_low", 0.9],
  [1557, "glitch_hit", 0.5],
  [1635, "sub_drop", 0.95],
  [1638, "impact_boom", 0.9],
  [1641, "thump_low", 1.0],
  [1641, "glitch_hit", 0.7],
  [1655, "count_tick", 0.45, 0.8],
  [1690, "glitch_hit", 0.35],
];

export function bedVolume(f: number): number {
  return kf(f, [
    [0, 0.34], [135, 0.3], [560, 0.26], [565, 0.04], [568, 0.5, E.out], [600, 0.24],
    [900, 0.26],
    // Silence dip during forensic match:
    [1180, 0.24], [1195, 0.06], [1236, 0.06], [1242, 0.45, E.out], [1255, 0.22],
    // Silence dip during marker writing:
    [1290, 0.22], [1294, 0.04], [1297, 0.45, E.out], [1340, 0.2],
    [1350, 0.05], [1428, 0.05], [1435, 0.28],
    [1530, 0.3], [1620, 0.42], [1635, 0.08], [1641, 0.0], [1650, 0.28], [1700, 0.28], [1710, 0.12],
  ]);
}

/** morning ambience (birds / distant street / fan) — only in the living room */
export function roomVolume(f: number): number {
  const inPhoto = PHOTO_WINDOWS.some(([a, b]) => f >= a && f <= b);
  const base = kf(f, [[135, 0], [160, 0.5], [1620, 0.5], [1641, 0]]);
  return base * (inPhoto ? 0.18 : 1);
}

export function heartVolume(f: number): number {
  return kf(f, [[0, 0.5], [468, 0.6], [567, 0.9], [666, 0.6], [936, 0.9], [1296, 0.7], [1557, 1.0], [1634, 1.0]]);
}
