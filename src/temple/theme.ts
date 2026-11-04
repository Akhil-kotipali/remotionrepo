import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

const inter = loadInter('normal', { weights: ['500', '700', '900'], subsets: ['latin'] });
const mono = loadMono('normal', { weights: ['500', '700'], subsets: ['latin'] });

export const FONT = {
  sans: `${inter.fontFamily}, system-ui, sans-serif`,
  mono: `${mono.fontFamily}, ui-monospace, monospace`,
};

/** Ancient temple palette – warm golds, sandstone, dark backgrounds */
export const C = {
  bg: '#0C0A09',
  ink: '#FAFAF9',
  gold: '#D97706',
  amber: '#F59E0B',
  sandstone: '#D2B48C',
  rust: '#9A3412',
  teal: '#14B8A6',
  red: '#EF4444',
  grid: '#292524',
  mute: '#A8A29E',
  white: '#FFFFFF',
  dark: '#1C1917',
};

export const W = 1080;
export const H = 1920;

export const STAGE = { top: 140, height: 1100, cx: W / 2, cy: 550 };
export const CAPTION_Y = 1380;

