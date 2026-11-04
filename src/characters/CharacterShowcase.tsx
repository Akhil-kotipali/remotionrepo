import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import Character from "./Character";
import { CharacterId, Emotion, Pose, View } from "./types";

const samples: { id: CharacterId; emotion: Emotion; pose: Pose; view: View; label: string }[] = [
  { id: "arjun", emotion: "scared", pose: "phone", view: "front", label: "ARJUN" },
  { id: "dev", emotion: "relieved", pose: "talking", view: "threeQuarter", label: "DEV" },
  { id: "rahul", emotion: "angry", pose: "armsCrossed", view: "front", label: "RAHUL" },
  { id: "meera", emotion: "worried", pose: "camera", view: "front", label: "MEERA" },
  { id: "kabir", emotion: "neutral", pose: "idle", view: "threeQuarter", label: "KABIR" },
  { id: "nisha", emotion: "sad", pose: "idle", view: "front", label: "NISHA" },
];

export const CharacterShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 35%, #292D35 0%, #111318 68%)",
        color: "#F0EEE9",
        fontFamily: "Arial, sans-serif",
        padding: 54,
      }}
    >
      <div style={{ fontSize: 28, letterSpacing: 5, fontWeight: 700 }}>
        EVERYONE REMEMBERS IT DIFFERENTLY
      </div>
      <div style={{ fontSize: 13, letterSpacing: 4, color: "#9DA3AC", marginTop: 10 }}>
        CHARACTER MODEL SHEET / 01
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: 20,
        flex: 1,
        marginTop: 28,
      }}>
        {samples.map((item, i) => (
          <div key={item.id} style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(145deg, rgba(255,255,255,.055), rgba(0,0,0,.12))",
            border: "1px solid rgba(255,255,255,.10)",
            borderRadius: 14,
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: "auto 0 0",
              height: "48%", background: "linear-gradient(transparent, rgba(0,0,0,.38))",
            }} />
            <Character
              id={item.id}
              emotion={item.emotion}
              pose={item.pose}
              view={item.view}
              width={220}
              height={385}
              frame={frame}
              animationOffset={i * 17}
            />
            <div style={{
              position: "absolute", left: 18, bottom: 14,
              fontSize: 16, letterSpacing: 3, fontWeight: 700,
            }}>{item.label}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
