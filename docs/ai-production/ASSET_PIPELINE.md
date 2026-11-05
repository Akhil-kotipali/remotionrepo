# ASSET PIPELINE, MANIFESTS & REFERENCE BOARDS

This document details the asset resolution system, the `asset-manifest.json` specification, missing-asset detection, and the intelligent acquisition workflow.

---

## 1. Asset Resolution Principles

The asset pipeline (`scripts/ingest_package.py`) resolves external files safely into Remotion's webserver namespace without file name collisions:

```
[Declared Asset Path in Package]
        │
        ├── 1. Code-First Check: status == "implemented_in_code" or type == "procedural_rig"
        │      └── Mark resolved immediately (zero downloads needed)
        │
        ├── 2. Package-Local Check: Is file in package extraction folder?
        │      └── Map to packages/<episode_id>/assets/...
        │
        ├── 3. Public Library Fallback: Is file in public/ library?
        │      └── Map to public/<category>/<filename>
        │
        └── 4. Missing Asset Detection:
               └── Halt safely, generate ASSET_ACQUISITION_GUIDE.md, output exact download instructions
```

---

## 2. Asset Manifest Specification (`asset-manifest.json`)

Every compliant production package includes `asset-manifest.json` describing all dependencies:

```json
{
  "episodeId": "mirror_anomaly_01",
  "title": "THE MIRROR ANOMALY: YOUR REFLECTION STAYS",
  "schemaVersion": "2.0.0",
  "generatedAt": "2026-11-05T08:45:00",
  "summary": {
    "totalAssets": 5,
    "implementedInCode": 2,
    "generated": 1,
    "available": 2,
    "missing": 0
  },
  "assets": [
    {
      "id": "char_arjun_rig",
      "category": "character",
      "type": "procedural_rig",
      "description": "Procedural 2D/3D rigged human protagonist with joint kinematics",
      "associatedScenes": ["scene_01_the_hook", "scene_02_wrong_smile"],
      "required": true,
      "status": "implemented_in_code",
      "acquisitionMethod": "Remotion React SVG / Canvas procedural geometry",
      "source": "src/characters/Character.tsx",
      "expectedFilename": "Character.tsx",
      "expectedDirectory": "src/characters/",
      "validationStatus": "valid"
    },
    {
      "id": "bg_bathroom_corridor",
      "category": "environment",
      "type": "image",
      "description": "Cinematic dark residential interior background",
      "associatedScenes": ["scene_01_the_hook", "scene_02_wrong_smile"],
      "required": true,
      "status": "available",
      "acquisitionMethod": "AI Generation or High-Resolution Studio Plate",
      "source": "public/backgrounds/living_room.jpg",
      "license": "Royalty-Free / Unsplash Clean",
      "expectedFilename": "living_room.jpg",
      "expectedDirectory": "public/packages/mirror_anomaly_01/assets/backgrounds",
      "packagePath": "assets/backgrounds/living_room.jpg",
      "fileFormat": "JPG",
      "resolution": "1080x1920 minimum (9:16 vertical)",
      "validationStatus": "valid"
    }
  ]
}
```

### Supported Asset Statuses
- **`"implemented_in_code"`:** Implemented via SVG/Canvas/Three.js code. The resolver bypasses disk checks and never flags this as missing.
- **`"generated"`:** Synthesized at runtime (e.g. neural TTS voiceovers from `edge-tts`).
- **`"available"`:** File is physically present in the package or public library.
- **`"missing"`:** Mandatory file is missing. Ingestion will pause safely with exit code 1.

---

## 3. The Asset Acquisition Guide (`ASSET_ACQUISITION_GUIDE.md`)

When an external package arrives with missing assets, the ingestion engine automatically prints and saves `ASSET_ACQUISITION_GUIDE.md`:

```markdown
# ASSET ACQUISITION GUIDE
**Episode:** THE MIRROR ANOMALY (`mirror_missing_ep`)

## Summary of Manual Acquisition Requirements
Found 1 asset(s) that require manual placement:

### [1] Asset ID: `bg_bathroom_corridor` (ENVIRONMENT)
- **Description:** Cinematic dark residential interior background with neutral ceramic tile texture
- **Affected Scenes:** scene_01_the_hook, scene_02_wrong_smile
- **Required File Format:** JPG (1080x1920 @ 9:16 vertical)
- **Expected Filename:** `dark_bathroom_mirror.jpg`
- **Exact Destination Folder:** `public/packages/mirror_missing_ep/assets/backgrounds`
- **Recommended Source URL:** [https://images.unsplash.com/photo-1584622650111-993a426fbf0a](https://images.unsplash.com/photo-1584622650111-993a426fbf0a)
- **AI Image Generation Prompt (Recommended Alternative):**
  > *"Cinematic moody interior bathroom corridor with rectangular wall mirror, cool overhead downlighting, neutral ceramic tiles, empty foreground space, no people, no reflections"*
```

---

## 4. Re-Validation Command (`studio.py assets`)

After downloading or dropping the missing asset into the destination folder, run:
```bash
python studio.py assets <episode_id>
```
If all assets resolve, it outputs:
```
[OK] 100% of required assets are resolved! Ready for rendering.
```
and exits with code `0`.
