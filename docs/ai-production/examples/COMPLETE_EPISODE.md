# EXAMPLE 5: COMPLETE MULTI-SCENE EPISODE CONFIGURATION

This example provides a complete, copy-pasteable `manifest.json` that produces an entire 28-second vertical Short combining multiple scenes, neural audio, captions, SFX, and a seamless loop bridge.

---

## 1. Master Manifest (`manifest.json`)

```json
{
  "episodeId": "mirror_anomaly_01",
  "title": "THE MIRROR ANOMALY: YOUR REFLECTION STAYS",
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "durationInFrames": 840,
  "theme": "analog_horror",
  "audioTrack": "audio/voiceover_master.wav",
  "droneAudioTrack": "audio/sfx/ear_ring.wav",
  "droneVolume": 0.20,
  "enableSeamlessLoop": true,
  "loopRewatchPrompt": "▲ REWATCH: CHECK THE GLASS BEFORE IT TURNS",
  "sentences": [
    {
      "startSec": 0.2,
      "endSec": 2.5,
      "text": "Your reflection isn't supposed to move after you leave.",
      "yellowWords": ["REFLECTION", "ISN'T", "MOVE", "LEAVE"]
    },
    {
      "startSec": 3.0,
      "endSec": 7.5,
      "text": "You stop smiling. But in the glass... it smiles wider.",
      "yellowWords": ["STOP", "SMILING", "GLASS", "WIDER"]
    },
    {
      "startSec": 9.0,
      "endSec": 16.5,
      "text": "You freeze. Your hands are down... but inside the mirror, it starts knocking.",
      "yellowWords": ["FREEZE", "HANDS", "INSIDE", "KNOCKING"]
    },
    {
      "startSec": 18.0,
      "endSec": 25.0,
      "text": "You back away. It presses flat against the glass and whispers: Don't leave me here.",
      "yellowWords": ["PRESSES", "FLAT", "WHISPERS"],
      "redWords": ["DON'T", "LEAVE"]
    }
  ],
  "sfxCues": [
    { "frame": 0, "sound": "audio/sfx/impact_boom.wav", "volume": 0.95 },
    { "frame": 60, "sound": "audio/sfx/glitch_hit.wav", "volume": 0.70 },
    { "frame": 485, "sound": "audio/sfx/crack_glass.wav", "volume": 1.0, "playbackRate": 1.0 },
    { "frame": 545, "sound": "audio/sfx/crack_glass.wav", "volume": 1.0, "playbackRate": 1.05 },
    { "frame": 605, "sound": "audio/sfx/crack_glass.wav", "volume": 1.0, "playbackRate": 0.95 },
    { "frame": 690, "sound": "audio/sfx/reverse_swell.wav", "volume": 0.85, "playbackRate": 0.85 },
    { "frame": 810, "sound": "audio/sfx/camera_shutter.wav", "volume": 0.95 }
  ],
  "scenes": [
    {
      "id": "scene_01_the_hook",
      "type": "mirror_horror",
      "durationInFrames": 180,
      "headerPill": "ANOMALY AUDIT • MIRROR #04",
      "backgroundSrc": "backgrounds/living_room.jpg",
      "realCharacter": {
        "id": "arjun",
        "position": { "x": 540, "y": 1580 },
        "scale": 1.25,
        "facing": "left",
        "pose": "walking_away",
        "emotion": "neutral"
      },
      "reflectionCharacter": {
        "id": "reflection",
        "position": { "x": 540, "y": 1250 },
        "scale": 1.05,
        "facing": "right",
        "pose": "delayed_turn",
        "emotion": "neutral"
      },
      "mirrorFrame": { "x": 160, "y": 300, "w": 760, "h": 1120 },
      "cameraMotion": { "fromScale": 1.0, "toScale": 1.08, "fromY": 0, "toY": -20 }
    },
    {
      "id": "scene_02_wrong_smile",
      "type": "mirror_horror",
      "durationInFrames": 270,
      "headerPill": "BIOMETRIC DESYNC DETECTED",
      "backgroundSrc": "backgrounds/living_room.jpg",
      "realCharacter": {
        "id": "arjun",
        "position": { "x": 420, "y": 1600 },
        "scale": 1.30,
        "facing": "right",
        "pose": "standingFrozen",
        "emotion": "hollowScared"
      },
      "reflectionCharacter": {
        "id": "reflection",
        "position": { "x": 540, "y": 1250 },
        "scale": 1.08,
        "facing": "right",
        "pose": "creepy_smile",
        "emotion": "creepySmile"
      },
      "mirrorFrame": { "x": 140, "y": 280, "w": 800, "h": 1180 },
      "cameraMotion": { "fromScale": 1.08, "toScale": 1.20, "fromY": -20, "toY": -50 }
    },
    {
      "id": "scene_03_the_knocks",
      "type": "mirror_horror",
      "durationInFrames": 240,
      "headerPill": "PHYSICAL IMPACT FROM INTERIOR",
      "backgroundSrc": "backgrounds/living_room.jpg",
      "realCharacter": {
        "id": "arjun",
        "position": { "x": 380, "y": 1640 },
        "scale": 1.38,
        "facing": "right",
        "pose": "standingFrozen",
        "emotion": "frozenTerror"
      },
      "reflectionCharacter": {
        "id": "reflection",
        "position": { "x": 540, "y": 1250 },
        "scale": 1.15,
        "facing": "right",
        "pose": "knocking_glass",
        "emotion": "creepySmile",
        "knockingFrames": [35, 95, 155]
      },
      "mirrorFrame": { "x": 120, "y": 240, "w": 840, "h": 1240 },
      "cameraMotion": { "fromScale": 1.20, "toScale": 1.32, "fromY": -50, "toY": -70 }
    },
    {
      "id": "scene_04_whisper_loop",
      "type": "mirror_horror",
      "durationInFrames": 150,
      "headerPill": "CONTAINMENT BREACH",
      "backgroundSrc": "backgrounds/living_room.jpg",
      "realCharacter": {
        "id": "arjun",
        "position": { "x": 340, "y": 1680 },
        "scale": 1.42,
        "facing": "left",
        "pose": "stepping_back",
        "emotion": "hollowScared"
      },
      "reflectionCharacter": {
        "id": "reflection",
        "position": { "x": 540, "y": 1250 },
        "scale": 1.20,
        "facing": "right",
        "pose": "pressing_glass",
        "emotion": "hollowScared",
        "whisperSubtext": "DON'T LEAVE ME HERE"
      },
      "mirrorFrame": { "x": 100, "y": 220, "w": 880, "h": 1280 },
      "cameraMotion": { "fromScale": 1.32, "toScale": 1.48, "fromY": -70, "toY": -95 }
    }
  ]
}
```

---

## 2. Rendering Command
To render this complete episode:
```bash
python studio.py package packages/my_episode.zip
```
