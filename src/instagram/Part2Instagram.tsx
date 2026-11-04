import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {Part2} from "../part2/Part2";
import {InstagramOutro, INSTA_OUTRO_DURATION} from "./InstagramOutro";
import {DURATION as PART2_DURATION} from "../part2/config";

export const PART2_INSTA_DURATION = PART2_DURATION + INSTA_OUTRO_DURATION; // 1710 + 120 = 1830 frames (61.0s)

export const Part2Instagram: React.FC<{voiceover?: boolean}> = ({voiceover = true}) => {
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Sequence from={0} durationInFrames={PART2_DURATION}>
        <Part2 voiceover={voiceover} />
      </Sequence>
      <Sequence from={PART2_DURATION} durationInFrames={INSTA_OUTRO_DURATION}>
        <InstagramOutro part={2} />
      </Sequence>
    </AbsoluteFill>
  );
};

