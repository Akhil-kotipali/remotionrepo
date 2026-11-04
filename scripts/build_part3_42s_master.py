import asyncio
import os
import wave
import numpy as np
import miniaudio
from scipy.signal import butter, fftconvolve, lfilter
import edge_tts

SR = 44100
FPS = 30
TOTAL_DURATION = 42.0  # Exactly 42.0s (1260 frames @ 30fps)
TOTAL_FRAMES = int(TOTAL_DURATION * FPS)
TOTAL_SAMPLES = int(TOTAL_DURATION * SR)

VOICE_NARRATOR = "en-US-BrianMultilingualNeural"
VOICE_NISHA = "en-US-AriaNeural"
VOICE_ARJUN = "en-US-BrianMultilingualNeural"

# High-Stakes Upfront Premise Script (Clean sequence, zero overlap)
SCHEDULE = [
    # Act 1: Upfront Stakes & Crime Anchor (0.0s - 8.2s)
    {"text": "Minutes after this final photo was taken, Dev fell from that balcony.", "target_start": 0.20, "voice": VOICE_NARRATOR, "rate": "+4%", "pitch": "-2Hz", "reverb": False, "yellow": ["FINAL", "PHOTO"], "red": ["DEV", "FELL", "BALCONY."]},
    {"text": "Four friends gave an alibi. But their stories don't add up.", "target_start": 4.60, "voice": VOICE_NARRATOR, "rate": "+5%", "pitch": "-2Hz", "reverb": False, "yellow": ["FOUR", "ALIBI."], "red": ["DON'T", "ADD", "UP."]},

    # Act 2: The 4 Conflicting Alibis (8.3s - 20.2s)
    {"text": "Rahul swore Dev walked out the front gate alone.", "target_start": 8.30, "voice": VOICE_NARRATOR, "rate": "+5%", "pitch": "-2Hz", "reverb": False, "yellow": ["RAHUL", "ALONE."], "red": []},
    {"text": "Meera claimed Arjun followed him into the dark.", "target_start": 11.20, "voice": VOICE_NARRATOR, "rate": "+5%", "pitch": "-2Hz", "reverb": False, "yellow": ["MEERA", "FOLLOWED"], "red": ["ARJUN"]},
    {"text": "Kabir heard two people fighting in the hallway.", "target_start": 14.10, "voice": VOICE_NARRATOR, "rate": "+5%", "pitch": "-2Hz", "reverb": False, "yellow": ["KABIR", "FIGHTING"], "red": ["HALLWAY."]},
    {"text": "Don't touch me!", "target_start": 16.80, "voice": VOICE_NISHA, "rate": "+12%", "pitch": "+4Hz", "reverb": True, "yellow": ["TOUCH"], "red": ["DON'T", "TOUCH", "ME!"]},
    {"text": "And Nisha heard someone scream on the stairs.", "target_start": 17.80, "voice": VOICE_NARRATOR, "rate": "+5%", "pitch": "-2Hz", "reverb": False, "yellow": ["NISHA", "SCREAM"], "red": ["STAIRS."]},

    # Act 3: Living Room Contradiction & The Turning Point Question (20.3s - 28.8s)
    {"text": "None of their stories matched.", "target_start": 20.40, "voice": VOICE_NARRATOR, "rate": "+4%", "pitch": "-2Hz", "reverb": False, "yellow": ["NONE"], "red": ["MATCHED."]},
    {"text": "Then Arjun asked one question.", "target_start": 22.10, "voice": VOICE_NARRATOR, "rate": "+3%", "pitch": "-2Hz", "reverb": False, "yellow": ["ONE", "QUESTION."], "red": []},
    {"text": "Did anyone actually see Dev fall?", "target_start": 24.30, "voice": VOICE_ARJUN, "rate": "-2%", "pitch": "-4Hz", "reverb": True, "yellow": ["SEE"], "red": ["FALL?"]},
    {"text": "Silence. Nobody had.", "target_start": 27.00, "voice": VOICE_NARRATOR, "rate": "-3%", "pitch": "-3Hz", "reverb": False, "yellow": ["SILENCE."], "red": ["NOBODY", "HAD."]},

    # Act 4: The Hallway Secret Recording & Balcony Angle (29.2s - 38.2s)
    {"text": "Because that night, Dev was secretly recording the hallway...", "target_start": 29.20, "voice": VOICE_NARRATOR, "rate": "+6%", "pitch": "-2Hz", "reverb": False, "yellow": ["SECRETLY", "RECORDING"], "red": []},
    {"text": "Facing the exact balcony where he fell.", "target_start": 32.80, "voice": VOICE_NARRATOR, "rate": "+4%", "pitch": "-3Hz", "reverb": False, "yellow": ["BALCONY"], "red": ["FELL."]},
    {"text": "And that video is still inside the abandoned house.", "target_start": 35.30, "voice": VOICE_NARRATOR, "rate": "+5%", "pitch": "-3Hz", "reverb": False, "yellow": ["VIDEO", "INSIDE"], "red": ["ABANDONED"]},

    # Act 5: Climax & Seamless Loop (38.9s - 40.9s -> Seamless Loop Cut at 42.0s)
    {"text": "Look at the window again. Because...", "target_start": 38.90, "voice": VOICE_NARRATOR, "rate": "+6%", "pitch": "-4Hz", "reverb": True, "yellow": ["WINDOW"], "red": ["BECAUSE..."]},
]

def add_reverb(x, rt=0.5, mix=0.20):
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
        return samples
    start = max(0, active[0] - int(sr * 0.03))
    end = min(len(samples), active[-1] + int(sr * 0.03))
    return samples[start:end]

async def synthesize_item(idx, item, tmp_dir):
    out_path = os.path.join(tmp_dir, f"line_{idx:02d}.mp3")
    comm = edge_tts.Communicate(item["text"], item["voice"], rate=item["rate"], pitch=item["pitch"])
    await comm.save(out_path)
    return out_path

async def main():
    tmp_dir = "tmp_audio_42s"
    os.makedirs(tmp_dir, exist_ok=True)
    out_master = "public/audio/voiceover_part3_42s.wav"

    tasks = [synthesize_item(i, item, tmp_dir) for i, item in enumerate(SCHEDULE)]
    mp3_paths = await asyncio.gather(*tasks)

    # Master mono buffer
    master = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    timing_report = []

    for idx, (item, mp3_p) in enumerate(zip(SCHEDULE, mp3_paths)):
        decoded = miniaudio.decode_file(mp3_p)
        raw = np.frombuffer(decoded.samples, dtype=np.int16).astype(np.float32) / 32768.0

        if decoded.nchannels == 2:
            raw = raw.reshape(-1, 2).mean(axis=1)

        raw = waveform_trim_silence(raw, decoded.sample_rate)

        if decoded.sample_rate != SR:
            num_target = int(len(raw) * SR / decoded.sample_rate)
            raw = np.interp(np.linspace(0, len(raw), num_target), np.arange(len(raw)), raw)

        if item.get("reverb"):
            raw = add_reverb(raw, rt=0.5, mix=0.20)

        fade_len = int(SR * 0.015)
        if len(raw) > fade_len * 2:
            raw[:fade_len] *= np.linspace(0, 1, fade_len)
            raw[-fade_len:] *= np.linspace(1, 0, fade_len)

        dur = len(raw) / SR
        target_s = item["target_start"]
        start_samp = int(target_s * SR)
        end_samp = start_samp + len(raw)

        if end_samp > TOTAL_SAMPLES:
            print(f"[WARN] Line {idx} overflows {TOTAL_DURATION}s by {end_samp - TOTAL_SAMPLES} samples. Truncating.")
            raw = raw[:TOTAL_SAMPLES - start_samp]
            end_samp = TOTAL_SAMPLES

        master[start_samp:end_samp] += raw

        actual_start_f = int(target_s * FPS)
        actual_end_f = int((target_s + len(raw) / SR) * FPS)
        timing_report.append((idx, item["text"], target_s, target_s + len(raw) / SR, actual_start_f, actual_end_f, item["yellow"], item["red"]))
        print(f"[{target_s:05.2f}s - {target_s + len(raw)/SR:05.2f}s | F{actual_start_f:04d}-F{actual_end_f:04d}] {item['text']}")

    # Peak normalize to -1.5 dB
    peak = np.max(np.abs(master))
    if peak > 0:
        target_amp = 10 ** (-1.5 / 20)
        master = master * (target_amp / peak)

    # Convert to 16-bit PCM WAV
    out_pcm = (np.clip(master, -1.0, 1.0) * 32767).astype(np.int16)
    with wave.open(out_master, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(out_pcm.tobytes())

    print(f"\n[SUCCESS] Wrote master 42s voiceover: {out_master} ({TOTAL_DURATION}s, {TOTAL_FRAMES} frames @ 30fps)")

    print("\n--- TYPESCRIPT SENTENCES DATA ---")
    print("export const SENTENCES_42S: Sentence[] = [")
    for tr in timing_report:
        idx, text, s, e, sf, ef, yel, red = tr
        print(f"  [{s:.2f}, {e:.2f}, {repr(text)}, {repr(yel)}, {repr(red)}],")
    print("];")

if __name__ == "__main__":
    asyncio.run(main())
