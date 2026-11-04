import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {INTER, MONO, MONT} from "./fonts";
import {E, kf, pulse} from "./math";
import {GlitchText} from "./ui/bits";
import {TypingDots} from "./ui/bits";

const START = 1641;

export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  if (f < START) return null;
  const l = f - START;
  const t1 = kf(l, [[4, 0], [16, 1, E.out]]);
  const t2 = kf(l, [[12, 0], [28, 1, E.out]]);
  const g = Math.max(pulse(l, 12, 10), pulse(l, 52, 8) * 0.6);
  const sixth = 0.35 + 0.45 * Math.abs(Math.sin(l * 0.35) * Math.sin(l * 0.11));
  const sweep = kf(l, [[10, 0], [34, 1, E.soft]]);
  return (
    <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 42%, #0b1220 0%, #030509 80%)"}}>
      <div style={{position: "absolute", top: 640, left: 0, right: 0, textAlign: "center"}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: 14, color: "#8fb4ff", opacity: t1, transform: `translateY(${(1 - t1) * 14}px)`}}>PART 2</div>
        <div style={{marginTop: 30, fontFamily: MONT, fontWeight: 900, fontSize: 118, lineHeight: 1.0, color: "#fff", opacity: t2, transform: `translateY(${(1 - t2) * 26}px)`}}>
          <GlitchText g={g}>THE EXTRA</GlitchText>
          <br />
          <GlitchText g={g}>PERSON</GlitchText>
        </div>
        <div style={{margin: "46px auto 0", width: 520 * sweep, height: 4, background: "linear-gradient(90deg, transparent, #ff4d5a, transparent)", opacity: 0.9}} />
        {/* five friends… and a sixth that shouldn't be there */}
        <div style={{display: "flex", justifyContent: "center", gap: 26, marginTop: 56, opacity: t2}}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{width: 30, height: 30, borderRadius: "50%", background: "#d9e4f5", boxShadow: "0 0 14px rgba(160,200,255,0.6)"}} />
          ))}
          <div style={{width: 30, height: 30, borderRadius: "50%", border: "3px solid #ff4d5a", opacity: sixth, boxShadow: `0 0 ${24 * sixth}px #ff4d5a`}} />
        </div>
        <div style={{marginTop: 60, fontFamily: INTER, fontWeight: 600, fontSize: 32, color: "#7d8aa0", letterSpacing: 4, opacity: t2 * 0.9}}>FOLLOW  ·  DON'T MISS IT</div>
      </div>
      {/* loop-back cue: same typing dots as frame 0 */}
      <div style={{position: "absolute", bottom: 330, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: kf(l, [[40, 0], [52, 1]])}}>
        <TypingDots f={f} />
      </div>
    </AbsoluteFill>
  );
};
