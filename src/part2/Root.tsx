import React from "react";
import {Composition} from "remotion";
import {DURATION, FPS, H, W} from "./config";
import {Part2} from "./Part2";

export const Root: React.FC = () => (
  <Composition id="Part2" component={Part2} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{voiceover: true}} />
);
