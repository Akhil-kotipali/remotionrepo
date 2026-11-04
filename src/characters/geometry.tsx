import { CharacterDesign, Emotion, Gaze, View } from "./types";

export const defs = (
  <defs>
    <linearGradient id="skinShade" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity=".16" />
      <stop offset=".48" stopColor="#FFFFFF" stopOpacity="0" />
      <stop offset="1" stopColor="#000000" stopOpacity=".18" />
    </linearGradient>
    <linearGradient id="fabricShade" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity=".16" />
      <stop offset=".45" stopColor="#FFFFFF" stopOpacity=".02" />
      <stop offset="1" stopColor="#000000" stopOpacity=".22" />
    </linearGradient>
    <linearGradient id="hairShade" x1="0" y1="0" x2="0.8" y2="1">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity=".12" />
      <stop offset=".55" stopColor="#FFFFFF" stopOpacity="0" />
      <stop offset="1" stopColor="#000000" stopOpacity=".35" />
    </linearGradient>
    <filter id="softShadow" x="-40%" y="-30%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="3" />
    </filter>
  </defs>
);

export function Body({
  d, view,
}: { d: CharacterDesign; view: View }) {
  const broad = d.build === "broad";
  const slim = d.build === "slim";
  const torsoLeft = broad ? 76 : slim ? 85 : 81;
  const torsoRight = broad ? 164 : slim ? 155 : 159;
  const neckX = view === "side" ? 112 : 108;

  return (
    <g>
      {/* neck and subtle collar shadow */}
      <path d={`M${neckX} 132 L${neckX+27} 132 L${neckX+27} 177 Q${neckX+13} 188 ${neckX} 177 Z`}
        fill={d.skinShadow} />
      <path d={`M${neckX+3} 132 L${neckX+24} 132 L${neckX+22} 170 Q${neckX+13} 177 ${neckX+4} 169 Z`}
        fill={d.skin} />
      {/* shirt silhouette */}
      <path d={`M${torsoLeft+15} 158 Q120 143 ${torsoRight-15} 158
        L${torsoRight+1} 280 Q120 299 ${torsoLeft-1} 280 Z`}
        fill={d.shirt} />
      {/* jacket panels */}
      <path d={`M${torsoLeft+15} 158 Q${torsoLeft} 160 ${torsoLeft-7} 180
        L${torsoLeft-16} 271 Q${torsoLeft-6} 286 ${torsoLeft+14} 282
        L111 184 Z`} fill={d.jacket} />
      <path d={`M${torsoRight-15} 158 Q${torsoRight} 160 ${torsoRight+7} 180
        L${torsoRight+16} 271 Q${torsoRight+6} 286 ${torsoRight-14} 282
        L129 184 Z`} fill={d.jacket} />
      <path d={`M111 159 L120 181 L129 159 L134 280 Q120 286 106 280 Z`}
        fill={d.jacketLight} opacity=".28" />
      <path d="M120 181 L120 278" stroke="#17191D" strokeOpacity=".35" strokeWidth="2" />
      <path d={`M${torsoLeft+15} 160 L120 181 L${torsoRight-15} 160`}
        fill="none" stroke={d.accent} strokeOpacity=".58" strokeWidth="2.4" />
      {/* fabric highlights */}
      <path d={`M${torsoLeft+3} 190 Q${torsoLeft+7} 225 ${torsoLeft+1} 260`}
        fill="none" stroke="#FFFFFF" strokeOpacity=".10" strokeWidth="3" />
      <path d={`M${torsoRight-3} 190 Q${torsoRight-7} 225 ${torsoRight-1} 260`}
        fill="none" stroke="#000000" strokeOpacity=".13" strokeWidth="4" />
      <path d={`M${torsoLeft-12} 270 Q120 293 ${torsoRight+12} 270`}
        fill="none" stroke="#000000" strokeOpacity=".20" strokeWidth="3" />
      {/* zipper / seam */}
      <path d="M120 185 L120 271" stroke={d.accent} strokeOpacity=".45" strokeWidth="1" />
      <circle cx="120" cy="207" r="2" fill={d.accent} opacity=".65" />
      <circle cx="120" cy="232" r="2" fill={d.accent} opacity=".65" />
      {/* character-specific collar */}
      {d.id === "dev" && <path d="M109 158 L120 179 L131 158" fill="none" stroke="#E8DDC9" strokeWidth="5" />}
      {d.id === "arjun" && <path d="M108 160 L120 178 L132 160" fill="none" stroke="#25282D" strokeWidth="5" />}
      {d.id === "meera" && <path d="M108 161 L120 178 L132 161" fill="none" stroke={d.accent} strokeWidth="3" />}
      {d.id === "nisha" && <path d="M108 161 L120 178 L132 161" fill="none" stroke={d.accent} strokeWidth="3" />}
      <path d={`M${torsoLeft+5} 174 L${torsoLeft+13} 179`}
        stroke="#FFFFFF" strokeOpacity=".18" strokeWidth="2" />
    </g>
  );
}

export function Head({
  d, emotion, gaze, view, blink = false,
}: {
  d: CharacterDesign; emotion: Emotion; gaze: Gaze; view: View; blink?: boolean;
}) {
  const side = view === "side";
  const three = view === "threeQuarter";
  const facePath = side
    ? "M91 75 Q91 42 121 42 Q151 44 151 83 L145 116 Q137 145 116 148 Q96 139 92 111 Z"
    : "M78 79 Q78 43 120 40 Q162 43 162 79 L155 116 Q147 145 120 150 Q93 145 85 116 Z";

  const eyeY = emotion === "scared" ? 91 : 94;
  const eyeOffset = three ? 2 : 0;
  const leftEyeX = side ? 132 : 102 + eyeOffset;
  const rightEyeX = side ? 145 : 139 + eyeOffset;
  const pupilShift = gaze === "left" ? -3 : gaze === "right" ? 3 : gaze === "up" ? -2 : gaze === "down" ? 2 : 0;
  const brows: Record<Emotion, string> = {
    neutral: "M92 81 Q102 77 111 81 M130 81 Q140 77 149 81",
    worried: "M93 78 Q103 70 112 80 M130 80 Q140 70 149 78",
    angry: "M93 84 L112 77 M130 77 L149 84",
    sad: "M93 77 Q103 85 112 82 M130 82 Q140 85 149 77",
    scared: "M93 74 Q103 66 112 74 M130 74 Q140 66 149 74",
    relieved: "M93 82 Q103 78 112 82 M130 82 Q140 78 149 82",
    happy: "M93 82 Q103 76 112 82 M130 82 Q140 76 149 82",
  };
  const mouth: Record<Emotion, string> = {
    neutral: "M111 120 Q120 123 130 120",
    worried: "M111 125 Q120 114 130 125",
    angry: "M112 122 L129 122",
    sad: "M111 126 Q120 116 130 126",
    scared: "M116 118 Q120 132 125 118",
    relieved: "M111 119 Q120 124 130 119",
    happy: "M108 117 Q120 135 133 117",
  };

  return (
    <g>
      {/* ears */}
      {!side && <><ellipse cx="80" cy="101" rx="8" ry="13" fill={d.skinShadow} /><ellipse cx="160" cy="101" rx="8" ry="13" fill={d.skinShadow} /></>}
      {/* face */}
      <path d={facePath} fill={d.skin} />
      <path d="M120 45 Q151 48 157 83 L151 116 Q143 139 120 147 Q139 120 137 94 Q137 64 120 45Z"
        fill={d.skinShadow} opacity=".16" />
      <path d="M84 91 Q89 126 107 139" fill="none" stroke={d.skinLight} strokeOpacity=".22" strokeWidth="5" />
      {/* brows */}
      <path d={brows[emotion]} fill="none" stroke={d.hair} strokeWidth="4" strokeLinecap="round" />
      {/* eyes */}
      {blink ? (
        <g stroke={d.skinShadow} strokeWidth="3" strokeLinecap="round">
          <path d={`M${leftEyeX-7} ${eyeY} Q${leftEyeX} ${eyeY+2} ${leftEyeX+7} ${eyeY}`} />
          {!side && <path d={`M${rightEyeX-7} ${eyeY} Q${rightEyeX} ${eyeY+2} ${rightEyeX+7} ${eyeY}`} />}
        </g>
      ) : (
        <g>
          <ellipse cx={leftEyeX} cy={eyeY} rx={side ? 3.4 : 7} ry={emotion === "scared" ? 7 : 5.2} fill="#F1E9DE" />
          <ellipse cx={leftEyeX+pupilShift} cy={eyeY+1} rx="3" ry="4" fill="#211C1A" />
          {!side && <>
            <ellipse cx={rightEyeX} cy={eyeY} rx="7" ry={emotion === "scared" ? 7 : 5.2} fill="#F1E9DE" />
            <ellipse cx={rightEyeX+pupilShift} cy={eyeY+1} rx="3" ry="4" fill="#211C1A" />
          </>}
          <circle cx={leftEyeX+pupilShift-1} cy={eyeY-1} r="1.3" fill="#FFFFFF" />
          {!side && <circle cx={rightEyeX+pupilShift-1} cy={eyeY-1} r="1.3" fill="#FFFFFF" />}
        </g>
      )}
      {/* nose and mouth */}
      <path d={side ? "M140 98 L151 109 L140 112" : "M120 98 L116 111 L123 113"}
        fill="none" stroke={d.skinShadow} strokeWidth="2.2" strokeLinecap="round" />
      <path d={mouth[emotion]} fill="none" stroke="#713F3A" strokeWidth="3" strokeLinecap="round" />
      {/* cheek light */}
      <ellipse cx={side ? 126 : 96} cy="109" rx="9" ry="4" fill={d.skinLight} opacity=".12" />
      {/* jaw highlight */}
      <path d="M102 132 Q120 145 139 132" fill="none" stroke={d.skinLight} strokeOpacity=".25" strokeWidth="2" />
      {/* glasses */}
      {d.accessory === "glasses" && (
        <g fill="none" stroke="#17191D" strokeWidth="3">
          <rect x="91" y="85" width="24" height="18" rx="4" />
          <rect x="127" y="85" width="24" height="18" rx="4" />
          <path d="M115 92 L127 92" />
          <path d="M91 91 L84 88 M151 91 L158 88" />
        </g>
      )}
      {/* subtle freckles / beauty mark */}
      {d.id === "nisha" && <circle cx="145" cy="112" r="1.5" fill={d.skinShadow} opacity=".6" />}
      <path d="M91 119 Q99 137 115 141" fill="none" stroke="#FFFFFF" strokeOpacity=".10" strokeWidth="2" />
    </g>
  );
}

export function Hair({
  d, view,
}: { d: CharacterDesign; view: View }) {
  const c = d.hair;
  const h = d.hairHighlight;
  const side = view === "side";
  const base = side
    ? "M91 89 Q85 45 119 34 Q151 30 158 65 L151 88 Q132 64 106 77 Z"
    : "M76 87 Q69 44 105 34 Q139 24 163 51 Q174 69 163 94 L154 82 Q133 62 108 70 Q93 69 82 91 Z";

  return (
    <g>
      <path d={base} fill={c} />
      {d.hairStyle === "wavy" && <>
        <path d="M79 68 Q93 43 110 57 Q124 35 140 55 Q154 43 166 67"
          fill="none" stroke={h} strokeWidth="8" strokeLinecap="round" />
        <path d="M91 51 Q111 33 127 47" fill="none" stroke="#FFFFFF" strokeOpacity=".10" strokeWidth="3" />
        <path d="M76 81 Q73 103 82 116" fill="none" stroke={c} strokeWidth="12" />
      </>}
      {d.hairStyle === "curly" && <>
        {[86, 103, 121, 140, 157].map((x, i) =>
          <circle key={x} cx={x} cy={43 + (i % 2) * 5} r="13" fill={c} />
        )}
        {[95, 117, 143].map((x) =>
          <path key={x} d={`M${x-5} 40 q5 -8 10 0`} fill="none" stroke={h} strokeWidth="3" strokeLinecap="round" />
        )}
      </>}
      {d.hairStyle === "short" && <>
        <path d="M79 70 Q94 39 119 39 Q145 37 162 62" fill="none" stroke={h} strokeWidth="5" opacity=".45" />
        <path d="M78 81 L82 108" stroke={c} strokeWidth="10" />
      </>}
      {d.hairStyle === "longBraid" && <>
        <path d="M79 72 Q100 26 137 37 Q166 42 169 74 L160 126 L148 97 Q127 60 91 84 Z" fill={c} />
        <path d="M161 85 Q178 115 164 150 Q156 165 164 184" fill="none" stroke={c} strokeWidth="13" strokeLinecap="round" />
        <path d="M160 106 L169 116 L157 127 L168 138 L158 150 L165 161"
          fill="none" stroke={h} strokeWidth="3" strokeOpacity=".55" />
        <path d="M88 56 Q113 28 143 48" fill="none" stroke={h} strokeWidth="4" strokeOpacity=".4" />
      </>}
      {d.hairStyle === "textured" && <>
        {[91, 107, 125, 144, 158].map((x, i) =>
          <path key={x} d={`M${x} 48 q${i%2 ? 8 : -7} -12 13 -8`} fill="none" stroke={h} strokeWidth="5" strokeLinecap="round" />
        )}
      </>}
      {d.hairStyle === "bob" && <>
        <path d="M77 77 Q70 36 111 31 Q157 29 168 72 L166 139 Q151 129 150 99 Q122 81 93 101 L80 136 Z" fill={c} />
        <path d="M84 57 Q112 27 145 43" fill="none" stroke={h} strokeWidth="4" strokeOpacity=".4" />
      </>}
      <path d="M82 79 Q91 47 119 43" fill="none" stroke="url(#hairShade)" strokeWidth="8" opacity=".7" />
    </g>
  );
}

export function Legs({
  d, leftAngle = 0, rightAngle = 0,
}: { d: CharacterDesign; leftAngle?: number; rightAngle?: number }) {
  const broad = d.build === "broad";
  const legW = broad ? 23 : 19;
  return (
    <g>
      <ellipse cx="120" cy="405" rx="53" ry="8" fill="#000000" opacity=".28" filter="url(#softShadow)" />
      <g transform={`translate(101 278) rotate(${leftAngle} 0 0)`}>
        <path d={`M-${legW/2} 0 L-${legW/2-1} 76 L-${legW/2-3} 119 L${legW/2+4} 119 L${legW/2+5} 78 L${legW/2} 0 Z`}
          fill={d.pants} />
        <path d={`M-${legW/2+1} 112 Q0 106 ${legW/2+6} 114 L${legW/2+13} 125 L-${legW/2+5} 125 Z`}
          fill={d.shoes} />
        <path d={`M-${legW/2+1} 17 L-${legW/2+1} 75`} stroke="#FFFFFF" strokeOpacity=".10" strokeWidth="2" />
      </g>
      <g transform={`translate(139 278) rotate(${rightAngle} 0 0)`}>
        <path d={`M-${legW/2} 0 L-${legW/2-1} 76 L-${legW/2-3} 119 L${legW/2+4} 119 L${legW/2+5} 78 L${legW/2} 0 Z`}
          fill={d.pants} />
        <path d={`M-${legW/2+1} 112 Q0 106 ${legW/2+6} 114 L${legW/2+13} 125 L-${legW/2+5} 125 Z`}
          fill={d.shoes} />
        <path d={`M${legW/2-2} 17 L${legW/2-2} 75`} stroke="#000000" strokeOpacity=".12" strokeWidth="2" />
      </g>
    </g>
  );
}

export function Arm({
  d, side, angle = 0, pose = "idle",
}: {
  d: CharacterDesign; side: "left" | "right"; angle?: number; elbow?: number; pose?: "idle" | "phone" | "camera" | "cross";
}) {
  const isLeft = side === "left";
  const isRight = side === "right";
  const shoulderX = isLeft ? 78 : 162;
  const shoulderY = 176;
  const armColor = d.jacket;
  const skin = d.skin;
  const handX = isLeft ? -1 : 1;

  if (pose === "cross") {
    return (
      <g transform={`translate(${shoulderX} ${shoulderY}) rotate(${isLeft ? -42 : 42}) ${isRight ? "scale(-1 1)" : ""}`}>
        <path d="M0 0 Q-8 29 13 55 L49 69 L59 54 L24 34 L18 0 Z"
          fill={armColor} />
        <path d="M49 55 L66 49 L73 59 L56 73 Z" fill={skin} />
      </g>
    );
  }

  if (pose === "phone" && isRight) {
    return (
      <g transform={`translate(${shoulderX} ${shoulderY}) rotate(12)`}>
        <path d="M0 0 Q-15 25 -22 52 L-32 75 L-48 68 L-35 35 L-16 -2 Z" fill={armColor} />
        <path d="M-28 68 Q-38 60 -46 68 L-48 82 Q-38 90 -28 82 Z" fill={skin} />
        <g transform="translate(-40 56) rotate(15)">
          <rect x="-11" y="-28" width="22" height="40" rx="4" fill="#11161C" stroke="#89929A" strokeWidth="2" />
          <rect x="-8" y="-24" width="16" height="31" rx="2" fill="#293541" />
          <path d="M-6 -20 L7 6" stroke="#CBD0D4" strokeWidth="1.5" opacity=".85" />
          <circle cx="0" cy="9" r="1.3" fill="#AAB1B8" />
        </g>
      </g>
    );
  }

  if (pose === "camera" && isRight) {
    return (
      <g transform={`translate(${shoulderX} ${shoulderY}) rotate(8)`}>
        <path d="M0 0 Q-12 24 -18 50 L-26 68 L-42 62 L-30 32 L-14 -2 Z" fill={armColor} />
        <path d="M-22 62 Q-30 56 -38 63 L-40 75 Q-31 82 -22 75 Z" fill={skin} />
      </g>
    );
  }

  return (
    <g transform={`translate(${shoulderX} ${shoulderY}) rotate(${angle})`}>
      <path
        d={`M0 0 Q${handX * 2} 30 ${handX * 3} 57 L${handX * 7} 83 L${handX * 22} 82 L${handX * 19} 52 L${handX * 15} 0 Z`}
        fill={armColor}
      />
      <path d={`M${handX*7} 77 Q${handX*19} 72 ${handX*23} 84 L${handX*20} 99 Q${handX*9} 105 ${handX*3} 94 Z`}
        fill={skin} />
      <path d={`M${handX*12} 80 L${handX*13} 92`} stroke={d.skinShadow} strokeWidth="1.5" opacity=".5" />
    </g>
  );
}
