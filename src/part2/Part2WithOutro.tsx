import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {Part2} from "./Part2";
import {Outro, OUTRO_DURATION} from "./Outro";
import {DURATION as PART2_DURATION} from "./config";

export const PART2_WITH_OUTRO_DURATION = PART2_DURATION + OUTRO_DURATION; // 1710 + 120 = 1830 frames (61.0s)

export const Part2WithOutro: React.FC<{voiceover?: boolean}> = ({voiceover = true}) => {
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Sequence from={0} durationInFrames={PART2_DURATION}>
        <Part2 voiceover={voiceover} />
      </Sequence>
      <Sequence from={PART2_DURATION} durationInFrames={OUTRO_DURATION}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};

