const fs = require('fs');
const path = require('path');
const THREE = require('three');
const { GLTFLoader } = require('three-stdlib');

const glbPath = path.join(__dirname, '..', 'public', 'models', 'MUSCLE_CAR.glb');
const buffer = fs.readFileSync(glbPath);
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

const loader = new GLTFLoader();
loader.parse(
  arrayBuffer,
  '',
  (gltf) => {
    console.log('✅ GLTFLoader.parse succeeded!');
    console.log('Root scene children count:', gltf.scene.children.length);
    gltf.scene.traverse((obj) => {
      console.log(`  - Object: ${obj.name} (${obj.type})`);
    });
  },
  (err) => {
    console.error('❌ Parse error:', err);
  }
);

