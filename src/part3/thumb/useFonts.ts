import {useEffect, useState} from "react";
import {continueRender, delayRender, staticFile} from "remotion";

export const TMONT = "ThumbMont";
export const TMONO = "ThumbMono";

export function useThumbFonts() {
  const [h] = useState(() => delayRender("thumb fonts"));
  useEffect(() => {
    const a = new FontFace(TMONT, `url(${staticFile("fonts/mont900.woff2")})`, {weight: "900"});
    const b = new FontFace(TMONO, `url(${staticFile("fonts/mono700.woff2")})`, {weight: "700"});
    Promise.all([a.load(), b.load()]).then(([x, y]) => {
      (document.fonts as any).add(x);
      (document.fonts as any).add(y);
      continueRender(h);
    });
  }, [h]);
}
