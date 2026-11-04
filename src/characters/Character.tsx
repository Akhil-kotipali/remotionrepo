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
