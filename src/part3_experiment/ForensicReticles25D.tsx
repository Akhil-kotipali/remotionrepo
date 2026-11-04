import React from "react";
import {useCurrentFrame} from "remotion";
import {kf, E} from "../part3/math";
import {MONO, INTER} from "../part3/fonts";

interface ReticleProps {
  label: string;
  sublabel: string;
  color: string;
  x: number;
  y: number;
  z: number;
  yaw: number;
  startFrame: number;
  pulseBpm?: number;
}

export const SuspectReticle: React.FC<ReticleProps> = ({
  label,
  sublabel,
  color,
  x,
  y,
  z,
  yaw,
  startFrame,
  pulseBpm = 110,
}) => {
  const f = useCurrentFrame();
  if (f < startFrame || f >= 45) return null;

  const s =
    kf(f, [
      [startFrame, 0],
      [startFrame + 5, 1.12, E.back],
      [startFrame + 9, 1.0, E.out],
    ]) * kf(f, [[40, 1], [44, 0]]);

  const pulse = 0.85 + 0.15 * Math.sin((f * pulseBpm * 2 * Math.PI) / (30 * 60));

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transformStyle: "preserve-3d",
        transform: `translate(-50%, -100%) translate3d(0, 0, ${z}px) rotateY(${yaw}deg) scale(${s})`,
        zIndex: 90,
        pointerEvents: "none",
        opacity: s,
      }}
    >
      {/* 2.5D Tactical HUD Bracket */}
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          background: "rgba(6, 10, 20, 0.94)",
          border: `1.5px solid ${color}`,
          borderRadius: 8,
          padding: "4px 10px",
          boxShadow: `0 0 16px ${color}77, inset 0 0 8px ${color}33`,
          whiteSpace: "nowrap",
        }}
      >
        <div style={{display: "flex", alignItems: "center", gap: 6}}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 6px ${color}`,
              transform: `scale(${pulse})`,
            }}
          />
          <span style={{fontFamily: MONO, fontWeight: 900, fontSize: 13, color: "#ffffff", letterSpacing: 1.5}}>
            {label}
          </span>
        </div>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 9.5, color, letterSpacing: 1, marginTop: 1}}>
          {sublabel}
        </div>
      </div>

      {/* Target Pin Laser Line dropping toward character head */}
      <div
        style={{
          width: 2,
          height: 14,
          background: `linear-gradient(to bottom, ${color}, transparent)`,
          margin: "0 auto",
        }}
      />
    </div>
  );
};

export const ForensicReticles25D: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <div style={{position: "absolute", inset: 0, transformStyle: "preserve-3d", pointerEvents: "none"}}>
      {/* Reticles appear in Phase 1 (Frames 0 - 44) with curved arch over lineup */}
      {/* Suspect 2: Meera */}
      <SuspectReticle
        label="SUSPECT 2 · MEERA"
        sublabel="BPM: 124 · EYE SHIFT"
        color="#ec4899"
        x={215}
        y={840}
        z={-10}
        yaw={16}
        startFrame={14}
        pulseBpm={124}
      />

      {/* Suspect 4: Nisha */}
      <SuspectReticle
        label="SUSPECT 4 · NISHA"
        sublabel="BPM: 132 · STRESS HIGH"
        color="#f59e0b"
        x={395}
        y={810}
        z={-20}
        yaw={8}
        startFrame={22}
        pulseBpm={132}
      />

      {/* Suspect 1: Rahul */}
      <SuspectReticle
        label="SUSPECT 1 · RAHUL"
        sublabel="BPM: 118 · DEFENSIVE"
        color="#06b6d4"
        x={800}
        y={810}
        z={-10}
        yaw={-14}
        startFrame={8}
        pulseBpm={118}
      />

      {/* Suspect 3: Kabir */}
      <SuspectReticle
        label="SUSPECT 3 · KABIR"
        sublabel="BPM: 106 · OCULAR LOCK"
        color="#a855f7"
        x={940}
        y={840}
        z={-30}
        yaw={-22}
        startFrame={30}
        pulseBpm={106}
      />

      {/* Arjun: Center Witness */}
      <SuspectReticle
        label="KEY WITNESS · ARJUN"
        sublabel="EVIDENCE IN HAND"
        color="#84cc16"
        x={610}
        y={775}
        z={80}
        yaw={-2}
        startFrame={4}
        pulseBpm={98}
      />

      {/* Statement Conflict Matrix (Frames 94 - 150) */}
      {f >= 94 && (
        <div
          style={{
            position: "absolute",
            top: 240,
            left: "50%",
            transform: "translate(-50%, 0) translateZ(60px)",
            textAlign: "center",
            opacity: kf(f, [[94, 0], [98, 1]]),
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(10, 16, 32, 0.95)",
              border: "2px solid #ef4444",
              borderRadius: 14,
              padding: "10px 32px",
              boxShadow: "0 0 35px rgba(239, 68, 68, 0.6), inset 0 0 15px rgba(239,68,68,0.3)",
            }}
          >
            <div style={{fontFamily: MONO, fontWeight: 900, fontSize: 20, letterSpacing: 4, color: "#f87171"}}>
              ⚠️ COGNITIVE CONFLICT: 4 CONTRADICTIONS
            </div>
            <div style={{fontFamily: INTER, fontWeight: 900, fontSize: 32, color: "#ffffff", marginTop: 4, letterSpacing: 1}}>
              NONE OF THEIR MEMORIES MATCH
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
