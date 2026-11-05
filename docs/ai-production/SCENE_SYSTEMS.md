# SCENE & TIMELINE ORCHESTRATION

This document provides complete implementation details for each of the 5 universal scene primitives supported by the Remotion engine, explaining how scenes are sequenced, parameterized, and rendered.

---

## 1. Scene Sequencing Architecture

Every episode is composed of discrete scenes arranged along the Remotion timeline. Each scene implements `SceneConfig`:

```ts
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
```

If `fromFrame` is omitted, the engine automatically calculates `fromFrame` as the cumulative sum of all preceding scene durations.

---

## 2. Primitive 1: Dossier Scene (`DossierSceneConfig`)

- **Component:** `src/engine/scenes/DossierScene.tsx`
- **Purpose:** Crime investigations, forensic analysis, classified documents, evidence exhibits.
- **Visuals:** Dark background plate, targeting reticle box, laser pointer line with millimeter coordinates, animated classified rubber stamp.

### Configuration Schema
```json
{
  "id": "scene_01_dossier",
  "type": "dossier",
  "durationInFrames": 120,
  "headerPill": "FORENSIC EVIDENCE #104",
  "title": "SUBJECT LAST SEEN AT MIDNIGHT",
  "subtitle": "Security Camera Stills - Corridor 4",
  "mediaPath": "backgrounds/hallway.jpg",
  "targetBox": {
    "x": 340,
    "y": 620,
    "w": 400,
    "h": 500,
    "label": "ANOMALOUS ENTITY DETECTED"
  },
  "laserVector": {
    "fromX": 100,
    "fromY": 200,
    "toX": 540,
    "toY": 870,
    "label": "POINT OF ORIGIN: 23.4m"
  },
  "stampText": "DEEP VOID CONFIRMED"
}
```

---

## 3. Primitive 2: 3D Showcase Scene (`Showcase3DSceneConfig`)

- **Component:** `src/engine/scenes/Showcase3DScene.tsx`
- **Purpose:** 3D vehicle showcases, product walk-arounds, animated cyber robots.
- **Visuals:** Full Three.js canvas, studio lighting presets, metallic materials, digital telemetry HUD overlay.

### Configuration Schema
```json
{
  "id": "scene_02_car_turntable",
  "type": "showcase3d",
  "durationInFrames": 180,
  "modelType": "muscle_car",
  "modelPath": "models/MUSCLE_CAR.glb",
  "cameraMode": "turntable",
  "lightingPreset": "cyberpunk",
  "hudTitle": "V8 INTERCEPTOR TELEMETRY",
  "hudMetrics": [
    { "label": "HORSEPOWER", "value": "780 BHP" },
    { "label": "TOP SPEED", "value": "204 MPH" },
    { "label": "0-60 MPH", "value": "3.1 SEC" }
  ]
}
```

---

## 4. Primitive 3: Dialogue Scene (`DialogueSceneConfig`)

- **Component:** `src/engine/scenes/DialogueScene.tsx`
- **Purpose:** Conversations between 2 or more procedural characters.
- **Visuals:** Photographic background plate, character rigs with emotion and pose states, center push-in camera, animated speech bubble pointing to active speaker.

### Configuration Schema
```json
{
  "id": "scene_03_investigation_dialogue",
  "type": "dialogue",
  "durationInFrames": 150,
  "backgroundPlate": "backgrounds/living_room.jpg",
  "activeSpeakerId": "arjun",
  "speechBubbleText": "Wait... look at the mirror behind you.",
  "cameraPush": {
    "fromScale": 1.0,
    "toScale": 1.15
  },
  "characters": [
    {
      "id": "arjun",
      "position": { "x": 360, "y": 1400 },
      "scale": 1.25,
      "facing": "right",
      "pose": "signature",
      "expression": "shocked"
    },
    {
      "id": "dev",
      "position": { "x": 720, "y": 1420 },
      "scale": 1.20,
      "facing": "left",
      "pose": "photoReady",
      "expression": "curious"
    }
  ]
}
```

---

## 5. Primitive 4: Infographic Scene (`InfographicSceneConfig`)

- **Component:** `src/engine/scenes/InfographicScene.tsx`
- **Purpose:** Technical statistics, historical comparisons, data analytics.
- **Visuals:** Animated card layouts (`"grid"`, `"vertical_cards"`), progress bars, highlighted metrics.

### Configuration Schema
```json
{
  "id": "scene_04_stats",
  "type": "infographic",
  "durationInFrames": 120,
  "title": "ENGINEERING ANOMALIES",
  "subtitle": "Structural Weight vs Lifting Capacity",
  "layout": "vertical_cards",
  "items": [
    {
      "id": "metric_1",
      "label": "Kumbam Apex Stone",
      "sublabel": "Granite Monolith",
      "metric": "80 TONS",
      "color": "#eab308",
      "highlight": true
    },
    {
      "id": "metric_2",
      "label": "Ramp Gradient",
      "sublabel": "Required Incline Length",
      "metric": "6.0 KM",
      "color": "#38bdf8"
    }
  ]
}
```

---

## 6. Primitive 5: Mirror Horror Scene (`MirrorHorrorSceneConfig`)

- **Component:** `src/engine/scenes/MirrorHorrorScene.tsx`
- **Purpose:** Psychological horror impossible scenarios, doppleganger anomalies, paranormal suspense.
- **Visuals:** Physical room background with dark ambient downlighting, beveled mirror frame with metallic sheen, horizontally mirrored interior reflection space, glass condensation vignette, radial glass fracture/stress SVG decals, camera shake on knock frames (`decay = Math.exp(-delta * 0.35)`), chromatic aberration flicker, decoupled real/reflection choreography, and subliminal whisper text overlay.

### Configuration Schema
```json
{
  "id": "scene_05_mirror_twist",
  "type": "mirror_horror",
  "durationInFrames": 240,
  "headerPill": "BIOMETRIC DESYNC DETECTED",
  "backgroundSrc": "backgrounds/living_room.jpg",
  "realCharacter": {
    "id": "arjun",
    "position": { "x": 380, "y": 1640 },
    "scale": 1.38,
    "facing": "right",
    "pose": "standingFrozen",
    "emotion": "frozenTerror"
  },
  "reflectionCharacter": {
    "id": "reflection",
    "position": { "x": 540, "y": 1250 },
    "scale": 1.15,
    "facing": "right",
    "pose": "knocking_glass",
    "emotion": "creepySmile",
    "knockingFrames": [35, 95, 155],
    "whisperSubtext": "DON'T LEAVE ME HERE"
  },
  "mirrorFrame": {
    "x": 120,
    "y": 240,
    "w": 840,
    "h": 1240
  },
  "cameraMotion": {
    "fromScale": 1.20,
    "toScale": 1.35,
    "fromY": -50,
    "toY": -75
  }
}
```
