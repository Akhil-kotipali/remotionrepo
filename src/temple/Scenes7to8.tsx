import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, W } from './theme';
import { ramp, usePop, Stage } from './parts';

/* ════════════════════════════════════════════════════════════
   SCENE 7: WHAT BAFFLES ENGINEERS – Zero cracks, no mortar, only gravity
   ════════════════════════════════════════════════════════════ */
export const Scene7Baffles: React.FC<{ zeroCracks: number; noMortar: number; gravity: number }> = ({
  zeroCracks,
  noMortar,
  gravity,
}) => {
  const f = useCurrentFrame();

  const titlePop = usePop(f, 4);
  const crackPop = usePop(f, zeroCracks);
  const mortarPop = usePop(f, noMortar);
  const gravPop = usePop(f, gravity);

  const facts = [
    {
      icon: '🔍',
      title: 'ZERO FOUNDATION CRACKS',
      sub: 'After 1,000 years of earthquakes, monsoons, and invasions',
      color: C.teal,
      pop: crackPop,
    },
    {
      icon: '🧱',
      title: 'NO MORTAR OR BINDING',
      sub: 'The Kumbam stone has no adhesive — nothing holding it',
      color: C.amber,
      pop: mortarPop,
    },
    {
      icon: '🌍',
      title: 'ONLY GRAVITY',
      sub: 'Perfect geometry and weight alone keep it in place',
      color: C.gold,
      pop: gravPop,
    },
  ];

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
        <div style={{ fontFamily: FONT.mono, fontSize: 16, fontWeight: 700, color: '#F97316', letterSpacing: 3 }}>
          ⚡ WHAT BAFFLES ENGINEERS
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 900, color: C.ink, marginTop: 6, letterSpacing: -1 }}>
          THE UNBREAKABLE TRUTH
        </div>
      </div>

      {/* Fact cards with dramatic reveal */}
      {facts.map((fact, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 50,
            right: 50,
            top: 170 + i * 260,
            opacity: fact.pop,
            transform: `translateY(${(1 - fact.pop) * 30}px) scale(${0.9 + fact.pop * 0.1})`,
          }}
        >
          <div
            style={{
              background: C.dark,
              border: `2.5px solid ${fact.color}`,
              borderRadius: 24,
              padding: '28px 24px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glow background */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at 20% 50%, ${fact.color}15 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  background: `${fact.color}22`,
                  border: `2px solid ${fact.color}66`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 36,
                  flexShrink: 0,
                }}
              >
                {fact.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: FONT.sans,
                    fontWeight: 900,
                    fontSize: 28,
                    color: fact.color,
                    letterSpacing: -0.5,
                    lineHeight: 1.2,
                  }}
                >
                  {fact.title}
                </div>
                <div
                  style={{
                    fontFamily: FONT.mono,
                    fontWeight: 600,
                    fontSize: 15,
                    color: C.mute,
                    marginTop: 8,
                    lineHeight: 1.4,
                    letterSpacing: 0.3,
                  }}
                >
                  {fact.sub}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Gravity force vector */}
      <svg
        width={200}
        height={300}
        viewBox="0 0 200 300"
        style={{
          position: 'absolute',
          right: 40,
          bottom: 50,
          opacity: gravPop * 0.6,
        }}
      >
        {/* Downward gravity arrow */}
        <line x1="100" y1="20" x2="100" y2="260" stroke={C.amber} strokeWidth="4">
          <animate attributeName="y2" values="200;260;200" dur="2s" repeatCount="indefinite" />
        </line>
        <polygon points="80,250 100,290 120,250" fill={C.amber} />
        <text x="100" y="15" textAnchor="middle" fill={C.gold} fontFamily="monospace" fontWeight="900" fontSize="16">g = 9.8 m/s²</text>
      </svg>
    </Stage>
  );
};

/* ════════════════════════════════════════════════════════════
   SCENE 8: FINALE – "They had mastery"
   ════════════════════════════════════════════════════════════ */
export const Scene8Finale: React.FC<{
  noAdhesive: number;
  geometry: number;
  computers: number;
  mastery: number;
  len: number;
}> = ({ noAdhesive, geometry, computers, mastery, len }) => {
  const f = useCurrentFrame();

  const adhesivePop = usePop(f, noAdhesive);
  const geoPop = usePop(f, geometry);
  const compPop = usePop(f, computers);
  const masteryPop = usePop(f, mastery);

  return (
    <Stage>
      {/* 1000 YEARS counter */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          width: W,
          textAlign: 'center',
          opacity: ramp(f, [[0, 0], [10, 1]]),
        }}
      >
        <div style={{ fontFamily: FONT.mono, fontSize: 16, fontWeight: 700, color: C.gold, letterSpacing: 4 }}>
          STANDING FOR
        </div>
        <div
          style={{
            fontFamily: FONT.sans,
            fontWeight: 900,
            fontSize: 120,
            color: C.amber,
            letterSpacing: -3,
            textShadow: `0 0 40px ${C.amber}44`,
            marginTop: -8,
          }}
        >
          1,000
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 800, color: C.ink, marginTop: -10, letterSpacing: 2 }}>
          YEARS
        </div>
      </div>

      {/* Contrast cards */}
      <div
        style={{
          position: 'absolute',
          top: 340,
          left: 50,
          right: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* No adhesive */}
        <div
          style={{
            opacity: adhesivePop,
            transform: `scale(${0.9 + adhesivePop * 0.1})`,
            background: C.dark,
            border: `2px solid ${C.red}`,
            borderRadius: 18,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span style={{ fontSize: 36 }}>🚫</span>
          <div>
            <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 24, color: C.red }}>
              NO MODERN ADHESIVE
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 14, color: C.mute, marginTop: 2 }}>
              No cement, no epoxy, no binding agent
            </div>
          </div>
        </div>

        {/* Perfect geometry */}
        <div
          style={{
            opacity: geoPop,
            transform: `scale(${0.9 + geoPop * 0.1})`,
            background: C.dark,
            border: `2px solid ${C.teal}`,
            borderRadius: 18,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span style={{ fontSize: 36 }}>📐</span>
          <div>
            <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 24, color: C.teal }}>
              JUST PERFECT GEOMETRY
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 14, color: C.mute, marginTop: 2 }}>
              Precision-cut granite, interlocking placement
            </div>
          </div>
        </div>
      </div>

      {/* Final dramatic statement */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          width: W,
          textAlign: 'center',
        }}
      >
        {/* "They didn't have computers" */}
        <div
          style={{
            opacity: compPop,
            fontFamily: FONT.sans,
            fontWeight: 800,
            fontSize: 28,
            color: C.mute,
            letterSpacing: -0.5,
            transform: `translateY(${(1 - compPop) * 20}px)`,
          }}
        >
          They did not have computers.
        </div>

        {/* "THEY HAD MASTERY" */}
        <div
          style={{
            marginTop: 16,
            opacity: masteryPop,
            transform: `scale(${0.6 + masteryPop * 0.4})`,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              background: `linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FDE68A 100%)`,
              padding: '20px 48px',
              borderRadius: 24,
              boxShadow: `0 20px 50px rgba(217,119,6,0.4), 0 0 60px rgba(245,158,11,0.2)`,
            }}
          >
            <div
              style={{
                fontFamily: FONT.sans,
                fontWeight: 900,
                fontSize: 52,
                color: '#1C1917',
                letterSpacing: -1,
              }}
            >
              THEY HAD MASTERY.
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Kumbam silhouette in background */}
      <svg
        width={400}
        height={400}
        viewBox="0 0 400 400"
        style={{
          position: 'absolute',
          left: (W - 400) / 2,
          top: 350,
          opacity: masteryPop * 0.08,
          pointerEvents: 'none',
        }}
      >
        <polygon
          points="200,20 260,80 280,160 260,240 200,280 140,240 120,160 140,80"
          fill={C.amber}
        />
      </svg>
    </Stage>
  );
};

