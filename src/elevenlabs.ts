import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// Reads ELEVENLABS_API_KEY from environment variables (loaded via .env.local)
export const elevenlabs = new ElevenLabsClient();

