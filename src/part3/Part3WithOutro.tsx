import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {Part3} from "./Part3";
import {Outro, OUTRO_DURATION} from "./Outro";
import {DURATION as PART3_DURATION} from "./config";

export const PART3_WITH_OUTRO_DURATION = PART3_DURATION + OUTRO_DURATION; // 1620 + 120 = 1740 frames (58.0s)

export const Part3WithOutro: React.FC<{voiceover?: boolean}> = ({voiceover = true}) => {
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Sequence from={0} durationInFrames={PART3_DURATION}>
        <Part3 voiceover={voiceover} />
      </Sequence>
      <Sequence from={PART3_DURATION} durationInFrames={OUTRO_DURATION}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};

