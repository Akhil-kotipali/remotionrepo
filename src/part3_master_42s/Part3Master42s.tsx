import React, {useMemo} from "react";
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from "remotion";
import {FriendRig, RigPose, stancePose, STANCE} from "../part3/rig/FriendRig";
import {FriendStickFigure} from "../part3/stick/FriendStickFigure";
import {FRIEND_DESIGNS, FriendId} from "../part3/stick/friendDesigns";
import {INTER, MONO, MONT} from "../part3/fonts";
import {E, kf, rnd} from "../part3/math";
import {ColorWash, GlitchBurst, Grain, HitFlash, Vignette} from "../part3/fx/Overlays";
import {KabirScene, MeeraScene, NishaScene, PW, PH, RahulScene} from "../part3/scenes";
import {CUES_42S} from "./sfx";
import {buildChunks42s} from "./captions";

// =========================================================================
//  STAGE COORDINATES & CONSTANTS (2D LIVING ROOM)
// =========================================================================
const WORLD_W = 1080;
const WORLD_H = 1935;
const TUBE = {x: 535, y: 811};
const WINDOW = {x: 725, y: 930};
const ORDER: FriendId[] = ["meera", "kabir", "rahul", "nisha", "arjun"];

const STAGE_POS: Record<FriendId, {x: number; feet: number; h: number}> = {
  meera: {x: 215, feet: 1345, h: 470},
  nisha: {x: 395, feet: 1385, h: 490},
  rahul: {x: 800, feet: 1375, h: 490},
  kabir: {x: 940, feet: 1335, h: 470},
  arjun: {x: 610, feet: 1450, h: 540},
  dev: {x: 540, feet: 1400, h: 490},
};

const DUST = Array.from({length: 30}, (_, i) => ({
  x: 560 + rnd(`rx${i}`) * 380,
  y: 760 + rnd(`ry${i}`) * 620,
  r: 1.4 + rnd(`rr${i}`) * 2.4,
  sp: 0.15 + rnd(`rs${i}`) * 0.4,
  ph: rnd(`rp${i}`) * 6.28,
}));

// =========================================================================
//  CHARACTER RIG POSES (ANIMATED FOR 42.0s MASTER TIMING)
// =========================================================================
function masterCharPose(id: FriendId, f: number): RigPose {
  const st = STANCE[id];
  const seed = id.length * 7;
  const breath = Math.sin(f * 0.08 + seed) * 1.5;
  const sway = Math.sin(f * 0.025 + seed) * 1.5;

  let handL = st.handL;
  let handR = st.handR;
  let lean = sway;
  let headTilt = 0;
  let lookX = 0;
  let lookY = 0.05;
  let eyeOpen = 0.95;
  let brow = 0.05;
  let mouth = 0;
  let prop: RigPose["prop"] = id === "kabir" ? "book" : "none";
  let propAmt = id === "kabir" ? 1 : 0;

  // Head shake during "Silence. Nobody had." (810 - 875)
  if (f >= 810 && f < 875 && id !== "arjun") {
    const offset = {rahul: 0, kabir: 6, nisha: 12, meera: 18}[id as "rahul" | "kabir" | "nisha" | "meera"] ?? 0;
    const t = f - 810 - offset;
    if (t >= 0 && t < 40) {
      headTilt = Math.sin(t * 0.5) * 8 * (1 - t / 40);
      brow = 0.45;
      lookY = 0.3;
      eyeOpen = 1.05;
    }
  }

  // Contradiction tension (612 - 720)
  if (f >= 612 && f < 720) {
    if (id === "rahul") {
      lookX = -0.7;
      brow = 0.35;
      mouth = 0.15;
    }
    if (id === "meera") {
      lookX = 0.8;
      brow = 0.4;
    }
    if (id === "kabir") {
      lookX = -0.5;
      headTilt = 6;
    }
    if (id === "nisha") {
      handL = [st.handL[0] + 15, st.handL[1] - 30];
      handR = [st.handR[0] - 15, st.handR[1] - 30];
      brow = 0.5;
    }
  }

  // Arjun asks the core question (729 - 810)
  if (id === "arjun") {
    const k = kf(f, [[729, 0], [745, 1, E.out], [800, 1], [810, 0]]);
    handL = [st.handL[0] - 35 * k, st.handL[1] - 65 * k];
    handR = [st.handR[0] + 35 * k, st.handR[1] - 65 * k];
    lean += 3.5 * k;
    brow = 0.65 * k;
    mouth = 0.35 * k;
    eyeOpen = 1.15;
  }

  return {
    lean,
    headTilt,
    hipX: 0,
    hipY: 0,
    handL,
    handR,
    footL: st.footL,
    footR: st.footR,
    eyeOpen,
    brow,
    mouth,
    lookX,
    lookY,
    blink: f % 90 < 5 ? 1 : 0,
    breath,
    prop,
    propAmt,
    photoSide: 0,
    glow: 0,
  };
}

// =========================================================================
//  SPEECH BUBBLE (ORIGINAL 2D STYLING)
// =========================================================================
const Bubble: React.FC<{
  id: FriendId;
  from: number;
  to: number;
  text: string;
  wide?: boolean;
  color?: string;
}> = ({id, from, to, text, wide, color}) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const s = kf(f, [[from, 0], [from + 8, 1, E.back]]) * kf(f, [[to - 8, 1], [to, 0]]);
  const d = FRIEND_DESIGNS[id];
  const pos = STAGE_POS[id];
  const headTop = pos.feet - 400 * (pos.h / 440);
  const c = color ?? d.lightColor;

  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: headTop - 20,
        transform: `translate(-50%, -100%) scale(${s})`,
        transformOrigin: "50% 100%",
        opacity: s,
        zIndex: 60,
      }}
    >
      {/* Name tab */}
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
        <div style={{width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}`}} />
        <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 22, color: "#fff", letterSpacing: 2}}>
          {d.name.toUpperCase()}
        </span>
      </div>

      <div
        style={{
          position: "relative",
          background: "rgba(8, 12, 22, 0.94)",
          border: `3px solid ${c}`,
          borderRadius: 22,
          padding: wide ? "16px 26px" : "12px 24px",
          maxWidth: wide ? 460 : 380,
          textAlign: "center",
          fontFamily: INTER,
          fontWeight: 700,
          fontSize: wide ? 36 : 40,
          lineHeight: 1.15,
          color: "#fff",
          boxShadow: `0 0 30px ${c}77`,
        }}
      >
        {text}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -14,
            width: 24,
            height: 24,
            background: "rgba(8, 12, 22, 0.94)",
            borderRight: `3px solid ${c}`,
            borderBottom: `3px solid ${c}`,
            transform: "translateX(-50%) rotate(45deg)",
          }}
        />
      </div>
    </div>
  );
};

// =========================================================================
//  2D LIVING ROOM (ORIGINAL GRAPHIC NOVEL STYLE)
// =========================================================================
const LivingRoom2D: React.FC<{f: number}> = ({f}) => {
  // Smooth 2D camera panning & push-in
  const camX = kf(f, [
    [612, 540],
    [660, 540],
    [729, 610, E.out], // Smooth push into Arjun
    [805, 610],
    [840, 540, E.soft], // Pull back for "Silence. Nobody had."
  ]);

  const camY = kf(f, [
    [612, 1100],
    [660, 1100],
    [729, 1220, E.out],
    [805, 1220],
    [840, 1100, E.soft],
  ]);

  const camScale = kf(f, [
    [612, 1.0],
    [660, 1.0],
    [729, 1.36, E.out],
    [805, 1.36],
    [840, 1.04, E.soft],
  ]);

  const morning = 0.8;
  const light = 1.0;

  return (
    <AbsoluteFill style={{background: "#04060b", overflow: "hidden"}}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: WORLD_W,
          height: WORLD_H,
          transformOrigin: "0 0",
          transform: `translate(${540 - camX * camScale}px, ${960 - camY * camScale}px) scale(${camScale})`,
          filter: `brightness(1.12) saturate(0.95)`,
        }}
      >
        {/* Background scaled slightly to crop watermark in corner */}
        <Img
          src={staticFile("backgrounds/living_room.jpg")}
          style={{
            position: "absolute",
            left: -30,
            top: -40,
            width: WORLD_W + 60,
            height: WORLD_H + 80,
          }}
        />

        {/* Wall tube light glow */}
        <div
          style={{
            position: "absolute",
            left: TUBE.x - 380,
            top: TUBE.y - 330,
            width: 760,
            height: 660,
            background:
              "radial-gradient(ellipse, rgba(255,214,110,0.34) 0%, rgba(255,190,80,0.1) 42%, rgba(255,190,80,0) 72%)",
            mixBlendMode: "screen",
          }}
        />

        {/* Morning light from curtains */}
        <div
          style={{
            position: "absolute",
            left: WINDOW.x - 380,
            top: WINDOW.y - 330,
            width: 760,
            height: 700,
            background:
              "radial-gradient(ellipse, rgba(225,238,255,0.62) 0%, rgba(200,225,255,0.22) 42%, rgba(200,225,255,0) 72%)",
            mixBlendMode: "screen",
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 400,
            top: 1000,
            width: 700,
            height: 520,
            background: "linear-gradient(115deg, rgba(235,244,255,0.34) 0%, rgba(235,244,255,0) 70%)",
            clipPath: "polygon(30% 0%, 80% 0%, 100% 100%, 0% 100%)",
            mixBlendMode: "screen",
            opacity: 0.5,
          }}
        />

        {/* Floating dust motes in light beam */}
        {DUST.map((d, i) => {
          const px = d.x + Math.sin(f * 0.012 * d.sp * 4 + d.ph) * 22;
          const py = 760 + ((((d.y - 760 - f * d.sp * 0.5) % 620) + 620) % 620);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: px,
                top: py,
                width: d.r,
                height: d.r,
                borderRadius: "50%",
                background: "#fff3d6",
                opacity: 0.15 + 0.35 * Math.abs(Math.sin(f * 0.04 + d.ph)) * morning,
                filter: "blur(0.6px)",
              }}
            />
          );
        })}

        {/* Five friends with clean floor contact shadows */}
        {ORDER.map((id) => {
          const pos = STAGE_POS[id];
          const k = pos.h / 440;
          const figW = 240 * k;
          const pose = masterCharPose(id, f);

          return (
            <div key={id}>
              {/* Floor contact shadow */}
              <div
                style={{
                  position: "absolute",
                  left: pos.x - 170 * k,
                  top: pos.feet - 24,
                  width: 340 * k,
                  height: 50,
                  background: "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)",
                }}
              />
              {/* Character Rig */}
              <div
                style={{
                  position: "absolute",
                  left: pos.x - figW / 2,
                  top: pos.feet - 416 * k,
                  width: figW,
                  height: pos.h,
                  transform: id === "kabir" ? "scaleY(1.05)" : undefined,
                  transformOrigin: "50% 100%",
                  filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.45)) brightness(1.0)",
                }}
              >
                <FriendRig id={id} pose={pose} width={figW} height={pos.h} rim={0.18 * light} cool={0.2 * morning} jacket={id === "arjun"} />
              </div>
            </div>
          );
        })}

        {/* Speech Bubble: Arjun's pivotal question */}
        <Bubble id="arjun" from={729} to={805} text="Did anyone actually see Dev fall?" wide color="#ff6a74" />

        {/* Floor fade */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: WORLD_H - 190,
            width: WORLD_W,
            height: 190,
            background: "linear-gradient(to bottom, rgba(4,6,11,0) 0%, rgba(4,6,11,0.92) 62%, #04060b 100%)",
          }}
        />
      </div>

      {/* Tension Alert Bar (612 - 680) */}
      {f >= 612 && f < 680 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 210,
            textAlign: "center",
            opacity: kf(f, [[612, 0], [620, 1], [670, 1], [680, 0]]),
            zIndex: 90,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(10, 14, 24, 0.94)",
              border: "3px solid #ef4444",
              borderRadius: 14,
              padding: "10px 28px",
              boxShadow: "0 0 30px rgba(239,68,68,0.8)",
            }}
          >
            <span style={{fontFamily: MONO, fontWeight: 900, fontSize: 26, letterSpacing: 4, color: "#f87171"}}>
              [ CONTRADICTION DETECTED · 4 DIFFERENT STORIES ]
            </span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// =========================================================================
//  THE PHOTOGRAPH CARD (WITH UPFRONT BALCONY CRIME ANCHOR)
// =========================================================================
const PHOTO_CAST: {id: FriendId; x: number; facing: "left" | "right"}[] = [
  {id: "rahul", x: 160, facing: "right"},
  {id: "nisha", x: 320, facing: "right"},
  {id: "arjun", x: 480, facing: "right"},
  {id: "dev", x: 640, facing: "left"},
  {id: "kabir", x: 800, facing: "left"},
];

const PhotoCardClean: React.FC<{f: number}> = ({f}) => {
  const S = 960 / 960;
  const CARD_W = 960;
  const CARD_H = 1050;
  const WIN = {x: 681, y: 52, w: 100, h: 94};

  return (
    <div
      style={{
        position: "relative",
        width: CARD_W,
        height: CARD_H,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.85), 0 0 0 6px #d9d4c7",
        filter: "sepia(0.15) saturate(0.9) contrast(1.05)",
      }}
    >
      <Img
        src={staticFile("backgrounds/exterior.jpg")}
        style={{
          position: "absolute",
          left: -20,
          top: -760 * (CARD_W / 1536) - 20,
          width: CARD_W + 40,
          height: 2752 * (CARD_W / 1536) + 40,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* 2nd floor window figure — SUBTLE at 0:00 to prevent premature spoiler */}
      <div
        style={{
          position: "absolute",
          left: WIN.x,
          top: WIN.y,
          width: WIN.w,
          height: WIN.h,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 35%, rgba(160,205,255,0.2) 0%, rgba(5,10,20,0.95) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: WIN.w / 2 - 60,
            top: 6,
            opacity: 0.35,
            filter: "brightness(0.6) blur(0.5px)",
          }}
        >
          <FriendStickFigure friend="arjun" facing="left" width={120} height={220} glow={false} animate={false} />
        </div>
        {/* Tiny 3px subtle blinking red REC dot */}
        <div
          style={{
            position: "absolute",
            right: 8,
            top: 8,
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 6px #ef4444",
              opacity: f % 12 < 6 ? 0.9 : 0.2,
            }}
          />
        </div>
      </div>

      {/* Upfront Crime Line: Red trajectory dashed line from Dev to Balcony Window (Frames 0 - 140) */}
      {f < 140 && (
        <svg
          width={CARD_W}
          height={CARD_H}
          viewBox={`0 0 ${CARD_W} ${CARD_H}`}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 35,
            opacity: kf(f, [[0, 1], [130, 1], [140, 0]]),
          }}
        >
          {/* Animated Neon Dashed Trajectory Line from Dev to Balcony Window */}
          <line
            x1={640 * S}
            y1={700}
            x2={WIN.x + WIN.w / 2}
            y2={WIN.y + WIN.h + 10}
            stroke="#ef4444"
            strokeWidth={4.5}
            strokeDasharray="12 8"
            strokeDashoffset={-f * 5}
            strokeLinecap="round"
            style={{filter: "drop-shadow(0 0 10px rgba(239, 68, 68, 0.95))"}}
          />
          {/* Fall Impact Box on Window with pulsing glow */}
          <rect
            x={WIN.x - 6}
            y={WIN.y - 6}
            width={WIN.w + 12}
            height={WIN.h + 12}
            fill="rgba(239, 68, 68, 0.15)"
            stroke="#ef4444"
            strokeWidth={3.5}
            rx={6}
            style={{filter: "drop-shadow(0 0 12px rgba(239, 68, 68, 0.9))"}}
          />
          <text
            x={WIN.x + WIN.w / 2}
            y={WIN.y - 12}
            textAnchor="middle"
            fill="#ff4d5a"
            fontFamily={MONO}
            fontWeight="900"
            fontSize="13"
            letterSpacing="1"
            style={{filter: "drop-shadow(0 0 6px #000)"}}
          >
            BALCONY FALL POINT
          </text>
        </svg>
      )}

      {/* The five friends in photo */}
      {PHOTO_CAST.map((c) => {
        const H = 360 * S;
        const top = (1030 - 416 * (360 / 440)) * S;
        const figW = (240 * H) / 440;
        return (
          <div
            key={c.id}
            style={{
              position: "absolute",
              left: c.x * S - figW / 2,
              top,
              width: figW,
              height: H,
              filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.6))",
            }}
          >
            <FriendStickFigure friend={c.id} facing={c.facing} width={figW} height={H} glow={false} animate={false} />
          </div>
        );
      })}

      {/* Face identification brackets + Meera [CAMERA] tag */}
      {f < 140 && (
        <>
          {PHOTO_CAST.map((c, idx) => {
            const bx = c.x * S;
            const by = 680;
            const o = kf(f, [[5 + idx * 4, 0], [12 + idx * 4, 1]]);
            const isDev = c.id === "dev";
            const col = isDev ? "#ef4444" : "#38bdf8";

            return (
              <div
                key={c.id}
                style={{
                  position: "absolute",
                  left: bx - 42,
                  top: by,
                  width: 84,
                  height: 94,
                  border: `2px solid ${col}`,
                  borderRadius: 6,
                  opacity: o,
                  boxShadow: isDev ? "0 0 16px rgba(239,68,68,0.9)" : `0 0 10px ${col}88`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: -22,
                    transform: "translateX(-50%)",
                    background: col,
                    color: "#000",
                    fontFamily: MONO,
                    fontWeight: 900,
                    fontSize: 12,
                    padding: "2px 6px",
                    borderRadius: 3,
                    letterSpacing: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {isDev ? "DEV [FELL]" : c.id.toUpperCase()}
                </div>
              </div>
            );
          })}

          {/* Camera tag: Meera was taking the photograph */}
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 40,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(6,10,18,0.85)",
              border: "2px solid #db2777",
              borderRadius: 999,
              padding: "6px 14px",
              boxShadow: "0 0 14px rgba(219,39,119,0.7)",
            }}
          >
            <div style={{width: 8, height: 8, borderRadius: "50%", background: "#db2777"}} />
            <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 13, color: "#fff", letterSpacing: 1}}>
              PHOTO TAKEN BY: MEERA
            </span>
          </div>
        </>
      )}
    </div>
  );
};

// =========================================================================
//  THE 4 CONFLICTING ALIBIS (WITH HIGH CONTRAST NUMBERED BARS)
// =========================================================================
type MemoryId = "rahul" | "meera" | "kabir" | "nisha";

const MEMORY_CONFIG: Record<
  MemoryId,
  {
    start: number;
    end: number;
    color: string;
    label: string;
    sub: string;
    scene: React.FC<{t: number}>;
  }
> = {
  rahul: {
    start: 249,
    end: 336,
    color: "#E0814F",
    label: "ALIBI 1 OF 4 · RAHUL",
    sub: "DEV LEFT ALONE",
    scene: RahulScene,
  },
  meera: {
    start: 336,
    end: 423,
    color: "#C85C86",
    label: "ALIBI 2 OF 4 · MEERA",
    sub: "ARJUN FOLLOWED HIM",
    scene: MeeraScene,
  },
  kabir: {
    start: 423,
    end: 504,
    color: "#46B5BD",
    label: "ALIBI 3 OF 4 · KABIR",
    sub: "HEARD TWO PEOPLE FIGHTING",
    scene: KabirScene,
  },
  nisha: {
    start: 504,
    end: 612,
    color: "#EAC24B",
    label: "ALIBI 4 OF 4 · NISHA",
    sub: "“DON'T TOUCH ME!”",
    scene: NishaScene,
  },
};

const MEM_ORDER: MemoryId[] = ["rahul", "meera", "kabir", "nisha"];

const MemoryManager2D: React.FC<{f: number}> = ({f}) => {
  let activeId: MemoryId | null = null;
  if (f >= 249 && f < 336) activeId = "rahul";
  else if (f >= 336 && f < 423) activeId = "meera";
  else if (f >= 423 && f < 504) activeId = "kabir";
  else if (f >= 504 && f < 612) activeId = "nisha";

  const showDock = f >= 138 && f < 612;
  const dockO = kf(f, [[138, 0], [150, 1], [602, 1], [612, 0]]);

  return (
    <div style={{position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50}}>
      {/* Top 4 Alibi Tabs */}
      {showDock && (
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            top: 140,
            display: "flex",
            gap: 12,
            opacity: dockO,
            zIndex: 60,
          }}
        >
          {MEM_ORDER.map((id) => {
            const cfg = MEMORY_CONFIG[id];
            const isActive = activeId === id;
            return (
              <div
                key={id}
                style={{
                  flex: 1,
                  background: isActive ? "rgba(10, 16, 28, 0.95)" : "rgba(6, 10, 16, 0.75)",
                  border: `3px solid ${isActive ? cfg.color : "rgba(255,255,255,0.2)"}`,
                  borderRadius: 12,
                  padding: "8px 6px",
                  textAlign: "center",
                  boxShadow: isActive ? `0 0 20px ${cfg.color}99` : "none",
                  transform: isActive ? "scale(1.05)" : "scale(1.0)",
                  transition: "transform 0.2s ease",
                }}
              >
                <div style={{fontFamily: MONO, fontWeight: 900, fontSize: 16, color: cfg.color, letterSpacing: 1}}>
                  {cfg.label.split("·")[1]?.trim() ?? cfg.label}
                </div>
                <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 13, color: "#fff", marginTop: 2}}>
                  {cfg.sub}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Expanded Memory Card */}
      {activeId && (
        <div
          style={{
            position: "absolute",
            left: (1080 - PW) / 2,
            top: 290,
            width: PW,
            height: PH,
            borderRadius: 32,
            overflow: "hidden",
            boxShadow: `0 0 0 6px ${MEMORY_CONFIG[activeId].color}, 0 25px 80px rgba(0,0,0,0.85), 0 0 50px ${MEMORY_CONFIG[activeId].color}66`,
            background: "#05080d",
          }}
        >
          {(() => {
            const cfg = MEMORY_CONFIG[activeId];
            const Scene = cfg.scene;
            const t = f - cfg.start;
            return <Scene t={t} />;
          })()}
        </div>
      )}
    </div>
  );
};

// =========================================================================
//  HALLWAY SECRET PHONE RECORDING (ACT 4: 876 - 1176)
// =========================================================================
const HallwayRec2D: React.FC<{f: number}> = ({f}) => {
  const isCrack = f >= 1059;
  const zoom = kf(f, [
    [876, 1.0],
    [983, 1.15, E.soft],
    [1058, 1.25],
    [1059, 1.6, E.back],
    [1176, 1.75, E.soft],
  ]);

  const phoneX = 640;
  const phoneY = 1120;
  const recBlink = f % 16 < 8;

  return (
    <AbsoluteFill style={{background: "#03060d", overflow: "hidden"}}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${phoneX}px ${phoneY}px`,
          transform: `scale(${zoom})`,
        }}
      >
        <Img
          src={staticFile("backgrounds/hallway.jpg")}
          style={{
            position: "absolute",
            left: -30,
            top: -40,
            width: 1080 + 60,
            height: 1935 + 80,
            filter: "brightness(0.85) saturate(0.9)",
          }}
        />

        {/* Light beam shooting from Dev's phone across hallway toward balcony */}
        <div
          style={{
            position: "absolute",
            left: 200,
            top: 960,
            width: 480,
            height: 220,
            background:
              "linear-gradient(90deg, rgba(140,200,255,0) 0%, rgba(140,200,255,0.25) 80%, rgba(140,200,255,0.6) 100%)",
            clipPath: "polygon(0% 30%, 100% 45%, 100% 55%, 0% 70%)",
            mixBlendMode: "screen",
          }}
        />

        {/* Dev crouching by the baseboard setting down the phone */}
        <div style={{position: "absolute", left: 520, top: 880}}>
          <FriendRig
            id="dev"
            pose={{
              ...stancePose("dev"),
              lean: 15,
              hipY: 80,
              handR: [180, 290],
              handL: [100, 240],
              lookY: 0.5,
              glow: 0.8,
            }}
            width={240}
            height={440}
            rim={0.3}
            cool={0.2}
          />
        </div>

        {/* The phone sitting upright against baseboard */}
        <div style={{position: "absolute", left: phoneX - 25, top: phoneY - 60}}>
          <div
            style={{
              width: 50,
              height: 95,
              background: "#0b0f16",
              borderRadius: 8,
              border: "3px solid rgba(160,210,255,0.9)",
              boxShadow: "0 0 25px rgba(160,210,255,0.8)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{position: "absolute", inset: 4, background: "rgba(50,110,190,0.4)"}} />
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 15,
                transform: "translateX(-50%)",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: recBlink ? "#ff2e4d" : "#550a14",
                boxShadow: recBlink ? "0 0 10px #ff2e4d" : "none",
              }}
            />
          </div>
        </div>

        {/* Shadow silhouettes of the friends approaching down hallway */}
        <div style={{position: "absolute", left: 80, top: 780, opacity: 0.7, filter: "brightness(0) blur(4px)"}}>
          <div style={{display: "flex", gap: 30}}>
            <FriendStickFigure friend="rahul" facing="right" width={180} height={340} animate={false} />
            <FriendStickFigure friend="arjun" facing="right" width={190} height={360} animate={false} />
            <FriendStickFigure friend="kabir" facing="right" width={180} height={340} animate={false} />
          </div>
        </div>
      </div>

      {/* Screen Crack Overlay (1059 - 1176) */}
      {isCrack && (
        <svg
          width={1080}
          height={1920}
          style={{position: "absolute", inset: 0, pointerEvents: "none", zIndex: 85}}
        >
          <line x1={540} y1={960} x2={120} y2={420} stroke="#ffffff" strokeWidth={4} strokeLinecap="round" opacity={0.9} />
          <line x1={540} y1={960} x2={920} y2={310} stroke="#ffffff" strokeWidth={3} strokeLinecap="round" opacity={0.85} />
          <line x1={540} y1={960} x2={340} y2={1520} stroke="#ffffff" strokeWidth={4.5} strokeLinecap="round" opacity={0.9} />
          <line x1={540} y1={960} x2={860} y2={1480} stroke="#ffffff" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
          <circle cx={540} cy={960} r={40} fill="none" stroke="#ffffff" strokeWidth={4} opacity={0.9} />
          <circle cx={540} cy={960} r={90} fill="none" stroke="#ffffff" strokeWidth={2.5} opacity={0.7} />
        </svg>
      )}

      {/* Recording HUD in corner */}
      <div
        style={{
          position: "absolute",
          top: 150,
          right: 60,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(6,10,18,0.85)",
          border: "2px solid #ef4444",
          borderRadius: 999,
          padding: "8px 24px",
          boxShadow: "0 0 20px rgba(239,68,68,0.6)",
          zIndex: 80,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: recBlink ? "#ef4444" : "#450a0a",
            boxShadow: recBlink ? "0 0 12px #ef4444" : "none",
          }}
        />
        <span style={{fontFamily: MONO, fontWeight: 900, fontSize: 24, color: "#fff", letterSpacing: 2}}>
          ● REC 02:16:48
        </span>
      </div>

      {/* Revelation Badge on Frame 1059 */}
      {isCrack && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 250,
            textAlign: "center",
            zIndex: 90,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(8,12,22,0.96)",
              border: "3px solid #ffcc00",
              borderRadius: 14,
              padding: "12px 36px",
              boxShadow: "0 0 40px rgba(255,204,0,0.7)",
            }}
          >
            <div style={{fontFamily: MONO, fontWeight: 900, fontSize: 32, letterSpacing: 4, color: "#ffcc00"}}>
              RECORDING THE BALCONY
            </div>
            <div style={{fontFamily: MONT, fontWeight: 900, fontSize: 44, color: "#ffffff", marginTop: 4}}>
              WHERE DEV FELL
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// =========================================================================
//  EXTERIOR HOUSE & SEAMLESS RE-WATCH LOOP (ACT 5: 1176 - 1260)
// =========================================================================
const ExteriorAct2D: React.FC<{f: number}> = ({f}) => {
  const t = f - 1176;
  const z = kf(t, [[0, 1.0], [54, 2.7, E.soft]]);
  const fx = 681 + 50;
  const fy = 520;
  const tx = (540 - fx) * ((z - 1) / 1.7);
  const ty = (960 - fy) * ((z - 1) / 1.7);

  const reticleO = kf(t, [[15, 0], [25, 1]]);

  return (
    <AbsoluteFill style={{background: "#02040a", overflow: "hidden"}}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1935,
          transformOrigin: `${fx}px ${fy}px`,
          transform: `translate(${tx}px, ${ty}px) scale(${z})`,
        }}
      >
        <Img
          src={staticFile("backgrounds/exterior.jpg")}
          style={{
            position: "absolute",
            left: -30,
            top: -40,
            width: 1080 + 60,
            height: 1935 + 80,
            filter: "brightness(0.78) saturate(0.85)",
          }}
        />

        {/* Streetlamp glow */}
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 780,
            width: 360,
            height: 360,
            background: "radial-gradient(circle, rgba(255,200,120,0.4), rgba(255,200,120,0) 70%)",
            mixBlendMode: "screen",
          }}
        />

        {/* Upstairs window figure holding the camera */}
        <div
          style={{
            position: "absolute",
            left: 681 - 20,
            top: 480,
            width: 140,
            height: 180,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 50% 50%, rgba(180,220,255,0.4) 0%, rgba(2,6,14,0.9) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 10,
              top: 10,
              filter: "brightness(1.6) drop-shadow(0 0 8px rgba(180,225,255,0.9))",
            }}
          >
            <FriendStickFigure friend="arjun" facing="left" width={120} height={220} animate={false} />
          </div>
          {/* Glowing camera lens / red light */}
          <div
            style={{
              position: "absolute",
              left: 35,
              top: 60,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 12px #ef4444",
            }}
          />
        </div>
      </div>

      {/* Target Focus Reticle */}
      <div
        style={{
          position: "absolute",
          left: 540 - 150,
          top: 960 - 150,
          width: 300,
          height: 300,
          border: "4px solid #ef4444",
          borderRadius: 16,
          boxShadow: "0 0 40px rgba(239,68,68,0.9), inset 0 0 20px rgba(239,68,68,0.5)",
          opacity: reticleO,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -36,
            transform: "translateX(-50%)",
            background: "#ef4444",
            color: "#ffffff",
            fontFamily: MONO,
            fontWeight: 900,
            fontSize: 20,
            padding: "4px 16px",
            borderRadius: 4,
            letterSpacing: 2,
            whiteSpace: "nowrap",
          }}
        >
          [ 06: SUSPECT IN WINDOW ]
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 260,
          textAlign: "center",
          opacity: reticleO,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(8,12,22,0.94)",
            border: "3px solid #ef4444",
            borderRadius: 12,
            padding: "10px 32px",
            boxShadow: "0 0 35px rgba(239,68,68,0.7)",
          }}
        >
          <div style={{fontFamily: MONT, fontWeight: 900, fontSize: 44, color: "#ffffff", letterSpacing: 3}}>
            LOOK AT THE WINDOW AGAIN. BECAUSE...
          </div>
          {t >= 42 && (
            <div
              style={{
                fontFamily: MONO,
                fontWeight: 900,
                fontSize: 22,
                color: "#ffcc00",
                letterSpacing: 2,
                marginTop: 6,
                textTransform: "uppercase",
              }}
            >
              ▲ REWATCH: WHO IS WEARING GREEN?
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
//  MAIN COMPOSITION: PART 3 MASTER (42.0s / 1260 FRAMES)
// =========================================================================
export const Part3Master42s: React.FC = () => {
  const f = useCurrentFrame();
  const chunks = useMemo(() => buildChunks42s(30), []);

  return (
    <AbsoluteFill style={{background: "#000"}}>
      {/* ----------------------------------------------------------------- */}
      {/* SCENE LAYERS (TIME-SLICED ACROSS 1260 FRAMES)                    */}
      {/* ----------------------------------------------------------------- */}

      {/* ACT 1: PHOTOGRAPH & ALIBIS (0 - 612 FRAMES) */}
      {f < 612 && (
        <AbsoluteFill style={{background: "#05080f"}}>
          {/* Centered Photograph (0 - 249) */}
          {f < 249 && (
            <div
              style={{
                position: "absolute",
                left: (1080 - 960) / 2,
                top: 360,
                transform: `scale(${kf(f, [[0, 0.98], [120, 1.04, E.soft], [249, 0.9]])})`,
                opacity: kf(f, [[0, 1], [230, 1], [249, 0]]),
              }}
            >
              <PhotoCardClean f={f} />
            </div>
          )}

          {/* 4 Conflicting Memories (138 - 612) */}
          <MemoryManager2D f={f} />
        </AbsoluteFill>
      )}

      {/* ACT 3: LIVING ROOM & ARJUN'S QUESTION (612 - 876 FRAMES) */}
      {f >= 612 && f < 876 && <LivingRoom2D f={f} />}

      {/* ACT 4: HALLWAY SECRET PHONE RECORDING (876 - 1176 FRAMES) */}
      {f >= 876 && f < 1176 && <HallwayRec2D f={f} />}

      {/* ACT 5: EXTERIOR WINDOW WHIP ZOOM & REWATCH LOOP (1176 - 1260 FRAMES) */}
      {f >= 1176 && f <= 1260 && <ExteriorAct2D f={f} />}

      {/* ----------------------------------------------------------------- */}
      {/* POLICE CLASSIFIED STAMP (0 - 14 FRAMES)                          */}
      {/* ----------------------------------------------------------------- */}
      {f < 15 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "40%",
            transform: `translateY(-50%) scale(${kf(f, [[0, 1.35], [5, 1.0, E.back]])}) rotate(-3deg)`,
            textAlign: "center",
            opacity: kf(f, [[0, 1], [9, 1], [14, 0]]),
            zIndex: 120,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "inline-block",
              border: "6px solid #ef4444",
              background: "rgba(8, 12, 22, 0.94)",
              padding: "20px 48px",
              borderRadius: 18,
              boxShadow: "0 0 50px rgba(239,68,68,0.9), inset 0 0 25px rgba(239,68,68,0.5)",
            }}
          >
            <div style={{fontFamily: MONO, fontWeight: 900, fontSize: 32, letterSpacing: 8, color: "#f87171"}}>
              POLICE CASE FILE #03 · HOMICIDE
            </div>
            <div style={{fontFamily: MONT, fontWeight: 900, fontSize: 62, letterSpacing: 3, color: "#ffffff", marginTop: 8}}>
              CONTRADICTORY ALIBIS
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* UPFRONT CRIME ANCHOR BANNER (0 - 138 FRAMES)                     */}
      {/* ----------------------------------------------------------------- */}
      {f < 138 && (
        <div
          style={{
            position: "absolute",
            top: 140,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: kf(f, [[0, 1], [125, 1], [137, 0]]),
            zIndex: 110,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(220, 38, 38, 0.96)",
              border: "2px solid #fecaca",
              borderRadius: 999,
              padding: "8px 28px",
              boxShadow: "0 4px 30px rgba(220,38,38,0.85)",
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 0 10px #ffffff",
                transform: `scale(${0.9 + 0.3 * Math.sin(f * 0.6)})`,
              }}
            />
            <span style={{color: "#ffffff", fontFamily: MONO, fontWeight: 900, fontSize: 24, letterSpacing: 5, textTransform: "uppercase"}}>
              CASE FILE #03 · HOMICIDE AUDIT
            </span>
          </div>

          <div
            style={{
              fontFamily: MONT,
              fontWeight: 900,
              fontSize: 48,
              color: "#ffffff",
              letterSpacing: 2,
              marginTop: 14,
              textShadow: "0 4px 18px rgba(0,0,0,0.9)",
            }}
          >
            FOUR ALIBIS · ONE IS LYING
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* CINEMATIC OVERLAYS & GRADING                                      */}
      {/* ----------------------------------------------------------------- */}
      <ColorWash />
      <Vignette />
      <Grain opacity={0.17} />
      <HitFlash />

      {/* Glitch Bursts on key mid-video impact frames (excluding frame 0 for smooth loop) */}
      <GlitchBurst at={249} len={6} power={0.8} />
      <GlitchBurst at={504} len={10} power={1.8} />
      <GlitchBurst at={612} len={6} power={1.0} />
      <GlitchBurst at={1059} len={10} power={1.9} />
      <GlitchBurst at={1176} len={8} power={1.4} />

      {/* ----------------------------------------------------------------- */}
      {/* SEAMLESS CAMERA SHUTTER & FLASH LOOP BRIDGE (1248 -> 0 -> 12)     */}
      {/* ----------------------------------------------------------------- */}
      {/* End Flash: ramps up to 100% pure white on Frame 1259 */}
      {f >= 1248 && (
        <AbsoluteFill
          style={{
            background: "#ffffff",
            opacity: kf(f, [[1248, 0], [1256, 0.5, E.out], [1259, 1.0]]),
            zIndex: 190,
            pointerEvents: "none",
          }}
        />
      )}
      {/* Start Flash: begins at 100% pure white on Frame 0 and dissolves away */}
      {f <= 12 && (
        <AbsoluteFill
          style={{
            background: "#ffffff",
            opacity: kf(f, [[0, 1.0], [2, 0.95], [12, 0, E.out]]),
            zIndex: 190,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ----------------------------------------------------------------- */}
      {/* KINETIC AUDIO-SYNCED SUBTITLES (FIXED SPACING & OPTIMAL Y)        */}
      {/* ----------------------------------------------------------------- */}
      {chunks.map((chk, idx) => {
        if (f < chk.start || f > chk.end) return null;

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: 1260, // Above bottom overlay safe zone
              textAlign: "center",
              zIndex: 130,
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
                boxShadow: "0 10px 40px rgba(0,0,0,0.85)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                  rowGap: "8px",
                  columnGap: "18px", // FIXED: Generous spacing ensures zero word collision
                  fontFamily: INTER,
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
                  const activeColor = isRed ? "#FF4D5A" : isYellow ? "#FFE14A" : "#FFFFFF";

                  return (
                    <span
                      key={wi}
                      style={{
                        margin: "0 3px",
                        color: isActive ? activeColor : "#FFFFFF",
                        textShadow: isActive
                          ? `0 0 20px ${activeColor}bb, 0 2px 8px rgba(0,0,0,1)`
                          : "0 2px 8px rgba(0,0,0,1)",
                        transform: isActive ? "scale(1.08)" : "scale(1.0)",
                        display: "inline-block",
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

      {/* ----------------------------------------------------------------- */}
      {/* AUDIO TRACK: VOICEOVER + CONTINUOUS DARK DRONE + SPATIAL SFX      */}
      {/* ----------------------------------------------------------------- */}
      {/* 1. Master Voiceover */}
      <Audio src={staticFile("audio/voiceover_part3_42s.wav")} volume={1.0} />

      {/* 2. Continuous Eerie Dark Drone to Eliminate Dead Air */}
      <Audio src={staticFile("audio/sfx/drone.wav")} volume={0.32} />

      {/* 3. Subtle Room Ambience with silence cut during the tension pause */}
      <Sequence from={0} durationInFrames={810}>
        <Audio src={staticFile("audio/sfx/morning_ambience.wav")} volume={0.18} />
      </Sequence>
      <Sequence from={875} durationInFrames={385}>
        <Audio src={staticFile("audio/sfx/morning_ambience.wav")} volume={0.18} />
      </Sequence>

      {/* 4. Spatial SFX Cues */}
      {CUES_42S.map(([fr, name, vol, rate], i) => (
        <Sequence key={`c${i}`} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol} playbackRate={rate ?? 1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
