# CLAUDE PRODUCTION PACKAGE SPECIFICATION
**Version:** 1.0.0 (Canonical)  
**Compatible Engine:** Antigravity Universal Remotion Engine (`my-video`)  
**Target Format:** 9:16 Vertical Video (1080×1920 @ 30fps) & 16:9 Landscape (1920×1080 @ 30fps)  
**Authoring System:** Claude (External Production Director)  
**Execution System:** Antigravity (Remotion Codebase Manager & CLI Runner)

---

## 1. Package Architecture Overview

A Claude production package is delivered as a single `.zip` file containing all instructions, narrative scripts, scene choreographies, and media assets necessary to produce a broadcast-ready Remotion video.

### ZIP File Structure
```
production_package.zip
├── manifest.json               # [MANDATORY] Master episode metadata & scene sequence
├── audio_schedule.json         # [OPTIONAL / RECOMMENDED] TTS script, timing cues & keywords
├── asset-manifest.json         # [MANDATORY] Asset inventory, file paths, IDs & download guides
├── ASSET_ACQUISITION_GUIDE.md  # [OPTIONAL] Human-readable instructions for manual downloads
└── assets/                     # Media files packaged with the ZIP
    ├── backgrounds/            # Visual image plates (.jpg, .png)
    ├── models/                 # 3D GLB assets (.glb)
    ├── audio/                  # Master voiceover WAV/MP3 (if pre-rendered)
    ├── sfx/                    # Episode-specific sound effects (.wav)
    ├── textures/               # PBR texture maps (.png, .jpg)
    └── fonts/                  # Custom font files (.woff2, .ttf)
```

---

## 2. Specification: `manifest.json`

The `manifest.json` file is the master data contract. It declares the episode container, overall audio and loop settings, and the sequential scene timeline.

### Schema Definition
```json
{
  "episodeId": "string [a-z0-9_] (e.g. ep01_simulation_leak)",
  "title": "string (e.g. THE AUTONOMOUS PROTOTYPE)",
  "fps": "number (default: 30)",
  "width": "number (default: 1080)",
  "height": "number (default: 1920)",
  "durationInFrames": "number (e.g. 900 for 30s @ 30fps)",
  "theme": "string (cyberpunk | analog_horror | police_audit | tech_minimal | neon_noir)",
  "audioTrack": "string (path relative to package or public/, e.g. assets/audio/voiceover.wav)",
  "droneAudioTrack": "string (optional ambient drone, e.g. audio/sfx/drone.wav)",
  "droneVolume": "number (optional, default: 0.25)",
  "enableSeamlessLoop": "boolean (default: true, creates white flash shutter bridge)",
  "loopRewatchPrompt": "string (optional, e.g. ▲ REWATCH: SPOT THE REFLECTION)",
  "scenes": [
    "SceneConfig objects (see Section 4)"
  ]
}
```

---

## 3. Specification: `asset-manifest.json`

Tracks every media dependency. This allows Antigravity to verify which assets are present inside the package, which assets can be reused from the existing library, and which assets must be manually downloaded by the operator.

```json
{
  "episodeId": "ep01_simulation_leak",
  "assets": [
    {
      "id": "bg_control_room",
      "type": "image",
      "required": true,
      "expectedFilename": "control_room.jpg",
      "packagePath": "assets/backgrounds/control_room.jpg",
      "targetRuntimePath": "packages/ep01_simulation_leak/backgrounds/control_room.jpg",
      "description": "Dark cinematic control room with server racks and blue glow",
      "resolution": "1080x1920",
      "sourceUrl": "https://unsplash.com/photos/...",
      "license": "Unsplash Free"
    },
    {
      "id": "model_cyber_vehicle",
      "type": "model",
      "required": true,
      "expectedFilename": "CYBER_CAR.glb",
      "packagePath": "assets/models/CYBER_CAR.glb",
      "targetRuntimePath": "packages/ep01_simulation_leak/models/CYBER_CAR.glb",
      "description": "Low-poly cyberpunk sports coupe with separate wheel nodes",
      "maxPolygons": 120000,
      "sourceUrl": "https://sketchfab.com/3d-models/...",
      "license": "CC-BY-4.0"
    },
    {
      "id": "sfx_camera_shutter",
      "type": "sfx",
      "required": false,
      "reuseExisting": true,
      "existingLibraryPath": "audio/sfx/camera_shutter.wav",
      "description": "High-speed camera shutter click for scene transition"
    }
  ]
}
```

---

## 4. Scene Configuration Specifications

Every scene in `manifest.json` inherits basic timeline properties:
```typescript
{
  "id": "string (unique scene ID)",
  "durationInFrames": "number (duration of this shot, e.g. 180 = 6.0s)",
  "fromFrame": "number (optional; if omitted, computed automatically from cumulative previous scene durations)"
}
```

### Scene Type 1: `dossier`
Used for evidence examination, forensic photos, case files, and anomaly detection.
```json
{
  "type": "dossier",
  "id": "scene_01_hook",
  "durationInFrames": 240,
  "headerPill": "CLASSIFIED EVIDENCE #089",
  "title": "ANOMALY DETECTED",
  "subtitle": "OCTOBER 31 • 02:17 AM",
  "mediaSrc": "assets/backgrounds/exterior.jpg",
  "targetBox": {
    "x": 480,
    "y": 720,
    "w": 280,
    "h": 280,
    "label": "UNIDENTIFIED FIGURE"
  },
  "laserVector": {
    "fromX": 540,
    "fromY": 340,
    "toX": 620,
    "toY": 720,
    "label": "MATCH: 98.4%"
  },
  "stampText": "CORROBORATED"
}
```

### Scene Type 2: `3d_showcase` (or `showcase3d`)
Mounts Three.js via `@remotion/three`, loads a GLB asset, executes procedural camera choreography, and overlays cybernetic telemetry HUDs.
```json
{
  "type": "3d_showcase",
  "id": "scene_02_vehicle",
  "durationInFrames": 360,
  "modelSrc": "assets/models/MUSCLE_CAR.glb",
  "modelType": "muscle_car",
  "cameraMode": "drift",
  "lightingPreset": "cyberpunk",
  "hudOverlay": {
    "title": "TELEMETRY AUDIT",
    "metricLabel": "RPM",
    "metricValue": "8,400",
    "metrics": [
      { "label": "VELOCITY", "value": "142 KM/H" },
      { "label": "G-FORCE", "value": "1.34 G" },
      { "label": "TRACTION", "value": "DRIFT APEX" }
    ]
  }
}
```
* **Supported `cameraMode` options:** `drift`, `turntable`, `drive`, `exploded`, `cyberpunk`
* **Supported `lightingPreset` options:** `cyberpunk`, `noir`, `daylight`, `sunset`, `studio`

### Scene Type 3: `dialogue`
Stages 2D stylized characters with animated breathing, facial expressions, speech bubbles, active speaker highlights, and dynamic camera push-in.
```json
{
  "type": "dialogue",
  "id": "scene_03_argument",
  "durationInFrames": 210,
  "backgroundSrc": "assets/backgrounds/living_room.jpg",
  "activeSpeakerId": "arjun",
  "speechBubbleText": "Did anyone actually see Dev fall?",
  "cameraPush": {
    "fromScale": 1.0,
    "toScale": 1.15,
    "focusX": 540,
    "focusY": 1050
  },
  "characters": [
    {
      "id": "arjun",
      "name": "Arjun",
      "position": { "x": 280, "y": 1050 },
      "facing": "right",
      "expression": "shocked",
      "showFace": true,
      "scale": 1.0
    },
    {
      "id": "rahul",
      "name": "Rahul",
      "position": { "x": 800, "y": 1050 },
      "facing": "left",
      "expression": "angry",
      "showFace": true,
      "scale": 1.0
    }
  ]
}
```
* **Supported Character IDs:** `arjun`, `rahul`, `meera`, `dev`, `nisha`, `kabir`
* **Supported Expressions:** `shocked`, `angry`, `happy`, `determined`, `smug`, `curious`, `cool`, `blank`

### Scene Type 4: `infographic`
Presents data cards, alibi matrices, checklists, and statistical counter grids.
```json
{
  "type": "infographic",
  "id": "scene_04_alibi_audit",
  "durationInFrames": 180,
  "title": "FOUR CONFLICTING ALIBIS",
  "subtitle": "TIMELINE CONTRADICTION FOUND",
  "layout": "grid",
  "items": [
    {
      "id": "rahul_alibi",
      "label": "RAHUL",
      "sublabel": "Saw Dev walk out gate",
      "color": "#4ade80",
      "highlight": false,
      "metric": "IMPOSSIBLE"
    },
    {
      "id": "meera_alibi",
      "label": "MEERA",
      "sublabel": "Claimed Arjun followed",
      "color": "#f472b6",
      "highlight": true,
      "metric": "FLAGGED"
    }
  ]
}
```

---

## 5. Specification: `audio_schedule.json`

If the package does not provide a pre-rendered master audio file, this schedule directs Antigravity's Python TTS engine to synthesize neural dialogue and calculate subtitle timestamps:

```json
{
  "totalDurationSec": 30.0,
  "fps": 30,
  "lines": [
    {
      "startSec": 0.2,
      "text": "Deep inside the simulation, an autonomous prototype was brought to life.",
      "voice": "en-US-BrianMultilingualNeural",
      "rate": "+5%",
      "pitch": "-2Hz",
      "yellowWords": ["SIMULATION", "PROTOTYPE"],
      "redWords": ["AUTONOMOUS"]
    },
    {
      "startSec": 4.5,
      "text": "Built entirely with procedural 3D shaders and deterministic physics.",
      "voice": "en-US-BrianMultilingualNeural",
      "rate": "+6%",
      "pitch": "-2Hz",
      "yellowWords": ["PROCEDURAL", "3D"],
      "redWords": ["PHYSICS."]
    }
  ]
}
```

---

## 6. Execution Lifecycle in Antigravity

When you provide `production_package.zip`:
1. **`python studio.py package production_package.zip`**
2. Antigravity safely extracts files into `public/packages/<episodeId>/`.
3. Validates that all mandatory assets declared in `asset-manifest.json` are present.
4. If assets are missing, outputs the **Asset Acquisition Guide** and stops safely.
5. Ingests or synthesizes audio into `public/packages/<episodeId>/audio/voiceover_master.wav`.
6. Dynamically sets Remotion timeline metadata (`calculateMetadata`).
7. Renders the final MP4 into `output final videos/<episodeId>.mp4`.
8. Extracts the high-CTR thumbnail into `output final videos/<episodeId>_Thumbnail.png`.

