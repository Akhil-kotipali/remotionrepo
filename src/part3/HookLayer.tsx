import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {INTER, MONO, MONT} from "./fonts";
import {E, kf} from "./math";

/**
 * Psychological Hook Layer — engineered to stop 80%+ of mobile feed scrollers on Frame 0.
 * Operates at root screen coordinates (1080x1920) so it is 100% fixed, uncropped, and crisp.
 */
export const HookLayer: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= 100) return null;

  // 1. Frame 0 - 8: Police Classified Stamp Shock Impact
  const stampO = kf(f, [[0, 1], [6, 1], [9, 0]]);
  const stampScale = kf(f, [[0, 1.35], [4, 1.0, E.back]]);

  // 2. Frames 0 - 52: Unswipeable Psychological Test Anchor
  const testO = kf(f, [[0, 1], [42, 1], [52, 0]]);
  const testY = kf(f, [[0, 0], [42, 0], [52, -18, E.inOut]]);

  // 3. Frames 52 - 95: Statement Conflict Meter (None of their stories align)
  const conflictO = kf(f, [[52, 0], [58, 1], [88, 1], [95, 0]]);

  return (
    <AbsoluteFill style={{pointerEvents: "none", zIndex: 120}}>
      {/* --- LAYER 1: FRAME 0 COLD-OPEN CRIME DOSSIER STAMP --- */}
      {f < 10 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "40%",
            transform: `translateY(-50%) scale(${stampScale}) rotate(-3deg)`,
            textAlign: "center",
            opacity: stampO,
          }}
        >
          <div
            style={{
              display: "inline-block",
              border: "6px solid #ef4444",
              background: "rgba(8, 12, 22, 0.94)",
              padding: "20px 48px",
              borderRadius: 18,
              boxShadow: "0 0 50px rgba(239,68,68,0.9), inset 0 0 25px rgba(239,68,68,0.5)",
            }}
          >
            <div style={{fontFamily: MONO, fontWeight: 900, fontSize: 32, letterSpacing: 8, color: "#f87171"}}>
              POLICE CASE FILE #03 · HOMICIDE
            </div>
            <div style={{fontFamily: MONT, fontWeight: 900, fontSize: 62, letterSpacing: 3, color: "#ffffff", marginTop: 8}}>
              CONTRADICTORY STATEMENTS
            </div>
          </div>
        </div>
      )}

      {/* --- LAYER 2: THE 94% GUESS WRONG PSYCHOLOGICAL ANCHOR (0.0s - 1.7s) --- */}
      {f < 54 && (
        <div
          style={{
            position: "absolute",
            top: 140,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: testO,
            transform: `translateY(${testY}px)`,
          }}
        >
          {/* Top Pill: High-contrast Alert */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(220, 38, 38, 0.96)",
              border: "2px solid #fecaca",
              borderRadius: 999,
              padding: "8px 28px",
              boxShadow: "0 4px 30px rgba(220,38,38,0.85)",
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 0 10px #ffffff",
                transform: `scale(${0.9 + 0.3 * Math.sin(f * 0.6)})`,
              }}
            />
            <span style={{color: "#ffffff", fontFamily: MONO, fontWeight: 900, fontSize: 24, letterSpacing: 5, textTransform: "uppercase"}}>
              PSYCHOLOGY TEST · 94% GUESS WRONG
            </span>
          </div>

          {/* Main Question: Cognitive Ego Hook */}
          <div
            style={{
              fontFamily: INTER,
              fontWeight: 900,
              fontSize: 50,
              color: "#ffffff",
              marginTop: 14,
              letterSpacing: 2,
              textShadow: "0 4px 30px rgba(0,0,0,0.95), 0 0 20px rgba(255,255,255,0.4)",
            }}
          >
            WHICH FRIEND IS LYING? 💀
          </div>

          {/* Subtext: Specific Cognitive Load */}
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 24,
              color: "#fecaca",
              marginTop: 8,
              letterSpacing: 4,
              textShadow: "0 2px 10px rgba(0,0,0,0.9)",
            }}
          >
            [ 4 CONFLICTING MEMORIES · 1 ACCIDENT ]
          </div>
        </div>
      )}

      {/* --- LAYER 3: STATEMENT MISMATCH ALERT (1.7s - 3.1s) --- */}
      {f >= 50 && f < 96 && (
        <div
          style={{
            position: "absolute",
            top: 240,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: conflictO,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(10, 16, 32, 0.94)",
              border: "2px solid #38bdf8",
              borderRadius: 14,
              padding: "10px 32px",
              boxShadow: "0 0 30px rgba(56,189,248,0.5)",
            }}
          >
            <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: "#38bdf8"}}>
              ⚠️ STATEMENT CONFLICT · 100%
            </div>
            <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 36, color: "#ffffff", marginTop: 4, letterSpacing: 1}}>
              NONE OF THEIR STORIES MATCH
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
