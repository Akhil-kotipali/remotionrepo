import React, { Suspense } from "react";
import { ThreeCanvas } from "@remotion/three";
import { Showcase3DSceneConfig } from "../types";
import { MuscleCarRig } from "../../car/MuscleCarRig";
import { CarEnvironment } from "../../car/CarEnvironment";
import { CarCamera } from "../../car/CarCamera";

interface Showcase3DSceneProps {
  config: Showcase3DSceneConfig;
  localFrame: number;
  durationFrames: number;
  width?: number;
  height?: number;
}

export const Showcase3DScene: React.FC<Showcase3DSceneProps> = ({
  config,
  localFrame,
  durationFrames,
  width = 1080,
  height = 1920,
}) => {
  const mode = config.cameraMode || config.mode || "turntable";
  const hudTitle = config.hudTitle || (config.hudOverlay && config.hudOverlay.title);
  const hudMetrics =
    config.hudMetrics ||
    (config.hudOverlay && config.hudOverlay.metrics) ||
    (config.hudOverlay && config.hudOverlay.metricLabel
      ? [{ label: config.hudOverlay.metricLabel, value: config.hudOverlay.metricValue || "ACTIVE" }]
      : undefined);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width,
        height,
        overflow: "hidden",
        background: "#020409",
      }}
    >
      {/* 3D Scene Layer */}
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 2, 7.5], fov: 42, near: 0.1, far: 1000 }}
        shadows
      >
        <Suspense fallback={null}>
          <CarCamera
            mode={mode}
            localFrame={localFrame}
            durationInFrames={durationFrames}
          />
          <CarEnvironment mode={mode} localFrame={localFrame} />
          <MuscleCarRig
            mode={mode}
            localFrame={localFrame}
            durationInFrames={durationFrames}
          />
        </Suspense>
      </ThreeCanvas>

      {/* Cybernetic / Technical HUD Telemetry Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 40,
        }}
      >
        {/* Top-Right Live Status Box */}
        <div
          style={{
            position: "absolute",
            top: 140,
            right: 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(10, 18, 32, 0.85)",
              border: "1.5px solid rgba(56, 189, 248, 0.6)",
              borderRadius: 6,
              padding: "4px 12px",
              boxShadow: "0 0 15px rgba(56, 189, 248, 0.4)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#38bdf8",
                boxShadow: "0 0 8px #38bdf8",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontWeight: 900,
                fontSize: 14,
                color: "#38bdf8",
                letterSpacing: 2,
              }}
            >
              ● 3D MOTOR RENDER [ACTIVE]
            </span>
          </div>

          {hudTitle && (
            <div
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 900,
                fontSize: 28,
                color: "#ffffff",
                letterSpacing: 1,
                textShadow: "0 2px 10px rgba(0,0,0,0.8)",
              }}
            >
              {hudTitle}
            </div>
          )}
        </div>

        {/* Top-Left Telemetry Metrics */}
        {hudMetrics && (
          <div
            style={{
              position: "absolute",
              top: 140,
              left: 48,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              background: "rgba(6, 10, 18, 0.85)",
              border: "1.5px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 10,
              padding: "10px 16px",
            }}
          >
            {hudMetrics.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.6)",
                    letterSpacing: 1,
                  }}
                >
                  {m.label}:
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 14,
                    fontWeight: 900,
                    color: "#38bdf8",
                  }}
                >
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Ambient Corner Crosshairs */}
        <div
          style={{
            position: "absolute",
            bottom: 300,
            left: 48,
            fontFamily: "monospace",
            fontSize: 11,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: 2,
          }}
        >
          [ CAM: {mode.toUpperCase()} ] · 30 FPS · SHADOWS: ENABLED
        </div>
      </div>
    </div>
  );
};
