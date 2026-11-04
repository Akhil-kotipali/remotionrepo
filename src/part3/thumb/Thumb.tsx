import React from "react";
import {AbsoluteFill, Img, staticFile} from "remotion";
import {KabirScene, MeeraScene, NishaScene, RahulScene, PH, PW} from "../scenes";
import {FriendRig, stancePose} from "../rig/FriendRig";
import {FriendId} from "../stick/friendDesigns";
import {TMONO, TMONT, useThumbFonts} from "./useFonts";

const stroke = {WebkitTextStroke: "14px #000", paintOrder: "stroke fill"} as React.CSSProperties;
const P = [
  {S: RahulScene, t: 44, c: "#E0814F", n: "RAHUL"},
  {S: MeeraScene, t: 44, c: "#C85C86", n: "MEERA"},
  {S: KabirScene, t: 40, c: "#46B5BD", n: "KABIR"},
  {S: NishaScene, t: 84, c: "#EAC24B", n: "NISHA"},
];
const FIG: {id: FriendId; x: number}[] = [{id: "meera", x: 150}, {id: "nisha", x: 340}, {id: "arjun", x: 540}, {id: "rahul", x: 740}, {id: "kabir", x: 930}];

export const Thumb: React.FC = () => {
  useThumbFonts();
  return (
    <AbsoluteFill style={{background: "#04060b", overflow: "hidden"}}>
      <Img src={staticFile("backgrounds/living_room.jpg")} style={{position: "absolute", left: -260, top: -100, width: 1600, height: 2866, filter: "blur(8px) brightness(0.42)"}} />
      <AbsoluteFill style={{background: "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.88) 100%)"}} />
      <div style={{position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", fontFamily: TMONT, fontWeight: 900, lineHeight: 0.98}}>
        <div style={{fontSize: 112, color: "#fff", ...stroke}}>4 FRIENDS.</div>
        <div style={{fontSize: 126, color: "#ff3b4e", ...stroke}}>4 DIFFERENT</div>
        <div style={{fontSize: 126, color: "#fff", ...stroke}}>MEMORIES</div>
      </div>
      {P.map((p, i) => (
        <div key={p.n} style={{position: "absolute", left: 75 + (i % 2) * 480, top: 520 + Math.floor(i / 2) * 390, width: PW * 0.5, height: PH * 0.5, transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)`, overflow: "hidden", borderRadius: 20, boxShadow: `0 0 0 6px ${p.c}, 0 0 50px 6px ${p.c}99`, background: "#000"}}>
          <div style={{width: PW, height: PH, transformOrigin: "0 0", transform: "scale(0.5)", position: "relative", overflow: "hidden"}}>
            <p.S t={p.t} />
          </div>
        </div>
      ))}
      <div style={{position: "absolute", left: 0, right: 0, top: 1290, height: 560}}>
        {FIG.map((g) => (
          <div key={g.id} style={{position: "absolute", left: g.x - 122, top: g.id === "arjun" ? 20 : 70, filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.6))"}}>
            <FriendRig id={g.id} pose={stancePose(g.id)} width={g.id === "arjun" ? 250 : 220} height={g.id === "arjun" ? 480 : 420} jacket={g.id === "arjun"} />
          </div>
        ))}
      </div>
      <div style={{position: "absolute", right: 40, top: 28, fontFamily: TMONO, fontWeight: 700, fontSize: 38, letterSpacing: 5, color: "#fff", background: "rgba(0,0,0,0.7)", border: "3px solid #8fb4ff", padding: "8px 22px", borderRadius: 8}}>PART 3 / 6</div>
    </AbsoluteFill>
  );
};
