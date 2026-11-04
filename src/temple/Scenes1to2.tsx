import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, W } from './theme';
import { ramp, usePop, Stage, HookQuestion } from './parts';

/* ════════════════════════════════════════════════════════════
   SCENE 1: HOOK – 80-ton stone, temple silhouette, mystery
   ════════════════════════════════════════════════════════════ */
export const Scene1Hook: React.FC<{ eighty: number; lifted: number; machinery: number }> = ({
  eighty,
  lifted,
  machinery,
}) => {
  const f = useCurrentFrame();

  const templeRise = ramp(f, [[0, 0], [20, 1]]);
  const stoneGlow = ramp(f, [[eighty - 4, 0], [eighty + 6, 1]]);
  const questionMark = usePop(f, machinery);

  return (
    <Stage>
      {/* Hook Question Banner */}
      <HookQuestion opacity={ramp(f, [[0, 1], [5, 1]])} />

      {/* Temple Silhouette – Pyramidal Tower */}
      <svg
        width={600}
        height={900}
        viewBox="0 0 600 900"
        style={{
          position: 'absolute',
          left: (W - 600) / 2,
          top: 120 + (1 - templeRise) * 80,
          opacity: templeRise,
          filter: `drop-shadow(0 20px 40px rgba(217,119,6,0.3))`,
        }}
      >
        <defs>
          <linearGradient id="temple-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="50%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
          <linearGradient id="kumbam-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Ground platform */}
        <rect x="80" y="820" width="440" height="60" rx="8" fill="#292524" stroke="#44403C" strokeWidth="2" />
        <rect x="100" y="810" width="400" height="14" rx="4" fill="#44403C" />

        {/* Temple base (wider) */}
        <rect x="130" y="700" width="340" height="120" rx="6" fill="url(#temple-grad)" stroke="#78350F" strokeWidth="2" />
        {/* Entry arch */}
        <path d="M260 820 Q260 760 300 740 Q340 760 340 820" fill="#1C1917" stroke="#78350F" strokeWidth="2" />

        {/* Temple tiers (diminishing) */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((tier) => {
          const w = 320 - tier * 22;
          const h = 42;
          const x = 300 - w / 2;
          const y = 690 - tier * 48;
          const tierOpacity = ramp(f, [[4 + tier * 1.2, 0], [8 + tier * 1.2, 1]]);
          return (
            <g key={tier} opacity={tierOpacity}>
              <rect x={x} y={y} width={w} height={h} rx="3" fill="url(#temple-grad)" stroke="#78350F" strokeWidth="1.5" />
              {/* Tier decorative elements */}
              {Array.from({ length: Math.floor(w / 28) }, (_, i) => (
                <rect
                  key={i}
                  x={x + 8 + i * 28}
                  y={y + 6}
                  width={18}
                  height={h - 12}
                  rx="3"
                  fill="none"
                  stroke="#78350F"
                  strokeWidth="1"
                  opacity="0.5"
                />
              ))}
            </g>
          );
        })}

        {/* Tower peak / Gopuram tip */}
        <polygon
          points="300,80 264,120 336,120"
          fill="url(#temple-grad)"
          stroke="#78350F"
          strokeWidth="2"
        />

        {/* KUMBAM Stone – the 80-ton block at top */}
        <g
          style={{
            filter: stoneGlow > 0.5 ? `drop-shadow(0 0 ${20 * stoneGlow}px #F59E0B)` : 'none',
          }}
        >
          {/* Octagonal shape */}
          <polygon
            points="300,40 320,50 328,70 320,90 300,100 280,90 272,70 280,50"
            fill="url(#kumbam-grad)"
            stroke="#D97706"
            strokeWidth="3"
          />
          {/* Engraving marks */}
          <line x1="290" y1="55" x2="310" y2="55" stroke="#92400E" strokeWidth="1.5" />
          <line x1="290" y1="80" x2="310" y2="80" stroke="#92400E" strokeWidth="1.5" />
          <circle cx="300" cy="68" r="6" fill="none" stroke="#92400E" strokeWidth="1.5" />
        </g>

        {/* Weight label pointing at Kumbam */}
        <g opacity={stoneGlow}>
          <line x1="340" y1="68" x2="420" y2="40" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6 3" />
          <rect x="420" y="22" width="150" height="36" rx="8" fill="#1C1917" stroke="#F59E0B" strokeWidth="2" />
          <text x="495" y="47" textAnchor="middle" fill="#F59E0B" fontFamily="monospace" fontWeight="800" fontSize="18">
            80 TONS ⚠️
          </text>
        </g>

        {/* Height dimension line */}
        <g opacity={ramp(f, [[lifted - 4, 0], [lifted + 4, 1]])}>
          <line x1="60" y1="40" x2="60" y2="820" stroke="#A8A29E" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="52" y1="40" x2="68" y2="40" stroke="#A8A29E" strokeWidth="2" />
          <line x1="52" y1="820" x2="68" y2="820" stroke="#A8A29E" strokeWidth="2" />
          <text x="50" y="430" textAnchor="middle" fill="#A8A29E" fontFamily="monospace" fontWeight="700" fontSize="14" transform="rotate(-90, 50, 430)">
            216 FT / 66 M
          </text>
        </g>
      </svg>

      {/* Giant Question Mark */}
      <div
        style={{
          position: 'absolute',
          right: 60,
          top: 200,
          fontSize: 200,
          fontWeight: 900,
          fontFamily: FONT.sans,
          color: C.amber,
          opacity: questionMark * 0.2,
          transform: `scale(${0.5 + questionMark * 0.5})`,
        }}
      >
        ?
      </div>
    </Stage>
  );
};

/* ════════════════════════════════════════════════════════════
   SCENE 2: THE TEMPLE IDENTITY
   ════════════════════════════════════════════════════════════ */
export const Scene2Temple: React.FC<{ emperor: number; tenTen: number }> = ({ emperor, tenTen }) => {
  const f = useCurrentFrame();

  const titlePop = usePop(f, 4);
  const emperorPop = usePop(f, emperor);
  const yearPop = usePop(f, tenTen);

  return (
    <Stage>
      {/* Title card */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          width: W,
          textAlign: 'center',
          opacity: titlePop,
          transform: `scale(${0.85 + titlePop * 0.15})`,
        }}
      >
        <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 18, letterSpacing: 3, color: C.gold, textTransform: 'uppercase' }}>
          ● THANJAVUR, TAMIL NADU, INDIA
        </div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 52, color: C.ink, marginTop: 8, letterSpacing: -1 }}>
          BRIHADEESWARAR
        </div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 42, color: C.gold, letterSpacing: -0.5 }}>
          TEMPLE
        </div>
      </div>

      {/* Isometric temple top view */}
      <svg
        width={700}
        height={500}
        viewBox="0 0 700 500"
        style={{
          position: 'absolute',
          left: (W - 700) / 2,
          top: 280,
          opacity: ramp(f, [[6, 0], [16, 1]]),
        }}
      >
        {/* Isometric base platform */}
        <polygon points="350,120 600,240 350,360 100,240" fill="none" stroke={C.gold} strokeWidth="2" strokeDasharray="6 3" />
        <polygon points="350,130 580,240 350,350 120,240" fill="rgba(217,119,6,0.08)" stroke={C.gold} strokeWidth="1" />

        {/* Inner sanctum */}
        <polygon points="350,180 480,240 350,300 220,240" fill="rgba(217,119,6,0.15)" stroke={C.amber} strokeWidth="2" />

        {/* Tower projection (3D) */}
        <polygon points="350,40 420,80 350,120 280,80" fill="rgba(245,158,11,0.2)" stroke={C.amber} strokeWidth="2" />
        <line x1="280" y1="80" x2="280" y2="180" stroke={C.gold} strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="420" y1="80" x2="420" y2="180" stroke={C.gold} strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="350" y1="40" x2="350" y2="130" stroke={C.amber} strokeWidth="2" />

        {/* Kumbam dot at top */}
        <circle cx="350" cy="35" r="8" fill={C.amber} stroke={C.ink} strokeWidth="2">
          <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Dimension annotations */}
        <text x="350" y="390" textAnchor="middle" fill={C.mute} fontFamily="monospace" fontWeight="700" fontSize="14">
          TEMPLE PLAN VIEW // DRAVIDIAN ARCHITECTURE
        </text>
      </svg>

      {/* Emperor info card */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 60,
          right: 60,
          display: 'flex',
          gap: 20,
          opacity: emperorPop,
          transform: `translateY(${(1 - emperorPop) * 20}px)`,
        }}
      >
        <div
          style={{
            flex: 1,
            background: 'rgba(28,25,23,0.9)',
            border: `1.5px solid ${C.gold}`,
            borderRadius: 16,
            padding: '16px 20px',
          }}
        >
          <div style={{ fontFamily: FONT.mono, fontSize: 12, fontWeight: 700, color: C.gold, letterSpacing: 2 }}>BUILDER</div>
          <div style={{ fontFamily: FONT.sans, fontSize: 22, fontWeight: 900, color: C.ink, marginTop: 4 }}>
            Raja Raja Chola I
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: 'rgba(28,25,23,0.9)',
            border: `1.5px solid ${C.gold}`,
            borderRadius: 16,
            padding: '16px 20px',
            opacity: yearPop,
            transform: `scale(${0.9 + yearPop * 0.1})`,
          }}
        >
          <div style={{ fontFamily: FONT.mono, fontSize: 12, fontWeight: 700, color: C.gold, letterSpacing: 2 }}>YEAR</div>
          <div style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 900, color: C.amber, marginTop: 4 }}>
            1010 AD
          </div>
        </div>
      </div>
    </Stage>
  );
};
