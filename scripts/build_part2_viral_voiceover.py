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
TOTAL_FRAMES = int(TOTAL_DURATION * FPS) # 1710 frames
TOTAL_SAMPLES = int(TOTAL_DURATION * SR)

VOICE_NARRATOR = "en-US-BrianMultilingualNeural"
VOICE_MEERA = "en-US-AriaNeural"

SCHEDULE = [
    # HOOK (0.0s - 4.5s / frames 0 - 135)
    # Starts focused on the 2nd floor window with "CAN YOU SPOT THE 6TH PERSON?"
    {"text": "There were five people in this photograph.", "target_start": 0.15, "voice": VOICE_NARRATOR, "rate": "+4%", "pitch": "-2Hz", "reverb": False, "yellow": ["FIVE"], "red": []},
    {"text": "So who is standing in that window?", "target_start": 2.25, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-3Hz", "reverb": False, "yellow": ["WHO"], "red": ["WINDOW?"]},

    # ACT 1 — the living room (4.5s - 18.5s / frames 135 - 555)
    {"text": "The next morning, Arjun showed the photograph to his friends.", "target_start": 4.70, "voice": VOICE_NARRATOR, "rate": "+6%", "pitch": "-2Hz", "reverb": False, "yellow": ["PHOTOGRAPH"], "red": []},
    {"text": "It was taken the night Dev died.", "target_start": 8.60, "voice": VOICE_NARRATOR, "rate": "+2%", "pitch": "-2Hz", "reverb": False, "yellow": ["NIGHT", "DEV"], "red": ["DIED."]},
    {"text": "Five friends were visible.", "target_start": 10.70, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-2Hz", "reverb": False, "yellow": ["FIVE"], "red": []},
    {"text": "Meera had taken the picture.", "target_start": 12.30, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-2Hz", "reverb": False, "yellow": ["MEERA"], "red": []},
    {"text": "Everything looked normal.", "target_start": 14.00, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-2Hz", "reverb": False, "yellow": [], "red": []},
    {"text": "Until Arjun zoomed into the glass window behind them.", "target_start": 15.60, "voice": VOICE_NARRATOR, "rate": "+4%", "pitch": "-2Hz", "reverb": False, "yellow": ["GLASS", "WINDOW"], "red": []},

    # ACT 2 — the sixth figure (18.5s - 33.5s / frames 555 - 1005)
    {"text": "There was a sixth figure.", "target_start": 18.90, "voice": VOICE_NARRATOR, "rate": "-4%", "pitch": "-3Hz", "reverb": False, "yellow": ["SIXTH"], "red": ["SIXTH"]},
    {"text": "Standing behind the group.", "target_start": 20.60, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-2Hz", "reverb": False, "yellow": ["BEHIND"], "red": []},
    {"text": "Nobody remembered anyone else being there.", "target_start": 22.30, "voice": VOICE_NARRATOR, "rate": "+3%", "pitch": "-2Hz", "reverb": False, "yellow": ["NOBODY"], "red": []},
    
    # Dialogue segment (Rahul, Kabir, Nisha, Meera) - mature, chilling, cinematic
    {"text": "Rahul said it was probably a reflection.", "target_start": 24.60, "voice": VOICE_NARRATOR, "rate": "+2%", "pitch": "-2Hz", "reverb": False, "yellow": ["REFLECTION."], "red": []},
    {"text": "Kabir disagreed.", "target_start": 27.05, "voice": VOICE_NARRATOR, "rate": "-4%", "pitch": "-3Hz", "reverb": False, "yellow": ["DISAGREED."], "red": []},
    {"text": "Nisha went quiet.", "target_start": 28.35, "voice": VOICE_NARRATOR, "rate": "-5%", "pitch": "-4Hz", "reverb": False, "yellow": ["QUIET."], "red": []},
    {"text": "And Meera said something strange.", "target_start": 29.55, "voice": VOICE_NARRATOR, "rate": "-3%", "pitch": "-2Hz", "reverb": False, "yellow": ["STRANGE."], "red": []},
    {"text": "Why does that person look like Arjun?", "target_start": 31.40, "voice": VOICE_MEERA, "rate": "-6%", "pitch": "-2Hz", "reverb": True, "yellow": ["ARJUN?"], "red": ["ARJUN?"]},

    # ACT 3 — the analysis (33.5s - 43.0s)
    {"text": "Arjun looked closer.", "target_start": 33.60, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-2Hz", "reverb": False, "yellow": [], "red": []},
    {"text": "The figure was wearing the same jacket.", "target_start": 35.15, "voice": VOICE_NARRATOR, "rate": "+3%", "pitch": "-2Hz", "reverb": False, "yellow": ["JACKET."], "red": []},
    {"text": "Standing at the exact same angle.", "target_start": 37.25, "voice": VOICE_NARRATOR, "rate": "+2%", "pitch": "-2Hz", "reverb": False, "yellow": ["EXACT", "ANGLE."], "red": []},
    # 39.28s - 41.50s: Dedicated 2.22s Tension Silence while MATCH 100% / REFLECTION completes
    {"text": "It was his own reflection.", "target_start": 41.50, "voice": VOICE_NARRATOR, "rate": "-3%", "pitch": "-3Hz", "reverb": False, "yellow": ["REFLECTION."], "red": ["REFLECTION."]},

    # ACT 4 — the note (43.0s - 55.0s)
    {"text": "Then he turned the photograph over.", "target_start": 43.20, "voice": VOICE_NARRATOR, "rate": "+3%", "pitch": "-2Hz", "reverb": False, "yellow": ["TURNED"], "red": []},
    # 45.14s - 47.70s: Dedicated 2.56s Tension Silence while marker writes "IF WE FORGET, WATCH THE VIDEO."
    {"text": "IF WE FORGET, WATCH THE VIDEO.", "target_start": 47.70, "voice": VOICE_NARRATOR, "rate": "-6%", "pitch": "-4Hz", "reverb": True, "yellow": ["FORGET,", "VIDEO."], "red": ["FORGET,"]},
    {"text": "Arjun had written it.", "target_start": 50.30, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-3Hz", "reverb": False, "yellow": ["ARJUN"], "red": []},
    {"text": "And he had absolutely no memory of doing so.", "target_start": 51.70, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-3Hz", "reverb": False, "yellow": ["NO", "MEMORY"], "red": ["MEMORY"]},

    # Infinite Loop Whisper Hook (54.5s - 56.5s)
    {"text": "Look at the window again...", "target_start": 54.55, "voice": VOICE_NARRATOR, "rate": "-8%", "pitch": "-5Hz", "reverb": True, "yellow": ["WINDOW"], "red": ["AGAIN..."]},
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
    tmp_dir = "scripts/tmp_tts_part2_viral"
    os.makedirs(tmp_dir, exist_ok=True)
    master_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

    actual_sentences = []

    print("Generating Part 2 viral voiceover track with calibrated read-time silence...")
    last_end = 0.0
    for idx, item in enumerate(SCHEDULE):
        tmp_mp3 = os.path.join(tmp_dir, f"viral_line_{idx:02d}.mp3")
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
    out_wav = "public/audio/voiceover_part2.wav"
    out_standard = "public/audio/voiceover.wav"
    out_part2_local = "temp_part2/part2/public/audio/voiceover.wav"
    stereo = np.empty(len(master_track) * 2, dtype=np.int16)
    i16 = (np.clip(master_track, -1.0, 1.0) * 32767.0).astype(np.int16)
    stereo[0::2] = i16
    stereo[1::2] = i16

    for target in [out_wav, out_standard, out_part2_local]:
        os.makedirs(os.path.dirname(target), exist_ok=True)
        with wave.open(target, 'wb') as wf:
            wf.setnchannels(2)
            wf.setsampwidth(2)
            wf.setframerate(SR)
            wf.writeframes(stereo.tobytes())
    print("Master voiceover exported to", out_wav)

    # Write updated captions.ts
    captions_ts_content = f'''// =====================================================================
//  CAPTIONS — Waveform-aligned multi-character viral voiceover (57.0s)
//  [start, end, text, yellowWords?, redWords?]
// =====================================================================
export type Sentence = [number, number, string, string[]?, string[]?];

export const SENTENCES: Sentence[] = {repr(actual_sentences)};

export type Chunk = {{start: number; end: number; words: {{t: string; s: number; e: number; hl: 0 | 1 | 2}}[]}};

/** splits sentences into ≤4-word chunks and spreads time by letter count */
export function buildChunks(fps: number): Chunk[] {{
  const out: Chunk[] = [];
  for (const [a, b, text, yel = [], red = []] of SENTENCES) {{
    const words = text.split(/\\s+/);
    const groups: string[][] = [];
    let cur: string[] = [];
    for (const w of words) {{
      cur.push(w);
      if (cur.length >= 4 || /[.?!…,]$/.test(w)) {{
        groups.push(cur);
        cur = [];
      }}
    }}
    if (cur.length) groups.push(cur);
    if (groups.length > 1 && groups[groups.length - 1].length === 1 && groups[groups.length - 2].length < 4) {{
      const last = groups.pop()!;
      groups[groups.length - 1].push(...last);
    }}
    const total = words.join("").length;
    let t = a;
    for (const g of groups) {{
      const share = g.join("").length / total;
      const dur = (b - a) * share;
      let wt = t;
      const ws = g.map((w) => {{
        const wdur = dur * (w.length / g.join("").length);
        const up = w.toUpperCase();
        const o = {{t: w, s: Math.round(wt * fps), e: Math.round((wt + wdur) * fps), hl: (red.includes(up) ? 2 : yel.includes(up) ? 1 : 0) as 0 | 1 | 2}};
        wt += wdur;
        return o;
      }});
      out.push({{start: Math.round(t * fps), end: Math.round((t + dur) * fps) + 2, words: ws}});
      t += dur;
    }}
  }}
  return out;
}}
'''
    with open("src/part2/captions.ts", "w", encoding="utf-8") as f:
        f.write(captions_ts_content)
    print("Waveform-aligned captions written to src/part2/captions.ts")

if __name__ == "__main__":
    asyncio.run(main())
