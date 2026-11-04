import React from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from "remotion";
import {WORLD_H, WORLD_W, STAGE} from "./config";
import {cameraAt, cameraShake, charPose, lightLevel} from "./choreo";
import {FriendRig} from "./rig/FriendRig";
import {FRIEND_DESIGNS, FriendId} from "./stick/friendDesigns";
import {INTER, MONO} from "./fonts";
import {E, clamp, kf, rnd} from "./math";
const charX = (id: FriendId, _f: number) => (STAGE as any)[id].x as number;

const TUBE = {x: 535, y: 811};
const WINDOW = {x: 725, y: 930};
const ORDER: FriendId[] = ["meera", "kabir", "rahul", "nisha", "arjun"];

const DUST = Array.from({length: 40}, (_, i) => ({x: 560 + rnd(`rx${i}`) * 380, y: 760 + rnd(`ry${i}`) * 620, r: 1.4 + rnd(`rr${i}`) * 2.4, sp: 0.15 + rnd(`rs${i}`) * 0.4, ph: rnd(`rp${i}`) * 6.28}));

const headTop = (id: FriendId) => {
  const s = (STAGE as any)[id];
  return s.feet - 400 * (s.h / 440) * (id === "kabir" ? 1.05 : 1);
};

const SUSPECT_NUM: Record<string, string> = {
  rahul: "SUSPECT 1 · RAHUL",
  meera: "SUSPECT 2 · MEERA",
  kabir: "SUSPECT 3 · KABIR",
  nisha: "SUSPECT 4 · NISHA",
  arjun: "ARJUN",
};

const NameTag: React.FC<{id: FriendId; start: number; dur?: number}> = ({id, start, dur = 74}) => {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0 || t > dur) return null;
  const s = kf(f, [[start, 0], [start + 8, 1, E.back]]) * kf(f, [[start + dur - 12, 1], [start + dur, 0]]);
  const d = FRIEND_DESIGNS[id];
  const x = charX(id, f);
  const label = start < 90 && SUSPECT_NUM[id] ? SUSPECT_NUM[id] : d.name.toUpperCase();
  return (
    <div style={{position: "absolute", left: x, top: headTop(id) - 56, transform: `translate(-50%, 0) scale(${s})`, opacity: s, zIndex: 40, pointerEvents: "none"}}>
      <div style={{display: "flex", alignItems: "center", gap: 10, background: "rgba(8,12,20,0.92)", border: `2px solid ${d.lightColor}`, borderRadius: 999, padding: "6px 18px 6px 12px", boxShadow: `0 0 20px ${d.color}88`}}>
        <div style={{width: 14, height: 14, borderRadius: "50%", background: d.lightColor, boxShadow: `0 0 10px ${d.lightColor}`}} />
        <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, color: "#fff", letterSpacing: 2}}>{label}</span>
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
  return (
    <div style={{position: "absolute", left: x, top: headTop(id) - 14, transform: `translate(-50%, -100%) scale(${s})`, transformOrigin: "50% 100%", opacity: s, zIndex: 60}}>
      {/* Floating character name plate sitting cleanly on TOP of the bubble */}
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
          padding: "4px 16px 4px 10px",
          boxShadow: `0 0 16px ${c}aa`,
          zIndex: 70,
          whiteSpace: "nowrap",
        }}
      >
        <div style={{width: 12, height: 12, borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}`}} />
        <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, color: "#fff", letterSpacing: 2}}>
          {d.name.toUpperCase()}
        </span>
      </div>
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
  const morning = 0.8;
  const bgBlur = clamp((s - 1.5) * 2.2, 0, 3.2);
  const sixthShadow = kf(f, [[846, 0], [866, 1], [960, 1], [976, 0]]) + kf(f, [[1296, 0], [1330, 1]]);

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

          {/* Floating glowing character name badges (Hook intro) */}
          <NameTag id="meera" start={15} dur={65} />
          <NameTag id="kabir" start={22} dur={65} />
          <NameTag id="rahul" start={30} dur={65} />
          <NameTag id="nisha" start={38} dur={65} />
          <NameTag id="arjun" start={46} dur={65} />

          {/* Active speaker name tags */}
          <NameTag id="rahul" start={183} dur={75} />
          <NameTag id="meera" start={264} dur={65} />
          <NameTag id="kabir" start={333} dur={65} />
          <NameTag id="nisha" start={402} dur={65} />
          <NameTag id="arjun" start={618} dur={75} />

          <Bubble id="arjun" from={744} to={812} text="Did anyone actually see Dev fall?" wide color="#ff6a74" />

          {/* floor + bottom root */}
          <div style={{position: "absolute", left: 0, top: WORLD_H - 190, width: WORLD_W, height: 190, background: "linear-gradient(to bottom, rgba(4,6,11,0) 0%, rgba(4,6,11,0.92) 62%, #04060b 100%)"}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
