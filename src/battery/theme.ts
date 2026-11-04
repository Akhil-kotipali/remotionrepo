import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

const inter = loadInter('normal', { weights: ['500', '700', '900'], subsets: ['latin'] });
const mono = loadMono('normal', { weights: ['500', '700'], subsets: ['latin'] });

export const FONT = {
  sans: `${inter.fontFamily}, system-ui, sans-serif`,
  mono: `${mono.fontFamily}, ui-monospace, monospace`,
};

/** sys.log.explain palette */
export const C = {
  bg: '#F8FAFC',
  ink: '#0F172A',
  blue: '#2563EB',
  teal: '#14B8A6',
  purple: '#8B5CF6',
  red: '#EF4444',
  grid: '#E2E8F0',
  mute: '#64748B',
  white: '#FFFFFF',
};

export const W = 1080;
export const H = 1920;

/**
 * Optimized Layout (1080x1920):
 * Reduced top/bottom dead space so diagrams and screens can be large and high-impact.
 * Stage spans y: 140 -> 1140 (1000px tall).
 * Captions centered at y: 1240.
 */
export const STAGE = { top: 140, height: 1000, cx: W / 2, cy: 500 };
export const CAPTION_Y = 1240;
export const SAFE_RIGHT = 960;

/** Sound effects enabled from public/sfx */
export const FLAGS: { sfx: boolean; bed: boolean; aiClip: boolean } = {
  sfx: true,
  bed: false,
  aiClip: false,
};
