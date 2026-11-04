import React from "react";
import {Audio, Sequence, staticFile} from "remotion";
import {VO_FILE, heartbeatFrames} from "./config";
import {CUES, bedVolume, heartVolume, roomVolume} from "./sfx";

export const SfxLayer: React.FC<{voiceover?: boolean}> = ({voiceover = true}) => (
  <>
    {voiceover && <Audio src={staticFile(VO_FILE)} volume={(fr) => (fr < 135 ? 1.3 : 1.15)} />}
    <Sequence from={0} durationInFrames={1641}>
      <Audio src={staticFile("audio/sfx/drone.wav")} volume={(fr) => bedVolume(fr) * 0.82} />
    </Sequence>
    <Sequence from={1641}>
      <Audio src={staticFile("audio/sfx/drone_end.wav")} volume={(fr) => bedVolume(fr + 1641) * 0.82} />
    </Sequence>
    <Sequence from={135} durationInFrames={1506}>
      <Audio src={staticFile("audio/sfx/morning_ambience.wav")} volume={(fr) => roomVolume(fr + 135) * 0.82} />
    </Sequence>
    {heartbeatFrames().map((hf, i) => (
      <Sequence key={`hb${i}`} from={hf} durationInFrames={30}>
        <Audio src={staticFile("audio/sfx/heartbeat.wav")} volume={0.55 * heartVolume(hf) * 0.82} />
      </Sequence>
    ))}
    {CUES.map(([fr, name, vol, rate], i) => (
      <Sequence key={`c${i}`} from={fr}>
        <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol * 0.82} playbackRate={rate ?? 1} />
      </Sequence>
    ))}
  </>
);

