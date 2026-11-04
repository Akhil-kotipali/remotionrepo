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
