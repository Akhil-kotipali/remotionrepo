import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {Room} from "./Room";
import {PhotoLayer} from "./Photo";
import {CaptionsLayer} from "./CaptionsLayer";
import {EndCard} from "./EndCard";
import {SfxLayer} from "./SfxLayer";
import {MONO} from "./fonts";
import {E, kf} from "./math";
import {ColorWash, Fade, GlitchBurst, Grain, HitFlash, Vignette} from "./fx/Overlays";

export type Part2Props = {voiceover: boolean};

const TimeCard: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 150 || f > 255) return null;
  const o = kf(f, [[150, 0], [162, 1], [236, 1], [250, 0]]);
  const n = Math.floor(kf(f, [[156, 0], [190, 16]]));
  return (
    <div style={{position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", opacity: o, transform: `translateY(${(1 - kf(f, [[150, 0], [166, 1, E.out]])) * 18}px)`}}>
      <div style={{display: "inline-block", background: "rgba(6,10,18,0.78)", border: "2px solid rgba(143,180,255,0.7)", borderRadius: 12, padding: "14px 34px"}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: "#fff"}}>{"THE NEXT MORNING".slice(0, n)}</div>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: "#8fb4ff", marginTop: 6}}>08:40 AM</div>
      </div>
    </div>
  );
};

export const Part2: React.FC<Part2Props> = ({voiceover}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: "#000"}}>
      {/* LAYER 1 — living room plate + the five friends (camera lives here) */}
      {f >= 135 && f < 1641 && <Room />}
      {f >= 135 && f < 1641 && <TimeCard />}
      {/* LAYER 2 — the photograph (hook, insert, analysis, flip + handwriting) */}
      <PhotoLayer />
      <ColorWash />
      {/* LAYER 3 — cinematic finish */}
      {f < 1641 && <Vignette />}
      <GlitchBurst at={0} len={8} />
      <GlitchBurst at={92} len={6} power={0.8} />
      <GlitchBurst at={135} len={8} power={1.3} />
      <GlitchBurst at={255} len={5} power={0.6} />
      <GlitchBurst at={567} len={10} power={1.6} />
      <GlitchBurst at={666} len={6} />
      <GlitchBurst at={940} len={6} power={0.8} />
      <GlitchBurst at={1014} len={6} />
      <GlitchBurst at={1236} len={8} power={1.1} />
      <GlitchBurst at={1296} len={8} power={1.3} />
      <GlitchBurst at={1557} len={8} power={1.3} />
      <HitFlash />
      <Grain opacity={0.17} />
      {/* LAYER 4 — captions, hard cut to black, end card */}
      {f < 1641 && <CaptionsLayer />}
      <Fade from={1637} to={1641} />
      <EndCard />
      <SfxLayer voiceover={voiceover} />
    </AbsoluteFill>
  );
};
