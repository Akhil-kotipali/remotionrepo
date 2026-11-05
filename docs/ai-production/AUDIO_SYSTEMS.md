# AUDIO & SOUND DESIGN ARCHITECTURE

This document details the audio pipeline, neural voice synthesis via `edge-tts`, acoustic DSP normalization, spatial sound effect integration, and background drone layering.

---

## 1. High-Level Audio Architecture

```
┌────────────────────────┐
│  audio_schedule.json   │  (Dialogue lines, character assignments, timestamps, pitch/rate)
└───────────┬────────────┘
            │ Processed via scripts/audio_adapter.py
            ▼
┌────────────────────────┐
│  Microsoft edge-tts    │  (High-fidelity neural voiceover synthesis)
└───────────┬────────────┘
            │ Raw audio streams
            ▼
┌────────────────────────┐
│ DSP Acoustic Pipeline  │  (Silence trimming -> Room convolution reverb -> -1.5 dBFS normalization)
└───────────┬────────────┘
            │ Writes public/packages/<id>/audio/voiceover_master.wav
            ▼
┌────────────────────────┐
│  Remotion Audio Mixer  │  (Mixes Master Voiceover + Ambient Drone + 11 Spatial SFX Cues)
└────────────────────────┘
```

---

## 2. Neural Voiceover Synthesis (`scripts/audio_adapter.py`)

The repository integrates Microsoft Neural Voices via Python's `edge-tts` (100% free, high-fidelity, zero API keys required).

### 2.1 Supported Character Voice Mappings

| Character ID | Recommended Neural Voice | Voice Persona / Tone | Rate | Pitch |
|---|---|---|---|---|
| `"narrator"` | `en-US-ChristopherNeural` | Deep, clinical, authoritative male | `+0%` | `-5Hz` |
| `"arjun"` | `en-US-BrianMultilingualNeural` | Grounded, tech analyst male | `+0%` | `+0Hz` |
| `"dev"` | `en-US-GuyNeural` | Conversational, warm storyteller | `+2%` | `-2Hz` |
| `"rahul"` | `en-US-EricNeural` | Deep, athletic, resonant male | `-3%` | `-8Hz` |
| `"meera"` | `en-US-AriaNeural` | Observant, articulate female | `+0%` | `+0Hz` |
| `"kabir"` | `en-GB-RyanNeural` | Crisp, British analytical male | `-2%` | `-4Hz` |
| `"nisha"` | `en-US-JennyNeural` | Quick-witted, upbeat female | `+3%` | `+2Hz` |
| `"reflection"`| `en-US-ChristopherNeural` | Eerie, whispered, slowed male | `-5%` | `-10Hz` |

---

## 3. Audio DSP & Mastering Standards

Every audio track processed by `audio_adapter.py` passes through automated mastering:

### 3.1 Silence Trimming (`waveform_trim_silence`)
Trims dead digital silence at the start and tail of each speech file using a `-40 dB` threshold with a `20ms` safety padding to prevent chopped consonants.

### 3.2 Acoustic Room Reverb (`add_reverb`)
Applies subtle synthetic convolution impulse response (`rt = 0.35s`, `mix = 0.15`, 3.5kHz low-pass filter) to eliminate sterile dry microphone artifacts and seat voices naturally in a physical space.

### 3.3 Broadcast Normalization
Normalizes peak amplitudes to **`-1.5 dBFS`** (`target_peak = 10 ** (-1.5 / 20) * 32767 ≈ 27580`) to ensure consistent loudness across YouTube Shorts and Instagram feeds without digital clipping.

---

## 4. Master Audio Schedule Schema (`audio_schedule.json`)

```json
{
  "title": "EPISODE VOICE SCRIPT",
  "fps": 30,
  "sampleRate": 44100,
  "totalDurationSec": 28.0,
  "lines": [
    {
      "character": "narrator",
      "voice": "en-US-ChristopherNeural",
      "rate": "+0%",
      "pitch": "-5Hz",
      "text": "Your reflection isn't supposed to move after you leave.",
      "startFrame": 6,
      "startSec": 0.2,
      "yellowWords": ["REFLECTION", "ISN'T", "MOVE", "LEAVE"],
      "redWords": []
    }
  ]
}
```

---

## 5. Sound Effects & Spatial Audio Library (`public/audio/sfx/`)

SFX cues are placed directly on timeline frame numbers inside `EpisodeConfig`:

```json
{
  "sfxCues": [
    { "frame": 0, "sound": "audio/sfx/impact_boom.wav", "volume": 0.95 },
    { "frame": 60, "sound": "audio/sfx/glitch_hit.wav", "volume": 0.70 },
    { "frame": 485, "sound": "audio/sfx/crack_glass.wav", "volume": 1.0, "playbackRate": 1.0 },
    { "frame": 545, "sound": "audio/sfx/crack_glass.wav", "volume": 1.0, "playbackRate": 1.05 },
    { "frame": 605, "sound": "audio/sfx/crack_glass.wav", "volume": 1.0, "playbackRate": 0.95 },
    { "frame": 690, "sound": "audio/sfx/reverse_swell.wav", "volume": 0.85, "playbackRate": 0.85 },
    { "frame": 810, "sound": "audio/sfx/camera_shutter.wav", "volume": 0.95 }
  ]
}
```

### SFX Library Catalog
- **`impact_boom.wav`:** Low sub-bass drop (0 – 80Hz) used on opening hooks and major plot twists.
- **`crack_glass.wav`:** Acoustic high-frequency shatter used on physical impact.
- **`ear_ring.wav`:** 55Hz – 4kHz tinnitus frequency used as constant ambient tension drone.
- **`glitch_hit.wav`:** Digital noise transient for visual cuts.
- **`camera_shutter.wav`:** Physical mechanical shutter trigger for the seamless loop bridge.
- **`reverse_swell.wav`:** Riser element that smoothly dissolves into the opening frame.
