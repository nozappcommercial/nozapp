"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { reorderPillars, type PillarFilm } from '@/lib/actions/profile_actions';

/**
 * PROFILE PILLARS
 * ───────────────
 * 3×2 grid of pillar film cards with dual interaction modes:
 * - Tap-to-swap (mobile-first): select → select target → animate swap
 * - Drag & drop (desktop): HTML5 native DnD with FLIP animation
 *
 * Both interactions trigger a FLIP (First, Last, Invert, Play) animation
 * for smooth visual transitions when cards change positions.
 */

interface ProfilePillarsProps {
    pillars: PillarFilm[];
    onReorder: (pillars: PillarFilm[]) => void;
}

export default function ProfilePillars({ pillars: initialPillars, onReorder }: ProfilePillarsProps) {
    const [pillars, setPillars] = useState<PillarFilm[]>(initialPillars);
    const [tapSelected, setTapSelected] = useState<number | null>(null);
    const [dragSrcIdx, setDragSrcIdx] = useState<number | null>(null);
    const [dragTgtIdx, setDragTgtIdx] = useState<number | null>(null);
    const [isSwapping, setIsSwapping] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const isDragClickRef = useRef(false);
    const gridRef = useRef<HTMLDivElement>(null);
    const cardRefsMap = useRef<Map<number, HTMLDivElement>>(new Map());
    const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync with parent if pillars change externally
    useEffect(() => {
        setPillars(initialPillars);
    }, [initialPillars]);

    // ─── FLASH FEEDBACK ──────────────────────────────────────────
    const triggerSaveFlash = useCallback(() => {
        setShowFlash(true);
        if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
        flashTimerRef.current = setTimeout(() => setShowFlash(false), 2400);
    }, []);

    // ─── FLIP ANIMATION + SWAP ───────────────────────────────────
    const swapCards = useCallback((a: number, b: number) => {
        if (isSwapping || a === b) return;
        setIsSwapping(true);

        // FLIP Phase 1: Snapshot current positions
        const snapshots = new Map<number, DOMRect>();
        cardRefsMap.current.forEach((el, filmId) => {
            snapshots.set(filmId, el.getBoundingClientRect());
        });

        // Phase 2: Mutate data
        const newPillars = [...pillars];
        [newPillars[a], newPillars[b]] = [newPillars[b], newPillars[a]];
        setPillars(newPillars);
        setTapSelected(null);
        setDragSrcIdx(null);
        setDragTgtIdx(null);

        // Notify parent immediately (optimistic)
        onReorder(newPillars);

        // Save to backend in background
        reorderPillars(newPillars.map(p => p.id)).catch(err =>
            console.error('[ProfilePillars] Save failed:', err)
        );

        // FLIP Phase 3-5: After React re-render, animate from old to new position
        requestAnimationFrame(() => {
            cardRefsMap.current.forEach((el, filmId) => {
                const oldRect = snapshots.get(filmId);
                if (!oldRect) return;
                const newRect = el.getBoundingClientRect();
                const dx = oldRect.left - newRect.left;
                const dy = oldRect.top - newRect.top;
                if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

                // Invert: place at old position instantly
                el.style.transition = 'none';
                el.style.transform = `translate(${dx}px, ${dy}px)`;

                // Play: animate to new (zero) position
                requestAnimationFrame(() => {
                    el.style.transition = 'transform 0.42s cubic-bezier(0.34, 1.28, 0.64, 1)';
                    el.style.transform = '';
                    el.addEventListener('transitionend', function handler() {
                        el.style.transition = '';
                        el.removeEventListener('transitionend', handler);
                        setIsSwapping(false);
                    }, { once: true });
                });
            });

            triggerSaveFlash();
        });
    }, [pillars, isSwapping, onReorder, triggerSaveFlash]);

    // ─── TAP HANDLER ─────────────────────────────────────────────
    const handleTap = useCallback((idx: number) => {
        if (isSwapping || isDragClickRef.current) return;
        if (tapSelected === null) {
            setTapSelected(idx);
        } else if (tapSelected === idx) {
            setTapSelected(null);
        } else {
            swapCards(tapSelected, idx);
        }
    }, [isSwapping, tapSelected, swapCards]);

    // ─── DRAG HANDLERS ───────────────────────────────────────────
    const handleDragStart = useCallback((e: React.DragEvent, idx: number) => {
        if (isSwapping) { e.preventDefault(); return; }
        setDragSrcIdx(idx);
        isDragClickRef.current = false;
        e.dataTransfer.effectAllowed = 'move';
        // Defer the visual change so the drag image captures correctly
        setTimeout(() => {
            const el = cardRefsMap.current.get(pillars[idx].id);
            if (el) el.classList.add('drag-src');
        }, 0);
    }, [isSwapping, pillars]);

    const handleDragEnd = useCallback((idx: number) => {
        const el = cardRefsMap.current.get(pillars[idx]?.id);
        if (el) el.classList.remove('drag-src');
        setDragSrcIdx(null);
        setDragTgtIdx(null);
        // Suppress click event after drag
        isDragClickRef.current = true;
        setTimeout(() => { isDragClickRef.current = false; }, 80);
    }, [pillars]);

    const handleDragEnter = useCallback((e: React.DragEvent, idx: number) => {
        e.preventDefault();
        if (dragSrcIdx !== null && dragSrcIdx !== idx) {
            setDragTgtIdx(idx);
        }
    }, [dragSrcIdx]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, idx: number) => {
        e.preventDefault();
        isDragClickRef.current = true;
        if (dragSrcIdx === null || dragSrcIdx === idx) return;
        swapCards(dragSrcIdx, idx);
    }, [dragSrcIdx, swapCards]);

    // ─── CARD REF SETTER ─────────────────────────────────────────
    const setCardRef = useCallback((filmId: number) => (el: HTMLDivElement | null) => {
        if (el) cardRefsMap.current.set(filmId, el);
        else cardRefsMap.current.delete(filmId);
    }, []);

    // ─── RENDER ──────────────────────────────────────────────────
    return (
        <>
            <div className="prf-pillars-grid" ref={gridRef}>
                {pillars.map((film, i) => {
                    const isTapSel = tapSelected === i;
                    const isTapTgt = tapSelected !== null && tapSelected !== i;
                    const isDragTgt = dragTgtIdx === i && dragSrcIdx !== i;

                    const overlayText = isTapSel
                        ? '✕ annulla'
                        : isTapTgt ? 'scambia qui →' : 'seleziona';

                    let cardClass = 'prf-pillar-card';
                    if (isTapSel) cardClass += ' tap-selected';
                    else if (isTapTgt) cardClass += ' tap-target';
                    if (isDragTgt) cardClass += ' drag-tgt';

                    return (
                        <div
                            key={film.id}
                            ref={setCardRef(film.id)}
                            className={cardClass}
                            draggable
                            onClick={() => handleTap(i)}
                            onDragStart={(e) => handleDragStart(e, i)}
                            onDragEnd={() => handleDragEnd(i)}
                            onDragEnter={(e) => handleDragEnter(e, i)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, i)}
                        >
                            <div className={`prf-pillar-rank ${i === 0 ? 'vertex' : ''}`}>
                                {i === 0 ? '▲ vertice' : `n° ${i + 1}`}
                            </div>
                            <div className="prf-pillar-poster">
                                <div
                                    className="prf-pillar-poster-bg"
                                    style={{
                                        background: film.poster_url
                                            ? `url(${film.poster_url}) center/cover`
                                            : `linear-gradient(155deg, #0d1b35 0%, #1a3a6b 55%, #0d1b35 100%)`
                                    }}
                                >
                                    {!film.poster_url && (
                                        <span className="prf-pillar-poster-title">{film.title}</span>
                                    )}
                                </div>
                                <div className="prf-pillar-overlay">{overlayText}</div>
                            </div>
                            <div className="prf-pillar-name">{film.title}</div>
                            <div className="prf-pillar-meta">{film.director} · {film.year}</div>
                        </div>
                    );
                })}
            </div>

            {/* Save flash feedback */}
            <div className="prf-save-flash">
                <div className={`prf-save-flash-inner ${showFlash ? 'visible' : ''}`}>
                    <div className="prf-save-dot" />
                    ordine salvato
                </div>
            </div>
        </>
    );
}
