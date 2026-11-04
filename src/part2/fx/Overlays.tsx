import React from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from "remotion";
import {HITS, MAJOR_HITS, heartbeatFrames} from "../config";
import {clamp, kf, pulse, rnd} from "../math";

/** film grain — 6 pre-rendered noise tiles cycled every 2 frames (cheap + organic) */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.16}) => {
  const f = useCurrentFrame();
  const i = Math.floor(f / 2) % 6;
  return (
    <AbsoluteFill style={{mixBlendMode: "overlay", opacity, pointerEvents: "none"}}>
      <Img src={staticFile(`fx/grain_${i}.png`)} style={{width: "100%", height: "100%", objectFit: "cover"}} />
    </AbsoluteFill>
  );
};

/** vignette that "beats" with the heartbeat and tightens as fear rises */
export const Vignette: React.FC = () => {
  const f = useCurrentFrame();
  const beat = heartbeatFrames().reduce((m, b) => Math.max(m, pulse(f, b, 9)), 0);
  const tight = kf(f, [[0, 0.55], [135, 0.45], [468, 0.7], [567, 0.9], [666, 0.55], [936, 0.85], [1296, 0.7], [1557, 1], [1641, 1]]);
  const o = clamp(tight + beat * 0.18, 0, 1);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 78% 62% at 50% 48%, rgba(0,0,0,0) 40%, rgba(0,0,0,${0.55 * o}) 78%, rgba(0,0,0,${0.9 * o}) 100%)`,
        pointerEvents: "none",
      }}
    />
  );
};

/** red pulse when the sixth figure / the handwriting lands */
export const ColorWash: React.FC = () => {
  const f = useCurrentFrame();
  const red = Math.max(pulse(f, 85, 12) * 0.3, pulse(f, 567, 14) * 0.34, pulse(f, 1296, 12) * 0.3, pulse(f, 1557, 14) * 0.22);
  const cold = kf(f, [[936, 0], [990, 0.16], [1014, 0.0], [1557, 0], [1600, 0.16]]);
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <AbsoluteFill style={{background: "#2a56a8", mixBlendMode: "color", opacity: cold}} />
      <AbsoluteFill style={{background: "#ff1f2d", mixBlendMode: "screen", opacity: red}} />
    </AbsoluteFill>
  );
};

/** screen-wide horizontal-slice glitch used on cuts and hits */
export const GlitchBurst: React.FC<{at: number; len?: number; power?: number}> = ({at, len = 7, power = 1}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + len) return null;
  const k = f - at;
  const slices = Array.from({length: 9}, (_, i) => {
    const y = rnd(`gy${at}-${k}-${i}`) * 1920;
    const h = 20 + rnd(`gh${at}-${k}-${i}`) * 150;
    const dx = (rnd(`gx${at}-${k}-${i}`) - 0.5) * 140 * power;
    const c = rnd(`gc${at}-${k}-${i}`);
    return {y, h, dx, c};
  });
  const fade = 1 - k / len;
  return (
    <AbsoluteFill style={{pointerEvents: "none", opacity: 0.35 + 0.65 * fade}}>
      {slices.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.dx,
            top: s.y,
            width: 1080,
            height: s.h,
            background: s.c < 0.33 ? "rgba(255,40,70,0.38)" : s.c < 0.66 ? "rgba(60,230,255,0.32)" : "rgba(255,255,255,0.16)",
            mixBlendMode: "screen",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/** white/red flash on hits */
export const HitFlash: React.FC = () => {
  const f = useCurrentFrame();
  const o = HITS.reduce((m, h) => Math.max(m, pulse(f, h, 5) * (MAJOR_HITS.includes(h) ? 0.4 : 0.09)), 0);
  if (o <= 0.01) return null;
  return <AbsoluteFill style={{background: "#fff", opacity: o, mixBlendMode: "screen", pointerEvents: "none"}} />;
};

/** fade-through-black (used for the final cut) */
export const Fade: React.FC<{from: number; to: number; dir?: "in" | "out"}> = ({from, to, dir = "out"}) => {
  const f = useCurrentFrame();
  const t = clamp((f - from) / Math.max(1, to - from), 0, 1);
  const o = dir === "out" ? t : 1 - t;
  if (o <= 0.001) return null;
  return <AbsoluteFill style={{background: "#000", opacity: o, pointerEvents: "none"}} />;
};

/** dark sweep used between world ↔ insert */
export const DarkSweep: React.FC<{at: number; len?: number}> = ({at, len = 10}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + len) return null;
  const t = (f - at) / len;
  return (
    <AbsoluteFill style={{pointerEvents: "none", opacity: Math.sin(t * Math.PI) * 0.8}}>
      <div style={{position: "absolute", left: 0, top: 1920 * (1 - t) - 400, width: 1080, height: 800, background: "linear-gradient(to bottom, rgba(0,0,0,0), #000 50%, rgba(0,0,0,0))"}} />
    </AbsoluteFill>
  );
};
