"use server";

import { createClient } from "@/lib/supabase/server";

export interface UserProfileData {
    displayName: string;
    email: string;
    streamingSubscriptions: string[];
    onboardingComplete: boolean;
    pillars: {
        id: number;
        title: string;
        posterUrl: string | null;
        rank: number;
    }[];
    likedFilms: {
        id: number;
        title: string;
        year: number;
        posterUrl: string | null;
    }[];
}

/**
 * USER PROFILE ACTION
 * -------------------
 * Fetches all necessary data to populate the "Cinematic Passport" Profile Modal.
 */
export async function getUserProfileData(): Promise<UserProfileData> {
    const supabase = await createClient();

    // 1. AUTHENTICATION
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // 2. FETCH USER METADATA (from public.users)
    const { data: profile } = await supabase
        .from('users')
        .select('onboarding_complete, streaming_subscriptions')
        .eq('id', user.id)
        .single();

    // 3. FETCH PILLARS (DNA Cinematografico)
    const { data: pillarsData } = await supabase
        .from('user_pillars')
        .select(`
            rank,
            films (
                id, title, poster_url
            )
        `)
        .eq('user_id', user.id)
        .order('rank', { ascending: true });

    const pillars = (pillarsData || []).map((p: any) => ({
        id: p.films.id,
        title: p.films.title,
        posterUrl: p.films.poster_url,
        rank: p.rank
    }));

    // 4. FETCH LIKED FILMS (Archivio)
    // Note: This relies on the user_film_interactions table
    const { data: likedData } = await supabase
        .from('user_film_interactions')
        .select(`
            film_id,
            films (
                id, title, year, poster_url
            )
        `)
        .eq('user_id', user.id)
        .eq('interaction_type', 'liked');

    const likedFilms = (likedData || []).map((l: any) => ({
        id: l.films.id,
        title: l.films.title,
        year: l.films.year,
        posterUrl: l.films.poster_url
    }));

    return {
        displayName: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || "Utente",
        email: user.email || "",
        streamingSubscriptions: profile?.streaming_subscriptions || [],
        onboardingComplete: profile?.onboarding_complete || false,
        pillars,
        likedFilms
    };
}
