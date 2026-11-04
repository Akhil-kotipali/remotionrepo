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
