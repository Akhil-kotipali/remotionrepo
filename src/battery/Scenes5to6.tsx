import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { FONT, STAGE } from './theme';
import { HookPhone, Pill, Stage, ramp, usePop } from './parts';

/* ───────── Scene 5 · Proof ───────── */
export const Scene5Proof: React.FC<{ minus: number; shown: number }> = ({ minus, shown }) => {
  const f = useCurrentFrame();
  const card = usePop(f, 0, 18);
  const temp = usePop(f, minus);
  const pct = usePop(f, shown);
  const stop = usePop(f, shown + 20);

  return (
    <AbsoluteFill>
      {/* Sub-Zero Ice Frost Atmospheric Vignette */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: STAGE.top,
          width: 1080,
          height: STAGE.height,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(248,250,252,0) 25%, rgba(56,189,248,0.2) 100%)',
          boxShadow: 'inset 0 0 120px rgba(56, 189, 248, 0.3)',
        }}
      />

      <Stage>
        {/* Research Lab Dossier Card - Expanded to 960x750 */}
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 40,
            width: 960,
            height: 750,
            borderRadius: 38,
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)',
            border: '3px solid #CBD5E1',
            boxShadow: '0 40px 90px -15px rgba(15,23,42,0.22), 0 15px 30px rgba(0,0,0,0.06)',
            transform: `translateY(${(1 - card) * 50}px)`,
            opacity: card,
            padding: '46px 54px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Header Lab Stamp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 32 }}>🏛️</span>
                <span style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 36, color: '#0F172A', letterSpacing: -0.5 }}>
                  University of Michigan
                </span>
              </div>
              <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 20, color: '#64748B', marginTop: 6 }}>
                He, Lee, Kim, Shin · ICCPS Real-World Benchmark
              </div>
            </div>

            <div
              style={{
                background: 'rgba(56,189,248,0.14)',
                border: '2px solid #38BDF8',
                borderRadius: 999,
                padding: '8px 20px',
                fontFamily: FONT.mono,
                fontWeight: 800,
                fontSize: 16,
                color: '#0284C7',
                letterSpacing: 1.5,
              }}
            >
              CRYOGENIC LAB TEST
            </div>
          </div>

          {/* Center: -15°C Temperature Gauge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              borderRadius: 32,
              padding: '28px 44px',
              border: '2.5px solid rgba(56,189,248,0.35)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              opacity: temp,
              transform: `scale(${0.9 + 0.1 * temp})`,
            }}
          >
            <div>
              <div style={{ fontFamily: FONT.mono, fontSize: 16, color: '#94A3B8', letterSpacing: 2 }}>
                TEST AMBIENT TEMPERATURE
              </div>
              <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 126, letterSpacing: -5, color: '#38BDF8', marginTop: -10 }}>
                −15°C
              </div>
            </div>

            {/* Ice Frost Snowflake Icon */}
            <div style={{ fontSize: 88, filter: 'drop-shadow(0 0 20px #38BDF8)' }}>
              ❄️
            </div>
          </div>

          {/* Bottom Telemetry: 30% Shown vs Unexpected Death */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#F1F5F9',
              borderRadius: 24,
              padding: '22px 34px',
              opacity: pct,
              border: '1.5px solid #E2E8F0',
            }}
          >
            <div>
              <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 18, color: '#64748B' }}>
                REPORTED SCREEN PERCENTAGE
              </div>
              <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 62, color: '#0284C7', letterSpacing: -1.5 }}>
                30% ACTIVE
              </div>
            </div>

            <div
              style={{
                background: '#EF4444',
                color: '#FFFFFF',
                borderRadius: 16,
                padding: '14px 26px',
                fontFamily: FONT.mono,
                fontWeight: 900,
                fontSize: 24,
                letterSpacing: 1.5,
                boxShadow: '0 10px 24px rgba(239, 68, 68, 0.45)',
              }}
            >
              DEVICE DIED
            </div>
          </div>
        </div>

        <Pill text="PREMATURE SHUTDOWN" color="#EF4444" x={540} y={850} p={stop} size={38} icon="⚠️" />
      </Stage>
    </AbsoluteFill>
  );
};

/* ───────── Scene 6 · Takeaway + loop ───────── */
export const Scene6Loop: React.FC<{ energy: number; pressure: number; loop: number; len: number }> = ({
  energy,
  pressure,
  loop,
  len,
}) => {
  const f = useCurrentFrame();
  const start = Math.min(loop, len - 16);
  const panels = usePop(f, 0, 18);
  const hit = usePop(f, energy);
  const crash = ramp(f, [[pressure, 0], [pressure + 14, 1]]);
  const tag = usePop(f, pressure + 6);
  const panelOut = ramp(f, [[start, 1], [start + 12, 0]]);
  const phoneIn = ramp(f, [[start + 4, 0], [len - 1, 1]]);
  const phoneScale = 1 + 0.3 * (1 - phoneIn);
  const barH = 220;

  return (
    <AbsoluteFill>
      <Stage opacity={panelOut}>
        {/* Top: Side-by-side Comparison Cards */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 40, opacity: panels }}>
          {/* Card 1: Energy Remaining (Q) */}
          <div
            style={{
              width: 450,
              background: '#FFFFFF',
              borderRadius: 36,
              padding: '32px 28px',
              border: '3px solid #38BDF8',
              boxShadow: '0 25px 60px rgba(15,23,42,0.14)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: FONT.mono, fontWeight: 900, fontSize: 26, color: '#0284C7', letterSpacing: 1.5 }}>
              ENERGY (CHARGE)
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 15, color: '#64748B', marginTop: 4, fontWeight: 600 }}>
              STILL INSIDE BATTERY
            </div>

            {/* Battery Tank Meter */}
            <div
              style={{
                position: 'relative',
                margin: '22px auto',
                width: 150,
                height: barH,
                borderRadius: 24,
                border: '6px solid #1E293B',
                background: '#F8FAFC',
                overflow: 'hidden',
                transform: `scale(${1 + 0.05 * hit})`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '24%',
                  background: 'linear-gradient(180deg, #38BDF8 0%, #0284C7 100%)',
                  boxShadow: '0 0 25px #38BDF8',
                }}
              />
            </div>

            <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 62, color: '#0284C7', letterSpacing: -2, opacity: hit }}>
              20%
            </div>
            <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 16, color: '#0284C7', letterSpacing: 0.5, marginTop: 4 }}>
              AVAILABLE CHARGE
            </div>
          </div>

          {/* Card 2: Voltage Pressure (V) */}
          <div
            style={{
              width: 450,
              background: '#FFFFFF',
              borderRadius: 36,
              padding: '32px 28px',
              border: `3px solid ${crash > 0.4 ? '#EF4444' : '#E2E8F0'}`,
              boxShadow: '0 25px 60px rgba(15,23,42,0.14)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: FONT.mono, fontWeight: 900, fontSize: 26, color: '#EF4444', letterSpacing: 1.5 }}>
              VOLTAGE (PRESSURE)
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 15, color: '#64748B', marginTop: 4, fontWeight: 600 }}>
              COLLAPSED UNDER LOAD
            </div>

            {/* Collapsed Pressure Meter */}
            <div
              style={{
                position: 'relative',
                margin: '22px auto',
                width: 150,
                height: barH,
                borderRadius: 24,
                border: '6px solid #1E293B',
                background: '#F8FAFC',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${Math.max(10, (0.8 - 0.7 * crash) * 100)}%`,
                  background: crash > 0.4 ? 'linear-gradient(180deg, #EF4444 0%, #B91C1C 100%)' : 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
                  boxShadow: crash > 0.4 ? '0 0 30px #EF4444' : 'none',
                }}
              />
            </div>

            <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 62, color: '#EF4444', letterSpacing: -2 }}>
              {crash > 0.5 ? '< 3.2V' : '3.8V'}
            </div>
            <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 16, color: '#EF4444', letterSpacing: 0.5, marginTop: 4 }}>
              {crash > 0.5 ? 'CUTOFF HIT' : 'HEALTHY'}
            </div>
          </div>
        </div>

        {/* High-Impact Memorable Takeaway Banner - Delivers the promised answer */}
        <div
          style={{
            margin: '36px auto 0',
            width: 932,
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: 28,
            padding: '24px 36px',
            border: '2.5px solid rgba(239, 68, 68, 0.45)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            textAlign: 'center',
            opacity: tag,
            transform: `scale(${0.92 + 0.08 * tag})`,
          }}
        >
          <div style={{ fontFamily: FONT.mono, fontSize: 16, color: '#94A3B8', letterSpacing: 2, fontWeight: 700 }}>
            THE KEY TAKEAWAY
          </div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 36, color: '#FFFFFF', marginTop: 6, letterSpacing: -1, lineHeight: 1.25 }}>
            YOUR PHONE HAD <span style={{ color: '#38BDF8' }}>ENERGY</span>, BUT LOST THE <span style={{ color: '#EF4444' }}>PRESSURE</span>.
          </div>
        </div>

        <Pill text="RAN OUT OF PRESSURE, NOT CHARGE" color="#EF4444" x={540} y={880} p={tag} size={36} icon="💡" />
      </Stage>

      {/* Final Replay Seam (Zooms out onto the exact Scene 1 Frame 0) */}
      <Stage opacity={phoneIn}>
        <HookPhone scale={phoneScale} />
      </Stage>
    </AbsoluteFill>
  );
};
