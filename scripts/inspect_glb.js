const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, '..', 'public', 'models', 'MUSCLE_CAR.glb');
const buffer = fs.readFileSync(glbPath);

const magic = buffer.toString('utf8', 0, 4);
const version = buffer.readUInt32LE(4);
const totalLength = buffer.readUInt32LE(8);
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonChunkType = buffer.toString('utf8', 16, 20);

console.log({ magic, version, totalLength, jsonChunkLength, jsonChunkType });

const jsonStr = buffer.toString('utf8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonStr);

console.log('Nodes:', gltf.nodes?.map((n, i) => ({ id: i, name: n.name, mesh: n.mesh, children: n.children })));
console.log('Meshes:', gltf.meshes?.map((m, i) => ({ id: i, name: m.name, primitivesCount: m.primitives?.length })));
console.log('Animations:', gltf.animations?.map((a, i) => ({ id: i, name: a.name, channels: a.channels?.length, samplers: a.samplers?.length })));
console.log('Materials:', gltf.materials?.map((m, i) => ({ id: i, name: m.name })));

