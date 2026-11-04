import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import Character from "./Character";
import { CharacterId, Emotion, Pose, View, Gaze } from "./types";
import { DESIGNS } from "./designs";

// --- Sub-components & Helpers ---

const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(15,20,28,0.7))",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 18,
      boxShadow: "0 16px 36px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
      backdropFilter: "blur(14px)",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

// Dialogue speech box with cinematic styling
const DialogueBox: React.FC<{
  speaker: string;
  role: string;
  avatarColor: string;
  text: string;
  opacity: number;
  translateY: number;
}> = ({ speaker, role, avatarColor, text, opacity, translateY }) => (
  <div
    style={{
      opacity,
      transform: `translateY(${translateY}px)`,
      display: "flex",
      alignItems: "center",
      gap: 20,
      background: "linear-gradient(135deg, rgba(15, 20, 30, 0.94), rgba(8, 11, 18, 0.96))",
      border: "1px solid rgba(255, 255, 255, 0.16)",
      borderRadius: 22,
      padding: "20px 28px",
      boxShadow: "0 20px 48px rgba(0,0,0,0.7), 0 0 30px rgba(56, 189, 248, 0.08)",
      maxWidth: 960,
      width: "92%",
      margin: "0 auto",
      position: "relative",
      zIndex: 40,
    }}
  >
    <div
      style={{
        width: 54,
        height: 54,
        borderRadius: "50%",
        backgroundColor: avatarColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        fontSize: 22,
        color: "#fff",
        boxShadow: `0 0 20px ${avatarColor}99`,
        flexShrink: 0,
      }}
    >
      {speaker[0]}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: 1.5, color: "#fff" }}>
          {speaker}
        </span>
        <span
          style={{
            fontSize: 12,
            letterSpacing: 2,
            padding: "3px 10px",
            borderRadius: 6,
            background: "rgba(255,255,255,0.1)",
            color: "#94A3B8",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {role}
        </span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 500, color: "#F1F5F9", marginTop: 6, lineHeight: 1.35 }}>
        "{text}"
      </div>
    </div>
  </div>
);

// Spec badge for character profiles
const SpecPill: React.FC<{ label: string; value: string; color?: string }> = ({
  label,
  value,
  color = "#64748B",
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      padding: "8px 16px",
      background: "rgba(15, 20, 30, 0.8)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 12,
      boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
    }}
  >
    <span style={{ fontSize: 11, letterSpacing: 1.8, color, textTransform: "uppercase", fontWeight: 800 }}>
      {label}
    </span>
    <span style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC", marginTop: 2 }}>
      {value}
    </span>
  </div>
);

// Spotlight Stage Floor Glow
const StageFloor: React.FC<{ color?: string }> = ({ color = "rgba(56, 189, 248, 0.35)" }) => (
  <div
    style={{
      position: "absolute",
      bottom: 220,
      left: "5%",
      right: "5%",
      height: 90,
      background: `radial-gradient(ellipse at 50% 50%, ${color} 0%, transparent 75%)`,
      filter: "blur(24px)",
      pointerEvents: "none",
    }}
  />
);

// ==========================================
// SCENE 1: THE ENSEMBLE ROSTER (0 - 90 frames)
// ==========================================
const Scene1Roster: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 14 } });
  const titleY = interpolate(titleProgress, [0, 1], [-40, 0]);

  const cards: {
    id: CharacterId;
    role: string;
    emotion: Emotion;
    pose: Pose;
    view: View;
  }[] = [
    { id: "arjun", role: "TECH & COMMS", emotion: "worried", pose: "phone", view: "threeQuarter" },
    { id: "dev", role: "NARRATOR & LEAD", emotion: "relieved", pose: "talking", view: "threeQuarter" },
    { id: "rahul", role: "ENFORCER / DEFENSE", emotion: "angry", pose: "armsCrossed", view: "front" },
    { id: "meera", role: "FIELD SCOUT & OPTICS", emotion: "happy", pose: "camera", view: "front" },
    { id: "kabir", role: "SYSTEMS ARCHITECT", emotion: "neutral", pose: "idle", view: "threeQuarter" },
    { id: "nisha", role: "STRATEGIC OPERATIONS", emotion: "happy", pose: "idle", view: "front" },
  ];

  return (
    <AbsoluteFill
      style={{
        padding: "80px 48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: titleProgress,
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 4,
            padding: "8px 20px",
            borderRadius: 24,
            background: "rgba(56, 189, 248, 0.12)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            color: "#38BDF8",
            marginBottom: 14,
          }}
        >
          PROCEDURAL VECTOR RIGS // REMOTION
        </div>
        <h1
          style={{
            fontSize: 46,
            fontWeight: 900,
            letterSpacing: 3,
            color: "#FFFFFF",
            margin: 0,
            textShadow: "0 4px 24px rgba(0,0,0,0.9)",
          }}
        >
          CINEMATIC CHARACTER ROSTER
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#94A3B8",
            letterSpacing: 2,
            margin: "10px 0 0",
            fontWeight: 500,
          }}
        >
          6 REUSABLE VECTOR RIGS • 7 EMOTIONS • 6 ANIMATED POSES
        </p>
      </div>

      {/* Grid: 2 Columns x 3 Rows */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: 22,
          flex: 1,
          margin: "34px 0",
        }}
      >
        {cards.map((item, idx) => {
          const cardSpring = spring({
            frame: frame - idx * 5,
            fps,
            config: { damping: 15, mass: 0.8 },
          });
          const scale = interpolate(cardSpring, [0, 1], [0.85, 1]);
          const opacity = interpolate(cardSpring, [0, 1], [0, 1]);
          const d = DESIGNS[item.id];

          return (
            <div
              key={item.id}
              style={{
                opacity,
                transform: `scale(${scale})`,
                position: "relative",
                borderRadius: 20,
                background: "linear-gradient(160deg, rgba(255,255,255,0.08), rgba(8,12,18,0.85))",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 14px 28px rgba(0,0,0,0.55)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                overflow: "hidden",
                padding: "16px 18px",
              }}
            >
              {/* Unit Tag */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: d.accent,
                    boxShadow: `0 0 12px ${d.accent}`,
                  }}
                />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 900,
                    letterSpacing: 2,
                    color: "#F1F5F9",
                  }}
                >
                  {d.name.toUpperCase()}
                </span>
              </div>

              {/* Character Component */}
              <div style={{ transform: "scale(1.08)", transformOrigin: "bottom center", marginBottom: 38 }}>
                <Character
                  id={item.id}
                  emotion={item.emotion}
                  pose={item.pose}
                  view={item.view}
                  width={220}
                  height={380}
                  frame={frame}
                  animationOffset={idx * 21}
                />
              </div>

              {/* Bottom Role Label */}
              <div
                style={{
                  position: "absolute",
                  bottom: 14,
                  left: 18,
                  right: 18,
                  background: "rgba(0,0,0,0.65)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 10,
                  padding: "8px 12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid rgba(255,255,255,0.1)",
                  zIndex: 10,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, color: "#94A3B8" }}>
                  {item.role}
                </span>
                <span style={{ fontSize: 12, fontWeight: 900, color: d.accent }}>
                  #{idx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Status Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 2,
          color: "#64748B",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 18,
        }}
      >
        <span>SYSTEM: CHROMIUM HEADLESS // GPU ACCELERATED</span>
        <span style={{ color: "#10B981" }}>● PIPELINE ONLINE</span>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// SCENE 2: ARJUN & DEV (Frames 90 - 200)
// ==========================================
const Scene2ArjunDev: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const intro = spring({ frame, fps, config: { damping: 14 } });
  const arjunX = interpolate(frame, [0, 35], [-140, 0], { extrapolateRight: "clamp" });
  const devX = interpolate(frame, [0, 35], [140, 0], { extrapolateRight: "clamp" });

  const arjunPose: Pose = frame < 30 ? "walking" : "phone";
  const arjunEmotion: Emotion = frame < 45 ? "scared" : "relieved";

  return (
    <AbsoluteFill style={{ padding: "80px 48px 120px", display: "flex", flexDirection: "column" }}>
      {/* Header Tag */}
      <div style={{ textAlign: "center", opacity: intro, marginBottom: 20 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 4,
            color: "#38BDF8",
            marginBottom: 8,
          }}
        >
          DUO SPOTLIGHT // SEQUENCE 01
        </div>
        <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: 2, color: "#FFFFFF", margin: 0 }}>
          ARJUN & DEV // ACTIVE INTERACTION
        </h2>
        <p style={{ fontSize: 18, color: "#94A3B8", letterSpacing: 2, margin: "8px 0 0" }}>
          EXPRESSIVE GESTURES & PHONE SATELLITE COMMS
        </p>
      </div>

      {/* Center Stage with Two Characters */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          position: "relative",
        }}
      >
        <StageFloor color="rgba(56, 189, 248, 0.35)" />

        {/* Arjun (Left) */}
        <div
          style={{
            transform: `translateX(${arjunX}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Character
            id="arjun"
            emotion={arjunEmotion}
            pose={arjunPose}
            view="threeQuarter"
            gaze="right"
            facing="right"
            width={440}
            height={740}
            frame={frame}
          />
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <SpecPill label="Unit" value="ARJUN" color="#A8B18F" />
            <SpecPill label="Build" value="SLIM" />
            <SpecPill label="Prop" value="PHONE" />
          </div>
        </div>

        {/* Dev (Right) */}
        <div
          style={{
            transform: `translateX(${devX}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Character
            id="dev"
            emotion="relieved"
            pose="talking"
            view="threeQuarter"
            facing="left"
            gaze="left"
            width={440}
            height={740}
            frame={frame}
          />
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <SpecPill label="Unit" value="DEV" color="#526D91" />
            <SpecPill label="Pose" value="TALKING" />
            <SpecPill label="State" value="GESTURING" />
          </div>
        </div>
      </div>

      {/* Dialogue Subtitle Callout */}
      <DialogueBox
        speaker="Dev"
        role="Lead Narrator"
        avatarColor="#334A68"
        text="The telemetry link is restored! All 6 procedural rigs are synced and rendering in real-time."
        opacity={interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" })}
        translateY={interpolate(frame, [15, 30], [20, 0], { extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
};

// ==========================================
// SCENE 3: RAHUL & MEERA (Frames 200 - 310)
// ==========================================
const Scene3RahulMeera: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({ frame, fps, config: { damping: 14 } });

  // Camera flash trigger around frame 45 (within scene)
  const flashOpacity =
    frame >= 42 && frame <= 48
      ? interpolate(frame, [42, 44, 48], [0, 0.94, 0])
      : 0;

  const meeraEmotion: Emotion = frame < 44 ? "worried" : "happy";
  const meeraGaze: Gaze = frame < 44 ? "left" : "center";

  return (
    <AbsoluteFill style={{ padding: "80px 48px 120px", display: "flex", flexDirection: "column" }}>
      {/* Shutter White Flash overlay */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFFFF",
            opacity: flashOpacity,
            zIndex: 100,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Header Tag */}
      <div style={{ textAlign: "center", opacity: intro, marginBottom: 20 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 4,
            color: "#F43F5E",
            marginBottom: 8,
          }}
        >
          DUO SPOTLIGHT // SEQUENCE 02
        </div>
        <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: 2, color: "#FFFFFF", margin: 0 }}>
          RAHUL & MEERA // POSE & CAMERA RIG
        </h2>
        <p style={{ fontSize: 18, color: "#94A3B8", letterSpacing: 2, margin: "8px 0 0" }}>
          BROAD BUILD DEFENDER & FIELD OPTICS DOCUMENTATION
        </p>
      </div>

      {/* Center Stage */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          position: "relative",
        }}
      >
        <StageFloor color="rgba(244, 63, 94, 0.3)" />

        {/* Rahul (Left) - Broad Build, Arms Crossed */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Character
            id="rahul"
            emotion={frame > 50 ? "neutral" : "angry"}
            pose="armsCrossed"
            view="front"
            width={450}
            height={750}
            frame={frame}
          />
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <SpecPill label="Unit" value="RAHUL" color="#A66A53" />
            <SpecPill label="Build" value="BROAD" />
            <SpecPill label="Arms" value="CROSSED" />
          </div>
        </div>

        {/* Meera (Right) - Camera pose, facing Rahul */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Character
            id="meera"
            emotion={meeraEmotion}
            pose="camera"
            view="threeQuarter"
            facing="left"
            gaze={meeraGaze}
            width={440}
            height={740}
            frame={frame}
          />
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <SpecPill label="Unit" value="MEERA" color="#D3A3B0" />
            <SpecPill label="Prop" value="CAMERA" />
            <SpecPill label="Action" value={frame >= 44 ? "PHOTO TAKEN" : "FOCUSING"} />
          </div>
        </div>
      </div>

      {/* Dialogue Subtitle */}
      <DialogueBox
        speaker="Meera"
        role="Field Optics"
        avatarColor="#713E52"
        text="Hold that pose, Rahul! That frame capture is razor sharp. 4K rasterization locked."
        opacity={interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" })}
        translateY={interpolate(frame, [15, 30], [20, 0], { extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
};

// ==========================================
// SCENE 4: KABIR & NISHA (Frames 310 - 420)
// ==========================================
const Scene4KabirNisha: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({ frame, fps, config: { damping: 14 } });

  // Nisha walks in from right
  const nishaX = interpolate(frame, [0, 35], [160, 0], { extrapolateRight: "clamp" });
  const nishaPose: Pose = frame < 30 ? "walking" : "idle";
  const kabirGaze: Gaze = frame < 40 ? "up" : "center";

  return (
    <AbsoluteFill style={{ padding: "80px 48px 120px", display: "flex", flexDirection: "column" }}>
      {/* Header Tag */}
      <div style={{ textAlign: "center", opacity: intro, marginBottom: 20 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 4,
            color: "#10B981",
            marginBottom: 8,
          }}
        >
          DUO SPOTLIGHT // SEQUENCE 03
        </div>
        <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: 2, color: "#FFFFFF", margin: 0 }}>
          KABIR & NISHA // PRECISION RIGGING
        </h2>
        <p style={{ fontSize: 18, color: "#94A3B8", letterSpacing: 2, margin: "8px 0 0" }}>
          DYNAMIC HEIGHT VARIATION & PROCEDURAL WALK KINEMATICS
        </p>
      </div>

      {/* Center Stage */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          position: "relative",
        }}
      >
        <StageFloor color="rgba(16, 185, 129, 0.3)" />

        {/* Kabir (Left) - Glasses, Tall 1.06 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Character
            id="kabir"
            emotion="neutral"
            pose="idle"
            view="threeQuarter"
            facing="right"
            gaze={kabirGaze}
            width={440}
            height={760}
            frame={frame}
          />
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <SpecPill label="Unit" value="KABIR" color="#559092" />
            <SpecPill label="Height" value="1.06x" />
            <SpecPill label="Optics" value="GLASSES" />
          </div>
        </div>

        {/* Nisha (Right) - Walking in, smiling */}
        <div
          style={{
            transform: `translateX(${nishaX}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Character
            id="nisha"
            emotion="happy"
            pose={nishaPose}
            view="front"
            width={430}
            height={730}
            frame={frame}
          />
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <SpecPill label="Unit" value="NISHA" color="#D0AD61" />
            <SpecPill label="Style" value="BOB CUT" />
            <SpecPill label="Emotion" value="HAPPY" />
          </div>
        </div>
      </div>

      {/* Dialogue Subtitle */}
      <DialogueBox
        speaker="Nisha"
        role="Operations Lead"
        avatarColor="#B18A3D"
        text="All kinematics checked. GPU pipeline rasterization running with zero overhead and maximum FPS!"
        opacity={interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" })}
        translateY={interpolate(frame, [15, 30], [20, 0], { extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
};

// ==========================================
// SCENE 5: FINALE HERO LINEUP & RTX 3050 SPECS (420 - 540)
// ==========================================
const Scene5HeroFinale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({ frame, fps, config: { damping: 14 } });
  const zoom = interpolate(frame, [0, 110], [1.06, 1], { extrapolateRight: "clamp" });

  const roster: {
    id: CharacterId;
    emotion: Emotion;
    pose: Pose;
    view: View;
    facing?: "left" | "right";
    xOffset: number;
    scale: number;
    zIndex: number;
  }[] = [
    { id: "kabir", emotion: "neutral", pose: "idle", view: "threeQuarter", facing: "right", xOffset: -430, scale: 1.15, zIndex: 1 },
    { id: "arjun", emotion: "relieved", pose: "phone", view: "threeQuarter", facing: "right", xOffset: -260, scale: 1.2, zIndex: 2 },
    { id: "dev", emotion: "happy", pose: "talking", view: "front", xOffset: -85, scale: 1.28, zIndex: 3 },
    { id: "rahul", emotion: "neutral", pose: "armsCrossed", view: "front", xOffset: 90, scale: 1.3, zIndex: 4 },
    { id: "meera", emotion: "happy", pose: "camera", view: "threeQuarter", facing: "left", xOffset: 270, scale: 1.22, zIndex: 2 },
    { id: "nisha", emotion: "happy", pose: "idle", view: "front", xOffset: 435, scale: 1.15, zIndex: 1 },
  ];

  return (
    <AbsoluteFill
      style={{
        padding: "80px 40px 90px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${zoom})`,
        transformOrigin: "center center",
      }}
    >
      {/* Top Title Banner */}
      <div style={{ textAlign: "center", opacity: intro }}>
        <div
          style={{
            display: "inline-block",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 4,
            padding: "8px 24px",
            borderRadius: 24,
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            color: "#10B981",
            marginBottom: 12,
          }}
        >
          FULL CAST PRODUCTION ENGINE
        </div>
        <h1
          style={{
            fontSize: 48,
            fontWeight: 900,
            letterSpacing: 3,
            color: "#FFFFFF",
            margin: 0,
            textShadow: "0 4px 28px rgba(0,0,0,0.9)",
          }}
        >
          CINEMATIC VECTOR RIGS READY
        </h1>
        <p style={{ fontSize: 18, color: "#94A3B8", letterSpacing: 2, margin: "10px 0 0" }}>
          6 CHARACTERS • PROCEDURAL SVG • 60 FPS MOTION GRAPHICS
        </p>
      </div>

      {/* Characters Stage */}
      <div
        style={{
          position: "relative",
          height: 820,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        {/* Floor Horizon Glow */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "5%",
            right: "5%",
            height: 90,
            background: "radial-gradient(ellipse, rgba(56, 189, 248, 0.4) 0%, transparent 80%)",
            filter: "blur(24px)",
          }}
        />

        {/* 6 Hero Characters */}
        {roster.map((c, i) => (
          <div
            key={c.id}
            style={{
              position: "absolute",
              bottom: 45,
              transform: `translateX(${c.xOffset}px) scale(${c.scale})`,
              transformOrigin: "bottom center",
              zIndex: c.zIndex,
            }}
          >
            <Character
              id={c.id}
              emotion={c.emotion}
              pose={c.pose}
              view={c.view}
              facing={c.facing}
              width={260}
              height={450}
              frame={frame}
              animationOffset={i * 15}
            />
          </div>
        ))}
      </div>

      {/* Hardware Telemetry Card (RTX 3050 Accent) */}
      <GlassCard
        style={{
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(10, 15, 25, 0.92) 100%)",
          border: "1px solid rgba(16, 185, 129, 0.4)",
          boxShadow: "0 20px 48px rgba(0,0,0,0.8), 0 0 32px rgba(118, 185, 0, 0.15)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#76B900", // NVIDIA Green
                boxShadow: "0 0 16px #76B900",
              }}
            />
            <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: 2, color: "#FFFFFF" }}>
              NVIDIA GEFORCE RTX 3050 LAPTOP GPU
            </span>
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: 2,
              padding: "5px 12px",
              borderRadius: 8,
              background: "rgba(118, 185, 0, 0.2)",
              color: "#76B900",
              border: "1px solid rgba(118, 185, 0, 0.5)",
            }}
          >
            HARDWARE ACCELERATED
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <SpecPill label="Raster Pipeline" value="DirectX 11 ANGLE" color="#76B900" />
          <SpecPill label="Asset Footprint" value="0 KB (Pure SVG)" color="#38BDF8" />
          <SpecPill label="GPU Compute" value="CUDA + NVENC" color="#A855F7" />
        </div>
      </GlassCard>
    </AbsoluteFill>
  );
};

// ==========================================
// MAIN COMPOSITION
// ==========================================
export const CinematicShowcase: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080B10",
        background: "radial-gradient(circle at 50% 25%, #151A24 0%, #07090D 85%)",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#F8FAFC",
        overflow: "hidden",
      }}
    >
      {/* Background Cinematic Atmosphere */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.7,
        }}
      />

      {/* Audio SFX Track Elements */}
      <Sequence from={0}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={25}>
        <Audio src={staticFile("sfx/ping.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={90}>
        <Audio src={staticFile("sfx/whoosh_rev.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={115}>
        <Audio src={staticFile("sfx/slide.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={200}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={243}>
        <Audio src={staticFile("sfx/ping.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={310}>
        <Audio src={staticFile("sfx/slide.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={330}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={420}>
        <Audio src={staticFile("sfx/power_on.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={435}>
        <Audio src={staticFile("sfx/thud.mp3")} volume={0.6} />
      </Sequence>

      {/* Sequence Scenes */}
      <Sequence from={0} durationInFrames={90}>
        <Scene1Roster />
      </Sequence>

      <Sequence from={90} durationInFrames={110}>
        <Scene2ArjunDev />
      </Sequence>

      <Sequence from={200} durationInFrames={110}>
        <Scene3RahulMeera />
      </Sequence>

      <Sequence from={310} durationInFrames={110}>
        <Scene4KabirNisha />
      </Sequence>

      <Sequence from={420} durationInFrames={120}>
        <Scene5HeroFinale />
      </Sequence>
    </AbsoluteFill>
  );
};

export const CinematicShowcaseComposition: React.FC = () => {
  return (
    <Composition
      id="CharacterShowcase"
      component={CinematicShowcase}
      durationInFrames={540}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
