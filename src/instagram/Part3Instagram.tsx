import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {Part3} from "../part3/Part3";
import {InstagramOutro, INSTA_OUTRO_DURATION} from "./InstagramOutro";
import {DURATION as PART3_DURATION} from "../part3/config";

export const PART3_INSTA_DURATION = PART3_DURATION + INSTA_OUTRO_DURATION; // 1620 + 120 = 1740 frames (58.0s)

export const Part3Instagram: React.FC<{voiceover?: boolean}> = ({voiceover = true}) => {
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Sequence from={0} durationInFrames={PART3_DURATION}>
        <Part3 voiceover={voiceover} />
      </Sequence>
      <Sequence from={PART3_DURATION} durationInFrames={INSTA_OUTRO_DURATION}>
        <InstagramOutro part={3} />
      </Sequence>
    </AbsoluteFill>
  );
};

