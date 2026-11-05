# RENDERING PIPELINE & GPU ACCELERATION

This document details the Remotion CLI rendering infrastructure, GPU hardware bounds, concurrency settings, and command executions.

---

## 1. Hardware Constraints & Tuning (RTX 3050 Laptop)

The platform is strictly calibrated for:
- **GPU:** NVIDIA GeForce RTX 3050 Laptop GPU (4 GB VRAM)
- **RAM:** 16 GB DDR4/DDR5
- **OS:** Windows 11 / PowerShell

### 1.1 Remotion Config Settings (`remotion.config.ts`)
```ts
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

Config.setRspack(true);                            // Rspack bundler for fast builds
Config.setVideoImageFormat("jpeg");               // JPEG frame caching minimizes RAM
Config.setOverwriteOutput(true);                  // Auto-overwrites previous renders
Config.setChromiumOpenGlRenderer("angle");         // Direct DirectX 11 GPU acceleration
Config.setConcurrency(4);                         // 4 parallel worker instances (prevents VRAM crash)
Config.setCodec("h264");                           // Broadcast H.264 video codec
Config.setPixelFormat("yuv420p");                  // Universal player compatibility
Config.overrideBundlerConfig(enableTailwind);      // Tailwind CSS v4 support
```

### 1.2 Why Concurrency=4 & ANGLE D3D11?
- Chromium headless instances each reserve ~400 MB to 750 MB of VRAM when rendering WebGL / Three.js.
- Concurrency 4 utilizes ~2.2 GB VRAM, safely below the 4.0 GB physical hardware ceiling.
- Concurrency 8 or software OpenGL causes Windows D3D11 TDR driver resets (Render crash).

---

## 2. Master CLI Operations (`studio.py`)

All video rendering and package processing should be run through `studio.py`:

### 2.1 One-Command Package Production (Recommended)
```bash
python studio.py package packages/<my_package>.zip
```
**Execution Sequence:**
1. Unpacks `.zip` safely into `public/packages/<episode_id>/`.
2. Validates `manifest.json` against `EpisodeConfig`.
3. Resolves all visual/audio asset paths.
4. Synthesizes voiceover dialogue via `edge-tts` if audio schedule is supplied.
5. Assembles `episode_props.json` and creates active symlink `public/packages/active/`.
6. Executes Remotion render: `npx remotion render PackageEpisode "output final videos/<episode_id>_Master.mp4" --props="..." --overwrite`.
7. Extracts 9:16 cover thumbnail: `npx remotion still PackageEpisode "output final videos/<episode_id>_Thumbnail.png" --props="..." --frame=<frame>`.
8. Saves production report `output final videos/<episode_id>_Production_Report.json`.

### 2.2 Flags for `studio.py package`
- `--force` / `-f`: Overwrite existing extracted package folder.
- `--preview` / `-p`: Launches Remotion Studio web UI instead of rendering to disk.
- `--skip-render`: Extract, validate, and build props without rendering MP4.
- `--skip-audio`: Use pre-existing audio without running `edge-tts`.
- `--thumb-frame <int>`: Specify exact frame number for thumbnail extraction.

---

## 3. Direct Remotion CLI Rendering

For direct Remotion command execution:

```bash
# Render active dynamic episode
npx remotion render PackageEpisode "output final videos/my_video.mp4" --props="public/packages/active/episode_props.json" --overwrite

# Render specific frame as still image
npx remotion still PackageEpisode "output final videos/my_thumb.png" --props="public/packages/active/episode_props.json" --frame=336 --overwrite

# Preview in browser (Remotion Studio)
npx remotion studio
```

---

## 4. Production Report Output (`*_Production_Report.json`)

Upon completion, `studio.py` emits a machine-readable summary:

```json
{
  "episodeId": "mirror_anomaly_01",
  "title": "THE MIRROR ANOMALY: YOUR REFLECTION STAYS",
  "status": "COMPLETED",
  "renderedAt": "2026-11-05 08:51:34",
  "wallClockTimeSec": 125.4,
  "masterVideo": "output final videos/mirror_anomaly_01_Master.mp4",
  "coverThumbnail": "output final videos/mirror_anomaly_01_Thumbnail.png",
  "totalFrames": 840,
  "fps": 30,
  "dimensions": "1080x1920"
}
```
