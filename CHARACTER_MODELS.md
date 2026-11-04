# COMPLETE CHARACTER MODELS CODEBASE ARCHIVE

Generated: 2026-10-31T09:49:23.571Z

This document bundles the complete source code for all character models in this project:
1. **The Six Friends Procedural Stick Figure Rig** (Arjun, Dev, Rahul, Meera, Kabir, Nisha)
2. **Animation vs Animator Stick Figures** (Red, Yellow, Orange, Green, Blue)
3. **3D Three.js / React Three Fiber Cinematic Characters** (Voxel & Low-Poly Geometries)

---

## Table of Contents

1. [src/stick/FriendStickFigure.tsx](#srcstickfriendstickfiguretsx)
2. [src/stick/friendDesigns.ts](#srcstickfrienddesignsts)
3. [src/stick/StickFace.tsx](#srcstickstickfacetsx)
4. [src/stick/StickFigure.tsx](#srcstickstickfiguretsx)
5. [src/stick/designs.ts](#srcstickdesignsts)
6. [src/stick/types.ts](#srcsticktypests)
7. [src/stick/SixFriendsShowcase.tsx](#srcsticksixfriendsshowcasetsx)
8. [src/stick/MeeraPhotoScene.tsx](#srcstickmeeraphotoscenetsx)
9. [src/stick/index.ts](#srcstickindexts)
10. [src/characters/Character.tsx](#srccharacterscharactertsx)
11. [src/characters/geometry.tsx](#srccharactersgeometrytsx)
12. [src/characters/designs.ts](#srccharactersdesignsts)
13. [src/characters/types.ts](#srccharacterstypests)
14. [src/characters/CharacterShowcase.tsx](#srccharacterscharactershowcasetsx)
15. [src/characters/CinematicShowcase.tsx](#srccharacterscinematicshowcasetsx)
16. [src/characters/index.ts](#srccharactersindexts)

---

## <a id="srcstickfriendstickfiguretsx"></a> File: `src/stick/FriendStickFigure.tsx`

```tsx
// Path: src/stick/FriendStickFigure.tsx
import React from "react";
import { FriendId, FRIEND_DESIGNS } from "./friendDesigns";
import { StickFace } from "./StickFace";
import { StickExpression } from "./types";

export interface FriendStickFigureProps {
  friend: FriendId;
  pose?: "signature" | "photoReady" | "holdingCamera" | "takingPhoto" | "wave";
  expression?: StickExpression;
  showFace?: boolean;
  facing?: "left" | "right";
  width?: number | string;
  height?: number | string;
  glow?: boolean;
  shading?: boolean;
  animate?: boolean;
  frame?: number;
  animationOffset?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const FriendStickFigure: React.FC<FriendStickFigureProps> = ({
  friend,
  pose = "signature",
  expression,
  showFace = false,
  facing = "right",
  width = 240,
  height = 440,
  glow = true,
  shading = true,
  animate = false,
  frame = 0,
  animationOffset = 0,
  className,
  style,
}) => {
  const d = FRIEND_DESIGNS[friend];
  const t = frame + animationOffset;
  const breath = animate ? Math.sin(t * 0.08) * 1.6 : 0;
  const sway = animate ? Math.sin(t * 0.05) * 1.2 : 0;

  // Head center and dimensions
  const headX = 120 + sway * 0.5;
  const headY = 62 + breath;
  const headRadius = 28;

  // Unique SVG IDs
  const gradId = `friend-grad-${friend}`;
  const sphereGradId = `friend-sphere-${friend}`;
  const glowId = `friend-glow-${friend}`;

  // Broad shoulders for Rahul
  const isBroad = friend === "rahul";
  const strokeW = isBroad ? 26 : 20;

  return (
    <svg
      viewBox="0 0 240 440"
      width={width}
      height={height}
      role="img"
      aria-label={`${d.name} Stick Figure`}
      className={className}
      style={{
        overflow: "visible",
        display: "block",
        filter: glow ? `drop-shadow(0 8px 24px ${d.color}44)` : undefined,
        transform: d.heightScale ? `scaleY(${d.heightScale})` : undefined,
        transformOrigin: "bottom center",
        ...style,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 3D Tubular Linear Gradient for Limbs */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={d.lightColor} />
          <stop offset="45%" stopColor={d.color} />
          <stop offset="100%" stopColor={d.shadowColor} />
        </linearGradient>

        {/* 3D Spherical Radial Gradient for Head */}
        <radialGradient id={sphereGradId} cx="36%" cy="32%" r="68%">
          <stop offset="0%" stopColor={d.lightColor} />
          <stop offset="55%" stopColor={d.color} />
          <stop offset="100%" stopColor={d.shadowColor} />
        </radialGradient>

        {/* Ambient Rim Glow */}
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={d.color} floodOpacity="0.35" />
        </filter>
      </defs>

      <g transform={facing === "left" ? "translate(240, 0) scale(-1, 1)" : undefined}>
        {/* FLOOR SHADOW */}
        <ellipse
          cx="120"
          cy="422"
          rx={isBroad ? 58 : 46}
          ry="8"
          fill="#000000"
          opacity="0.25"
        />

        {/* ==================================================== */}
        {/* BODY & LIMBS MATCHING THE USER'S REFERENCE IMAGE     */}
        {/* ==================================================== */}

        {/* 1. ARJUN: Olive Green + Cross-body Satchel Bag */}
        {friend === "arjun" && (
          <g
            stroke={shading ? `url(#${gradId})` : d.color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            {/* Torso */}
            <line x1={120 + sway} y1={98 + breath} x2={120} y2={228} />

            {/* Left Arm: Curving naturally downward */}
            <path d={`M${120 + sway} ${108 + breath} Q86 160 88 220`} />

            {/* Right Arm: Curving down to side */}
            <path d={`M${120 + sway} ${108 + breath} Q152 160 148 220`} />

            {/* Legs: Confident straight stance */}
            <path d="M120 228 L94 416" />
            <path d="M120 228 L146 416" />
          </g>
        )}

        {/* Arjun's Cross-body Messenger Satchel Bag */}
        {friend === "arjun" && (
          <g>
            {/* Cross-body strap across chest */}
            <path
              d={`M${108 + sway} ${104 + breath} L${144 + sway} ${195 + breath}`}
              stroke="#2E3C27"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Messenger Satchel Bag Pouch */}
            <g transform={`translate(${144 + sway * 0.5}, ${195 + breath}) rotate(6)`}>
              <rect x="-10" y="-14" width="20" height="28" rx="4" fill="#24301E" stroke="#859969" strokeWidth="1.8" />
              <rect x="-8" y="-12" width="16" height="8" rx="2" fill="#3B4C33" />
              <line x1="-8" y1="-2" x2="8" y2="-2" stroke="#859969" strokeWidth="1.5" />
            </g>
          </g>
        )}

        {/* 2. DEV: Navy Blue + Hand on Hip */}
        {friend === "dev" && (
          <g
            stroke={shading ? `url(#${gradId})` : d.color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            {/* Torso */}
            <line x1={120 + sway} y1={98 + breath} x2={120} y2={228} />

            {/* Left Arm: Relaxed at side */}
            <path d={`M${120 + sway} ${108 + breath} Q94 165 92 225`} />

            {/* Right Arm: HAND ON HIP (Bent Elbow Triangle) */}
            <polyline points={`${120 + sway},${108 + breath} 168,154 130,222`} />

            {/* Legs: Confident posture */}
            <path d="M120 228 L98 416" />
            <path d="M120 228 L142 416" />
          </g>
        )}

        {/* 3. RAHUL: Rust Orange + BROAD TRAPEZOID SHOULDERS + BOTH HANDS ON HIPS */}
        {friend === "rahul" && (
          <g>
            {/* Solid Muscular V-Taper Torso (Broad Trapezoid) */}
            <polygon
              points={`
                ${78 + sway},${108 + breath}
                ${162 + sway},${108 + breath}
                ${138 + sway},${228}
                ${102 + sway},${228}
              `}
              fill={shading ? `url(#${gradId})` : d.color}
              stroke={shading ? `url(#${gradId})` : d.color}
              strokeWidth="6"
              strokeLinejoin="round"
            />

            {/* Arms & Legs */}
            <g
              stroke={shading ? `url(#${gradId})` : d.color}
              strokeWidth={strokeW}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              {/* Left Arm: Hand on Hip (Wide Triangle) */}
              <polyline points={`${78 + sway},${108 + breath} 46,160 98,220`} />

              {/* Right Arm: Hand on Hip (Wide Triangle) */}
              <polyline points={`${162 + sway},${108 + breath} 194,160 142,220`} />

              {/* Broad Athletic Legs */}
              <path d="M106 228 L78 416" />
              <path d="M134 228 L162 416" />
            </g>
          </g>
        )}

        {/* 4. MEERA: Burgundy + Voluminous Long Hair + Camera */}
        {friend === "meera" && (
          <g>
            {/* If taking photo pose: raises camera to eye level pointing right */}
            {pose === "takingPhoto" || pose === "holdingCamera" ? (
              <g
                stroke={shading ? `url(#${gradId})` : d.color}
                strokeWidth={strokeW}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                {/* Torso */}
                <line x1={120 + sway} y1={98 + breath} x2={120} y2={228} />

                {/* Left Arm: Supporting camera from underneath */}
                <path d={`M${120 + sway} ${108 + breath} Q115 140 ${headX + 14} ${headY + 22}`} />

                {/* Right Arm: Reaching to top shutter button */}
                <path d={`M${120 + sway} ${108 + breath} Q146 120 ${headX + 28} ${headY + 2}`} />

                {/* Legs: Poised confident stance */}
                <path d="M120 228 L104 416" />
                <path d="M120 228 L136 416" />
              </g>
            ) : (
              // Default Posing Stance
              <g
                stroke={shading ? `url(#${gradId})` : d.color}
                strokeWidth={strokeW}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                {/* Torso */}
                <line x1={120 + sway} y1={98 + breath} x2={120} y2={228} />

                {/* Left Arm: Graceful slight bend */}
                <path d={`M${120 + sway} ${108 + breath} Q90 160 88 220`} />

                {/* Right Arm: Resting at side */}
                <path d={`M${120 + sway} ${108 + breath} Q150 160 148 220`} />

                {/* Legs: Elegant stance */}
                <path d="M120 228 L104 416" />
                <path d="M120 228 L136 416" />
              </g>
            )}
          </g>
        )}

        {/* 5. KABIR: Teal + Glasses + Holding Book / Tablet */}
        {friend === "kabir" && (
          <g>
            <g
              stroke={shading ? `url(#${gradId})` : d.color}
              strokeWidth={strokeW}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              {/* Tall Torso */}
              <line x1={120 + sway} y1={98 + breath} x2={120} y2={232} />

              {/* Left Arm: Curving down to side */}
              <path d={`M${120 + sway} ${108 + breath} Q88 160 88 225`} />

              {/* Right Arm: Bent at elbow holding book against hip */}
              <polyline points={`${120 + sway},${108 + breath} 156,160 142,210`} />

              {/* Tall Straight Legs */}
              <path d="M120 232 L106 416" />
              <path d="M120 232 L136 416" />
            </g>

            {/* Kabir's Book / Notebook Prop */}
            <g transform={`translate(${154 + sway * 0.5}, ${195 + breath}) rotate(8)`}>
              <rect x="-11" y="-18" width="22" height="34" rx="3" fill="#0E2124" stroke="#469FA5" strokeWidth="2" />
              <rect x="-8" y="-15" width="16" height="28" fill="#1A3B40" />
              <line x1="-5" y1="-8" x2="5" y2="-8" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
              <line x1="-5" y1="-2" x2="5" y2="-2" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
              <line x1="-5" y1="4" x2="5" y2="4" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
            </g>
          </g>
        )}

        {/* 6. NISHA: Mustard Yellow + Short Bob + Hand on Hip */}
        {friend === "nisha" && (
          <g
            stroke={shading ? `url(#${gradId})` : d.color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            {/* Torso */}
            <line x1={120 + sway} y1={98 + breath} x2={120} y2={228} />

            {/* Left Arm: Resting at side */}
            <path d={`M${120 + sway} ${108 + breath} Q92 165 88 225`} />

            {/* Right Arm: HAND ON HIP (Triangular Elbow) */}
            <polyline points={`${120 + sway},${108 + breath} 168,154 130,222`} />

            {/* Legs: Confident grounded stance */}
            <path d="M120 228 L94 416" />
            <path d="M120 228 L146 416" />
          </g>
        )}

        {/* ==================================================== */}
        {/* HEAD BASE SPHERE                                     */}
        {/* ==================================================== */}
        <circle
          cx={headX}
          cy={headY}
          r={headRadius}
          fill={shading ? `url(#${sphereGradId})` : d.color}
          filter={`url(#${glowId})`}
        />

        {/* ==================================================== */}
        {/* CHARACTER SIGNATURE HAIR & ACCESSORY DETAILS         */}
        {/* ==================================================== */}

        {/* 1. ARJUN: MESSY HAIR WITH BRIGHT CONTOUR OUTLINE */}
        {friend === "arjun" && (
          <g id="arjun-messy-hair">
            <path
              d={`
                M${headX - 26} ${headY - 6}
                Q${headX - 32} ${headY - 26} ${headX - 16} ${headY - 30}
                Q${headX - 24} ${headY - 40} ${headX - 6} ${headY - 38}
                Q${headX} ${headY - 46} ${headX + 12} ${headY - 36}
                Q${headX + 28} ${headY - 42} ${headX + 24} ${headY - 26}
                Q${headX + 34} ${headY - 18} ${headX + 26} ${headY - 4}
                Q${headX + 14} ${headY - 14} ${headX} ${headY - 18}
                Q${headX - 14} ${headY - 12} ${headX - 26} ${headY - 6}
                Z
              `}
              fill="#1C2417"
              stroke="#A3BD82"
              strokeWidth="2.5"
            />
            {/* Highlight strands */}
            <path
              d={`M${headX - 18} ${headY - 26} Q${headX - 8} ${headY - 34} ${headX + 8} ${headY - 30}`}
              fill="none"
              stroke="#A3BD82"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 2. DEV: CURLY HAIR */}
        {friend === "dev" && (
          <g id="dev-curly-hair">
            <circle cx={headX - 20} cy={headY - 16} r={11} fill="#0E1724" stroke="#60A5FA" strokeWidth="2" />
            <circle cx={headX - 14} cy={headY - 26} r={12} fill="#0E1724" stroke="#60A5FA" strokeWidth="2" />
            <circle cx={headX} cy={headY - 30} r={13} fill="#0E1724" stroke="#60A5FA" strokeWidth="2" />
            <circle cx={headX + 14} cy={headY - 26} r={12} fill="#0E1724" stroke="#60A5FA" strokeWidth="2" />
            <circle cx={headX + 20} cy={headY - 16} r={11} fill="#0E1724" stroke="#60A5FA" strokeWidth="2" />

            <path
              d={`M${headX - 16} ${headY - 24} Q${headX - 8} ${headY - 28} ${headX - 6} ${headY - 20}`}
              fill="none"
              stroke="#60A5FA"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 3. RAHUL: SHORT CROP HAIR */}
        {friend === "rahul" && (
          <g id="rahul-crop-hair">
            <path
              d={`
                M${headX - 26} ${headY - 8}
                Q${headX - 28} ${headY - 28} ${headX - 12} ${headY - 30}
                Q${headX} ${headY - 33} ${headX + 14} ${headY - 30}
                Q${headX + 28} ${headY - 28} ${headX + 26} ${headY - 8}
                Q${headX + 14} ${headY - 18} ${headX} ${headY - 20}
                Q${headX - 14} ${headY - 18} ${headX - 26} ${headY - 8}
                Z
              `}
              fill="#2E1208"
              stroke="#FB923C"
              strokeWidth="2"
            />
          </g>
        )}

        {/* 4. MEERA: VOLUMINOUS LONG HAIR (SWOOPING AROUND HEAD & SHOULDERS) */}
        {friend === "meera" && (
          <g id="meera-voluminous-hair">
            {/* Big beautiful long hair mass behind head and shoulders */}
            <path
              d={`
                M${headX - 28} ${headY + 12}
                Q${headX - 38} ${headY - 24} ${headX - 20} ${headY - 34}
                Q${headX} ${headY - 38} ${headX + 20} ${headY - 34}
                Q${headX + 38} ${headY - 24} ${headX + 34} ${headY + 18}
                Q${headX + 44} ${headY + 60} ${headX + 36} ${headY + 120}
                Q${headX + 28} ${headY + 175} ${headX + 14} ${headY + 190}
                Q${headX + 16} ${headY + 140} ${headX + 24} ${headY + 90}
                Q${headX + 26} ${headY + 24} ${headX + 22} ${headY - 2}
                Q${headX} ${headY - 10} ${headX - 22} ${headY - 2}
                Q${headX - 26} ${headY + 24} ${headX - 28} ${headY + 12}
                Z
              `}
              fill="#220713"
              stroke="#F472B6"
              strokeWidth="2"
            />
            {/* Hair shine sweep */}
            <path
              d={`M${headX - 16} ${headY - 26} Q${headX + 6} ${headY - 32} ${headX + 22} ${headY - 22}`}
              fill="none"
              stroke="#F472B6"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 5. KABIR: BOLD GLASSES */}
        {friend === "kabir" && (
          <g id="kabir-glasses">
            {/* Hair cap */}
            <path
              d={`
                M${headX - 25} ${headY - 10}
                Q${headX - 26} ${headY - 28} ${headX - 8} ${headY - 30}
                Q${headX + 6} ${headY - 33} ${headX + 20} ${headY - 28}
                Q${headX + 26} ${headY - 18} ${headX + 25} ${headY - 8}
                Z
              `}
              fill="#0F2022"
              stroke="#2DD4BF"
              strokeWidth="2"
            />

            {/* Left Spectacle Lens */}
            <rect
              x={headX - 25}
              y={headY - 5}
              width={22}
              height={18}
              rx={4}
              fill="rgba(45, 212, 191, 0.25)"
              stroke="#071314"
              strokeWidth="3.5"
            />

            {/* Right Spectacle Lens */}
            <rect
              x={headX + 3}
              y={headY - 5}
              width={22}
              height={18}
              rx={4}
              fill="rgba(45, 212, 191, 0.25)"
              stroke="#071314"
              strokeWidth="3.5"
            />

            {/* Bridge */}
            <line x1={headX - 3} y1={headY + 3} x2={headX + 3} y2={headY + 3} stroke="#071314" strokeWidth="3.5" />

            {/* Temples */}
            <line x1={headX - 28} y1={headY + 2} x2={headX - 25} y2={headY + 2} stroke="#071314" strokeWidth="3" />
            <line x1={headX + 25} y1={headY + 2} x2={headX + 28} y2={headY + 2} stroke="#071314" strokeWidth="3" />

            {/* Glare Highlights */}
            <line x1={headX - 20} y1={headY - 2} x2={headX - 11} y2={headY + 8} stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
            <line x1={headX + 8} y1={headY - 2} x2={headX + 17} y2={headY + 8} stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        )}

        {/* 6. NISHA: GEOMETRIC SHORT BOB WITH ANGLED BANG */}
        {friend === "nisha" && (
          <g id="nisha-bob-hair">
            <path
              d={`
                M${headX - 28} ${headY + 14}
                Q${headX - 32} ${headY - 28} ${headX} ${headY - 32}
                Q${headX + 32} ${headY - 28} ${headX + 28} ${headY + 14}
                Q${headX + 24} ${headY + 8} ${headX + 18} ${headY - 2}
                Q${headX + 6} ${headY - 6} ${headX - 4} ${headY - 2}
                Q${headX - 16} ${headY + 4} ${headX - 24} ${headY + 12}
                Z
              `}
              fill="#261B06"
              stroke="#FACC15"
              strokeWidth="2"
            />
            {/* Bang line sweep */}
            <path
              d={`M${headX - 20} ${headY - 14} Q${headX - 4} ${headY - 2} ${headX + 14} ${headY + 4}`}
              fill="none"
              stroke="#FACC15"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Facial Expression (Optional) */}
        {showFace && (
          <StickFace
            character="red"
            expression={expression ?? "happy"}
            headRadius={headRadius}
            headCenter={{ x: headX, y: headY }}
          />
        )}

        {/* MEERA'S CAMERA PROP (RENDERED ON TOP OF HEAD & HAIR) */}
        {friend === "meera" && (pose === "takingPhoto" || pose === "holdingCamera") && (
          <g id="meera-dslr-camera" transform={`translate(${headX + 22}, ${headY + 10})`}>
            {/* Camera Body Chassis */}
            <rect
              x="-18"
              y="-12"
              width="36"
              height="26"
              rx="4"
              fill="#18181B"
              stroke="#F472B6"
              strokeWidth="2.2"
            />
            {/* Viewfinder Hump */}
            <polygon points="-8,-12 0,-18 8,-18 10,-12" fill="#27272A" />
            {/* Protruding Lens Barrel Pointing Right toward Friends */}
            <rect
              x="18"
              y="-8"
              width="14"
              height="18"
              rx="3"
              fill="#27272A"
              stroke="#F472B6"
              strokeWidth="1.8"
            />
            {/* Front Lens Glass Optic Reflection */}
            <ellipse
              cx="32"
              cy="1"
              rx="3.5"
              ry="8.5"
              fill="#0284C7"
              stroke="#38BDF8"
              strokeWidth="1.5"
            />
            {/* Shutter Button on Top */}
            <rect x="6" y="-16" width="6" height="4" rx="1" fill="#F472B6" />
            {/* Flash Strobe Window */}
            <rect x="-14" y="-8" width="8" height="6" rx="1.5" fill="#FEF08A" opacity="0.9" />
            {/* Hands Gripping the Body */}
            <circle cx="-14" cy="8" r="5" fill="#7D334C" stroke="#F472B6" strokeWidth="1" />
            <circle cx="8" cy="-12" r="5" fill="#7D334C" stroke="#F472B6" strokeWidth="1" />
          </g>
        )}
      </g>
    </svg>
  );
};

export default FriendStickFigure;

```

---

## <a id="srcstickfrienddesignsts"></a> File: `src/stick/friendDesigns.ts`

```tsx
// Path: src/stick/friendDesigns.ts
export type FriendId = "arjun" | "dev" | "rahul" | "meera" | "kabir" | "nisha";

export interface FriendDesign {
  id: FriendId;
  name: string;
  trait: string;
  color: string;
  lightColor: string;
  shadowColor: string;
  hairStyle?: "messy" | "curly" | "long" | "bob";
  hasGlasses?: boolean;
  hasPhone?: boolean;
  hasCamera?: boolean;
  isBroad?: boolean;
  heightScale?: number;
  personality: string;
}

export const FRIEND_DESIGNS: Record<FriendId, FriendDesign> = {
  arjun: {
    id: "arjun",
    name: "Arjun",
    trait: "Olive green, messy hair",
    color: "#5E6F4A",
    lightColor: "#859969",
    shadowColor: "#39452B",
    hairStyle: "messy",
    hasPhone: true,
    personality: "Tech analyst, resourceful, always on call",
  },
  dev: {
    id: "dev",
    name: "Dev",
    trait: "Navy blue, curly hair",
    color: "#2C4A70",
    lightColor: "#4B72A3",
    shadowColor: "#172A42",
    hairStyle: "curly",
    personality: "Storyteller, conversational, expressive mediator",
  },
  rahul: {
    id: "rahul",
    name: "Rahul",
    trait: "Rust orange, broad shoulders",
    color: "#A25332",
    lightColor: "#C97551",
    shadowColor: "#6A311B",
    isBroad: true, // Broad shoulders & heavy athletic build
    personality: "Protective enforcer, loyal, grounded anchor",
  },
  meera: {
    id: "meera",
    name: "Meera",
    trait: "Burgundy, long hair",
    color: "#7D334C",
    lightColor: "#A94F6F",
    shadowColor: "#4B1A2A",
    hairStyle: "long",
    hasCamera: true,
    personality: "Documentarian, observant, keen creative eye",
  },
  kabir: {
    id: "kabir",
    name: "Kabir",
    trait: "Teal, glasses",
    color: "#2D7377",
    lightColor: "#469FA5",
    shadowColor: "#194346",
    hasGlasses: true,
    heightScale: 1.05, // Slightly taller
    personality: "Strategic architect, precision thinker, optics master",
  },
  nisha: {
    id: "nisha",
    name: "Nisha",
    trait: "Mustard yellow, short bob",
    color: "#C29631",
    lightColor: "#E6BA50",
    shadowColor: "#7E5E17",
    hairStyle: "bob",
    personality: "Operations strategist, upbeat, quick-witted coordinator",
  },
};

export const FRIEND_IDS: FriendId[] = [
  "arjun",
  "dev",
  "rahul",
  "meera",
  "kabir",
  "nisha",
];


```

---

## <a id="srcstickstickfacetsx"></a> File: `src/stick/StickFace.tsx`

```tsx
// Path: src/stick/StickFace.tsx
import React from "react";
import { StickCharacterId, StickExpression } from "./types";

interface StickFaceProps {
  character: StickCharacterId;
  expression: StickExpression;
  headRadius: number;
  headCenter: { x: number; y: number };
  isHollowHead?: boolean;
}

export const StickFace: React.FC<StickFaceProps> = ({
  character,
  expression,
  headRadius,
  headCenter: { x: cx, y: cy },
  isHollowHead = false,
}) => {
  if (expression === "blank") return null;

  // For solid heads, white facial lines with subtle dark outline pop gorgeously
  // For hollow heads (Orange), facial elements render inside the ring
  const strokeColor = isHollowHead ? "#FFFFFF" : "#FFFFFF";
  const darkStroke = "rgba(0,0,0,0.45)";
  const r = headRadius;

  switch (expression) {
    case "angry":
      return (
        <g id="face-angry">
          {/* Eyebrows */}
          <line x1={cx - r * 0.55} y1={cy - r * 0.35} x2={cx - r * 0.15} y2={cy - r * 0.15} stroke={darkStroke} strokeWidth={3.5} strokeLinecap="round" />
          <line x1={cx - r * 0.55} y1={cy - r * 0.35} x2={cx - r * 0.15} y2={cy - r * 0.15} stroke={strokeColor} strokeWidth={2.4} strokeLinecap="round" />
          <line x1={cx + r * 0.55} y1={cy - r * 0.35} x2={cx + r * 0.15} y2={cy - r * 0.15} stroke={darkStroke} strokeWidth={3.5} strokeLinecap="round" />
          <line x1={cx + r * 0.55} y1={cy - r * 0.35} x2={cx + r * 0.15} y2={cy - r * 0.15} stroke={strokeColor} strokeWidth={2.4} strokeLinecap="round" />

          {/* Slanted Angry Eyes */}
          <polygon points={`${cx - r * 0.45},${cy - r * 0.15} ${cx - r * 0.15},${cy - r * 0.05} ${cx - r * 0.3},${cy + r * 0.1}`} fill="#FFFFFF" stroke={darkStroke} strokeWidth={1} />
          <polygon points={`${cx + r * 0.45},${cy - r * 0.15} ${cx + r * 0.15},${cy - r * 0.05} ${cx + r * 0.3},${cy + r * 0.1}`} fill="#FFFFFF" stroke={darkStroke} strokeWidth={1} />

          {/* Fierce Mouth */}
          <path d={`M${cx - r * 0.3} ${cy + r * 0.35} Q${cx} ${cy + r * 0.25} ${cx + r * 0.3} ${cy + r * 0.4}`} fill="none" stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      );

    case "happy":
      return (
        <g id="face-happy">
          {/* Arched Happy Eyes ^ ^ */}
          <path d={`M${cx - r * 0.45} ${cy - r * 0.05} Q${cx - r * 0.28} ${cy - r * 0.3} ${cx - r * 0.12} ${cy - r * 0.05}`} fill="none" stroke={strokeColor} strokeWidth={3} strokeLinecap="round" />
          <path d={`M${cx + r * 0.12} ${cy - r * 0.05} Q${cx + r * 0.28} ${cy - r * 0.3} ${cx + r * 0.45} ${cy - r * 0.05}`} fill="none" stroke={strokeColor} strokeWidth={3} strokeLinecap="round" />

          {/* Cheerful Smile */}
          <path d={`M${cx - r * 0.28} ${cy + r * 0.18} Q${cx} ${cy + r * 0.48} ${cx + r * 0.28} ${cy + r * 0.18} Z`} fill="#FFFFFF" stroke={darkStroke} strokeWidth={1.5} />
        </g>
      );

    case "determined":
      return (
        <g id="face-determined">
          {/* Focused angled brows */}
          <line x1={cx - r * 0.5} y1={cy - r * 0.25} x2={cx - r * 0.15} y2={cy - r * 0.12} stroke={strokeColor} strokeWidth={2.8} strokeLinecap="round" />
          <line x1={cx + r * 0.5} y1={cy - r * 0.25} x2={cx + r * 0.15} y2={cy - r * 0.12} stroke={strokeColor} strokeWidth={2.8} strokeLinecap="round" />

          {/* Focused eyes */}
          <circle cx={cx - r * 0.3} cy={cy} r={r * 0.14} fill="#FFFFFF" />
          <circle cx={cx + r * 0.3} cy={cy} r={r * 0.14} fill="#FFFFFF" />
          <circle cx={cx - r * 0.28} cy={cy} r={r * 0.06} fill="#0A0F1D" />
          <circle cx={cx + r * 0.28} cy={cy} r={r * 0.06} fill="#0A0F1D" />

          {/* Determined mouth */}
          <line x1={cx - r * 0.22} y1={cy + r * 0.32} x2={cx + r * 0.22} y2={cy + r * 0.32} stroke={strokeColor} strokeWidth={2.6} strokeLinecap="round" />
        </g>
      );

    case "smug":
      return (
        <g id="face-smug">
          {/* Raised one eyebrow */}
          <path d={`M${cx - r * 0.48} ${cy - r * 0.2} Q${cx - r * 0.3} ${cy - r * 0.38} ${cx - r * 0.12} ${cy - r * 0.2}`} fill="none" stroke={strokeColor} strokeWidth={2.6} strokeLinecap="round" />
          <line x1={cx + r * 0.12} y1={cy - r * 0.15} x2={cx + r * 0.45} y2={cy - r * 0.12} stroke={strokeColor} strokeWidth={2.2} strokeLinecap="round" />

          {/* Half-lidded sideways eyes */}
          <path d={`M${cx - r * 0.42} ${cy - r * 0.05} Q${cx - r * 0.28} ${cy + r * 0.12} ${cx - r * 0.15} ${cy - r * 0.05}`} fill="none" stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round" />
          <path d={`M${cx + r * 0.15} ${cy - r * 0.05} Q${cx + r * 0.28} ${cy + r * 0.12} ${cx + r * 0.42} ${cy - r * 0.05}`} fill="none" stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round" />

          {/* Cheeky corner smirk */}
          <path d={`M${cx - r * 0.1} ${cy + r * 0.28} Q${cx + r * 0.15} ${cy + r * 0.35} ${cx + r * 0.32} ${cy + r * 0.18}`} fill="none" stroke={strokeColor} strokeWidth={2.8} strokeLinecap="round" />
        </g>
      );

    case "shocked":
      return (
        <g id="face-shocked">
          {/* High raised round eyes */}
          <circle cx={cx - r * 0.3} cy={cy - r * 0.08} r={r * 0.18} fill="#FFFFFF" stroke={darkStroke} strokeWidth={1} />
          <circle cx={cx + r * 0.3} cy={cy - r * 0.08} r={r * 0.18} fill="#FFFFFF" stroke={darkStroke} strokeWidth={1} />
          <circle cx={cx - r * 0.3} cy={cy - r * 0.08} r={r * 0.06} fill="#000" />
          <circle cx={cx + r * 0.3} cy={cy - r * 0.08} r={r * 0.06} fill="#000" />

          {/* Wide open 'O' mouth */}
          <ellipse cx={cx} cy={cy + r * 0.32} rx={r * 0.15} ry={r * 0.22} fill="#FFFFFF" stroke={darkStroke} strokeWidth={1.5} />
        </g>
      );

    case "curious":
      return (
        <g id="face-curious">
          {/* Inquisitive eyes, one slightly wider */}
          <circle cx={cx - r * 0.28} cy={cy - r * 0.06} r={r * 0.18} fill="#FFFFFF" />
          <circle cx={cx - r * 0.26} cy={cy - r * 0.06} r={r * 0.07} fill="#111" />
          <circle cx={cx + r * 0.28} cy={cy - r * 0.04} r={r * 0.14} fill="#FFFFFF" />
          <circle cx={cx + r * 0.28} cy={cy - r * 0.04} r={r * 0.06} fill="#111" />

          {/* Small inquisitive mouth */}
          <circle cx={cx + r * 0.05} cy={cy + r * 0.28} r={r * 0.08} fill="#FFFFFF" />
        </g>
      );

    default:
      return null;
  }
};


```

---

## <a id="srcstickstickfiguretsx"></a> File: `src/stick/StickFigure.tsx`

```tsx
// Path: src/stick/StickFigure.tsx
import React from "react";
import { StickFigureProps, StickPose } from "./types";
import { STICK_DESIGNS } from "./designs";
import { StickFace } from "./StickFace";

export const StickFigure: React.FC<StickFigureProps> = ({
  character,
  mode = "full",
  pose = "signature",
  expression,
  showFace = false,
  facing = "right",
  width = 240,
  height = 440,
  strokeWidth = 20,
  glow = true,
  shading = true,
  animate = false,
  frame = 0,
  animationOffset = 0,
  className,
  style,
}) => {
  const d = STICK_DESIGNS[character];
  const t = frame + animationOffset;
  const breath = animate ? Math.sin(t * 0.08) * 1.5 : 0;
  const sway = animate ? Math.sin(t * 0.05) * 1.2 : 0;

  // Active pose: if 'signature', use character-specific pose
  const resolvedPose: StickPose =
    pose === "signature"
      ? character === "red"
        ? "cheer"
        : character === "yellow"
        ? "idle"
        : character === "orange"
        ? "crossed"
        : character === "green"
        ? "listen"
        : "handsOnHip"
      : pose;

  const resolvedExpression = expression ?? (showFace ? d.defaultExpression ?? "happy" : "blank");

  // Head center and dimensions
  const headX = 120 + sway * 0.5;
  const headY = 62 + breath;
  const headRadius = d.isHollowHead ? 30 : 27;

  // Unique SVG IDs for gradients
  const gradId = `grad-${character}`;
  const sphereGradId = `sphere-${character}`;
  const glowId = `glow-${character}`;

  // If headOnly mode is requested, render a focused close-up square viewBox
  const isHeadOnly = mode === "headOnly";
  const viewBox = isHeadOnly ? "50 0 140 140" : "0 0 240 440";

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      role="img"
      aria-label={`${d.name} Stick Figure`}
      className={className}
      style={{
        overflow: "visible",
        display: "block",
        filter: glow ? `drop-shadow(0 8px 24px ${d.color}44)` : undefined,
        ...style,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 3D Tubular Linear Gradient for Limbs */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={d.lightColor} />
          <stop offset="45%" stopColor={d.color} />
          <stop offset="100%" stopColor={d.shadowColor} />
        </linearGradient>

        {/* 3D Spherical Radial Gradient for Head */}
        <radialGradient id={sphereGradId} cx="36%" cy="32%" r="68%">
          <stop offset="0%" stopColor={d.lightColor} />
          <stop offset="55%" stopColor={d.color} />
          <stop offset="100%" stopColor={d.shadowColor} />
        </radialGradient>

        {/* Ambient colored rim glow */}
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={d.color} floodOpacity="0.35" />
        </filter>
      </defs>

      <g
        transform={
          facing === "left"
            ? "translate(240, 0) scale(-1, 1)"
            : undefined
        }
      >
        {/* FLOOR CONTACT SHADOW (Only in full body mode) */}
        {!isHeadOnly && (
          <ellipse cx="120" cy="422" rx="46" ry="8" fill="#000000" opacity="0.25" />
        )}

        {/* SHOULDERS IN HEAD-ONLY MODE */}
        {isHeadOnly && (
          <g
            stroke={shading ? `url(#${gradId})` : d.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <line x1={headX} y1={headY + headRadius + 4} x2={headX} y2={headY + headRadius + 40} />
            <path d={`M${headX - 40} ${headY + headRadius + 30} Q${headX} ${headY + headRadius + 18} ${headX + 40} ${headY + headRadius + 30}`} />
          </g>
        )}

        {/* ==================================================== */}
        {/* BODY & LIMBS (FULL MODE ONLY)                        */}
        {/* ==================================================== */}
        {!isHeadOnly && (
          <>
            {/* 1. CHEER (Red's signature pose: victory arms \O/ & athletic legs) */}
            {resolvedPose === "cheer" && (
              <g
                stroke={shading ? `url(#${gradId})` : d.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                {/* Torso */}
                <line x1={120 + sway} y1={98 + breath} x2={118} y2={228} />

                {/* Left Arm: Raised high up & left with gentle curve */}
                <path d={`M${120 + sway} ${106 + breath} Q68 62 44 16`} />

                {/* Right Arm: Reaching up, curving slightly inward */}
                <path d={`M${120 + sway} ${106 + breath} Q152 56 142 14`} />

                {/* Left Leg: Athletic wide stance */}
                <path d="M118 228 L64 416" />

                {/* Right Leg: Athletic wide stance */}
                <path d="M118 228 L164 416" />
              </g>
            )}

            {/* 2. IDLE / READY (Yellow's signature pose: curved side arms & grounded stance) */}
            {resolvedPose === "idle" && (
              <g
                stroke={shading ? `url(#${gradId})` : d.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                {/* Torso */}
                <line x1={120 + sway} y1={98 + breath} x2={120} y2={230} />

                {/* Left Arm: Curved gently outward and down */}
                <path d={`M${120 + sway} ${108 + breath} Q74 155 74 218`} />

                {/* Right Arm: Curved gently outward and down */}
                <path d={`M${120 + sway} ${108 + breath} Q166 155 166 218`} />

                {/* Left Leg: Confident solid stance */}
                <path d="M120 230 L84 416" />

                {/* Right Leg: Solid grounded right */}
                <path d="M120 230 L156 416" />
              </g>
            )}

            {/* 3. CROSSED (Orange / TSC's signature pose: natural folded arms across chest) */}
            {resolvedPose === "crossed" && (
              <g
                stroke={shading ? `url(#${gradId})` : d.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                {/* Torso running all the way down */}
                <line x1={120 + sway} y1={98 + breath} x2={120} y2={228} />

                {/* Legs: Left straight, right kicked out */}
                <path d="M120 228 L114 416" />
                <path d="M120 228 L176 416" />

                {/* Arms: Natural folded cross pose in front of chest */}
                {/* Left arm: shoulder -> down to elbow -> folded across */}
                <path d={`M${120 + sway} ${108 + breath} Q74 135 82 165 L158 165`} />
                {/* Right arm: shoulder -> down to elbow -> folded over top */}
                <path d={`M${120 + sway} ${108 + breath} Q166 135 158 165 L84 165`} />
              </g>
            )}

            {/* 4. LISTEN / DANCING (Green's signature pose: hand on headphone + dancer legs) */}
            {resolvedPose === "listen" && (
              <g
                stroke={shading ? `url(#${gradId})` : d.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                {/* Curved Torso showing rhythm */}
                <path d={`M${120 + sway} ${98 + breath} Q138 160 132 228`} />

                {/* Left Arm: Touching/adjusting headphone */}
                <path d={`M${120 + sway} ${106 + breath} Q78 124 88 66`} />

                {/* Right Arm: Relaxed behind hip */}
                <path d={`M${120 + sway} ${106 + breath} Q168 142 152 212`} />

                {/* Left Leg: Iconic angular dancing knee kick */}
                <path d="M132 228 Q74 290 76 315 Q98 370 82 416" />

                {/* Right Leg: Supporting step */}
                <path d="M132 228 Q124 320 110 416" />
              </g>
            )}

            {/* 5. HANDS ON HIP (Blue's signature pose: hand firmly on hip with crisp acute elbow) */}
            {resolvedPose === "handsOnHip" && (
              <g
                stroke={shading ? `url(#${gradId})` : d.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                {/* Torso */}
                <line x1={120 + sway} y1={98 + breath} x2={120} y2={228} />

                {/* Left Arm: Relaxed at side */}
                <path d={`M${120 + sway} ${108 + breath} Q98 160 94 220`} />

                {/* Right Arm: Sharp acute triangular elbow with hand on hip */}
                <polyline points={`${120 + sway},${108 + breath} 168,152 128,216`} />

                {/* Legs: Confident straight stance */}
                <path d="M120 228 L110 416" />
                <path d="M120 228 L150 416" />
              </g>
            )}

            {/* Generic Walk Pose */}
            {resolvedPose === "walking" && (
              <g
                stroke={shading ? `url(#${gradId})` : d.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                <line x1={120 + sway} y1={98 + breath} x2={120} y2={228} />
                <path d={`M${120 + sway} ${108 + breath} Q96 158 84 216`} />
                <path d={`M${120 + sway} ${108 + breath} Q148 158 160 216`} />
                <path d="M120 228 Q100 320 78 416" />
                <path d="M120 228 Q140 320 162 416" />
              </g>
            )}
          </>
        )}

        {/* ==================================================== */}
        {/* HEAD SECTION (Solid Sphere OR Hollow Ring)           */}
        {/* ==================================================== */}
        {d.isHollowHead ? (
          // Orange / The Second Coming: Hollow Ring Head
          <circle
            cx={headX}
            cy={headY}
            r={headRadius}
            fill="none"
            stroke={shading ? `url(#${gradId})` : d.color}
            strokeWidth={15}
            filter={`url(#${glowId})`}
          />
        ) : (
          // Solid Spherical Head
          <circle
            cx={headX}
            cy={headY}
            r={headRadius}
            fill={shading ? `url(#${sphereGradId})` : d.color}
            filter={`url(#${glowId})`}
          />
        )}

        {/* ==================================================== */}
        {/* ACCESSORY: GREEN'S DJ HEADPHONES                     */}
        {/* ==================================================== */}
        {d.hasHeadphones && (
          <g id="headphones" transform={`rotate(-8, ${headX}, ${headY})`}>
            {/* Headband arch */}
            <path
              d={`M${headX - headRadius + 2} ${headY - 2} A${headRadius + 2} ${headRadius + 2} 0 0 1 ${headX + headRadius - 2} ${headY - 2}`}
              fill="none"
              stroke="#1E232A"
              strokeWidth={8}
              strokeLinecap="round"
            />
            <path
              d={`M${headX - headRadius + 4} ${headY - 2} A${headRadius} ${headRadius} 0 0 1 ${headX + headRadius - 4} ${headY - 2}`}
              fill="none"
              stroke="#475569"
              strokeWidth={2.5}
              strokeLinecap="round"
            />

            {/* Left Earcup */}
            <g transform={`translate(${headX - headRadius - 2}, ${headY + 2}) rotate(8)`}>
              <rect x="-8" y="-14" width="14" height="28" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              <rect x="-5" y="-10" width="8" height="20" rx="4" fill="#1E293B" />
            </g>

            {/* Right Earcup */}
            <g transform={`translate(${headX + headRadius + 2}, ${headY + 2}) rotate(-8)`}>
              <rect x="-6" y="-14" width="14" height="28" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              <rect x="-3" y="-10" width="8" height="20" rx="4" fill="#1E293B" />
            </g>
          </g>
        )}

        {/* ==================================================== */}
        {/* FACIAL EXPRESSIONS (FOR CLOSE-UPS / EXPRESSIVE MODE) */}
        {/* ==================================================== */}
        {showFace && (
          <StickFace
            character={character}
            expression={resolvedExpression}
            headRadius={headRadius}
            headCenter={{ x: headX, y: headY }}
            isHollowHead={d.isHollowHead}
          />
        )}
      </g>
    </svg>
  );
};

export default StickFigure;

```

---

## <a id="srcstickdesignsts"></a> File: `src/stick/designs.ts`

```tsx
// Path: src/stick/designs.ts
import { StickCharacterId, StickDesign } from "./types";

export const STICK_DESIGNS: Record<StickCharacterId, StickDesign> = {
  red: {
    id: "red",
    name: "Red",
    role: "The Martial Artist & Beast Tamer",
    color: "#E52521",
    lightColor: "#FF5A57",
    shadowColor: "#9E100E",
    isHollowHead: false,
    personality: "Passionate, energetic, combat specialist",
    defaultExpression: "angry",
  },
  yellow: {
    id: "yellow",
    name: "Yellow",
    role: "The Tech & Redstone Engineer",
    color: "#F6BC14",
    lightColor: "#FFE066",
    shadowColor: "#B58404",
    isHollowHead: false,
    personality: "Intelligent, creative, curious, staff wielder",
    defaultExpression: "curious",
  },
  orange: {
    id: "orange",
    name: "The Second Coming (Orange)",
    role: "The Chosen One & Creative Leader",
    color: "#FF6E1A",
    lightColor: "#FFA463",
    shadowColor: "#BA4302",
    isHollowHead: true, // Signature hollow ring head
    personality: "Heroic, confident, awaken power",
    defaultExpression: "determined",
  },
  green: {
    id: "green",
    name: "Green",
    role: "The Musician & Dynamic Dancer",
    color: "#4CD918",
    lightColor: "#84F35C",
    shadowColor: "#2B8709",
    isHollowHead: false,
    hasHeadphones: true, // Signature black over-ear DJ headphones
    personality: "Musical, rhythmic, joyful, stylish",
    defaultExpression: "happy",
  },
  blue: {
    id: "blue",
    name: "Blue",
    role: "The Netherwart Brewer & Speedster",
    color: "#1BB7F5",
    lightColor: "#6DE0FF",
    shadowColor: "#0873A6",
    isHollowHead: false,
    personality: "Sassy, agile, fast, confident",
    defaultExpression: "smug",
  },
};

export const STICK_CHARACTER_IDS: StickCharacterId[] = [
  "red",
  "yellow",
  "orange",
  "green",
  "blue",
];


```

---

## <a id="srcsticktypests"></a> File: `src/stick/types.ts`

```tsx
// Path: src/stick/types.ts
import React from "react";

export type StickCharacterId = "red" | "yellow" | "orange" | "green" | "blue";

export type StickPose =
  | "signature" // Exactly matches the reference image for each character
  | "idle"
  | "crossed"
  | "handsOnHip"
  | "cheer"
  | "listen"
  | "walking"
  | "running"
  | "combat";

export type StickExpression =
  | "blank" // Classic faceless stickman
  | "happy"
  | "angry"
  | "determined"
  | "smug"
  | "shocked"
  | "curious"
  | "cool";

export interface StickDesign {
  id: StickCharacterId;
  name: string;
  role: string;
  color: string;
  lightColor: string;
  shadowColor: string;
  isHollowHead?: boolean; // True for Orange / The Second Coming
  hasHeadphones?: boolean; // True for Green
  defaultExpression?: StickExpression;
  personality: string;
}

export interface StickFigureProps {
  character: StickCharacterId;
  mode?: "full" | "headOnly"; // "headOnly" for perfect close-up portrait shots
  pose?: StickPose;
  expression?: StickExpression;
  showFace?: boolean; // For close-up shots
  facing?: "left" | "right";
  width?: number | string;
  height?: number | string;
  strokeWidth?: number;
  glow?: boolean;
  shading?: boolean; // 3D tubular lighting gradient
  animate?: boolean;
  frame?: number;
  animationOffset?: number;
  className?: string;
  style?: React.CSSProperties;
}

```

---

## <a id="srcsticksixfriendsshowcasetsx"></a> File: `src/stick/SixFriendsShowcase.tsx`

```tsx
// Path: src/stick/SixFriendsShowcase.tsx
import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { FriendStickFigure } from "./FriendStickFigure";
import { FRIEND_DESIGNS, FRIEND_IDS } from "./friendDesigns";

export const SixFriendsLineup: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#090C12",
        background: "radial-gradient(ellipse at 50% 35%, #182030 0%, #07090E 80%)",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#FFFFFF",
        padding: "46px 64px 38px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Background Subtle Tech Matrix Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.65,
          pointerEvents: "none",
        }}
      />

      {/* Top Header Banner */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 20 }}>
        <div
          style={{
            display: "inline-block",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 4,
            padding: "6px 20px",
            borderRadius: 20,
            background: "rgba(56, 189, 248, 0.12)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            color: "#38BDF8",
            marginBottom: 10,
            textTransform: "uppercase",
          }}
        >
          THE SIX FRIENDS // PROCEDURAL STICK IDENTITIES
        </div>
        <h1
          style={{
            fontSize: 44,
            fontWeight: 900,
            letterSpacing: 3,
            color: "#FFFFFF",
            margin: 0,
            textShadow: "0 4px 24px rgba(0,0,0,0.8), 0 0 32px rgba(255,255,255,0.15)",
          }}
        >
          SIX FRIENDS ENSEMBLE ROSTER
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#94A3B8",
            letterSpacing: 2,
            margin: "8px 0 0",
            fontWeight: 600,
          }}
        >
          VOLUMETRIC 3D LIGHTING • SIGNATURE HAIR & ACCESSORIES • REUSABLE OVER ANY BACKGROUND
        </p>
      </div>

      {/* Center Hero Stage: 6 Friends Side-by-Side */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          position: "relative",
          margin: "16px 0",
          zIndex: 10,
        }}
      >
        {/* Floor Horizon Volumetric Glow */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: "2%",
            right: "2%",
            height: 70,
            background: "radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.18) 0%, transparent 80%)",
            filter: "blur(24px)",
            pointerEvents: "none",
          }}
        />

        {FRIEND_IDS.map((id, index) => {
          const d = FRIEND_DESIGNS[id];
          return (
            <div
              key={id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                maxWidth: 290,
                position: "relative",
              }}
            >
              {/* Individual Character Colored Spotlight Halo */}
              <div
                style={{
                  position: "absolute",
                  bottom: 25,
                  width: 140,
                  height: 35,
                  borderRadius: "50%",
                  background: `radial-gradient(ellipse, ${d.color}66 0%, transparent 75%)`,
                  filter: "blur(14px)",
                  zIndex: 1,
                }}
              />

              {/* Stick Figure Component */}
              <div style={{ position: "relative", zIndex: 10 }}>
                <FriendStickFigure
                  friend={id}
                  width={265}
                  height={480}
                  glow={true}
                  shading={true}
                />
              </div>

              {/* Character Identity Card Box */}
              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(10,14,22,0.85))",
                  border: `1px solid ${d.color}55`,
                  borderRadius: 14,
                  padding: "10px 14px",
                  width: "88%",
                  boxShadow: `0 8px 20px rgba(0,0,0,0.5), 0 0 16px ${d.color}22`,
                  backdropFilter: "blur(8px)",
                  position: "relative",
                  zIndex: 20,
                }}
              >
                {/* Name Header with Glowing Indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      backgroundColor: d.color,
                      boxShadow: `0 0 10px ${d.lightColor}`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      letterSpacing: 2,
                      color: "#FFFFFF",
                    }}
                  >
                    {d.name.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: d.lightColor,
                      background: "rgba(255,255,255,0.08)",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    #{index + 1}
                  </span>
                </div>

                {/* Trait Specification (Exact Match from User Prompt) */}
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 0.8,
                    color: d.lightColor,
                    textAlign: "center",
                    marginTop: 2,
                  }}
                >
                  {d.trait}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Technical Status Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 2,
          color: "#64748B",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 16,
          position: "relative",
          zIndex: 20,
        }}
      >
        <span>STANDALONE TRANSPARENT SVG OVERLAY CAPABLE</span>
        <span style={{ color: "#10B981" }}>● 6 FRIENDS COMPILED // READY FOR ANY BACKGROUND</span>
      </div>
    </AbsoluteFill>
  );
};

export const SixFriendsLineupComposition: React.FC = () => {
  return (
    <Composition
      id="SixFriendsLineup"
      component={SixFriendsLineup}
      durationInFrames={30}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

```

---

## <a id="srcstickmeeraphotoscenetsx"></a> File: `src/stick/MeeraPhotoScene.tsx`

```tsx
// Path: src/stick/MeeraPhotoScene.tsx
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FriendStickFigure } from "./FriendStickFigure";

export const MeeraPhotoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera Flash burst at frame 85
  const flashOpacity =
    frame >= 83 && frame <= 91
      ? interpolate(frame, [83, 85, 91], [0, 0.96, 0])
      : 0;

  // Viewfinder bracket spring
  const focusSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14 },
  });

  // Photo snapshot slide in from frame 95
  const photoSpring = spring({
    frame: frame - 95,
    fps,
    config: { damping: 15, mass: 0.8 },
  });
  const photoScale = interpolate(photoSpring, [0, 1], [0.85, 1]);
  const photoY = interpolate(photoSpring, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080B10",
        background: "radial-gradient(ellipse at 50% 40%, #151C28 0%, #06080D 85%)",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        color: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* Studio Background Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.6,
        }}
      />

      {/* Audio SFX */}
      <Sequence from={0}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={35}>
        <Audio src={staticFile("sfx/slide.mp3")} volume={0.6} />
      </Sequence>
      {/* Shutter Click at Frame 85 */}
      <Sequence from={84}>
        <Audio src={staticFile("sfx/ping.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={95}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.7} />
      </Sequence>

      {/* Title Header */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              background: "rgba(244, 114, 182, 0.15)",
              border: "1px solid rgba(244, 114, 182, 0.4)",
              color: "#F472B6",
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: 2,
            }}
          >
            MEERA'S FIELD OPTICS
          </div>
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: 1.5, color: "#FFFFFF" }}>
            GROUP PHOTO MOMENT
          </span>
        </div>

        {/* Viewfinder HUD Status */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: frame % 30 < 15 ? "#EF4444" : "transparent",
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: "#E2E8F0" }}>
              REC [4K 60FPS]
            </span>
          </div>
          <span
            style={{
              fontSize: 12,
              color: "#38BDF8",
              background: "rgba(56, 189, 248, 0.12)",
              padding: "4px 10px",
              borderRadius: 6,
              border: "1px solid rgba(56, 189, 248, 0.3)",
              fontWeight: 700,
            }}
          >
            ISO 100 • f/2.8 • 1/250s
          </span>
        </div>
      </div>

      {/* MAIN STAGE */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "0 80px 100px",
        }}
      >
        {/* ================================================= */}
        {/* LEFT: MEERA TAKING PHOTO                         */}
        {/* ================================================= */}
        <div
          style={{
            position: "relative",
            zIndex: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Meera Spotlight */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              width: 160,
              height: 40,
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(244, 114, 182, 0.4) 0%, transparent 75%)",
              filter: "blur(14px)",
            }}
          />

          <FriendStickFigure
            friend="meera"
            pose="takingPhoto"
            width={280}
            height={490}
            animate={true}
            frame={frame}
          />

          {/* Photographer Label */}
          <div
            style={{
              marginTop: 10,
              padding: "6px 14px",
              background: "rgba(125, 51, 76, 0.25)",
              border: "1px solid rgba(244, 114, 182, 0.5)",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 2,
              color: "#F472B6",
            }}
          >
            MEERA // PHOTO RIG
          </div>
        </div>

        {/* ================================================= */}
        {/* CENTER-RIGHT: THE REMAINING 5 FRIENDS POSING      */}
        {/* (Arjun, Dev, Rahul, Kabir, Nisha)                */}
        {/* ================================================= */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 16,
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Group Floor Glow */}
          <div
            style={{
              position: "absolute",
              bottom: 25,
              left: -30,
              right: -30,
              height: 60,
              background: "radial-gradient(ellipse, rgba(56, 189, 248, 0.25) 0%, transparent 80%)",
              filter: "blur(20px)",
            }}
          />

          {/* 1. ARJUN (Olive green, messy hair, satchel bag) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FriendStickFigure
              friend="arjun"
              width={245}
              height={460}
              animate={true}
              frame={frame}
              animationOffset={0}
            />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#A3BD82", marginTop: 4 }}>
              ARJUN
            </span>
          </div>

          {/* 2. DEV (Navy blue, curly hair, hand on hip) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FriendStickFigure
              friend="dev"
              width={245}
              height={460}
              animate={true}
              frame={frame}
              animationOffset={15}
            />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#60A5FA", marginTop: 4 }}>
              DEV
            </span>
          </div>

          {/* 3. RAHUL (Rust orange, broad shoulders, hands on hips) - CENTER ANCHOR */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FriendStickFigure
              friend="rahul"
              width={275}
              height={470}
              animate={true}
              frame={frame}
              animationOffset={30}
            />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#FB923C", marginTop: 4 }}>
              RAHUL
            </span>
          </div>

          {/* 4. KABIR (Teal, glasses, holding book) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FriendStickFigure
              friend="kabir"
              width={245}
              height={480}
              animate={true}
              frame={frame}
              animationOffset={45}
            />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#2DD4BF", marginTop: 4 }}>
              KABIR
            </span>
          </div>

          {/* 5. NISHA (Mustard yellow, short bob, hand on hip) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FriendStickFigure
              friend="nisha"
              width={245}
              height={460}
              animate={true}
              frame={frame}
              animationOffset={60}
            />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#FACC15", marginTop: 4 }}>
              NISHA
            </span>
          </div>

          {/* Camera Viewfinder Focus Reticle Overlay (Frame 20 - 84) */}
          {frame < 85 && (
            <div
              style={{
                position: "absolute",
                inset: "-20px -20px 20px -20px",
                border: "2px solid rgba(56, 189, 248, 0.4)",
                borderRadius: 24,
                pointerEvents: "none",
                transform: `scale(${interpolate(focusSpring, [0, 1], [1.1, 1])})`,
                opacity: focusSpring,
              }}
            >
              {/* Corner brackets */}
              <div style={{ position: "absolute", top: -2, left: -2, width: 32, height: 32, borderTop: "4px solid #38BDF8", borderLeft: "4px solid #38BDF8" }} />
              <div style={{ position: "absolute", top: -2, right: -2, width: 32, height: 32, borderTop: "4px solid #38BDF8", borderRight: "4px solid #38BDF8" }} />
              <div style={{ position: "absolute", bottom: -2, left: -2, width: 32, height: 32, borderBottom: "4px solid #38BDF8", borderLeft: "4px solid #38BDF8" }} />
              <div style={{ position: "absolute", bottom: -2, right: -2, width: 32, height: 32, borderBottom: "4px solid #38BDF8", borderRight: "4px solid #38BDF8" }} />

              {/* Center Crosshairs */}
              <div style={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%, -50%)", width: 40, height: 40 }}>
                <div style={{ position: "absolute", top: 18, left: 0, right: 0, height: 2, background: "#38BDF8" }} />
                <div style={{ position: "absolute", left: 18, top: 0, bottom: 0, width: 2, background: "#38BDF8" }} />
              </div>

              {/* Focus Tag */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  left: 18,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: "#38BDF8",
                }}
              >
                ● AUTOFOCUS LOCKED [5 TARGETS]
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogue Subtitle (Frame 10 - 80) */}
      {frame < 83 && (
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(15, 20, 30, 0.9)",
            border: "1px solid rgba(244, 114, 182, 0.4)",
            borderRadius: 16,
            padding: "10px 24px",
            fontSize: 18,
            fontWeight: 700,
            color: "#FFFFFF",
            boxShadow: "0 10px 24px rgba(0,0,0,0.6)",
            zIndex: 30,
          }}
        >
          Meera: <span style={{ color: "#F472B6" }}>"Hold still everyone! Big smiles... 3, 2, 1—"</span>
        </div>
      )}

      {/* CAMERA SHUTTER WHITE FLASH BURST (Frame 83 - 91) */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFFFF",
            opacity: flashOpacity,
            zIndex: 100,
            pointerEvents: "none",
          }}
        />
      )}

      {/* POLAROID SNAPSHOT REVEAL (Frame 92 - 180) */}
      {frame >= 92 && (
        <AbsoluteFill
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          {/* Floating Polaroid Card */}
          <div
            style={{
              transform: `scale(${photoScale}) translateY(${photoY}px) rotate(-1.5deg)`,
              opacity: photoSpring,
              background: "#FFFFFF",
              padding: "24px 24px 44px",
              borderRadius: 18,
              boxShadow: "0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(244, 114, 182, 0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 1050,
            }}
          >
            {/* The Photo Image Inside Frame */}
            <div
              style={{
                width: "100%",
                height: 480,
                borderRadius: 10,
                background: "radial-gradient(ellipse at 50% 50%, #1E293B 0%, #0F172A 100%)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-around",
                padding: "0 30px 20px",
                overflow: "hidden",
                border: "2px solid rgba(0,0,0,0.1)",
                position: "relative",
              }}
            >
              {/* Captured Photo of the 5 Friends */}
              <FriendStickFigure friend="arjun" width={180} height={340} />
              <FriendStickFigure friend="dev" width={180} height={340} />
              <FriendStickFigure friend="rahul" width={205} height={350} />
              <FriendStickFigure friend="kabir" width={180} height={355} />
              <FriendStickFigure friend="nisha" width={180} height={340} />

              {/* Photo Watermark Tag */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 18,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: "#94A3B8",
                  background: "rgba(0,0,0,0.5)",
                  padding: "4px 10px",
                  borderRadius: 6,
                }}
              >
                SHOT BY MEERA • 4K
              </div>
            </div>

            {/* Handwritten Style Caption at Bottom of Polaroid */}
            <div
              style={{
                marginTop: 22,
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: 3,
                color: "#1E293B",
                textAlign: "center",
              }}
            >
              THE SQUAD • FOREVER FRIENDS ❤️
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 2,
                color: "#64748B",
                marginTop: 4,
              }}
            >
              ARJUN • DEV • RAHUL • MEERA • KABIR • NISHA
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const MeeraPhotoComposition: React.FC = () => {
  return (
    <Composition
      id="MeeraPhotoScene"
      component={MeeraPhotoScene}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};


```

---

## <a id="srcstickindexts"></a> File: `src/stick/index.ts`

```tsx
// Path: src/stick/index.ts
export { StickFigure, default } from "./StickFigure";
export { StickFace } from "./StickFace";
export { STICK_DESIGNS, STICK_CHARACTER_IDS } from "./designs";
export {
  SingleStickShowcase,
  StickLineupShowcase,
  StickOnBackgroundShowcase,
  StickRedComposition,
  StickYellowComposition,
  StickOrangeComposition,
  StickGreenComposition,
  StickBlueComposition,
  StickLineupComposition,
  StickOnBackgroundComposition,
} from "./StickShowcase";
export { FriendStickFigure } from "./FriendStickFigure";
export { FRIEND_DESIGNS, FRIEND_IDS } from "./friendDesigns";
export { SixFriendsLineup, SixFriendsLineupComposition } from "./SixFriendsShowcase";
export { MeeraPhotoScene, MeeraPhotoComposition } from "./MeeraPhotoScene";
export type {
  StickCharacterId,
  StickDesign,
  StickExpression,
  StickFigureProps,
  StickPose,
} from "./types";
export type { FriendId, FriendDesign } from "./friendDesigns";
export type { FriendStickFigureProps } from "./FriendStickFigure";

```

---

## <a id="srccharacterscharactertsx"></a> File: `src/characters/Character.tsx`

```tsx
// Path: src/characters/Character.tsx
import React from "react";
import { useCurrentFrame } from "remotion";
import { DESIGNS } from "./designs";
import { Arm, Body, defs, Hair, Head, Legs } from "./geometry";
import { CharacterProps, View } from "./types";

function viewScale(view: View) {
  if (view === "side") return "translate(18 0) scale(.88 1)";
  if (view === "threeQuarter") return "translate(7 0) scale(.96 1)";
  return "";
}

export const Character: React.FC<CharacterProps> = ({
  id,
  emotion = "neutral",
  pose = "idle",
  view = "front",
  gaze = "center",
  facing = "right",
  width = 300,
  height = 525,
  frame,
  animate = true,
  animationOffset = 0,
  className,
  style,
}) => {
  const currentFrame = useCurrentFrame();
  const f = frame ?? currentFrame;
  const d = DESIGNS[id];
  const t = f + animationOffset;

  const walking = animate && pose === "walking";
  const talking = animate && pose === "talking";
  const idle = animate && pose === "idle";

  const bob = walking
    ? Math.sin(t * 0.35) * 4
    : idle
      ? Math.sin(t * 0.08) * 1.5
      : 0;

  const legSwing = walking ? Math.sin(t * 0.35) * 24 : 0;
  const armSwing = walking ? Math.sin(t * 0.35 + Math.PI) * 19 : 0;
  const breath = animate ? Math.sin(t * 0.09) * 1.4 : 0;
  const blink = animate && (t % 137 < 4 || (t + 43) % 191 < 4);

  const armPoseLeft = pose === "armsCrossed" ? "cross" : "idle";
  const armPoseRight =
    pose === "phone" ? "phone" :
    pose === "camera" ? "camera" :
    pose === "armsCrossed" ? "cross" : "idle";

  return (
    <svg
      viewBox="0 0 240 420"
      width={width}
      height={height}
      role="img"
      aria-label={d.name}
      className={className}
      style={{ overflow: "visible", display: "block", ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {defs}
      <g transform={facing === "left" ? "translate(240 0) scale(-1 1)" : undefined}>
        <g transform={`${viewScale(view)} translate(0 ${bob})`}>
          {/* floor shadow */}
          <ellipse cx="120" cy="407" rx="53" ry="8" fill="#000" opacity=".34" />
          {/* legs */}
          <g transform={`translate(0 ${breath})`}>
            <Legs
              d={d}
              leftAngle={legSwing}
              rightAngle={-legSwing}
            />
          </g>
          {/* rear arm */}
          <Arm
            d={d}
            side="left"
            angle={walking ? -armSwing : pose === "armsCrossed" ? 0 : 2}
            pose={armPoseLeft}
          />
          {/* torso and clothing */}
          <g transform={`translate(0 ${-breath})`}>
            <Body d={d} view={view} />
          </g>
          {/* front arm */}
          <Arm
            d={d}
            side="right"
            angle={walking ? armSwing : talking ? Math.sin(t * .16) * 8 : 0}
            pose={armPoseRight}
          />
          {/* head group */}
          <g transform={`translate(0 ${talking ? Math.sin(t * .3) * 1.2 : 0})`}>
            <Head d={d} emotion={emotion} gaze={gaze} view={view} blink={blink} />
            <Hair d={d} view={view} />
          </g>
          {/* Meera's camera body and strap */}
          {id === "meera" && (
            <g>
              <path d="M147 170 Q173 184 179 213" fill="none" stroke="#25232A" strokeWidth="4" />
              <g transform="translate(157 215) rotate(-7)">
                <rect x="-18" y="-11" width="37" height="25" rx="5" fill="#20252B" stroke="#78818A" strokeWidth="2" />
                <circle cx="1" cy="1" r="8" fill="#10151B" stroke="#A4AFB8" strokeWidth="2.5" />
                <circle cx="1" cy="1" r="3" fill="#526B80" />
                <rect x="-11" y="-15" width="11" height="5" rx="2" fill="#505A63" />
              </g>
            </g>
          )}
          {/* Arjun's phone is fixed to his visual identity, shown at his hip when not in phone pose */}
          {id === "arjun" && pose === "idle" && (
            <g transform="translate(180 257) rotate(-12)">
              <rect x="-10" y="-29" width="22" height="39" rx="4" fill="#10151B" stroke="#929AA1" strokeWidth="2" />
              <rect x="-7" y="-25" width="16" height="30" rx="2" fill="#26333E" />
              <path d="M-5 -22 L7 3" stroke="#C8CDD1" strokeWidth="1.5" opacity=".9" />
              <circle cx="1" cy="7" r="1.2" fill="#9AA2A8" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
};

export default Character;

```

---

## <a id="srccharactersgeometrytsx"></a> File: `src/characters/geometry.tsx`

```tsx
// Path: src/characters/geometry.tsx
import { CharacterDesign, Emotion, Gaze, View } from "./types";

export const defs = (
  <defs>
    <linearGradient id="skinShade" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity=".16" />
      <stop offset=".48" stopColor="#FFFFFF" stopOpacity="0" />
      <stop offset="1" stopColor="#000000" stopOpacity=".18" />
    </linearGradient>
    <linearGradient id="fabricShade" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity=".16" />
      <stop offset=".45" stopColor="#FFFFFF" stopOpacity=".02" />
      <stop offset="1" stopColor="#000000" stopOpacity=".22" />
    </linearGradient>
    <linearGradient id="hairShade" x1="0" y1="0" x2="0.8" y2="1">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity=".12" />
      <stop offset=".55" stopColor="#FFFFFF" stopOpacity="0" />
      <stop offset="1" stopColor="#000000" stopOpacity=".35" />
    </linearGradient>
    <filter id="softShadow" x="-40%" y="-30%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="3" />
    </filter>
  </defs>
);

export function Body({
  d, view,
}: { d: CharacterDesign; view: View }) {
  const broad = d.build === "broad";
  const slim = d.build === "slim";
  const torsoLeft = broad ? 76 : slim ? 85 : 81;
  const torsoRight = broad ? 164 : slim ? 155 : 159;
  const neckX = view === "side" ? 112 : 108;

  return (
    <g>
      {/* neck and subtle collar shadow */}
      <path d={`M${neckX} 132 L${neckX+27} 132 L${neckX+27} 177 Q${neckX+13} 188 ${neckX} 177 Z`}
        fill={d.skinShadow} />
      <path d={`M${neckX+3} 132 L${neckX+24} 132 L${neckX+22} 170 Q${neckX+13} 177 ${neckX+4} 169 Z`}
        fill={d.skin} />
      {/* shirt silhouette */}
      <path d={`M${torsoLeft+15} 158 Q120 143 ${torsoRight-15} 158
        L${torsoRight+1} 280 Q120 299 ${torsoLeft-1} 280 Z`}
        fill={d.shirt} />
      {/* jacket panels */}
      <path d={`M${torsoLeft+15} 158 Q${torsoLeft} 160 ${torsoLeft-7} 180
        L${torsoLeft-16} 271 Q${torsoLeft-6} 286 ${torsoLeft+14} 282
        L111 184 Z`} fill={d.jacket} />
      <path d={`M${torsoRight-15} 158 Q${torsoRight} 160 ${torsoRight+7} 180
        L${torsoRight+16} 271 Q${torsoRight+6} 286 ${torsoRight-14} 282
        L129 184 Z`} fill={d.jacket} />
      <path d={`M111 159 L120 181 L129 159 L134 280 Q120 286 106 280 Z`}
        fill={d.jacketLight} opacity=".28" />
      <path d="M120 181 L120 278" stroke="#17191D" strokeOpacity=".35" strokeWidth="2" />
      <path d={`M${torsoLeft+15} 160 L120 181 L${torsoRight-15} 160`}
        fill="none" stroke={d.accent} strokeOpacity=".58" strokeWidth="2.4" />
      {/* fabric highlights */}
      <path d={`M${torsoLeft+3} 190 Q${torsoLeft+7} 225 ${torsoLeft+1} 260`}
        fill="none" stroke="#FFFFFF" strokeOpacity=".10" strokeWidth="3" />
      <path d={`M${torsoRight-3} 190 Q${torsoRight-7} 225 ${torsoRight-1} 260`}
        fill="none" stroke="#000000" strokeOpacity=".13" strokeWidth="4" />
      <path d={`M${torsoLeft-12} 270 Q120 293 ${torsoRight+12} 270`}
        fill="none" stroke="#000000" strokeOpacity=".20" strokeWidth="3" />
      {/* zipper / seam */}
      <path d="M120 185 L120 271" stroke={d.accent} strokeOpacity=".45" strokeWidth="1" />
      <circle cx="120" cy="207" r="2" fill={d.accent} opacity=".65" />
      <circle cx="120" cy="232" r="2" fill={d.accent} opacity=".65" />
      {/* character-specific collar */}
      {d.id === "dev" && <path d="M109 158 L120 179 L131 158" fill="none" stroke="#E8DDC9" strokeWidth="5" />}
      {d.id === "arjun" && <path d="M108 160 L120 178 L132 160" fill="none" stroke="#25282D" strokeWidth="5" />}
      {d.id === "meera" && <path d="M108 161 L120 178 L132 161" fill="none" stroke={d.accent} strokeWidth="3" />}
      {d.id === "nisha" && <path d="M108 161 L120 178 L132 161" fill="none" stroke={d.accent} strokeWidth="3" />}
      <path d={`M${torsoLeft+5} 174 L${torsoLeft+13} 179`}
        stroke="#FFFFFF" strokeOpacity=".18" strokeWidth="2" />
    </g>
  );
}

export function Head({
  d, emotion, gaze, view, blink = false,
}: {
  d: CharacterDesign; emotion: Emotion; gaze: Gaze; view: View; blink?: boolean;
}) {
  const side = view === "side";
  const three = view === "threeQuarter";
  const facePath = side
    ? "M91 75 Q91 42 121 42 Q151 44 151 83 L145 116 Q137 145 116 148 Q96 139 92 111 Z"
    : "M78 79 Q78 43 120 40 Q162 43 162 79 L155 116 Q147 145 120 150 Q93 145 85 116 Z";

  const eyeY = emotion === "scared" ? 91 : 94;
  const eyeOffset = three ? 2 : 0;
  const leftEyeX = side ? 132 : 102 + eyeOffset;
  const rightEyeX = side ? 145 : 139 + eyeOffset;
  const pupilShift = gaze === "left" ? -3 : gaze === "right" ? 3 : gaze === "up" ? -2 : gaze === "down" ? 2 : 0;
  const brows: Record<Emotion, string> = {
    neutral: "M92 81 Q102 77 111 81 M130 81 Q140 77 149 81",
    worried: "M93 78 Q103 70 112 80 M130 80 Q140 70 149 78",
    angry: "M93 84 L112 77 M130 77 L149 84",
    sad: "M93 77 Q103 85 112 82 M130 82 Q140 85 149 77",
    scared: "M93 74 Q103 66 112 74 M130 74 Q140 66 149 74",
    relieved: "M93 82 Q103 78 112 82 M130 82 Q140 78 149 82",
    happy: "M93 82 Q103 76 112 82 M130 82 Q140 76 149 82",
  };
  const mouth: Record<Emotion, string> = {
    neutral: "M111 120 Q120 123 130 120",
    worried: "M111 125 Q120 114 130 125",
    angry: "M112 122 L129 122",
    sad: "M111 126 Q120 116 130 126",
    scared: "M116 118 Q120 132 125 118",
    relieved: "M111 119 Q120 124 130 119",
    happy: "M108 117 Q120 135 133 117",
  };

  return (
    <g>
      {/* ears */}
      {!side && <><ellipse cx="80" cy="101" rx="8" ry="13" fill={d.skinShadow} /><ellipse cx="160" cy="101" rx="8" ry="13" fill={d.skinShadow} /></>}
      {/* face */}
      <path d={facePath} fill={d.skin} />
      <path d="M120 45 Q151 48 157 83 L151 116 Q143 139 120 147 Q139 120 137 94 Q137 64 120 45Z"
        fill={d.skinShadow} opacity=".16" />
      <path d="M84 91 Q89 126 107 139" fill="none" stroke={d.skinLight} strokeOpacity=".22" strokeWidth="5" />
      {/* brows */}
      <path d={brows[emotion]} fill="none" stroke={d.hair} strokeWidth="4" strokeLinecap="round" />
      {/* eyes */}
      {blink ? (
        <g stroke={d.skinShadow} strokeWidth="3" strokeLinecap="round">
          <path d={`M${leftEyeX-7} ${eyeY} Q${leftEyeX} ${eyeY+2} ${leftEyeX+7} ${eyeY}`} />
          {!side && <path d={`M${rightEyeX-7} ${eyeY} Q${rightEyeX} ${eyeY+2} ${rightEyeX+7} ${eyeY}`} />}
        </g>
      ) : (
        <g>
          <ellipse cx={leftEyeX} cy={eyeY} rx={side ? 3.4 : 7} ry={emotion === "scared" ? 7 : 5.2} fill="#F1E9DE" />
          <ellipse cx={leftEyeX+pupilShift} cy={eyeY+1} rx="3" ry="4" fill="#211C1A" />
          {!side && <>
            <ellipse cx={rightEyeX} cy={eyeY} rx="7" ry={emotion === "scared" ? 7 : 5.2} fill="#F1E9DE" />
            <ellipse cx={rightEyeX+pupilShift} cy={eyeY+1} rx="3" ry="4" fill="#211C1A" />
          </>}
          <circle cx={leftEyeX+pupilShift-1} cy={eyeY-1} r="1.3" fill="#FFFFFF" />
          {!side && <circle cx={rightEyeX+pupilShift-1} cy={eyeY-1} r="1.3" fill="#FFFFFF" />}
        </g>
      )}
      {/* nose and mouth */}
      <path d={side ? "M140 98 L151 109 L140 112" : "M120 98 L116 111 L123 113"}
        fill="none" stroke={d.skinShadow} strokeWidth="2.2" strokeLinecap="round" />
      <path d={mouth[emotion]} fill="none" stroke="#713F3A" strokeWidth="3" strokeLinecap="round" />
      {/* cheek light */}
      <ellipse cx={side ? 126 : 96} cy="109" rx="9" ry="4" fill={d.skinLight} opacity=".12" />
      {/* jaw highlight */}
      <path d="M102 132 Q120 145 139 132" fill="none" stroke={d.skinLight} strokeOpacity=".25" strokeWidth="2" />
      {/* glasses */}
      {d.accessory === "glasses" && (
        <g fill="none" stroke="#17191D" strokeWidth="3">
          <rect x="91" y="85" width="24" height="18" rx="4" />
          <rect x="127" y="85" width="24" height="18" rx="4" />
          <path d="M115 92 L127 92" />
          <path d="M91 91 L84 88 M151 91 L158 88" />
        </g>
      )}
      {/* subtle freckles / beauty mark */}
      {d.id === "nisha" && <circle cx="145" cy="112" r="1.5" fill={d.skinShadow} opacity=".6" />}
      <path d="M91 119 Q99 137 115 141" fill="none" stroke="#FFFFFF" strokeOpacity=".10" strokeWidth="2" />
    </g>
  );
}

export function Hair({
  d, view,
}: { d: CharacterDesign; view: View }) {
  const c = d.hair;
  const h = d.hairHighlight;
  const side = view === "side";
  const base = side
    ? "M91 89 Q85 45 119 34 Q151 30 158 65 L151 88 Q132 64 106 77 Z"
    : "M76 87 Q69 44 105 34 Q139 24 163 51 Q174 69 163 94 L154 82 Q133 62 108 70 Q93 69 82 91 Z";

  return (
    <g>
      <path d={base} fill={c} />
      {d.hairStyle === "wavy" && <>
        <path d="M79 68 Q93 43 110 57 Q124 35 140 55 Q154 43 166 67"
          fill="none" stroke={h} strokeWidth="8" strokeLinecap="round" />
        <path d="M91 51 Q111 33 127 47" fill="none" stroke="#FFFFFF" strokeOpacity=".10" strokeWidth="3" />
        <path d="M76 81 Q73 103 82 116" fill="none" stroke={c} strokeWidth="12" />
      </>}
      {d.hairStyle === "curly" && <>
        {[86, 103, 121, 140, 157].map((x, i) =>
          <circle key={x} cx={x} cy={43 + (i % 2) * 5} r="13" fill={c} />
        )}
        {[95, 117, 143].map((x) =>
          <path key={x} d={`M${x-5} 40 q5 -8 10 0`} fill="none" stroke={h} strokeWidth="3" strokeLinecap="round" />
        )}
      </>}
      {d.hairStyle === "short" && <>
        <path d="M79 70 Q94 39 119 39 Q145 37 162 62" fill="none" stroke={h} strokeWidth="5" opacity=".45" />
        <path d="M78 81 L82 108" stroke={c} strokeWidth="10" />
      </>}
      {d.hairStyle === "longBraid" && <>
        <path d="M79 72 Q100 26 137 37 Q166 42 169 74 L160 126 L148 97 Q127 60 91 84 Z" fill={c} />
        <path d="M161 85 Q178 115 164 150 Q156 165 164 184" fill="none" stroke={c} strokeWidth="13" strokeLinecap="round" />
        <path d="M160 106 L169 116 L157 127 L168 138 L158 150 L165 161"
          fill="none" stroke={h} strokeWidth="3" strokeOpacity=".55" />
        <path d="M88 56 Q113 28 143 48" fill="none" stroke={h} strokeWidth="4" strokeOpacity=".4" />
      </>}
      {d.hairStyle === "textured" && <>
        {[91, 107, 125, 144, 158].map((x, i) =>
          <path key={x} d={`M${x} 48 q${i%2 ? 8 : -7} -12 13 -8`} fill="none" stroke={h} strokeWidth="5" strokeLinecap="round" />
        )}
      </>}
      {d.hairStyle === "bob" && <>
        <path d="M77 77 Q70 36 111 31 Q157 29 168 72 L166 139 Q151 129 150 99 Q122 81 93 101 L80 136 Z" fill={c} />
        <path d="M84 57 Q112 27 145 43" fill="none" stroke={h} strokeWidth="4" strokeOpacity=".4" />
      </>}
      <path d="M82 79 Q91 47 119 43" fill="none" stroke="url(#hairShade)" strokeWidth="8" opacity=".7" />
    </g>
  );
}

export function Legs({
  d, leftAngle = 0, rightAngle = 0,
}: { d: CharacterDesign; leftAngle?: number; rightAngle?: number }) {
  const broad = d.build === "broad";
  const legW = broad ? 23 : 19;
  return (
    <g>
      <ellipse cx="120" cy="405" rx="53" ry="8" fill="#000000" opacity=".28" filter="url(#softShadow)" />
      <g transform={`translate(101 278) rotate(${leftAngle} 0 0)`}>
        <path d={`M-${legW/2} 0 L-${legW/2-1} 76 L-${legW/2-3} 119 L${legW/2+4} 119 L${legW/2+5} 78 L${legW/2} 0 Z`}
          fill={d.pants} />
        <path d={`M-${legW/2+1} 112 Q0 106 ${legW/2+6} 114 L${legW/2+13} 125 L-${legW/2+5} 125 Z`}
          fill={d.shoes} />
        <path d={`M-${legW/2+1} 17 L-${legW/2+1} 75`} stroke="#FFFFFF" strokeOpacity=".10" strokeWidth="2" />
      </g>
      <g transform={`translate(139 278) rotate(${rightAngle} 0 0)`}>
        <path d={`M-${legW/2} 0 L-${legW/2-1} 76 L-${legW/2-3} 119 L${legW/2+4} 119 L${legW/2+5} 78 L${legW/2} 0 Z`}
          fill={d.pants} />
        <path d={`M-${legW/2+1} 112 Q0 106 ${legW/2+6} 114 L${legW/2+13} 125 L-${legW/2+5} 125 Z`}
          fill={d.shoes} />
        <path d={`M${legW/2-2} 17 L${legW/2-2} 75`} stroke="#000000" strokeOpacity=".12" strokeWidth="2" />
      </g>
    </g>
  );
}

export function Arm({
  d, side, angle = 0, pose = "idle",
}: {
  d: CharacterDesign; side: "left" | "right"; angle?: number; elbow?: number; pose?: "idle" | "phone" | "camera" | "cross";
}) {
  const isLeft = side === "left";
  const isRight = side === "right";
  const shoulderX = isLeft ? 78 : 162;
  const shoulderY = 176;
  const armColor = d.jacket;
  const skin = d.skin;
  const handX = isLeft ? -1 : 1;

  if (pose === "cross") {
    return (
      <g transform={`translate(${shoulderX} ${shoulderY}) rotate(${isLeft ? -42 : 42}) ${isRight ? "scale(-1 1)" : ""}`}>
        <path d="M0 0 Q-8 29 13 55 L49 69 L59 54 L24 34 L18 0 Z"
          fill={armColor} />
        <path d="M49 55 L66 49 L73 59 L56 73 Z" fill={skin} />
      </g>
    );
  }

  if (pose === "phone" && isRight) {
    return (
      <g transform={`translate(${shoulderX} ${shoulderY}) rotate(12)`}>
        <path d="M0 0 Q-15 25 -22 52 L-32 75 L-48 68 L-35 35 L-16 -2 Z" fill={armColor} />
        <path d="M-28 68 Q-38 60 -46 68 L-48 82 Q-38 90 -28 82 Z" fill={skin} />
        <g transform="translate(-40 56) rotate(15)">
          <rect x="-11" y="-28" width="22" height="40" rx="4" fill="#11161C" stroke="#89929A" strokeWidth="2" />
          <rect x="-8" y="-24" width="16" height="31" rx="2" fill="#293541" />
          <path d="M-6 -20 L7 6" stroke="#CBD0D4" strokeWidth="1.5" opacity=".85" />
          <circle cx="0" cy="9" r="1.3" fill="#AAB1B8" />
        </g>
      </g>
    );
  }

  if (pose === "camera" && isRight) {
    return (
      <g transform={`translate(${shoulderX} ${shoulderY}) rotate(8)`}>
        <path d="M0 0 Q-12 24 -18 50 L-26 68 L-42 62 L-30 32 L-14 -2 Z" fill={armColor} />
        <path d="M-22 62 Q-30 56 -38 63 L-40 75 Q-31 82 -22 75 Z" fill={skin} />
      </g>
    );
  }

  return (
    <g transform={`translate(${shoulderX} ${shoulderY}) rotate(${angle})`}>
      <path
        d={`M0 0 Q${handX * 2} 30 ${handX * 3} 57 L${handX * 7} 83 L${handX * 22} 82 L${handX * 19} 52 L${handX * 15} 0 Z`}
        fill={armColor}
      />
      <path d={`M${handX*7} 77 Q${handX*19} 72 ${handX*23} 84 L${handX*20} 99 Q${handX*9} 105 ${handX*3} 94 Z`}
        fill={skin} />
      <path d={`M${handX*12} 80 L${handX*13} 92`} stroke={d.skinShadow} strokeWidth="1.5" opacity=".5" />
    </g>
  );
}

```

---

## <a id="srccharactersdesignsts"></a> File: `src/characters/designs.ts`

```tsx
// Path: src/characters/designs.ts
import { CharacterDesign, CharacterId } from "./types";

export const DESIGNS: Record<CharacterId, CharacterDesign> = {
  arjun: {
    id: "arjun", name: "Arjun",
    skin: "#B97855", skinLight: "#D59A73", skinShadow: "#754631",
    hair: "#17191D", hairHighlight: "#34363B",
    shirt: "#202329", jacket: "#59664D", jacketLight: "#778568",
    pants: "#252B35", shoes: "#11151A", accent: "#A8B18F",
    build: "slim", height: 1, hairStyle: "wavy", accessory: "phone",
  },
  dev: {
    id: "dev", name: "Dev",
    skin: "#C78C69", skinLight: "#E0AD87", skinShadow: "#85563F",
    hair: "#211A18", hairHighlight: "#49342D",
    shirt: "#E0D4BE", jacket: "#334A68", jacketLight: "#526D91",
    pants: "#39404C", shoes: "#171C25", accent: "#D8C6A5",
    build: "average", height: 1, hairStyle: "curly",
  },
  rahul: {
    id: "rahul", name: "Rahul",
    skin: "#A96D4D", skinLight: "#C98963", skinShadow: "#70432F",
    hair: "#17191C", hairHighlight: "#34373A",
    shirt: "#282B31", jacket: "#87513E", jacketLight: "#A66A53",
    pants: "#252932", shoes: "#14171B", accent: "#C58B70",
    build: "broad", height: 1, hairStyle: "short",
  },
  meera: {
    id: "meera", name: "Meera",
    skin: "#C68B6A", skinLight: "#E0A887", skinShadow: "#85533F",
    hair: "#17151A", hairHighlight: "#39313B",
    shirt: "#29232B", jacket: "#713E52", jacketLight: "#995B70",
    pants: "#292832", shoes: "#17151B", accent: "#D3A3B0",
    build: "slim", height: 1, hairStyle: "longBraid", accessory: "camera",
  },
  kabir: {
    id: "kabir", name: "Kabir",
    skin: "#B77B5B", skinLight: "#D49A76", skinShadow: "#7A4D38",
    hair: "#17191E", hairHighlight: "#353A43",
    shirt: "#252A31", jacket: "#376C70", jacketLight: "#559092",
    pants: "#252B35", shoes: "#15191E", accent: "#A3D0C8",
    build: "slim", height: 1.06, hairStyle: "textured", accessory: "glasses",
  },
  nisha: {
    id: "nisha", name: "Nisha",
    skin: "#C58A68", skinLight: "#E0A786", skinShadow: "#89563F",
    hair: "#171519", hairHighlight: "#39323A",
    shirt: "#352B20", jacket: "#B18A3D", jacketLight: "#D0AD61",
    pants: "#30303A", shoes: "#1A1818", accent: "#E5C77B",
    build: "average", height: 0.98, hairStyle: "bob",
  },
};

export const CHARACTER_IDS: CharacterId[] = [
  "arjun", "dev", "rahul", "meera", "kabir", "nisha",
];

```

---

## <a id="srccharacterstypests"></a> File: `src/characters/types.ts`

```tsx
// Path: src/characters/types.ts
import React from "react";

export type CharacterId = "arjun" | "dev" | "rahul" | "meera" | "kabir" | "nisha";
export type Emotion = "neutral" | "worried" | "angry" | "sad" | "scared" | "relieved" | "happy";
export type Pose = "idle" | "walking" | "talking" | "phone" | "camera" | "armsCrossed";
export type View = "front" | "threeQuarter" | "side";
export type Gaze = "center" | "left" | "right" | "up" | "down";

export type CharacterProps = {
  id: CharacterId;
  emotion?: Emotion;
  pose?: Pose;
  view?: View;
  gaze?: Gaze;
  facing?: "left" | "right";
  width?: number;
  height?: number;
  frame?: number;
  animate?: boolean;
  animationOffset?: number;
  className?: string;
  style?: React.CSSProperties;
};

export type CharacterDesign = {
  id: CharacterId;
  name: string;
  skin: string;
  skinLight: string;
  skinShadow: string;
  hair: string;
  hairHighlight: string;
  shirt: string;
  jacket: string;
  jacketLight: string;
  pants: string;
  shoes: string;
  accent: string;
  build: "slim" | "average" | "broad";
  height: number;
  hairStyle: "wavy" | "curly" | "short" | "longBraid" | "textured" | "bob";
  accessory?: "glasses" | "camera" | "phone";
};

```

---

## <a id="srccharacterscharactershowcasetsx"></a> File: `src/characters/CharacterShowcase.tsx`

```tsx
// Path: src/characters/CharacterShowcase.tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import Character from "./Character";
import { CharacterId, Emotion, Pose, View } from "./types";

const samples: { id: CharacterId; emotion: Emotion; pose: Pose; view: View; label: string }[] = [
  { id: "arjun", emotion: "scared", pose: "phone", view: "front", label: "ARJUN" },
  { id: "dev", emotion: "relieved", pose: "talking", view: "threeQuarter", label: "DEV" },
  { id: "rahul", emotion: "angry", pose: "armsCrossed", view: "front", label: "RAHUL" },
  { id: "meera", emotion: "worried", pose: "camera", view: "front", label: "MEERA" },
  { id: "kabir", emotion: "neutral", pose: "idle", view: "threeQuarter", label: "KABIR" },
  { id: "nisha", emotion: "sad", pose: "idle", view: "front", label: "NISHA" },
];

export const CharacterShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 35%, #292D35 0%, #111318 68%)",
        color: "#F0EEE9",
        fontFamily: "Arial, sans-serif",
        padding: 54,
      }}
    >
      <div style={{ fontSize: 28, letterSpacing: 5, fontWeight: 700 }}>
        EVERYONE REMEMBERS IT DIFFERENTLY
      </div>
      <div style={{ fontSize: 13, letterSpacing: 4, color: "#9DA3AC", marginTop: 10 }}>
        CHARACTER MODEL SHEET / 01
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: 20,
        flex: 1,
        marginTop: 28,
      }}>
        {samples.map((item, i) => (
          <div key={item.id} style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(145deg, rgba(255,255,255,.055), rgba(0,0,0,.12))",
            border: "1px solid rgba(255,255,255,.10)",
            borderRadius: 14,
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: "auto 0 0",
              height: "48%", background: "linear-gradient(transparent, rgba(0,0,0,.38))",
            }} />
            <Character
              id={item.id}
              emotion={item.emotion}
              pose={item.pose}
              view={item.view}
              width={220}
              height={385}
              frame={frame}
              animationOffset={i * 17}
            />
            <div style={{
              position: "absolute", left: 18, bottom: 14,
              fontSize: 16, letterSpacing: 3, fontWeight: 700,
            }}>{item.label}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

```

---

## <a id="srccharacterscinematicshowcasetsx"></a> File: `src/characters/CinematicShowcase.tsx`

```tsx
// Path: src/characters/CinematicShowcase.tsx
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import Character from "./Character";
import { CharacterId, Emotion, Pose, View, Gaze } from "./types";
import { DESIGNS } from "./designs";

// --- Sub-components & Helpers ---

const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(15,20,28,0.7))",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 18,
      boxShadow: "0 16px 36px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
      backdropFilter: "blur(14px)",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

// Dialogue speech box with cinematic styling
const DialogueBox: React.FC<{
  speaker: string;
  role: string;
  avatarColor: string;
  text: string;
  opacity: number;
  translateY: number;
}> = ({ speaker, role, avatarColor, text, opacity, translateY }) => (
  <div
    style={{
      opacity,
      transform: `translateY(${translateY}px)`,
      display: "flex",
      alignItems: "center",
      gap: 20,
      background: "linear-gradient(135deg, rgba(15, 20, 30, 0.94), rgba(8, 11, 18, 0.96))",
      border: "1px solid rgba(255, 255, 255, 0.16)",
      borderRadius: 22,
      padding: "20px 28px",
      boxShadow: "0 20px 48px rgba(0,0,0,0.7), 0 0 30px rgba(56, 189, 248, 0.08)",
      maxWidth: 960,
      width: "92%",
      margin: "0 auto",
      position: "relative",
      zIndex: 40,
    }}
  >
    <div
      style={{
        width: 54,
        height: 54,
        borderRadius: "50%",
        backgroundColor: avatarColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        fontSize: 22,
        color: "#fff",
        boxShadow: `0 0 20px ${avatarColor}99`,
        flexShrink: 0,
      }}
    >
      {speaker[0]}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: 1.5, color: "#fff" }}>
          {speaker}
        </span>
        <span
          style={{
            fontSize: 12,
            letterSpacing: 2,
            padding: "3px 10px",
            borderRadius: 6,
            background: "rgba(255,255,255,0.1)",
            color: "#94A3B8",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {role}
        </span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 500, color: "#F1F5F9", marginTop: 6, lineHeight: 1.35 }}>
        "{text}"
      </div>
    </div>
  </div>
);

// Spec badge for character profiles
const SpecPill: React.FC<{ label: string; value: string; color?: string }> = ({
  label,
  value,
  color = "#64748B",
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      padding: "8px 16px",
      background: "rgba(15, 20, 30, 0.8)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 12,
      boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
    }}
  >
    <span style={{ fontSize: 11, letterSpacing: 1.8, color, textTransform: "uppercase", fontWeight: 800 }}>
      {label}
    </span>
    <span style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC", marginTop: 2 }}>
      {value}
    </span>
  </div>
);

// Spotlight Stage Floor Glow
const StageFloor: React.FC<{ color?: string }> = ({ color = "rgba(56, 189, 248, 0.35)" }) => (
  <div
    style={{
      position: "absolute",
      bottom: 220,
      left: "5%",
      right: "5%",
      height: 90,
      background: `radial-gradient(ellipse at 50% 50%, ${color} 0%, transparent 75%)`,
      filter: "blur(24px)",
      pointerEvents: "none",
    }}
  />
);

// ==========================================
// SCENE 1: THE ENSEMBLE ROSTER (0 - 90 frames)
// ==========================================
const Scene1Roster: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 14 } });
  const titleY = interpolate(titleProgress, [0, 1], [-40, 0]);

  const cards: {
    id: CharacterId;
    role: string;
    emotion: Emotion;
    pose: Pose;
    view: View;
  }[] = [
    { id: "arjun", role: "TECH & COMMS", emotion: "worried", pose: "phone", view: "threeQuarter" },
    { id: "dev", role: "NARRATOR & LEAD", emotion: "relieved", pose: "talking", view: "threeQuarter" },
    { id: "rahul", role: "ENFORCER / DEFENSE", emotion: "angry", pose: "armsCrossed", view: "front" },
    { id: "meera", role: "FIELD SCOUT & OPTICS", emotion: "happy", pose: "camera", view: "front" },
    { id: "kabir", role: "SYSTEMS ARCHITECT", emotion: "neutral", pose: "idle", view: "threeQuarter" },
    { id: "nisha", role: "STRATEGIC OPERATIONS", emotion: "happy", pose: "idle", view: "front" },
  ];

  return (
    <AbsoluteFill
      style={{
        padding: "80px 48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: titleProgress,
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 4,
            padding: "8px 20px",
            borderRadius: 24,
            background: "rgba(56, 189, 248, 0.12)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            color: "#38BDF8",
            marginBottom: 14,
          }}
        >
          PROCEDURAL VECTOR RIGS // REMOTION
        </div>
        <h1
          style={{
            fontSize: 46,
            fontWeight: 900,
            letterSpacing: 3,
            color: "#FFFFFF",
            margin: 0,
            textShadow: "0 4px 24px rgba(0,0,0,0.9)",
          }}
        >
          CINEMATIC CHARACTER ROSTER
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#94A3B8",
            letterSpacing: 2,
            margin: "10px 0 0",
            fontWeight: 500,
          }}
        >
          6 REUSABLE VECTOR RIGS • 7 EMOTIONS • 6 ANIMATED POSES
        </p>
      </div>

      {/* Grid: 2 Columns x 3 Rows */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: 22,
          flex: 1,
          margin: "34px 0",
        }}
      >
        {cards.map((item, idx) => {
          const cardSpring = spring({
            frame: frame - idx * 5,
            fps,
            config: { damping: 15, mass: 0.8 },
          });
          const scale = interpolate(cardSpring, [0, 1], [0.85, 1]);
          const opacity = interpolate(cardSpring, [0, 1], [0, 1]);
          const d = DESIGNS[item.id];

          return (
            <div
              key={item.id}
              style={{
                opacity,
                transform: `scale(${scale})`,
                position: "relative",
                borderRadius: 20,
                background: "linear-gradient(160deg, rgba(255,255,255,0.08), rgba(8,12,18,0.85))",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 14px 28px rgba(0,0,0,0.55)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                overflow: "hidden",
                padding: "16px 18px",
              }}
            >
              {/* Unit Tag */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: d.accent,
                    boxShadow: `0 0 12px ${d.accent}`,
                  }}
                />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 900,
                    letterSpacing: 2,
                    color: "#F1F5F9",
                  }}
                >
                  {d.name.toUpperCase()}
                </span>
              </div>

              {/* Character Component */}
              <div style={{ transform: "scale(1.08)", transformOrigin: "bottom center", marginBottom: 38 }}>
                <Character
                  id={item.id}
                  emotion={item.emotion}
                  pose={item.pose}
                  view={item.view}
                  width={220}
                  height={380}
                  frame={frame}
                  animationOffset={idx * 21}
                />
              </div>

              {/* Bottom Role Label */}
              <div
                style={{
                  position: "absolute",
                  bottom: 14,
                  left: 18,
                  right: 18,
                  background: "rgba(0,0,0,0.65)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 10,
                  padding: "8px 12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid rgba(255,255,255,0.1)",
                  zIndex: 10,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, color: "#94A3B8" }}>
                  {item.role}
                </span>
                <span style={{ fontSize: 12, fontWeight: 900, color: d.accent }}>
                  #{idx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Status Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 2,
          color: "#64748B",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 18,
        }}
      >
        <span>SYSTEM: CHROMIUM HEADLESS // GPU ACCELERATED</span>
        <span style={{ color: "#10B981" }}>● PIPELINE ONLINE</span>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// SCENE 2: ARJUN & DEV (Frames 90 - 200)
// ==========================================
const Scene2ArjunDev: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const intro = spring({ frame, fps, config: { damping: 14 } });
  const arjunX = interpolate(frame, [0, 35], [-140, 0], { extrapolateRight: "clamp" });
  const devX = interpolate(frame, [0, 35], [140, 0], { extrapolateRight: "clamp" });

  const arjunPose: Pose = frame < 30 ? "walking" : "phone";
  const arjunEmotion: Emotion = frame < 45 ? "scared" : "relieved";

  return (
    <AbsoluteFill style={{ padding: "80px 48px 120px", display: "flex", flexDirection: "column" }}>
      {/* Header Tag */}
      <div style={{ textAlign: "center", opacity: intro, marginBottom: 20 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 4,
            color: "#38BDF8",
            marginBottom: 8,
          }}
        >
          DUO SPOTLIGHT // SEQUENCE 01
        </div>
        <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: 2, color: "#FFFFFF", margin: 0 }}>
          ARJUN & DEV // ACTIVE INTERACTION
        </h2>
        <p style={{ fontSize: 18, color: "#94A3B8", letterSpacing: 2, margin: "8px 0 0" }}>
          EXPRESSIVE GESTURES & PHONE SATELLITE COMMS
        </p>
      </div>

      {/* Center Stage with Two Characters */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          position: "relative",
        }}
      >
        <StageFloor color="rgba(56, 189, 248, 0.35)" />

        {/* Arjun (Left) */}
        <div
          style={{
            transform: `translateX(${arjunX}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Character
            id="arjun"
            emotion={arjunEmotion}
            pose={arjunPose}
            view="threeQuarter"
            gaze="right"
            facing="right"
            width={440}
            height={740}
            frame={frame}
          />
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <SpecPill label="Unit" value="ARJUN" color="#A8B18F" />
            <SpecPill label="Build" value="SLIM" />
            <SpecPill label="Prop" value="PHONE" />
          </div>
        </div>

        {/* Dev (Right) */}
        <div
          style={{
            transform: `translateX(${devX}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Character
            id="dev"
            emotion="relieved"
            pose="talking"
            view="threeQuarter"
            facing="left"
            gaze="left"
            width={440}
            height={740}
            frame={frame}
          />
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <SpecPill label="Unit" value="DEV" color="#526D91" />
            <SpecPill label="Pose" value="TALKING" />
            <SpecPill label="State" value="GESTURING" />
          </div>
        </div>
      </div>

      {/* Dialogue Subtitle Callout */}
      <DialogueBox
        speaker="Dev"
        role="Lead Narrator"
        avatarColor="#334A68"
        text="The telemetry link is restored! All 6 procedural rigs are synced and rendering in real-time."
        opacity={interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" })}
        translateY={interpolate(frame, [15, 30], [20, 0], { extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
};

// ==========================================
// SCENE 3: RAHUL & MEERA (Frames 200 - 310)
// ==========================================
const Scene3RahulMeera: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({ frame, fps, config: { damping: 14 } });

  // Camera flash trigger around frame 45 (within scene)
  const flashOpacity =
    frame >= 42 && frame <= 48
      ? interpolate(frame, [42, 44, 48], [0, 0.94, 0])
      : 0;

  const meeraEmotion: Emotion = frame < 44 ? "worried" : "happy";
  const meeraGaze: Gaze = frame < 44 ? "left" : "center";

  return (
    <AbsoluteFill style={{ padding: "80px 48px 120px", display: "flex", flexDirection: "column" }}>
      {/* Shutter White Flash overlay */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFFFF",
            opacity: flashOpacity,
            zIndex: 100,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Header Tag */}
      <div style={{ textAlign: "center", opacity: intro, marginBottom: 20 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 4,
            color: "#F43F5E",
            marginBottom: 8,
          }}
        >
          DUO SPOTLIGHT // SEQUENCE 02
        </div>
        <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: 2, color: "#FFFFFF", margin: 0 }}>
          RAHUL & MEERA // POSE & CAMERA RIG
        </h2>
        <p style={{ fontSize: 18, color: "#94A3B8", letterSpacing: 2, margin: "8px 0 0" }}>
          BROAD BUILD DEFENDER & FIELD OPTICS DOCUMENTATION
        </p>
      </div>

      {/* Center Stage */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          position: "relative",
        }}
      >
        <StageFloor color="rgba(244, 63, 94, 0.3)" />

        {/* Rahul (Left) - Broad Build, Arms Crossed */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Character
            id="rahul"
            emotion={frame > 50 ? "neutral" : "angry"}
            pose="armsCrossed"
            view="front"
            width={450}
            height={750}
            frame={frame}
          />
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <SpecPill label="Unit" value="RAHUL" color="#A66A53" />
            <SpecPill label="Build" value="BROAD" />
            <SpecPill label="Arms" value="CROSSED" />
          </div>
        </div>

        {/* Meera (Right) - Camera pose, facing Rahul */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Character
            id="meera"
            emotion={meeraEmotion}
            pose="camera"
            view="threeQuarter"
            facing="left"
            gaze={meeraGaze}
            width={440}
            height={740}
            frame={frame}
          />
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <SpecPill label="Unit" value="MEERA" color="#D3A3B0" />
            <SpecPill label="Prop" value="CAMERA" />
            <SpecPill label="Action" value={frame >= 44 ? "PHOTO TAKEN" : "FOCUSING"} />
          </div>
        </div>
      </div>

      {/* Dialogue Subtitle */}
      <DialogueBox
        speaker="Meera"
        role="Field Optics"
        avatarColor="#713E52"
        text="Hold that pose, Rahul! That frame capture is razor sharp. 4K rasterization locked."
        opacity={interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" })}
        translateY={interpolate(frame, [15, 30], [20, 0], { extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
};

// ==========================================
// SCENE 4: KABIR & NISHA (Frames 310 - 420)
// ==========================================
const Scene4KabirNisha: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({ frame, fps, config: { damping: 14 } });

  // Nisha walks in from right
  const nishaX = interpolate(frame, [0, 35], [160, 0], { extrapolateRight: "clamp" });
  const nishaPose: Pose = frame < 30 ? "walking" : "idle";
  const kabirGaze: Gaze = frame < 40 ? "up" : "center";

  return (
    <AbsoluteFill style={{ padding: "80px 48px 120px", display: "flex", flexDirection: "column" }}>
      {/* Header Tag */}
      <div style={{ textAlign: "center", opacity: intro, marginBottom: 20 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 4,
            color: "#10B981",
            marginBottom: 8,
          }}
        >
          DUO SPOTLIGHT // SEQUENCE 03
        </div>
        <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: 2, color: "#FFFFFF", margin: 0 }}>
          KABIR & NISHA // PRECISION RIGGING
        </h2>
        <p style={{ fontSize: 18, color: "#94A3B8", letterSpacing: 2, margin: "8px 0 0" }}>
          DYNAMIC HEIGHT VARIATION & PROCEDURAL WALK KINEMATICS
        </p>
      </div>

      {/* Center Stage */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          position: "relative",
        }}
      >
        <StageFloor color="rgba(16, 185, 129, 0.3)" />

        {/* Kabir (Left) - Glasses, Tall 1.06 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Character
            id="kabir"
            emotion="neutral"
            pose="idle"
            view="threeQuarter"
            facing="right"
            gaze={kabirGaze}
            width={440}
            height={760}
            frame={frame}
          />
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <SpecPill label="Unit" value="KABIR" color="#559092" />
            <SpecPill label="Height" value="1.06x" />
            <SpecPill label="Optics" value="GLASSES" />
          </div>
        </div>

        {/* Nisha (Right) - Walking in, smiling */}
        <div
          style={{
            transform: `translateX(${nishaX}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Character
            id="nisha"
            emotion="happy"
            pose={nishaPose}
            view="front"
            width={430}
            height={730}
            frame={frame}
          />
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <SpecPill label="Unit" value="NISHA" color="#D0AD61" />
            <SpecPill label="Style" value="BOB CUT" />
            <SpecPill label="Emotion" value="HAPPY" />
          </div>
        </div>
      </div>

      {/* Dialogue Subtitle */}
      <DialogueBox
        speaker="Nisha"
        role="Operations Lead"
        avatarColor="#B18A3D"
        text="All kinematics checked. GPU pipeline rasterization running with zero overhead and maximum FPS!"
        opacity={interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" })}
        translateY={interpolate(frame, [15, 30], [20, 0], { extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
};

// ==========================================
// SCENE 5: FINALE HERO LINEUP & RTX 3050 SPECS (420 - 540)
// ==========================================
const Scene5HeroFinale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({ frame, fps, config: { damping: 14 } });
  const zoom = interpolate(frame, [0, 110], [1.06, 1], { extrapolateRight: "clamp" });

  const roster: {
    id: CharacterId;
    emotion: Emotion;
    pose: Pose;
    view: View;
    facing?: "left" | "right";
    xOffset: number;
    scale: number;
    zIndex: number;
  }[] = [
    { id: "kabir", emotion: "neutral", pose: "idle", view: "threeQuarter", facing: "right", xOffset: -430, scale: 1.15, zIndex: 1 },
    { id: "arjun", emotion: "relieved", pose: "phone", view: "threeQuarter", facing: "right", xOffset: -260, scale: 1.2, zIndex: 2 },
    { id: "dev", emotion: "happy", pose: "talking", view: "front", xOffset: -85, scale: 1.28, zIndex: 3 },
    { id: "rahul", emotion: "neutral", pose: "armsCrossed", view: "front", xOffset: 90, scale: 1.3, zIndex: 4 },
    { id: "meera", emotion: "happy", pose: "camera", view: "threeQuarter", facing: "left", xOffset: 270, scale: 1.22, zIndex: 2 },
    { id: "nisha", emotion: "happy", pose: "idle", view: "front", xOffset: 435, scale: 1.15, zIndex: 1 },
  ];

  return (
    <AbsoluteFill
      style={{
        padding: "80px 40px 90px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${zoom})`,
        transformOrigin: "center center",
      }}
    >
      {/* Top Title Banner */}
      <div style={{ textAlign: "center", opacity: intro }}>
        <div
          style={{
            display: "inline-block",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 4,
            padding: "8px 24px",
            borderRadius: 24,
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            color: "#10B981",
            marginBottom: 12,
          }}
        >
          FULL CAST PRODUCTION ENGINE
        </div>
        <h1
          style={{
            fontSize: 48,
            fontWeight: 900,
            letterSpacing: 3,
            color: "#FFFFFF",
            margin: 0,
            textShadow: "0 4px 28px rgba(0,0,0,0.9)",
          }}
        >
          CINEMATIC VECTOR RIGS READY
        </h1>
        <p style={{ fontSize: 18, color: "#94A3B8", letterSpacing: 2, margin: "10px 0 0" }}>
          6 CHARACTERS • PROCEDURAL SVG • 60 FPS MOTION GRAPHICS
        </p>
      </div>

      {/* Characters Stage */}
      <div
        style={{
          position: "relative",
          height: 820,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        {/* Floor Horizon Glow */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "5%",
            right: "5%",
            height: 90,
            background: "radial-gradient(ellipse, rgba(56, 189, 248, 0.4) 0%, transparent 80%)",
            filter: "blur(24px)",
          }}
        />

        {/* 6 Hero Characters */}
        {roster.map((c, i) => (
          <div
            key={c.id}
            style={{
              position: "absolute",
              bottom: 45,
              transform: `translateX(${c.xOffset}px) scale(${c.scale})`,
              transformOrigin: "bottom center",
              zIndex: c.zIndex,
            }}
          >
            <Character
              id={c.id}
              emotion={c.emotion}
              pose={c.pose}
              view={c.view}
              facing={c.facing}
              width={260}
              height={450}
              frame={frame}
              animationOffset={i * 15}
            />
          </div>
        ))}
      </div>

      {/* Hardware Telemetry Card (RTX 3050 Accent) */}
      <GlassCard
        style={{
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(10, 15, 25, 0.92) 100%)",
          border: "1px solid rgba(16, 185, 129, 0.4)",
          boxShadow: "0 20px 48px rgba(0,0,0,0.8), 0 0 32px rgba(118, 185, 0, 0.15)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#76B900", // NVIDIA Green
                boxShadow: "0 0 16px #76B900",
              }}
            />
            <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: 2, color: "#FFFFFF" }}>
              NVIDIA GEFORCE RTX 3050 LAPTOP GPU
            </span>
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: 2,
              padding: "5px 12px",
              borderRadius: 8,
              background: "rgba(118, 185, 0, 0.2)",
              color: "#76B900",
              border: "1px solid rgba(118, 185, 0, 0.5)",
            }}
          >
            HARDWARE ACCELERATED
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <SpecPill label="Raster Pipeline" value="DirectX 11 ANGLE" color="#76B900" />
          <SpecPill label="Asset Footprint" value="0 KB (Pure SVG)" color="#38BDF8" />
          <SpecPill label="GPU Compute" value="CUDA + NVENC" color="#A855F7" />
        </div>
      </GlassCard>
    </AbsoluteFill>
  );
};

// ==========================================
// MAIN COMPOSITION
// ==========================================
export const CinematicShowcase: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080B10",
        background: "radial-gradient(circle at 50% 25%, #151A24 0%, #07090D 85%)",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#F8FAFC",
        overflow: "hidden",
      }}
    >
      {/* Background Cinematic Atmosphere */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.7,
        }}
      />

      {/* Audio SFX Track Elements */}
      <Sequence from={0}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={25}>
        <Audio src={staticFile("sfx/ping.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={90}>
        <Audio src={staticFile("sfx/whoosh_rev.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={115}>
        <Audio src={staticFile("sfx/slide.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={200}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={243}>
        <Audio src={staticFile("sfx/ping.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={310}>
        <Audio src={staticFile("sfx/slide.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={330}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={420}>
        <Audio src={staticFile("sfx/power_on.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={435}>
        <Audio src={staticFile("sfx/thud.mp3")} volume={0.6} />
      </Sequence>

      {/* Sequence Scenes */}
      <Sequence from={0} durationInFrames={90}>
        <Scene1Roster />
      </Sequence>

      <Sequence from={90} durationInFrames={110}>
        <Scene2ArjunDev />
      </Sequence>

      <Sequence from={200} durationInFrames={110}>
        <Scene3RahulMeera />
      </Sequence>

      <Sequence from={310} durationInFrames={110}>
        <Scene4KabirNisha />
      </Sequence>

      <Sequence from={420} durationInFrames={120}>
        <Scene5HeroFinale />
      </Sequence>
    </AbsoluteFill>
  );
};

export const CinematicShowcaseComposition: React.FC = () => {
  return (
    <Composition
      id="CharacterShowcase"
      component={CinematicShowcase}
      durationInFrames={540}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};

```

---

## <a id="srccharactersindexts"></a> File: `src/characters/index.ts`

```tsx
// Path: src/characters/index.ts
export { Character, default } from "./Character";
export { CharacterShowcase } from "./CharacterShowcase";
export { CinematicShowcase, CinematicShowcaseComposition } from "./CinematicShowcase";
export { DESIGNS, CHARACTER_IDS } from "./designs";
export type {
  CharacterId, CharacterProps, Emotion, Pose, View, Gaze,
} from "./types";

```

---

