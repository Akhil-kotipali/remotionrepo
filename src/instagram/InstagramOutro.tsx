import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {INTER, MONO, MONT} from "../part2/fonts";
import {E, kf, pulse} from "../part2/math";
import {FriendRig, stancePose} from "../part2/rig/FriendRig";

export const INSTA_OUTRO_DURATION = 120; // 4.0 seconds @ 30fps

export type InstagramOutroProps = {
  part: 1 | 2 | 3;
};

export const InstagramOutro: React.FC<InstagramOutroProps> = ({part}) => {
  const f = useCurrentFrame();

  // Animations timeline
  const introScale = kf(f, [[0, 0.96], [18, 1.0, E.out]]);
  const introFade = kf(f, [[0, 0], [10, 1]]);

  // Click timing on Instagram Follow button
  const clickAt = 26;
  const isFollowing = f >= clickAt;
  const clickScale = pulse(f, clickAt, 6);
  const btnScale = 1 - 0.08 * clickScale;

  // Ripple pulse on follow
  const rippleAt = 28;
  const rippleWave = kf(f, [[rippleAt, 0.9], [rippleAt + 24, 1.6, E.out]]);
  const rippleOpacity = kf(f, [[rippleAt, 0.8], [rippleAt + 24, 0]]);

  // Share plane wiggle (Instagram sends/shares trigger)
  const shareAt = 50;
  const isSharing = f >= shareAt && f <= shareAt + 36;
  const shareWiggle = isSharing ? Math.sin((f - shareAt) * 1.3) * 12 * Math.exp(-(f - shareAt) * 0.08) : 0;

  // Like thumbs up / heart pop
  const likeAt = 72;
  const isLiked = f >= likeAt;
  const likeScale = kf(f, [[likeAt, 0.8], [likeAt + 8, 1.25, E.back], [likeAt + 16, 1.0, E.soft]]);

  // Character poses
  const arjunPose = {
    ...stancePose("arjun"),
    lean: 1.5,
    headTilt: 3,
    lookX: 0.25,
    lookY: 0.0,
    eyeOpen: 1.05,
    brow: 0.2,
    blink: f > 45 && f < 51 ? 1 : 0,
  };

  const flankFriendId = part === 1 ? "dev" : part === 2 ? "meera" : "rahul";
  const flankPose = {
    ...stancePose(flankFriendId),
    lean: -1.5,
    headTilt: -3,
    lookX: -0.25,
    lookY: 0.0,
    eyeOpen: 1.0,
    brow: 0.15,
    mouth: 0.2,
    blink: f > 65 && f < 71 ? 1 : 0,
  };

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 40%, #160a22 0%, #0c0615 45%, #050209 100%)",
        overflow: "hidden",
        transform: `scale(${introScale})`,
        opacity: introFade,
      }}
    >
      {/* Background Instagram ambient glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          width: 900,
          height: 900,
          transform: "translate(-50%, -50%)",
          background: isFollowing
            ? "radial-gradient(circle, rgba(193, 53, 132, 0.18) 0%, rgba(131, 58, 180, 0.12) 40%, transparent 70%)"
            : "radial-gradient(circle, rgba(225, 48, 108, 0.22) 0%, rgba(245, 96, 64, 0.15) 45%, transparent 70%)",
          transition: "background 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Floating Instagram-gradient embers */}
      {Array.from({length: 22}).map((_, i) => {
        const y = (1920 + 300 - ((f * (1.1 + (i % 3) * 0.35) * 8 + i * 110) % 2200)) % 1920;
        const x = 70 + ((i * 197) % 940);
        const sz = 2.4 + (i % 4) * 1.6;
        const col = i % 3 === 0 ? "#e1306c" : i % 3 === 1 ? "#833ab4" : "#f56040";
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: sz,
              height: sz,
              borderRadius: "50%",
              background: col,
              opacity: 0.35 + 0.3 * Math.sin(f * 0.08 + i),
              boxShadow: `0 0 10px ${col}`,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}

      {/* Header Section (Safe for Reels Top UI) */}
      <div
        style={{
          position: "absolute",
          top: 175,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        {/* Series & Reel Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: MONO,
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: 6,
            color: "#ff80bf",
            textTransform: "uppercase",
            background: "rgba(131, 58, 180, 0.4)",
            border: "1.5px solid rgba(225, 48, 108, 0.7)",
            borderRadius: 999,
            padding: "8px 24px",
            marginBottom: 18,
            boxShadow: "0 0 25px rgba(225, 48, 108, 0.35)",
          }}
        >
          {/* Instagram mini camera glyph */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          {part === 1 ? "REELS · PART 2 DROPPING TOMORROW" : part === 2 ? "REELS · PART 3 DROPPING TOMORROW" : "REELS · PART 4 THE TAPE DROPS TOMORROW"}
        </div>

        {/* Big Hook Question */}
        <div
          style={{
            fontFamily: MONT,
            fontWeight: 900,
            fontSize: 58,
            lineHeight: 1.08,
            color: "#ffffff",
            textShadow: "0 4px 30px rgba(0,0,0,0.85), 0 0 40px rgba(225,48,108,0.35)",
          }}
        >
          FOLLOW TO UNLOCK
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {part === 1 ? "PART 2: THE EXTRA PERSON" : part === 2 ? "THE FINAL TRUTH" : "THE RECORDING REVEAL"}
          </span>
        </div>

        <div
          style={{
            marginTop: 10,
            fontFamily: INTER,
            fontWeight: 500,
            fontSize: 24,
            color: "#cbd5e1",
            letterSpacing: 2,
          }}
        >
          {part === 1
            ? "Instagram won't show Part 2 on your Explore feed unless you follow"
            : part === 2
            ? "The algorithm won't recommend Part 3 unless you're following"
            : "The algorithm won't recommend Part 4 unless you're following"}
        </div>
      </div>

      {/* Middle Interactive Teaser Card */}
      <div
        style={{
          position: "absolute",
          top: 550,
          left: "50%",
          transform: "translateX(-50%)",
          width: 760,
          height: 245,
          borderRadius: 24,
          background: "linear-gradient(135deg, rgba(26, 12, 38, 0.88) 0%, rgba(15, 8, 25, 0.72) 100%)",
          border: "2px solid rgba(225, 48, 108, 0.4)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.65), 0 0 35px rgba(225, 48, 108, 0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "20px 30px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 22,
            color: "#ff6699",
            letterSpacing: 4,
          }}
        >
          <div style={{width: 12, height: 12, borderRadius: "50%", background: "#ff4d5a", boxShadow: "0 0 10px #ff4d5a"}} />
          {part === 1 ? "THE BIGGEST QUESTION" : "THE GREAT DEBATE · WHO IS LYING?"}
        </div>
        <div
          style={{
            fontFamily: MONT,
            fontWeight: 900,
            fontSize: 32,
            color: "#ffffff",
            textAlign: "center",
            letterSpacing: 1.5,
            lineHeight: 1.25,
          }}
        >
          {part === 1 ? (
            <>
              Would you open the photo
              <br />
              <span style={{color: "#ff80bf"}}>or delete the backup immediately?</span>
            </>
          ) : part === 2 ? (
            <>
              Rahul says it's a reflection.
              <br />
              <span style={{color: "#f87171"}}>Kabir says it's IMPOSSIBLE.</span>
            </>
          ) : (
            <>
              Rahul says Dev left alone.
              <br />
              <span style={{color: "#f472b6"}}>Meera says Arjun followed him.</span>
            </>
          )}
        </div>
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 700,
            fontSize: 21,
            color: "#ff80bf",
            letterSpacing: 3,
            background: "rgba(225, 48, 108, 0.18)",
            border: "1px solid rgba(225, 48, 108, 0.5)",
            borderRadius: 999,
            padding: "4px 22px",
          }}
        >
          {part === 1 ? 'COMMENT "OPEN" OR "DELETE" 👇' : part === 2 ? 'COMMENT "RAHUL" OR "KABIR" 👇' : 'COMMENT "RAHUL" OR "MEERA" 👇'}
        </div>
      </div>

      {/* Characters on left and right flanks */}
      <div
        style={{
          position: "absolute",
          left: 65,
          top: 1080,
          width: 240 * 1.15,
          height: 440 * 1.15,
          filter: "drop-shadow(0 15px 35px rgba(0,0,0,0.85)) brightness(0.98)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -42,
            transform: `translate(-50%, 0) translateY(${Math.sin(f * 0.08) * 3}px)`,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(8, 12, 22, 0.92)",
            border: "2px solid #38bdf8",
            borderRadius: 999,
            padding: "4px 14px",
            boxShadow: "0 0 14px rgba(56, 189, 248, 0.6)",
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          <div style={{width: 8, height: 8, borderRadius: "50%", background: "#38bdf8", boxShadow: "0 0 8px #38bdf8"}} />
          <span style={{fontFamily: MONO, fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: 2}}>ARJUN</span>
        </div>
        <FriendRig id="arjun" pose={arjunPose} width={240 * 1.15} height={440 * 1.15} jacket rim={0.25} cool={0.15} />
      </div>

      <div
        style={{
          position: "absolute",
          right: 65,
          top: 1080,
          width: 240 * 1.15,
          height: 440 * 1.15,
          filter: "drop-shadow(0 15px 35px rgba(0,0,0,0.85)) brightness(0.98)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -42,
            transform: `translate(-50%, 0) translateY(${Math.sin(f * 0.08 + 1.2) * 3}px)`,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(8, 12, 22, 0.92)",
            border: `2px solid ${part === 1 ? "#ff4d5a" : "#f472b6"}`,
            borderRadius: 999,
            padding: "4px 14px",
            boxShadow: `0 0 14px ${part === 1 ? "rgba(255, 77, 90, 0.6)" : "rgba(244, 114, 182, 0.6)"}`,
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          <div style={{width: 8, height: 8, borderRadius: "50%", background: part === 1 ? "#ff4d5a" : "#f472b6", boxShadow: `0 0 8px ${part === 1 ? "#ff4d5a" : "#f472b6"}`}} />
          <span style={{fontFamily: MONO, fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: 2}}>
            {part === 1 ? "DEV 💀" : "MEERA"}
          </span>
        </div>
        <FriendRig id={flankFriendId as any} pose={flankPose} width={240 * 1.15} height={440 * 1.15} rim={0.25} cool={0.15} />
      </div>

      {/* CTA INTERACTIVE CARD (Center Lower) */}
      <div
        style={{
          position: "absolute",
          top: 830,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* Instagram Follow Pill Button */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            width: 580,
            height: 104,
            borderRadius: 52,
            background: isFollowing
              ? "linear-gradient(135deg, #1e1329 0%, #0d0615 100%)"
              : "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            border: isFollowing ? "3px solid #e1306c" : "3px solid #ff80bf",
            boxShadow: isFollowing
              ? "0 0 40px rgba(225, 48, 108, 0.4), 0 10px 30px rgba(0,0,0,0.6)"
              : "0 0 50px rgba(225, 48, 108, 0.75), 0 10px 30px rgba(0,0,0,0.6)",
            transform: `scale(${btnScale})`,
            transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Ripple wave pulse */}
          {f >= rippleAt && rippleOpacity > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 52,
                border: "3px solid #e1306c",
                transform: `scale(${rippleWave})`,
                opacity: rippleOpacity,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Plus icon or Checkmark */}
          {isFollowing ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13L9 17L19 7"
                stroke="#ff80bf"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5V19M5 12H19"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {/* Text */}
          <span
            style={{
              fontFamily: MONT,
              fontWeight: 800,
              fontSize: 38,
              letterSpacing: 3,
              color: isFollowing ? "#ff80bf" : "#ffffff",
            }}
          >
            {isFollowing ? "FOLLOWING" : "FOLLOW"}
          </span>
        </div>

        {/* Instagram Viral Action Bar: Share (DM) & Save & Like */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
          }}
        >
          {/* Share / DM Paper Airplane (Highest algorithm weight on Reels) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(225, 48, 108, 0.18)",
              border: "2px solid rgba(225, 48, 108, 0.6)",
              borderRadius: 40,
              padding: "12px 26px",
              boxShadow: "0 0 25px rgba(225, 48, 108, 0.3)",
              transform: `rotate(${shareWiggle}deg)`,
              transformOrigin: "50% 50%",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff80bf" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <span
              style={{
                fontFamily: MONT,
                fontWeight: 700,
                fontSize: 24,
                color: "#ff80bf",
                letterSpacing: 2,
              }}
            >
              SHARE (DM)
            </span>
          </div>

          {/* Bookmark / Save */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255, 255, 255, 0.08)",
              border: "2px solid rgba(255, 255, 255, 0.25)",
              borderRadius: 40,
              padding: "12px 24px",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span
              style={{
                fontFamily: MONT,
                fontWeight: 700,
                fontSize: 24,
                color: "#ffffff",
                letterSpacing: 2,
              }}
            >
              SAVE
            </span>
          </div>

          {/* Like Heart */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: isLiked ? "rgba(225, 48, 108, 0.25)" : "rgba(255, 255, 255, 0.08)",
              border: isLiked ? "2px solid #e1306c" : "2px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 40,
              padding: "12px 24px",
              transform: `scale(${isLiked ? likeScale : 1})`,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill={isLiked ? "#e1306c" : "#ffffff"}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span
              style={{
                fontFamily: MONT,
                fontWeight: 700,
                fontSize: 24,
                color: isLiked ? "#ff80bf" : "#ffffff",
                letterSpacing: 2,
              }}
            >
              LIKE
            </span>
          </div>
        </div>
      </div>

      {/* Animated Cursor clicking Follow button */}
      {f >= 12 && f <= 40 && (
        <div
          style={{
            position: "absolute",
            left: 540 + 80 * kf(f, [[12, 1.8], [26, 0, E.out]]),
            top: 870 + 90 * kf(f, [[12, 1.8], [26, 0, E.out]]),
            transform: `scale(${clickScale > 0 ? 0.85 : 1})`,
            pointerEvents: "none",
            filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.8))",
            zIndex: 99,
          }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="#ffffff">
            <path
              d="M3 3l7 18 3-7 7-3L3 3z"
              stroke="#000000"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Floating hearts from like */}
      {f >= likeAt &&
        [0, 1, 2, 3].map((idx) => {
          const prog = (f - likeAt - idx * 4) / 36;
          if (prog < 0 || prog > 1) return null;
          const hx = 680 + (idx - 1.5) * 45 + Math.sin(prog * 6) * 16;
          const hy = 1000 - prog * 160;
          const op = 1 - prog;
          const sc = 0.6 + prog * 0.8;
          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: hx,
                top: hy,
                transform: `scale(${sc})`,
                opacity: op,
                pointerEvents: "none",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#e1306c">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          );
        })}

      {/* Lower Center Binary Voting Pills */}
      <div
        style={{
          position: "absolute",
          top: 1205,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          width: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: MONT,
            fontWeight: 800,
            fontSize: 26,
            color: "#f8fafc",
            letterSpacing: 2,
          }}
        >
          {part === 1 ? "WHAT WOULD YOU DO? VOTE:" : "WHO IS LYING? VOTE IN COMMENTS:"}
        </div>
        <div style={{display: "flex", gap: 18}}>
          <div
            style={{
              padding: "10px 24px",
              borderRadius: 30,
              background: part === 3 ? "rgba(74, 222, 128, 0.2)" : "rgba(56, 189, 248, 0.2)",
              border: `2px solid ${part === 3 ? "#4ade80" : "#38bdf8"}`,
              color: part === 3 ? "#4ade80" : "#38bdf8",
              fontFamily: MONT,
              fontWeight: 900,
              fontSize: 26,
              letterSpacing: 2,
              whiteSpace: "nowrap",
              boxShadow: part === 3 ? "0 0 20px rgba(74, 222, 128, 0.4)" : "0 0 20px rgba(56, 189, 248, 0.4)",
            }}
          >
            {part === 1 ? "[ OPEN IT ]" : part === 2 ? "[ RAHUL ]" : "[ RAHUL ]"}
          </div>
          <div
            style={{
              padding: "10px 24px",
              borderRadius: 30,
              background: part === 3 ? "rgba(244, 114, 182, 0.2)" : "rgba(239, 68, 68, 0.2)",
              border: `2px solid ${part === 3 ? "#f472b6" : "#ef4444"}`,
              color: part === 3 ? "#f472b6" : "#ef4444",
              fontFamily: MONT,
              fontWeight: 900,
              fontSize: 26,
              letterSpacing: 2,
              whiteSpace: "nowrap",
              boxShadow: part === 3 ? "0 0 20px rgba(244, 114, 182, 0.4)" : "0 0 20px rgba(239, 68, 68, 0.4)",
            }}
          >
            {part === 1 ? "[ DELETE IT ]" : part === 2 ? "[ KABIR ]" : "[ MEERA ]"}
          </div>
        </div>
      </div>

      {/* Bottom Safe Footer (Above Instagram handle / audio safe zone) */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 700,
            fontSize: 32,
            color: "#ffffff",
            letterSpacing: 2,
            textShadow: "0 0 25px rgba(225,48,108,0.5)",
          }}
        >
          {part === 1 ? "Share to your story & comment below 📲" : "Share via DM to a friend & vote below ✈️"}
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: MONO,
            fontSize: 20,
            color: "#94a3b8",
            letterSpacing: 4,
          }}
        >
          EVERYONE REMEMBERS IT DIFFERENTLY
        </div>
      </div>

      {/* Synchronized Sound Effects */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/sfx/whoosh_soft.wav")} volume={0.4} />
      </Sequence>
      <Sequence from={clickAt}>
        <Audio src={staticFile("audio/sfx/bubble_pop.wav")} volume={0.65} />
      </Sequence>
      <Sequence from={rippleAt}>
        <Audio src={staticFile("audio/sfx/notif_ping.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={likeAt}>
        <Audio src={staticFile("audio/sfx/match_beep.wav")} volume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
};
