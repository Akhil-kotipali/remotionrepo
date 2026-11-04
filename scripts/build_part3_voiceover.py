import asyncio
import os
import wave
import numpy as np
import miniaudio
from scipy.signal import butter, fftconvolve, lfilter
import edge_tts

SR = 44100
FPS = 30
TOTAL_DURATION = 54.0 # seconds
TOTAL_FRAMES = int(TOTAL_DURATION * FPS) # 1620 frames
TOTAL_SAMPLES = int(TOTAL_DURATION * SR)

VOICE_NARRATOR = "en-US-BrianMultilingualNeural"
VOICE_NISHA = "en-US-AriaNeural"
VOICE_ARJUN = "en-US-BrianMultilingualNeural"

SCHEDULE = [
    # HOOK (0.0s - 5.6s / frames 0 - 168)
    {"text": "Five friends.", "target_start": 0.15, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-2Hz", "reverb": False, "yellow": ["FIVE"], "red": []},
    {"text": "One photograph.", "target_start": 1.60, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-2Hz", "reverb": False, "yellow": ["ONE"], "red": []},
    {"text": "And four completely different memories.", "target_start": 3.10, "voice": VOICE_NARRATOR, "rate": "+2%", "pitch": "-2Hz", "reverb": False, "yellow": ["FOUR", "DIFFERENT"], "red": ["DIFFERENT"]},

    # ACT 1 — the memories (5.6s - 20.0s / frames 168 - 600)
    {"text": "Rahul remembered Dev leaving the house alone.", "target_start": 6.10, "voice": VOICE_NARRATOR, "rate": "+3%", "pitch": "-2Hz", "reverb": False, "yellow": ["ALONE."], "red": []},
    {"text": "Meera remembered Arjun following him.", "target_start": 8.80, "voice": VOICE_NARRATOR, "rate": "+6%", "pitch": "-2Hz", "reverb": False, "yellow": ["FOLLOWING"], "red": ["ARJUN"]},
    {"text": "Kabir remembered hearing an argument.", "target_start": 11.20, "voice": VOICE_NARRATOR, "rate": "+6%", "pitch": "-2Hz", "reverb": False, "yellow": ["ARGUMENT."], "red": []},
    {"text": "Nisha remembered someone shouting.", "target_start": 13.45, "voice": VOICE_NARRATOR, "rate": "+3%", "pitch": "-2Hz", "reverb": False, "yellow": ["SHOUTING."], "red": []},
    # Nisha's scream at 15.6s (frame 468)
    {"text": "Don't touch me!", "target_start": 15.60, "voice": VOICE_NISHA, "rate": "+14%", "pitch": "+3Hz", "reverb": True, "yellow": ["TOUCH"], "red": ["TOUCH", "ME!"]},
    {"text": "But nobody agreed on who said it.", "target_start": 17.30, "voice": VOICE_NARRATOR, "rate": "+2%", "pitch": "-2Hz", "reverb": False, "yellow": ["NOBODY"], "red": ["WHO"]},

    # ACT 2 — the question (20.6s - 31.5s / frames 618 - 945)
    {"text": "Arjun listened without speaking.", "target_start": 20.60, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-2Hz", "reverb": False, "yellow": ["WITHOUT"], "red": []},
    {"text": "Then he asked one question.", "target_start": 22.80, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-2Hz", "reverb": False, "yellow": [], "red": []},
    {"text": "Did anyone actually see Dev fall?", "target_start": 24.80, "voice": VOICE_ARJUN, "rate": "-4%", "pitch": "-4Hz", "reverb": True, "yellow": ["SEE"], "red": ["FALL?"]},
    {"text": "Silence.", "target_start": 28.20, "voice": VOICE_NARRATOR, "rate": "-6%", "pitch": "-4Hz", "reverb": False, "yellow": [], "red": []},
    {"text": "Nobody had.", "target_start": 30.10, "voice": VOICE_NARRATOR, "rate": "-4%", "pitch": "-3Hz", "reverb": False, "yellow": ["NOBODY"], "red": ["HAD."]},

    # ACT 3 — Meera remembers (32.2s - 43.2s / frames 966 - 1296)
    {"text": "Meera suddenly remembered something.", "target_start": 32.20, "voice": VOICE_NARRATOR, "rate": "-1%", "pitch": "-2Hz", "reverb": False, "yellow": ["SUDDENLY"], "red": []},
    {"text": "That night, Dev had placed his phone against the hallway wall.", "target_start": 34.40, "voice": VOICE_NARRATOR, "rate": "+6%", "pitch": "-2Hz", "reverb": False, "yellow": ["PHONE"], "red": []},
    {"text": "He wanted to record everyone together.", "target_start": 38.00, "voice": VOICE_NARRATOR, "rate": "+2%", "pitch": "-2Hz", "reverb": False, "yellow": ["RECORD"], "red": []},
    {"text": "She thought the video was still on his old phone.", "target_start": 40.35, "voice": VOICE_NARRATOR, "rate": "+2%", "pitch": "-2Hz", "reverb": False, "yellow": ["VIDEO", "OLD", "PHONE."], "red": []},

    # ACT 4 — the phone (43.8s - 51.0s / frames 1314 - 1530)
    {"text": "Arjun remembered that phone.", "target_start": 43.60, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-2Hz", "reverb": False, "yellow": ["PHONE."], "red": []},
    {"text": "It had survived the night.", "target_start": 45.60, "voice": VOICE_NARRATOR, "rate": "-3%", "pitch": "-2Hz", "reverb": False, "yellow": ["SURVIVED"], "red": []},
    {"text": "And it was still inside the abandoned house.", "target_start": 47.50, "voice": VOICE_NARRATOR, "rate": "-2%", "pitch": "-3Hz", "reverb": False, "yellow": ["INSIDE"], "red": ["ABANDONED"]},

    # Infinite Loop Whisper Hook (51.5s - 53.5s)
    {"text": "The recording is still waiting...", "target_start": 51.50, "voice": VOICE_NARRATOR, "rate": "-8%", "pitch": "-5Hz", "reverb": True, "yellow": ["RECORDING"], "red": ["WAITING..."]},
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
    tmp_dir = "scripts/tmp_tts_part3"
    os.makedirs(tmp_dir, exist_ok=True)
    master_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

    actual_sentences = []

    print("Generating Part 3 viral voiceover track...")
    last_end = 0.0
    for idx, item in enumerate(SCHEDULE):
        tmp_mp3 = os.path.join(tmp_dir, f"part3_line_{idx:02d}.mp3")
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
    out_wav = "public/audio/voiceover_part3.wav"
    os.makedirs(os.path.dirname(out_wav), exist_ok=True)
    stereo = np.empty(len(master_track) * 2, dtype=np.int16)
    i16 = (np.clip(master_track, -1.0, 1.0) * 32767.0).astype(np.int16)
    stereo[0::2] = i16
    stereo[1::2] = i16

    with wave.open(out_wav, 'wb') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(stereo.tobytes())
    print("Master voiceover exported to", out_wav)

    # Write updated captions.ts
    captions_ts_content = f'''// =====================================================================
//  CAPTIONS — Waveform-aligned multi-character viral voiceover (54.0s)
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
    with open("src/part3/captions.ts", "w", encoding="utf-8") as f:
        f.write(captions_ts_content)
    print("Waveform-aligned captions written to src/part3/captions.ts")

if __name__ == "__main__":
    asyncio.run(main())
