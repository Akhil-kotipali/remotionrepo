import asyncio
import os
import wave
import numpy as np
import miniaudio
from scipy.signal import butter, fftconvolve, lfilter
import edge_tts

SR = 44100
FPS = 30
TOTAL_DURATION = 57.0 # seconds
TOTAL_SAMPLES = int(TOTAL_DURATION * SR)

VOICE = "en-US-BrianMultilingualNeural"

# Precisely timed for reading room & dramatic pauses:
BEATS = [
    # Beat 1: Hook (0.25s) -> 2.1s silence
    {"id": "hook", "text": "What if your dead friend messaged you?", "rate": "+12%", "pitch": "-2Hz", "target_start": 0.25, "reverb": False},

    # Beat 2: Bedroom (5.4s) -> ends 9.38s
    {"id": "bedroom", "text": "Arjun was alone in his bedroom.", "rate": "+10%", "pitch": "-2Hz", "target_start": 5.40, "reverb": False},

    # Beat 3: Phone restore (9.6s) -> ends 12.4s
    {"id": "restore", "text": "His phone was restoring an old backup.", "rate": "+16%", "pitch": "-2Hz", "target_start": 9.60, "reverb": False},
    # -> CRITICAL READ-TIME SILENCE: 12.4s to 14.0s (1.6s) while viewer reads "Dev" on screen!

    # Beat 4: Dev revelation (14.0s) -> ends 16.5s
    {"id": "dev_dead", "text": "Dev died one year ago.", "rate": "+4%", "pitch": "-3Hz", "target_start": 14.00, "reverb": False},
    # -> 1.8s silence

    # Beat 5: Chat opens (17.8s) -> ends ~20.2s
    {"id": "open_chat", "text": "Arjun opened the conversation.", "rate": "+16%", "pitch": "-2Hz", "target_start": 17.80, "reverb": False},
    # -> CRITICAL READ-TIME SILENCE: ~20.2s to 24.2s (4.0s) while "YOU SAID YOU WOULDN'T TELL THEM." types out!

    # Beat 6: Reaction (24.2s) -> ends ~26.2s
    {"id": "hands_cold", "text": "His hands went cold.", "rate": "-2%", "pitch": "-3Hz", "target_start": 24.20, "reverb": False},
    # -> CRITICAL READ-TIME SILENCE: ~26.2s to 31.5s (5.3s) while second message appears & Arjun trembles!

    # Beat 7: Pacing / denial (31.5s) -> ends ~34.2s
    {"id": "glitch", "text": "He told himself it was just a glitch.", "rate": "+14%", "pitch": "-2Hz", "target_start": 31.50, "reverb": False},
    # -> 2.3s silence

    # Beat 8: The timestamp reveal (36.5s) -> ends ~38.8s
    {"id": "timestamp", "text": "Until he saw the timestamp.", "rate": "+8%", "pitch": "-2Hz", "target_start": 36.50, "reverb": False},
    # -> 1.7s silence while October 31 highlights!

    # Beat 9: Night Dev died (40.5s) -> ends ~42.5s
    {"id": "night_died", "text": "The night Dev died.", "rate": "-4%", "pitch": "-3Hz", "target_start": 40.50, "reverb": False},
    # -> 1.3s silence

    # Beat 10: Photograph attached (43.8s) -> ends ~47.0s
    {"id": "photo", "text": "Five friends outside the abandoned house.", "rate": "+10%", "pitch": "-2Hz", "target_start": 43.80, "reverb": False},
    # -> CRITICAL DISCOVERY SILENCE: ~47.0s to 50.0s (3.0s) while viewer scans the friends!
    # -> PEAK HORROR SILENCE: 50.0s to 52.8s (2.8s) when friends' eyes turn to Arjun!

    # Beat 11: Climax whisper (52.8s)
    {"id": "climax", "text": "Why is everyone looking at me?", "rate": "-6%", "pitch": "-4Hz", "target_start": 52.80, "reverb": True},
]

def add_reverb(x, rt=0.8, mix=0.25):
    n = int(SR * rt)
    ir = np.random.randn(n) * np.exp(-np.arange(n) / (SR * rt / 4.0))
    b, a = butter(2, 3500, btype='low', fs=SR)
    ir = lfilter(b, a, ir)
    w = fftconvolve(x, ir)[:len(x)]
    w = w / (np.max(np.abs(w)) + 1e-9) * np.max(np.abs(x))
    return x * (1 - mix) + w * mix

def waveform_trim_silence(samples, sr=SR, threshold_db=-40):
    amp = np.abs(samples)
    thresh = 10 ** (threshold_db / 20) * np.max(amp)
    active = np.where(amp > thresh)[0]
    if len(active) == 0:
        return samples, 0, len(samples)
    start = max(0, active[0] - int(sr * 0.02))
    end = min(len(samples), active[-1] + int(sr * 0.05))
    return samples[start:end], start, end

async def generate_segment(text, voice, rate, pitch, tmp_file):
    comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    await comm.save(tmp_file)

async def main():
    tmp_dir = "scripts/tmp_tts_experiment"
    os.makedirs(tmp_dir, exist_ok=True)
    master_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

    timings = []

    for idx, item in enumerate(BEATS):
        tmp_mp3 = os.path.join(tmp_dir, f"beat_{idx:02d}_{item['id']}.mp3")
        await generate_segment(item["text"], VOICE, item["rate"], item["pitch"], tmp_mp3)

        decoded = miniaudio.decode_file(tmp_mp3)
        raw = np.array(decoded.samples, dtype=np.float32) / 32768.0

        if decoded.sample_rate != SR:
            import scipy.signal
            num_samples = int(len(raw) * SR / decoded.sample_rate)
            raw = scipy.signal.resample(raw, num_samples)

        trimmed, _, _ = waveform_trim_silence(raw, SR)

        if item.get("reverb", False):
            trimmed = add_reverb(trimmed, rt=0.85, mix=0.28)

        # Smooth 8ms fade in/out
        fade_len = int(SR * 0.008)
        if len(trimmed) > fade_len * 2:
            trimmed[:fade_len] *= np.linspace(0, 1, fade_len)
            trimmed[-fade_len:] *= np.linspace(1, 0, fade_len)

        target_sample = int(item["target_start"] * SR)
        end_sample = min(TOTAL_SAMPLES, target_sample + len(trimmed))
        master_track[target_sample:end_sample] += trimmed[:end_sample - target_sample]

        duration_sec = len(trimmed) / SR
        timings.append({
            "idx": idx,
            "id": item["id"],
            "text": item["text"],
            "start_sec": item["target_start"],
            "end_sec": item["target_start"] + duration_sec,
            "duration": duration_sec,
            "start_frame": int(item["target_start"] * FPS),
            "end_frame": int((item["target_start"] + duration_sec) * FPS)
        })

    # Peak normalize master track to -1.0 dBFS
    peak = np.max(np.abs(master_track))
    if peak > 0:
        target_peak = 10 ** (-1.0 / 20.0) # ~0.891
        master_track = (master_track / peak) * target_peak

    out_wav = "public/audio/voiceover_part1_experiment.wav"
    int16_samples = np.clip(master_track * 32767.0, -32768.0, 32767.0).astype(np.int16)
    with wave.open(out_wav, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(int16_samples.tobytes())

    print(f"\n=== EXPERIMENTAL PACED VOICEOVER GENERATED ===")
    print(f"File: {out_wav} (Total Duration: {len(master_track)/SR:.2f}s)\n")
    for i, t in enumerate(timings):
        pause_to_next = ""
        if i < len(timings) - 1:
            next_start = timings[i+1]["start_sec"]
            gap = next_start - t["end_sec"]
            pause_to_next = f" --> [READ TIME / SUSPENSE SILENCE: {gap:4.2f}s]"
        print(f"[{t['start_sec']:5.2f}s - {t['end_sec']:5.2f}s] (F{t['start_frame']:04d}-F{t['end_frame']:04d}) {t['text']}{pause_to_next}")

if __name__ == "__main__":
    asyncio.run(main())
