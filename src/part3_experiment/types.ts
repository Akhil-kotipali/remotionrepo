import {FriendId} from "../part3/stick/friendDesigns";

export type {FriendId};

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Rotation3D {
  x: number; // pitch
  y: number; // yaw
  z: number; // roll
}

export interface CameraState3D {
  x: number;
  y: number;
  z: number;
  pitch: number;
  yaw: number;
  roll: number;
  zoom: number;
  dofBlur: number;
}

export interface FriendPose25D {
  lean: number;
  yaw: number;
  pitch: number;
  headTilt: number;
  headTurn: number;
  hipX: number;
  hipY: number;
  handL: [number, number];
  handR: [number, number];
  footL: [number, number];
  footR: [number, number];
  eyeOpen: number;
  brow: number;
  lookX: number;
  lookY: number;
  blink: number;
  breath: number;
  glow: number;
}

