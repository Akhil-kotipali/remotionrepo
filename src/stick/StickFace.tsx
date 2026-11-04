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

