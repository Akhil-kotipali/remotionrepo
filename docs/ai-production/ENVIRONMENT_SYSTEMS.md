# ENVIRONMENT & 3D ASSET SYSTEMS

This document details how backgrounds, 3D stages, lighting presets, and atmospheric effects are structured and loaded in the repository.

---

## 1. Visual Background Plates (2D & 2.5D)

All static background plates live in `public/backgrounds/` and are served via Remotion's `staticFile()` utility:

| File Path | Description | Recommended Lighting Tone | Typical Usage |
|---|---|---|---|
| `public/backgrounds/living_room.jpg` | Dim residential apartment with overhead fluorescent tube | Cold moody downlighting | Mystery stories, mirror horror |
| `public/backgrounds/exterior.jpg` | Urban street corner with modern architecture | Daytime / overcast | Forensic dossiers, vehicle scenes |
| `public/backgrounds/hallway.jpg` | Industrial concrete corridor with depth | Clinical tungsten/green | Interrogation, suspense |

### 1.1 Resolution Standards
- **Aspect Ratio:** Strictly `9:16` vertical (`1080x1920`).
- **Clean Foreground:** Plates must contain no characters, faces, or moving objects so that Remotion can place rigged characters and UI layers on top without visual collision.

---

## 2. 3D Environments & Three.js Canvas (`@remotion/three`)

3D scenes are hosted inside Remotion's `<ThreeCanvas>`:

```tsx
<ThreeCanvas
  width={1080}
  height={1920}
  style={{
    position: "absolute",
    inset: 0,
    background: "transparent",
  }}
>
  <CarEnvironment mode={mode} />
  <CarCamera mode={mode} frame={localFrame} fps={30} />
  <MuscleCarRig ... />
</ThreeCanvas>
```

---

## 3. Lighting Presets (`LightingPreset`)

The engine provides 5 calibrated three-point lighting presets:

```
                  [Key Light (Intensity 1.8)]
                           \
                            \
       [Subject / Model] <--- [Fill Light (Intensity 0.6)]
                            /
                           /
                 [Rim Light (Intensity 2.5)]
```

### 3.1 Preset Specifications
1. **`"cyberpunk"`:**
   - Key Light: Neon Cyan (`#00f0ff`, intensity 2.2) at angle `[4, 3, 2]`.
   - Rim Light: Hot Magenta (`#ff0055`, intensity 3.0) behind subject.
   - Ambient: Deep navy (`#050814`, intensity 0.4).
2. **`"noir"` / `"analog_horror"`:**
   - Key Light: Harsh top-down spotlight (`#ffffff`, intensity 1.5, angle 15°).
   - Fill Light: Extremely low (`#111827`, intensity 0.15) for high-contrast shadows.
   - Rim Light: Cold steel blue (`#38bdf8`, intensity 1.8).
3. **`"studio"`:**
   - Soft diffuse 3-point daylight balance with neutral grey backdrop.
4. **`"daylight"`:**
   - High-intensity warm sunlight (`#fffbeb`, intensity 2.0) with soft ground bounce.
5. **`"sunset"`:**
   - Low-angle amber light (`#f97316`, intensity 2.4) with purple rim.

---

## 4. 3D Model Pipeline & GLB Specifications

### 4.1 Master Model: `public/models/MUSCLE_CAR.glb`
- **File Size:** `6.2 MB` (optimized for fast browser GPU upload).
- **Format:** Binary glTF (`.glb`) with embedded Draco-compressed buffers.
- **Mesh Hierarchy:**
  - `Body`: Main exterior shell with glossy metallic car-paint material.
  - `Wheel_FL`, `Wheel_FR`, `Wheel_RL`, `Wheel_RR`: Separated wheel meshes for independent rotation and front-axle steering.
  - `Chassis`: Engine bay, drive-shaft, and suspension linkages.
  - `Glass`: Tinted semi-transparent physical glass material (`roughness: 0.1`, `transmission: 0.9`).

### 4.2 Loading External GLB Models (`GLBModelLoader.tsx`)
Future AI agents can load any custom `.glb` model into `Showcase3DScene`:
```tsx
import { GLBModelLoader } from "../components/GLBModelLoader";
import { staticFile } from "remotion";

<GLBModelLoader
  modelPath={staticFile("models/my_robot.glb")}
  animationName="Idle"
  position={[0, -1, 0]}
  scale={1.5}
/>
```

---

## 5. Procedural Room & Architectural Geometry

For scenes without 3D files, procedural SVG/Canvas rooms provide depth:
- **`src/temple/`:** Renders historical Dravidian temple Gopuram towers with mathematical tier scaling, stone pillars, and 80-ton Kumbam dome calculations.
- **`src/battery/`:** Renders phone battery cross-sections, chemical lithium ion tanks, and circuit board schematics.
- **`src/engine/scenes/MirrorHorrorScene.tsx`:** Renders a 3D-beveled mirror frame with brushed metallic borders (`#1e293b`), interior shadow vignette, and procedural radial fracture cracks.
