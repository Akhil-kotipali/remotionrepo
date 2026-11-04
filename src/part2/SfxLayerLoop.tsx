import React from "react";
import {Audio, Sequence, staticFile} from "remotion";
import {CUES, bedVolume, heartVolume, roomVolume} from "./sfx";

const VO_LOOP_FILE = "audio/voiceover_part2_loop.wav";

function loopHeartbeatFrames(): number[] {
  return [6, 45, 80, 115, 150, 190, 230, 270, 310, 350, 400, 450, 500, 560, 620, 680, 740, 800, 860, 920, 970, 1020, 1070, 1120, 1170, 1220, 1270, 1320, 1370, 1420];
}

export const SfxLayerLoop: React.FC<{voiceover?: boolean}> = ({voiceover = true}) => (
  <>
    {voiceover && <Audio src={staticFile(VO_LOOP_FILE)} volume={(fr) => (fr < 135 ? 1.3 : 1.15)} />}
    <Sequence from={0} durationInFrames={1440}>
      <Audio src={staticFile("audio/sfx/drone.wav")} volume={(fr) => bedVolume(fr) * 0.82} />
    </Sequence>
    <Sequence from={1440}>
      <Audio src={staticFile("audio/sfx/drone_end.wav")} volume={(fr) => bedVolume(fr + 1440) * 0.82} />
    </Sequence>
    <Sequence from={135} durationInFrames={1305}>
      <Audio src={staticFile("audio/sfx/morning_ambience.wav")} volume={(fr) => roomVolume(fr + 135) * 0.82} />
    </Sequence>
    {loopHeartbeatFrames().map((hf, i) => (
      <Sequence key={`hb${i}`} from={hf} durationInFrames={30}>
        <Audio src={staticFile("audio/sfx/heartbeat.wav")} volume={0.55 * heartVolume(hf) * 0.82} />
      </Sequence>
    ))}
    {CUES.filter(([fr]) => fr < 1440).map(([fr, name, vol, rate], i) => (
      <Sequence key={`c${i}`} from={fr}>
        <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol * 0.82} playbackRate={rate ?? 1} />
      </Sequence>
    ))}
  </>
);

