import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { World } from "../part1/World";
import { PhoneInsert } from "../part1/ui/PhoneInsert";
import { PhotoShot } from "../part1/PhotoShot";
import { CaptionsOverlay } from "./CaptionsOverlay";
import { EndCard } from "../part1/EndCard";
import { SfxTrack } from "./SfxTrack";
import { ColorWash, DarkSweep, Fade, GlitchBurst, Grain, HitFlash, Vignette } from "../part1/fx/Overlays";

export type Part1ExperimentProps = { voiceover: boolean };

export const Part1Experiment: React.FC<Part1ExperimentProps> = ({ voiceover = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* LAYER 1 — the bedroom plate + Arjun (camera lives here) */}
      {f >= 140 && f < 1430 && <World />}
      {/* LAYER 2 — the old photograph */}
      <PhotoShot />
      <ColorWash />
      {/* LAYER 3 — phone inserts slide over the world */}
      <PhoneInsert />
      {/* LAYER 4 — cinematic finish */}
      {f < 1641 && <Vignette />}
      <GlitchBurst at={0} len={8} />
      <GlitchBurst at={81} len={6} power={0.8} />
      <GlitchBurst at={162} len={8} power={1.3} />
      <GlitchBurst at={333} len={5} power={0.6} />
      <GlitchBurst at={408} len={8} />
      <GlitchBurst at={462} len={5} />
      <GlitchBurst at={703} len={10} power={1.6} />
      <GlitchBurst at={801} len={5} power={0.7} />
      <GlitchBurst at={1128} len={6} />
      <GlitchBurst at={1239} len={9} power={1.3} />
      <GlitchBurst at={1314} len={9} power={1.3} />
      <GlitchBurst at={1425} len={5} />
      <HitFlash />
      <DarkSweep at={244} />
      <DarkSweep at={1120} />
      <Grain opacity={0.17} />
      {/* LAYER 5 — captions, end card, hard cut to black */}
      {f < 1641 && <CaptionsOverlay />}
      <Fade from={1637} to={1641} />
      <EndCard />
      <SfxTrack voiceover={voiceover} />
    </AbsoluteFill>
  );
};

