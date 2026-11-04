import React from "react";
import {Audio, Sequence, staticFile} from "remotion";
import {VO_FILE, heartbeatFrames} from "./config";
import {CUES, bedVolume, heartVolume, roomVolume} from "./sfx";

export const Sfx: React.FC<{voiceover?: boolean}> = ({voiceover = true}) => (
  <>
    {voiceover && <Audio src={staticFile(VO_FILE)} volume={1} />}
    <Sequence from={0} durationInFrames={1545}>
      <Audio src={staticFile("audio/sfx/drone.wav")} volume={(fr) => bedVolume(fr)} />
    </Sequence>
    <Sequence from={1545}>
      <Audio src={staticFile("audio/sfx/drone_end.wav")} volume={(fr) => bedVolume(fr + 1545)} />
    </Sequence>
    <Sequence from={0} durationInFrames={1428}>
      <Audio src={staticFile("audio/sfx/morning_ambience.wav")} volume={(fr) => roomVolume(fr)} />
    </Sequence>
    {heartbeatFrames().map((hf, i) => (
      <Sequence key={`hb${i}`} from={hf} durationInFrames={30}>
        <Audio src={staticFile("audio/sfx/heartbeat.wav")} volume={0.55 * heartVolume(hf)} />
      </Sequence>
    ))}
    {CUES.map(([fr, name, vol, rate], i) => (
      <Sequence key={`c${i}`} from={fr}>
        <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol} playbackRate={rate ?? 1} />
      </Sequence>
    ))}
  </>
);
