import asyncio
import os
import wave
import numpy as np
import miniaudio
from scipy.signal import butter, sosfilt, fftconvolve, lfilter
import edge_tts

SR = 44100
FPS = 30
TOTAL_DURATION = 57.0 # seconds
TOTAL_FRAMES = int(TOTAL_DURATION * FPS) # 1710 frames
TOTAL_SAMPLES = int(TOTAL_DURATION * SR)

VOICE = "en-US-BrianMultilingualNeural"

# Carefully timed schedule ensuring zero overlaps and exact match to the master cut points:
SCHEDULE = [
    # COLD OPEN (0.0s - 5.4s / frames 0 - 162)
    {"text": "What if your dead friend suddenly messaged you…", "target_start": 0.20, "rate": "+4%", "pitch": "-2Hz", "reverb": False},
    {"text": "and the message was something only you could understand?", "target_start": 2.65, "rate": "+3%", "pitch": "-2Hz", "reverb": False},

    # ACT 1: Bedroom & Restore (5.4s - 17.4s / frames 162 - 522)
    {"text": "At 2:17 in the morning, Arjun was alone in his bedroom.", "target_start": 5.60, "rate": "+12%", "pitch": "-2Hz", "reverb": False},
    {"text": "His phone was restoring an old backup.", "target_start": 8.80, "rate": "+4%", "pitch": "-2Hz", "reverb": False},
    {"text": "Then a conversation appeared.", "target_start": 11.20, "rate": "+2%", "pitch": "-2Hz", "reverb": False},
    {"text": "The sender?", "target_start": 13.00, "rate": "-4%", "pitch": "-2Hz", "reverb": False},
    {"text": "Dev.", "target_start": 13.75, "rate": "-6%", "pitch": "-3Hz", "reverb": False},
    {"text": "His best friend.", "target_start": 14.35, "rate": "-2%", "pitch": "-2Hz", "reverb": False},
    {"text": "Who had died exactly one year ago.", "target_start": 15.45, "rate": "-2%", "pitch": "-3Hz", "reverb": False},

    # ACT 2: Chat & First Message (17.4s - 31.0s / frames 522 - 930)
    {"text": "Arjun opened the conversation.", "target_start": 17.95, "rate": "+3%", "pitch": "-2Hz", "reverb": False},
    {"text": "There was one recovered message.", "target_start": 19.85, "rate": "+2%", "pitch": "-2Hz", "reverb": False},
    {"text": "YOU SAID YOU WOULDN'T TELL THEM.", "target_start": 21.75, "rate": "-5%", "pitch": "-4Hz", "reverb": True},
    {"text": "His hands went cold.", "target_start": 23.80, "rate": "-2%", "pitch": "-3Hz", "reverb": False},
    {"text": "He stared at the screen.", "target_start": 25.10, "rate": "-2%", "pitch": "-2Hz", "reverb": False},
    {"text": "Then another old message appeared.", "target_start": 26.75, "rate": "+3%", "pitch": "-2Hz", "reverb": False},
    {"text": "Do you remember what happened at the house?", "target_start": 28.70, "rate": "-4%", "pitch": "-3Hz", "reverb": True},

    # ACT 3: Close chat, walk, date reveal (31.0s - 43.5s / frames 930 - 1305)
    {"text": "Arjun immediately closed the conversation.", "target_start": 31.20, "rate": "+5%", "pitch": "-2Hz", "reverb": False},
    {"text": "He told himself it was just an old backup.", "target_start": 33.70, "rate": "+4%", "pitch": "-2Hz", "reverb": False},
    {"text": "A glitch.", "target_start": 35.85, "rate": "-4%", "pitch": "-3Hz", "reverb": False},
    {"text": "Nothing more.", "target_start": 36.65, "rate": "-4%", "pitch": "-3Hz", "reverb": False},
    {"text": "But then he noticed something.", "target_start": 37.65, "rate": "+2%", "pitch": "-2Hz", "reverb": False},
    {"text": "The conversation wasn't from today.", "target_start": 39.30, "rate": "+3%", "pitch": "-2Hz", "reverb": False},
    {"text": "It was from the night Dev died.", "target_start": 41.35, "rate": "-2%", "pitch": "-3Hz", "reverb": False},

    # ACT 4: Photograph & Climax (43.5s - 55.0s / frames 1305 - 1650)
    {"text": "Arjun opened the old conversation again.", "target_start": 43.80, "rate": "+4%", "pitch": "-2Hz", "reverb": False},
    {"text": "There was a photograph attached.", "target_start": 46.00, "rate": "+2%", "pitch": "-2Hz", "reverb": False},
    {"text": "Five friends.", "target_start": 47.60, "rate": "-4%", "pitch": "-2Hz", "reverb": False},
    {"text": "Standing outside the abandoned house.", "target_start": 48.65, "rate": "+3%", "pitch": "-2Hz", "reverb": False},
    {"text": "He zoomed in.", "target_start": 50.85, "rate": "-4%", "pitch": "-2Hz", "reverb": False},
    {"text": "And whispered…", "target_start": 51.80, "rate": "-6%", "pitch": "-3Hz", "reverb": False},
    {"text": "Why is everyone looking at me?", "target_start": 52.85, "rate": "-8%", "pitch": "-4Hz", "reverb": True},
]

def add_reverb(x, rt=0.8, mix=0.25):
    n = int(SR * rt)
    ir = np.random.randn(n) * np.exp(-np.arange(n) / (SR * rt / 4.0))
    b, a = butter(2, 3500, btype='low', fs=SR)
    ir = lfilter(b, a, ir)
    w = fftconvolve(x, ir)[:len(x)]
    w = w / (np.max(np.abs(w)) + 1e-9) * np.max(np.abs(x))
    return x * (1 - mix) + w * mix

def waveform_trim_silence(samples, sr=SR, threshold_db=-45):
    amp = np.abs(samples)
    thresh = 10 ** (threshold_db / 20) * np.max(amp)
    window = int(sr * 0.01) # 10ms
    kernel = np.ones(window) / window
    env = np.convolve(amp, kernel, mode='same')
    active = np.where(env > thresh)[0]
    if len(active) == 0:
        return samples, 0, len(samples)
    start = max(0, active[0] - int(sr * 0.02))
    end = min(len(samples), active[-1] + int(sr * 0.05))
    return samples[start:end], start, end

async def generate_segment(text, voice, rate, pitch, tmp_file):
    comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    await comm.save(tmp_file)

async def main():
    tmp_dir = "scripts/tmp_tts_v2"
    os.makedirs(tmp_dir, exist_ok=True)
    master_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

    actual_timings = []

    print("Generating precisely timed voiceover and running waveform audio alignment...")
    for idx, item in enumerate(SCHEDULE):
        tmp_mp3 = os.path.join(tmp_dir, f"line_{idx:02d}.mp3")
        await generate_segment(item["text"], VOICE, item["rate"], item["pitch"], tmp_mp3)

        decoded = miniaudio.decode_file(tmp_mp3)
        raw = np.array(decoded.samples, dtype=np.float32) / 32768.0

        if decoded.nchannels == 2:
            raw = (raw[0::2] + raw[1::2]) * 0.5

        if decoded.sample_rate != SR:
            from scipy.signal import resample
            target_len = int(len(raw) * SR / decoded.sample_rate)
            raw = resample(raw, target_len)

        trimmed, _, _ = waveform_trim_silence(raw, sr=SR)

        if item.get("reverb"):
            trimmed = add_reverb(trimmed, rt=0.9, mix=0.28)

        target_s = item["target_start"]
        start_sample = int(target_s * SR)

        if idx > 0 and len(actual_timings) > 0:
            prev_end_s = actual_timings[-1][1]
            prev_end_sample = int(prev_end_s * SR)
            min_gap_samples = int(0.08 * SR)
            if start_sample < prev_end_sample + min_gap_samples:
                start_sample = prev_end_sample + min_gap_samples

        end_sample = start_sample + len(trimmed)
        if end_sample > TOTAL_SAMPLES:
            trimmed = trimmed[:TOTAL_SAMPLES - start_sample]
            end_sample = TOTAL_SAMPLES

        fade_len = int(SR * 0.005)
        if len(trimmed) > 2 * fade_len:
            trimmed[:fade_len] *= np.linspace(0, 1, fade_len)
            trimmed[-fade_len:] *= np.linspace(1, 0, fade_len)

        master_track[start_sample:start_sample + len(trimmed)] += trimmed

        actual_start_s = round(start_sample / SR, 2)
        actual_end_s = round(end_sample / SR, 2)
        actual_timings.append((actual_start_s, actual_end_s, item["text"]))
        print(f"Line {idx:02d}: [{actual_start_s:5.2f}s - {actual_end_s:5.2f}s] ({actual_end_s - actual_start_s:4.2f}s) {item['text']}")

    peak = np.max(np.abs(master_track)) + 1e-9
    master_track = master_track / peak * 0.72

    out_wav = "public/audio/voiceover.wav"
    os.makedirs(os.path.dirname(out_wav), exist_ok=True)
    out_int16 = (np.clip(master_track, -1.0, 1.0) * 32767).astype(np.int16)

    with wave.open(out_wav, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(out_int16.tobytes())

    print(f"\n Master voiceover saved to {out_wav} (57.0s, 44.1kHz 16-bit mono)")

    captions_ts_lines = [
        "// =====================================================================",
        "//  CAPTIONS — Waveform-aligned to master neural voiceover (57.0s)",
        "//  [start, end, text, yellowWords?, redWords?]",
        "// =====================================================================",
        "export type Sentence = [number, number, string, string[]?, string[]?];",
        "",
        "export const SENTENCES: Sentence[] = ["
    ]

    for s_start, s_end, text in actual_timings:
        yel = []
        red = []
        up = text.upper()
        if "DEAD" in up: yel.append("DEAD"); red.append("DEAD")
        if "ONLY" in up: yel.extend(["ONLY", "YOU"])
        if "2:17" in up: yel.extend(["2:17", "ALONE"])
        if "RESTORING" in up: yel.append("RESTORING")
        if "CONVERSATION" in up: yel.append("CONVERSATION")
        if "DEV" in up: yel.append("DEV.")
        if "DIED" in up: yel.append("DIED"); red.append("DIED")
        if "ONE" in up: yel.append("ONE")
        if "WOULDN'T" in up: yel.append("WOULDN'T"); red.extend(["WOULDN'T", "TELL"])
        if "COLD" in up: yel.append("COLD")
        if "ANOTHER" in up: yel.append("ANOTHER")
        if "HOUSE?" in up: yel.append("HOUSE?"); red.append("HOUSE?")
        if "NOTICED" in up: yel.append("NOTICED")
        if "TODAY" in up: yel.append("TODAY.")
        if "NIGHT" in up: yel.extend(["NIGHT", "DEV"]); red.append("DIED.")
        if "PHOTOGRAPH" in up: yel.append("PHOTOGRAPH")
        if "FIVE" in up: yel.append("FIVE")
        if "ABANDONED" in up: yel.append("ABANDONED")
        if "EVERYONE" in up: yel.append("EVERYONE"); red.append("ME?")

        yel_s = f", {yel}" if yel else ""
        red_s = f", {red}" if red else ""
        captions_ts_lines.append(f"  [{s_start:.2f}, {s_end:.2f}, \"{text}\"{yel_s}{red_s}],")

    captions_ts_lines.extend([
        "];",
        "",
        "export type Chunk = {start: number; end: number; words: {t: string; s: number; e: number; hl: 0 | 1 | 2}[]};",
        "",
        "/** splits sentences into ≤4-word chunks and spreads time by letter count */",
        "export function buildChunks(fps: number): Chunk[] {",
        "  const out: Chunk[] = [];",
        "  for (const [a, b, text, yel = [], red = []] of SENTENCES) {",
        "    const words = text.split(/\\s+/);",
        "    const groups: string[][] = [];",
        "    let cur: string[] = [];",
        "    for (const w of words) {",
        "      cur.push(w);",
        "      if (cur.length >= 4 || /[.?!…,]$/.test(w)) {",
        "        groups.push(cur);",
        "        cur = [];",
        "      }",
        "    }",
        "    if (cur.length) groups.push(cur);",
        "    if (groups.length > 1 && groups[groups.length - 1].length === 1 && groups[groups.length - 2].length < 4) {",
        "      const last = groups.pop()!;",
        "      groups[groups.length - 1].push(...last);",
        "    }",
        "    const total = words.join(\"\").length;",
        "    let t = a;",
        "    for (const g of groups) {",
        "      const share = g.join(\"\").length / total;",
        "      const dur = (b - a) * share;",
        "      let wt = t;",
        "      const ws = g.map((w) => {",
        "        const wdur = dur * (w.length / g.join(\"\").length);",
        "        const up = w.toUpperCase();",
        "        const o = {t: w, s: Math.round(wt * fps), e: Math.round((wt + wdur) * fps), hl: (red.includes(up) ? 2 : yel.includes(up) ? 1 : 0) as 0 | 1 | 2};",
        "        wt += wdur;",
        "        return o;",
        "      });",
        "      out.push({start: Math.round(t * fps), end: Math.round((t + dur) * fps) + 2, words: ws});",
        "      t += dur;",
        "    }",
        "  }",
        "  return out;",
        "}"
    ])

    with open("src/part1/captions.ts", "w", encoding="utf-8") as f:
        f.write("\n".join(captions_ts_lines) + "\n")

    print("✅ Updated src/part1/captions.ts with waveform timestamps")

if __name__ == "__main__":
    asyncio.run(main())
