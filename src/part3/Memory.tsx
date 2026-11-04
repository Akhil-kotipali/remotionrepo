import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {KabirScene, MeeraScene, NishaScene, PH, PW, RahulScene, RecScene} from "./scenes";
import {PhotoCard} from "./PhotoCard";
import {MONO, MONT} from "./fonts";
import {E, clamp, kf, lerp, noise, pulse} from "./math";

type PId = "rahul" | "meera" | "kabir" | "nisha";
const PANELS: Record<PId, {i: number; start: number; end: number; color: string; label: string; branch: string; scene: React.FC<{t: number}>}> = {
  rahul: {i: 0, start: 183, end: 264, color: "#E0814F", label: "RAHUL'S MEMORY", branch: "DEV LEAVES ALONE", scene: RahulScene},
  meera: {i: 1, start: 264, end: 333, color: "#C85C86", label: "MEERA'S MEMORY", branch: "ARJUN FOLLOWS HIM", scene: MeeraScene},
  kabir: {i: 2, start: 333, end: 402, color: "#46B5BD", label: "KABIR'S MEMORY", branch: "AN ARGUMENT", scene: KabirScene},
  nisha: {i: 3, start: 402, end: 525, color: "#EAC24B", label: "NISHA'S MEMORY", branch: "“DON'T TOUCH ME!”", scene: NishaScene},
};
const IDS: PId[] = ["rahul", "meera", "kabir", "nisha"];

const ACTIVE = {x: 90, y: 250};
const SLOT_S = 0.22;
const slot = (i: number) => ({x: 117 + i * 216, y: 60});
const GRID = [{x: 196, y: 110}, {x: 560, y: 110}, {x: 196, y: 400}, {x: 560, y: 400}];
const GRID_S = 0.36;
const BR_X = [160, 400, 680, 920];
const branchPos = (i: number) => ({x: BR_X[i] - (PW * SLOT_S) / 2, y: 1150});

type St = {x: number; y: number; s: number; o: number; blur: number; locked: boolean; t: number};

function panelState(id: PId, f: number): St {
  const P = PANELS[id];
  const sl = slot(P.i);
  const lockedT = 40; // a mid-scene frame, blurred
  const tAct = clamp(f - P.start, 0, P.end - P.start);
  // ---- hook: bursts out of the photograph into a 2x2 grid, then docks into the slot row
  if (f < 93) return {x: 540, y: 860, s: 0.05, o: 0, blur: 8, locked: true, t: lockedT};
  if (f < 168) {
    const g = GRID[P.i];
    const a = kf(f, [[93 + P.i * 5, 0], [126 + P.i * 5, 1, E.back]]);
    const dock = kf(f, [[150, 0], [168, 1, E.inOut]]);
    const gx = lerp(540 - (PW * GRID_S) / 2, g.x, a);
    const gy = lerp(860 - (PH * GRID_S) / 2, g.y, a);
    return {x: lerp(gx, sl.x, dock), y: lerp(gy, sl.y, dock), s: lerp(lerp(0.05, GRID_S, a), SLOT_S, dock), o: a, blur: 7, locked: true, t: lockedT + f * 0.2};
  }
  // ---- timeline: panels ride down to the ends of the four branches
  if (f >= 525 && f < 618) {
    const b = branchPos(P.i);
    const kk = f < 598 ? kf(f, [[525, 0], [550, 1, E.inOut]]) : kf(f, [[598, 1], [618, 0, E.inOut]]);
    return {x: lerp(sl.x, b.x, kk), y: lerp(sl.y, b.y, kk), s: SLOT_S, o: 1, blur: 0, locked: false, t: P.end - P.start};
  }
  // ---- expand from the slot while its memory plays, then return
  const open = kf(f, [[P.start - 8, 0], [P.start + 6, 1, E.out]]) * (1 - kf(f, [[P.end - 8, 0], [P.end + 6, 1, E.inOut]]));
  const x = lerp(sl.x, ACTIVE.x, open);
  const y = lerp(sl.y, ACTIVE.y, open);
  const s = lerp(SLOT_S, 1, open);
  const revealed = f >= P.start;
  const row = f >= 618 ? kf(f, [[618, 1], [632, 0.45], [838, 0.45], [852, 0]]) : 1;
  const shoutZoom = id === "nisha" ? kf(f, [[466, 0], [472, 1, E.out], [506, 1], [518, 0]]) : 0;
  return {x: x - shoutZoom * 40, y: y - shoutZoom * 20, s: s * (1 + 0.09 * shoutZoom), o: row, blur: revealed ? 0 : 7, locked: !revealed, t: revealed ? tAct : lockedT};
}

const Panel: React.FC<{id: PId; f: number}> = ({id, f}) => {
  const P = PANELS[id];
  const st = panelState(id, f);
  if (st.o <= 0.01) return null;
  const Scene = P.scene;
  const shake = id === "nisha" ? pulse(f, 468, 30) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: st.x + Math.sin(f * 3) * 7 * shake * (st.s > 0.5 ? 1 : 0),
        top: st.y + Math.cos(f * 3.3) * 7 * shake * (st.s > 0.5 ? 1 : 0),
        width: PW,
        height: PH,
        transformOrigin: "0 0",
        transform: `scale(${st.s})`,
        opacity: st.o,
      }}
    >
      <div style={{position: "relative", width: PW, height: PH, borderRadius: 40, overflow: "hidden", boxShadow: `0 0 0 8px ${P.color}, 0 0 60px 8px ${P.color}88, 0 30px 80px rgba(0,0,0,0.7)`, background: "#05080d"}}>
        <div style={{position: "absolute", inset: 0, filter: `blur(${st.blur}px) ${st.locked ? "brightness(0.6) saturate(0.7)" : ""}`}}>
          <Scene t={st.t} />
        </div>
        {st.locked && (
          <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 900, fontSize: 380, color: "rgba(255,255,255,0.8)", textShadow: `0 0 60px ${P.color}`}}>?</div>
        )}
        <div style={{position: "absolute", left: 28, top: 26, fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: "#fff", background: P.color, padding: "7px 20px", borderRadius: 8, color2: "#000"} as any}>{P.label}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- the hook: photo + beams
const Beams: React.FC<{f: number}> = ({f}) => {
  if (f < 93 || f > 172) return null;
  const o = kf(f, [[93, 0], [110, 1], [150, 1], [170, 0]]);
  return (
    <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: o}}>
      {IDS.map((id, i) => {
        const g = GRID[i];
        const cx = g.x + (PW * GRID_S) / 2;
        const cy = g.y + (PH * GRID_S) / 2;
        return <line key={id} x1={540} y1={860} x2={cx} y2={cy} stroke={PANELS[id].color} strokeWidth={5} strokeDasharray="18 14" strokeDashoffset={-f * 3} opacity={0.8} style={{filter: `drop-shadow(0 0 8px ${PANELS[id].color})`}} />;
      })}
    </svg>
  );
};

// ---------------------------------------------------------------- "But nobody agreed" — the night branches into four versions
const Timeline: React.FC<{f: number}> = ({f}) => {
  if (f < 525 || f > 618) return null;
  const o = kf(f, [[525, 0], [538, 1], [604, 1], [618, 0]]);
  const draw = (i: number) => kf(f, [[534 + i * 8, 0], [566 + i * 8, 1, E.out]]);
  const nobody = kf(f, [[580, 0], [590, 1, E.back]]);
  return (
    <AbsoluteFill style={{opacity: o, background: "radial-gradient(ellipse at 50% 40%, #0b1626 0%, #04070d 80%)"}}>
      <div style={{position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(110,200,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(110,200,255,0.06) 1px, transparent 1px)", backgroundSize: "60px 60px"}} />
      <div style={{position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: "#8fb4ff"}}>THE SAME NIGHT</div>
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {/* trunk */}
        <line x1={540} y1={250} x2={540} y2={760} stroke="#fff" strokeWidth={8} strokeDasharray="520" strokeDashoffset={520 * (1 - kf(f, [[526, 0], [548, 1]]))} style={{filter: "drop-shadow(0 0 10px #fff)"}} />
        {[0, 1, 2, 3].map((n) => (
          <circle key={n} cx={540} cy={290 + n * 150} r={9} fill="#fff" opacity={kf(f, [[530 + n * 4, 0], [538 + n * 4, 1]])} />
        ))}
        <text x={575} y={300} fill="#8fb4ff" fontFamily={MONO} fontWeight={700} fontSize={28}>7:40 PM</text>
        <text x={575} y={750} fill="#ff6a74" fontFamily={MONO} fontWeight={700} fontSize={28}>2:17 AM</text>
        {/* branches */}
        {IDS.map((id, i) => {
          const c = PANELS[id].color;
          const x1 = BR_X[i];
          const d = `M 540 760 C 540 900, ${x1} 920, ${x1} 1130`;
          return <path key={id} d={d} fill="none" stroke={c} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw(i)} style={{filter: `drop-shadow(0 0 12px ${c})`}} />;
        })}
        {/* ? marks where the versions part */}
        {[0, 1, 2, 3].map((i) => (
          <text key={i} x={BR_X[i] + (i < 2 ? 40 : -40)} y={980 + (i % 2) * 40} fill="#ff4d5a" fontFamily={MONT} fontWeight={900} fontSize={70} textAnchor="middle" opacity={kf(f, [[560 + i * 4, 0], [570 + i * 4, 0.85]]) * (0.6 + 0.4 * Math.abs(Math.sin(f * 0.3 + i)))}>?</text>
        ))}
      </svg>
      {/* branch labels */}
      {IDS.map((id, i) => (
        <div key={id} style={{position: "absolute", left: BR_X[i] - 118, top: 1320, width: 236, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 25, lineHeight: 1.25, color: PANELS[id].color, letterSpacing: 1, opacity: kf(f, [[560 + i * 6, 0], [572 + i * 6, 1]])}}>{PANELS[id].branch}</div>
      ))}
      <div style={{position: "absolute", left: 0, right: 0, top: 1450 - 20, textAlign: "center", opacity: nobody, transform: `scale(${0.9 + 0.1 * nobody})`, fontFamily: MONT, fontWeight: 900, fontSize: 64, color: "#ff4d5a", letterSpacing: 2, WebkitTextStroke: "8px #000", paintOrder: "stroke fill"}}>NO TWO AGREE</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Silence: the timeline has a hole in it
const NoWitness: React.FC<{f: number}> = ({f}) => {
  if (f < 846 || f > 972) return null;
  const o = kf(f, [[846, 0], [862, 1], [954, 1], [970, 0]]);
  const gap = kf(f, [[870, 0], [900, 1, E.out]]);
  const glitch = f > 896 ? 0.5 + 0.5 * Math.abs(Math.sin(f * 0.9)) : 0;
  const x0 = 70;
  const x1 = 1010;
  const gx = 790;
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: "none"}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 280, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: "#8fb4ff"}}>THE NIGHT · 7:40 PM → 2:17 AM</div>
      <svg width={1080} height={520} style={{position: "absolute", left: 0, top: 360}}>
        {/* four overlapping memories, each only partly covering the night */}
        {IDS.map((id, i) => {
          const a = [0.0, 0.18, 0.34, 0.5][i];
          const b = [0.52, 0.62, 0.7, 0.78][i];
          const w = (x1 - x0) * kf(f, [[850 + i * 5, 0], [880 + i * 5, 1, E.out]]);
          const xa = x0 + (x1 - x0) * a;
          const xb = Math.min(xa + (x1 - x0) * (b - a), xa + w);
          return <rect key={id} x={xa} y={60 + i * 46} width={Math.max(0, xb - xa)} height={26} rx={13} fill={PANELS[id].color} opacity={0.9} />;
        })}
        <line x1={x0} y1={290} x2={x1} y2={290} stroke="#445" strokeWidth={4} />
        {Array.from({length: 11}, (_, i) => <line key={i} x1={x0 + (i * (x1 - x0)) / 10} y1={278} x2={x0 + (i * (x1 - x0)) / 10} y2={302} stroke="#667" strokeWidth={3} />)}
        {/* the hole */}
        <rect x={gx} y={30} width={200 * gap} height={290} fill="#000" stroke="#ff4d5a" strokeWidth={4} strokeDasharray="14 10" opacity={0.95} />
        <text x={gx + 100} y={190} fill="#ff4d5a" fontFamily={MONT} fontWeight={900} fontSize={110} textAnchor="middle" opacity={gap * (0.5 + 0.5 * glitch)}>?</text>
      </svg>
      <div style={{position: "absolute", left: 0, right: 0, top: 710, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: "#ff4d5a", opacity: gap * (0.7 + 0.3 * glitch)}}>2:17 AM · NO WITNESS</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Shout slam
const ShoutOverlay: React.FC<{f: number}> = ({f}) => {
  if (f < 468 || f > 512) return null;
  const k = kf(f, [[468, 0], [474, 1, E.out], [504, 1], [512, 0]]);
  const sh = pulse(f, 468, 30);
  return (
    <AbsoluteFill style={{opacity: k, pointerEvents: "none"}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: MONT, fontWeight: 900, fontSize: 132, lineHeight: 0.95, color: "#EAC24B", WebkitTextStroke: "16px #000", paintOrder: "stroke fill", textShadow: "0 0 60px #EAC24B", transform: `translate(${Math.sin(f * 3.1) * 8 * sh}px, ${Math.cos(f * 3.7) * 8 * sh}px) scale(${1 + 0.1 * sh})`}}>
        DON'T<br />TOUCH ME!
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Meera's second memory (the phone)
const RecPanel: React.FC<{f: number}> = ({f}) => {
  if (f < 996 || f > 1300) return null;
  const inn = kf(f, [[996, 0], [1014, 1, E.back]]);
  const out = kf(f, [[1284, 0], [1298, 1, E.in]]);
  const o = inn * (1 - out);
  const t = f - 1000;
  const col = "#C85C86";
  return (
    <div style={{position: "absolute", left: ACTIVE.x, top: ACTIVE.y, width: PW, height: PH, opacity: o, transform: `scale(${0.8 + 0.2 * inn}) translateY(${out * -60}px)`, transformOrigin: "50% 100%"}}>
      <div style={{position: "relative", width: PW, height: PH, borderRadius: 40, overflow: "hidden", boxShadow: `0 0 0 8px ${col}, 0 0 60px 8px ${col}88, 0 30px 80px rgba(0,0,0,0.7)`, background: "#05080d"}}>
        <RecScene t={t} />
        <div style={{position: "absolute", left: 28, top: 26, fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: "#fff", background: col, padding: "7px 20px", borderRadius: 8}}>MEERA'S MEMORY</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Meera's "!" pop
const Bang: React.FC<{f: number}> = ({f}) => {
  if (f < 966 || f > 1010) return null;
  const s = kf(f, [[966, 0], [976, 1.1, E.back]]) * kf(f, [[1000, 1], [1010, 0]]);
  return (
    <div style={{position: "absolute", left: 120, top: 930, transform: `scale(${s})`, fontFamily: MONT, fontWeight: 900, fontSize: 200, color: "#fff", WebkitTextStroke: "14px #7a1f3f", paintOrder: "stroke fill", textShadow: "0 0 40px #C85C86"}}>!</div>
  );
};

// ---------------------------------------------------------------- The old phone (cracked) — Arjun remembers
const PhoneSilhouette: React.FC<{f: number}> = ({f}) => {
  if (f < 1296 || f > 1432) return null;
  const o = kf(f, [[1306, 0], [1326, 1], [1420, 1], [1430, 0]]);
  const crack = kf(f, [[1330, 0], [1392, 1, E.out]]);
  const flick = 0.75 + 0.25 * noise(f * 0.5);
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: "none"}}>
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.0) 10%, rgba(0,0,0,0.88) 75%)"}} />
      <div style={{position: "absolute", left: 540 - 200, top: 320, width: 400, height: 760, transform: `rotate(-9deg) scale(${1 + (f - 1326) * 0.0006})`}}>
        <svg viewBox="0 0 200 380" width={400} height={760} style={{overflow: "visible", filter: `drop-shadow(0 0 60px rgba(120,180,255,${0.5 * flick}))`}}>
          <rect x={4} y={4} width={192} height={372} rx={26} fill="#05070b" stroke={`rgba(150,200,255,${0.5 * flick})`} strokeWidth={3} />
          <rect x={14} y={16} width={172} height={348} rx={16} fill={`rgba(60,100,170,${0.18 * flick})`} />
          {/* cracks grow from the corner */}
          {[
            "M 186 16 L 150 80 L 160 130 L 118 190 L 126 250 L 80 330",
            "M 150 80 L 100 70 L 60 100 L 40 160",
            "M 118 190 L 70 200 L 40 250",
            "M 160 130 L 182 190 L 170 260",
            "M 126 250 L 160 300 L 150 354",
          ].map((d, i) => (
            <path key={i} d={d} fill="none" stroke={`rgba(220,236,255,${0.85 * flick})`} strokeWidth={2.4} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - clamp(crack * 1.4 - i * 0.12, 0, 1)} />
          ))}
          <circle cx={100} cy={20} r={3} fill="#000" />
        </svg>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 1130, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 44, letterSpacing: 8, color: "#ffe14a", opacity: kf(f, [[1340, 0], [1356, 1]]), textShadow: "0 0 24px #000"}}>DEV'S OLD PHONE</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- hook: rings + photo
const HookExtras: React.FC<{f: number}> = ({f}) => {
  if (f > 175) return null;
  const photo = kf(f, [[48, 0], [72, 1, E.out]]) * kf(f, [[150, 1], [170, 0]]);
  const rings = [{x: 800, t: 8}, {x: 215, t: 16}, {x: 940, t: 24}, {x: 395, t: 32}];
  return (
    <>
      {photo > 0.01 && (
        <div style={{position: "absolute", left: 540 - 150, top: 860 - 165 - (1 - photo) * -120, width: 300, height: 330, opacity: photo, transform: `rotate(${-3 + Math.sin(f * 0.08) * 1.2}deg) scale(${0.7 + 0.3 * photo})`, filter: "drop-shadow(0 0 30px rgba(255,255,255,0.35))"}}>
          <PhotoCard f={f} />
        </div>
      )}
      {rings.map((r, i) => {
        const p = pulse(f, r.t, 16);
        if (f < r.t || f > r.t + 24) return null;
        return <div key={i} style={{position: "absolute", left: r.x - 120 - p * 20, top: 780 - p * 20, width: 240 + p * 40, height: 340 + p * 40, borderRadius: 120, border: `4px solid rgba(255,255,255,${0.8 * p})`, boxShadow: "0 0 30px rgba(255,255,255,0.4)"}} />;
      })}
    </>
  );
};

export const MemoryLayer: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <Beams f={f} />
      <HookExtras f={f} />
      {IDS.map((id) => (
        <Panel key={id} id={id} f={f} />
      ))}
      <Timeline f={f} />
      {/* panels sit above the timeline backdrop */}
      {f >= 525 && f < 618 && IDS.map((id) => <Panel key={"t" + id} id={id} f={f} />)}
      <NoWitness f={f} />
      <ShoutOverlay f={f} />
      <Bang f={f} />
      <RecPanel f={f} />
      <PhoneSilhouette f={f} />
    </AbsoluteFill>
  );
};
