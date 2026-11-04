import React from "react";
import {Composition} from "remotion";
import {DURATION, FPS, H, W} from "./config";
import {Part3} from "./Part3";

export const Root: React.FC = () => (
  <Composition id="Part3" component={Part3} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{voiceover: true}} />
);
