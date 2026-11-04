import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { DialogueSceneConfig } from "../types";
import { FriendStickFigure } from "../../part3/stick/FriendStickFigure";

interface DialogueSceneProps {
  config: DialogueSceneConfig;
  localFrame: number;
  durationFrames: number;
}

export const DialogueScene: React.FC<DialogueSceneProps> = ({
  config,
  localFrame,
  durationFrames,
}) => {
  const f = localFrame;

  // Camera push-in calculation
  const push = config.cameraPush;
  const zoom = push
    ? interpolate(f, [0, durationFrames], [push.fromScale, push.toScale], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1.0;

  const focusX = push?.focusX ?? 540;
  const focusY = push?.focusY ?? 960;
  const bgPlate = config.backgroundPlate || config.backgroundSrc || "backgrounds/living_room.jpg";

  const activeSpeakerId =
    config.activeSpeakerId ||
    config.characters.find((c) => c.isSpeaking)?.id;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#050810",
      }}
    >
      {/* Background Plate with Camera Push-in */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${focusX}px ${focusY}px`,
          transform: `scale(${zoom})`,
          transition: "transform 0.1s linear",
        }}
      >
        <Img
          src={staticFile(bgPlate)}
          style={{
            position: "absolute",
            left: -30,
            top: -40,
            width: 1080 + 60,
            height: 1920 + 80,
            objectFit: "cover",
            filter: "brightness(0.85) contrast(1.05)",
          }}
        />

        {/* Ambient Dark Gradient on Ground */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(3, 6, 14, 0.95) 0%, rgba(3, 6, 14, 0.2) 40%, rgba(3, 6, 14, 0.6) 100%)",
          }}
        />

        {/* Characters Staging */}
        {config.characters.map((char) => {
          const isSpeaker = char.id === activeSpeakerId || char.isSpeaking;
          const scale = char.scale ?? 1.0;
          const w = 240 * scale;
          const h = 440 * scale;
          const posX = char.position?.x ?? char.x ?? 540;
          const posY = char.position?.y ?? char.y ?? 1050;

          return (
            <div
              key={char.id}
              style={{
                position: "absolute",
                left: posX - w / 2,
                top: posY - h,
                zIndex: isSpeaker ? 35 : 30,
              }}
            >
              <FriendStickFigure
                friend={char.id as any}
                facing={char.facing ?? "right"}
                width={w}
                height={h}
                showFace={char.showFace ?? true}
                expression={char.expression}
                glow={isSpeaker}
                animate={true}
                frame={f}
              />
            </div>
          );
        })}

        {/* Active Speaker Speech Bubble */}
        {(() => {
          const speaker = config.characters.find((c) => c.id === activeSpeakerId);
          const bubbleText =
            config.speechBubbleText ||
            (speaker && speaker.speechBubble);

          if (!speaker || !bubbleText) return null;

          const posX = speaker.position?.x ?? speaker.x ?? 540;
          const posY = speaker.position?.y ?? speaker.y ?? 1050;
          const bubbleX = posX;
          const bubbleY = posY - (440 * (speaker.scale ?? 1.0)) - 60;

          const bubbleScale = interpolate(f, [0, 8], [0.8, 1.0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const bubbleOpacity = interpolate(f, [0, 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              style={{
                position: "absolute",
                left: bubbleX,
                top: bubbleY,
                transform: `translate(-50%, -100%) scale(${bubbleScale})`,
                opacity: bubbleOpacity,
                zIndex: 50,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  background: "rgba(8, 12, 22, 0.94)",
                  border: "2px solid rgba(56, 189, 248, 0.9)",
                  borderRadius: 16,
                  padding: "16px 24px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.85), 0 0 20px rgba(56, 189, 248, 0.4)",
                  maxWidth: 620,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    fontWeight: 900,
                    color: "#38bdf8",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  SPEAKER: {speaker.name || speaker.id.toUpperCase()}
                </div>
                <div
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: 26,
                    fontWeight: 900,
                    color: "#ffffff",
                    lineHeight: 1.3,
                  }}
                >
                  "{bubbleText}"
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
