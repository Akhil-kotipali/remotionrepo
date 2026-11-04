export interface WordTimestamp {
  text: string;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
}

export interface TTSMetadata {
  audioFile: string;
  text: string;
  fps: number;
  durationInSeconds: number;
  durationInFrames: number;
  words: WordTimestamp[];
  isMock?: boolean;
}

