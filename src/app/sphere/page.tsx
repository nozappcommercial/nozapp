import { getPersonalizedGraph } from "@/app/actions/graph";
import SemanticSphere from "@/components/SemanticSphere";
import EditorialSection from "@/components/home/EditorialSection";
import NowShowingCarousel from "@/components/home/NowShowingCarousel";
import Footer from "@/components/layout/Footer";

export default async function Home() {
  const { nodes, edges } = await getPersonalizedGraph();

  if (!nodes || nodes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f8ee] text-[#78272e]">
        <div className="text-center p-8 border border-[#78272e]/20 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold mb-4">Sfera in preparazione...</h2>
          <p className="mb-6 opacity-80">
            Sembra che tu non abbia ancora completato l&apos;onboarding o che il sistema stia ancora elaborando i tuoi gusti.
          </p>
          <a
            href="/onboarding"
            className="px-6 py-2 bg-[#78272e] text-white rounded-full hover:bg-[#78272e]/90 transition-colors"
          >
            Configura i tuoi Pilastri
          </a>
        </div>
      </div>
    );
  }

  // Capped edges as fallback if DB edges are too sparse or for consistency
  const cappedEdges = edges.slice(0, 150);

  // 3. CAROUSEL MOVIES (Most recent ones from our personalized set)
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
