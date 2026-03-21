"use client";
import React, { useRef, useCallback } from 'react';
import { type LovedFilm } from '@/lib/actions/profile_actions';

/**
 * PROFILE LOVED FILMS — TICKET CAROUSEL
 * ──────────────────────────────────────
 * Horizontal scrolling carousel of miniature cinema tickets.
 * Each ticket shows a film poster, tear line with punch-out notches,
 * title, director, year, and a heart icon.
 *
 * Features:
 * - Scroll snap for touch devices
 * - Drag-to-scroll for desktop (mouse events)
 * - Fade-edge pseudo-elements (CSS)
 * - Hidden if no films
 */

interface ProfileLovedFilmsProps {
    films: LovedFilm[];
}

export default function ProfileLovedFilms({ films }: ProfileLovedFilmsProps) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);

    // Don't render anything if no loved films
    if (films.length === 0) return null;

    // ─── DRAG-TO-SCROLL (desktop) ────────────────────────────────
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        const el = carouselRef.current;
        if (!el) return;
        isDraggingRef.current = true;
        startXRef.current = e.pageX - el.offsetLeft;
        scrollLeftRef.current = el.scrollLeft;
        el.style.cursor = 'grabbing';
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDraggingRef.current) return;
        e.preventDefault();
        const el = carouselRef.current;
        if (!el) return;
        const x = e.pageX - el.offsetLeft;
        el.scrollLeft = scrollLeftRef.current - (x - startXRef.current);
    }, []);

    const handleMouseUp = useCallback(() => {
        isDraggingRef.current = false;
        if (carouselRef.current) carouselRef.current.style.cursor = 'grab';
    }, []);

    return (
        <>
            <div className="prf-section prf-anim-4">
                <div className="prf-section-label">Altri film amati</div>
            </div>
            <div className="prf-loved-wrap prf-anim-4">
                <div
                    ref={carouselRef}
                    className="prf-loved-carousel"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {films.map(film => (
                        <div key={film.id} className="prf-ticket">
                            {/* Poster strip */}
                            <div className="prf-ticket-poster">
                                <div
                                    className="prf-ticket-poster-bg"
                                    style={{
                                        background: film.poster_url
                                            ? `url(${film.poster_url}) center/cover`
                                            : `linear-gradient(155deg, #1a0a2a 0%, #3a1055 100%)`
                                    }}
                                />
                                <div className="prf-ticket-poster-overlay" />
                            </div>

                            {/* Tear line with punch-out notches */}
                            <div className="prf-ticket-tear">
                                <div className="prf-ticket-dash" />
                            </div>

                            {/* Body */}
                            <div className="prf-ticket-body">
                                <div className="prf-ticket-title">{film.title}</div>
                                <div className="prf-ticket-meta">{film.director}</div>
                                <div className="prf-ticket-footer">
                                    <div className="prf-ticket-year">{film.year}</div>
                                    <div className="prf-ticket-heart">♥</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
