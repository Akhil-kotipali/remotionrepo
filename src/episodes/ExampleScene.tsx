import React from "react";
import { AbsoluteFill } from "remotion";
import { Character } from "../characters";

export const ExampleScene: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#101318" }}>
    <div style={{ position: "absolute", left: 180, bottom: 100 }}>
      <Character
        id="arjun"
        emotion="scared"
        pose="phone"
        view="threeQuarter"
        gaze="left"
        width={300}
        height={525}
      />
    </div>

    <div style={{ position: "absolute", right: 180, bottom: 100 }}>
      <Character
        id="dev"
        emotion="worried"
        pose="talking"
        view="threeQuarter"
        facing="left"
        width={300}
        height={525}
      />
    </div>
  </AbsoluteFill>
);
