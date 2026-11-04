import React from "react";
import {FRIEND_DESIGNS} from "../stick/friendDesigns";
import {ik, rad, V2} from "../math";

/**
 * ArjunRig — an articulated, IK-driven version of your FriendStickFigure "Arjun".
 * Same colours, same hair, same satchel, same proportions (viewBox 240x440) —
 * but every joint is animatable, so he can raise a phone, recoil, walk, shake his head, blink.
 * (The same pattern works for the other five: copy this file, swap the hair + accessory.)
 */
export interface ArjunPose {
  lean: number; // torso rotation, degrees (+ = top leans screen-right)
  headTilt: number; // extra head rotation, degrees
  hipX: number; // weight shift (viewBox units)
  hipY: number; // crouch / bob
  handL: V2; // hand targets in viewBox coords (IK solves elbows)
  handR: V2;
  footL: V2;
  footR: V2;
  eyeOpen: number; // 0..1.2
  brow: number; // -1..1  (+ = worried / inner brows up)
  mouth: number; // -1..1  (- = frown, + = open/gasp)
  lookX: number; // -1..1
  lookY: number; // -1..1
  blink: number; // 0..1
  breath: number; // px offset for chest/head
  phone: number; // 0..1 scale of the phone in the right hand
  phoneGlow: number; // 0..1 screen light
}

export const REST_POSE: ArjunPose = {
  lean: 0,
  headTilt: 0,
  hipX: 0,
  hipY: 0,
  handL: [92, 214],
  handR: [148, 214],
  footL: [96, 416],
  footR: [144, 416],
  eyeOpen: 0.9,
  brow: 0,
  mouth: 0,
  lookX: 0,
  lookY: 0,
  blink: 0,
  breath: 0,
  phone: 0,
  phoneGlow: 0,
};

const d = FRIEND_DESIGNS.arjun;
const DARK = "#141b10";

export const ArjunRig: React.FC<{
  pose: ArjunPose;
  width?: number;
  height?: number;
  rim?: number; // warm back-light amount 0..1
  cool?: number; // cool moon-light amount 0..1
  shadow?: boolean;
}> = ({pose, width = 327, height = 600, rim = 0.55, cool = 0.35, shadow = true}) => {
  const P: V2 = [120 + pose.hipX, 228 + pose.hipY];
  const a = rad(pose.lean);
  const rel = (x: number, y: number): V2 => [
    P[0] + x * Math.cos(a) - y * Math.sin(a),
    P[1] + x * Math.sin(a) + y * Math.cos(a),
  ];
  const neck = rel(0, -130);
  const shoulder = rel(0, -120);
  shoulder[1] += pose.breath * 0.7;

  const ha = rad(pose.lean + pose.headTilt);
  const head: V2 = [neck[0] + Math.sin(ha) * 36, neck[1] - Math.cos(ha) * 36 + pose.breath];
  const R = 28;

  const L = ik(shoulder, pose.handL, 58, 58, 1);
  const Rr = ik(shoulder, pose.handR, 58, 58, -1);

  // Organic, sleek stick limbs:
  // Smooth curved arm paths (no harsh elbow polygon corners)
  const armL = `M${shoulder[0].toFixed(2)},${shoulder[1].toFixed(2)} Q${L.elbow[0].toFixed(2)},${L.elbow[1].toFixed(2)} ${L.hand[0].toFixed(2)},${L.hand[1].toFixed(2)}`;
  const armR = `M${shoulder[0].toFixed(2)},${shoulder[1].toFixed(2)} Q${Rr.elbow[0].toFixed(2)},${Rr.elbow[1].toFixed(2)} ${Rr.hand[0].toFixed(2)},${Rr.hand[1].toFixed(2)}`;

  // Clean, confident legs:
  // Straight lines at rest (matches the canonical 2D character model),
  // with gentle forward curve when stepping/compressed (no sideways grasshopper kink).
  const makeLeg = (start: V2, foot: V2) => {
    const dist = Math.hypot(foot[0] - start[0], foot[1] - start[1]);
    const compression = Math.max(0, 188 - dist);
    if (compression < 0.5) {
      return `M${start[0].toFixed(2)},${start[1].toFixed(2)} L${foot[0].toFixed(2)},${foot[1].toFixed(2)}`;
    }
    const midX = (start[0] + foot[0]) / 2 + compression * 0.4;
    const midY = (start[1] + foot[1]) / 2 - compression * 0.15;
    return `M${start[0].toFixed(2)},${start[1].toFixed(2)} Q${midX.toFixed(2)},${midY.toFixed(2)} ${foot[0].toFixed(2)},${foot[1].toFixed(2)}`;
  };
  const legL = makeLeg(P, pose.footL);
  const legR = makeLeg(P, pose.footR);
  const torso = `M${P[0].toFixed(2)},${P[1].toFixed(2)} L${neck[0].toFixed(2)},${neck[1].toFixed(2)}`;

  const limbs = [legL, legR, torso, armL, armR];
  const path = (pts: V2[]) => "M" + pts.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" L");

  // satchel
  const strapA = rel(-12, -124);
  const pouch = rel(24, -33);
  const pouchRot = pose.lean + 6;

  // phone
  const ph = Rr.hand;
  const fa = Math.atan2(Rr.hand[1] - Rr.elbow[1], Rr.hand[0] - Rr.elbow[0]);
  const phoneRot = -10 + (ph[0] - 130) * 0.25 + (fa * 180) / Math.PI * 0.05;

  // eyes
  const eyeY = 1;
  const eo = Math.max(0.12, pose.eyeOpen * (1 - pose.blink));
  const lx = pose.lookX * 2.4;
  const ly = pose.lookY * 2.0;
  const faceShift = pose.lookX * 4.5;

  const browIn = -14 - pose.brow * 4;
  const browOut = -11 + pose.brow * 2.5;

  return (
    <svg viewBox="0 0 240 440" width={width} height={height} style={{overflow: "visible", display: "block"}}>
      <defs>
        <linearGradient id="aj-grad" gradientUnits="userSpaceOnUse" x1="60" y1="40" x2="190" y2="430">
          <stop offset="0%" stopColor={d.lightColor} />
          <stop offset="48%" stopColor={d.color} />
          <stop offset="100%" stopColor={d.shadowColor} />
        </linearGradient>
        <radialGradient id="aj-head" cx="36%" cy="32%" r="68%">
          <stop offset="0%" stopColor={d.lightColor} />
          <stop offset="55%" stopColor={d.color} />
          <stop offset="100%" stopColor={d.shadowColor} />
        </radialGradient>
        <radialGradient id="aj-phoneglow">
          <stop offset="0%" stopColor="#9fd0ff" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#5a9bff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#5a9bff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="aj-chin-glow" cx="50%" cy="100%" r="65%">
          <stop offset="0%" stopColor="#8ec5fc" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#8ec5fc" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#8ec5fc" stopOpacity="0" />
        </radialGradient>
        <clipPath id="aj-headclip">
          <circle cx={head[0]} cy={head[1]} r={R} />
        </clipPath>
      </defs>

      {shadow && <ellipse cx={120} cy={422} rx={50} ry={8} fill="#000" opacity={0.35} />}

      {/* body */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g stroke="url(#aj-grad)" strokeWidth={20}>
          {limbs.map((p, i) => (
            <path key={i} d={p} />
          ))}
        </g>
        {/* warm back-light rim (lamp, screen-left) */}
        <g stroke="#ffb467" strokeWidth={2.4} opacity={rim} transform="translate(-6.5,-1)">
          {limbs.map((p, i) => (
            <path key={i} d={p} />
          ))}
        </g>
        {/* cool moon rim (window, screen-right) */}
        <g stroke="#9bbcff" strokeWidth={2.2} opacity={cool} transform="translate(6.5,0)">
          {limbs.map((p, i) => (
            <path key={i} d={p} />
          ))}
        </g>
      </g>

      {/* satchel */}
      <path d={path([strapA, pouch])} stroke="#2E3C27" strokeWidth={4} strokeLinecap="round" />
      <g transform={`translate(${pouch[0]},${pouch[1]}) rotate(${pouchRot})`}>
        <rect x={-10} y={-14} width={20} height={28} rx={4} fill="#24301E" stroke="#859969" strokeWidth={1.8} />
        <rect x={-8} y={-12} width={16} height={8} rx={2} fill="#3B4C33" />
        <line x1={-8} y1={-2} x2={8} y2={-2} stroke="#859969" strokeWidth={1.5} />
      </g>

      {/* head */}
      <circle cx={head[0]} cy={head[1]} r={R} fill="url(#aj-head)" />
      {pose.phone > 0.05 && pose.phoneGlow > 0.02 && (
        <g clipPath="url(#aj-headclip)">
          <circle
            cx={head[0]}
            cy={head[1] + 28}
            r={30}
            fill="url(#aj-chin-glow)"
            opacity={pose.phoneGlow * 0.7}
            style={{mixBlendMode: "screen"}}
          />
        </g>
      )}

      <g transform={`rotate(${pose.lean + pose.headTilt} ${head[0]} ${head[1]})`}>
        {/* messy hair — identical outline to your FriendStickFigure */}
        <g transform={`translate(${pose.lookX * 1.5},0)`}>
          {(() => {
            const hx = head[0];
            const hy = head[1];
            return (
              <>
                <path
                  d={`M${hx - 26} ${hy - 6} Q${hx - 32} ${hy - 26} ${hx - 16} ${hy - 30} Q${hx - 24} ${hy - 40} ${hx - 6} ${hy - 38} Q${hx} ${hy - 46} ${hx + 12} ${hy - 36} Q${hx + 28} ${hy - 42} ${hx + 24} ${hy - 26} Q${hx + 34} ${hy - 18} ${hx + 26} ${hy - 4} Q${hx + 14} ${hy - 14} ${hx} ${hy - 18} Q${hx - 14} ${hy - 12} ${hx - 26} ${hy - 6} Z`}
                  fill="#1C2417"
                  stroke="#A3BD82"
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                />
                <path
                  d={`M${hx - 18} ${hy - 26} Q${hx - 8} ${hy - 34} ${hx + 8} ${hy - 30}`}
                  fill="none"
                  stroke="#A3BD82"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </>
            );
          })()}
        </g>

        {/* face */}
        <g transform={`translate(${head[0] + faceShift},${head[1] + 3})`}>
          {[-1, 1].map((s) => (
            <g key={s}>
              <ellipse cx={s * 9.5} cy={eyeY} rx={5.4} ry={6.6 * eo} fill="#f2f5e9" />
              <circle cx={s * 9.5 + lx} cy={eyeY + ly} r={2.7} fill="#121a0d" opacity={eo > 0.2 ? 1 : 0} />
              <circle cx={s * 9.5 + lx + 0.9} cy={eyeY + ly - 0.9} r={0.9} fill="#fff" opacity={eo > 0.4 ? 0.9 : 0} />
              <line
                x1={s * 15.5}
                y1={browOut}
                x2={s * 4}
                y2={browIn}
                stroke={DARK}
                strokeWidth={3}
                strokeLinecap="round"
              />
            </g>
          ))}
          {pose.mouth > 0.1 ? (
            <ellipse cx={0} cy={16} rx={3.2 + pose.mouth * 2} ry={1.5 + pose.mouth * 5} fill={DARK} />
          ) : pose.mouth < -0.1 ? (
            <path d={`M-6 18 Q0 ${18 + pose.mouth * 8} 6 18`} fill="none" stroke={DARK} strokeWidth={2.4} strokeLinecap="round" />
          ) : (
            <line x1={-5} y1={16.5} x2={5} y2={16.5} stroke={DARK} strokeWidth={2.2} strokeLinecap="round" />
          )}
        </g>
      </g>

      {/* phone in right hand */}
      {pose.phone > 0.02 && (
        <g transform={`translate(${ph[0]},${ph[1] - 12}) rotate(${phoneRot}) scale(${pose.phone})`}>
          <circle r={64} fill="url(#aj-phoneglow)" opacity={pose.phoneGlow * 0.85} />
          <rect x={-12} y={-22} width={24} height={44} rx={5} fill="#0b0f16" stroke={`rgba(140,190,255,${0.35 + pose.phoneGlow * 0.6})`} strokeWidth={1.8} />
          <rect x={-9.5} y={-19} width={19} height={38} rx={3} fill={`rgba(110,175,255,${0.1 + pose.phoneGlow * 0.75})`} />
          <rect x={-6} y={-13} width={12} height={2.2} rx={1} fill={`rgba(255,255,255,${pose.phoneGlow * 0.7})`} />
          <rect x={-6} y={-8} width={9} height={2.2} rx={1} fill={`rgba(255,255,255,${pose.phoneGlow * 0.45})`} />

          {/* Hand fingers & thumb gripping the phone */}
          <g>
            {/* Palm base support */}
            <circle cx={-3} cy={16} r={5} fill={d.color} stroke={d.lightColor} strokeWidth={1.4} />
            {/* Fingers gripping side */}
            <rect x={-14} y={-2} width={4.5} height={16} rx={2.2} fill={d.color} stroke={d.lightColor} strokeWidth={1.2} />
            {/* Thumb */}
            <circle cx={12} cy={8} r={4.2} fill={d.color} stroke={d.lightColor} strokeWidth={1.4} />
          </g>
        </g>
      )}
    </svg>
  );
};
