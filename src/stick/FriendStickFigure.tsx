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
  showEyes?: boolean;
  eyeShift?: number;
  eyeWide?: number;
  eyeOpacity?: number;
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
  showEyes = false,
  eyeShift = 0,
  eyeWide = 1,
  eyeOpacity = 1,
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
        {/* DRAMATIC EYES (RENDERED ON HEAD SPHERE, BEHIND GLASSES) */}
        {/* ==================================================== */}
        {showEyes && (
          <g id={`eyes-${friend}`} opacity={eyeOpacity}>
            {[-1, 1].map((s) => {
              const isKabir = friend === "kabir";
              const dx = isKabir ? 14 : 9.5;
              const eyeY = headY + (isKabir ? 4 : 3);
              const rx = isKabir ? 4.8 : 5.6;
              const ry = (isKabir ? 5.8 : 6.8) * eyeWide;
              const pupilOffset = facing === "left" ? -eyeShift : eyeShift;
              const pupilX = headX + s * dx + pupilOffset;
              const pupilY = eyeY + 0.5;

              return (
                <g key={s}>
                  {/* Eye Sclera */}
                  <ellipse
                    cx={headX + s * dx}
                    cy={eyeY}
                    rx={rx}
                    ry={ry}
                    fill="#F4F6EE"
                  />
                  {/* Pupil */}
                  <circle
                    cx={pupilX}
                    cy={pupilY}
                    r={2.8}
                    fill="#0D1210"
                  />
                  {/* Light Reflection Glint */}
                  <circle
                    cx={pupilX - 0.9}
                    cy={pupilY - 1.0}
                    r={0.9}
                    fill="#FFFFFF"
                  />
                </g>
              );
            })}
          </g>
        )}

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
