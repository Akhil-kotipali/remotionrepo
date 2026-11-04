import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const CarOutro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: f, fps, config: { damping: 14, stiffness: 100 } });
  const scale = interpolate(enter, [0, 1], [0.92, 1]);

  const VARIATIONS = [
    { num: '01', title: '360° Studio Turntable', color: '#38BDF8', icon: '🔄' },
    { num: '02', title: 'High-Speed Drive & Wheel RPM', color: '#F59E0B', icon: '⚡' },
    { num: '03', title: 'Power Drift & Counter-Steer', color: '#EF4444', icon: '🏎️' },
    { num: '04', title: 'Exploded Schematic Disassembly', color: '#06B6D4', icon: '🔧' },
    { num: '05', title: 'Daylight Launch & Runway Chase', color: '#0284C7', icon: '🚀' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, #0f172a 0%, #020617 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: enter,
        transform: `scale(${scale})`,
        fontFamily: 'Inter, system-ui, sans-serif',
        zIndex: 60,
      }}
    >
      {/* Top Badge */}
      <div
        style={{
          background: 'rgba(56, 189, 248, 0.12)',
          border: '1.5px solid #38BDF8',
          borderRadius: 999,
          padding: '8px 24px',
          color: '#38BDF8',
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 800,
          fontSize: 16,
          letterSpacing: 2,
          marginBottom: 16,
        }}
      >
        3D ASSET ANIMATION SHOWCASE
      </div>

      {/* Main Title */}
      <h1
        style={{
          fontSize: 64,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: -2,
          margin: 0,
          textAlign: 'center',
          textShadow: '0 10px 30px rgba(0,0,0,0.8)',
        }}
      >
        1970 CHEVY NOVA <span style={{ color: '#F59E0B' }}>MUSCLE CAR</span>
      </h1>

      <p
        style={{
          fontSize: 20,
          color: '#94A3B8',
          letterSpacing: 1,
          fontFamily: 'JetBrains Mono, monospace',
          marginTop: 10,
          marginBottom: 40,
        }}
      >
        5 PROCEDURAL ANIMATIONS • REAL-TIME THREE.JS & REMOTION
      </p>

      {/* 5 Variation Cards Grid */}
      <div style={{ display: 'flex', gap: 18, maxWidth: 1400 }}>
        {VARIATIONS.map((v, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: `2px solid ${v.color}66`,
              borderRadius: 18,
              padding: '24px 20px',
              width: 220,
              textAlign: 'center',
              boxShadow: `0 12px 30px ${v.color}22`,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>{v.icon}</div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 13,
                fontWeight: 800,
                color: v.color,
                letterSpacing: 1.5,
              }}
            >
              VARIATION {v.num}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#FFFFFF',
                marginTop: 6,
                lineHeight: 1.3,
              }}
            >
              {v.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

