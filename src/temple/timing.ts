import { staticFile } from 'remotion';

export const FPS = 30;
export const VOICE = { json: 'audio/temple_voice.json', mp3: 'audio/temple_voice.mp3' };
export const TAIL = 30; // Extra frames at the end for the final beat to land

/** The ~155-word voiceover script. */
export const SCRIPT =
  "Modern engineers still cannot explain how a single eighty-ton granite block was lifted onto a temple roof one thousand years ago, without machinery. " +
  "This is the Brihadeeswarar Temple in Thanjavur, India. Built by Emperor Raja Raja Chola the First, in ten-oh-ten A.D. " +
  "The tower rises two hundred and sixteen feet. And at the very top sits the Kumbam, a single octagonal stone weighing eighty tons. " +
  "Here is the engineering problem. No crane existed. No iron framework. The nearest granite quarry was sixty kilometers away. " +
  "Modern structural analysis shows the load path required perfect weight distribution across twelve tiers of diminishing stone courses. " +
  "The prevailing theory: a six-kilometer-long earthen ramp, angled at just five degrees, used to drag the stone to the summit with elephants and human labor. " +
  "But here is what baffles engineers. The temple has zero foundation cracks after one thousand years. " +
  "The Kumbam stone sits without any mortar or binding agent. Only gravity holds it in place. " +
  "One thousand years. No modern adhesive. Just perfect geometry. " +
  "They did not have computers. They had mastery.";

export type Word = { text: string; start: number; end: number };
export type VoiceData = { words: Word[]; durationInFrames: number; fromFallback: boolean };

const tok = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const num = (v: unknown): number | undefined => (typeof v === 'number' && isFinite(v) ? v : undefined);

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

/** Evenly-timed fallback so the video works without a real voice file */
export const fallbackVoice = (fps: number): VoiceData => {
  const toks = SCRIPT.split(/\s+/).filter(Boolean);
  // ~65 seconds of narration
  const total = Math.round(65 * fps);
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
 * Scene anchors keyed to spoken phrases.
 * Each scene starts when a specific phrase is spoken.
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

  // Scene 1: HOOK – "Modern engineers still cannot explain..."
  const hook = at('modern engineers', 0, 0);
  const eighty = at('eighty-ton', 2.0, -2);
  const lifted = at('lifted onto', 3.2, -2);
  const machinery = at('without machinery', 5.4, 0);

  // Scene 2: THE TEMPLE – "This is the Brihadeeswarar Temple..."
  const s2 = at('this is the', 8.0, -4);
  const emperor = at('built by emperor', 10.6, -2);
  const tenTen = at('ten-oh-ten', 12.8, -2);

  // Scene 3: THE KUMBAM – "The tower rises..."
  const s3 = at('the tower rises', 14.8, -4);
  const twoSixteen = at('two hundred and sixteen', 15.8, -2);
  const kumbam = at('the kumbam', 18.0, -2);
  const octagonal = at('octagonal stone', 19.4, -2);

  // Scene 4: THE PROBLEM – "Here is the engineering problem..."
  const s4 = at('here is the engineering', 22.0, -4);
  const noCrane = at('no crane', 23.2, -2);
  const noIron = at('no iron', 24.2, -2);
  const quarry = at('sixty kilometers', 26.0, -2);

  // Scene 5: STRUCTURAL ANALYSIS – "Modern structural analysis..."
  const s5 = at('modern structural', 28.4, -4);
  const loadPath = at('load path', 29.8, -2);
  const twelve = at('twelve tiers', 31.4, -2);

  // Scene 6: THE RAMP THEORY – "The prevailing theory..."
  const s6 = at('the prevailing', 34.0, -4);
  const sixKm = at('six-kilometer', 35.4, -2);
  const fiveDeg = at('five degrees', 37.2, -2);
  const elephants = at('elephants', 39.0, -2);

  // Scene 7: WHAT BAFFLES – "But here is what baffles..."
  const s7 = at('but here is what', 42.0, -4);
  const zeroCracks = at('zero foundation', 43.6, -2);
  const noMortar = at('without any mortar', 46.4, -2);
  const gravity = at('only gravity', 48.4, -2);

  // Scene 8: FINALE – "One thousand years..."
  const s8 = at('one thousand years', 52.0, -4);
  const noAdhesive = at('no modern adhesive', 54.0, -2);
  const geometry = at('perfect geometry', 56.0, -2);
  const computers = at('did not have computers', 58.4, -4);
  const mastery = at('they had mastery', 61.0, -2);

  return {
    hook, eighty, lifted, machinery,
    s2, emperor, tenTen,
    s3, twoSixteen, kumbam, octagonal,
    s4, noCrane, noIron, quarry,
    s5, loadPath, twelve,
    s6, sixKm, fiveDeg, elephants,
    s7, zeroCracks, noMortar, gravity,
    s8, noAdhesive, geometry, computers, mastery,
    total,
  };
};
export type Anchors = ReturnType<typeof makeAnchors>;

