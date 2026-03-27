"use client";
import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface CarouselMovie {
    id: number;
    title: string;
    director: string;
    year: number;
    themes: string[];
    poster?: string;
}

interface NowShowingCarouselProps {
    movies: CarouselMovie[];
}

export default function NowShowingCarousel({ movies = [] }: NowShowingCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Assign refs to each card
    const setCardRef = useCallback((el: HTMLDivElement | null, index: number) => {
        cardsRef.current[index] = el;
    }, []);

    // ─── Autoscroll ────────────────────────────────────────────
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || movies.length === 0) return;

        let animationId: number;
        let isHovering = false;
        let scrollPos = el.scrollLeft;

        const scrollStep = () => {
            if (!isHovering && el) {
                scrollPos += 0.5;

                // Infinite loop logic: the content is duplicated 3 times.
                // When we scroll past the first 1/3, we instantly jump back to 0.
                const oneThirdWidth = el.scrollWidth / 3;

                if (scrollPos >= oneThirdWidth) {
                    scrollPos -= oneThirdWidth;
                }

                el.scrollLeft = scrollPos;
            }
            animationId = requestAnimationFrame(scrollStep);
        };

        animationId = requestAnimationFrame(scrollStep);

        const handleMouseEnter = () => { isHovering = true; };
        const handleMouseLeave = () => {
            isHovering = false;
            if (el) scrollPos = el.scrollLeft;
        };

        const handleTouchStart = () => { isHovering = true; };
        const handleTouchEnd = () => {
            isHovering = false;
            if (el) scrollPos = el.scrollLeft;
        };

        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        el.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            cancelAnimationFrame(animationId);
            el.removeEventListener("mouseenter", handleMouseEnter);
            el.removeEventListener("mouseleave", handleMouseLeave);
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchend", handleTouchEnd);
        };
    }, [movies]);

    // ─── Intersection Observer for entry/exit animations ──────
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || movies.length === 0) return;

        // Apply initial "off-screen" state to all cards
        cardsRef.current.forEach((card) => {
            if (card) {
                card.style.opacity = "0";
                card.style.transform = "translateY(20px) scale(0.95)";
                card.style.filter = "blur(3px)";
            }
        });

        // Generate 40 fine-grained thresholds for ultra-smooth interpolation
        const thresholds = Array.from({ length: 41 }, (_, i) => i / 40);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const card = entry.target as HTMLElement;
                    const ratio = entry.intersectionRatio;

                    // Use an easeOutQuad curve for more natural feel
                    const easeOut = (t: number) => t * (2 - t);

                    if (ratio > 0.05) {
                        // Smoothly interpolate across full visibility range
                        const raw = Math.min(1, (ratio - 0.05) / 0.45); // 0→1 as ratio 0.05→0.50
                        const progress = easeOut(raw);

                        const translateY = 20 * (1 - progress);
                        const scale = 0.95 + 0.05 * progress;
                        const opacity = Math.min(1, progress * 1.2);
                        const blur = 3 * (1 - progress);

                        card.style.opacity = String(opacity);
                        card.style.transform = `translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(4)})`;
                        card.style.filter = blur < 0.1 ? 'none' : `blur(${blur.toFixed(2)}px)`;
                    } else {
                        // Fully exited
                        card.style.opacity = "0";
                        card.style.transform = "translateY(20px) scale(0.95)";
                        card.style.filter = "blur(3px)";
                    }
                });
            },
            {
                root: el,
                threshold: thresholds,
            }
        );

        cardsRef.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => {
            observer.disconnect();
        };
    }, [movies]);

    return (
        <section id="cinema" className="bg-[var(--bg)] text-[var(--text)] w-full py-20 px-8 md:px-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 flex items-end justify-between border-b border-black/5 pb-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-light mb-2">Ora al <em className="text-[var(--gold)] italic">Cinema</em></h2>
                        <p className="font-['Fragment_Mono'] text-[9px] tracking-widest uppercase opacity-60">
                            Proiezioni in sala · Uscite recenti
                        </p>
                    </div>
                </header>

                {movies.length === 0 ? (
                    <div className="py-24 bg-white/40 rounded-[40px] border border-dashed border-black/10 flex flex-col items-center justify-center text-center px-8">
                        <Clapperboard size={48} className="text-black/10 mb-6" strokeWidth={1} />
                        <p className="text-xl md:text-2xl font-light italic opacity-40 max-w-md leading-relaxed">
                            Programmazione in aggiornamento. <br />
                            Torna presto per scoprire le nuove proiezioni selezionate.
                        </p>
                        <div className="font-['Fragment_Mono'] text-[8px] uppercase tracking-[0.3em] opacity-20 mt-8">
                            Curated Selection
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full overflow-hidden">
                        {/* Fade edges for smooth visual entry/exit */}
                        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10"
                            style={{ background: 'linear-gradient(to right, var(--surface), transparent)' }} />
                        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10"
                            style={{ background: 'linear-gradient(to left, var(--surface), transparent)' }} />

                        <div
                            ref={scrollRef}
                            className="flex overflow-x-auto gap-6 pb-10 pt-4 px-8"
                            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                        >
                            {[...movies, ...movies, ...movies].map((movie, idx) => (
                                <div
                                    key={`${movie.id}-${idx}`}
                                    ref={(el) => setCardRef(el, idx)}
                                    className="flex-shrink-0 w-[140px] md:w-[170px] group cursor-pointer"
                                    style={{
                                        transition: 'opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), filter 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                                        willChange: 'opacity, transform, filter'
                                    }}
                                >
                                    {/* Poster Image */}
                                    <div
                                        className="relative w-full aspect-[2/3] mb-4 overflow-hidden rounded shadow-[0_4px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[0_16px_32px_rgba(0,0,0,0.18)] border border-black/5 bg-black/5 transition-all duration-500"
                                        style={{ transition: 'box-shadow 0.5s ease' }}
                                    >
                                        {movie.poster && (
                                            <Image
                                                src={movie.poster}
                                                alt={movie.title}
                                                fill
                                                sizes="(max-width: 768px) 140px, 170px"
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50 group-hover:opacity-90 transition-opacity duration-400" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-col">
                                        <h3 className="text-base leading-tight mb-1.5 group-hover:text-[var(--gold)] transition-colors duration-300">
                                            {movie.title}
                                        </h3>
                                        <div className="font-['Fragment_Mono'] text-[9px] tracking-wider text-[var(--ember)] opacity-80 mb-2">
                                            {movie.director} <span className="text-[var(--text)] opacity-40 ml-1">· {movie.year}</span>
                                        </div>

                                        {/* Themes tags */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {movie.themes.slice(0, 2).map((theme, i) => (
                                                <span key={i} className="font-['Fragment_Mono'] text-[7px] uppercase tracking-widest px-1.5 py-0.5 border border-[var(--cold-dim)] text-[var(--cold)] bg-[#3b8b9e08]">
                                                    {theme}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

const Clapperboard = ({ size, className, strokeWidth }: { size: number, className?: string, strokeWidth?: number }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={strokeWidth || 1.5} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path d="m4 11 16-3" />
        <path d="m7 10 1-2" />
        <path d="m11 9 1-2" />
        <path d="m15 8 1-2" />
        <path d="m19 7 1-2" />
        <path d="M20 11V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4" />
    </svg>
);
