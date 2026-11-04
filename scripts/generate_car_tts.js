try { require("dotenv").config({ path: ".env.local" }); } catch (_) {}
try { require("dotenv").config(); } catch (_) {}
const fs = require("fs");
const path = require("path");

const DEFAULT_FPS = 30;
const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio");
const PRIMARY_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "RyIG3E0ZQUXX6qtNupUK";
const FALLBACK_FREE_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

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
      currentWord += char;
      wordEndTime = end;
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

async function generateSpeech({
  text,
  voiceId = PRIMARY_VOICE_ID,
  outputFileName = "car_voice",
  fps = DEFAULT_FPS,
}) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ELEVENLABS_API_KEY in environment or .env.local");
  }

  console.log(`🎙️ Calling ElevenLabs API with voice: ${voiceId}...`);

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

  const audioBuffer = Buffer.from(audio_base64, "base64");
  const audioFilePath = path.join(OUTPUT_DIR, `${outputFileName}.mp3`);
  fs.writeFileSync(audioFilePath, audioBuffer);
  console.log(`✅ Audio saved to: ${audioFilePath}`);

  const words = parseAlignmentToWords(alignment, fps);
  const durationInSeconds = alignment.character_end_times_seconds.slice(-1)[0] || 0;
  const durationInFrames = Math.ceil(durationInSeconds * fps);

  const metadata = {
    audioFile: `audio/${outputFileName}.mp3`,
    text,
    voiceId,
    fps,
    durationInSeconds,
    durationInFrames,
    words,
  };

  const metadataPath = path.join(OUTPUT_DIR, `${outputFileName}.json`);
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`✅ Metadata and word timestamps saved to: ${metadataPath}`);
  console.log(`📊 Duration: ${durationInSeconds.toFixed(2)}s (${durationInFrames} frames, ${words.length} words)\n`);

  // Mirror to public/public/audio for static server
  const publicMirror = path.join(__dirname, "..", "public", "public", "audio");
  if (!fs.existsSync(publicMirror)) fs.mkdirSync(publicMirror, { recursive: true });
  fs.copyFileSync(audioFilePath, path.join(publicMirror, `${outputFileName}.mp3`));
  fs.copyFileSync(metadataPath, path.join(publicMirror, `${outputFileName}.json`));

  return metadata;
}

const CAR_SCRIPT =
  "Welcome to the 3D vehicle animation showcase. We begin with a three-sixty degree cinematic studio turntable, inspecting every contour and curve of this classic muscle car. Next, variation two: dynamic high-speed driving, with all four wheels rotating in real-time, synchronized with road velocity and suspension physics. Variation three: power drift dynamics. Notice the front wheels actively counter-steering into the slide, paired with realistic lateral body roll. Variation four: an exploded engineering schematic, separating the unibody chassis, independent axles, and wheels. And variation five: a high-octane cyberpunk night chase, featuring burnout launch torque and volumetric neon lighting. Five animations, fully procedural in Remotion 3D.";

generateSpeech({ text: CAR_SCRIPT, outputFileName: "car_voice" })
  .then(() => console.log("🎉 Car TTS generation complete!"))
  .catch((err) => {
    console.error("❌ TTS generation failed:", err);
    process.exit(1);
  });

