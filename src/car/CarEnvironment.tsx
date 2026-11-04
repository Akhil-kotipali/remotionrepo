import React from 'react';
import * as THREE from 'three';

interface CarEnvironmentProps {
  mode: 'turntable' | 'drive' | 'drift' | 'exploded' | 'cyberpunk';
  localFrame: number;
}

export const CarEnvironment: React.FC<CarEnvironmentProps> = ({ mode, localFrame }) => {
  const f = localFrame;

  // Road animation offset for driving & drifting modes
  const roadScroll = (f * 0.9) % 10;
  const fastScroll = (f * 1.8) % 12;

  return (
    <>
      {/* ──────────────────────────────────────────────────────────
          UNIVERSAL DAYLIGHT SKY DOME & SUN
          ────────────────────────────────────────────────────────── */}
      {/* Daylight Sky Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[180, 32, 16]} />
        <meshBasicMaterial color="#38bdf8" side={THREE.BackSide} />
      </mesh>

      {/* Sunny Horizon Haze Cylinder */}
      <mesh position={[0, 10, 0]}>
        <cylinderGeometry args={[170, 170, 50, 32, 1, true]} />
        <meshBasicMaterial color="#bae6fd" side={THREE.BackSide} transparent opacity={0.7} />
      </mesh>

      {/* ──────────────────────────────────────────────────────────
          VARIATION 1: SUNLIT ARCHITECTURAL TURNTABLE PAVILION
          ────────────────────────────────────────────────────────── */}
      {mode === 'turntable' && (
        <>
          <ambientLight intensity={1.1} color="#bae6fd" />
          {/* Main Bright Sun Light */}
          <directionalLight position={[15, 24, 12]} intensity={3.0} color="#fffbeb" castShadow />
          {/* Soft Sky Fill Light */}
          <directionalLight position={[-12, 16, -10]} intensity={1.2} color="#e0f2fe" />
          {/* Warm Sun Ground Bounce */}
          <directionalLight position={[0, -2, 0]} intensity={0.4} color="#fef3c7" />

          {/* Sunlit Architectural Showroom Platform */}
          <mesh position={[0, -0.04, 0]} receiveShadow>
            <cylinderGeometry args={[5.4, 5.6, 0.08, 64]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.2} roughness={0.15} />
          </mesh>

          {/* Polished Chrome Inset Ring */}
          <mesh position={[0, -0.005, 0]}>
            <ringGeometry args={[5.0, 5.15, 64]} />
            <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Polished Marble Studio Floor */}
          <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[120, 120]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.25} metalness={0.4} />
          </mesh>

          {/* Sunlit Architectural Glass Pavilion Columns */}
          {[-12, 12].map((x, i) => (
            <mesh key={i} position={[x, 6, -8]}>
              <cylinderGeometry args={[0.5, 0.5, 14, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.8} />
            </mesh>
          ))}
        </>
      )}

      {/* ──────────────────────────────────────────────────────────
          VARIATION 2: DAYLIGHT SCENIC COASTAL HIGHWAY
          ────────────────────────────────────────────────────────── */}
      {mode === 'drive' && (
        <>
          <ambientLight intensity={1.2} color="#bae6fd" />
          {/* High Noon Blazing Sun */}
          <directionalLight position={[18, 30, 12]} intensity={3.4} color="#ffffff" castShadow />
          <directionalLight position={[-14, 15, -8]} intensity={1.0} color="#93c5fd" />

          {/* Daylight Asphalt Highway */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[15, 100]} />
            <meshStandardMaterial color="#334155" roughness={0.65} metalness={0.15} />
          </mesh>

          {/* Center Double Yellow Painted Lines */}
          {[-40, -30, -20, -10, 0, 10, 20, 30, 40].map((z, i) => (
            <group key={i} position={[0, 0.015, z - roadScroll]}>
              <mesh position={[-0.15, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.18, 5]} />
                <meshBasicMaterial color="#f59e0b" />
              </mesh>
              <mesh position={[0.15, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.18, 5]} />
                <meshBasicMaterial color="#f59e0b" />
              </mesh>
            </group>
          ))}

          {/* White Shoulder Solid Lines */}
          <mesh position={[-5.5, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.25, 100]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[5.5, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.25, 100]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>

          {/* Left & Right Green Roadside Grass Verge */}
          <mesh position={[-16, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[22, 100]} />
            <meshStandardMaterial color="#65a30d" roughness={0.8} />
          </mesh>
          <mesh position={[16, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[22, 100]} />
            <meshStandardMaterial color="#65a30d" roughness={0.8} />
          </mesh>

          {/* Distant Sunny Mountain Horizon */}
          {[-35, -15, 10, 35].map((x, i) => (
            <mesh key={i} position={[x * 2, 12, -70]}>
              <coneGeometry args={[22, 28, 8]} />
              <meshStandardMaterial color="#0284c7" roughness={0.9} />
            </mesh>
          ))}
        </>
      )}

      {/* ──────────────────────────────────────────────────────────
          VARIATION 3: SUNNY DAYLIGHT DRIFT CIRCUIT & RUMBLE STRIPS
          ────────────────────────────────────────────────────────── */}
      {mode === 'drift' && (
        <>
          <ambientLight intensity={1.1} color="#bae6fd" />
          {/* Intense Daylight Track Sun */}
          <directionalLight position={[16, 26, 15]} intensity={3.2} color="#ffffff" castShadow />
          <directionalLight position={[-12, 18, -12]} intensity={1.1} color="#bae6fd" />

          {/* Daylight Race Circuit Asphalt */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[30, 80]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.2} />
          </mesh>

          {/* Red & White Alternating Apex Rumble Curbs */}
          {[-25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25].map((z, i) => (
            <group key={i}>
              <mesh position={[-7.5, 0.04, z]}>
                <boxGeometry args={[1.2, 0.08, 2.2]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#ef4444' : '#ffffff'} roughness={0.3} />
              </mesh>
              <mesh position={[7.5, 0.04, z]}>
                <boxGeometry args={[1.2, 0.08, 2.2]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#ef4444' : '#ffffff'} roughness={0.3} />
              </mesh>
            </group>
          ))}

          {/* Daytime Tire Skid Marks */}
          <mesh position={[0.4, 0.01, -0.8]} rotation={[-Math.PI / 2, 0, -0.35]}>
            <planeGeometry args={[1.8, 16]} />
            <meshBasicMaterial color="#0f172a" transparent opacity={0.6} />
          </mesh>

          {/* Daytime White Tire Smoke Clouds */}
          {[0, 1, 2, 3].map((idx) => {
            const smokeScale = 0.8 + ((f * 0.05 + idx * 0.4) % 1.5);
            const smokeZ = -2.2 - ((f * 0.08 + idx * 0.8) % 4);
            return (
              <mesh key={idx} position={[0.8 + idx * 0.2, 0.4 + idx * 0.15, smokeZ]}>
                <sphereGeometry args={[smokeScale * 0.4, 12, 12]} />
                <meshBasicMaterial color="#f1f5f9" transparent opacity={0.4 - idx * 0.08} />
              </mesh>
            );
          })}

          {/* Surrounding Track Grass & Distant Hills */}
          <mesh position={[-25, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[32, 80]} />
            <meshStandardMaterial color="#4d7c0f" roughness={0.9} />
          </mesh>
          <mesh position={[25, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[32, 80]} />
            <meshStandardMaterial color="#4d7c0f" roughness={0.9} />
          </mesh>
        </>
      )}

      {/* ──────────────────────────────────────────────────────────
          VARIATION 4: SUNLIT ENGINEERING SCHEMATIC STUDIO
          ────────────────────────────────────────────────────────── */}
      {mode === 'exploded' && (
        <>
          <ambientLight intensity={1.3} color="#ffffff" />
          <directionalLight position={[14, 25, 14]} intensity={2.8} color="#ffffff" />
          <directionalLight position={[-14, 10, -10]} intensity={1.2} color="#38bdf8" />

          {/* Crisp Sunlit Concrete Floor */}
          <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[60, 60]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
          </mesh>

          {/* Clean Azure Engineering Drafting Grid */}
          <gridHelper args={[40, 40, '#0284c7', '#cbd5e1']} position={[0, -0.01, 0]} />

          {/* Concentric Technical Blueprint Circles */}
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.8, 3.86, 64]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[6.2, 6.26, 64]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
          </mesh>
        </>
      )}

      {/* ──────────────────────────────────────────────────────────
          VARIATION 5: SUNNY PROVING GROUND AIRFIELD RUNWAY
          ────────────────────────────────────────────────────────── */}
      {mode === 'cyberpunk' && (
        <>
          <ambientLight intensity={1.2} color="#bae6fd" />
          {/* Intense Daylight Dragstrip Sun */}
          <directionalLight position={[12, 28, 16]} intensity={3.5} color="#ffffff" castShadow />
          <directionalLight position={[-12, 14, -12]} intensity={1.0} color="#e0f2fe" />

          {/* Concrete Runway Slab */}
          <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[26, 120]} />
            <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.2} />
          </mesh>

          {/* High-Contrast Runway Center Markings */}
          {[-50, -35, -20, -5, 10, 25, 40].map((z, i) => (
            <mesh key={i} position={[0, 0.01, z - fastScroll]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.2, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}

          {/* Runway Side Edge Checkerboard Stripes */}
          {[-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50].map((z, i) => (
            <group key={i}>
              <mesh position={[-9.5, 0.01, z]}>
                <boxGeometry args={[1.5, 0.02, 4]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#f59e0b' : '#1e293b'} />
              </mesh>
              <mesh position={[9.5, 0.01, z]}>
                <boxGeometry args={[1.5, 0.02, 4]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#f59e0b' : '#1e293b'} />
              </mesh>
            </group>
          ))}

          {/* Surrounding Sunlit Desert Terrain */}
          <mesh position={[-30, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[40, 120]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.9} />
          </mesh>
          <mesh position={[30, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[40, 120]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.9} />
          </mesh>
        </>
      )}
    </>
  );
};
