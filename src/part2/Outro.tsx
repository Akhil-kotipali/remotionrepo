import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {INTER, MONO, MONT} from "./fonts";
import {E, kf, pulse} from "./math";
import {FriendRig, stancePose} from "./rig/FriendRig";

export const OUTRO_DURATION = 120; // 4.0 seconds @ 30fps

export const Outro: React.FC = () => {
  const f = useCurrentFrame();

  // Animations timeline
  const introScale = kf(f, [[0, 0.96], [18, 1.0, E.out]]);
  const introFade = kf(f, [[0, 0], [10, 1]]);

  // Click timing on Subscribe button
  const clickAt = 26;
  const isSubscribed = f >= clickAt;
  const clickScale = pulse(f, clickAt, 6);
  const btnScale = 1 - 0.08 * clickScale;

  // Bell ring timing
  const bellAt = 46;
  const isRinging = f >= bellAt && f <= bellAt + 36;
  const bellWiggle = isRinging ? Math.sin((f - bellAt) * 1.25) * 16 * Math.exp(-(f - bellAt) * 0.07) : 0;
  const bellWave = kf(f, [[bellAt, 0], [bellAt + 24, 1.8, E.out]]);
  const bellWaveOpacity = kf(f, [[bellAt, 0.8], [bellAt + 24, 0]]);

  // Like thumbs up / heart pop
  const likeAt = 70;
  const isLiked = f >= likeAt;
  const likeScale = kf(f, [[likeAt, 0.8], [likeAt + 8, 1.25, E.back], [likeAt + 16, 1.0, E.soft]]);

  // Character poses — grounded and perfectly in line with character models
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

  const meeraPose = {
    ...stancePose("meera"),
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
        background: "radial-gradient(ellipse at 50% 45%, #0d1627 0%, #040711 75%, #010206 100%)",
        overflow: "hidden",
        transform: `scale(${introScale})`,
        opacity: introFade,
      }}
    >
      {/* Background ambient lighting glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          width: 900,
          height: 900,
          transform: "translate(-50%, -50%)",
          background: isSubscribed
            ? "radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(239, 68, 68, 0.20) 0%, transparent 65%)",
          transition: "background 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Floating subtle embers */}
      {Array.from({length: 20}).map((_, i) => {
        const y = (1920 + 300 - ((f * (1.1 + (i % 3) * 0.35) * 8 + i * 110) % 2200)) % 1920;
        const x = 80 + ((i * 193) % 920);
        const sz = 2.4 + (i % 4) * 1.6;
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
              background: i % 2 === 0 ? "#ff8844" : "#44bbff",
              opacity: 0.35 + 0.3 * Math.sin(f * 0.08 + i),
              boxShadow: `0 0 10px ${i % 2 === 0 ? "#ff8844" : "#44bbff"}`,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}

      {/* Header Section */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        {/* Series Badge */}
        <div
          style={{
            display: "inline-block",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 8,
            color: "#60a5fa",
            textTransform: "uppercase",
            background: "rgba(30, 58, 138, 0.45)",
            border: "1.5px solid rgba(96, 165, 250, 0.6)",
            borderRadius: 999,
            padding: "8px 26px",
            marginBottom: 20,
            boxShadow: "0 0 20px rgba(96, 165, 250, 0.3)",
          }}
        >
          PART 3 COMING SOON
        </div>

        {/* Big Hook Question */}
        <div
          style={{
            fontFamily: MONT,
            fontWeight: 900,
            fontSize: 70,
            lineHeight: 1.08,
            color: "#ffffff",
            textShadow: "0 4px 30px rgba(0,0,0,0.8), 0 0 40px rgba(255,255,255,0.2)",
          }}
        >
          SUBSCRIBE FOR
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #ff4d5a 0%, #ff8844 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            THE PART 3 TRUTH
          </span>
        </div>

        <div
          style={{
            marginTop: 18,
            fontFamily: INTER,
            fontWeight: 500,
            fontSize: 28,
            color: "#cbd5e1",
            letterSpacing: 2,
          }}
        >
          YouTube won't show Part 3 on your feed unless you subscribe
        </div>
      </div>

      {/* Next Episode Teaser Card (Center) */}
      <div
        style={{
          position: "absolute",
          top: 540,
          left: "50%",
          transform: "translateX(-50%)",
          width: 760,
          height: 255,
          borderRadius: 24,
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.65) 100%)",
          border: "2px solid rgba(148, 163, 184, 0.3)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(56, 189, 248, 0.15)",
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
            color: "#ff4d5a",
            letterSpacing: 4,
          }}
        >
          <div style={{width: 12, height: 12, borderRadius: "50%", background: "#ff4d5a", boxShadow: "0 0 10px #ff4d5a"}} />
          THE GREAT DEBATE · WHO IS LYING?
        </div>
        <div
          style={{
            fontFamily: MONT,
            fontWeight: 900,
            fontSize: 34,
            color: "#ffffff",
            textAlign: "center",
            letterSpacing: 1.5,
            lineHeight: 1.25,
          }}
        >
          Rahul says it's a reflection.
          <br />
          <span style={{color: "#f87171"}}>Kabir says it's IMPOSSIBLE.</span>
        </div>
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 700,
            fontSize: 22,
            color: "#38bdf8",
            letterSpacing: 3,
            background: "rgba(56, 189, 248, 0.15)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            borderRadius: 999,
            padding: "4px 20px",
          }}
        >
          COMMENT "RAHUL" OR "KABIR" 👇
        </div>
      </div>

      {/* Characters on left and right flanks */}
      <div
        style={{
          position: "absolute",
          left: 70,
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
          right: 70,
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
            border: "2px solid #f472b6",
            borderRadius: 999,
            padding: "4px 14px",
            boxShadow: "0 0 14px rgba(244, 114, 182, 0.6)",
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          <div style={{width: 8, height: 8, borderRadius: "50%", background: "#f472b6", boxShadow: "0 0 8px #f472b6"}} />
          <span style={{fontFamily: MONO, fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: 2}}>MEERA</span>
        </div>
        <FriendRig id="meera" pose={meeraPose} width={240 * 1.15} height={440 * 1.15} rim={0.25} cool={0.15} />
      </div>

      {/* CTA INTERACTIVE CARD (Center Lower) */}
      <div
        style={{
          position: "absolute",
          top: 850,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        {/* Subscribe Pill Button */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            width: 580,
            height: 104,
            borderRadius: 52,
            background: isSubscribed
              ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
              : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
            border: isSubscribed ? "3px solid #38bdf8" : "3px solid #f87171",
            boxShadow: isSubscribed
              ? "0 0 40px rgba(56, 189, 248, 0.4), 0 10px 30px rgba(0,0,0,0.6)"
              : "0 0 50px rgba(239, 68, 68, 0.7), 0 10px 30px rgba(0,0,0,0.6)",
            transform: `scale(${btnScale})`,
            transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Bell pulse ring */}
          {f >= bellAt && bellWaveOpacity > 0 && (
            <div
              style={{
                position: "absolute",
                right: 28,
                width: 60,
                height: 60,
                borderRadius: "50%",
                border: "3px solid #facc15",
                transform: `scale(${bellWave})`,
                opacity: bellWaveOpacity,
                pointerEvents: "none",
              }}
            />
          )}

          {/* YouTube Play Triangle or Checkmark */}
          {isSubscribed ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13L9 17L19 7"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" color="#ffffff">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          )}

          {/* Text */}
          <span
            style={{
              fontFamily: MONT,
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: 3,
              color: isSubscribed ? "#38bdf8" : "#ffffff",
            }}
          >
            {isSubscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
          </span>

          {/* Golden Notification Bell */}
          <div
            style={{
              marginLeft: 8,
              display: "flex",
              alignItems: "center",
              transform: `rotate(${bellWiggle}deg)`,
              transformOrigin: "50% 10%",
            }}
          >
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill={isSubscribed ? "#facc15" : "rgba(255,255,255,0.7)"}
            >
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
            </svg>
          </div>
        </div>

        {/* Like & Comment Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
          }}
        >
          {/* Like Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: isLiked ? "rgba(239, 68, 68, 0.22)" : "rgba(255, 255, 255, 0.08)",
              border: isLiked ? "2px solid #ef4444" : "2px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 40,
              padding: "14px 34px",
              boxShadow: isLiked ? "0 0 30px rgba(239, 68, 68, 0.4)" : "none",
              transform: `scale(${isLiked ? likeScale : 1})`,
            }}
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill={isLiked ? "#ef4444" : "#ffffff"}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span
              style={{
                fontFamily: MONT,
                fontWeight: 700,
                fontSize: 30,
                color: isLiked ? "#f87171" : "#ffffff",
                letterSpacing: 2,
              }}
            >
              LIKE
            </span>
          </div>

          {/* Comment Bubble */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "rgba(255, 255, 255, 0.08)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 40,
              padding: "14px 34px",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#60a5fa">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
            </svg>
            <span
              style={{
                fontFamily: MONT,
                fontWeight: 700,
                fontSize: 30,
                color: "#93c5fd",
                letterSpacing: 2,
              }}
            >
              THEORY
            </span>
          </div>
        </div>
      </div>

      {/* Cursor Animation clicking the button */}
      {f >= 12 && f <= 40 && (
        <div
          style={{
            position: "absolute",
            left: 540 + 80 * kf(f, [[12, 1.8], [26, 0, E.out]]),
            top: 890 + 90 * kf(f, [[12, 1.8], [26, 0, E.out]]),
            transform: `scale(${clickScale > 0 ? 0.85 : 1})`,
            pointerEvents: "none",
            filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.7))",
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

      {/* Floating hearts / particles from like */}
      {f >= likeAt &&
        [0, 1, 2, 3].map((idx) => {
          const prog = (f - likeAt - idx * 4) / 36;
          if (prog < 0 || prog > 1) return null;
          const hx = 440 + (idx - 1.5) * 50 + Math.sin(prog * 6) * 16;
          const hy = 1010 - prog * 160;
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#ef4444">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          );
        })}

      {/* Lower Center Binary Debate Buttons between characters */}
      <div
        style={{
          position: "absolute",
          top: 1205,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          width: 520,
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
          WHO IS LYING? VOTE IN COMMENTS:
        </div>
        <div style={{display: "flex", gap: 20}}>
          <div
            style={{
              padding: "12px 28px",
              borderRadius: 30,
              background: "rgba(56, 189, 248, 0.2)",
              border: "2px solid #38bdf8",
              color: "#38bdf8",
              fontFamily: MONT,
              fontWeight: 900,
              fontSize: 28,
              letterSpacing: 3,
              boxShadow: "0 0 20px rgba(56, 189, 248, 0.4)",
            }}
          >
            [ RAHUL ]
          </div>
          <div
            style={{
              padding: "12px 28px",
              borderRadius: 30,
              background: "rgba(239, 68, 68, 0.2)",
              border: "2px solid #ef4444",
              color: "#ef4444",
              fontFamily: MONT,
              fontWeight: 900,
              fontSize: 28,
              letterSpacing: 3,
              boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)",
            }}
          >
            [ KABIR ]
          </div>
        </div>
      </div>

      {/* Bottom theory prompt footer */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 700,
            fontSize: 34,
            color: "#f8fafc",
            letterSpacing: 2,
            textShadow: "0 0 20px rgba(255,255,255,0.4)",
          }}
        >
          Comment RAHUL or KABIR below 👇
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: MONO,
            fontSize: 22,
            color: "#64748b",
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
      <Sequence from={bellAt}>
        <Audio src={staticFile("audio/sfx/notif_ping.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={likeAt}>
        <Audio src={staticFile("audio/sfx/match_beep.wav")} volume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
};
