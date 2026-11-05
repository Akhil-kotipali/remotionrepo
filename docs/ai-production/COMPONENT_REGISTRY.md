# COMPONENT REGISTRY: REUSABLE PRODUCTION COMPONENTS

This document catalogs all reusable React and Remotion components in the repository. Every entry contains exact file paths, exported names, required props, TypeScript interfaces, and verified implementation statuses.

---

## 1. Engine & Timeline Components

### 1.1 `UniversalEpisode`
- **File:** `src/engine/UniversalEpisode.tsx`
- **Export:** `export const UniversalEpisode: React.FC<{ config: EpisodeConfig }>`
- **Status:** Verified Implemented & In Active Use
- **Purpose:** Master conductor component. Reads `EpisodeConfig`, arranges scenes into `<Sequence>` blocks, mixes voiceover + drone + SFX audio layers, mounts kinetic captions, and renders the camera flash loop bridge.
- **Dependencies:** `remotion`, `./UniversalCaptions`, `./scenes/*`, `./types`
- **Props:**
  - `config: EpisodeConfig` (Required): Full episode configuration object.
- **Example Usage:**
  ```tsx
  import { UniversalEpisode } from "./engine/UniversalEpisode";
  import { SAMPLE_ENGINE_EPISODE } from "./engine/sampleEpisodeConfig";
  
  export const MyVideo = () => <UniversalEpisode config={SAMPLE_ENGINE_EPISODE} />;
  ```

---

### 1.2 `UniversalCaptions`
- **File:** `src/engine/UniversalCaptions.tsx`
- **Export:** `export const UniversalCaptions: React.FC<UniversalCaptionsProps>`
- **Status:** Verified Implemented & In Active Use
- **Purpose:** High-impact kinetic subtitle overlay. Splits narration sentences into 3-4 word balanced chunks and highlights keywords in golden yellow (`#eab308`) or crimson alert (`#ef4444`).
- **Dependencies:** `remotion`, `./types`
- **Props:**
  - `sentences: SentenceTiming[]` (Required): Array of timed dialogue lines.
  - `fps?: number` (Optional, default `30`): Video framerate.
  - `topY?: number` (Optional, default `1260`): Vertical screen coordinate for captions.
- **Example Usage:**
  ```tsx
  <UniversalCaptions
    sentences={[
      {
        startSec: 0.2,
        endSec: 2.5,
        text: "Your reflection isn't supposed to move after you leave.",
        yellowWords: ["REFLECTION", "MOVE", "LEAVE"],
      }
    ]}
    fps={30}
    topY={1300}
  />
  ```

---

## 2. Universal Scene Primitives (`src/engine/scenes/`)

### 2.1 `DossierScene`
- **File:** `src/engine/scenes/DossierScene.tsx`
- **Export:** `export const DossierScene: React.FC<{ config: DossierSceneConfig }>`
- **Status:** Verified Implemented
- **Purpose:** Classified investigation board. Displays an image plate with targeting reticle, laser vector coordinates, header badge, and animated red rubber stamp.
- **Props:**
  - `config.title: string` (Required)
  - `config.mediaPath?: string` (Optional): Relative image path (e.g. `backgrounds/exterior.jpg`)
  - `config.targetBox?: { x: number; y: number; w: number; h: number; label?: string }`
  - `config.laserVector?: { fromX: number; fromY: number; toX: number; toY: number; label?: string }`
  - `config.stampText?: string` (e.g. `"CONFIRMED ANOMALY"`)

---

### 2.2 `Showcase3DScene`
- **File:** `src/engine/scenes/Showcase3DScene.tsx`
- **Export:** `export const Showcase3DScene: React.FC<{ config: Showcase3DSceneConfig }>`
- **Status:** Verified Implemented
- **Purpose:** 3D model showcase inside `@remotion/three`. Supports procedural vehicle turntable and animated cyber robot reacting to speech.
- **Props:**
  - `config.modelType?: "muscle_car" | "glb_file" | "cyber_robot"`
  - `config.cameraMode?: "turntable" | "drive" | "drift" | "exploded" | "cyberpunk"`
  - `config.hudTitle?: string`
  - `config.hudMetrics?: { label: string; value: string }[]`

---

### 2.3 `DialogueScene`
- **File:** `src/engine/scenes/DialogueScene.tsx`
- **Export:** `export const DialogueScene: React.FC<{ config: DialogueSceneConfig }>`
- **Status:** Verified Implemented
- **Purpose:** Multi-character conversational scene. Places 2D rigged characters over a background plate with camera push-in and animated speech bubble.
- **Props:**
  - `config.backgroundPlate?: string` (e.g. `backgrounds/living_room.jpg`)
  - `config.characters: DialogueCharacter[]` (Array of rigged character configs)
  - `config.activeSpeakerId?: string` (Character ID who is speaking)
  - `config.speechBubbleText?: string` (Speech bubble text)
  - `config.cameraPush?: { fromScale: number; toScale: number }`

---

### 2.4 `InfographicScene`
- **File:** `src/engine/scenes/InfographicScene.tsx`
- **Export:** `export const InfographicScene: React.FC<{ config: InfographicSceneConfig }>`
- **Status:** Verified Implemented
- **Purpose:** Data visualization. Renders dynamic animated stat cards, comparison bars, and percentage metrics.
- **Props:**
  - `config.title: string`
  - `config.items: InfographicItem[]` (`id`, `label`, `sublabel`, `color`, `metric`, `highlight`)
  - `config.layout?: "grid" | "vertical_cards" | "tab_bar"`

---

### 2.5 `MirrorHorrorScene`
- **File:** `src/engine/scenes/MirrorHorrorScene.tsx`
- **Export:** `export const MirrorHorrorScene: React.FC<{ config: MirrorHorrorSceneConfig }>`
- **Status:** Verified Implemented & Render-Tested
- **Purpose:** Psychological horror impossible scenario. Renders a physical room, beveled mirror frame, decoupled interior reflection entity, glass fracture decals, camera shake on knock frames, and whisper overlay.
- **Props:**
  - `config.backgroundSrc?: string`
  - `config.headerPill?: string` (e.g. `"ANOMALY AUDIT • MIRROR #04"`)
  - `config.realCharacter?: { id: string; position: {x, y}; pose: string; emotion: string }`
  - `config.reflectionCharacter?: { id: string; position: {x, y}; pose: string; emotion: string; knockingFrames?: number[]; whisperSubtext?: string }`
  - `config.mirrorFrame?: { x: number; y: number; w: number; h: number }`
  - `config.cameraMotion?: { fromScale: number; toScale: number; fromY?: number; toY?: number }`

---

## 3. Character Components

### 3.1 `Character` (Procedural SVG Rig)
- **File:** `src/characters/Character.tsx`
- **Export:** `export const Character: React.FC<CharacterProps>`
- **Status:** Verified Implemented
- **Purpose:** Complete procedural 2D character with idle breathing, head tilt, eye gaze, modular facial emotions, and kinematic arm poses.
- **Props (`CharacterProps`):**
  - `id: "arjun" | "dev" | "rahul" | "meera" | "kabir" | "nisha" | "reflection"` (Required)
  - `emotion?: Emotion` (`"neutral"`, `"worried"`, `"angry"`, `"sad"`, `"scared"`, `"relieved"`, `"happy"`, `"creepySmile"`, `"hollowScared"`, `"frozenTerror"`)
  - `pose?: Pose` (`"idle"`, `"walking"`, `"talking"`, `"phone"`, `"camera"`, `"armsCrossed"`, `"knocking"`, `"pressingGlass"`, `"standingFrozen"`)
  - `view?: View` (`"front"`, `"threeQuarter"`, `"side"`, `"back"`)
  - `gaze?: Gaze` (`"center"`, `"left"`, `"right"`, `"up"`, `"down"`)
  - `facing?: "left" | "right"`
  - `width?: number`, `height?: number`
  - `animate?: boolean` (Default `true`)

---

### 3.2 `FriendStickFigure` & `StickFigure`
- **Files:** `src/stick/FriendStickFigure.tsx`, `src/stick/StickFigure.tsx`
- **Exports:** `export const FriendStickFigure: React.FC<FriendStickFigureProps>`, `export const StickFigure: React.FC<StickFigureProps>`
- **Status:** Verified Implemented
- **Purpose:** Stylized dynamic stick figures with 3D tubular lighting gradient, modular hair, glasses, phones, and expression states.
- **Supported Poses:** `"signature"`, `"idle"`, `"crossed"`, `"handsOnHip"`, `"cheer"`, `"listen"`, `"walking"`, `"running"`, `"combat"`
- **Supported Expressions:** `"blank"`, `"happy"`, `"angry"`, `"determined"`, `"smug"`, `"shocked"`, `"curious"`, `"cool"`

---

## 4. 3D & WebGL Components (`@remotion/three` & `@react-three/drei`)

### 4.1 `GLBModelLoader`
- **File:** `src/components/GLBModelLoader.tsx`
- **Export:** `export const GLBModelLoader: React.FC<GLBModelProps>`
- **Status:** Verified Implemented
- **Purpose:** Frame-accurate deterministic GLB / GLTF model loader using `useGLTF` and `useAnimations`.
- **Props:**
  - `modelPath: string` (e.g. `staticFile("models/character.glb")`)
  - `animationName?: string` (Optional animation clip to play)
  - `position?: [number, number, number]`
  - `scale?: number | [number, number, number]`
  - `rotation?: [number, number, number]`

---

### 4.2 `MuscleCarRig`
- **File:** `src/car/MuscleCarRig.tsx`
- **Export:** `export const MuscleCarRig: React.FC<MuscleCarRigProps>`
- **Status:** Verified Implemented
- **Purpose:** High-detail 3D car rig with active front-wheel steering, 4-wheel rotation, body suspension roll, and exploded schematic part separation.
- **Props:**
  - `steerAngle?: number` (Radians)
  - `wheelRotation?: number` (Radians)
  - `bodyRoll?: number` (Radians)
  - `explodeFactor?: number` (0 = assembled, 1 = exploded schematic)

---

## 5. Visual Effects & Overlays (`src/part3/fx/Overlays.tsx`)

| Component | Export | Purpose | Key Props |
|---|---|---|---|
| `Grain` | `export const Grain` | Cycling 6-tile 15fps film grain | `opacity?: number` (default `0.16`) |
| `Vignette` | `export const Vignette` | Pulsing heartbeat vignette | None (driven by `heartbeatFrames`) |
| `ColorWash` | `export const ColorWash` | Cold desaturation & red alert pulses | None (driven by timeline keyframes) |
| `GlitchBurst` | `export const GlitchBurst` | Multi-slice horizontal screen glitch | `at: number, len?: number, power?: number` |
| `HitFlash` | `export const HitFlash` | High-contrast kinetic impact flash | None (reacts to major hit frames) |
