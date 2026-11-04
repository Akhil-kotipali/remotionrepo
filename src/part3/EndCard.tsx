import React from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from "remotion";
import {INTER, MONO, MONT} from "./fonts";
import {E, kf, pulse} from "./math";
import {GlitchText} from "./ui/bits";

const START = 1551;

export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  if (f < START) return null;
  const l = f - START;
  const t1 = kf(l, [[4, 0], [16, 1, E.out]]);
  const t2 = kf(l, [[12, 0], [28, 1, E.out]]);
  const g = Math.max(pulse(l, 12, 10), pulse(l, 50, 8) * 0.6);
  const sweep = kf(l, [[10, 0], [34, 1, E.soft]]);
  const rec = Math.floor(l / 12) % 2 === 0;
  return (
    <AbsoluteFill style={{background: "#030509"}}>
      <Img src={staticFile("backgrounds/staircase.jpg")} style={{position: "absolute", left: -240, top: -100, width: 1560, height: 2795, filter: "blur(8px) brightness(0.32) saturate(0.8)"}} />
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.9) 80%)"}} />
      {/* steps */}
      <div style={{position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", opacity: t1}}>
        <svg width={420} height={300} viewBox="0 0 420 300">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={20 + i * 56} y={250 - i * 40} width={380 - i * 56} height={34} fill="none" stroke="#8fb4ff" strokeWidth={4} opacity={0.35 + i * 0.12} />
          ))}
          <line x1={36} y1={236} x2={380} y2={30} stroke="#ff4d5a" strokeWidth={4} strokeDasharray="10 8" opacity={0.8} />
        </svg>
      </div>
      <div style={{position: "absolute", top: 760, left: 0, right: 0, textAlign: "center"}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: 14, color: "#8fb4ff", opacity: t1, transform: `translateY(${(1 - t1) * 14}px)`}}>PART 4</div>
        <div style={{marginTop: 30, fontFamily: MONT, fontWeight: 900, fontSize: 118, lineHeight: 1.02, color: "#fff", opacity: t2, transform: `translateY(${(1 - t2) * 26}px)`}}>
          <GlitchText g={g}>WATCH</GlitchText>
          <br />
          <GlitchText g={g}>THE STAIRS</GlitchText>
        </div>
        <div style={{margin: "46px auto 0", width: 520 * sweep, height: 4, background: "linear-gradient(90deg, transparent, #ff4d5a, transparent)"}} />
        <div style={{marginTop: 54, fontFamily: INTER, fontWeight: 600, fontSize: 32, color: "#7d8aa0", letterSpacing: 4, opacity: t2 * 0.9}}>FOLLOW  ·  DON'T MISS IT</div>
      </div>
      {/* loop cue: a recording starts */}
      <div style={{position: "absolute", bottom: 330, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: kf(l, [[36, 0], [48, 1]])}}>
        <div style={{display: "flex", alignItems: "center", gap: 16, fontFamily: MONO, fontWeight: 700, fontSize: 44, color: "#fff", background: "rgba(0,0,0,0.6)", padding: "12px 28px", borderRadius: 10}}>
          <div style={{width: 26, height: 26, borderRadius: "50%", background: rec ? "#ff2e4d" : "#4a1219"}} />
          REC
        </div>
      </div>
    </AbsoluteFill>
  );
};
