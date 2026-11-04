import React, { useRef } from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";

interface RobotProps {
  isSpeaking: boolean;
}

/**
 * Built-in 3D Procedural Character / Robot that animates and reacts to speech!
 */
const AnimatedRobotCharacter: React.FC<RobotProps> = ({ isSpeaking }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Floating / idle breathing motion
  const floatY = Math.sin((frame / fps) * 2) * 0.15;
  const gentleRotation = Math.sin((frame / fps) * 1.2) * 0.25;

  // Reaction to speech: mouth opens/pulses when actively speaking
  const mouthScaleY = isSpeaking
    ? 1 + Math.sin(frame * 0.8) * 0.8
    : 0.15;

  // Eye visor intensity bounce on speech
  const visorGlow = isSpeaking
    ? interpolate(Math.sin(frame * 0.6), [-1, 1], [1.5, 3])
    : 1.0;

  // Ring rotation around the character
  const ringRotationZ = (frame / fps) * 1.5;

  return (
    <group ref={groupRef} position={[0, floatY, 0]} rotation={[0, gentleRotation, 0]}>
      {/* Outer Holographic Energy Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, ringRotationZ]}>
        <torusGeometry args={[2.2, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={1.5}
          wireframe={false}
          roughness={0.2}
        />
      </mesh>

      {/* Robot Torso / Base */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.7, 0.5, 1.2, 32]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      {/* Robot Core Light (Pulses with voice) */}
      <mesh position={[0, -0.7, 0.6]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={visorGlow * 1.5}
        />
      </mesh>

      {/* Robot Head */}
      <group ref={headRef} position={[0, 0.4, 0]}>
        <mesh>
          <boxGeometry args={[1.4, 1.1, 1.2]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Visor / Eye (Glows and tracks) */}
        <mesh position={[0, 0.1, 0.61]}>
          <planeGeometry args={[1.1, 0.35]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={visorGlow}
          />
        </mesh>

        {/* Animated Mouth (Scales dynamically with ElevenLabs speech) */}
        <mesh ref={mouthRef} position={[0, -0.3, 0.61]} scale={[1, mouthScaleY, 1]}>
          <planeGeometry args={[0.6, 0.15]} />
          <meshStandardMaterial
            color="#f43f5e"
            emissive="#f43f5e"
            emissiveIntensity={isSpeaking ? 2.0 : 0.4}
          />
        </mesh>

        {/* Antenna / Earpieces */}
        <mesh position={[-0.78, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.78, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
};

interface SceneProps {
  isSpeaking: boolean;
  width: number;
  height: number;
}

export const ThreeDScene: React.FC<SceneProps> = ({ isSpeaking, width, height }) => {
  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-4, -2, 2]} intensity={1.0} color="#38bdf8" />
        <pointLight position={[4, 2, -2]} intensity={0.8} color="#a855f7" />

        <AnimatedRobotCharacter isSpeaking={isSpeaking} />
      </ThreeCanvas>
    </div>
  );
};
