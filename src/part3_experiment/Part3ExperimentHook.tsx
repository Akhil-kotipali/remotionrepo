import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Room25D} from "./Room25D";
import {FriendRig25D} from "./FriendRig25D";
import {PhotoCard3D} from "./PhotoCard3D";
import {MemoryShards25D} from "./MemoryShards25D";
import {ForensicReticles25D} from "./ForensicReticles25D";
import {FriendPose25D} from "./types";
import {E, kf} from "../part3/math";
import {INTER, MONO, MONT} from "../part3/fonts";
import {GlitchBurst, Grain, HitFlash, Vignette} from "../part3/fx/Overlays";

// SFX Audio Cue definition
type SfxCue = [number, string, number];
const EXPERIMENT_SFX: SfxCue[] = [
  [0, "impact_boom", 0.9],
  [0, "static_burst", 0.7],
  [0, "glitch_hit", 0.8],
  [6, "name_tick", 0.5],
  [14, "name_tick", 0.5],
  [22, "name_tick", 0.5],
  [30, "name_tick", 0.5],
  [45, "whoosh_soft", 0.6],
  [48, "paper_flip", 0.5],
  [52, "camera_shutter", 0.45],
  [93, "whoosh", 0.7],
  [94, "glass_shimmer", 0.6],
  [94, "reverse_swell", 0.75],
  [95, "bubble_pop", 0.5],
  [98, "bubble_pop", 0.5],
  [101, "bubble_pop", 0.5],
  [104, "bubble_pop", 0.5],
  [128, "sting_high", 0.45],
  [130, "heartbeat", 0.8],
];

export const Part3ExperimentHook: React.FC = () => {
  const f = useCurrentFrame();

  // =========================================================================
  // 1. DYNAMIC 3D CAMERA PATH (0 - 150 FRAMES)
  // =========================================================================
  // Shot 1 (0-44): Cinematic 3D push into living room diorama
  // Shot 2 (45-92): Snappy focus zoom onto Arjun's 3D photo card
  // Shot 3 (93-150): Sweeping Dutch-angle arc revealing 4 memory shards
  const camZ = kf(f, [
    [0, -70],
    [44, 30, E.out],
    [45, 120],
    [54, 340, E.back],
    [92, 350],
    [93, 200],
    [105, 50, E.out],
    [150, 80],
  ]);

  const camX = kf(f, [
    [0, 535],
    [44, 545],
    [45, 560],
    [54, 610, E.out],
    [92, 615],
    [93, 580],
    [105, 540, E.out],
    [150, 540],
  ]);

  const camY = kf(f, [
    [0, 1030],
    [44, 1010],
    [45, 1060],
    [54, 1160, E.out],
    [92, 1170],
    [93, 1080],
    [105, 1000, E.out],
    [150, 1000],
  ]);

  const camPitch = kf(f, [
    [0, 1.8],
    [44, 0.2],
    [45, -2.0],
    [54, -4.5, E.out],
    [92, -4.0],
    [93, -1.0],
    [105, 1.2, E.out],
    [150, 1.0],
  ]);

  const camYaw = kf(f, [
    [0, -1.2],
    [44, 0.4],
    [45, 1.5],
    [54, 3.2, E.out],
    [92, 3.8],
    [93, 1.0],
    [105, -2.0, E.out],
    [150, -1.5],
  ]);

  const camRoll = kf(f, [
    [0, -0.6],
    [44, 0.2],
    [45, 0.8],
    [54, 1.4, E.out],
    [92, 1.2],
    [93, -0.5],
    [105, -2.2, E.out],
    [150, -1.8],
  ]);

  // Specular gleam across the photo card (Frames 48 - 85)
  const glareSweep = kf(f, [
    [46, 0.0],
    [75, 1.0, E.inOut],
  ]);

  // =========================================================================
  // 2. CHARACTER 2.5D POSES & ARTICULATIONS
  // =========================================================================
  const breath = Math.sin(f * 0.1) * 1.6;

  // Arjun (Center Hero) Pose
  const arjunPresentPhoto = kf(f, [
    [0, 0],
    [44, 0],
    [52, 1, E.back],
    [92, 1],
    [100, 0, E.out],
  ]);
  const arjunTurnHead = kf(f, [
    [0, 0],
    [93, 0],
    [108, -0.7, E.out], // turns head toward Meera/Nisha
    [130, 0.5, E.inOut], // turns head toward Rahul/Kabir
  ]);

  const arjunPose: FriendPose25D = {
    lean: -1.0 + Math.sin(f * 0.04) * 0.8,
    yaw: -2,
    pitch: 0,
    headTilt: arjunTurnHead * 6,
    headTurn: arjunTurnHead,
    hipX: 0,
    hipY: 0,
    // Presenting photo forward in Phase 2
    handL: [92 - arjunPresentPhoto * 14, 214 - arjunPresentPhoto * 46],
    handR: [148 + arjunPresentPhoto * 18, 214 - arjunPresentPhoto * 46],
    footL: [96, 416],
    footR: [144, 416],
    eyeOpen: 0.95,
    brow: 0.15 + arjunPresentPhoto * 0.2,
    lookX: arjunTurnHead * 0.9,
    lookY: arjunPresentPhoto > 0.8 ? -0.2 : 0.05,
    blink: f > 35 && f < 40 ? 1 : f > 115 && f < 120 ? 1 : 0,
    breath,
    glow: 0,
  };

  // Meera (Left) Pose
  const meeraReact = kf(f, [[93, 0], [102, 1, E.back]]);
  const meeraPose: FriendPose25D = {
    lean: 1.2,
    yaw: 16,
    pitch: 0,
    headTilt: 4 + meeraReact * 4,
    headTurn: 0.6,
    hipX: 0,
    hipY: 0,
    handL: [90 - meeraReact * 30, 220 - meeraReact * 40],
    handR: [150 + meeraReact * 20, 220 - meeraReact * 65],
    footL: [104, 416],
    footR: [136, 416],
    eyeOpen: 0.9 + meeraReact * 0.3,
    brow: 0.1 + meeraReact * 0.5,
    lookX: 0.8,
    lookY: 0,
    blink: f > 25 && f < 30 ? 1 : 0,
    breath: Math.sin(f * 0.11 + 1) * 1.5,
    glow: 0,
  };

  // Nisha (Center-Left) Pose
  const nishaReact = kf(f, [[96, 0], [105, 1, E.back]]);
  const nishaPose: FriendPose25D = {
    lean: 0.5,
    yaw: 10,
    pitch: 0,
    headTilt: -3 - nishaReact * 5,
    headTurn: 0.4,
    hipX: 0,
    hipY: 0,
    handL: [90 + nishaReact * 15, 224 - nishaReact * 30],
    handR: [132 - nishaReact * 15, 222 - nishaReact * 30],
    footL: [94, 416],
    footR: [146, 416],
    eyeOpen: 0.9 + nishaReact * 0.25,
    brow: 0.1 + nishaReact * 0.4,
    lookX: 0.5,
    lookY: 0,
    blink: f > 60 && f < 65 ? 1 : 0,
    breath: Math.sin(f * 0.09 + 2) * 1.5,
    glow: 0,
  };

  // Rahul (Center-Right) Pose
  const rahulReact = kf(f, [[98, 0], [107, 1, E.back]]);
  const rahulPose: FriendPose25D = {
    lean: -1.5 - rahulReact * 2.5,
    yaw: -14,
    pitch: 0,
    headTilt: -4,
    headTurn: -0.5,
    hipX: 0,
    hipY: 0,
    handL: [100, 220],
    handR: [140 + rahulReact * 75, 220 - rahulReact * 60], // pointing defensively
    footL: [82, 416],
    footR: [158, 416],
    eyeOpen: 0.95 + rahulReact * 0.2,
    brow: 0.2 + rahulReact * 0.5,
    lookX: -0.6,
    lookY: 0,
    blink: f > 50 && f < 55 ? 1 : 0,
    breath: Math.sin(f * 0.12 + 3) * 1.8,
    glow: 0,
  };

  // Kabir (Right) Pose
  const kabirReact = kf(f, [[101, 0], [110, 1, E.back]]);
  const kabirPose: FriendPose25D = {
    lean: -0.8,
    yaw: -22,
    pitch: 0,
    headTilt: 3 + kabirReact * 5,
    headTurn: -0.7,
    hipX: 0,
    hipY: 0,
    handL: [88, 224 - kabirReact * 85], // adjusts glasses
    handR: [142, 206], // holding book
    footL: [106, 416],
    footR: [136, 416],
    eyeOpen: 0.9,
    brow: 0.1 + kabirReact * 0.4,
    lookX: -0.8,
    lookY: 0.1,
    blink: f > 75 && f < 80 ? 1 : 0,
    breath: Math.sin(f * 0.08 + 4) * 1.4,
    glow: 0,
  };

  // =========================================================================
  // 3. CAPTION TIMINGS & HIGHLIGHTS
  // =========================================================================
  // 0.15s - 0.93s: "Five friends."
  // 1.60s - 2.56s: "One photograph."
  // 3.10s - 5.09s: "And four completely different memories."
  const showCap1 = f >= 4 && f < 45;
  const showCap2 = f >= 48 && f < 90;
  const showCap3 = f >= 93 && f <= 150;

  return (
    <AbsoluteFill style={{background: "#000000", overflow: "hidden"}}>
      {/* =================================================================== */}
      {/* 3D PERSPECTIVE VIEWPORT (CAMERA CONTAINER)                          */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: 1250,
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: `translate3d(${-camX + 540}px, ${-camY + 960}px, ${camZ}px) rotateX(${camPitch}deg) rotateY(${camYaw}deg) rotateZ(${camRoll}deg)`,
          }}
        >
          {/* LAYER 1: 3D DIORAMA ROOM & VOLUMETRIC LIGHTING */}
          <Room25D />

          {/* LAYER 2: 2.5D CHARACTER LINEUP (Positioned in 3D arc) */}
          {/* Meera (Left Wing, Z = -10px) */}
          <div style={{position: "absolute", left: 85, top: 880}}>
            <FriendRig25D id="meera" pose={meeraPose} scale={1.0} yaw={18} depthZ={-10} warmRim={0.4} coolRim={0.25} />
          </div>

          {/* Nisha (Center-Left, Z = -25px) */}
          <div style={{position: "absolute", left: 265, top: 900}}>
            <FriendRig25D id="nisha" pose={nishaPose} scale={1.04} yaw={10} depthZ={-25} warmRim={0.4} coolRim={0.25} />
          </div>

          {/* Arjun (Center Forward Hero, Z = +80px) */}
          <div style={{position: "absolute", left: 480, top: 920}}>
            <FriendRig25D id="arjun" pose={arjunPose} scale={1.15} yaw={-2} depthZ={80} jacket={true} warmRim={0.5} coolRim={0.3} />
          </div>

          {/* Rahul (Center-Right, Z = -15px) */}
          <div style={{position: "absolute", left: 670, top: 890}}>
            <FriendRig25D id="rahul" pose={rahulPose} scale={1.06} yaw={-14} depthZ={-15} warmRim={0.3} coolRim={0.45} />
          </div>

          {/* Kabir (Right Wing, Z = -35px) */}
          <div style={{position: "absolute", left: 810, top: 875}}>
            <FriendRig25D id="kabir" pose={kabirPose} scale={1.02} yaw={-22} depthZ={-35} warmRim={0.25} coolRim={0.5} />
          </div>

          {/* LAYER 3: TACTILE 3D PHOTOGRAPH CARD IN ARJUN'S HANDS */}
          <PhotoCard3D
            x={610}
            y={1290 - arjunPresentPhoto * 140}
            z={85 + arjunPresentPhoto * 80}
            rotateX={16 - arjunPresentPhoto * 6}
            rotateY={-6 + arjunPresentPhoto * 4}
            scale={0.58 + arjunPresentPhoto * 0.72}
            glareSweep={glareSweep}
            focusWindow={f >= 50 && f < 93}
          />

          {/* LAYER 4: 2.5D HOLOGRAPHIC MEMORY SHARDS (Phase 3) */}
          <MemoryShards25D />

          {/* LAYER 5: 2.5D FORENSIC SUSPECT RETICLES */}
          <ForensicReticles25D />
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2D FIXED CINEMATIC OVERLAYS (Root Screen Space)                    */}
      {/* =================================================================== */}
      {/* Cold-Open Police Stamp (Frames 0 - 9) */}
      {f < 10 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "42%",
            transform: `translateY(-50%) scale(${kf(f, [[0, 1.35], [4, 1.0, E.back]])}) rotate(-3deg)`,
            textAlign: "center",
            opacity: kf(f, [[0, 1], [6, 1], [9, 0]]),
            zIndex: 130,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "inline-block",
              border: "6px solid #ef4444",
              background: "rgba(8, 12, 22, 0.95)",
              padding: "20px 48px",
              borderRadius: 18,
              boxShadow: "0 0 60px rgba(239,68,68,0.95), inset 0 0 25px rgba(239,68,68,0.5)",
            }}
          >
            <div style={{fontFamily: MONO, fontWeight: 900, fontSize: 32, letterSpacing: 8, color: "#f87171"}}>
              POLICE CASE FILE #03 · HOMICIDE
            </div>
            <div style={{fontFamily: MONT, fontWeight: 900, fontSize: 62, letterSpacing: 3, color: "#ffffff", marginTop: 8}}>
              CONTRADICTORY STATEMENTS
            </div>
          </div>
        </div>
      )}

      {/* Psychology Test Challenge Header (Frames 0 - 52) */}
      {f < 52 && (
        <div
          style={{
            position: "absolute",
            top: 135,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: kf(f, [[0, 1], [44, 1], [52, 0]]),
            zIndex: 125,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(220, 38, 38, 0.96)",
              border: "2px solid #fecaca",
              borderRadius: 999,
              padding: "8px 28px",
              boxShadow: "0 4px 30px rgba(220,38,38,0.85)",
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 0 10px #ffffff",
                transform: `scale(${0.9 + 0.3 * Math.sin(f * 0.6)})`,
              }}
            />
            <span style={{color: "#ffffff", fontFamily: MONO, fontWeight: 900, fontSize: 24, letterSpacing: 5, textTransform: "uppercase"}}>
              PSYCHOLOGY TEST · 94% GUESS WRONG
            </span>
          </div>

          <div
            style={{
              fontFamily: INTER,
              fontWeight: 900,
              fontSize: 52,
              color: "#ffffff",
              marginTop: 14,
              letterSpacing: 2,
              textShadow: "0 4px 30px rgba(0,0,0,0.95), 0 0 20px rgba(255,255,255,0.4)",
            }}
          >
            WHICH FRIEND IS LYING? 💀
          </div>

          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 24,
              color: "#fecaca",
              marginTop: 6,
              letterSpacing: 4,
            }}
          >
            [ 4 CONFLICTING MEMORIES · 1 ACCIDENT ]
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* VIRAL KINETIC CAPTIONS                                              */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 240,
          textAlign: "center",
          zIndex: 140,
          pointerEvents: "none",
        }}
      >
        {/* Caption 1: "Five friends." */}
        {showCap1 && (
          <div
            style={{
              display: "inline-block",
              background: "rgba(6, 10, 18, 0.92)",
              border: "3px solid #38bdf8",
              borderRadius: 20,
              padding: "16px 36px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.8), 0 0 30px rgba(56,189,248,0.5)",
              transform: `scale(${kf(f, [[4, 0.8], [9, 1.05, E.back], [14, 1.0]])})`,
            }}
          >
            <span style={{fontFamily: INTER, fontWeight: 900, fontSize: 54, color: "#facc15", letterSpacing: 3}}>
              FIVE{" "}
            </span>
            <span style={{fontFamily: INTER, fontWeight: 900, fontSize: 54, color: "#ffffff", letterSpacing: 3}}>
              FRIENDS.
            </span>
          </div>
        )}

        {/* Caption 2: "One photograph." */}
        {showCap2 && (
          <div
            style={{
              display: "inline-block",
              background: "rgba(6, 10, 18, 0.92)",
              border: "3px solid #ef4444",
              borderRadius: 20,
              padding: "16px 36px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.8), 0 0 30px rgba(239,68,68,0.6)",
              transform: `scale(${kf(f, [[48, 0.8], [53, 1.06, E.back], [58, 1.0]])})`,
            }}
          >
            <span style={{fontFamily: INTER, fontWeight: 900, fontSize: 54, color: "#f87171", letterSpacing: 3}}>
              ONE{" "}
            </span>
            <span style={{fontFamily: INTER, fontWeight: 900, fontSize: 54, color: "#ffffff", letterSpacing: 3}}>
              PHOTOGRAPH.
            </span>
          </div>
        )}

        {/* Caption 3: "And four completely different memories." */}
        {showCap3 && (
          <div
            style={{
              display: "inline-block",
              background: "rgba(6, 10, 18, 0.94)",
              border: "3px solid #c084fc",
              borderRadius: 20,
              padding: "16px 36px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.8), 0 0 35px rgba(192,132,252,0.6)",
              maxWidth: 900,
              transform: `scale(${kf(f, [[93, 0.85], [98, 1.04, E.back], [103, 1.0]])})`,
            }}
          >
            <span style={{fontFamily: INTER, fontWeight: 900, fontSize: 46, color: "#ffffff", letterSpacing: 2}}>
              AND{" "}
            </span>
            <span style={{fontFamily: INTER, fontWeight: 900, fontSize: 46, color: "#facc15", letterSpacing: 2}}>
              FOUR{" "}
            </span>
            <span style={{fontFamily: INTER, fontWeight: 900, fontSize: 46, color: "#ffffff", letterSpacing: 2}}>
              COMPLETELY{" "}
            </span>
            <span style={{fontFamily: INTER, fontWeight: 900, fontSize: 46, color: "#f43f5e", letterSpacing: 2}}>
              DIFFERENT{" "}
            </span>
            <span style={{fontFamily: INTER, fontWeight: 900, fontSize: 46, color: "#ffffff", letterSpacing: 2}}>
              MEMORIES.
            </span>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* CINEMATIC ATMOSPHERE FX (Film grain, vignette, glitch burst)        */}
      {/* =================================================================== */}
      <Vignette />
      <Grain opacity={0.16} />
      <HitFlash />
      <GlitchBurst at={0} len={8} power={1.2} />
      <GlitchBurst at={45} len={6} power={0.8} />
      <GlitchBurst at={93} len={8} power={1.4} />

      {/* =================================================================== */}
      {/* AUDIO ENGINE (Voiceover + Spatial Sound Cues)                       */}
      {/* =================================================================== */}
      {/* Official Master Voiceover */}
      <Audio src={staticFile("audio/voiceover_part3.wav")} volume={1.0} />

      {/* Room Tone Ambience */}
      <Audio src={staticFile("audio/sfx/room_tone.wav")} volume={0.4} />
      <Audio src={staticFile("audio/sfx/wind_night.wav")} volume={0.3} />

      {/* Key SFX Cues */}
      {EXPERIMENT_SFX.map(([frame, file, vol], i) => (
        <Sequence key={`${file}-${frame}-${i}`} from={frame}>
          <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
