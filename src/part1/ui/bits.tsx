import React from "react";
import {FriendStickFigure} from "../stick/FriendStickFigure";
import {FriendId} from "../stick/friendDesigns";
import {INTER, MONO} from "../fonts";
import {clamp, rnd} from "../math";

/** circular crop of a friend's head using YOUR FriendStickFigure */
export const Avatar: React.FC<{friend: FriendId; size: number; ring?: string; glitch?: number}> = ({friend, size, ring, glitch = 0}) => {
  const k = (size * 2.9) / 240; // figure scale so head fills circle
  const w = 240 * k;
  const h = 440 * k;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        position: "relative",
        background: "radial-gradient(circle at 35% 30%, #1b2536, #0a0f18)",
        boxShadow: ring ? `0 0 0 3px ${ring}` : undefined,
        flexShrink: 0,
      }}
    >
      <div style={{position: "absolute", left: size / 2 - w / 2 + glitch * 6, top: size * 0.585 - 62 * k}}>
        <FriendStickFigure friend={friend} width={w} height={h} glow={false} />
      </div>
    </div>
  );
};

export const GLYPHS = "▓▒░#@%&?/\\<>*+=";
/** letters decode/scramble: `reveal` 0..1 = share of letters shown correctly */
export function scramble(text: string, f: number, reveal: number, seed = "s") {
  return text
    .split("")
    .map((c, i) => {
      if (c === " " || c === "'" || c === "." || c === "?") return c;
      const keep = rnd(`${seed}k${i}`) < reveal;
      if (keep) return c;
      return GLYPHS[Math.floor(rnd(`${seed}g${i}-${Math.floor(f / 2)}`) * GLYPHS.length)];
    })
    .join("");
}

export const typed = (text: string, f: number, start: number, cps: number) =>
  text.slice(0, clamp(Math.floor(((f - start) / 30) * cps), 0, text.length));

/** RGB-split text: set `g` (0..1) for glitch strength */
export const GlitchText: React.FC<{children: React.ReactNode; g?: number; style?: React.CSSProperties}> = ({children, g = 0, style}) => (
  <span style={{position: "relative", display: "inline-block", ...style}}>
    {g > 0.01 && (
      <>
        <span style={{position: "absolute", left: -3 * g, top: 0, whiteSpace: "nowrap", color: "#ff2e4d", opacity: 0.85, mixBlendMode: "screen"}}>{children}</span>
        <span style={{position: "absolute", left: 3 * g, top: 0, whiteSpace: "nowrap", color: "#2ee6ff", opacity: 0.85, mixBlendMode: "screen"}}>{children}</span>
      </>
    )}
    <span style={{position: "relative"}}>{children}</span>
  </span>
);

export const StatusBar: React.FC<{time?: string; f: number}> = ({time = "2:17", f}) => (
  <div style={{height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 38px 0 44px", fontFamily: INTER, color: "#e9eef7"}}>
    <span style={{fontSize: 26, fontWeight: 600, letterSpacing: 0.5}}>{time}</span>
    <div style={{display: "flex", alignItems: "center", gap: 14}}>
      <svg width="30" height="22" viewBox="0 0 30 22">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 8} y={16 - i * 5} width={5} height={6 + i * 5} rx={1.4} fill={i < 3 ? "#e9eef7" : "#566073"} />
        ))}
      </svg>
      <svg width="30" height="22" viewBox="0 0 30 22" fill="none" stroke="#e9eef7" strokeWidth="2.6" strokeLinecap="round">
        <path d="M3 8 Q15 -2 27 8" />
        <path d="M8 13 Q15 7 22 13" />
        <circle cx="15" cy="18" r="1.6" fill="#e9eef7" />
      </svg>
      <div style={{display: "flex", alignItems: "center", gap: 6}}>
        <span style={{fontSize: 20, fontWeight: 700, color: Math.floor(f / 18) % 2 === 0 ? "#ff5a5f" : "#ffb3b5", fontFamily: MONO}}>8%</span>
        <svg width="40" height="22" viewBox="0 0 40 22">
          <rect x="1" y="2" width="34" height="18" rx="5" fill="none" stroke="#e9eef7" strokeWidth="2" />
          <rect x="36" y="8" width="3" height="6" rx="1.5" fill="#e9eef7" />
          <rect x="4" y="5" width="5" height="12" rx="2" fill="#ff5a5f" />
        </svg>
      </div>
    </div>
  </div>
);

export const ChatHeader: React.FC<{sub: string; subColor?: string; avatarGlitch?: number}> = ({sub, subColor = "#8d99ad", avatarGlitch = 0}) => (
  <div style={{height: 112, display: "flex", alignItems: "center", gap: 18, padding: "0 26px", background: "linear-gradient(#141b27, #0f151f)", borderBottom: "1px solid rgba(255,255,255,0.06)"}}>
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#cfd8e6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4 L7 13 L16 22" />
    </svg>
    <Avatar friend="dev" size={64} glitch={avatarGlitch} />
    <div style={{display: "flex", flexDirection: "column", gap: 3}}>
      <span style={{fontFamily: INTER, fontSize: 31, fontWeight: 600, color: "#f1f5fb"}}>Dev</span>
      <span style={{fontFamily: INTER, fontSize: 20, color: subColor}}>{sub}</span>
    </div>
  </div>
);

export const Bubble: React.FC<{children: React.ReactNode; time?: string; timeColor?: string; style?: React.CSSProperties; accent?: string}> = ({children, time, timeColor = "#6f7c92", style, accent}) => (
  <div
    style={{
      maxWidth: 470,
      background: "linear-gradient(160deg,#222c3b,#1a2330)",
      border: `1px solid ${accent ?? "rgba(255,255,255,0.07)"}`,
      boxShadow: accent ? `0 0 30px ${accent}55` : "0 6px 20px rgba(0,0,0,0.35)",
      borderRadius: 26,
      borderTopLeftRadius: 8,
      padding: "20px 26px 14px",
      fontFamily: INTER,
      color: "#eaf0f8",
      ...style,
    }}
  >
    <div style={{fontSize: 33, fontWeight: 600, lineHeight: 1.3, wordBreak: "break-word"}}>{children}</div>
    {time && <div style={{fontFamily: MONO, fontSize: 17, color: timeColor, textAlign: "right", marginTop: 8}}>{time}</div>}
  </div>
);

export const DateChip: React.FC<{text: string; color?: string; g?: number; scale?: number}> = ({text, color = "#9fb0c8", g = 0, scale = 1}) => (
  <div style={{display: "flex", justifyContent: "center", margin: "22px 0 10px", transform: `scale(${scale})`}}>
    <span
      style={{
        fontFamily: MONO,
        fontSize: 21,
        fontWeight: 700,
        letterSpacing: 3,
        color,
        background: "rgba(255,255,255,0.06)",
        border: `1px solid ${color}55`,
        borderRadius: 999,
        padding: "9px 26px",
      }}
    >
      <GlitchText g={g}>{text}</GlitchText>
    </span>
  </div>
);

export const TypingDots: React.FC<{f: number}> = ({f}) => (
  <div style={{display: "inline-flex", gap: 9, background: "#1a2330", borderRadius: 26, borderTopLeftRadius: 8, padding: "20px 26px", border: "1px solid rgba(255,255,255,0.06)"}}>
    {[0, 1, 2].map((i) => {
      const t = Math.sin(f * 0.28 - i * 0.9);
      return <span key={i} style={{width: 14, height: 14, borderRadius: "50%", background: "#9db0cc", opacity: 0.35 + 0.65 * Math.max(0, t), transform: `translateY(${-5 * Math.max(0, t)}px)`}} />;
    })}
  </div>
);

export const InputBar: React.FC = () => (
  <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 118, background: "#0f151f", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 24px", gap: 16}}>
    <div style={{flex: 1, height: 64, borderRadius: 32, background: "#18202d", display: "flex", alignItems: "center", paddingLeft: 26, fontFamily: INTER, fontSize: 24, color: "#4d596d"}}>Message</div>
    <div style={{width: 64, height: 64, borderRadius: "50%", background: "#1b4f9e", opacity: 0.4}} />
  </div>
);
