import React from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from "remotion";
import {FriendStickFigure} from "./stick/FriendStickFigure";
import {FRIEND_DESIGNS, FriendId} from "./stick/friendDesigns";
import {MONO} from "./fonts";
import {E, clamp, kf, noise, pulse} from "./math";

// The "old photograph" (exterior plate cropped like a phone photo) + the five friends.
// Meera is not in it — she took the picture (revealed in Part 2).
const CARD_W = 960;
const CARD_H = 1050;
const FIG_H = 360;
const K = FIG_H / 440;
const FEET_Y = 1030;
const FIG_TOP = FEET_Y - 416 * K;
const HEAD = {x: 480, y: FIG_TOP + 62 * K}; // Arjun's head in card coords

const CAST: {id: FriendId; x: number; reveal: number; facing: "left" | "right"}[] = [
  {id: "rahul", x: 160, reveal: 1437, facing: "right"},
  {id: "nisha", x: 320, reveal: 1465, facing: "right"},
  {id: "arjun", x: 480, reveal: 1493, facing: "right"},
  {id: "dev", x: 640, reveal: 1479, facing: "left"},
  {id: "kabir", x: 800, reveal: 1451, facing: "left"},
];

const REVEAL_TIMES = CAST.map((c) => c.reveal).sort((a, b) => a - b);

export const PhotoShot: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 1404) return null;

  const appear = kf(f, [[1408, 0], [1424, 1, E.out]]);
  const enter = kf(f, [[1408, 0.55], [1446, 1, E.out]]);
  const rot = kf(f, [[1408, -3.5], [1450, -1.1, E.out], [1524, -0.6]]);

  const z = kf(f, [[1528, 0], [1634, 1, E.inOut]]);
  const zs = 1 + 2.75 * z;
  const dy = (840 - (315 + HEAD.y)) * z; // bring Arjun's head to screen centre
  // Eyes appear once friends enter photo
  const gaze = kf(f, [[1485, 0], [1494, 1, E.out]]);
  // AT EXACTLY 50.0 SECONDS (frame 1500), eyes turn to look at Arjun:
  const look = kf(f, [[1500, 0], [1516, 1, E.inOut]]);
  // Arjun's eyes widen with dread:
  const arjunWide = kf(f, [[1518, 1], [1542, 1.35, E.out]]);

  const shutter = pulse(f, 1425, 6);
  const beat = pulse(f, 1590, 10) + pulse(f, 1606, 10) + pulse(f, 1620, 10);

  return (
    <AbsoluteFill style={{opacity: appear, background: "radial-gradient(ellipse at 50% 45%, #0c111b 0%, #04060a 75%)"}}>
      {/* viewer chrome */}
      <div style={{position: "absolute", left: 50, top: 150, fontFamily: MONO, fontSize: 26, color: "#6f7c92", letterSpacing: 3, opacity: 1 - z}}>1 / 1 · 2.4 MB</div>
      <div style={{position: "absolute", right: 50, top: 150, display: "flex", gap: 12, opacity: 1 - z * 1.4}}>
        {[0, 1, 2, 3, 4].map((i) => {
          const tt = REVEAL_TIMES[i];
          const on = f >= tt;
          return (
            <div key={i} style={{width: 20, height: 20, borderRadius: "50%", border: "2px solid #8fb4ff", background: on ? "#8fb4ff" : "transparent", boxShadow: on ? "0 0 12px #8fb4ff" : "none", transform: `scale(${1 + 0.7 * pulse(f, tt, 8)})`}} />
          );
        })}
      </div>

      <div style={{position: "absolute", left: 540 - CARD_W / 2, top: 315, width: CARD_W, height: CARD_H, transformOrigin: `${HEAD.x}px ${HEAD.y}px`, transform: `translateY(${dy}px) scale(${zs * enter}) rotate(${rot}deg)`}}>
        <div style={{position: "relative", width: CARD_W, height: CARD_H, borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 10px #d9d4c7", filter: "sepia(0.2) saturate(0.82) contrast(1.05)"}}>
          {/* plate crop */}
          <Img src={staticFile("backgrounds/exterior.jpg")} style={{position: "absolute", left: 0, top: -760 * (CARD_W / 1536), width: CARD_W, height: 2752 * (CARD_W / 1536)}} />
          <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)"}} />

          {/* five friends */}
          {CAST.map((c, i) => {
            const t = kf(f, [[c.reveal, 0], [c.reveal + 12, 1, E.back]]);
            if (t <= 0) return null;
            const fd = FRIEND_DESIGNS[c.id];
            const dir = Math.sign(480 - c.x);
            const isA = c.id === "arjun";
            const idle = noise(f * 0.03, i) * 0.6;
            const eyeShift = isA ? -0.6 * look : dir * 3.6 * look;
            const flash = pulse(f, c.reveal, 10);
            return (
              <div
                key={c.id}
                style={{
                  position: "absolute",
                  left: c.x - (240 * K) / 2,
                  top: FIG_TOP + (1 - t) * 18,
                  width: 240 * K,
                  height: 440 * K,
                  opacity: clamp(t * 1.4, 0, 1),
                  transform: `scale(${0.94 + 0.06 * t}) rotate(${idle + (isA ? 0 : dir * 1.8 * look)}deg)`,
                  transformOrigin: "50% 100%",
                  filter: `brightness(${0.78 + flash * 0.9}) saturate(0.85) drop-shadow(0 0 ${14 * flash}px ${fd.lightColor})`,
                }}
              >
                <FriendStickFigure
                  friend={c.id}
                  facing={c.facing}
                  width={240 * K}
                  height={440 * K}
                  glow={false}
                  animate={false}
                  showEyes={gaze > 0.01}
                  eyeOpacity={gaze}
                  eyeShift={eyeShift}
                  eyeWide={isA ? arjunWide : 1}
                />
              </div>
            );
          })}

          {/* red heartbeat ring around Arjun (zoom beat) */}
          {z > 0.25 && (
            <div style={{position: "absolute", left: HEAD.x - 70 - beat * 30, top: HEAD.y - 70 - beat * 30, width: 140 + beat * 60, height: 140 + beat * 60, borderRadius: "50%", border: `3px solid rgba(255,70,90,${0.55 * Math.min(1, beat)})`}} />
          )}

          {/* camera date stamp */}
          <div style={{position: "absolute", right: 36, bottom: 30, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: "#ff9a3c", textShadow: "0 0 10px rgba(255,150,60,0.8)", opacity: 0.9 * (1 - z)}}>01:52 AM</div>

          {/* shutter flash */}
          <div style={{position: "absolute", inset: 0, background: "#fff", opacity: shutter * 0.8}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
