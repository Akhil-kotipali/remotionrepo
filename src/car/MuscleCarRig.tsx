import React, { useMemo, useRef } from 'react';
import { interpolate, Easing } from 'remotion';
import { useGLTF } from '@react-three/drei';
import { staticFile } from 'remotion';
import * as THREE from 'three';

interface MuscleCarRigProps {
  mode: 'turntable' | 'drive' | 'drift' | 'exploded' | 'cyberpunk';
  localFrame: number;
  durationInFrames: number;
}

/** Original positions of modular components for exploded view calculations */
const ORIGINAL_PARTS = {
  bodyY: 0,
  wheelLB: [0.96869, 0.39135, -1.5158] as [number, number, number],
  wheelLF: [0.96869, 0.39135, 2.16136] as [number, number, number],
  wheelRB: [-0.99056, 0.39135, -1.51983] as [number, number, number],
  wheelRF: [-0.99056, 0.39135, 2.16136] as [number, number, number],
  ejeB: [0, 0.39135, -1.5158] as [number, number, number],
  ejeF: [0, 0.39135, 2.16136] as [number, number, number],
  retrovisor: 0,
  manija: 0,
};

export const MuscleCarRig: React.FC<MuscleCarRigProps> = ({ mode, localFrame, durationInFrames }) => {
  // Load the 3D GLB model from staticFile
  const { scene } = useGLTF(staticFile('models/MUSCLE_CAR.glb'));

  // Clone scene so multiple instances don't collide
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        // High-gloss daylight automotive clearcoat paint & chrome
        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.roughness = 0.2;
          mat.metalness = 0.85;
          mat.envMapIntensity = 2.2;
          mesh.material = mat;
        }
      }
    });
    return clone;
  }, [scene]);

  // Extract individual node references
  const nodes = useMemo(() => {
    return {
      body: clonedScene.getObjectByName('Body'),
      wheelLB: clonedScene.getObjectByName('WheelLB'),
      wheelLF: clonedScene.getObjectByName('WheelLF'),
      wheelRB: clonedScene.getObjectByName('WheelRB'),
      wheelRF: clonedScene.getObjectByName('WheelRF'),
      ejeB: clonedScene.getObjectByName('EjeB'),
      ejeF: clonedScene.getObjectByName('EjeF'),
      manija: clonedScene.getObjectByName('Manija'),
      retrovisor: clonedScene.getObjectByName('Retrovisor'),
    };
  }, [clonedScene]);

  // Root group ref
  const carGroupRef = useRef<THREE.Group>(null);

  // Compute animations frame-accurately based on active variation mode
  useMemo(() => {
    const f = localFrame;

    // Reset base positions
    if (nodes.body) nodes.body.position.set(0, 0, 0);
    if (nodes.wheelLB) nodes.wheelLB.position.set(...ORIGINAL_PARTS.wheelLB);
    if (nodes.wheelLF) nodes.wheelLF.position.set(...ORIGINAL_PARTS.wheelLF);
    if (nodes.wheelRB) nodes.wheelRB.position.set(...ORIGINAL_PARTS.wheelRB);
    if (nodes.wheelRF) nodes.wheelRF.position.set(...ORIGINAL_PARTS.wheelRF);
    if (nodes.manija) nodes.manija.position.set(0, 0, 0);
    if (nodes.retrovisor) nodes.retrovisor.position.set(0, 0, 0);

    // Reset wheel quaternions to identity
    const qIdentity = new THREE.Quaternion();
    if (nodes.wheelLB) nodes.wheelLB.quaternion.copy(qIdentity);
    if (nodes.wheelLF) nodes.wheelLF.quaternion.copy(qIdentity);
    if (nodes.wheelRB) nodes.wheelRB.quaternion.copy(qIdentity);
    if (nodes.wheelRF) nodes.wheelRF.quaternion.copy(qIdentity);

    switch (mode) {
      /* ──────────────────────────────────────────────────────────
         VARIATION 1: 360° Studio Turntable Showcase
         ────────────────────────────────────────────────────────── */
      case 'turntable': {
        const turnAngle = (f / durationInFrames) * Math.PI * 2;
        const breathing = Math.sin((f / 30) * Math.PI * 2) * 0.02;

        if (carGroupRef.current) {
          carGroupRef.current.position.set(0, breathing, 0);
          carGroupRef.current.rotation.set(0, turnAngle, 0);
        }

        // Slow cinematic wheel rotation on turntable
        const wheelRot = f * 0.03;
        const qTurn = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), wheelRot);
        if (nodes.wheelLB) nodes.wheelLB.quaternion.copy(qTurn);
        if (nodes.wheelLF) nodes.wheelLF.quaternion.copy(qTurn);
        if (nodes.wheelRB) nodes.wheelRB.quaternion.copy(qTurn);
        if (nodes.wheelRF) nodes.wheelRF.quaternion.copy(qTurn);
        break;
      }

      /* ──────────────────────────────────────────────────────────
         VARIATION 2: High-Speed Street Drive & Wheel Sync
         ────────────────────────────────────────────────────────── */
      case 'drive': {
        // Rapid wheel spin synced to velocity
        const wheelSpin = f * 0.65;
        const qSpin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), wheelSpin);
        if (nodes.wheelLB) nodes.wheelLB.quaternion.copy(qSpin);
        if (nodes.wheelLF) nodes.wheelLF.quaternion.copy(qSpin);
        if (nodes.wheelRB) nodes.wheelRB.quaternion.copy(qSpin);
        if (nodes.wheelRF) nodes.wheelRF.quaternion.copy(qSpin);

        // Realistic suspension dynamics: vertical road bumps
        const roadBump1 = Math.sin(f * 0.45) * 0.025;
        const roadBump2 = Math.sin(f * 0.85) * 0.015;
        const engineVibration = Math.sin(f * 2.2) * 0.005;
        const totalY = roadBump1 + roadBump2 + engineVibration;

        // Aerodynamic acceleration pitch
        const accelPitch = interpolate(f, [0, 20, 60], [-0.04, -0.015, -0.01], {
          extrapolateRight: 'clamp',
        });

        if (carGroupRef.current) {
          carGroupRef.current.position.set(0, totalY, 0);
          carGroupRef.current.rotation.set(accelPitch, 0, 0);
        }
        break;
      }

      /* ──────────────────────────────────────────────────────────
         VARIATION 3: Power Drift & Active Counter-Steer Physics
         FIXED: Decoupled steering yaw from wheel roll using
         strict quaternions so front wheels steer cleanly without wobble!
         ────────────────────────────────────────────────────────── */
      case 'drift': {
        const driftProgress = f / durationInFrames;
        // Lateral power slide angle (body angled into the drift)
        const driftYaw = interpolate(
          driftProgress,
          [0, 0.22, 0.72, 1],
          [-0.05, -0.52, -0.48, -0.08],
          { easing: Easing.bezier(0.25, 0.1, 0.25, 1) }
        );

        // Body roll: chassis leans laterally into the turn
        const bodyRoll = interpolate(driftProgress, [0, 0.22, 0.72, 1], [0.01, 0.08, 0.07, 0.01]);

        // Counter-steering angle: front wheels turn opposite to the slide
        // To counter-steer a negative yaw drift, front wheels steer positive (pointing down track)
        const counterSteer = interpolate(driftProgress, [0, 0.20, 0.75, 1], [0.05, 0.45, 0.42, 0.02]);

        if (carGroupRef.current) {
          carGroupRef.current.position.set(
            interpolate(driftProgress, [0, 0.45, 1], [-0.3, 0.7, -0.1]),
            Math.sin(f * 0.6) * 0.018,
            0
          );
          carGroupRef.current.rotation.set(0, driftYaw, bodyRoll);
        }

        // Wheel spins
        const rearWheelSpin = f * 1.1; // Rear burnout slip
        const frontWheelSpin = f * 0.55; // Front rolling speed

        // Rear wheels: pure roll around X axis
        const qRear = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), rearWheelSpin);
        if (nodes.wheelLB) nodes.wheelLB.quaternion.copy(qRear);
        if (nodes.wheelRB) nodes.wheelRB.quaternion.copy(qRear);

        // Front wheels: Pure vertical kingpin steering (Y) combined with axle spin (X)
        // Using quaternion multiplication: qSteer * qRoll
        // The axle is steered in horizontal plane, and the wheel rolls on that steered axle!
        const qSteer = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), counterSteer);
        const qRollFront = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), frontWheelSpin);
        const qFront = qSteer.clone().multiply(qRollFront);

        if (nodes.wheelLF) nodes.wheelLF.quaternion.copy(qFront);
        if (nodes.wheelRF) nodes.wheelRF.quaternion.copy(qFront);
        break;
      }

      /* ──────────────────────────────────────────────────────────
         VARIATION 4: Exploded Holographic Engineering Disassembly
         ────────────────────────────────────────────────────────── */
      case 'exploded': {
        const explodeP = interpolate(
          localFrame,
          [0, 45, durationInFrames - 55, durationInFrames],
          [0, 1, 1, 0],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }
        );

        // Technical 360 rotation during exploded view
        const inspectRotation = (f / durationInFrames) * Math.PI * 1.5 - 0.4;

        if (carGroupRef.current) {
          carGroupRef.current.position.set(0, 0.5 * explodeP, 0);
          carGroupRef.current.rotation.set(0.15 * explodeP, inspectRotation, 0);
        }

        // Body lifts vertically
        if (nodes.body) {
          nodes.body.position.y = explodeP * 1.7;
        }

        // Left wheels slide outwards (+X)
        if (nodes.wheelLB) {
          nodes.wheelLB.position.x = ORIGINAL_PARTS.wheelLB[0] + explodeP * 1.4;
          nodes.wheelLB.position.z = ORIGINAL_PARTS.wheelLB[2] - explodeP * 0.3;
        }
        if (nodes.wheelLF) {
          nodes.wheelLF.position.x = ORIGINAL_PARTS.wheelLF[0] + explodeP * 1.4;
          nodes.wheelLF.position.z = ORIGINAL_PARTS.wheelLF[2] + explodeP * 0.3;
        }

        // Right wheels slide outwards (-X)
        if (nodes.wheelRB) {
          nodes.wheelRB.position.x = ORIGINAL_PARTS.wheelRB[0] - explodeP * 1.4;
          nodes.wheelRB.position.z = ORIGINAL_PARTS.wheelRB[2] - explodeP * 0.3;
        }
        if (nodes.wheelRF) {
          nodes.wheelRF.position.x = ORIGINAL_PARTS.wheelRF[0] - explodeP * 1.4;
          nodes.wheelRF.position.z = ORIGINAL_PARTS.wheelRF[2] + explodeP * 0.3;
        }

        // Handles and mirrors expand
        if (nodes.manija) nodes.manija.position.x = explodeP * 0.7;
        if (nodes.retrovisor) nodes.retrovisor.position.x = explodeP * 0.8;
        break;
      }

      /* ──────────────────────────────────────────────────────────
         VARIATION 5: High-Speed Daylight Drag Launch & Chase
         ────────────────────────────────────────────────────────── */
      case 'cyberpunk': {
        const isBurnout = f < 40;
        const launchProgress = interpolate(f, [40, 90, durationInFrames], [0, 1, 3], {
          extrapolateLeft: 'clamp',
        });

        // Launch nose lift & rear squat
        const launchPitch = interpolate(f, [38, 48, 80], [0, -0.14, -0.02], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const squatY = interpolate(f, [38, 46, 80], [0, -0.06, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        // Forward motion along Z
        const carZ = isBurnout ? Math.sin(f * 1.8) * 0.03 : launchProgress * 12;

        if (carGroupRef.current) {
          carGroupRef.current.position.set(0, squatY, carZ);
          carGroupRef.current.rotation.set(launchPitch, 0, 0);
        }

        // Furious wheel spin
        const spinSpeed = isBurnout ? f * 1.5 : (40 * 1.5) + (f - 40) * 1.1;
        const qLaunchSpin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), spinSpeed);
        if (nodes.wheelLB) nodes.wheelLB.quaternion.copy(qLaunchSpin);
        if (nodes.wheelRB) nodes.wheelRB.quaternion.copy(qLaunchSpin);
        const frontSpin = isBurnout ? 0 : (f - 40) * 0.9;
        const qFrontLaunch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), frontSpin);
        if (nodes.wheelLF) nodes.wheelLF.quaternion.copy(qFrontLaunch);
        if (nodes.wheelRF) nodes.wheelRF.quaternion.copy(qFrontLaunch);
        break;
      }
    }
  }, [mode, localFrame, durationInFrames, nodes]);

  return (
    <group ref={carGroupRef}>
      <primitive object={clonedScene} />
    </group>
  );
};


