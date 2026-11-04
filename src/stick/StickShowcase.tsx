import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { StickFigure } from "./StickFigure";
import { STICK_DESIGNS } from "./designs";
import { StickCharacterId, StickExpression } from "./types";

// ==========================================
// INDIVIDUAL CHARACTER 1-FRAME SHOWCASE
// Shows: Full Body Signature Pose + Close-up Headshot with Facial Expression
// ==========================================
export const SingleStickShowcase: React.FC<{
  characterId: StickCharacterId;
  expression: StickExpression;
}> = ({ characterId, expression }) => {
  const d = STICK_DESIGNS[characterId];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B0E14",
        background: `radial-gradient(circle at 50% 30%, ${d.color}15 0%, #080A0F 75%)`,
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        color: "#FFFFFF",
        padding: "60px 48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      {/* Background Subtle Tech Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* Header Badge & Title */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 10 }}>
        <div
          style={{
            display: "inline-block",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 4,
            padding: "8px 22px",
            borderRadius: 24,
            background: `${d.color}22`,
            border: `1px solid ${d.color}66`,
            color: d.lightColor,
            marginBottom: 12,
            textTransform: "uppercase",
          }}
        >
          ANIMATION VS ANIMATOR // PROCEDURAL STICK RIG
        </div>
        <h1
          style={{
            fontSize: 48,
            fontWeight: 900,
            letterSpacing: 3,
            color: "#FFFFFF",
            margin: 0,
            textShadow: `0 0 28px ${d.color}66`,
          }}
        >
          {d.name.toUpperCase()}
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#94A3B8",
            letterSpacing: 2,
            margin: "8px 0 0",
            fontWeight: 600,
          }}
        >
          {d.role.toUpperCase()}
        </p>
      </div>

      {/* Main Showcase Stage: Split View */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 28,
          alignItems: "center",
          margin: "24px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* LEFT COLUMN: FULL BODY (TRANSPARENT REUSABLE RIG) */}
        <div
          style={{
            height: "100%",
            background: "linear-gradient(160deg, rgba(255,255,255,0.05), rgba(12,16,24,0.85))",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 20px",
            boxShadow: `0 20px 48px rgba(0,0,0,0.6), inset 0 0 30px ${d.color}15`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top Tag */}
          <div
            style={{
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 14px",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: d.color,
                boxShadow: `0 0 10px ${d.color}`,
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: "#E2E8F0" }}>
              FULL BODY RIG // TRANSPARENT
            </span>
          </div>

          {/* Stick Figure Component in Signature Pose */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "scale(1.22)",
              transformOrigin: "center center",
            }}
          >
            <StickFigure
              character={characterId}
              pose="signature"
              width={260}
              height={460}
              glow={true}
              shading={true}
            />
          </div>

          {/* Bottom Badge */}
          <div
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.6)",
              borderRadius: 12,
              padding: "10px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "#94A3B8" }}>
              POSE: SIGNATURE (IMAGE MATCH)
            </span>
            <span style={{ fontSize: 12, fontWeight: 800, color: d.lightColor }}>
              VOLUMETRIC SHADING
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: CLOSE-UP HEADSHOT WITH FACIAL EXPRESSION */}
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Close-up Portrait Box */}
          <div
            style={{
              flex: 1,
              background: "linear-gradient(160deg, rgba(255,255,255,0.05), rgba(12,16,24,0.85))",
              border: `1px solid ${d.color}44`,
              borderRadius: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px 20px",
              boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 24px ${d.color}22`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top Tag */}
            <div
              style={{
                alignSelf: "flex-start",
                padding: "6px 14px",
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 2,
                color: d.lightColor,
              }}
            >
              CLOSE-UP SHOT // EXPRESSION: {expression.toUpperCase()}
            </div>

            {/* Close-up Head View with Expression */}
            <div
              style={{
                width: 240,
                height: 240,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${d.color}33 0%, transparent 72%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                border: `2px solid ${d.color}66`,
                boxShadow: `0 0 30px ${d.color}44`,
              }}
            >
              <StickFigure
                character={characterId}
                mode="headOnly"
                showFace={true}
                expression={expression}
                width={200}
                height={200}
                glow={true}
                shading={true}
              />
            </div>

            {/* Note on Facial Expressions */}
            <div
              style={{
                fontSize: 12,
                color: "#94A3B8",
                textAlign: "center",
                lineHeight: 1.4,
                padding: "0 10px",
              }}
            >
              Expressive facial lines enabled for dramatic close-up scenes while keeping full-body shots classic and faceless.
            </div>
          </div>

          {/* Technical Specs Card */}
          <div
            style={{
              background: "rgba(15, 20, 30, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 18,
              padding: "16px 20px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 10, letterSpacing: 1.5, color: "#64748B", fontWeight: 800 }}>
                HEAD TYPE
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#F8FAFC", marginTop: 2 }}>
                {d.isHollowHead ? "Hollow Torus Ring" : "Solid Volumetric Sphere"}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, letterSpacing: 1.5, color: "#64748B", fontWeight: 800 }}>
                ACCESSORIES
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#F8FAFC", marginTop: 2 }}>
                {d.hasHeadphones ? "DJ Studio Headphones" : "None (Pure Vector)"}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, letterSpacing: 1.5, color: "#64748B", fontWeight: 800 }}>
                PRIMARY HEX
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: d.lightColor, marginTop: 2 }}>
                {d.color}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, letterSpacing: 1.5, color: "#64748B", fontWeight: 800 }}>
                REUSABILITY
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#10B981", marginTop: 2 }}>
                100% Transparent Layer
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer System Status */}
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
          paddingTop: 16,
          position: "relative",
          zIndex: 10,
        }}
      >
        <span>REUSABLE REACT + SVG COMPONENT // SCALABLE VECTOR</span>
        <span style={{ color: d.lightColor }}>● MODEL VALIDATED</span>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// 5-CHARACTER LINEUP (Matches User Image)
// 1920x1080 Landscape Widescreen
// ==========================================
export const StickLineupShowcase: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0D14",
        background: "radial-gradient(ellipse at 50% 40%, #171E2D 0%, #080A0F 85%)",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        color: "#FFFFFF",
        padding: "48px 60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      {/* Background Subtle Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* Top Header */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 10 }}>
        <div
          style={{
            display: "inline-block",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 4,
            padding: "6px 18px",
            borderRadius: 20,
            background: "rgba(56, 189, 248, 0.12)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            color: "#38BDF8",
            marginBottom: 8,
          }}
        >
          ALAN BECKER STYLE PROCEDURAL RIGS
        </div>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: 3,
            color: "#FFFFFF",
            margin: 0,
            textShadow: "0 0 24px rgba(255,255,255,0.2)",
          }}
        >
          COMPLETE 5-CHARACTER ENSEMBLE ROSTER
        </h1>
        <p style={{ fontSize: 16, color: "#94A3B8", letterSpacing: 2, margin: "6px 0 0" }}>
          RED • YELLOW • THE SECOND COMING (ORANGE) • GREEN • BLUE
        </p>
      </div>

      {/* Characters Stage: Exactly matching user reference photo */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-end",
          position: "relative",
          margin: "20px 0",
          zIndex: 10,
        }}
      >
        {/* Floor Horizon Glow */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "5%",
            right: "5%",
            height: 60,
            background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 80%)",
            filter: "blur(20px)",
          }}
        />

        {/* 1. RED */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <StickFigure character="red" pose="signature" width={280} height={520} />
          <div
            style={{
              marginTop: 14,
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: 2,
              color: "#E52521",
              background: "rgba(229, 37, 33, 0.15)",
              border: "1px solid rgba(229, 37, 33, 0.4)",
              borderRadius: 8,
              padding: "4px 14px",
            }}
          >
            RED // CHEER
          </div>
        </div>

        {/* 2. YELLOW */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <StickFigure character="yellow" pose="signature" width={280} height={520} />
          <div
            style={{
              marginTop: 14,
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: 2,
              color: "#F6BC14",
              background: "rgba(246, 188, 20, 0.15)",
              border: "1px solid rgba(246, 188, 20, 0.4)",
              borderRadius: 8,
              padding: "4px 14px",
            }}
          >
            YELLOW // READY
          </div>
        </div>

        {/* 3. ORANGE (THE SECOND COMING) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <StickFigure character="orange" pose="signature" width={280} height={520} />
          <div
            style={{
              marginTop: 14,
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: 2,
              color: "#FF6E1A",
              background: "rgba(255, 110, 26, 0.15)",
              border: "1px solid rgba(255, 110, 26, 0.4)",
              borderRadius: 8,
              padding: "4px 14px",
            }}
          >
            TSC // HOLLOW HEAD
          </div>
        </div>

        {/* 4. GREEN */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <StickFigure character="green" pose="signature" width={280} height={520} />
          <div
            style={{
              marginTop: 14,
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: 2,
              color: "#4CD918",
              background: "rgba(76, 217, 24, 0.15)",
              border: "1px solid rgba(76, 217, 24, 0.4)",
              borderRadius: 8,
              padding: "4px 14px",
            }}
          >
            GREEN // HEADPHONES
          </div>
        </div>

        {/* 5. BLUE */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <StickFigure character="blue" pose="signature" width={280} height={520} />
          <div
            style={{
              marginTop: 14,
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: 2,
              color: "#1BB7F5",
              background: "rgba(27, 183, 245, 0.15)",
              border: "1px solid rgba(27, 183, 245, 0.4)",
              borderRadius: 8,
              padding: "4px 14px",
            }}
          >
            BLUE // HIP POSE
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
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
          paddingTop: 16,
          position: "relative",
          zIndex: 10,
        }}
      >
        <span>STANDALONE TRANSPARENT SVG OVERLAY CAPABLE</span>
        <span style={{ color: "#10B981" }}>● READY FOR ANY BACKGROUND IMAGE</span>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// BACKGROUND REUSABILITY DEMO SHOWCASE
// Demonstrates how the stick figures move and composite over scenic background images!
// ==========================================
export const StickOnBackgroundShowcase: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        // Rich scenic gradient backdrop simulating an outdoor gaming / cinematic sky & sunset terrain
        background: "linear-gradient(180deg, #0F172A 0%, #1E293B 40%, #334155 70%, #0F172A 100%)",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        color: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Graphic: Mountains / Sunset Atmosphere */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, rgba(239, 68, 68, 0.15) 50%, transparent 80%)",
          filter: "blur(40px)",
        }}
      />

      {/* Ground Platform */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 240,
          background: "linear-gradient(180deg, rgba(30, 41, 59, 0.9) 0%, #090D16 100%)",
          borderTop: "2px solid rgba(255,255,255,0.15)",
          boxShadow: "0 -20px 40px rgba(0,0,0,0.6)",
        }}
      />

      {/* Top Banner */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 20,
        }}
      >
        <div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 3,
              color: "#38BDF8",
              textTransform: "uppercase",
            }}
          >
            BACKGROUND COMPOSITING TEST
          </span>
          <h2 style={{ fontSize: 32, fontWeight: 900, margin: "4px 0 0", color: "#FFFFFF" }}>
            REUSABLE STICK FIGURES OVER ANY ENVIRONMENT
          </h2>
        </div>
        <div
          style={{
            padding: "8px 18px",
            borderRadius: 20,
            background: "rgba(16, 185, 129, 0.18)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            color: "#10B981",
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: 1.5,
          }}
        >
          ZERO ARTIFACTS // PERFECT ALPHA
        </div>
      </div>

      {/* Characters Placed seamlessly onto the background */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          zIndex: 10,
        }}
      >
        <StickFigure character="red" pose="cheer" width={260} height={480} />
        <StickFigure character="yellow" pose="idle" width={260} height={480} />
        <StickFigure character="orange" pose="crossed" width={260} height={480} />
        <StickFigure character="green" pose="listen" width={260} height={480} />
        <StickFigure character="blue" pose="handsOnHip" width={260} height={480} />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// COMPOSITION WRAPPERS FOR REMOTION
// ==========================================
export const StickRedComposition: React.FC = () => (
  <Composition
    id="StickRed"
    component={() => <SingleStickShowcase characterId="red" expression="angry" />}
    durationInFrames={30}
    fps={30}
    width={1080}
    height={1920}
  />
);

export const StickYellowComposition: React.FC = () => (
  <Composition
    id="StickYellow"
    component={() => <SingleStickShowcase characterId="yellow" expression="curious" />}
    durationInFrames={30}
    fps={30}
    width={1080}
    height={1920}
  />
);

export const StickOrangeComposition: React.FC = () => (
  <Composition
    id="StickOrange"
    component={() => <SingleStickShowcase characterId="orange" expression="determined" />}
    durationInFrames={30}
    fps={30}
    width={1080}
    height={1920}
  />
);

export const StickGreenComposition: React.FC = () => (
  <Composition
    id="StickGreen"
    component={() => <SingleStickShowcase characterId="green" expression="happy" />}
    durationInFrames={30}
    fps={30}
    width={1080}
    height={1920}
  />
);

export const StickBlueComposition: React.FC = () => (
  <Composition
    id="StickBlue"
    component={() => <SingleStickShowcase characterId="blue" expression="smug" />}
    durationInFrames={30}
    fps={30}
    width={1080}
    height={1920}
  />
);

export const StickLineupComposition: React.FC = () => (
  <Composition
    id="StickLineup"
    component={StickLineupShowcase}
    durationInFrames={30}
    fps={30}
    width={1920}
    height={1080}
  />
);

export const StickOnBackgroundComposition: React.FC = () => (
  <Composition
    id="StickOnBackground"
    component={StickOnBackgroundShowcase}
    durationInFrames={30}
    fps={30}
    width={1920}
    height={1080}
  />
);
