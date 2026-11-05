# SUBTITLE & CAPTION SYSTEMS

This document explains the subtitle and caption architecture, including word-level kinetic pacing, high-retention color highlighting, SRT file export, and caption component usage.

---

## 1. Universal Captions Engine (`src/engine/UniversalCaptions.tsx`)

Vertical Shorts content relies heavily on kinetic captions to maintain high retention (>70% stayed rate). The universal caption engine automatically structures spoken narration into digestible, rhythmically balanced text blocks.

```
┌─────────────────────────────────┐
│       "Your reflection isn't"   │  <- 3-4 word balanced chunk
│             "to move after you" │
└─────────────────────────────────┘
```

### 1.1 Chunking Algorithm (`buildChunksFromSentences`)
1. Takes an array of `SentenceTiming` objects (`startSec`, `endSec`, `text`, `yellowWords`, `redWords`).
2. Splits sentences into groups of 3 to 4 words, respecting punctuation boundaries (`.`, `?`, `!`, `,`).
3. Balances orphan trailing single-word groups by merging with preceding chunks.
4. Distributes time proportionally based on character length so that long words receive more screen time than short prepositions.

---

## 2. Kinetic Word Highlights

Words inside each caption chunk are styled dynamically depending on their retention emphasis:

| Highlight Code | Color Name | Hex Code | Visual Effect | Purpose |
|---|---|---|---|---|
| `hl === 0` | Standard Text | `#ffffff` | Pure white with 2px black text stroke | Crisp legibility |
| `hl === 1` | Keyword Focus | `#eab308` | Golden yellow glow (`#ffcc00`) | Cognitive hook words |
| `hl === 2` | Danger Alert | `#ef4444` | Crimson red glow (`#f43f5e`) | High-tension terror words |

### 2.1 Schema Definition (`SentenceTiming`)
```ts
export interface SentenceTiming {
  startSec: number;
  endSec: number;
  text: string;
  speaker?: string;
  yellowWords?: string[]; // Array of uppercase keywords to highlight yellow
  redWords?: string[];    // Array of uppercase keywords to highlight red
}
```

### 2.2 Example Configuration
```json
{
  "startSec": 0.2,
  "endSec": 2.5,
  "text": "Your reflection isn't supposed to move after you leave.",
  "yellowWords": ["REFLECTION", "ISN'T", "MOVE", "LEAVE"],
  "redWords": []
}
```

---

## 3. Visual Styling & Typography Standards

The captions are rendered inside a pill badge container positioned in the lower-third vertical space:

```tsx
<div
  style={{
    position: "absolute",
    top: topY, // Default 1260px (safe zone above YouTube Shorts UI buttons)
    left: 60,
    right: 60,
    textAlign: "center",
    zIndex: 90,
  }}
>
  <div
    style={{
      display: "inline-block",
      backgroundColor: "rgba(5, 10, 20, 0.88)",
      border: "2px solid rgba(255, 255, 255, 0.15)",
      borderRadius: 16,
      padding: "16px 28px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
      backdropFilter: "blur(8px)",
    }}
  >
    {/* Words render with heavy stroke and high-contrast typography */}
  </div>
</div>
```

---

## 4. Subtitle Export Pipeline (SRT)

`scripts/audio_adapter.py` includes automatic SubRip (`.srt`) subtitle file generation:

```python
from scripts.audio_adapter import generate_srt

# Writes standard .srt file with microsecond accuracy
generate_srt(sentences, "output final videos/my_episode.srt")
```
This enables uploading raw `.srt` sidecars directly to YouTube Studio or Instagram alongside the rendered MP4.
