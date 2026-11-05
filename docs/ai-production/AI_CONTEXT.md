# AI CONTEXT: REMOTION PRODUCTION REPOSITORY INTELLIGENCE

> **CRITICAL DIRECTIVE FOR FUTURE AI AGENTS:**  
> Before producing a new episode or modifying production code, consult this AI production knowledge base and the relevant component registry entries in `docs/ai-production/`. **Do not inspect the entire repository unless a required capability is undocumented, the documentation appears outdated, or implementation verification is strictly necessary.**

---

## 1. What This Repository Does

This repository is a **production-grade video automation platform** powered by [Remotion 4.0](https://remotion.dev) (React 19 + TypeScript + Three.js / React Three Fiber) and Python automation. It produces high-retention 9:16 vertical videos (YouTube Shorts, Instagram Reels, TikTok) across multiple formats:
- **Narrative Psychological Horror & Impossible Scenarios** (`MirrorHorrorScene`, analog horror)
- **Cinematic 3D Vehicle & Product Showcases** (`CarShowcase`, `Showcase3DScene`, Three.js `@remotion/three` & GLB rigs)
- **Audio-Synced Mystery & Crime Stories** (`Part1`, `Part2`, `Part3Master42s`, `DossierScene`)
- **Technical & Architectural Explanations** (`TempleShort`, `BatteryShort`, `InfographicScene`)
- **Procedural Character Animation** (Dynamic SVG kinematics rigs: Arjun, Dev, Rahul, Meera, Kabir, Nisha, Reflection)

---

## 2. Key Architecture & Entry Points

```
my-video/
├── src/
│   ├── index.ts               # Remotion entry point (registerRoot)
│   ├── Root.tsx               # Composition registry (PackageEpisode, UniversalEngineShowcase, Part1/2/3, CarShowcase, etc.)
│   ├── engine/
│   │   ├── types.ts           # Canonical TypeScript schemas (EpisodeConfig, SceneConfig, SfxCueConfig)
│   │   ├── UniversalEpisode.tsx   # Dynamic multi-scene timeline, audio mixer, caption engine, seamless loop bridge
│   │   ├── UniversalCaptions.tsx  # Word-level highlighted kinetic captions (yellow/red emphasis)
│   │   └── scenes/            # The 5 universal scene primitives (Dossier, Showcase3D, Dialogue, Infographic, MirrorHorror)
│   ├── characters/            # Procedural 2D SVG rigged characters (11 emotions, 9 kinematics poses)
│   ├── car/                   # 3D Three.js muscle car rig, camera choreographies, and HUD overlays
│   └── components/            # Reusable 3D primitives (GLBModelLoader, ThreeDScene)
├── scripts/
│   ├── studio.py              # Unified CLI: package, import, assets, render, still, audit
│   ├── ingest_package.py      # Zip extractor, schema validator, asset resolver, dynamic props builder
│   ├── audio_adapter.py       # edge-tts neural synthesis, -1.5 dBFS normalization, silence trimming, SRT generation
│   └── ai_production_director.py # Autonomous idea-to-video director: script -> audio -> SFX -> scenes -> ZIP
├── public/                    # Static runtime assets (models/, backgrounds/, audio/sfx/, packages/)
└── remotion.config.ts         # RTX 3050 GPU tuning: Rspack, ANGLE D3D11, Concurrency=4, H.264
```

---

## 3. How Compositions Are Registered and Rendered

### Dynamic Composition: `PackageEpisode`
- **Location:** `src/Root.tsx` (lines 47–71)
- **Purpose:** Renders any external episode configuration without creating new TSX files or modifying `Root.tsx`.
- **Metadata Calculation:** Uses Remotion's `calculateMetadata` to dynamically adapt composition dimensions (1080x1920), duration (`durationInFrames`), and framerate (`fps = 30`) from runtime JSON props.

### Standard Render Command
```bash
# Render any episode package end-to-end (Extract -> Resolve -> TTS -> Render MP4 -> Thumbnail)
python studio.py package packages/<package_name>.zip

# Or render an active props file directly via Remotion CLI:
npx remotion render PackageEpisode "output final videos/my_video.mp4" --props="public/packages/active/episode_props.json" --overwrite
```

---

## 4. How to Create a New Episode

### Route A: Autonomous AI Director (Recommended)
You only need to supply an idea prompt:
```bash
python scripts/ai_production_director.py --idea "Your video prompt" --output packages/my_production.zip
python studio.py package packages/my_production.zip
```
This automatically writes scripts, synthesizes voiceovers, builds kinetic captions, arranges 11 SFX cues, compiles the manifest, and renders the MP4 and thumbnail.

### Route B: External Package (e.g. Claude ZIP)
Create a `.zip` archive containing:
1. `manifest.json` (Adheres to `EpisodeConfig` in `src/engine/types.ts`)
2. `audio/voiceover_master.wav` OR `audio_schedule.json` (for neural TTS synthesis)
3. `asset-manifest.json` (Declaring all visual/audio dependencies)
4. Relevant plates or models in `assets/`
Then run:
```bash
python studio.py package packages/<name>.zip
```

---

## 5. Directory to Documentation Routing

When you need specific capabilities, consult these files directly:

| If you need to... | Consult Document |
|---|---|
| Understand directory layouts and file locations | [`REPOSITORY_MAP.md`](file:///c:/Users/krish/Downloads/my-video/docs/ai-production/REPOSITORY_MAP.md) |
| Inspect reusable React/Remotion components & props | [`COMPONENT_REGISTRY.md`](file:///c:/Users/krish/Downloads/my-video/docs/ai-production/COMPONENT_REGISTRY.md) |
| Animate characters, change emotions, or set poses | [`CHARACTER_SYSTEMS.md`](file:///c:/Users/krish/Downloads/my-video/docs/ai-production/CHARACTER_SYSTEMS.md) |
| Configure camera zooms, parallax, or 3D angles | [`CAMERA_SYSTEMS.md`](file:///c:/Users/krish/Downloads/my-video/docs/ai-production/CAMERA_SYSTEMS.md) |
| Load 3D GLB models or Three.js scenes | [`ENVIRONMENT_SYSTEMS.md`](file:///c:/Users/krish/Downloads/my-video/docs/ai-production/ENVIRONMENT_SYSTEMS.md) |
| Synthesize voiceover, adjust volume, or place SFX | [`AUDIO_SYSTEMS.md`](file:///c:/Users/krish/Downloads/my-video/docs/ai-production/AUDIO_SYSTEMS.md) |
| Format captions with yellow/red word highlights | [`SUBTITLE_SYSTEMS.md`](file:///c:/Users/krish/Downloads/my-video/docs/ai-production/SUBTITLE_SYSTEMS.md) |
| Configure scene primitives (Dossier, 3D, Dialogue, Horror) | [`SCENE_SYSTEMS.md`](file:///c:/Users/krish/Downloads/my-video/docs/ai-production/SCENE_SYSTEMS.md) |
| Resolve missing assets or handle reference boards | [`ASSET_PIPELINE.md`](file:///c:/Users/krish/Downloads/my-video/docs/ai-production/ASSET_PIPELINE.md) |
| Execute CLI commands or configure GPU rendering | [`RENDERING_PIPELINE.md`](file:///c:/Users/krish/Downloads/my-video/docs/ai-production/RENDERING_PIPELINE.md) |
| Study legacy mystery story productions (Part 1/2/3) | [`EXISTING_PRODUCTIONS.md`](file:///c:/Users/krish/Downloads/my-video/docs/ai-production/EXISTING_PRODUCTIONS.md) |
| View TypeScript interfaces and JSON schemas | [`API_REFERENCE.md`](file:///c:/Users/krish/Downloads/my-video/docs/ai-production/API_REFERENCE.md) |
| Understand hardware limits (RTX 3050 4GB VRAM) | [`KNOWN_LIMITATIONS.md`](file:///c:/Users/krish/Downloads/my-video/docs/ai-production/KNOWN_LIMITATIONS.md) |
| See working code examples for each scene type | [`examples/`](file:///c:/Users/krish/Downloads/my-video/docs/ai-production/examples/) |

---

## 6. Critical Operational Rules & Constraints

1. **Deterministic Frame Rendering:** Never use non-deterministic functions (like `Math.random()` or real-time `Date.now()`) inside Remotion components. Use deterministic seed utilities (`rnd(seed)` from `src/part3/math.ts`) or pass seeded parameters.
2. **GPU & Memory Bounds (RTX 3050 Laptop):**
   - VRAM is strictly 4 GB. Keep concurrency at 4 (`--concurrency=4`).
   - Use ANGLE D3D11 backend (`Config.setChromiumOpenGlRenderer("angle")`).
   - Rspack bundler is enabled for ultra-fast incremental bundling.
3. **No TSX Edits for Episode Production:** Standard production packages configure `PackageEpisode` purely via JSON manifest (`manifest.json` / `audio_schedule.json`). Never modify `src/Root.tsx` to register one-off compositions.
4. **Code-First Rigging:** Characters and procedural entities should be rendered via SVG/Canvas code in `src/characters/` rather than demanding external binary downloads.
5. **Clean Git Deployments:** Strictly zero `.mp4` video files, `.png`/`.jpg` rendered images, or `.zip` packages may be committed or pushed to remote git repositories.
