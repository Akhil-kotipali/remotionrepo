const fs = require("fs");
const path = require("path");

const filesToInclude = [
  // 1. Six Friends Stick Figures & Stick System
  "src/stick/FriendStickFigure.tsx",
  "src/stick/friendDesigns.ts",
  "src/stick/StickFace.tsx",
  "src/stick/StickFigure.tsx",
  "src/stick/designs.ts",
  "src/stick/types.ts",
  "src/stick/SixFriendsShowcase.tsx",
  "src/stick/MeeraPhotoScene.tsx",
  "src/stick/index.ts",

  // 2. 3D Cinematic Characters
  "src/characters/Character.tsx",
  "src/characters/geometry.tsx",
  "src/characters/designs.ts",
  "src/characters/types.ts",
  "src/characters/CharacterShowcase.tsx",
  "src/characters/CinematicShowcase.tsx",
  "src/characters/index.ts"
];

let mdContent = `# COMPLETE CHARACTER MODELS CODEBASE ARCHIVE\n\n`;
mdContent += `Generated: ${new Date().toISOString()}\n\n`;
mdContent += `This document bundles the complete source code for all character models in this project:\n`;
mdContent += `1. **The Six Friends Procedural Stick Figure Rig** (Arjun, Dev, Rahul, Meera, Kabir, Nisha)\n`;
mdContent += `2. **Animation vs Animator Stick Figures** (Red, Yellow, Orange, Green, Blue)\n`;
mdContent += `3. **3D Three.js / React Three Fiber Cinematic Characters** (Voxel & Low-Poly Geometries)\n\n`;
mdContent += `---\n\n## Table of Contents\n\n`;

filesToInclude.forEach((f, idx) => {
  const anchor = f.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  mdContent += `${idx + 1}. [${f}](#${anchor})\n`;
});
mdContent += `\n---\n\n`;

filesToInclude.forEach((relPath) => {
  const fullPath = path.resolve(relPath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, "utf8");
    const ext = path.extname(relPath).replace(".", "");
    const lang = ext === "tsx" || ext === "ts" ? "tsx" : ext;
    const anchor = relPath.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    mdContent += `## <a id="${anchor}"></a> File: \`${relPath}\`\n\n`;
    mdContent += `\`\`\`${lang}\n// Path: ${relPath}\n${content}\n\`\`\`\n\n---\n\n`;
  }
});

const outPath = path.resolve("CHARACTER_MODELS.md");
fs.writeFileSync(outPath, mdContent, "utf8");
console.log("Successfully wrote", outPath, "Size:", (mdContent.length / 1024).toFixed(1), "KB");

