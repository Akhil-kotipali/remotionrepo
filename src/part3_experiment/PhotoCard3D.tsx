import React from "react";
import {useCurrentFrame} from "remotion";
import {MONO, INTER} from "../part3/fonts";

interface PhotoCard3DProps {
  x: number;
  y: number;
  z?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  glareSweep?: number; // 0..1 position of specular gleam
  focusWindow?: boolean;
}

export const PhotoCard3D: React.FC<PhotoCard3DProps> = ({
  x,
  y,
  z = 0,
  rotateX = 12,
  rotateY = -8,
  rotateZ = 0,
  scale = 1.0,
  glareSweep = 0.5,
  focusWindow = false,
}) => {
  const f = useCurrentFrame();

  // Subtle breathing / paper float
  const floatZ = Math.sin(f * 0.1) * 3;
  const floatRot = Math.cos(f * 0.08) * 0.6;

  // Window target box pulse (Frames 45 - 92)
  const pulseTarget = 0.8 + 0.2 * Math.sin(f * 0.4);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 320,
        height: 390,
        transformStyle: "preserve-3d",
        transform: `translate(-50%, -50%) translate3d(0, 0, ${z + floatZ}px) rotateX(${rotateX}deg) rotateY(${rotateY + floatRot}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
        zIndex: 50,
        filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 15px rgba(0, 0, 0, 0.6))",
      }}
    >
      {/* --- PHYSICAL CARDSTOCK BASE --- */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: "#f4f1ea",
          borderRadius: 8,
          padding: "16px 16px 44px 16px",
          boxSizing: "border-box",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.7), 0 4px 12px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      >
        {/* --- PHOTO PRINT AREA --- */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            background: "#080d14",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "inset 0 0 8px rgba(0,0,0,0.8)",
          }}
        >
          {/* SVG Illustrated Haunted House & 6th Person Scene */}
          <svg
            viewBox="0 0 300 320"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <defs>
              <linearGradient id="photo-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#182012" />
              </linearGradient>
              <linearGradient id="photo-roof" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Overcast Spooky Sky */}
            <rect x="0" y="0" width="300" height="320" fill="url(#photo-sky)" />

            {/* Distant Fog & Moon glow */}
            <circle cx="210" cy="80" r="35" fill="rgba(255, 255, 255, 0.08)" />
            <circle cx="210" cy="80" r="18" fill="rgba(255, 255, 255, 0.15)" />

            {/* Distant Creepy Pine Trees */}
            <path d="M10,220 L30,150 L50,220 Z M35,220 L55,140 L75,220 Z M220,220 L245,130 L270,220 Z M245,220 L270,145 L295,220 Z" fill="#080e18" />

            {/* Abandoned 2-Story Victorian Mansion */}
            <g id="mansion">
              {/* Main Body */}
              <rect x="70" y="110" width="160" height="120" fill="#141c26" stroke="#090d13" strokeWidth="2" />
              {/* Peaked Attic Roof */}
              <polygon points="60,110 150,45 240,110" fill="url(#photo-roof)" stroke="#090d13" strokeWidth="2" />
              {/* Attic Louver */}
              <circle cx="150" cy="80" r="10" fill="#080d14" stroke="#475569" strokeWidth="1.5" />

              {/* 1st Floor Porch & Columns */}
              <rect x="65" y="195" width="170" height="35" fill="#0c121b" />
              <rect x="80" y="165" width="140" height="30" fill="#090e15" />
              {/* Columns */}
              <line x1="90" y1="165" x2="90" y2="230" stroke="#1e293b" strokeWidth="3" />
              <line x1="130" y1="165" x2="130" y2="230" stroke="#1e293b" strokeWidth="3" />
              <line x1="170" y1="165" x2="170" y2="230" stroke="#1e293b" strokeWidth="3" />
              <line x1="210" y1="165" x2="210" y2="230" stroke="#1e293b" strokeWidth="3" />

              {/* 2ND FLOOR WINDOW — THE CRUCIAL MYSTERY */}
              <g id="mystery-window" transform="translate(162, 125)">
                {/* Window Frame with Eerie Yellow/Cold Interior */}
                <rect x="0" y="0" width="36" height="48" rx="2" fill="#1f2937" stroke="#475569" strokeWidth="2" />
                <rect x="4" y="4" width="28" height="40" fill="#2d3748" />
                <line x1="18" y1="4" x2="18" y2="44" stroke="#475569" strokeWidth="1.5" />
                <line x1="4" y1="22" x2="32" y2="22" stroke="#475569" strokeWidth="1.5" />

                {/* THE 6TH FIGURE IN THE WINDOW */}
                <ellipse cx="18" cy="19" rx="5.5" ry="6.5" fill="#000000" />
                <path d="M12,25 C12,23 24,23 24,25 L26,42 L10,42 Z" fill="#000000" />
                {/* Cold White Eyes Gleam */}
                <circle cx="16.5" cy="18" r="0.8" fill="#ffffff" opacity={0.9} />
                <circle cx="19.5" cy="18" r="0.8" fill="#ffffff" opacity={0.9} />

                {/* Red Target Reticle Snapped Onto Window */}
                <g stroke="#ef4444" strokeWidth={1.8} fill="none" opacity={pulseTarget}>
                  {/* Top-Left Bracket */}
                  <path d="M-6,2 L-6,-6 L2,-6" />
                  {/* Top-Right Bracket */}
                  <path d="M34,-6 L42,-6 L42,2" />
                  {/* Bottom-Right Bracket */}
                  <path d="M42,46 L42,54 L34,54" />
                  {/* Bottom-Left Bracket */}
                  <path d="M2,54 L-6,54 L-6,46" />
                  {/* Target Crosshair */}
                  <line x1="18" y1="-8" x2="18" y2="-12" />
                  <line x1="18" y1="56" x2="18" y2="60" />
                  <line x1="-8" y1="24" x2="-12" y2="24" />
                  <line x1="44" y1="24" x2="48" y2="24" />
                </g>
              </g>

              {/* 5 Friends Standing in Lawn Foreground */}
              <g id="friends-lineup" transform="translate(75, 230)">
                {/* Ground Grass */}
                <rect x="-75" y="15" width="300" height="75" fill="#141c10" />

                {/* Friend 1: Meera (Burgundy) */}
                <circle cx="18" cy="4" r="5" fill="#a94f6f" />
                <line x1="18" y1="9" x2="18" y2="26" stroke="#7d334c" strokeWidth="3" />

                {/* Friend 2: Nisha (Yellow) */}
                <circle cx="42" cy="2" r="5" fill="#e6ba50" />
                <line x1="42" y1="7" x2="42" y2="26" stroke="#c29631" strokeWidth="3" />

                {/* Friend 3: Arjun (Green, Center) */}
                <circle cx="75" cy="0" r="6" fill="#859969" />
                <line x1="75" y1="6" x2="75" y2="28" stroke="#5e6f4a" strokeWidth="4" />

                {/* Friend 4: Rahul (Orange, Broad) */}
                <circle cx="108" cy="1" r="5.5" fill="#c97551" />
                <line x1="108" y1="6.5" x2="108" y2="27" stroke="#a25332" strokeWidth="4.5" />

                {/* Friend 5: Kabir (Teal) */}
                <circle cx="132" cy="3" r="5" fill="#469fa5" />
                <line x1="132" y1="8" x2="132" y2="26" stroke="#2d7377" strokeWidth="3" />
              </g>
            </g>

            {/* Vignette / Film Grain within photo */}
            <rect x="0" y="0" width="300" height="320" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="12" />
          </svg>

          {/* Forensic HUD Overlay inside Photo */}
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 10,
              fontFamily: MONO,
              fontWeight: 800,
              fontSize: 10,
              color: "#38bdf8",
              letterSpacing: 1.5,
              textShadow: "0 1px 3px #000",
            }}
          >
            EVIDENCE #03
          </div>

          <div
            style={{
              position: "absolute",
              top: 8,
              right: 10,
              fontFamily: MONO,
              fontWeight: 800,
              fontSize: 10,
              color: "#ef4444",
              letterSpacing: 1,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#ef4444",
                boxShadow: "0 0 6px #ef4444",
              }}
            />
            FIGURE 6: UNKNOWN
          </div>

          {/* DYNAMIC SPECULAR GLARE SWEEP (Glossy photo paper reflection) */}
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: `${glareSweep * 200 - 80}%`,
              width: "120%",
              height: "200%",
              background: "linear-gradient(115deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.45) 48%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.45) 52%, rgba(255,255,255,0.05) 70%, rgba(255,255,255,0) 100%)",
              transform: "rotate(25deg)",
              pointerEvents: "none",
              mixBlendMode: "screen",
            }}
          />
        </div>

        {/* --- BOTTOM MARGIN: HANDWRITTEN INSCRIPTION --- */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 20,
            right: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: INTER,
              fontWeight: 600,
              fontStyle: "italic",
              fontSize: 15,
              color: "#1e293b",
              letterSpacing: 0.5,
              opacity: 0.85,
            }}
          >
            "July 14 — All five of us."
          </span>
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 11,
              color: "#64748b",
              letterSpacing: 1,
            }}
          >
            35mm FILM
          </span>
        </div>
      </div>
    </div>
  );
};
