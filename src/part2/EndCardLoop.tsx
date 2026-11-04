import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {INTER, MONO, MONT} from "./fonts";
import {E, kf, pulse} from "./math";
import {GlitchText} from "./ui/bits";
import {FRIEND_DESIGNS, FriendId} from "./stick/friendDesigns";

const START = 1440; // 48.0s
const IDS: FriendId[] = ["rahul", "meera", "kabir", "nisha", "arjun"];

export const EndCardLoop: React.FC = () => {
  const f = useCurrentFrame();
  if (f < START) return null;
  const l = f - START;
  const t1 = kf(l, [[2, 0], [10, 1, E.out]]);
  const t2 = kf(l, [[6, 0], [18, 1, E.out]]);
  const g = pulse(l, 8, 8);
  const sweep = kf(l, [[6, 0], [22, 1, E.soft]]);
  return (
    <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 42%, #0b1220 0%, #030509 80%)"}}>
      {/* five memories, five colours */}
      <div style={{position: "absolute", top: 380, left: 0, right: 0, height: 260}}>
        {IDS.map((id, i) => {
          const d = FRIEND_DESIGNS[id];
          const s = kf(l, [[2 + i * 2, 0], [12 + i * 2, 1, E.back]]);
          const x = 140 + i * 160 + Math.sin(f * 0.04 + i) * 6;
          const rot = (i - 2) * 7 + Math.sin(f * 0.05 + i * 2) * 1.5;
          return (
            <div key={id} style={{position: "absolute", left: x, top: 40 + Math.abs(i - 2) * 22, width: 190, height: 230, borderRadius: 26, background: `linear-gradient(160deg, ${d.color}cc, ${d.shadowColor}cc)`, border: `3px solid ${d.lightColor}`, transform: `scale(${s}) rotate(${rot}deg)`, boxShadow: `0 0 30px ${d.color}77`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 900, fontSize: 110, color: "rgba(255,255,255,0.85)"}}>
              ?
            </div>
          );
        })}
      </div>
      <div style={{position: "absolute", top: 780, left: 0, right: 0, textAlign: "center"}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 32, letterSpacing: 14, color: "#8fb4ff", opacity: t1, transform: `translateY(${(1 - t1) * 14}px)`}}>PART 3 DROPPING TOMORROW</div>
        <div style={{marginTop: 24, fontFamily: MONT, fontWeight: 900, fontSize: 94, lineHeight: 1.05, color: "#fff", opacity: t2, transform: `translateY(${(1 - t2) * 20}px)`}}>
          <GlitchText g={g}>FIVE DIFFERENT</GlitchText>
          <br />
          <GlitchText g={g}>MEMORIES</GlitchText>
        </div>
        <div style={{margin: "36px auto 0", width: 500 * sweep, height: 4, background: "linear-gradient(90deg, transparent, #ff4d5a, transparent)", opacity: 0.9}} />
        <div style={{marginTop: 36, fontFamily: INTER, fontWeight: 700, fontSize: 34, color: "#ffe14a", letterSpacing: 4, opacity: t2}}>
          LOOK AT THE WINDOW AGAIN...
        </div>
      </div>
    </AbsoluteFill>
  );
};

