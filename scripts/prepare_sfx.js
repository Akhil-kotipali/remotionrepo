const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'sound effects');
const destDir = path.join(__dirname, '..', 'public', 'sfx');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Map each cue name to its source file in the "sound effects" folder
const mapping = {
  pop: 'pop-click-ui-2-198302.mp3',
  power_on: 'power on.wav',
  whoosh: '855844__sadiquecat__whoosh-long-bamboo-stick-os-st-13.wav',
  stamp: 'freesound_community-jump-landing-30946.mp3',
  water: 'freesound_community-water-36883.mp3',
  ping: 'freesound_community-notification-sound-7062.mp3',
  tick: 'u_a4gfvwagf1-tick-sound-effect-1-336779.mp3',
  squeeze: '330250__deleted_user_2104797__rubber-squeeze-5.wav',
  fall: 'shut_up_ghost-descending-tones-168472.mp3',
  alert: 'universfield-new-notification-018-363746.mp3',
  power_down: 'freesound_community-power-down-45784.mp3',
  slide: 'liecio-crumping-paper-109585.mp3',
  ice: 'freesound_community-ice-43072.mp3',
  thud: 'freesound_community-box-dropping-with-stones-46880.mp3',
  low_drop: 'freesound_community-impact-riser-01-6908.mp3',
  whoosh_rev: 'lordsonny-cinematic-whoosh-reverse-161307.mp3',
};

console.log('Copying sound effects to public/sfx...');
for (const [cueName, sourceFile] of Object.entries(mapping)) {
  const srcPath = path.join(srcDir, sourceFile);
  const destPath = path.join(destDir, `${cueName}.mp3`);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`  ✓ ${cueName}.mp3 <- ${sourceFile}`);
  } else {
    console.warn(`  ✗ Missing: ${sourceFile}`);
  }
}

console.log('\nAll sound effects placed in public/sfx successfully!');

