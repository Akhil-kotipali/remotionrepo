export type SfxCue = [number, string, number, number?];

export const CUES_42S: SfxCue[] = [
  // 0.0s (Frame 0): Cold-open shutter release into photograph (Seamless Loop Anchor)
  [0, "camera_shutter", 0.75],
  [0, "whoosh_soft", 0.55],
  [0, "static_burst", 0.3],

  // 4.6s (Frame 138): Four alibis reveal
  [138, "paper_flip", 0.55],
  [138, "whoosh_soft", 0.5],

  // Act 2: Alibis (8.3s - 16.8s)
  [249, "name_tick", 0.5],
  [336, "name_tick", 0.5],
  [423, "name_tick", 0.5],
  [430, "argument_muffled", 0.75],

  // 16.8s (Frame 504): Nisha "Don't touch me!" shout impact
  [504, "shout_burst", 0.95],
  [504, "glitch_hit", 0.85],
  [504, "impact_boom", 0.8],
  [510, "ear_ring", 0.35],

  // 20.4s (Frame 612): Contradiction detected
  [612, "thump_low", 0.8],
  [612, "whoosh", 0.5],

  // 24.3s (Frame 729): Arjun asks the core question
  [729, "thump_low", 0.85],
  [732, "sting_high", 0.45],

  // 27.0s (Frame 810): "Silence. Nobody had." — sub drop, tension riser & heartbeat
  [810, "sub_drop", 0.85],
  [810, "riser", 0.45, 0.75],
  [814, "heartbeat", 0.9],

  // 29.2s (Frame 876): Dev's secret hallway recording reveal
  [876, "rec_beep", 0.7],
  [880, "lens_whir", 0.55],
  [920, "heartbeat", 0.75],

  // 32.8s (Frame 983): Facing the balcony
  [983, "whoosh_soft", 0.5],
  [1010, "heartbeat", 0.75],

  // 35.3s (Frame 1059): Cracked phone & evidence alert
  [1059, "crack_glass", 0.8],
  [1062, "sting_high", 0.55],
  [1064, "glitch_hit", 0.75],

  // 39.2s (Frame 1176): Climax window whip-zoom & seamless loop build
  [1176, "door_creak", 0.65],
  [1178, "wind_night", 0.55],
  [1200, "heartbeat", 0.85],
  [1215, "riser", 0.55, 0.9],
  [1224, "reverse_swell", 0.95],
  [1248, "camera_shutter", 0.9],
];
