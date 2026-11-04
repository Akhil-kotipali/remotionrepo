import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';

interface CarHUDProps {
  mode: 'turntable' | 'drive' | 'drift' | 'exploded' | 'cyberpunk';
  localFrame: number;
  durationInFrames: number;
}

const VARIATION_DATA = {
  turntable: {
    num: '01',
    title: '360° CINEMATIC STUDIO TURNTABLE',
    subtitle: 'HERO SHOWCASE • SURFACE SPECULARITY & LIGHTING',
    color: '#38BDF8',
    telemetry: [
      { label: 'MODEL', val: '1970 CHEVY NOVA' },
      { label: 'ORBIT', val: '360° AZIMUTH' },
      { label: 'SHADING', val: 'PBR METAL/ROUGH' },
    ],
  },
  drive: {
    num: '02',
    title: 'DYNAMIC HIGH-SPEED DRIVE & WHEEL SYNC',
    subtitle: 'RPM WHEEL VELOCITY • ACTIVE SUSPENSION DAMPING',
    color: '#F59E0B',
    telemetry: [
      { label: 'SPEED', val: '128 MPH' },
      { label: 'ENGINE RPM', val: '6,400 RPM' },
      { label: 'SUSPENSION', val: 'ACTIVE DAMPING' },
    ],
  },
  drift: {
    num: '03',
    title: 'POWER DRIFT & ACTIVE COUNTER-STEERING',
    subtitle: 'LATERAL G-FORCE • CHASSIS ROLL • TIRE BURNOUT SLIP',
    color: '#EF4444',
    telemetry: [
      { label: 'DRIFT ANGLE', val: '36.5°' },
      { label: 'LATERAL G', val: '1.42 G' },
      { label: 'FRONT STEER', val: 'COUNTER-LOCKED' },
    ],
  },
  exploded: {
    num: '04',
    title: 'HOLOGRAPHIC EXPLODED SCHEMATIC DISASSEMBLY',
    subtitle: 'UNIBODY ISOLATION • INDEPENDENT SUSPENSION EXPANSION',
    color: '#06B6D4',
    telemetry: [
      { label: 'SUB-ASSEMBLIES', val: '9 MODULES' },
      { label: 'PROJECTION', val: 'ISOMETRIC 3D' },
      { label: 'EXPANSION', val: '100% MAXIMUM' },
    ],
  },
  cyberpunk: {
    num: '05',
    title: 'DAYLIGHT DRAG LAUNCH & RUNWAY CHASE',
    subtitle: 'HIGH-TORQUE LAUNCH SQUAT • RUNWAY VELOCITY',
    color: '#0284C7',
    telemetry: [
      { label: 'LAUNCH MODE', val: 'TORQUE ENGAGED' },
      { label: '0-60 MPH', val: '3.2 SECONDS' },
      { label: 'BOOST', val: '+16.5 PSI' },
    ],
  },
};

export const CarHUD: React.FC<CarHUDProps> = ({ mode, localFrame, durationInFrames }) => {
  const { fps } = useVideoConfig();
  const data = VARIATION_DATA[mode];

  // Title entrance pop
  const enter = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const fadeOut = interpolate(localFrame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = enter * fadeOut;

  // Progress fill for current variation
  const progressPct = (localFrame / durationInFrames) * 100;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        opacity,
        zIndex: 50,
      }}
    >
      {/* ──────────────── Top Navigation Bar ──────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 50,
          right: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left: Project Branding & Mode Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: `2px solid ${data.color}`,
              padding: '8px 20px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: `0 8px 24px ${data.color}33`,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: data.color,
                boxShadow: `0 0 12px ${data.color}`,
              }}
            />
            <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 16, letterSpacing: 2 }}>
              VARIATION {data.num} / 05
            </span>
          </div>

          <div
            style={{
              color: '#94A3B8',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 14,
              letterSpacing: 1.5,
              fontWeight: 700,
            }}
          >
            REMOTION 3D ASSET ENGINE
          </div>
        </div>

        {/* Right: Real-time Telemetry Cards */}
        <div style={{ display: 'flex', gap: 14 }}>
          {data.telemetry.map((t, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
                padding: '8px 16px',
                textAlign: 'right',
              }}
            >
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#94A3B8', letterSpacing: 1 }}>
                {t.label}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 900, color: data.color }}>
                {t.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ──────────────── Bottom Main Title Banner ──────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          left: 50,
          right: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 20,
            padding: '18px 32px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
            maxWidth: 1100,
          }}
        >
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13,
              fontWeight: 800,
              color: data.color,
              letterSpacing: 2.5,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            {data.subtitle}
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: -0.5,
              lineHeight: 1.15,
            }}
          >
            {data.title}
          </div>
        </div>

        {/* Right: Technical Spec Card */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(16px)',
            border: `2px solid ${data.color}88`,
            borderRadius: 18,
            padding: '16px 28px',
            textAlign: 'center',
            boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
          }}
        >
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#94A3B8', letterSpacing: 1.5 }}>
            3D RIG RIGID-BODY
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
            CHEVY NOVA GLB
          </div>
        </div>
      </div>

      {/* ──────────────── Bottom Scrub Progress Bar ──────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 50,
          right: 50,
          height: 4,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progressPct}%`,
            height: '100%',
            background: data.color,
            boxShadow: `0 0 12px ${data.color}`,
          }}
        />
      </div>

      {/* ──────────────── Corner Viewfinder Crop Marks ──────────────── */}
      <div style={{ position: 'absolute', top: 24, left: 24, width: 20, height: 20, borderLeft: `2px solid ${data.color}88`, borderTop: `2px solid ${data.color}88` }} />
      <div style={{ position: 'absolute', top: 24, right: 24, width: 20, height: 20, borderRight: `2px solid ${data.color}88`, borderTop: `2px solid ${data.color}88` }} />
      <div style={{ position: 'absolute', bottom: 24, left: 24, width: 20, height: 20, borderLeft: `2px solid ${data.color}88`, borderBottom: `2px solid ${data.color}88` }} />
      <div style={{ position: 'absolute', bottom: 24, right: 24, width: 20, height: 20, borderRight: `2px solid ${data.color}88`, borderBottom: `2px solid ${data.color}88` }} />
    </div>
  );
};

