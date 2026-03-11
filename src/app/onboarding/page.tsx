import { createClient } from "@/lib/supabase/server";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

export interface OnboardingFilm {
    id: number;
    title: string;
    year: number;
    director: string;
    poster_url: string | null;
    color_primary: string;
    color_accent: string;
    mood: string;
    onboarding_group: number;
}

export default async function OnboardingPage() {
    const supabase = createClient();

    // Helper for network retries (e.g., UND_ERR_CONNECT_TIMEOUT)
    const fetchWithRetry = async <T,>(operation: () => Promise<{ data: T | null, error: any }>, retries = 3, delayMs = 1500) => {
        for (let i = 0; i < retries; i++) {
            try {
                return await operation();
            } catch (error: any) {
                console.warn(`[Supabase Network] Onboarding fetch failed (attempt ${i + 1}/${retries}), retrying...`, error.message || error);
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
        return { data: null, error: new Error("Unreachable") };
    };

    // Fetch probe films ordered by group
    const { data: films, error } = await fetchWithRetry(async () => await supabase
        .from("films")
        .select("id, title, year, director, poster_url, color_primary, color_accent, mood, onboarding_group")
        .eq("is_onboarding_probe", true)
        .order("onboarding_group", { ascending: true })
        .order("id", { ascending: true }));

    if (error || !films || films.length === 0) {
        console.error("Error fetching onboarding films:", error);
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Cormorant Garamond', serif",
                background: "#F2EDE3",
                color: "#1A1614",
            }}>
                <p>Errore nel caricamento dei film. Riprova più tardi.</p>
            </div>
        );
    }

    // Convert to typed array
    const typedFilms: OnboardingFilm[] = (films as any[]).map((f: any) => ({
        id: f.id,
        title: f.title,
        year: f.year || 0,
        director: f.director || "Regista sconosciuto",
        poster_url: f.poster_url,
        color_primary: f.color_primary || "#1A1614",
        color_accent: f.color_accent || "#B8895A",
        mood: f.mood || "",
        onboarding_group: f.onboarding_group || 1,
    }));

    return <OnboardingFlow films={typedFilms} />;
}
