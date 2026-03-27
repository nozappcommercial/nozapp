export const dynamic = 'force-dynamic';

import { getPersonalizedGraph } from "@/app/actions/graph";
import { getPublishedArticles } from "@/app/actions/editorial";
import { getCinemaMoviesPublic } from "@/app/actions/cinema";
import SphereWithProfile from "@/components/profile/SphereWithProfile";
import EditorialSection from "@/components/home/EditorialSection";
import NowShowingCarousel from "@/components/home/NowShowingCarousel";
import Footer from "@/components/layout/Footer";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Database } from "@/types/supabase";

type CinemaMovie = Database['public']['Tables']['cinema_movies']['Row'];

export default async function Home() {
  const cookieStore = await cookies();
  // Removed forced admin redirect to allow admins to view the public sphere
  // Admin access will be handled via a dedicated entry point in the header

  const [{ nodes, edges, subscriptions }, articles, cinemaMoviesData] = await Promise.all([
    getPersonalizedGraph(),
    getPublishedArticles(),
    getCinemaMoviesPublic()
  ]);

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

  // 3. CAROUSEL MOVIES (Fetch from manual admin management)
  const carouselMovies = (cinemaMoviesData || []).map((m: CinemaMovie) => ({
    id: Number(m.id.split('-')[0]), // Dummy numeric ID if needed by Carousel, but uuid is safer. Carousel uses it for key.
    title: m.title,
    director: m.director,
    year: m.year,
    themes: m.themes.slice(0, 3), 
    poster: m.poster_url || undefined
  }));

  return (
    <main className="w-full min-h-screen m-0 p-0 relative">
      <section id="sfera" className="relative w-full h-[100vh] overflow-hidden">
        <SphereWithProfile nodes={nodes} edges={cappedEdges} subscriptions={subscriptions} />
      </section>
      <EditorialSection articles={articles as any} />
      <NowShowingCarousel movies={carouselMovies} />
      <Footer />
    </main>
  );
}
