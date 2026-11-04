import { staticFile } from 'remotion';

export const FPS = 30;
/** Rename if your generate_tts.js writes different file names */
export const VOICE = { json: 'audio/demo_voice.json', mp3: 'audio/demo_voice.mp3' };
/** Frames kept after the last word so the loop seam breathes */
export const TAIL = 8;

/** The locked 108-word voiceover. Paste this exact text into generate_tts.js. */
export const SCRIPT =
  "At twenty percent, you open the camera... and your phone dies. Let it rest or warm up, and it can turn back on. The battery was never empty. The percentage is only an estimate from a tiny chip. Think of your battery as a water tank. The water is charge. The pressure is voltage. Heavy apps pull hard, and cold or aging narrows the pipe, so the pressure drops. Below a minimum, your phone shuts off. University of Michigan researchers watched a phone die at minus fifteen degrees Celsius, still showing thirty percent. Your phone didn't run out of energy. It ran out of pressure. And that's why...";

export type Word = { text: string; start: number; end: number }; // frames
export type VoiceData = { words: Word[]; durationInFrames: number; fromFallback: boolean };

const tok = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const num = (v: unknown): number | undefined => (typeof v === 'number' && isFinite(v) ? v : undefined);

/**
 * Accepts the common shapes: { words: [{ word|text, startFrame|start_frame, endFrame|end_frame }] }
 * or seconds-based { start, end }. If your JSON differs, this is the ONE place to adapt.
 */
export const normalizeWords = (json: any, fps: number): Word[] => {
  const arr: any[] = Array.isArray(json) ? json : json?.words ?? json?.wordFrames ?? json?.word_frames ?? [];
  const out: Word[] = [];
  for (const w of arr) {
    const text = String(w?.word ?? w?.text ?? w?.w ?? '').trim();
    const sf = num(w?.startFrame) ?? num(w?.start_frame);
    const ef = num(w?.endFrame) ?? num(w?.end_frame);
    const ss = num(w?.start) ?? num(w?.start_time) ?? num(w?.startTime);
    const es = num(w?.end) ?? num(w?.end_time) ?? num(w?.endTime);
    const start = sf ?? (ss !== undefined ? Math.round(ss * fps) : undefined);
    const end = ef ?? (es !== undefined ? Math.round(es * fps) : undefined);
    if (!text || start === undefined) continue;
    out.push({ text, start, end: end ?? start + 6 });
  }
  return out;
};

/** Even-ish timing so the composition previews before you have a real voice file. */
export const fallbackVoice = (fps: number): VoiceData => {
  const toks = SCRIPT.split(/\s+/).filter(Boolean);
  const total = Math.round(44 * fps);
  const weights = toks.map((t) => t.length + 2);
  const sum = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  const words = toks.map((t, i) => {
    const start = Math.round((acc / sum) * total);
    acc += weights[i];
    return { text: t, start, end: Math.max(start + 2, Math.round((acc / sum) * total) - 2) };
  });
  return { words, durationInFrames: total, fromFallback: true };
};

export const loadVoice = async (fps: number = FPS): Promise<VoiceData> => {
  try {
    const res = await fetch(staticFile(VOICE.json));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const words = normalizeWords(json, fps);
    if (words.length < 20) throw new Error('word list too short');
    const last = words[words.length - 1].end;
    const dur = num(json?.durationInFrames) ?? last;
    return { words, durationInFrames: Math.max(dur, last), fromFallback: false };
  } catch {
    return fallbackVoice(fps);
  }
};

export const findPhrase = (words: Word[], phrase: string, from = 0): { start: number; index: number } | null => {
  const p = phrase.split(' ').map(tok).filter(Boolean);
  for (let i = from; i <= words.length - p.length; i++) {
    let ok = true;
    for (let j = 0; j < p.length; j++) {
      if (tok(words[i + j].text) !== p[j]) {
        ok = false;
        break;
      }
    }
    if (ok) return { start: words[i].start, index: i };
  }
  return null;
};

/**
 * Every scene start and every beat is the frame of a spoken phrase.
 * Calls MUST follow script order (the cursor only moves forward).
 * `fb` = fallback seconds if a phrase is not found; `offset` = frames (negative = visual leads the voice).
 */
export const makeAnchors = (words: Word[], total: number) => {
  let cursor = 0;
  let last = -1;
  const at = (phrase: string, fb: number, offset = 0): number => {
    const r = findPhrase(words, phrase, cursor);
    let f: number;
    if (r) {
      cursor = r.index + 1;
      f = r.start + offset;
    } else {
      f = Math.round(fb * FPS) + offset;
    }
    f = Math.max(f, last + 1, 0);
    last = f;
    return f;
  };

  const s1 = at('at twenty', 0, 0);
  const camera = at('open the camera', 1.4, -2);
  const dies = at('dies', 3.9, 0);
  const s2 = at('let it rest', 4.9, -4);
  const powerOn = at('turn back on', 8.6, -2);
  const empty = at('never empty', 10.2, 0);
  const s3 = at('the percentage is', 11.8, -4);
  const estimate = at('estimate', 13.4, -2);
  const s4 = at('think of your', 15.9, -4);
  const water = at('the water is', 18.4, -2);
  const gauge = at('the pressure is', 19.8, -2);
  const heavy = at('heavy apps', 21.6, -2);
  const pipe = at('cold or', 23.2, -2);
  const drop = at('so the pressure', 25.4, -2);
  const cross = at('below a minimum', 27.0, -2);
  const off = at('shuts off', 28.6, -2);
  const s5 = at('university of michigan', 30.6, -6);
  const minus = at('minus fifteen', 33.2, -2);
  const shown = at('still showing', 35.4, -2);
  const s6 = at('your phone didnt', 37.6, -4);
  const energy = at('out of energy', 39.2, -2);
  const pressure = at('out of pressure', 40.8, -2);
  const loop = at('and thats why', 42.6, -2);

  return {
    s1, camera, dies, s2, powerOn, empty, s3, estimate, s4, water, gauge, heavy, pipe, drop, cross, off,
    s5, minus, shown, s6, energy, pressure, loop, total,
  };
};
export type Anchors = ReturnType<typeof makeAnchors>;
