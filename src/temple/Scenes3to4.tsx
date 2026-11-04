import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, W } from './theme';
import { ramp, usePop, Stage } from './parts';

/* ════════════════════════════════════════════════════════════
   SCENE 3: THE KUMBAM – Tower height + stone weight
   ════════════════════════════════════════════════════════════ */
export const Scene3Kumbam: React.FC<{ twoSixteen: number; kumbam: number; octagonal: number }> = ({
  twoSixteen,
  kumbam,
  octagonal,
}) => {
  const f = useCurrentFrame();

  const towerGrow = ramp(f, [[0, 0], [20, 1]]);
  const kumbamPop = usePop(f, kumbam);
  const octPop = usePop(f, octagonal);

  // Tower height bar animation
  const heightFill = ramp(f, [[twoSixteen - 6, 0], [twoSixteen + 12, 1]]);

  return (
    <Stage>
      {/* Height comparison visual */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 60,
          width: W - 160,
          textAlign: 'center',
        }}
      >
        <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 16, color: C.gold, letterSpacing: 3, textTransform: 'uppercase' }}>
          VERTICAL SCALE COMPARISON
        </div>
      </div>

      <svg
        width={W - 80}
        height={900}
        viewBox="0 0 1000 900"
        style={{
          position: 'absolute',
          left: 40,
          top: 100,
          opacity: towerGrow,
        }}
      >
        {/* Tower elevation cross-section */}
        <defs>
          <linearGradient id="towerElev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="30%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>

        {/* Background elevation lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} opacity={0.3}>
            <line x1="120" y1={200 + i * 150} x2="880" y2={200 + i * 150} stroke={C.grid} strokeWidth="1" strokeDasharray="4 4" />
            <text x="115" y={204 + i * 150} textAnchor="end" fill={C.mute} fontFamily="monospace" fontSize="12">
              {216 - i * 54} ft
            </text>
          </g>
        ))}

        {/* Temple Tower side elevation */}
        <g transform="translate(350, 0)">
          {/* Full tower silhouette */}
          <polygon
            points="150,80 300,180 290,800 10,800 0,180"
            fill="url(#towerElev)"
            stroke="#78350F"
            strokeWidth="2"
            opacity={0.9}
          />

          {/* Height fill bar (animated) */}
          <rect
            x="-60"
            y={800 - heightFill * 720}
            width="30"
            height={heightFill * 720}
            rx="4"
            fill={C.amber}
            opacity={0.8}
          />

          {/* Height number */}
          <g opacity={ramp(f, [[twoSixteen - 2, 0], [twoSixteen + 4, 1]])}>
            <rect x="-120" y={800 - heightFill * 720 - 20} width="110" height="40" rx="8" fill={C.dark} stroke={C.amber} strokeWidth="2" />
            <text x="-65" y={800 - heightFill * 720 + 7} textAnchor="middle" fill={C.amber} fontFamily="monospace" fontWeight="900" fontSize="20">
              216 FT
            </text>
          </g>

          {/* 12 tier markers */}
          {Array.from({ length: 12 }, (_, i) => {
            const tierY = 180 + i * 52;
            const tierW = 290 - i * 20;
            return (
              <rect
                key={i}
                x={150 - tierW / 2}
                y={tierY}
                width={tierW}
                height={4}
                fill="#78350F"
                opacity={0.6}
              />
            );
          })}

          {/* KUMBAM at the top */}
          <g transform="translate(150, 50)" opacity={kumbamPop}>
            <polygon
              points="0,-30 20,-20 26,0 20,20 0,30 -20,20 -26,0 -20,-20"
              fill="#FDE68A"
              stroke={C.amber}
              strokeWidth="3"
            />
            {/* Pulsing glow */}
            <circle cx="0" cy="0" r={22 + kumbamPop * 8} fill="none" stroke={C.amber} strokeWidth="2" opacity={0.4}>
              <animate attributeName="r" values="22;32;22" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>

        {/* Kumbam specs callout */}
        <g opacity={octPop} transform={`translate(680, 100) scale(${0.9 + octPop * 0.1})`}>
          <rect x="0" y="0" width="260" height="160" rx="14" fill={C.dark} stroke={C.amber} strokeWidth="2" />
          <text x="20" y="30" fill={C.gold} fontFamily="monospace" fontWeight="700" fontSize="13" letterSpacing="2">KUMBAM STONE</text>
          <line x1="20" y1="40" x2="240" y2="40" stroke={C.grid} strokeWidth="1" />
          <text x="20" y="65" fill={C.ink} fontFamily="monospace" fontWeight="700" fontSize="16">Shape: Octagonal</text>
          <text x="20" y="90" fill={C.ink} fontFamily="monospace" fontWeight="700" fontSize="16">Weight: 80 tons</text>
          <text x="20" y="115" fill={C.red} fontFamily="monospace" fontWeight="900" fontSize="16">Mortar: NONE</text>
          <text x="20" y="140" fill={C.amber} fontFamily="monospace" fontWeight="900" fontSize="16">Age: 1000+ years</text>
        </g>

        {/* Human scale reference */}
        <g opacity={ramp(f, [[12, 0], [18, 1]])}>
          <rect x="630" y="775" width="12" height="25" rx="3" fill={C.mute} />
          <circle cx="636" cy="770" r="5" fill={C.mute} />
          <text x="636" y="815" textAnchor="middle" fill={C.mute} fontFamily="monospace" fontSize="11" fontWeight="700">1.7m</text>
        </g>
      </svg>
    </Stage>
  );
};

/* ════════════════════════════════════════════════════════════
   SCENE 4: THE ENGINEERING PROBLEM
   ════════════════════════════════════════════════════════════ */
export const Scene4Problem: React.FC<{ noCrane: number; noIron: number; quarry: number }> = ({
  noCrane,
  noIron,
  quarry,
}) => {
  const f = useCurrentFrame();
  const cranePop = usePop(f, noCrane);
  const ironPop = usePop(f, noIron);
  const quarryPop = usePop(f, quarry);

  const problems = [
    { label: 'NO CRANE', icon: '🏗️', desc: 'No mechanical lifting device existed', frame: noCrane, pop: cranePop, color: C.red },
    { label: 'NO IRON FRAME', icon: '🔩', desc: 'No structural iron framework', frame: noIron, pop: ironPop, color: '#F97316' },
    { label: '60 KM QUARRY', icon: '⛰️', desc: 'Granite quarried 60 km away', frame: quarry, pop: quarryPop, color: C.amber },
  ];

  return (
    <Stage>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          width: W,
          textAlign: 'center',
        }}
      >
        <div style={{ fontFamily: FONT.mono, fontSize: 16, fontWeight: 700, color: C.red, letterSpacing: 3 }}>
          ⚠️ ENGINEERING ANALYSIS
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 44, fontWeight: 900, color: C.ink, marginTop: 4, letterSpacing: -1 }}>
          THE IMPOSSIBLE PROBLEM
        </div>
      </div>

      {/* Problem cards */}
      {problems.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 60,
            right: 60,
            top: 180 + i * 240,
            opacity: p.pop,
            transform: `translateX(${(1 - p.pop) * 40}px) scale(${0.92 + p.pop * 0.08})`,
          }}
        >
          <div
            style={{
              background: C.dark,
              border: `2px solid ${p.color}`,
              borderRadius: 20,
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                background: `${p.color}22`,
                border: `2px solid ${p.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                flexShrink: 0,
              }}
            >
              {p.icon}
            </div>
            <div>
              <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 32, color: p.color, letterSpacing: -0.5 }}>
                {p.label}
              </div>
              <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 16, color: C.mute, marginTop: 4, letterSpacing: 0.5 }}>
                {p.desc}
              </div>
            </div>

            {/* Strike-through X */}
            <div
              style={{
                position: 'absolute',
                right: 24,
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `${p.color}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 28, color: p.color }}>✗</span>
            </div>
          </div>
        </div>
      ))}

      {/* Bottom stress: the impossibility */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          width: W,
          textAlign: 'center',
          opacity: ramp(f, [[quarry + 8, 0], [quarry + 18, 1]]),
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(239,68,68,0.15)',
            border: '2px solid rgba(239,68,68,0.5)',
            borderRadius: 14,
            padding: '12px 28px',
            fontFamily: FONT.mono,
            fontWeight: 800,
            fontSize: 20,
            color: C.red,
            letterSpacing: 2,
          }}
        >
          HOW DID THEY DO IT? 🤔
        </div>
      </div>
    </Stage>
  );
};
