# DEPENDENCY MATRIX & SYSTEM PREREQUISITES

This document details all software packages, libraries, hardware configurations, and system requirements for running the video engine.

---

## 1. Node.js & NPM Ecosystem

Verified from `package.json` and active environment:
- **Node.js:** `v22.x` / `v20.x`
- **React:** `19.2.3`
- **React DOM:** `19.2.3`
- **TypeScript:** `5.9.3`
- **Remotion Core:** `4.0.539`
  - `@remotion/cli`: `4.0.539`
  - `@remotion/three`: `4.0.539`
  - `@remotion/media-utils`: `4.0.539`
  - `@remotion/google-fonts`: `4.0.539`
  - `@remotion/tailwind-v4`: `4.0.539`
- **3D Graphics:**
  - `three`: `^0.186.1`
  - `@react-three/fiber`: `^9.8.2`
  - `@react-three/drei`: `^10.7.9`
  - `@types/three`: `^0.186.0`
- **Styling & CSS:**
  - `tailwindcss`: `4.0.0`
- **External Voice APIs:**
  - `@elevenlabs/elevenlabs-js`: `^2.75.0` (Optional)

---

## 2. Python Ecosystem

Verified from active Python environment:
- **Python Version:** `3.10+` / `3.11+`
- **Speech Synthesis:**
  - `edge-tts`: `7.3.1` (Neural TTS synthesis via Microsoft edge service)
- **Audio Processing:**
  - `miniaudio`: `1.71` (Fast PCM WAV decoding & duration measurement)
  - `numpy`: `2.2.6` (Audio waveform arrays and amplitude calculations)
  - `scipy`: `1.16.1` (Butterworth filters and room impulse convolution)
- **Image & Data:**
  - `pillow`: `11.3.0` (Image resolution checks and conversions)
  - `torch`: `2.8.0` (Available for local ML pipelines)
  - `requests`: `2.32.5` (HTTP downloads)

---

## 3. Hardware & OS Requirements

- **Operating System:** Windows 11 (PowerShell 5.1 / 7+)
- **GPU:** NVIDIA GeForce RTX 3050 Laptop GPU (4 GB VRAM)
- **DirectX:** DirectX 11 / D3D11 feature level 11_0
- **System Memory:** 16 GB RAM minimum
- **Storage:** ~5 GB free space for render frame caches and temporary audio buffers

---

## 4. Verification Check Command

To verify that all required project dependencies and tools are healthy:
```bash
python studio.py audit
```
Expected output:
```
[OK] TypeScript: 0 errors (clean compilation)
[OK] Found GLB: public/models/MUSCLE_CAR.glb (6.2 MB)
[OK] Found Background: public/backgrounds/living_room.jpg
[OK] Found SFX: public/audio/sfx/impact_boom.wav
[OK] AUDIT PASSED! All core engine dependencies are verified and healthy.
```
