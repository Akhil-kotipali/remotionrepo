import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { FONT, STAGE } from './theme';
import { Pill, Stage, ramp, usePop } from './parts';

type Beats = {
  water: number;
  gauge: number;
  heavy: number;
  pipe: number;
  drop: number;
  cross: number;
  off: number;
};

// Enlarged Tank & Gauge to dominate the vertical screen and reduce white space
const TANK = { x: 70, y: 100, w: 370, h: 640 };
const GAUGE = { x: 730, y: 100, w: 130, h: 640 };
const CUTOFF = 0.32; // Cutoff voltage line (~3.2V)

export const Scene4Tank: React.FC<{ b: Beats }> = ({ b }) => {
  const f = useCurrentFrame();

  const tankIn = ramp(f, [[0, 0], [20, 1]]);
  // Water rises to 20% charge
  const level = ramp(f, [[b.water, 0], [b.water + 20, 0.22]]);
  const waterH = TANK.h * level;
  const chargeTag = usePop(f, b.water + 12);

  // Pressure / Voltage Gauge
  const gaugeIn = usePop(f, b.gauge);
  const lvl = ramp(f, [
    [b.gauge, 0],
    [b.gauge + 14, 0.88], // Healthy pressure
    [b.heavy, 0.88],
    [b.heavy + 10, 0.70], // Heavy app draws current
    [b.pipe, 0.70],
    [b.pipe + 14, 0.52], // Pipe narrows (resistance up)
    [b.drop, 0.52],
    [b.cross - 2, 0.38],
    [b.cross + 8, 0.16], // Crosses below minimum threshold
  ]);
  const crossed = lvl < CUTOFF;

  // Pipe thickness (narrows when cold/aging)
  const pipeT = ramp(f, [[b.pipe, 76], [b.pipe + 16, 24]]);
  const speed = f < b.heavy ? 3 : f < b.pipe ? 7 : f < b.cross ? 4 : 1;
  const flowAlpha = ramp(f, [[b.cross, 1], [b.cross + 12, 0.15]]);
  const pipeY = 660;

  const heavy = usePop(f, b.heavy);
  const cold = usePop(f, b.pipe);
  const off = usePop(f, b.off);
  const flash = f >= b.cross && f < b.cross + 8 ? 0.3 * (1 - (f - b.cross) / 8) : 0;

  // Dynamic voltage calculation string
  const currentVolts = (2.8 + lvl * 1.4).toFixed(2);

  return (
    <AbsoluteFill>
      <Stage>
        <svg width={1080} height={STAGE.height} style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            <linearGradient id="tankGlass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.12" />
              <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.35" />
            </linearGradient>

            <clipPath id="tankClip">
              <rect x={TANK.x + 8} y={TANK.y + 8} width={TANK.w - 16} height={TANK.h - 16} rx={32} />
            </clipPath>

            <clipPath id="gaugeClip">
              <rect x={GAUGE.x + 8} y={GAUGE.y + 8} width={GAUGE.w - 16} height={GAUGE.h - 16} rx={26} />
            </clipPath>
          </defs>

          {/* 1. Main Water Tank (Acrylic Beaker with Metric Markings) */}
          <rect
            x={TANK.x}
            y={TANK.y}
            width={TANK.w}
            height={TANK.h}
            rx={38}
            fill="#FFFFFF"
            stroke="#1E293B"
            strokeWidth={9}
            strokeDasharray={2 * (TANK.w + TANK.h)}
            strokeDashoffset={(1 - tankIn) * 2 * (TANK.w + TANK.h)}
            filter="drop-shadow(0 25px 50px rgba(15,23,42,0.18))"
          />

          {/* Fluid in Tank */}
          <g clipPath="url(#tankClip)">
            <rect
              x={TANK.x}
              y={TANK.y + TANK.h - waterH}
              width={TANK.w}
              height={waterH}
              fill="url(#waterGrad)"
            />
            {/* Liquid Surface Meniscus */}
            <ellipse
              cx={TANK.x + TANK.w / 2}
              cy={TANK.y + TANK.h - waterH}
              rx={TANK.w / 2}
              ry={10}
              fill="#7DD3FC"
              opacity={level > 0.05 ? 0.95 : 0}
            />
            {/* Glass Sheen Overlay */}
            <rect x={TANK.x} y={TANK.y} width={TANK.w} height={TANK.h} fill="url(#tankGlass)" />
          </g>

          {/* Tank Graduated Volume Ticks */}
          {[0.2, 0.4, 0.6, 0.8].map((pct) => (
            <g key={pct}>
              <line
                x1={TANK.x + 14}
                y1={TANK.y + TANK.h * (1 - pct)}
                x2={TANK.x + 44}
                y2={TANK.y + TANK.h * (1 - pct)}
                stroke="#64748B"
                strokeWidth={3.5}
                strokeLinecap="round"
              />
              <text
                x={TANK.x + 52}
                y={TANK.y + TANK.h * (1 - pct) + 6}
                fontFamily={FONT.mono}
                fontSize={17}
                fontWeight={800}
                fill="#94A3B8"
              >
                {Math.round(pct * 100)}%
              </text>
            </g>
          ))}

          {/* 2. Heavy-Duty Industrial Pipe */}
          {/* Outer Pipe Shadow & Body */}
          <line x1={TANK.x + TANK.w} y1={pipeY} x2={GAUGE.x} y2={pipeY} stroke="#1E293B" strokeWidth={pipeT + 18} strokeLinecap="round" />
          <line x1={TANK.x + TANK.w} y1={pipeY} x2={GAUGE.x} y2={pipeY} stroke="#F1F5F9" strokeWidth={pipeT} strokeLinecap="butt" />

          {/* Water flow stream through pipe */}
          {level > 0.12 &&
            [0, 1, 2, 3, 4, 5].map((i) => {
              const span = GAUGE.x - (TANK.x + TANK.w) - 30;
              const x = TANK.x + TANK.w + 15 + ((f * speed + i * (span / 6)) % span);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={pipeY}
                  r={Math.max(5, pipeT / 4.2)}
                  fill="#0284C7"
                  opacity={flowAlpha}
                />
              );
            })}

          {/* Pipe Squeeze Clamp Visual Indicator */}
          {f >= b.pipe && (
            <g transform={`translate(585, ${pipeY - 60})`}>
              <rect x="-10" y="0" width="20" height="120" rx="6" fill="#E2E8F0" stroke="#334155" strokeWidth="4.5" />
              <circle cx="0" cy="60" r="12" fill="#EF4444" />
            </g>
          )}

          {/* 3. Pressure / Voltage Gauge */}
          <g opacity={Math.min(1, gaugeIn * 1.5)}>
            {/* Outer Gauge Chassis */}
            <rect
              x={GAUGE.x}
              y={GAUGE.y}
              width={GAUGE.w}
              height={GAUGE.h}
              rx={32}
              fill="#FFFFFF"
              stroke="#1E293B"
              strokeWidth={9}
              filter="drop-shadow(0 25px 50px rgba(15,23,42,0.18))"
            />

            {/* Gauge Liquid / Voltage Bar */}
            <g clipPath="url(#gaugeClip)">
              <rect
                x={GAUGE.x}
                y={GAUGE.y + GAUGE.h * (1 - lvl)}
                width={GAUGE.w}
                height={GAUGE.h * lvl}
                fill={crossed ? 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)' : 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)'}
                filter={crossed ? 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.85))' : 'none'}
              />
            </g>

            {/* Cutoff Limit Line (Red Alert Threshold) */}
            {/* Stops cleanly at the gauge tube outer edge so it NEVER overlaps the red text box */}
            <line
              x1={GAUGE.x - 40}
              y1={GAUGE.y + GAUGE.h * (1 - CUTOFF)}
              x2={GAUGE.x + GAUGE.w}
              y2={GAUGE.y + GAUGE.h * (1 - CUTOFF)}
              stroke="#EF4444"
              strokeWidth={5}
              strokeDasharray="12 8"
            />
            {/* Clean connector tick ending right at the box border */}
            <line
              x1={GAUGE.x + GAUGE.w}
              y1={GAUGE.y + GAUGE.h * (1 - CUTOFF)}
              x2={GAUGE.x + GAUGE.w + 14}
              y2={GAUGE.y + GAUGE.h * (1 - CUTOFF)}
              stroke="#EF4444"
              strokeWidth={3}
            />
            <rect
              x={GAUGE.x - 42}
              y={GAUGE.y + GAUGE.h * (1 - CUTOFF) - 15}
              width={30}
              height={30}
              rx={6}
              fill="#EF4444"
            />
            <text
              x={GAUGE.x - 33}
              y={GAUGE.y + GAUGE.h * (1 - CUTOFF) + 6}
              fill="#FFFFFF"
              fontFamily={FONT.sans}
              fontWeight={900}
              fontSize={20}
            >
              !
            </text>
          </g>
        </svg>

        {/* Tank Label: Charge */}
        <div
          style={{
            position: 'absolute',
            left: TANK.x,
            top: TANK.y - 68,
            width: TANK.w,
            textAlign: 'center',
            opacity: chargeTag,
          }}
        >
          <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 28, color: '#0284C7', letterSpacing: 2, background: 'rgba(2, 132, 199, 0.12)', padding: '8px 22px', borderRadius: 999 }}>
            WATER = CHARGE
          </span>
        </div>

        {/* 20% Water Level Text */}
        <div
          style={{
            position: 'absolute',
            left: TANK.x,
            top: TANK.y + TANK.h - Math.max(waterH, 1) / 2 - 42,
            width: TANK.w,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontWeight: 900,
            fontSize: 72,
            color: '#FFFFFF',
            letterSpacing: -2,
            textShadow: '0 4px 16px rgba(0,0,0,0.45)',
            opacity: level > 0.12 ? 1 : 0,
          }}
        >
          20%
        </div>

        {/* Gauge Label: Pressure / Voltage */}
        <div
          style={{
            position: 'absolute',
            left: GAUGE.x - 50,
            top: GAUGE.y - 68,
            width: GAUGE.w + 100,
            textAlign: 'center',
            opacity: gaugeIn,
          }}
        >
          <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 24, color: crossed ? '#EF4444' : '#2563EB', letterSpacing: 1.5, background: crossed ? 'rgba(239,68,68,0.12)' : 'rgba(37,99,235,0.12)', padding: '8px 20px', borderRadius: 999 }}>
            PRESSURE = VOLTAGE
          </span>
        </div>

        {/* Live Digital Voltage Telemetry */}
        {gaugeIn > 0.5 && (
          <div
            style={{
              position: 'absolute',
              left: GAUGE.x + GAUGE.w + 20,
              top: GAUGE.y + GAUGE.h * (1 - lvl) - 24,
              fontFamily: FONT.mono,
              fontWeight: 900,
              fontSize: 34,
              color: crossed ? '#EF4444' : '#1E293B',
              background: '#FFFFFF',
              padding: '8px 18px',
              borderRadius: 12,
              boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
              border: `2.5px solid ${crossed ? '#EF4444' : '#E2E8F0'}`,
            }}
          >
            {currentVolts} V
          </div>
        )}

        {/* Red Cutoff Warning Pill - Clean solid background, no line passing through */}
        <div
          style={{
            position: 'absolute',
            left: GAUGE.x + GAUGE.w + 14,
            top: GAUGE.y + GAUGE.h * (1 - CUTOFF) - 22,
            fontFamily: FONT.mono,
            fontWeight: 800,
            fontSize: 20,
            color: '#EF4444',
            letterSpacing: 1,
            background: '#FFFFFF',
            padding: '7px 18px',
            borderRadius: 10,
            border: '2.5px solid #EF4444',
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.2)',
            zIndex: 15,
            whiteSpace: 'nowrap',
          }}
        >
          CUTOFF (3.2V)
        </div>

        {/* Interactive Event Pills */}
        <Pill text="HEAVY APP LOAD" color="#F59E0B" x={585} y={230} p={heavy} size={30} icon="⚡" />
        <Pill text="COLD / AGING RESISTANCE" color="#6366F1" x={585} y={340} p={cold} size={30} icon="❄️" />
        <Pill text="PHONE SHUTS OFF" color="#EF4444" x={540} y={850} p={off} size={38} icon="⚠️" />
      </Stage>

      {/* Screen flash on crossing critical line */}
      <AbsoluteFill style={{ background: '#EF4444', opacity: flash }} />
    </AbsoluteFill>
  );
};
