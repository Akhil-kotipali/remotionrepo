import { CharacterDesign, CharacterId } from "./types";

export const DESIGNS: Record<CharacterId, CharacterDesign> = {
  arjun: {
    id: "arjun", name: "Arjun",
    skin: "#B97855", skinLight: "#D59A73", skinShadow: "#754631",
    hair: "#17191D", hairHighlight: "#34363B",
    shirt: "#202329", jacket: "#59664D", jacketLight: "#778568",
    pants: "#252B35", shoes: "#11151A", accent: "#A8B18F",
    build: "slim", height: 1, hairStyle: "wavy", accessory: "phone",
  },
  dev: {
    id: "dev", name: "Dev",
    skin: "#C78C69", skinLight: "#E0AD87", skinShadow: "#85563F",
    hair: "#211A18", hairHighlight: "#49342D",
    shirt: "#E0D4BE", jacket: "#334A68", jacketLight: "#526D91",
    pants: "#39404C", shoes: "#171C25", accent: "#D8C6A5",
    build: "average", height: 1, hairStyle: "curly",
  },
  rahul: {
    id: "rahul", name: "Rahul",
    skin: "#A96D4D", skinLight: "#C98963", skinShadow: "#70432F",
    hair: "#17191C", hairHighlight: "#34373A",
    shirt: "#282B31", jacket: "#87513E", jacketLight: "#A66A53",
    pants: "#252932", shoes: "#14171B", accent: "#C58B70",
    build: "broad", height: 1, hairStyle: "short",
  },
  meera: {
    id: "meera", name: "Meera",
    skin: "#C68B6A", skinLight: "#E0A887", skinShadow: "#85533F",
    hair: "#17151A", hairHighlight: "#39313B",
    shirt: "#29232B", jacket: "#713E52", jacketLight: "#995B70",
    pants: "#292832", shoes: "#17151B", accent: "#D3A3B0",
    build: "slim", height: 1, hairStyle: "longBraid", accessory: "camera",
  },
  kabir: {
    id: "kabir", name: "Kabir",
    skin: "#B77B5B", skinLight: "#D49A76", skinShadow: "#7A4D38",
    hair: "#17191E", hairHighlight: "#353A43",
    shirt: "#252A31", jacket: "#376C70", jacketLight: "#559092",
    pants: "#252B35", shoes: "#15191E", accent: "#A3D0C8",
    build: "slim", height: 1.06, hairStyle: "textured", accessory: "glasses",
  },
  nisha: {
    id: "nisha", name: "Nisha",
    skin: "#C58A68", skinLight: "#E0A786", skinShadow: "#89563F",
    hair: "#171519", hairHighlight: "#39323A",
    shirt: "#352B20", jacket: "#B18A3D", jacketLight: "#D0AD61",
    pants: "#30303A", shoes: "#1A1818", accent: "#E5C77B",
    build: "average", height: 0.98, hairStyle: "bob",
  },
  reflection: {
    id: "reflection", name: "The Reflection",
    skin: "#949DA8", skinLight: "#B8C2CC", skinShadow: "#4E5865",
    hair: "#0B0D11", hairHighlight: "#1F2937",
    shirt: "#111827", jacket: "#1E293B", jacketLight: "#334155",
    pants: "#0F172A", shoes: "#030712", accent: "#38BDF8",
    build: "slim", height: 1, hairStyle: "wavy",
  },
};

export const CHARACTER_IDS: CharacterId[] = [
  "arjun", "dev", "rahul", "meera", "kabir", "nisha",
];
