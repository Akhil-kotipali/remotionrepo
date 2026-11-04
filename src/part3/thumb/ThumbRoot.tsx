import React from "react";
import {Composition} from "remotion";
import {Thumb} from "./Thumb";

export const ThumbRoot: React.FC = () => <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1080} height={1920} />;
