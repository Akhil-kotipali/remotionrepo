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

  // Character poses — Rahul & Meera
  const rahulPose = {
    ...stancePose("rahul"),
    lean: 1.5,
    headTilt: 3,
    lookX: 0.3,
    lookY: 0.0,
    eyeOpen: 1.05,
    brow: 0.2,
    blink: f > 45 && f < 51 ? 1 : 0,
  };

  const meeraPose = {
    ...stancePose("meera"),
    lean: -1.5,
    headTilt: -3,
    lookX: -0.3,
    lookY: 0.0,
    eyeOpen: 1.1,
    brow: 0.2,
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
          PART 4 COMING SOON
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
            THE PART 4 REVEAL
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
          YouTube won't show the tape on your feed unless you subscribe
        </div>
      </div>

      {/* Next Episode Teaser Card (Center) */}
      <div
        style={{
          position: "absolute",
          top: 620,
          left: "50%",
          transform: "translateX(-50%)",
          width: 820,
          background: "rgba(12, 19, 36, 0.85)",
          border: "2px solid rgba(56, 189, 248, 0.25)",
          borderRadius: 32,
          padding: "36px 40px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(56, 189, 248, 0.08)",
          backdropFilter: "blur(12px)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 6,
            color: "#ff6a74",
            textTransform: "uppercase",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <span style={{width: 8, height: 8, borderRadius: "50%", background: "#ff4d5a"}} />
          THE GREAT DEBATE · WHO IS LYING?
        </div>

        <div
          style={{
            fontFamily: MONT,
            fontWeight: 800,
            fontSize: 34,
            lineHeight: 1.35,
            color: "#ffffff",
          }}
        >
          Rahul says Dev walked alone.
          <br />
          <span style={{color: "#f472b6"}}>Meera says Arjun followed him.</span>
        </div>

        <div
          style={{
            marginTop: 18,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 26,
            color: "#38bdf8",
            letterSpacing: 3,
            background: "rgba(56, 189, 248, 0.12)",
            padding: "10px 24px",
            borderRadius: 999,
            display: "inline-block",
            border: "1px dashed rgba(56, 189, 248, 0.4)",
          }}
        >
          COMMENT "RAHUL" OR "MEERA" 👇
        </div>
      </div>

      {/* Main CTA: Big Animated YouTube Subscribe Button */}
      <div
        style={{
          position: "absolute",
          top: 1000,
          left: "50%",
          transform: `translateX(-50%) scale(${btnScale})`,
          transition: "transform 0.1s ease",
          width: 620,
          height: 120,
          borderRadius: 999,
          background: isSubscribed
            ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
            : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          border: isSubscribed ? "3px solid #38bdf8" : "3px solid #f87171",
          boxShadow: isSubscribed
            ? "0 0 50px rgba(56, 189, 248, 0.6), 0 10px 30px rgba(0,0,0,0.5)"
            : "0 0 50px rgba(239, 68, 68, 0.7), 0 10px 30px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          cursor: "pointer",
        }}
      >
        {/* Animated Checkmark / Play Icon */}
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
          {isSubscribed ? (
            <path
              d="M5 13l4 4L19 7"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M19 12H5m14 0l-6 6m6-6l-6-6"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>

        <span
          style={{
            fontFamily: MONT,
            fontWeight: 900,
            fontSize: 42,
            letterSpacing: 4,
            color: "#ffffff",
          }}
        >
          {isSubscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
        </span>

        {/* Bell Icon */}
        <div style={{position: "relative"}}>
          <svg
            width="42"
            height="42"
            viewBox="0 0 24 24"
            fill={isSubscribed ? "#ffd700" : "none"}
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: `rotate(${bellWiggle}deg)`,
              transformOrigin: "top center",
              filter: isSubscribed ? "drop-shadow(0 0 8px #ffd700)" : "none",
            }}
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>

          {/* Bell sound wave shockwave */}
          {f >= bellAt && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 60,
                height: 60,
                transform: `translate(-50%, -50%) scale(${bellWave})`,
                borderRadius: "50%",
                border: "2px solid #ffd700",
                opacity: bellWaveOpacity,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      </div>

      {/* Engagement Floating Bar: Like & Comment */}
      <div
        style={{
          position: "absolute",
          top: 1160,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 28,
        }}
      >
        {/* Like Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: isLiked ? "rgba(239, 68, 68, 0.25)" : "rgba(15, 23, 42, 0.8)",
            border: isLiked ? "2px solid #ef4444" : "2px solid rgba(255,255,255,0.2)",
            borderRadius: 999,
            padding: "16px 36px",
            transform: `scale(${likeScale})`,
            boxShadow: isLiked ? "0 0 24px rgba(239, 68, 68, 0.5)" : "none",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill={isLiked ? "#ef4444" : "none"} stroke={isLiked ? "#ef4444" : "#ffffff"} strokeWidth="2.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span style={{fontFamily: MONT, fontWeight: 800, fontSize: 28, color: "#fff"}}>LIKE</span>
        </div>

        {/* Comment Theory Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: "rgba(15, 23, 42, 0.8)",
            border: "2px solid rgba(56, 189, 248, 0.4)",
            borderRadius: 999,
            padding: "16px 36px",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span style={{fontFamily: MONT, fontWeight: 800, fontSize: 28, color: "#38bdf8"}}>THEORY</span>
        </div>
      </div>

      {/* Characters standing at bottom left and right */}
      {/* Rahul on Left (green) */}
      <div
        style={{
          position: "absolute",
          left: 100,
          bottom: 120,
          width: 220,
          height: 480,
          filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.8))",
        }}
      >
        <FriendRig id="rahul" pose={rahulPose} width={220} height={480} jacket={false} rim={0.4} />
      </div>

      {/* Meera on Right (pink) */}
      <div
        style={{
          position: "absolute",
          right: 100,
          bottom: 120,
          width: 200,
          height: 480,
          filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.8))",
        }}
      >
        <FriendRig id="meera" pose={meeraPose} width={200} height={480} jacket={false} rim={0.4} />
      </div>

      {/* Interactive Voting Pill at Bottom Center */}
      <div
        style={{
          position: "absolute",
          bottom: 160,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: MONT,
            fontWeight: 800,
            fontSize: 26,
            color: "#ffffff",
            letterSpacing: 2,
            marginBottom: 12,
            textShadow: "0 2px 10px rgba(0,0,0,0.9)",
          }}
        >
          WHO IS LYING? VOTE IN COMMENTS:
        </div>
        <div style={{display: "flex", gap: 16, justifyContent: "center"}}>
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 28,
              color: "#4ade80",
              background: "rgba(74, 222, 128, 0.15)",
              border: "2px solid #4ade80",
              padding: "10px 24px",
              borderRadius: 16,
              boxShadow: "0 0 20px rgba(74, 222, 128, 0.3)",
            }}
          >
            [ RAHUL ]
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 28,
              color: "#f472b6",
              background: "rgba(244, 114, 182, 0.15)",
              border: "2px solid #f472b6",
              padding: "10px 24px",
              borderRadius: 16,
              boxShadow: "0 0 20px rgba(244, 114, 182, 0.3)",
            }}
          >
            [ MEERA ]
          </div>
        </div>
      </div>

      {/* Outro SFX Triggers */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/sfx/whoosh.wav")} volume={0.6} />
      </Sequence>
      <Sequence from={clickAt}>
        <Audio src={staticFile("audio/sfx/ui_click.wav")} volume={0.8} />
        <Audio src={staticFile("audio/sfx/match_beep.wav")} volume={0.5} />
      </Sequence>
      <Sequence from={bellAt}>
        <Audio src={staticFile("audio/sfx/notif_ping.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={likeAt}>
        <Audio src={staticFile("audio/sfx/bubble_pop.wav")} volume={0.6} />
      </Sequence>
    </AbsoluteFill>
  );
};

