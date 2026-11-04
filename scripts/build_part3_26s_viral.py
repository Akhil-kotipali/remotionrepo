import asyncio
import os
import wave
import numpy as np
import miniaudio
from scipy.signal import butter, fftconvolve, lfilter
import edge_tts

SR = 44100
FPS = 30
TOTAL_DURATION = 26.0 # Exactly 26.0s (780 frames @ 30fps)
TOTAL_FRAMES = int(TOTAL_DURATION * FPS)
TOTAL_SAMPLES = int(TOTAL_DURATION * SR)

VOICE_NARRATOR = "en-US-BrianMultilingualNeural"
VOICE_NISHA = "en-US-AriaNeural"
VOICE_ARJUN = "en-US-BrianMultilingualNeural"

# Hyper-tightened 26s master viral script
SCHEDULE = [
    # 1. THE HOOK (0.1s - 3.4s)
    {"text": "Five friends. One photograph.", "target_start": 0.15, "voice": VOICE_NARRATOR, "rate": "+4%", "pitch": "-2Hz", "reverb": False, "yellow": ["FIVE", "ONE"], "red": []},
    {"text": "And four completely different memories.", "target_start": 1.85, "voice": VOICE_NARRATOR, "rate": "+6%", "pitch": "-2Hz", "reverb": False, "yellow": ["FOUR", "DIFFERENT"], "red": ["DIFFERENT"]},

    # 2. RAPID-FIRE CONTRADICTIONS (3.8s - 10.5s)
    {"text": "Rahul said Dev left alone.", "target_start": 3.90, "voice": VOICE_NARRATOR, "rate": "+10%", "pitch": "-2Hz", "reverb": False, "yellow": ["ALONE."], "red": []},
    {"text": "Meera swore Arjun followed him.", "target_start": 5.60, "voice": VOICE_NARRATOR, "rate": "+10%", "pitch": "-2Hz", "reverb": False, "yellow": ["FOLLOWING"], "red": ["ARJUN"]},
    {"text": "Kabir heard them fighting.", "target_start": 7.50, "voice": VOICE_NARRATOR, "rate": "+10%", "pitch": "-2Hz", "reverb": False, "yellow": ["FIGHTING."], "red": []},
    {"text": "Don't touch me!", "target_start": 9.10, "voice": VOICE_NISHA, "rate": "+18%", "pitch": "+3Hz", "reverb": True, "yellow": ["TOUCH"], "red": ["TOUCH", "ME!"]},
    {"text": "None of their stories matched.", "target_start": 10.40, "voice": VOICE_NARRATOR, "rate": "+8%", "pitch": "-2Hz", "reverb": False, "yellow": ["NONE"], "red": ["MATCHED."]},

    # 3. THE UNANSWERED QUESTION (12.2s - 16.5s)
    {"text": "Did anyone actually see him fall?", "target_start": 12.40, "voice": VOICE_ARJUN, "rate": "-2%", "pitch": "-4Hz", "reverb": True, "yellow": ["SEE"], "red": ["FALL?"]},
    {"text": "Nobody had.", "target_start": 15.00, "voice": VOICE_NARRATOR, "rate": "-4%", "pitch": "-3Hz", "reverb": False, "yellow": ["NOBODY"], "red": ["HAD."]},

    # 4. THE 16-22s REVEAL: DEV'S SECRET RECORDING
    {"text": "Because that night, Dev was secretly recording in the hallway...", "target_start": 16.60, "voice": VOICE_NARRATOR, "rate": "+8%", "pitch": "-2Hz", "reverb": False, "yellow": ["SECRETLY", "RECORDING"], "red": []},
    {"text": "And that video is still inside the abandoned house.", "target_start": 20.30, "voice": VOICE_NARRATOR, "rate": "+6%", "pitch": "-3Hz", "reverb": False, "yellow": ["VIDEO", "INSIDE"], "red": ["ABANDONED"]},

    # 5. SEAMLESS LOOP CUE (24.2s - 25.8s -> Hard cut at 26.0s)
    {"text": "Look at the window again.", "target_start": 24.20, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-4Hz", "reverb": True, "yellow": ["WINDOW"], "red": ["AGAIN."]},
]

def add_reverb(x, rt=0.6, mix=0.22):
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
    window = int(sr * 0.01)
    kernel = np.ones(window) / window
    env = np.convolve(amp, kernel, mode='same')
    active = np.where(env > thresh)[0]
    if len(active) == 0:
        return samples, 0, len(samples)
    start = max(0, active[0] - int(sr * 0.015))
    end = min(len(samples), active[-1] + int(sr * 0.035))
    return samples[start:end], start, end

async def generate_segment(text, voice, rate, pitch, tmp_file):
    comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    await comm.save(tmp_file)

async def main():
    tmp_dir = "scripts/tmp_tts_part3_26s"
    os.makedirs(tmp_dir, exist_ok=True)
    master_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    actual_sentences = []

    print("Synthesizing hyper-tight 26.0s Part 3 master voiceover...")
    for idx, item in enumerate(SCHEDULE):
        tmp_mp3 = os.path.join(tmp_dir, f"line_{idx:02d}.mp3")
        await generate_segment(item["text"], item["voice"], item["rate"], item["pitch"], tmp_mp3)

        decoded = miniaudio.decode_file(tmp_mp3)
        raw = np.array(decoded.samples, dtype=np.float32) / 32768.0
        if decoded.nchannels == 2:
            raw = (raw[0::2] + raw[1::2]) * 0.5
        if decoded.sample_rate != SR:
            num_t = int(len(raw) * (SR / decoded.sample_rate))
            raw = np.interp(np.linspace(0, len(raw), num_t), np.arange(len(raw)), raw)

        raw, _, _ = waveform_trim_silence(raw, SR)
        if item.get("reverb"):
            raw = add_reverb(raw, rt=0.5, mix=0.22)

        start_sample = int(item["target_start"] * SR)
        end_sample = min(start_sample + len(raw), TOTAL_SAMPLES)
        length_to_copy = end_sample - start_sample

        master_track[start_sample:end_sample] += raw[:length_to_copy]

        dur_sec = length_to_copy / SR
        actual_start = item["target_start"]
        actual_end = round(actual_start + dur_sec, 2)
        actual_sentences.append([
            actual_start,
            actual_end,
            item["text"],
            item.get("yellow", []),
            item.get("red", [])
        ])
        print(f"[{actual_start:.2f}s - {actual_end:.2f}s] {item['text']}")

    # Normalize to -1.5 dB peak
    peak = np.max(np.abs(master_track))
    if peak > 0:
        master_track = master_track / peak * 0.88

    out_wav = "public/audio/voiceover_part3_viral.wav"
    i16 = (np.clip(master_track, -1.0, 1.0) * 32767).astype(np.int16)
    with wave.open(out_wav, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(i16.tobytes())

    print(f"\nSaved viral voiceover track to {out_wav} (Duration: {TOTAL_DURATION}s, {TOTAL_FRAMES} frames)")

    print("\n--- TYPESCRIPT CAPTIONS FORMAT ---")
    print(f"export const DURATION_VIRAL = {TOTAL_FRAMES}; // {TOTAL_DURATION}s")
    print("export const SENTENCES_VIRAL: Sentence[] = " + repr(actual_sentences) + ";")

if __name__ == "__main__":
    asyncio.run(main())

