import {loadFont as loadInter} from "@remotion/google-fonts/Inter";
import {loadFont as loadMontserrat} from "@remotion/google-fonts/Montserrat";
import {loadFont as loadMono} from "@remotion/google-fonts/JetBrainsMono";

export const INTER = loadInter("normal", {weights: ["400", "500", "600", "700"], subsets: ["latin"]}).fontFamily;
export const MONT = loadMontserrat("normal", {weights: ["800", "900"], subsets: ["latin"]}).fontFamily;
export const MONO = loadMono("normal", {weights: ["500", "700"], subsets: ["latin"]}).fontFamily;
