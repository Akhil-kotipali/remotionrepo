export type SfxCue = [number, string, number, number?];

export const CUES_VIRAL: SfxCue[] = [
  // 0.0s (Frame 0): Cold-open shock impact
  [0, "impact_boom", 0.95],
  [0, "static_burst", 0.7],
  [0, "glitch_hit", 0.8],

  // 1.5s (Frame 45): One photograph reveal
  [45, "paper_flip", 0.55],
  [45, "whoosh_soft", 0.5],

  // 3.9s - 7.5s (Frames 117 - 225): Rapid testimonies
  [117, "name_tick", 0.5],
  [168, "name_tick", 0.5],
  [225, "name_tick", 0.5],
  [228, "argument_muffled", 0.75],

  // 9.1s (Frame 273): Nisha "Don't touch me!" shout impact
  [273, "shout_burst", 0.95],
  [273, "glitch_hit", 0.85],
  [273, "impact_boom", 0.8],
  [280, "ear_ring", 0.35],

  // 12.4s (Frame 372): Arjun's unanswerable question
  [372, "thump_low", 0.8],
  [372, "whoosh", 0.5],

  // 15.0s (Frame 450): "Nobody had." — heartbeat stops, sub-drop
  [450, "sub_drop", 0.75],
  [452, "heartbeat", 0.85],

  // 16.6s (Frame 498): Dev's secret hallway recording reveal
  [498, "rec_beep", 0.7],
  [502, "lens_whir", 0.55],
  [540, "heartbeat", 0.8],

  // 20.3s (Frame 609): Cracked phone & abandoned house
  [609, "crack_glass", 0.75],
  [612, "sting_high", 0.5],

  // 23.8s (Frame 714): The house exterior in fog
  [714, "door_creak", 0.65],
  [716, "wind_night", 0.55],

  // 24.2s (Frame 726): "Look at the window again..."
  [726, "reverse_swell", 0.9],
  [740, "heartbeat", 0.85],
];

