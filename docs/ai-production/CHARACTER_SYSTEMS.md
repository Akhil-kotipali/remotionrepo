# CHARACTER SYSTEMS & KINEMATICS RIGS

This document details all character implementations in the repository, including procedural 2D SVG kinematics rigs, stick figures, 3D characters, facial emotion morphing, and scene integration.

---

## 1. Character Identity Catalog

The repository features 7 core characters implemented natively in code:

| Character ID | Name | Role / Persona | Palette / Styling | Default Accessory |
|---|---|---|---|---|
| `"arjun"` | Arjun | Lead investigator / Tech analyst | Olive jacket (`#4a5d4e`), messy wavy hair (`#1a1a1a`), warm skin (`#c68b59`) | Smartphone (`hasPhone: true`) |
| `"dev"` | Dev | Conversational mediator / Storyteller | Navy shirt (`#2C4A70`), tight curly hair (`#172A42`), medium skin (`#b87d4b`) | None |
| `"rahul"` | Rahul | Protective anchor / Heavy build | Rust brown jacket (`#A25332`), broad shoulders, athletic build | None |
| `"meera"` | Meera | Documentarian / Observant artist | Burgundy outfit (`#7D334C`), long dark hair braid (`#1a1a1a`), fair skin | SLR Camera (`hasCamera: true`) |
| `"kabir"` | Kabir | Strategic analyst / Precision thinker | Teal sweater (`#2D7377`), textured hair, tall build (`heightScale: 1.05`) | Reading Glasses (`hasGlasses: true`) |
| `"nisha"` | Nisha | Operations coordinator / Quick-witted | Mustard top (`#C29631`), sharp bob haircut (`#2a2015`), golden skin | None |
| `"reflection"`| The Entity | Spectral mirror anomaly counterpart | Desaturated gray skin (`#949DA8`), void hair (`#020617`), cold cyan accent (`#38BDF8`) | Decoupled Animation Rig |

---

## 2. The Procedural SVG Character Rig (`src/characters/Character.tsx`)

### 2.1 Core Capabilities
- **Idle Breathing:** Procedural chest rise and shoulder drop computed via `Math.sin((frame + offset) * 0.08) * 2`.
- **Head Sway & Tilt:** Subtle natural head motion computed via `Math.sin((frame + offset) * 0.04) * 1.5`.
- **Decoupled Eyes & Gaze:** Pupils move independently to target coordinates (`"center"`, `"left"`, `"right"`, `"up"`, `"down"`).
- **Zero External Assets:** 100% rendered via scalable vector math. No PNGs or heavy 3D GLTF files required.

### 2.2 Emotion System (`Emotion`)
Facial features morph dynamically based on the `emotion` prop:

| Emotion ID | Eyebrows Geometry | Eyes & Pupils | Mouth Geometry |
|---|---|---|---|
| `"neutral"` | Soft horizontal arcs | Normal oval pupils | Gentle horizontal curve |
| `"worried"` | Inverted arched brows | Wide circular pupils | Slight downward trembling curve |
| `"angry"` | Sharp V-angled downward brows | Narrow slit pupils | Tight grimace with teeth line |
| `"sad"` | Drooping outer brows | Half-lidded downcast eyes | Curved downward frown |
| `"scared"` | Raised high on forehead | Fully dilated pupils | Small open oval gasp |
| `"relieved"` | Relaxed flat brows | Soft smiling crescents | Gentle upward smile |
| `"happy"` | Raised arched brows | Expressive crescent eyes | Wide open toothy smile |
| `"creepySmile"` | Manic arched brows peaking at center | Dilated staring pupils | Unnatural wide crescent void with sharp teeth |
| `"hollowScared"`| High-tension trembling brows | Frozen dilated eyes | Trembling hollow open mouth |
| `"frozenTerror"`| Asymmetrical locked brows | Fixed locked gaze | Clenched locked jaw |

### 2.3 Kinematic Poses (`Pose`)
Arm and body rigging dispatches to specialized geometric limbs:

| Pose ID | Left Arm Rigging | Right Arm Rigging | Body Stance |
|---|---|---|---|
| `"idle"` | Resting at side with gentle sway | Resting at side with gentle sway | Balanced vertical stance |
| `"walking"` | Opposite pendulum swing | Opposite pendulum swing | Hip bobbing cycle |
| `"talking"` | Gesturing at chest level | Open palm emphasis | Slight forward lean |
| `"phone"` | Resting at side | Bent at 65° holding illuminated phone | Head tilted toward hand |
| `"camera"` | Supporting camera base | Index finger on camera shutter button | Eye aligned with viewfinder |
| `"armsCrossed"` | Folded across chest | Folded across chest | Shifted hip weight |
| `"knocking"` | Clenched fist raised at shoulder | Clenched fist hammering on glass | Tensed forward stance |
| `"pressingGlass"`| Flat spread palm pressed forward | Flat spread palm pressed forward | Pressed flat against glass boundary |
| `"standingFrozen"`| Locked straight at side | Locked straight at side | Perfectly rigid, zero breathing |

---

## 3. Controlling Characters in Production Scenes

### 3.1 Via `DialogueScene` Configuration
```json
{
  "type": "dialogue",
  "backgroundPlate": "backgrounds/living_room.jpg",
  "characters": [
    {
      "id": "arjun",
      "position": { "x": 380, "y": 1400 },
      "scale": 1.25,
      "facing": "right",
      "pose": "signature",
      "expression": "shocked"
    },
    {
      "id": "meera",
      "position": { "x": 720, "y": 1420 },
      "scale": 1.20,
      "facing": "left",
      "pose": "holdingCamera",
      "expression": "worried"
    }
  ]
}
```

### 3.2 Via `MirrorHorrorScene` Configuration
Allows decoupling a real character from their mirror reflection:
```json
{
  "type": "mirror_horror",
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
  }
}
```

---

## 4. Stick Figure System (`src/stick/`)

For stylized minimal storytelling, the repository includes stick figure rigs:
- **`FriendStickFigure`:** Recreates Arjun, Dev, Rahul, Meera, Kabir, and Nisha with color-coded tubular lines, modular hair caps, glasses, and cameras.
- **`StickFigure`:** Animation vs Animator style characters (`red`, `yellow`, `orange`, `green`, `blue`). Orange features a hollow head (`isHollowHead: true`), and Green wears DJ headphones (`hasHeadphones: true`).
