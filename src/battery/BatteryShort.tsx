import React from 'react';
import { AbsoluteFill, Audio, Composition, Sequence, staticFile, useCurrentFrame } from 'remotion';
import type { CalculateMetadataFunction } from 'remotion';
import { C, FLAGS, H, W } from './theme';
import { FPS, TAIL, VOICE, Word, loadVoice, makeAnchors } from './timing';
import { Grid, Watermark, ramp } from './parts';
import { Scene1Hook, Scene2Twist, Scene3Chip } from './Scenes1to3';
import { Scene4Tank } from './Scene4Tank';
import { Scene5Proof, Scene6Loop } from './Scenes5to6';
import { Captions, Sfx, buildCues } from './CaptionsAndSfx';

export type BatteryShortProps = { words: Word[]; total: number };

/** 8-frame fade/slide for every scene except Scene 1 (Scene 1 must be static at frame 0 for the loop). */
const SceneIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const p = ramp(f, [[0, 0], [8, 1]]);
  return <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>{children}</AbsoluteFill>;
};

export const BatteryShort: React.FC<BatteryShortProps> = ({ words, total }) => {
  const f = useCurrentFrame();
  const a = React.useMemo(() => makeAnchors(words, total), [words, total]);
  const cues = React.useMemo(() => buildCues(a), [a]);

  const seg = (from: number, to: number) => ({ from, durationInFrames: Math.max(1, to - from) });

  // Critical: Remove channel watermark during Scene 1 (Opening Hook) so it never overlaps the hook question
  const watermarkOpacity = ramp(f, [[a.s2 - 2, 0], [a.s2 + 8, 1]]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Grid />
      <Watermark opacity={watermarkOpacity} />

      {/* scenes: each starts on a spoken phrase */}
      <Sequence {...seg(a.s1, a.s2)} name="1 Hook">
        <Scene1Hook camera={a.camera - a.s1} die={a.dies - a.s1} />
      </Sequence>
      <Sequence {...seg(a.s2, a.s3)} name="2 Twist">
        <SceneIn>
          <Scene2Twist powerOn={a.powerOn - a.s2} empty={a.empty - a.s2} />
        </SceneIn>
      </Sequence>
      <Sequence {...seg(a.s3, a.s4)} name="3 Chip">
        <SceneIn>
          <Scene3Chip estimate={a.estimate - a.s3} />
        </SceneIn>
      </Sequence>
      <Sequence {...seg(a.s4, a.s5)} name="4 Water tank">
        <SceneIn>
          <Scene4Tank
            b={{
              water: a.water - a.s4,
              gauge: a.gauge - a.s4,
              heavy: a.heavy - a.s4,
              pipe: a.pipe - a.s4,
              drop: a.drop - a.s4,
              cross: a.cross - a.s4,
              off: a.off - a.s4,
            }}
          />
        </SceneIn>
      </Sequence>
      <Sequence {...seg(a.s5, a.s6)} name="5 Proof">
        <SceneIn>
          <Scene5Proof minus={a.minus - a.s5} shown={a.shown - a.s5} />
        </SceneIn>
      </Sequence>
      <Sequence {...seg(a.s6, total)} name="6 Takeaway + loop">
        <SceneIn>
          <Scene6Loop energy={a.energy - a.s6} pressure={a.pressure - a.s6} loop={a.loop - a.s6} len={total - a.s6} />
        </SceneIn>
      </Sequence>

      <Captions words={words} hideFrom={total - 10} />

      {/* audio */}
      <Audio src={staticFile(VOICE.mp3)} />
      {FLAGS.bed && <Audio src={staticFile('audio/bed.mp3')} volume={0.06} loop />}
      <Sfx cues={cues} />
    </AbsoluteFill>
  );
};

const calc: CalculateMetadataFunction<BatteryShortProps> = async () => {
  const v = await loadVoice(FPS);
  const total = v.durationInFrames + TAIL;
  return { durationInFrames: total, props: { words: v.words, total } };
};

/** Drop <BatteryShortComposition /> inside the fragment in Root.tsx */
export const BatteryShortComposition: React.FC = () => (
  <Composition
    id="BatteryShort"
    component={BatteryShort}
    width={W}
    height={H}
    fps={FPS}
    durationInFrames={1380}
    defaultProps={{ words: [] as Word[], total: 1380 }}
    calculateMetadata={calc}
  />
);
