export type ThemeId =
  | "cyberpunk"
  | "analog_horror"
  | "police_audit"
  | "tech_minimal"
  | "neon_noir";

export type CameraPreset =
  | "orbit"
  | "turntable"
  | "flythrough"
  | "drift"
  | "pan_left"
  | "pan_right"
  | "static";

export type LightingPreset =
  | "cyberpunk"
  | "daylight"
  | "noir"
  | "sunset"
  | "studio";

export interface SfxCueConfig {
  frame: number;
  sound: string;
  volume: number;
  playbackRate?: number;
}

export interface SentenceTiming {
  startSec: number;
  endSec: number;
  text: string;
  speaker?: string;
  yellowWords?: string[];
  redWords?: string[];
}

export interface DossierSceneConfig {
  type: "dossier";
  headerBadge?: string;
  headerPill?: string;
  title: string;
  subtitle?: string;
  mediaPath?: string; // Image in public/
  mediaSrc?: string;  // Alias for mediaPath
  targetLabel?: string;
  targetCoords?: { x: number; y: number; w: number; h: number };
  targetBox?: { x: number; y: number; w: number; h: number; label?: string };
  laserLine?: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    label: string;
  };
  laserVector?: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    label?: string;
  };
  stampText?: string;
}

export interface Showcase3DSceneConfig {
  type: "showcase3d" | "3d_showcase";
  modelType?: "muscle_car" | "glb_file" | "cyber_robot" | string;
  modelPath?: string; // Relative to public/
  modelSrc?: string;  // Alias for modelPath
  mode?: "turntable" | "drive" | "drift" | "exploded" | "cyberpunk";
  cameraMode?: "turntable" | "drive" | "drift" | "exploded" | "cyberpunk"; // Alias for mode
  cameraPreset?: CameraPreset;
  lightingPreset?: LightingPreset;
  hudTitle?: string;
  hudMetrics?: { label: string; value: string }[];
  hudOverlay?: {
    title?: string;
    metricLabel?: string;
    metricValue?: string;
    metrics?: { label: string; value: string }[];
  };
}

export interface DialogueCharacter {
  id: "arjun" | "rahul" | "meera" | "dev" | "nisha" | "kabir" | string;
  name?: string;
  color?: string;
  position?: { x: number; y: number };
  x?: number;
  y?: number;
  scale?: number;
  facing?: "left" | "right";
  pose?: "signature" | "photoReady" | "holdingCamera" | "takingPhoto" | "wave";
  showFace?: boolean;
  isSpeaking?: boolean;
  speechBubble?: string;
  expression?:
    | "blank"
    | "happy"
    | "angry"
    | "determined"
    | "smug"
    | "shocked"
    | "curious"
    | "cool";
}

export interface DialogueSceneConfig {
  type: "dialogue";
  backgroundPlate?: string;
  backgroundSrc?: string; // Alias for backgroundPlate
  characters: DialogueCharacter[];
  activeSpeakerId?: string;
  speechBubbleText?: string;
  cameraPush?: {
    fromScale: number;
    toScale: number;
    focusX?: number;
    focusY?: number;
  };
}

export interface InfographicItem {
  id: string;
  label: string;
  sublabel: string;
  color: string;
  highlight?: boolean;
  metric?: string;
}

export interface InfographicSceneConfig {
  type: "infographic";
  title: string;
  subtitle?: string;
  items: InfographicItem[];
  layout?: "grid" | "vertical_cards" | "tab_bar";
}

export interface MirrorHorrorSceneConfig {
  type: "mirror_horror";
  headerPill?: string;
  title?: string;
  subtitle?: string;
  backgroundSrc?: string;
  backgroundPlate?: string;
  realCharacter?: {
    id: string;
    position?: { x: number; y: number };
    scale?: number;
    facing?: "left" | "right";
    pose?: "idle" | "walking_away" | "frozen" | "stepping_back" | string;
    emotion?: string;
  };
  reflectionCharacter?: {
    id: string;
    position?: { x: number; y: number };
    scale?: number;
    facing?: "left" | "right";
    pose?: "idle" | "delayed_turn" | "creepy_smile" | "knocking_glass" | "pressing_glass" | string;
    emotion?: string;
    knockingFrames?: number[];
    whisperSubtext?: string;
  };
  mirrorFrame?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  cameraMotion?: {
    fromScale: number;
    toScale: number;
    fromY?: number;
    toY?: number;
  };
}

export type SceneConfig = {
  id: string;
  fromFrame?: number;
  durationFrames?: number;
  durationInFrames?: number;
} & (
  | DossierSceneConfig
  | Showcase3DSceneConfig
  | DialogueSceneConfig
  | InfographicSceneConfig
  | MirrorHorrorSceneConfig
);

export interface EpisodeConfig {
  id: string;
  title: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  totalDurationInFrames?: number; // Alias
  theme: ThemeId;
  voiceoverAudioPath?: string;
  audioTrack?: string; // Alias
  droneAudioPath?: string;
  droneAudioTrack?: string; // Alias
  droneVolume?: number;
  enableSeamlessLoop?: boolean; // Adds the white flash camera shutter loop bridge
  loopRewatchPrompt?: string;   // e.g. "▲ REWATCH: CHECK THE REFLECTION"
  sentences: SentenceTiming[];
  sfxCues: SfxCueConfig[];
  scenes: SceneConfig[];
}
