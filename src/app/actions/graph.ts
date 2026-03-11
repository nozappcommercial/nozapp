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
    film_themes: { theme: string }[];
    film_genres: { genre: string }[];
}

export async function getPersonalizedGraph() {
    const supabase = createClient();

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // 2. FETCH SHELL 0 (Pillars)
    const { data: pillars, error: pillarErr } = await supabase
        .from('user_pillars')
        .select(`
      rank,
      films (
        id, title, year, director, poster_url,
        film_themes (theme),
        film_genres (genre)
      )
    `)
        .eq('user_id', user.id)
        .order('rank', { ascending: true });

    if (pillarErr) {
        console.error(`[Graph] Error fetching pillars for user ${user.id}:`, pillarErr);
        throw pillarErr;
    }

    console.log(`[Graph] Fetched ${pillars?.length || 0} pillars for user ${user.id}`);

    const nodes: FilmNode[] = [];
    const edgeSet = new Set<string>(); // To prevent duplicate edges
    const filmIdToIndex = new Map<number, number>();

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
            poster: SHELL_POSTER_COLORS[0]
        });
        return f.id;
    }).filter(Boolean) as number[];

    // 3. FETCH SHELL 1 (Connections of Shell 0)
    if (pillarIds.length > 0) {
        const { data: edges1, error: err1 } = await supabase
            .from('editorial_edges')
            .select(`
        type, weight, label,
        from_film_id, to_film_id
      `)
            .or(`from_film_id.in.(${pillarIds.join(',')}),to_film_id.in.(${pillarIds.join(',')})`);

        if (err1) console.error("Error fetching edges1:", err1);

        const shell1Ids = new Set<number>();
        if (edges1) {
            for (const e of edges1) {
                const otherId = pillarIds.includes(e.from_film_id) ? e.to_film_id : e.from_film_id;
                if (!filmIdToIndex.has(otherId)) {
                    shell1Ids.add(otherId);
                }
            }
        }

        // Load Shell 1 nodes
        if (shell1Ids.size > 0) {
            const { data: nodes1 } = await supabase
                .from('films')
                .select(`
          id, title, year, director, poster_url,
          film_themes (theme),
          film_genres (genre)
        `)
                .in('id', Array.from(shell1Ids))
                .limit(40); // Cap Shell 1

            if (nodes1) {
                for (const f_raw of nodes1) {
                    const f = f_raw as unknown as FilmWithRelations;
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
                        shell: 1,
                        tags,
                        poster_url: f.poster_url,
                        poster: SHELL_POSTER_COLORS[1]
                    });
                }
            }
        }

        // 4. FETCH SHELL 2 (Connections of Shell 1)
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
                    if (!filmIdToIndex.has(otherId)) {
                        shell2Ids.add(otherId);
                    }
                }
            }

            if (shell2Ids.size > 0) {
                const { data: nodes2 } = await supabase
                    .from('films')
                    .select(`
            id, title, year, director, poster_url,
            film_themes (theme),
            film_genres (genre)
          `)
                    .in('id', Array.from(shell2Ids))
                    .limit(100 - nodes.length); // Stay under 100 total

                if (nodes2) {
                    for (const f_raw of nodes2) {
                        const f = f_raw as unknown as FilmWithRelations;
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
                            shell: 2,
                            tags,
                            poster_url: f.poster_url,
                            poster: SHELL_POSTER_COLORS[2]
                        });
                    }
                }
            }
        }
    }

    // 5. FINAL EDGE CONSTRUCTION
    // Fetch ALL edges between ALL nodes in our set
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
                        edges.push({
                            from: fromIdx,
                            to: toIdx,
                            type: e.type,
                            label: e.label || ""
                        });
                    }
                }
            }
        }
    }

    return { nodes, edges };
}
