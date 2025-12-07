import { DetailLevel, Medium, Mood, OutputLanguage } from "../types";

export const suggestionPrompts: string[] = [
  "Neon-drenched Tokyo alley at midnight, rain-soaked pavement reflecting holographic signs.",
  "Sunrise over a misty rainforest canopy, warm beams cutting through layered fog, birds in flight.",
  "Arctic research outpost under aurora skies, ice shards glowing, scientists in reflective gear.",
  "Editorial portrait in soft window light, shallow depth of field, tactile fabrics and skin texture."
];

export const detailOptions: DetailLevel[] = ["Subtle", "Layered", "Maximal"];
export const moodOptions: Mood[] = ["Serene", "Energetic", "Dramatic", "Playful", "Mysterious"];
export const mediumOptions: Medium[] = ["Cinematic", "Analog film", "Illustration", "Fashion editorial", "Surreal concept"];
export const outputLanguageOptions: OutputLanguage[] = ["English", "Chinese", "German"];
