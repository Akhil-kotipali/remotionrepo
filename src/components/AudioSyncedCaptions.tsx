import React, { useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { WordTimestamp } from "../types/tts";

interface Props {
  words: WordTimestamp[];
}

export const AudioSyncedCaptions: React.FC<Props> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find the currently active word index
  const activeWordIndex = useMemo(() => {
    return words.findIndex(
      (w) => frame >= w.startFrame && frame <= w.endFrame
    );
  }, [words, frame]);

  // Determine which page/sentence of words to display
  // Show around 5-6 words chunk centered around the active word
  const activeChunk = useMemo(() => {
    if (words.length === 0) return [];
    
    // Default to first chunk if before first word
    const currentIndex = activeWordIndex !== -1 ? activeWordIndex : 0;
    const chunkSize = 5;
    const chunkStart = Math.floor(currentIndex / chunkSize) * chunkSize;
    return words.slice(chunkStart, chunkStart + chunkSize);
  }, [words, activeWordIndex]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "12px",
          background: "rgba(10, 15, 30, 0.75)",
          backdropFilter: "blur(12px)",
          padding: "16px 28px",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
          maxWidth: "85%",
        }}
      >
        {activeChunk.map((word, idx) => {
          const isActive = frame >= word.startFrame && frame <= word.endFrame;
          const isPast = frame > word.endFrame;

          // Word pop animation when it becomes active
          const scale = isActive
            ? spring({
                frame: frame - word.startFrame,
                fps,
                config: { damping: 12, mass: 0.5, stiffness: 200 },
              }) * 0.15 + 1.05
            : 1;

          return (
            <span
              key={`${word.text}-${idx}-${word.startFrame}`}
              style={{
                fontSize: 38,
                fontWeight: isActive ? 800 : 600,
                color: isActive
                  ? "#38bdf8" // Bright cyan for active word
                  : isPast
                  ? "#94a3b8" // Muted for already spoken words
                  : "#ffffff", // Crisp white for upcoming words
                transform: `scale(${scale})`,
                transition: "color 0.1s ease",
                textShadow: isActive
                  ? "0 0 20px rgba(56, 189, 248, 0.8), 0 0 40px rgba(56, 189, 248, 0.4)"
                  : "0 2px 8px rgba(0,0,0,0.6)",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: "-0.02em",
                display: "inline-block",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

