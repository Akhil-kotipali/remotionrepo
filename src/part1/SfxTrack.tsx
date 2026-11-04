import React from "react";
import {Audio, Sequence, staticFile} from "remotion";
import {VO_FILE, heartbeatFrames} from "./config";
import {CUES, bedVolume, heartVolume, roomVolume} from "./sfx";

export const Sfx: React.FC<{voiceover?: boolean}> = ({voiceover = true}) => {
  // Voiceover volume: extra punch on starting hook (0-162), slightly increased baseline (1.14x)
  const voVolume = (fr: number) => {
    if (fr < 162) return 1.30; // elevated volume for the cold open hook
    if (fr < 200) return 1.30 - ((fr - 162) / 38) * (1.30 - 1.14);
    return 1.14; // very slightly increased baseline
  };

  return (
    <>
      {voiceover && <Audio src={staticFile(VO_FILE)} volume={(fr) => voVolume(fr)} />}
      {/* music bed + ambience — slightly reduced volume (0.80x) */}
      <Sequence from={0} durationInFrames={1641}>
        <Audio src={staticFile("audio/sfx/drone.wav")} volume={(fr) => 0.80 * bedVolume(fr)} />
      </Sequence>
      <Sequence from={1641}>
        <Audio src={staticFile("audio/sfx/drone_end.wav")} volume={(fr) => 0.80 * bedVolume(fr + 1641)} />
      </Sequence>
      <Sequence from={150} durationInFrames={1275}>
        <Audio src={staticFile("audio/sfx/room_tone.wav")} volume={(fr) => 0.78 * roomVolume(fr + 150)} />
      </Sequence>
      {/* heartbeat — scheduled, accelerating (reduced slightly) */}
      {heartbeatFrames().map((hf, i) => (
        <Sequence key={`hb${i}`} from={hf} durationInFrames={30}>
          <Audio src={staticFile("audio/sfx/heartbeat.wav")} volume={0.44 * heartVolume(hf)} />
        </Sequence>
      ))}
      {/* hits, ui, typing, steps — slightly reduced (0.82x) */}
      {CUES.map(([fr, name, vol, rate], i) => (
        <Sequence key={`c${i}`} from={fr}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol * 0.82} playbackRate={rate ?? 1} />
        </Sequence>
      ))}
    </>
  );
};
