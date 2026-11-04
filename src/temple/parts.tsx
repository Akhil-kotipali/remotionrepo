import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useVideoConfig } from 'remotion';
import { C, FONT, H, STAGE, W, CAPTION_Y } from './theme';
import { Word } from './timing';

/** Piecewise ramp with cubic easing */
export const ramp = (f: number, pts: [number, number][]): number => {
  const xs: number[] = [];
  const ys: number[] = [];
  pts.forEach(([x, y]) => {
    xs.push(xs.length ? Math.max(x, xs[xs.length - 1] + 1) : x);
    ys.push(y);
  });
  return interpolate(f, xs, ys, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
};

export const usePop = (frame: number, start: number, damping = 14): number => {
  const { fps } = useVideoConfig();
  return spring({ frame: Math.max(0, frame - start), fps, config: { damping, stiffness: 140, mass: 0.7 } });
};

/* ─── Background Grid (dark sandstone) ─── */
export const Grid: React.FC = () => (
  <AbsoluteFill>
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <pattern id="tg" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke={C.grid} strokeWidth="1" />
          <circle cx="60" cy="60" r="1" fill="#44403C" />
        </pattern>
        <radialGradient id="tfade" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor={C.bg} stopOpacity="1" />
          <stop offset="100%" stopColor={C.bg} stopOpacity="0.5" />
        </radialGradient>
        <mask id="tm">
          <rect width={W} height={H} fill="url(#tfade)" />
        </mask>
      </defs>
      <rect width={W} height={H} fill="url(#tg)" mask="url(#tm)" opacity={0.7} />
    </svg>
  </AbsoluteFill>
);

/* ─── Channel Watermark ─── */
export const Watermark: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  if (opacity <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: 40, top: 44, display: 'flex', alignItems: 'center', gap: 12, zIndex: 50, opacity }}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 14px rgba(217,119,6,0.35)',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      </div>
      <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 28, color: C.ink, letterSpacing: -0.5 }}>
        sys.log<span style={{ color: C.gold }}>.explain</span>
      </div>
    </div>
  );
};

/* ─── Hook Question Banner ─── */
export const HookQuestion: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div
    style={{
      position: 'absolute',
      top: 44,
      left: 0,
      width: W,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 40,
      opacity,
      pointerEvents: 'none',
    }}
  >
    <div
      style={{
        background: 'rgba(12, 10, 9, 0.95)',
        backdropFilter: 'blur(16px)',
        padding: '16px 32px',
        borderRadius: 20,
        border: '2px solid rgba(217, 119, 6, 0.6)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: FONT.sans,
          fontWeight: 900,
          fontSize: 36,
          letterSpacing: -0.5,
          color: '#FFFFFF',
          textTransform: 'uppercase',
          lineHeight: 1.2,
        }}
      >
        HOW WAS AN <span style={{ color: '#F59E0B' }}>80-TON STONE</span>
        <br />
        LIFTED <span style={{ color: '#EF4444' }}>WITHOUT MACHINERY?</span>
      </div>
    </div>
  </div>
);

/* ─── Stage Container ─── */
export const Stage: React.FC<{ children: React.ReactNode; opacity?: number; dy?: number }> = ({
  children,
  opacity = 1,
  dy = 0,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: STAGE.top,
      width: W,
      height: STAGE.height,
      opacity,
      transform: `translateY(${dy}px)`,
    }}
  >
    {children}
  </div>
);

/* ─── Pill Label ─── */
export const Pill: React.FC<{
  text: string;
  color: string;
  x: number;
  y: number;
  p?: number;
  solid?: boolean;
  size?: number;
  icon?: string;
}> = ({ text, color, x, y, p = 1, solid = true, size = 28, icon }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`,
      opacity: Math.min(1, p * 1.6),
      padding: '12px 28px',
      borderRadius: 999,
      background: solid ? `linear-gradient(135deg, ${color} 0%, ${color}EE 100%)` : 'rgba(28,25,23,0.9)',
      border: `2px solid ${solid ? 'rgba(255,255,255,0.3)' : color}`,
      color: solid ? '#FFFFFF' : color,
      fontFamily: FONT.mono,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 1.5,
      whiteSpace: 'nowrap',
      boxShadow: solid
        ? `0 12px 30px -4px ${color}66, 0 4px 10px rgba(0,0,0,0.2)`
        : '0 10px 20px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      zIndex: 25,
    }}
  >
    {icon && <span style={{ fontSize: size * 1.15 }}>{icon}</span>}
    {text}
  </div>
);

/* ─── Captions ─── */
const KEY = new Set(['eighty', 'kumbam', 'granite', 'crane', 'ramp', 'gravity', 'mortar', 'mastery', 'geometry', 'elephants', 'machinery', 'zero']);
const ctok = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
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
  const frame = require('remotion').useCurrentFrame();
  const chunks = React.useMemo(() => makeChunks(words), [words]);
  if (frame >= hideFrom) return null;
  let idx = -1;
  for (let i = 0; i < chunks.length; i++) if (frame >= chunks[i].from - 2) idx = i;
  if (idx < 0) return null;
  const c = chunks[idx];
  if (frame > c.to + 14) return null;

  const text = c.items.map((w) => w.text.replace(/\.\.\.$/,'').replace(/[.,]$/,'').toUpperCase());
  const chars = text.join(' ').length;
  const size = Math.min(80, Math.floor(860 / (chars * 0.6)));
  const enter = ramp(frame, [[c.from - 2, 0], [c.from + 4, 1]]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: W,
        top: CAPTION_Y - 60,
        height: 140,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 18,
        transform: `scale(${0.94 + 0.06 * enter})`,
        opacity: enter,
      }}
    >
      {c.items.map((w, i) => {
        const active = frame >= w.start && (i === c.items.length - 1 || frame < c.items[i + 1].start);
        const key = KEY.has(ctok(w.text));
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: size,
              letterSpacing: -1,
              color: active ? (key ? C.amber : C.gold) : C.ink,
              textShadow: `0 0 12px ${C.bg}, 0 0 4px ${C.bg}`,
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

/* ─── SFX System ─── */
export type Cue = { name: string; frame: number; volume: number };

export const buildCues = (a: any): Cue[] => [
  { name: 'thud', frame: a.hook, volume: 0.5 },
  { name: 'whoosh', frame: a.s2, volume: 0.35 },
  { name: 'stamp', frame: a.tenTen, volume: 0.45 },
  { name: 'slide', frame: a.s3, volume: 0.35 },
  { name: 'thud', frame: a.kumbam, volume: 0.6 },
  { name: 'alert', frame: a.s4, volume: 0.4 },
  { name: 'pop', frame: a.noCrane, volume: 0.3 },
  { name: 'pop', frame: a.noIron, volume: 0.3 },
  { name: 'whoosh', frame: a.s5, volume: 0.35 },
  { name: 'tick', frame: a.loadPath, volume: 0.35 },
  { name: 'slide', frame: a.s6, volume: 0.35 },
  { name: 'stamp', frame: a.elephants, volume: 0.45 },
  { name: 'whoosh_rev', frame: a.s7, volume: 0.4 },
  { name: 'ping', frame: a.zeroCracks, volume: 0.45 },
  { name: 'thud', frame: a.gravity, volume: 0.5 },
  { name: 'low_drop', frame: a.s8, volume: 0.4 },
  { name: 'stamp', frame: a.geometry, volume: 0.5 },
  { name: 'power_on', frame: a.mastery, volume: 0.5 },
];

export const Sfx: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  const { Sequence, Audio, staticFile: sf } = require('remotion');
  return (
    <>
      {cues.map((c, i) => (
        <Sequence key={i} from={c.frame} layout="none">
          <Audio src={sf(`sfx/${c.name}.mp3`)} volume={c.volume} />
        </Sequence>
      ))}
    </>
  );
};
