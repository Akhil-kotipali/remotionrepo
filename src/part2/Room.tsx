import React from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from "remotion";
import {WORLD_H, WORLD_W, STAGE} from "./config";
import {cameraAt, cameraShake, charPose, charX, lightLevel} from "./choreo";
import {FriendRig} from "./rig/FriendRig";
import {FRIEND_DESIGNS, FriendId} from "./stick/friendDesigns";
import {INTER, MONO} from "./fonts";
import {E, clamp, kf, rnd} from "./math";

const TUBE = {x: 535, y: 811};
const WINDOW = {x: 725, y: 930};
const ORDER: FriendId[] = ["meera", "kabir", "rahul", "nisha", "arjun"];

const DUST = Array.from({length: 40}, (_, i) => ({x: 560 + rnd(`rx${i}`) * 380, y: 760 + rnd(`ry${i}`) * 620, r: 1.4 + rnd(`rr${i}`) * 2.4, sp: 0.15 + rnd(`rs${i}`) * 0.4, ph: rnd(`rp${i}`) * 6.28}));

const headTop = (id: FriendId) => {
  const s = (STAGE as any)[id];
  return s.feet - 400 * (s.h / 440) * (id === "kabir" ? 1.05 : 1);
};

const NameTag: React.FC<{id: FriendId; start: number}> = ({id, start}) => {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0 || t > 74) return null;
  const s = kf(f, [[start, 0], [start + 8, 1, E.back]]) * kf(f, [[start + 62, 1], [start + 74, 0]]);
  const d = FRIEND_DESIGNS[id];
  const x = charX(id, f);
  return (
    <div style={{position: "absolute", left: x, top: headTop(id) - 56, transform: `translate(-50%, 0) scale(${s})`, opacity: s}}>
      <div style={{display: "flex", alignItems: "center", gap: 12, background: "rgba(8,12,20,0.88)", border: `2px solid ${d.lightColor}`, borderRadius: 999, padding: "8px 22px 8px 14px", boxShadow: `0 0 24px ${d.color}88`}}>
        <div style={{width: 20, height: 20, borderRadius: "50%", background: d.lightColor, boxShadow: `0 0 12px ${d.lightColor}`}} />
        <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 34, color: "#fff", letterSpacing: 3}}>{d.name.toUpperCase()}</span>
      </div>
    </div>
  );
};

const Bubble: React.FC<{id: FriendId; from: number; to: number; text: string; wide?: boolean; color?: string}> = ({id, from, to, text, wide, color}) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const s = kf(f, [[from, 0], [from + 7, 1, E.back]]) * kf(f, [[to - 7, 1], [to, 0]]);
  const d = FRIEND_DESIGNS[id];
  const x = charX(id, f);
  const c = color ?? d.lightColor;
  const isDialogue = text !== "?" && text !== "…";
  return (
    <div style={{position: "absolute", left: x, top: headTop(id) - 14, transform: `translate(-50%, -100%) scale(${s})`, transformOrigin: "50% 100%", opacity: s, zIndex: 60}}>
      {/* Floating character name plate sitting cleanly on TOP of the bubble */}
      {isDialogue && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -24,
            transform: "translate(-50%, 0)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(6, 10, 18, 0.95)",
            border: `2px solid ${c}`,
            borderRadius: 999,
            padding: "4px 14px",
            boxShadow: `0 0 16px ${c}88`,
            whiteSpace: "nowrap",
            zIndex: 70,
          }}
        >
          <div style={{width: 8, height: 8, borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}`}} />
          <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 22, color: "#fff", letterSpacing: 2}}>
            {d.name.toUpperCase()}
          </span>
        </div>
      )}
      <div style={{position: "relative", background: "rgba(10,14,24,0.92)", border: `3px solid ${c}`, borderRadius: 26, padding: wide ? "16px 26px" : "10px 26px", maxWidth: wide ? 430 : 360, textAlign: "center", fontFamily: INTER, fontWeight: 700, fontSize: wide ? 38 : 44, lineHeight: 1.15, color: "#fff", boxShadow: `0 0 26px ${c}66`}}>
        {text}
        <div style={{position: "absolute", left: "50%", bottom: -16, width: 26, height: 26, background: "rgba(10,14,24,0.92)", borderRight: `3px solid ${c}`, borderBottom: `3px solid ${c}`, transform: "translateX(-50%) rotate(45deg)"}} />
      </div>
    </div>
  );
};

export const Room: React.FC = () => {
  const f = useCurrentFrame();
  const cam = cameraAt(f);
  const sh = cameraShake(f);
  const s = cam.s;
  const x = clamp(cam.x, 540 / s, WORLD_W - 540 / s);
  const y = clamp(cam.y, 960 / s, WORLD_H - 960 / s);
  const light = lightLevel(f);
  const morning = kf(f, [[135, 0.0], [150, 1]]);
  const bgBlur = clamp((s - 1.5) * 2.2, 0, 3.2);
  const sixthShadow = kf(f, [[936, 0], [1000, 1], [1014, 0]]);

  return (
    <AbsoluteFill style={{background: "#04060b", overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "540px 960px", transform: `translate(${sh.dx}px, ${sh.dy}px) rotate(${cam.rot}deg)`}}>
        <div style={{position: "absolute", left: 0, top: 0, width: WORLD_W, height: WORLD_H, transformOrigin: "0 0", transform: `translate(${540 - x * s}px, ${960 - y * s}px) scale(${s})`, filter: `brightness(${1 + 0.16 * morning}) saturate(${0.95 - sixthShadow * 0.15})`}}>
          <Img src={staticFile("backgrounds/living_room.jpg")} style={{position: "absolute", inset: 0, width: WORLD_W, height: WORLD_H, filter: `blur(${bgBlur}px)`}} />

          {/* wall tube light */}
          <div style={{position: "absolute", left: TUBE.x - 380, top: TUBE.y - 330, width: 760, height: 660, background: "radial-gradient(ellipse, rgba(255,214,110,0.34) 0%, rgba(255,190,80,0.1) 42%, rgba(255,190,80,0) 72%)", mixBlendMode: "screen", opacity: light * (1 - 0.35 * morning)}} />

          {/* MORNING — daylight through the curtains */}
          <div style={{position: "absolute", left: WINDOW.x - 380, top: WINDOW.y - 330, width: 760, height: 700, background: "radial-gradient(ellipse, rgba(225,238,255,0.62) 0%, rgba(200,225,255,0.22) 42%, rgba(200,225,255,0) 72%)", mixBlendMode: "screen", opacity: 0.85 * morning}} />
          <div style={{position: "absolute", left: 400, top: 1000, width: 700, height: 520, background: "linear-gradient(115deg, rgba(235,244,255,0.34) 0%, rgba(235,244,255,0.0) 70%)", clipPath: "polygon(30% 0%, 80% 0%, 100% 100%, 0% 100%)", mixBlendMode: "screen", opacity: 0.5 * morning * (0.9 + 0.1 * Math.sin(f * 0.03))}} />

          {/* dust in the light shaft */}
          {DUST.map((d, i) => {
            const px = d.x + Math.sin(f * 0.012 * d.sp * 4 + d.ph) * 22;
            const py = 760 + ((((d.y - 760 - f * d.sp * 0.5) % 620) + 620) % 620);
            return <div key={i} style={{position: "absolute", left: px, top: py, width: d.r, height: d.r, borderRadius: "50%", background: "#fff3d6", opacity: 0.15 + 0.35 * Math.abs(Math.sin(f * 0.04 + d.ph)) * morning, filter: "blur(0.6px)"}} />;
          })}

          {/* the five friends (back to front) */}
          {ORDER.map((id) => {
            const st = (STAGE as any)[id];
            const k = st.h / 440;
            const figW = 240 * k;
            const px = charX(id, f);
            const pose = charPose(id, f);
            return (
              <div key={id}>
                <div style={{position: "absolute", left: px - 170 * k, top: st.feet - 24, width: 340 * k, height: 50, background: "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)"}} />
                <div style={{position: "absolute", left: px - figW / 2, top: st.feet - 416 * k, width: figW, height: st.h, transform: id === "kabir" ? "scaleY(1.05)" : undefined, transformOrigin: "50% 100%", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.4)) brightness(0.98)"}}>
                  <FriendRig id={id} pose={pose} width={figW} height={st.h} rim={0.18 * light} cool={0.2 * morning} jacket={id === "arjun"} />
                </div>
              </div>
            );
          })}

          {/* name tags (first appearance) */}
          <NameTag id="arjun" start={160} />
          <NameTag id="rahul" start={210} />
          <NameTag id="meera" start={222} />
          <NameTag id="kabir" start={234} />
          <NameTag id="nisha" start={245} />

          {/* "Nobody remembered…" question marks */}
          <Bubble id="rahul" from={672} to={716} text="?" />
          <Bubble id="meera" from={684} to={728} text="?" />
          <Bubble id="kabir" from={696} to={740} text="?" />
          <Bubble id="nisha" from={708} to={752} text="?" />
          {/* dialogue */}
          <Bubble id="rahul" from={746} to={806} text="Probably a reflection." wide />
          <Bubble id="kabir" from={812} to={884} text="Impossible. He's facing forward." wide color="#ff6a74" />
          <Bubble id="nisha" from={888} to={930} text="…" />
          <Bubble id="meera" from={940} to={1010} text="Why does that person look like Arjun?" wide color="#ff6a74" />

          {/* floor + bottom root */}
          <div style={{position: "absolute", left: 0, top: WORLD_H - 190, width: WORLD_W, height: 190, background: "linear-gradient(to bottom, rgba(4,6,11,0) 0%, rgba(4,6,11,0.92) 62%, #04060b 100%)"}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
