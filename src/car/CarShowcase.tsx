import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { CarScene } from './CarScene';
import { CarHUD } from './CarHUD';
import { CarOutro } from './CarOutro';

interface SceneBlockProps {
  mode: 'turntable' | 'drive' | 'drift' | 'exploded' | 'cyberpunk';
  durationInFrames: number;
}

const SceneBlock: React.FC<SceneBlockProps> = ({ mode, durationInFrames }) => {
  const localFrame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      <CarScene
        mode={mode}
        localFrame={localFrame}
        durationInFrames={durationInFrames}
        width={width}
        height={height}
      />
      <CarHUD
        mode={mode}
        localFrame={localFrame}
        durationInFrames={durationInFrames}
      />
    </AbsoluteFill>
  );
};

export const CarShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0284C7 0%, #38BDF8 35%, #BAE6FD 70%, #E0F2FE 100%)' }}>
      {/* ──────────────── ACT 1: 360° Studio Turntable ──────────────── */}
      <Sequence from={0} durationInFrames={240} name="Variation 1: Turntable">
        <SceneBlock mode="turntable" durationInFrames={240} />
      </Sequence>

      {/* ──────────────── ACT 2: High-Speed Street Drive & Wheel Sync ──────────────── */}
      <Sequence from={240} durationInFrames={260} name="Variation 2: Drive">
        <SceneBlock mode="drive" durationInFrames={260} />
      </Sequence>

      {/* ──────────────── ACT 3: Power Drift & Active Counter-Steer ──────────────── */}
      <Sequence from={500} durationInFrames={260} name="Variation 3: Drift">
        <SceneBlock mode="drift" durationInFrames={260} />
      </Sequence>

      {/* ──────────────── ACT 4: Exploded Holographic Engineering Schematic ──────────────── */}
      <Sequence from={760} durationInFrames={260} name="Variation 4: Exploded">
        <SceneBlock mode="exploded" durationInFrames={260} />
      </Sequence>

      {/* ──────────────── ACT 5: Cyberpunk Launch & Night Chase ──────────────── */}
      <Sequence from={1020} durationInFrames={180} name="Variation 5: Cyberpunk">
        <SceneBlock mode="cyberpunk" durationInFrames={180} />
      </Sequence>

      {/* ──────────────── FINALE OUTRO: 5 Variations Recap ──────────────── */}
      <Sequence from={1200} durationInFrames={90} name="Outro Recap">
        <CarOutro />
      </Sequence>

      {/* ──────────────── SYNCHRONIZED SOUND DESIGN ──────────────── */}
      {/* Cinematic Transition Whooshes */}
      <Sequence from={236} durationInFrames={30}>
        <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.65} />
      </Sequence>
      <Sequence from={496} durationInFrames={30}>
        <Audio src={staticFile('sfx/slide.mp3')} volume={0.7} />
      </Sequence>
      <Sequence from={756} durationInFrames={30}>
        <Audio src={staticFile('sfx/power_on.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={1016} durationInFrames={30}>
        <Audio src={staticFile('sfx/whoosh_rev.mp3')} volume={0.7} />
      </Sequence>
      <Sequence from={1196} durationInFrames={30}>
        <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.7} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const CarShowcaseComposition: React.FC = () => {
  return (
    <Composition
      id="CarShowcase"
      component={CarShowcase}
      durationInFrames={1290}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

