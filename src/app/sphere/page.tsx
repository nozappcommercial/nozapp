import { createClient } from "@/lib/supabase/server";
import SemanticSphere, { FilmNode, FilmEdge } from "@/components/SemanticSphere";
import EditorialSection from "@/components/home/EditorialSection";
import NowShowingCarousel from "@/components/home/NowShowingCarousel";
import Footer from "@/components/layout/Footer";

// Colori di base per i nodi, distribuiti in 3 shell concentrici
const SHELL_POSTER_COLORS = [
  ["#0d1b35", "#1a3a6b", "#2d5a8e"], // Shell 0 (centro)
  ["#051a15", "#0d3a28", "#1a5a3a"], // Shell 1 (meccanica)
  ["#1a1d26", "#2a3245", "#3c4866"], // Shell 2 (esterno)
];

export default async function Home() {
  const supabase = createClient();

  // Fetch films with relations
  const { data: films, error } = await supabase
    .from('films')
    .select(`
      id,
      title,
      year,
      director,
      poster_url,
      film_themes (theme),
      film_genres (genre)
    `)
    .limit(100);

  if (error || !films) {
    console.error("Error fetching films:", error);
    return <div>Error loading sphere data</div>;
  }

  // 1. MAP TO NODES
  const nodes: FilmNode[] = films.map((f, i) => {
    const rawThemes = (f.film_themes as { theme: string }[]) || [];
    const rawGenres = (f.film_genres as { genre: string }[]) || [];
    const tags = [...rawThemes.map(t => t.theme), ...rawGenres.map(g => g.genre)].slice(0, 4);

    // Distribuire i film su 3 Shell (0, 1, 2) arbitrariamente (es. i primi 15 al centro, poi a salire)
    let shell = 2;
    if (i < 15) shell = 0;
    else if (i < 40) shell = 1;

    return {
      id: f.id,
      title: f.title,
      year: f.year || 0,
      dir: f.director || "Unknown",
      shell,
      tags,
      poster_url: f.poster_url,
      poster: SHELL_POSTER_COLORS[shell] // fallback array temporaneo caso l'immagine non carichi
    };
  });

  // 2. GENERATE EDGES (Shared themes/genres)
  const edges: FilmEdge[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];

      // Calculate intersection of tags
      const commonTags = nodeA.tags.filter(tag => nodeB.tags.includes(tag));

      if (commonTags.length > 0) {
        // Assign visual weight or edge type based on connection distance
        const tDiff = Math.abs(nodeA.shell - nodeB.shell);
        let edgeType = "thematic";
        if (tDiff === 1) edgeType = "stylistic";
        if (tDiff === 2) edgeType = "contrast";

        edges.push({
          from: i, // index-based connection required by the current Three.js code logic
          to: j,
          type: edgeType,
          label: `In comune: ${commonTags.join(", ")}`
        });
      }
    }
  }

  // Cap number of edges to prevent 3D performance issues (if there are too many connections)
  // We keep maximum ~150 random meaningful edges.
  const cappedEdges = edges.sort(() => 0.5 - Math.random()).slice(0, 150);

  // 3. CAROUSEL MOVIES (Most recent ones)
  const carouselMovies = [...nodes]
    .sort((a, b) => b.year - a.year) // sort by newest
    .slice(0, 15) // take top 15
    .map(n => ({
      id: n.id,
      title: n.title,
      director: n.dir,
      year: n.year,
      themes: n.tags.slice(0, 3), // max 3 tags for UI constraints
      poster: n.poster_url || undefined
    }));

  return (
    <main className="w-full min-h-screen m-0 p-0 relative">
      <section className="relative w-full h-[100vh] overflow-hidden">
        <SemanticSphere files={nodes} edges={cappedEdges} />
      </section>
      <EditorialSection />
      <NowShowingCarousel movies={carouselMovies} />
      <Footer />
    </main>
  );
}
