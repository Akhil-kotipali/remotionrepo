# EXISTING PRODUCTIONS & CASE STUDY ANALYSIS

This document analyzes the existing benchmark productions in the repository, explaining how they are structured, what can be reused, and which files should remain untouched.

---

## 1. Case Study 1: "The Mirror Anomaly" (`mirror_anomaly_01`)

- **Composition:** `PackageEpisode` (driven by `packages/mirror_anomaly_production.zip`)
- **Genre:** Psychological Horror / Impossible Scenario
- **Format:** 1080x1920 @ 30fps (840 frames / 28.0s)
- **Output:** `output final videos/mirror_anomaly_01_Master.mp4` (10.3 MB)
- **Key Features:**
  - 4 scenes using `MirrorHorrorScene.tsx`.
  - Decoupled reflection entity with unnatural crescent smile morphing.
  - 3 violent glass hammer impacts at frames 485, 545, 605 with radial fracture decals.
  - Camera shutter loop bridge connecting frame 839 to frame 0 via a 12-frame dissolve.
  - Neural voiceover synthesized via `edge-tts` with -1.5 dBFS normalization.
  - 100% self-contained production package.

---

## 2. Case Study 2: "Everyone Remembers It Differently" (Parts 1, 2, 3)

The flagship mystery series in the repository.

### 2.1 Part 1: The Message (`src/part1/`)
- **Composition:** `Part1` (930 frames / 31.0s @ 30fps)
- **Architecture:** 2D stage coordinates with living room photographic plate. Introduces Arjun, Dev, Rahul, Meera, Kabir, and Nisha receiving an anomalous text message.
- **Visuals:** Polaroids falling, kinetic text popups, phone screen UI.
- **Audio:** Custom multi-track voiceover + heartbeat drone + whoosh transitions.

### 2.2 Part 2: The Extra Person (`src/part2/`)
- **Compositions:** `Part2` (Original Master), `Part2WithOutro`, `Part2Loop` (50s viral retention cut).
- **Core Narrative:** The friends examine a group photo taken in the living room and realize there are seven people in the frame.
- **Key Mechanics:** Photo inspection zooms, red laser targeting reticles, animated suspicion meters.

### 2.3 Part 3: Five Memories (`src/part3/`)
- **Compositions:**
  - `Part3Master42s`: 42.0s master pacing cut (1260 frames). Growth sweet spot with dedicated read-time for forensic details.
  - `Part3Viral`: 26.0s high-velocity cut (780 frames). Engineered for >100% loop retention.
  - `Part3Thumbnail`: High-CTR thumbnail composition capturing Meera's frightened face.
- **Character Rigging:** Uses `FriendRig.tsx` with procedural head turns, eye widening, trembling brows, and prop attachments (Kabir holding a book).

---

## 3. Case Study 3: 3D Muscle Car Showcase (`src/car/`)

- **Composition:** `CarShowcaseComposition` (`id="CarShowcase"`, 1080x1920 @ 30fps)
- **Model:** `public/models/MUSCLE_CAR.glb` (6.2 MB)
- **Architecture:** `@remotion/three` with React Three Fiber.
- **Act Breakdown:**
  1. **Act 1 (Frames 0–240):** 360° Studio Turntable rotating at low hero 3/4 angle.
  2. **Act 2 (Frames 240–500):** High-speed chase drive with road bump micro-vibrations and wheel spin.
  3. **Act 3 (Frames 500–760):** Lateral power drift with active front-wheel counter-steer and body suspension roll.
  4. **Act 4 (Frames 760–1000):** Exploded holographic engineering schematic with floating engine, chassis, and body panels.
- **Telemetry Overlay:** `CarHUD.tsx` renders live digital speedometer, RPM bar, and lateral G-force vector.

---

## 4. Case Study 4: Explainer Shorts (`src/battery/` & `src/temple/`)

### 4.1 Temple Architecture Short (`src/temple/`)
- **Composition:** `TempleShortComposition`
- **Topic:** Brihadeeswarar Temple 80-ton granite Kumbam apex stone.
- **Visuals:** Mathematical geometric elevations, construction incline ramp animations, structural force diagrams.
- **Timing:** Synchronized to spoken words using `makeAnchors()` and `Word[]` timing arrays.

### 4.2 Battery Short (`src/battery/`)
- **Composition:** `BatteryShortComposition`
- **Topic:** Why smartphones shut down unexpectedly at 1% battery.
- **Visuals:** Internal battery voltage curves, chemical lithium degradation tanks, voltage drops during camera flash activation.

---

## 5. Preservation Directive: Which Files Must NOT Be Modified

To protect existing legacy productions:
- **DO NOT MODIFY:**
  - `src/part1/`, `src/part2/`, `src/part3/`, `src/part3_master_42s/`, `src/part3_viral/`
  - `src/car/CarShowcase.tsx`, `src/car/MuscleCarRig.tsx`
  - `src/battery/`, `src/temple/`
- **SAFE TO EXTEND:**
  - `src/engine/scenes/` (Adding new scene primitives)
  - `src/characters/designs.ts` & `src/characters/geometry.tsx` (Adding new characters/poses)
  - `scripts/ai_production_director.py` (Adding narrative templates)
