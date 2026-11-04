try { require("dotenv").config({ path: ".env.local" }); } catch (_) {}
try { require("dotenv").config(); } catch (_) {}
const fs = require("fs");
const path = require("path");

// Configuration
const DEFAULT_FPS = 30;
const OUTPUT_DIR = path.join(__dirname, "public", "audio");
// Primary requested voice: Arthur (https://elevenlabs.io/voices/RyIG3E0ZQUXX6qtNupUK)
const PRIMARY_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "RyIG3E0ZQUXX6qtNupUK";
// Fallback voice for Free-tier API accounts: George (Warm, Captivating Storyteller)
const FALLBACK_FREE_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Converts character-level timestamps into word-level timestamps with Remotion frames.
 */
function parseAlignmentToWords(alignment, fps = DEFAULT_FPS) {
  const { characters, character_start_times_seconds, character_end_times_seconds } = alignment;
  const words = [];
  let currentWord = "";
  let wordStartTime = null;
  let wordEndTime = null;

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const start = character_start_times_seconds[i];
    const end = character_end_times_seconds[i];

    if (char.trim() === "") {
      if (currentWord.length > 0) {
        words.push({
          text: currentWord,
          start: wordStartTime,
          end: wordEndTime,
          startFrame: Math.round(wordStartTime * fps),
          endFrame: Math.max(Math.round(wordEndTime * fps), Math.round(wordStartTime * fps) + 1),
        });
        currentWord = "";
        wordStartTime = null;
        wordEndTime = null;
      }
    } else {
      if (wordStartTime === null) {
        wordStartTime = start;
      }
      wordEndTime = end;
      currentWord += char;
    }
  }

  if (currentWord.length > 0) {
    words.push({
      text: currentWord,
      start: wordStartTime,
      end: wordEndTime,
      startFrame: Math.round(wordStartTime * fps),
      endFrame: Math.max(Math.round(wordEndTime * fps), Math.round(wordStartTime * fps) + 1),
    });
  }

  return words;
}

/**
 * Synthesizes speech using ElevenLabs with-timestamps API.
 */
async function generateSpeech({
  text,
  outputFileName = "demo_voice",
  fps = DEFAULT_FPS,
  voiceId = PRIMARY_VOICE_ID,
}) {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    console.warn("\n⚠️  No ELEVENLABS_API_KEY found.");
    return generateMockSpeech({ text, outputFileName, fps });
  }

  console.log(`🎙️  Requesting ElevenLabs speech with voice: ${voiceId}`);
  
  let response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    }
  );

  // If library voice requires paid plan, automatically fall back to George
  if (response.status === 402 && voiceId === PRIMARY_VOICE_ID) {
    console.warn(`\n⚠️  ElevenLabs Free tier requires a paid plan to use Community Library voices via API (${voiceId}).`);
    console.log(`🔄 Automatically falling back to default voice: George (${FALLBACK_FREE_VOICE_ID}) - Warm Storyteller...\n`);
    
    response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${FALLBACK_FREE_VOICE_ID}/with-timestamps`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
          },
        }),
      }
    );
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const { audio_base64, alignment } = data;

  // Save Audio file
  const audioBuffer = Buffer.from(audio_base64, "base64");
  const audioFilePath = path.join(OUTPUT_DIR, `${outputFileName}.mp3`);
  fs.writeFileSync(audioFilePath, audioBuffer);

  // Calculate words and total frames
  const words = parseAlignmentToWords(alignment, fps);
  const totalSeconds =
    alignment.character_end_times_seconds[alignment.character_end_times_seconds.length - 1] || 0;
  const durationInFrames = Math.ceil(totalSeconds * fps);

  // Save Metadata
  const metadata = {
    audioFile: `audio/${outputFileName}.mp3`,
    text,
    fps,
    durationInSeconds: totalSeconds,
    durationInFrames,
    words,
  };

  const metadataPath = path.join(OUTPUT_DIR, `${outputFileName}.json`);
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  console.log(`✅ Audio saved to: ${audioFilePath}`);
  console.log(`✅ Timestamps metadata saved to: ${metadataPath}`);
  console.log(`📊 Duration: ${totalSeconds.toFixed(2)}s (${durationInFrames} frames at ${fps} FPS, ${words.length} words)\n`);

  return metadata;
}

function generateMockSpeech({ text, outputFileName = "demo_voice", fps = DEFAULT_FPS }) {
  const rawWords = text.split(/\s+/).filter(Boolean);
  const secondsPerWord = 0.35;
  const words = [];
  let currentTime = 0.1;

  for (const word of rawWords) {
    const start = currentTime;
    const end = currentTime + secondsPerWord * 0.85;
    words.push({
      text: word,
      start: Number(start.toFixed(2)),
      end: Number(end.toFixed(2)),
      startFrame: Math.round(start * fps),
      endFrame: Math.round(end * fps),
    });
    currentTime += secondsPerWord;
  }

  const durationInSeconds = Number((currentTime + 0.5).toFixed(2));
  const durationInFrames = Math.ceil(durationInSeconds * fps);

  const minimalMp3 = Buffer.from([
    0xff, 0xfb, 0x90, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]);
  const audioFilePath = path.join(OUTPUT_DIR, `${outputFileName}.mp3`);
  fs.writeFileSync(audioFilePath, minimalMp3);

  const metadata = {
    audioFile: `audio/${outputFileName}.mp3`,
    text,
    fps,
    durationInSeconds,
    durationInFrames,
    words,
    isMock: true,
  };

  const metadataPath = path.join(OUTPUT_DIR, `${outputFileName}.json`);
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  return metadata;
}

if (require.main === module) {
  const SCRIPT =
    "At twenty percent, you open the camera... and your phone dies. Let it rest or warm up, and it can turn back on. The battery was never empty. The percentage is only an estimate from a tiny chip. Think of your battery as a water tank. The water is charge. The pressure is voltage. Heavy apps pull hard, and cold or aging narrows the pipe, so the pressure drops. Below a minimum, your phone shuts off. University of Michigan researchers watched a phone die at minus fifteen degrees Celsius, still showing thirty percent. Your phone didn't run out of energy. It ran out of pressure. And that's why...";

  const targetScript = process.argv[2] || SCRIPT;

  generateSpeech({
    text: targetScript,
    outputFileName: "demo_voice",
    fps: 30,
    voiceId: PRIMARY_VOICE_ID,
  }).catch((err) => {
    console.error("Error generating speech:", err);
    process.exit(1);
  });
}

module.exports = { generateSpeech, parseAlignmentToWords };
