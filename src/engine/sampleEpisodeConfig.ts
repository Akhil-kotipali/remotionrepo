import { EpisodeConfig } from "./types";

export const SAMPLE_ENGINE_EPISODE: EpisodeConfig = {
  id: "UniversalEngineShowcase",
  title: "Universal Production Engine 3D Demonstration",
  fps: 30,
  width: 1080,
  height: 1920,
  durationInFrames: 900, // Exactly 30.0s @ 30fps
  theme: "cyberpunk",
  voiceoverAudioPath: "audio/voiceover_engine_demo_30s.wav",
  droneAudioPath: "audio/sfx/drone.wav",
  droneVolume: 0.28,
  enableSeamlessLoop: true,
  loopRewatchPrompt: "▲ REWATCH: CHECK THE SHUTTER SNAP",

  sentences: [
    {
      startSec: 0.2,
      endSec: 3.97,
      text: "Deep inside the simulation, an autonomous prototype was brought to life.",
      yellowWords: ["SIMULATION,", "PROTOTYPE"],
      redWords: ["AUTONOMOUS"],
    },
    {
      startSec: 4.5,
      endSec: 8.74,
      text: "Built entirely with procedural 3D shaders and deterministic physics.",
      yellowWords: ["PROCEDURAL", "3D"],
      redWords: ["PHYSICS."],
    },
    {
      startSec: 8.2,
      endSec: 13.54,
      text: "Watch as the engine choreographs dynamic lighting, tire drift, and real-time shadows.",
      yellowWords: ["DYNAMIC", "LIGHTING,"],
      redWords: ["DRIFT,", "SHADOWS."],
    },
    {
      startSec: 13.0,
      endSec: 17.07,
      text: "Every single frame rendered deterministically at sixty frames per second.",
      yellowWords: ["DETERMINISTICALLY"],
      redWords: ["SIXTY", "FRAMES"],
    },
    {
      startSec: 17.8,
      endSec: 20.55,
      text: "Then Arjun asked the question everyone was thinking.",
      yellowWords: ["QUESTION"],
      redWords: ["ARJUN"],
    },
    {
      startSec: 21.0,
      endSec: 24.11,
      text: "Can this engine produce any video format in seconds?",
      yellowWords: ["ENGINE"],
      redWords: ["SECONDS?"],
    },
    {
      startSec: 24.6,
      endSec: 29.32,
      text: "The answer is yes. And to prove how seamless it is, watch again. Because...",
      yellowWords: ["SEAMLESS"],
      redWords: ["BECAUSE..."],
    },
  ],

  sfxCues: [
    { frame: 0, sound: "camera_shutter", volume: 0.75 },
    { frame: 0, sound: "whoosh_soft", volume: 0.5 },
    { frame: 135, sound: "paper_flip", volume: 0.55 },
    { frame: 240, sound: "whoosh", volume: 0.65 },
    { frame: 245, sound: "glitch_hit", volume: 0.7 },
    { frame: 390, sound: "name_tick", volume: 0.5 },
    { frame: 540, sound: "thump_low", volume: 0.8 },
    { frame: 545, sound: "whoosh_soft", volume: 0.5 },
    { frame: 630, sound: "sting_high", volume: 0.45 },
    { frame: 750, sound: "whoosh", volume: 0.65 },
    { frame: 755, sound: "glitch_hit", volume: 0.7 },
    { frame: 840, sound: "riser", volume: 0.55, playbackRate: 0.9 },
    { frame: 864, sound: "reverse_swell", volume: 0.9 },
    { frame: 888, sound: "camera_shutter", volume: 0.9 },
  ],

  scenes: [
    // Scene 1: Dossier / Forensic Audit Hook (Frames 0 - 240 / 0.0s - 8.0s)
    {
      id: "scene_dossier_hook",
      type: "dossier",
      fromFrame: 0,
      durationFrames: 240,
      headerBadge: "SYSTEM ENGINE · 3D AUDIT",
      title: "CAN REACT SHADERS DRIFT IN 3D?",
      mediaPath: "backgrounds/exterior.jpg",
      targetLabel: "PROTOTYPE VEHICLE",
      targetCoords: { x: 260, y: 380, w: 440, h: 320 },
      laserLine: {
        fromX: 480,
        fromY: 900,
        toX: 480,
        toY: 540,
        label: "AUTONOMOUS SYSTEM",
      },
      stampText: "3D REALTIME PIPELINE",
    },

    // Scene 2: 3D Three.js Muscle Car Drift Showcase (Frames 240 - 540 / 8.0s - 18.0s)
    {
      id: "scene_3d_car_drift",
      type: "showcase3d",
      fromFrame: 240,
      durationFrames: 300,
      modelType: "muscle_car",
      mode: "drift",
      cameraPreset: "drift",
      lightingPreset: "cyberpunk",
      hudTitle: "APEX GT-R [HIGH TORQUE]",
      hudMetrics: [
        { label: "SPEED", value: "148 MPH" },
        { label: "G-FORCE", value: "1.42 G" },
        { label: "SHADER", value: "PBR CLEARCOAT" },
        { label: "GLB MESH", value: "14 NODES" },
      ],
    },

    // Scene 3: 2D Character Confrontation Dialogue (Frames 540 - 750 / 18.0s - 25.0s)
    {
      id: "scene_character_dialogue",
      type: "dialogue",
      fromFrame: 540,
      durationFrames: 210,
      backgroundPlate: "backgrounds/living_room.jpg",
      characters: [
        {
          id: "arjun",
          position: { x: 420, y: 1450 },
          scale: 1.05,
          facing: "right",
          expression: "shocked",
          showFace: true,
        },
        {
          id: "rahul",
          position: { x: 740, y: 1420 },
          scale: 1.0,
          facing: "left",
          expression: "curious",
          showFace: true,
        },
      ],
      activeSpeakerId: "arjun",
      speechBubbleText: "Is this entire 3D world rendered in React?",
      cameraPush: {
        fromScale: 1.0,
        toScale: 1.25,
        focusX: 540,
        focusY: 1200,
      },
    },

    // Scene 4: 3D Turntable Climax & Seamless Loop Bridge (Frames 750 - 900 / 25.0s - 30.0s)
    {
      id: "scene_3d_climax_loop",
      type: "showcase3d",
      fromFrame: 750,
      durationFrames: 150,
      modelType: "muscle_car",
      mode: "cyberpunk",
      cameraPreset: "turntable",
      lightingPreset: "cyberpunk",
      hudTitle: "SYSTEM CYCLE COMPLETE",
      hudMetrics: [
        { label: "STATUS", value: "CYCLE OPTIMAL" },
        { label: "LOOP", value: "SEAMLESS (100%)" },
        { label: "FPS", value: "30.0 DETERMINISTIC" },
      ],
    },
  ],
};
