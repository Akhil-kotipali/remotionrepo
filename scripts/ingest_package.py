#!/usr/bin/env python3
"""
Production Package Ingestion & Asset Resolver for Remotion Engine.
Safely extracts Claude-generated ZIP packages, validates manifests,
resolves assets, identifies missing files with acquisition instructions,
and compiles dynamic episode props for Remotion rendering.
"""

import argparse
import json
import os
import re
import shutil
import sys
import zipfile
from datetime import datetime

# Import audio adapter
try:
    from scripts.audio_adapter import process_audio_schedule, measure_audio_file
except ImportError:
    # Allow running directly from root or scripts/
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from scripts.audio_adapter import process_audio_schedule, measure_audio_file

PUBLIC_DIR = "public"
PACKAGES_DIR = os.path.join(PUBLIC_DIR, "packages")
ACTIVE_DIR = os.path.join(PACKAGES_DIR, "active")
MAX_UNCOMPRESSED_BYTES = 500 * 1024 * 1024  # 500 MB max safety cap

class SecurityError(Exception):
    """Raised when an unsafe path traversal or security violation is detected."""
    pass

SUPPORTED_SCENE_TYPES = {"dossier", "showcase3d", "3d_showcase", "dialogue", "infographic", "mirror_horror"}

def sanitize_id(raw_id):
    """Sanitizes an episode ID to safe filename characters."""
    return re.sub(r"[^a-zA-Z0-9_\-]", "_", raw_id)

def safe_extract_zip(zip_path, target_dir):
    """
    Safely extracts a ZIP archive, defending against Zip Slip path traversal
    and zip bomb denial-of-service vulnerabilities.
    """
    abs_target = os.path.abspath(target_dir)
    os.makedirs(abs_target, exist_ok=True)

    with zipfile.ZipFile(zip_path, "r") as z:
        total_size = sum(info.file_size for info in z.infolist())
        if total_size > MAX_UNCOMPRESSED_BYTES:
            raise ValueError(
                f"Archive uncompressed size ({round(total_size / (1024*1024), 1)} MB) exceeds safety cap (500 MB)"
            )

        for member in z.infolist():
            # Defense against Zip Slip
            dest_path = os.path.abspath(os.path.join(abs_target, member.filename))
            if not dest_path.startswith(abs_target + os.sep) and dest_path != abs_target:
                raise SecurityError(f"Zip traversal attack detected: {member.filename}")

        z.extractall(abs_target)

    return abs_target

def validate_manifest(manifest):
    """Validates structural integrity, scene types, and timeline totals."""
    errors = []
    warnings = []

    if not isinstance(manifest, dict):
        return False, ["Manifest root must be a JSON object"], []

    episode_id = manifest.get("episodeId")
    if not episode_id:
        errors.append("Manifest missing required 'episodeId'")
    elif not re.match(r"^[a-zA-Z0-9_\-]+$", str(episode_id)):
        warnings.append(f"Episode ID '{episode_id}' contains unconventional characters; will be sanitized")

    fps = manifest.get("fps", 30)
    width = manifest.get("width", 1080)
    height = manifest.get("height", 1920)

    if width % 2 != 0 or height % 2 != 0:
        errors.append(f"Video dimensions ({width}x{height}) must be even numbers for H.264 encoding")

    # Timeline duration validation
    dur = manifest.get("durationInFrames", manifest.get("totalDurationInFrames"))
    if dur is not None and (not isinstance(dur, (int, float)) or dur <= 0):
        errors.append(f"Invalid timeline duration: {dur}. Duration must be a positive integer.")

    scenes = manifest.get("scenes", [])
    if not isinstance(scenes, list) or len(scenes) == 0:
        errors.append("Manifest must contain at least one scene in 'scenes' array")
    else:
        total_scene_frames = 0
        for i, sc in enumerate(scenes):
            sc_id = sc.get("id", f"scene_{i}")
            sc_type = sc.get("type")
            dur = sc.get("durationInFrames", sc.get("durationFrames"))

            if not sc_type:
                errors.append(f"Scene {i} ('{sc_id}') missing required 'type'")
            elif sc_type not in SUPPORTED_SCENE_TYPES:
                errors.append(
                    f"Scene '{sc_id}' uses unsupported type '{sc_type}'. Supported: {sorted(list(SUPPORTED_SCENE_TYPES))}"
                )

            if dur is None or not isinstance(dur, (int, float)) or dur <= 0:
                errors.append(f"Scene '{sc_id}' has invalid duration: {dur}")
            else:
                total_scene_frames += int(dur)

        declared_total = manifest.get("durationInFrames", manifest.get("totalDurationInFrames"))
        if declared_total and declared_total != total_scene_frames:
            warnings.append(
                f"Declared durationInFrames ({declared_total}) does not match sum of scenes ({total_scene_frames}). Using sum of scenes."
            )

    is_valid = len(errors) == 0
    return is_valid, errors, warnings

def resolve_assets(package_dir, manifest, asset_manifest=None):
    """
    Resolves assets declared in the manifest and asset-manifest.
    Matches against package files and existing library files in public/.
    Returns (resolved_map, missing_list).
    """
    resolved = {}
    missing = []

    # Map of standard existing library assets
    existing_library = {
        "MUSCLE_CAR.glb": "models/MUSCLE_CAR.glb",
        "exterior.jpg": "backgrounds/exterior.jpg",
        "living_room.jpg": "backgrounds/living_room.jpg",
        "hallway.jpg": "backgrounds/hallway.jpg",
        "bedroom.jpg": "backgrounds/bedroom.jpg",
        "staircase.jpg": "backgrounds/staircase.jpg",
        "drone.wav": "audio/sfx/drone.wav",
        "camera_shutter.wav": "audio/sfx/camera_shutter.wav",
        "whoosh.wav": "audio/sfx/whoosh.wav",
        "glitch_hit.wav": "audio/sfx/glitch_hit.wav",
        "reverse_swell.wav": "audio/sfx/reverse_swell.wav",
        "impact_boom.wav": "audio/sfx/impact_boom.wav",
        "heartbeat.wav": "audio/sfx/heartbeat.wav",
    }

    # Extract all asset requests from scenes and manifest
    declared_assets = []
    if asset_manifest and "assets" in asset_manifest:
        declared_assets = asset_manifest["assets"]
    else:
        # Auto-derive assets from manifest scenes
        episode_id = manifest.get("episodeId", "ep")
        for sc in manifest.get("scenes", []):
            sc_id = sc.get("id", "scene")
            if sc.get("type") == "dossier":
                src = sc.get("mediaSrc") or sc.get("mediaPath")
                if src:
                    declared_assets.append({
                        "id": f"bg_{sc_id}",
                        "type": "image",
                        "required": True,
                        "packagePath": src,
                        "expectedFilename": os.path.basename(src),
                        "affectedScene": sc_id,
                        "description": f"Dossier plate image for {sc_id}",
                    })
            elif sc.get("type") in ("showcase3d", "3d_showcase"):
                src = sc.get("modelSrc") or sc.get("modelPath")
                if src:
                    declared_assets.append({
                        "id": f"model_{sc_id}",
                        "type": "model",
                        "required": True,
                        "packagePath": src,
                        "expectedFilename": os.path.basename(src),
                        "affectedScene": sc_id,
                        "description": f"3D GLB model for {sc_id}",
                    })
            elif sc.get("type") in ("dialogue", "mirror_horror"):
                src = sc.get("backgroundSrc") or sc.get("backgroundPlate")
                if src:
                    declared_assets.append({
                        "id": f"bg_{sc_id}",
                        "type": "image",
                        "required": True,
                        "packagePath": src,
                        "expectedFilename": os.path.basename(src),
                        "affectedScene": sc_id,
                        "description": f"{sc.get('type').replace('_', ' ').title()} background plate for {sc_id}",
                    })

        for cue in manifest.get("sfxCues", []):
            snd = cue.get("sound", "")
            if snd:
                fname = os.path.basename(snd)
                if not fname.endswith(".wav") and not fname.endswith(".mp3"):
                    fname = f"{fname}.wav"
                declared_assets.append({
                    "id": f"sfx_{os.path.splitext(fname)[0]}",
                    "type": "sfx",
                    "required": False,
                    "packagePath": snd if ("/" in snd or "." in snd) else f"assets/sfx/{fname}",
                    "expectedFilename": fname,
                    "affectedScene": "sfx_cue",
                    "description": f"Spatial sound effect: {snd}",
                })

    # Check for duplicate asset IDs
    seen_ids = set()
    for asset in declared_assets:
        aid = asset.get("id")
        if aid:
            if aid in seen_ids:
                missing.append({
                    "id": aid,
                    "type": "manifest_error",
                    "affectedScene": "asset-manifest.json",
                    "expectedFilename": "N/A",
                    "destinationFolder": "asset-manifest.json",
                    "description": f"Duplicate asset ID '{aid}' detected in asset declarations.",
                    "sourceUrl": "N/A",
                    "technicalReqs": "Every asset ID must be unique across the episode",
                })
            seen_ids.add(aid)

    # Check for missing audio track if no TTS schedule is provided
    vo_declared = manifest.get("audioTrack") or manifest.get("voiceoverAudioPath")
    has_schedule = os.path.exists(os.path.join(package_dir, "audio_schedule.json"))
    if vo_declared and not has_schedule:
        local_vo = os.path.join(package_dir, vo_declared)
        local_vo_flat = os.path.join(package_dir, "assets", "audio", os.path.basename(vo_declared))
        lib_vo = os.path.join(PUBLIC_DIR, vo_declared)
        found_vo = None
        if os.path.exists(local_vo) and os.path.isfile(local_vo):
            found_vo = local_vo
        elif os.path.exists(local_vo_flat) and os.path.isfile(local_vo_flat):
            found_vo = local_vo_flat
        elif os.path.exists(lib_vo) and os.path.isfile(lib_vo):
            found_vo = lib_vo

        if found_vo:
            rel = os.path.relpath(found_vo, PUBLIC_DIR).replace("\\", "/")
            resolved[vo_declared] = rel
            resolved[os.path.basename(vo_declared)] = rel
        else:
            missing.append({
                "id": "audio_voiceover_master",
                "type": "audio",
                "affectedScene": "global",
                "expectedFilename": os.path.basename(vo_declared),
                "packagePath": vo_declared,
                "destinationFolder": os.path.join(package_dir, "assets", "audio"),
                "description": f"Declared audio track '{vo_declared}' not found in package and no audio_schedule.json was provided for TTS.",
                "sourceUrl": "N/A",
                "technicalReqs": "PCM WAV or MP3 audio format",
            })

    # Resolve each asset
    for asset in declared_assets:
        aid = asset.get("id")
        pkg_path = asset.get("packagePath", "")
        exp_file = asset.get("expectedFilename") or os.path.basename(pkg_path)
        is_required = asset.get("required", True)

        # Assets implemented natively in Remotion / React code do not require external files
        if asset.get("status") == "implemented_in_code" or asset.get("type") in ("procedural_rig", "code"):
            resolved[aid] = "implemented_in_code"
            continue

        # 1. Check inside package directory
        local_pkg_path = os.path.join(package_dir, pkg_path)
        local_pkg_flat = os.path.join(package_dir, "assets", exp_file)
        local_pkg_type = os.path.join(package_dir, "assets", f"{asset.get('type', '')}s", exp_file)

        found_path = None
        if os.path.exists(local_pkg_path) and os.path.isfile(local_pkg_path):
            found_path = local_pkg_path
        elif os.path.exists(local_pkg_flat) and os.path.isfile(local_pkg_flat):
            found_path = local_pkg_flat
        elif os.path.exists(local_pkg_type) and os.path.isfile(local_pkg_type):
            found_path = local_pkg_type

        # 2. Check existing public library as fallback
        if not found_path and exp_file in existing_library:
            lib_subpath = existing_library[exp_file]
            lib_full = os.path.join(PUBLIC_DIR, lib_subpath)
            if os.path.exists(lib_full):
                resolved[pkg_path] = lib_subpath
                resolved[exp_file] = lib_subpath
                continue

        if found_path:
            # Runtime path relative to Remotion's public/ folder
            rel_to_public = os.path.relpath(found_path, PUBLIC_DIR).replace("\\", "/")
            resolved[pkg_path] = rel_to_public
            resolved[exp_file] = rel_to_public
        else:
            if is_required:
                missing.append({
                    "id": aid,
                    "type": asset.get("type", "unknown"),
                    "affectedScene": asset.get("affectedScene", "global"),
                    "expectedFilename": exp_file,
                    "packagePath": pkg_path,
                    "destinationFolder": os.path.join(package_dir, "assets", f"{asset.get('type', '')}s"),
                    "description": asset.get("description", "Mandatory production asset"),
                    "sourceUrl": asset.get("sourceUrl", "N/A"),
                    "technicalReqs": asset.get("technicalReqs", asset.get("resolution", asset.get("maxPolygons", "Standard"))),
                })

    return resolved, missing

def print_missing_assets_report(missing_assets, guide_text=None):
    """Outputs a clear, actionable guide for missing assets."""
    print("\n" + "!" * 65)
    print("  [ALERT] MANDATORY ASSETS MISSING — MANUAL ACQUISITION REQUIRED")
    print("!" * 65)
    print(f"\nFound {len(missing_assets)} missing asset(s) that must be provided:\n")

    for i, m in enumerate(missing_assets, 1):
        print(f"[{i}] ASSET ID: {m['id']} (Type: {m['type'].upper()})")
        print(f"    • Description:        {m['description']}")
        print(f"    • Affected Scene:     {m['affectedScene']}")
        print(f"    • Expected Filename:  {m['expectedFilename']}")
        print(f"    • Destination Folder: {m['destinationFolder']}")
        if m.get("sourceUrl") and m["sourceUrl"] != "N/A":
            print(f"    • Download Source:    {m['sourceUrl']}")
        if m.get("technicalReqs") and m["technicalReqs"] != "Standard":
            print(f"    • Technical Spec:     {m['technicalReqs']}")
        print()

    if guide_text:
        print("-" * 65)
        print("  EXCERPT FROM ASSET_ACQUISITION_GUIDE.md:")
        print("-" * 65)
        print(guide_text.strip()[:1000] + ("\n..." if len(guide_text) > 1000 else ""))
        print("-" * 65)

    print("\n>> WHAT TO DO NEXT:")
    print("1. Download the required file(s) listed above.")
    print("2. Place them into the specified Destination Folder.")
    print("3. Re-run: python studio.py assets <episodeId> to verify, or re-run the package command.")
    print()

def assemble_episode_props(package_dir, manifest, resolved_assets, audio_result=None):
    """
    Compiles the final JSON props contract matching EpisodeConfig
    for consumption by Remotion's PackageEpisode composition.
    """
    episode_id = sanitize_id(manifest.get("episodeId", "claude_ep"))
    title = manifest.get("title", "UNTITLED EPISODE")
    fps = manifest.get("fps", 30)
    width = manifest.get("width", 1080)
    height = manifest.get("height", 1920)
    theme = manifest.get("theme", "cyberpunk")

    # Build normalized scene list with resolved media paths
    scenes = []
    cumulative_frame = 0

    for i, sc in enumerate(manifest.get("scenes", [])):
        sc_copy = dict(sc)
        dur = int(sc.get("durationInFrames", sc.get("durationFrames", 90)))
        from_frame = sc.get("fromFrame") if sc.get("fromFrame") is not None else cumulative_frame
        cumulative_frame = from_frame + dur

        sc_copy["fromFrame"] = from_frame
        sc_copy["durationFrames"] = dur
        sc_copy["durationInFrames"] = dur

        # Remap asset paths
        sc_type = sc_copy.get("type")
        if sc_type == "dossier":
            m_path = sc_copy.get("mediaSrc") or sc_copy.get("mediaPath", "")
            base = os.path.basename(m_path)
            sc_copy["mediaPath"] = resolved_assets.get(m_path, resolved_assets.get(base, m_path))
            sc_copy["mediaSrc"] = sc_copy["mediaPath"]
        elif sc_type in ("showcase3d", "3d_showcase"):
            m_path = sc_copy.get("modelSrc") or sc_copy.get("modelPath", "")
            base = os.path.basename(m_path)
            sc_copy["modelPath"] = resolved_assets.get(m_path, resolved_assets.get(base, m_path))
            sc_copy["modelSrc"] = sc_copy["modelPath"]
        elif sc_type in ("dialogue", "mirror_horror"):
            bg_path = sc_copy.get("backgroundSrc") or sc_copy.get("backgroundPlate", "")
            base = os.path.basename(bg_path)
            sc_copy["backgroundPlate"] = resolved_assets.get(bg_path, resolved_assets.get(base, bg_path))
            sc_copy["backgroundSrc"] = sc_copy["backgroundPlate"]

        scenes.append(sc_copy)

    total_frames = cumulative_frame

    # Audio track resolution
    voiceover_path = ""
    sentences = []

    if audio_result:
        voiceover_path = os.path.relpath(audio_result["audioPath"], PUBLIC_DIR).replace("\\", "/")
        sentences = audio_result.get("sentences", [])
    else:
        raw_vo = manifest.get("audioTrack") or manifest.get("voiceoverAudioPath", "")
        if raw_vo:
            base = os.path.basename(raw_vo)
            voiceover_path = resolved_assets.get(raw_vo, resolved_assets.get(base, raw_vo))

    # SFX Cues with safe path resolution and core fallback
    sfx_cues = []
    for cue in manifest.get("sfxCues", []):
        cue_copy = dict(cue)
        raw_sound = cue_copy.get("sound", "")
        fname = os.path.basename(raw_sound)
        if not fname.endswith(".wav") and not fname.endswith(".mp3"):
            fname = f"{fname}.wav"

        resolved_sound = resolved_assets.get(raw_sound, resolved_assets.get(fname, resolved_assets.get(f"assets/sfx/{fname}")))
        if not resolved_sound:
            if os.path.exists(os.path.join(PUBLIC_DIR, "audio", "sfx", fname)):
                resolved_sound = f"audio/sfx/{fname}"
            else:
                resolved_sound = "audio/sfx/camera_shutter.wav" if "shutter" in fname else "audio/sfx/whoosh.wav"

        cue_copy["sound"] = resolved_sound
        sfx_cues.append(cue_copy)

    # Drone Audio Track Resolution
    raw_drone = manifest.get("droneAudioTrack") or manifest.get("droneAudioPath", "audio/sfx/drone.wav")
    base_drone = os.path.basename(raw_drone)
    resolved_drone = resolved_assets.get(raw_drone, resolved_assets.get(base_drone, resolved_assets.get(f"assets/sfx/{base_drone}")))
    if not resolved_drone:
        if os.path.exists(os.path.join(PUBLIC_DIR, "audio", "sfx", base_drone)):
            resolved_drone = f"audio/sfx/{base_drone}"
        elif os.path.exists(os.path.join(package_dir, "assets", "sfx", base_drone)):
            resolved_drone = os.path.relpath(os.path.join(package_dir, "assets", "sfx", base_drone), PUBLIC_DIR).replace("\\", "/")
        else:
            resolved_drone = "audio/sfx/drone.wav"

    episode_config = {
        "id": episode_id,
        "title": title,
        "fps": fps,
        "width": width,
        "height": height,
        "durationInFrames": total_frames,
        "totalDurationInFrames": total_frames,
        "theme": theme,
        "voiceoverAudioPath": voiceover_path,
        "audioTrack": voiceover_path,
        "droneAudioPath": resolved_drone,
        "droneVolume": manifest.get("droneVolume", 0.25),
        "enableSeamlessLoop": manifest.get("enableSeamlessLoop", True),
        "loopRewatchPrompt": manifest.get("loopRewatchPrompt", "▲ REWATCH: CHECK THE DETAILS"),
        "sentences": sentences,
        "sfxCues": sfx_cues,
        "scenes": scenes,
    }

    return {"config": episode_config}

def ingest_package(zip_path, force=False, skip_audio=False):
    """
    Master ingestion workflow:
    ZIP -> Extract -> Validate -> Resolve Assets -> Audio -> Assemble Props -> Write Active Config
    """
    if not os.path.exists(zip_path):
        print(f"[X] ZIP file not found: {zip_path}")
        return False, None

    filename = os.path.splitext(os.path.basename(zip_path))[0]
    temp_extract = os.path.join(PACKAGES_DIR, f"tmp_{filename}")

    try:
        print(f">> Extracting package: {zip_path}...")
        try:
            safe_extract_zip(zip_path, temp_extract)
        except zipfile.BadZipFile as bz:
            print(f"[X] Malformed or corrupted ZIP archive: {bz}")
            return False, None
        except SecurityError as se:
            print(f"[X] Security violation: {se}")
            return False, None
        except ValueError as ve:
            print(f"[X] Archive validation failed: {ve}")
            return False, None

        # 1. Read manifest.json
        manifest_file = os.path.join(temp_extract, "manifest.json")
        if not os.path.exists(manifest_file):
            print(f"[X] Invalid package: missing mandatory 'manifest.json' in archive root.")
            return False, None

        with open(manifest_file, "r", encoding="utf-8") as f:
            manifest = json.load(f)

        # Validate manifest
        is_valid, errors, warnings = validate_manifest(manifest)
        if warnings:
            for w in warnings:
                print(f"  [WARN] {w}")
        if not is_valid:
            print(f"[X] Manifest validation failed with {len(errors)} error(s):")
            for e in errors:
                print(f"   - {e}")
            return False, None

        episode_id = sanitize_id(manifest.get("episodeId", filename))
        target_package_dir = os.path.join(PACKAGES_DIR, episode_id)

        # Check existing project
        if os.path.exists(target_package_dir) and not force:
            print(f"  [INFO] Project folder '{target_package_dir}' already exists. Updating contents.")
        os.makedirs(target_package_dir, exist_ok=True)

        # Move extracted files to target package directory
        for item in os.listdir(temp_extract):
            src_item = os.path.join(temp_extract, item)
            dst_item = os.path.join(target_package_dir, item)
            if os.path.isdir(src_item):
                if os.path.exists(dst_item):
                    shutil.copytree(src_item, dst_item, dirs_exist_ok=True)
                else:
                    shutil.move(src_item, dst_item)
            else:
                shutil.copy2(src_item, dst_item)

        # 2. Read optional asset-manifest and guide
        asset_manifest = None
        asset_man_file = os.path.join(target_package_dir, "asset-manifest.json")
        if os.path.exists(asset_man_file):
            with open(asset_man_file, "r", encoding="utf-8") as f:
                asset_manifest = json.load(f)

        guide_text = None
        guide_file = os.path.join(target_package_dir, "ASSET_ACQUISITION_GUIDE.md")
        if os.path.exists(guide_file):
            with open(guide_file, "r", encoding="utf-8") as f:
                guide_text = f.read()

        # 3. Resolve Assets
        print(">> Resolving assets...")
        resolved, missing = resolve_assets(target_package_dir, manifest, asset_manifest)

        if missing:
            print_missing_assets_report(missing, guide_text)
            print(f"[STOPPED] {len(missing)} mandatory asset(s) missing. Ingestion paused safely.")
            return False, {
                "episodeId": episode_id,
                "status": "ASSETS_MISSING",
                "missingAssets": missing,
                "packageDir": target_package_dir,
            }

        print(f"  [OK] All {len(resolved)} asset references resolved successfully.")

        # 4. Audio Processing
        audio_result = None
        schedule_file = os.path.join(target_package_dir, "audio_schedule.json")
        
        vo_declared = manifest.get("audioTrack") or manifest.get("voiceoverAudioPath")
        existing_audio = None
        if vo_declared:
            candidates = [
                os.path.join(target_package_dir, vo_declared),
                os.path.join(target_package_dir, "assets", "audio", os.path.basename(vo_declared)),
                os.path.join(target_package_dir, "assets", os.path.basename(vo_declared)),
            ]
            for c in candidates:
                if os.path.exists(c) and os.path.isfile(c):
                    existing_audio = c
                    break
        if not existing_audio:
            default_vo = os.path.join(target_package_dir, "assets", "audio", "voiceover.wav")
            if os.path.exists(default_vo):
                existing_audio = default_vo

        if existing_audio:
            print(f">> Pre-rendered voiceover audio detected: {existing_audio}")
            info = measure_audio_file(existing_audio)
            audio_result = {
                "audioPath": existing_audio,
                "durationSec": info["durationSec"],
                "sentences": manifest.get("sentences", []),
            }
        elif os.path.exists(schedule_file) and not skip_audio:
            print(f">> Synthesizing dialogue from audio_schedule.json...")
            with open(schedule_file, "r", encoding="utf-8") as f:
                schedule_data = json.load(f)
            master_wav = os.path.join(target_package_dir, "audio", "voiceover_master.wav")
            audio_result = process_audio_schedule(schedule_data, master_wav)

        # 5. Compile final Remotion Props
        print(">> Assembling episode composition configuration...")
        props = assemble_episode_props(target_package_dir, manifest, resolved, audio_result)

        props_file = os.path.join(target_package_dir, "episode_props.json")
        with open(props_file, "w", encoding="utf-8") as f:
            json.dump(props, f, indent=2)

        # Set as active package for instant Remotion preview and render
        os.makedirs(ACTIVE_DIR, exist_ok=True)
        active_props = os.path.join(ACTIVE_DIR, "episode_props.json")
        with open(active_props, "w", encoding="utf-8") as f:
            json.dump(props, f, indent=2)

        # Write Import Report
        report = {
            "episodeId": episode_id,
            "title": manifest.get("title"),
            "status": "READY_TO_RENDER",
            "importedAt": datetime.now().isoformat(),
            "packageDir": target_package_dir,
            "propsPath": props_file,
            "totalFrames": props["config"]["durationInFrames"],
            "fps": props["config"]["fps"],
            "dimensions": f"{props['config']['width']}x{props['config']['height']}",
            "scenesCount": len(props["config"]["scenes"]),
            "resolvedAssets": len(resolved),
        }
        report_file = os.path.join(target_package_dir, "import_report.json")
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)

        print(f"\n[OK] Package '{episode_id}' ingested and validated successfully!")
        print(f"  • Runtime Props: {props_file}")
        print(f"  • Active Link:   {active_props}")
        print(f"  • Total Duration: {props['config']['durationInFrames']} frames ({round(props['config']['durationInFrames']/props['config']['fps'], 1)}s)\n")

        return True, report

    finally:
        if os.path.exists(temp_extract):
            shutil.rmtree(temp_extract, ignore_errors=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest Claude Production ZIP")
    parser.add_argument("zip_path", help="Path to production ZIP file")
    parser.add_argument("--force", "-f", action="store_true", help="Overwrite existing project directory")
    parser.add_argument("--skip-audio", action="store_true", help="Skip TTS audio synthesis")
    args = parser.parse_args()

    success, rep = ingest_package(args.zip_path, force=args.force, skip_audio=args.skip_audio)
    if not success:
        sys.exit(1)

