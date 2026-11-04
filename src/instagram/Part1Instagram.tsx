import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {Part1} from "../part1/Part1";
import {InstagramOutro, INSTA_OUTRO_DURATION} from "./InstagramOutro";
import {DURATION as PART1_DURATION} from "../part1/config";

export const PART1_INSTA_DURATION = PART1_DURATION + INSTA_OUTRO_DURATION; // 1710 + 120 = 1830 frames (61.0s)

export const Part1Instagram: React.FC<{voiceover?: boolean}> = ({voiceover = true}) => {
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Sequence from={0} durationInFrames={PART1_DURATION}>
        <Part1 voiceover={voiceover} />
      </Sequence>
      <Sequence from={PART1_DURATION} durationInFrames={INSTA_OUTRO_DURATION}>
        <InstagramOutro part={1} />
      </Sequence>
    </AbsoluteFill>
  );
};

