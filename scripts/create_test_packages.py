#!/usr/bin/env python3
"""
Creates test packages for verifying the Claude ZIP -> Remotion video pipeline:
1. packages/claude_demo_showcase.zip (Valid, complete test package)
2. packages/test_missing_asset.zip (Missing mandatory asset scenario)
3. packages/test_invalid_manifest.zip (Invalid schema scenario)
"""

import json
import os
import shutil
import zipfile

def build_packages():
    os.makedirs("packages", exist_ok=True)
    tmp_build = "tmp_pkg_build"
    if os.path.exists(tmp_build):
        shutil.rmtree(tmp_build)
    os.makedirs(tmp_build)

    # =========================================================================
    # 1. VALID PACKAGE: claude_demo_showcase.zip
    # =========================================================================
    pkg1_dir = os.path.join(tmp_build, "claude_demo_showcase")
    os.makedirs(os.path.join(pkg1_dir, "assets", "backgrounds"), exist_ok=True)
    os.makedirs(os.path.join(pkg1_dir, "assets", "models"), exist_ok=True)
    os.makedirs(os.path.join(pkg1_dir, "assets", "sfx"), exist_ok=True)

    # Copy real assets from repository
    shutil.copy2("public/backgrounds/exterior.jpg", os.path.join(pkg1_dir, "assets", "backgrounds", "evidence_exterior.jpg"))
    shutil.copy2("public/backgrounds/living_room.jpg", os.path.join(pkg1_dir, "assets", "backgrounds", "confrontation_room.jpg"))
    shutil.copy2("public/models/MUSCLE_CAR.glb", os.path.join(pkg1_dir, "assets", "models", "PROTOTYPE_VEHICLE.glb"))
    shutil.copy2("public/audio/sfx/camera_shutter.wav", os.path.join(pkg1_dir, "assets", "sfx", "shutter.wav"))

    # manifest.json
    manifest = {
        "episodeId": "claude_demo_01",
        "title": "THE AUTONOMOUS ANOMALY",
        "fps": 30,
        "width": 1080,
        "height": 1920,
        "durationInFrames": 600,  # 20.0s concise, fast render demonstration
        "theme": "cyberpunk",
        "droneAudioTrack": "audio/sfx/drone.wav",
        "droneVolume": 0.25,
        "enableSeamlessLoop": True,
        "loopRewatchPrompt": "▲ REWATCH: AUDIT THE TELEMETRY",
        "scenes": [
            {
                "type": "dossier",
                "id": "scene_01_hook",
                "durationInFrames": 150,
                "headerPill": "CLASSIFIED ARCHIVE #042",
                "title": "INCIDENT AT 02:17 AM",
                "subtitle": "AUTONOMOUS SYSTEM BREACH",
                "mediaSrc": "assets/backgrounds/evidence_exterior.jpg",
                "targetBox": {
                    "x": 460,
                    "y": 680,
                    "w": 300,
                    "h": 300,
                    "label": "ROGUE PROTOTYPE"
                },
                "laserVector": {
                    "fromX": 540,
                    "fromY": 360,
                    "toX": 600,
                    "toY": 680,
                    "label": "MATCH: 99.8%"
                },
                "stampText": "CORROBORATED"
            },
            {
                "type": "3d_showcase",
                "id": "scene_02_telemetry",
                "durationInFrames": 240,
                "modelSrc": "assets/models/PROTOTYPE_VEHICLE.glb",
                "modelType": "muscle_car",
                "cameraMode": "drift",
                "lightingPreset": "cyberpunk",
                "hudOverlay": {
                    "title": "PHYSICS SIMULATION",
                    "metricLabel": "RPM",
                    "metricValue": "8,600",
                    "metrics": [
                        { "label": "VELOCITY", "value": "158 KM/H" },
                        { "label": "G-FORCE", "value": "1.42 G" },
                        { "label": "CHASSIS", "value": "CARBON V12" }
                    ]
                }
            },
            {
                "type": "dialogue",
                "id": "scene_03_argument",
                "durationInFrames": 210,
                "backgroundSrc": "assets/backgrounds/confrontation_room.jpg",
                "activeSpeakerId": "arjun",
                "speechBubbleText": "The telemetry proves the prototype was driven autonomously.",
                "cameraPush": {
                    "fromScale": 1.0,
                    "toScale": 1.12,
                    "focusX": 540,
                    "focusY": 1050
                },
                "characters": [
                    {
                        "id": "arjun",
                        "name": "Arjun",
                        "position": { "x": 300, "y": 1050 },
                        "facing": "right",
                        "expression": "shocked",
                        "showFace": True,
                        "scale": 1.0
                    },
                    {
                        "id": "rahul",
                        "name": "Rahul",
                        "position": { "x": 780, "y": 1050 },
                        "facing": "left",
                        "expression": "angry",
                        "showFace": True,
                        "scale": 1.0
                    }
                ]
            }
        ],
        "sfxCues": [
            { "frame": 0, "sound": "whoosh", "volume": 0.8 },
            { "frame": 140, "sound": "glitch_hit", "volume": 0.7 },
            { "frame": 380, "sound": "shutter", "volume": 0.9 },
            { "frame": 588, "sound": "camera_shutter", "volume": 1.0 }
        ]
    }
    with open(os.path.join(pkg1_dir, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    # audio_schedule.json
    audio_schedule = {
        "totalDurationSec": 20.0,
        "fps": 30,
        "lines": [
            {
                "startSec": 0.2,
                "text": "At 2:17 AM, an autonomous prototype breached the testing grid.",
                "voice": "en-US-BrianMultilingualNeural",
                "rate": "+5%",
                "pitch": "-2Hz",
                "yellowWords": ["AUTONOMOUS", "PROTOTYPE"],
                "redWords": ["BREACHED"]
            },
            {
                "startSec": 5.2,
                "text": "Every drift curve and physics vector was computed in real time.",
                "voice": "en-US-BrianMultilingualNeural",
                "rate": "+6%",
                "pitch": "-2Hz",
                "yellowWords": ["PHYSICS", "VECTOR"],
                "redWords": ["REAL", "TIME."]
            },
            {
                "startSec": 13.0,
                "text": "Then Arjun uncovered the secret behind the missing telemetry log.",
                "voice": "en-US-BrianMultilingualNeural",
                "rate": "+4%",
                "pitch": "-2Hz",
                "yellowWords": ["ARJUN", "SECRET"],
                "redWords": ["MISSING"]
            }
        ]
    }
    with open(os.path.join(pkg1_dir, "audio_schedule.json"), "w", encoding="utf-8") as f:
        json.dump(audio_schedule, f, indent=2)

    # asset-manifest.json
    asset_manifest = {
        "episodeId": "claude_demo_01",
        "assets": [
            {
                "id": "bg_evidence",
                "type": "image",
                "required": True,
                "expectedFilename": "evidence_exterior.jpg",
                "packagePath": "assets/backgrounds/evidence_exterior.jpg",
                "description": "Evidence exterior plate showing testing facility gate"
            },
            {
                "id": "model_prototype",
                "type": "model",
                "required": True,
                "expectedFilename": "PROTOTYPE_VEHICLE.glb",
                "packagePath": "assets/models/PROTOTYPE_VEHICLE.glb",
                "description": "Autonomous prototype muscle car GLB"
            },
            {
                "id": "bg_confrontation",
                "type": "image",
                "required": True,
                "expectedFilename": "confrontation_room.jpg",
                "packagePath": "assets/backgrounds/confrontation_room.jpg",
                "description": "Interior room for character argument"
            }
        ]
    }
    with open(os.path.join(pkg1_dir, "asset-manifest.json"), "w", encoding="utf-8") as f:
        json.dump(asset_manifest, f, indent=2)

    # ASSET_ACQUISITION_GUIDE.md
    guide = """# ASSET ACQUISITION GUIDE: THE AUTONOMOUS ANOMALY
All mandatory assets for this episode have been bundled inside the assets/ directory.
- Backgrounds: 1080x1920 JPG files
- 3D Model: PROTOTYPE_VEHICLE.glb (355 KB)
"""
    with open(os.path.join(pkg1_dir, "ASSET_ACQUISITION_GUIDE.md"), "w", encoding="utf-8") as f:
        f.write(guide)

    # Zip it
    zip1_path = "packages/claude_demo_showcase.zip"
    with zipfile.ZipFile(zip1_path, "w", zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(pkg1_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, pkg1_dir)
                z.write(full_path, rel_path)
    print(f"[OK] Created valid demonstration package: {zip1_path}")

    # =========================================================================
    # 2. MISSING ASSET TEST PACKAGE: test_missing_asset.zip
    # =========================================================================
    pkg2_dir = os.path.join(tmp_build, "test_missing_asset")
    os.makedirs(os.path.join(pkg2_dir, "assets", "backgrounds"), exist_ok=True)
    shutil.copy2("public/backgrounds/exterior.jpg", os.path.join(pkg2_dir, "assets", "backgrounds", "exterior.jpg"))

    manifest_missing = {
        "episodeId": "test_missing_ep",
        "title": "THE PHANTOM TANK",
        "fps": 30,
        "width": 1080,
        "height": 1920,
        "durationInFrames": 300,
        "scenes": [
            {
                "type": "showcase3d",
                "id": "scene_tank",
                "durationInFrames": 300,
                "modelSrc": "assets/models/CYBER_TANK_HEAVY.glb",
                "cameraMode": "turntable"
            }
        ]
    }
    with open(os.path.join(pkg2_dir, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest_missing, f, indent=2)

    asset_manifest_missing = {
        "episodeId": "test_missing_ep",
        "assets": [
            {
                "id": "model_cyber_tank",
                "type": "model",
                "required": True,
                "expectedFilename": "CYBER_TANK_HEAVY.glb",
                "packagePath": "assets/models/CYBER_TANK_HEAVY.glb",
                "destinationFolder": "public/packages/test_missing_ep/assets/models",
                "description": "Futuristic heavy combat tank with articulated treads",
                "sourceUrl": "https://sketchfab.com/3d-models/cyber-tank-free",
                "technicalReqs": "GLB format, under 20MB, <150k polygons"
            }
        ]
    }
    with open(os.path.join(pkg2_dir, "asset-manifest.json"), "w", encoding="utf-8") as f:
        json.dump(asset_manifest_missing, f, indent=2)

    guide_missing = """# ASSET ACQUISITION GUIDE: THE PHANTOM TANK
Please download CYBER_TANK_HEAVY.glb from Sketchfab and place it in assets/models/.
"""
    with open(os.path.join(pkg2_dir, "ASSET_ACQUISITION_GUIDE.md"), "w", encoding="utf-8") as f:
        f.write(guide_missing)

    zip2_path = "packages/test_missing_asset.zip"
    with zipfile.ZipFile(zip2_path, "w", zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(pkg2_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, pkg2_dir)
                z.write(full_path, rel_path)
    print(f"[OK] Created missing asset test package: {zip2_path}")

    # =========================================================================
    # 3. INVALID MANIFEST TEST PACKAGE: test_invalid_manifest.zip
    # =========================================================================
    pkg3_dir = os.path.join(tmp_build, "test_invalid_manifest")
    os.makedirs(pkg3_dir, exist_ok=True)
    manifest_invalid = {
        "title": "CORRUPTED EPISODE",
        "scenes": [
            { "type": "alien_teleportation_matrix", "durationInFrames": -100 }
        ]
    }
    with open(os.path.join(pkg3_dir, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest_invalid, f, indent=2)

    zip3_path = "packages/test_invalid_manifest.zip"
    with zipfile.ZipFile(zip3_path, "w", zipfile.ZIP_DEFLATED) as z:
        for file in os.listdir(pkg3_dir):
            full_path = os.path.join(pkg3_dir, file)
            z.write(full_path, file)
    print(f"[OK] Created invalid manifest test package: {zip3_path}")

    # Cleanup temp build directory
    shutil.rmtree(tmp_build, ignore_errors=True)
    print("[ALL DONE] Test packages ready in packages/")

if __name__ == "__main__":
    build_packages()

