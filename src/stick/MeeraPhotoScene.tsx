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
import { FriendStickFigure } from "./FriendStickFigure";

export const MeeraPhotoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera Flash burst at frame 85
  const flashOpacity =
    frame >= 83 && frame <= 91
      ? interpolate(frame, [83, 85, 91], [0, 0.96, 0])
      : 0;

  // Viewfinder bracket spring
  const focusSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14 },
  });

  // Photo snapshot slide in from frame 95
  const photoSpring = spring({
    frame: frame - 95,
    fps,
    config: { damping: 15, mass: 0.8 },
  });
  const photoScale = interpolate(photoSpring, [0, 1], [0.85, 1]);
  const photoY = interpolate(photoSpring, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080B10",
        background: "radial-gradient(ellipse at 50% 40%, #151C28 0%, #06080D 85%)",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        color: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* Studio Background Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.6,
        }}
      />

      {/* Audio SFX */}
      <Sequence from={0}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={35}>
        <Audio src={staticFile("sfx/slide.mp3")} volume={0.6} />
      </Sequence>
      {/* Shutter Click at Frame 85 */}
      <Sequence from={84}>
        <Audio src={staticFile("sfx/ping.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={95}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.7} />
      </Sequence>

      {/* Title Header */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              background: "rgba(244, 114, 182, 0.15)",
              border: "1px solid rgba(244, 114, 182, 0.4)",
              color: "#F472B6",
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: 2,
            }}
          >
            MEERA'S FIELD OPTICS
          </div>
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: 1.5, color: "#FFFFFF" }}>
            GROUP PHOTO MOMENT
          </span>
        </div>

        {/* Viewfinder HUD Status */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: frame % 30 < 15 ? "#EF4444" : "transparent",
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: "#E2E8F0" }}>
              REC [4K 60FPS]
            </span>
          </div>
          <span
            style={{
              fontSize: 12,
              color: "#38BDF8",
              background: "rgba(56, 189, 248, 0.12)",
              padding: "4px 10px",
              borderRadius: 6,
              border: "1px solid rgba(56, 189, 248, 0.3)",
              fontWeight: 700,
            }}
          >
            ISO 100 • f/2.8 • 1/250s
          </span>
        </div>
      </div>

      {/* MAIN STAGE */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "0 80px 100px",
        }}
      >
        {/* ================================================= */}
        {/* LEFT: MEERA TAKING PHOTO                         */}
        {/* ================================================= */}
        <div
          style={{
            position: "relative",
            zIndex: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Meera Spotlight */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              width: 160,
              height: 40,
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(244, 114, 182, 0.4) 0%, transparent 75%)",
              filter: "blur(14px)",
            }}
          />

          <FriendStickFigure
            friend="meera"
            pose="takingPhoto"
            width={280}
            height={490}
            animate={true}
            frame={frame}
          />

          {/* Photographer Label */}
          <div
            style={{
              marginTop: 10,
              padding: "6px 14px",
              background: "rgba(125, 51, 76, 0.25)",
              border: "1px solid rgba(244, 114, 182, 0.5)",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 2,
              color: "#F472B6",
            }}
          >
            MEERA // PHOTO RIG
          </div>
        </div>

        {/* ================================================= */}
        {/* CENTER-RIGHT: THE REMAINING 5 FRIENDS POSING      */}
        {/* (Arjun, Dev, Rahul, Kabir, Nisha)                */}
        {/* ================================================= */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 16,
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Group Floor Glow */}
          <div
            style={{
              position: "absolute",
              bottom: 25,
              left: -30,
              right: -30,
              height: 60,
              background: "radial-gradient(ellipse, rgba(56, 189, 248, 0.25) 0%, transparent 80%)",
              filter: "blur(20px)",
            }}
          />

          {/* 1. ARJUN (Olive green, messy hair, satchel bag) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FriendStickFigure
              friend="arjun"
              width={245}
              height={460}
              animate={true}
              frame={frame}
              animationOffset={0}
            />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#A3BD82", marginTop: 4 }}>
              ARJUN
            </span>
          </div>

          {/* 2. DEV (Navy blue, curly hair, hand on hip) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FriendStickFigure
              friend="dev"
              width={245}
              height={460}
              animate={true}
              frame={frame}
              animationOffset={15}
            />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#60A5FA", marginTop: 4 }}>
              DEV
            </span>
          </div>

          {/* 3. RAHUL (Rust orange, broad shoulders, hands on hips) - CENTER ANCHOR */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FriendStickFigure
              friend="rahul"
              width={275}
              height={470}
              animate={true}
              frame={frame}
              animationOffset={30}
            />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#FB923C", marginTop: 4 }}>
              RAHUL
            </span>
          </div>

          {/* 4. KABIR (Teal, glasses, holding book) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FriendStickFigure
              friend="kabir"
              width={245}
              height={480}
              animate={true}
              frame={frame}
              animationOffset={45}
            />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#2DD4BF", marginTop: 4 }}>
              KABIR
            </span>
          </div>

          {/* 5. NISHA (Mustard yellow, short bob, hand on hip) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FriendStickFigure
              friend="nisha"
              width={245}
              height={460}
              animate={true}
              frame={frame}
              animationOffset={60}
            />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#FACC15", marginTop: 4 }}>
              NISHA
            </span>
          </div>

          {/* Camera Viewfinder Focus Reticle Overlay (Frame 20 - 84) */}
          {frame < 85 && (
            <div
              style={{
                position: "absolute",
                inset: "-20px -20px 20px -20px",
                border: "2px solid rgba(56, 189, 248, 0.4)",
                borderRadius: 24,
                pointerEvents: "none",
                transform: `scale(${interpolate(focusSpring, [0, 1], [1.1, 1])})`,
                opacity: focusSpring,
              }}
            >
              {/* Corner brackets */}
              <div style={{ position: "absolute", top: -2, left: -2, width: 32, height: 32, borderTop: "4px solid #38BDF8", borderLeft: "4px solid #38BDF8" }} />
              <div style={{ position: "absolute", top: -2, right: -2, width: 32, height: 32, borderTop: "4px solid #38BDF8", borderRight: "4px solid #38BDF8" }} />
              <div style={{ position: "absolute", bottom: -2, left: -2, width: 32, height: 32, borderBottom: "4px solid #38BDF8", borderLeft: "4px solid #38BDF8" }} />
              <div style={{ position: "absolute", bottom: -2, right: -2, width: 32, height: 32, borderBottom: "4px solid #38BDF8", borderRight: "4px solid #38BDF8" }} />

              {/* Center Crosshairs */}
              <div style={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%, -50%)", width: 40, height: 40 }}>
                <div style={{ position: "absolute", top: 18, left: 0, right: 0, height: 2, background: "#38BDF8" }} />
                <div style={{ position: "absolute", left: 18, top: 0, bottom: 0, width: 2, background: "#38BDF8" }} />
              </div>

              {/* Focus Tag */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  left: 18,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: "#38BDF8",
                }}
              >
                ● AUTOFOCUS LOCKED [5 TARGETS]
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogue Subtitle (Frame 10 - 80) */}
      {frame < 83 && (
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(15, 20, 30, 0.9)",
            border: "1px solid rgba(244, 114, 182, 0.4)",
            borderRadius: 16,
            padding: "10px 24px",
            fontSize: 18,
            fontWeight: 700,
            color: "#FFFFFF",
            boxShadow: "0 10px 24px rgba(0,0,0,0.6)",
            zIndex: 30,
          }}
        >
          Meera: <span style={{ color: "#F472B6" }}>"Hold still everyone! Big smiles... 3, 2, 1—"</span>
        </div>
      )}

      {/* CAMERA SHUTTER WHITE FLASH BURST (Frame 83 - 91) */}
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

      {/* POLAROID SNAPSHOT REVEAL (Frame 92 - 180) */}
      {frame >= 92 && (
        <AbsoluteFill
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          {/* Floating Polaroid Card */}
          <div
            style={{
              transform: `scale(${photoScale}) translateY(${photoY}px) rotate(-1.5deg)`,
              opacity: photoSpring,
              background: "#FFFFFF",
              padding: "24px 24px 44px",
              borderRadius: 18,
              boxShadow: "0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(244, 114, 182, 0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 1050,
            }}
          >
            {/* The Photo Image Inside Frame */}
            <div
              style={{
                width: "100%",
                height: 480,
                borderRadius: 10,
                background: "radial-gradient(ellipse at 50% 50%, #1E293B 0%, #0F172A 100%)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-around",
                padding: "0 30px 20px",
                overflow: "hidden",
                border: "2px solid rgba(0,0,0,0.1)",
                position: "relative",
              }}
            >
              {/* Captured Photo of the 5 Friends */}
              <FriendStickFigure friend="arjun" width={180} height={340} />
              <FriendStickFigure friend="dev" width={180} height={340} />
              <FriendStickFigure friend="rahul" width={205} height={350} />
              <FriendStickFigure friend="kabir" width={180} height={355} />
              <FriendStickFigure friend="nisha" width={180} height={340} />

              {/* Photo Watermark Tag */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 18,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: "#94A3B8",
                  background: "rgba(0,0,0,0.5)",
                  padding: "4px 10px",
                  borderRadius: 6,
                }}
              >
                SHOT BY MEERA • 4K
              </div>
            </div>

            {/* Handwritten Style Caption at Bottom of Polaroid */}
            <div
              style={{
                marginTop: 22,
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: 3,
                color: "#1E293B",
                textAlign: "center",
              }}
            >
              THE SQUAD • FOREVER FRIENDS ❤️
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 2,
                color: "#64748B",
                marginTop: 4,
              }}
            >
              ARJUN • DEV • RAHUL • MEERA • KABIR • NISHA
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const MeeraPhotoComposition: React.FC = () => {
  return (
    <Composition
      id="MeeraPhotoScene"
      component={MeeraPhotoScene}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

