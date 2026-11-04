import asyncio
import os
import wave
import numpy as np
import miniaudio
from scipy.signal import butter, fftconvolve, lfilter
import edge_tts

SR = 44100
FPS = 30
TOTAL_DURATION = 30.0  # Exactly 30.0s (900 frames @ 30fps)
TOTAL_FRAMES = int(TOTAL_DURATION * FPS)
TOTAL_SAMPLES = int(TOTAL_DURATION * SR)

VOICE_NARRATOR = "en-US-BrianMultilingualNeural"
VOICE_ARJUN = "en-US-BrianMultilingualNeural"

SCHEDULE = [
    # Act 1: Dossier / Forensic Hook (0.0s - 7.8s)
    {
        "text": "Deep inside the simulation, an autonomous prototype was brought to life.",
        "target_start": 0.20,
        "voice": VOICE_NARRATOR,
        "rate": "+5%",
        "pitch": "-2Hz",
        "reverb": False,
        "yellow": ["SIMULATION,", "PROTOTYPE"],
        "red": ["AUTONOMOUS"],
    },
    {
        "text": "Built entirely with procedural 3D shaders and deterministic physics.",
        "target_start": 4.50,
        "voice": VOICE_NARRATOR,
        "rate": "+6%",
        "pitch": "-2Hz",
        "reverb": False,
        "yellow": ["PROCEDURAL", "3D"],
        "red": ["PHYSICS."],
    },
    # Act 2: 3D Showcase (8.0s - 17.5s)
    {
        "text": "Watch as the engine choreographs dynamic lighting, tire drift, and real-time shadows.",
        "target_start": 8.20,
        "voice": VOICE_NARRATOR,
        "rate": "+5%",
        "pitch": "-2Hz",
        "reverb": False,
        "yellow": ["DYNAMIC", "LIGHTING,"],
        "red": ["DRIFT,", "SHADOWS."],
    },
    {
        "text": "Every single frame rendered deterministically at sixty frames per second.",
        "target_start": 13.00,
        "voice": VOICE_NARRATOR,
        "rate": "+6%",
        "pitch": "-2Hz",
        "reverb": False,
        "yellow": ["DETERMINISTICALLY"],
        "red": ["SIXTY", "FRAMES"],
    },
    # Act 3: Dialogue / Character Confrontation (18.0s - 24.5s)
    {
        "text": "Then Arjun asked the question everyone was thinking.",
        "target_start": 17.80,
        "voice": VOICE_NARRATOR,
        "rate": "+4%",
        "pitch": "-2Hz",
        "reverb": False,
        "yellow": ["QUESTION"],
        "red": ["ARJUN"],
    },
    {
        "text": "Can this engine produce any video format in seconds?",
        "target_start": 21.00,
        "voice": VOICE_ARJUN,
        "rate": "+4%",
        "pitch": "-4Hz",
        "reverb": True,
        "yellow": ["ENGINE"],
        "red": ["SECONDS?"],
    },
    # Act 4: 3D Climax & Seamless Loop (24.8s - 28.5s)
    {
        "text": "The answer is yes. And to prove how seamless it is, watch again. Because...",
        "target_start": 24.60,
        "voice": VOICE_NARRATOR,
        "rate": "+6%",
        "pitch": "-3Hz",
        "reverb": True,
        "yellow": ["SEAMLESS"],
        "red": ["BECAUSE..."],
    },
]

def add_reverb(x, rt=0.4, mix=0.18):
    n = int(SR * rt)
    ir = np.random.randn(n) * np.exp(-np.arange(n) / (SR * rt / 4.0))
    b, a = butter(2, 3500, btype="low", fs=SR)
    ir = lfilter(b, a, ir)
    w = fftconvolve(x, ir)[: len(x)]
    w = w / (np.max(np.abs(w)) + 1e-9) * np.max(np.abs(x))
    return x * (1 - mix) + w * mix

def waveform_trim_silence(samples, sr=SR, threshold_db=-40):
    amp = np.abs(samples)
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

async def generate_speech(text, voice, rate, pitch, outfile):
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    await communicate.save(outfile)

async def main():
    os.makedirs("tmp_demo_audio", exist_ok=True)
    os.makedirs("public/audio", exist_ok=True)

    master = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    sentences_data = []

    print("[1/3] Synthesizing neural dialogue tracks...")
    for i, item in enumerate(SCHEDULE):
        mp3_path = f"tmp_demo_audio/line_{i:02d}.mp3"
        await generate_speech(item["text"], item["voice"], item["rate"], item["pitch"], mp3_path)

        f = miniaudio.decode_file(mp3_path)
        samples = np.array(f.samples, dtype=np.float32) / 32768.0
        if f.nchannels == 2:
            samples = samples.reshape(-1, 2).mean(axis=1)

        trimmed = waveform_trim_silence(samples, sr=f.sample_rate)

        if item.get("reverb", False):
            trimmed = add_reverb(trimmed, rt=0.45, mix=0.22)

        start_sec = item["target_start"]
        start_sample = int(start_sec * SR)
        end_sample = min(start_sample + len(trimmed), TOTAL_SAMPLES)
        length_to_insert = end_sample - start_sample

        master[start_sample:end_sample] += trimmed[:length_to_insert]
        end_sec = round(start_sec + (length_to_insert / SR), 2)

        sentences_data.append({
            "startSec": start_sec,
            "endSec": end_sec,
            "text": item["text"],
            "speaker": item.get("voice"),
            "yellowWords": item.get("yellow", []),
            "redWords": item.get("red", []),
        })
        print(f"  Line {i+1:02d} [{start_sec:05.2f}s - {end_sec:05.2f}s]: {item['text']}")

    # Peak normalization
    max_amp = np.max(np.abs(master))
    if max_amp > 0:
        target_amp = 10 ** (-1.5 / 20)  # -1.5 dB peak
        master = master * (target_amp / max_amp)

    out_wav = "public/audio/voiceover_engine_demo_30s.wav"
    int_samples = (master * 32767.0).astype(np.int16)
    with wave.open(out_wav, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(int_samples.tobytes())

    print(f"\n[2/3] Wrote master voiceover to: {out_wav}")

    # Emit JSON sentence timing
    import json
    with open("tmp_demo_audio/sentences.json", "w") as jf:
        json.dump(sentences_data, jf, indent=2)

    print("[3/3] Demo audio build complete!")

if __name__ == "__main__":
    asyncio.run(main())

