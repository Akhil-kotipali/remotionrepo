import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {Room} from "./Room";
import {MemoryLayer} from "./Memory";
import {Exterior} from "./Exterior";
import {HookLayer} from "./HookLayer";
import {Captions} from "./CaptionsLayer";
import {EndCard} from "./EndCard";
import {Sfx} from "./SfxLayer";
import {ColorWash, Fade, GlitchBurst, Grain, HitFlash, Vignette} from "./fx/Overlays";

export type Part3Props = {voiceover: boolean};

export const Part3: React.FC<Part3Props> = ({voiceover}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: "#000"}}>
      {/* LAYER 1 — living room + the five friends (camera follows whoever is remembering) */}
      {f < 1428 && <Room />}
      {/* LAYER 2 — memory panels, branching timeline, silence, the cracked phone */}
      {f < 1428 && <MemoryLayer />}
      {/* LAYER 3 — the abandoned house */}
      <Exterior />
      <ColorWash />
      {f < 1545 && <Vignette />}
      <GlitchBurst at={0} len={8} />
      <GlitchBurst at={93} len={6} power={0.7} />
      <GlitchBurst at={168} len={8} power={1.2} />
      <GlitchBurst at={468} len={10} power={1.7} />
      <GlitchBurst at={525} len={6} />
      <GlitchBurst at={618} len={6} />
      <GlitchBurst at={846} len={4} power={0.5} />
      <GlitchBurst at={900} len={6} power={0.9} />
      <GlitchBurst at={966} len={6} />
      <GlitchBurst at={1314} len={10} power={1.6} />
      <GlitchBurst at={1428} len={6} />
      <HitFlash />
      <Grain opacity={0.17} />
      {/* Psychological Hook Layer (0 - 95 frames) */}
      <HookLayer />
      {f < 1545 && <Captions />}
      <Fade from={1541} to={1545} />
      <EndCard />
      <Sfx voiceover={voiceover} />
    </AbsoluteFill>
  );
};
