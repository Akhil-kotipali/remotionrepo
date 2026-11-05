# EXAMPLE 1: SIMPLE REMOTION SCENE

This example demonstrates how to create a basic Remotion scene using existing repository components (`AbsoluteFill`, `Img`, `staticFile`, `interpolate`, `Easing`).

---

## 1. Scene Implementation (`SimpleScene.tsx`)

```tsx
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

export interface SimpleSceneProps {
  title: string;
  imagePath: string; // Relative to public/
}

export const SimpleScene: React.FC<SimpleSceneProps> = ({ title, imagePath }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Subtle continuous push-in zoom
  const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  // Fade-in text entrance
  const textOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textY = interpolate(frame, [10, 25], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#030712", overflow: "hidden" }}>
      {/* Background Plate with Zoom */}
      <AbsoluteFill
        style={{
          transformOrigin: "center center",
          transform: `scale(${zoom})`,
          filter: "brightness(0.7) contrast(1.1)",
        }}
      >
        <Img
          src={staticFile(imagePath)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Title Card */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <h1
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 900,
            fontSize: 64,
            color: "#ffffff",
            textAlign: "center",
            textShadow: "0 10px 30px rgba(0,0,0,0.8)",
            padding: "0 40px",
          }}
        >
          {title}
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

---

## 2. Rendering the Simple Scene

To render this component directly:
```bash
npx remotion still SimpleScene "output final videos/simple_frame.png" --frame=30 --overwrite
```
