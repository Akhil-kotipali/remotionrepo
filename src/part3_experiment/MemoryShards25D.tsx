import React from "react";
import {useCurrentFrame} from "remotion";
import {kf, E} from "../part3/math";
import {MONO, INTER} from "../part3/fonts";

interface MemoryShardProps {
  id: "rahul" | "meera" | "kabir" | "nisha";
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  color: string;
  glowColor: string;
  speaker: string;
  quote: string;
  startFrame: number;
}

export const MemoryShard: React.FC<MemoryShardProps> = ({
  id,
  x,
  y,
  z,
  yaw,
  pitch,
  color,
  glowColor,
  speaker,
  quote,
  startFrame,
}) => {
  const f = useCurrentFrame();
  if (f < startFrame) return null;

  // Staggered pop-in with snappy bounce
  const enter = kf(f, [
    [startFrame, 0],
    [startFrame + 8, 1.08, E.back],
    [startFrame + 14, 1.0, E.out],
  ]);

  // Gentle 3D floating hover
  const hoverY = Math.sin((f - startFrame) * 0.12 + startFrame) * 6;
  const hoverYaw = Math.cos((f - startFrame) * 0.08) * 1.5;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + hoverY,
        width: 235,
        height: 205,
        transformStyle: "preserve-3d",
        transform: `translate(-50%, -50%) translate3d(0, 0, ${z}px) rotateY(${yaw + hoverYaw}deg) rotateX(${pitch}deg) scale(${enter})`,
        zIndex: 80,
        pointerEvents: "none",
        opacity: enter,
      }}
    >
      {/* --- 2.5D GLASS HOLOGRAPHIC CONTAINER --- */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, rgba(10, 16, 28, 0.94) 0%, rgba(6, 10, 18, 0.96) 100%)",
          border: `2px solid ${color}`,
          borderRadius: 16,
          boxShadow: `0 0 35px ${glowColor}, inset 0 0 20px ${glowColor}`,
          padding: "14px 16px",
          boxSizing: "border-box",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Holographic Scanlines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 4px)",
            pointerEvents: "none",
          }}
        />

        {/* Top Header: Speaker Name & Memory ID */}
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${color}44`, paddingBottom: 6}}>
          <div style={{display: "flex", alignItems: "center", gap: 6}}>
            <div style={{width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}`}} />
            <span style={{fontFamily: MONO, fontWeight: 900, fontSize: 13, color: "#ffffff", letterSpacing: 1.5}}>
              {speaker.toUpperCase()}
            </span>
          </div>
          <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 11, color, letterSpacing: 1}}>
            VERSION 0{id === "rahul" ? "1" : id === "meera" ? "2" : id === "kabir" ? "3" : "4"}
          </span>
        </div>

        {/* Memory Illustration */}
        <div style={{marginTop: 10, height: 90, position: "relative", display: "flex", alignItems: "center", justifyContent: "center"}}>
          {id === "rahul" && (
            // Dev walking alone in cold fog
            <svg viewBox="0 0 200 90" style={{width: "100%", height: "100%"}}>
              {/* Cold Fog */}
              <ellipse cx="100" cy="80" rx="90" ry="14" fill="#06b6d4" opacity={0.2} />
              {/* Lonely silhouette */}
              <circle cx="100" cy="24" r="9" fill="#06b6d4" />
              <line x1="100" y1="33" x2="100" y2="60" stroke="#06b6d4" strokeWidth="4" />
              <line x1="100" y1="60" x2="88" y2="82" stroke="#06b6d4" strokeWidth="4" />
              <line x1="100" y1="60" x2="112" y2="80" stroke="#06b6d4" strokeWidth="4" />
              {/* Mist particles */}
              <circle cx="60" cy="40" r="2" fill="#a5f3fc" opacity={0.6} />
              <circle cx="140" cy="30" r="1.5" fill="#a5f3fc" opacity={0.6} />
              <circle cx="170" cy="50" r="2.5" fill="#a5f3fc" opacity={0.4} />
            </svg>
          )}

          {id === "meera" && (
            // Arjun trailing behind Dev
            <svg viewBox="0 0 200 90" style={{width: "100%", height: "100%"}}>
              <ellipse cx="100" cy="80" rx="90" ry="14" fill="#ec4899" opacity={0.2} />
              {/* Dev ahead */}
              <circle cx="135" cy="24" r="8" fill="#4b72a3" />
              <line x1="135" y1="32" x2="135" y2="58" stroke="#4b72a3" strokeWidth="3.5" />
              <line x1="135" y1="58" x2="145" y2="78" stroke="#4b72a3" strokeWidth="3.5" />
              {/* Arjun creeping behind */}
              <circle cx="75" cy="28" r="8" fill="#ec4899" />
              <line x1="75" y1="36" x2="75" y2="60" stroke="#ec4899" strokeWidth="4" />
              <line x1="75" y1="60" x2="65" y2="80" stroke="#ec4899" strokeWidth="4" />
              {/* Warning exclamation */}
              <text x="100" y="35" fontFamily={MONO} fontWeight="900" fontSize="18" fill="#f43f5e" textAnchor="middle">
                ⚠️
              </text>
            </svg>
          )}

          {id === "kabir" && (
            // Violent argument soundwave / shouting figures
            <svg viewBox="0 0 200 90" style={{width: "100%", height: "100%"}}>
              <ellipse cx="100" cy="80" rx="90" ry="14" fill="#a855f7" opacity={0.2} />
              {/* Audio waveform spikes */}
              <g stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round">
                <line x1="40" y1="45" x2="40" y2="55" />
                <line x1="55" y1="35" x2="55" y2="65" />
                <line x1="70" y1="20" x2="70" y2="80" />
                <line x1="85" y1="12" x2="85" y2="88" strokeWidth="3.5" stroke="#f43f5e" />
                <line x1="100" y1="25" x2="100" y2="75" />
                <line x1="115" y1="10" x2="115" y2="90" strokeWidth="3.5" stroke="#f43f5e" />
                <line x1="130" y1="28" x2="130" y2="72" />
                <line x1="145" y1="38" x2="145" y2="62" />
                <line x1="160" y1="44" x2="160" y2="56" />
              </g>
            </svg>
          )}

          {id === "nisha" && (
            // "Don't touch me!" sudden alarm / red flare
            <svg viewBox="0 0 200 90" style={{width: "100%", height: "100%"}}>
              <ellipse cx="100" cy="80" rx="90" ry="14" fill="#f59e0b" opacity={0.2} />
              {/* Grabbing Hand Silhouette */}
              <circle cx="100" cy="45" r="30" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
              <text x="100" y="44" fontFamily={INTER} fontWeight="900" fontSize="16" fill="#fef08a" textAnchor="middle">
                "DON'T TOUCH ME!"
              </text>
              <text x="100" y="64" fontFamily={MONO} fontWeight="700" fontSize="11" fill="#f87171" textAnchor="middle">
                [ UNIDENTIFIED VOICE ]
              </text>
            </svg>
          )}
        </div>

        {/* Bottom Quote Banner */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 12,
            right: 12,
            background: "rgba(0, 0, 0, 0.6)",
            border: `1px solid ${color}66`,
            borderRadius: 6,
            padding: "6px 8px",
            textAlign: "center",
          }}
        >
          <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 13, color: "#ffffff", letterSpacing: 0.5}}>
            {quote}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MemoryShards25D: React.FC = () => {
  return (
    <div style={{position: "absolute", inset: 0, transformStyle: "preserve-3d", pointerEvents: "none"}}>
      {/* 1. Meera's Memory Shard (Left Foreground) */}
      <MemoryShard
        id="meera"
        speaker="Meera"
        quote='"Arjun followed him."'
        color="#ec4899"
        glowColor="rgba(236, 72, 153, 0.45)"
        x={200}
        y={710}
        z={20}
        yaw={18}
        pitch={4}
        startFrame={94}
      />

      {/* 2. Nisha's Memory Shard (Center-Left) */}
      <MemoryShard
        id="nisha"
        speaker="Nisha"
        quote='"Someone shouted."'
        color="#f59e0b"
        glowColor="rgba(245, 158, 11, 0.45)"
        x={390}
        y={680}
        z={-20}
        yaw={8}
        pitch={5}
        startFrame={97}
      />

      {/* 3. Rahul's Memory Shard (Center-Right) */}
      <MemoryShard
        id="rahul"
        speaker="Rahul"
        quote='"Dev left alone."'
        color="#06b6d4"
        glowColor="rgba(6, 182, 212, 0.45)"
        x={770}
        y={680}
        z={-10}
        yaw={-10}
        pitch={5}
        startFrame={100}
      />

      {/* 4. Kabir's Memory Shard (Right Foreground) */}
      <MemoryShard
        id="kabir"
        speaker="Kabir"
        quote='"Heard an argument."'
        color="#a855f7"
        glowColor="rgba(168, 85, 247, 0.45)"
        x={940}
        y={710}
        z={10}
        yaw={-18}
        pitch={4}
        startFrame={103}
      />
    </div>
  );
};
