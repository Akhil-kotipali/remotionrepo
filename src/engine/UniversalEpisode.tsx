import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { EpisodeConfig } from "./types";
import { DossierScene } from "./scenes/DossierScene";
import { Showcase3DScene } from "./scenes/Showcase3DScene";
import { DialogueScene } from "./scenes/DialogueScene";
import { InfographicScene } from "./scenes/InfographicScene";
import { UniversalCaptions } from "./UniversalCaptions";
import { ColorWash, Grain, Vignette } from "../part3/fx/Overlays";

interface UniversalEpisodeProps {
  config: EpisodeConfig;
}

export const UniversalEpisode: React.FC<UniversalEpisodeProps> = ({ config }) => {
  const f = useCurrentFrame();
  const totalFrames = config.durationInFrames || config.totalDurationInFrames || 900;
  const voPath = config.voiceoverAudioPath || config.audioTrack;
  const dronePath = config.droneAudioPath || config.droneAudioTrack;
  const sfx = config.sfxCues || [];

  // Normalize scene timeline: auto-calculate fromFrame if omitted
  let cumulativeFrame = 0;
  const normalizedScenes = (config.scenes || []).map((scene) => {
    const duration = scene.durationFrames || scene.durationInFrames || 90;
    const fromFrame = scene.fromFrame !== undefined ? scene.fromFrame : cumulativeFrame;
    cumulativeFrame = fromFrame + duration;
    return {
      ...scene,
      fromFrame,
      durationFrames: duration,
    };
  });

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {/* ----------------------------------------------------------------- */}
      {/* SCENE COMPOSITOR (TIME-SLICED ACCORDING TO SCHEMA)               */}
      {/* ----------------------------------------------------------------- */}
      {normalizedScenes.map((scene) => {
        const isCurrent =
          f >= scene.fromFrame && f < scene.fromFrame + scene.durationFrames;
        if (!isCurrent) return null;

        const localFrame = f - scene.fromFrame;

        return (
          <AbsoluteFill key={scene.id}>
            {scene.type === "dossier" && (
              <DossierScene
                config={scene}
                localFrame={localFrame}
                durationFrames={scene.durationFrames}
              />
            )}
            {(scene.type === "showcase3d" || scene.type === "3d_showcase") && (
              <Showcase3DScene
                config={scene}
                localFrame={localFrame}
                durationFrames={scene.durationFrames}
                width={config.width}
                height={config.height}
              />
            )}
            {scene.type === "dialogue" && (
              <DialogueScene
                config={scene}
                localFrame={localFrame}
                durationFrames={scene.durationFrames}
              />
            )}
            {scene.type === "infographic" && (
              <InfographicScene
                config={scene}
                localFrame={localFrame}
                durationFrames={scene.durationFrames}
              />
            )}
          </AbsoluteFill>
        );
      })}

      {/* ----------------------------------------------------------------- */}
      {/* CINEMATIC OVERLAYS & GRADING                                      */}
      {/* ----------------------------------------------------------------- */}
      <ColorWash />
      <Vignette />
      <Grain opacity={0.16} />

      {/* ----------------------------------------------------------------- */}
      {/* KINETIC AUDIO-SYNCED SUBTITLES                                    */}
      {/* ----------------------------------------------------------------- */}
      {config.sentences && config.sentences.length > 0 && (
        <UniversalCaptions sentences={config.sentences} fps={config.fps} topY={1260} />
      )}

      {/* ----------------------------------------------------------------- */}
      {/* SEAMLESS LOOP BRIDGE (WHITE FLASH & APV REWATCH PROMPT)            */}
      {/* ----------------------------------------------------------------- */}
      {config.enableSeamlessLoop && (
        <>
          {/* End Flash: ramps to 100% pure white at the final frame */}
          {f >= totalFrames - 12 && (
            <AbsoluteFill
              style={{
                background: "#ffffff",
                opacity: interpolate(
                  f,
                  [totalFrames - 12, totalFrames - 1],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                ),
                zIndex: 100,
              }}
            />
          )}

          {/* Loop Reset Flash: dissolves smoothly from white in the first 12 frames */}
          {f <= 12 && (
            <AbsoluteFill
              style={{
                background: "#ffffff",
                opacity: interpolate(f, [0, 12], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                zIndex: 100,
              }}
            />
          )}

          {/* Retention Rewatch Header Banner */}
          {config.loopRewatchPrompt && f >= totalFrames - 45 && (
            <div
              style={{
                position: "absolute",
                top: 250,
                left: 0,
                right: 0,
                textAlign: "center",
                zIndex: 150,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(10, 16, 28, 0.94)",
                  border: "2px solid #ffcc00",
                  borderRadius: 12,
                  padding: "10px 28px",
                  boxShadow: "0 0 30px rgba(255,204,0,0.6)",
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontWeight: 900,
                    fontSize: 22,
                    color: "#ffcc00",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {config.loopRewatchPrompt}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* AUDIO ENGINE (VOICEOVER + DRONE + SPATIAL SFX)                    */}
      {/* ----------------------------------------------------------------- */}
      {/* 1. Master Voiceover Track */}
      {voPath && <Audio src={staticFile(voPath)} volume={1.0} />}

      {/* 2. Continuous Ambient Drone Bed */}
      {dronePath && (
        <Audio
          src={staticFile(dronePath)}
          volume={config.droneVolume ?? 0.3}
        />
      )}

      {/* 3. Spatial SFX Cues */}
      {sfx.map((cue, idx) => {
        const soundSrc =
          cue.sound.includes("/") || cue.sound.endsWith(".wav") || cue.sound.endsWith(".mp3")
            ? cue.sound
            : `audio/sfx/${cue.sound}.wav`;
        return (
          <Sequence
            key={`cue_${idx}`}
            from={cue.frame}
            durationInFrames={60}
          >
            <Audio
              src={staticFile(soundSrc)}
              volume={cue.volume}
              playbackRate={cue.playbackRate ?? 1}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
