import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, W } from './theme';
import { ramp, usePop, Stage } from './parts';

/* ════════════════════════════════════════════════════════════
   SCENE 5: STRUCTURAL ANALYSIS – Load path & weight distribution
   ════════════════════════════════════════════════════════════ */
export const Scene5Structure: React.FC<{ loadPath: number; twelve: number }> = ({
  loadPath,
  twelve,
}) => {
  const f = useCurrentFrame();

  const titlePop = usePop(f, 4);
  const loadPop = usePop(f, loadPath);

  // Animated force arrows
  const forceProgress = ramp(f, [[loadPath, 0], [loadPath + 20, 1]]);

  return (
    <Stage>
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 0,
          width: W,
          textAlign: 'center',
          opacity: titlePop,
        }}
      >
        <div style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 700, color: C.teal, letterSpacing: 3 }}>
          ● STRUCTURAL ANALYSIS
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 38, fontWeight: 900, color: C.ink, marginTop: 4, letterSpacing: -1 }}>
          WEIGHT DISTRIBUTION
        </div>
      </div>

      {/* Load path diagram */}
      <svg
        width={W - 60}
        height={850}
        viewBox="0 0 1020 850"
        style={{
          position: 'absolute',
          left: 30,
          top: 130,
        }}
      >
        {/* Central tower cross-section */}
        <g opacity={ramp(f, [[4, 0], [14, 1]])}>
          {/* 12 tiers */}
          {Array.from({ length: 12 }, (_, i) => {
            const tierW = 400 - i * 28;
            const tierH = 50;
            const x = 510 - tierW / 2;
            const y = 740 - i * 56;
            const tierOpacity = ramp(f, [[twelve - 2 + i * 0.8, 0], [twelve + 2 + i * 0.8, 1]]);
            const isHighlighted = i < 12 * forceProgress;

            return (
              <g key={i} opacity={tierOpacity}>
                <rect
                  x={x}
                  y={y}
                  width={tierW}
                  height={tierH}
                  rx="4"
                  fill={isHighlighted ? 'rgba(217,119,6,0.2)' : 'rgba(41,37,36,0.6)'}
                  stroke={isHighlighted ? C.amber : C.grid}
                  strokeWidth={isHighlighted ? 2 : 1}
                />
                {/* Tier number */}
                <text
                  x={x + tierW + 14}
                  y={y + tierH / 2 + 5}
                  fill={isHighlighted ? C.amber : C.mute}
                  fontFamily="monospace"
                  fontWeight="700"
                  fontSize="13"
                >
                  T{12 - i}
                </text>

                {/* Force arrow down through tier */}
                {isHighlighted && (
                  <g>
                    <line
                      x1="510"
                      y1={y}
                      x2="510"
                      y2={y + tierH}
                      stroke={C.red}
                      strokeWidth="2"
                      markerEnd="url(#arrowRed)"
                    />
                    {/* Side distribution arrows */}
                    <line x1="510" y1={y + tierH / 2} x2={x + 20} y2={y + tierH} stroke={C.teal} strokeWidth="1.5" strokeDasharray="4 2" />
                    <line x1="510" y1={y + tierH / 2} x2={x + tierW - 20} y2={y + tierH} stroke={C.teal} strokeWidth="1.5" strokeDasharray="4 2" />
                  </g>
                )}
              </g>
            );
          })}
        </g>

        <defs>
          <marker id="arrowRed" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={C.red} />
          </marker>
        </defs>

        {/* Kumbam at the top */}
        <g opacity={loadPop} transform={`translate(510, 60) scale(${0.8 + loadPop * 0.2})`}>
          <polygon points="0,-30 25,-15 25,15 0,30 -25,15 -25,-15" fill="#FDE68A" stroke={C.amber} strokeWidth="3" />
          <text x="0" y="55" textAnchor="middle" fill={C.amber} fontFamily="monospace" fontWeight="900" fontSize="16">80T ↓</text>
        </g>

        {/* Ground / Foundation */}
        <rect x="160" y="800" width="700" height="40" rx="6" fill={C.grid} stroke="#44403C" strokeWidth="2" />
        <text x="510" y="828" textAnchor="middle" fill={C.mute} fontFamily="monospace" fontWeight="700" fontSize="14">
          FOUNDATION — ZERO CRACKS AFTER 1000 YEARS
        </text>

        {/* Force magnitude labels */}
        <g opacity={ramp(f, [[loadPath + 6, 0], [loadPath + 14, 1]])}>
          <rect x="40" y="200" width="120" height="90" rx="10" fill={C.dark} stroke={C.red} strokeWidth="1.5" />
          <text x="100" y="225" textAnchor="middle" fill={C.red} fontFamily="monospace" fontWeight="900" fontSize="14">LOAD</text>
          <text x="100" y="250" textAnchor="middle" fill={C.ink} fontFamily="monospace" fontWeight="700" fontSize="20">80 T</text>
          <text x="100" y="275" textAnchor="middle" fill={C.mute} fontFamily="monospace" fontWeight="600" fontSize="12">784 kN</text>
        </g>

        <g opacity={ramp(f, [[twelve + 4, 0], [twelve + 12, 1]])}>
          <rect x="840" y="200" width="150" height="90" rx="10" fill={C.dark} stroke={C.teal} strokeWidth="1.5" />
          <text x="915" y="225" textAnchor="middle" fill={C.teal} fontFamily="monospace" fontWeight="900" fontSize="14">DISTRIBUTION</text>
          <text x="915" y="250" textAnchor="middle" fill={C.ink} fontFamily="monospace" fontWeight="700" fontSize="16">12 TIERS</text>
          <text x="915" y="275" textAnchor="middle" fill={C.mute} fontFamily="monospace" fontWeight="600" fontSize="12">DIMINISHING</text>
        </g>
      </svg>
    </Stage>
  );
};

/* ════════════════════════════════════════════════════════════
   SCENE 6: THE RAMP THEORY – 6km earthen ramp
   ════════════════════════════════════════════════════════════ */
export const Scene6Ramp: React.FC<{ sixKm: number; fiveDeg: number; elephants: number }> = ({
  sixKm,
  fiveDeg,
  elephants,
}) => {
  const f = useCurrentFrame();

  const titlePop = usePop(f, 4);
  const rampDraw = ramp(f, [[sixKm - 8, 0], [sixKm + 14, 1]]);
  const anglePop = usePop(f, fiveDeg);
  const elephantPop = usePop(f, elephants);

  return (
    <Stage>
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 0,
          width: W,
          textAlign: 'center',
          opacity: titlePop,
        }}
      >
        <div style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 700, color: C.amber, letterSpacing: 3 }}>
          ● PREVAILING THEORY
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 38, fontWeight: 900, color: C.ink, marginTop: 4 }}>
          THE EARTHEN RAMP
        </div>
      </div>

      <svg
        width={W - 40}
        height={700}
        viewBox="0 0 1040 700"
        style={{
          position: 'absolute',
          left: 20,
          top: 160,
        }}
      >
        <defs>
          <linearGradient id="rampGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Ground line */}
        <line x1="40" y1="600" x2="1000" y2="600" stroke={C.grid} strokeWidth="2" />

        {/* Ramp (animated draw) */}
        <polygon
          points={`100,600 ${100 + 800 * rampDraw},${600 - 400 * rampDraw} ${100 + 800 * rampDraw},600`}
          fill="url(#rampGrad)"
          stroke={C.amber}
          strokeWidth="2"
          opacity={0.7}
        />

        {/* Earth fill texture lines */}
        {Array.from({ length: Math.floor(rampDraw * 12) }, (_, i) => {
          const xOff = 120 + i * 65;
          const yTop = 600 - (xOff - 100) * 0.5 * rampDraw;
          return (
            <line key={i} x1={xOff} y1={yTop + 10} x2={xOff} y2={598} stroke="#451A03" strokeWidth="1" opacity="0.4" />
          );
        })}

        {/* Temple at the end of ramp */}
        <g opacity={rampDraw > 0.7 ? ramp(f, [[sixKm + 10, 0], [sixKm + 18, 1]]) : 0} transform="translate(870, 100)">
          <polygon points="30,-60 0,0 60,0" fill={C.gold} stroke={C.amber} strokeWidth="2" />
          <rect x="8" y="0" width="44" height="100" fill={C.gold} stroke={C.amber} strokeWidth="1.5" />
        </g>

        {/* 5° angle indicator */}
        <g opacity={anglePop}>
          <path d="M140,600 A100,100 0 0,0 230,562" fill="none" stroke={C.teal} strokeWidth="2.5" />
          <text x="200" y="580" fill={C.teal} fontFamily="monospace" fontWeight="900" fontSize="22">5°</text>
        </g>

        {/* 6km distance label */}
        <g opacity={ramp(f, [[sixKm, 0], [sixKm + 8, 1]])}>
          <line x1="100" y1="630" x2={100 + 800 * rampDraw} y2="630" stroke={C.amber} strokeWidth="2" markerEnd="url(#arrowAmber)" markerStart="url(#arrowAmberR)" />
          <rect x="380" y="618" width="180" height="30" rx="6" fill={C.dark} />
          <text x="470" y="640" textAnchor="middle" fill={C.amber} fontFamily="monospace" fontWeight="900" fontSize="18">6 KILOMETERS</text>
        </g>

        <defs>
          <marker id="arrowAmber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={C.amber} />
          </marker>
          <marker id="arrowAmberR" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 10 0 L 0 5 L 10 10 z" fill={C.amber} />
          </marker>
        </defs>

        {/* Elephants and workers */}
        <g opacity={elephantPop} transform={`translate(${200 + elephantPop * 120}, ${540 - elephantPop * 60})`}>
          {/* Elephant silhouette */}
          <ellipse cx="0" cy="0" rx="35" ry="22" fill="#44403C" />
          <path d="M-30,-10 Q-40,-30 -35,-40 L-30,-30" fill="#44403C" stroke="#57534E" strokeWidth="1.5" />
          <circle cx="-38" cy="-42" r="3" fill="#A8A29E" />
          <rect x="-20" y="18" width="8" height="16" rx="2" fill="#44403C" />
          <rect x="10" y="18" width="8" height="16" rx="2" fill="#44403C" />
          {/* Rope to stone */}
          <line x1="35" y1="0" x2="80" y2="-10" stroke="#A8A29E" strokeWidth="2" strokeDasharray="4 2" />
          {/* Stone block being dragged */}
          <rect x="80" y="-22" width="40" height="28" rx="4" fill="#FDE68A" stroke={C.amber} strokeWidth="2" />
          <text x="100" y="-2" textAnchor="middle" fill="#78350F" fontFamily="monospace" fontWeight="800" fontSize="10">80T</text>
        </g>

        {/* Worker figures */}
        <g opacity={elephantPop * 0.8}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${380 + i * 30}, ${480 - i * 15})`}>
              <circle cx="0" cy="-8" r="4" fill={C.mute} />
              <line x1="0" y1="-4" x2="0" y2="10" stroke={C.mute} strokeWidth="2" />
              <line x1="-5" y1="10" x2="5" y2="10" stroke={C.mute} strokeWidth="1.5" />
            </g>
          ))}
        </g>
      </svg>

      {/* Theory confidence bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 60,
          right: 60,
          opacity: ramp(f, [[elephants + 6, 0], [elephants + 14, 1]]),
        }}
      >
        <div
          style={{
            background: C.dark,
            border: `1.5px solid ${C.gold}`,
            borderRadius: 14,
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <span style={{ fontSize: 28 }}>🐘</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 13, fontWeight: 700, color: C.gold, letterSpacing: 2 }}>
              ELEPHANTS + HUMAN LABOR + EARTHEN RAMP
            </div>
          </div>
        </div>
      </div>
    </Stage>
  );
};
