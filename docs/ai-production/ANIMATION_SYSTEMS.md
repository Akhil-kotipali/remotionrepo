# ANIMATION SYSTEMS & KINETIC INFRASTRUCTURE

This document details the frame-based animation infrastructure used across the repository, covering Remotion hooks, interpolation curves, spring physics, procedural movement, and deterministic frame guarantees.

---

## 1. Core Principles of Remotion Animation

Remotion replaces standard web timers (`setTimeout`, `requestAnimationFrame`) with a single pure source of truth:
```tsx
const frame = useCurrentFrame();
const { fps, durationInFrames, width, height } = useVideoConfig();
```

### Deterministic Frame Rule
To guarantee that identical video frames render on local workstations, RTX GPUs, and headless Linux servers:
- **NEVER use `Math.random()` during rendering.**
- Use the deterministic seeded pseudo-random utility from `src/part3/math.ts`:
  ```ts
  import { rnd } from "./math";
  const seed = rnd("my-unique-key"); // Returns float [0, 1) deterministically
  ```
- **NEVER use real-world `Date.now()`.** Derive all time strictly from `frame / fps`.

---

## 2. Interpolation & Keyframing (`interpolate`)

The standard Remotion `interpolate()` function maps frame numbers to numerical values:

```tsx
import { interpolate, Easing } from "remotion";

const opacity = interpolate(frame, [0, 15], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.16, 1, 0.3, 1), // Standard Apple/Decel curve
});
```

### Advanced Keyframe Utility (`kf` in `src/part3/math.ts`)
For multi-point timeline keyframing, `kf()` provides clean piecewise linear interpolation:
```ts
import { kf } from "../part3/math";

// Keyframe points: [[frame, value], [frame, value], ...]
const scale = kf(frame, [
  [0, 1.0],
  [120, 1.05],
  [240, 1.25],
  [360, 1.0],
]);
```

---

## 3. Spring Physics (`spring`)

For organic UI bounces, text entrances, and character reactions:

```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const popScale = spring({
  frame,
  fps,
  config: {
    damping: 12,    // Lower = bouncier (default 10)
    mass: 0.5,      // Lower = faster snap
    stiffness: 100, // Higher = tighter snap
  },
});
```

---

## 4. Camera Shake & Kinetic Decays

In action scenes, horror jumps, and glass impacts, kinetic shockwaves are calculated using exponential decay curves:

```ts
// Example from src/engine/scenes/MirrorHorrorScene.tsx
let shakeX = 0;
let shakeY = 0;

for (const knockFrame of knockFrames) {
  if (frame >= knockFrame && frame <= knockFrame + 25) {
    const delta = frame - knockFrame;
    const decay = Math.exp(-delta * 0.35); // Rapid exponential drop-off
    shakeX += Math.sin(delta * 2.8) * 16 * decay;
    shakeY += Math.cos(delta * 2.5) * 12 * decay;
  }
}
```

---

## 5. Procedural 2D Character Animation

Characters oscillate smoothly between key poses using harmonic sine functions:

| Motion Type | Mathematical Formula | Purpose |
|---|---|---|
| **Breathing** | `Math.sin((frame + seed) * 0.08) * 2.0` | Natural vertical chest rise & fall |
| **Head Sway** | `Math.sin((frame + seed) * 0.04) * 1.5` | Subtle conversational head tilt |
| **Walk Cycle**| `Math.sin((frame * 0.25)) * 25` | Alternating limb pendulum angles |
| **Eye Blink** | `frame % 90 < 4 ? 0.1 : 1.0` | Periodic eyelid closure every 3 seconds |

---

## 6. 3D GLTF Animation Mixer Synchronization

When animating loaded 3D `.glb` models inside `@react-three/fiber` (e.g., `GLBModelLoader.tsx`), the standard Three.js `AnimationMixer` must be paused and forced to the exact frame timestamp:

```tsx
useEffect(() => {
  if (activeAction) {
    const timeInSeconds = frame / fps;
    activeAction.play();
    activeAction.paused = true; // Crucial: Freeze automatic clock
    activeAction.time = timeInSeconds % (activeAction.getClip().duration || 1);
  }
}, [actions, frame, fps]);
```
This guarantees that rendering 4 frames simultaneously across 4 parallel CPU/GPU workers yields zero frame drift.
