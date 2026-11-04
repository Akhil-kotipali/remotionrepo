export type FriendId = "arjun" | "dev" | "rahul" | "meera" | "kabir" | "nisha";

export interface FriendDesign {
  id: FriendId;
  name: string;
  trait: string;
  color: string;
  lightColor: string;
  shadowColor: string;
  hairStyle?: "messy" | "curly" | "long" | "bob";
  hasGlasses?: boolean;
  hasPhone?: boolean;
  hasCamera?: boolean;
  isBroad?: boolean;
  heightScale?: number;
  personality: string;
}

export const FRIEND_DESIGNS: Record<FriendId, FriendDesign> = {
  arjun: {
    id: "arjun",
    name: "Arjun",
    trait: "Olive green, messy hair",
    color: "#5E6F4A",
    lightColor: "#859969",
    shadowColor: "#39452B",
    hairStyle: "messy",
    hasPhone: true,
    personality: "Tech analyst, resourceful, always on call",
  },
  dev: {
    id: "dev",
    name: "Dev",
    trait: "Navy blue, curly hair",
    color: "#2C4A70",
    lightColor: "#4B72A3",
    shadowColor: "#172A42",
    hairStyle: "curly",
    personality: "Storyteller, conversational, expressive mediator",
  },
  rahul: {
    id: "rahul",
    name: "Rahul",
    trait: "Rust orange, broad shoulders",
    color: "#A25332",
    lightColor: "#C97551",
    shadowColor: "#6A311B",
    isBroad: true, // Broad shoulders & heavy athletic build
    personality: "Protective enforcer, loyal, grounded anchor",
  },
  meera: {
    id: "meera",
    name: "Meera",
    trait: "Burgundy, long hair",
    color: "#7D334C",
    lightColor: "#A94F6F",
    shadowColor: "#4B1A2A",
    hairStyle: "long",
    hasCamera: true,
    personality: "Documentarian, observant, keen creative eye",
  },
  kabir: {
    id: "kabir",
    name: "Kabir",
    trait: "Teal, glasses",
    color: "#2D7377",
    lightColor: "#469FA5",
    shadowColor: "#194346",
    hasGlasses: true,
    heightScale: 1.05, // Slightly taller
    personality: "Strategic architect, precision thinker, optics master",
  },
  nisha: {
    id: "nisha",
    name: "Nisha",
    trait: "Mustard yellow, short bob",
    color: "#C29631",
    lightColor: "#E6BA50",
    shadowColor: "#7E5E17",
    hairStyle: "bob",
    personality: "Operations strategist, upbeat, quick-witted coordinator",
  },
};

export const FRIEND_IDS: FriendId[] = [
  "arjun",
  "dev",
  "rahul",
  "meera",
  "kabir",
  "nisha",
];

