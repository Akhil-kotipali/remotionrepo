import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeDScene } from "./components/ThreeDScene";
import { AudioSyncedCaptions } from "./components/AudioSyncedCaptions";
import voiceData from "../public/audio/demo_voice.json";
import { TTSMetadata } from "./types/tts";

const metadata = voiceData as TTSMetadata;

export const VoiceAnd3DComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Check if character is actively speaking on the current frame
  const isSpeaking = metadata.words.some(
    (w) => frame >= w.startFrame && frame <= w.endFrame
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050816",
        background: "radial-gradient(circle at 50% 40%, #0f172a 0%, #020617 100%)",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* 3D Animated Scene Layer */}
      <ThreeDScene isSpeaking={isSpeaking} width={width} height={height} />

      {/* Voice Audio Track (Synced frame-by-frame) */}
      <Audio src={staticFile(metadata.audioFile)} />

      {/* Header Overlay */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 64px",
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: isSpeaking ? "#10b981" : "#64748b",
              boxShadow: isSpeaking ? "0 0 16px #10b981" : "none",
              transition: "all 0.1s ease",
            }}
          />
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#94a3b8" }}>
            {isSpeaking ? "Voice Active (ElevenLabs)" : "Voice Idle"}
          </span>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            padding: "8px 18px",
            borderRadius: "999px",
            fontSize: 16,
            fontWeight: 600,
            color: "#38bdf8",
            border: "1px solid rgba(56, 189, 248, 0.3)",
          }}
        >
          Remotion 3D Engine
        </div>
      </div>

      {/* Frame-accurate Captions */}
      <AudioSyncedCaptions words={metadata.words} />
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => {
  return (
    <Composition
      id="VoiceAnd3D"
      component={VoiceAnd3DComposition}
      durationInFrames={metadata.durationInFrames || 260}
      fps={metadata.fps || 30}
      width={1920}
      height={1080}
    />
  );
};
