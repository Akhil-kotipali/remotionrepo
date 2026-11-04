import React from "react";
import {Img, staticFile} from "remotion";
import {FRIEND_DESIGNS} from "../stick/friendDesigns";
import {INTER, MONO} from "../fonts";
import {MSG1, MSG2} from "../config";
import {E, clamp, kf, pulse} from "../math";
import {Avatar, Bubble, ChatHeader, DateChip, GlitchText, InputBar, StatusBar, TypingDots, scramble, typed} from "./bits";

const SCREEN_BG = "linear-gradient(180deg,#0b1017 0%,#0a0e15 100%)";
const Scan: React.FC<{o?: number}> = ({o = 0.08}) => (
  <div style={{position: "absolute", inset: 0, pointerEvents: "none", background: `repeating-linear-gradient(to bottom, rgba(255,255,255,${o}) 0px, rgba(255,255,255,${o}) 1px, transparent 2px, transparent 4px)`, mixBlendMode: "overlay"}} />
);

/* ------------------------------------------------------------------ COLD OPEN (0-162) */
export const ColdScreen: React.FC<{f: number}> = ({f}) => {
  const reveal = 0.08 + 0.26 * Math.abs(Math.sin(f * 0.09) * Math.sin(f * 0.23 + 1));
  const g = clamp(Math.abs(Math.sin(f * 0.7)) * (f % 37 < 5 ? 1 : 0.15), 0, 1);
  return (
    <div style={{position: "absolute", inset: 0, background: SCREEN_BG}}>
      <StatusBar f={f} />
      <ChatHeader sub={f % 50 < 38 ? "last seen 1 year ago" : "typing…"} subColor="#ff5a5f" avatarGlitch={g} />
      <DateChip text="1 YEAR AGO" color="#ff5a5f" g={g} />
      <div style={{padding: "10px 34px"}}>
        <Bubble time="2:17 AM" accent="rgba(255,60,80,0.55)">
          <GlitchText g={g}>{scramble(MSG1.text, f, reveal, "cold")}</GlitchText>
        </Bubble>
        <div style={{marginTop: 22, opacity: f > 24 ? 1 : 0}}>
          <TypingDots f={f} />
        </div>
      </div>
      <InputBar />
      <Scan o={0.1} />
    </div>
  );
};

/* ------------------------------------------------------------------ RESTORE (252-333) */
export const RestoreScreen: React.FC<{f: number}> = ({f}) => {
  const p = kf(f, [[266, 0], [318, 1, E.soft]]);
  const items = Math.floor(p * 14203);
  const stage = p < 0.12 ? "Verifying backup…" : p < 0.7 ? "Restoring messages…" : p < 0.97 ? "Restoring media…" : "Finishing up…";
  const done = f >= 318;
  const circ = 2 * Math.PI * 118;
  return (
    <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 42%, #112038 0%, #080c13 70%)"}}>
      <StatusBar f={f} />
      <div style={{textAlign: "center", marginTop: 150, fontFamily: INTER, color: "#9fb0c8", fontSize: 26, letterSpacing: 3, fontWeight: 600}}>RESTORING FROM BACKUP</div>
      <div style={{position: "relative", width: 300, height: 300, margin: "70px auto 0"}}>
        <svg width="300" height="300" viewBox="0 0 300 300">
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#58a6ff" />
              <stop offset="1" stopColor="#6ef3ff" />
            </linearGradient>
          </defs>
          {Array.from({length: 60}, (_, i) => (
            <line key={i} x1="150" y1="6" x2="150" y2={i % 5 === 0 ? 20 : 14} stroke="#2a3a55" strokeWidth="2.4" transform={`rotate(${i * 6} 150 150)`} />
          ))}
          <circle cx="150" cy="150" r="118" fill="none" stroke="#16233a" strokeWidth="14" />
          <circle cx="150" cy="150" r="118" fill="none" stroke="url(#ring)" strokeWidth="14" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - p)} transform="rotate(-90 150 150)" style={{filter: "drop-shadow(0 0 10px #58a6ff)"}} />
          {!done && <circle cx="150" cy="32" r="5" fill="#bfe6ff" transform={`rotate(${f * 9} 150 150)`} />}
        </svg>
        <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 700, fontSize: 70, color: "#eaf4ff"}}>
          {done ? (
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="#6ef3a8" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" style={{filter: "drop-shadow(0 0 12px #6ef3a8)"}}>
              <path d="M22 50 L42 70 L76 28" strokeDasharray="110" strokeDashoffset={110 * (1 - kf(f, [[318, 0], [330, 1]]))} />
            </svg>
          ) : (
            `${Math.floor(p * 100)}%`
          )}
        </div>
      </div>
      <div style={{textAlign: "center", marginTop: 56, fontFamily: INTER, fontSize: 28, color: done ? "#6ef3a8" : "#cfd9e8", fontWeight: 600}}>{done ? "Restore complete" : stage}</div>
      <div style={{textAlign: "center", marginTop: 14, fontFamily: MONO, fontSize: 22, color: "#6f7f98"}}>{items.toLocaleString("en-US")} / 14,203 items</div>
      <div style={{position: "absolute", left: 60, right: 60, bottom: 130, fontFamily: INTER, fontSize: 21, color: "#ff8a8f", textAlign: "center", opacity: 0.6 + 0.4 * Math.sin(f * 0.2)}}>Battery low · keep your phone plugged in</div>
      <Scan />
    </div>
  );
};

/* ------------------------------------------------------------------ CHAT LIST (318-378) */
export const ListScreen: React.FC<{f: number}> = ({f}) => {
  const rows: {id: "rahul" | "meera" | "kabir" | "nisha"; msg: string}[] = [
    {id: "rahul", msg: "lol okay"},
    {id: "meera", msg: "Photo"},
    {id: "kabir", msg: "see you there"},
    {id: "nisha", msg: "…"},
  ];
  const devIn = kf(f, [[338, 0], [352, 1, E.back]]);
  const banner = kf(f, [[326, -150], [338, 0, E.out], [366, 0], [376, -150, E.in]]);
  const tap = pulse(f, 372, 10);
  return (
    <div style={{position: "absolute", inset: 0, background: SCREEN_BG}}>
      <StatusBar f={f} />
      <div style={{padding: "24px 36px 12px", fontFamily: INTER, fontSize: 44, fontWeight: 700, color: "#f1f5fb"}}>Chats</div>
      <div style={{padding: "0 20px"}}>
        <div style={{height: 120, display: "flex", alignItems: "center", gap: 20, padding: "0 18px", borderRadius: 24, transform: `translateX(${(1 - devIn) * 520}px)`, opacity: devIn, background: "linear-gradient(90deg, rgba(255,70,90,0.18), rgba(255,70,90,0.04))", border: `1px solid rgba(255,90,100,${0.4 + 0.3 * Math.sin(f * 0.3)})`, boxShadow: `0 0 ${30 * tap}px rgba(255,255,255,${0.5 * tap})`}}>
          <Avatar friend="dev" size={80} />
          <div style={{flex: 1}}>
            <div style={{fontFamily: INTER, fontSize: 32, fontWeight: 700, color: "#fff"}}>Dev</div>
            <div style={{fontFamily: INTER, fontSize: 24, color: "#ff9aa2"}}>{scramble("You said you wouldn't", f, 0.0, "list")}</div>
          </div>
          <div style={{textAlign: "right"}}>
            <div style={{fontFamily: MONO, fontSize: 18, color: "#ff9aa2"}}>2:17 AM</div>
            <div style={{marginTop: 8, display: "inline-flex", minWidth: 34, height: 34, borderRadius: 17, background: "#ff3b4e", color: "#fff", fontFamily: INTER, fontWeight: 700, fontSize: 21, alignItems: "center", justifyContent: "center"}}>1</div>
          </div>
        </div>
        {rows.map((r, i) => {
          const o = kf(f, [[300 + i * 6, 0], [318 + i * 6, 1]]);
          const dd = FRIEND_DESIGNS[r.id];
          return (
            <div key={r.id} style={{height: 112, display: "flex", alignItems: "center", gap: 20, padding: "0 18px", opacity: o * 0.55, transform: `translateY(${(1 - o) * 20}px)`}}>
              <div style={{width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${dd.lightColor}, ${dd.shadowColor})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 700, fontSize: 34, color: "#fff"}}>{dd.name[0]}</div>
              <div style={{flex: 1}}>
                <div style={{fontFamily: INTER, fontSize: 30, fontWeight: 600, color: "#dbe4f1"}}>{dd.name}</div>
                <div style={{fontFamily: INTER, fontSize: 23, color: "#6d7a90"}}>{r.msg}</div>
              </div>
              <div style={{fontFamily: MONO, fontSize: 17, color: "#566073"}}>1 yr</div>
            </div>
          );
        })}
      </div>
      {/* notification banner */}
      <div style={{position: "absolute", left: 22, right: 22, top: 14, transform: `translateY(${banner}px)`, height: 104, borderRadius: 28, background: "rgba(30,38,54,0.96)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 16px 40px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: 18, padding: "0 22px"}}>
        <Avatar friend="dev" size={64} />
        <div>
          <div style={{fontFamily: INTER, fontSize: 28, fontWeight: 700, color: "#fff"}}>Dev</div>
          <div style={{fontFamily: INTER, fontSize: 22, color: "#a9b7cc"}}>1 new message · now</div>
        </div>
      </div>
      <Scan />
    </div>
  );
};

/* ------------------------------------------------------------------ CONTACT CARD (378-462) */
export const ContactScreen: React.FC<{f: number}> = ({f}) => {
  const named = f >= 408;
  const g = named ? pulse(f, 408, 14) : 0.3 + 0.4 * Math.abs(Math.sin(f * 0.5));
  const name = named ? "DEV" : scramble("UNKNOWN", f, 0.0, "nm");
  const seen = kf(f, [[434, 0], [446, 1]]);
  const ringPulse = (f % 48) / 48;
  return (
    <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 38%, #172544 0%, #070a11 72%)"}}>
      <StatusBar f={f} />
      <div style={{display: "flex", justifyContent: "center", marginTop: 160, position: "relative"}}>
        {[0, 1].map((i) => {
          const t = (ringPulse + i * 0.5) % 1;
          return <div key={i} style={{position: "absolute", top: -20 - t * 90 + 0, width: 300 + t * 180, height: 300 + t * 180, marginTop: 0, borderRadius: "50%", border: `2px solid rgba(255,90,100,${0.45 * (1 - t)})`, left: 300 - (300 + t * 180) / 2, transform: "translateY(20px)"}} />;
        })}
        <div style={{filter: `saturate(${0.4}) ${named ? "" : "blur(3px)"}`, opacity: named ? 1 : 0.55}}>
          <Avatar friend="dev" size={300} ring="rgba(255,255,255,0.14)" glitch={g * 0.6} />
        </div>
      </div>
      <div style={{textAlign: "center", marginTop: 52, fontFamily: INTER, fontWeight: 700, fontSize: 84, letterSpacing: 8, color: "#fff"}}>
        <GlitchText g={g}>{name}</GlitchText>
      </div>
      <div style={{textAlign: "center", marginTop: 20, fontFamily: MONO, fontSize: 25, color: "#ff5a5f", letterSpacing: 2, opacity: seen}}>LAST SEEN · 1 YEAR AGO</div>
      {/* flat-line */}
      <svg width="600" height="120" viewBox="0 0 600 120" style={{position: "absolute", left: 0, bottom: 150, opacity: 0.55 * seen}}>
        <path d={`M0 60 L${220} 60 L${244} 60 L${258} 22 L${276} 98 L${292} 60 L600 60`} stroke="#ff5a5f" strokeWidth="3" fill="none" strokeDasharray="900" strokeDashoffset={900 * (1 - kf(f, [[436, 0], [458, 1]]))} />
      </svg>
      <Scan />
    </div>
  );
};

/* ------------------------------------------------------------------ CHAT (537-711, 801-960, 1128-1314) */
export const ChatScreen: React.FC<{f: number}> = ({f}) => {
  // date chip: TODAY → scramble → 1 YEAR AGO
  let chip = "TODAY";
  let chipColor = "#9fb0c8";
  let chipG = 0;
  if (f >= 1182 && f < 1232) {
    chip = scramble("1 YEAR AGO", f, 0.15 + (f - 1182) / 50, "chip");
    chipColor = "#ffcf6a";
    chipG = 0.8;
  } else if (f >= 1232) {
    chip = "1 YEAR AGO";
    chipColor = "#ff5a5f";
    chipG = pulse(f, 1232, 16);
  }
  const t2 = f >= 1239 ? "2:17 AM" : "2:17 AM";
  const t2c = f >= 1239 ? "#ff5a5f" : "#6f7c92";
  const m1 = typed(MSG1.text, f, MSG1.start, MSG1.cps);
  const m2 = typed(MSG2.text, f, MSG2.start, MSG2.cps);
  const caret = (txt: string, full: string, start: number) => (txt.length < full.length && f >= start ? (f % 16 < 9 ? "▌" : " ") : "");
  const in1 = kf(f, [[MSG1.start - 3, 0], [MSG1.start + 6, 1, E.out]]);
  const in2 = kf(f, [[MSG2.start - 3, 0], [MSG2.start + 6, 1, E.out]]);
  const recovered = kf(f, [[582, 0], [596, 1, E.out]]);
  const dots1 = f >= 803 && f < MSG2.start - 4;
  return (
    <div style={{position: "absolute", inset: 0, background: SCREEN_BG}}>
      <StatusBar f={f} />
      <ChatHeader sub="last seen 1 year ago" subColor={f >= 1232 ? "#ff5a5f" : "#8d99ad"} avatarGlitch={f >= 1232 ? pulse(f, 1232, 10) : 0} />
      <DateChip text={chip} color={chipColor} g={chipG} />
      <div style={{textAlign: "center", opacity: recovered, marginBottom: 10}}>
        <span style={{fontFamily: MONO, fontSize: 18, color: "#6ef3a8", letterSpacing: 2}}>● RECOVERED FROM BACKUP</span>
      </div>
      <div style={{padding: "8px 34px", display: "flex", flexDirection: "column", gap: 22, alignItems: "flex-start"}}>
        {f >= MSG1.start - 3 && (
          <div style={{opacity: in1, transform: `translateY(${(1 - in1) * 18}px) scale(${0.96 + 0.04 * in1})`}}>
            <Bubble time={t2} timeColor={t2c} accent={f >= 703 ? "rgba(255,60,80,0.6)" : undefined}>
              <GlitchText g={f >= 703 ? pulse(f, 703, 14) * 0.9 : 0}>
                {m1}
                {caret(m1, MSG1.text, MSG1.start)}
              </GlitchText>
            </Bubble>
          </div>
        )}
        {dots1 && <TypingDots f={f} />}
        {f >= MSG2.start - 3 && (
          <div style={{opacity: in2, transform: `translateY(${(1 - in2) * 18}px) scale(${0.96 + 0.04 * in2})`}}>
            <Bubble time={t2} timeColor={t2c}>
              {m2}
              {caret(m2, MSG2.text, MSG2.start)}
            </Bubble>
          </div>
        )}
      </div>
      <InputBar />
      <Scan />
    </div>
  );
};

/* ------------------------------------------------------------------ PHOTO DOWNLOAD (1314-1425) */
export const PhotoChatScreen: React.FC<{f: number}> = ({f}) => {
  const p = kf(f, [[1346, 0], [1408, 1, E.soft]]);
  const enter = kf(f, [[1316, 0], [1330, 1, E.out]]);
  const blur = (1 - p) * 14;
  return (
    <div style={{position: "absolute", inset: 0, background: SCREEN_BG}}>
      <StatusBar f={f} />
      <ChatHeader sub="last seen 1 year ago" subColor="#ff5a5f" />
      <DateChip text="1 YEAR AGO" color="#ff5a5f" />
      <div style={{padding: "14px 34px", opacity: enter, transform: `translateY(${(1 - enter) * 30}px)`}}>
        <div style={{width: 500, borderRadius: 28, borderTopLeftRadius: 8, overflow: "hidden", background: "#1a2330", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 10px 40px rgba(0,0,0,0.5)"}}>
          <div style={{position: "relative", width: 500, height: 560, overflow: "hidden"}}>
            <Img src={staticFile("backgrounds/exterior.jpg")} style={{position: "absolute", width: 500 * (1536 / 1536), left: 0, top: -(760 / 2752) * 500 * (2752 / 1536), height: 500 * (2752 / 1536), filter: `blur(${blur}px) saturate(0.75) sepia(0.25) brightness(0.9)`}} />
            {/* reveal scan */}
            <div style={{position: "absolute", left: 0, right: 0, top: p * 560 - 3, height: 3, background: "#7fd0ff", boxShadow: "0 0 18px #7fd0ff", opacity: p > 0 && p < 1 ? 1 : 0}} />
            <div style={{position: "absolute", left: 0, right: 0, top: p * 560, bottom: 0, background: "rgba(10,14,22,0.88)", backdropFilter: "blur(10px)"}} />
            {p < 0.9 && (
              <div style={{position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: MONO, fontSize: 22, color: "#bcd6f5", letterSpacing: 2}}>DOWNLOADING… {Math.floor(p * 100)}%</div>
            )}
          </div>
          <div style={{padding: "10px 22px 12px", display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 17, color: "#6f7c92"}}>
            <span>IMG · 2.4 MB</span>
            <span>2:17 AM</span>
          </div>
        </div>
      </div>
      <InputBar />
      <Scan />
    </div>
  );
};
