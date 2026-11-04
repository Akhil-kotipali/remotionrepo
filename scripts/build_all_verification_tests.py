#!/usr/bin/env python3
"""
Comprehensive Test Package Builder for Final Pipeline Verification.
Generates all positive, negative, audio-supplied, and 60s long-form test packages.
"""

import json
import os
import shutil
import zipfile

def create_all_test_packages():
    os.makedirs("packages", exist_ok=True)
    tmp_base = "tmp_pkg_generator"
    if os.path.exists(tmp_base):
        shutil.rmtree(tmp_base)
    os.makedirs(tmp_base)

    print("Building comprehensive test suite packages...")

    # -------------------------------------------------------------------------
    # Test 1: Unsupported Scene Type
    # -------------------------------------------------------------------------
    p1 = os.path.join(tmp_base, "unsupported_scene")
    os.makedirs(p1, exist_ok=True)
    m1 = {
        "episodeId": "test_unsupported_scene",
        "title": "WARP TEST",
        "fps": 30,
        "width": 1080,
        "height": 1920,
        "scenes": [
            { "type": "interstellar_wormhole_warp", "durationInFrames": 120 }
        ]
    }
    with open(os.path.join(p1, "manifest.json"), "w") as f:
        json.dump(m1, f)
    with zipfile.ZipFile("packages/test_unsupported_scene.zip", "w") as z:
        z.write(os.path.join(p1, "manifest.json"), "manifest.json")

    # -------------------------------------------------------------------------
    # Test 2: Duplicate Asset ID
    # -------------------------------------------------------------------------
    p2 = os.path.join(tmp_base, "duplicate_asset_id")
    os.makedirs(p2, exist_ok=True)
    m2 = {
        "episodeId": "test_duplicate_asset_id",
        "title": "DUPLICATE ID TEST",
        "fps": 30,
        "width": 1080,
        "height": 1920,
        "scenes": [
            { "type": "dossier", "durationInFrames": 90, "mediaSrc": "assets/backgrounds/exterior.jpg" }
        ]
    }
    am2 = {
        "episodeId": "test_duplicate_asset_id",
        "assets": [
            { "id": "asset_hero_plate", "type": "image", "packagePath": "assets/backgrounds/exterior.jpg" },
            { "id": "asset_hero_plate", "type": "image", "packagePath": "assets/backgrounds/living_room.jpg" }
        ]
    }
    with open(os.path.join(p2, "manifest.json"), "w") as f:
        json.dump(m2, f)
    with open(os.path.join(p2, "asset-manifest.json"), "w") as f:
        json.dump(am2, f)
    with zipfile.ZipFile("packages/test_duplicate_asset_id.zip", "w") as z:
        z.write(os.path.join(p2, "manifest.json"), "manifest.json")
        z.write(os.path.join(p2, "asset-manifest.json"), "asset-manifest.json")

    # -------------------------------------------------------------------------
    # Test 3: Malformed Corrupted ZIP
    # -------------------------------------------------------------------------
    with open("packages/test_malformed_zip.zip", "wb") as f:
        f.write(b"CORRUPTED_BINARY_HEADER_NOT_A_VALID_ZIP_ARCHIVE_DATA")

    # -------------------------------------------------------------------------
    # Test 4: ZIP Path Traversal Attempt (Zip Slip)
    # -------------------------------------------------------------------------
    zip_slip_path = "packages/test_path_traversal.zip"
    with zipfile.ZipFile(zip_slip_path, "w") as z:
        # Create an entry with path traversal sequence
        z.writestr("../../traversal_attack.txt", "MALICIOUS PAYLOAD OUTSIDE WORKSPACE")
        z.writestr("manifest.json", json.dumps({"episodeId": "slip_attack"}))

    # -------------------------------------------------------------------------
    # Test 5: Missing Audio File
    # -------------------------------------------------------------------------
    p5 = os.path.join(tmp_base, "missing_audio")
    os.makedirs(p5, exist_ok=True)
    m5 = {
        "episodeId": "test_missing_audio",
        "title": "SILENT GHOST",
        "fps": 30,
        "width": 1080,
        "height": 1920,
        "audioTrack": "assets/audio/unobtainium_voiceover.wav",
        "scenes": [
            { "type": "dossier", "durationInFrames": 90, "mediaSrc": "backgrounds/exterior.jpg" }
        ]
    }
    with open(os.path.join(p5, "manifest.json"), "w") as f:
        json.dump(m5, f)
    with zipfile.ZipFile("packages/test_missing_audio.zip", "w") as z:
        z.write(os.path.join(p5, "manifest.json"), "manifest.json")

    # -------------------------------------------------------------------------
    # Test 6: Invalid Timeline Duration
    # -------------------------------------------------------------------------
    p6 = os.path.join(tmp_base, "invalid_timeline")
    os.makedirs(p6, exist_ok=True)
    m6 = {
        "episodeId": "test_invalid_timeline",
        "title": "NEGATIVE TIME",
        "fps": 30,
        "width": 1080,
        "height": 1920,
        "durationInFrames": -300,
        "scenes": [
            { "type": "dossier", "durationInFrames": -300 }
        ]
    }
    with open(os.path.join(p6, "manifest.json"), "w") as f:
        json.dump(m6, f)
    with zipfile.ZipFile("packages/test_invalid_timeline.zip", "w") as z:
        z.write(os.path.join(p6, "manifest.json"), "manifest.json")

    # -------------------------------------------------------------------------
    # Test 7: Pre-rendered Supplied Audio Workflow (Workflow A)
    # -------------------------------------------------------------------------
    p7 = os.path.join(tmp_base, "supplied_audio")
    os.makedirs(os.path.join(p7, "assets", "audio"), exist_ok=True)
    os.makedirs(os.path.join(p7, "assets", "backgrounds"), exist_ok=True)
    shutil.copy2("public/backgrounds/living_room.jpg", os.path.join(p7, "assets", "backgrounds", "living_room.jpg"))
    # Use existing clean wav file as pre-rendered supplied audio
    shutil.copy2("public/audio/voiceover_part3_viral.wav", os.path.join(p7, "assets", "audio", "supplied_narration.wav"))

    m7 = {
        "episodeId": "test_supplied_audio_ep",
        "title": "PRE-RENDERED AUDIO WORKFLOW",
        "fps": 30,
        "width": 1080,
        "height": 1920,
        "audioTrack": "assets/audio/supplied_narration.wav",
        "scenes": [
            {
                "type": "dialogue",
                "id": "scene_dialogue",
                "durationInFrames": 360,
                "backgroundSrc": "assets/backgrounds/living_room.jpg",
                "activeSpeakerId": "arjun",
                "speechBubbleText": "This narration was pre-rendered and supplied inside the package.",
                "characters": [
                    { "id": "arjun", "position": { "x": 540, "y": 1050 }, "expression": "determined", "scale": 1.0 }
                ]
            }
        ],
        "sentences": [
            { "startSec": 0.5, "endSec": 8.0, "text": "This audio was pre-rendered by Claude.", "yellowWords": ["PRE-RENDERED"] }
        ]
    }
    with open(os.path.join(p7, "manifest.json"), "w") as f:
        json.dump(m7, f, indent=2)
    with zipfile.ZipFile("packages/test_supplied_audio.zip", "w") as z:
        for root, _, files in os.walk(p7):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, p7)
                z.write(full_path, rel_path)

    # -------------------------------------------------------------------------
    # Test 8: Long-Form 60-Second Episode Test (1,800 frames)
    # -------------------------------------------------------------------------
    p8 = os.path.join(tmp_base, "longform_60s")
    os.makedirs(os.path.join(p8, "assets", "backgrounds"), exist_ok=True)
    os.makedirs(os.path.join(p8, "assets", "models"), exist_ok=True)
    shutil.copy2("public/backgrounds/exterior.jpg", os.path.join(p8, "assets", "backgrounds", "exterior.jpg"))
    shutil.copy2("public/backgrounds/living_room.jpg", os.path.join(p8, "assets", "backgrounds", "living_room.jpg"))
    shutil.copy2("public/models/MUSCLE_CAR.glb", os.path.join(p8, "assets", "models", "CAR.glb"))

    m8 = {
        "episodeId": "test_longform_60s",
        "title": "SIXTY SECOND LONG-FORM TEST",
        "fps": 30,
        "width": 1080,
        "height": 1920,
        "durationInFrames": 1800,  # Exactly 60.0s (1,800 frames)
        "theme": "cyberpunk",
        "droneAudioTrack": "audio/sfx/drone.wav",
        "scenes": [
            {
                "type": "dossier",
                "id": "act_01_hook",
                "durationInFrames": 450,
                "headerPill": "ACT I • THE EVIDENCE",
                "title": "DEEP SURVEILLANCE",
                "mediaSrc": "assets/backgrounds/exterior.jpg"
            },
            {
                "type": "3d_showcase",
                "id": "act_02_simulation",
                "durationInFrames": 750,
                "modelSrc": "assets/models/CAR.glb",
                "cameraMode": "drift",
                "lightingPreset": "cyberpunk",
                "hudOverlay": {
                    "title": "LONG-FORM TELEMETRY",
                    "metricLabel": "STABILITY",
                    "metricValue": "OPTIMAL"
                }
            },
            {
                "type": "dialogue",
                "id": "act_03_resolution",
                "durationInFrames": 600,
                "backgroundSrc": "assets/backgrounds/living_room.jpg",
                "activeSpeakerId": "arjun",
                "speechBubbleText": "Sixty seconds rendered deterministically across three scenes.",
                "characters": [
                    { "id": "arjun", "position": { "x": 360, "y": 1050 }, "expression": "cool" },
                    { "id": "rahul", "position": { "x": 720, "y": 1050 }, "expression": "smug" }
                ]
            }
        ]
    }
    with open(os.path.join(p8, "manifest.json"), "w") as f:
        json.dump(m8, f, indent=2)

    # 60s audio schedule
    s8 = {
        "totalDurationSec": 60.0,
        "fps": 30,
        "lines": [
            {
                "startSec": 0.5,
                "text": "Welcome to the sixty second long form rendering stability benchmark.",
                "voice": "en-US-BrianMultilingualNeural",
                "yellowWords": ["SIXTY", "BENCHMARK"]
            },
            {
                "startSec": 15.0,
                "text": "The 3D physics engine maintains deterministic sixty frames per second.",
                "voice": "en-US-BrianMultilingualNeural",
                "yellowWords": ["DETERMINISTIC"]
            },
            {
                "startSec": 40.0,
                "text": "This confirms memory stability and timing accuracy across sixty seconds.",
                "voice": "en-US-BrianMultilingualNeural",
                "yellowWords": ["ACCURACY"]
            }
        ]
    }
    with open(os.path.join(p8, "audio_schedule.json"), "w") as f:
        json.dump(s8, f, indent=2)

    with zipfile.ZipFile("packages/test_longform_60s.zip", "w") as z:
        for root, _, files in os.walk(p8):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, p8)
                z.write(full_path, rel_path)

    # Cleanup temp directory
    shutil.rmtree(tmp_base, ignore_errors=True)
    print("All verification test packages generated successfully in packages/!")

if __name__ == "__main__":
    create_all_test_packages()

