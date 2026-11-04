import React from "react";
import {useCurrentFrame} from "remotion";
import {rnd} from "../part3/math";

// 45 Floating 3D Dust Motes distributed across Z space
const DUST_PARTICLES = Array.from({length: 45}, (_, i) => ({
  x: 100 + rnd(`px${i}`) * 880,
  y: 600 + rnd(`py${i}`) * 900,
  z: -300 + rnd(`pz${i}`) * 650, // -300px to +350px
  size: 2.0 + rnd(`pr${i}`) * 4.0,
  speed: 0.15 + rnd(`ps${i}`) * 0.45,
  phase: rnd(`pp${i}`) * 6.28,
  glow: rnd(`pg${i}`) > 0.6,
}));

export const Room25D: React.FC = () => {
  const f = useCurrentFrame();

  // Hanging lamp gentle physics sway
  const lampSway = Math.sin(f * 0.07) * 2.2;

  // Window rain drops animation
  const rainOffset = (f * 18) % 400;

  // Sub-bass heartbeat light pulse (hits on frames 0, 48, 96, 132)
  const hbPulse =
    Math.max(
      0,
      Math.sin(f * 0.2) * (f < 12 ? 1 : 0.4)
    );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformStyle: "preserve-3d",
        pointerEvents: "none",
      }}
    >
      {/* =================================================================== */}
      {/* 1. DEEP BACK WALL (translateZ: -520px)                              */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          left: -200,
          top: -200,
          width: 1480,
          height: 2320,
          transform: "translateZ(-520px)",
          background: "linear-gradient(180deg, #090e17 0%, #0d1522 55%, #080c14 100%)",
          boxShadow: "inset 0 0 150px rgba(0,0,0,0.9)",
          overflow: "hidden",
        }}
      >
        {/* Wall Panel Wainscoting Lines */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 950,
            background: "linear-gradient(180deg, #060910 0%, #0a0f1a 100%)",
            borderTop: "8px solid #1e293b",
            boxShadow: "0 -8px 24px rgba(0,0,0,0.8)",
          }}
        >
          {/* Vertical wood panel slats */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "repeating-linear-gradient(90deg, transparent 0px, transparent 110px, rgba(0,0,0,0.4) 110px, rgba(0,0,0,0.4) 114px, rgba(255,255,255,0.03) 114px, rgba(255,255,255,0.03) 116px)",
            }}
          />
        </div>

        {/* Crooked Picture Frame on Back Wall (Left) */}
        <div
          style={{
            position: "absolute",
            left: 280,
            top: 720,
            width: 140,
            height: 190,
            border: "6px solid #1e293b",
            borderRadius: 4,
            background: "#080c14",
            transform: "rotate(-3.5deg)",
            boxShadow: "10px 15px 25px rgba(0,0,0,0.85), inset 0 0 10px rgba(0,0,0,0.9)",
          }}
        >
          {/* Distant eerie landscape inside frame */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "radial-gradient(circle at 50% 40%, #1e293b 0%, #070a10 80%)",
              opacity: 0.8,
            }}
          />
        </div>

        {/* Vintage Wall Sconce (Left Amber Light Source) */}
        <div
          style={{
            position: "absolute",
            left: 210,
            top: 650,
            width: 20,
            height: 40,
            background: "#451a03",
            borderRadius: 4,
          }}
        >
          {/* Glowing Bulb */}
          <div
            style={{
              position: "absolute",
              top: -12,
              left: 2,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#fbbf24",
              boxShadow: "0 0 40px 20px rgba(251, 191, 36, 0.35), 0 0 120px 60px rgba(245, 158, 11, 0.2)",
            }}
          />
        </div>

        {/* Tall Arched Window (Right Cold Moonlight Source) */}
        <div
          style={{
            position: "absolute",
            right: 220,
            top: 480,
            width: 220,
            height: 480,
            border: "10px solid #1e293b",
            borderTopLeftRadius: 110,
            borderTopRightRadius: 110,
            background: "linear-gradient(180deg, #0f172a 0%, #080d1a 100%)",
            boxShadow: "0 0 80px rgba(56, 189, 248, 0.25), inset 0 0 30px rgba(56,189,248,0.2)",
            overflow: "hidden",
          }}
        >
          {/* Window Panes Grid */}
          <div style={{position: "absolute", left: "50%", top: 0, bottom: 0, width: 4, background: "#1e293b", transform: "translateX(-50%)"}} />
          <div style={{position: "absolute", top: 180, left: 0, right: 0, height: 4, background: "#1e293b"}} />
          <div style={{position: "absolute", top: 320, left: 0, right: 0, height: 4, background: "#1e293b"}} />

          {/* Rain streaks trickling */}
          <svg viewBox="0 0 220 480" style={{position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.4}}>
            <line x1="40" y1={rainOffset} x2="38" y2={rainOffset + 35} stroke="#93c5fd" strokeWidth="1.5" />
            <line x1="80" y1={(rainOffset + 90) % 400} x2="78" y2={(rainOffset + 90) % 400 + 40} stroke="#93c5fd" strokeWidth="1.5" />
            <line x1="140" y1={(rainOffset + 210) % 400} x2="138" y2={(rainOffset + 210) % 400 + 45} stroke="#93c5fd" strokeWidth="1.5" />
            <line x1="180" y1={(rainOffset + 140) % 400} x2="178" y2={(rainOffset + 140) % 400 + 30} stroke="#93c5fd" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Volumetric Window Light Beam (God Ray cutting across floor) */}
        <div
          style={{
            position: "absolute",
            right: 180,
            top: 500,
            width: 550,
            height: 1200,
            background: "linear-gradient(135deg, rgba(56, 189, 248, 0.16) 0%, rgba(56, 189, 248, 0.06) 40%, transparent 80%)",
            transform: "rotate(32deg)",
            transformOrigin: "top right",
            pointerEvents: "none",
            filter: "blur(20px)",
          }}
        />
      </div>

      {/* =================================================================== */}
      {/* 2. 3D HARDWOOD FLOOR PLANE (rotateX: 78deg, perspective depth)     */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          left: -400,
          bottom: -200,
          width: 1880,
          height: 1400,
          transform: "rotateX(78deg) translateZ(-160px) translateY(420px)",
          transformOrigin: "50% 100%",
          background: "linear-gradient(180deg, #070a10 0%, #0d121c 50%, #111827 100%)",
          boxShadow: "inset 0 100px 120px rgba(0,0,0,0.95)",
        }}
      >
        {/* Perspective Wood Planks */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "repeating-linear-gradient(0deg, transparent 0px, transparent 60px, rgba(0,0,0,0.5) 60px, rgba(0,0,0,0.5) 63px, rgba(255,255,255,0.02) 63px, rgba(255,255,255,0.02) 64px)",
          }}
        />

        {/* Floor Specular Light Sheen (Reflection of window and lamp) */}
        <div
          style={{
            position: "absolute",
            left: "40%",
            top: "20%",
            width: 700,
            height: 600,
            background: "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.12) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 75%)",
            filter: "blur(30px)",
            pointerEvents: "none",
          }}
        />

        {/* Forensic Yellow Evidence Markers on Floor */}
        <div
          style={{
            position: "absolute",
            left: 780,
            top: 620,
            width: 32,
            height: 38,
            background: "#facc15",
            border: "2px solid #ca8a04",
            borderRadius: 3,
            boxShadow: "0 4px 10px rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "monospace",
            fontWeight: 900,
            fontSize: 18,
            color: "#000",
            transform: "rotate(-12deg)",
          }}
        >
          01
        </div>

        <div
          style={{
            position: "absolute",
            left: 1120,
            top: 700,
            width: 32,
            height: 38,
            background: "#facc15",
            border: "2px solid #ca8a04",
            borderRadius: 3,
            boxShadow: "0 4px 10px rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "monospace",
            fontWeight: 900,
            fontSize: 18,
            color: "#000",
            transform: "rotate(18deg)",
          }}
        >
          02
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. 3D FLOATING ATMOSPHERIC DUST MOTES (Multi-depth parallax)       */}
      {/* =================================================================== */}
      <div style={{position: "absolute", inset: 0, transformStyle: "preserve-3d"}}>
        {DUST_PARTICLES.map((d, i) => {
          const dy = Math.sin(f * d.speed + d.phase) * 25;
          const dx = Math.cos(f * d.speed * 0.7 + d.phase) * 15;
          // Depth-based blur: particles close to camera (Z > 100) are soft-blurred
          const blur = d.z > 150 ? 3.5 : d.z > 0 ? 1.5 : 0;
          const opacity = d.z > 150 ? 0.35 : 0.65;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: d.x + dx,
                top: d.y + dy,
                width: d.size,
                height: d.size,
                borderRadius: "50%",
                background: d.glow ? "#93c5fd" : "#fde68a",
                boxShadow: d.glow ? `0 0 ${d.size * 2}px #93c5fd` : `0 0 ${d.size}px #fde68a`,
                transform: `translateZ(${d.z}px)`,
                filter: blur > 0 ? `blur(${blur}px)` : undefined,
                opacity,
              }}
            />
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* 4. FOREGROUND PARALLAX ELEMENTS (Z = +280px to +340px)             */}
      {/* =================================================================== */}
      {/* Vintage Industrial Ceiling Pendant Lamp */}
      <div
        style={{
          position: "absolute",
          left: 480,
          top: -60,
          transformStyle: "preserve-3d",
          transform: `translateZ(280px) rotate(${lampSway}deg)`,
          transformOrigin: "50% 0%",
          zIndex: 110,
        }}
      >
        {/* Cord */}
        <div style={{width: 3, height: 260, background: "#1e293b", margin: "0 auto"}} />
        {/* Metal Shade */}
        <div
          style={{
            width: 90,
            height: 35,
            background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
            borderRadius: "45px 45px 0 0",
            border: "2px solid #334155",
            margin: "0 auto",
            boxShadow: "0 10px 25px rgba(0,0,0,0.85)",
          }}
        />
        {/* Glowing Filament */}
        <div
          style={{
            width: 18,
            height: 22,
            background: "#fed7aa",
            borderRadius: "50%",
            margin: "-4px auto 0 auto",
            boxShadow: "0 0 30px 15px rgba(254, 215, 170, 0.6), 0 0 90px 40px rgba(249, 115, 22, 0.35)",
            transform: `scale(${1.0 + hbPulse * 0.15})`,
          }}
        />
      </div>

      {/* Coffee Table Edge with Case File Dossier in Extreme Foreground (Z: +240px) */}
      <div
        style={{
          position: "absolute",
          right: -80,
          bottom: -40,
          width: 440,
          height: 260,
          transform: "translateZ(240px) rotate(-8deg)",
          background: "linear-gradient(135deg, #090d14 0%, #05070a 100%)",
          borderRadius: 16,
          border: "3px solid #1e293b",
          boxShadow: "0 -20px 50px rgba(0,0,0,0.9)",
          filter: "blur(3.5px)", // Cinematic shallow depth of field
          zIndex: 105,
        }}
      >
        {/* Dossier Folder on Table */}
        <div
          style={{
            position: "absolute",
            left: 50,
            top: 40,
            width: 220,
            height: 150,
            background: "#78350f",
            borderRadius: 6,
            transform: "rotate(6deg)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.8)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 20,
              background: "#ef4444",
              color: "#fff",
              fontFamily: "monospace",
              fontWeight: 900,
              fontSize: 12,
              padding: "4px 8px",
              borderRadius: 3,
            }}
          >
            CONFIDENTIAL
          </div>
        </div>
      </div>
    </div>
  );
};
