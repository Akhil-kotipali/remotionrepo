#!/usr/bin/env python3
"""
Studio CLI — Unified One-Command Production Engine for Remotion Videos.
Handles external package ingestion, asset resolution, audio synthesis,
dynamic Remotion rendering, and automated quality control.
"""

import argparse
import json
import os
import subprocess
import sys
import time

# Ensure scripts directory is in python path
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
SCRIPTS_DIR = os.path.join(ROOT_DIR, "scripts")
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

from scripts.ingest_package import (
    ingest_package,
    resolve_assets,
    print_missing_assets_report,
    PACKAGES_DIR,
    ACTIVE_DIR,
    PUBLIC_DIR,
)

def log_header(title):
    print("\n" + "=" * 65)
    print(f"  [STUDIO ENGINE] {title.upper()}")
    print("=" * 65)

def run_cmd(cmd, desc=None):
    if desc:
        print(f"\n>> {desc}...")
    print(f"  $ {cmd}")
    t0 = time.time()
    res = subprocess.run(cmd, shell=True)
    dt = round(time.time() - t0, 1)
    if res.returncode != 0:
        print(f"  [X] Command failed with return code {res.returncode} ({dt}s)")
        return False
    print(f"  [OK] Completed in {dt}s")
    return True

def cmd_audit(args):
    """Audits project assets, models, audio tracks, and TypeScript health."""
    log_header("Comprehensive Asset & Health Audit")
    errors = []
    warnings = []

    # 1. TypeScript Verification
    print("Checking TypeScript compilation...")
    res = subprocess.run("npx tsc --noEmit", shell=True, capture_output=True, text=True)
    if res.returncode == 0:
        print("  [OK] TypeScript: 0 errors (clean compilation)")
    else:
        print("  [X] TypeScript compilation failed:")
        print(res.stdout or res.stderr)
        errors.append("TypeScript compilation failed")

    # 2. Check 3D Assets
    print("\nChecking 3D GLB Models...")
    glb_files = ["public/models/MUSCLE_CAR.glb", "3d assests/MUSCLE_CAR.glb"]
    for g in glb_files:
        if os.path.exists(g):
            sz_mb = round(os.path.getsize(g) / (1024 * 1024), 2)
            print(f"  [OK] Found GLB: {g} ({sz_mb} MB)")
        else:
            warnings.append(f"Missing GLB path: {g}")

    # 3. Check Background Plates
    print("\nChecking Visual Background Plates...")
    plates = ["public/backgrounds/exterior.jpg", "public/backgrounds/living_room.jpg", "public/backgrounds/hallway.jpg"]
    for p in plates:
        if os.path.exists(p):
            print(f"  [OK] Found Background: {p}")
        else:
            errors.append(f"Missing background: {p}")

    # 4. Check SFX Files
    print("\nChecking Spatial SFX Library...")
    sfx_req = ["drone.wav", "camera_shutter.wav", "whoosh.wav", "glitch_hit.wav", "reverse_swell.wav"]
    for s in sfx_req:
        sp = f"public/audio/sfx/{s}"
        if os.path.exists(sp):
            print(f"  [OK] Found SFX: {s}")
        else:
            errors.append(f"Missing essential SFX: {sp}")

    # Summary
    print("\n" + "-" * 50)
    if errors:
        print(f"[X] AUDIT FAILED with {len(errors)} error(s):")
        for e in errors:
            print(f"   - {e}")
        return False
    else:
        print(f"[OK] AUDIT PASSED! All core engine dependencies are verified and healthy.")
        return True

def cmd_package(args):
    """
    Complete One-Command Pipeline:
    Claude ZIP -> Safe Ingestion -> Asset Resolution -> Audio Synthesis -> MP4 Render -> Thumbnail
    """
    log_header("One-Command Production: External Claude Package")
    t0 = time.time()

    zip_path = args.zip_path
    if not os.path.exists(zip_path):
        print(f"[X] Package ZIP not found: {zip_path}")
        sys.exit(1)

    # Step 1: Ingest and Validate
    success, result = ingest_package(zip_path, force=args.force, skip_audio=args.skip_audio)
    if not success:
        if result and result.get("status") == "ASSETS_MISSING":
            print("\n[STOPPED] Please download the missing assets and re-run:")
            print(f"  python studio.py package {zip_path}")
            sys.exit(2)
        else:
            print("[X] Ingestion and validation failed.")
            sys.exit(1)

    episode_id = result["episodeId"]
    props_path = result["propsPath"].replace("\\", "/")

    if args.preview:
        log_header(f"Previewing Episode: {episode_id}")
        print(f"Launching Remotion Studio with active props: {props_path}")
        subprocess.run("npx remotion studio", shell=True)
        return True

    if args.skip_render:
        print(f"[OK] Ingestion complete. Render skipped via --skip-render.")
        return True

    # Step 2: Render Master Video via Remotion PackageEpisode
    out_dir = "output final videos"
    os.makedirs(out_dir, exist_ok=True)
    out_video = os.path.join(out_dir, f"{episode_id}_Master.mp4").replace("\\", "/")

    render_cmd = f'npx remotion render PackageEpisode "{out_video}" --props="{props_path}" --overwrite'
    if not run_cmd(render_cmd, f"Rendering Master Video: {episode_id} (PackageEpisode)"):
        sys.exit(1)

    # Step 3: Render High-CTR Cover Thumbnail
    thumb_frame = args.thumb_frame or int(result["totalFrames"] * 0.4)
    out_thumb = os.path.join(out_dir, f"{episode_id}_Thumbnail.png").replace("\\", "/")
    still_cmd = f'npx remotion still PackageEpisode "{out_thumb}" --props="{props_path}" --frame={thumb_frame} --overwrite'
    run_cmd(still_cmd, f"Rendering Cover Thumbnail @ frame {thumb_frame}")

    # Step 4: Write Final Production Report
    total_time = round(time.time() - t0, 1)
    prod_report = {
        "episodeId": episode_id,
        "title": result.get("title"),
        "status": "COMPLETED",
        "renderedAt": time.strftime("%Y-%m-%d %H:%M:%S"),
        "wallClockTimeSec": total_time,
        "masterVideo": out_video,
        "coverThumbnail": out_thumb,
        "totalFrames": result["totalFrames"],
        "fps": result["fps"],
        "dimensions": result["dimensions"],
    }
    prod_report_path = os.path.join(out_dir, f"{episode_id}_Production_Report.json")
    with open(prod_report_path, "w", encoding="utf-8") as f:
        json.dump(prod_report, f, indent=2)

    log_header("Package Production Complete!")
    print(f"  [VIDEO]  Master Video:     {out_video}")
    print(f"  [THUMB]  Cover Thumbnail:  {out_thumb}")
    print(f"  [REPORT] Production Info:  {prod_report_path}")
    print(f"  [TIME]   Total Wall-Clock: {total_time}s\n")
    return True

def cmd_import(args):
    """Imports and validates a Claude ZIP package without rendering."""
    log_header(f"Importing Package: {args.zip_path}")
    success, rep = ingest_package(args.zip_path, force=args.force, skip_audio=args.skip_audio)
    if not success:
        sys.exit(1)

def cmd_assets(args):
    """Inspects and resolves assets for an existing or newly downloaded episode package."""
    episode_id = args.episode_id
    package_dir = os.path.join(PACKAGES_DIR, episode_id)
    if not os.path.exists(package_dir):
        print(f"[X] Episode package directory not found: {package_dir}")
        sys.exit(1)

    manifest_file = os.path.join(package_dir, "manifest.json")
    with open(manifest_file, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    asset_manifest = None
    asset_man_file = os.path.join(package_dir, "asset-manifest.json")
    if os.path.exists(asset_man_file):
        with open(asset_man_file, "r", encoding="utf-8") as f:
            asset_manifest = json.load(f)

    resolved, missing = resolve_assets(package_dir, manifest, asset_manifest)
    log_header(f"Asset Resolution Audit: {episode_id}")
    print(f"Resolved Assets: {len(resolved)}")
    for k, v in resolved.items():
        print(f"  [OK] {k} -> {v}")

    if missing:
        guide_text = None
        guide_file = os.path.join(package_dir, "ASSET_ACQUISITION_GUIDE.md")
        if os.path.exists(guide_file):
            with open(guide_file, "r", encoding="utf-8") as f:
                guide_text = f.read()
        print_missing_assets_report(missing, guide_text)
        sys.exit(2)
    else:
        print("\n[OK] 100% of required assets are resolved! Ready for rendering.")

def cmd_render(args):
    """Renders a registered composition to MP4."""
    log_header(f"Rendering Composition: {args.comp_id}")
    out = args.output or f"output final videos/{args.comp_id}.mp4"
    os.makedirs(os.path.dirname(out), exist_ok=True)
    props_flag = f'--props="{args.props}"' if args.props else ""
    cmd = f'npx remotion render {args.comp_id} "{out}" {props_flag} --overwrite'
    return run_cmd(cmd, f"Rendering {args.comp_id} to {out}")

def cmd_still(args):
    """Renders a single still frame from a composition."""
    log_header(f"Rendering Still: {args.comp_id} @ frame {args.frame}")
    out = args.output or f"output final videos/{args.comp_id}_f{args.frame}.png"
    os.makedirs(os.path.dirname(out), exist_ok=True)
    props_flag = f'--props="{args.props}"' if args.props else ""
    cmd = f'npx remotion still {args.comp_id} "{out}" --frame={args.frame} {props_flag} --overwrite'
    return run_cmd(cmd, f"Rendering still frame {args.frame} to {out}")

def cmd_report(args):
    """Prints production and import reports for an episode."""
    episode_id = args.episode_id
    rep_file = os.path.join(PACKAGES_DIR, episode_id, "import_report.json")
    if not os.path.exists(rep_file):
        rep_file = os.path.join("output final videos", f"{episode_id}_Production_Report.json")

    if not os.path.exists(rep_file):
        print(f"[X] No report found for episode: {episode_id}")
        sys.exit(1)

    with open(rep_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    log_header(f"Report: {episode_id}")
    print(json.dumps(data, indent=2))

def cmd_build_demo(args):
    """Legacy one-command production build of 3D Engine Showcase demonstration."""
    log_header("One-Command Production: 3D Engine Showcase Demonstration")
    t0 = time.time()

    if not run_cmd("python scripts/build_engine_demo_audio.py", "Step 1/4: Synthesizing Neural Audio & Captions"):
        sys.exit(1)
    if not run_cmd("npx tsc --noEmit", "Step 2/4: Validating TypeScript Integrity"):
        sys.exit(1)

    out_video = "output final videos/UniversalEngine_3D_Showcase_30s.mp4"
    if not run_cmd(f'npx remotion render UniversalEngineShowcase "{out_video}" --overwrite', "Step 3/4: Rendering Master Video (1080x1920 @ 30fps)"):
        sys.exit(1)

    out_thumb = "output final videos/UniversalEngine_3D_Showcase_Thumbnail.png"
    if not run_cmd(f'npx remotion still UniversalEngineShowcase "{out_thumb}" --frame=360 --overwrite', "Step 4/4: Rendering 9:16 High-CTR Cover Thumbnail"):
        sys.exit(1)

    total_time = round(time.time() - t0, 1)
    log_header("Production Complete!")
    print(f"  [VIDEO] Master Video: {out_video}")
    print(f"  [THUMB] Cover Thumbnail: {out_thumb}")
    print(f"  [TIME]  Total Pipeline Wall-Clock Time: {total_time}s\n")

def main():
    parser = argparse.ArgumentParser(description="Studio Remotion Production Engine CLI")
    subparsers = parser.add_subparsers(dest="subcommand", help="Studio operations")

    # 1. Package (All-in-one: ZIP -> Validate -> Resolve -> Audio -> Render MP4)
    p_pkg = subparsers.add_parser("package", help="Process Claude ZIP package end-to-end")
    p_pkg.add_argument("zip_path", help="Path to production ZIP file")
    p_pkg.add_argument("--force", "-f", action="store_true", help="Force overwrite existing package folder")
    p_pkg.add_argument("--skip-audio", action="store_true", help="Skip TTS audio synthesis")
    p_pkg.add_argument("--skip-render", action="store_true", help="Skip final MP4 video render")
    p_pkg.add_argument("--preview", "-p", action="store_true", help="Launch Remotion Studio preview instead of rendering")
    p_pkg.add_argument("--thumb-frame", type=int, help="Specific frame number for thumbnail extraction")

    # 2. Import (Extract & validate without rendering)
    p_imp = subparsers.add_parser("import", help="Import & validate a ZIP package without rendering")
    p_imp.add_argument("zip_path", help="Path to production ZIP file")
    p_imp.add_argument("--force", "-f", action="store_true", help="Force overwrite")
    p_imp.add_argument("--skip-audio", action="store_true", help="Skip audio synthesis")

    # 3. Assets (Check and resolve assets)
    p_ast = subparsers.add_parser("assets", help="Audit & resolve asset status for an episode")
    p_ast.add_argument("episode_id", help="Episode ID (folder name inside public/packages/)")

    # 4. Report
    p_rep = subparsers.add_parser("report", help="Show production/import report for an episode")
    p_rep.add_argument("episode_id", help="Episode ID")

    # 5. Audit (Existing engine health check)
    subparsers.add_parser("audit", help="Check asset and engine health")

    # 6. Render (Direct Remotion render)
    p_render = subparsers.add_parser("render", help="Render video composition")
    p_render.add_argument("comp_id", help="Remotion composition ID")
    p_render.add_argument("--output", "-o", help="Output MP4 file path")
    p_render.add_argument("--props", help="Path to props JSON file")

    # 7. Still (Direct Remotion frame extract)
    p_still = subparsers.add_parser("still", help="Render video still frame")
    p_still.add_argument("comp_id", help="Remotion composition ID")
    p_still.add_argument("--frame", "-f", type=int, default=0, help="Frame number")
    p_still.add_argument("--output", "-o", help="Output PNG file path")
    p_still.add_argument("--props", help="Path to props JSON file")

    # 8. Build Demo (Legacy showcase build)
    subparsers.add_parser("build-demo", help="One-command production build of 3D Engine Showcase")

    args = parser.parse_args()

    if args.subcommand == "package":
        cmd_package(args)
    elif args.subcommand == "import":
        cmd_import(args)
    elif args.subcommand == "assets":
        cmd_assets(args)
    elif args.subcommand == "report":
        cmd_report(args)
    elif args.subcommand == "audit":
        cmd_audit(args)
    elif args.subcommand == "render":
        cmd_render(args)
    elif args.subcommand == "still":
        cmd_still(args)
    elif args.subcommand == "build-demo":
        cmd_build_demo(args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
