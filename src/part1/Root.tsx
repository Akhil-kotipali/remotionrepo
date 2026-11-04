import React from "react";
import {Composition} from "remotion";
import {DURATION, FPS, H, W} from "./config";
import {Part1} from "./Part1";

export const Root: React.FC = () => (
  <Composition id="Part1" component={Part1} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{voiceover: true}} />
);
