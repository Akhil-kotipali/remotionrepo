const fs = require("fs");
const path = require("path");

/**
 * Utility to format seconds into SRT timestamp format (HH:MM:SS,mmm)
 */
function toSrtTime(seconds) {
  const pad = (num, size = 2) => String(num).padStart(size, "0");
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)},${pad(ms, 3)}`;
}

/**
 * Groups words into chunks (sentences or max N words per caption card).
 */
function generateSrtFromMetadata(metadataPath, maxWordsPerLine = 6) {
  if (!fs.existsSync(metadataPath)) {
    console.error(`Metadata file not found: ${metadataPath}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
  const { words, audioFile } = data;

  if (!words || words.length === 0) {
    console.warn("No words found in metadata.");
    return;
  }

  const srtBlocks = [];
  let currentGroup = [];
  let blockIndex = 1;

  for (let i = 0; i < words.length; i++) {
    currentGroup.push(words[i]);

    const isLastWord = i === words.length - 1;
    const endsWithPunctuation = /[.!?]$/.test(words[i].text);

    if (currentGroup.length >= maxWordsPerLine || endsWithPunctuation || isLastWord) {
      const startTime = toSrtTime(currentGroup[0].start);
      const endTime = toSrtTime(currentGroup[currentGroup.length - 1].end);
      const text = currentGroup.map((w) => w.text).join(" ");

      srtBlocks.push(`${blockIndex}\n${startTime} --> ${endTime}\n${text}\n`);
      blockIndex++;
      currentGroup = [];
    }
  }

  const srtContent = srtBlocks.join("\n");
  const srtPath = metadataPath.replace(/\.json$/, ".srt");
  fs.writeFileSync(srtPath, srtContent, "utf-8");

  console.log(`✅ SRT Subtitles generated: ${srtPath}`);
  return srtPath;
}

if (require.main === module) {
  const targetJson =
    process.argv[2] || path.join(__dirname, "public", "audio", "demo_voice.json");
  generateSrtFromMetadata(targetJson);
}

module.exports = { generateSrtFromMetadata };

