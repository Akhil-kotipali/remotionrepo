import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { DossierSceneConfig } from "../types";

interface DossierSceneProps {
  config: DossierSceneConfig;
  localFrame: number;
  durationFrames: number;
}

export const DossierScene: React.FC<DossierSceneProps> = ({
  config,
  localFrame,
  durationFrames,
}) => {
  const f = localFrame;

  // Breathing card float and entrance scale
  const scale = interpolate(f, [0, 15, durationFrames - 10, durationFrames], [0.94, 1.0, 1.02, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardW = 960;
  const cardH = 1020;

  const header = config.headerBadge || config.headerPill || "ARCHIVE EVIDENCE";
  const mediaSrc = config.mediaPath || config.mediaSrc || "backgrounds/exterior.jpg";
  const target = config.targetCoords || config.targetBox;
  const targetLabel = config.targetLabel || (config.targetBox && config.targetBox.label);
  const laser = config.laserLine || config.laserVector;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#040711",
      }}
    >
      {/* Top Header Stamp */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 60,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(220, 38, 38, 0.95)",
            border: "2px solid #fecaca",
            borderRadius: 999,
            padding: "8px 28px",
            boxShadow: "0 4px 28px rgba(220, 38, 38, 0.85)",
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#ffffff",
              boxShadow: "0 0 10px #ffffff",
              transform: `scale(${0.9 + 0.3 * Math.sin(f * 0.6)})`,
            }}
          />
          <span
            style={{
              color: "#ffffff",
              fontFamily: "monospace",
              fontWeight: 900,
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {header}
          </span>
        </div>

        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 900,
            fontSize: 48,
            color: "#ffffff",
            letterSpacing: 2,
            marginTop: 14,
            textShadow: "0 4px 18px rgba(0,0,0,0.9)",
          }}
        >
          {config.title}
        </div>
        {config.subtitle && (
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 18,
              color: "#94a3b8",
              letterSpacing: 2,
              marginTop: 6,
            }}
          >
            {config.subtitle}
          </div>
        )}
      </div>

      {/* Center Framed Media Card */}
      <div
        style={{
          position: "absolute",
          top: 360,
          width: cardW,
          height: cardH,
          borderRadius: 20,
          overflow: "hidden",
          border: "4px solid rgba(255, 255, 255, 0.35)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.7)",
          transform: `scale(${scale})`,
        }}
      >
        <Img
          src={staticFile(mediaSrc)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "contrast(1.08) brightness(0.9)",
          }}
        />

        {/* Dark Vignette Overlay on Card */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 40%, rgba(2,6,14,0.75) 100%)",
          }}
        />

        {/* Optional Target Reticle Box */}
        {target && (
          <div
            style={{
              position: "absolute",
              left: target.x,
              top: target.y,
              width: target.w,
              height: target.h,
              border: "3px solid #ef4444",
              borderRadius: 8,
              boxShadow:
                "0 0 20px rgba(239,68,68,0.9), inset 0 0 10px rgba(239,68,68,0.4)",
              zIndex: 30,
            }}
          >
            {targetLabel && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: -26,
                  transform: "translateX(-50%)",
                  background: "#ef4444",
                  color: "#ffffff",
                  fontFamily: "monospace",
                  fontWeight: 900,
                  fontSize: 13,
                  padding: "2px 8px",
                  borderRadius: 4,
                  whiteSpace: "nowrap",
                  letterSpacing: 1,
                }}
              >
                {targetLabel}
              </div>
            )}
          </div>
        )}

        {/* Optional Animated Forensic Laser Line */}
        {laser && (
          <svg
            width={cardW}
            height={cardH}
            viewBox={`0 0 ${cardW} ${cardH}`}
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 35,
            }}
          >
            <line
              x1={laser.fromX}
              y1={laser.fromY}
              x2={laser.toX}
              y2={laser.toY}
              stroke="#ef4444"
              strokeWidth={4.5}
              strokeDasharray="12 8"
              strokeDashoffset={-f * 5}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 10px rgba(239, 68, 68, 0.95))" }}
            />
          </svg>
        )}

        {/* Corner Stamp */}
        {config.stampText && (
          <div
            style={{
              position: "absolute",
              left: 24,
              top: 24,
              background: "rgba(10, 15, 26, 0.88)",
              border: "2px solid #ef4444",
              borderRadius: 8,
              padding: "6px 14px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 0 15px rgba(239,68,68,0.6)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#ef4444",
                boxShadow: "0 0 8px #ef4444",
              }}
            />
            <span
              style={{
                color: "#ffffff",
                fontFamily: "monospace",
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: 1.5,
              }}
            >
              {config.stampText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
