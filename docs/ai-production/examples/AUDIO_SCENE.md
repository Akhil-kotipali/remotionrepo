# EXAMPLE 3: SCENE WITH NARRATION & SOUND EFFECTS

This example demonstrates how to integrate neural dialogue, ambient drones, spatial SFX cues, and kinetic captions using the universal engine components.

---

## 1. Scene Implementation (`AudioScene.tsx`)

```tsx
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { UniversalCaptions } from "../../engine/UniversalCaptions";

export const AudioScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#020617" }}>
      {/* 1. Master Voiceover Narration */}
      <Audio src={staticFile("audio/voiceover_master.wav")} volume={1.0} />

      {/* 2. Low-Frequency Tension Drone (Looped) */}
      <Audio src={staticFile("audio/sfx/ear_ring.wav")} volume={0.20} loop />

      {/* 3. Timed Spatial SFX Cues */}
      {/* Heavy sub-bass drop on frame 0 */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/sfx/impact_boom.wav")} volume={0.9} />
      </Sequence>

      {/* Violent glass fracture impact on frame 90 */}
      <Sequence from={90}>
        <Audio src={staticFile("audio/sfx/crack_glass.wav")} volume={1.0} />
      </Sequence>

      {/* 4. Kinetic Subtitles Overlay */}
      <UniversalCaptions
        sentences={[
          {
            startSec: 0.0,
            endSec: 3.0,
            text: "Your reflection isn't supposed to move after you leave.",
            yellowWords: ["REFLECTION", "ISN'T", "MOVE", "LEAVE"],
          },
          {
            startSec: 3.0,
            endSec: 6.0,
            text: "You freeze. But inside the glass... it starts knocking.",
            yellowWords: ["FREEZE", "GLASS", "KNOCKING"],
            redWords: ["KNOCKING"],
          },
        ]}
        fps={30}
        topY={1280}
      />
    </AbsoluteFill>
  );
};
```
