import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { BatteryShortComposition } from "./battery/BatteryShort";
import { CarShowcaseComposition } from "./car/CarShowcase";
import { CinematicShowcaseComposition } from "./characters/CinematicShowcase";
import {
  StickRedComposition,
  StickYellowComposition,
  StickOrangeComposition,
  StickGreenComposition,
  StickBlueComposition,
  StickLineupComposition,
  StickOnBackgroundComposition,
  SixFriendsLineupComposition,
  MeeraPhotoComposition,
} from "./stick";
import { TempleShortComposition } from "./temple";
import { Part1 } from "./part1/Part1";
import { Part1Experiment } from "./part1_experiment/Part1Experiment";
import { DURATION as PART1_DURATION, FPS as PART1_FPS, H as PART1_H, W as PART1_W } from "./part1/config";
import { Part2 } from "./part2/Part2";
import { Part2Loop, DURATION_LOOP as PART2_LOOP_DURATION } from "./part2/Part2Loop";
import { Outro, OUTRO_DURATION } from "./part2/Outro";
import { Part2WithOutro, PART2_WITH_OUTRO_DURATION } from "./part2/Part2WithOutro";
import { DURATION as PART2_DURATION, FPS as PART2_FPS, H as PART2_H, W as PART2_W } from "./part2/config";
import { Part1Instagram, PART1_INSTA_DURATION } from "./instagram/Part1Instagram";
import { Part2Instagram, PART2_INSTA_DURATION } from "./instagram/Part2Instagram";
import { Part3Instagram, PART3_INSTA_DURATION } from "./instagram/Part3Instagram";
import { Part3 } from "./part3/Part3";
import { Part3WithOutro, PART3_WITH_OUTRO_DURATION } from "./part3/Part3WithOutro";
import { DURATION as PART3_DURATION, FPS as PART3_FPS, H as PART3_H, W as PART3_W } from "./part3/config";
import { Part3ExperimentHook } from "./part3_experiment/Part3ExperimentHook";
import { Part3Viral } from "./part3_viral/Part3Viral";
import { DURATION_VIRAL } from "./part3_viral/captions";
import { Part3Master42s } from "./part3_master_42s/Part3Master42s";
import { DURATION_42S } from "./part3_master_42s/captions";
import { Thumb as Part3Thumb } from "./part3/thumb/Thumb";
import { UniversalEpisode } from "./engine/UniversalEpisode";
import { SAMPLE_ENGINE_EPISODE } from "./engine/sampleEpisodeConfig";
import { EpisodeConfig } from "./engine/types";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Dynamic Package-Driven Episode Composition (Driven by Claude ZIP Packages & calculateMetadata) */}
      <Composition
        id="PackageEpisode"
        component={(props: { config?: EpisodeConfig }) => (
          <UniversalEpisode config={props?.config || SAMPLE_ENGINE_EPISODE} />
        )}
        calculateMetadata={async ({ props, defaultProps }) => {
          const cfg =
            (props as { config?: EpisodeConfig })?.config ||
            (defaultProps as { config?: EpisodeConfig })?.config ||
            SAMPLE_ENGINE_EPISODE;
          const duration = cfg.durationInFrames || cfg.totalDurationInFrames || 900;
          return {
            durationInFrames: duration,
            fps: cfg.fps || 30,
            width: cfg.width || 1080,
            height: cfg.height || 1920,
            props: {
              config: cfg,
            },
          };
        }}
        defaultProps={{
          config: SAMPLE_ENGINE_EPISODE,
        }}
      />

      {/* Universal Modular Engine — 3D & Narrative Demonstration (30.0s) */}
      <Composition
        id="UniversalEngineShowcase"
        component={() => <UniversalEpisode config={SAMPLE_ENGINE_EPISODE} />}
        durationInFrames={SAMPLE_ENGINE_EPISODE.durationInFrames}
        fps={SAMPLE_ENGINE_EPISODE.fps}
        width={SAMPLE_ENGINE_EPISODE.width}
        height={SAMPLE_ENGINE_EPISODE.height}
      />

      {/* Everyone Remembers It Differently — Part 3 Master (42.0s Detailed Narrative & Growth Sweet Spot) */}
      <Composition
        id="Part3Master42s"
        component={Part3Master42s}
        durationInFrames={DURATION_42S}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Everyone Remembers It Differently — Part 3 High-CTR Thumbnail */}
      <Composition
        id="Part3Thumbnail"
        component={Part3Thumb}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Everyone Remembers It Differently — Part 3 (Viral Fast-Paced Cut - 26s, >100% Retention Loop) */}
      <Composition
        id="Part3Viral"
        component={Part3Viral}
        durationInFrames={DURATION_VIRAL}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Everyone Remembers It Differently — Part 3 (2.5D Overhaul Hook Experiment - 5s) */}
      <Composition
        id="Part3ExperimentHook25D"
        component={Part3ExperimentHook}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Everyone Remembers It Differently — Part 3 Releases */}
      <Composition
        id="Part3Instagram"
        component={Part3Instagram}
        durationInFrames={PART3_INSTA_DURATION}
        fps={PART3_FPS}
        width={PART3_W}
        height={PART3_H}
        defaultProps={{ voiceover: true }}
      />

      <Composition
        id="Part3WithOutro"
        component={Part3WithOutro}
        durationInFrames={PART3_WITH_OUTRO_DURATION}
        fps={PART3_FPS}
        width={PART3_W}
        height={PART3_H}
        defaultProps={{ voiceover: true }}
      />

      <Composition
        id="Part3"
        component={Part3}
        durationInFrames={PART3_DURATION}
        fps={PART3_FPS}
        width={PART3_W}
        height={PART3_H}
        defaultProps={{ voiceover: true }}
      />

      {/* Instagram Releases (Followers & Sends/Shares Optimized) */}
      <Composition
        id="Part1Instagram"
        component={Part1Instagram}
        durationInFrames={PART1_INSTA_DURATION}
        fps={PART1_FPS}
        width={PART1_W}
        height={PART1_H}
        defaultProps={{ voiceover: true }}
      />

      <Composition
        id="Part2Instagram"
        component={Part2Instagram}
        durationInFrames={PART2_INSTA_DURATION}
        fps={PART2_FPS}
        width={PART2_W}
        height={PART2_H}
        defaultProps={{ voiceover: true }}
      />

      {/* Everyone Remembers It Differently — Part 2 (Viral Loop Cut - 50s) */}
      <Composition
        id="Part2Loop"
        component={Part2Loop}
        durationInFrames={PART2_LOOP_DURATION}
        fps={PART2_FPS}
        width={PART2_W}
        height={PART2_H}
        defaultProps={{ voiceover: true }}
      />

      {/* Everyone Remembers It Differently — Part 2 (With Outro) */}
      <Composition
        id="Part2WithOutro"
        component={Part2WithOutro}
        durationInFrames={PART2_WITH_OUTRO_DURATION}
        fps={PART2_FPS}
        width={PART2_W}
        height={PART2_H}
        defaultProps={{ voiceover: true }}
      />

      {/* Everyone Remembers It Differently — Part 2 Master */}
      <Composition
        id="Part2"
        component={Part2}
        durationInFrames={PART2_DURATION}
        fps={PART2_FPS}
        width={PART2_W}
        height={PART2_H}
        defaultProps={{ voiceover: true }}
      />

      {/* Standalone Like & Subscribe Outro */}
      <Composition
        id="Outro"
        component={Outro}
        durationInFrames={OUTRO_DURATION}
        fps={PART2_FPS}
        width={PART2_W}
        height={PART2_H}
      />

      {/* Everyone Remembers It Differently — Part 1 (Original Master) */}
      <Composition
        id="Part1"
        component={Part1}
        durationInFrames={PART1_DURATION}
        fps={PART1_FPS}
        width={PART1_W}
        height={PART1_H}
        defaultProps={{ voiceover: true }}
      />

      {/* Part 1 Paced & Tension Experiment (Dedicated Read-Time & Suspense Breathers) */}
      <Composition
        id="Part1Experiment"
        component={Part1Experiment}
        durationInFrames={PART1_DURATION}
        fps={PART1_FPS}
        width={PART1_W}
        height={PART1_H}
        defaultProps={{ voiceover: true }}
      />

      {/* Temple Architecture Short */}
      <TempleShortComposition />

      {/* Meera Photo Scene Composition */}
      <MeeraPhotoComposition />

      {/* Six Friends Stick Figure Composition */}
      <SixFriendsLineupComposition />

      {/* Animation vs Animator Stick Figure Compositions */}
      <StickRedComposition />
      <StickYellowComposition />
      <StickOrangeComposition />
      <StickGreenComposition />
      <StickBlueComposition />
      <StickLineupComposition />
      <StickOnBackgroundComposition />

      {/* Existing Project Compositions */}
      <CinematicShowcaseComposition />
      <CarShowcaseComposition />
      <MyComposition />
      <BatteryShortComposition />
    </>
  );
};
