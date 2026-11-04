import React from "react";
import { interpolate } from "remotion";
import { InfographicSceneConfig } from "../types";

interface InfographicSceneProps {
  config: InfographicSceneConfig;
  localFrame: number;
  durationFrames: number;
}

export const InfographicScene: React.FC<InfographicSceneProps> = ({
  config,
  localFrame,
  durationFrames,
}) => {
  const f = localFrame;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#03060f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "160px 48px",
      }}
    >
      {/* Title Header */}
      <div style={{ textAlign: "center", marginBottom: 40, zIndex: 10 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 16,
            fontWeight: 800,
            color: "#38bdf8",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          ● DATA AUDIT
        </div>
        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 900,
            fontSize: 48,
            color: "#ffffff",
            letterSpacing: 1,
          }}
        >
          {config.title}
        </div>
        {config.subtitle && (
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 18,
              color: "rgba(255,255,255,0.7)",
              marginTop: 8,
            }}
          >
            {config.subtitle}
          </div>
        )}
      </div>

      {/* Cards List / Grid */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          width: "100%",
          maxWidth: 960,
          zIndex: 10,
        }}
      >
        {config.items.map((item, idx) => {
          const entranceDelay = idx * 6;
          const cardOpacity = interpolate(f, [entranceDelay, entranceDelay + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const cardX = interpolate(f, [entranceDelay, entranceDelay + 10], [-30, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={item.id}
              style={{
                background: item.highlight
                  ? "rgba(14, 22, 38, 0.95)"
                  : "rgba(8, 12, 20, 0.8)",
                border: `2px solid ${item.highlight ? item.color : "rgba(255, 255, 255, 0.15)"}`,
                borderRadius: 16,
                padding: "20px 28px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: item.highlight
                  ? `0 0 25px ${item.color}66, inset 0 0 15px ${item.color}33`
                  : "none",
                opacity: cardOpacity,
                transform: `translateX(${cardX}px)`,
                transition: "border 0.2s ease",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontWeight: 900,
                    fontSize: 20,
                    color: item.color,
                    letterSpacing: 1.5,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontWeight: 600,
                    fontSize: 16,
                    color: "rgba(255, 255, 255, 0.8)",
                    marginTop: 4,
                  }}
                >
                  {item.sublabel}
                </div>
              </div>

              {item.metric && (
                <div
                  style={{
                    fontFamily: "monospace",
                    fontWeight: 900,
                    fontSize: 28,
                    background: item.highlight ? item.color : "transparent",
                    padding: item.highlight ? "6px 16px" : "0",
                    borderRadius: 8,
                    color: item.highlight ? "#000000" : item.color,
                  }}
                >
                  {item.metric}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
