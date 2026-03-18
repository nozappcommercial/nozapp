"use server";

import { createClient } from "@/lib/supabase/server";
import { FilmNode, FilmEdge } from "@/components/SemanticSphere";

const SHELL_POSTER_COLORS = [
    ["#0d1b35", "#1a3a6b", "#2d5a8e"], // Shell 0
    ["#051a15", "#0d3a28", "#1a5a3a"], // Shell 1
    ["#1a1d26", "#2a3245", "#3c4866"], // Shell 2
];

interface FilmWithRelations {
    id: number;
    title: string;
    year: number | null;
    director: string | null;
    poster_url: string | null;
    streaming_providers: any[] | null;
    film_themes: { theme: string }[];
    film_genres: { genre: string }[];
}

/**
 * GRAPH GENERATION ACTION
 * -----------------------
 * This server action builds a personalized 3D graph for the user.
 * It follows a "Shell-by-Shell" expansion strategy:
 * - Shell 0: User's selected pillars (top interests).
 * - Shell 1: Editorial connections directly linked to Shell 0.
 * - Shell 2: Secondary connections linked to Shell 1.
 */
export async function getPersonalizedGraph() {
    const supabase = await createClient();

    // 1. AUTHENTICATION
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // 2. FETCH USER INTERACTIONS (Feedback)
    // We load seen/liked/ignored status upfront to color nodes correctly.
    const { data: interactionRecords } = await supabase
        .from('user_film_interactions')
        .select('film_id, interaction_type')
        .eq('user_id', user.id);

    const interactionsMap = new Map<number, string>();
    interactionRecords?.forEach(rec => {
        interactionsMap.set(rec.film_id, rec.interaction_type);
    });

    // 3. FETCH SHELL 0 (Pillars)
    // These are the "core" nodes in the center of the sphere.
    const { data: pillars, error: pillarErr } = await supabase
        .from('user_pillars')
        .select(`
            rank,
            films (
                id, title, year, director, poster_url, streaming_providers,
                film_themes (theme),
                film_genres (genre)
            )
        `)
        .eq('user_id', user.id)
        .order('rank', { ascending: true });

    if (pillarErr) throw pillarErr;

    const nodes: FilmNode[] = [];
    const edgeSet = new Set<string>(); // Map pair ids to prevent overlapping lines
    const filmIdToIndex = new Map<number, number>(); // Map DB IDs to local array indices

    // Process Shell 0
    const pillarIds = (pillars || []).map(p => {
        const f = (p.films as unknown as FilmWithRelations);
        if (!f) return null;

        const idx = nodes.length;
        filmIdToIndex.set(f.id, idx);

        const tags = [
            ...(f.film_themes || []).map((t) => t.theme),
            ...(f.film_genres || []).map((g) => g.genre)
        ].slice(0, 4);

        nodes.push({
            id: f.id,
            title: f.title,
            year: f.year || 0,
            dir: f.director || "Unknown",
            shell: 0,
            tags,
            poster_url: f.poster_url,
            poster: SHELL_POSTER_COLORS[0],
            interaction: interactionsMap.get(f.id) as any,
            streaming_providers: f.streaming_providers
        });
        return f.id;
    }).filter(Boolean) as number[];

    // 4. FETCH SHELL 1 (Primary Affinity)
    // Expand the graph to nodes directly connected to the user's pillars.
    if (pillarIds.length > 0) {
        const { data: edges1 } = await supabase
            .from('editorial_edges')
            .select('type, weight, label, from_film_id, to_film_id')
            .or(`from_film_id.in.(${pillarIds.join(',')}),to_film_id.in.(${pillarIds.join(',')})`);

        const shell1Ids = new Set<number>();
        if (edges1) {
            for (const e of edges1) {
                const otherId = pillarIds.includes(e.from_film_id) ? e.to_film_id : e.from_film_id;
                if (!filmIdToIndex.has(otherId)) shell1Ids.add(otherId);
            }
        }

        if (shell1Ids.size > 0) {
            const { data: nodes1 } = await supabase
                .from('films')
                .select(`id, title, year, director, poster_url, streaming_providers, film_themes (theme), film_genres (genre)`)
                .in('id', Array.from(shell1Ids))
                .limit(40); // Cap Shell 1 to maintain performance

            if (nodes1) {
                for (const f_raw of nodes1) {
                    const f = f_raw as unknown as FilmWithRelations;
                    const idx = nodes.length;
                    filmIdToIndex.set(f.id, idx);
                    const tags = [...(f.film_themes || []).map(t => t.theme), ...(f.film_genres || []).map(g => g.genre)].slice(0, 4);

                    nodes.push({
                        id: f.id,
                        title: f.title,
                        year: f.year || 0,
                        dir: f.director || "Unknown",
                        shell: 1,
                        tags,
                        poster_url: f.poster_url,
                        poster: SHELL_POSTER_COLORS[1],
                        interaction: interactionsMap.get(f.id) as any,
                        streaming_providers: f.streaming_providers
                    });
                }
            }
        }

        // 5. FETCH SHELL 2 (Discovery / Serendipity)
        // Further expansion into loosely connected nodes.
        const currentShell1Ids = Array.from(shell1Ids);
        if (currentShell1Ids.length > 0 && nodes.length < 90) {
            const { data: edges2 } = await supabase
                .from('editorial_edges')
                .select('from_film_id, to_film_id')
                .or(`from_film_id.in.(${currentShell1Ids.join(',')}),to_film_id.in.(${currentShell1Ids.join(',')})`)
                .limit(200);

            const shell2Ids = new Set<number>();
            if (edges2) {
                for (const e of edges2) {
                    const otherId = currentShell1Ids.includes(e.from_film_id) ? e.to_film_id : e.from_film_id;
                    if (!filmIdToIndex.has(otherId)) shell2Ids.add(otherId);
                }
            }

            if (shell2Ids.size > 0) {
                const { data: nodes2 } = await supabase
                    .from('films')
                    .select(`id, title, year, director, poster_url, streaming_providers, film_themes (theme), film_genres (genre)`)
                    .in('id', Array.from(shell2Ids))
                    .limit(100 - nodes.length); // Stay under 100 total nodes for 3D stability

                if (nodes2) {
                    for (const f_raw of nodes2) {
                        const f = f_raw as unknown as FilmWithRelations;
                        const idx = nodes.length;
                        filmIdToIndex.set(f.id, idx);
                        const tags = [...(f.film_themes || []).map(t => t.theme), ...(f.film_genres || []).map(g => g.genre)].slice(0, 4);

                        nodes.push({
                            id: f.id,
                            title: f.title,
                            year: f.year || 0,
                            dir: f.director || "Unknown",
                            shell: 2,
                            tags,
                            poster_url: f.poster_url,
                            poster: SHELL_POSTER_COLORS[2],
                            interaction: interactionsMap.get(f.id) as any,
                            streaming_providers: f.streaming_providers
                        });
                    }
                }
            }
        }
    }

    // 6. FINAL EDGE CONSTRUCTION
    // Re-scans all editorial_edges to build the line segments between existing nodes.
    const allNodeIds = Array.from(filmIdToIndex.keys());
    const edges: FilmEdge[] = [];

    if (allNodeIds.length > 0) {
        const { data: dbEdges } = await supabase
            .from('editorial_edges')
            .select('from_film_id, to_film_id, type, label, weight')
            .or(`from_film_id.in.(${allNodeIds.join(',')}),to_film_id.in.(${allNodeIds.join(',')})`);

        if (dbEdges) {
            for (const e of dbEdges) {
                const fromIdx = filmIdToIndex.get(e.from_film_id);
                const toIdx = filmIdToIndex.get(e.to_film_id);

                if (fromIdx !== undefined && toIdx !== undefined) {
                    const pairKey = [fromIdx, toIdx].sort().join('-');
                    if (!edgeSet.has(pairKey)) {
                        edgeSet.add(pairKey);
                        edges.push({ from: fromIdx, to: toIdx, type: e.type, label: e.label || "" });
                    }
                }
            }
        }
    }

    return { nodes, edges };
}

