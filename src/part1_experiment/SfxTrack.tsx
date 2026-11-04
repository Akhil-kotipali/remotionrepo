import React from "react";
import {Audio, Sequence, staticFile} from "remotion";
import {heartbeatFrames} from "../part1/config";
import {CUES, bedVolume, heartVolume, roomVolume} from "../part1/sfx";

export const SfxTrack: React.FC<{voiceover?: boolean}> = ({voiceover = true}) => {
  const voVolume = (fr: number) => {
    if (fr < 162) return 1.30;
    if (fr < 200) return 1.30 - ((fr - 162) / 38) * (1.30 - 1.15);
    return 1.15;
  };

  return (
    <>
      {voiceover && (
        <Audio
          src={staticFile("audio/voiceover_part1_experiment.wav")}
          volume={(fr) => voVolume(fr)}
        />
      )}
      {/* music bed + ambience */}
      <Sequence from={0} durationInFrames={1641}>
        <Audio src={staticFile("audio/sfx/drone.wav")} volume={(fr) => 0.82 * bedVolume(fr)} />
      </Sequence>
      <Sequence from={1641}>
        <Audio src={staticFile("audio/sfx/drone_end.wav")} volume={(fr) => 0.82 * bedVolume(fr + 1641)} />
      </Sequence>
      <Sequence from={150} durationInFrames={1275}>
        <Audio src={staticFile("audio/sfx/room_tone.wav")} volume={(fr) => 0.80 * roomVolume(fr + 150)} />
      </Sequence>
      {/* heartbeat — scheduled, accelerating (audible in tension silence gaps) */}
      {heartbeatFrames().map((hf, i) => (
        <Sequence key={`hb${i}`} from={hf} durationInFrames={30}>
          <Audio src={staticFile("audio/sfx/heartbeat.wav")} volume={0.50 * heartVolume(hf)} />
        </Sequence>
      ))}
      {/* hits, ui, typing, steps */}
      {CUES.map(([fr, name, vol, rate], i) => (
        <Sequence key={`c${i}`} from={fr}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol * 0.84} playbackRate={rate ?? 1} />
        </Sequence>
      ))}
    </>
  );
};

