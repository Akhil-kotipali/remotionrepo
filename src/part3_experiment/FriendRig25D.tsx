import React from "react";
import {FRIEND_DESIGNS, FriendId} from "../part3/stick/friendDesigns";
import {FriendPose25D} from "./types";
import {ik, rad, V2} from "../part3/math";

interface FriendRig25DProps {
  id: FriendId;
  pose: FriendPose25D;
  scale?: number;
  width?: number;
  height?: number;
  yaw?: number;
  pitch?: number;
  depthZ?: number;
  warmRim?: number;
  coolRim?: number;
  jacket?: boolean;
  shadow?: boolean;
  opacity?: number;
}

export const FriendRig25D: React.FC<FriendRig25DProps> = ({
  id,
  pose,
  scale = 1.0,
  width = 260,
  height = 480,
  yaw = 0,
  pitch = 0,
  depthZ = 0,
  warmRim = 0.35,
  coolRim = 0.25,
  jacket = false,
  shadow = true,
  opacity = 1.0,
}) => {
  const d = FRIEND_DESIGNS[id];
  const broad = id === "rahul";
  const sw = broad ? 42 : 0;
  const strokeW = broad ? 28 : 22;
  const L1 = broad ? 64 : 58;
  const L2 = broad ? 72 : 60;

  // Hip pivot point
  const P: V2 = [130 + pose.hipX, 240 + pose.hipY];
  const a = rad(pose.lean);
  const rel = (x: number, y: number): V2 => [
    P[0] + x * Math.cos(a) - y * Math.sin(a),
    P[1] + x * Math.sin(a) + y * Math.cos(a),
  ];

  const neck = rel(0, -132);
  const sL = rel(-sw - 10, -122);
  const sR = rel(sw + 10, -122);
  sL[1] += pose.breath * 0.8;
  sR[1] += pose.breath * 0.8;

  const ha = rad(pose.lean + pose.headTilt);
  const headPos: V2 = [
    neck[0] + Math.sin(ha) * 38 + pose.headTurn * 4,
    neck[1] - Math.cos(ha) * 38 + pose.breath,
  ];
  const R = 30;

  // Inverse Kinematics for arms and legs
  const AL = ik(sL, pose.handL, L1, L2, 1);
  const AR = ik(sR, pose.handR, L1, L2, -1);
  const LL = ik(P, pose.footL, 90, 92, 1);
  const RL = ik(P, pose.footR, 90, 92, -1);

  const path = (pts: V2[]) =>
    "M" + pts.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" L");

  const legL = path([P, LL.elbow, LL.hand]);
  const legR = path([P, RL.elbow, RL.hand]);
  const torso = path([P, neck]);
  const armL = path([sL, AL.elbow, AL.hand]);
  const armR = path([sR, AR.elbow, AR.hand]);

  const eo = Math.max(0.1, pose.eyeOpen * (1 - pose.blink));
  const lx = pose.lookX * 3.2;
  const ly = pose.lookY * 2.5;

  const hx = headPos[0];
  const hy = headPos[1];

  // Unique IDs for SVG filters & gradients
  const uid = `rig25d-${id}`;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        transformStyle: "preserve-3d",
        transform: `translateZ(${depthZ}px) rotateY(${yaw}deg) rotateX(${pitch}deg) scale(${scale})`,
        transformOrigin: "50% 92%",
        opacity,
      }}
    >
      {/* --- LAYER 0: 3D PROJECTED FLOOR SHADOW & CONTACT AMBIENT OCCLUSION --- */}
      {shadow && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 6,
            width: 140,
            height: 48,
            transform: "translate(-50%, 50%) rotateX(75deg) skewX(-15deg)",
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 75%)",
            filter: "blur(5px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}
      {shadow && (
        <>
          {/* Left foot contact shadow */}
          <div
            style={{
              position: "absolute",
              left: pose.footL[0] + 5,
              top: pose.footL[1] + 28,
              width: 32,
              height: 10,
              background: "rgba(0,0,0,0.85)",
              borderRadius: "50%",
              filter: "blur(2px)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          {/* Right foot contact shadow */}
          <div
            style={{
              position: "absolute",
              left: pose.footR[0] + 5,
              top: pose.footR[1] + 28,
              width: 32,
              height: 10,
              background: "rgba(0,0,0,0.85)",
              borderRadius: "50%",
              filter: "blur(2px)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        </>
      )}

      {/* --- VOLUMETRIC SVG RIG WITH 3D DEPTH SLICES --- */}
      <svg
        viewBox="0 0 260 480"
        width={width}
        height={height}
        style={{overflow: "visible", display: "block"}}
      >
        <defs>
          {/* 3D Volumetric Cylinder Shading Gradient */}
          <linearGradient id={`${uid}-cyl`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={d.shadowColor} />
            <stop offset="25%" stopColor={d.color} />
            <stop offset="55%" stopColor={d.lightColor} />
            <stop offset="85%" stopColor={d.color} />
            <stop offset="100%" stopColor={d.shadowColor} />
          </linearGradient>

          {/* 3D Volumetric Spherical Head Gradient (Upper-Left Key Light) */}
          <radialGradient id={`${uid}-head`} cx="32%" cy="28%" r="68%" fx="28%" fy="24%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="15%" stopColor={d.lightColor} />
            <stop offset="60%" stopColor={d.color} />
            <stop offset="100%" stopColor={d.shadowColor} />
          </radialGradient>

          {/* 3D Warm Directional Rim (Gold/Amber from Room Sconce) */}
          <linearGradient id={`${uid}-warm-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffedd5" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
          </linearGradient>

          {/* 3D Cool Directional Rim (Moonlight from Window) */}
          <linearGradient id={`${uid}-cool-rim`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
          </linearGradient>

          {/* Joint Cap Spherical Bevel */}
          <radialGradient id={`${uid}-joint`} cx="35%" cy="35%" r="60%">
            <stop offset="0%" stopColor={d.lightColor} />
            <stop offset="70%" stopColor={d.color} />
            <stop offset="100%" stopColor={d.shadowColor} />
          </radialGradient>
        </defs>

        {/* --- DEPTH SLICE 1: BACK LIMBS (Left Arm & Left Leg) --- */}
        <g id="back-limbs" opacity={0.88}>
          {/* Back Leg with Core Cylinder + Specular Ridge */}
          <path d={legL} stroke={d.shadowColor} strokeWidth={strokeW + 4} strokeLinecap="round" strokeLinejoin="round" />
          <path d={legL} stroke={`url(#${uid}-cyl)`} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />
          {/* Back Knee Joint Cap & Shoe */}
          <circle cx={LL.elbow[0]} cy={LL.elbow[1]} r={strokeW * 0.46} fill={`url(#${uid}-joint)`} />
          <ellipse cx={LL.hand[0]} cy={LL.hand[1] + 2} rx={strokeW * 0.52} ry={strokeW * 0.32} fill={d.shadowColor} />

          {/* Back Arm with Core Cylinder */}
          <path d={armL} stroke={d.shadowColor} strokeWidth={strokeW + 3} strokeLinecap="round" strokeLinejoin="round" />
          <path d={armL} stroke={`url(#${uid}-cyl)`} strokeWidth={strokeW - 2} strokeLinecap="round" strokeLinejoin="round" />
          {/* Back Elbow Joint Cap */}
          <circle cx={AL.elbow[0]} cy={AL.elbow[1]} r={(strokeW - 2) * 0.45} fill={`url(#${uid}-joint)`} />
        </g>

        {/* --- DEPTH SLICE 2: TORSO & CHEST --- */}
        <g id="torso-chest">
          {broad ? (
            // Rahul's athletic muscular torso wedge
            <g>
              <polygon
                points={[rel(-46, -124), rel(46, -124), rel(20, 0), rel(-20, 0)].map((p) => p.join(",")).join(" ")}
                fill={`url(#${uid}-cyl)`}
                stroke={d.shadowColor}
                strokeWidth={5}
                strokeLinejoin="round"
              />
              {/* Chest highlight ridge */}
              <line
                x1={rel(-15, -118)[0]}
                y1={rel(-15, -118)[1]}
                x2={rel(-5, -20)[0]}
                y2={rel(-5, -20)[1]}
                stroke={d.lightColor}
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.65}
              />
            </g>
          ) : (
            // Classic torso pillar with 3D tubular shading
            <g>
              <path d={torso} stroke={d.shadowColor} strokeWidth={strokeW + 6} strokeLinecap="round" />
              <path d={torso} stroke={`url(#${uid}-cyl)`} strokeWidth={strokeW + 2} strokeLinecap="round" />
              {/* Specular center highlight running down spine */}
              <path d={torso} stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" opacity={0.4} transform="translate(-2,0)" />
            </g>
          )}

          {/* Arjun's 3D Field Jacket (collar, brass zipper, storm flap, sleeve seams) */}
          {jacket && (
            <g id="arjun-jacket">
              <path d={path([rel(0, -120), rel(0, -10)])} stroke="#27341e" strokeWidth={28} strokeLinecap="round" />
              <path d={path([rel(0, -120), rel(0, -10)])} stroke="#3d5030" strokeWidth={24} strokeLinecap="round" />
              {/* Golden/Brass Zipper Line */}
              <path d={path([rel(0, -124), rel(0, -12)])} stroke="#b8d08f" strokeWidth={2.4} opacity={0.9} />
              {/* Jacket Collar V-lapels */}
              <path d={path([rel(-14, -126), rel(0, -104), rel(14, -126)])} stroke="#a4be7b" strokeWidth={3.5} strokeLinejoin="round" fill="none" />
              {/* Jacket bottom hem band */}
              <path d={path([rel(-15, -10), rel(15, -10)])} stroke="#556e42" strokeWidth={4} strokeLinecap="round" />
            </g>
          )}

          {/* Arjun's Leather Messenger Satchel */}
          {id === "arjun" && (() => {
            const strapA = rel(-14, -126);
            const pouch = rel(26, -30);
            return (
              <g id="satchel">
                <path d={path([strapA, pouch])} stroke="#1b2416" strokeWidth={5} strokeLinecap="round" />
                <path d={path([strapA, pouch])} stroke="#3e4e34" strokeWidth={3} strokeLinecap="round" />
                <g transform={`translate(${pouch[0]},${pouch[1]}) rotate(${pose.lean + 8})`}>
                  <rect x={-12} y={-16} width={24} height={32} rx={5} fill="#1d2618" stroke="#859969" strokeWidth={2} />
                  <rect x={-10} y={-14} width={20} height={10} rx={3} fill="#35442b" />
                  <circle cx={0} cy={-2} r={2} fill="#d4e157" />
                  <line x1={-10} y1={2} x2={10} y2={2} stroke="#859969" strokeWidth={1.5} />
                </g>
              </g>
            );
          })()}
        </g>

        {/* --- DEPTH SLICE 3: FRONT LEG --- */}
        <g id="front-leg">
          <path d={legR} stroke={d.shadowColor} strokeWidth={strokeW + 4} strokeLinecap="round" strokeLinejoin="round" />
          <path d={legR} stroke={`url(#${uid}-cyl)`} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />
          {/* Specular ridge on front thigh */}
          <line
            x1={P[0]}
            y1={P[1]}
            x2={RL.elbow[0]}
            y2={RL.elbow[1]}
            stroke="#ffffff"
            strokeWidth={2.4}
            opacity={0.35}
            strokeLinecap="round"
          />
          {/* Front Knee Joint Cap & Shoe */}
          <circle cx={RL.elbow[0]} cy={RL.elbow[1]} r={strokeW * 0.48} fill={`url(#${uid}-joint)`} />
          <ellipse cx={RL.hand[0]} cy={RL.hand[1] + 2} rx={strokeW * 0.54} ry={strokeW * 0.34} fill={d.shadowColor} />
        </g>

        {/* --- DEPTH SLICE 4: 3D HEAD & VOLUMETRIC EXPRESSIONS --- */}
        <g id="head-group" transform={`rotate(${pose.lean + pose.headTilt} ${hx} ${hy})`}>
          {/* Volumetric 3D Sphere Head */}
          <circle cx={hx} cy={hy} r={R} fill={`url(#${uid}-head)`} />
          {/* Head Perimeter 3D Ambient Edge */}
          <circle cx={hx} cy={hy} r={R} fill="none" stroke={d.shadowColor} strokeWidth={2.5} />

          {/* Specular Highlight Gloss Spot */}
          <ellipse
            cx={hx - R * 0.38}
            cy={hy - R * 0.36}
            rx={R * 0.28}
            ry={R * 0.18}
            transform={`rotate(-25 ${hx - R * 0.38} ${hy - R * 0.36})`}
            fill="#ffffff"
            opacity={0.48}
          />

          {/* Character-Specific 3D Hair & Accessories */}
          {id === "arjun" && (
            <g id="arjun-hair" transform={`translate(${pose.lookX * 1.8},0)`}>
              <path
                d={`M${hx - 28} ${hy - 8} Q${hx - 36} ${hy - 28} ${hx - 18} ${hy - 34} Q${hx - 26} ${hy - 44} ${hx - 8} ${hy - 42} Q${hx} ${hy - 50} ${hx + 14} ${hy - 40} Q${hx + 30} ${hy - 46} ${hx + 28} ${hy - 28} Q${hx + 36} ${hy - 20} ${hx + 28} ${hy - 6} Q${hx + 16} ${hy - 16} ${hx} ${hy - 20} Q${hx - 16} ${hy - 14} ${hx - 28} ${hy - 8} Z`}
                fill="#161e12"
                stroke="#a3bd82"
                strokeWidth={2.8}
                strokeLinejoin="round"
              />
              {/* Hair Highlight strands */}
              <path d={`M${hx - 20} ${hy - 28} Q${hx - 8} ${hy - 36} ${hx + 10} ${hy - 32}`} fill="none" stroke="#c5e1a5" strokeWidth={2.4} strokeLinecap="round" />
              <path d={`M${hx - 6} ${hy - 38} Q${hx + 6} ${hy - 42} ${hx + 20} ${hy - 34}`} fill="none" stroke="#c5e1a5" strokeWidth={2} strokeLinecap="round" />
            </g>
          )}

          {id === "meera" && (
            <g id="meera-hair">
              {/* Long cascading dark burgundy hair */}
              <path
                d={`M${hx - 24} ${hy - 14} C${hx - 36} ${hy - 36}, ${hx + 36} ${hy - 36}, ${hx + 24} ${hy - 14} C${hx + 38} ${hy + 16}, ${hx + 42} ${hy + 70}, ${hx + 32} ${hy + 110} C${hx + 24} ${hy + 124}, ${hx + 16} ${hy + 120}, ${hx + 18} ${hy + 90} C${hx + 22} ${hy + 50}, ${hx + 14} ${hy + 10}, ${hx} ${hy - 4} C${hx - 14} ${hy + 10}, ${hx - 22} ${hy + 50}, ${hx - 18} ${hy + 90} C${hx - 16} ${hy + 120}, ${hx - 24} ${hy + 124}, ${hx - 32} ${hy + 110} C${hx - 42} ${hy + 70}, ${hx - 38} ${hy + 16}, ${hx - 24} ${hy - 14} Z`}
                fill="#380d1b"
                stroke="#d87093"
                strokeWidth={2.8}
                strokeLinejoin="round"
              />
              {/* Strand highlights */}
              <path d={`M${hx - 26} ${hy + 10} Q${hx - 34} ${hy + 60} ${hx - 22} ${hy + 100}`} fill="none" stroke="#f48fb1" strokeWidth={2} strokeLinecap="round" />
            </g>
          )}

          {id === "kabir" && (
            <g id="kabir-hair-glasses">
              {/* Crisp parted teal hair */}
              <path
                d={`M${hx - 26} ${hy - 10} Q${hx - 32} ${hy - 34} ${hx} ${hy - 36} Q${hx + 28} ${hy - 34} ${hx + 26} ${hy - 10} Q${hx + 10} ${hy - 16} ${hx} ${hy - 16} Q${hx - 10} ${hy - 16} ${hx - 26} ${hy - 10} Z`}
                fill="#0d2628"
                stroke="#469fa5"
                strokeWidth={2.6}
              />
              {/* 3D Metallic Glasses */}
              <g transform={`translate(${pose.lookX * 3}, ${pose.lookY * 2})`}>
                <rect x={hx - 22} y={hy - 6} width={18} height={13} rx={3} fill="rgba(70, 159, 165, 0.2)" stroke="#a5f3fc" strokeWidth={2.2} />
                <rect x={hx + 4} y={hy - 6} width={18} height={13} rx={3} fill="rgba(70, 159, 165, 0.2)" stroke="#a5f3fc" strokeWidth={2.2} />
                <line x1={hx - 4} y1={hy} x2={hx + 4} y2={hy} stroke="#a5f3fc" strokeWidth={2} />
                {/* Lens Glint */}
                <line x1={hx - 18} y1={hy - 3} x2={hx - 12} y2={hy + 4} stroke="#ffffff" strokeWidth={1.8} strokeLinecap="round" />
                <line x1={hx + 8} y1={hy - 3} x2={hx + 14} y2={hy + 4} stroke="#ffffff" strokeWidth={1.8} strokeLinecap="round" />
              </g>
            </g>
          )}

          {id === "nisha" && (
            <g id="nisha-hair">
              {/* Chic mustard bob */}
              <path
                d={`M${hx - 28} ${hy - 8} Q${hx - 36} ${hy - 36} ${hx} ${hy - 38} Q${hx + 36} ${hy - 36} ${hx + 28} ${hy - 8} Q${hx + 32} ${hy + 22} ${hx + 22} ${hy + 32} Q${hx + 16} ${hy + 14} ${hx + 12} ${hy - 6} Q${hx} ${hy - 12} ${hx - 12} ${hy - 6} Q${hx - 16} ${hy + 14} ${hx - 22} ${hy + 32} Q${hx - 32} ${hy + 22} ${hx - 28} ${hy - 8} Z`}
                fill="#4a3b10"
                stroke="#fcd34d"
                strokeWidth={2.6}
              />
            </g>
          )}

          {id === "rahul" && (
            <g id="rahul-hair">
              {/* Short cropped textured rust hair */}
              <path
                d={`M${hx - 26} ${hy - 12} Q${hx - 32} ${hy - 36} ${hx} ${hy - 40} Q${hx + 32} ${hy - 36} ${hx + 26} ${hy - 12} Q${hx + 14} ${hy - 20} ${hx} ${hy - 20} Q${hx - 14} ${hy - 20} ${hx - 26} ${hy - 12} Z`}
                fill="#3a1b0f"
                stroke="#fb923c"
                strokeWidth={2.6}
              />
            </g>
          )}

          {/* 3D Dimensional Eyes & Expressive Brows */}
          {id !== "kabir" && (
            <g id="eyes" transform={`translate(${lx}, ${ly})`}>
              {/* Left Eye: White Sclera + Pupil + Specular Reflection */}
              <ellipse cx={hx - 11} cy={hy - 2} rx={4.5} ry={5.5 * eo} fill="#ffffff" />
              <circle cx={hx - 11 + pose.lookX * 1.2} cy={hy - 2 + pose.lookY * 0.8} r={2.8 * eo} fill="#0f172a" />
              <circle cx={hx - 12.2} cy={hy - 3.4} r={1.2 * eo} fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx={hx + 11} cy={hy - 2} rx={4.5} ry={5.5 * eo} fill="#ffffff" />
              <circle cx={hx + 11 + pose.lookX * 1.2} cy={hy - 2 + pose.lookY * 0.8} r={2.8 * eo} fill="#0f172a" />
              <circle cx={hx + 9.8} cy={hy - 3.4} r={1.2 * eo} fill="#ffffff" />
            </g>
          )}

          {/* Expressive Eyebrows with Depth */}
          <line
            x1={hx - 17}
            y1={hy - 11 + pose.brow * 3}
            x2={hx - 5}
            y2={hy - 11 - pose.brow * 2}
            stroke="#0a0f1d"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <line
            x1={hx + 5}
            y1={hy - 11 - pose.brow * 2}
            x2={hx + 17}
            y2={hy - 11 + pose.brow * 3}
            stroke="#0a0f1d"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>

        {/* --- DEPTH SLICE 5: FRONT ARM & PROPS --- */}
        <g id="front-arm">
          <path d={armR} stroke={d.shadowColor} strokeWidth={strokeW + 4} strokeLinecap="round" strokeLinejoin="round" />
          <path d={armR} stroke={`url(#${uid}-cyl)`} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />
          {/* Front Elbow Joint Cap */}
          <circle cx={AR.elbow[0]} cy={AR.elbow[1]} r={strokeW * 0.48} fill={`url(#${uid}-joint)`} />

          {/* Kabir's 3D Hardcover Book */}
          {id === "kabir" && (
            <g transform={`translate(${AR.hand[0] - 12}, ${AR.hand[1] - 24}) rotate(-14)`}>
              {/* Back cover */}
              <rect x={-4} y={-4} width={28} height={40} rx={3} fill="#0c4a6e" stroke="#38bdf8" strokeWidth={2} />
              {/* White pages block */}
              <rect x={-2} y={-2} width={24} height={36} rx={2} fill="#f1f5f9" />
              {/* Spine edge */}
              <line x1={-3} y1={-3} x2={-3} y2={35} stroke="#0284c7" strokeWidth={3} />
            </g>
          )}
        </g>

        {/* --- DUAL DIRECTIONAL 3D RIM LIGHTING OVERLAY --- */}
        {/* Warm Rim on Left Contour */}
        <g stroke={`url(#${uid}-warm-rim)`} strokeWidth={3.2} opacity={warmRim} fill="none" transform="translate(-4, -1)">
          <path d={torso} />
          <path d={armL} />
          <path d={legL} />
          <circle cx={hx} cy={hy} r={R} />
        </g>
        {/* Cool Rim on Right Contour */}
        <g stroke={`url(#${uid}-cool-rim)`} strokeWidth={2.8} opacity={coolRim} fill="none" transform="translate(4, 1)">
          <path d={torso} />
          <path d={armR} />
          <path d={legR} />
          <circle cx={hx} cy={hy} r={R} />
        </g>
      </svg>
    </div>
  );
};
