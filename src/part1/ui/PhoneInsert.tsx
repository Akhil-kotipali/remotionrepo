import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {INSERTS} from "../config";
import {E, kf, noise, pulse} from "../math";
import {ChatScreen, ColdScreen, ContactScreen, ListScreen, PhotoChatScreen, RestoreScreen} from "./Screens";

const BUZZ = [333, 795, 1126, 1312];

const ScreenFor: React.FC<{f: number}> = ({f}) => {
  if (f < 162) return <ColdScreen f={f} />;
  if (f < 318) return <RestoreScreen f={f} />;
  if (f < 378) return f < 333 ? <RestoreScreen f={f} /> : <ListScreen f={f} />;
  if (f < 462) return <ContactScreen f={f} />;
  if (f < 1314) return <ChatScreen f={f} />;
  return <PhotoChatScreen f={f} />;
};

export const PhoneInsert: React.FC = () => {
  const f = useCurrentFrame();
  const win = INSERTS.find(([a, b]) => f >= a && f <= b);
  if (!win) return null;
  const [a, b] = win;
  const cold = a === 0;
  const zoomThrough = b === 1425;

  const pin = cold ? 1 : kf(f, [[a, 0], [a + 14, 1, E.out]]);
  const pout = zoomThrough ? kf(f, [[b - 24, 0], [b, 1, E.in]]) : cold ? kf(f, [[b - 3, 0], [b, 1]]) : kf(f, [[b - 10, 0], [b, 1, E.in]]);
  const vis = pin * (1 - pout);

  // phone "camera" — cold open starts tight on the header and pulls back
  const coldS = cold ? kf(f, [[0, 1.7], [140, 1.0, E.soft]]) : 1;
  const hookKick = cold ? (pulse(f, 0, 16) * 0.08 + pulse(f, 81, 14) * 0.06) : 0;
  const slow = 1 + (f - a) * 0.00028;
  const zt = zoomThrough ? kf(f, [[b - 24, 1], [b, 2.4, E.in]]) : 1;
  const sc = (0.86 + 0.14 * pin) * slow * (coldS + hookKick) * zt * 1.1;
  const buzz = BUZZ.reduce((m, z) => Math.max(m, pulse(f, z, 16)), 0);
  const hookShake = cold ? (pulse(f, 0, 12) * 8 + pulse(f, 81, 10) * 6) : 0;
  const jx = Math.sin(f * 3.1) * (7 * buzz + hookShake);
  const jy = Math.cos(f * 2.7) * (5 * buzz + hookShake * 0.6);

  // screen content zoom (date-chip emphasis, 1150-1318)
  const zs = kf(f, [[1148, 1], [1184, 1.4, E.out], [1296, 1.5], [1318, 1.0]]);

  const glow = 0.55 + 0.25 * noise(f * 0.4);
  const origin = cold ? "50% 22%" : "50% 50%";

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {/* backdrop */}
      <AbsoluteFill
        style={{
          background: cold ? "#04060b" : "rgba(3,5,10,0.66)",
          opacity: cold ? 1 - pout : vis,
          backdropFilter: cold ? undefined : `blur(${16 * vis}px)`,
        }}
      />
      <AbsoluteFill style={{display: "flex", alignItems: "center", justifyContent: "center", opacity: zoomThrough ? 1 - pout * pout : vis}}>
        <div
          style={{
            marginTop: -140,
            transformOrigin: origin,
            transform: `translate(${jx}px, ${(1 - pin) * 220 + jy}px) scale(${sc}) rotate(${(1 - pin) * -3 + Math.sin(f * 0.02) * 0.45}deg)`,
          }}
        >
          {/* device */}
          <div
            style={{
              width: 640,
              height: 1280,
              borderRadius: 96,
              padding: 20,
              boxSizing: "border-box",
              background: "linear-gradient(145deg,#3a4150 0%,#12151c 40%,#0a0c11 100%)",
              boxShadow: `0 0 0 2px #4a5163 inset, 0 0 ${90 * glow}px ${14 * glow}px rgba(90,150,255,0.30), 0 60px 120px rgba(0,0,0,0.7)`,
              position: "relative",
            }}
          >
            {/* side buttons */}
            <div style={{position: "absolute", right: -6, top: 260, width: 6, height: 120, borderRadius: 3, background: "#2a2f3a"}} />
            <div style={{position: "absolute", left: -6, top: 220, width: 6, height: 70, borderRadius: 3, background: "#2a2f3a"}} />
            <div style={{position: "absolute", left: -6, top: 310, width: 6, height: 70, borderRadius: 3, background: "#2a2f3a"}} />
            {/* screen */}
            <div style={{position: "relative", width: 600, height: 1240, borderRadius: 78, overflow: "hidden", background: "#05080d"}}>
              <div style={{position: "absolute", inset: 0, transformOrigin: "300px 230px", transform: `scale(${zs})`, filter: `brightness(${0.96 + 0.06 * noise(f * 0.9)})`}}>
                <ScreenFor f={f} />
              </div>
              {/* punch-hole camera */}
              <div style={{position: "absolute", left: 300 - 11, top: 18, width: 22, height: 22, borderRadius: "50%", background: "#000", boxShadow: "0 0 0 3px #0d1118"}} />
              {/* glass reflection */}
              <div style={{position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0) 100%)", pointerEvents: "none"}} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
