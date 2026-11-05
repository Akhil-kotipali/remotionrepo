import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { MirrorHorrorSceneConfig } from "../types";
import { Character } from "../../characters/Character";
import { CharacterId, Emotion, Pose } from "../../characters/types";

interface MirrorHorrorSceneProps {
  config: MirrorHorrorSceneConfig;
  localFrame: number;
  durationFrames: number;
  width: number;
  height: number;
}

export const MirrorHorrorScene: React.FC<MirrorHorrorSceneProps> = ({
  config,
  localFrame,
  durationFrames,
  width,
  height,
}) => {
  const f = localFrame;

  // ---------------------------------------------------------------------------
  // CAMERA MOTION & SHAKE (ON GLASS IMPACT KNOCKS)
  // ---------------------------------------------------------------------------
  const cameraMotion = config.cameraMotion;
  const zoom = cameraMotion
    ? interpolate(f, [0, durationFrames], [cameraMotion.fromScale, cameraMotion.toScale], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1.0;

  const camY = cameraMotion
    ? interpolate(f, [0, durationFrames], [cameraMotion.fromY ?? 0, cameraMotion.toY ?? 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Compute camera shake from knock frames
  let shakeX = 0;
  let shakeY = 0;
  let chromaticOffset = 0;
  const knockFrames = config.reflectionCharacter?.knockingFrames ?? [];

  for (const kf of knockFrames) {
    if (f >= kf && f <= kf + 14) {
      const delta = f - kf;
      const decay = Math.exp(-delta * 0.35);
      shakeX += Math.sin(delta * 2.8) * 16 * decay;
      shakeY += Math.cos(delta * 2.5) * 12 * decay;
      chromaticOffset = Math.max(chromaticOffset, 8 * decay);
    }
  }

  // ---------------------------------------------------------------------------
  // MIRROR GEOMETRY
  // ---------------------------------------------------------------------------
  const mf = config.mirrorFrame ?? {
    x: 180,
    y: 340,
    w: 720,
    h: 1080,
  };

  const bgSrc = config.backgroundSrc || "backgrounds/living_room.jpg";

  // ---------------------------------------------------------------------------
  // REAL CHARACTER CHOREOGRAPHY (OUTSIDE MIRROR)
  // ---------------------------------------------------------------------------
  const realChar = config.realCharacter;
  let realX = realChar?.position?.x ?? 540;
  let realY = realChar?.position?.y ?? 1580;
  let realScale = realChar?.scale ?? 1.25;

  if (realChar?.pose === "walking_away") {
    // Walks out of frame to the left during first 60 frames
    realX = interpolate(f, [0, 55], [realX, -280], {
      extrapolateRight: "clamp",
    });
  } else if (realChar?.pose === "stepping_back") {
    // Panicked step backward away from the mirror
    realY = interpolate(f, [0, durationFrames], [realY, realY + 120], {
      extrapolateRight: "clamp",
    });
    realScale = interpolate(f, [0, durationFrames], [realScale, realScale * 1.1], {
      extrapolateRight: "clamp",
    });
  }

  // ---------------------------------------------------------------------------
  // REFLECTION CHARACTER CHOREOGRAPHY (INSIDE MIRROR)
  // ---------------------------------------------------------------------------
  const refChar = config.reflectionCharacter;
  let refX = refChar?.position?.x ?? 540;
  let refY = refChar?.position?.y ?? 1250;
  const refScale = refChar?.scale ?? 1.05;

  let refEmotion: Emotion = (refChar?.emotion as Emotion) || "neutral";
  let refPose: Pose = (refChar?.pose as Pose) || "idle";

  // Check if current frame triggers delayed turn or unnatural actions
  if (refChar?.pose === "delayed_turn") {
    // In hook sequence: stops walking at frame 32, then turns head to stare at camera
    if (f < 32) {
      refX = interpolate(f, [0, 32], [540, 420], { extrapolateRight: "clamp" });
      refPose = "walking";
      refEmotion = "neutral";
    } else {
      refX = 420;
      refPose = "idle";
      refEmotion = f > 45 ? "creepySmile" : "neutral";
    }
  } else if (refChar?.pose === "creepy_smile") {
    refEmotion = "creepySmile";
    refPose = "idle";
  } else if (refChar?.pose === "knocking_glass") {
    refEmotion = "creepySmile";
    refPose = "knocking";
  } else if (refChar?.pose === "pressing_glass") {
    refEmotion = "hollowScared";
    refPose = "pressingGlass";
  }

  // Active knock impact indicator
  const isKnockingNow = knockFrames.some((kf) => f >= kf && f <= kf + 6);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: "#03060c",
        transformOrigin: "540px 960px",
        transform: `translate(${shakeX}px, ${shakeY + camY}px) scale(${zoom})`,
      }}
    >
      {/* 1. PHYSICAL ROOM BACKGROUND (DIM AMBIENCE) */}
      <div
        style={{
          position: "absolute",
          inset: -40,
          filter: "brightness(0.35) contrast(1.2) saturate(0.65) blur(3px)",
        }}
      >
        <Img
          src={staticFile(bgSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Dramatic Moody Overhead Downlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 25%, rgba(120, 200, 240, 0.24) 0%, rgba(2, 6, 12, 0.92) 80%)",
          pointerEvents: "none",
        }}
      />

      {/* 2. THE MIRROR FRAME (PHYSICAL OBJECT IN THE ROOM) */}
      <div
        style={{
          position: "absolute",
          left: mf.x,
          top: mf.y,
          width: mf.w,
          height: mf.h,
          borderRadius: 24,
          padding: 16,
          background:
            "linear-gradient(145deg, #2a3441 0%, #111823 45%, #080c14 100%)",
          boxShadow:
            "0 35px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(0, 180, 255, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.25)",
          border: "2px solid rgba(140, 180, 210, 0.2)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* INNER BEVELED BORDER */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 14,
            overflow: "hidden",
            backgroundColor: "#070c14",
            boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.95)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* REFLECTION WORLD BACKGROUND (SLIGHTLY DIFFERENT COLD TINT) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              filter: "brightness(0.28) contrast(1.3) hue-rotate(190deg) saturate(0.5)",
              transform: "scaleX(-1)", // Mirrored horizontal flip of background room
            }}
          >
            <Img
              src={staticFile(bgSrc)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Eerie Interior Greenish-Cyan Glass Atmosphere */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(14, 165, 233, 0.18) 0%, rgba(3, 7, 18, 0.85) 100%)",
              mixBlendMode: "color-dodge",
              pointerEvents: "none",
            }}
          />

          {/* 3. THE REFLECTION ENTITY (INSIDE THE MIRROR PANE) */}
          <div
            style={{
              position: "absolute",
              left: refX - mf.x - 120 * refScale,
              top: refY - mf.y - 420 * refScale,
              transform: `scale(${refScale})`,
              transformOrigin: "bottom center",
              filter: isKnockingNow
                ? "brightness(1.4) drop-shadow(0 0 20px rgba(0, 240, 255, 0.8))"
                : "brightness(0.9) contrast(1.15) drop-shadow(0 0 15px rgba(0, 0, 0, 0.8))",
              transition: "filter 0.08s ease",
            }}
          >
            <Character
              id={(refChar?.id as CharacterId) || "reflection"}
              emotion={refEmotion}
              pose={refPose}
              view="front"
              gaze="center"
              facing={refChar?.facing ?? "right"}
              width={240}
              height={420}
              frame={f}
            />
          </div>

          {/* GLASS SHEEN & DIAGONAL REFLECTION HIGHLIGHT */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(125deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.02) 28%, transparent 45%, rgba(255, 255, 255, 0.06) 80%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* GLASS CONDENSATION & COLD VIGNETTE */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 0 0 70px rgba(0, 15, 30, 0.85)",
              pointerEvents: "none",
            }}
          />

          {/* 4. GLASS IMPACT FRACTURE CRACKS (ON KNOCKS) */}
          {knockFrames.some((kf) => f >= kf) && (
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
              viewBox="0 0 720 1080"
            >
              {/* Radial Glass Stress Fracture from Impact Point */}
              <g
                stroke={isKnockingNow ? "#e0f2fe" : "#7dd3fc"}
                strokeWidth={isKnockingNow ? 3.5 : 2.0}
                strokeOpacity={isKnockingNow ? 0.95 : 0.65}
                fill="none"
                strokeLinecap="round"
                filter={isKnockingNow ? "drop-shadow(0 0 8px #38bdf8)" : undefined}
              >
                {/* Crack center near hand impact point (360, 520) */}
                <path d="M360 520 L320 480 L290 410 L250 380 M320 480 L300 510 L260 530" />
                <path d="M360 520 L410 490 L460 450 L510 440 M410 490 L430 530 L480 560" />
                <path d="M360 520 L370 580 L350 640 L330 710 M370 580 L400 620 L420 690" />
                <path d="M360 520 L310 540 L240 570 L190 590" />
                <circle cx="360" cy="520" r="14" stroke="#ffffff" strokeWidth="2.5" opacity="0.8" />
                <circle cx="360" cy="520" r="28" stroke="#38bdf8" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 6" />
              </g>
            </svg>
          )}

          {/* SUBLIMINAL WHISPER TEXT (AT CLIMAX) */}
          {refChar?.whisperSubtext && f > durationFrames - 45 && (
            <div
              style={{
                position: "absolute",
                bottom: 60,
                left: 0,
                right: 0,
                textAlign: "center",
                zIndex: 60,
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 26,
                  fontWeight: 900,
                  letterSpacing: 6,
                  color: "#f43f5e",
                  textShadow: "0 0 25px rgba(244, 63, 94, 0.9), 2px 2px #000000",
                  textTransform: "uppercase",
                  opacity: interpolate(Math.sin(f * 0.4), [-1, 1], [0.6, 1.0]),
                }}
              >
                {refChar.whisperSubtext}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 5. FOREGROUND: REAL PERSON OUTSIDE THE MIRROR (FACING AWAY / BACK VIEW) */}
      {realChar && (
        <div
          style={{
            position: "absolute",
            left: realX - 140 * realScale,
            top: realY - 480 * realScale,
            transform: `scale(${realScale})`,
            transformOrigin: "bottom center",
            zIndex: 40,
            filter: "brightness(0.35) contrast(1.4) drop-shadow(0 20px 40px rgba(0, 0, 0, 0.95))",
          }}
        >
          <Character
            id={(realChar.id as CharacterId) || "arjun"}
            emotion="scared"
            pose={realChar.pose === "walking_away" ? "walking" : "idle"}
            view="side"
            facing={realChar.facing ?? "left"}
            width={280}
            height={480}
            frame={f}
          />
        </div>
      )}

      {/* 6. CINEMATIC RETENTION OVERLAYS & HUD */}
      {config.headerPill && (
        <div
          style={{
            position: "absolute",
            top: 140,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 80,
          }}
        >
          <div
            style={{
              background: "rgba(10, 16, 26, 0.88)",
              border: "1.5px solid #00f0ff",
              borderRadius: 30,
              padding: "10px 28px",
              boxShadow: "0 0 25px rgba(0, 240, 255, 0.35)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#f43f5e",
                boxShadow: "0 0 10px #f43f5e",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 20,
                fontWeight: 900,
                color: "#e2e8f0",
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              {config.headerPill}
            </span>
          </div>
        </div>
      )}

      {/* Chromatic aberration impulse on glass impacts */}
      {chromaticOffset > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `rgba(244, 63, 94, 0.08)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
            zIndex: 90,
          }}
        />
      )}
    </div>
  );
};

