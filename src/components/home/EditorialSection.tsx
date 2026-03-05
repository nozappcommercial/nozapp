import Image from "next/image";

export default function EditorialSection() {
    const articles = [
        {
            id: 1,
            title: "Il cinema contemplativo di Tarkovsky: un viaggio nel tempo e nello spazio interiore",
            date: "12 Ottobre 2026",
            excerpt: "Da Solaris a Stalker, un'esplorazione profonda dei pilastri del cinema russo e del modo in cui la percezione del tempo modella la psiche dei protagonisti...",
            authorName: "Nome Cognome",
            authorRole: "Redattore Capo",
            authorAvatar: "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==", // 1x1 gray pixel placeholder
            coverImage: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800&h=400"
        },
        {
            id: 2,
            title: "L'estetica del Neon-Noir: ombre, luci al neon e alienazione urbana",
            date: "28 Settembre 2026",
            excerpt: "Analisi dell'evoluzione stilistica partendo dal capolavoro Blade Runner fino ad arrivare alle luci al neon disperate nelle opere metropolitane di Nicolas Winding Refn...",
            authorName: "Nome Cognome",
            authorRole: "Critica Cinematografica",
            authorAvatar: "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==", // 1x1 gray pixel placeholder
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
                            <div className="relative w-full aspect-[16/9] mb-6 overflow-hidden rounded-sm bg-black/5">
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
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-black/10 bg-black/5">
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
