import asyncio
import os
import wave
import numpy as np
import miniaudio
from scipy.signal import butter, fftconvolve, lfilter
import edge_tts

SR = 44100
FPS = 30
TOTAL_DURATION = 50.0 # 50.0 seconds = 1500 frames
TOTAL_FRAMES = int(TOTAL_DURATION * FPS)
TOTAL_SAMPLES = int(TOTAL_DURATION * SR)

VOICE_NARRATOR = "en-US-BrianMultilingualNeural"
VOICE_MEERA = "en-US-AriaNeural"
VOICE_KABIR = "en-US-AndrewMultilingualNeural"

SCHEDULE = [
    # HOOK (0.0s - 4.5s)
    {"text": "There were five people in this photograph.", "target_start": 0.15, "voice": VOICE_NARRATOR, "rate": "+4%", "pitch": "-2Hz", "reverb": False, "yellow": ["FIVE"], "red": []},
    {"text": "So who is standing in that window?", "target_start": 2.25, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-3Hz", "reverb": False, "yellow": ["WHO"], "red": ["WINDOW?"]},

    # ACT 1 — the living room (tightened, jumping duplicate zoom)
    {"text": "The next morning, Arjun showed the photo to his friends.", "target_start": 4.60, "voice": VOICE_NARRATOR, "rate": "+6%", "pitch": "-2Hz", "reverb": False, "yellow": ["PHOTO"], "red": []},
    {"text": "It was taken the night Dev died.", "target_start": 8.00, "voice": VOICE_NARRATOR, "rate": "+2%", "pitch": "-2Hz", "reverb": False, "yellow": ["NIGHT", "DEV"], "red": ["DIED."]},
    {"text": "Meera had taken the picture.", "target_start": 10.30, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-2Hz", "reverb": False, "yellow": ["MEERA"], "red": []},
    {"text": "Nobody remembered anyone else being there.", "target_start": 12.10, "voice": VOICE_NARRATOR, "rate": "+4%", "pitch": "-2Hz", "reverb": False, "yellow": ["NOBODY"], "red": []},

    # ACT 2 — the debate & reflection physics contradiction
    {"text": "Rahul said it was probably a reflection.", "target_start": 14.50, "voice": VOICE_NARRATOR, "rate": "+3%", "pitch": "-2Hz", "reverb": False, "yellow": ["REFLECTION."], "red": []},
    {"text": "That's impossible. He's facing forward.", "target_start": 17.00, "voice": VOICE_KABIR, "rate": "+2%", "pitch": "-2Hz", "reverb": False, "yellow": ["IMPOSSIBLE."], "red": ["IMPOSSIBLE."]},
    {"text": "Nisha went quiet.", "target_start": 19.60, "voice": VOICE_NARRATOR, "rate": "-5%", "pitch": "-4Hz", "reverb": False, "yellow": ["QUIET."], "red": []},
    {"text": "And Meera said something strange.", "target_start": 21.00, "voice": VOICE_NARRATOR, "rate": "-3%", "pitch": "-2Hz", "reverb": False, "yellow": ["STRANGE."], "red": []},
    {"text": "Why does that person look like Arjun?", "target_start": 23.00, "voice": VOICE_MEERA, "rate": "-6%", "pitch": "-2Hz", "reverb": True, "yellow": ["ARJUN?"], "red": ["ARJUN?"]},

    # ACT 3 — analysis & angle contradiction
    {"text": "Arjun looked closer.", "target_start": 25.50, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-2Hz", "reverb": False, "yellow": [], "red": []},
    {"text": "The figure was wearing the same jacket.", "target_start": 27.20, "voice": VOICE_NARRATOR, "rate": "+3%", "pitch": "-2Hz", "reverb": False, "yellow": ["JACKET."], "red": []},
    {"text": "Standing at the exact same angle.", "target_start": 29.50, "voice": VOICE_NARRATOR, "rate": "+2%", "pitch": "-2Hz", "reverb": False, "yellow": ["EXACT", "ANGLE."], "red": []},
    {"text": "It looked like his own reflection... but that was impossible.", "target_start": 32.20, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-3Hz", "reverb": False, "yellow": ["REFLECTION..."], "red": ["IMPOSSIBLE."]},

    # ACT 4 — the note
    {"text": "Then he turned the photograph over.", "target_start": 36.60, "voice": VOICE_NARRATOR, "rate": "+3%", "pitch": "-2Hz", "reverb": False, "yellow": ["TURNED"], "red": []},
    {"text": "IF WE FORGET, WATCH THE VIDEO.", "target_start": 40.50, "voice": VOICE_NARRATOR, "rate": "-6%", "pitch": "-4Hz", "reverb": True, "yellow": ["FORGET,", "VIDEO."], "red": ["FORGET,"]},
    {"text": "Arjun had written it.", "target_start": 43.50, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-3Hz", "reverb": False, "yellow": ["ARJUN"], "red": []},
    {"text": "And he had no memory of doing so.", "target_start": 45.00, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-3Hz", "reverb": False, "yellow": ["NO", "MEMORY"], "red": ["MEMORY"]},

    # Seamless loop whisper (hits on the final seconds right into 00:00)
    {"text": "Wait... look at the window again.", "target_start": 47.80, "voice": VOICE_NARRATOR, "rate": "-4%", "pitch": "-5Hz", "reverb": True, "yellow": ["WINDOW"], "red": ["AGAIN."]},
]

def add_reverb(x, rt=0.8, mix=0.25):
    n = int(SR * rt)
    ir = np.random.randn(n) * np.exp(-np.arange(n) / (SR * rt / 4.0))
    b, a = butter(2, 3500, btype='low', fs=SR)
    ir = lfilter(b, a, ir)
    w = fftconvolve(x, ir)[:len(x)]
    w = w / (np.max(np.abs(w)) + 1e-9) * np.max(np.abs(x))
    return x * (1 - mix) + w * mix

def waveform_trim_silence(samples, sr=SR, threshold_db=-42):
    amp = np.abs(samples)
    thresh = 10 ** (threshold_db / 20) * np.max(amp)
    window = int(sr * 0.01) # 10ms
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
    tmp_dir = "scripts/tmp_tts_part2_loop"
    os.makedirs(tmp_dir, exist_ok=True)
    master_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

    actual_sentences = []

    print("Generating Part 2 Viral Loop voiceover track (50.0s)...")
    last_end = 0.0
    for idx, item in enumerate(SCHEDULE):
        tmp_mp3 = os.path.join(tmp_dir, f"loop_line_{idx:02d}.mp3")
        await generate_segment(item["text"], item["voice"], item["rate"], item["pitch"], tmp_mp3)

        decoded = miniaudio.decode_file(tmp_mp3)
        raw = np.array(decoded.samples, dtype=np.float32) / 32768.0
        if decoded.nchannels == 2:
            raw = (raw[0::2] + raw[1::2]) * 0.5
        if decoded.sample_rate != SR:
            num_t = int(len(raw) * (SR / decoded.sample_rate))
            raw = np.interp(np.linspace(0, len(raw), num_t, endpoint=False), np.arange(len(raw)), raw)

        trimmed, _, _ = waveform_trim_silence(raw, SR, threshold_db=-42)

        if item["reverb"]:
            trimmed = add_reverb(trimmed, rt=0.85, mix=0.32)

        fi = min(len(trimmed), 150)
        fo = min(len(trimmed), 400)
        if fi > 0:
            trimmed[:fi] *= np.linspace(0, 1, fi)
        if fo > 0:
            trimmed[-fo:] *= np.linspace(1, 0, fo)

        start_samp = int(item["target_start"] * SR)
        dur_samp = len(trimmed)
        end_samp = min(TOTAL_SAMPLES, start_samp + dur_samp)

        actual_start = round(start_samp / SR, 2)
        actual_end = round(end_samp / SR, 2)
        gap = actual_start - last_end
        print(f"  Line {idx+1:02d} [{item['voice'].split('-')[2]}]: {actual_start:.2f}s -> {actual_end:.2f}s (dur {actual_end-actual_start:.2f}s, gap {gap:+.2f}s) | {item['text']}")

        if gap < 0:
            print(f"    WARNING: Overlap detected! gap = {gap:.2f}s")

        master_track[start_samp:end_samp] += trimmed[:(end_samp - start_samp)]
        actual_sentences.append([actual_start, actual_end, item["text"], item["yellow"], item["red"]])
        last_end = actual_end

    # Peak normalization
    peak = np.max(np.abs(master_track))
    if peak > 0:
        master_track = master_track / peak * 0.95

    # Export master stereo WAV
    out_wav = "public/audio/voiceover_part2_loop.wav"
    stereo = np.empty(len(master_track) * 2, dtype=np.int16)
    i16 = (np.clip(master_track, -1.0, 1.0) * 32767.0).astype(np.int16)
    stereo[0::2] = i16
    stereo[1::2] = i16

    with wave.open(out_wav, 'wb') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(stereo.tobytes())
    print("Master loop voiceover exported to", out_wav)

    # Write loop captions
    captions_ts_content = f'''// =====================================================================
//  CAPTIONS — Waveform-aligned Part 2 Viral Loop Cut (50.0s)
//  [start, end, text, yellowWords?, redWords?]
// =====================================================================
export type Sentence = [number, number, string, string[]?, string[]?];

export const SENTENCES_LOOP: Sentence[] = {repr(actual_sentences)};
'''
    with open("src/part2/captions_loop.ts", "w", encoding="utf-8") as f:
        f.write(captions_ts_content)
    print("Waveform-aligned captions written to src/part2/captions_loop.ts")

if __name__ == "__main__":
    asyncio.run(main())

