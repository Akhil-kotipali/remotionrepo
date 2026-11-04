try { require("dotenv").config({ path: ".env.local" }); } catch (_) {}
try { require("dotenv").config(); } catch (_) {}
const fs = require("fs");
const path = require("path");

const DEFAULT_FPS = 30;
const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio");
// Adam voice - deep cinematic storyteller
const PRIMARY_VOICE_ID = "pNInz6obpgDQGcFmaJgB"; // Adam
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
  outputFileName = "temple_voice",
  fps = DEFAULT_FPS,
}) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ELEVENLABS_API_KEY in environment or .env.local");
  }

  console.log(`Calling ElevenLabs API with voice: ${voiceId}...`);

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
          stability: 0.55,
          similarity_boost: 0.85,
          style: 0.3,
        },
      }),
    }
  );

  if (response.status === 402 && voiceId === PRIMARY_VOICE_ID) {
    console.warn(`ElevenLabs: falling back to George voice...`);
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
            stability: 0.55,
            similarity_boost: 0.85,
            style: 0.3,
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
  console.log(`Audio saved to: ${audioFilePath}`);

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
  console.log(`Metadata saved to: ${metadataPath}`);
  console.log(`Duration: ${durationInSeconds.toFixed(2)}s (${durationInFrames} frames, ${words.length} words)`);

  return metadata;
}

// ~155 words, ~65 seconds narration for a YouTube Short
const TEMPLE_SCRIPT =
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

generateSpeech({ text: TEMPLE_SCRIPT, outputFileName: "temple_voice" })
  .then(() => console.log("TTS generation complete!"))
  .catch((err) => {
    console.error("TTS generation failed:", err);
    process.exit(1);
  });

