# EXAMPLE 2: CHARACTER-DRIVEN SCENE

This example demonstrates how to construct a multi-character dialogue scene using the procedural SVG character rigs (`Character.tsx`) without writing complex animation math.

---

## 1. Scene Implementation (`CharacterScene.tsx`)

```tsx
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Character } from "../../characters/Character";

export const CharacterScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera slow push-in on the conversation
  const cameraZoom = interpolate(frame, [0, 150], [1.0, 1.12], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0f1d",
        overflow: "hidden",
        transformOrigin: "540px 1400px",
        transform: `scale(${cameraZoom})`,
      }}
    >
      {/* 1. Background Environment Plate */}
      <AbsoluteFill style={{ filter: "brightness(0.55) contrast(1.15)" }}>
        <Img
          src={staticFile("backgrounds/living_room.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* 2. Character 1: Arjun (Left, Speaking, Phone in Hand) */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 1050,
          width: 480,
          height: 800,
        }}
      >
        <Character
          id="arjun"
          emotion={frame > 45 ? "shocked" : "neutral"}
          pose={frame > 45 ? "phone" : "idle"}
          facing="right"
          width={480}
          height={800}
        />
      </div>

      {/* 3. Character 2: Meera (Right, Listening, Concerned) */}
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 1080,
          width: 450,
          height: 780,
        }}
      >
        <Character
          id="meera"
          emotion="worried"
          pose="camera"
          facing="left"
          width={450}
          height={780}
        />
      </div>

      {/* 4. Speech Bubble Over Arjun */}
      {frame > 30 && (
        <div
          style={{
            position: "absolute",
            left: 200,
            top: 920,
            background: "#ffffff",
            color: "#000000",
            padding: "16px 24px",
            borderRadius: "20px 20px 20px 0px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: 24,
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          }}
        >
          Look at the doorway behind you.
        </div>
      )}
    </AbsoluteFill>
  );
};
```

---

## 2. Using via Dynamic JSON Configuration
Instead of creating `CharacterScene.tsx`, the same scene can be created purely in `manifest.json`:
```json
{
  "type": "dialogue",
  "backgroundPlate": "backgrounds/living_room.jpg",
  "characters": [
    { "id": "arjun", "position": { "x": 120, "y": 1050 }, "pose": "phone", "expression": "shocked" },
    { "id": "meera", "position": { "x": 540, "y": 1080 }, "pose": "camera", "expression": "worried" }
  ],
  "speechBubbleText": "Look at the doorway behind you."
}
```
