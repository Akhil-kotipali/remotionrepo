# CAMERA SYSTEMS & CINEMATIC CHOREOGRAPHY

This document details all camera control systems in the repository, spanning 2D zoom/pan motions, 2.5D multi-plane parallax, and Three.js 3D virtual camera rigs.

---

## 1. 2D Planar Camera Motion (`transform`)

Most narrative scenes (`DialogueScene`, `MirrorHorrorScene`, `DossierScene`) achieve cinematic camera movements via CSS transform matrices applied to the root container.

### 2.1 Center-Anchored Push-In
```tsx
const zoom = interpolate(frame, [0, durationInFrames], [fromScale, toScale], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
});

const camY = interpolate(frame, [0, durationInFrames], [fromY, toY], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

return (
  <div
    style={{
      position: "absolute",
      inset: 0,
      transformOrigin: "540px 960px", // Anchored at 9:16 vertical center
      transform: `translate(${shakeX}px, ${shakeY + camY}px) scale(${zoom})`,
    }}
  >
    {children}
  </div>
);
```

---

## 2. 2.5D Multi-Plane Parallax System

Used in `src/part3_experiment/` and high-production mystery scenes to create depth without full 3D rendering:

```
[Layer 0: Distant Background Plate]  -> Depth 0.2  (Moves 20px)
[Layer 1: Forensic Reticles & Room]  -> Depth 0.5  (Moves 50px)
[Layer 2: Rigged Character Staging]  -> Depth 1.0  (Moves 100px)
[Layer 3: Forensic Text & Overlays] -> Depth 1.3  (Moves 130px)
```

Each plane translates proportionally to its depth coefficient `z`:
```tsx
const panX = interpolate(frame, [0, 150], [-40, 40]);
const layerTranslateX = panX * depthFactor;
```

---

## 3. 3D Virtual Camera Choreography (`src/car/CarCamera.tsx`)

In 3D Three.js compositions (`@remotion/three`), the virtual camera is choreographed dynamically via 5 camera modes:

```tsx
export type CameraMode = "turntable" | "drive" | "drift" | "exploded" | "cyberpunk";
```

### 3.1 Mode 1: 360° Studio Turntable (`"turntable"`)
- **Angle:** Low hero 3/4 angle rotating smoothly around the car origin `[0, 0, 0]`.
- **Math:**
  ```ts
  const angle = (frame / fps) * 0.45;
  const radius = 6.8;
  camera.position.x = Math.sin(angle) * radius;
  camera.position.z = Math.cos(angle) * radius;
  camera.position.y = 1.4;
  camera.lookAt(0, 0.4, 0);
  ```

### 3.2 Mode 2: High-Speed Chase Camera (`"drive"`)
- **Angle:** Low rear tracking camera with micro-vibrations simulating road bumps at 120 mph.
- **Math:**
  ```ts
  const roadBump = Math.sin(frame * 0.8) * 0.03 + Math.cos(frame * 1.4) * 0.015;
  camera.position.set(0.2, 1.1 + roadBump, -4.8);
  camera.lookAt(0, 0.6, 2.0);
  ```

### 3.3 Mode 3: Dynamic Power Drift (`"drift"`)
- **Angle:** Wide exterior camera tracking lateral vehicle slide with counter-steering compensation.
- **Math:**
  ```ts
  const t = frame / durationInFrames;
  camera.position.x = interpolate(t, [0, 1], [-5.5, 4.2]);
  camera.position.z = interpolate(t, [0, 1], [3.2, 5.0]);
  camera.position.y = 1.2;
  camera.lookAt(carPosition);
  ```

### 3.4 Mode 4: Exploded Holographic Schematic (`"exploded"`)
- **Angle:** High isometric angle (`45°`) slowly orbiting as vehicle components detach into floating layers.

### 3.5 Mode 5: Low-Slung Neon Noir (`"cyberpunk"`)
- **Angle:** Ground-level camera looking up at the front grille, capturing high-contrast neon reflections.

---

## 4. Camera Presets in `Showcase3DSceneConfig`

When configuring 3D scenes via JSON, use the `cameraPreset` field:

| Preset Name | Description | Recommended Usage |
|---|---|---|
| `"turntable"` | Smooth 360° rotation around center | Product & vehicle walk-around |
| `"drift"` | Wide lateral tracking pan | Action, momentum, high speed |
| `"flythrough"` | Fast forward push through scene | Opening hooks, dramatic reveals |
| `"static"` | Fixed cinematic camera | Text-heavy dialogue scenes |
| `"pan_left"` | Slow horizontal dolly to left | Wide landscape inspections |
| `"pan_right"` | Slow horizontal dolly to right | Wide landscape inspections |
