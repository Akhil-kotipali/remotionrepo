#!/usr/bin/env python3
"""
Audio and Subtitle Adapter for External Production Packages.
Connects audio_schedule.json or supplied master audio tracks to the Remotion engine.
Handles neural TTS synthesis (edge-tts), audio normalization (-1.5 dBFS),
silence trimming, SRT generation, and sentence timing alignment.
"""

import asyncio
import json
import math
import os
import wave
import numpy as np
import miniaudio
from scipy.signal import butter, fftconvolve, lfilter
import edge_tts

SR = 44100
DEFAULT_VOICE = "en-US-BrianMultilingualNeural"

def add_reverb(x, rt=0.35, mix=0.15, sr=SR):
    """Adds a subtle spatial room acoustic convolution reverb."""
    n = int(sr * rt)
    ir = np.random.randn(n) * np.exp(-np.arange(n) / (sr * rt / 4.0))
    b, a = butter(2, 3500, btype="low", fs=sr)
    ir = lfilter(b, a, ir)
    w = fftconvolve(x, ir)[: len(x)]
    w = w / (np.max(np.abs(w)) + 1e-9) * np.max(np.abs(x))
    return x * (1 - mix) + w * mix

def waveform_trim_silence(samples, sr=SR, threshold_db=-40):
    """Trims digital silence from head and tail with safety padding."""
    amp = np.abs(samples)
    if np.max(amp) == 0:
        return samples
    thresh = 10 ** (threshold_db / 20) * np.max(amp)
    window = int(sr * 0.01)
    kernel = np.ones(window) / window
    env = np.convolve(amp, kernel, mode="same")
    idx = np.where(env > thresh)[0]
    if len(idx) == 0:
        return samples
    start = max(0, idx[0] - int(sr * 0.02))
    end = min(len(samples), idx[-1] + int(sr * 0.03))
    return samples[start:end]

async def synthesize_line(text, voice, rate, pitch, outfile):
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    await communicate.save(outfile)

def to_srt_time(seconds):
    """Formats floating seconds to SRT timestamp format (HH:MM:SS,mmm)."""
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    ms = int((seconds % 1) * 1000)
    return f"{hrs:02d}:{mins:02d}:{secs:02d},{ms:03d}"

def generate_srt(sentences, srt_path):
    """Writes standard SRT subtitle file from sentence timings."""
    blocks = []
    for i, s in enumerate(sentences, 1):
        start = to_srt_time(s["startSec"])
        end = to_srt_time(s["endSec"])
        text = s["text"]
        blocks.append(f"{i}\n{start} --> {end}\n{text}\n")
    with open(srt_path, "w", encoding="utf-8") as f:
        f.write("\n".join(blocks))

def measure_audio_file(filepath):
    """Measures audio duration in seconds and sample rate."""
    info = miniaudio.get_file_info(filepath)
    return {
        "durationSec": info.duration,
        "sampleRate": info.sample_rate,
        "channels": info.nchannels,
    }

async def process_schedule_async(schedule_data, output_wav_path, temp_dir):
    """
    Synthesizes dialogue schedule into normalized master WAV and sentence timings.
    schedule_data can be a list of lines or an object containing 'lines' and 'totalDurationSec'.
    """
    lines = schedule_data.get("lines", schedule_data) if isinstance(schedule_data, dict) else schedule_data
    total_duration = schedule_data.get("totalDurationSec") if isinstance(schedule_data, dict) else None

    os.makedirs(temp_dir, exist_ok=True)
    os.makedirs(os.path.dirname(output_wav_path), exist_ok=True)

    # First pass: synthesize all lines and decode
    processed_lines = []
    max_end_time = 0.0

    print(f"  [AUDIO] Synthesizing {len(lines)} dialogue line(s)...")
    for i, item in enumerate(lines):
        text = item.get("text", "")
        voice = item.get("voice", DEFAULT_VOICE)
        rate = item.get("rate", "+4%")
        pitch = item.get("pitch", "-2Hz")
        target_start = float(item.get("startSec", item.get("target_start", 0.0)))

        mp3_path = os.path.join(temp_dir, f"line_{i:02d}.mp3")
        await synthesize_line(text, voice, rate, pitch, mp3_path)

        f = miniaudio.decode_file(mp3_path)
        samples = np.array(f.samples, dtype=np.float32) / 32768.0
        if f.nchannels == 2:
            samples = samples.reshape(-1, 2).mean(axis=1)

        trimmed = waveform_trim_silence(samples, sr=f.sample_rate)
        if item.get("reverb", False):
            trimmed = add_reverb(trimmed, sr=f.sample_rate)

        dur_sec = len(trimmed) / f.sample_rate
        line_end = target_start + dur_sec
        if line_end > max_end_time:
            max_end_time = line_end

        processed_lines.append({
            "samples": trimmed,
            "startSec": round(target_start, 2),
            "endSec": round(line_end, 2),
            "text": text,
            "speaker": item.get("speaker", "NARRATOR"),
            "yellowWords": item.get("yellowWords", item.get("yellow", [])),
            "redWords": item.get("redWords", item.get("red", [])),
        })

    # Determine master track length
    track_duration = total_duration if total_duration else max(max_end_time + 0.5, 5.0)
    total_samples = int(track_duration * SR)
    master = np.zeros(total_samples, dtype=np.float32)

    # Place clips on timeline
    for item in processed_lines:
        start_idx = int(item["startSec"] * SR)
        samples = item["samples"]
        end_idx = min(start_idx + len(samples), total_samples)
        actual_len = end_idx - start_idx
        if actual_len > 0:
            master[start_idx:end_idx] += samples[:actual_len]

    # Peak normalization to -1.5 dBFS
    peak = np.max(np.abs(master))
    if peak > 0:
        target_peak = 10 ** (-1.5 / 20)  # ~0.8414
        master = (master / peak) * target_peak

    # Save to 16-bit PCM master WAV
    master_int16 = (master * 32767.0).astype(np.int16)
    with wave.open(output_wav_path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(master_int16.tobytes())

    # Build clean sentence timing metadata without raw samples
    sentences_data = []
    for item in processed_lines:
        sentences_data.append({
            "startSec": item["startSec"],
            "endSec": item["endSec"],
            "text": item["text"],
            "speaker": item["speaker"],
            "yellowWords": item["yellowWords"],
            "redWords": item["redWords"],
        })

    srt_path = output_wav_path.replace(".wav", ".srt")
    generate_srt(sentences_data, srt_path)

    print(f"  [AUDIO] Master WAV written: {output_wav_path} ({round(track_duration, 2)}s)")
    print(f"  [AUDIO] Subtitles written:  {srt_path}")

    return {
        "audioPath": output_wav_path,
        "durationSec": round(track_duration, 2),
        "sentences": sentences_data,
        "srtPath": srt_path,
    }

def process_audio_schedule(schedule_data, output_wav_path, temp_dir="tmp_package_audio"):
    """Synchronous entry point to process an audio schedule."""
    return asyncio.run(process_schedule_async(schedule_data, output_wav_path, temp_dir))

