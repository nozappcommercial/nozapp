import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getPublishedArticles } from '@/app/actions/editorial';
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

export default async function RedazioneListingPage() {
    const articles = await getPublishedArticles();

    return (
        <main className="min-h-screen bg-[#faf7f2] font-['Cormorant_Garamond'] relative">
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
                        <Sparkles size={16} strokeWidth={1.5} />
                        <span className="font-['Fragment_Mono'] text-[10px] uppercase tracking-[0.3em]">Archivio Editoriale</span>
                    </div>
                    <h1 className="text-7xl md:text-9xl font-light leading-[0.8] tracking-tighter">
                        La <em className="italic text-[var(--gold)]">Redazione</em>
                    </h1>
                    <p className="text-2xl md:text-3xl font-light opacity-60 max-w-2xl leading-relaxed">
                        Esplorazioni critiche, interviste e riflessioni sul cinema che abita la nostra sfera semantica.
                    </p>
                </div>
            </header>

            {/* Articles Grid */}
            <section className="px-8 md:px-16 lg:px-24 max-w-7xl mx-auto pb-32">
                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                        {articles.map((article: any, index: number) => (
                            <Link 
                                key={article.id}
                                href={`/redazione/${article.slug}`}
                                className="group flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000"
                                style={{ animationDelay: `${index * 150}ms` }}
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
                                        <div className="w-full h-full bg-[#1a1a1a]/5" />
                                    )}
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
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
                                        Continua a leggere <ArrowRight size={12} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border-t border-black/5 opacity-40">
                        <p className="font-['Fragment_Mono'] text-sm uppercase tracking-widest">Nessun articolo pubblicato al momento.</p>
                    </div>
                )}
            </section>

            <Footer />
            <BackToTop />
        </main>
    );
}
