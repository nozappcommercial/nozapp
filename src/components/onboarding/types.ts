import type { OnboardingFilm } from "@/app/onboarding/page";

export type Reaction = "loved" | "disliked" | "seen" | "unseen";
export type Phase = "welcome" | "step" | "confirm" | "streaming" | "demographics" | "done";

export const MAX_PILLARS = 6;

export const STREAMING_PLATFORMS = [
  { id: "Netflix", name: "Netflix" },
  { id: "Prime Video", name: "Prime Video" },
  { id: "Disney+", name: "Disney+" },
  { id: "Apple TV", name: "Apple TV" },
  { id: "Now", name: "Now" },
  { id: "Paramount+", name: "Paramount+" },
  { id: "HBO Max", name: "HBO Max" },
  { id: "Mubi", name: "Mubi" },
  { id: "Crunchyroll", name: "Crunchyroll" },
  { id: "Discovery+", name: "Discovery+" },
  { id: "Infinity", name: "Infinity" },
  { id: "RaiPlay", name: "RaiPlay" }
];

export interface OnboardingFlowProps {
  films: OnboardingFilm[];
}

export type { OnboardingFilm };
