const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, '..', 'public', 'models', 'MUSCLE_CAR.glb');
const buffer = fs.readFileSync(glbPath);

const jsonChunkLength = buffer.readUInt32LE(12);
const jsonStr = buffer.toString('utf8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonStr);

console.log('Scenes:', JSON.stringify(gltf.scenes, null, 2));
console.log('Nodes:');
gltf.nodes.forEach((n, i) => {
  console.log(`Node ${i} [${n.name}]: mesh=${n.mesh}, translation=${JSON.stringify(n.translation)}, rotation=${JSON.stringify(n.rotation)}, scale=${JSON.stringify(n.scale)}, children=${JSON.stringify(n.children)}`);
});

// Check accessor bounds to find overall bounding box
console.log('\nAccessors (min/max):');
gltf.accessors.forEach((acc, i) => {
  if (acc.min && acc.max && acc.type === 'VEC3') {
    console.log(`Accessor ${i}: min=${JSON.stringify(acc.min)}, max=${JSON.stringify(acc.max)}`);
  }
});

