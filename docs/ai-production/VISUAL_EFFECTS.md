# VISUAL EFFECTS & POST-PROCESSING PIPELINE

This document details all visual overlays, post-processing shaders, CRT/glitch effects, and cinematic grading tools available in the repository.

---

## 1. Visual FX Overlay Library (`src/part3/fx/Overlays.tsx`)

These overlays stack on top of compositions to give clinical digital animations a gritty, cinematic film texture.

### 1.1 Film Grain (`Grain`)
- **Mechanism:** Cycles 6 pre-rendered noise tiles (`public/fx/grain_0.png` through `grain_5.png`) every 2 frames (`Math.floor(f / 2) % 6`).
- **Blend Mode:** `mixBlendMode: "overlay"`.
- **Default Opacity:** `0.16` (subtle texture without reducing legibility).
- **GPU Impact:** Zero shader cost (pure CSS background image switching).

### 1.2 Organic Vignette (`Vignette`)
- **Mechanism:** Radial gradient vignette that dynamically expands and contracts in sync with biological heartbeat frames:
  ```ts
  const beat = heartbeatFrames().reduce((m, b) => Math.max(m, pulse(f, b, 9)), 0);
  const tight = kf(f, [[0, 0.5], [468, 0.7], [846, 1], [1545, 1]]);
  const o = clamp(tight + beat * 0.18, 0, 1);
  ```
- **Visual Result:** Corners darken during tense narration lines and pulse with the audio track.

### 1.3 Chromatic Mood Wash (`ColorWash`)
- **Mechanism:** Dual-layer color overlay for psychological shifts:
  - **Cold Dread:** `#2a56a8` (`mixBlendMode: "color"`, opacity ~0.22) during eerie silences.
  - **Panic Spike:** `#ff1f2d` (`mixBlendMode: "screen"`, opacity ~0.34) on jumpscares and narrative reveals.

### 1.4 Horizontal Slice Glitch (`GlitchBurst`)
- **Mechanism:** Generates 9 randomized horizontal screen slices displaced laterally on cut frames:
  ```tsx
  <GlitchBurst at={240} len={7} power={1.2} />
  ```
  - Slices tinted in RGB cyan (`rgba(60,230,255,0.32)`), crimson (`rgba(255,40,70,0.38)`), or white.
  - Fades out over `len` frames (typically 5 to 8 frames / 0.2s).

### 1.5 Hit Flash (`HitFlash`)
- **Mechanism:** Single-frame full-screen pure white flash (`#ffffff`) on heavy impacts, decaying exponentially to 0 over 8 frames.

---

## 2. Specialized Horror VFX (`src/engine/scenes/MirrorHorrorScene.tsx`)

### 2.1 Radial Glass Fractures
Procedural SVG stress cracks generated dynamically at hammer impact coordinates:
```tsx
{knockCount >= 1 && (
  <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <circle cx={impactX} cy={impactY} r={18} fill="none" stroke="#38bdf8" strokeWidth={2} />
    <path d={`M ${impactX} ${impactY} L ${impactX - 120} ${impactY - 80} ...`} stroke="#38bdf8" />
  </svg>
)}
```
- Crack complexity scales with the number of impacts (Knock 1 = initial star, Knock 2 = branching cracks, Knock 3 = spiderweb fractures across the mirror face).

### 2.2 Chromatic Aberration Pulse
Displaces red and blue color channels laterally during kinetic hits:
```tsx
const redOffset = chromaticOffset;
const blueOffset = -chromaticOffset;
```

---

## 3. Reticles & Forensic HUD Elements

- **`ForensicReticles25D.tsx`:** Animated targeting reticles that lock onto subjects, measuring coordinates, biometric heart rates, and anomaly confidence percentages.
- **`CarHUD.tsx`:** Digital telemetry overlay for 3D vehicle scenes:
  - Digital Speedometer (0 – 140 MPH with acceleration curve)
  - Active Gear Indicator (1st – 6th)
  - RPM Tachometer with color-coded shift lights
  - G-Force Vector Ball with lateral drift displacement
