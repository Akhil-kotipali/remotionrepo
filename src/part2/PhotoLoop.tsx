import React from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from "remotion";
import {FriendRig, RigPose, stancePose} from "./rig/FriendRig";
import {INTER, MARKER, MONO, MONT} from "./fonts";
import {E, clamp, kf, pulse, rnd} from "./math";
import {Counter, PhotoFront, WIN_C} from "./Photo";

const CARD_W = 960;
const CARD_H = 1050;

export const PHOTO_WINDOWS_LOOP: [number, number][] = [
  [0, 135],
  [240, 365],
  [765, 1100],
  [1100, 1440],
];

const LINE1 = "IF WE FORGET,";
const LINE2 = "WATCH THE VIDEO.";
const W1 = {from: 1180, to: 1225};
const W2 = {from: 1230, to: 1275};

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

export const PhotoBackLoop: React.FC<{f: number}> = ({f}) => {
  const penT = (from: number, to: number) => clamp((f - from) / (to - from), 0, 1);
  const pen1 = penT(W1.from, W1.to);
  const pen2 = penT(W2.from, W2.to);
  const writing = (f >= W1.from && f <= W1.to + 3) || (f >= W2.from && f <= W2.to + 3);
  const line = f <= W1.to + 3 ? 1 : 2;
  const penP = line === 1 ? pen1 : pen2;
  const matchO = kf(f, [[1280, 0], [1292, 1]]) * kf(f, [[1430, 1], [1440, 0]]);
  const scan = kf(f, [[1280, 0], [1330, 1]]);
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
//  Picture in picture: Meera taking photo
// ----------------------------------------------------------------------------
const MeeraInsetLoop: React.FC<{f: number}> = ({f}) => {
  const a = 245;
  const b = 355;
  if (f < a || f > b) return null;
  const inn = kf(f, [[a, 0], [a + 12, 1, E.back]]);
  const out = kf(f, [[b - 8, 0], [b, 1, E.in]]);
  const flash = pulse(f, 290, 5);
  const raise = kf(f, [[a + 4, 0], [a + 24, 1, E.out]]);
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
  return (
    <div style={{position: "absolute", left: 40, top: 905, width: 380, height: 500, borderRadius: 30, overflow: "hidden", background: "linear-gradient(160deg,#10161f,#0a0d14)", boxShadow: "0 0 0 3px #A94F6F, 0 30px 80px rgba(0,0,0,0.7)", transform: `translateX(${(1 - inn) * -460 + out * -460}px)`}}>
      <div style={{position: "absolute", left: 20, top: 18, fontFamily: MONO, fontWeight: 700, fontSize: 21, letterSpacing: 2, color: "#f0a3c3"}}>MEERA · BEHIND THE CAMERA</div>
      <div style={{position: "absolute", left: 80, top: 60}}>
        <FriendRig id="meera" pose={pose} width={240 * 0.95} height={440 * 0.95} rim={0.1} cool={0.1} />
      </div>
      <div style={{position: "absolute", inset: 0, background: "#fff", opacity: flash * 0.9, pointerEvents: "none"}} />
    </div>
  );
};

// ----------------------------------------------------------------------------
//  Mirror alignment analysis with physical contradiction
// ----------------------------------------------------------------------------
const AlignViewLoop: React.FC<{f: number}> = ({f}) => {
  const AK = 1.35;
  const AF_W = 240 * AK;
  const AF_H = 440 * AK;
  const A_TOP = 640;
  const A_POSE: RigPose = {
    ...stancePose("arjun"),
    lean: 3,
    headTilt: -4,
    lookX: 0.5,
    lookY: 0.1,
    eyeOpen: 1.1,
    brow: 0.3,
    mouth: 0.1,
    breath: Math.sin(f * 0.18) * 1.5,
  };

  const aL = kf(f, [[765, 0], [785, 1, E.out]]);
  const aR = kf(f, [[780, 0], [800, 1, E.out]]);
  const angleO = kf(f, [[885, 0], [905, 1]]);
  const slide = kf(f, [[930, 0], [966, 1, E.inOut]]);
  const pct = Math.floor(kf(f, [[885, 60], [950, 99]]));
  const refl = kf(f, [[966, 0], [980, 1, E.back]]);

  const cxL = kf(f, [[765, 270], [930, 270], [966, 540, E.inOut]]);
  const cxR = kf(f, [[780, 810], [930, 810], [966, 540, E.inOut]]);
  const sx = kf(f, [[765, -1], [930, -1], [948, 0], [966, 1, E.inOut]]);

  return (
    <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, #0b1220 0%, #030509 80%)", overflow: "hidden"}}>
      {/* scan grid backdrop */}
      <div style={{position: "absolute", inset: 0, opacity: 0.15, backgroundImage: "linear-gradient(rgba(143,180,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(143,180,255,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px"}} />

      {/* header */}
      <div style={{position: "absolute", top: 140, left: 0, right: 0, textAlign: "center"}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 8, color: "#8fb4ff", textTransform: "uppercase"}}>FORENSIC COMPARISON · 1:1 SCALE</div>
        <div style={{marginTop: 10, fontFamily: MONT, fontWeight: 900, fontSize: 50, letterSpacing: 2, color: "#ffffff"}}>WINDOW FIGURE vs ARJUN</div>
      </div>

      {/* RIGHT — Arjun */}
      <div style={{position: "absolute", left: cxR - AF_W / 2, top: A_TOP, opacity: aR}}>
        <FriendRig id="arjun" pose={A_POSE} width={AF_W} height={AF_H} jacket rim={0} cool={0} shadow={false} />
      </div>
      {/* LEFT — figure in window */}
      <div style={{position: "absolute", left: cxL - AF_W / 2, top: A_TOP, transform: `scaleX(${sx === 0 ? 0.001 : sx})`, filter: "saturate(0.55) brightness(1.5) hue-rotate(8deg)", opacity: slide > 0.9 ? 0.78 : aL, mixBlendMode: slide > 0.9 ? "screen" : "normal"}}>
        <FriendRig id="arjun" pose={A_POSE} width={AF_W} height={AF_H} jacket rim={0} cool={0} shadow={false} />
      </div>

      {/* labels */}
      <div style={{position: "absolute", left: cxL - 190, top: 275, width: 380, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, color: "#9fd0ff", letterSpacing: 2, opacity: 1 - clamp(slide * 4, 0, 1)}}>WINDOW · SIXTH FIGURE</div>
      <div style={{position: "absolute", left: cxR - 190, top: 275, width: 380, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, color: "#ffe14a", letterSpacing: 2, opacity: 1 - clamp(slide * 4, 0, 1)}}>PHOTO · ARJUN</div>

      {/* Match Percentage */}
      <div style={{position: "absolute", left: 0, right: 0, top: 1330, textAlign: "center", opacity: angleO, fontFamily: MONO, fontWeight: 700, fontSize: 44, color: pct >= 98 ? "#6ef3a8" : "#ffe14a", letterSpacing: 3}}>
        MATCH {pct}%
      </div>

      {/* Verdict: The Physical Reflection Contradiction */}
      <div style={{position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", opacity: refl, transform: `scale(${0.9 + 0.1 * refl})`}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 62, letterSpacing: 8, color: "#fff", textShadow: "0 0 30px #6ef3ff, 0 0 60px #6ef3ff"}}>
          REFLECTION?
        </div>
        <div style={{marginTop: 12, fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: "#ff6a74", textShadow: "0 0 20px #ff4d5a"}}>
          [ ANGLE CONFLICT · 2ND FLOOR ]
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------------------
//  THE LOOP PHOTO LAYER
// ----------------------------------------------------------------------------
export const PhotoLayerLoop: React.FC = () => {
  const f = useCurrentFrame();
  const win = PHOTO_WINDOWS_LOOP.find(([a, b]) => f >= a && f <= b);
  if (!win) return null;
  const [a] = win;

  // Window 1: 0 to 135 (Interactive viral hook)
  if (a === 0) {
    const fx = WIN_C.x, fy = WIN_C.y;
    const z = kf(f, [[0, 4.6], [28, 4.6], [52, 1.0, E.out]]);
    const rot = kf(f, [[0, -0.4], [28, -0.4], [52, -1.1, E.out]]);
    const sixth = kf(f, [[0, 0.95], [52, 0.85]]) * (0.8 + 0.2 * Math.abs(Math.sin(f * 0.8)));
    const counter = {times: [46, 54, 62, 70, 78], sixthAt: 86};

    return (
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, #0c111b 0%, #04060a 75%)"}}>
        {/* The Card with smooth pull-out from 2nd floor window */}
        <div style={{position: "absolute", left: 60, top: 315, width: CARD_W, height: CARD_H, transform: `translate(${(540 - (60 + fx)) * clamp((z - 1) / 3.6, 0, 1)}px, ${(840 - (315 + fy)) * clamp((z - 1) / 3.6, 0, 1)}px) scale(${z}) rotate(${rot}deg)`, transformOrigin: `${fx}px ${fy}px`}}>
          <div style={{position: "relative", width: CARD_W, height: CARD_H, borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 10px #d9d4c7"}}>
            <PhotoFront f={f} sixth={sixth} sixthReveal={1} gaze={1} showTags={z < 2.5} />
            {/* Numbered outlines 1-5 & snapping red 6 window target */}
            <div style={{position: "absolute", inset: 0}}>
              <Counter f={f} times={counter.times} sixthAt={counter.sixthAt} />
            </div>
          </div>
        </div>

        {/* Top header overlay - OUTSIDE camera-zoom transform so it is never cropped or scaled off-screen! */}
        {f < 45 && (
          <div style={{position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", zIndex: 100, opacity: kf(f, [[0, 1], [35, 1], [45, 0]])}}>
            <div style={{display: "inline-block", background: "rgba(220, 38, 38, 0.95)", border: "2px solid #fecaca", borderRadius: 999, padding: "8px 28px", color: "#ffffff", fontFamily: MONO, fontWeight: 800, fontSize: 24, letterSpacing: 6, textTransform: "uppercase", boxShadow: "0 4px 24px rgba(220,38,38,0.6)"}}>
              VISUAL TEST · 99% FAIL
            </div>
            <div style={{fontFamily: INTER, fontWeight: 900, fontSize: 46, color: "#ffffff", marginTop: 14, letterSpacing: 2, textShadow: "0 4px 24px rgba(0,0,0,0.95)"}}>
              CAN YOU SPOT THE 6TH PERSON?
            </div>
          </div>
        )}
      </AbsoluteFill>
    );
  }

  // Window 2: 240 to 365 (Meera taking photo + 5 friends HUD)
  if (a === 240) {
    const enter = kf(f, [[240, 0.55], [260, 1, E.out]]);
    const hiDev = kf(f, [[250, 0], [265, 1]]) * kf(f, [[300, 1], [315, 0]]);
    return (
      <AbsoluteFill style={{background: "rgba(3,5,10,0.85)", backdropFilter: "blur(14px)"}}>
        <div style={{position: "absolute", left: 60, top: 315, width: CARD_W, height: CARD_H, transform: `scale(${enter}) rotate(-1.1deg)`, transformOrigin: "480px 525px"}}>
          <div style={{position: "relative", width: CARD_W, height: CARD_H, borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 10px #d9d4c7"}}>
            <PhotoFront f={f} sixth={0.92} sixthReveal={1} hiDev={hiDev} shimmer={0.4} gaze={1} showTags={true} />
            {hiDev > 0 && (
              <div style={{position: "absolute", left: 640 - 80, top: 720 - 70, width: 160, textAlign: "center", opacity: hiDev}}>
                <div style={{display: "inline-block", background: "#ff4d5a", color: "#fff", fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 4, padding: "6px 18px", borderRadius: 6}}>DEV</div>
              </div>
            )}
          </div>
        </div>
        <MeeraInsetLoop f={f} />
      </AbsoluteFill>
    );
  }

  // Window 3: 765 to 1100 (AlignView: mirror analysis & angle conflict)
  if (a === 765) {
    return <AlignViewLoop f={f} />;
  }

  // Window 4: 1100 to 1440 (PhotoBack: marker handwriting & Arjun 97%)
  const flip = kf(f, [[1100, 0], [1135, 180, E.inOut]]);
  const showBack = f >= 1118;
  return (
    <AbsoluteFill style={{background: "rgba(3,5,10,0.88)", backdropFilter: "blur(16px)"}}>
      <div style={{position: "absolute", inset: 0, perspective: 2200}}>
        <div style={{position: "absolute", left: 60, top: 315, width: CARD_W, height: CARD_H, transformOrigin: "480px 525px", transform: "scale(1.04) rotate(-1.1deg)"}}>
          <div style={{position: "relative", width: CARD_W, height: CARD_H, transformStyle: "preserve-3d", transform: `rotateY(${flip}deg)`}}>
            <div style={{position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 10px #d9d4c7"}}>
              <PhotoFront f={f} sixth={0.88} sixthReveal={1} shimmer={0.4} gaze={1} showTags={false} />
            </div>
            <div style={{position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 10px #d9d4c7"}}>
              {showBack && <PhotoBackLoop f={f} />}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
