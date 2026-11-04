import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { interpolate } from 'remotion';

interface CarCameraProps {
  mode: 'turntable' | 'drive' | 'drift' | 'exploded' | 'cyberpunk';
  localFrame: number;
  durationInFrames: number;
}

export const CarCamera: React.FC<CarCameraProps> = ({ mode, localFrame, durationInFrames }) => {
  const { camera } = useThree();
  const f = localFrame;

  useEffect(() => {
    switch (mode) {
      case 'turntable': {
        const radius = 7.8;
        const orbitAngle = (f / durationInFrames) * Math.PI * 2 + 0.5;
        const camY = 2.0 + Math.sin(f * 0.04) * 0.3;
        camera.position.set(Math.sin(orbitAngle) * radius, camY, Math.cos(orbitAngle) * radius);
        camera.lookAt(0, 0.7, 0);
        break;
      }

      case 'drive': {
        // Dynamic chase & side tracking cam
        const p = f / durationInFrames;
        const camX = interpolate(p, [0, 0.4, 1], [5.2, 4.8, 3.6]);
        const camY = interpolate(p, [0, 0.5, 1], [1.2, 1.8, 1.5]);
        const camZ = interpolate(p, [0, 0.5, 1], [-0.5, 1.8, -4.5]);
        camera.position.set(camX, camY, camZ);
        camera.lookAt(0, 0.6, interpolate(p, [0, 1], [0.8, 0]));
        break;
      }

      case 'drift': {
        // Dramatic low drift apex chase camera
        const p = f / durationInFrames;
        const camX = interpolate(p, [0, 0.5, 1], [-4.2, -4.8, -3.8]);
        const camY = 1.6 + Math.sin(f * 0.1) * 0.05;
        const camZ = interpolate(p, [0, 0.5, 1], [-4.8, -3.5, -5.2]);
        camera.position.set(camX, camY, camZ);
        camera.lookAt(0, 0.6, 0.5);
        break;
      }

      case 'exploded': {
        // Isometric 45° technical schematic view orbiting slowly
        const angle = (f / durationInFrames) * 0.7 + 0.9;
        const radius = 9.2;
        camera.position.set(Math.sin(angle) * radius, 4.8, Math.cos(angle) * radius);
        camera.lookAt(0, 1.1, 0);
        break;
      }

      case 'cyberpunk': {
        // Ultra-low front grill hero shot into flyby
        const p = f / durationInFrames;
        const camZ = interpolate(p, [0, 0.35, 1], [6.2, 4.5, -6.5]);
        const camY = interpolate(p, [0, 0.35, 0.7, 1], [0.5, 0.7, 1.8, 1.2]);
        const camX = interpolate(p, [0, 0.5, 1], [0, -1.2, 2.5]);
        camera.position.set(camX, camY, camZ);
        camera.lookAt(0, 0.7, 0);
        break;
      }
    }
    camera.updateProjectionMatrix();
  }, [mode, f, durationInFrames, camera]);

  return null;
};

