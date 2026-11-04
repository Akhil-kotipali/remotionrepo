import React from "react";
import {Img, staticFile} from "remotion";
import {FriendStickFigure} from "./stick/FriendStickFigure";
import {FriendId} from "./stick/friendDesigns";

/** the photograph (same crop & cast as Parts 1-2), scaled to ~300x330 */
const S = 300 / 960;
const CAST: {id: FriendId; x: number; facing: "left" | "right"}[] = [
  {id: "rahul", x: 160, facing: "right"},
  {id: "nisha", x: 320, facing: "right"},
  {id: "arjun", x: 480, facing: "right"},
  {id: "dev", x: 640, facing: "left"},
  {id: "kabir", x: 800, facing: "left"},
];
export const PhotoCard: React.FC<{f: number}> = () => (
  <div style={{position: "relative", width: 300, height: 330, borderRadius: 8, overflow: "hidden", boxShadow: "0 0 0 5px #d9d4c7", filter: "sepia(0.2) saturate(0.85)"}}>
    <Img src={staticFile("backgrounds/exterior.jpg")} style={{position: "absolute", left: 0, top: -760 * (960 / 1536) * S, width: 960 * S, height: 2752 * (960 / 1536) * S}} />
    <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)"}} />
    {CAST.map((c) => {
      const H = 360 * S;
      const top = (1030 - 416 * (360 / 440)) * S;
      return (
        <div key={c.id} style={{position: "absolute", left: c.x * S - (240 * H) / 440 / 2, top, width: (240 * H) / 440, height: H, filter: "brightness(0.8)"}}>
          <FriendStickFigure friend={c.id} facing={c.facing} width={(240 * H) / 440} height={H} glow={false} animate={false} />
        </div>
      );
    })}
  </div>
);
