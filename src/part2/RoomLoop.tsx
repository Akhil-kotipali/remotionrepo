import React from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from "remotion";
import {WORLD_H, WORLD_W, STAGE} from "./config";
import {cameraShake, charPose, charX, lightLevel} from "./choreo";
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
      )}
      <div style={{position: "relative", background: "rgba(10,14,24,0.92)", border: `3px solid ${c}`, borderRadius: 26, padding: wide ? "16px 26px" : "10px 26px", maxWidth: wide ? 460 : 360, textAlign: "center", fontFamily: INTER, fontWeight: 700, fontSize: wide ? 36 : 44, lineHeight: 1.15, color: "#fff", boxShadow: `0 0 26px ${c}66`}}>
        {text}
        <div style={{position: "absolute", left: "50%", bottom: -16, width: 26, height: 26, background: "rgba(10,14,24,0.92)", borderRight: `3px solid ${c}`, borderBottom: `3px solid ${c}`, transform: "translateX(-50%) rotate(45deg)"}} />
      </div>
    </div>
  );
};

function cameraAtLoop(f: number) {
  // If in living-room intro (135..240), use standard camera
  if (f < 300) {
    const s = kf(f, [[135, 1.02], [200, 1.14], [240, 1.24]], E.soft);
    const x = kf(f, [[135, 540], [200, 570], [240, 590]], E.soft);
    const y = kf(f, [[135, 990], [200, 1100], [240, 1150]], E.soft);
    return {s, x, y, rot: 0};
  }

  // Living-room dialogue scene (365..765): dynamic push-ins and tracking on speakers
  const K: [number, number, number, number][] = [
    [365, 1.25, 570, 1150],  // Wide room - 5 friends gathered
    [420, 1.28, 590, 1150],  // Hold wide as "Nobody remembered..."
    [440, 1.62, 790, 1140],  // Push in to Rahul as he speaks ("Probably a reflection")
    [495, 1.66, 805, 1140],  // Hold on Rahul
    [508, 1.78, 930, 1130],  // Quick pan & push to Kabir: "That's impossible. He's facing forward"
    [575, 1.82, 935, 1130],  // Hold on Kabir
    [588, 1.68, 400, 1160],  // Pan across to Nisha: "Nisha went quiet"
    [625, 1.70, 395, 1160],  // Hold on Nisha looking down
    [640, 1.55, 450, 1150],  // Slight pull back
    [685, 1.85, 225, 1130],  // Intense push-in on Meera: "Why does that person look like Arjun?"
    [760, 1.90, 220, 1130],  // Hold on Meera in shock
  ];

  const ch = (i: number) => kf(f, K.map((k) => [k[0], k[i]] as [number, number]), E.soft);
  const s = ch(1);
  const x = ch(2);
  const y = ch(3);
  const rot = kf(f, [[365, 0], [508, -0.6], [588, 0.4], [685, -1.0], [765, -1.2]], E.soft);
  return {s, x, y, rot};
}

export const RoomLoop: React.FC = () => {
  const f = useCurrentFrame();
  const cam = cameraAtLoop(f);
  const sh = cameraShake(f);
  const s = cam.s;
  const x = clamp(cam.x, 540 / s, WORLD_W - 540 / s);
  const y = clamp(cam.y, 960 / s, WORLD_H - 960 / s);
  const light = lightLevel(f);
  const morning = kf(f, [[135, 0.0], [150, 1]]);
  const bgBlur = clamp((s - 1.5) * 2.2, 0, 3.2);

  return (
    <AbsoluteFill style={{background: "#04060b", overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "540px 960px", transform: `translate(${sh.dx}px, ${sh.dy}px) rotate(${cam.rot}deg)`}}>
        <div style={{position: "absolute", left: 0, top: 0, width: WORLD_W, height: WORLD_H, transformOrigin: "0 0", transform: `translate(${540 - x * s}px, ${960 - y * s}px) scale(${s})`, filter: `brightness(${1 + 0.16 * morning})`}}>
          <Img src={staticFile("backgrounds/living_room.jpg")} style={{position: "absolute", inset: 0, width: WORLD_W, height: WORLD_H, filter: `blur(${bgBlur}px)`}} />

          {/* wall tube light */}
          <div style={{position: "absolute", left: TUBE.x - 380, top: TUBE.y - 330, width: 760, height: 660, background: "radial-gradient(ellipse, rgba(255,214,110,0.34) 0%, rgba(255,190,80,0.1) 42%, rgba(255,190,80,0) 72%)", mixBlendMode: "screen", opacity: light * (1 - 0.35 * morning)}} />

          {/* MORNING — daylight through the curtains */}
          <div style={{position: "absolute", left: WINDOW.x - 380, top: WINDOW.y - 330, width: 760, height: 700, background: "radial-gradient(ellipse, rgba(225,238,255,0.62) 0%, rgba(200,225,255,0.22) 42%, rgba(200,225,255,0) 72%)", mixBlendMode: "screen", opacity: 0.85 * morning}} />
          <div style={{position: "absolute", left: 400, top: 1000, width: 700, height: 520, background: "linear-gradient(115deg, rgba(235,244,255,0.34) 0%, rgba(235,244,255,0.0) 70%)", clipPath: "polygon(30% 0%, 80% 0%, 100% 100%, 0% 100%)", mixBlendMode: "screen", opacity: 0.5 * morning}} />

          {/* dust in the light shaft */}
          {DUST.map((d, i) => {
            const px = d.x + Math.sin(f * 0.012 * d.sp * 4 + d.ph) * 22;
            const py = 760 + ((((d.y - 760 - f * d.sp * 0.5) % 620) + 620) % 620);
            return <div key={i} style={{position: "absolute", left: px, top: py, width: d.r, height: d.r, borderRadius: "50%", background: "#fff3d6", opacity: 0.15 + 0.35 * Math.abs(Math.sin(f * 0.04 + d.ph)) * morning, filter: "blur(0.6px)"}} />;
          })}

          {/* the five friends */}
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

          {/* name tags */}
          <NameTag id="arjun" start={150} />
          <NameTag id="rahul" start={185} />
          <NameTag id="meera" start={200} />
          <NameTag id="kabir" start={215} />
          <NameTag id="nisha" start={225} />

          {/* tightened dialogue (14.5s - 25.5s) */}
          <Bubble id="rahul" from={435} to={500} text="Probably a reflection." wide />
          <Bubble id="kabir" from={505} to={580} text="Impossible. He's facing forward." wide color="#ff6a74" />
          <Bubble id="nisha" from={585} to={625} text="…" />
          <Bubble id="meera" from={685} to={760} text="Why does that person look like Arjun?" wide color="#ff6a74" />

          {/* floor */}
          <div style={{position: "absolute", left: 0, top: WORLD_H - 190, width: WORLD_W, height: 190, background: "linear-gradient(to bottom, rgba(4,6,11,0) 0%, rgba(4,6,11,0.92) 62%, #04060b 100%)"}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

