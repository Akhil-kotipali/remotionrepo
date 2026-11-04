import React from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from "remotion";
import {ARJUN, LAMP, WINDOW, WORLD_H, WORLD_W} from "./config";
import {arjunPose, arjunX, cameraAt, cameraShake, lampLevel} from "./choreo";
import {ArjunRig} from "./rig/ArjunRig";
import {clamp, kf, rnd} from "./math";

/** floating dust inside the lamp cone — deterministic, loops forever */
const DUST = Array.from({length: 46}, (_, i) => ({
  x: 250 + rnd(`dx${i}`) * 520,
  y: 650 + rnd(`dy${i}`) * 760,
  r: 1.4 + rnd(`dr${i}`) * 2.6,
  sp: 0.15 + rnd(`ds${i}`) * 0.5,
  ph: rnd(`dp${i}`) * 6.28,
}));

export const World: React.FC = () => {
  const f = useCurrentFrame();
  const cam = cameraAt(f);
  const sh = cameraShake(f);
  const s = cam.s;
  const x = clamp(cam.x, 540 / s, WORLD_W - 540 / s);
  const y = clamp(cam.y, 960 / s, WORLD_H - 960 / s);

  const pose = arjunPose(f);
  const ax = arjunX(f);
  const k = ARJUN.height / 440;
  const figW = 240 * k;
  const figTop = ARJUN.feetY - 416 * k;
  const lamp = lampLevel(f);

  const bgBlur = clamp((s - 1.35) * 2.4, 0, 3.2); // depth of field on close-ups (hides plate softness)
  const grade = kf(f, [[700, 0], [716, 1], [800, 1], [936, 0.35], [1128, 0.5]]); // cold desaturation when scared

  return (
    <AbsoluteFill style={{background: "#04060b", overflow: "hidden"}}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transformOrigin: "540px 960px",
          transform: `translate(${sh.dx}px, ${sh.dy}px) rotate(${cam.rot}deg)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: WORLD_W,
            height: WORLD_H,
            transformOrigin: "0 0",
            transform: `translate(${540 - x * s}px, ${960 - y * s}px) scale(${s})`,
            filter: `saturate(${1 - grade * 0.28}) contrast(${1.05 + grade * 0.05})`,
          }}
        >
          {/* PLATE */}
          <Img
            src={staticFile("backgrounds/bedroom.jpg")}
            style={{position: "absolute", inset: 0, width: WORLD_W, height: WORLD_H, filter: `blur(${bgBlur}px)`}}
          />

          {/* lamp bloom (flickers) */}
          <div
            style={{
              position: "absolute",
              left: LAMP.x - 420,
              top: LAMP.y - 420,
              width: 840,
              height: 840,
              background: "radial-gradient(circle, rgba(255,176,86,0.34) 0%, rgba(255,150,60,0.12) 38%, rgba(255,140,50,0) 70%)",
              mixBlendMode: "screen",
              opacity: lamp,
            }}
          />
          {/* moon beam from the window */}
          <div
            style={{
              position: "absolute",
              left: WINDOW.x - 330,
              top: WINDOW.y - 300,
              width: 660,
              height: 760,
              background: "radial-gradient(ellipse, rgba(120,165,255,0.20) 0%, rgba(110,150,255,0.07) 45%, rgba(110,150,255,0) 72%)",
              mixBlendMode: "screen",
              opacity: 0.85 + 0.15 * Math.sin(f * 0.03),
            }}
          />

          {/* floor: phone light spilling in front of Arjun */}
          <div
            style={{
              position: "absolute",
              left: ax - 250,
              top: ARJUN.feetY - 190,
              width: 500,
              height: 220,
              background: "radial-gradient(ellipse, rgba(110,170,255,0.5) 0%, rgba(110,170,255,0) 70%)",
              mixBlendMode: "screen",
              opacity: pose.phoneGlow * 0.32,
            }}
          />
          {/* soft contact shadow */}
          <div
            style={{
              position: "absolute",
              left: ax - 190,
              top: ARJUN.feetY - 26,
              width: 380,
              height: 56,
              background: "radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)",
            }}
          />

          {/* ARJUN */}
          <div
            style={{
              position: "absolute",
              left: ax - figW / 2,
              top: figTop,
              width: figW,
              height: ARJUN.height,
              filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.45)) brightness(0.9) saturate(0.95)",
            }}
          >
            <ArjunRig pose={pose} width={figW} height={ARJUN.height} rim={0.2 * lamp} cool={0.14} />
          </div>

          {/* dust motes */}
          {DUST.map((d, i) => {
            const px = d.x + Math.sin(f * 0.01 * d.sp * 4 + d.ph) * 26;
            const py = 650 + ((((d.y - 650 - f * d.sp * 0.55) % 760) + 760) % 760);
            const near = Math.exp(-(((px - LAMP.x) ** 2 + (py - LAMP.y) ** 2) / (2 * 260 ** 2)));
            const o = (0.18 + 0.82 * near) * (0.35 + 0.3 * Math.sin(f * 0.05 + d.ph)) * lamp;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: px,
                  top: py,
                  width: d.r,
                  height: d.r,
                  borderRadius: "50%",
                  background: "#ffe2b8",
                  opacity: clamp(o, 0, 0.7),
                  filter: "blur(0.6px)",
                }}
              />
            );
          })}

          {/* hides the generator's corner mark + roots the bottom of the frame */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: WORLD_H - 190,
              width: WORLD_W,
              height: 190,
              background: "linear-gradient(to bottom, rgba(4,6,11,0) 0%, rgba(4,6,11,0.92) 62%, #04060b 100%)",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
