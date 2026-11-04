// Generate fallback voice timing data for temple video
const fs = require("fs");
const path = require("path");

const FPS = 30;
const SCRIPT =
  "Modern engineers still cannot explain how a single eighty-ton granite block was lifted onto a temple roof one thousand years ago, without machinery. " +
  "This is the Brihadeeswarar Temple in Thanjavur, India. Built by Emperor Raja Raja Chola the First, in ten-oh-ten A.D. " +
  "The tower rises two hundred and sixteen feet. And at the very top sits the Kumbam, a single octagonal stone weighing eighty tons. " +
  "Here is the engineering problem. No crane existed. No iron framework. The nearest granite quarry was sixty kilometers away. " +
  "Modern structural analysis shows the load path required perfect weight distribution across twelve tiers of diminishing stone courses. " +
  "The prevailing theory: a six-kilometer-long earthen ramp, angled at just five degrees, used to drag the stone to the summit with elephants and human labor. " +
  "But here is what baffles engineers. The temple has zero foundation cracks after one thousand years. " +
  "The Kumbam stone sits without any mortar or binding agent. Only gravity holds it in place. " +
  "One thousand years. No modern adhesive. Just perfect geometry. " +
  "They did not have computers. They had mastery.";

const toks = SCRIPT.split(/\s+/).filter(Boolean);
const totalDuration = 65; // seconds
const totalFrames = Math.round(totalDuration * FPS);

const weights = toks.map((t) => t.length + 2);
const sum = weights.reduce((a, b) => a + b, 0);

let acc = 0;
const words = toks.map((t, i) => {
  const startSec = (acc / sum) * totalDuration;
  const startFrame = Math.round((acc / sum) * totalFrames);
  acc += weights[i];
  const endSec = (acc / sum) * totalDuration;
  const endFrame = Math.max(startFrame + 2, Math.round((acc / sum) * totalFrames) - 2);
  return {
    text: t,
    start: startSec,
    end: endSec,
    startFrame,
    endFrame,
  };
});

const metadata = {
  audioFile: "audio/temple_voice.mp3",
  text: SCRIPT,
  voiceId: "fallback",
  fps: FPS,
  durationInSeconds: totalDuration,
  durationInFrames: totalFrames,
  words,
};

const outDir = path.join(__dirname, "..", "public", "audio");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, "temple_voice.json"), JSON.stringify(metadata, null, 2));
console.log("Wrote temple_voice.json with", words.length, "words,", totalFrames, "frames");

// Also create a silent MP3 placeholder if no real voice file exists
const mp3Path = path.join(outDir, "temple_voice.mp3");
if (!fs.existsSync(mp3Path)) {
  // Minimal valid MP3 frame (silent) - just enough for Remotion not to crash
  // We'll use ffmpeg to generate proper silence
  console.log("No temple_voice.mp3 found. Generating 65s of silence...");
  const { execSync } = require("child_process");
  try {
    execSync(`ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t ${totalDuration} -q:a 9 "${mp3Path}" -y`, { stdio: "pipe" });
    console.log("Created silent temple_voice.mp3");
  } catch (e) {
    console.log("ffmpeg not available, creating minimal placeholder...");
    // Write minimal valid mp3 header
    const buf = Buffer.alloc(1024, 0);
    buf[0] = 0xFF; buf[1] = 0xFB; buf[2] = 0x90; buf[3] = 0x00;
    fs.writeFileSync(mp3Path, buf);
    console.log("Created minimal placeholder temple_voice.mp3");
  }
}

