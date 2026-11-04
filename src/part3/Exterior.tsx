import React from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from "remotion";
import {E, kf, noise, pulse, rnd} from "./math";

const FOG = Array.from({length: 7}, (_, i) => ({y: 900 + rnd(`fy${i}`) * 700, sp: 0.2 + rnd(`fs${i}`) * 0.4, o: 0.05 + rnd(`fo${i}`) * 0.08, w: 700 + rnd(`fw${i}`) * 600}));

/** the abandoned house — slow push toward the open door, a cold glint inside */
export const Exterior: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 1428 || f >= 1545) return null;
  const t = f - 1428;
  const appear = kf(f, [[1428, 0], [1436, 1]]);
  const z = kf(t, [[0, 1.0], [117, 1.85, E.soft]]);
  // door centre in world px (plate scaled to 1080 wide): orig (958,1600) → ×0.703
  const fx = 674;
  const fy = 1125;
  const tx = (540 - fx) * ((z - 1) / 0.85) * 0.85;
  const ty = (900 - fy) * ((z - 1) / 0.85) * 0.85;
  const glint = kf(t, [[40, 0], [56, 1]]) * (0.5 + 0.5 * Math.abs(Math.sin(t * 0.22) * Math.sin(t * 0.07)));
  const streetlamp = 0.85 + 0.15 * noise(f * 0.4) - (pulse(f, 1470, 6) > 0 ? 0.4 : 0);
  return (
    <AbsoluteFill style={{background: "#02040a", opacity: appear, overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1935, transformOrigin: `${fx}px ${fy}px`, transform: `translate(${tx}px, ${ty}px) scale(${z})`}}>
        <Img src={staticFile("backgrounds/exterior.jpg")} style={{position: "absolute", inset: 0, width: 1080, height: 1935, filter: "brightness(0.75) saturate(0.8)"}} />
        {/* street lamp breathing */}
        <div style={{position: "absolute", left: 20, top: 780, width: 360, height: 360, background: "radial-gradient(circle, rgba(255,200,120,0.4), rgba(255,200,120,0) 70%)", mixBlendMode: "screen", opacity: streetlamp}} />
        {/* the phone's glint just inside the doorway */}
        <div style={{position: "absolute", left: 630, top: 1195, width: 110, height: 130, background: "radial-gradient(ellipse, rgba(150,210,255,1), rgba(150,210,255,0) 70%)", mixBlendMode: "screen", opacity: glint}} />
        <div style={{position: "absolute", left: 676, top: 1250, width: 18, height: 30, border: "2px solid rgba(220,240,255,0.9)", borderRadius: 4, opacity: glint, transform: "rotate(-14deg)"}} />
        {/* fog */}
        {FOG.map((fg, i) => (
          <div key={i} style={{position: "absolute", left: ((f * fg.sp * 1.4 + i * 260) % 1700) - 500, top: fg.y, width: fg.w, height: 160, background: "radial-gradient(ellipse, rgba(170,190,220,0.5), rgba(170,190,220,0) 70%)", opacity: fg.o}} />
        ))}
      </div>
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.9) 100%)"}} />
      <AbsoluteFill style={{background: "#ff1f2d", mixBlendMode: "screen", opacity: pulse(f, 1428, 8) * 0.18}} />
    </AbsoluteFill>
  );
};
