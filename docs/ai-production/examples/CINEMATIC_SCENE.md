# EXAMPLE 4: CINEMATIC 3D VEHICLE SCENE

This example demonstrates how to build a 3D scene inside `@remotion/three` using the `MuscleCarRig` and dynamic camera animation.

---

## 1. Scene Implementation (`Cinematic3DScene.tsx`)

```tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { MuscleCarRig } from "../../car/MuscleCarRig";
import { CarCamera } from "../../car/CarCamera";
import { CarEnvironment } from "../../car/CarEnvironment";
import { CarHUD } from "../../car/CarHUD";

export const Cinematic3DScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#020617" }}>
      {/* 1. Full-Screen Three.js Canvas */}
      <ThreeCanvas
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          background: "transparent",
        }}
      >
        {/* Studio Lighting & Ambient Fog */}
        <CarEnvironment mode="turntable" />

        {/* 360° Studio Orbit Camera */}
        <CarCamera mode="turntable" frame={frame} fps={fps} />

        {/* 3D Model Rig with Active Wheel Rotation */}
        <MuscleCarRig
          steerAngle={0}
          wheelRotation={(frame / fps) * 8}
          bodyRoll={0}
          explodeFactor={0}
        />
      </ThreeCanvas>

      {/* 2. 2D Telemetry HUD Overlay */}
      <CarHUD
        mode="turntable"
        localFrame={frame}
        durationInFrames={durationInFrames}
      />
    </AbsoluteFill>
  );
};
```
