# COMPATIBILITY & CONFIGURATION MATRIX

This document maps cross-compatibility between scene types, character rigs, camera presets, audio tracks, and export resolutions.

---

## 1. Scene Type Compatibility Matrix

| Scene Type (`type`) | Supports 2D Characters? | Supports 3D Models? | Supports Background Plates? | Supports HUD Overlays? | Supports Captions? |
|---|---|---|---|---|---|
| `"dossier"` | No | No | Yes (`mediaPath`) | Yes (`targetBox`, `laserVector`) | Yes |
| `"showcase3d"` | No | Yes (`modelPath`) | Optional | Yes (`hudMetrics`) | Yes |
| `"dialogue"` | Yes (`characters[]`) | No | Yes (`backgroundPlate`)| Yes (Speech Bubble) | Yes |
| `"infographic"` | No | No | Optional | Yes (Data Cards) | Yes |
| `"mirror_horror"` | Yes (`real`, `reflection`)| No | Yes (`backgroundSrc`) | Yes (Header Pill, Subtext)| Yes |

---

## 2. Character Rig Compatibility Matrix

| Character ID | Supported in `DialogueScene`? | Supported in `MirrorHorrorScene`? | Supported in `FriendStickFigure`? | Has Voice Mapping in `edge-tts`? |
|---|---|---|---|---|
| `"arjun"` | Yes | Yes | Yes | Yes (`en-US-BrianMultilingualNeural`) |
| `"dev"` | Yes | Yes | Yes | Yes (`en-US-GuyNeural`) |
| `"rahul"` | Yes | Yes | Yes | Yes (`en-US-EricNeural`) |
| `"meera"` | Yes | Yes | Yes | Yes (`en-US-AriaNeural`) |
| `"kabir"` | Yes | Yes | Yes | Yes (`en-GB-RyanNeural`) |
| `"nisha"` | Yes | Yes | Yes | Yes (`en-US-JennyNeural`) |
| `"reflection"`| Yes | Yes | No | Yes (`en-US-ChristopherNeural`) |

---

## 3. Audio & Format Compatibility Matrix

| Audio Format | Remotion `<Audio />` | Python Ingestion Resolver | DSP Normalization |
|---|---|---|---|
| **PCM WAV (44.1kHz / 16-bit)** | Native Support | Native Support | Native Support |
| **PCM WAV (48.0kHz / 24-bit)** | Native Support | Native Support | Downsampled to 44.1kHz |
| **MP3 (192kbps - 320kbps)** | Native Support | Native Support | Converted via miniaudio |
| **AAC / M4A** | Native Support | Partial | Converted to WAV |
| **OGG / FLAC** | Browser-dependent | Supported | Converted to WAV |

---

## 4. Video Export Dimensions

| Platform / Format | Aspect Ratio | Dimensions | FPS | Render Support |
|---|---|---|---|---|
| **YouTube Shorts** | 9:16 Vertical | 1080 x 1920 | 30 | Primary Production Standard |
| **Instagram Reels / TikTok** | 9:16 Vertical | 1080 x 1920 | 30 | Primary Production Standard |
| **Instagram Feed (4:5)** | 4:5 Vertical | 1080 x 1350 | 30 | Supported via `src/instagram/` wrappers |
| **YouTube Long-Form (16:9)** | 16:9 Horizontal | 1920 x 1080 | 30 | Supported by configuring `width: 1920, height: 1080` in manifest |
