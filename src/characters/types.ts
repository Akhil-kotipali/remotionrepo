import React from "react";

export type CharacterId = "arjun" | "dev" | "rahul" | "meera" | "kabir" | "nisha" | "reflection";
export type Emotion =
  | "neutral"
  | "worried"
  | "angry"
  | "sad"
  | "scared"
  | "relieved"
  | "happy"
  | "creepySmile"
  | "hollowScared"
  | "frozenTerror";
export type Pose =
  | "idle"
  | "walking"
  | "talking"
  | "phone"
  | "camera"
  | "armsCrossed"
  | "knocking"
  | "pressingGlass"
  | "standingFrozen";
export type View = "front" | "threeQuarter" | "side" | "back";
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
