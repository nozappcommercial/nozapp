import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ScrollReveal from '@/components/animations/ScrollReveal';
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

// Calculate reading time roughly
const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
};

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    const readingTime = getReadingTime(article.content);

    return (
        <main className="min-h-screen bg-[#faf7f2] font-['Cormorant_Garamond'] selection:bg-[var(--gold)]/20">
            {/* Clean Header Section */}
            <header className="pt-32 pb-16 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto space-y-12">
                <nav className="flex flex-wrap items-center gap-8 text-[10px] font-['Fragment_Mono'] uppercase tracking-[0.4em] opacity-40">
                    <Link 
                        href="/sphere" 
                        className="inline-flex items-center gap-2 hover:opacity-100 transition-opacity group"
                    >
                        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> 
                        Torna alla Sfera
                    </Link>
                    <span className="opacity-20">/</span>
                    <Link 
                        href="/redazione" 
                        className="inline-flex items-center gap-2 hover:opacity-100 transition-opacity"
                    >
                        Redazione NoZapp
                    </Link>
                </nav>
                
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-['Fragment_Mono'] text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">
                        <span className="flex items-center gap-2">
                            <Calendar size={12} strokeWidth={1.5} />
                            {article.published_at ? formatDate(article.published_at) : ''}
                        </span>
                        <span className="opacity-20 hidden md:inline">|</span>
                        <span className="flex items-center gap-2">
                            <Clock size={12} strokeWidth={1.5} />
                            {readingTime} min di lettura
                        </span>
                        <span className="opacity-20 hidden md:inline">|</span>
                        <span>{article.author?.display_name || 'Redazione'}</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-light leading-[0.85] tracking-tight text-[#1a1a1a] text-balance max-w-6xl">
                        {article.title}
                    </h1>
                </div>
            </header>

            {/* Featured Image - Animated on scroll */}
            {article.cover_image && (
                <ScrollReveal 
                    className="w-full px-8 md:px-16 lg:px-24 max-w-7xl mx-auto mb-20"
                >
                    <div className="relative aspect-[21/9] md:aspect-[21/8] overflow-hidden rounded-sm ring-1 ring-black/5">
                        <Image
                            src={article.cover_image}
                            alt={article.title}
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                </ScrollReveal>
            )}

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-8 py-12 md:py-20 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1500 delay-500">
                {article.excerpt && (
                    <p className="text-3xl md:text-4xl font-light italic leading-relaxed text-[#1a1a1a]/70 border-l-2 border-[var(--gold)] pl-8 md:pl-12 py-4">
                        {article.excerpt}
                    </p>
                )}

                <div className="prose prose-xl prose-stone max-w-none 
                    prose-headings:font-light prose-headings:font-['Cormorant_Garamond'] prose-headings:tracking-tight
                    prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-[#1a1a1a]
                    prose-p:text-xl prose-p:md:text-2xl prose-p:leading-relaxed prose-p:text-[#1a1a1a]/85 prose-p:mb-8
                    prose-blockquote:border-[var(--gold)] prose-blockquote:bg-black/5 prose-blockquote:p-8 prose-blockquote:rounded-r-xl prose-blockquote:italic
                    prose-a:text-[var(--gold)] prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-sm prose-img:shadow-xl prose-img:mx-auto prose-img:block
                    prose-strong:font-medium prose-strong:text-black
                    font-serif">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {article.content}
                    </ReactMarkdown>
                </div>

                <div className="pt-2">
                    <hr className="border-black/5" />

                    <footer className="flex flex-col md:flex-row md:items-center justify-between gap-12 py-16">
                        <div className="flex items-center gap-6">
                            <div className="relative w-16 h-16 rounded-full ring-1 ring-black/10 overflow-hidden bg-black/5 flex items-center justify-center">
                                <User size={24} strokeWidth={1} className="opacity-40" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-['Fragment_Mono'] text-[9px] uppercase tracking-[0.2em] opacity-40 mb-1">Collaboratore Redazionale</span>
                                <span className="text-2xl lowercase italic">{article.author?.display_name || 'Redazione NoZapp'}</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Link 
                                href="/sphere"
                                className="flex items-center gap-3 px-8 py-3 bg-black text-white text-[10px] font-['Fragment_Mono'] uppercase tracking-[0.2em] rounded-full hover:bg-[var(--gold)] transition-all duration-500 group"
                            >
                                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                                TORNA ALLA SFERA
                            </Link>
                        </div>
                    </footer>
                </div>
            </article>

            <Footer />
        </main>
    );
}


