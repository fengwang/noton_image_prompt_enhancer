export type DetailLevel = "Subtle" | "Layered" | "Maximal";
export type Mood = "Serene" | "Energetic" | "Dramatic" | "Playful" | "Mysterious";
export type Medium = "Cinematic" | "Analog film" | "Illustration" | "Fashion editorial" | "Surreal concept";

export interface RefinementOptions {
  detailLevel: DetailLevel;
  mood: Mood;
  medium: Medium;
}

export interface EnhanceRequest {
  prompt: string;
  options: RefinementOptions;
  baseUrl?: string;
  model?: string;
  apiKey?: string;
}

export interface EnhanceResponse {
  enhanced: string;
  error?: string;
}
