import { StickCharacterId, StickDesign } from "./types";

export const STICK_DESIGNS: Record<StickCharacterId, StickDesign> = {
  red: {
    id: "red",
    name: "Red",
    role: "The Martial Artist & Beast Tamer",
    color: "#E52521",
    lightColor: "#FF5A57",
    shadowColor: "#9E100E",
    isHollowHead: false,
    personality: "Passionate, energetic, combat specialist",
    defaultExpression: "angry",
  },
  yellow: {
    id: "yellow",
    name: "Yellow",
    role: "The Tech & Redstone Engineer",
    color: "#F6BC14",
    lightColor: "#FFE066",
    shadowColor: "#B58404",
    isHollowHead: false,
    personality: "Intelligent, creative, curious, staff wielder",
    defaultExpression: "curious",
  },
  orange: {
    id: "orange",
    name: "The Second Coming (Orange)",
    role: "The Chosen One & Creative Leader",
    color: "#FF6E1A",
    lightColor: "#FFA463",
    shadowColor: "#BA4302",
    isHollowHead: true, // Signature hollow ring head
    personality: "Heroic, confident, awaken power",
    defaultExpression: "determined",
  },
  green: {
    id: "green",
    name: "Green",
    role: "The Musician & Dynamic Dancer",
    color: "#4CD918",
    lightColor: "#84F35C",
    shadowColor: "#2B8709",
    isHollowHead: false,
    hasHeadphones: true, // Signature black over-ear DJ headphones
    personality: "Musical, rhythmic, joyful, stylish",
    defaultExpression: "happy",
  },
  blue: {
    id: "blue",
    name: "Blue",
    role: "The Netherwart Brewer & Speedster",
    color: "#1BB7F5",
    lightColor: "#6DE0FF",
    shadowColor: "#0873A6",
    isHollowHead: false,
    personality: "Sassy, agile, fast, confident",
    defaultExpression: "smug",
  },
};

export const STICK_CHARACTER_IDS: StickCharacterId[] = [
  "red",
  "yellow",
  "orange",
  "green",
  "blue",
];

