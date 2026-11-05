# ENGINE ARCHITECTURE: UNIVERSAL REMOTION ENGINE 2.0

This document explains the runtime architecture of the Universal Remotion Engine, how external packages are ingested, how dynamic metadata is computed, and how scenes are sequenced.

---

## 1. High-Level Architectural Flow

```
┌────────────────────────┐
│  AI Creative Director  │  (Generates creative_direction.json, audio_schedule.json, manifest.json)
└───────────┬────────────┘
            │ Bundles into .zip
            ▼
┌────────────────────────┐
│   Production Package   │  (Self-contained archive: manifest, audio, assets, reference board)
└───────────┬────────────┘
            │ Ingested via studio.py / ingest_package.py
            ▼
┌────────────────────────┐
│ Ingestion & Resolution │  (Validates schema, checks assets, synthesizes audio via edge-tts)
└───────────┬────────────┘
            │ Writes public/packages/<id>/episode_props.json
            ▼
┌────────────────────────┐
│  Remotion Root Engine  │  (Composition id="PackageEpisode" invokes calculateMetadata)
└───────────┬────────────┘
            │ Dynamically configures FPS, width, height, durationInFrames
            ▼
┌────────────────────────┐
│   UniversalEpisode     │  (Sequences scenes, mixes audio/SFX, overlays UniversalCaptions)
└───────────┬────────────┘
            │ Renders via ANGLE D3D11 GPU
            ▼
┌────────────────────────┐
│  Final Broadcast MP4   │  (1080x1920 @ 30fps H.264 + High-CTR Cover Thumbnail)
└────────────────────────┘
```

---

## 2. Dynamic Remotion Composition: `PackageEpisode`

In standard Remotion applications, every new video requires declaring a `<Composition />` with hardcoded `durationInFrames`, `width`, `height`, and `component`. In this engine, all dynamic episodes route through a single composition registered in `src/Root.tsx`:

```tsx
<Composition
  id="PackageEpisode"
  component={(props: { config?: EpisodeConfig }) => (
    <UniversalEpisode config={props?.config || SAMPLE_ENGINE_EPISODE} />
  )}
  calculateMetadata={async ({ props, defaultProps }) => {
    const cfg =
      (props as { config?: EpisodeConfig })?.config ||
      (defaultProps as { config?: EpisodeConfig })?.config ||
      SAMPLE_ENGINE_EPISODE;
    const duration = cfg.durationInFrames || cfg.totalDurationInFrames || 900;
    return {
      durationInFrames: duration,
      fps: cfg.fps || 30,
      width: cfg.width || 1080,
      height: cfg.height || 1920,
      props: {
        config: cfg,
      },
    };
  }}
  defaultProps={{
    config: SAMPLE_ENGINE_EPISODE,
  }}
/>
```

### Why `calculateMetadata` is Critical
1. **Zero TSX Modifications:** AI agents or automated pipelines do not need to edit `src/Root.tsx` to alter video duration or frame rate.
2. **Dynamic Pacing:** A 28-second Short (840 frames) and a 42-second Short (1260 frames) both render from the same composition name `PackageEpisode`.
3. **Props Isolation:** Passing `--props="public/packages/<id>/episode_props.json"` overrides runtime behavior cleanly.

---

## 3. Timeline Sequencing Architecture (`UniversalEpisode.tsx`)

`src/engine/UniversalEpisode.tsx` acts as the master conductor. It reads `EpisodeConfig` and constructs the video timeline:

### 3.1 Scene Sequencing
Each scene inside `config.scenes` is wrapped in a Remotion `<Sequence>`:
```tsx
let cumulativeFrame = 0;
const sceneSequences = config.scenes.map((scene, idx) => {
  const from = scene.fromFrame ?? cumulativeFrame;
  const duration = scene.durationFrames ?? scene.durationInFrames ?? 150;
  cumulativeFrame = from + duration;
  return { scene, from, duration, idx };
});
```

Inside each `<Sequence>`, the engine dispatches to one of the 5 universal scene primitives:
- `scene.type === "dossier"` → `<DossierScene config={scene} />`
- `scene.type === "showcase3d" || "3d_showcase"` → `<Showcase3DScene config={scene} />`
- `scene.type === "dialogue"` → `<DialogueScene config={scene} />`
- `scene.type === "infographic"` → `<InfographicScene config={scene} />`
- `scene.type === "mirror_horror"` → `<MirrorHorrorScene config={scene} />`

### 3.2 Audio Layering & Mixing
`UniversalEpisode` creates 3 synchronized audio layers:
1. **Master Voiceover Track:** Loaded via `<Audio src={staticFile(config.voiceoverAudioPath)} />`. Plays narration synthesized by `edge-tts` or supplied in the package.
2. **Background Ambient Drone:** Loaded via `<Audio src={staticFile(config.droneAudioPath)} volume={config.droneVolume ?? 0.25} loop />`. Supplies constant low-frequency tension.
3. **Spatial Sound Effect Cues:** An array of `<Sequence from={cue.frame}>` blocks:
   ```tsx
   <Sequence from={cue.frame} key={idx}>
     <Audio
       src={staticFile(cue.sound)}
       volume={cue.volume ?? 1.0}
       playbackRate={cue.playbackRate ?? 1.0}
     />
   </Sequence>
   ```

### 3.3 Kinetic Captions Layer
Mounted globally at the root of `UniversalEpisode`:
```tsx
{config.sentences && config.sentences.length > 0 && (
  <UniversalCaptions sentences={config.sentences} fps={config.fps} />
)}
```
Captions float over the entire composition, automatically displaying the current 3-4 word phrase with word-level yellow/red keyword highlights.

### 3.4 Seamless Loop Bridge
When `config.enableSeamlessLoop === true`, the engine attaches a visual camera flash bridge:
1. **End Flash (Final 12 Frames):** Opacity ramps from 0 to 1 (`#ffffff`).
2. **Loop Reset Flash (First 12 Frames):** Opacity ramps from 1 to 0 (`#ffffff`).
3. **Rewatch Banner:** At `frame >= totalFrames - 45`, displays `config.loopRewatchPrompt` (e.g., `▲ REWATCH: CHECK THE GLASS BEFORE IT TURNS`) in high-contrast amber yellow (`#ffcc00`).

---

## 4. The 5 Universal Scene Primitives

| Scene Type | Render Component | Primary Visual Output | Config Interface |
|---|---|---|---|
| `"dossier"` | `DossierScene.tsx` | Forensic document with targeting reticles & laser lines | `DossierSceneConfig` |
| `"showcase3d"` | `Showcase3DScene.tsx` | Interactive 3D vehicle/model with telemetry HUD | `Showcase3DSceneConfig` |
| `"dialogue"` | `DialogueScene.tsx` | Procedural 2D rigged characters with speech bubbles | `DialogueSceneConfig` |
| `"infographic"`| `InfographicScene.tsx` | Stat cards, percentage progress bars, comparisons | `InfographicSceneConfig` |
| `"mirror_horror"`| `MirrorHorrorScene.tsx`| Decoupled mirror reflection entity with fracture decals | `MirrorHorrorSceneConfig` |

---

## 5. Visual Styling & Theme System

The engine supports 5 built-in aesthetic themes via `ThemeId`:
- **`"analog_horror"`:** Desaturated dark palettes (`#030712`), cyan CRT scans (`#00f0ff`), danger amber (`#f43f5e`).
- **`"cyberpunk"`:** High-contrast neon magenta (`#ec4899`), cyan (`#06b6d4`), and dark slate (`#0f172a`).
- **`"police_audit"`:** High-contrast forensic yellow (`#eab308`), stark white (`#f8fafc`), and deep black (`#020617`).
- **`"tech_minimal"`:** Apple-style clean gradients, glassmorphism blur, and muted slate typography.
- **`"neon_noir"`:** Deep navy tones (`#0a0f1d`), harsh street downlighting, and rain glass condensation.
