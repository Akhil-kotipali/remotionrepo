# API REFERENCE & TYPESCRIPT INTERFACES

This document lists the exact TypeScript definitions, interfaces, configuration props, and CLI flags used across the Remotion video engine.

---

## 1. Engine Interfaces (`src/engine/types.ts`)

### 1.1 `EpisodeConfig`
The top-level configuration object consumed by `UniversalEpisode.tsx` and `PackageEpisode`:

```ts
export interface EpisodeConfig {
  id: string;                                 // Unique episode ID (alphanumeric + underscores)
  title: string;                              // Human-readable title
  fps: number;                                // Framerate (typically 30)
  width: number;                              // Canvas width (typically 1080)
  height: number;                             // Canvas height (typically 1920)
  durationInFrames: number;                   // Total composition length in frames
  totalDurationInFrames?: number;             // Alias for durationInFrames
  theme: ThemeId;                             // Visual theme palette
  voiceoverAudioPath?: string;                // Relative path in public/ (e.g. packages/<id>/audio/voiceover.wav)
  audioTrack?: string;                        // Alias for voiceoverAudioPath
  droneAudioPath?: string;                    // Relative path for background ambient drone
  droneAudioTrack?: string;                   // Alias for droneAudioPath
  droneVolume?: number;                       // Drone audio volume multiplier (0.0 to 1.0, default 0.25)
  enableSeamlessLoop?: boolean;               // Enables 12-frame white camera shutter loop bridge
  loopRewatchPrompt?: string;                 // Text prompt displayed on final 45 frames (e.g. "▲ REWATCH")
  sentences: SentenceTiming[];                // Array of timed dialogue lines for UniversalCaptions
  sfxCues: SfxCueConfig[];                    // Array of sound effect triggers on specific frame numbers
  scenes: SceneConfig[];                      // Sequential array of scene configurations
}
```

---

### 1.2 `ThemeId`
```ts
export type ThemeId =
  | "cyberpunk"
  | "analog_horror"
  | "police_audit"
  | "tech_minimal"
  | "neon_noir";
```

---

### 1.3 `SfxCueConfig`
```ts
export interface SfxCueConfig {
  frame: number;                              // Absolute video frame number to trigger sound
  sound: string;                              // Relative path in public/ (e.g. audio/sfx/crack_glass.wav)
  volume: number;                             // Volume multiplier (0.0 to 1.0)
  playbackRate?: number;                      // Pitch/speed multiplier (0.5 to 2.0, default 1.0)
}
```

---

### 1.4 `SentenceTiming`
```ts
export interface SentenceTiming {
  startSec: number;                           // Spoken start timestamp in floating seconds
  endSec: number;                             // Spoken end timestamp in floating seconds
  text: string;                               // Dialogue text string
  speaker?: string;                           // Character ID speaking the line
  yellowWords?: string[];                     // Array of uppercase words to highlight in yellow
  redWords?: string[];                        // Array of uppercase words to highlight in red
}
```

---

### 1.5 Scene Configuration Types (`SceneConfig`)
```ts
export type SceneConfig = {
  id: string;
  fromFrame?: number;                         // Optional start frame (auto-calculated if omitted)
  durationFrames?: number;                    // Scene duration in frames
  durationInFrames?: number;                  // Alias for durationFrames
} & (
  | DossierSceneConfig
  | Showcase3DSceneConfig
  | DialogueSceneConfig
  | InfographicSceneConfig
  | MirrorHorrorSceneConfig
);
```

#### `DossierSceneConfig`
```ts
export interface DossierSceneConfig {
  type: "dossier";
  headerBadge?: string;
  headerPill?: string;
  title: string;
  subtitle?: string;
  mediaPath?: string;
  mediaSrc?: string;
  targetBox?: { x: number; y: number; w: number; h: number; label?: string };
  laserVector?: { fromX: number; fromY: number; toX: number; toY: number; label?: string };
  stampText?: string;
}
```

#### `Showcase3DSceneConfig`
```ts
export interface Showcase3DSceneConfig {
  type: "showcase3d" | "3d_showcase";
  modelType?: "muscle_car" | "glb_file" | "cyber_robot" | string;
  modelPath?: string;
  modelSrc?: string;
  mode?: "turntable" | "drive" | "drift" | "exploded" | "cyberpunk";
  cameraMode?: "turntable" | "drive" | "drift" | "exploded" | "cyberpunk";
  cameraPreset?: CameraPreset;
  lightingPreset?: LightingPreset;
  hudTitle?: string;
  hudMetrics?: { label: string; value: string }[];
}
```

#### `DialogueSceneConfig`
```ts
export interface DialogueSceneConfig {
  type: "dialogue";
  backgroundPlate?: string;
  backgroundSrc?: string;
  characters: DialogueCharacter[];
  activeSpeakerId?: string;
  speechBubbleText?: string;
  cameraPush?: { fromScale: number; toScale: number; focusX?: number; focusY?: number };
}
```

#### `InfographicSceneConfig`
```ts
export interface InfographicSceneConfig {
  type: "infographic";
  title: string;
  subtitle?: string;
  items: InfographicItem[];
  layout?: "grid" | "vertical_cards" | "tab_bar";
}
```

#### `MirrorHorrorSceneConfig`
```ts
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
  mirrorFrame?: { x: number; y: number; w: number; h: number };
  cameraMotion?: { fromScale: number; toScale: number; fromY?: number; toY?: number };
}
```

---

## 2. Character System Interfaces (`src/characters/types.ts`)

```ts
export type CharacterId = "arjun" | "dev" | "rahul" | "meera" | "kabir" | "nisha" | "reflection";

export type Emotion =
  | "neutral"
  | "worried"
  | "angry"
  | "sad"
  | "scared"
  | "relieved"
  | "happy"
  | "creepySmile"
  | "hollowScared"
  | "frozenTerror";

export type Pose =
  | "idle"
  | "walking"
  | "talking"
  | "phone"
  | "camera"
  | "armsCrossed"
  | "knocking"
  | "pressingGlass"
  | "standingFrozen";

export type View = "front" | "threeQuarter" | "side" | "back";
export type Gaze = "center" | "left" | "right" | "up" | "down";

export interface CharacterProps {
  id: CharacterId;
  emotion?: Emotion;
  pose?: Pose;
  view?: View;
  gaze?: Gaze;
  facing?: "left" | "right";
  width?: number;
  height?: number;
  frame?: number;
  animate?: boolean;
  animationOffset?: number;
  className?: string;
  style?: React.CSSProperties;
}
```

---

## 3. Studio CLI Reference (`studio.py`)

| Command | Arguments | Flags | Description |
|---|---|---|---|
| `package` | `<zip_path>` | `--force`, `--skip-audio`, `--skip-render`, `--preview`, `--thumb-frame` | Complete ingestion & render |
| `import` | `<zip_path>` | `--force`, `--skip-audio` | Unpack & validate without rendering |
| `assets` | `<episode_id>` | None | Audit & resolve asset availability |
| `render` | `<comp_id>` | `--output`, `--props` | Render registered composition |
| `still` | `<comp_id>` | `--output`, `--frame`, `--props` | Render single still frame |
| `report` | `<episode_id>` | None | Display production summary JSON |
| `audit` | None | None | Health check of project dependencies |
