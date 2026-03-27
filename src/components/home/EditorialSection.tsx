"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    published_at: string | null;
    author?: {
        display_name: string | null;
    } | null;
}

const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(new Date(dateStr));
};

/**
 * EDITORIAL SECTION
 * -----------------
 * Displays curated articles/editorials with a scroll-reveal animation.
 * Uses IntersectionObserver to trigger animations when the section enters the viewport.
 */
export default function EditorialSection({ articles = [] }: { articles: Article[] }) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // INTERSECTION OBSERVER
    // ---------------------
    // Detects when the user scrolls to this section and triggers the 'reveal' state.
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target); // Trigger once
                }
            },
            { threshold: 0.15 } // Trigger when 15% of the section is visible
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section 
            id="redazione" 
            ref={sectionRef}
            className="bg-[var(--bg)] text-[var(--text)] w-full py-24 px-8 md:px-16" 
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
            <div className="max-w-6xl mx-auto">
                <header className={`mb-16 border-b border-[var(--gold-dim)] pb-8 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <h2 className="text-4xl md:text-5xl font-light mb-4">Consigli della <em className="text-[var(--gold)] italic">Redazione</em></h2>
                    <p className="font-['Fragment_Mono'] text-[10px] tracking-widest uppercase opacity-60">
                        Editoriali curati · Approfondimenti analitici
                    </p>
                </header>

                {articles.length === 0 ? (
                    <div className={`py-20 flex flex-col items-center text-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="w-16 h-1 w-1 bg-[var(--gold)]/30 mb-8" />
                        <p className="text-2xl md:text-3xl font-light italic opacity-40 max-w-2xl leading-relaxed">
                            Approfondimenti in arrivo. <br className="hidden md:block" />
                            La nostra redazione sta preparando nuovi contenuti esclusivi per te.
                        </p>
                        <div className="font-['Fragment_Mono'] text-[9px] uppercase tracking-[0.3em] opacity-20 mt-8">
                            Stay tuned
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {articles.map((article, index) => (
                            <Link
                                key={article.id}
                                href={`/redazione/${article.slug}`}
                                style={{ transitionDelay: `${index * 200}ms` }} // Staggered delay logic
                                className={`group cursor-pointer flex flex-col transition-all duration-1000 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                            >
                                {/* Cover Image */}
                                <div className="relative w-full aspect-[16/9] mb-6 overflow-hidden rounded-sm bg-black/5">
                                    {article.cover_image ? (
                                        <Image
                                            src={article.cover_image}
                                            alt={article.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#1a1a1a]/10" />
                                    )}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                                </div>

                                {/* Meta & Title */}
                                <div className="flex flex-col flex-1">
                                    <div className="font-['Fragment_Mono'] text-[9px] uppercase tracking-[0.2em] text-[var(--ember)] mb-3 opacity-80">
                                        {article.published_at ? formatDate(article.published_at) : ''}
                                    </div>
                                    <h3 className="text-2xl md:text-3xl leading-snug mb-4 group-hover:text-[var(--gold)] transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="font-['Fragment_Mono'] text-[11px] leading-relaxed opacity-70 mb-8 flex-1">
                                        {article.excerpt}
                                    </p>

                                    {/* Author footer */}
                                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-black/5">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center border border-black/10 bg-black/5 text-black/40">
                                            <span className="font-serif italic text-lg">{article.author?.display_name?.charAt(0) || 'R'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-['Fragment_Mono'] text-[8px] uppercase tracking-widest opacity-50 mb-1">
                                                Scritto da
                                            </span>
                                            <span className="text-lg leading-none">
                                                {article.author?.display_name || 'Redazione'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

