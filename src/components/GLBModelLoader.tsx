import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";

interface GLBModelProps {
  modelPath: string; // e.g. staticFile("models/character.glb")
  animationName?: string; // Optional name of animation clip to play
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Reusable component for loading and animating .glb / .gltf 3D models in Remotion.
 * Synchronizes animation clips frame-accurately with the video timeline.
 */
export const GLBModelLoader: React.FC<GLBModelProps> = ({
  modelPath,
  animationName,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  useEffect(() => {
    // If an animation name is specified or fallback to the first animation track
    const activeAction = animationName
      ? actions[animationName]
      : Object.values(actions)[0];

    if (activeAction) {
      // Deterministically set animation time to the exact video frame
      const timeInSeconds = frame / fps;
      activeAction.play();
      activeAction.paused = true;
      activeAction.time = timeInSeconds % (activeAction.getClip().duration || 1);
    }
  }, [actions, animationName, frame, fps]);

  return (
    <group ref={group} position={position} scale={scale} rotation={rotation}>
      <primitive object={scene} />
    </group>
  );
};

