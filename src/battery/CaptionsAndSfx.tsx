import React from 'react';
import { Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { C, CAPTION_Y, FLAGS, FONT } from './theme';
import { Anchors, Word } from './timing';
import { ramp } from './parts';

/* ───────── Captions ───────── */
const KEY = new Set(['battery', 'voltage', 'pressure', 'estimate', 'energy', 'thirty', 'dies', 'camera']);
const tok = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

type Chunk = { from: number; to: number; items: Word[] };

const makeChunks = (words: Word[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) out.push({ from: cur[0].start, to: cur[cur.length - 1].end, items: cur });
    cur = [];
  };
  words.forEach((w) => {
    cur.push(w);
    const chars = cur.map((x) => x.text).join(' ').length;
    if (cur.length >= 3 || chars >= 18 || /[.,!?…]$/.test(w.text)) flush();
  });
  flush();
  return out;
};

export const Captions: React.FC<{ words: Word[]; hideFrom: number }> = ({ words, hideFrom }) => {
  const f = useCurrentFrame();
  const chunks = React.useMemo(() => makeChunks(words), [words]);
  if (f >= hideFrom) return null;
  let idx = -1;
  for (let i = 0; i < chunks.length; i++) if (f >= chunks[i].from - 2) idx = i;
  if (idx < 0) return null;
  const c = chunks[idx];
  if (f > c.to + 14) return null;

  const text = c.items.map((w) => w.text.replace(/\.\.\.$/, '').replace(/[.,]$/, '').toUpperCase());
  const chars = text.join(' ').length;
  const size = Math.min(88, Math.floor(880 / (chars * 0.62)));
  const enter = ramp(f, [[c.from - 2, 0], [c.from + 4, 1]]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: 1080,
        top: CAPTION_Y - 70,
        height: 140,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 22,
        transform: `scale(${0.94 + 0.06 * enter})`,
        opacity: enter,
      }}
    >
      {c.items.map((w, i) => {
        const active = f >= w.start && (i === c.items.length - 1 || f < c.items[i + 1].start);
        const key = KEY.has(tok(w.text));
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: size,
              letterSpacing: -1.5,
              color: active ? (key ? C.purple : C.blue) : C.ink,
              textShadow: '0 0 14px #F8FAFC, 0 0 4px #F8FAFC',
              whiteSpace: 'nowrap',
            }}
          >
            {text[i]}
          </span>
        );
      })}
    </div>
  );
};

/* ───────── Sound effects ─────────
   Files live in public/sfx/<name>.mp3 (generate with generate_sfx.js). Flip FLAGS.sfx to true. */
export type Cue = { name: string; frame: number; volume: number };

export const buildCues = (a: Anchors): Cue[] => [
  { name: 'pop', frame: a.dies, volume: 0.55 },
  { name: 'power_on', frame: a.powerOn, volume: 0.4 },
  { name: 'whoosh', frame: a.s3, volume: 0.3 },
  { name: 'stamp', frame: a.estimate, volume: 0.45 },
  { name: 'water', frame: a.water, volume: 0.35 },
  { name: 'ping', frame: a.gauge, volume: 0.35 },
  { name: 'tick', frame: a.heavy, volume: 0.35 },
  { name: 'squeeze', frame: a.pipe, volume: 0.35 },
  { name: 'fall', frame: a.drop, volume: 0.3 },
  { name: 'alert', frame: a.cross, volume: 0.4 },
  { name: 'power_down', frame: a.off, volume: 0.5 },
  { name: 'slide', frame: a.s5, volume: 0.3 },
  { name: 'ice', frame: a.minus, volume: 0.35 },
  { name: 'tick', frame: a.shown, volume: 0.35 },
  { name: 'thud', frame: a.shown + 22, volume: 0.5 },
  { name: 'low_drop', frame: a.pressure, volume: 0.4 },
  { name: 'whoosh_rev', frame: a.loop, volume: 0.35 },
];

export const Sfx: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  if (!FLAGS.sfx) return null;
  return (
    <>
      {cues.map((c, i) => (
        <Sequence key={i} from={c.frame} layout="none">
          <Audio src={staticFile(`sfx/${c.name}.mp3`)} volume={c.volume} />
        </Sequence>
      ))}
    </>
  );
};
