import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { FriendStickFigure } from "./FriendStickFigure";
import { FRIEND_DESIGNS, FRIEND_IDS } from "./friendDesigns";

export const SixFriendsLineup: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#090C12",
        background: "radial-gradient(ellipse at 50% 35%, #182030 0%, #07090E 80%)",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#FFFFFF",
        padding: "46px 64px 38px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Background Subtle Tech Matrix Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.65,
          pointerEvents: "none",
        }}
      />

      {/* Top Header Banner */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 20 }}>
        <div
          style={{
            display: "inline-block",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 4,
            padding: "6px 20px",
            borderRadius: 20,
            background: "rgba(56, 189, 248, 0.12)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            color: "#38BDF8",
            marginBottom: 10,
            textTransform: "uppercase",
          }}
        >
          THE SIX FRIENDS // PROCEDURAL STICK IDENTITIES
        </div>
        <h1
          style={{
            fontSize: 44,
            fontWeight: 900,
            letterSpacing: 3,
            color: "#FFFFFF",
            margin: 0,
            textShadow: "0 4px 24px rgba(0,0,0,0.8), 0 0 32px rgba(255,255,255,0.15)",
          }}
        >
          SIX FRIENDS ENSEMBLE ROSTER
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#94A3B8",
            letterSpacing: 2,
            margin: "8px 0 0",
            fontWeight: 600,
          }}
        >
          VOLUMETRIC 3D LIGHTING • SIGNATURE HAIR & ACCESSORIES • REUSABLE OVER ANY BACKGROUND
        </p>
      </div>

      {/* Center Hero Stage: 6 Friends Side-by-Side */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          position: "relative",
          margin: "16px 0",
          zIndex: 10,
        }}
      >
        {/* Floor Horizon Volumetric Glow */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: "2%",
            right: "2%",
            height: 70,
            background: "radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.18) 0%, transparent 80%)",
            filter: "blur(24px)",
            pointerEvents: "none",
          }}
        />

        {FRIEND_IDS.map((id, index) => {
          const d = FRIEND_DESIGNS[id];
          return (
            <div
              key={id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                maxWidth: 290,
                position: "relative",
              }}
            >
              {/* Individual Character Colored Spotlight Halo */}
              <div
                style={{
                  position: "absolute",
                  bottom: 25,
                  width: 140,
                  height: 35,
                  borderRadius: "50%",
                  background: `radial-gradient(ellipse, ${d.color}66 0%, transparent 75%)`,
                  filter: "blur(14px)",
                  zIndex: 1,
                }}
              />

              {/* Stick Figure Component */}
              <div style={{ position: "relative", zIndex: 10 }}>
                <FriendStickFigure
                  friend={id}
                  width={265}
                  height={480}
                  glow={true}
                  shading={true}
                />
              </div>

              {/* Character Identity Card Box */}
              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(10,14,22,0.85))",
                  border: `1px solid ${d.color}55`,
                  borderRadius: 14,
                  padding: "10px 14px",
                  width: "88%",
                  boxShadow: `0 8px 20px rgba(0,0,0,0.5), 0 0 16px ${d.color}22`,
                  backdropFilter: "blur(8px)",
                  position: "relative",
                  zIndex: 20,
                }}
              >
                {/* Name Header with Glowing Indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      backgroundColor: d.color,
                      boxShadow: `0 0 10px ${d.lightColor}`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      letterSpacing: 2,
                      color: "#FFFFFF",
                    }}
                  >
                    {d.name.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: d.lightColor,
                      background: "rgba(255,255,255,0.08)",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    #{index + 1}
                  </span>
                </div>

                {/* Trait Specification (Exact Match from User Prompt) */}
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 0.8,
                    color: d.lightColor,
                    textAlign: "center",
                    marginTop: 2,
                  }}
                >
                  {d.trait}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Technical Status Bar */}
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
          zIndex: 20,
        }}
      >
        <span>STANDALONE TRANSPARENT SVG OVERLAY CAPABLE</span>
        <span style={{ color: "#10B981" }}>● 6 FRIENDS COMPILED // READY FOR ANY BACKGROUND</span>
      </div>
    </AbsoluteFill>
  );
};

export const SixFriendsLineupComposition: React.FC = () => {
  return (
    <Composition
      id="SixFriendsLineup"
      component={SixFriendsLineup}
      durationInFrames={30}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
