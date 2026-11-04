import React from 'react';
import { AbsoluteFill, Audio, Composition, Sequence, staticFile, useCurrentFrame } from 'remotion';
import type { CalculateMetadataFunction } from 'remotion';
import { C, H, W } from './theme';
import { FPS, TAIL, VOICE, Word, loadVoice, makeAnchors } from './timing';
import { Grid, Watermark, ramp, Captions, Sfx, buildCues } from './parts';
import { Scene1Hook, Scene2Temple } from './Scenes1to2';
import { Scene3Kumbam, Scene4Problem } from './Scenes3to4';
import { Scene5Structure, Scene6Ramp } from './Scenes5to6';
import { Scene7Baffles, Scene8Finale } from './Scenes7to8';

export type TempleShortProps = { words: Word[]; total: number };

/** Scene transition: 8-frame fade/slide */
const SceneIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const p = ramp(f, [[0, 0], [8, 1]]);
  return <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>{children}</AbsoluteFill>;
};

export const TempleShort: React.FC<TempleShortProps> = ({ words, total }) => {
  const f = useCurrentFrame();
  const a = React.useMemo(() => makeAnchors(words, total), [words, total]);
  const cues = React.useMemo(() => buildCues(a), [a]);

  const seg = (from: number, to: number) => ({ from, durationInFrames: Math.max(1, to - from) });

  // Watermark fades in after hook
  const watermarkOpacity = ramp(f, [[a.s2 - 2, 0], [a.s2 + 8, 1]]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Grid />
      <Watermark opacity={watermarkOpacity} />

      {/* Scene 1: HOOK – Modern engineers cannot explain... */}
      <Sequence {...seg(a.hook, a.s2)} name="1 Hook">
        <Scene1Hook eighty={a.eighty - a.hook} lifted={a.lifted - a.hook} machinery={a.machinery - a.hook} />
      </Sequence>

      {/* Scene 2: TEMPLE IDENTITY – Brihadeeswarar Temple */}
      <Sequence {...seg(a.s2, a.s3)} name="2 Temple">
        <SceneIn>
          <Scene2Temple emperor={a.emperor - a.s2} tenTen={a.tenTen - a.s2} />
        </SceneIn>
      </Sequence>

      {/* Scene 3: THE KUMBAM – Tower height + 80-ton stone */}
      <Sequence {...seg(a.s3, a.s4)} name="3 Kumbam">
        <SceneIn>
          <Scene3Kumbam twoSixteen={a.twoSixteen - a.s3} kumbam={a.kumbam - a.s3} octagonal={a.octagonal - a.s3} />
        </SceneIn>
      </Sequence>

      {/* Scene 4: THE PROBLEM – No crane, no iron, 60km quarry */}
      <Sequence {...seg(a.s4, a.s5)} name="4 Problem">
        <SceneIn>
          <Scene4Problem noCrane={a.noCrane - a.s4} noIron={a.noIron - a.s4} quarry={a.quarry - a.s4} />
        </SceneIn>
      </Sequence>

      {/* Scene 5: STRUCTURAL ANALYSIS – Load path */}
      <Sequence {...seg(a.s5, a.s6)} name="5 Structure">
        <SceneIn>
          <Scene5Structure loadPath={a.loadPath - a.s5} twelve={a.twelve - a.s5} />
        </SceneIn>
      </Sequence>

      {/* Scene 6: RAMP THEORY – 6km earthen ramp */}
      <Sequence {...seg(a.s6, a.s7)} name="6 Ramp">
        <SceneIn>
          <Scene6Ramp sixKm={a.sixKm - a.s6} fiveDeg={a.fiveDeg - a.s6} elephants={a.elephants - a.s6} />
        </SceneIn>
      </Sequence>

      {/* Scene 7: WHAT BAFFLES – Zero cracks, no mortar */}
      <Sequence {...seg(a.s7, a.s8)} name="7 Baffles">
        <SceneIn>
          <Scene7Baffles zeroCracks={a.zeroCracks - a.s7} noMortar={a.noMortar - a.s7} gravity={a.gravity - a.s7} />
        </SceneIn>
      </Sequence>

      {/* Scene 8: FINALE – They had mastery */}
      <Sequence {...seg(a.s8, total)} name="8 Finale">
        <SceneIn>
          <Scene8Finale
            noAdhesive={a.noAdhesive - a.s8}
            geometry={a.geometry - a.s8}
            computers={a.computers - a.s8}
            mastery={a.mastery - a.s8}
            len={total - a.s8}
          />
        </SceneIn>
      </Sequence>

      <Captions words={words} hideFrom={total - 10} />

      {/* Audio */}
      <Audio src={staticFile(VOICE.mp3)} />
      <Sfx cues={cues} />
    </AbsoluteFill>
  );
};

const calc: CalculateMetadataFunction<TempleShortProps> = async () => {
  const v = await loadVoice(FPS);
  const total = v.durationInFrames + TAIL;
  return { durationInFrames: total, props: { words: v.words, total } };
};

export const TempleShortComposition: React.FC = () => (
  <Composition
    id="TempleShort"
    component={TempleShort}
    width={W}
    height={H}
    fps={FPS}
    durationInFrames={2010}
    defaultProps={{ words: [] as Word[], total: 2010 }}
    calculateMetadata={calc}
  />
);

