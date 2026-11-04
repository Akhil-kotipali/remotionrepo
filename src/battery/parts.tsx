import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useVideoConfig } from 'remotion';
import { C, FONT, H, STAGE, W } from './theme';

/** Piecewise ramp that tolerates equal/unsorted anchor frames. */
export const ramp = (f: number, pts: [number, number][]): number => {
  const xs: number[] = [];
  const ys: number[] = [];
  pts.forEach(([x, y]) => {
    xs.push(xs.length ? Math.max(x, xs[xs.length - 1] + 1) : x);
    ys.push(y);
  });
  return interpolate(f, xs, ys, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
};

/** 0 -> 1 spring that starts at frame `start`. */
export const usePop = (frame: number, start: number, damping = 14): number => {
  const { fps } = useVideoConfig();
  return spring({ frame: Math.max(0, frame - start), fps, config: { damping, stiffness: 140, mass: 0.7 } });
};

export const Grid: React.FC = () => (
  <AbsoluteFill>
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke={C.grid} strokeWidth="1.5" />
          <circle cx="60" cy="60" r="1.5" fill="#CBD5E1" />
        </pattern>
        <radialGradient id="fade" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.25" />
        </radialGradient>
        <mask id="m">
          <rect width={W} height={H} fill="url(#fade)" />
        </mask>
      </defs>
      <rect width={W} height={H} fill="url(#g)" mask="url(#m)" opacity={0.9} />
    </svg>
  </AbsoluteFill>
);

export const Watermark: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  if (opacity <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: 50, top: 50, display: 'flex', alignItems: 'center', gap: 14, zIndex: 50, opacity }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 16px rgba(37,99,235,0.3)',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      </div>
      <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 32, color: C.ink, letterSpacing: -0.5 }}>
        sys.log<span style={{ color: C.blue }}>.explain</span>
      </div>
    </div>
  );
};

/**
 * Main Question Hook Banner - Displays immediately from Frame 0.
 * Directly fulfills: "Put the main question on screen immediately".
 */
export const HookQuestion: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div
    style={{
      position: 'absolute',
      top: 48,
      left: 0,
      width: W,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 40,
      opacity,
      pointerEvents: 'none',
    }}
  >
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'blur(16px)',
        padding: '16px 36px',
        borderRadius: 24,
        border: '2px solid rgba(244, 63, 94, 0.6)',
        boxShadow: '0 20px 45px rgba(0,0,0,0.35)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: FONT.sans,
          fontWeight: 900,
          fontSize: 40,
          letterSpacing: -1,
          color: '#FFFFFF',
          textTransform: 'uppercase',
          lineHeight: 1.15,
        }}
      >
        WHY DOES YOUR PHONE <span style={{ color: '#F43F5E' }}>DIE AT 20%?</span>
      </div>
    </div>
  </div>
);

/** The 1080x1000 drawing box all scenes work in (local coords 0..1080 x 0..1000). */
export const Stage: React.FC<{ children: React.ReactNode; opacity?: number; dy?: number }> = ({
  children,
  opacity = 1,
  dy = 0,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: STAGE.top,
      width: W,
      height: STAGE.height,
      opacity,
      transform: `translateY(${dy}px)`,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{
  text: string;
  color: string;
  x: number;
  y: number;
  p?: number;
  solid?: boolean;
  size?: number;
  icon?: string;
}> = ({ text, color, x, y, p = 1, solid = true, size = 32, icon }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`,
      opacity: Math.min(1, p * 1.6),
      padding: '14px 32px',
      borderRadius: 999,
      background: solid ? `linear-gradient(135deg, ${color} 0%, ${color}EE 100%)` : '#FFFFFF',
      border: `2px solid ${solid ? 'rgba(255,255,255,0.35)' : color}`,
      color: solid ? '#FFFFFF' : color,
      fontFamily: FONT.mono,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 1.5,
      whiteSpace: 'nowrap',
      boxShadow: solid
        ? `0 16px 36px -4px ${color}66, 0 4px 12px rgba(0,0,0,0.15)`
        : '0 12px 24px rgba(15,23,42,0.12)',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      zIndex: 25,
    }}
  >
    {icon && <span style={{ fontSize: size * 1.15 }}>{icon}</span>}
    {text}
  </div>
);

/**
 * Scaled up phone dimensions (410x820) to reduce wasted space on vertical screens.
 */
export const PHONE = { w: 410, h: 820 };

export const CameraIcon: React.FC<{ size: number; scale?: number }> = ({ size, scale = 1 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: 'linear-gradient(145deg, #1e293b, #0f172a)',
      border: '2.5px solid rgba(255,255,255,0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${scale})`,
      boxShadow: '0 18px 40px rgba(15,23,42,0.45), inset 0 2px 4px rgba(255,255,255,0.3)',
    }}
  >
    <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.6" />
      <circle cx="12" cy="13" r="1.5" fill="#38BDF8" opacity="0.8" />
    </svg>
  </div>
);

/**
 * Flagship Phone Body with realistic titanium chassis, side buttons, and Dynamic Island.
 */
export const PhoneFrame: React.FC<{
  children?: React.ReactNode;
  screen: string;
  wire?: number;
  scale?: number;
  cx?: number;
  cy?: number;
}> = ({ children, screen, wire = 0, scale = 1, cx = STAGE.cx, cy = STAGE.cy }) => {
  const isWire = wire > 0.5;
  const borderColor = isWire ? C.blue : '#1E293B';

  return (
    <div
      style={{
        position: 'absolute',
        left: cx - PHONE.w / 2,
        top: cy - PHONE.h / 2,
        width: PHONE.w,
        height: PHONE.h,
        transform: `scale(${scale})`,
        borderRadius: 62,
        padding: 12,
        boxSizing: 'border-box',
        background: isWire
          ? 'transparent'
          : 'linear-gradient(145deg, #334155 0%, #0F172A 50%, #020617 100%)',
        boxShadow: isWire
          ? `0 0 50px rgba(37,99,235,0.35)`
          : '0 50px 100px -15px rgba(15,23,42,0.4), 0 25px 50px -10px rgba(0,0,0,0.25), inset 0 2px 5px rgba(255,255,255,0.35)',
        border: `${isWire ? 4 : 2.5}px ${isWire ? 'dashed' : 'solid'} ${borderColor}`,
      }}
    >
      {/* Side buttons */}
      {!isWire && (
        <>
          <div style={{ position: 'absolute', left: -6, top: 140, width: 5, height: 48, background: '#475569', borderRadius: '4px 0 0 4px' }} />
          <div style={{ position: 'absolute', left: -6, top: 200, width: 5, height: 48, background: '#475569', borderRadius: '4px 0 0 4px' }} />
          <div style={{ position: 'absolute', right: -6, top: 170, width: 5, height: 74, background: '#475569', borderRadius: '0 4px 4px 0' }} />
        </>
      )}

      {/* Screen Glass */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 50,
          background: screen,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.7)',
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 110,
            height: 30,
            borderRadius: 18,
            background: isWire ? 'rgba(37,99,235,0.4)' : '#000000',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              width: 11,
              height: 11,
              borderRadius: '50%',
              background: '#0d1527',
              border: '1px solid #1e293b',
              boxShadow: 'inset 0 0 3px #38bdf8',
            }}
          />
        </div>

        {/* Diagonal Screen Reflection */}
        {!isWire && (
          <div
            style={{
              position: 'absolute',
              top: -120,
              left: -60,
              width: 180,
              height: 1100,
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%)',
              transform: 'rotate(24deg)',
              pointerEvents: 'none',
              zIndex: 25,
            }}
          />
        )}

        {children}
      </div>
    </div>
  );
};

/**
 * Lock-screen look used by Scene 1 and by the loop seam.
 * Fulfills: "Make the first frame show a phone at 20% and a sudden shutdown".
 */
export const HookPhone: React.FC<{
  dead?: boolean;
  cameraScale?: number;
  scale?: number;
  isOpeningCamera?: boolean;
}> = ({ dead = false, cameraScale = 1, scale = 1, isOpeningCamera = false }) => {
  const screenBg = dead
    ? '#05070D'
    : isOpeningCamera
    ? '#090D16'
    : 'radial-gradient(circle at 50% 30%, #1e293b 0%, #0f172a 100%)';

  return (
    <PhoneFrame screen={screenBg} scale={scale}>
      {!dead && !isOpeningCamera && (
        <div style={{ position: 'absolute', inset: 0, padding: '18px 24px', color: '#FFFFFF' }}>
          {/* Top Status Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 16,
              color: 'rgba(255,255,255,0.85)',
              padding: '0 8px',
            }}
          >
            <span>9:41</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Cellular Signal bars */}
              <svg width="18" height="13" viewBox="0 0 16 12" fill="currentColor">
                <rect x="1" y="9" width="2.5" height="3" rx="0.5" />
                <rect x="5" y="6" width="2.5" height="6" rx="0.5" />
                <rect x="9" y="3" width="2.5" height="9" rx="0.5" />
                <rect x="13" y="0" width="2.5" height="12" rx="0.5" />
              </svg>
              {/* Battery Glyph */}
              <div
                style={{
                  width: 28,
                  height: 14,
                  borderRadius: 4,
                  border: '1.8px solid rgba(255,255,255,0.85)',
                  padding: 2,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div style={{ width: '20%', height: '100%', background: '#F43F5E', borderRadius: 2 }} />
              </div>
            </div>
          </div>

          {/* Date & Large Time Clock */}
          <div style={{ textAlign: 'center', marginTop: 46 }}>
            <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 18, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.5 }}>
              Wednesday, October 30
            </div>
            <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 82, letterSpacing: -2, color: '#FFFFFF', marginTop: -4 }}>
              09:41
            </div>
          </div>

          {/* Center 20% Battery Warning Card - High Impact */}
          <div
            style={{
              marginTop: 24,
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(24px)',
              borderRadius: 28,
              border: '1.5px solid rgba(244, 63, 94, 0.4)',
              padding: '24px 22px',
              textAlign: 'center',
              boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 84, letterSpacing: -3, color: '#F43F5E' }}>
                20
              </span>
              <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 40, color: '#F43F5E' }}>
                %
              </span>
            </div>

            <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 16, letterSpacing: 2, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', marginTop: 4 }}>
              ⚠️ LOW POWER MODE
            </div>

            {/* Glowing Battery Meter bar */}
            <div
              style={{
                width: '100%',
                height: 18,
                borderRadius: 9,
                background: 'rgba(0,0,0,0.5)',
                marginTop: 18,
                overflow: 'hidden',
                padding: 2.5,
                boxSizing: 'border-box',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <div
                style={{
                  width: '20%',
                  height: '100%',
                  borderRadius: 6,
                  background: 'linear-gradient(90deg, #F43F5E 0%, #FB7185 100%)',
                  boxShadow: '0 0 16px #F43F5E',
                }}
              />
            </div>
          </div>

          {/* Bottom Quick-Action Buttons */}
          <div
            style={{
              position: 'absolute',
              bottom: 36,
              left: 28,
              right: 28,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M18 6c0 2-2 4-2 7v5H8v-5c0-3-2-5-2-7a6 6 0 1 1 12 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
              </svg>
            </div>

            <CameraIcon size={72} scale={cameraScale} />
          </div>
        </div>
      )}

      {/* Camera Viewfinder UI when opening camera */}
      {!dead && isOpeningCamera && (
        <div style={{ position: 'absolute', inset: 0, padding: 18, color: '#fff' }}>
          <div
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 170,
              height: 170,
              border: '2.5px solid #FACC15',
              borderRadius: 10,
              boxShadow: '0 0 20px rgba(250, 204, 21, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FACC15' }} />
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 30,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                border: '4px solid #fff',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#fff' }} />
            </div>
          </div>
        </div>
      )}

      {/* Dramatic Sudden Shutdown Screen */}
      {dead && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            background: '#020617',
          }}
        >
          {/* Red Dead Battery Depleted Icon */}
          <div
            style={{
              width: 110,
              height: 56,
              borderRadius: 12,
              border: '3.5px solid #EF4444',
              padding: 5,
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)',
            }}
          >
            <div style={{ position: 'absolute', right: -9, top: 16, width: 6, height: 18, background: '#EF4444', borderRadius: '0 4px 4px 0' }} />
            <div style={{ width: 12, height: '100%', background: '#EF4444', borderRadius: 6 }} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: FONT.mono, fontWeight: 900, fontSize: 18, color: '#EF4444', letterSpacing: 2 }}>
              SUDDEN SHUTDOWN
            </div>
            <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 13, color: '#64748B', letterSpacing: 1, marginTop: 4 }}>
              VOLTAGE DROPPED BELOW MINIMUM
            </div>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
};
