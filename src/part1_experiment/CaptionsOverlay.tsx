import React, {useMemo} from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {CAPTION_Y, FPS} from "../part1/config";
import {MONT} from "../part1/fonts";
import {E, kf} from "../part1/math";
import {buildChunks} from "./captions";

export const CaptionsOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const chunks = useMemo(() => buildChunks(FPS), []);
  const c = chunks.find((ch) => f >= ch.start && f < ch.end);
  if (!c) return null;
  const pop = kf(f, [[c.start, 0.9], [c.start + 5, 1, E.back]]);
  const fade = kf(f, [[c.start, 0], [c.start + 3, 1], [c.end - 3, 1], [c.end, 0]]);
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: CAPTION_Y - 90,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "6px 20px",
          opacity: fade,
          transform: `scale(${pop})`,
          fontFamily: MONT,
          fontWeight: 900,
          fontSize: 78,
          lineHeight: 1.02,
          textTransform: "uppercase",
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        {c.words.map((w, i) => {
          const shown = f >= w.s - 1;
          const p = kf(f, [[w.s, 0], [w.s + 5, 1, E.back]]);
          const color = w.hl === 2 ? "#ff4d5a" : w.hl === 1 ? "#ffe14a" : "#ffffff";
          return (
            <span
              key={i}
              style={{
                opacity: shown ? 1 : 0,
                color,
                transform: `scale(${0.82 + 0.18 * p + (w.hl ? 0.06 * p : 0)})`,
                textShadow:
                  w.hl === 2
                    ? "0 0 28px rgba(255,77,90,0.85), 0 4px 18px rgba(0,0,0,0.9)"
                    : w.hl === 1
                      ? "0 0 24px rgba(255,225,74,0.7), 0 4px 18px rgba(0,0,0,0.9)"
                      : "0 4px 20px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.8)",
                display: "inline-block",
              }}
            >
              {w.t}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

