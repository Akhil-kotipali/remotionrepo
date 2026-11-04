import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {RoomLoop} from "./RoomLoop";
import {PhotoLayerLoop} from "./PhotoLoop";
import {CaptionsLayerLoop} from "./CaptionsLayerLoop";
import {EndCardLoop} from "./EndCardLoop";
import {SfxLayerLoop} from "./SfxLayerLoop";
import {MONO} from "./fonts";
import {E, kf} from "./math";
import {ColorWash, Fade, GlitchBurst, Grain, HitFlash, Vignette} from "./fx/Overlays";

export const DURATION_LOOP = 1500; // 50.0s @ 30fps

const TimeCardLoop: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 140 || f > 240) return null;
  const o = kf(f, [[140, 0], [152, 1], [225, 1], [238, 0]]);
  const n = Math.floor(kf(f, [[146, 0], [180, 16]]));
  return (
    <div style={{position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", opacity: o, transform: `translateY(${(1 - kf(f, [[140, 0], [156, 1, E.out]])) * 18}px)`}}>
      <div style={{display: "inline-block", background: "rgba(6,10,18,0.78)", border: "2px solid rgba(143,180,255,0.7)", borderRadius: 12, padding: "14px 34px"}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: "#fff"}}>{"THE NEXT MORNING".slice(0, n)}</div>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: "#8fb4ff", marginTop: 6}}>08:40 AM</div>
      </div>
    </div>
  );
};

export const Part2Loop: React.FC<{voiceover?: boolean}> = ({voiceover = true}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: "#000"}}>
      {/* LAYER 1 — living room + the five friends */}
      {((f >= 135 && f < 240) || (f >= 365 && f < 765)) && <RoomLoop />}
      {f >= 135 && f < 240 && <TimeCardLoop />}
      {/* LAYER 2 — the photograph (hook, insert, align view, flip + marker) */}
      <PhotoLayerLoop />
      <ColorWash />
      {/* LAYER 3 — cinematic finish */}
      {f < 1440 && <Vignette />}
      <GlitchBurst at={0} len={8} />
      <GlitchBurst at={92} len={6} power={0.8} />
      <GlitchBurst at={135} len={8} power={1.3} />
      <GlitchBurst at={240} len={5} power={0.6} />
      <GlitchBurst at={765} len={8} power={1.1} />
      <GlitchBurst at={966} len={8} power={1.3} />
      <GlitchBurst at={1100} len={8} power={1.3} />
      <HitFlash />
      <Grain opacity={0.17} />
      {/* LAYER 4 — captions, loop endcard, audio */}
      {f < 1440 && <CaptionsLayerLoop />}
      <Fade from={1436} to={1440} />
      <EndCardLoop />
      <SfxLayerLoop voiceover={voiceover} />
    </AbsoluteFill>
  );
};

