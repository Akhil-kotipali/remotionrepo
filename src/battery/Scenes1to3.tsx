import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT, STAGE } from './theme';
import { HookPhone, PhoneFrame, Pill, Stage, PHONE, ramp, usePop, HookQuestion } from './parts';

/* ───────── Scene 1 · Hook ───────── */
export const Scene1Hook: React.FC<{ camera: number; die: number }> = ({ camera, die }) => {
  const f = useCurrentFrame();
  const camScale = interpolate(f, [camera, camera + 6, camera + 14], [1, 1.35, 1.1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isOpeningCamera = f >= camera && f < die;
  const dead = f >= die;
  const flash = f >= die ? interpolate(f, [die, die + 1, die + 8], [1, 0.9, 0], { extrapolateRight: 'clamp' }) : 0;

  return (
    <AbsoluteFill>
      {/* Critical: Main Question on Screen Immediately from Frame 0 */}
      <HookQuestion opacity={dead ? 0.8 : 1} />

      <Stage>
        <HookPhone dead={dead} cameraScale={camScale} isOpeningCamera={isOpeningCamera} />
      </Stage>

      {/* Dramatic sudden shutdown flash & glitch */}
      <AbsoluteFill style={{ background: '#EF4444', opacity: flash * 0.4, mixBlendMode: 'overlay', pointerEvents: 'none' }} />
      <AbsoluteFill style={{ background: '#020617', opacity: flash * 0.9, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

/* ───────── Scene 2 · Twist ───────── */
export const Scene2Twist: React.FC<{ powerOn: number; empty: number }> = ({ powerOn, empty }) => {
  const f = useCurrentFrame();
  const on = ramp(f, [[powerOn, 0], [powerOn + 8, 1]]);
  const wire = ramp(f, [[powerOn + 10, 0], [powerOn + 24, 1]]);
  const cellP = usePop(f, powerOn + 16);
  const tag = usePop(f, empty);
  const pulse = 0.5 + 0.5 * Math.sin(f / 4);

  const screenBg = wire > 0.5
    ? 'rgba(15, 23, 42, 0.96)'
    : `rgb(${Math.round(5 + on * 24)},${Math.round(7 + on * 35)},${Math.round(13 + on * 50)})`;

  return (
    <AbsoluteFill>
      <Stage>
        <PhoneFrame screen={screenBg} wire={wire}>
          {/* Internal Battery Pack (Enlarged to fill the screen) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: cellP,
              padding: 24,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 270,
                height: 520,
                transform: `scale(${0.85 + 0.15 * cellP})`,
                borderRadius: 28,
                background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                border: '2.5px solid rgba(56, 189, 248, 0.6)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.25)',
                padding: '20px 18px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Top Battery Terminals */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 28px', marginTop: -32 }}>
                <div style={{ width: 34, height: 16, background: '#F59E0B', borderRadius: '4px 4px 0 0', border: '1px solid #D97706', boxShadow: '0 0 12px rgba(245, 158, 11, 0.6)' }} />
                <div style={{ width: 34, height: 16, background: '#94A3B8', borderRadius: '4px 4px 0 0', border: '1px solid #64748B' }} />
              </div>

              {/* Battery Header Specs */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 16, color: '#38BDF8', letterSpacing: 1 }}>
                    LI-ION CELL
                  </span>
                  <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 14, color: '#94A3B8' }}>
                    4500 mAh · 17.3 Wh
                  </span>
                </div>
                <div style={{ width: '100%', height: 1.5, background: 'rgba(255,255,255,0.12)', margin: '10px 0' }} />
              </div>

              {/* Glowing Electrolyte Core */}
              <div
                style={{
                  flex: 1,
                  margin: '12px 0',
                  borderRadius: 18,
                  background: 'rgba(2, 6, 23, 0.75)',
                  border: '1.5px solid rgba(56, 189, 248, 0.35)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                {/* 22% Charge Level Inside Cell */}
                <div
                  style={{
                    width: '100%',
                    height: '24%',
                    background: 'linear-gradient(180deg, #38BDF8 0%, #0284C7 100%)',
                    boxShadow: `0 0 ${30 + 30 * pulse}px #38BDF8`,
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'absolute', top: 6, left: '25%', width: 8, height: 8, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 0 10px #FFFFFF' }} />
                  <div style={{ position: 'absolute', top: 12, left: '70%', width: 6, height: 6, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 0 8px #FFFFFF' }} />
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: '35%',
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontFamily: FONT.mono,
                    fontWeight: 900,
                    fontSize: 18,
                    color: '#38BDF8',
                    letterSpacing: 1.5,
                  }}
                >
                  ⚡ CHARGE STILL PRESENT
                </div>
              </div>

              {/* Bottom Specs */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT.mono, fontSize: 13, fontWeight: 700, color: '#94A3B8' }}>
                <span>NOMINAL: 3.85V</span>
                <span style={{ color: '#10B981' }}>ENERGY &gt; 0</span>
              </div>
            </div>
          </div>
        </PhoneFrame>

        <Pill
          text="BATTERY WAS NEVER EMPTY"
          color="#0284C7"
          x={STAGE.cx}
          y={STAGE.cy + PHONE.h / 2 + 85}
          p={tag}
          size={32}
          icon="🔋"
        />
      </Stage>
    </AbsoluteFill>
  );
};

/* ───────── Scene 3 · Mechanism (Microchip BMS Fuel Gauge) ───────── */
export const Scene3Chip: React.FC<{ estimate: number }> = ({ estimate }) => {
  const f = useCurrentFrame();
  const chipP = usePop(f, 0, 18);
  const rows = [
    { label: 'CURRENT (A)', value: '2.4 A', color: '#38BDF8', y: 300, t: 8 },
    { label: 'VOLTAGE (V)', value: '3.62 V', color: '#10B981', y: 500, t: 16 },
    { label: 'TEMP (°C)', value: '24.5 °C', color: '#A855F7', y: 700, t: 24 },
  ];
  const badge = usePop(f, estimate);
  const out = ramp(f, [[30, 0], [44, 1]]);

  return (
    <AbsoluteFill>
      <Stage>
        <svg width={1080} height={1000} style={{ position: 'absolute', inset: 0 }}>
          {rows.map((r) => {
            const p = ramp(f, [[r.t, 0], [r.t + 14, 1]]);
            const x1 = 330;
            const x2 = 430;
            const dot = ((f * 4 + r.t * 8) % 120) / 120;
            return (
              <g key={r.label}>
                <line x1={x1} y1={r.y} x2={x2} y2={r.y} stroke="rgba(255,255,255,0.18)" strokeWidth={10} strokeLinecap="round" />
                <line x1={x1} y1={r.y} x2={x1 + (x2 - x1) * p} y2={r.y} stroke={r.color} strokeWidth={10} strokeLinecap="round" />
                {p >= 1 && (
                  <circle cx={x1 + (x2 - x1) * dot} cy={r.y} r={10} fill="#FFFFFF" filter="drop-shadow(0 0 8px #fff)" />
                )}
              </g>
            );
          })}

          {/* Output Signal to OS */}
          <line x1={650} y1={500} x2={650 + 140 * out} y2={500} stroke="#F59E0B" strokeWidth={12} strokeLinecap="round" />
          {out >= 1 && (
            <circle cx={650 + 140 * (((f * 4) % 140) / 140)} cy={500} r={11} fill="#F59E0B" />
          )}
        </svg>

        {/* Input Sensors Telemetry Labels (Enlarged) */}
        {rows.map((r) => (
          <div
            key={r.label}
            style={{
              position: 'absolute',
              left: 50,
              top: r.y - 44,
              opacity: ramp(f, [[r.t, 0], [r.t + 8, 1]]),
              background: 'rgba(15,23,42,0.92)',
              padding: '14px 24px',
              borderRadius: 18,
              border: `2px solid ${r.color}77`,
              boxShadow: '0 10px 25px rgba(0,0,0,0.35)',
            }}
          >
            <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 18, color: r.color, letterSpacing: 1.5 }}>
              {r.label}
            </div>
            <div style={{ fontFamily: FONT.mono, fontWeight: 900, fontSize: 32, color: '#FFFFFF', marginTop: 3 }}>
              {r.value}
            </div>
          </div>
        ))}

        {/* Center BMS Silicon IC Chip (Enlarged to 280x280) */}
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 500,
            transform: `translate(-50%, -50%) scale(${0.75 + 0.25 * chipP})`,
            width: 280,
            height: 280,
            borderRadius: 32,
            background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
            border: '3.5px solid #334155',
            boxShadow: '0 30px 70px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            boxSizing: 'border-box',
            zIndex: 10,
          }}
        >
          <div style={{ position: 'absolute', top: 14, left: 14, width: 16, height: 16, borderRadius: '50%', background: '#334155' }} />

          <div style={{ fontFamily: FONT.mono, fontSize: 15, color: '#64748B', letterSpacing: 2, fontWeight: 700 }}>
            TEXAS INSTR.
          </div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 34, color: '#F8FAFC', letterSpacing: -0.5, marginTop: 4 }}>
            BQ27421
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 14, color: '#38BDF8', letterSpacing: 2, marginTop: 6, background: 'rgba(56,189,248,0.12)', padding: '4px 12px', borderRadius: 8 }}>
            BMS FUEL GAUGE
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 12, color: '#475569', marginTop: 10 }}>
            STATE-OF-CHARGE ESTIMATOR
          </div>
        </div>

        {/* Output Estimated Result Pill (Enlarged) */}
        <div
          style={{
            position: 'absolute',
            left: 810,
            top: 500,
            transform: `translateY(-50%) scale(${0.8 + 0.2 * badge})`,
            opacity: badge,
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            borderRadius: 26,
            padding: '20px 30px',
            color: '#FFFFFF',
            boxShadow: '0 20px 45px rgba(245, 158, 11, 0.45)',
            border: '2.5px solid rgba(255,255,255,0.35)',
          }}
        >
          <div style={{ fontFamily: FONT.mono, fontSize: 16, fontWeight: 800, letterSpacing: 1.5 }}>
            ESTIMATE ONLY
          </div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 52, letterSpacing: -1, marginTop: 2 }}>
            20%
          </div>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};
