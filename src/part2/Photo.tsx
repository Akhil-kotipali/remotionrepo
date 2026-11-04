import React from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from "remotion";
import {FriendStickFigure} from "./stick/FriendStickFigure";
import {FRIEND_DESIGNS, FriendId} from "./stick/friendDesigns";
import {FriendRig, RigPose, stancePose} from "./rig/FriendRig";
import {INTER, MARKER, MONO} from "./fonts";
import {E, clamp, kf, noise, pulse, rnd} from "./math";
import {PHOTO_WINDOWS} from "./config";

// ----------------------------------------------------------------------------
//  THE PHOTOGRAPH — same crop & cast as the end of Part 1 (+ the glass figure)
// ----------------------------------------------------------------------------
export const CARD_W = 960;
export const CARD_H = 1050;
const FIG_H = 360;
const K = FIG_H / 440;
const FEET_Y = 1030;
const FIG_TOP = FEET_Y - 416 * K;
export const HEAD_Y = FIG_TOP + 62 * K;
export const PHOTO_CAST: {id: FriendId; x: number; facing: "left" | "right"}[] = [
  {id: "rahul", x: 160, facing: "right"},
  {id: "nisha", x: 320, facing: "right"},
  {id: "arjun", x: 480, facing: "right"},
  {id: "dev", x: 640, facing: "left"},
  {id: "kabir", x: 800, facing: "left"},
];
/** the broken upper-floor window (glass) in card coordinates */
export const WIN = {x: 681, y: 52, w: 100, h: 94};
export const WIN_C = {x: WIN.x + WIN.w / 2, y: WIN.y + WIN.h / 2};

/** Arjun in the photograph / in the glass — identical pose (that's the clue) */
export const ARJUN_PHOTO_POSE: RigPose = {...stancePose("arjun"), lean: 3, headTilt: -4, eyeOpen: 1.1, brow: 0.2, lookX: -0.1};

const PHOTO_FRIEND_TAGS: Record<FriendId, {name: string; color: string; lightColor: string; dead?: boolean}> = {
  rahul: {name: "RAHUL", color: "#22c55e", lightColor: "#4ade80"},
  nisha: {name: "NISHA", color: "#f59e0b", lightColor: "#fbbf24"},
  arjun: {name: "ARJUN", color: "#0284c7", lightColor: "#38bdf8"},
  dev: {name: "DEV", color: "#dc2626", lightColor: "#f87171", dead: true},
  kabir: {name: "KABIR", color: "#0891b2", lightColor: "#22d3ee"},
  meera: {name: "MEERA", color: "#db2777", lightColor: "#f472b6"},
};

export const PhotoFront: React.FC<{
  f: number;
  sixth?: number; // opacity of the figure in the glass
  sixthReveal?: number; // 0..1 top-to-bottom reveal
  gaze?: number;
  hiDev?: number; // red highlight on Dev
  shimmer?: number;
  showTags?: boolean; // whether floating character name tags are visible
}> = ({f, sixth = 0, sixthReveal = 1, gaze = 1, hiDev = 0, shimmer = 0, showTags = true}) => {
  const flick = 0.82 + 0.18 * noise(f * 0.6);
  const ks = 0.5;
  return (
    <div style={{position: "relative", width: CARD_W, height: CARD_H, overflow: "hidden", filter: "sepia(0.2) saturate(0.82) contrast(1.05)"}}>
      <Img src={staticFile("backgrounds/exterior.jpg")} style={{position: "absolute", left: 0, top: -760 * (CARD_W / 1536), width: CARD_W, height: 2752 * (CARD_W / 1536)}} />
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)"}} />

      {/* THE GLASS FIGURE — Naturally discernible in 2nd-floor window even when unzoomed/paused! */}
      <div
        style={{
          position: "absolute",
          left: WIN.x,
          top: WIN.y,
          width: WIN.w,
          height: WIN.h,
          overflow: "hidden",
          opacity: sixth,
          borderRadius: 2,
        }}
      >
        {/* Soft eerie interior moonlight ambience to define the window interior */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 35%, rgba(160,205,255,0.34) 0%, rgba(35,65,105,0.45) 50%, rgba(5,10,20,0.85) 100%)",
          }}
        />

        {/* Arjun's mirrored silhouette with eerie pale rim lighting and distinct jacket/head outline */}
        {/* Dynamic pose: In opening close-up (00:00 - 00:01), window figure holds a video camera with blinking REC light! */}
        {(() => {
          const isOpeningClue = f < 40;
          const pose: RigPose = {
            ...ARJUN_PHOTO_POSE,
            prop: isOpeningClue ? "camera" : "none",
            propAmt: isOpeningClue ? 1.0 : 0,
            lookX: isOpeningClue ? (f < 18 ? 0.8 : -0.05) : -0.1,
            lookY: isOpeningClue ? 0.2 : 0,
          };
          return (
            <div
              style={{
                position: "absolute",
                left: WIN.w / 2 - (240 * ks) / 2,
                top: 4,
                filter: "saturate(0.55) brightness(1.8) contrast(1.2) drop-shadow(0 0 6px rgba(180,225,255,0.92)) hue-rotate(8deg) blur(0.2px)",
                opacity: 0.94 * flick,
                clipPath: `inset(0 0 ${(1 - sixthReveal) * 100}% 0)`,
              }}
            >
              <FriendRig id="arjun" pose={pose} width={240 * ks} height={440 * ks} jacket mirror rim={0.4} cool={0.3} shadow={false} />
            </div>
          );
        })()}

        {/* Clue indicator: tiny blinking red recording LED light on the camera in the window */}
        {f < 40 && (
          <div style={{position: "absolute", left: WIN.w / 2 + 10, top: 44, display: "flex", alignItems: "center", gap: 3, pointerEvents: "none", zIndex: 12}}>
            <div style={{width: 5, height: 5, borderRadius: "50%", background: "#ff3b30", boxShadow: "0 0 8px #ff3b30", opacity: (f % 10 < 6) ? 1 : 0.25}} />
            <span style={{fontFamily: MONO, fontWeight: 900, fontSize: 8, color: "#ff3b30", letterSpacing: 1, textShadow: "0 0 4px #ff3b30"}}>REC</span>
          </div>
        )}

        {/* Eerie pale reflective eyes piercing through the window pane */}
        <div
          style={{
            position: "absolute",
            left: WIN.w / 2 - 8,
            top: 25,
            width: 16,
            height: 6,
            display: "flex",
            justifyContent: "space-between",
            pointerEvents: "none",
            opacity: 0.95 * flick,
          }}
        >
          <div style={{width: 3.5, height: 3.5, borderRadius: "50%", background: "#f0f9ff", boxShadow: "0 0 6px #7dd3fc, 0 0 12px #38bdf8"}} />
          <div style={{width: 3.5, height: 3.5, borderRadius: "50%", background: "#f0f9ff", boxShadow: "0 0 6px #7dd3fc, 0 0 12px #38bdf8"}} />
        </div>

        {/* physical glass: diagonal light streaks, cold tint, specular sheen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(125deg, rgba(255,255,255,0.30) 0%, rgba(180,220,255,0.18) 25%, transparent 45%, rgba(255,255,255,0.22) 65%, transparent 85%)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `rgba(120,180,255,${0.12 + shimmer * 0.25 * Math.abs(Math.sin(f * 0.5))})`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
        {/* Subtle architectural window pane inset shadow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: "inset 0 0 8px rgba(0,0,0,0.7), inset 0 0 2px rgba(180,220,255,0.35)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Floating character names above each friend in the photograph */}
      {showTags &&
        PHOTO_CAST.map((c, i) => {
          const tag = PHOTO_FRIEND_TAGS[c.id];
          const isDev = c.id === "dev";
          const isHighlighted = isDev && hiDev > 0;
          const floatY = Math.sin(f * 0.08 + i * 1.3) * 3;
          return (
            <div
              key={`tag-${c.id}`}
              style={{
                position: "absolute",
                left: c.x,
                top: FIG_TOP - 44,
                transform: `translate(-50%, 0) translateY(${floatY}px) scale(${isHighlighted ? 1.15 : 1})`,
                transformOrigin: "50% 100%",
                zIndex: 35,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: isHighlighted ? "rgba(40, 10, 15, 0.95)" : "rgba(8, 12, 22, 0.88)",
                  border: `2px solid ${isHighlighted ? "#ff4d5a" : tag.lightColor}`,
                  borderRadius: 999,
                  padding: "4px 12px",
                  boxShadow: `0 0 ${isHighlighted ? 22 : 12}px ${isHighlighted ? "#ff4d5a" : tag.color}88, inset 0 0 6px ${tag.color}33`,
                  backdropFilter: "blur(6px)",
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: isHighlighted ? "#ff4d5a" : tag.lightColor,
                    boxShadow: `0 0 8px ${isHighlighted ? "#ff4d5a" : tag.lightColor}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: MONO,
                    fontWeight: 800,
                    fontSize: 18,
                    color: "#ffffff",
                    letterSpacing: 2.5,
                    textShadow: `0 0 8px ${tag.lightColor}`,
                  }}
                >
                  {isDev ? "DEV 💀" : tag.name}
                </span>
              </div>
            </div>
          );
        })}

      {/* the five friends */}
      {PHOTO_CAST.map((c, i) => {
        const dir = Math.sign(480 - c.x);
        const isA = c.id === "arjun";
        const idle = noise(f * 0.03, i) * 0.4;
        return (
          <div
            key={c.id}
            style={{
              position: "absolute",
              left: c.x - (240 * K) / 2,
              top: FIG_TOP,
              width: 240 * K,
              height: 440 * K,
              transform: `rotate(${idle}deg)`,
              transformOrigin: "50% 100%",
              filter: `brightness(0.78) saturate(0.85) ${c.id === "dev" && hiDev > 0 ? `drop-shadow(0 0 ${22 * hiDev}px #ff4d5a)` : ""}`,
            }}
          >
            {isA ? (
              <FriendRig id="arjun" pose={ARJUN_PHOTO_POSE} width={240 * K} height={440 * K} jacket rim={0} cool={0} shadow={false} />
            ) : (
              <FriendStickFigure
                friend={c.id}
                facing={c.facing}
                width={240 * K}
                height={440 * K}
                glow={false}
                animate={false}
                showEyes={gaze > 0.01}
                eyeOpacity={gaze}
                eyeShift={dir * 3.4}
                eyeWide={1}
              />
            )}
          </div>
        );
      })}
      <div style={{position: "absolute", right: 36, bottom: 30, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: "#ff9a3c", textShadow: "0 0 10px rgba(255,150,60,0.8)", opacity: 0.9}}>01:52 AM</div>
    </div>
  );
};

// ----------------------------------------------------------------------------
//  BACK OF THE PHOTOGRAPH + marker handwriting
// ----------------------------------------------------------------------------
const LINE1 = "IF WE FORGET,";
const LINE2 = "WATCH THE VIDEO.";
const W1 = {from: 1354, to: 1390};
const W2 = {from: 1392, to: 1428};

const Letters: React.FC<{text: string; f: number; from: number; to: number; size: number}> = ({text, f, from, to, size}) => {
  const n = text.length;
  return (
    <div style={{display: "flex", justifyContent: "center", fontFamily: MARKER, fontSize: size, lineHeight: 1.1, color: "#16224a", textShadow: "0 0 3px rgba(22,34,74,0.55), 1px 2px 0 rgba(22,34,74,0.25)", whiteSpace: "pre"}}>
      {text.split("").map((c, i) => {
        const t0 = from + ((to - from) * i) / n;
        const p = clamp((f - t0) / 4, 0, 1);
        return (
          <span key={i} style={{display: "inline-block", clipPath: `inset(-10% ${100 - p * 100}% -10% 0)`, transform: `translateY(${(1 - p) * 4}px) rotate(${(rnd(`lt${i}${text}`) - 0.5) * 3}deg)`}}>
            {c === " " ? "\u00A0" : c}
          </span>
        );
      })}
    </div>
  );
};

export const PhotoBack: React.FC<{f: number}> = ({f}) => {
  const penT = (from: number, to: number) => clamp((f - from) / (to - from), 0, 1);
  const pen1 = penT(W1.from, W1.to);
  const pen2 = penT(W2.from, W2.to);
  const writing = (f >= W1.from && f <= W1.to + 3) || (f >= W2.from && f <= W2.to + 3);
  const line = f <= W1.to + 3 ? 1 : 2;
  const penP = line === 1 ? pen1 : pen2;
  const matchO = kf(f, [[1434, 0], [1444, 1]]) * kf(f, [[1548, 1], [1556, 0]]);
  const scan = kf(f, [[1434, 0], [1480, 1]]);
  return (
    <div style={{position: "relative", width: CARD_W, height: CARD_H, overflow: "hidden", background: "#d9cfb4"}}>
      <Img src={staticFile("fx/paper_back.png")} style={{position: "absolute", inset: 0, width: CARD_W, height: CARD_H}} />
      <div style={{position: "absolute", left: 40, top: 40, fontFamily: MONO, fontSize: 22, color: "rgba(60,50,30,0.35)", letterSpacing: 3}}>IMG_0217</div>
      <div style={{position: "absolute", left: 0, top: 410, width: CARD_W, transform: "rotate(-3deg)"}}>
        <Letters text={LINE1} f={f} from={W1.from} to={W1.to} size={104} />
        <div style={{height: 24}} />
        <Letters text={LINE2} f={f} from={W2.from} to={W2.to} size={96} />
      </div>
      {/* marker tip */}
      {writing && (
        <div style={{position: "absolute", left: 480 - (line === 1 ? 330 : 380) + penP * (line === 1 ? 660 : 760), top: line === 1 ? 470 : 600, transform: "rotate(-28deg)"}}>
          <div style={{width: 18, height: 18, borderRadius: "50%", background: "#16224a", boxShadow: "0 0 10px #16224a"}} />
          <div style={{width: 34, height: 150, marginLeft: -2, marginTop: -4, background: "linear-gradient(90deg,#252b3a,#454d63,#252b3a)", borderRadius: 8, transform: "translateX(-6px) translateY(-6px)"}} />
        </div>
      )}
      {/* handwriting analysis */}
      <div style={{position: "absolute", left: 60, right: 60, top: 380, height: 300, border: "3px solid rgba(70,210,140,0.9)", borderRadius: 10, opacity: matchO, boxShadow: "0 0 24px rgba(70,210,140,0.5)"}}>
        <div style={{position: "absolute", left: `${scan * 100}%`, top: 0, bottom: 0, width: 3, background: "rgba(70,210,140,0.9)", boxShadow: "0 0 14px rgba(70,210,140,0.9)"}} />
        <div style={{position: "absolute", left: -3, top: -46, background: "rgba(70,210,140,0.95)", color: "#06140d", fontFamily: MONO, fontWeight: 700, fontSize: 24, padding: "6px 14px", letterSpacing: 1}}>
          HANDWRITING · ARJUN · {Math.min(97, Math.floor(scan * 97))}%
        </div>
      </div>
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(60,40,10,0.35) 100%)"}} />
    </div>
  );
};

// ----------------------------------------------------------------------------
//  Magnifying glass
// ----------------------------------------------------------------------------
const Lens: React.FC<{cx: number; cy: number; R: number; fx: number; fy: number; z2: number; content: React.ReactNode; o: number}> = ({cx, cy, R, fx, fy, z2, content, o}) => (
  <div style={{position: "absolute", left: cx - R, top: cy - R, width: 2 * R, height: 2 * R, opacity: o, transform: `scale(${0.85 + 0.15 * o})`}}>
    <div style={{position: "absolute", left: R * 1.35, top: R * 1.55, width: 40, height: 220, background: "linear-gradient(90deg,#1a1d26,#555d73,#1a1d26)", borderRadius: 20, transform: "rotate(-42deg)", transformOrigin: "50% 0%"}} />
    <div style={{position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 14px #8b93a8, 0 0 0 20px #20242f, 0 20px 60px rgba(0,0,0,0.7)", background: "#000"}}>
      <div style={{position: "absolute", left: R - fx, top: R - fy, width: CARD_W, height: CARD_H, transformOrigin: `${fx}px ${fy}px`, transform: `scale(${z2})`}}>{content}</div>
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.28), rgba(255,255,255,0) 40%)"}} />
      <div style={{position: "absolute", inset: 0, boxShadow: "inset 0 0 60px rgba(0,0,0,0.6)", borderRadius: "50%"}} />
    </div>
  </div>
);

// ----------------------------------------------------------------------------
//  Meera taking the picture (picture-in-picture)
// ----------------------------------------------------------------------------
const MeeraInset: React.FC<{f: number}> = ({f}) => {
  const a = 366;
  const b = 424;
  if (f < a || f > b) return null;
  const inn = kf(f, [[a, 0], [a + 12, 1, E.back]]);
  const out = kf(f, [[b - 8, 0], [b, 1, E.in]]);
  const flash = pulse(f, 403, 5);
  const raise = kf(f, [[a + 4, 0], [a + 26, 1, E.out]]);
  const pose: RigPose = {
    ...stancePose("meera"),
    handL: [92 + (104 - 92) * raise, 220 + (70 - 220) * raise],
    handR: [150 + (138 - 150) * raise, 220 + (70 - 220) * raise],
    lean: 2 * raise,
    headTilt: -3 * raise,
    prop: "camera",
    propAmt: raise,
    eyeOpen: 0.9,
    breath: Math.sin(f * 0.15) * 1.2,
  };
  const focus = kf(f, [[a + 20, 0], [a + 36, 1]]) * (1 - flash);
  return (
    <div style={{position: "absolute", left: 40, top: 905, width: 380, height: 500, borderRadius: 30, overflow: "hidden", background: "linear-gradient(160deg,#10161f,#0a0d14)", boxShadow: "0 0 0 3px #A94F6F, 0 30px 80px rgba(0,0,0,0.7)", transform: `translateX(${(1 - inn) * -460 + out * -460}px)`}}>
      <div style={{position: "absolute", left: 20, top: 18, fontFamily: MONO, fontWeight: 700, fontSize: 21, letterSpacing: 2, color: "#f0a3c3"}}>MEERA · BEHIND THE CAMERA</div>
      <div style={{position: "absolute", left: 80, top: 60}}>
        <FriendRig id="meera" pose={pose} width={240 * 0.95} height={440 * 0.95} rim={0.1} cool={0.1} />
      </div>
      {/* viewfinder */}
      {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y], i) => (
        <div key={i} style={{position: "absolute", left: x ? 320 - focus * 20 : 40 + focus * 20, top: y ? 460 - focus * 20 : 100 + focus * 20, width: 34, height: 34, borderTop: y ? undefined : "4px solid #fff", borderBottom: y ? "4px solid #fff" : undefined, borderLeft: x ? undefined : "4px solid #fff", borderRight: x ? "4px solid #fff" : undefined, opacity: 0.9}} />
      ))}
      <div style={{position: "absolute", left: 160, top: 250, width: 60, height: 60, border: `3px solid ${focus > 0.9 ? "#6ef3a8" : "#fff"}`, opacity: raise, transform: `scale(${1.4 - 0.4 * focus})`}} />
      <div style={{position: "absolute", inset: 0, background: "#fff", opacity: flash * 0.95}} />
    </div>
  );
};

// ----------------------------------------------------------------------------
//  Count badges (hook + "five friends were visible")
// ----------------------------------------------------------------------------
const BADGES = [
  {id: "rahul", x: 160, n: 1},
  {id: "nisha", x: 320, n: 2},
  {id: "arjun", x: 480, n: 3},
  {id: "dev", x: 640, n: 4},
  {id: "kabir", x: 800, n: 5},
] as const;

export const Counter: React.FC<{f: number; times: number[]; sixthAt?: number}> = ({f, times, sixthAt}) => (
  <>
    {BADGES.map((b, i) => {
      const t = f - times[i];
      if (t < 0) return null;
      const s = kf(f, [[times[i], 0], [times[i] + 8, 1, E.back]]);
      const c = FRIEND_DESIGNS[b.id as FriendId].lightColor;
      return (
        <div key={b.id}>
          <div style={{position: "absolute", left: b.x - 78, top: FIG_TOP - 8, width: 156, height: 360 * 0.96, borderRadius: 80, border: `3px solid ${c}`, boxShadow: `0 0 ${18 * pulse(f, times[i], 14) + 6}px ${c}`, opacity: 0.8 * s, transform: `scale(${0.9 + 0.1 * s})`}} />
          <div style={{position: "absolute", left: b.x - 30, top: FIG_TOP - 80, width: 60, height: 60, borderRadius: "50%", background: "#0b1018", border: `4px solid ${c}`, color: "#fff", fontFamily: INTER, fontWeight: 800, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})`, boxShadow: `0 0 20px ${c}88`}}>
            {b.n}
          </div>
        </div>
      );
    })}
    {sixthAt !== undefined && f >= sixthAt && (
      <div>
        <div style={{position: "absolute", left: WIN.x - 10, top: WIN.y - 10, width: WIN.w + 20, height: WIN.h + 20, border: "4px solid #ff4d5a", borderRadius: 10, boxShadow: `0 0 ${14 + 24 * pulse(f, sixthAt, 16)}px #ff4d5a`, opacity: 0.6 + 0.4 * Math.abs(Math.sin(f * 0.4))}} />
        <div style={{position: "absolute", left: WIN_C.x - 38, top: WIN.y - 108, width: 76, height: 76, borderRadius: "50%", background: "#2a0a10", border: "5px solid #ff4d5a", color: "#fff", fontFamily: INTER, fontWeight: 800, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${kf(f, [[sixthAt, 0], [sixthAt + 8, 1.15, E.back]])}) translateX(${Math.sin(f * 2.2) * 2.5 * pulse(f, sixthAt, 30)}px)`}}>
          6
        </div>
      </div>
    )}
  </>
);

// ----------------------------------------------------------------------------
//  Forensic mirror-match view (jacket / angle / reflection)
// ----------------------------------------------------------------------------
const AK = 1.65;
const AF_W = 240 * AK;
const AF_H = 440 * AK;
const A_FEET = 1230;
const A_TOP = A_FEET - 416 * AK;
const A_POSE: RigPose = {...ARJUN_PHOTO_POSE, prop: "none"};

const AlignView: React.FC<{f: number}> = ({f}) => {
  // phases (frames): 1053 intro → jacket → 1116 angle → 1209 slide & flip → 1236 overlap → 1252 out
  const inn = kf(f, [[1053, 0], [1066, 1, E.out]]);
  const outv = kf(f, [[1244, 0], [1256, 1]]);
  const vis = inn * (1 - outv);
  const slide = kf(f, [[1209, 0], [1236, 1, E.inOut]]); // 0 apart → 1 overlapped
  const sx = slide < 0.5 ? -(1 - slide * 2) * 1 - 0.0 : (slide - 0.5) * 2; // -1 → 0 → +1
  const jacketO = kf(f, [[1060, 0], [1070, 1]]) * kf(f, [[1112, 1], [1118, 0.25]]) * (1 - clamp(slide * 3, 0, 1));
  const angleO = kf(f, [[1116, 0], [1126, 1]]);
  const pct = Math.floor(clamp(kf(f, [[1120, 0], [1160, 98], [1236, 100]]), 0, 100));
  const refl = kf(f, [[1236, 0], [1244, 1]]);
  const cxR = 540 + 215 - 0; // right figure centre
  const cxL = 325 + 430 * slide;
  const lean = 3;
  const angleLine = (cx: number, mirror: boolean) => {
    const topY = A_TOP + 98 * AK;
    const hipY = A_TOP + 228 * AK;
    const a = (lean * Math.PI) / 180 * (mirror ? -1 : 1);
    const x2 = cx + Math.sin(a) * (hipY - topY);
    return (
      <g>
        <line x1={cx} y1={hipY + 40} x2={cx} y2={topY - 120} stroke="rgba(120,220,255,0.7)" strokeWidth={2} strokeDasharray="8 8" />
        <line x1={cx} y1={hipY} x2={x2 + (mirror ? 0 : 0)} y2={topY} stroke="#6ef3ff" strokeWidth={4} />
        <path d={`M ${cx} ${hipY - 120} A 120 120 0 0 ${mirror ? 0 : 1} ${cx + (mirror ? -1 : 1) * 120 * Math.sin(a * (mirror ? -1 : 1))} ${hipY - 120 * Math.cos(a)}`} fill="none" stroke="#6ef3ff" strokeWidth={3} />
        <text x={cx + (mirror ? -150 : 40)} y={hipY - 140} fill="#6ef3ff" fontFamily={MONO} fontWeight={700} fontSize={34}>{mirror ? "−3.0°" : "+3.0°"}</text>
      </g>
    );
  };
  return (
    <AbsoluteFill style={{opacity: vis, background: "radial-gradient(ellipse at 50% 45%, #0b1626 0%, #04070d 78%)"}}>
      {/* blueprint grid */}
      <div style={{position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(110,200,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(110,200,255,0.07) 1px, transparent 1px)", backgroundSize: "60px 60px"}} />
      <div style={{position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: "#6ef3ff"}}>
        {refl > 0.5 ? "MIRROR ANALYSIS · COMPLETE" : "MIRROR ANALYSIS"}
      </div>
      {/* mirror axis */}
      <div style={{position: "absolute", left: 539, top: 230, width: 2, height: 1050, background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.75) 0 14px, transparent 14px 26px)", opacity: 1 - slide}} />
      <div style={{position: "absolute", left: 540 - 130, top: 1290, width: 260, textAlign: "center", fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: "rgba(255,255,255,0.7)", opacity: 1 - slide}}>MIRROR AXIS</div>

      {/* RIGHT — Arjun in the photograph */}
      <div style={{position: "absolute", left: cxR - AF_W / 2, top: A_TOP, filter: "sepia(0.2) saturate(0.9) brightness(0.95)"}}>
        <FriendRig id="arjun" pose={A_POSE} width={AF_W} height={AF_H} jacket rim={0} cool={0} shadow={false} />
      </div>
      {/* LEFT — the figure in the glass (a mirror image) */}
      <div style={{position: "absolute", left: cxL - AF_W / 2, top: A_TOP, transform: `scaleX(${sx === 0 ? 0.001 : sx})`, filter: "saturate(0.55) brightness(1.5) hue-rotate(8deg)", opacity: slide > 0.9 ? 0.78 : 0.9, mixBlendMode: slide > 0.9 ? "screen" : "normal"}}>
        <FriendRig id="arjun" pose={A_POSE} width={AF_W} height={AF_H} jacket rim={0} cool={0} shadow={false} />
      </div>

      {/* labels */}
      <div style={{position: "absolute", left: cxL - 190, top: 275, width: 380, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, color: "#9fd0ff", letterSpacing: 2, opacity: 1 - clamp(slide * 4, 0, 1)}}>WINDOW · SIXTH FIGURE</div>
      <div style={{position: "absolute", left: cxR - 190, top: 275, width: 380, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, color: "#ffe14a", letterSpacing: 2, opacity: 1 - clamp(slide * 4, 0, 1)}}>PHOTO · ARJUN</div>

      {/* jacket highlights */}
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: jacketO}}>
        {[cxL, cxR].map((cx, i) => (
          <g key={i}>
            <ellipse cx={cx} cy={A_TOP + 170 * AK} rx={92} ry={190} fill="none" stroke="#6ef3a8" strokeWidth={4} strokeDasharray="14 10" opacity={0.6 + 0.4 * Math.sin(f * 0.35)} />
            <circle cx={cx} cy={A_TOP + 106 * AK} r={34} fill="none" stroke="#ffe14a" strokeWidth={4} />
            <text x={cx - 70} y={A_TOP + 420 * AK - 70} fill="#6ef3a8" fontFamily={MONO} fontWeight={700} fontSize={32}>JACKET ✓</text>
          </g>
        ))}
      </svg>
      {/* angle lines */}
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: angleO * (1 - slide)}}>
        {angleLine(cxL, true)}
        {angleLine(cxR, false)}
      </svg>
      <div style={{position: "absolute", left: 0, right: 0, top: 1330, textAlign: "center", opacity: angleO, fontFamily: MONO, fontWeight: 700, fontSize: 40, color: pct >= 98 ? "#6ef3a8" : "#ffe14a", letterSpacing: 3}}>
        MATCH {pct}%
      </div>
      {/* verdict */}
      <div style={{position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", opacity: refl, transform: `scale(${0.9 + 0.1 * refl})`}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 62, letterSpacing: 8, color: "#fff", textShadow: "0 0 30px #6ef3ff, 0 0 60px #6ef3ff"}}>
          REFLECTION?
        </div>
        <div style={{marginTop: 10, fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: "#ff6a74", textShadow: "0 0 20px #ff4d5a"}}>
          [ ANGLE CONFLICT · 2ND FLOOR ]
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------------------
//  THE LAYER
// ----------------------------------------------------------------------------
const cardXf = (z: number, fx: number, fy: number, zref: number) => {
  const tp = clamp((z - 1) / Math.max(0.0001, zref - 1), 0, 1);
  return {transform: `translate(${(540 - (60 + fx)) * tp}px, ${(840 - (315 + fy)) * tp}px) scale(${z})`, transformOrigin: `${fx}px ${fy}px`};
};

export const PhotoLayer: React.FC = () => {
  const f = useCurrentFrame();
  const win = PHOTO_WINDOWS.find(([a, b]) => f >= a && f <= b);
  if (!win) return null;
  const [a] = win;

  // ---------- per-window camera / state
  let z = 1, fx = 480, fy = 525, zref = 1, rot = -1.1, sixth = 0, sixthReveal = 1, hiDev = 0, shimmer = 0;
  let counter: {times: number[]; sixthAt?: number} | null = null;
  let lensO = 0, flip = 0, showBack = false;
  let enter = 1, hudO = 1;

  if (a === 0) {
    // VIRAL INTERACTIVE HOOK: Start locked directly on the broken window & 6th silhouette!
    fx = WIN_C.x; fy = WIN_C.y; zref = 4.6;
    // Hold close on the window for frames 0-28 (stopping fast scrollers), then whip out to full photo by frame 52
    z = kf(f, [[0, 4.6], [28, 4.6], [52, 1.0, E.out]]);
    // Count 1 to 5 as narrator says "There were five people in this photograph..."
    counter = {times: [52, 60, 68, 76, 84], sixthAt: 96};
    // Shadowy 6th figure visible immediately in the window from frame 0
    sixth = kf(f, [[0, 0.95], [52, 0.85]]) * (0.8 + 0.2 * Math.abs(Math.sin(f * 0.8)));
    sixthReveal = 1;
    rot = kf(f, [[0, -0.4], [28, -0.4], [52, -1.1, E.out]]);
  } else if (a === 255) {
    enter = kf(f, [[255, 0.55], [278, 1, E.out]]);
    rot = kf(f, [[255, -4], [285, -1.1, E.out]]);
    hiDev = kf(f, [[262, 0], [272, 1]]) * kf(f, [[306, 1], [316, 0]]);
    counter = f >= 321 && f < 420 ? {times: [324, 333, 342, 351, 360]} : null;
    fx = WIN_C.x; fy = WIN_C.y; zref = 4.2;
    z = kf(f, [[468, 1], [552, 4.2, E.inOut]]) * enter;
    sixth = kf(f, [[255, 0.90], [552, 0.96]]);
    sixthReveal = 1;
    shimmer = kf(f, [[255, 0.4], [567, 1], [640, 0.3]]);
    lensO = kf(f, [[512, 0], [524, 1]]) * kf(f, [[612, 1], [630, 0]]);
  } else if (a === 1014) {
    fx = WIN_C.x; fy = WIN_C.y + 6; zref = 6.2;
    z = kf(f, [[1014, 4.2], [1050, 6.2, E.soft]]);
    sixth = 0.85; shimmer = 0.5; rot = -0.6;
    hudO = kf(f, [[1014, 0], [1024, 1]]);
  } else {
    // 1209–1557
    fx = WIN_C.x; fy = WIN_C.y + 6; zref = 6.2;
    z = kf(f, [[1240, 6.2], [1266, 1.0, E.inOut]]);
    sixth = 0.85; rot = kf(f, [[1240, -0.6], [1296, -1.1]]);
    flip = kf(f, [[1266, 0], [1296, 180, E.inOut]]);
    showBack = f >= 1281;
  }

  const backZ = showBack ? kf(f, [[1296, 1.0], [1428, 1.04], [1556, 1.09]], E.soft) : 1;
  const bgA = a === 0 ? 1 : kf(f, [[a, 0], [a + 18, 1]]);
  const lift = flip > 0 && flip < 180 ? 1 + 0.07 * Math.sin((flip / 180) * Math.PI) : 1;

  const front = <PhotoFront f={f} sixth={sixth} sixthReveal={sixthReveal} hiDev={hiDev} shimmer={shimmer} gaze={1} showTags={z < 2.5} />;

  // dots HUD (five friends were visible)
  const dotTimes = [324, 333, 342, 351, 360];
  const hudDots = a === 255 && f >= 318 && f < 424;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: a === 255 ? `rgba(3,5,10,${0.66 + 0.3 * bgA})` : "radial-gradient(ellipse at 50% 45%, #0c111b 0%, #04060a 75%)", backdropFilter: a === 255 ? `blur(${16 * bgA}px)` : undefined}} />

      {/* the analysis view replaces the card in 1053–1252 */}
      {a === 1014 && f >= 1053 && <AlignView f={f} />}
      {a === 1209 && f < 1256 && <AlignView f={f} />}

      {/* the card */}
      {!((a === 1014 && f >= 1053) || (a === 1209 && f < 1240)) && (
        <div style={{position: "absolute", inset: 0, perspective: 2200}}>
          <div style={{position: "absolute", left: 60, top: 315, width: CARD_W, height: CARD_H, ...cardXf(z * backZ, fx, fy, zref), opacity: a === 1209 ? kf(f, [[1240, 0], [1248, 1]]) : 1}}>
            <div style={{position: "relative", width: CARD_W, height: CARD_H, transformStyle: "preserve-3d", transform: `rotate(${rot}deg) rotateY(${flip}deg) scale(${lift})`}}>
              <div style={{position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 10px #d9d4c7"}}>
                {front}
                {counter && <div style={{position: "absolute", inset: 0}}><Counter f={f} times={counter.times} sixthAt={counter.sixthAt} /></div>}
                {a === 255 && hiDev > 0 && (
                  <div style={{position: "absolute", left: 640 - 80, top: FIG_TOP - 70, width: 160, textAlign: "center", opacity: hiDev}}>
                    <div style={{display: "inline-block", background: "#ff4d5a", color: "#fff", fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 4, padding: "6px 18px", borderRadius: 6}}>DEV</div>
                  </div>
                )}
                {/* scan brackets on the unknown figure */}
                {(a === 255 && f >= 585 && f < 650) || a === 1014 ? (
                  <div style={{position: "absolute", left: WIN.x - 16, top: WIN.y - 12, width: WIN.w + 32, height: WIN.h + 24, border: "3px solid rgba(255,77,90,0.95)", opacity: (a === 1014 ? hudO : kf(f, [[585, 0], [595, 1]])) * (0.7 + 0.3 * Math.sin(f * 0.5))}} />
                ) : null}
              </div>
              <div style={{position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 10px #d9d4c7"}}>
                <PhotoBack f={f} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* magnifying glass */}
      {a === 255 && lensO > 0.01 && (
        <Lens cx={kf(f, [[512, 330], [548, 540]], E.inOut)} cy={kf(f, [[512, 1020], [548, 840]], E.inOut)} R={190} fx={WIN_C.x} fy={WIN_C.y} z2={4.2 * 1.9} o={lensO}
          content={<PhotoFront f={f} sixth={sixth} sixthReveal={sixthReveal} shimmer={shimmer} />} />
      )}
      {a === 255 && lensO > 0.01 && f >= 530 && f < 610 && (
        <div style={{position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: "#ffe14a", opacity: lensO}}>ZOOM · GLASS WINDOW</div>
      )}
      {a === 255 && f >= 600 && f < 664 && (
        <div style={{position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: "#ff4d5a", opacity: kf(f, [[600, 0], [610, 1]]) * (0.6 + 0.4 * Math.abs(Math.sin(f * 0.4)))}}>UNKNOWN FIGURE</div>
      )}

      {/* five-friends HUD */}
      {hudDots && (
        <div style={{position: "absolute", right: 50, top: 150, display: "flex", gap: 12}}>
          {dotTimes.map((t, i) => (
            <div key={i} style={{width: 22, height: 22, borderRadius: "50%", border: "2px solid #8fb4ff", background: f >= t ? "#8fb4ff" : "transparent", boxShadow: f >= t ? "0 0 12px #8fb4ff" : "none", transform: `scale(${1 + 0.7 * pulse(f, t, 8)})`}} />
          ))}
        </div>
      )}
      {a === 255 && <MeeraInset f={f} />}

      {/* VIRAL HOOK OVERLAY — interactive challenge in first 38 frames */}
      {a === 0 && f < 42 && (
        <>
          <div
            style={{
              position: "absolute",
              top: 160,
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 60,
              opacity: kf(f, [[0, 1], [32, 1], [40, 0]]),
              transform: `scale(${kf(f, [[0, 0.95], [8, 1.0, E.back]])})`,
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "rgba(220, 38, 38, 0.92)",
                border: "2px solid #fecaca",
                borderRadius: 999,
                padding: "8px 28px",
                color: "#ffffff",
                fontFamily: MONO,
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: 6,
                textTransform: "uppercase",
                boxShadow: "0 0 35px rgba(220,38,38,0.85)",
              }}
            >
              VISUAL TEST · 99% FAIL
            </div>
            <div
              style={{
                fontFamily: INTER,
                fontWeight: 900,
                fontSize: 50,
                color: "#ffffff",
                marginTop: 14,
                letterSpacing: 2,
                lineHeight: 1.1,
                textShadow: "0 4px 25px rgba(0,0,0,0.95), 0 0 35px rgba(239,68,68,0.75)",
              }}
            >
              CAN YOU SPOT THE <span style={{color: "#ff4d5a"}}>6TH PERSON?</span>
            </div>
          </div>

          {/* High-contrast red targeting bracket around the window during close-up */}
          {f < 30 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "43%",
                transform: "translate(-50%, -50%)",
                width: 330,
                height: 330,
                border: "3px dashed rgba(255, 77, 90, 0.95)",
                borderRadius: 18,
                boxShadow: "0 0 45px rgba(255, 77, 90, 0.65), inset 0 0 30px rgba(255, 77, 90, 0.35)",
                pointerEvents: "none",
                zIndex: 55,
                opacity: 0.85 + 0.15 * Math.sin(f * 0.9),
              }}
            >
              <div style={{position: "absolute", left: -4, top: -4, width: 28, height: 28, borderTop: "6px solid #ff4d5a", borderLeft: "6px solid #ff4d5a"}} />
              <div style={{position: "absolute", right: -4, top: -4, width: 28, height: 28, borderTop: "6px solid #ff4d5a", borderRight: "6px solid #ff4d5a"}} />
              <div style={{position: "absolute", left: -4, bottom: -4, width: 28, height: 28, borderBottom: "6px solid #ff4d5a", borderLeft: "6px solid #ff4d5a"}} />
              <div style={{position: "absolute", right: -4, bottom: -4, width: 28, height: 28, borderBottom: "6px solid #ff4d5a", borderRight: "6px solid #ff4d5a"}} />
              <div
                style={{
                  position: "absolute",
                  bottom: -38,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontFamily: MONO,
                  fontWeight: 800,
                  fontSize: 19,
                  color: "#ff4d5a",
                  letterSpacing: 4,
                  textShadow: "0 0 10px #ff4d5a",
                }}
              >
                TARGET DETECTED · 2ND FLOOR
              </div>
            </div>
          )}
        </>
      )}
    </AbsoluteFill>
  );
};
