import React from "react";
import {Img, staticFile} from "remotion";
import {FriendRig, RigPose, stancePose} from "./rig/FriendRig";
import {FriendId} from "./stick/friendDesigns";
import {MONO, MONT} from "./fonts";
import {E, clamp, kf, noise, pulse} from "./math";

export const PW = 900; // memory panel inner size
export const PH = 700;

/** a small walking stick-figure for the memory scenes (front-view shuffle toward `dir`) */
export const MiniFig: React.FC<{id: FriendId; x: number; feet: number; h: number; t: number; walk?: number; dir?: 1 | -1; pose?: Partial<RigPose>; filter?: string; opacity?: number}> = ({id, x, feet, h, t, walk = 1, dir = -1, pose, filter, opacity = 1}) => {
  const k = h / 440;
  const st = stancePose(id);
  const ph = t * 0.33;
  const amp = 9 * walk;
  const p: RigPose = {
    ...st,
    lean: 4 * dir * walk,
    lookX: dir * 0.9,
    footL: [st.footL[0] + amp * Math.sin(ph), 416 - 13 * walk * Math.max(0, Math.cos(ph))],
    footR: [st.footR[0] + amp * Math.sin(ph + Math.PI), 416 - 13 * walk * Math.max(0, Math.cos(ph + Math.PI))],
    hipY: walk * Math.abs(Math.sin(ph)) * 3,
    breath: Math.sin(t * 0.1) * 1.2,
    ...pose,
  };
  return (
    <div style={{position: "absolute", left: x - (240 * k) / 2, top: feet - 416 * k, width: 240 * k, height: h, filter, opacity}}>
      <FriendRig id={id} pose={p} width={240 * k} height={h} rim={0.1} cool={0.1} />
    </div>
  );
};

const Plate: React.FC<{src: string; w: number; left: number; top: number; filter?: string; scale?: number; ox?: number; oy?: number}> = ({src, w, left, top, filter, scale = 1, ox = 0, oy = 0}) => (
  <Img src={staticFile(`backgrounds/${src}`)} style={{position: "absolute", left, top, width: w, height: (w * 2752) / 1536, filter, transform: `scale(${scale})`, transformOrigin: `${ox}px ${oy}px`}} />
);

const Tint: React.FC<{c: string; o?: number}> = ({c, o = 0.3}) => <div style={{position: "absolute", inset: 0, background: c, mixBlendMode: "color", opacity: o}} />;
const Vig: React.FC = () => <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.65) 100%)"}} />;
const Chip: React.FC<{text: string; color: string}> = ({text, color}) => (
  <div style={{position: "absolute", left: 28, bottom: 26, fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: "#fff", background: "rgba(0,0,0,0.66)", border: `3px solid ${color}`, padding: "8px 20px", borderRadius: 8}}>{text}</div>
);

// ---------------------------------------------------------------- RAHUL: Dev leaves alone
export const RahulScene: React.FC<{t: number}> = ({t}) => {
  const x = kf(t, [[6, 600], [78, 120, E.soft]]);
  const walk = kf(t, [[4, 0], [10, 1], [70, 1], [82, 0]]);
  const glow = 0.5 + 0.2 * Math.sin(t * 0.2);
  return (
    <div style={{position: "absolute", inset: 0, background: "#05080d"}}>
      <Plate src="exterior.jpg" w={1100} left={-86 - t * 0.2} top={-816} filter="saturate(0.85) brightness(0.9)" scale={1 + t * 0.0006} />
      <div style={{position: "absolute", left: 520, top: 190, width: 160, height: 300, background: `radial-gradient(ellipse, rgba(255,190,110,${glow * 0.45}), rgba(255,190,110,0))`, mixBlendMode: "screen"}} />
      <MiniFig id="dev" x={x} feet={600} h={360} t={t} walk={walk} dir={-1} />
      <Tint c="#E0814F" o={0.3} />
      <Vig />
      <Chip text="DEV LEAVES · ALONE" color="#E0814F" />
    </div>
  );
};

// ---------------------------------------------------------------- MEERA: Arjun follows
export const MeeraScene: React.FC<{t: number}> = ({t}) => {
  const dx = kf(t, [[4, 620], [60, 250, E.soft]]);
  const ax = kf(t, [[14, 700], [66, 380, E.soft]]);
  const wd = kf(t, [[2, 0], [8, 1], [54, 1], [64, 0]]);
  const wa = kf(t, [[12, 0], [18, 1], [60, 1], [70, 0]]);
  return (
    <div style={{position: "absolute", inset: 0, background: "#05080d"}}>
      <Plate src="exterior.jpg" w={960} left={-40 + t * 0.15} top={-690} filter="saturate(0.8) brightness(0.85)" />
      <MiniFig id="dev" x={dx} feet={560} h={250} t={t} walk={wd} dir={-1} opacity={clamp(t / 5, 0, 1)} />
      <MiniFig id="arjun" x={ax} feet={575} h={268} t={t + 8} walk={wa} dir={-1} opacity={clamp((t - 12) / 5, 0, 1)} pose={{prop: "none"}} />
      {/* her viewfinder */}
      {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b], i) => (
        <div key={i} style={{position: "absolute", left: a ? PW - 76 : 42, top: b ? PH - 80 : 42, width: 36, height: 36, borderTop: b ? undefined : "4px solid rgba(255,255,255,0.85)", borderBottom: b ? "4px solid rgba(255,255,255,0.85)" : undefined, borderLeft: a ? undefined : "4px solid rgba(255,255,255,0.85)", borderRight: a ? "4px solid rgba(255,255,255,0.85)" : undefined}} />
      ))}
      <Tint c="#C85C86" o={0.34} />
      <Vig />
      <Chip text="ARJUN FOLLOWS HIM" color="#C85C86" />
    </div>
  );
};

// ---------------------------------------------------------------- KABIR: heard, not seen
export const KabirScene: React.FC<{t: number}> = ({t}) => {
  const bars = Array.from({length: 38}, (_, i) => {
    const a = Math.abs(Math.sin(t * 0.35 + i * 0.7) * Math.sin(t * 0.13 + i * 1.9)) * (0.4 + 0.6 * Math.abs(noise(i * 0.7 + t * 0.05)));
    return a;
  });
  const words = ["YOU—", "NO!", "LISTEN—", "STOP—", "WHY?!"];
  const wi = Math.floor(t / 7) % words.length;
  return (
    <div style={{position: "absolute", inset: 0, background: "#05080d"}}>
      <Plate src="hallway.jpg" w={900} left={0} top={-560} filter="blur(5px) brightness(0.8) saturate(0.7)" />
      {/* two shapes behind a wall, arguing — impossible to identify */}
      {[0, 1].map((i) => {
        const x = 560 + i * 150 + Math.sin(t * 0.3 + i) * 12;
        return (
          <div key={i} style={{position: "absolute", left: x - 90, top: 150, filter: "brightness(0) blur(3px)", opacity: 0.7, transform: `skewX(${-8 + i * 16}deg)`}}>
            <FriendRig id={i ? "dev" : "arjun"} pose={{...stancePose("arjun"), handL: [60 + Math.sin(t * 0.8 + i) * 30, 130], handR: [180 + Math.sin(t * 0.9 + i * 2) * 30, 120 - 20 * Math.abs(Math.sin(t * 0.5))], lean: Math.sin(t * 0.4 + i) * 6}} width={180} height={330} shadow={false} rim={0} cool={0} />
          </div>
        );
      })}
      {/* jagged shout bubbles */}
      {[0, 1].map((i) => (
        <div key={i} style={{position: "absolute", left: 120 + i * 360, top: 130 + i * 70, transform: `rotate(${-6 + i * 10}deg) scale(${0.92 + 0.08 * Math.sin(t * 0.7 + i)})`, fontFamily: MONT, fontWeight: 900, fontSize: 64, color: "#fff", WebkitTextStroke: "10px #04161a", paintOrder: "stroke fill", opacity: 0.55 + 0.4 * Math.abs(Math.sin(t * 0.5 + i * 2)), textShadow: "0 0 24px #46B5BD"}}>
          {words[(wi + i * 2) % words.length]}
        </div>
      ))}
      {/* the sound */}
      <div style={{position: "absolute", left: 40, right: 40, top: 480, height: 150, display: "flex", alignItems: "center", gap: 6}}>
        {bars.map((a, i) => (
          <div key={i} style={{flex: 1, height: 14 + a * 140, borderRadius: 6, background: "linear-gradient(#7ff3ff,#46B5BD)", boxShadow: "0 0 12px #46B5BD"}} />
        ))}
      </div>
      <Tint c="#46B5BD" o={0.4} />
      <Vig />
      <Chip text="HEARD · NOT SEEN" color="#46B5BD" />
    </div>
  );
};

// ---------------------------------------------------------------- NISHA: "Don't touch me!"
export const NishaScene: React.FC<{t: number}> = ({t}) => {
  const shout = pulse(t, 66, 40);
  const who = Math.floor(t / 7) % 2 === 0;
  return (
    <div style={{position: "absolute", inset: 0, background: "#05080d"}}>
      <Plate src="memory_space.jpg" w={900} left={0} top={-560} filter="brightness(0.9)" />
      {/* a figure we can't identify — flickers between two people */}
      <div style={{position: "absolute", left: 360, top: 130, filter: "brightness(0.25) blur(1px)", opacity: 0.85}}>
        <FriendRig id={t > 62 ? (who ? "dev" : "arjun") : "dev"} pose={{...stancePose("dev"), handL: [70, 150 - shout * 30], handR: [170, 150 - shout * 30]}} width={190} height={350} shadow={false} rim={0} cool={0} />
      </div>
      {t > 62 && (
        <svg width={PW} height={PH} style={{position: "absolute", inset: 0, opacity: 0.9}}>
          {[0, 1, 2].map((r) => (
            <circle key={r} cx={455} cy={260} r={((t - 66 + r * 10) % 40) * 12 + 20} fill="none" stroke="#EAC24B" strokeWidth={5} opacity={0.6 - ((t - 66 + r * 10) % 40) / 70} />
          ))}
        </svg>
      )}
      {t > 104 && (
        <div style={{position: "absolute", right: 36, top: 36, fontFamily: MONO, fontWeight: 700, fontSize: 54, color: "#ff4d5a", letterSpacing: 6, opacity: kf(t, [[104, 0], [112, 1]]) * (0.6 + 0.4 * Math.abs(Math.sin(t * 0.5)))}}>WHO?</div>
      )}
      <Tint c="#EAC24B" o={0.28} />
      <Vig />
      <Chip text="“DON'T TOUCH ME!”" color="#EAC24B" />
    </div>
  );
};

// ---------------------------------------------------------------- MEERA (2nd memory): Dev places his phone
export const RecScene: React.FC<{t: number}> = ({t}) => {
  // t = frames since 1000
  const walkIn = kf(t, [[32, -80], [80, 560, E.soft]]);
  const walkBack = kf(t, [[118, 0], [160, 1, E.soft]]);
  const devX = t < 118 ? walkIn : 560 - (560 - 470) * walkBack;
  const wDev = kf(t, [[32, 0], [38, 1], [76, 1], [84, 0]]) + kf(t, [[118, 0], [124, 1], [152, 1], [162, 0]]);
  const crouch = kf(t, [[82, 0], [96, 1, E.out], [104, 1], [116, 0]]);
  const hold = t < 100 ? 1 : 0;
  const phoneX = 640;
  const recOn = t >= 108;
  const zoom = kf(t, [[209, 1], [262, 1.9, E.inOut]]);
  const groupIn = (i: number) => kf(t, [[112 + i * 8, 0], [150 + i * 8, 1, E.soft]]);
  const rec = (Math.floor((t - 108) / 12) % 2) === 0;
  const secs = Math.max(0, Math.floor((t - 108) / 30));
  const crouchPose: Partial<RigPose> = {
    hipY: 90 * crouch,
    lean: 10 * crouch,
    handR: crouch > 0.01 ? [120 + 66 * crouch, 220 + 78 * crouch] : [150, 196],
    handL: [92, 206],
    prop: hold ? "phone" : "none",
    propAmt: hold ? 1 : 0,
    glow: 0.7,
    lookY: 0.4 * crouch,
  };
  const groupPos = [{id: "rahul" as FriendId, x: 110}, {id: "kabir" as FriendId, x: 215}, {id: "nisha" as FriendId, x: 320}, {id: "arjun" as FriendId, x: 425}];
  return (
    <div style={{position: "absolute", inset: 0, background: "#05080d", overflow: "hidden"}}>
      <div style={{position: "absolute", inset: 0, transformOrigin: `${phoneX}px 520px`, transform: `scale(${zoom})`}}>
        <Plate src="hallway.jpg" w={900} left={0} top={-640} filter="saturate(0.85) brightness(0.9)" />
        {/* the phone, leaning on the wall, light cone toward the group */}
        {t >= 94 && (
          <div style={{position: "absolute", left: phoneX - 40, top: 500}}>
            <div style={{position: "absolute", left: -330, top: -30, width: 360, height: 130, background: `linear-gradient(90deg, rgba(120,190,255,0), rgba(120,190,255,${recOn ? 0.2 : 0.05}))`, clipPath: "polygon(100% 40%, 0% 0%, 0% 100%, 100% 60%)", mixBlendMode: "screen"}} />
            <svg width={80} height={110} viewBox="-40 -55 80 110" style={{overflow: "visible", transform: "rotate(-14deg)"}}>
              <rect x={-24} y={-46} width={48} height={92} rx={8} fill="#0b0f16" stroke={`rgba(150,200,255,${recOn ? 0.9 : 0.4})`} strokeWidth={3} />
              <rect x={-20} y={-42} width={40} height={84} rx={5} fill={`rgba(70,120,190,${recOn ? 0.55 : 0.2})`} />
              {recOn && rec && <circle cx={0} cy={-26} r={6} fill="#ff2e4d" />}
            </svg>
          </div>
        )}
        {/* Dev */}
        <MiniFig id="dev" x={devX} feet={600} h={330} t={t} walk={Math.min(1, wDev)} dir={1} pose={crouchPose} opacity={t >= 32 ? 1 : 0} />
        {/* the others join him */}
        {groupPos.map((g, i) => (
          <MiniFig key={g.id} id={g.id} x={g.x - (1 - groupIn(i)) * 330} feet={606 - i * 3} h={318} t={t + i * 5} walk={groupIn(i) < 1 && groupIn(i) > 0 ? 1 : 0} dir={1} opacity={groupIn(i) > 0 ? 1 : 0} pose={{lookX: 0.8, mouth: 0.2, brow: 0, prop: "none", propAmt: 0}} />
        ))}
      </div>
      {recOn && (
        <div style={{position: "absolute", right: 30, top: 28, display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: "#fff", background: "rgba(0,0,0,0.6)", padding: "8px 18px", borderRadius: 8}}>
          <div style={{width: 20, height: 20, borderRadius: "50%", background: rec ? "#ff2e4d" : "#4a1219"}} />
          REC 00:0{Math.min(9, secs)}
        </div>
      )}
      {t >= 209 && (
        <div style={{position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 44, letterSpacing: 6, color: "#ffe14a", opacity: kf(t, [[214, 0], [228, 1]]), textShadow: "0 0 20px #000"}}>HIS OLD PHONE</div>
      )}
      <Tint c="#C85C86" o={0.22} />
      <Vig />
      <Chip text={t >= 209 ? "WHERE IS IT NOW?" : "DEV · PHONE · WALL"} color="#C85C86" />
    </div>
  );
};
