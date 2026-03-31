import type { OnboardingFilm } from "@/app/onboarding/page";

export type Reaction = "loved" | "disliked" | "seen" | "unseen";
export type Phase = "welcome" | "step" | "confirm" | "streaming" | "demographics" | "done";

export const MAX_PILLARS = 6;

export const STREAMING_PLATFORMS = [
  { id: "Netflix", name: "Netflix", logo: "/logos/Netflix_2015_logo.svg" },
  { id: "Prime Video", name: "Prime Video", logo: "/logos/Prime_Video_logo_(2024).svg" },
  { id: "Disney+", name: "Disney+", logo: "/logos/Disney+_(black)_logo.svg" },
  { id: "Apple TV", name: "Apple TV", logo: "/logos/Apple_TV_Plus_Logo.svg" },
  { id: "Now", name: "Now", logo: "/logos/Sky_Group_logo_2020.svg" },
  { id: "Paramount+", name: "Paramount+" },
  { id: "HBO Max", name: "HBO Max", logo: "/logos/HBO_Max_Logo_(October_2019_Print).svg" },
  { id: "Mubi", name: "Mubi", logo: "/logos/Mubi_logo.svg" },
  { id: "Crunchyroll", name: "Crunchyroll" },
  { id: "Discovery+", name: "Discovery+" },
  { id: "Infinity", name: "Infinity" },
  { id: "RaiPlay", name: "RaiPlay", logo: "/logos/RaiPlay.svg" }
];

export interface OnboardingFlowProps {
  films: OnboardingFilm[];
}

export type { OnboardingFilm };
