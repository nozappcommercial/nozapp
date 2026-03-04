import SemanticSphere from "@/components/SemanticSphere";
import Image from "next/image";

function EditorialSection() {
  const articles = [
    {
      id: 1,
      title: "Il cinema contemplativo di Tarkovsky: un viaggio nel tempo e nello spazio interiore",
      date: "12 Ottobre 2026",
      excerpt: "Da Solaris a Stalker, un'esplorazione profonda dei pilastri del cinema russo e del modo in cui la percezione del tempo modella la psiche dei protagonisti...",
      authorName: "Davide Viganò",
      authorRole: "Redattore Capo",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
      coverImage: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800&h=400"
    },
    {
      id: 2,
      title: "L'estetica del Neon-Noir: ombre, luci al neon e alienazione urbana",
      date: "28 Settembre 2026",
      excerpt: "Analisi dell'evoluzione stilistica partendo dal capolavoro Blade Runner fino ad arrivare alle luci al neon disperate nelle opere metropolitane di Nicolas Winding Refn...",
      authorName: "Giulia Sarti",
      authorRole: "Critica Cinematografica",
      authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
      coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800&h=400"
    }
  ];

  return (
    <section className="bg-[var(--bg)] text-[var(--text)] w-full py-24 px-8 md:px-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 border-b border-[var(--gold-dim)] pb-8">
          <h2 className="text-4xl md:text-5xl font-light mb-4">Consigli della <em className="text-[var(--gold)] italic">Redazione</em></h2>
          <p className="font-['Fragment_Mono'] text-[10px] tracking-widest uppercase opacity-60">
            Editoriali curati · Approfondimenti analitici
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {articles.map((article) => (
            <article key={article.id} className="group cursor-pointer flex flex-col transition-all duration-300 hover:-translate-y-2">
              {/* Cover Image */}
              <div className="relative w-full aspect-[16/9] mb-6 overflow-hidden rounded-sm">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>

              {/* Meta & Title */}
              <div className="flex flex-col flex-1">
                <div className="font-['Fragment_Mono'] text-[9px] uppercase tracking-[0.2em] text-[var(--ember)] mb-3 opacity-80">
                  {article.date}
                </div>
                <h3 className="text-2xl md:text-3xl leading-snug mb-4 group-hover:text-[var(--gold)] transition-colors">
                  {article.title}
                </h3>
                <p className="font-['Fragment_Mono'] text-[11px] leading-relaxed opacity-70 mb-8 flex-1">
                  {article.excerpt}
                </p>

                {/* Author footer */}
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-black/5">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-black/10">
                    <Image
                      src={article.authorAvatar}
                      alt={article.authorName}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-['Fragment_Mono'] text-[8px] uppercase tracking-widest opacity-50 mb-1">
                      Scritto da
                    </span>
                    <span className="text-lg leading-none">
                      {article.authorName}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function NowShowingSection() {
  const movies = [
    {
      id: 1,
      title: "Dune: Parte Tre",
      director: "Denis Villeneuve",
      year: 2026,
      themes: ["Destino", "Potere", "Deserto"],
      poster: "https://images.unsplash.com/photo-1546555138-0fc4a96fbcf5?auto=format&fit=crop&q=80&w=400&h=600"
    },
    {
      id: 2,
      title: "Mickey 17",
      director: "Bong Joon Ho",
      year: 2025,
      themes: ["Clonazione", "Spazio", "Identità"],
      poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400&h=600"
    },
    {
      id: 3,
      title: "Nosferatu",
      director: "Robert Eggers",
      year: 2024,
      themes: ["Orrore", "Gotico", "Ossessione"],
      poster: "https://images.unsplash.com/photo-1629731610404-51a80d44005c?auto=format&fit=crop&q=80&w=400&h=600"
    },
    {
      id: 4,
      title: "Furiosa",
      director: "George Miller",
      year: 2024,
      themes: ["Vendetta", "Sopravvivenza", "Azione"],
      poster: "https://images.unsplash.com/photo-1508215885820-4585e5610924?auto=format&fit=crop&q=80&w=400&h=600"
    },
    {
      id: 5,
      title: "Megalopolis",
      director: "Francis Ford Coppola",
      year: 2024,
      themes: ["Utopia", "Società", "Architettura"],
      poster: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400&h=600"
    },
    {
      id: 6,
      title: "Kraven the Hunter",
      director: "J.C. Chandor",
      year: 2024,
      themes: ["Origini", "Caccia", "Azione"],
      poster: "https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&q=80&w=400&h=600"
    },
    {
      id: 7,
      title: "Gladiator II",
      director: "Ridley Scott",
      year: 2024,
      themes: ["Impero", "Vendetta", "Storia"],
      poster: "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=400&h=600"
    }
  ];

  return (
    <section className="bg-[var(--surface)] text-[var(--text)] w-full py-20 px-8 md:px-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-12 flex items-end justify-between border-b border-black/5 pb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-light mb-2">Ora al <em className="text-[var(--gold)] italic">Cinema</em></h2>
            <p className="font-['Fragment_Mono'] text-[9px] tracking-widest uppercase opacity-60">
              Proiezioni in sala · Uscite recenti
            </p>
          </div>
          <button className="font-['Fragment_Mono'] text-[9px] tracking-widest uppercase px-4 py-2 border border-[var(--gold-dim)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors duration-300">
            Vedi tutti
          </button>
        </header>

        <div className="relative w-full overflow-hidden">
          <div className="flex overflow-x-auto gap-8 pb-10 snap-x snap-mandatory pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {movies.map((movie) => (
              <div key={movie.id} className="snap-start flex-shrink-0 w-[220px] md:w-[260px] group cursor-pointer transition-transform duration-300 hover:-translate-y-2">
                {/* Poster Image */}
                <div className="relative w-full aspect-[2/3] mb-5 overflow-hidden rounded-sm shadow-md border border-black/5">
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info */}
                <div className="flex flex-col">
                  <h3 className="text-xl leading-tight mb-2 group-hover:text-[var(--gold)] transition-colors">
                    {movie.title}
                  </h3>
                  <div className="font-['Fragment_Mono'] text-[10px] tracking-wider text-[var(--ember)] opacity-80 mb-3">
                    {movie.director} <span className="text-[var(--text)] opacity-40 ml-1">· {movie.year}</span>
                  </div>

                  {/* Themes tags */}
                  <div className="flex flex-wrap gap-2">
                    {movie.themes.map((theme, i) => (
                      <span key={i} className="font-['Fragment_Mono'] text-[8px] uppercase tracking-widest px-2 py-1 border border-[var(--cold-dim)] text-[var(--cold)] bg-[#3b8b9e08]">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="w-full min-h-screen m-0 p-0 relative">
      <section className="relative w-full h-[100vh] overflow-hidden">
        <SemanticSphere />
      </section>
      <EditorialSection />
      <NowShowingSection />
    </main>
  );
}
