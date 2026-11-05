# REPOSITORY MAP & CODEBASE TOPOLOGY

This document maps the entire repository directory structure, source files, and operational boundaries of the Remotion video production engine.

---

## 1. Top-Level Directory Tree

```
my-video/
├── .gitignore                   # Excludes node_modules, out/, *.mp4, *.png, *.jpg, packages/, tmp_*
├── package.json                 # Node 19.2.3, Remotion 4.0.539, Three.js 0.186, Tailwind v4
├── remotion.config.ts           # Rspack, ANGLE D3D11 GPU, Concurrency=4, H.264, yuv420p
├── tsconfig.json                # Strict TypeScript configuration
├── studio.py                    # Unified master CLI for all video production operations
├── 3d assests/                  # Local storage for 3D binary assets (MUSCLE_CAR.glb)
├── cinematic-remotion-characters/# Reference images and SVGs for character designs
├── docs/                        # Architecture audits and specifications
│   ├── ai-production/           # Permanent AI Production Knowledge Base (THIS DIRECTORY)
│   │   ├── manifests/           # Machine-readable capability & registry JSONs
│   │   └── examples/            # Copy-pasteable scene & episode implementations
│   ├── ANTIGRAVITY_CURRENT_CAPABILITY_AUDIT.md
│   └── CLAUDE_PACKAGE_SPECIFICATION.md
├── output final videos/         # Default output directory for rendered MP4s, thumbnails, and JSON reports
├── packages/                    # Bundled ZIP production archives
├── public/                      # Static assets served by Remotion's webserver (staticFile)
│   ├── audio/sfx/               # Core spatial sound effects library (15+ PCM WAV files)
│   ├── backgrounds/             # HD background plates (exterior.jpg, living_room.jpg, hallway.jpg)
│   ├── fx/                      # Film grain loop textures (grain_0.png .. grain_5.png)
│   ├── models/                  # Web-ready 3D models (MUSCLE_CAR.glb - 6.2 MB)
│   └── packages/                # Ingested production packages (active/ and episode-specific folders)
├── scripts/                     # Python & Node.js automation pipeline
│   ├── ai_production_director.py # Autonomous script-to-video director
│   ├── audio_adapter.py         # edge-tts synthesis, -1.5 dBFS normalization, reverb, SRT generator
│   ├── ingest_package.py        # Safe zip unpacking, schema validation, asset resolution, props builder
│   └── ...                      # Legacy TTS and SFX generation utilities
└── src/                         # React 19 & Remotion TypeScript source code
    ├── index.ts                 # Composition registration root
    ├── Root.tsx                 # RemotionRoot: dynamic & legacy composition registry
    ├── Composition.tsx          # Default boilerplate demo
    ├── index.css                # Global Tailwind CSS & typography imports
    ├── elevenlabs.ts            # ElevenLabs API client (optional external voice provider)
    ├── battery/                 # "Why Your Phone Dies at 1%" explainer short
    ├── car/                     # 3D Three.js muscle car showcase engine
    ├── characters/              # Procedural 2D SVG rigged characters (11 emotions, 9 poses)
    ├── components/              # Universal 3D loaders (GLBModelLoader, ThreeDScene, AudioSyncedCaptions)
    ├── engine/                  # Universal Remotion Engine 2.0 (Dynamic package runtime)
    │   ├── types.ts             # Canonical schemas (EpisodeConfig, SceneConfig, SfxCueConfig)
    │   ├── UniversalEpisode.tsx # Dynamic multi-scene timeline, audio mixer, loop bridge
    │   ├── UniversalCaptions.tsx# Kinetic captions with yellow/red word highlights
    │   ├── sampleEpisodeConfig.ts # Fallback demo configuration
    │   └── scenes/              # Scene renderers (Dossier, Showcase3D, Dialogue, Infographic, MirrorHorror)
    ├── instagram/               # 4:5 and vertical Instagram export wrappers
    ├── part1/, part2/, part3/   # "Everyone Remembers It Differently" mystery short episodes
    ├── part3_master_42s/        # 42.0s master pacing cut of Part 3
    ├── part3_viral/             # 26.0s viral retention loop cut of Part 3
    ├── part3_experiment/        # 2.5D camera parallax & forensic reticle experiments
    ├── stick/                   # Stylized stick figure characters & showcase compositions
    └── temple/                  # "Brihadeeswarar Temple Architecture" explainer short
```

---

## 2. Source Code Architecture Breakdown

### 2.1 The Dynamic Universal Engine (`src/engine/`)
The primary system used by AI agents to render new video content without writing TSX:
- **`types.ts`:** Defines all TypeScript interfaces: `ThemeId`, `CameraPreset`, `LightingPreset`, `SfxCueConfig`, `SentenceTiming`, `DossierSceneConfig`, `Showcase3DSceneConfig`, `DialogueSceneConfig`, `InfographicSceneConfig`, `MirrorHorrorSceneConfig`, `SceneConfig`, and `EpisodeConfig`.
- **`UniversalEpisode.tsx`:** Master composition component. Sequences all scenes along the timeline using `<Sequence>`, mixes master voiceover audio + ambient drone audio + spatial SFX cues, overlays `<UniversalCaptions>`, and appends the seamless camera shutter loop bridge.
- **`UniversalCaptions.tsx`:** Splits narration sentences into 3-4 word kinetic chunks, calculates individual word durations, and applies high-visibility yellow/red emphasis highlights.
- **`scenes/`:**
  - `DossierScene.tsx`: Forensic evidence board with targeting reticles, laser vectors, and classified stamps.
  - `Showcase3DScene.tsx`: Three.js / GLB vehicle & product showcase with HUD overlay metrics.
  - `DialogueScene.tsx`: 2D rigged character conversation against background plates with speech bubbles.
  - `InfographicScene.tsx`: Animated data cards, metric comparisons, and stat callouts.
  - `MirrorHorrorScene.tsx`: Physical room lighting, beveled mirror frame, decoupled reflection entity, glass fracture decals, camera shake, and whisper overlay.

### 2.2 Character Rigging Infrastructure (`src/characters/`)
- **`types.ts`:** Supported characters (`arjun`, `dev`, `rahul`, `meera`, `kabir`, `nisha`, `reflection`), 10 emotions (`neutral`, `worried`, `angry`, `sad`, `scared`, `relieved`, `happy`, `creepySmile`, `hollowScared`, `frozenTerror`), 9 poses (`idle`, `walking`, `talking`, `phone`, `camera`, `armsCrossed`, `knocking`, `pressingGlass`, `standingFrozen`), and 4 views (`front`, `threeQuarter`, `side`, `back`).
- **`designs.ts`:** Palette definitions, build dimensions, hair styles, and clothing colors for each character.
- **`geometry.tsx`:** Modular SVG facial features (eyes, eyebrows, mouths) and body limbs.
- **`Character.tsx`:** Master rigged component with breathing animation, head tilts, arm poses, and facing directions.

### 2.3 3D Vehicle & Object Pipeline (`src/car/` & `src/components/`)
- **`GLBModelLoader.tsx`:** Universal `@react-three/drei` loader that synchronizes GLB animation clips deterministically with `frame / fps`.
- **`ThreeDScene.tsx`:** Procedural animated floating robot character reacting to speech inside `@remotion/three`.
- **`car/`:** Complete 3D muscle car studio with 5 camera modes: `turntable` (360° spin), `drive` (wheel rotation & speed blur), `drift` (counter-steering & skid marks), `exploded` (schematic part separation), and `cyberpunk` (neon mood lighting).

---

## 3. Automation Scripts (`scripts/`)

| Script | Purpose | Key Inputs | Outputs |
|---|---|---|---|
| `studio.py` | Unified developer & production CLI | Subcommand arguments | Renders, reports, audits |
| `ai_production_director.py` | End-to-end autonomous video creator | `--idea "Text"`, `--output .zip` | Production package `.zip` |
| `ingest_package.py` | Package validator, asset resolver, props compiler | `.zip` package path | `episode_props.json`, active link |
| `audio_adapter.py` | Neural TTS synthesis & DSP normalization | `audio_schedule.json` | `voiceover_master.wav`, `.srt` |
| `build_engine_demo_audio.py`| Audio builder for the 3D Engine Showcase | Hardcoded lines | `public/audio/engine_demo/` |

---

## 4. Public Assets Directory (`public/`)

- **`models/MUSCLE_CAR.glb`:** High-detail 3D muscle car model with separated sub-meshes (Wheels, Body, Chassis, Interior) used in 3D showcase compositions.
- **`backgrounds/`:** High-resolution vertical plates:
  - `living_room.jpg`: Dimly lit residential room with fluorescent lamp used in mystery & mirror horror scenes.
  - `exterior.jpg`: Modern street architecture plate.
  - `hallway.jpg`: Industrial interior corridor.
- **`audio/sfx/`:** Core spatial sound design library:
  - `impact_boom.wav`: Deep sub-bass cinematic impact.
  - `glitch_hit.wav`: Sharp electrical static burst.
  - `crack_glass.wav`: Violent acoustic glass hammer impact.
  - `ear_ring.wav`: 55Hz – 4kHz high-frequency tinnitus drone.
  - `camera_shutter.wav`: Mechanical camera snap (loop bridge trigger).
  - `reverse_swell.wav`: Acoustic reverse cymbal riser.
  - `heartbeat.wav`: Muffled biological pulse.
  - `whoosh.wav`: Fast camera pan transition sound.
- **`fx/`:** 6 pre-rendered film grain textures (`grain_0.png` to `grain_5.png`) cycled at 15fps.
