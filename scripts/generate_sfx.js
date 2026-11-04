// Generates the 14 short sound effects with ElevenLabs Sound Effects.
// Usage:  node scripts/generate_sfx.js
const fs = require('fs');
const path = require('path');
try { require('dotenv').config({ path: '.env.local' }); } catch (_) {}
try { require('dotenv').config(); } catch (_) {}

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) { console.error('Set ELEVENLABS_API_KEY first'); process.exit(1); }

const OUT = path.join(__dirname, '..', 'public', 'sfx');
fs.mkdirSync(OUT, { recursive: true });

const SFX = {
  pop:        ['single soft electronic pop with a tiny static crackle, clean, short', 0.6],
  power_on:   ['gentle phone screen power-on chime, soft rising two-note, clean', 1.0],
  whoosh:     ['soft airy whoosh, short, minimal', 0.6],
  stamp:      ['soft rubber stamp thud on paper, clean, short', 0.5],
  water:      ['small water rising in a glass tank, soft, short', 1.0],
  ping:       ['single clean glass ping, high, short', 0.5],
  tick:       ['single crisp mechanical tick, short', 0.3],
  squeeze:    ['rubber pipe squeezing creak, short, subtle', 0.8],
  fall:       ['soft descending tone slide, electronic, short', 1.0],
  alert:      ['single soft warning beep, not harsh, short', 0.5],
  power_down: ['electronic power-down sweep falling, short, clean', 1.0],
  slide:      ['paper card slide whoosh, soft, short', 0.5],
  ice:        ['light ice crackle, frost, short, subtle', 0.8],
  thud:       ['single deep soft thud, short, cinematic but quiet', 0.6],
  low_drop:   ['low sub drop, short, soft, minimal', 1.0],
  whoosh_rev: ['reverse whoosh swelling and ending in a soft hit, short', 0.8],
};

(async () => {
  for (const [name, [text, dur]] of Object.entries(SFX)) {
    const file = path.join(OUT, `${name}.mp3`);
    if (fs.existsSync(file)) { console.log('skip', name); continue; }
    const res = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
      method: 'POST',
      headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, duration_seconds: dur, prompt_influence: 0.5 }),
    });
    if (!res.ok) { console.error(name, res.status, await res.text()); continue; }
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    console.log('wrote', name);
  }
})();
