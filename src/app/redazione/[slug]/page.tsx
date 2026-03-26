import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { getArticleBySlug } from '@/app/actions/editorial';
import Footer from '@/components/layout/Footer';

interface ArticlePageProps {
    params: {
        slug: string;
    };
}

const formatDate = (dateStr: string, full = true) => {
    return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: full ? 'long' : '2-digit',
        year: 'numeric'
    }).format(new Date(dateStr));
};

export default async function ArticlePage({ params }: ArticlePageProps) {
    const article = await getArticleBySlug(params.slug);

    if (!article) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#faf7f2] font-['Cormorant_Garamond']">
            {/* Hero Section */}
            <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
                {article.cover_image ? (
                    <Image
                        src={article.cover_image}
                        alt={article.title}
                        fill
                        priority
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-[#1a1a1a]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#faf7f2] via-[#faf7f2]/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-6xl mx-auto">
                    <Link 
                        href="/sphere#redazione" 
                        className="inline-flex items-center gap-2 text-sm font-['Fragment_Mono'] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-8 group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                        Torna alla Redazione
                    </Link>
                    
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="flex items-center gap-4 font-['Fragment_Mono'] text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">
                            <span>{article.published_at ? formatDate(article.published_at) : ''}</span>
                            <span className="opacity-30">/</span>
                            <span>{article.author?.display_name || 'Redazione'}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-tight text-balance">
                            {article.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <article className="max-w-3xl mx-auto px-8 py-20 md:py-32 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1500 delay-500">
                {article.excerpt && (
                    <p className="text-2xl md:text-3xl font-light italic leading-relaxed opacity-80 border-l-2 border-[var(--gold)] pl-8 py-2">
                        {article.excerpt}
                    </p>
                )}

                <div className="text-xl md:text-2xl leading-relaxed text-[#1a1a1a] opacity-90 space-y-8 whitespace-pre-wrap">
                    {article.content}
                </div>

                <hr className="border-black/5 pt-12" />

                <footer className="flex flex-col md:flex-row md:items-center justify-between gap-8 opacity-60 text-sm font-['Fragment_Mono'] uppercase tracking-widest">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full ring-1 ring-black/10 flex items-center justify-center bg-black/5">
                            <User size={20} strokeWidth={1} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] opacity-50">Scritto da</span>
                            <span className="text-base font-serif lowercase italic">{article.author?.display_name || 'Redazione NoZapp'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        Pubblicato il {article.published_at ? formatDate(article.published_at, false) : ''}
                    </div>
                </footer>
            </article>

            <Footer />
        </main>
    );
}
