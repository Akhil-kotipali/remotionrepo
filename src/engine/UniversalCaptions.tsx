import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { SentenceTiming } from "./types";

export interface CaptionChunk {
  start: number;
  end: number;
  words: {
    t: string;
    s: number;
    e: number;
    hl: 0 | 1 | 2; // 0 = white, 1 = yellow, 2 = red
  }[];
}

export function buildChunksFromSentences(
  sentences: SentenceTiming[],
  fps: number = 30
): CaptionChunk[] {
  const out: CaptionChunk[] = [];

  for (const item of sentences) {
    const a = item.startSec;
    const b = item.endSec;
    const text = item.text;
    const yel = (item.yellowWords || []).map((w) => w.toUpperCase());
    const red = (item.redWords || []).map((w) => w.toUpperCase());

    const words = text.split(/\s+/);
    const groups: string[][] = [];
    let cur: string[] = [];

    for (const w of words) {
      cur.push(w);
      if (cur.length >= 4 || /[.?!…,]$/.test(w)) {
        groups.push(cur);
        cur = [];
      }
    }
    if (cur.length) groups.push(cur);

    // Balance orphan trailing 1-word groups
    if (
      groups.length > 1 &&
      groups[groups.length - 1].length === 1 &&
      groups[groups.length - 2].length < 4
    ) {
      const last = groups.pop()!;
      groups[groups.length - 1].push(...last);
    }

    const total = words.join("").length;
    let t = a;

    for (const g of groups) {
      const share = g.join("").length / total;
      const dur = (b - a) * share;
      let wt = t;
      const wTotal = g.join("").length;

      const wArr = g.map((w) => {
        const wDur = dur * (w.length / wTotal);
        const ws = wt;
        const we = wt + wDur;
        wt = we;
        const clean = w.toUpperCase().replace(/[^A-Z0-9?!']/g, "");
        const isRed = red.some((rw) => rw.replace(/[^A-Z0-9?!']/g, "") === clean);
        const isYellow = yel.some((yw) => yw.replace(/[^A-Z0-9?!']/g, "") === clean);
        const hl: 0 | 1 | 2 = isRed ? 2 : isYellow ? 1 : 0;
        return { t: w, s: ws * fps, e: we * fps, hl };
      });

      out.push({
        start: t * fps,
        end: (t + dur) * fps,
        words: wArr,
      });

      t += dur;
    }
  }

  return out;
}

interface UniversalCaptionsProps {
  sentences: SentenceTiming[];
  fps?: number;
  topY?: number;
}

export const UniversalCaptions: React.FC<UniversalCaptionsProps> = ({
  sentences,
  fps = 30,
  topY = 1260,
}) => {
  const f = useCurrentFrame();
  const chunks = useMemo(() => buildChunksFromSentences(sentences, fps), [sentences, fps]);

  return (
    <>
      {chunks.map((chk, idx) => {
        if (f < chk.start || f > chk.end) return null;

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: topY, // Above YouTube Shorts / Reels UI safe zone
              textAlign: "center",
              zIndex: 140,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "rgba(4, 8, 16, 0.94)",
                border: "2px solid rgba(255, 255, 255, 0.28)",
                borderRadius: 18,
                padding: "14px 28px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.85)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                  rowGap: "8px",
                  columnGap: "18px", // Generous gap prevents word merging
                  fontFamily: "system-ui, -apple-system, Inter, sans-serif",
                  fontWeight: 900,
                  fontSize: 52,
                  lineHeight: 1.15,
                  letterSpacing: 1,
                }}
              >
                {chk.words.map((w, wi) => {
                  const isActive = f >= w.s && f <= w.e;
                  const isRed = w.hl === 2;
                  const isYellow = w.hl === 1;
                  const activeColor = isRed
                    ? "#FF4D5A"
                    : isYellow
                    ? "#FFE14A"
                    : "#FFFFFF";

                  return (
                    <span
                      key={wi}
                      style={{
                        margin: "0 3px",
                        color: isActive ? activeColor : "#FFFFFF",
                        textShadow: isActive
                          ? `0 0 22px ${activeColor}bb, 0 2px 8px rgba(0,0,0,1)`
                          : "0 2px 8px rgba(0,0,0,1)",
                        transform: isActive ? "scale(1.08)" : "scale(1.0)",
                        display: "inline-block",
                        transition: "color 0.1s ease, transform 0.1s ease",
                      }}
                    >
                      {w.t}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

