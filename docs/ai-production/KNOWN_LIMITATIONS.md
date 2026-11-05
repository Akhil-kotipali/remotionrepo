# KNOWN LIMITATIONS & OPERATIONAL BOUNDARIES

This document identifies the technical boundaries, unsupported features, and potential failure modes of the production engine.

---

## 1. Hardware & Memory Boundaries (RTX 3050 Laptop)

### 1.1 VRAM Ceiling (4 GB)
- **Constraint:** Headless Chromium rendering instances will crash with a Windows D3D11 TDR error if VRAM exceeds 3.8 GB.
- **Rule:** Never increase `Config.setConcurrency` above `4`.
- **Three.js Models:** Do not load raw uncompressed 3D models larger than 50 MB into `@remotion/three`. Always optimize `.glb` files with Draco geometry compression.

### 1.2 System RAM
- While rendering long compositions (1200+ frames), avoid running multiple render commands concurrently.

---

## 2. Speech Synthesis & Network Requirements

### 2.1 Microsoft `edge-tts`
- **Internet Access:** `edge-tts` communicates with Microsoft's public endpoint. It requires active internet access during the audio generation stage.
- **Offline Fallback:** If internet access is unavailable, episodes must supply pre-rendered `.wav` audio files directly in `audio/voiceover_master.wav`.
- **Character Lip Sync:** The procedural 2D characters do not have phonetic phoneme viseme lip-sync. Speech is indicated via speech bubbles, eye reactions, and dynamic mouth pulsing.

---

## 3. Remotion Determinism & Math Restrictions

### 3.1 Non-Deterministic JavaScript
- **Forbidden:** Never use `Math.random()` inside React render functions. Remotion renders frames out of order across 4 worker threads; `Math.random()` causes severe visual flickering.
- **Allowed:** Use `src/part3/math.ts` seeded random function `rnd(seed)`.

### 3.2 Dynamic Timers
- **Forbidden:** `setTimeout`, `setInterval`, and CSS `@keyframes` that rely on wall-clock time will desynchronize.
- **Allowed:** Base all animations on `useCurrentFrame()`.

---

## 4. Unsupported Scene & Asset Features

| Requested Feature | Current Status | Workaround / Existing Alternative |
|---|---|---|
| **Human 3D Skeletal Rigging (Mixamo / FBX)** | Not Implemented | Use Procedural 2D SVG Character Rigs (`src/characters/`) |
| **Real-time Fluid / Smoke Simulation** | Not Implemented | Use pre-rendered video loops or SVG particle arrays |
| **Automatic Word-Level Whisper Alignment** | External Tool Required | `audio_adapter.py` calculates word timings proportionally |
| **In-Browser Audio Live Scrubbing** | Partial in Dev Mode | Full audio mixing is verified during final MP4 export |

---

## 5. Security & ZIP Extraction Boundaries

- `scripts/ingest_package.py` implements path traversal guards. Any ZIP containing `../` or absolute drive paths (`C:\`) will be rejected with `SecurityError`.
- Packages cannot overwrite files outside `public/packages/<episode_id>/`.
