# Remotion + ElevenLabs Voice Sync & 3D Model Pipeline

This Remotion project includes full support for **ElevenLabs AI voiceover with frame-accurate word sync** and **Three.js 3D model rendering (.glb / .gltf)**.

---

## 🎙️ ElevenLabs Voice Synchronization

### 1. Setup API Key
Create a `.env` file in the root directory:
```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Optional (Rachel by default)
```

### 2. Generate Audio & Timestamps
Run the generator script with your desired script:
```bash
npm run generate:tts -- "Your voiceover script goes here..."
```

This outputs:
- `public/audio/<filename>.mp3`: High-fidelity audio file.
- `public/audio/<filename>.json`: Frame-accurate word-level timestamp metadata:
  ```json
  {
    "durationInFrames": 260,
    "words": [
      { "text": "Welcome", "startFrame": 3, "endFrame": 12 },
      { "text": "to", "startFrame": 13, "endFrame": 22 }
    ]
  }
  ```

### 3. Generate Subtitles (SRT)
```bash
npm run generate:captions
```

---

## 🧊 3D Models (.glb / .gltf) Support

The project is configured with `@remotion/three`, `@react-three/fiber`, and `@react-three/drei`.

### Built-in 3D Character
A fully procedural, speech-reactive 3D character is included in `src/components/ThreeDScene.tsx`. It automatically reacts to speaking states (mouth opening, visor glowing, idle floating).

### Loading Custom 3D Models
1. Drop your `.glb` model into `public/models/my_character.glb`.
2. Use the included `GLBModelLoader` component:
```tsx
import { GLBModelLoader } from "./components/GLBModelLoader";
import { staticFile } from "remotion";

<GLBModelLoader
  modelPath={staticFile("models/my_character.glb")}
  animationName="Talk" // Name of baked animation clip
  position={[0, -1, 0]}
  scale={1.5}
/>
```

---

## 🚀 Running the Project

**Start Remotion Studio:**
```bash
npm run dev
```

**Render Video:**
```bash
npx remotion render VoiceAnd3D out.mp4
```

**Render Still Frame:**
```bash
npx remotion still VoiceAnd3D out.png --frame=30
```
