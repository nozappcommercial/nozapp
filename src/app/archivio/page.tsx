import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Archive, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { getArchivedArticles } from '@/app/actions/editorial';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';

export const dynamic = 'force-dynamic';

const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(new Date(dateStr));
};

export default async function ArchivioPage() {
    const articles = await getArchivedArticles();

    return (
        <main className="min-h-screen bg-[#faf7f2] font-['Cormorant_Garamond'] selection:bg-[var(--gold)]/20 relative">
            {/* Header / Intro */}
            <header className="pt-12 pb-20 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto space-y-12">
                <Link 
                    href="/sphere" 
                    className="inline-flex items-center gap-2 text-[10px] font-['Fragment_Mono'] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity group"
                >
                    ⇠ Torna alla Sfera
                </Link>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-[var(--gold)]">
                        <Archive size={16} strokeWidth={1.5} />
                        <span className="font-['Fragment_Mono'] text-[10px] uppercase tracking-[0.3em]">Memoria Storica</span>
                    </div>
                    <h1 className="text-7xl md:text-9xl font-light leading-[0.8] tracking-tighter">
                        L'<em className="italic text-[var(--gold)]">Archivio</em>
                    </h1>
                    <p className="text-2xl md:text-3xl font-light opacity-60 max-w-2xl leading-relaxed">
                        Tutti i contenuti pubblicati dalla redazione NoZapp, ordinati per tempo e visione. Una biblioteca digitale del cinema.
                    </p>
                </div>
            </header>

            {/* Articles Grid */}
            <section className="px-8 md:px-16 lg:px-24 max-w-7xl mx-auto pb-32 min-h-[50vh]">
                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                        {articles.map((article: any, index: number) => {
                            const isExpired = article.expires_at && new Date(article.expires_at) < new Date();
                            
                            return (
                                <ScrollReveal 
                                    key={article.id}
                                    delay={index * 0.1}
                                    className={isExpired ? 'opacity-70 grayscale-[0.3]' : ''}
                                >
                                    <Link 
                                        href={`/redazione/${article.slug}`}
                                        className="group flex flex-col space-y-6"
                                    >
                                    <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-black/5">
                                        {article.cover_image ? (
                                            <Image
                                                src={article.cover_image}
                                                alt={article.title}
                                                fill
                                                className="object-cover transition-all duration-1000 mix-blend-multiply group-hover:scale-105 group-hover:mix-blend-normal"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#1a1a1a]/5 flex items-center justify-center opacity-10">
                                                 <Archive size={64} strokeWidth={0.5} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                                        
                                        {isExpired && (
                                            <div className="absolute top-4 right-4 px-3 py-1 bg-black/80 text-white text-[8px] font-['Fragment_Mono'] uppercase tracking-[0.2em] rounded-full">
                                                Archiviato
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 font-['Fragment_Mono'] text-[9px] uppercase tracking-[0.2em] opacity-40">
                                            <span>{article.published_at ? formatDate(article.published_at) : ''}</span>
                                            <span className="h-px w-8 bg-black/10" />
                                            <span>{article.author?.display_name || 'Redazione'}</span>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-light leading-[0.9] tracking-tight group-hover:text-[var(--gold)] transition-colors duration-500">
                                            {article.title}
                                        </h2>
                                        {article.excerpt && (
                                            <p className="text-lg md:text-xl font-light opacity-60 leading-relaxed line-clamp-3">
                                                {article.excerpt}
                                            </p>
                                        )}
                                        <div className="pt-4 flex items-center gap-2 text-[10px] font-['Fragment_Mono'] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                                            Leggi il contenuto ⇢
                                        </div>
                                    </div>
                                    </Link>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center border-t border-black/5 opacity-40">
                        <p className="font-['Fragment_Mono'] text-sm uppercase tracking-widest">L'archivio è attualmente vuoto.</p>
                    </div>
                )}
            </section>

            <Footer />
            <BackToTop />
        </main>
    );
}
