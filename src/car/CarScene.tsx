import React, { Suspense } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { MuscleCarRig } from './MuscleCarRig';
import { CarEnvironment } from './CarEnvironment';
import { CarCamera } from './CarCamera';

interface CarSceneProps {
  mode: 'turntable' | 'drive' | 'drift' | 'exploded' | 'cyberpunk';
  localFrame: number;
  durationInFrames: number;
  width: number;
  height: number;
}

export const CarScene: React.FC<CarSceneProps> = ({
  mode,
  localFrame,
  durationInFrames,
  width,
  height,
}) => {
  return (
    <div style={{ position: 'absolute', inset: 0, width, height, overflow: 'hidden' }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 2, 7.5], fov: 42, near: 0.1, far: 1000 }}
        shadows
      >
        <Suspense fallback={null}>
          <CarCamera mode={mode} localFrame={localFrame} durationInFrames={durationInFrames} />
          <CarEnvironment mode={mode} localFrame={localFrame} />
          <MuscleCarRig mode={mode} localFrame={localFrame} durationInFrames={durationInFrames} />
        </Suspense>
      </ThreeCanvas>
    </div>
  );
};

