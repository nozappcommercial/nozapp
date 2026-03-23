"use server";

import { createClient } from "@/lib/supabase/server";

/* ─── TYPES ───────────────────────────────────────────────────── */
export interface PillarFilm {
    id: number;
    title: string;
    year: number;
    director: string;
    poster_url: string | null;
    rank: number;
}

export interface LovedFilm {
    id: number;
    title: string;
    year: number;
    director: string;
    poster_url: string | null;
}

export interface ProfileData {
    email: string;
    memberSince: string;
    pillars: PillarFilm[];
    lovedFilms: LovedFilm[];
    streamingServices: string[];
    sphereStats: { affinita: number; scoperta: number };
}

/* ─── GET PROFILE DATA ────────────────────────────────────────── */
/**
 * Single server action to fetch all profile data in one call.
 * Reads: auth user, user_pillars + films, user_film_interactions (loved),
 * users.streaming_subscriptions, and counts for shell 1 & 2 nodes.
 */
export async function getProfileData(): Promise<ProfileData> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Parallel queries to avoid waterfall
    const [pillarsRes, lovedRes, userRes, shell1Res, shell2Res] = await Promise.all([
        // 1. Pillars (films joined)
        supabase
            .from('user_pillars')
            .select('rank, films (id, title, year, director, poster_url)')
            .eq('user_id', user.id)
            .order('rank', { ascending: true }),

        // 2. Loved films (interactions where type = 'liked')
        supabase
            .from('user_film_interactions')
            .select('film_id, films (id, title, year, director, poster_url)')
            .eq('user_id', user.id)
            .eq('interaction_type', 'liked'),

        // 3. User profile (streaming subscriptions)
        supabase
            .from('users')
            .select('streaming_subscriptions')
            .eq('id', user.id)
            .single(),

        // 4. Shell 1 count — editorial_edges that connect to pillar films
        // We count unique non-pillar films connected to pillars
        supabase
            .from('user_pillars')
            .select('film_id')
            .eq('user_id', user.id),

        // 5. Placeholder — we'll compute shell 2 from edges later
        Promise.resolve({ data: null, error: null }),
    ]);

    // Process pillars
    const pillarIds = new Set<number>();
    const pillars: PillarFilm[] = (pillarsRes.data || []).map((p: any) => {
        const f = p.films;
        if (f) pillarIds.add(f.id);
        return {
            id: f?.id || 0,
            title: f?.title || '',
            year: f?.year || 0,
            director: f?.director || 'Unknown',
            poster_url: f?.poster_url || null,
            rank: p.rank,
        };
    });

    // Process loved films (exclude pillars)
    const lovedFilms: LovedFilm[] = (lovedRes.data || [])
        .filter((r: any) => r.films && !pillarIds.has(r.films.id))
        .map((r: any) => ({
            id: r.films.id,
            title: r.films.title,
            year: r.films.year || 0,
            director: r.films.director || 'Unknown',
            poster_url: r.films.poster_url || null,
        }));

    // Streaming subscriptions
    const streamingServices: string[] = userRes.data?.streaming_subscriptions || [];

    // Sphere stats: count shell 1 and shell 2 nodes
    // Shell 1 = films connected to pillars via editorial_edges
    // Shell 2 = films connected to shell 1
    let affinita = 0;
    let scoperta = 0;

    if (pillarIds.size > 0) {
        const pillarIdArr = Array.from(pillarIds);
        const edgesRes = await supabase
            .from('editorial_edges')
            .select('from_film_id, to_film_id')
            .or(`from_film_id.in.(${pillarIdArr.join(',')}),to_film_id.in.(${pillarIdArr.join(',')})`);

        const shell1Ids = new Set<number>();
        (edgesRes.data || []).forEach((e: any) => {
            if (pillarIds.has(e.from_film_id) && !pillarIds.has(e.to_film_id)) {
                shell1Ids.add(e.to_film_id);
            }
            if (pillarIds.has(e.to_film_id) && !pillarIds.has(e.from_film_id)) {
                shell1Ids.add(e.from_film_id);
            }
        });
        affinita = shell1Ids.size;

        // Shell 2: films connected to shell 1 (but not pillars, not shell 1)
        if (shell1Ids.size > 0) {
            const s1Arr = Array.from(shell1Ids);
            const edges2Res = await supabase
                .from('editorial_edges')
                .select('from_film_id, to_film_id')
                .or(`from_film_id.in.(${s1Arr.join(',')}),to_film_id.in.(${s1Arr.join(',')})`);

            const shell2Ids = new Set<number>();
            (edges2Res.data || []).forEach((e: any) => {
                if (!pillarIds.has(e.from_film_id) && !shell1Ids.has(e.from_film_id)) {
                    shell2Ids.add(e.from_film_id);
                }
                if (!pillarIds.has(e.to_film_id) && !shell1Ids.has(e.to_film_id)) {
                    shell2Ids.add(e.to_film_id);
                }
            });
            scoperta = shell2Ids.size;
        }
    }

    // Format member since
    const createdAt = user.created_at || new Date().toISOString();

    return {
        email: user.email || '',
        memberSince: createdAt,
        pillars,
        lovedFilms,
        streamingServices,
        sphereStats: { affinita, scoperta },
    };
}

/* ─── REORDER PILLARS ─────────────────────────────────────────── */
/**
 * Bulk upsert pillar ranks based on new ordering.
 * ids[0] gets rank 1, ids[1] gets rank 2, etc.
 */
import { z } from "zod";

const ReorderSchema = z.array(z.number().int().positive());
const StreamingSchema = z.array(z.string().min(1).max(50));

export async function reorderPillars(ids: number[]): Promise<void> {
    const parsed = ReorderSchema.safeParse(ids);
    if (!parsed.success) throw new Error("Invalid input data");

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Update each pillar's rank
    const updates = parsed.data.map((filmId, i) =>
        supabase
            .from('user_pillars')
            .update({ rank: i + 1 })
            .eq('user_id', user.id)
            .eq('film_id', filmId)
    );

    await Promise.all(updates);
}

/* ─── SAVE STREAMING SERVICES ─────────────────────────────────── */
/**
 * Replace the user's streaming subscriptions.
 */
export async function saveStreamingServices(serviceIds: string[]): Promise<void> {
    const parsed = StreamingSchema.safeParse(serviceIds);
    if (!parsed.success) throw new Error("Invalid input data");

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('users')
        .update({ streaming_subscriptions: parsed.data })
        .eq('id', user.id);

    if (error) throw error;
}
