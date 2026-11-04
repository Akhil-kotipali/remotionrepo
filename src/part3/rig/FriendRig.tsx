import React from "react";
import {FRIEND_DESIGNS, FriendId} from "../stick/friendDesigns";
import {ik, rad, V2} from "../math";

/**
 * FriendRig — the articulated IK rig, generalised to ALL SIX friends.
 * Same colours / hair / accessories / proportions as your FriendStickFigure (viewBox 240x440),
 * but every joint is animatable: arms, legs, torso lean, head tilt, eyes, brows, mouth, blink, props.
 */
export type Prop = "none" | "phone" | "photo" | "camera" | "book";

export interface RigPose {
  lean: number;
  headTilt: number;
  hipX: number;
  hipY: number;
  handL: V2;
  handR: V2;
  footL: V2;
  footR: V2;
  eyeOpen: number;
  brow: number;
  mouth: number;
  lookX: number;
  lookY: number;
  blink: number;
  breath: number;
  prop: Prop;
  propAmt: number; // 0..1 scale-in
  photoSide: number; // 0 = back of photo, 1 = picture side (photo prop)
  glow: number; // phone screen light
}

export const REST: RigPose = {
  lean: 0, headTilt: 0, hipX: 0, hipY: 0,
  handL: [92, 214], handR: [148, 214], footL: [96, 416], footR: [144, 416],
  eyeOpen: 0.9, brow: 0, mouth: 0, lookX: 0, lookY: 0, blink: 0, breath: 0,
  prop: "none", propAmt: 0, photoSide: 0, glow: 0,
};

/** each friend's resting hand positions (matches their signature stance) */
export const STANCE: Record<FriendId, {handL: V2; handR: V2; footL: V2; footR: V2}> = {
  arjun: {handL: [92, 214], handR: [148, 214], footL: [96, 416], footR: [144, 416]},
  dev: {handL: [92, 222], handR: [132, 222], footL: [98, 416], footR: [142, 416]},
  rahul: {handL: [100, 220], handR: [140, 220], footL: [82, 416], footR: [158, 416]},
  meera: {handL: [90, 220], handR: [150, 220], footL: [104, 416], footR: [136, 416]},
  kabir: {handL: [88, 224], handR: [142, 206], footL: [106, 416], footR: [136, 416]},
  nisha: {handL: [90, 224], handR: [132, 222], footL: [94, 416], footR: [146, 416]},
};

export const stancePose = (id: FriendId): RigPose => ({...REST, ...STANCE[id]});

const DARK = "#141b10";

export const FriendRig: React.FC<{
  id: FriendId;
  pose: RigPose;
  width?: number;
  height?: number;
  rim?: number;
  cool?: number;
  jacket?: boolean;
  shadow?: boolean;
  mirror?: boolean;
}> = ({id, pose, width = 240, height = 440, rim = 0.2, cool = 0.14, jacket = false, shadow = true, mirror = false}) => {
  const d = FRIEND_DESIGNS[id];
  const broad = id === "rahul";
  const sw = broad ? 40 : 0;
  const strokeW = broad ? 26 : 20;
  const L1 = broad ? 62 : 58;
  const L2 = broad ? 70 : 58;

  const P: V2 = [120 + pose.hipX, 228 + pose.hipY];
  const a = rad(pose.lean);
  const rel = (x: number, y: number): V2 => [P[0] + x * Math.cos(a) - y * Math.sin(a), P[1] + x * Math.sin(a) + y * Math.cos(a)];
  const neck = rel(0, -130);
  const sL = rel(-sw, -120);
  const sR = rel(sw, -120);
  sL[1] += pose.breath * 0.7;
  sR[1] += pose.breath * 0.7;

  const ha = rad(pose.lean + pose.headTilt);
  const head: V2 = [neck[0] + Math.sin(ha) * 36, neck[1] - Math.cos(ha) * 36 + pose.breath];
  const R = 28;

  const AL = ik(sL, pose.handL, L1, L2, 1);
  const AR = ik(sR, pose.handR, L1, L2, -1);
  const LL = ik(P, pose.footL, 96, 96, 1);
  const RL = ik(P, pose.footR, 96, 96, -1);

  const path = (pts: V2[]) => "M" + pts.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" L");
  const legL = path([P, LL.elbow, LL.hand]);
  const legR = path([P, RL.elbow, RL.hand]);
  const torso = path([P, neck]);
  const armL = path([sL, AL.elbow, AL.hand]);
  const armR = path([sR, AR.elbow, AR.hand]);
  const limbs = broad ? [legL, legR, armL, armR] : [legL, legR, torso, armL, armR];

  const eo = Math.max(0.12, pose.eyeOpen * (1 - pose.blink));
  const lx = pose.lookX * 2.4;
  const ly = pose.lookY * 2.0;
  const faceShift = pose.lookX * 4.5;
  const browIn = -14 - pose.brow * 4;
  const browOut = -11 + pose.brow * 2.5;
  const gid = `rg-${id}`;
  const hid = `rh-${id}`;
  const hx = head[0];
  const hy = head[1];

  // props
  const mid: V2 = [(AL.hand[0] + AR.hand[0]) / 2, (AL.hand[1] + AR.hand[1]) / 2];
  const handAng = (Math.atan2(AR.hand[1] - AL.hand[1], AR.hand[0] - AL.hand[0]) * 180) / Math.PI;
  const handDist = Math.hypot(AR.hand[0] - AL.hand[0], AR.hand[1] - AL.hand[1]);

  return (
    <svg viewBox="0 0 240 440" width={width} height={height} style={{overflow: "visible", display: "block", transform: mirror ? "scaleX(-1)" : undefined}}>
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="60" y1="40" x2="190" y2="430">
          <stop offset="0%" stopColor={d.lightColor} />
          <stop offset="48%" stopColor={d.color} />
          <stop offset="100%" stopColor={d.shadowColor} />
        </linearGradient>
        <radialGradient id={hid} cx="36%" cy="32%" r="68%">
          <stop offset="0%" stopColor={d.lightColor} />
          <stop offset="55%" stopColor={d.color} />
          <stop offset="100%" stopColor={d.shadowColor} />
        </radialGradient>
        <radialGradient id={`rp-${id}`}>
          <stop offset="0%" stopColor="#9fd0ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#5a9bff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {shadow && <ellipse cx={120} cy={422} rx={50} ry={8} fill="#000" opacity={0.35} />}

      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {broad && (
          <polygon
            points={[rel(-42, -120), rel(42, -120), rel(18, 0), rel(-18, 0)].map((p) => p.join(",")).join(" ")}
            fill={`url(#${gid})`}
            stroke={`url(#${gid})`}
            strokeWidth={6}
            strokeLinejoin="round"
          />
        )}
        <g stroke={`url(#${gid})`} strokeWidth={strokeW}>
          {limbs.map((p, i) => (
            <path key={i} d={p} />
          ))}
        </g>
        <g stroke="#ffb467" strokeWidth={2.4} opacity={rim} transform="translate(-6.5,-1)">
          {limbs.map((p, i) => (
            <path key={i} d={p} />
          ))}
        </g>
        <g stroke="#9bbcff" strokeWidth={2.2} opacity={cool} transform="translate(6.5,0)">
          {limbs.map((p, i) => (
            <path key={i} d={p} />
          ))}
        </g>

        {/* Arjun's jacket (collar, zip, sleeves, hem) — the clue in Part 2 */}
        {jacket && (
          <g>
            <path d={path([rel(0, -118), rel(0, -14)])} stroke="#2f3d27" strokeWidth={27} />
            <path d={path([sL, AL.elbow])} stroke="#2f3d27" strokeWidth={24} />
            <path d={path([sR, AR.elbow])} stroke="#2f3d27" strokeWidth={24} />
            <path d={path([rel(0, -124), rel(0, -16)])} stroke="#b8d08f" strokeWidth={2} opacity={0.9} />
            <path d={path([rel(-12, -124), rel(0, -106), rel(12, -124)])} stroke="#b8d08f" strokeWidth={3} />
            <path d={path([rel(-13, -14), rel(13, -14)])} stroke="#b8d08f" strokeWidth={3} opacity={0.8} />
          </g>
        )}
      </g>

      {/* Arjun's satchel */}
      {id === "arjun" && (() => {
        const strapA = rel(-12, -124);
        const pouch = rel(24, -33);
        return (
          <>
            <path d={path([strapA, pouch])} stroke="#2E3C27" strokeWidth={4} strokeLinecap="round" />
            <g transform={`translate(${pouch[0]},${pouch[1]}) rotate(${pose.lean + 6})`}>
              <rect x={-10} y={-14} width={20} height={28} rx={4} fill="#24301E" stroke="#859969" strokeWidth={1.8} />
              <rect x={-8} y={-12} width={16} height={8} rx={2} fill="#3B4C33" />
              <line x1={-8} y1={-2} x2={8} y2={-2} stroke="#859969" strokeWidth={1.5} />
            </g>
          </>
        );
      })()}

      {/* head */}
      <circle cx={hx} cy={hy} r={R} fill={`url(#${hid})`} />

      <g transform={`rotate(${pose.lean + pose.headTilt} ${hx} ${hy})`}>
        {/* hair */}
        {id === "arjun" && (
          <g transform={`translate(${pose.lookX * 1.5},0)`}>
            <path d={`M${hx - 26} ${hy - 6} Q${hx - 32} ${hy - 26} ${hx - 16} ${hy - 30} Q${hx - 24} ${hy - 40} ${hx - 6} ${hy - 38} Q${hx} ${hy - 46} ${hx + 12} ${hy - 36} Q${hx + 28} ${hy - 42} ${hx + 24} ${hy - 26} Q${hx + 34} ${hy - 18} ${hx + 26} ${hy - 4} Q${hx + 14} ${hy - 14} ${hx} ${hy - 18} Q${hx - 14} ${hy - 12} ${hx - 26} ${hy - 6} Z`} fill="#1C2417" stroke="#A3BD82" strokeWidth={2.5} strokeLinejoin="round" />
            <path d={`M${hx - 18} ${hy - 26} Q${hx - 8} ${hy - 34} ${hx + 8} ${hy - 30}`} fill="none" stroke="#A3BD82" strokeWidth={2.5} strokeLinecap="round" />
          </g>
        )}
        {id === "dev" && (
          <g>
            {[[-20, -16, 11], [-14, -26, 12], [0, -30, 13], [14, -26, 12], [20, -16, 11]].map(([x, y, r], i) => (
              <circle key={i} cx={hx + x} cy={hy + y} r={r} fill="#0E1724" stroke="#60A5FA" strokeWidth={2} />
            ))}
          </g>
        )}
        {id === "rahul" && (
          <path d={`M${hx - 26} ${hy - 8} Q${hx - 28} ${hy - 28} ${hx - 12} ${hy - 30} Q${hx} ${hy - 33} ${hx + 14} ${hy - 30} Q${hx + 28} ${hy - 28} ${hx + 26} ${hy - 8} Q${hx + 14} ${hy - 18} ${hx} ${hy - 20} Q${hx - 14} ${hy - 18} ${hx - 26} ${hy - 8} Z`} fill="#2E1208" stroke="#FB923C" strokeWidth={2} />
        )}
        {id === "meera" && (
          <g>
            <path d={`M${hx - 28} ${hy + 12} Q${hx - 38} ${hy - 24} ${hx - 20} ${hy - 34} Q${hx} ${hy - 38} ${hx + 20} ${hy - 34} Q${hx + 38} ${hy - 24} ${hx + 34} ${hy + 18} Q${hx + 44} ${hy + 60} ${hx + 36} ${hy + 120} Q${hx + 28} ${hy + 175} ${hx + 14} ${hy + 190} Q${hx + 16} ${hy + 140} ${hx + 24} ${hy + 90} Q${hx + 26} ${hy + 24} ${hx + 22} ${hy - 2} Q${hx} ${hy - 10} ${hx - 22} ${hy - 2} Q${hx - 26} ${hy + 24} ${hx - 28} ${hy + 12} Z`} fill="#220713" stroke="#F472B6" strokeWidth={2} />
            <path d={`M${hx - 16} ${hy - 26} Q${hx + 6} ${hy - 32} ${hx + 22} ${hy - 22}`} fill="none" stroke="#F472B6" strokeWidth={2.5} strokeLinecap="round" />
          </g>
        )}
        {id === "kabir" && (
          <path d={`M${hx - 25} ${hy - 10} Q${hx - 26} ${hy - 28} ${hx - 8} ${hy - 30} Q${hx + 6} ${hy - 33} ${hx + 20} ${hy - 28} Q${hx + 26} ${hy - 18} ${hx + 25} ${hy - 8} Z`} fill="#0F2022" stroke="#2DD4BF" strokeWidth={2} />
        )}
        {id === "nisha" && (
          <g>
            <path d={`M${hx - 28} ${hy + 14} Q${hx - 32} ${hy - 28} ${hx} ${hy - 32} Q${hx + 32} ${hy - 28} ${hx + 28} ${hy + 14} Q${hx + 24} ${hy + 8} ${hx + 18} ${hy - 2} Q${hx + 6} ${hy - 6} ${hx - 4} ${hy - 2} Q${hx - 16} ${hy + 4} ${hx - 24} ${hy + 12} Z`} fill="#261B06" stroke="#FACC15" strokeWidth={2} />
            <path d={`M${hx - 20} ${hy - 14} Q${hx - 4} ${hy - 2} ${hx + 14} ${hy + 4}`} fill="none" stroke="#FACC15" strokeWidth={2} strokeLinecap="round" />
          </g>
        )}

        {/* face */}
        <g transform={`translate(${hx + faceShift},${hy + 3})`}>
          {[-1, 1].map((s) => (
            <g key={s}>
              <ellipse cx={s * 9.5} cy={1} rx={5.4} ry={6.6 * eo} fill="#f2f5e9" />
              <circle cx={s * 9.5 + lx} cy={1 + ly} r={2.7} fill="#121a0d" opacity={eo > 0.2 ? 1 : 0} />
              <circle cx={s * 9.5 + lx + 0.9} cy={1 + ly - 0.9} r={0.9} fill="#fff" opacity={eo > 0.4 ? 0.9 : 0} />
              <line x1={s * 15.5} y1={s === -1 ? browOut : browIn} x2={s * 4} y2={s === -1 ? browIn : browOut} stroke={DARK} strokeWidth={3} strokeLinecap="round" />
            </g>
          ))}
          {pose.mouth >= 0 ? (
            <ellipse cx={0} cy={16} rx={3.4 + pose.mouth * 1.6} ry={1 + pose.mouth * 5} fill={DARK} />
          ) : (
            <path d={`M-7 18 Q0 ${18 + pose.mouth * 7} 7 18`} fill="none" stroke={DARK} strokeWidth={2.6} strokeLinecap="round" />
          )}
        </g>

        {/* Kabir's glasses sit over the eyes */}
        {id === "kabir" && (
          <g>
            <rect x={hx - 25} y={hy - 5} width={22} height={18} rx={4} fill="rgba(45,212,191,0.22)" stroke="#071314" strokeWidth={3.5} />
            <rect x={hx + 3} y={hy - 5} width={22} height={18} rx={4} fill="rgba(45,212,191,0.22)" stroke="#071314" strokeWidth={3.5} />
            <line x1={hx - 3} y1={hy + 3} x2={hx + 3} y2={hy + 3} stroke="#071314" strokeWidth={3.5} />
            <line x1={hx - 20} y1={hy - 2} x2={hx - 11} y2={hy + 8} stroke="#fff" strokeWidth={2.2} strokeLinecap="round" opacity={0.8} />
            <line x1={hx + 8} y1={hy - 2} x2={hx + 17} y2={hy + 8} stroke="#fff" strokeWidth={2.2} strokeLinecap="round" opacity={0.8} />
          </g>
        )}
      </g>

      {/* Kabir's book */}
      {id === "kabir" && pose.prop === "book" && (
        <g transform={`translate(${AR.hand[0] + 6},${AR.hand[1] - 8}) rotate(8)`}>
          <rect x={-11} y={-18} width={22} height={34} rx={3} fill="#0E2124" stroke="#469FA5" strokeWidth={2} />
          <line x1={-5} y1={-8} x2={5} y2={-8} stroke="#fff" strokeWidth={1.5} opacity={0.8} />
          <line x1={-5} y1={-2} x2={5} y2={-2} stroke="#fff" strokeWidth={1.5} opacity={0.8} />
        </g>
      )}

      {/* PHONE (right hand) */}
      {pose.prop === "phone" && pose.propAmt > 0.02 && (
        <g transform={`translate(${AR.hand[0]},${AR.hand[1] - 16}) rotate(-10) scale(${pose.propAmt})`}>
          <circle r={60} fill={`url(#rp-${id})`} opacity={pose.glow * 0.8} />
          <rect x={-12} y={-22} width={24} height={44} rx={5} fill="#0b0f16" stroke={`rgba(140,190,255,${0.35 + pose.glow * 0.6})`} strokeWidth={1.8} />
          <rect x={-9.5} y={-19} width={19} height={38} rx={3} fill={`rgba(110,175,255,${0.1 + pose.glow * 0.75})`} />
        </g>
      )}

      {/* PHOTOGRAPH held between both hands */}
      {pose.prop === "photo" && pose.propAmt > 0.02 && (
        <g transform={`translate(${mid[0]},${mid[1] - 6}) rotate(${handAng}) scale(${pose.propAmt})`}>
          <rect x={-Math.max(30, handDist / 2 + 12)} y={-27} width={Math.max(60, handDist + 24)} height={54} rx={2.5} fill="#e9e2cf" stroke="#bdb59f" strokeWidth={1.4} />
          {pose.photoSide > 0.5 ? (
            <g>
              <rect x={-Math.max(26, handDist / 2 + 8)} y={-23} width={Math.max(52, handDist + 16)} height={40} fill="#162033" />
              <path d="M-14 6 L-14 -8 L-2 -16 L12 -8 L12 6 Z" fill="#2a3a55" />
              {[-16, -8, 0, 8, 16].map((x) => (
                <circle key={x} cx={x} cy={9} r={2.2} fill="#cfd8e6" />
              ))}
            </g>
          ) : (
            <g opacity={0.5}>
              <line x1={-18} y1={-8} x2={18} y2={-8} stroke="#b7ae96" strokeWidth={1} />
              <line x1={-18} y1={0} x2={10} y2={0} stroke="#b7ae96" strokeWidth={1} />
            </g>
          )}
        </g>
      )}

      {/* CAMERA (Meera) */}
      {pose.prop === "camera" && pose.propAmt > 0.02 && (
        <g transform={`translate(${mid[0]},${mid[1]}) rotate(${handAng * 0.4}) scale(${pose.propAmt})`}>
          <rect x={-30} y={-17} width={60} height={34} rx={6} fill="#10131a" stroke="#6b7385" strokeWidth={2} />
          <rect x={-18} y={-23} width={20} height={9} rx={3} fill="#1b2029" stroke="#6b7385" strokeWidth={1.6} />
          <circle cx={0} cy={0} r={13} fill="#0a0c10" stroke="#8892a6" strokeWidth={3} />
          <circle cx={0} cy={0} r={7} fill="#26364f" />
          <circle cx={-3} cy={-3} r={2.4} fill="#cfe3ff" opacity={0.8} />
          <rect x={20} y={-12} width={6} height={5} rx={1.5} fill="#ff4d5a" opacity={0.8} />
        </g>
      )}
    </svg>
  );
};
